// Fifth pass: SUPERLATIVES AND ORDERINGS. A claim that X is the biggest
// contains no figure and no ratio, so none of the earlier sweeps can see it —
// and unlike an adjective, it can be flatly true or false.
//
// Four surfaces said Scope 3 at KUA is dominated by student travel. It is not,
// and it has not been for some time:
//
//   purchased goods  1,315 mt   49.9% of Scope 3
//   student travel     760 mt   28.8%
//   dining             235 mt    8.9%
//   upstream fuel      230 mt    8.7%
//   commuting           90 mt    3.4%
//   waste                5 mt    0.2%
//
// Purchased goods is nearly double travel. /scope-3 already labelled its
// "Dominant source" correctly as purchased goods — while the same page's
// category list called student travel "likely the single largest Scope 3
// source". One page, two answers.
//
// This one matters beyond tidiness. A school reading "your Scope 3 is mostly
// travel" would go after flights; the number says the larger lever is
// procurement. Getting the ordering wrong misdirects the action, which is the
// entire purpose of the page.
//
// Also fixed here: "Scope 3 is ~2x larger than Scope 1 + Scope 2 combined" is
// 1.5x (2,635 against 1,760), and was never 2x.
//
// The ordering is now derived and exported once, so four surfaces cannot hold
// four opinions about it.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  SCOPE3_LINES, SCOPE3_LARGEST_LINE, SCOPE3_LARGEST_LABEL,
  SCOPE3_TOTAL_MT, SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT,
} from '../data/scopeTotals.js';
import { LEARNING_PATHS } from '../components/LearnAgent.js';

describe('the Scope 3 ordering is stated once and stated right', () => {
  it('the lines are published with their shares, derived', () => {
    expect(SCOPE3_LINES.length).toBeGreaterThanOrEqual(5);
    const total = SCOPE3_LINES.reduce((s, r) => s + r.mt, 0);
    expect(total).toBeCloseTo(SCOPE3_TOTAL_MT, 0);
    for (const r of SCOPE3_LINES) {
      expect(r.shareOfScope3).toBeCloseTo((r.mt / SCOPE3_TOTAL_MT) * 100, 1);
    }
  });

  it('the largest line is purchased goods, not travel', () => {
    expect(SCOPE3_LARGEST_LINE.source).toMatch(/purchased goods/i);
    expect(SCOPE3_LARGEST_LINE.shareOfScope3).toBeGreaterThan(45);
    const travel = SCOPE3_LINES.find((r) => /student travel/i.test(r.source));
    expect(travel.mt).toBeLessThan(SCOPE3_LARGEST_LINE.mt);
    // and by a wide margin, so this is not a close call that could flip
    expect(SCOPE3_LARGEST_LINE.mt / travel.mt).toBeGreaterThan(1.5);
  });

  it('no surface calls Scope 3 travel-dominated', () => {
    const FILES = [
      'pages/Scope3.js', 'components/PeerComparison.js',
      'components/AISummary.js', 'components/DailyTip.js',
      // added after the commit gate found a fifth surface this list missed:
      // a full LearnAgent teaching body that stated it twice.
      'components/LearnAgent.js',
    ];
    const CLAIM = /(dominated by|mostly|largest Scope 3 source|biggest scope at KUA is)[^.`'"]{0,40}travel/i;
    const offenders = [];
    for (const rel of FILES) {
      readFileSync(resolve(process.cwd(), rel), 'utf8').split('\n').forEach((line, i) => {
        if (line.trimStart().startsWith('//')) return;
        if (CLAIM.test(line)) offenders.push(`${rel}:${i + 1}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it('the Scope 3 versus Scope 1+2 multiple is stated as it is', () => {
    const multiple = SCOPE3_TOTAL_MT / (SCOPE1_TOTAL_MT + SCOPE2_TOTAL_MT);
    expect(multiple).toBeCloseTo(1.5, 1);
    expect(multiple).toBeLessThan(2);
    const tip = readFileSync(resolve(process.cwd(), 'components/DailyTip.js'), 'utf8');
    expect(tip).not.toMatch(/~2x larger than Scope 1/);
  });

  it('the Scope 3 lesson teaches the measured ordering, not the expected one', () => {
    const bodies = [];
    const walk = (n) => Array.isArray(n) ? n.forEach(walk)
      : (n && typeof n === 'object') && Object.values(n).forEach((v) =>
          typeof v === 'string' ? bodies.push(v) : walk(v));
    walk(LEARNING_PATHS);
    const body = bodies.find((b) => /Scope 3 is the biggest, messiest/.test(b));
    expect(body).toBeTruthy();
    // both shares present, and derived — a reprice moves them together
    expect(body).toContain(`${SCOPE3_LARGEST_LINE.shareOfScope3}%`);
    const travel = SCOPE3_LINES.find((r) => /student travel/i.test(r.source));
    expect(body).toContain(`${travel.shareOfScope3}%`);
    // the label is lowercased for mid-sentence use, so it must never open one
    expect(body).not.toMatch(new RegExp(`[.!?]\\s+${SCOPE3_LARGEST_LABEL}\\b`));
  });

  it('the guard catches the claim it was written for', () => {
    const CLAIM = /(dominated by|mostly|largest Scope 3 source|biggest scope at KUA is)[^.`'"]{0,40}travel/i;
    expect(CLAIM.test('Scope 3 = 2,635 mt — dominated by international + US-boarder term-break travel.')).toBe(true);
    expect(CLAIM.test('Scope 3 = 2,635 mt — led by purchased goods, then student travel.')).toBe(false);
  });
});
