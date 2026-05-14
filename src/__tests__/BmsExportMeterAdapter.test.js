// @vitest-environment jsdom
//
// Unit tests for BmsExportMeterAdapter — synthesizes hourly readings
// from the parsed Distech BMS export (daily totals × hour-of-day
// profiles). Tested against the real fixture with invariant-style
// assertions rather than hard-coded values, so it survives a fixture
// regeneration.
//
// The load-bearing invariant: for a day fully inside the export
// window, the synthesized hourly readings must sum back to that day's
// measured daily total — that's the "honest synthesis" the module
// header promises.

import { describe, it, expect } from 'vitest';
import { BmsExportMeterAdapter } from '../adapters/meter/BmsExportMeterAdapter.js';
import { BMS_EXPORT_META, bmsExportMeters } from '../data/bmsExportApr2026.js';
import { DEFAULT_MAPPING } from '../data/bmsExportMapping.js';

describe('BmsExportMeterAdapter.listMeters', () => {
  it('lists one meter per parsed PM device with the adapter shape', async () => {
    const list = await BmsExportMeterAdapter.listMeters();
    expect(list).toHaveLength(BMS_EXPORT_META.meterCount);
    for (const m of list) {
      expect(typeof m.id).toBe('string');
      expect(m.unit).toBe('kWh');
      expect(m.intervalMinutes).toBe(60);
      expect(['electricity', 'solar']).toContain(m.type);
    }
  });

  it('classifies a Solar-named device as type "solar"', async () => {
    const list = await BmsExportMeterAdapter.listMeters();
    const solar = list.filter((m) => /Solar/i.test(m.id));
    // Only assert the classification rule holds; the fixture may or may
    // not contain a solar device.
    expect(solar.every((m) => m.type === 'solar')).toBe(true);
    expect(list.filter((m) => !/Solar/i.test(m.id)).every((m) => m.type === 'electricity')).toBe(true);
  });
});

describe('BmsExportMeterAdapter.getReadings — synthesis', () => {
  // Pick a meter with a daily entry comfortably inside the window so
  // all 24 hours of that day are synthesizable (the window starts
  // mid-day on the first date and ends mid-day on the last).
  const meter = bmsExportMeters.find((m) => (m.daily || []).length > 3);
  const midDay = meter.daily[Math.floor(meter.daily.length / 2)];

  it('synthesizes hourly readings tagged source "bms_export"', async () => {
    const readings = await BmsExportMeterAdapter.getReadings({
      meterId: meter.id,
      start: `${midDay.date}T00:00:00.000Z`,
      end: `${midDay.date}T23:00:00.000Z`,
    });
    expect(readings.length).toBeGreaterThan(0);
    for (const r of readings) {
      expect(r.meterId).toBe(meter.id);
      expect(r.source).toBe('bms_export');
      expect(r.intervalMinutes).toBe(60);
      expect(r.dataQuality).toBe('actual');
    }
  });

  it('synthesized hourly values sum back to the measured daily total (honest-synthesis invariant)', async () => {
    const readings = await BmsExportMeterAdapter.getReadings({
      meterId: meter.id,
      start: `${midDay.date}T00:00:00.000Z`,
      end: `${midDay.date}T23:00:00.000Z`,
    });
    const synthTotal = readings.reduce((s, r) => s + r.value, 0);
    // Per-reading .toFixed(3) rounding accumulates a tiny error across
    // 24 hours — allow a small absolute tolerance.
    expect(synthTotal).toBeCloseTo(midDay.kwh, 1);
  });

  it('returns no synthesized readings for a window entirely after the export', async () => {
    const readings = await BmsExportMeterAdapter.getReadings({
      meterId: meter.id,
      start: '2030-01-01T00:00:00.000Z',
      end: '2030-01-02T00:00:00.000Z',
    });
    // Outside the window the adapter defers to the mock adapter; assert
    // only that nothing carries the measured "bms_export" source.
    expect(readings.every((r) => r.source !== 'bms_export')).toBe(true);
  });
});

describe('BmsExportMeterAdapter.getBuildingEnergy', () => {
  // b_kurth has two PM devices mapped in DEFAULT_MAPPING.
  const MAPPED_BUILDING = 'b_kurth';

  it('aggregates measured energy for a mapped building', async () => {
    const e = await BmsExportMeterAdapter.getBuildingEnergy({
      buildingId: MAPPED_BUILDING,
      start: BMS_EXPORT_META.windowStartIso,
      end: BMS_EXPORT_META.windowEndIso,
    });
    expect(e.buildingId).toBe(MAPPED_BUILDING);
    expect(e.totalKwh).toBeGreaterThan(0);
    expect(e.mtCO2e).toBeGreaterThan(0);
    // dailyKwh buckets are sorted ascending by date.
    const dates = e.dailyKwh.map((d) => d.date);
    expect([...dates].sort()).toEqual(dates);
    // The day buckets sum to the reported total (within rounding).
    const bucketSum = e.dailyKwh.reduce((s, d) => s + d.kwh, 0);
    expect(bucketSum).toBeCloseTo(e.totalKwh, 0);
  });

  it('falls back to the mock adapter for an unmapped building', async () => {
    // A building id that appears in no mapping — adapter must still
    // return a shaped result rather than zeroes/throwing.
    const e = await BmsExportMeterAdapter.getBuildingEnergy({
      buildingId: 'b_definitely_not_mapped',
      start: BMS_EXPORT_META.windowStartIso,
      end: BMS_EXPORT_META.windowEndIso,
    });
    expect(e).toBeTruthy();
    expect(e.buildingId).toBe('b_definitely_not_mapped');
    expect(typeof e.totalKwh).toBe('number');
  });

  it('keeps b_kurth mapped to two PM devices in the defaults', () => {
    // Guards the fixture assumption the mapped-building test relies on.
    const kurthMeters = Object.entries(DEFAULT_MAPPING).filter(([, b]) => b === MAPPED_BUILDING);
    expect(kurthMeters.length).toBe(2);
  });
});

describe('BmsExportMeterAdapter.getQuality', () => {
  it('returns a quality report for every parsed meter', async () => {
    const reports = await BmsExportMeterAdapter.getQuality({
      start: BMS_EXPORT_META.windowStartIso,
      end: BMS_EXPORT_META.windowEndIso,
    });
    expect(reports).toHaveLength(BMS_EXPORT_META.meterCount);
    for (const r of reports) {
      expect(typeof r.meterId).toBe('string');
      expect(r.qualityScore).toBeGreaterThanOrEqual(70);
      expect(r.qualityScore).toBeLessThanOrEqual(95);
      expect(Array.isArray(r.issues)).toBe(true);
    }
  });
});
