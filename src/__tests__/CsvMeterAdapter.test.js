// Unit tests for CsvMeterAdapter — the MeterDataAdapter implementation
// that serves uploaded-CSV readings out of readingsStore. Runs against
// the in-memory store (no Supabase env in the test environment).
//
// Regression focus: importReadings filters non-finite values —
// typeof NaN === 'number', so the bare typeof check it replaced used
// to admit NaN readings into the store.

import { describe, it, expect, beforeEach } from 'vitest';
import { CsvMeterAdapter, ingestCsv, _resetCsvStore } from '../adapters/meter/CsvMeterAdapter.js';

const HEADER = 'meter_id,timestamp,value,unit,interval_minutes';
const validCsv = [
  HEADER,
  'm_oil_campus,2026-04-10T00:00:00Z,100,gallon,1440',
  'm_oil_campus,2026-04-12T00:00:00Z,150,gallon,1440',
].join('\n');

const WINDOW = { start: '2000-01-01T00:00:00Z', end: '2100-01-01T00:00:00Z' };

beforeEach(() => { _resetCsvStore(); });

describe('CsvMeterAdapter.listMeters', () => {
  it('returns the meter registry projected to the adapter shape', async () => {
    const list = await CsvMeterAdapter.listMeters();
    expect(list.length).toBeGreaterThan(0);
    const oil = list.find((m) => m.id === 'm_oil_campus');
    expect(oil).toMatchObject({ id: 'm_oil_campus', buildingId: 'b_miller', type: 'gas' });
  });
});

describe('ingestCsv', () => {
  it('parses and stores a valid CSV', async () => {
    const { inserted, errors } = await ingestCsv(validCsv);
    expect(errors).toEqual([]);
    expect(inserted).toBe(2);
    const stored = await CsvMeterAdapter.getReadings({ meterId: 'm_oil_campus', ...WINDOW });
    expect(stored).toHaveLength(2);
  });

  it('does not store anything when the CSV has errors', async () => {
    const bad = `${HEADER}\nm_unknown_meter,2026-04-10T00:00:00Z,100,gallon,1440`;
    const { errors } = await ingestCsv(bad);
    expect(errors.length).toBeGreaterThan(0);
    expect(await CsvMeterAdapter.getReadings(WINDOW)).toEqual([]);
  });
});

describe('CsvMeterAdapter.importReadings', () => {
  const base = {
    id: 'r1', meterId: 'm_oil_campus', buildingId: 'b_miller',
    meterType: 'gas', timestamp: '2026-04-10T00:00:00.000Z',
    intervalMinutes: 1440, value: 100, unit: 'gallon',
  };

  it('stores well-formed readings and stamps source/dataQuality', async () => {
    await CsvMeterAdapter.importReadings([base]);
    const [r] = await CsvMeterAdapter.getReadings({ meterId: 'm_oil_campus', ...WINDOW });
    expect(r.source).toBe('csv');
    expect(r.dataQuality).toBe('actual');
  });

  it('filters out readings with a NaN value (regression — typeof NaN is "number")', async () => {
    await CsvMeterAdapter.importReadings([
      base,
      { ...base, id: 'r2', value: NaN },
    ]);
    const stored = await CsvMeterAdapter.getReadings({ meterId: 'm_oil_campus', ...WINDOW });
    expect(stored.map((r) => r.id)).toEqual(['r1']);
  });

  it('filters out readings missing meterId or timestamp', async () => {
    await CsvMeterAdapter.importReadings([
      base,
      { ...base, id: 'r3', meterId: undefined },
      { ...base, id: 'r4', timestamp: undefined },
    ]);
    const stored = await CsvMeterAdapter.getReadings(WINDOW);
    expect(stored.map((r) => r.id)).toEqual(['r1']);
  });

  it('tolerates a null/undefined input', async () => {
    await expect(CsvMeterAdapter.importReadings(null)).resolves.toBeDefined();
  });
});

describe('CsvMeterAdapter.getBuildingEnergy', () => {
  beforeEach(async () => {
    await CsvMeterAdapter.importReadings([
      { id: 'e1', meterId: 'm_oil_campus', buildingId: 'b_miller', meterType: 'gas',
        timestamp: '2026-04-10T08:00:00.000Z', intervalMinutes: 1440, value: 1000, unit: 'kWh', demandKw: 5 },
      { id: 'e2', meterId: 'm_oil_campus', buildingId: 'b_miller', meterType: 'gas',
        timestamp: '2026-04-10T20:00:00.000Z', intervalMinutes: 1440, value: 500, unit: 'kWh', demandKw: 12 },
      { id: 'e3', meterId: 'm_oil_campus', buildingId: 'b_miller', meterType: 'gas',
        timestamp: '2026-04-11T08:00:00.000Z', intervalMinutes: 1440, value: 800, unit: 'kWh', demandKw: 3 },
    ]);
  });

  it('sums kWh, picks the peak demand, and emits per-day buckets', async () => {
    const e = await CsvMeterAdapter.getBuildingEnergy({ buildingId: 'b_miller', ...WINDOW });
    expect(e.totalKwh).toBe(2300);          // 1000 + 500 + 800
    expect(e.peakKw).toBe(12);              // max demandKw
    expect(e.dailyKwh).toEqual([
      { date: '2026-04-10', kwh: 1500 },    // e1 + e2
      { date: '2026-04-11', kwh: 800 },     // e3
    ]);
  });

  it('derives mtCO2e from total kWh via the ISO-NE factor', async () => {
    const e = await CsvMeterAdapter.getBuildingEnergy({ buildingId: 'b_miller', ...WINDOW });
    // 2300 kWh × 0.235 kg / 1000 = 0.5405 mt
    expect(e.mtCO2e).toBeCloseTo(0.5405, 3);
  });

  it('returns zeroed totals for a building with no readings', async () => {
    const e = await CsvMeterAdapter.getBuildingEnergy({ buildingId: 'b_miller', start: '2030-01-01T00:00:00Z', end: '2031-01-01T00:00:00Z' });
    expect(e.totalKwh).toBe(0);
    expect(e.peakKw).toBe(0);
    expect(e.dailyKwh).toEqual([]);
  });
});

describe('CsvMeterAdapter.getQuality', () => {
  it('returns a per-meter report with score + issues for a given meter', async () => {
    const reports = await CsvMeterAdapter.getQuality({ meterId: 'm_oil_campus', ...WINDOW });
    expect(reports).toHaveLength(1);
    expect(reports[0]).toMatchObject({ meterId: 'm_oil_campus', totalReadings: 0 });
    expect(reports[0].qualityScore).toBe(0); // no readings → score 0
    expect(Array.isArray(reports[0].issues)).toBe(true);
  });
});
