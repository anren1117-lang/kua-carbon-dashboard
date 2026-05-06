// HMAC-signed admin tokens.
//
// Used by /api/admin/login (signs) and /api/admin/* (verifies). The
// token is a base64url-encoded JSON payload + an HMAC-SHA256 signature
// over the payload using ADMIN_TOKEN_SECRET. The client stores it in
// localStorage and sends it back as Authorization: Bearer <token> on
// every admin request.
//
// This is intentionally simpler than full JWT — we don't need
// algorithm negotiation, custom claim namespaces, or revocation lists
// for an admin-only password gate. If admin auth ever needs more
// (e.g. role-based permissions, refresh tokens), this is the place to
// upgrade to a proper JWT lib.
//
// Security:
// - HMAC-SHA256 with a 32+ byte server-side secret.
// - Payload includes exp (Unix seconds) and is rejected past expiry.
// - timingSafeEqual prevents per-byte signature side-channels.

import crypto from 'node:crypto';

const ALGO = 'sha256';
const DEFAULT_TTL_SECONDS = 8 * 3600; // 8h — typical admin work session

function readSecret() {
  const s = process.env.ADMIN_TOKEN_SECRET;
  if (!s || s.length < 32) {
    throw new Error('ADMIN_TOKEN_SECRET must be set to a 32+ character random string');
  }
  return s;
}

function b64urlEncode(buf) {
  return Buffer.from(buf).toString('base64url');
}
function b64urlDecode(str) {
  return Buffer.from(str, 'base64url');
}

/**
 * Sign an admin token. Payload is { iat, exp, role: 'admin' }.
 * @param {{ ttlSeconds?: number }} [opts]
 * @returns {{ token: string, expiresAt: string }}
 */
export function signAdminToken(opts = {}) {
  const secret = readSecret();
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now,
    exp: now + (opts.ttlSeconds || DEFAULT_TTL_SECONDS),
    role: 'admin',
  };
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const sig = crypto.createHmac(ALGO, secret).update(payloadB64).digest();
  const sigB64 = b64urlEncode(sig);
  return {
    token: `${payloadB64}.${sigB64}`,
    expiresAt: new Date(payload.exp * 1000).toISOString(),
  };
}

/**
 * Verify an admin token. Returns { valid: true, payload } on success.
 * @param {string|undefined|null} token
 * @returns {{ valid: true, payload: object } | { valid: false, reason: string }}
 */
export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'missing token' };
  }
  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'malformed token' };
  }
  const [payloadB64, sigB64] = parts;
  let secret;
  try { secret = readSecret(); }
  catch (err) { return { valid: false, reason: err.message }; }

  const expectedSig = crypto.createHmac(ALGO, secret).update(payloadB64).digest();
  let providedSig;
  try { providedSig = b64urlDecode(sigB64); }
  catch { return { valid: false, reason: 'malformed signature' }; }
  if (providedSig.length !== expectedSig.length) {
    return { valid: false, reason: 'signature length mismatch' };
  }
  if (!crypto.timingSafeEqual(providedSig, expectedSig)) {
    return { valid: false, reason: 'signature mismatch' };
  }

  let payload;
  try { payload = JSON.parse(b64urlDecode(payloadB64).toString('utf8')); }
  catch { return { valid: false, reason: 'malformed payload' }; }
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp < now) {
    return { valid: false, reason: 'expired' };
  }
  if (payload.role !== 'admin') {
    return { valid: false, reason: 'wrong role' };
  }
  return { valid: true, payload };
}

/**
 * Express/Vercel-style helper: pulls the bearer token from
 * Authorization header, verifies, and returns the payload (or null).
 */
export function verifyAdminRequest(req) {
  const auth = (req?.headers?.authorization || req?.headers?.Authorization || '').trim();
  if (!auth.toLowerCase().startsWith('bearer ')) return { valid: false, reason: 'missing bearer' };
  const token = auth.slice(7).trim();
  return verifyAdminToken(token);
}
