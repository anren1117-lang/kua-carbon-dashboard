// AP Spanish — inline SVG diagrams.

export const APSPANISH_FIGURES = {
  '1.2': {
    title: 'Spanish-speaking countries',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">21 countries with Spanish as official language</text>
      <g font-size="10">
        <rect x="30" y="40" width="110" height="140" fill="#fed7aa" stroke="#c2410c"/>
        <text x="85" y="60" text-anchor="middle" fill="#7c2d12" font-weight="bold">Europa</text>
        <text x="85" y="85" text-anchor="middle">España</text>

        <rect x="150" y="40" width="110" height="140" fill="#fef3c7" stroke="#a16207"/>
        <text x="205" y="60" text-anchor="middle" fill="#713f12" font-weight="bold">Norteamérica</text>
        <text x="205" y="85" text-anchor="middle">México</text>
        <text x="205" y="100" text-anchor="middle">EE.UU.</text>
        <text x="205" y="120" text-anchor="middle" font-size="9">(~14% pop.)</text>

        <rect x="270" y="40" width="110" height="140" fill="#dcfce7" stroke="#15803d"/>
        <text x="325" y="60" text-anchor="middle" fill="#14532d" font-weight="bold">Resto</text>
        <text x="325" y="80" text-anchor="middle" font-size="9">Sudamérica:</text>
        <text x="325" y="93" text-anchor="middle" font-size="9">Argentina, Colombia,</text>
        <text x="325" y="106" text-anchor="middle" font-size="9">Perú, Venezuela...</text>
        <text x="325" y="125" text-anchor="middle" font-size="9">Caribe:</text>
        <text x="325" y="138" text-anchor="middle" font-size="9">Cuba, Rep. Dom.,</text>
        <text x="325" y="151" text-anchor="middle" font-size="9">Puerto Rico</text>
        <text x="325" y="170" text-anchor="middle" font-size="9">Centroamérica:</text>
      </g>
      <text x="200" y="200" text-anchor="middle" font-size="10" fill="#475569">~500M speakers globally</text>
    </svg>`,
    caption: 'Spanish is official in 21 countries; spoken by ~500M people worldwide.',
  },
  '2.2': {
    title: 'Music genres by country',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <g font-size="10">
        <rect x="20" y="30" width="110" height="28" fill="#fef3c7" stroke="#a16207"/>
        <text x="75" y="49" text-anchor="middle" fill="#713f12">Salsa: Cuba/PR</text>
        <rect x="140" y="30" width="110" height="28" fill="#fef3c7" stroke="#a16207"/>
        <text x="195" y="49" text-anchor="middle" fill="#713f12">Tango: Argentina</text>
        <rect x="260" y="30" width="110" height="28" fill="#fef3c7" stroke="#a16207"/>
        <text x="315" y="49" text-anchor="middle" fill="#713f12">Flamenco: España</text>
        <rect x="20" y="65" width="110" height="28" fill="#fef3c7" stroke="#a16207"/>
        <text x="75" y="84" text-anchor="middle" fill="#713f12">Mariachi: México</text>
        <rect x="140" y="65" width="110" height="28" fill="#fef3c7" stroke="#a16207"/>
        <text x="195" y="84" text-anchor="middle" fill="#713f12">Bachata: Rep. Dom.</text>
        <rect x="260" y="65" width="110" height="28" fill="#fef3c7" stroke="#a16207"/>
        <text x="315" y="84" text-anchor="middle" fill="#713f12">Cumbia: Colombia</text>
        <rect x="20" y="100" width="110" height="28" fill="#dbeafe" stroke="#1e40af"/>
        <text x="75" y="119" text-anchor="middle" fill="#1e3a8a">Reggaetón: PR</text>
        <rect x="140" y="100" width="110" height="28" fill="#dbeafe" stroke="#1e40af"/>
        <text x="195" y="119" text-anchor="middle" fill="#1e3a8a">Son: Cuba</text>
        <rect x="260" y="100" width="110" height="28" fill="#dbeafe" stroke="#1e40af"/>
        <text x="315" y="119" text-anchor="middle" fill="#1e3a8a">Vallenato: Colombia</text>
      </g>
      <text x="200" y="160" text-anchor="middle" font-size="11" fill="#475569">Hispanic music: vast diversity, deep cultural roots</text>
    </svg>`,
    caption: 'Major Hispanic music genres each tied to a country or region.',
  },
  '3.3': {
    title: 'Latin American Boom',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Latin American Boom (1960s-70s)</text>
      <g font-size="11">
        <rect x="30" y="40" width="160" height="50" fill="#dcfce7" stroke="#15803d"/>
        <text x="110" y="60" text-anchor="middle" fill="#14532d" font-weight="bold">García Márquez</text>
        <text x="110" y="78" text-anchor="middle" font-size="10">Colombia, Nobel 1982</text>
        <rect x="210" y="40" width="160" height="50" fill="#dcfce7" stroke="#15803d"/>
        <text x="290" y="60" text-anchor="middle" fill="#14532d" font-weight="bold">Vargas Llosa</text>
        <text x="290" y="78" text-anchor="middle" font-size="10">Perú, Nobel 2010</text>
        <rect x="30" y="100" width="160" height="50" fill="#dcfce7" stroke="#15803d"/>
        <text x="110" y="120" text-anchor="middle" fill="#14532d" font-weight="bold">Cortázar</text>
        <text x="110" y="138" text-anchor="middle" font-size="10">Argentina, Rayuela</text>
        <rect x="210" y="100" width="160" height="50" fill="#dcfce7" stroke="#15803d"/>
        <text x="290" y="120" text-anchor="middle" fill="#14532d" font-weight="bold">Fuentes</text>
        <text x="290" y="138" text-anchor="middle" font-size="10">México, La muerte de A. Cruz</text>
      </g>
      <text x="200" y="180" text-anchor="middle" font-size="10" fill="#475569">Magical realism + experimental forms put LA literature on world stage.</text>
    </svg>`,
    caption: 'The Boom transformed Spanish-language literature\'s global standing.',
  },
  '5.1': {
    title: 'Major migration flows',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Migración hispanohablante actual</text>
      <g font-size="10">
        <rect x="30" y="50" width="120" height="40" fill="#fef3c7" stroke="#a16207"/>
        <text x="90" y="68" text-anchor="middle">México</text>
        <text x="90" y="83" text-anchor="middle" font-size="9">→ EE.UU.</text>
        <rect x="160" y="50" width="120" height="40" fill="#fef3c7" stroke="#a16207"/>
        <text x="220" y="68" text-anchor="middle">Centroamérica</text>
        <text x="220" y="83" text-anchor="middle" font-size="9">→ EE.UU.</text>
        <rect x="30" y="100" width="120" height="40" fill="#fee2e2" stroke="#b91c1c"/>
        <text x="90" y="118" text-anchor="middle" fill="#7c2d12">Venezuela</text>
        <text x="90" y="133" text-anchor="middle" font-size="9" fill="#7c2d12">→ ~8M dispersos</text>
        <rect x="160" y="100" width="120" height="40" fill="#fef3c7" stroke="#a16207"/>
        <text x="220" y="118" text-anchor="middle">Cuba</text>
        <text x="220" y="133" text-anchor="middle" font-size="9">→ EE.UU./España</text>
        <rect x="290" y="50" width="100" height="90" fill="#dcfce7" stroke="#15803d"/>
        <text x="340" y="80" text-anchor="middle" fill="#14532d" font-weight="bold">España</text>
        <text x="340" y="100" text-anchor="middle" font-size="9">recibe de:</text>
        <text x="340" y="113" text-anchor="middle" font-size="9">Latam</text>
        <text x="340" y="126" text-anchor="middle" font-size="9">África Norte</text>
      </g>
      <text x="200" y="180" text-anchor="middle" font-size="10" fill="#475569">Las migraciones modelan demografía y política del mundo hispano.</text>
    </svg>`,
    caption: 'Las principales corrientes migratorias afectan a casi todos los países hispanohablantes.',
  },
};
