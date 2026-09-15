// AP English Language — inline SVG diagrams.

export const APENGLANG_FIGURES = {
  '1.1': {
    title: 'Rhetorical situation',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="110" r="50" fill="#fef3c7" stroke="#a16207" stroke-width="2"/>
      <text x="200" y="105" text-anchor="middle" font-size="12" fill="#713f12" font-weight="bold">SUBJECT</text>
      <text x="200" y="122" text-anchor="middle" font-size="10" fill="#713f12">/ message</text>
      <g font-size="11">
        <rect x="20" y="40" width="100" height="35" rx="6" fill="#dbeafe" stroke="#1e40af"/>
        <text x="70" y="62" text-anchor="middle" fill="#1e3a8a">Speaker</text>
        <rect x="280" y="40" width="100" height="35" rx="6" fill="#dcfce7" stroke="#15803d"/>
        <text x="330" y="62" text-anchor="middle" fill="#14532d">Audience</text>
        <rect x="20" y="160" width="100" height="35" rx="6" fill="#fee2e2" stroke="#b91c1c"/>
        <text x="70" y="182" text-anchor="middle" fill="#7c2d12">Context</text>
        <rect x="280" y="160" width="100" height="35" rx="6" fill="#fce7f3" stroke="#a21caf"/>
        <text x="330" y="182" text-anchor="middle" fill="#86198f">Purpose</text>
      </g>
      <line x1="120" y1="60" x2="155" y2="90" stroke="#475569"/>
      <line x1="280" y1="60" x2="245" y2="90" stroke="#475569"/>
      <line x1="120" y1="170" x2="155" y2="135" stroke="#475569"/>
      <line x1="280" y1="170" x2="245" y2="135" stroke="#475569"/>
    </svg>`,
    caption: 'No text exists in a vacuum. Speaker, audience, context, and purpose all shape meaning.',
  },
  '1.2': {
    title: 'Ethos, pathos, logos',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="200,30 60,170 340,170" fill="none" stroke="#475569" stroke-width="2"/>
      <text x="200" y="20" text-anchor="middle" font-size="13" fill="#1e3a8a" font-weight="bold">Persuasion</text>
      <circle cx="200" cy="40" r="14" fill="#dbeafe" stroke="#1e40af"/>
      <text x="200" y="45" text-anchor="middle" font-size="11" fill="#1e3a8a">ETHOS</text>
      <text x="200" y="68" text-anchor="middle" font-size="9" fill="#475569">credibility</text>
      <circle cx="70" cy="170" r="14" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="70" y="174" text-anchor="middle" font-size="11" fill="#7c2d12">PATHOS</text>
      <text x="70" y="196" text-anchor="middle" font-size="9" fill="#475569">emotion</text>
      <circle cx="330" cy="170" r="14" fill="#dcfce7" stroke="#15803d"/>
      <text x="330" y="174" text-anchor="middle" font-size="11" fill="#14532d">LOGOS</text>
      <text x="330" y="196" text-anchor="middle" font-size="9" fill="#475569">logic</text>
    </svg>`,
    caption: 'Aristotle\'s three appeals. Most effective rhetoric combines all three.',
  },
  '1.3': {
    title: 'Toulmin argument model',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="40" width="120" height="40" fill="#dcfce7" stroke="#15803d"/>
      <text x="110" y="55" text-anchor="middle" font-size="11" fill="#14532d" font-weight="bold">Evidence</text>
      <text x="110" y="70" text-anchor="middle" font-size="10">(data)</text>
      <rect x="230" y="40" width="120" height="40" fill="#dbeafe" stroke="#1e40af"/>
      <text x="290" y="55" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="bold">Claim</text>
      <text x="290" y="70" text-anchor="middle" font-size="10">(thesis)</text>
      <path d="M170,60 L226,60" stroke="#475569" stroke-width="2" marker-end="url(#tl)"/>
      <text x="198" y="50" text-anchor="middle" font-size="10" fill="#475569">therefore</text>
      <rect x="140" y="120" width="120" height="40" fill="#fef3c7" stroke="#a16207"/>
      <text x="200" y="135" text-anchor="middle" font-size="11" fill="#713f12" font-weight="bold">Warrant</text>
      <text x="200" y="150" text-anchor="middle" font-size="10">(reasoning)</text>
      <line x1="200" y1="80" x2="200" y2="120" stroke="#475569" stroke-dasharray="3 3"/>
      <text x="200" y="180" text-anchor="middle" font-size="10" fill="#475569">links evidence to claim</text>
      <defs><marker id="tl" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'Toulmin model: every argument has data, a claim, and an underlying warrant linking them.',
  },
  '2.1': {
    title: 'Common fallacies map',
    svg: `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <g font-size="10">
        <rect x="20" y="20" width="80" height="38" fill="#fecaca" stroke="#b91c1c"/>
        <text x="60" y="35" text-anchor="middle" fill="#7c2d12">Ad hominem</text>
        <text x="60" y="50" text-anchor="middle" font-size="8">attack person</text>
        <rect x="110" y="20" width="80" height="38" fill="#fecaca" stroke="#b91c1c"/>
        <text x="150" y="35" text-anchor="middle" fill="#7c2d12">Strawman</text>
        <text x="150" y="50" text-anchor="middle" font-size="8">distort view</text>
        <rect x="200" y="20" width="80" height="38" fill="#fecaca" stroke="#b91c1c"/>
        <text x="240" y="35" text-anchor="middle" fill="#7c2d12">Slippery slope</text>
        <text x="240" y="50" text-anchor="middle" font-size="8">unsupported chain</text>
        <rect x="290" y="20" width="80" height="38" fill="#fecaca" stroke="#b91c1c"/>
        <text x="330" y="35" text-anchor="middle" fill="#7c2d12">False dilemma</text>
        <text x="330" y="50" text-anchor="middle" font-size="8">only 2 options</text>
        <rect x="20" y="70" width="80" height="38" fill="#fecaca" stroke="#b91c1c"/>
        <text x="60" y="85" text-anchor="middle" fill="#7c2d12">Bandwagon</text>
        <text x="60" y="100" text-anchor="middle" font-size="8">popularity</text>
        <rect x="110" y="70" width="80" height="38" fill="#fecaca" stroke="#b91c1c"/>
        <text x="150" y="85" text-anchor="middle" fill="#7c2d12">Post hoc</text>
        <text x="150" y="100" text-anchor="middle" font-size="8">correlation = cause</text>
        <rect x="200" y="70" width="80" height="38" fill="#fecaca" stroke="#b91c1c"/>
        <text x="240" y="85" text-anchor="middle" fill="#7c2d12">Hasty gen</text>
        <text x="240" y="100" text-anchor="middle" font-size="8">small sample</text>
        <rect x="290" y="70" width="80" height="38" fill="#fecaca" stroke="#b91c1c"/>
        <text x="330" y="85" text-anchor="middle" fill="#7c2d12">Red herring</text>
        <text x="330" y="100" text-anchor="middle" font-size="8">distract</text>
        <rect x="20" y="120" width="80" height="38" fill="#fecaca" stroke="#b91c1c"/>
        <text x="60" y="135" text-anchor="middle" fill="#7c2d12">Circular</text>
        <text x="60" y="150" text-anchor="middle" font-size="8">begs question</text>
        <rect x="110" y="120" width="80" height="38" fill="#fecaca" stroke="#b91c1c"/>
        <text x="150" y="135" text-anchor="middle" fill="#7c2d12">False analogy</text>
        <text x="150" y="150" text-anchor="middle" font-size="8">misleading</text>
        <rect x="200" y="120" width="80" height="38" fill="#fecaca" stroke="#b91c1c"/>
        <text x="240" y="135" text-anchor="middle" fill="#7c2d12">Tu quoque</text>
        <text x="240" y="150" text-anchor="middle" font-size="8">you too!</text>
        <rect x="290" y="120" width="80" height="38" fill="#fecaca" stroke="#b91c1c"/>
        <text x="330" y="135" text-anchor="middle" fill="#7c2d12">Appeal authority</text>
        <text x="330" y="150" text-anchor="middle" font-size="8">outside expertise</text>
      </g>
      <text x="200" y="200" text-anchor="middle" font-size="12" fill="#7c2d12" font-weight="bold">Spotting fallacies = critical reading + honest writing</text>
    </svg>`,
    caption: 'Common logical fallacies — patterns that look like reasoning but aren\'t.',
  },
  '3.2': {
    title: 'Cognitive biases',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="13" fill="#1e3a8a" font-weight="bold">Cognitive biases that distort judgment</text>
      <g font-size="10">
        <rect x="20" y="40" width="170" height="30" fill="#fef3c7" stroke="#a16207"/>
        <text x="105" y="60" text-anchor="middle" fill="#713f12">Confirmation: see what we expect</text>
        <rect x="210" y="40" width="170" height="30" fill="#fef3c7" stroke="#a16207"/>
        <text x="295" y="60" text-anchor="middle" fill="#713f12">Availability: what comes to mind</text>
        <rect x="20" y="80" width="170" height="30" fill="#fef3c7" stroke="#a16207"/>
        <text x="105" y="100" text-anchor="middle" fill="#713f12">Survivorship: see only winners</text>
        <rect x="210" y="80" width="170" height="30" fill="#fef3c7" stroke="#a16207"/>
        <text x="295" y="100" text-anchor="middle" fill="#713f12">Anchoring: first number sticks</text>
        <rect x="20" y="120" width="170" height="30" fill="#fef3c7" stroke="#a16207"/>
        <text x="105" y="140" text-anchor="middle" fill="#713f12">Framing: presentation changes view</text>
        <rect x="210" y="120" width="170" height="30" fill="#fef3c7" stroke="#a16207"/>
        <text x="295" y="140" text-anchor="middle" fill="#713f12">Hindsight: "I knew it all along"</text>
      </g>
      <text x="200" y="180" text-anchor="middle" font-size="11" fill="#475569">Can\'t eliminate — but awareness + structural counters help</text>
    </svg>`,
    caption: 'Cognitive biases are universal. Awareness is the first defense.',
  },
  '4.1': {
    title: 'Argument architecture',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <g font-size="11">
        <rect x="40" y="20" width="320" height="30" fill="#dbeafe" stroke="#1e40af"/>
        <text x="200" y="40" text-anchor="middle" fill="#1e3a8a" font-weight="bold">Introduction: hook + context + thesis</text>
        <rect x="40" y="60" width="320" height="30" fill="#dcfce7" stroke="#15803d"/>
        <text x="200" y="80" text-anchor="middle" fill="#14532d">Body ¶1: claim + evidence + reasoning</text>
        <rect x="40" y="100" width="320" height="30" fill="#dcfce7" stroke="#15803d"/>
        <text x="200" y="120" text-anchor="middle" fill="#14532d">Body ¶2: claim + evidence + reasoning</text>
        <rect x="40" y="140" width="320" height="30" fill="#fef3c7" stroke="#a16207"/>
        <text x="200" y="160" text-anchor="middle" fill="#713f12">Counterargument + refutation</text>
        <rect x="40" y="180" width="320" height="30" fill="#fce7f3" stroke="#a21caf"/>
        <text x="200" y="200" text-anchor="middle" fill="#86198f">Conclusion: synthesize + implications</text>
      </g>
    </svg>`,
    caption: 'A typical argument essay structure. Adapt to purpose.',
  },
  '7.2': {
    title: 'Counterargument moves',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Four ways to engage counterarguments</text>
      <g font-size="11">
        <rect x="30" y="40" width="160" height="50" fill="#dbeafe" stroke="#1e40af"/>
        <text x="110" y="60" text-anchor="middle" fill="#1e3a8a" font-weight="bold">REFUTE</text>
        <text x="110" y="78" text-anchor="middle" font-size="10">show counter wrong</text>
        <rect x="210" y="40" width="160" height="50" fill="#dcfce7" stroke="#15803d"/>
        <text x="290" y="60" text-anchor="middle" fill="#14532d" font-weight="bold">CONCEDE</text>
        <text x="290" y="78" text-anchor="middle" font-size="10">grant partial validity</text>
        <rect x="30" y="100" width="160" height="50" fill="#fef3c7" stroke="#a16207"/>
        <text x="110" y="120" text-anchor="middle" fill="#713f12" font-weight="bold">REFRAME</text>
        <text x="110" y="138" text-anchor="middle" font-size="10">turn counter into support</text>
        <rect x="210" y="100" width="160" height="50" fill="#fce7f3" stroke="#a21caf"/>
        <text x="290" y="120" text-anchor="middle" fill="#86198f" font-weight="bold">QUALIFY</text>
        <text x="290" y="138" text-anchor="middle" font-size="10">narrow your claim</text>
      </g>
      <text x="200" y="180" text-anchor="middle" font-size="10" fill="#475569">Steelman counter before responding.</text>
    </svg>`,
    caption: 'Strong arguments engage opposing views — four move types.',
  },
};
