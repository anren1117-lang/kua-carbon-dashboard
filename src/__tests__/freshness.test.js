import { describe, it, expect } from 'vitest';
import { daysSince, freshnessBucket, CADENCE_THRESHOLDS, FRESHNESS_THRESHOLDS, FRESHNESS_PILL_STYLES } from '../utils/freshness.js';

describe('daysSince', () => {
  const now = new Date('2026-05-09T12:00:00Z');

  it('returns null for null/undefined/empty', () => {
    expect(daysSince(null)).toBeNull();
    expect(daysSince(undefined)).toBeNull();
    expect(daysSince('')).toBeNull();
  });

  it('returns null for unparseable input', () => {
    expect(daysSince('not-a-date', now)).toBeNull();
    expect(daysSince('2026-99-99', now)).toBeNull();
  });

  it('returns 0 for today', () => {
    expect(daysSince('2026-05-09', now)).toBe(0);
  });

  it('returns the floor of whole days for past dates', () => {
    expect(daysSince('2026-05-08', now)).toBe(1);
    expect(daysSince('2026-05-01', now)).toBe(8);
    // 2026-02-09 → ~89 days before 2026-05-09 (2026 is not leap; Feb=28)
    expect(daysSince('2026-02-09', now)).toBe(89);
  });

  it('clamps future dates to 0 (not negative)', () => {
    expect(daysSince('2026-06-01', now)).toBe(0);
  });

  it('accepts a Date object too', () => {
    expect(daysSince(new Date('2026-05-04'), now)).toBe(5);
  });
});

describe('freshnessBucket', () => {
  const now = new Date('2026-05-09T12:00:00Z');

  it('returns empty for zero rows or missing stats', () => {
    expect(freshnessBucket({ count: 0, lastUpdated: null }, now)).toBe('empty');
    expect(freshnessBucket({ count: 0, lastUpdated: '2026-05-01' }, now)).toBe('empty');
    expect(freshnessBucket(null, now)).toBe('empty');
    expect(freshnessBucket(undefined, now)).toBe('empty');
  });

  it('returns unknown when there are rows but no parseable timestamp', () => {
    expect(freshnessBucket({ count: 5, lastUpdated: null }, now)).toBe('unknown');
    expect(freshnessBucket({ count: 5, lastUpdated: 'garbage' }, now)).toBe('unknown');
  });

  it('returns fresh for < 60 days old', () => {
    expect(freshnessBucket({ count: 1, lastUpdated: '2026-05-09' }, now)).toBe('fresh');
    expect(freshnessBucket({ count: 1, lastUpdated: '2026-04-15' }, now)).toBe('fresh'); // 24 days
    expect(freshnessBucket({ count: 1, lastUpdated: '2026-03-12' }, now)).toBe('fresh'); // 58 days
  });

  it('returns aging for 60–180 days old', () => {
    // 60 days exactly = boundary: not fresh
    const date60 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();
    expect(freshnessBucket({ count: 1, lastUpdated: date60 }, now)).toBe('aging');
    expect(freshnessBucket({ count: 1, lastUpdated: '2026-01-09' }, now)).toBe('aging'); // 120 days
  });

  it('returns stale for > 180 days old', () => {
    expect(freshnessBucket({ count: 1, lastUpdated: '2025-10-01' }, now)).toBe('stale');
    expect(freshnessBucket({ count: 1, lastUpdated: '2024-01-01' }, now)).toBe('stale');
  });

  it('exposes the canonical thresholds', () => {
    expect(FRESHNESS_THRESHOLDS.fresh).toBe(60);
    expect(FRESHNESS_THRESHOLDS.aging).toBe(180);
  });

  it('exposes pill styles for every bucket', () => {
    for (const bucket of ['fresh', 'aging', 'stale', 'empty', 'irregular', 'unknown']) {
      const s = FRESHNESS_PILL_STYLES[bucket];
      expect(s).toBeTruthy();
      expect(s.label).toBeTruthy();
      expect(s.fg).toMatch(/^#/);
      expect(s.bg).toMatch(/^#/);
    }
  });
});

describe('freshnessBucket — cadence-aware (Phase 48)', () => {
  const now = new Date('2026-05-09T12:00:00Z');

  it('exposes per-cadence thresholds', () => {
    expect(CADENCE_THRESHOLDS.monthly.fresh).toBe(60);
    expect(CADENCE_THRESHOLDS.monthly.aging).toBe(120);
    expect(CADENCE_THRESHOLDS.quarterly.fresh).toBe(120);
    expect(CADENCE_THRESHOLDS.quarterly.aging).toBe(365);
    expect(CADENCE_THRESHOLDS.annual.fresh).toBe(540);
    expect(CADENCE_THRESHOLDS.annual.aging).toBe(720);
  });

  it('returns irregular bucket for cadence=irregular regardless of age', () => {
    // Even a 5-year-old refrigerant service log should be 'irregular',
    // not 'stale' — the table is event-driven.
    expect(freshnessBucket({ count: 1, lastUpdated: '2021-01-01' }, 'irregular', now)).toBe('irregular');
    expect(freshnessBucket({ count: 1, lastUpdated: '2026-05-01' }, 'irregular', now)).toBe('irregular');
  });

  it('still returns empty for irregular tables with zero rows', () => {
    expect(freshnessBucket({ count: 0, lastUpdated: null }, 'irregular', now)).toBe('empty');
  });

  it('monthly cadence: a 100-day-old fuel bill is aging, not stale', () => {
    // Under uniform thresholds it would be 'fresh' (< 180). Under
    // monthly cadence (aging=120) it's aging — correctly flags that
    // the admin missed a delivery cycle.
    expect(freshnessBucket({ count: 1, lastUpdated: '2026-01-29' }, 'monthly', now)).toBe('aging');
    // 130 days = stale under monthly (> 120)
    expect(freshnessBucket({ count: 1, lastUpdated: '2025-12-30' }, 'monthly', now)).toBe('stale');
  });

  it('annual cadence: a 200-day-old student roster is still fresh', () => {
    // Under uniform thresholds it would be 'stale' (> 180). Under
    // annual cadence (fresh < 540) it's fresh — student rosters
    // updated annually shouldn't be flagged after a single semester.
    expect(freshnessBucket({ count: 100, lastUpdated: '2025-10-21' }, 'annual', now)).toBe('fresh');
    // 600 days = aging under annual
    const date600 = new Date(now.getTime() - 600 * 24 * 60 * 60 * 1000).toISOString();
    expect(freshnessBucket({ count: 100, lastUpdated: date600 }, 'annual', now)).toBe('aging');
    // 750 days = stale under annual
    const date750 = new Date(now.getTime() - 750 * 24 * 60 * 60 * 1000).toISOString();
    expect(freshnessBucket({ count: 100, lastUpdated: date750 }, 'annual', now)).toBe('stale');
  });

  it('quarterly cadence: a 200-day-old purchased-goods row is fresh', () => {
    expect(freshnessBucket({ count: 5, lastUpdated: '2025-10-21' }, 'quarterly', now)).toBe('aging');
    // 119 days → fresh under quarterly
    const date119 = new Date(now.getTime() - 119 * 24 * 60 * 60 * 1000).toISOString();
    expect(freshnessBucket({ count: 5, lastUpdated: date119 }, 'quarterly', now)).toBe('fresh');
  });

  it('unknown cadence string falls back to legacy 60/180 thresholds', () => {
    expect(freshnessBucket({ count: 1, lastUpdated: '2026-04-01' }, 'never-heard-of-it', now)).toBe('fresh');
    expect(freshnessBucket({ count: 1, lastUpdated: '2025-09-01' }, 'never-heard-of-it', now)).toBe('stale');
  });

  it('legacy 2-arg form (stats, now) still works without cadence', () => {
    // No regression in callers that pass a Date as the second arg.
    expect(freshnessBucket({ count: 1, lastUpdated: '2026-04-15' }, now)).toBe('fresh');
    expect(freshnessBucket({ count: 1, lastUpdated: '2025-10-01' }, now)).toBe('stale');
  });
});
