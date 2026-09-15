// AP Microeconomics Unit 2 — Supply and Demand (20-25%)

export const APMICRO_UNIT_2 = {
  number: 2,
  title: 'Supply and Demand',
  weight: '20-25%',
  subunits: [
    {
      code: '2.1',
      title: 'Demand revisited and shifts',
      content:
`**Demand shifters detailed:**

**Income:**
- Normal goods: ↑ income → ↑ D.
- Inferior goods: ↑ income → ↓ D (ramen, used clothes, public transit).

**Prices of related goods:**
- **Substitutes** (Coke/Pepsi): ↑ Coke price → ↑ Pepsi D.
- **Complements** (printers/ink): ↑ printer price → ↓ ink D.

**Tastes:** advertising, trends, news.

**Expectations:** if expect price to rise, buy now → ↑ current D.

**Number of buyers:** demographic changes (aging population).

**Cross-price elasticity:**
- > 0: substitutes.
- < 0: complements.
- 0: unrelated.`,
    },
    {
      code: '2.2',
      title: 'Supply revisited and shifts',
      content:
`**Supply shifters detailed:**

**Input prices:** wages, raw materials, energy. ↑ inputs → ↓ S.

**Technology:** improvements → ↓ cost → ↑ S.

**# of sellers:** more firms → ↑ S.

**Expectations:** future price changes affect current S.

**Government:** taxes ↓ S; subsidies ↑ S.

**Weather/natural events:** floods, droughts affect agriculture.

**Elasticity of supply** higher in long run (firms can adjust capacity).`,
    },
    {
      code: '2.3',
      title: 'Equilibrium and shifts',
      content:
`**Equilibrium changes:**

**D shifts:**
- D right: P↑, Q↑.
- D left: P↓, Q↓.

**S shifts:**
- S right: P↓, Q↑.
- S left: P↑, Q↓.

**Both shift:**
- D right, S right: Q definitely ↑; P ambiguous.
- D right, S left: P definitely ↑; Q ambiguous.
- D left, S right: P definitely ↓; Q ambiguous.
- D left, S left: Q definitely ↓; P ambiguous.

**Determine by relative magnitudes** of shifts.

**Worked examples:**

**Coffee.** Frost destroys Brazilian crop AND new health study links coffee to longevity.
- S left (less coffee).
- D right (more demand).
- P definitely up. Q ambiguous.

**Electric cars.** Battery prices fall (input ↓) AND government subsidy for EV buyers.
- S right (lower cost).
- D right (more demand).
- Q definitely up. P ambiguous (could rise if D shifts more than S).`,
    },
    {
      code: '2.4',
      title: 'Consumer and producer surplus',
      content:
`**Consumer surplus (CS).** Difference between willingness to pay and actual price.
- Area below demand curve, above market price.
- Reflects buyer benefit.

**Producer surplus (PS).** Difference between price received and minimum acceptable.
- Area above supply curve, below market price.
- Reflects seller benefit.

**Total surplus (TS) = CS + PS.** Measures total welfare.

**Market equilibrium maximizes TS** in free competitive market with no externalities.

**Effect of price controls on surplus:**

**Price ceiling (rent control)**:
- CS may rise for those who get apartment.
- CS falls for those who can\'t find one.
- PS falls.
- Total surplus falls → deadweight loss.

**Price floor (minimum wage)**:
- Workers who keep jobs benefit.
- Some lose jobs.
- Employers worse off.
- Total surplus falls.

**Taxes**:
- CS falls (higher P).
- PS falls (lower P received).
- Government gains tax revenue.
- TS = CS + PS + tax revenue - deadweight loss.
- DWL increases with tax size, decreases with inelasticity.

**Subsidies**:
- Both CS and PS rise.
- Government cost > combined benefit if causes overconsumption.`,
    },
    {
      code: '2.5',
      title: 'Price elasticity and total revenue',
      content:
`**Price elasticity** measures responsiveness.

**Calculating:**
E_d = % ΔQ / % ΔP

**Categories:**
- E < 1: inelastic.
- E = 1: unit elastic.
- E > 1: elastic.

**Total revenue** (TR = P × Q):
- Inelastic D: ↑ P → ↑ TR (Q falls less than P rises).
- Elastic D: ↑ P → ↓ TR.
- Unit elastic: ↑ P → no change in TR.

**Why businesses care.** Pricing strategy depends on elasticity.
- Inelastic goods (gasoline, medicine): can raise price without losing much sales.
- Elastic goods (specific brand sodas): hold prices to maintain market share.

**Determinants of elasticity:**
- **Availability of substitutes**: more substitutes → more elastic.
- **Necessity vs luxury**: necessities inelastic.
- **Share of budget**: bigger share → more elastic (people notice more).
- **Time horizon**: more elastic over time (adjust behavior).
- **Definition of market**: narrowly defined (Coke) more elastic than broadly (soft drinks).

**Cross-price elasticity.**
E_{xy} = % ΔQ_x / % ΔP_y
- > 0: substitutes.
- < 0: complements.

**Income elasticity.**
E_y = % ΔQ / % Δincome
- > 1: luxuries.
- 0 < E < 1: necessities (normal).
- < 0: inferior.`,
    },
    {
      code: '2.6',
      title: 'Markets in disequilibrium and reactions',
      content:
`Markets adjust when out of equilibrium:

**Surplus** (Q_s > Q_d, often above equilibrium price).
- Inventories build up.
- Sellers cut prices.
- P falls toward equilibrium.

**Shortage** (Q_d > Q_s, below equilibrium).
- Stockouts.
- Buyers bid up prices.
- Sellers raise prices.
- P rises toward equilibrium.

**Black markets.** When price controls bind, markets form outside official channels. Example: gas rationing in 1970s; ticket scalping at concerts.

**Inventory adjustments.** Firms maintain target inventory. Excess inventory → cut production. Lean inventory → expand production.

**Sticky prices.** Some prices don\'t adjust quickly (wages, contracts). Causes prolonged disequilibrium.

**Search costs.** Consumers don\'t always find best price; information costs slow adjustment.

**Speculative bubbles.** Prices rise based on expectations, not fundamentals. Eventually correct (housing crash 2008, crypto, dot-com).`,
    },
  ],
  keyConcepts: [
    'D shifters: income, related goods, tastes, expectations, # buyers.',
    'S shifters: inputs, technology, # sellers, expectations, taxes.',
    'Equilibrium effects of shifts (memorize).',
    'CS + PS = total surplus; maximized at equilibrium.',
    'Price controls create deadweight loss.',
    'Elasticity: E > 1 elastic, < 1 inelastic.',
    'Inelastic: ↑ P → ↑ TR.',
    'More substitutes → more elastic.',
  ],
  formulas: [
    {
      name: 'Cross-price elasticity',
      equation: 'E_{xy} = % ΔQ_x / % ΔP_y',
      meaning: '+ substitutes, - complements.',
      example: 'Coke price up 10%, Pepsi Q up 5%: E = 0.5 (substitutes).',
    },
  ],
  practice: [
    {
      q: 'Gasoline price rises 20%, Q falls 5%. What\'s elasticity? How does TR change?',
      a: 'E = 5/20 = 0.25. Inelastic. Inelastic D + price ↑ → TR ↑.',
    },
  ],
  pitfalls: [
    '"Tax burden falls on the side it\'s legally collected" — wrong. Tax incidence depends on elasticities.',
    '"Surplus always means good news" — surplus often means problem (oversupply).',
  ],
};
