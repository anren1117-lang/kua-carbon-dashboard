// AP Calculus AB — inline SVG figures.
import React from 'react';

const COL = {
  green: '#22c55e', cyan: '#22d3ee', amber: '#fbbf24', red: '#ef4444',
  slate: '#94a3b8', dim: '#475569', text: '#e5e7eb', textDim: '#cbd5e1',
  bgLight: '#0f172a',
};

// 2.2 Derivative as slope of tangent
const DerivativeTangent = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Derivative as slope of tangent line">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Derivative = slope of tangent line</text>
    {/* Axes */}
    <line x1="60" y1="240" x2="540" y2="240" stroke={COL.dim} />
    <line x1="60" y1="40" x2="60" y2="240" stroke={COL.dim} />
    {/* Curve y = x² (scaled) */}
    <path d="M 80,225 Q 200,160 300,90 Q 400,30 500,60" stroke={COL.cyan} strokeWidth="2.5" fill="none" />
    {/* Point */}
    <circle cx="300" cy="90" r="5" fill={COL.amber} />
    <text x="312" y="86" fill={COL.amber} fontSize="11" fontWeight="700">(a, f(a))</text>
    {/* Tangent line */}
    <line x1="180" y1="160" x2="420" y2="20" stroke={COL.green} strokeWidth="2" />
    <text x="420" y="35" fill={COL.green} fontSize="11" fontWeight="700">Tangent line</text>
    <text x="180" y="180" fill={COL.green} fontSize="10">slope = f\'(a)</text>
    {/* Secant for comparison */}
    <line x1="200" y1="180" x2="420" y2="50" stroke={COL.slate} strokeWidth="1" strokeDasharray="4 3" />
    <text x="200" y="200" fill={COL.slate} fontSize="10">secant (avg rate)</text>
    <text x="300" y="265" textAnchor="middle" fill={COL.slate} fontSize="10">As h → 0, secant → tangent. f\'(a) = lim [f(a+h) - f(a)]/h.</text>
  </svg>
);

// 5.4 Concavity and inflection
const ConcavityChart = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Concavity and inflection points">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Concavity from second derivative</text>
    {/* Two examples side by side */}
    {/* Concave up */}
    <g>
      <text x="150" y="60" textAnchor="middle" fill={COL.green} fontSize="12" fontWeight="700">Concave up: f\'\' &gt; 0</text>
      <path d="M 50,180 Q 150,80 250,180" stroke={COL.green} strokeWidth="2.5" fill="none" />
      <text x="150" y="220" textAnchor="middle" fill={COL.slate} fontSize="10">"cup" shape</text>
    </g>
    {/* Concave down */}
    <g>
      <text x="450" y="60" textAnchor="middle" fill={COL.red} fontSize="12" fontWeight="700">Concave down: f\'\' &lt; 0</text>
      <path d="M 350,180 Q 450,80 550,180" stroke={COL.red} strokeWidth="2.5" fill="none" transform="translate(0,80) scale(1,-1) translate(0,-200)" />
      <text x="450" y="220" textAnchor="middle" fill={COL.slate} fontSize="10">"cap" shape</text>
    </g>
    <text x="300" y="245" textAnchor="middle" fill={COL.slate} fontSize="10">Inflection point: concavity changes (f\'\' changes sign).</text>
  </svg>
);

// 6.4 FTC visualization
const FTC = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Fundamental Theorem of Calculus">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Fundamental Theorem of Calculus</text>
    {/* Axes */}
    <line x1="60" y1="220" x2="540" y2="220" stroke={COL.dim} />
    <line x1="60" y1="60" x2="60" y2="220" stroke={COL.dim} />
    {/* Curve */}
    <path d="M 60,200 Q 180,150 300,110 Q 420,80 540,70" stroke={COL.cyan} strokeWidth="2.5" fill="none" />
    {/* Shaded area */}
    <path d="M 120,220 L 120,180 Q 240,140 400,90 L 400,220 Z" fill={COL.amber} opacity="0.35" />
    {/* a and b */}
    <line x1="120" y1="220" x2="120" y2="230" stroke={COL.text} />
    <text x="120" y="245" textAnchor="middle" fill={COL.text} fontSize="11">a</text>
    <line x1="400" y1="220" x2="400" y2="230" stroke={COL.text} />
    <text x="400" y="245" textAnchor="middle" fill={COL.text} fontSize="11">b</text>
    {/* Formula */}
    <text x="300" y="265" textAnchor="middle" fill={COL.green} fontSize="13" fontWeight="700">∫_a^b f(x) dx = F(b) - F(a)</text>
    <text x="260" y="155" fill={COL.amber} fontSize="11" fontWeight="700">area under f(x)</text>
  </svg>
);

// 7.4 Exponential vs logistic
const ExpVsLogistic = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Exponential vs logistic growth">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Exponential vs logistic growth</text>
    <line x1="60" y1="220" x2="540" y2="220" stroke={COL.dim} />
    <line x1="60" y1="40" x2="60" y2="220" stroke={COL.dim} />
    {/* Carrying capacity line */}
    <line x1="60" y1="80" x2="540" y2="80" stroke={COL.amber} strokeWidth="1" strokeDasharray="4 3" />
    <text x="540" y="76" textAnchor="end" fill={COL.amber} fontSize="11">Carrying capacity K</text>
    {/* Exponential curve */}
    <path d="M 60,220 Q 300,210 460,80 Q 480,60 500,40" stroke={COL.red} strokeWidth="2.5" fill="none" />
    <text x="460" y="60" fill={COL.red} fontSize="11" fontWeight="700">Exponential</text>
    <text x="460" y="76" fill={COL.red} fontSize="9">dy/dt = ky</text>
    {/* Logistic curve */}
    <path d="M 60,220 Q 200,215 260,170 Q 320,90 400,85 Q 480,82 540,80" stroke={COL.green} strokeWidth="2.5" fill="none" />
    <text x="240" y="155" fill={COL.green} fontSize="11" fontWeight="700">Logistic</text>
    <text x="240" y="172" fill={COL.green} fontSize="9">dy/dt = kP(1-P/K)</text>
    <text x="300" y="248" textAnchor="middle" fill={COL.slate} fontSize="10">Logistic levels off at K; exponential grows unbounded.</text>
  </svg>
);

// 8.4 Volume of revolution disk
const DiskMethod = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Disk method for volume">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Volume by disk method: V = π ∫ [f(x)]² dx</text>
    {/* x-axis */}
    <line x1="60" y1="160" x2="540" y2="160" stroke={COL.dim} />
    {/* Curve */}
    <path d="M 60,160 Q 200,100 380,80 L 500,80" stroke={COL.cyan} strokeWidth="2" fill="none" />
    {/* Mirror below x-axis */}
    <path d="M 60,160 Q 200,220 380,240 L 500,240" stroke={COL.cyan} strokeWidth="2" fill="none" opacity="0.4" />
    {/* Filled solid */}
    <path d="M 60,160 Q 200,100 380,80 L 500,80 L 500,240 L 380,240 Q 200,220 60,160 Z" fill={COL.cyan} opacity="0.18" />
    {/* Disk slice */}
    <ellipse cx="300" cy="95" rx="6" ry="40" fill={COL.amber} stroke={COL.amber} strokeWidth="2" />
    <ellipse cx="300" cy="225" rx="6" ry="40" fill={COL.amber} stroke={COL.amber} strokeWidth="2" opacity="0.5" />
    <line x1="300" y1="95" x2="300" y2="225" stroke={COL.amber} strokeWidth="1" />
    <text x="320" y="160" fill={COL.amber} fontSize="11">disk radius = f(x)</text>
    <text x="300" y="270" textAnchor="middle" fill={COL.slate} fontSize="10">Each cross-section perpendicular to x-axis is a circle of radius f(x).</text>
  </svg>
);

export const APCALCAB_FIGURES = {
  '2.2': [{ id: 'tangent', Cmp: DerivativeTangent, caption: 'Derivative as slope of tangent — the limit of secant slopes as h → 0.', source: 'KUA Carbon Dashboard · authored' }],
  '5.4': [{ id: 'concavity', Cmp: ConcavityChart, caption: 'f\'\' > 0: concave up (cup). f\'\' < 0: concave down (cap).', source: 'KUA Carbon Dashboard · authored' }],
  '6.4': [{ id: 'ftc', Cmp: FTC, caption: 'Fundamental Theorem: integral = F(b) - F(a) where F is antiderivative.', source: 'KUA Carbon Dashboard · authored' }],
  '7.4': [{ id: 'explog', Cmp: ExpVsLogistic, caption: 'Exponential grows unbounded; logistic levels off at carrying capacity K.', source: 'KUA Carbon Dashboard · authored' }],
  '8.4': [{ id: 'disk', Cmp: DiskMethod, caption: 'Volume of revolution by disk method; each slice is a circle of radius f(x).', source: 'KUA Carbon Dashboard · authored' }],
};
