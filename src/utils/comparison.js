// Period-over-period comparison helpers.

/**
 * @param {number} current
 * @param {number} previous
 */
export function percentChange(current, previous) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

/**
 * @param {number} current
 * @param {number} previous
 */
export function trendKind(current, previous) {
  const pc = percentChange(current, previous);
  if (pc === null) return 'unknown';
  if (pc > 5)  return 'worse';
  if (pc < -5) return 'better';
  return 'flat';
}

/**
 * Year-over-year delta for a monthly series.
 * @param {{ month: string, emissions: number }[]} thisYear
 * @param {{ month: string, emissions: number }[]} lastYear
 */
export function yoyMonthly(thisYear, lastYear) {
  const lastByMonth = Object.fromEntries(lastYear.map((m) => [m.month, m.emissions]));
  return thisYear.map((m) => ({
    month: m.month,
    current: m.emissions,
    previous: lastByMonth[m.month] ?? null,
    deltaPct: lastByMonth[m.month] != null ? percentChange(m.emissions, lastByMonth[m.month]) : null,
  }));
}
