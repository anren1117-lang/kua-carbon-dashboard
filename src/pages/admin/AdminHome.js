import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { NAV_GROUPS } from '../../components/AdminLayout.js';
import { GROSS_MT, SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT, SCOPE3_TOTAL_MT } from '../../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../../data/sinks.js';
import { getCustomActions, getStagePlans } from '../../data/customActions.js';
import { useMeasuredScopeTotals } from '../../hooks/useMeasuredScopeTotals.js';
import { useMeasuredRenewables } from '../../hooks/useMeasuredRenewables.js';
import { ADMIN_TABLE_SOURCES } from '../../data/adminTableSources.js';
import { freshnessBucket } from '../../utils/freshness.js';

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

// Short labels for the bottom-of-page record-counts grid. The
// canonical labels in ADMIN_TABLE_SOURCES are reviewer-friendly (e.g.
// "Fuel bills (legacy admin portal)"); here we want the shortest
// thing that fits in a 6-column grid.
const SHORT_LABELS = {
  fuel_bills: 'Fuel bills',
  scope1_heating_oil: 'Heating oil',
  scope1_propane: 'Propane',
  scope1_fleet: 'Fleet',
  scope1_refrigerants: 'Refrigerants',
  day_students: 'Day students',
  us_boarding_students: 'US boarding',
  international_students: 'International',
  study_abroad: 'Study abroad',
  faculty_travel: 'Faculty travel',
  waste: 'Waste',
  purchased_goods: 'Purchased goods',
  commuting: 'Commuting',
  forest_stand_actuals: 'Forest stands',
  renewables_solar: 'Solar',
  renewables_geothermal: 'Geothermal',
  renewables_wind: 'Wind',
};

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
  {
    table: 'scope1_heating_oil', label: 'Heating oil', tsCol: 'delivery_date',
    select: 'delivery_date, gallons, vendor, building_or_tank',
    summarize: (r) => `${r.gallons || '?'} gal heating oil${r.vendor ? ` • ${r.vendor}` : ''}${r.building_or_tank ? ` • ${r.building_or_tank}` : ''}`.trim(),
  },
  {
    table: 'scope1_propane', label: 'Propane', tsCol: 'delivery_date',
    select: 'delivery_date, gallons, vendor, building_or_tank',
    summarize: (r) => `${r.gallons || '?'} gal propane${r.vendor ? ` • ${r.vendor}` : ''}${r.building_or_tank ? ` • ${r.building_or_tank}` : ''}`.trim(),
  },
  {
    table: 'scope1_fleet', label: 'Fleet', tsCol: 'period_end',
    select: 'period_end, fuel_type, gallons, vehicle_id',
    summarize: (r) => `${r.gallons || '?'} gal ${r.fuel_type || ''}${r.vehicle_id ? ` • ${r.vehicle_id}` : ''}`.trim(),
  },
  {
    table: 'scope1_refrigerants', label: 'Refrigerants', tsCol: 'service_date',
    select: 'service_date, refrigerant_type, recharge_lb, reclaim_lb, equipment_id',
    summarize: (r) => `${r.refrigerant_type || '?'} • +${r.recharge_lb || 0} −${r.reclaim_lb || 0} lb${r.equipment_id ? ` • ${r.equipment_id}` : ''}`,
  },
  {
    table: 'purchased_goods', label: 'Purchased goods', tsCol: 'created_at',
    select: 'created_at, fiscal_year, purchasing_category, spend_usd',
    summarize: (r) => `$${(Number(r.spend_usd) || 0).toLocaleString()} • ${r.purchasing_category || '?'}${r.fiscal_year ? ` • FY ${r.fiscal_year}` : ''}`,
  },
  {
    table: 'commuting', label: 'Commute', tsCol: 'created_at',
    select: 'created_at, employee_role, mode, one_way_miles',
    summarize: (r) => `${r.employee_role || '?'} • ${r.mode || '?'} • ${r.one_way_miles || '?'} mi one-way`,
  },
  {
    table: 'forest_stand_actuals', label: 'Forest stand', tsCol: 'created_at',
    select: 'created_at, name, acres, mtco2e_acre_yr',
    summarize: (r) => `${r.name || '?'} • ${r.acres || '?'} acres × ${r.mtco2e_acre_yr || '?'} mt/acre/yr`,
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
  const renewables = useMeasuredRenewables();
  // Per-table count + lastUpdated for the freshness alert. Mirrors
  // AdminDataQuality but only computes the summary stats — no full
  // inventory table to render here.
  const [freshness, setFreshness] = useState(null); // null | { fresh, aging, stale, empty, irregular, staleTables }

  // Combined count + freshness fetch. Both the bottom-of-page record
  // counts grid and the top-of-page freshness alert read the same
  // 17 tables, so we do it in one round-trip and split the result
  // into the two state slices.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          ADMIN_TABLE_SOURCES.map(async (src) => {
            try {
              const [{ count }, { data }] = await Promise.all([
                supabase.from(src.table).select('*', { count: 'exact', head: true }),
                supabase.from(src.table).select(src.tsCol).order(src.tsCol, { ascending: false }).limit(1),
              ]);
              const lastUpdated = Array.isArray(data) && data.length > 0 ? data[0][src.tsCol] : null;
              return { src, count: count ?? 0, lastUpdated };
            } catch (err) {
              // Tolerate "table doesn't exist yet" the same way the
              // live-measured hooks do — empty stats, no error pill.
              return { src, count: 0, lastUpdated: null, error: err };
            }
          })
        );
        if (cancelled) return;
        const nextCounts = {};
        const tally = { fresh: 0, aging: 0, stale: 0, empty: 0, irregular: 0, unknown: 0 };
        const staleTables = [];
        let firstError = null;
        for (const r of results) {
          nextCounts[r.src.table] = r.count;
          if (r.error && !firstError) firstError = r.error;
          const bucket = freshnessBucket({ count: r.count, lastUpdated: r.lastUpdated }, r.src.cadence);
          tally[bucket] += 1;
          if (bucket === 'stale') staleTables.push(r.src.label);
        }
        setCounts(nextCounts);
        setFreshness({ ...tally, staleTables });
        if (firstError) setError(firstError.message || 'fetch failed');
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
      // No CTA — Scope 2 is permanently measured via the BMS.
    },
    {
      label: 'Scope 1 (heating + fleet + refrigerants)',
      measured: live.scope1Measured,
      detail: live.scope1Measured
        ? 'Live across 5 admin tables: fuel_bills + scope1_heating_oil + scope1_propane + scope1_fleet + scope1_refrigerants.'
        : 'Heating-fuel-delivery invoices, fleet records, or refrigerant service logs flip this row to measured.',
      cta: live.scope1Measured ? null : { to: '/admin/scope-1', label: 'Log Scope 1 data →' },
    },
    {
      label: 'Scope 3 (travel + waste + spend + commute)',
      measured: live.scope3Measured,
      detail: live.scope3Measured
        ? 'Live across 8 admin tables: cohort counts (day / US / international), trip-level (study_abroad + faculty_travel), waste, purchased_goods (Cat 1), commuting (Cat 7).'
        : 'Student / travel / waste / spend / commute records flip this row to measured.',
      cta: live.scope3Measured ? null : { to: '/admin/scope-3', label: 'Log Scope 3 data →' },
    },
    {
      label: 'Scope 3 (dining + upstream fuel)',
      measured: false,
      detail: 'Sodexo dining invoices + upstream-fuel uplift not yet wired — these stay bottom-up.',
      // No CTA — those tables aren't yet wired up.
    },
    {
      label: 'Sinks (forest sequestration)',
      measured: live.sinksMeasured,
      detail: live.sinksMeasured
        ? 'Per-stand inventory in forest_stand_actuals composes the headline live.'
        : 'A USFS Forest Inventory & Analysis-style walk-through, entered as forest_stand_actuals rows, flips this from the hardcoded 7-stand placeholder.',
      cta: live.sinksMeasured ? null : { to: '/admin/sinks', label: 'Enter forest inventory →' },
    },
    {
      label: 'Renewables (solar + geothermal + wind)',
      measured: renewables.measured,
      detail: renewables.measured
        ? `Live: ${renewables.solarMeasured ? `solar ${renewables.solar.grossKwh.toLocaleString()} kWh` : 'solar pending'} · ${renewables.geothermalMeasured ? `geothermal ${renewables.geothermal.kwhInput.toLocaleString()} kWh` : 'geothermal pending'} · ${renewables.windMeasured ? `wind ${renewables.wind.latest?.status || 'documented'}` : 'wind pending'}.`
        : 'Solar/geothermal/wind admin entries flip the public Renewables page from static description → measured kWh + avoided emissions.',
      cta: renewables.measured ? null : { to: '/admin/renewables', label: 'Log renewables data →' },
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

      <FreshnessAlert freshness={freshness} />

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
              {row.cta && (
                <Link to={row.cta.to} style={styles.ingestionCta}>
                  {row.cta.label}
                </Link>
              )}
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

      <Section title="Supabase record counts" hint="Rows currently in each Supabase table. Falls back to '…' while loading or '—' if the database isn't reachable.">
        {error && <div style={styles.error}>Error: {error}</div>}
        <div style={styles.recordGrid}>
          {ADMIN_TABLE_SOURCES.map(({ table }) => (
            <div key={table} style={styles.recordCell}>
              <div style={styles.recordLabel}>{SHORT_LABELS[table] || table}</div>
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

export function FreshnessAlert({ freshness }) {
  if (!freshness) return null;
  const { stale, aging, empty, fresh, irregular, staleTables = [] } = freshness;
  const total = stale + aging + empty + fresh + irregular + (freshness.unknown ?? 0);
  // No alert when nothing's wrong AND nothing's empty — in that
  // case, we don't bother adding noise above the ingestion-status
  // section.
  const anyConcern = stale > 0 || aging > 0 || empty > 0;
  if (!anyConcern) return null;
  const accent = stale > 0 ? '#7f1d1d' : aging > 0 ? '#92400e' : '#475569';
  const fg = stale > 0 ? '#fca5a5' : aging > 0 ? '#fcd34d' : '#94a3b8';
  const bg = stale > 0 ? '#3a0d0d' : aging > 0 ? '#3a2a0e' : '#0b1220';
  const headline = stale > 0
    ? `${stale} table${stale === 1 ? '' : 's'} stale`
    : aging > 0
      ? `${aging} table${aging === 1 ? '' : 's'} aging`
      : `${empty} table${empty === 1 ? '' : 's'} empty`;
  return (
    <div style={{
      marginTop: 16, padding: '14px 18px', background: bg, border: `1px solid ${accent}`,
      borderLeft: `4px solid ${accent}`, borderRadius: 10, display: 'grid', gap: 6,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: fg }}>
          {stale > 0 ? '⚠ ' : ''}Data freshness · {headline}
        </div>
        <Link to="/admin/data-quality" style={{ fontSize: 12, color: '#86efac', textDecoration: 'none', fontWeight: 700 }}>
          Review on Data Quality →
        </Link>
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>
        {fresh}/{total} fresh · {aging} aging · {stale} stale · {empty} empty{irregular > 0 ? ` · ${irregular} irregular` : ''}
      </div>
      {staleTables.length > 0 && (
        <div style={{ fontSize: 12, color: '#fca5a5', marginTop: 4 }}>
          Stale: {staleTables.slice(0, 5).join(' · ')}{staleTables.length > 5 ? ` · +${staleTables.length - 5} more` : ''}
        </div>
      )}
    </div>
  );
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
  ingestionCta: { display: 'inline-block', marginTop: 10, padding: '4px 10px', background: '#0f172a', border: '1px solid #f59e0b', borderRadius: 4, color: '#fbbf24', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 0.4 },

  feedList: { display: 'flex', flexDirection: 'column', gap: 4 },
  feedRow: { display: 'grid', gridTemplateColumns: '110px 130px 1fr', gap: 12, padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, fontSize: 13, alignItems: 'baseline' },
  feedDate: { color: '#64748b', fontFamily: 'ui-monospace, monospace', fontSize: 12 },
  feedLabel: { color: '#22d3ee', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4 },
  feedSummary: { color: '#cbd5e1' },

  error: { marginBottom: 10, color: '#fca5a5', fontSize: 13 },
};
