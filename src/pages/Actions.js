import React, { useState } from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { reductionActions } from '../data/reductionActions.js';
import { rankActions } from '../utils/hotspots.js';

// Actions = AI Carbon Advisor v1. Rule-based ranking of the proposed
// reduction actions. Each card surfaces all the decision-support fields:
// expected reduction, cost, difficulty, urgency, confidence, owner,
// timeline, status, data source, next action.
//
// Phase-2 upgrade path: replace rankActions() with an LLM call that takes
// the same data + recent campus emission deltas and returns a free-form
// recommendation list with citations.

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

export default function Actions() {
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const ranked = rankActions(reductionActions);
  const filtered = ranked.filter(({ action }) => {
    if (filter !== 'all' && action.category !== filter) return false;
    if (statusFilter !== 'all' && action.status !== statusFilter) return false;
    return true;
  });

  const totalProposed = reductionActions.filter((a) => a.status === 'proposed').length;
  const totalInProgress = reductionActions.filter((a) => a.status === 'in_progress').length;
  const totalImpactMt = reductionActions.reduce((s, a) => s + a.expectedReductionMtCO2e, 0);
  const totalImpactIfAll = totalImpactMt;

  return (
    <ModulePage
      title="AI Carbon Advisor"
      subtitle="Ranked reduction actions with owner, cost, expected impact, and confidence. Ranking score = expected reduction × urgency × confidence − difficulty penalty."
    >
      <MetricGrid metrics={[
        { label: 'Proposed actions', value: totalProposed, accent: '#22d3ee' },
        { label: 'In progress', value: totalInProgress, accent: '#fbbf24' },
        { label: 'Total potential', value: totalImpactIfAll.toFixed(0), unit: 'mtCO₂e/yr', accent: '#86efac', note: 'If every action shipped' },
        { label: 'Top action', value: ranked[0].action.expectedReductionMtCO2e.toFixed(0), unit: 'mtCO₂e/yr', accent: '#ef4444', note: ranked[0].action.title },
      ]} />

      <ModuleSection title="Filter">
        <div style={styles.filterRow}>
          <FilterGroup label="Category" value={filter} setValue={setFilter} options={[
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
        title="Ranked actions"
        hint="Click any row to see the data source, next action, and full implementation notes."
      >
        <div style={styles.list}>
          {filtered.map(({ action, score }, i) => {
            const isExpanded = expanded === action.id;
            const meta = CATEGORY_META[action.category] || { label: action.category, accent: '#94a3b8' };
            return (
              <div key={action.id} style={styles.actionCard(meta.accent)}>
                <div style={styles.cardHead} onClick={() => setExpanded(isExpanded ? null : action.id)}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.rankLine}>
                      <span style={styles.rank}>#{i + 1}</span>
                      <Pill kind="info">{meta.label}</Pill>
                      <Pill kind={STATUS_KIND[action.status] || 'neutral'}>{action.status.replace('_', ' ')}</Pill>
                    </div>
                    <div style={styles.cardTitle}>{action.title}</div>
                    <div style={styles.cardSub}>{action.description}</div>
                  </div>
                  <div style={styles.impact}>
                    <div style={styles.impactValue}>{action.expectedReductionMtCO2e.toFixed(0)}</div>
                    <div style={styles.impactUnit}>mtCO₂e/yr</div>
                  </div>
                </div>

                <div style={styles.statRow}>
                  <Stat label="Cost" value={action.estimatedCostUsd === 0 ? '$0' : `$${action.estimatedCostUsd.toLocaleString()}`} />
                  <Stat label="Difficulty" value={action.difficulty} />
                  <Stat label="Urgency" value={action.urgency} />
                  <Stat label="Confidence" value={action.confidence} />
                  <Stat label="Score" value={score.toFixed(0)} />
                </div>

                {isExpanded && (
                  <div style={styles.expanded}>
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
  filterRow: { display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' },
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
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, cursor: 'pointer' },
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
