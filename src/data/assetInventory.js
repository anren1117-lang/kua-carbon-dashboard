// Asset inventory override layer.
//
// Every consumer of physical-asset data (buildings, meters, forest
// stands, soil samples, solar arrays) currently imports a hardcoded
// array. The admin portal needs to add / remove / edit those without
// a code change.
//
// This module wraps each seed array with three layers:
//   - the seed (read-only export from the original data file)
//   - per-record edits keyed by id (localStorage)
//   - decommissioned ids (localStorage)
//   - user-added records (localStorage)
//
// `getEffectiveX()` merges the layers and returns the final array
// the dashboard should render. Components opt in by replacing
// `import { buildings } from './buildings'` with
// `import { getEffectiveBuildings } from './assetInventory'`.
//
// Persistence is currently localStorage so changes are local to the
// admin's browser. The same shape maps cleanly to Supabase tables
// (one row per record + one row per override) when the backend
// integration ships.

import { buildings as seedBuildings } from './buildings.js';
import { meters as seedMeters } from './meters.js';
import { forestStands as seedForestStands, soilSamples as seedSoilSamples } from './sinks.js';
import { solarSites as seedSolarSites } from './renewables.js';

const KEYS = {
  buildings:    { edits: 'kua_inv_buildings_edits',    removed: 'kua_inv_buildings_removed',    added: 'kua_inv_buildings_added' },
  meters:       { edits: 'kua_inv_meters_edits',       removed: 'kua_inv_meters_removed',       added: 'kua_inv_meters_added' },
  forestStands: { edits: 'kua_inv_forestStands_edits', removed: 'kua_inv_forestStands_removed', added: 'kua_inv_forestStands_added' },
  soilSamples:  { edits: 'kua_inv_soilSamples_edits',  removed: 'kua_inv_soilSamples_removed',  added: 'kua_inv_soilSamples_added' },
  solarSites:   { edits: 'kua_inv_solarSites_edits',   removed: 'kua_inv_solarSites_removed',   added: 'kua_inv_solarSites_added' },
};

function loadJson(key, fallback) {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch { return fallback; }
}

function saveJson(key, value) {
  if (typeof localStorage === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function mergeSeeds(seeds, kind) {
  const k = KEYS[kind];
  const edits   = loadJson(k.edits, {});       // { [id]: partialPatch }
  const removed = new Set(loadJson(k.removed, []));
  const added   = loadJson(k.added, []);       // [ fullRecord, ... ]

  return [
    ...seeds
      .filter((rec) => !removed.has(rec.id))
      .map((rec) => {
        const patch = edits[rec.id];
        if (!patch) return { ...rec, _provenance: 'seeded' };
        return { ...rec, ...patch, _provenance: 'overridden' };
      }),
    ...added.map((rec) => ({ ...rec, _provenance: 'user-added' })),
  ];
}

export const getEffectiveBuildings    = () => mergeSeeds(seedBuildings,    'buildings');
export const getEffectiveMeters       = () => mergeSeeds(seedMeters,       'meters');
export const getEffectiveForestStands = () => mergeSeeds(seedForestStands, 'forestStands');
export const getEffectiveSoilSamples  = () => mergeSeeds(seedSoilSamples,  'soilSamples');
export const getEffectiveSolarSites   = () => mergeSeeds(seedSolarSites,   'solarSites');

// Decommissioned ids + edits aren't filtered out of the read above
// when you want to render them with a "decommissioned" badge in the
// admin UI. This helper returns the full picture for the editor.
export function getInventoryView(kind) {
  const seeds = ({ buildings: seedBuildings, meters: seedMeters, forestStands: seedForestStands, soilSamples: seedSoilSamples, solarSites: seedSolarSites })[kind];
  if (!seeds) throw new Error(`unknown inventory kind: ${kind}`);
  const k = KEYS[kind];
  const edits   = loadJson(k.edits, {});
  const removed = new Set(loadJson(k.removed, []));
  const added   = loadJson(k.added, []);
  // Counts must match the rendered rows exactly: a record that's BOTH
  // removed and edited is shown as "decommissioned" (the removed
  // branch wins above), so it should only be counted as decommissioned
  // — not double-counted as "overridden". Same for seeded: only count
  // records that are neither removed nor edited.
  const decommissionedCount = seeds.filter((r) => removed.has(r.id)).length;
  const overriddenCount     = seeds.filter((r) => !removed.has(r.id) && edits[r.id]).length;
  const seededCount         = seeds.length - decommissionedCount - overriddenCount;
  return {
    rows: [
      ...seeds.map((rec) => {
        if (removed.has(rec.id)) return { ...rec, _provenance: 'decommissioned' };
        const patch = edits[rec.id];
        if (patch) return { ...rec, ...patch, _provenance: 'overridden' };
        return { ...rec, _provenance: 'seeded' };
      }),
      ...added.map((rec) => ({ ...rec, _provenance: 'user-added' })),
    ],
    counts: {
      seeded: seededCount,
      overridden: overriddenCount,
      decommissioned: decommissionedCount,
      added: added.length,
    },
  };
}

// Mutators — all idempotent, all writing back to localStorage.

export function addRecord(kind, record) {
  const k = KEYS[kind];
  const added = loadJson(k.added, []);
  // Dedupe by id; replace if same id submitted twice.
  const filtered = added.filter((r) => r.id !== record.id);
  filtered.push({ ...record, _addedAt: new Date().toISOString() });
  saveJson(k.added, filtered);
}

export function editRecord(kind, id, patch) {
  const k = KEYS[kind];
  // If editing a seeded record, write to edits map.
  // If editing a user-added record, mutate it in place in the added list.
  const seeds = ({ buildings: seedBuildings, meters: seedMeters, forestStands: seedForestStands, soilSamples: seedSoilSamples, solarSites: seedSolarSites })[kind];
  const isSeeded = seeds.some((r) => r.id === id);
  if (isSeeded) {
    const edits = loadJson(k.edits, {});
    edits[id] = { ...(edits[id] || {}), ...patch, _editedAt: new Date().toISOString() };
    saveJson(k.edits, edits);
  } else {
    const added = loadJson(k.added, []);
    const idx = added.findIndex((r) => r.id === id);
    if (idx >= 0) {
      added[idx] = { ...added[idx], ...patch, _editedAt: new Date().toISOString() };
      saveJson(k.added, added);
    }
  }
}

export function removeRecord(kind, id) {
  const k = KEYS[kind];
  const seeds = ({ buildings: seedBuildings, meters: seedMeters, forestStands: seedForestStands, soilSamples: seedSoilSamples, solarSites: seedSolarSites })[kind];
  const isSeeded = seeds.some((r) => r.id === id);
  if (isSeeded) {
    const removed = loadJson(k.removed, []);
    if (!removed.includes(id)) removed.push(id);
    saveJson(k.removed, removed);
  } else {
    const added = loadJson(k.added, []);
    saveJson(k.added, added.filter((r) => r.id !== id));
  }
}

export function recommissionRecord(kind, id) {
  const k = KEYS[kind];
  const removed = loadJson(k.removed, []);
  saveJson(k.removed, removed.filter((rid) => rid !== id));
}

export function revertEdit(kind, id) {
  const k = KEYS[kind];
  const edits = loadJson(k.edits, {});
  if (edits[id]) {
    delete edits[id];
    saveJson(k.edits, edits);
  }
}

export function resetInventory(kind) {
  const k = KEYS[kind];
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(k.edits);
    localStorage.removeItem(k.removed);
    localStorage.removeItem(k.added);
  } catch {}
}

// Field schemas — drives the auto-generated edit form. Order is render
// order; type controls input element. Required fields can't be blank.
export const SCHEMAS = {
  buildings: [
    { key: 'id',                label: 'ID',                  type: 'text',   required: true,  hint: 'Stable id, e.g. b_miller. Must be unique. Cannot change after add.' },
    { key: 'name',              label: 'Name',                type: 'text',   required: true },
    { key: 'category',          label: 'Category',            type: 'select', required: true,  options: ['Academic', 'Athletic', 'Dorm', 'Dining', 'Other'] },
    { key: 'bmsNumber',         label: 'BMS number',          type: 'number', hint: 'Distech Eclypse BMS building number (digits on the campus map). Optional.' },
    { key: 'sqft',              label: 'Square feet',         type: 'number' },
    { key: 'occupants',         label: 'Daily occupants',     type: 'number' },
    { key: 'dormPopulation',    label: 'Dorm population',     type: 'number', hint: '0 if not a dorm.' },
    { key: 'setpointHeatingF',  label: 'Heating setpoint °F', type: 'number' },
    { key: 'setpointCoolingF',  label: 'Cooling setpoint °F', type: 'number' },
    { key: 'hvacSchedule',      label: 'HVAC schedule',       type: 'text',   hint: 'Free-form, e.g. "7 AM – 9 PM weekdays".' },
  ],
  meters: [
    { key: 'id',                label: 'ID',                       type: 'text',   required: true },
    { key: 'name',              label: 'Name',                     type: 'text',   required: true },
    { key: 'buildingId',        label: 'Building ID',              type: 'text',   required: true,  hint: 'Must match an existing building id.' },
    { key: 'type',              label: 'Type',                     type: 'select', required: true,  options: ['electricity', 'gas', 'water', 'steam', 'solar'] },
    { key: 'unit',              label: 'Unit',                     type: 'text',   hint: 'kWh / therm / gallon / lb_steam / m³' },
    { key: 'provider',          label: 'Provider',                 type: 'text',   hint: 'Envysion / Liberty Utilities / KUA Facilities / etc.' },
    { key: 'annualBaselineValue', label: 'Annual baseline',        type: 'number', hint: 'For mock generator + sanity checks.' },
    { key: 'intervalMinutes',   label: 'Interval (min)',           type: 'select', options: [15, 30, 60, 1440] },
  ],
  forestStands: [
    { key: 'id',                label: 'ID',                       type: 'text',   required: true },
    { key: 'name',              label: 'Name',                     type: 'text',   required: true },
    { key: 'acres',             label: 'Acres',                    type: 'number', required: true },
    { key: 'type',              label: 'Type',                     type: 'select', required: true,  options: ['mixed_hardwood', 'softwood', 'transitional', 'open_grown'] },
    { key: 'ageClass',          label: 'Age class',                type: 'select', required: true,  options: ['young', 'intermediate', 'mature', 'old_growth'] },
    { key: 'mtco2eAcreYr',      label: 'mtCO₂e / acre / yr',       type: 'number', required: true,  hint: 'Sequestration rate from IPCC LULUCF (Birdsey 1992, Nowak 2013).' },
    { key: 'dominantSpecies',   label: 'Dominant species',         type: 'text' },
  ],
  soilSamples: [
    { key: 'id',                label: 'ID',                       type: 'text',   required: true },
    { key: 'standId',           label: 'Stand ID',                 type: 'text',   required: true,  hint: 'Must match an existing forest stand id.' },
    { key: 'sampledAt',         label: 'Sampled date',             type: 'date',   required: true },
    { key: 'depthCm',           label: 'Depth (cm)',               type: 'number', required: true },
    { key: 'percentOrganicC',   label: '% organic C',              type: 'number', required: true },
  ],
  solarSites: [
    { key: 'id',                label: 'ID',                       type: 'text',   required: true },
    { key: 'name',              label: 'Name',                     type: 'text',   required: true },
    { key: 'buildingId',        label: 'Building ID',              type: 'text',   required: true,  hint: 'Building the array is mounted on.' },
    { key: 'capacityKwDc',      label: 'Capacity (kW DC)',         type: 'number', required: true },
    { key: 'commissionedYear',  label: 'Commissioned year',        type: 'number', required: true },
    { key: 'provider',          label: 'Inverter brand',           type: 'text' },
    { key: 'status',            label: 'Status',                   type: 'select', required: true,  options: ['operational', 'planned', 'feasibility'] },
  ],
};

export const KIND_LABELS = {
  buildings:    'Buildings',
  meters:       'Meters & hardware',
  forestStands: 'Forest stands',
  soilSamples:  'Soil samples',
  solarSites:   'Solar arrays',
};
