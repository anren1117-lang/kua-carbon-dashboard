// AP Chemistry Unit 9 — Applications of Thermodynamics (7-9%)

export const APCHEM_UNIT_9 = {
  number: 9,
  title: 'Applications of Thermodynamics',
  weight: '7-9%',
  subunits: [
    {
      code: '9.1',
      title: 'Entropy',
      content:
`**Entropy (S)** measures disorder or number of possible microstates. Higher entropy = more possible arrangements.

**Predicting entropy change:**
- Solid → liquid → gas: ΔS > 0 (more disorder).
- Dissolving a solid in water: usually ΔS > 0 (disordered ions vs ordered lattice).
- More gas moles on product side: ΔS > 0.
- Larger molecules (more bonds, more vibrations): higher S.
- Higher temperature: higher S.

**Units:** J/(mol·K). Note the units are smaller than enthalpy (J vs kJ).

**Standard molar entropy** (S°) tabulated for substances at 1 atm, 298 K. Values:
- Solids: low S (ordered).
- Liquids: higher.
- Gases: highest (especially complex ones like CO₂, NH₃).

**Calculate ΔS_rxn:**
ΔS_rxn = Σ n × S°(products) - Σ n × S°(reactants)

**Examples.**
- Ice melting: ΔS > 0 (more disorder in liquid).
- CO₂(g) + 2 H₂O(g) → CH₄(g) + 2 O₂(g): 3 mol gas → 3 mol gas. ΔS small.
- 2 H₂(g) + O₂(g) → 2 H₂O(l): 3 mol gas → 2 mol liquid. ΔS << 0 (much more order).

**Second law of thermodynamics.** Total entropy of universe always increases for spontaneous processes.
ΔS_universe = ΔS_system + ΔS_surroundings > 0.

A process can decrease ΔS_system if it increases ΔS_surroundings more (typically by releasing heat).`,
    },
    {
      code: '9.2',
      title: 'Free energy',
      content:
`**Gibbs free energy (G)** combines enthalpy and entropy:
G = H - TS

For a process at constant T and P:
**ΔG = ΔH - TΔS**

**Spontaneity criterion:**
- ΔG < 0: spontaneous (proceeds forward).
- ΔG > 0: non-spontaneous (reverse is spontaneous).
- ΔG = 0: equilibrium.

**Four scenarios:**

| ΔH | ΔS | ΔG | Spontaneous? |
|---|---|---|---|
| − | + | always − | always |
| + | − | always + | never |
| − | − | depends | low T (T·ΔS small, ΔH wins) |
| + | + | depends | high T (T·ΔS large) |

**Calculating ΔG°:**
ΔG° = ΔH° - TΔS°.

T must be in Kelvin.
Watch units: ΔH usually kJ; ΔS usually J. Convert!

**Worked example.** Ice melting at 0°C (273 K). ΔH° = +6.01 kJ/mol; ΔS° = +22.0 J/(mol·K) = +0.022 kJ/(mol·K).
ΔG = 6.01 - 273(0.022) = 6.01 - 6.01 = **0**.

At 0°C, ice and water are at equilibrium. Above 0°C, TΔS > ΔH → ΔG < 0 → melting spontaneous. Below 0°C, freezing spontaneous.

**ΔG_f° from formation:**
ΔG° = Σ n × ΔG_f°(products) - Σ n × ΔG_f°(reactants).

Elements in standard state have ΔG_f° = 0.

**Worked example.** Combustion of methane:
ΔG_f°: CH₄ = -50.7, CO₂ = -394.4, H₂O(l) = -237.1, O₂ = 0.
ΔG_rxn = [1(-394.4) + 2(-237.1)] - [1(-50.7)]
       = -868.6 + 50.7 = **-817.9 kJ/mol**.

Very negative — strongly spontaneous. (Compare ΔH = -890 kJ; ΔG accounts for entropy too.)

**Non-standard conditions:**
ΔG = ΔG° + RT ln Q.

At equilibrium, ΔG = 0 and Q = K → ΔG° = -RT ln K (as in Unit 7).`,
    },
    {
      code: '9.3',
      title: 'Coupled reactions',
      content:
`A non-spontaneous reaction (ΔG > 0) can be driven by coupling to a spontaneous one (ΔG < 0).

**Sum of ΔG.** If reaction A has ΔG_A and reaction B has ΔG_B, then A + B has ΔG_total = ΔG_A + ΔG_B. If sum is negative, coupled reaction is spontaneous.

**Biological example: ATP hydrolysis.**
ATP + H₂O → ADP + Pᵢ.  ΔG = -30.5 kJ/mol (spontaneous, exergonic).

This drives endergonic biological processes:
- Glucose phosphorylation: Glucose + Pᵢ → Glucose-6-P.  ΔG = +13.8 kJ/mol (non-spontaneous).
- Coupled with ATP: Glucose + ATP → Glucose-6-P + ADP.  ΔG = +13.8 + (-30.5) = -16.7 kJ/mol (spontaneous).

**Industrial example: ore reduction.**
Reducing iron oxide (Fe₂O₃ + C → Fe + CO₂) is favorable thermodynamically. The C+O₂ → CO₂ step provides energy.

**Why this matters.**
- Life couples ATP hydrolysis to drive all uphill biochemistry.
- Industry couples favorable processes to make desired but unfavorable products.
- Electrolysis uses electrical energy to drive non-spontaneous chemistry (water splitting).`,
    },
    {
      code: '9.4',
      title: 'Galvanic and electrolytic cells',
      content:
`**Galvanic (voltaic) cell.** Spontaneous redox reaction generates electricity. ΔG < 0; E°cell > 0.

**Components:**
- Two **half-cells** (each with electrode + solution).
- **Anode** (oxidation occurs).
- **Cathode** (reduction occurs).
- **Salt bridge** allows ion flow to maintain neutrality.
- **External circuit** carries electrons.

Memory: "AnOx, RedCat" or "an OXidation, RED uction at CATHode."

**Standard reduction potentials (E°).** Tabulated for half-reactions. Higher E° = stronger tendency to be reduced.

**Calculating cell potential:**
E°cell = E°cathode - E°anode

Both values look up as reduction potentials; subtract anode (where oxidation happens, so reverse it conceptually).

**Worked example. Zn-Cu cell:**
Zn²⁺ + 2 e⁻ → Zn  E° = -0.76 V.
Cu²⁺ + 2 e⁻ → Cu  E° = +0.34 V.

Cu²⁺ has higher (more positive) E° → Cu²⁺ is reduced (cathode).
Zn is oxidized (anode); reverse: Zn → Zn²⁺ + 2 e⁻.

Net reaction: Zn + Cu²⁺ → Zn²⁺ + Cu.
E°cell = 0.34 - (-0.76) = **+1.10 V**.

Positive → spontaneous → battery!

**Connection to free energy:**
ΔG° = -nFE°
where n = mol e⁻ transferred, F = 96,485 C/mol (Faraday's constant).

For Zn-Cu cell: ΔG° = -(2)(96,485)(1.10) = -212,000 J = -212 kJ/mol. Very negative — spontaneous.

**Electrolytic cell.** Non-spontaneous reaction driven by external voltage (battery or power supply).
- Electrolysis of water: H₂O → H₂ + ½ O₂. Requires 1.23 V minimum.
- Electroplating: deposit metal on object.
- Aluminum production (Hall-Héroult process): Al₂O₃ → Al + O₂.

Electrolytic cells: anode is + and cathode is - (opposite of galvanic, because external source drives).`,
    },
    {
      code: '9.5',
      title: 'Cell potential under nonstandard conditions',
      content:
`Real batteries don't operate at standard conditions. Concentration changes as battery discharges.

**Nernst equation:**
E = E° - (RT/nF) ln Q

At 25°C:
E = E° - (0.0592/n) log Q

- E = actual cell potential.
- E° = standard cell potential.
- n = moles e⁻ transferred.
- Q = reaction quotient.

**Behavior.**
- When Q < K: E > 0 (forward spontaneous).
- When Q = K: E = 0 (battery dead).
- When Q > K: E < 0 (reverse spontaneous).

**Worked example.** Zn-Cu cell with [Zn²⁺] = 1.0 M, [Cu²⁺] = 0.01 M. T = 25°C.

Q = [Zn²⁺]/[Cu²⁺] = 1.0/0.01 = 100.
E = 1.10 - (0.0592/2) × log(100) = 1.10 - 0.0296 × 2 = 1.10 - 0.0592 = **1.04 V**.

Lower than standard 1.10 V because product concentration is high.

**Implications.**
- Battery voltage drops over time as Q approaches K.
- Battery dead when Q = K (no more driving force).
- Concentration cells: same metal in both half-cells but different concentrations. Voltage drives flow from concentrated to dilute side.

**Why concentration matters.**
- Real batteries: voltage drops as they discharge.
- pH electrodes: use concentration cells with H⁺ at known vs unknown concentration.
- Biological membrane potentials are concentration cells (~-70 mV in neurons from K⁺ asymmetry).`,
    },
    {
      code: '9.6',
      title: 'Electrolysis and Faraday\'s law',
      content:
`**Electrolysis** uses electrical energy to drive non-spontaneous reactions.

**Faraday\'s law of electrolysis:**
moles of substance produced = (charge passed) / (n × F)

where:
- charge = current (A) × time (s) = coulombs (C).
- n = moles of electrons per mole of product.
- F = Faraday\'s constant = 96,485 C/mol.

**Worked example.** Electrolyze water for 1 hour at 10 A. How much H₂?
- Total charge = 10 × 3600 = 36,000 C.
- For H₂O reduction: 2 H⁺ + 2 e⁻ → H₂. n = 2.
- mol H₂ = 36,000 / (2 × 96,485) = 0.187 mol.
- mass H₂ = 0.187 × 2.02 = 0.378 g.
- volume H₂ at STP = 0.187 × 22.4 = 4.19 L.

**Common electrolysis applications:**

**Hall-Héroult (aluminum).** Al₂O₃ dissolved in molten cryolite (Na₃AlF₆); electrolysis at 950°C. Cathode: Al³⁺ → Al(l). Anode: O²⁻ → O₂(g). Consumes ~13-15 kWh per kg Al — energy-intensive.

**Chlor-alkali (chlorine + NaOH).** NaCl(aq) electrolysis. Cathode: 2 H₂O + 2 e⁻ → H₂ + 2 OH⁻. Anode: 2 Cl⁻ → Cl₂ + 2 e⁻. Massive industrial process.

**Electroplating.** Coat one metal with another. Object is cathode; metal ions in solution reduce onto it. Cu electroplating in printed circuit boards; chrome plating cars; silverware silver plating.

**Refining metals.** Crude Cu anode dissolves; pure Cu deposits on cathode. Impurities (Ag, Au) collect as sludge.

**Water electrolysis (green hydrogen).** 2 H₂O → 2 H₂ + O₂. Uses renewable electricity. Stores energy in H₂ for later use. Growing in importance for energy transition.

**Why electrolysis matters.** Powered by external source, can drive any redox reaction with enough voltage. Limited only by efficiency and cost of electricity.`,
    },
  ],
  keyConcepts: [
    'Entropy (S) measures disorder. Gas > liquid > solid.',
    'ΔS_rxn from tabulated S° values: products - reactants.',
    'Second law: ΔS_universe > 0 for spontaneous processes.',
    'ΔG = ΔH - TΔS. ΔG < 0 spontaneous; ΔG = 0 equilibrium.',
    'Four combinations of signs predict T-dependence of spontaneity.',
    'ΔG = ΔG° + RT ln Q (non-standard); ΔG° = -RT ln K at equilibrium.',
    'Coupled reactions: ΔG_total = ΔG₁ + ΔG₂. ATP drives endergonic biology.',
    'Galvanic cell: spontaneous redox; E°cell > 0; ΔG° < 0.',
    'E°cell = E°cathode - E°anode (both as reductions).',
    'ΔG° = -nFE°. Nernst gives E under nonstandard conditions.',
    'Electrolysis: external voltage drives non-spontaneous reactions. Faraday: mol = It/(nF).',
  ],
  formulas: [
    {
      name: 'Gibbs free energy',
      equation: 'ΔG = ΔH - TΔS',
      meaning: 'Determines spontaneity. Watch units (ΔH in kJ, ΔS in J).',
      example: 'Ice melt at 0°C: ΔG = 6.01 - 273(0.022) = 0 → equilibrium. Above 0°C, melting spontaneous.',
    },
    {
      name: 'Cell potential and free energy',
      equation: 'ΔG° = -n F E°',
      meaning: 'Galvanic cell with positive E° has negative ΔG → spontaneous.',
      example: 'Zn-Cu cell: E° = 1.10 V, n = 2 → ΔG° = -212 kJ/mol.',
    },
    {
      name: 'Faraday\'s law of electrolysis',
      equation: 'mol = (I × t) / (n × F)',
      meaning: 'Moles of product from current × time. F = 96,485 C/mol.',
      example: 'Electrolyze H₂O at 10 A for 1 hr: produces 0.187 mol H₂ (~4.2 L at STP).',
    },
  ],
  practice: [
    {
      q: 'Predict the sign of ΔS for: (a) freezing water, (b) dissolving sugar in water, (c) burning methane CH₄ + 2 O₂ → CO₂ + 2 H₂O(g).',
      a: '(a) ΔS < 0 (liquid → solid; more order). (b) ΔS > 0 (ordered solid → dispersed in solution). (c) ΔS small (3 mol gas → 3 mol gas), maybe slightly + (more molecules, freer motion).',
    },
    {
      q: 'For Cu²⁺ + Fe → Cu + Fe²⁺, E°cell = 0.34 - (-0.44) = 0.78 V. Is it spontaneous?',
      a: 'Yes. E°cell > 0 → ΔG° < 0 → spontaneous. Iron displaces copper from solution. Used in cementation refining.',
    },
    {
      q: 'How long must you electrolyze water at 5 A to produce 1.0 g of H₂?',
      a: '1.0 g H₂ = 0.5 mol. Need 0.5 × 2 = 1.0 mol e⁻ = 1.0 × 96,485 C = 96,485 C. t = Q/I = 96,485 / 5 = 19,300 s = 5.4 hours.',
    },
  ],
  pitfalls: [
    '"Spontaneous means fast" — no! Diamond → graphite is spontaneous but extremely slow.',
    '"ΔS = ΔH" — wrong. Different quantities; check units.',
    '"Equilibrium means equal amounts" — no. Equal forward/reverse rates.',
    '"Anode is always +" — only in electrolytic cell. In galvanic cell, anode is - (electrons leaving).',
    '"Higher voltage means more current" — Ohm\'s law: I = V/R. Voltage and current are different.',
    '"E° depends on amount of reactant" — no. E° is intensive; the same per mole regardless of cell size.',
  ],
};
