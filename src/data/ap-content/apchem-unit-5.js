// AP Chemistry Unit 5 — Kinetics (7-9%)

export const APCHEM_UNIT_5 = {
  number: 5,
  title: 'Kinetics',
  weight: '7-9%',
  subunits: [
    {
      code: '5.1',
      title: 'Reaction rates',
      content:
`**Reaction rate** = how fast reactants are consumed (or products formed) per unit time. Units: M/s (mol/L/s) typically.

**Average rate** over an interval Δt:
rate = -Δ[reactant]/Δt = +Δ[product]/Δt

The negative sign on reactants makes rate positive (reactants decrease).

**Instantaneous rate** = slope of concentration-vs-time curve at one moment.

**Initial rate** = rate immediately after reaction starts. Easiest to measure and least complicated by reverse reaction or product effects.

**Rate using stoichiometry.** For aA + bB → cC + dD:
rate = -(1/a) d[A]/dt = -(1/b) d[B]/dt = +(1/c) d[C]/dt = +(1/d) d[D]/dt

The coefficient division normalizes rate by stoichiometry.

**What affects reaction rate?**
1. **Concentration** of reactants (more particles → more collisions).
2. **Temperature** (faster particles, more energy to overcome activation barrier).
3. **Surface area** (heterogeneous reactions).
4. **Catalysts** (lower activation energy).
5. **Pressure** for gas-phase reactions.`,
    },
    {
      code: '5.2',
      title: 'Rate law',
      content:
`**Rate law** expresses rate as a function of reactant concentrations.

For aA + bB → products:
rate = k[A]^m [B]^n

- k = rate constant (depends on T).
- m, n = reaction orders (must be determined experimentally; NOT the same as coefficients a, b).
- Overall order = m + n.

**Common orders:**
- Zero-order: rate independent of [A]. rate = k.
- First-order: rate ∝ [A]. rate = k[A].
- Second-order: rate ∝ [A]². rate = k[A]².

**Units of k** depend on overall order:
- Zero: M/s
- First: 1/s (s⁻¹)
- Second: 1/(M·s) (M⁻¹s⁻¹)

**Determining rate law experimentally.** Method of initial rates:
1. Run experiments varying one [reactant] at a time.
2. See how rate changes.
3. Doubling [A] doubles rate → first order in A.
4. Doubling [A] quadruples rate → second order in A.
5. Doubling [A] doesn't change rate → zero order in A.

**Worked example.**

| Trial | [A] | [B] | rate |
|---|---|---|---|
| 1 | 0.1 | 0.1 | 0.02 |
| 2 | 0.2 | 0.1 | 0.04 |
| 3 | 0.1 | 0.2 | 0.08 |

- Trial 1→2: [A] doubled, rate doubled → first order in A.
- Trial 1→3: [B] doubled, rate × 4 → second order in B.
- Rate law: rate = k[A][B]². Overall third order.
- k = rate / ([A][B]²) = 0.02 / (0.1 × 0.01) = 20 M⁻²s⁻¹.`,
    },
    {
      code: '5.3',
      title: 'Integrated rate laws',
      content:
`Integrated rate laws relate [reactant] to time.

**Zero-order.** [A] = [A]₀ - kt.
- Linear plot: [A] vs t (slope = -k).
- t_{1/2} = [A]₀ / (2k) — half-life depends on initial concentration.

**First-order.** ln[A] = ln[A]₀ - kt.
- Linear plot: ln[A] vs t (slope = -k).
- t_{1/2} = ln(2)/k ≈ 0.693/k. Constant half-life — independent of [A]₀.
- Examples: radioactive decay, many drug metabolism, some isomerizations.

**Second-order.** 1/[A] = 1/[A]₀ + kt.
- Linear plot: 1/[A] vs t (slope = +k).
- t_{1/2} = 1/(k[A]₀) — depends on [A]₀.

**How to identify order from data.** Plot:
1. [A] vs t → if linear, zero order.
2. ln[A] vs t → if linear, first order.
3. 1/[A] vs t → if linear, second order.

**Worked example.** Radioactive iodine-131 has t_{1/2} = 8 days (first-order).
After 24 days (3 half-lives), 1/2³ = 1/8 remains.
Generally: fraction remaining after n half-lives = (1/2)ⁿ.

**Half-life applications.**
- Carbon-14 dating (t_{1/2} = 5730 yr).
- Drug pharmacokinetics (when next dose).
- Nuclear waste storage timelines.`,
    },
    {
      code: '5.4',
      title: 'Reaction mechanisms',
      content:
`Most reactions occur through multiple **elementary steps**. The set of steps is the **mechanism**.

**Each elementary step** has its own rate law based on its **molecularity** (number of molecules colliding):
- Unimolecular: A → products. rate = k[A].
- Bimolecular: A + B → products. rate = k[A][B].
- Termolecular (rare): A + B + C → products. rate = k[A][B][C].

For elementary steps (and only elementary steps), exponents = coefficients.

**Rate-determining step (RDS).** The slowest step in a mechanism controls overall rate. Rate law for the overall reaction = rate law for RDS.

**Reaction intermediates.** Species formed in one step and consumed in another. NOT in overall equation; NOT in rate law (usually).

**Worked example. Proposed mechanism:**
Step 1 (slow): NO₂ + NO₂ → NO₃ + NO  rate = k₁[NO₂]²
Step 2 (fast): NO₃ + CO → NO₂ + CO₂

Overall: NO₂ + CO → NO + CO₂

Predicted rate law from mechanism: rate = k₁[NO₂]² (from slow step).

If experimentally rate = k[NO₂]², mechanism is consistent. If different, mechanism must be modified.

**Mechanism criteria.**
1. Sum of steps must give overall equation.
2. Rate law must match experimental data.
3. Steps should be plausible (most are bi- or unimolecular).`,
    },
    {
      code: '5.5',
      title: 'Activation energy',
      content:
`**Activation energy (E_a)** is the minimum energy needed for reactants to react.

**Why?** Bonds must break before new bonds form. Reactants must collide with enough energy AND correct orientation to overcome the energy barrier.

**Reaction coordinate diagram.**
- x-axis: reaction progress.
- y-axis: potential energy.
- Reactants on left, products on right.
- Peak in middle = **transition state** (highest energy point).
- E_a = energy from reactants to transition state.
- ΔH = energy difference between reactants and products (exo if products lower; endo if higher).

**Arrhenius equation:**
k = A × e^(-E_a / RT)

- A = pre-exponential factor (frequency of collisions with correct orientation).
- E_a = activation energy.
- R = 8.314 J/(mol·K).
- T = Kelvin.

**Temperature dependence.** Increasing T dramatically increases k.
Rule of thumb: rate ~doubles per 10°C increase (depending on E_a).

**Linearized form:**
ln k = ln A - E_a/RT
Plot ln k vs 1/T → slope = -E_a/R; intercept = ln A.

**Maxwell-Boltzmann distribution and rate.**
- At low T, few molecules have KE > E_a → slow rate.
- At higher T, more molecules exceed E_a → faster rate.
- Even small T increases can dramatically increase number exceeding threshold.

**Catalysts** lower E_a (covered in 5.7), dramatically increasing rate.`,
    },
    {
      code: '5.6',
      title: 'Multistep reaction energy profiles',
      content:
`Real reactions often involve multiple steps. Energy profile shows multiple peaks (one per step).

**Reading multi-step diagrams:**
- Each peak = transition state of one step.
- Valleys between peaks = intermediates.
- Tallest peak = rate-determining step (slowest).

**Example. Two-step exothermic mechanism:**
- Reactant → high peak (slow step, RDS) → intermediate at low energy → small peak (fast step) → product.
- Overall ΔH = product - reactant (negative if exothermic).
- E_a for whole reaction is height of largest peak above reactants.

**Endothermic vs exothermic.**
- Exothermic: products at lower energy than reactants; releases heat.
- Endothermic: products at higher energy; absorbs heat.
- E_a always positive (always have to climb the barrier).

**Catalysts** add an alternative path with lower E_a (sometimes multi-step with lower peaks).`,
    },
    {
      code: '5.7',
      title: 'Catalysts',
      content:
`A **catalyst** speeds a reaction without being consumed. It provides an alternative pathway with lower activation energy.

**Key facts:**
- Catalyst is not consumed (regenerated at end).
- Lowers E_a (forward AND reverse) — increases rate but doesn't shift equilibrium position.
- Does NOT change ΔH or equilibrium constant.
- Tiny amounts can be very effective.

**Types:**

**Homogeneous catalysts.** Same phase as reactants. Acid catalysis in solution; H⁺ catalyzes esterification.

**Heterogeneous catalysts.** Different phase. Most industrial catalysts. Reactants adsorb on solid surface, react there.
- Catalytic converters (Pt, Pd, Rh) — convert CO + NO_x in exhaust to CO₂ + N₂.
- Haber process (Fe) — N₂ + 3 H₂ → 2 NH₃.
- Hydrogenation (Ni, Pt) — adds H to C=C double bonds.

**Enzymes.** Biological catalysts (proteins, mostly). Highly specific. Can speed reactions 10⁶-10²⁰×. Examples: carbonic anhydrase (CO₂ + H₂O ⇌ H₂CO₃), DNA polymerase, lactase.

**Why catalysts matter.**
- ~90% of industrial chemical processes use catalysts.
- Enable reactions that would otherwise be too slow.
- Reduce energy requirements (lower T needed).
- Increase selectivity (more desired product, less waste).
- Critical to chemistry of life (every cellular reaction is catalyzed).

**Catalysts and equilibrium.** Both forward and reverse rates increase by same factor → equilibrium position unchanged, just reached faster.`,
    },
  ],
  keyConcepts: [
    'Rate = -Δ[reactant]/Δt = +Δ[product]/Δt (with stoichiometric coefficients).',
    'Rate law: rate = k[A]^m[B]^n. Orders m, n determined experimentally.',
    'Integrated rate laws: 0th order → [A] vs t linear; 1st → ln[A] vs t linear; 2nd → 1/[A] vs t linear.',
    'Half-life: 1st-order t½ = 0.693/k (constant); 2nd-order depends on [A]₀.',
    'Reaction mechanism: sum of elementary steps; slow step is rate-determining.',
    'Activation energy E_a = barrier reactants must overcome.',
    'Arrhenius: k = Ae^(-Ea/RT). Higher T → much higher k.',
    'Catalysts lower E_a; don\'t affect ΔH or equilibrium; are not consumed.',
    '~90% of industrial chemistry uses catalysts.',
  ],
  formulas: [
    {
      name: 'First-order integrated rate law',
      equation: 'ln[A] = ln[A]₀ - kt',
      meaning: 'Concentration decays exponentially.',
      example: 't½ = ln(2)/k. Radioactive decay is first-order.',
    },
    {
      name: 'Arrhenius equation',
      equation: 'k = A e^(-E_a / RT)',
      meaning: 'Rate constant depends exponentially on (E_a/T).',
      example: 'Higher T → more molecules exceed E_a → much faster reaction.',
    },
  ],
  practice: [
    {
      q: 'A first-order reaction has t½ = 100 s. What fraction remains after 300 s?',
      a: '300 s = 3 half-lives. Fraction = (1/2)³ = 1/8 = 0.125 = 12.5%.',
    },
    {
      q: 'For experiments: [A] doubles, rate × 4. [B] doubles, rate stays same. What\'s the rate law?',
      a: 'Second order in A; zero order in B. rate = k[A]². Overall second order.',
    },
    {
      q: 'Why does a catalyst speed both forward and reverse reactions equally?',
      a: 'It lowers E_a in both directions by the same amount. Forward and reverse rate constants both increase by the same factor → equilibrium reached faster but position unchanged.',
    },
  ],
  pitfalls: [
    '"Rate law exponents = stoichiometric coefficients" — wrong (except for elementary steps). Must determine experimentally.',
    '"Half-life is always constant" — only for first-order. Zero and second order depend on [A]₀.',
    '"Catalysts shift equilibrium" — wrong. They speed both directions equally.',
    '"Higher activation energy means slower reaction" — yes, at fixed T. But E_a alone doesn\'t determine rate; T and A also matter.',
    '"Rate constant changes with [reactant]" — wrong. k depends only on T (and catalyst presence).',
  ],
};
