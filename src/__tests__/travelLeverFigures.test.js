// The "travel is the biggest lever" lesson block carried four numbers. Three
// disagreed with the estimator the same dashboard ships, and two of them were
// figures this repo had already retired BY NAME elsewhere:
//
//   "footprint at KUA might be 5–8 mtCO₂e"
//        allTypicalFootprints() says 1.37 (day) / 1.65 (US boarder) /
//        7.85 (international). 5–8 describes ONLY the international boarder
//        and is 3-5x high for the two types most students belong to.
//   "a single intercontinental round-trip is ~3"     -> MT_PER_INTL_FLIGHT 3.7
//   "Domestic flight: ~1"                            -> MT_PER_DOMESTIC_FLIGHT 0.6
//   "Driving 1,000 miles: ~0.4"                      -> 0.2986 kg/mi = ~0.3 mt.
//        0.40 is the fleet-average figure personalFootprint.js explicitly
//        replaced with EPA's commuting factor; the lesson kept the old one.
//
// The spread between student types IS the teaching point — flights dominate,
// and averaging them into one range hides exactly that. So the block now
// states all three types and derives every figure from the estimator.
//
// Asserted against the rendered lesson prose rather than the source text: an
// interpolated body can satisfy a source-level regex while producing the
// wrong sentence.

import { describe, it, expect } from 'vitest';
import { LEARNING_PATHS } from '../components/LearnAgent.js';
import {
  allTypicalFootprints,
  MT_PER_INTL_FLIGHT,
  MT_PER_DOMESTIC_FLIGHT,
  KG_PER_MILE_CAR,
} from '../utils/personalFootprint.js';

const blocks = [];
const walk = (node) => {
  if (Array.isArray(node)) return node.forEach(walk);
  if (node && typeof node === 'object') {
    if (typeof node.body === 'string') blocks.push(node);
    Object.values(node).forEach(walk);
  }
};
walk(LEARNING_PATHS);

const travel = blocks.find((b) => /travel is the biggest lever/i.test(b.heading || ''));
const typical = allTypicalFootprints();

describe('the travel-lever block agrees with the estimator beside it', () => {
  it('the block is reachable as data', () => {
    expect(travel).toBeTruthy();
    expect(typical).toHaveLength(3);
  });

  it('no longer states one range that fits only international boarders', () => {
    expect(travel.body).not.toMatch(/5[–-]8\s*mtCO/);
    // the two types the old range was wrong for
    expect(typical[0].totalMt).toBeLessThan(2);
    expect(typical[1].totalMt).toBeLessThan(2);
    expect(typical[2].totalMt).toBeGreaterThan(5);
  });

  it('states every student type the estimator models', () => {
    for (const t of typical) {
      expect(travel.body).toContain(t.totalMt.toFixed(1));
    }
  });

  it('prices flights at the factors the estimator uses', () => {
    expect(travel.body).toContain(String(MT_PER_INTL_FLIGHT));
    expect(travel.body).toContain(String(MT_PER_DOMESTIC_FLIGHT));
  });

  // The same claim was made a second time, in the carbon-budget block, with
  // the same two stale flight factors feeding a worked estimation exercise.
  // The residual gate caught it; a test keeps it caught.
  it('the carbon-budget block states the same figures as the lever block', () => {
    const budget = blocks.find((b) => /carbon budget/i.test(b.body));
    expect(budget).toBeTruthy();
    expect(budget.body).not.toMatch(/5[–-]8\s*mtCO/);
    expect(budget.body).toContain(String(MT_PER_INTL_FLIGHT));
    expect(budget.body).toContain(String(MT_PER_DOMESTIC_FLIGHT));
    expect(budget.body).toContain(typical[0].totalMt.toFixed(1));
    expect(budget.body).toContain(typical[2].totalMt.toFixed(1));
  });

  it('drives 1,000 miles at the commuting factor, not the retired 0.40', () => {
    const drive1000 = (KG_PER_MILE_CAR * 1000) / 1000;
    expect(KG_PER_MILE_CAR).toBeCloseTo(0.2986, 4);
    expect(travel.body).toContain(drive1000.toFixed(1));
    expect(travel.body).not.toMatch(/1,000 miles[^.]*0\.4/);
  });
});
