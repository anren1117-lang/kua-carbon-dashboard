import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LearnAgent } from '../components/LearnAgent';

// /learn now hosts both kinds of student-facing content:
//
// 1. CLASS LESSONS — teacher-published, AI-generated reading + quiz.
//    Pulled live from /api/teacher/lessons?status=published. Shown only
//    if at least one is published; otherwise the section is hidden so
//    we don't dump an empty "no lessons" message in front of every
//    student.
// 2. SELF-PACED PATHS — the curated LearnAgent paths (11 paths,
//    ~150 questions). Always visible.
//
// /lessons and /lessons/:id remain valid routes — students with a
// shared URL still land directly on a lesson.

const TOPIC_LABELS = {
  climate_basics: 'Climate basics',
  scopes:         'Scopes 1/2/3',
  energy:         'Energy + grid',
  food:           'Food emissions',
  transport:      'Transportation',
  waste:          'Waste + recycling',
  sinks:          'Sinks + sequestration',
  kua_specific:   'KUA campus',
  action:         'Personal/dorm action',
};

const TOPIC_ACCENT = {
  climate_basics: '#22d3ee',
  scopes:         '#fbbf24',
  energy:         '#f59e0b',
  food:           '#22c55e',
  transport:      '#3b82f6',
  waste:          '#a855f7',
  sinks:          '#86efac',
  kua_specific:   '#06b6d4',
  action:         '#ef4444',
};

function ClassLessons() {
  const [lessons, setLessons] = useState(null);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [classFilter, setClassFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/teacher/lessons?status=published')
      .then(async (r) => {
        if (!r.ok) {
          let detail = '';
          try { const body = await r.json(); detail = body?.error ? ` — ${body.error}` : ''; }
          catch {}
          throw new Error(`HTTP ${r.status}${detail}`);
        }
        // Vite-local serves /api/* as the SPA shell — r.json() on HTML
        // throws SyntaxError. Degrade to an empty list so the page
        // renders the curated paths without a scary error banner.
        try { return await r.json(); }
        catch { return { lessons: [] }; }
      })
      .then((j) => { if (!cancelled) setLessons(j.lessons || []); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);

  const allClasses = useMemo(() => {
    if (!lessons) return [];
    const set = new Set(lessons.map((l) => l.classId).filter(Boolean));
    return Array.from(set).sort();
  }, [lessons]);

  const filtered = useMemo(() => {
    if (!lessons) return [];
    if (classFilter === 'all') return lessons;
    return lessons.filter((l) => (l.classId || '') === classFilter);
  }, [lessons, classFilter]);

  // While loading we show nothing (avoid layout shift); on error we just
  // hide the section — the self-paced paths below still load fine.
  if (error || lessons === null || lessons.length === 0) return null;

  const visible = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section style={styles.section}>
      <div style={styles.sectionHead}>
        <div>
          <h2 style={styles.sectionTitle}>Class lessons</h2>
          <p style={styles.sectionSub}>
            Lessons your teachers have assigned. Each one has a short reading and a quiz.
            {' '}<Link to="/lessons" style={styles.allLink}>Open the full catalog →</Link>
          </p>
        </div>
        {allClasses.length > 1 && (
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            style={styles.filter}
            aria-label="Filter by class"
          >
            <option value="all">All classes ({lessons.length})</option>
            {allClasses.map((c) => (
              <option key={c} value={c}>{c} ({lessons.filter((l) => l.classId === c).length})</option>
            ))}
          </select>
        )}
      </div>

      <div style={styles.grid}>
        {visible.map((l) => (
          <Link
            key={l.id}
            to={`/lessons/${l.id}`}
            style={{ ...styles.card, borderLeftColor: TOPIC_ACCENT[l.topic] || '#22d3ee' }}
            aria-label={`${l.title} — ${l.questions.length} questions`}
          >
            <div style={styles.cardHead}>
              <span style={styles.cardTitle}>{l.title}</span>
              {l.classId && <span style={styles.classPill}>{l.classId}</span>}
            </div>
            <div style={styles.cardMeta}>
              <span style={styles.metaPill}>{TOPIC_LABELS[l.topic] || l.topic}</span>
              <span style={styles.metaPill}>{l.readingLevel}</span>
              <span style={styles.qCount}>{l.questions.length} questions</span>
            </div>
            <div style={styles.cardArrow}>Take this lesson →</div>
          </Link>
        ))}
      </div>

      {filtered.length > 6 && (
        <button type="button" style={styles.moreBtn} onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'Show less' : `Show all ${filtered.length} lessons`}
        </button>
      )}
    </section>
  );
}

function Learn() {
  return (
    <div>
      <div style={styles.hero}>
        <h1 style={styles.title}>Learn</h1>
        <p style={styles.subtitle}>
          Two ways to learn: <strong>class lessons</strong> assigned by your teachers (when there are any),
          and <strong>self-paced paths</strong> covering everything from "what is a carbon footprint?"
          through AP-level grid math. Pick any path; each is a few minutes.
        </p>
      </div>

      <ClassLessons />

      <div style={styles.divider} />
      <div style={styles.subheading}>Self-paced paths</div>
      <LearnAgent />
    </div>
  );
}

export default Learn;

const styles = {
  hero: { maxWidth: 880, margin: '0 auto', padding: '0 16px 24px' },
  title: { margin: 0, fontSize: 36, fontWeight: 700, color: '#e5e7eb' },
  subtitle: { marginTop: 10, color: '#94a3b8', fontSize: 17, lineHeight: 1.6, maxWidth: 720 },

  section: { maxWidth: 1100, margin: '0 auto 32px', padding: '0 16px' },
  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 16, flexWrap: 'wrap' },
  sectionTitle: { margin: 0, fontSize: 22, color: '#22d3ee', fontWeight: 700 },
  sectionSub: { margin: '6px 0 0', color: '#94a3b8', fontSize: 14, lineHeight: 1.6, maxWidth: 720 },
  allLink: { color: '#22d3ee', textDecoration: 'none', fontWeight: 600 },
  filter: { padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#cbd5e1', fontSize: 13, fontFamily: 'inherit' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 },
  card: { display: 'block', padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22d3ee', borderRadius: 10, color: 'inherit', textDecoration: 'none' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  cardTitle: { fontSize: 15, color: '#e5e7eb', fontWeight: 700, lineHeight: 1.4 },
  classPill: { fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#0c2a3a', color: '#67e8f9', border: '1px solid #0e7490', fontWeight: 700, whiteSpace: 'nowrap' },
  cardMeta: { display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 },
  metaPill: { fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', fontWeight: 700 },
  qCount: { fontSize: 12, color: '#94a3b8' },
  cardArrow: { fontSize: 13, color: '#22d3ee', fontWeight: 600 },

  moreBtn: { marginTop: 14, padding: '8px 16px', background: 'transparent', border: '1px solid #334155', borderRadius: 6, color: '#cbd5e1', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' },

  divider: { maxWidth: 1100, margin: '24px auto', padding: '0 16px', borderBottom: '1px solid #1f2937' },
  subheading: { maxWidth: 1100, margin: '0 auto 16px', padding: '0 16px', fontSize: 14, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 },
};
