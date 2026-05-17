// Unit tests for the alert-history store + the admin read endpoint.
// Runs against the in-memory fallback (no Supabase env in tests).

import { describe, it, expect, beforeEach } from 'vitest';
import {
  recordAlertSend, listAlertHistory, _resetAlertHistoryForTests,
} from '../storage/alertHistory.js';
import alertHistoryHandler from '../../api/admin/alert-history.js';
import { signAdminToken } from '../utils/adminToken.js';

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
async function call(req) {
  const w = makeRes();
  await alertHistoryHandler(req, w.res);
  return w;
}
const adminHeaders = () => ({ authorization: `Bearer ${signAdminToken().token}` });

const sample = (over = {}) => ({
  sentAt: '2026-05-17T13:00:00.000Z',
  signature: 'stale:scope1_heating_oil',
  alertCount: 1,
  alerts: [{ id: 'stale:scope1_heating_oil', severity: 'high', title: 'Heating oil stale', kind: 'stale_table' }],
  subscriberCount: 2,
  deliveredCount: 2,
  noProvider: false,
  ...over,
});

beforeEach(() => { _resetAlertHistoryForTests(); });

describe('alertHistory store — memory fallback', () => {
  it('records nothing initially', async () => {
    expect(await listAlertHistory()).toEqual([]);
  });

  it('records + lists in newest-first order', async () => {
    await recordAlertSend(sample({ sentAt: '2026-05-15T13:00:00Z', signature: 'old' }));
    await recordAlertSend(sample({ sentAt: '2026-05-17T13:00:00Z', signature: 'new' }));
    const list = await listAlertHistory();
    expect(list).toHaveLength(2);
    expect(list[0].signature).toBe('new');
    expect(list[1].signature).toBe('old');
  });

  it('reports recorded:true, persisted:false in the memory-only path', async () => {
    const r = await recordAlertSend(sample());
    expect(r).toEqual({ recorded: true, persisted: false });
  });

  it('normalizes missing fields to sane defaults', async () => {
    await recordAlertSend({ signature: 'x' });
    const [entry] = await listAlertHistory();
    expect(entry.alertCount).toBe(0);
    expect(entry.subscriberCount).toBe(0);
    expect(entry.deliveredCount).toBe(0);
    expect(entry.noProvider).toBe(false);
    expect(Array.isArray(entry.alerts)).toBe(true);
    expect(typeof entry.sentAt).toBe('string');
  });

  it('caps the in-memory log at 100 entries', async () => {
    for (let i = 0; i < 110; i++) {
      await recordAlertSend(sample({ signature: `sig-${i}` }));
    }
    const list = await listAlertHistory(200);
    expect(list).toHaveLength(100);
    expect(list[0].signature).toBe('sig-109');
    expect(list[99].signature).toBe('sig-10');
  });

  it('honors the listAlertHistory limit', async () => {
    for (let i = 0; i < 30; i++) await recordAlertSend(sample({ signature: `s${i}` }));
    expect(await listAlertHistory(5)).toHaveLength(5);
  });

  it('clamps the limit to [1, 200]', async () => {
    for (let i = 0; i < 5; i++) await recordAlertSend(sample({ signature: `s${i}` }));
    expect(await listAlertHistory(0)).toHaveLength(1);     // floor
    expect(await listAlertHistory(99999)).toHaveLength(5); // ceiling but only 5 exist
  });
});

describe('/api/admin/alert-history', () => {
  it('405s a POST', async () => {
    const r = await call({ method: 'POST', headers: adminHeaders(), query: {} });
    expect(r.statusCode).toBe(405);
    expect(r.headers.Allow).toBe('GET');
  });

  it('401s without an admin token', async () => {
    const r = await call({ method: 'GET', headers: {}, query: {} });
    expect(r.statusCode).toBe(401);
  });

  it('200s + returns the most recent entries', async () => {
    await recordAlertSend(sample({ signature: 'a' }));
    await recordAlertSend(sample({ signature: 'b' }));
    const r = await call({ method: 'GET', headers: adminHeaders(), query: {} });
    expect(r.statusCode).toBe(200);
    expect(r.body.count).toBe(2);
    expect(r.body.entries.map((e) => e.signature)).toEqual(['b', 'a']);
  });

  it('honors the ?limit= query parameter', async () => {
    for (let i = 0; i < 5; i++) await recordAlertSend(sample({ signature: `s${i}` }));
    const r = await call({ method: 'GET', headers: adminHeaders(), query: { limit: '3' } });
    expect(r.statusCode).toBe(200);
    expect(r.body.entries).toHaveLength(3);
  });

  it('falls back to the default limit on garbage query input', async () => {
    for (let i = 0; i < 25; i++) await recordAlertSend(sample({ signature: `s${i}` }));
    const r = await call({ method: 'GET', headers: adminHeaders(), query: { limit: 'oops' } });
    expect(r.statusCode).toBe(200);
    expect(r.body.entries).toHaveLength(20); // default
  });
});
