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
// Today's value is a hand-set placeholder. Replace by importing actual
// fuel delivery records (fuel_bills Supabase table) and refrigerant
// service logs.
const SCOPE1_PLACEHOLDER_MT = 1250;
const SCOPE1_PLACEHOLDER_BREAKDOWN = [
  { source: 'Heating oil + propane', mt: 1180, provenance: 'estimated', method: '100k–150k gal heating-oil-equivalent assumption × EPA Stationary Combustion factors. Real KUA delivery invoices not yet integrated.' },
  { source: 'Refrigerant leakage',    mt:   30, provenance: 'estimated', method: 'Typical commercial-HVAC leakage rate × IPCC AR6 GWP100. Real service-report mass balance not yet integrated.' },
  { source: 'Fleet vehicles',         mt:   40, provenance: 'estimated', method: 'KUA fleet of ~6 vehicles × typical institutional usage × EPA Mobile Combustion. Real fuel-card records not yet integrated.' },
];

/** Compute Scope 1 from the underlying components. Today this is the
 *  placeholder; once data wiring ships it composes from real records. */
export function composeScope1() {
  return {
    totalMt: SCOPE1_PLACEHOLDER_MT,
    breakdown: SCOPE1_PLACEHOLDER_BREAKDOWN,
    provenance: 'estimated',
    note: 'Hand-set placeholder. Composes from fuel_bills + refrigerant logs + fuel-card records once those are integrated.',
  };
}

export const SCOPE1_TOTAL_MT = composeScope1().totalMt;

// ─── Scope 3 ──────────────────────────────────────────────────────
// Student travel + dining (Cat 1 purchased goods) + waste + procurement +
// commuting + upstream fuel.
const SCOPE3_PLACEHOLDER_MT = 2700;
const SCOPE3_PLACEHOLDER_BREAKDOWN = [
  { source: 'Student travel (international + boarder)', mt: 1900, provenance: 'estimated', method: '~50 internationals × 3 mt/RT + ~150 US boarders × 3-4 trips × 1 mt + study abroad + athletics. ICAO calculator methodology; trip counts are guesses. Travel office records not yet integrated.' },
  { source: 'Dining (purchased goods)',                  mt:  450, provenance: 'estimated', method: 'EEIO spend-based methodology. Sodexo/SAGE invoices not yet integrated.' },
  { source: 'Waste',                                     mt:  150, provenance: 'estimated', method: 'EPA WARM v15.1 methodology. Hauler invoices (tons by stream) not yet integrated.' },
  { source: 'Procurement (non-dining)',                  mt:  100, provenance: 'estimated', method: 'EEIO spend-based. KUA Business Office annual spend not yet mapped to USEEIO sectors.' },
  { source: 'Commuting',                                 mt:   50, provenance: 'estimated', method: 'GHG Protocol Cat 7 + ICCT fleet fuel-economy. HR commute survey not yet integrated.' },
  { source: 'Upstream fuel',                             mt:   50, provenance: 'estimated', method: '~15-20% uplift on Scope 1+2.' },
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
