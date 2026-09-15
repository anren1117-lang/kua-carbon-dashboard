// AP Microeconomics — inline SVG figures.
import React from 'react';

const COL = {
  green: '#22c55e', cyan: '#22d3ee', amber: '#fbbf24', red: '#ef4444',
  slate: '#94a3b8', dim: '#475569', text: '#e5e7eb', textDim: '#cbd5e1',
  bgLight: '#0f172a',
};

// 1.4 Demand curve with shifters
const DemandCurve = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Demand curve and shifts">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Demand: along curve vs shifts</text>
    <line x1="80" y1="220" x2="540" y2="220" stroke={COL.dim} />
    <line x1="80" y1="40" x2="80" y2="220" stroke={COL.dim} />
    {/* Original demand */}
    <line x1="120" y1="60" x2="480" y2="200" stroke={COL.cyan} strokeWidth="2.5" />
    <text x="490" y="200" fill={COL.cyan} fontSize="11" fontWeight="700">D</text>
    {/* Shifted right */}
    <line x1="220" y1="60" x2="540" y2="180" stroke={COL.green} strokeWidth="2.5" />
    <text x="540" y="178" fill={COL.green} fontSize="11" fontWeight="700">D'</text>
    {/* Labels */}
    <text x="80" y="32" fill={COL.text} fontSize="11">Price</text>
    <text x="545" y="220" fill={COL.text} fontSize="11">Quantity</text>
    <text x="100" y="245" fill={COL.slate} fontSize="10">D shifts right: ↑ income (normal), ↑ substitute price, change in tastes, ↑ buyers</text>
  </svg>
);

// 3.2 Cost curves
const CostCurves = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Cost curves">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Cost curves: ATC, AVC, MC</text>
    <line x1="80" y1="240" x2="540" y2="240" stroke={COL.dim} />
    <line x1="80" y1="40" x2="80" y2="240" stroke={COL.dim} />
    {/* MC */}
    <path d="M 120,220 Q 180,200 250,150 Q 330,90 450,40" stroke={COL.cyan} strokeWidth="2.5" fill="none" />
    <text x="455" y="40" fill={COL.cyan} fontSize="11" fontWeight="700">MC</text>
    {/* ATC */}
    <path d="M 120,200 Q 230,130 300,120 Q 400,140 480,90" stroke={COL.green} strokeWidth="2.5" fill="none" />
    <text x="490" y="90" fill={COL.green} fontSize="11" fontWeight="700">ATC</text>
    {/* AVC */}
    <path d="M 120,210 Q 230,160 300,160 Q 400,165 480,140" stroke={COL.amber} strokeWidth="2.5" fill="none" />
    <text x="490" y="140" fill={COL.amber} fontSize="11" fontWeight="700">AVC</text>
    {/* Min points */}
    <circle cx="300" cy="160" r="4" fill={COL.amber} />
    <circle cx="300" cy="120" r="4" fill={COL.green} />
    <text x="300" y="265" textAnchor="middle" fill={COL.slate} fontSize="10">MC cuts AVC and ATC at their minimums.</text>
  </svg>
);

// 3.4 Perfect competition profit
const PCProfit = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Perfect competition firm with profit">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">PC firm with short-run profit</text>
    <line x1="80" y1="220" x2="540" y2="220" stroke={COL.dim} />
    <line x1="80" y1="40" x2="80" y2="220" stroke={COL.dim} />
    {/* P = MR (horizontal) */}
    <line x1="80" y1="80" x2="500" y2="80" stroke={COL.cyan} strokeWidth="2.5" />
    <text x="510" y="80" fill={COL.cyan} fontSize="11" fontWeight="700">P = MR</text>
    {/* MC */}
    <path d="M 120,200 Q 200,180 280,120 Q 360,80 420,40" stroke={COL.red} strokeWidth="2.5" fill="none" />
    <text x="425" y="40" fill={COL.red} fontSize="11" fontWeight="700">MC</text>
    {/* ATC */}
    <path d="M 120,200 Q 240,140 300,140 Q 400,160 460,100" stroke={COL.green} strokeWidth="2.5" fill="none" />
    <text x="465" y="100" fill={COL.green} fontSize="11" fontWeight="700">ATC</text>
    {/* Q* */}
    <line x1="350" y1="80" x2="350" y2="220" stroke={COL.amber} strokeDasharray="3 3" />
    <line x1="80" y1="140" x2="350" y2="140" stroke={COL.amber} strokeDasharray="3 3" />
    {/* Profit area */}
    <rect x="80" y="80" width="270" height="60" fill={COL.amber} opacity="0.25" />
    <text x="220" y="115" textAnchor="middle" fill={COL.amber} fontSize="11" fontWeight="700">Profit</text>
    <text x="350" y="240" textAnchor="middle" fill={COL.text} fontSize="11" fontWeight="700">Q*</text>
    <text x="75" y="143" textAnchor="end" fill={COL.green} fontSize="10">ATC</text>
    <text x="75" y="84" textAnchor="end" fill={COL.cyan} fontSize="10">P*</text>
  </svg>
);

// 4.1 Monopoly
const Monopoly = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Monopoly pricing">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Monopoly: P &gt; MR &gt; MC at profit max</text>
    <line x1="80" y1="220" x2="540" y2="220" stroke={COL.dim} />
    <line x1="80" y1="40" x2="80" y2="220" stroke={COL.dim} />
    {/* Demand */}
    <line x1="100" y1="50" x2="500" y2="210" stroke={COL.cyan} strokeWidth="2.5" />
    <text x="510" y="210" fill={COL.cyan} fontSize="11" fontWeight="700">D</text>
    {/* MR (twice as steep) */}
    <line x1="100" y1="50" x2="300" y2="200" stroke={COL.amber} strokeWidth="2.5" />
    <text x="306" y="200" fill={COL.amber} fontSize="11" fontWeight="700">MR</text>
    {/* MC */}
    <line x1="100" y1="180" x2="450" y2="100" stroke={COL.red} strokeWidth="2.5" />
    <text x="455" y="100" fill={COL.red} fontSize="11" fontWeight="700">MC</text>
    {/* Q_m where MR = MC */}
    <line x1="230" y1="140" x2="230" y2="220" stroke={COL.green} strokeDasharray="3 3" />
    <line x1="80" y1="100" x2="230" y2="100" stroke={COL.green} strokeDasharray="3 3" />
    <text x="230" y="240" textAnchor="middle" fill={COL.green} fontSize="11" fontWeight="700">Q_m</text>
    <text x="75" y="103" textAnchor="end" fill={COL.green} fontSize="11" fontWeight="700">P_m</text>
    <text x="300" y="255" textAnchor="middle" fill={COL.slate} fontSize="10">Set MR = MC for Q_m; charge P_m from D. Restricts Q, raises P vs PC.</text>
  </svg>
);

// 6.1 Externality
const Externality = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Negative externality market failure">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Negative externality: market overproduces</text>
    <line x1="80" y1="240" x2="540" y2="240" stroke={COL.dim} />
    <line x1="80" y1="40" x2="80" y2="240" stroke={COL.dim} />
    {/* Demand */}
    <line x1="100" y1="60" x2="500" y2="220" stroke={COL.cyan} strokeWidth="2.5" />
    <text x="510" y="220" fill={COL.cyan} fontSize="11" fontWeight="700">D = MSB</text>
    {/* Private MC (private supply) */}
    <line x1="100" y1="220" x2="500" y2="80" stroke={COL.green} strokeWidth="2.5" />
    <text x="510" y="80" fill={COL.green} fontSize="11" fontWeight="700">S = MPC</text>
    {/* Social MC (above private by externality) */}
    <line x1="100" y1="180" x2="500" y2="40" stroke={COL.red} strokeWidth="2.5" />
    <text x="510" y="40" fill={COL.red} fontSize="11" fontWeight="700">MSC</text>
    {/* Q_market vs Q_efficient */}
    <line x1="300" y1="160" x2="300" y2="240" stroke={COL.green} strokeDasharray="3 3" />
    <line x1="250" y1="150" x2="250" y2="240" stroke={COL.red} strokeDasharray="3 3" />
    <text x="300" y="258" textAnchor="middle" fill={COL.green} fontSize="10">Q_market</text>
    <text x="250" y="258" textAnchor="middle" fill={COL.red} fontSize="10">Q_eff</text>
    <text x="300" y="270" textAnchor="middle" fill={COL.slate} fontSize="10">Market produces too much (Q_market &gt; Q_efficient). Pigouvian tax aligns MPC with MSC.</text>
  </svg>
);

export const APMICRO_FIGURES = {
  '1.4': [{ id: 'demand', Cmp: DemandCurve, caption: 'Demand curve and shifters.', source: 'KUA Carbon Dashboard · authored' }],
  '3.2': [{ id: 'costs', Cmp: CostCurves, caption: 'Cost curves: MC cuts AVC and ATC at their minimums.', source: 'KUA Carbon Dashboard · authored' }],
  '3.4': [{ id: 'pc', Cmp: PCProfit, caption: 'PC firm with positive short-run profit; entry will drive long-run profit to zero.', source: 'KUA Carbon Dashboard · authored' }],
  '4.1': [{ id: 'monopoly', Cmp: Monopoly, caption: 'Monopoly: produce where MR = MC; charge price from demand curve.', source: 'KUA Carbon Dashboard · authored' }],
  '6.1': [{ id: 'ext', Cmp: Externality, caption: 'Negative externality: market overproduces. Pigouvian tax restores efficiency.', source: 'KUA Carbon Dashboard · authored' }],
};
