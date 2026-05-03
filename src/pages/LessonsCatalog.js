import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';

// Public lesson catalog — every PUBLISHED teacher-authored lesson.
// Students land here from the public nav, pick the assignment they
// need, and click through to /lessons/:id to take it. Filters by
// class assignment + topic + reading level.

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

export default function LessonsCatalog() {
  const [lessons, setLessons] = useState(null);
  const [error, setError] = useState(null);
  const [classFilter, setClassFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/teacher/lessons?status=published')
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((j) => { if (!cancelled) setLessons(j.lessons || []); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);

  const allClasses = useMemo(() => {
    if (!lessons) return [];
    const set = new Set(lessons.map((l) => l.classId).filter(Boolean));
    return Array.from(set).sort();
  }, [lessons]);

  const allTopics = useMemo(() => {
    if (!lessons) return [];
    const set = new Set(lessons.map((l) => l.topic));
    return Array.from(set).sort();
  }, [lessons]);

  const filtered = useMemo(() => {
    if (!lessons) return [];
    return lessons.filter((l) => {
      if (classFilter !== 'all' && (l.classId || '') !== classFilter) return false;
      if (topicFilter !== 'all' && l.topic !== topicFilter) return false;
      if (levelFilter !== 'all' && l.readingLevel !== levelFilter) return false;
      return true;
    });
  }, [lessons, classFilter, topicFilter, levelFilter]);

  return (
    <ModulePage
      title="Class Lessons"
      subtitle="Lessons your teachers have published. Each one has a short reading and a 5-question quiz. Pick the assignment for your class and click through to take it."
    >
      {error && (
        <ModuleSection title="Error">
          <div style={{ color: '#fca5a5' }}>{error}</div>
        </ModuleSection>
      )}

      <MetricGrid metrics={[
        { label: 'Published lessons',  value: lessons?.length ?? '…',     accent: '#22d3ee' },
        { label: 'Active classes',     value: allClasses.length,           accent: '#fbbf24' },
        { label: 'Topics covered',     value: allTopics.length,            accent: '#22c55e' },
        { label: 'Showing',            value: filtered.length,             accent: '#86efac' },
      ]} />

      {lessons && lessons.length > 0 && (
        <ModuleSection title="Filter">
          <div style={styles.filterRow}>
            <Filter label="Class">
              <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} style={styles.select} aria-label="Filter by class">
                <option value="all">All classes</option>
                {allClasses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Filter>
            <Filter label="Topic">
              <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)} style={styles.select} aria-label="Filter by topic">
                <option value="all">All topics</option>
                {allTopics.map((t) => <option key={t} value={t}>{TOPIC_LABELS[t] || t}</option>)}
              </select>
            </Filter>
            <Filter label="Reading level">
              <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} style={styles.select} aria-label="Filter by reading level">
                <option value="all">All levels</option>
                <option value="novice">Novice</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </Filter>
          </div>
        </ModuleSection>
      )}

      <ModuleSection
        title={lessons === null ? 'Loading…' : filtered.length === 0 ? 'No lessons match those filters' : `${filtered.length} lesson${filtered.length === 1 ? '' : 's'}`}
      >
        {lessons === null && <div style={{ color: '#94a3b8' }}>Loading from /api/teacher/lessons…</div>}
        {lessons && lessons.length === 0 && (
          <div style={styles.empty}>
            <div style={{ color: '#94a3b8', marginBottom: 12 }}>
              No teacher has published a lesson yet.
            </div>
            <Link to="/learn" style={styles.cta}>Try a self-paced Learn path instead →</Link>
          </div>
        )}
        {filtered.length > 0 && (
          <div style={styles.grid}>
            {filtered.map((l) => (
              <Link
                key={l.id}
                to={`/lessons/${l.id}`}
                style={{ ...styles.card, borderLeftColor: TOPIC_ACCENT[l.topic] || '#22d3ee' }}
                aria-label={`${l.title} — ${l.questions.length} questions`}
              >
                <div style={styles.cardHead}>
                  <div style={styles.cardTitle}>{l.title}</div>
                  {l.classId && <Pill kind="info">{l.classId}</Pill>}
                </div>
                <div style={styles.cardMeta}>
                  <Pill kind="neutral">{TOPIC_LABELS[l.topic] || l.topic}</Pill>
                  <Pill kind="neutral">{l.readingLevel}</Pill>
                  <span style={styles.qCount}>{l.questions.length} questions</span>
                </div>
                <div style={styles.cardArrow}>Take this lesson →</div>
              </Link>
            ))}
          </div>
        )}
      </ModuleSection>
    </ModulePage>
  );
}

function Filter({ label, children }) {
  return (
    <div>
      <div style={styles.label}>{label}</div>
      {children}
    </div>
  );
}

const styles = {
  filterRow: { display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' },
  label: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 },
  select: { width: '100%', padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#cbd5e1', fontSize: 13, fontFamily: 'inherit' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 },
  card: { display: 'block', padding: '16px 18px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #22d3ee', borderRadius: 10, color: 'inherit', textDecoration: 'none' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  cardTitle: { fontSize: 16, color: '#e5e7eb', fontWeight: 700, lineHeight: 1.4 },
  cardMeta: { display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 },
  qCount: { fontSize: 12, color: '#94a3b8', marginLeft: 4 },
  cardArrow: { fontSize: 13, color: '#22d3ee', fontWeight: 600 },
  empty: { padding: 20, textAlign: 'center', background: '#0b1220', border: '1px dashed #334155', borderRadius: 8 },
  cta: { color: '#22d3ee', textDecoration: 'none', fontSize: 13 },
};
