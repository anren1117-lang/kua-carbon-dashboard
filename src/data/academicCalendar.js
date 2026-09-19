// How long KUA's year is — and why that is more than one number.
//
// Four places counted the school year independently, and they didn't agree:
//
//   utils/personalFootprint.js    170 days   student commute
//   data/geographicEstimates.js   180 days   day-student commute
//   data/geographicEstimates.js   180 days   FACULTY/STAFF commute
//   data/scopeTotals.js           5 × 36     admin-entered commuting rows = 180
//
// A student using the footprint tool was shown "170 school days" while the
// institutional inventory assumed 180 for the same commute — about 6% apart on
// a figure the same person could see twice in one sitting.
//
// TWO CONSTANTS, NOT ONE — this is the point of the module.
//
// It is tempting to collapse all four onto a single SCHOOL_DAYS. Don't. Phase
// 392 made exactly that mistake with avoided emissions: two values sharing a
// UNIT are not necessarily answering the same QUESTION. Students attend on
// instructional days. Faculty and staff also work orientation, exam periods,
// professional days and duty weekends, and many live on campus. Those two
// counts coincide at 180 here only because both were assumed, and they should
// be free to diverge the moment either is actually measured.
//
// PROVENANCE, stated honestly: both figures are ESTIMATES. KUA runs three
// trimesters; the school publishes a "Major Dates Calendar" each year, and the
// real instructional-day count lives there. It is not in this repo, and
// inventing a precise-looking number from trimester boundaries would be worse
// than an round estimate that says what it is. 180 is used because three of the
// four call sites already assumed it, including the 5 × 36 default for
// admin-entered rows — so aligning on it changes the fewest published figures
// and moves the remaining one in the unflattering direction.
//
// Replace with the real counts when Facilities supplies the Major Dates
// Calendar, and set provenance to 'cited' at the same time.

/**
 * Days a STUDENT is expected on campus for classes. Used for day-student
 * commute estimates, both in the personal calculator and the cohort inventory.
 */
export const INSTRUCTIONAL_DAYS = 180;

/**
 * Days FACULTY AND STAFF are on campus. Deliberately a separate constant from
 * INSTRUCTIONAL_DAYS even though both are 180 today — staff work days that
 * students don't attend, so a measured value will almost certainly be higher.
 */
export const STAFF_WORK_DAYS = 180;

/** Weeks of the admin-entered commuting default (5 days × 36 weeks = 180). */
export const COMMUTE_WEEKS_DEFAULT = 36;
export const COMMUTE_DAYS_PER_WEEK_DEFAULT = 5;

/**
 * Weeks a BOARDING student is actually resident on campus — a third quantity
 * again, distinct from both constants above.
 *
 * personalFootprint.js priced beef and dorm showers at 52 weeks, a full
 * calendar year, for students who go home for summer, winter and spring
 * breaks. That overstates both rows.
 *
 * 34 is an estimate, and the honest bounds are worth stating: INSTRUCTIONAL_DAYS
 * implies roughly 36 teaching weeks, but boarders are resident across weekends
 * within a term, while a long summer plus winter and spring breaks removes
 * something like 14-16 weeks from the calendar year. So the defensible band is
 * ~32-38 weeks and 34 sits in the middle of it. It is NOT derived from a
 * published calendar, because the Major Dates Calendar that would settle it is
 * not in this repo — the same gap that left INSTRUCTIONAL_DAYS estimated.
 *
 * Day students are a different case again: they sleep at home, so dorm showers
 * don't apply to them at all, and their dining is term-time only.
 */
export const STUDENT_RESIDENCY_WEEKS = 34;

export const CALENDAR_PROVENANCE = {
  provenance: 'estimated',
  termStructure: 'three trimesters',
  source: 'KUA publishes a Major Dates Calendar per academic year; the instructional-day count is not in this repo.',
  whyEstimated: 'No published instructional-day count was available at the time of writing. Deriving one from trimester boundaries would manufacture precision this figure does not have.',
  replaceWhen: 'Facilities supplies the Major Dates Calendar — set provenance to "cited" and split INSTRUCTIONAL_DAYS from STAFF_WORK_DAYS if they differ, which they probably do.',
};

/**
 * Known adjacent issue, recorded rather than silently inherited:
 * personalFootprint.js prices beef and showers at 52 weeks, i.e. a full
 * calendar year. Boarding students are not on campus for 52 weeks — summer,
 * winter and spring breaks take a substantial bite — so those lines likely
 * overstate. Fixing it means deciding what a "student-year" is for dining and
 * hot water, which is a separate question from commuting and wants its own
 * constant; not folded in here.
 */
export const STUDENT_WEEKS_ON_CAMPUS_UNRESOLVED = true;

/**
 * The reporting period the inventory covers.
 *
 * TWO REPRESENTATIONS, because the tables disagree about how to say "when".
 * Eight store a DATE — fuel_bills.date, scope1_heating_oil.delivery_date,
 * scope1_propane.delivery_date, scope1_refrigerants.service_date,
 * scope1_fleet.period_start/end, waste.date, study_abroad.departure_date,
 * faculty_travel.departure_date. Five store a YEAR LABEL — day_students,
 * us_boarding_students, international_students and commuting via school_year,
 * purchased_goods via fiscal_year. A row is matched on whichever it carries.
 *
 * The school year is the default because it is the label KUA's own admin
 * forms write. Until Phase 439 that sentence was aspirational: no form
 * imported this module. Five froze the literal '2025-2026' and three seeded
 * from the wall clock, which on 2026-09-19 says '2026-2027' — a value this
 * same file's periodStatusOf() then classifies 'out'. They all read
 * REPORTING_SCHOOL_YEAR now, so the claim is structural rather than a
 * coincidence that holds until July.
 *
 * This is a BOUNDARY, not a duration — deliberately separate from
 * INSTRUCTIONAL_DAYS and STUDENT_RESIDENCY_WEEKS above, for the same reason
 * this module keeps two day-counts instead of one.
 */
export const REPORTING_PERIOD = {
  schoolYear: '2025-2026',
  startIso:   '2025-07-01',
  endIso:     '2026-06-30',
  label:      '2025-2026 school year',
  provenance: 'estimated',
  note: 'Bounds Scope 1 and Scope 3 live rows. Rows with no date at all are counted IN and reported separately — excluding them would silently zero every row entered before the date columns were fetched.',
};

/** The period this dashboard PUBLISHES. Every admin form defaults to it. */
export const REPORTING_SCHOOL_YEAR = REPORTING_PERIOD.schoolYear;

/**
 * Which school year a DATE falls in, on the boarding-school convention that
 * the year rolls over Aug 1.
 *
 * This is the WALL CLOCK, not the reporting period, and the two are different
 * questions with different answers: on 2026-09-19 this returns '2026-2027'
 * while the dashboard publishes '2025-2026'. periodStatusOf() compares those
 * strings exactly, so a row stamped from the clock is classified 'out' and
 * never reaches a published total — the admin still sees a successful save.
 *
 * So: forms default to REPORTING_SCHOOL_YEAR. The clock year's remaining job
 * is telling a human when the two have diverged.
 */
export function schoolYearOn(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const sy = d.getMonth() >= 7 ? y : y - 1;
  return `${sy}-${sy + 1}`;
}

/**
 * Scope 2 does NOT share that window, and this publishes the gap rather than
 * hiding it — the same posture as FACTOR_RECONCILIATION and
 * SINKS_RECONCILIATION.
 *
 * composedYtd.js composes calendar 2026 (Jan 1 -> COMPOSED_YTD_AS_OF
 * 2026-09-14, 257 days) and annualizes it. Scope 1 and Scope 3 are entered
 * against the school year. Summing the two adds up two different twelve-month
 * windows, which the GHG Protocol's consistency principle would flag.
 * Restating either one moves published figures, so it is a decision, not a fix.
 */
export const PERIOD_RECONCILIATION = {
  scope1And3: '2025-2026 school year (2025-07-01 to 2026-06-30)',
  scope2:     'calendar 2026, YTD to 2026-09-14 (257 days), seasonally annualized',
  aligned:    false,
  note: 'Scope 2 comes from monthly BMS captures keyed to the calendar year; Scope 1 and 3 from admin forms keyed to the school year. Until one is restated the inventory spans two different windows.',
};
