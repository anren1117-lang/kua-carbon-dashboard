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

import { GRID_MIX_ANNUAL_MTCO2E, KG_PER_KWH } from './gridMix.js';
import { getFactorByKey } from './emissionFactors.js';
import { avertAvoidedKgPerKwh, AVERT_SOURCE } from './gridMixHistory.js';
import { COMMUTE_DAYS_PER_WEEK_DEFAULT, COMMUTE_WEEKS_DEFAULT, REPORTING_PERIOD } from './academicCalendar.js';

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
// EPA GHG Emission Factors Hub 2025, Table 1 (Stationary Combustion).
// Values are CO2 ONLY — the Hub publishes CH4 and N2O in separate columns and
// they are not included here, so these are kg CO2/gal, not kg CO2e/gal. The
// CH4/N2O contribution for these fuels is well under 1% of the CO2 term.
//
// Corrected in the Scope 1 audit. 'Heating Oil' read 10.16, which matches no
// EPA row: Distillate Fuel Oil No. 1 is 10.18 and No. 2 is 10.21. KUA burns
// No. 2 (geographicEstimates labels it so, and the BTU/gal constant used for
// the geothermal counterfactual is 138,500, which is No. 2). Nothing in the
// repo documented 10.16 as a deliberate blend, so it was a wrong number under
// a right label. Effect is ~0.5% on a 1,290 mt heating line whose own stated
// range is 891-1,867 — a citation fix, not a materiality one.
//
// 'Diesel' read 10.18, which is the No. 1 oil row, not diesel. Diesel is 10.21.
// Reachability, so nobody over-reads the corrections below: only 'Heating Oil'
// and 'Propane' are live. useMeasuredScope1.js tags every row as one of those
// two, and the geothermal counterfactual maps to the same pair. Vehicles go
// through FLEET_FACTORS_KG_PER_GAL instead. 'Diesel' and 'Gasoline' are kept
// because fuel_bills.fuel_type is free text and could emit them — a wrong
// number is still wrong even when nothing reads it — but fixing them moved no
// published figure.
export const FUEL_FACTORS_KG_PER_GAL = {
  'Heating Oil': 10.21, // Distillate Fuel Oil No. 2 — LIVE, drives the heating line
  'Propane':      5.72, // Propane (NOT the separate "LPG" row, which is 5.68) — LIVE
  'Diesel':      10.21, // Distillate Fuel Oil No. 2 / diesel — not currently reached
  'Gasoline':     8.78, // Motor Gasoline — not currently reached
};

// EPA GHG Emission Factors Hub 2025, Table 2 (Mobile Combustion).
//
// CO2 ONLY. The previous comment claimed these included "combustion + N2O +
// CH4"; they don't — the Hub carries mobile CH4/N2O in Table 4, keyed by
// vehicle type AND model year, which this codebase doesn't collect. Claiming
// CO2e while storing CO2 overstated what the number was.
//
// Gasoline read 8.89, matching no EPA row; Motor Gasoline is 8.78, which is
// already what emissionFactors.js and geographicEstimates use. KUA's fleet is
// three gasoline vehicles and two diesel buses, so this one moves the fleet
// line rather than being cosmetic.
//
// Kept as a SEPARATE map from the stationary factors even where the values
// coincide: EPA publishes stationary and mobile combustion separately, they
// can diverge in future editions, and merging them would be the unit-vs-
// question mistake this codebase has made before.
export const FLEET_FACTORS_KG_PER_GAL = {
  'Gasoline':  8.78, // Motor Gasoline
  'Diesel':   10.21, // Diesel Fuel
  'Propane':   5.72, // Propane
  'CNG':       5.85, // per gallon-equivalent; Hub lists CNG per scf (0.05444)
};

// IPCC AR6 Working Group I Chapter 7 GWP100 values for the
// refrigerants listed in scope1_refrigerant_logs. Used by
// composeRefrigerantMt() to convert net leakage in pounds to mtCO2e.
// Order of magnitude varies by chemical; R-22 is ~5x worse per kg
// than R-410A which is ~5x worse than R-1234yf.
export const REFRIGERANT_GWP100 = {
  'R-410A':   2256,   // AR6 (blend: R-32 + R-125, 50/50 by mass)
  'R-134a':   1530,   // AR6 pure compound. AR5 gave 1300 — don't mix vintages.
  'R-22':     1960,   // AR6 pure compound (HCFC, Montreal phase-out, legacy kit)
  'R-404A':   4728,   // AR6 (blend: R-125 + R-143a + R-134a)
  'R-407C':   1908,   // AR6 (blend: R-32 + R-125 + R-134a)
  'R-32':      771,   // AR6 pure compound
  // Was 4, which is the AR4-era / EU F-Gas Regulation figure — so this one row
  // was a different vintage from the other six, under a single "AR6" label.
  // AR6 gives 0.501: an unsaturated fluorocarbon with an atmospheric lifetime
  // of about ten days cannot have a GWP-100 of 4, which is the physical check
  // that makes this unambiguous rather than a matter of which table you read.
  // Sourcing note: corroborated across two secondary AR6 tables rather than
  // read out of AR6 WG1 Ch.7 directly — flagged so nobody treats it as primary.
  'R-1234yf':  0.501,
  'other':    2000, // generic mid-band fallback for unknown blends
};

const KG_PER_LB = 0.45359237;

// Default EEIO factor (kg CO2e per USD) when a purchased_goods row
// doesn't carry an explicit `eeio_factor_override`. Anchored on EPA
// EPA Supply Chain v1.3 KUA-typical weighted average across paper / IT / cleaning
// / apparel sectors — same value SCOPE3_GOODS_RANGE.central is built
// around.
// AUDIT (Phase 404): the citation above named "EEIO v2.0", which is a
// model, not the published factor set. The actual dataset is EPA's Supply
// Chain GHG Emission Factors v1.3 — kg CO2e per 2022 USD at PURCHASER
// prices, AR5 GWP100, 1,016 NAICS-6 commodities.
//
// The value is left at 0.40 deliberately. Measured against v1.3, the four
// sectors this factor claims to average come out far lower:
//   paper (322)            mean 0.537   (n=11)
//   computers/elec (334)   mean 0.096   (n=24)
//   soap/cleaning (3256)   mean 0.315   (n=4)
//   apparel (315)               0.120   (n=7)
//   unweighted mean of the four 0.267
//   weighted by commodity count 0.224  <- this is the 0.222 earlier
//                                         notes called "unweighted"; counting
//                                         NAICS codes is not a spend weight
// Across all 1,016 commodities the median is 0.173 and the p90 is 0.595,
// so 0.40 sits near the 80th percentile for a basket dominated by
// electronics and apparel. Repricing to ~0.222 would cut the purchased-
// goods line from 1,315 mt to 730 mt (1,315 x 0.222/0.40), taking GROSS
// from 4,395 to 3,790 — a 13.4% reduction. Against the net-basis forest
// sink adopted in task #16, net would move 2,566 -> 1,961 and per-student
// net 7.55 -> 5.77. (Read 1,725 -> 1,140 and 5.07 -> 3.35 before that
// reprice; the gross reduction is unchanged, the net it lands on is not.)
//   (Phase 420: this read "~666 mt" and "~15%". Those came from applying
//   the ratio to a rounded line value instead of 1,315 — my own derived
//   figure going stale, which is the failure Phases 415-417 chased through
//   everyone else's text.)
// That is a headline movement resting on a spend mix nobody has measured
// (the $3M is itself a placeholder), so it is a decision for KUA, not a
// silent edit. Published here rather than quietly closed.
/**
 * The four sectors the default factor claims to average, measured against EPA
 * Supply Chain GHG Emission Factors v1.3 in the Phase 404 audit. Published as
 * data so the weighting is visible and arguable instead of hidden inside one
 * number.
 */
export const PURCHASED_GOODS_SECTORS = [
  { naics: '322',  label: 'Paper',                   kgPerUsd: 0.537, commodityCount: 11 },
  { naics: '334',  label: 'Computers & electronics', kgPerUsd: 0.096, commodityCount: 24 },
  { naics: '3256', label: 'Soap & cleaning',         kgPerUsd: 0.315, commodityCount: 4 },
  { naics: '315',  label: 'Apparel',                 kgPerUsd: 0.120, commodityCount: 7 },
];

export const PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD = 0.40;

/**
 * What the adopted factor is, against what its own stated basis gives.
 *
 * The audit note that measured these sectors called 0.222 the "unweighted
 * mean". It is not: the unweighted mean of the four is 0.267. 0.222 is
 * approximately the COMMODITY-COUNT-weighted mean (0.224), and counting
 * NAICS-6 codes is a meaningless weight for a spend basket — the number of
 * commodity codes in a sector says nothing about what a school buys. That
 * mislabel propagated into the task list as the figure to adopt.
 *
 * The adopted 0.40 sits above three of the four sectors it claims to average.
 * Reaching it requires a basket that is mostly paper, while the same note
 * describes the basket as "dominated by electronics and apparel" — the two
 * lowest. So the constant contradicts its own stated composition.
 *
 * Not repriced here: the sector means themselves are an internal audit
 * finding, not yet checked against the EPA file, and they would be
 * load-bearing for a ~10% move in gross. Stated, not silently adopted.
 */
/**
 * What comparable institutions actually use for spend-based Scope 3 Cat 1.
 * Each kgPerUsd is recomputed from the spend and emissions its own source
 * states, so the arithmetic is checkable rather than quoted.
 *
 * Four institutions across three different databases (EPA SEF, CEDA, EIO-LCA,
 * USEEIO) land at 0.24-0.42 and bracket the published higher-education sector
 * factor of 0.332.
 */
/**
 * The EPA dataset, read from its own methodology document rather than
 * inferred. Source: Wesley Ingwersen, "About the Supply Chain Greenhouse Gas
 * Emission Factors v1.2 NAICS-6 Datasets", USEPA, 12 April 2023.
 *
 * The load-bearing correction: every factor type shares a PURCHASER-PRICE
 * denominator. Verbatim — "The dollar in the denominator of all factors uses
 * purchaser prices in 2021 USD." Margins are not a price basis. Margin
 * Emission Factors add the EMISSIONS of the trade and transport industries
 * that move a good from producer to buyer, in the numerator.
 *
 * So SEF+MEF is still the right column for spend-based accounting, but the
 * correction it represents is small: mean margin 0.0282 kg CO2e/USD, max
 * 0.270, and zero for 55% of commodities.
 */
export const EPA_SUPPLY_CHAIN_BASIS = {
  documentedVersion: 'v1.2',
  documentDate: '2023-04-12',
  citedInThisRepo: 'v1.3',
  versionCaveat: 'Figures here are read from the v1.2 methodology document. The v1.3 document '
    + 'could not be retrieved, so these distributions are labelled v1.2 rather than presented as '
    + 'current. The methodology statements — three factor types, purchaser-price denominator, '
    + 'intended for Scope 3 Cat 1 — are structural and carry across versions.',
  commodities: 1016,
  naicsVintage: 2017,
  ghgDataYear: 2019,
  denominator: 'purchaser prices in 2021 USD',
  gwp: 'IPCC AR4 100-yr',
  intendedFor: 'GHG Protocol Scope 3 Category 1 (purchased goods and services) and Category 2',
  factorTypes: ['SEF', 'MEF', 'SEF+MEF'],
  marginsAreAPriceBasis: false,
  marginsAre: 'the emissions of the trade and transport industries that move a good from producer '
    + 'to buyer — added in the numerator, not a switch of price basis',
  correctColumnForSpend: 'SEF+MEF',
  // Table 1, distributions across the 1,016 commodities
  withoutMargins: { min: 0.013, q1: 0.1230, median: 0.187, mean: 0.3579, q3: 0.4015, max: 10.989 },
  withMargins:    { min: 0.013, q1: 0.1288, median: 0.208, mean: 0.3860, q3: 0.4483, max: 10.989 },
  margins: {
    mean: 0.0282,
    max: 0.270,
    nonZeroShare: 0.45,
    officeFurnitureExample: 0.089,
    note: 'EPA Table 1. Margins are zero for 55% of commodities and always smaller than the '
      + 'corresponding SEF, so a with-margins factor is dominated by its without-margins part.',
  },
};

export const PEER_SPEND_FACTORS = [
  { institution: 'University of Michigan', year: 'FY2020', kgPerUsd: 0.240, blended: true,
    emissionsT: 673000, spendUsd: 2809241627.20,
    basis: 'All purchased goods and services, EPA Supply Chain SEFs; stated range 0.133-0.449.' },
  { institution: 'UC Berkeley (Doyle)', year: 'FY2009', kgPerUsd: 0.258, blended: true,
    emissionsT: 127924.85, spendUsd: 494968275.81,
    basis: 'All procurement, CEDA factors on 2002 USD; Penn State HHD later cites 0.257 from the same work.' },
  { institution: 'Oregon University System', year: 'FY2008', kgPerUsd: 0.380, blended: true,
    emissionsT: 232917, spendUsd: 612551332,
    basis: 'Seven institutions, all supply-chain purchases, Carnegie Mellon EIO-LCA.' },
  { institution: 'MIT (Perlman)', year: 'FY2016', kgPerUsd: 0.420, blended: false,
    emissionsT: 78806, spendUsd: 187600000,
    basis: 'MATERIAL GOODS ONLY (18.4% of spend; services excluded), USEEIO on 2007 USD.' },
  { institution: 'MIT, university-sector code', year: 'FY2016', kgPerUsd: 0.283, blended: false,
    emissionsT: 53175, spendUsd: 187600000,
    basis: 'Same spend priced with the single USEEIO college/university commodity code.' },
  { institution: 'WRI / USEEIO 2017 higher-ed sector', year: '2017', kgPerUsd: 0.332, blended: true,
    basis: 'Published directly as 0.000331922 MT CO2e per dollar for the colleges and universities sector.' },
];

export const GOODS_FACTOR_RECONCILIATION = (() => {
  const v = PURCHASED_GOODS_SECTORS.map((x) => x.kgPerUsd);
  const n = PURCHASED_GOODS_SECTORS.map((x) => x.commodityCount);
  const unweightedMean = +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(3);
  const countWeightedMean = +(
    v.reduce((a, b, i) => a + b * n[i], 0) / n.reduce((a, b) => a + b, 0)
  ).toFixed(3);
  const paper = PURCHASED_GOODS_SECTORS.find((x) => x.naics === '322').kgPerUsd;
  const others = PURCHASED_GOODS_SECTORS.filter((x) => x.naics !== '322');
  const othersMean = others.reduce((a, x) => a + x.kgPerUsd, 0) / others.length;
  const adopted = PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD;
  return {
    adopted,
    unweightedMean,
    countWeightedMean,
    impliedPaperShare: +((adopted - othersMean) / (paper - othersMean)).toFixed(2),
    aligned: false,
    priceBasis: {
      question: 'EPA publishes three factor types per commodity — without margins (SEF), the '
        + 'margins alone (MEF), and with margins (SEF+MEF). All three are per purchaser-price '
        + 'dollar; margins add the emissions of the trade and transport industries that move a '
        + 'good from producer to buyer. Spend-based accounting wants SEF+MEF. Which column the '
        + 'four sector means above came from is still not recorded.',
      applied: false,
      impliedUnweightedWithMargins: +(0.267 + 0.0282).toFixed(3),
      correctedNote: 'Phase 482 described this as a producer-versus-purchaser price switch and '
        + 'illustrated it with one commodity whose margin is 0.089 — over three times the mean. '
        + 'Both were wrong. EPA states the denominator is purchaser price for ALL factor types, '
        + 'and Table 1 puts the mean margin at 0.0282 with margins zero for 55% of commodities. '
        + 'Adding a typical margin to the four sectors moves their average from about 0.267 to '
        + 'about 0.295 — still well under the adopted 0.40. Margins do not close this gap.',
    },
    recommendationRestsOn: 'the peer band, not the margin correction — see EPA_SUPPLY_CHAIN_BASIS',
    recommendation: 'Do not reprice downward on the evidence available. The adopted 0.40 sits inside '
      + 'the 0.24-0.42 band that four peer institutions reach across three databases, near the top of '
      + 'it; the 0.267 and 0.224 candidates sit at or below its bottom. Settling this needs the EPA '
      + 'purchaser-price column confirmed and KUA spend mapped to sectors — not a reweighting of '
      + 'numbers whose price basis is unknown.',
    note: 'The adopted 0.40 kg CO2e/USD sits above three of the four sectors it claims to average. '
      + 'An equal weighting of those sectors gives 0.267; weighting by commodity count gives 0.224. '
      + 'The 0.222 that earlier notes called the "unweighted mean" is the count-weighted one, which '
      + 'is not a spend weight. Reaching 0.40 needs a basket that is mostly paper, against a stated '
      + 'basket dominated by electronics and apparel. But peer institutions land at 0.24-0.42 across '
      + 'three databases and the published higher-education sector factor is 0.332, so the adopted '
      + 'value is inside the peer band while the lower candidates are not. The likeliest reading is '
      + 'that the sector means are on the producer-price basis and the adopted factor is on the '
      + 'purchaser-price one, which is the correct basis for spend. Held, and no longer held as a cut.',
  };
})();

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
  // Corrected in Phase 406. These read 0.218/0.087 and claimed to be the
  // "EPA passenger vehicle avg", but 0.218 kg/km (0.351 kg/mi) is not an
  // EPA figure — it is 8.78 kg/gal at a 25 mpg assumption. EPA publishes a
  // factor for exactly this calculation: GHG Emission Factors Hub 2025,
  // Table 10 (Scope 3 Category 6 Business Travel and Category 7 Employee
  // Commuting), Passenger Car, distance-based method —
  //   0.297 kg CO2 + 0.0059 g CH4 + 0.0053 g N2O per vehicle-mile
  //   = 0.29857 kg CO2e/mi at AR5 GWPs = 0.1855 kg/km.
  car_solo: 0.1855,   // EPA Hub 2025 Table 10, Passenger Car, CO2e @ AR5
  carpool:  0.0742,   // 0.1855 / 2.5 effective passenger share
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
    // Defaults live in academicCalendar.js; 5 × 36 reconciles to the same
    // INSTRUCTIONAL_DAYS the cohort estimates use, which is checked by a test.
    const days   = Number(row.days_per_week ?? COMMUTE_DAYS_PER_WEEK_DEFAULT);
    const weeks  = Number(row.weeks_per_year ?? COMMUTE_WEEKS_DEFAULT);
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
  const allBills  = Array.isArray(bills) ? bills : [];
  const allFleet  = Array.isArray(opts.fleetRecords) ? opts.fleetRecords : [];
  const allRefrig = Array.isArray(opts.refrigerantLogs) ? opts.refrigerantLogs : [];

  // ─── Reporting-period boundary (Phase 429) ──────────────────────
  // Partitioned once here rather than threaded through composeFleetMt /
  // composeRefrigerantMt, so the counting lives in one place and those
  // helpers stay unchanged. Undated rows are kept — see periodStatusOf().
  const billsArr   = withinPeriod(allBills, opts.period);
  const fleetRows  = withinPeriod(allFleet, opts.period);
  const refrigRows = withinPeriod(allRefrig, opts.period);
  const outOfPeriodRows =
    (allBills.length - billsArr.length) +
    (allFleet.length - fleetRows.length) +
    (allRefrig.length - refrigRows.length);

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
        ? `${fleetRows.length} scope1_fleet_records row${fleetRows.length === 1 ? '' : 's'} × EPA Mobile Combustion factors (gasoline 8.78 / diesel 10.21 / propane 5.72 / CNG 5.85 kg CO₂e per gal).`
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
    note: `Composed live: ${measuredParts.join(' + ')}.${remainingPlaceholderParts.length > 0 ? ` Still bottom-up: ${remainingPlaceholderParts.join(' + ')}.` : ''}${outOfPeriodRows > 0 ? ` ${outOfPeriodRows} row${outOfPeriodRows === 1 ? '' : 's'} excluded — outside ${REPORTING_PERIOD.label}.` : ''}`,
    outOfPeriodRows,
  };
}

export const SCOPE1_TOTAL_MT = composeScope1().totalMt;

// ─── Scope 3 ──────────────────────────────────────────────────────
// Student travel + dining (Cat 1 purchased goods) + waste + procurement +
// commuting + upstream fuel.
const SCOPE3_PLACEHOLDER_MT = 2635;
const SCOPE3_PLACEHOLDER_BREAKDOWN = [
  { source: 'Purchased goods (non-dining)',              mt: 1315, provenance: 'estimated', method: 'EPA Supply Chain GHG Emission Factors v1.3 spend-based: ~$3M non-energy procurement × ~0.40 kg CO2e/$ KUA-typical weighted average across paper / IT / cleaning / apparel sectors. KUA Business Office annual spend not yet mapped to USEEIO sectors.' },
  { source: 'Student travel (international + boarder)', mt:  760, provenance: 'estimated', method: 'Yale-style cohort method × KUA fingerprint: 82 day commuters local Upper Valley + 208 US boarders Northeast-skewed × 3-4 RTs/yr + 50 international East-Asia heavy × 1-2 RTs/yr. ICAO + DEFRA 2024 factors including the indirect effects of non-CO₂ emissions. Travel office records not yet integrated.' },
  { source: 'Dining (food production)',                  mt:  235, provenance: 'estimated', method: 'Poore & Nemecek 2018: ~217K student meals (boarders 3×7×36 + day 10×36) + 50K faculty/staff × meal-class kg CO2e. Sodexo/SAGE invoices not yet integrated.' },
  { source: 'Upstream fuel',                             mt:  230, provenance: 'estimated', method: '~17% upstream uplift on bottom-up Scope 1 (refinery + transport for heating oil + propane + fleet fuels).' },
  { source: 'Commuting',                                 mt:   90, provenance: 'estimated', method: '52 staff × Upper Valley ACS commute distribution × ICCT effective fleet fuel-economy. HR commute survey not yet integrated.' },
  { source: 'Waste',                                     mt:    5, provenance: 'estimated', method: '420 people × per-day generation × diversion-split scenarios × EPA Hub 2025 Table 9 (Scope 3 Cat 5) factors. NOTE: this 5 mt row was derived under the old credit-taking factors; on the corrected Cat 5 basis the same activity is ~22 mt. Not moved here because this row sums into SCOPE3_PLACEHOLDER_MT — see the waste range in geographicEstimates.js for the corrected figure. Hauler invoices (tons by stream) not yet integrated.' },
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

// EPA GHG Emission Factors Hub 2025, Table 9 — "Scope 3 Category 5: Waste
// Generated in Operations" (metric tons CO2e per SHORT TON, AR4 GWPs).
// Keys mirror waste_type strings the admin form writes.
//
// EVERY VALUE IS POSITIVE, and that is the correction (Phase 407). These
// previously carried negative factors for recycling and composting, on the
// reasoning that those pathways are "a net carbon avoidance vs the assumed
// counterfactual". That is WARM's life-cycle framing, and it is the wrong
// question for an inventory: EPA's note on Table 9 says the factors "do not
// include avoided emissions impact from any of the disposal methods. This
// exclusion is an adjustment to the life-cycle factors in the WARM tool."
// Recycling excludes avoided process/transport energy and forest carbon
// storage; composting excludes fertilizer offset and soil carbon storage;
// landfilling excludes energy recovery and landfill sequestration.
//
// Crediting KUA for virgin production it never performed is the same error
// as pricing avoided electricity at the inventory grid rate — a
// consequential number doing an inventory's job. Composting still beats
// landfilling here (0.11 vs 0.58); it is a smaller emission, not a credit.
// Stated per SHORT TON here; emissionFactors.js states the same EPA figures
// per kg (0.639 / 0.099 / 0.121) and geographicEstimates.js uses that kg
// form inline. 0.639 x 907.185 / 1000 = 0.5797 = 0.58 — one table, three
// files, two unit systems. factorTableConsistency.test.js pins them.
export const WASTE_FACTORS_MT_PER_TON = {
  'Landfill':   0.58,  // Mixed MSW, landfilled
  'Recycling':  0.09,  // Mixed Recyclables, recycled (was -0.10)
  'Composting': 0.11,  // Food Waste, composted (was 0.04)
  'Hazardous':  0.50,  // UNSOURCED — no WARM/Hub category for this stream
  'E-Waste':    0.02,  // Mixed Electronics, recycled (was 0.30)
};

/**
 * Which reporting period a row falls in: 'in', 'out', or 'undated'.
 *
 * UNDATED IS NOT OUT, and that distinction is the whole design. Every row in
 * the composer tests carries no date (`{ fuel_type: 'Heating Oil', gallons:
 * 50000 }`), and so does every Supabase row entered before the hooks began
 * selecting the date columns. Treating those as out-of-period would break
 * ~20 tests AND silently zero real data — so they are counted IN and
 * reported separately, exactly as the waste skip note reports rows whose
 * unit, waste_type or amount cannot be priced — naming WHICH of the three,
 * since a cubic-yard row and a typo'd stream are different problems with
 * different fixes. Until Phase 438 this sentence described behaviour the
 * rendered message did not actually deliver.
 *
 * Year labels are checked before dates because waste rows carry both, and
 * the label is what the admin form actually sets.
 */
const PERIOD_YEAR_FIELDS = ['school_year', 'fiscal_year'];
const PERIOD_DATE_FIELDS = ['date', 'delivery_date', 'service_date', 'departure_date', 'period_start'];

export function periodStatusOf(row, period = REPORTING_PERIOD) {
  if (!row || typeof row !== 'object') return 'undated';
  for (const f of PERIOD_YEAR_FIELDS) {
    const v = row[f];
    if (typeof v === 'string' && v.trim()) {
      return v.trim() === period.schoolYear ? 'in' : 'out';
    }
  }
  for (const f of PERIOD_DATE_FIELDS) {
    const v = row[f];
    // ISO yyyy-mm-dd compares correctly as a string; no Date parsing, no
    // timezone to get wrong.
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) {
      const d = v.slice(0, 10);
      return d >= period.startIso && d <= period.endIso ? 'in' : 'out';
    }
  }
  return 'undated';
}

/** Rows to count: everything except those provably outside the period. */
export function withinPeriod(rows, period = REPORTING_PERIOD) {
  return (Array.isArray(rows) ? rows : []).filter((r) => periodStatusOf(r, period) !== 'out');
}

// Price one waste row, or say which field stopped it.
//
// This was wasteTons(), which returned 0 for THREE unrelated outcomes: an
// unpriceable unit, an unusable amount, and a legitimate zero. The caller's
// `!tons` test could not tell them apart, so a cubic-yard Landfill row — valid
// stream, valid number — reached the reader as "unknown waste_type or invalid
// amount": two causes that were both false, while the one true cause went
// unnamed. A genuine zero-ton month was counted as a failure for the same
// reason, since !0 is true.
//
// Converting cubic yards needs a density varying ~0.15-0.25 short tons/yd3 by
// material; inventing one would be worse than refusing the unit. So such a row
// still prices at zero — but the page now says why, and says it accurately.
const WASTE_UNITS_PRICEABLE = 'tons/lbs/kg';

function wasteRowStatus(row) {
  const amt = Number(row.amount);
  if (!Number.isFinite(amt) || amt < 0) return { ok: false, reason: 'amount' };
  const unit = String(row.unit || 'tons').toLowerCase();
  let tons;
  if (unit === 'tons' || unit === 'ton')        tons = amt;
  else if (unit === 'pounds' || unit === 'lbs') tons = amt / 2000;
  else if (unit === 'kg')                       tons = amt / 907.185;
  else return { ok: false, reason: 'unit' };
  if (WASTE_FACTORS_MT_PER_TON[row.waste_type] === undefined) return { ok: false, reason: 'type' };
  return { ok: true, tons };
}

// Name every cause that actually occurred, and only those. Keeps the "N
// skipped" count phrasing that dataLayer.test.js pins.
//
// Counts are prefixed only when there is more than one skipped row — a single
// row read "1 skipped — 1 in a unit...", stating the count twice, and the
// unit clause nested a parenthesis inside a parenthesis. This page is meant to
// read like prose, so the qualifier hangs off a semicolon instead.
function describeWasteSkips({ unit, type, amount }) {
  const total = unit + type + amount;
  if (!total) return '';
  const n = (count, label) => (total === 1 ? label : `${count} ${label}`);
  const parts = [];
  if (unit)   parts.push(n(unit, 'unpriceable unit'));
  if (type)   parts.push(n(type, 'unrecognized waste_type'));
  if (amount) parts.push(n(amount, 'invalid amount'));
  const qualifier = unit ? `; only ${WASTE_UNITS_PRICEABLE} convert` : '';
  return ` (${total} skipped — ${parts.join(', ')}${qualifier})`;
}

// Per-trip mtCO2e estimate by destination region. Used for study_abroad
// and faculty_travel rows where each row is a single trip (not an annual
// per-student multiplier). DEFRA 2024 long-haul ECONOMY 0.322
// The canonical long-haul air factor, read from the factor table rather
// than restated, so a factor refresh moves these trips with it.
const AIR_LONG_HAUL_KG_PER_MILE = getFactorByKey('travel', 'air_long_haul').kgco2e_per_unit;

// kg/passenger-mi (incl. the indirect effects of non-CO2 emissions)
// × typical great-circle BOS↔region distances.
//
// Rescaled in Phase 404 by 0.322/0.241 = 1.336. The old values were built
// on 0.241, which matched no row of the published DEFRA table.
/**
 * Representative one-way great-circle distances from Boston, and the factor
 * they are priced at. Stated here so the per-trip numbers below can be
 * DERIVED rather than typed — the previous table printed this method beside
 * itself and then disagreed with it by up to 42%.
 *
 * Distances are unweighted means of the destinations a KUA study-abroad or
 * faculty trip actually plausibly goes to:
 *   europe  LHR 3,256 / CDG 3,439 / FRA 3,659 / MAD 3,402 / ZRH 3,735
 *   asia    HND 6,713 / ICN 6,813 / PEK 6,721 / PVG 7,293 / HKG 7,957
 *   other   GRU 4,808 / JNB 7,863 / SYD 10,098 / LOS 5,114 / BOG 2,610
 *
 * `other` is a genuine catch-all and the widest of the three: its members run
 * from 1.7 mt (Bogota) to 6.5 mt (Sydney). The mean is the honest placeholder,
 * but a real trip row should map to a specific region rather than land here.
 */
export const TRIP_REGION_BASIS = {
  factorKgPerPassengerMile: AIR_LONG_HAUL_KG_PER_MILE,
  factorSource: 'DEFRA 2024 long-haul economy, incl. indirect non-CO2 effects (ef_air_long)',
  oneWayMiles: { europe: 3498, asia: 7099, other: 6098 },
  domesticNote: 'Domestic trips are mostly DRIVEN, not flown, so 0.5 mt is not derived from the air factor and must not be swept into the same rule.',
};

const tripMt = (miles) => +((miles * 2 * AIR_LONG_HAUL_KG_PER_MILE) / 1000).toFixed(2);

// Per-trip mtCO2e by destination region. Long-haul entries are computed from
// TRIP_REGION_BASIS; only `domestic` is a standalone figure, because it is a
// drive rather than a flight.
//
// Phase 404 rescaled this table by 0.322/0.241 to move it onto the published
// DEFRA factor. That corrected the factor and left the implied distances
// alone, so the rescale carried the original error forward — Europe went
// 2.4 -> 3.2 when its own method gives 2.25. (Task #18.)
export const TRIP_MT_BY_REGION = {
  domestic: 0.5,                                   // BOS<->continental US, mostly driven
  europe:   tripMt(TRIP_REGION_BASIS.oneWayMiles.europe),   // ~2.25 (was 3.2)
  asia:     tripMt(TRIP_REGION_BASIS.oneWayMiles.asia),     // ~4.57 (was 4.0)
  other:    tripMt(TRIP_REGION_BASIS.oneWayMiles.other),    // ~3.93 (was 3.3)
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
  const arr = (v) => (Array.isArray(v) ? v : []);
  const allDay     = arr(records.dayStudents);
  const allUsBoard = arr(records.usBoardingStudents);
  const allIntl    = arr(records.internationalStudents);
  const allSa      = arr(records.studyAbroad);
  const allFac     = arr(records.facultyTravel);
  const allWaste   = arr(records.wasteRecords);
  const allGoods   = arr(records.purchasedGoods);
  const allCommute = arr(records.commuting);

  // ─── Reporting-period boundary (Phase 429) ──────────────────────
  // Same partition-once approach as composeScope1FromBills. Undated rows
  // count IN; only rows provably outside the period are dropped, and the
  // count is reported so an admin can see it rather than wonder.
  const day     = withinPeriod(allDay, records.period);
  const usBoard = withinPeriod(allUsBoard, records.period);
  const intl    = withinPeriod(allIntl, records.period);
  const sa      = withinPeriod(allSa, records.period);
  const fac     = withinPeriod(allFac, records.period);
  const waste   = withinPeriod(allWaste, records.period);
  const goods   = withinPeriod(allGoods, records.period);
  const commute = withinPeriod(allCommute, records.period);
  const outOfPeriodRows =
    (allDay.length - day.length) + (allUsBoard.length - usBoard.length) +
    (allIntl.length - intl.length) + (allSa.length - sa.length) +
    (allFac.length - fac.length) + (allWaste.length - waste.length) +
    (allGoods.length - goods.length) + (allCommute.length - commute.length);

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
  const wasteSkips = { unit: 0, type: 0, amount: 0 };
  for (const row of waste) {
    const status = wasteRowStatus(row);
    if (!status.ok) { wasteSkips[status.reason]++; continue; }
    wasteMt += status.tons * WASTE_FACTORS_MT_PER_TON[row.waste_type];
  }
  const wasteSkipNote = describeWasteSkips(wasteSkips);
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
        ? `${day.length} day_students × ${SCOPE3_COHORT_FACTORS_MT_PER_STUDENT.day} mt/yr (EPA SLD) + ${usBoard.length} us_boarding × ${SCOPE3_COHORT_FACTORS_MT_PER_STUDENT.usBoarder} mt/yr (Andover/Exeter peer) + ${intl.length} international × ${SCOPE3_COHORT_FACTORS_MT_PER_STUDENT.international} mt/yr (Yale OoS)${(sa.length + fac.length) > 0 ? ` + ${sa.length} study-abroad + ${fac.length} faculty trips × DEFRA 2024 long-haul economy (incl. indirect non-CO₂ effects)` : ''}.`
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
        ? `${waste.length} waste row${waste.length === 1 ? '' : 's'} × EPA Hub 2025 Table 9 (Scope 3 Cat 5) factors${wasteSkipNote}.`
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
      method: 'Yale Office of Sustainability published per-FTE figure for residential international cohort × DEFRA 2024 long-haul economy, including the indirect effects of non-CO₂ emissions.',
    },
    {
      cohort: 'trips',
      label: 'Study abroad + faculty trips',
      count: sa.length + fac.length,
      mt: Math.round(tripMt),
      perStudentMt: null,
      provenance: (sa.length + fac.length) > 0 ? 'measured' : 'estimated',
      method: `Per-trip mtCO₂e by destination region (domestic ${TRIP_MT_BY_REGION.domestic} / Europe ${TRIP_MT_BY_REGION.europe} / Asia ${TRIP_MT_BY_REGION.asia} / other ${TRIP_MT_BY_REGION.other}) — DEFRA 2024 long-haul economy × mean great-circle distances from BOS. Long-haul values are computed from those distances, not typed, so the method and the numbers cannot drift apart.`,
    },
  ];

  return {
    totalMt,
    breakdown,
    // 'measured' if at least one component flipped; consumers that need
    // mixed provenance read breakdown[i].provenance directly.
    provenance: measuredRowCount > 0 ? 'measured' : 'estimated',
    cohortDetail,
    note: (measuredRowCount > 0
      ? `${measuredRowCount} Scope 3 component${measuredRowCount === 1 ? '' : 's'} composed from Supabase records. Dining + upstream fuel still bottom-up.`
      : 'No Scope 3 records yet — bottom-up placeholder.')
      + (outOfPeriodRows > 0 ? ` ${outOfPeriodRows} row${outOfPeriodRows === 1 ? '' : 's'} excluded — outside ${REPORTING_PERIOD.label}.` : ''),
    outOfPeriodRows,
  };
}

export const SCOPE3_TOTAL_MT = composeScope3().totalMt;

// ─── Renewables composers ─────────────────────────────────────────
// Solar / geothermal / wind admin tables (renewables_solar,
// renewables_geothermal, renewables_wind) are pure pass-throughs
// for the public Renewables page. Self-consumed solar already shows
// up at the BMS as reduced grid pull, so we do NOT subtract it from
// Scope 2 here — that would double-count. Avoided-emission lines
// are reported separately as informational.

// MISLABELLED — 643.0 is NOT ISO-NE's 2024 rate. ISO-NE published 597 lb/MWh
// generation-only (560 including imports) for 2024, and 633 for 2023; 643 is a
// stale figure from 2022 — CONFIRMED against ISO-NE's own published analysis,
// which gives the 2022 in-region rate as 643 lb/MWh (565 including net
// imports). Earlier revisions of this note could only say 643 was not 2024;
// the year is now established directly from the primary source.
//
// Left at 643 for now rather than silently corrected, because this factor sets
// the avoided-emissions figures on the public Renewables page, and changing it
// moves published numbers — the same reason gridMix.js exposes its own factor
// gap instead of closing it. Two further problems to settle in that same pass:
// this is ISO-NE's OPERATIONAL rate while Scope 2 reports on eGRID's
// location-based rate (different boundaries — eGRID nets out biogenic CO2), and
// 643 lb/MWh = 0.2917 kg/kWh sits ~24% above the 0.2464 Scope 2 uses, so one
// kWh is currently valued two ways depending on which page you are on.
// Hard-coded here so the composer stays pure (no Supabase fetch).
// Phase 392 — this is now the SAME factor Scope 2 reports on (gridMix.js).
//
// It previously read `GRID_FACTOR_LB_PER_MWH = 643.0`, labelled "ISO-NE 2024",
// which was wrong twice over: ISO-NE's 2024 in-region rate is 597 lb/MWh (643 is
// a stale figure, most likely 2022), and using ISO-NE's OPERATIONAL rate here
// while Scope 2 reports on the per-fuel reconstruction meant one kilowatt-hour
// was valued ~24% differently depending on which page you were standing on.
//
// Avoided-emissions figures on /renewables fall by about a fifth as a result.
// That is the honest direction: the old factor overstated what the solar avoids.
// CORRECTED WITHIN PHASE 392. My first pass pointed this at the Scope 2
// inventory factor (0.2464) in the name of "one kWh, one number". That was
// wrong, and it made this figure worse than the mislabelled 643 it replaced.
//
// Scope 2 asks what our consumption emitted — an INVENTORY question, answered
// with a location-based AVERAGE. Avoided emissions asks what our solar
// DISPLACED — a consequential question, and what backs down in New England is
// the marginal unit, almost always gas. EPA's AVERT puts New England
// rooftop-scale PV at ~1,079 lb/MWh (2023) ≈ 0.49 kg/kWh, about double the
// average. GHG Protocol treats avoided emissions as consequential modelling
// explicitly outside Scope 2, which is what licenses two different factors.
//
// So this deliberately does NOT follow KG_PER_KWH. Avoided-emissions figures on
// /renewables roughly double against the first pass.
export const GRID_FACTOR_KG_PER_KWH = +avertAvoidedKgPerKwh().toFixed(6);
export const GRID_FACTOR_LB_PER_MWH = +((GRID_FACTOR_KG_PER_KWH * 1000) / KG_PER_LB).toFixed(1);

// Heating-fuel BTU content per gallon — used by the geothermal
// counterfactual (kWh × COP × 3412.14 → BTU → gallons of fuel that
// would have delivered the same heat × per-gallon emission factor).
// Values from EPA Stationary Combustion Hub.
export const FUEL_BTU_PER_GAL = {
  heating_oil: 138500,
  propane:      91500,
};

// ─── Heating-fuel shape of Scope 1, DERIVED ─────────────────────────────
//
// utils/scenarioModel.js hardcoded two constants that contradicted these
// rows: "~80% of Scope 1 is heating fuel" (it is 95.5%) and "~80 kg/MMBtu
// (mix of #2 oil at 73 + propane at 64)" — a figure no blend of 73 and 64
// can produce. The electrify-heating lever therefore removed 1,080 mt where
// the heating row says 1,290.
//
// Derived here from the same rows and factors every other surface uses, so a
// reprice moves the scenario model with it instead of leaving it behind.
export const SCOPE1_HEATING_MT = SCOPE1_PLACEHOLDER_BREAKDOWN
  .filter((r) => /heating|oil|propane/i.test(r.source))
  .reduce((sum, r) => sum + r.mt, 0);

export const HEATING_SHARE_OF_SCOPE1 =
  SCOPE1_HEATING_MT / SCOPE1_PLACEHOLDER_BREAKDOWN.reduce((sum, r) => sum + r.mt, 0);

/** The documented KUA mix — see the heating row's own method string. */
export const HEATING_OIL_FRACTION = 0.90;

export const HEATING_KG_PER_MMBTU =
  HEATING_OIL_FRACTION * (FUEL_FACTORS_KG_PER_GAL['Heating Oil'] / (FUEL_BTU_PER_GAL.heating_oil / 1e6))
  + (1 - HEATING_OIL_FRACTION) * (FUEL_FACTORS_KG_PER_GAL.Propane / (FUEL_BTU_PER_GAL.propane / 1e6));
const BTU_PER_KWH = 3412.14;

/**
 * Sum a renewables_solar table to kWh + avoided-emission mt.
 * Treats null self_consumed_kwh / exported_kwh as 0 (the gross
 * value still counts toward the total).
 *
 * Returns {
 *   periodCount, grossKwh, selfKwh, exportKwh,
 *   avoidedSelfMt, avoidedExportMt, totalAvoidedMt,
 *   gridKgPerKwh
 * }
 */
export function composeSolarFromRecords(rows) {
  const valid = (Array.isArray(rows) ? rows : []).filter((r) => {
    const g = Number(r?.gross_kwh);
    return Number.isFinite(g) && g >= 0;
  });
  let grossKwh = 0;
  let selfKwh = 0;
  let exportKwh = 0;
  for (const r of valid) {
    grossKwh += Number(r.gross_kwh);
    const self = Number(r.self_consumed_kwh);
    if (Number.isFinite(self) && self >= 0) selfKwh += self;
    const exp = Number(r.exported_kwh);
    if (Number.isFinite(exp) && exp >= 0) exportKwh += exp;
  }
  const avoidedSelfMt = +((selfKwh * GRID_FACTOR_KG_PER_KWH) / 1000).toFixed(2);
  const avoidedExportMt = +((exportKwh * GRID_FACTOR_KG_PER_KWH) / 1000).toFixed(2);
  return {
    periodCount: valid.length,
    grossKwh: Math.round(grossKwh),
    selfKwh: Math.round(selfKwh),
    exportKwh: Math.round(exportKwh),
    avoidedSelfMt,
    avoidedExportMt,
    totalAvoidedMt: +(avoidedSelfMt + avoidedExportMt).toFixed(2),
    gridKgPerKwh: GRID_FACTOR_KG_PER_KWH,
    // Named so a caller can't mistake this for the Scope 2 inventory factor.
    factorBasis: 'marginal (displaced generation)',
    factorSource: AVERT_SOURCE,
  };
}

/**
 * Sum a renewables_geothermal table to avoided-fossil mt.
 * thermal_btu = kwh_input × cop × 3412.14
 * gallons      = thermal_btu / FUEL_BTU_PER_GAL[avoided_fuel_type]
 * avoided_mt   = gallons × FUEL_FACTORS_KG_PER_GAL[fuel] / 1000
 * Rows with avoided_fuel_type == 'none' (or unknown) skip the avoided
 * calc but still count toward kwhInput / thermalMmbtu totals.
 *
 * @param {Array<{kwh_input: number|string, cop?: number|string, avoided_fuel_type?: string}>} rows
 * @param {{ defaultCop?: number }} [opts]
 */
export function composeGeothermalFromRecords(rows, opts = {}) {
  const defaultCop = Number.isFinite(opts.defaultCop) ? opts.defaultCop : 3.5;
  const valid = (Array.isArray(rows) ? rows : []).filter((r) => {
    const k = Number(r?.kwh_input);
    return Number.isFinite(k) && k >= 0;
  });
  let kwhInput = 0;
  let thermalBtu = 0;
  const byFuel = { heating_oil: 0, propane: 0 };
  for (const r of valid) {
    const kwh = Number(r.kwh_input);
    const cop = Number(r.cop);
    const usedCop = Number.isFinite(cop) && cop > 0 ? cop : defaultCop;
    const btu = kwh * usedCop * BTU_PER_KWH;
    kwhInput += kwh;
    thermalBtu += btu;
    const fuel = r.avoided_fuel_type;
    if (fuel === 'heating_oil' || fuel === 'propane') {
      const gallons = btu / FUEL_BTU_PER_GAL[fuel];
      const factor = FUEL_FACTORS_KG_PER_GAL[fuel === 'heating_oil' ? 'Heating Oil' : 'Propane'];
      byFuel[fuel] += (gallons * factor) / 1000;
    }
  }
  const avoidedFossilMt = +(byFuel.heating_oil + byFuel.propane).toFixed(2);
  return {
    periodCount: valid.length,
    kwhInput: Math.round(kwhInput),
    thermalMmbtu: +(thermalBtu / 1_000_000).toFixed(1),
    avoidedFossilMt,
    byFuel: {
      heating_oil: +byFuel.heating_oil.toFixed(2),
      propane:     +byFuel.propane.toFixed(2),
    },
  };
}

/**
 * Pick the latest renewables_wind row by as_of_date. Wind is
 * offline-asset documentation rather than time-series — most recent
 * row IS the current status. Returns null when there are no rows.
 *
 * @param {Array<{as_of_date: string, status: string, rated_kw?: number, last_operational_date?: string, historical_kwh?: number}>} rows
 */
export function composeWindFromRecords(rows) {
  const arr = Array.isArray(rows) ? rows : [];
  if (arr.length === 0) return { latest: null, recordCount: 0 };
  const sorted = [...arr].sort((a, b) => String(b.as_of_date || '').localeCompare(String(a.as_of_date || '')));
  const top = sorted[0];
  return {
    latest: {
      status: top.status || 'unknown',
      asOfDate: top.as_of_date || null,
      ratedKw: Number.isFinite(Number(top.rated_kw)) ? Number(top.rated_kw) : null,
      lastOperationalDate: top.last_operational_date || null,
      historicalKwh: Number.isFinite(Number(top.historical_kwh)) ? Number(top.historical_kwh) : null,
    },
    recordCount: arr.length,
  };
}

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
