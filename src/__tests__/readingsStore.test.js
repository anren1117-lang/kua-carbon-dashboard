// Unit tests for the meter-readings storage abstraction. With no
// Supabase env configured (the test default) every call runs against
// the in-memory store, so these tests exercise that path directly.
//
// Load-bearing behavior: insertReadings dedupes by id so re-running an
// overlapping import is idempotent — the module comment records a past
// bug where overlapping re-imports silently doubled every reading.

import { describe, it, expect, beforeEach } from 'vitest';
import {
  insertReadings, readReadings, _resetReadingsStoreForTests,
} from '../storage/readingsStore.js';

const reading = (over = {}) => ({
  id: 'm_oil_campus_1000',
  meterId: 'm_oil_campus',
  buildingId: 'b_miller',
  meterType: 'gas',
  timestamp: '2026-04-15T12:00:00.000Z',
  intervalMinutes: 1440,
  value: 100,
  unit: 'gallon',
  ...over,
});

// Window helpers — readReadings needs an explicit [start, end).
const ALL = { start: '2000-01-01T00:00:00Z', end: '2100-01-01T00:00:00Z' };

beforeEach(() => { _resetReadingsStoreForTests(); });

describe('insertReadings', () => {
  it('returns { inserted: 0 } for an empty or non-array input', async () => {
    expect(await insertReadings([])).toEqual({ inserted: 0 });
    expect(await insertReadings(null)).toEqual({ inserted: 0 });
    expect(await insertReadings(undefined)).toEqual({ inserted: 0 });
  });

  it('stores readings and reads them back', async () => {
    await insertReadings([reading()]);
    const out = await readReadings({ meterId: 'm_oil_campus', ...ALL });
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('m_oil_campus_1000');
  });

  it('defaults a missing source to "csv"', async () => {
    await insertReadings([reading({ source: undefined })]);
    const [r] = await readReadings({ meterId: 'm_oil_campus', ...ALL });
    expect(r.source).toBe('csv');
  });

  it('dedupes by id — a re-import with the same id does not duplicate', async () => {
    await insertReadings([reading({ value: 100 })]);
    await insertReadings([reading({ value: 250 })]); // same id, new value
    const out = await readReadings({ meterId: 'm_oil_campus', ...ALL });
    expect(out).toHaveLength(1);
    expect(out[0].value).toBe(250); // last write wins
  });

  it('keeps distinct ids side by side', async () => {
    await insertReadings([
      reading({ id: 'a' }),
      reading({ id: 'b', timestamp: '2026-04-16T12:00:00.000Z' }),
    ]);
    const out = await readReadings({ meterId: 'm_oil_campus', ...ALL });
    expect(out.map((r) => r.id).sort()).toEqual(['a', 'b']);
  });
});

describe('readReadings — filtering', () => {
  beforeEach(async () => {
    await insertReadings([
      reading({ id: 'x1', meterId: 'm_oil_campus',     buildingId: 'b_miller',  timestamp: '2026-04-10T00:00:00.000Z' }),
      reading({ id: 'x2', meterId: 'm_propane_campus', buildingId: 'b_silvergym', timestamp: '2026-04-15T00:00:00.000Z' }),
      reading({ id: 'x3', meterId: 'm_oil_campus',     buildingId: 'b_miller',  timestamp: '2026-04-20T00:00:00.000Z' }),
    ]);
  });

  it('filters by meterId', async () => {
    const out = await readReadings({ meterId: 'm_oil_campus', ...ALL });
    expect(out.map((r) => r.id).sort()).toEqual(['x1', 'x3']);
  });

  it('filters by buildingId', async () => {
    const out = await readReadings({ buildingId: 'b_silvergym', ...ALL });
    expect(out.map((r) => r.id)).toEqual(['x2']);
  });

  it('applies a half-open [start, end) time window', async () => {
    // x2 sits exactly on the start bound → included; the end bound is
    // exclusive, so a window ending at x3's timestamp excludes x3.
    const out = await readReadings({
      start: '2026-04-15T00:00:00.000Z',
      end: '2026-04-20T00:00:00.000Z',
    });
    expect(out.map((r) => r.id)).toEqual(['x2']);
  });

  it('returns everything when no meter/building filter is given', async () => {
    const out = await readReadings(ALL);
    expect(out).toHaveLength(3);
  });
});

describe('_resetReadingsStoreForTests', () => {
  it('clears the in-memory store', async () => {
    await insertReadings([reading()]);
    _resetReadingsStoreForTests();
    expect(await readReadings(ALL)).toEqual([]);
  });
});
