// Everything moves together, or the build fails.
//
// The dashboard's figures come from admin-entered data through hooks. The
// static exports in gridMix.js, composedYtd.js, scopeTotals.js and sinks.js
// remain as the FIRST-PAINT FALLBACK — `live.scope2Mt || SCOPE2_TOTAL_MT`.
//
// Until Phase 428 this guard was ELECTRICITY-ONLY: ABSOLUTE listed the six
// Scope 2 constants and nothing else, and LIVE_HOOKS omitted the Scope 1,
// Scope 3 and sinks hooks even though all three existed and were already in
// use. So the rule below was stated in general terms and enforced for one
// scope. Extending it exposed exactly one offender out of 23 surfaces —
// CarbonCredits.js, which priced the forest's drawdown at $8/$25/$40 a ton
// with no hook at all. The comment at RATE_ONLY says an exemption that has
// stopped being true is a quiet lie inside the guard against quiet lies; a
// constant the guard was never taught to watch is the same lie by omission.
//
// The failure this guards against isn't a crash: a surface that reads only the
// static constant keeps rendering last release's number while every other page
// moves, and nothing says so. That happened to /scope-2's live dashboard —
// Overview, Time Analysis, Buildings and Energy Sources all sat on the static
// annual figure, so entering a month moved the rest of the site and not them.
//
// Rule: a page or component that imports an ABSOLUTE static figure must also
// read a live hook. Importing a RATE (kg/kWh, derived by dividing two statics)
// is fine — a rate doesn't move when the composed kWh does, which the
// 400k–2.5M kWh check in CLAUDE.md verified.

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(new URL('../', import.meta.url).pathname);

// Absolute figures: a kWh or mtCO₂e total that moves when data is entered.
const ABSOLUTE = [
  'GRID_MIX_ANNUAL_MTCO2E',
  'GRID_MIX_TOTAL_KWH',
  'COMPOSED_ANNUAL_KWH',
  'COMPOSED_ANNUALIZE_FACTOR',
  'COMPOSED_YTD_KWH',
  'SCOPE2_TOTAL_MT',
  // Phase 428 — the other three scopes move on admin entry too.
  'SCOPE1_TOTAL_MT',
  'SCOPE3_TOTAL_MT',
  'GROSS_MT',
  'ANNUAL_SEQUESTRATION_MT',
];

const LIVE_HOOKS = [
  'useMeasuredScope2',
  'useMeasuredScopeTotals',
  'useBmsExport',
  'useBuildingMonthlyHistory',
  // Phase 428 — all three already existed and were already consumed by
  // Scope1.js, Scope3.js, Sinks.js, Sinks2.js and the admin surfaces.
  'useMeasuredScope1',
  'useMeasuredScope3',
  'useMeasuredSinks',
];

// Files that legitimately use statics only to derive a RATE (kg per kWh), or
// that are the fallback chain itself.
const RATE_ONLY = new Set([
  // Renewables2.js came off this list in Phase 392: it no longer derives a rate
  // from the absolute totals at all, because its avoided-emissions figure moved
  // to AVERT's marginal rate. An exemption that has stopped being true is worse
  // than no exemption — it's a quiet lie inside the guard against quiet lies.
  'pages/StudentChallenges.js', // rate only; its absolute figures come from hooks
]);

// Prose, not a dashboard readout. LearnAgent interpolates the headline figures
// into four sentences of a ~1,600-line lesson structure built at module scope,
// the same category as data/learningContent.js: written by hand, and guarded
// against drift by proseFigures.test.js rather than by a hook. Rebuilding that
// structure per-render to make four sentences reactive would risk the teaching
// content for no reader-visible gain. If lessons ever show a live readout,
// move it out of here rather than widening the list.
const PROSE = new Set([
  'components/LearnAgent.js',
]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'dist' || entry.name === 'node_modules' || entry.name === '__tests__') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

function offenders() {
  const bad = [];
  for (const dir of ['components', 'pages']) {
    for (const file of walk(path.join(SRC, dir))) {
      const rel = path.relative(SRC, file);
      if (RATE_ONLY.has(rel) || PROSE.has(rel)) continue;
      const text = fs.readFileSync(file, 'utf8');
      const imports = text.split('\n').filter((l) => l.startsWith('import ')).join('\n');
      const usesAbsolute = ABSOLUTE.filter((name) => new RegExp(`\\b${name}\\b`).test(imports));
      if (usesAbsolute.length === 0) continue;
      const usesHook = LIVE_HOOKS.some((h) => text.includes(h));
      if (!usesHook) bad.push(`${rel} reads ${usesAbsolute.join(', ')} but no live hook — it will keep showing last release's number after an admin enters data`);
    }
  }
  return bad;
}

describe('live data wiring', () => {
  it('no surface displays a static figure without also reading a live hook', () => {
    expect(offenders()).toEqual([]);
  });

  it('the rule covers all four scopes, not just electricity', () => {
    // The Phase 428 regression: ABSOLUTE held only the six Scope 2 constants,
    // so a page could render a stale Scope 1 / Scope 3 / gross / sink figure
    // forever and this guard would pass.
    for (const name of ['SCOPE1_TOTAL_MT', 'SCOPE3_TOTAL_MT', 'GROSS_MT', 'ANNUAL_SEQUESTRATION_MT']) {
      expect(ABSOLUTE).toContain(name);
    }
    for (const hook of ['useMeasuredScope1', 'useMeasuredScope3', 'useMeasuredSinks']) {
      expect(LIVE_HOOKS).toContain(hook);
    }
  });

  it('catches a surface that reads a static total with no hook', () => {
    // Guard against a rule that matches nothing: a synthetic file importing an
    // absolute figure and calling no hook must be reported.
    const dir = path.join(SRC, 'components');
    const tmp = path.join(dir, '.wiring-fixture.js');
    fs.writeFileSync(tmp, "import { SCOPE1_TOTAL_MT } from '../data/scopeTotals.js';\nexport const x = SCOPE1_TOTAL_MT;\n", 'utf8');
    try {
      expect(offenders().some((o) => o.includes('.wiring-fixture.js'))).toBe(true);
    } finally {
      fs.unlinkSync(tmp);
    }
  });

  it('the exemption lists stay small and real', () => {
    // If either grows, check the file really belongs before adding it.
    expect(RATE_ONLY.size).toBeLessThanOrEqual(3);
    expect(PROSE.size).toBeLessThanOrEqual(2);
    for (const rel of [...RATE_ONLY, ...PROSE]) {
      expect(fs.existsSync(path.join(SRC, rel))).toBe(true);
    }
  });

  it('a reconciliation object that no page imports publishes NOTHING', () => {
    // Phase 429 exported PERIOD_RECONCILIATION and its commit said it
    // "publishes" the Scope 2 / Scope 1-3 period mismatch. Nothing imported
    // it, so Rollup tree-shook it out and it reached no reader — the same
    // complaint as "lives in comments only", restated with an export keyword.
    //
    // Asserting aligned === false would have passed the whole time. The claim
    // is REACHABILITY, so that is what this asserts: some page must import it.
    const pageImports = (name) => {
      for (const dir of ['components', 'pages']) {
        for (const file of walk(path.join(SRC, dir))) {
          const text = fs.readFileSync(file, 'utf8');
          const imports = text.split('\n').filter((l) => l.startsWith('import ')).join('\n');
          if (new RegExp(`\\b${name}\\b`).test(imports)) return path.relative(SRC, file);
        }
      }
      return null;
    };
    expect(pageImports('PERIOD_RECONCILIATION')).toBeTruthy();
    expect(pageImports('SINKS_RECONCILIATION')).toBeTruthy();
    expect(pageImports('FACTOR_RECONCILIATION')).toBeTruthy();
  });

  it('every scope page states which twelve months it covers', () => {
    // Scope 1, 2, 3 and Sinks each had ZERO mentions of a reporting period
    // before Phase 431. A total without its period is not a reportable figure.
    for (const rel of ['pages/Scope1.js', 'pages/Scope3.js', 'pages/Sinks.js']) {
      expect(fs.readFileSync(path.join(SRC, rel), 'utf8')).toMatch(/period:\s*REPORTING_PERIOD\.label/);
    }
    expect(fs.readFileSync(path.join(SRC, 'pages/Scope2.js'), 'utf8')).toMatch(/Reporting period/);
  });

  it('prose files are covered by the drift tripwire instead', () => {
    // The trade is explicit: no hook, but proseFigures.test.js fails if their
    // sentences stop matching the canonical totals.
    const prose = fs.readFileSync(path.join(SRC, '__tests__/proseFigures.test.js'), 'utf8');
    for (const rel of PROSE) expect(prose).toContain(rel);
  });
});
