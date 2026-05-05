// Real-world equivalents for kWh totals. Used by the EnergyEquivalents
// card and the Executive Dashboard hero. Sources documented inline so the
// numbers can be audited without leaving the file.

import { GRID_MIX_TOTAL_KWH, GRID_MIX_TOTAL_MTCO2E } from '../data/gridMix.js';

// Tesla Model 3 Long Range — full charge ≈ 82 kWh usable battery
// (Tesla spec sheet, 2024 model year)
const KWH_PER_TESLA_CHARGE = 82;

// iPhone 17 Pro Max — full charge ≈ 0.0197 kWh
// (Apple-published battery capacity 4,832 mAh @ 3.85 V nominal,
//  rounded to ~19.7 Wh per full charge cycle)
const KWH_PER_IPHONE_CHARGE = 0.0197;

// 60W incandescent bulb — 0.06 kWh per hour of operation
const KWH_PER_60W_BULB_HOUR = 0.06;

/**
 * Compute the Eclypse-style "equal to" set for a kWh figure.
 * @param {number} kwh
 */
export function energyEquivalents(kwh) {
  if (!kwh || kwh < 0) return { teslaCharges: 0, iphoneCharges: 0, bulbHours: 0 };
  return {
    teslaCharges:  Math.round(kwh / KWH_PER_TESLA_CHARGE),
    iphoneCharges: Math.round(kwh / KWH_PER_IPHONE_CHARGE),
    bulbHours:     Math.round(kwh / KWH_PER_60W_BULB_HOUR),
  };
}

// Carbon-equivalents for mtCO2e (used by Executive Dashboard hero).
const MT_PER_CAR_YEAR    = 4.6;       // EPA: average passenger car emits ~4.6 mtCO2e/yr
const MT_PER_TREE_YEAR   = 0.0605;    // EPA: avg US tree sequesters ~60.5 kg CO2/yr
const MT_PER_HOME_YEAR   = 8.81;      // EPA: avg US home electricity = ~8.81 mtCO2e/yr
const MT_PER_TRANSAT_FLT = 1.4;       // ICAO: avg one-way transatlantic flight per pax
const MT_PER_GAL_GAS     = 0.00878;   // EPA: 8.78 kg CO2/gallon gasoline
// ISO-NE effective output-basis factor (≈0.000235 mtCO2e/kWh — see gridMix.js).
// Derive reactively from the per-fuel composition so this stays in sync if the mix changes.
const KWH_AT_ISONE_PER_MT = GRID_MIX_TOTAL_KWH / GRID_MIX_TOTAL_MTCO2E;

/** @param {number} mt */
export function carbonEquivalents(mt) {
  if (!mt || mt < 0) return { carYears: 0, treeYears: 0, homeYears: 0, transatFlights: 0, galsGasoline: 0, bulbsPerYear: 0 };
  return {
    carYears:        Math.round(mt / MT_PER_CAR_YEAR),
    treeYears:       Math.round(mt / MT_PER_TREE_YEAR),
    homeYears:       Math.round(mt / MT_PER_HOME_YEAR),
    transatFlights:  Math.round(mt / MT_PER_TRANSAT_FLT),
    galsGasoline:    Math.round(mt / MT_PER_GAL_GAS),
    // 100W bulb running for a year @ ISO-NE factor → bulb-years
    bulbsPerYear:    Math.round((mt * KWH_AT_ISONE_PER_MT) / (0.1 * 8760)),
  };
}
