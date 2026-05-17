// Tests for the alert subscription pipeline:
//   - src/utils/sendEmail.js  (Resend wrapper + isLikelyEmail)
//   - src/storage/alertSubscribers.js  (in-memory store + dedupe)
//   - /api/alerts/subscribe   (public POST)
//   - /api/alerts/unsubscribe (public POST)
//   - /api/alerts/subscribers (admin GET/POST — list + send test)
//
// The Resend HTTP call is mocked; tests run in the no-RESEND_API_KEY
// path too so the "no_provider" fallback is exercised.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import crypto from 'node:crypto';
import { sendEmail, isLikelyEmail } from '../utils/sendEmail.js';
import {
  addSubscriber, removeSubscriber, listSubscribers, _resetAlertSubscribersForTests,
} from '../storage/alertSubscribers.js';
import subscribeHandler   from '../../api/alerts/subscribe.js';
import unsubscribeHandler from '../../api/alerts/unsubscribe.js';
import subscribersHandler from '../../api/alerts/subscribers.js';
import { signAdminToken } from '../utils/adminToken.js';

// Set the admin-token secret once so signAdminToken can mint a valid
// header for the admin-gated endpoint tests.
process.env.ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET
  || 'test-admin-secret-12345678901234567890abcdefABCDEF';

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
async function call(handler, req) {
  const w = makeRes();
  await handler(req, w.res);
  return w;
}
let ipCounter = 0;
const post = (body, headers = {}) => ({
  method: 'POST', body,
  headers: { 'x-forwarded-for': `alert-test-${++ipCounter}`, ...headers },
});
const adminHeaders = () => ({ authorization: `Bearer ${signAdminToken().token}` });

beforeEach(() => { _resetAlertSubscribersForTests(); });
afterEach(() => { vi.unstubAllGlobals(); });

// ─── isLikelyEmail ────────────────────────────────────────────────
describe('isLikelyEmail', () => {
  it('accepts obvious-looking emails', () => {
    for (const e of ['a@b.co', 'sustainability@kua.org', 'a.b+tag@c.d.edu']) {
      expect(isLikelyEmail(e)).toBe(true);
    }
  });
  it('rejects obvious junk', () => {
    for (const e of ['', 'nope', 'a@b', '@b.co', 'a@.co', 'a b@c.co', null, undefined, 123]) {
      expect(isLikelyEmail(e)).toBe(false);
    }
  });
  it('rejects an over-length local-or-domain', () => {
    expect(isLikelyEmail('a'.repeat(300) + '@b.co')).toBe(false);
  });
});

// ─── sendEmail ────────────────────────────────────────────────────
describe('sendEmail — no provider', () => {
  let saved;
  beforeEach(() => { saved = process.env.RESEND_API_KEY; delete process.env.RESEND_API_KEY; });
  afterEach(() => { if (saved !== undefined) process.env.RESEND_API_KEY = saved; });

  it('returns { sent: false, reason: "no_provider" } when RESEND_API_KEY is unset', async () => {
    const r = await sendEmail({ to: 'a@b.co', subject: 's', html: '<p>x</p>' });
    expect(r).toEqual({ sent: false, reason: 'no_provider' });
  });

  it('returns no_recipients for missing to', async () => {
    expect(await sendEmail({ to: '', subject: 's', html: '<p>x</p>' })).toEqual({ sent: false, reason: 'no_recipients' });
    expect(await sendEmail({ to: [], subject: 's', html: '<p>x</p>' })).toEqual({ sent: false, reason: 'no_recipients' });
  });

  it('returns missing_subject_or_html when either is empty', async () => {
    expect(await sendEmail({ to: 'a@b.co', subject: '', html: '<p>x</p>' }).then((r) => r.reason)).toBe('missing_subject_or_html');
  });
});

describe('sendEmail — with provider (Resend mocked)', () => {
  let saved;
  beforeEach(() => { saved = process.env.RESEND_API_KEY; process.env.RESEND_API_KEY = 'key'; });
  afterEach(() => { if (saved === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = saved; });

  it('POSTs to api.resend.com with Bearer auth + structured body', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ id: 're_abc' }) }));
    vi.stubGlobal('fetch', fetchMock);
    const out = await sendEmail({ to: 'a@b.co', subject: 'Hi', html: '<p>hi</p>', text: 'hi' });
    expect(out).toEqual({ sent: true, id: 're_abc' });
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(opts.headers.Authorization).toBe('Bearer key');
    const body = JSON.parse(opts.body);
    expect(body.to).toEqual(['a@b.co']);
    expect(body.subject).toBe('Hi');
  });

  it('returns provider_error on a non-ok Resend response', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 422, json: async () => ({ message: 'bad' }) })));
    const r = await sendEmail({ to: 'a@b.co', subject: 's', html: '<p>x</p>' });
    expect(r.sent).toBe(false);
    expect(r.reason).toBe('provider_error');
    expect(r.error).toBe('bad');
  });

  it('returns network_error when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('boom'); }));
    const r = await sendEmail({ to: 'a@b.co', subject: 's', html: '<p>x</p>' });
    expect(r.reason).toBe('network_error');
  });
});

// ─── alertSubscribers store ───────────────────────────────────────
describe('alertSubscribers store', () => {
  it('adds + lists', async () => {
    await addSubscriber('a@b.co');
    const list = await listSubscribers();
    expect(list.map((s) => s.email)).toEqual(['a@b.co']);
  });

  it('normalizes email to lowercase + trims whitespace', async () => {
    await addSubscriber('  Sustain@Kua.ORG  ');
    const list = await listSubscribers();
    expect(list[0].email).toBe('sustain@kua.org');
  });

  it('dedupes the same email regardless of casing', async () => {
    await addSubscriber('a@b.co');
    await addSubscriber('A@B.CO');
    expect((await listSubscribers())).toHaveLength(1);
  });

  it('returns { error: invalid_email } for junk', async () => {
    expect((await addSubscriber('nope')).error).toBe('invalid_email');
    expect((await addSubscriber('')).error).toBe('invalid_email');
  });

  it('removes a subscriber (returns removed: true)', async () => {
    await addSubscriber('a@b.co');
    const r = await removeSubscriber('a@b.co');
    expect(r.removed).toBe(true);
    expect(await listSubscribers()).toEqual([]);
  });

  it('removing an unknown email is a no-op (returns removed: false)', async () => {
    const r = await removeSubscriber('nobody@nowhere.co');
    expect(r.removed).toBe(false);
  });
});

// ─── /api/alerts/subscribe ────────────────────────────────────────
describe('/api/alerts/subscribe', () => {
  it('405s a GET', async () => {
    const r = await call(subscribeHandler, { method: 'GET', headers: {} });
    expect(r.statusCode).toBe(405);
  });

  it('400s a junk email', async () => {
    const r = await call(subscribeHandler, post({ email: 'nope' }));
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toBe('invalid_email');
  });

  it('200s + persists a valid email', async () => {
    const r = await call(subscribeHandler, post({ email: 'a@b.co' }));
    expect(r.statusCode).toBe(200);
    expect(r.body.ok).toBe(true);
    expect((await listSubscribers()).map((s) => s.email)).toContain('a@b.co');
  });

  it('rate-limits an IP past the burst capacity', async () => {
    const ip = 'subscribe-burst';
    let limited = null;
    for (let i = 0; i < 12; i++) {
      const r = await call(subscribeHandler, { method: 'POST', body: { email: `t${i}@b.co` }, headers: { 'x-forwarded-for': ip } });
      if (r.statusCode === 429) { limited = r; break; }
    }
    expect(limited).not.toBeNull();
    expect(limited.body.error).toBe('rate_limited');
  });
});

// ─── /api/alerts/unsubscribe ──────────────────────────────────────
describe('/api/alerts/unsubscribe', () => {
  it('always 200s — does not leak whether the email was subscribed', async () => {
    const known   = await call(unsubscribeHandler, post({ email: 'never@subscribed.co' }));
    expect(known.statusCode).toBe(200);
    expect(known.body.ok).toBe(true);

    await addSubscriber('a@b.co');
    const real = await call(unsubscribeHandler, post({ email: 'a@b.co' }));
    expect(real.statusCode).toBe(200);
    expect(await listSubscribers()).toEqual([]);
  });

  it('400s on missing email', async () => {
    const r = await call(unsubscribeHandler, post({}));
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toBe('email_required');
  });
});

// ─── /api/alerts/subscribers (admin-gated GET + test POST) ────────
describe('/api/alerts/subscribers', () => {
  it('GET 401s without admin auth', async () => {
    const r = await call(subscribersHandler, { method: 'GET', headers: {} });
    expect(r.statusCode).toBe(401);
  });

  it('GET 200s with admin auth, returns the subscriber list', async () => {
    await addSubscriber('a@b.co');
    await addSubscriber('b@c.co');
    const r = await call(subscribersHandler, { method: 'GET', headers: adminHeaders() });
    expect(r.statusCode).toBe(200);
    expect(r.body.count).toBe(2);
    expect(r.body.subscribers.map((s) => s.email).sort()).toEqual(['a@b.co', 'b@c.co']);
  });

  it('POST (test send) 400s when there are no subscribers', async () => {
    const r = await call(subscribersHandler, { method: 'POST', headers: adminHeaders() });
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toBe('no_subscribers');
  });

  it('POST (test send) without RESEND_API_KEY reports noProvider=true', async () => {
    const saved = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;
    try {
      await addSubscriber('a@b.co');
      const r = await call(subscribersHandler, { method: 'POST', headers: adminHeaders() });
      expect(r.statusCode).toBe(200);
      expect(r.body.attempted).toBe(1);
      expect(r.body.sent).toBe(0);
      expect(r.body.noProvider).toBe(true);
    } finally {
      if (saved !== undefined) process.env.RESEND_API_KEY = saved;
    }
  });

  it('POST (test send) with RESEND_API_KEY actually dispatches to every subscriber', async () => {
    const saved = process.env.RESEND_API_KEY;
    process.env.RESEND_API_KEY = 'key';
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ id: 're_' + crypto.randomUUID() }) }));
    vi.stubGlobal('fetch', fetchMock);
    try {
      await addSubscriber('a@b.co');
      await addSubscriber('b@c.co');
      const r = await call(subscribersHandler, { method: 'POST', headers: adminHeaders() });
      expect(r.statusCode).toBe(200);
      expect(r.body.attempted).toBe(2);
      expect(r.body.sent).toBe(2);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally {
      if (saved === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = saved;
    }
  });

  it('rejects PUT with 405', async () => {
    const r = await call(subscribersHandler, { method: 'PUT', headers: adminHeaders() });
    expect(r.statusCode).toBe(405);
  });
});
