// APUSH — inline SVG diagrams.

export const APUSH_FIGURES = {
  '1.3': {
    title: 'The Columbian Exchange',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="110" r="55" fill="#fde68a" stroke="#a16207"/>
      <text x="100" y="105" text-anchor="middle" font-size="12" fill="#713f12" font-weight="bold">New World</text>
      <text x="100" y="125" text-anchor="middle" font-size="10" fill="#713f12">Americas</text>
      <circle cx="300" cy="110" r="55" fill="#bbf7d0" stroke="#15803d"/>
      <text x="300" y="105" text-anchor="middle" font-size="12" fill="#14532d" font-weight="bold">Old World</text>
      <text x="300" y="125" text-anchor="middle" font-size="10" fill="#14532d">Eurasia + Africa</text>
      <path d="M155,90 Q200,40 245,90" stroke="#1e40af" stroke-width="2" fill="none" marker-end="url(#ce)"/>
      <text x="200" y="40" text-anchor="middle" font-size="10" fill="#1e3a8a">corn, potatoes, tomatoes, syphilis(?)</text>
      <path d="M245,140 Q200,190 155,140" stroke="#b91c1c" stroke-width="2" fill="none" marker-end="url(#ce)"/>
      <text x="200" y="205" text-anchor="middle" font-size="10" fill="#7c2d12">wheat, horses, smallpox, enslaved people</text>
      <defs><marker id="ce" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'Crops, animals, diseases, and people moved both directions — reshaping global ecology and demographics.',
  },
  '2.1': {
    title: 'Three colonial regions',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="40" width="115" height="150" fill="#dbeafe" stroke="#1e40af"/>
      <text x="78" y="60" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">New England</text>
      <text x="78" y="85" text-anchor="middle" font-size="10">Puritans</text>
      <text x="78" y="105" text-anchor="middle" font-size="10">family farms</text>
      <text x="78" y="125" text-anchor="middle" font-size="10">towns, schools</text>
      <text x="78" y="145" text-anchor="middle" font-size="10">shipping</text>
      <text x="78" y="180" text-anchor="middle" font-size="10" fill="#475569">MA, CT, RI, NH</text>

      <rect x="145" y="40" width="115" height="150" fill="#dcfce7" stroke="#15803d"/>
      <text x="203" y="60" text-anchor="middle" font-size="12" fill="#14532d" font-weight="bold">Middle</text>
      <text x="203" y="85" text-anchor="middle" font-size="10">diverse</text>
      <text x="203" y="105" text-anchor="middle" font-size="10">wheat (breadbasket)</text>
      <text x="203" y="125" text-anchor="middle" font-size="10">port cities</text>
      <text x="203" y="145" text-anchor="middle" font-size="10">religious tolerance</text>
      <text x="203" y="180" text-anchor="middle" font-size="10" fill="#475569">NY, NJ, PA, DE</text>

      <rect x="270" y="40" width="115" height="150" fill="#fef3c7" stroke="#a16207"/>
      <text x="328" y="60" text-anchor="middle" font-size="12" fill="#713f12" font-weight="bold">Southern</text>
      <text x="328" y="85" text-anchor="middle" font-size="10">plantations</text>
      <text x="328" y="105" text-anchor="middle" font-size="10">tobacco, rice</text>
      <text x="328" y="125" text-anchor="middle" font-size="10">enslaved labor</text>
      <text x="328" y="145" text-anchor="middle" font-size="10">Anglican</text>
      <text x="328" y="180" text-anchor="middle" font-size="10" fill="#475569">VA, MD, NC, SC, GA</text>
    </svg>`,
    caption: 'Three regional patterns, each shaped by founders, geography, and labor system.',
  },
  '2.4': {
    title: 'Triangular trade',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="50" r="28" fill="#dbeafe" stroke="#1e40af"/>
      <text x="200" y="55" text-anchor="middle" font-size="11" fill="#1e3a8a">Europe</text>
      <circle cx="80" cy="170" r="28" fill="#fef3c7" stroke="#a16207"/>
      <text x="80" y="175" text-anchor="middle" font-size="11" fill="#713f12">Americas</text>
      <circle cx="320" cy="170" r="28" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="320" y="175" text-anchor="middle" font-size="11" fill="#7c2d12">Africa</text>
      <path d="M220,72 L300,150" stroke="#475569" stroke-width="2" marker-end="url(#tt)"/>
      <text x="280" y="100" font-size="10" fill="#475569">guns, rum, textiles</text>
      <path d="M295,180 L110,180" stroke="#7c2d12" stroke-width="2" marker-end="url(#tt)"/>
      <text x="200" y="200" text-anchor="middle" font-size="10" fill="#7c2d12" font-weight="bold">Middle Passage: enslaved people</text>
      <path d="M105,150 L180,72" stroke="#15803d" stroke-width="2" marker-end="url(#tt)"/>
      <text x="100" y="100" font-size="10" fill="#14532d">sugar, tobacco, cotton</text>
      <defs><marker id="tt" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: '~12M Africans were forced across the Middle Passage. Profits flowed throughout the system.',
  },
  '3.4': {
    title: 'Federalism — divided powers',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="20" width="340" height="50" fill="#dbeafe" stroke="#1e40af"/>
      <text x="200" y="40" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Federal</text>
      <text x="200" y="58" text-anchor="middle" font-size="10">war, treaties, currency, interstate commerce, immigration</text>

      <rect x="30" y="80" width="340" height="50" fill="#dcfce7" stroke="#15803d"/>
      <text x="200" y="100" text-anchor="middle" font-size="12" fill="#14532d" font-weight="bold">Concurrent</text>
      <text x="200" y="118" text-anchor="middle" font-size="10">taxes, courts, build infrastructure, charter banks</text>

      <rect x="30" y="140" width="340" height="50" fill="#fef3c7" stroke="#a16207"/>
      <text x="200" y="160" text-anchor="middle" font-size="12" fill="#713f12" font-weight="bold">State</text>
      <text x="200" y="178" text-anchor="middle" font-size="10">education, marriage, drivers, intrastate commerce, police</text>
      <text x="200" y="210" text-anchor="middle" font-size="10" fill="#475569">10th Amendment reserves remaining powers to states/people</text>
    </svg>`,
    caption: 'The Constitution divided powers between federal and state governments — a compromise that continues to shape American politics.',
  },
  '4.3': {
    title: 'Trail of Tears',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="360" height="180" fill="#f1f5f9" stroke="#475569"/>
      <rect x="240" y="80" width="80" height="60" fill="#fef3c7" stroke="#a16207"/>
      <text x="280" y="115" text-anchor="middle" font-size="11" fill="#713f12">Southeast</text>
      <text x="280" y="155" text-anchor="middle" font-size="9" fill="#7c2d12">Cherokee homeland</text>
      <rect x="60" y="80" width="80" height="60" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="100" y="115" text-anchor="middle" font-size="11" fill="#7c2d12">Oklahoma</text>
      <text x="100" y="155" text-anchor="middle" font-size="9" fill="#7c2d12">"Indian Territory"</text>
      <path d="M240,110 Q170,40 140,100" stroke="#7c2d12" stroke-width="3" fill="none" stroke-dasharray="6 4" marker-end="url(#tr)"/>
      <text x="200" y="40" text-anchor="middle" font-size="10" fill="#7c2d12" font-weight="bold">1,200 mi forced march, winter 1838-39</text>
      <text x="200" y="195" text-anchor="middle" font-size="11" fill="#7c2d12">~4,000 of 15,000 Cherokee died</text>
      <defs><marker id="tr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7c2d12"/></marker></defs>
    </svg>`,
    caption: 'Indian Removal Act (1830) forced eastern Indigenous nations west of the Mississippi.',
  },
  '5.2': {
    title: 'Civil War turning points',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="180" x2="380" y2="180" stroke="#475569" stroke-width="2"/>
      <line x1="80" y1="180" x2="80" y2="80" stroke="#1e40af" stroke-width="2"/>
      <circle cx="80" cy="80" r="5" fill="#1e40af"/>
      <text x="80" y="70" text-anchor="middle" font-size="10" fill="#1e3a8a">Antietam</text>
      <text x="80" y="195" text-anchor="middle" font-size="9" fill="#475569">Sep 1862</text>

      <line x1="160" y1="180" x2="160" y2="50" stroke="#15803d" stroke-width="2"/>
      <circle cx="160" cy="50" r="5" fill="#15803d"/>
      <text x="160" y="40" text-anchor="middle" font-size="10" fill="#14532d">Emancipation</text>
      <text x="160" y="195" text-anchor="middle" font-size="9" fill="#475569">Jan 1863</text>

      <line x1="240" y1="180" x2="240" y2="40" stroke="#b91c1c" stroke-width="2"/>
      <circle cx="240" cy="40" r="5" fill="#b91c1c"/>
      <text x="240" y="30" text-anchor="middle" font-size="10" fill="#7c2d12">Gettysburg/Vicksburg</text>
      <text x="240" y="195" text-anchor="middle" font-size="9" fill="#475569">Jul 1863</text>

      <line x1="340" y1="180" x2="340" y2="80" stroke="#1e40af" stroke-width="2"/>
      <circle cx="340" cy="80" r="5" fill="#1e40af"/>
      <text x="340" y="70" text-anchor="middle" font-size="10" fill="#1e3a8a">Appomattox</text>
      <text x="340" y="195" text-anchor="middle" font-size="9" fill="#475569">Apr 1865</text>
    </svg>`,
    caption: 'Antietam permitted Emancipation; Gettysburg + Vicksburg in July 1863 marked the strategic turn.',
  },
  '6.3': {
    title: 'Bison population collapse',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="180" x2="380" y2="180" stroke="#475569"/>
      <line x1="40" y1="180" x2="40" y2="20" stroke="#475569"/>
      <text x="200" y="200" text-anchor="middle" font-size="10" fill="#475569">1800           1850            1880           1900</text>
      <text x="20" y="30" font-size="9" fill="#475569">30M</text>
      <text x="20" y="180" font-size="9" fill="#475569">0</text>
      <path d="M40,30 Q100,30 160,40 Q220,60 280,170 Q330,177 370,178" stroke="#7c2d12" stroke-width="3" fill="none"/>
      <text x="200" y="120" font-size="10" fill="#7c2d12">~30M → &lt;1,000</text>
      <text x="200" y="145" font-size="10" fill="#475569">deliberate strategy to break Plains peoples</text>
    </svg>`,
    caption: 'Bison were central to Plains cultures. Mass slaughter destroyed both an ecosystem and a way of life.',
  },
  '7.2': {
    title: 'WWI alliances',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="40" width="140" height="140" fill="#dbeafe" stroke="#1e40af"/>
      <text x="110" y="60" text-anchor="middle" font-size="13" fill="#1e3a8a" font-weight="bold">Allies</text>
      <text x="110" y="85" text-anchor="middle" font-size="11">France</text>
      <text x="110" y="105" text-anchor="middle" font-size="11">Britain</text>
      <text x="110" y="125" text-anchor="middle" font-size="11">Russia (until 1917)</text>
      <text x="110" y="145" text-anchor="middle" font-size="11">Italy (1915)</text>
      <text x="110" y="170" text-anchor="middle" font-size="11" fill="#15803d" font-weight="bold">US (1917)</text>

      <rect x="220" y="40" width="140" height="140" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="290" y="60" text-anchor="middle" font-size="13" fill="#7c2d12" font-weight="bold">Central Powers</text>
      <text x="290" y="85" text-anchor="middle" font-size="11">Germany</text>
      <text x="290" y="105" text-anchor="middle" font-size="11">Austria-Hungary</text>
      <text x="290" y="125" text-anchor="middle" font-size="11">Ottoman Empire</text>
      <text x="290" y="145" text-anchor="middle" font-size="11">Bulgaria</text>
    </svg>`,
    caption: 'US entered in 1917 after submarine warfare and the Zimmermann Telegram.',
  },
  '7.4': {
    title: 'Depression unemployment',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="180" x2="380" y2="180" stroke="#475569"/>
      <line x1="40" y1="180" x2="40" y2="20" stroke="#475569"/>
      <text x="200" y="200" text-anchor="middle" font-size="10" fill="#475569">1929    1933    1937    1941    1945</text>
      <text x="20" y="30" font-size="9" fill="#475569">25%</text>
      <text x="20" y="180" font-size="9" fill="#475569">0%</text>
      <path d="M40,170 Q80,40 130,30 Q200,80 250,75 Q280,100 340,160 L380,165" stroke="#7c2d12" stroke-width="3" fill="none"/>
      <line x1="135" y1="20" x2="135" y2="180" stroke="#94a3b8" stroke-dasharray="3 3"/>
      <text x="135" y="15" text-anchor="middle" font-size="9" fill="#7c2d12">FDR</text>
      <line x1="290" y1="20" x2="290" y2="180" stroke="#94a3b8" stroke-dasharray="3 3"/>
      <text x="290" y="15" text-anchor="middle" font-size="9" fill="#15803d">WWII</text>
    </svg>`,
    caption: 'Unemployment peaked at ~25% in 1933. WWII production finally ended the Depression.',
  },
  '8.2': {
    title: 'Civil rights milestones',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="120" x2="380" y2="120" stroke="#475569" stroke-width="2"/>
      <g font-size="10">
        <circle cx="60" cy="120" r="5" fill="#1e40af"/>
        <text x="60" y="105" text-anchor="middle" fill="#1e3a8a">1954</text>
        <text x="60" y="145" text-anchor="middle">Brown</text>
        <circle cx="130" cy="120" r="5" fill="#1e40af"/>
        <text x="130" y="105" text-anchor="middle" fill="#1e3a8a">1955-6</text>
        <text x="130" y="145" text-anchor="middle">Montgomery</text>
        <text x="130" y="158" text-anchor="middle">Boycott</text>
        <circle cx="200" cy="120" r="5" fill="#15803d"/>
        <text x="200" y="105" text-anchor="middle" fill="#14532d">1963</text>
        <text x="200" y="145" text-anchor="middle">March on</text>
        <text x="200" y="158" text-anchor="middle">Washington</text>
        <circle cx="270" cy="120" r="6" fill="#b91c1c"/>
        <text x="270" y="105" text-anchor="middle" fill="#7c2d12">1964</text>
        <text x="270" y="145" text-anchor="middle">Civil Rights</text>
        <text x="270" y="158" text-anchor="middle">Act</text>
        <circle cx="340" cy="120" r="6" fill="#b91c1c"/>
        <text x="340" y="105" text-anchor="middle" fill="#7c2d12">1965</text>
        <text x="340" y="145" text-anchor="middle">Voting</text>
        <text x="340" y="158" text-anchor="middle">Rights Act</text>
      </g>
      <text x="200" y="195" text-anchor="middle" font-size="11" fill="#475569">Eleven years from Brown to VRA — culmination of decades of organizing</text>
    </svg>`,
    caption: 'Brown opened the legal door; mass mobilization and federal legislation made it real.',
  },
  '8.4': {
    title: 'Vietnam War timeline',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="180" x2="380" y2="180" stroke="#475569" stroke-width="2"/>
      <g font-size="10">
        <line x1="70" y1="180" x2="70" y2="80" stroke="#1e40af"/>
        <circle cx="70" cy="80" r="4" fill="#1e40af"/>
        <text x="70" y="70" text-anchor="middle" fill="#1e3a8a">1954</text>
        <text x="70" y="195" text-anchor="middle" fill="#475569">Dien Bien Phu</text>
        <line x1="150" y1="180" x2="150" y2="60" stroke="#15803d"/>
        <circle cx="150" cy="60" r="4" fill="#15803d"/>
        <text x="150" y="50" text-anchor="middle" fill="#14532d">1964</text>
        <text x="150" y="195" text-anchor="middle" fill="#475569">Gulf of Tonkin</text>
        <line x1="220" y1="180" x2="220" y2="40" stroke="#b91c1c"/>
        <circle cx="220" cy="40" r="4" fill="#b91c1c"/>
        <text x="220" y="30" text-anchor="middle" fill="#7c2d12">1968</text>
        <text x="220" y="195" text-anchor="middle" fill="#475569">Tet Offensive</text>
        <line x1="290" y1="180" x2="290" y2="100" stroke="#1e40af"/>
        <circle cx="290" cy="100" r="4" fill="#1e40af"/>
        <text x="290" y="90" text-anchor="middle" fill="#1e3a8a">1973</text>
        <text x="290" y="195" text-anchor="middle" fill="#475569">Paris Accords</text>
        <line x1="350" y1="180" x2="350" y2="60" stroke="#b91c1c"/>
        <circle cx="350" cy="60" r="4" fill="#b91c1c"/>
        <text x="350" y="50" text-anchor="middle" fill="#7c2d12">1975</text>
        <text x="350" y="195" text-anchor="middle" fill="#475569">Saigon falls</text>
      </g>
    </svg>`,
    caption: 'From French defeat to Saigon\'s fall — two decades of escalation and withdrawal.',
  },
  '9.2': {
    title: 'Income inequality 1970-2020',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="180" x2="380" y2="180" stroke="#475569"/>
      <line x1="40" y1="180" x2="40" y2="20" stroke="#475569"/>
      <text x="200" y="200" text-anchor="middle" font-size="10" fill="#475569">1970    1985    2000    2015    2020</text>
      <text x="20" y="30" font-size="9" fill="#475569">30%</text>
      <text x="20" y="180" font-size="9" fill="#475569">10%</text>
      <path d="M40,130 Q120,115 200,80 Q280,60 380,45" stroke="#7c2d12" stroke-width="3" fill="none"/>
      <text x="220" y="130" font-size="10" fill="#7c2d12">Top 1% share of wealth</text>
      <text x="200" y="155" text-anchor="middle" font-size="10" fill="#475569">~10% (1970s) → ~30% (today)</text>
    </svg>`,
    caption: 'Wealth concentration accelerated from the 1980s, reshaping politics and economics.',
  },
};
