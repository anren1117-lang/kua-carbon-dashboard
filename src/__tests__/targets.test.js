// Unit tests for the linear-trajectory helpers behind /goals and the
// AdminPlanAgent target view. The math is straightforward but the
// boundary cases (year ≤ baseline, year ≥ target, 100%-reduction
// targets, the 10% "lagging" band) are easy to flip an inequality on.

import { describe, it, expect } from 'vitest';
import { reductionTargets, targetTrajectoryAt, trajectoryStatus } from '../data/targets.js';

const target = (over = {}) => ({
  id: 'test',
  title: 'test',
  scope: 'gross',
  baselineYear: 2024,
  baselineValue: 1000,
  targetYear: 2030,
  percentReduction: 50,
  description: '',
  owner: '',
  approved: false,
  ...over,
});

describe('targetTrajectoryAt — boundaries', () => {
  it('returns the baseline value for the baseline year exactly', () => {
    expect(targetTrajectoryAt(target(), 2024)).toBe(1000);
  });

  it('returns the baseline value for any year before the baseline', () => {
    expect(targetTrajectoryAt(target(), 2020)).toBe(1000);
  });

  it('returns the final (baseline × (1 - reduction)) for the target year exactly', () => {
    expect(targetTrajectoryAt(target(), 2030)).toBe(500);
  });

  it('returns the final value for any year after the target', () => {
    expect(targetTrajectoryAt(target(), 2050)).toBe(500);
  });
});

describe('targetTrajectoryAt — linear interpolation', () => {
  it('halfway between baseline and target → halfway between values', () => {
    // 2024..2030 (6yr span); 2027 is exactly half.
    expect(targetTrajectoryAt(target(), 2027)).toBe(750);
  });

  it('one-third of the way → one-third of the reduction applied', () => {
    // 2024 + 2 = 2026 → 2/6 of the 500-mt reduction = 166.67 off
    expect(targetTrajectoryAt(target(), 2026)).toBeCloseTo(1000 - (500 * 2 / 6));
  });

  it('handles a 100% reduction target (net-zero) — final value is 0', () => {
    const t = target({ percentReduction: 100 });
    expect(targetTrajectoryAt(t, 2030)).toBe(0);
    expect(targetTrajectoryAt(t, 2027)).toBe(500); // halfway → halfway to 0
  });

  it('handles a 0% reduction target (flat target) — trajectory stays at baseline', () => {
    const t = target({ percentReduction: 0 });
    expect(targetTrajectoryAt(t, 2027)).toBe(1000);
    expect(targetTrajectoryAt(t, 2030)).toBe(1000);
  });
});

describe('trajectoryStatus', () => {
  it('returns "on_track" when actual ≤ expected', () => {
    // At 2027, expected = 750. Anything ≤ 750 is on track.
    expect(trajectoryStatus(target(), 700, 2027)).toBe('on_track');
    expect(trajectoryStatus(target(), 750, 2027)).toBe('on_track');
    expect(trajectoryStatus(target(), 0, 2027)).toBe('on_track');
  });

  it('returns "lagging" inside the 10% over-target band', () => {
    // expected 750, lagging cutoff = 825.
    expect(trajectoryStatus(target(), 800, 2027)).toBe('lagging');
    expect(trajectoryStatus(target(), 825, 2027)).toBe('lagging');
  });

  it('returns "off_track" past the 10% band', () => {
    expect(trajectoryStatus(target(), 826, 2027)).toBe('off_track');
    expect(trajectoryStatus(target(), 2000, 2027)).toBe('off_track');
  });

  it('uses the current-year expected, not the baseline (matters for mid-trajectory checks)', () => {
    // If trajectoryStatus compared against baselineValue instead of
    // expected, 900 in 2027 would be flagged "on_track" (900 ≤ 1000).
    // Against expected (750), it's off_track. Pin this distinction.
    expect(trajectoryStatus(target(), 900, 2027)).toBe('off_track');
  });

  // THIS TEST USED TO PIN THE BUG AS INTENDED BEHAVIOUR. It read:
  //
  //   it('reports "on_track" pre-baseline since the trajectory is the baseline
  //      itself', () => expect(trajectoryStatus(target(), 999, 2020))
  //      .toBe('on_track'));
  //
  // The reasoning is sound and the conclusion is wrong. At or before the
  // baseline year the trajectory IS the baseline, so any actual at or under it
  // compares equal — and calling that "on track" is a performance verdict
  // manufactured from an identity. /goals rendered it as "On track today 4 / 4"
  // in green across every target.
  //
  // A pace judgement needs an elapsed period. Before one exists there is no
  // reading, which is not the same as things being fine.
  it('reports "no_reading" at or before the baseline year, not "on_track"', () => {
    expect(trajectoryStatus(target(), 999, 2020)).toBe('no_reading');
    expect(trajectoryStatus(target(), 999, target().baselineYear)).toBe('no_reading');
    // and it does not depend on the actual at all, which is the tell
    expect(trajectoryStatus(target(), 0, 2020)).toBe('no_reading');
    expect(trajectoryStatus(target(), 1e9, 2020)).toBe('no_reading');
  });

  it('still buckets correctly once a period HAS elapsed', () => {
    const t = target();
    const y = t.baselineYear + 1;
    const expected = targetTrajectoryAt(t, y);
    expect(trajectoryStatus(t, expected, y)).toBe('on_track');
    expect(trajectoryStatus(t, expected * 1.05, y)).toBe('lagging');
    expect(trajectoryStatus(t, expected * 1.5, y)).toBe('off_track');
  });
});

describe('reductionTargets — shape invariants', () => {
  it('has no duplicate ids', () => {
    const ids = reductionTargets.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every target has the required fields', () => {
    for (const t of reductionTargets) {
      expect(typeof t.id).toBe('string');
      expect(typeof t.title).toBe('string');
      expect(typeof t.scope).toBe('string');
      expect(typeof t.baselineYear).toBe('number');
      expect(typeof t.baselineValue).toBe('number');
      expect(typeof t.targetYear).toBe('number');
      expect(typeof t.percentReduction).toBe('number');
    }
  });

  it('every target has percentReduction in [0, 100] and targetYear ≥ baselineYear', () => {
    for (const t of reductionTargets) {
      expect(t.percentReduction).toBeGreaterThanOrEqual(0);
      expect(t.percentReduction).toBeLessThanOrEqual(100);
      expect(t.targetYear).toBeGreaterThanOrEqual(t.baselineYear);
    }
  });

  it('every target scope is a known value the rest of the dashboard reads', () => {
    const allowed = new Set(['gross', 'scope1', 'scope2', 'scope3', 'net', 'energy_kwh']);
    for (const t of reductionTargets) {
      expect(allowed.has(t.scope)).toBe(true);
    }
  });
});
