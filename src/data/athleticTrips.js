// Away-game travel from the weekly athletics schedule (Coach Rouillard's
// email, week of 2026-09-28). The first REAL team-travel activity data this
// repo has had: every other transport figure is a model.
//
// WHY THIS IS SCOPE 1, NOT SCOPE 3 — the thing to get right before using it.
// KUA owns its buses and vans (fleetVehicles: 2 diesel 71-passenger buses,
// 2 activity vans, 1 pickup). Fuel burned in a vehicle the school owns is
// DIRECT combustion: Scope 1, and already inside the "Fleet vehicles" line.
// Adding these trips to Scope 3 would double-count them against that line.
//
// Scope 3 would be the right home only for a CHARTERED coach, which is
// someone else's vehicle and someone else's fuel. The schedule does not say
// which trips were chartered, so nothing here is claimed as Scope 3. The
// Wilbraham round trip is the one most likely to have been — it is more than
// twice the next-longest — and it is flagged rather than assumed.
//
// WHAT THE SOURCE ACTUALLY CONTAINS: team, home/away, destination, game time,
// departure and return times. It does NOT contain mileage, vehicle assignment,
// or headcount. Those three are marked accordingly instead of invented — a
// passenger count of "28" copied across eight rows would look like data.
//
// Distances are ESTIMATED road miles from Meriden NH to each school, not
// measured, and each is a round trip. They carry the uncertainty of a map
// lookup, roughly ±10%, which is why nothing downstream treats this as a
// measured fuel figure.

/**
 * @typedef {Object} AthleticTrip
 * @property {string} date          ISO date of the contest
 * @property {string} team
 * @property {string} destination   Host school, as written in the schedule
 * @property {number} roundTripMi   ESTIMATED road miles, both ways
 * @property {string} departure     Local time, from the schedule
 * @property {string} ret           Local time, from the schedule
 * @property {boolean} longHaul     Flagged as plausibly chartered
 */

export const ATHLETIC_TRIPS_SOURCE =
  'KUA athletics schedule, week of 2026-09-28 (Coach Rouillard, emailed 2026-10-08)';

/** Away trips only. Home games generate no school travel. */
export const athleticTrips = [
  { date: '2026-09-30', team: 'Mountain Biking',     destination: 'New Hampton',      roundTripMi: 100, departure: '12:45', ret: '18:15', longHaul: false },
  { date: '2026-09-30', team: 'Cross Country',       destination: 'Brewster',         roundTripMi: 170, departure: '11:30', ret: '20:30', longHaul: false },
  { date: '2026-09-30', team: 'Boys JV2 Soccer',     destination: "St. Paul's School", roundTripMi: 110, departure: '13:00', ret: '18:00', longHaul: false },
  { date: '2026-09-30', team: 'Girls Varsity Soccer', destination: 'Tilton',          roundTripMi: 110, departure: '12:45', ret: '18:15', longHaul: false },
  { date: '2026-10-02', team: 'Boys JV1 Soccer',     destination: 'Vermont Academy',  roundTripMi: 100, departure: '14:30', ret: '19:15', longHaul: false },
  { date: '2026-10-03', team: 'Girls JV Soccer',     destination: 'New Hampton',      roundTripMi: 100, departure: '12:00', ret: '17:00', longHaul: false },
  { date: '2026-10-03', team: 'Varsity Field Hockey', destination: 'Holderness',      roundTripMi: 120, departure: '14:15', ret: '20:00', longHaul: false },
  { date: '2026-10-03', team: 'Boys Varsity Soccer', destination: 'Wilbraham',        roundTripMi: 260, departure: '13:15', ret: '20:30', longHaul: true },
];

/** Home games in the same week — counted so the away share is honest. */
export const HOME_GAMES_THAT_WEEK = 7;

export const ATHLETIC_WEEK_MILES = athleticTrips.reduce((s, t) => s + t.roundTripMi, 0);

/** Distinct contest days in the schedule — Wed, Fri, Sat. */
export const ATHLETIC_WEEK_DAYS = [...new Set(athleticTrips.map((t) => t.date))].length;

export const ATHLETIC_TRIPS_BASIS = {
  source: ATHLETIC_TRIPS_SOURCE,
  scope: 'Scope 1 — KUA-owned buses and vans. Not Scope 3 unless chartered.',
  awayTrips: athleticTrips.length,
  homeGames: HOME_GAMES_THAT_WEEK,
  weekMiles: ATHLETIC_WEEK_MILES,
  milesAreEstimated: true,
  vehicleAssignmentKnown: false,
  passengerCountsKnown: false,
  note:
    'One week of a fall season. Mileage is estimated road distance from Meriden NH, '
    + 'round trip, roughly ±10%. The schedule names no vehicle and no headcount, so '
    + 'neither is modelled here. Used as a cross-check on the fleet annual-mileage '
    + 'assumption, not as a measured fuel figure.',
};
