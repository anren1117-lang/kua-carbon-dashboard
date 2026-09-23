// TRIP_MT_BY_REGION prices a study-abroad or faculty trip by destination
// region. It documents its own method — "DEFRA 2024 long-haul economy ×
// great-circle distances from BOS" — and then did not follow it.
//
//   europe  stated 3.2, implied 2.25  (+42%)
//   asia    stated 4.0, implied 4.57  (-13%)
//   other   stated 3.3, implied 3.93  (-16%)
//
// Phase 404 rescaled every value by 0.322/0.241 because the old ones were
// built on a factor that matched no published DEFRA row. That fixed the
// FACTOR and left the implied DISTANCES untouched, so the rescale carried the
// original error forward: 2.4 -> 3.2 for Europe, when BOS↔Europe great-circle
// is ~3,500 miles each way and 3,500 × 2 × 0.322 kg = 2.25 mt.
//
// This is the "2.25 vs 3.2" of task #18. It is not a choice between two
// published sources — it is a table disagreeing with the method printed
// beside it, so the fix is arithmetic rather than a judgement call.
//
// The values are now derived from stated one-way distances and the canonical
// air factor, so the method and the number cannot drift apart again.

import { describe, it, expect } from 'vitest';
import { TRIP_MT_BY_REGION, TRIP_REGION_BASIS } from '../data/scopeTotals.js';
import { getFactorByKey } from '../data/emissionFactors.js';

const LONG_HAUL = getFactorByKey('travel', 'air_long_haul').kgco2e_per_unit;

describe('per-trip regional factors follow the method printed beside them', () => {
  it('the basis states its distances and which factor it uses', () => {
    expect(LONG_HAUL).toBeCloseTo(0.322, 3);
    expect(TRIP_REGION_BASIS.factorKgPerPassengerMile).toBeCloseTo(LONG_HAUL, 5);
    for (const region of ['europe', 'asia', 'other']) {
      expect(TRIP_REGION_BASIS.oneWayMiles[region]).toBeGreaterThan(1000);
    }
  });

  it('every long-haul region equals distance × 2 × factor', () => {
    for (const [region, miles] of Object.entries(TRIP_REGION_BASIS.oneWayMiles)) {
      const implied = (miles * 2 * LONG_HAUL) / 1000;
      expect(TRIP_MT_BY_REGION[region]).toBeCloseTo(implied, 2);
    }
  });

  it('Europe lands on the figure its own method implies, not the +42% one', () => {
    // BOS↔Europe great-circle averages ~3,500 mi each way across LHR/CDG/FRA/
    // MAD/ZRH, so a round trip is ~7,000 passenger-miles.
    expect(TRIP_REGION_BASIS.oneWayMiles.europe).toBeGreaterThan(3200);
    expect(TRIP_REGION_BASIS.oneWayMiles.europe).toBeLessThan(3800);
    expect(TRIP_MT_BY_REGION.europe).toBeCloseTo(2.25, 2);
    expect(TRIP_MT_BY_REGION.europe).toBeLessThan(3.2);
  });

  it('Asia and the catch-all moved up, not down — this is not a blanket cut', () => {
    expect(TRIP_MT_BY_REGION.asia).toBeGreaterThan(4.0);
    expect(TRIP_MT_BY_REGION.other).toBeGreaterThan(3.3);
    // ordering sanity: Asia is the longest haul of the three
    expect(TRIP_MT_BY_REGION.asia).toBeGreaterThan(TRIP_MT_BY_REGION.europe);
  });

  it('domestic stays on its own basis and says so', () => {
    // Domestic is mostly driving, not flying, so it is NOT derived from the
    // air factor and must not be swept into the same rule.
    expect(TRIP_MT_BY_REGION.domestic).toBe(0.5);
    expect(TRIP_REGION_BASIS.oneWayMiles.domestic).toBeUndefined();
    expect(TRIP_REGION_BASIS.domesticNote).toMatch(/driv/i);
  });
});
