// Cryptographic verification for Google OIDC ID tokens.
//
// Why we don't use jose: this codebase has no current Node-side
// dependencies, and verifying RS256 against Google's published JWKs is
// straightforward enough with Node built-ins to keep that property.
//
// What we verify:
//   1. Header: alg = RS256, kid present
//   2. Signature: matches one of the JWKs at https://www.googleapis.com/oauth2/v3/certs
//   3. Claims: iss in {"accounts.google.com", "https://accounts.google.com"},
//              aud === expected client id, exp > now
//
// JWKs are cached in-process for 6 hours (Google rotates keys roughly weekly).

import crypto from 'node:crypto';

const JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const CACHE_TTL_MS = 6 * 3600 * 1000;

let _cache = { keys: null, fetchedAt: 0 };

async function getJwks() {
  if (_cache.keys && Date.now() - _cache.fetchedAt < CACHE_TTL_MS) {
    return _cache.keys;
  }
  const r = await fetch(JWKS_URL);
  if (!r.ok) throw new Error(`Failed to fetch Google JWKs: ${r.status}`);
  const j = await r.json();
  _cache = { keys: j.keys || [], fetchedAt: Date.now() };
  return _cache.keys;
}

function b64urlDecode(s) {
  // Convert URL-safe base64 to Buffer.
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const std = s.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return Buffer.from(std, 'base64');
}

/**
 * @param {string} idToken
 * @param {object} opts
 * @param {string=} opts.audience  Expected aud claim
 * @returns {Promise<{ valid: true, payload: object } | { valid: false, reason: string }>}
 */
export async function verifyGoogleIdToken(idToken, opts = {}) {
  if (typeof idToken !== 'string' || idToken.split('.').length !== 3) {
    return { valid: false, reason: 'Malformed JWT' };
  }
  const [h, p, s] = idToken.split('.');
  let header, payload;
  try {
    header  = JSON.parse(b64urlDecode(h).toString('utf8'));
    payload = JSON.parse(b64urlDecode(p).toString('utf8'));
  } catch {
    return { valid: false, reason: 'JWT segments not valid base64url JSON' };
  }
  if (header.alg !== 'RS256') return { valid: false, reason: `Unsupported alg ${header.alg}` };
  if (!header.kid) return { valid: false, reason: 'Header missing kid' };

  const jwks = await getJwks();
  const jwk = jwks.find((k) => k.kid === header.kid);
  if (!jwk) return { valid: false, reason: `No JWK matches kid=${header.kid}` };

  let publicKey;
  try {
    publicKey = crypto.createPublicKey({ key: jwk, format: 'jwk' });
  } catch (e) {
    return { valid: false, reason: `Public key import failed: ${e.message}` };
  }

  const signedData = Buffer.from(`${h}.${p}`, 'utf8');
  const sigBuf = b64urlDecode(s);
  const ok = crypto.verify('RSA-SHA256', signedData, publicKey, sigBuf);
  if (!ok) return { valid: false, reason: 'Signature mismatch' };

  // Claim checks
  const iss = payload.iss;
  if (iss !== 'accounts.google.com' && iss !== 'https://accounts.google.com') {
    return { valid: false, reason: `Bad issuer ${iss}` };
  }
  if (payload.exp && payload.exp * 1000 <= Date.now()) {
    return { valid: false, reason: 'Token expired' };
  }
  if (opts.audience && payload.aud !== opts.audience) {
    return { valid: false, reason: 'Audience mismatch' };
  }

  return { valid: true, payload };
}

// Test-only escape hatch.
export function _resetJwksCache() {
  _cache = { keys: null, fetchedAt: 0 };
}
