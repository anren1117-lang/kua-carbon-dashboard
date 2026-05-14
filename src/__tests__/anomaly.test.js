// Unit tests for detectAnomalies + qualityScore — meter data-quality
// detection behind /api/meters/quality and per-building dashboard
// alerts. Wrong results here mean either false alarms or missed
// stuck/dead meters, so pin down each detector's behavior.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { detectAnomalies, qualityScore } from '../utils/anomaly.js';

// Build a reading. Timestamps default to a fixed hourly cadence
// starting 2026-01-01T00:00Z so gap/stale math is deterministic.
const BASE = Date.parse('2026-01-01T00:00:00Z');
function reading(i, value, over = {}) {
  return {
    meterId: 'm1',
    timestamp: new Date(BASE + i * 3600_000).toISOString(),
    value,
    intervalMinutes: 60,
    ...over,
  };
}
// A flat, well-behaved series of `n` identical readings.
const flatSeries = (n, value = 100, over = {}) =>
  Array.from({ length: n }, (_, i) => reading(i, value, over));

afterEach(() => { vi.useRealTimers(); });

describe('detectAnomalies — guards', () => {
  it('returns [] for fewer than 8 readings', () => {
    expect(detectAnomalies(flatSeries(7))).toEqual([]);
  });

  it('groups readings by meterId and reports per-meter', () => {
    // Two meters, each with a distinct spike. detectAnomalies uses
    // population std, so max |z| = sqrt(n-1) — need a healthy sample
    // for a z >= 3 to even be reachable. 30 readings each.
    const m1 = Array.from({ length: 30 }, (_, i) => reading(i, i === 29 ? 9000 : 100, { meterId: 'm1' }));
    const m2 = Array.from({ length: 30 }, (_, i) => reading(i, i === 0 ? 9000 : 50, { meterId: 'm2' }));
    const issues = detectAnomalies([...m1, ...m2]);
    const spikeMeters = issues.filter((x) => x.kind === 'spike').map((x) => x.meterId);
    expect(spikeMeters).toContain('m1');
    expect(spikeMeters).toContain('m2');
  });
});

describe('detectAnomalies — spike (z-score)', () => {
  it('flags a value far from the meter mean', () => {
    // 29 readings ~100, one at 10000. With population std, max |z| is
    // sqrt(n-1) = sqrt(29) ≈ 5.4, so the outlier clears z = 3.
    const list = flatSeries(29, 100).concat(reading(29, 10000));
    const issues = detectAnomalies(list);
    const spike = issues.find((x) => x.kind === 'spike');
    expect(spike).toBeTruthy();
    expect(spike.meterId).toBe('m1');
    expect(spike.zScore).toBeGreaterThanOrEqual(3);
    expect(spike.startedAt).toBe(list[29].timestamp);
  });

  it('does not flag a spike when every value is identical (std = 0)', () => {
    const issues = detectAnomalies(flatSeries(8, 100));
    expect(issues.some((x) => x.kind === 'spike')).toBe(false);
  });

  it('respects a custom zThreshold — a lower threshold flags more', () => {
    // A series with genuine spread so z-scores land in a moderate
    // range rather than the extreme values a single-outlier series
    // produces. A stricter threshold should never flag more than a
    // looser one.
    const list = Array.from({ length: 30 }, (_, i) => reading(i, 100 + ((i * 37) % 50)));
    const strict = detectAnomalies(list, { zThreshold: 3.0 }).filter((x) => x.kind === 'spike').length;
    const loose  = detectAnomalies(list, { zThreshold: 1.0 }).filter((x) => x.kind === 'spike').length;
    expect(loose).toBeGreaterThan(strict);
  });
});

describe('detectAnomalies — flat run', () => {
  it('does NOT flag exactly 6 identical readings (threshold is 7)', () => {
    // 6 identical + 2 varying so the series reaches the 8-reading
    // minimum without extending the flat run.
    const list = [...flatSeries(6, 100), reading(6, 200), reading(7, 300)];
    expect(detectAnomalies(list).some((x) => x.kind === 'flat')).toBe(false);
  });

  it('flags 7 consecutive identical readings', () => {
    const list = [...flatSeries(7, 100), reading(7, 200), reading(8, 300)];
    const flat = detectAnomalies(list).find((x) => x.kind === 'flat');
    expect(flat).toBeTruthy();
    expect(flat.description).toMatch(/7 consecutive identical readings/);
    expect(flat.startedAt).toBe(list[0].timestamp);
    expect(flat.endedAt).toBe(list[6].timestamp);
  });

  it('flags a flat run that extends to the end of the series', () => {
    // Lead with 2 varying readings, then 7 identical to the end.
    const list = [reading(0, 1), reading(1, 2), ...Array.from({ length: 7 }, (_, i) => reading(i + 2, 500))];
    const flat = detectAnomalies(list).find((x) => x.kind === 'flat');
    expect(flat).toBeTruthy();
    expect(flat.endedAt).toBe(list[list.length - 1].timestamp);
  });
});

describe('detectAnomalies — gap', () => {
  it('flags a gap longer than 4× the interval', () => {
    // 8 readings: hours 0-6 hourly, then a final reading 14h later.
    // 14h > 4×60min, so the last interval is a gap. Build it already
    // sorted so the assertions can name exact readings.
    const list = [
      ...Array.from({ length: 7 }, (_, i) => reading(i, i)),
      reading(0, 99, { timestamp: new Date(BASE + 20 * 3600_000).toISOString() }),
    ];
    const gap = detectAnomalies(list).find((x) => x.kind === 'gap');
    expect(gap).toBeTruthy();
    expect(gap.startedAt).toBe(list[6].timestamp);
    expect(gap.endedAt).toBe(list[7].timestamp);
    expect(gap.description).toMatch(/Gap of 840 minutes/);
  });

  it('does not flag evenly-spaced readings', () => {
    const list = flatSeries(8, 100).map((r, i) => ({ ...r, value: i }));
    expect(detectAnomalies(list).some((x) => x.kind === 'gap')).toBe(false);
  });
});

describe('detectAnomalies — stale', () => {
  it('flags a meter whose last reading is more than 24h old', () => {
    // Series sits in early 2026; "now" is well past it.
    vi.useFakeTimers();
    vi.setSystemTime(new Date(BASE + 100 * 3600_000));
    const stale = detectAnomalies(flatSeries(8, 100).map((r, i) => ({ ...r, value: i })))
      .find((x) => x.kind === 'stale');
    expect(stale).toBeTruthy();
    expect(stale.description).toMatch(/hours old/);
  });

  it('does not flag a meter with a fresh last reading', () => {
    vi.useFakeTimers();
    // "now" is 1 hour after the last reading (index 7).
    vi.setSystemTime(new Date(BASE + 8 * 3600_000));
    const issues = detectAnomalies(flatSeries(8, 100).map((r, i) => ({ ...r, value: i })));
    expect(issues.some((x) => x.kind === 'stale')).toBe(false);
  });
});

describe('qualityScore', () => {
  it('is 0 for an empty reading set', () => {
    expect(qualityScore([], [])).toBe(0);
  });

  it('is 100 when there are no issues', () => {
    expect(qualityScore(flatSeries(8), [])).toBe(100);
  });

  it('deducts 5 points per issue', () => {
    expect(qualityScore(flatSeries(8), [{}, {}, {}])).toBe(85);
  });

  it('caps the penalty at 70 (floor score 30)', () => {
    const manyIssues = Array.from({ length: 50 }, () => ({}));
    expect(qualityScore(flatSeries(8), manyIssues)).toBe(30);
  });
});
