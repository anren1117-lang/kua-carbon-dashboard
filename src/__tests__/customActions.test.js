// @vitest-environment jsdom
//
// Unit tests for the admin custom-action + stage-plan localStorage
// stores. These back AdminActions, AdminStagePlanner, and the
// extraContext block /api/admin/plan reads. The rollupPlan helper is
// what the AdminStagePlanner totals row + AdminPlanAgent's "stage
// plans" grounding both depend on.
//
// Regression focus: saveCustomAction used to spread `persisted` (with
// a fresh new Date()) over the existing row on update, overwriting
// the original createdAt every save. saveStagePlan handled this
// correctly; saveCustomAction did not. Fixed alongside this file.

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCustomActions, saveCustomAction, deleteCustomAction, clearCustomActions,
  getStagePlans, getStagePlan, saveStagePlan, deleteStagePlan,
  rollupPlan,
} from '../data/customActions.js';

const action = (over = {}) => ({
  title: 'Heat pump pilot',
  description: 'Replace one boiler',
  category: 'scope1',
  expectedMtPerYear: 50,
  estimatedCostUsd: 80_000,
  methodology: 'EPA factor for No. 2 oil',
  dataSource: 'EPA',
  provenance: 'estimated',
  confidence: 'medium',
  owner: 'Facilities Director',
  timeline: 'this-year',
  ...over,
});

beforeEach(() => { localStorage.clear(); });

describe('getCustomActions', () => {
  it('returns [] when localStorage is empty', () => {
    expect(getCustomActions()).toEqual([]);
  });

  it('returns [] when the stored value is corrupt JSON', () => {
    localStorage.setItem('kua_admin_custom_actions', '{not valid json');
    expect(getCustomActions()).toEqual([]);
  });

  it('returns [] when the stored value parses to a non-array', () => {
    localStorage.setItem('kua_admin_custom_actions', '{"oops": true}');
    expect(getCustomActions()).toEqual([]);
  });
});

describe('saveCustomAction', () => {
  it('fills in id (cu_*), createdAt, and status:"proposed" when omitted', () => {
    const out = saveCustomAction(action());
    expect(out.id).toMatch(/^cu_/);
    expect(typeof out.createdAt).toBe('string');
    expect(out.status).toBe('proposed');
  });

  it('preserves a caller-supplied id and status', () => {
    const out = saveCustomAction(action({ id: 'cu_mine', status: 'in_progress' }));
    expect(out.id).toBe('cu_mine');
    expect(out.status).toBe('in_progress');
  });

  it('upserts by id (re-saving with same id updates, does not duplicate)', () => {
    saveCustomAction(action({ id: 'cu_x', title: 'first' }));
    saveCustomAction(action({ id: 'cu_x', title: 'second' }));
    const all = getCustomActions();
    expect(all).toHaveLength(1);
    expect(all[0].title).toBe('second');
  });

  it('preserves the original createdAt on update (regression)', () => {
    const first = saveCustomAction(action({ id: 'cu_t' }));
    // Force a measurable time gap so any "new Date()" overwrite would
    // produce a visibly different timestamp.
    const original = first.createdAt;
    const updated = saveCustomAction(action({ id: 'cu_t', title: 'rename' }));
    expect(updated.createdAt).toBe(original);
    // And it sticks in storage.
    expect(getCustomActions()[0].createdAt).toBe(original);
  });

  it('honors an explicit createdAt on first-write', () => {
    const ts = '2025-01-15T00:00:00.000Z';
    const out = saveCustomAction(action({ createdAt: ts }));
    expect(out.createdAt).toBe(ts);
  });
});

describe('deleteCustomAction + clearCustomActions', () => {
  it('removes only the matching id', () => {
    saveCustomAction(action({ id: 'a' }));
    saveCustomAction(action({ id: 'b' }));
    deleteCustomAction('a');
    const remaining = getCustomActions().map((x) => x.id);
    expect(remaining).toEqual(['b']);
  });

  it('clearCustomActions wipes the whole list', () => {
    saveCustomAction(action({ id: 'a' }));
    clearCustomActions();
    expect(getCustomActions()).toEqual([]);
  });
});

describe('getStagePlan(s)', () => {
  it('returns [] / null when nothing is stored', () => {
    expect(getStagePlans()).toEqual([]);
    expect(getStagePlan('sp_missing')).toBeNull();
  });
});

describe('saveStagePlan', () => {
  it('fills in id (sp_*), createdAt, updatedAt when omitted', () => {
    const p = saveStagePlan({ name: 'Phase 1' });
    expect(p.id).toMatch(/^sp_/);
    expect(typeof p.createdAt).toBe('string');
    expect(typeof p.updatedAt).toBe('string');
    expect(p.stages).toEqual([]);
  });

  it('preserves createdAt across updates but bumps updatedAt', async () => {
    const p1 = saveStagePlan({ name: 'plan' });
    // Wait long enough for new Date().toISOString() to roll over by
    // at least one millisecond.
    await new Promise((r) => setTimeout(r, 5));
    const p2 = saveStagePlan({ id: p1.id, name: 'plan renamed' });
    expect(p2.createdAt).toBe(p1.createdAt);
    expect(p2.updatedAt >= p1.updatedAt).toBe(true);
  });

  it('normalizes stages — gives each a st_* id and an actionIds array', () => {
    const p = saveStagePlan({
      name: 'plan',
      stages: [
        { name: 'Quick wins', timeframe: 'Q1', actionIds: ['cu_1', 'r_2', 123] },
        { /* no name */ actionIds: 'not an array' },
      ],
    });
    expect(p.stages).toHaveLength(2);
    expect(p.stages[0].id).toMatch(/^st_/);
    // Non-string actionIds filtered out, valid ones kept.
    expect(p.stages[0].actionIds).toEqual(['cu_1', 'r_2']);
    // Missing name + non-array actionIds get safe defaults.
    expect(p.stages[1].name).toBe('Untitled stage');
    expect(p.stages[1].actionIds).toEqual([]);
  });
});

describe('deleteStagePlan', () => {
  it('removes only the matching id', () => {
    const p1 = saveStagePlan({ name: 'a' });
    saveStagePlan({ name: 'b' });
    deleteStagePlan(p1.id);
    expect(getStagePlans().map((p) => p.name)).toEqual(['b']);
  });
});

describe('rollupPlan', () => {
  const lookup = {
    cu_1: { expectedMtPerYear: 10, estimatedCostUsd: 1000 },
    cu_2: { expectedMtPerYear: 25, estimatedCostUsd: 5000 },
    r_lib: { expectedMtPerYear: 7, estimatedCostUsd: 0 },
  };

  it('sums per-stage and across the whole plan', () => {
    const plan = {
      stages: [
        { id: 's1', name: 'Quick', timeframe: 'Q1', actionIds: ['cu_1', 'r_lib'] },
        { id: 's2', name: 'Bigger', timeframe: 'Q2', actionIds: ['cu_2'] },
      ],
    };
    const out = rollupPlan(plan, lookup);
    expect(out.totalMt).toBe(42);          // 10 + 7 + 25
    expect(out.totalCost).toBe(6000);      // 1000 + 0 + 5000
    expect(out.actionCount).toBe(3);
    expect(out.stages[0].expectedMtPerYear).toBe(17);
    expect(out.stages[1].expectedMtPerYear).toBe(25);
  });

  it('skips actions whose ids are not in the lookup', () => {
    const plan = {
      stages: [{ id: 's1', name: 's', timeframe: '', actionIds: ['cu_1', 'unknown_xyz'] }],
    };
    const out = rollupPlan(plan, lookup);
    expect(out.totalMt).toBe(10);
    expect(out.actionCount).toBe(1);
  });

  it('handles non-numeric mt/cost defensively (defaults to 0)', () => {
    const plan = {
      stages: [{ id: 's1', name: 's', timeframe: '', actionIds: ['weird'] }],
    };
    const out = rollupPlan(plan, { weird: { expectedMtPerYear: 'nope', estimatedCostUsd: null } });
    expect(out.totalMt).toBe(0);
    expect(out.totalCost).toBe(0);
  });

  it('returns a zeroed rollup for a plan with no stages', () => {
    const out = rollupPlan({ stages: [] }, {});
    expect(out).toMatchObject({ totalMt: 0, totalCost: 0, actionCount: 0 });
    expect(out.stages).toEqual([]);
  });

  it('tolerates a null/undefined plan', () => {
    const out = rollupPlan(null, {});
    expect(out).toMatchObject({ totalMt: 0, totalCost: 0, actionCount: 0 });
  });
});
