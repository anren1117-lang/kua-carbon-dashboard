// The pledge card rendered:
//
//   "That's ~{reductionMt} mtCO2e off your footprint
//    ({currentMt} -> {newTotalMt} mtCO2e total)."
//
// currentMt was the top ROW (`top.mt`); newTotalMt was the WHOLE footprint
// after the cut (`totalMt - top.mt * 0.30`). Both were labelled "total", and
// since the total exceeds any single row, the second number is LARGER:
//
//   day student  "~0.26 mt off your footprint (0.86 -> 1.22 total)"
//   us_boarding  "~0.36 mt off your footprint (1.20 -> 1.46 total)"
//
// A student who pledges a cut watches the number go UP. The arrow must run
// total -> total, and the difference must equal the reduction the same
// sentence claims.

import { describe, it, expect } from 'vitest';
import { estimatePersonalFootprint } from '../utils/personalFootprint.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const src = readFileSync(resolve(process.cwd(), 'pages/PersonalFootprint.js'), 'utf8');

// mirrors the component's pledge computation
const pledgeFor = (inputs) => {
  const r = estimatePersonalFootprint(inputs);
  const top = r.components.slice().sort((a, b) => b.mt - a.mt)[0];
  return {
    totalMt: r.totalMt,
    topMt: top.mt,
    reductionMt: +(top.mt * 0.30).toFixed(2),
    newTotalMt: +(r.totalMt - top.mt * 0.30).toFixed(2),
  };
};

const CASES = [
  ['day student', { studentType: 'day', commuteMilesOneWay: 8, beefFrequency: 'weekly', showersPerWeek: 7, flightsPerYear: 0, thermostatHabit: 'always_on' }],
  ['us boarder',  { studentType: 'us_boarding', beefFrequency: 'weekly', showersPerWeek: 7, flightsPerYear: 2, thermostatHabit: 'always_on' }],
];

describe('the pledge card compares like with like', () => {
  it.each(CASES)('%s: the top row really is smaller than the total', (name, inputs) => {
    const p = pledgeFor(inputs);
    // the premise of the defect: any single row is below the total, so
    // rendering row -> newTotal shows an increase.
    expect(p.topMt).toBeLessThan(p.totalMt);
    expect(p.newTotalMt).toBeGreaterThan(p.topMt);
  });

  it.each(CASES)('%s: total minus reduction equals the new total', (name, inputs) => {
    const p = pledgeFor(inputs);
    expect(p.totalMt - p.reductionMt).toBeCloseTo(p.newTotalMt, 2);
  });

  it('the card starts the arrow at the TOTAL, not a row', () => {
    expect(src).toMatch(/currentMt:\s*totalMt/);
    expect(src).not.toMatch(/currentMt:\s*top\.mt/);
  });

  it('the rendered pair is labelled as totals on both sides', () => {
    // Anchored on the pledge variable, not on "off your footprint" — that
    // phrase appears first in the history trend box, a different component.
    const i = src.indexOf('pledged.currentMt');
    expect(i, 'pledge card render not found').toBeGreaterThan(-1);
    const block = src.slice(i - 200, i + 200);
    expect(block).toMatch(/pledged\.newTotalMt/);
    expect(block).toMatch(/total/);
  });
});
