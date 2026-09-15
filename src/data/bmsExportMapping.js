// Mapping layer between BMS Power-Meter device IDs (PM_NN_FeedName)
// and the building IDs the dashboard tracks.
//
// The mapping is the bridge that lets every chart in the dashboard
// flip from estimated → measured for buildings whose PM is mapped.
//
// Storage, in precedence order (lowest first):
//   1. DEFAULT_MAPPING   — best-guess defaults shipped in this file
//   2. localStorage      — this browser's own edits; the offline fallback
//   3. bms_meter_map     — the shared table, hydrated once at startup
//
// The shared table wins because the mapping is a fact about the campus, not a
// per-admin preference: what one admin maps, everyone should see. Writes go to
// both, so they agree; when the table is missing or unreachable (no migration
// applied, offline), everything still works from localStorage.
//
// getBmsMeterMap() stays synchronous — it's called inside render paths in
// Buildings, Hotspots, StudentChallenges, Scope2BmsInsights and the export
// adapter — so the shared rows live in a module cache that
// hydrateBmsMeterMap() fills.

const MAP_KEY = 'kua_bms_meter_to_building_map';
const TABLE = 'bms_meter_map';

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

let sharedMap = {};
let sharedLoaded = false;

async function client(injected) {
  if (injected) return injected;
  const mod = await import('../supabaseClient.js');
  return mod.supabase;
}

function readStored() {
  try {
    const raw = localStorage.getItem(MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function getBmsMeterMap() {
  return { ...DEFAULT_MAPPING, ...readStored(), ...sharedMap };
}

/** True once the shared table has answered — used for admin-facing copy. */
export function isBmsMeterMapShared() {
  return sharedLoaded;
}

/**
 * Fill the shared-mapping cache from Supabase. Safe to call on startup: a
 * missing table, an error or an offline client leaves the cache empty and the
 * dashboard on localStorage.
 * @returns {Promise<{ ok: boolean, rows: number }>}
 */
export async function hydrateBmsMeterMap(injectedClient) {
  try {
    const supabase = await client(injectedClient);
    const { data, error } = await supabase.from(TABLE).select('meter_id, building_id');
    if (error || !Array.isArray(data)) return { ok: false, rows: 0 };
    sharedMap = Object.fromEntries(
      data.filter((r) => r?.meter_id && r?.building_id).map((r) => [r.meter_id, r.building_id]),
    );
    sharedLoaded = true;
    return { ok: true, rows: data.length };
  } catch {
    return { ok: false, rows: 0 };
  }
}

async function shareMapping(meterId, buildingId, injectedClient) {
  try {
    const supabase = await client(injectedClient);
    if (buildingId) {
      await supabase.from(TABLE).upsert({ meter_id: meterId, building_id: buildingId, updated_at: new Date().toISOString() });
    } else {
      await supabase.from(TABLE).delete().eq('meter_id', meterId);
    }
  } catch { /* table missing or offline — the localStorage copy still holds it */ }
}

export function setBmsMeterMapping(meterId, buildingId, injectedClient) {
  const current = readStored();
  if (!buildingId) delete current[meterId];
  else current[meterId] = buildingId;
  try { localStorage.setItem(MAP_KEY, JSON.stringify(current)); } catch { /* private window */ }

  // Keep the shared cache in step immediately so the UI doesn't wait on the
  // round-trip, then share it.
  const nextShared = { ...sharedMap };
  if (buildingId) nextShared[meterId] = buildingId;
  else delete nextShared[meterId];
  sharedMap = nextShared;
  void shareMapping(meterId, buildingId, injectedClient);
}

export function clearBmsMeterMappings(injectedClient) {
  try { localStorage.removeItem(MAP_KEY); } catch { /* private window */ }
  sharedMap = {};
  (async () => {
    try {
      const supabase = await client(injectedClient);
      await supabase.from(TABLE).delete().neq('meter_id', '');
    } catch { /* table missing or offline */ }
  })();
}

/** Test-only: seed or reset the shared cache without a round-trip. */
export function __setSharedMeterMap(map) {
  sharedMap = map ? { ...map } : {};
  sharedLoaded = Boolean(map);
}

// Reverse lookup: which PM meters belong to a given building?
export function metersForBuilding(buildingId) {
  const map = getBmsMeterMap();
  return Object.entries(map).filter(([, b]) => b === buildingId).map(([m]) => m);
}
