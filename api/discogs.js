export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const path = req.query.path;
  if (!path) { res.status(400).json({ error: 'Missing path' }); return; }

  const token = process.env.DISCOGS_TOKEN;
  if (!token) { res.status(500).json({ error: 'DISCOGS_TOKEN not configured' }); return; }

  try {
    const decodedPath = decodeURIComponent(path);
    const sep = decodedPath.includes('?') ? '&' : '?';
    const url = `https://api.discogs.com${decodedPath}${sep}token=${token}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'CollectorsRabbitHole/1.0' } });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
