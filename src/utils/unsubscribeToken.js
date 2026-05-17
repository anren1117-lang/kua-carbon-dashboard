// HMAC-signed unsubscribe tokens. Used to put a one-click
// "unsubscribe" link in every alert email — the link carries a
// token, not the email itself, so the page can verify the request
// is legitimate (came from an email we actually sent) without
// exposing the email in URLs that might leak via Referer headers.
//
// Same shape as adminToken.js: base64url(payload) . base64url(sig),
// HMAC-SHA256 over the payload using UNSUBSCRIBE_TOKEN_SECRET (or a
// baked-in fallback so the feature works on a fresh deploy without
// requiring env setup).
//
// Tokens don't expire — an email a school stashed in their archive
// six months ago should still be able to opt out. The cost of a
// stolen token is "someone unsubscribes from a non-spam list," which
// is bounded and reversible.

import crypto from 'node:crypto';

const ALGO = 'sha256';
const DEFAULT_SECRET = 'kua-carbon-dashboard-unsubscribe-fallback-replace-in-vercel-32chars+';

function readSecret() {
  const s = process.env.UNSUBSCRIBE_TOKEN_SECRET;
  if (s && s.length >= 32) return s;
  return DEFAULT_SECRET;
}

function b64urlEncode(buf) {
  return Buffer.from(buf).toString('base64url');
}
function b64urlDecode(str) {
  return Buffer.from(str, 'base64url');
}

/**
 * Sign an unsubscribe token for an email address.
 * @param {string} email
 * @returns {string}  `${payloadB64}.${sigB64}`
 */
export function signUnsubscribeToken(email) {
  const normalized = String(email || '').trim().toLowerCase();
  const payload = { email: normalized, kind: 'unsubscribe' };
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const sig = crypto.createHmac(ALGO, readSecret()).update(payloadB64).digest();
  return `${payloadB64}.${b64urlEncode(sig)}`;
}

/**
 * Verify an unsubscribe token. Returns { valid, email } on success.
 * @param {string|null|undefined} token
 * @returns {{ valid: true, email: string } | { valid: false, reason: string }}
 */
export function verifyUnsubscribeToken(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'missing_token' };
  }
  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'malformed_token' };
  }
  const [payloadB64, sigB64] = parts;

  const expected = crypto.createHmac(ALGO, readSecret()).update(payloadB64).digest();
  let provided;
  try { provided = b64urlDecode(sigB64); }
  catch { return { valid: false, reason: 'malformed_signature' }; }
  if (provided.length !== expected.length) {
    return { valid: false, reason: 'signature_length_mismatch' };
  }
  if (!crypto.timingSafeEqual(provided, expected)) {
    return { valid: false, reason: 'signature_mismatch' };
  }

  let payload;
  try { payload = JSON.parse(b64urlDecode(payloadB64).toString('utf8')); }
  catch { return { valid: false, reason: 'malformed_payload' }; }
  if (payload.kind !== 'unsubscribe' || typeof payload.email !== 'string') {
    return { valid: false, reason: 'wrong_kind' };
  }
  return { valid: true, email: payload.email };
}
