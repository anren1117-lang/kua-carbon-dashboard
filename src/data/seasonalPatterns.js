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

// ── Seasonal annualization ───────────────────────────────────────────────
//
// The multipliers above are RELATIVE, and they deliberately don't sum to 12
// (they sum to 11.55, so an average month is 0.9625). Anything that scales a
// partial year up to a full one must divide by the share of the year it
// actually measured — never multiply by 12/monthsCovered, which silently
// assumes every month is average.
//
// This is the same construction projectYear1() in electricityLedger.js uses
// (`share = multiplier / multSum`), exported here so the campus side and the
// per-building side share ONE seasonal dialect instead of two that can drift.

/**
 * Each month's share of the year, summing to 1. Index 0 = January.
 * @param {MonthlyPattern[]} [pattern]  Injectable for tests.
 * @returns {number[]} Twelve shares summing to 1; all zeros if the pattern is degenerate.
 */
export function seasonalShares(pattern = monthlyPattern) {
  const sum = pattern.reduce((s, m) => s + m.multiplier, 0);
  return sum > 0 ? pattern.map((m) => m.multiplier / sum) : pattern.map(() => 0);
}

/**
 * What fraction of a year a set of whole calendar months represents, weighted
 * by season. Twelve months → 1. January alone → 0.108, because January is a
 * heavy heating month; July alone → 0.051.
 *
 * The same month of the same year counts once. The same month of DIFFERENT
 * years counts twice, and the result can exceed 1 — two Januaries measure two
 * Januaries, so dividing their combined kWh by twice January's share gives the
 * average year, which is what the caller wants. (Deduping by month index
 * instead would sum both readings while counting one share, inflating the
 * answer roughly twofold.)
 *
 * Returns 0, not null, for an empty or unusable set — unlike its sibling
 * annualizeFactorForWindow() in composedYtd.js, which returns null deliberately.
 * The conventions differ because the quantities do: that one is a MULTIPLIER,
 * where a plausible-looking 1 would silently publish a month as a year, so it
 * needs a sentinel no caller can mistake for an answer. This is a SUM over a set
 * of months, and the sum over no months is genuinely 0 — not a sentinel at all.
 * It is a divisor, so every caller must guard it; both in-tree callers do.
 *
 * @param {string[]} monthKeys  'YYYY-MM' strings, zero-padded.
 * @param {MonthlyPattern[]} [pattern]  Injectable for tests.
 * @returns {number} The months' combined share of a year — 1 for a full twelve,
 *                   above 1 when more than a year is supplied, and 0 when
 *                   nothing valid was passed. Callers treat 0 as "no basis to
 *                   annualize from", never as a factor of 1.
 */
export function seasonalYearFraction(monthKeys, pattern = monthlyPattern) {
  const shares = seasonalShares(pattern);
  const seen = new Set();
  let fraction = 0;
  for (const key of Array.isArray(monthKeys) ? monthKeys : []) {
    const k = String(key);
    if (!/^\d{4}-\d{2}$/.test(k)) continue;
    const idx = parseInt(k.slice(5, 7), 10) - 1;
    if (!(idx >= 0 && idx < shares.length)) continue;
    if (seen.has(k)) continue;
    seen.add(k);
    fraction += shares[idx];
  }
  return fraction;
}

// Hour-of-day shape (0..23). Peaks during academic hours, dips overnight.
export const hourOfDayShape = [
  0.55, 0.50, 0.48, 0.47, 0.48, 0.55,
  0.70, 0.95, 1.20, 1.35, 1.45, 1.50,
  1.45, 1.40, 1.45, 1.40, 1.30, 1.20,
  1.15, 1.10, 1.00, 0.85, 0.70, 0.60,
];
