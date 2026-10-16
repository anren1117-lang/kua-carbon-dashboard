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
import { adminFetch } from '../utils/adminFetch.js';

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

// The mapping changes after first paint (startup hydration, an admin edit), so
// consumers that memoize per-building rows need to know. Version + listeners
// back the useBmsMeterMap() hook in src/hooks/useBmsMeterMap.js.
let version = 0;
let lastLocalWriteAt = 0;
const listeners = new Set();

function bumpVersion() {
  version += 1;
  for (const fn of listeners) {
    try { fn(version); } catch { /* a bad listener must not break a save */ }
  }
}

export function getBmsMeterMapVersion() {
  return version;
}

export function subscribeBmsMeterMap(fn) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

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
  const startedAt = Date.now();
  try {
    const supabase = await client(injectedClient);
    const { data, error } = await supabase.from(TABLE).select('meter_id, building_id');
    if (error || !Array.isArray(data)) return { ok: false, rows: 0 };
    const fetched = Object.fromEntries(
      data.filter((r) => r?.meter_id && r?.building_id).map((r) => [r.meter_id, r.building_id]),
    );
    // An admin who maps a meter while this fetch is in flight must not watch it
    // snap back: a local write made after the fetch started wins over the rows
    // it couldn't have included.
    sharedMap = lastLocalWriteAt > startedAt ? { ...fetched, ...sharedMap } : fetched;
    sharedLoaded = true;
    bumpVersion();
    return { ok: true, rows: data.length };
  } catch {
    return { ok: false, rows: 0 };
  }
}

// WRITES GO THROUGH THE ADMIN API; READS STAY DIRECT.
//
// These were supabase.from(TABLE).upsert(...) / .delete() using the
// publishable anon key, which only worked because the migration granted
// `anon` insert/update/delete. That key ships in the client bundle, so it
// gave anyone write access to the mapping that decides which buildings show
// measured electricity. Writes now go to /api/admin/bms-meter-map, which
// verifies the admin bearer server-side and connects with the service-role
// key — which is what lets the table be locked to `for select to anon`.
//
// The catch stays silent by design: localStorage remains this browser's
// source of truth, and the table may legitimately be absent (it is unapplied
// on the configured project today — PGRST205). A failed share must not lose
// the admin's edit.
async function shareMapping(meterId, buildingId) {
  try {
    if (buildingId) {
      await adminFetch('/api/admin/bms-meter-map', {
        method: 'PUT',
        body: JSON.stringify({ entries: [{ meterId, buildingId }] }),
      });
    } else {
      await adminFetch('/api/admin/bms-meter-map', {
        method: 'DELETE',
        body: JSON.stringify({ meterId }),
      });
    }
  } catch { /* missing table, offline, or not signed in — localStorage holds it */ }
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
  lastLocalWriteAt = Date.now();
  bumpVersion();
  void shareMapping(meterId, buildingId);
}

export function clearBmsMeterMappings(injectedClient) {
  try { localStorage.removeItem(MAP_KEY); } catch { /* private window */ }
  sharedMap = {};
  bumpVersion();
  (async () => {
    try {
      // Explicit { all: true } rather than a filter that happens to match
      // everything: the endpoint refuses to read a malformed body as
      // "delete the table". This replaced .delete().neq('meter_id','').
      await adminFetch('/api/admin/bms-meter-map', {
        method: 'DELETE',
        body: JSON.stringify({ all: true }),
      });
    } catch { /* missing table, offline, or not signed in */ }
  })();
}

/** Test-only: seed or reset the shared cache without a round-trip. */
export function __setSharedMeterMap(map) {
  sharedMap = map ? { ...map } : {};
  sharedLoaded = Boolean(map);
  bumpVersion();
}

// Reverse lookup: which PM meters belong to a given building?
export function metersForBuilding(buildingId) {
  const map = getBmsMeterMap();
  return Object.entries(map).filter(([, b]) => b === buildingId).map(([m]) => m);
}
