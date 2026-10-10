// A target whose progress cannot move is not a target.
//
// Every reduction target carried `baselineYear: 2024` while its baselineValue
// was DERIVED FROM THE CURRENT TOTALS. There is no 2024 inventory — this is
// KUA's first — so the "2024 baseline" was the present-day figure wearing a
// date, and /goals computed:
//
//     reductionAchieved = (baselineValue - actual) / baselineValue
//
// With baselineValue === actual that is structurally ZERO. The progress bar
// read "0.0% reduced of 50% needed" and could never read anything else, no
// matter how much the school cut. A trustee reads 0% as a result — the school
// tried and achieved nothing — when it is an arithmetic identity.
//
// Scope 2 was worse than useless. Its baseline was a hardcoded 390 from before
// the eGRID factor correction, against a current 410, so /goals reported Scope
// 2 as 5% ABOVE baseline and stamped the target "⚠ Behind pace" — presenting a
// methodology revision as a performance regression. Nothing about the school's
// electricity had changed.
//
// The fix is not a better number. There is no prior inventory to compare
// against, so the honest thing is to say that and show the distance still to
// travel instead of a fabricated pace judgement.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  reductionTargets, BASELINE_YEAR, BASELINE_IS_FIRST_INVENTORY, BASELINE_NOTE,
  targetTrajectoryAt,
} from '../data/targets.js';
import { GROSS_MT, SCOPE2_TOTAL_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { REPORTING_PERIOD } from '../data/academicCalendar.js';

const goalsSrc = readFileSync(resolve(process.cwd(), 'pages/Goals.js'), 'utf8');

describe('the baseline is honest about what it is', () => {
  it('the baseline year is the reporting period, not an invented past year', () => {
    expect(BASELINE_YEAR).toBe(Number(REPORTING_PERIOD.schoolYear.slice(0, 4)));
    // the specific lie that shipped
    reductionTargets.forEach((t) => {
      expect(t.baselineYear, t.id).toBe(BASELINE_YEAR);
      expect(t.baselineYear, t.id).not.toBe(2024);
    });
  });

  it('admits the baseline IS this inventory', () => {
    expect(BASELINE_IS_FIRST_INVENTORY).toBe(true);
    expect(BASELINE_NOTE).toMatch(/first/i);
    expect(BASELINE_NOTE).toMatch(/two inventories|second inventory|next inventory/i);
  });

  it('every baseline sits on the same basis as the figure it is compared to', () => {
    // the Scope 2 defect: a baseline from a superseded factor vintage, so the
    // delta measured the factor change and not the emissions
    const byId = Object.fromEntries(reductionTargets.map((t) => [t.id, t]));
    expect(Math.round(byId.tg_scope2_2027.baselineValue)).toBe(Math.round(SCOPE2_TOTAL_MT));
    expect(Math.round(byId.tg_gross_2030.baselineValue)).toBe(Math.round(GROSS_MT));
    expect(Math.round(byId.tg_net_2050.baselineValue))
      .toBe(Math.round(GROSS_MT - ANNUAL_SEQUESTRATION_MT));
  });

  it('no baseline is a stale literal — the 390 that caused it', () => {
    const src = readFileSync(resolve(process.cwd(), 'data/targets.js'), 'utf8');
    const live = src.split('\n').filter((l) => !l.trim().startsWith('//'));
    expect(live.join('\n')).not.toMatch(/baselineValue:\s*390\b/);
    // and no baselineValue is a bare number at all; every one is derived
    const literals = live.filter((l) => /baselineValue:\s*\d/.test(l));
    expect(literals.map((l) => l.trim())).toEqual(
      literals.filter((l) => /\/\/ matches/.test(l)).map((l) => l.trim()),
    );
  });
});

describe('/goals does not present an identity as a result', () => {
  it('shows the target rather than a fabricated 0% progress', () => {
    expect(goalsSrc).toContain('BASELINE_IS_FIRST_INVENTORY');
    expect(goalsSrc).toMatch(/no progress reading until a second inventory/);
  });

  it('shows no pace judgement when there is nothing to compare', () => {
    // "Behind pace" off a single inventory is an assertion about performance
    // made from no performance data
    const aheadIdx = goalsSrc.indexOf('Behind pace');
    expect(aheadIdx).toBeGreaterThan(-1);
    const guarded = goalsSrc.slice(0, aheadIdx);
    expect(guarded).toContain('BASELINE_IS_FIRST_INVENTORY ? (');
  });

  it('surfaces the note where a reader will meet it', () => {
    expect(goalsSrc).toMatch(/subtitle=.*BASELINE_NOTE/s);
  });
});

describe('the trajectory maths still behaves', () => {
  it('the baseline year returns the baseline, and the target year the target', () => {
    reductionTargets.forEach((t) => {
      expect(targetTrajectoryAt(t, t.baselineYear), t.id).toBeCloseTo(t.baselineValue, 5);
      expect(targetTrajectoryAt(t, t.targetYear), t.id)
        .toBeCloseTo(t.baselineValue * (1 - t.percentReduction / 100), 5);
    });
  });

  it('a midpoint year lands between the two, not outside them', () => {
    reductionTargets.forEach((t) => {
      const mid = Math.floor((t.baselineYear + t.targetYear) / 2);
      const v = targetTrajectoryAt(t, mid);
      const end = t.baselineValue * (1 - t.percentReduction / 100);
      expect(v, t.id).toBeLessThanOrEqual(t.baselineValue);
      expect(v, t.id).toBeGreaterThanOrEqual(end);
    });
  });

  it('progress off a first-inventory baseline really is zero — the reason for all this', () => {
    // not a complaint about the arithmetic; proof that the arithmetic cannot
    // say anything, which is why the UI must not pretend it did
    reductionTargets.forEach((t) => {
      const actual = t.baselineValue;
      expect((t.baselineValue - actual) / t.baselineValue, t.id).toBe(0);
    });
  });
});
