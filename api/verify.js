import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: 'https://ethical-clam-19007.upstash.io',
  token: 'AUo_AAIncDIyMDdmZjI4OTdhNDU0NzdiYWExNjcwZmVhODgzNmYyMHAyMTkwMDc',
});

const SALT = "V30_DURATION_SYSTEM_2026";
function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h) + str.charCodeAt(i) | 0;
    return Math.abs(h).toString(36).toUpperCase();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const { key } = req.body;
  if (!key) return res.status(400).json({ error: 'Missing key' });

  try {
    const keyData = await redis.get(key);
    const now = Date.now();
    const duration = 30 * 24 * 60 * 60 * 1000;

    if (keyData) {
      const expiry = parseInt(keyData);
      if (now > expiry) return res.status(403).json({ error: 'Expired' });
      return res.status(200).json({ expiry, status: 'existing' });
    } else {
      const expiry = now + duration;
      await redis.set(key, expiry.toString());
      return res.status(200).json({ expiry, status: 'activated' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Redis Error' });
  }
}