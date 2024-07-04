import { getMatches } from "../request";

export async function GET() {
  try {
    const matches = await getMatches();
    return new Response(JSON.stringify(matches), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch matches' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
