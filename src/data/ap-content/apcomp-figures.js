// AP Comparative Government — inline SVG diagrams.

export const APCOMP_FIGURES = {
  '1.4': {
    title: 'Six course countries on a regime spectrum',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Regime types — AP Comp Gov 6 countries</text>
      <line x1="40" y1="120" x2="380" y2="120" stroke="#475569" stroke-width="2"/>
      <text x="40" y="105" font-size="11" fill="#15803d">Liberal democracy</text>
      <text x="380" y="105" text-anchor="end" font-size="11" fill="#b91c1c">Authoritarian</text>
      <circle cx="70" cy="120" r="6" fill="#dbeafe" stroke="#1e40af"/>
      <text x="70" y="145" text-anchor="middle" font-size="10">UK</text>
      <circle cx="130" cy="120" r="6" fill="#dcfce7" stroke="#15803d"/>
      <text x="130" y="145" text-anchor="middle" font-size="10">Mexico</text>
      <circle cx="190" cy="120" r="6" fill="#fef3c7" stroke="#a16207"/>
      <text x="190" y="145" text-anchor="middle" font-size="10">Nigeria</text>
      <circle cx="280" cy="120" r="6" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="280" y="145" text-anchor="middle" font-size="10">Russia</text>
      <circle cx="330" cy="120" r="6" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="330" y="145" text-anchor="middle" font-size="10">Iran</text>
      <circle cx="370" cy="120" r="7" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="370" y="145" text-anchor="middle" font-size="10">China</text>
      <text x="200" y="190" text-anchor="middle" font-size="10" fill="#475569">Spectrum: most are now mixed/hybrid in some way.</text>
    </svg>`,
    caption: 'AP comparative gov uses six countries spanning the spectrum from liberal democracy to one-party state.',
  },
  '2.1': {
    title: 'Executive types',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="40" width="110" height="150" fill="#dbeafe" stroke="#1e40af"/>
      <text x="85" y="60" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="bold">Parliamentary</text>
      <text x="85" y="80" text-anchor="middle" font-size="10">PM + monarch</text>
      <text x="85" y="100" text-anchor="middle" font-size="10">Confidence votes</text>
      <text x="85" y="120" text-anchor="middle" font-size="10">No fixed term</text>
      <text x="85" y="155" text-anchor="middle" font-size="10" fill="#475569">UK</text>

      <rect x="145" y="40" width="110" height="150" fill="#dcfce7" stroke="#15803d"/>
      <text x="200" y="60" text-anchor="middle" font-size="11" fill="#14532d" font-weight="bold">Presidential</text>
      <text x="200" y="80" text-anchor="middle" font-size="10">Direct election</text>
      <text x="200" y="100" text-anchor="middle" font-size="10">Fixed terms</text>
      <text x="200" y="120" text-anchor="middle" font-size="10">Separation of</text>
      <text x="200" y="133" text-anchor="middle" font-size="10">powers</text>
      <text x="200" y="155" text-anchor="middle" font-size="10" fill="#475569">Mexico, Nigeria</text>

      <rect x="260" y="40" width="110" height="150" fill="#fef3c7" stroke="#a16207"/>
      <text x="315" y="60" text-anchor="middle" font-size="11" fill="#713f12" font-weight="bold">Other</text>
      <text x="315" y="80" text-anchor="middle" font-size="10">Semi-presidential</text>
      <text x="315" y="93" text-anchor="middle" font-size="10">(Russia formally)</text>
      <text x="315" y="113" text-anchor="middle" font-size="10">Theocratic</text>
      <text x="315" y="126" text-anchor="middle" font-size="10">(Iran: Sup. Leader)</text>
      <text x="315" y="146" text-anchor="middle" font-size="10">Single-party</text>
      <text x="315" y="159" text-anchor="middle" font-size="10">(China: CCP)</text>
    </svg>`,
    caption: 'Different ways of organizing executive power across the six countries.',
  },
  '3.4': {
    title: "Duverger's Law: SMD vs PR",
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="40" width="160" height="130" fill="#dbeafe" stroke="#1e40af"/>
      <text x="110" y="60" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">SMD / FPTP</text>
      <text x="110" y="83" text-anchor="middle" font-size="10">Each district: 1 seat,</text>
      <text x="110" y="96" text-anchor="middle" font-size="10">winner-take-all</text>
      <text x="110" y="118" text-anchor="middle" font-size="10">⇒ 2-party system</text>
      <text x="110" y="135" text-anchor="middle" font-size="10">⇒ majority govts</text>
      <text x="110" y="158" text-anchor="middle" font-size="10" fill="#475569">UK, Nigeria, US</text>

      <rect x="210" y="40" width="160" height="130" fill="#dcfce7" stroke="#15803d"/>
      <text x="290" y="60" text-anchor="middle" font-size="12" fill="#14532d" font-weight="bold">Proportional</text>
      <text x="290" y="83" text-anchor="middle" font-size="10">Seats by vote share</text>
      <text x="290" y="105" text-anchor="middle" font-size="10">⇒ multi-party</text>
      <text x="290" y="122" text-anchor="middle" font-size="10">⇒ coalitions</text>
      <text x="290" y="158" text-anchor="middle" font-size="10" fill="#475569">Most Europe, Israel</text>
    </svg>`,
    caption: 'Electoral system shapes party system. Mexico, Germany use mixed systems.',
  },
  '5.1': {
    title: 'GDP per capita comparison',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="bold">GDP per capita (~2024, USD)</text>
      <g font-size="10" font-family="monospace">
        <rect x="40" y="40" width="320" height="18" fill="#dcfce7" stroke="#15803d"/>
        <text x="365" y="54">UK ~$50K</text>
        <rect x="40" y="62" width="85" height="18" fill="#fef3c7" stroke="#a16207"/>
        <text x="130" y="76">Russia ~$13K</text>
        <rect x="40" y="84" width="85" height="18" fill="#fef3c7" stroke="#a16207"/>
        <text x="130" y="98">Mexico ~$13K</text>
        <rect x="40" y="106" width="85" height="18" fill="#fef3c7" stroke="#a16207"/>
        <text x="130" y="120">China ~$13K</text>
        <rect x="40" y="128" width="35" height="18" fill="#fee2e2" stroke="#b91c1c"/>
        <text x="85" y="142">Iran ~$5.5K</text>
        <rect x="40" y="150" width="15" height="18" fill="#fee2e2" stroke="#b91c1c"/>
        <text x="70" y="164">Nigeria ~$2.3K</text>
      </g>
      <text x="200" y="190" text-anchor="middle" font-size="10" fill="#475569">Wide disparity across course countries.</text>
    </svg>`,
    caption: 'Massive GDP per capita gaps between the six. Resource curse affects 3 of 6.',
  },
};
