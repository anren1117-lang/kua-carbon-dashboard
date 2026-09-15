// AP Physics C: E&M — inline SVG figures.

export const APPHYSCEM_FIGURES = {
  '1.3': {
    title: "Gauss's law — symmetric distributions",
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="100" r="60" fill="none" stroke="#1e40af" stroke-width="2" stroke-dasharray="4 3"/>
      <circle cx="200" cy="100" r="15" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="200" y="105" text-anchor="middle" font-size="11" fill="#7c2d12">+Q</text>
      <g stroke="#b91c1c" stroke-width="1.5">
        <line x1="200" y1="40" x2="200" y2="20" marker-end="url(#g)"/>
        <line x1="200" y1="160" x2="200" y2="180" marker-end="url(#g)"/>
        <line x1="140" y1="100" x2="120" y2="100" marker-end="url(#g)"/>
        <line x1="260" y1="100" x2="280" y2="100" marker-end="url(#g)"/>
      </g>
      <text x="200" y="35" text-anchor="middle" font-size="10" fill="#7c2d12">E</text>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#475569">Gaussian sphere; ∮E·dA = E·4πr² = Q/ε₀</text>
      <defs><marker id="g" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#b91c1c"/></marker></defs>
    </svg>`,
    caption: 'For symmetric charge distributions, Gauss\'s law gives E directly.',
  },
  '4.1': {
    title: 'Charged particle in B field',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="11" fill="#475569">B into page (×)</text>
      <g fill="#475569" font-size="10">
        <text x="60" y="50">×</text><text x="120" y="50">×</text><text x="180" y="50">×</text><text x="240" y="50">×</text><text x="300" y="50">×</text><text x="360" y="50">×</text>
        <text x="60" y="90">×</text><text x="180" y="90">×</text><text x="300" y="90">×</text><text x="360" y="90">×</text>
        <text x="60" y="130">×</text><text x="120" y="130">×</text><text x="180" y="130">×</text><text x="240" y="130">×</text><text x="300" y="130">×</text><text x="360" y="130">×</text>
        <text x="60" y="170">×</text><text x="120" y="170">×</text><text x="180" y="170">×</text><text x="240" y="170">×</text><text x="300" y="170">×</text><text x="360" y="170">×</text>
      </g>
      <circle cx="220" cy="100" r="40" fill="none" stroke="#1e40af" stroke-width="2"/>
      <circle cx="260" cy="100" r="4" fill="#b91c1c"/>
      <line x1="260" y1="100" x2="260" y2="70" stroke="#b91c1c" stroke-width="2" marker-end="url(#em)"/>
      <text x="270" y="60" font-size="10" fill="#7c2d12">v</text>
      <line x1="260" y1="100" x2="290" y2="100" stroke="#15803d" stroke-width="2" marker-end="url(#em)"/>
      <text x="290" y="115" font-size="10" fill="#14532d">F=qv×B</text>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#475569">r = mv/(qB);  T = 2πm/(qB)</text>
      <defs><marker id="em" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'A charged particle moving perpendicular to B follows a circular path.',
  },
};
