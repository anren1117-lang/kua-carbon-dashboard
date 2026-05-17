// Building positions for each KUA building, derived from the
// official KUA campus map (the hand-illustrated bird's-eye view
// distributed by Admissions / Facilities). The numbered buildings
// on that map use the same numbers as our `bmsNumber` field, so
// the mapping is unambiguous.
//
// Provenance is 'cited' — the source is a published official KUA
// map, not surveyor-grade GPS. For each building we eyeballed the
// (x%, y%) center of its footprint on the official map and converted
// to lat/lng using the campus center as anchor + ~600m map width
// (the visible inhabited area on the map spans roughly 500–700m
// east–west, plus athletic fields extending farther). Good enough
// for the /campus-map "Geographic" mode to show real relative
// positions; not good enough for routing or surveyor work.
//
// To upgrade to surveyor-grade ('measured'):
//   1. Get real lat/lng for each building (Facilities, Google Maps
//      right-click → coordinates, GPS walk).
//   2. Replace the row's `xPct` / `yPct` with `lat:` / `lng:` literals
//      and flip the `provenance` to 'measured'.
//   3. Drop the converter at the bottom — the buildingPositions list
//      can ship pure lat/lng once everything is real.

const CAMPUS_CENTER = { lat: 43.7426, lng: -72.2502 };

// Map coverage assumed by the (x%, y%) eyeball coords. The official
// map's inhabited core fits in about 600m east–west; we let the
// y-span be similar so 1% x ≈ 1% y in real-world metres and the
// aspect ratio reads naturally.
const MAP_EAST_WEST_METRES = 600;
const MAP_NORTH_SOUTH_METRES = 600;
const M_PER_LAT = 111_320;
const M_PER_LNG_AT_KUA = 80_300;

// (x%, y%) coordinates eyeballed off the official KUA campus map.
//   x: 0 = left edge of map's inhabited area, 100 = right edge
//   y: 0 = top of map (roughly north), 100 = bottom (roughly south)
// (50%, 50%) is treated as the campus center anchor.
const POSITIONS_PCT = [
  // Academic core (numbered 5–9 on the official map)
  { id: 'b_miller',     num:  5, name: 'Miller Bicentennial', xPct: 55, yPct: 84 },
  { id: 'b_fitch',      num:  7, name: 'Fitch',               xPct: 49, yPct: 75 },
  { id: 'b_flickinger', num:  8, name: 'Flickinger Arts',     xPct: 35, yPct: 70 },
  { id: 'b_barrette',   num:  9, name: 'Barrette / Doe',      xPct: 40, yPct: 71 },

  // Athletic (10, 11, 12)
  { id: 'b_barnfield',  num: 10, name: 'Barn Field House',    xPct: 30, yPct: 60 },
  { id: 'b_whittemore', num: 11, name: 'Whittemore',          xPct: 38, yPct: 60 },
  { id: 'b_silvergym',  num: 12, name: 'Alumni Silver Gym',   xPct: 60, yPct: 93 },

  // Student residential (13–18, 21–23)
  { id: 'b_densmore',   num: 13, name: 'Densmore Hall',       xPct: 22, yPct: 80 },
  { id: 'b_bryant',     num: 14, name: 'Bryant Hall',         xPct: 31, yPct: 80 },
  { id: 'b_dexter',     num: 15, name: 'Dexter-Richards',     xPct: 41, yPct: 90 },
  { id: 'b_rowe',       num: 16, name: 'Rowe Hall',           xPct: 53, yPct: 90 },
  { id: 'b_welch',      num: 17, name: 'Welch House',         xPct: 55, yPct: 70 },
  { id: 'b_kilton',     num: 18, name: 'Kilton Hall',         xPct: 67, yPct: 68 },
  { id: 'b_kurth',      num: 21, name: 'Kurth Dorm',          xPct: 64, yPct: 65 },
  { id: 'b_chellis',    num: 22, name: 'Chellis Hall',        xPct: 33, yPct: 80 },
  { id: 'b_mikula',     num: 23, name: 'Mikula Hall',         xPct: 56, yPct: 70 },

  // Administration / other (1, 3, 25)
  { id: 'b_baxter',     num:  1, name: 'Baxter',              xPct: 49, yPct: 84 },
  { id: 'b_bishop',     num:  3, name: 'Bishop-Brooks',       xPct: 47, yPct: 81 },
  { id: 'b_childcare',  num: 25, name: 'Child Care Center',   xPct: 54, yPct: 90 },
];

function pctToLatLng({ xPct, yPct }) {
  // x: 50% = center; <50 west, >50 east
  // y: 50% = center; <50 north (up), >50 south (down)
  const eastM  = ((xPct - 50) / 100) * MAP_EAST_WEST_METRES;
  const northM = ((50 - yPct) / 100) * MAP_NORTH_SOUTH_METRES;
  return {
    lat: CAMPUS_CENTER.lat + northM / M_PER_LAT,
    lng: CAMPUS_CENTER.lng + eastM  / M_PER_LNG_AT_KUA,
  };
}

/**
 * @typedef {Object} BuildingPosition
 * @property {string} id
 * @property {number} lat
 * @property {number} lng
 * @property {'estimated'|'cited'|'measured'} provenance
 */

/** @type {BuildingPosition[]} */
export const buildingPositions = POSITIONS_PCT.map((p) => ({
  id: p.id,
  ...pctToLatLng(p),
  provenance: 'cited',
}));

const positionById = Object.fromEntries(buildingPositions.map((p) => [p.id, p]));

/** Look up a position. Returns null if the building has no coordinates set. */
export function getBuildingPosition(buildingId) {
  return positionById[buildingId] || null;
}

/** Whether every position in the list is still labeled "estimated". */
export function allPositionsAreEstimated() {
  return buildingPositions.every((p) => p.provenance === 'estimated');
}

/** Whether every position is at least cited (i.e. better than estimated). */
export function allPositionsAreCitedOrBetter() {
  return buildingPositions.every((p) => p.provenance === 'cited' || p.provenance === 'measured');
}
