// AP Macro Unit 3 — National Income and Price Determination (17-27%)

export const APMACRO_UNIT_3 = {
  number: 3,
  title: 'National Income and Price Determination',
  weight: '17-27%',
  subunits: [
    {
      code: '3.1',
      title: 'Aggregate Demand (AD)',
      content:
`**Aggregate Demand (AD).** Total quantity of goods and services demanded at each price level.

**AD = C + I + G + (X - M)** — same as GDP formula, but viewed at different price levels.

**AD curve slopes downward** because:
- **Wealth effect**: ↑ price level → real value of money holdings ↓ → less consumption.
- **Interest rate effect**: ↑ prices → demand for money ↑ → interest rates ↑ → less investment/consumption.
- **Exchange rate effect**: ↑ US prices → exports more expensive → ↓ X, ↑ M.

**AD shifters:**
- **C ↑**: more consumer wealth, confidence; lower taxes; lower interest rates.
- **I ↑**: business optimism; lower interest rates; tax incentives.
- **G ↑**: government spending up.
- **NX ↑**: foreign income up; weaker dollar.

**AD shifts right** = aggregate demand increases at every price level.
**AD shifts left** = aggregate demand decreases.

**Multiplier effect.** Initial spending change ripples through economy.
- Multiplier = 1 / (1 - MPC) = 1 / MPS.
- MPC (marginal propensity to consume): fraction of additional income spent.
- MPS (marginal propensity to save) = 1 - MPC.

**Example.** MPC = 0.8. Multiplier = 5. $100B in new gov spending → $500B in increased GDP.

**Tax multiplier** = -MPC/MPS (smaller in magnitude). Tax cut of $100B with MPC = 0.8 → $400B GDP increase.`,
    },
    {
      code: '3.2',
      title: 'Aggregate Supply (AS)',
      content:
`**Short-Run Aggregate Supply (SRAS).** Output supplied at each price level, in short run.

**SRAS slopes upward** (in short run):
- Some prices/wages "sticky" (don\'t adjust immediately).
- Firms with higher prices → higher profits → produce more.
- Workers don\'t demand wage increases immediately.

**SRAS shifters:**
- **Input prices** (wages, raw materials, energy).
- **Productivity** (technology).
- **Subsidies/taxes on production**.
- **Inflationary expectations**.
- **Supply shocks** (oil prices, weather, COVID).

**Long-Run Aggregate Supply (LRAS).** Vertical at full-employment GDP (Y_F).

**Why vertical in long run?** Prices and wages fully adjust. Output depends on real factors:
- Resources (land, labor, capital).
- Technology.
- Education.

**LRAS shifts when:**
- Population grows.
- Capital stock grows.
- Technology improves.
- Education/skills improve.
- Resources discovered.

These are the same factors that shift the PPC outward.`,
    },
    {
      code: '3.3',
      title: 'AD-AS equilibrium',
      content:
`**Macroeconomic equilibrium** where AD = SRAS = LRAS.

**Three possible scenarios:**

**Long-run equilibrium**: AD intersects SRAS exactly at LRAS. Output at Y_F. No inflationary/deflationary pressure.

**Recessionary gap**: equilibrium below Y_F. Cyclical unemployment. AD too low; need stimulus.

**Inflationary gap**: equilibrium above Y_F. Economy overheated; inflation pressure builds. Need contractionary policy.

**Self-correction (long-run):**
- Recessionary gap → wages eventually fall → SRAS shifts right → return to Y_F (at lower price level).
- Inflationary gap → wages eventually rise → SRAS shifts left → return to Y_F (at higher price level).

**Keynesian critique.** Self-correction can take very long (Great Depression lasted decade). Better to use policy.

**Shifts to AD/AS:**
- Demand shock (consumer spending crash): AD left → recessionary gap + lower price.
- Positive supply shock (cheap oil): SRAS right → output up, prices down.
- Negative supply shock (oil crisis): SRAS left → output down, prices up (stagflation).

**Stagflation.** High unemployment + high inflation. Caused by adverse supply shock. 1970s US. Hard for traditional policy.`,
    },
    {
      code: '3.4',
      title: 'Fiscal policy',
      content:
`**Fiscal policy.** Changes in government spending (G) or taxes (T) to influence economy.

**Expansionary fiscal policy** (boosts AD):
- Increase G.
- Decrease T (more disposable income → ↑ C).
- Use when recession; close recessionary gap.

**Contractionary fiscal policy** (slows AD):
- Decrease G.
- Increase T.
- Use when overheating; close inflationary gap.

**Budget:**
- Surplus: T > G.
- Deficit: G > T.
- National debt = accumulated deficits.

**Automatic stabilizers** (built-in):
- Progressive income tax: revenue falls more than proportionately in recession.
- Unemployment insurance: spending rises in recession.
- Reduces severity of cycles without active policy.

**Discretionary fiscal policy.** Deliberate changes to G or T.

**Examples:**
- **2008-2009**: Obama stimulus ($800B) in response to Great Recession.
- **2020-2021**: COVID relief (~$5T across CARES Act, ARPA).
- **2017**: Trump tax cuts (largely permanent corporate cut).

**Limitations of fiscal policy:**
- **Time lags**: recognition, decision, implementation.
- **Crowding out**: government borrowing pushes up interest rates → ↓ private investment.
- **Political constraints**: hard to raise taxes; deficits grow.
- **Multiplier effects**: smaller than theory if MPC overestimated.

**Long-run debt concerns.** Persistent deficits → growing debt → potential interest rate pressure, future tax increases.`,
    },
    {
      code: '3.5',
      title: 'Money market and monetary policy',
      content:
`**Money** serves three functions: medium of exchange, unit of account, store of value.

**Money supply measures:**
- **M1**: currency + checking deposits + traveler\'s checks.
- **M2**: M1 + savings deposits + small time deposits + money market funds.

**Demand for money.**
- **Transaction demand**: for buying things.
- **Precautionary demand**: emergencies.
- **Speculative demand**: holding for investment opportunities.

Higher interest rates make holding money costly (lost interest on alternatives). So MD slopes downward.

**Money market equilibrium.** MD intersects MS at equilibrium nominal interest rate.

**Federal Reserve** ("the Fed") controls money supply.

**Three main tools:**

**(1) Open Market Operations.** Most used.
- Buy bonds → increases MS (money flows from Fed to banks).
- Sell bonds → decreases MS.

**(2) Reserve requirements.** % of deposits banks must hold (rarely changed).

**(3) Discount rate.** Rate Fed charges banks for short-term loans. Higher → banks borrow less → less lending.

**Federal funds rate.** Rate banks charge each other for overnight loans. Fed targets this through open market operations.

**Monetary policy types:**
- **Expansionary**: ↑ MS, ↓ interest rates → ↑ I, ↑ C → ↑ AD. Used in recession.
- **Contractionary**: ↓ MS, ↑ interest rates → ↓ I, ↓ C → ↓ AD. Used to fight inflation.`,
    },
    {
      code: '3.6',
      title: 'Phillips Curve',
      content:
`**Phillips Curve** shows inverse relationship between unemployment and inflation (in short run).

**Original** (1958, A.W. Phillips): UK data showed lower unemployment → higher inflation.

**Short-run Phillips Curve (SRPC)** downward sloping. Trade-off:
- To reduce unemployment below natural rate, accept higher inflation.
- To reduce inflation, accept higher unemployment.

**Long-run Phillips Curve (LRPC)** vertical at natural rate of unemployment.

**Implication.** In long run, no trade-off — only natural rate prevails.

**Stagflation (1970s).** Phillips Curve seemed to break. High inflation + high unemployment simultaneously. Caused by adverse supply shocks (oil) shifting SRPC outward.

**Volcker disinflation (early 1980s).** Fed Chair Paul Volcker raised interest rates to 19% → caused deep recession → squeezed inflation out. Painful but worked.

**Modern Phillips Curve** is flatter than in the past — unemployment changes have smaller effect on inflation. Reasons debated:
- Globalization (foreign competition limits price rises).
- Decline of unions.
- Better inflation expectations.

**Adaptive vs rational expectations.**
- **Adaptive**: people base expectations on past.
- **Rational**: people use all available information.
- If rational, Fed credibility matters for managing inflation.

**Trade-off summary.**
- Short run: trade-off exists (SRPC).
- Long run: no trade-off (LRPC vertical).
- Credibility/expectations are key.`,
    },
  ],
  keyConcepts: [
    'AD = C + I + G + (X-M); slopes downward.',
    'SRAS slopes upward (sticky prices); LRAS vertical at Y_F.',
    'Multiplier = 1/(1-MPC) = 1/MPS.',
    'Recessionary gap (output below Y_F); inflationary gap (above).',
    'Fiscal policy: G + T. Expansionary closes recessionary gap.',
    'Monetary policy: Fed adjusts MS via open market operations, reserve requirements, discount rate.',
    'Phillips Curve: inverse U-inflation in short run; vertical in long run.',
    'Stagflation = supply shock; combines high U + high I.',
  ],
  formulas: [
    {
      name: 'Multiplier',
      equation: 'k = 1 / (1 - MPC) = 1 / MPS',
      meaning: 'Initial spending change → larger change in GDP.',
      example: 'MPC = 0.8 → multiplier = 5. $100B stimulus → $500B GDP increase.',
    },
    {
      name: 'Tax multiplier',
      equation: 'Tax multiplier = -MPC / MPS',
      meaning: 'Smaller in magnitude than spending multiplier (because of leak via savings).',
      example: 'MPC = 0.8: tax multiplier = -4. $100B tax cut → $400B GDP rise.',
    },
  ],
  practice: [
    {
      q: 'MPC = 0.75. Government spending up $100 billion. Estimate effect on GDP.',
      a: 'Multiplier = 1/(1-0.75) = 4. ΔGDP = 4 × $100B = $400B.',
    },
    {
      q: 'What happens to AD and price level if Fed cuts interest rates?',
      a: 'Lower interest rates → ↑ investment, ↑ consumer spending (on credit). AD shifts right. Price level rises; real GDP rises (in short run).',
    },
  ],
  pitfalls: [
    '"Fiscal and monetary policy are the same" — fiscal = G + T (Congress). Monetary = MS + interest rates (Fed).',
    '"Multiplier always 1/(1-MPC)" — that\'s simple version. Real multipliers smaller (leaks via savings, taxes, imports).',
    '"Phillips curve is fixed" — shifts with expectations and supply shocks.',
  ],
};
