import { getMatches } from "../request";

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Increased from 1 to 60 seconds for better caching

export async function GET() {
  try {
    const matches = await getMatches();
    return new Response(JSON.stringify(matches), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30' // Cache for 30 seconds
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
