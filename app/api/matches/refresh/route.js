import { refreshCache } from "../../request";

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    console.log('Force refreshing cache...');
    const matches = await refreshCache();
    
    return new Response(JSON.stringify({ 
      message: 'Cache refreshed successfully',
      matchesCount: matches.length,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error refreshing cache:', error);
    return new Response(JSON.stringify({ error: 'Failed to refresh cache' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
