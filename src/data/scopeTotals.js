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

/**
 * Compose a Scope 1 result from real Supabase fuel_bills rows. Returns
 * the same shape as composeScope1() but with provenance='measured' if
 * any fuel rows are present, falling back to the bottom-up placeholder
 * for fleet + refrigerants until those tables ship too.
 *
 * Pure function: no I/O, no global state. The Supabase fetch is the
 * caller's responsibility (see src/hooks/useMeasuredScope1.js).
 *
 * @param {Array<{ fuel_type: string, gallons: number|string }>} bills
 * @param {{ fleetMt?: number, refrigerantsMt?: number }} [opts]
 * @returns {{ totalMt: number, breakdown: object[], provenance: string, note: string }}
 */
export function composeScope1FromBills(bills, opts = {}) {
  const fleetMt = typeof opts.fleetMt === 'number' ? opts.fleetMt
    : (SCOPE1_PLACEHOLDER_BREAKDOWN.find((r) => r.source.toLowerCase().includes('fleet'))?.mt || 0);
  const refrigMt = typeof opts.refrigerantsMt === 'number' ? opts.refrigerantsMt
    : (SCOPE1_PLACEHOLDER_BREAKDOWN.find((r) => r.source.toLowerCase().includes('refrigerant'))?.mt || 0);

  if (!Array.isArray(bills) || bills.length === 0) {
    // Nothing measured yet — return the placeholder unchanged so the
    // dashboard is honest about what's not yet sourced.
    return composeScope1();
  }

  // Sum kg by fuel type. Skip rows with unknown fuel types or
  // non-numeric gallons rather than silently bucketing them.
  let heatingKg = 0;
  let unknownTypeRows = 0;
  for (const row of bills) {
    const factor = FUEL_FACTORS_KG_PER_GAL[row.fuel_type];
    const gal = Number(row.gallons);
    if (!factor || !Number.isFinite(gal) || gal < 0) { unknownTypeRows++; continue; }
    heatingKg += gal * factor;
  }
  const heatingMt = heatingKg / 1000;
  const totalMt = heatingMt + fleetMt + refrigMt;

  const breakdown = [
    {
      source: 'Heating oil + propane',
      mt: Math.round(heatingMt),
      provenance: 'measured',
      method: `${bills.length} fuel_bills row${bills.length === 1 ? '' : 's'} × EPA Stationary Combustion factors${unknownTypeRows > 0 ? ` (${unknownTypeRows} row${unknownTypeRows === 1 ? '' : 's'} skipped — unknown fuel_type or invalid gallons)` : ''}.`,
    },
    {
      source: 'Fleet vehicles',
      mt: Math.round(fleetMt),
      provenance: 'estimated',
      method: 'Bottom-up registry placeholder (fuel-card records not yet integrated).',
    },
    {
      source: 'Refrigerant leakage',
      mt: Math.round(refrigMt),
      provenance: 'estimated',
      method: 'Bottom-up placeholder (refrigerant service-report mass balance not yet integrated).',
    },
  ];

  return {
    totalMt: Math.round(totalMt),
    breakdown,
    // 'measured' for the heating row; the page should still show the
    // estimated pill for fleet + refrigerants. Consumers that want
    // mixed provenance read breakdown[i].provenance directly.
    provenance: 'measured',
    note: `Heating composed from ${bills.length} fuel_bills row${bills.length === 1 ? '' : 's'}. Fleet + refrigerants still bottom-up.`,
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
