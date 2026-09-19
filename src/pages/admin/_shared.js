// Shared admin form helpers re-exported from one place so any /pages/admin/* page
// can import without reaching into scope3/.
export { useTable } from './scope3/useTable';
export { useFactor } from './scope3/useFactor';
export { RecordsTable, qualityPill } from './scope3/RecordsTable';
export { PreviewBanner } from './scope3/PreviewBanner';
export { formStyles } from './scope3/formStyles';

export const today = () => new Date().toISOString().slice(0, 10);
export const firstOfMonth = () => {
  const d = new Date(); d.setDate(1);
  return d.toISOString().slice(0, 10);
};

// The period this dashboard publishes. Admin forms default their
// school_year / fiscal_year to THIS, so a saved row lands inside the window
// composeScope3FromRecords actually counts.
//
// IMPORTED, not re-exported-through. `export { x } from 'y'` forwards x to
// this module's consumers but creates NO local binding, so the arrow function
// below referencing schoolYearOn threw ReferenceError on its first call.
// Phase 439 shipped exactly that; nothing called it, so the suite stayed green
// and the build succeeded. sharedAdminHelpers.test.js now CALLS the helpers.
import { REPORTING_SCHOOL_YEAR, schoolYearOn } from '../../data/academicCalendar.js';

export { REPORTING_SCHOOL_YEAR, schoolYearOn };
export { PeriodNote } from './scope3/PeriodNote';

// The wall-clock school year (rolls over Aug 1) — a different question, and
// on 2026-09-19 a different answer: '2026-2027' vs the published '2025-2026'.
// It must never default a stored row; periodStatusOf() would class it 'out'.
// Its job is telling an admin the two have diverged.
export const currentSchoolYear = () => schoolYearOn(new Date());

// LB → KG conversion for refrigerant fields.
export const LB_TO_KG = 0.45359237;
