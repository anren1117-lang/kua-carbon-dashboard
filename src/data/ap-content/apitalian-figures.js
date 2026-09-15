// AP Italian — inline SVG figures.

export const APITALIAN_FIGURES = {
  '4.1': {
    title: 'Centri del Rinascimento italiano',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Quattro centri del Rinascimento</text>
      <g font-size="11">
        <rect x="30" y="40" width="80" height="60" fill="#fef3c7" stroke="#a16207"/>
        <text x="70" y="65" text-anchor="middle" font-weight="bold">Firenze</text>
        <text x="70" y="82" text-anchor="middle" font-size="10">Medici, Brunelleschi</text>
        <text x="70" y="95" text-anchor="middle" font-size="10">Botticelli, Michelangelo</text>

        <rect x="120" y="40" width="80" height="60" fill="#fef3c7" stroke="#a16207"/>
        <text x="160" y="65" text-anchor="middle" font-weight="bold">Roma</text>
        <text x="160" y="82" text-anchor="middle" font-size="10">Papi committenti</text>
        <text x="160" y="95" text-anchor="middle" font-size="10">Raffaello, S.Pietro</text>

        <rect x="210" y="40" width="80" height="60" fill="#fef3c7" stroke="#a16207"/>
        <text x="250" y="65" text-anchor="middle" font-weight="bold">Venezia</text>
        <text x="250" y="82" text-anchor="middle" font-size="10">Tiziano, Bellini</text>
        <text x="250" y="95" text-anchor="middle" font-size="10">colore veneziano</text>

        <rect x="300" y="40" width="80" height="60" fill="#fef3c7" stroke="#a16207"/>
        <text x="340" y="65" text-anchor="middle" font-weight="bold">Milano</text>
        <text x="340" y="82" text-anchor="middle" font-size="10">Sforza, Leonardo</text>
        <text x="340" y="95" text-anchor="middle" font-size="10">Cenacolo Ultima Cena</text>
      </g>
      <text x="200" y="160" text-anchor="middle" font-size="11" fill="#475569">Italia ha il numero più alto di siti UNESCO al mondo (~58).</text>
    </svg>`,
    caption: 'Il Rinascimento italiano si è sviluppato in più centri urbani, ciascuno con il proprio stile.',
  },
  '6.1': {
    title: 'Migrazione italiana',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Italia: paese di emigrazione e immigrazione</text>
      <g font-size="10">
        <rect x="30" y="40" width="160" height="60" fill="#fef3c7" stroke="#a16207"/>
        <text x="110" y="60" text-anchor="middle" font-weight="bold" fill="#713f12">Storica emigrazione</text>
        <text x="110" y="78" text-anchor="middle">~16M tra 1880-1920</text>
        <text x="110" y="93" text-anchor="middle">USA, Argentina, Brasile</text>

        <rect x="210" y="40" width="160" height="60" fill="#fee2e2" stroke="#b91c1c"/>
        <text x="290" y="60" text-anchor="middle" font-weight="bold" fill="#7c2d12">Recente immigrazione</text>
        <text x="290" y="78" text-anchor="middle">~5M stranieri (~8%)</text>
        <text x="290" y="93" text-anchor="middle">Africa, E.Europa, Asia, S.Am.</text>
      </g>
      <text x="200" y="140" text-anchor="middle" font-size="11" fill="#475569">Anche brain drain di giovani italiani all\'estero — circolazione di cervelli.</text>
    </svg>`,
    caption: 'L\'Italia è passata da paese di emigrazione a paese di immigrazione nel XX secolo.',
  },
};
