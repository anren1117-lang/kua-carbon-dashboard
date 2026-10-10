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
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { TOTAL_STUDENTS } from '../data/students.js';

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
  // THIS BLOCK USED TO TRANSCRIBE ITS OWN ANSWER, and the transcription was
  // built from constants the dashboard had already left behind: a 2,650 sink
  // (canonical is ANNUAL_SEQUESTRATION_MT) over 340 students (canonical is
  // TOTAL_STUDENTS). So it asserted '5.1' for a net-per-student that no page
  // prints — and worse, it would have kept passing while every surface drifted
  // together, which is the one thing a consistency test must not do.
  //
  // What is worth asserting is the SHAPE and the CONSISTENCY: the helper owns
  // the rounding, nothing re-rounds to 2dp, and no surface carries a hardcoded
  // figure that disagrees with it. None of that needs a transcribed literal.
  const NET = GROSS_MT - ANNUAL_SEQUESTRATION_MT;
  it('every surface prints net-per-student the same way', () => {
    const expected = perStudentMt(NET, TOTAL_STUDENTS, 'estimated');
    // toFixed(2) anywhere in this family reintroduces 5.07 beside 5.1.
    for (const f of ['pages/Executive.js', 'pages/AnnualReport.js']) {
      const offenders = read(f).split('\n')
        .filter((l) => !l.trim().startsWith('//'))
        .filter((l) => /per\s*-?student|perStudent|PER_STUDENT/i.test(l))
        .filter((l) => /toFixed\(2\)/.test(l));
      expect(offenders, `${f} still prints a per-student figure to 2dp`).toEqual([]);
    }
    // an estimated total earns exactly one decimal — the rule this file sets
    expect(expected).toMatch(/^\d+\.\d$/);
    // and it is the real quantity, not a stale one
    expect(Number(expected)).toBeCloseTo(NET / TOTAL_STUDENTS, 1);
  });

  it('the scope pages agree with the helper', () => {
    for (const total of [SCOPE1_TOTAL_MT, SCOPE3_TOTAL_MT]) {
      const shown = perStudentMt(total, TOTAL_STUDENTS, 'estimated');
      expect(shown).toMatch(/^\d+\.\d$/);
      expect(Number(shown)).toBeCloseTo(total / TOTAL_STUDENTS, 1);
    }
  });

  it('the one-decimal rule is not vacuous — 2dp would fail it', () => {
    // the defect this file was written for: 3.97 printed beside 4.0
    expect('3.97').not.toMatch(/^\d+\.\d$/);
    // measured provenance earns two decimals, per the rule in the header
    expect(perStudentMt(SCOPE1_TOTAL_MT, TOTAL_STUDENTS, 'measured'))
      .toMatch(/^\d+\.\d{2}$/);
  });

  it('no surface hardcodes a stale per-student figure', () => {
    // LearnAgent's quiz asserted "~5.0 mtCO₂e per student net" while the
    // canonical value rounds to 5.1 — a number a student is asked to reason
    // from must not disagree with the dashboard it describes.
    const la = read('components/LearnAgent.js');
    expect(la).not.toMatch(/~5\.0 mtCO₂e per student/);
  });
});
