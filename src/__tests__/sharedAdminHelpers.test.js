// `export { x } from 'y'` is a RE-EXPORT: it forwards the binding to this
// module's consumers but does NOT create a local `x` in this module's scope.
// Phase 439 wrote exactly that shape in _shared.js and then referenced the
// re-exported name in a function body:
//
//   export { REPORTING_SCHOOL_YEAR, schoolYearOn } from '../../data/academicCalendar.js';
//   export const currentSchoolYear = () => schoolYearOn(new Date());   // ReferenceError
//
// Nothing called currentSchoolYear(), so the suite stayed green and the build
// succeeded — a latent crash waiting for its first caller, which is the very
// divergence note Phase 440 adds.
//
// Phase 439's tests could not have caught this: they assert on SOURCE TEXT
// (which form references which identifier) and never invoke anything. This
// file exists to CALL the helpers.

import { describe, it, expect } from 'vitest';
import { currentSchoolYear, schoolYearOn, REPORTING_SCHOOL_YEAR } from '../pages/admin/_shared';
import { REPORTING_PERIOD } from '../data/academicCalendar.js';

describe('_shared admin helpers are callable, not merely exported', () => {
  it('currentSchoolYear() runs without throwing', () => {
    expect(() => currentSchoolYear()).not.toThrow();
  });

  it('currentSchoolYear() returns a YYYY-YYYY label', () => {
    expect(currentSchoolYear()).toMatch(/^\d{4}-\d{4}$/);
  });

  it('currentSchoolYear() agrees with schoolYearOn(now)', () => {
    expect(currentSchoolYear()).toBe(schoolYearOn(new Date()));
  });

  it('re-exported values survive the hop through _shared', () => {
    expect(REPORTING_SCHOOL_YEAR).toBe(REPORTING_PERIOD.schoolYear);
    expect(schoolYearOn(new Date(2026, 7, 1))).toBe('2026-2027');
  });
});
