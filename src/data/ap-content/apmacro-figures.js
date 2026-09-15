// AP Macroeconomics — inline SVG figures.
import React from 'react';

const COL = {
  green: '#22c55e', cyan: '#22d3ee', amber: '#fbbf24', red: '#ef4444',
  slate: '#94a3b8', dim: '#475569', text: '#e5e7eb', textDim: '#cbd5e1',
  bgLight: '#0f172a',
};

// 1.2 PPC
const PPC = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Production Possibilities Curve">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Production Possibilities Curve (PPC)</text>
    <line x1="80" y1="240" x2="560" y2="240" stroke={COL.dim} />
    <line x1="80" y1="40" x2="80" y2="240" stroke={COL.dim} />
    {/* PPC curve (concave) */}
    <path d="M 80,60 Q 200,80 350,160 Q 450,200 510,240" stroke={COL.cyan} strokeWidth="2.5" fill="none" />
    {/* Points */}
    <circle cx="200" cy="100" r="5" fill={COL.green} />
    <text x="210" y="100" fill={COL.green} fontSize="11">A (efficient)</text>
    <circle cx="280" cy="200" r="5" fill={COL.amber} />
    <text x="290" y="200" fill={COL.amber} fontSize="11">B (inefficient)</text>
    <circle cx="420" cy="60" r="5" fill={COL.red} />
    <text x="430" y="60" fill={COL.red} fontSize="11">C (impossible)</text>
    <text x="80" y="32" fill={COL.text} fontSize="11">Wheat</text>
    <text x="565" y="240" fill={COL.text} fontSize="11">Cars</text>
    <text x="300" y="270" textAnchor="middle" fill={COL.slate} fontSize="10">Concave curve: increasing opportunity cost as you specialize.</text>
  </svg>
);

// 1.6 Supply & demand equilibrium
const SupplyDemand = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Supply and demand equilibrium">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Supply and demand: equilibrium</text>
    <line x1="80" y1="240" x2="560" y2="240" stroke={COL.dim} />
    <line x1="80" y1="40" x2="80" y2="240" stroke={COL.dim} />
    {/* Demand (downward) */}
    <line x1="100" y1="60" x2="500" y2="220" stroke={COL.cyan} strokeWidth="2.5" />
    <text x="510" y="225" fill={COL.cyan} fontSize="11" fontWeight="700">D</text>
    {/* Supply (upward) */}
    <line x1="100" y1="220" x2="500" y2="60" stroke={COL.green} strokeWidth="2.5" />
    <text x="510" y="60" fill={COL.green} fontSize="11" fontWeight="700">S</text>
    {/* Equilibrium */}
    <circle cx="300" cy="140" r="6" fill={COL.amber} />
    <line x1="80" y1="140" x2="300" y2="140" stroke={COL.amber} strokeDasharray="3 3" />
    <line x1="300" y1="240" x2="300" y2="140" stroke={COL.amber} strokeDasharray="3 3" />
    <text x="75" y="143" textAnchor="end" fill={COL.amber} fontSize="11" fontWeight="700">P*</text>
    <text x="300" y="258" textAnchor="middle" fill={COL.amber} fontSize="11" fontWeight="700">Q*</text>
    <text x="80" y="32" fill={COL.text} fontSize="11">Price</text>
    <text x="565" y="240" fill={COL.text} fontSize="11">Quantity</text>
  </svg>
);

// 3.3 AD-AS
const ADAS = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Aggregate demand and supply">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">AD–AS model</text>
    <line x1="80" y1="240" x2="560" y2="240" stroke={COL.dim} />
    <line x1="80" y1="40" x2="80" y2="240" stroke={COL.dim} />
    {/* LRAS vertical */}
    <line x1="350" y1="50" x2="350" y2="240" stroke={COL.red} strokeWidth="2.5" />
    <text x="360" y="50" fill={COL.red} fontSize="11" fontWeight="700">LRAS</text>
    {/* SRAS upward */}
    <line x1="120" y1="220" x2="500" y2="80" stroke={COL.green} strokeWidth="2.5" />
    <text x="510" y="80" fill={COL.green} fontSize="11" fontWeight="700">SRAS</text>
    {/* AD downward */}
    <line x1="120" y1="80" x2="500" y2="220" stroke={COL.cyan} strokeWidth="2.5" />
    <text x="510" y="225" fill={COL.cyan} fontSize="11" fontWeight="700">AD</text>
    {/* Equilibrium */}
    <circle cx="350" cy="150" r="6" fill={COL.amber} />
    <text x="80" y="32" fill={COL.text} fontSize="11">Price level</text>
    <text x="565" y="240" fill={COL.text} fontSize="11">Real GDP</text>
    <text x="350" y="258" textAnchor="middle" fill={COL.red} fontSize="10">Y_F (full employment)</text>
  </svg>
);

// 3.6 Phillips Curve
const PhillipsCurve = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Phillips Curve">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Phillips Curve (short run + long run)</text>
    <line x1="80" y1="200" x2="540" y2="200" stroke={COL.dim} />
    <line x1="80" y1="40" x2="80" y2="200" stroke={COL.dim} />
    {/* SRPC downward */}
    <path d="M 100,60 Q 250,80 400,160 Q 470,200 510,200" stroke={COL.cyan} strokeWidth="2.5" fill="none" />
    <text x="500" y="75" fill={COL.cyan} fontSize="11" fontWeight="700">SRPC</text>
    {/* LRPC vertical at natural rate */}
    <line x1="320" y1="50" x2="320" y2="200" stroke={COL.red} strokeWidth="2.5" />
    <text x="328" y="50" fill={COL.red} fontSize="11" fontWeight="700">LRPC</text>
    <text x="80" y="32" fill={COL.text} fontSize="11">Inflation</text>
    <text x="545" y="200" fill={COL.text} fontSize="11">Unemployment</text>
    <text x="320" y="220" textAnchor="middle" fill={COL.red} fontSize="10">Natural rate (~4-5%)</text>
  </svg>
);

// 4.4 Money multiplier
const MoneyMultiplier = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Money multiplier process">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Money multiplier (rr = 10%)</text>
    {[
      { x: 30,  label: 'Deposit', amount: '$1,000', col: COL.cyan },
      { x: 170, label: 'Loan', amount: '$900', col: COL.green },
      { x: 310, label: 'Loan', amount: '$810', col: COL.green },
      { x: 450, label: '... continues', amount: 'total $10,000', col: COL.amber },
    ].map((s, i) => (
      <g key={i}>
        <rect x={s.x} y="70" width="120" height="100" rx="6" fill={s.col} opacity="0.18" stroke={s.col} strokeWidth="1.5" />
        <text x={s.x + 60} y="100" textAnchor="middle" fill={s.col} fontSize="11" fontWeight="700">{s.label}</text>
        <text x={s.x + 60} y="130" textAnchor="middle" fill={COL.text} fontSize="13" fontWeight="700">{s.amount}</text>
        {i < 3 && <line x1={s.x + 120} y1="120" x2={s.x + 168} y2="120" stroke={COL.slate} markerEnd="url(#mmArr)" />}
      </g>
    ))}
    <text x="300" y="205" textAnchor="middle" fill={COL.slate} fontSize="11">Multiplier = 1/rr = 10. Initial $1000 → max $10,000 in money supply.</text>
    <defs>
      <marker id="mmArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.slate} />
      </marker>
    </defs>
  </svg>
);

// 2.6 Business cycle
const BusinessCycle = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Business cycle">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Business cycle phases</text>
    <line x1="80" y1="200" x2="540" y2="200" stroke={COL.dim} />
    {/* Sine wave-like */}
    <path d="M 80,160 Q 150,80 220,160 Q 290,240 360,160 Q 430,80 500,160 Q 540,200 540,160" stroke={COL.cyan} strokeWidth="2.5" fill="none" />
    {/* Long-run trend */}
    <line x1="80" y1="180" x2="540" y2="120" stroke={COL.green} strokeWidth="1.5" strokeDasharray="5 3" />
    <text x="510" y="115" fill={COL.green} fontSize="10">long-run trend</text>
    {/* Labels */}
    <circle cx="150" cy="80" r="4" fill={COL.amber} />
    <text x="150" y="65" textAnchor="middle" fill={COL.amber} fontSize="10">peak</text>
    <circle cx="290" cy="240" r="4" fill={COL.red} />
    <text x="290" y="258" textAnchor="middle" fill={COL.red} fontSize="10">trough</text>
    <text x="220" y="180" textAnchor="middle" fill={COL.cyan} fontSize="10">recession</text>
    <text x="430" y="100" textAnchor="middle" fill={COL.green} fontSize="10">expansion</text>
    <text x="540" y="218" textAnchor="end" fill={COL.text} fontSize="11">Time</text>
  </svg>
);

export const APMACRO_FIGURES = {
  '1.2': [{ id: 'ppc', Cmp: PPC, caption: 'Production Possibilities Curve: concave shows increasing opportunity cost.', source: 'KUA Carbon Dashboard · authored' }],
  '1.6': [{ id: 'sd', Cmp: SupplyDemand, caption: 'Market equilibrium where supply meets demand.', source: 'KUA Carbon Dashboard · authored' }],
  '2.6': [{ id: 'bizcycle', Cmp: BusinessCycle, caption: 'Business cycle: economies oscillate around long-run growth trend.', source: 'KUA Carbon Dashboard · authored' }],
  '3.3': [{ id: 'adas', Cmp: ADAS, caption: 'AD-AS model: equilibrium at intersection. LRAS vertical at full employment.', source: 'KUA Carbon Dashboard · authored' }],
  '3.6': [{ id: 'phillips', Cmp: PhillipsCurve, caption: 'Phillips Curve: short-run trade-off; long-run vertical at natural rate.', source: 'KUA Carbon Dashboard · authored' }],
  '4.4': [{ id: 'mm', Cmp: MoneyMultiplier, caption: 'Money multiplier: fractional reserve banking creates more money supply than initial deposit.', source: 'KUA Carbon Dashboard · authored' }],
};
