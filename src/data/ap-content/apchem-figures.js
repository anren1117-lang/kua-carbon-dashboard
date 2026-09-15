// AP Chemistry — inline SVG figures for the viewer.

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
  bgDark: '#0b1220',
  bgLight: '#0f172a',
};

// 1.5 Electron configuration / shell diagram
const ShellDiagram = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Atomic shell diagram">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Electron shells and orbitals (carbon as example, 1s² 2s² 2p²)</text>
    {/* Nucleus */}
    <circle cx="300" cy="150" r="18" fill={COL.red} />
    <text x="300" y="154" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">6p, 6n</text>
    {/* Shells */}
    <circle cx="300" cy="150" r="50" fill="none" stroke={COL.cyan} strokeWidth="1.5" />
    <circle cx="300" cy="150" r="95" fill="none" stroke={COL.green} strokeWidth="1.5" />
    {/* 1s electrons */}
    <circle cx="350" cy="150" r="6" fill={COL.cyan} /><text x="365" y="154" fill={COL.cyan} fontSize="10">1s²</text>
    <circle cx="250" cy="150" r="6" fill={COL.cyan} />
    {/* 2s electrons */}
    <circle cx="395" cy="150" r="6" fill={COL.green} /><text x="410" y="154" fill={COL.green} fontSize="10">2s²</text>
    <circle cx="205" cy="150" r="6" fill={COL.green} />
    {/* 2p electrons */}
    <circle cx="300" cy="55" r="6" fill={COL.amber} /><text x="310" y="50" fill={COL.amber} fontSize="10">2p²</text>
    <circle cx="300" cy="245" r="6" fill={COL.amber} />
    {/* Labels */}
    <text x="20" y="60" fill={COL.cyan} fontSize="11">Shell 1 (n=1): 2 e⁻ max</text>
    <text x="20" y="80" fill={COL.green} fontSize="11">Shell 2 (n=2): 8 e⁻ max (2 in 2s + 6 in 2p)</text>
    <text x="20" y="100" fill={COL.amber} fontSize="11">Shell 3+: up to 18 (3s² 3p⁶ 3d¹⁰)</text>
    <text x="20" y="260" fill={COL.slate} fontSize="10">Filling order: 1s 2s 2p 3s 3p 4s 3d 4p... (Aufbau)</text>
  </svg>
);

// 1.7 Periodic trends
const PeriodicTrends = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Periodic trends">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Periodic trends</text>
    {/* Simplified table grid */}
    <rect x="120" y="50" width="360" height="120" fill="none" stroke={COL.dim} strokeWidth="1" />
    {/* Horizontal axis arrow (across period) */}
    <line x1="120" y1="190" x2="480" y2="190" stroke={COL.cyan} strokeWidth="2" markerEnd="url(#trArrow)" />
    <text x="300" y="208" textAnchor="middle" fill={COL.cyan} fontSize="11" fontWeight="700">Across period →</text>
    <text x="300" y="222" textAnchor="middle" fill={COL.cyan} fontSize="10">Atomic radius ↓ · IE ↑ · EN ↑ · Metallic character ↓</text>
    {/* Vertical axis arrow (down group) */}
    <line x1="100" y1="50" x2="100" y2="170" stroke={COL.green} strokeWidth="2" markerEnd="url(#trArrow)" />
    <text x="60" y="115" fill={COL.green} fontSize="11" fontWeight="700">Down</text>
    <text x="60" y="129" fill={COL.green} fontSize="11" fontWeight="700">group</text>
    <text x="60" y="148" fill={COL.green} fontSize="10">↓</text>
    {/* Trends down: */}
    <text x="500" y="80" fill={COL.green} fontSize="10">Atomic</text>
    <text x="500" y="92" fill={COL.green} fontSize="10">radius ↑</text>
    <text x="500" y="110" fill={COL.green} fontSize="10">IE ↓</text>
    <text x="500" y="123" fill={COL.green} fontSize="10">EN ↓</text>
    <text x="500" y="141" fill={COL.green} fontSize="10">Metallic ↑</text>
    <defs>
      <marker id="trArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.cyan} />
      </marker>
    </defs>
  </svg>
);

// 2.7 VSEPR geometries
const VSEPRShapes = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="VSEPR molecular geometries">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">VSEPR shapes by electron domain count</text>
    {[
      { x: 80, label: 'Linear', angle: '180°', ex: 'CO₂', shape: 'linear' },
      { x: 220, label: 'Trigonal planar', angle: '120°', ex: 'BF₃', shape: 'trig' },
      { x: 380, label: 'Tetrahedral', angle: '109.5°', ex: 'CH₄', shape: 'tet' },
      { x: 520, label: 'Bent', angle: '~105°', ex: 'H₂O', shape: 'bent' },
    ].map((s, i) => (
      <g key={i}>
        <circle cx={s.x} cy="120" r="50" fill="none" stroke={COL.cyan} strokeWidth="1" strokeDasharray="3 3" />
        <circle cx={s.x} cy="120" r="10" fill={COL.red} />
        {s.shape === 'linear' && (
          <>
            <circle cx={s.x - 35} cy="120" r="8" fill={COL.cyan} />
            <circle cx={s.x + 35} cy="120" r="8" fill={COL.cyan} />
            <line x1={s.x - 27} y1="120" x2={s.x - 10} y2="120" stroke={COL.text} strokeWidth="2" />
            <line x1={s.x + 10} y1="120" x2={s.x + 27} y2="120" stroke={COL.text} strokeWidth="2" />
          </>
        )}
        {s.shape === 'trig' && (
          <>
            <circle cx={s.x} cy={120 - 35} r="8" fill={COL.cyan} />
            <circle cx={s.x - 30} cy={120 + 17} r="8" fill={COL.cyan} />
            <circle cx={s.x + 30} cy={120 + 17} r="8" fill={COL.cyan} />
            <line x1={s.x} y1={120-10} x2={s.x} y2={120-27} stroke={COL.text} strokeWidth="2" />
            <line x1={s.x-8} y1={120+5} x2={s.x-25} y2={120+13} stroke={COL.text} strokeWidth="2" />
            <line x1={s.x+8} y1={120+5} x2={s.x+25} y2={120+13} stroke={COL.text} strokeWidth="2" />
          </>
        )}
        {s.shape === 'tet' && (
          <>
            <circle cx={s.x} cy={120 - 30} r="8" fill={COL.cyan} />
            <circle cx={s.x - 28} cy={120 + 20} r="8" fill={COL.cyan} />
            <circle cx={s.x + 28} cy={120 + 20} r="8" fill={COL.cyan} />
            <circle cx={s.x} cy={120 + 38} r="6" fill={COL.cyan} />
            {[[0,-22], [-22,12], [22,12], [0,28]].map(([dx,dy], j) => (
              <line key={j} x1={s.x} y1="120" x2={s.x+dx} y2={120+dy} stroke={COL.text} strokeWidth="2" />
            ))}
          </>
        )}
        {s.shape === 'bent' && (
          <>
            <circle cx={s.x - 28} cy={120 + 18} r="8" fill={COL.cyan} />
            <circle cx={s.x + 28} cy={120 + 18} r="8" fill={COL.cyan} />
            <line x1={s.x-8} y1={120+5} x2={s.x-25} y2={120+13} stroke={COL.text} strokeWidth="2" />
            <line x1={s.x+8} y1={120+5} x2={s.x+25} y2={120+13} stroke={COL.text} strokeWidth="2" />
            {/* Two lone pairs above */}
            <ellipse cx={s.x} cy={120-22} rx="5" ry="3" fill={COL.amber} />
            <ellipse cx={s.x} cy={120-32} rx="5" ry="3" fill={COL.amber} />
          </>
        )}
        <text x={s.x} y="220" textAnchor="middle" fill={COL.text} fontSize="11" fontWeight="700">{s.label}</text>
        <text x={s.x} y="236" textAnchor="middle" fill={COL.slate} fontSize="10">{s.angle}</text>
        <text x={s.x} y="252" textAnchor="middle" fill={COL.cyan} fontSize="10">{s.ex}</text>
      </g>
    ))}
  </svg>
);

// 3.1 IMF hierarchy
const IMFHierarchy = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="IMF strengths">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Intermolecular forces (weakest to strongest)</text>
    {[
      { x: 30, label: 'London dispersion', strength: '0.05-40 kJ/mol', note: 'all molecules', col: COL.dim },
      { x: 170, label: 'Dipole-dipole', strength: '5-25 kJ/mol', note: 'polar molecules', col: COL.cyan },
      { x: 310, label: 'Hydrogen bonding', strength: '10-40 kJ/mol', note: 'H + N/O/F', col: COL.green },
      { x: 450, label: 'Ion-dipole', strength: '40-600 kJ/mol', note: 'ion + polar', col: COL.amber },
    ].map((f, i) => (
      <g key={i}>
        <rect x={f.x} y="60" width="120" height="120" rx="6" fill={f.col} opacity="0.18" stroke={f.col} strokeWidth="1.5" />
        <text x={f.x + 60} y="88" textAnchor="middle" fill={f.col} fontSize="12" fontWeight="700">{f.label}</text>
        <text x={f.x + 60} y="115" textAnchor="middle" fill={COL.text} fontSize="11">{f.strength}</text>
        <text x={f.x + 60} y="140" textAnchor="middle" fill={COL.slate} fontSize="10">{f.note}</text>
        <text x={f.x + 60} y="170" textAnchor="middle" fill={f.col} fontSize="9">strength</text>
      </g>
    ))}
    <line x1="30" y1="200" x2="570" y2="200" stroke={COL.text} strokeWidth="2" markerEnd="url(#imfArr)" />
    <text x="30" y="220" fill={COL.slate} fontSize="10">weakest</text>
    <text x="540" y="220" fill={COL.text} fontSize="10">strongest</text>
    <defs>
      <marker id="imfArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.text} />
      </marker>
    </defs>
  </svg>
);

// 5.5 Reaction coordinate diagram
const ReactionCoord = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Reaction coordinate diagram">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Reaction coordinate diagram (exothermic)</text>
    {/* Axes */}
    <line x1="60" y1="240" x2="540" y2="240" stroke={COL.dim} />
    <line x1="60" y1="40" x2="60" y2="240" stroke={COL.dim} />
    <text x="300" y="263" textAnchor="middle" fill={COL.slate} fontSize="11">Reaction progress →</text>
    <text x="20" y="140" fill={COL.slate} fontSize="11" textAnchor="middle" transform="rotate(-90, 20, 140)">Potential energy</text>
    {/* Reactants */}
    <line x1="60" y1="150" x2="150" y2="150" stroke={COL.green} strokeWidth="3" />
    <text x="105" y="142" textAnchor="middle" fill={COL.green} fontSize="11" fontWeight="700">Reactants</text>
    {/* Curve to transition state */}
    <path d="M 150,150 Q 220,60 300,60" stroke={COL.text} strokeWidth="2" fill="none" />
    {/* Transition state */}
    <circle cx="300" cy="60" r="5" fill={COL.red} />
    <text x="300" y="46" textAnchor="middle" fill={COL.red} fontSize="11" fontWeight="700">Transition state</text>
    {/* Curve down to products */}
    <path d="M 300,60 Q 380,200 450,200" stroke={COL.text} strokeWidth="2" fill="none" />
    {/* Products */}
    <line x1="450" y1="200" x2="540" y2="200" stroke={COL.cyan} strokeWidth="3" />
    <text x="495" y="218" textAnchor="middle" fill={COL.cyan} fontSize="11" fontWeight="700">Products</text>
    {/* Ea arrow */}
    <line x1="170" y1="150" x2="170" y2="65" stroke={COL.amber} strokeWidth="1.5" markerStart="url(#rcArr)" markerEnd="url(#rcArr)" />
    <text x="180" y="105" fill={COL.amber} fontSize="11" fontWeight="700">E_a</text>
    <text x="180" y="121" fill={COL.amber} fontSize="9">activation</text>
    {/* ΔH arrow */}
    <line x1="500" y1="150" x2="500" y2="200" stroke={COL.red} strokeWidth="1.5" markerStart="url(#rcArr)" markerEnd="url(#rcArr)" />
    <text x="508" y="180" fill={COL.red} fontSize="11" fontWeight="700">ΔH &lt; 0</text>
    <defs>
      <marker id="rcArr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.amber} />
      </marker>
    </defs>
  </svg>
);

// 7.5 Le Chatelier
const LeChatelier = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Le Chatelier disturbances">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Le Châtelier: equilibrium shifts to counter disturbance</text>
    {[
      { x: 30, dist: 'Add reactant', shift: 'Forward →', col: COL.green },
      { x: 175, dist: 'Add product', shift: '← Reverse', col: COL.amber },
      { x: 320, dist: '↑ Pressure', shift: '→ fewer gas mol', col: COL.cyan },
      { x: 465, dist: '↑ Temperature', shift: 'endo if Δ, exo if exo', col: COL.red },
    ].map((d, i) => (
      <g key={i}>
        <rect x={d.x} y="60" width="120" height="120" rx="6" fill={d.col} opacity="0.15" stroke={d.col} strokeWidth="1.5" />
        <text x={d.x + 60} y="90" textAnchor="middle" fill={d.col} fontSize="12" fontWeight="700">{d.dist}</text>
        <text x={d.x + 60} y="120" textAnchor="middle" fill={COL.text} fontSize="11">{d.shift}</text>
      </g>
    ))}
    <text x="300" y="215" textAnchor="middle" fill={COL.slate} fontSize="11">Only T changes K. Catalysts don\'t shift equilibrium.</text>
  </svg>
);

// 8.2 pH scale
const pHScale = () => (
  <svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" aria-label="pH scale">
    <rect x="0" y="0" width="600" height="220" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">pH scale (logarithmic)</text>
    <defs>
      <linearGradient id="phGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#7f1d1d" />
        <stop offset="20%" stopColor={COL.red} />
        <stop offset="40%" stopColor={COL.amber} />
        <stop offset="50%" stopColor="#a3e635" />
        <stop offset="60%" stopColor={COL.green} />
        <stop offset="80%" stopColor={COL.cyan} />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <rect x="40" y="80" width="520" height="40" fill="url(#phGrad)" rx="3" />
    {[
      { p: 0, label: '0', note: 'Battery acid' },
      { p: 2, label: '2', note: 'Lemon juice' },
      { p: 4, label: '4', note: 'Coffee' },
      { p: 7, label: '7', note: 'Pure water' },
      { p: 9, label: '9', note: 'Baking soda' },
      { p: 12, label: '12', note: 'Ammonia' },
      { p: 14, label: '14', note: 'Drain cleaner' },
    ].map((s, i) => {
      const x = 40 + (s.p / 14) * 520;
      return (
        <g key={i}>
          <line x1={x} y1="80" x2={x} y2="125" stroke="#0b1220" strokeWidth="1.5" />
          <text x={x} y="140" textAnchor="middle" fill={COL.text} fontSize="11" fontWeight="700">{s.label}</text>
          <text x={x} y="156" textAnchor="middle" fill={COL.slate} fontSize="9">{s.note}</text>
        </g>
      );
    })}
    <text x="40" y="70" fill={COL.red} fontSize="11" fontWeight="700">acidic</text>
    <text x="300" y="70" textAnchor="middle" fill={COL.green} fontSize="11" fontWeight="700">neutral</text>
    <text x="560" y="70" textAnchor="end" fill={COL.cyan} fontSize="11" fontWeight="700">basic</text>
    <text x="300" y="195" textAnchor="middle" fill={COL.slate} fontSize="10">Each unit = 10× change in [H⁺]. pH + pOH = 14.</text>
  </svg>
);

// 9.4 Galvanic cell
const GalvanicCell = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Galvanic cell (Zn-Cu)">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Galvanic cell (Zn-Cu, E° = 1.10 V)</text>
    {/* Two beakers */}
    <rect x="80" y="100" width="140" height="120" fill="rgba(34,211,238,0.15)" stroke={COL.cyan} strokeWidth="1.5" />
    <rect x="380" y="100" width="140" height="120" fill="rgba(34,211,238,0.15)" stroke={COL.cyan} strokeWidth="1.5" />
    <text x="150" y="240" textAnchor="middle" fill={COL.textDim} fontSize="11">Zn(s) in Zn²⁺(aq)</text>
    <text x="450" y="240" textAnchor="middle" fill={COL.textDim} fontSize="11">Cu(s) in Cu²⁺(aq)</text>
    {/* Electrodes */}
    <rect x="145" y="80" width="10" height="100" fill={COL.dim} />
    <rect x="445" y="80" width="10" height="100" fill="#b87333" />
    <text x="150" y="73" textAnchor="middle" fill={COL.red} fontSize="11" fontWeight="700">Zn (anode, −)</text>
    <text x="450" y="73" textAnchor="middle" fill={COL.green} fontSize="11" fontWeight="700">Cu (cathode, +)</text>
    {/* Wire with voltmeter */}
    <line x1="150" y1="80" x2="150" y2="50" stroke={COL.text} strokeWidth="2" />
    <line x1="150" y1="50" x2="270" y2="50" stroke={COL.text} strokeWidth="2" />
    <circle cx="300" cy="50" r="22" fill="none" stroke={COL.amber} strokeWidth="2" />
    <text x="300" y="55" textAnchor="middle" fill={COL.amber} fontSize="12" fontWeight="700">V</text>
    <line x1="322" y1="50" x2="450" y2="50" stroke={COL.text} strokeWidth="2" />
    <line x1="450" y1="50" x2="450" y2="80" stroke={COL.text} strokeWidth="2" />
    {/* Electron flow arrows */}
    <text x="220" y="42" fill={COL.cyan} fontSize="10">e⁻ →</text>
    {/* Salt bridge */}
    <path d="M 220,140 Q 300,90 380,140" stroke={COL.amber} strokeWidth="3" fill="none" />
    <text x="300" y="100" textAnchor="middle" fill={COL.amber} fontSize="10" fontWeight="700">Salt bridge (ions flow)</text>
    {/* Reactions */}
    <text x="150" y="195" textAnchor="middle" fill={COL.red} fontSize="9">Zn → Zn²⁺ + 2e⁻</text>
    <text x="450" y="195" textAnchor="middle" fill={COL.green} fontSize="9">Cu²⁺ + 2e⁻ → Cu</text>
  </svg>
);

export const APCHEM_FIGURES = {
  '1.5': [{ id: 'shells', Cmp: ShellDiagram, caption: 'Electron shells fill in specific order; valence shell determines chemistry.', source: 'KUA Carbon Dashboard · authored' }],
  '1.7': [{ id: 'trends', Cmp: PeriodicTrends, caption: 'Periodic trends in radius, ionization energy, electronegativity, and metallic character.', source: 'KUA Carbon Dashboard · authored' }],
  '2.7': [{ id: 'vsepr', Cmp: VSEPRShapes, caption: 'VSEPR geometries based on electron domains around central atom.', source: 'After Gillespie & Nyholm 1957' }],
  '3.1': [{ id: 'imf', Cmp: IMFHierarchy, caption: 'Intermolecular force strengths. All molecules have London dispersion; only H + N/O/F gives H-bonds.', source: 'KUA Carbon Dashboard · authored' }],
  '5.5': [{ id: 'rxncoord', Cmp: ReactionCoord, caption: 'Reactants must climb activation energy barrier; products lie at lower energy if exothermic.', source: 'KUA Carbon Dashboard · authored' }],
  '7.5': [{ id: 'lechat', Cmp: LeChatelier, caption: 'Le Châtelier: equilibrium shifts to partially counter any disturbance.', source: 'Le Châtelier 1884' }],
  '8.2': [{ id: 'ph', Cmp: pHScale, caption: 'pH scale spans 14 orders of magnitude in [H⁺]. Pure water = 7.', source: 'KUA Carbon Dashboard · authored' }],
  '9.4': [{ id: 'galvanic', Cmp: GalvanicCell, caption: 'Galvanic cell uses spontaneous redox to generate electricity. Oxidation at anode; reduction at cathode.', source: 'After Volta 1800' }],
};
