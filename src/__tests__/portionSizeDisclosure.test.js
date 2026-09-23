// @vitest-environment jsdom
//
// This guarded the DISCLOSURE of an unreconciled portion table. Task #21 has
// since settled it, so the assertions now pin the settled state and, more
// usefully, that the diagnostic which found the problem still works.
//
// What it found, for the record: the dining table implied three portion sizes
// across six categories — beef and eggs 100 g, pork/chicken/fish 200 g,
// legumes 330 g — while the personal-footprint tool stated 150 g. None were
// chosen. Phase 405 rescaled each row by its own protein's correction ratio,
// which by design preserved whatever portion was assumed underneath.
//
// The diagnostic is kept because it is what would catch the same thing again:
// derive the implied portion back out of every per-serving figure and check
// they agree. A table that silently acquires a second portion size fails here.

import { describe, it, expect } from 'vitest';
import { PORTION_RECONCILIATION } from '../data/dining.js';
import { getFactorByKey, STANDARD_SERVING_KG } from '../data/emissionFactors.js';

const CATEGORIES = {
  beef: 'beef', pork: 'pork', chicken: 'chicken',
  fish: 'fish', vegetarian: 'eggs', vegan: 'legumes',
};

describe('the portion diagnostic still works, and now reports agreement', () => {
  it('implied grams are derived per category, not asserted', () => {
    const implied = PORTION_RECONCILIATION.impliedGramsByCategory;
    for (const [category, subcategory] of Object.entries(CATEGORIES)) {
      const perKg = getFactorByKey('food', subcategory).kgco2e_per_unit;
      const serving = PORTION_RECONCILIATION.servingKgByCategory[category];
      // same 5 g bucketing the source uses, for the same double-rounding reason
      expect(implied[category]).toBe(Math.round(((serving / perKg) * 1000) / 5) * 5);
    }
  });

  it('every category agrees on one portion', () => {
    const sizes = new Set(Object.values(PORTION_RECONCILIATION.impliedGramsByCategory));
    expect(sizes.size).toBe(1);
    expect(PORTION_RECONCILIATION.distinctPortionSizes).toBe(1);
    expect([...sizes][0]).toBe(STANDARD_SERVING_KG * 1000);
  });

  it('reports itself reconciled, and costs nothing further to standardise', () => {
    expect(PORTION_RECONCILIATION.aligned).toBe(true);
    expect(PORTION_RECONCILIATION.adoptedGrams).toBe(150);
    // already at 150 g, so that column is a no-op; 200 g would still move it
    expect(PORTION_RECONCILIATION.standardisePct.at150).toBe(0);
    expect(PORTION_RECONCILIATION.standardisePct.at200).toBeGreaterThan(0);
  });

  it('the diagnostic would catch a category drifting off the convention', () => {
    // negative control: a guard that cannot fail proves nothing
    const perKg = getFactorByKey('food', 'beef').kgco2e_per_unit;
    const drifted = +(perKg * 0.100).toFixed(2);            // someone types a 100 g beef row
    const impliedFromDrift = Math.round(((drifted / perKg) * 1000) / 5) * 5;
    expect(impliedFromDrift).toBe(100);
    expect(impliedFromDrift).not.toBe(STANDARD_SERVING_KG * 1000);
  });
});
