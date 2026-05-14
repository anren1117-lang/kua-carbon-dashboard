// Unit tests for parseMeterCsv — the CSV → MeterReading parser behind
// the /data-admin upload form and CsvMeterAdapter. This module is
// security-relevant (it rejects PII columns so accidental student-data
// uploads can't land) and full of parsing edge cases, so lock it down.
//
// Regression focus: Number('') === 0, which previously let an empty
// `value` cell through as a phantom 0-kWh reading and recorded an
// empty `demand_kw` cell as a 0 kW demand peak.

import { describe, it, expect } from 'vitest';
import { parseMeterCsv } from '../utils/csvMeterParser.js';

// m_oil_campus is a stable, hardcoded meter id (buildingId b_miller,
// type 'gas') — the per-building electricity meters are generated
// dynamically, so use this one for deterministic assertions.
const METER = 'm_oil_campus';
const HEADER = 'meter_id,timestamp,value,unit,interval_minutes';
const row = (over = {}) => {
  const f = {
    meter_id: METER, timestamp: '2026-04-15T12:00:00Z',
    value: '100', unit: 'gallon', interval_minutes: '1440',
    ...over,
  };
  return [f.meter_id, f.timestamp, f.value, f.unit, f.interval_minutes].join(',');
};

describe('parseMeterCsv — input guards', () => {
  it('rejects empty / non-string input', () => {
    expect(parseMeterCsv('').errors).toEqual(['empty input']);
    expect(parseMeterCsv('   ').errors).toEqual(['empty input']);
    expect(parseMeterCsv(null).errors).toEqual(['empty input']);
    expect(parseMeterCsv(undefined).errors).toEqual(['empty input']);
  });

  it('rejects a header with no data rows', () => {
    const { readings, errors } = parseMeterCsv(HEADER);
    expect(readings).toEqual([]);
    expect(errors[0]).toMatch(/header plus at least one data row/);
  });

  it('strips a leading UTF-8 BOM so the first column still matches', () => {
    const { readings, errors } = parseMeterCsv(`﻿${HEADER}\n${row()}`);
    expect(errors).toEqual([]);
    expect(readings).toHaveLength(1);
  });

  it('accepts \\r\\n line endings', () => {
    const { readings, errors } = parseMeterCsv(`${HEADER}\r\n${row()}\r\n`);
    expect(errors).toEqual([]);
    expect(readings).toHaveLength(1);
  });
});

describe('parseMeterCsv — PII guard', () => {
  for (const key of ['name', 'email', 'student_id', 'sis_id', 'address', 'phone']) {
    it(`refuses an upload containing a "${key}" column`, () => {
      const { readings, errors } = parseMeterCsv(`${HEADER},${key}\n${row()},x`);
      expect(readings).toEqual([]);
      expect(errors[0]).toMatch(new RegExp(`"${key}".*personal data`));
    });
  }

  it('catches PII columns regardless of header case', () => {
    const { errors } = parseMeterCsv(`${HEADER},EMAIL\n${row()},a@b.c`);
    expect(errors[0]).toMatch(/personal data/);
  });

  it('reports PII before any other validation (short-circuits)', () => {
    // Missing required column AND a PII column — PII wins, and it's
    // the only error reported.
    const { errors } = parseMeterCsv(`meter_id,timestamp,email\n${METER},2026-04-15,a@b.c`);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/personal data/);
  });
});

describe('parseMeterCsv — required columns', () => {
  it('reports every missing required column', () => {
    const { errors } = parseMeterCsv('meter_id,timestamp\nx,y');
    expect(errors).toContain('missing required column "value"');
    expect(errors).toContain('missing required column "unit"');
    expect(errors).toContain('missing required column "interval_minutes"');
  });

  it('accepts required columns in any order', () => {
    const csv = `interval_minutes,unit,value,timestamp,meter_id\n1440,gallon,100,2026-04-15T12:00:00Z,${METER}`;
    const { readings, errors } = parseMeterCsv(csv);
    expect(errors).toEqual([]);
    expect(readings[0].value).toBe(100);
  });

  it('matches headers case-insensitively', () => {
    const csv = `METER_ID,TimeStamp,VALUE,Unit,Interval_Minutes\n${METER},2026-04-15T12:00:00Z,100,gallon,1440`;
    const { readings, errors } = parseMeterCsv(csv);
    expect(errors).toEqual([]);
    expect(readings).toHaveLength(1);
  });
});

describe('parseMeterCsv — per-row validation', () => {
  it('produces a fully-shaped reading for a valid row', () => {
    const { readings } = parseMeterCsv(`${HEADER}\n${row()}`);
    expect(readings[0]).toMatchObject({
      meterId: METER,
      buildingId: 'b_miller',
      meterType: 'gas',
      timestamp: '2026-04-15T12:00:00.000Z',
      intervalMinutes: 1440,
      value: 100,
      unit: 'gallon',
      dataQuality: 'actual',
      source: 'csv',
    });
    expect(readings[0].demandKw).toBeUndefined();
  });

  it('rejects an unknown meter_id', () => {
    const { readings, errors } = parseMeterCsv(`${HEADER}\n${row({ meter_id: 'm_bogus' })}`);
    expect(readings).toEqual([]);
    expect(errors[0]).toMatch(/unknown meter_id "m_bogus"/);
  });

  it('rejects a non-numeric value', () => {
    const { errors } = parseMeterCsv(`${HEADER}\n${row({ value: 'abc' })}`);
    expect(errors[0]).toMatch(/value "abc" is not numeric/);
  });

  it('rejects an empty value cell instead of recording a phantom 0 (regression)', () => {
    const { readings, errors } = parseMeterCsv(`${HEADER}\n${row({ value: '' })}`);
    expect(readings).toEqual([]);
    expect(errors[0]).toMatch(/row 2: value is missing/);
  });

  it('accepts a genuine 0 value', () => {
    const { readings, errors } = parseMeterCsv(`${HEADER}\n${row({ value: '0' })}`);
    expect(errors).toEqual([]);
    expect(readings[0].value).toBe(0);
  });

  it('rejects an invalid timestamp', () => {
    const { errors } = parseMeterCsv(`${HEADER}\n${row({ timestamp: 'not-a-date' })}`);
    expect(errors[0]).toMatch(/timestamp "not-a-date" is not a valid date/);
  });

  it('rejects an interval_minutes outside the allowed set', () => {
    const { errors } = parseMeterCsv(`${HEADER}\n${row({ interval_minutes: '45' })}`);
    expect(errors[0]).toMatch(/interval_minutes must be 15, 30, 60, or 1440 \(got 45\)/);
  });

  it('keeps valid rows even when other rows error (partial success)', () => {
    const csv = [HEADER, row(), row({ value: 'bad' }), row({ timestamp: '2026-04-16T12:00:00Z' })].join('\n');
    const { readings, errors } = parseMeterCsv(csv);
    expect(readings).toHaveLength(2);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/row 3/);
  });
});

describe('parseMeterCsv — optional demand_kw', () => {
  const H = `${HEADER},demand_kw`;

  it('records a valid demand_kw', () => {
    const { readings } = parseMeterCsv(`${H}\n${row()},42.5`);
    expect(readings[0].demandKw).toBe(42.5);
  });

  it('leaves demandKw undefined for an empty demand_kw cell (regression)', () => {
    // Number('') === 0 previously recorded this as a phantom 0 kW peak.
    const { readings } = parseMeterCsv(`${H}\n${row()},`);
    expect(readings[0].demandKw).toBeUndefined();
  });

  it('leaves demandKw undefined for a non-numeric demand_kw cell', () => {
    const { readings } = parseMeterCsv(`${H}\n${row()},lots`);
    expect(readings[0].demandKw).toBeUndefined();
  });
});

describe('parseMeterCsv — optional data_quality', () => {
  const H = `${HEADER},data_quality`;

  it('passes through a recognized data_quality value', () => {
    const { readings } = parseMeterCsv(`${H}\n${row()},estimated`);
    expect(readings[0].dataQuality).toBe('estimated');
  });

  it('falls back to "actual" for an unrecognized data_quality value', () => {
    const { readings } = parseMeterCsv(`${H}\n${row()},garbage`);
    expect(readings[0].dataQuality).toBe('actual');
  });
});

describe('parseMeterCsv — CSV splitting (RFC-4180-ish)', () => {
  it('handles quoted commas inside a field', () => {
    // A quoted unit field with an embedded comma must not split.
    const csv = `${HEADER}\n${METER},2026-04-15T12:00:00Z,100,"gallon, US",1440`;
    const { readings, errors } = parseMeterCsv(csv);
    expect(errors).toEqual([]);
    expect(readings[0].unit).toBe('gallon, US');
  });

  it('handles escaped double-quotes inside a quoted field', () => {
    const csv = `${HEADER}\n${METER},2026-04-15T12:00:00Z,100,"the ""big"" tank",1440`;
    const { readings } = parseMeterCsv(csv);
    expect(readings[0].unit).toBe('the "big" tank');
  });
});
