// The EPA dataset, read from the primary source instead of inferred.
//
// Phase 482 published an explanation on /scope-3 that was wrong: it said EPA's
// "without margins" column is a producer price and "with margins" is a
// purchaser price, so the sector means looked low because they were on the
// wrong price basis.
//
// EPA v1.2's own methodology document says otherwise, verbatim:
//
//   "The dollar in the denominator of all factors uses purchaser prices in
//    2021 USD."
//
// All three columns are per purchaser-price dollar. The difference is in the
// NUMERATOR: Margin Emission Factors add the emissions of the trade and
// transport industries that move a good from producer to buyer. So the right
// column for spend-based accounting is still SEF+MEF, but for a different
// reason than I gave, and the correction is much smaller than I implied.
//
// Margins are small. From Table 1: mean MEF 0.0282, max 0.270, and
// "MEFs are non-zero for 45% of commodities" — zero for the other 55%. The
// office-furniture example I generalised from (0.216 -> 0.305, a ratio of
// 1.41) carries a margin of 0.089, more than three times the mean. Applying
// that ratio across four sectors, as Phase 482 did illustratively, overstates
// the effect badly.
//
// So the "do not reprice" conclusion stands, but it rests on the PEER BAND,
// not on margins closing the gap. Margins move the four stated sectors from
// about 0.267 to about 0.30, still under the adopted 0.40.
//
// Source: Wesley Ingwersen, "About the Supply Chain Greenhouse Gas Emission
// Factors v1.2 NAICS-6 Datasets", USEPA, April 12, 2023. Fetched and read
// directly. The code elsewhere cites v1.3, whose methodology document I could
// not retrieve — so every distribution figure here is labelled v1.2 rather
// than presented as current.

import { describe, it, expect } from 'vitest';
import {
  EPA_SUPPLY_CHAIN_BASIS as EPA,
  PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD as ADOPTED,
  GOODS_FACTOR_RECONCILIATION as R,
} from '../data/scopeTotals.js';

describe('the EPA dataset is described as EPA describes it', () => {
  it('records the version actually read, not the one assumed', () => {
    expect(EPA.documentedVersion).toBe('v1.2');
    expect(EPA.citedInThisRepo).toBe('v1.3');
    expect(EPA.versionCaveat).toMatch(/could not|not retriev/i);
  });

  it('all three factor types share a purchaser-price denominator', () => {
    expect(EPA.factorTypes).toEqual(['SEF', 'MEF', 'SEF+MEF']);
    expect(EPA.denominator).toMatch(/purchaser price/i);
    // the thing Phase 482 got wrong: margins are not a price-basis switch
    expect(EPA.marginsAreAPriceBasis).toBe(false);
    expect(EPA.marginsAre).toMatch(/trade and transport|emissions of the/i);
  });

  it('margins are small, and zero for most commodities', () => {
    expect(EPA.margins.mean).toBeCloseTo(0.0282, 4);
    expect(EPA.margins.max).toBeCloseTo(0.270, 3);
    expect(EPA.margins.nonZeroShare).toBeCloseTo(0.45, 2);
    // the single example Phase 482 generalised from is far above the mean
    expect(EPA.margins.officeFurnitureExample).toBeCloseTo(0.089, 3);
    expect(EPA.margins.officeFurnitureExample).toBeGreaterThan(EPA.margins.mean * 3);
  });

  it('places the adopted factor against EPA’s own published quartiles', () => {
    const d = EPA.withMargins;
    expect(d.median).toBeCloseTo(0.208, 3);
    expect(d.q3).toBeCloseTo(0.4483, 4);
    expect(d.mean).toBeCloseTo(0.3860, 4);
    // 0.40 sits between the median and the third quartile — high, but not the
    // "near the 80th percentile" the older comment claimed
    expect(ADOPTED).toBeGreaterThan(d.median);
    expect(ADOPTED).toBeLessThan(d.q3);
  });

  it('the reconciliation no longer claims margins close the gap', () => {
    expect(R.priceBasis.applied).toBe(false);
    expect(R.priceBasis.question).not.toMatch(/producer price/i);
    // a realistic with-margins average for the four sectors, not the 1.41 one
    expect(R.priceBasis.impliedUnweightedWithMargins).toBeGreaterThan(0.28);
    expect(R.priceBasis.impliedUnweightedWithMargins).toBeLessThan(0.32);
    expect(R.priceBasis.impliedUnweightedWithMargins).toBeLessThan(ADOPTED);
  });

  it('the conclusion still stands, on the peer band', () => {
    expect(R.recommendation).toMatch(/not reprice|do not/i);
    expect(R.recommendationRestsOn).toMatch(/peer/i);
  });
});
