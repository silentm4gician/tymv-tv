import Link from "next/link";
import { useState } from "react";

function extractSrcValue(inputString) {
  const regex = /src="([^"]*)"/;
  const match = inputString.match(regex);
  return match ? match[1] : null;
}

const MatchCard = ({ match }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(null);

  const handleClick = async (e) => {
    if (match.hasDetails && !details) {
      e.preventDefault();
      setIsLoading(true);
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/${match.id}`);
        if (response.ok) {
          const matchDetails = await response.json();
          setDetails(matchDetails);
          
          // Navigate after getting details
          const link = extractSrcValue(matchDetails.iframe);
          if (link) {
            window.location.href = `/player/${match.title}?data=${encodeURIComponent(JSON.stringify(link))}`;
          }
        }
      } catch (error) {
        console.error('Error fetching match details:', error);
        // Fallback to original behavior
        const link = match.url ? `https://pelotalibres.net${match.url}` : null;
        if (link) {
          window.location.href = `/player/${match.title}?data=${encodeURIComponent(JSON.stringify(link))}`;
        }
      } finally {
        setIsLoading(false);
      }
    } else if (details) {
      // Use cached details
      const link = extractSrcValue(details.iframe);
      if (link) {
        // Navigate with cached link
      }
    }
  };

  const link = details ? extractSrcValue(details.iframe) : (match.url ? `https://pelotalibres.net${match.url}` : null);

  return (
    <ul>
      <Link 
        href={{ pathname: `/player/${match.title}`, query: { data: JSON.stringify(link) } }}
        onClick={handleClick}
      >
        <li className="hover:bg-red-700 rounded p-3 mb-2 bg-zinc-900 font-semibold border border-x-red-500 flex items-center justify-between">
          <span>{match.title}</span>
          {isLoading && (
            <span className="text-xs text-gray-400">Loading...</span>
          )}
          {match.hasDetails && !details && (
            <span className="text-xs text-green-400">HD</span>
          )}
        </li>
      </Link>
    </ul>
  )
}

export default MatchCard