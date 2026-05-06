// @vitest-environment jsdom

// Tests for src/utils/adminFetch.js — the browser helper that attaches
// the admin Authorization header and handles token expiry. This file
// uses the jsdom environment so localStorage + window event dispatch
// are available; the rest of the test suite runs in the default
// node environment.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { adminFetch, getAdminToken, ADMIN_AUTH_EXPIRED_EVENT } from '../utils/adminFetch.js';

const SESSION_KEY = 'kua_admin_session';

function freshSession({ minutesUntilExpiry = 30 } = {}) {
  const exp = new Date(Date.now() + minutesUntilExpiry * 60_000).toISOString();
  return { token: 'TEST_TOKEN_VALUE', expiresAt: exp };
}

beforeEach(() => {
  localStorage.clear();
  // Reset the global fetch mock between tests so assertions don't
  // bleed across cases.
  vi.restoreAllMocks();
});

describe('getAdminToken()', () => {
  it('returns null when no session in localStorage', () => {
    expect(getAdminToken()).toBeNull();
  });

  it('returns the token when session is present and not expired', () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(freshSession()));
    expect(getAdminToken()).toBe('TEST_TOKEN_VALUE');
  });

  it('returns null and clears localStorage when token is expired', () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(freshSession({ minutesUntilExpiry: -1 })));
    expect(getAdminToken()).toBeNull();
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('returns null on malformed session JSON', () => {
    localStorage.setItem(SESSION_KEY, 'not-valid-json{{');
    expect(getAdminToken()).toBeNull();
  });

  it('returns null when session lacks token or expiresAt', () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ foo: 'bar' }));
    expect(getAdminToken()).toBeNull();
  });
});

describe('adminFetch()', () => {
  it('sends Authorization: Bearer header when session present', async () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(freshSession()));
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: 1 }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await adminFetch('/api/admin/something', { method: 'POST', body: JSON.stringify({ a: 1 }) });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.get('Authorization')).toBe('Bearer TEST_TOKEN_VALUE');
    expect(init.headers.get('Content-Type')).toBe('application/json');
  });

  it('omits Authorization header when no session present', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await adminFetch('/api/admin/something', { method: 'GET' });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.get('Authorization')).toBeNull();
  });

  it('clears localStorage when server returns 401', async () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(freshSession()));
    localStorage.setItem('adminLoggedIn', 'true');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'expired' }), { status: 401, headers: { 'content-type': 'application/json' } })
    );
    vi.stubGlobal('fetch', fetchMock);

    await adminFetch('/api/admin/something');

    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(localStorage.getItem('adminLoggedIn')).toBeNull();
  });

  it('dispatches kua-admin-auth-expired event on 401 with reason from body', async () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(freshSession()));
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'token expired' }), { status: 401, headers: { 'content-type': 'application/json' } })
    );
    vi.stubGlobal('fetch', fetchMock);

    const events = [];
    const handler = (e) => events.push(e.detail);
    window.addEventListener(ADMIN_AUTH_EXPIRED_EVENT, handler);

    await adminFetch('/api/admin/something');

    window.removeEventListener(ADMIN_AUTH_EXPIRED_EVENT, handler);
    expect(events).toHaveLength(1);
    expect(events[0].reason).toBe('token expired');
  });

  it('does NOT clear localStorage on 200', async () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(freshSession()));
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await adminFetch('/api/admin/something');

    expect(localStorage.getItem(SESSION_KEY)).not.toBeNull();
  });

  it('does NOT clear localStorage on 4xx other than 401', async () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(freshSession()));
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 400 }));
    vi.stubGlobal('fetch', fetchMock);

    await adminFetch('/api/admin/something');

    expect(localStorage.getItem(SESSION_KEY)).not.toBeNull();
  });

  it('returns the original Response object so callers can read body', async () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(freshSession()));
    const payload = { mode: 'rule', expectedMtPerYear: 50 };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 200, headers: { 'content-type': 'application/json' } })
    );
    vi.stubGlobal('fetch', fetchMock);

    const r = await adminFetch('/api/admin/something');
    const body = await r.json();
    expect(body).toEqual(payload);
  });

  it('falls back to "unauthorized" reason if 401 body is unparseable', async () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(freshSession()));
    const fetchMock = vi.fn().mockResolvedValue(new Response('not-json', { status: 401 }));
    vi.stubGlobal('fetch', fetchMock);

    const events = [];
    const handler = (e) => events.push(e.detail);
    window.addEventListener(ADMIN_AUTH_EXPIRED_EVENT, handler);

    await adminFetch('/api/admin/something');

    window.removeEventListener(ADMIN_AUTH_EXPIRED_EVENT, handler);
    expect(events).toHaveLength(1);
    expect(events[0].reason).toBe('unauthorized');
  });
});
