// AP English Literature — inline SVG diagrams.

export const APENGLIT_FIGURES = {
  '1.1': {
    title: 'Characterization: STEAL',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="13" fill="#1e3a8a" font-weight="bold">Indirect Characterization: STEAL</text>
      <g font-size="11">
        <rect x="20" y="40" width="170" height="32" fill="#dbeafe" stroke="#1e40af"/>
        <text x="105" y="60" text-anchor="middle">S — Speech (what they say)</text>
        <rect x="20" y="74" width="170" height="32" fill="#dbeafe" stroke="#1e40af"/>
        <text x="105" y="94" text-anchor="middle">T — Thoughts (inner life)</text>
        <rect x="20" y="108" width="170" height="32" fill="#dbeafe" stroke="#1e40af"/>
        <text x="105" y="128" text-anchor="middle">E — Effect on others</text>
        <rect x="20" y="142" width="170" height="32" fill="#dbeafe" stroke="#1e40af"/>
        <text x="105" y="162" text-anchor="middle">A — Actions</text>
        <rect x="20" y="176" width="170" height="32" fill="#dbeafe" stroke="#1e40af"/>
        <text x="105" y="196" text-anchor="middle">L — Looks (description)</text>
        <rect x="210" y="100" width="170" height="80" fill="#dcfce7" stroke="#15803d"/>
        <text x="295" y="130" text-anchor="middle" font-size="11" fill="#14532d" font-weight="bold">Reader infers</text>
        <text x="295" y="148" text-anchor="middle" font-size="11" fill="#14532d">CHARACTER</text>
        <text x="295" y="166" text-anchor="middle" font-size="10" fill="#475569">(values, fears, depth)</text>
      </g>
    </svg>`,
    caption: 'Authors usually SHOW character (STEAL), not just tell. You infer from clues.',
  },
  '1.3': {
    title: "Freytag's pyramid",
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M40,170 L130,80 L200,40 L270,80 L360,170" stroke="#1e40af" stroke-width="2.5" fill="none"/>
      <g font-size="10">
        <text x="40" y="190" text-anchor="middle" fill="#1e3a8a">Exposition</text>
        <text x="130" y="100" text-anchor="middle" fill="#1e3a8a">Rising</text>
        <text x="200" y="30" text-anchor="middle" fill="#b91c1c" font-weight="bold">Climax</text>
        <text x="270" y="100" text-anchor="middle" fill="#1e3a8a">Falling</text>
        <text x="360" y="190" text-anchor="middle" fill="#1e3a8a">Resolution</text>
      </g>
      <circle cx="200" cy="40" r="6" fill="#b91c1c"/>
      <text x="200" y="170" text-anchor="middle" font-size="10" fill="#475569">Classical plot structure — modern fiction often departs.</text>
    </svg>`,
    caption: 'Classical structure: rising tension to climax, then falling action to resolution.',
  },
  '2.3': {
    title: 'Meter — iambic pentameter',
    svg: `<svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="11" font-family="serif" font-style="italic">"Shall I compare thee to a summer\'s day?"</text>
      <g font-size="13" font-family="monospace">
        <text x="60" y="60" text-anchor="middle" fill="#94a3b8">˘</text>
        <text x="60" y="80" text-anchor="middle">Shall</text>
        <text x="105" y="60" text-anchor="middle" fill="#b91c1c">/</text>
        <text x="105" y="80" text-anchor="middle">I</text>

        <text x="150" y="60" text-anchor="middle" fill="#94a3b8">˘</text>
        <text x="150" y="80" text-anchor="middle">com</text>
        <text x="195" y="60" text-anchor="middle" fill="#b91c1c">/</text>
        <text x="195" y="80" text-anchor="middle">pare</text>

        <text x="240" y="60" text-anchor="middle" fill="#94a3b8">˘</text>
        <text x="240" y="80" text-anchor="middle">thee</text>
        <text x="285" y="60" text-anchor="middle" fill="#b91c1c">/</text>
        <text x="285" y="80" text-anchor="middle">to</text>

        <text x="335" y="60" text-anchor="middle" fill="#94a3b8">˘</text>
        <text x="335" y="80" text-anchor="middle">a</text>
      </g>
      <text x="200" y="120" text-anchor="middle" font-size="11" fill="#475569">5 pairs of (unstressed, stressed) = iambic pentameter</text>
      <text x="200" y="145" text-anchor="middle" font-size="11" fill="#475569">Most common meter in English; Shakespeare\'s line.</text>
    </svg>`,
    caption: 'Iamb = unstressed + stressed; pentameter = 5 feet per line.',
  },
  '2.4': {
    title: 'Sonnet structures',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Shakespearean</text>
      <g font-size="10" font-family="monospace">
        <text x="100" y="45">a b a b</text>
        <text x="100" y="65">c d c d</text>
        <text x="100" y="85">e f e f</text>
        <text x="100" y="105" fill="#b91c1c" font-weight="bold">g g</text>
      </g>
      <text x="100" y="135" text-anchor="middle" font-size="10" fill="#475569">3 quatrains + couplet</text>
      <text x="100" y="150" text-anchor="middle" font-size="10" fill="#475569">final turn in couplet</text>

      <text x="300" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Petrarchan</text>
      <g font-size="10" font-family="monospace">
        <text x="300" y="45">a b b a</text>
        <text x="300" y="65">a b b a</text>
        <text x="300" y="85">─ volta ─</text>
        <text x="300" y="105">c d e c d e</text>
      </g>
      <text x="300" y="135" text-anchor="middle" font-size="10" fill="#475569">octave + sestet</text>
      <text x="300" y="150" text-anchor="middle" font-size="10" fill="#475569">volta between</text>

      <text x="200" y="195" text-anchor="middle" font-size="11" fill="#475569">14 lines, iambic pentameter</text>
    </svg>`,
    caption: 'Two main sonnet forms. The volta (turn) often signals a shift in argument or feeling.',
  },
  '3.2': {
    title: 'Theme — argument, not topic',
    svg: `<svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="40" width="160" height="100" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="110" y="60" text-anchor="middle" font-size="11" fill="#7c2d12" font-weight="bold">TOPIC (too vague)</text>
      <text x="110" y="85" text-anchor="middle" font-size="11">"love"</text>
      <text x="110" y="105" text-anchor="middle" font-size="11">"war"</text>
      <text x="110" y="125" text-anchor="middle" font-size="11">"identity"</text>

      <rect x="210" y="40" width="160" height="100" fill="#dcfce7" stroke="#15803d"/>
      <text x="290" y="60" text-anchor="middle" font-size="11" fill="#14532d" font-weight="bold">THEME (argument)</text>
      <text x="290" y="78" text-anchor="middle" font-size="10">"love demands</text>
      <text x="290" y="93" text-anchor="middle" font-size="10">sacrifice"</text>
      <text x="290" y="115" text-anchor="middle" font-size="10">"war strips</text>
      <text x="290" y="130" text-anchor="middle" font-size="10">humanity"</text>
      <path d="M190,90 L210,90" stroke="#475569" stroke-width="2" marker-end="url(#th)"/>
      <defs><marker id="th" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
      <text x="200" y="165" text-anchor="middle" font-size="11" fill="#475569">A theme makes a claim about the topic.</text>
    </svg>`,
    caption: 'Themes are full sentences arguing something about a topic.',
  },
};
