// api/visit.js — Vercel Serverless Function
// Increments visitor count in Upstash Redis with daily deduplication.

/**
 * Execute a Redis command via Upstash REST API.
 * @param {...string} args - Redis command and its arguments.
 */
async function redis(...args) {
  const KV_REST_API_URL = process.env.UPSTASH_REDIS_REST_URL;
  const KV_REST_API_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  const response = await fetch(`${KV_REST_API_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    throw new Error(`Redis error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}

export default async function handler(req, res) {
  // Only allow POST to prevent crawlers/prefetch from inflating the count
  // Trigger Vercel Rebuild with env vars
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // CORS headers for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  const visitorId = req.headers['x-visitor-id'];
  const KV_REST_API_URL = process.env.UPSTASH_REDIS_REST_URL;
  const KV_REST_API_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!visitorId || !KV_REST_API_URL || !KV_REST_API_TOKEN) {
    return res.status(400).json({ error: 'Missing required data', count: null });
  }

  try {
    // Key for today's set of unique visitors (auto-expires in 25 hours)
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const dailySetKey = `visitors:${today}`;

    // SADD returns 1 if the member is new, 0 if it already existed
    const isNew = await redis('SADD', dailySetKey, visitorId);

    if (isNew === 1) {
      // Set expiry on the daily set so it auto-cleans after 25 hours
      await redis('EXPIRE', dailySetKey, 90000);
      // New unique visitor — increment the all-time counter
      const newCount = await redis('INCR', 'visitor_count');
      return res.status(200).json({ count: newCount, isNew: true });
    } else {
      // Returning visitor — just fetch the current count
      const currentCount = await redis('GET', 'visitor_count');
      return res.status(200).json({ count: parseInt(currentCount, 10) || 0, isNew: false });
    }
  } catch (err) {
    console.error('[visit] Redis error:', err.message);
    // Graceful fallback — never crash the app
    return res.status(200).json({ count: null, isNew: false });
  }
}
