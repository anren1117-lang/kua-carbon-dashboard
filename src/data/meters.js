// Meter registry. One electricity meter per monitored building, plus a
// campus-level natural-gas master meter. Annual baseline kWh values come from
// Envysion 2024 building data and are used by the MockMeterAdapter to
// generate plausible interval readings.

import { buildings } from './buildings.js';

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

const annualKwhByBuilding = {
  b_miller:     44695, b_whittemore: 43193, b_barrette:   35365, b_kilton:    20069,
  b_fitch:      15427, b_silvergym:  11407, b_flickinger:  9717, b_chellis:    5217,
  b_welch:       5511, b_dexter:      5105, b_densmore:    4768, b_kurth:      3784,
  b_baxter:      2403, b_bryant:      2288, b_rowe:        2072, b_bishop:     1826,
  b_childcare:   1738, b_mikula:      1595, b_barnfield:  12500,
};

/** @type {Meter[]} */
export const meters = [
  ...buildings.map((b) => ({
    id: `m_elec_${b.id}`,
    buildingId: b.id,
    type: /** @type {const} */ ('electricity'),
    unit: 'kWh',
    provider: 'Envysion',
    annualBaselineValue: annualKwhByBuilding[b.id] ?? 1000,
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
