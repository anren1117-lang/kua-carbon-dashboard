// AP African American Studies — inline SVG figures.

export const APAFAM_FIGURES = {
  '1.2': {
    title: 'Trans-Atlantic slave trade destinations',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">~10.7M Africans who survived Middle Passage</text>
      <g font-size="10">
        <rect x="40" y="40" width="180" height="30" fill="#fef3c7" stroke="#a16207"/>
        <text x="130" y="60" text-anchor="middle">Brazil ~5M (47%)</text>
        <rect x="40" y="75" width="140" height="30" fill="#fef3c7" stroke="#a16207"/>
        <text x="110" y="95" text-anchor="middle">Caribbean ~4M (37%)</text>
        <rect x="40" y="110" width="50" height="30" fill="#fee2e2" stroke="#b91c1c"/>
        <text x="100" y="130" font-size="10" fill="#7c2d12">Br. N. Am. ~388K (3%)</text>
        <rect x="40" y="145" width="30" height="30" fill="#fef3c7" stroke="#a16207"/>
        <text x="90" y="165" font-size="10">Other ~1.4M (13%)</text>
      </g>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#475569">Despite tiny share, US enslaved population grew 4M+ by 1860 through natural increase.</text>
    </svg>`,
    caption: 'British North America (later US) received only 3% of enslaved Africans — yet built one of the largest enslaved populations through reproduction.',
  },
  '3.2': {
    title: 'Great Migration patterns',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="40" width="360" height="130" fill="#f1f5f9" stroke="#475569"/>
      <rect x="120" y="100" width="200" height="60" fill="#fef3c7" stroke="#a16207" stroke-opacity="0.7"/>
      <text x="220" y="135" text-anchor="middle" font-size="11" fill="#713f12">South (Jim Crow)</text>
      <path d="M150,100 Q120,60 80,55" stroke="#1e40af" stroke-width="3" fill="none" marker-end="url(#gm)"/>
      <text x="60" y="50" font-size="10" fill="#1e3a8a">Chicago</text>
      <path d="M200,100 Q220,60 230,55" stroke="#1e40af" stroke-width="3" fill="none" marker-end="url(#gm)"/>
      <text x="225" y="50" font-size="10" fill="#1e3a8a">NYC, Philly</text>
      <path d="M280,100 Q330,60 360,55" stroke="#1e40af" stroke-width="3" fill="none" marker-end="url(#gm)"/>
      <text x="345" y="50" font-size="10" fill="#1e3a8a">Detroit, LA</text>
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Great Migration: ~6 million 1910s-1970s</text>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#475569">Reshaped American demographics and politics</text>
      <defs><marker id="gm" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#1e40af"/></marker></defs>
    </svg>`,
    caption: 'Six million Black Americans migrated from rural South to Northern and Western cities — the largest internal migration in US history.',
  },
};
