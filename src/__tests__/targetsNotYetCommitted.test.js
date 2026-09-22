// @vitest-environment jsdom
//
// /goals called the targets "KUA's committed reduction pathway" while every
// one of them carries `approved: false` — and the same page says so twice:
// the summary stat reads "Approved 0 / 4 · Board ratification pending", and
// each target row reads "Pending board approval". AnnualReport gets it right
// too ("Targets are preliminary pending board approval").
//
// So the page contradicted its own status fields in its subtitle. For a
// school-board audience "committed" is not a synonym for "proposed": it is a
// claim that the board has ratified something it has not.
//
// The fix is DERIVED, not reworded: the pathway description is computed from
// the approval count, so the day the board ratifies, the page starts saying
// "committed" on its own instead of waiting for someone to remember.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { reductionTargets, pathwayDescription } from '../data/targets.js';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');

describe('the pathway is described by its actual approval state', () => {
  it('says PROPOSED while nothing is ratified', () => {
    const none = reductionTargets.map((t) => ({ ...t, approved: false }));
    const d = pathwayDescription(none);
    expect(d).toMatch(/proposed/i);
    expect(d).not.toMatch(/\bcommitted\b/i);
  });

  it('says COMMITTED only when every target is ratified', () => {
    const all = reductionTargets.map((t) => ({ ...t, approved: true }));
    expect(pathwayDescription(all)).toMatch(/committed/i);
  });

  it('reports the split when some are ratified', () => {
    const some = reductionTargets.map((t, i) => ({ ...t, approved: i === 0 }));
    const d = pathwayDescription(some);
    expect(d).toMatch(new RegExp(`1 of ${reductionTargets.length}`));
    expect(d).not.toMatch(/^KUA's committed/i);
  });

  it('is safe on an empty list rather than claiming anything', () => {
    expect(pathwayDescription([])).toMatch(/no reduction targets/i);
  });
});

describe('no surface claims a commitment the board has not made', () => {
  it('today, zero targets are approved — the premise of this test', () => {
    // If this ever fails the fixture is stale, not the product.
    expect(reductionTargets.every((t) => t.approved === false)).toBe(true);
  });

  it('Goals.js does not hardcode "committed" in its subtitle', () => {
    const src = read('pages/Goals.js');
    const offenders = src.split('\n')
      .map((l, i) => [i + 1, l])
      .filter(([, l]) => !l.trim().startsWith('//'))
      .filter(([, l]) => /subtitle=/.test(l) && /\bcommitted\b/i.test(l))
      .map(([n, l]) => `Goals.js:${n}: ${l.trim().slice(0, 90)}`);
    expect(offenders).toEqual([]);
  });

  it('Goals.js derives the description instead of stating one', () => {
    expect(read('pages/Goals.js')).toMatch(/pathwayDescription/);
  });

  it('AnnualReport still discloses that targets are preliminary', () => {
    // This was already right; pin it so the fix above does not regress it.
    expect(read('pages/AnnualReport.js')).toMatch(/preliminary pending board approval/i);
  });
});
