// Admin-authored custom action items + staged reduction plans.
//
// Persisted to localStorage so admins can compose and revisit their own
// custom action library without a code change. The same shape maps
// cleanly to a Supabase table when the backend integration ships.
//
// Two stores:
//   - kua_admin_custom_actions    [{ id, title, description, category,
//                                     expectedMtPerYear, estimatedCostUsd,
//                                     methodology, dataSource, provenance,
//                                     confidence, owner, timeline,
//                                     status, createdAt }]
//   - kua_admin_stage_plans       [{ id, name, fiscalYear, createdAt,
//                                    stages: [{ id, name, timeframe,
//                                                actionIds: [] }] }]
//
// Custom actions reference their own ids (prefixed `cu_`); stage plans
// reference both custom and library action ids (`r_*` from the rule
// library, `ra_*` from the public reduction-actions list).

const ACTIONS_KEY = 'kua_admin_custom_actions';
const PLANS_KEY   = 'kua_admin_stage_plans';

function loadJson(key, fallback) {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch { return fallback; }
}
function saveJson(key, value) {
  if (typeof localStorage === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Custom actions ────────────────────────────────────────────────

/**
 * @typedef {Object} CustomAction
 * @property {string} id              `cu_*`
 * @property {string} title
 * @property {string} description
 * @property {'energy'|'dining'|'transportation'|'waste'|'procurement'|'engagement'|'scope1'|'scope2'|'scope3'|'sinks'} category
 * @property {number} expectedMtPerYear   whole-school annual mt CO2e
 * @property {number} estimatedCostUsd
 * @property {string} methodology         1-2 sentences from /api/admin/estimate-action
 * @property {string} dataSource          citation type
 * @property {'estimated'|'cited'} provenance
 * @property {'low'|'medium'|'high'} confidence
 * @property {string} owner               KUA role responsible
 * @property {string} timeline            'this-quarter' | 'this-year' | 'this-3-years'
 * @property {'proposed'|'in_progress'|'completed'|'blocked'} status
 * @property {string} createdAt           ISO 8601
 * @property {string=} createdByHash      teacher/admin hash if available
 */

/** @returns {CustomAction[]} */
export function getCustomActions() {
  return loadJson(ACTIONS_KEY, []);
}

/**
 * Add or replace a custom action by id.
 * @param {Omit<CustomAction, 'id' | 'createdAt'> & { id?: string }} action
 * @returns {CustomAction}
 */
export function saveCustomAction(action) {
  const all = getCustomActions();
  const persisted = {
    id: action.id || makeId('cu'),
    createdAt: new Date().toISOString(),
    status: action.status || 'proposed',
    ...action,
  };
  // Upsert by id.
  const idx = all.findIndex((a) => a.id === persisted.id);
  if (idx >= 0) all[idx] = { ...all[idx], ...persisted };
  else all.push(persisted);
  saveJson(ACTIONS_KEY, all);
  return persisted;
}

export function deleteCustomAction(id) {
  const all = getCustomActions().filter((a) => a.id !== id);
  saveJson(ACTIONS_KEY, all);
}

export function clearCustomActions() {
  if (typeof localStorage === 'undefined') return;
  try { localStorage.removeItem(ACTIONS_KEY); } catch {}
}

// ─── Stage plans ───────────────────────────────────────────────────

/**
 * @typedef {Object} PlanStage
 * @property {string} id              `st_*`
 * @property {string} name            e.g. "Phase 1 — Quick wins"
 * @property {string} timeframe       free-form, e.g. "Q1 2026" or "FY 2026-27"
 * @property {string[]} actionIds     mix of cu_* (custom), r_* (rule lib),
 *                                    ra_* (public reduction-actions)
 */

/**
 * @typedef {Object} StagePlan
 * @property {string} id              `sp_*`
 * @property {string} name
 * @property {string} fiscalYear      free-form, e.g. "2026-2027"
 * @property {string} createdAt       ISO 8601
 * @property {string} updatedAt       ISO 8601
 * @property {PlanStage[]} stages
 */

/** @returns {StagePlan[]} */
export function getStagePlans() {
  return loadJson(PLANS_KEY, []);
}

/** @param {string} id */
export function getStagePlan(id) {
  return getStagePlans().find((p) => p.id === id) || null;
}

/**
 * Upsert a plan. Returns the persisted plan with id + timestamps filled.
 * @param {Partial<StagePlan> & { name: string }} plan
 * @returns {StagePlan}
 */
export function saveStagePlan(plan) {
  const all = getStagePlans();
  const now = new Date().toISOString();
  const idx = plan.id ? all.findIndex((p) => p.id === plan.id) : -1;
  const persisted = {
    id: plan.id || makeId('sp'),
    name: plan.name,
    fiscalYear: plan.fiscalYear || '',
    createdAt: idx >= 0 ? all[idx].createdAt : now,
    updatedAt: now,
    stages: Array.isArray(plan.stages) ? plan.stages.map(normalizeStage) : [],
  };
  if (idx >= 0) all[idx] = persisted;
  else all.push(persisted);
  saveJson(PLANS_KEY, all);
  return persisted;
}

export function deleteStagePlan(id) {
  saveJson(PLANS_KEY, getStagePlans().filter((p) => p.id !== id));
}

function normalizeStage(s) {
  return {
    id: s.id || makeId('st'),
    name: String(s.name || 'Untitled stage'),
    timeframe: String(s.timeframe || ''),
    actionIds: Array.isArray(s.actionIds) ? s.actionIds.filter((x) => typeof x === 'string') : [],
  };
}

/**
 * Helper: roll up a plan's expected mt + cost across all stages.
 * Pass in the lookup dict { [actionId]: { expectedMtPerYear, estimatedCostUsd } }.
 */
export function rollupPlan(plan, lookup) {
  let totalMt = 0;
  let totalCost = 0;
  let actionCount = 0;
  const stages = (plan?.stages || []).map((s) => {
    let stageMt = 0;
    let stageCost = 0;
    for (const aid of s.actionIds) {
      const a = lookup[aid];
      if (!a) continue;
      stageMt += Number(a.expectedMtPerYear) || 0;
      stageCost += Number(a.estimatedCostUsd) || 0;
      actionCount += 1;
    }
    totalMt += stageMt;
    totalCost += stageCost;
    return { ...s, expectedMtPerYear: stageMt, estimatedCostUsd: stageCost };
  });
  return { stages, totalMt, totalCost, actionCount };
}
