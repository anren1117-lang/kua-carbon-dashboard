import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { PasswordGate } from '../components/PasswordGate.js';
import { hashUserId } from '../utils/hash.js';

// Teacher Portal — gated by VITE_TEACHER_PASSWORD (default "kua-teach"
// in dev). Cards link to:
// - Create a lesson (the new AI-generation editor)
// - Lesson modules (the curated four)
// - Carbon Learning Chatbot
// - Self-paced Learn paths
// - Student Challenges
//
// Plus a "My lessons" panel listing the teacher's own published +
// draft lessons, with quick links to the student URL for each.

const tools = [
  { to: '/teacher/create',  icon: '✏️', title: 'Create a lesson',           body: 'Paste source material — an article, lecture notes, a research excerpt. The AI rewrites it at the chosen level and generates 5 four-option questions, grounded in what you provided.', stat: 'AI-generated · publish to share with class' },
  { to: '/teacher/lessons', icon: '📚', title: 'Curated lesson modules',    body: 'Four ready-to-run lessons spanning advisory through AP-level. Each includes goals, recommended reading, and an in-class activity prompt.', stat: '4 modules' },
  { to: '/chatbot',         icon: '💬', title: 'Carbon Learning Chatbot',   body: 'Curriculum-bounded Q&A with citations. Students can use it directly; teachers see what topics surface and where confidence is low.', stat: 'rule-based · LLM-grounded when configured' },
  { to: '/learn',           icon: '🎓', title: 'Self-paced Learn paths',    body: '11 paths spanning intro through AP. Each step is a 4-option quiz with full per-option explanations.', stat: '11 paths · ~150 questions' },
  { to: '/challenges',      icon: '🏆', title: 'Student Challenges',        body: 'Dorm-level leaderboard (privacy-by-design). Weekly challenge slate. Individual ranking is opt-in only.', stat: 'Aggregated at dorm level' },
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
    const hash = getTeacherHash();
    fetch(`/api/teacher/lessons?createdByHash=${encodeURIComponent(hash)}`)
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((j) => setLessons(j.lessons || []))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div style={{ color: '#fca5a5', fontSize: 13 }}>Error loading lessons: {error}</div>;
  if (lessons === null) return <div style={{ color: '#94a3b8', fontSize: 13 }}>Loading your lessons…</div>;
  if (lessons.length === 0) {
    return (
      <div style={lessonStyles.empty}>
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 10 }}>
          You haven't created any lessons yet.
        </div>
        <Link to="/teacher/create" style={lessonStyles.cta}>+ Create your first lesson</Link>
      </div>
    );
  }

  return (
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
  );
}

function PortalContents() {
  return (
    <ModulePage
      title="Teacher Portal"
      subtitle="Everything classroom-facing in one place. Create AI-generated lessons from any source material, run curated modules, and track class progress."
    >
      <ModuleSection title="Tools">
        <div style={styles.grid}>
          {tools.map((c) => (
            <Link key={c.to} to={c.to} style={styles.card} aria-label={`${c.title} — ${c.body}`}>
              <div style={styles.cardIcon} aria-hidden="true">{c.icon}</div>
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

      <ModuleSection title="Quick discussion prompts" hint="Drop into a slide deck or use as a five-minute opener.">
        <ul style={styles.promptList}>
          <li style={styles.promptItem}>5-minute opener: "If KUA emits ~4,150 mtCO₂e gross/year, and the forest sequesters ~3,000, what does net even mean?"</li>
          <li style={styles.promptItem}>Lab discussion: Have students compute the ISO-NE 2024 weighted-average emission factor (≈0.0956 kg/kWh) from the published mix. Compare to the US average ~0.37.</li>
          <li style={styles.promptItem}>Project prompt: Pick one reduction action from /actions. Defend or critique it with three pieces of campus data.</li>
          <li style={styles.promptItem}>Scope quiz: Students label five campus emissions sources by Scope 1/2/3 in pairs. Compare answers in the dining hall.</li>
        </ul>
      </ModuleSection>

      <ModuleSection title="Class progress">
        <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.6, fontSize: 14 }}>
          Live class quiz rollup is on the
          <Link to="/teacher/lessons" style={{ color: '#22d3ee', marginLeft: 4 }}>Lesson modules</Link>
          {' '}page. It pulls from <code style={styles.code}>/api/quiz/attempts</code>
          and groups by the <code style={styles.code}>classId</code> field on each attempt.
        </p>
      </ModuleSection>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 },
  card: { display: 'block', padding: '18px 20px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10, color: 'inherit', textDecoration: 'none' },
  cardIcon: { fontSize: 32, marginBottom: 8 },
  cardTitle: { fontSize: 17, color: '#e5e7eb', fontWeight: 700, marginBottom: 8 },
  cardBody: { fontSize: 13, color: '#94a3b8', lineHeight: 1.6 },
  cardStat: { fontSize: 11, color: '#22d3ee', marginTop: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 },
  promptList: { margin: 0, paddingLeft: 22, color: '#cbd5e1', fontSize: 14, lineHeight: 1.8 },
  promptItem: { marginBottom: 8 },
  code: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', background: '#0b1220', padding: '2px 6px', borderRadius: 4, color: '#22d3ee', fontSize: 12 },
};

const lessonStyles = {
  list: { display: 'grid', gap: 8 },
  row: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  headRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 },
  title: { fontSize: 15, color: '#e5e7eb', fontWeight: 600 },
  meta: { fontSize: 12, color: '#94a3b8' },
  viewBtn: { padding: '6px 12px', background: '#0f172a', border: '1px solid #0e7490', borderRadius: 6, color: '#22d3ee', textDecoration: 'none', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' },
  resultsBtn: { padding: '6px 12px', background: '#0f172a', border: '1px solid #14532d', borderRadius: 6, color: '#86efac', textDecoration: 'none', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' },
  empty: { padding: 20, background: '#0b1220', border: '1px dashed #334155', borderRadius: 8, textAlign: 'center' },
  cta: { display: 'inline-block', padding: '8px 16px', background: '#22c55e', color: '#0b1220', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: 13 },
};
