// AP German — inline SVG figures.

export const APGERMAN_FIGURES = {
  '2.1': {
    title: 'D-A-CH: deutschsprachige Länder',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">D-A-CH: deutschsprachige Länder</text>
      <g font-size="11">
        <rect x="40" y="40" width="100" height="120" fill="#dbeafe" stroke="#1e40af"/>
        <text x="90" y="65" text-anchor="middle" font-weight="bold">Deutschland</text>
        <text x="90" y="85" text-anchor="middle" font-size="10">~84M Einwohner</text>
        <text x="90" y="100" text-anchor="middle" font-size="10">16 Bundesländer</text>
        <text x="90" y="120" text-anchor="middle" font-size="10">Berlin Hauptstadt</text>
        <text x="90" y="140" text-anchor="middle" font-size="9">Wiedervereinigung</text>
        <text x="90" y="153" text-anchor="middle" font-size="9">1990</text>

        <rect x="150" y="40" width="100" height="120" fill="#dcfce7" stroke="#15803d"/>
        <text x="200" y="65" text-anchor="middle" font-weight="bold">Österreich</text>
        <text x="200" y="85" text-anchor="middle" font-size="10">~9M Einwohner</text>
        <text x="200" y="100" text-anchor="middle" font-size="10">9 Bundesländer</text>
        <text x="200" y="120" text-anchor="middle" font-size="10">Wien Hauptstadt</text>
        <text x="200" y="140" text-anchor="middle" font-size="9">Habsburger</text>
        <text x="200" y="153" text-anchor="middle" font-size="9">Tradition</text>

        <rect x="260" y="40" width="100" height="120" fill="#fef3c7" stroke="#a16207"/>
        <text x="310" y="65" text-anchor="middle" font-weight="bold">Schweiz</text>
        <text x="310" y="85" text-anchor="middle" font-size="10">~9M Einwohner</text>
        <text x="310" y="100" text-anchor="middle" font-size="10">4 Sprachen</text>
        <text x="310" y="120" text-anchor="middle" font-size="10">Bern Hauptstadt</text>
        <text x="310" y="140" text-anchor="middle" font-size="9">Neutralität</text>
        <text x="310" y="153" text-anchor="middle" font-size="9">Konföderation</text>
      </g>
      <text x="200" y="185" text-anchor="middle" font-size="10" fill="#475569">~100M Muttersprachler Deutsch global; ~130M total.</text>
    </svg>`,
    caption: 'Drei deutschsprachige Länder mit unterschiedlichen politischen und kulturellen Traditionen.',
  },
  '4.2': {
    title: 'Energiewende: Strommix Deutschland',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Stromproduktion 2024 (ungefähr)</text>
      <g font-size="10">
        <rect x="40" y="50" width="200" height="25" fill="#dcfce7" stroke="#15803d"/>
        <text x="140" y="68" text-anchor="middle">Erneuerbare (~52%) — Wind, Solar, Biomasse</text>
        <rect x="40" y="80" width="100" height="25" fill="#fef3c7" stroke="#a16207"/>
        <text x="90" y="98" text-anchor="middle">Kohle (~25%)</text>
        <rect x="40" y="110" width="60" height="25" fill="#fee2e2" stroke="#b91c1c"/>
        <text x="70" y="128" text-anchor="middle">Gas (~15%)</text>
        <rect x="40" y="140" width="20" height="25" fill="#94a3b8" stroke="#475569"/>
        <text x="70" y="158" text-anchor="middle">Sonstiges</text>
      </g>
      <text x="200" y="185" text-anchor="middle" font-size="10" fill="#475569">Atom seit 2023 abgeschaltet; Kohleausstieg geplant bis 2038.</text>
    </svg>`,
    caption: 'Die Energiewende ist im Gange — über die Hälfte des Stroms kommt schon aus erneuerbaren Quellen.',
  },
};
