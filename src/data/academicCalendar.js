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
