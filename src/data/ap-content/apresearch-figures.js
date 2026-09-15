// AP Research — inline SVG figures.

export const APRESEARCH_FIGURES = {
  '3.1': {
    title: 'Matching method to question',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Research question type → method</text>
      <g font-size="10">
        <rect x="30" y="40" width="160" height="25" fill="#dbeafe" stroke="#1e40af"/>
        <text x="110" y="58" text-anchor="middle">Does X cause Y?</text>
        <text x="210" y="58" font-size="10">→ experiment</text>

        <rect x="30" y="70" width="160" height="25" fill="#dcfce7" stroke="#15803d"/>
        <text x="110" y="88" text-anchor="middle">How prevalent is X?</text>
        <text x="210" y="88" font-size="10">→ survey</text>

        <rect x="30" y="100" width="160" height="25" fill="#fef3c7" stroke="#a16207"/>
        <text x="110" y="118" text-anchor="middle">What does X mean to people?</text>
        <text x="210" y="118" font-size="10">→ interviews / qual</text>

        <rect x="30" y="130" width="160" height="25" fill="#fee2e2" stroke="#b91c1c"/>
        <text x="110" y="148" text-anchor="middle">How has X changed?</text>
        <text x="210" y="148" font-size="10">→ historical / archive</text>
      </g>
      <text x="200" y="185" text-anchor="middle" font-size="10" fill="#475569">Method choice is downstream of question.</text>
    </svg>`,
    caption: 'Question type largely dictates the appropriate research method.',
  },
  '5.1': {
    title: 'Academic paper structure',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <g font-size="11">
        <rect x="40" y="30" width="320" height="22" fill="#dbeafe" stroke="#1e40af"/>
        <text x="200" y="46" text-anchor="middle">Abstract (~250 words)</text>
        <rect x="40" y="55" width="320" height="22" fill="#dcfce7" stroke="#15803d"/>
        <text x="200" y="71" text-anchor="middle">Introduction</text>
        <rect x="40" y="80" width="320" height="22" fill="#dcfce7" stroke="#15803d"/>
        <text x="200" y="96" text-anchor="middle">Literature Review</text>
        <rect x="40" y="105" width="320" height="22" fill="#fef3c7" stroke="#a16207"/>
        <text x="200" y="121" text-anchor="middle">Methods</text>
        <rect x="40" y="130" width="320" height="22" fill="#fef3c7" stroke="#a16207"/>
        <text x="200" y="146" text-anchor="middle">Results</text>
        <rect x="40" y="155" width="320" height="22" fill="#fee2e2" stroke="#b91c1c"/>
        <text x="200" y="171" text-anchor="middle">Discussion</text>
        <rect x="40" y="180" width="320" height="22" fill="#fce7f3" stroke="#a21caf"/>
        <text x="200" y="196" text-anchor="middle">Conclusion / References / Appendices</text>
      </g>
    </svg>`,
    caption: 'Standard scholarly paper structure for AP Research.',
  },
};
