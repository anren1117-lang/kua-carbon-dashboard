// POST /api/alerts/unsubscribe
//
// Body: { email }
// Returns 200 { ok: true } always (so we can't be used to enumerate
// who is / isn't subscribed). Rate-limited the same as subscribe.

import { removeSubscriber } from '../../src/storage/alertSubscribers.js';
import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';

const limiter = createRateLimit({ capacity: 5, refillPerSec: 5 / 60 });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader && res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const limit = limiter.consume(getClientKey(req));
  if (!limit.allowed) {
    if (typeof res.setHeader === 'function') {
      res.setHeader('Retry-After', String(Math.ceil(limit.retryAfterMs / 1000)));
    }
    return res.status(429).json({ error: 'rate_limited', retryAfterMs: limit.retryAfterMs });
  }
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
  catch { return res.status(400).json({ error: 'invalid_json' }); }
  const email = body?.email;
  if (!email) return res.status(400).json({ error: 'email_required' });
  await removeSubscriber(email);
  // Don't leak whether the email existed — always 200.
  return res.status(200).json({ ok: true });
}
