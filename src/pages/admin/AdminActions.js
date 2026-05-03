import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../../components/ModuleShell.js';
import { reductionActions, reductionActionsByVisibility } from '../../data/reductionActions.js';
import { rankActions } from '../../utils/hotspots.js';

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

  const pool = reductionActionsByVisibility(visibility);
  const ranked = rankActions(pool);
  const filtered = ranked.filter(({ action }) => {
    if (category !== 'all' && action.category !== category) return false;
    if (statusFilter !== 'all' && action.status !== statusFilter) return false;
    return true;
  });

  const adminCount  = reductionActions.filter((a) => a.visibility === 'admin').length;
  const publicCount = reductionActions.filter((a) => a.visibility === 'public').length;
  const totalImpact = reductionActions.reduce((s, a) => s + a.expectedReductionMtCO2e, 0);

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
        { label: 'Total potential', value: totalImpact.toFixed(0), unit: 'mtCO₂e/yr', accent: '#86efac', note: 'If every action shipped' },
        { label: 'Top action',      value: ranked[0]?.action.expectedReductionMtCO2e.toFixed(0) ?? '—', unit: 'mtCO₂e/yr', accent: '#ef4444', note: ranked[0]?.action.title },
      ]} />

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
};
