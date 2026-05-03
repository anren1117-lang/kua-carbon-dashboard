// Dorm registry — used as the public aggregation level for student
// engagement leaderboards. Joins to buildings.js by buildingId.

/**
 * @typedef {Object} Dorm
 * @property {string} id
 * @property {string} name
 * @property {string} buildingId
 * @property {number} population
 * @property {'boys'|'girls'|'co-ed'} type
 */

// Populations sum to ~238 (about 70% of the 340-student enrollment per
// KUA's public boarding/day mix). Per-dorm headcounts approximate KUA's
// actual house assignments — replace with the residential-life roster
// once an SIS export is available.
/** @type {Dorm[]} */
export const dorms = [
  { id: 'd_barrette', name: 'Barrette',           buildingId: 'b_barrette', population: 48, type: 'co-ed' },
  { id: 'd_kilton',   name: 'Kilton House',       buildingId: 'b_kilton',   population: 29, type: 'girls' },
  { id: 'd_chellis',  name: 'Chellis Hall',       buildingId: 'b_chellis',  population: 19, type: 'girls' },
  { id: 'd_welch',    name: 'Welch House',        buildingId: 'b_welch',    population: 18, type: 'girls' },
  { id: 'd_dexter',   name: 'Dexter-Richards',    buildingId: 'b_dexter',   population: 23, type: 'boys' },
  { id: 'd_densmore', name: 'Densmore Hall',      buildingId: 'b_densmore', population: 21, type: 'boys' },
  { id: 'd_kurth',    name: 'Kurth Hall',         buildingId: 'b_kurth',    population: 18, type: 'boys' },
  { id: 'd_baxter',   name: 'Baxter',             buildingId: 'b_baxter',   population: 14, type: 'boys' },
  { id: 'd_bryant',   name: 'Bryant Hall',        buildingId: 'b_bryant',   population: 14, type: 'co-ed' },
  { id: 'd_rowe',     name: 'Rowe Hall',          buildingId: 'b_rowe',     population: 13, type: 'co-ed' },
  { id: 'd_mikula',   name: 'Mikula Hall',        buildingId: 'b_mikula',   population: 11, type: 'co-ed' },
];

const dormsById = Object.fromEntries(dorms.map((d) => [d.id, d]));
export function getDorm(id) {
  return dormsById[id] || null;
}
