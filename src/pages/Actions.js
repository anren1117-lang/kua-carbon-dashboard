import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { ProvenancePill } from '../components/ProvenancePill.js';
import { reductionActions, reductionActionsByVisibility } from '../data/reductionActions.js';
import { TOTAL_STUDENTS } from '../data/students.js';
import { dorms } from '../data/dorms.js';
import { rankActions } from '../utils/hotspots.js';
import { GROSS_MT } from '../data/scopeTotals.js';

// Public Actions page — interactive: students pick which actions
// they'll commit to and the page shows in real time how that moves
// the campus number.
//
// Each public action's expectedReductionMtCO2e is the per-student
// annual savings if YOU adopt it. The "Your impact" panel multiplies
// across whatever scope the student picks (just me / my dorm / every
// student) so the lever they're pulling is concrete, not abstract.

const CATEGORY_META = {
  energy:        { label: 'Energy',        accent: '#fbbf24' },
  dining:        { label: 'Dining',        accent: '#22c55e' },
  transportation:{ label: 'Transportation',accent: '#3b82f6' },
  waste:         { label: 'Waste',         accent: '#a855f7' },
  procurement:   { label: 'Procurement',   accent: '#06b6d4' },
  engagement:    { label: 'Engagement',    accent: '#ef4444' },
};

const STORAGE_KEY = 'kua_committed_actions';
const KUA_GROSS_MT = GROSS_MT;      // Reactive — composed from scopeTotals.
const TYPICAL_DORM = 22;            // Approx. KUA dorm population for "my dorm" scope.

function loadCommitted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch { return new Set(); }
}
function saveCommitted(set) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])); } catch {}
}

export default function Actions() {
  const [filter, setFilter] = useState('all');
  const [scope, setScope] = useState('me');                   // 'me' | 'dorm' | 'campus'
  const [committed, setCommitted] = useState(() => loadCommitted());
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { saveCommitted(committed); }, [committed]);

  const publicActions = reductionActionsByVisibility('public');
  const adminOnlyCount = reductionActions.length - publicActions.length;
  const ranked = rankActions(publicActions);
  const filtered = ranked.filter(({ action }) => {
    if (filter !== 'all' && action.category !== filter) return false;
    return true;
  });

  function toggle(id) {
    setCommitted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Live impact math. Per-student values × the chosen scope multiplier.
  const myMt = useMemo(
    () => publicActions.filter((a) => committed.has(a.id)).reduce((s, a) => s + a.expectedReductionMtCO2e, 0),
    [publicActions, committed],
  );
  const scopeMultiplier = scope === 'me' ? 1 : scope === 'dorm' ? TYPICAL_DORM : TOTAL_STUDENTS;
  const totalMt = myMt * scopeMultiplier;
  const totalKg = totalMt * 1000;
  const pctOfGross = (totalMt / KUA_GROSS_MT) * 100;

  // Equivalents — concrete units a student feels.
  const milesNotDriven = totalKg / 0.351;     // EPA passenger-vehicle factor
  const beefMealsAvoided = totalKg / 9;       // ~9 kg CO2e per 150 g beef meal
  const flightsLondonRT = totalMt / 1.4;      // Approx. transatlantic round-trip per pax

  return (
    <ModulePage
      title="What you can do"
      subtitle={
        <>
          Pick the actions <em>you'll</em> commit to. As you check items,
          the panel below shows how much carbon you save and what happens
          to KUA's number if your dorm — or every student — joins you.
          {adminOnlyCount > 0 && (
            <>
              {' '}School-side decisions (HVAC, dining menus, capital projects) live on the <Link to="/admin/actions" style={{ color: '#22d3ee' }}>admin Actions view</Link>.
            </>
          )}
        </>
      }
    >
      <ModuleSection title="Your impact" hint={<>The numbers update as you check the box on each action below. <ProvenancePill provenance="estimated" /> kg/yr values are placeholder benchmarks — Project Drawdown, EPA WARM, and ICAO methodologies applied to typical behavior-change ranges. Treat as order-of-magnitude.</>}>
        <div style={styles.impactPanel}>
          <div style={styles.scopeRow}>
            <span style={styles.scopeLabel}>If</span>
            <ScopeChip active={scope === 'me'} onClick={() => setScope('me')}>just me</ScopeChip>
            <ScopeChip active={scope === 'dorm'} onClick={() => setScope('dorm')}>my dorm (~{TYPICAL_DORM} students)</ScopeChip>
            <ScopeChip active={scope === 'campus'} onClick={() => setScope('campus')}>every KUA student ({TOTAL_STUDENTS})</ScopeChip>
            <span style={styles.scopeLabel}>do this:</span>
          </div>

          {committed.size === 0 ? (
            <div style={styles.emptyHint}>
              ↓ Check the box on any action below to start. The bigger the lever, the bigger this number.
            </div>
          ) : (
            <>
              <div style={styles.heroRow}>
                <div>
                  <div style={styles.heroLabel}>Carbon saved per year</div>
                  <div style={styles.heroValue}>
                    {totalKg >= 1000
                      ? <>{totalMt.toFixed(2)}<span style={styles.heroUnit}> mtCO₂e</span></>
                      : <>{totalKg.toFixed(0)}<span style={styles.heroUnit}> kg CO₂e</span></>}
                  </div>
                </div>
                <div style={styles.heroDelta}>
                  <div style={styles.heroLabel}>Share of KUA's gross</div>
                  <div style={styles.heroPct}>{pctOfGross.toFixed(2)}%</div>
                  <div style={styles.heroDeltaSub}>{committed.size} of {publicActions.length} actions chosen</div>
                </div>
              </div>

              <div style={styles.eqGrid}>
                <Eq label="Miles not driven" value={milesNotDriven >= 1000 ? `${(milesNotDriven / 1000).toFixed(1)}k` : milesNotDriven.toFixed(0)} />
                <Eq label="Beef meals avoided" value={beefMealsAvoided.toFixed(0)} />
                <Eq label="London round-trip flights" value={flightsLondonRT >= 1 ? flightsLondonRT.toFixed(1) : flightsLondonRT.toFixed(2)} />
                <Eq label="Trees-year equivalent" value={(totalMt / 0.0605).toFixed(0)} />
              </div>

              <div style={styles.barWrap}>
                <div style={styles.barLabel}>
                  <span>KUA gross: {KUA_GROSS_MT.toLocaleString()} mt/yr</span>
                  <span>You're moving {pctOfGross.toFixed(2)}% of it</span>
                </div>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${Math.min(100, pctOfGross)}%` }} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCommitted(new Set())}
                style={styles.clearBtn}
              >
                Clear my commitments
              </button>
            </>
          )}
        </div>
      </ModuleSection>

      <ModuleSection title="Filter">
        <div style={styles.filterRow}>
          <FilterGroup label="Category" value={filter} setValue={setFilter} options={[
            { value: 'all', label: 'All' },
            ...Object.entries(CATEGORY_META).map(([v, m]) => ({ value: v, label: m.label })),
          ]} />
        </div>
      </ModuleSection>

      <ModuleSection title="Things you can do" hint="Tick the box to commit. Click anywhere else on a card to expand it.">
        <div style={styles.list}>
          {filtered.map(({ action }, i) => {
            const isExpanded = expanded === action.id;
            const isCommitted = committed.has(action.id);
            const meta = CATEGORY_META[action.category] || { label: action.category, accent: '#94a3b8' };
            const perStudentKg = action.expectedReductionMtCO2e * 1000;
            const scopeKg = perStudentKg * scopeMultiplier;
            return (
              <div
                key={action.id}
                style={{
                  ...styles.actionCard(meta.accent),
                  borderColor: isCommitted ? '#22c55e' : '#1f2937',
                  background: isCommitted ? '#0a1f17' : '#0b1220',
                }}
              >
                <div style={styles.cardHead}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isCommitted}
                    onClick={() => toggle(action.id)}
                    style={{ ...styles.checkbox, ...(isCommitted ? styles.checkboxOn : {}) }}
                    aria-label={isCommitted ? `Uncommit from ${action.title}` : `Commit to ${action.title}`}
                  >
                    {isCommitted ? '✓' : ''}
                  </button>
                  <button
                    type="button"
                    style={{ ...styles.cardBody, background: 'transparent', border: 'none', textAlign: 'left', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}
                    onClick={() => setExpanded(isExpanded ? null : action.id)}
                    aria-expanded={isExpanded}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={styles.rankLine}>
                        <span style={styles.rank}>#{i + 1}</span>
                        <Pill kind="info">{meta.label}</Pill>
                        {isCommitted && <Pill kind="good">✓ I'll do this</Pill>}
                      </div>
                      <div style={styles.cardTitle}>{action.title}</div>
                      <div style={styles.cardSub}>{action.description}</div>
                    </div>
                    <div style={styles.impact}>
                      <div style={styles.impactValue}>{perStudentKg.toFixed(0)}</div>
                      <div style={styles.impactUnit}>kg/yr · you</div>
                      {scope !== 'me' && (
                        <div style={styles.impactScope}>
                          {scopeKg >= 1000 ? `${(scopeKg/1000).toFixed(1)} mt` : `${scopeKg.toFixed(0)} kg`} · {scope === 'dorm' ? 'dorm' : 'campus'}
                        </div>
                      )}
                    </div>
                  </button>
                </div>

                {isExpanded && (
                  <div id={`action-detail-${action.id}`} style={styles.expanded}>
                    <Field label="Owner" value={action.owner} />
                    <Field label="When" value={action.timeline} />
                    <Field label="Data source" value={action.dataSource} />
                    <Field label="Your next step" value={action.nextAction} />
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

function ScopeChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        border: '1px solid',
        cursor: 'pointer',
        background: active ? '#22c55e' : '#0b1220',
        color: active ? '#0b1220' : '#cbd5e1',
        borderColor: active ? '#22c55e' : '#1f2937',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}

function Eq({ label, value }) {
  return (
    <div style={styles.eqCell}>
      <div style={styles.eqValue}>{value}</div>
      <div style={styles.eqLabel}>{label}</div>
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
  impactPanel: { padding: 18, background: 'linear-gradient(135deg, #0a1f17 0%, #0b1220 100%)', border: '1px solid #14532d', borderRadius: 10 },
  scopeRow: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 14 },
  scopeLabel: { fontSize: 13, color: '#94a3b8' },
  emptyHint: { padding: '14px 16px', background: '#0b1220', border: '1px dashed #334155', borderRadius: 8, color: '#94a3b8', fontSize: 14, lineHeight: 1.6 },

  heroRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', marginBottom: 16 },
  heroLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 },
  heroValue: { fontSize: 'clamp(36px, 8vw, 56px)', color: '#86efac', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums', marginTop: 6 },
  heroUnit: { fontSize: 'clamp(14px, 2.5vw, 18px)', color: '#94a3b8', fontWeight: 500, marginLeft: 8 },
  heroDelta: { textAlign: 'right' },
  heroPct: { fontSize: 32, color: '#fbbf24', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums', marginTop: 6 },
  heroDeltaSub: { fontSize: 12, color: '#64748b', marginTop: 4 },

  eqGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 },
  eqCell: { padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, textAlign: 'center' },
  eqValue: { fontSize: 22, color: '#e5e7eb', fontWeight: 800, fontVariantNumeric: 'tabular-nums', lineHeight: 1 },
  eqLabel: { fontSize: 11, color: '#94a3b8', marginTop: 6, lineHeight: 1.4 },

  barWrap: { marginBottom: 14 },
  barLabel: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 6 },
  barTrack: { height: 16, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, overflow: 'hidden' },
  barFill: { height: '100%', background: 'linear-gradient(90deg, #22c55e, #fbbf24)', transition: 'width 0.3s ease' },

  clearBtn: { padding: '6px 12px', background: 'transparent', border: '1px solid #334155', borderRadius: 6, color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' },

  filterRow: { display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' },
  filterGroup: {},
  filterLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: { padding: '6px 12px', borderRadius: 999, fontSize: 12, border: '1px solid', cursor: 'pointer', fontWeight: 600 },

  list: { display: 'grid', gap: 12 },
  actionCard: (accent) => ({
    padding: '14px 16px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderLeft: `4px solid ${accent}`,
    borderRadius: 8,
    transition: 'border-color 0.15s, background 0.15s',
  }),
  cardHead: { display: 'flex', alignItems: 'flex-start', gap: 14 },
  cardBody: { flex: 1, display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' },
  checkbox: { width: 28, height: 28, flexShrink: 0, borderRadius: 6, border: '2px solid #334155', background: 'transparent', color: '#86efac', fontSize: 18, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' },
  checkboxOn: { background: '#22c55e', borderColor: '#22c55e', color: '#0b1220' },
  rankLine: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 },
  rank: { fontSize: 12, color: '#64748b', fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
  cardTitle: { fontSize: 16, color: '#e5e7eb', fontWeight: 700 },
  cardSub: { fontSize: 14, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 },
  impact: { textAlign: 'right', minWidth: 100 },
  impactValue: { fontSize: 24, color: '#86efac', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  impactUnit: { fontSize: 11, color: '#64748b', marginTop: 4 },
  impactScope: { fontSize: 11, color: '#fbbf24', marginTop: 6, fontWeight: 600 },

  expanded: { marginTop: 12, paddingTop: 12, borderTop: '1px solid #1f2937', display: 'grid', gap: 10 },
  field: { display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, fontSize: 13 },
  fieldLabel: { color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, fontSize: 11 },
  fieldValue: { color: '#cbd5e1', lineHeight: 1.5 },
};
