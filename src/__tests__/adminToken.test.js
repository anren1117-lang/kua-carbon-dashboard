// Unit tests for the HMAC-signed admin token used by every /api/admin/*
// handler. apiRoutes.test.js exercises this indirectly via the login
// flow; this file pins the contract down directly — sign-verify
// round-trip, claim shape, the timing-safe signature check, the
// expiry/role guards, and the Infinity/NaN expiry defense.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import crypto from 'node:crypto';
import { signAdminToken, verifyAdminToken, verifyAdminRequest } from '../utils/adminToken.js';

const SECRET = 'test-admin-secret-please-be-at-least-32-chars-long-abc';
let saved;

beforeEach(() => {
  saved = process.env.ADMIN_TOKEN_SECRET;
  process.env.ADMIN_TOKEN_SECRET = SECRET;
});
afterEach(() => {
  if (saved === undefined) delete process.env.ADMIN_TOKEN_SECRET;
  else process.env.ADMIN_TOKEN_SECRET = saved;
});

// Helper: hand-mint a token with arbitrary payload, so we can test
// payloads the signer wouldn't naturally produce (Infinity exp, NaN,
// missing claims, wrong role).
function mintToken(payload, secret = SECRET) {
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest();
  return `${payloadB64}.${sig.toString('base64url')}`;
}

describe('signAdminToken', () => {
  it('returns a token + ISO expiresAt', () => {
    const { token, expiresAt } = signAdminToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    expect(new Date(expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it('honors a custom ttlSeconds', () => {
    const { expiresAt } = signAdminToken({ ttlSeconds: 60 });
    const delta = new Date(expiresAt).getTime() - Date.now();
    expect(delta).toBeGreaterThan(50_000);
    expect(delta).toBeLessThan(70_000);
  });

  it('signed tokens round-trip through verifyAdminToken', () => {
    const { token } = signAdminToken();
    const v = verifyAdminToken(token);
    expect(v.valid).toBe(true);
    expect(v.payload.role).toBe('admin');
    expect(typeof v.payload.iat).toBe('number');
    expect(typeof v.payload.exp).toBe('number');
  });
});

describe('verifyAdminToken — structural rejects', () => {
  it('rejects null / undefined / non-string', () => {
    expect(verifyAdminToken(null).reason).toMatch(/missing/);
    expect(verifyAdminToken(undefined).reason).toMatch(/missing/);
    expect(verifyAdminToken(12345).reason).toMatch(/missing/);
    expect(verifyAdminToken('').reason).toMatch(/missing/);
  });

  it('rejects a token without exactly two segments', () => {
    expect(verifyAdminToken('only-one').reason).toMatch(/malformed token/);
    expect(verifyAdminToken('a.b.c').reason).toMatch(/malformed token/);
  });
});

describe('verifyAdminToken — signature', () => {
  it('rejects a token signed with a different secret', () => {
    const forged = mintToken(
      { iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600, role: 'admin' },
      'a-different-32-character-long-secret-aaa',
    );
    expect(verifyAdminToken(forged).reason).toMatch(/signature mismatch|length mismatch/);
  });

  it('rejects a token whose payload was tampered after signing', () => {
    const { token } = signAdminToken();
    const [, sig] = token.split('.');
    const evilPayload = Buffer.from(JSON.stringify({
      iat: 0, exp: 9_999_999_999, role: 'admin', injected: true,
    })).toString('base64url');
    expect(verifyAdminToken(`${evilPayload}.${sig}`).reason).toMatch(/signature/);
  });
});

describe('verifyAdminToken — claim checks', () => {
  it('rejects a token with no exp claim', () => {
    const t = mintToken({ iat: 0, role: 'admin' });
    expect(verifyAdminToken(t).reason).toBe('expired');
  });

  it('rejects an expired token', () => {
    const t = mintToken({ iat: 0, exp: Math.floor(Date.now() / 1000) - 60, role: 'admin' });
    expect(verifyAdminToken(t).reason).toBe('expired');
  });

  it('rejects Infinity exp (defense-in-depth — would otherwise never expire)', () => {
    // typeof Infinity === 'number' is true; Infinity < now is false,
    // so a typeof check would happily accept this as a fresh token.
    // Number.isFinite catches it.
    const t = mintToken({ iat: 0, exp: Infinity, role: 'admin' });
    expect(verifyAdminToken(t).reason).toBe('expired');
  });

  it('rejects NaN exp', () => {
    const t = mintToken({ iat: 0, exp: NaN, role: 'admin' });
    expect(verifyAdminToken(t).reason).toBe('expired');
  });

  it('rejects a token with the wrong role', () => {
    const t = mintToken({ iat: 0, exp: Math.floor(Date.now() / 1000) + 3600, role: 'student' });
    expect(verifyAdminToken(t).reason).toBe('wrong role');
  });
});

describe('verifyAdminRequest', () => {
  const validToken = () => signAdminToken().token;

  it('extracts the bearer token from a lowercase authorization header', () => {
    const r = verifyAdminRequest({ headers: { authorization: `Bearer ${validToken()}` } });
    expect(r.valid).toBe(true);
  });

  it('extracts the bearer token from a capitalized Authorization header', () => {
    const r = verifyAdminRequest({ headers: { Authorization: `Bearer ${validToken()}` } });
    expect(r.valid).toBe(true);
  });

  it('matches the bearer prefix case-insensitively', () => {
    const r = verifyAdminRequest({ headers: { authorization: `bearer ${validToken()}` } });
    expect(r.valid).toBe(true);
  });

  it('rejects a missing Authorization header', () => {
    expect(verifyAdminRequest({ headers: {} }).reason).toMatch(/missing bearer/);
    expect(verifyAdminRequest({}).reason).toMatch(/missing bearer/);
    expect(verifyAdminRequest(null).reason).toMatch(/missing bearer/);
  });

  it('rejects a non-bearer scheme', () => {
    expect(verifyAdminRequest({ headers: { authorization: 'Basic abc' } }).reason).toMatch(/missing bearer/);
  });
});

// FAIL CLOSED WITH NO SECRET CONFIGURED.
//
// This module used to fall back to a hardcoded 68-character DEFAULT_SECRET
// when ADMIN_TOKEN_SECRET was unset, so that login worked on a fresh deploy.
// That constant lived in a PUBLIC repository alongside an exported
// signAdminToken, which made minting a valid admin token a five-line script
// — no password, login endpoint bypassed — and every /api/admin/* route
// verifies against this same secret.
//
// An access control that silently opens when an env var is missing is worse
// than one that visibly breaks. These assert there is no fallback left.
describe('no fallback secret', () => {
  let saved;
  beforeEach(() => {
    saved = process.env.ADMIN_TOKEN_SECRET;
    delete process.env.ADMIN_TOKEN_SECRET;
  });
  afterEach(() => {
    if (saved === undefined) delete process.env.ADMIN_TOKEN_SECRET;
    else process.env.ADMIN_TOKEN_SECRET = saved;
  });

  it('signing throws instead of using a built-in default', () => {
    expect(() => signAdminToken()).toThrow(/ADMIN_TOKEN_SECRET is not configured/);
  });

  it('the error names the variable and says why there is no default', () => {
    try {
      signAdminToken();
      throw new Error('expected signAdminToken to throw');
    } catch (err) {
      expect(err.code).toBe('ADMIN_SECRET_MISSING');
      expect(err.message).toMatch(/ADMIN_TOKEN_SECRET/);
      expect(err.message).toMatch(/public repo/);
    }
  });

  it('verification fails closed rather than accepting anything', () => {
    // Shape-valid, signature-shaped, and still rejected: with no secret
    // there is nothing to verify against, so nothing can be valid.
    const res = verifyAdminToken('eyJyb2xlIjoiYWRtaW4ifQ.c2ln');
    expect(res.valid).toBe(false);
    expect(res.reason).toMatch(/ADMIN_TOKEN_SECRET is not configured/);
  });

  it('rejects a secret that is too short to be useful', () => {
    process.env.ADMIN_TOKEN_SECRET = 'short';
    expect(() => signAdminToken()).toThrow(/only 5 chars, need 32/);
  });
});
