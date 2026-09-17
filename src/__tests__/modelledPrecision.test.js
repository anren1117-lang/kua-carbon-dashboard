// Precision should follow the evidence, not the float.
//
// The bug this guards: "22,213 kWh" for a building whose figure came from four
// metered months divided by a seasonal share. Every digit past the first two is
// a model artefact, and the model itself moved 13.7% in Phase 390.

import { describe, it, expect } from 'vitest';
import {
  sigFigsForCoverage,
  toSigFigs,
  formatModelledKwh,
  formatModelledMt,
  coverageCaveat,
} from '../utils/modelledPrecision.js';

describe('sigFigsForCoverage', () => {
  it('gives a nearly-complete year the most digits', () => {
    expect(sigFigsForCoverage(1)).toBe(4);
    expect(sigFigsForCoverage(0.95)).toBe(4);
  });

  it('gives a partial year one fewer', () => {
    expect(sigFigsForCoverage(0.6)).toBe(3);
  });

  it('keeps three figures at KUA\'s real coverage, not two', () => {
    // 4 metered months ≈ 0.386 of a seasonally-weighted year.
    //
    // An earlier draft returned 2 here. Against real buildings that rounded
    // Miller 375,543 UP to 380,000 and collapsed two dorms 1,000 kWh apart
    // onto the same displayed number. Dropping real signal is not humility.
    expect(sigFigsForCoverage(0.386)).toBe(3);
  });

  it('never returns 0 or a negative for junk input', () => {
    for (const bad of [0, -1, NaN, undefined, null, 'x']) {
      expect(sigFigsForCoverage(bad)).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('toSigFigs', () => {
  it('rounds to the requested significant figures', () => {
    expect(toSigFigs(22213, 2)).toBe(22000);
    expect(toSigFigs(22213, 3)).toBe(22200);
    expect(toSigFigs(22213, 4)).toBe(22210);
  });

  it('returns a number, so callers can still add separators', () => {
    expect(typeof toSigFigs(22213, 2)).toBe('number');
  });

  it('handles zero and junk without NaN', () => {
    for (const bad of [0, NaN, undefined, null, 'x']) {
      expect(toSigFigs(bad, 3)).toBe(0);
    }
  });

  it('clamps absurd precision requests instead of throwing', () => {
    // toPrecision throws a RangeError outside 1-100; this must not propagate.
    expect(() => toSigFigs(123, 0)).not.toThrow();
    expect(() => toSigFigs(123, 999)).not.toThrow();
  });
});

describe('formatModelledKwh', () => {
  it('stops claiming kilowatt-hour resolution on a four-month extrapolation', () => {
    // The actual defect: BuildingDetail rendered this to the unit. Three
    // figures, not two — two rounded a real 375,543 UP to 380,000 elsewhere.
    expect(formatModelledKwh(22213, 0.386)).toBe('22,200');
  });

  it('gives a fully-metered building its digits back', () => {
    expect(formatModelledKwh(22213, 1)).toBe('22,210');
  });

  it('keeps thousands separators', () => {
    expect(formatModelledKwh(1663697, 1)).toContain(',');
  });

  it('returns 0 for nothing measured', () => {
    expect(formatModelledKwh(0, 0)).toBe('0');
    expect(formatModelledKwh(NaN, 0.4)).toBe('0');
  });
});

describe('formatModelledMt', () => {
  it('drops to one decimal when coverage is partial', () => {
    // toFixed(2) claimed 10 kg resolution on a figure whose method moved 13.7%.
    expect(formatModelledMt(5.216, 0.386)).toBe('5.2');
  });

  it('keeps two decimals for a nearly-complete year', () => {
    expect(formatModelledMt(5.216, 1)).toBe('5.22');
  });

  it('returns 0 rather than NaN for junk', () => {
    expect(formatModelledMt(NaN, 1)).toBe('0');
  });
});

describe('coverageCaveat', () => {
  it('names the months and the share for a partial year', () => {
    const c = coverageCaveat(0.386, 4);
    expect(c).toMatch(/4 metered months/);
    expect(c).toMatch(/39%/);
  });

  it('says nothing when the year is essentially covered', () => {
    // A caveat on a full year would be noise, not honesty.
    expect(coverageCaveat(1, 12)).toBeNull();
  });

  it('is explicit when there is no data at all', () => {
    expect(coverageCaveat(0, 0)).toMatch(/no measured months/i);
  });

  it('still says something useful without a month count', () => {
    expect(coverageCaveat(0.5, null)).toMatch(/50% of a year/);
  });
});
