// AP Chemistry Unit 7 — Equilibrium (7-9%)

export const APCHEM_UNIT_7 = {
  number: 7,
  title: 'Equilibrium',
  weight: '7-9%',
  subunits: [
    {
      code: '7.1',
      title: 'Introduction to equilibrium',
      content:
`Many reactions don't go to completion — they reach **equilibrium**, where forward and reverse rates are equal.

**Reversible reactions.** Notation uses ⇌ (double arrow).
N₂ + 3 H₂ ⇌ 2 NH₃

**Dynamic equilibrium.** Reactants and products both present at constant concentrations, but molecules still react in both directions at equal rates.

**Conditions for equilibrium:**
1. Closed system (no material added or removed).
2. Constant temperature.
3. Reactions occurring in both directions.

**Reaction quotient Q vs equilibrium constant K.**
- Q calculated at any moment.
- K is Q at equilibrium.

**For aA + bB ⇌ cC + dD:**
Q = [C]^c[D]^d / ([A]^a[B]^b)

At equilibrium, Q = K.

**Comparing Q and K:**
- Q < K: too few products → reaction proceeds forward.
- Q > K: too many products → reaction proceeds backward.
- Q = K: at equilibrium.

**Sign of K.**
- K >> 1: equilibrium favors products.
- K << 1: favors reactants.
- K ≈ 1: roughly equal.`,
    },
    {
      code: '7.2',
      title: 'Direction of reversible reactions',
      content:
`A reaction reaches equilibrium from either side — pure reactants or pure products.

**Worked example.** N₂O₄ ⇌ 2 NO₂. K_c = 0.21 at 100°C.

Start with pure N₂O₄ at [N₂O₄]₀ = 0.10 M.

Let x = [N₂O₄] reacted. Then [N₂O₄] = 0.10 - x, [NO₂] = 2x.
K = (2x)² / (0.10 - x) = 0.21.
4x² = 0.021 - 0.21x.
4x² + 0.21x - 0.021 = 0.
x = 0.057 (quadratic formula).

So equilibrium: [N₂O₄] = 0.043 M, [NO₂] = 0.114 M.

**Reaction quotient direction test.**
- If Q < K: forward direction (make more product).
- If Q > K: reverse direction (make more reactant).

**ICE tables.** Initial-Change-Equilibrium tables organize calculations.

| | N₂O₄ | NO₂ |
|---|---|---|
| I | 0.10 | 0 |
| C | -x | +2x |
| E | 0.10-x | 2x |

**Approximations.** When K is very small (<10⁻⁴), assume x << initial. Simplifies algebra. Check that x is indeed small (<5% of initial) at the end.`,
    },
    {
      code: '7.3',
      title: 'Reaction quotient and equilibrium constant',
      content:
`**Equilibrium constant K** is a ratio of equilibrium concentrations (or partial pressures for K_p).

**K_c** uses molar concentrations.
**K_p** uses partial pressures (gases).

K_p = K_c (RT)^Δn

where Δn = moles gas products - moles gas reactants.

If Δn = 0, K_p = K_c.

**What\'s in K?**
- Aqueous species, gases: included with their concentrations/pressures.
- Pure solids, pure liquids (including water solvent): NOT included (activity = 1).

**Example.** CaCO₃(s) ⇌ CaO(s) + CO₂(g). K = [CO₂] (or K_p = P_CO₂). Solids omitted.

**Manipulating K.**
- Reverse reaction: K_new = 1/K_old.
- Multiply equation by n: K_new = (K_old)ⁿ.
- Add reactions: K_total = K₁ × K₂.

**Worked example.** For 2 SO₂ + O₂ ⇌ 2 SO₃, K = 4.
For SO₃ ⇌ SO₂ + ½ O₂ (reverse + halved): K_new = (1/4)^(1/2) = 0.5.

**K and the position of equilibrium.**
- Same reaction at different T gives different K.
- T is the ONLY thing that changes K (for a given reaction).
- Other changes (concentration, pressure) shift Q toward K, but K itself unchanged.`,
    },
    {
      code: '7.4',
      title: 'Calculating equilibrium concentrations',
      content:
`Given K and initial concentrations, find equilibrium concentrations.

**Worked example.** N₂ + 3 H₂ ⇌ 2 NH₃. K_c = 100 at 400°C. Start with [N₂] = 1.0, [H₂] = 3.0, [NH₃] = 0.

| | N₂ | H₂ | NH₃ |
|---|---|---|---|
| I | 1.0 | 3.0 | 0 |
| C | -x | -3x | +2x |
| E | 1-x | 3-3x | 2x |

K = (2x)² / [(1-x)(3-3x)³] = 100.

This is messy. Solve numerically or iteratively. Trial: x = 0.6 → check.

[N₂] = 0.4; [H₂] = 1.2; [NH₃] = 1.2.
K = (1.2)² / (0.4)(1.2)³ = 1.44 / (0.4)(1.728) = 1.44 / 0.691 = 2.08. Too small.

Try x = 0.7 → [N₂] = 0.3, [H₂] = 0.9, [NH₃] = 1.4.
K = (1.4)² / (0.3)(0.9)³ = 1.96 / (0.3)(0.729) = 1.96 / 0.219 = 8.95. Still low.

Try x = 0.9 → [N₂] = 0.1, [H₂] = 0.3, [NH₃] = 1.8.
K = (1.8)² / (0.1)(0.3)³ = 3.24 / (0.1)(0.027) = 3.24 / 0.0027 = 1200. Too high.

Try x ≈ 0.83 → adjust until you hit 100.

This shows: high K → reactants mostly consumed at equilibrium.

**When K is small.** Use approximation that x << initial.
[A]ᵢ - x ≈ [A]ᵢ.

Simplifies algebra; check that x/[A]ᵢ < 0.05 (5%) at end.`,
    },
    {
      code: '7.5',
      title: 'Le Châtelier\'s principle',
      content:
`**Le Châtelier\'s principle.** If a system at equilibrium is disturbed, the equilibrium shifts to partially counteract the change.

**Types of disturbances:**

**(1) Change in concentration.**
- Add reactant → forward shift (consume reactant; make more product).
- Add product → reverse shift.
- Remove reactant → reverse shift.
- Remove product → forward shift.

**(2) Change in pressure/volume** (gases).
- Increase pressure (decrease volume) → shift toward side with FEWER moles of gas.
- N₂ + 3 H₂ ⇌ 2 NH₃ (4 mol gas → 2 mol gas) → forward shift increases NH₃.
- Decrease pressure → shift toward more moles of gas.
- If equal moles on both sides, pressure changes don\'t shift equilibrium.

**(3) Change in temperature.** This is the only thing that changes K.
- Exothermic (products + heat): adding heat → reverse shift (K decreases).
- Endothermic (reactants + heat → products): adding heat → forward shift (K increases).

Treat heat like a reactant or product.

**(4) Catalysts.** No shift (forward and reverse rates increase equally).

**Industrial application: Haber process.**
N₂ + 3 H₂ ⇌ 2 NH₃ + heat (exothermic, fewer gas moles on right).

Optimal conditions for high yield:
- High pressure (favors NH₃ side — fewer moles).
- Low T (favors NH₃ — exothermic).

BUT low T means slow reaction. Compromise: medium T (~400-450°C) with catalyst (Fe) to speed reaction.

**Le Châtelier\'s principle is qualitative.** For exact predictions, use Q vs K analysis.`,
    },
    {
      code: '7.6',
      title: 'Solubility equilibria',
      content:
`For sparingly soluble ionic compounds, dissolution reaches equilibrium between solid and dissolved ions.

**Solubility product Ksp.**
AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq)
Ksp = [Ag⁺][Cl⁻]

Solid omitted from expression (activity = 1).

**Solubility (s).** Moles dissolved per liter at saturation.

For AgCl: s = [Ag⁺] = [Cl⁻] (since 1:1).
Ksp = s × s = s². So s = √Ksp.

**Worked example.** AgCl Ksp = 1.8 × 10⁻¹⁰. Solubility?
s = √(1.8 × 10⁻¹⁰) = 1.34 × 10⁻⁵ M.

In mass per liter: 1.34 × 10⁻⁵ × 143.32 g/mol = 0.0019 g/L = 1.9 mg/L. Very low.

**Compounds with multiple ions:**
CaF₂ ⇌ Ca²⁺ + 2 F⁻
Ksp = [Ca²⁺][F⁻]² = (s)(2s)² = 4s³.
s = (Ksp/4)^(1/3).

**Common ion effect.** Adding an ion already in equilibrium reduces solubility.

Example: AgCl in NaCl solution.
- Pure water: AgCl dissolves until [Ag⁺][Cl⁻] = Ksp.
- In 0.1 M NaCl: [Cl⁻] starts at 0.1 M. To satisfy Ksp = [Ag⁺](0.1), [Ag⁺] = 1.8 × 10⁻⁹ M. Solubility drops 7,400× compared to pure water.

This is why washing precipitates with cold water containing common ion reduces loss.

**Predicting precipitation.**
- Compare ion product Q to Ksp.
- Q < Ksp: unsaturated; no precipitation.
- Q = Ksp: saturated; equilibrium.
- Q > Ksp: supersaturated; precipitation occurs until Q = Ksp.`,
    },
    {
      code: '7.7',
      title: 'Free energy and equilibrium',
      content:
`Connection between thermodynamics and equilibrium.

**Free energy ΔG = ΔH - TΔS.**

**At equilibrium, ΔG = 0** for the reaction at that composition.

**Relationship to K.**
ΔG° = -RT ln K (standard conditions)

ΔG° is the standard free energy change (reactants and products at 1 M / 1 atm).

- K > 1: ΔG° < 0 (reactants favored).
- K < 1: ΔG° > 0 (products favored).
- K = 1: ΔG° = 0.

**For non-standard conditions:**
ΔG = ΔG° + RT ln Q

When Q = K, ΔG = 0 → equilibrium.

**Worked example.** ΔG° = -10 kJ/mol at 298 K. Find K.
ΔG° = -RT ln K
-10,000 = -(8.314)(298) ln K
ln K = 10,000 / 2477 = 4.04.
K = e^4.04 = 57.

**Temperature dependence of K.**
ΔG° = -RT ln K, and ΔG° = ΔH° - TΔS°.
So -RT ln K = ΔH° - TΔS°.
ln K = -ΔH°/(RT) + ΔS°/R (van\'t Hoff equation).

For exothermic reactions (ΔH° < 0): increasing T decreases K (Le Châtelier confirms — heat is "product").
For endothermic: increasing T increases K.

**Reaction spontaneity:**
| ΔH | ΔS | ΔG | Spontaneous? |
|---|---|---|---|
| − | + | always − | always |
| + | − | always + | never |
| − | − | − at low T | low T |
| + | + | − at high T | high T |`,
    },
  ],
  keyConcepts: [
    'Equilibrium: forward rate = reverse rate. Concentrations constant but reactions ongoing.',
    'K = ratio of products/reactants concentrations (raised to coefficients) at equilibrium.',
    'Solids and pure liquids omitted from K expression.',
    'Q vs K: Q<K forward, Q>K reverse, Q=K equilibrium.',
    'Le Châtelier: system shifts to counter disturbance.',
    'T is the only thing that changes K.',
    'Catalysts speed equilibrium but don\'t shift it.',
    'Solubility product Ksp; common ion reduces solubility.',
    'ΔG° = -RT ln K connects thermodynamics and equilibrium.',
  ],
  formulas: [
    {
      name: 'Equilibrium constant expression',
      equation: 'K = [products]^c / [reactants]^a',
      meaning: 'Products in numerator, reactants in denominator, each raised to its coefficient.',
      example: 'N₂ + 3H₂ ⇌ 2NH₃: K = [NH₃]² / ([N₂][H₂]³).',
    },
    {
      name: 'ΔG° and K',
      equation: 'ΔG° = -RT ln K',
      meaning: 'Negative ΔG° → K > 1 (products favored); positive ΔG° → K < 1 (reactants favored).',
      example: 'At 298 K, ΔG° = -10 kJ → K ≈ 57.',
    },
  ],
  practice: [
    {
      q: 'For 2 NO₂ ⇌ N₂O₄, K = 4.0 at 25°C. If [NO₂] = 0.2 M and [N₂O₄] = 0.1 M, which way does reaction shift?',
      a: 'Q = [N₂O₄]/[NO₂]² = 0.1/(0.04) = 2.5. Q < K, so reaction shifts forward to make more N₂O₄.',
    },
    {
      q: 'For the Haber process N₂ + 3H₂ ⇌ 2NH₃ + heat, predict the effect of (a) adding more N₂, (b) increasing T, (c) increasing P.',
      a: '(a) Forward shift (consume added N₂). (b) Reverse shift (heat is "product"; adding heat pushes backward). (c) Forward shift (fewer moles of gas on right — 2 vs 4).',
    },
    {
      q: 'Calcium fluoride CaF₂ has Ksp = 4.0 × 10⁻¹¹. What is its molar solubility?',
      a: 'CaF₂ ⇌ Ca²⁺ + 2 F⁻. Ksp = [Ca²⁺][F⁻]² = (s)(2s)² = 4s³. 4s³ = 4 × 10⁻¹¹. s = (10⁻¹¹)^(1/3) = 2.15 × 10⁻⁴ M.',
    },
  ],
  pitfalls: [
    '"Adding more catalyst shifts equilibrium" — wrong. Catalysts speed both directions equally.',
    '"K changes with concentration" — only changes with temperature.',
    '"Le Châtelier predicts the new equilibrium exactly" — only direction; need K/Q for exact numbers.',
    '"Solids appear in K expressions" — they don\'t (activity = 1).',
    '"Spontaneous reactions are fast" — spontaneity is thermodynamic, not kinetic. Diamond → graphite is spontaneous but extremely slow.',
  ],
};
