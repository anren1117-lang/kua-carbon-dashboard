import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { hashUserId } from '../utils/hash.js';

// Student-facing lesson view. Loads /api/teacher/lessons?id=... and
// renders the AI-generated reading + 4-option questions. Submits each
// answer to /api/quiz/attempts so the Teacher dashboard can roll up
// who has done what.

function getStudentHash() {
  try {
    let id = sessionStorage.getItem('kua_student_lesson_id');
    if (!id) {
      id = `student-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem('kua_student_lesson_id', id);
    }
    return hashUserId('student', id);
  } catch {
    return hashUserId('student', `anon_${Date.now()}`);
  }
}

export default function StudentLesson() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [picked, setPicked] = useState({});  // { qIdx: optIdx }
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/teacher/lessons?id=${encodeURIComponent(id)}`)
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((j) => {
        if (cancelled) return;
        setLesson(j.lesson);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  function pickAnswer(qIdx, optIdx) {
    if (picked[qIdx] != null) return; // already answered this one
    setPicked((p) => ({ ...p, [qIdx]: optIdx }));

    const q = lesson.questions[qIdx];
    const opt = q.options[optIdx];
    fetch('/api/quiz/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userIdHash: getStudentHash(),
        quizId: `${lesson.id}_q${qIdx}`,
        topic: lesson.topic,
        correct: !!opt.correct,
        pickedIndex: optIdx,
        classId: lesson.classId,
      }),
    }).catch(() => {});

    if (Object.keys(picked).length + 1 === lesson.questions.length) {
      setDone(true);
    }
  }

  if (loading) {
    return (
      <ModulePage title="Loading lesson…">
        <ModuleSection><div style={{ color: '#94a3b8' }}>Fetching from /api/teacher/lessons…</div></ModuleSection>
      </ModulePage>
    );
  }
  if (error || !lesson) {
    return (
      <ModulePage title="Lesson not found">
        <ModuleSection>
          <div style={{ color: '#fca5a5' }}>
            {error || 'No lesson with that ID.'}
          </div>
          <Link to="/learn" style={{ color: '#22d3ee', display: 'inline-block', marginTop: 12 }}>
            ← Back to Learn paths
          </Link>
        </ModuleSection>
      </ModulePage>
    );
  }

  const right = Object.entries(picked).filter(([qIdx, optIdx]) => lesson.questions[qIdx].options[optIdx].correct).length;
  const total = lesson.questions.length;
  const pct = total ? Math.round((right / total) * 100) : 0;

  return (
    <ModulePage
      title={lesson.title}
      subtitle={`Topic: ${lesson.topic.replace('_', ' ')} · Reading level: ${lesson.readingLevel}${lesson.classId ? ` · Class: ${lesson.classId}` : ''}`}
    >
      <ModuleSection title="Reading">
        <div style={styles.reading}>{lesson.generatedReading}</div>
      </ModuleSection>

      <ModuleSection title="Check your understanding" hint="Click an answer to see explanations for every option.">
        {lesson.questions.map((q, qIdx) => {
          const myPick = picked[qIdx];
          const answered = myPick != null;
          return (
            <div key={qIdx} style={styles.qCard}>
              <div style={styles.qHead}>Q{qIdx + 1}. {q.question}</div>
              <div style={styles.qOpts}>
                {q.options.map((o, optIdx) => {
                  let bg = '#0b1220', border = '#1f2937';
                  if (answered) {
                    if (o.correct) { bg = '#052e1a'; border = '#14532d'; }
                    else if (optIdx === myPick) { bg = '#3a0d12'; border = '#7f1d1d'; }
                  }
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={answered}
                      onClick={() => pickAnswer(qIdx, optIdx)}
                      style={{ ...styles.qOpt, background: bg, borderColor: border }}
                      aria-pressed={optIdx === myPick}
                    >
                      <span>{o.text}</span>
                      {answered && o.correct && <span style={styles.qMark('good')}> ✓ correct</span>}
                      {answered && !o.correct && optIdx === myPick && <span style={styles.qMark('bad')}> ✗ your pick</span>}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div style={styles.qExplain}>
                  {q.options.map((o, j) => (
                    <div key={j} style={{ ...styles.qExplainRow, color: o.correct ? '#86efac' : '#94a3b8' }}>
                      <Pill kind={o.correct ? 'good' : 'bad'}>{o.correct ? '✓' : '✗'}</Pill>
                      <span>{o.text}</span>
                      <span style={styles.qExplainBody}>{o.explanation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </ModuleSection>

      {done && (
        <ModuleSection title="Your score">
          <MetricGrid metrics={[
            { label: 'Correct',     value: `${right} / ${total}`, accent: '#86efac' },
            { label: 'Percent',     value: `${pct}%`,             accent: pct >= 80 ? '#86efac' : pct >= 50 ? '#fbbf24' : '#fca5a5' },
            { label: 'Lesson topic', value: lesson.topic.replace('_', ' '),   accent: '#22d3ee' },
          ]} />
          <p style={{ color: '#94a3b8', marginTop: 14, fontSize: 14, lineHeight: 1.6 }}>
            Your responses were logged anonymously to your teacher's class progress view.
          </p>
        </ModuleSection>
      )}
    </ModulePage>
  );
}

const styles = {
  reading: { fontSize: 16, color: '#cbd5e1', lineHeight: 1.8, whiteSpace: 'pre-wrap' },
  qCard: { padding: 14, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, marginBottom: 12 },
  qHead: { fontSize: 15, color: '#e5e7eb', fontWeight: 700, marginBottom: 10 },
  qOpts: { display: 'grid', gap: 6 },
  qOpt: { padding: '10px 14px', textAlign: 'left', border: '1px solid', borderRadius: 6, color: '#cbd5e1', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', gap: 12 },
  qMark: (k) => ({ fontSize: 11, fontWeight: 700, color: k === 'good' ? '#86efac' : '#fca5a5' }),
  qExplain: { marginTop: 12, padding: 10, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6, display: 'grid', gap: 8 },
  qExplainRow: { display: 'grid', gridTemplateColumns: '32px 1fr', gap: 8, fontSize: 13, lineHeight: 1.5, alignItems: 'start' },
  qExplainBody: { gridColumn: '2 / 3', fontSize: 12, color: '#94a3b8', marginTop: 2 },
};
