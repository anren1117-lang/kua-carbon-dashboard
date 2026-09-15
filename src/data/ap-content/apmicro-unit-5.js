// AP Microeconomics Unit 5 — Factor Markets (10-13%)

export const APMICRO_UNIT_5 = {
  number: 5,
  title: 'Factor Markets',
  weight: '10-13%',
  subunits: [
    {
      code: '5.1',
      title: 'Introduction to factor markets',
      content:
`**Factor markets** trade inputs (labor, land, capital) rather than final goods.

**Demand for factors is DERIVED** from demand for the goods they help produce.
- Demand for software engineers comes from demand for software.
- Demand for steel comes from demand for cars, buildings.

**Why study?** Distribution of income depends on factor markets:
- Wages from labor markets.
- Rent from land markets.
- Interest from capital markets.
- Profit from entrepreneurship.`,
    },
    {
      code: '5.2',
      title: 'Marginal Revenue Product (MRP)',
      content:
`**MRP of labor (MRPL).** Additional revenue from hiring one more worker.

MRPL = MPL × MR

In perfect competition: MR = P, so MRPL = MPL × P.

**Firm hires labor up to: MRPL = MRC (marginal resource cost)** (= wage in competitive labor market).

**Worked example.**
- Worker MPL = 5 widgets/hour.
- P of widget = $4.
- MRPL = 5 × 4 = $20/hour.
- Hire if wage ≤ $20.

**Demand curve for labor = MRPL curve.** Downward-sloping due to diminishing MPL.

**Shifts in labor demand:**
- ↑ Demand for product → ↑ P → ↑ MRPL → ↑ labor demand.
- ↑ Worker productivity → ↑ MRPL → ↑ labor demand.
- ↑ Capital/technology that complements workers → ↑ labor demand.
- ↑ Capital/technology that substitutes workers → ↓ labor demand.`,
    },
    {
      code: '5.3',
      title: 'Labor supply and equilibrium',
      content:
`**Labor supply.** Workers willing to work at various wages.

**Generally upward-sloping**: higher wage → more workers willing.

**Backward-bending labor supply** at very high wages: workers may choose more leisure (income effect dominates substitution effect).

**Shifts in labor supply:**
- Population.
- Immigration.
- Wages in other industries (substitutes).
- Labor force participation rates (women, retirees).
- Non-monetary aspects (working conditions, prestige).

**Labor market equilibrium.** Wage = where labor supply meets labor demand.

**Monopsony.** Single buyer of labor (mining town with one employer). Wages below competitive level; fewer hired.

**Unions.** Counter monopsony power; bargain for higher wages and better conditions.

**Minimum wage.** Price floor. If above equilibrium → labor surplus (unemployment).
- Debate: how much disemployment? Empirical research mixed.
- Higher in monopsony markets without major job loss.

**Discrimination.** Wage differences not explained by productivity. Reduces efficiency and is illegal (Title VII, Equal Pay Act).`,
    },
    {
      code: '5.4',
      title: 'Capital and land markets',
      content:
`**Capital market** trades financial capital (loans for buying physical capital).
- **Interest rate** = price of borrowing.
- Investment decision: undertake if expected return > interest rate.
- Present value: PV = FV / (1+r)^n.

**Marginal Revenue Product of Capital (MRPK)**. Like MRPL but for capital.
- Firms invest in capital up to MRPK = rental rate of capital.

**Land market.**
- Land is fixed in supply (perfectly inelastic).
- Rent determined by demand (Henry George\'s observation about urban land).
- Property taxes considered relatively efficient (don\'t distort supply).

**Income distribution.** Factor markets determine who earns what.
- US wage gap by education widened since 1980.
- Capital share of income up; labor share down.
- Productivity-wage gap discussed in econ literature.`,
    },
    {
      code: '5.5',
      title: 'Optimal use of inputs',
      content:
`Firms choose input mix to minimize cost for given output.

**Cost-minimization condition:**
MP_L / wage = MP_K / rental rate

(Marginal product per dollar should equal across inputs.)

**Worked example.**
- MP_L = 100, wage = $20 → MP_L / w = 5.
- MP_K = 30, rental = $10 → MP_K / r = 3.
- Should hire more labor (more output per dollar).
- Continue until ratios equal.

**Profit max condition:**
MRP / input price = 1 for each input.

OR: MRP_L = wage AND MRP_K = rental rate.

**Long-run input mix** can change as technology evolves.
- Automation: substitute capital for labor.
- Computers replaced calculators, then accountants partially.
- AI now affecting many cognitive jobs.`,
    },
  ],
  keyConcepts: [
    'Factor demand is derived from product demand.',
    'MRPL = MPL × MR. Firms hire until MRPL = wage.',
    'Labor supply usually upward; may bend backward at very high wages.',
    'Monopsony: single buyer; wages below competitive.',
    'Unions: collective bargaining; can counter monopsony.',
    'Minimum wage: price floor; debates on job effects.',
    'Capital market: interest rate is price.',
    'Land: fixed supply → rent determined by demand.',
    'Cost min: MP/price equal across inputs.',
  ],
  formulas: [
    {
      name: 'MRPL',
      equation: 'MRPL = MPL × MR  (= MPL × P in PC)',
      meaning: 'Additional revenue from one more worker.',
      example: 'MPL = 4 units/hr, P = $5 → MRPL = $20/hr.',
    },
  ],
  practice: [
    {
      q: 'A worker\'s MPL is 8 units/hour. Output sells for $10. Worker should be hired if wage is below what?',
      a: 'MRPL = 8 × 10 = $80/hr. Hire if wage ≤ $80.',
    },
  ],
  pitfalls: [
    '"Demand for workers is direct" — wrong. It\'s derived from product demand.',
    '"Minimum wage always causes unemployment" — empirically nuanced; depends on monopsony, elasticity.',
  ],
};
