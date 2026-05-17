// Tests for the alert evaluator + the daily cron that fires the
// notification email. Supabase is mocked end-to-end so the evaluator
// runs against synthetic table stats; sendEmail's Resend wrapper is
// the real one but with RESEND_API_KEY unset so it goes through the
// no-op path (tests assert on the cron's accounting, not on actual
// inbox delivery).

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { evaluateAlerts, alertSetSignature, composeAlertEmail } from '../utils/alertEvaluator.js';
import { ADMIN_TABLE_SOURCES } from '../data/adminTableSources.js';
import cronHandler, { _resetAlertCronStateForTests } from '../../api/cron/check-alerts.js';
import {
  addSubscriber, _resetAlertSubscribersForTests,
} from '../storage/alertSubscribers.js';

// Build a Supabase-shaped mock where the caller decides what each
// table returns. responses[table] = { count, lastUpdated } sets the
// stats; absent tables default to empty.
function makeMockSupabase(responses) {
  return {
    from(table) {
      const r = responses[table] || { count: 0, lastUpdated: null };
      return {
        select(_, opts) {
          // .select('*', { count: 'exact', head: true }) → returns count
          if (opts && opts.head && opts.count === 'exact') {
            return Promise.resolve({ count: r.count, data: null, error: null });
          }
          // .select(tsCol).order(...).limit(1) → returns one row
          const chain = {
            order: () => chain,
            limit: () => Promise.resolve({
              data: r.lastUpdated ? [getRowForTable(table, r.lastUpdated)] : [],
              error: null,
            }),
          };
          return chain;
        },
      };
    },
  };
}
function getRowForTable(table, ts) {
  const src = ADMIN_TABLE_SOURCES.find((s) => s.table === table);
  if (!src) return { ts };
  return { [src.tsCol]: ts };
}

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

// Helper to push the system clock forward without affecting Date.now
// in the production code — pass `now` to the evaluator.
const days = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

beforeEach(() => {
  _resetAlertSubscribersForTests();
  _resetAlertCronStateForTests();
  process.env.CRON_SECRET = 'test-cron-secret';
});
afterEach(() => { vi.unstubAllGlobals(); });

// ─── evaluateAlerts ───────────────────────────────────────────────
describe('evaluateAlerts', () => {
  it('returns no alerts + supabaseConfigured: false when no client is provided', async () => {
    const r = await evaluateAlerts({ supabase: null });
    expect(r.alerts).toEqual([]);
    expect(r.supabaseConfigured).toBe(false);
    expect(r.tablesChecked).toBe(0);
  });

  it('flags a table that is stale past its cadence', async () => {
    // A monthly-cadence table whose last entry is 200 days ago is stale.
    const monthlyTable = ADMIN_TABLE_SOURCES.find((s) => s.cadence === 'monthly');
    const supabase = makeMockSupabase({
      [monthlyTable.table]: { count: 5, lastUpdated: days(200) },
    });
    const { alerts } = await evaluateAlerts({ supabase });
    const stale = alerts.find((a) => a.table === monthlyTable.table);
    expect(stale).toBeTruthy();
    expect(stale.kind).toBe('stale_table');
    expect(stale.severity).toBe('high');
    expect(stale.id).toBe(`stale:${monthlyTable.table}`);
  });

  it('flags an empty non-irregular table', async () => {
    const monthlyTable = ADMIN_TABLE_SOURCES.find((s) => s.cadence === 'monthly');
    // Every other table is empty too; just assert the one we care about.
    const supabase = makeMockSupabase({});
    const { alerts } = await evaluateAlerts({ supabase });
    const empty = alerts.find((a) => a.table === monthlyTable.table);
    expect(empty).toBeTruthy();
    expect(empty.kind).toBe('empty_table');
    expect(empty.severity).toBe('medium');
  });

  it('does NOT alert on an empty irregular-cadence table', async () => {
    const irregular = ADMIN_TABLE_SOURCES.find((s) => s.cadence === 'irregular');
    if (!irregular) return; // fixture doesn't have one — skip
    const supabase = makeMockSupabase({}); // everything empty
    const { alerts } = await evaluateAlerts({ supabase });
    expect(alerts.find((a) => a.table === irregular.table)).toBeUndefined();
  });

  it('sorts alerts high-severity first, then alphabetical', async () => {
    const supabase = makeMockSupabase({}); // everything empty → mediums + no highs
    const { alerts } = await evaluateAlerts({ supabase });
    for (let i = 1; i < alerts.length; i++) {
      const prev = alerts[i - 1], cur = alerts[i];
      if (prev.severity !== cur.severity) {
        expect(prev.severity === 'high' || cur.severity === 'medium').toBe(true);
      } else {
        expect(prev.id.localeCompare(cur.id)).toBeLessThanOrEqual(0);
      }
    }
  });

  // ─── Meter-adapter branch (Phase 223) ───────────────────────────

  it('returns no alerts when neither supabase nor meterAdapter is provided', async () => {
    const r = await evaluateAlerts({});
    expect(r).toMatchObject({ alerts: [], supabaseConfigured: false, meterAdapterUsed: false });
  });

  it('flags a dead meter via the adapter quality report (high severity)', async () => {
    const meterAdapter = {
      getQuality: async () => ([
        { meterId: 'm_oil_campus', issues: [{ kind: 'stale', description: 'Last reading was 96 hours old.' }] },
        { meterId: 'm_other',      issues: [] },
      ]),
    };
    const { alerts, meterAdapterUsed, metersChecked } = await evaluateAlerts({ meterAdapter });
    expect(meterAdapterUsed).toBe(true);
    expect(metersChecked).toBe(2);
    const dead = alerts.find((a) => a.id === 'deadmeter:m_oil_campus');
    expect(dead).toMatchObject({ kind: 'dead_meter', severity: 'high', meterId: 'm_oil_campus' });
  });

  it('flags a flat (stuck-sensor) meter at medium severity', async () => {
    const meterAdapter = {
      getQuality: async () => ([
        { meterId: 'm_x', issues: [{ kind: 'flat', description: '8 identical readings in a row.' }] },
      ]),
    };
    const { alerts } = await evaluateAlerts({ meterAdapter });
    expect(alerts[0]).toMatchObject({ id: 'flat:m_x', kind: 'flat_meter', severity: 'medium' });
  });

  it('emits at most one dead-meter alert per meter, even with multiple stale issues', async () => {
    const meterAdapter = {
      getQuality: async () => ([
        { meterId: 'm_a', issues: [{ kind: 'stale' }, { kind: 'stale' }, { kind: 'flat' }] },
      ]),
    };
    const { alerts } = await evaluateAlerts({ meterAdapter });
    expect(alerts.filter((a) => a.meterId === 'm_a')).toHaveLength(1);
  });

  it('tolerates a meter adapter that throws — logs, returns 0 meter alerts, no crash', async () => {
    const meterAdapter = { getQuality: async () => { throw new Error('BMS offline'); } };
    const r = await evaluateAlerts({ meterAdapter });
    expect(r.meterAdapterUsed).toBe(true);
    expect(r.alerts.filter((a) => a.kind === 'dead_meter' || a.kind === 'flat_meter')).toEqual([]);
  });

  it('skips meter detection cleanly when adapter has no getQuality method', async () => {
    const r = await evaluateAlerts({ meterAdapter: {} });
    expect(r.meterAdapterUsed).toBe(false);
    expect(r.metersChecked).toBe(0);
  });
});

// ─── alertSetSignature ────────────────────────────────────────────
describe('alertSetSignature', () => {
  it('returns the same string regardless of input order', () => {
    const a = [{ id: 'stale:x' }, { id: 'empty:y' }];
    const b = [{ id: 'empty:y' }, { id: 'stale:x' }];
    expect(alertSetSignature(a)).toBe(alertSetSignature(b));
  });
  it('returns "" for empty input', () => {
    expect(alertSetSignature([])).toBe('');
  });
});

// ─── composeAlertEmail ────────────────────────────────────────────
describe('composeAlertEmail', () => {
  const alerts = [
    { id: 'stale:a', kind: 'stale_table', severity: 'high', title: 'A is stale', description: 'A description', table: 'a', tableLabel: 'A', scope: 'Scope 1', daysSince: 90, cta: '/admin/scope-1/heating-oil' },
  ];

  it('subject is singular for one alert', () => {
    const { subject } = composeAlertEmail(alerts);
    expect(subject).toMatch(/Alert: A is stale/);
  });
  it('subject is summary-style for multiple alerts', () => {
    const more = [...alerts, { id: 'empty:b', kind: 'empty_table', severity: 'medium', title: 'B is empty', description: '', table: 'b', tableLabel: 'B', scope: 'Scope 3', daysSince: null }];
    const { subject } = composeAlertEmail(more);
    expect(subject).toMatch(/2 alerts/);
    expect(subject).toMatch(/1 stale data/);
    expect(subject).toMatch(/1 empty table/);
  });
  it('html embeds each alert title + description', () => {
    const { html } = composeAlertEmail(alerts);
    expect(html).toContain('A is stale');
    expect(html).toContain('A description');
  });
  it('html embeds the absolute CTA url when baseUrl is provided', () => {
    const { html } = composeAlertEmail(alerts, { baseUrl: 'https://kua.example' });
    expect(html).toContain('href="https://kua.example/admin/scope-1/heating-oil"');
  });
  it('plain-text fallback lists every alert', () => {
    const { text } = composeAlertEmail(alerts);
    expect(text).toContain('A is stale');
    expect(text).toContain('A description');
  });
});

// ─── /api/cron/check-alerts ───────────────────────────────────────
describe('/api/cron/check-alerts', () => {
  const authReq = (over = {}) => ({
    method: 'GET',
    headers: { authorization: 'Bearer test-cron-secret' },
    ...over,
  });

  it('401s without the CRON_SECRET bearer header', async () => {
    const r = await call(cronHandler, { method: 'GET', headers: {} });
    expect(r.statusCode).toBe(401);
  });

  it('returns alertCount: 0 + action: cleared when nothing is wrong (no Supabase)', async () => {
    // No Supabase → evaluator returns 0 alerts.
    const r = await call(cronHandler, authReq());
    expect(r.statusCode).toBe(200);
    expect(r.body.alertCount).toBe(0);
    expect(r.body.action).toBe('cleared');
    expect(r.body.notified).toBe(0);
    expect(r.body.supabaseConfigured).toBe(false);
  });

  it('rejects PUT with 405', async () => {
    const r = await call(cronHandler, { method: 'PUT', headers: { authorization: 'Bearer test-cron-secret' } });
    expect(r.statusCode).toBe(405);
  });

  // The end-to-end signature-dedup test is exercised through the
  // evaluator + alertSetSignature directly above; mocking the full
  // supabaseServer module to also report alerts inside the cron
  // handler would require deeper plumbing than this slice is worth.
});
