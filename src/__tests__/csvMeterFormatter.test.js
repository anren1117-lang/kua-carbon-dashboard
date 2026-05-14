// Unit tests for formatMeterCsv — the MeterReading[] → CSV serializer
// behind /api/meters/readings/export. The header comment promises a
// round-trip with parseMeterCsv, so test that property directly along
// with RFC-4180 escaping and the nullish-coalescing defaults.

import { describe, it, expect } from 'vitest';
import { formatMeterCsv } from '../utils/csvMeterFormatter.js';
import { parseMeterCsv } from '../utils/csvMeterParser.js';

const HEADER = 'meter_id,timestamp,value,unit,interval_minutes,demand_kw,data_quality';

describe('formatMeterCsv — structure', () => {
  it('emits the canonical header even with no readings', () => {
    expect(formatMeterCsv([])).toBe(HEADER + '\n');
  });

  it('emits one line per reading plus a trailing newline', () => {
    const csv = formatMeterCsv([
      { meterId: 'm1', timestamp: '2026-04-15T12:00:00Z', value: 10, unit: 'kWh', intervalMinutes: 60 },
      { meterId: 'm2', timestamp: '2026-04-15T13:00:00Z', value: 20, unit: 'kWh', intervalMinutes: 60 },
    ]);
    const lines = csv.split('\n');
    expect(lines[0]).toBe(HEADER);
    expect(lines).toHaveLength(4); // header + 2 rows + trailing ''
    expect(lines[3]).toBe('');
  });
});

describe('formatMeterCsv — defaults', () => {
  it('writes an empty demand_kw cell when demandKw is missing', () => {
    const row = formatMeterCsv([
      { meterId: 'm1', timestamp: 't', value: 1, unit: 'kWh', intervalMinutes: 60 },
    ]).split('\n')[1];
    expect(row.endsWith(',,actual')).toBe(true);
  });

  it('preserves a demandKw of 0 (?? keeps 0, only nullish falls through)', () => {
    const row = formatMeterCsv([
      { meterId: 'm1', timestamp: 't', value: 1, unit: 'kWh', intervalMinutes: 60, demandKw: 0 },
    ]).split('\n')[1];
    expect(row).toBe('m1,t,1,kWh,60,0,actual');
  });

  it('defaults dataQuality to "actual" when missing', () => {
    const row = formatMeterCsv([
      { meterId: 'm1', timestamp: 't', value: 1, unit: 'kWh', intervalMinutes: 60 },
    ]).split('\n')[1];
    expect(row.split(',').pop()).toBe('actual');
  });
});

describe('formatMeterCsv — RFC-4180 escaping', () => {
  it('quotes a field containing a comma', () => {
    const row = formatMeterCsv([
      { meterId: 'm1', timestamp: 't', value: 1, unit: 'gallon, US', intervalMinutes: 60 },
    ]).split('\n')[1];
    expect(row).toContain('"gallon, US"');
  });

  it('doubles embedded quotes', () => {
    const row = formatMeterCsv([
      { meterId: 'm1', timestamp: 't', value: 1, unit: 'the "big" tank', intervalMinutes: 60 },
    ]).split('\n')[1];
    expect(row).toContain('"the ""big"" tank"');
  });

  it('quotes a field containing a newline', () => {
    const row = formatMeterCsv([
      { meterId: 'm1', timestamp: 't', value: 1, unit: 'line1\nline2', intervalMinutes: 60 },
    ]).split('\n')[1];
    expect(row).toContain('"line1');
  });
});

describe('formatMeterCsv ↔ parseMeterCsv round-trip', () => {
  // parseMeterCsv validates meter_id against the real registry, so use
  // a stable hardcoded meter. It also enriches the reading with
  // buildingId/meterType/id/source — so we only assert the CSV-relevant
  // fields survive the round-trip.
  const METER = 'm_oil_campus';

  it('round-trips the CSV-relevant fields of a reading', () => {
    const original = {
      meterId: METER,
      timestamp: '2026-04-15T12:00:00.000Z',
      value: 1234.5,
      unit: 'gallon',
      intervalMinutes: 1440,
      demandKw: 7.2,
      dataQuality: 'estimated',
    };
    const { readings, errors } = parseMeterCsv(formatMeterCsv([original]));
    expect(errors).toEqual([]);
    expect(readings).toHaveLength(1);
    expect(readings[0]).toMatchObject(original);
  });

  it('round-trips a reading with no demandKw (stays undefined, not 0)', () => {
    const original = {
      meterId: METER,
      timestamp: '2026-04-15T12:00:00.000Z',
      value: 100,
      unit: 'gallon',
      intervalMinutes: 1440,
    };
    const { readings, errors } = parseMeterCsv(formatMeterCsv([original]));
    expect(errors).toEqual([]);
    expect(readings[0].demandKw).toBeUndefined();
    expect(readings[0].dataQuality).toBe('actual');
  });

  it('round-trips a unit containing a comma through the quote layer', () => {
    const original = {
      meterId: METER,
      timestamp: '2026-04-15T12:00:00.000Z',
      value: 50,
      unit: 'gallon, US',
      intervalMinutes: 1440,
    };
    const { readings, errors } = parseMeterCsv(formatMeterCsv([original]));
    expect(errors).toEqual([]);
    expect(readings[0].unit).toBe('gallon, US');
  });
});
