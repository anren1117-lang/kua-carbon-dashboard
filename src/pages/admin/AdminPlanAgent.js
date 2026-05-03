import React, { useState, useEffect, useCallback } from 'react';
import { ModulePage, ModuleSection, Pill } from '../../components/ModuleShell.js';
import { GRID_MIX_TOTAL_MTCO2E } from '../../data/gridMix.js';
import { ANNUAL_SEQUESTRATION_MT } from '../../data/sinks.js';
import { TOTAL_STUDENTS } from '../../data/students.js';
import { ANNUALIZE_FACTOR } from '../../data/envysionSnapshot.js';

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
const HISTORY_KEY = 'kua_admin_plan_history';

const SCOPE1_TOTAL_MT = 1250;
const SCOPE3_TOTAL_MT = 2700;
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
  const [context, setContext] = useState(() => ({ ...emptyContext(), ...loadJson(CONTEXT_KEY, {}) }));
  const [plan, setPlan] = useState(() => loadJson(PLAN_KEY, null));
  const [history, setHistory] = useState(() => loadJson(HISTORY_KEY, { completed: [], declined: [] }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { saveJson(CONTEXT_KEY, context); }, [context]);
  useEffect(() => { saveJson(HISTORY_KEY, history); }, [history]);
  useEffect(() => { if (plan) saveJson(PLAN_KEY, plan); }, [plan]);

  const generatePlan = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/plan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ context, history }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server returned ${res.status}`);
      }
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      setError(err.message || 'Could not generate the plan.');
    } finally {
      setLoading(false);
    }
  }, [context, history]);

  const completeItem = (item) => {
    const note = window.prompt('Optional: any actual mt saved or notes for the record?');
    setHistory((h) => ({
      completed: [...h.completed, {
        id: item.id,
        title: item.title,
        when: new Date().toISOString(),
        mtSaved: item.expectedMtPerYear,
        note: note || '',
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
      title="Plan agent — institutional decarbonization roadmap"
      subtitle="Set the institutional context, then let the agent draft a 5-7 step plan ranked by impact, cost-fit, and political feasibility. Record what ships and what gets vetoed; the agent re-prioritizes from there."
    >
      <ModuleSection title="Institutional context" hint="Loaded from KUA's canonical totals — adjust when the fiscal context changes (new board, new capex window, new regulation).">
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
        <div style={styles.actionRow}>
          <button
            type="button"
            onClick={generatePlan}
            disabled={!contextIsComplete(context) || loading}
            style={{ ...styles.primaryBtn, opacity: (!contextIsComplete(context) || loading) ? 0.5 : 1 }}
          >
            {loading ? 'Generating…' : hasPlan ? 'Re-generate plan' : 'Generate plan'}
          </button>
          {hasPlan && (
            <button type="button" onClick={resetEverything} style={styles.dangerBtn}>
              Reset context + history
            </button>
          )}
        </div>
        {error && <div style={styles.error}>{error}</div>}
      </ModuleSection>

      {hasPlan && (
        <ModuleSection
          title="Current plan"
          hint={`${plan.mode === 'llm' ? 'AI-generated' : 'Rule-based fallback'} · drafted ${new Date(plan.generatedAt).toLocaleDateString()} · re-generate after a board meeting / fiscal cycle / new project completion.`}
        >
          <div style={styles.summary}>{plan.summary}</div>
          <div style={styles.heroRow}>
            <Hero label="Plan annual reduction"     value={`${Math.round(totalMt).toLocaleString()}`} unit="mtCO₂e/yr" accent="#86efac" />
            <Hero label="Share of current gross"    value={`${percentOfGross.toFixed(1)}%`}            unit=""           accent="#fbbf24" />
            <Hero label="Already shipped"           value={`${Math.round(mtAlreadySaved).toLocaleString()}`} unit={`mt · ${totalCompleted} actions`} accent="#22d3ee" />
            <Hero label="Suggested next check-in"   value={`${plan.nextCheckInDays} days`}             unit=""           accent="#a855f7" />
          </div>
          <div style={styles.planList}>
            {plan.plan.map((item, i) => (
              <PlanCard
                key={item.id}
                item={item}
                rank={i + 1}
                onComplete={() => completeItem(item)}
                onDecline={() => declineItem(item)}
              />
            ))}
          </div>
        </ModuleSection>
      )}

      {(history.completed.length > 0 || history.declined.length > 0) && (
        <ModuleSection title="Plan history" hint="Re-generate the plan to bake this history into the next round.">
          {history.completed.length > 0 && (
            <div style={styles.historyBlock}>
              <div style={styles.historyTitle}>Shipped ({history.completed.length}) · {Math.round(mtAlreadySaved).toLocaleString()} mt/yr</div>
              <ul style={styles.historyList}>
                {history.completed.map((c, i) => (
                  <li key={i} style={styles.historyItem}>
                    <span style={styles.historyCheck}>✓</span>
                    <span style={{ flex: 1 }}>{c.title}{c.note && <span style={styles.historyReason}> — {c.note}</span>}</span>
                    {c.mtSaved ? <span style={styles.historyMt}>-{c.mtSaved} mt/yr</span> : null}
                    <span style={styles.historyWhen}>{new Date(c.when).toLocaleDateString()}</span>
                  </li>
                ))}
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

function PlanCard({ item, rank, onComplete, onDecline }) {
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
        </div>
      </div>
      <div style={styles.planWhy}>{item.why}</div>
      <div style={styles.planActions}>
        <button type="button" onClick={onComplete} style={styles.completeBtn}>Mark shipped ✓</button>
        <button type="button" onClick={onDecline}  style={styles.declineBtn}>Take off the table</button>
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
  planActions: { display: 'flex', gap: 8, marginTop: 12, paddingLeft: 44 },
  completeBtn: { padding: '6px 12px', background: '#052e1a', color: '#86efac', border: '1px solid #14532d', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  declineBtn:  { padding: '6px 12px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 4, fontSize: 12, cursor: 'pointer' },

  historyBlock: { marginBottom: 14 },
  historyTitle: { fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, marginBottom: 6 },
  historyList: { paddingLeft: 0, listStyle: 'none', margin: 0 },
  historyItem: { padding: '6px 10px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, fontSize: 13, color: '#cbd5e1', marginBottom: 4, display: 'flex', alignItems: 'baseline', gap: 8 },
  historyCheck: { color: '#86efac', fontWeight: 800 },
  historyX:     { color: '#94a3b8', fontWeight: 800 },
  historyMt:    { color: '#86efac', fontVariantNumeric: 'tabular-nums', fontSize: 12, fontWeight: 600 },
  historyWhen:  { fontSize: 11, color: '#64748b' },
  historyReason:{ color: '#94a3b8', fontStyle: 'italic' },
};
