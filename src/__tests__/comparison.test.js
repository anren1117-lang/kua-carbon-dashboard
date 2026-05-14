// Unit tests for period-over-period comparison helpers — percentChange,
// trendKind, yoyMonthly. These drive the trend arrows and YoY columns
// across the dashboard; the divide-by-zero guard and the ±5% trend
// bands are the easy things to break.

import { describe, it, expect } from 'vitest';
import { percentChange, trendKind, yoyMonthly } from '../utils/comparison.js';

describe('percentChange', () => {
  it('computes a positive change', () => {
    expect(percentChange(150, 100)).toBe(50);
  });

  it('computes a negative change', () => {
    expect(percentChange(80, 100)).toBeCloseTo(-20);
  });

  it('returns null when previous is 0 (no divide-by-zero)', () => {
    expect(percentChange(100, 0)).toBeNull();
  });

  it('returns null when previous is null/undefined', () => {
    expect(percentChange(100, null)).toBeNull();
    expect(percentChange(100, undefined)).toBeNull();
  });

  it('handles a negative previous value', () => {
    // !previous is false for -50, so the formula still runs.
    expect(percentChange(-25, -50)).toBeCloseTo(-50);
  });
});

describe('trendKind', () => {
  it('is "unknown" when percentChange is null', () => {
    expect(trendKind(100, 0)).toBe('unknown');
  });

  it('is "worse" above +5%', () => {
    expect(trendKind(106, 100)).toBe('worse');
  });

  it('is "better" below -5%', () => {
    expect(trendKind(94, 100)).toBe('better');
  });

  it('is "flat" within the ±5% band, inclusive of the edges', () => {
    expect(trendKind(105, 100)).toBe('flat');  // exactly +5
    expect(trendKind(95, 100)).toBe('flat');   // exactly -5
    expect(trendKind(100, 100)).toBe('flat');  // no change
  });
});

describe('yoyMonthly', () => {
  it('joins this year to last year by month and computes deltaPct', () => {
    const thisYear = [
      { month: '2026-01', emissions: 120 },
      { month: '2026-02', emissions: 90 },
    ];
    const lastYear = [
      { month: '2026-01', emissions: 100 },
      { month: '2026-02', emissions: 100 },
    ];
    expect(yoyMonthly(thisYear, lastYear)).toEqual([
      { month: '2026-01', current: 120, previous: 100, deltaPct: 20 },
      { month: '2026-02', current: 90,  previous: 100, deltaPct: -10 },
    ]);
  });

  it('leaves previous + deltaPct null when last year is missing that month', () => {
    const out = yoyMonthly(
      [{ month: '2026-03', emissions: 50 }],
      [{ month: '2026-01', emissions: 100 }],
    );
    expect(out[0]).toEqual({ month: '2026-03', current: 50, previous: null, deltaPct: null });
  });

  it('keeps previous but nulls deltaPct when last year value is 0', () => {
    // 0 is a real previous value (not "missing"), but percentChange
    // can't divide by it.
    const out = yoyMonthly(
      [{ month: '2026-01', emissions: 50 }],
      [{ month: '2026-01', emissions: 0 }],
    );
    expect(out[0]).toEqual({ month: '2026-01', current: 50, previous: 0, deltaPct: null });
  });

  it('returns [] for an empty this-year series', () => {
    expect(yoyMonthly([], [{ month: '2026-01', emissions: 100 }])).toEqual([]);
  });
});
