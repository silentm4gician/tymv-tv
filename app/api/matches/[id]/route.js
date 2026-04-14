import { getMatchDetailsById } from "../../request";

export const dynamic = 'force-dynamic'
export const revalidate = 300 // Cache for 5 minutes

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid match ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const matchDetails = await getMatchDetailsById(parseInt(id));
    
    if (!matchDetails) {
      return new Response(JSON.stringify({ error: 'Match not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify(matchDetails), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error('Error fetching match details:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch match details' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
