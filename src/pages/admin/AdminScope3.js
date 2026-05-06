import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ModulePage, ModuleSection, MetricGrid } from '../../components/ModuleShell.js';
import { supabase } from '../../supabaseClient';

// Scope 3 Quick Entry hub. Tabbed all-in-one entry surface that
// embeds every existing modular form below — same UX shape as the
// legacy /admin/legacy portal had, but using the modern category-
// specific forms underneath (which write to the SAME Supabase tables).
//
// Each tab renders one of the existing form components. State for
// which tab is active is in the URL (?tab=...), so admins can deep-
// link or share a specific entry view.
//
// The standalone routes /admin/scope-3/student-day, /cat-5, etc.,
// still work and render the same components — useful when a teacher
// emails a colleague a link to ONE specific form.

const StudentDay         = lazy(() => import('./scope3/StudentDay'));
const StudentUSBoarding  = lazy(() => import('./scope3/StudentUSBoarding'));
const StudentInternational = lazy(() => import('./scope3/StudentInternational'));
const StudyAbroad        = lazy(() => import('./scope3/StudyAbroad'));
const Cat6BusinessTravel = lazy(() => import('./scope3/Cat6BusinessTravel'));
const Cat5Waste          = lazy(() => import('./scope3/Cat5Waste'));
const Cat1PurchasedGoods = lazy(() => import('./scope3/Cat1PurchasedGoods'));
const Cat7Commuting      = lazy(() => import('./scope3/Cat7Commuting'));

// Each tab maps a slug → label, group, table-name (for live count),
// and the form component. The tables array is also used to render the
// row-count strip at the top so admins see at a glance which
// categories already have data.
const TABS = [
  { slug: 'students-day',  label: '🎓 Day students',         group: 'Student travel',  table: 'day_students',           Component: StudentDay,           desc: 'Local commuters by ZIP.' },
  { slug: 'students-us',   label: '🚗 US boarding',          group: 'Student travel',  table: 'us_boarding_students',   Component: StudentUSBoarding,    desc: 'Term-break round-trips by ZIP + state.' },
  { slug: 'students-intl', label: '✈️ International',         group: 'Student travel',  table: 'international_students', Component: StudentInternational, desc: 'Long-haul flights by home country.' },
  { slug: 'study-abroad',  label: '🌏 Study abroad',          group: 'Student travel',  table: 'study_abroad',           Component: StudyAbroad,          desc: 'School-organized international programs.' },
  { slug: 'faculty',       label: '👔 Faculty / staff travel', group: 'Cat 6 — Travel', table: 'faculty_travel',         Component: Cat6BusinessTravel,   desc: 'Conference / business trips.' },
  { slug: 'commuting',     label: '🚙 Commuting',             group: 'Cat 7 — Commute', table: null,                    Component: Cat7Commuting,        desc: 'Faculty / staff daily commute, by mode.' },
  { slug: 'waste',         label: '🗑️ Waste',                  group: 'Cat 5 — Waste',  table: 'waste',                  Component: Cat5Waste,            desc: 'Landfill, recycling, composting tonnage.' },
  { slug: 'goods',         label: '📦 Purchased goods',       group: 'Cat 1 — Goods',   table: null,                    Component: Cat1PurchasedGoods,   desc: 'EEIO spend-based for paper, IT, cleaning, etc.' },
];

const DEFAULT_SLUG = TABS[0].slug;

function useTabRowCounts() {
  const [counts, setCounts] = useState({});
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = {};
      const targets = TABS.filter((t) => t.table).map((t) => t.table);
      try {
        const results = await Promise.all(
          targets.map((t) => supabase.from(t).select('*', { count: 'exact', head: true })),
        );
        if (cancelled) return;
        targets.forEach((t, i) => {
          const r = results[i];
          next[t] = (r && !r.error && typeof r.count === 'number') ? r.count : '—';
        });
        setCounts(next);
      } catch {
        if (!cancelled) {
          targets.forEach((t) => { next[t] = '—'; });
          setCounts(next);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);
  return counts;
}

export default function AdminScope3() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('tab');
  const activeSlug = TABS.some((t) => t.slug === requested) ? requested : DEFAULT_SLUG;
  const active = TABS.find((t) => t.slug === activeSlug) || TABS[0];
  const counts = useTabRowCounts();

  function pickTab(slug) {
    const next = new URLSearchParams(params);
    next.set('tab', slug);
    setParams(next, { replace: false });
  }

  // Quick metric strip — total rows across the Supabase-backed tabs.
  const totalRows = TABS.reduce(
    (s, t) => s + (typeof counts[t.table] === 'number' ? counts[t.table] : 0),
    0,
  );
  const supabaseTabs = TABS.filter((t) => t.table);
  const tabsWithData = supabaseTabs.filter((t) => typeof counts[t.table] === 'number' && counts[t.table] > 0).length;

  return (
    <ModulePage
      title="Scope 3 Data Entry"
      subtitle={
        <>
          Single tabbed surface for everything Scope 3 — student travel, faculty trips, waste,
          purchased goods, commuting. Pick a tab below to log records. Each form writes to the
          same Supabase tables the rest of the dashboard reads from. Standalone direct links
          (e.g. <code style={{ color: '#22d3ee' }}>/admin/scope-3/student-day</code>) still work
          for sharing a single category.
        </>
      }
    >
      <MetricGrid metrics={[
        { label: 'Total Scope 3 rows',     value: totalRows.toLocaleString(),                                  accent: '#22d3ee' },
        { label: 'Categories with data',   value: `${tabsWithData} / ${supabaseTabs.length}`,                  accent: '#fbbf24' },
        { label: 'Currently editing',      value: active.label,                                                accent: '#86efac' },
        { label: 'Tabs available',         value: TABS.length,                                                 accent: '#a855f7' },
      ]} />

      <ModuleSection
        title="Pick a category"
        hint="Click any tab to switch the form below. Numbers in parentheses are current row counts in Supabase."
      >
        <div style={styles.tabBar} role="tablist" aria-label="Scope 3 categories">
          {TABS.map((t) => {
            const isActive = t.slug === activeSlug;
            const count = typeof counts[t.table] === 'number' ? counts[t.table] : null;
            return (
              <button
                key={t.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => pickTab(t.slug)}
                style={{
                  ...styles.tab,
                  background: isActive ? '#22d3ee' : '#0b1220',
                  color: isActive ? '#0b1220' : '#cbd5e1',
                  borderColor: isActive ? '#22d3ee' : '#1f2937',
                  fontWeight: isActive ? 700 : 500,
                }}
                title={t.desc}
              >
                {t.label}
                {count !== null && (
                  <span style={{ ...styles.tabCount, color: isActive ? '#0b1220' : '#64748b' }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </ModuleSection>

      <ModuleSection
        title={active.label}
        hint={`${active.group} · ${active.desc}`}
      >
        <div style={styles.formWrap} role="tabpanel">
          <Suspense fallback={<div style={styles.loading}>Loading form…</div>}>
            <active.Component />
          </Suspense>
        </div>
      </ModuleSection>

      <ModuleSection
        title="Other entry surfaces (same data)"
        hint="The legacy admin portal at /admin/legacy had a similar tabbed input UX and is still functional, but its forms were a parallel implementation. This page uses the same modular form components the per-category routes use, so every entry surface writes to the same Supabase tables."
      >
        <div style={styles.linkRow}>
          <Link to="/admin/legacy" style={styles.linkBtn}>📁 Legacy portal (same data, different layout)</Link>
          <Link to="/admin/scope-1" style={styles.linkBtn}>⛽ Scope 1 entry</Link>
          <Link to="/admin/scope-2" style={styles.linkBtn}>⚡ Scope 2 entry</Link>
        </div>
      </ModuleSection>
    </ModulePage>
  );
}

const styles = {
  tabBar: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tab: {
    padding: '8px 12px',
    borderRadius: 8,
    fontSize: 13,
    border: '1px solid',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
  },
  tabCount: { fontSize: 11, fontVariantNumeric: 'tabular-nums', padding: '1px 6px', background: 'rgba(15,23,42,0.4)', borderRadius: 999 },
  formWrap: { padding: 16, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  loading: { padding: 24, color: '#94a3b8', fontSize: 14, textAlign: 'center' },
  linkRow: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  linkBtn: { padding: '8px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#22d3ee', textDecoration: 'none', fontSize: 13, fontWeight: 600 },
};
