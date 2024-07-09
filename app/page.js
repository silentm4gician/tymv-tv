"use client"
import MatchCard from "@/components/MatchCard";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`, {cache:'no-cache'}, { next: { revalidate: 3600 } });

  if (!res.ok) {
    console.error('Failed to fetch matches:', res.statusText);
    return (
      <main className="flex flex-col items-center p-10 mt-10">
        <section>
          <h4 className="text-center text-xl mb-3 border-b rounded font-semibold">LISTA DE EVENTOS</h4>
          <p>Error fetching matches</p>
        </section>
        <h1 className="text-2xl font-semibold px-16 py-4 bg-zinc-900 rounded-md mt-3 italic">
          TOCO Y ME VOY <span className="text-red-500 font-bold">TV</span>
        </h1>
      </main>
    );
  }

  const matches = await res.json();

  return (
    <main className="flex flex-col items-center p-10 mt-10">
      <section>
        <h4 className="text-center text-xl mb-3 border-b rounded font-semibold">LISTA DE EVENTOS</h4>
        {matches.length > 0 ? (
          matches.map((match) => <MatchCard key={match.id} match={match} />)
        ) : (
          <p>Todavia no hay eventos</p>
        )}
      </section>
      <h1 className="text-2xl font-semibold px-16 py-4 bg-zinc-900 rounded-md mt-3 italic">
        TOCO Y ME VOY <span className="text-red-500 font-bold">TV</span>
      </h1>
    </main>
  );
}
