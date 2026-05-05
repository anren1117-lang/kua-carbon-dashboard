import React, { useState, useEffect } from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { knowledgeArticles } from '../data/learningContent.js';
import { reductionActions } from '../data/reductionActions.js';

// Teacher / Classroom dashboard. Surfaces:
// - Lesson modules built around the knowledge-base articles.
// - Sample (mock) class quiz outcomes — Phase-2 will pull from real
//   QuizAttempt data once the chatbot is connected.
// - Discussion prompts auto-generated from the campus's own emissions
//   data and reduction actions.
// - Exportable activity card snippets that teachers can paste into
//   lesson plans.

const LESSON_MODULES = [
  {
    id: 'lm_intro',
    title: 'Climate change in 5 minutes',
    duration: '15-20 min',
    fitsWith: 'Earth/environmental science, social studies, advisory period',
    summary: 'A non-mathy walkthrough of the greenhouse effect, why CO₂ matters, and how human activity has changed atmospheric concentrations since 1850.',
    learningGoals: [
      'Distinguish between weather and climate',
      'Identify the major greenhouse gases and their sources',
      'Explain why current warming is "different" from past climate cycles',
    ],
    keyArticles: ['ka_what_is_footprint', 'ka_scopes'],
    activity: 'Have students sketch the campus and label one Scope-1, one Scope-2, and one Scope-3 source. Compare in pairs.',
  },
  {
    id: 'lm_scopes',
    title: 'Scope 1 / 2 / 3 — what KUA actually emits',
    duration: '25-30 min',
    fitsWith: 'Chemistry, environmental science, math/stats',
    summary: 'Walk through the GHG Protocol scope definitions using KUA\'s own preliminary numbers as the worked example.',
    learningGoals: [
      'Define each scope using a concrete KUA source',
      'Estimate which scope drives the largest share of campus emissions',
      'Argue why measurement boundaries matter for accountability',
    ],
    keyArticles: ['ka_scopes', 'ka_kua_emissions'],
    activity: 'Give students KUA\'s rough scope splits (1: ~1,250 mt, 2: ~395 mt, 3: ~2,700 mt) and ask: which scope is most reducible without the school giving anything up? Defend in 3 sentences.',
  },
  {
    id: 'lm_food',
    title: 'Food and carbon — the dining-hall lever',
    duration: '20-25 min',
    fitsWith: 'Biology, environmental science, food and culture electives',
    summary: 'Why ruminant meat dominates food-related carbon, and what a 20% beef reduction would mean at scale for KUA dining.',
    learningGoals: [
      'Explain why methane from cattle digestion matters',
      'Compute a simple emission delta from a menu change',
      'Critique the trade-offs of swap-based interventions',
    ],
    keyArticles: ['ka_beef_emissions'],
    activity: 'Use the Dining page\'s "Cut beef 20%" scenario. Have students compute the per-meal cost and per-student annual impact, then debate whether KUA should adopt it.',
  },
  {
    id: 'lm_grid',
    title: 'Reading a grid mix',
    duration: '30-40 min',
    fitsWith: 'AP Environmental Science, AP Chem, physics',
    summary: 'How ISO-NE\'s 2024 mix translates to KUA\'s electricity emissions. Students compute kgCO₂/kWh from first principles using the published shares.',
    learningGoals: [
      'Read and interpret a regional grid generation mix',
      'Compute a weighted-average emission factor',
      'Compare against US and global averages',
    ],
    keyArticles: ['ka_grid_clean'],
    activity: 'Have students recompute the ISO-NE average factor (~0.0956 kg CO₂/kWh) using the gridMix percentages and per-fuel factors. Discuss why it\'s 4× cleaner than the US average.',
  },
];

const MOCK_CLASS_RESULTS = [
  { class: 'APES — Period 3', students: 18, completed: 16, avgScore: 84, lastTopic: 'Scope 1/2/3' },
  { class: 'Biology — Period 5', students: 22, completed: 19, avgScore: 78, lastTopic: 'Food emissions' },
  { class: 'AP Chem — Period 7', students: 14, completed: 14, avgScore: 91, lastTopic: 'Grid mix math' },
  { class: 'Advisory — Mr. Smith', students: 12, completed: 8, avgScore: 65, lastTopic: 'Climate basics' },
];

export default function Teacher() {
  const [expanded, setExpanded] = useState(LESSON_MODULES[0].id);
  const [liveRollup, setLiveRollup] = useState(null);
  const [liveError, setLiveError] = useState(null);

  // Pull the live rollup from /api/quiz/attempts. Phase 1: in-memory
  // ledger reset on cold starts → typically empty until a student
  // takes a quiz in the same function instance. Mock table below stays
  // visible whenever the live rollup has zero rows.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/quiz/attempts?rollup=class')
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((j) => { if (!cancelled) setLiveRollup(j.classes || []); })
      .catch((err) => { if (!cancelled) setLiveError(err.message); });
    return () => { cancelled = true; };
  }, []);

  const articleById = Object.fromEntries(knowledgeArticles.map((a) => [a.id, a]));
  const topActions = reductionActions.slice(0, 4);

  return (
    <ModulePage
      title="Teacher Tools"
      subtitle="Lesson modules, classroom activity prompts, and class-level learning progress. All material is reusable; everything below is editable in src/pages/Teacher.js."
    >
      <MetricGrid metrics={[
        { label: 'Lesson modules',        value: LESSON_MODULES.length,                    accent: '#22d3ee' },
        { label: 'Knowledge articles',    value: knowledgeArticles.length,                 accent: '#fbbf24' },
        { label: 'Discussion prompts',    value: topActions.length + LESSON_MODULES.length, accent: '#86efac' },
        { label: 'Quiz topics available', value: 4,                                        accent: '#ef4444', note: 'Scopes, food, grid, KUA' },
      ]} />

      <ModuleSection
        title="Lesson modules"
        hint="Each module includes goals, an activity prompt, and the knowledge-base articles students should read first."
      >
        <div style={styles.list}>
          {LESSON_MODULES.map((m) => {
            const isOpen = expanded === m.id;
            return (
              <div key={m.id} style={styles.lessonCard}>
                <div style={styles.lessonHead} onClick={() => setExpanded(isOpen ? null : m.id)}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.lessonTitle}>{m.title}</div>
                    <div style={styles.lessonMeta}>
                      <Pill kind="info">{m.duration}</Pill>
                      <span style={styles.lessonFit}>{m.fitsWith}</span>
                    </div>
                  </div>
                  <span style={styles.arrow}>{isOpen ? '▼' : '▶'}</span>
                </div>
                {isOpen && (
                  <div style={styles.lessonBody}>
                    <p style={styles.lessonSummary}>{m.summary}</p>
                    <div style={styles.lessonLabel}>Learning goals</div>
                    <ul style={styles.lessonList}>
                      {m.learningGoals.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                    <div style={styles.lessonLabel}>Reading</div>
                    <ul style={styles.lessonList}>
                      {m.keyArticles.map((id) => articleById[id] && <li key={id}>{articleById[id].title}</li>)}
                    </ul>
                    <div style={styles.lessonLabel}>In-class activity</div>
                    <div style={styles.lessonActivity}>{m.activity}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ModuleSection>

      <ModuleSection
        title={liveRollup && liveRollup.length > 0 ? 'Class learning progress (live)' : 'Class learning progress (mock)'}
        hint={
          liveRollup && liveRollup.length > 0
            ? 'Live rollup of chatbot quiz attempts grouped by class assignment. Empty rows clear when the in-memory ledger resets between cold starts.'
            : liveError
              ? `Live rollup unavailable (${liveError}). Showing sample data.`
              : 'No live attempts logged yet — sample data shown. Take a quiz in /chatbot to populate this.'
        }
      >
        {liveRollup && liveRollup.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Class</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Attempts</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Correct</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Accuracy</th>
                <th style={styles.th}>Topics covered</th>
              </tr>
            </thead>
            <tbody>
              {liveRollup.map((c) => {
                const pct = Math.round(c.accuracy * 100);
                return (
                  <tr key={c.classId}>
                    <td style={styles.td}>{c.classId}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.total}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.correct}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: pct >= 80 ? '#86efac' : pct >= 70 ? '#fbbf24' : '#fca5a5' }}>{pct}%</td>
                    <td style={{ ...styles.td, color: '#94a3b8' }}>{c.topics.join(', ')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Class</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Students</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Completed</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Avg score</th>
                <th style={styles.th}>Most recent topic</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CLASS_RESULTS.map((c) => (
                <tr key={c.class}>
                  <td style={styles.td}>{c.class}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.students}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.completed}/{c.students}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: c.avgScore >= 80 ? '#86efac' : c.avgScore >= 70 ? '#fbbf24' : '#fca5a5' }}>{c.avgScore}%</td>
                  <td style={{ ...styles.td, color: '#94a3b8' }}>{c.lastTopic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ModuleSection>

      <ModuleSection
        title="Discussion prompts from KUA's data"
        hint="Generated from the current reduction-action queue. Drop into a slide deck or use as a 5-minute opener."
      >
        <div style={styles.promptGrid}>
          {topActions.map((a) => (
            <div key={a.id} style={styles.promptCard}>
              <div style={styles.promptLabel}>Prompt</div>
              <div style={styles.promptText}>
                "KUA's sustainability team is considering: <strong>{a.title.toLowerCase()}</strong>.
                It would save about <strong>{a.expectedReductionMtCO2e} mtCO₂e/year</strong>.
                Should we do it? Who pays? What could go wrong?"
              </div>
              <div style={styles.promptMeta}>{a.category} · {a.difficulty} difficulty · {a.urgency} urgency</div>
            </div>
          ))}
        </div>
      </ModuleSection>
    </ModulePage>
  );
}

const styles = {
  list: { display: 'grid', gap: 10 },
  lessonCard: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  lessonHead: { display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' },
  lessonTitle: { fontSize: 15, color: '#e5e7eb', fontWeight: 700 },
  lessonMeta: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, flexWrap: 'wrap' },
  lessonFit: { fontSize: 12, color: '#94a3b8' },
  arrow: { color: '#64748b', fontSize: 14, marginTop: 2 },
  lessonBody: { marginTop: 14, paddingTop: 12, borderTop: '1px solid #1f2937' },
  lessonSummary: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 12px' },
  lessonLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6, marginTop: 12 },
  lessonList: { margin: 0, paddingLeft: 20, fontSize: 13, color: '#cbd5e1', lineHeight: 1.7 },
  lessonActivity: { padding: 12, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, fontStyle: 'italic' },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '10px 8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 11, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '10px 8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937' },

  promptGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 },
  promptCard: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #fbbf24', borderRadius: 8 },
  promptLabel: { fontSize: 11, color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
  promptText: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 },
  promptMeta: { fontSize: 12, color: '#64748b', marginTop: 10, textTransform: 'capitalize' },
};
