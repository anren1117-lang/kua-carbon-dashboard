// AP Human Geography Unit 6 — Cities and Urban Land-Use (12-17%)

export const APHUG_UNIT_6 = {
  number: 6,
  title: 'Cities and Urban Land-Use Patterns and Processes',
  weight: '12-17%',
  subunits: [
    {
      code: '6.1',
      title: 'Urbanization patterns',
      content:
`**Urbanization** = increase in % of people in cities.
- 1800: ~3% urban.
- 1900: ~14%.
- 1950: ~30%.
- 2024: ~56%.
- Projected 2050: ~68%.

**Urbanization drivers:**
- Industrialization (jobs in cities).
- Rural push (mechanization).
- Better services (healthcare, education).
- Network effects.

**Megacities** (>10M): Tokyo, Delhi, Shanghai, São Paulo, Mexico City, Cairo, Mumbai, Dhaka, Beijing, Osaka, etc.

**Metacity** (>20M): Tokyo, Delhi.

**Urbanization in different regions:**
- Developed: ~80%+ urban.
- Developing: Latin America similar; Asia/Africa rapidly urbanizing.
- Africa: most rapid urbanization (still ~45% but rising fast).

**World city / global city.** Influence beyond borders. New York, London, Tokyo, Paris, Hong Kong, Singapore. Hierarchy of cities by global function.

**Primate city.** Largest city much bigger than second (Bangkok, Mexico City, Paris in France). Often outsized influence.

**Rank-size rule.** nth largest city = 1/n of largest. (US roughly follows.)`,
    },
    {
      code: '6.2',
      title: 'Urban models',
      content:
`Three classic models of US cities.

**Concentric Zone (Burgess 1925)** — based on Chicago.
- Zone 1: CBD (Central Business District).
- Zone 2: Zone of transition (warehouses, slums, gentrifying).
- Zone 3: Working-class housing.
- Zone 4: Middle-class housing.
- Zone 5: Suburbs/commuter zone.

**Sector Model (Hoyt 1939)** — wedges along transport routes from CBD.

**Multiple Nuclei (Harris & Ullman 1945)** — multiple centers, not just CBD. More realistic for car-era cities.

**Galactic City Model (Modern US, post-1970s).** Edge cities; multiple suburban nodes; original CBD declining or repurposing.

**Latin American Model (Griffin-Ford).** CBD + commercial spine; wealthy near center along spine; squatter settlements at periphery (favelas, slums).

**African City Model.** Often has multiple CBDs (colonial, traditional, market); squatter settlements at edge.

**Southeast Asian City Model (McGee).** Port-centered; foreign commercial zone; informal settlements.

**Modern trends:**
- **Gentrification**: wealthy return to central neighborhoods; displaces poorer residents.
- **Edge cities**: suburban concentrations with offices, retail.
- **Suburban poverty**: increasingly common.
- **Smart growth/new urbanism**: walkable, mixed-use, transit.`,
    },
    {
      code: '6.3',
      title: 'Urban issues',
      content:
`**Housing:**
- Affordability crisis in major cities globally.
- Homelessness: ~580k in US (2023).
- Public housing legacy mixed.
- Inclusionary zoning, rent control debated.

**Transportation:**
- Cars dominant in US; transit in Europe, Asia.
- Traffic, pollution, climate impact.
- Car-free zones in some European cities.
- High-speed rail (Asia, Europe; absent in US).

**Sprawl.** Low-density expansion.
- Car-dependent.
- Loss of farmland, habitat.
- Higher infrastructure costs.
- Health impacts (more driving, less walking).

**Smart growth.** Counter-sprawl: dense, walkable, mixed-use, transit-oriented.

**Environmental:**
- Urban heat islands (cities 1-3°C warmer).
- Air pollution.
- Water management.
- Brownfields (contaminated former industrial sites).

**Inequality:**
- Income segregation increasing.
- Schools highly unequal (funded by property tax in US).
- Food deserts, healthcare access disparities.
- "Two Americas" within cities.

**Slums/informal settlements:**
- ~1 billion globally.
- Major in Mumbai (Dharavi), Nairobi (Kibera), Lagos.
- Self-built; often lack water, sanitation, secure tenure.

**Gentrification.**
- Wealthy move into low-income neighborhoods.
- Improves infrastructure but displaces residents.
- Debate: revitalization vs displacement.`,
    },
    {
      code: '6.4',
      title: 'Sustainable cities and urban planning',
      content:
`**Sustainable cities** balance economy, environment, society.

**Strategies:**
- Renewable energy (Copenhagen aims net-zero by 2025).
- Public transit (Singapore, Tokyo, European cities).
- Bike infrastructure (Amsterdam, Copenhagen — 50% of trips by bike).
- Green spaces (Singapore is "garden city").
- Water management (Rotterdam handles floods).
- Affordable housing.
- Mixed-use development.

**Smart cities.** Use sensors, data, AI to optimize traffic, energy, services.
- Singapore.
- Seoul.
- Barcelona.

**Climate adaptation.**
- Sea-walls, flood barriers (Venice MOSE).
- Cooling centers in heat waves.
- Permeable pavements.
- Urban forests.

**New urbanism / 15-minute city.** Everything within 15 min walk/bike. Paris pioneering.

**Urban-rural divide.** Politically and economically widening in many countries.

**Future:**
- 2050: ~70% urban.
- Africa and Asia drive growth.
- Climate refugees may flow to cities.
- AI/automation may change urban labor demand.`,
    },
  ],
  keyConcepts: [
    '~56% urban (2024); projected 68% by 2050.',
    'Megacities (>10M); metacities (>20M).',
    'Primate city: dominant; rank-size rule for distribution.',
    'Classic models: Concentric (Burgess), Sector (Hoyt), Multiple Nuclei.',
    'Galactic city: edge cities, multiple nodes (modern US).',
    'Latin American, African, Southeast Asian city models distinct.',
    'Issues: housing, transport, sprawl, environment, inequality.',
    'Sprawl vs smart growth.',
    'Slums: 1B in informal settlements.',
    'Sustainable cities: transit, green spaces, affordable housing, climate adaptation.',
  ],
  practice: [
    {
      q: 'A city with population 8M is largest in country. Second city is 4M; third is 2M. Does this follow rank-size rule?',
      a: 'Yes: 2nd = 1/2 of 1st (4 = 8/2); 3rd = 1/3 of 1st (~2.67); close to 2. US-style distribution, not primate.',
    },
  ],
  pitfalls: [
    '"Urbanization is bad" — has trade-offs; cities are more efficient per capita than rural in many ways.',
    '"All cities follow Concentric Zone" — model from 1925 Chicago; varies by city type and era.',
  ],
};
