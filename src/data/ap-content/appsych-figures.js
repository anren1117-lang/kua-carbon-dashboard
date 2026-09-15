// AP Psychology — inline SVG figures.
import React from 'react';

const COL = {
  green: '#22c55e', cyan: '#22d3ee', amber: '#fbbf24', red: '#ef4444',
  slate: '#94a3b8', dim: '#475569', text: '#e5e7eb', textDim: '#cbd5e1',
  bgLight: '#0f172a',
};

// 1.5 Brain anatomy
const BrainAnatomy = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Major brain regions">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Brain anatomy — four lobes + key structures</text>
    {/* Brain outline */}
    <path d="M 150,160 Q 100,80 250,60 Q 400,40 500,100 Q 550,180 450,220 Q 300,250 200,230 Q 130,220 150,160 Z" fill={COL.dim} opacity="0.25" stroke={COL.text} strokeWidth="1.5" />
    {/* Frontal lobe */}
    <path d="M 150,160 Q 100,80 250,60 L 300,100 Q 250,150 200,170 Q 150,180 150,160 Z" fill={COL.cyan} opacity="0.4" />
    <text x="200" y="110" fill={COL.cyan} fontSize="11" fontWeight="700">Frontal</text>
    <text x="200" y="125" fill={COL.textDim} fontSize="9">planning, motor</text>
    {/* Parietal lobe */}
    <path d="M 250,60 Q 380,55 400,90 L 350,140 Q 300,130 280,90 Z" fill={COL.green} opacity="0.4" />
    <text x="320" y="90" fill={COL.green} fontSize="11" fontWeight="700">Parietal</text>
    <text x="320" y="105" fill={COL.textDim} fontSize="9">touch, spatial</text>
    {/* Temporal lobe */}
    <path d="M 200,170 Q 250,200 350,210 Q 350,180 300,170 Z" fill={COL.amber} opacity="0.4" />
    <text x="280" y="200" fill={COL.amber} fontSize="11" fontWeight="700">Temporal</text>
    <text x="280" y="215" fill={COL.textDim} fontSize="9">hearing</text>
    {/* Occipital lobe */}
    <path d="M 400,90 Q 500,100 480,180 Q 430,200 380,160 Q 380,120 400,90 Z" fill={COL.red} opacity="0.4" />
    <text x="440" y="140" fill={COL.red} fontSize="11" fontWeight="700">Occipital</text>
    <text x="440" y="155" fill={COL.textDim} fontSize="9">vision</text>
    {/* Cerebellum */}
    <ellipse cx="450" cy="220" rx="50" ry="22" fill="#7c3aed" opacity="0.4" />
    <text x="450" y="225" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="700">Cerebellum</text>
    <text x="300" y="270" textAnchor="middle" fill={COL.slate} fontSize="10">Limbic system (deep): thalamus, hypothalamus, hippocampus (memory), amygdala (fear/emotion).</text>
  </svg>
);

// 2.3 Atkinson-Shiffrin memory model
const MemoryModel = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Atkinson-Shiffrin three-stage memory model">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Memory: three-stage model</text>
    {[
      { x: 30, label: 'Sensory', detail: '< 1 sec', col: COL.cyan },
      { x: 220, label: 'Short-term', detail: '~20-30s, 7±2 items', col: COL.green },
      { x: 410, label: 'Long-term', detail: 'vast capacity, lifelong', col: COL.amber },
    ].map((s, i) => (
      <g key={i}>
        <rect x={s.x} y="70" width="160" height="120" rx="8" fill={s.col} opacity="0.18" stroke={s.col} strokeWidth="1.5" />
        <text x={s.x + 80} y="105" textAnchor="middle" fill={s.col} fontSize="14" fontWeight="700">{s.label}</text>
        <text x={s.x + 80} y="135" textAnchor="middle" fill={COL.text} fontSize="11">{s.detail}</text>
        {i < 2 && <line x1={s.x + 160} y1="130" x2={s.x + 220} y2="130" stroke={COL.slate} strokeWidth="2" markerEnd="url(#memArr)" />}
      </g>
    ))}
    <text x="125" y="225" textAnchor="middle" fill={COL.slate} fontSize="9">attention</text>
    <text x="315" y="225" textAnchor="middle" fill={COL.slate} fontSize="9">rehearsal / encoding</text>
    <defs>
      <marker id="memArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.slate} />
      </marker>
    </defs>
  </svg>
);

// 3.4-3.5 Classical vs Operant conditioning
const ConditioningComparison = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Classical vs operant conditioning">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Classical vs operant conditioning</text>
    <g>
      <text x="150" y="60" textAnchor="middle" fill={COL.cyan} fontSize="13" fontWeight="700">Classical (Pavlov)</text>
      <text x="20" y="90" fill={COL.text} fontSize="11">Bell + Food → Salivation</text>
      <text x="20" y="115" fill={COL.text} fontSize="11">↓ pairing repeated</text>
      <text x="20" y="140" fill={COL.text} fontSize="11">Bell alone → Salivation</text>
      <text x="20" y="170" fill={COL.textDim} fontSize="10">Learn by ASSOCIATION between</text>
      <text x="20" y="185" fill={COL.textDim} fontSize="10">two stimuli (involuntary response).</text>
    </g>
    <g>
      <text x="450" y="60" textAnchor="middle" fill={COL.green} fontSize="13" fontWeight="700">Operant (Skinner)</text>
      <text x="320" y="90" fill={COL.text} fontSize="11">Behavior → Consequence</text>
      <text x="320" y="115" fill={COL.text} fontSize="11">↓ repeated</text>
      <text x="320" y="140" fill={COL.text} fontSize="11">Behavior changes (more/less)</text>
      <text x="320" y="170" fill={COL.textDim} fontSize="10">Learn by CONSEQUENCES of voluntary</text>
      <text x="320" y="185" fill={COL.textDim} fontSize="10">behavior. Reinforce or punish.</text>
    </g>
    <line x1="300" y1="40" x2="300" y2="260" stroke={COL.dim} strokeDasharray="3 3" />
    <text x="300" y="248" textAnchor="middle" fill={COL.slate} fontSize="10">Both: extinction, generalization, spontaneous recovery.</text>
  </svg>
);

// 4.2 Milgram + Asch findings
const ConformityObedience = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Conformity and obedience classic studies">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Classic social psychology findings</text>
    <g>
      <rect x="30" y="60" width="250" height="150" rx="8" fill={COL.cyan} opacity="0.15" stroke={COL.cyan} />
      <text x="155" y="85" textAnchor="middle" fill={COL.cyan} fontSize="13" fontWeight="700">Asch (1951)</text>
      <text x="45" y="115" fill={COL.text} fontSize="11">Conformity to group:</text>
      <text x="45" y="140" fill={COL.amber} fontSize="22" fontWeight="700">75%</text>
      <text x="100" y="140" fill={COL.text} fontSize="11">conformed at least once</text>
      <text x="45" y="170" fill={COL.textDim} fontSize="10">Judging line lengths.</text>
      <text x="45" y="185" fill={COL.textDim} fontSize="10">Even on objective task.</text>
    </g>
    <g>
      <rect x="320" y="60" width="250" height="150" rx="8" fill={COL.red} opacity="0.15" stroke={COL.red} />
      <text x="445" y="85" textAnchor="middle" fill={COL.red} fontSize="13" fontWeight="700">Milgram (1961)</text>
      <text x="335" y="115" fill={COL.text} fontSize="11">Obedience to authority:</text>
      <text x="335" y="140" fill={COL.amber} fontSize="22" fontWeight="700">65%</text>
      <text x="395" y="140" fill={COL.text} fontSize="11">delivered max shock (450V)</text>
      <text x="335" y="170" fill={COL.textDim} fontSize="10">Despite hearing cries of pain.</text>
      <text x="335" y="185" fill={COL.textDim} fontSize="10">Power of authority context.</text>
    </g>
  </svg>
);

// 4.4 Big Five
const BigFive = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Big Five personality traits">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Big Five personality traits (OCEAN)</text>
    {[
      { letter: 'O', label: 'Openness', desc: 'curious, creative, open to new', col: COL.cyan },
      { letter: 'C', label: 'Conscientiousness', desc: 'organized, dependable, disciplined', col: COL.green },
      { letter: 'E', label: 'Extraversion', desc: 'sociable, energetic, assertive', col: COL.amber },
      { letter: 'A', label: 'Agreeableness', desc: 'cooperative, trusting, empathetic', col: '#a78bfa' },
      { letter: 'N', label: 'Neuroticism', desc: 'anxious, moody, emotionally reactive', col: COL.red },
    ].map((t, i) => (
      <g key={i}>
        <circle cx="80" cy={70 + i * 40} r="20" fill={t.col} opacity="0.85" />
        <text x="80" y={75 + i * 40} textAnchor="middle" fill="#0b1220" fontSize="16" fontWeight="700">{t.letter}</text>
        <text x="110" y={68 + i * 40} fill={t.col} fontSize="13" fontWeight="700">{t.label}</text>
        <text x="110" y={84 + i * 40} fill={COL.textDim} fontSize="11">{t.desc}</text>
      </g>
    ))}
    <text x="300" y="265" textAnchor="middle" fill={COL.slate} fontSize="10">Five-factor model. Each trait is a continuum, not a category.</text>
  </svg>
);

export const APPSYCH_FIGURES = {
  '1.5': [{ id: 'brain', Cmp: BrainAnatomy, caption: 'Major brain regions: four cortical lobes plus cerebellum, brainstem, limbic system.', source: 'KUA Carbon Dashboard · authored' }],
  '2.3': [{ id: 'mem', Cmp: MemoryModel, caption: 'Atkinson-Shiffrin three-stage memory model: sensory → short-term → long-term.', source: 'Atkinson & Shiffrin 1968' }],
  '3.4': [{ id: 'cond', Cmp: ConditioningComparison, caption: 'Classical (associate stimuli) vs operant (consequences shape behavior).', source: 'KUA Carbon Dashboard · authored' }],
  '4.2': [{ id: 'asch', Cmp: ConformityObedience, caption: 'Classic findings on conformity (Asch) and obedience (Milgram).', source: 'Asch 1951, Milgram 1961' }],
  '4.4': [{ id: 'big5', Cmp: BigFive, caption: 'Big Five traits (OCEAN) — most empirically supported personality model.', source: 'McCrae & Costa 1985' }],
};
