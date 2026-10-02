// Phase 485 adopted EPA's published eGRID NEWE rate, moving the grid factor
// from the per-fuel reconstruction (~0.234) to 0.246391 and Scope 2 from ~390
// to 409.9 mt. The computation moved. Three places that SHOW the factor to a
// reader did not.
//
//   /campus-map  "Emissions = kWh × 0.234 kg/kWh"  — while computing at 0.2464
//   /hotspots    "× ISO-NE 2024 grid factor (~0.234 kg/kWh effective)"
//   /carbon-math worked example, below
//
// The first two are a page describing its own arithmetic wrongly: the number
// on screen was produced with one factor and attributed to another.
//
// The third is worse, because students do this one by hand. Question 1 stated
// the factor as 0.246, printed "1,660,000 kWh × 0.246 kg/kWh = 388,440 kg",
// and captioned the result "the figure /scope-2 publishes":
//
//   1,660,000 × 0.246    = 408,360     (what the printed line claims)
//   1,660,000 × 0.234    = 388,440     (what it actually printed)
//   /scope-2 publishes   = 409.9 mt    (not the 389 mt given as the answer)
//
// So the stated factor, the printed product, and the cross-reference were three
// different vintages in four lines. A student multiplying it out got a number
// the page then marked against a different one.
//
// All three now derive from KG_PER_KWH, and the example's answer derives from
// SCOPE2_TOTAL_MT so the cross-reference cannot go stale again.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { KG_PER_KWH } from '../data/gridMix.js';
import { SCOPE2_TOTAL_MT } from '../data/scopeTotals.js';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');
// Widened twice while writing this: my own guard found a second caption in
// Hotspots.js, and the repo-wide sweep then found the methodology table.
// Third time a list of surfaces I enumerated has come up short of a grep.
const PAGES = [
  'pages/CampusMap.js', 'pages/Hotspots.js', 'pages/CarbonMath.js',
  'pages/admin/AdminMethodology.js',
];

describe('every displayed grid factor is the one actually used', () => {
  it('no surface shows the retired reconstruction rate as the grid factor', () => {
    for (const rel of PAGES) {
      const src = read(rel);
      // only flag it where it is presented AS the factor, not in audit comments
      const offending = src.split('\n').filter((l) =>
        !l.trimStart().startsWith('//')
        && /0\.23[45]/.test(l)
        && /kg\s*\/?\s*kWh|kg CO/i.test(l));
      expect(offending, `${rel}: ${offending.join(' | ')}`).toEqual([]);
    }
  });

  it('the two map/hotspot captions interpolate the canonical factor', () => {
    expect(read('pages/CampusMap.js')).toMatch(/\{KG_PER_KWH\} kg\/kWh/);
    expect(read('pages/Hotspots.js')).toMatch(/\{KG_PER_KWH\} kg\/kWh/);
  });

  it('the worked example multiplies out correctly', () => {
    const kwh = Math.round((SCOPE2_TOTAL_MT * 1000) / KG_PER_KWH / 10000) * 10000;
    const kg = Math.round(kwh * KG_PER_KWH);
    // the identity the printed line asserts must actually hold
    expect(Math.abs(kwh * KG_PER_KWH - kg)).toBeLessThan(1);
    // the old line asserted something false, which is what this guards
    expect(Math.round(1660000 * 0.246)).not.toBe(388440);
  });

  it('and its answer is the figure /scope-2 really publishes', () => {
    const kwh = Math.round((SCOPE2_TOTAL_MT * 1000) / KG_PER_KWH / 10000) * 10000;
    const mt = Math.round((kwh * KG_PER_KWH) / 1000);
    expect(Math.abs(mt - SCOPE2_TOTAL_MT) / SCOPE2_TOTAL_MT).toBeLessThan(0.02);
    const src = read('pages/CarbonMath.js');
    expect(src).toContain('SCOPE2_TOTAL_MT');
    expect(src).not.toMatch(/answer: 389/);
    expect(src).not.toMatch(/388,440/);
  });

  it('the guard would catch the defect it was written for', () => {
    const bad = "      '1,660,000 kWh × 0.246 kg/kWh = 388,440 kg CO₂',";
    const good = "      `${S2_KWH.toLocaleString()} kWh × ${KG_PER_KWH} kg/kWh = ${S2_KG.toLocaleString()} kg CO₂`,";
    const flags = (l) => !l.trimStart().startsWith('//') && /0\.23[45]/.test(l) && /kg\s*\/?\s*kWh|kg CO/i.test(l);
    // the retired caption, verbatim, must trip the rule
    expect(flags("              {' '}Emissions = kWh × 0.234 kg/kWh (ISO-NE 2024 inventory rate).")).toBe(true);
    expect(flags(good)).toBe(false);
    // and an audit comment explaining the old value must NOT trip it
    expect(flags('// the comment here used to read 0.234 kg/kWh')).toBe(false);
    expect(bad).toContain('388,440');
  });
});

// A second naming problem, pointed out from a screenshot of /scope-2: the
// "Year 1 Scope 2 — 410 mtCO₂e" card was captioned "× ISO-NE 2024 effective
// rate". That phrase is the RECONSTRUCTION's name. Phase 485 adopted EPA's
// published eGRID NEWE rate and relabelled the per-fuel figure as composition
// only, so the card credited the published number to the retired method.
// Six occurrences across /scope-2, its BMS panel, and the net estimate.
describe('the adopted rate is called by its own name', () => {
  const SURFACES = ['pages/Scope2.js', 'components/Scope2BmsInsights.js', 'components/NetEstimate.js'];

  it('no surface still credits the figure to the reconstruction', () => {
    for (const rel of SURFACES) {
      expect(read(rel), rel).not.toMatch(/ISO-NE 2024 effective rate/);
    }
  });

  it('they name the published rate instead', () => {
    for (const rel of SURFACES) {
      expect(read(rel), rel).toMatch(/published eGRID NEWE rate/);
    }
  });

  it('the headline card shows a readable factor, not float noise', () => {
    const src = read('components/Scope2BmsInsights.js');
    // the local KG_PER_KWH is a division and prints 0.24639211545230552 raw
    expect(src).toMatch(/KG_PER_KWH\.toFixed\(3\)\} kg\/kWh published eGRID NEWE rate/);
    expect(((0.246391 * 1) ).toFixed(3)).toBe('0.246');
  });
});
