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

/** @type {StudentProfile[]} */
export const students = Array.from({ length: 600 }, (_, i) => ({
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
