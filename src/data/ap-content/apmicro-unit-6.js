// AP Microeconomics Unit 6 — Market Failure and Government (8-13%)

export const APMICRO_UNIT_6 = {
  number: 6,
  title: 'Market Failure and the Role of Government',
  weight: '8-13%',
  subunits: [
    {
      code: '6.1',
      title: 'Externalities',
      content:
`**Externality.** Cost or benefit affecting third parties (not buyers or sellers).

**Negative externality.** Cost imposed on others.
- Pollution from factory.
- Secondhand smoke.
- Loud music.
- Carbon emissions → climate change.

**Positive externality.** Benefit accruing to others.
- Vaccinations (herd immunity).
- Education (more informed voters, less crime).
- Research and development (knowledge spillovers).
- Bees pollinating neighbor\'s crops.

**Market failure.** With externalities, market produces wrong quantity:
- Negative externality: too much (private cost < social cost).
- Positive externality: too little (private benefit < social benefit).

**Solutions:**

**Pigouvian taxes** (named after Pigou). Tax negative externalities.
- Carbon tax for emissions.
- Cigarette taxes for health costs.
- Aligns private cost with social cost.

**Pigouvian subsidies.** Subsidize positive externalities.
- Vaccine subsidies.
- Education subsidies.
- R&D tax credits.

**Cap-and-trade.** Government sets emission cap; firms trade permits.
- EU ETS, RGGI (US Northeast).
- Lets market find cheapest reductions.

**Regulation.** Direct limits on activity.
- Emission standards on cars.
- Building codes.
- Drug bans.

**Coase Theorem** (Coase 1960). If property rights well-defined and transaction costs low, parties can negotiate efficient outcome without government. Works for small numbers; breaks down for many parties (e.g., climate change).`,
    },
    {
      code: '6.2',
      title: 'Public goods and common resources',
      content:
`Goods classified by two properties:
- **Excludable**: can prevent non-payers from using? Private goods, club goods yes; public, common no.
- **Rivalrous**: my use diminishes yours? Private, common yes; public, club no.

**Four types:**

| | Excludable | Non-excludable |
|---|---|---|
| **Rivalrous** | Private (sandwich) | Common (fish in ocean) |
| **Non-rival** | Club (cable TV) | Public (national defense) |

**Public goods.** Non-excludable + non-rivalrous.
- National defense.
- Clean air.
- Lighthouse.
- Knowledge.

**Free rider problem.** People benefit without paying → underprovision in market.

**Solutions:**
- Government provides and taxes.
- Voluntary donations (philanthropy).
- Bundling (pay for park access).

**Common resources.** Non-excludable + rivalrous.
- Ocean fish.
- Atmosphere.
- Groundwater.
- Public roads.

**Tragedy of the commons** (Hardin). Each user has incentive to over-exploit. Collective overuse → depletion.

Examples: overfishing, deforestation, pollution.

**Solutions:**
- Privatization (assign property rights).
- Government regulation (quotas, limits).
- Community management (Ostrom\'s work on local commons governance).`,
    },
    {
      code: '6.3',
      title: 'Income distribution and inequality',
      content:
`**Market produces unequal outcomes.** Some inequality inevitable; question is how much and what to do.

**Causes of income inequality:**
- Differences in education, skills.
- Inheritance and wealth.
- Discrimination.
- Geographic and industry differences.
- Luck.
- Returns to capital relative to labor.

**Measuring inequality.**

**Lorenz curve.** Cumulative % of income earned by cumulative % of population.
- Perfect equality: 45° line.
- Greater inequality: curve bows further from 45° line.

**Gini coefficient.** Ratio: 0 = perfect equality; 1 = perfect inequality.
- US Gini ~0.41 (one of highest in developed world).
- Scandinavia ~0.27.

**Why care about inequality?**
- Fairness/ethical.
- Political stability.
- Health and social outcomes (Wilkinson research).
- Economic growth (very high inequality can slow growth via reduced demand, social investment).

**Counter-arguments:**
- Inequality may incentivize effort, innovation.
- Some inequality reflects differences in productivity.
- Equality of opportunity vs equality of outcome.

**Policies that address inequality:**
- **Progressive taxation**: higher marginal rates on higher income.
- **Earned Income Tax Credit (EITC)**: subsidizes low-wage work.
- **Minimum wage** increases.
- **Education spending**.
- **Universal healthcare**.
- **Wealth taxes** (controversial).
- **Universal Basic Income (UBI)** proposals.

**Recent trends.** US inequality rose since 1980. Top 1% share of income doubled. Top 0.1% even more dramatic. Wealth even more concentrated.`,
    },
    {
      code: '6.4',
      title: 'Market failure and government intervention',
      content:
`**Market failure types:**
1. Externalities (pos and neg).
2. Public goods (free rider).
3. Common resources (tragedy of commons).
4. Information asymmetries (lemons problem, adverse selection).
5. Market power (monopoly).
6. Distribution / inequity (some say not market "failure" but ethical issue).

**Information asymmetry examples:**
- **Used car market**: seller knows quality; buyer doesn\'t. Quality cars stay off market; "lemons" dominate.
- **Insurance**: high-risk people more likely to buy; insurer can\'t distinguish → premiums rise → low-risk leave.
- **Job market**: employer can\'t see worker quality directly. Signaling (education) helps.

**Government solutions:**
- Disclosure requirements (drugs, securities, food labels).
- Lemon laws.
- Mandatory health insurance.
- Antitrust.
- Patent system.

**Government failure.** Government interventions can also fail:
- Bureaucratic inefficiency.
- Rent-seeking (lobbyists capturing benefits).
- Time inconsistency (politicians prioritize short-term).
- Limited information.
- Unintended consequences.

**Cost-benefit analysis.** Compare intervention costs to benefits. Often controversial (how to value life, environment?).`,
    },
    {
      code: '6.5',
      title: 'Taxes and economic efficiency',
      content:
`**Taxes** raise revenue but distort markets.

**Tax incidence.** Who pays the tax (often not who writes the check).
- Inelastic side bears more.
- Inelastic demand (essential goods): consumers pay most.
- Inelastic supply (housing): sellers pay most.

**Deadweight loss.** Mutually beneficial trades that don\'t happen because of tax. Triangle in S-D diagram.

**Excess burden.** DWL is excess burden of taxation.

**Tax structures:**
- **Progressive**: higher rate on higher income (US income tax).
- **Proportional/flat**: same rate (10% sales tax).
- **Regressive**: lower rate on higher income (Social Security tax capped; sales tax effectively).

**Tax bases:**
- **Income tax** (federal, most states).
- **Payroll tax** (Social Security, Medicare).
- **Sales tax** (states).
- **Property tax** (local).
- **Corporate tax**.
- **Excise tax** (gas, cigarettes, alcohol).
- **Tariffs** (imports).
- **Carbon tax** (proposed; some countries have).

**Laffer curve.** Tax revenue rises then falls as tax rate increases. Beyond peak, higher rates reduce revenue (discourage work/investment). Debated where US is on curve.

**Optimal taxation.** Balance revenue with distortion minimization.
- Tax inelastic things (Pigouvian on externalities; land).
- Avoid taxing things you want more of (capital, labor).
- Broad bases, low rates often efficient.`,
    },
  ],
  keyConcepts: [
    'Externalities cause market failure (under/over provision).',
    'Pigouvian taxes and subsidies correct externalities.',
    'Public goods (national defense): non-excludable, non-rival. Free rider problem.',
    'Common resources: tragedy of commons.',
    'Information asymmetry: lemons problem.',
    'Antitrust prevents monopolization.',
    'Lorenz curve and Gini coefficient measure inequality.',
    'US: among highest inequality in developed world.',
    'Progressive (income tax), proportional, regressive (sales tax) structures.',
    'Tax incidence falls more on inelastic side.',
    'Laffer curve: high rates can reduce revenue.',
  ],
  formulas: [
    {
      name: 'Tax incidence',
      equation: 'Inelastic side bears more of tax',
      meaning: 'Demand elastic = sellers pay more; demand inelastic = buyers.',
      example: 'Gasoline tax: demand inelastic → consumers pay most.',
    },
  ],
  practice: [
    {
      q: 'A factory pollutes a river. Market produces too much steel. What policy could correct?',
      a: 'Pigouvian tax on pollution (or cap-and-trade); aligns private cost with social cost. Steel firms reduce production toward socially efficient level.',
    },
  ],
  pitfalls: [
    '"Government intervention is always better than market failure" — government can also fail.',
    '"Public goods include things government provides" — definition is non-excludable + non-rival, not "from government."',
  ],
};
