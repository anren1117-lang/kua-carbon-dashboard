// POST /api/alerts/unsubscribe-via-token
//
// Body: { token }
// Returns 200 { ok: true, email } on a valid token, 400 on bad
// token. Always idempotent — unsubscribing an already-removed email
// also returns 200.
//
// This is the endpoint behind the one-click "Unsubscribe" link in
// alert emails. Tokens are HMAC-signed by signUnsubscribeToken
// (src/utils/unsubscribeToken.js) and don't expire — old archived
// emails should still let the recipient opt out.

import { verifyUnsubscribeToken } from '../../src/utils/unsubscribeToken.js';
import { removeSubscriber } from '../../src/storage/alertSubscribers.js';
import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';

const limiter = createRateLimit({ capacity: 10, refillPerSec: 10 / 60 });

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

  const v = verifyUnsubscribeToken(body?.token);
  if (!v.valid) {
    return res.status(400).json({ error: v.reason });
  }

  await removeSubscriber(v.email);
  return res.status(200).json({ ok: true, email: v.email });
}
