import React, { useState, useEffect, useCallback } from 'react';
import { ModulePage, ModuleSection, Pill } from '../../components/ModuleShell.js';
import { ProvenancePill, ProvenanceLegend } from '../../components/ProvenancePill.js';
import { GRID_MIX_TOTAL_MTCO2E } from '../../data/gridMix.js';
import { ANNUAL_SEQUESTRATION_MT } from '../../data/sinks.js';
import { TOTAL_STUDENTS } from '../../data/students.js';
import { COMPOSED_ANNUALIZE_FACTOR as ANNUALIZE_FACTOR } from '../../data/composedYtd.js';

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
        <details style={styles.sourcesBlock}>
          <summary style={styles.sourcesSummary}>Where do these numbers come from?</summary>
          <div style={styles.provenanceLegend}><ProvenanceLegend compact /></div>
          <div style={styles.contextProvList}>
            <CtxRow provenance="estimated" label={`Scope 1 (${SCOPE1_TOTAL_MT.toLocaleString()} mt/yr)`}
              today="Hand-set placeholder for heating fuel + refrigerants + fleet, sized to typical NH boarding-school footprints. KUA fuel deliveries and refrigerant logs have not been integrated."
              target="Annual fuel-delivery invoices (heating oil + propane) per building × EPA Stationary Combustion factors. HVAC technician service-report mass balance × IPCC AR6 GWP100 for refrigerants. Fleet fuel-card records × EPA gasoline/diesel factors. Flips estimated → measured."
              sourcePath="src/pages/Executive.js SCOPE_TOTALS.scope1Mt" />
            <CtxRow provenance="measured" label={`Scope 2 kWh (${(649439).toLocaleString()} kWh YTD)`}
              today="KUA Distech Eclypse BMS All Meters page, snapshot 2026-05-03 (123 days into 2026)."
              target="Already measured. Improvement: drop the ×2.97 annualization once a full year of BMS data is captured."
              sourcePath="src/data/envysionSnapshot.js" />
            <CtxRow provenance="cited" label={`Scope 2 mtCO₂e (${Math.round(SCOPE2_ANNUAL_MT).toLocaleString()} mt/yr annualized)`}
              today="Measured kWh × per-fuel output emission factors (combined-cycle gas 0.40 kg/kWh, oil 0.78, coal 0.95, imports 0.30) summed over ISO-NE 2024 generation mix. System rate ≈ 0.235 kg/kWh, in eGRID NEWE 2022 range."
              target="Already at target methodology. Refresh as eGRID NEWE 2024 publishes (expected late 2026)."
              sourcePath="src/data/gridMix.js" />
            <CtxRow provenance="estimated" label={`Scope 3 (${SCOPE3_TOTAL_MT.toLocaleString()} mt/yr)`}
              today="Hand-set order-of-magnitude figure for student travel + dining + waste + procurement + commuting + upstream fuel. No measured inventory of any of these categories exists yet."
              target="Student travel: KUA travel office departure logs + ICAO calculator. Dining: Sodexo/SAGE invoices × USEEIO food-sector factors + Project Drawdown overlay. Waste: hauler invoices (tons by stream) × EPA WARM v15.1. Procurement: Business Office spend mapped to USEEIO sectors. Commuting: HR zip-code survey × ICCT fuel-economy. Each subcategory ships independently → cited."
              sourcePath="src/pages/Executive.js SCOPE_TOTALS.scope3Mt" />
            <CtxRow provenance="estimated" label={`Sinks (${Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString()} mt/yr)`}
              today='7 named forest stands × per-acre sequestration rates (IPCC LULUCF defaults: mature mixed hardwood 2.4–2.8 mt/acre/yr; transitional 2.6–3.2; softwood 1.9; open-grown 4.2). Stand names ("North Hill", "Potato Patch", "Chellis Pond riparian", etc.) and per-stand acreages are placeholders.'
              target="Commission a USFS Forest Inventory & Analysis-style stand survey of the actual KUA woodlot — species composition, age class, basal area, real per-stand acreage. IPCC per-acre rates stay; inputs become real. Flips estimated → cited."
              sourcePath="src/data/sinks.js forestStands" />
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
        </div>
      </div>
      <div style={styles.planWhy}>{item.why}</div>
      {item.dataSource && (
        <div style={styles.planSource}>
          <span style={styles.planSourceLabel}>Data source:</span> {item.dataSource}
        </div>
      )}
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
  planSourceLabel: { color: '#64748b', fontWeight: 700, fontStyle: 'normal', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 4 },
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
