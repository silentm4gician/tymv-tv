'use client'

import { useEffect, useState } from 'react';
import MatchCard from "@/components/MatchCard";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`);
        if (!res.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data = await res.json();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <main className="flex flex-col items-center p-10 mt-10">
      <section>
        <h4 className="text-center text-xl mb-3 border-b rounded font-semibold">LISTA DE EVENTOS</h4>
        {isLoading ? (
          <LoadingScreen />
        ) : matches.length > 0 ? (
          matches.map((match) => <MatchCard key={match.id} match={match} />)
        ) : (
          <p>No events available</p>
        )}
      </section>
      <h1 className="text-2xl font-semibold px-16 py-4 bg-zinc-900 rounded-md mt-3 italic">
        TOCO Y ME VOY <span className="text-red-500 font-bold">TV</span>
      </h1>
    </main>
  );
}

