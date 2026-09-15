// AP Biology — inline SVG figures for the viewer.
// Same pattern as APES: keyed by subunit code. Inline SVG only.

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
  gridLine: '#1f2937',
};

// ------------------------------------------------------------------
// 1.1 Water hydrogen bonding
// ------------------------------------------------------------------
const WaterHBond = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Water polarity and hydrogen bonds">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Water polarity and hydrogen bonding</text>
    {/* Three water molecules */}
    {[
      { cx: 150, cy: 120 },
      { cx: 300, cy: 80 },
      { cx: 450, cy: 120 },
      { cx: 220, cy: 200 },
      { cx: 380, cy: 200 },
    ].map((m, i) => (
      <g key={i}>
        <circle cx={m.cx} cy={m.cy} r="22" fill={COL.red} opacity="0.85" />
        <text x={m.cx} y={m.cy + 4} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">O δ−</text>
        <circle cx={m.cx - 18} cy={m.cy - 16} r="11" fill={COL.cyan} opacity="0.85" />
        <text x={m.cx - 18} y={m.cy - 13} textAnchor="middle" fill="#0b1220" fontSize="10" fontWeight="700">H+</text>
        <circle cx={m.cx + 18} cy={m.cy - 16} r="11" fill={COL.cyan} opacity="0.85" />
        <text x={m.cx + 18} y={m.cy - 13} textAnchor="middle" fill="#0b1220" fontSize="10" fontWeight="700">H+</text>
      </g>
    ))}
    {/* H-bonds (dashed lines between water molecules) */}
    {[
      [168, 104, 282, 80],
      [318, 80, 432, 104],
      [150, 142, 220, 184],
      [450, 142, 380, 184],
    ].map(([x1, y1, x2, y2], i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COL.amber} strokeWidth="1.5" strokeDasharray="3 3" />
    ))}
    <text x="300" y="245" textAnchor="middle" fill={COL.slate} fontSize="11">Dashed = hydrogen bonds (weak but many; drive water\'s special properties)</text>
  </svg>
);

// ------------------------------------------------------------------
// 1.3 Four macromolecule classes
// ------------------------------------------------------------------
const FourMacromolecules = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Four biological macromolecule classes">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Four classes of biological macromolecules</text>
    {[
      { x: 30,  col: COL.green,  label: 'Carbohydrates', mono: 'Monosaccharide', poly: 'Polysaccharide', bond: 'Glycosidic', fn: 'Energy, structure' },
      { x: 175, col: COL.amber,  label: 'Lipids',         mono: 'Glycerol+FA',     poly: 'Various',         bond: 'Ester',      fn: 'Energy, membranes' },
      { x: 320, col: COL.cyan,   label: 'Proteins',       mono: 'Amino acid',      poly: 'Polypeptide',     bond: 'Peptide',    fn: 'Enzymes, structure' },
      { x: 465, col: COL.red,    label: 'Nucleic acids',  mono: 'Nucleotide',      poly: 'DNA / RNA',       bond: 'Phosphodi-', fn: 'Information' },
    ].map((c, i) => (
      <g key={i}>
        <rect x={c.x} y="50" width="120" height="195" rx="8" fill={c.col} opacity="0.15" stroke={c.col} strokeWidth="1.5" />
        <text x={c.x + 60} y="78" textAnchor="middle" fill={c.col} fontSize="14" fontWeight="700">{c.label}</text>
        <text x={c.x + 60} y="108" textAnchor="middle" fill={COL.slate} fontSize="10">monomer:</text>
        <text x={c.x + 60} y="124" textAnchor="middle" fill={COL.text} fontSize="11">{c.mono}</text>
        <text x={c.x + 60} y="148" textAnchor="middle" fill={COL.slate} fontSize="10">polymer:</text>
        <text x={c.x + 60} y="164" textAnchor="middle" fill={COL.text} fontSize="11">{c.poly}</text>
        <text x={c.x + 60} y="188" textAnchor="middle" fill={COL.slate} fontSize="10">bond:</text>
        <text x={c.x + 60} y="204" textAnchor="middle" fill={COL.text} fontSize="11">{c.bond}</text>
        <text x={c.x + 60} y="228" textAnchor="middle" fill={COL.amber} fontSize="11" fontWeight="600">{c.fn}</text>
      </g>
    ))}
  </svg>
);

// ------------------------------------------------------------------
// 1.6 DNA double helix
// ------------------------------------------------------------------
const DNAHelix = () => (
  <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" aria-label="DNA double helix structure">
    <rect x="0" y="0" width="600" height="320" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">DNA — antiparallel double helix</text>
    {/* Helix backbones */}
    <path d="M 200,50 Q 280,90 200,130 Q 120,170 200,210 Q 280,250 200,290" stroke={COL.cyan} strokeWidth="3" fill="none" />
    <path d="M 400,50 Q 320,90 400,130 Q 480,170 400,210 Q 320,250 400,290" stroke={COL.green} strokeWidth="3" fill="none" />
    {/* Base pair rungs */}
    {[
      { y: 60,  bp: 'A — T', col: COL.amber },
      { y: 90,  bp: 'C ≡ G', col: COL.red },
      { y: 120, bp: 'G ≡ C', col: COL.red },
      { y: 150, bp: 'T — A', col: COL.amber },
      { y: 180, bp: 'A — T', col: COL.amber },
      { y: 210, bp: 'G ≡ C', col: COL.red },
      { y: 240, bp: 'C ≡ G', col: COL.red },
      { y: 270, bp: 'T — A', col: COL.amber },
    ].map((r, i) => (
      <g key={i}>
        <line x1="225" y1={r.y} x2="375" y2={r.y} stroke={r.col} strokeWidth="1.5" opacity="0.7" />
        <text x="300" y={r.y + 4} textAnchor="middle" fill={r.col} fontSize="11" fontWeight="700">{r.bp}</text>
      </g>
    ))}
    {/* Strand direction labels */}
    <text x="200" y="40" textAnchor="middle" fill={COL.cyan} fontSize="11" fontWeight="700">5'</text>
    <text x="200" y="305" textAnchor="middle" fill={COL.cyan} fontSize="11" fontWeight="700">3'</text>
    <text x="400" y="40" textAnchor="middle" fill={COL.green} fontSize="11" fontWeight="700">3'</text>
    <text x="400" y="305" textAnchor="middle" fill={COL.green} fontSize="11" fontWeight="700">5'</text>
    <text x="100" y="170" fill={COL.cyan} fontSize="11">sugar-</text>
    <text x="100" y="184" fill={COL.cyan} fontSize="11">phosphate</text>
    <text x="100" y="198" fill={COL.cyan} fontSize="11">backbone</text>
    {/* Legend */}
    <text x="510" y="100" fill={COL.amber} fontSize="11">A=T (2 H-bonds)</text>
    <text x="510" y="120" fill={COL.red} fontSize="11">G≡C (3 H-bonds)</text>
  </svg>
);

// ------------------------------------------------------------------
// 2.1 Cell organelles overview
// ------------------------------------------------------------------
const CellOverview = () => (
  <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" aria-label="Eukaryotic cell organelles">
    <rect x="0" y="0" width="600" height="320" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Eukaryotic cell — major organelles</text>
    {/* Outer membrane */}
    <ellipse cx="300" cy="170" rx="240" ry="120" fill="rgba(34, 211, 238, 0.05)" stroke={COL.cyan} strokeWidth="2" />
    {/* Nucleus */}
    <circle cx="280" cy="170" r="55" fill="rgba(34, 197, 94, 0.12)" stroke={COL.green} strokeWidth="2" />
    <circle cx="280" cy="170" r="20" fill="rgba(34, 197, 94, 0.4)" stroke={COL.green} strokeWidth="1" />
    <text x="280" y="174" textAnchor="middle" fill={COL.green} fontSize="11" fontWeight="700">Nucleus</text>
    <text x="280" y="100" textAnchor="middle" fill={COL.green} fontSize="9">DNA storage, transcription</text>
    {/* Mitochondria */}
    <ellipse cx="170" cy="115" rx="35" ry="18" fill="rgba(239, 68, 68, 0.2)" stroke={COL.red} />
    <text x="170" y="119" textAnchor="middle" fill={COL.red} fontSize="10" fontWeight="700">Mitochondrion</text>
    <text x="80" y="80" fill={COL.red} fontSize="9">ATP / respiration</text>
    {/* ER */}
    <path d="M 350,80 Q 420,120 380,160 Q 440,180 410,220" stroke={COL.amber} strokeWidth="3" fill="none" />
    <text x="450" y="135" fill={COL.amber} fontSize="10" fontWeight="700">ER</text>
    <text x="450" y="150" fill={COL.amber} fontSize="9">protein, lipid synth.</text>
    {/* Golgi */}
    {[0, 6, 12, 18].map((y, i) => (
      <path key={i} d={`M 420,${230+y} Q 460,${235+y} 480,${230+y}`} stroke={COL.cyan} strokeWidth="2" fill="none" />
    ))}
    <text x="490" y="245" fill={COL.cyan} fontSize="10" fontWeight="700">Golgi</text>
    <text x="490" y="259" fill={COL.cyan} fontSize="9">packaging</text>
    {/* Lysosome */}
    <circle cx="160" cy="225" r="14" fill="rgba(251,191,36,0.4)" stroke={COL.amber} />
    <text x="160" y="229" textAnchor="middle" fill="#0b1220" fontSize="10" fontWeight="700">L</text>
    <text x="80" y="225" fill={COL.amber} fontSize="9">Lysosome</text>
    <text x="80" y="239" fill={COL.amber} fontSize="9">digestion</text>
    {/* Ribosomes (dots) */}
    {[[240,110],[260,250],[200,260],[340,140],[330,220]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="3" fill={COL.text} />
    ))}
    <text x="540" y="270" textAnchor="end" fill={COL.slate} fontSize="10">• = ribosomes</text>
    {/* Membrane label */}
    <text x="300" y="295" textAnchor="middle" fill={COL.cyan} fontSize="11" fontWeight="700">Plasma membrane (phospholipid bilayer)</text>
  </svg>
);

// ------------------------------------------------------------------
// 2.3 Phospholipid bilayer
// ------------------------------------------------------------------
const PhospholipidBilayer = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Phospholipid bilayer structure">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Phospholipid bilayer</text>
    {/* Water above */}
    <text x="40" y="60" fill={COL.cyan} fontSize="11">Water (outside)</text>
    {/* Phospholipids top layer */}
    {Array.from({length: 12}, (_, i) => 50 + i*42).map((x, i) => (
      <g key={`top-${i}`}>
        <circle cx={x} cy="90" r="9" fill={COL.cyan} />
        <line x1={x-3} y1="99" x2={x-3} y2="130" stroke={COL.amber} strokeWidth="2" />
        <line x1={x+3} y1="99" x2={x+3} y2="130" stroke={COL.amber} strokeWidth="2" />
      </g>
    ))}
    {/* Phospholipids bottom layer */}
    {Array.from({length: 12}, (_, i) => 50 + i*42).map((x, i) => (
      <g key={`bot-${i}`}>
        <line x1={x-3} y1="130" x2={x-3} y2="161" stroke={COL.amber} strokeWidth="2" />
        <line x1={x+3} y1="130" x2={x+3} y2="161" stroke={COL.amber} strokeWidth="2" />
        <circle cx={x} cy="170" r="9" fill={COL.cyan} />
      </g>
    ))}
    {/* Labels */}
    <text x="40" y="190" fill={COL.cyan} fontSize="11">Water (inside)</text>
    <text x="540" y="92" textAnchor="end" fill={COL.cyan} fontSize="11" fontWeight="700">← hydrophilic heads</text>
    <text x="540" y="130" textAnchor="end" fill={COL.amber} fontSize="11" fontWeight="700">← hydrophobic tails</text>
    <text x="540" y="173" textAnchor="end" fill={COL.cyan} fontSize="11" fontWeight="700">← hydrophilic heads</text>
    {/* Caption */}
    <text x="300" y="220" textAnchor="middle" fill={COL.slate} fontSize="11">Amphipathic phospholipids self-assemble in water — heads face out, tails inside</text>
    <text x="300" y="238" textAnchor="middle" fill={COL.slate} fontSize="11">Selectively permeable: small nonpolar molecules cross; ions/large polar need transporters</text>
  </svg>
);

// ------------------------------------------------------------------
// 3.5 Photosynthesis overview
// ------------------------------------------------------------------
const Photosynthesis = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Photosynthesis overview">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Photosynthesis: 6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂</text>
    {/* Chloroplast outline */}
    <ellipse cx="300" cy="160" rx="240" ry="90" fill="rgba(34,197,94,0.06)" stroke={COL.green} strokeWidth="2" />
    {/* Thylakoid stacks (grana) */}
    {[60, 130, 200, 270].map((x, i) => (
      <g key={`grana-${i}`}>
        {[0, 8, 16, 24].map((y, j) => (
          <rect key={j} x={70+x} y={130+y} width="50" height="6" fill={COL.green} opacity="0.7" />
        ))}
      </g>
    ))}
    {/* Sun */}
    <circle cx="80" cy="60" r="18" fill="#fbbf24" />
    {/* Light arrows hitting thylakoids */}
    {[150, 220].map((x) => (
      <line key={x} x1="95" y1="75" x2={x} y2="135" stroke="#fbbf24" strokeWidth="1.5" />
    ))}
    {/* Inputs */}
    <text x="40" y="160" fill={COL.cyan} fontSize="12" fontWeight="700">H₂O ↓</text>
    <text x="40" y="220" fill={COL.red} fontSize="12" fontWeight="700">CO₂ ↓</text>
    {/* Outputs */}
    <text x="550" y="160" textAnchor="end" fill={COL.cyan} fontSize="12" fontWeight="700">↑ O₂</text>
    <text x="550" y="220" textAnchor="end" fill={COL.amber} fontSize="12" fontWeight="700">↑ glucose</text>
    {/* Internal labels */}
    <text x="300" y="118" textAnchor="middle" fill={COL.green} fontSize="11" fontWeight="700">Thylakoid stacks (grana) — light reactions → ATP + NADPH</text>
    <text x="300" y="225" textAnchor="middle" fill={COL.cyan} fontSize="11" fontWeight="700">Stroma — Calvin cycle (CO₂ fixation via RuBisCO)</text>
    <text x="300" y="263" textAnchor="middle" fill={COL.slate} fontSize="10">Two stages: light reactions (thylakoid) + Calvin cycle (stroma)</text>
  </svg>
);

// ------------------------------------------------------------------
// 3.6 Cellular respiration
// ------------------------------------------------------------------
const Respiration = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Cellular respiration overview">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Cellular respiration: glucose + O₂ → CO₂ + H₂O + ~32 ATP</text>
    {[
      { x: 30,  label: 'Glycolysis',      where: 'cytoplasm',        atp: '2 ATP + 2 NADH', col: COL.cyan },
      { x: 175, label: 'Pyruvate ox',     where: 'matrix',           atp: '2 NADH + 2 CO₂', col: '#67e8f9' },
      { x: 320, label: 'Krebs cycle',     where: 'matrix',           atp: '2 ATP + 6 NADH + 2 FADH₂', col: COL.amber },
      { x: 465, label: 'ETC + OxPhos',    where: 'inner membrane',   atp: '~28 ATP, O₂ → H₂O', col: COL.green },
    ].map((s, i) => (
      <g key={i}>
        <rect x={s.x} y="55" width="120" height="140" rx="8" fill={s.col} opacity="0.16" stroke={s.col} strokeWidth="1.5" />
        <text x={s.x + 60} y="80" textAnchor="middle" fill={s.col} fontSize="13" fontWeight="700">{i+1}. {s.label}</text>
        <text x={s.x + 60} y="100" textAnchor="middle" fill={COL.textDim} fontSize="10">in {s.where}</text>
        <text x={s.x + 60} y="140" textAnchor="middle" fill={COL.text} fontSize="10">{s.atp.split(' + ').map((p, j) => (
          <tspan key={j} x={s.x + 60} dy={j === 0 ? 0 : 14}>{p}</tspan>
        ))}</text>
        {i < 3 && <line x1={s.x+120} y1="125" x2={s.x+148} y2="125" stroke={COL.slate} strokeWidth="2" markerEnd="url(#rArrow)" />}
      </g>
    ))}
    <text x="300" y="225" textAnchor="middle" fill={COL.green} fontSize="11" fontWeight="700">Net: ~32 ATP per glucose (aerobic)</text>
    <text x="300" y="243" textAnchor="middle" fill={COL.slate} fontSize="10">Anaerobic alternatives (fermentation) yield only 2 ATP per glucose — 16× less</text>
    <defs>
      <marker id="rArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.slate} />
      </marker>
    </defs>
  </svg>
);

// ------------------------------------------------------------------
// 4.6 Mitosis phases
// ------------------------------------------------------------------
const MitosisStages = () => (
  <svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" aria-label="Mitosis stages">
    <rect x="0" y="0" width="600" height="220" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Mitosis — five stages</text>
    {[
      { x: 30,  label: 'Prophase',    note: 'chromosomes condense' },
      { x: 145, label: 'Metaphase',   note: 'align at equator' },
      { x: 260, label: 'Anaphase',    note: 'chromatids separate' },
      { x: 375, label: 'Telophase',   note: 'nuclei reform' },
      { x: 490, label: 'Cytokinesis', note: 'cell divides' },
    ].map((s, i) => (
      <g key={i}>
        <circle cx={s.x + 50} cy="100" r="36" fill="rgba(34,211,238,0.10)" stroke={COL.cyan} strokeWidth="1.5" />
        {/* Stage-specific visual */}
        {i === 0 && <>
          <line x1={s.x+38} y1="92" x2={s.x+62} y2="108" stroke={COL.text} strokeWidth="2.5" />
          <line x1={s.x+38} y1="108" x2={s.x+62} y2="92" stroke={COL.text} strokeWidth="2.5" />
        </>}
        {i === 1 && <>
          <line x1={s.x+50} y1="80" x2={s.x+50} y2="120" stroke={COL.cyan} strokeWidth="1" strokeDasharray="3 3" />
          <line x1={s.x+40} y1="100" x2={s.x+60} y2="100" stroke={COL.text} strokeWidth="3" />
          <line x1={s.x+40} y1="90" x2={s.x+60} y2="90" stroke={COL.text} strokeWidth="3" />
        </>}
        {i === 2 && <>
          <line x1={s.x+45} y1="85" x2={s.x+30} y2="80" stroke={COL.text} strokeWidth="2" />
          <line x1={s.x+55} y1="85" x2={s.x+70} y2="80" stroke={COL.text} strokeWidth="2" />
          <line x1={s.x+45} y1="115" x2={s.x+30} y2="120" stroke={COL.text} strokeWidth="2" />
          <line x1={s.x+55} y1="115" x2={s.x+70} y2="120" stroke={COL.text} strokeWidth="2" />
        </>}
        {i === 3 && <>
          <circle cx={s.x+35} cy="100" r="9" fill="none" stroke={COL.green} />
          <circle cx={s.x+65} cy="100" r="9" fill="none" stroke={COL.green} />
        </>}
        {i === 4 && <>
          <circle cx={s.x+35} cy="100" r="14" fill="none" stroke={COL.green} strokeWidth="1.5" />
          <circle cx={s.x+65} cy="100" r="14" fill="none" stroke={COL.green} strokeWidth="1.5" />
        </>}
        <text x={s.x + 50} y="160" textAnchor="middle" fill={COL.text} fontSize="11" fontWeight="700">{s.label}</text>
        <text x={s.x + 50} y="175" textAnchor="middle" fill={COL.slate} fontSize="9">{s.note}</text>
      </g>
    ))}
    <text x="300" y="205" textAnchor="middle" fill={COL.slate} fontSize="10">Result: two genetically identical daughter cells</text>
  </svg>
);

// ------------------------------------------------------------------
// 5.1 Meiosis vs mitosis
// ------------------------------------------------------------------
const MeiosisVsMitosis = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Meiosis vs mitosis">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Mitosis vs meiosis</text>
    {/* Mitosis row */}
    <text x="20" y="65" fill={COL.cyan} fontSize="12" fontWeight="700">Mitosis</text>
    <text x="20" y="80" fill={COL.slate} fontSize="9">growth + repair</text>
    <circle cx="120" cy="80" r="20" fill="rgba(34,211,238,0.2)" stroke={COL.cyan} strokeWidth="1.5" />
    <text x="120" y="84" textAnchor="middle" fill={COL.cyan} fontSize="10">2n</text>
    <line x1="145" y1="80" x2="220" y2="80" stroke={COL.dim} markerEnd="url(#mArrow)" />
    <circle cx="260" cy="60" r="16" fill="rgba(34,211,238,0.2)" stroke={COL.cyan} strokeWidth="1.5" />
    <text x="260" y="64" textAnchor="middle" fill={COL.cyan} fontSize="10">2n</text>
    <circle cx="260" cy="100" r="16" fill="rgba(34,211,238,0.2)" stroke={COL.cyan} strokeWidth="1.5" />
    <text x="260" y="104" textAnchor="middle" fill={COL.cyan} fontSize="10">2n</text>
    <text x="320" y="85" fill={COL.cyan} fontSize="11">2 identical diploid cells</text>
    {/* Meiosis row */}
    <text x="20" y="175" fill={COL.green} fontSize="12" fontWeight="700">Meiosis</text>
    <text x="20" y="190" fill={COL.slate} fontSize="9">gametes</text>
    <circle cx="120" cy="190" r="20" fill="rgba(34,197,94,0.2)" stroke={COL.green} strokeWidth="1.5" />
    <text x="120" y="194" textAnchor="middle" fill={COL.green} fontSize="10">2n</text>
    <line x1="145" y1="190" x2="220" y2="190" stroke={COL.dim} markerEnd="url(#mArrow)" />
    {[
      { cx: 260, cy: 160 }, { cx: 260, cy: 195 },
      { cx: 260, cy: 230 }, { cx: 260, cy: 195 },
    ].slice(0, 4).map((c, i) => (
      <g key={i}>
        <circle cx={260 + (i%2)*30} cy={160 + Math.floor(i/2)*40} r="13" fill="rgba(34,197,94,0.2)" stroke={COL.green} strokeWidth="1.5" />
        <text x={260 + (i%2)*30} y={164 + Math.floor(i/2)*40} textAnchor="middle" fill={COL.green} fontSize="9">n</text>
      </g>
    ))}
    <text x="340" y="195" fill={COL.green} fontSize="11">4 unique haploid cells</text>
    <text x="320" y="248" textAnchor="middle" fill={COL.slate} fontSize="10">Meiosis: 2 divisions; crossing over + independent assortment → genetic variation</text>
    <defs>
      <marker id="mArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.dim} />
      </marker>
    </defs>
  </svg>
);

// ------------------------------------------------------------------
// 7.1 Natural selection mechanism
// ------------------------------------------------------------------
const NaturalSelection = () => (
  <svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" aria-label="Natural selection mechanism">
    <rect x="0" y="0" width="600" height="220" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Natural selection — Darwin\'s logic</text>
    {[
      { x: 20,  label: 'Variation',        note: 'individuals differ' },
      { x: 165, label: 'Heritability',     note: 'traits passed on' },
      { x: 310, label: 'Differential fitness', note: 'some reproduce more' },
      { x: 455, label: 'Allele frequencies shift', note: 'population evolves' },
    ].map((s, i) => (
      <g key={i}>
        <rect x={s.x} y="60" width="125" height="110" rx="8" fill={COL.green} opacity="0.12" stroke={COL.green} strokeWidth="1.5" />
        <text x={s.x + 62} y="90" textAnchor="middle" fill={COL.green} fontSize="12" fontWeight="700">{i+1}.</text>
        <text x={s.x + 62} y="112" textAnchor="middle" fill={COL.text} fontSize="11" fontWeight="700">{s.label}</text>
        <text x={s.x + 62} y="138" textAnchor="middle" fill={COL.slate} fontSize="10">{s.note}</text>
        {i < 3 && <line x1={s.x+125} y1="120" x2={s.x+158} y2="120" stroke={COL.slate} strokeWidth="2" markerEnd="url(#nsArrow)" />}
      </g>
    ))}
    <text x="300" y="200" textAnchor="middle" fill={COL.slate} fontSize="10">No goal, no purpose — populations change as environment selects.</text>
    <defs>
      <marker id="nsArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.slate} />
      </marker>
    </defs>
  </svg>
);

// ------------------------------------------------------------------
// 7.2 Three modes of selection
// ------------------------------------------------------------------
const SelectionModes = () => {
  const W = 600, H = 220;
  const renderCurve = (cx, label, peakLeft, peakRight, before, after) => {
    const xs = (pct) => cx - 70 + pct * 1.4;
    return (
      <g>
        <text x={cx} y="46" textAnchor="middle" fill={COL.cyan} fontSize="12" fontWeight="700">{label}</text>
        {/* Before curve */}
        <path d={before} stroke={COL.dim} strokeWidth="2" fill="none" strokeDasharray="4 3" />
        {/* After curve */}
        <path d={after} stroke={COL.green} strokeWidth="2.5" fill="none" />
        {/* Axis */}
        <line x1={xs(0)} y1="175" x2={xs(100)} y2="175" stroke={COL.dim} />
      </g>
    );
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label="Three modes of selection">
      <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
      <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Three modes of natural selection</text>
      {renderCurve(120, 'Directional', 0, 0,
        'M 50,170 Q 90,80 120,140 Q 150,170 190,170',
        'M 50,170 Q 60,170 110,170 Q 160,80 190,140'
      )}
      {renderCurve(300, 'Stabilizing', 0, 0,
        'M 230,170 Q 270,90 300,140 Q 330,170 370,170',
        'M 230,170 Q 260,170 295,75 Q 330,170 370,170'
      )}
      {renderCurve(480, 'Disruptive', 0, 0,
        'M 410,170 Q 450,90 480,140 Q 510,170 550,170',
        'M 410,170 Q 420,90 450,150 Q 480,170 510,90 Q 540,170 550,170'
      )}
      <text x="120" y="200" textAnchor="middle" fill={COL.slate} fontSize="9">Favors one extreme</text>
      <text x="300" y="200" textAnchor="middle" fill={COL.slate} fontSize="9">Favors middle</text>
      <text x="480" y="200" textAnchor="middle" fill={COL.slate} fontSize="9">Favors both extremes</text>
      <text x="50" y="216" fill={COL.slate} fontSize="9">Dashed = before;  solid = after selection</text>
    </svg>
  );
};

// ------------------------------------------------------------------
// 8.2 Trophic pyramid
// ------------------------------------------------------------------
const TrophicPyramid = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Trophic pyramid 10% rule">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Energy pyramid — Lindeman\'s 10% rule</text>
    {[
      { y: 50,  w: 80,  energy: '1 kcal',     label: 'Tertiary',  col: COL.red },
      { y: 95,  w: 160, energy: '10 kcal',    label: 'Secondary', col: '#f97316' },
      { y: 150, w: 260, energy: '100 kcal',   label: 'Primary consumer',   col: COL.amber },
      { y: 215, w: 380, energy: '1,000 kcal', label: 'Producer',  col: COL.green },
    ].map((t, i) => (
      <g key={i}>
        <rect x={300 - t.w/2} y={t.y} width={t.w} height={40} fill={t.col} opacity="0.8" rx="3" />
        <text x="300" y={t.y + 26} textAnchor="middle" fill="#0b1220" fontSize="14" fontWeight="700">{t.energy}</text>
        <text x={300 + t.w/2 + 12} y={t.y + 18} fill={COL.textDim} fontSize="11">{t.label}</text>
        {i > 0 && <text x={300 - t.w/2 - 12} y={t.y + 22} fill={COL.slate} fontSize="10" textAnchor="end">×0.1</text>}
      </g>
    ))}
    <text x="300" y="275" textAnchor="middle" fill={COL.slate} fontSize="10">~90% of energy lost at each transfer as heat → food chains limited to 4-5 levels</text>
  </svg>
);

// ------------------------------------------------------------------
// REGISTRY
// ------------------------------------------------------------------
export const APBIO_FIGURES = {
  '1.1': [{ id: 'water', Cmp: WaterHBond, caption: 'Water\'s polarity drives hydrogen bonding — and nearly every special property of water.', source: 'KUA Carbon Dashboard · authored' }],
  '1.3': [{ id: 'macromol', Cmp: FourMacromolecules, caption: 'Four classes of biological macromolecules, their monomers, polymers, bond types, and functions.', source: 'KUA Carbon Dashboard · authored' }],
  '1.6': [{ id: 'dna', Cmp: DNAHelix, caption: 'DNA antiparallel double helix. A-T pairs have 2 H-bonds; G-C pairs have 3 (stronger).', source: 'After Watson & Crick 1953' }],
  '2.1': [{ id: 'cell', Cmp: CellOverview, caption: 'Eukaryotic cell with major membrane-bound organelles. Plants additionally have a cell wall, chloroplasts, and a large central vacuole.', source: 'KUA Carbon Dashboard · authored' }],
  '2.3': [{ id: 'bilayer', Cmp: PhospholipidBilayer, caption: 'Amphipathic phospholipids self-assemble in water — heads face out, tails are sequestered inside.', source: 'KUA Carbon Dashboard · authored' }],
  '3.5': [{ id: 'photo', Cmp: Photosynthesis, caption: 'Photosynthesis has two stages: light reactions on the thylakoid membrane and the Calvin cycle in the stroma.', source: 'Reactions: standard biochemistry' }],
  '3.6': [{ id: 'resp', Cmp: Respiration, caption: 'Aerobic respiration has 4 stages and yields ~32 ATP per glucose. Without O₂, only glycolysis runs and yields just 2 ATP.', source: 'KUA Carbon Dashboard · authored' }],
  '4.6': [{ id: 'mitosis', Cmp: MitosisStages, caption: 'Mitosis produces two genetically identical daughter cells from one parent cell.', source: 'KUA Carbon Dashboard · authored' }],
  '5.1': [{ id: 'meiosis', Cmp: MeiosisVsMitosis, caption: 'Meiosis (2 divisions) produces 4 haploid gametes; mitosis (1 division) produces 2 diploid copies.', source: 'KUA Carbon Dashboard · authored' }],
  '7.1': [{ id: 'natsel', Cmp: NaturalSelection, caption: 'Darwin\'s logic: variation + heritability + differential fitness → evolution.', source: 'After Darwin 1859' }],
  '7.2': [{ id: 'sel-modes', Cmp: SelectionModes, caption: 'Three modes of selection: directional (shifts mean), stabilizing (reduces variance), disruptive (creates bimodal distribution).', source: 'KUA Carbon Dashboard · authored' }],
  '8.2': [{ id: 'trophic', Cmp: TrophicPyramid, caption: 'Lindeman\'s 10% rule explains why food chains rarely exceed 4-5 trophic levels.', source: 'Lindeman 1942' }],
};
