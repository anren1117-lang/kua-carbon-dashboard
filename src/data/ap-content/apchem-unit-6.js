// AP Chemistry Unit 6 — Thermodynamics (7-9%)

export const APCHEM_UNIT_6 = {
  number: 6,
  title: 'Thermodynamics',
  weight: '7-9%',
  subunits: [
    {
      code: '6.1',
      title: 'Endothermic and exothermic processes',
      content:
`Energy is transferred during chemical and physical changes.

**Endothermic.** System absorbs heat (q > 0). Surroundings cool. Feels cold.
- Melting ice, evaporating water, photosynthesis, ammonium nitrate dissolving (instant cold packs).

**Exothermic.** System releases heat (q < 0). Surroundings warm. Feels warm.
- Combustion, condensation, cellular respiration, neutralization, hand warmers (iron + O₂).

**Sign convention.**
- + heat in or work in (system gains energy).
- - heat out or work out (system loses energy).

**Heat (q)** vs **work (w)** vs **internal energy (U)**:
ΔU = q + w

**Calorimetry.** Measure heat by tracking temperature changes in a known system.

Heat absorbed/released:
q = mcΔT

- m = mass.
- c = specific heat capacity (J/g·°C). Water = 4.184 J/g·°C.
- ΔT = T_final - T_initial.

**Worked example.** How much heat to raise 200 g water from 20°C to 80°C?
q = 200 × 4.184 × 60 = 50,200 J = 50.2 kJ.

**Bomb calorimeter.** Closed rigid vessel for combustion reactions. Measures heat at constant volume.

**Coffee cup calorimeter.** Open at constant pressure. Used in many AP labs.`,
    },
    {
      code: '6.2',
      title: 'Heat capacity and calorimetry',
      content:
`**Specific heat capacity (c)** = heat needed to raise 1 g by 1°C. Units J/(g·°C) or J/(g·K).
- Water: 4.184 J/(g·°C) — unusually high.
- Iron: 0.45 J/(g·°C).
- Aluminum: 0.90 J/(g·°C).
- Air: ~1 J/(g·°C).

**Molar heat capacity** = heat per mole per degree. Cp (constant pressure) or Cv (constant volume).

**Calorimetry equations:**
q = mcΔT (for warming/cooling a substance)
q = m × ΔH_phase (for phase change)

For phase changes, T doesn't change while heat is added — energy goes into breaking IMFs.

**Heating curves.** Plot of T vs heat added shows:
- Diagonal line in each phase (slope = 1/(mc)).
- Horizontal plateau at melting and boiling points (phase changes).
- Steeper diagonal in gas/solid; shallow in liquid (water has high c in liquid).

**Calorimetry problem.** A 50 g block of metal at 100°C placed in 200 g water at 25°C. Final T = 28°C. Find specific heat of metal.
- Heat lost by metal = heat gained by water.
- m_m c_m ΔT_m = m_w c_w ΔT_w.
- 50 × c_m × (100 - 28) = 200 × 4.184 × (28 - 25).
- 50 × c_m × 72 = 2510.
- c_m = 2510 / 3600 = 0.697 J/(g·°C).

**Why this matters.** Climate control, refrigeration, engine cooling, baking, weather (oceans moderate climate because water has such high c).`,
    },
    {
      code: '6.3',
      title: 'Energy of phase changes',
      content:
`Phase changes involve breaking/forming IMFs. Each requires (or releases) specific heat.

**Heats of phase change:**
- **Heat of fusion (ΔH_fus)**: solid → liquid. Water = 6.01 kJ/mol or 334 J/g.
- **Heat of vaporization (ΔH_vap)**: liquid → gas. Water = 40.7 kJ/mol or 2260 J/g.
- **Heat of sublimation**: solid → gas (ΔH_fus + ΔH_vap for two-step process).

**Why ΔH_vap >> ΔH_fus.** Vaporization breaks ALL IMFs (liquid → gas with negligible interactions). Fusion just makes solid lattice able to flow (still in liquid with IMFs).

**Calculating heat for phase changes:**
q = n × ΔH (moles × molar heat)
or q = m × specific heat of phase change (g × J/g)

**Worked example.** How much heat to vaporize 50 g water at 100°C?
50 g × 2260 J/g = 113,000 J = 113 kJ.

**Heating from -10°C ice to 110°C steam (per 1 g)** has 5 stages:
1. Warm ice from -10 to 0: 1 × 2.1 × 10 = 21 J.
2. Melt ice at 0°C: 1 × 334 = 334 J.
3. Warm water from 0 to 100: 1 × 4.184 × 100 = 418.4 J.
4. Vaporize water at 100°C: 1 × 2260 = 2260 J.
5. Warm steam from 100 to 110: 1 × 2.0 × 10 = 20 J.
Total: 3053 J per gram.

Notice steps 2 and 4 (phase changes) dominate. This is why steam burns are so much worse than hot water burns — much more heat per gram.`,
    },
    {
      code: '6.4',
      title: 'Enthalpy of reaction',
      content:
`**Enthalpy (H)** = heat at constant pressure. **ΔH_rxn** = heat absorbed or released per mole of reaction.

**Sign convention:**
- ΔH < 0: exothermic.
- ΔH > 0: endothermic.

**Standard enthalpy of formation (ΔH_f°).** Heat absorbed to form 1 mol of a substance from its elements in standard states (1 atm, 25°C).
- ΔH_f° of elements in standard state = 0 (O₂, H₂, Cl₂, Na, etc.).
- ΔH_f° of H₂O(l) = -285.8 kJ/mol. Negative because forming water from H₂ + O₂ releases energy.

**Calculating ΔH_rxn from heats of formation:**
ΔH_rxn = Σ n ΔH_f°(products) - Σ n ΔH_f°(reactants)

**Worked example.** Combustion of methane:
CH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(l)
ΔH_f°: CH₄ = -74.8; O₂ = 0; CO₂ = -393.5; H₂O = -285.8.
ΔH_rxn = [1(-393.5) + 2(-285.8)] - [1(-74.8) + 0]
       = [-393.5 - 571.6] - [-74.8]
       = -965.1 + 74.8 = **-890.3 kJ/mol CH₄ burned**.

Very exothermic — that's why natural gas is a major fuel.

**Why this works.** Hess's law: enthalpy is a state function (depends only on initial and final states, not path).`,
    },
    {
      code: '6.5',
      title: 'Hess\'s law',
      content:
`**Hess\'s law.** If a reaction can be expressed as a sum of two or more reactions, its ΔH equals the sum of the ΔH of those reactions.

**Implication.** You can calculate ΔH for reactions you can't directly measure.

**Worked example.** Find ΔH for: C(graphite) + ½ O₂ → CO(g).

Hard to measure directly (might get full combustion to CO₂). But you can measure:
(1) C(graphite) + O₂ → CO₂  ΔH₁ = -393.5 kJ
(2) CO(g) + ½ O₂ → CO₂  ΔH₂ = -283.0 kJ

Reverse (2): CO₂ → CO + ½ O₂  ΔH = +283.0 kJ.
Add to (1): C + O₂ + CO₂ → CO₂ + CO + ½ O₂.
Simplify: C + ½ O₂ → CO. ΔH = -393.5 + 283.0 = **-110.5 kJ/mol**.

**Rules for manipulating reactions:**
- If you reverse a reaction, ΔH changes sign.
- If you multiply a reaction by n, multiply ΔH by n.
- Combine reactions; ΔH adds.

**Hess\'s law applications.**
- Calculate ΔH for reactions involving unstable intermediates.
- Connect related reactions.
- Justify using heats of formation (because ΔH_f are themselves applied via Hess\'s law).`,
    },
    {
      code: '6.6',
      title: 'Enthalpy of reaction from bond energies',
      content:
`Reactions involve breaking and forming bonds.

**Bond energy** = energy needed to break a bond (always positive). Bond formation releases the same amount.

**ΔH_rxn from bond energies:**
ΔH = Σ bonds broken - Σ bonds formed

**Approximate.** Bond energies are averages; not exact for any given compound.

**Worked example.** H₂ + Cl₂ → 2 HCl.
Bonds broken: 1 H-H (436 kJ) + 1 Cl-Cl (242 kJ) = 678 kJ in.
Bonds formed: 2 H-Cl (431 kJ each) = 862 kJ out.
ΔH = 678 - 862 = **-184 kJ** (exothermic — explosion).

**Why this works.** If forming bonds releases more energy than breaking bonds requires, the reaction is exothermic.

**Comparison with heats of formation.**
- Bond energies: approximate (averaged).
- ΔH_f°: exact (measured per compound).

Use whichever data is given.`,
    },
    {
      code: '6.7',
      title: 'Heats of formation',
      content:
`**Heat of formation (ΔH_f°)**: enthalpy change when 1 mol of a compound forms from its elements in standard states.

**Standard state conditions:**
- 1 atm pressure.
- 25°C (298 K).
- Specified phase (often the most stable at standard conditions).

**Elements have ΔH_f° = 0** in their standard state:
- O₂(g), N₂(g), H₂(g), Cl₂(g), Na(s), C(graphite — NOT diamond), Br₂(l), Hg(l), etc.

**Examples:**
- H₂O(l): -285.8 kJ/mol.
- H₂O(g): -241.8 kJ/mol (less negative — vapor has less stability).
- CO₂(g): -393.5 kJ/mol.
- C₆H₁₂O₆(s): -1273 kJ/mol.

**Negative ΔH_f° = stable compound** (releases energy when formed).
**Positive ΔH_f° = unstable** (requires energy to form). NO is +90 kJ/mol — somewhat unstable but kinetically inert.

**Calculating ΔH_rxn:**
ΔH_rxn = Σ n × ΔH_f°(products) - Σ n × ΔH_f°(reactants)

Coefficients (n) come from balanced equation.

**Worked example.** Photosynthesis: 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂.
Using ΔH_f° values (kJ/mol): CO₂ = -393.5, H₂O(l) = -285.8, glucose = -1273, O₂ = 0.

ΔH = [1(-1273) + 6(0)] - [6(-393.5) + 6(-285.8)]
   = -1273 - [(-2361) + (-1715)]
   = -1273 + 4076 = **+2803 kJ/mol glucose**.

Very endothermic — that's why photosynthesis needs the sun (light energy).`,
    },
  ],
  keyConcepts: [
    'Endothermic: q > 0, system absorbs heat. Exothermic: q < 0, system releases heat.',
    'q = mcΔT for warming/cooling.',
    'q = m × ΔH for phase change. ΔH_vap > ΔH_fus.',
    'ΔH_rxn from heats of formation: products - reactants (weighted by n).',
    'ΔH_f° of elements in standard state = 0.',
    'Hess\'s law: ΔH is path-independent.',
    'ΔH from bond energies: bonds broken (in) - bonds formed (out).',
    'Negative ΔH_rxn = exothermic; positive = endothermic.',
  ],
  formulas: [
    {
      name: 'Heat (warming/cooling)',
      equation: 'q = m c ΔT',
      meaning: 'Heat to change temperature without phase change.',
      example: '500 g water from 20→80°C: q = 500 × 4.184 × 60 = 125,520 J = 125.5 kJ.',
    },
    {
      name: 'ΔH from heats of formation',
      equation: 'ΔH_rxn = Σ n ΔH_f°(products) - Σ n ΔH_f°(reactants)',
      meaning: 'Use tabulated heats of formation; subtract reactants from products.',
      example: 'Combustion CH₄: -890 kJ/mol.',
    },
  ],
  practice: [
    {
      q: 'A 25 g iron block at 100°C is placed in 100 g water at 22°C. Final T = 24°C. What is the specific heat of iron?',
      a: 'Heat lost by iron = heat gained by water. 25 × c × (100-24) = 100 × 4.184 × (24-22). 1900 c = 836.8. c = 0.44 J/(g·°C).',
    },
    {
      q: 'Why is steam more dangerous than boiling water at the same temperature?',
      a: 'Steam releases its heat of vaporization (2260 J/g) when condensing on skin, plus cooling from 100°C. Hot water just releases cooling heat. Same mass of steam delivers ~5× more energy.',
    },
    {
      q: 'Using ΔH_f°: H₂O(l) = -285.8, H₂O(g) = -241.8. What is ΔH for H₂O(l) → H₂O(g)?',
      a: 'ΔH = ΔH_f°(g) - ΔH_f°(l) = -241.8 - (-285.8) = +44.0 kJ/mol. Endothermic (vaporization absorbs heat).',
    },
  ],
  pitfalls: [
    '"Higher temperature means more heat" — wrong. Heat depends on mass and specific heat as well.',
    '"All exothermic reactions are spontaneous" — wrong. ΔG depends on both ΔH and TΔS.',
    '"Bond energies give exact ΔH" — approximate; tabulated values are averages.',
    '"You can ignore the phase in ΔH_f°" — wrong. H₂O(l) and H₂O(g) have different ΔH_f°.',
    '"Water has low specific heat" — opposite. Water has unusually high specific heat (4.184 J/g·°C).',
  ],
};
