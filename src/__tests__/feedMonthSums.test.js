import { describe, it, expect } from 'vitest';
import {
  parseMeterTrendsCsv,
  sumCampusFeedsByMonth,
  calibrateToMaster,
  daysInMonth,
} from '../data/feedMonthSums.js';

const HEADER = 'timestamp,PM_01_MainFeed_TotalKilowattHours,PM_01_HP01Feed_TotalKilowattHours,PM_02_PanelFeed_TotalKilowattHours';
const csv = (...rows) => parseMeterTrendsCsv([HEADER, ...rows].join('\n'));

describe('sumCampusFeedsByMonth — daily Meter Trends export', () => {
  it('credits each midnight-to-midnight diff to the earlier day, across a month boundary', () => {
    const r = sumCampusFeedsByMonth(csv(
      '2026-01-30T00:00:00.000,100,5,50',
      '2026-01-31T00:00:00.000,110,6,54',
      '2026-02-01T00:00:00.000,125,7,60',
      '2026-02-02T00:00:00.000,130,9,58',
    ));
    // Jan 30 = 10 + 4, Jan 31 = 15 + 6; Feb 1 = 5 − 2 (signed). Submeter excluded.
    expect(r.feedCount).toBe(2);
    expect(r.months['2026-01']).toMatchObject({ kwh: 35, days: 2, missingFeedDays: 0 });
    expect(r.months['2026-02']).toMatchObject({ kwh: 3, days: 1, calendarDays: 28 });
    expect(r.lastFullDay).toBe('2026-02-01');
  });

  it('counts a blank reading as missing feed-days, not zero consumption', () => {
    const r = sumCampusFeedsByMonth(csv(
      '2026-03-01T00:00:00.000,100,0,',
      '2026-03-02T00:00:00.000,110,0,',
      '2026-03-03T00:00:00.000,120,0,40',
      '2026-03-04T00:00:00.000,130,0,44',
    ));
    expect(r.months['2026-03'].kwh).toBe(34);
    expect(r.months['2026-03'].missingFeedDays).toBe(2);
    expect(r.months['2026-03'].missingEstKwh).toBe(8); // 2 days × panel's mean 4 kWh/day
  });

  it('treats a counter reset as missing rather than a huge negative day', () => {
    const r = sumCampusFeedsByMonth(csv(
      '2026-04-01T00:00:00.000,90000,0,10',
      '2026-04-02T00:00:00.000,100,0,20',
    ));
    expect(r.months['2026-04'].kwh).toBe(10);
    expect(r.months['2026-04'].missingFeedDays).toBe(1);
    expect(r.warnings.some((w) => w.includes('implausible'))).toBe(true);
  });

  it('skips non-consecutive rows instead of crediting a multi-day diff to one day', () => {
    const r = sumCampusFeedsByMonth(csv(
      '2026-05-01T00:00:00.000,100,0,0',
      '2026-05-03T00:00:00.000,120,0,0',
    ));
    expect(r.months['2026-05']).toBeUndefined();
    expect(r.warnings[0]).toMatch(/non-consecutive/);
  });
});

describe('calibrateToMaster', () => {
  const full = (kwh, calendarDays, extra = {}) => ({ kwh, days: calendarDays, calendarDays, missingFeedDays: 0, missingEstKwh: 0, ...extra });

  it('uses only complete months with a master capture', () => {
    const months = {
      '2026-01': full(1000, 31, { missingEstKwh: 80 }),  // 8% missing → excluded
      '2026-02': full(1000, 28),
      '2026-03': { ...full(1000, 31), days: 30 },          // a day short → excluded
      '2026-04': full(1000, 30),
      '2026-05': full(1000, 31),                           // no master capture
    };
    const master = ['2026-01', '2026-02', '2026-03', '2026-04'].map((month) => ({ month, displayedTotal: 870 }));
    const cal = calibrateToMaster(months, master);
    expect(cal.months).toEqual(['2026-02', '2026-04']);
    expect(cal.scale).toBeCloseTo(0.87, 5);
  });

  it('returns null when nothing qualifies', () => {
    expect(calibrateToMaster({ '2026-02': full(-5, 28) }, [{ month: '2026-02', displayedTotal: 100 }])).toBeNull();
  });

  it('knows leap Februaries', () => {
    expect(daysInMonth('2028-02')).toBe(29);
    expect(daysInMonth('2026-02')).toBe(28);
  });
});
