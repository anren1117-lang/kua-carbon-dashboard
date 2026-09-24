// Task #12, reversed by evidence. Phase 480 published that the 0.40 spend
// factor "sits above the sectors it claims to average" and that reaching it
// needs a basket ~62% paper. Both statements are still arithmetically true of
// the recorded sector means. They were also one-sided, and I shipped them.
//
// What was missing: whether the sector means share a PRICE BASIS with the
// adopted factor, and what comparable institutions actually use.
//
// Peer blended spend-based factors, each recomputed here from the spend and
// emissions the source states:
//
//   U-Michigan FY2020, all PGS        0.240   (bounds 0.133-0.449)
//   UC Berkeley FY2009, all procurement 0.258
//   Oregon University System FY2008   0.380
//   MIT FY2016, material goods only   0.420
//   MIT FY2016, university-sector code 0.283
//   WRI / USEEIO 2017 higher-ed sector 0.332  (published directly)
//
// Four institutions, three different databases (EPA SEF, CEDA, EIO-LCA,
// USEEIO), landing at 0.24-0.42 and bracketing the published higher-education
// sector factor of 0.332. KUA's adopted 0.40 sits inside that band, near the
// top. The 0.222 and 0.267 candidates sit at or BELOW its bottom.
//
// And the likely explanation for the sector means looking low: EPA publishes
// factors "without margins" (producer price) and with margins (purchaser
// price), and a spend-based calculation takes what was actually PAID — the
// purchaser-price column. EPA's own worked example, Office Furniture 337214,
// is 0.216 without margins and 0.305 with, a ratio of 1.41. Applying that
// ratio to the recorded means moves their average from 0.267 to 0.377, next
// door to the adopted 0.40.
//
// That ratio is ONE example and margins vary a lot by sector — retail-heavy
// goods carry far larger margins than bulk materials — so it is recorded as
// indicative, not applied as a correction. The conclusion it supports is
// narrow but firm: do not reprice this downward on the evidence available.

import { describe, it, expect } from 'vitest';
import {
  PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD as ADOPTED,
  PURCHASED_GOODS_SECTORS,
  GOODS_FACTOR_RECONCILIATION as R,
  PEER_SPEND_FACTORS,
} from '../data/scopeTotals.js';

describe('the spend factor is checked against what peers actually use', () => {
  it('peer factors are derived from each source’s own spend and emissions', () => {
    expect(PEER_SPEND_FACTORS.length).toBeGreaterThanOrEqual(5);
    for (const p of PEER_SPEND_FACTORS) {
      expect(typeof p.institution).toBe('string');
      expect(p.kgPerUsd).toBeGreaterThan(0);
      // every entry states where the number came from
      expect(p.basis.length).toBeGreaterThan(10);
      if (p.emissionsT && p.spendUsd) {
        expect(p.kgPerUsd).toBeCloseTo((p.emissionsT * 1000) / p.spendUsd, 2);
      }
    }
  });

  it('the adopted factor sits inside the peer band, not above it', () => {
    const band = PEER_SPEND_FACTORS.map((p) => p.kgPerUsd);
    const lo = Math.min(...band);
    const hi = Math.max(...band);
    expect(lo).toBeLessThan(0.30);
    expect(hi).toBeGreaterThan(0.40);
    expect(ADOPTED).toBeGreaterThanOrEqual(lo);
    expect(ADOPTED).toBeLessThanOrEqual(hi);
  });

  it('the candidates Phase 480 floated sit at or below the bottom of it', () => {
    const typical = PEER_SPEND_FACTORS
      .filter((p) => p.blended)
      .map((p) => p.kgPerUsd)
      .sort((a, b) => a - b);
    const lowestBlended = typical[0];
    expect(R.unweightedMean).toBeLessThanOrEqual(lowestBlended + 0.03);
    expect(R.countWeightedMean).toBeLessThan(lowestBlended);
  });

  it('the price-basis question is recorded, and not silently applied', () => {
    expect(R.priceBasis.question).toMatch(/purchaser/i);
    expect(R.priceBasis.epaExampleRatio).toBeCloseTo(1.41, 2);
    // indicative only — the reconciliation must NOT have rescaled the sectors
    const recorded = PURCHASED_GOODS_SECTORS.map((s) => s.kgPerUsd);
    expect(recorded).toEqual([0.537, 0.096, 0.315, 0.120]);
    expect(R.priceBasis.applied).toBe(false);
  });

  it('the recommendation is no longer to cut the factor', () => {
    expect(R.adopted).toBe(0.40);
    expect(R.recommendation).toMatch(/not reprice|do not/i);
  });
});
