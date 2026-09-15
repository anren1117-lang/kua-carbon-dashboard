// AP World History — inline SVG diagrams.

export const APWORLD_FIGURES = {
  '1.1': {
    title: 'Song China innovations',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="13" fill="#1e3a8a" font-weight="bold">Song China (960-1279) — ahead of the world</text>
      <g font-size="11">
        <rect x="20" y="40" width="80" height="40" fill="#fee2e2" stroke="#b91c1c"/>
        <text x="60" y="65" text-anchor="middle">paper money</text>
        <rect x="110" y="40" width="80" height="40" fill="#fef3c7" stroke="#a16207"/>
        <text x="150" y="65" text-anchor="middle">compass</text>
        <rect x="200" y="40" width="80" height="40" fill="#dcfce7" stroke="#15803d"/>
        <text x="240" y="65" text-anchor="middle">gunpowder</text>
        <rect x="290" y="40" width="90" height="40" fill="#dbeafe" stroke="#1e40af"/>
        <text x="335" y="58" text-anchor="middle">movable</text>
        <text x="335" y="72" text-anchor="middle">type</text>
        <rect x="20" y="100" width="80" height="40" fill="#fce7f3" stroke="#a21caf"/>
        <text x="60" y="118" text-anchor="middle">civil</text>
        <text x="60" y="132" text-anchor="middle">service exam</text>
        <rect x="110" y="100" width="80" height="40" fill="#fed7aa" stroke="#c2410c"/>
        <text x="150" y="118" text-anchor="middle">Champa rice</text>
        <text x="150" y="132" text-anchor="middle">(pop boom)</text>
        <rect x="200" y="100" width="80" height="40" fill="#e9d5ff" stroke="#7e22ce"/>
        <text x="240" y="118" text-anchor="middle">iron + steel</text>
        <text x="240" y="132" text-anchor="middle">industry</text>
        <rect x="290" y="100" width="90" height="40" fill="#bae6fd" stroke="#0369a1"/>
        <text x="335" y="118" text-anchor="middle">Hangzhou</text>
        <text x="335" y="132" text-anchor="middle">~1M people</text>
      </g>
      <text x="200" y="180" text-anchor="middle" font-size="11" fill="#475569">Europe wouldn\'t match this for centuries.</text>
    </svg>`,
    caption: 'Song China was the world\'s most advanced economy in 1200 — Europe was a backwater by comparison.',
  },
  '2.2': {
    title: 'Mongol Empire at peak',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="200" cy="100" rx="170" ry="60" fill="#fed7aa" stroke="#c2410c"/>
      <text x="200" y="40" text-anchor="middle" font-size="12" fill="#7c2d12" font-weight="bold">Mongol Empire ~1280</text>
      <text x="65" y="90" text-anchor="middle" font-size="10">Hungary</text>
      <text x="125" y="100" text-anchor="middle" font-size="10">Persia</text>
      <text x="190" y="100" text-anchor="middle" font-size="10">Central Asia</text>
      <text x="265" y="90" text-anchor="middle" font-size="10">Mongolia</text>
      <text x="330" y="100" text-anchor="middle" font-size="10">China</text>
      <text x="200" y="115" text-anchor="middle" font-size="10" fill="#475569">— largest contiguous land empire ever —</text>
      <text x="200" y="180" text-anchor="middle" font-size="11" fill="#475569">Pax Mongolica enabled safe Eurasian trade; spread tech, disease (Black Death).</text>
    </svg>`,
    caption: 'Mongol conquests connected Eurasia. Marco Polo and Ibn Battuta traveled freely under one rule.',
  },
  '3.1': {
    title: 'Three Islamic gunpowder empires',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="40" width="115" height="130" fill="#dcfce7" stroke="#15803d"/>
      <text x="78" y="60" text-anchor="middle" font-size="12" fill="#14532d" font-weight="bold">Ottoman</text>
      <text x="78" y="80" text-anchor="middle" font-size="10">Sunni</text>
      <text x="78" y="100" text-anchor="middle" font-size="10">Constantinople</text>
      <text x="78" y="120" text-anchor="middle" font-size="10">(Istanbul) 1453</text>
      <text x="78" y="145" text-anchor="middle" font-size="10">Suleiman peak</text>
      <text x="78" y="162" text-anchor="middle" font-size="10">1520-66</text>

      <rect x="145" y="40" width="115" height="130" fill="#fed7aa" stroke="#c2410c"/>
      <text x="203" y="60" text-anchor="middle" font-size="12" fill="#7c2d12" font-weight="bold">Safavid</text>
      <text x="203" y="80" text-anchor="middle" font-size="10">Shia</text>
      <text x="203" y="100" text-anchor="middle" font-size="10">Persia / Iran</text>
      <text x="203" y="120" text-anchor="middle" font-size="10">Isfahan</text>
      <text x="203" y="145" text-anchor="middle" font-size="10">1501-1736</text>

      <rect x="270" y="40" width="115" height="130" fill="#dbeafe" stroke="#1e40af"/>
      <text x="328" y="60" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Mughal</text>
      <text x="328" y="80" text-anchor="middle" font-size="10">Sunni</text>
      <text x="328" y="100" text-anchor="middle" font-size="10">India</text>
      <text x="328" y="120" text-anchor="middle" font-size="10">Taj Mahal</text>
      <text x="328" y="145" text-anchor="middle" font-size="10">Akbar (tolerant)</text>
      <text x="328" y="162" text-anchor="middle" font-size="10">1526-1857</text>
    </svg>`,
    caption: 'Three Islamic empires used gunpowder weapons and centralized bureaucracy to rule diverse populations.',
  },
  '4.2': {
    title: 'Global silver flows',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="120" r="22" fill="#fef3c7" stroke="#a16207"/>
      <text x="80" y="125" text-anchor="middle" font-size="11" fill="#713f12">Potosí</text>
      <text x="80" y="158" text-anchor="middle" font-size="9">Bolivia mine</text>
      <circle cx="200" cy="80" r="22" fill="#dbeafe" stroke="#1e40af"/>
      <text x="200" y="85" text-anchor="middle" font-size="11" fill="#1e3a8a">Europe</text>
      <circle cx="320" cy="120" r="22" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="320" y="125" text-anchor="middle" font-size="11" fill="#7c2d12">China</text>
      <text x="320" y="158" text-anchor="middle" font-size="9">silver-based economy</text>
      <line x1="102" y1="110" x2="178" y2="90" stroke="#475569" stroke-width="2" marker-end="url(#sf)"/>
      <text x="135" y="95" font-size="10" fill="#475569">silver</text>
      <line x1="222" y1="90" x2="298" y2="110" stroke="#475569" stroke-width="2" marker-end="url(#sf)"/>
      <text x="265" y="95" font-size="10" fill="#475569">silver →</text>
      <line x1="295" y1="135" x2="225" y2="120" stroke="#15803d" stroke-width="2" marker-end="url(#sf)"/>
      <text x="245" y="148" font-size="10" fill="#14532d">silk, porcelain, tea</text>
      <text x="200" y="190" text-anchor="middle" font-size="10" fill="#475569">~150,000 tons of American silver shipped 1500-1800; much ended up in China.</text>
      <defs><marker id="sf" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'American silver tied the world economy together for the first time.',
  },
  '5.4': {
    title: 'Atlantic Revolutions',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="180" x2="380" y2="180" stroke="#475569" stroke-width="2"/>
      <g font-size="10">
        <circle cx="70" cy="180" r="5" fill="#1e40af"/>
        <text x="70" y="160" text-anchor="middle" fill="#1e3a8a">1776</text>
        <text x="70" y="200" text-anchor="middle">American</text>
        <circle cx="140" cy="180" r="5" fill="#b91c1c"/>
        <text x="140" y="160" text-anchor="middle" fill="#7c2d12">1789</text>
        <text x="140" y="200" text-anchor="middle">French</text>
        <circle cx="200" cy="180" r="6" fill="#15803d"/>
        <text x="200" y="160" text-anchor="middle" fill="#14532d">1791-1804</text>
        <text x="200" y="200" text-anchor="middle">Haitian</text>
        <circle cx="280" cy="180" r="5" fill="#a21caf"/>
        <text x="280" y="160" text-anchor="middle" fill="#86198f">1810-25</text>
        <text x="280" y="200" text-anchor="middle">Latin Am.</text>
        <circle cx="350" cy="180" r="5" fill="#a16207"/>
        <text x="350" y="160" text-anchor="middle" fill="#713f12">1822</text>
        <text x="350" y="200" text-anchor="middle">Brazil</text>
      </g>
      <text x="200" y="40" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Atlantic Revolutions inspired one another</text>
      <text x="200" y="60" text-anchor="middle" font-size="10" fill="#475569">Common Enlightenment ideas: natural rights, consent of governed</text>
    </svg>`,
    caption: 'Five revolutions between 1776-1825 dismantled European colonial empires in the Americas — uniquely, Haiti also abolished slavery.',
  },
  '5.6': {
    title: 'Industrial revolution waves',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="160" x2="380" y2="160" stroke="#475569"/>
      <text x="200" y="180" text-anchor="middle" font-size="10" fill="#475569">1760     1810      1860       1910     1960</text>
      <path d="M40,160 L80,140 L130,110 L200,90 L270,75 L320,65 L380,55" stroke="#1e40af" stroke-width="3" fill="none"/>
      <circle cx="80" cy="140" r="4" fill="#1e40af"/>
      <text x="80" y="135" font-size="9" fill="#1e3a8a">textiles</text>
      <circle cx="130" cy="110" r="4" fill="#1e40af"/>
      <text x="130" y="105" font-size="9" fill="#1e3a8a">steam</text>
      <circle cx="200" cy="90" r="4" fill="#1e40af"/>
      <text x="200" y="85" font-size="9" fill="#1e3a8a">railroads</text>
      <circle cx="270" cy="75" r="4" fill="#1e40af"/>
      <text x="270" y="70" font-size="9" fill="#1e3a8a">electricity</text>
      <circle cx="320" cy="65" r="4" fill="#1e40af"/>
      <text x="320" y="60" font-size="9" fill="#1e3a8a">cars/oil</text>
      <text x="200" y="30" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Productivity over time</text>
    </svg>`,
    caption: 'Waves of innovation: textiles → steam → rail → electricity → cars/oil → digital.',
  },
  '6.2': {
    title: 'Scramble for Africa — colonial control',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="30" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">1870</text>
      <rect x="40" y="50" width="120" height="120" fill="#dcfce7" stroke="#15803d"/>
      <rect x="40" y="50" width="120" height="14" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="100" y="120" text-anchor="middle" font-size="11">~10% European</text>

      <text x="300" y="30" text-anchor="middle" font-size="12" fill="#7c2d12" font-weight="bold">1914</text>
      <rect x="240" y="50" width="120" height="120" fill="#fee2e2" stroke="#b91c1c"/>
      <rect x="240" y="155" width="120" height="15" fill="#dcfce7" stroke="#15803d"/>
      <text x="300" y="120" text-anchor="middle" font-size="11" fill="#7c2d12">~90% European</text>
      <text x="300" y="165" text-anchor="middle" font-size="9">Ethiopia · Liberia</text>
    </svg>`,
    caption: 'In just 44 years (1870-1914), European powers colonized almost all of Africa. Only Ethiopia and Liberia stayed independent.',
  },
  '7.1': {
    title: 'WWI alliances and casualties',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="30" width="160" height="80" fill="#dbeafe" stroke="#1e40af"/>
      <text x="110" y="50" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Allies</text>
      <text x="110" y="68" text-anchor="middle" font-size="10">France · Britain</text>
      <text x="110" y="83" text-anchor="middle" font-size="10">Russia · Italy</text>
      <text x="110" y="98" text-anchor="middle" font-size="10">US (1917) · Japan</text>

      <rect x="210" y="30" width="160" height="80" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="290" y="50" text-anchor="middle" font-size="12" fill="#7c2d12" font-weight="bold">Central Powers</text>
      <text x="290" y="68" text-anchor="middle" font-size="10">Germany · Austria-Hungary</text>
      <text x="290" y="83" text-anchor="middle" font-size="10">Ottoman · Bulgaria</text>

      <text x="200" y="140" text-anchor="middle" font-size="12" fill="#7c2d12" font-weight="bold">~17M dead · ~21M wounded</text>
      <text x="200" y="160" text-anchor="middle" font-size="10" fill="#475569">+ ~50M from 1918-19 flu pandemic</text>
      <text x="200" y="185" text-anchor="middle" font-size="10" fill="#475569">Treaty of Versailles set up WWII</text>
    </svg>`,
    caption: 'WWI killed scale of casualties new to industrial-age warfare. Versailles\' harshness contributed to WWII.',
  },
  '7.3': {
    title: 'WWII deaths by country',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#7c2d12" font-weight="bold">WWII deaths ~60-80M total</text>
      <g font-size="11">
        <rect x="40" y="40" width="270" height="20" fill="#b91c1c"/>
        <text x="320" y="55" fill="#7c2d12">USSR ~26M</text>
        <rect x="40" y="70" width="180" height="20" fill="#c2410c"/>
        <text x="230" y="85" fill="#7c2d12">China ~15-20M</text>
        <rect x="40" y="100" width="70" height="20" fill="#dc2626"/>
        <text x="120" y="115" fill="#7c2d12">Germany ~7M</text>
        <rect x="40" y="130" width="60" height="20" fill="#ea580c"/>
        <text x="110" y="145" fill="#7c2d12">Poland ~5-6M</text>
      </g>
      <text x="200" y="180" text-anchor="middle" font-size="10" fill="#475569">Including ~6M Jews + ~5M others murdered in Holocaust</text>
    </svg>`,
    caption: 'WWII\'s deaths fell disproportionately on USSR, China, Eastern Europe.',
  },
  '8.1': {
    title: 'Decolonization timeline',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="180" x2="380" y2="180" stroke="#475569"/>
      <text x="40" y="200" font-size="9" fill="#475569">1945</text>
      <text x="380" y="200" font-size="9" fill="#475569">1980</text>
      <g font-size="10">
        <circle cx="60" cy="180" r="4" fill="#1e40af"/>
        <text x="60" y="170" text-anchor="middle" fill="#1e3a8a">1947</text>
        <text x="60" y="155" text-anchor="middle">India/Pakistan</text>
        <circle cx="120" cy="180" r="4" fill="#1e40af"/>
        <text x="120" y="170" text-anchor="middle" fill="#1e3a8a">1954</text>
        <text x="120" y="155" text-anchor="middle">Vietnam (Fr.)</text>
        <circle cx="170" cy="180" r="5" fill="#b91c1c"/>
        <text x="170" y="170" text-anchor="middle" fill="#7c2d12" font-weight="bold">1960</text>
        <text x="170" y="155" text-anchor="middle">"Year of Africa"</text>
        <text x="170" y="142" text-anchor="middle" font-size="9">17 countries</text>
        <circle cx="230" cy="180" r="4" fill="#15803d"/>
        <text x="230" y="170" text-anchor="middle" fill="#14532d">1962</text>
        <text x="230" y="155" text-anchor="middle">Algeria</text>
        <circle cx="310" cy="180" r="4" fill="#1e40af"/>
        <text x="310" y="170" text-anchor="middle" fill="#1e3a8a">1975</text>
        <text x="310" y="155" text-anchor="middle">Angola/Moz</text>
        <circle cx="360" cy="180" r="4" fill="#1e40af"/>
        <text x="360" y="170" text-anchor="middle" fill="#1e3a8a">1980</text>
        <text x="360" y="155" text-anchor="middle">Zimbabwe</text>
      </g>
      <text x="200" y="40" text-anchor="middle" font-size="13" fill="#1e3a8a" font-weight="bold">Decolonization 1945-80</text>
      <text x="200" y="60" text-anchor="middle" font-size="11" fill="#475569">~100 new states emerged</text>
    </svg>`,
    caption: 'The end of European colonial empires created roughly 100 new independent states in 35 years.',
  },
  '9.1': {
    title: 'Global GDP shift toward Asia',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="30" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">1990</text>
      <rect x="40" y="50" width="120" height="120" fill="#dbeafe" stroke="#1e40af"/>
      <rect x="40" y="50" width="120" height="80" fill="#fef3c7" stroke="#a16207"/>
      <text x="100" y="95" text-anchor="middle" font-size="10">West dominant</text>
      <text x="100" y="155" text-anchor="middle" font-size="10">Asia</text>

      <text x="300" y="30" text-anchor="middle" font-size="12" fill="#7c2d12" font-weight="bold">2025</text>
      <rect x="240" y="50" width="120" height="120" fill="#dbeafe" stroke="#1e40af"/>
      <rect x="240" y="50" width="120" height="50" fill="#fef3c7" stroke="#a16207"/>
      <text x="300" y="80" text-anchor="middle" font-size="10">West</text>
      <text x="300" y="135" text-anchor="middle" font-size="10">Asia (China+India</text>
      <text x="300" y="150" text-anchor="middle" font-size="10">leading)</text>
    </svg>`,
    caption: 'Global economic center of gravity shifted east. China surpassed Japan (2010); India growing rapidly.',
  },
};
