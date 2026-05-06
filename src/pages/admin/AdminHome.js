import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { NAV_GROUPS } from '../../components/AdminLayout.js';
import { GROSS_MT, SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT, SCOPE3_TOTAL_MT } from '../../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../../data/sinks.js';
import { getCustomActions, getStagePlans } from '../../data/customActions.js';
import { useMeasuredScopeTotals } from '../../hooks/useMeasuredScopeTotals.js';

// Admin dashboard. Mirrors NAV_GROUPS exactly so the home page and the
// header dropdowns stay in sync — adding a new admin page in
// AdminLayout's NAV_GROUPS automatically surfaces here.
//
// Layout: top-line "where the school stands today" stats, then 4
// cards-of-cards (one per nav group), then the live record-count
// strip from Supabase at the bottom.

const QUICK_LINKS = [
  { to: '/admin/scope-3',       icon: '📥', label: 'Log Scope 3 data',    desc: 'Tabbed entry: student travel, faculty trips, waste, purchased goods, commuting — one place for all of it.' },
  { to: '/admin/plan-agent',    icon: '🧭', label: 'Generate a plan',     desc: 'AI-driven 5-7 step plan from your fiscal context.' },
  { to: '/admin/stage-planner', icon: '📋', label: 'Compose stages',      desc: 'Build a phased reduction plan from custom + library actions.' },
  { to: '/admin/actions',       icon: '✎',  label: 'Add a custom action', desc: 'Type an action; AI estimates carbon impact + cost.' },
];

const tableMap = [
  { table: 'fuel_bills',           label: 'Fuel bills' },
  { table: 'day_students',         label: 'Day students' },
  { table: 'us_boarding_students', label: 'US boarding' },
  { table: 'international_students', label: 'International' },
  { table: 'study_abroad',         label: 'Study abroad' },
  { table: 'faculty_travel',       label: 'Faculty travel' },
  { table: 'waste',                label: 'Waste records' },
];

// Per-table specs for the unified activity feed. `tsCol` is the
// column we sort by (varies — fuel_bills uses `date`, students use
// `created_at`, travel uses `departure_date`). `summarize` produces
// the human-readable line (e.g. "100 gal Heating Oil — 2026-04-15").
const FEED_TABLES = [
  {
    table: 'fuel_bills', label: 'Fuel bill', tsCol: 'date',
    select: 'date, fuel_type, gallons',
    summarize: (r) => `${r.gallons || '?'} gal ${r.fuel_type || ''}`.trim(),
  },
  {
    table: 'day_students', label: 'Day student', tsCol: 'created_at',
    select: 'created_at, zip_code, graduation_year',
    summarize: (r) => `Day student • zip ${r.zip_code || '—'} • class of ${r.graduation_year || '—'}`,
  },
  {
    table: 'us_boarding_students', label: 'US boarder', tsCol: 'created_at',
    select: 'created_at, zip_code, state, graduation_year',
    summarize: (r) => `US boarder • ${r.state || ''} ${r.zip_code || ''} • class of ${r.graduation_year || '—'}`,
  },
  {
    table: 'international_students', label: 'International', tsCol: 'created_at',
    select: 'created_at, country, graduation_year',
    summarize: (r) => `International • ${r.country || '—'} • class of ${r.graduation_year || '—'}`,
  },
  {
    table: 'study_abroad', label: 'Study abroad', tsCol: 'departure_date',
    select: 'departure_date, destination_country, destination_city, return_date',
    summarize: (r) => `Study abroad • ${r.destination_city || ''}${r.destination_city && r.destination_country ? ', ' : ''}${r.destination_country || ''}`.trim(),
  },
  {
    table: 'faculty_travel', label: 'Faculty trip', tsCol: 'departure_date',
    select: 'departure_date, destination_country, destination_city, trip_purpose',
    summarize: (r) => `${r.trip_purpose || 'Faculty trip'} • ${r.destination_city || ''}${r.destination_city && r.destination_country ? ', ' : ''}${r.destination_country || ''}`.trim(),
  },
  {
    table: 'waste', label: 'Waste', tsCol: 'date',
    select: 'date, waste_type, amount, unit',
    summarize: (r) => `${r.amount || '?'} ${r.unit || 'tons'} ${r.waste_type || ''}`.trim(),
  },
];

const FEED_LIMIT_PER_TABLE = 5;
const FEED_DISPLAY_LIMIT = 10;

export default function AdminHome() {
  const [counts, setCounts] = useState({});
  const [feed, setFeed] = useState([]);
  const [error, setError] = useState('');
  const [tick] = useState(0);
  const live = useMeasuredScopeTotals();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          tableMap.map(({ table }) => supabase.from(table).select('*', { count: 'exact', head: true }))
        );
        if (cancelled) return;
        const next = {};
        results.forEach((r, i) => { next[tableMap[i].table] = r.count ?? '—'; });
        setCounts(next);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Recent-activity feed. Fetches the last N rows from each canonical
  // admin table, normalizes each row to a uniform { ts, label, summary }
  // shape, sorts by timestamp desc, slices to FEED_DISPLAY_LIMIT.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          FEED_TABLES.map((spec) =>
            supabase
              .from(spec.table)
              .select(spec.select)
              .order(spec.tsCol, { ascending: false })
              .limit(FEED_LIMIT_PER_TABLE)
              .then((r) => ({ spec, data: r.data || [] }))
          )
        );
        if (cancelled) return;
        const flat = [];
        for (const { spec, data } of results) {
          for (const row of data) {
            const ts = row[spec.tsCol];
            if (!ts) continue;
            flat.push({
              ts,
              tsMs: new Date(ts).getTime(),
              table: spec.table,
              label: spec.label,
              summary: spec.summarize(row),
            });
          }
        }
        flat.sort((a, b) => b.tsMs - a.tsMs);
        setFeed(flat.slice(0, FEED_DISPLAY_LIMIT));
      } catch {
        // Activity feed is non-critical; the rest of the page works
        // without it. Surface nothing on failure rather than a scary
        // error banner — the record-counts panel below will already
        // surface DB connectivity issues.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Live counts of admin-authored content.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const customActionCount = getCustomActions().length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stagePlanCount = getStagePlans().length;

  // Headline numbers prefer live measured values when available so the
  // admin sees the same total the public dashboard shows. Falls back
  // to the synchronous module-level constants on first paint.
  const grossEffective = live.grossMt || GROSS_MT;
  const netEffective = live.netMt ?? (GROSS_MT - ANNUAL_SEQUESTRATION_MT);
  const scope1Effective = live.scope1Mt || SCOPE1_TOTAL_MT;
  const scope2Effective = live.scope2Mt || SCOPE2_TOTAL_MT;
  const scope3Effective = live.scope3Mt || SCOPE3_TOTAL_MT;
  const grossRounded = Math.round(grossEffective).toLocaleString();
  const netRounded = Math.round(netEffective).toLocaleString();

  // Data ingestion status: which scope components have flipped from
  // estimated → measured by the rows admins have entered. The order
  // mirrors how a typical admin onboarding plays out (Scope 2 always
  // measured via BMS; Scope 1 next via fuel_bills; Scope 3 last via
  // the six admin tables).
  const ingestionRows = [
    {
      label: 'Scope 2 (electricity)',
      measured: true,
      detail: 'BMS-measured kWh × ISO-NE 2024 per-fuel factors. Always live.',
    },
    {
      label: 'Scope 1 (heating + fleet + refrigerants)',
      measured: live.scope1Measured,
      detail: live.scope1Measured
        ? 'Heating row composed live from fuel_bills. Fleet + refrigerants still bottom-up.'
        : 'Add fuel-delivery invoices via "Log Scope 3 data" → fuel tab to flip to measured.',
    },
    {
      label: 'Scope 3 (travel + waste)',
      measured: live.scope3Measured,
      detail: live.scope3Measured
        ? 'Cohort + trip + waste rows now feeding the canonical total.'
        : 'Add student/travel/waste records via "Log Scope 3 data" to flip to measured.',
    },
    {
      label: 'Scope 3 (purchased goods + dining + commuting)',
      measured: false,
      detail: 'Sodexo / Business Office / HR commute survey integrations not yet shipped — these stay estimated.',
    },
  ];
  const measuredCount = ingestionRows.filter((r) => r.measured).length;
  const totalCount = ingestionRows.length;

  return (
    <div>
      <div style={styles.headLine}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>
          Generate plans, log data, and manage the asset inventory. Use the dropdowns above for
          everything; the cards below mirror those groups so you can also navigate by clicking.
        </p>
      </div>

      <div style={styles.statRow} role="region" aria-label="Headline numbers">
        <Stat label="Gross emissions"      value={grossRounded}                                unit="mtCO₂e/yr" accent="#fbbf24" />
        <Stat label="Net (after sinks)"    value={netRounded}                                  unit="mtCO₂e/yr" accent="#86efac" />
        <Stat label="Scope 1 / 2 / 3"      value={`${Math.round(scope1Effective)} / ${Math.round(scope2Effective)} / ${Math.round(scope3Effective)}`} unit="mtCO₂e/yr" accent="#22d3ee" />
        <Stat label="Custom actions"        value={customActionCount}                           unit={customActionCount === 1 ? 'admin-authored' : 'admin-authored'} accent="#a855f7" />
        <Stat label="Stage plans"           value={stagePlanCount}                              unit={stagePlanCount === 1 ? 'in your library' : 'in your library'} accent="#22c55e" />
      </div>

      <Section
        title="Data ingestion status"
        hint={`${measuredCount} of ${totalCount} scope components are now sourced from measured data. The rest fall back to the published-method bottom-up estimate until the corresponding records land.`}
        accent="#22d3ee"
      >
        <div style={styles.ingestionGrid}>
          {ingestionRows.map((row, i) => (
            <div key={i} style={{ ...styles.ingestionCell, borderLeftColor: row.measured ? '#22c55e' : '#475569' }}>
              <div style={styles.ingestionHead}>
                <span style={{ ...styles.ingestionPill, background: row.measured ? '#0e3a1f' : '#1f2937', color: row.measured ? '#86efac' : '#94a3b8', borderColor: row.measured ? '#16a34a' : '#475569' }}>
                  {row.measured ? '✓ measured' : 'estimated'}
                </span>
                <span style={styles.ingestionLabel}>{row.label}</span>
              </div>
              <div style={styles.ingestionDetail}>{row.detail}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Quick actions" hint="The four most-used admin starting points.">
        <div style={styles.quickGrid}>
          {QUICK_LINKS.map((q) => (
            <Link key={q.to} to={q.to} style={styles.quickCard}>
              <div style={styles.quickIcon} aria-hidden="true">{q.icon}</div>
              <div style={styles.quickLabel}>{q.label}</div>
              <div style={styles.quickDesc}>{q.desc}</div>
            </Link>
          ))}
        </div>
      </Section>

      {NAV_GROUPS.map((group) => (
        <Section
          key={group.key}
          title={group.label}
          hint={group.blurb}
          accent={group.accent}
        >
          <div style={styles.groupGrid}>
            {group.items.map((item) => (
              <Link key={item.to} to={item.to} style={{ ...styles.groupCard, borderLeftColor: group.accent }}>
                <div style={styles.groupCardLabel}>{item.label}</div>
                <div style={styles.groupCardDesc}>{item.desc}</div>
                <div style={styles.groupCardLink}>Open →</div>
              </Link>
            ))}
          </div>
        </Section>
      ))}

      {feed.length > 0 && (
        <Section
          title="Recent activity"
          hint={`Last ${feed.length} record${feed.length === 1 ? '' : 's'} entered across all canonical tables, newest first.`}
          accent="#22c55e"
        >
          <div style={styles.feedList}>
            {feed.map((item, i) => (
              <div key={i} style={styles.feedRow}>
                <div style={styles.feedDate}>{formatFeedDate(item.ts)}</div>
                <div style={styles.feedLabel}>{item.label}</div>
                <div style={styles.feedSummary}>{item.summary}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Supabase record counts" hint="Rows currently in each Supabase table. Falls back to '—' if the database isn't reachable.">
        {error && <div style={styles.error}>Error: {error}</div>}
        <div style={styles.recordGrid}>
          {tableMap.map(({ table, label }) => (
            <div key={table} style={styles.recordCell}>
              <div style={styles.recordLabel}>{label}</div>
              <div style={styles.recordValue}>{counts[table] ?? '…'}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function formatFeedDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toISOString().slice(0, 10);
}

function Section({ title, hint, accent, children }) {
  return (
    <section style={styles.section}>
      <div style={{ ...styles.sectionHead, borderColor: accent || '#1f2937' }}>
        <div style={{ ...styles.sectionTitle, color: accent || '#22d3ee' }}>{title}</div>
        {hint && <div style={styles.sectionHint}>{hint}</div>}
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value, unit, accent }) {
  return (
    <div style={{ ...styles.stat, borderLeftColor: accent }}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
      {unit && <div style={styles.statUnit}>{unit}</div>}
    </div>
  );
}

const styles = {
  headLine: { marginBottom: 24 },
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760, lineHeight: 1.6 },

  statRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 },
  stat: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #22d3ee', borderRadius: 8 },
  statLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  statValue: { fontSize: 22, color: '#e5e7eb', fontWeight: 800, marginTop: 6, fontVariantNumeric: 'tabular-nums' },
  statUnit: { fontSize: 11, color: '#64748b', marginTop: 4 },

  section: { marginTop: 28 },
  sectionHead: { borderLeft: '3px solid #1f2937', paddingLeft: 12, marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 },
  sectionHint: { fontSize: 13, color: '#94a3b8', marginTop: 4 },

  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 },
  quickCard: { display: 'block', padding: '16px 18px', background: 'linear-gradient(135deg, #0f172a 0%, #0b1220 100%)', border: '1px solid #1f2937', borderRadius: 10, color: 'inherit', textDecoration: 'none' },
  quickIcon: { fontSize: 26, marginBottom: 8 },
  quickLabel: { fontSize: 16, color: '#e5e7eb', fontWeight: 700 },
  quickDesc: { fontSize: 13, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 },

  groupGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 },
  groupCard: { display: 'block', padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #22d3ee', borderRadius: 8, color: 'inherit', textDecoration: 'none' },
  groupCardLabel: { fontSize: 15, color: '#e5e7eb', fontWeight: 700 },
  groupCardDesc: { fontSize: 13, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 },
  groupCardLink: { fontSize: 11, color: '#22d3ee', marginTop: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' },

  recordGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 },
  recordCell: { padding: 12, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  recordLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6 },
  recordValue: { marginTop: 6, fontSize: 20, color: '#cbd5e1', fontWeight: 700, fontVariantNumeric: 'tabular-nums' },

  ingestionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 },
  ingestionCell: { padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #475569', borderRadius: 8 },
  ingestionHead: { display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' },
  ingestionPill: { fontSize: 10, padding: '2px 8px', border: '1px solid', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 },
  ingestionLabel: { fontSize: 14, color: '#e5e7eb', fontWeight: 600 },
  ingestionDetail: { fontSize: 12, color: '#94a3b8', marginTop: 8, lineHeight: 1.5 },

  feedList: { display: 'flex', flexDirection: 'column', gap: 4 },
  feedRow: { display: 'grid', gridTemplateColumns: '110px 130px 1fr', gap: 12, padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, fontSize: 13, alignItems: 'baseline' },
  feedDate: { color: '#64748b', fontFamily: 'ui-monospace, monospace', fontSize: 12 },
  feedLabel: { color: '#22d3ee', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4 },
  feedSummary: { color: '#cbd5e1' },

  error: { marginBottom: 10, color: '#fca5a5', fontSize: 13 },
};
