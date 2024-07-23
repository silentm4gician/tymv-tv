export const dynamic = 'force-dynamic';
export const revalidate = 0;

let matches = [];

try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`, {
    cache: 'no-cache',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch matches');
  }

  matches = await res.json();
} catch (error) {
  console.error('Error fetching matches:', error.message);
}

export default matches