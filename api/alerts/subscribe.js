// POST /api/alerts/subscribe
//
// Body: { email }
// Returns 200 { ok: true, email } on success (or already-subscribed),
// 400 on validation failure, 429 on rate limit.
//
// Intentionally public — anyone with the URL can sign up an email. We
// rely on:
//   1. The email being validated server-side (isLikelyEmail)
//   2. Rate limit per IP so the form can't be spammed
//   3. The admin-only `listSubscribers` view, so the school can see
//      who's subscribed and remove abuse manually if needed
// A confirmation-link flow (double-opt-in) would be the right next
// step for production use; out of scope for this first cut.

import { addSubscriber } from '../../src/storage/alertSubscribers.js';
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
  const result = await addSubscriber(email);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(200).json({ ok: true, email: result.email });
}
