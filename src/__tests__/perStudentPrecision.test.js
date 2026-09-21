// @vitest-environment jsdom
//
// PRECISION IS A CLAIM ABOUT DATA QUALITY. Phase 400 established the rule for
// extrapolated building figures ("precision follows coverage"). This applies
// the same principle to the per-student family, where it was doing two things
// wrong at once.
//
// 1. FALSE PRECISION. Scope 1 per student printed 3.97 — 0.01 mtCO₂e of
//    claimed resolution — while its own published range is 895–1,875 mt, which
//    per student spans 2.88. The displayed resolution is 288x finer than the
//    uncertainty the same page publishes one line below.
//
// 2. THREE ANSWERS TO ONE QUESTION. Net per student appeared as 5.07
//    (Executive, AnnualReport: toFixed(2)), 5.1 (AISummary, LearnAgent:
//    toFixed(1)) and ~5.0 (a hardcoded LearnAgent quiz). A reader moving
//    between pages saw the same quantity three ways.
//
// The rule: precision follows PROVENANCE. An estimated total earns one
// decimal; a measured one earns two. Nothing earns more than its range.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { perStudentMt, PER_STUDENT_DP } from '../utils/modelledPrecision.js';
import { SCOPE1_TOTAL_MT, SCOPE3_TOTAL_MT, GROSS_MT } from '../data/scopeTotals.js';

const SRC = resolve(process.cwd(), '.');
const read = (rel) => readFileSync(resolve(SRC, rel), 'utf8');

describe('precision follows provenance', () => {
  it('an estimated per-student figure earns one decimal, a measured one two', () => {
    expect(PER_STUDENT_DP.estimated).toBe(1);
    expect(PER_STUDENT_DP.measured).toBe(2);
    expect(perStudentMt(1350, 340, 'estimated')).toBe('4.0');
    expect(perStudentMt(1350, 340, 'measured')).toBe('3.97');
  });

  it('treats cited like estimated — a projection is not a measurement', () => {
    expect(perStudentMt(1350, 340, 'cited')).toBe('4.0');
  });

  it('never divides by zero students', () => {
    expect(perStudentMt(1350, 0, 'estimated')).toBeNull();
    expect(perStudentMt(null, 340, 'estimated')).toBeNull();
  });

  it('the displayed resolution is no finer than the published range', () => {
    // Scope 1: range 895–1875 over 340 students spans 2.88 mtCO₂e/student.
    // One decimal (0.1) is still 28x finer than that spread — but two (0.01)
    // is 288x, which is the claim this phase removes.
    const spread = (1875 - 895) / 340;
    const shown = 10 ** -PER_STUDENT_DP.estimated;
    expect(spread / shown).toBeLessThan(40);
  });
});

describe('one quantity, one printed value', () => {
  const NET = GROSS_MT - 2650;
  it('every surface prints net-per-student the same way', () => {
    const expected = perStudentMt(NET, 340, 'estimated'); // '5.1'
    // toFixed(2) anywhere in this family reintroduces 5.07 beside 5.1.
    for (const f of ['pages/Executive.js', 'pages/AnnualReport.js']) {
      const offenders = read(f).split('\n')
        .filter((l) => !l.trim().startsWith('//'))
        .filter((l) => /per\s*-?student|perStudent|PER_STUDENT/i.test(l))
        .filter((l) => /toFixed\(2\)/.test(l));
      expect(offenders, `${f} still prints a per-student figure to 2dp`).toEqual([]);
    }
    expect(expected).toBe('5.1');
  });

  it('the scope pages agree with the helper', () => {
    expect(perStudentMt(SCOPE1_TOTAL_MT, 340, 'estimated')).toBe('4.0');
    expect(perStudentMt(SCOPE3_TOTAL_MT, 340, 'estimated')).toBe('7.8');
  });

  it('no surface hardcodes a stale per-student figure', () => {
    // LearnAgent's quiz asserted "~5.0 mtCO₂e per student net" while the
    // canonical value rounds to 5.1 — a number a student is asked to reason
    // from must not disagree with the dashboard it describes.
    const la = read('components/LearnAgent.js');
    expect(la).not.toMatch(/~5\.0 mtCO₂e per student/);
  });
});
