import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useMeasuredScopeTotals } from '../../hooks/useMeasuredScopeTotals.js';
import { GROSS_MT, SCOPE2_TOTAL_MT } from '../../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../../data/sinks.js';

// /admin/data-quality
//
// Visual summary of how much of KUA's footprint is now sourced from
// measured records vs the bottom-up cross-check placeholder. Useful
// for AASHE STARS reviewers + admins who want a single page that
// answers "how complete is our data?".
//
// Three sections:
//   1. Headline: % of gross emissions composed from measured records.
//   2. Per-scope progress bars (green = measured, gray = estimated).
//   3. Per-table row counts + last-updated timestamps so admins know
//      where to focus their next data-entry session.

// Each entry maps a Supabase table to which scope component it
// drives. The .scope label flips to 'measured' in the per-scope
// progress block when this row count > 0.
// One row per table the live measured-data hooks actually read from.
// Phase 32-34 reconciliation: useMeasuredScope1 reads 5 tables and
// useMeasuredScope3 reads 8, so the data-quality summary needs to
// list all of them — otherwise admins entering data through the
// per-scope pages would see "0 rows" on a dashboard that's actually
// reading from the populated table elsewhere.
const TABLE_SOURCES = [
  // ─── Scope 1 ──────────────────────────────────────────────────
  { table: 'fuel_bills',                label: 'Fuel bills (legacy admin portal)', scope: 'Scope 1', tsCol: 'date',          cta: '/admin/legacy' },
  { table: 'scope1_heating_oil',        label: 'Heating oil deliveries',           scope: 'Scope 1', tsCol: 'delivery_date', cta: '/admin/scope-1/heating-oil' },
  { table: 'scope1_propane',            label: 'Propane deliveries',               scope: 'Scope 1', tsCol: 'delivery_date', cta: '/admin/scope-1/propane' },
  { table: 'scope1_fleet',              label: 'Fleet fuel records',               scope: 'Scope 1', tsCol: 'period_end',    cta: '/admin/scope-1/fleet' },
  { table: 'scope1_refrigerants',       label: 'Refrigerant service logs',         scope: 'Scope 1', tsCol: 'service_date',  cta: '/admin/scope-1/refrigerants' },
  // ─── Scope 3 — cohorts ────────────────────────────────────────
  { table: 'day_students',              label: 'Day students',                     scope: 'Scope 3', tsCol: 'created_at',    cta: '/admin/scope-3' },
  { table: 'us_boarding_students',      label: 'US boarding students',             scope: 'Scope 3', tsCol: 'created_at',    cta: '/admin/scope-3' },
  { table: 'international_students',    label: 'International students',           scope: 'Scope 3', tsCol: 'created_at',    cta: '/admin/scope-3' },
  // ─── Scope 3 — trips + waste + spend + commute ────────────────
  { table: 'study_abroad',              label: 'Study abroad trips',               scope: 'Scope 3', tsCol: 'departure_date',cta: '/admin/scope-3' },
  { table: 'faculty_travel',            label: 'Faculty travel',                   scope: 'Scope 3', tsCol: 'departure_date',cta: '/admin/scope-3' },
  { table: 'waste',                     label: 'Waste records',                    scope: 'Scope 3', tsCol: 'date',          cta: '/admin/scope-3' },
  { table: 'purchased_goods',           label: 'Purchased goods (Cat 1 EEIO)',     scope: 'Scope 3', tsCol: 'created_at',    cta: '/admin/scope-3/cat1-purchased-goods' },
  { table: 'commuting',                 label: 'Faculty/staff commute (Cat 7)',    scope: 'Scope 3', tsCol: 'created_at',    cta: '/admin/scope-3/cat7-commuting' },
  // ─── Sinks ────────────────────────────────────────────────────
  { table: 'forest_stand_actuals',      label: 'Forest stand inventory',           scope: 'Sinks',   tsCol: 'created_at',    cta: '/admin/sinks/stands' },
];

export default function AdminDataQuality() {
  const live = useMeasuredScopeTotals();
  const [tableStats, setTableStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      // For each table: row count + most recent timestamp. Two queries
      // per table; in parallel across all tables.
      const results = await Promise.all(
        TABLE_SOURCES.map(async ({ table, tsCol }) => {
          try {
            const [{ count }, { data }] = await Promise.all([
              supabase.from(table).select('*', { count: 'exact', head: true }),
              supabase.from(table).select(tsCol).order(tsCol, { ascending: false }).limit(1),
            ]);
            const lastUpdated = Array.isArray(data) && data.length > 0 ? data[0][tsCol] : null;
            return [table, { count: count ?? 0, lastUpdated, error: null }];
          } catch (err) {
            return [table, { count: 0, lastUpdated: null, error: err?.message || 'fetch failed' }];
          }
        })
      );
      if (cancelled) return;
      setTableStats(Object.fromEntries(results));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  // Compose the four scope-level rollups.
  const grossTotal = live.grossMt || GROSS_MT;
  const measuredScope1Mt = live.scope1Measured ? live.scope1Mt : 0;
  const measuredScope2Mt = SCOPE2_TOTAL_MT; // always cited via BMS
  const measuredScope3Mt = live.scope3Measured ? live.scope3Mt : 0;
  const measuredSinksMt = live.sinksMeasured ? live.sinkMt : 0;
  const measuredGrossMt = measuredScope1Mt + measuredScope2Mt + measuredScope3Mt;
  const pctMeasured = grossTotal > 0 ? Math.round((measuredGrossMt / grossTotal) * 100) : 0;

  const scopeRows = [
    {
      label: 'Scope 1 — Heating + fleet + refrigerants',
      mt: live.scope1Mt,
      measuredMt: measuredScope1Mt,
      measured: live.scope1Measured,
      tables: ['fuel_bills', 'scope1_heating_oil', 'scope1_propane', 'scope1_fleet', 'scope1_refrigerants'],
    },
    {
      label: 'Scope 2 — Electricity (BMS-measured)',
      mt: live.scope2Mt,
      measuredMt: measuredScope2Mt,
      measured: true,
      tables: [],
      note: 'Always live via the Distech Eclypse BMS. No admin entry required.',
    },
    {
      label: 'Scope 3 — Travel + waste',
      mt: live.scope3Mt,
      measuredMt: measuredScope3Mt,
      measured: live.scope3Measured,
      tables: ['day_students', 'us_boarding_students', 'international_students', 'study_abroad', 'faculty_travel', 'waste', 'purchased_goods', 'commuting'],
    },
    {
      label: 'Sinks — Forest sequestration',
      mt: live.sinkMt,
      measuredMt: measuredSinksMt,
      measured: live.sinksMeasured,
      tables: ['forest_stand_actuals'],
      offset: true,
    },
  ];

  return (
    <div>
      <h1 style={styles.title}>Data Quality</h1>
      <p style={styles.subtitle}>
        How much of KUA's reported footprint is now composed from measured records vs the
        bottom-up published-method cross-check placeholder. AASHE STARS reviewers can use this
        page as a single-glance audit trail.
      </p>

      <div style={styles.headline}>
        <div style={styles.headlineLabel}>Gross emissions composed from measured records</div>
        <div style={styles.headlineValue}>
          {pctMeasured}<span style={styles.headlinePercent}>%</span>
        </div>
        <div style={styles.headlineDetail}>
          {Math.round(measuredGrossMt).toLocaleString()} of {Math.round(grossTotal).toLocaleString()} mtCO₂e/yr ·
          {' '}{live.measuredScopes}/4 scope rows live (Scope 2 always counts; Scope 1 / Scope 3 / sinks each flip independently)
        </div>
        <div style={styles.headlineBar}>
          <div style={{ ...styles.headlineBarFill, width: `${Math.min(100, pctMeasured)}%` }} />
        </div>
      </div>

      <h2 style={styles.h2}>Per-scope status</h2>
      <div style={styles.scopeGrid}>
        {scopeRows.map((row) => {
          const pct = row.mt > 0 ? Math.round((row.measuredMt / row.mt) * 100) : 0;
          return (
            <div key={row.label} style={{ ...styles.scopeCard, borderLeftColor: row.measured ? '#22c55e' : '#475569' }}>
              <div style={styles.scopeCardHead}>
                <span style={styles.scopeLabel}>{row.label}</span>
                <span style={{ ...styles.pill, background: row.measured ? '#0e3a1f' : '#1f2937', color: row.measured ? '#86efac' : '#94a3b8', borderColor: row.measured ? '#16a34a' : '#475569' }}>
                  {row.measured ? '✓ measured' : 'estimated'}
                </span>
              </div>
              <div style={styles.scopeMt}>
                {row.offset && '−'}{Math.round(row.mt).toLocaleString()}<span style={styles.scopeMtUnit}>mtCO₂e/yr</span>
              </div>
              {!row.note && (
                <div style={styles.scopeProgressWrap}>
                  <div style={{ ...styles.scopeProgressFill, width: `${Math.min(100, pct)}%`, background: row.measured ? '#22c55e' : '#475569' }} />
                </div>
              )}
              {row.note && <div style={styles.scopeNote}>{row.note}</div>}
            </div>
          );
        })}
      </div>

      <h2 style={styles.h2}>Per-table inventory</h2>
      {loading && <div style={styles.placeholder}>Loading row counts…</div>}
      {!loading && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Table</th>
              <th style={styles.th}>Scope</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Rows</th>
              <th style={styles.th}>Last entry</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {TABLE_SOURCES.map((src) => {
              const stats = tableStats[src.table] || { count: 0, lastUpdated: null };
              const empty = stats.count === 0;
              return (
                <tr key={src.table}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 600 }}>{src.label}</div>
                    <div style={styles.tableMono}>{src.table}</div>
                  </td>
                  <td style={styles.td}>{src.scope}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: empty ? '#64748b' : '#22d3ee' }}>
                    {stats.count.toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    {stats.lastUpdated
                      ? <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{String(stats.lastUpdated).slice(0, 10)}</span>
                      : <span style={{ color: '#475569' }}>—</span>}
                  </td>
                  <td style={styles.td}>
                    {empty && src.cta && (
                      <Link to={src.cta} style={styles.cta}>Enter data →</Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  title:    { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760, lineHeight: 1.6 },

  headline: { marginTop: 28, padding: '24px 28px', background: 'linear-gradient(135deg, #0f172a 0%, #0b1220 100%)', border: '1px solid #1f2937', borderRadius: 12 },
  headlineLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 },
  headlineValue: { marginTop: 8, fontSize: 56, color: '#22c55e', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  headlinePercent: { fontSize: 28, color: '#94a3b8', marginLeft: 6 },
  headlineDetail: { marginTop: 12, fontSize: 13, color: '#94a3b8', lineHeight: 1.5 },
  headlineBar: { marginTop: 14, height: 8, background: '#0a0f1c', border: '1px solid #1f2937', borderRadius: 4, overflow: 'hidden' },
  headlineBarFill: { height: '100%', background: 'linear-gradient(90deg, #16a34a 0%, #22c55e 100%)' },

  h2: { marginTop: 36, marginBottom: 14, fontSize: 16, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },

  scopeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 },
  scopeCard: { padding: '14px 18px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #475569', borderRadius: 8 },
  scopeCardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' },
  scopeLabel: { fontSize: 13, color: '#e5e7eb', fontWeight: 600 },
  pill: { fontSize: 10, padding: '2px 8px', border: '1px solid', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 },
  scopeMt: { marginTop: 10, fontSize: 22, color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
  scopeMtUnit: { fontSize: 12, color: '#94a3b8', marginLeft: 6, fontWeight: 500 },
  scopeProgressWrap: { marginTop: 12, height: 6, background: '#0a0f1c', border: '1px solid #1f2937', borderRadius: 3, overflow: 'hidden' },
  scopeProgressFill: { height: '100%' },
  scopeNote: { marginTop: 12, fontSize: 12, color: '#94a3b8', fontStyle: 'italic' },

  placeholder: { padding: 32, background: '#0f172a', border: '1px dashed #334155', borderRadius: 12, textAlign: 'center', color: '#94a3b8' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 10, overflow: 'hidden' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '12px 14px', fontSize: 13, color: '#cbd5e1', borderBottom: '1px solid #1f2937', verticalAlign: 'top' },
  tableMono: { fontSize: 11, color: '#64748b', fontFamily: 'ui-monospace, monospace', marginTop: 2 },
  cta: { fontSize: 12, color: '#fbbf24', textDecoration: 'none', fontWeight: 700 },
};
