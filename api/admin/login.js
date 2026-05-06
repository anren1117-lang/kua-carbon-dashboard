// POST /api/admin/login
//
// Body: { password: string }
// Response (200): { token: string, expiresAt: ISO8601 }
// Response (401): { error: 'invalid password' }
// Response (503): { error: 'admin auth not configured' }
//
// Replaces the prior client-side `KUA2026` literal check inside
// AdminPortal.js. The password is compared with timingSafeEqual against
// process.env.ADMIN_PASSWORD; on success we mint an HMAC-signed token
// (see src/utils/adminToken.js) that the client stores and sends as
// Authorization: Bearer <token> on every admin API call.
//
// Required env:
//   ADMIN_PASSWORD       the secret password admins type into the gate
//   ADMIN_TOKEN_SECRET   32+ random bytes used to sign session tokens
//
// Rate-limited to deter password-guessing attempts.

import crypto from 'node:crypto';
import { signAdminToken } from '../../src/utils/adminToken.js';
import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';

// 6 attempts per 60s per IP. Token-bucket — bursts allowed but sustained
// guessing is throttled.
const limiter = createRateLimit({ capacity: 6, refillPerSec: 0.1 });

function timingSafeStringEqual(a, b) {
  const ab = Buffer.from(String(a || ''), 'utf8');
  const bb = Buffer.from(String(b || ''), 'utf8');
  if (ab.length !== bb.length) {
    // Still run timingSafeEqual on a same-length buffer to keep timing flat.
    const filler = Buffer.alloc(ab.length);
    crypto.timingSafeEqual(ab, filler);
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    res.status(503).json({ error: 'admin auth not configured (ADMIN_PASSWORD missing server-side)' });
    return;
  }

  const key = getClientKey(req);
  const limit = limiter.consume(key);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(Math.ceil(limit.retryAfterMs / 1000)));
    res.status(429).json({ error: 'too many attempts; try again later' });
    return;
  }

  const { password } = req.body || {};
  if (!password || typeof password !== 'string') {
    res.status(400).json({ error: 'password is required' });
    return;
  }

  if (!timingSafeStringEqual(password, expected)) {
    res.status(401).json({ error: 'invalid password' });
    return;
  }

  let signed;
  try {
    signed = signAdminToken();
  } catch (err) {
    res.status(503).json({ error: err.message });
    return;
  }
  res.status(200).json(signed);
}
