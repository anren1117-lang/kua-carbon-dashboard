// Authorization tests for the admin write routes that replaced direct
// browser writes to Supabase.
//
// WHAT THESE DO AND DO NOT PROVE.
//
// These are MOCKED tests. They exercise the real handlers — real
// verifyAdminRequest, real input validation, real status codes — but the
// Supabase client is stubbed, so nothing touches a database. They prove the
// authorization and validation layers behave, not that a row lands in
// Postgres. Database persistence needs a test project and is tracked
// separately; see CLAUDE.md > Supabase.
//
// The hole they guard: bms_meter_map and bms_export_summaries were written
// straight from the browser with the publishable anon key, which works only
// because RLS granted `anon` insert/update/delete. That key ships in the
// bundle, so those writes were open to anyone. Both now require an admin
// bearer and a server-only service-role credential.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { signAdminToken } from '../utils/adminToken.js';

process.env.ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET
  || 'test-admin-secret-12345678901234567890abcdefABCDEF';

// A service-role credential must be present or the handlers 503 before they
// reach any authorization logic. Values are fake; nothing connects out.
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  || 'test-service-role-key-not-a-real-credential';

// Stub OUR seam (api/_lib/supabaseAdmin.js), not @supabase/supabase-js.
//
// Mocking the third-party package does not work here: api/ lives outside the
// vitest root (src/), so its import of @supabase/supabase-js resolves to a
// module instance vitest's mock never intercepts — the handlers fell through
// to the real client and returned 502 "TypeError: fetch failed". Mocking the
// project's own boundary is both reliable and the right level: it leaves the
// handler's authorization, validation and status codes real.
//
// `calls` records what the handler asked the database for, which is how the
// "only the six known columns are forwarded" assertion is made.
const calls = [];
let throwOnGet = null;
const stubClient = {
  from(table) {
    return {
      upsert: (rows) => { calls.push({ table, op: 'upsert', rows }); return Promise.resolve({ error: null }); },
      insert: (rows) => { calls.push({ table, op: 'insert', rows }); return Promise.resolve({ error: null }); },
      delete: () => ({
        eq:  (col, val) => { calls.push({ table, op: 'delete', col, val }); return Promise.resolve({ error: null }); },
        neq: (col, val) => { calls.push({ table, op: 'deleteAll', col, val }); return Promise.resolve({ error: null }); },
      }),
    };
  },
};
vi.mock('../../api/_lib/supabaseAdmin.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getSupabaseAdmin: () => { if (throwOnGet) throw throwOnGet; return stubClient; },
  };
});

const { default: meterMapHandler } = await import('../../api/admin/bms-meter-map.js');
const { default: exportSummariesHandler } = await import('../../api/admin/bms-export-summaries.js');

function makeRes() {
  const wrap = { statusCode: 0, body: null, headers: {} };
  wrap.res = {
    status(c) { wrap.statusCode = c; return wrap.res; },
    json(b) { wrap.body = b; return wrap.res; },
    setHeader(k, v) { wrap.headers[k] = v; },
  };
  return wrap;
}
const call = async (handler, req) => {
  const w = makeRes();
  await handler(req, w.res);
  return w;
};
const authed = () => ({ authorization: `Bearer ${signAdminToken().token}` });

beforeEach(() => { calls.length = 0; });
afterEach(() => { vi.clearAllMocks(); });

const validRow = () => ({
  source_file: 'bms-export-apr-2026.csv',
  window_start: '2026-04-01T00:00:00.000Z',
  window_end: '2026-04-30T00:00:00.000Z',
  hours_covered: 720,
  meter_count: 104,
  summary: { PM_01: { kwh: 1234 } },
});

describe('/api/admin/bms-meter-map — authorization', () => {
  it('denies an unauthenticated upsert', async () => {
    const r = await call(meterMapHandler, {
      method: 'PUT', body: { entries: [{ meterId: 'PM_01', buildingId: 'b_miller' }] },
    });
    expect(r.statusCode).toBe(401);
    expect(calls).toHaveLength(0); // never reached the database layer
  });

  it('denies a forged bearer', async () => {
    const r = await call(meterMapHandler, {
      method: 'PUT',
      headers: { authorization: 'Bearer forged.token' },
      body: { entries: [{ meterId: 'PM_01', buildingId: 'b_miller' }] },
    });
    expect(r.statusCode).toBe(401);
    expect(calls).toHaveLength(0);
  });

  it('denies an expired token', async () => {
    const r = await call(meterMapHandler, {
      method: 'PUT',
      headers: { authorization: `Bearer ${signAdminToken({ ttlSeconds: -60 }).token}` },
      body: { entries: [{ meterId: 'PM_01', buildingId: 'b_miller' }] },
    });
    expect(r.statusCode).toBe(401);
    expect(r.body.error).toMatch(/expired/i);
  });

  it('denies an unauthenticated clear-all — the most destructive call', async () => {
    const r = await call(meterMapHandler, { method: 'DELETE', body: { all: true } });
    expect(r.statusCode).toBe(401);
    expect(calls).toHaveLength(0);
  });

  it('allows an authorized upsert', async () => {
    const r = await call(meterMapHandler, {
      method: 'PUT',
      headers: authed(),
      body: { entries: [{ meterId: 'PM_01', buildingId: 'b_miller' }] },
    });
    expect(r.statusCode).toBe(200);
    expect(r.body.upserted).toBe(1);
    expect(calls[0]).toMatchObject({ table: 'bms_meter_map', op: 'upsert' });
    expect(calls[0].rows[0]).toMatchObject({ meter_id: 'PM_01', building_id: 'b_miller' });
  });

  it('allows an authorized single delete and clear-all', async () => {
    const one = await call(meterMapHandler, {
      method: 'DELETE', headers: authed(), body: { meterId: 'PM_01' },
    });
    expect(one.statusCode).toBe(200);
    expect(calls[0]).toMatchObject({ op: 'delete', col: 'meter_id', val: 'PM_01' });

    const all = await call(meterMapHandler, {
      method: 'DELETE', headers: authed(), body: { all: true },
    });
    expect(all.statusCode).toBe(200);
    expect(calls[1]).toMatchObject({ op: 'deleteAll' });
  });
});

describe('/api/admin/bms-meter-map — validation (authorized)', () => {
  it('rejects a non-array entries field', async () => {
    const r = await call(meterMapHandler, { method: 'PUT', headers: authed(), body: { entries: 'nope' } });
    expect(r.statusCode).toBe(400);
  });

  it('rejects a missing or non-string id', async () => {
    const r = await call(meterMapHandler, {
      method: 'PUT', headers: authed(), body: { entries: [{ meterId: 'PM_01', buildingId: 42 }] },
    });
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toMatch(/buildingId/);
  });

  it('rejects an over-long id rather than storing it', async () => {
    const r = await call(meterMapHandler, {
      method: 'PUT', headers: authed(),
      body: { entries: [{ meterId: 'x'.repeat(201), buildingId: 'b_miller' }] },
    });
    expect(r.statusCode).toBe(400);
  });

  it('does NOT treat a malformed delete body as clear-all', async () => {
    // The browser code this replaced used .delete().neq('meter_id','') to
    // clear the table. Requiring an explicit { all: true } means a mangled
    // body can never be read as "delete everything".
    const r = await call(meterMapHandler, { method: 'DELETE', headers: authed(), body: { all: 'yes' } });
    expect(r.statusCode).toBe(400);
    expect(calls).toHaveLength(0);
  });

  it('rejects an unsupported method', async () => {
    const r = await call(meterMapHandler, { method: 'GET', headers: authed() });
    expect(r.statusCode).toBe(405);
  });
});

describe('/api/admin/bms-export-summaries — authorization', () => {
  it('denies an unauthenticated insert', async () => {
    const r = await call(exportSummariesHandler, { method: 'POST', body: { row: validRow() } });
    expect(r.statusCode).toBe(401);
    expect(calls).toHaveLength(0);
  });

  it('denies an unauthenticated delete', async () => {
    const r = await call(exportSummariesHandler, { method: 'DELETE', body: { id: 1 } });
    expect(r.statusCode).toBe(401);
    expect(calls).toHaveLength(0);
  });

  it('allows an authorized insert', async () => {
    const r = await call(exportSummariesHandler, { method: 'POST', headers: authed(), body: { row: validRow() } });
    expect(r.statusCode).toBe(200);
    expect(calls[0]).toMatchObject({ table: 'bms_export_summaries', op: 'insert' });
  });

  it('forwards only the six known columns', async () => {
    // The browser no longer decides what lands in the table, so an extra
    // attacker-chosen field must not ride along into the insert.
    const r = await call(exportSummariesHandler, {
      method: 'POST', headers: authed(),
      body: { row: { ...validRow(), id: 999, injected: 'evil' } },
    });
    expect(r.statusCode).toBe(200);
    expect(Object.keys(calls[0].rows[0]).sort()).toEqual(
      ['hours_covered', 'meter_count', 'source_file', 'summary', 'window_end', 'window_start'],
    );
  });
});

describe('/api/admin/bms-export-summaries — validation (authorized)', () => {
  it('rejects a window that ends before it starts', async () => {
    const row = { ...validRow(), window_start: '2026-04-30T00:00:00.000Z', window_end: '2026-04-01T00:00:00.000Z' };
    const r = await call(exportSummariesHandler, { method: 'POST', headers: authed(), body: { row } });
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toMatch(/window_end/);
  });

  it('rejects a non-date window', async () => {
    const r = await call(exportSummariesHandler, {
      method: 'POST', headers: authed(), body: { row: { ...validRow(), window_start: 'whenever' } },
    });
    expect(r.statusCode).toBe(400);
  });

  it('rejects a negative meter_count', async () => {
    const r = await call(exportSummariesHandler, {
      method: 'POST', headers: authed(), body: { row: { ...validRow(), meter_count: -1 } },
    });
    expect(r.statusCode).toBe(400);
  });

  it('rejects a delete with no id', async () => {
    const r = await call(exportSummariesHandler, { method: 'DELETE', headers: authed(), body: {} });
    expect(r.statusCode).toBe(400);
  });
});

describe('server-only credential', () => {
  it('503s when the service-role key is absent, instead of falling back to anon', async () => {
    const { SupabaseAdminUnconfiguredError } =
      await vi.importActual('../../api/_lib/supabaseAdmin.js');
    throwOnGet = new SupabaseAdminUnconfiguredError(['SUPABASE_SERVICE_ROLE_KEY']);
    try {
      const r = await call(meterMapHandler, {
        method: 'PUT', headers: authed(),
        body: { entries: [{ meterId: 'PM_01', buildingId: 'b_miller' }] },
      });
      expect(r.statusCode).toBe(503);
      expect(r.body.error).toMatch(/SUPABASE_SERVICE_ROLE_KEY/);
      expect(calls).toHaveLength(0); // no write attempted
    } finally {
      throwOnGet = null;
    }
  });

  it('names the variable and warns against a VITE_ prefix', async () => {
    // The error message is the only place a deployer is told why the obvious
    // "just add VITE_ to it" fix would be catastrophic: Vite inlines VITE_*
    // into the client bundle, and this key bypasses RLS. Assert the real
    // message rather than that *some* error was thrown.
    // importActual: the mock above replaces getSupabaseAdmin, and this test
    // is specifically about the real implementation's failure mode.
    const { getSupabaseAdmin } = await vi.importActual('../../api/_lib/supabaseAdmin.js');
    const saved = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    try {
      let caught;
      try { getSupabaseAdmin(); } catch (e) { caught = e; }
      expect(caught, 'expected getSupabaseAdmin to throw').toBeTruthy();
      expect(caught.code).toBe('SUPABASE_ADMIN_UNCONFIGURED');
      expect(caught.missing).toContain('SUPABASE_SERVICE_ROLE_KEY');
      expect(caught.message).toMatch(/VITE_/);
      expect(caught.message).toMatch(/row-level security/i);
    } finally {
      process.env.SUPABASE_SERVICE_ROLE_KEY = saved;
    }
  });
});
