import { describe, it, expect } from 'vitest';
import {
  composeElectricityLedger,
  mergeLedgerInputs,
  rowsToLedgerInputs,
  monthRangeLabel,
  projectYear1,
  SOURCE_MASTER,
  SOURCE_FEED_SUM,
} from '../data/electricityLedger.js';
import {
  SEED_LEDGER_INPUTS,
  seedLedger,
  COMPOSED_YTD_KWH,
  COMPOSED_YEAR1_KWH,
} from '../data/composedYtd.js';
import { GRID_MIX_ANNUAL_MTCO2E, GRID_MIX_TOTAL_MTCO2E, composeScope2Mt } from '../data/gridMix.js';
import { monthlyPattern } from '../data/seasonalPatterns.js';

const monthRow = (source, month, kwh, extra = {}) => {
  const [y, m] = month.split('-').map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { period_start: `${month}-01`, period_end: `${month}-${String(last).padStart(2, '0')}`, kwh, source, building: null, data_quality: 'measured', ...extra };
};

describe('seed ledger reproduces the shipped Scope 2 numbers', () => {
  it('YTD, anchor, scale and ranges', () => {
    expect(seedLedger.asOf).toBe('2026-09-14');
    expect(seedLedger.ytdKwh).toBe(1105149);
    expect(COMPOSED_YTD_KWH).toBe(1105149);
    expect(COMPOSED_YEAR1_KWH).toBe(1663697);
    expect(seedLedger.scale.value).toBe(0.874);
    expect(seedLedger.scale.months).toEqual(['2026-02', '2026-03', '2026-04']);
    expect(seedLedger.scale.excluded.map((x) => x.month)).toEqual(['2026-01']);
    expect(seedLedger.ranges).toEqual({ master: 'Jan–Apr', scaled: 'May–Sep' });
  });

  it('composeScope2Mt matches the static grid-mix constants', () => {
    const { ytdMt, annualMt } = composeScope2Mt(COMPOSED_YTD_KWH, COMPOSED_YEAR1_KWH);
    expect(ytdMt).toBe(GRID_MIX_TOTAL_MTCO2E);
    expect(annualMt).toBe(GRID_MIX_ANNUAL_MTCO2E);
  });
});

describe('composeElectricityLedger', () => {
  it('lets an admin master-meter total replace a scaled month and recalibrate', () => {
    const inputs = mergeLedgerInputs(SEED_LEDGER_INPUTS, { masterMonths: [{ month: '2026-05', kwh: 120000, source: 'admin' }] });
    const l = composeElectricityLedger(inputs);
    const may = l.months.find((m) => m.month === '2026-05');
    expect(may).toMatchObject({ provenance: 'master', kwh: 120000 });
    expect(l.ranges).toEqual({ master: 'Jan–May', scaled: 'Jun–Sep' });
    expect(l.scale.months).toContain('2026-05');
  });

  it('stops the YTD at a missing month and reports later months as uncounted', () => {
    const l = composeElectricityLedger({
      masterMonths: [{ month: '2026-01', kwh: 100 }, { month: '2026-02', kwh: 100 }],
      feedMonths: [
        { month: '2026-02', kwh: 125, days: 28, calibrationEligible: true },
        { month: '2026-04', kwh: 125, days: 30, calibrationEligible: true },
      ],
    });
    expect(l.months.map((m) => m.month)).toEqual(['2026-01', '2026-02']);
    expect(l.asOf).toBe('2026-02-28');
    expect(l.uncounted).toHaveLength(1);
    expect(l.uncounted[0]).toMatchObject({ month: '2026-04' });
    expect(l.uncounted[0].reason).toMatch(/Mar 2026 has no data/);
  });

  it('ends the run after a partial month', () => {
    const l = composeElectricityLedger({
      masterMonths: [{ month: '2026-01', kwh: 100 }],
      feedMonths: [
        { month: '2026-01', kwh: 125, days: 31, calibrationEligible: true },
        { month: '2026-02', kwh: 50, days: 10, calibrationEligible: false },
        { month: '2026-03', kwh: 125, days: 31, calibrationEligible: true },
      ],
    });
    expect(l.months.map((m) => m.month)).toEqual(['2026-01', '2026-02']);
    expect(l.asOf).toBe('2026-02-10');
    expect(l.months[1]).toMatchObject({ provenance: 'scaled', kwh: 40 }); // 50 × 0.8
    expect(l.uncounted[0].reason).toMatch(/partial/);
  });

  it('refuses to calibrate on a month whose two sources disagree wildly', () => {
    const typo = composeElectricityLedger(mergeLedgerInputs(SEED_LEDGER_INPUTS, {
      masterMonths: [{ month: '2026-02', kwh: 1500000, source: 'admin' }],
    }));
    expect(typo.scale.months).toEqual(['2026-03', '2026-04']);
    expect(typo.scale.excluded.find((x) => x.month === '2026-02').note).toMatch(/differ by more than half/);
    // The bad month is still shown as its own master total, but it can't drag
    // every scaled month with it.
    expect(typo.scale.value).toBeGreaterThan(0.8);
    expect(typo.scale.value).toBeLessThan(0.95);
  });

  it('carries a structural caveat onto a replacement month that still is not calibration-ready', () => {
    const merged = mergeLedgerInputs(SEED_LEDGER_INPUTS, {
      feedMonths: [{ month: '2026-01', kwh: 210000, days: 31, calibrationEligible: false, source: 'Admin upload', note: null }],
    });
    const jan = merged.feedMonths.find((m) => m.month === '2026-01');
    expect(jan.note).toMatch(/no readings Jan 1–19/);
  });

  it("can't count feed-only months without a calibration month", () => {
    const l = composeElectricityLedger({ feedMonths: [{ month: '2026-01', kwh: 125, days: 31, calibrationEligible: true }] });
    expect(l.scale).toBeNull();
    expect(l.months).toEqual([]);
    expect(l.asOf).toBeNull();
    expect(l.uncounted[0].reason).toMatch(/calibrate/);
  });

  it('rolls over to the latest year that has a January, and says what left the page', () => {
    const l = composeElectricityLedger(mergeLedgerInputs(SEED_LEDGER_INPUTS, { masterMonths: [{ month: '2027-01', kwh: 175000 }] }));
    expect(l.year).toBe(2027);
    expect(l.months.map((m) => m.month)).toEqual(['2027-01']);
    expect(l.scale.value).toBe(0.874); // calibration still spans 2026
    expect(l.uncounted.some((u) => /months of 2026/.test(u.reason))).toBe(true);
  });

  it("a stray future month without a January can't take over the page", () => {
    const l = composeElectricityLedger(mergeLedgerInputs(SEED_LEDGER_INPUTS, { masterMonths: [{ month: '2027-05', kwh: 175000 }] }));
    expect(l.year).toBe(2026);
    expect(l.asOf).toBe('2026-09-14');
    expect(l.uncounted.some((u) => /1 month of 2027/.test(u.reason))).toBe(true);
  });
});

describe('rowsToLedgerInputs — scope2_meter_readings rows', () => {
  it('maps master and feed rows, and the newest row for a month wins', () => {
    const { masterMonths, feedMonths, ignored } = rowsToLedgerInputs([
      monthRow(SOURCE_MASTER, '2026-05', 110000),
      monthRow(SOURCE_MASTER, '2026-05', 120000),
      monthRow(SOURCE_FEED_SUM, '2026-06', 99000),
      { ...monthRow(SOURCE_FEED_SUM, '2026-07', 50000), period_end: '2026-07-14', data_quality: 'measured' },
    ]);
    expect(masterMonths).toEqual([expect.objectContaining({ month: '2026-05', kwh: 120000 })]);
    expect(feedMonths[0]).toMatchObject({ month: '2026-06', days: 30, calibrationEligible: true });
    expect(feedMonths[1]).toMatchObject({ month: '2026-07', days: 14, calibrationEligible: false });
    expect(ignored).toEqual([]);
  });

  it('ignores building rows, other sources, cross-month periods and partial master totals', () => {
    const { masterMonths, feedMonths, ignored } = rowsToLedgerInputs([
      monthRow(SOURCE_MASTER, '2026-05', 1, { building: 'b_miller' }),
      monthRow('campus_meter', '2026-05', 1),
      { ...monthRow(SOURCE_FEED_SUM, '2026-05', 1), period_end: '2026-06-02' },
      { ...monthRow(SOURCE_MASTER, '2026-05', 1), period_end: '2026-05-20' },
      { ...monthRow(SOURCE_FEED_SUM, '2026-05', 1), period_start: '2026-05-03' },
    ]);
    expect(masterMonths).toEqual([]);
    expect(feedMonths).toEqual([]);
    expect(ignored).toHaveLength(5);
  });

  it('marks estimated-quality feed months as not calibration-eligible', () => {
    const { feedMonths } = rowsToLedgerInputs([monthRow(SOURCE_FEED_SUM, '2026-05', 1000, { data_quality: 'estimated' })]);
    expect(feedMonths[0].calibrationEligible).toBe(false);
  });

  it('rejects zero, negative and non-numeric kWh', () => {
    const { masterMonths, feedMonths, ignored } = rowsToLedgerInputs([
      monthRow(SOURCE_MASTER, '2026-05', 0),
      monthRow(SOURCE_MASTER, '2026-06', -120000),
      monthRow(SOURCE_FEED_SUM, '2026-07', 'abc'),
    ]);
    expect(masterMonths).toEqual([]);
    expect(feedMonths).toEqual([]);
    expect(ignored).toHaveLength(3);
  });

  it('marks a feed month saved as estimated so the page can label it', () => {
    const { feedMonths } = rowsToLedgerInputs([monthRow(SOURCE_FEED_SUM, '2026-05', 1000, { data_quality: 'estimated' })]);
    expect(feedMonths[0].estimated).toBe(true);
  });

  it('keeps admin notes (filenames, capture details) out of the public-facing note', () => {
    const { feedMonths } = rowsToLedgerInputs([
      { ...monthRow(SOURCE_FEED_SUM, '2026-07', 1000), period_end: '2026-07-14', notes: 'MeterTrends_final_v2.csv · 14/31 days' },
    ]);
    expect(feedMonths[0].note).toBe('14 of 31 days had readings');
    expect(feedMonths[0].adminNote).toContain('MeterTrends_final_v2.csv');
  });
});

describe('monthRangeLabel', () => {
  it('collapses runs and lists gaps', () => {
    expect(monthRangeLabel(['2026-04', '2026-01', '2026-02'])).toBe('Jan–Feb, Apr');
    expect(monthRangeLabel(['2026-05'])).toBe('May');
    expect(monthRangeLabel([])).toBe('');
  });
});

describe('projectYear1', () => {
  it('is the measured total when all twelve months are covered', () => {
    const components = monthlyPattern.map((_, i) => {
      const period = `2026-${String(i + 1).padStart(2, '0')}`;
      return { period, days: new Date(Date.UTC(2026, i + 1, 0)).getUTCDate(), kwh: 1000 };
    });
    const y1 = projectYear1(components, monthlyPattern);
    expect(y1.year1Kwh).toBe(12000);
    expect(y1.months.every((m) => m.provenance === 'measured')).toBe(true);
  });
});
