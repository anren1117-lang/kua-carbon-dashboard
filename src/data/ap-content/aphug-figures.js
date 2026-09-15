// AP Human Geography — inline SVG figures.
import React from 'react';
const COL = { green: '#22c55e', cyan: '#22d3ee', amber: '#fbbf24', red: '#ef4444', slate: '#94a3b8', dim: '#475569', text: '#e5e7eb', textDim: '#cbd5e1', bgLight: '#0f172a' };

// 2.2 DTM
const DTM = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Demographic Transition Model">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Demographic Transition Model</text>
    <line x1="80" y1="220" x2="540" y2="220" stroke={COL.dim} />
    <line x1="80" y1="50" x2="80" y2="220" stroke={COL.dim} />
    {/* Birth rate */}
    <path d="M 80,80 L 180,80 Q 250,80 320,160 L 540,180" stroke={COL.amber} strokeWidth="2.5" fill="none" />
    <text x="100" y="75" fill={COL.amber} fontSize="11" fontWeight="700">Birth rate</text>
    {/* Death rate */}
    <path d="M 80,80 L 130,80 Q 200,100 270,170 L 540,180" stroke={COL.cyan} strokeWidth="2.5" fill="none" />
    <text x="100" y="200" fill={COL.cyan} fontSize="11" fontWeight="700">Death rate</text>
    {/* Stage dividers */}
    {[180, 280, 380, 480].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="50" x2={x} y2="220" stroke={COL.dim} strokeDasharray="3 3" />
        <text x={x - 50} y="40" fill={COL.slate} fontSize="10">Stage {i + 1}</text>
      </g>
    ))}
    <text x="500" y="40" fill={COL.slate} fontSize="10">Stage 5?</text>
    <text x="300" y="265" textAnchor="middle" fill={COL.slate} fontSize="10">Stage 1: high BR + high DR. Stage 5: BR &lt; DR (decline).</text>
  </svg>
);

// 2.4 Migration flows
const MigrationFlows = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Push vs pull migration factors">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Migration push vs pull factors</text>
    <g>
      <rect x="30" y="60" width="240" height="150" rx="8" fill={COL.red} opacity="0.15" stroke={COL.red} />
      <text x="150" y="85" textAnchor="middle" fill={COL.red} fontSize="13" fontWeight="700">Push factors (origin)</text>
      {['War, persecution','Economic hardship','Environmental disaster','Cultural conflict','Famine'].map((p, i) => (
        <text key={i} x="45" y={115 + i * 20} fill={COL.text} fontSize="11">• {p}</text>
      ))}
    </g>
    <g>
      <rect x="320" y="60" width="240" height="150" rx="8" fill={COL.green} opacity="0.15" stroke={COL.green} />
      <text x="440" y="85" textAnchor="middle" fill={COL.green} fontSize="13" fontWeight="700">Pull factors (destination)</text>
      {['Jobs / better wages','Family reunification','Safety','Education','Political freedom'].map((p, i) => (
        <text key={i} x="335" y={115 + i * 20} fill={COL.text} fontSize="11">• {p}</text>
      ))}
    </g>
  </svg>
);

// 5.2 Von Thünen
const VonThunen = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Von Thünen model">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Von Thünen agricultural rings</text>
    {[
      { r: 130, col: '#7c4a1a', label: 'Ranching' },
      { r: 100, col: '#a3e635', label: 'Grain' },
      { r: 70, col: '#3a8e4d', label: 'Forestry' },
      { r: 40, col: COL.amber, label: 'Dairy / market gardening' },
    ].map((ring, i) => (
      <circle key={i} cx="300" cy="155" r={ring.r} fill={ring.col} opacity="0.3" stroke={ring.col} strokeWidth="1.5" />
    ))}
    <circle cx="300" cy="155" r="12" fill={COL.red} />
    <text x="300" y="160" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">City</text>
    <text x="300" y="105" textAnchor="middle" fill={COL.amber} fontSize="10">Dairy/gardens</text>
    <text x="300" y="80" textAnchor="middle" fill={COL.green} fontSize="10">Forestry</text>
    <text x="300" y="50" textAnchor="middle" fill="#a3e635" fontSize="10">Grain</text>
    <text x="300" y="270" textAnchor="middle" fill="#7c4a1a" fontSize="10">Ranching</text>
  </svg>
);

// 6.2 Urban model
const ConcentricZone = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Concentric Zone Model">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Burgess Concentric Zone Model (1925)</text>
    {[
      { r: 120, col: '#a3e635', label: 'Commuter zone' },
      { r: 95, col: COL.green, label: 'Middle class' },
      { r: 70, col: COL.amber, label: 'Working class' },
      { r: 45, col: '#f97316', label: 'Transition' },
    ].map((ring, i) => (
      <circle key={i} cx="300" cy="135" r={ring.r} fill={ring.col} opacity="0.35" stroke={ring.col} />
    ))}
    <circle cx="300" cy="135" r="22" fill={COL.red} />
    <text x="300" y="140" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">CBD</text>
    <text x="155" y="135" fill={COL.text} fontSize="10">Commuter</text>
    <text x="160" y="125" fill={COL.text} fontSize="10">zone</text>
    <text x="445" y="135" fill={COL.text} fontSize="10">Suburbs</text>
    <text x="300" y="250" textAnchor="middle" fill={COL.slate} fontSize="10">Based on 1925 Chicago. Modern cities have multiple nuclei.</text>
  </svg>
);

// 7.3 HDI categories
const HDICategories = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="HDI development categories">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Human Development Index categories</text>
    {[
      { label: 'Very high (≥0.800)', val: 80, col: COL.green, example: 'Norway, Switzerland, US' },
      { label: 'High (0.700-0.799)', val: 60, col: '#a3e635', example: 'Mexico, Russia, Turkey' },
      { label: 'Medium (0.550-0.699)', val: 40, col: COL.amber, example: 'India, Egypt, Vietnam' },
      { label: 'Low (<0.550)', val: 20, col: COL.red, example: 'Niger, Chad, S. Sudan' },
    ].map((c, i) => {
      const y = 60 + i * 38;
      return (
        <g key={i}>
          <rect x="60" y={y} width={c.val * 5} height="28" fill={c.col} opacity="0.7" />
          <text x="65" y={y + 18} fill={COL.text} fontSize="11" fontWeight="700">{c.label}</text>
          <text x={c.val * 5 + 70} y={y + 18} fill={COL.textDim} fontSize="11">{c.example}</text>
        </g>
      );
    })}
    <text x="300" y="225" textAnchor="middle" fill={COL.slate} fontSize="10">HDI combines income, education, and life expectancy (UN Development Programme).</text>
  </svg>
);

export const APHUG_FIGURES = {
  '2.2': [{ id: 'dtm', Cmp: DTM, caption: 'Demographic Transition Model: 5 stages.', source: 'KUA Carbon Dashboard · authored' }],
  '2.4': [{ id: 'mig', Cmp: MigrationFlows, caption: 'Push (leave) vs pull (come) factors driving migration.', source: 'KUA Carbon Dashboard · authored' }],
  '5.2': [{ id: 'vt', Cmp: VonThunen, caption: 'Von Thünen rings: perishables near city, commodities further out.', source: 'Von Thünen 1826' }],
  '6.2': [{ id: 'cz', Cmp: ConcentricZone, caption: 'Burgess Concentric Zone Model — based on 1925 Chicago.', source: 'Burgess 1925' }],
  '7.3': [{ id: 'hdi', Cmp: HDICategories, caption: 'HDI development categories and examples.', source: 'UN Human Development Report' }],
};
