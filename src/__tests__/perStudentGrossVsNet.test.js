// LearnAgent told students their school-related footprint is "roughly 5-8
// mtCO2e per year BEFORE forest credits".
//
// 5-8 is the NET range. Canonical gross per student is 4,375/340 = 12.87;
// net after subtracting 2,650 mt of sequestration is 5.07. The same file
// says so twice elsewhere — ":311 gross ~12.9 mt/student" and a quiz at
// :781 whose wrong-answer explanation reads "You divided GROSS by students.
// Net subtracts sinks first."
//
// Labelled "before forest credits", the sentence tells a student the campus
// forest is worth nothing per head — inverting the entire point of the sinks
// path, on the page that introduces it.
//
// Pinned as an ORDERING, not as literals: whatever the figures become, the
// pre-credit number must exceed the post-credit one.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { GROSS_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { TOTAL_STUDENTS } from '../data/students.js';

const src = readFileSync(resolve(process.cwd(), 'components/LearnAgent.js'), 'utf8');
const grossPer = GROSS_MT / TOTAL_STUDENTS;
const netPer = (GROSS_MT - ANNUAL_SEQUESTRATION_MT) / TOTAL_STUDENTS;

describe('gross and net per student are not swapped', () => {
  it('the canonical figures are what this test assumes', () => {
    expect(grossPer).toBeCloseTo(12.87, 1);
    expect(netPer).toBeCloseTo(5.07, 1);
    expect(grossPer).toBeGreaterThan(netPer);
  });

  it('no surface calls the net range a pre-forest-credit figure', () => {
    const offenders = src.split('\n')
      .map((l, i) => [i + 1, l])
      .filter(([, l]) => /5[-–]8 ?mt/i.test(l))
      .filter(([, l]) => /before forest credit/i.test(l))
      .map(([n]) => `LearnAgent.js:${n}`);
    expect(offenders).toEqual([]);
  });

  it('both school-footprint sentences give gross AND net', () => {
    // The lesson must not leave a reader thinking the forest is worth
    // nothing: every sentence quoting the post-credit figure must also quote
    // the pre-credit one. Anchored on the phrase itself, not on the first
    // occurrence in the file — there are two, and they moved when Phase 455
    // edited this file.
    const hits = src.split('\n').filter((l) => /school-related footprint/.test(l));
    expect(hits.length).toBeGreaterThanOrEqual(2);
    for (const l of hits) {
      // Gross may be written "13 mt" or "~12.9 mt/student" — the Tokyo
      // comparison already used the latter and was correct before this fix.
      expect(l, 'a school-footprint sentence omits the gross figure')
        .toMatch(/13 mt|12\.9 mt/);
    }
    // ...and exactly the two rewritten sentences name the forest subtraction.
    // Matched on that phrase rather than on "about 5 mt", because one of them
    // carries markdown bold (about **5 mtCO2e ...) and the other does not.
    const netOnes = hits.filter((l) => /campus forest is subtracted/.test(l));
    expect(netOnes.length).toBe(2);
  });

  it('the file still states gross ~12.9 where it already did', () => {
    expect(src).toMatch(/gross ~12\.9 mt\/student/);
  });

  it('the quiz distractor still teaches the gross-vs-net distinction', () => {
    expect(src).toMatch(/You divided GROSS by students\. Net subtracts sinks first\./);
  });
});
