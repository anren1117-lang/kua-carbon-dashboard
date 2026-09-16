// Per-building monthly electricity entered through the admin portal.
//
// The campus ledger (electricityLedger.js) deliberately ignores rows that name
// a building — it composes ONE campus figure. This is the other half: rows in
// scope2_meter_readings whose `building` is a building id and whose `source`
// is 'building_monthly' become per-building monthly readings, laid over the
// static history in monthlyConsumption.js.
//
// Why merge into that history rather than add another ladder: ten surfaces
// (campus map, building detail, dorm leaderboard + preview, dorm posters,
// compare-buildings, month compare, monthly digest, energy challenge) already
// read computeBuildingEmissions(), which takes `monthlyHistory` as an option.
// Feeding it a merged history keeps every one of them consistent by
// construction instead of by repetition.
//
// A per-building month must cover the WHOLE calendar month: computeBuildingEmissions
// divides the months it has by the share of a year those months represent
// (seasonalYearFraction, weighted by season rather than simply counted), so a
// half month would quietly halve that building's year.

import { daysInMonthKey } from './electricityLedger.js';

export const SOURCE_BUILDING_MONTHLY = 'building_monthly';

/**
 * scope2_meter_readings rows → { [buildingId]: { 'YYYY-MM': kwh } }.
 * Later rows win for the same building-month, so pass rows oldest → newest.
 * @returns {{ history: Record<string, Record<string, number>>, ignored: {id: any, reason: string}[] }}
 */
export function rowsToBuildingMonths(rows, { year } = {}) {
  const history = {};
  const ignored = [];
  for (const r of Array.isArray(rows) ? rows : []) {
    const start = String(r?.period_start ?? '').slice(0, 10);
    const end = String(r?.period_end ?? '').slice(0, 10);
    const month = start.slice(0, 7);
    const kwh = Number(r?.kwh);
    const reject = (reason) => ignored.push({ id: r?.id ?? null, reason });

    if (r?.source !== SOURCE_BUILDING_MONTHLY) { reject('not a per-building source'); continue; }
    if (!r.building) { reject('no building — campus-wide rows belong to the electricity ledger'); continue; }
    if (!/^\d{4}-\d{2}-01$/.test(start) || end.slice(0, 7) !== month || end < start) {
      reject('period must start on the 1st and end in the same month');
      continue;
    }
    const lastDay = String(daysInMonthKey(month)).padStart(2, '0');
    if (end.slice(8, 10) !== lastDay) {
      reject('a per-building month must cover the whole month');
      continue;
    }
    if (r.kwh === null || r.kwh === '' || !Number.isFinite(kwh)) { reject('kWh is not a number'); continue; }
    if (!(kwh > 0)) { reject('kWh must be greater than zero'); continue; }
    if (year && month.slice(0, 4) !== String(year)) {
      reject(`outside the reported year (${year})`);
      continue;
    }

    if (!history[r.building]) history[r.building] = {};
    history[r.building][month] = kwh;
  }
  return { history, ignored };
}

/** Admin months win per building-month; everything else keeps the seed value. */
export function mergeBuildingMonthlyHistory(seedHistory, adminHistory) {
  const out = {};
  for (const [buildingId, months] of Object.entries(seedHistory || {})) {
    out[buildingId] = { ...months };
  }
  for (const [buildingId, months] of Object.entries(adminHistory || {})) {
    out[buildingId] = { ...(out[buildingId] || {}), ...months };
  }
  return out;
}

/** Which buildings and months came from an admin entry — for provenance pills. */
export function adminBuildingMonthKeys(adminHistory) {
  const keys = new Set();
  for (const [buildingId, months] of Object.entries(adminHistory || {})) {
    for (const month of Object.keys(months)) keys.add(`${buildingId}|${month}`);
  }
  return keys;
}
