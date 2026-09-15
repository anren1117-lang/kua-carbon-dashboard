// AP Art History — inline SVG diagrams.

export const APART_FIGURES = {
  '1.2': {
    title: 'Stonehenge trilithon',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="80" y="60" width="40" height="120" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <rect x="160" y="60" width="40" height="120" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <rect x="240" y="60" width="40" height="120" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <rect x="320" y="60" width="40" height="120" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <rect x="70" y="40" width="140" height="25" fill="#64748b" stroke="#475569" stroke-width="2"/>
      <rect x="230" y="40" width="140" height="25" fill="#64748b" stroke="#475569" stroke-width="2"/>
      <text x="200" y="30" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Trilithon construction</text>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#475569">2 uprights + 1 lintel = 3 stones ("trilithon")</text>
    </svg>`,
    caption: 'Stonehenge\'s signature construction: two upright stones supporting a horizontal lintel.',
  },
  '2.2': {
    title: 'Contrapposto',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <g fill="#dbeafe" stroke="#1e40af" stroke-width="1.5">
        <circle cx="100" cy="50" r="14"/>
        <line x1="100" y1="64" x2="100" y2="130" stroke="#1e40af" stroke-width="3"/>
        <line x1="100" y1="130" x2="92" y2="190"/>
        <line x1="100" y1="130" x2="108" y2="190"/>
        <line x1="100" y1="90" x2="78" y2="130"/>
        <line x1="100" y1="90" x2="122" y2="130"/>
      </g>
      <text x="100" y="210" text-anchor="middle" font-size="11" fill="#475569">Rigid (Archaic)</text>

      <g fill="#dcfce7" stroke="#15803d" stroke-width="1.5">
        <circle cx="280" cy="50" r="14"/>
        <line x1="280" y1="64" x2="290" y2="130" stroke="#15803d" stroke-width="3"/>
        <line x1="290" y1="130" x2="278" y2="190"/>
        <line x1="290" y1="130" x2="304" y2="186"/>
        <line x1="280" y1="90" x2="258" y2="120"/>
        <line x1="280" y1="90" x2="305" y2="135"/>
      </g>
      <text x="290" y="210" text-anchor="middle" font-size="11" fill="#475569">Contrapposto (Classical)</text>
      <text x="200" y="20" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Weight shift transforms stance</text>
    </svg>`,
    caption: 'Contrapposto: Classical Greek innovation. Weight on one leg creates a natural S-curve through the body.',
  },
  '3.2': {
    title: 'Linear perspective',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="40" width="320" height="120" fill="none" stroke="#475569"/>
      <line x1="40" y1="100" x2="200" y2="100" stroke="#94a3b8" stroke-dasharray="3 3"/>
      <line x1="360" y1="100" x2="200" y2="100" stroke="#94a3b8" stroke-dasharray="3 3"/>
      <circle cx="200" cy="100" r="4" fill="#b91c1c"/>
      <text x="200" y="120" text-anchor="middle" font-size="10" fill="#7c2d12">Vanishing point</text>
      <line x1="40" y1="40" x2="200" y2="100" stroke="#1e40af"/>
      <line x1="360" y1="40" x2="200" y2="100" stroke="#1e40af"/>
      <line x1="40" y1="160" x2="200" y2="100" stroke="#1e40af"/>
      <line x1="360" y1="160" x2="200" y2="100" stroke="#1e40af"/>
      <text x="200" y="20" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Linear perspective (Brunelleschi/Alberti)</text>
      <text x="200" y="190" text-anchor="middle" font-size="10" fill="#475569">Renaissance breakthrough — 2D surfaces look 3D</text>
    </svg>`,
    caption: 'Linear perspective: parallel lines converge to a vanishing point. Brunelleschi formalized; Masaccio applied (Holy Trinity).',
  },
  '4.2': {
    title: 'Impressionist brushwork principle',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Close-up</text>
      <rect x="30" y="40" width="140" height="140" fill="#f1f5f9" stroke="#475569"/>
      <circle cx="60" cy="80" r="8" fill="#1e40af" fill-opacity="0.6"/>
      <circle cx="80" cy="90" r="8" fill="#fb923c" fill-opacity="0.6"/>
      <circle cx="100" cy="80" r="8" fill="#15803d" fill-opacity="0.6"/>
      <circle cx="120" cy="100" r="8" fill="#b91c1c" fill-opacity="0.6"/>
      <circle cx="80" cy="120" r="8" fill="#a16207" fill-opacity="0.6"/>
      <circle cx="100" cy="140" r="8" fill="#1e40af" fill-opacity="0.6"/>
      <text x="100" y="195" text-anchor="middle" font-size="10" fill="#475569">visible separate strokes</text>

      <text x="300" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">From distance</text>
      <rect x="230" y="40" width="140" height="140" fill="#7c8195"/>
      <text x="300" y="115" text-anchor="middle" font-size="11" fill="#f1f5f9">strokes blend into</text>
      <text x="300" y="130" text-anchor="middle" font-size="11" fill="#f1f5f9">unified atmosphere</text>
      <text x="300" y="195" text-anchor="middle" font-size="10" fill="#475569">light and color sensation</text>
    </svg>`,
    caption: 'Impressionists let viewer\'s eye mix brushstrokes into atmospheric effects.',
  },
  '5.1': {
    title: 'Mesoamerican pyramid layout',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,170 350,170 280,40 120,40" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/>
      <line x1="120" y1="40" x2="280" y2="40" stroke="#c2410c" stroke-width="2"/>
      <rect x="170" y="50" width="60" height="30" fill="#fef3c7" stroke="#a16207"/>
      <text x="200" y="68" text-anchor="middle" font-size="9" fill="#713f12">temple</text>
      <line x1="120" y1="170" x2="180" y2="40" stroke="#a16207" stroke-width="2"/>
      <line x1="280" y1="170" x2="220" y2="40" stroke="#a16207" stroke-width="2"/>
      <text x="200" y="120" text-anchor="middle" font-size="10" fill="#7c2d12">stepped pyramid</text>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#475569">Stairs lead to temple at top.</text>
      <text x="200" y="20" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Templo Mayor / Mesoamerican type</text>
    </svg>`,
    caption: 'Mesoamerican stepped pyramids supported temples at their summits, where ritual took place.',
  },
};
