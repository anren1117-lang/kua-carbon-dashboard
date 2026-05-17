// @vitest-environment jsdom
//
// Unit tests for the asset-inventory override layer — the localStorage
// edits/removed/added wrappers around the hardcoded seed arrays
// (buildings, meters, forestStands, soilSamples, solarSites). Powers
// AdminFacilities + the admin-side edits across BMS export, sinks,
// renewables. The provenance tagging is the contract that drives the
// UI's "seeded / overridden / decommissioned / user-added" pills.
//
// Past production bug the source guards against: an admin could
// previously add a record with the same id as a seeded record, and
// getEffectiveX returned both — duplicate React keys, conflicting
// rows. addRecord now throws on that collision.

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getEffectiveBuildings, getInventoryView,
  addRecord, editRecord, removeRecord,
  recommissionRecord, revertEdit, resetInventory,
} from '../data/assetInventory.js';
import { buildings as seedBuildings } from '../data/buildings.js';

const SEED_ID = seedBuildings[0].id; // a real seeded id, used by collision tests
const KIND = 'buildings';

beforeEach(() => { localStorage.clear(); });

describe('getEffectiveBuildings — seed baseline', () => {
  it('returns exactly the seed list when no overrides exist', () => {
    const out = getEffectiveBuildings();
    expect(out).toHaveLength(seedBuildings.length);
    expect(out.every((r) => r._provenance === 'seeded')).toBe(true);
  });
});

describe('editRecord on a seeded record', () => {
  it('layers a patch over the seed and tags it as overridden', () => {
    editRecord(KIND, SEED_ID, { name: 'Renamed' });
    const row = getEffectiveBuildings().find((r) => r.id === SEED_ID);
    expect(row.name).toBe('Renamed');
    expect(row._provenance).toBe('overridden');
    expect(row._editedAt).toBeDefined();
  });

  it('merges successive edits rather than replacing wholesale', () => {
    editRecord(KIND, SEED_ID, { name: 'First edit' });
    editRecord(KIND, SEED_ID, { occupants: 999 });
    const row = getEffectiveBuildings().find((r) => r.id === SEED_ID);
    expect(row.name).toBe('First edit');
    expect(row.occupants).toBe(999);
  });

  it('is a no-op for an id that is neither seeded nor added', () => {
    expect(() => editRecord(KIND, 'b_ghost', { name: 'noop' })).not.toThrow();
    expect(getEffectiveBuildings().find((r) => r.id === 'b_ghost')).toBeUndefined();
  });
});

describe('addRecord', () => {
  it('appends a user-added record with the user-added provenance + _addedAt timestamp', () => {
    addRecord(KIND, { id: 'b_my_new', name: 'My Hall', category: 'Academic' });
    const row = getEffectiveBuildings().find((r) => r.id === 'b_my_new');
    expect(row).toMatchObject({ id: 'b_my_new', name: 'My Hall', _provenance: 'user-added' });
    expect(row._addedAt).toBeDefined();
  });

  it('throws when the new id collides with a seeded record (regression)', () => {
    expect(() => addRecord(KIND, { id: SEED_ID, name: 'Forged' }))
      .toThrow(/already exists as a seeded buildings record/);
  });

  it('dedupes within the added list — re-adding the same id replaces', () => {
    addRecord(KIND, { id: 'b_my_new', name: 'first' });
    addRecord(KIND, { id: 'b_my_new', name: 'second' });
    const matches = getEffectiveBuildings().filter((r) => r.id === 'b_my_new');
    expect(matches).toHaveLength(1);
    expect(matches[0].name).toBe('second');
  });
});

describe('removeRecord + recommissionRecord', () => {
  it('hides a seeded record from getEffective and the toggle restores it', () => {
    removeRecord(KIND, SEED_ID);
    expect(getEffectiveBuildings().find((r) => r.id === SEED_ID)).toBeUndefined();

    recommissionRecord(KIND, SEED_ID);
    expect(getEffectiveBuildings().find((r) => r.id === SEED_ID)).toBeDefined();
  });

  it('removing a seeded id twice is idempotent', () => {
    removeRecord(KIND, SEED_ID);
    removeRecord(KIND, SEED_ID);
    const view = getInventoryView(KIND);
    expect(view.counts.decommissioned).toBe(1);
  });

  it('removing a user-added record deletes it outright (no decommissioned tombstone)', () => {
    addRecord(KIND, { id: 'b_my_new', name: 'My' });
    removeRecord(KIND, 'b_my_new');
    expect(getEffectiveBuildings().find((r) => r.id === 'b_my_new')).toBeUndefined();
    // And it's not in the inventory view as a decommissioned row either.
    expect(getInventoryView(KIND).rows.find((r) => r.id === 'b_my_new')).toBeUndefined();
  });
});

describe('getInventoryView — counts', () => {
  it('decommissioned wins over overridden for the same id (no double-counting)', () => {
    editRecord(KIND, SEED_ID, { name: 'edited' });
    removeRecord(KIND, SEED_ID);
    const view = getInventoryView(KIND);
    // The row is rendered as decommissioned; not double-counted.
    expect(view.counts.decommissioned).toBe(1);
    expect(view.counts.overridden).toBe(0);
    const row = view.rows.find((r) => r.id === SEED_ID);
    expect(row._provenance).toBe('decommissioned');
  });

  it('seeded count = seeds − decommissioned − overridden', () => {
    editRecord(KIND, SEED_ID, { name: 'edit' });
    const view = getInventoryView(KIND);
    expect(view.counts.seeded).toBe(seedBuildings.length - 1);
    expect(view.counts.overridden).toBe(1);
  });

  it('throws on an unknown inventory kind', () => {
    expect(() => getInventoryView('not-a-kind')).toThrow(/unknown inventory kind/);
  });
});

describe('revertEdit', () => {
  it('removes the patch so the seed re-emerges with seeded provenance', () => {
    editRecord(KIND, SEED_ID, { name: 'edited' });
    expect(getEffectiveBuildings().find((r) => r.id === SEED_ID).name).toBe('edited');

    revertEdit(KIND, SEED_ID);
    const row = getEffectiveBuildings().find((r) => r.id === SEED_ID);
    expect(row._provenance).toBe('seeded');
    expect(row.name).toBe(seedBuildings[0].name);
  });

  it('is a no-op when there is no edit to revert', () => {
    expect(() => revertEdit(KIND, SEED_ID)).not.toThrow();
  });
});

describe('resetInventory', () => {
  it('clears edits, removes, and added in one call', () => {
    editRecord(KIND, SEED_ID, { name: 'x' });
    removeRecord(KIND, seedBuildings[1].id);
    addRecord(KIND, { id: 'b_my_new', name: 'My' });

    resetInventory(KIND);

    const out = getEffectiveBuildings();
    expect(out).toHaveLength(seedBuildings.length);
    expect(out.every((r) => r._provenance === 'seeded')).toBe(true);
  });
});
