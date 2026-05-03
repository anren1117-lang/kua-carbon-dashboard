import React from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection } from '../components/ModuleShell.js';

// Teacher Portal — the entry point for faculty. Everything classroom-
// facing lives here:
// - Lesson modules (formerly /teacher, now /teacher/lessons)
// - Carbon Learning Chatbot (also at /chatbot for direct student access)
// - Self-paced Learn paths (also at /learn)
// - Student Challenges leaderboard (also at /challenges)
// - Class quiz progress (live rollup from /api/quiz/attempts)

const cards = [
  {
    to: '/teacher/lessons',
    icon: '📚',
    title: 'Lesson modules',
    body: 'Four ready-to-run lessons spanning advisory through AP-level. Each has goals, recommended reading, and an in-class activity.',
    stat: '4 modules',
  },
  {
    to: '/chatbot',
    icon: '💬',
    title: 'Carbon Learning Chatbot',
    body: 'Curriculum-bounded Q&A with citations. Students can use it directly; teachers can see what topics come up and where confidence is low.',
    stat: 'rule-based · LLM-grounded when configured',
  },
  {
    to: '/learn',
    icon: '🎓',
    title: 'Self-paced Learn paths',
    body: 'Multi-step learning agent — 11 paths spanning intro through AP. Each step is a 4-option quiz with full explanations.',
    stat: '11 paths · ~150 questions',
  },
  {
    to: '/challenges',
    icon: '🏆',
    title: 'Student Challenges',
    body: 'Dorm-level leaderboard (privacy-by-design). Weekly challenge slate. Individual ranking is opt-in only.',
    stat: 'Aggregated at dorm level',
  },
];

const quickPrompts = [
  '5-minute opener: "If KUA emits ~4,150 mtCO₂e gross/year, and the forest sequesters ~3,000, what does net even mean?"',
  'Lab discussion: Have students compute the ISO-NE 2024 weighted-average emission factor (≈0.0956 kg/kWh) from the published mix. Compare to the US average ~0.37.',
  'Project prompt: Pick one reduction action from /actions. Defend or critique it with three pieces of campus data.',
  'Scope quiz: Students label five campus emissions sources by Scope 1/2/3 in pairs. Compare answers in the dining hall.',
];

export default function TeacherPortal() {
  return (
    <ModulePage
      title="Teacher Portal"
      subtitle="Everything classroom-facing in one place. Each card links to the underlying tool — students can also reach Chatbot / Learn / Challenges from the public nav."
    >
      <ModuleSection title="Tools">
        <div style={styles.grid}>
          {cards.map((c) => (
            <Link key={c.to} to={c.to} style={styles.card} aria-label={`${c.title} — ${c.body}`}>
              <div style={styles.cardIcon} aria-hidden="true">{c.icon}</div>
              <div style={styles.cardTitle}>{c.title}</div>
              <div style={styles.cardBody}>{c.body}</div>
              <div style={styles.cardStat}>{c.stat}</div>
            </Link>
          ))}
        </div>
      </ModuleSection>

      <ModuleSection title="Quick discussion prompts" hint="Drop into a slide deck or use as a five-minute opener.">
        <ul style={styles.promptList}>
          {quickPrompts.map((p, i) => <li key={i} style={styles.promptItem}>{p}</li>)}
        </ul>
      </ModuleSection>

      <ModuleSection title="Looking for class progress?">
        <p style={styles.note}>
          Class learning progress (live rollup from chatbot quizzes) lives on the
          <Link to="/teacher/lessons" style={{ color: '#22d3ee', marginLeft: 4 }}>Lesson modules</Link>
          {' '}page along with the four lessons themselves.
        </p>
      </ModuleSection>
    </ModulePage>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 },
  card: { display: 'block', padding: '18px 20px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10, color: 'inherit', textDecoration: 'none', transition: 'border-color 0.15s' },
  cardIcon: { fontSize: 32, marginBottom: 8 },
  cardTitle: { fontSize: 17, color: '#e5e7eb', fontWeight: 700, marginBottom: 8 },
  cardBody: { fontSize: 13, color: '#94a3b8', lineHeight: 1.6 },
  cardStat: { fontSize: 11, color: '#22d3ee', marginTop: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 },
  promptList: { margin: 0, paddingLeft: 22, color: '#cbd5e1', fontSize: 14, lineHeight: 1.8 },
  promptItem: { marginBottom: 8 },
  note: { fontSize: 14, color: '#cbd5e1', margin: 0, lineHeight: 1.6 },
};
