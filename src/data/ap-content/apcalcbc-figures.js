// AP Calculus BC — inline SVG diagrams.

export const APCALCBC_FIGURES = {
  '6.2': {
    title: 'Riemann sums',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="170" x2="370" y2="170" stroke="#475569"/>
      <path d="M40,170 Q200,30 370,170" stroke="#1e40af" stroke-width="2" fill="none"/>
      <g fill="#dbeafe" stroke="#1e40af" stroke-opacity="0.7" fill-opacity="0.45">
        <rect x="60" y="140" width="40" height="30"/>
        <rect x="100" y="100" width="40" height="70"/>
        <rect x="140" y="60" width="40" height="110"/>
        <rect x="180" y="50" width="40" height="120"/>
        <rect x="220" y="60" width="40" height="110"/>
        <rect x="260" y="100" width="40" height="70"/>
        <rect x="300" y="140" width="40" height="30"/>
      </g>
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Riemann sum approximation</text>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#475569">Rectangles approximate ∫f dx. Refine to get definite integral.</text>
    </svg>`,
    caption: 'A Riemann sum approximates the area under a curve with rectangles.',
  },
  '9.3': {
    title: 'Polar curve r = 1 + cos θ (cardioid)',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="100" x2="360" y2="100" stroke="#94a3b8" stroke-width="1"/>
      <line x1="200" y1="20" x2="200" y2="180" stroke="#94a3b8" stroke-width="1"/>
      <path d="M280,100 Q310,30 200,30 Q90,30 120,100 Q90,170 200,170 Q310,170 280,100" stroke="#b91c1c" stroke-width="2.5" fill="rgba(254,202,202,0.3)"/>
      <circle cx="200" cy="100" r="2" fill="#475569"/>
      <text x="200" y="195" text-anchor="middle" font-size="11" fill="#475569">Cardioid: r = 1 + cos θ</text>
    </svg>`,
    caption: 'Polar coordinates create elegant curves impossible to graph as y = f(x).',
  },
  '10.4': {
    title: 'Taylor approximation',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="100" x2="360" y2="100" stroke="#94a3b8"/>
      <line x1="200" y1="20" x2="200" y2="180" stroke="#94a3b8"/>
      <path d="M40,180 Q200,-60 360,180" stroke="#15803d" stroke-width="3" fill="none"/>
      <path d="M40,170 Q200,-30 360,170" stroke="#1e40af" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
      <path d="M40,150 Q200,30 360,150" stroke="#a16207" stroke-width="1.5" stroke-dasharray="3 2" fill="none"/>
      <text x="370" y="50" font-size="10" fill="#14532d" font-weight="bold">f(x)</text>
      <text x="370" y="70" font-size="10" fill="#1e3a8a">T₅</text>
      <text x="370" y="90" font-size="10" fill="#713f12">T₂</text>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#475569">Higher degree Taylor poly = better local approximation</text>
    </svg>`,
    caption: 'Taylor polynomials approximate functions more accurately near the center as degree grows.',
  },
};
