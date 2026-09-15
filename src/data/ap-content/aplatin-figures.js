// AP Latin — inline SVG diagrams.

export const APLATIN_FIGURES = {
  '1.3': {
    title: 'Latin cases',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Six Latin cases and their main functions</text>
      <g font-size="10">
        <rect x="20" y="40" width="170" height="28" fill="#dbeafe" stroke="#1e40af"/>
        <text x="105" y="58" text-anchor="middle">Nominative: subject</text>
        <rect x="210" y="40" width="170" height="28" fill="#dbeafe" stroke="#1e40af"/>
        <text x="295" y="58" text-anchor="middle">Genitive: "of," possession</text>
        <rect x="20" y="72" width="170" height="28" fill="#dcfce7" stroke="#15803d"/>
        <text x="105" y="90" text-anchor="middle">Dative: "to" / "for"</text>
        <rect x="210" y="72" width="170" height="28" fill="#dcfce7" stroke="#15803d"/>
        <text x="295" y="90" text-anchor="middle">Accusative: direct object</text>
        <rect x="20" y="104" width="170" height="28" fill="#fef3c7" stroke="#a16207"/>
        <text x="105" y="122" text-anchor="middle">Ablative: by, with, from, in</text>
        <rect x="210" y="104" width="170" height="28" fill="#fef3c7" stroke="#a16207"/>
        <text x="295" y="122" text-anchor="middle">Vocative: direct address</text>
      </g>
      <text x="200" y="160" text-anchor="middle" font-size="11" fill="#475569">Endings tell the case — and the case tells you the role.</text>
      <text x="200" y="178" text-anchor="middle" font-size="11" fill="#475569">Word order is flexible because the endings carry meaning.</text>
    </svg>`,
    caption: 'Latin\'s case system means endings — not position — tell you each word\'s role.',
  },
  '7.3': {
    title: 'Dactylic hexameter',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="11" font-family="serif" font-style="italic">"Arma virumque cano, Troiae qui primus ab oris"</text>
      <text x="200" y="42" text-anchor="middle" font-size="9" fill="#475569">Aeneid 1.1</text>
      <g font-size="14" font-family="monospace">
        <text x="60" y="80" text-anchor="middle">— ⏑ ⏑</text>
        <text x="60" y="100" text-anchor="middle">Ar-ma vi-</text>
        <text x="60" y="115" text-anchor="middle" font-size="9" fill="#475569">dactyl</text>
        <text x="125" y="80" text-anchor="middle">— ⏑ ⏑</text>
        <text x="125" y="100" text-anchor="middle">rum-que ca-</text>
        <text x="125" y="115" text-anchor="middle" font-size="9" fill="#475569">dactyl</text>
        <text x="190" y="80" text-anchor="middle">— ⏑ ⏑</text>
        <text x="190" y="100" text-anchor="middle">no Tro-i-</text>
        <text x="190" y="115" text-anchor="middle" font-size="9" fill="#475569">dactyl</text>
        <text x="245" y="80" text-anchor="middle">— —</text>
        <text x="245" y="100" text-anchor="middle">ae qui</text>
        <text x="245" y="115" text-anchor="middle" font-size="9" fill="#475569">spondee</text>
        <text x="305" y="80" text-anchor="middle">— ⏑ ⏑</text>
        <text x="305" y="100" text-anchor="middle">pri-mus ab</text>
        <text x="305" y="115" text-anchor="middle" font-size="9" fill="#475569">dactyl</text>
        <text x="365" y="80" text-anchor="middle">— —</text>
        <text x="365" y="100" text-anchor="middle">o-ris</text>
        <text x="365" y="115" text-anchor="middle" font-size="9" fill="#475569">spondee</text>
      </g>
      <text x="200" y="160" text-anchor="middle" font-size="10" fill="#475569">6 feet per line, dactyl (— ⏑ ⏑) or spondee (— —)</text>
      <text x="200" y="180" text-anchor="middle" font-size="10" fill="#475569">Foot 5 usually dactyl; foot 6 always spondee/trochee</text>
    </svg>`,
    caption: 'Dactylic hexameter: the meter of Latin epic. Each line scans into six feet of long/short syllables.',
  },
  '8.2': {
    title: 'Roman history outline',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="120" x2="380" y2="120" stroke="#475569" stroke-width="2"/>
      <g font-size="9">
        <circle cx="60" cy="120" r="4" fill="#1e40af"/>
        <text x="60" y="105" text-anchor="middle" fill="#1e3a8a">753</text>
        <text x="60" y="140" text-anchor="middle">Founding (myth)</text>
        <circle cx="130" cy="120" r="4" fill="#1e40af"/>
        <text x="130" y="105" text-anchor="middle" fill="#1e3a8a">509</text>
        <text x="130" y="140" text-anchor="middle">Republic</text>
        <circle cx="200" cy="120" r="5" fill="#b91c1c"/>
        <text x="200" y="103" text-anchor="middle" fill="#7c2d12" font-weight="bold">58-50</text>
        <text x="200" y="140" text-anchor="middle">Caesar in Gaul</text>
        <circle cx="240" cy="120" r="5" fill="#b91c1c"/>
        <text x="240" y="103" text-anchor="middle" fill="#7c2d12">44</text>
        <text x="240" y="140" text-anchor="middle">Caesar killed</text>
        <circle cx="290" cy="120" r="5" fill="#15803d"/>
        <text x="290" y="103" text-anchor="middle" fill="#14532d" font-weight="bold">27</text>
        <text x="290" y="140" text-anchor="middle">Augustus</text>
        <circle cx="330" cy="120" r="5" fill="#15803d"/>
        <text x="330" y="103" text-anchor="middle" fill="#14532d">19</text>
        <text x="330" y="140" text-anchor="middle">Vergil dies</text>
        <circle cx="370" cy="120" r="5" fill="#1e40af"/>
        <text x="370" y="103" text-anchor="middle" fill="#1e3a8a">476</text>
        <text x="370" y="140" text-anchor="middle">West falls</text>
      </g>
      <text x="200" y="170" text-anchor="middle" font-size="10" fill="#475569">BCE → CE                                            (CE)</text>
      <text x="200" y="190" text-anchor="middle" font-size="11" fill="#475569">Caesar wrote late Republic; Vergil under Augustus</text>
    </svg>`,
    caption: 'Caesar and Vergil bracket the transition from Republic to Empire.',
  },
};
