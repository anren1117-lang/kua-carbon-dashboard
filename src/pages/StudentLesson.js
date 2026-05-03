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

      {done && (() => {
        const wrong = total - right;
        const tone = pct === 100 ? 'Perfect score — you nailed every question.'
          : pct >= 80 ? 'Strong showing. Skim the explanations on the ones you missed.'
          : pct >= 50 ? 'Good effort. Worth re-reading and re-trying — every option has an explanation that teaches the misconception.'
          : 'Plenty to revisit. Re-read the section above; the explanations below show where each pick went sideways.';
        return (
          <>
            <ModuleSection title="Your score">
              <div style={styles.scoreCard}>
                <div style={styles.scoreLabel}>Final score</div>
                <div>
                  <span style={styles.scoreHero}>{right}<span style={{ color: '#475569', fontWeight: 600 }}> / {total}</span></span>
                  <span style={styles.scoreUnit}>({pct}%)</span>
                </div>
                <div style={styles.scoreRow}>
                  <Pill kind="good">✓ {right} right</Pill>
                  <Pill kind="bad">✗ {wrong} wrong</Pill>
                </div>
                <div style={styles.scoreNote}>{tone}</div>
              </div>
            </ModuleSection>

            <ModuleSection title="Question-by-question report" hint="Every question, what you picked, what was correct, and why.">
              <div style={styles.reportList}>
                {lesson.questions.map((q, qIdx) => {
                  const myPick = picked[qIdx];
                  const myOpt = myPick != null ? q.options[myPick] : null;
                  const correctOpt = q.options.find((o) => o.correct);
                  const kind = myOpt?.correct ? 'right' : myOpt ? 'wrong' : 'skipped';
                  return (
                    <div key={qIdx} style={styles.reportRow(kind)}>
                      <div>
                        <span style={styles.reportNum}>Q{qIdx + 1}</span>
                        <span style={styles.reportMark(kind)}>
                          {kind === 'right' ? '✓ Correct' : kind === 'wrong' ? '✗ Wrong' : '– Not answered'}
                        </span>
                      </div>
                      <div style={styles.reportQ}>{q.question}</div>
                      {myOpt && (
                        <div style={styles.reportLine}>
                          <span style={styles.reportLineLabel}>You picked:</span>
                          {myOpt.text}
                        </div>
                      )}
                      {kind !== 'right' && correctOpt && (
                        <div style={styles.reportLine}>
                          <span style={styles.reportLineLabel}>Correct answer:</span>
                          {correctOpt.text}
                        </div>
                      )}
                      {(myOpt || correctOpt) && (
                        <div style={styles.reportLine}>
                          <span style={styles.reportLineLabel}>Why:</span>
                          {(myOpt && myOpt.explanation) || (correctOpt && correctOpt.explanation) || ''}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p style={{ color: '#94a3b8', marginTop: 14, fontSize: 13, lineHeight: 1.6 }}>
                Your responses were logged anonymously to your teacher's class progress view.
              </p>
            </ModuleSection>
          </>
        );
      })()}
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

  scoreCard: { padding: '20px 22px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10, textAlign: 'left' },
  scoreLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 12 },
  scoreHero: { fontSize: 'clamp(28px, 6vw, 38px)', color: '#e5e7eb', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  scoreUnit: { fontSize: 16, color: '#94a3b8', fontWeight: 500, marginLeft: 8 },
  scoreRow: { marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' },
  scoreNote: { marginTop: 14, fontSize: 14, color: '#94a3b8', lineHeight: 1.6 },

  reportList: { display: 'grid', gap: 10 },
  reportRow: (kind) => ({
    padding: '14px 16px',
    background: '#0f172a',
    border: '1px solid',
    borderColor: kind === 'right' ? '#14532d' : kind === 'wrong' ? '#7f1d1d' : '#334155',
    borderLeft: '4px solid',
    borderLeftColor: kind === 'right' ? '#22c55e' : kind === 'wrong' ? '#ef4444' : '#64748b',
    borderRadius: 8,
  }),
  reportNum: { fontSize: 12, color: '#64748b', fontWeight: 700, letterSpacing: 0.6 },
  reportMark: (kind) => ({
    display: 'inline-block',
    fontSize: 11,
    padding: '3px 10px',
    borderRadius: 999,
    fontWeight: 700,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    background: kind === 'right' ? '#052e1a' : kind === 'wrong' ? '#3a0d12' : '#1e293b',
    color: kind === 'right' ? '#86efac' : kind === 'wrong' ? '#fca5a5' : '#cbd5e1',
  }),
  reportQ: { marginTop: 8, fontSize: 15, color: '#e5e7eb', fontWeight: 600, lineHeight: 1.5 },
  reportLine: { marginTop: 8, fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 },
  reportLineLabel: { color: '#64748b', fontWeight: 600, marginRight: 6 },
  qExplainBody: { gridColumn: '2 / 3', fontSize: 12, color: '#94a3b8', marginTop: 2 },
};
