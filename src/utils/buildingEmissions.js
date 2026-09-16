// Per-building annual kWh + mtCO₂e roll-up, used by the campus map.
// Pure function — takes the buildings list + the monthly-consumption
// history and returns one row per building with annual kWh, mtCO₂e,
// per-sqft intensity, and a calibrated "share of campus" percent.
//
// kWh → mtCO₂e via the ISO-NE 2024 effective factor (~0.235 kg/kWh,
// the same number /scope-2 + /executive both cite).
//
// ANNUALIZATION IS SEASONAL (Phase 390). A building's measured months are
// divided by the share of the YEAR those months represent, not multiplied by
// 12/monthsCovered. The old rule treated January and July as interchangeable,
// which they are not: January is 1.25× an average month and July is 0.59×.
// With every building carrying the same seed months that only inflated the
// absolute figures, but the admin portal lets months arrive unevenly — and
// then the flat rule ranks dorms by WHICH MONTH someone happened to enter.
// Same 1,000 kWh: January annualized to 12,000 and so did July, when the
// honest answers are 9,240 and 19,576.
//
// On corroboration, stated carefully, because the obvious version of this claim
// is circular: the campus ledger and this roll-up are NOT independent
// derivations. They read two columns of the same BMS capture — the ledger takes
// each month's master-meter `displayedTotal`, this takes the per-building
// submeter rows — and monthlyConsumption.js documents those columns drifting
// 5–10% apart from CT calibration, branch overlaps and untracked load. The
// submeter sum sits ~7% above the ledger because the two meters disagree, not
// because of anything seasonal. The like-for-like check is to put the MASTER
// column through this same rule: it lands within 1.7% of the ledger's Year 1.
//
// And note what today's data CANNOT tell us: every building carries the same
// four seed months, so switching from the flat rule to this one multiplies
// every figure by the same constant (12 × 0.3861 / 4 = 1.1584). "It moved
// closer to the campus figure" is therefore one datum, and would look identical
// for a fabricated seasonal shape. The argument for this rule is the fairness
// one above, not a goodness-of-fit one.
//
// KNOWN LIMITATION — monthlyPattern is the CAMPUS shape, dominated by heating,
// and applying it per building assumes every building swings like the campus
// does. They don't. A boarding-school dorm is empty June–August, so its real
// winter peak is sharper than campus and a winter-only reading still overstates
// its year. An athletic building running summer camps is flatter, or peaks in
// summer, so a winter reading understates it. This rule removes month-of-entry
// sensitivity for buildings shaped like the campus average and reduces it for
// the rest; it does not eliminate it. Per-building seasonal shapes need a full
// year of per-building data — which is what the admin pipeline is for.

import { buildings } from '../data/buildings.js';
import { buildingMonthlyHistory } from '../data/monthlyConsumption.js';
import { seasonalYearFraction } from '../data/seasonalPatterns.js';
import { KG_PER_KWH } from '../data/gridMix.js';

// One kWh, one number — see gridMix.js. Was 0.235, a fifth of a percent away
// from what /scope-2 computes; small, but it made the campus map disagree with
// the Scope 2 page about the carbon of the same kilowatt-hour.
const ISO_NE_KG_PER_KWH = KG_PER_KWH;

// Shared with seasonalYearFraction() — see the note where it's used.
const MONTH_KEY = /^\d{4}-\d{2}$/;

/**
 * @typedef {Object} BuildingEmissions
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {number} sqft
 * @property {number} occupants
 * @property {number} annualKwh        Measured kWh ÷ the seasonal share of the year those months cover.
 * @property {number=} monthKwh        Only set when a month filter is in effect — the raw kWh for that month.
 * @property {number} monthsCovered    Months of measured data behind this building's number.
 * @property {number} yearFraction     Seasonally-weighted share of the year those months represent (1 = a full year).
 * @property {number} mtCO2e           annualKwh × ISO-NE factor, in metric tons.
 * @property {number} sharePercent     Percent of campus-total electricity emissions.
 * @property {number} kgPerSqft        Intensity (kg CO₂e / sqft / yr) for ranking.
 */

/**
 * @param {object} [opts]
 * @param {Array}  [opts.buildings]                 Inject for tests.
 * @param {object} [opts.monthlyHistory]            { [buildingId]: { [YYYY-MM]: kwh } }, inject for tests.
 * @param {number} [opts.kgPerKwh]                  Override the grid factor.
 * @param {string} [opts.month]                     Optional 'YYYY-MM' filter — return that month's reading instead of the annualized average.
 * @returns {{ rows: BuildingEmissions[], totalKwh: number, totalMt: number, monthsObserved: number, mode: 'annualized'|'monthly', selectedMonth: string|null }}
 */
export function computeBuildingEmissions(opts = {}) {
  const buildingList = opts.buildings || buildings;
  const history = opts.monthlyHistory || buildingMonthlyHistory();
  const factor = opts.kgPerKwh ?? ISO_NE_KG_PER_KWH;
  const month = typeof opts.month === 'string' && /^\d{4}-\d{2}$/.test(opts.month) ? opts.month : null;

  // Both modes divide by the seasonal share of the year the measured months
  // cover, so a single-month view and a multi-month view are comparable to
  // each other and to the campus figure. A fraction of 0 means there is no
  // basis to annualize from, and the building reports 0 rather than a
  // fabricated year.
  const rows = buildingList.map((b) => {
    const bucket = history[b.id] || {};
    let monthKwh = 0;
    let monthsCovered = 0;
    let yearFraction = 0;
    let annualKwh = 0;
    if (month) {
      monthKwh = typeof bucket[month] === 'number' ? bucket[month] : 0;
      monthsCovered = monthKwh > 0 ? 1 : 0;
      yearFraction = monthKwh > 0 ? seasonalYearFraction([month]) : 0;
      annualKwh = yearFraction > 0 ? monthKwh / yearFraction : 0;
    } else {
      // One predicate for both halves of the fraction. Counting a month here
      // that seasonalYearFraction() then rejects (an unpadded '2026-1', say)
      // would report "measured over 2 months" beside an annual figure of zero
      // and lose the kWh in between. Only a positive reading counts, matching
      // the monthly path below: a 0 or negative row claims coverage it doesn't
      // provide, and a negative would flow on into mtCO2e and the board CSV.
      const months = Object.keys(bucket).filter(
        (k) => MONTH_KEY.test(k) && Number.isFinite(bucket[k]) && bucket[k] > 0,
      );
      const measuredKwh = months.reduce((s, m) => s + bucket[m], 0);
      monthsCovered = months.length;
      yearFraction = seasonalYearFraction(months);
      annualKwh = yearFraction > 0 ? measuredKwh / yearFraction : 0;
    }
    const mtCO2e = (annualKwh * factor) / 1000;
    return {
      id: b.id,
      name: b.name,
      category: b.category,
      sqft: b.sqft,
      occupants: b.occupants,
      annualKwh: Math.round(annualKwh),
      ...(month ? { monthKwh: Math.round(monthKwh) } : {}),
      monthsCovered,
      yearFraction: round6(yearFraction),
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

  return {
    rows,
    totalKwh: Math.round(totalKwh),
    totalMt,
    monthsObserved: allMonths.size,
    mode: month ? 'monthly' : 'annualized',
    selectedMonth: month,
    availableMonths: [...allMonths].sort(),
  };
}

function round2(n) { return Math.round(n * 100) / 100; }
function round1(n) { return Math.round(n * 10) / 10; }
// yearFraction is a divisor someone may reconstruct annualKwh with, so it keeps
// more precision than a display value would: rounded to 3 places, 0.386 would
// reproduce the annual figure ~0.2% off. Render it rounded; store it sharp.
function round6(n) { return Math.round(n * 1e6) / 1e6; }
