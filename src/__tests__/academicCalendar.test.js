// One calendar, two questions.
//
// Four places counted the school year and two disagreed: the personal footprint
// calculator showed a student "170 school days" while the institutional
// inventory assumed 180 for the same commute. These tests pin the alignment —
// and, more importantly, pin the SEPARATION that must survive it.

import { describe, it, expect } from 'vitest';
import {
  INSTRUCTIONAL_DAYS,
  STAFF_WORK_DAYS,
  COMMUTE_WEEKS_DEFAULT,
  COMMUTE_DAYS_PER_WEEK_DEFAULT,
  CALENDAR_PROVENANCE,
  STUDENT_RESIDENCY_WEEKS,
} from '../data/academicCalendar.js';
import { estimatePersonalFootprint } from '../utils/personalFootprint.js';

describe('the two day-counts stay two', () => {
  it('exports student days and staff days as separate constants', () => {
    // THE GUARD THAT MATTERS. If someone later "tidies" these into a single
    // SCHOOL_DAYS export, this test fails on an undefined import rather than
    // silently re-creating the conflation the module exists to prevent —
    // the same mistake Phase 392 made by unifying avoided emissions with the
    // Scope 2 inventory factor because they shared a unit.
    expect(typeof INSTRUCTIONAL_DAYS).toBe('number');
    expect(typeof STAFF_WORK_DAYS).toBe('number');
    expect(INSTRUCTIONAL_DAYS).toBeGreaterThan(0);
    expect(STAFF_WORK_DAYS).toBeGreaterThan(0);
  });

  it('allows staff days to meet or exceed student days, never fall below', () => {
    // Staff work orientation, exam periods and professional days on top of
    // instructional days. Equal today because both are assumed; if a measured
    // value ever puts staff BELOW students, something is wrong.
    expect(STAFF_WORK_DAYS).toBeGreaterThanOrEqual(INSTRUCTIONAL_DAYS);
  });
});

describe('the admin-entry default reconciles with the cohort estimate', () => {
  it('5 days x 36 weeks is the same year as INSTRUCTIONAL_DAYS', () => {
    // scopeTotals.js defaults admin-entered commuting rows to these. If they
    // stop agreeing, an admin's typed row and the cohort estimate silently
    // price the same commute differently.
    expect(COMMUTE_DAYS_PER_WEEK_DEFAULT * COMMUTE_WEEKS_DEFAULT).toBe(INSTRUCTIONAL_DAYS);
  });
});

describe('provenance is honest about being an estimate', () => {
  it('does not claim to be cited', () => {
    // KUA publishes a Major Dates Calendar; its instructional-day count is not
    // in this repo. Upgrading this to 'cited' without adding a real source
    // would be exactly the false precision this project keeps removing.
    expect(CALENDAR_PROVENANCE.provenance).toBe('estimated');
    expect(CALENDAR_PROVENANCE.whyEstimated).toMatch(/precision|not available|no published/i);
    expect(CALENDAR_PROVENANCE.replaceWhen).toMatch(/Major Dates Calendar/i);
  });

  it('records the term structure it is estimating against', () => {
    expect(CALENDAR_PROVENANCE.termStructure).toMatch(/trimester/i);
  });
});

describe('residency weeks are a third quantity, not a reuse of either day-count', () => {
  it('is fewer than a calendar year — breaks are not on campus', () => {
    // Was 52: a full calendar year of campus beef and dorm showers for a
    // student who goes home for summer, winter and spring.
    expect(STUDENT_RESIDENCY_WEEKS).toBeLessThan(52);
  });

  it('sits inside the defensible band, roughly 32-38 weeks', () => {
    // Below ~32 would ignore that boarders are resident across weekends within
    // a term; above ~38 would ignore the length of the summer break.
    expect(STUDENT_RESIDENCY_WEEKS).toBeGreaterThanOrEqual(32);
    expect(STUDENT_RESIDENCY_WEEKS).toBeLessThanOrEqual(38);
  });

  it('is its own constant, not a reuse of the teaching-week default', () => {
    // Residency counts weekends inside a term; COMMUTE_WEEKS_DEFAULT counts
    // teaching weeks for a day student driving in. Different questions, so
    // they should not collapse onto one symbol.
    //
    // (An earlier draft compared against COMMUTE_WEEKS_DEFAULT * DAYS_PER_WEEK,
    // which is 180 DAYS — comparing weeks to days, trivially unequal, and
    // therefore a guard that proved nothing.)
    expect(typeof STUDENT_RESIDENCY_WEEKS).toBe('number');
    expect(STUDENT_RESIDENCY_WEEKS).not.toBe(COMMUTE_WEEKS_DEFAULT);
  });
});

describe('the residency assumption is visible to the student who is asked to audit it', () => {
  it('states the weeks in the beef row, which previously hid its multiplier', () => {
    const r = estimatePersonalFootprint({ studentType: 'us_boarding', beefFrequency: 'weekly' });
    const beef = r.components.find((c) => /beef/i.test(c.label));
    expect(beef.note).toContain(String(STUDENT_RESIDENCY_WEEKS));
    expect(beef.note).not.toContain('52');
  });

  it('states the weeks in the shower row and says breaks are excluded', () => {
    const r = estimatePersonalFootprint({ studentType: 'us_boarding', showersPerWeek: 7 });
    const shower = r.components.find((c) => /shower/i.test(c.label));
    expect(shower.note).toContain(String(STUDENT_RESIDENCY_WEEKS));
    expect(shower.note).toMatch(/break/i);
  });

  it('prices beef at residency weeks, not a calendar year', () => {
    const r = estimatePersonalFootprint({ studentType: 'us_boarding', beefFrequency: 'weekly' });
    const beef = r.components.find((c) => /beef/i.test(c.label));
    // 1 serving/week x residency weeks x ~15 kg, in tonnes.
    // Was 9 until Phase 405 corrected beef to the full-supply-chain factor.
    expect(beef.mt).toBeCloseTo((1 * STUDENT_RESIDENCY_WEEKS * 15) / 1000, 2);
  });
});

describe('the student-facing calculator uses the shared constant', () => {
  it('prices a day student commute at INSTRUCTIONAL_DAYS, not a local copy', () => {
    const r = estimatePersonalFootprint({ studentType: 'day', commuteMilesOneWay: 10 });
    const commute = r.components.find((c) => /commute/i.test(c.label));
    // 10 mi one-way x 2 x days x 0.40 kg/mi, in tonnes.
    // 0.40 until Phase 406 adopted the EPA Hub Table 10 commuting factor.
    expect(commute.mt).toBeCloseTo((10 * 2 * INSTRUCTIONAL_DAYS * 0.2986) / 1000, 2);
  });

  it('shows the same figure in the note a student reads', () => {
    const r = estimatePersonalFootprint({ studentType: 'day', commuteMilesOneWay: 10 });
    const commute = r.components.find((c) => /commute/i.test(c.label));
    expect(commute.note).toContain(String(INSTRUCTIONAL_DAYS));
    // The old 170 must not survive anywhere in what the student is shown.
    expect(commute.note).not.toContain('170');
  });

  it('still charges boarders no commute at all', () => {
    const r = estimatePersonalFootprint({ studentType: 'us_boarding', commuteMilesOneWay: 10 });
    const commute = r.components.find((c) => /commute/i.test(c.label));
    expect(commute.mt).toBe(0);
  });
});
