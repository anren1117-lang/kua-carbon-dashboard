// Aggregation utilities — roll-ups by scope, category, building, period.

import { quantityToKgCO2e, kgToMt } from './emissions.js';
import { meters } from '../data/meters.js';
import { gridMix, GRID_MIX_TOTAL_KWH } from '../data/gridMix.js';

/**
 * Sum a collection of records by a key extractor + value extractor.
 * @template T
 * @param {T[]} rows
 * @param {(t: T) => string} keyFn
 * @param {(t: T) => number} valFn
 * @returns {Record<string, number>}
 */
export function sumBy(rows, keyFn, valFn) {
  const out = {};
  for (const r of rows) {
    const k = keyFn(r);
    out[k] = (out[k] || 0) + valFn(r);
  }
  return out;
}

/**
 * Roll up meter readings to total kWh per buildingId.
 * @param {import('../adapters/meter/MeterDataAdapter.js').MeterReading[]} readings
 */
export function kwhByBuilding(readings) {
  return sumBy(
    readings.filter((r) => r.meterType === 'electricity'),
    (r) => r.buildingId,
    (r) => r.value,
  );
}

/**
 * Allocate building-level kWh into per-grid-source kWh using the system mix.
 */
export function allocateByGridMix(totalKwh) {
  return gridMix.map((src) => ({
    source: src.source,
    kwh: totalKwh * (src.mixPercent / 100),
    mtCO2e: (totalKwh * (src.mixPercent / 100) * src.emissionFactor),
  }));
}

/**
 * Annualize a building's kWh into mtCO2e using the system-average factor.
 */
export function buildingAnnualEmissionsMt(kwh) {
  const { kgco2e } = quantityToKgCO2e({ quantity: kwh, factorId: 'ef_grid_isone_2024' });
  return kgToMt(kgco2e);
}

/**
 * Per-student intensity (mtCO2e/student/yr) given total mt and population.
 */
export function perStudentIntensity(totalMt, studentCount) {
  if (!studentCount) return 0;
  return totalMt / studentCount;
}

/**
 * Per-square-foot intensity (kgCO2e/sqft/yr).
 */
export function perSqftIntensity(totalMt, sqft) {
  if (!sqft) return 0;
  return (totalMt * 1000) / sqft;
}

/**
 * Annual baseline scaffold for a meter, using its annualBaselineValue field.
 * Useful when the consumer wants total kWh without iterating readings.
 */
export function meterAnnualKwh(meterId) {
  const m = meters.find((mm) => mm.id === meterId);
  return m?.annualBaselineValue ?? 0;
}

/** Total electricity baseline across all electricity meters. */
export function totalCampusElectricityKwh() {
  return meters
    .filter((m) => m.type === 'electricity')
    .reduce((s, m) => s + m.annualBaselineValue, 0);
}

/** Convenience: emission factor used for the campus average kWh share */
export function campusKwhShareFactor() {
  return GRID_MIX_TOTAL_KWH > 0 ? GRID_MIX_TOTAL_KWH : 1;
}
