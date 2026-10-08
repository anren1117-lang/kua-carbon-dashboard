// I put an estimate into the live data, and four surfaces called it measured.
//
// September is 14 days of real 35-feed data plus 16 days extrapolated from the
// two campus feeds that survived into the October export. The row is stored
// `data_quality: 'estimated'` and the per-month pill renders "Estimated ·
// scaled" correctly. The prose did not follow:
//
//   ledgerSourceText   "...building-feed totals from the daily Meter Trends
//                      export for May–Sep, scaled to master-meter equivalent"
//                      — false for Sep: it is not from that export at all
//   /scope-2           "composed from real measured BMS data"
//   Year 1 card        "Built from the measured months already in the dashboard"
//   YTD card heading   "composed from measured sources"
//
// Exactly the Phase 488 shape — the figure is right and the sentence about it
// is wrong — and here on the one line of this inventory that is genuinely
// metered, which makes the overclaim worse rather than smaller.
//
// ranges.scaledEstimated now separates months carried by an estimate from
// months scaled off a real daily export, and ledgerHasEstimatedMonths is the
// single predicate every surface asks instead of each inventing an answer.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  composeElectricityLedger, ledgerSourceText, ledgerHasEstimatedMonths,
  SOURCE_MASTER, SOURCE_FEED_SUM,
} from '../data/electricityLedger.js';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');

const master = (month, kwh) => ({ month, kwh, source: SOURCE_MASTER });
const feed = (month, kwh, days, estimated = false) =>
  ({ month, kwh, days, calibrationEligible: !estimated, estimated, source: SOURCE_FEED_SUM });

const CLEAN = composeElectricityLedger({
  masterMonths: [master('2026-01', 180323), master('2026-02', 185478), master('2026-03', 136576), master('2026-04', 128895)],
  feedMonths: [feed('2026-02', 209867, 28), feed('2026-03', 159535, 31), feed('2026-04', 146538, 30), feed('2026-05', 141633, 31)],
});
const WITH_EST = composeElectricityLedger({
  masterMonths: [master('2026-01', 180323), master('2026-02', 185478), master('2026-03', 136576), master('2026-04', 128895)],
  // Contiguous: the ledger counts an unbroken run from January, so a gap
  // before September would leave it uncounted and the fixture would prove
  // nothing.
  feedMonths: [feed('2026-02', 209867, 28), feed('2026-03', 159535, 31), feed('2026-04', 146538, 30),
    feed('2026-05', 141633, 31), feed('2026-06', 99338, 30), feed('2026-07', 116706, 31),
    feed('2026-08', 108621, 31), feed('2026-09', 163055, 30, true)],
});

describe('an estimated month is never described as measured', () => {
  it('the predicate distinguishes the two ledgers', () => {
    expect(ledgerHasEstimatedMonths(CLEAN)).toBe(false);
    expect(ledgerHasEstimatedMonths(WITH_EST)).toBe(true);
  });

  it('ranges separate estimated scaled months from measured scaled months', () => {
    expect(CLEAN.ranges.scaledEstimated).toBe('');
    expect(WITH_EST.ranges.scaledEstimated).toBe('Sep');
    // and the estimated month is NOT folded into the daily-export range
    expect(WITH_EST.ranges.scaled).not.toMatch(/Sep/);
  });

  it('the provenance sentence names it as estimated', () => {
    expect(ledgerSourceText(WITH_EST)).toMatch(/Sep estimated rather than metered/);
    // the old sentence claimed the daily export covered it
    expect(ledgerSourceText(WITH_EST)).not.toMatch(/export for May–Sep/);
  });

  it('and says nothing extra when every month really is measured', () => {
    expect(ledgerSourceText(CLEAN)).not.toMatch(/estimated/);
  });

  it('no surface leads with an unconditional "measured" claim', () => {
    const s2 = read('pages/Scope2.js');
    expect(s2).toContain('ledgerHasEstimatedMonths');
    expect(s2).not.toMatch(/`composed from real measured BMS data — \$\{ledgerSourceText/);

    const panel = read('components/Scope2BmsInsights.js');
    expect(panel).toContain('ledgerHasEstimatedMonths');
    expect(panel).not.toMatch(/Built from the measured months already in the dashboard/);
    expect(panel).not.toMatch(/built from each measured input/);
    expect(panel).not.toMatch(/composed from measured sources<\/h3>/);
  });

  it('the strong wording survives when nothing is estimated', () => {
    // guarding against a "fix" that just deletes the claim everywhere
    const s2 = read('pages/Scope2.js');
    expect(s2).toMatch(/composed from real measured BMS data/);
  });

  it('every surface asks the one predicate rather than re-deriving it', () => {
    for (const rel of ['pages/Scope2.js', 'components/Scope2BmsInsights.js']) {
      expect(read(rel), rel).not.toMatch(/data_quality\s*!==\s*'measured'/);
    }
  });
});
