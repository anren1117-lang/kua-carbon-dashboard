// Day-of-week and monthly multipliers used by the MockMeterAdapter to shape
// interval readings into realistic patterns. Values reflect KUA campus
// activity (high midweek, low weekend; high winter heating, low summer).

/**
 * @typedef {Object} DayOfWeekPattern
 * @property {string} day
 * @property {number} multiplier
 * @property {string} label
 */

/** @type {DayOfWeekPattern[]} */
export const dayOfWeekPattern = [
  { day: 'Sunday',    multiplier: 0.70, label: 'Lowest - Weekend' },
  { day: 'Monday',    multiplier: 1.15, label: 'High - Week starts' },
  { day: 'Tuesday',   multiplier: 1.12, label: 'High - Full operations' },
  { day: 'Wednesday', multiplier: 1.10, label: 'High - Mid-week peak' },
  { day: 'Thursday',  multiplier: 1.08, label: 'Moderate - Winding down' },
  { day: 'Friday',    multiplier: 0.95, label: 'Lower - Weekend prep' },
  { day: 'Saturday',  multiplier: 0.75, label: 'Low - Weekend' },
];

/**
 * @typedef {Object} MonthlyPattern
 * @property {string} month
 * @property {number} emissions   Monthly mtCO2e share of the annual scope-2 baseline
 * @property {string} heating
 * @property {number} multiplier  Relative usage multiplier (1.0 = annual average month)
 */

/** @type {MonthlyPattern[]} */
export const monthlyPattern = [
  { month: 'Jan', emissions: 23.1, heating: 'High',     multiplier: 1.25 },
  { month: 'Feb', emissions: 21.9, heating: 'High',     multiplier: 1.19 },
  { month: 'Mar', emissions: 20.0, heating: 'Moderate', multiplier: 1.08 },
  { month: 'Apr', emissions: 17.4, heating: 'Low',      multiplier: 0.94 },
  { month: 'May', emissions: 15.7, heating: 'None',     multiplier: 0.85 },
  { month: 'Jun', emissions: 13.2, heating: 'None',     multiplier: 0.71 },
  { month: 'Jul', emissions: 10.8, heating: 'None',     multiplier: 0.59 },
  { month: 'Aug', emissions: 11.9, heating: 'None',     multiplier: 0.65 },
  { month: 'Sep', emissions: 16.7, heating: 'Low',      multiplier: 0.91 },
  { month: 'Oct', emissions: 19.0, heating: 'Moderate', multiplier: 1.03 },
  { month: 'Nov', emissions: 21.2, heating: 'High',     multiplier: 1.15 },
  { month: 'Dec', emissions: 22.2, heating: 'High',     multiplier: 1.20 },
];

// Hour-of-day shape (0..23). Peaks during academic hours, dips overnight.
export const hourOfDayShape = [
  0.55, 0.50, 0.48, 0.47, 0.48, 0.55,
  0.70, 0.95, 1.20, 1.35, 1.45, 1.50,
  1.45, 1.40, 1.45, 1.40, 1.30, 1.20,
  1.15, 1.10, 1.00, 0.85, 0.70, 0.60,
];
