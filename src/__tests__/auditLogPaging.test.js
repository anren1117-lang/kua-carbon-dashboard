// @vitest-environment jsdom
//
// Tests for fetchAllAuditLog — the export-everything pager built on
// top of fetchAuditLog. Mocks global fetch so each "page" returns a
// scripted slice. Verifies:
//   1. Loops until total is reached.
//   2. Stops early on a short page (server signals "no more rows").
//   3. Surfaces an error from any individual page without losing the
//      rows already collected.
//   4. Calls onProgress after each successful page.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchAllAuditLog } from '../utils/adminAudit.js';

const SESSION_KEY = 'kua_admin_session';

function setSession() {
  const exp = new Date(Date.now() + 30 * 60_000).toISOString();
  localStorage.setItem(SESSION_KEY, JSON.stringify({ token: 'T', expiresAt: exp }));
}

function makeRow(i) {
  return { id: i, created_at: '2026-05-09T00:00:00Z', action: 'insert', table_name: 'fuel_bills' };
}

function mockPagedFetch(pages) {
  // Each call to fetch returns the next item in `pages`. If the test
  // exhausts the list, fail loudly so we know our bookkeeping was off.
  let i = 0;
  globalThis.fetch = vi.fn(async () => {
    if (i >= pages.length) throw new Error(`fetch called more times than expected (i=${i})`);
    const { rows, total, status = 200 } = pages[i++];
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => ({ rows, total, offset: 0, limit: rows.length }),
    };
  });
  return () => i;
}

beforeEach(() => {
  localStorage.clear();
  setSession();
  vi.restoreAllMocks();
});

describe('fetchAllAuditLog', () => {
  it('returns empty result when the first page is empty', async () => {
    mockPagedFetch([{ rows: [], total: 0 }]);
    const r = await fetchAllAuditLog({ pageSize: 500 });
    expect(r.rows).toHaveLength(0);
    expect(r.total).toBe(0);
    expect(r.error).toBeNull();
  });

  it('paginates until the announced total is reached', async () => {
    // 1200 rows total, page size 500 → 3 pages: 500 + 500 + 200.
    const callsLeft = mockPagedFetch([
      { rows: Array.from({ length: 500 }, (_, k) => makeRow(k)),       total: 1200 },
      { rows: Array.from({ length: 500 }, (_, k) => makeRow(500 + k)), total: 1200 },
      { rows: Array.from({ length: 200 }, (_, k) => makeRow(1000 + k)),total: 1200 },
    ]);
    const r = await fetchAllAuditLog({ pageSize: 500 });
    expect(r.error).toBeNull();
    expect(r.rows).toHaveLength(1200);
    expect(r.total).toBe(1200);
    expect(callsLeft()).toBe(3);
  });

  it('stops early on a short page (server signals "no more rows")', async () => {
    // Page 1 returns 200 rows (< pageSize 500) — no further calls.
    const callsLeft = mockPagedFetch([
      { rows: Array.from({ length: 200 }, (_, k) => makeRow(k)), total: 200 },
      // Second page should never be requested; if it is, the harness
      // throws.
    ]);
    const r = await fetchAllAuditLog({ pageSize: 500 });
    expect(r.rows).toHaveLength(200);
    expect(callsLeft()).toBe(1);
  });

  it('reports per-page progress via onProgress', async () => {
    mockPagedFetch([
      { rows: Array.from({ length: 500 }, (_, k) => makeRow(k)),       total: 1200 },
      { rows: Array.from({ length: 500 }, (_, k) => makeRow(500 + k)), total: 1200 },
      { rows: Array.from({ length: 200 }, (_, k) => makeRow(1000 + k)),total: 1200 },
    ]);
    const progress = [];
    await fetchAllAuditLog({ pageSize: 500, onProgress: (fetched, total) => progress.push([fetched, total]) });
    expect(progress).toEqual([
      [500, 1200],
      [1000, 1200],
      [1200, 1200],
    ]);
  });

  it('surfaces an error from a mid-stream page but keeps prior rows', async () => {
    mockPagedFetch([
      { rows: Array.from({ length: 500 }, (_, k) => makeRow(k)), total: 1200 },
      // Second page errors — adminFetch returns ok:false → fetchAuditLog
      // returns { error }, fetchAllAuditLog short-circuits.
      { rows: [], total: 1200, status: 500 },
    ]);
    const r = await fetchAllAuditLog({ pageSize: 500 });
    expect(r.error).toBeTruthy();
    expect(r.rows).toHaveLength(500);
  });

  it('respects the maxRows ceiling so a runaway server cannot pin the browser', async () => {
    // Server says total = 999999 but pretends every page is full.
    // maxRows clamps us at 1000 (2 pages of 500).
    let i = 0;
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        rows: Array.from({ length: 500 }, (_, k) => makeRow(i * 500 + k)),
        total: 999_999,
        offset: i * 500,
        limit: 500,
      }),
    })).mockImplementation(async () => {
      const offset = i * 500;
      i++;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          rows: Array.from({ length: 500 }, (_, k) => makeRow(offset + k)),
          total: 999_999,
          offset,
          limit: 500,
        }),
      };
    });
    const r = await fetchAllAuditLog({ pageSize: 500, maxRows: 1000 });
    expect(r.rows.length).toBeLessThanOrEqual(1000);
  });
});
