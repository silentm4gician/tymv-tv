import { getMultipleMatchDetailsByIds } from "../../request";

export const dynamic = 'force-dynamic'
export const revalidate = 300 // Cache for 5 minutes

export async function POST(request) {
  try {
    const body = await request.json();
    const { ids } = body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid or missing IDs array' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Limit batch size to prevent overload
    if (ids.length > 10) {
      return new Response(JSON.stringify({ error: 'Maximum 10 IDs allowed per batch request' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const matchDetails = await getMultipleMatchDetailsByIds(ids);

    return new Response(JSON.stringify(matchDetails), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error('Error fetching batch match details:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch match details' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
