// AP European History — inline SVG diagrams.

export const APEURO_FIGURES = {
  '1.3': {
    title: 'Reformation split',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="150" y="20" width="100" height="35" fill="#fef3c7" stroke="#a16207"/>
      <text x="200" y="40" text-anchor="middle" font-size="11" font-weight="bold">Catholic Church</text>
      <text x="200" y="52" text-anchor="middle" font-size="9">~1500</text>
      <line x1="200" y1="55" x2="200" y2="75" stroke="#475569" stroke-width="2"/>
      <line x1="80" y1="75" x2="320" y2="75" stroke="#475569" stroke-width="2"/>
      <line x1="80" y1="75" x2="80" y2="100" stroke="#475569" stroke-width="2" marker-end="url(#rf)"/>
      <line x1="160" y1="75" x2="160" y2="100" stroke="#475569" stroke-width="2" marker-end="url(#rf)"/>
      <line x1="240" y1="75" x2="240" y2="100" stroke="#475569" stroke-width="2" marker-end="url(#rf)"/>
      <line x1="320" y1="75" x2="320" y2="100" stroke="#475569" stroke-width="2" marker-end="url(#rf)"/>
      <g font-size="10">
        <rect x="40" y="100" width="80" height="35" fill="#dbeafe" stroke="#1e40af"/>
        <text x="80" y="115" text-anchor="middle" fill="#1e3a8a">Lutheran</text>
        <text x="80" y="128" text-anchor="middle">N. Germany</text>
        <rect x="120" y="100" width="80" height="35" fill="#dcfce7" stroke="#15803d"/>
        <text x="160" y="115" text-anchor="middle" fill="#14532d">Calvinist</text>
        <text x="160" y="128" text-anchor="middle">Geneva, NL</text>
        <rect x="200" y="100" width="80" height="35" fill="#fce7f3" stroke="#a21caf"/>
        <text x="240" y="115" text-anchor="middle" fill="#86198f">Anglican</text>
        <text x="240" y="128" text-anchor="middle">England</text>
        <rect x="280" y="100" width="80" height="35" fill="#fee2e2" stroke="#b91c1c"/>
        <text x="320" y="115" text-anchor="middle" fill="#7c2d12">Catholic</text>
        <text x="320" y="128" text-anchor="middle">stayed</text>
      </g>
      <text x="200" y="180" text-anchor="middle" font-size="10" fill="#475569">Religious wars followed (1562-1648).</text>
      <text x="200" y="200" text-anchor="middle" font-size="10" fill="#475569">Peace of Westphalia (1648) ended them.</text>
      <defs><marker id="rf" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'The Reformation shattered Western Christendom into competing confessions.',
  },
  '2.4': {
    title: 'Heliocentric model',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="100" r="20" fill="#fef3c7" stroke="#a16207"/>
      <text x="200" y="105" text-anchor="middle" font-size="10" fill="#713f12">Sun</text>
      <circle cx="200" cy="100" r="45" fill="none" stroke="#94a3b8" stroke-dasharray="3 3"/>
      <circle cx="245" cy="100" r="5" fill="#dbeafe" stroke="#1e40af"/>
      <text x="245" y="92" text-anchor="middle" font-size="8" fill="#1e3a8a">Mercury</text>
      <circle cx="200" cy="100" r="70" fill="none" stroke="#94a3b8" stroke-dasharray="3 3"/>
      <circle cx="270" cy="100" r="6" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="270" y="120" text-anchor="middle" font-size="8" fill="#7c2d12">Venus</text>
      <circle cx="200" cy="100" r="95" fill="none" stroke="#94a3b8" stroke-dasharray="3 3"/>
      <circle cx="295" cy="100" r="7" fill="#dcfce7" stroke="#15803d"/>
      <text x="295" y="92" text-anchor="middle" font-size="8" fill="#14532d">Earth</text>
      <text x="200" y="20" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Heliocentric (Copernicus, 1543)</text>
      <text x="200" y="180" text-anchor="middle" font-size="10" fill="#475569">Confirmed by Galileo\'s observations; defended by Kepler.</text>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#475569">Newton (1687) gave it mathematical foundation.</text>
    </svg>`,
    caption: 'Scientific Revolution: Sun at center, with Earth as one planet among many.',
  },
  '3.1': {
    title: 'Absolutism vs constitutionalism',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="40" width="160" height="150" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="110" y="60" text-anchor="middle" font-size="12" fill="#7c2d12" font-weight="bold">France: Absolutism</text>
      <text x="110" y="85" text-anchor="middle" font-size="10">Divine right monarchy</text>
      <text x="110" y="103" text-anchor="middle" font-size="10">Louis XIV (Versailles)</text>
      <text x="110" y="121" text-anchor="middle" font-size="10">Centralized bureaucracy</text>
      <text x="110" y="139" text-anchor="middle" font-size="10">Standing army</text>
      <text x="110" y="157" text-anchor="middle" font-size="10">No Estates-General</text>
      <text x="110" y="175" text-anchor="middle" font-size="10">1614 → 1789 (175 yrs)</text>

      <rect x="210" y="40" width="160" height="150" fill="#dbeafe" stroke="#1e40af"/>
      <text x="290" y="60" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">England: Constitutional</text>
      <text x="290" y="85" text-anchor="middle" font-size="10">Civil War 1642-49</text>
      <text x="290" y="103" text-anchor="middle" font-size="10">Glorious Revolution 1688</text>
      <text x="290" y="121" text-anchor="middle" font-size="10">English Bill of Rights 1689</text>
      <text x="290" y="139" text-anchor="middle" font-size="10">Parliament supreme</text>
      <text x="290" y="157" text-anchor="middle" font-size="10">Locke: natural rights</text>
      <text x="290" y="175" text-anchor="middle" font-size="10">Limited monarchy</text>
    </svg>`,
    caption: 'Two divergent paths in 17th-century Europe — direct legacies into modern politics.',
  },
  '5.3': {
    title: 'German unification (1864-1871)',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="170" x2="380" y2="170" stroke="#475569" stroke-width="2"/>
      <g font-size="10">
        <line x1="80" y1="170" x2="80" y2="100" stroke="#1e40af" stroke-width="2"/>
        <circle cx="80" cy="100" r="5" fill="#1e40af"/>
        <text x="80" y="88" text-anchor="middle" fill="#1e3a8a">1864</text>
        <text x="80" y="190" text-anchor="middle">Denmark</text>
        <line x1="180" y1="170" x2="180" y2="80" stroke="#1e40af" stroke-width="2"/>
        <circle cx="180" cy="80" r="5" fill="#1e40af"/>
        <text x="180" y="68" text-anchor="middle" fill="#1e3a8a">1866</text>
        <text x="180" y="190" text-anchor="middle">Austria</text>
        <line x1="280" y1="170" x2="280" y2="60" stroke="#1e40af" stroke-width="2"/>
        <circle cx="280" cy="60" r="5" fill="#1e40af"/>
        <text x="280" y="48" text-anchor="middle" fill="#1e3a8a">1870-71</text>
        <text x="280" y="190" text-anchor="middle">France</text>
        <line x1="350" y1="170" x2="350" y2="40" stroke="#b91c1c" stroke-width="2.5"/>
        <circle cx="350" cy="40" r="6" fill="#b91c1c"/>
        <text x="350" y="28" text-anchor="middle" fill="#7c2d12" font-weight="bold">Jan 1871</text>
        <text x="350" y="190" text-anchor="middle">Empire</text>
      </g>
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Bismarck\'s three wars → German Empire at Versailles</text>
    </svg>`,
    caption: '"Blood and iron": Bismarck unified Germany through three deliberately provoked wars.',
  },
  '7.3': {
    title: 'Rise of fascism',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="170" x2="380" y2="170" stroke="#475569" stroke-width="2"/>
      <g font-size="10">
        <circle cx="70" cy="170" r="5" fill="#7c2d12"/>
        <text x="70" y="155" text-anchor="middle" fill="#7c2d12">1922</text>
        <text x="70" y="190" text-anchor="middle">Mussolini</text>
        <circle cx="180" cy="170" r="5" fill="#7c2d12"/>
        <text x="180" y="155" text-anchor="middle" fill="#7c2d12">1929</text>
        <text x="180" y="190" text-anchor="middle">Depression</text>
        <circle cx="260" cy="170" r="6" fill="#b91c1c"/>
        <text x="260" y="155" text-anchor="middle" fill="#7c2d12" font-weight="bold">1933</text>
        <text x="260" y="190" text-anchor="middle">Hitler</text>
        <circle cx="320" cy="170" r="5" fill="#7c2d12"/>
        <text x="320" y="155" text-anchor="middle" fill="#7c2d12">1936-39</text>
        <text x="320" y="190" text-anchor="middle">Spanish CW</text>
        <circle cx="370" cy="170" r="6" fill="#b91c1c"/>
        <text x="370" y="155" text-anchor="middle" fill="#7c2d12" font-weight="bold">1939</text>
        <text x="370" y="190" text-anchor="middle">WWII</text>
      </g>
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Interwar Europe → catastrophe</text>
      <text x="200" y="40" text-anchor="middle" font-size="10" fill="#475569">Depression + Versailles grievances + ideological extremism</text>
    </svg>`,
    caption: 'The Great Depression created the conditions in which fascism could capture mass support.',
  },
  '8.1': {
    title: 'Cold War Europe',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Divided Europe ~1955</text>
      <rect x="40" y="40" width="160" height="140" fill="#dbeafe" stroke="#1e40af"/>
      <text x="120" y="60" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">West (NATO)</text>
      <text x="120" y="85" text-anchor="middle" font-size="10">USA-led alliance</text>
      <text x="120" y="103" text-anchor="middle" font-size="10">Democracies</text>
      <text x="120" y="121" text-anchor="middle" font-size="10">Market economies</text>
      <text x="120" y="139" text-anchor="middle" font-size="10">Marshall Plan aid</text>
      <text x="120" y="157" text-anchor="middle" font-size="10">Welfare states</text>
      <text x="120" y="175" text-anchor="middle" font-size="10">FRG, UK, France, ...</text>

      <rect x="200" y="40" width="160" height="140" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="280" y="60" text-anchor="middle" font-size="12" fill="#7c2d12" font-weight="bold">East (Warsaw Pact)</text>
      <text x="280" y="85" text-anchor="middle" font-size="10">USSR-led</text>
      <text x="280" y="103" text-anchor="middle" font-size="10">Single-party states</text>
      <text x="280" y="121" text-anchor="middle" font-size="10">Planned economies</text>
      <text x="280" y="139" text-anchor="middle" font-size="10">No Marshall aid</text>
      <text x="280" y="157" text-anchor="middle" font-size="10">Cold War repression</text>
      <text x="280" y="175" text-anchor="middle" font-size="10">GDR, Poland, ...</text>

      <line x1="200" y1="40" x2="200" y2="180" stroke="#7c2d12" stroke-width="3" stroke-dasharray="6 4"/>
      <text x="200" y="200" text-anchor="middle" font-size="10" fill="#7c2d12">Iron Curtain</text>
    </svg>`,
    caption: 'For 40+ years, an Iron Curtain split Europe into two systems.',
  },
};
