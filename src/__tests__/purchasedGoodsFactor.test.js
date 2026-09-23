// @vitest-environment jsdom
//
// The purchased-goods factor claims a basis it does not have, and the audit
// note that spotted it mislabelled its own arithmetic.
//
// PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD is 0.40, described as a "KUA-typical
// weighted average across paper / IT / cleaning / apparel sectors". Phase 404
// measured those four sectors against EPA Supply Chain v1.3 and recorded:
//
//   paper (322)           0.537   n=11
//   computers/elec (334)  0.096   n=24
//   soap/cleaning (3256)  0.315   n=4
//   apparel (315)         0.120   n=7
//
// and then called 0.222 the "unweighted mean". It is not. The unweighted mean
// of those four is 0.267. 0.222 is approximately the COMMODITY-COUNT-weighted
// mean (0.224) — and counting NAICS-6 commodities is a meaningless weight for
// a spend basket, because the number of commodity codes in a sector says
// nothing about what a school buys.
//
// That matters because 0.222 was the figure task #12 proposed adopting, and it
// had been carried forward — into the task list and into my own notes — on the
// strength of a label nobody had checked.
//
// Separately: 0.40 is above three of the four sectors it claims to average, and
// reaching it needs a basket that is mostly paper. The same note describes the
// basket as "dominated by electronics and apparel" — the two LOWEST. So the
// constant contradicts its own stated composition, the same shape of defect as
// tasks #18 and #21.
//
// This phase does NOT reprice. It publishes the sector table as data, derives
// the candidate weightings rather than asserting them, and corrects the label.
// The adopted value stays 0.40 until the sector means themselves are verified
// against the EPA file.

import { describe, it, expect } from 'vitest';
import {
  PURCHASED_GOODS_SECTORS,
  PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD,
  GOODS_FACTOR_RECONCILIATION as R,
} from '../data/scopeTotals.js';

describe('the purchased-goods factor states its basis honestly', () => {
  it('the four sectors it claims to average are published as data', () => {
    expect(PURCHASED_GOODS_SECTORS).toHaveLength(4);
    for (const s of PURCHASED_GOODS_SECTORS) {
      expect(s.kgPerUsd).toBeGreaterThan(0);
      expect(s.commodityCount).toBeGreaterThan(0);
      expect(typeof s.naics).toBe('string');
    }
  });

  it('the candidate weightings are derived, not asserted', () => {
    const v = PURCHASED_GOODS_SECTORS.map((s) => s.kgPerUsd);
    const n = PURCHASED_GOODS_SECTORS.map((s) => s.commodityCount);
    const unweighted = v.reduce((a, b) => a + b, 0) / v.length;
    const countWeighted = v.reduce((a, b, i) => a + b * n[i], 0) / n.reduce((a, b) => a + b, 0);
    expect(R.unweightedMean).toBeCloseTo(unweighted, 3);
    expect(R.countWeightedMean).toBeCloseTo(countWeighted, 3);
  });

  it('0.222 was never the unweighted mean — that is 0.267', () => {
    expect(R.unweightedMean).toBeCloseTo(0.267, 3);
    expect(R.countWeightedMean).toBeCloseTo(0.224, 3);
    // the figure task #12 proposed, and what it actually is
    expect(R.unweightedMean).not.toBeCloseTo(0.222, 2);
    expect(Math.abs(R.countWeightedMean - 0.222)).toBeLessThan(0.005);
  });

  it('the adopted factor sits above the sectors it claims to average', () => {
    expect(PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD).toBe(0.40);
    const above = PURCHASED_GOODS_SECTORS
      .filter((s) => s.kgPerUsd < PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD);
    expect(above).toHaveLength(3);
    expect(R.adopted).toBe(PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD);
    expect(R.adopted).toBeGreaterThan(R.unweightedMean);
  });

  it('it states the paper share the adopted value would require', () => {
    // 0.40 = p x paper + (1-p) x (mean of the other three)
    const paper = PURCHASED_GOODS_SECTORS.find((s) => s.naics === '322').kgPerUsd;
    const others = PURCHASED_GOODS_SECTORS.filter((s) => s.naics !== '322');
    const othersMean = others.reduce((a, s) => a + s.kgPerUsd, 0) / others.length;
    const p = (R.adopted - othersMean) / (paper - othersMean);
    expect(R.impliedPaperShare).toBeCloseTo(p, 2);
    // a school basket "dominated by electronics and apparel" is not 60%+ paper
    expect(R.impliedPaperShare).toBeGreaterThan(0.5);
    expect(R.aligned).toBe(false);
  });
});
