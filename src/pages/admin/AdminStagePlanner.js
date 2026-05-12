import React, { useEffect, useMemo, useState } from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../../components/ModuleShell.js';
import { ProvenancePill } from '../../components/ProvenancePill.js';
import { reductionActions } from '../../data/reductionActions.js';
import {
  getCustomActions,
  getStagePlans,
  saveStagePlan,
  deleteStagePlan,
  rollupPlan,
  saveCustomAction,
} from '../../data/customActions.js';

// Admin Stage Planner — compose actions (custom + library) into named,
// timeboxed stages. Persists to localStorage as kua_admin_stage_plans.
//
// Each plan is { name, fiscalYear, stages: [{ name, timeframe,
// actionIds }] }. Stages are ordered (top = first); admins can rename
// them, set a timeframe like "Q1 2026" or "FY 2026-27", and add /
// remove actions. The action picker lists custom-authored actions
// first, then the public + admin reductionActions library.

const CATEGORY_COLORS = {
  energy:        '#fbbf24',
  dining:        '#22c55e',
  transportation:'#3b82f6',
  waste:         '#a855f7',
  procurement:   '#06b6d4',
  engagement:    '#ef4444',
};

function emptyPlan() {
  return {
    name: 'KUA Decarbonization Plan',
    fiscalYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    stages: [
      { name: 'Phase 1 — Quick wins', timeframe: 'this quarter', actionIds: [] },
      { name: 'Phase 2 — Capital projects', timeframe: 'this fiscal year', actionIds: [] },
      { name: 'Phase 3 — Long term', timeframe: 'next 3 years', actionIds: [] },
    ],
  };
}

export default function AdminStagePlanner() {
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allPlans = useMemo(() => getStagePlans(), [tick]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const customActions = useMemo(() => getCustomActions(), [tick]);

  // Build a unified lookup: id → { title, expectedMtPerYear, cost,
  // category, isCustom }. Used for both the per-stage rollup and the
  // action-picker dropdown.
  const lookup = useMemo(() => {
    const out = {};
    for (const a of reductionActions) {
      out[a.id] = {
        id: a.id,
        title: a.title,
        category: a.category,
        expectedMtPerYear: a.expectedReductionMtCO2e,
        estimatedCostUsd: a.estimatedCostUsd,
        owner: a.owner,
        provenance: 'estimated',
        isCustom: false,
        visibility: a.visibility,
      };
    }
    for (const c of customActions) {
      out[c.id] = {
        id: c.id,
        title: c.title,
        category: c.category,
        expectedMtPerYear: c.expectedMtPerYear,
        estimatedCostUsd: c.estimatedCostUsd,
        owner: c.owner,
        provenance: c.provenance,
        isCustom: true,
        visibility: 'admin',
      };
    }
    return out;
  }, [customActions]);

  const [activePlanId, setActivePlanId] = useState(null);
  // First mount: pick the most recent plan, or create a starter.
  useEffect(() => {
    if (activePlanId) return;
    if (allPlans.length > 0) setActivePlanId(allPlans[0].id);
  }, [allPlans, activePlanId]);

  const activePlan = allPlans.find((p) => p.id === activePlanId) || null;
  const rollup = activePlan ? rollupPlan(activePlan, lookup) : null;

  // Phase 121: import the current AI plan (from Plan Agent) as a 3-
  // stage rollout. Reads the AI plan from localStorage and bins items
  // by timeline tier into Quick wins / This fiscal year / Multi-year.
  // Each plan item gets stashed as a "custom action" so the rollup
  // works against the same lookup table the stage rollup uses.
  function importAIPlan() {
    let aiPlan;
    try {
      aiPlan = JSON.parse(localStorage.getItem('kua_admin_plan') || 'null');
    } catch { aiPlan = null; }
    if (!aiPlan || !Array.isArray(aiPlan.plan) || aiPlan.plan.length === 0) {
      window.alert('No AI plan found in localStorage. Generate one at /admin/plan-agent first.');
      return;
    }
    if (!window.confirm(`Import ${aiPlan.plan.length} items from the AI plan into a new stage plan? Each item also gets saved as a custom action so the stage rollup totals correctly.`)) return;

    // Save each AI plan item as a custom action via the same helper
    // the manual "Add custom action" page uses. This way the lookup
    // map + rollup math work without special-casing.
    const savedActions = aiPlan.plan.map((it) => saveCustomAction({
      title: it.title,
      description: it.why || '',
      category: it.category || 'engagement',
      owner: it.ownerRole || '',
      expectedMtPerYear: it.expectedMtPerYear || 0,
      estimatedCostUsd: it.estimatedCostUsd || 0,
      provenance: it.provenance || 'estimated',
      importedFromAIPlan: true,
      aiPlanItemId: it.id,
    }));

    // Build a 3-stage plan binning each item by its timeline tier.
    const idForItem = (i) => savedActions[i]?.id || aiPlan.plan[i].id;
    const stages = [
      {
        name: 'Phase 1 — Quick wins (≤90 days)',
        timeframe: 'this quarter',
        actionIds: aiPlan.plan.map((it, i) => it.timeline === 'this-quarter' ? idForItem(i) : null).filter(Boolean),
      },
      {
        name: 'Phase 2 — This fiscal year',
        timeframe: 'this fiscal year',
        actionIds: aiPlan.plan.map((it, i) => it.timeline === 'this-year' ? idForItem(i) : null).filter(Boolean),
      },
      {
        name: 'Phase 3 — Multi-year capital arc',
        timeframe: 'next 3 years',
        actionIds: aiPlan.plan.map((it, i) => it.timeline === 'this-3-years' ? idForItem(i) : null).filter(Boolean),
      },
    ];
    const draft = {
      name: `AI plan import · ${new Date().toLocaleDateString()}`,
      fiscalYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
      stages,
    };
    const persisted = saveStagePlan(draft);
    setActivePlanId(persisted.id);
    refresh();
  }

  function newPlan() {
    const draft = emptyPlan();
    const persisted = saveStagePlan(draft);
    setActivePlanId(persisted.id);
    refresh();
  }
  function updateActive(patch) {
    if (!activePlan) return;
    saveStagePlan({ ...activePlan, ...patch });
    refresh();
  }
  function removePlan() {
    if (!activePlan) return;
    if (!window.confirm(`Delete "${activePlan.name}"? This cannot be undone.`)) return;
    deleteStagePlan(activePlan.id);
    setActivePlanId(null);
    refresh();
  }
  function updateStage(stageIdx, patch) {
    if (!activePlan) return;
    const next = activePlan.stages.map((s, i) => i === stageIdx ? { ...s, ...patch } : s);
    updateActive({ stages: next });
  }
  function addStage() {
    if (!activePlan) return;
    const next = [...activePlan.stages, { name: `Phase ${activePlan.stages.length + 1}`, timeframe: '', actionIds: [] }];
    updateActive({ stages: next });
  }
  function removeStage(stageIdx) {
    if (!activePlan) return;
    if (!window.confirm(`Delete stage "${activePlan.stages[stageIdx].name}"?`)) return;
    updateActive({ stages: activePlan.stages.filter((_, i) => i !== stageIdx) });
  }
  function moveStage(stageIdx, dir) {
    if (!activePlan) return;
    const ni = stageIdx + dir;
    if (ni < 0 || ni >= activePlan.stages.length) return;
    const next = [...activePlan.stages];
    [next[stageIdx], next[ni]] = [next[ni], next[stageIdx]];
    updateActive({ stages: next });
  }
  function addActionToStage(stageIdx, actionId) {
    if (!activePlan || !actionId) return;
    if (activePlan.stages[stageIdx].actionIds.includes(actionId)) return;
    updateStage(stageIdx, {
      actionIds: [...activePlan.stages[stageIdx].actionIds, actionId],
    });
  }
  function removeActionFromStage(stageIdx, actionId) {
    if (!activePlan) return;
    updateStage(stageIdx, {
      actionIds: activePlan.stages[stageIdx].actionIds.filter((id) => id !== actionId),
    });
  }

  return (
    <ModulePage
      title="Stage Planner"
      subtitle="Compose actions into a named, time-boxed multi-stage plan. Pull from the action library, your custom-authored actions, or both. Persists to your browser's localStorage — the same shape will sync to Supabase when the backend integration lands."
    >
      <ModuleSection
        title="Plan"
        hint={allPlans.length === 0 ? 'No plans yet. Create one to start composing stages.' : `${allPlans.length} plan${allPlans.length === 1 ? '' : 's'} in your library.`}
      >
        <div style={styles.planRow}>
          {allPlans.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePlanId(p.id)}
              style={{
                ...styles.planTab,
                background: activePlanId === p.id ? '#22d3ee' : '#0b1220',
                color: activePlanId === p.id ? '#0b1220' : '#cbd5e1',
                borderColor: activePlanId === p.id ? '#22d3ee' : '#1f2937',
              }}
            >
              {p.name}
              {p.fiscalYear && <span style={{ marginLeft: 6, opacity: 0.7 }}>· {p.fiscalYear}</span>}
            </button>
          ))}
          <button type="button" onClick={newPlan} style={styles.newPlanBtn}>+ New plan</button>
          <button
            type="button"
            onClick={importAIPlan}
            style={styles.importBtn}
            title="Import the current AI-generated plan (/admin/plan-agent) as a 3-stage rollout. Each plan item also gets saved as a custom action so totals roll up correctly."
          >
            📋 Import AI plan
          </button>
        </div>
      </ModuleSection>

      {!activePlan && (
        <ModuleSection title="Get started">
          <div style={styles.empty}>
            Click <strong>+ New plan</strong> above to start composing a phased reduction plan.
            Each plan can have any number of stages (Phase 1, Phase 2, etc.), and each stage can
            hold both your custom-authored actions (added via the Reduction Actions page) and
            existing items from the library.
          </div>
        </ModuleSection>
      )}

      {activePlan && rollup && (
        <>
          <MetricGrid metrics={[
            { label: 'Stages',         value: activePlan.stages.length, accent: '#22d3ee' },
            { label: 'Actions in plan', value: rollup.actionCount, accent: '#fbbf24' },
            { label: 'Total reduction', value: Math.round(rollup.totalMt).toLocaleString(), unit: 'mtCO₂e/yr', accent: '#86efac' },
            { label: 'Est. capital',    value: rollup.totalCost === 0 ? '$0' : `$${Math.round(rollup.totalCost).toLocaleString()}`, accent: '#ef4444' },
          ]} />

          <ModuleSection title="Plan settings">
            <div style={styles.formGrid}>
              <div>
                <label style={styles.label}>Plan name</label>
                <input
                  type="text"
                  value={activePlan.name}
                  onChange={(e) => updateActive({ name: e.target.value })}
                  style={styles.input}
                  maxLength={140}
                />
              </div>
              <div>
                <label style={styles.label}>Fiscal year</label>
                <input
                  type="text"
                  value={activePlan.fiscalYear}
                  onChange={(e) => updateActive({ fiscalYear: e.target.value })}
                  placeholder="e.g. 2026-2027"
                  style={styles.input}
                  maxLength={32}
                />
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" onClick={addStage} style={styles.addStageBtn}>+ Add stage</button>
              <button type="button" onClick={removePlan} style={styles.deleteBtn}>Delete plan</button>
            </div>
          </ModuleSection>

          <ModuleSection title={`Stages (${activePlan.stages.length})`}>
            <div style={styles.stagesList}>
              {activePlan.stages.map((stage, sIdx) => (
                <StageCard
                  key={stage.id || sIdx}
                  stage={stage}
                  rollupStage={rollup.stages[sIdx]}
                  isFirst={sIdx === 0}
                  isLast={sIdx === activePlan.stages.length - 1}
                  lookup={lookup}
                  onUpdate={(patch) => updateStage(sIdx, patch)}
                  onRemove={() => removeStage(sIdx)}
                  onMoveUp={() => moveStage(sIdx, -1)}
                  onMoveDown={() => moveStage(sIdx, +1)}
                  onAddAction={(id) => addActionToStage(sIdx, id)}
                  onRemoveAction={(id) => removeActionFromStage(sIdx, id)}
                />
              ))}
            </div>
            {activePlan.stages.length === 0 && (
              <div style={styles.empty}>No stages yet — click <strong>+ Add stage</strong> above.</div>
            )}
          </ModuleSection>
        </>
      )}
    </ModulePage>
  );
}

function StageCard({ stage, rollupStage, isFirst, isLast, lookup, onUpdate, onRemove, onMoveUp, onMoveDown, onAddAction, onRemoveAction }) {
  const [picker, setPicker] = useState('');

  const stageActions = (stage.actionIds || []).map((id) => lookup[id]).filter(Boolean);
  const orphanIds = (stage.actionIds || []).filter((id) => !lookup[id]);

  // Group "available" actions by source for the picker dropdown.
  const allInLookup = Object.values(lookup);
  const usedSet = new Set(stage.actionIds || []);
  const availableCustom = allInLookup.filter((a) => a.isCustom && !usedSet.has(a.id));
  const availableLibrary = allInLookup.filter((a) => !a.isCustom && !usedSet.has(a.id));

  return (
    <div style={styles.stageCard}>
      <div style={styles.stageHead}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={stage.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            style={styles.stageName}
            placeholder="Stage name"
          />
          <input
            type="text"
            value={stage.timeframe}
            onChange={(e) => onUpdate({ timeframe: e.target.value })}
            style={styles.stageTimeframe}
            placeholder="Timeframe (e.g. Q1 2026, FY 2026-27)"
          />
        </div>
        <div style={styles.stageActions}>
          <button type="button" onClick={onMoveUp} disabled={isFirst} style={styles.moveBtn} aria-label="Move stage up">↑</button>
          <button type="button" onClick={onMoveDown} disabled={isLast} style={styles.moveBtn} aria-label="Move stage down">↓</button>
          <button type="button" onClick={onRemove} style={styles.removeBtn}>×</button>
        </div>
      </div>

      <div style={styles.stageStats}>
        <span><strong style={{ color: '#86efac' }}>{Math.round(rollupStage?.expectedMtPerYear || 0).toLocaleString()}</strong> mtCO₂e/yr</span>
        <span><strong style={{ color: '#cbd5e1' }}>${Math.round(rollupStage?.estimatedCostUsd || 0).toLocaleString()}</strong> capital</span>
        <span style={{ color: '#94a3b8' }}>{stageActions.length} action{stageActions.length === 1 ? '' : 's'}</span>
      </div>

      <div style={styles.actionList}>
        {stageActions.map((a) => (
          <div key={a.id} style={{ ...styles.actionRow, borderLeftColor: CATEGORY_COLORS[a.category] || '#94a3b8' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.actionRowHead}>
                {a.isCustom && <Pill kind="info">✎ custom</Pill>}
                {a.visibility === 'admin' && <Pill kind="warn">🔒 admin</Pill>}
                <ProvenancePill provenance={a.provenance} />
                <span style={{ color: '#64748b', fontSize: 11, textTransform: 'capitalize' }}>{a.category}</span>
              </div>
              <div style={styles.actionRowTitle}>{a.title}</div>
              <div style={styles.actionRowMeta}>
                <strong>{Math.round(a.expectedMtPerYear).toLocaleString()}</strong> mt/yr ·{' '}
                {a.estimatedCostUsd === 0 ? '$0' : `$${a.estimatedCostUsd.toLocaleString()}`} · {a.owner}
              </div>
            </div>
            <button type="button" onClick={() => onRemoveAction(a.id)} style={styles.removeActionBtn} aria-label={`Remove ${a.title} from stage`}>
              ×
            </button>
          </div>
        ))}
        {orphanIds.length > 0 && (
          <div style={styles.orphanWarning}>
            {orphanIds.length} action{orphanIds.length === 1 ? '' : 's'} no longer exist — they were deleted from the library after being added to this stage. <button type="button" onClick={() => onUpdate({ actionIds: stage.actionIds.filter((id) => lookup[id]) })} style={styles.linkBtn}>Clean up</button>
          </div>
        )}
        {stageActions.length === 0 && orphanIds.length === 0 && (
          <div style={styles.emptyStage}>No actions yet. Pick from the dropdown below.</div>
        )}
      </div>

      <div style={styles.pickerRow}>
        <select
          value={picker}
          onChange={(e) => {
            const id = e.target.value;
            if (id) {
              onAddAction(id);
              setPicker('');
            }
          }}
          style={styles.picker}
        >
          <option value="">+ Add an action…</option>
          {availableCustom.length > 0 && (
            <optgroup label="Your custom actions">
              {availableCustom.map((a) => (
                <option key={a.id} value={a.id}>{a.title} ({Math.round(a.expectedMtPerYear)} mt/yr)</option>
              ))}
            </optgroup>
          )}
          {availableLibrary.length > 0 && (
            <optgroup label="Library actions">
              {availableLibrary.map((a) => (
                <option key={a.id} value={a.id}>{a.title} ({Math.round(a.expectedMtPerYear)} mt/yr · {a.visibility})</option>
              ))}
            </optgroup>
          )}
        </select>
      </div>
    </div>
  );
}

const styles = {
  planRow: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  planTab: { padding: '8px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, border: '1px solid', cursor: 'pointer', fontFamily: 'inherit' },
  newPlanBtn: { padding: '8px 14px', background: '#22c55e', color: '#0b1220', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  importBtn: { padding: '8px 14px', background: 'transparent', color: '#a5b4fc', border: '1px solid #3730a3', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  empty: { padding: 20, background: '#0b1220', border: '1px dashed #334155', borderRadius: 8, fontSize: 14, color: '#94a3b8', lineHeight: 1.6 },
  emptyStage: { padding: 12, color: '#64748b', fontSize: 12, fontStyle: 'italic' },

  formGrid: { display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' },
  label: { display: 'block', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 },
  input: { width: '100%', boxSizing: 'border-box', padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontSize: 14, fontFamily: 'inherit' },
  addStageBtn: { padding: '8px 14px', background: '#22d3ee', color: '#0b1220', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  deleteBtn: { padding: '8px 14px', background: 'transparent', border: '1px solid #7f1d1d', borderRadius: 6, color: '#fca5a5', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },

  stagesList: { display: 'grid', gap: 14 },
  stageCard: { padding: 16, background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22d3ee', borderRadius: 8 },
  stageHead: { display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 },
  stageName: { width: '100%', boxSizing: 'border-box', padding: '6px 10px', background: 'transparent', border: '1px solid transparent', borderRadius: 6, color: '#e5e7eb', fontSize: 16, fontWeight: 700, fontFamily: 'inherit' },
  stageTimeframe: { width: '100%', boxSizing: 'border-box', padding: '4px 10px', background: 'transparent', border: '1px solid transparent', borderRadius: 6, color: '#94a3b8', fontSize: 12, fontFamily: 'inherit', marginTop: 2 },
  stageActions: { display: 'flex', gap: 4 },
  moveBtn: { width: 28, height: 28, padding: 0, background: '#0f172a', color: '#cbd5e1', border: '1px solid #1f2937', borderRadius: 4, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' },
  removeBtn: { width: 28, height: 28, padding: 0, background: '#0f172a', color: '#fca5a5', border: '1px solid #7f1d1d', borderRadius: 4, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },

  stageStats: { display: 'flex', gap: 14, padding: '8px 12px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6, marginBottom: 12, fontSize: 13, color: '#cbd5e1', flexWrap: 'wrap' },

  actionList: { display: 'grid', gap: 8 },
  actionRow: { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: '#0f172a', border: '1px solid #1f2937', borderLeft: '3px solid #94a3b8', borderRadius: 6 },
  actionRowHead: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 },
  actionRowTitle: { fontSize: 13, color: '#e5e7eb', fontWeight: 600 },
  actionRowMeta: { fontSize: 11, color: '#94a3b8', marginTop: 4, fontVariantNumeric: 'tabular-nums' },
  removeActionBtn: { width: 24, height: 24, flexShrink: 0, padding: 0, background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 4, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' },
  orphanWarning: { padding: '8px 12px', background: '#3a2a0d', border: '1px dashed #92400e', borderRadius: 6, fontSize: 12, color: '#fbbf24', lineHeight: 1.5 },
  linkBtn: { background: 'transparent', border: 'none', color: '#fbbf24', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', padding: 0, fontSize: 12 },

  pickerRow: { marginTop: 10 },
  picker: { width: '100%', boxSizing: 'border-box', padding: '8px 12px', background: '#0b1220', border: '1px solid #334155', borderRadius: 6, color: '#cbd5e1', fontSize: 13, fontFamily: 'inherit' },
};
