// AP Macro Unit 6 — Open Economy: International Trade and Finance (10-13%)

export const APMACRO_UNIT_6 = {
  number: 6,
  title: 'Open Economy: International Trade and Finance',
  weight: '10-13%',
  subunits: [
    {
      code: '6.1',
      title: 'Balance of payments',
      content:
`**Balance of payments (BOP)** = record of all transactions between a country and rest of world.

**Two main accounts:**

**Current account.** Trade in goods and services + income.
- **Trade balance**: exports - imports. Negative = deficit.
- US has long run current account deficits ($800B+/year).

**Capital/financial account.** Trade in assets (stocks, bonds, real estate, FDI).
- US runs surplus here (foreigners buy US assets).

**Identity:** Current account + Capital account = 0 (must balance).

**Why?** If US imports $100B more than it exports, that $100B must come back somehow — through foreigners buying US assets.

**Trade balance components:**
- Goods (merchandise).
- Services (often US surplus).
- Investment income.
- Transfers (foreign aid).

**Misconceptions about trade deficits:**
- Not "losing." Just means importing more than exporting.
- Often signals strong economy (rich consumers buying foreign goods).
- Can be sustainable if capital inflows continue.
- Becomes problem if currency confidence falls (rare for US).`,
    },
    {
      code: '6.2',
      title: 'Foreign exchange markets',
      content:
`**Exchange rates.** Price of one currency in another. $1 = ¥110 means each dollar buys 110 yen.

**Appreciation/depreciation.**
- Appreciation: currency strengthens (worth more of others).
- Depreciation: currency weakens.

**Determined by:**
- **Demand for currency**: from foreigners wanting to buy goods, services, or assets.
- **Supply of currency**: from domestic holders wanting to buy foreign goods/services/assets.

**Demand for $ rises when:**
- Foreigners want to buy US goods (exports).
- US interest rates rise (foreign investors want US bonds).
- US becomes more attractive (political stability, growth).
- Speculation expects $ to rise.

**Supply of $ rises when:**
- Americans buy foreign goods (imports).
- Americans invest abroad.
- Americans travel abroad.

**Effects of currency changes:**

**Appreciation** (strong $):
- US goods more expensive for foreigners → exports ↓.
- Foreign goods cheaper for US → imports ↑.
- Trade deficit widens.
- Inflation tends to fall (cheap imports).

**Depreciation** (weak $):
- Opposite. Exports ↑, imports ↓.
- Trade balance improves.
- Imported goods cost more → inflation pressure.

**Real exchange rate** = nominal × (foreign prices / domestic prices). Adjusts for inflation differences.

**Purchasing Power Parity (PPP).** Exchange rate should equalize purchasing power across countries. Often doesn\'t hold short-term.`,
    },
    {
      code: '6.3',
      title: 'Trade and tariffs',
      content:
`**Free trade benefits.**
- Comparative advantage gains.
- Lower prices for consumers.
- More variety.
- Economies of scale.
- Innovation through competition.

**Free trade losers.** Workers in import-competing industries.

**Tariffs.** Tax on imports.
- Protect domestic industry (short-term).
- Raise consumer prices.
- Reduce trade volume.
- Other countries often retaliate → trade war.

**Quotas.** Limits on import quantity. Similar effects.

**Subsidies to exporters.** Help domestic industries; can be seen as unfair by trading partners.

**Trade agreements:**
- **NAFTA → USMCA**: US, Canada, Mexico.
- **EU**: common market across European countries.
- **WTO**: rules and dispute resolution globally.
- **TPP**: Trans-Pacific (US withdrew 2017).
- **AfCFTA**: African Continental Free Trade Area.

**Arguments for protectionism:**
- Protect infant industries.
- National security (steel, semiconductors).
- Anti-dumping.
- Labor/environmental standards.
- Strategic trade policy.

**Arguments against:**
- Higher prices for consumers.
- Inefficiency (protection of weak firms).
- Retaliation.
- Diverts resources from comparative advantage.

**Recent US trade policy.**
- 2018-19: Trump tariffs on China, steel, aluminum.
- 2021-: Biden largely kept tariffs; added CHIPS Act subsidies.
- Industrial policy returning.`,
    },
    {
      code: '6.4',
      title: 'Effect of changes on exchange rates',
      content:
`Various events affect currency values.

**Higher US interest rates:**
- Attracts foreign capital seeking yield.
- ↑ demand for $ → $ appreciates.
- Hurts US exports (more expensive).

**Higher US inflation (vs other countries):**
- US goods more expensive → exports ↓.
- US imports more attractive.
- ↑ supply of $, ↓ demand for $.
- $ depreciates (PPP logic).

**Stronger US growth:**
- US imports more (richer consumers).
- ↑ supply of $.
- Tendency to depreciate $.
- BUT may attract investors expecting strong returns → ↑ demand for $.
- Net effect depends.

**Political instability** abroad:
- Investors flee to safe haven (US $).
- $ appreciates.

**Examples:**
- 2022 Fed rate hikes: $ strengthened dramatically.
- 2008 financial crisis: despite originating in US, $ strengthened as safe haven.
- Brexit (2016): pound fell.

**Currency manipulation.** Some countries deliberately weaken currency to boost exports (China accused historically; less so now).

**Floating vs fixed exchange rates.**
- **Floating** (most major currencies): set by market.
- **Fixed/pegged**: government commits to specific rate (often needs reserves to defend; can break under pressure).`,
    },
  ],
  keyConcepts: [
    'BOP: current account + financial account = 0.',
    'Trade deficit doesn\'t mean "losing" — often funded by capital inflows.',
    'Exchange rate = price of one currency in another.',
    'Appreciation makes exports expensive, imports cheap.',
    'Demand for $ from foreigners (exports, US assets, interest rates).',
    'Supply of $ from Americans (imports, foreign investment).',
    'Free trade efficient overall but hurts specific workers.',
    'Tariffs/quotas protect industries but raise prices.',
    'Higher US interest rates → $ appreciates.',
    'PPP suggests currencies should equalize purchasing power (often violated short-term).',
  ],
  formulas: [
    {
      name: 'Real exchange rate',
      equation: 'Real ER = Nominal ER × (Foreign prices / Domestic prices)',
      meaning: 'Adjusts for inflation differences.',
      example: 'If US inflation > Japan, real ER may show $ weaker than nominal.',
    },
  ],
  practice: [
    {
      q: 'Fed raises US interest rates. What happens to $?',
      a: '$ appreciates. Higher rates attract foreign investors seeking yield → ↑ demand for $ → stronger $. Hurts US exports.',
    },
    {
      q: 'A 25% tariff on imported steel. Who benefits and who hurts?',
      a: 'Benefits: US steel companies (less competition), steel workers (more jobs). Hurts: US consumers and industries using steel (cars, appliances) — higher prices. Foreign producers lose market access. Often retaliation.',
    },
  ],
  pitfalls: [
    '"Trade deficit is always bad" — not necessarily. Often offset by capital inflows.',
    '"Tariffs only hurt the targeted country" — also raise prices for own consumers; provoke retaliation.',
    '"Strong currency is good" — depends. Good for travelers and importers; bad for exporters.',
  ],
};
