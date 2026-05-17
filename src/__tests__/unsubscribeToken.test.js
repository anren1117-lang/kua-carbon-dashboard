// Unit tests for the HMAC-signed unsubscribe token + the token-based
// unsubscribe API. The token shape mirrors adminToken (payload.sig,
// HMAC-SHA256, base64url) so this leans on the same defense
// patterns: signature-mismatch / payload-tamper / wrong-kind.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import crypto from 'node:crypto';
import { signUnsubscribeToken, verifyUnsubscribeToken } from '../utils/unsubscribeToken.js';
import unsubscribeViaToken from '../../api/alerts/unsubscribe-via-token.js';
import {
  addSubscriber, listSubscribers, _resetAlertSubscribersForTests,
} from '../storage/alertSubscribers.js';

const SECRET = 'test-unsub-secret-must-be-at-least-32-chars-XYZ';

function makeRes() {
  let statusCode = 200, body = null;
  const headers = {};
  const res = {
    status(c) { statusCode = c; return res; },
    json(p) { body = p; return res; },
    setHeader(k, v) { headers[k] = v; return res; },
  };
  return { res, get statusCode() { return statusCode; }, get body() { return body; }, get headers() { return headers; } };
}
async function call(req) {
  const w = makeRes();
  await unsubscribeViaToken(req, w.res);
  return w;
}
let ipCounter = 0;
const post = (body, headers = {}) => ({
  method: 'POST', body,
  headers: { 'x-forwarded-for': `unsub-test-${++ipCounter}`, ...headers },
});

let savedSecret;
beforeEach(() => {
  savedSecret = process.env.UNSUBSCRIBE_TOKEN_SECRET;
  process.env.UNSUBSCRIBE_TOKEN_SECRET = SECRET;
  _resetAlertSubscribersForTests();
});
afterEach(() => {
  if (savedSecret === undefined) delete process.env.UNSUBSCRIBE_TOKEN_SECRET;
  else process.env.UNSUBSCRIBE_TOKEN_SECRET = savedSecret;
  vi.unstubAllGlobals();
});

describe('signUnsubscribeToken / verifyUnsubscribeToken', () => {
  it('round-trips a normalized email', () => {
    const token = signUnsubscribeToken('  Sustain@Kua.ORG  ');
    const v = verifyUnsubscribeToken(token);
    expect(v.valid).toBe(true);
    expect(v.email).toBe('sustain@kua.org');
  });

  it('rejects an empty / non-string token', () => {
    expect(verifyUnsubscribeToken(null).reason).toBe('missing_token');
    expect(verifyUnsubscribeToken('').reason).toBe('missing_token');
    expect(verifyUnsubscribeToken(123).reason).toBe('missing_token');
  });

  it('rejects a token without exactly two segments', () => {
    expect(verifyUnsubscribeToken('only-one').reason).toBe('malformed_token');
    expect(verifyUnsubscribeToken('a.b.c').reason).toBe('malformed_token');
  });

  it('rejects a token signed with a different secret', () => {
    const altSecret = 'a-different-32-character-secret-aaaaaa';
    const payload = Buffer.from(JSON.stringify({ email: 'a@b.co', kind: 'unsubscribe' })).toString('base64url');
    const sig = crypto.createHmac('sha256', altSecret).update(payload).digest();
    const forged = `${payload}.${sig.toString('base64url')}`;
    expect(verifyUnsubscribeToken(forged).reason).toMatch(/signature/);
  });

  it('rejects a payload whose kind is not "unsubscribe"', () => {
    const payload = Buffer.from(JSON.stringify({ email: 'a@b.co', kind: 'admin' })).toString('base64url');
    const sig = crypto.createHmac('sha256', SECRET).update(payload).digest();
    const wrongKind = `${payload}.${sig.toString('base64url')}`;
    expect(verifyUnsubscribeToken(wrongKind).reason).toBe('wrong_kind');
  });

  it('rejects a payload tampered after signing', () => {
    const good = signUnsubscribeToken('a@b.co');
    const [, sig] = good.split('.');
    const evilPayload = Buffer.from(JSON.stringify({ email: 'attacker@evil.co', kind: 'unsubscribe' })).toString('base64url');
    expect(verifyUnsubscribeToken(`${evilPayload}.${sig}`).reason).toMatch(/signature/);
  });
});

describe('/api/alerts/unsubscribe-via-token', () => {
  it('405s a GET', async () => {
    const r = await call({ method: 'GET', headers: {} });
    expect(r.statusCode).toBe(405);
  });

  it('400s a token with bad shape', async () => {
    const r = await call(post({ token: 'garbage' }));
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toBe('malformed_token');
  });

  it('400s a missing token', async () => {
    const r = await call(post({}));
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toBe('missing_token');
  });

  it('200s + removes the subscriber on a valid token', async () => {
    await addSubscriber('drop-me@school.edu');
    const token = signUnsubscribeToken('drop-me@school.edu');
    const r = await call(post({ token }));
    expect(r.statusCode).toBe(200);
    expect(r.body.ok).toBe(true);
    expect(r.body.email).toBe('drop-me@school.edu');
    expect(await listSubscribers()).toEqual([]);
  });

  it('200s even when the email was never subscribed (idempotent)', async () => {
    const token = signUnsubscribeToken('never-here@school.edu');
    const r = await call(post({ token }));
    expect(r.statusCode).toBe(200);
    expect(r.body.ok).toBe(true);
  });

  it('rate-limits a single IP past the burst capacity', async () => {
    const ip = 'unsub-burst';
    const token = signUnsubscribeToken('a@b.co');
    let limited = null;
    for (let i = 0; i < 15; i++) {
      const w = makeRes();
      await unsubscribeViaToken({ method: 'POST', body: { token }, headers: { 'x-forwarded-for': ip } }, w.res);
      if (w.statusCode === 429) { limited = w; break; }
    }
    expect(limited).not.toBeNull();
    expect(limited.body.error).toBe('rate_limited');
  });
});
