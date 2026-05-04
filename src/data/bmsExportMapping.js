// Mapping layer between BMS Power-Meter device IDs (PM_NN_FeedName)
// and the building IDs the dashboard tracks. Persisted to localStorage
// so the admin can correct it without a code change.
//
// The mapping is the bridge that lets every chart in the dashboard
// flip from estimated → measured for buildings whose PM is mapped.

const MAP_KEY = 'kua_bms_meter_to_building_map';

// Best-guess defaults from the meter device names. These ship as the
// initial mapping but the admin can override any row from the BMS
// Export admin page.
export const DEFAULT_MAPPING = {
  // PM master/main feeds — without an authoritative key from KUA Facilities
  // we leave these unmapped and let the admin assign. Educated guesses
  // could mislead. The names below are filled in for the obvious matches.
  'PM_10_ChildCareMainFeed':       'b_childcare',
  'PM_17_BarnFieldhouseFeed':      'b_barnfield',
  'PM_18_KurthResidenceMainFeed':  'b_kurth',
  'PM_19_KurthDormMainFeed':       'b_kurth',
};

export function getBmsMeterMap() {
  try {
    const raw = localStorage.getItem(MAP_KEY);
    if (!raw) return { ...DEFAULT_MAPPING };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_MAPPING, ...parsed };
  } catch { return { ...DEFAULT_MAPPING }; }
}

export function setBmsMeterMapping(meterId, buildingId) {
  const current = (() => {
    try { return JSON.parse(localStorage.getItem(MAP_KEY) || '{}'); }
    catch { return {}; }
  })();
  if (!buildingId) {
    delete current[meterId];
  } else {
    current[meterId] = buildingId;
  }
  localStorage.setItem(MAP_KEY, JSON.stringify(current));
}

export function clearBmsMeterMappings() {
  localStorage.removeItem(MAP_KEY);
}

// Reverse lookup: which PM meters belong to a given building?
export function metersForBuilding(buildingId) {
  const map = getBmsMeterMap();
  return Object.entries(map).filter(([, b]) => b === buildingId).map(([m]) => m);
}
