import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const MEMORY_CACHE = new Map();
const MEMORY_TTL = 5 * 60 * 1000; // 5 minutes
const PERSISTENT_TTL = 30 * 60 * 1000; // 30 minutes

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

class CacheEntry {
  constructor(data, ttl) {
    this.data = data;
    this.timestamp = Date.now();
    this.ttl = ttl;
  }

  isExpired() {
    return Date.now() - this.timestamp > this.ttl;
  }
}

function getCacheKey(key) {
  return crypto.createHash('md5').update(key).digest('hex');
}

function getMemoryCache(key) {
  const entry = MEMORY_CACHE.get(key);
  if (entry && !entry.isExpired()) {
    return entry.data;
  }
  if (entry && entry.isExpired()) {
    MEMORY_CACHE.delete(key);
  }
  return null;
}

function setMemoryCache(key, data, ttl = MEMORY_TTL) {
  MEMORY_CACHE.set(key, new CacheEntry(data, ttl));
}

function getPersistentCache(key) {
  try {
    const cacheFile = path.join(CACHE_DIR, `${key}.json`);
    if (!fs.existsSync(cacheFile)) {
      return null;
    }

    const content = fs.readFileSync(cacheFile, 'utf8');
    const entry = JSON.parse(content);
    
    if (Date.now() - entry.timestamp > PERSISTENT_TTL) {
      fs.unlinkSync(cacheFile);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error('Error reading persistent cache:', error);
    return null;
  }
}

function setPersistentCache(key, data) {
  try {
    const cacheFile = path.join(CACHE_DIR, `${key}.json`);
    const entry = {
      data,
      timestamp: Date.now()
    };
    fs.writeFileSync(cacheFile, JSON.stringify(entry, null, 2));
  } catch (error) {
    console.error('Error writing persistent cache:', error);
  }
}

export function getCache(key) {
  const cacheKey = getCacheKey(key);
  
  // Try memory cache first
  let data = getMemoryCache(cacheKey);
  if (data) {
    return data;
  }

  // Try persistent cache
  data = getPersistentCache(cacheKey);
  if (data) {
    // Store in memory cache for faster access
    setMemoryCache(cacheKey, data);
    return data;
  }

  return null;
}

export function setCache(key, data) {
  const cacheKey = getCacheKey(key);
  setMemoryCache(cacheKey, data);
  setPersistentCache(cacheKey, data);
}

export function clearCache() {
  MEMORY_CACHE.clear();
  try {
    const files = fs.readdirSync(CACHE_DIR);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      }
    });
  } catch (error) {
    console.error('Error clearing persistent cache:', error);
  }
}

export function invalidateCache(pattern) {
  // Invalidate memory cache entries matching pattern
  for (const [key] of MEMORY_CACHE) {
    if (key.includes(pattern)) {
      MEMORY_CACHE.delete(key);
    }
  }

  // Invalidate persistent cache entries matching pattern
  try {
    const files = fs.readdirSync(CACHE_DIR);
    files.forEach(file => {
      if (file.includes(pattern) && file.endsWith('.json')) {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      }
    });
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
}
