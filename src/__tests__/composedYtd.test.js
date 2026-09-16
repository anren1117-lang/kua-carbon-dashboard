import { describe, it, expect } from 'vitest';
import { monthlyReports } from '../data/monthlyConsumption.js';
import {
  seedLedger,
  ytdComponents,
  reconciledMonths,
  COMPOSED_YTD_AS_OF,
  COMPOSED_YTD_DAYS,
  COMPOSED_YTD_DAYS_COVERED,
  COMPOSED_ANNUALIZE_FACTOR,
  SNAPSHOT_ANNUALIZE_FACTOR,
  FEED_TO_MASTER_SCALE,
  annualizeFactorForWindow,
} from '../data/composedYtd.js';

describe('composed YTD — contiguous Jan 1 → anchor', () => {
  it('anchors on the last day of the contiguous seed record', () => {
    expect(COMPOSED_YTD_AS_OF).toBe(seedLedger.asOf);
  });

  it('covers every day from Jan 1 to the anchor exactly once', () => {
    const periods = ytdComponents.map((c) => c.period);
    expect(new Set(periods).size).toBe(periods.length);
    expect(COMPOSED_YTD_DAYS_COVERED).toBe(COMPOSED_YTD_DAYS);
  });

  it('the last scaled month ends on the anchor day', () => {
    const last = reconciledMonths[reconciledMonths.length - 1];
    expect(`${last.month}-${String(last.days).padStart(2, '0')}`).toBe(COMPOSED_YTD_AS_OF);
  });

  it('flags scaled months, and a master-meter capture wins over a scaled month', () => {
    const master = new Set(monthlyReports.map((r) => r.month));
    for (const c of ytdComponents) {
      expect(Boolean(c.reconciled)).toBe(!master.has(c.period));
    }
  });

  it('scales the feed-sum down toward the master meter', () => {
    expect(FEED_TO_MASTER_SCALE).toBeGreaterThan(0.8);
    expect(FEED_TO_MASTER_SCALE).toBeLessThan(0.95);
  });
});

describe('annualizeFactorForWindow — each window by its own seasonal share', () => {
  const year = COMPOSED_YTD_AS_OF.slice(0, 4);

  it('is ×1 for the whole year', () => {
    expect(annualizeFactorForWindow(`${year}-01-01`, `${year}-12-31`)).toBeCloseTo(1, 5);
  });

  it('roughly reproduces the headline factor for Jan 1 → the YTD anchor', () => {
    const f = annualizeFactorForWindow(`${year}-01-01`, COMPOSED_YTD_AS_OF);
    expect(Math.abs(f / COMPOSED_ANNUALIZE_FACTOR - 1)).toBeLessThan(0.03);
  });

  it('gives a 30-day spring window a far larger factor than the YTD one', () => {
    expect(annualizeFactorForWindow(`${year}-04-05`, `${year}-05-04`)).toBeGreaterThan(8);
  });

  it('returns null for a window outside the reported year, never a silent ×1', () => {
    const prev = Number(year) - 1;
    const next = Number(year) + 1;
    expect(annualizeFactorForWindow(`${prev}-04-01`, `${prev}-04-30`)).toBeNull();
    expect(annualizeFactorForWindow(`${next}-04-01`, `${next}-04-30`)).toBeNull();
    // ×1 would publish a 30-day total as the annual figure.
    expect(annualizeFactorForWindow(`${prev}-04-01`, `${prev}-04-30`)).not.toBe(1);
  });

  it('still annualizes a window that only partly overlaps the year', () => {
    const f = annualizeFactorForWindow(`${Number(year) - 1}-12-20`, `${year}-01-10`);
    expect(f).toBeGreaterThan(1);
  });

  it('puts the Jan–May snapshot between the YTD factor and naive linear', () => {
    expect(SNAPSHOT_ANNUALIZE_FACTOR).toBeGreaterThan(COMPOSED_ANNUALIZE_FACTOR);
    expect(SNAPSHOT_ANNUALIZE_FACTOR).toBeLessThan(365 / 123);
  });
});
