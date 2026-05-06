import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ModulePage, ModuleSection, MetricGrid } from '../components/ModuleShell.js';
import { PasswordGate } from '../components/PasswordGate.js';

// Per-lesson results dashboard for teachers. Shows:
// - Total attempts + unique students + average accuracy.
// - One row per student (hashed ID) with their right/total/percent
//   and last-attempt timestamp.
// - Per-question accuracy bar so the teacher can see which questions
//   tripped the class up.
//
// Identities are hashed by design — names never reach this dashboard.
// Phase-2 swap to SSO would let teachers map hashes to roster names
// via a separate roster lookup the dashboard never holds.

function ResultsContent() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [students, setStudents] = useState(null);
  const [attempts, setAttempts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    // Reject non-OK responses up front. Earlier this used .then(r => r.json())
    // unconditionally, so a 404 (lesson not found) parsed as { error: 'Not found' },
    // setLesson got `undefined`, and the !lesson branch below kept showing
    // "Loading…" forever. Fail loudly instead.
    const okJson = (label) => (r) => {
      if (!r.ok) throw new Error(`${label} ${r.status}`);
      return r.json();
    };
    Promise.all([
      fetch(`/api/teacher/lessons?id=${encodeURIComponent(lessonId)}`).then(okJson('lesson')),
      fetch(`/api/quiz/attempts?lessonId=${encodeURIComponent(lessonId)}&rollup=students`).then(okJson('rollup')),
      fetch(`/api/quiz/attempts?lessonId=${encodeURIComponent(lessonId)}`).then(okJson('attempts')),
    ])
      .then(([lj, sj, aj]) => {
        if (cancelled) return;
        setLesson(lj.lesson);
        setStudents(sj.students || []);
        setAttempts(aj.attempts || []);
      })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [lessonId]);

  // Per-question accuracy (across all students)
  const perQuestion = useMemo(() => {
    if (!lesson || !attempts) return [];
    return lesson.questions.map((q, qIdx) => {
      const slice = attempts.filter((a) => a.quizId === `${lessonId}_q${qIdx}`);
      const right = slice.filter((a) => a.correct).length;
      return {
        idx: qIdx,
        question: q.question,
        attempts: slice.length,
        right,
        accuracy: slice.length ? right / slice.length : 0,
      };
    });
  }, [lesson, attempts, lessonId]);

  if (error) {
    return (
      <ModulePage title="Lesson results">
        <ModuleSection title="Error">
          <div style={{ color: '#fca5a5' }}>{error}</div>
          <Link to="/teacher" style={{ color: '#22d3ee', display: 'inline-block', marginTop: 12 }}>← Back to portal</Link>
        </ModuleSection>
      </ModulePage>
    );
  }
  if (!lesson) {
    return (
      <ModulePage title="Loading lesson results…">
        <ModuleSection><div style={{ color: '#94a3b8' }}>Fetching from /api/teacher/lessons + /api/quiz/attempts…</div></ModuleSection>
      </ModulePage>
    );
  }

  const totalAttempts = attempts?.length ?? 0;
  const uniqueStudents = students?.length ?? 0;
  const overallAccuracy = totalAttempts ? attempts.filter((a) => a.correct).length / totalAttempts : 0;

  return (
    <ModulePage
      title={`Results — ${lesson.title}`}
      subtitle={`${lesson.topic.replace('_', ' ')} · ${lesson.readingLevel} · ${lesson.questions.length} questions${lesson.classId ? ` · ${lesson.classId}` : ''}`}
    >
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link to={`/lessons/${lesson.id}`} style={styles.link}>Open student view →</Link>
        <Link to="/teacher" style={styles.linkSecondary}>← Back to portal</Link>
      </div>

      <MetricGrid metrics={[
        { label: 'Total attempts',   value: totalAttempts, accent: '#22d3ee' },
        { label: 'Unique students',  value: uniqueStudents, accent: '#fbbf24' },
        { label: 'Overall accuracy', value: `${Math.round(overallAccuracy * 100)}%`, accent: overallAccuracy >= 0.8 ? '#86efac' : overallAccuracy >= 0.6 ? '#fbbf24' : '#fca5a5' },
        { label: 'Questions',        value: lesson.questions.length, accent: '#a855f7' },
      ]} />

      <ModuleSection title="Per-student scores" hint="Identifiers are hashed — names never reach this dashboard. The same student's attempts roll up under one hash if they take the lesson from the same browser session.">
        {!students || students.length === 0 ? (
          <div style={styles.empty}>No student attempts yet. Share the lesson URL with your class.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student (hashed)</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Score</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Accuracy</th>
                <th style={styles.th}>Class</th>
                <th style={styles.th}>Last attempt</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const pct = Math.round(s.accuracy * 100);
                return (
                  <tr key={s.userIdHash}>
                    <td style={{ ...styles.td, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 }}>{s.userIdHash}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{s.right} / {s.total}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: pct >= 80 ? '#86efac' : pct >= 50 ? '#fbbf24' : '#fca5a5', fontWeight: 700 }}>{pct}%</td>
                    <td style={{ ...styles.td, color: '#94a3b8' }}>{s.classId || '—'}</td>
                    <td style={{ ...styles.td, color: '#94a3b8', fontSize: 12 }}>{new Date(s.lastAttemptAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </ModuleSection>

      <ModuleSection title="Per-question accuracy" hint="Where the class struggled. Questions with low accuracy are good candidates for in-class follow-up.">
        {totalAttempts === 0 ? (
          <div style={styles.empty}>No attempts yet — once students take the lesson, accuracy bars will populate.</div>
        ) : (
          <div style={styles.qList}>
            {perQuestion.map((q) => {
              const pct = Math.round(q.accuracy * 100);
              return (
                <div key={q.idx} style={styles.qRow}>
                  <div style={styles.qLabel}>Q{q.idx + 1}. {q.question}</div>
                  <div style={styles.qBar}>
                    <div style={{ ...styles.qFill, width: `${pct}%`, background: pct >= 80 ? '#22c55e' : pct >= 50 ? '#fbbf24' : '#ef4444' }} />
                  </div>
                  <div style={styles.qNum}>
                    <strong>{pct}%</strong>
                    <span style={styles.qSub}>{q.right} / {q.attempts}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ModuleSection>
    </ModulePage>
  );
}

export default function TeacherLessonResults() {
  return (
    <PasswordGate
      title="Teacher Portal"
      subtitle="Lesson results are private to teachers. Sign in with your teacher password."
      envKey="TEACHER_PASSWORD"
      storageKey="kua_teacher_unlocked"
      defaultPassword="kua-teach"
      accent="#22c55e"
    >
      <ResultsContent />
    </PasswordGate>
  );
}

const styles = {
  link: { padding: '8px 14px', background: '#22c55e', color: '#0b1220', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: 13 },
  linkSecondary: { padding: '8px 14px', background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', borderRadius: 6, textDecoration: 'none', fontSize: 13 },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '10px 8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 11, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '10px 8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937' },

  qList: { display: 'grid', gap: 10 },
  qRow: { display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(140px, 2fr) 100px', gap: 12, alignItems: 'center', padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  qLabel: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.4 },
  qBar: { height: 12, background: '#0f172a', borderRadius: 6, overflow: 'hidden' },
  qFill: { height: '100%' },
  qNum: { textAlign: 'right', fontSize: 13, color: '#e5e7eb', fontVariantNumeric: 'tabular-nums' },
  qSub: { display: 'block', fontSize: 11, color: '#64748b', marginTop: 2 },

  empty: { padding: 16, textAlign: 'center', color: '#94a3b8', background: '#0b1220', border: '1px dashed #334155', borderRadius: 8 },
};
