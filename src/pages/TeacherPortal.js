import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { PasswordGate } from '../components/PasswordGate.js';
import { hashUserId } from '../utils/hash.js';

// Teacher Portal — gated by VITE_TEACHER_PASSWORD (default "kua-teach"
// in dev). Cards link to:
// - Create a lesson (the new AI-generation editor)
// - Lesson modules (the curated four)
//
// Plus a "My lessons" panel listing the teacher's own published +
// draft lessons, with quick links to the student URL for each.
//
// Student-facing tools (Carbon Learning Chatbot, self-paced Learn
// paths, Student Challenges) intentionally do NOT live in this
// portal. They're public, reachable from the right-side portal nav
// and from the public Categories dropdown — duplicating them as
// teacher-portal cards just made the portal noisier without giving
// teachers anything they couldn't get with one click from the nav.

const tools = [
  { to: '/teacher/create',  icon: '✏️', title: 'Create a lesson',           body: 'Paste source material — an article, lecture notes, a research excerpt. The AI rewrites it at the chosen level and generates a 4-option question quiz, grounded only in what you provided.', stat: 'AI-generated · publish to share with class' },
  { to: '/teacher/lessons', icon: '📚', title: 'Curated lesson modules',    body: 'Four ready-to-run lessons spanning advisory through AP-level. Each includes goals, recommended reading, and an in-class activity prompt.', stat: '4 modules · ready to teach' },
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
      subtitle="Author AI-generated lessons from any source material, review the curated modules, and track class progress. Public student tools (chatbot, self-paced paths, dorm challenges) live in the regular nav — preview them there as a student would see them."
    >
      <ModuleSection title="Teacher tools">
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
          <li style={styles.promptItem}>5-minute opener: "If KUA emits ~4,335 mtCO₂e gross/year, and the forest sequesters ~2,650, what does net even mean?"</li>
          <li style={styles.promptItem}>Lab discussion: Have students compute the ISO-NE 2024 effective emission rate (≈0.235 kg/kWh) by weighting per-fuel output factors across the published 2024 mix. Compare to the US average ~0.37.</li>
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
