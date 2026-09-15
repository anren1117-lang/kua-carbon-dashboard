// AP Precalculus — inline SVG figures.

export const APPRECALC_FIGURES = {
  '2.1': {
    title: 'Exponential growth vs decay',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="170" x2="380" y2="170" stroke="#475569"/>
      <line x1="200" y1="20" x2="200" y2="170" stroke="#475569"/>
      <path d="M40,165 Q120,165 200,150 Q280,90 380,20" stroke="#1e40af" stroke-width="2.5" fill="none"/>
      <text x="385" y="30" font-size="11" fill="#1e3a8a">b > 1</text>
      <path d="M40,20 Q120,90 200,150 Q280,165 380,168" stroke="#b91c1c" stroke-width="2.5" fill="none"/>
      <text x="60" y="40" font-size="11" fill="#7c2d12">0 < b < 1</text>
      <text x="200" y="195" text-anchor="middle" font-size="11" fill="#475569">Both have horizontal asymptote y = 0</text>
    </svg>`,
    caption: 'Exponentials: growth (b>1) increases without bound; decay (0<b<1) approaches zero.',
  },
  '3.1': {
    title: 'Unit circle',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="110" x2="360" y2="110" stroke="#94a3b8"/>
      <line x1="200" y1="20" x2="200" y2="200" stroke="#94a3b8"/>
      <circle cx="200" cy="110" r="70" fill="none" stroke="#1e40af" stroke-width="2"/>
      <g font-size="10">
        <circle cx="270" cy="110" r="3" fill="#b91c1c"/>
        <text x="275" y="105">(1,0): 0°</text>
        <circle cx="235" cy="49" r="3" fill="#b91c1c"/>
        <text x="240" y="48">(√3/2, 1/2): 30°</text>
        <circle cx="200" cy="40" r="3" fill="#b91c1c"/>
        <text x="160" y="35">(0,1): 90°</text>
        <circle cx="130" cy="110" r="3" fill="#b91c1c"/>
        <text x="80" y="105">(−1,0): 180°</text>
        <circle cx="200" cy="180" r="3" fill="#b91c1c"/>
        <text x="170" y="195">(0,−1): 270°</text>
      </g>
      <text x="200" y="220" text-anchor="middle" font-size="10" fill="#475569">cos θ = x, sin θ = y on unit circle</text>
    </svg>`,
    caption: 'The unit circle gives sin and cos as y- and x-coordinates of a point on a radius-1 circle.',
  },
};
