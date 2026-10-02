// Does this meter's output look like sunlight?
//
// parseBmsExport classifies a meter as generation when its cumulative counter
// DECREASES over the window, because a bidirectional meter counts down while
// exporting. That rule catches real arrays, and it also catches every
// backwards-installed CT on an ordinary consumption panel — the counter runs
// down there too, for a completely different reason.
//
// Scope2BmsInsights then counted any feed that was named "Solar" AND flagged
// generation as solar output. In the 2026-08-17 → 09-15 export that admitted
// PM_15_FieldSolarFeed at 6,649 kWh beside the rooftop array's 1,639 — five
// sixths of the campus's apparent solar. Its hour-of-day profile:
//
//   PM_15_RoofTopSolarFeed   night 0.00 kW   midday 8.26 kW   ratio 0.00
//   PM_15_FieldSolarFeed     night 8.08 kW   midday 10.5 kW   ratio 0.92
//
// The field feed produces at 2am about as fast as at noon. Whatever it is
// measuring, it is not sunlight. Counting it as generation inflated the solar
// offset roughly fivefold and, because measured emissions are computed as
// (consumption − solar) × factor, made the campus look cleaner than it is.
//
// The name test and the direction test are both necessary and jointly
// insufficient. A third test — shape — is the one that distinguishes an array
// from a miswired CT, and it needs no extra data: the export already carries
// the hour-of-day profile.
//
// Written after a new Meter Trends CSV (2026-09-03 → 10-02) prompted a look at
// the solar feeds. My first reading of that data was that the field array was
// producing 6,649 kWh and the dashboard was understating campus solar
// fourfold. The profile check is what stopped that correction from shipping.

/** Hours treated as dark enough that a PV array must be near zero. */
export const NIGHT_HOURS = [0, 1, 2, 3, 22, 23];
/** Hours around solar noon, where a working array must peak. */
export const MIDDAY_HOURS = [10, 11, 12, 13, 14];

/**
 * Night output may not exceed this fraction of midday output for a feed to be
 * accepted as solar. Deliberately loose: a real array reads 0.00 here, and the
 * miswired feed reads 0.92, so anything in between is already pathological.
 */
export const SOLAR_NIGHT_DAY_MAX = 0.10;

/**
 * Hour-of-day shape test for a meter from parseBmsExport.
 * `hourly[h]` is that meter's mean kW for hour h, so the ratio is unitless.
 *
 * @param {{hourly?: number[]}} meter
 */
export function solarProfile(meter) {
  const h = Array.isArray(meter?.hourly) ? meter.hourly : [];
  const mean = (hours) => hours.reduce((t, i) => t + (Number(h[i]) || 0), 0) / hours.length;
  const nightKw = +mean(NIGHT_HOURS).toFixed(3);
  const middayKw = +mean(MIDDAY_HOURS).toFixed(3);
  // No midday output at all is not a solar shape either — it is a dead feed.
  const nightDayRatio = middayKw > 0 ? +(nightKw / middayKw).toFixed(3) : Infinity;
  return {
    nightKw,
    middayKw,
    nightDayRatio,
    isSolarShaped: middayKw > 0 && nightDayRatio <= SOLAR_NIGHT_DAY_MAX,
  };
}

/**
 * A feed counts as solar generation only if all three agree: it is named for
 * solar, its counter runs backwards, and its output follows the sun.
 */
export function countsAsSolar(meter) {
  return /Solar/i.test(meter?.id || '')
    && meter?.direction === 'generation'
    && solarProfile(meter).isSolarShaped;
}

/**
 * Generation-flagged feeds that fail the shape test — a backwards CT reads
 * exactly like an array to the direction rule. Worth a facilities ticket each.
 */
export function miswiredGenerationSuspects(meters = []) {
  return meters
    .filter((m) => m.direction === 'generation' && !solarProfile(m).isSolarShaped)
    .map((m) => ({ id: m.id, totalKwh: m.totalKwh, ...solarProfile(m) }));
}
