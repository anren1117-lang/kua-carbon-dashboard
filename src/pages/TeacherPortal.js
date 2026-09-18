import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { PasswordGate } from '../components/PasswordGate.js';
import { hashUserId } from '../utils/hash.js';
import { ExplainChart } from '../components/ExplainChart.js';
import { SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT, SCOPE3_TOTAL_MT, GROSS_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { useMeasuredScopeTotals } from '../hooks/useMeasuredScopeTotals.js';

// Teacher Portal — gated by VITE_TEACHER_PASSWORD (default "kua-teach"
// in dev). Editorial dashboard: primary actions surfaced as a top
// strip, work-vs-reference split into a two-column grid below.
//
// Cards/links provided:
// - Create a lesson (AI-generation editor)
// - Lesson modules (the curated four)
// - My lessons (the teacher's own published + draft lessons)
// - Quick discussion prompts
// - Class progress pointer
//
// Student-facing tools (Carbon Learning Chatbot, self-paced Learn
// paths, Student Challenges) intentionally do NOT live in this
// portal. They're public, reachable from the right-side portal nav
// and from the public Categories dropdown.

const tools = [
  {
    to: '/teacher/create',
    icon: '✏️',
    title: 'Create a lesson',
    body: 'Paste source material — an article, lecture notes, a research excerpt. The AI rewrites it at the chosen level and generates a 4-option question quiz, grounded only in what you provided.',
    stat: 'AI-generated · publish to share with class',
    primary: true,
  },
  {
    to: '/teacher/lessons',
    icon: '📚',
    title: 'Curated lesson modules',
    body: 'Four ready-to-run lessons spanning advisory through AP-level. Each includes goals, recommended reading, and an in-class activity prompt.',
    stat: '4 modules · ready to teach',
    primary: false,
  },
];

const discussionPrompts = [
  {
    kind: 'Opener · 5 min',
    text: 'If KUA emits ~4,375 mtCO₂e gross/year, and the forest sequesters somewhere between 1,000 and 2,650 (we adopt the top), what does net even mean — and how much does the answer depend on which end you pick?',
  },
  {
    kind: 'Lab discussion',
    text: 'Have students compute the ISO-NE 2024 effective emission rate (≈0.234 kg/kWh) by weighting per-fuel output factors across the published 2024 mix. Compare to the US average ~0.37.',
  },
  {
    kind: 'Project prompt',
    text: 'Pick one reduction action from /actions. Defend or critique it with three pieces of campus data.',
  },
  {
    kind: 'Scope quiz',
    text: 'Students label five campus emissions sources by Scope 1/2/3 in pairs. Compare answers in the dining hall.',
  },
];

function getTeacherHash() {
  try {
    let id = sessionStorage.getItem('kua_teacher_id');
    if (!id) {
      id = `teacher-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem('kua_teacher_id', id);
    }
    return hashUserId('staff', id);
  } catch {
    return hashUserId('staff', `anon_${Date.now()}`);
  }
}

function MyLessons() {
  const [lessons, setLessons] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const hash = getTeacherHash();
    fetch(`/api/teacher/lessons?createdByHash=${encodeURIComponent(hash)}`)
      .then(async (r) => {
        // Tolerate three error shapes:
        //   1. Non-OK status with a JSON body — surface the body's
        //      `error` field so the user sees the real cause.
        //   2. Non-OK status with non-JSON — show the status code.
        //   3. OK status but body isn't JSON. Happens when Vite serves
        //      this page locally without /api/* routes wired — the
        //      SPA fallback rewrites /api/teacher/lessons to
        //      index.html and returns HTTP 200 with HTML. r.json()
        //      throws SyntaxError. Treat it as "API not running here"
        //      so the panel falls back to the empty state instead of
        //      yelling at the user.
        if (!r.ok) {
          let detail = '';
          try { const body = await r.json(); detail = body?.error ? ` — ${body.error}` : ''; }
          catch {}
          throw new Error(`HTTP ${r.status}${detail}`);
        }
        try { return await r.json(); }
        catch { return { lessons: [] }; }
      })
      .then((j) => { if (!cancelled) setLessons(j.lessons || []); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);

  if (error) return <div style={{ color: '#fca5a5', fontSize: 13 }}>Error loading lessons: {error}</div>;
  if (lessons === null) return <div style={{ color: '#94a3b8', fontSize: 13 }}>Loading your lessons…</div>;
  if (lessons.length === 0) {
    return (
      <div style={lessonStyles.empty}>
        <div style={lessonStyles.emptyIcon} aria-hidden="true">📝</div>
        <div style={lessonStyles.emptyTitle}>No lessons yet</div>
        <div style={lessonStyles.emptyBody}>
          When you publish a lesson it appears here with its student URL and a results dashboard.
        </div>
        <Link to="/teacher/create" style={lessonStyles.cta}>+ Create your first lesson</Link>
      </div>
    );
  }

  const published = lessons.filter((l) => l.status === 'published').length;
  const drafts = lessons.length - published;

  return (
    <div>
      <div style={lessonStyles.summary}>
        <span style={lessonStyles.summaryItem}><strong>{lessons.length}</strong> total</span>
        <span style={lessonStyles.summaryDivider} aria-hidden="true">·</span>
        <span style={lessonStyles.summaryItem}><strong>{published}</strong> published</span>
        <span style={lessonStyles.summaryDivider} aria-hidden="true">·</span>
        <span style={lessonStyles.summaryItem}><strong>{drafts}</strong> draft{drafts === 1 ? '' : 's'}</span>
      </div>
      <div style={lessonStyles.list}>
        {lessons.map((l) => (
          <div key={l.id} style={lessonStyles.row}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={lessonStyles.headRow}>
                <span style={lessonStyles.title}>{l.title}</span>
                <Pill kind={l.status === 'published' ? 'good' : 'warn'}>{l.status}</Pill>
              </div>
              <div style={lessonStyles.meta}>
                {l.topic.replace('_', ' ')} · {l.readingLevel} · {l.questions.length} questions
                {l.classId ? ` · ${l.classId}` : ''}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Link to={`/teacher/results/${l.id}`} style={lessonStyles.resultsBtn}>📊 Results</Link>
              <Link to={`/lessons/${l.id}`} style={lessonStyles.viewBtn}>Student view →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// First-run onboarding. Three numbered steps that map to the actual
// teacher flow, dismissible and remembered in localStorage so it doesn't
// nag on every visit. A teacher opening the portal cold knows exactly
// what to do; a returning teacher never sees it.
const ONBOARD_KEY = 'kua_teacher_onboarded_v1';

function readOnboarded() {
  try { return localStorage.getItem(ONBOARD_KEY) === '1'; } catch { return false; }
}

const ONBOARD_STEPS = [
  { n: 1, title: 'Create a lesson', body: 'Paste any article or notes. The AI rewrites it to your level and writes a quiz — grounded only in what you paste.', to: '/teacher/create', cta: 'Start a lesson' },
  { n: 2, title: 'Share the link', body: 'Publishing gives you a student URL. Drop it in Google Classroom or on the board — no student login needed.', to: null, cta: null },
  { n: 3, title: 'Watch results', body: 'Every attempt rolls up on the lesson’s Results page, grouped by class. See who’s stuck before the next period.', to: '/teacher/lessons', cta: 'See an example' },
];

function Onboarding() {
  const [dismissed, setDismissed] = useState(readOnboarded);
  if (dismissed) return null;

  const dismiss = () => {
    try { localStorage.setItem(ONBOARD_KEY, '1'); } catch {}
    setDismissed(true);
  };

  return (
    <div style={styles.onboard} className="no-print">
      <div style={styles.onboardHead}>
        <div>
          <div style={styles.onboardKicker}>New here?</div>
          <div style={styles.onboardTitle}>Three steps to run your first lesson</div>
        </div>
        <button type="button" onClick={dismiss} style={styles.onboardClose} aria-label="Dismiss getting-started guide">
          Got it ✕
        </button>
      </div>
      <div style={styles.onboardSteps} className="kua-onboard-steps">
        {ONBOARD_STEPS.map((s) => (
          <div key={s.n} style={styles.onboardStep}>
            <div style={styles.onboardNum} aria-hidden="true">{s.n}</div>
            <div style={styles.onboardStepTitle}>{s.title}</div>
            <div style={styles.onboardStepBody}>{s.body}</div>
            {s.to && (
              <Link to={s.to} style={styles.onboardStepLink}>{s.cta} →</Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Live-data teaching chart. A clean, legible horizontal bar chart of the
// campus emissions breakdown, pulled from the same centralized totals as
// the rest of the dashboard. Horizontal bars (not a donut) so the numbers
// are readable at a glance on a projector or a Chromebook, with no hover
// required. The ExplainChart button below turns the numbers into a
// plain-English caption a teacher can read to the class.
// Built from useMeasuredScopeTotals() so the class sees the same figures the
// public pages do — Scope 2 recomposes from the electricity ledger.
function buildScopeBars(live) {
  return [
    { label: 'Scope 1 — direct (heating, fleet)', value: Math.round(live?.scope1Mt ?? SCOPE1_TOTAL_MT), color: '#ef4444' },
    { label: 'Scope 2 — electricity', value: Math.round(live?.scope2Mt ?? SCOPE2_TOTAL_MT), color: '#f59e0b' },
    { label: 'Scope 3 — indirect (goods, travel)', value: Math.round(live?.scope3Mt ?? SCOPE3_TOTAL_MT), color: '#8b5cf6' },
    { label: 'Forest sequestration', value: -Math.round(ANNUAL_SEQUESTRATION_MT), color: '#22c55e' },
  ];
}

function PortalScopeChart() {
  const live = useMeasuredScopeTotals();
  const scopeBars = buildScopeBars(live);
  const gross = Math.round(live.grossMt || GROSS_MT);
  const sink = Math.round(ANNUAL_SEQUESTRATION_MT);
  const net = gross - sink;
  // Scale bars to the largest magnitude so proportions read true.
  const maxMag = Math.max(...scopeBars.map((b) => Math.abs(b.value)), 1);

  const chartData = {
    title: 'KUA annual emissions by scope, and forest sequestration',
    summary: 'Gross annual greenhouse-gas emissions split into Scope 1 (direct), Scope 2 (purchased electricity), and Scope 3 (indirect), against the CO₂ the campus forest pulls back out. Net = gross minus sequestration.',
    unit: 'mtCO₂e (metric tonnes CO₂-equivalent) per year',
    series: [
      { label: 'Scope 1 (direct)', value: Math.round(SCOPE1_TOTAL_MT) },
      { label: 'Scope 2 (electricity)', value: Math.round(SCOPE2_TOTAL_MT) },
      { label: 'Scope 3 (indirect)', value: Math.round(SCOPE3_TOTAL_MT) },
      { label: 'Forest sequestration (removed)', value: -sink },
      { label: 'Gross total', value: gross },
      { label: 'Net total', value: net },
    ],
    note: 'Scope 2 is measured; Scope 1 and 3 are current best estimates. ~340 students, Plainfield NH.',
  };

  return (
    <div>
      <div style={styles.chartCard}>
        <div style={styles.chartBars}>
          {scopeBars.map((b) => {
            const pct = (Math.abs(b.value) / maxMag) * 100;
            const negative = b.value < 0;
            return (
              <div key={b.label} style={styles.barRow}>
                <div style={styles.barLabel}>{b.label}</div>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${pct}%`, background: b.color, opacity: negative ? 0.85 : 1 }} />
                </div>
                <div style={{ ...styles.barValue, color: negative ? '#86efac' : '#e5e7eb' }}>
                  {negative ? '−' : ''}{Math.abs(b.value).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
        <div style={styles.chartTotals}>
          <span style={styles.totalItem}>Gross <strong>{gross.toLocaleString()}</strong></span>
          <span style={styles.summaryDivider} aria-hidden="true">·</span>
          <span style={styles.totalItem}>Sequestered <strong style={{ color: '#86efac' }}>−{sink.toLocaleString()}</strong></span>
          <span style={styles.summaryDivider} aria-hidden="true">·</span>
          <span style={styles.totalItem}>Net <strong style={{ color: '#fbbf24' }}>{net.toLocaleString()}</strong> mtCO₂e/yr</span>
        </div>
      </div>
      <ExplainChart chart={chartData} label="Explain this chart with AI" />
    </div>
  );
}

function PortalContents() {
  return (
    <ModulePage
      title="Teacher Portal"
      subtitle="Author AI-generated lessons from any source material, review the curated modules, and track class progress. Public student tools (chatbot, self-paced paths, dorm challenges) live in the regular nav — preview them there as a student would see them."
    >
      <Onboarding />

      {/* Primary action strip — surface the two highest-value teacher
          actions immediately, before the longer card descriptions. */}
      <div style={styles.actionStrip} className="no-print">
        <Link to="/teacher/create" style={styles.primaryAction}>
          <span style={styles.primaryActionGlyph} aria-hidden="true">+</span>
          New lesson
        </Link>
        <Link to="/teacher/lessons" style={styles.secondaryAction}>
          Browse lesson modules →
        </Link>
      </div>

      {/* Live campus data, ready to teach with. A clean, projector-legible
          chart plus a one-click AI caption teachers can read to the class. */}
      <ModuleSection
        title="Teach from live campus data"
        hint="The real KUA emissions breakdown, updated from the dashboard's data. Click “Explain this chart with AI” for a plain-English caption you can read aloud or paste onto a slide."
      >
        <PortalScopeChart />
      </ModuleSection>

      {/* Two-column grid: work on the left (tools + my lessons),
          reference on the right (prompts + progress pointer).
          Collapses to single column on narrow screens. */}
      <div style={styles.twoCol} className="kua-portal-twocol">
        <div style={styles.colMain}>
          <ModuleSection title="Teacher tools" hint="Both tools below open the editor or module catalog in a new view. You won't lose your place here.">
            <div style={styles.grid}>
              {tools.map((c) => (
                <Link
                  key={c.to}
                  to={c.to}
                  style={{ ...styles.card, ...(c.primary ? styles.cardPrimary : null) }}
                  aria-label={`${c.title} — ${c.body}`}
                >
                  <div style={styles.cardIconRow}>
                    <span style={styles.cardIcon} aria-hidden="true">{c.icon}</span>
                    {c.primary && <span style={styles.cardBadge}>Primary</span>}
                  </div>
                  <div style={styles.cardTitle}>{c.title}</div>
                  <div style={styles.cardBody}>{c.body}</div>
                  <div style={styles.cardStat}>{c.stat}</div>
                </Link>
              ))}
            </div>
          </ModuleSection>

          <ModuleSection title="My lessons" hint="The lessons you've authored on this device. Click 'Student view' to open the URL you'd share with class.">
            <MyLessons />
          </ModuleSection>
        </div>

        <div style={styles.colSide}>
          <ModuleSection title="Quick discussion prompts" hint="Drop into a slide deck or use as a five-minute opener.">
            <div style={styles.promptGrid}>
              {discussionPrompts.map((p, i) => (
                <div key={i} style={styles.promptCard}>
                  <div style={styles.promptKind}>{p.kind}</div>
                  <div style={styles.promptText}>{p.text}</div>
                </div>
              ))}
            </div>
          </ModuleSection>

          <ModuleSection title="Class progress">
            <p style={styles.progressCopy}>
              Live class quiz rollup is on the{' '}
              <Link to="/teacher/lessons" style={styles.progressLink}>Lesson modules</Link>
              {' '}page. It pulls from <code style={styles.code}>/api/quiz/attempts</code>
              {' '}and groups by the <code style={styles.code}>classId</code> field on each attempt.
            </p>
          </ModuleSection>
        </div>
      </div>
    </ModulePage>
  );
}

export default function TeacherPortal() {
  return (
    <PasswordGate
      title="Teacher Portal"
      subtitle="Create AI-generated lessons, see class progress, run the chatbot. Sign in with the password your sustainability office gave you."
      envKey="TEACHER_PASSWORD"
      storageKey="kua_teacher_unlocked"
      defaultPassword="kua-teach"
      accent="#22c55e"
    >
      <PortalContents />
    </PasswordGate>
  );
}

const styles = {
  // Onboarding "Start here" panel — first-run only, dismissible.
  onboard: {
    background: 'linear-gradient(180deg, rgba(34,197,94,0.08) 0%, rgba(11,18,32,0.4) 100%)',
    border: '1px solid #14532d',
    borderRadius: 12,
    padding: '16px 18px 18px',
    marginBottom: 18,
  },
  onboardHead: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 },
  onboardKicker: { fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: '#86efac', marginBottom: 3 },
  onboardTitle: { fontSize: 17, fontWeight: 700, color: '#e5e7eb', letterSpacing: '-0.01em' },
  onboardClose: {
    flexShrink: 0,
    padding: '6px 12px',
    background: 'rgba(5,46,26,0.4)',
    color: '#86efac',
    border: '1px solid #14532d',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  onboardSteps: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  onboardStep: {
    position: 'relative',
    padding: '14px 14px 16px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 10,
  },
  onboardNum: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 999,
    background: '#14532d',
    color: '#86efac',
    fontWeight: 800,
    fontSize: 13,
    marginBottom: 8,
  },
  onboardStepTitle: { fontSize: 14, fontWeight: 700, color: '#e5e7eb', marginBottom: 5 },
  onboardStepBody: { fontSize: 12.5, color: '#94a3b8', lineHeight: 1.55, marginBottom: 8 },
  onboardStepLink: { fontSize: 12.5, fontWeight: 700, color: '#22c55e', textDecoration: 'none' },

  // Live-data chart card — horizontal bars, projector-legible.
  chartCard: {
    padding: '18px 20px',
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 12,
  },
  chartBars: { display: 'grid', gap: 12 },
  barRow: { display: 'grid', gridTemplateColumns: 'minmax(120px, 240px) 1fr 72px', alignItems: 'center', gap: 12 },
  barLabel: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.35 },
  barTrack: { height: 22, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5, transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)' },
  barValue: { fontSize: 13.5, fontWeight: 700, textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  chartTotals: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 16,
    paddingTop: 14,
    borderTop: '1px solid #1f2937',
    fontSize: 13,
    color: '#94a3b8',
  },
  totalItem: { display: 'inline-flex', gap: 5, alignItems: 'baseline' },
  summaryDivider: { color: '#334155' },

  // Primary action strip — sits between the page header and the
  // sections. High visual weight on the green CTA; quieter ghost
  // button for the secondary destination.
  actionStrip: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    margin: '4px 0 4px',
  },
  primaryAction: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '11px 18px',
    background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
    color: '#052e1a',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '-0.005em',
    boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset, 0 6px 16px rgba(34, 197, 94, 0.22)',
  },
  primaryActionGlyph: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 999,
    background: 'rgba(5, 46, 26, 0.18)',
    color: '#052e1a',
    fontWeight: 900,
    fontSize: 14,
    lineHeight: 1,
  },
  secondaryAction: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 16px',
    background: '#0b1220',
    color: '#cbd5e1',
    border: '1px solid #1f2937',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 13.5,
  },

  // Two-column grid. 1.55fr / 1fr on desktop (work column is wider
  // because rows are denser). The .kua-portal-twocol class hook
  // exists so a media query in App.css (or a future global stylesheet)
  // can collapse to single-column on narrow viewports.
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.55fr) minmax(0, 1fr)',
    gap: 20,
    marginTop: 18,
  },
  colMain: { minWidth: 0, display: 'flex', flexDirection: 'column' },
  colSide: { minWidth: 0, display: 'flex', flexDirection: 'column' },

  // Tool cards — same data shape, refined visuals. Primary card gets
  // a green accent bar; secondary card is plain. Both are full-card
  // links (already were).
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 },
  card: {
    position: 'relative',
    display: 'block',
    padding: '18px 20px 20px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 10,
    color: 'inherit',
    textDecoration: 'none',
    transition: 'border-color 120ms ease, transform 120ms ease',
  },
  cardPrimary: {
    borderColor: '#14532d',
    boxShadow: '0 0 0 1px rgba(34, 197, 94, 0.22) inset',
  },
  cardIconRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardIcon: { fontSize: 26, lineHeight: 1 },
  cardBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#86efac',
    background: '#052e1a',
    border: '1px solid #14532d',
    padding: '3px 8px',
    borderRadius: 999,
  },
  cardTitle: { fontSize: 16, color: '#e5e7eb', fontWeight: 700, marginBottom: 6, letterSpacing: '-0.005em' },
  cardBody: { fontSize: 13, color: '#94a3b8', lineHeight: 1.6 },
  cardStat: { fontSize: 11, color: '#22d3ee', marginTop: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 },

  // Discussion prompt cards — replaced the bullet list with small
  // cards carrying a "kind" tag (Opener / Lab discussion / Project
  // prompt / Scope quiz) so teachers can scan by use case.
  promptGrid: { display: 'grid', gap: 10 },
  promptCard: {
    padding: '12px 14px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 8,
    borderLeft: '3px solid #22d3ee',
  },
  promptKind: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#67e8f9',
    marginBottom: 4,
  },
  promptText: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.55 },

  // Class progress (kept; just touched-up typography)
  progressCopy: { color: '#cbd5e1', margin: 0, lineHeight: 1.6, fontSize: 13.5 },
  progressLink: { color: '#22d3ee', marginLeft: 0 },
  code: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    background: '#0b1220',
    padding: '2px 6px',
    borderRadius: 4,
    color: '#22d3ee',
    fontSize: 12,
  },
};

const lessonStyles = {
  // Summary chip strip at top of section (X total · Y published · Z drafts)
  summary: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 12,
    color: '#94a3b8',
  },
  summaryItem: { display: 'inline-flex', gap: 4 },
  summaryDivider: { color: '#334155' },

  list: { display: 'grid', gap: 8 },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 8,
  },
  headRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' },
  title: { fontSize: 15, color: '#e5e7eb', fontWeight: 600 },
  meta: { fontSize: 12, color: '#94a3b8' },
  viewBtn: { padding: '6px 12px', background: '#0f172a', border: '1px solid #0e7490', borderRadius: 6, color: '#22d3ee', textDecoration: 'none', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' },
  resultsBtn: { padding: '6px 12px', background: '#0f172a', border: '1px solid #14532d', borderRadius: 6, color: '#86efac', textDecoration: 'none', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' },

  // Improved empty state — icon + title + body + CTA
  empty: {
    padding: '28px 20px',
    background: '#0b1220',
    border: '1px dashed #334155',
    borderRadius: 10,
    textAlign: 'center',
  },
  emptyIcon: { fontSize: 32, marginBottom: 8 },
  emptyTitle: { fontSize: 15, color: '#e5e7eb', fontWeight: 700, marginBottom: 6 },
  emptyBody: { fontSize: 13, color: '#94a3b8', lineHeight: 1.55, maxWidth: 380, margin: '0 auto 14px' },
  cta: { display: 'inline-block', padding: '8px 16px', background: '#22c55e', color: '#0b1220', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: 13 },
};
