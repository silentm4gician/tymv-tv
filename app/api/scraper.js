import { chromium } from 'playwright';
import { getCache, setCache } from './cache.js';

let browserInstance = null;
let isBrowserStarting = false;

async function getBrowser() {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }

  if (!isBrowserStarting) {
    isBrowserStarting = true;
    try {
      browserInstance = await chromium.launch({ 
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });
    } finally {
      isBrowserStarting = false;
    }
  }

  // Wait for browser to be ready if another request is starting it
  while (isBrowserStarting && !browserInstance) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return browserInstance;
}

async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
}

async function getMatchesOnly() {
  const cacheKey = 'matches-list';
  const cached = getCache(cacheKey);
  
  if (cached) {
    console.log('Returning cached matches list');
    return cached;
  }

  console.log('Scraping matches list...');
  
  return await retryOperation(async () => {
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    try {
      // Block unnecessary resources for faster loading
      await page.route('**/*.{png,jpg,jpeg,gif,svg,css,font,woff,woff2}', route => route.abort());
      
      await page.goto("https://pelotalibres.net", { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await page.waitForSelector('div[id="wraper"]', { timeout: 10000 });
      await page.waitForTimeout(2000); // Reduced from 5000ms
      
      const results = await page.evaluate(() => {
        const matches = [];
        const menuItems = document.querySelectorAll("#menu li.toggle-submenu");
        
        menuItems.forEach((li, index) => {
          try {
            const timeElement = li.querySelector("time[datetime]");
            const time = timeElement ? timeElement.textContent?.trim() : "";
            
            const countryImg = li.querySelector("div:first-child img");
            const country = countryImg ? countryImg.getAttribute("alt") || "" : "";
            
            const titleSpan = li.querySelector("div:first-child span");
            const title = titleSpan ? titleSpan.textContent?.trim() : "";
            
            const streams = [];
            const streamLinks = li.querySelectorAll(".submenu a");
            
            streamLinks.forEach((a) => {
              const streamName = a.querySelector("span")?.textContent?.trim() || "";
              const streamUrl = a.getAttribute("href") || "";
              if (streamName && streamUrl) {
                streams.push({
                  name: streamName,
                  url: streamUrl
                });
              }
            });
            
            if (title && !title.includes("0p")) {
              matches.push({
                id: index,
                title,
                url: streams.length > 0 ? streams[0].url : "",
                time,
                country,
                streams,
                hasDetails: streams.length > 0
              });
            }
          } catch (error) {
            console.log("Error processing menu item:", error);
          }
        });
        
        return matches;
      });
      
      if (!results || results.length === 0) {
        throw new Error('No matches found - possible scraping failure');
      }
      
      setCache(cacheKey, results);
      console.log(`Scraped ${results.length} matches`);
      return results;
      
    } finally {
      await page.close();
    }
  });
}

async function getMatchDetails(matchId) {
  const cacheKey = `match-details-${matchId}`;
  const cached = getCache(cacheKey);
  
  if (cached) {
    console.log(`Returning cached details for match ${matchId}`);
    return cached;
  }

  console.log(`Scraping details for match ${matchId}...`);
  
  // First get the matches list to find the specific match
  const matches = await getMatchesOnly();
  const match = matches.find(m => m.id === parseInt(matchId));
  
  if (!match || !match.streams || match.streams.length === 0) {
    return {
      id: matchId,
      error: 'No streams available for this match'
    };
  }

  return await retryOperation(async () => {
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    try {
      // Block unnecessary resources
      await page.route('**/*.{png,jpg,jpeg,gif,svg,css,font,woff,woff2}', route => route.abort());
      
      const firstStream = match.streams[0];
      const fullUrl = firstStream.url.startsWith("http") ? firstStream.url : `https://pelotalibres.net${firstStream.url}`;
      
      await page.goto(fullUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      const iframeContent = await page.evaluate(() => {
        const iframeSelectors = [
          'div[class*="embed-responsive"] iframe',
          'iframe[src*="stream"]',
          'iframe[src*="player"]',
          'iframe[src*="embed"]',
          "iframe"
        ];
        
        for (const selector of iframeSelectors) {
          const iframeElement = document.querySelector(selector);
          if (iframeElement && iframeElement.src) {
            return iframeElement.outerHTML;
          }
        }
        
        const videoElement = document.querySelector("video");
        if (videoElement) {
          return videoElement.outerHTML;
        }
        
        const scripts = document.querySelectorAll("script");
        for (const script of scripts) {
          const content = script.textContent || "";
          if (content.includes("stream") || content.includes("player") || content.includes("iframe")) {
            return `<script>Found potential stream data in script</script>`;
          }
        }
        
        return "no iframe or video found";
      });
      
      const result = {
        id: matchId,
        title: match.title,
        time: match.time,
        country: match.country,
        streams: match.streams,
        iframe: iframeContent
      };
      
      setCache(cacheKey, result);
      console.log(`Scraped details for match ${matchId}`);
      return result;
      
    } finally {
      await page.close();
    }
  });
}

async function getMultipleMatchDetails(matchIds) {
  console.log(`Fetching details for ${matchIds.length} matches in parallel...`);
  
  const promises = matchIds.map(id => getMatchDetails(id));
  const results = await Promise.allSettled(promises);
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Failed to fetch details for match ${matchIds[index]}:`, result.reason);
      return {
        id: matchIds[index],
        error: 'Failed to fetch match details'
      };
    }
  });
}

export async function closeBrowser() {
  if (browserInstance && browserInstance.isConnected()) {
    await browserInstance.close();
    browserInstance = null;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeBrowser();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeBrowser();
  process.exit(0);
});

export { getMatchesOnly, getMatchDetails, getMultipleMatchDetails };
