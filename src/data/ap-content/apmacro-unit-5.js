// AP Macro Unit 5 — Long-Run Consequences of Stabilization Policies (20-30%)

export const APMACRO_UNIT_5 = {
  number: 5,
  title: 'Long-Run Consequences of Stabilization Policies',
  weight: '20-30%',
  subunits: [
    {
      code: '5.1',
      title: 'Fiscal and monetary policy actions',
      content:
`When economy struggles, government and Fed can act.

**Recessionary gap** (Y < Y_F, high unemployment):
- Fiscal: ↑ G, ↓ T → ↑ AD.
- Monetary: ↓ interest rates → ↑ I, ↑ C → ↑ AD.

**Inflationary gap** (Y > Y_F, overheating):
- Fiscal: ↓ G, ↑ T → ↓ AD.
- Monetary: ↑ interest rates → ↓ AD.

**Policy mix** affects long-run outcomes.

**Limitations and lags:**
- **Recognition lag**: takes time to realize a recession started.
- **Decision lag**: Congress slow; Fed faster.
- **Implementation lag**: rolling out spending or tax changes.
- **Impact lag**: effects take time to ripple through.

**Monetary policy** generally has shorter lag than fiscal.

**Counter-cyclical** policy: lean against business cycle.
**Pro-cyclical** policy: reinforces cycle (rare; usually mistake).

**Examples in practice:**
- **2009 ARRA**: $800B stimulus (Obama) — fiscal expansion in recession.
- **2017 TCJA**: tax cuts — but in expansion, criticized as pro-cyclical.
- **2020 COVID response**: massive fiscal + monetary expansion.
- **2022-23**: monetary tightening to fight post-COVID inflation.`,
    },
    {
      code: '5.2',
      title: 'Crowding out',
      content:
`**Crowding out.** Government borrowing pushes up interest rates → reduces private investment.

**Mechanism:**
1. Government runs deficit (G > T).
2. Government sells bonds to finance deficit.
3. More bond supply → bond prices fall → interest rates rise.
4. Higher rates → less private investment, less consumer borrowing.
5. Some of the fiscal stimulus offset by lower private spending.

**Severity:** Disputed. More important when economy near full employment; less in deep recession.

**Crowding out chart.** Loanable funds market.
- Demand for funds (from borrowers): downward.
- Supply of funds (from savers): upward.
- Equilibrium: real interest rate.
- Gov borrowing shifts demand right → higher rate → less private borrowing.

**Counterargument: crowding in.** In recession, fiscal stimulus → ↑ economic activity → ↑ business confidence → ↑ private investment (rather than crowd out).

**Modern context.** US ran historically high deficits during COVID with low interest rates (Fed kept rates near zero). Crowding out modest. Now interest rates higher, debt service rising.`,
    },
    {
      code: '5.3',
      title: 'Economic growth — long-run',
      content:
`**Economic growth** = increase in real GDP per capita over time.

**Sources of growth:**
- **Physical capital** (factories, machines).
- **Human capital** (education, skills).
- **Natural resources**.
- **Technology**.

**Solow growth model.** Capital accumulation matters but with diminishing returns. Long-run growth comes from technology.

**Endogenous growth theory.** Technology and ideas drive sustained growth. Innovation requires R&D investment.

**Examples:**
- Industrial Revolution (1700s): technological breakthroughs (steam, factories).
- 20th century: assembly line, electricity, computers.
- 21st century: information technology, AI.

**Productivity** = output per worker per hour. Long-run growth driver.

**Policies that promote growth:**
- Investment in education.
- R&D spending and tax credits.
- Infrastructure.
- Property rights, rule of law.
- Stable macroeconomic environment.
- Openness to trade.

**Convergence hypothesis.** Poorer countries should catch up with richer (diminishing returns to capital). Mixed empirical evidence.

**Rule of 72:** doubling time = 72 / growth rate.
- 2% growth: doubles in 36 years.
- 4% growth: doubles in 18 years.
- Compound growth is powerful over decades.`,
    },
    {
      code: '5.4',
      title: 'Public policy and economic growth',
      content:
`Government can promote (or hinder) growth.

**Pro-growth policies:**
- **Infrastructure**: roads, internet, schools.
- **Education**: human capital.
- **R&D**: tax credits, federal funding (NSF, NIH).
- **Property rights, rule of law**: predictable environment.
- **Trade openness**: gains from specialization.
- **Stable macro environment**: low/predictable inflation.
- **Open immigration**: brings talent, expands labor force.

**Anti-growth policies:**
- Excessive regulation that stifles innovation.
- Trade barriers (tariffs, quotas).
- Corruption.
- Confiscatory taxation.
- High and unpredictable inflation.

**Trade-offs.**
- Higher taxes for social programs vs higher growth?
- Environmental regulation vs growth?
- Inequality vs growth incentives?

**Modern debates:**
- Climate change: trade-off or alignment with growth?
- Industrial policy: subsidize specific industries?
- Antitrust: encourage competition?
- Universal Basic Income: enable risk-taking or discourage work?

**Cross-country evidence.** Strong correlation between:
- Education + growth.
- Institutions + growth.
- Openness + growth.

But correlation ≠ causation. Many confounders.`,
    },
    {
      code: '5.5',
      title: 'Inflation, unemployment, and growth',
      content:
`Long-run goals: stable prices + low unemployment + high growth.

**Are these consistent?**
- Long-run Phillips Curve says no inflation-unemployment trade-off in long run.
- Modern view: stable, low inflation is best environment for growth.
- High inflation destroys savings, distorts investment, creates uncertainty.

**Disinflation costs.**
- Reducing inflation requires temporary recession (Volcker 1980-82).
- Sacrifice ratio: % GDP lost per 1% inflation reduction.
- US: roughly 2-5 (each 1% disinflation costs 2-5% GDP).

**Costs of high inflation:**
- Menu costs (changing price tags).
- Shoe-leather costs (going to bank often).
- Tax distortions (taxes on nominal gains).
- Uncertainty → reduced investment.
- Redistribution from savers to borrowers.

**Deflation can be worse:**
- People delay spending (will be cheaper).
- Real interest rates rise.
- Debt burden grows.
- Japan\'s "lost decades" (1990s-2010s).

**Hyperinflation.** Catastrophic. Destroys currency, savings, investment.

**Long-run growth requires:**
- Productive investment.
- Human capital.
- Stable monetary environment.
- Strong institutions.`,
    },
  ],
  keyConcepts: [
    'Expansionary policy for recession; contractionary for overheating.',
    'Policy lags reduce effectiveness.',
    'Crowding out: government borrowing raises interest rates.',
    'Economic growth = increase in real GDP per capita.',
    'Long-run growth from capital + human capital + technology.',
    'Pro-growth policies: education, R&D, property rights, trade.',
    'Stable low inflation is best growth environment.',
    'Hyperinflation and deflation both destroy growth.',
    'Volcker disinflation shows costs of fighting inflation.',
  ],
  formulas: [
    {
      name: 'Real GDP per capita growth',
      equation: 'Growth = (Real GDP / Population) increase per year',
      meaning: 'Best single measure of standard of living over time.',
      example: 'US has averaged ~2% real GDP per capita growth for 150 years → ~20x living standard since 1900.',
    },
  ],
  practice: [
    {
      q: 'Why does monetary policy generally have a shorter lag than fiscal policy?',
      a: 'Fed decides quickly (8 meetings/year, plus emergency). Fiscal requires Congress + President, often months/years. Implementation lag also shorter (interest rate changes immediately; tax changes phase in).',
    },
    {
      q: 'What\'s the doubling time for GDP if growth is 3.5%?',
      a: 'Rule of 72: 72/3.5 ≈ 20.5 years.',
    },
  ],
  pitfalls: [
    '"Crowding out happens always" — depends on economy state. Less impactful in recession.',
    '"Growth equals zero-sum" — wrong; technological gains are non-rivalrous (one country\'s innovation can help all).',
    '"Lower taxes always increase growth" — depends on level and type of tax. Some taxes (lump-sum) less distortionary.',
  ],
};
