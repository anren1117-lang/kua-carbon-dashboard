// Single source of truth for the headline scope totals.
//
// Every page that displays "KUA's gross emissions are X mt" or
// "Scope 1 = Y, Scope 3 = Z" imports from this file. When measured
// data lands (fuel-delivery invoices for Scope 1, Sodexo + travel-office
// + waste-hauler records for Scope 3), the composers below swap from
// returning the placeholder to computing from the real records, and
// every dashboard page picks up the new total automatically.
//
// Scope 2 lives in gridMix.js (already composed from BMS measured kWh
// + cited per-fuel emission factors). This file only owns Scope 1 and
// Scope 3 and the helpers that combine all three.

import { GRID_MIX_ANNUAL_MTCO2E } from './gridMix.js';

// ─── Scope 1 ──────────────────────────────────────────────────────
// Heating fuel (heating oil + propane) + refrigerant leakage + fleet.
// Today's value is the bottom-up published-method cross-check central
// from src/data/geographicEstimates.js (rounded). Replace by importing
// actual fuel delivery records (fuel_bills Supabase table) and
// refrigerant service logs — flips estimated → measured at that point.
const SCOPE1_PLACEHOLDER_MT = 1350;
const SCOPE1_PLACEHOLDER_BREAKDOWN = [
  { source: 'Heating oil + propane', mt: 1290, provenance: 'estimated', method: '290K sqft × NH-CZ6 intensity (Dorm 75 / Academic 55 / Athletic 45 / Other 55 kBtu/sqft/yr) × 90% oil + 10% propane × EPA Stationary Combustion factors. Real KUA delivery invoices not yet integrated.' },
  { source: 'Fleet vehicles',         mt:   54, provenance: 'estimated', method: 'KUA fleet registry: 2 diesel buses (6.5 mpg, ~26K mi/yr) + 2 gasoline vans + 1 truck × actual annualMiles ÷ mpg × EPA Mobile Combustion. Real fuel-card records not yet integrated.' },
  { source: 'Refrigerant leakage',    mt:    7, provenance: 'estimated', method: '~80 lb HVAC charge × 5–15%/yr leak rate × IPCC AR6 GWP100. Real service-report mass balance not yet integrated.' },
];

/** Compute Scope 1 from the underlying components. Today this is the
 *  bottom-up cross-check central; once data wiring ships it composes
 *  from real records. */
export function composeScope1() {
  return {
    totalMt: SCOPE1_PLACEHOLDER_MT,
    breakdown: SCOPE1_PLACEHOLDER_BREAKDOWN,
    provenance: 'estimated',
    note: 'Bottom-up cross-check central. Replaces with measured records via composeScope1FromBills() once fuel_bills + refrigerant logs + fuel-card records are integrated.',
  };
}

// EPA GHG Emission Factors Hub 2024 (kg CO2e per gallon).
// Used by composeScope1FromBills() to convert fuel-delivery invoices
// into a Scope 1 heating component. Keep keys spelled exactly as the
// admin form's `fuel_type` dropdown so the lookup is direct.
export const FUEL_FACTORS_KG_PER_GAL = {
  'Heating Oil': 10.16,
  'Propane':      5.72,
  'Diesel':      10.18,
  'Gasoline':     8.89,
};

// EPA Mobile Combustion factors (kg CO2e per gallon, including
// combustion + N2O + CH4 from incomplete combustion). Used by
// composeFleetMt(). Same numeric values as FUEL_FACTORS_KG_PER_GAL
// for diesel/gasoline/propane — kept as a separate map so future
// refinements (e.g. light-duty vs heavy-duty diesel) can diverge.
export const FLEET_FACTORS_KG_PER_GAL = {
  'Gasoline':  8.89,
  'Diesel':   10.21,
  'Propane':   5.72,
  'CNG':       5.85, // EPA Hub: ~5.85 kg CO2e per gallon-equivalent
};

// IPCC AR6 Working Group I Chapter 7 GWP100 values for the
// refrigerants listed in scope1_refrigerant_logs. Used by
// composeRefrigerantMt() to convert net leakage in pounds to mtCO2e.
// Order of magnitude varies by chemical; R-22 is ~5x worse per kg
// than R-410A which is ~5x worse than R-1234yf.
export const REFRIGERANT_GWP100 = {
  'R-410A':   2256,
  'R-134a':   1530,
  'R-22':     1960,
  'R-404A':   4728,
  'R-407C':   1908,
  'R-32':      771,
  'R-1234yf':    4,
  'other':    2000, // generic mid-band fallback for unknown blends
};

const KG_PER_LB = 0.45359237;

// Default EEIO factor (kg CO2e per USD) when a purchased_goods row
// doesn't carry an explicit `eeio_factor_override`. Anchored on EPA
// EEIO v2.0 KUA-typical weighted average across paper / IT / cleaning
// / apparel sectors — same value SCOPE3_GOODS_RANGE.central is built
// around.
export const PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD = 0.40;

/**
 * Sum a purchased_goods table to mtCO2e: spend × EEIO factor.
 * Each row has spend_usd + an optional eeio_factor_override; rows
 * without an override use PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD.
 * Skips rows with non-numeric / negative spend.
 */
export function composePurchasedGoodsMt(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return 0;
  let kg = 0;
  for (const row of rows) {
    const spend = Number(row.spend_usd);
    if (!Number.isFinite(spend) || spend < 0) continue;
    const factor = Number.isFinite(Number(row.eeio_factor_override))
      ? Number(row.eeio_factor_override)
      : PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD;
    kg += spend * factor;
  }
  return kg / 1000;
}

// EPA / DEFRA-anchored per-passenger-km factors for staff commute
// modes (kg CO2e / passenger-km). Solo car at EPA passenger-vehicle
// average; carpool effective per-passenger; transit / bike / walk /
// EV from DEFRA + ICCT.
export const COMMUTE_FACTORS_KG_PER_KM = {
  car_solo: 0.218,    // EPA passenger vehicle avg ~0.218 kg/km (~0.351 kg/mi)
  carpool:  0.087,    // 0.218 / 2.5 effective passenger share
  transit:  0.103,    // DEFRA bus + light rail blend
  bike:     0,
  walk:     0,
  ev:       0.060,    // ISO-NE 2024 grid × typical EV efficiency (3.5 mi/kWh)
};
const KM_PER_MI = 1.609344;

/**
 * Sum a commuting table to mtCO2e: each row's per-day round-trip miles
 * × days/week × weeks/year × 2 (round-trip) × mode factor.
 * Skips rows with unknown mode or invalid numeric fields.
 */
export function composeCommutingMt(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return 0;
  let kg = 0;
  for (const row of rows) {
    const factor = COMMUTE_FACTORS_KG_PER_KM[row.mode];
    const miles  = Number(row.one_way_miles);
    const days   = Number(row.days_per_week ?? 5);
    const weeks  = Number(row.weeks_per_year ?? 36);
    if (factor === undefined) continue;
    if (!Number.isFinite(miles) || miles < 0) continue;
    if (!Number.isFinite(days)  || days  < 0) continue;
    if (!Number.isFinite(weeks) || weeks < 0) continue;
    // miles × 2 (RT) × KM_PER_MI = round-trip km/day
    // × days/week × weeks/year × factor (kg/km) = kg/year
    kg += miles * 2 * KM_PER_MI * days * weeks * factor;
  }
  return kg / 1000;
}

/**
 * Sum a forest_stand_actuals table to mtCO2e: acres × per-acre rate.
 * Used by useMeasuredSinks(). Skips rows with missing/invalid acreage
 * or rate. Returns 0 for empty / null input so the caller can fall
 * back to the hardcoded inventory.
 *
 * @param {Array<{ acres: number|string, mtco2e_acre_yr: number|string }>} rows
 * @returns {{ totalMt: number, standCount: number, perStand: Array<{ stand_id?: string, name?: string, acres: number, mt: number }> }}
 */
export function composeSinksFromActuals(rows) {
  const valid = (Array.isArray(rows) ? rows : []).filter((r) => {
    const acres = Number(r?.acres);
    const rate = Number(r?.mtco2e_acre_yr);
    return Number.isFinite(acres) && acres >= 0 && Number.isFinite(rate) && rate >= 0;
  });
  if (valid.length === 0) return { totalMt: 0, standCount: 0, perStand: [] };
  let totalMt = 0;
  const perStand = [];
  for (const r of valid) {
    const acres = Number(r.acres);
    const rate = Number(r.mtco2e_acre_yr);
    const mt = acres * rate;
    totalMt += mt;
    perStand.push({
      stand_id: r.stand_id || null,
      name: r.name || null,
      acres,
      mtco2eAcreYr: rate,
      mt: Math.round(mt),
    });
  }
  return { totalMt: Math.round(totalMt), standCount: valid.length, perStand };
}

// Map legacy lowercase fuel_type values used by the existing
// scope1_fleet admin form ('gasoline'/'diesel'/'other') onto the
// canonical capitalized keys in FLEET_FACTORS_KG_PER_GAL. Anything
// the admin form might emit that isn't in the canonical set falls
// through to undefined and the row is skipped (with-counted).
function normalizeFleetFuelType(raw) {
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  if (FLEET_FACTORS_KG_PER_GAL[trimmed]) return trimmed;
  // Title-case the lowercase legacy form: 'gasoline' → 'Gasoline'.
  const titled = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  if (FLEET_FACTORS_KG_PER_GAL[titled]) return titled;
  return undefined;
}

/**
 * Sum a fleet table to mtCO2e using EPA Mobile Combustion factors.
 * Accepts rows from EITHER schema: the legacy `scope1_fleet` table
 * (lowercase fuel_type, period-based) or the never-shipped
 * `scope1_fleet_records` schema (capitalized fuel_type, per-
 * transaction). Skips rows with unknown fuel_type or non-numeric/
 * negative gallons.
 */
export function composeFleetMt(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return 0;
  let kg = 0;
  for (const row of rows) {
    const fuelKey = normalizeFleetFuelType(row.fuel_type);
    const factor = fuelKey ? FLEET_FACTORS_KG_PER_GAL[fuelKey] : undefined;
    const gal = Number(row.gallons);
    if (!factor || !Number.isFinite(gal) || gal < 0) continue;
    kg += gal * factor;
  }
  return kg / 1000;
}

/**
 * Sum a refrigerant log to mtCO2e. Net leakage = recharged - reclaimed
 * (clamped at zero — a negative net would imply more was reclaimed
 * than ever leaked, which is conservation, not emission). Multiplied
 * by IPCC AR6 GWP100 for the listed chemical.
 *
 * Accepts rows from EITHER schema: the legacy `scope1_refrigerants`
 * table (`recharge_lb` / `reclaim_lb` columns) or the never-shipped
 * `scope1_refrigerant_logs` schema (`lbs_recharged` / `lbs_reclaimed`).
 */
export function composeRefrigerantMt(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return 0;
  let kgCO2e = 0;
  for (const row of rows) {
    // Legacy column names take precedence so existing admin entries
    // count; new column names act as the fallback.
    const recharged = Number(row.recharge_lb ?? row.lbs_recharged) || 0;
    const reclaimed = Number(row.reclaim_lb  ?? row.lbs_reclaimed) || 0;
    const netLbs = Math.max(0, recharged - reclaimed);
    if (netLbs <= 0) continue;
    const gwp = REFRIGERANT_GWP100[row.refrigerant_type] ?? REFRIGERANT_GWP100.other;
    kgCO2e += netLbs * KG_PER_LB * gwp;
  }
  return kgCO2e / 1000;
}

/**
 * Compose a Scope 1 result from real Supabase records. Heating, fleet,
 * and refrigerants each flip estimated → measured independently as
 * their respective tables fill in.
 *
 * Pure function: no I/O, no global state. The Supabase fetch is the
 * caller's responsibility (see src/hooks/useMeasuredScope1.js).
 *
 * @param {Array<{ fuel_type: string, gallons: number|string }>} bills
 * @param {{
 *   fleetRecords?: Array<{ fuel_type: string, gallons: number|string }>,
 *   refrigerantLogs?: Array<{ refrigerant_type: string, lbs_recharged?: number|string, lbs_reclaimed?: number|string }>,
 *   fleetMt?: number,
 *   refrigerantsMt?: number,
 * }} [opts]
 * @returns {{ totalMt: number, breakdown: object[], provenance: string, note: string }}
 */
export function composeScope1FromBills(bills, opts = {}) {
  const billsArr = Array.isArray(bills) ? bills : [];
  const fleetRows = Array.isArray(opts.fleetRecords) ? opts.fleetRecords : [];
  const refrigRows = Array.isArray(opts.refrigerantLogs) ? opts.refrigerantLogs : [];

  // Heating: same logic as before. Skip rows with unknown fuel_type
  // or invalid gallons rather than silently bucketing.
  let heatingKg = 0;
  let unknownTypeRows = 0;
  for (const row of billsArr) {
    const factor = FUEL_FACTORS_KG_PER_GAL[row.fuel_type];
    const gal = Number(row.gallons);
    if (!factor || !Number.isFinite(gal) || gal < 0) { unknownTypeRows++; continue; }
    heatingKg += gal * factor;
  }
  const heatingMeasured = billsArr.length > 0;
  const heatingMt = heatingMeasured
    ? heatingKg / 1000
    : (SCOPE1_PLACEHOLDER_BREAKDOWN.find((r) => r.source.toLowerCase().includes('heating'))?.mt || 0);

  // Fleet: prefer live records when provided, then explicit override,
  // then placeholder. Same precedence for refrigerants below.
  const fleetMeasured = fleetRows.length > 0;
  const fleetMt = fleetMeasured
    ? composeFleetMt(fleetRows)
    : (typeof opts.fleetMt === 'number' ? opts.fleetMt
      : (SCOPE1_PLACEHOLDER_BREAKDOWN.find((r) => r.source.toLowerCase().includes('fleet'))?.mt || 0));

  const refrigMeasured = refrigRows.length > 0;
  const refrigMt = refrigMeasured
    ? composeRefrigerantMt(refrigRows)
    : (typeof opts.refrigerantsMt === 'number' ? opts.refrigerantsMt
      : (SCOPE1_PLACEHOLDER_BREAKDOWN.find((r) => r.source.toLowerCase().includes('refrigerant'))?.mt || 0));

  const anyMeasured = heatingMeasured || fleetMeasured || refrigMeasured;
  if (!anyMeasured) {
    // Nothing measured yet — return placeholder unchanged so the
    // dashboard is honest about what's not yet sourced.
    return composeScope1();
  }

  const totalMt = heatingMt + fleetMt + refrigMt;
  const breakdown = [
    {
      source: 'Heating oil + propane',
      mt: Math.round(heatingMt),
      provenance: heatingMeasured ? 'measured' : 'estimated',
      method: heatingMeasured
        ? `${billsArr.length} fuel_bills row${billsArr.length === 1 ? '' : 's'} × EPA Stationary Combustion factors${unknownTypeRows > 0 ? ` (${unknownTypeRows} row${unknownTypeRows === 1 ? '' : 's'} skipped — unknown fuel_type or invalid gallons)` : ''}.`
        : 'Bottom-up placeholder — no fuel_bills rows yet.',
    },
    {
      source: 'Fleet vehicles',
      mt: Math.round(fleetMt),
      provenance: fleetMeasured ? 'measured' : 'estimated',
      method: fleetMeasured
        ? `${fleetRows.length} scope1_fleet_records row${fleetRows.length === 1 ? '' : 's'} × EPA Mobile Combustion factors (gasoline 8.89 / diesel 10.21 / propane 5.72 / CNG 5.85 kg CO₂e per gal).`
        : 'Bottom-up registry placeholder (fuel-card records not yet integrated).',
    },
    {
      source: 'Refrigerant leakage',
      mt: Math.round(refrigMt),
      provenance: refrigMeasured ? 'measured' : 'estimated',
      method: refrigMeasured
        ? `${refrigRows.length} scope1_refrigerant_logs row${refrigRows.length === 1 ? '' : 's'} × IPCC AR6 GWP100 (R-410A 2,256 / R-134a 1,530 / R-22 1,960 / etc.). Net leakage = recharged − reclaimed × kg/lb × GWP100.`
        : 'Bottom-up placeholder (refrigerant service-report mass balance not yet integrated).',
    },
  ];

  // Build a human-readable summary of what's measured.
  const measuredParts = [];
  if (heatingMeasured) measuredParts.push(`heating from ${billsArr.length} fuel_bills`);
  if (fleetMeasured)   measuredParts.push(`fleet from ${fleetRows.length} fuel-card records`);
  if (refrigMeasured)  measuredParts.push(`refrigerants from ${refrigRows.length} service logs`);
  const remainingPlaceholderParts = [];
  if (!heatingMeasured) remainingPlaceholderParts.push('heating');
  if (!fleetMeasured)   remainingPlaceholderParts.push('fleet');
  if (!refrigMeasured)  remainingPlaceholderParts.push('refrigerants');

  return {
    totalMt: Math.round(totalMt),
    breakdown,
    provenance: 'measured',
    note: `Composed live: ${measuredParts.join(' + ')}.${remainingPlaceholderParts.length > 0 ? ` Still bottom-up: ${remainingPlaceholderParts.join(' + ')}.` : ''}`,
  };
}

export const SCOPE1_TOTAL_MT = composeScope1().totalMt;

// ─── Scope 3 ──────────────────────────────────────────────────────
// Student travel + dining (Cat 1 purchased goods) + waste + procurement +
// commuting + upstream fuel.
const SCOPE3_PLACEHOLDER_MT = 2635;
const SCOPE3_PLACEHOLDER_BREAKDOWN = [
  { source: 'Purchased goods (non-dining)',              mt: 1315, provenance: 'estimated', method: 'EPA EEIO v2.0 spend-based: ~$3M non-energy procurement × ~0.40 kg CO2e/$ KUA-typical weighted average across paper / IT / cleaning / apparel sectors. KUA Business Office annual spend not yet mapped to USEEIO sectors.' },
  { source: 'Student travel (international + boarder)', mt:  760, provenance: 'estimated', method: 'Yale-style cohort method × KUA fingerprint: 100 day commuters local Upper Valley + 190 US boarders Northeast-skewed × 3-4 RTs/yr + 50 international East-Asia heavy × 1-2 RTs/yr. ICAO + DEFRA factors with radiative forcing. Travel office records not yet integrated.' },
  { source: 'Dining (food production)',                  mt:  235, provenance: 'estimated', method: 'Poore & Nemecek 2018: ~217K student meals (boarders 3×7×36 + day 10×36) + 50K faculty/staff × meal-class kg CO2e. Sodexo/SAGE invoices not yet integrated.' },
  { source: 'Upstream fuel',                             mt:  230, provenance: 'estimated', method: '~17% upstream uplift on bottom-up Scope 1 (refinery + transport for heating oil + propane + fleet fuels).' },
  { source: 'Commuting',                                 mt:   90, provenance: 'estimated', method: '52 staff × Upper Valley ACS commute distribution × ICCT effective fleet fuel-economy. HR commute survey not yet integrated.' },
  { source: 'Waste',                                     mt:    5, provenance: 'estimated', method: '420 people × per-day generation × diversion-split scenarios × EPA WARM v15.1 net factors. Hauler invoices (tons by stream) not yet integrated.' },
];

export function composeScope3() {
  return {
    totalMt: SCOPE3_PLACEHOLDER_MT,
    breakdown: SCOPE3_PLACEHOLDER_BREAKDOWN,
    provenance: 'estimated',
    note: 'Hand-set placeholder. Composes from travel office records + Sodexo invoices + waste hauler invoices + Business Office spend + HR commute survey once those are integrated.',
  };
}

// Cited per-cohort and per-stream factors used by composeScope3FromRecords().
// Each is the central from a published-method cross-check inside
// geographicEstimates.js — pulled out here so the helper stays
// self-contained and unit-testable without the full estimates module.

// Per-student annual mtCO2e by cohort. Anchored on:
//   - Day: EPA Smart Location Database benchmark for small rural-residential K-12 (~1.4 mt/student/yr).
//   - US boarder: Andover/Exeter peer sustainability-report central (~2.8 mt/student/yr).
//   - International: Yale Office of Sustainability published figure (~5.0 mt/student/yr).
export const SCOPE3_COHORT_FACTORS_MT_PER_STUDENT = {
  day:           1.4,
  usBoarder:     2.8,
  international: 5.0,
};

// EPA WARM v15.1 net factors (mtCO2e per short ton waste). Negative
// values mean the disposal pathway is a net carbon avoidance vs the
// assumed counterfactual (e.g. recycling steel/paper offsets virgin
// production). Keys mirror waste_type strings the admin form writes.
export const WASTE_FACTORS_MT_PER_TON = {
  'Landfill':   0.52,
  'Recycling': -0.10,
  'Composting': 0.04,
  'Hazardous':  0.50,
  'E-Waste':    0.30,
};

// Convert a row's amount + unit field to short tons (the unit
// WASTE_FACTORS_MT_PER_TON expects). Returns 0 for unrecognized units.
function wasteTons(row) {
  const amt = Number(row.amount);
  if (!Number.isFinite(amt) || amt < 0) return 0;
  const unit = String(row.unit || 'tons').toLowerCase();
  if (unit === 'tons' || unit === 'ton')   return amt;
  if (unit === 'pounds' || unit === 'lbs') return amt / 2000;
  if (unit === 'kg')                       return amt / 907.185;
  return 0;
}

// Per-trip mtCO2e estimate by destination region. Used for study_abroad
// and faculty_travel rows where each row is a single trip (not an annual
// per-student multiplier). DEFRA long-haul 0.241 kg/passenger-mi with
// radiative forcing × typical great-circle BOS↔region distances.
const TRIP_MT_BY_REGION = {
  domestic: 0.5,   // BOS↔continental US, mostly drive or short-haul fly
  europe:   2.4,   // BOS↔EU long-haul
  asia:     3.0,   // BOS↔East Asia long-haul (matches intl student RT)
  other:    2.5,   // catch-all for South America, Africa, Oceania
};

// Map a destination_country string (free-text from the admin form) to
// a region key. Permissive: returns 'domestic' for US, 'asia' for any
// East/South-East/South Asian country, etc. Unknown → 'other'.
function regionFor(country) {
  if (!country) return 'other';
  const c = String(country).trim().toLowerCase();
  if (!c) return 'other';
  if (['usa', 'us', 'united states', 'united states of america'].includes(c)) return 'domestic';
  // The admin form is free-text so spell variations (China / 中国 / etc.)
  // can't all be caught here. Adding rows here is the cheapest
  // calibration when KUA's actual cohort skews differently.
  if (['china', 'japan', 'south korea', 'korea', 'taiwan', 'hong kong', 'thailand',
       'vietnam', 'india', 'singapore', 'malaysia', 'philippines', 'indonesia'].includes(c)) return 'asia';
  if (['uk', 'united kingdom', 'england', 'france', 'germany', 'spain', 'italy', 'portugal',
       'netherlands', 'belgium', 'ireland', 'switzerland', 'austria', 'sweden', 'norway',
       'denmark', 'finland', 'poland', 'greece', 'turkey'].includes(c)) return 'europe';
  return 'other';
}

/**
 * Compose Scope 3 from real Supabase records. For each component we
 * have data for, the row count (or row-level fields) replaces the
 * hardcoded COHORTS placeholder. Components without records (dining,
 * goods, upstream fuel, faculty commute) keep their bottom-up
 * placeholder rows from SCOPE3_PLACEHOLDER_BREAKDOWN until those
 * tables ship too.
 *
 * @param {{
 *   dayStudents?: Array<{ zip_code?: string, school_year?: string }>,
 *   usBoardingStudents?: Array<{ zip_code?: string, state?: string }>,
 *   internationalStudents?: Array<{ country?: string }>,
 *   studyAbroad?: Array<{ destination_country?: string }>,
 *   facultyTravel?: Array<{ destination_country?: string }>,
 *   wasteRecords?: Array<{ waste_type: string, amount: number|string, unit?: string }>,
 *   purchasedGoods?: Array<{ spend_usd: number|string, eeio_factor_override?: number|string }>,
 *   commuting?: Array<{ mode: string, one_way_miles: number|string, days_per_week?: number, weeks_per_year?: number }>,
 * }} records
 */
export function composeScope3FromRecords(records = {}) {
  const day      = Array.isArray(records.dayStudents)           ? records.dayStudents           : [];
  const usBoard  = Array.isArray(records.usBoardingStudents)    ? records.usBoardingStudents    : [];
  const intl     = Array.isArray(records.internationalStudents) ? records.internationalStudents : [];
  const sa       = Array.isArray(records.studyAbroad)           ? records.studyAbroad           : [];
  const fac      = Array.isArray(records.facultyTravel)         ? records.facultyTravel         : [];
  const waste    = Array.isArray(records.wasteRecords)          ? records.wasteRecords          : [];
  const goods    = Array.isArray(records.purchasedGoods)        ? records.purchasedGoods        : [];
  const commute  = Array.isArray(records.commuting)             ? records.commuting             : [];

  // If literally nothing is in any table, fall back to the placeholder
  // wholesale — the dashboard is honest about having no measured data.
  const haveAnyRecords = day.length + usBoard.length + intl.length + sa.length + fac.length + waste.length + goods.length + commute.length > 0;
  if (!haveAnyRecords) return composeScope3();

  // ─── Student travel: cohort row counts × cited per-student factor ──
  const dayMt    = day.length     * SCOPE3_COHORT_FACTORS_MT_PER_STUDENT.day;
  const usMt     = usBoard.length * SCOPE3_COHORT_FACTORS_MT_PER_STUDENT.usBoarder;
  const intlMt   = intl.length    * SCOPE3_COHORT_FACTORS_MT_PER_STUDENT.international;
  const cohortTravelMt = dayMt + usMt + intlMt;
  const cohortRowCount = day.length + usBoard.length + intl.length;

  // ─── Trip-level travel (study abroad + faculty) ──────────────────
  let tripMt = 0;
  for (const row of [...sa, ...fac]) {
    tripMt += TRIP_MT_BY_REGION[regionFor(row.destination_country)] ?? TRIP_MT_BY_REGION.other;
  }

  // Combine cohort + trip travel into the single breakdown row
  // (matches placeholder shape so downstream consumers don't branch).
  const studentTravelMt = cohortTravelMt + tripMt;
  const studentTravelMeasured = cohortRowCount > 0 || sa.length + fac.length > 0;

  // ─── Waste (EPA WARM net factors) ────────────────────────────────
  let wasteMt = 0;
  let wasteSkipped = 0;
  for (const row of waste) {
    const tons = wasteTons(row);
    const factor = WASTE_FACTORS_MT_PER_TON[row.waste_type];
    if (!tons || factor === undefined) { wasteSkipped++; continue; }
    wasteMt += tons * factor;
  }
  const wasteMeasured = waste.length > 0;

  // ─── Purchased goods (Cat 1): live from purchased_goods table ──
  const goodsLiveMt  = composePurchasedGoodsMt(goods);
  const goodsMeasured = goods.length > 0;

  // ─── Commuting (Cat 7): live from commuting table ──
  const commuteLiveMt = composeCommutingMt(commute);
  const commuteMeasured = commute.length > 0;

  // ─── Components without records: keep placeholder rows ──────────
  const placeholderRow = (sourceMatch) =>
    SCOPE3_PLACEHOLDER_BREAKDOWN.find((r) => r.source.toLowerCase().includes(sourceMatch.toLowerCase()));
  const goodsMt    = goodsMeasured   ? goodsLiveMt   : (placeholderRow('purchased goods')?.mt ?? 0);
  const diningMt   = placeholderRow('dining')?.mt            ?? 0;
  const upstreamMt = placeholderRow('upstream fuel')?.mt     ?? 0;
  const commuteMt  = commuteMeasured ? commuteLiveMt : (placeholderRow('commuting')?.mt ?? 0);

  const breakdown = [
    {
      source: 'Purchased goods (non-dining)',
      mt: Math.round(goodsMt),
      provenance: goodsMeasured ? 'measured' : 'estimated',
      method: goodsMeasured
        ? `${goods.length} purchased_goods row${goods.length === 1 ? '' : 's'} × spend × EEIO factor (per-row override or default ${PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD} kg/USD).`
        : (placeholderRow('purchased goods')?.method || ''),
    },
    {
      source: 'Student travel (international + boarder)',
      mt: Math.round(studentTravelMt),
      provenance: studentTravelMeasured ? 'measured' : 'estimated',
      method: studentTravelMeasured
        ? `${day.length} day_students × ${SCOPE3_COHORT_FACTORS_MT_PER_STUDENT.day} mt/yr (EPA SLD) + ${usBoard.length} us_boarding × ${SCOPE3_COHORT_FACTORS_MT_PER_STUDENT.usBoarder} mt/yr (Andover/Exeter peer) + ${intl.length} international × ${SCOPE3_COHORT_FACTORS_MT_PER_STUDENT.international} mt/yr (Yale OoS)${(sa.length + fac.length) > 0 ? ` + ${sa.length} study-abroad + ${fac.length} faculty trips × DEFRA long-haul × RF` : ''}.`
        : (placeholderRow('student travel')?.method || ''),
    },
    {
      source: 'Dining (food production)',
      mt: Math.round(diningMt),
      provenance: 'estimated',
      method: placeholderRow('dining')?.method || '',
    },
    {
      source: 'Upstream fuel',
      mt: Math.round(upstreamMt),
      provenance: 'estimated',
      method: placeholderRow('upstream fuel')?.method || '',
    },
    {
      source: 'Commuting',
      mt: Math.round(commuteMt),
      provenance: commuteMeasured ? 'measured' : 'estimated',
      method: commuteMeasured
        ? `${commute.length} commuting row${commute.length === 1 ? '' : 's'} × per-mode factor × days/week × weeks/year × 2 RT (EPA passenger-vehicle + DEFRA mode factors).`
        : (placeholderRow('commuting')?.method || ''),
    },
    {
      source: 'Waste',
      mt: Math.round(wasteMt),
      provenance: wasteMeasured ? 'measured' : 'estimated',
      method: wasteMeasured
        ? `${waste.length} waste row${waste.length === 1 ? '' : 's'} × EPA WARM v15.1 net factors${wasteSkipped > 0 ? ` (${wasteSkipped} skipped — unknown waste_type or invalid amount)` : ''}.`
        : (placeholderRow('waste')?.method || ''),
    },
  ];

  const totalMt = Math.round(breakdown.reduce((s, r) => s + r.mt, 0));
  const measuredRowCount =
    (studentTravelMeasured ? 1 : 0) +
    (wasteMeasured ? 1 : 0) +
    (goodsMeasured ? 1 : 0) +
    (commuteMeasured ? 1 : 0);

  // Per-cohort detail so the Scope 3 page (and Executive) can show day
  // / US boarder / international as separate sub-rows when measured.
  // Each entry mirrors the breakdown row shape so callers can render
  // them with the same components. Trip-level rows (study abroad +
  // faculty travel) collapse into a single "trips" entry since each
  // row is already one trip.
  const cohortDetail = [
    {
      cohort: 'day',
      label: 'Day students',
      count: day.length,
      mt: Math.round(dayMt),
      perStudentMt: SCOPE3_COHORT_FACTORS_MT_PER_STUDENT.day,
      provenance: day.length > 0 ? 'measured' : 'estimated',
      method: 'EPA Smart Location Database benchmark for small rural-residential K-12 commute footprints, weighted for NH light-duty fleet at 24 mpg blended.',
    },
    {
      cohort: 'usBoarder',
      label: 'US boarders',
      count: usBoard.length,
      mt: Math.round(usMt),
      perStudentMt: SCOPE3_COHORT_FACTORS_MT_PER_STUDENT.usBoarder,
      provenance: usBoard.length > 0 ? 'measured' : 'estimated',
      method: 'Andover / Exeter sustainability-report central — comparable Northeast-skewed boarding cohort × 3-4 RTs/yr.',
    },
    {
      cohort: 'international',
      label: 'International boarders',
      count: intl.length,
      mt: Math.round(intlMt),
      perStudentMt: SCOPE3_COHORT_FACTORS_MT_PER_STUDENT.international,
      provenance: intl.length > 0 ? 'measured' : 'estimated',
      method: 'Yale Office of Sustainability published per-FTE figure for residential international cohort × DEFRA long-haul with radiative forcing.',
    },
    {
      cohort: 'trips',
      label: 'Study abroad + faculty trips',
      count: sa.length + fac.length,
      mt: Math.round(tripMt),
      perStudentMt: null,
      provenance: (sa.length + fac.length) > 0 ? 'measured' : 'estimated',
      method: 'Per-trip mtCO₂e by destination region (domestic 0.5 / Europe 2.4 / Asia 3.0 / other 2.5) — DEFRA long-haul × great-circle distances from BOS.',
    },
  ];

  return {
    totalMt,
    breakdown,
    // 'measured' if at least one component flipped; consumers that need
    // mixed provenance read breakdown[i].provenance directly.
    provenance: measuredRowCount > 0 ? 'measured' : 'estimated',
    cohortDetail,
    note: measuredRowCount > 0
      ? `${measuredRowCount} Scope 3 component${measuredRowCount === 1 ? '' : 's'} composed from Supabase records. Dining + upstream fuel still bottom-up.`
      : 'No Scope 3 records yet — bottom-up placeholder.',
  };
}

export const SCOPE3_TOTAL_MT = composeScope3().totalMt;

// ─── Combined / convenience exports ───────────────────────────────
export const SCOPE2_TOTAL_MT = GRID_MIX_ANNUAL_MTCO2E;

export const SCOPE_TOTALS = {
  scope1Mt: SCOPE1_TOTAL_MT,
  scope2Mt: SCOPE2_TOTAL_MT,
  scope3Mt: SCOPE3_TOTAL_MT,
};

export const GROSS_MT = SCOPE1_TOTAL_MT + SCOPE2_TOTAL_MT + SCOPE3_TOTAL_MT;

// Provenance summary for any page that surfaces the gross figure.
// Mid-confidence: Scope 2 is cited+measured, Scope 1+3 are still
// placeholders. Gross is dominated by the placeholders, so it's
// flagged estimated overall.
export const GROSS_PROVENANCE = 'estimated';
export const GROSS_PROVENANCE_NOTE = `Scope 2 is composed YTD × ISO-NE factors (cited, ~${SCOPE2_TOTAL_MT} mt). Scope 1 (~${SCOPE1_TOTAL_MT} mt) and Scope 3 (~${SCOPE3_TOTAL_MT} mt) are still placeholders pending fuel-delivery and travel/dining-invoice integration.`;
