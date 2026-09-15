// Inline SVG diagrams for the APES viewer.
// Editorial register (NYT / Our World in Data), not clipart.
// Each entry maps a subunit code → array of figure descriptors.
// Figures render inline within the subunit body, breaking up text.
//
// Why inline SVG over bitmap:
//   1. No license/attribution risk — every figure authored here
//   2. Crisp at any zoom (Chromebook → projector)
//   3. Small (typical ~2-4 KB each, no network)
//   4. Editable from source — captions and labels are real text
//
// Adding a figure: add an entry under APES_FIGURES[subunit-code]
// with { id, caption, source (attribution), svg (React node) }.
// The viewer picks them up automatically.

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
  ocean: '#1e3a5f',
  land: '#0f3a25',
  ice: '#cbd5e1',
};

// ------------------------------------------------------------------
// 1.2  Terrestrial biomes — world strip showing biome by latitude
// ------------------------------------------------------------------
const BiomeStrip = () => (
  <svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" aria-label="Terrestrial biomes by latitude band">
    <rect x="0" y="0" width="600" height="220" fill={COL.bgLight} />
    {/* Latitude bands as horizontal stripes */}
    {[
      { y: 20,  h: 18, name: 'Tundra',                   col: '#cbd5e1', lat: '60-90°' },
      { y: 42,  h: 22, name: 'Boreal forest (taiga)',    col: '#1f5e3a', lat: '50-60°' },
      { y: 68,  h: 26, name: 'Temperate deciduous',      col: '#3a8e4d', lat: '30-50°' },
      { y: 98,  h: 22, name: 'Temperate grassland',      col: '#b89b3a', lat: '30-50°' },
      { y: 124, h: 22, name: 'Desert',                   col: '#c47842', lat: '~30°' },
      { y: 150, h: 22, name: 'Savanna',                  col: '#8b8b3a', lat: '10-25°' },
      { y: 176, h: 26, name: 'Tropical rainforest',      col: '#0d5e2f', lat: '0-10°' },
    ].map((b, i) => (
      <g key={i}>
        <rect x="120" y={b.y} width="360" height={b.h - 2} fill={b.col} opacity="0.85" />
        <text x="115" y={b.y + b.h / 2 + 4} fill={COL.textDim} fontSize="11" textAnchor="end">{b.name}</text>
        <text x="485" y={b.y + b.h / 2 + 4} fill={COL.slate} fontSize="10">{b.lat}</text>
      </g>
    ))}
    {/* Axis label */}
    <text x="300" y="215" fill={COL.slate} fontSize="10" textAnchor="middle">
      Biomes by climate band — equator at bottom, poles at top
    </text>
  </svg>
);

// ------------------------------------------------------------------
// 1.4  Carbon cycle — pools and major fluxes
// ------------------------------------------------------------------
const CarbonCycle = () => (
  <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" aria-label="Carbon cycle pools and fluxes">
    <rect x="0" y="0" width="600" height="320" fill={COL.bgLight} />
    {/* Atmosphere */}
    <g>
      <rect x="100" y="30" width="400" height="50" rx="6" fill="rgba(34, 211, 238, 0.15)" stroke={COL.cyan} strokeWidth="1.5" />
      <text x="300" y="55" fill={COL.cyan} fontSize="13" fontWeight="700" textAnchor="middle">Atmosphere</text>
      <text x="300" y="70" fill={COL.textDim} fontSize="10" textAnchor="middle">~875 Gt C (rising)</text>
    </g>
    {/* Ocean */}
    <g>
      <rect x="40" y="220" width="180" height="60" rx="6" fill="rgba(30, 58, 95, 0.6)" stroke={COL.cyan} strokeWidth="1.5" />
      <text x="130" y="246" fill={COL.cyan} fontSize="12" fontWeight="700" textAnchor="middle">Ocean</text>
      <text x="130" y="262" fill={COL.textDim} fontSize="10" textAnchor="middle">~38,000 Gt C</text>
      <text x="130" y="275" fill={COL.slate} fontSize="9" textAnchor="middle">largest fast-exchange pool</text>
    </g>
    {/* Biosphere */}
    <g>
      <rect x="240" y="220" width="180" height="60" rx="6" fill="rgba(34, 197, 94, 0.18)" stroke={COL.green} strokeWidth="1.5" />
      <text x="330" y="246" fill={COL.green} fontSize="12" fontWeight="700" textAnchor="middle">Biosphere</text>
      <text x="330" y="262" fill={COL.textDim} fontSize="10" textAnchor="middle">~2,000 Gt C</text>
      <text x="330" y="275" fill={COL.slate} fontSize="9" textAnchor="middle">plants + soil</text>
    </g>
    {/* Fossil */}
    <g>
      <rect x="440" y="220" width="130" height="60" rx="6" fill="rgba(239, 68, 68, 0.18)" stroke={COL.red} strokeWidth="1.5" />
      <text x="505" y="246" fill={COL.red} fontSize="12" fontWeight="700" textAnchor="middle">Fossil reserves</text>
      <text x="505" y="262" fill={COL.textDim} fontSize="10" textAnchor="middle">~5,000 Gt C</text>
      <text x="505" y="275" fill={COL.slate} fontSize="9" textAnchor="middle">underground</text>
    </g>

    {/* Fluxes — arrows */}
    {/* Ocean <-> Atmosphere */}
    <line x1="130" y1="220" x2="200" y2="80" stroke={COL.cyan} strokeWidth="1.5" markerEnd="url(#arrowCyan)" />
    <line x1="200" y1="90" x2="130" y2="220" stroke={COL.cyan} strokeWidth="1.5" markerEnd="url(#arrowCyan)" opacity="0.6" />
    <text x="155" y="160" fill={COL.cyan} fontSize="10">~90 Gt/yr each way</text>

    {/* Biosphere <-> Atmosphere */}
    <line x1="330" y1="220" x2="330" y2="85" stroke={COL.green} strokeWidth="2" markerEnd="url(#arrowGreen)" />
    <line x1="350" y1="90" x2="350" y2="220" stroke={COL.green} strokeWidth="2" markerEnd="url(#arrowGreen)" opacity="0.6" />
    <text x="362" y="160" fill={COL.green} fontSize="10">photosynthesis ↑</text>
    <text x="362" y="175" fill={COL.green} fontSize="10">respiration ↓</text>
    <text x="362" y="190" fill={COL.green} fontSize="10">~170 / ~120 Gt/yr</text>

    {/* Fossil → Atmosphere (the human disruption) */}
    <line x1="505" y1="220" x2="450" y2="85" stroke={COL.red} strokeWidth="2.5" markerEnd="url(#arrowRed)" />
    <text x="510" y="155" fill={COL.red} fontSize="11" fontWeight="700">Human</text>
    <text x="510" y="170" fill={COL.red} fontSize="11" fontWeight="700">emissions</text>
    <text x="510" y="185" fill={COL.red} fontSize="10">~12 Gt C/yr</text>

    {/* Arrow markers */}
    <defs>
      <marker id="arrowCyan" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.cyan} />
      </marker>
      <marker id="arrowGreen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.green} />
      </marker>
      <marker id="arrowRed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.red} />
      </marker>
    </defs>
  </svg>
);

// ------------------------------------------------------------------
// 1.5  Nitrogen cycle — atmosphere → fixation → soil → denitrification
// ------------------------------------------------------------------
const NitrogenCycle = () => (
  <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" aria-label="Nitrogen cycle">
    <rect x="0" y="0" width="600" height="300" fill={COL.bgLight} />
    {/* Atmosphere top */}
    <rect x="0" y="0" width="600" height="60" fill="rgba(34, 211, 238, 0.10)" />
    <text x="300" y="28" fill={COL.cyan} fontSize="13" fontWeight="700" textAnchor="middle">Atmosphere · 78% N₂</text>
    <text x="300" y="46" fill={COL.textDim} fontSize="10" textAnchor="middle">most life can't use N₂ directly — triple bond is too strong</text>

    {/* Soil bottom */}
    <rect x="0" y="220" width="600" height="80" fill="rgba(120, 80, 40, 0.18)" />
    <text x="300" y="290" fill={COL.amber} fontSize="11" textAnchor="middle">Soil</text>

    {/* Pathways */}
    {/* Lightning */}
    <g>
      <line x1="100" y1="60" x2="100" y2="220" stroke={COL.amber} strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrowAmber)" />
      <text x="100" y="140" fill={COL.amber} fontSize="11" textAnchor="middle">⚡</text>
      <text x="100" y="160" fill={COL.amber} fontSize="10" textAnchor="middle">Lightning</text>
      <text x="100" y="175" fill={COL.slate} fontSize="9" textAnchor="middle">~10 Tg/yr</text>
    </g>
    {/* Biological fixation */}
    <g>
      <line x1="240" y1="60" x2="240" y2="220" stroke={COL.green} strokeWidth="2" markerEnd="url(#arrowGreen2)" />
      <text x="240" y="140" fill={COL.green} fontSize="10" textAnchor="middle">Bacteria</text>
      <text x="240" y="155" fill={COL.green} fontSize="10" textAnchor="middle">(Rhizobium)</text>
      <text x="240" y="170" fill={COL.slate} fontSize="9" textAnchor="middle">~100 Tg/yr</text>
    </g>
    {/* Haber-Bosch */}
    <g>
      <line x1="380" y1="60" x2="380" y2="220" stroke={COL.red} strokeWidth="2.5" markerEnd="url(#arrowRed2)" />
      <text x="380" y="140" fill={COL.red} fontSize="11" textAnchor="middle" fontWeight="700">Haber-Bosch</text>
      <text x="380" y="155" fill={COL.red} fontSize="10" textAnchor="middle">(human, fertilizer)</text>
      <text x="380" y="170" fill={COL.slate} fontSize="9" textAnchor="middle">~150 Tg/yr</text>
    </g>
    {/* Denitrification (return) */}
    <g>
      <line x1="520" y1="220" x2="520" y2="60" stroke={COL.cyan} strokeWidth="2" markerEnd="url(#arrowCyan2)" />
      <text x="520" y="135" fill={COL.cyan} fontSize="10" textAnchor="middle">Denitrification</text>
      <text x="520" y="150" fill={COL.cyan} fontSize="10" textAnchor="middle">bacteria → N₂</text>
      <text x="520" y="165" fill={COL.slate} fontSize="9" textAnchor="middle">closes the cycle</text>
    </g>

    {/* Soil forms */}
    <text x="300" y="245" fill={COL.amber} fontSize="11" textAnchor="middle">NH₄⁺ → NO₂⁻ → NO₃⁻  (nitrification)</text>
    <text x="300" y="262" fill={COL.textDim} fontSize="10" textAnchor="middle">plants assimilate; decomposers ammonify</text>

    <defs>
      <marker id="arrowAmber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.amber} />
      </marker>
      <marker id="arrowGreen2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.green} />
      </marker>
      <marker id="arrowRed2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.red} />
      </marker>
      <marker id="arrowCyan2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.cyan} />
      </marker>
    </defs>
  </svg>
);

// ------------------------------------------------------------------
// 1.7  Hydrologic cycle
// ------------------------------------------------------------------
const WaterCycle = () => (
  <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" aria-label="Hydrologic cycle">
    <rect x="0" y="0" width="600" height="300" fill={COL.bgLight} />
    {/* Sun */}
    <circle cx="80" cy="50" r="22" fill="#fbbf24" />
    <text x="80" y="55" textAnchor="middle" fill="#0b1220" fontSize="12" fontWeight="700">☀</text>
    {/* Ocean */}
    <rect x="0" y="220" width="280" height="80" fill={COL.ocean} />
    <text x="140" y="265" textAnchor="middle" fill={COL.cyan} fontSize="14" fontWeight="700">Ocean</text>
    <text x="140" y="282" textAnchor="middle" fill={COL.textDim} fontSize="10">97.5% of Earth's water</text>
    {/* Land */}
    <polygon points="280,220 280,300 600,300 600,180" fill={COL.land} />
    <text x="440" y="290" textAnchor="middle" fill={COL.green} fontSize="13" fontWeight="700">Land</text>
    {/* Mountains */}
    <polygon points="350,220 410,150 470,220" fill="#475569" />
    <polygon points="450,220 510,170 570,220" fill="#475569" />
    {/* Cloud */}
    <g transform="translate(280,80)">
      <ellipse cx="0" cy="0" rx="80" ry="22" fill={COL.slate} opacity="0.7" />
      <ellipse cx="-30" cy="-12" rx="30" ry="16" fill={COL.slate} opacity="0.7" />
      <ellipse cx="30" cy="-12" rx="30" ry="16" fill={COL.slate} opacity="0.7" />
    </g>
    {/* Evaporation arrow (ocean → cloud) */}
    <path d="M 150 220 Q 170 150 240 90" stroke={COL.cyan} strokeWidth="2" fill="none" markerEnd="url(#arrowCyan3)" />
    <text x="120" y="170" fill={COL.cyan} fontSize="11">Evaporation</text>
    {/* Precipitation arrow (cloud → land) */}
    <line x1="320" y1="100" x2="430" y2="170" stroke={COL.cyan} strokeWidth="2" markerEnd="url(#arrowCyan3)" />
    <text x="330" y="150" fill={COL.cyan} fontSize="11">Precipitation</text>
    {/* Runoff (land → ocean) */}
    <path d="M 410 220 Q 320 240 280 235" stroke="#67e8f9" strokeWidth="2" fill="none" markerEnd="url(#arrowCyan3)" />
    <text x="320" y="215" fill="#67e8f9" fontSize="10">Runoff</text>
    {/* Transpiration */}
    <line x1="500" y1="200" x2="350" y2="110" stroke={COL.green} strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrowGreen3)" />
    <text x="480" y="170" fill={COL.green} fontSize="10">Transpiration</text>

    <defs>
      <marker id="arrowCyan3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.cyan} />
      </marker>
      <marker id="arrowGreen3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.green} />
      </marker>
    </defs>
  </svg>
);

// ------------------------------------------------------------------
// 1.10 Trophic pyramid (10% rule)
// ------------------------------------------------------------------
const TrophicPyramid = () => (
  <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" aria-label="Trophic pyramid showing 10% energy transfer">
    <rect x="0" y="0" width="600" height="300" fill={COL.bgLight} />
    {[
      { y: 30,  w: 80,  energy: '1 kcal',     label: 'Tertiary (top predator)', col: COL.red },
      { y: 75,  w: 160, energy: '10 kcal',    label: 'Secondary (carnivore)',   col: '#f97316' },
      { y: 130, w: 260, energy: '100 kcal',   label: 'Primary (herbivore)',     col: COL.amber },
      { y: 195, w: 380, energy: '1,000 kcal', label: 'Producer (autotroph)',    col: COL.green },
    ].map((t, i) => (
      <g key={i}>
        <rect x={300 - t.w / 2} y={t.y} width={t.w} height={40} fill={t.col} opacity="0.78" rx="3" />
        <text x="300" y={t.y + 25} textAnchor="middle" fill="#0b1220" fontSize="13" fontWeight="700">{t.energy}</text>
        <text x={300 + t.w / 2 + 12} y={t.y + 18} fill={COL.textDim} fontSize="11">{t.label}</text>
        {i > 0 && (
          <text x={300 - t.w / 2 - 12} y={t.y + 18} fill={COL.slate} fontSize="10" textAnchor="end">×0.1</text>
        )}
      </g>
    ))}
    <text x="300" y="270" textAnchor="middle" fill={COL.slate} fontSize="11">
      Lindeman (1942): ~90% of energy lost at each step as heat
    </text>
    <text x="300" y="288" textAnchor="middle" fill={COL.slate} fontSize="10">
      Why food chains rarely exceed 4–5 trophic levels
    </text>
  </svg>
);

// ------------------------------------------------------------------
// 3.x  Population growth — J-curve vs S-curve
// ------------------------------------------------------------------
const PopulationCurves = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Population growth: exponential and logistic">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    {/* Axes */}
    <line x1="60" y1="240" x2="560" y2="240" stroke={COL.dim} strokeWidth="1" />
    <line x1="60" y1="20"  x2="60"  y2="240" stroke={COL.dim} strokeWidth="1" />
    <text x="40"  y="135" fill={COL.slate} fontSize="11" textAnchor="middle" transform="rotate(-90,40,135)">Population (N)</text>
    <text x="310" y="265" fill={COL.slate} fontSize="11" textAnchor="middle">Time (t)</text>
    {/* Carrying capacity line */}
    <line x1="60" y1="60" x2="560" y2="60" stroke={COL.amber} strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
    <text x="565" y="64" fill={COL.amber} fontSize="11">K  (carrying capacity)</text>
    {/* J-curve (exponential) */}
    <path d="M 60,240 Q 350,235 460,40 Q 480,30 500,20" stroke={COL.red} strokeWidth="2.5" fill="none" />
    <text x="470" y="55" fill={COL.red} fontSize="12" fontWeight="700">J-curve</text>
    <text x="470" y="70" fill={COL.red} fontSize="10">exponential (r-selected)</text>
    {/* S-curve (logistic) */}
    <path d="M 60,240 Q 200,235 260,180 Q 320,80 380,65 Q 460,60 540,60" stroke={COL.green} strokeWidth="2.5" fill="none" />
    <text x="240" y="160" fill={COL.green} fontSize="12" fontWeight="700">S-curve</text>
    <text x="240" y="176" fill={COL.green} fontSize="10">logistic (K-selected)</text>
  </svg>
);

// ------------------------------------------------------------------
// 4.4  Atmosphere layers
// ------------------------------------------------------------------
const AtmosphereLayers = () => (
  <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" aria-label="Layers of the atmosphere">
    <rect x="0" y="0" width="600" height="320" fill={COL.bgLight} />
    {[
      { y: 20,  h: 50, name: 'Thermosphere',  alt: '80-700 km',   note: 'auroras; ISS orbits here',           col: '#0c2a3a' },
      { y: 75,  h: 50, name: 'Mesosphere',    alt: '50-80 km',    note: 'meteors burn up here',                col: '#0f3a4d' },
      { y: 130, h: 50, name: 'Stratosphere',  alt: '12-50 km',    note: 'OZONE LAYER (absorbs UV)',            col: '#13526b' },
      { y: 185, h: 50, name: 'Troposphere',   alt: '0-12 km',     note: 'weather, ~75% of mass, where we live', col: '#1a6e8e' },
    ].map((l, i) => (
      <g key={i}>
        <rect x="120" y={l.y} width="380" height={l.h - 4} fill={l.col} stroke={COL.cyan} strokeOpacity="0.3" rx="3" />
        <text x="130" y={l.y + 22} fill={COL.cyan} fontSize="13" fontWeight="700">{l.name}</text>
        <text x="130" y={l.y + 38} fill={COL.textDim} fontSize="10">{l.note}</text>
        <text x="490" y={l.y + 22} fill={COL.slate} fontSize="11" textAnchor="end">{l.alt}</text>
      </g>
    ))}
    {/* Ground */}
    <rect x="120" y="240" width="380" height="20" fill="#3a5e2a" />
    <text x="310" y="255" textAnchor="middle" fill={COL.textDim} fontSize="10">Earth's surface</text>
    {/* Sun rays */}
    <line x1="540" y1="30" x2="450" y2="155" stroke="#fbbf24" strokeWidth="1.5" opacity="0.7" />
    <text x="545" y="35" fill="#fbbf24" fontSize="12">☀</text>
    <text x="510" y="160" fill="#fbbf24" fontSize="9">UV blocked here</text>

    <text x="300" y="290" textAnchor="middle" fill={COL.slate} fontSize="10">
      Temperature: drops in troposphere, rises in stratosphere (ozone absorbs UV), drops again in mesosphere
    </text>
  </svg>
);

// ------------------------------------------------------------------
// 8.5  Eutrophication cascade
// ------------------------------------------------------------------
const Eutrophication = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Eutrophication cascade">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    {[
      { x: 30,  label: '1. Fertilizer\nrunoff (N + P)',  col: COL.amber },
      { x: 145, label: '2. Algal bloom',                  col: COL.green },
      { x: 260, label: '3. Algae die,\nbacteria decompose', col: '#7c6b3a' },
      { x: 375, label: '4. Oxygen depleted\n(DO < 2 mg/L)', col: COL.red },
      { x: 490, label: '5. Dead zone:\nfish & shellfish die', col: '#7f1d1d' },
    ].map((s, i) => (
      <g key={i}>
        <rect x={s.x} y="80" width="100" height="80" rx="6" fill={s.col} opacity="0.18" stroke={s.col} strokeWidth="1.5" />
        {s.label.split('\n').map((ln, j) => (
          <text key={j} x={s.x + 50} y={108 + j * 14} textAnchor="middle" fill={COL.textDim} fontSize="11" fontWeight={j === 0 ? '700' : '400'}>{ln}</text>
        ))}
        {i < 4 && (
          <line x1={s.x + 100} y1="120" x2={s.x + 116} y2="120" stroke={COL.slate} strokeWidth="2" markerEnd="url(#arrowSlate)" />
        )}
      </g>
    ))}
    <text x="300" y="50" textAnchor="middle" fill={COL.amber} fontSize="14" fontWeight="700">Eutrophication</text>
    <text x="300" y="200" textAnchor="middle" fill={COL.slate} fontSize="10">
      Mississippi River → Gulf of Mexico dead zone (~5,000-8,000 sq mi each summer)
    </text>
    <defs>
      <marker id="arrowSlate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.slate} />
      </marker>
    </defs>
  </svg>
);

// ------------------------------------------------------------------
// 9.3  Greenhouse effect
// ------------------------------------------------------------------
const GreenhouseEffect = () => (
  <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" aria-label="Greenhouse effect schematic">
    <rect x="0" y="0" width="600" height="320" fill={COL.bgLight} />
    {/* Sun */}
    <circle cx="80" cy="50" r="24" fill="#fbbf24" />
    <text x="80" y="56" textAnchor="middle" fill="#0b1220" fontSize="13" fontWeight="700">☀</text>
    {/* Atmosphere band */}
    <rect x="0" y="100" width="600" height="2" fill={COL.cyan} opacity="0.3" />
    <rect x="0" y="180" width="600" height="2" fill={COL.cyan} opacity="0.3" />
    <text x="595" y="140" fill={COL.cyan} fontSize="10" textAnchor="end">Atmosphere (CO₂, CH₄, H₂O)</text>
    {/* Earth */}
    <rect x="0" y="280" width="600" height="40" fill="#1f5e3a" />
    <text x="300" y="305" textAnchor="middle" fill={COL.textDim} fontSize="11">Earth surface</text>
    {/* Incoming sunlight */}
    <line x1="100" y1="70" x2="250" y2="280" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowYellow)" />
    <text x="120" y="180" fill="#fbbf24" fontSize="11">Visible light in</text>
    {/* Re-radiated heat (IR) trying to escape */}
    <line x1="280" y1="280" x2="280" y2="120" stroke={COL.red} strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#arrowRed3)" />
    <text x="290" y="200" fill={COL.red} fontSize="11">Heat (infrared)</text>
    <text x="290" y="216" fill={COL.red} fontSize="11">re-emitted from Earth</text>
    {/* Trapped: bounces back */}
    <line x1="340" y1="140" x2="340" y2="280" stroke={COL.red} strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#arrowRed3)" opacity="0.8" />
    <text x="355" y="220" fill={COL.red} fontSize="10">GHG molecules</text>
    <text x="355" y="234" fill={COL.red} fontSize="10">absorb &amp; re-emit</text>
    <text x="355" y="248" fill={COL.red} fontSize="10">downward → warming</text>
    {/* Some heat escapes */}
    <line x1="430" y1="120" x2="500" y2="40" stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="2 3" markerEnd="url(#arrowCyan4)" />
    <text x="430" y="60" fill="#67e8f9" fontSize="10">Some IR escapes to space</text>

    <text x="300" y="20" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Greenhouse effect</text>
    <defs>
      <marker id="arrowYellow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#fbbf24" />
      </marker>
      <marker id="arrowRed3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.red} />
      </marker>
      <marker id="arrowCyan4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#67e8f9" />
      </marker>
    </defs>
  </svg>
);

// ------------------------------------------------------------------
// 9.5  CO₂ over time — Keeling-style curve
// ------------------------------------------------------------------
const KeelingCurve = () => {
  // Approximated annual mean Mauna Loa CO2 (ppm) at ~10-year intervals
  const data = [
    { year: 1958, ppm: 315 }, { year: 1970, ppm: 326 },
    { year: 1980, ppm: 339 }, { year: 1990, ppm: 354 },
    { year: 2000, ppm: 369 }, { year: 2010, ppm: 390 },
    { year: 2020, ppm: 414 }, { year: 2024, ppm: 425 },
  ];
  const W = 600, H = 280, padL = 50, padR = 30, padT = 30, padB = 50;
  const xs = (y) => padL + ((y - 1958) / (2024 - 1958)) * (W - padL - padR);
  const ys = (p) => H - padB - ((p - 280) / (440 - 280)) * (H - padT - padB);
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xs(d.year).toFixed(1)} ${ys(d.ppm).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label="Atmospheric CO2 1958-2024">
      <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
      {/* Pre-industrial reference */}
      <line x1={padL} y1={ys(280)} x2={W - padR} y2={ys(280)} stroke={COL.green} strokeDasharray="3 3" strokeWidth="1" opacity="0.7" />
      <text x={W - padR - 4} y={ys(280) - 4} fill={COL.green} fontSize="10" textAnchor="end">Pre-industrial 280 ppm</text>
      {/* Y axis ticks */}
      {[300, 350, 400].map((p) => (
        <g key={p}>
          <line x1={padL - 4} y1={ys(p)} x2={padL} y2={ys(p)} stroke={COL.slate} />
          <text x={padL - 8} y={ys(p) + 4} fill={COL.slate} fontSize="10" textAnchor="end">{p}</text>
        </g>
      ))}
      <text x="14" y={H / 2} fill={COL.slate} fontSize="11" textAnchor="middle" transform={`rotate(-90, 14, ${H / 2})`}>CO₂ (ppm)</text>
      {/* X axis ticks */}
      {[1960, 1980, 2000, 2020].map((y) => (
        <g key={y}>
          <line x1={xs(y)} y1={H - padB} x2={xs(y)} y2={H - padB + 4} stroke={COL.slate} />
          <text x={xs(y)} y={H - padB + 18} fill={COL.slate} fontSize="10" textAnchor="middle">{y}</text>
        </g>
      ))}
      <text x={W / 2} y={H - 8} fill={COL.slate} fontSize="11" textAnchor="middle">Year</text>
      {/* Curve */}
      <path d={path} stroke={COL.red} strokeWidth="2.5" fill="none" />
      {data.map((d) => <circle key={d.year} cx={xs(d.year)} cy={ys(d.ppm)} r="3" fill={COL.red} />)}
      {/* Annotation */}
      <text x={xs(2024) - 6} y={ys(425) - 8} fill={COL.red} fontSize="11" fontWeight="700" textAnchor="end">425 ppm (2024)</text>
      <text x={padL + 10} y={padT + 14} fill={COL.amber} fontSize="11" fontWeight="700">Mauna Loa CO₂ · +51% since pre-industrial</text>
    </svg>
  );
};

// ------------------------------------------------------------------
// 9.7  Ocean acidification — pH trend
// ------------------------------------------------------------------
const OceanAcidification = () => (
  <svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg" aria-label="Ocean acidification pH trend">
    <rect x="0" y="0" width="600" height="250" fill={COL.bgLight} />
    {/* pH scale */}
    {[
      { label: '8.25', y: 50,  col: COL.cyan,   note: 'pre-industrial' },
      { label: '8.20', y: 90,  col: COL.cyan,   note: '1900' },
      { label: '8.10', y: 140, col: COL.amber,  note: '2024 — surface ocean today' },
      { label: '8.00', y: 190, col: COL.red,    note: '2100 projection (BAU)' },
    ].map((s, i) => (
      <g key={i}>
        <line x1="80" y1={s.y} x2="500" y2={s.y} stroke={s.col} strokeWidth="2" opacity="0.7" />
        <text x="76" y={s.y + 4} fill={s.col} fontSize="12" fontWeight="700" textAnchor="end">pH {s.label}</text>
        <text x="510" y={s.y + 4} fill={COL.textDim} fontSize="10">{s.note}</text>
      </g>
    ))}
    <text x="300" y="20" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Surface ocean pH</text>
    <text x="300" y="225" textAnchor="middle" fill={COL.slate} fontSize="10">
      ~30% increase in H⁺ (logarithmic) — corals, shellfish struggle to calcify below ~8.0
    </text>
    <text x="300" y="240" textAnchor="middle" fill={COL.slate} fontSize="10">
      CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻
    </text>
  </svg>
);

// ------------------------------------------------------------------
// 1.3  Aquatic biomes — ocean zones
// ------------------------------------------------------------------
const OceanZones = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Ocean zones by depth and light">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    {/* Sun */}
    <circle cx="60" cy="30" r="14" fill="#fbbf24" />
    {/* Ocean column */}
    <rect x="120" y="20" width="430" height="50"  fill="#67e8f9" opacity="0.35" />
    <rect x="120" y="70" width="430" height="80"  fill="#1e3a5f" opacity="0.7" />
    <rect x="120" y="150" width="430" height="60" fill="#0c1e3a" />
    <rect x="120" y="210" width="430" height="50" fill="#020617" />
    {/* Zone labels */}
    <text x="135" y="42" fill="#0b1220" fontSize="12" fontWeight="700">Photic zone</text>
    <text x="135" y="58" fill="#0b1220" fontSize="10">0–200 m · sunlight, phytoplankton, most productivity</text>
    <text x="135" y="100" fill={COL.text} fontSize="12" fontWeight="700">Aphotic zone (mesopelagic)</text>
    <text x="135" y="116" fill={COL.textDim} fontSize="10">200–1,000 m · no light, abundant prey</text>
    <text x="135" y="180" fill={COL.text} fontSize="12" fontWeight="700">Abyssal zone</text>
    <text x="135" y="196" fill={COL.textDim} fontSize="10">1,000–4,000 m · hydrothermal vents (chemosynthesis)</text>
    <text x="135" y="240" fill={COL.text} fontSize="12" fontWeight="700">Hadal zone</text>
    <text x="135" y="256" fill={COL.textDim} fontSize="10">4,000+ m · deepest trenches</text>
    {/* Depth scale */}
    <text x="555" y="42"  fill={COL.slate} fontSize="10">0 m</text>
    <text x="555" y="150" fill={COL.slate} fontSize="10">200 m</text>
    <text x="555" y="210" fill={COL.slate} fontSize="10">1 km</text>
    <text x="555" y="265" fill={COL.slate} fontSize="10">4 km+</text>
    {/* Sun rays */}
    <line x1="80"  y1="40" x2="180" y2="70" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
    <line x1="80"  y1="40" x2="220" y2="70" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
  </svg>
);

// ------------------------------------------------------------------
// 1.8  NPP by biome bar chart
// ------------------------------------------------------------------
const NPPBars = () => {
  const data = [
    { name: 'Tropical rainforest', val: 2200, col: '#0d5e2f' },
    { name: 'Estuaries',            val: 2000, col: '#67e8f9' },
    { name: 'Coral reefs',          val: 2500, col: '#22d3ee' },
    { name: 'Wetlands',             val: 1800, col: '#3a8e4d' },
    { name: 'Temperate forest',     val: 1250, col: '#7c9a4c' },
    { name: 'Savanna',              val: 700,  col: '#b89b3a' },
    { name: 'Boreal forest',        val: 800,  col: '#1f5e3a' },
    { name: 'Grassland',            val: 600,  col: '#c4b85a' },
    { name: 'Tundra',               val: 140,  col: '#cbd5e1' },
    { name: 'Open ocean',           val: 125,  col: '#1e3a5f' },
    { name: 'Desert',               val: 90,   col: '#c47842' },
  ];
  const W = 600, H = 320, padL = 130, padR = 60, padT = 30, padB = 30;
  const max = 2500;
  const bw = (H - padT - padB) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label="NPP by biome">
      <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
      <text x={W / 2} y="20" fill={COL.amber} fontSize="13" fontWeight="700" textAnchor="middle">Net Primary Productivity (g C/m²/yr)</text>
      {data.map((d, i) => {
        const y = padT + i * bw + 4;
        const w = (d.val / max) * (W - padL - padR);
        return (
          <g key={d.name}>
            <text x={padL - 6} y={y + bw / 2 + 2} fill={COL.textDim} fontSize="10" textAnchor="end">{d.name}</text>
            <rect x={padL} y={y} width={w} height={bw - 8} fill={d.col} rx="2" />
            <text x={padL + w + 6} y={y + bw / 2 + 2} fill={COL.text} fontSize="10">{d.val.toLocaleString()}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ------------------------------------------------------------------
// 1.11  Food web (simplified terrestrial)
// ------------------------------------------------------------------
const FoodWeb = () => {
  const nodes = [
    { id: 'grass',     x: 60,  y: 240, label: 'Grass',     col: COL.green },
    { id: 'tree',      x: 220, y: 240, label: 'Tree',      col: COL.green },
    { id: 'berry',     x: 380, y: 240, label: 'Berries',   col: COL.green },
    { id: 'mouse',     x: 60,  y: 160, label: 'Mouse',     col: COL.amber },
    { id: 'rabbit',    x: 220, y: 160, label: 'Rabbit',    col: COL.amber },
    { id: 'deer',      x: 380, y: 160, label: 'Deer',      col: COL.amber },
    { id: 'bird',      x: 510, y: 160, label: 'Bird',      col: COL.amber },
    { id: 'snake',     x: 100, y: 80,  label: 'Snake',     col: '#f97316' },
    { id: 'fox',       x: 250, y: 80,  label: 'Fox',       col: '#f97316' },
    { id: 'hawk',      x: 410, y: 30,  label: 'Hawk',      col: COL.red },
    { id: 'wolf',      x: 530, y: 80,  label: 'Wolf',      col: COL.red },
  ];
  const edges = [
    ['mouse','grass'],['mouse','berry'],
    ['rabbit','grass'],['rabbit','berry'],
    ['deer','tree'],['deer','grass'],
    ['bird','berry'],['bird','tree'],
    ['snake','mouse'],['snake','bird'],
    ['fox','rabbit'],['fox','mouse'],['fox','bird'],
    ['hawk','snake'],['hawk','bird'],['hawk','mouse'],['hawk','fox'],
    ['wolf','rabbit'],['wolf','deer'],['wolf','fox'],
  ];
  const find = (id) => nodes.find((n) => n.id === id);
  return (
    <svg viewBox="0 0 600 290" xmlns="http://www.w3.org/2000/svg" aria-label="Simplified food web">
      <rect x="0" y="0" width="600" height="290" fill={COL.bgLight} />
      <text x="300" y="20" fill={COL.amber} fontSize="13" fontWeight="700" textAnchor="middle">Food web — arrows point predator → prey</text>
      {edges.map(([from, to], i) => {
        const f = find(from), t = find(to);
        return <line key={i} x1={f.x} y1={f.y + 10} x2={t.x} y2={t.y - 10} stroke={COL.dim} strokeWidth="1" opacity="0.65" />;
      })}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="16" fill={n.col} opacity="0.85" />
          <text x={n.x} y={n.y + 4} fontSize="10" fontWeight="700" textAnchor="middle" fill="#0b1220">{n.label}</text>
        </g>
      ))}
      <text x="300" y="280" fill={COL.slate} fontSize="10" textAnchor="middle">Real ecosystems are webs, not chains — removing one species rarely collapses the system</text>
    </svg>
  );
};

// ------------------------------------------------------------------
// 2.3  Species-area relationship — log-log curve
// ------------------------------------------------------------------
const SpeciesArea = () => {
  const W = 600, H = 260, padL = 60, padR = 40, padT = 40, padB = 50;
  // S = c * A^z, z=0.25, c=10
  const xs = (logA) => padL + logA * (W - padL - padR) / 6;
  const ys = (logS) => H - padB - logS * (H - padT - padB) / 3;
  const points = [];
  for (let logA = 0; logA <= 6; logA += 0.2) {
    const S = 10 * Math.pow(Math.pow(10, logA), 0.25);
    points.push(`${xs(logA)},${ys(Math.log10(S))}`);
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label="Species-area relationship">
      <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={COL.dim} />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={COL.dim} />
      <polyline points={points.join(' ')} stroke={COL.green} strokeWidth="2.5" fill="none" />
      {/* Axes labels */}
      <text x={W / 2} y={H - 10} textAnchor="middle" fill={COL.slate} fontSize="11">Area (log scale)</text>
      <text x="18" y={H / 2} fill={COL.slate} fontSize="11" textAnchor="middle" transform={`rotate(-90, 18, ${H / 2})`}>Species count (log)</text>
      {/* x ticks */}
      {[0, 2, 4, 6].map((p) => <text key={p} x={xs(p)} y={H - padB + 18} fontSize="10" fill={COL.slate} textAnchor="middle">10^{p}</text>)}
      {[0, 1, 2, 3].map((p) => <text key={p} x={padL - 8} y={ys(p) + 4} fontSize="10" fill={COL.slate} textAnchor="end">10^{p}</text>)}
      {/* Annotation */}
      <text x={W - padR - 4} y={padT + 16} fontSize="11" fill={COL.green} fontWeight="700" textAnchor="end">S = c · A^z  (z ≈ 0.25)</text>
      <text x={W / 2} y={padT + 16} fontSize="10" fill={COL.amber} textAnchor="middle">90% habitat loss → ~44% extinction debt over time</text>
    </svg>
  );
};

// ------------------------------------------------------------------
// 2.7  Ecological succession (primary vs secondary)
// ------------------------------------------------------------------
const Succession = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Primary vs secondary succession">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="20" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Ecological succession</text>
    {/* Primary row */}
    <text x="20" y="65" fill={COL.cyan} fontSize="11" fontWeight="700">Primary</text>
    <text x="20" y="80" fill={COL.slate} fontSize="9">no soil</text>
    {[
      { x: 90,  label: 'Bare rock',     icon: '⬜' },
      { x: 200, label: 'Lichens',       icon: '🟢' },
      { x: 310, label: 'Mosses, herbs', icon: '🌱' },
      { x: 420, label: 'Shrubs',        icon: '🌿' },
      { x: 530, label: 'Forest',        icon: '🌲' },
    ].map((s, i) => (
      <g key={i}>
        <circle cx={s.x} cy="70" r="22" fill={COL.bgDark} stroke={COL.cyan} strokeWidth="1.5" />
        <text x={s.x} y="76" textAnchor="middle" fontSize="16">{s.icon}</text>
        <text x={s.x} y="105" textAnchor="middle" fill={COL.textDim} fontSize="10">{s.label}</text>
        {i < 4 && <line x1={s.x + 22} y1="70" x2={s.x + 88} y2="70" stroke={COL.dim} markerEnd="url(#arrowSlate2)" />}
      </g>
    ))}
    <text x="565" y="135" textAnchor="end" fill={COL.cyan} fontSize="10">~1,000+ years</text>

    {/* Secondary row */}
    <text x="20" y="180" fill={COL.green} fontSize="11" fontWeight="700">Secondary</text>
    <text x="20" y="195" fill={COL.slate} fontSize="9">soil intact</text>
    {[
      { x: 90,  label: 'Disturbance',     icon: '🔥' },
      { x: 200, label: 'Weeds, grasses',  icon: '🌾' },
      { x: 310, label: 'Shrubs',          icon: '🌿' },
      { x: 420, label: 'Pioneer trees',   icon: '🌳' },
      { x: 530, label: 'Mature forest',   icon: '🌲' },
    ].map((s, i) => (
      <g key={i}>
        <circle cx={s.x} cy="185" r="22" fill={COL.bgDark} stroke={COL.green} strokeWidth="1.5" />
        <text x={s.x} y="191" textAnchor="middle" fontSize="16">{s.icon}</text>
        <text x={s.x} y="220" textAnchor="middle" fill={COL.textDim} fontSize="10">{s.label}</text>
        {i < 4 && <line x1={s.x + 22} y1="185" x2={s.x + 88} y2="185" stroke={COL.dim} markerEnd="url(#arrowSlate2)" />}
      </g>
    ))}
    <text x="565" y="250" textAnchor="end" fill={COL.green} fontSize="10">~100–200 years</text>

    <defs>
      <marker id="arrowSlate2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.dim} />
      </marker>
    </defs>
  </svg>
);

// ------------------------------------------------------------------
// 3.6  Age structure pyramids — three shapes
// ------------------------------------------------------------------
const AgePyramids = () => {
  const layers = 8;
  const expansive = [38, 32, 26, 22, 18, 13, 9, 5];
  const stationary = [22, 22, 22, 22, 20, 18, 14, 9];
  const constrictive = [12, 14, 18, 22, 24, 22, 16, 10];
  const renderPyramid = (data, x0, color, title) => (
    <g>
      <text x={x0} y="20" textAnchor="middle" fill={color} fontSize="12" fontWeight="700">{title}</text>
      {data.map((v, i) => {
        const w = v * 2;
        const y = 40 + i * 22;
        return (
          <g key={i}>
            <rect x={x0 - w} y={y} width={w}    height="18" fill={color} opacity="0.6" />
            <rect x={x0}     y={y} width={w - 4} height="18" fill={color} opacity="0.85" />
          </g>
        );
      })}
      <line x1={x0} y1="40" x2={x0} y2={40 + layers * 22} stroke={COL.bgLight} strokeWidth="1" />
    </g>
  );
  return (
    <svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg" aria-label="Age structure pyramids">
      <rect x="0" y="0" width="600" height="250" fill={COL.bgLight} />
      {renderPyramid(expansive,    110, COL.red,    'Expansive (growing)')}
      {renderPyramid(stationary,   300, COL.amber,  'Stationary (stable)')}
      {renderPyramid(constrictive, 490, COL.cyan,   'Constrictive (declining)')}
      <text x="110" y="240" textAnchor="middle" fill={COL.slate} fontSize="10">Niger, Mali</text>
      <text x="300" y="240" textAnchor="middle" fill={COL.slate} fontSize="10">US, France</text>
      <text x="490" y="240" textAnchor="middle" fill={COL.slate} fontSize="10">Japan, Italy</text>
    </svg>
  );
};

// ------------------------------------------------------------------
// 3.7  Demographic transition — 4-stage line chart
// ------------------------------------------------------------------
const DemographicTransition = () => {
  const W = 600, H = 260, padL = 60, padR = 30, padT = 40, padB = 50;
  const stages = [0, 25, 50, 75, 100];
  const birth   = [42, 42, 36, 22, 12];
  const death   = [42, 38, 24, 14, 12];
  const pop     = [0,  4,  12, 22, 24];
  const xs = (p) => padL + (p / 100) * (W - padL - padR);
  const ys = (v) => H - padB - (v / 50) * (H - padT - padB);
  const ysPop = (v) => H - padB - (v / 30) * (H - padT - padB);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label="Demographic transition model">
      <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={COL.dim} />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={COL.dim} />
      {/* Stage dividers */}
      {[25, 50, 75].map((p) => (
        <line key={p} x1={xs(p)} y1={padT} x2={xs(p)} y2={H - padB} stroke={COL.gridLine} strokeDasharray="2 4" />
      ))}
      {/* Stage labels */}
      {['Stage 1\npre-industrial','Stage 2\nindustrializing','Stage 3\nmature','Stage 4\npost-industrial'].map((lab, i) => (
        <text key={i} x={xs(12.5 + i * 25)} y={padT + 14} textAnchor="middle" fill={COL.slate} fontSize="10">
          {lab.split('\n').map((ln, j) => <tspan key={j} x={xs(12.5 + i * 25)} dy={j === 0 ? 0 : 12}>{ln}</tspan>)}
        </text>
      ))}
      {/* Birth rate line */}
      <polyline points={stages.map((p, i) => `${xs(p)},${ys(birth[i])}`).join(' ')} stroke={COL.amber} strokeWidth="2.5" fill="none" />
      <text x={W - padR - 4} y={ys(birth[birth.length - 1]) - 4} textAnchor="end" fill={COL.amber} fontSize="11" fontWeight="700">Birth rate</text>
      {/* Death rate line */}
      <polyline points={stages.map((p, i) => `${xs(p)},${ys(death[i])}`).join(' ')} stroke={COL.cyan} strokeWidth="2.5" fill="none" />
      <text x={W - padR - 4} y={ys(death[death.length - 1]) + 16} textAnchor="end" fill={COL.cyan} fontSize="11" fontWeight="700">Death rate</text>
      {/* Population (right axis simulated) */}
      <polyline points={stages.map((p, i) => `${xs(p)},${ysPop(pop[i])}`).join(' ')} stroke={COL.green} strokeWidth="2.5" fill="none" strokeDasharray="6 3" />
      <text x={xs(80)} y={ysPop(22) - 8} fill={COL.green} fontSize="11" fontWeight="700">Population</text>
      <text x={W / 2} y={H - 10} textAnchor="middle" fill={COL.slate} fontSize="11">Time / Development →</text>
    </svg>
  );
};

// ------------------------------------------------------------------
// 3.8  Survivorship curves — Type I, II, III
// ------------------------------------------------------------------
const Survivorship = () => {
  const W = 600, H = 240, padL = 60, padR = 30, padT = 30, padB = 50;
  const xs = (a) => padL + (a / 100) * (W - padL - padR);
  const ys = (s) => H - padB - (Math.log10(s) / 3) * (H - padT - padB);
  // Type I (humans): high survival until late life
  const t1 = [[0, 1000], [40, 950], [70, 800], [85, 400], [95, 50], [100, 1]];
  // Type II (birds): constant mortality
  const t2 = [];
  for (let a = 0; a <= 100; a += 5) t2.push([a, 1000 * Math.pow(10, -a / 33)]);
  // Type III (fish): massive early loss
  const t3 = [[0, 1000], [3, 100], [10, 30], [30, 10], [70, 5], [100, 1]];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label="Survivorship curves Type I, II, III">
      <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={COL.dim} />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={COL.dim} />
      {[1, 10, 100, 1000].map((s) => (
        <g key={s}>
          <line x1={padL} y1={ys(s)} x2={W - padR} y2={ys(s)} stroke={COL.gridLine} strokeDasharray="1 3" />
          <text x={padL - 6} y={ys(s) + 4} textAnchor="end" fill={COL.slate} fontSize="9">{s}</text>
        </g>
      ))}
      <text x="14" y={H / 2} fill={COL.slate} fontSize="11" textAnchor="middle" transform={`rotate(-90,14,${H / 2})`}>Survivors (log)</text>
      <text x={W / 2} y={H - 10} fill={COL.slate} fontSize="11" textAnchor="middle">% of lifespan</text>
      <polyline points={t1.map(([a, s]) => `${xs(a)},${ys(s)}`).join(' ')} stroke={COL.green} strokeWidth="2.5" fill="none" />
      <polyline points={t2.map(([a, s]) => `${xs(a)},${ys(s)}`).join(' ')} stroke={COL.amber} strokeWidth="2.5" fill="none" />
      <polyline points={t3.map(([a, s]) => `${xs(a)},${ys(s)}`).join(' ')} stroke={COL.red} strokeWidth="2.5" fill="none" />
      <text x={xs(85)} y={ys(550)} fill={COL.green} fontSize="11" fontWeight="700">I — humans</text>
      <text x={xs(60)} y={ys(60)} fill={COL.amber} fontSize="11" fontWeight="700">II — birds</text>
      <text x={xs(20)} y={ys(30)} fill={COL.red} fontSize="11" fontWeight="700">III — fish, oysters</text>
    </svg>
  );
};

// ------------------------------------------------------------------
// 4.3  Soil texture triangle (simplified)
// ------------------------------------------------------------------
const SoilTriangle = () => (
  <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" aria-label="Soil texture triangle">
    <rect x="0" y="0" width="600" height="320" fill={COL.bgLight} />
    <text x="300" y="20" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">USDA soil texture triangle</text>
    {/* Outer triangle */}
    <polygon points="300,40 540,280 60,280" stroke={COL.dim} strokeWidth="1.5" fill="rgba(120,80,40,0.12)" />
    {/* Inner classifications (approximate centroids) */}
    {[
      { pts: '300,40 380,160 220,160',  fill: '#94a3b8', label: 'Clay',      lx: 300, ly: 100 },
      { pts: '220,160 380,160 300,280', fill: '#b89b3a', label: 'Loam',      lx: 300, ly: 220 },
      { pts: '60,280 220,160 220,280',  fill: '#3a8e4d', label: 'Sand',      lx: 130, ly: 250 },
      { pts: '540,280 380,160 380,280', fill: '#22d3ee', label: 'Silt',      lx: 460, ly: 250 },
    ].map((b, i) => (
      <g key={i}>
        <polygon points={b.pts} fill={b.fill} opacity="0.35" stroke={b.fill} strokeWidth="1" />
        <text x={b.lx} y={b.ly} fill={COL.text} fontSize="11" fontWeight="700" textAnchor="middle">{b.label}</text>
      </g>
    ))}
    {/* Apex labels */}
    <text x="300" y="34"  textAnchor="middle" fill={COL.cyan} fontSize="11">100% clay</text>
    <text x="555" y="296" textAnchor="end"    fill={COL.cyan} fontSize="11">100% silt</text>
    <text x="50"  y="296" textAnchor="start"  fill={COL.cyan} fontSize="11">100% sand</text>
    <text x="300" y="305" textAnchor="middle" fill={COL.slate} fontSize="10">Loam (mix of all three) is best for most agriculture</text>
  </svg>
);

// ------------------------------------------------------------------
// 6.1  World energy mix (pie)
// ------------------------------------------------------------------
const EnergyMix = () => {
  // 2023 approximate shares (BP/EI/IEA)
  const data = [
    { label: 'Oil',         pct: 31.2, col: '#0c1e3a' },
    { label: 'Coal',        pct: 26.5, col: '#3a3a3a' },
    { label: 'Natural gas', pct: 23.5, col: COL.red },
    { label: 'Hydro',       pct: 6.4,  col: COL.cyan },
    { label: 'Nuclear',     pct: 4.1,  col: COL.amber },
    { label: 'Wind+Solar',  pct: 6.7,  col: COL.green },
    { label: 'Biomass',     pct: 1.6,  col: '#7c6b3a' },
  ];
  const cx = 200, cy = 160, r = 100;
  let acc = 0;
  const arcs = data.map((d) => {
    const start = acc; acc += (d.pct / 100) * Math.PI * 2;
    const end = acc;
    const x1 = cx + r * Math.cos(start - Math.PI / 2);
    const y1 = cy + r * Math.sin(start - Math.PI / 2);
    const x2 = cx + r * Math.cos(end - Math.PI / 2);
    const y2 = cy + r * Math.sin(end - Math.PI / 2);
    const large = end - start > Math.PI ? 1 : 0;
    return { d: `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${large} 1 ${x2},${y2} Z`, ...d };
  });
  return (
    <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" aria-label="World primary energy mix 2023">
      <rect x="0" y="0" width="600" height="320" fill={COL.bgLight} />
      <text x="300" y="25" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">World primary energy, 2023</text>
      {arcs.map((a, i) => <path key={i} d={a.d} fill={a.col} stroke={COL.bgLight} strokeWidth="1.5" />)}
      <text x={cx} y={cy} textAnchor="middle" fill={COL.text} fontSize="13" fontWeight="700">81%</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill={COL.textDim} fontSize="10">fossil</text>
      {/* Legend */}
      {data.map((d, i) => (
        <g key={i} transform={`translate(370, ${65 + i * 26})`}>
          <rect width="14" height="14" fill={d.col} />
          <text x="22" y="11" fill={COL.textDim} fontSize="12">{d.label}</text>
          <text x="220" y="11" fill={COL.text} fontSize="12" textAnchor="end">{d.pct.toFixed(1)}%</text>
        </g>
      ))}
      <text x="300" y="310" textAnchor="middle" fill={COL.slate} fontSize="10">Source: Energy Institute Statistical Review (2024 data for 2023)</text>
    </svg>
  );
};

// ------------------------------------------------------------------
// 6.11  EROI comparison bars
// ------------------------------------------------------------------
const EROIBars = () => {
  const data = [
    { name: 'Hydroelectric',    val: 84, col: COL.cyan },
    { name: 'Wind',             val: 20, col: COL.green },
    { name: 'Oil (conventional)', val: 16, col: '#0c1e3a' },
    { name: 'Coal',             val: 30, col: '#3a3a3a' },
    { name: 'Natural gas',      val: 25, col: COL.red },
    { name: 'Solar PV (utility)', val: 11, col: COL.amber },
    { name: 'Nuclear',          val: 75, col: '#f97316' },
    { name: 'Oil sands',        val: 5,  col: '#7c4a1a' },
    { name: 'Corn ethanol',     val: 1.5, col: '#7c6b3a' },
  ];
  const W = 600, H = 280, padL = 150, padR = 40, padT = 30, padB = 30;
  const max = 100;
  const bw = (H - padT - padB) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label="EROI by energy source">
      <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
      <text x={W / 2} y="20" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">EROI — energy returned per energy invested</text>
      {data.map((d, i) => {
        const y = padT + i * bw + 3;
        const w = (d.val / max) * (W - padL - padR);
        return (
          <g key={d.name}>
            <text x={padL - 6} y={y + bw / 2 + 2} fill={COL.textDim} fontSize="10" textAnchor="end">{d.name}</text>
            <rect x={padL} y={y} width={w} height={bw - 6} fill={d.col} rx="2" />
            <text x={padL + w + 6} y={y + bw / 2 + 2} fill={COL.text} fontSize="10">{d.val}:1</text>
          </g>
        );
      })}
    </svg>
  );
};

// ------------------------------------------------------------------
// 7.2  Photochemical smog formation
// ------------------------------------------------------------------
const SmogFormation = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Photochemical smog formation">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="20" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Photochemical smog formation</text>
    {/* Sun */}
    <circle cx="510" cy="55" r="22" fill="#fbbf24" />
    <text x="510" y="61" textAnchor="middle" fill="#0b1220" fontSize="14" fontWeight="700">☀</text>
    <text x="510" y="92" textAnchor="middle" fill="#fbbf24" fontSize="10">Sunlight</text>
    {/* Inputs */}
    <g transform="translate(40,100)">
      <rect x="0" y="0" width="120" height="50" fill="rgba(239,68,68,0.18)" stroke={COL.red} rx="6" />
      <text x="60" y="20" textAnchor="middle" fill={COL.red} fontSize="12" fontWeight="700">NOₓ</text>
      <text x="60" y="38" textAnchor="middle" fill={COL.textDim} fontSize="10">vehicles, power plants</text>
    </g>
    <g transform="translate(40,170)">
      <rect x="0" y="0" width="120" height="50" fill="rgba(251,191,36,0.18)" stroke={COL.amber} rx="6" />
      <text x="60" y="20" textAnchor="middle" fill={COL.amber} fontSize="12" fontWeight="700">VOCs</text>
      <text x="60" y="38" textAnchor="middle" fill={COL.textDim} fontSize="10">paints, solvents, gas</text>
    </g>
    {/* + sign */}
    <text x="200" y="155" textAnchor="middle" fill={COL.slate} fontSize="20">+</text>
    {/* Reaction box */}
    <g transform="translate(220,120)">
      <rect x="0" y="0" width="140" height="60" fill="#0f172a" stroke={COL.cyan} rx="6" />
      <text x="70" y="22" textAnchor="middle" fill={COL.cyan} fontSize="11" fontWeight="700">Reaction</text>
      <text x="70" y="40" textAnchor="middle" fill={COL.textDim} fontSize="10">NOₓ + VOC + hν</text>
      <text x="70" y="54" textAnchor="middle" fill={COL.textDim} fontSize="10">→ O₃ + PANs</text>
    </g>
    {/* Arrows */}
    <line x1="160" y1="125" x2="218" y2="135" stroke={COL.dim} markerEnd="url(#arrowSlateA)" />
    <line x1="160" y1="195" x2="218" y2="170" stroke={COL.dim} markerEnd="url(#arrowSlateA)" />
    <line x1="500" y1="90" x2="350" y2="125" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrowYellowA)" />
    {/* Outputs */}
    <g transform="translate(420,130)">
      <rect x="0" y="0" width="150" height="80" fill="rgba(252,165,165,0.12)" stroke="#fca5a5" rx="6" />
      <text x="75" y="22" textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="700">Smog</text>
      <text x="75" y="40" textAnchor="middle" fill={COL.textDim} fontSize="10">ground-level O₃</text>
      <text x="75" y="54" textAnchor="middle" fill={COL.textDim} fontSize="10">PANs, aldehydes</text>
      <text x="75" y="68" textAnchor="middle" fill={COL.textDim} fontSize="10">PM2.5 (secondary)</text>
    </g>
    <line x1="362" y1="150" x2="418" y2="150" stroke={COL.dim} markerEnd="url(#arrowSlateA)" />
    <defs>
      <marker id="arrowSlateA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.dim} />
      </marker>
      <marker id="arrowYellowA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#fbbf24" />
      </marker>
    </defs>
  </svg>
);

// ------------------------------------------------------------------
// 7.3  Thermal inversion
// ------------------------------------------------------------------
const ThermalInversion = () => {
  const W = 600, H = 260, padL = 60, padR = 80, padT = 30, padB = 40;
  // Normal profile: temp decreases with altitude
  // Inversion profile: warm layer above cool surface
  const normal = [[60, 240], [40, 50]];
  const inversion = [[60, 240], [80, 180], [50, 130], [40, 50]];
  const xs = (t) => padL + ((t - 20) / 80) * (W - padL - padR);
  const ys = (alt) => H - padB - (alt / 250) * (H - padT - padB);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label="Thermal inversion vs normal atmosphere">
      <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
      <text x={W / 2} y="20" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Thermal inversion traps pollution near ground</text>
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={COL.dim} />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={COL.dim} />
      <text x="14" y={H / 2} fill={COL.slate} fontSize="11" textAnchor="middle" transform={`rotate(-90,14,${H / 2})`}>Altitude →</text>
      <text x={W / 2} y={H - 10} fill={COL.slate} fontSize="11" textAnchor="middle">Temperature →</text>
      {/* Normal line */}
      <polyline points={normal.map(([t, a]) => `${xs(t)},${ys(a)}`).join(' ')} stroke={COL.green} strokeWidth="2.5" fill="none" />
      <text x={xs(45) + 8} y={ys(180)} fill={COL.green} fontSize="11" fontWeight="700">Normal</text>
      <text x={xs(45) + 8} y={ys(160)} fill={COL.green} fontSize="10">temp ↓ with altitude</text>
      {/* Inversion line */}
      <polyline points={inversion.map(([t, a]) => `${xs(t)},${ys(a)}`).join(' ')} stroke={COL.red} strokeWidth="2.5" fill="none" />
      <text x={xs(85) - 4} y={ys(140)} fill={COL.red} fontSize="11" fontWeight="700">Inversion</text>
      <text x={xs(85) - 4} y={ys(120)} fill={COL.red} fontSize="10">warm cap above cool surface</text>
      {/* Trapped pollution band */}
      <rect x={padL} y={ys(80)} width={W - padL - padR} height={ys(0) - ys(80)} fill="rgba(252,165,165,0.10)" />
      <text x={W - padR - 8} y={ys(40)} textAnchor="end" fill="#fca5a5" fontSize="10">trapped pollution</text>
    </svg>
  );
};

// ------------------------------------------------------------------
// 7.4  PM size scale — relative diameters
// ------------------------------------------------------------------
const PMScale = () => (
  <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" aria-label="Particulate matter size scale">
    <rect x="0" y="0" width="600" height="200" fill={COL.bgLight} />
    <text x="300" y="20" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Particulate matter — relative size</text>
    {[
      { x: 120, r: 60,  label: 'Human hair',        size: '~70 μm', col: COL.dim },
      { x: 290, r: 22,  label: 'PM10 (coarse)',     size: '10 μm',  col: COL.amber },
      { x: 400, r: 8,   label: 'PM2.5 (fine)',      size: '2.5 μm', col: COL.red },
      { x: 480, r: 3,   label: 'PM1',               size: '1 μm',   col: '#fca5a5' },
      { x: 540, r: 1,   label: 'Ultrafine (PM0.1)', size: '0.1 μm', col: '#7f1d1d' },
    ].map((p, i) => (
      <g key={i}>
        <circle cx={p.x} cy="100" r={p.r} fill={p.col} opacity="0.7" stroke={p.col} />
        <text x={p.x} y="155" textAnchor="middle" fill={COL.textDim} fontSize="11" fontWeight="700">{p.label}</text>
        <text x={p.x} y="170" textAnchor="middle" fill={COL.slate} fontSize="10">{p.size}</text>
      </g>
    ))}
    <text x="300" y="190" textAnchor="middle" fill={COL.slate} fontSize="10">Smaller particles travel deeper into lungs; PM2.5 enters bloodstream</text>
  </svg>
);

// ------------------------------------------------------------------
// 8.8  Biomagnification (mercury / DDT)
// ------------------------------------------------------------------
const Biomagnification = () => {
  const data = [
    { name: 'Phytoplankton', conc: 0.04,  size: 8,  col: COL.green, y: 220 },
    { name: 'Zooplankton',   conc: 0.4,   size: 14, col: COL.green, y: 200 },
    { name: 'Small fish',    conc: 5,     size: 20, col: COL.amber, y: 170 },
    { name: 'Tuna',          conc: 50,    size: 32, col: '#f97316', y: 130 },
    { name: 'Shark / orca',  conc: 1000,  size: 46, col: COL.red,   y: 70 },
  ];
  return (
    <svg viewBox="0 0 600 290" xmlns="http://www.w3.org/2000/svg" aria-label="Biomagnification up the marine food chain">
      <rect x="0" y="0" width="600" height="290" fill={COL.bgLight} />
      <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Biomagnification — mercury (ppm wet)</text>
      {data.map((d, i) => {
        const x = 80 + i * 110;
        return (
          <g key={i}>
            <circle cx={x} cy={d.y} r={d.size} fill={d.col} opacity="0.85" />
            <text x={x} y={d.y + d.size + 18} textAnchor="middle" fill={COL.textDim} fontSize="11" fontWeight="700">{d.name}</text>
            <text x={x} y={d.y + d.size + 32} textAnchor="middle" fill={COL.text} fontSize="11">{d.conc} ppm</text>
            {i > 0 && (
              <line x1={x - 110 + 30} y1={data[i - 1].y - 10} x2={x - 30} y2={d.y + 5} stroke={COL.dim} markerEnd="url(#arrowSlateB)" />
            )}
          </g>
        );
      })}
      <text x="300" y="275" textAnchor="middle" fill={COL.slate} fontSize="10">Each predator eats many prey → toxin concentrates ~10× per trophic level</text>
      <defs>
        <marker id="arrowSlateB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={COL.dim} />
        </marker>
      </defs>
    </svg>
  );
};

// ------------------------------------------------------------------
// 8.11  Sewage treatment stages
// ------------------------------------------------------------------
const SewageTreatment = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Sewage treatment stages">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="20" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Sewage treatment — three stages</text>
    {[
      { x: 30,  label: 'Primary',   note: 'screens + settling tanks', detail: 'removes ~30% BOD', col: COL.dim },
      { x: 180, label: 'Secondary', note: 'activated sludge (bacteria)', detail: '~85-95% BOD removed', col: COL.green },
      { x: 330, label: 'Tertiary',  note: 'N/P removal, filtration', detail: 'optional, cuts nutrients', col: COL.cyan },
      { x: 480, label: 'Disinfect', note: 'Cl₂ or UV', detail: 'kills pathogens', col: COL.amber },
    ].map((s, i) => (
      <g key={i}>
        <rect x={s.x} y="60" width="120" height="100" rx="8" fill={s.col} opacity="0.18" stroke={s.col} strokeWidth="1.5" />
        <text x={s.x + 60} y="88" textAnchor="middle" fill={s.col} fontSize="13" fontWeight="700">{s.label}</text>
        <text x={s.x + 60} y="110" textAnchor="middle" fill={COL.textDim} fontSize="10">{s.note}</text>
        <text x={s.x + 60} y="138" textAnchor="middle" fill={COL.slate} fontSize="10">{s.detail}</text>
        {i < 3 && <line x1={s.x + 120} y1="110" x2={s.x + 178} y2="110" stroke={COL.slate} strokeWidth="1.5" markerEnd="url(#arrowSlateC)" />}
      </g>
    ))}
    {/* Sludge output */}
    <text x="100" y="200" fill={COL.slate} fontSize="11">↓ sludge → digestion → biogas + biosolids</text>
    {/* Effluent output */}
    <text x="540" y="180" textAnchor="end" fill={COL.cyan} fontSize="11">→ discharge</text>
    <defs>
      <marker id="arrowSlateC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.slate} />
      </marker>
    </defs>
  </svg>
);

// ------------------------------------------------------------------
// 9.6  Sea level rise time series
// ------------------------------------------------------------------
const SeaLevel = () => {
  const W = 600, H = 240, padL = 50, padR = 40, padT = 30, padB = 45;
  // mm above 1900 baseline (rough)
  const data = [
    [1900, 0], [1930, 30], [1960, 80], [1980, 110],
    [1993, 140], [2000, 180], [2010, 215], [2020, 250], [2024, 270],
  ];
  const xs = (y) => padL + ((y - 1900) / 124) * (W - padL - padR);
  const ys = (mm) => H - padB - (mm / 300) * (H - padT - padB);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label="Sea level rise 1900-2024">
      <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
      <text x={W / 2} y="20" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Global mean sea level (mm above 1900)</text>
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={COL.dim} />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={COL.dim} />
      {[0, 100, 200, 300].map((p) => (
        <g key={p}>
          <line x1={padL} y1={ys(p)} x2={W - padR} y2={ys(p)} stroke={COL.gridLine} strokeDasharray="2 4" />
          <text x={padL - 6} y={ys(p) + 4} textAnchor="end" fill={COL.slate} fontSize="10">{p}</text>
        </g>
      ))}
      <polyline points={data.map(([y, mm]) => `${xs(y)},${ys(mm)}`).join(' ')} stroke={COL.cyan} strokeWidth="2.5" fill="none" />
      {data.map(([y, mm]) => <circle key={y} cx={xs(y)} cy={ys(mm)} r="2.5" fill={COL.cyan} />)}
      <text x={xs(2024) - 6} y={ys(270) - 8} textAnchor="end" fill={COL.cyan} fontSize="11" fontWeight="700">+27 cm by 2024</text>
      <text x={W / 2} y={H - 8} textAnchor="middle" fill={COL.slate} fontSize="10">Source: NOAA / CSIRO tide gauges + altimetry</text>
      {[1920, 1960, 2000].map((y) => <text key={y} x={xs(y)} y={H - padB + 16} textAnchor="middle" fill={COL.slate} fontSize="10">{y}</text>)}
    </svg>
  );
};

// ------------------------------------------------------------------
// 9.10  Ozone hole — Antarctic recovery
// ------------------------------------------------------------------
const OzoneHole = () => {
  const W = 600, H = 240, padL = 50, padR = 50, padT = 30, padB = 45;
  // Antarctic ozone hole area (millions of km², peak each spring)
  const data = [
    [1980, 1],  [1985, 8],  [1990, 18], [1995, 22],
    [2000, 25], [2006, 28], [2010, 22], [2015, 21],
    [2020, 25], [2024, 18],
  ];
  const xs = (y) => padL + ((y - 1980) / 44) * (W - padL - padR);
  const ys = (a) => H - padB - (a / 30) * (H - padT - padB);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label="Antarctic ozone hole area over time">
      <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
      <text x={W / 2} y="20" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Antarctic ozone hole area (peak, million km²)</text>
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={COL.dim} />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={COL.dim} />
      {[0, 10, 20, 30].map((p) => (
        <g key={p}>
          <line x1={padL} y1={ys(p)} x2={W - padR} y2={ys(p)} stroke={COL.gridLine} strokeDasharray="2 4" />
          <text x={padL - 6} y={ys(p) + 4} textAnchor="end" fill={COL.slate} fontSize="10">{p}</text>
        </g>
      ))}
      {/* Montreal Protocol vertical line */}
      <line x1={xs(1987)} y1={padT} x2={xs(1987)} y2={H - padB} stroke={COL.green} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x={xs(1987) + 4} y={padT + 14} fill={COL.green} fontSize="10">Montreal Protocol</text>
      <polyline points={data.map(([y, a]) => `${xs(y)},${ys(a)}`).join(' ')} stroke={COL.red} strokeWidth="2.5" fill="none" />
      {[1980, 1990, 2000, 2010, 2020].map((y) => <text key={y} x={xs(y)} y={H - padB + 16} textAnchor="middle" fill={COL.slate} fontSize="10">{y}</text>)}
      <text x={W - padR - 4} y={padT + 14} textAnchor="end" fill={COL.green} fontSize="10">→ projected full recovery by ~2066</text>
    </svg>
  );
};

// ============================================================
// TEMPLATE HELPERS — used to generate consistent diagrams for
// the remaining subunits at scale. Each helper returns a function
// component that takes no props (data is baked in at definition).
// ============================================================

// 4–6 labeled concept boxes in a grid. Title at top.
function makeConceptGrid({ title, items, cols = 3, accent = COL.cyan }) {
  return function ConceptGrid() {
    const W = 600, H = 280, padT = 60;
    const rows = Math.ceil(items.length / cols);
    const cellW = (W - 40) / cols;
    const cellH = (H - padT - 40) / rows;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label={title}>
        <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
        <text x={W / 2} y="30" textAnchor="middle" fill={accent} fontSize="14" fontWeight="700">{title}</text>
        {items.map((it, i) => {
          const r = Math.floor(i / cols), c = i % cols;
          const x = 20 + c * cellW + 6;
          const y = padT + r * cellH;
          const col = it.col || accent;
          return (
            <g key={i}>
              <rect x={x} y={y} width={cellW - 12} height={cellH - 12} rx="6" fill={col} opacity="0.14" stroke={col} strokeWidth="1.5" />
              {it.icon && <text x={x + 14} y={y + 24} fontSize="18">{it.icon}</text>}
              <text x={x + (it.icon ? 40 : 14)} y={y + 24} fill={col} fontSize="12.5" fontWeight="700">{it.label}</text>
              <text x={x + 14} y={y + 44} fill={COL.textDim} fontSize="10">{wrapText(it.note || '', cellW - 30).map((ln, j) => (
                <tspan key={j} x={x + 14} dy={j === 0 ? 0 : 12}>{ln}</tspan>
              ))}</text>
            </g>
          );
        })}
      </svg>
    );
  };
}

// Linear horizontal process: boxes connected by arrows.
function makeProcessFlow({ title, steps, accent = COL.amber }) {
  return function ProcessFlow() {
    const W = 600, H = 220;
    const n = steps.length;
    const padX = 20, gap = 14;
    const boxW = (W - padX * 2 - gap * (n - 1)) / n;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label={title}>
        <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
        <text x={W / 2} y="24" textAnchor="middle" fill={accent} fontSize="13" fontWeight="700">{title}</text>
        {steps.map((s, i) => {
          const x = padX + i * (boxW + gap);
          const col = s.col || accent;
          return (
            <g key={i}>
              <rect x={x} y="60" width={boxW} height="120" rx="8" fill={col} opacity="0.16" stroke={col} strokeWidth="1.5" />
              <text x={x + boxW / 2} y="90" textAnchor="middle" fill={col} fontSize="13" fontWeight="700">{i + 1}. {s.label}</text>
              <text x={x + boxW / 2} y="118" textAnchor="middle" fill={COL.textDim} fontSize="10">{wrapText(s.note || '', boxW - 16).map((ln, j) => (
                <tspan key={j} x={x + boxW / 2} dy={j === 0 ? 0 : 13}>{ln}</tspan>
              ))}</text>
              {i < n - 1 && (
                <line x1={x + boxW + 1} y1="120" x2={x + boxW + gap - 1} y2="120" stroke={COL.dim} strokeWidth="1.5" markerEnd={`url(#flowArrow)`} />
              )}
            </g>
          );
        })}
        <defs>
          <marker id="flowArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={COL.dim} />
          </marker>
        </defs>
      </svg>
    );
  };
}

// Horizontal comparison bar chart.
function makeBarChart({ title, data, unit = '', max, accent = COL.amber }) {
  return function BarChart() {
    const W = 600, H = 60 + data.length * 32 + 40, padL = 160, padR = 60;
    const m = max || Math.max(...data.map((d) => d.val)) * 1.1;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label={title}>
        <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
        <text x={W / 2} y="26" textAnchor="middle" fill={accent} fontSize="13" fontWeight="700">{title}</text>
        {data.map((d, i) => {
          const y = 50 + i * 32;
          const w = (d.val / m) * (W - padL - padR);
          return (
            <g key={i}>
              <text x={padL - 8} y={y + 14} textAnchor="end" fill={COL.textDim} fontSize="11">{d.name}</text>
              <rect x={padL} y={y} width={w} height="22" rx="3" fill={d.col || accent} />
              <text x={padL + w + 6} y={y + 16} fill={COL.text} fontSize="11">{typeof d.val === 'number' ? d.val.toLocaleString() : d.val}{unit}</text>
            </g>
          );
        })}
      </svg>
    );
  };
}

// Spectrum bar with labeled stops along a gradient.
function makeSpectrum({ title, stops, accent = COL.cyan }) {
  return function Spectrum() {
    const W = 600, H = 180, padX = 40;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label={title}>
        <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
        <text x={W / 2} y="28" textAnchor="middle" fill={accent} fontSize="13" fontWeight="700">{title}</text>
        <defs>
          <linearGradient id="specGrad" x1="0" y1="0" x2="1" y2="0">
            {stops.map((s, i) => (
              <stop key={i} offset={`${(i / (stops.length - 1)) * 100}%`} stopColor={s.col} />
            ))}
          </linearGradient>
        </defs>
        <rect x={padX} y="80" width={W - padX * 2} height="36" fill="url(#specGrad)" rx="4" />
        {stops.map((s, i) => {
          const x = padX + (i / (stops.length - 1)) * (W - padX * 2);
          return (
            <g key={i}>
              <line x1={x} y1="80" x2={x} y2="124" stroke="#0b1220" strokeWidth="2" />
              <text x={x} y="140" textAnchor="middle" fill={COL.text} fontSize="11" fontWeight="700">{s.label}</text>
              {s.note && <text x={x} y="156" textAnchor="middle" fill={COL.textDim} fontSize="10">{s.note}</text>}
            </g>
          );
        })}
      </svg>
    );
  };
}

// Two-column comparison: title and bullet list for each side.
function makeTwoColumn({ title, leftTitle, leftItems, leftCol = COL.green, rightTitle, rightItems, rightCol = COL.amber }) {
  return function TwoColumn() {
    const W = 600, H = 280;
    const renderCol = (x, w, title, items, col) => (
      <g>
        <rect x={x} y="60" width={w} height={H - 100} rx="8" fill={col} opacity="0.10" stroke={col} strokeWidth="1.5" />
        <text x={x + w / 2} y="86" textAnchor="middle" fill={col} fontSize="14" fontWeight="700">{title}</text>
        {items.map((it, i) => (
          <text key={i} x={x + 16} y={120 + i * 24} fill={COL.textDim} fontSize="12">• {it}</text>
        ))}
      </g>
    );
    return (
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label={title}>
        <rect x="0" y="0" width={W} height={H} fill={COL.bgLight} />
        <text x={W / 2} y="30" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">{title}</text>
        {renderCol(20, 270, leftTitle, leftItems, leftCol)}
        {renderCol(310, 270, rightTitle, rightItems, rightCol)}
      </svg>
    );
  };
}

// Word wrap utility for SVG text (simple word break at maxChars).
function wrapText(s, maxWidthPx, charPx = 5.6) {
  if (!s) return [''];
  const maxChars = Math.max(8, Math.floor(maxWidthPx / charPx));
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 4); // cap at 4 lines
}

// ============================================================
// PHOSPHORUS CYCLE — Unit 1.6 (custom, important)
// ============================================================
const PhosphorusCycle = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Phosphorus cycle (no atmospheric step)">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Phosphorus cycle — no atmospheric step</text>
    {/* Phosphate rock */}
    <rect x="30" y="60" width="120" height="60" rx="6" fill="rgba(120,80,40,0.2)" stroke="#7c4a1a" />
    <text x="90" y="86" textAnchor="middle" fill="#c47842" fontSize="12" fontWeight="700">Phosphate rock</text>
    <text x="90" y="103" textAnchor="middle" fill={COL.textDim} fontSize="10">Morocco, China, US</text>
    {/* Soil */}
    <rect x="200" y="60" width="120" height="60" rx="6" fill="rgba(180,150,80,0.18)" stroke={COL.amber} />
    <text x="260" y="86" textAnchor="middle" fill={COL.amber} fontSize="12" fontWeight="700">Soil (PO₄³⁻)</text>
    <text x="260" y="103" textAnchor="middle" fill={COL.textDim} fontSize="10">plant-available</text>
    {/* Plants/animals */}
    <rect x="370" y="60" width="120" height="60" rx="6" fill="rgba(34,197,94,0.18)" stroke={COL.green} />
    <text x="430" y="86" textAnchor="middle" fill={COL.green} fontSize="12" fontWeight="700">Plants → Animals</text>
    <text x="430" y="103" textAnchor="middle" fill={COL.textDim} fontSize="10">DNA, ATP, bones</text>
    {/* Ocean */}
    <rect x="370" y="180" width="200" height="60" rx="6" fill="rgba(30,58,95,0.7)" stroke={COL.cyan} />
    <text x="470" y="206" textAnchor="middle" fill={COL.cyan} fontSize="12" fontWeight="700">Ocean sediments</text>
    <text x="470" y="222" textAnchor="middle" fill={COL.textDim} fontSize="10">largest reservoir (~95%)</text>
    {/* Arrows */}
    <line x1="150" y1="90" x2="198" y2="90" stroke={COL.dim} markerEnd="url(#pArrow)" />
    <text x="174" y="80" textAnchor="middle" fill={COL.slate} fontSize="9">weathering</text>
    <line x1="320" y1="90" x2="368" y2="90" stroke={COL.dim} markerEnd="url(#pArrow)" />
    <text x="344" y="80" textAnchor="middle" fill={COL.slate} fontSize="9">uptake</text>
    <line x1="430" y1="120" x2="430" y2="178" stroke={COL.dim} markerEnd="url(#pArrow)" />
    <text x="440" y="155" fill={COL.slate} fontSize="9">decay, runoff</text>
    {/* Uplift over geologic time */}
    <path d="M 470 240 Q 50 260 90 122" stroke={COL.red} strokeWidth="1.5" fill="none" strokeDasharray="5 3" markerEnd="url(#pArrow)" />
    <text x="280" y="265" textAnchor="middle" fill={COL.red} fontSize="10">uplift over millions of years</text>
    {/* Human mining */}
    <line x1="90" y1="60" x2="180" y2="180" stroke={COL.red} strokeWidth="2" strokeDasharray="3 2" markerEnd="url(#pArrow)" />
    <text x="20" y="180" fill={COL.red} fontSize="10">human</text>
    <text x="20" y="194" fill={COL.red} fontSize="10">mining ↓</text>
    <text x="20" y="208" fill={COL.red} fontSize="9">~25 Mt P/yr</text>
    <defs>
      <marker id="pArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.dim} />
      </marker>
    </defs>
  </svg>
);

// ============================================================
// PLATE TECTONICS — Unit 4.1 (custom, important)
// ============================================================
const PlateTectonics = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Three types of plate boundaries">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Three types of plate boundaries</text>
    {[
      { x: 20,  title: 'Divergent', col: COL.green, note: 'plates pull apart', ex: 'Mid-Atlantic Ridge' },
      { x: 210, title: 'Convergent', col: COL.red,   note: 'plates collide',    ex: 'Andes, Himalayas' },
      { x: 400, title: 'Transform',  col: COL.amber, note: 'plates slide past',  ex: 'San Andreas Fault' },
    ].map((b, i) => (
      <g key={i}>
        <text x={b.x + 90} y="60" textAnchor="middle" fill={b.col} fontSize="12" fontWeight="700">{b.title}</text>
        <rect x={b.x + 5}   y="80" width="80" height="60" fill={b.col} opacity="0.7" />
        <rect x={b.x + 95}  y="80" width="80" height="60" fill={b.col} opacity="0.4" />
        {/* Arrows */}
        {i === 0 && (
          <>
            <line x1={b.x + 60} y1="110" x2={b.x + 20} y2="110" stroke="#fff" strokeWidth="2" markerEnd="url(#tArrow)" />
            <line x1={b.x + 120} y1="110" x2={b.x + 160} y2="110" stroke="#fff" strokeWidth="2" markerEnd="url(#tArrow)" />
          </>
        )}
        {i === 1 && (
          <>
            <line x1={b.x + 20} y1="110" x2={b.x + 60} y2="110" stroke="#fff" strokeWidth="2" markerEnd="url(#tArrow)" />
            <line x1={b.x + 160} y1="110" x2={b.x + 120} y2="110" stroke="#fff" strokeWidth="2" markerEnd="url(#tArrow)" />
          </>
        )}
        {i === 2 && (
          <>
            <line x1={b.x + 20} y1="105" x2={b.x + 60} y2="105" stroke="#fff" strokeWidth="2" markerEnd="url(#tArrow)" />
            <line x1={b.x + 160} y1="115" x2={b.x + 120} y2="115" stroke="#fff" strokeWidth="2" markerEnd="url(#tArrow)" />
          </>
        )}
        <text x={b.x + 90} y="170" textAnchor="middle" fill={COL.textDim} fontSize="11">{b.note}</text>
        <text x={b.x + 90} y="200" textAnchor="middle" fill={COL.slate} fontSize="10">e.g. {b.ex}</text>
      </g>
    ))}
    <text x="300" y="260" textAnchor="middle" fill={COL.slate} fontSize="10">Plate motion drives volcanism, earthquakes, mountain building, ocean basins</text>
    <defs>
      <marker id="tArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#fff" />
      </marker>
    </defs>
  </svg>
);

// ============================================================
// ENSO PATTERNS — Unit 4.9 (custom)
// ============================================================
const ENSOPatterns = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="ENSO Normal vs El Niño vs La Niña">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">ENSO: equatorial Pacific patterns</text>
    {[
      { y: 50,  name: 'Normal',    col: COL.green, west: 'warm', east: 'cool', arrow: 'east → west', detail: 'Walker cell active; rain over Indonesia' },
      { y: 130, name: 'El Niño',   col: COL.red,   west: 'cool', east: 'warm', arrow: 'weakened',     detail: 'rain shifts east; droughts in Australia/Indonesia' },
      { y: 210, name: 'La Niña',   col: COL.cyan,  west: 'very warm', east: 'very cool', arrow: 'strong east→west', detail: 'amplified normal; floods in Asia, drought in Americas' },
    ].map((p, i) => (
      <g key={i}>
        <text x="20" y={p.y + 28} fill={p.col} fontSize="13" fontWeight="700">{p.name}</text>
        {/* West Pacific */}
        <rect x="120" y={p.y} width="100" height="40" fill={p.west.includes('very warm') ? '#c4422f' : p.west.includes('warm') ? '#d4815f' : '#5fb4d4'} />
        <text x="170" y={p.y + 24} textAnchor="middle" fill="#0b1220" fontSize="11" fontWeight="700">{p.west}</text>
        {/* East Pacific */}
        <rect x="320" y={p.y} width="100" height="40" fill={p.east.includes('very cool') ? '#2f5fa4' : p.east.includes('cool') ? '#5fb4d4' : '#d4815f'} />
        <text x="370" y={p.y + 24} textAnchor="middle" fill="#0b1220" fontSize="11" fontWeight="700">{p.east}</text>
        {/* Wind arrow */}
        <text x="270" y={p.y + 22} textAnchor="middle" fill={COL.text} fontSize="11">⇐</text>
        <text x="270" y={p.y + 36} textAnchor="middle" fill={COL.slate} fontSize="9">{p.arrow}</text>
        {/* Detail */}
        <text x="430" y={p.y + 18} fill={COL.textDim} fontSize="10">{p.detail.slice(0, 38)}</text>
        <text x="430" y={p.y + 32} fill={COL.textDim} fontSize="10">{p.detail.slice(38)}</text>
      </g>
    ))}
    <text x="170" y="265" textAnchor="middle" fill={COL.slate} fontSize="10">West Pacific (Indonesia)</text>
    <text x="370" y="265" textAnchor="middle" fill={COL.slate} fontSize="10">East Pacific (Peru)</text>
  </svg>
);

// ============================================================
// ACID RAIN PATHWAY — Unit 7.7 (custom)
// ============================================================
const AcidRain = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Acid rain pathway">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Acid rain: from emissions to ecosystem damage</text>
    {/* Smokestacks */}
    <rect x="40" y="170" width="50" height="80" fill="#3a3a3a" />
    <polygon points="35,170 95,170 80,150 50,150" fill="#3a3a3a" />
    <text x="65" y="170" textAnchor="middle" fill="#fff" fontSize="9" dy="-58">coal</text>
    {/* SO2/NOx plume */}
    <ellipse cx="180" cy="80" rx="60" ry="20" fill="#7a5c3a" opacity="0.6" />
    <text x="180" y="86" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="700">SO₂ · NOₓ</text>
    {/* Reaction */}
    <text x="320" y="86" textAnchor="middle" fill={COL.amber} fontSize="11">+ H₂O →</text>
    <ellipse cx="430" cy="80" rx="55" ry="20" fill={COL.red} opacity="0.5" />
    <text x="430" y="86" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">H₂SO₄ · HNO₃</text>
    {/* Rain */}
    {[170, 200, 230, 260, 290, 320, 350, 380, 410, 440, 470].map((x) => (
      <line key={x} x1={x} y1="120" x2={x - 4} y2="170" stroke={COL.red} strokeWidth="1" opacity="0.6" />
    ))}
    <text x="300" y="155" textAnchor="middle" fill={COL.red} fontSize="11">pH 4.0-4.5 rain</text>
    {/* Lake/forest */}
    <rect x="150" y="200" width="200" height="50" fill="#0c1e3a" />
    <text x="250" y="230" textAnchor="middle" fill={COL.cyan} fontSize="11">Lake → fishless (pH &lt; 5)</text>
    <polygon points="380,200 410,170 440,200" fill="#1f5e3a" />
    <polygon points="430,200 460,160 490,200" fill="#1f5e3a" />
    <text x="445" y="230" textAnchor="middle" fill={COL.green} fontSize="11">Forest → calcium loss</text>
    {/* Long-range transport arrow */}
    <line x1="90" y1="100" x2="500" y2="100" stroke={COL.dim} strokeWidth="1" strokeDasharray="3 3" />
    <text x="295" y="36" textAnchor="middle" fill={COL.slate} fontSize="10">pollution can travel 100s-1000s of km before deposition</text>
  </svg>
);

// ------------------------------------------------------------------
// REGISTRY — map subunit code → figures
// ------------------------------------------------------------------
export const APES_FIGURES = {
  '1.2':  [{ id: 'biomes',          Cmp: BiomeStrip,        caption: 'Major terrestrial biomes by latitude band', source: 'KUA Carbon Dashboard · authored' }],
  '1.3':  [{ id: 'ocean-zones',     Cmp: OceanZones,        caption: 'Ocean zones by depth. Most marine productivity happens in the sunlit photic zone (0–200 m).', source: 'NOAA depth standards' }],
  '1.8':  [{ id: 'npp-bars',        Cmp: NPPBars,           caption: 'Net primary productivity by biome. Tropical rainforests and coral reefs lead by huge margins; deserts and open ocean are at the bottom.', source: 'Whittaker & Likens (1973), updated with modern remote-sensing estimates' }],
  '1.11': [{ id: 'food-web',        Cmp: FoodWeb,           caption: 'A simplified food web. Apex predators eat from multiple trophic levels, which is why webs are more robust than chains.', source: 'KUA Carbon Dashboard · authored' }],
  '2.3':  [{ id: 'species-area',    Cmp: SpeciesArea,       caption: 'Species-area relationship S = c·A^z. Halving habitat area cuts species count by ~18% (z ≈ 0.25 for islands).', source: 'Concept: Arrhenius 1921, MacArthur & Wilson 1967' }],
  '2.7':  [{ id: 'succession',      Cmp: Succession,        caption: 'Primary succession starts from bare rock; secondary from disturbed soil. Soil already in place makes secondary succession ~10× faster.', source: 'KUA Carbon Dashboard · authored' }],
  '3.6':  [{ id: 'age-pyramids',    Cmp: AgePyramids,       caption: 'Three age structures: expansive (high TFR, young), stationary (replacement), constrictive (declining).', source: 'UN World Population Prospects style' }],
  '3.7':  [{ id: 'dem-transition',  Cmp: DemographicTransition, caption: 'Demographic transition: deaths fall first, births fall later — the gap between is when population grows fastest.', source: 'Notestein 1945, updated' }],
  '3.8':  [{ id: 'survivorship',    Cmp: Survivorship,      caption: 'Three survivorship curves. Type I (humans) survive to old age; Type III (fish, oysters) have massive juvenile mortality.', source: 'Concept: Pearl & Miner 1935' }],
  '4.3':  [{ id: 'soil-triangle',   Cmp: SoilTriangle,      caption: 'USDA soil texture triangle. Soils are classified by % sand, silt, and clay; loam (balanced mix) is best for agriculture.', source: 'USDA Natural Resources Conservation Service' }],
  '6.1':  [{ id: 'energy-mix',      Cmp: EnergyMix,         caption: 'World primary energy mix, 2023. Fossil fuels still ~81%; wind + solar growing fastest.', source: 'Energy Institute Statistical Review (2024)' }],
  '6.11': [{ id: 'eroi',            Cmp: EROIBars,          caption: 'EROI — energy returned per energy invested. Hydro and nuclear lead; oil sands and corn ethanol barely break even.', source: 'Hall et al., various meta-analyses 2014-2024' }],
  '7.2':  [{ id: 'smog',            Cmp: SmogFormation,     caption: 'Photochemical smog: NOₓ + VOCs + sunlight produce ground-level ozone and PANs (secondary pollutants, not directly emitted).', source: 'EPA / South Coast AQMD' }],
  '7.3':  [{ id: 'inversion',       Cmp: ThermalInversion,  caption: 'Normally air cools with altitude. In an inversion, a warm layer caps cool surface air — pollution accumulates underneath.', source: 'NOAA Air Resources Laboratory' }],
  '7.4':  [{ id: 'pm-scale',        Cmp: PMScale,           caption: 'PM size scale. A human hair is ~70 μm; PM2.5 reaches lung alveoli; PM0.1 enters the bloodstream.', source: 'EPA / WHO' }],
  '8.8':  [{ id: 'biomagnif',       Cmp: Biomagnification,  caption: 'Biomagnification of mercury. Concentration multiplies ~10× at each trophic level; apex predators carry the highest body burden.', source: 'EPA fish-mercury data; concept after Lindeman 1942' }],
  '8.11': [{ id: 'sewage',          Cmp: SewageTreatment,   caption: 'Sewage treatment stages. Most US plants use primary + secondary; tertiary adds nutrient removal where lakes/coasts need it.', source: 'EPA wastewater technology fact sheets' }],
  '9.6':  [{ id: 'sea-level',       Cmp: SeaLevel,          caption: 'Global mean sea level since 1900. Rate has roughly tripled — from ~1.4 mm/yr early 20th c. to ~4.5 mm/yr today.', source: 'NOAA Climate.gov; CSIRO tide gauges + altimetry' }],
  '9.10': [{ id: 'ozone',           Cmp: OzoneHole,         caption: 'Antarctic ozone hole peak area. After the 1987 Montreal Protocol froze CFC production, recovery is on track for ~2066.', source: 'NASA Ozone Watch' }],
  '1.4':  [
    { id: 'carbon-cycle', Cmp: CarbonCycle, caption: 'Carbon pools and fluxes. Humans add ~12 Gt C/yr that natural processes can\'t fully absorb.', source: 'Pool/flux values: IPCC AR6, Global Carbon Project (2024)' },
    { id: 'keeling',      Cmp: KeelingCurve, caption: 'Mauna Loa atmospheric CO₂ since continuous measurements began in 1958', source: 'Data: NOAA Global Monitoring Lab (Mauna Loa Observatory)' },
  ],
  '1.5':  [{ id: 'n-cycle',         Cmp: NitrogenCycle,     caption: 'Nitrogen cycle. Human Haber-Bosch (~150 Tg/yr) now exceeds all natural fixation combined.', source: 'Flux estimates: Galloway et al., AR6 Ch. 5' }],
  '1.7':  [{ id: 'water-cycle',     Cmp: WaterCycle,        caption: 'The hydrologic cycle is solar-driven (evaporation) and gravity-driven (precipitation, runoff)', source: 'KUA Carbon Dashboard · authored' }],
  '1.10': [{ id: 'trophic',         Cmp: TrophicPyramid,    caption: 'Lindeman\'s 10% rule: each trophic level retains ~10% of the energy from the level below', source: 'Concept: Lindeman 1942' }],
  '3.2':  [{ id: 'pop-curves',      Cmp: PopulationCurves,  caption: 'Exponential (J) growth occurs when resources are unlimited; logistic (S) growth as carrying capacity K is approached', source: 'Concept: Verhulst 1838, Pearl 1925' }],
  '4.4':  [{ id: 'atmo-layers',     Cmp: AtmosphereLayers,  caption: 'Atmosphere layers. The ozone layer in the stratosphere absorbs UV; weather lives in the troposphere.', source: 'NASA layer altitude reference' }],
  '8.5':  [{ id: 'eutroph',         Cmp: Eutrophication,    caption: 'The eutrophication cascade — agricultural N + P drives the Gulf of Mexico dead zone every summer', source: 'EPA Hypoxia Task Force, NOAA' }],
  '9.3':  [{ id: 'ghg-effect',      Cmp: GreenhouseEffect,  caption: 'Greenhouse gases (CO₂, CH₄, H₂O) absorb outgoing infrared and re-emit it, including back to Earth', source: 'Mechanism: Arrhenius 1896, refined throughout 20th c.' }],
  '9.5':  [{ id: 'co2-trend',       Cmp: KeelingCurve,      caption: 'Continuous CO₂ rise. Atmospheric concentration was last this high ~3 million years ago.', source: 'NOAA Global Monitoring Lab' }],
  '9.7':  [{ id: 'ocean-pH',        Cmp: OceanAcidification, caption: 'Ocean pH dropping ~0.1 since pre-industrial = ~30% more H⁺ ions (log scale)', source: 'IPCC AR6 WG1 Ch. 5' }],

  // ====== Unit 1 remaining ======
  '1.1':  [{ id: 'eco-components', caption: 'An ecosystem is biotic (living) + abiotic (nonliving) factors, plus the interactions between them.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeConceptGrid({ title: 'What makes an ecosystem', accent: COL.green, cols: 2, items: [
      { icon: '🌳', label: 'Producers',   note: 'plants, algae, photosynthetic bacteria', col: COL.green },
      { icon: '🦌', label: 'Consumers',   note: 'herbivores, carnivores, omnivores',     col: COL.amber },
      { icon: '🍄', label: 'Decomposers', note: 'bacteria, fungi — recycle nutrients',   col: '#7c4a1a' },
      { icon: '☀️', label: 'Abiotic',     note: 'sun, water, soil, climate, nutrients',  col: COL.cyan },
    ] })
  }],
  '1.6':  [{ id: 'p-cycle', Cmp: PhosphorusCycle, caption: 'Phosphorus has no gaseous form — it cycles on geologic timescales between rock, soil, and ocean.', source: 'USGS phosphate reserves' }],
  '1.9':  [{ id: 'trophic-levels', caption: 'Each trophic level eats the one below; energy flows up, nutrients cycle.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeConceptGrid({ title: 'Trophic levels', accent: COL.green, cols: 4, items: [
      { label: 'Producers',  note: 'fix energy from sun (autotrophs)',  col: COL.green },
      { label: 'Primary consumers',  note: 'herbivores eat producers',  col: COL.amber },
      { label: 'Secondary',  note: 'carnivores eat herbivores',         col: '#f97316' },
      { label: 'Tertiary',   note: 'top predators',                      col: COL.red },
    ] })
  }],

  // ====== Unit 2 remaining ======
  '2.1':  [{ id: 'biodiv-levels', caption: 'Three levels of biodiversity, from genes within species to ecosystems on the landscape.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeConceptGrid({ title: 'Three levels of biodiversity', accent: COL.green, cols: 3, items: [
      { icon: '🧬', label: 'Genetic',    note: 'variation within a species',     col: COL.cyan },
      { icon: '🐾', label: 'Species',    note: 'richness + evenness of species', col: COL.green },
      { icon: '🌍', label: 'Ecosystem',  note: 'variety of habitats / biomes',   col: COL.amber },
    ] })
  }],
  '2.2':  [{ id: 'ecoservices', caption: 'Four categories of ecosystem services, valued at $44-145 trillion/year globally.', source: 'Millennium Ecosystem Assessment 2005; Costanza 2014',
    Cmp: makeConceptGrid({ title: 'Ecosystem services', accent: COL.cyan, cols: 2, items: [
      { icon: '🍎', label: 'Provisioning', note: 'food, water, fiber, medicines',           col: COL.green },
      { icon: '🌬️', label: 'Regulating',   note: 'climate, pollination, water purification', col: COL.cyan },
      { icon: '🎨', label: 'Cultural',     note: 'recreation, spiritual, aesthetic value',   col: COL.amber },
      { icon: '🔄', label: 'Supporting',   note: 'nutrient cycling, soil formation, NPP',     col: '#7c4a1a' },
    ] })
  }],
  '2.4':  [{ id: 'tolerance', caption: 'Shelford\'s law: every species has a range of conditions where it can survive, with an optimum in the middle.', source: 'Shelford 1913',
    Cmp: makeSpectrum({ title: 'Range of tolerance (Shelford 1913)', stops: [
      { label: 'Death',   note: 'too cold',  col: COL.red },
      { label: 'Stress',  note: 'survives',  col: COL.amber },
      { label: 'Optimum', note: 'thrives',   col: COL.green },
      { label: 'Stress',  note: 'survives',  col: COL.amber },
      { label: 'Death',   note: 'too hot',   col: COL.red },
    ] })
  }],
  '2.5':  [{ id: 'disturbances', caption: 'Natural disturbances reset ecosystems. Many systems are adapted to specific disturbance regimes.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeConceptGrid({ title: 'Natural disturbances', accent: COL.amber, cols: 3, items: [
      { icon: '🔥', label: 'Fire',     note: 'chaparral, savanna depend on it',     col: '#f97316' },
      { icon: '🌀', label: 'Storms',   note: 'hurricanes, tornadoes, blowdowns',     col: COL.cyan },
      { icon: '🌊', label: 'Floods',   note: 'maintain floodplain ecosystems',       col: '#67e8f9' },
      { icon: '☀️', label: 'Drought',  note: 'extended dry periods',                 col: COL.amber },
      { icon: '🦠', label: 'Disease',  note: 'chestnut blight, white-nose',          col: COL.red },
      { icon: '🌋', label: 'Volcanic', note: 'Mt St Helens (primary succession)',    col: '#7c4a1a' },
    ] })
  }],
  '2.6':  [{ id: 'adaptations', caption: 'Four kinds of adaptation that increase fitness.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeConceptGrid({ title: 'Types of adaptation', accent: COL.green, cols: 2, items: [
      { icon: '🦴', label: 'Morphological', note: 'physical structures (cactus spines)', col: COL.green },
      { icon: '🦅', label: 'Behavioral',    note: 'migration, hibernation, tool use',    col: COL.amber },
      { icon: '🌡️', label: 'Physiological', note: 'antifreeze, dehydration tolerance',   col: COL.cyan },
      { icon: '🥚', label: 'Reproductive',  note: 'r/K strategies, parental care',       col: COL.red },
    ] })
  }],

  // ====== Unit 3 remaining ======
  '3.1':  [{ id: 'gen-spec', caption: 'Specialists thrive in stable environments; generalists handle change better.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeTwoColumn({ title: 'Generalists vs specialists',
      leftTitle: 'Generalists', leftCol: COL.green, leftItems: ['wide tolerance range','many habitats, many foods','robust to change','coyote, raccoon, crow','rats, cockroaches'],
      rightTitle: 'Specialists', rightCol: COL.amber, rightItems: ['narrow tolerance range','specific habitat/food','vulnerable to change','panda (bamboo), koala','monarch (milkweed only)'],
    })
  }],
  '3.3':  [{ id: 'carrying-cap', caption: 'Carrying capacity (K): max population an environment sustains. Overshoot leads to crash.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeConceptGrid({ title: 'Carrying capacity dynamics', accent: COL.amber, cols: 3, items: [
      { label: 'Below K',  note: 'population grows (births > deaths)', col: COL.green },
      { label: 'At K',     note: 'births = deaths, stable',            col: COL.amber },
      { label: 'Overshoot', note: 'crashes back below K (boom-bust)',   col: COL.red },
    ] })
  }],
  '3.4':  [{ id: 'repro-strat', caption: 'Two reproductive extremes — many fast offspring (r) or few well-cared-for (K).', source: 'MacArthur & Wilson 1967',
    Cmp: makeTwoColumn({ title: 'r-selected vs K-selected',
      leftTitle: 'r-selected', leftCol: COL.cyan, leftItems: ['many offspring','little parental care','small body, short life','rapid colonizers','insects, weeds, oysters'],
      rightTitle: 'K-selected', rightCol: COL.green, rightItems: ['few offspring','extensive parental care','large body, long life','near carrying capacity','elephants, whales, oaks'],
    })
  }],
  '3.5':  [{ id: 'rk-traits', caption: 'r/K selection summarizes trade-offs in life history.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeBarChart({ title: 'Reproductive traits (r vs K)', accent: COL.cyan, data: [
      { name: 'Offspring per litter (r)', val: 100, col: COL.cyan },
      { name: 'Offspring per litter (K)', val: 2,   col: COL.green },
      { name: 'Time to maturity, r (mo)', val: 1,  col: COL.cyan },
      { name: 'Time to maturity, K (yr)', val: 12, col: COL.green },
      { name: 'Survivorship to adult, r (%)', val: 1,  col: COL.cyan },
      { name: 'Survivorship to adult, K (%)', val: 80, col: COL.green },
    ], max: 110 })
  }],
  '3.9':  [{ id: 'pop-eqs', caption: 'Three equations behind population dynamics.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeConceptGrid({ title: 'Key population equations', accent: COL.amber, cols: 1, items: [
      { label: 'Exponential growth',  note: 'dN/dt = rN — unlimited resources',      col: COL.cyan },
      { label: 'Logistic growth',     note: 'dN/dt = rN · (K−N)/K — resource limit', col: COL.green },
      { label: 'Doubling time',       note: 't = 70/r% — useful for human pop',      col: COL.amber },
    ] })
  }],

  // ====== Unit 4 remaining ======
  '4.1':  [{ id: 'plates', Cmp: PlateTectonics, caption: 'Plate boundaries shape Earth\'s surface and drive long-term carbon cycling.', source: 'USGS plate tectonics' }],
  '4.2':  [{ id: 'soil-horizons', caption: 'Soil horizons O→A→B→C, top to bottom. Most life in O (organic) and A (topsoil).', source: 'USDA NRCS',
    Cmp: makeConceptGrid({ title: 'Soil horizons', accent: COL.amber, cols: 1, items: [
      { icon: '🍂', label: 'O — Organic',     note: 'leaf litter, humus on top',           col: '#7c6b3a' },
      { icon: '🌱', label: 'A — Topsoil',     note: 'roots, organisms, dark organic-rich', col: '#5a3a1a' },
      { icon: '🪨', label: 'B — Subsoil',     note: 'clays, mineral accumulation',         col: '#7c4a1a' },
      { icon: '⛰️', label: 'C — Parent rock', note: 'weathered bedrock below',              col: COL.dim },
    ] })
  }],
  '4.5':  [{ id: 'wind-cells', caption: 'Three convection cells per hemisphere create the trade winds, westerlies, and polar easterlies.', source: 'NOAA atmospheric science',
    Cmp: makeConceptGrid({ title: 'Global wind cells', accent: COL.cyan, cols: 3, items: [
      { label: 'Hadley', note: '0-30° · trade winds easterly', col: COL.amber },
      { label: 'Ferrel', note: '30-60° · westerlies',          col: COL.green },
      { label: 'Polar',  note: '60-90° · polar easterlies',     col: COL.cyan },
    ] })
  }],
  '4.6':  [{ id: 'watershed', caption: 'A watershed is the area drained by a single waterway. Everything in it ends up in the river.', source: 'EPA Watershed Academy',
    Cmp: makeProcessFlow({ title: 'Watershed flow', accent: COL.cyan, steps: [
      { label: 'Precipitation', note: 'rain / snowmelt' },
      { label: 'Runoff',        note: 'over land surface' },
      { label: 'Streams',       note: 'tributaries merge' },
      { label: 'River',         note: 'main channel' },
      { label: 'Estuary',       note: 'mouth of system' },
    ] })
  }],
  '4.7':  [{ id: 'seasons', caption: 'Earth\'s 23.5° tilt — not distance from sun — causes the seasons.', source: 'NASA Earth science',
    Cmp: makeConceptGrid({ title: 'Why we have seasons', accent: COL.amber, cols: 2, items: [
      { label: 'Tilt: 23.5°',       note: 'Earth\'s rotation axis',                   col: COL.amber },
      { label: 'Solstices',         note: 'tilt most toward / away from sun',         col: COL.red },
      { label: 'Equinoxes',         note: 'tilt perpendicular to sun',                col: COL.green },
      { label: 'Insolation varies', note: 'sun angle changes power per m²',           col: COL.cyan },
    ] })
  }],
  '4.8':  [{ id: 'climate-zones', caption: 'Climate (long-term weather) varies with latitude, altitude, and proximity to oceans.', source: 'Köppen classification',
    Cmp: makeConceptGrid({ title: 'Köppen climate types', accent: COL.cyan, cols: 3, items: [
      { label: 'A — Tropical',    note: 'hot, wet year-round',          col: COL.green },
      { label: 'B — Dry',         note: 'desert, semi-arid',             col: COL.amber },
      { label: 'C — Temperate',   note: 'mild summers and winters',     col: COL.cyan },
      { label: 'D — Continental', note: 'cold winters, hot summers',     col: '#67e8f9' },
      { label: 'E — Polar',       note: 'tundra, ice cap',               col: COL.text },
      { label: 'H — Highland',    note: 'mountains, vertical zones',     col: COL.dim },
    ] })
  }],
  '4.9':  [{ id: 'enso', Cmp: ENSOPatterns, caption: 'ENSO oscillates roughly every 2-7 years; major driver of global weather variability.', source: 'NOAA Climate Prediction Center' }],

  // ====== Unit 5 — all 17 subunits ======
  '5.1':  [{ id: 'tragedy', caption: 'Hardin\'s tragedy of the commons: shared resources tend to be over-exploited.', source: 'Hardin 1968',
    Cmp: makeConceptGrid({ title: 'Tragedy of the commons', accent: COL.red, cols: 1, items: [
      { label: 'Step 1', note: 'shared resource (atmosphere, fishery, grazing)', col: COL.green },
      { label: 'Step 2', note: 'each user benefits from taking more',             col: COL.amber },
      { label: 'Step 3', note: 'cost of overuse spread across all users',         col: COL.red },
      { label: 'Step 4', note: 'collective overuse → collapse',                   col: '#7f1d1d' },
    ] })
  }],
  '5.2':  [{ id: 'land-use', caption: 'Clearing land for agriculture is the largest single driver of habitat loss.', source: 'FAO; Foley et al. 2011',
    Cmp: makeBarChart({ title: 'Global land use (% of habitable land)', accent: COL.green, data: [
      { name: 'Agriculture',        val: 50, col: COL.amber },
      { name: 'Forests',            val: 37, col: COL.green },
      { name: 'Shrub/grassland',    val: 11, col: '#7c6b3a' },
      { name: 'Urban + freshwater', val: 2,  col: COL.cyan },
    ], unit: '%', max: 55 })
  }],
  '5.3':  [{ id: 'crop-methods', caption: 'Industrial monoculture, slash-and-burn, and small-scale polyculture have very different footprints.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeConceptGrid({ title: 'Agricultural methods', accent: COL.amber, cols: 3, items: [
      { label: 'Industrial',     note: 'monoculture, mech, agrochem',  col: COL.red },
      { label: 'Slash-and-burn', note: 'cut forest, burn, plant',       col: '#f97316' },
      { label: 'Polyculture',    note: 'mix crops; cover crops',        col: COL.green },
    ] })
  }],
  '5.4':  [{ id: 'irrigation', caption: 'Irrigation methods differ in efficiency by ~3×.', source: 'FAO AquaCrop',
    Cmp: makeBarChart({ title: 'Irrigation method efficiency', accent: COL.cyan, data: [
      { name: 'Drip',          val: 90, col: COL.green },
      { name: 'Sprinkler',     val: 75, col: COL.cyan },
      { name: 'Furrow',        val: 60, col: COL.amber },
      { name: 'Flood (basin)', val: 40, col: COL.red },
    ], unit: '%', max: 100 })
  }],
  '5.5':  [{ id: 'pest-mgmt', caption: 'Pest control along a spectrum from chemical to biological.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeSpectrum({ title: 'Pest management approaches', stops: [
      { label: 'Broad-spectrum', note: 'DDT-style; non-target damage', col: COL.red },
      { label: 'Selective',      note: 'targeted chemistry',            col: COL.amber },
      { label: 'IPM',            note: 'integrated pest mgmt',          col: COL.green },
      { label: 'Biological',     note: 'predators, sterilization',      col: COL.cyan },
    ] })
  }],
  '5.6':  [{ id: 'meat-ghg', caption: 'Beef\'s footprint is 6-20× larger than plant proteins per gram of protein.', source: 'Poore & Nemecek 2018',
    Cmp: makeBarChart({ title: 'GHG footprint per 100g protein (kg CO₂eq)', accent: COL.red, data: [
      { name: 'Beef',            val: 50,  col: COL.red },
      { name: 'Lamb',            val: 20,  col: '#f97316' },
      { name: 'Cheese',          val: 11,  col: COL.amber },
      { name: 'Pork',            val: 7,   col: '#fbbf24' },
      { name: 'Chicken',         val: 6,   col: '#a3e635' },
      { name: 'Eggs',            val: 4,   col: COL.green },
      { name: 'Tofu',            val: 2,   col: '#22d3ee' },
      { name: 'Beans / lentils', val: 0.9, col: COL.cyan },
    ], max: 55 })
  }],
  '5.7':  [{ id: 'overgraze', caption: 'Overgrazing → desertification cascade.', source: 'UNCCD',
    Cmp: makeProcessFlow({ title: 'Overgrazing to desertification', accent: COL.red, steps: [
      { label: 'Overstock',      note: 'too many livestock' },
      { label: 'Cover loss',     note: 'plants chewed down' },
      { label: 'Soil exposed',   note: 'wind + water erode' },
      { label: 'Compaction',     note: 'less infiltration' },
      { label: 'Desertification', note: 'productivity lost' },
    ] })
  }],
  '5.8':  [{ id: 'fishing', caption: 'Industrial fishing techniques vary in by-catch and habitat damage.', source: 'FAO State of Fisheries',
    Cmp: makeConceptGrid({ title: 'Fishing methods', accent: COL.cyan, cols: 2, items: [
      { label: 'Trawling',    note: 'drags net, scrapes seafloor', col: COL.red },
      { label: 'Long-line',   note: 'baited hooks, kills albatross', col: '#f97316' },
      { label: 'Purse seine', note: 'encircles schools (tuna)',     col: COL.amber },
      { label: 'Pole / line', note: 'low by-catch, sustainable',     col: COL.green },
    ] })
  }],
  '5.9':  [{ id: 'mining', caption: 'Surface vs subsurface mining — different impacts.', source: 'USGS',
    Cmp: makeTwoColumn({ title: 'Surface vs subsurface mining',
      leftTitle: 'Surface', leftCol: COL.red, leftItems: ['removes overburden','huge land disturbance','coal, copper, oil sands','acid mine drainage','mountaintop removal'],
      rightTitle: 'Subsurface', rightCol: COL.amber, rightItems: ['tunnels underground','smaller surface print','collapse, gas hazards','gold, deep coal','subsidence over time'],
    })
  }],
  '5.10': [{ id: 'urban', caption: '~56% of people live in cities (2024); projected 68% by 2050.', source: 'UN World Urbanization Prospects',
    Cmp: makeBarChart({ title: 'Urban share of global population', accent: COL.cyan, data: [
      { name: '1950',        val: 30, col: COL.amber },
      { name: '1975',        val: 38, col: COL.amber },
      { name: '2000',        val: 47, col: COL.green },
      { name: '2024',        val: 56, col: COL.green },
      { name: '2050 (proj)', val: 68, col: COL.cyan },
    ], unit: '%', max: 75 })
  }],
  '5.11': [{ id: 'eco-foot', caption: 'Global ecological footprint exceeds Earth\'s biocapacity by ~70%.', source: 'Global Footprint Network',
    Cmp: makeConceptGrid({ title: 'Ecological footprint', accent: COL.red, cols: 1, items: [
      { label: 'Global avg',  note: '~2.8 global hectares per person',     col: COL.amber },
      { label: 'Biocapacity', note: 'only ~1.6 gha available per person',   col: COL.green },
      { label: 'Overshoot',   note: 'using 1.7+ Earths of resources/year',  col: COL.red },
    ] })
  }],
  '5.12': [{ id: 'sustain-ag', caption: 'Strategies for more sustainable agriculture.', source: 'IPCC AR6 WG3 Ch. 7',
    Cmp: makeConceptGrid({ title: 'Sustainable agriculture practices', accent: COL.green, cols: 2, items: [
      { label: 'Cover crops',   note: 'add N, prevent erosion',  col: COL.green },
      { label: 'No-till',       note: 'preserve soil carbon',     col: '#7c4a1a' },
      { label: 'Crop rotation', note: 'break pest cycles',         col: COL.amber },
      { label: 'Agroforestry',  note: 'trees integrated on farms', col: COL.cyan },
    ] })
  }],
  '5.13': [{ id: 'aqua-mgmt', caption: 'Fisheries management options and their trade-offs.', source: 'NOAA Fisheries',
    Cmp: makeConceptGrid({ title: 'Sustainable fisheries tools', accent: COL.cyan, cols: 2, items: [
      { label: 'Catch limits', note: 'TAC quotas by stock',         col: COL.cyan },
      { label: 'MPAs',         note: 'no-take protected areas',     col: COL.green },
      { label: 'Gear rules',   note: 'mesh size, gear types',        col: COL.amber },
      { label: 'Aquaculture',  note: 'farm to reduce wild catch',    col: COL.cyan },
    ] })
  }],
  '5.14': [{ id: 'forest-mgmt', caption: 'Logging methods range from heavy-handed to light-touch.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeConceptGrid({ title: 'Forest management methods', accent: COL.green, cols: 2, items: [
      { label: 'Clearcut',    note: 'removes all trees; fastest, harshest', col: COL.red },
      { label: 'Seed tree',   note: 'leaves seed trees for regrowth',        col: COL.amber },
      { label: 'Shelterwood', note: 'gradual harvest in stages',             col: COL.amber },
      { label: 'Selective',   note: 'individual trees; minimal canopy gap',  col: COL.green },
    ] })
  }],
  '5.15': [{ id: 'land-conserv', caption: 'Protected area types vary in restriction.', source: 'IUCN protected area categories',
    Cmp: makeSpectrum({ title: 'Protected area continuum', stops: [
      { label: 'Strict reserve', note: 'no human entry',           col: '#7f1d1d' },
      { label: 'National park',  note: 'wildlife focus, low impact', col: COL.green },
      { label: 'Multi-use',      note: 'recreation + extraction',   col: COL.amber },
      { label: 'Working lands',  note: 'farming, ranching',         col: COL.cyan },
    ] })
  }],
  '5.16': [{ id: 'invasives', caption: 'Famous invasive species and their effects.', source: 'USGS Nonindigenous Aquatic Species',
    Cmp: makeConceptGrid({ title: 'Invasive species — high-impact examples', accent: COL.red, cols: 2, items: [
      { label: 'Zebra mussel',   note: 'Great Lakes — clog pipes, filter algae', col: COL.red },
      { label: 'Asian carp',     note: 'Mississippi — outcompete natives',        col: COL.amber },
      { label: 'Lionfish',       note: 'Caribbean — no native predators',         col: COL.amber },
      { label: 'Burmese python', note: 'Everglades — collapsed mammal pop',       col: COL.red },
    ] })
  }],
  '5.17': [{ id: 'ipat', caption: 'IPAT identity: Impact = Population × Affluence × Technology.', source: 'Ehrlich & Holdren 1971',
    Cmp: makeConceptGrid({ title: 'IPAT framework', accent: COL.amber, cols: 1, items: [
      { label: 'I = P × A × T', note: 'environmental impact factored into three drivers',  col: COL.amber },
      { label: 'Population',    note: 'number of people (P)',                                col: COL.cyan },
      { label: 'Affluence',     note: 'consumption per person (A)',                          col: COL.green },
      { label: 'Technology',    note: 'impact per unit consumed (T) — can cut or amplify',  col: COL.red },
    ] })
  }],

  // ====== Unit 6 remaining ======
  '6.2':  [{ id: 'fossil-form', caption: 'Fossil fuels formed over hundreds of millions of years from buried organic matter.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeProcessFlow({ title: 'Fossil fuel formation', accent: COL.red, steps: [
      { label: 'Dead biomass',    note: 'plants, plankton, algae' },
      { label: 'Burial',          note: 'sediment piles on top' },
      { label: 'Heat + pressure', note: 'over millions of years' },
      { label: 'Coal, oil, gas',  note: 'concentrated carbon' },
    ] })
  }],
  '6.3':  [{ id: 'coal-plant', caption: 'Coal power plant — chemical energy to electricity (~35-40% efficient).', source: 'EIA',
    Cmp: makeProcessFlow({ title: 'Coal-fired electricity', accent: COL.red, steps: [
      { label: 'Burn coal', note: 'heat in boiler' },
      { label: 'Steam',     note: 'high-pressure' },
      { label: 'Turbine',   note: 'steam spins it' },
      { label: 'Generator', note: 'turbine → electricity' },
    ] })
  }],
  '6.4':  [{ id: 'nat-gas', caption: 'Natural gas: ~50% less CO₂ than coal, but methane leaks (28× GWP) erode the benefit.', source: 'EPA + IEA',
    Cmp: makeBarChart({ title: 'CO₂ per kWh of electricity (kg)', accent: COL.amber, data: [
      { name: 'Lignite coal',      val: 1.15,  col: COL.red },
      { name: 'Bituminous coal',   val: 0.95,  col: COL.red },
      { name: 'Oil',               val: 0.85,  col: '#f97316' },
      { name: 'Natural gas',       val: 0.45,  col: COL.amber },
      { name: 'Solar PV',          val: 0.05,  col: COL.green },
      { name: 'Wind',              val: 0.012, col: COL.green },
      { name: 'Nuclear',           val: 0.012, col: COL.cyan },
    ], max: 1.3 })
  }],
  '6.5':  [{ id: 'hydro', caption: 'Hydroelectric: dam → reservoir → turbine. Highest EROI; high upfront ecosystem impact.', source: 'IEA Hydropower',
    Cmp: makeProcessFlow({ title: 'Hydroelectric power', accent: COL.cyan, steps: [
      { label: 'Reservoir', note: 'water stored at height' },
      { label: 'Penstock',  note: 'pipe drops water' },
      { label: 'Turbine',   note: 'water spins it' },
      { label: 'Generator', note: 'electricity to grid' },
    ] })
  }],
  '6.6':  [{ id: 'geo-bio', caption: 'Geothermal taps Earth\'s internal heat; biomass burns plant material.', source: 'NREL',
    Cmp: makeTwoColumn({ title: 'Geothermal & biomass',
      leftTitle: 'Geothermal', leftCol: COL.red, leftItems: ['heat from Earth\'s crust','steam → turbine','always on (baseload)','Iceland, Kenya, US west','low CO₂ if done right'],
      rightTitle: 'Biomass',   rightCol: COL.green, rightItems: ['burn wood, crops, waste','carbon neutral in theory','can drive deforestation','BECCS = capture + store','air pollution risks'],
    })
  }],
  '6.7':  [{ id: 'solar', caption: 'PV cells convert photons → electrons directly (no heat engine).', source: 'NREL',
    Cmp: makeConceptGrid({ title: 'How solar PV works', accent: COL.amber, cols: 2, items: [
      { label: 'Photons hit cell', note: 'sunlight strikes silicon',  col: '#fbbf24' },
      { label: 'Electrons freed',  note: 'photon energy releases e⁻',  col: COL.amber },
      { label: 'DC current',       note: 'electron flow through wires', col: COL.amber },
      { label: 'Inverter → AC',    note: 'converts to grid-compatible', col: COL.green },
    ] })
  }],
  '6.8':  [{ id: 'wind', caption: 'Modern turbines: ~80 m blades, ~150 m hub height, ~5-15 MW capacity.', source: 'AWEA / IRENA',
    Cmp: makeConceptGrid({ title: 'Wind turbine components', accent: COL.cyan, cols: 2, items: [
      { label: 'Blades',           note: 'aerodynamic; capture wind energy', col: COL.cyan },
      { label: 'Hub & rotor',      note: 'transfers spin to generator',      col: COL.green },
      { label: 'Tower',            note: '100-150 m to catch stronger wind', col: COL.dim },
      { label: 'Generator + grid', note: 'electricity to grid',                col: COL.amber },
    ] })
  }],
  '6.9':  [{ id: 'nuclear', caption: 'Nuclear fission: uranium splits, heat → steam → turbine. Low CO₂; waste must be managed.', source: 'IAEA',
    Cmp: makeProcessFlow({ title: 'Nuclear power chain', accent: COL.amber, steps: [
      { label: 'U-235 fission', note: 'neutron splits nucleus' },
      { label: 'Heat',          note: 'massive thermal energy' },
      { label: 'Steam',         note: 'water → high-pressure steam' },
      { label: 'Turbine + grid', note: 'electricity' },
    ] })
  }],
  '6.10': [{ id: 'energy-eff', caption: 'Efficiency improvements often beat new generation in cost-per-kWh saved.', source: 'IEA Energy Efficiency 2024',
    Cmp: makeBarChart({ title: 'Lifetime efficiency gains (typical %)', accent: COL.green, data: [
      { name: 'LED vs incandescent',  val: 80, col: COL.green },
      { name: 'Heat pump vs furnace', val: 60, col: COL.green },
      { name: 'EV vs gas car',        val: 70, col: COL.green },
      { name: 'Energy Star fridge',   val: 40, col: COL.amber },
      { name: 'Building insulation',  val: 30, col: COL.amber },
    ], max: 100, unit: '%' })
  }],
  '6.12': [{ id: 'storage', caption: 'Grid-scale storage options at very different scales and costs.', source: 'NREL Storage Futures',
    Cmp: makeBarChart({ title: 'Energy storage capacities (GWh, global)', accent: COL.cyan, data: [
      { name: 'Pumped hydro',       val: 9000, col: COL.cyan },
      { name: 'Lithium-ion (grid)', val: 200,  col: COL.green },
      { name: 'Compressed air',     val: 50,   col: COL.amber },
      { name: 'Flow batteries',     val: 5,    col: '#67e8f9' },
    ], max: 10000, unit: ' GWh' })
  }],
  '6.13': [{ id: 'grid-decarb', caption: 'Path to a decarbonized grid: efficiency first, then clean generation.', source: 'IPCC AR6 WG3',
    Cmp: makeProcessFlow({ title: 'Decarbonizing electricity', accent: COL.green, steps: [
      { label: 'Reduce demand', note: 'efficiency + behavior' },
      { label: 'Retire coal',   note: 'highest CO₂/kWh first' },
      { label: 'Solar + wind',  note: 'cheapest new capacity' },
      { label: 'Storage',       note: 'firm 24/7 supply' },
      { label: 'Electrify',     note: 'transport + heat' },
    ] })
  }],

  // ====== Unit 7 remaining ======
  '7.1':  [{ id: 'criteria', caption: 'EPA\'s six criteria air pollutants set under the Clean Air Act.', source: 'US EPA NAAQS',
    Cmp: makeConceptGrid({ title: 'Six criteria pollutants', accent: COL.amber, cols: 3, items: [
      { icon: '🌫️', label: 'PM',      note: 'particulate matter (PM10, PM2.5)',  col: COL.red },
      { icon: '☁️', label: 'Ozone',   note: 'ground-level — smog',                col: '#f97316' },
      { icon: '🚗', label: 'CO',       note: 'incomplete combustion',              col: COL.amber },
      { icon: '🏭', label: 'SO₂',      note: 'sulfur in coal/oil',                 col: '#7c4a1a' },
      { icon: '🚛', label: 'NOₓ',      note: 'combustion (vehicles, plants)',      col: COL.red },
      { icon: '⚠️', label: 'Lead',     note: 'banned from gasoline 1996',          col: COL.dim },
    ] })
  }],
  '7.5':  [{ id: 'indoor', caption: 'Indoor air pollution kills ~3.8 million/year — solid fuel cooking is the largest cause.', source: 'WHO Household Air Pollution',
    Cmp: makeConceptGrid({ title: 'Indoor air pollution sources', accent: COL.red, cols: 2, items: [
      { icon: '🔥', label: 'Cookstoves', note: 'wood, dung, coal (2.4B people)', col: COL.red },
      { icon: '🚭', label: 'Tobacco',    note: 'secondhand smoke',                col: '#f97316' },
      { icon: '☢️', label: 'Radon',      note: 'natural gas from soil',           col: COL.amber },
      { icon: '🎨', label: 'VOCs',       note: 'paints, cleaners, off-gassing',  col: COL.amber },
      { icon: '🍄', label: 'Mold',       note: 'allergens in damp areas',         col: '#7c4a1a' },
      { icon: '🔋', label: 'Lead paint', note: 'pre-1978 housing',                 col: COL.dim },
    ] })
  }],
  '7.6':  [{ id: 'air-reduce', caption: 'Air pollution control: prevention > capture > treat > disperse.', source: 'KUA Carbon Dashboard · authored',
    Cmp: makeProcessFlow({ title: 'Air pollution control hierarchy', accent: COL.green, steps: [
      { label: 'Prevent',  note: 'cleaner fuels, EVs' },
      { label: 'Capture',  note: 'scrubbers, filters, ESPs' },
      { label: 'Treat',    note: 'catalytic converters' },
      { label: 'Disperse', note: 'tall stacks (last resort)' },
    ] })
  }],
  '7.7':  [{ id: 'acid-rain', Cmp: AcidRain, caption: 'SO₂ + NOₓ + atmospheric water → sulfuric / nitric acid; deposits hundreds of km away.', source: 'EPA Clean Air Markets' }],
  '7.8':  [{ id: 'noise', caption: 'Sustained exposure above 85 dB causes hearing damage.', source: 'WHO Noise Guidelines',
    Cmp: makeSpectrum({ title: 'Decibel levels', stops: [
      { label: '30 dB',   note: 'quiet bedroom',     col: COL.green },
      { label: '60 dB',   note: 'conversation',      col: COL.green },
      { label: '85 dB',   note: 'damage threshold',   col: COL.amber },
      { label: '120 dB',  note: 'jet, painful',       col: COL.red },
      { label: '140+ dB', note: 'instant damage',     col: '#7f1d1d' },
    ] })
  }],

  // ====== Unit 8 remaining ======
  '8.1':  [{ id: 'pt-vs-np', caption: 'Point sources are single and identifiable. Non-point sources are diffuse.', source: 'EPA Clean Water Act',
    Cmp: makeTwoColumn({ title: 'Point vs non-point pollution',
      leftTitle: 'Point source',     leftCol: COL.amber, leftItems: ['identifiable single source','easier to regulate','industrial discharge','sewage outflow','smokestack'],
      rightTitle: 'Non-point source', rightCol: COL.red,  rightItems: ['diffuse, many origins','harder to regulate','agricultural runoff','urban stormwater','atmospheric deposition'],
    })
  }],
  '8.2':  [{ id: 'human-impact', caption: 'Six major categories of human impact on ecosystems.', source: 'HIPPO + climate framework',
    Cmp: makeConceptGrid({ title: 'Human impacts (HIPPO + C)', accent: COL.red, cols: 3, items: [
      { label: 'H — Habitat loss',    note: 'largest cause',          col: COL.red },
      { label: 'I — Invasives',       note: 'esp. on islands',         col: '#f97316' },
      { label: 'P — Pollution',       note: 'chemical, plastic, noise', col: COL.amber },
      { label: 'P — Population',      note: '8B → 10B',                 col: '#fbbf24' },
      { label: 'O — Overharvesting',  note: 'fishing, hunting',         col: COL.green },
      { label: 'C — Climate',         note: 'GHGs, warming',            col: COL.cyan },
    ] })
  }],
  '8.3':  [{ id: 'edcs', caption: 'Endocrine disruptors mimic, block, or alter natural hormones.', source: 'EPA / WHO IPCS',
    Cmp: makeConceptGrid({ title: 'Famous endocrine disruptors', accent: COL.amber, cols: 2, items: [
      { label: 'BPA',          note: 'plastic linings, receipts',       col: COL.red },
      { label: 'Phthalates',   note: 'flexible plastics, cosmetics',    col: '#f97316' },
      { label: 'PFAS',         note: 'forever chemicals — nonstick',    col: COL.amber },
      { label: 'DDT / DDE',    note: 'banned 1972 (eggshell thinning)', col: COL.dim },
      { label: 'PCBs',         note: 'banned 1979 (transformers)',       col: COL.dim },
      { label: 'Atrazine',     note: 'herbicide (frog sex reversal)',    col: COL.green },
    ] })
  }],
  '8.4':  [{ id: 'wetlands', caption: 'Wetlands provide outsized services per acre.', source: 'Ramsar Convention',
    Cmp: makeBarChart({ title: 'Wetland ecosystem services ($/ha/yr)', accent: COL.cyan, data: [
      { name: 'Mangrove coastal protection',    val: 8000, col: COL.cyan },
      { name: 'Salt marsh nursery',             val: 6000, col: COL.green },
      { name: 'Inland marsh water filtration',  val: 4500, col: COL.cyan },
      { name: 'Bog carbon storage',             val: 3500, col: '#7c4a1a' },
      { name: 'Riverine flood control',         val: 3000, col: COL.amber },
    ], max: 9000 })
  }],
  '8.6':  [{ id: 'thermal-poll', caption: 'Thermal pollution: warmer water holds less oxygen, harming aquatic life.', source: 'EPA Cooling Water',
    Cmp: makeProcessFlow({ title: 'Thermal pollution cascade', accent: COL.red, steps: [
      { label: 'Cooling intake',    note: 'plant withdraws cold water' },
      { label: 'Returns +5-15°C',  note: 'discharges warm water' },
      { label: 'Lower DO',          note: 'warm holds less O₂' },
      { label: 'Fish stress',       note: 'cold-water species lost' },
    ] })
  }],
  '8.7':  [{ id: 'pops', caption: '12 "dirty dozen" persistent organic pollutants restricted under Stockholm Convention.', source: 'Stockholm Convention 2001',
    Cmp: makeConceptGrid({ title: 'POPs — the dirty dozen', accent: COL.red, cols: 3, items: [
      { label: 'DDT',               note: 'insecticide',              col: COL.dim },
      { label: 'PCBs',              note: 'industrial fluid',          col: COL.dim },
      { label: 'Dioxins',           note: 'combustion byproduct',      col: COL.red },
      { label: 'Furans',            note: 'combustion byproduct',      col: COL.red },
      { label: 'Aldrin / dieldrin', note: 'insecticides',              col: COL.amber },
      { label: 'Mirex / toxaphene', note: 'insecticides',              col: COL.amber },
    ] })
  }],
  '8.9':  [{ id: 'msw', caption: 'US municipal solid waste composition (~5 lb/day per person).', source: 'EPA Advancing Sustainable Materials Management 2018',
    Cmp: makeBarChart({ title: 'US MSW composition (% by weight)', accent: COL.amber, data: [
      { name: 'Paper / paperboard', val: 23, col: COL.amber },
      { name: 'Food waste',         val: 22, col: COL.green },
      { name: 'Yard trimmings',     val: 12, col: COL.green },
      { name: 'Plastics',           val: 12, col: COL.red },
      { name: 'Metals',             val: 9,  col: COL.dim },
      { name: 'Wood',               val: 6,  col: '#7c4a1a' },
      { name: 'Glass',              val: 4,  col: COL.cyan },
      { name: 'Other',              val: 12, col: COL.slate },
    ], max: 30, unit: '%' })
  }],
  '8.10': [{ id: 'reduce-hier', caption: 'EPA\'s waste hierarchy — prevent first.', source: 'EPA WARM',
    Cmp: makeSpectrum({ title: 'Waste management hierarchy', stops: [
      { label: 'Reduce',  note: 'best — don\'t create',     col: COL.green },
      { label: 'Reuse',   note: 'extend product life',       col: '#a3e635' },
      { label: 'Recycle', note: 'process into new product',  col: COL.amber },
      { label: 'Recover', note: 'energy from incineration',  col: '#f97316' },
      { label: 'Dispose', note: 'worst — landfill',          col: COL.red },
    ] })
  }],
  '8.12': [{ id: 'ld50', caption: 'LD50 — the dose that kills 50% of a test population. Lower = more toxic.', source: 'OECD Test Guidelines',
    Cmp: makeBarChart({ title: 'LD50 (oral, rat) examples — mg/kg', accent: COL.red, data: [
      { name: 'Botulinum toxin', val: 0.001, col: '#7f1d1d' },
      { name: 'Ricin',           val: 0.022, col: COL.red },
      { name: 'Cyanide (KCN)',   val: 8,     col: COL.red },
      { name: 'Nicotine',        val: 50,    col: '#f97316' },
      { name: 'DDT',             val: 250,   col: COL.amber },
      { name: 'Caffeine',        val: 190,   col: COL.amber },
      { name: 'Table salt',      val: 3000,  col: COL.green },
      { name: 'Sugar (sucrose)', val: 30000, col: COL.green },
    ], max: 35000, unit: '' })
  }],
  '8.13': [{ id: 'dose-response', caption: 'Three dose-response patterns toxicologists recognize.', source: 'EPA IRIS',
    Cmp: makeConceptGrid({ title: 'Dose-response patterns', accent: COL.amber, cols: 3, items: [
      { label: 'Threshold',      note: 'no effect below NOAEL',           col: COL.green },
      { label: 'Linear (LNT)',   note: 'any dose has risk (carcinogens)', col: COL.amber },
      { label: 'Non-monotonic',  note: 'low-dose effects (EDCs)',          col: COL.red },
    ] })
  }],
  '8.14': [{ id: 'health', caption: 'Pollution-related premature deaths (Lancet 2017, ~9 million/yr globally).', source: 'Lancet Commission on Pollution & Health',
    Cmp: makeBarChart({ title: 'Pollution-related deaths globally (millions/yr)', accent: COL.red, data: [
      { name: 'Outdoor air',   val: 4.5, col: COL.red },
      { name: 'Indoor air',    val: 2.3, col: '#f97316' },
      { name: 'Water',         val: 1.4, col: COL.amber },
      { name: 'Lead exposure', val: 0.9, col: COL.dim },
    ], max: 5 })
  }],
  '8.15': [{ id: 'pathogens', caption: 'Major waterborne and vector-borne pathogens.', source: 'WHO',
    Cmp: makeConceptGrid({ title: 'Pathogen transmission routes', accent: COL.cyan, cols: 2, items: [
      { label: 'Waterborne',   note: 'cholera, typhoid, hep A, giardia',  col: COL.cyan },
      { label: 'Foodborne',    note: 'salmonella, E. coli, norovirus',     col: COL.green },
      { label: 'Vector-borne', note: 'malaria, dengue, Lyme, West Nile',   col: COL.red },
      { label: 'Airborne',     note: 'TB, measles, influenza, COVID',      col: COL.amber },
    ] })
  }],

  // ====== Unit 9 remaining ======
  '9.1':  [{ id: 'strato', caption: 'Stratospheric ozone (O₃) absorbs UV-B and UV-C. CFCs catalyze its destruction.', source: 'NOAA Stratospheric Ozone',
    Cmp: makeProcessFlow({ title: 'CFC → ozone destruction', accent: COL.red, steps: [
      { label: 'CFCs released',  note: 'AC, foams, aerosols' },
      { label: 'Rise to stratosphere', note: 'inert in troposphere' },
      { label: 'UV breaks Cl off', note: 'free Cl radical' },
      { label: 'Cl + O₃ → ClO + O₂', note: 'destroys ozone' },
      { label: 'Cl regenerated', note: 'one Cl destroys ~100,000 O₃' },
    ] })
  }],
  '9.2':  [{ id: 'mont-protocol', caption: 'Montreal Protocol (1987): froze, then phased out CFCs and most ozone-depleting substances.', source: 'UNEP',
    Cmp: makeConceptGrid({ title: 'Montreal Protocol replacements', accent: COL.green, cols: 1, items: [
      { label: 'CFCs (banned)',           note: 'high ODP, high GWP — phased out by 1996', col: COL.red },
      { label: 'HCFCs (interim)',         note: 'lower ODP — phasing out by 2030',         col: COL.amber },
      { label: 'HFCs (now, but high GWP)', note: 'no ODP, but high GWP — Kigali phase down', col: '#fbbf24' },
      { label: 'Natural refrigerants',     note: 'CO₂, ammonia, propane — no ODP, low GWP', col: COL.green },
    ] })
  }],
  '9.4':  [{ id: 'ghg-bars', caption: 'Comparing the three main greenhouse gases by global warming potential.', source: 'IPCC AR6',
    Cmp: makeBarChart({ title: 'GWP-100 vs CO₂ (multiplier)', accent: COL.red, data: [
      { name: 'CO₂ (reference)', val: 1,     col: '#7c4a1a' },
      { name: 'CH₄ (methane)',   val: 28,    col: COL.amber },
      { name: 'N₂O',             val: 273,   col: COL.red },
      { name: 'SF₆',             val: 23500, col: '#7f1d1d' },
    ], max: 25000, unit: '×' })
  }],
  '9.8':  [{ id: 'glacial', caption: 'Greenland and Antarctica are losing hundreds of Gt of ice per year.', source: 'NASA GRACE / GRACE-FO',
    Cmp: makeBarChart({ title: 'Ice loss (Gt/year, 2002-2024 avg)', accent: COL.cyan, data: [
      { name: 'Greenland',             val: 270, col: COL.cyan },
      { name: 'Antarctica',            val: 145, col: '#67e8f9' },
      { name: 'Mountain glaciers',     val: 250, col: COL.amber },
      { name: 'Arctic sea ice (Sept)', val: 13,  col: COL.red },
    ], max: 300, unit: ' Gt' })
  }],
  '9.9':  [{ id: 'cc-impacts', caption: 'Climate change cascades through every system: physical, biological, human.', source: 'IPCC AR6 WG2 SPM',
    Cmp: makeConceptGrid({ title: 'Climate change impacts', accent: COL.red, cols: 3, items: [
      { icon: '🌡️', label: 'Heatwaves',    note: 'longer, hotter, more frequent', col: COL.red },
      { icon: '🌊', label: 'Sea level',    note: '+27 cm since 1900',              col: COL.cyan },
      { icon: '🌪️', label: 'Storms',      note: 'wetter, more intense',           col: '#67e8f9' },
      { icon: '🌾', label: 'Crop yields',  note: 'declining in many regions',      col: COL.amber },
      { icon: '🦋', label: 'Ranges shift', note: 'species moving poleward',        col: COL.green },
      { icon: '🏥', label: 'Health',       note: 'heat, disease, displacement',    col: COL.red },
    ] })
  }],
};
