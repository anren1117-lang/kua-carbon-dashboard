// Core emission-factor math. Pure functions — no I/O, no side effects.

import { getFactor, getFactorByKey } from '../data/emissionFactors.js';

/**
 * Convert an activity quantity to kgCO2e.
 * @param {object} args
 * @param {number} args.quantity        Activity volume (kWh, gallon, kg, mile, USD…)
 * @param {string=} args.factorId        Use this factor by id (preferred)
 * @param {string=} args.category        Or look up by category+subcategory
 * @param {string=} args.subcategory
 * @returns {{ kgco2e: number, factor: import('../data/emissionFactors.js').EmissionFactor | null }}
 */
export function quantityToKgCO2e({ quantity, factorId, category, subcategory }) {
  const factor = factorId ? getFactor(factorId) : getFactorByKey(category, subcategory);
  if (!factor) return { kgco2e: 0, factor: null };
  return { kgco2e: quantity * factor.kgco2e_per_unit, factor };
}

/** Convert kg → metric tons. */
export const kgToMt = (kg) => kg / 1000;

/** Convert metric tons → kg. */
export const mtToKg = (mt) => mt * 1000;

/**
 * Annual electricity emissions for a meter total (kWh) using the
 * ISO-NE-system-average factor. Returns metric tons CO2e.
 */
export function annualElectricityMt(kwh) {
  const { kgco2e } = quantityToKgCO2e({ quantity: kwh, factorId: 'ef_grid_isone_2024' });
  return kgToMt(kgco2e);
}
