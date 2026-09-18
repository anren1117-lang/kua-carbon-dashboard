// A CROSS-CHECK derives the same quantity two independent ways, so agreement
// between the entries is evidence. A SENSITIVITY runs ONE model at several
// parameter values, so agreement between the runs corroborates nothing —
// the spread only measures how much the answer depends on an assumption.
//
// Every range in geographicEstimates.js was labelled "N method cross-check",
// including ones where the entries are scalar multiples of each other. These
// tests pin each label to the structure it describes, so the honesty cannot
// drift back.

import { describe, it, expect } from 'vitest';
import {
  SCOPE1_COMPONENT_RANGES,
  SCOPE3_COMPONENT_RANGES,
  SCOPE1_FLEET_RANGE,
  SCOPE3_UPSTREAM_FUEL_RANGE,
  SINKS_RANGE,
  INDEPENDENCE,
} from '../data/geographicEstimates.js';

const ALL = [...SCOPE1_COMPONENT_RANGES, ...SCOPE3_COMPONENT_RANGES];

describe('every published range says whether it is a cross-check or a sensitivity', () => {
  it.each(ALL.map((r) => [r.component, r]))('%s carries a tag and a reason', (_name, row) => {
    expect(Object.values(INDEPENDENCE)).toContain(row.independence);
    expect(typeof row.independenceNote).toBe('string');
    expect(row.independenceNote.length).toBeGreaterThan(40);
  });

  it('SINKS is tagged too — it is where the honest labelling started', () => {
    expect(SINKS_RANGE.independence).toBe(INDEPENDENCE.CROSS_CHECK);
    expect(SINKS_RANGE.methods.some((m) => /not independent/i.test(m.label))).toBe(true);
  });

  it('the fleet control: averaging a number with two scalings of itself returns the number', () => {
    // B = A x 0.78 and C = A x 1.20, so mean(A,B,C) = A x 0.9933. This is the
    // clearest demonstration that a three-entry spread is not three sources
    // agreeing — and exactly why fleet must not be tagged cross-check.
    const [A, B, C] = SCOPE1_FLEET_RANGE.methods;
    expect(B.mt / A.mt).toBeCloseTo(0.78, 4);
    expect(C.mt / A.mt).toBeCloseTo(1.20, 4);
    expect(SCOPE1_FLEET_RANGE.central / A.mt).toBeCloseTo(0.9933, 3);
    expect(SCOPE1_FLEET_RANGE.independence).toBe(INDEPENDENCE.SENSITIVITY);
  });

  it('upstream fuel is derived from Scope 1, so it cannot corroborate anything', () => {
    const [A, B, C] = SCOPE3_UPSTREAM_FUEL_RANGE.methods;
    expect(B.mt / A.mt).toBeCloseTo(0.17 / 0.12, 4);
    expect(C.mt / A.mt).toBeCloseTo(0.22 / 0.12, 4);
    expect(SCOPE3_UPSTREAM_FUEL_RANGE.independence).toBe(INDEPENDENCE.SENSITIVITY);
  });

  it('a cross-check names an externally published benchmark among its entries', () => {
    const crossChecks = ALL.filter((r) => r.independence === INDEPENDENCE.CROSS_CHECK);
    expect(crossChecks.length).toBeGreaterThan(0);
    for (const row of crossChecks) {
      const text = row.methods.map((m) => `${m.label} ${m.basis}`).join(' ');
      expect(text).toMatch(/EPA|Yale|Andover|Exeter|Birdsey|USDA|ICAO/i);
    }
  });

  it('the majority of components are sensitivities — say so rather than imply otherwise', () => {
    const sens = ALL.filter((r) => r.independence === INDEPENDENCE.SENSITIVITY);
    expect(sens.length).toBeGreaterThan(ALL.length / 2);
  });
});
