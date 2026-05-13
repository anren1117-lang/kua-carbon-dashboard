import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ModulePage, ModuleSection, Pill } from '../../components/ModuleShell.js';
import { ProvenancePill, ProvenanceLegend } from '../../components/ProvenancePill.js';
import { GRID_MIX_TOTAL_MTCO2E } from '../../data/gridMix.js';
import { ANNUAL_SEQUESTRATION_MT } from '../../data/sinks.js';
import { TOTAL_STUDENTS } from '../../data/students.js';
import { COMPOSED_ANNUALIZE_FACTOR as ANNUALIZE_FACTOR, COMPOSED_ANNUAL_KWH, COMPOSED_YTD_KWH } from '../../data/composedYtd.js';
import { adminFetch } from '../../utils/adminFetch.js';
import { downloadBlob } from '../../utils/csv.js';
import { useMeasuredScopeTotals } from '../../hooks/useMeasuredScopeTotals.js';
import { reductionTargets, targetTrajectoryAt } from '../../data/targets.js';

// Admin-only AI-driven institutional plan. Three-step flow stored in
// localStorage:
//   1. Set institutional context (fiscal year, capital appetite, top
//      priority area, planning horizon, regulatory drivers).
//   2. Click "Generate plan" → POSTs to /api/admin/plan, which returns
//      a 5-7 step prioritized list of WHOLE-SCHOOL levers, scaled in mt
//      and dollars, with named owner roles.
//   3. As projects ship (or get vetoed), record check-ins. Re-generating
//      bakes that history into the next plan, dropping done items and
//      shifting priority across what's left.

const CONTEXT_KEY = 'kua_admin_plan_context';
const PLAN_KEY    = 'kua_admin_plan';

// Phase 125: consume an SSE Response from one of the admin AI
// endpoints. Returns the payload of the 'done' event (with mode:'llm'
// merged in for parity with the non-streaming JSON shape). Throws on
// 'error' event. Optional onDelta lets callers stream chat text into
// state as it arrives.
async function parseSSE(response, onDelta, onProgress) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let final = null;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf('\n\n')) >= 0) {
      const chunk = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const eventLine = chunk.split('\n').find((l) => l.startsWith('event: '));
      const dataLine  = chunk.split('\n').find((l) => l.startsWith('data: '));
      if (!eventLine || !dataLine) continue;
      const event = eventLine.slice(7).trim();
      let payload = null;
      try { payload = JSON.parse(dataLine.slice(6)); } catch {}
      if (!payload) continue;
      if      (event === 'progress' && onProgress) onProgress(payload);
      else if (event === 'delta'    && onDelta)    onDelta(payload);
      else if (event === 'done')                   final = payload;
      else if (event === 'error')                  throw new Error(payload.message || 'stream error');
    }
  }
  if (!final) throw new Error('Stream ended without a result');
  return { mode: 'llm', ...final };
}

// Browser-only download helper. Builds a blob URL, clicks an anchor,
// revokes. Same pattern src/utils/csv.js uses.
// Use the shared utility — same implementation, single source of truth.
const triggerDownload = (filename, text, mime) => downloadBlob(filename, text, mime);

function exportPlanMarkdown(plan, context) {
  if (!plan || !Array.isArray(plan.plan)) return;
  const date = new Date().toISOString().slice(0, 10);
  const lines = [
    `# KUA Decarbonization Plan — ${context.fiscalYear || date}`,
    '',
    plan.summary || '',
    '',
    `**Context.** Capital appetite: ${context.capitalAppetite || '—'}. Top priority: ${context.topPriority || '—'}. Horizon: ${context.timeHorizonYears || '—'} year(s). Current gross: ${context.grossMt?.toLocaleString() || '—'} mtCO₂e/yr. Forest sequestration: ${context.sinksMt?.toLocaleString() || '—'} mtCO₂e/yr.`,
    '',
    `**Plan totals.** ${plan.plan.length} items · ${Math.round(plan.totalExpectedMtPerYear || 0).toLocaleString()} mtCO₂e/yr expected reduction · ${(plan.percentOfGross ?? 0).toFixed(1)}% of current gross.`,
    '',
    '---',
    '',
  ];
  plan.plan.forEach((it, i) => {
    lines.push(`## #${i + 1}. ${it.title}`);
    lines.push('');
    lines.push(`- **${Math.round(it.expectedMtPerYear).toLocaleString()} mtCO₂e/yr** · ${it.estimatedCostUsd === 0 ? 'no capex' : `$${it.estimatedCostUsd.toLocaleString()}`}${it.paybackYears > 0 && it.estimatedCostUsd > 0 ? ` · ${it.paybackYears.toFixed(0)}yr payback` : ''}`);
    lines.push(`- **Owner:** ${it.ownerRole} · **Timeline:** ${it.timeline} · **Category:** ${it.category} · **Difficulty:** ${it.difficulty} · **Provenance:** ${it.provenance}`);
    if (it.why)          lines.push('', it.why);
    if (Array.isArray(it.firstSteps) && it.firstSteps.length) {
      lines.push('', '**First steps:**');
      it.firstSteps.forEach((s) => lines.push(`1. ${s}`));
    }
    if (it.dependencies && it.dependencies !== 'none') lines.push('', `**Dependencies:** ${it.dependencies}`);
    if (Array.isArray(it.milestones) && it.milestones.length) {
      lines.push('', '**Milestones:**');
      it.milestones.forEach((m) => lines.push(`- ${m}`));
    }
    if (Array.isArray(it.risks) && it.risks.length) {
      lines.push('', '**Risks:**');
      it.risks.forEach((r) => lines.push(`- ${r}`));
    }
    if (Array.isArray(it.kpis) && it.kpis.length) {
      lines.push('', '**KPIs:**');
      it.kpis.forEach((k) => lines.push(`- ${k}`));
    }
    if (it.dataSource) lines.push('', `_Data source: ${it.dataSource}_`);
    lines.push('', '---', '');
  });
  triggerDownload(`kua-plan-${date}.md`, lines.join('\n'), 'text/markdown');
}

// JSON export: full backup of plan + context + history + snapshots so
// admin can move state between browsers or archive a board meeting's
// official plan. JSON is the only export round-tripped by Phase 141
// import.
function exportPlanJson(plan, context, history, snapshots) {
  if (!plan) return;
  const date = new Date().toISOString().slice(0, 10);
  const blob = JSON.stringify({
    exportedAt: new Date().toISOString(),
    formatVersion: 1,
    context,
    plan,
    history: history || { completed: [], declined: [] },
    snapshots: snapshots || [],
  }, null, 2);
  triggerDownload(`kua-plan-${date}.json`, blob, 'application/json');
}

function exportPlanCsv(plan) {
  if (!plan || !Array.isArray(plan.plan)) return;
  const cols = ['rank', 'title', 'category', 'difficulty', 'timeline', 'ownerRole', 'expectedMtPerYear', 'estimatedCostUsd', 'paybackYears', 'provenance', 'dataSource', 'why', 'firstSteps', 'dependencies', 'milestones', 'risks', 'kpis'];
  const esc = (v) => {
    if (v === null || v === undefined) return '';
    const s = Array.isArray(v) ? v.join(' · ') : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [cols.join(',')];
  plan.plan.forEach((it, i) => {
    rows.push(cols.map((c) => esc(c === 'rank' ? i + 1 : it[c])).join(','));
  });
  const date = new Date().toISOString().slice(0, 10);
  triggerDownload(`kua-plan-${date}.csv`, rows.join('\n'), 'text/csv');
}
const SNAPSHOTS_KEY = 'kua_admin_plan_snapshots'; // [{ id, name, savedAt, plan, context }]
const MAX_SNAPSHOTS = 10;
const HISTORY_KEY = 'kua_admin_plan_history';

// Single source of truth — these flow through automatically when
// fuel-delivery / Sodexo / travel-office records are integrated.
import { SCOPE1_TOTAL_MT, SCOPE3_TOTAL_MT } from '../../data/scopeTotals.js';
const SCOPE2_ANNUAL_MT = GRID_MIX_TOTAL_MTCO2E * ANNUALIZE_FACTOR;
const GROSS_MT = SCOPE1_TOTAL_MT + SCOPE2_ANNUAL_MT + SCOPE3_TOTAL_MT;

const APPETITES = [
  { value: 'low',    label: 'Low — operational only, no new capex this year' },
  { value: 'medium', label: 'Medium — single-project capex window open' },
  { value: 'high',   label: 'High — multi-year capital plan in motion' },
];
const PRIORITIES = [
  { value: 'scope1',     label: 'Scope 1 — heating fuel, fleet, refrigerants' },
  { value: 'scope2',     label: 'Scope 2 — purchased electricity' },
  { value: 'scope3',     label: 'Scope 3 — travel, food, waste, procurement' },
  { value: 'sinks',      label: 'Sinks — protect or expand campus sequestration' },
  { value: 'engagement', label: 'Engagement — reporting, transparency, culture' },
];
const HORIZONS = [
  { value: 1, label: '1 year (this fiscal)' },
  { value: 3, label: '3 years' },
  { value: 5, label: '5 years' },
];

const CATEGORY_COLORS = {
  scope1:     '#fbbf24',
  scope2:     '#22d3ee',
  scope3:     '#a855f7',
  sinks:      '#22c55e',
  engagement: '#f472b6',
};
const TIMELINE_LABELS = {
  'this-quarter': 'this quarter',
  'this-year':    'this year',
  'this-3-years': 'in 3 years',
};

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch { return fallback; }
}
function saveJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function emptyContext() {
  return {
    fiscalYear:        '2026-2027',
    capitalAppetite:   '',
    topPriority:       '',
    timeHorizonYears:  3,
    regulatoryDriver:  '',
    notes:             '',
    grossMt:           Math.round(GROSS_MT),
    sinksMt:           Math.round(ANNUAL_SEQUESTRATION_MT),
    enrollment:        TOTAL_STUDENTS,
  };
}

function contextIsComplete(c) {
  return c.capitalAppetite && c.topPriority && c.timeHorizonYears;
}

export default function AdminPlanAgent() {
  // Phase 61: pull live measured totals so the AI plan agent gets the
  // most accurate possible context. Falls back to the synchronous
  // module-level constants on first paint and when no admin records
  // have been entered.
  const live = useMeasuredScopeTotals();
  // Persist only the user-editable fields. Canonical KUA totals
  // (grossMt, sinksMt, enrollment) come fresh from the data layer
  // every time so a stale localStorage snapshot can't override an
  // updated GROSS_MT after a new BMS capture lands.
  const [context, setContext] = useState(() => {
    const saved = loadJson(CONTEXT_KEY, {});
    const fresh = emptyContext();
    return {
      ...fresh,
      ...saved,
      grossMt:    fresh.grossMt,
      sinksMt:    fresh.sinksMt,
      enrollment: fresh.enrollment,
    };
  });

  // When live totals resolve (or update), refresh the context's
  // grossMt + sinksMt so the AI sees measured values instead of the
  // placeholder. Doesn't overwrite user-editable fields.
  useEffect(() => {
    if (live.loading) return;
    setContext((prev) => ({
      ...prev,
      grossMt: live.grossMt || prev.grossMt,
      sinksMt: live.sinkMt   || prev.sinksMt,
    }));
  }, [live.loading, live.grossMt, live.sinkMt]);
  const [plan, setPlan] = useState(() => loadJson(PLAN_KEY, null));
  const [history, setHistory] = useState(() => loadJson(HISTORY_KEY, { completed: [], declined: [] }));
  const [snapshots, setSnapshots] = useState(() => loadJson(SNAPSHOTS_KEY, []));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Phase 119: streaming-progress state. charCount ticks while the
  // plan is generating. Shown as "Drafting plan… 1,245 chars so far".
  const [streamChars, setStreamChars] = useState(0);
  // Phase 127: track stream start so the button label can show
  // "Drafting plan… 12s · 1,245 chars". The timer updates state
  // every second while loading is true.
  const [streamStartedAt, setStreamStartedAt] = useState(null);
  const [streamElapsed, setStreamElapsed] = useState(0);
  useEffect(() => {
    if (!loading || !streamStartedAt) {
      setStreamElapsed(0);
      return;
    }
    const id = setInterval(() => {
      setStreamElapsed(Math.floor((Date.now() - streamStartedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [loading, streamStartedAt]);

  // Phase 128: keyboard shortcuts.
  //   ⌘/Ctrl + Enter  — generate plan (when context is complete + not loading)
  //   ⌘/Ctrl + S      — save current plan as snapshot
  //   ⌘/Ctrl + K      — toggle plan-level chat
  //   Esc             — close plan-level chat / memo / narrative if open
  // Skipped when focus is inside a form input/textarea — admins typing
  // in the context fields shouldn't accidentally trigger these.
  useEffect(() => {
    function inForm(target) {
      const tag = target?.tagName?.toLowerCase();
      return tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable;
    }
    function onKey(e) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'Enter') {
        if (inForm(e.target)) return; // let user type into chat input normally
        if (!loading && contextIsComplete(context)) {
          e.preventDefault();
          generatePlan();
        }
      } else if (mod && e.key.toLowerCase() === 's') {
        if (plan) {
          e.preventDefault();
          saveSnapshot();
        }
      } else if (mod && e.key.toLowerCase() === 'k') {
        if (plan) {
          e.preventDefault();
          setPlanChatOpen((v) => !v);
        }
      } else if (e.key === 'Escape') {
        if (inForm(e.target)) return;
        if (planChatOpen)  setPlanChatOpen(false);
        if (narrative)     setNarrative(null);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [loading, context, plan, planChatOpen, narrative, generatePlan]);
  // Plan-level chat — separate from per-item chats. Scoped to the
  // whole plan + context + history + measurement state.
  const [planChatOpen, setPlanChatOpen] = useState(false);
  const [planChatMessages, setPlanChatMessages] = useState([]);
  const [planChatInput, setPlanChatInput] = useState('');
  const [planChatBusy, setPlanChatBusy] = useState(false);
  const [planChatErr, setPlanChatErr] = useState(null);
  // Board narrative — full 2-page strategic brief.
  const [narrative, setNarrative] = useState(null); // { narrative: {...}, generatedAt } | null
  const [narrativeBusy, setNarrativeBusy] = useState(false);
  const [narrativeErr, setNarrativeErr] = useState(null);

  // Phase 150: AI-narrated diff between the prior plan and the freshly
  // regenerated one. Triggered automatically after a regenerate when a
  // priorPlan existed. Persists to localStorage so the admin sees it
  // again on reload until the next regeneration.
  const DIFF_KEY = 'kua_admin_plan_diff';
  const [diff, setDiff] = useState(() => loadJson(DIFF_KEY, null));
  const [diffBusy, setDiffBusy] = useState(false);
  const [diffErr, setDiffErr] = useState(null);
  useEffect(() => {
    if (diff) saveJson(DIFF_KEY, diff);
    else { try { localStorage.removeItem(DIFF_KEY); } catch {} }
  }, [diff]);

  async function fetchPlanDiff(priorPlanRef, newPlan) {
    setDiffBusy(true);
    setDiffErr(null);
    try {
      const r = await adminFetch('/api/admin/plan-diff', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ priorPlan: priorPlanRef, newPlan, context, stream: true }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${r.status}`);
      }
      const result = await parseSSE(r);
      setDiff({ ...result, priorCount: priorPlanRef.length, newCount: newPlan.plan.length });
    } catch (err) {
      setDiffErr(err.message);
    } finally {
      setDiffBusy(false);
    }
  }
  // Plan item view mode: 'compact' (1-row summary per item) or
  // 'detailed' (full per-item card with all detail blocks). Defaults
  // to compact for 8+ item plans so admins don't have to scroll a
  // wall of cards on first render.
  const [planItemMode, setPlanItemMode] = useState(() => (plan?.plan?.length ?? 0) >= 8 ? 'compact' : 'detailed');

  // Phase 151: admin chooses Opus 4.7 (deep, slow ~30-60s) or Sonnet
  // 4.6 (faster ~10-20s, slightly less coherent on 12-item plans).
  // Default Opus. Persisted so iteration preference sticks.
  const MODEL_KEY = 'kua_admin_plan_model';
  const [planModel, setPlanModel] = useState(() => {
    try { return localStorage.getItem(MODEL_KEY) || 'claude-opus-4-7'; }
    catch { return 'claude-opus-4-7'; }
  });
  useEffect(() => {
    try { localStorage.setItem(MODEL_KEY, planModel); } catch {}
  }, [planModel]);
  // Re-apply the default when a fresh plan lands (after Generate).
  useEffect(() => {
    if (plan?.plan?.length) {
      setPlanItemMode(plan.plan.length >= 8 ? 'compact' : 'detailed');
    }
  }, [plan?.plan?.length]);

  async function generateNarrative() {
    if (!plan) return;
    setNarrativeBusy(true);
    setNarrativeErr(null);
    try {
      const measuredState = {
        scope1Measured: !!live.scope1Measured,
        scope3Measured: !!live.scope3Measured,
        sinksMeasured:  !!live.sinksMeasured,
      };
      const r = await adminFetch('/api/admin/plan-narrative', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan, context, history, measuredState, stream: true }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${r.status}`);
      }
      const result = await parseSSE(r);
      setNarrative(result);
    } catch (err) {
      setNarrativeErr(err.message);
    } finally {
      setNarrativeBusy(false);
    }
  }

  async function sendPlanChat() {
    const trimmed = planChatInput.trim();
    if (!trimmed || planChatBusy || !plan) return;
    const next = [...planChatMessages, { role: 'user', content: trimmed }];
    setPlanChatMessages(next);
    setPlanChatInput('');
    setPlanChatBusy(true);
    setPlanChatErr(null);
    // Push a placeholder assistant turn that we'll fill via streaming.
    setPlanChatMessages([...next, { role: 'assistant', content: '' }]);
    try {
      const measuredState = {
        scope1Measured: !!live.scope1Measured,
        scope2Measured: true,
        scope3Measured: !!live.scope3Measured,
        sinksMeasured:  !!live.sinksMeasured,
      };
      const r = await adminFetch('/api/admin/plan-chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          plan,
          context,
          history,
          measuredState,
          messages: next,
          stream: true,
        }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${r.status}`);
      }
      // SSE: 'delta' events append text to the in-progress assistant turn;
      // 'done' finalizes; 'error' throws.
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accum = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf('\n\n')) >= 0) {
          const chunk = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const eventLine = chunk.split('\n').find((l) => l.startsWith('event: '));
          const dataLine  = chunk.split('\n').find((l) => l.startsWith('data: '));
          if (!eventLine || !dataLine) continue;
          const event = eventLine.slice(7).trim();
          let payload = null;
          try { payload = JSON.parse(dataLine.slice(6)); } catch {}
          if (!payload) continue;
          if (event === 'delta') {
            accum += payload.text || '';
            // Replace the last (placeholder) assistant turn with the
            // accumulated text on each delta.
            setPlanChatMessages((cur) => {
              const out = cur.slice(0, -1);
              out.push({ role: 'assistant', content: accum });
              return out;
            });
          } else if (event === 'done') {
            setPlanChatMessages((cur) => {
              const out = cur.slice(0, -1);
              out.push({ role: 'assistant', content: payload.reply });
              return out;
            });
          } else if (event === 'error') {
            throw new Error(payload.message || 'stream error');
          }
        }
      }
    } catch (err) {
      setPlanChatErr(err.message);
      // Pop the placeholder on error.
      setPlanChatMessages((cur) => cur.slice(0, -1));
    } finally {
      setPlanChatBusy(false);
    }
  }

  useEffect(() => { saveJson(CONTEXT_KEY, context); }, [context]);
  useEffect(() => { saveJson(HISTORY_KEY, history); }, [history]);
  useEffect(() => { if (plan) saveJson(PLAN_KEY, plan); }, [plan]);
  useEffect(() => { saveJson(SNAPSHOTS_KEY, snapshots); }, [snapshots]);

  function saveSnapshot() {
    if (!plan) return;
    const name = window.prompt('Snapshot name (e.g. "Pre-board-meeting Q3", "Tight-budget scenario"):', `Plan ${new Date().toLocaleDateString()}`);
    if (!name) return;
    setSnapshots((prev) => [
      { id: `snap-${Date.now()}`, name: name.slice(0, 80), savedAt: new Date().toISOString(), plan, context },
      ...prev,
    ].slice(0, MAX_SNAPSHOTS));
  }

  function restoreSnapshot(snap) {
    if (!window.confirm(`Restore snapshot "${snap.name}"? The current plan will be replaced (save it first if you want to keep it).`)) return;
    setPlan(snap.plan);
    if (snap.context) {
      setContext((prev) => ({
        ...prev,
        ...snap.context,
        grossMt: prev.grossMt, // keep live data
        sinksMt: prev.sinksMt,
        enrollment: prev.enrollment,
      }));
    }
  }

  function deleteSnapshot(id) {
    if (!window.confirm('Delete this snapshot?')) return;
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  }

  // Restore plan + context + history + snapshots from a JSON file
  // previously created by exportPlanJson. Validates the shape before
  // touching state so a malformed paste doesn't corrupt the agent.
  async function onImportJsonFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = ''; // allow re-picking the same file later
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object' || !parsed.plan || !Array.isArray(parsed.plan.plan)) {
        window.alert('That JSON does not look like a KUA plan export — missing { plan: { plan: [...] } } shape.');
        return;
      }
      const itemCount = parsed.plan.plan.length;
      const snapCount = Array.isArray(parsed.snapshots) ? parsed.snapshots.length : 0;
      const ok = window.confirm(
        `Import this plan?\n\n` +
        `• ${itemCount} item${itemCount === 1 ? '' : 's'} in the plan\n` +
        `• ${snapCount} snapshot${snapCount === 1 ? '' : 's'}\n` +
        `• Exported ${parsed.exportedAt ? new Date(parsed.exportedAt).toLocaleString() : 'at an unknown time'}\n\n` +
        `Your current plan, context, history, and snapshots will be replaced.`
      );
      if (!ok) return;
      setPlan(parsed.plan);
      if (parsed.context && typeof parsed.context === 'object') {
        setContext((prev) => ({
          ...prev,
          ...parsed.context,
          // Always keep the live measured-state fields from the
          // current session — these come from useMeasuredScopeTotals
          // and should reflect THIS browser's view of Supabase.
          grossMt: prev.grossMt,
          sinksMt: prev.sinksMt,
          enrollment: prev.enrollment,
        }));
      }
      if (parsed.history && typeof parsed.history === 'object') {
        setHistory({
          completed: Array.isArray(parsed.history.completed) ? parsed.history.completed : [],
          declined:  Array.isArray(parsed.history.declined)  ? parsed.history.declined  : [],
        });
      }
      if (Array.isArray(parsed.snapshots)) {
        setSnapshots(parsed.snapshots.slice(0, MAX_SNAPSHOTS));
      }
    } catch (err) {
      window.alert(`Could not parse JSON: ${err?.message || err}`);
    }
  }

  const [comparingSnapId, setComparingSnapId] = useState(null);
  function toggleCompare(id) {
    setComparingSnapId((cur) => cur === id ? null : id);
  }

  // AbortController for the in-flight plan generation. Set when
  // generatePlan starts; cleared in finally; user-clicked "Cancel"
  // calls .abort() which propagates as an AbortError caught below.
  const planAbortRef = React.useRef(null);
  function cancelPlanGeneration() {
    if (planAbortRef.current) {
      try { planAbortRef.current.abort(); } catch {}
    }
  }

  const generatePlan = useCallback(async () => {
    setLoading(true);
    setError('');
    const ac = new AbortController();
    planAbortRef.current = ac;
    try {
      // Phase 93: send a richer measuredState block so the agent can
      // recommend "go after Scope 1 first because it's still on
      // bottom-up cross-check" or "Scope 3 already measured — focus
      // on the dominant cohort" etc.
      const measuredState = {
        scope1Measured: !!live.scope1Measured,
        scope2Measured: true,
        scope3Measured: !!live.scope3Measured,
        sinksMeasured:  !!live.sinksMeasured,
        scope3CohortDetail: Array.isArray(live.scope3CohortDetail)
          ? live.scope3CohortDetail.map((c) => ({
              cohort: c.cohort,
              label: c.label,
              count: c.count,
              mt: c.mt,
              provenance: c.provenance,
            }))
          : [],
      };
      // Phase 117: pass priorPlan so the agent can preserve continuity
      // for items the admin hasn't yet shipped or declined. The history
      // already covers shipped/declined; priorPlan covers the pending
      // middle ground.
      const priorPlan = plan && Array.isArray(plan.plan)
        ? plan.plan.map((it) => ({
            id: it.id,
            title: it.title,
            expectedMtPerYear: it.expectedMtPerYear,
            estimatedCostUsd: it.estimatedCostUsd,
            category: it.category,
            timeline: it.timeline,
          }))
        : null;
      setStreamChars(0);
      setStreamStartedAt(Date.now());
      const res = await adminFetch('/api/admin/plan', {
        method: 'POST',
        body: JSON.stringify({ context, history, measuredState, priorPlan, stream: true, model: planModel }),
        signal: ac.signal,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server returned ${res.status}`);
      }
      // Streaming SSE response: events of shape
      //   event: progress\ndata: {"charCount": 200}\n\n
      //   event: done\ndata: {<plan>}\n\n
      //   event: error\ndata: {"message": "..."}\n\n
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalPlan = null;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf('\n\n')) >= 0) {
          const chunk = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const eventLine = chunk.split('\n').find((l) => l.startsWith('event: '));
          const dataLine  = chunk.split('\n').find((l) => l.startsWith('data: '));
          if (!eventLine || !dataLine) continue;
          const event = eventLine.slice(7).trim();
          let payload = null;
          try { payload = JSON.parse(dataLine.slice(6)); } catch {}
          if (!payload) continue;
          if (event === 'progress') {
            setStreamChars(payload.charCount || 0);
          } else if (event === 'done') {
            finalPlan = payload;
          } else if (event === 'error') {
            throw new Error(payload.message || 'stream error');
          }
        }
      }
      if (!finalPlan) throw new Error('Stream ended without a plan');
      setPlan(finalPlan);
      // Phase 150: if a prior plan existed, immediately fetch an
      // AI-narrated diff so the admin sees what changed and why. The
      // diff fetch is fire-and-forget — failure does not block plan
      // display.
      if (priorPlan && priorPlan.length > 0) {
        fetchPlanDiff(priorPlan, finalPlan).catch(() => {});
      } else {
        setDiff(null);
      }
    } catch (err) {
      // AbortError is user-initiated — show a friendly message rather
      // than an exception trace.
      if (err?.name === 'AbortError') {
        setError('Plan generation cancelled.');
      } else {
        setError(err.message || 'Could not generate the plan.');
      }
    } finally {
      planAbortRef.current = null;
      setLoading(false);
    }
  }, [context, history, live, planModel]);

  const completeItem = (item) => {
    // Two-step prompt — first capture the actual mt saved (defaults
    // to the estimate); then optional notes. Skip-friendly: blank
    // submission keeps the estimate.
    const raw = window.prompt(
      `Actual mt saved (annual) — defaults to estimate ${item.expectedMtPerYear} mt:`,
      String(item.expectedMtPerYear)
    );
    if (raw === null) return; // user cancelled
    const parsed = Number(raw);
    const actualMt = Number.isFinite(parsed) && parsed >= 0 ? parsed : item.expectedMtPerYear;
    const note = window.prompt('Optional note (cost actuals, completion date, surprises):') || '';
    setHistory((h) => ({
      completed: [...h.completed, {
        id: item.id,
        title: item.title,
        when: new Date().toISOString(),
        expectedMt: item.expectedMtPerYear,
        mtSaved: actualMt,
        note,
      }],
      declined: h.declined,
    }));
  };

  const declineItem = (item) => {
    const reason = window.prompt('Why is this off the table? (cost, timing, vetoed, etc.) The agent uses this in the next plan.');
    setHistory((h) => ({
      completed: h.completed,
      declined:  [...h.declined, { id: item.id, title: item.title, reason: reason || '' }],
    }));
  };

  const resetEverything = () => {
    if (!window.confirm('Clear the plan, context, and check-in history? Cannot be undone.')) return;
    setContext(emptyContext());
    setPlan(null);
    setHistory({ completed: [], declined: [] });
    try { localStorage.removeItem(CONTEXT_KEY); } catch {}
    try { localStorage.removeItem(PLAN_KEY); } catch {}
    try { localStorage.removeItem(HISTORY_KEY); } catch {}
  };

  const totalMt        = plan?.totalExpectedMtPerYear ?? 0;
  const percentOfGross = plan?.percentOfGross ?? 0;
  const totalCompleted = history.completed.length;
  const mtAlreadySaved = history.completed.reduce((s, c) => s + (c.mtSaved || 0), 0);
  const hasPlan        = !!(plan && plan.plan && plan.plan.length);

  return (
    <ModulePage
      className="plan-print"
      title="Plan agent — institutional decarbonization roadmap"
      subtitle="Set the institutional context, then let the agent draft an 8-12 step plan ranked by impact, cost-fit, and political feasibility. Record what ships and what gets vetoed; the agent re-prioritizes from there."
      toolbar={plan ? (
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            padding: '6px 12px',
            background: 'transparent',
            color: '#22d3ee',
            border: '1px solid #155e75',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
          title="Print / save as PDF — board-ready layout with all items, memos, and history"
        >
          🖨 Print or save as PDF
        </button>
      ) : null}
    >
      <ModuleSection title="Institutional context" hint="Loaded from KUA's canonical totals — adjust when the fiscal context changes (new board, new capex window, new regulation).">
        <ScenarioPresets
          onApply={(preset) => setContext((prev) => ({ ...prev, ...preset }))}
        />
        <div style={styles.formGrid}>
          <Field label="Fiscal year">
            <input
              type="text"
              value={context.fiscalYear}
              onChange={(e) => setContext({ ...context, fiscalYear: e.target.value })}
              style={styles.input}
              placeholder="e.g. 2026-2027"
            />
          </Field>
          <Select label="Capital appetite (board)" value={context.capitalAppetite} onChange={(v) => setContext({ ...context, capitalAppetite: v })} options={APPETITES} />
          <Select label="Top priority area"        value={context.topPriority}     onChange={(v) => setContext({ ...context, topPriority: v })}     options={PRIORITIES} />
          <Select label="Planning horizon"         value={String(context.timeHorizonYears)} onChange={(v) => setContext({ ...context, timeHorizonYears: Number(v) })} options={HORIZONS.map((h) => ({ value: String(h.value), label: h.label }))} />
        </div>
        <div style={{ marginTop: 12 }}>
          <Field label="Regulatory driver (optional)">
            <input
              type="text"
              value={context.regulatoryDriver}
              onChange={(e) => setContext({ ...context, regulatoryDriver: e.target.value })}
              style={styles.input}
              placeholder="e.g. NH SB-123 emission disclosure deadline 2027-12"
            />
          </Field>
          <div style={{ height: 12 }} />
          <Field label="Anything else the agent should weigh? (optional)">
            <textarea
              value={context.notes}
              onChange={(e) => setContext({ ...context, notes: e.target.value })}
              style={{ ...styles.input, minHeight: 80, fontFamily: 'inherit' }}
              placeholder="e.g. New Head of School arriving July 2027 — major capital decisions paused until then."
            />
          </Field>
        </div>
        <div style={styles.contextSummary}>
          <div style={styles.contextSummaryItem}><strong>Gross:</strong> {context.grossMt.toLocaleString()} mtCO₂e/yr</div>
          <div style={styles.contextSummaryItem}><strong>Sinks:</strong> {context.sinksMt.toLocaleString()} mtCO₂e/yr</div>
          <div style={styles.contextSummaryItem}><strong>Net:</strong> {(context.grossMt - context.sinksMt).toLocaleString()} mtCO₂e/yr</div>
          <div style={styles.contextSummaryItem}><strong>Enrollment:</strong> {context.enrollment.toLocaleString()}</div>
        </div>
        <details style={styles.sourcesBlock}>
          <summary style={styles.sourcesSummary}>Where do these numbers come from?</summary>
          <div style={styles.provenanceLegend}><ProvenanceLegend compact /></div>
          <div style={styles.contextProvList}>
            <CtxRow
              provenance={live.scope1Measured ? 'measured' : 'estimated'}
              label={`Scope 1 (${(live.scope1Mt || SCOPE1_TOTAL_MT).toLocaleString()} mt/yr)`}
              today={live.scope1Measured
                ? 'Live across 5 admin tables: fuel_bills + scope1_heating_oil + scope1_propane + scope1_fleet + scope1_refrigerants. Replaces the bottom-up cross-check the moment any of those tables fill in.'
                : 'Hand-set placeholder for heating fuel + refrigerants + fleet, sized to typical NH boarding-school footprints. KUA fuel deliveries and refrigerant logs have not been integrated.'}
              target="Annual fuel-delivery invoices (heating oil + propane) per building × EPA Stationary Combustion factors. HVAC technician service-report mass balance × IPCC AR6 GWP100 for refrigerants. Fleet fuel-card records × EPA gasoline/diesel factors. Flips estimated → measured."
              sourcePath="src/hooks/useMeasuredScope1.js" />
            <CtxRow provenance="measured" label={`Scope 2 kWh (${COMPOSED_ANNUAL_KWH.toLocaleString()} kWh Year 1 / ${COMPOSED_YTD_KWH.toLocaleString()} kWh YTD)`}
              today="KUA Distech Eclypse BMS All Meters page, snapshot 2026-05-03 (123 days into 2026)."
              target="Already measured. Improvement: drop the seasonally-anchored ×2.5 annualization once a full year of BMS data is captured."
              sourcePath="src/data/envysionSnapshot.js" />
            <CtxRow provenance="cited" label={`Scope 2 mtCO₂e (${Math.round(SCOPE2_ANNUAL_MT).toLocaleString()} mt/yr annualized)`}
              today="Measured kWh × per-fuel output emission factors (combined-cycle gas 0.40 kg/kWh, oil 0.78, coal 0.95, imports 0.30) summed over ISO-NE 2024 generation mix. System rate ≈ 0.235 kg/kWh, in eGRID NEWE 2022 range."
              target="Already at target methodology. Refresh as eGRID NEWE 2024 publishes (expected late 2026)."
              sourcePath="src/data/gridMix.js" />
            <CtxRow
              provenance={live.scope3Measured ? 'measured' : 'estimated'}
              label={`Scope 3 (${(live.scope3Mt || SCOPE3_TOTAL_MT).toLocaleString()} mt/yr)`}
              today={live.scope3Measured
                ? 'Live across 8 admin tables: cohort counts (day / US / international), trip-level (study_abroad + faculty_travel), waste, purchased_goods (Cat 1), commuting (Cat 7).'
                : 'Hand-set order-of-magnitude figure for student travel + dining + waste + procurement + commuting + upstream fuel. No measured inventory of any of these categories exists yet.'}
              target="Student travel: KUA travel office departure logs + ICAO calculator. Dining: Sodexo/SAGE invoices × USEEIO food-sector factors + Project Drawdown overlay. Waste: hauler invoices (tons by stream) × EPA WARM v15.1. Procurement: Business Office spend mapped to USEEIO sectors. Commuting: HR zip-code survey × ICCT fuel-economy. Each subcategory ships independently → cited."
              sourcePath="src/hooks/useMeasuredScope3.js" />
            <CtxRow
              provenance={live.sinksMeasured ? 'measured' : 'estimated'}
              label={`Sinks (${(live.sinkMt || Math.round(ANNUAL_SEQUESTRATION_MT)).toLocaleString()} mt/yr)`}
              today={live.sinksMeasured
                ? 'Live from forest_stand_actuals — per-stand acres × cited mt/acre/yr rates. Replaces the hardcoded inventory the moment any stands are entered.'
                : '7 named forest stands × per-acre sequestration rates (IPCC LULUCF defaults: mature mixed hardwood 2.4–2.8 mt/acre/yr; transitional 2.6–3.2; softwood 1.9; open-grown 4.2). Stand names ("North Hill", "Potato Patch", "Chellis Pond riparian", etc.) and per-stand acreages are placeholders.'}
              target="Commission a USFS Forest Inventory & Analysis-style stand survey of the actual KUA woodlot — species composition, age class, basal area, real per-stand acreage. IPCC per-acre rates stay; inputs become real. Flips estimated → cited."
              sourcePath="src/hooks/useMeasuredSinks.js" />
            <CtxRow provenance="cited" label={`Total forest acres (~1,000)`}
              today='KUA disclosure ("campus is 1,300 acres total, ~1,000 forested") corroborated by Wikipedia. Real number.'
              target="No upgrade needed. The acres figure is solid; only the per-stand subdivision is the placeholder." />
            <CtxRow provenance="cited" label={`Enrollment (${TOTAL_STUDENTS})`}
              today='KUA "By the Numbers" page + Wikipedia.'
              target="No upgrade needed. Will refresh annually from the KUA registrar feed when integrated."
              sourcePath="src/data/students.js TOTAL_STUDENTS" />
            <CtxRow provenance="cited" label={`Year 1 annualize factor (×${ANNUALIZE_FACTOR.toFixed(2)})`}
              today="Seasonally anchored: each measured month implies its own annual via NH's heating-driven shape; their average gives a calibrated baseline. Unmeasured months projected from that baseline. Lower than naive linear (×2.94) because Jan–Apr is heating-heavy and would overstate summer."
              target="Drops to ×1.0 (i.e. no projection needed) once a full calendar year of BMS data is captured (~Apr 2027)."
              sourcePath="src/data/composedYtd.js COMPOSED_ANNUALIZE_FACTOR" />
          </div>
          <div style={styles.sourceCaveat}>
            Plan items below each carry their own provenance pill (measured / cited / estimated) plus a <em>Data source</em> line citing the methodology category behind their mt and $ benchmarks. Almost every rule-library item is currently <em>estimated</em> because KUA-specific inputs (Miller Hall boiler load, T8 fixture count, faculty commute distances, international student travel mileage) haven't been inventoried — the methodology is sound, the input quantities are best-effort. The AI agent is instructed to default to <em>estimated</em> when in doubt, and never to inflate confidence.
          </div>
        </details>
        <div style={styles.actionRow}>
          <button
            type="button"
            onClick={generatePlan}
            disabled={!contextIsComplete(context) || loading}
            style={{ ...styles.primaryBtn, opacity: (!contextIsComplete(context) || loading) ? 0.5 : 1 }}
          >
            {loading
              ? (streamChars > 0
                ? `Drafting plan… ${streamElapsed}s · ${streamChars.toLocaleString()} chars`
                : `Starting up… ${streamElapsed}s`)
              : hasPlan ? 'Re-generate plan' : 'Generate plan'}
          </button>
          {loading && (
            <button
              type="button"
              onClick={cancelPlanGeneration}
              style={{
                padding: '10px 16px',
                background: 'transparent',
                color: '#fca5a5',
                border: '1px solid #7f1d1d',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
              title="Stop the in-flight generation. Partial output is discarded."
            >
              ✕ Cancel
            </button>
          )}
          {!loading && (
            <label
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}
              title="Opus 4.7 produces the most coherent 12-item plan but takes 30-60s. Sonnet 4.6 is ~3× faster and good for iteration."
            >
              <span>Model:</span>
              <select
                value={planModel}
                onChange={(e) => setPlanModel(e.target.value)}
                disabled={loading}
                style={{ padding: '4px 8px', background: '#0b1220', color: '#e5e7eb', border: '1px solid #334155', borderRadius: 4, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer' }}
              >
                <option value="claude-opus-4-7">Opus 4.7 (deep)</option>
                <option value="claude-sonnet-4-6">Sonnet 4.6 (fast)</option>
              </select>
            </label>
          )}
          {!loading && contextIsComplete(context) && (
            <span style={{ fontSize: 11, color: '#64748b', alignSelf: 'center' }}>
              Shortcuts: ⌘↵ generate · ⌘S snapshot · ⌘K chat · Esc close
            </span>
          )}
          {hasPlan && (
            <button type="button" onClick={resetEverything} style={styles.dangerBtn}>
              Reset context + history
            </button>
          )}
        </div>
        {error && <div role="alert" style={styles.error}>{error}</div>}
      </ModuleSection>

      {hasPlan && (
        <ModuleSection
          title="Current plan"
          hint={`${plan.mode === 'llm' ? 'AI-generated' : 'Rule-based fallback'} · drafted ${new Date(plan.generatedAt).toLocaleDateString()} · re-generate after a board meeting / fiscal cycle / new project completion.`}
        >
          {(diff || diffBusy || diffErr) && (
            <PlanDiffCard
              diff={diff}
              busy={diffBusy}
              error={diffErr}
              onDismiss={() => setDiff(null)}
            />
          )}
          <div style={styles.summary}>{plan.summary}</div>
          <div style={styles.heroRow}>
            <Hero label="Plan annual reduction"     value={`${Math.round(totalMt).toLocaleString()}`} unit="mtCO₂e/yr" accent="#86efac" />
            <Hero label="Share of current gross"    value={`${percentOfGross.toFixed(1)}%`}            unit=""           accent="#fbbf24" />
            <Hero label="Already shipped"           value={`${Math.round(mtAlreadySaved).toLocaleString()}`} unit={`mt · ${totalCompleted} actions`} accent="#22d3ee" />
            <Hero label="Suggested next check-in"   value={`${plan.nextCheckInDays} days`}             unit=""           accent="#a855f7" />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <button type="button" onClick={saveSnapshot} style={styles.snapshotBtn}>
              💾 Save as snapshot
            </button>
            <button type="button" onClick={() => exportPlanMarkdown(plan, context)} style={styles.exportBtn} title="Download the plan as a Markdown file — paste into Notion / Slack / Linear / email.">
              📥 Markdown
            </button>
            <button type="button" onClick={() => exportPlanCsv(plan)} style={styles.exportBtn} title="Download the plan as a CSV — open in Excel / Google Sheets.">
              📥 CSV
            </button>
            <button type="button" onClick={() => exportPlanJson(plan, context, history, snapshots)} style={styles.exportBtn} title="Download the plan + context + history + snapshots as a JSON file — for backup or moving between browsers.">
              📥 JSON
            </button>
            <label style={{ ...styles.exportBtn, cursor: 'pointer', display: 'inline-block' }} title="Restore a plan from a JSON file previously exported. Overwrites the current plan, context, history, and snapshots after confirmation.">
              📤 Import JSON
              <input
                type="file"
                accept=".json,application/json"
                style={{ display: 'none' }}
                onChange={onImportJsonFile}
              />
            </label>
            <button
              type="button"
              onClick={() => setPlanChatOpen((v) => !v)}
              style={styles.planChatBtn}
            >
              {planChatOpen ? '✕ Close plan chat' : `💬 Ask about the plan${planChatMessages.length > 0 ? ` (${planChatMessages.length})` : ''}`}
            </button>
            {!narrative && (
              <button type="button" onClick={generateNarrative} disabled={narrativeBusy} style={styles.narrativeBtn}>
                {narrativeBusy ? 'Drafting board brief…' : '📄 Board narrative'}
              </button>
            )}
            {narrative && (
              <button type="button" onClick={() => setNarrative(null)} style={styles.narrativeBtn}>
                ✕ Hide narrative
              </button>
            )}
          </div>
          <AIError label="Narrative error" error={narrativeErr} onRetry={generateNarrative} busy={narrativeBusy} />
          {narrative && narrative.narrative && (
            <BoardNarrative narrative={narrative.narrative} generatedAt={narrative.generatedAt} />
          )}

          {planChatOpen && (
            <ChatThread
              messages={planChatMessages}
              input={planChatInput}
              setInput={setPlanChatInput}
              onSend={sendPlanChat}
              busy={planChatBusy}
              error={planChatErr}
              itemTitle="the whole plan"
            />
          )}
          <PlanOverview
            items={plan.plan}
            grossMt={context.grossMt}
            live={live}
            alreadyShippedMt={mtAlreadySaved}
          />
          <PlanItemViewToggle
            count={plan.plan.length}
            mode={planItemMode}
            onChange={setPlanItemMode}
          />
          <div style={styles.planList}>
            {plan.plan.map((item, i) => (
              <PlanCard
                key={item.id}
                item={item}
                rank={i + 1}
                context={context}
                otherItems={plan.plan}
                compact={planItemMode === 'compact'}
                onComplete={() => completeItem(item)}
                onDecline={() => declineItem(item)}
                onReplace={(alt) => {
                  // Swap this slot for the alternative; recompute total.
                  setPlan((cur) => {
                    if (!cur) return cur;
                    const nextItems = cur.plan.map((it, idx) => idx === i ? { ...alt, id: it.id } : it);
                    return {
                      ...cur,
                      plan: nextItems,
                      totalExpectedMtPerYear: nextItems.reduce((s, x) => s + (x.expectedMtPerYear || 0), 0),
                    };
                  });
                }}
              />
            ))}
          </div>
        </ModuleSection>
      )}

      {snapshots.length > 0 && (
        <ModuleSection title="Saved plan snapshots" hint={`Up to ${MAX_SNAPSHOTS} versioned plans. Restore any snapshot to compare scenarios, then save the current plan again before regenerating.`}>
          <div style={styles.snapshotList}>
            {snapshots.map((s) => (
              <React.Fragment key={s.id}>
              <div style={styles.snapshotRow}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.snapshotName}>{s.name}</div>
                  <div style={styles.snapshotMeta}>
                    {new Date(s.savedAt).toLocaleString()} ·
                    {' '}{(s.plan?.plan?.length ?? 0)} items ·
                    {' '}{Math.round(s.plan?.totalExpectedMtPerYear ?? 0).toLocaleString()} mt/yr ·
                    {' '}capital {s.context?.capitalAppetite || '—'} ·
                    {' '}priority {s.context?.topPriority || '—'}
                  </div>
                </div>
                <button type="button" onClick={() => toggleCompare(s.id)} style={styles.snapshotCompare}>
                  {comparingSnapId === s.id ? 'Hide diff' : 'Compare'}
                </button>
                <button type="button" onClick={() => restoreSnapshot(s)} style={styles.snapshotRestore}>
                  Restore
                </button>
                <button type="button" onClick={() => deleteSnapshot(s.id)} style={styles.snapshotDelete} aria-label={`Delete snapshot "${s.name}"`}>
                  ×
                </button>
              </div>
              {comparingSnapId === s.id && plan && (
                <SnapshotDiff snapshot={s} currentPlan={plan} currentContext={context} />
              )}
              </React.Fragment>
            ))}
          </div>
        </ModuleSection>
      )}

      {(history.completed.length > 0 || history.declined.length > 0) && (
        <ModuleSection title="Plan history" hint="Re-generate the plan to bake this history into the next round.">
          {history.completed.length > 0 && (
            <CumulativeReductionChart
              completed={history.completed}
              grossMt={context.grossMt}
            />
          )}
          {history.completed.length > 0 && (
            <div style={styles.historyBlock}>
              <div style={styles.historyTitle}>Shipped ({history.completed.length}) · {Math.round(mtAlreadySaved).toLocaleString()} mt/yr</div>
              <CalibrationBadge completed={history.completed} />
              <ul style={styles.historyList}>
                {history.completed.map((c, i) => {
                  // Show variance vs estimate when both are available.
                  // Beat-the-estimate (actual > expected) renders green;
                  // missed (< expected) renders amber.
                  const expected = Number(c.expectedMt);
                  const actual = Number(c.mtSaved);
                  const hasBoth = Number.isFinite(expected) && expected > 0 && Number.isFinite(actual);
                  const variancePct = hasBoth ? Math.round(((actual - expected) / expected) * 100) : null;
                  const varianceColor = variancePct == null ? '#94a3b8'
                    : variancePct >= 5 ? '#86efac'
                    : variancePct <= -5 ? '#fbbf24'
                    : '#94a3b8';
                  return (
                    <li key={i} style={styles.historyItem}>
                      <span style={styles.historyCheck}>✓</span>
                      <span style={{ flex: 1 }}>
                        {c.title}
                        {c.note && <span style={styles.historyReason}> — {c.note}</span>}
                      </span>
                      {c.mtSaved ? <span style={styles.historyMt}>-{Math.round(c.mtSaved)} mt/yr</span> : null}
                      {hasBoth && (
                        <span style={{ ...styles.historyVariance, color: varianceColor }}>
                          (est {Math.round(expected)}, {variancePct >= 0 ? '+' : ''}{variancePct}%)
                        </span>
                      )}
                      <span style={styles.historyWhen}>{new Date(c.when).toLocaleDateString()}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {history.declined.length > 0 && (
            <div style={styles.historyBlock}>
              <div style={styles.historyTitle}>Vetoed / off-table ({history.declined.length})</div>
              <ul style={styles.historyList}>
                {history.declined.map((d, i) => (
                  <li key={i} style={styles.historyItem}>
                    <span style={styles.historyX}>×</span>
                    <span style={{ flex: 1 }}>{d.title}{d.reason && <span style={styles.historyReason}> — {d.reason}</span>}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ModuleSection>
      )}
    </ModulePage>
  );
}

function Field({ label, children }) {
  return (
    <label style={styles.field}>
      <div style={styles.fieldLabel}>{label}</div>
      {children}
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.input}>
        <option value="">— select —</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}

function CtxRow({ provenance, label, today, target, sourcePath }) {
  return (
    <div style={styles.ctxRow}>
      <div style={styles.ctxHead}>
        <ProvenancePill provenance={provenance} />
        <span style={styles.ctxLabel}>{label}</span>
      </div>
      <div style={styles.ctxMethod}>
        <span style={styles.ctxMethodLabel}>Today:</span> {today}
      </div>
      <div style={styles.ctxMethod}>
        <span style={styles.ctxMethodLabel}>Target:</span> {target}
      </div>
      {sourcePath && (
        <div style={styles.ctxSourcePath}>Source: <code>{sourcePath}</code></div>
      )}
    </div>
  );
}

function Hero({ label, value, unit, accent }) {
  return (
    <div style={{ ...styles.hero, borderLeftColor: accent }}>
      <div style={styles.heroLabel}>{label}</div>
      <div style={{ ...styles.heroValue, color: accent }}>
        {value}
        {unit && <span style={styles.heroUnit}>{unit}</span>}
      </div>
    </div>
  );
}

// Six canonical KUA planning scenarios. Each is a one-click filler
// for the context form — applies fiscal stance + priority + horizon
// + optional regulatory/notes context. Doesn't touch grossMt/sinksMt/
// enrollment (those flow from live data).
const SCENARIO_PRESETS = [
  {
    id: 'tight-budget',
    label: 'Tight budget · operational only',
    desc: 'No capital ask this cycle. Surface no-cost levers + low-cost ops tightening.',
    accent: '#fbbf24',
    apply: {
      capitalAppetite: 'low',
      topPriority: 'engagement',
      timeHorizonYears: 1,
      notes: 'Operating-budget cycle only. No new capital appropriations available until next FY.',
    },
  },
  {
    id: 'aggressive-2030',
    label: 'Aggressive 2030 push',
    desc: 'Board has authorized capital for the 50% by 2030 commitment. Surface the bigger levers.',
    accent: '#ef4444',
    apply: {
      capitalAppetite: 'high',
      topPriority: 'scope1',
      timeHorizonYears: 5,
      regulatoryDriver: 'KUA Board 2030 commitment (50% gross-reduction target)',
      notes: 'Board ready to underwrite multi-year capital project work. Lead with heat-pump conversion feasibility.',
    },
  },
  {
    id: 'scope3-focus',
    label: 'Scope 3 focus · student travel + dining',
    desc: 'Dominant cluster work — international flights, beef portions, faculty commute.',
    accent: '#a855f7',
    apply: {
      capitalAppetite: 'medium',
      topPriority: 'scope3',
      timeHorizonYears: 3,
      notes: 'Scope 3 is biggest by central. Want cohort-specific levers + dining tightening.',
    },
  },
  {
    id: 'maintenance',
    label: 'Maintenance mode · honor commitments',
    desc: 'No new program work — just ship what was previously approved + measure where we stand.',
    accent: '#94a3b8',
    apply: {
      capitalAppetite: 'low',
      topPriority: 'engagement',
      timeHorizonYears: 1,
      notes: 'Transition year. Focus on completing already-approved work + measurement infrastructure.',
    },
  },
  {
    id: 'measurement-first',
    label: 'Measurement-first · instrument before optimizing',
    desc: 'Get every scope to "measured" before bigger capital decisions.',
    accent: '#22d3ee',
    apply: {
      capitalAppetite: 'medium',
      topPriority: 'scope1',
      timeHorizonYears: 2,
      notes: 'Plan should prioritize data instrumentation — fuel-delivery integration, BMS extensions, forest inventory — so subsequent plans calibrate against measured baselines, not bottom-up.',
    },
  },
  {
    id: 'sinks-protect',
    label: 'Sinks-first · protect + expand',
    desc: 'Capitalize on the 2,650 mt/yr forest sequestration. Conservation easement, tree inventory, soil sampling.',
    accent: '#22c55e',
    apply: {
      capitalAppetite: 'medium',
      topPriority: 'sinks',
      timeHorizonYears: 3,
      notes: 'Forest carbon stock is KUA\'s strongest asset. Want easement + measurement work + selective management plan.',
    },
  },
];

function ScenarioPresets({ onApply }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={presetStyles.wrap}>
      <button type="button" style={presetStyles.toggle} onClick={() => setOpen((v) => !v)}>
        {open ? '▼' : '▶'} ⚡ Quick scenarios
        <span style={presetStyles.toggleHint}>One-click fillers for common KUA planning postures</span>
      </button>
      {open && (
        <div style={presetStyles.grid}>
          {SCENARIO_PRESETS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { onApply(s.apply); setOpen(false); }}
              style={{ ...presetStyles.card, borderLeftColor: s.accent }}
              title={`Click to populate the context with: ${JSON.stringify(s.apply)}`}
            >
              <div style={{ ...presetStyles.cardLabel, color: s.accent }}>{s.label}</div>
              <div style={presetStyles.cardDesc}>{s.desc}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const presetStyles = {
  wrap: { marginBottom: 14 },
  toggle: { display: 'flex', alignItems: 'baseline', gap: 10, padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#22d3ee', fontSize: 13, fontWeight: 700, cursor: 'pointer', width: '100%', textAlign: 'left' },
  toggleHint: { fontSize: 11, color: '#94a3b8', fontWeight: 500, textTransform: 'none', letterSpacing: 0 },
  grid: { marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 },
  card: { padding: '10px 12px', background: '#0f172a', border: '1px solid #1f2937', borderLeft: '3px solid #475569', borderRadius: 6, textAlign: 'left', cursor: 'pointer', color: 'inherit', font: 'inherit' },
  cardLabel: { fontSize: 13, fontWeight: 700 },
  cardDesc: { fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 1.5 },
};

// Ranks plan items by mt-per-$1000-of-capex. Surfaces the most
// cost-effective items separately from the priority-ordered list so
// admins making capital-allocation tradeoffs can see efficiency at a
// glance. No-cost items go in a separate "free" column.
function EfficiencyLeaderboard({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  // Free items (no capex). Sorted by raw mt impact descending.
  const free = items
    .filter((it) => (it.estimatedCostUsd || 0) === 0 && (it.expectedMtPerYear || 0) > 0)
    .map((it) => ({ ...it, mtPer1k: Infinity }))
    .sort((a, b) => (b.expectedMtPerYear || 0) - (a.expectedMtPerYear || 0))
    .slice(0, 3);

  // Paid items, ranked by mt per $1000 capex.
  const paid = items
    .filter((it) => (it.estimatedCostUsd || 0) > 0 && (it.expectedMtPerYear || 0) > 0)
    .map((it) => ({ ...it, mtPer1k: (it.expectedMtPerYear * 1000) / it.estimatedCostUsd }))
    .sort((a, b) => b.mtPer1k - a.mtPer1k)
    .slice(0, 3);

  if (free.length === 0 && paid.length === 0) return null;

  return (
    <div style={effStyles.wrap}>
      <div style={effStyles.label}>Cost-effectiveness leaderboard · top mt per dollar</div>
      <div style={effStyles.grid}>
        {free.length > 0 && (
          <div style={{ ...effStyles.column, borderLeftColor: '#86efac' }}>
            <div style={effStyles.colHead}>No-capex levers</div>
            {free.map((it, i) => (
              <div key={it.id || i} style={effStyles.entry}>
                <div style={effStyles.entryRank}>#{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={effStyles.entryTitle}>{it.title}</div>
                  <div style={effStyles.entryMeta}>{Math.round(it.expectedMtPerYear).toLocaleString()} mt/yr · operational</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {paid.length > 0 && (
          <div style={{ ...effStyles.column, borderLeftColor: '#22d3ee' }}>
            <div style={effStyles.colHead}>Best mt per $1K capex</div>
            {paid.map((it, i) => (
              <div key={it.id || i} style={effStyles.entry}>
                <div style={effStyles.entryRank}>#{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={effStyles.entryTitle}>{it.title}</div>
                  <div style={effStyles.entryMeta}>
                    {it.mtPer1k >= 0.1 ? it.mtPer1k.toFixed(2) : it.mtPer1k.toExponential(1)} mt / $1K · {Math.round(it.expectedMtPerYear)} mt for ${it.estimatedCostUsd.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const effStyles = {
  wrap: { marginTop: 12, padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  label: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 },
  column: { padding: '10px 12px', background: '#0f172a', border: '1px solid #1f2937', borderLeft: '3px solid #475569', borderRadius: 6 },
  colHead: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, marginBottom: 8 },
  entry: { display: 'flex', gap: 10, padding: '6px 0', borderTop: '1px solid #1f2937', alignItems: 'baseline' },
  entryRank: { fontSize: 13, color: '#94a3b8', fontWeight: 800, fontVariantNumeric: 'tabular-nums', minWidth: 28 },
  entryTitle: { fontSize: 13, color: '#e5e7eb', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  entryMeta: { fontSize: 11, color: '#94a3b8', marginTop: 2, fontVariantNumeric: 'tabular-nums' },
};

// For each board-tracked reduction target, project where the plan
// lands us vs the linear trajectory expectation. Connects the AI's
// 8-12 items to the actual institutional commitments in
// reductionTargets.js so the plan stops being abstract.
function TargetProgress({ items, live, alreadyShippedMt }) {
  // Sum plan-item annual mt by category (scope1/2/3/sinks). The plan
  // items use category=scope1/scope2/scope3/sinks/engagement;
  // engagement items don't map to a single scope so we omit them.
  const planMtByScope = { scope1: 0, scope2: 0, scope3: 0, sinks: 0 };
  for (const it of items) {
    if (planMtByScope[it.category] != null) {
      planMtByScope[it.category] += Number(it.expectedMtPerYear) || 0;
    }
  }
  // Energy targets are denominated in kWh, not mt — out of this
  // view's scope. Filter to mt-based targets only.
  const tracked = reductionTargets.filter((t) => t.scope !== 'energy_kwh');
  if (tracked.length === 0) return null;

  const currentYear = new Date().getFullYear();
  return (
    <div style={targetStyles.wrap}>
      <div style={targetStyles.label}>
        Plan vs board-tracked reduction targets
      </div>
      <div style={targetStyles.grid}>
        {tracked.map((t) => {
          // Current value for this target's scope:
          const current =
            t.scope === 'gross'  ? (live?.grossMt ?? t.baselineValue) :
            t.scope === 'scope1' ? (live?.scope1Mt ?? t.baselineValue) :
            t.scope === 'scope2' ? (live?.scope2Mt ?? t.baselineValue) :
            t.scope === 'scope3' ? (live?.scope3Mt ?? t.baselineValue) :
            t.scope === 'net'    ? (live?.netMt ?? t.baselineValue) :
            t.baselineValue;

          // Plan's contribution to this scope (annual mt at full rollout).
          const planContribution =
            t.scope === 'gross' ? Object.values(planMtByScope).reduce((s, v) => s + v, 0)
            : t.scope === 'net'   ? Object.values(planMtByScope).reduce((s, v) => s + v, 0)
            : (planMtByScope[t.scope] || 0);

          const targetValue = t.baselineValue * (1 - t.percentReduction / 100);
          const expectedByTargetYear = targetTrajectoryAt(t, currentYear);
          // Project: current - plan contribution - already-shipped (for
          // 'gross' / 'net' targets only — shipped items already affect
          // scope-specific lines via their underlying admin tables).
          const includeShipped = (t.scope === 'gross' || t.scope === 'net');
          const projected = Math.max(0, current - planContribution - (includeShipped ? alreadyShippedMt : 0));
          const gapToTarget = projected - targetValue;
          const ahead = gapToTarget <= 0;
          const closurePct = current > targetValue
            ? Math.min(100, ((current - projected) / (current - targetValue)) * 100)
            : 100;

          return (
            <div key={t.id} style={{ ...targetStyles.card, borderLeftColor: ahead ? '#22c55e' : '#fbbf24' }}>
              <div style={targetStyles.cardTitle}>{t.title}</div>
              <div style={targetStyles.cardMeta}>
                Baseline {t.baselineYear} · {Math.round(t.baselineValue).toLocaleString()} mt
                {' → '}
                Target {t.targetYear} · {Math.round(targetValue).toLocaleString()} mt
                ({t.percentReduction}% reduction)
              </div>
              <div style={targetStyles.numbersRow}>
                <div>
                  <div style={targetStyles.numLabel}>Current</div>
                  <div style={targetStyles.numVal}>{Math.round(current).toLocaleString()} mt</div>
                </div>
                <div>
                  <div style={targetStyles.numLabel}>Plan adds</div>
                  <div style={{ ...targetStyles.numVal, color: '#86efac' }}>−{Math.round(planContribution).toLocaleString()} mt</div>
                </div>
                <div>
                  <div style={targetStyles.numLabel}>Projected {t.targetYear}</div>
                  <div style={{ ...targetStyles.numVal, color: ahead ? '#86efac' : '#fbbf24' }}>{Math.round(projected).toLocaleString()} mt</div>
                </div>
                <div>
                  <div style={targetStyles.numLabel}>{ahead ? 'Surplus' : 'Gap to target'}</div>
                  <div style={{ ...targetStyles.numVal, color: ahead ? '#86efac' : '#fca5a5' }}>
                    {ahead ? '−' : '+'}{Math.round(Math.abs(gapToTarget)).toLocaleString()} mt
                  </div>
                </div>
              </div>
              <div style={targetStyles.bar}>
                <div style={{ ...targetStyles.barFill, width: `${closurePct}%`, background: ahead ? '#22c55e' : '#fbbf24' }} />
                <div style={targetStyles.barTarget} title={`Target ${Math.round(targetValue)} mt`} />
              </div>
              <div style={targetStyles.cardFoot}>
                {ahead ? 'Plan + shipped items overshoot the target — surplus available for stretch goals.'
                       : `Plan closes ${closurePct.toFixed(0)}% of the gap to target. Add ${Math.round(gapToTarget).toLocaleString()} more mt/yr to close the rest.`}
                {t.scope !== 'gross' && t.scope !== 'net' && !ahead && (
                  <span style={{ color: '#94a3b8' }}> Plan items in category={t.scope}: {items.filter((i) => i.category === t.scope).length}.</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const targetStyles = {
  wrap: { marginTop: 12, padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  label: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  grid: { display: 'grid', gap: 10 },
  card: { padding: '12px 14px', background: '#0f172a', border: '1px solid #1f2937', borderLeft: '3px solid #475569', borderRadius: 8 },
  cardTitle: { fontSize: 14, fontWeight: 700, color: '#e5e7eb' },
  cardMeta: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  numbersRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginTop: 10 },
  numLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 },
  numVal: { fontSize: 16, color: '#e5e7eb', fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums' },
  bar: { position: 'relative', marginTop: 10, height: 6, background: '#1f2937', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%' },
  barTarget: { position: 'absolute', right: 0, top: -2, bottom: -2, width: 2, background: '#86efac' },
  cardFoot: { marginTop: 8, fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 },
};

// Roll-up of the plan into actionable buckets. Sighted-only summary
// designed to answer "what can I do this quarter vs this year vs
// multi-year, and how much $ does each tier cost".
function PlanAtAGlance({ items, grossMt }) {
  const buckets = { 'this-quarter': [], 'this-year': [], 'this-3-years': [] };
  for (const it of items) {
    const t = ['this-quarter','this-year','this-3-years'].includes(it.timeline) ? it.timeline : 'this-year';
    buckets[t].push(it);
  }
  const tier = (key, label, accent) => {
    const arr = buckets[key];
    const mt = arr.reduce((s, x) => s + (x.expectedMtPerYear || 0), 0);
    const cost = arr.reduce((s, x) => s + (x.estimatedCostUsd || 0), 0);
    const noCostCount = arr.filter((x) => (x.estimatedCostUsd || 0) === 0).length;
    return { key, label, accent, count: arr.length, mt, cost, noCostCount };
  };
  const tiers = [
    tier('this-quarter', 'Quick wins (≤ 90 days)', '#86efac'),
    tier('this-year',    'This fiscal year',        '#22d3ee'),
    tier('this-3-years', 'Multi-year capital arc',  '#a855f7'),
  ];
  const totalMt = items.reduce((s, x) => s + (x.expectedMtPerYear || 0), 0);
  const totalCost = items.reduce((s, x) => s + (x.estimatedCostUsd || 0), 0);
  return (
    <div style={glanceStyles.wrap}>
      <div style={glanceStyles.label}>Plan at a glance · by timeline tier</div>
      <div style={glanceStyles.grid}>
        {tiers.map((t) => {
          const sharePct = totalMt > 0 ? (t.mt / totalMt) * 100 : 0;
          return (
            <div key={t.key} style={{ ...glanceStyles.tier, borderLeftColor: t.accent }}>
              <div style={glanceStyles.tierLabel}>{t.label}</div>
              <div style={glanceStyles.tierNums}>
                <span style={{ ...glanceStyles.tierMt, color: t.accent }}>
                  {Math.round(t.mt).toLocaleString()}<span style={glanceStyles.tierUnit}> mt/yr</span>
                </span>
                <span style={glanceStyles.tierShare}>{sharePct.toFixed(0)}% of plan</span>
              </div>
              <div style={glanceStyles.tierMeta}>
                {t.count} item{t.count === 1 ? '' : 's'} · {t.cost === 0 ? 'no capex' : `$${t.cost.toLocaleString()} capex`}
                {t.noCostCount > 0 && t.cost > 0 && ` · ${t.noCostCount} no-cost`}
              </div>
              <div style={glanceStyles.bar}>
                <div style={{ ...glanceStyles.barFill, width: `${Math.min(100, sharePct)}%`, background: t.accent }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={glanceStyles.foot}>
        Total plan: <strong>{Math.round(totalMt).toLocaleString()} mt/yr</strong>
        {' · '}
        <strong>${totalCost.toLocaleString()}</strong> capex
        {grossMt > 0 && ` · ${((totalMt / grossMt) * 100).toFixed(1)}% of current gross (${grossMt.toLocaleString()} mt)`}
      </div>
    </div>
  );
}

// Horizontal timeline placing each plan item on a quarter row. Pure
// inline blocks — works in print, no canvas / svg complexity.
function TimelineStrip({ items }) {
  const order = ['this-quarter', 'this-year', 'this-3-years'];
  const rowLabel = {
    'this-quarter': 'Q1',
    'this-year':    'FY',
    'this-3-years': '3yr',
  };
  const categoryColor = {
    scope1:      '#fbbf24',
    scope2:      '#22d3ee',
    scope3:      '#ef4444',
    sinks:       '#22c55e',
    engagement:  '#a855f7',
  };
  // Group items by timeline.
  const grouped = order.map((key) => ({
    key,
    label: rowLabel[key],
    items: items.filter((it) => (['this-quarter','this-year','this-3-years'].includes(it.timeline) ? it.timeline : 'this-year') === key),
  }));
  if (grouped.every((g) => g.items.length === 0)) return null;
  return (
    <div style={tlStyles.wrap}>
      <div style={tlStyles.label}>Items laid out by horizon · color = scope</div>
      {grouped.map((g) => (
        <div key={g.key} style={tlStyles.row}>
          <div style={tlStyles.rowLabel}>{g.label}</div>
          <div style={tlStyles.rowItems}>
            {g.items.length === 0 ? (
              <div style={tlStyles.empty}>(none in this horizon)</div>
            ) : (
              g.items.map((it, i) => (
                <div
                  key={it.id || i}
                  style={{ ...tlStyles.chip, borderLeftColor: categoryColor[it.category] || '#475569' }}
                  title={`${it.title} — ${it.expectedMtPerYear} mt/yr · ${it.estimatedCostUsd === 0 ? 'no capex' : '$' + it.estimatedCostUsd.toLocaleString()}`}
                >
                  <div style={tlStyles.chipTitle}>{it.title}</div>
                  <div style={tlStyles.chipMeta}>
                    {it.expectedMtPerYear} mt · {it.estimatedCostUsd === 0 ? 'no capex' : '$' + Math.round(it.estimatedCostUsd / 1000) + 'K'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
      <div style={tlStyles.legend}>
        {Object.entries(categoryColor).map(([cat, color]) => (
          <span key={cat} style={tlStyles.legendItem}>
            <span style={{ ...tlStyles.legendSwatch, background: color }} />
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}

const glanceStyles = {
  wrap: { marginTop: 16, padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  label: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 },
  tier: { padding: '10px 12px', background: '#0f172a', border: '1px solid #1f2937', borderLeft: '3px solid #475569', borderRadius: 6 },
  tierLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 },
  tierNums: { display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 },
  tierMt: { fontSize: 20, fontWeight: 800, fontVariantNumeric: 'tabular-nums' },
  tierUnit: { fontSize: 11, fontWeight: 600, color: '#94a3b8' },
  tierShare: { fontSize: 12, color: '#64748b' },
  tierMeta: { marginTop: 6, fontSize: 12, color: '#cbd5e1' },
  bar: { marginTop: 8, height: 4, background: '#1f2937', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%' },
  foot: { marginTop: 12, paddingTop: 10, borderTop: '1px solid #1f2937', fontSize: 12, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' },
};

const tlStyles = {
  wrap: { marginTop: 12, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  label: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  row: { display: 'grid', gridTemplateColumns: '50px 1fr', gap: 10, alignItems: 'flex-start', marginTop: 6 },
  rowLabel: { fontSize: 11, fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 0.5, padding: '4px 6px', background: '#0f172a', borderRadius: 4, textAlign: 'center', alignSelf: 'flex-start' },
  rowItems: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  empty: { fontSize: 12, color: '#64748b', fontStyle: 'italic', padding: '4px 0' },
  chip: { padding: '6px 10px', background: '#0f172a', border: '1px solid #1f2937', borderLeft: '3px solid #475569', borderRadius: 4, minWidth: 140, maxWidth: 260 },
  chipTitle: { fontSize: 12, color: '#e5e7eb', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  chipMeta: { fontSize: 10, color: '#94a3b8', marginTop: 2, fontVariantNumeric: 'tabular-nums' },
  legend: { marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, paddingTop: 8, borderTop: '1px solid #1f2937' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 4 },
  legendSwatch: { width: 10, height: 10, borderRadius: 2, display: 'inline-block' },
};

// Tiny inline sparkline showing the year-by-year mt ramp for a plan
// item. Used to communicate "this isn't instant — heat-pump conversion
// hits steady-state in Y3" vs "LED retrofit is full-impact by Q2".
function RampSparkline({ yearByYear, color = '#22d3ee' }) {
  if (!Array.isArray(yearByYear) || yearByYear.length < 2) return null;
  const w = 90;
  const h = 22;
  const padX = 2;
  const padY = 2;
  const max = Math.max(...yearByYear, 1);
  const step = (w - padX * 2) / (yearByYear.length - 1);
  const y = (v) => padY + (1 - v / max) * (h - padY * 2);
  const points = yearByYear.map((v, i) => `${(padX + i * step).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const lastX = (padX + (yearByYear.length - 1) * step).toFixed(1);
  const lastY = y(yearByYear[yearByYear.length - 1]).toFixed(1);
  return (
    <div style={{ marginTop: 6, textAlign: 'right' }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Year-by-year ramp: ${yearByYear.map((v) => Math.round(v)).join(', ')} mt/yr`} style={{ display: 'inline-block' }}>
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
        <circle cx={padX} cy={y(yearByYear[0])} r="2" fill={color} opacity="0.6" />
        <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
        <title>Y1 → Y{yearByYear.length} ramp: {yearByYear.map((v) => Math.round(v)).join(' → ')} mt/yr</title>
      </svg>
      <div style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 1 }}>
        Y1 → Y{yearByYear.length} ramp
      </div>
    </div>
  );
}

// Toggle bar — Compact ↔ Detailed view for the plan-item list.
function PlanItemViewToggle({ count, mode, onChange }) {
  return (
    <div style={toggleStyles.wrap}>
      <div style={toggleStyles.label}>
        Item view ({count}):
      </div>
      <button
        type="button"
        onClick={() => onChange('compact')}
        style={mode === 'compact' ? toggleStyles.btnActive : toggleStyles.btn}
        aria-pressed={mode === 'compact'}
      >
        Compact
      </button>
      <button
        type="button"
        onClick={() => onChange('detailed')}
        style={mode === 'detailed' ? toggleStyles.btnActive : toggleStyles.btn}
        aria-pressed={mode === 'detailed'}
      >
        Detailed
      </button>
    </div>
  );
}

const toggleStyles = {
  wrap: { display: 'flex', gap: 8, alignItems: 'center', marginTop: 16, marginBottom: 8 },
  label: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  btn: { padding: '4px 10px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
  btnActive: { padding: '4px 10px', background: '#0e3a5f', color: '#22d3ee', border: '1px solid #22d3ee', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
};

function PlanCard({ item, rank, context, compact, onComplete, onDecline, onReplace, otherItems }) {
  const [memo, setMemo] = useState(null);     // { mode, memo, generatedAt } | null
  const [memoBusy, setMemoBusy] = useState(false);
  const [memoErr, setMemoErr] = useState(null);

  // Per-item follow-up chat thread. Closed by default; opens when
  // admin clicks "Ask follow-up". Persists for the page lifecycle.
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]); // [{role,content}]
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const [chatErr, setChatErr] = useState(null);
  // Alternative-generation state.
  const [alts, setAlts] = useState(null);  // { alternatives: [...] } | null
  const [altsBusy, setAltsBusy] = useState(false);
  const [altsErr, setAltsErr] = useState(null);
  // Last reason the admin supplied — kept so the Retry button can
  // re-issue the request without re-prompting.
  const [lastAltsReason, setLastAltsReason] = useState(null);

  async function fetchAlternatives(reason) {
    setAltsBusy(true);
    setAltsErr(null);
    try {
      const r = await adminFetch('/api/admin/plan-item-alternatives', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ item, context, otherItems, reason: reason || '', stream: true }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${r.status}`);
      }
      const result = await parseSSE(r);
      setAlts(result);
    } catch (err) {
      setAltsErr(err.message);
    } finally {
      setAltsBusy(false);
    }
  }

  async function generateAlternatives() {
    const reason = window.prompt(
      `What\'s wrong with this item? Tell the agent so it can tune the alternatives.\n\n(e.g. "Too aggressive — board won\'t fund $300K this year", "Already declined this in Q1", "Need something faster — 90-day timeline")`,
      ''
    );
    if (reason === null) return;
    setLastAltsReason(reason);
    return fetchAlternatives(reason);
  }

  function retryAlternatives() {
    return fetchAlternatives(lastAltsReason);
  }

  async function generateMemo() {
    setMemoBusy(true);
    setMemoErr(null);
    try {
      const r = await adminFetch('/api/admin/plan-item-memo', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ item, context, stream: true }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${r.status}`);
      }
      const result = await parseSSE(r);
      setMemo(result);
    } catch (err) {
      setMemoErr(err.message);
    } finally {
      setMemoBusy(false);
    }
  }

  async function sendChat() {
    const trimmed = chatInput.trim();
    if (!trimmed || chatBusy) return;
    const nextMessages = [...chatMessages, { role: 'user', content: trimmed }];
    setChatMessages(nextMessages);
    setChatInput('');
    setChatBusy(true);
    setChatErr(null);
    // Placeholder assistant turn that streaming will fill.
    setChatMessages([...nextMessages, { role: 'assistant', content: '' }]);
    try {
      const r = await adminFetch('/api/admin/plan-item-chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          item,
          context,
          memo: memo?.memo || null,
          messages: nextMessages,
          stream: true,
        }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${r.status}`);
      }
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accum = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf('\n\n')) >= 0) {
          const chunk = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const eventLine = chunk.split('\n').find((l) => l.startsWith('event: '));
          const dataLine  = chunk.split('\n').find((l) => l.startsWith('data: '));
          if (!eventLine || !dataLine) continue;
          const event = eventLine.slice(7).trim();
          let payload = null;
          try { payload = JSON.parse(dataLine.slice(6)); } catch {}
          if (!payload) continue;
          if (event === 'delta') {
            accum += payload.text || '';
            setChatMessages((cur) => {
              const out = cur.slice(0, -1);
              out.push({ role: 'assistant', content: accum });
              return out;
            });
          } else if (event === 'done') {
            setChatMessages((cur) => {
              const out = cur.slice(0, -1);
              out.push({ role: 'assistant', content: payload.reply });
              return out;
            });
          } else if (event === 'error') {
            throw new Error(payload.message || 'stream error');
          }
        }
      }
    } catch (err) {
      setChatErr(err.message);
      setChatMessages((cur) => cur.slice(0, -1));
    } finally {
      setChatBusy(false);
    }
  }
  const color = CATEGORY_COLORS[item.category] || '#94a3b8';
  return (
    <div style={{ ...styles.planCard, borderLeftColor: color }}>
      <div style={styles.planHead}>
        <div style={styles.planRank}>#{rank}</div>
        <div style={{ flex: 1 }}>
          <div style={styles.planTitle}>{item.title}</div>
          <div style={styles.planMeta}>
            <Pill kind="info">{item.category}</Pill>
            <Pill kind={item.difficulty === 'easy' ? 'good' : item.difficulty === 'hard' ? 'bad' : 'warn'}>{item.difficulty}</Pill>
            <Pill kind="neutral">{TIMELINE_LABELS[item.timeline] || item.timeline}</Pill>
            <Pill kind="neutral">owner: {item.ownerRole}</Pill>
            <ProvenancePill provenance={item.provenance} />
          </div>
        </div>
        <div style={styles.planNums}>
          <div style={styles.planMt}>{Math.round(item.expectedMtPerYear).toLocaleString()}<span style={styles.planNumUnit}>mt/yr</span></div>
          <div style={styles.planCost}>
            {item.estimatedCostUsd === 0 ? 'no capex' : `$${item.estimatedCostUsd.toLocaleString()}`}
            {item.paybackYears > 0 && item.estimatedCostUsd > 0 && (
              <span style={styles.planPayback}> · {item.paybackYears.toFixed(0)}yr payback</span>
            )}
          </div>
          {Array.isArray(item.yearByYearMt) && item.yearByYearMt.length > 1 && (
            <RampSparkline yearByYear={item.yearByYearMt} color={color} />
          )}
        </div>
      </div>
      {!compact && <div style={styles.planWhy}>{item.why}</div>}

      {!compact && Array.isArray(item.firstSteps) && item.firstSteps.length > 0 && (
        <DetailBlock title="First steps" accent="#22d3ee">
          <ol style={detailListStyles.ol}>
            {item.firstSteps.map((s, i) => <li key={i} style={detailListStyles.li}>{s}</li>)}
          </ol>
        </DetailBlock>
      )}

      {!compact && item.dependencies && item.dependencies !== 'none' && (
        <DetailBlock title="Dependencies" accent="#fbbf24">
          <div style={styles.planListProse}>{item.dependencies}</div>
        </DetailBlock>
      )}

      {!compact && Array.isArray(item.milestones) && item.milestones.length > 0 && (
        <DetailBlock title="Milestones" accent="#86efac">
          <ul style={detailListStyles.ul}>
            {item.milestones.map((m, i) => <li key={i} style={detailListStyles.li}>{m}</li>)}
          </ul>
        </DetailBlock>
      )}

      {!compact && Array.isArray(item.risks) && item.risks.length > 0 && (
        <DetailBlock title="Risks" accent="#fca5a5">
          <ul style={detailListStyles.ul}>
            {item.risks.map((r, i) => <li key={i} style={detailListStyles.li}>{r}</li>)}
          </ul>
        </DetailBlock>
      )}

      {!compact && Array.isArray(item.kpis) && item.kpis.length > 0 && (
        <DetailBlock title="KPIs" accent="#a855f7">
          <ul style={detailListStyles.ul}>
            {item.kpis.map((k, i) => <li key={i} style={detailListStyles.li}>{k}</li>)}
          </ul>
        </DetailBlock>
      )}

      {!compact && item.dataSource && (
        <div style={styles.planSource}>
          <span style={styles.planSourceLabel}>Data source:</span> {item.dataSource}
        </div>
      )}
      <div style={styles.planActions}>
        <button type="button" onClick={onComplete} style={styles.completeBtn}>Mark shipped ✓</button>
        <button type="button" onClick={onDecline}  style={styles.declineBtn}>Take off the table</button>
        {!memo && (
          <button type="button" onClick={generateMemo} disabled={memoBusy} style={styles.memoBtn}>
            {memoBusy ? 'Generating memo…' : '📝 Implementation memo'}
          </button>
        )}
        {memo && (
          <button type="button" onClick={() => setMemo(null)} style={styles.memoBtn}>
            ✕ Hide memo
          </button>
        )}
        <button type="button" onClick={() => setChatOpen((v) => !v)} style={styles.chatToggleBtn}>
          {chatOpen ? '✕ Close chat' : `💬 Ask follow-up${chatMessages.length > 0 ? ` (${chatMessages.length})` : ''}`}
        </button>
        <button type="button" onClick={generateAlternatives} disabled={altsBusy} style={styles.altsBtn}>
          {altsBusy ? 'Finding alternatives…' : '↻ Find alternatives'}
        </button>
      </div>
      <AIError label="Alternatives error" error={altsErr} onRetry={retryAlternatives} busy={altsBusy} />
      {alts && alts.alternatives && alts.alternatives.length > 0 && (
        <div style={altsStyles.wrap}>
          <div style={altsStyles.head}>
            <span style={altsStyles.headLabel}>Alternatives proposed for #{rank}</span>
            <button type="button" onClick={() => setAlts(null)} style={altsStyles.hide}>✕ Hide</button>
          </div>
          {alts.alternatives.map((a, i) => (
            <div key={i} style={altsStyles.card}>
              <div style={altsStyles.cardHead}>
                <span style={altsStyles.cardTitle}>{a.title}</span>
                <span style={altsStyles.cardMt}>{Math.round(a.expectedMtPerYear)} mt/yr</span>
                <span style={altsStyles.cardCost}>{a.estimatedCostUsd === 0 ? 'no capex' : `$${a.estimatedCostUsd.toLocaleString()}`}</span>
              </div>
              <div style={altsStyles.cardWhy}>{a.why}</div>
              {onReplace && (
                <button type="button" onClick={() => { if (window.confirm(`Replace #${rank} "${item.title}" with "${a.title}"?`)) { onReplace(a); setAlts(null); } }} style={altsStyles.swapBtn}>
                  ⇄ Swap into #{rank}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <AIError label="Memo error" error={memoErr} onRetry={generateMemo} busy={memoBusy} />
      {memo && memo.mode === 'unavailable' && (
        <div style={styles.memoUnavail}>{memo.message || 'LLM not configured.'}</div>
      )}
      {memo && memo.mode === 'llm' && memo.memo && (
        <ImplementationMemo memo={memo.memo} generatedAt={memo.generatedAt} />
      )}
      {chatOpen && (
        <ChatThread
          messages={chatMessages}
          input={chatInput}
          setInput={setChatInput}
          onSend={sendChat}
          busy={chatBusy}
          error={chatErr}
          itemTitle={item.title}
        />
      )}
    </div>
  );
}

function ChatThread({ messages, input, setInput, onSend, busy, error, itemTitle }) {
  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }
  return (
    <div style={chatStyles.wrap}>
      <div style={chatStyles.label}>Follow-up · pinned to "{itemTitle}"</div>
      <div style={chatStyles.thread} role="log" aria-live="polite">
        {messages.length === 0 && (
          <div style={chatStyles.empty}>
            Ask anything about this item — alternatives, draft talking points,
            sensitivity analysis if the budget changes, etc.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={m.role === 'user' ? chatStyles.userTurn : chatStyles.assistantTurn}>
            <div style={chatStyles.turnRole}>{m.role === 'user' ? 'You' : 'Agent'}</div>
            <div style={chatStyles.turnContent}>{m.content}</div>
          </div>
        ))}
        {busy && (
          <div style={chatStyles.assistantTurn}>
            <div style={chatStyles.turnRole}>Agent</div>
            <div style={{ ...chatStyles.turnContent, color: '#94a3b8', fontStyle: 'italic' }}>thinking…</div>
          </div>
        )}
      </div>
      {error && <div role="alert" style={chatStyles.err}>{error}</div>}
      <div style={chatStyles.composer}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Ask a follow-up — enter to send, shift+enter for a new line."
          aria-label={`Follow-up question for ${itemTitle}`}
          rows={2}
          disabled={busy}
          style={chatStyles.input}
        />
        <button type="button" onClick={onSend} disabled={busy || !input.trim()} style={chatStyles.sendBtn}>
          Send
        </button>
      </div>
    </div>
  );
}

const chatStyles = {
  wrap: { marginTop: 14, padding: '12px 14px', background: '#0f172a', border: '1px solid #1f2937', borderLeft: '3px solid #22d3ee', borderRadius: 8 },
  label: { fontSize: 11, fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  thread: { display: 'grid', gap: 8, maxHeight: 360, overflowY: 'auto' },
  empty: { padding: '10px 12px', background: '#0b1220', border: '1px dashed #334155', borderRadius: 6, color: '#64748b', fontSize: 12, fontStyle: 'italic' },
  userTurn: { padding: '8px 12px', background: '#0b1220', borderLeft: '3px solid #22d3ee', borderRadius: '0 6px 6px 0' },
  assistantTurn: { padding: '8px 12px', background: '#0b1220', borderLeft: '3px solid #a855f7', borderRadius: '0 6px 6px 0' },
  turnRole: { fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
  turnContent: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.55, whiteSpace: 'pre-wrap' },
  composer: { display: 'flex', gap: 8, marginTop: 10, alignItems: 'flex-end' },
  input: { flex: 1, padding: '8px 10px', background: '#0b1220', border: '1px solid #334155', borderRadius: 6, color: '#e5e7eb', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', minHeight: 44 },
  sendBtn: { padding: '8px 16px', background: '#0e3a1f', color: '#86efac', border: '1px solid #16a34a', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  err: { marginTop: 8, padding: '8px 12px', background: '#3a0d0d', border: '1px solid #7f1d1d', borderRadius: 6, color: '#fca5a5', fontSize: 12 },
};

function ImplementationMemo({ memo, generatedAt }) {
  return (
    <div style={memoStyles.wrap}>
      <div style={memoStyles.head}>
        <span style={memoStyles.headLabel}>Implementation memo</span>
        <span style={memoStyles.headDate}>generated {new Date(generatedAt).toLocaleString()}</span>
      </div>
      {memo.executiveSummary && (
        <p style={memoStyles.execSummary}>{memo.executiveSummary}</p>
      )}

      {memo.weeklySchedule && memo.weeklySchedule.length > 0 && (
        <MemoSection title="Weekly schedule">
          <div style={memoStyles.weekList}>
            {memo.weeklySchedule.map((w, i) => (
              <div key={i} style={memoStyles.weekRow}>
                <div style={memoStyles.weekNum}>Week {w.week}</div>
                <div>
                  <div style={memoStyles.weekFocus}>{w.focus}</div>
                  <ul style={memoStyles.weekActions}>
                    {(w.actions || []).map((a, j) => <li key={j} style={memoStyles.weekAction}>{a}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </MemoSection>
      )}

      {memo.stakeholderMap && memo.stakeholderMap.length > 0 && (
        <MemoSection title="Stakeholder map">
          <div style={memoStyles.stakeList}>
            {memo.stakeholderMap.map((s, i) => (
              <div key={i} style={memoStyles.stakeRow}>
                <div style={memoStyles.stakeRole}>{s.role}</div>
                <div style={memoStyles.stakeWhen}>{s.when}</div>
                <div style={memoStyles.stakeWhy}>{s.why}</div>
              </div>
            ))}
          </div>
        </MemoSection>
      )}

      {memo.outreachTemplates && memo.outreachTemplates.length > 0 && (
        <MemoSection title="Outreach templates">
          {memo.outreachTemplates.map((t, i) => (
            <div key={i} style={memoStyles.email}>
              <div style={memoStyles.emailMeta}><strong>To:</strong> {t.to}</div>
              <div style={memoStyles.emailMeta}><strong>Subject:</strong> {t.subject}</div>
              <div style={memoStyles.emailDraft}>{t.draft}</div>
            </div>
          ))}
        </MemoSection>
      )}

      {memo.approvalsRequired && memo.approvalsRequired.length > 0 && (
        <MemoSection title="Approvals required">
          <ul style={memoStyles.bulletList}>
            {memo.approvalsRequired.map((a, i) => <li key={i} style={memoStyles.bullet}>{a}</li>)}
          </ul>
        </MemoSection>
      )}

      {memo.budgetBreakdown && memo.budgetBreakdown.length > 0 && (
        <MemoSection title="Budget breakdown">
          <table style={memoStyles.budgetTable}>
            <tbody>
              {memo.budgetBreakdown.map((b, i) => (
                <tr key={i}>
                  <td style={memoStyles.budgetLine}>{b.line}{b.note && <span style={memoStyles.budgetNote}> — {b.note}</span>}</td>
                  <td style={memoStyles.budgetAmt}>{b.amountUsd === 0 ? '—' : `$${b.amountUsd.toLocaleString()}`}</td>
                </tr>
              ))}
              <tr style={memoStyles.budgetTotal}>
                <td style={memoStyles.budgetLine}><strong>Total</strong></td>
                <td style={memoStyles.budgetAmt}><strong>${memo.budgetBreakdown.reduce((s, b) => s + (b.amountUsd || 0), 0).toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
        </MemoSection>
      )}

      {memo.successMetrics && memo.successMetrics.length > 0 && (
        <MemoSection title="Success metrics">
          <ul style={memoStyles.bulletList}>
            {memo.successMetrics.map((m, i) => <li key={i} style={memoStyles.bullet}>{m}</li>)}
          </ul>
        </MemoSection>
      )}

      {memo.failureModes && memo.failureModes.length > 0 && (
        <MemoSection title="Failure modes + mitigations">
          {memo.failureModes.map((f, i) => (
            <div key={i} style={memoStyles.riskBlock}>
              <div style={memoStyles.riskLabel}><strong>Risk:</strong> {f.risk}</div>
              <div style={memoStyles.mitigLabel}><strong>Mitigation:</strong> {f.mitigation}</div>
            </div>
          ))}
        </MemoSection>
      )}

      {memo.communicationPlan && memo.communicationPlan.length > 0 && (
        <MemoSection title="Communication plan">
          <div style={memoStyles.commList}>
            {memo.communicationPlan.map((c, i) => (
              <div key={i} style={memoStyles.commRow}>
                <div style={memoStyles.commAud}>{c.audience}</div>
                <div style={memoStyles.commChannel}>{c.channel}</div>
                <div style={memoStyles.commMsg}>{c.message}</div>
              </div>
            ))}
          </div>
        </MemoSection>
      )}
    </div>
  );
}

// Reusable error pill for AI requests. Shows the failure message + an
// optional Retry button (caller passes onRetry). Exported so the AI
// ingestion page can use the same look.
export function AIError({ label, error, onRetry, busy }) {
  if (!error) return null;
  return (
    <div role="alert" style={aiErrorStyles.wrap}>
      <span style={aiErrorStyles.label}>{label || 'AI error'}:</span>
      <span style={aiErrorStyles.body}>{error}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={busy}
          style={{ ...aiErrorStyles.retry, opacity: busy ? 0.5 : 1, cursor: busy ? 'wait' : 'pointer' }}
          title="Try the request again."
        >
          {busy ? 'Retrying…' : '↻ Retry'}
        </button>
      )}
    </div>
  );
}

const aiErrorStyles = {
  wrap: {
    marginTop: 8,
    padding: '8px 12px',
    background: '#3a0d0d',
    border: '1px solid #7f1d1d',
    borderRadius: 6,
    color: '#fca5a5',
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  label: { fontWeight: 700 },
  body:  { flex: '1 1 auto', wordBreak: 'break-word' },
  retry: {
    padding: '4px 10px',
    background: 'transparent',
    color: '#fca5a5',
    border: '1px solid #fca5a5',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 700,
    fontFamily: 'inherit',
  },
};

// Phase 150: AI-narrated diff between the prior plan and the freshly
// regenerated one. Renders the headline + summary + grouped
// added/removed/evolved chips. Caller decides when it appears
// (right after a regenerate when priorPlan was non-empty).
function PlanDiffCard({ diff, busy, error, onDismiss }) {
  if (busy && !diff) {
    return (
      <div role="status" style={diffCardStyles.wrap}>
        <span style={diffCardStyles.label}>Narrating the diff…</span>
      </div>
    );
  }
  if (error && !diff) {
    return (
      <div role="alert" style={{ ...diffCardStyles.wrap, borderLeftColor: '#7f1d1d' }}>
        <span style={diffCardStyles.label}>Diff narrative error:</span>
        <span style={{ color: '#fca5a5' }}>{error}</span>
      </div>
    );
  }
  if (!diff || !diff.diff) return null;
  const d = diff.diff;
  return (
    <div style={diffCardStyles.wrap}>
      <div style={diffCardStyles.head}>
        <span style={diffCardStyles.label}>📋 What changed</span>
        <button type="button" onClick={onDismiss} style={diffCardStyles.dismiss} aria-label="Dismiss diff card">
          ✕
        </button>
      </div>
      <p style={diffCardStyles.headline}>{d.headline}</p>
      {d.summary && <p style={diffCardStyles.summary}>{d.summary}</p>}
      <div style={diffCardStyles.groups}>
        {d.added && d.added.length > 0 && (
          <div style={diffCardStyles.group}>
            <div style={{ ...diffCardStyles.groupLabel, color: '#86efac' }}>+ Added ({d.added.length})</div>
            <ul style={diffCardStyles.list}>
              {d.added.map((x, i) => <li key={i} style={diffCardStyles.li}>{x}</li>)}
            </ul>
          </div>
        )}
        {d.removed && d.removed.length > 0 && (
          <div style={diffCardStyles.group}>
            <div style={{ ...diffCardStyles.groupLabel, color: '#fca5a5' }}>− Removed ({d.removed.length})</div>
            <ul style={diffCardStyles.list}>
              {d.removed.map((x, i) => <li key={i} style={diffCardStyles.li}>{x}</li>)}
            </ul>
          </div>
        )}
        {d.evolved && d.evolved.length > 0 && (
          <div style={diffCardStyles.group}>
            <div style={{ ...diffCardStyles.groupLabel, color: '#fbbf24' }}>~ Evolved ({d.evolved.length})</div>
            <ul style={diffCardStyles.list}>
              {d.evolved.map((x, i) => <li key={i} style={diffCardStyles.li}>{x}</li>)}
            </ul>
          </div>
        )}
        {typeof d.unchanged === 'number' && d.unchanged > 0 && (
          <div style={diffCardStyles.group}>
            <div style={{ ...diffCardStyles.groupLabel, color: '#94a3b8' }}>= Unchanged</div>
            <div style={{ fontSize: 13, color: '#cbd5e1' }}>{d.unchanged} item{d.unchanged === 1 ? '' : 's'} kept as-is</div>
          </div>
        )}
      </div>
    </div>
  );
}

const diffCardStyles = {
  wrap: { marginBottom: 16, padding: '14px 18px', background: '#0f172a', border: '1px solid #312e81', borderLeft: '4px solid #6366f1', borderRadius: 10 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  label: { fontSize: 11, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: 0.6 },
  dismiss: { width: 24, height: 24, borderRadius: 12, background: 'transparent', color: '#94a3b8', border: '1px solid #334155', fontSize: 12, cursor: 'pointer', padding: 0, fontWeight: 700 },
  headline: { margin: 0, fontSize: 14, color: '#e5e7eb', fontWeight: 700, lineHeight: 1.5 },
  summary: { margin: '6px 0 0', fontSize: 13, color: '#cbd5e1', lineHeight: 1.55 },
  groups: { marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 },
  group: { padding: '8px 10px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  groupLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  list: { margin: 0, paddingLeft: 16, fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 },
  li: { marginBottom: 3 },
};

// Aggregate calibration of expected vs actual across shipped items.
// Hidden until there are at least 2 items with both numbers; below
// that, the sample is too small for "estimates run X% high/low" to
// mean anything. Exported for unit testing.
export function CalibrationBadge({ completed }) {
  const both = (completed || []).filter((c) => {
    const e = Number(c.expectedMt);
    const a = Number(c.mtSaved);
    return Number.isFinite(e) && e > 0 && Number.isFinite(a) && a >= 0;
  });
  if (both.length < 2) return null;
  const totalExpected = both.reduce((s, c) => s + Number(c.expectedMt), 0);
  const totalActual = both.reduce((s, c) => s + Number(c.mtSaved), 0);
  const variancePct = ((totalActual - totalExpected) / totalExpected) * 100;
  const sign = variancePct >= 0 ? '+' : '';
  const color = variancePct >= 5 ? '#86efac' : variancePct <= -5 ? '#fbbf24' : '#cbd5e1';
  const verdict = variancePct >= 5
    ? 'beating estimates'
    : variancePct <= -5
      ? 'underdelivering vs estimates'
      : 'tracking estimates';
  return (
    <div
      role="status"
      style={{
        margin: '6px 0 10px',
        padding: '8px 12px',
        background: '#0b1220',
        border: '1px solid #1f2937',
        borderLeft: `4px solid ${color}`,
        borderRadius: 6,
        fontSize: 12,
        color: '#cbd5e1',
      }}
    >
      <strong style={{ color, fontWeight: 800 }}>{sign}{variancePct.toFixed(1)}%</strong>
      {' '}across <strong>{both.length}</strong> shipped item{both.length === 1 ? '' : 's'} —
      {' '}actuals {Math.round(totalActual).toLocaleString()} mt vs estimate {Math.round(totalExpected).toLocaleString()} mt
      {' · '}<span style={{ color }}>{verdict}</span>
    </div>
  );
}

// Cumulative reduction chart — plots running total of mt saved as
// items have been marked shipped, against the gross-emissions
// baseline. Pure inline SVG so it renders without a chart library.
function CumulativeReductionChart({ completed, grossMt }) {
  if (!completed || completed.length === 0) return null;

  const W = 720;
  const H = 200;
  const pad = { t: 14, r: 80, b: 28, l: 60 };

  // Sort by shipped date, build cumulative series.
  const sorted = [...completed]
    .map((c) => ({ ...c, ts: new Date(c.when).getTime() }))
    .sort((a, b) => a.ts - b.ts);
  let running = 0;
  const points = sorted.map((c) => {
    running += Number(c.mtSaved) || 0;
    return { ts: c.ts, cumul: running, title: c.title };
  });
  const totalSaved = points[points.length - 1].cumul;
  const baseline = grossMt || 0;
  const tMin = points[0].ts;
  const tMax = points[points.length - 1].ts;
  const tSpan = Math.max(tMax - tMin, 24 * 60 * 60 * 1000);
  // Y axis: 0 → max(totalSaved, 25% of baseline) so the early-stage
  // chart looks meaningful instead of compressing into the bottom row.
  const yMax = Math.max(totalSaved, baseline > 0 ? baseline * 0.25 : 50, 10);
  const x = (t) => pad.l + ((t - tMin) / tSpan) * (W - pad.l - pad.r);
  const y = (v) => pad.t + (1 - v / yMax) * (H - pad.t - pad.b);

  // Build the cumulative-line path. Use step-after so each shipped
  // item shows as a vertical jump.
  let d = `M ${x(points[0].ts).toFixed(1)} ${y(0).toFixed(1)}`;
  let prev = 0;
  for (const p of points) {
    d += ` L ${x(p.ts).toFixed(1)} ${y(prev).toFixed(1)}`;
    d += ` L ${x(p.ts).toFixed(1)} ${y(p.cumul).toFixed(1)}`;
    prev = p.cumul;
  }
  d += ` L ${(W - pad.r).toFixed(1)} ${y(prev).toFixed(1)}`;

  // Gridlines at quarter intervals.
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax].map((v) => ({
    value: v,
    y: y(v),
  }));

  // Target reference: 50% of baseline (the most-common KUA target).
  // Only draw if baseline is known.
  const targetMt = baseline > 0 ? baseline * 0.5 : null;
  const targetY = targetMt != null ? y(targetMt) : null;
  const pctOfBaseline = baseline > 0 ? (totalSaved / baseline) * 100 : null;

  return (
    <div style={chartStyles.wrap}>
      <div style={chartStyles.head}>
        <div>
          <div style={chartStyles.headLabel}>Cumulative shipped reductions</div>
          <div style={chartStyles.headValue}>
            {Math.round(totalSaved).toLocaleString()}<span style={chartStyles.headUnit}> mtCO₂e/yr</span>
            {pctOfBaseline != null && (
              <span style={chartStyles.headPct}> · {pctOfBaseline.toFixed(1)}% of gross</span>
            )}
          </div>
        </div>
      </div>
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Cumulative reductions chart: ${Math.round(totalSaved)} mt across ${points.length} shipped items`}
        style={{ display: 'block', maxWidth: '100%' }}
      >
        {/* Y axis gridlines + labels */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={t.y} y2={t.y} stroke="#1f2937" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '2 4'} />
            <text x={pad.l - 8} y={t.y + 4} fill="#64748b" fontSize="11" textAnchor="end" fontFamily="ui-monospace, monospace">
              {Math.round(t.value)}
            </text>
          </g>
        ))}
        {/* Target line @ 50% of baseline */}
        {targetY != null && targetY > pad.t && targetY < H - pad.b && (
          <g>
            <line x1={pad.l} x2={W - pad.r} y1={targetY} y2={targetY} stroke="#16a34a" strokeWidth="1.5" strokeDasharray="6 4" />
            <text x={W - pad.r + 6} y={targetY + 4} fill="#86efac" fontSize="11" fontWeight="700">
              50% target
            </text>
          </g>
        )}
        {/* Cumulative line */}
        <path d={d} stroke="#22d3ee" strokeWidth="2" fill="none" />
        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={x(p.ts)} cy={y(p.cumul)} r="4" fill="#22d3ee" stroke="#0b1220" strokeWidth="2">
              <title>{p.title} — cumulative {Math.round(p.cumul)} mt</title>
            </circle>
          </g>
        ))}
        {/* X axis endpoints */}
        <text x={pad.l} y={H - 8} fill="#64748b" fontSize="11" fontFamily="ui-monospace, monospace">
          {new Date(tMin).toLocaleDateString()}
        </text>
        <text x={W - pad.r} y={H - 8} fill="#64748b" fontSize="11" textAnchor="end" fontFamily="ui-monospace, monospace">
          {new Date(tMax).toLocaleDateString()}
        </text>
        {/* Y axis label */}
        <text x={pad.l - 50} y={pad.t + (H - pad.t - pad.b) / 2} fill="#64748b" fontSize="11"
              transform={`rotate(-90 ${pad.l - 50} ${pad.t + (H - pad.t - pad.b) / 2})`} textAnchor="middle">
          mtCO₂e/yr
        </text>
      </svg>
    </div>
  );
}

const chartStyles = {
  wrap: { marginBottom: 16, padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #22d3ee', borderRadius: 8 },
  head: { marginBottom: 10 },
  headLabel: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6 },
  headValue: { fontSize: 22, fontWeight: 800, color: '#86efac', marginTop: 4, fontVariantNumeric: 'tabular-nums' },
  headUnit: { fontSize: 11, fontWeight: 600, color: '#94a3b8' },
  headPct: { fontSize: 13, fontWeight: 600, color: '#64748b' },
};

// Wraps the six plan-overview components in collapsible panels so
// admins can hide the ones they don't care about. Default-open state
// persists in localStorage per-section so admin's collapse preferences
// stick across sessions. "Show all" / "Hide all" buttons toggle every
// panel at once.
const OVERVIEW_PREFS_KEY = 'kua_admin_plan_overview_prefs';
const OVERVIEW_SECTIONS = [
  { key: 'glance',     label: 'Plan at a glance',         defaultOpen: true,  Component: PlanAtAGlance },
  { key: 'projection', label: '5-year projection',        defaultOpen: true,  Component: ProjectionChart },
  { key: 'targets',    label: 'vs reduction targets',     defaultOpen: true,  Component: TargetProgress },
  { key: 'efficiency', label: 'Cost-effectiveness',       defaultOpen: false, Component: EfficiencyLeaderboard },
  { key: 'budget',     label: 'Budget optimizer',         defaultOpen: false, Component: BudgetOptimizer },
  { key: 'timeline',   label: 'Timeline strip',           defaultOpen: false, Component: TimelineStrip },
];

function PlanOverview({ items, grossMt, live, alreadyShippedMt }) {
  const [openMap, setOpenMap] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(OVERVIEW_PREFS_KEY) || 'null');
      if (stored && typeof stored === 'object') return stored;
    } catch {}
    const seed = {};
    for (const s of OVERVIEW_SECTIONS) seed[s.key] = s.defaultOpen;
    return seed;
  });

  useEffect(() => {
    try { localStorage.setItem(OVERVIEW_PREFS_KEY, JSON.stringify(openMap)); } catch {}
  }, [openMap]);

  const allOpen = OVERVIEW_SECTIONS.every((s) => openMap[s.key]);
  const noneOpen = OVERVIEW_SECTIONS.every((s) => !openMap[s.key]);

  function toggleAll(open) {
    const next = {};
    for (const s of OVERVIEW_SECTIONS) next[s.key] = open;
    setOpenMap(next);
  }

  return (
    <div>
      <div style={overviewStyles.bar}>
        <div style={overviewStyles.barLabel}>Overview sections</div>
        <button type="button" onClick={() => toggleAll(true)}  disabled={allOpen}  style={overviewStyles.barBtn}>Show all</button>
        <button type="button" onClick={() => toggleAll(false)} disabled={noneOpen} style={overviewStyles.barBtn}>Hide all</button>
      </div>
      {OVERVIEW_SECTIONS.map(({ key, label, Component }) => {
        const open = !!openMap[key];
        return (
          <div key={key} style={overviewStyles.panel}>
            <button
              type="button"
              onClick={() => setOpenMap((m) => ({ ...m, [key]: !m[key] }))}
              aria-expanded={open}
              aria-controls={`overview-${key}`}
              style={overviewStyles.toggle}
            >
              <span style={overviewStyles.toggleArrow}>{open ? '▼' : '▶'}</span>
              <span style={overviewStyles.toggleLabel}>{label}</span>
            </button>
            {open && (
              <div id={`overview-${key}`}>
                <Component items={items} grossMt={grossMt} live={live} alreadyShippedMt={alreadyShippedMt} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const overviewStyles = {
  bar: { display: 'flex', gap: 8, alignItems: 'center', marginTop: 14, marginBottom: 8 },
  barLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  barBtn: { padding: '3px 10px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 4, fontSize: 11, cursor: 'pointer' },
  panel: { marginTop: 2 },
  toggle: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit', width: '100%', textAlign: 'left' },
  toggleArrow: { fontSize: 10, color: '#64748b', width: 12 },
  toggleLabel: { fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
};

// Plan-level 5-year projection chart. Combines per-item yearByYearMt
// arrays into a forecast: where does gross emissions land in each
// of the next N years if every plan item ships on its expected
// timeline? Plots:
//   - Dashed gray "baseline" line at current gross (flat)
//   - Solid cyan "projected gross" line (baseline − cumulative item
//     mt by year)
//   - Green dashed "50% target" reference line at gross × 0.5
//   - Each year-end point labeled
function ProjectionChart({ items, grossMt, alreadyShippedMt }) {
  if (!Array.isArray(items) || items.length === 0 || !grossMt) return null;

  // How many years to project? Take the longest yearByYearMt array
  // among the items, default to 4.
  const horizon = Math.max(
    4,
    ...items.map((it) => Array.isArray(it.yearByYearMt) ? it.yearByYearMt.length : 0)
  );
  // Year-by-year cumulative reduction from the plan. yearMtSum[y] is
  // the SUM of all items' yearByYearMt[y] (i.e. total annual mt
  // reduction in year y once items have ramped to that year).
  const yearMtSum = [];
  for (let y = 0; y < horizon; y++) {
    let sum = 0;
    for (const it of items) {
      const arr = Array.isArray(it.yearByYearMt) ? it.yearByYearMt : [];
      // For years past the array length, use the steady-state (last value).
      sum += y < arr.length ? (Number(arr[y]) || 0) : (Number(arr[arr.length - 1]) || it.expectedMtPerYear || 0);
    }
    yearMtSum.push(sum);
  }
  // Projected gross at each year: baseline − cumulative reductions.
  // Cumulative here means: by year Y, every item has been ramping
  // for Y years, so yearMtSum[Y-1] is the annual reduction in year Y.
  const baseline = grossMt;
  const projected = yearMtSum.map((annualReduction, y) => {
    // Subtract steady-state plan reduction; treat alreadyShipped as
    // already-baked-in (counts from year 0).
    return Math.max(0, baseline - annualReduction - alreadyShippedMt);
  });

  const W = 720;
  const H = 220;
  const pad = { t: 16, r: 80, b: 30, l: 60 };
  const target = baseline * 0.5;
  const yMax = baseline * 1.05;
  const yMin = Math.min(target * 0.7, ...projected) * 0.95;
  const x = (i) => pad.l + (i / Math.max(1, horizon - 1)) * (W - pad.l - pad.r);
  const y = (v) => pad.t + (1 - (v - yMin) / Math.max(1, yMax - yMin)) * (H - pad.t - pad.b);

  const projectedPath = `M ${x(0).toFixed(1)} ${y(projected[0]).toFixed(1)} ` +
    projected.slice(1).map((v, i) => `L ${x(i + 1).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');

  const yTicks = [yMin, (yMin + yMax) / 2, yMax];

  const finalGross = projected[projected.length - 1];
  const totalReduction = baseline - finalGross;
  const reductionPct = baseline > 0 ? (totalReduction / baseline) * 100 : 0;

  return (
    <div style={projStyles.wrap}>
      <div style={projStyles.head}>
        <div>
          <div style={projStyles.headLabel}>5-year projected gross · if every plan item ships</div>
          <div style={projStyles.headValue}>
            <span style={{ color: '#fca5a5' }}>{Math.round(baseline).toLocaleString()}</span>
            <span style={projStyles.arrow}> → </span>
            <span style={{ color: '#86efac' }}>{Math.round(finalGross).toLocaleString()}</span>
            <span style={projStyles.headUnit}> mtCO₂e/yr · −{reductionPct.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={`Projected gross emissions over ${horizon} years: ${projected.map((v) => Math.round(v)).join(', ')} mt`}
        style={{ display: 'block', maxWidth: '100%' }}
      >
        {/* Y axis gridlines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#1f2937" strokeWidth="1" strokeDasharray="2 4" />
            <text x={pad.l - 8} y={y(t) + 4} fill="#64748b" fontSize="11" textAnchor="end" fontFamily="ui-monospace, monospace">
              {Math.round(t)}
            </text>
          </g>
        ))}
        {/* Baseline horizontal */}
        <line x1={pad.l} x2={W - pad.r} y1={y(baseline)} y2={y(baseline)} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x={W - pad.r + 6} y={y(baseline) + 4} fill="#94a3b8" fontSize="11" fontWeight="700">baseline</text>
        {/* 50% target horizontal */}
        {target >= yMin && target <= yMax && (
          <g>
            <line x1={pad.l} x2={W - pad.r} y1={y(target)} y2={y(target)} stroke="#16a34a" strokeWidth="1.5" strokeDasharray="6 4" />
            <text x={W - pad.r + 6} y={y(target) + 4} fill="#86efac" fontSize="11" fontWeight="700">50% target</text>
          </g>
        )}
        {/* Projected line */}
        <path d={projectedPath} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
        {/* Points + year labels */}
        {projected.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r="3.5" fill="#22d3ee" stroke="#0b1220" strokeWidth="1.5">
              <title>Year {i + 1}: {Math.round(v)} mt</title>
            </circle>
            <text x={x(i)} y={H - 8} fill="#64748b" fontSize="11" textAnchor="middle" fontFamily="ui-monospace, monospace">
              Y{i + 1}
            </text>
            {(i === 0 || i === projected.length - 1) && (
              <text x={x(i)} y={y(v) - 8} fill="#22d3ee" fontSize="11" textAnchor="middle" fontWeight="700">
                {Math.round(v)}
              </text>
            )}
          </g>
        ))}
        {/* Y axis label */}
        <text x={pad.l - 50} y={pad.t + (H - pad.t - pad.b) / 2} fill="#64748b" fontSize="11"
              transform={`rotate(-90 ${pad.l - 50} ${pad.t + (H - pad.t - pad.b) / 2})`} textAnchor="middle">
          mtCO₂e/yr
        </text>
      </svg>
      <div style={projStyles.foot}>
        Projection assumes every item lands on its expected ramp + no new emissions sources appear. Compare to the 50% target line to see if the plan closes the gap by Year {horizon}.
      </div>
    </div>
  );
}

const projStyles = {
  wrap: { marginTop: 12, padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #22d3ee', borderRadius: 8 },
  head: { marginBottom: 10 },
  headLabel: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6 },
  headValue: { fontSize: 22, fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums', color: '#e5e7eb' },
  arrow: { color: '#64748b', margin: '0 8px' },
  headUnit: { fontSize: 12, fontWeight: 600, color: '#94a3b8', marginLeft: 8 },
  foot: { marginTop: 8, fontSize: 11, color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.5 },
};

// Given a budget cap, picks the subset of plan items that maximizes
// mt within that budget. 0/1 knapsack with integer dollars; with 8-
// 12 items the DP table is small enough to run instantly even in
// browser. Free items (cost === 0) get included unconditionally.
function knapsackOptimize(items, budgetUsd) {
  if (!Array.isArray(items) || items.length === 0) return { picked: [], totalMt: 0, totalCost: 0 };
  const free = items.filter((it) => (it.estimatedCostUsd || 0) === 0);
  const paid = items.filter((it) => (it.estimatedCostUsd || 0) > 0);
  const cap = Math.max(0, Math.floor(budgetUsd / 1000)); // scale to $K
  const n = paid.length;
  // dp[i][w] = max mt using first i items with total cost ≤ w (in $K).
  const dp = Array.from({ length: n + 1 }, () => new Float64Array(cap + 1));
  for (let i = 1; i <= n; i++) {
    const cost = Math.ceil(paid[i - 1].estimatedCostUsd / 1000);
    const mt = paid[i - 1].expectedMtPerYear || 0;
    for (let w = 0; w <= cap; w++) {
      dp[i][w] = dp[i - 1][w];
      if (cost <= w) {
        const alt = dp[i - 1][w - cost] + mt;
        if (alt > dp[i][w]) dp[i][w] = alt;
      }
    }
  }
  // Back-trace to find which items were picked.
  const picked = [];
  let w = cap;
  for (let i = n; i >= 1; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      picked.push(paid[i - 1]);
      w -= Math.ceil(paid[i - 1].estimatedCostUsd / 1000);
    }
  }
  picked.reverse();
  const finalPicked = [...free, ...picked];
  const totalMt = finalPicked.reduce((s, x) => s + (x.expectedMtPerYear || 0), 0);
  const totalCost = finalPicked.reduce((s, x) => s + (x.estimatedCostUsd || 0), 0);
  return { picked: finalPicked, totalMt, totalCost };
}

function BudgetOptimizer({ items }) {
  // Default budget = sum of all "this-year" item costs, capped to a
  // round number so the slider has a useful initial position.
  const thisYearCost = items
    .filter((it) => it.timeline === 'this-year')
    .reduce((s, x) => s + (x.estimatedCostUsd || 0), 0);
  const totalCost = items.reduce((s, x) => s + (x.estimatedCostUsd || 0), 0);
  const defaultBudget = Math.max(50_000, Math.round(thisYearCost / 50_000) * 50_000) || 100_000;
  const [budget, setBudget] = useState(defaultBudget);
  // Slider range: 0 → 1.5× total cost (so admin can model overshoot).
  const maxBudget = Math.max(totalCost * 1.5, 250_000);

  const { picked, totalMt, totalCost: pickedCost } = useMemo(
    () => knapsackOptimize(items, budget),
    [items, budget]
  );
  const pickedIds = new Set(picked.map((p) => p.id));
  const dropped = items.filter((it) => !pickedIds.has(it.id) && (it.expectedMtPerYear || 0) > 0);

  return (
    <div style={optStyles.wrap}>
      <div style={optStyles.head}>
        <span style={optStyles.headLabel}>Budget optimizer · "with $X, what's the best mix?"</span>
        <span style={optStyles.headValue}>${budget.toLocaleString()}</span>
      </div>
      <input
        type="range"
        min={0}
        max={maxBudget}
        step={Math.max(1000, Math.round(maxBudget / 200))}
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        style={optStyles.slider}
        aria-label="Available capital budget for this cycle"
      />
      <div style={optStyles.scale}>
        <span>$0</span>
        <span>${Math.round(maxBudget / 2).toLocaleString()}</span>
        <span>${maxBudget.toLocaleString()}</span>
      </div>

      <div style={optStyles.result}>
        <div style={optStyles.resultRow}>
          <div style={optStyles.resultLabel}>Optimal subset</div>
          <div style={optStyles.resultVal}>
            {picked.length} item{picked.length === 1 ? '' : 's'} ·
            <span style={{ color: '#86efac', marginLeft: 6 }}>{Math.round(totalMt).toLocaleString()} mt/yr</span> ·
            <span style={{ color: '#94a3b8', marginLeft: 6 }}>${pickedCost.toLocaleString()} of ${budget.toLocaleString()}</span>
          </div>
        </div>
        {dropped.length > 0 && (
          <div style={optStyles.resultRow}>
            <div style={optStyles.resultLabel}>Excluded</div>
            <div style={optStyles.resultVal}>
              {dropped.length} item{dropped.length === 1 ? '' : 's'} ·
              <span style={{ color: '#fca5a5', marginLeft: 6 }}>
                {Math.round(dropped.reduce((s, x) => s + (x.expectedMtPerYear || 0), 0)).toLocaleString()} mt/yr unaddressed
              </span>
            </div>
          </div>
        )}
      </div>

      <div style={optStyles.lists}>
        <div style={optStyles.list}>
          <div style={{ ...optStyles.listLabel, color: '#86efac' }}>✓ In the optimal mix</div>
          {picked.length === 0 ? <div style={optStyles.empty}>(budget too small)</div> : picked.map((p) => (
            <div key={p.id} style={optStyles.row}>
              <span style={optStyles.rowTitle}>{p.title}</span>
              <span style={optStyles.rowMeta}>
                {Math.round(p.expectedMtPerYear)} mt · {p.estimatedCostUsd === 0 ? 'free' : `$${p.estimatedCostUsd.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
        {dropped.length > 0 && (
          <div style={optStyles.list}>
            <div style={{ ...optStyles.listLabel, color: '#fca5a5' }}>✕ Excluded at this budget</div>
            {dropped.map((p) => (
              <div key={p.id} style={{ ...optStyles.row, opacity: 0.7 }}>
                <span style={optStyles.rowTitle}>{p.title}</span>
                <span style={optStyles.rowMeta}>
                  {Math.round(p.expectedMtPerYear)} mt · ${p.estimatedCostUsd.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const optStyles = {
  wrap: { marginTop: 12, padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  headLabel: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6 },
  headValue: { fontSize: 18, fontWeight: 800, color: '#22d3ee', fontVariantNumeric: 'tabular-nums' },
  slider: { width: '100%', cursor: 'pointer' },
  scale: { display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', fontFamily: 'ui-monospace, monospace', marginTop: 2 },
  result: { marginTop: 10, padding: '8px 12px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6 },
  resultRow: { display: 'flex', gap: 12, fontSize: 13, padding: '4px 0' },
  resultLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, minWidth: 130 },
  resultVal: { color: '#e5e7eb', fontVariantNumeric: 'tabular-nums' },
  lists: { marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 },
  list: { padding: '10px 12px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6 },
  listLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  row: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, padding: '4px 0', borderTop: '1px solid #1f2937', fontSize: 12, alignItems: 'baseline' },
  rowTitle: { color: '#e5e7eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  rowMeta: { fontSize: 11, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' },
  empty: { fontSize: 12, color: '#64748b', fontStyle: 'italic', padding: '4px 0' },
};

// Side-by-side diff between a saved snapshot and the current plan.
// Items match by title (case-insensitive), since LLM regeneration
// often produces slightly different IDs for the same lever.
function SnapshotDiff({ snapshot, currentPlan, currentContext }) {
  const snapItems = snapshot.plan?.plan || [];
  const curItems  = currentPlan?.plan   || [];
  const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const snapByTitle = new Map(snapItems.map((it) => [norm(it.title), it]));
  const curByTitle  = new Map(curItems.map((it) => [norm(it.title), it]));

  const inBoth = [];
  const onlyInSnap = [];
  const onlyInCur = [];
  for (const [t, sIt] of snapByTitle) {
    const cIt = curByTitle.get(t);
    if (cIt) inBoth.push({ snap: sIt, cur: cIt });
    else onlyInSnap.push(sIt);
  }
  for (const [t, cIt] of curByTitle) {
    if (!snapByTitle.has(t)) onlyInCur.push(cIt);
  }

  const snapTotalMt = snapItems.reduce((s, x) => s + (Number(x.expectedMtPerYear) || 0), 0);
  const curTotalMt  = curItems.reduce ((s, x) => s + (Number(x.expectedMtPerYear) || 0), 0);
  const snapTotalCost = snapItems.reduce((s, x) => s + (Number(x.estimatedCostUsd) || 0), 0);
  const curTotalCost  = curItems.reduce ((s, x) => s + (Number(x.estimatedCostUsd) || 0), 0);

  return (
    <div style={diffStyles.wrap}>
      <div style={diffStyles.head}>
        <span style={diffStyles.headLabel}>Diff · {snapshot.name} vs current plan</span>
      </div>
      <div style={diffStyles.totals}>
        <div style={diffStyles.totalRow}>
          <div style={diffStyles.totalLabel}>Snapshot</div>
          <div style={diffStyles.totalVal}>{snapItems.length} items · {Math.round(snapTotalMt)} mt · ${snapTotalCost.toLocaleString()}</div>
          <div style={diffStyles.totalCtx}>cap. {snapshot.context?.capitalAppetite || '—'} · {snapshot.context?.topPriority || '—'}</div>
        </div>
        <div style={diffStyles.totalRow}>
          <div style={diffStyles.totalLabel}>Current</div>
          <div style={diffStyles.totalVal}>{curItems.length} items · {Math.round(curTotalMt)} mt · ${curTotalCost.toLocaleString()}</div>
          <div style={diffStyles.totalCtx}>cap. {currentContext?.capitalAppetite || '—'} · {currentContext?.topPriority || '—'}</div>
        </div>
        <div style={diffStyles.deltaRow}>
          <div style={diffStyles.totalLabel}>Δ</div>
          <div style={{ ...diffStyles.totalVal, color: curTotalMt > snapTotalMt ? '#86efac' : '#fca5a5' }}>
            {curTotalMt > snapTotalMt ? '+' : ''}{Math.round(curTotalMt - snapTotalMt)} mt
            {' · '}
            {curTotalCost > snapTotalCost ? '+$' : '-$'}{Math.abs(curTotalCost - snapTotalCost).toLocaleString()}
          </div>
        </div>
      </div>

      {onlyInSnap.length > 0 && (
        <div style={diffStyles.section}>
          <div style={diffStyles.sectionLabel}>Removed in current ({onlyInSnap.length})</div>
          {onlyInSnap.map((it, i) => (
            <div key={i} style={{ ...diffStyles.item, ...diffStyles.removed }}>
              <span style={diffStyles.itemSign}>−</span>
              <span style={diffStyles.itemTitle}>{it.title}</span>
              <span style={diffStyles.itemMeta}>{Math.round(it.expectedMtPerYear)} mt · ${(it.estimatedCostUsd || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {onlyInCur.length > 0 && (
        <div style={diffStyles.section}>
          <div style={diffStyles.sectionLabel}>Added in current ({onlyInCur.length})</div>
          {onlyInCur.map((it, i) => (
            <div key={i} style={{ ...diffStyles.item, ...diffStyles.added }}>
              <span style={diffStyles.itemSign}>+</span>
              <span style={diffStyles.itemTitle}>{it.title}</span>
              <span style={diffStyles.itemMeta}>{Math.round(it.expectedMtPerYear)} mt · ${(it.estimatedCostUsd || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {inBoth.length > 0 && (
        <div style={diffStyles.section}>
          <div style={diffStyles.sectionLabel}>Common items ({inBoth.length})</div>
          {inBoth.map(({ snap, cur }, i) => {
            const mtChanged = Number(snap.expectedMtPerYear) !== Number(cur.expectedMtPerYear);
            const costChanged = Number(snap.estimatedCostUsd) !== Number(cur.estimatedCostUsd);
            const unchanged = !mtChanged && !costChanged;
            return (
              <div key={i} style={{ ...diffStyles.item, ...(unchanged ? diffStyles.unchanged : diffStyles.changed) }}>
                <span style={diffStyles.itemSign}>{unchanged ? '=' : '~'}</span>
                <span style={diffStyles.itemTitle}>{cur.title}</span>
                <span style={diffStyles.itemMeta}>
                  {mtChanged
                    ? <span><span style={diffStyles.was}>{Math.round(snap.expectedMtPerYear)}</span> → {Math.round(cur.expectedMtPerYear)} mt</span>
                    : <span>{Math.round(cur.expectedMtPerYear)} mt</span>}
                  {' · '}
                  {costChanged
                    ? <span><span style={diffStyles.was}>${(snap.estimatedCostUsd || 0).toLocaleString()}</span> → ${(cur.estimatedCostUsd || 0).toLocaleString()}</span>
                    : <span>${(cur.estimatedCostUsd || 0).toLocaleString()}</span>}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const diffStyles = {
  wrap: { marginTop: 6, marginBottom: 4, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #94a3b8', borderRadius: 8 },
  head: { marginBottom: 8 },
  headLabel: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6 },
  totals: { display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 8, padding: '8px 10px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6, marginBottom: 10 },
  totalRow: { display: 'contents' },
  deltaRow: { display: 'contents' },
  totalLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, alignSelf: 'center' },
  totalVal: { fontSize: 13, color: '#e5e7eb', fontVariantNumeric: 'tabular-nums', alignSelf: 'center' },
  totalCtx: { fontSize: 11, color: '#64748b', alignSelf: 'center', textAlign: 'right' },
  section: { marginTop: 10 },
  sectionLabel: { fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
  item: { display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 8, padding: '6px 8px', borderRadius: 4, marginTop: 4, fontSize: 13, alignItems: 'baseline' },
  itemSign: { fontFamily: 'ui-monospace, monospace', fontWeight: 700 },
  itemTitle: { color: '#e5e7eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  itemMeta: { fontSize: 11, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' },
  added:     { background: '#0e3a1f', color: '#86efac' },
  removed:   { background: '#3a0d0d', color: '#fca5a5' },
  changed:   { background: '#3a2a0e', color: '#fcd34d' },
  unchanged: { background: '#0f172a', color: '#cbd5e1', opacity: 0.7 },
  was: { textDecoration: 'line-through', color: '#64748b', marginRight: 4 },
};

// 8-section board brief from /api/admin/plan-narrative. Reads like
// a Head-of-School cover memo to the Trustees — strategic framing
// for the meeting BEFORE the line-item plan review.
function BoardNarrative({ narrative, generatedAt }) {
  const sections = [
    { key: 'openingFrame',    label: 'Why this plan, why now',    text: narrative.openingFrame },
    { key: 'whereWeStand',    label: 'Where KUA stands today',    text: narrative.whereWeStand },
    { key: 'strategicChoice', label: 'The strategic choice',      text: narrative.strategicChoice },
    { key: 'financialCase',   label: 'Financial case',            text: narrative.financialCase },
    { key: 'riskNarrative',   label: 'Risks named honestly',      text: narrative.riskNarrative },
    { key: 'successScenario', label: 'If everything works',       text: narrative.successScenario },
    { key: 'boardAsk',        label: 'Board asks this meeting',   text: narrative.boardAsk, accent: '#fbbf24' },
  ];
  return (
    <div style={narrativeStyles.wrap}>
      <div style={narrativeStyles.head}>
        <span style={narrativeStyles.headLabel}>Board narrative · 2-page brief</span>
        <span style={narrativeStyles.headDate}>generated {new Date(generatedAt).toLocaleString()}</span>
      </div>
      <h2 style={narrativeStyles.title}>{narrative.title}</h2>
      {sections.map((s) => (
        s.text ? (
          <section key={s.key} style={{ ...narrativeStyles.section, borderLeftColor: s.accent || '#a5b4fc' }}>
            <div style={{ ...narrativeStyles.sectionLabel, color: s.accent || '#a5b4fc' }}>{s.label}</div>
            <p style={narrativeStyles.sectionText}>{s.text}</p>
          </section>
        ) : null
      ))}
    </div>
  );
}

const narrativeStyles = {
  wrap: { marginTop: 14, padding: '18px 22px', background: '#0f172a', border: '1px solid #312e81', borderLeft: '4px solid #6366f1', borderRadius: 10 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #1f2937' },
  headLabel: { fontSize: 11, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: 0.7 },
  headDate: { fontSize: 11, color: '#64748b' },
  title: { fontSize: 20, fontWeight: 800, color: '#e5e7eb', margin: '0 0 14px' },
  section: { padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #a5b4fc', borderRadius: 6, marginTop: 10 },
  sectionLabel: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 6 },
  sectionText: { margin: 0, fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, whiteSpace: 'pre-wrap' },
};

function MemoSection({ title, children }) {
  return (
    <div style={memoStyles.section}>
      <div style={memoStyles.sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

const memoStyles = {
  wrap: { marginTop: 14, padding: '14px 16px', background: '#0f172a', border: '1px solid #312e81', borderLeft: '3px solid #6366f1', borderRadius: 8 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #1f2937' },
  headLabel: { fontSize: 11, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: 0.7 },
  headDate: { fontSize: 11, color: '#64748b' },
  execSummary: { margin: 0, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 },
  section: { marginTop: 14 },
  sectionTitle: { fontSize: 10, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 },

  weekList: { display: 'grid', gap: 8 },
  weekRow: { display: 'grid', gridTemplateColumns: '70px 1fr', gap: 12, padding: '8px 10px', background: '#0b1220', borderRadius: 6, border: '1px solid #1f2937' },
  weekNum: { fontSize: 12, fontWeight: 700, color: '#6366f1' },
  weekFocus: { fontSize: 13, color: '#e5e7eb', fontWeight: 600 },
  weekActions: { margin: '4px 0 0', paddingLeft: 16 },
  weekAction: { fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, marginTop: 2 },

  stakeList: { display: 'grid', gap: 6 },
  stakeRow: { display: 'grid', gridTemplateColumns: '180px 90px 1fr', gap: 10, padding: '6px 10px', background: '#0b1220', borderRadius: 6, fontSize: 12 },
  stakeRole: { color: '#e5e7eb', fontWeight: 600 },
  stakeWhen: { color: '#94a3b8' },
  stakeWhy: { color: '#cbd5e1', lineHeight: 1.5 },

  email: { marginTop: 8, padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  emailMeta: { fontSize: 12, color: '#94a3b8', marginBottom: 4 },
  emailDraft: { marginTop: 8, fontSize: 13, color: '#cbd5e1', lineHeight: 1.55, whiteSpace: 'pre-wrap', fontFamily: 'inherit' },

  bulletList: { margin: 0, paddingLeft: 18 },
  bullet: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.55, marginTop: 4 },

  budgetTable: { width: '100%', borderCollapse: 'collapse' },
  budgetLine: { padding: '6px 8px', fontSize: 13, color: '#cbd5e1', borderTop: '1px solid #1f2937' },
  budgetAmt: { padding: '6px 8px', fontSize: 13, color: '#e5e7eb', borderTop: '1px solid #1f2937', textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  budgetNote: { color: '#64748b', fontSize: 11 },
  budgetTotal: { background: '#0b1220' },

  riskBlock: { padding: '8px 10px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, marginTop: 6 },
  riskLabel: { fontSize: 13, color: '#fca5a5' },
  mitigLabel: { fontSize: 13, color: '#86efac', marginTop: 4 },

  commList: { display: 'grid', gap: 6 },
  commRow: { display: 'grid', gridTemplateColumns: '140px 180px 1fr', gap: 10, padding: '6px 10px', background: '#0b1220', borderRadius: 6, fontSize: 12 },
  commAud: { color: '#e5e7eb', fontWeight: 600 },
  commChannel: { color: '#94a3b8' },
  commMsg: { color: '#cbd5e1', lineHeight: 1.5 },
};

const altsStyles = {
  wrap: { marginTop: 12, padding: '12px 14px', background: '#3a2a0e', border: '1px solid #ca8a04', borderLeft: '3px solid #fbbf24', borderRadius: 8 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headLabel: { fontSize: 11, fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: 0.6 },
  hide: { background: 'transparent', color: '#fcd34d', border: '1px solid #ca8a04', borderRadius: 4, fontSize: 11, padding: '2px 8px', cursor: 'pointer' },
  card: { marginTop: 8, padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  cardHead: { display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' },
  cardTitle: { flex: 1, minWidth: 200, fontSize: 14, color: '#e5e7eb', fontWeight: 600 },
  cardMt: { fontSize: 12, color: '#86efac', fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
  cardCost: { fontSize: 12, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' },
  cardWhy: { marginTop: 6, fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 },
  swapBtn: { marginTop: 8, padding: '4px 12px', background: '#0e3a1f', color: '#86efac', border: '1px solid #16a34a', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
};

const detailListStyles = {
  ol: { margin: 0, paddingLeft: 18, display: 'grid', gap: 4 },
  ul: { margin: 0, paddingLeft: 18, display: 'grid', gap: 4 },
  li: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 },
};

// Small collapsible block for the detailed fields on each plan item.
// Renders inline when there's content; auto-collapsed if the user has
// shipped this item or hasn't expanded yet.
function DetailBlock({ title, accent, children }) {
  return (
    <div style={{ marginTop: 10, padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: `3px solid ${accent}`, borderRadius: 6 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7, color: accent, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.55 }}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 },
  field: { display: 'block' },
  fieldLabel: { fontSize: 12, color: '#94a3b8', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { width: '100%', boxSizing: 'border-box', padding: '8px 12px', background: '#0b1220', border: '1px solid #334155', borderRadius: 6, color: '#e5e7eb', fontSize: 14 },
  contextSummary: { display: 'flex', gap: 14, marginTop: 14, padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, fontSize: 13, color: '#cbd5e1', flexWrap: 'wrap' },
  contextSummaryItem: { fontVariantNumeric: 'tabular-nums' },
  sourcesBlock: { marginTop: 10, padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, fontSize: 13, color: '#cbd5e1' },
  sourcesSummary: { cursor: 'pointer', fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, listStyle: 'revert' },
  sourceList: { paddingLeft: 18, fontSize: 12, color: '#cbd5e1', lineHeight: 1.7, marginTop: 8, marginBottom: 8 },
  provenanceLegend: { display: 'flex', gap: 14, alignItems: 'center', marginTop: 10, marginBottom: 6, flexWrap: 'wrap', fontSize: 11, color: '#94a3b8' },
  sourceCaveat: { marginTop: 8, fontSize: 12, color: '#94a3b8', lineHeight: 1.5, fontStyle: 'italic', paddingTop: 8, borderTop: '1px solid #1f2937' },
  contextProvList: { display: 'grid', gap: 10, marginTop: 12 },
  ctxRow: { padding: '12px 14px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 8 },
  ctxHead: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 },
  ctxLabel: { fontSize: 14, color: '#e5e7eb', fontWeight: 700 },
  ctxMethod: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, marginTop: 4 },
  ctxMethodLabel: { color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.7, marginRight: 6 },
  ctxSourcePath: { marginTop: 6, fontSize: 11, color: '#64748b' },
  actionRow: { display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' },
  primaryBtn: { padding: '10px 18px', background: '#22d3ee', color: '#0b1220', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  dangerBtn: { padding: '10px 14px', background: 'transparent', color: '#fca5a5', border: '1px solid #7f1d1d', borderRadius: 6, fontSize: 13, cursor: 'pointer' },
  error: { marginTop: 10, padding: '10px 12px', background: '#3a0d12', color: '#fca5a5', border: '1px solid #7f1d1d', borderRadius: 6, fontSize: 13 },

  summary: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 14, padding: '12px 14px', background: '#0b1220', borderLeft: '3px solid #22d3ee', borderRadius: 4 },
  heroRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 16 },
  hero: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22d3ee', borderRadius: 8 },
  heroLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 },
  heroValue: { fontSize: 22, fontWeight: 800, lineHeight: 1, marginTop: 6, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'baseline', gap: 6 },
  heroUnit: { fontSize: 11, fontWeight: 600, color: '#94a3b8' },

  planList: { display: 'grid', gap: 10 },
  planCard: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22d3ee', borderRadius: 8 },
  planHead: { display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' },
  planRank: { fontSize: 14, color: '#94a3b8', fontWeight: 800, fontVariantNumeric: 'tabular-nums', minWidth: 32 },
  planTitle: { fontSize: 15, color: '#e5e7eb', fontWeight: 700 },
  planMeta: { display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' },
  planNums: { textAlign: 'right', minWidth: 130 },
  planMt: { fontSize: 18, color: '#86efac', fontWeight: 800, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'flex-end' },
  planCost: { fontSize: 12, color: '#94a3b8', marginTop: 4, fontVariantNumeric: 'tabular-nums' },
  planPayback: { color: '#64748b' },
  planNumUnit: { fontSize: 10, color: '#94a3b8', fontWeight: 600 },
  planWhy: { marginTop: 10, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, paddingLeft: 44 },
  planSource: { marginTop: 8, fontSize: 11, color: '#94a3b8', lineHeight: 1.5, paddingLeft: 44, fontStyle: 'italic' },
  // Detail-block list styling — bullet/numbered lists inside the
  // DetailBlock cards. Distinct from the outer `planList` (which is a
  // grid of plan-item cards).
  planListProse: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.55 },
  planSourceLabel: { color: '#64748b', fontWeight: 700, fontStyle: 'normal', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 4 },
  planActions: { display: 'flex', gap: 8, marginTop: 12, paddingLeft: 44 },
  completeBtn: { padding: '6px 12px', background: '#052e1a', color: '#86efac', border: '1px solid #14532d', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  declineBtn:  { padding: '6px 12px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
  memoBtn:     { padding: '6px 12px', background: 'transparent', color: '#a5b4fc', border: '1px solid #3730a3', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  chatToggleBtn: { padding: '6px 12px', background: 'transparent', color: '#22d3ee', border: '1px solid #155e75', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  snapshotBtn: { padding: '6px 12px', background: 'transparent', color: '#fbbf24', border: '1px solid #92400e', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  exportBtn:   { padding: '6px 12px', background: 'transparent', color: '#86efac', border: '1px solid #14532d', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  planChatBtn: { padding: '6px 12px', background: 'transparent', color: '#22d3ee', border: '1px solid #155e75', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  narrativeBtn: { padding: '6px 12px', background: 'transparent', color: '#a5b4fc', border: '1px solid #3730a3', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  altsBtn: { padding: '6px 12px', background: 'transparent', color: '#fbbf24', border: '1px solid #92400e', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  snapshotList: { display: 'grid', gap: 8 },
  snapshotRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #fbbf24', borderRadius: 6 },
  snapshotName: { fontSize: 14, color: '#e5e7eb', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  snapshotMeta: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  snapshotRestore: { padding: '4px 10px', background: '#0e3a1f', color: '#86efac', border: '1px solid #16a34a', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  snapshotCompare: { padding: '4px 10px', background: 'transparent', color: '#22d3ee', border: '1px solid #155e75', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  snapshotDelete: { width: 26, height: 26, borderRadius: 13, background: 'transparent', color: '#fca5a5', border: '1px solid #7f1d1d', fontSize: 14, lineHeight: '24px', textAlign: 'center', cursor: 'pointer', fontWeight: 700, padding: 0 },
  memoErr:     { marginTop: 8, padding: '8px 12px', background: '#3a0d0d', border: '1px solid #7f1d1d', borderRadius: 6, color: '#fca5a5', fontSize: 13 },
  memoUnavail: { marginTop: 8, padding: '8px 12px', background: '#3a2a0e', border: '1px solid #92400e', borderRadius: 6, color: '#fcd34d', fontSize: 13 },

  historyBlock: { marginBottom: 14 },
  historyTitle: { fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, marginBottom: 6 },
  historyList: { paddingLeft: 0, listStyle: 'none', margin: 0 },
  historyItem: { padding: '6px 10px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, fontSize: 13, color: '#cbd5e1', marginBottom: 4, display: 'flex', alignItems: 'baseline', gap: 8 },
  historyCheck: { color: '#86efac', fontWeight: 800 },
  historyX:     { color: '#94a3b8', fontWeight: 800 },
  historyMt:    { color: '#86efac', fontVariantNumeric: 'tabular-nums', fontSize: 12, fontWeight: 600 },
  historyVariance: { fontSize: 11, fontVariantNumeric: 'tabular-nums', fontWeight: 600 },
  historyWhen:  { fontSize: 11, color: '#64748b' },
  historyReason:{ color: '#94a3b8', fontStyle: 'italic' },
};
