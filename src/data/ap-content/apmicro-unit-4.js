// AP Microeconomics Unit 4 — Imperfect Competition (15-22%)

export const APMICRO_UNIT_4 = {
  number: 4,
  title: 'Imperfect Competition',
  weight: '15-22%',
  subunits: [
    {
      code: '4.1',
      title: 'Monopoly',
      content:
`**Monopoly:** single seller of unique product with no close substitutes.

**Barriers to entry**:
- Economies of scale (natural monopoly).
- Legal (patents, licenses).
- Government grants (utility monopolies).
- Control of essential resource.
- Network effects (Facebook, eBay).

**Monopolist faces downward-sloping demand** (market demand).

**Marginal revenue < Price for monopoly.** Why? To sell one more, must cut price for ALL units, not just the new one.

**Profit max: MR = MC.** But P > MR > MC at profit-max Q.

**Compared to PC:**
- Monopoly Q lower.
- Monopoly P higher.
- Monopoly profit possible long-run (barriers prevent entry).
- Allocatively inefficient (P > MC).
- Productively inefficient (above ATC min).
- Deadweight loss (lost trades).

**Price discrimination.** Charging different prices to different buyers for same product. Increases profits if:
1. Market power (downward-sloping demand).
2. Can identify buyers with different willingness to pay.
3. Resale prevented.

Examples: student/senior discounts; airline pricing; movie matinees; coupons.

**Perfect price discrimination.** Each buyer pays max willingness to pay. Eliminates consumer surplus; maximizes producer surplus; no deadweight loss but transfers all surplus to seller.

**Government policy on monopoly:**
- **Antitrust laws** (Sherman 1890, Clayton 1914, FTC).
- Break up monopolies (AT&T 1984).
- Regulate prices (utilities).
- Allow some monopolies (patents reward innovation).`,
    },
    {
      code: '4.2',
      title: 'Monopolistic competition',
      content:
`**Monopolistic competition:** many firms, differentiated products, free entry.

**Examples:** restaurants, clothing brands, hair salons, books.

**Differentiation** sources: brand, location, quality, advertising, service.

**Each firm has slight market power** (downward demand) due to brand loyalty.

**Short run:** behaves like mini-monopoly (MR < P).
- Set MR = MC.
- Charge P from demand curve.
- May earn profit or loss.

**Long run:** entry/exit drive economic profit to zero.
- More firms enter when profits exist → demand for each firm falls.
- Firms exit when losses → remaining firms\' demand rises.
- Equilibrium: P = ATC (tangent to demand curve).

**Inefficiencies:**
- P > MC (allocative inefficiency, deadweight loss).
- Above ATC min (productive inefficiency, "excess capacity").
- Lots of similar products (real or wasteful?).

**But:** more variety, brand reputation as quality signal.

**Advertising:** central to monopolistic competition. Builds brand, differentiates, may build market power.`,
    },
    {
      code: '4.3',
      title: 'Oligopoly',
      content:
`**Oligopoly:** few firms, products may be similar or differentiated.

**Examples:** auto (Ford, GM, Toyota), airlines, soda (Coke, Pepsi), wireless (Verizon, AT&T, T-Mobile).

**Key feature:** firms are interdependent. Each firm\'s decisions depend on rivals\'.

**Strategic behavior** analyzed with **game theory**.

**Prisoner\'s dilemma.** Classic 2-player game.
- Both confess: 10 years each.
- One confesses, one doesn\'t: confessor goes free, other gets 20.
- Neither confesses: 1 year each.
- Dominant strategy: confess (regardless of other).
- Nash equilibrium: both confess (worse than both not confessing).

**Cartels.** Firms collude to act as monopoly (OPEC oil). Often unstable — each member tempted to cheat.

**Cournot model.** Firms compete on quantity. Each chooses Q assuming other\'s Q fixed.

**Bertrand model.** Firms compete on price. With identical products and constant MC, drives P to MC (like PC).

**Kinked demand curve model.** If you raise P, others don\'t follow. If you cut P, others match. Demand kinked at current price. Explains why prices "sticky" in oligopoly.

**Collusion** (explicit or tacit) often raises profits. **Illegal in US** under antitrust.

**Nash equilibrium.** Each firm\'s strategy is best response to others\'. No firm can improve unilaterally.

**Mutual deterrence** can keep oligopolies stable: "I won\'t cut prices if you don\'t."`,
    },
    {
      code: '4.4',
      title: 'Game theory and strategic behavior',
      content:
`**Game theory** models strategic interactions.

**Elements:**
- **Players**: decision makers.
- **Strategies**: possible actions.
- **Payoffs**: outcomes (utility, profits).
- **Information**: complete or incomplete.

**Dominant strategy**: best regardless of others.

**Nash equilibrium**: each player\'s strategy is best given others\'.

**Worked example: Prisoner\'s dilemma.**

|  | Player 2 cooperates | Player 2 defects |
|---|---|---|
| Player 1 cooperates | 3, 3 | 0, 5 |
| Player 1 defects | 5, 0 | 1, 1 |

- Each player\'s dominant strategy: defect.
- Nash equilibrium: both defect (1, 1).
- But cooperation would yield (3, 3) — better for both.

**Application to oligopoly:**
- Pricing wars.
- Advertising arms races.
- Capacity expansion races.
- All can result in Nash equilibria that hurt all firms.

**Repeated games.** With many rounds, cooperation can emerge (tit-for-tat strategy).

**Sequential games.** Players move in sequence; consider others\' future responses. Backward induction.

**Real applications:**
- Oligopoly pricing.
- Arms races.
- Voting.
- Negotiation.
- Trade wars.`,
    },
  ],
  keyConcepts: [
    'Monopoly: single seller, MR < P, restricts Q below efficient.',
    'Monopoly deadweight loss; allocatively and productively inefficient.',
    'Price discrimination: increases profits; eliminates DWL if perfect.',
    'Monopolistic competition: many firms, differentiated; zero long-run profit; excess capacity.',
    'Oligopoly: few firms, interdependent; analyzed via game theory.',
    'Prisoner\'s dilemma: dominant strategies → Nash equilibrium worse than cooperation.',
    'Cartels (like OPEC) often unstable due to cheating temptations.',
    'Antitrust laws prevent monopolization in US.',
  ],
  formulas: [
    {
      name: 'Profit-max rule',
      equation: 'MR = MC',
      meaning: 'Same rule for all market structures.',
      example: 'In monopoly, MR < P. In PC, MR = P.',
    },
  ],
  practice: [
    {
      q: 'A monopolist faces D: P = 100 - Q. MC = $20. Find profit-max Q.',
      a: 'TR = P × Q = (100 - Q)Q = 100Q - Q². MR = 100 - 2Q. Set MR = MC: 100 - 2Q = 20. Q = 40. P = 100 - 40 = $60. Profit per unit = 60 - 20 = $40. Total profit (excluding FC) = $1600.',
    },
  ],
  pitfalls: [
    '"Monopolies always profitable" — only if barriers to entry exist long-run.',
    '"Price discrimination is always bad" — can be neutral or even improve efficiency.',
    '"Cartels are stable" — usually unstable; cheating breaks them.',
  ],
};
