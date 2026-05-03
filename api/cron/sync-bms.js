// POST/GET /api/cron/sync-bms
//
// Pulls the most recent hour of readings from whichever meter adapter is
// active (mock for dev, BmsMeterAdapter when METER_SOURCE=bms is wired
// to a relay) and persists them to Supabase via the readings store. The
// in-memory CSV-style store is intentionally NOT used here — that one
// is for ad-hoc CSV uploads. This endpoint is for the regular trickle.
//
// Auth: requires a `CRON_SECRET` env var to match either:
//   - The Authorization header value (Vercel sends "Bearer <secret>")
//   - The x-vercel-cron header (Vercel sets this for built-in crons)
// If neither matches, returns 401. This protects the endpoint from
// being run by random requests.
//
// Wiring on Vercel (Pro plan):
//   vercel.json:
//     {
//       "crons": [
//         { "path": "/api/cron/sync-bms", "schedule": "0 * * * *" }
//       ]
//     }
//   And set CRON_SECRET in Vercel project env.

import { getMeterAdapter } from '../../src/adapters/meter/index.js';
import { insertReadings } from '../../src/storage/readingsStore.js';

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

function isAuthorized(req) {
  const expected = readEnv('CRON_SECRET');
  if (!expected) return false; // Refuse to run unauthenticated.
  const auth = req.headers?.authorization || req.headers?.Authorization;
  if (auth && auth === `Bearer ${expected}`) return true;
  // Vercel built-in crons send a signed header that includes the secret.
  const vercelCron = req.headers?.['x-vercel-cron-secret'];
  if (vercelCron && vercelCron === expected) return true;
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'Unauthorized — set CRON_SECRET and pass it as Bearer token or x-vercel-cron-secret' });
    return;
  }

  try {
    const adapter = getMeterAdapter();
    const end = new Date();
    const start = new Date(end.getTime() - 60 * 60 * 1000); // last 60 minutes
    const readings = await adapter.getReadings({
      start: start.toISOString(),
      end: end.toISOString(),
    });
    if (readings.length === 0) {
      res.status(200).json({ inserted: 0, windowStart: start.toISOString(), windowEnd: end.toISOString(), note: 'No readings returned by adapter' });
      return;
    }
    const result = await insertReadings(readings);
    res.status(200).json({
      inserted: result.inserted,
      windowStart: start.toISOString(),
      windowEnd: end.toISOString(),
      adapterSource: readEnv('METER_SOURCE') || 'mock',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
