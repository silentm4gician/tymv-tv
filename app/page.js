import MatchCard from "@/components/MatchCard";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let matches = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch matches');
    }

    matches = await res.json();
  } catch (error) {
    console.error('Error fetching matches:', error.message);
  }

  return (
    <main className="flex flex-col items-center p-10 mt-10">
      <section>
        <h4 className="text-center text-xl mb-3 border-b rounded font-semibold">LISTA DE EVENTOS</h4>
        {/* {matches.length > 0 ? (
          matches?.map((match) => <MatchCard key={match.id} match={match} />)
        ) : (
          <p>Todavía no hay eventos</p>
        )} */}
        {matches?.map((match) => <MatchCard key={match.id} match={match} />)}
      </section>
      <h1 className="text-2xl font-semibold px-16 py-4 bg-zinc-900 rounded-md mt-3 italic">
        TOCO Y ME VOY <span className="text-red-500 font-bold">TV</span>
      </h1>
    </main>
  );
}
