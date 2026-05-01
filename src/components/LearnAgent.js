import React, { useState } from 'react';

// Curriculum: 4 learning paths, each ~5–8 steps, mixing concept cards with quizzes.
// Every numerical claim references the same preliminary estimate the rest of the
// dashboard uses, so the agent and the dashboard never disagree.
const paths = [
  {
    id: 'basics',
    title: 'Carbon basics',
    desc: 'What Scope 1, 2, 3 and sinks mean — start here.',
    estMin: 4,
    steps: [
      {
        type: 'concept',
        heading: 'Why we organize emissions into "scopes"',
        body: 'Carbon emissions come from many sources, but who controls each source matters. The Greenhouse Gas Protocol — the global standard — splits them into three scopes by who owns the source.',
      },
      {
        type: 'concept',
        heading: 'Scope 1 — direct emissions',
        body: 'Things KUA owns and operates that burn fuel. Heating oil in boilers, propane water heaters, refrigerant leaks from air conditioners, gasoline in school vans. If we can choose to turn it off, it\'s Scope 1.',
      },
      {
        type: 'quiz',
        question: 'A campus van fills up at the gas station. Which scope is that?',
        options: [
          { text: 'Scope 1', correct: true, explanation: 'Right. KUA owns the van and operates it; the combustion happens here.' },
          { text: 'Scope 2', correct: false, explanation: 'Scope 2 is purchased electricity. Vehicle fuel that KUA burns directly is Scope 1.' },
          { text: 'Scope 3', correct: false, explanation: 'Close — student travel is Scope 3. But for KUA-owned fleet, it\'s Scope 1.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Scope 2 — purchased electricity',
        body: 'KUA never burns fuel to make electricity, but the power plants on the New England grid do — on our behalf — every time someone flips a light switch. We use ISO-NE\'s 2024 emission factor (643 lb CO₂/MWh) to convert kWh into mtCO₂e.',
      },
      {
        type: 'concept',
        heading: 'Scope 3 — everything else',
        body: 'The supply chain. Food in the dining hall, paper for class, flights students take home for break. At residential schools, Scope 3 — especially student travel — is usually the LARGEST scope, even though it\'s the hardest to measure.',
      },
      {
        type: 'quiz',
        question: 'A student flies home to Tokyo for winter break. Which scope?',
        options: [
          { text: 'Scope 1', correct: false, explanation: 'KUA doesn\'t own the airplane.' },
          { text: 'Scope 2', correct: false, explanation: 'Scope 2 is electricity.' },
          { text: 'Scope 3', correct: true, explanation: 'Right. Student travel is Scope 3 — indirect emissions from KUA\'s activities, but not under direct control.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Sinks — the only category that goes the other way',
        body: 'Trees and soils on campus pull CO₂ OUT of the atmosphere via photosynthesis. KUA\'s ~1,000 acres of forest sequesters roughly 3,000 mtCO₂e/year. Most peer schools never measure this — but it\'s a real, physical drawdown.',
      },
      {
        type: 'finish',
        heading: 'You\'ve got the framework',
        body: 'Now you know the four buckets: Scope 1 (direct), Scope 2 (electricity), Scope 3 (indirect), and Sinks (drawdown). Every number on this dashboard fits into one of them.',
      },
    ],
  },
  {
    id: 'kua-footprint',
    title: 'KUA\'s footprint',
    desc: 'Walk through KUA\'s preliminary estimated numbers.',
    estMin: 5,
    steps: [
      {
        type: 'concept',
        heading: 'KUA\'s headline number is ~1,150 mtCO₂e/year',
        body: 'That\'s the NET balance — gross emissions minus on-campus sequestration. The range is wide right now (−760 to +3,572) because most of the inputs are estimates. Once measured data fills in, the range tightens.',
      },
      {
        type: 'concept',
        heading: 'Where does that number come from?',
        body: 'Gross: ~4,150 mtCO₂e/yr (Scope 1 ~1,000 + Scope 2 ~222 + Scope 3 ~3,000). Sequestration: ~3,000 mtCO₂e/yr drawdown from the campus forest. Net: 4,150 − 3,000 = 1,150.',
      },
      {
        type: 'quiz',
        question: 'Which scope is the biggest contributor to KUA\'s gross emissions?',
        options: [
          { text: 'Scope 1 (heating)', correct: false, explanation: 'Heating fuel is significant (~1,000 mt) but not the biggest.' },
          { text: 'Scope 2 (electricity)', correct: false, explanation: 'Electricity is actually our smallest scope at 222 mt — the New England grid is fairly clean.' },
          { text: 'Scope 3 (indirect/travel)', correct: true, explanation: 'Right. Student travel + supply chain is ~72% of KUA\'s gross emissions. International student round-trip flights are ~3 mtCO₂e EACH.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Why is Scope 3 so dominant?',
        body: 'KUA is a residential boarding school in cold-climate New Hampshire. International students fly home, and a long-haul economy round-trip from East Asia is roughly 3 mtCO₂e per passenger — by far the most carbon-intensive single thing a student does each year. Kool (2025) found this same pattern at Royal Roads University.',
      },
      {
        type: 'concept',
        heading: 'The 1,000 acres of forest changes everything',
        body: 'Most peer schools don\'t even measure their sinks. KUA\'s forest pulls roughly 3,000 mtCO₂e/year out of the air via photosynthesis. On the optimistic end of our range, that drawdown EXCEEDS our gross emissions — KUA could be net carbon-negative.',
      },
      {
        type: 'quiz',
        question: 'KUA\'s preliminary per-student emissions (~1.9 mtCO₂e). How does that compare to peer boarding schools?',
        options: [
          { text: 'About the same', correct: false, explanation: 'Most peer boarding schools are 6–10 mt/student because they don\'t count sinks.' },
          { text: 'Lower than peers', correct: true, explanation: 'Right. Phillips Exeter is ~10, Andover ~9 — KUA looks lower largely because we\'re the only school in the chart that quantifies on-campus sequestration.' },
          { text: 'Higher than peers', correct: false, explanation: 'Boarding schools have similar gross emissions; the difference is whether sinks are measured.' },
        ],
      },
      {
        type: 'finish',
        heading: 'You understand KUA\'s number',
        body: 'Net ~1,150 mt/yr. ~72% of gross from Scope 3 (mostly student travel). 1,000-acre forest pulls back roughly 3,000 mt/yr. Net per student: ~1.9 mtCO₂e — strong relative to peers because we measure our forest.',
      },
    ],
  },
  {
    id: 'compare',
    title: 'How KUA compares',
    desc: 'Why peer comparisons are tricky, and what they actually show.',
    estMin: 3,
    steps: [
      {
        type: 'concept',
        heading: 'The peer chart shows shape, not just totals',
        body: 'Each bar splits a school\'s per-student emissions by scope, with sinks and offsets shown to the LEFT of zero. Two patterns become visible: boarding-secondary peers cluster on a similar shape (heavy heating + heavy travel), and Middlebury\'s "net zero" turns out to be purchased offsets, not physical removal.',
      },
      {
        type: 'quiz',
        question: 'Why is comparing schools\' carbon numbers tricky?',
        options: [
          { text: 'Different scope inclusion', correct: true, explanation: 'Right. Some schools count Scope 3 fully, others partially. Some count sinks, most don\'t. Different denominators (FTE vs headcount) also distort comparisons. Valls-Val & Bovea (2021) reviewed 35 university footprint studies and found this exact problem.' },
          { text: 'Different climates', correct: false, explanation: 'Climate matters but isn\'t the main reason. Methodology differences are.' },
          { text: 'Different student counts', correct: false, explanation: 'Schools normalize to per-student. The issue is methodological inconsistency.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Middlebury\'s "net zero" is different from KUA\'s drawdown',
        body: 'Middlebury reports as carbon-neutral, but they get there by purchasing carbon offsets equal to their gross emissions. The CO₂ molecules they emit still go up; they just paid someone else to remove an equal amount somewhere else. KUA\'s 3,000 mtCO₂e/yr from the campus forest is physical — those CO₂ molecules are actually pulled out of the air, on KUA land.',
      },
      {
        type: 'finish',
        heading: 'Comparison context, not a leaderboard',
        body: 'KUA\'s shape (heavy travel, with a green sinks bar) is structurally normal for a NH boarding school. The unique thing is that we measure the sinks at all — Valls-Val & Bovea (2021) found this gap in HEI carbon reporting, and the dashboard exists partly to close it.',
      },
    ],
  },
  {
    id: 'actions',
    title: 'What actually changes the number',
    desc: 'Action levers ranked by impact, with the math behind each.',
    estMin: 4,
    steps: [
      {
        type: 'concept',
        heading: 'Some actions matter much more than others',
        body: 'A student who turns off lights, a heat-pump retrofit, a single fewer round-trip flight per international student — all reduce emissions, but by very different amounts. Knowing the magnitudes matters when you decide what to spend time on.',
      },
      {
        type: 'quiz',
        question: 'Which has the biggest impact on KUA\'s annual carbon footprint?',
        options: [
          { text: 'A student turning off dorm lights', correct: false, explanation: 'Helpful, but tiny. A single LED bulb running 6 fewer hours/day for a year saves about 0.005 mtCO₂e.' },
          { text: 'One fewer round-trip flight per international student', correct: true, explanation: 'Right. 50 students × 1 round trip × ~2.93 mtCO₂e = 146 mtCO₂e/yr saved. The single highest-leverage individual lever in the entire dashboard.' },
          { text: 'Composting in the dining hall', correct: false, explanation: 'Real impact but smaller — maybe 10–24 mt/yr at full diversion. Still a fraction of the flight reduction.' },
        ],
      },
      {
        type: 'concept',
        heading: 'The biggest individual lever: travel',
        body: 'A long-haul economy round-trip flight from East Asia produces ~3 mtCO₂e per passenger. If 50 international students replace one trip with an extended on-campus stay (e.g., shoulder break), that\'s 146 mtCO₂e/yr — about 12% of KUA\'s entire net balance.',
      },
      {
        type: 'concept',
        heading: 'The biggest infrastructural lever: heat pumps',
        body: 'Replacing a single 6,000-gal/year oil boiler with a cold-climate heat pump (COP 2.5) saves ~38 mtCO₂e/yr per dorm. Across multiple buildings the numbers add up fast — and the New England grid means electrified heat is genuinely cleaner per BTU than oil.',
      },
      {
        type: 'concept',
        heading: 'The biggest sink lever: don\'t pave the forest',
        body: 'Each acre of forest converted to pavement releases ~500–2,000 mtCO₂e cumulatively over decades (standing biomass + soil carbon + lost future sequestration). Preventing even one such conversion is more valuable than years of dorm-electricity efficiency upgrades combined.',
      },
      {
        type: 'finish',
        heading: 'Magnitude matters',
        body: 'Action recommendations on this dashboard come with order-of-magnitude impact ranges so you can see what moves the needle. Open any scope page and click "Show data + math" on a lever to see the calculation.',
      },
    ],
  },
];

const styles = {
  wrap: { maxWidth: 880, margin: '0 auto', padding: '0 16px' },
  card: { background: 'linear-gradient(160deg, #0f172a 0%, #0b1220 100%)', border: '1px solid #1f2937', borderRadius: 16, padding: '32px 36px', borderLeft: '3px solid #06b6d4' },
  intro: { marginBottom: 24 },
  badge: { fontSize: 11, padding: '4px 10px', borderRadius: 4, background: '#155e75', color: '#a5f3fc', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700, border: '1px solid #0e7490', display: 'inline-block' },
  title: { fontSize: 28, fontWeight: 700, color: '#e5e7eb', marginTop: 14, lineHeight: 1.3 },
  introBody: { fontSize: 16, color: '#cbd5e1', marginTop: 12, lineHeight: 1.7 },
  pathGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginTop: 24 },
  pathCard: { padding: '20px 22px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10, cursor: 'pointer', textAlign: 'left', color: '#e5e7eb', transition: 'border-color 0.15s' },
  pathTitle: { fontSize: 17, fontWeight: 700, color: '#e5e7eb' },
  pathDesc: { fontSize: 13, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 },
  pathMeta: { fontSize: 11, color: '#64748b', marginTop: 10, textTransform: 'uppercase', letterSpacing: 0.8 },

  progressBar: { height: 4, background: '#1f2937', borderRadius: 2, overflow: 'hidden', marginBottom: 24 },
  progress: (pct) => ({ height: '100%', width: pct + '%', background: 'linear-gradient(90deg, #22d3ee, #3b82f6)', transition: 'width 0.3s' }),
  pathHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, fontSize: 13, color: '#94a3b8' },
  step: { minHeight: 240 },
  stepHeading: { fontSize: 22, fontWeight: 700, color: '#e5e7eb', lineHeight: 1.3 },
  stepBody: { fontSize: 16, color: '#cbd5e1', lineHeight: 1.8, marginTop: 14 },
  question: { fontSize: 18, fontWeight: 600, color: '#e5e7eb', marginBottom: 16, lineHeight: 1.4 },
  optionList: { display: 'grid', gap: 10 },
  option: (state) => ({
    padding: '14px 16px', background: state === 'correct' ? '#052e1a' : state === 'wrong' ? '#3a0d0d' : '#0b1220',
    border: `1px solid ${state === 'correct' ? '#14532d' : state === 'wrong' ? '#7f1d1d' : '#334155'}`,
    borderRadius: 8, color: state === 'correct' ? '#86efac' : state === 'wrong' ? '#fca5a5' : '#e5e7eb',
    cursor: state ? 'default' : 'pointer', fontSize: 15, fontWeight: 500, textAlign: 'left', transition: 'background 0.15s, border-color 0.15s',
  }),
  explanation: { marginTop: 14, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 },
  buttons: { marginTop: 28, display: 'flex', gap: 12, justifyContent: 'space-between' },
  primary: { padding: '10px 20px', background: '#06b6d4', color: '#0b1220', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  secondary: { padding: '10px 20px', background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', borderRadius: 6, fontSize: 14, cursor: 'pointer' },
  done: { padding: 28, background: '#052e1a', border: '1px solid #14532d', borderRadius: 12, textAlign: 'center', color: '#86efac' },
  doneTitle: { fontSize: 24, fontWeight: 700 },
  doneBody: { fontSize: 16, color: '#cbd5e1', marginTop: 12, lineHeight: 1.7 },
};

export function LearnAgent() {
  const [activePathId, setActivePathId] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [answer, setAnswer] = useState(null); // { idx, correct }

  const path = paths.find((p) => p.id === activePathId);
  const step = path && path.steps[stepIdx];
  const totalSteps = path ? path.steps.length : 0;
  const progress = path ? ((stepIdx + 1) / totalSteps) * 100 : 0;

  const startPath = (id) => { setActivePathId(id); setStepIdx(0); setAnswer(null); };
  const reset = () => { setActivePathId(null); setStepIdx(0); setAnswer(null); };
  const next = () => { setAnswer(null); setStepIdx((i) => i + 1); };
  const prev = () => { setAnswer(null); setStepIdx((i) => Math.max(0, i - 1)); };
  const choose = (i, opt) => { setAnswer({ idx: i, correct: opt.correct }); };

  // Path picker view
  if (!path) {
    return (
      <div style={styles.wrap}>
        <section style={styles.card}>
          <div style={styles.intro}>
            <span style={styles.badge}>AI learning agent</span>
            <h2 style={styles.title}>Hi — I'll walk you through the dashboard.</h2>
            <p style={styles.introBody}>
              Pick a path. Each is a short interactive lesson with a few quiz questions to make
              sure the ideas stick. Every claim is grounded in the same numbers the rest of the
              dashboard uses, so what you learn here matches what you see in the data.
            </p>
          </div>
          <div style={styles.pathGrid}>
            {paths.map((p) => (
              <button key={p.id} type="button" style={styles.pathCard} onClick={() => startPath(p.id)}>
                <div style={styles.pathTitle}>{p.title}</div>
                <div style={styles.pathDesc}>{p.desc}</div>
                <div style={styles.pathMeta}>{p.steps.length} steps · ~{p.estMin} min</div>
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 24, fontStyle: 'italic' }}>
            Currently rule-based — content is curated and the conversation is scripted. The
            architecture supports swapping to an LLM-driven free-form tutor in Phase 3.
          </p>
        </section>
      </div>
    );
  }

  // Lesson view
  return (
    <div style={styles.wrap}>
      <section style={styles.card}>
        <div style={styles.pathHeader}>
          <span><strong style={{ color: '#22d3ee' }}>{path.title}</strong> · step {stepIdx + 1} of {totalSteps}</span>
          <button type="button" style={styles.secondary} onClick={reset}>Pick another path</button>
        </div>
        <div style={styles.progressBar}><div style={styles.progress(progress)} /></div>

        <div style={styles.step}>
          {step.type === 'concept' && (
            <>
              <div style={styles.stepHeading}>{step.heading}</div>
              <p style={styles.stepBody}>{step.body}</p>
            </>
          )}
          {step.type === 'quiz' && (
            <>
              <div style={styles.question}>{step.question}</div>
              <div style={styles.optionList}>
                {step.options.map((opt, i) => {
                  let state = null;
                  if (answer) {
                    if (i === answer.idx) state = answer.correct ? 'correct' : 'wrong';
                    else if (opt.correct && answer && !answer.correct) state = 'correct';
                  }
                  return (
                    <button
                      key={i}
                      type="button"
                      style={styles.option(state)}
                      disabled={!!answer}
                      onClick={() => choose(i, opt)}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              {answer && (
                <div style={styles.explanation}>
                  <strong style={{ color: answer.correct ? '#86efac' : '#fbbf24' }}>
                    {answer.correct ? '✓ Correct.' : '— Not quite.'}
                  </strong>{' '}
                  {step.options[answer.idx].explanation}
                </div>
              )}
            </>
          )}
          {step.type === 'finish' && (
            <div style={styles.done}>
              <div style={styles.doneTitle}>{step.heading}</div>
              <p style={styles.doneBody}>{step.body}</p>
            </div>
          )}
        </div>

        <div style={styles.buttons}>
          <button type="button" style={styles.secondary} onClick={prev} disabled={stepIdx === 0}>
            ← Back
          </button>
          {stepIdx < totalSteps - 1 ? (
            <button
              type="button"
              style={styles.primary}
              onClick={next}
              disabled={step.type === 'quiz' && !answer}
            >
              {step.type === 'quiz' && !answer ? 'Pick an answer' : 'Continue →'}
            </button>
          ) : (
            <button type="button" style={styles.primary} onClick={reset}>
              Pick another path
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
