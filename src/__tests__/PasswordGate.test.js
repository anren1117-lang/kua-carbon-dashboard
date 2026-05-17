// @vitest-environment jsdom
//
// Tests for PasswordGate — the auth gate that wraps both the admin
// portal (server-checked HMAC session via /api/admin/login) and the
// lighter teacher gate (client-side compare). The server-side admin
// endpoints verify tokens themselves, but this is still the front door
// — a regression here either locks every admin out or, worse, lets
// casual visitors past with no password at all.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { PasswordGate } from '../components/PasswordGate.js';

const ADMIN_PROPS = {
  title: 'Admin portal',
  subtitle: 'Authorized users only.',
  envKey: 'ADMIN_PASSWORD',
  storageKey: 'adminLoggedIn',
};

const TEACHER_PROPS = {
  title: 'Teacher portal',
  subtitle: 'For instructors.',
  envKey: 'TEACHER_PASSWORD',
  storageKey: 'teacherLoggedIn',
  defaultPassword: 'teach-me',
};

const Locked = <p>secret content</p>;

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('PasswordGate — initial render', () => {
  it('renders the gate (not children) when no session is stored', () => {
    render(<PasswordGate {...ADMIN_PROPS}>{Locked}</PasswordGate>);
    expect(screen.getByText('Admin portal')).toBeTruthy();
    expect(screen.queryByText('secret content')).toBeNull();
  });

  it('shows the children straight through when a valid admin session exists', async () => {
    localStorage.setItem('kua_admin_session', JSON.stringify({
      token: 'fake-token',
      expiresAt: new Date(Date.now() + 3600_000).toISOString(),
    }));
    render(<PasswordGate {...ADMIN_PROPS}>{Locked}</PasswordGate>);
    await waitFor(() => expect(screen.getByText('secret content')).toBeTruthy());
  });

  it('rejects + clears an expired admin session', async () => {
    localStorage.setItem('kua_admin_session', JSON.stringify({
      token: 'fake-token',
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    }));
    render(<PasswordGate {...ADMIN_PROPS}>{Locked}</PasswordGate>);
    // Stays on the gate, and the expired blob is removed from storage.
    await waitFor(() => expect(localStorage.getItem('kua_admin_session')).toBeNull());
    expect(screen.queryByText('secret content')).toBeNull();
  });

  it('rejects a stored session that has no token field', async () => {
    localStorage.setItem('kua_admin_session', JSON.stringify({
      expiresAt: new Date(Date.now() + 3600_000).toISOString(),
    }));
    render(<PasswordGate {...ADMIN_PROPS}>{Locked}</PasswordGate>);
    await waitFor(() => expect(screen.getByText('Admin portal')).toBeTruthy());
    expect(screen.queryByText('secret content')).toBeNull();
  });

  it('shows children for the legacy gate when the storageKey is set to "true"', async () => {
    localStorage.setItem('teacherLoggedIn', 'true');
    render(<PasswordGate {...TEACHER_PROPS}>{Locked}</PasswordGate>);
    await waitFor(() => expect(screen.getByText('secret content')).toBeTruthy());
  });
});

describe('PasswordGate — admin login flow', () => {
  function mockLogin(response) { vi.stubGlobal('fetch', vi.fn(async () => response)); }
  function ok(body) { return { ok: true, status: 200, json: async () => body }; }
  function err(status, body = {}) { return { ok: false, status, json: async () => body }; }

  async function typeAndSubmit(pw) {
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: pw } });
    fireEvent.click(screen.getByRole('button', { name: /unlock/i }));
  }

  it('unlocks + stores the returned session on a successful admin login', async () => {
    mockLogin(ok({ token: 'srv-token', expiresAt: new Date(Date.now() + 3600_000).toISOString() }));
    render(<PasswordGate {...ADMIN_PROPS}>{Locked}</PasswordGate>);
    await typeAndSubmit('correct-horse-battery-staple');
    await waitFor(() => expect(screen.getByText('secret content')).toBeTruthy());
    expect(JSON.parse(localStorage.getItem('kua_admin_session')).token).toBe('srv-token');
  });

  it('POSTs to /api/admin/login with the typed password', async () => {
    const fetchMock = vi.fn(async () => ok({ token: 't', expiresAt: new Date(Date.now() + 60_000).toISOString() }));
    vi.stubGlobal('fetch', fetchMock);
    render(<PasswordGate {...ADMIN_PROPS}>{Locked}</PasswordGate>);
    await typeAndSubmit('hunter2');
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/admin/login');
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body)).toEqual({ password: 'hunter2' });
  });

  it('surfaces the server error message on a 401 and keeps the gate visible', async () => {
    mockLogin(err(401, { error: 'wrong password' }));
    render(<PasswordGate {...ADMIN_PROPS}>{Locked}</PasswordGate>);
    await typeAndSubmit('bad');
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('wrong password'));
    expect(screen.queryByText('secret content')).toBeNull();
    expect(localStorage.getItem('kua_admin_session')).toBeNull();
  });

  it('falls back to a generic message when the server omits an error body', async () => {
    mockLogin(err(503));
    render(<PasswordGate {...ADMIN_PROPS}>{Locked}</PasswordGate>);
    await typeAndSubmit('x');
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/HTTP 503/));
  });

  it('surfaces a network error from a throwing fetch', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('boom'); }));
    render(<PasswordGate {...ADMIN_PROPS}>{Locked}</PasswordGate>);
    await typeAndSubmit('x');
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/Network error/));
  });
});

describe('PasswordGate — legacy client-side gate', () => {
  it('unlocks on a matching defaultPassword and writes the storageKey flag', () => {
    render(<PasswordGate {...TEACHER_PROPS}>{Locked}</PasswordGate>);
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'teach-me' } });
    fireEvent.click(screen.getByRole('button', { name: /unlock/i }));
    expect(screen.getByText('secret content')).toBeTruthy();
    expect(localStorage.getItem('teacherLoggedIn')).toBe('true');
  });

  it('shows an error on a wrong password', () => {
    render(<PasswordGate {...TEACHER_PROPS}>{Locked}</PasswordGate>);
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'nope' } });
    fireEvent.click(screen.getByRole('button', { name: /unlock/i }));
    expect(screen.getByRole('alert').textContent).toMatch(/Incorrect password/);
    expect(screen.queryByText('secret content')).toBeNull();
  });
});

describe('PasswordGate — logout', () => {
  it('clears storage and returns to the gate', async () => {
    localStorage.setItem('kua_admin_session', JSON.stringify({
      token: 't', expiresAt: new Date(Date.now() + 3600_000).toISOString(),
    }));
    localStorage.setItem('adminLoggedIn', 'true');
    render(<PasswordGate {...ADMIN_PROPS}>{Locked}</PasswordGate>);
    await waitFor(() => expect(screen.getByText('secret content')).toBeTruthy());

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    expect(screen.queryByText('secret content')).toBeNull();
    expect(localStorage.getItem('kua_admin_session')).toBeNull();
    expect(localStorage.getItem('adminLoggedIn')).toBeNull();
  });
});
