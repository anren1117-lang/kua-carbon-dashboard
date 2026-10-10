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

// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ROUTER_FUTURE } from './routerFuture.js';
import Goals from '../pages/Goals.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  reductionTargets, BASELINE_YEAR, BASELINE_IS_FIRST_INVENTORY, BASELINE_NOTE,
  targetTrajectoryAt, trajectoryStatus,
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
    // THIS WAS BYPASSABLE: it exempted any literal carrying a `// matches`
    // comment, so `baselineValue: 500, // matches anything` passed. Only the
    // exact 390 was pattern-blocked. Every baseline must now be an identifier.
    const literals = live.filter((l) => /baselineValue:\s*\d/.test(l));
    expect(literals.map((l) => l.trim())).toEqual([]);
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

  it('every target returns no_reading — the reason the UI must not show a verdict', () => {
    // WHAT THIS REPLACED was a tautology: expect((baseline - actual)/baseline)
    // .toBe(0) with actual = baseline. (x-x)/x is 0 for every finite nonzero x,
    // so it constrained no data and could never fail.
    //
    // Worse, it was the only test touching the identity, while the actual bug
    // lived one step further on: trajectoryStatus compared actual to a
    // trajectory that equals the baseline, answered 'on_track' for all four
    // targets, and /goals rendered "On track today 4 / 4" in green. A test
    // asserting on the string 'Behind pace' passed the whole time — the bug it
    // guarded was live on three other surfaces.
    //
    // So assert the function, which is where the verdict comes from.
    reductionTargets.forEach((t) => {
      expect(trajectoryStatus(t, t.baselineValue, t.baselineYear), t.id).toBe('no_reading');
      // and it does not depend on the actual, which is what makes any verdict
      // read off it meaningless
      expect(trajectoryStatus(t, 0, t.baselineYear), t.id).toBe('no_reading');
      expect(trajectoryStatus(t, t.baselineValue * 10, t.baselineYear), t.id).toBe('no_reading');
    });
  });

  it('the no_reading status is rendered neutral, not green and not red', () => {
    // colouring the absence of a measurement green was the bug; colouring it
    // red is the same mistake sign-flipped
    expect(goalsSrc).toMatch(/no_reading:\s*'neutral'/);
    expect(goalsSrc).toMatch(/no_reading:\s*'No reading yet'/);
    expect(goalsSrc).toMatch(/STATUS_COLOR/);
    // the summary stat must not claim a count when nothing can be counted
    expect(goalsSrc).toMatch(/anyReading/);
    expect(goalsSrc).toMatch(/value="No reading"/);
  });
});

// ─── what /goals actually RENDERS ───────────────────────────────────────
//
// Every test above reads source text, and that is how the bug survived the
// first attempt: a test asserting on the string 'Behind pace' passed while
// "On track today 4 / 4" rendered in green on the same page. Source assertions
// prove a branch EXISTS; only a render proves which one the reader sees.
//
// Both branches are legitimately in the bundle — `anyReading` is a runtime
// value, so Rollup keeps the verdict branch for when a second inventory lands.
// A residual grep therefore finds "On track today" and is right to. The
// question is what renders, and that is this.

describe('/goals renders no verdict while there is nothing to compare', () => {
  const body = () => {
    const { container } = render(
      React.createElement(MemoryRouter, { future: ROUTER_FUTURE }, React.createElement(Goals)),
    );
    return container.textContent;
  };

  it('shows no pace verdict, in either direction', () => {
    const text = body();
    expect(text).not.toContain('On track today');
    expect(text).not.toContain('Behind pace');
    expect(text).not.toContain('Ahead of pace');
    // 'On track' must not appear even as a pill
    expect(text).not.toMatch(/On track(?! today)/);
  });

  it('says so explicitly instead of staying silent', () => {
    const text = body();
    expect(text).toContain('No reading');
    expect(text).toContain('needs a second inventory to compare');
    expect(text).toContain('No reading yet');
  });

  it('and does not show a fabricated progress percentage', () => {
    expect(body()).not.toMatch(/0\.0% reduced/);
  });
});
