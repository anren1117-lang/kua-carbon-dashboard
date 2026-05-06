import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../../components/ModuleShell.js';
import { ProvenancePill } from '../../components/ProvenancePill.js';
import { reductionActions, reductionActionsByVisibility } from '../../data/reductionActions.js';
import { rankActions } from '../../utils/hotspots.js';
import { getCustomActions, saveCustomAction, deleteCustomAction } from '../../data/customActions.js';
import { adminFetch } from '../../utils/adminFetch.js';

// Admin Actions — same UX as the public /actions page, but shows
// EVERY action regardless of visibility, including capex / vendor /
// board items that don't appear publicly. A visibility chip above
// each card flags which tier the item belongs to so reviewers know
// which list it appears on.

const CATEGORY_META = {
  energy:        { label: 'Energy',        accent: '#fbbf24' },
  dining:        { label: 'Dining',        accent: '#22c55e' },
  transportation:{ label: 'Transportation',accent: '#3b82f6' },
  waste:         { label: 'Waste',         accent: '#a855f7' },
  procurement:   { label: 'Procurement',   accent: '#06b6d4' },
  engagement:    { label: 'Engagement',    accent: '#ef4444' },
};

const STATUS_KIND = {
  proposed:    'info',
  in_progress: 'warn',
  completed:   'good',
  blocked:     'bad',
};

export default function AdminActions() {
  const [visibility, setVisibility] = useState('all');
  const [category, setCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  // tick increments whenever a custom action is added/edited/deleted so
  // the rest of the page recomputes from the localStorage store.
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  // Re-read custom actions on every tick (after add/edit/delete). The
  // store is localStorage-backed and synchronous, so we just call it
  // inside useMemo with `tick` as a tripwire.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const customActions = useMemo(() => getCustomActions(), [tick]);
  // Adapt custom actions into the same shape the existing render path
  // expects (reductionActions schema). Marked _custom so the card UI
  // can show the "Custom" pill + delete button.
  const customAdapted = customActions.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description || '',
    category: ['energy','dining','transportation','waste','procurement','engagement'].includes(c.category) ? c.category : 'engagement',
    expectedReductionMtCO2e: c.expectedMtPerYear || 0,
    estimatedCostUsd: c.estimatedCostUsd || 0,
    difficulty: c.difficulty || 'medium',
    urgency: c.urgency || 'medium',
    confidence: c.confidence || 'medium',
    owner: c.owner || 'Sustainability Office',
    timeline: c.timeline || 'this-year',
    status: c.status || 'proposed',
    dataSource: c.dataSource || '',
    nextAction: c.methodology || '',
    visibility: 'admin',
    _custom: true,
    _provenance: c.provenance || 'estimated',
  }));

  const pool = visibility === 'all'
    ? [...reductionActionsByVisibility('all'), ...customAdapted]
    : visibility === 'admin'
      ? [...reductionActionsByVisibility('admin'), ...customAdapted]
      : reductionActionsByVisibility('public');
  const ranked = rankActions(pool);
  const filtered = ranked.filter(({ action }) => {
    if (category !== 'all' && action.category !== category) return false;
    if (statusFilter !== 'all' && action.status !== statusFilter) return false;
    return true;
  });

  const adminCount  = reductionActions.filter((a) => a.visibility === 'admin').length;
  const publicCount = reductionActions.filter((a) => a.visibility === 'public').length;
  const totalImpact = [...reductionActions, ...customAdapted].reduce(
    (s, a) => s + (a.expectedReductionMtCO2e ?? a.expectedMtPerYear ?? 0), 0,
  );

  return (
    <ModulePage
      title="Reduction Actions — Admin View"
      subtitle={
        <>
          Every action regardless of visibility. Public-tagged items also appear on
          {' '}<Link to="/actions" style={{ color: '#22d3ee' }}>/actions</Link>.
          Admin-tagged items (capex, vendor decisions, pre-board figures) live only here.
        </>
      }
    >
      <MetricGrid metrics={[
        { label: 'Public actions',  value: publicCount,        accent: '#22c55e' },
        { label: 'Admin-only',      value: adminCount,         accent: '#fbbf24' },
        { label: 'Custom (yours)',  value: customActions.length, accent: '#a855f7', note: 'From the Add form below' },
        { label: 'Total potential', value: Math.round(totalImpact).toLocaleString(), unit: 'mtCO₂e/yr', accent: '#86efac', note: 'If every action shipped' },
      ]} />

      <AddCustomActionForm onAdded={refresh} />

      <ModuleSection title="Filter">
        <div style={styles.filterRow}>
          <FilterGroup label="Visibility" value={visibility} setValue={setVisibility} options={[
            { value: 'all',    label: `All (${reductionActions.length})` },
            { value: 'public', label: `Public (${publicCount})` },
            { value: 'admin',  label: `Admin-only (${adminCount})` },
          ]} />
          <FilterGroup label="Category" value={category} setValue={setCategory} options={[
            { value: 'all', label: 'All' },
            ...Object.entries(CATEGORY_META).map(([v, m]) => ({ value: v, label: m.label })),
          ]} />
          <FilterGroup label="Status" value={statusFilter} setValue={setStatusFilter} options={[
            { value: 'all', label: 'All' },
            { value: 'proposed', label: 'Proposed' },
            { value: 'in_progress', label: 'In progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'blocked', label: 'Blocked' },
          ]} />
        </div>
      </ModuleSection>

      <ModuleSection
        title={`${filtered.length} action${filtered.length === 1 ? '' : 's'}`}
        hint="Click any row to see data source + next action. Visibility chip on each card shows which list the item appears on."
      >
        <div style={styles.list}>
          {filtered.map(({ action, score }, i) => {
            const isExpanded = expanded === action.id;
            const meta = CATEGORY_META[action.category] || { label: action.category, accent: '#94a3b8' };
            return (
              <div key={action.id} style={styles.actionCard(meta.accent)}>
                <button
                  type="button"
                  style={{ ...styles.cardHead, background: 'transparent', border: 'none', width: '100%', textAlign: 'left', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}
                  onClick={() => setExpanded(isExpanded ? null : action.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`adminaction-detail-${action.id}`}
                >
                  <div style={{ flex: 1 }}>
                    <div style={styles.rankLine}>
                      <span style={styles.rank}>#{i + 1}</span>
                      <Pill kind={action.visibility === 'admin' ? 'warn' : 'good'}>
                        {action.visibility === 'admin' ? '🔒 admin only' : '🌍 public'}
                      </Pill>
                      <Pill kind="info">{meta.label}</Pill>
                      <Pill kind={STATUS_KIND[action.status] || 'neutral'}>{action.status.replace('_', ' ')}</Pill>
                      {action._custom && <Pill kind="info">✎ custom</Pill>}
                      {action._provenance && <ProvenancePill provenance={action._provenance} />}
                    </div>
                    <div style={styles.cardTitle}>{action.title}</div>
                    <div style={styles.cardSub}>{action.description}</div>
                  </div>
                  <div style={styles.impact}>
                    <div style={styles.impactValue}>
                      {action.expectedReductionMtCO2e >= 1
                        ? action.expectedReductionMtCO2e.toFixed(0)
                        : (action.expectedReductionMtCO2e * 1000).toFixed(0)}
                    </div>
                    <div style={styles.impactUnit}>
                      {action.expectedReductionMtCO2e >= 1
                        ? 'mtCO₂e/yr'
                        : 'kg/yr · per student'}
                    </div>
                  </div>
                </button>

                <div style={styles.statRow}>
                  <Stat label="Cost" value={action.estimatedCostUsd === 0 ? '$0' : `$${action.estimatedCostUsd.toLocaleString()}`} />
                  <Stat label="Difficulty" value={action.difficulty} />
                  <Stat label="Urgency" value={action.urgency} />
                  <Stat label="Confidence" value={action.confidence} />
                  <Stat label="Score" value={score.toFixed(0)} />
                </div>

                {isExpanded && (
                  <div id={`adminaction-detail-${action.id}`} style={styles.expanded}>
                    <Field label="Owner" value={action.owner} />
                    <Field label="Timeline" value={action.timeline} />
                    <Field label="Data source" value={action.dataSource} />
                    <Field label="Next action" value={action.nextAction} />
                    {action._custom && (
                      <div style={{ marginTop: 8, paddingTop: 10, borderTop: '1px solid #1f2937' }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${action.title}"? This cannot be undone.`)) {
                              deleteCustomAction(action.id);
                              if (expanded === action.id) setExpanded(null);
                              refresh();
                            }
                          }}
                          style={styles.deleteBtn}
                        >
                          Delete custom action
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ModuleSection>
    </ModulePage>
  );
}

function FilterGroup({ label, value, setValue, options }) {
  return (
    <div style={styles.filterGroup}>
      <div style={styles.filterLabel}>{label}</div>
      <div style={styles.chipRow}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            style={{
              ...styles.chip,
              background: value === o.value ? '#22d3ee' : '#0b1220',
              color: value === o.value ? '#0b1220' : '#cbd5e1',
              borderColor: value === o.value ? '#22d3ee' : '#1f2937',
            }}
            onClick={() => setValue(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={styles.field}>
      <div style={styles.fieldLabel}>{label}</div>
      <div style={styles.fieldValue}>{value}</div>
    </div>
  );
}

// Form for the admin to enter their own action item. Calls
// /api/admin/estimate-action to get an LLM-anchored carbon estimate +
// methodology, then persists the resulting record to the
// kua_admin_custom_actions localStorage store.
function AddCustomActionForm({ onAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('energy');
  const [owner, setOwner] = useState('Sustainability Office');
  const [timeline, setTimeline] = useState('this-year');
  const [estimating, setEstimating] = useState(false);
  const [estimate, setEstimate] = useState(null); // result of estimate-action
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  function reset() {
    setTitle('');
    setDescription('');
    setCategory('energy');
    setOwner('Sustainability Office');
    setTimeline('this-year');
    setEstimate(null);
    setError(null);
    setSaved(false);
  }

  async function estimateNow() {
    if (!title.trim()) return;
    setEstimating(true);
    setError(null);
    setEstimate(null);
    setSaved(false);
    try {
      const r = await adminFetch('/api/admin/estimate-action', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          owner,
          timeline,
        }),
      });
      let body = {};
      try { body = await r.json(); } catch {}
      if (!r.ok) throw new Error(body.error || `HTTP ${r.status}`);
      setEstimate(body);
    } catch (err) {
      setError(err.message);
    } finally {
      setEstimating(false);
    }
  }

  function save() {
    if (!estimate || !title.trim()) return;
    saveCustomAction({
      title: title.trim(),
      description: description.trim(),
      category,
      owner,
      timeline,
      expectedMtPerYear: estimate.expectedMtPerYear,
      estimatedCostUsd: estimate.estimatedCostUsd,
      methodology: estimate.methodology,
      dataSource: estimate.dataSource,
      provenance: estimate.provenance,
      confidence: estimate.confidence,
      status: 'proposed',
      difficulty: estimate.estimatedCostUsd > 100000 ? 'hard' : estimate.estimatedCostUsd > 10000 ? 'medium' : 'low',
      urgency: 'medium',
    });
    setSaved(true);
    onAdded();
    setTimeout(reset, 1500);
  }

  return (
    <ModuleSection
      title="Add a custom action"
      hint="Describe the action and we'll estimate the annual mtCO₂e reduction by anchoring against published benchmarks (EPA WARM, Project Drawdown, NREL, etc.). Review the methodology before saving — these are estimates, not measurements."
    >
      <div style={styles.formGrid}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={styles.formLabel}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Replace Densmore boiler with high-efficiency condensing unit"
            style={styles.formInput}
            maxLength={200}
          />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={styles.formLabel}>Description (optional but improves the estimate)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Specific quantities, fuel types, or scope — anything that helps narrow the estimate. e.g. 'Densmore burns ~6,000 gal heating oil per winter; condensing unit upgrade saves ~25% combustion emissions.'"
            rows={3}
            style={styles.formTextarea}
            maxLength={2000}
          />
        </div>
        <div>
          <label style={styles.formLabel}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.formInput}>
            {Object.entries(CATEGORY_META).map(([v, m]) => (
              <option key={v} value={v}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={styles.formLabel}>Owner role</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="e.g. Facilities Director"
            style={styles.formInput}
          />
        </div>
        <div>
          <label style={styles.formLabel}>Timeline</label>
          <select value={timeline} onChange={(e) => setTimeline(e.target.value)} style={styles.formInput}>
            <option value="this-quarter">This quarter</option>
            <option value="this-year">This fiscal year</option>
            <option value="this-3-years">Within 3 years</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={estimateNow}
          disabled={!title.trim() || estimating}
          style={{ ...styles.estimateBtn, opacity: !title.trim() || estimating ? 0.5 : 1 }}
        >
          {estimating ? 'Estimating…' : '🧮 Estimate carbon impact'}
        </button>
        {estimate && !saved && (
          <button type="button" onClick={save} style={styles.saveBtn}>
            ✓ Save action
          </button>
        )}
        {saved && <span style={{ color: '#86efac', fontSize: 13, alignSelf: 'center' }}>✓ Saved.</span>}
      </div>

      {error && (
        <div style={styles.formError}>Error: {error}</div>
      )}

      {estimate && (
        <div style={styles.estimateCard}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div>
              <div style={styles.estimateLabel}>Estimated annual reduction</div>
              <div style={styles.estimateValue}>
                {estimate.expectedMtPerYear.toLocaleString()}<span style={styles.estimateUnit}> mtCO₂e/yr</span>
              </div>
            </div>
            <div>
              <div style={styles.estimateLabel}>Estimated cost</div>
              <div style={styles.estimateValueSecondary}>
                {estimate.estimatedCostUsd === 0 ? '$0 (no cost)' : `$${estimate.estimatedCostUsd.toLocaleString()}`}
              </div>
            </div>
            <div>
              <div style={styles.estimateLabel}>Confidence</div>
              <Pill kind={estimate.confidence === 'high' ? 'good' : estimate.confidence === 'medium' ? 'warn' : 'bad'}>
                {estimate.confidence}
              </Pill>
            </div>
            <div>
              <div style={styles.estimateLabel}>Provenance</div>
              <ProvenancePill provenance={estimate.provenance} />
            </div>
          </div>
          <div style={styles.methodologyRow}>
            <div style={styles.methodologyLabel}>Methodology</div>
            <div style={styles.methodologyBody}>{estimate.methodology}</div>
          </div>
          {estimate.dataSource && (
            <div style={styles.methodologyRow}>
              <div style={styles.methodologyLabel}>Data source</div>
              <div style={styles.methodologyBody}>{estimate.dataSource}</div>
            </div>
          )}
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>
            Source: {estimate.mode === 'llm' ? 'AI estimation anchored on published benchmarks' : 'rule-based fallback (no API key configured)'}.
            Review before saving — refine the description and re-estimate if the number seems off.
          </div>
        </div>
      )}
    </ModuleSection>
  );
}

const styles = {
  filterRow: { display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' },
  filterGroup: {},
  filterLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: { padding: '6px 12px', borderRadius: 999, fontSize: 12, border: '1px solid', cursor: 'pointer', fontWeight: 600 },

  list: { display: 'grid', gap: 12 },
  actionCard: (accent) => ({
    padding: '16px 18px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderLeft: `4px solid ${accent}`,
    borderRadius: 8,
  }),
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 },
  rankLine: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 },
  rank: { fontSize: 12, color: '#64748b', fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
  cardTitle: { fontSize: 16, color: '#e5e7eb', fontWeight: 700 },
  cardSub: { fontSize: 14, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 },
  impact: { textAlign: 'right', minWidth: 100 },
  impactValue: { fontSize: 28, color: '#86efac', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  impactUnit: { fontSize: 11, color: '#64748b', marginTop: 4 },

  statRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid #1f2937' },
  stat: { textAlign: 'center' },
  statLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  statValue: { fontSize: 13, color: '#cbd5e1', fontWeight: 600, marginTop: 4, textTransform: 'capitalize' },

  expanded: { marginTop: 12, paddingTop: 12, borderTop: '1px solid #1f2937', display: 'grid', gap: 10 },
  field: { display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, fontSize: 13 },
  fieldLabel: { color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, fontSize: 11 },
  fieldValue: { color: '#cbd5e1', lineHeight: 1.5 },

  formGrid: { display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' },
  formLabel: { display: 'block', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 },
  formInput: { width: '100%', boxSizing: 'border-box', padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontSize: 14, fontFamily: 'inherit' },
  formTextarea: { width: '100%', boxSizing: 'border-box', padding: 10, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#cbd5e1', fontSize: 13, lineHeight: 1.5, fontFamily: 'inherit', resize: 'vertical' },
  estimateBtn: { padding: '10px 18px', background: '#22d3ee', color: '#0b1220', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  saveBtn: { padding: '10px 18px', background: '#22c55e', color: '#0b1220', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  formError: { marginTop: 12, padding: '10px 14px', background: '#3a0d12', border: '1px solid #7f1d1d', borderRadius: 6, color: '#fca5a5', fontSize: 13 },
  estimateCard: { marginTop: 14, padding: '14px 16px', background: '#0a1f17', border: '1px solid #14532d', borderRadius: 8 },
  estimateLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 4 },
  estimateValue: { fontSize: 32, color: '#86efac', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  estimateValueSecondary: { fontSize: 18, color: '#cbd5e1', fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
  estimateUnit: { fontSize: 13, color: '#94a3b8', fontWeight: 500, marginLeft: 6 },
  methodologyRow: { marginTop: 10 },
  methodologyLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 4 },
  methodologyBody: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 },
  deleteBtn: { padding: '6px 12px', background: 'transparent', color: '#fca5a5', border: '1px solid #7f1d1d', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
};
