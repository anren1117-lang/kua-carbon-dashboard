// Unit tests for verifyGoogleIdToken — the cryptographic verification
// for Google OIDC ID tokens, used as the auth boundary for the
// chatbot-persistence + teacher-portal Google SSO flows.
//
// Strategy: generate a real RSA keypair, publish its public half as a
// JWK via a stubbed JWKS fetch, and hand-sign tokens with the private
// half. That exercises the actual crypto.verify path rather than
// mocking it — the whole point of this module is that the signature
// check is real.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import crypto from 'node:crypto';
import { verifyGoogleIdToken, _resetJwksCache } from '../utils/googleJwt.js';

const KID = 'test-key-1';
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });

// The public half as a JWK, with our kid attached.
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: KID, alg: 'RS256', use: 'sig' };

const b64url = (buf) => Buffer.from(buf).toString('base64')
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

// Build + sign a JWT. `header`/`payload` overrides merge over sane
// defaults; pass `sign: false` to leave the signature garbage.
function makeToken({ header = {}, payload = {}, sign = true } = {}) {
  const h = { alg: 'RS256', kid: KID, typ: 'JWT', ...header };
  const now = Math.floor(Date.now() / 1000);
  const p = {
    iss: 'https://accounts.google.com',
    aud: 'client-123',
    exp: now + 3600,
    iat: now,
    sub: 'user-1',
    ...payload,
  };
  const hSeg = b64url(JSON.stringify(h));
  const pSeg = b64url(JSON.stringify(p));
  if (!sign) return `${hSeg}.${pSeg}.not-a-real-signature`;
  const sig = crypto.sign('RSA-SHA256', Buffer.from(`${hSeg}.${pSeg}`), privateKey);
  return `${hSeg}.${pSeg}.${b64url(sig)}`;
}

beforeEach(() => {
  _resetJwksCache();
  // Default: the JWKS endpoint serves our test key.
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok: true,
    json: async () => ({ keys: [jwk] }),
  })));
});
afterEach(() => { vi.unstubAllGlobals(); });

describe('verifyGoogleIdToken — structural rejects', () => {
  it('rejects a non-string token', async () => {
    expect((await verifyGoogleIdToken(null)).reason).toMatch(/Malformed JWT/);
    expect((await verifyGoogleIdToken(12345)).reason).toMatch(/Malformed JWT/);
  });

  it('rejects a token without three segments', async () => {
    expect((await verifyGoogleIdToken('a.b')).reason).toMatch(/Malformed JWT/);
    expect((await verifyGoogleIdToken('a.b.c.d')).reason).toMatch(/Malformed JWT/);
  });

  it('rejects segments that are not valid base64url JSON', async () => {
    const r = await verifyGoogleIdToken('@@@.@@@.@@@');
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/not valid base64url JSON/);
  });
});

describe('verifyGoogleIdToken — header checks', () => {
  it('rejects a non-RS256 alg (no alg:none downgrade)', async () => {
    const r = await verifyGoogleIdToken(makeToken({ header: { alg: 'none' }, sign: false }));
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/Unsupported alg none/);
  });

  it('rejects HS256 — a classic algorithm-confusion downgrade', async () => {
    const r = await verifyGoogleIdToken(makeToken({ header: { alg: 'HS256' }, sign: false }));
    expect(r.reason).toMatch(/Unsupported alg HS256/);
  });

  it('rejects a header with no kid', async () => {
    const r = await verifyGoogleIdToken(makeToken({ header: { kid: undefined }, sign: false }));
    expect(r.reason).toMatch(/missing kid/);
  });

  it('rejects a kid that matches no published JWK', async () => {
    const r = await verifyGoogleIdToken(makeToken({ header: { kid: 'unknown-kid' } }));
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/No JWK matches kid=unknown-kid/);
  });
});

describe('verifyGoogleIdToken — signature', () => {
  it('accepts a properly signed, unexpired token', async () => {
    const r = await verifyGoogleIdToken(makeToken(), { audience: 'client-123' });
    expect(r.valid).toBe(true);
    expect(r.payload.sub).toBe('user-1');
  });

  it('rejects a token whose signature does not verify', async () => {
    const r = await verifyGoogleIdToken(makeToken({ sign: false }));
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/Signature mismatch/);
  });

  it('rejects a token whose payload was tampered after signing', async () => {
    const good = makeToken();
    const [h, , s] = good.split('.');
    const forgedPayload = b64url(JSON.stringify({ iss: 'https://accounts.google.com', aud: 'client-123', exp: 9e9, sub: 'attacker' }));
    const r = await verifyGoogleIdToken(`${h}.${forgedPayload}.${s}`);
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/Signature mismatch/);
  });
});

describe('verifyGoogleIdToken — claim checks', () => {
  it('accepts both Google issuer spellings', async () => {
    for (const iss of ['accounts.google.com', 'https://accounts.google.com']) {
      const r = await verifyGoogleIdToken(makeToken({ payload: { iss } }));
      expect(r.valid).toBe(true);
    }
  });

  it('rejects a bad issuer', async () => {
    const r = await verifyGoogleIdToken(makeToken({ payload: { iss: 'https://evil.example.com' } }));
    expect(r.reason).toMatch(/Bad issuer/);
  });

  it('rejects a token with no exp (would otherwise never expire)', async () => {
    const r = await verifyGoogleIdToken(makeToken({ payload: { exp: undefined } }));
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/Missing or invalid exp/);
  });

  it('rejects an exp of Infinity (JSON 9e9999999 → Infinity)', async () => {
    // The token JSON literally carries 9e9999999, which JSON.parse
    // turns into Infinity — Number.isFinite must catch it.
    const now = Math.floor(Date.now() / 1000);
    const h = b64url(JSON.stringify({ alg: 'RS256', kid: KID }));
    const p = b64url(`{"iss":"https://accounts.google.com","aud":"client-123","exp":9e9999999,"iat":${now}}`);
    const sig = crypto.sign('RSA-SHA256', Buffer.from(`${h}.${p}`), privateKey);
    const r = await verifyGoogleIdToken(`${h}.${p}.${b64url(sig)}`);
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/Missing or invalid exp/);
  });

  it('rejects an expired token', async () => {
    const now = Math.floor(Date.now() / 1000);
    const r = await verifyGoogleIdToken(makeToken({ payload: { exp: now - 10 } }));
    expect(r.reason).toMatch(/Token expired/);
  });

  it('rejects a token whose nbf is in the future', async () => {
    const now = Math.floor(Date.now() / 1000);
    const r = await verifyGoogleIdToken(makeToken({ payload: { nbf: now + 3600 } }));
    expect(r.reason).toMatch(/not yet valid \(nbf\)/);
  });

  it('accepts a token whose nbf is in the past', async () => {
    const now = Math.floor(Date.now() / 1000);
    const r = await verifyGoogleIdToken(makeToken({ payload: { nbf: now - 60 } }));
    expect(r.valid).toBe(true);
  });

  it('rejects an audience mismatch when opts.audience is given', async () => {
    const r = await verifyGoogleIdToken(makeToken({ payload: { aud: 'other-client' } }), { audience: 'client-123' });
    expect(r.reason).toMatch(/Audience mismatch/);
  });

  it('skips the audience check when opts.audience is omitted', async () => {
    // Documents current behavior: aud is only enforced when the caller
    // passes an expected audience.
    const r = await verifyGoogleIdToken(makeToken({ payload: { aud: 'anything-at-all' } }));
    expect(r.valid).toBe(true);
  });
});

describe('verifyGoogleIdToken — JWKS caching', () => {
  it('does not re-fetch the JWKS within the cache TTL', async () => {
    await verifyGoogleIdToken(makeToken());
    await verifyGoogleIdToken(makeToken());
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('re-fetches after the cache is reset', async () => {
    await verifyGoogleIdToken(makeToken());
    _resetJwksCache();
    await verifyGoogleIdToken(makeToken());
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('surfaces a JWKS fetch failure', async () => {
    _resetJwksCache();
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 503 })));
    await expect(verifyGoogleIdToken(makeToken())).rejects.toThrow(/Failed to fetch Google JWKs: 503/);
  });
});
