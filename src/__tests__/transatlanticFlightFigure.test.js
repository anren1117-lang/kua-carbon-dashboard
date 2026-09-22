// One round-trip transatlantic flight was priced three different ways on three
// surfaces a student sees, none of them derived from the others:
//
//   equivalents.js    1.4 mt ONE WAY (ICAO, sourced)  -> 2.8 mt round trip
//   DailyTip.js       "≈ 2.5 mtCO₂e" round trip
//   lessonLibrary.js  "~1.6 tCO₂e"  round trip
//
// 2.5 is not merely a third number — personalFootprint.js retired it BY NAME
// as sitting below all four published methods, and carbonMathPremises.test.js
// already pins that /carbon-math stopped using it. The homepage tip kept it.
// 1.6 is lower still, and is labelled CO₂e while being a CO₂-only figure.
//
// The ICAO constant is the one with a source attached, so both prose surfaces
// now derive from it rather than restating a number. This deliberately does
// NOT settle the open question of which international-travel factor the
// dashboard should adopt (MT_PER_INTL_FLIGHT is a separate, broader average):
// it makes that a one-line change instead of a hunt across three files.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { lessonLibrary } from '../data/lessonLibrary.js';
import { MT_PER_TRANSAT_FLT, MT_PER_TRANSAT_ROUND_TRIP } from '../utils/equivalents.js';
import { SCOPE2_TOTAL_MT } from '../data/scopeTotals.js';
import { TOTAL_STUDENTS } from '../data/students.js';

const tip = readFileSync(resolve(process.cwd(), 'components/DailyTip.js'), 'utf8');
const flightLesson = lessonLibrary.find((l) => /trans-Atlantic/.test(l.studentTask || ''));

describe('one transatlantic round trip, one number', () => {
  it('the round trip is derived from the sourced one-way rate', () => {
    expect(MT_PER_TRANSAT_FLT).toBe(1.4);
    expect(MT_PER_TRANSAT_ROUND_TRIP).toBeCloseTo(2.8, 5);
  });

  it('the lesson no longer prices the round trip below the one-way rate', () => {
    expect(flightLesson).toBeTruthy();
    // 1.6 for a round trip is below 2 x the one-way figure this repo publishes
    expect(flightLesson.studentTask).not.toMatch(/1\.6\s*tCO/);
    expect(flightLesson.studentTask).toContain(String(MT_PER_TRANSAT_ROUND_TRIP));
  });

  it('the homepage tip does not revive the figure the repo retired by name', () => {
    expect(tip).not.toMatch(/≈ 2\.5 mtCO/);
    expect(tip).toMatch(/MT_PER_TRANSAT_ROUND_TRIP/);
  });

  // The tip claims a round trip beats a student's whole share of Scope 2.
  // That is an arithmetic claim about two live constants, so check it rather
  // than trusting the sentence.
  it('the comparison the tip draws is actually true', () => {
    const scope2PerStudent = SCOPE2_TOTAL_MT / TOTAL_STUDENTS;
    expect(MT_PER_TRANSAT_ROUND_TRIP).toBeGreaterThan(scope2PerStudent);
  });
});
