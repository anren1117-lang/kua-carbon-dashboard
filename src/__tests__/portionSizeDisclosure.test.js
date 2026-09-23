// @vitest-environment jsdom
//
// The dining per-serving table implies THREE distinct portion sizes across
// six categories, and the page disclosed two of them.
//
//   beef     9.95 / 99.5 = 100 g
//   eggs     0.47 /  4.7 = 100 g
//   pork     2.46 / 12.3 = 200 g
//   chicken  1.98 /  9.9 = 200 g
//   fish     2.72 / 13.6 = 200 g
//   legumes  0.33 /  1.0 = 330 g
//
// PORTION_RECONCILIATION named the beef/footprint gap and the "other meats
// imply 200 g" fact, which is the headline. It did not say that the
// vegetarian and vegan rows are on their own third and fourth assumptions, and
// it did not say how much reconciling would actually move the number — the
// thing a reader needs in order to judge whether the open decision matters.
//
// Cause, same as task #18: Phase 405 rescaled each row by its own protein's
// correction ratio, which preserved whatever portion size was assumed
// underneath rather than re-deriving it. A rescale carries its errors forward.
//
// Nothing is repriced here. The figures stay as adopted; the page now shows
// the whole spread and its cost, so the decision is visible rather than
// summarised down to the one comparison that was easiest to state.

import { describe, it, expect } from 'vitest';
import { PORTION_RECONCILIATION } from '../data/dining.js';
import { getFactorByKey } from '../data/emissionFactors.js';

const CATEGORIES = {
  beef: 'beef', pork: 'pork', chicken: 'chicken',
  fish: 'fish', vegetarian: 'eggs', vegan: 'legumes',
};

describe('the dining page discloses every portion assumption, not just beef', () => {
  it('implied grams are derived per category from the canonical per-kg factors', () => {
    const implied = PORTION_RECONCILIATION.impliedGramsByCategory;
    expect(implied).toBeTruthy();
    for (const [category, subcategory] of Object.entries(CATEGORIES)) {
      expect(implied[category]).toBeGreaterThan(0);
      // the derivation must reproduce from the factor table, not a literal
      const perKg = getFactorByKey('food', subcategory).kgco2e_per_unit;
      const serving = PORTION_RECONCILIATION.servingKgByCategory[category];
      expect(implied[category]).toBeCloseTo((serving / perKg) * 1000, 0);
    }
  });

  it('the table really does carry more than two portion assumptions', () => {
    const sizes = new Set(Object.values(PORTION_RECONCILIATION.impliedGramsByCategory)
      .map((g) => Math.round(g)));
    expect(sizes.size).toBeGreaterThanOrEqual(3);
    expect(PORTION_RECONCILIATION.distinctPortionSizes).toBe(sizes.size);
    // the two the old note never mentioned
    expect(Math.round(PORTION_RECONCILIATION.impliedGramsByCategory.vegetarian)).toBe(100);
    expect(Math.round(PORTION_RECONCILIATION.impliedGramsByCategory.vegan)).toBe(330);
  });

  it('states what reconciling would cost, since that is the open decision', () => {
    const s = PORTION_RECONCILIATION.standardisePct;
    expect(s).toBeTruthy();
    // beef dominates the menu, so any uniform portion raises the total
    expect(s.at150).toBeGreaterThan(20);
    expect(s.at200).toBeGreaterThan(s.at150);
  });

  it('still reports itself as unreconciled', () => {
    expect(PORTION_RECONCILIATION.aligned).toBe(false);
    expect(PORTION_RECONCILIATION.diningBeefKgPerServing).toBe(9.95);
    expect(PORTION_RECONCILIATION.footprintBeefKgPerServing).toBe(15);
  });
});
