'use client'

import { useEffect, useState } from 'react';
import MatchCard from "@/components/MatchCard";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMatches = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
        // Call refresh endpoint
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/refresh`, { method: 'POST' });
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`);
      if (!res.ok) {
        throw new Error(`Failed to fetch matches: ${res.status}`);
      }
      const data = await res.json();
      setMatches(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (error) {
      console.error('Error fetching matches:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleRefresh = () => {
    fetchMatches(true);
  };

  return (
    <main className="flex flex-col items-center p-10 mt-10">
      <section className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold">LISTA DE EVENTOS</h4>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-xs text-gray-400">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded transition-colors"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-100">
            <p>Error: {error}</p>
            <button 
              onClick={() => fetchMatches()}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}
        
        {isLoading ? (
          <LoadingScreen />
        ) : matches.length > 0 ? (
          <div className="space-y-2">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No events available</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Check for updates
            </button>
          </div>
        )}
      </section>
      
      <h1 className="text-2xl font-semibold px-16 py-4 bg-zinc-900 rounded-md mt-8 italic">
        TOCO Y ME VOY <span className="text-red-500 font-bold">TV</span>
      </h1>
    </main>
  );
}

