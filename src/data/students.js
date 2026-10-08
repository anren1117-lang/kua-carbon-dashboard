// Privacy-safe student profiles. The studentIdHash is the ONLY identifier the
// app uses; names and SIS IDs never leave the SIS/SSO boundary. Public
// dashboards aggregate at dorm/grade level, never at individual level.

import { dorms } from './dorms.js';

/**
 * @typedef {Object} StudentProfile
 * @property {string} studentIdHash
 * @property {string} dormId
 * @property {9|10|11|12} grade
 * @property {boolean} optInLeaderboard
 * @property {number} carbonPoints
 * @property {'novice'|'intermediate'|'advanced'} learningLevel
 */

// Modeled dorms only — d_hallfarm and d_frost have no building, meter or
// published headcount, so placing synthetic students there would invent
// occupancy for a dorm we cannot measure. See DORM_REGISTRY_BASIS.
const dormCycle = ['d_kilton', 'd_chellis', 'd_welch', 'd_dexter', 'd_densmore', 'd_kurth', 'd_bryant', 'd_rowe', 'd_mikula'];

function makeHash(seed) {
  // Stable mock hash for development. NOT a real privacy primitive.
  let h = 5381;
  const s = `kua_student_${seed}`;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return ('00000000' + ((h >>> 0).toString(16))).slice(-8);
}

// KUA enrollment = 329, of whom 247 board. Supplied directly by the school
// (2026-10-08) and adopted over every published figure, because a roster count
// beats a marketing page and a Wikipedia infobox.
//
// What it replaced, and why the old numbers looked solid: kua.org's about page
// says "340 Unique and kind students" and "76 Percent of students board", and
// the Wikipedia infobox agreed at ~340. Phase 414 verified 340 against both
// and derived 258 boarders from the 76%. Both are published; neither is the
// roster. The actual split is 247/329 = 75.1% boarding — the published
// percentage was close, the headcount was 11 students high.
//
// Day students land at 329 - 247 = 82, which is exactly what the 76% figure
// implied, so that cohort does not move. The change falls entirely on
// boarders. See COHORTS in geographicEstimates.js.
//
// Every per-student figure on the dashboard divides by this number, so update
// it once a year as the actual roster arrives via SIS export.
const TOTAL_ENROLLMENT = 329;

/** @type {StudentProfile[]} */
export const students = Array.from({ length: TOTAL_ENROLLMENT }, (_, i) => ({
  studentIdHash: makeHash(i),
  dormId: dormCycle[i % dormCycle.length],
  grade: /** @type {9|10|11|12} */ ([9, 10, 11, 12][i % 4]),
  optInLeaderboard: i % 3 !== 0,
  carbonPoints: Math.round(((i * 37) % 250) + 10),
  learningLevel: i % 5 === 0 ? 'advanced' : i % 3 === 0 ? 'intermediate' : 'novice',
}));

export const TOTAL_STUDENTS = students.length;

// Re-export dorm registry so callers can join.
export { dorms };
