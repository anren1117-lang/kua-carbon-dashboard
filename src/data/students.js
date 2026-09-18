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

const dormCycle = ['d_barrette', 'd_kilton', 'd_chellis', 'd_welch', 'd_dexter', 'd_densmore', 'd_kurth', 'd_baxter', 'd_bryant', 'd_rowe', 'd_mikula'];

function makeHash(seed) {
  // Stable mock hash for development. NOT a real privacy primitive.
  let h = 5381;
  const s = `kua_student_${seed}`;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return ('00000000' + ((h >>> 0).toString(16))).slice(-8);
}

// KUA enrollment = 340. VERIFIED (Phase 414) against both sources this file
// cites: the school's own about page ("340 Unique and kind students live and
// learn at KUA") and the Wikipedia infobox ("approx. 340"). Third-party
// aggregators list 345; the school's own figure wins.
//
// The boarding/day split was wrong. This said "roughly 70% boarding / 30%
// day"; KUA publishes "76 Percent of students board". At 76/24 that is ~258
// boarders and ~82 day students, not 240/100 — see COHORTS in
// geographicEstimates.js, which the correction moved with it.
//
// Every per-student figure on the dashboard divides by this number, so update
// it once a year as the actual roster arrives via SIS export.
const TOTAL_ENROLLMENT = 340;

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
