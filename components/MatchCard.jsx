import Link from "next/link";

function extractSrcValue(inputString) {
  const regex = /src="([^"]*)"/;
  const match = inputString.match(regex);
  return match ? match[1] : null;
}

const MatchCard = ({ match }) => {
  const link = extractSrcValue(match.iframe)
  return (
    <ul>
      <Link href={{ pathname: `/player/${match.title}`, query: { data: JSON.stringify(link) } }}>
        <li className="hover:bg-red-700 rounded p-3 mb-2 bg-zinc-900 font-semibold border border-x-red-500">
          {match.title}
        </li>
      </Link>
    </ul>
  )
}

export default MatchCard