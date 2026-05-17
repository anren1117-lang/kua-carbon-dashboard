// Approximate lat/lng for each KUA building. These are ESTIMATES,
// not surveyed coordinates — anchored to KUA's Plainfield NH campus
// center (~43.7448, -72.1192) with offsets that roughly match the
// public campus layout: academic core central, athletic complex on
// one edge, dorms scattered.
//
// To replace with real positions:
//   1. Get the actual lat/lng for each building (Facilities Director,
//      Google Maps right-click → coordinates, or a campus surveyor).
//   2. Update the row below — keep the `provenance` field set to
//      'measured' so the map stops labeling it as estimated.
//   3. Build + ship; CampusMap picks the new positions up
//      automatically.
//
// The map's "Geographic" mode renders these positions via a simple
// equirectangular projection (good enough for a campus this size —
// no curvature distortion at <1 km scale). "Schematic" mode ignores
// these and uses the original by-category layout.

const CAMPUS_CENTER = { lat: 43.7448, lng: -72.1192 };

/**
 * @typedef {Object} BuildingPosition
 * @property {string} id
 * @property {number} lat
 * @property {number} lng
 * @property {'estimated'|'measured'} provenance
 */

// Offset helpers — convert metres east/north to lat/lng deltas at
// KUA's latitude. ~111,320 m/° latitude, ~80,300 m/° longitude at 43°N.
const M_PER_LAT = 111_320;
const M_PER_LNG_AT_KUA = 80_300;
function offset(eastM, northM) {
  return {
    lat: CAMPUS_CENTER.lat + northM / M_PER_LAT,
    lng: CAMPUS_CENTER.lng + eastM / M_PER_LNG_AT_KUA,
  };
}

/** @type {BuildingPosition[]} */
export const buildingPositions = [
  // Academic core — central, tight cluster
  { id: 'b_miller',     ...offset(   0,   30), provenance: 'estimated' },
  { id: 'b_fitch',      ...offset(  60,   60), provenance: 'estimated' },
  { id: 'b_flickinger', ...offset( -70,   70), provenance: 'estimated' },

  // Athletic — south/east edge of campus
  { id: 'b_whittemore', ...offset( 180, -120), provenance: 'estimated' },
  { id: 'b_silvergym',  ...offset( 220,  -60), provenance: 'estimated' },
  { id: 'b_barnfield',  ...offset( 260, -180), provenance: 'estimated' },

  // Large dorms — north of the academic core
  { id: 'b_barrette',   ...offset( -50,  170), provenance: 'estimated' },
  { id: 'b_kilton',     ...offset(  30,  200), provenance: 'estimated' },

  // Smaller dorms — scattered around the main quad
  { id: 'b_chellis',    ...offset(-160,  140), provenance: 'estimated' },
  { id: 'b_welch',      ...offset(-180,   80), provenance: 'estimated' },
  { id: 'b_dexter',     ...offset(-130,  220), provenance: 'estimated' },
  { id: 'b_densmore',   ...offset( 100,  140), provenance: 'estimated' },
  { id: 'b_kurth',      ...offset( 150,  190), provenance: 'estimated' },
  { id: 'b_baxter',     ...offset(-220,  -40), provenance: 'estimated' },
  { id: 'b_bryant',     ...offset(-200,  180), provenance: 'estimated' },
  { id: 'b_rowe',       ...offset( 200,  110), provenance: 'estimated' },
  { id: 'b_mikula',     ...offset(   0,  260), provenance: 'estimated' },

  // Other / outer
  { id: 'b_bishop',     ...offset(-100,  -90), provenance: 'estimated' },
  { id: 'b_childcare',  ...offset( 280,   40), provenance: 'estimated' },
];

const positionById = Object.fromEntries(buildingPositions.map((p) => [p.id, p]));

/** Look up a position. Returns null if the building has no coordinates set. */
export function getBuildingPosition(buildingId) {
  return positionById[buildingId] || null;
}

/** Whether every position in the list is still labeled "estimated". */
export function allPositionsAreEstimated() {
  return buildingPositions.every((p) => p.provenance === 'estimated');
}
