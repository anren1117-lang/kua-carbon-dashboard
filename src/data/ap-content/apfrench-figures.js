// AP French — inline SVG diagrams.

export const APFRENCH_FIGURES = {
  '4.2': {
    title: 'La Francophonie',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">~321M French speakers worldwide</text>
      <g font-size="10">
        <rect x="20" y="40" width="100" height="130" fill="#dbeafe" stroke="#1e40af"/>
        <text x="70" y="60" text-anchor="middle" fill="#1e3a8a" font-weight="bold">Europe</text>
        <text x="70" y="85" text-anchor="middle">France</text>
        <text x="70" y="100" text-anchor="middle">Belgique</text>
        <text x="70" y="115" text-anchor="middle">Suisse</text>
        <text x="70" y="130" text-anchor="middle">Luxembourg</text>
        <text x="70" y="150" text-anchor="middle" font-size="9" fill="#475569">Monaco</text>

        <rect x="140" y="40" width="100" height="130" fill="#dcfce7" stroke="#15803d"/>
        <text x="190" y="60" text-anchor="middle" fill="#14532d" font-weight="bold">Afrique</text>
        <text x="190" y="85" text-anchor="middle" font-size="9">Sénégal, Côte d\'Ivoire</text>
        <text x="190" y="100" text-anchor="middle" font-size="9">Mali, Tchad,</text>
        <text x="190" y="115" text-anchor="middle" font-size="9">Cameroun, Burkina F.,</text>
        <text x="190" y="130" text-anchor="middle" font-size="9">Madagascar, Niger,</text>
        <text x="190" y="145" text-anchor="middle" font-size="9">RDC, Bénin, Togo...</text>
        <text x="190" y="162" text-anchor="middle" font-size="9" fill="#7c2d12">Croissance forte</text>

        <rect x="260" y="40" width="120" height="130" fill="#fef3c7" stroke="#a16207"/>
        <text x="320" y="60" text-anchor="middle" fill="#713f12" font-weight="bold">Reste du monde</text>
        <text x="320" y="85" text-anchor="middle" font-size="9">Québec, NB</text>
        <text x="320" y="100" text-anchor="middle" font-size="9">Haïti, Antilles</text>
        <text x="320" y="115" text-anchor="middle" font-size="9">Maurice, Réunion</text>
        <text x="320" y="130" text-anchor="middle" font-size="9">Polynésie fr.,</text>
        <text x="320" y="145" text-anchor="middle" font-size="9">Liban, Vietnam</text>
        <text x="320" y="160" text-anchor="middle" font-size="9">(historique)</text>
      </g>
      <text x="200" y="190" text-anchor="middle" font-size="10" fill="#475569">Projeté: ~700M+ d\'ici 2050 (croissance africaine)</text>
    </svg>`,
    caption: 'La francophonie: une communauté linguistique en pleine expansion, surtout en Afrique.',
  },
  '6.2': {
    title: 'Grands monuments français',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <g font-size="10">
        <rect x="30" y="40" width="100" height="55" fill="#dbeafe" stroke="#1e40af"/>
        <text x="80" y="60" text-anchor="middle" fill="#1e3a8a" font-weight="bold">Notre-Dame</text>
        <text x="80" y="78" text-anchor="middle">1163-1250</text>
        <text x="80" y="90" text-anchor="middle" font-size="9">Gothique</text>

        <rect x="150" y="40" width="100" height="55" fill="#dbeafe" stroke="#1e40af"/>
        <text x="200" y="60" text-anchor="middle" fill="#1e3a8a" font-weight="bold">Versailles</text>
        <text x="200" y="78" text-anchor="middle">1660s-80s</text>
        <text x="200" y="90" text-anchor="middle" font-size="9">Baroque</text>

        <rect x="270" y="40" width="100" height="55" fill="#dbeafe" stroke="#1e40af"/>
        <text x="320" y="60" text-anchor="middle" fill="#1e3a8a" font-weight="bold">Tour Eiffel</text>
        <text x="320" y="78" text-anchor="middle">1889</text>
        <text x="320" y="90" text-anchor="middle" font-size="9">Fer forgé</text>

        <rect x="30" y="110" width="100" height="55" fill="#fef3c7" stroke="#a16207"/>
        <text x="80" y="130" text-anchor="middle" fill="#713f12" font-weight="bold">Centre Pompidou</text>
        <text x="80" y="148" text-anchor="middle">1977</text>
        <text x="80" y="160" text-anchor="middle" font-size="9">Inside-out</text>

        <rect x="150" y="110" width="100" height="55" fill="#fef3c7" stroke="#a16207"/>
        <text x="200" y="130" text-anchor="middle" fill="#713f12" font-weight="bold">Pyramide du Louvre</text>
        <text x="200" y="148" text-anchor="middle">1989 (I.M. Pei)</text>
        <text x="200" y="160" text-anchor="middle" font-size="9">Verre et acier</text>

        <rect x="270" y="110" width="100" height="55" fill="#fef3c7" stroke="#a16207"/>
        <text x="320" y="130" text-anchor="middle" fill="#713f12" font-weight="bold">Fond. L. Vuitton</text>
        <text x="320" y="148" text-anchor="middle">2014 (Gehry)</text>
        <text x="320" y="160" text-anchor="middle" font-size="9">Voiles de verre</text>
      </g>
      <text x="200" y="190" text-anchor="middle" font-size="10" fill="#475569">L\'architecture française: huit siècles, du gothique au déconstructivisme.</text>
    </svg>`,
    caption: 'Quelques jalons architecturaux français — chacun marque son époque.',
  },
  '6.3': {
    title: 'Lauréats Nobel français récents',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Prix Nobel de littérature français récents</text>
      <line x1="40" y1="160" x2="380" y2="160" stroke="#475569" stroke-width="2"/>
      <g font-size="10">
        <circle cx="70" cy="160" r="5" fill="#15803d"/>
        <text x="70" y="148" text-anchor="middle" fill="#14532d">1957</text>
        <text x="70" y="180" text-anchor="middle">Camus</text>
        <circle cx="160" cy="160" r="5" fill="#15803d"/>
        <text x="160" y="148" text-anchor="middle" fill="#14532d">2008</text>
        <text x="160" y="180" text-anchor="middle">Le Clézio</text>
        <circle cx="240" cy="160" r="5" fill="#15803d"/>
        <text x="240" y="148" text-anchor="middle" fill="#14532d">2014</text>
        <text x="240" y="180" text-anchor="middle">Modiano</text>
        <circle cx="340" cy="160" r="6" fill="#b91c1c"/>
        <text x="340" y="148" text-anchor="middle" fill="#7c2d12" font-weight="bold">2022</text>
        <text x="340" y="180" text-anchor="middle">Ernaux</text>
      </g>
      <text x="200" y="60" text-anchor="middle" font-size="11" fill="#475569">Plus de Nobel littéraires français que tout autre pays.</text>
      <text x="200" y="80" text-anchor="middle" font-size="11" fill="#475569">+ Sartre (1964, refused).</text>
    </svg>`,
    caption: 'La France: pays avec le plus de Prix Nobel de littérature.',
  },
};
