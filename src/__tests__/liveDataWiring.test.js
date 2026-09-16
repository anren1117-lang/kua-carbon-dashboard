// Everything moves together, or the build fails.
//
// The dashboard's electricity figures now come from admin-entered data through
// hooks (useMeasuredScope2 / useMeasuredScopeTotals / useBmsExport /
// useBuildingMonthlyHistory). The static exports in gridMix.js and
// composedYtd.js remain as the FIRST-PAINT FALLBACK — `live.scope2Mt ||
// SCOPE2_TOTAL_MT`.
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
];

const LIVE_HOOKS = [
  'useMeasuredScope2',
  'useMeasuredScopeTotals',
  'useBmsExport',
  'useBuildingMonthlyHistory',
];

// Files that legitimately use statics only to derive a RATE (kg per kWh), or
// that are the fallback chain itself.
const RATE_ONLY = new Set([
  'pages/Renewables2.js',       // KG_PER_KWH = totalMt / totalKwh
  'pages/StudentChallenges.js', // same rate; its absolute figures come from hooks
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
  it('no surface displays a static electricity figure without also reading a live hook', () => {
    expect(offenders()).toEqual([]);
  });

  it('the exemption lists stay small and real', () => {
    // If either grows, check the file really belongs before adding it.
    expect(RATE_ONLY.size).toBeLessThanOrEqual(3);
    expect(PROSE.size).toBeLessThanOrEqual(2);
    for (const rel of [...RATE_ONLY, ...PROSE]) {
      expect(fs.existsSync(path.join(SRC, rel))).toBe(true);
    }
  });

  it('prose files are covered by the drift tripwire instead', () => {
    // The trade is explicit: no hook, but proseFigures.test.js fails if their
    // sentences stop matching the canonical totals.
    const prose = fs.readFileSync(path.join(SRC, '__tests__/proseFigures.test.js'), 'utf8');
    for (const rel of PROSE) expect(prose).toContain(rel);
  });
});
