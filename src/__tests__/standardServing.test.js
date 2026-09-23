// Task #21, decided: one portion size, stated once.
//
// The dining table carried three implied portion sizes across six categories
// (beef and eggs 100 g, pork/chicken/fish 200 g, legumes 330 g) while the
// personal-footprint tool stated 150 g for beef. None of those were chosen —
// Phase 405 rescaled each row by its own protein's correction ratio, which by
// design preserved whatever portion was assumed underneath. The portions were
// inherited, never decided.
//
// 150 g is now the stated convention, adopted because it is the figure the
// footprint tool already documented and it sits in the normal served range
// (USDA reference portion for cooked meat is 85 g; a dining-hall serving is
// typically 113-170 g). Every per-serving figure is derived from it and the
// canonical per-kg factor, so the two surfaces cannot disagree again.
//
// Beef lands on 99.5 × 0.150 = 14.92, which is what personalFootprint's "call
// it ~15" was already rounding — the tool was right and the dining table was
// the outlier.

import { describe, it, expect } from 'vitest';
import { STANDARD_SERVING_KG, getFactorByKey } from '../data/emissionFactors.js';
import { PORTION_RECONCILIATION } from '../data/dining.js';
import { KG_PER_BEEF_SERVING } from '../utils/personalFootprint.js';

const CATEGORIES = {
  beef: 'beef', pork: 'pork', chicken: 'chicken',
  fish: 'fish', vegetarian: 'eggs', vegan: 'legumes',
};

describe('one serving size, stated once and derived everywhere', () => {
  it('the convention is a named constant in the factor module', () => {
    expect(STANDARD_SERVING_KG).toBe(0.150);
  });

  it('every dining category now implies the same portion', () => {
    const implied = PORTION_RECONCILIATION.impliedGramsByCategory;
    for (const category of Object.keys(CATEGORIES)) {
      expect(implied[category]).toBe(STANDARD_SERVING_KG * 1000);
    }
    expect(PORTION_RECONCILIATION.distinctPortionSizes).toBe(1);
  });

  it('each per-serving figure is per-kg × the serving size', () => {
    for (const [category, subcategory] of Object.entries(CATEGORIES)) {
      const perKg = getFactorByKey('food', subcategory).kgco2e_per_unit;
      // servingKgFor rounds to 2dp, so compare against the rounded derivation
      // rather than the raw product — eggs land exactly on the 0.005 boundary.
      expect(PORTION_RECONCILIATION.servingKgByCategory[category])
        .toBe(+(perKg * STANDARD_SERVING_KG).toFixed(2));
    }
  });

  it('the footprint tool and the dining table agree on beef', () => {
    const beefPerKg = getFactorByKey('food', 'beef').kgco2e_per_unit;
    expect(KG_PER_BEEF_SERVING).toBeCloseTo(beefPerKg * STANDARD_SERVING_KG, 2);
    expect(KG_PER_BEEF_SERVING).toBeCloseTo(
      PORTION_RECONCILIATION.servingKgByCategory.beef, 2,
    );
    // and the reconciliation reports itself settled
    expect(PORTION_RECONCILIATION.aligned).toBe(true);
    expect(PORTION_RECONCILIATION.adoptedGrams).toBe(150);
  });

  it('beef is 14.92, the figure the tool was rounding to 15', () => {
    expect(PORTION_RECONCILIATION.servingKgByCategory.beef).toBeCloseTo(14.92, 2);
    // it was 9.95 on a 100 g portion
    expect(PORTION_RECONCILIATION.servingKgByCategory.beef).toBeGreaterThan(9.95);
  });
});
