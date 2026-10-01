// Dorm registry — used as the public aggregation level for student
// engagement leaderboards. Joins to buildings.js by buildingId.

/**
 * @typedef {Object} Dorm
 * @property {string} id
 * @property {string} name
 * @property {string} buildingId
 * @property {number|null} population   null = not published / unknown
 * @property {boolean=} modeled      false = KUA lists it, this repo has no data for it
 * @property {'boys'|'girls'|'co-ed'} type
 */

// WHICH BUILDINGS ARE DORMS is settled by KUA's own campus map (the copy in
// src/public/kua-campus-map.png; its numbered legend matches buildings.js
// bmsNumber). Its STUDENT RESIDENTIAL list has eleven entries:
//
//   13 Densmore  14 Bryant  15 Dexter-Richards  16 Rowe  17 Welch
//   18 Kilton    19 Hall Farm  20 Frost  21 Kurth  22 Chellis  23 Mikula
//
// This registry used to carry Barrette and Baxter instead of Hall Farm and
// Frost. Barrette is the campus center and dining commons (#9, filed under
// ACADEMIC on the map) and Baxter is the head of school's house and the
// administration building (#1, under ADMINISTRATION). Between them they held
// 62 of 228 "residents" — 27% — and because Barrette's meter covers a dining
// hall, it sat at the TOP of the student dorm leaderboard at 2,834
// kWh/resident, against 510-1,921 for the real dorms.
//
// Hall Farm and Frost are registered here as unmodeled: KUA lists them as
// student residential, and this repo has no meter, no square footage and no
// coordinates for either. They are carried with population null rather than
// invented, and excluded from per-resident rankings.
//
// WHAT IS PUBLISHED, and what is not:
//   - 340 students, "76 Percent of students board" -> ~258 boarders, ~82 day
//     (kua.org/about). The cohort model in geographicEstimates.js agrees.
//   - Kilton went "from a 14 to a 32-bed residential hall" and Welch "to 18
//     student beds" (kua.org, 22 Nov 2024). Those two are set from that
//     source. The renovated hall was also renamed for Cynthia Howe and Murray
//     Dewdney; sources differ on whether the whole hall or a new wing carries
//     the Howe Dewdney name, so the label here stays with the map's "Kilton
//     Hall" until someone on campus confirms it.
//   - KUA describes dorms running "from five to 45" students, including a
//     farmhouse setting with "as few as 4 other students" — almost certainly
//     Hall Farm. So the missing dorms are small, not large.
//   - PER-DORM HEADCOUNTS ARE NOT PUBLISHED ANYWHERE. Nine modeled dorms sum
//     to 169 against ~258 boarders. Correcting the classification WIDENED that
//     gap (it was 228 vs 258) rather than closing it, and two small farmhouse
//     dorms do not bridge 89 students. Either the per-dorm numbers are low,
//     or boarders live in faculty houses this registry does not model. The
//     residential-life roster settles it and nothing else does.
//
// These headcounts divide into the kWh/student/day figure on /buildings and
// the perResident ranking on the dorm leaderboard, so they are not inflated to
// hit a total. A bed count is also not an occupancy: 32 beds in Kilton is a
// ceiling, not a census.
export const DORM_REGISTRY_BASIS = {
  source: "KUA campus map (src/public/kua-campus-map.png), STUDENT RESIDENTIAL legend",
  publishedBoarders: 258,
  publishedBoardingPct: 76,
  publishedTotalStudents: 340,
  bedCountSource: 'kua.org news, 22 Nov 2024 — Kilton 14 -> 32 beds, Welch 18 student beds',
  reclassified: [
    { id: 'b_barrette', wasPopulation: 48, actual: 'Barrette Campus Center / Doe Dining Common (map #9, ACADEMIC)' },
    { id: 'b_baxter',   wasPopulation: 14, actual: 'Baxter: Head of School, Administration (map #1, ADMINISTRATION)' },
  ],
  unmodeledDorms: ['Hall Farm Dorm (map #19)', 'Frost Dorm (map #20)'],
  perDormHeadcountsPublished: false,
};

/** @type {Dorm[]} */
export const dorms = [
  { id: 'd_kilton',   name: 'Kilton Hall',        buildingId: 'b_kilton',   population: 32, type: 'girls' },
  { id: 'd_chellis',  name: 'Chellis Hall',       buildingId: 'b_chellis',  population: 19, type: 'girls' },
  { id: 'd_welch',    name: 'Welch House',        buildingId: 'b_welch',    population: 18, type: 'girls' },
  { id: 'd_dexter',   name: 'Dexter-Richards',    buildingId: 'b_dexter',   population: 23, type: 'boys' },
  { id: 'd_densmore', name: 'Densmore Hall',      buildingId: 'b_densmore', population: 21, type: 'boys' },
  { id: 'd_kurth',    name: 'Kurth Hall',         buildingId: 'b_kurth',    population: 18, type: 'boys' },
  { id: 'd_bryant',   name: 'Bryant Hall',        buildingId: 'b_bryant',   population: 14, type: 'co-ed' },
  { id: 'd_rowe',     name: 'Rowe Hall',          buildingId: 'b_rowe',     population: 13, type: 'co-ed' },
  { id: 'd_mikula',   name: 'Mikula Hall',        buildingId: 'b_mikula',   population: 11, type: 'co-ed' },
  // Unmodeled: on KUA's student-residential list, absent from this repo's
  // building/meter data. population null means UNKNOWN, never zero.
  { id: 'd_hallfarm', name: 'Hall Farm Dorm',     buildingId: null,         population: null, type: 'co-ed', modeled: false },
  { id: 'd_frost',    name: 'Frost Dorm',         buildingId: null,         population: null, type: 'co-ed', modeled: false },
];

const dormsById = Object.fromEntries(dorms.map((d) => [d.id, d]));
export function getDorm(id) {
  return dormsById[id] || null;
}
