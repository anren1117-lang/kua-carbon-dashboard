// Weather, measured — heating degree days for KUA's campus.
//
// WHY THIS EXISTS. Until now there was no weather data anywhere in this
// codebase. Seasonality was ASSERTED by the fixed multiplier table in
// seasonalPatterns.js and never measured, which means a mild winter reads as an
// efficiency win the school didn't earn, and a hard one reads as waste it
// didn't commit. That matters more since Phase 390, because the per-building
// annualization now divides by that same assumed shape.
//
// It is not a small effect here. January–August 2026 ran 9.1% milder than
// normal at the campus station: March −17.8%, April −18.3%, August −85.2%.
// None of that is currently visible on any page.
//
// THE STATION. Lebanon Municipal Airport (KLEB / WBAN 94765 / USW00094765),
// 43.627 N, 72.305 W, elevation 554 ft — about 13 miles from Plainfield, and
// the nearest first-order station with a continuous record. Base 65°F, the
// convention ENERGY STAR and NOAA both use: for each day with a mean below
// 65°F, HDD is 65 minus that mean, summed over the month.
//
// PROVENANCE. Actuals come from the Regional Climate Centers' ACIS service
// (NOAA-funded). Normals are the 1991–2020 period, verified two ways: ACIS and
// NCEI's published normals agree month for month (1401.1/1401, 1191.4/1191, …
// 1184.2/1184), annual 7,333 both ways.
//
// USE THE CURRENT NORMALS, NOT THE OLD SHEET. The NWS climate sheet for this
// station is still the 1961–1990 period and totals 7,825 HDD — 6.7% above the
// current normal of 7,333.5 (equivalently, today's normal is 6.3% below the old
// one; same two numbers, different denominator). Normalizing against the old
// sheet would inject the very bias this module exists to remove.

export const STATION = {
  id: 'KLEB',
  wban: '94765',
  ghcn: 'USW00094765',
  name: 'Lebanon Municipal Airport, NH',
  lat: 43.62707,
  lon: -72.30537,
  elevationFt: 554,
  milesFromCampus: 13,
  base: 65,
  provenance: 'cited',
};

/**
 * 1991–2020 monthly HDD normals, base 65°F. Index 1 = January.
 * Source: NOAA NCEI U.S. Climate Normals, cross-checked against ACIS.
 */
export const HDD_NORMAL_1991_2020 = {
  1: 1401.1, 2: 1191.4, 3: 1027.7, 4: 624.2, 5: 277.2, 6: 75.4,
  7: 13.7, 8: 26.6, 9: 168.7, 10: 510.8, 11: 832.5, 12: 1184.2,
};

/** The superseded period, kept only so nobody reintroduces it by accident. */
export const HDD_NORMAL_1961_1990 = {
  1: 1491, 2: 1257, 3: 1048, 4: 660, 5: 321, 6: 73,
  7: 16, 8: 47, 9: 206, 10: 543, 11: 855, 12: 1308,
};

/**
 * Measured monthly HDD by year. `partial` lists months whose record is
 * incomplete as captured — those are EXCLUDED from every comparison, because
 * half a September against a whole-September normal is the same trap as half a
 * metered month against a whole-month reading (see buildingMonths.js).
 * @type {Record<number, {hdd: Record<number, number>, partial: number[], asOf: string}>}
 */
export const HDD_ACTUAL = {
  2025: {
    hdd: { 1: 1372, 2: 1242, 3: 880, 4: 539, 5: 245, 6: 40, 7: 3, 8: 16, 9: 94, 10: 438, 11: 831, 12: 1284 },
    partial: [],
    asOf: '2025-12-31',
  },
  2026: {
    // September 2026 held 15 of 30 days when captured, so it is partial.
    hdd: { 1: 1337, 2: 1188, 3: 845, 4: 510, 5: 302, 6: 23, 7: 6, 8: 4, 9: 50 },
    partial: [9],
    asOf: '2026-09-15',
  },
};

export const ACTUALS_SOURCE = 'NOAA Regional Climate Centers ACIS, station KLEB, base 65°F';
export const NORMALS_SOURCE = 'NOAA NCEI U.S. Climate Normals 1991–2020, station USW00094765';

/** Normal HDD for a month (1–12), or null if out of range. */
export function hddNormal(month) {
  return HDD_NORMAL_1991_2020[month] ?? null;
}

/** Measured HDD for a year and month, or null when absent or partial. */
export function hddActual(year, month) {
  const rec = HDD_ACTUAL[year];
  if (!rec) return null;
  if (rec.partial.includes(month)) return null;
  return rec.hdd[month] ?? null;
}

/**
 * How a year's weather compared with normal, over whole months only.
 *
 * Returns null rather than a number when there is nothing to compare — a caller
 * that wants to say "no weather context yet" should be able to tell that from
 * an absent value, not from a 0% that reads as "exactly normal".
 *
 * @returns {{actualHdd:number, normalHdd:number, pctVsNormal:number,
 *            monthsCompared:number, monthsExcluded:number[]}|null}
 */
export function compareToNormal(year) {
  const rec = HDD_ACTUAL[year];
  if (!rec) return null;
  const months = Object.keys(rec.hdd)
    .map(Number)
    .filter((m) => !rec.partial.includes(m))
    .sort((a, b) => a - b);
  if (months.length === 0) return null;
  const actualHdd = months.reduce((s, m) => s + rec.hdd[m], 0);
  const normalHdd = months.reduce((s, m) => s + HDD_NORMAL_1991_2020[m], 0);
  return {
    actualHdd: Math.round(actualHdd),
    normalHdd: Math.round(normalHdd),
    pctVsNormal: normalHdd > 0 ? +(((actualHdd - normalHdd) / normalHdd) * 100).toFixed(1) : null,
    monthsCompared: months.length,
    monthsExcluded: [...rec.partial],
  };
}

/** Per-month actual-vs-normal, whole months only — for a chart or a table. */
export function monthlyComparison(year) {
  const rec = HDD_ACTUAL[year];
  if (!rec) return [];
  return Object.keys(rec.hdd)
    .map(Number)
    .sort((a, b) => a - b)
    .map((m) => {
      const partial = rec.partial.includes(m);
      const normal = HDD_NORMAL_1991_2020[m];
      return {
        month: m,
        actual: rec.hdd[m],
        normal,
        partial,
        pctVsNormal: partial || !(normal > 0)
          ? null
          : +(((rec.hdd[m] - normal) / normal) * 100).toFixed(1),
      };
    });
}

/**
 * Plain-language weather context for a year, or null when there isn't any.
 * Deliberately says "milder/colder than normal", not "used less energy" — this
 * module knows about weather, not about consumption.
 */
export function weatherContextText(year) {
  const c = compareToNormal(year);
  if (!c || c.pctVsNormal === null) return null;
  const mag = Math.abs(c.pctVsNormal);
  if (mag < 2) return `Heating weather ran close to normal (${c.monthsCompared} whole months, base 65°F).`;
  const dir = c.pctVsNormal < 0 ? 'milder' : 'colder';
  return `Heating weather ran ${mag.toFixed(1)}% ${dir} than the 1991–2020 normal across ${c.monthsCompared} whole months — before crediting or blaming anything the school did.`;
}

// ── Why there is no weatherNormalizedKwh() here ───────────────────────────
//
// Because the data doesn't support one yet, and a number that looks normalized
// but isn't would be worse than none.
//
// ENERGY STAR Portfolio Manager — the established method, built on Kissock's
// E-Tracker — fits a per-fuel regression of monthly energy against monthly
// temperature with variable change-points, then takes the ratio of expected
// energy at normal conditions to expected energy at actual conditions. It
// requires the most recent 24 calendar months of monthly data (12 at minimum)
// and a minimum R² of 0.4 for simple fits, 0.7 for complex ones. It also warns
// that some buildings have NO usable fit, because base load swamps weather —
// plausible here, since KUA heats with oil and propane (Scope 1), so electricity
// may correlate weakly with HDD.
//
// KUA currently has 4 measured building-months and 9 campus feed-months. That is
// short of the floor, and fitting a change-point regression to it would produce
// a confident-looking coefficient with no evidence behind it.
//
// So this module reports weather, and lets the reader do the attributing. When
// a full 12 months of metered data exists, revisit — and fit per fuel, check R²
// against the floor, and report "no usable fit" honestly if that is the answer.

export const NORMALIZATION_READINESS = {
  ready: false,
  methodRequiresMonths: 12,
  preferredMonths: 24,
  minimumRSquared: 0.4,
  reason: 'ENERGY STAR / E-Tracker change-point regression needs at least 12 months of monthly data per fuel; KUA has 4 measured building-months and 9 campus feed-months.',
  source: 'ENERGY STAR Portfolio Manager Technical Reference, Climate and Weather (September 2025)',
};
