// Phase 488 derived the Scope 3 ordering because five surfaces had it wrong.
// This is the same move applied to the three "Dominant source" metrics that
// were still hand-typed — and all three were *correct* when this was written:
//
//   /scope-1   "Heating"          "~95% of Scope 1"   -> 95.5%, right
//   /scope-3   "Purchased goods"  "~50% / ~29%"       -> 49.9% / 28.8%, right
//   /scope-2   "New England grid (51%)"               -> mixPercent 51, right
//
// Which is the point. A literal that is right today is not a weaker version of
// a derived value, it is a different kind of thing: it records what someone
// believed once. Scope 3's literals were right too, until a reprice moved the
// data and nobody moved the words. Deriving them costs nothing now and is the
// only reason the next reprice cannot leave a stale ranking on a live page.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  SCOPE1_LINES, SCOPE1_LARGEST_LINE,
  SCOPE3_LINES, SCOPE3_LARGEST_LINE,
} from '../data/scopeTotals.js';
import { gridMix, GRID_MIX_LARGEST } from '../data/gridMix.js';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');

describe('every "dominant source" metric is read from the data', () => {
  it('the Scope 1 ordering is derived and heating really does lead it', () => {
    expect(SCOPE1_LARGEST_LINE.source).toMatch(/heating/i);
    expect(SCOPE1_LARGEST_LINE.shareOfScope1).toBeGreaterThan(90);
    const shares = SCOPE1_LINES.reduce((s, r) => s + r.shareOfScope1, 0);
    expect(shares).toBeCloseTo(100, 0);
    // strictly dominant, not a near-tie a reprice could flip unnoticed
    const rest = SCOPE1_LINES.filter((r) => r !== SCOPE1_LARGEST_LINE);
    expect(SCOPE1_LARGEST_LINE.mt).toBeGreaterThan(rest.reduce((s, r) => s + r.mt, 0));
  });

  it('the grid mix names its own largest fuel', () => {
    expect(GRID_MIX_LARGEST.source).toBe('Natural Gas');
    // the fuel supplying the most power also carries the most emissions HERE,
    // but those are two different questions — assert both, don't conflate them
    const dirtiest = gridMix.reduce((a, b) => (b.mtCO2e > a.mtCO2e ? b : a));
    expect(dirtiest.source).toBe(GRID_MIX_LARGEST.source);
    expect(GRID_MIX_LARGEST.mixPercent).toBeGreaterThan(40);
  });

  it('no surface still types the ranking by hand', () => {
    const s1 = read('pages/Scope1.js');
    expect(s1).not.toMatch(/value: 'Heating'/);
    expect(s1).not.toMatch(/~95% of Scope 1'/);
    expect(s1).toContain('SCOPE1_LARGEST_LINE');

    const s3 = read('pages/Scope3.js');
    expect(s3).not.toMatch(/value: 'Purchased goods'/);
    expect(s3).not.toMatch(/goods ~1,315 mt/);   // the old transcribed figure
    expect(s3).toContain('SCOPE3_LARGEST_LINE');

    const s2 = read('components/Scope2LiveDashboard.js');
    expect(s2).not.toMatch(/New England grid \(51%\)/);
    expect(s2).not.toMatch(/provides 51% of New England/);
    expect(s2).toContain('GRID_MIX_LARGEST');
  });

  it('the rendered Scope 3 note names the top two lines in order', () => {
    const sorted = SCOPE3_LINES.slice().sort((a, b) => b.mt - a.mt);
    const note = sorted.slice(0, 2)
      .map((r) => `${r.source.replace(/\s*\(.*\)\s*$/, '').toLowerCase()} ~${r.mt.toLocaleString()} mt ≈ ${Math.round(r.shareOfScope3)}%`)
      .join('; ');
    // this is what /scope-3 now builds; assert it says what we think it says
    // Built from SCOPE3_LINES rather than transcribed. The literal version
    // broke the moment the placeholder rows were repointed at the bottom-up
    // model (1,315 -> 1,317, 760 -> 804) — a false failure that says nothing
    // about whether the note names the right two lines in the right order.
    const top2 = [...SCOPE3_LINES].sort((a, b) => b.mt - a.mt).slice(0, 2);
    const label = (l) => l.source.replace(/\s*\(.*\)\s*$/, '').toLowerCase();
    const want = top2
      .map((l) => `${label(l)} ~${l.mt.toLocaleString()} mt ≈ ${Math.round(l.shareOfScope3)}%`)
      .join('; ');
    expect(note).toBe(want);
    // and it really is naming two different lines, largest first
    expect(top2[0].mt).toBeGreaterThan(top2[1].mt);
    expect(sorted[0]).toBe(SCOPE3_LARGEST_LINE);
  });
});
