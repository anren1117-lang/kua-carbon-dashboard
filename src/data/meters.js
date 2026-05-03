// Meter registry. One electricity meter per monitored building, plus
// campus-level fuel master meters. annualBaselineValue is derived from
// the live KUA Eclypse BMS snapshot in envysionSnapshot.js — each
// building's year-to-date kWh through 2026-05-03, scaled by 365/123 to
// project a full-year figure. The MockMeterAdapter uses these to shape
// interval readings.

import { buildings } from './buildings.js';
import { envysionSnapshot, ANNUALIZE_FACTOR } from './envysionSnapshot.js';

/**
 * @typedef {Object} Meter
 * @property {string} id
 * @property {string} buildingId
 * @property {'electricity'|'gas'|'water'|'steam'|'solar'} type
 * @property {string} unit                'kWh' | 'therm' | 'gallon' | 'lb_steam' | 'm3'
 * @property {string} provider            'Envysion' | 'Liberty Utilities' | 'KUA Facilities' | etc.
 * @property {number} annualBaselineValue Ground-truth annual usage used by mock generator
 * @property {15|30|60|1440} intervalMinutes Reporting cadence
 */

const ytdByBuilding = Object.fromEntries(
  envysionSnapshot.map((row) => [row.buildingId, row.energyUsedKwh]),
);

function annualKwhFor(buildingId) {
  const ytd = ytdByBuilding[buildingId];
  if (ytd == null) return 1000; // Fallback for any building missing from the snapshot.
  return Math.round(ytd * ANNUALIZE_FACTOR);
}

/** @type {Meter[]} */
export const meters = [
  ...buildings.map((b) => ({
    id: `m_elec_${b.id}`,
    buildingId: b.id,
    type: /** @type {const} */ ('electricity'),
    unit: 'kWh',
    provider: 'Envysion',
    annualBaselineValue: annualKwhFor(b.id),
    intervalMinutes: /** @type {15|30|60|1440} */ (60),
  })),
  // Campus-level fuel master meters (mock for now)
  { id: 'm_oil_campus',   buildingId: 'b_miller',   type: 'gas',   unit: 'gallon', provider: 'KUA Facilities (oil deliveries)', annualBaselineValue: 120000, intervalMinutes: 1440 },
  { id: 'm_propane_campus', buildingId: 'b_silvergym', type: 'gas', unit: 'gallon', provider: 'KUA Facilities (propane)', annualBaselineValue: 18000, intervalMinutes: 1440 },
];

const metersById = Object.fromEntries(meters.map((m) => [m.id, m]));
export function getMeter(id) {
  return metersById[id] || null;
}

export function listMetersForBuilding(buildingId) {
  return meters.filter((m) => m.buildingId === buildingId);
}
