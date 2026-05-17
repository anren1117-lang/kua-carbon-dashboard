// Per-building annual kWh + mtCO₂e roll-up, used by the campus map.
// Pure function — takes the buildings list + the monthly-consumption
// history and returns one row per building with annual kWh, mtCO₂e,
// per-sqft intensity, and a calibrated "share of campus" percent.
//
// kWh → mtCO₂e via the ISO-NE 2024 effective factor (~0.235 kg/kWh,
// the same number /scope-2 + /executive both cite).

import { buildings } from '../data/buildings.js';
import { buildingMonthlyHistory } from '../data/monthlyConsumption.js';

const ISO_NE_KG_PER_KWH = 0.235;

/**
 * @typedef {Object} BuildingEmissions
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {number} sqft
 * @property {number} occupants
 * @property {number} annualKwh        Sum of measured monthly readings (annualized from coverage).
 * @property {number} monthsCovered    How many distinct months had data for this building.
 * @property {number} mtCO2e           kWh × ISO-NE factor, in metric tons.
 * @property {number} sharePercent     Percent of campus-total electricity emissions.
 * @property {number} kgPerSqft        Intensity (kg CO₂e / sqft / yr) for ranking.
 */

/**
 * @param {object} [opts]
 * @param {Array}  [opts.buildings]                 Inject for tests.
 * @param {object} [opts.monthlyHistory]            { [buildingId]: { [YYYY-MM]: kwh } }, inject for tests.
 * @param {number} [opts.kgPerKwh]                  Override the grid factor.
 * @returns {{ rows: BuildingEmissions[], totalKwh: number, totalMt: number, monthsObserved: number }}
 */
export function computeBuildingEmissions(opts = {}) {
  const buildingList = opts.buildings || buildings;
  const history = opts.monthlyHistory || buildingMonthlyHistory();
  const factor = opts.kgPerKwh ?? ISO_NE_KG_PER_KWH;

  // Annualize: each building has N months of measured data. Scale up
  // to 12 months proportionally. If the months differ across buildings
  // (e.g. a meter came online mid-year), each building scales by ITS
  // own coverage so totals are honest.
  const rows = buildingList.map((b) => {
    const bucket = history[b.id] || {};
    const months = Object.keys(bucket).filter((k) => typeof bucket[k] === 'number');
    const measuredKwh = months.reduce((s, m) => s + bucket[m], 0);
    const monthsCovered = months.length;
    const annualKwh = monthsCovered > 0 ? (measuredKwh / monthsCovered) * 12 : 0;
    const mtCO2e = (annualKwh * factor) / 1000;
    return {
      id: b.id,
      name: b.name,
      category: b.category,
      sqft: b.sqft,
      occupants: b.occupants,
      annualKwh: Math.round(annualKwh),
      monthsCovered,
      mtCO2e: round2(mtCO2e),
      sharePercent: 0,             // filled in after totals
      kgPerSqft: b.sqft > 0 ? round2((annualKwh * factor) / b.sqft) : 0,
    };
  });

  const totalKwh = rows.reduce((s, r) => s + r.annualKwh, 0);
  const totalMt  = round2(rows.reduce((s, r) => s + r.mtCO2e, 0));
  for (const r of rows) {
    r.sharePercent = totalKwh > 0 ? round1((r.annualKwh / totalKwh) * 100) : 0;
  }

  // Distinct months across all buildings — how wide the measured
  // window is in the underlying capture.
  const allMonths = new Set();
  for (const bucket of Object.values(history)) {
    for (const m of Object.keys(bucket || {})) allMonths.add(m);
  }

  return { rows, totalKwh: Math.round(totalKwh), totalMt, monthsObserved: allMonths.size };
}

function round2(n) { return Math.round(n * 100) / 100; }
function round1(n) { return Math.round(n * 10) / 10; }
