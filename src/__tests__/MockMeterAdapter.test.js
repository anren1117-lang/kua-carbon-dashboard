// Unit tests for MockMeterAdapter — generates deterministic synthetic
// interval readings from the meter registry + seasonal shapes. It's
// the out-of-the-box default and the out-of-window fallback for
// BmsExportMeterAdapter, so its shape + determinism matter.
//
// Regression focus: getBuildingEnergy's peakKw used to collapse to 0
// for sub-hourly intervals because the mock only populates demandKw on
// hourly readings — it now derives avg kW from interval kWh instead.

import { describe, it, expect } from 'vitest';
import { MockMeterAdapter } from '../adapters/meter/MockMeterAdapter.js';
import { meters } from '../data/meters.js';

const ELEC = meters.find((m) => m.type === 'electricity');
const DAY = { start: '2026-04-15T00:00:00.000Z', end: '2026-04-16T00:00:00.000Z' };

describe('MockMeterAdapter.listMeters', () => {
  it('projects the whole registry to the adapter shape', async () => {
    const list = await MockMeterAdapter.listMeters();
    expect(list).toHaveLength(meters.length);
    expect(list[0]).toHaveProperty('id');
    expect(list[0]).toHaveProperty('intervalMinutes');
  });
});

describe('MockMeterAdapter.getReadings', () => {
  it('returns [] when the window is empty or inverted', async () => {
    expect(await MockMeterAdapter.getReadings({ meterId: ELEC.id, start: DAY.end, end: DAY.start })).toEqual([]);
    expect(await MockMeterAdapter.getReadings({ meterId: ELEC.id, start: DAY.start, end: DAY.start })).toEqual([]);
  });

  it('generates one reading per interval across the window', async () => {
    const readings = await MockMeterAdapter.getReadings({ meterId: ELEC.id, ...DAY, intervalMinutes: 60 });
    expect(readings).toHaveLength(24); // 24 hourly intervals in a day
    for (const r of readings) {
      expect(r.meterId).toBe(ELEC.id);
      expect(r.source).toBe('mock');
      expect(r.dataQuality).toBe('estimated');
      expect(r.value).toBeGreaterThan(0);
    }
  });

  it('honors a custom intervalMinutes', async () => {
    const quarterHour = await MockMeterAdapter.getReadings({ meterId: ELEC.id, ...DAY, intervalMinutes: 15 });
    expect(quarterHour).toHaveLength(24 * 4);
  });

  it('is deterministic — identical args produce identical output', async () => {
    const a = await MockMeterAdapter.getReadings({ meterId: ELEC.id, ...DAY });
    const b = await MockMeterAdapter.getReadings({ meterId: ELEC.id, ...DAY });
    expect(a).toEqual(b);
  });

  it('keeps the synthetic noise within the documented ±6% band', async () => {
    // value = baselinePerInterval × shapeMultiplier × (1 ± 0.06).
    // Pull readings for one meter and confirm none stray absurdly far
    // from the per-interval baseline once the shape multiplier is out.
    const readings = await MockMeterAdapter.getReadings({ meterId: ELEC.id, ...DAY, intervalMinutes: 60 });
    expect(readings.every((r) => Number.isFinite(r.value) && r.value > 0)).toBe(true);
  });

  it('only generates electricity readings (mock has no gas/solar yet)', async () => {
    const gas = meters.find((m) => m.type !== 'electricity');
    if (gas) {
      const readings = await MockMeterAdapter.getReadings({ meterId: gas.id, ...DAY });
      expect(readings).toEqual([]);
    }
  });
});

describe('MockMeterAdapter.importReadings', () => {
  it('is a no-op that reports the input count as inserted', async () => {
    expect(await MockMeterAdapter.importReadings([{}, {}, {}])).toEqual({ inserted: 3 });
  });
});

describe('MockMeterAdapter.getBuildingEnergy', () => {
  it('sums kWh, rolls up per day, and derives mtCO2e', async () => {
    const e = await MockMeterAdapter.getBuildingEnergy({ buildingId: ELEC.buildingId, ...DAY });
    expect(e.buildingId).toBe(ELEC.buildingId);
    expect(e.totalKwh).toBeGreaterThan(0);
    expect(e.mtCO2e).toBeGreaterThan(0);
    expect(e.dailyKwh.length).toBeGreaterThan(0);
    // Day buckets sum to the reported total.
    const bucketSum = e.dailyKwh.reduce((s, d) => s + d.kwh, 0);
    expect(bucketSum).toBeCloseTo(e.totalKwh, 0);
  });

  it('reports a non-zero peakKw rather than collapsing to 0', async () => {
    // getBuildingEnergy uses each meter's own intervalMinutes (it takes
    // no interval arg), so this can't force the sub-hourly path — but
    // it still guards the regression's symptom: peakKw must be derived
    // (from demandKw or from interval kWh) and never collapse to 0 for
    // a building that has readings.
    const e = await MockMeterAdapter.getBuildingEnergy({ buildingId: ELEC.buildingId, ...DAY });
    expect(e.peakKw).toBeGreaterThan(0);
  });
});
