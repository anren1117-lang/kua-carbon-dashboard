import { describe, it, expect } from 'vitest';
import { daysSince, freshnessBucket, FRESHNESS_THRESHOLDS, FRESHNESS_PILL_STYLES } from '../utils/freshness.js';

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
    for (const bucket of ['fresh', 'aging', 'stale', 'empty', 'unknown']) {
      const s = FRESHNESS_PILL_STYLES[bucket];
      expect(s).toBeTruthy();
      expect(s.label).toBeTruthy();
      expect(s.fg).toMatch(/^#/);
      expect(s.bg).toMatch(/^#/);
    }
  });
});
