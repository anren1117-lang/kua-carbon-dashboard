import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { Icon } from '../components/Icon.js';

// /carbon-math — interactive carbon-arithmetic practice for
// classroom use. Each question has a real-world setup ("KUA uses
// 5M kWh/yr at 0.234 kg/kWh — what's annual Scope 2 in mt?"),
// shows the answer, exposes the math.
//
// Designed to be embedded in a single class period: teacher
// projects, students work problems, click "show work" to reveal
// the reasoning. Difficulty range: middle-school arithmetic to
// AP-statistics-friendly methodology + uncertainty problems.

const QUESTIONS = [
  {
    id: 'q1',
    level: 'intro',
    setup: 'KUA used about 1,660,000 kWh of grid electricity last year. ISO New England\'s emissions factor is 0.234 kg CO₂ per kWh. What is KUA\'s Scope 2 footprint in metric tons of CO₂?',
    answer: 389,
    unit: 'mtCO₂e',
    tolerance: 0.05, // ±5%
    work: [
      '1,660,000 kWh × 0.234 kg/kWh = 388,440 kg CO₂',
      '388,440 kg ÷ 1,000 ≈ 389 mtCO₂e — the figure /scope-2 publishes.',
      'Why divide: 1,000 kg = 1 metric ton. We always report institutional footprints in metric tons.',
    ],
  },
  {
    id: 'q2',
    level: 'intro',
    setup: 'A 10-person dorm uses about 4,800 kWh per resident per year. What\'s the dorm\'s total annual electricity use?',
    answer: 48000,
    unit: 'kWh',
    tolerance: 0.01,
    work: [
      '10 residents × 4,800 kWh/resident/year = 48,000 kWh/year',
      'Per-resident vs total: per-resident is the fair comparison across dorms; total is what shows up on the BMS.',
    ],
  },
  {
    id: 'q3',
    level: 'intro',
    setup: 'One round-trip international flight is about 3.7 mtCO₂e (the cohort-weighted figure this dashboard uses). KUA has roughly 50 international students, each flying home once per year. What\'s the total flight footprint?',
    answer: 185,
    unit: 'mtCO₂e',
    tolerance: 0.05,
    work: [
      '50 students × 1 round trip × 3.7 mt = 185 mtCO₂e',
      'Why this dominates: that is 3.7 mt from a single journey — close to a quarter of a US adult\'s ENTIRE annual footprint (~16 mt), and more than the 2 mt a Paris-aligned lifestyle allows for a whole year.',
    ],
  },
  {
    id: 'q4',
    level: 'standard',
    setup: 'Heating oil emits 10.21 kg CO₂ per gallon (EPA factor). If KUA Facilities delivered 130,000 gallons of heating oil this year, what\'s the Scope 1 contribution from heating oil in mt?',
    answer: 1327,
    unit: 'mtCO₂e',
    tolerance: 0.05,
    work: [
      '130,000 gal × 10.21 kg/gal = 1,327,300 kg CO₂',
      '1,327,300 kg ÷ 1,000 = ~1,327 mtCO₂e',
      'Factor source: EPA GHG Emission Factors Hub 2025, "Stationary Combustion" table, Distillate Fuel Oil No. 2.',
    ],
  },
  {
    id: 'q5',
    level: 'standard',
    setup: 'A 1,000-acre forest sequesters roughly 2.1 mtCO₂e per acre per year (Birdsey 1992 default for US closed-canopy forest). What\'s KUA\'s annual forest drawdown?',
    answer: 2100,
    unit: 'mtCO₂e',
    tolerance: 0.05,
    work: [
      '1,000 acres × 2.1 mt/acre/yr = 2,100 mtCO₂e/yr',
      'Why this matters: at this flat rate the forest offsets a large share of KUA\'s ~4,375 mt gross — but not all of it: 4,375 − 2,100 = 2,275 mt net. The dashboard does not use the flat rate; it adopts the per-stand inventory of 1,829 mt, which gives the ~2,546 mt it publishes. Either way KUA is NOT net-negative — the sink makes the number much smaller, not negative.',
    ],
  },
  {
    id: 'q6',
    level: 'standard',
    setup: 'KUA installs a 250 kW solar array. At NH\'s typical capacity factor of 1,300 kWh per kW per year, how many kWh does the array generate annually?',
    answer: 325000,
    unit: 'kWh/yr',
    tolerance: 0.02,
    work: [
      '250 kW × 1,300 kWh/kW/yr = 325,000 kWh/yr',
      'Solar size note: capacity factor in NH is ~15% (1,300/8760 hours per year). California gets ~20%, Arizona ~25%.',
    ],
  },
  {
    id: 'q7',
    level: 'ap',
    setup: 'A heat pump with a COP (coefficient of performance) of 3.0 replaces an oil boiler that delivered 100 million BTU of heat. 1 kWh = 3,412 BTU. How many kWh of electricity does the heat pump need to deliver the same heat?',
    answer: 9770,
    unit: 'kWh',
    tolerance: 0.05,
    work: [
      'Step 1: Convert BTU → kWh of HEAT delivered: 100,000,000 ÷ 3,412 = 29,308 kWh of heat',
      'Step 2: With COP 3, electricity needed = heat delivered ÷ COP: 29,308 ÷ 3 = 9,769 kWh',
      'Why COP matters: each kWh of electricity in produces 3 kWh of heat out. That\'s why heat pumps cut emissions even with grid electricity — you need 3× less energy in total.',
    ],
  },
  {
    id: 'q8',
    level: 'ap',
    setup: 'KUA\'s gross emissions are reported as 4,375 ± 200 mtCO₂e (one standard deviation). Sinks are adopted at 1,829 mtCO₂e, but the four published methods span 1,000–2,100 — treat the half-range, ±550, as one standard deviation. What is the standard deviation of the net (gross − sinks), assuming independent errors?',
    answer: 849,
    unit: 'mtCO₂e',
    tolerance: 0.05,
    work: [
      'For independent errors, variances add: σ_net² = σ_gross² + σ_sinks²',
      'σ_gross² = 200² = 40,000',
      'σ_sinks² = 825² = 680,625',
      'σ_net² = 720,625 → σ_net = √720,625 ≈ 849 mtCO₂e',
      'Why this matters: the NET number has a wider uncertainty band than EITHER input — and here the SINK uncertainty swamps everything else. ±550 against ±200 means the forest estimate alone decides the answer, which is exactly why a real forest inventory is the highest-value measurement KUA could make. Net is 4,375 − 1,829 = 2,546, so "net 2,546 ± 585 mt" is honest; "net 2,546 mt" flat is not. The sink spread narrowed when the rates moved to a net basis in 2026; it ran 1,000–2,650 before that.',
    ],
  },
];

const LEVEL_COLORS = {
  intro: { bg: '#052e1a', fg: '#86efac', border: '#14532d' },
  standard: { bg: '#0c2a3a', fg: '#67e8f9', border: '#0e7490' },
  ap: { bg: '#3a1d52', fg: '#c4b5fd', border: '#6d28d9' },
};

export default function CarbonMath() {
  return (
    <ModulePage
      title="Carbon math practice"
      subtitle="Eight real questions students might be asked in chem, bio, physics, or statistics class — all using KUA-specific numbers and EPA / IPCC / NREL factors. Type your answer, click 'Check', click 'Show work' for the step-by-step. Designed for classroom use."
      toolbar={
        <button
          type="button"
          onClick={() => window.print()}
          style={styles.printBtn}
          title="Print as a worksheet"
        >
          🖨 Print as worksheet
        </button>
      }
    >
      <ModuleSection title="Difficulty levels" hint="">
        <div style={styles.legend}>
          <Pill kind="good">Intro</Pill>
          <span style={styles.legendText}>arithmetic + unit conversions — middle school +</span>
          <Pill kind="info">Standard</Pill>
          <span style={styles.legendText}>real KUA-data calculations — high school</span>
          <Pill kind="neutral">AP</Pill>
          <span style={styles.legendText}>methodology + uncertainty propagation — AP chem / bio / physics / stats</span>
        </div>
      </ModuleSection>

      {QUESTIONS.map((q, i) => (
        <QuestionCard key={q.id} q={q} num={i + 1} />
      ))}

      <ModuleSection title="Want more?" hint="">
        <p style={styles.footer}>
          The <Link to="/learn" style={styles.link}>Learn portal</Link> has eight short paths
          with quizzes — Intro paths for any grade, Standard paths with KUA's specific data, and
          AP-level deep dives. Teachers can assign + see results via
          the <Link to="/teacher" style={styles.link}>Teacher portal</Link>.
        </p>
        <p style={styles.footer}>
          Every factor used here is cited on the
          {' '}<Link to="/methodology" style={styles.link}>Methodology page</Link>.
        </p>
      </ModuleSection>
    </ModulePage>
  );
}

function QuestionCard({ q, num }) {
  const [guess, setGuess] = useState('');
  const [checked, setChecked] = useState(false);
  const [showWork, setShowWork] = useState(false);

  const guessNum = parseFloat(guess.replace(/,/g, ''));
  const isClose = Number.isFinite(guessNum)
    && Math.abs(guessNum - q.answer) / q.answer <= q.tolerance;
  const isClicked = checked && Number.isFinite(guessNum);

  const levelColor = LEVEL_COLORS[q.level] || LEVEL_COLORS.intro;

  function reset() {
    setGuess('');
    setChecked(false);
    setShowWork(false);
  }

  return (
    <ModuleSection
      title={`Question ${num}`}
      hint=""
    >
      <div style={styles.q} className="kua-card-hover">
        <div style={styles.qHead}>
          <Pill kind={q.level === 'intro' ? 'good' : q.level === 'standard' ? 'info' : 'neutral'}>
            {q.level === 'intro' ? 'Intro' : q.level === 'standard' ? 'Standard' : 'AP'}
          </Pill>
        </div>
        <p style={styles.qSetup}>{q.setup}</p>
        <div style={styles.qAnswerRow}>
          <input
            type="text"
            inputMode="decimal"
            value={guess}
            onChange={(e) => { setGuess(e.target.value); setChecked(false); }}
            placeholder="Your answer"
            style={styles.qInput}
            disabled={isClicked && isClose}
            onKeyDown={(e) => { if (e.key === 'Enter') setChecked(true); }}
          />
          <span style={styles.qUnit}>{q.unit}</span>
          {!isClicked || !isClose ? (
            <button type="button" onClick={() => setChecked(true)} style={styles.qCheckBtn}>
              Check
            </button>
          ) : (
            <button type="button" onClick={reset} style={styles.qResetBtn}>
              Try again
            </button>
          )}
          <button type="button" onClick={() => setShowWork((v) => !v)} style={styles.qWorkBtn}>
            {showWork ? 'Hide work' : 'Show work'}
          </button>
        </div>
        {isClicked && (
          <div style={isClose ? styles.qFeedbackGood : styles.qFeedbackBad}>
            {isClose
              ? `✓ Correct! Answer: ${q.answer.toLocaleString()} ${q.unit}`
              : `Not quite — you said ${guessNum.toLocaleString()} ${q.unit}, expected ${q.answer.toLocaleString()} ${q.unit} (within ±${(q.tolerance * 100).toFixed(0)}%). Click "Show work" to see how.`}
          </div>
        )}
        {showWork && (
          <ol style={styles.qWork} className="kua-faq-answer">
            {q.work.map((line, i) => (
              <li key={i} style={styles.qWorkStep}>{line}</li>
            ))}
          </ol>
        )}
      </div>
    </ModuleSection>
  );
}

const styles = {
  printBtn: { padding: '8px 14px', background: '#0e7490', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' },

  legend: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', fontSize: 13, color: '#94a3b8' },
  legendText: { marginRight: 12 },

  q: { padding: '18px 20px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  qHead: { marginBottom: 12 },
  qSetup: { fontSize: 15, color: '#cbd5e1', lineHeight: 1.7, margin: 0, marginBottom: 14 },

  qAnswerRow: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  qInput: { padding: '10px 14px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontSize: 16, fontFamily: 'inherit', width: 160, fontVariantNumeric: 'tabular-nums' },
  qUnit: { fontSize: 14, color: '#94a3b8', fontWeight: 600 },
  qCheckBtn: { padding: '10px 18px', background: '#0e7490', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  qResetBtn: { padding: '10px 18px', background: '#0b1220', color: '#22d3ee', border: '1px solid #22d3ee', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  qWorkBtn: { padding: '10px 18px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 6, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' },

  qFeedbackGood: { marginTop: 14, padding: '10px 14px', background: '#052e16', border: '1px solid #14532d', borderRadius: 6, color: '#86efac', fontSize: 14, fontWeight: 700 },
  qFeedbackBad:  { marginTop: 14, padding: '10px 14px', background: '#3a2a0d', border: '1px solid #92400e', borderRadius: 6, color: '#fcd34d', fontSize: 14 },

  qWork: { marginTop: 14, paddingLeft: 22, fontSize: 14, color: '#cbd5e1', lineHeight: 1.8 },
  qWorkStep: { marginBottom: 8 },

  footer: { fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: '8px 0' },
  link: { color: '#22d3ee', textDecoration: 'none', fontWeight: 700 },
};
