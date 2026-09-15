// AP Statistics — inline SVG figures.

import React from 'react';

const COL = {
  green: '#22c55e',
  cyan: '#22d3ee',
  amber: '#fbbf24',
  red: '#ef4444',
  slate: '#94a3b8',
  dim: '#475569',
  text: '#e5e7eb',
  textDim: '#cbd5e1',
  bgLight: '#0f172a',
};

// 1.4 Histogram + boxplot
const HistogramBoxplot = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Histogram and boxplot of a distribution">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Right-skewed distribution: histogram + boxplot</text>
    {/* Histogram bars */}
    {[
      { x: 80, h: 100 }, { x: 145, h: 120 }, { x: 210, h: 80 },
      { x: 275, h: 50 }, { x: 340, h: 30 }, { x: 405, h: 18 },
      { x: 470, h: 12 }, { x: 530, h: 8 },
    ].map((b, i) => (
      <rect key={i} x={b.x} y={170 - b.h} width="55" height={b.h} fill={COL.cyan} opacity="0.7" stroke={COL.cyan} />
    ))}
    {/* Axes */}
    <line x1="80" y1="170" x2="585" y2="170" stroke={COL.dim} />
    <text x="320" y="190" textAnchor="middle" fill={COL.slate} fontSize="10">value →</text>
    {/* Boxplot */}
    <line x1="130" y1="220" x2="330" y2="220" stroke={COL.text} strokeWidth="1" />
    <rect x="130" y="210" width="120" height="20" fill="none" stroke={COL.green} strokeWidth="2" />
    <line x1="180" y1="210" x2="180" y2="230" stroke={COL.green} strokeWidth="2" />
    <line x1="80" y1="220" x2="130" y2="220" stroke={COL.text} strokeWidth="1" />
    <line x1="250" y1="220" x2="330" y2="220" stroke={COL.text} strokeWidth="1" />
    <circle cx="430" cy="220" r="4" fill={COL.red} />
    <circle cx="510" cy="220" r="4" fill={COL.red} />
    <text x="60" y="225" textAnchor="end" fill={COL.slate} fontSize="10">min</text>
    <text x="180" y="248" textAnchor="middle" fill={COL.green} fontSize="10">median</text>
    <text x="430" y="240" textAnchor="middle" fill={COL.red} fontSize="9">outliers</text>
    <text x="300" y="270" textAnchor="middle" fill={COL.slate} fontSize="10">Right-skew: mean &gt; median; long right tail; outliers beyond Q3 + 1.5·IQR</text>
  </svg>
);

// 1.9 Normal distribution + 68-95-99.7
const NormalCurve = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Normal distribution and empirical rule">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Normal distribution and the 68-95-99.7 rule</text>
    {/* Bell curve */}
    <path d="M 50,200 Q 150,200 200,180 Q 250,140 300,40 Q 350,140 400,180 Q 450,200 550,200" stroke={COL.cyan} strokeWidth="2.5" fill="rgba(34,211,238,0.1)" />
    <line x1="50" y1="200" x2="550" y2="200" stroke={COL.dim} />
    {/* Vertical lines at ±1, ±2, ±3 */}
    {[
      { x: 200, label: 'μ - σ' }, { x: 300, label: 'μ' }, { x: 400, label: 'μ + σ' },
      { x: 150, label: 'μ - 2σ' }, { x: 450, label: 'μ + 2σ' },
      { x: 100, label: 'μ - 3σ' }, { x: 500, label: 'μ + 3σ' },
    ].map((p, i) => (
      <g key={i}>
        <line x1={p.x} y1="200" x2={p.x} y2="210" stroke={COL.text} strokeWidth="1" />
        <text x={p.x} y="225" textAnchor="middle" fill={COL.slate} fontSize="9">{p.label}</text>
      </g>
    ))}
    {/* 68% inner */}
    <text x="300" y="100" textAnchor="middle" fill={COL.green} fontSize="13" fontWeight="700">~68%</text>
    <text x="300" y="120" textAnchor="middle" fill={COL.slate} fontSize="10">μ ± σ</text>
    {/* 95% */}
    <text x="170" y="170" textAnchor="middle" fill={COL.cyan} fontSize="10">~95% within μ ± 2σ</text>
    {/* 99.7% */}
    <text x="500" y="170" textAnchor="middle" fill={COL.amber} fontSize="10">~99.7% within μ ± 3σ</text>
  </svg>
);

// 5.6 Central Limit Theorem
const CLTDemo = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Central Limit Theorem">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">CLT: sampling distribution of x̄ becomes normal</text>
    {/* Population (uniform) */}
    <text x="100" y="60" textAnchor="middle" fill={COL.cyan} fontSize="11" fontWeight="700">Population (uniform)</text>
    <rect x="50" y="80" width="100" height="70" fill={COL.dim} opacity="0.4" stroke={COL.dim} />
    {/* Arrow */}
    <line x1="160" y1="115" x2="220" y2="115" stroke={COL.text} markerEnd="url(#cltArr)" />
    <text x="190" y="105" textAnchor="middle" fill={COL.slate} fontSize="9">n = 5</text>
    {/* n=5 */}
    <text x="280" y="60" textAnchor="middle" fill={COL.green} fontSize="11" fontWeight="700">Sample mean</text>
    <text x="280" y="74" textAnchor="middle" fill={COL.slate} fontSize="10">(n = 5)</text>
    <path d="M 230,150 Q 260,100 280,90 Q 300,100 330,150 z" fill={COL.green} opacity="0.4" stroke={COL.green} />
    {/* Arrow */}
    <line x1="340" y1="115" x2="400" y2="115" stroke={COL.text} markerEnd="url(#cltArr)" />
    <text x="370" y="105" textAnchor="middle" fill={COL.slate} fontSize="9">n = 30</text>
    {/* n=30 */}
    <text x="465" y="60" textAnchor="middle" fill={COL.amber} fontSize="11" fontWeight="700">Sample mean</text>
    <text x="465" y="74" textAnchor="middle" fill={COL.slate} fontSize="10">(n = 30): normal</text>
    <path d="M 410,150 Q 440,85 465,75 Q 490,85 520,150 z" fill={COL.amber} opacity="0.5" stroke={COL.amber} />
    <text x="300" y="200" textAnchor="middle" fill={COL.cyan} fontSize="11">As n grows, sampling distribution of x̄ approaches normal</text>
    <text x="300" y="220" textAnchor="middle" fill={COL.slate} fontSize="10">Mean = μ; SD = σ/√n. Works for ANY population shape with large n.</text>
    <defs>
      <marker id="cltArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.text} />
      </marker>
    </defs>
  </svg>
);

// 2.3 Scatter with regression line
const ScatterRegression = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Scatter plot with regression line">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Scatter plot and least-squares regression line</text>
    {/* Axes */}
    <line x1="60" y1="220" x2="540" y2="220" stroke={COL.dim} />
    <line x1="60" y1="40" x2="60" y2="220" stroke={COL.dim} />
    {/* Points */}
    {[
      [80, 200], [120, 175], [160, 180], [200, 150], [240, 145],
      [280, 130], [320, 115], [360, 100], [400, 90], [440, 70], [480, 80], [520, 50],
    ].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill={COL.cyan} />)}
    {/* Regression line */}
    <line x1="60" y1="210" x2="540" y2="55" stroke={COL.amber} strokeWidth="2.5" />
    {/* Labels */}
    <text x="300" y="245" textAnchor="middle" fill={COL.slate} fontSize="11">x (e.g., hours studied)</text>
    <text x="35" y="130" fill={COL.slate} fontSize="11" textAnchor="middle" transform="rotate(-90, 35, 130)">y (test score)</text>
    <text x="500" y="50" fill={COL.amber} fontSize="11" fontWeight="700">ŷ = a + bx</text>
    <text x="350" y="170" fill={COL.green} fontSize="11" fontWeight="700">r ≈ 0.85 (strong +)</text>
  </svg>
);

// 6 / 7 / 8 Hypothesis test workflow
const HypothesisWorkflow = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Hypothesis testing workflow">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Hypothesis testing — four steps</text>
    {[
      { x: 20,  label: '1. State', note: 'H₀ and Hₐ in symbols + context', col: COL.cyan },
      { x: 170, label: '2. Plan', note: 'Check conditions; identify test', col: COL.green },
      { x: 320, label: '3. Do', note: 'Compute test statistic + p-value', col: COL.amber },
      { x: 470, label: '4. Conclude', note: 'Compare p to α; interpret', col: COL.red },
    ].map((s, i) => (
      <g key={i}>
        <rect x={s.x} y="60" width="120" height="120" rx="8" fill={s.col} opacity="0.15" stroke={s.col} strokeWidth="1.5" />
        <text x={s.x + 60} y="90" textAnchor="middle" fill={s.col} fontSize="13" fontWeight="700">{s.label}</text>
        <text x={s.x + 60} y="120" textAnchor="middle" fill={COL.text} fontSize="10">{s.note.split(' ').slice(0, 4).join(' ')}</text>
        <text x={s.x + 60} y="138" textAnchor="middle" fill={COL.text} fontSize="10">{s.note.split(' ').slice(4).join(' ')}</text>
        {i < 3 && <line x1={s.x + 120} y1="120" x2={s.x + 168} y2="120" stroke={COL.slate} strokeWidth="2" markerEnd="url(#hyArr)" />}
      </g>
    ))}
    <text x="300" y="210" textAnchor="middle" fill={COL.slate} fontSize="10">If p ≤ α: REJECT H₀.  If p &gt; α: fail to reject (NOT same as "accept H₀").</text>
    <defs>
      <marker id="hyArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.slate} />
      </marker>
    </defs>
  </svg>
);

// 4.9 Binomial distribution
const BinomialPMF = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Binomial distribution B(10, 0.5)">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Binomial distribution B(n=10, p=0.5)</text>
    {/* Bars */}
    {[
      { k: 0,  h: 5 }, { k: 1, h: 20 }, { k: 2, h: 50 }, { k: 3, h: 90 },
      { k: 4, h: 130 }, { k: 5, h: 150 }, { k: 6, h: 130 }, { k: 7, h: 90 },
      { k: 8, h: 50 }, { k: 9, h: 20 }, { k: 10, h: 5 },
    ].map((b, i) => (
      <g key={i}>
        <rect x={60 + b.k * 45} y={200 - b.h} width="40" height={b.h} fill={COL.green} opacity="0.7" stroke={COL.green} />
        <text x={80 + b.k * 45} y="218" textAnchor="middle" fill={COL.slate} fontSize="10">{b.k}</text>
      </g>
    ))}
    <line x1="50" y1="200" x2="565" y2="200" stroke={COL.dim} />
    <text x="300" y="240" textAnchor="middle" fill={COL.slate} fontSize="11">k = number of successes</text>
    <text x="300" y="255" textAnchor="middle" fill={COL.slate} fontSize="10">μ = np = 5;  σ = √(np(1-p)) = √2.5 ≈ 1.58</text>
  </svg>
);

export const APSTATS_FIGURES = {
  '1.4': [{ id: 'hist', Cmp: HistogramBoxplot, caption: 'Histogram and boxplot showing a right-skewed distribution with outliers.', source: 'KUA Carbon Dashboard · authored' }],
  '1.9': [{ id: 'normal', Cmp: NormalCurve, caption: 'Normal distribution and the 68-95-99.7 empirical rule.', source: 'KUA Carbon Dashboard · authored' }],
  '2.3': [{ id: 'scatter', Cmp: ScatterRegression, caption: 'Strong positive linear association with least-squares regression line.', source: 'KUA Carbon Dashboard · authored' }],
  '4.9': [{ id: 'binom', Cmp: BinomialPMF, caption: 'Binomial probability distribution B(10, 0.5): symmetric, peaked at np = 5.', source: 'KUA Carbon Dashboard · authored' }],
  '5.6': [{ id: 'clt', Cmp: CLTDemo, caption: 'Central Limit Theorem: sampling distribution of x̄ approaches normal as n grows.', source: 'KUA Carbon Dashboard · authored' }],
  '6.4': [{ id: 'htest', Cmp: HypothesisWorkflow, caption: 'Four-step hypothesis testing workflow.', source: 'KUA Carbon Dashboard · authored' }],
};
