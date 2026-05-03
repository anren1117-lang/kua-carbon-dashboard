// Privacy-safe staff profiles. staffIdHash is the only identifier the app
// uses. Public dashboards aggregate at department level.

/**
 * @typedef {Object} TeacherStaffProfile
 * @property {string} staffIdHash
 * @property {string} department
 * @property {'teacher'|'staff'|'admin'|'maintenance'} role
 * @property {boolean} optInLeaderboard
 * @property {'solo_drive'|'carpool'|'bus'|'walk'|'bike'|'remote'} commuteMode
 * @property {number} commuteOneWayMiles
 * @property {number} commuteDaysPerWeek
 */

const departments = ['English', 'Math', 'Science', 'History', 'Arts', 'Athletics', 'Languages', 'Operations', 'Admissions', 'Residential Life'];
const modes = /** @type {const} */ (['solo_drive', 'solo_drive', 'solo_drive', 'carpool', 'carpool', 'walk', 'bike', 'remote']);

function makeHash(seed) {
  let h = 5381;
  const s = `kua_staff_${seed}`;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return ('00000000' + ((h >>> 0).toString(16))).slice(-8);
}

// KUA faculty ≈ 52 per the school's "By the Numbers" page (Wikipedia
// agrees). Student-to-teacher ratio 6:1, average class size 11. Update
// once a year as the HR roster comes in.
const TOTAL_FACULTY = 52;

/** @type {TeacherStaffProfile[]} */
export const staff = Array.from({ length: TOTAL_FACULTY }, (_, i) => ({
  staffIdHash: makeHash(i),
  department: departments[i % departments.length],
  role: i % 7 === 0 ? 'admin' : i % 11 === 0 ? 'maintenance' : i % 3 === 0 ? 'staff' : 'teacher',
  optInLeaderboard: i % 4 !== 0,
  commuteMode: modes[i % modes.length],
  commuteOneWayMiles: Math.max(0.5, Math.round(((i * 13) % 22) + 1)),
  commuteDaysPerWeek: i % 5 === 0 ? 4 : 5,
}));

export const TOTAL_STAFF = staff.length;
