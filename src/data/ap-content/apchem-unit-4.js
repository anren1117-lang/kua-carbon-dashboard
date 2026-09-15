// AP Chemistry Unit 4 — Chemical Reactions (7-9%)

export const APCHEM_UNIT_4 = {
  number: 4,
  title: 'Chemical Reactions',
  weight: '7-9%',
  subunits: [
    {
      code: '4.1',
      title: 'Introduction to chemical reactions',
      content:
`A chemical reaction transforms reactants into products. Bonds break and form. Mass and atoms are conserved.

**Evidence of reaction:**
- Color change.
- Gas evolution.
- Precipitate formation.
- Temperature change (endo/exothermic).
- Odor change.

**Writing reactions.** Reactants → products.
- State symbols: (s) solid, (l) liquid, (g) gas, (aq) aqueous.
- Conservation: same atoms on each side.

**Balancing equations.** Adjust coefficients (not subscripts!) until atoms balance.
Example: combustion of methane.
CH₄ + O₂ → CO₂ + H₂O (unbalanced)
CH₄ + 2 O₂ → CO₂ + 2 H₂O (balanced)

Check: 1 C, 4 H, 4 O each side. ✓

**Types of reactions:**
- **Synthesis (combination)**: A + B → AB.
- **Decomposition**: AB → A + B.
- **Combustion**: hydrocarbon + O₂ → CO₂ + H₂O.
- **Single replacement**: A + BC → AC + B.
- **Double replacement**: AB + CD → AD + CB.
- **Acid-base**: HX + MOH → MX + H₂O.
- **Redox**: electron transfer (covered later).`,
    },
    {
      code: '4.2',
      title: 'Net ionic equations',
      content:
`In aqueous reactions, ionic compounds break into ions. Three forms:

**Molecular equation** (formula units):
HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)

**Complete ionic equation** (all soluble strong electrolytes as ions):
H⁺(aq) + Cl⁻(aq) + Na⁺(aq) + OH⁻(aq) → Na⁺(aq) + Cl⁻(aq) + H₂O(l)

**Net ionic equation** (omit spectator ions — those unchanged):
H⁺(aq) + OH⁻(aq) → H₂O(l)

**Spectator ions** don't participate in the actual chemistry.

**When to write ionic forms.**
- Strong electrolytes in solution → ions.
- Weak electrolytes, insoluble solids, gases, water → molecular form.

**Precipitation reactions.** Two soluble compounds combine; precipitate forms.
Pb(NO₃)₂(aq) + 2 KI(aq) → PbI₂(s)↓ + 2 KNO₃(aq)
Net ionic: Pb²⁺(aq) + 2 I⁻(aq) → PbI₂(s).

**Acid-base reactions.** Strong acid + strong base → water + salt.
Net ionic: H⁺ + OH⁻ → H₂O.

**Gas-forming reactions.** Carbonates with acids:
2 HCl(aq) + Na₂CO₃(aq) → 2 NaCl(aq) + H₂O(l) + CO₂(g)
Net ionic: 2 H⁺(aq) + CO₃²⁻(aq) → H₂O(l) + CO₂(g).`,
    },
    {
      code: '4.3',
      title: 'Representations of reactions',
      content:
`Reactions can be represented at multiple levels.

**Macroscopic.** What you observe — color change, gas, precipitate.

**Particulate.** Atoms, molecules, ions interacting. Drawings showing what happens at the molecular level.

**Symbolic.** Chemical equations.

**Connecting levels.** Skilled chemists move between these freely.
- Macroscopic: a yellow precipitate forms when KI is added to Pb(NO₃)₂.
- Particulate: Pb²⁺ ions encounter I⁻ ions; attraction overcomes hydration → solid PbI₂ forms.
- Symbolic: Pb²⁺(aq) + 2 I⁻(aq) → PbI₂(s).

**Why this matters.** Understanding all three levels is the difference between memorizing reactions and predicting them. AP rewards genuine understanding over rote.`,
    },
    {
      code: '4.4',
      title: 'Physical and chemical changes',
      content:
`**Physical changes** alter form but not chemical identity. No new substances.
- Melting, freezing, vaporizing, condensing, dissolving (usually).
- Cutting, breaking, mixing without reaction.

**Chemical changes** form new substances with different properties.
- Burning, rusting, digestion, photosynthesis.
- Acid-base reactions, precipitations.

**Distinguishing them.**
- New substances? Chemical.
- Reversible by physical means? Physical (melt + freeze).
- Color/odor change? Often chemical.
- Heat change without phase change? Often chemical.

**Tricky cases.**
- Dissolving NaCl: physical (ions still there; can recover by evaporation).
- Dissolving CO₂ in water: borderline (forms H₂CO₃, slight chemical change).
- Salt water freezing: physical (just separating water from ions).`,
    },
    {
      code: '4.5',
      title: 'Stoichiometry',
      content:
`Stoichiometry uses mole ratios from balanced equations to relate amounts of reactants and products.

**Steps:**
1. Balance the equation.
2. Convert given quantity to moles.
3. Use mole ratio to find moles of target.
4. Convert moles of target to desired unit (g, L, particles).

**Mole ratios** come directly from balanced equation coefficients.

**Worked example.** How many g of water form when 4.0 g of H₂ react with O₂?
2 H₂ + O₂ → 2 H₂O
- mol H₂ = 4.0/2.02 = 1.98 mol.
- mol H₂O = 1.98 × (2 mol H₂O / 2 mol H₂) = 1.98 mol.
- g H₂O = 1.98 × 18.02 = 35.7 g.

**Limiting reactant.** When two reactants are given, one runs out first → limits the product. Find by:
1. Calculate moles of product each reactant could make.
2. Smaller answer = limiting reactant; that\'s the theoretical yield.

**Worked example.** 5.0 g H₂ + 64.0 g O₂. Limit?
2 H₂ + O₂ → 2 H₂O
- mol H₂ = 2.48; could make 2.48 mol H₂O.
- mol O₂ = 2.0; could make 4.0 mol H₂O.
- H₂ is limiting → max 2.48 mol H₂O = 44.7 g.
- Excess O₂ = 2.0 - 2.48/2 = 0.76 mol left over.

**Percent yield.**
% yield = (actual yield / theoretical yield) × 100%.

Most reactions don\'t go to 100% — side reactions, losses, equilibrium. Good lab work targets 70-90%+ yield.`,
    },
    {
      code: '4.6',
      title: 'Introduction to titrations',
      content:
`**Titration** determines unknown concentration by reacting with a known standard.

**Setup.**
- Buret holds **titrant** of known concentration.
- Flask holds unknown **analyte** of unknown concentration.
- Indicator (or pH meter) signals **equivalence point**.

**Process.**
1. Measure volume of analyte; place in flask.
2. Add indicator.
3. Titrate titrant until indicator changes color.
4. Read volume of titrant used.

**Equivalence point** = moles acid = moles base (for monoprotic acid-base).

**Calculation.**
moles acid = moles base
M_acid × V_acid = M_base × V_base

**Worked example.** Titrating 25.0 mL of HCl (unknown) with 0.100 M NaOH. End point at 32.5 mL.
moles NaOH = 0.100 × 0.0325 = 3.25 × 10⁻³ mol.
moles HCl = 3.25 × 10⁻³ mol (1:1 ratio).
[HCl] = 3.25 × 10⁻³ / 0.0250 = 0.130 M.

**Polyprotic acids.** Need to account for ratio. H₂SO₄ + 2 NaOH → 2 H₂O + Na₂SO₄. moles NaOH = 2 × moles H₂SO₄.

**Indicators** (acid-base).
- Phenolphthalein: colorless (acid) → pink (base; ~pH 8.3-10).
- Methyl orange: red (acid) → yellow (base; ~pH 3.1-4.4).
- Choose indicator whose color change is at pH near equivalence point.

**pH titration curves.** Plot pH vs volume of titrant. S-shaped for strong acid/base. Steep at equivalence point. Inflection point = equivalence point.`,
    },
    {
      code: '4.7',
      title: 'Types of chemical reactions',
      content:
`Recognizing reaction patterns helps predict products.

**(1) Combination/synthesis.** A + B → AB.
2 Na + Cl₂ → 2 NaCl
2 H₂ + O₂ → 2 H₂O
CaO + H₂O → Ca(OH)₂

**(2) Decomposition.** AB → A + B.
2 H₂O → 2 H₂ + O₂ (electrolysis)
CaCO₃ → CaO + CO₂ (heat)
2 KClO₃ → 2 KCl + 3 O₂

**(3) Single replacement.** A + BC → AC + B (more active element displaces less active).
Zn + CuSO₄ → ZnSO₄ + Cu
Cl₂ + 2 NaBr → 2 NaCl + Br₂

Activity series predicts which displacements occur.

**(4) Double replacement.** AB + CD → AD + CB.
- Precipitation: NaCl + AgNO₃ → NaNO₃ + AgCl(s)
- Neutralization: HCl + NaOH → NaCl + H₂O
- Gas-forming: Na₂CO₃ + 2 HCl → 2 NaCl + H₂O + CO₂

**(5) Combustion.** Hydrocarbon + O₂ → CO₂ + H₂O.
CH₄ + 2 O₂ → CO₂ + 2 H₂O
2 C₈H₁₈ + 25 O₂ → 16 CO₂ + 18 H₂O (octane burning in gasoline)

**(6) Acid-base.** HX + MOH → MX + H₂O.

**(7) Redox.** Electron transfer (covered in Unit 9).`,
    },
    {
      code: '4.8',
      title: 'Introduction to acid-base reactions',
      content:
`**Acid-base reactions** are central to chemistry, biology, and many technologies.

**Arrhenius definition.** Acid releases H⁺ in water; base releases OH⁻.

**Bronsted-Lowry definition.** Acid donates H⁺; base accepts H⁺. More general.

**Lewis definition.** Acid accepts electron pair; base donates electron pair. Most general (covers BF₃ + NH₃ for example, where no H⁺ is transferred).

**Strong acids** (fully ionize in water):
HCl, HBr, HI, HNO₃, H₂SO₄ (first H), HClO₄, HClO₃.

**Strong bases** (fully ionize):
Group 1 hydroxides (LiOH, NaOH, KOH, etc.); some Group 2 (Ca(OH)₂, Sr(OH)₂, Ba(OH)₂).

**Weak acids** (partially ionize). Examples:
HF, CH₃COOH (acetic acid), H₂CO₃ (carbonic), HCN.

**Weak bases**:
NH₃ (ammonia), amines.

**Conjugate pairs.** When acid donates H⁺, it becomes its **conjugate base**.
HCl → H⁺ + Cl⁻
CH₃COOH → H⁺ + CH₃COO⁻ (acetate)
NH₃ + H₂O → NH₄⁺ + OH⁻

Strong acid → weak conjugate base; weak acid → stronger conjugate base.

**pH scale.**
- pH = -log[H⁺].
- pH < 7 acidic, > 7 basic, = 7 neutral.
- Each unit = 10× change in [H⁺].
- pH + pOH = 14.
- [H⁺] × [OH⁻] = 10⁻¹⁴.

**Neutralization.** Acid + base → salt + water.
HCl + NaOH → NaCl + H₂O.

Net ionic: H⁺ + OH⁻ → H₂O.`,
    },
    {
      code: '4.9',
      title: 'Oxidation-reduction reactions',
      content:
`**Redox** = reduction + oxidation. Always paired.

**Definitions.**
- **Oxidation** = loss of electrons (or increase in oxidation state).
- **Reduction** = gain of electrons (or decrease in oxidation state).
- **OIL RIG** mnemonic: Oxidation Is Loss, Reduction Is Gain.

**Oxidizing agent** gets reduced (causes others to oxidize).
**Reducing agent** gets oxidized (causes others to reduce).

**Oxidation states (numbers).** Assigned to each atom in a compound:
- Free elements: 0 (e.g., Cu, O₂).
- Monatomic ions: ion charge.
- O: usually -2 (except peroxides -1, OF₂ +2).
- H: usually +1 (except in metal hydrides -1).
- Group 1 metals: +1; Group 2: +2.
- F: always -1.
- Sum of all OS in compound = 0; in polyatomic ion = ion charge.

**Identifying redox.** If any element changes OS, it\'s redox.

**Example.** 2 Mg + O₂ → 2 MgO.
- Mg: 0 → +2 (oxidized; lost 2 e⁻).
- O: 0 → -2 (reduced; gained 2 e⁻).
- Mg is reducing agent; O₂ is oxidizing agent.

**Half-reactions.** Separate oxidation and reduction:
- Mg → Mg²⁺ + 2 e⁻ (oxidation half).
- O₂ + 4 e⁻ → 2 O²⁻ (reduction half).

Balance both; combine.

**Common redox reactions.**
- Combustion (carbon oxidized, oxygen reduced).
- Rust (Fe oxidized, O₂ reduced).
- Photosynthesis (CO₂ reduced, H₂O oxidized).
- Cellular respiration (glucose oxidized, O₂ reduced).
- Batteries (electrons flow through external circuit).
- Bleaching, photography, fireworks, smelting metals.

**Activity series** ranks metals by tendency to be oxidized (lose electrons). Higher activity → easier to oxidize. Top metals can displace lower ones from solution.`,
    },
  ],
  keyConcepts: [
    'Balanced equations conserve atoms (adjust coefficients, not subscripts).',
    'Mole ratios from coefficients are central to stoichiometry.',
    'Limiting reactant determines theoretical yield.',
    '% yield = actual/theoretical × 100%.',
    'Net ionic equations remove spectator ions.',
    'Titration: M_acid × V_acid = M_base × V_base at equivalence (1:1 ratio).',
    'Strong acids/bases ionize fully; weak partially.',
    'Conjugate acid-base pairs differ by one H⁺.',
    'pH = -log[H⁺]; pH + pOH = 14.',
    'Redox: oxidation = lose e⁻; reduction = gain e⁻. Always paired.',
  ],
  formulas: [
    {
      name: 'Mole-mass-particle conversion',
      equation: 'grams → mol (÷ M) → particles (× N_A) or → L gas at STP (× 22.4)',
      meaning: 'Universal stoichiometry chain.',
      example: '36 g H₂O → 2 mol → 1.2 × 10²⁴ molecules.',
    },
    {
      name: 'Titration',
      equation: 'M_a × V_a = M_b × V_b  (for 1:1 ratio)',
      meaning: 'At equivalence, moles acid = moles base.',
      example: '25 mL HCl titrated with 32.5 mL 0.100 M NaOH → [HCl] = (0.100)(32.5)/25 = 0.130 M.',
    },
    {
      name: 'pH',
      equation: 'pH = -log[H⁺]',
      meaning: 'Each pH unit = 10× change in [H⁺].',
      example: '[H⁺] = 10⁻⁴ M → pH = 4 (acidic).',
    },
  ],
  practice: [
    {
      q: 'Balance: NH₃ + O₂ → NO + H₂O.',
      a: '4 NH₃ + 5 O₂ → 4 NO + 6 H₂O. Check: 4 N, 12 H, 10 O each side. ✓',
    },
    {
      q: 'For 2 H₂ + O₂ → 2 H₂O, you have 8 g H₂ and 32 g O₂. Which is limiting?',
      a: 'mol H₂ = 4.0, could make 4 mol H₂O. mol O₂ = 1.0, could make 2 mol H₂O. O₂ is limiting → max 36 g H₂O. Excess H₂ left: 4 - 2 = 2 mol = 4 g.',
    },
    {
      q: 'In Zn + CuSO₄ → ZnSO₄ + Cu, what is oxidized and what is reduced?',
      a: 'Zn: 0 → +2 (oxidized; lost 2 e⁻). Cu²⁺: +2 → 0 (reduced; gained 2 e⁻). Zn is reducing agent; Cu²⁺ is oxidizing agent.',
    },
  ],
  pitfalls: [
    '"Change subscripts to balance" — never. Only change coefficients.',
    '"Limiting reactant is the one with smaller mass" — wrong. Always compare in moles using the equation.',
    '"100% yield is always possible" — almost never in practice. Side reactions, losses, equilibrium.',
    '"Spectator ions don\'t do anything" — they balance charges in the actual solution; they\'re just unchanged.',
    '"All combination reactions are exothermic" — most are, but not universally.',
  ],
};
