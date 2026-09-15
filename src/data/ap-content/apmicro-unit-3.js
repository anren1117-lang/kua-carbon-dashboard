// AP Microeconomics Unit 3 — Production, Cost, and Perfect Competition (22-25%)

export const APMICRO_UNIT_3 = {
  number: 3,
  title: 'Production, Cost, and the Perfect Competition Model',
  weight: '22-25%',
  subunits: [
    {
      code: '3.1',
      title: 'Production function and short vs long run',
      content:
`**Production function.** Relationship between inputs and output.
Q = f(L, K, ...)

**Short run.** At least one input fixed (often capital).
**Long run.** All inputs variable.

**Marginal product of labor (MPL).** Extra output from one more worker.

**Diminishing marginal returns.** As you add workers to fixed capital, eventually each adds less output.

**Worked example.** A pizza shop has 1 oven.
- 1 worker: 10 pizzas.
- 2 workers: 18 (MP = 8).
- 3 workers: 24 (MP = 6).
- 4 workers: 28 (MP = 4).
- 5 workers: 30 (MP = 2).
- 6 workers: 28 (MP = -2; getting in each other\'s way).

**Returns to scale (long run).**
- **Increasing**: doubling inputs more than doubles output. Cost per unit ↓.
- **Constant**: doubling inputs doubles output.
- **Decreasing**: doubling inputs less than doubles output. Cost per unit ↑.`,
    },
    {
      code: '3.2',
      title: 'Costs of production',
      content:
`**Total cost = Fixed cost + Variable cost.**

**Fixed cost (FC):** doesn\'t change with output (rent, insurance).
**Variable cost (VC):** changes with output (materials, labor).

**Average cost:**
- **ATC** (average total cost) = TC / Q.
- **AFC** (average fixed cost) = FC / Q. Falls as Q rises (spread over more units).
- **AVC** (average variable cost) = VC / Q.

**Marginal cost (MC).** Cost of one more unit. MC = ΔTC / ΔQ.

**Cost curves typical shape.**
- AFC: continuously decreasing (hyperbolic).
- AVC: U-shaped.
- ATC: U-shaped (AVC + AFC).
- MC: rises with output; cuts AVC and ATC at their minimums.

**MC and AC relationship:**
- MC < AC → AC falling.
- MC > AC → AC rising.
- MC = AC at AC minimum.

**Economies of scale** (long run). ATC falls as firm grows (fixed costs spread, specialization). Why bigger firms can charge lower prices.

**Diseconomies of scale.** ATC eventually rises if too big (communication breaks down, bureaucracy).

**Minimum efficient scale (MES).** Output level at which long-run ATC stops falling. Determines industry structure (large MES = few large firms).`,
    },
    {
      code: '3.3',
      title: 'Profit and loss',
      content:
`**Profit = Total Revenue - Total Cost.**

**Two types of cost:**
- **Explicit**: actual payments.
- **Implicit**: opportunity costs of own resources (foregone salary, foregone interest).

**Accounting profit** = Revenue - explicit costs.
**Economic profit** = Revenue - explicit - implicit costs.

Economic profit lower; can be zero or negative even if accounting profit positive.

**Normal profit** = zero economic profit. Owner earning exactly the opportunity cost of their resources.

**Worked example.** You quit a $50k job to start a business.
- Revenue: $100k.
- Explicit costs (rent, materials): $40k.
- Implicit costs (your foregone salary): $50k.
- Accounting profit = $60k. Economic profit = $10k.

If business yielded only $80k revenue:
- Accounting profit = $40k.
- Economic profit = -$10k (losing money compared to alternative).

**Decision rules:**
- Accounting profit > 0 in short run: keep operating (covering at least some costs).
- Economic profit > 0: continue in long run (best use of resources).
- Economic profit < 0 (long run): exit.`,
    },
    {
      code: '3.4',
      title: 'Perfect competition',
      content:
`**Perfect competition** assumes:
1. Many small buyers and sellers.
2. Homogeneous (identical) products.
3. Free entry and exit.
4. Perfect information.
5. Price takers — no individual influences price.

**Each firm faces a horizontal (perfectly elastic) demand curve** at market price.
- Can sell any quantity at market price.
- Can\'t charge more (would lose all customers).

**Firm\'s revenue:**
- TR = P × Q.
- AR = P (constant).
- MR = P (constant — every extra unit sells at P).

**Profit maximization rule (universal):**
MR = MC

For perfect competition: P = MR = MC at profit-max output.

**Profit calculation:**
- Profit per unit = P - ATC at chosen Q.
- Total profit = (P - ATC) × Q.

**Three short-run scenarios:**
- **Profit**: P > ATC.
- **Break-even**: P = ATC (normal profit).
- **Loss**: P < ATC.

**Shutdown rule.**
- Operate if P ≥ AVC (cover variable costs).
- Shutdown if P < AVC.
- Always keep paying fixed costs (already committed).

**Supply curve** (short run): MC above AVC minimum.

**Long-run equilibrium** in perfect competition.
- New firms enter when profits exist; supply rises; price falls.
- Firms exit when losses; supply falls; price rises.
- Equilibrium: P = MC = ATC. Zero economic profit.

**Efficiency in perfect competition:**
- **Allocative efficient**: P = MC. Right amount produced.
- **Productive efficient**: P = ATC minimum. Most efficient scale.`,
    },
    {
      code: '3.5',
      title: 'Long-run equilibrium and entry/exit',
      content:
`**Long run** allows entry and exit.

**Process:**
- Profits → firms enter → S right → P falls → profits shrink to zero.
- Losses → firms exit → S left → P rises → losses shrink to zero.
- Equilibrium when P = ATC_min (zero economic profit).

**Constant cost industry.** Long-run supply horizontal at min ATC. Entry doesn\'t affect input prices.

**Increasing cost industry.** Entry bids up input prices. Long-run supply slopes upward.

**Decreasing cost industry.** Entry leads to input cost reductions (rare). Long-run supply slopes down.

**Implications:**
- Perfect competition is most efficient market structure.
- Maximum total surplus.
- No firm can earn long-run economic profit.
- Provides benchmark for evaluating other markets.

**Critique.** Real-world markets rarely perfectly competitive. Even close approximations (agriculture, currency exchange) have imperfections.`,
    },
  ],
  keyConcepts: [
    'Production function: output from inputs.',
    'Short run: some inputs fixed. Long run: all variable.',
    'Diminishing marginal returns to variable input.',
    'TC = FC + VC; ATC = TC/Q; MC = ΔTC/ΔQ.',
    'MC cuts AVC, ATC at minimums.',
    'Economic profit subtracts opportunity costs.',
    'Perfect competition: many firms, homogeneous product, free entry.',
    'Profit max: MR = MC.',
    'PC firm: P = MR (price taker).',
    'Long-run PC: zero economic profit.',
  ],
  formulas: [
    {
      name: 'Profit maximization',
      equation: 'MR = MC',
      meaning: 'Produce one more if MR ≥ MC; stop when MR < MC.',
      example: 'PC firm: P = MR; produce until P = MC.',
    },
    {
      name: 'Shutdown rule',
      equation: 'Operate if P ≥ AVC',
      meaning: 'Cover variable costs. Below AVC, lose money on every unit.',
      example: 'P = $5, AVC = $4: operate (revenue exceeds VC).',
    },
  ],
  practice: [
    {
      q: 'Perfect comp firm: P = $10, MC = $8 at Q=100. Profit max?',
      a: 'No. MR (= P = 10) > MC (= 8). Produce more until P = MC.',
    },
  ],
  pitfalls: [
    '"Accounting and economic profit same" — economic includes opportunity costs.',
    '"Shutdown when losing money" — sometimes operate to cover variable costs.',
  ],
};
