// /api/health must say whether admin can work, and both server Supabase
// helpers must accept the same two key names.
//
// Production on 2026-10-25: /api/health returned ok:true while
// ADMIN_TOKEN_SECRET was unset and nobody could sign in. And
// storage/supabaseServer.js read only SUPABASE_SERVICE_KEY while
// api/_lib/supabaseAdmin.js preferred SUPABASE_SERVICE_ROLE_KEY — so setting
// the canonical name fixed admin writes and left alerts/lessons/quiz/health
// unconfigured, with no error anywhere.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// /api/health runs a live query when a client exists. For the health calls
// only, hand it a stub that answers instantly; the key-name test below uses
// the real helper.
let stubForHealth = false;
vi.mock('../storage/supabaseServer.js', async (importOriginal) => {
  const actual = await importOriginal();
  const stub = { from: () => ({ select: () => Promise.resolve({ error: null }) }) };
  return { ...actual, getSupabaseServer: () => (stubForHealth ? Promise.resolve(stub) : actual.getSupabaseServer()) };
});
import { getSupabaseServer, _resetSupabaseServer } from '../storage/supabaseServer.js';
import { isSupabaseAdminConfigured } from '../../api/_lib/supabaseAdmin.js';
import { adminSecretStatus } from '../utils/adminToken.js';

const KEYS = ['ADMIN_TOKEN_SECRET', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_KEY'];
let saved;
beforeEach(() => {
  saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
  for (const k of KEYS) delete process.env[k];
  _resetSupabaseServer();
});
afterEach(() => {
  for (const k of KEYS) { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; }
  _resetSupabaseServer();
});

const { default: health } = await import('../../api/health.js');
async function getHealth() {
  stubForHealth = true;
  const w = {};
  const res = { status(c) { w.code = c; return res; }, json(b) { w.body = b; return res; }, setHeader() {} };
  try { await health({ method: 'GET', query: {} }, res); } finally { stubForHealth = false; }
  return w;
}

describe('both server Supabase helpers accept the same key names', () => {
  it.each(['SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_KEY'])('%s alone configures both', async (name) => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env[name] = 'k'.repeat(40);
    expect(isSupabaseAdminConfigured()).toBe(true);
    expect(await getSupabaseServer()).not.toBeNull();
  });
});

describe('/api/health reports admin readiness', () => {
  it('is adminReady:false — and says why — when the secret is unset, without failing public uptime', async () => {
    const r = await getHealth();
    expect(r.code).toBe(200);
    expect(r.body.ok).toBe(true);
    expect(r.body.adminReady).toBe(false);
    expect(r.body.checks.admin.tokenSecret).toMatchObject({ configured: false });
    expect(r.body.checks.admin.tokenSecret.reason).toMatch(/ADMIN_TOKEN_SECRET/);
    expect(r.body.checks.admin.writeClient.configured).toBe(false);
  });

  it('flags a too-short secret as not configured', () => {
    process.env.ADMIN_TOKEN_SECRET = 'short';
    expect(adminSecretStatus()).toMatchObject({ configured: false });
  });

  it('is adminReady:true with a valid secret and either key name, and never echoes a value', async () => {
    const secret = 's'.repeat(48);
    const key = 'service-role-value-that-must-not-leak-0123456789';
    process.env.ADMIN_TOKEN_SECRET = secret;
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = key;
    const r = await getHealth();
    expect(r.body.adminReady).toBe(true);
    const text = JSON.stringify(r.body);
    expect(text).not.toContain(secret);
    expect(text).not.toContain(key);
  });
});
