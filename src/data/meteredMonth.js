// Measured campus electricity — a real 30-day window pulled from the
// Envysion power-meter trend export (MeterTrends, 2026-08-16 → 2026-09-14,
// hourly). This is MEASURED data, not a Fermi estimate: it's the whole-
// campus grid draw, aggregated so building service mains aren't double-
// counted against their own sub-feeds, with on-site solar generation
// tracked separately.
//
// How it was derived (see also docs/metered-month.md):
//   - ~110 power-meter feeds each report a cumulative kWh counter.
//   - Daily consumption = day-over-day difference of the counters.
//   - Campus total uses each building's service main where one exists,
//     and the sum of that meter's panel feeds where it doesn't — so a
//     main and its children are never both counted.
//   - Solar feeds (PM_15 Field + RoofTop, PM_19) count backwards
//     (generation); reported here as positive generation.
//
// IMPORTANT — what is and isn't "measured" here:
//   - The daily kWh series and the solar generation ARE metered.
//   - The CO₂e numbers are measured kWh × a MODELED published factor
//     (ISO-NE 0.235 kg/kWh), so they are estimates, not measurements.
//   - The "annualized" figures are a naive ×365 extrapolation of this
//     window. This window is a term-STARTUP RAMP: campus is nearly empty
//     at ~2,400 kWh/day in mid-August and climbs to ~6,000 as the term
//     begins. That slice misses the deep-summer trough and the full
//     winter/spring term, so extrapolating it is NOT an annual estimate —
//     the true error band is easily ±30% and the direction of bias is
//     unknown. Reserve real annual claims for the full-year composed model.
//
// The extrapolation lands in the same order of magnitude as the
// dashboard's modeled ~385 mtCO₂e/yr Scope 2 figure, but that is not an
// independent cross-check: both multiply by the same 0.235 factor and both
// annualize from partial windows. Treat it as a rough sanity check on
// measured kWh, not validation of the annual total.

// ISO-NE 2024 effective grid factor used across the dashboard.
export const ISONE_KG_PER_KWH = 0.235;

export const METERED_MONTH_META = {
  source: 'Envysion power-meter trend export (BMS)',
  windowStart: '2026-08-16',
  windowEnd: '2026-09-14',
  intervalMinutes: 60,
  feedsMetered: 110,
  method:
    'Building service mains where present, else summed panel feeds; solar tracked separately. Day-over-day counter differencing.',
  note: 'Last day (Sep 14) ends 19:00, so it is a partial day.',
};

// Daily campus grid consumption (kwh) and on-site solar generation
// (solarKwh, positive) for the window. Straight from the trend export.
export const METERED_DAILY = [
  { date: '2026-08-16', kwh: 2422, solarKwh: 301 },
  { date: '2026-08-17', kwh: 3277, solarKwh: 251 },
  { date: '2026-08-18', kwh: 3591, solarKwh: 287 },
  { date: '2026-08-19', kwh: 3494, solarKwh: 294 },
  { date: '2026-08-20', kwh: 3568, solarKwh: 271 },
  { date: '2026-08-21', kwh: 3654, solarKwh: 291 },
  { date: '2026-08-22', kwh: 3336, solarKwh: 266 },
  { date: '2026-08-23', kwh: 3554, solarKwh: 235 },
  { date: '2026-08-24', kwh: 3785, solarKwh: 303 },
  { date: '2026-08-25', kwh: 3647, solarKwh: 276 },
  { date: '2026-08-26', kwh: 3602, solarKwh: 308 },
  { date: '2026-08-27', kwh: 4088, solarKwh: 272 },
  { date: '2026-08-28', kwh: 4108, solarKwh: 285 },
  { date: '2026-08-29', kwh: 3757, solarKwh: 322 },
  { date: '2026-08-30', kwh: 5010, solarKwh: 243 },
  { date: '2026-08-31', kwh: 5099, solarKwh: 286 },
  { date: '2026-09-01', kwh: 4895, solarKwh: 227 },
  { date: '2026-09-02', kwh: 5798, solarKwh: 222 },
  { date: '2026-09-03', kwh: 6055, solarKwh: 229 },
  { date: '2026-09-04', kwh: 6213, solarKwh: 285 },
  { date: '2026-09-05', kwh: 5939, solarKwh: 257 },
  { date: '2026-09-06', kwh: 5484, solarKwh: 263 },
  { date: '2026-09-07', kwh: 5452, solarKwh: 315 },
  { date: '2026-09-08', kwh: 5790, solarKwh: 269 },
  { date: '2026-09-09', kwh: 5801, solarKwh: 223 },
  { date: '2026-09-10', kwh: 5961, solarKwh: 257 },
  { date: '2026-09-11', kwh: 5285, solarKwh: 302 },
  { date: '2026-09-12', kwh: 4932, solarKwh: 300 },
  { date: '2026-09-13', kwh: 5478, solarKwh: 224 },
  { date: '2026-09-14', kwh: 4283, solarKwh: 261 },
];

// Derived rollups — computed once from METERED_DAILY so callers don't
// re-reduce. Kept in sync automatically because they derive from the
// array above.
//
// The final day (Sep 14) ends at 19:00, so it is a partial day. It's
// included in the window total (that's the real measured sum) but
// EXCLUDED from the per-day average and the annualization, so a ~79% day
// isn't counted as a full one — otherwise avgDailyKwh reads low.
export const METERED_TOTALS = (() => {
  const kwh = METERED_DAILY.reduce((s, d) => s + d.kwh, 0);
  const solarKwh = METERED_DAILY.reduce((s, d) => s + d.solarKwh, 0);
  const days = METERED_DAILY.length;

  // Full-day basis: drop the trailing partial day for rate math.
  const fullDays = METERED_DAILY.slice(0, -1);
  const fullDayCount = fullDays.length;
  const fullDayKwh = fullDays.reduce((s, d) => s + d.kwh, 0);
  const avgDailyKwh = Math.round(fullDayKwh / fullDayCount);

  return {
    kwh,
    solarKwh,
    days,
    avgDailyKwh,
    // Emissions = measured kWh × a MODELED published factor. Estimate, not
    // measurement — see the header note.
    grossMtCO2e: +((kwh * ISONE_KG_PER_KWH) / 1000).toFixed(1),
    // Naive ×365 extrapolation of a non-representative startup month. NOT
    // an annual estimate — surfaced only as a flagged sanity check.
    annualizedKwh: Math.round(avgDailyKwh * 365),
    annualizedGrossMtCO2e: Math.round((avgDailyKwh * 365 * ISONE_KG_PER_KWH) / 1000),
  };
})();
