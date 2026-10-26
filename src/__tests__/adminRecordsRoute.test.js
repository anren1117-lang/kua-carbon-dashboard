// /api/admin/records — the single write path for the admin data-entry tables.
//
// MOCKED, like adminWriteRoutes.test.js: the real handler, real
// verifyAdminRequest and real validation, with the service-role client
// stubbed at our own seam. Proves authorization and validation, not that a
// row lands in Postgres.
//
// Two cross-checks matter as much as the handler tests:
//   - every table a browser form writes to is one the route accepts, so a
//     new form cannot ship pointing at a table the server will refuse;
//   - every table the route accepts is locked by the Phase 533 migration, so
//     the server path cannot exist while the anon path stays open.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { signAdminToken } from '../utils/adminToken.js';

process.env.ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET
  || 'test-admin-secret-12345678901234567890abcdefABCDEF';
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  || 'test-service-role-key-not-a-real-credential';

const calls = [];
const stubClient = {
  from(table) {
    return {
      insert: (rows) => { calls.push({ table, op: 'insert', rows }); return Promise.resolve({ error: null }); },
      update: (fields) => ({
        eq: (col, val) => { calls.push({ table, op: 'update', fields, col, val }); return Promise.resolve({ error: null }); },
      }),
      delete: () => ({
        eq: (col, val) => { calls.push({ table, op: 'delete', col, val }); return Promise.resolve({ error: null }); },
      }),
    };
  },
};
vi.mock('../../api/_lib/supabaseAdmin.js', async (importOriginal) => ({
  ...(await importOriginal()),
  getSupabaseAdmin: () => stubClient,
}));

const { default: handler, ADMIN_WRITABLE_TABLES, MAX_ROWS } = await import('../../api/admin/records.js');

async function call(req) {
  const w = { statusCode: 0, body: null, headers: {} };
  const res = {
    status(c) { w.statusCode = c; return res; },
    json(b) { w.body = b; return res; },
    setHeader(k, v) { w.headers[k] = v; },
  };
  await handler(req, res);
  return w;
}
const authed = () => ({ authorization: `Bearer ${signAdminToken().token}` });
const delivery = () => ({ delivery_date: '2026-10-01', gallons: 1200, vendor: 'Irving' });

beforeEach(() => { calls.length = 0; });

describe('/api/admin/records — authorization', () => {
  it.each(['POST', 'PATCH', 'DELETE'])('denies an unauthenticated %s before touching the database', async (method) => {
    const r = await call({ method, body: { table: 'scope1_heating_oil', rows: [delivery()], id: 1, fields: { gallons: 1 } } });
    expect(r.statusCode).toBe(401);
    expect(calls).toHaveLength(0);
  });

  it('denies a forged bearer', async () => {
    const r = await call({ method: 'POST', headers: { authorization: 'Bearer forged.token' },
      body: { table: 'scope1_heating_oil', rows: [delivery()] } });
    expect(r.statusCode).toBe(401);
    expect(calls).toHaveLength(0);
  });
});

describe('/api/admin/records — validation', () => {
  it('inserts an authorized row into an allowed table', async () => {
    const r = await call({ method: 'POST', headers: authed(), body: { table: 'scope1_heating_oil', rows: [delivery()] } });
    expect(r.statusCode).toBe(200);
    expect(r.body.inserted).toBe(1);
    expect(calls[0]).toMatchObject({ table: 'scope1_heating_oil', op: 'insert' });
  });

  it('refuses a table outside the allow-list, including the bms_* tables with their own routes', async () => {
    for (const table of ['admin_audit_log', 'bms_export_summaries', 'alert_subscribers', 'pg_user', '']) {
      const r = await call({ method: 'POST', headers: authed(), body: { table, rows: [delivery()] } });
      expect(r.statusCode, table).toBe(400);
    }
    expect(calls).toHaveLength(0);
  });

  it('refuses server-managed and non-identifier column names', async () => {
    for (const bad of [{ id: 5 }, { created_at: '2020-01-01' }, { 'gallons; drop': 1 }, { 'Gallons': 1 }]) {
      const r = await call({ method: 'POST', headers: authed(),
        body: { table: 'scope1_heating_oil', rows: [{ ...delivery(), ...bad }] } });
      expect(r.statusCode, JSON.stringify(bad)).toBe(400);
    }
    expect(calls).toHaveLength(0);
  });

  it('caps a bulk insert and rejects an empty one', async () => {
    const big = Array.from({ length: MAX_ROWS + 1 }, delivery);
    expect((await call({ method: 'POST', headers: authed(), body: { table: 'waste', rows: big } })).statusCode).toBe(400);
    expect((await call({ method: 'POST', headers: authed(), body: { table: 'waste', rows: [] } })).statusCode).toBe(400);
    const ok = await call({ method: 'POST', headers: authed(), body: { table: 'waste', rows: big.slice(0, MAX_ROWS) } });
    expect(ok.statusCode).toBe(200);
  });

  it('updates and deletes one row by id, and only by id', async () => {
    const u = await call({ method: 'PATCH', headers: authed(), body: { table: 'sinks_trees', id: 7, fields: { dbh_cm: 30 } } });
    expect(u.statusCode).toBe(200);
    expect(calls[0]).toMatchObject({ op: 'update', col: 'id', val: 7, fields: { dbh_cm: 30 } });

    const d = await call({ method: 'DELETE', headers: authed(), body: { table: 'sinks_trees', id: 'uuid-1' } });
    expect(d.statusCode).toBe(200);
    expect(calls[1]).toMatchObject({ op: 'delete', col: 'id', val: 'uuid-1' });

    // No id means no write — never a filterless update or delete.
    for (const method of ['PATCH', 'DELETE']) {
      const r = await call({ method, headers: authed(), body: { table: 'sinks_trees', fields: { dbh_cm: 1 } } });
      expect(r.statusCode).toBe(400);
    }
    expect(calls).toHaveLength(2);
  });

  it('405s other verbs', async () => {
    const r = await call({ method: 'GET', headers: authed(), body: {} });
    expect(r.statusCode).toBe(405);
  });
});

describe('/api/admin/records — coverage', () => {
  const ROOT = path.resolve(process.cwd(), '..');
  const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

  it('accepts every table a browser form writes to', () => {
    const adminDir = path.join(ROOT, 'src/pages/admin');
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true })
      .flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
    const written = new Set();
    for (const f of walk(adminDir).filter((f) => f.endsWith('.js'))) {
      const t = fs.readFileSync(f, 'utf8');
      for (const m of t.matchAll(/useTable\(\s*['"]([a-z0-9_]+)['"]/g)) written.add(m[1]);
      for (const m of t.matchAll(/tableName=["']([a-z0-9_]+)["']/g)) written.add(m[1]);
      for (const m of t.matchAll(/adminInsert\(\s*['"]([a-z0-9_]+)['"]/g)) written.add(m[1]);
    }
    // AI ingestion writes whatever its server allow-list permits.
    const ai = read('api/admin/ai-ingestion.js').match(/const ALLOWED_TABLES = new Set\(\[([\s\S]*?)\]\)/)[1];
    for (const m of ai.matchAll(/'([a-z0-9_]+)'/g)) written.add(m[1]);

    expect(written.size).toBeGreaterThan(15); // the scan found the forms at all
    const refused = [...written].filter((t) => !ADMIN_WRITABLE_TABLES.has(t)).sort();
    expect(refused, `forms write to tables /api/admin/records refuses:\n  ${refused.join('\n  ')}`).toEqual([]);
  });

  it('every table the route writes is locked to public-read by the lockdown migration', () => {
    const sql = read('supabase/migrations/20261025120000_lock_admin_tables.sql');
    const missing = [...ADMIN_WRITABLE_TABLES].filter((t) =>
      !new RegExp(`alter table if exists ${t} enable row level security`).test(sql)
      || !new RegExp(`create policy "public read ${t}"\\s+on ${t} for select using \\(true\\)`).test(sql));
    expect(missing).toEqual([]);
    // And the migration grants no write policy to anyone.
    expect(sql).not.toMatch(/for\s+(insert|update|delete|all)\b/i);
  });
});
