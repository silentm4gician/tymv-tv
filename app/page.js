import MatchCard from "@/components/MatchCard";
import { getMatches } from "./api/request";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-10 mt-10">
      <section>
        <h4 className="text-center text-xl mb-3 border-b rounded font-semibold">LISTA DE EVENTOS</h4>
        {getMatches()
          .then((matches) => matches.map((match) => <MatchCard key={match.id} match={match} />))}
      </section>
      <h1 className="text-2xl font-semibold px-16 py-4 bg-zinc-900 rounded-md mt-3 italic">
        TOCO Y ME VOY <span className="text-red-500 font-bold">TV</span>
      </h1>
    </main>
  );
}
