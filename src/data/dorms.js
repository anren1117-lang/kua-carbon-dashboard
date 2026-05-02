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

/** @type {Dorm[]} */
export const dorms = [
  { id: 'd_barrette', name: 'Barrette',           buildingId: 'b_barrette', population: 60, type: 'co-ed' },
  { id: 'd_kilton',   name: 'Kilton House',       buildingId: 'b_kilton',   population: 36, type: 'girls' },
  { id: 'd_chellis',  name: 'Chellis Hall',       buildingId: 'b_chellis',  population: 24, type: 'girls' },
  { id: 'd_welch',    name: 'Welch House',        buildingId: 'b_welch',    population: 22, type: 'girls' },
  { id: 'd_dexter',   name: 'Dexter-Richards',    buildingId: 'b_dexter',   population: 28, type: 'boys' },
  { id: 'd_densmore', name: 'Densmore Hall',      buildingId: 'b_densmore', population: 26, type: 'boys' },
  { id: 'd_kurth',    name: 'Kurth Hall',         buildingId: 'b_kurth',    population: 22, type: 'boys' },
  { id: 'd_baxter',   name: 'Baxter',             buildingId: 'b_baxter',   population: 18, type: 'boys' },
  { id: 'd_bryant',   name: 'Bryant Hall',        buildingId: 'b_bryant',   population: 18, type: 'co-ed' },
  { id: 'd_rowe',     name: 'Rowe Hall',          buildingId: 'b_rowe',     population: 16, type: 'co-ed' },
  { id: 'd_mikula',   name: 'Mikula Hall',        buildingId: 'b_mikula',   population: 14, type: 'co-ed' },
];

const dormsById = Object.fromEntries(dorms.map((d) => [d.id, d]));
export function getDorm(id) {
  return dormsById[id] || null;
}
