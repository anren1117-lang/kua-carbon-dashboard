// Eight admin forms write a reporting-period field. They disagreed about what
// the default should be, and the disagreement was not cosmetic.
//
//   Cat7Commuting, Cat1PurchasedGoods, ForestStands  -> currentSchoolYear()
//   Cat5Waste, StudentDay, StudentUSBoarding,
//   StudentInternational, StudyAbroad                -> frozen '2025-2026'
//
// currentSchoolYear() answers "what school year is it in the real world"
// (rolling over Aug 1). REPORTING_PERIOD.schoolYear names "which period this
// dashboard publishes". On 2026-09-19 those are '2026-2027' and '2025-2026' —
// and periodStatusOf compares the string EXACTLY, so a row saved through a
// currentSchoolYear() form is classified 'out' and drops out of the published
// Scope 3 total. The admin sees a successful save.
//
// academicCalendar.js:104 already asserted the forms defaulted to the
// reporting period. None of them imported it.
//
// The invariant worth pinning is not "the default equals some literal" — that
// is just the bug written down — but that a row created with the default
// LANDS IN the period the dashboard publishes.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  REPORTING_PERIOD, REPORTING_SCHOOL_YEAR, schoolYearOn,
} from '../data/academicCalendar.js';
import { periodStatusOf } from '../data/scopeTotals.js';

const FORMS = [
  'scope3/Cat5Waste.js', 'scope3/Cat7Commuting.js', 'scope3/Cat1PurchasedGoods.js',
  'scope3/StudentDay.js', 'scope3/StudentUSBoarding.js', 'scope3/StudentInternational.js',
  'scope3/StudyAbroad.js', 'sinks/ForestStands.js',
];
const read = (f) => readFileSync(new URL(`../pages/admin/${f}`, import.meta.url), 'utf8');

describe('the school year a form writes vs the period the dashboard publishes', () => {
  it('schoolYearOn() rolls over on Aug 1, not Jan 1', () => {
    expect(schoolYearOn(new Date(2026, 6, 31))).toBe('2025-2026'); // Jul 31
    expect(schoolYearOn(new Date(2026, 7, 1))).toBe('2026-2027');  // Aug 1
    expect(schoolYearOn(new Date(2026, 8, 19))).toBe('2026-2027'); // today-ish
    expect(schoolYearOn(new Date(2026, 0, 15))).toBe('2025-2026'); // mid-year
  });

  it('exposes the published period as one named constant', () => {
    expect(REPORTING_SCHOOL_YEAR).toBe(REPORTING_PERIOD.schoolYear);
  });

  it('a row stamped with the published period is IN it — the whole point', () => {
    expect(periodStatusOf({ school_year: REPORTING_SCHOOL_YEAR })).toBe('in');
    expect(periodStatusOf({ fiscal_year: REPORTING_SCHOOL_YEAR })).toBe('in');
  });

  it('records that the clock year and the published period CAN diverge', () => {
    // Not asserted as "they differ today" — that would break the day the
    // period is rolled forward. Asserted as: when they differ, the clock
    // year is out of period, which is exactly why a form must not use it.
    const clock = schoolYearOn(new Date(2026, 8, 19));
    if (clock !== REPORTING_SCHOOL_YEAR) {
      expect(periodStatusOf({ school_year: clock })).toBe('out');
    }
  });
});

describe('every admin form defaults to the published period', () => {
  it.each(FORMS)('%s hardcodes no school-year literal', (f) => {
    const src = read(f);
    const lines = src.split('\n')
      .filter((l) => !l.trim().startsWith('//'))
      .filter((l) => /(school_year|fiscal_year)\s*:\s*['"]\d{4}-\d{4}['"]/.test(l));
    expect(lines).toEqual([]);
  });

  it.each(FORMS)('%s takes its default from the shared constant', (f) => {
    expect(read(f)).toMatch(/REPORTING_SCHOOL_YEAR/);
  });

  it('no form still seeds its period field from the wall clock', () => {
    // currentSchoolYear() survives — it answers a real question, and the
    // divergence note uses it — but it must not DEFAULT a stored row.
    const offenders = FORMS.filter((f) =>
      /(school_year|fiscal_year)\s*:\s*currentSchoolYear\(\)/.test(read(f)));
    expect(offenders).toEqual([]);
  });

  // A frozen year is a defect wherever it sits, not only in a `field: 'x'`
  // assignment. Cat1PurchasedGoods rendered placeholder="e.g. 2025-2026" — a
  // year EMBEDDED in a longer string — and the first version of this detector
  // required the year to be the whole quoted literal, so it matched nothing
  // and went green against the live defect. Grepping the built chunks is what
  // exposed it: seven form chunks had dropped the literal and one had not.
  const YEAR_LITERAL = /[12][09]\d\d-[12][09]\d\d/;
  const codeLines = (src) => src.split('\n')
    .filter((l) => !l.trim().startsWith('//') && !l.trim().startsWith('*'));

  it('the detector can actually fail — otherwise the sweep below proves nothing', () => {
    expect(YEAR_LITERAL.test('placeholder="e.g. 2025-2026"')).toBe(true);   // the real pre-fix line
    expect(YEAR_LITERAL.test("school_year: '2025-2026'")).toBe(true);
    expect(YEAR_LITERAL.test('school_year: REPORTING_SCHOOL_YEAR')).toBe(false);
    expect(YEAR_LITERAL.test("surveyed_at: '2025-07-01'")).toBe(false);     // dates untouched
  });

  it.each(FORMS)('%s carries no frozen year literal anywhere', (f) => {
    expect(codeLines(read(f)).filter((l) => YEAR_LITERAL.test(l))).toEqual([]);
  });
});
