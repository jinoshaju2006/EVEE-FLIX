export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN;
  if (!token) return res.status(503).json({ error: 'TMDB API is not configured' });

  const { action = 'popular', q = '', id = '', type = 'movie' } = req.query || {};
  let path;
  const params = new URLSearchParams({ language: 'en-US', region: 'IN' });

  if (action === 'popular') {
    path = '/3/trending/all/week';
  } else if (action === 'search') {
    if (!q || String(q).length > 100) return res.status(400).json({ error: 'A valid search query is required' });
    path = '/3/search/multi';
    params.set('query', String(q));
    params.set('include_adult', 'false');
  } else if (action === 'providers') {
    if (!/^\d+$/.test(String(id)) || !['movie', 'tv'].includes(String(type))) return res.status(400).json({ error: 'Invalid title reference' });
    path = `/3/${type}/${id}/watch/providers`;
  } else {
    return res.status(400).json({ error: 'Unsupported action' });
  }

  try {
    const response = await fetch(`https://api.themoviedb.org${path}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.status_message || 'Catalogue request failed' });
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: 'Unable to reach the catalogue service' });
  }
}
