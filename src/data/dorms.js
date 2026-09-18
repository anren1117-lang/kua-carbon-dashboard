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

// Populations sum to 228. That was described as "about 67% of the 340-student
// enrollment per KUA's public boarding/day mix" — but 67% was the old 70/30
// assumption Phase 414 corrected. KUA publishes "76 Percent of students
// board", which puts boarding at ~258, so THIS REGISTRY IS ~30 STUDENTS SHORT
// of the cohort model in geographicEstimates.js.
//
// The gap is left open on purpose. These per-dorm headcounts divide into the
// kWh/student/day figure on /buildings and the perResident ranking on the dorm
// leaderboard, so inflating 11 houses to hit 258 would move a student-facing
// competitive ranking in order to tidy a disclosure problem. Either ~30
// boarders live somewhere this registry does not model (faculty houses,
// off-campus), or the per-dorm numbers are simply low; the residential-life
// roster settles it and nothing else does.
//
// Note also that buildings.js carries its own dormPopulation field summing to
// the same 228. The two files are hand-maintained twins that agree because
// they were typed to agree — that is duplication, not corroboration.
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
