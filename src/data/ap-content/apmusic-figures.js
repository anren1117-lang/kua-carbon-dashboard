// AP Music Theory — inline SVG diagrams.

export const APMUSIC_FIGURES = {
  '1.1': {
    title: 'Treble and bass clef',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#475569" stroke-width="1.2" fill="none">
        <line x1="60" y1="40" x2="360" y2="40"/>
        <line x1="60" y1="55" x2="360" y2="55"/>
        <line x1="60" y1="70" x2="360" y2="70"/>
        <line x1="60" y1="85" x2="360" y2="85"/>
        <line x1="60" y1="100" x2="360" y2="100"/>
        <line x1="60" y1="140" x2="360" y2="140"/>
        <line x1="60" y1="155" x2="360" y2="155"/>
        <line x1="60" y1="170" x2="360" y2="170"/>
        <line x1="60" y1="185" x2="360" y2="185"/>
        <line x1="60" y1="200" x2="360" y2="200"/>
      </g>
      <text x="50" y="80" font-size="32" fill="#1e3a8a">𝄞</text>
      <text x="50" y="180" font-size="28" fill="#1e3a8a">𝄢</text>
      <text x="200" y="20" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="bold">Grand staff</text>
      <text x="380" y="60" font-size="9" fill="#475569">Treble lines: E G B D F</text>
      <text x="380" y="170" font-size="9" fill="#475569">Bass lines: G B D F A</text>
      <line x1="320" y1="118" x2="360" y2="118" stroke="#b91c1c" stroke-width="1.5"/>
      <text x="370" y="122" font-size="9" fill="#7c2d12">middle C</text>
    </svg>`,
    caption: 'Treble clef centers on G (line 2); bass clef on F (line 4). Middle C between.',
  },
  '1.2': {
    title: 'Circle of fifths',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="110" r="85" fill="none" stroke="#475569" stroke-width="2"/>
      <text x="200" y="25" text-anchor="middle" font-size="13" fill="#1e3a8a" font-weight="bold">C</text>
      <text x="200" y="40" text-anchor="middle" font-size="9" fill="#475569">0♯/♭</text>
      <text x="260" y="50" text-anchor="middle" font-size="12" fill="#1e3a8a">G</text>
      <text x="295" y="78" text-anchor="middle" font-size="12" fill="#1e3a8a">D</text>
      <text x="305" y="110" text-anchor="middle" font-size="12" fill="#1e3a8a">A</text>
      <text x="295" y="142" text-anchor="middle" font-size="12" fill="#1e3a8a">E</text>
      <text x="260" y="170" text-anchor="middle" font-size="12" fill="#1e3a8a">B/C♭</text>
      <text x="200" y="195" text-anchor="middle" font-size="11" fill="#1e3a8a">F♯/G♭</text>
      <text x="140" y="170" text-anchor="middle" font-size="12" fill="#1e3a8a">D♭/C♯</text>
      <text x="105" y="142" text-anchor="middle" font-size="12" fill="#1e3a8a">A♭</text>
      <text x="95" y="110" text-anchor="middle" font-size="12" fill="#1e3a8a">E♭</text>
      <text x="105" y="78" text-anchor="middle" font-size="12" fill="#1e3a8a">B♭</text>
      <text x="140" y="50" text-anchor="middle" font-size="12" fill="#1e3a8a">F</text>
      <text x="260" y="40" text-anchor="middle" font-size="9" fill="#15803d">1♯ →</text>
      <text x="140" y="40" text-anchor="middle" font-size="9" fill="#b91c1c">← 1♭</text>
    </svg>`,
    caption: 'Circle of fifths: clockwise adds sharps; counterclockwise adds flats. Distance = harmonic distance.',
  },
  '1.3': {
    title: 'Major scale W-W-H-W-W-W-H pattern',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <g font-size="12" font-family="monospace">
        <rect x="20" y="80" width="45" height="40" fill="#fef3c7" stroke="#a16207"/>
        <text x="42" y="105" text-anchor="middle">C</text>
        <text x="55" y="138" text-anchor="middle" fill="#15803d">W</text>
        <rect x="68" y="80" width="45" height="40" fill="#fef3c7" stroke="#a16207"/>
        <text x="90" y="105" text-anchor="middle">D</text>
        <text x="105" y="138" text-anchor="middle" fill="#15803d">W</text>
        <rect x="116" y="80" width="45" height="40" fill="#fef3c7" stroke="#a16207"/>
        <text x="138" y="105" text-anchor="middle">E</text>
        <text x="155" y="138" text-anchor="middle" fill="#b91c1c">H</text>
        <rect x="164" y="80" width="45" height="40" fill="#fef3c7" stroke="#a16207"/>
        <text x="186" y="105" text-anchor="middle">F</text>
        <text x="200" y="138" text-anchor="middle" fill="#15803d">W</text>
        <rect x="212" y="80" width="45" height="40" fill="#fef3c7" stroke="#a16207"/>
        <text x="234" y="105" text-anchor="middle">G</text>
        <text x="250" y="138" text-anchor="middle" fill="#15803d">W</text>
        <rect x="260" y="80" width="45" height="40" fill="#fef3c7" stroke="#a16207"/>
        <text x="282" y="105" text-anchor="middle">A</text>
        <text x="295" y="138" text-anchor="middle" fill="#15803d">W</text>
        <rect x="308" y="80" width="45" height="40" fill="#fef3c7" stroke="#a16207"/>
        <text x="330" y="105" text-anchor="middle">B</text>
        <text x="345" y="138" text-anchor="middle" fill="#b91c1c">H</text>
        <rect x="355" y="80" width="35" height="40" fill="#fee2e2" stroke="#b91c1c"/>
        <text x="372" y="105" text-anchor="middle">C</text>
      </g>
      <text x="200" y="40" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">C major scale: W W H W W W H</text>
      <text x="200" y="180" text-anchor="middle" font-size="10" fill="#475569">Half steps fall between E-F and B-C</text>
    </svg>`,
    caption: 'The major scale pattern: two whole steps, half, three whole, half. C major uses all white keys.',
  },
  '2.2': {
    title: 'Simple vs compound meter',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">How each beat subdivides</text>
      <rect x="40" y="40" width="160" height="130" fill="#dbeafe" stroke="#1e40af"/>
      <text x="120" y="60" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Simple (4/4, 3/4)</text>
      <text x="120" y="90" text-anchor="middle" font-size="13" font-family="serif">♩ = ♪ ♪</text>
      <text x="120" y="110" text-anchor="middle" font-size="11">Beat splits into 2</text>
      <text x="120" y="140" text-anchor="middle" font-size="10" fill="#475569">"1-and-2-and"</text>

      <rect x="210" y="40" width="160" height="130" fill="#dcfce7" stroke="#15803d"/>
      <text x="290" y="60" text-anchor="middle" font-size="12" fill="#14532d" font-weight="bold">Compound (6/8, 9/8)</text>
      <text x="290" y="90" text-anchor="middle" font-size="13" font-family="serif">♩. = ♪ ♪ ♪</text>
      <text x="290" y="110" text-anchor="middle" font-size="11">Beat splits into 3</text>
      <text x="290" y="140" text-anchor="middle" font-size="10" fill="#475569">"1-and-a-2-and-a"</text>
    </svg>`,
    caption: 'In simple meter, each beat divides by 2. In compound meter (6/8 etc.), each beat divides by 3.',
  },
  '3.1': {
    title: 'Triad qualities',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Four triad qualities (built on C)</text>
      <g font-size="11" font-family="monospace">
        <text x="60" y="60" text-anchor="middle" fill="#1e3a8a" font-weight="bold">Major</text>
        <text x="60" y="85">C-E-G</text>
        <text x="60" y="105" font-size="9" fill="#475569">M3 + m3</text>
        <text x="60" y="125" font-size="10">bright</text>

        <text x="160" y="60" text-anchor="middle" fill="#14532d" font-weight="bold">Minor</text>
        <text x="160" y="85">C-Eb-G</text>
        <text x="160" y="105" font-size="9" fill="#475569">m3 + M3</text>
        <text x="160" y="125" font-size="10">dark</text>

        <text x="260" y="60" text-anchor="middle" fill="#7c2d12" font-weight="bold">Diminished</text>
        <text x="260" y="85">C-Eb-Gb</text>
        <text x="260" y="105" font-size="9" fill="#475569">m3 + m3</text>
        <text x="260" y="125" font-size="10">tense</text>

        <text x="360" y="60" text-anchor="middle" fill="#86198f" font-weight="bold">Augmented</text>
        <text x="360" y="85">C-E-G#</text>
        <text x="360" y="105" font-size="9" fill="#475569">M3 + M3</text>
        <text x="360" y="125" font-size="10">unstable</text>
      </g>
      <text x="200" y="170" text-anchor="middle" font-size="10" fill="#475569">Each triad stacked from two 3rds — major or minor.</text>
    </svg>`,
    caption: 'Four triad qualities differ by which 3rds are stacked.',
  },
  '3.4': {
    title: 'Cadence types',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Cadences = harmonic punctuation</text>
      <g font-size="11">
        <rect x="20" y="40" width="170" height="35" fill="#dbeafe" stroke="#1e40af"/>
        <text x="105" y="62" text-anchor="middle">PAC: V → I (full stop)</text>
        <rect x="210" y="40" width="170" height="35" fill="#dbeafe" stroke="#1e40af"/>
        <text x="295" y="62" text-anchor="middle">IAC: V → I (weaker)</text>
        <rect x="20" y="80" width="170" height="35" fill="#dcfce7" stroke="#15803d"/>
        <text x="105" y="102" text-anchor="middle">HC: ends on V (comma)</text>
        <rect x="210" y="80" width="170" height="35" fill="#dcfce7" stroke="#15803d"/>
        <text x="295" y="102" text-anchor="middle">Plagal: IV → I ("amen")</text>
        <rect x="20" y="120" width="170" height="35" fill="#fef3c7" stroke="#a16207"/>
        <text x="105" y="142" text-anchor="middle">Deceptive: V → vi (twist)</text>
        <rect x="210" y="120" width="170" height="35" fill="#fef3c7" stroke="#a16207"/>
        <text x="295" y="142" text-anchor="middle">Phrygian: iv6 → V</text>
      </g>
      <text x="200" y="185" text-anchor="middle" font-size="10" fill="#475569">Cadences shape phrasing.</text>
    </svg>`,
    caption: 'Cadences are harmonic resting points. Like sentence punctuation.',
  },
  '7.2': {
    title: 'Sonata form',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Sonata form (Classical)</text>
      <g font-size="11">
        <rect x="20" y="50" width="120" height="90" fill="#dbeafe" stroke="#1e40af"/>
        <text x="80" y="70" text-anchor="middle" fill="#1e3a8a" font-weight="bold">Exposition</text>
        <text x="80" y="90" text-anchor="middle" font-size="10">P (tonic)</text>
        <text x="80" y="105" text-anchor="middle" font-size="10">→ TR</text>
        <text x="80" y="120" text-anchor="middle" font-size="10">→ S (dom)</text>

        <rect x="140" y="50" width="120" height="90" fill="#fef3c7" stroke="#a16207"/>
        <text x="200" y="70" text-anchor="middle" fill="#713f12" font-weight="bold">Development</text>
        <text x="200" y="95" text-anchor="middle" font-size="10">Themes</text>
        <text x="200" y="110" text-anchor="middle" font-size="10">modulate,</text>
        <text x="200" y="125" text-anchor="middle" font-size="10">tension builds</text>

        <rect x="260" y="50" width="120" height="90" fill="#dcfce7" stroke="#15803d"/>
        <text x="320" y="70" text-anchor="middle" fill="#14532d" font-weight="bold">Recapitulation</text>
        <text x="320" y="90" text-anchor="middle" font-size="10">P (tonic)</text>
        <text x="320" y="105" text-anchor="middle" font-size="10">S (tonic)</text>
        <text x="320" y="120" text-anchor="middle" font-size="10">resolves</text>
      </g>
      <text x="200" y="175" text-anchor="middle" font-size="10" fill="#475569">Key conflict (P in tonic, S in dominant) resolves when both return in tonic.</text>
    </svg>`,
    caption: 'Sonata form: most important Classical form. Exposition, development, recapitulation.',
  },
};
