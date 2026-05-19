// General teaching resources — CED-aligned content for KUA AP courses,
// with NO requirement that the resource tie to the carbon dashboard.
// This complements lessonLibrary.js (which is carbon-tied) and
// apUnitMap.js (which is carbon-tied unit-by-unit hooks).
//
// Purpose: when a KUA teacher opens /teacher looking for material to
// drop into class, they should find something useful even if the day's
// topic has nothing to do with carbon. AP Chem covers stoichiometry
// before it ever touches combustion; AP Lit reads Shakespeare before
// it reads Dillard. Teachers deserve material for those weeks too.
//
// Each resource has:
//   id, title, subject, course, cedUnit, format, durationMin,
//   summary, content (the actual teaching material).
//
// Content style: tight, drop-in-class ready. Not a textbook
// replacement — a starter the teacher extends.

export const SUBJECTS = [
  'Science',
  'Mathematics',
  'Computer Science',
  'History & Social Sciences',
  'English',
  'Visual Arts',
  'Performing Arts',
  'World Languages',
];

export const RESOURCE_FORMATS = [
  'Worked example',
  'Practice problems',
  'Quick reference',
  'Discussion prompts',
  'Writing template',
  'Concept brief',
  'Lab template',
  'Rubric',
  'Vocabulary sheet',
];

export const teachingResources = [
  // ──────────────────────────────────────────────────────────────
  // SCIENCE — AP CHEMISTRY
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apchem_stoich_worked',
    title: 'Stoichiometry — limiting reagent worked example',
    subject: 'Science',
    course: 'AP Chemistry',
    cedUnit: 'Unit 4: Chemical Reactions',
    format: 'Worked example',
    durationMin: 15,
    summary: 'Full step-by-step solution to a classic limiting-reagent problem with three reactants. Includes the common student error.',
    content: `**Problem:** Given 4.5 mol Al, 5.0 mol Cl₂, react to form AlCl₃.
2 Al + 3 Cl₂ → 2 AlCl₃. Which is limiting? How much AlCl₃ forms?

**Step 1:** Compute moles AlCl₃ each reactant could produce.
- Al: 4.5 mol × (2 mol AlCl₃ / 2 mol Al) = 4.5 mol AlCl₃
- Cl₂: 5.0 mol × (2 mol AlCl₃ / 3 mol Cl₂) = 3.33 mol AlCl₃

**Step 2:** Smaller value = limiting reagent. Cl₂ is limiting. Theoretical yield = 3.33 mol AlCl₃.

**Step 3:** Compute excess Al unreacted.
- Cl₂ uses: 5.0 mol × (2 mol Al / 3 mol Cl₂) = 3.33 mol Al
- Al left over: 4.5 − 3.33 = 1.17 mol Al excess

**Common student error:** assuming the reagent with the smaller starting amount is limiting. Wrong — always convert to product first.`,
  },
  {
    id: 'tr_apchem_ice_table',
    title: 'ICE table — equilibrium quick reference',
    subject: 'Science',
    course: 'AP Chemistry',
    cedUnit: 'Unit 7: Equilibrium',
    format: 'Quick reference',
    durationMin: 10,
    summary: 'When to use an ICE table, the standard layout, and the "5% rule" approximation for weak acid/base equilibria.',
    content: `**When to use:** any equilibrium problem where you know Kc or Kp and starting concentrations.

**Standard layout** for aA + bB ⇌ cC + dD:
\`\`\`
              A      B      C      D
Initial      [A]₀   [B]₀    0      0
Change       −ax    −bx    +cx    +dx
Equilibrium  [A]₀−ax [B]₀−bx cx    dx
\`\`\`

**Plug into Kc:** Kc = ([C]^c × [D]^d) / ([A]^a × [B]^b)

**5% rule shortcut (weak acids/bases):**
If Ka < 10⁻⁴ AND [HA]₀ > 10⁻² M, then [HA]₀ − x ≈ [HA]₀.
This drops the quadratic and lets you solve x = √(Ka × [HA]₀).

**Check:** if x / [HA]₀ < 5%, approximation valid. Otherwise solve quadratic.`,
  },
  {
    id: 'tr_apchem_acidbase_titration',
    title: 'Acid-base titration curves — what to look for',
    subject: 'Science',
    course: 'AP Chemistry',
    cedUnit: 'Unit 8: Acids and Bases',
    format: 'Concept brief',
    durationMin: 12,
    summary: 'Reading a titration curve: equivalence point, half-equivalence point, and how to extract Ka from the graph.',
    content: `**Four key features on every titration curve:**

1. **Initial pH** — pH of pure analyte. Use Ka or Kb to compute.
2. **Half-equivalence point** — pH = pKa. This is the easiest way to find Ka from experimental data.
3. **Equivalence point** — moles acid = moles base. Steepest slope. Indicator chosen to match its pH.
4. **Buffer region** — gradual slope before equivalence. Henderson-Hasselbalch applies.

**Common errors students make:**
- Confusing equivalence point with "neutral pH = 7." For a weak acid + strong base, equivalence pH > 7.
- Choosing the wrong indicator (phenolphthalein for HCl/NaOH is fine; for CH₃COOH/NaOH, also fine — but methyl red would fail).

**Quick question to ask the class:** A titration of 25 mL 0.10 M acetic acid (Ka = 1.8×10⁻⁵) with 0.10 M NaOH. What's the pH at the half-equivalence point? **Answer: pH = pKa = 4.74.**`,
  },
  {
    id: 'tr_apchem_kinetics_rate_law',
    title: 'Rate law from initial rates — three-trial method',
    subject: 'Science',
    course: 'AP Chemistry',
    cedUnit: 'Unit 5: Kinetics',
    format: 'Worked example',
    durationMin: 15,
    summary: 'How to determine order with respect to each reactant from initial-rate data. Three trials, exact algebra, no calculus.',
    content: `**Problem:** For A + B → products,

| Trial | [A]₀ | [B]₀ | Rate (M/s) |
|---|---|---|---|
| 1 | 0.10 | 0.10 | 0.0020 |
| 2 | 0.20 | 0.10 | 0.0080 |
| 3 | 0.20 | 0.20 | 0.0160 |

**Step 1:** Vary A, hold B (trials 1 & 2). [A] doubled, rate × 4. So rate ∝ [A]². Order in A = 2.

**Step 2:** Vary B, hold A (trials 2 & 3). [B] doubled, rate × 2. Order in B = 1.

**Step 3:** Rate law: rate = k[A]²[B].

**Step 4:** Solve for k from any trial. Use trial 1:
0.0020 = k × (0.10)² × (0.10) → k = 2.0 M⁻²·s⁻¹

**Units of k** depend on overall order. Always derive them, don't memorize.`,
  },
  {
    id: 'tr_apchem_electrochem_shortcut',
    title: 'Electrochemistry — galvanic vs electrolytic shortcut',
    subject: 'Science',
    course: 'AP Chemistry',
    cedUnit: 'Unit 9: Applications of Thermodynamics',
    format: 'Quick reference',
    durationMin: 10,
    summary: 'How to tell galvanic from electrolytic cells, and the sign conventions that trip up half the AP class.',
    content: `**Galvanic (voltaic):** spontaneous, ΔG < 0, E°_cell > 0. Generates electricity.
**Electrolytic:** non-spontaneous, ΔG > 0, E°_cell < 0. Consumes electricity.

**Cathode is always reduction, anode is always oxidation** — in both cell types. What changes is the *charge sign* of the electrodes:

| Cell type | Anode | Cathode |
|---|---|---|
| Galvanic | Negative | Positive |
| Electrolytic | Positive | Negative |

**Compute E°_cell:** E°_cathode − E°_anode (both from standard reduction tables, don't flip signs).

**Connect to ΔG:** ΔG° = −nFE°. n = electrons transferred, F = 96,485 C/mol.

**Common student error:** flipping the anode half-reaction's E° to "make it oxidation." Don't. Subtract using both reduction potentials as-listed.`,
  },

  // ──────────────────────────────────────────────────────────────
  // SCIENCE — AP BIOLOGY
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apbio_photosynthesis_summary',
    title: 'Photosynthesis vs cellular respiration — comparison table',
    subject: 'Science',
    course: 'AP Biology',
    cedUnit: 'Unit 3: Cellular Energetics',
    format: 'Quick reference',
    durationMin: 8,
    summary: 'Side-by-side of the two energy-transformation processes that show up in every AP Bio FRQ on energetics.',
    content: `| | Photosynthesis | Cellular respiration |
|---|---|---|
| Equation | 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ | C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O |
| Location | Chloroplast (thylakoid + stroma) | Mitochondrion (matrix + cristae) |
| Energy in | Light + low-energy molecules | High-energy organic molecules |
| Energy out | Stored chemical (glucose) | Usable chemical (ATP) |
| Electron carrier | NADPH | NADH, FADH₂ |
| ATP yield | ~30 ATP in light reactions (used to make glucose) | ~32 net ATP per glucose |
| O₂ role | Produced | Consumed (terminal electron acceptor) |

**Mantra:** photosynthesis stores; respiration spends.

**Key teaching question:** "Where do the carbons in glucose come from?" → CO₂. "Where does the oxygen in O₂ come from?" → H₂O (proven by isotope labeling). Students often guess wrong.`,
  },
  {
    id: 'tr_apbio_hardy_weinberg',
    title: 'Hardy-Weinberg — the only equations you need',
    subject: 'Science',
    course: 'AP Biology',
    cedUnit: 'Unit 7: Natural Selection',
    format: 'Quick reference',
    durationMin: 10,
    summary: 'The two equations, the five conditions, and the standard FRQ trap.',
    content: `**The two equations:**
1. **p + q = 1** (allele frequencies)
2. **p² + 2pq + q² = 1** (genotype frequencies: AA + Aa + aa)

**Five conditions for equilibrium (memorize):**
- No mutation
- No migration (gene flow in/out)
- No natural selection
- Random mating
- Large population (no genetic drift)

**The standard FRQ trap:**
"In a population, 16% show the recessive phenotype. What % are heterozygous carriers?"
- q² = 0.16 → q = 0.4
- p = 0.6
- 2pq = 2(0.6)(0.4) = **0.48 → 48% carriers**

**Common student error:** thinking 16% recessive means q = 0.16. No — q² = 0.16.`,
  },
  {
    id: 'tr_apbio_mitosis_meiosis',
    title: 'Mitosis vs meiosis — what students get wrong',
    subject: 'Science',
    course: 'AP Biology',
    cedUnit: 'Unit 4: Cell Communication and Cell Cycle',
    format: 'Concept brief',
    durationMin: 12,
    summary: 'The three differences that matter for the AP exam, and the diagrams to draw on the board.',
    content: `**Mitosis** = one round of division, two diploid (2n) daughter cells, genetically identical to parent. Purpose: growth + repair.

**Meiosis** = two rounds, four haploid (n) daughter cells, genetically different. Purpose: gamete production.

**Three differences to drill:**

1. **Crossing over in Prophase I of meiosis** (mitosis: never). Produces genetic variation. Draw the chiasma on the board.
2. **Synapsis + tetrads in Prophase I** — homologous chromosomes pair up. Doesn't happen in mitosis.
3. **Sister chromatids separate in different phases.** Mitosis: Anaphase. Meiosis: Anaphase II (Anaphase I separates homologous pairs, not sister chromatids).

**FRQ-style question to ask:** "Why does meiosis produce variation but mitosis doesn't?" — three reasons (crossing over, independent assortment, random fertilization) — first two are *within* meiosis.`,
  },
  {
    id: 'tr_apbio_signal_transduction',
    title: 'Signal transduction — the three-step universal pathway',
    subject: 'Science',
    course: 'AP Biology',
    cedUnit: 'Unit 4: Cell Communication and Cell Cycle',
    format: 'Concept brief',
    durationMin: 10,
    summary: 'Every signal transduction pathway has the same three phases. Learn the pattern, plug in any specific example.',
    content: `**Three phases, every time:**

1. **Reception** — signal molecule binds receptor (membrane-bound or intracellular).
2. **Transduction** — signal converted into intracellular response, typically through a cascade of protein modifications (phosphorylation amplifies the signal at each step).
3. **Response** — change in gene expression, enzyme activity, or cell behavior.

**Two classic examples to know:**
- **G-protein-coupled receptor (GPCR)**: signal → GPCR → G-protein activation → enzyme (e.g. adenylyl cyclase) → second messenger (cAMP) → protein kinase A → response.
- **Receptor tyrosine kinase (RTK)**: signal → dimerization → autophosphorylation → relay proteins → response.

**Key teaching point:** the cascade is for *amplification* — one signal molecule can trigger thousands of downstream events. Pair this with a numerical estimate: 1 epinephrine → ~10⁸ glucose released.`,
  },

  // ──────────────────────────────────────────────────────────────
  // SCIENCE — AP PHYSICS C
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apphys_kinematics_eqns',
    title: 'Kinematics equations — the 4 you actually need',
    subject: 'Science',
    course: 'AP Physics C',
    cedUnit: 'Unit 1: Kinematics',
    format: 'Quick reference',
    durationMin: 8,
    summary: 'Constant-acceleration kinematics. Picking the right equation by what you DON\'T know.',
    content: `**The four equations (1-D, constant a):**

1. v = v₀ + at  *(no x)*
2. x = x₀ + v₀t + ½at²  *(no v)*
3. v² = v₀² + 2a(x − x₀)  *(no t)*
4. x = x₀ + ½(v + v₀)t  *(no a)*

**How to pick:** identify what's missing from the problem. The equation that doesn't include it is yours.

**Common student error:** assuming a = g = 9.8 m/s² is positive going up. Pick a convention (up is positive, then a = −9.8) and stick with it the whole problem.

**Vector form:** for 2-D, decompose into x and y. Time is the only variable that ties them together. Projectile motion: a_x = 0, a_y = −g.`,
  },
  {
    id: 'tr_apphys_energy_problems',
    title: 'Energy conservation — three-step problem method',
    subject: 'Science',
    course: 'AP Physics C',
    cedUnit: 'Unit 3: Work, Energy, and Power',
    format: 'Worked example',
    durationMin: 18,
    summary: 'A roller-coaster problem solved by energy conservation, showing why it\'s usually faster than using kinematics + forces.',
    content: `**Problem:** Cart starts at rest at height h₁ = 30 m. Track is frictionless. What's its speed at height h₂ = 12 m?

**Step 1:** Pick reference frame. Let h = 0 at the ground.

**Step 2:** Write energy conservation: E_i = E_f.
KE_i + PE_i = KE_f + PE_f
0 + mgh₁ = ½mv² + mgh₂

**Step 3:** Solve. Mass cancels.
v = √(2g(h₁ − h₂)) = √(2 × 9.8 × 18) = √352.8 ≈ 18.8 m/s

**Why this beats kinematics:** the track shape doesn't matter for energy conservation. With kinematics you'd need to integrate along the curve.

**Add friction:** include W_friction (negative, since opposing motion):
KE_i + PE_i + W_friction = KE_f + PE_f`,
  },
  {
    id: 'tr_apphys_torque_practice',
    title: 'Rotational dynamics — torque + moment of inertia practice',
    subject: 'Science',
    course: 'AP Physics C',
    cedUnit: 'Unit 5: Rotation',
    format: 'Practice problems',
    durationMin: 25,
    summary: 'Five short problems mixing τ = Iα, rotational kinetic energy, and angular momentum conservation.',
    content: `**1.** A 5 kg disk of radius 0.20 m rotates at 10 rad/s. KE = ? **Answer:** ½Iω² = ½(½ × 5 × 0.20²)(10²) = 5 J.

**2.** Torque needed to give the same disk angular acceleration of 4 rad/s²? **Answer:** τ = Iα = (0.10)(4) = 0.40 N·m.

**3.** A figure skater spinning at 2 rev/s pulls arms in, reducing I by half. New rate? **Answer:** L conserved → ω₂ = 4 rev/s.

**4.** A 2 kg ball rolls without slipping down a 30° incline of length 4 m. Speed at bottom? **Answer:** Use mgh = ½mv² + ½Iω² with I = (2/5)mr² for a solid sphere and v = rω. Get v = √(10gh/7) = √(10 × 9.8 × 2/7) ≈ 5.3 m/s.

**5.** A rod of length L pivoted at one end falls from horizontal. Angular speed at vertical? **Answer:** Energy conservation: mg(L/2) = ½Iω², I = (1/3)mL². So ω = √(3g/L).

**Pedagogical note:** Problem 3 is the hardest because students forget that L (angular momentum) is what's conserved, not ω.`,
  },

  // ──────────────────────────────────────────────────────────────
  // SCIENCE — AP ENVIRONMENTAL SCIENCE
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apenv_biomes',
    title: 'Biomes cheat sheet — climate + dominant flora',
    subject: 'Science',
    course: 'AP Environmental Science',
    cedUnit: 'Unit 1: The Living World - Ecosystems',
    format: 'Quick reference',
    durationMin: 8,
    summary: 'The 9 terrestrial biomes with the temperature/precipitation ranges that distinguish them on the AP exam.',
    content: `**Tropical rainforest:** 20–25°C, 200–400 cm/yr. Canopy emergents, lianas, epiphytes. Highest biodiversity.

**Tropical seasonal forest / savanna:** 20–30°C, 100–200 cm/yr (with dry season). Grasses + scattered trees.

**Subtropical desert:** 20–30°C, < 25 cm/yr. CAM/C4 plants, low diversity.

**Temperate grassland:** −10 to 25°C, 25–75 cm/yr. Tall vs short grasses by latitude. Most fertile soils.

**Temperate forest:** 0–20°C, 75–150 cm/yr. Deciduous + conifer mix. **KUA sits here.**

**Boreal forest (taiga):** −5 to 5°C, 30–85 cm/yr. Coniferous evergreens (spruce, fir, pine).

**Tundra:** < 0°C, < 25 cm/yr. Permafrost. Lichens, mosses, low shrubs.

**Chaparral:** 10–20°C with wet winters / dry summers. Fire-adapted shrubs.

**Mountain (alpine):** highly variable with elevation. Zones mirror latitude.

**Memory trick:** plot biomes on a temperature × precipitation grid. AP exam loves "given climate data, name the biome."`,
  },
  {
    id: 'tr_apenv_water_quality',
    title: 'Water quality indicators — what each one measures',
    subject: 'Science',
    course: 'AP Environmental Science',
    cedUnit: 'Unit 8: Aquatic and Terrestrial Pollution',
    format: 'Quick reference',
    durationMin: 8,
    summary: 'The six indicators that show up on AP Env Sci FRQs and what they tell you about water health.',
    content: `**Dissolved oxygen (DO):** mg/L of O₂ in water. Higher = healthier. Drops with temperature, salinity, and decomposition activity. < 5 mg/L stresses fish.

**Biological oxygen demand (BOD):** mg/L of O₂ that microbes consume in 5 days. Higher = more organic pollution. Tells you decomposition load on the water body.

**pH:** 6.5–8.5 normal. Acid mine drainage drives down; concrete runoff drives up. Acid rain effects shown in salamander egg viability.

**Turbidity:** NTU (nephelometric turbidity units). Suspended particles blocking light. High turbidity kills aquatic plants (no photosynthesis).

**Nitrate (NO₃⁻) + phosphate (PO₄³⁻):** mg/L of dissolved nutrients. Above natural levels → eutrophication → algal bloom → BOD spike → fish kill. Standard pathway.

**Fecal coliform:** colony-forming units per 100 mL. Indicator of sewage contamination. EPA recreational limit: 200 CFU/100 mL.

**Teaching tactic:** give students a 3-line water-quality report and ask "what happened upstream of this site?" — they should reason from the numbers to the source.`,
  },

  // ──────────────────────────────────────────────────────────────
  // MATHEMATICS — AP CALCULUS AB
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apcalcab_limit_tricks',
    title: 'Limits — five tricks that solve most AP problems',
    subject: 'Mathematics',
    course: 'AP Calculus AB',
    cedUnit: 'Unit 1: Limits and Continuity',
    format: 'Quick reference',
    durationMin: 12,
    summary: 'The five techniques that handle ~80% of AP limit problems before you ever need L\'Hôpital.',
    content: `**1. Direct substitution.** Always try first. Works if the function is continuous at the point.

**2. Factor and cancel.** For 0/0 indeterminate forms with polynomials.
Example: lim_{x→2} (x² − 4)/(x − 2) = lim (x + 2) = 4.

**3. Rationalize.** For 0/0 with square roots.
Example: lim_{x→0} (√(x+4) − 2)/x → multiply by (√(x+4) + 2)/(√(x+4) + 2) → x/(x(√(x+4)+2)) → 1/4.

**4. Common limit forms to memorize:**
- lim_{x→0} sin(x)/x = 1
- lim_{x→0} (1 − cos(x))/x = 0
- lim_{x→∞} (1 + 1/x)^x = e

**5. Compare growth rates as x → ∞:**
log < polynomial < exponential.
Example: lim_{x→∞} x/e^x = 0.

**L'Hôpital's rule** (for 0/0 or ∞/∞): differentiate top and bottom separately. Don't use unless the simpler tricks fail.`,
  },
  {
    id: 'tr_apcalcab_derivative_rules',
    title: 'Derivative rules — the complete reference',
    subject: 'Mathematics',
    course: 'AP Calculus AB',
    cedUnit: 'Unit 2: Differentiation: Definition and Fundamental Properties',
    format: 'Quick reference',
    durationMin: 10,
    summary: 'Every derivative rule from the AP CED, in the order they typically appear in a textbook.',
    content: `**Power:** d/dx[x^n] = nx^(n−1)
**Sum/diff:** d/dx[f ± g] = f' ± g'
**Product:** d/dx[fg] = f'g + fg'
**Quotient:** d/dx[f/g] = (f'g − fg')/g²
**Chain:** d/dx[f(g(x))] = f'(g(x)) · g'(x)

**Trig:**
- d/dx[sin x] = cos x
- d/dx[cos x] = −sin x
- d/dx[tan x] = sec²x
- d/dx[sec x] = sec x · tan x
- d/dx[csc x] = −csc x · cot x
- d/dx[cot x] = −csc²x

**Exponential / log:**
- d/dx[e^x] = e^x
- d/dx[a^x] = a^x · ln(a)
- d/dx[ln x] = 1/x
- d/dx[log_a x] = 1/(x · ln a)

**Inverse trig:**
- d/dx[arcsin x] = 1/√(1 − x²)
- d/dx[arctan x] = 1/(1 + x²)

**Implicit differentiation:** treat y as y(x); apply chain rule whenever you differentiate y.`,
  },
  {
    id: 'tr_apcalcab_related_rates',
    title: 'Related rates — five-step recipe',
    subject: 'Mathematics',
    course: 'AP Calculus AB',
    cedUnit: 'Unit 4: Contextual Applications of Differentiation',
    format: 'Worked example',
    durationMin: 18,
    summary: 'The classic ladder problem solved using the five-step framework that works for every related-rates problem.',
    content: `**Problem:** Ladder 10 m long leans against a wall. Bottom slides away from the wall at 0.5 m/s. How fast is the top sliding down when the bottom is 6 m from the wall?

**Step 1: Draw a labeled diagram.** Right triangle: x = bottom-to-wall, y = top-to-ground, ladder = hypotenuse.

**Step 2: Write the constraint equation.** x² + y² = 10² (Pythagoras).

**Step 3: Differentiate w.r.t. t.** 2x(dx/dt) + 2y(dy/dt) = 0.

**Step 4: Solve for the unknown rate.** dy/dt = −(x · dx/dt) / y.

**Step 5: Plug in values at the moment of interest.** When x = 6, y = 8 (Pythagoras). dx/dt = 0.5.
dy/dt = −(6 × 0.5) / 8 = **−0.375 m/s** (negative because top is dropping).

**Why students miss this:** they plug in the values BEFORE differentiating. Don't. Keep variables symbolic until step 5.`,
  },
  {
    id: 'tr_apcalcab_ftc_practice',
    title: 'Fundamental Theorem of Calculus — Part 1 vs Part 2',
    subject: 'Mathematics',
    course: 'AP Calculus AB',
    cedUnit: 'Unit 6: Integration and Accumulation of Change',
    format: 'Concept brief',
    durationMin: 15,
    summary: 'The two FTC statements and when each one matters on the AP exam.',
    content: `**Part 1 (definite integral as antiderivative evaluated at bounds):**
∫ from a to b of f(x) dx = F(b) − F(a), where F'(x) = f(x).

This is the "compute integrals" version. Used on every Calc AB FRQ that asks for area under a curve.

**Part 2 (derivative of an integral):**
d/dx [ ∫ from a to x of f(t) dt ] = f(x).

The derivative undoes the integral. Used when the integrand has the variable in the upper bound.

**With chain rule (the version that trips up students):**
d/dx [ ∫ from a to g(x) of f(t) dt ] = f(g(x)) · g'(x).

**Example:** F(x) = ∫ from 1 to x² of sin(t) dt.
F'(x) = sin(x²) · 2x.

**Standard AP FRQ structure:** "Let g(x) = ∫ from 0 to x of f(t) dt." Then a sequence of questions: find g(2), g'(2), critical points of g, intervals where g is concave up. Each uses a different FTC application.`,
  },

  // ──────────────────────────────────────────────────────────────
  // MATHEMATICS — AP CALCULUS BC
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apcalcbc_series_tests',
    title: 'Series convergence — which test to use',
    subject: 'Mathematics',
    course: 'AP Calculus BC',
    cedUnit: 'Unit 10: Infinite Sequences and Series',
    format: 'Quick reference',
    durationMin: 15,
    summary: 'Decision tree for picking the right convergence test based on what the series looks like.',
    content: `**Look at the general term a_n:**

**a_n contains n!  or  n^n** → Ratio test. Take lim |a_{n+1}/a_n|. < 1 converges; > 1 diverges; = 1 inconclusive.

**a_n contains (something)^n** → Root test. Take lim |a_n|^(1/n). Same rules.

**a_n looks like 1/n^p** → p-series. Converges iff p > 1.

**a_n is a rational function (polynomial / polynomial)** → Compare to p-series. Limit comparison test.

**a_n alternates sign** → Alternating series test. Converges if |a_n| → 0 monotonically.

**a_n is positive and decreasing, easy to integrate** → Integral test. ∫ from N to ∞ of f(x) dx converges iff series does.

**Geometric:** Σ ar^n converges iff |r| < 1, to a/(1−r).

**Telescoping:** find partial-fraction decomposition; compute s_n directly.

**Common student error:** confusing convergence of a_n (the term) with convergence of the series. Σ 1/n diverges even though 1/n → 0.`,
  },
  {
    id: 'tr_apcalcbc_integration_techniques',
    title: 'Integration techniques — choosing your weapon',
    subject: 'Mathematics',
    course: 'AP Calculus BC',
    cedUnit: 'Unit 6: Integration and Accumulation of Change',
    format: 'Quick reference',
    durationMin: 12,
    summary: 'Substitution, parts, partial fractions, trig substitution — when to use each.',
    content: `**u-substitution:** integrand has a function and its derivative. ∫ 2x · cos(x²) dx → u = x², du = 2x dx.

**Integration by parts:** ∫ u dv = uv − ∫ v du. Use when integrand is a product where one factor differentiates to something simpler. LIATE rule for choosing u: Logarithm > Inverse trig > Algebraic > Trig > Exponential.

**Partial fractions:** rational function with factorable denominator. Break into simpler fractions, integrate each.

**Trig substitution:** integrand contains √(a² − x²), √(a² + x²), or √(x² − a²). Substitute x = a·sin θ, a·tan θ, or a·sec θ respectively.

**Long division:** rational function where degree of numerator ≥ degree of denominator. Do long division first.

**Decision flow:**
1. Try u-substitution.
2. If product, try parts.
3. If rational, try partial fractions.
4. If has a quadratic-radical, try trig sub.`,
  },

  // ──────────────────────────────────────────────────────────────
  // MATHEMATICS — AP STATISTICS
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apstat_test_picker',
    title: 'Which inference test? — decision tree',
    subject: 'Mathematics',
    course: 'AP Statistics',
    cedUnit: 'Unit 6-9: Inference',
    format: 'Quick reference',
    durationMin: 12,
    summary: 'AP Stats has ~12 inference procedures. This decision tree narrows to the right one based on the question type.',
    content: `**Step 1: What are you testing?**
- A proportion / proportions → categorical
- A mean / means → quantitative

**Step 2: How many samples?**
- 1 sample → 1-sample test
- 2 samples → 2-sample test
- More → chi-square (categorical) or ANOVA (quantitative, not on AP exam)

**Step 3: Categorical specifics:**
- 1 proportion → 1-proportion z-test
- 2 proportions → 2-proportion z-test
- 2-way table → chi-square test of independence
- 1-way table vs expected distribution → chi-square goodness-of-fit
- Two categorical from same sample → chi-square test of homogeneity

**Step 4: Quantitative specifics:**
- 1 mean, σ known → 1-sample z-test (rare)
- 1 mean, σ unknown → 1-sample t-test
- 2 independent means → 2-sample t-test
- 2 paired means → matched-pairs t-test (treat as 1-sample t-test on differences)
- Slope of regression line → t-test for slope

**Conditions for ALL tests:** random sample (or random assignment), independence (10% rule for sampling without replacement), and normality (specific to each test).`,
  },
  {
    id: 'tr_apstat_chi_square_setup',
    title: 'Chi-square — three flavors, one process',
    subject: 'Mathematics',
    course: 'AP Statistics',
    cedUnit: 'Unit 8: Inference for Categorical Data: Chi-Square',
    format: 'Worked example',
    durationMin: 18,
    summary: 'Goodness-of-fit, independence, and homogeneity all use the same chi-square statistic. The differences are in setup.',
    content: `**The statistic (same for all three):**
χ² = Σ (observed − expected)² / expected

**Degrees of freedom (varies):**
- Goodness-of-fit: df = categories − 1
- Independence / homogeneity: df = (rows − 1)(cols − 1)

**Goodness-of-fit example:** Are M&M colors distributed as advertised? Compare observed counts to advertised proportions × n.

**Independence example:** Is political party related to gender in your sample? 2×k table; expected = (row total × col total) / grand total.

**Homogeneity vs independence:** identical math. The difference is in sampling. Independence: one sample, classified by two variables. Homogeneity: multiple samples, comparing distributions of one variable.

**Conditions (all three):** all expected counts ≥ 5. If not, combine categories or use exact test.

**FRQ pattern:** state hypotheses → check conditions → compute expected → compute χ² → df → p-value → conclude in context.`,
  },

  // ──────────────────────────────────────────────────────────────
  // COMPUTER SCIENCE — AP CS A
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apcsa_array_traversal',
    title: 'Array traversal — the four patterns AP tests',
    subject: 'Computer Science',
    course: 'AP Computer Science A',
    cedUnit: 'Unit 6: Array',
    format: 'Quick reference',
    durationMin: 12,
    summary: 'Standard for-loop, enhanced for-loop, traversal with index modification, and parallel traversal — when to use each.',
    content: `**1. Standard for loop** (when you need the index):
\`\`\`java
for (int i = 0; i < arr.length; i++) {
    arr[i] = arr[i] * 2;
}
\`\`\`

**2. Enhanced for loop** (when you only need the values):
\`\`\`java
for (int val : arr) {
    System.out.println(val);
}
\`\`\`
**Trap:** can't modify the array through the loop variable. \`val = 5\` doesn't change arr.

**3. Traversal with index modification** (skipping or jumping):
\`\`\`java
for (int i = 0; i < arr.length; i += 2) {  // every other element
    System.out.println(arr[i]);
}
\`\`\`

**4. Parallel traversal** (two arrays of same length):
\`\`\`java
for (int i = 0; i < a.length; i++) {
    sum += a[i] * b[i];  // dot product
}
\`\`\`

**Common AP exam errors:**
- Off-by-one: \`i <= arr.length\` instead of \`i < arr.length\` → ArrayIndexOutOfBoundsException
- Modifying length mid-loop (resizing inside enhanced for loop) → ConcurrentModificationException`,
  },
  {
    id: 'tr_apcsa_recursion_template',
    title: 'Recursion — the two-line template',
    subject: 'Computer Science',
    course: 'AP Computer Science A',
    cedUnit: 'Unit 10: Recursion',
    format: 'Concept brief',
    durationMin: 12,
    summary: 'Every recursive method has two parts: base case + recursive call. The template fits everything from factorial to merge sort.',
    content: `**Template:**
\`\`\`java
returnType methodName(params) {
    if (BASE CASE) return SIMPLE ANSWER;
    return COMBINE(methodName(SMALLER PROBLEM));
}
\`\`\`

**Factorial:**
\`\`\`java
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
\`\`\`

**Fibonacci:**
\`\`\`java
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
\`\`\`

**Sum of array (using helper that takes index):**
\`\`\`java
int sum(int[] arr, int i) {
    if (i == arr.length) return 0;
    return arr[i] + sum(arr, i + 1);
}
\`\`\`

**Three common student errors:**
1. Missing base case → stack overflow.
2. Base case never reached (wrong direction in recursive call) → stack overflow.
3. Forgetting to return the recursive call's result.

**When to use recursion vs iteration:** the AP exam often expects recursion when the problem itself has a recursive structure (trees, divide-and-conquer). For simple sums, iteration is clearer.`,
  },
  {
    id: 'tr_apcsa_big_o',
    title: 'Big-O — the AP-relevant cases',
    subject: 'Computer Science',
    course: 'AP Computer Science A',
    cedUnit: 'Cross-unit',
    format: 'Quick reference',
    durationMin: 10,
    summary: 'AP CS A doesn\'t require formal Big-O analysis, but understanding it helps students choose the right algorithm. Six common cases.',
    content: `**O(1) — constant.** Doesn't depend on input size.
- Array access by index: \`arr[i]\`
- HashMap get/put (average)

**O(log n) — logarithmic.** Cuts problem in half each step.
- Binary search

**O(n) — linear.** Touches every element once.
- Sequential search, single-loop traversal

**O(n log n).** Best comparison-based sorting.
- Merge sort, heap sort (not on AP exam but worth knowing)

**O(n²) — quadratic.** Two nested loops over the same input.
- Selection sort, insertion sort (worst case)
- Naive comparison of pairs

**O(2^n) — exponential.** Doubles with each added input.
- Recursive Fibonacci (without memoization)

**Practical implication for AP students:** if your solution involves nested loops over the input, expect O(n²). If you can use a sort + single pass, you can often get to O(n log n).`,
  },

  // ──────────────────────────────────────────────────────────────
  // ENGLISH — AP LANGUAGE & COMPOSITION
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_aplang_rhet_analysis_template',
    title: 'Rhetorical analysis essay — paragraph template',
    subject: 'English',
    course: 'AP Language & Composition',
    cedUnit: 'All units (Rhetorical Situation)',
    format: 'Writing template',
    durationMin: 20,
    summary: 'Body-paragraph structure that earns the AP Lang Row B "sophistication" point when used well.',
    content: `**Topic sentence:** name the rhetorical choice + its effect on the audience.
"To establish credibility with skeptical engineers, Carson opens with a precise technical claim about DDT's chemistry."

**Evidence (quote or paraphrase):** brief, specific.
"She writes: 'DDT, a chlorinated hydrocarbon, accumulates in fatty tissue with a half-life measured in decades.'"

**Analysis (the hardest part — 2-3 sentences):**
- WHAT the choice does (diction, syntax, appeal, structure).
- HOW it does it (why this specific choice works).
- WHY it matters for the writer's overall purpose.

"The chemistry vocabulary signals expertise — Carson isn't just a naturalist romanticizing nature, she's a credentialed scientist making a quantitative claim. By the time skeptics encounter her ethical arguments later in the chapter, she has already established the right to make them."

**Transition** to the next choice. Don't list rhetorical devices — connect them to a single argumentative thread.

**Sophistication move:** name a tension or limitation. "Carson's choice to lead with chemistry costs her some emotional resonance — readers expecting Silent Spring's lyrical opening get a textbook paragraph instead."`,
  },
  {
    id: 'tr_aplang_synthesis_sources',
    title: 'Synthesis essay — how to use sources without dragging them',
    subject: 'English',
    course: 'AP Language & Composition',
    cedUnit: 'All units (Claims and Evidence)',
    format: 'Concept brief',
    durationMin: 15,
    summary: 'AP Lang synthesis prompts give 6-7 sources. Students who copy-paste lose points. Here\'s what readers want instead.',
    content: `**Three levels of source use, from worst to best:**

**1. Drop-and-cite (loses points):**
"Source A says rural broadband is critical (Source A)."
Reader: so what?

**2. Paraphrase + claim (earns the point, doesn't impress):**
"As Source A argues, rural broadband shapes school equity. This shows the digital divide matters."
Reader: passable; the student moved past the source but didn't add anything.

**3. Conversation between sources (Row B sophistication):**
"Source A's school-equity argument assumes broadband access translates to academic outcomes — but Source D's longitudinal data complicates that assumption: students with home broadband in low-income districts only outperform peers in years when teachers were also trained in digital pedagogy. The broadband investment in Source A is a precondition, not a cause."
Reader: the student is now thinking, not just summarizing.

**Practical tactic:** before drafting, write a one-sentence summary of each source's argument. Then look for which sources agree, which contradict each other, and where the interesting tensions are. Build the essay around those tensions.

**Three is the sweet spot for source count** — citing 6 sources superficially is worse than citing 3 deeply.`,
  },
  {
    id: 'tr_aplang_argument_essay',
    title: 'Argument essay — defending an unfashionable position',
    subject: 'English',
    course: 'AP Language & Composition',
    cedUnit: 'All units (Claims and Evidence)',
    format: 'Concept brief',
    durationMin: 15,
    summary: 'AP Lang argument prompts reward students who take a non-obvious position. Here\'s how to find one.',
    content: `**The trap:** AP Lang prompts often look like they have a "right" answer. ("Defend, challenge, or qualify the assertion that ambition is the source of all human progress.") Students often pick the position they think AP readers want.

**The exam reality:** readers see 200,000 essays. The most common position blurs together. A well-defended unconventional position stands out.

**How to find one:**
1. Read the prompt twice. Identify the unstated assumption (e.g., "ambition is good" — but is it?).
2. List three obvious positions on the topic.
3. Now find a fourth, slightly weirder one — usually a qualification or a redefinition.

**Example positions, ranked by typical quality:**
- "Ambition is good." (taken by 60% of students)
- "Ambition is bad." (taken by 20%)
- "Ambition is sometimes good." (taken by 15%, hedged + boring)
- "Ambition is the source of progress AND the source of suffering, and we can't separate them" (taken by < 5%, hardest to defend, scores highest when defended well)

**The structure that handles complex positions:**
- Paragraph 1: claim + the most-likely counterargument.
- Paragraph 2: your strongest evidence FOR the claim.
- Paragraph 3: the counterargument you take seriously, with your response.
- Paragraph 4 (sophistication move): the unresolved tension you live with.`,
  },

  // ──────────────────────────────────────────────────────────────
  // ENGLISH — AP LITERATURE & COMPOSITION
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_aplit_poetry_analysis',
    title: 'Poetry analysis — the four-question framework',
    subject: 'English',
    course: 'AP Literature & Composition',
    cedUnit: 'All Poetry units (1, 5, 8)',
    format: 'Concept brief',
    durationMin: 15,
    summary: 'A four-question framework that handles every AP Lit poetry FRQ.',
    content: `**Question 1: What is the speaker doing?** (Not "what is the poem about" — what action is the speaker performing?)
Examples: mourning, accusing, persuading, remembering, justifying, confessing.

**Question 2: To whom?** (Even if unspecified, the addressee shapes everything.)
Examples: to themselves, to a beloved, to a ghost, to God, to the reader.

**Question 3: What changes between the start and end?** (Even short poems have an arc.)
Examples: a shift in mood, a sudden realization, an unanswered question, a change in tense.

**Question 4: What formal choice carries the most meaning?** (Pick ONE — meter, line breaks, imagery cluster, sound.)

**Example: Robert Hayden, "Those Winter Sundays"**
- Speaker doing: confessing a childhood failure to thank his father.
- Addressee: speaker himself, indirectly the reader.
- Change: from descriptive (Sundays too my father got up early) to interrogative ("What did I know, what did I know / of love's austere and lonely offices?")
- Key formal choice: the line break after "love's austere" — the word "lonely" hangs alone, performing the loneliness the poem describes.

**FRQ tactic:** structure your essay around the change in Question 3, using the formal choice in Question 4 as your through-line evidence.`,
  },
  {
    id: 'tr_aplit_close_reading',
    title: 'Close reading — what AP graders count as "close"',
    subject: 'English',
    course: 'AP Literature & Composition',
    cedUnit: 'All Short Fiction units',
    format: 'Concept brief',
    durationMin: 12,
    summary: 'Students often think "close reading" means summarizing in detail. It doesn\'t. Here\'s what AP graders actually want.',
    content: `**Plot summary:** "In the story, the narrator goes to the lake and remembers his father."
**Surface description:** "The narrator describes the lake with detailed imagery."
**Close reading:** "The phrase 'oily calm' in paragraph two does double duty — 'oily' suggests both the lake's stillness and a faint pollution, foreshadowing the narrator's discovery in the next scene that his memory of his father is contaminated by his adult resentment."

**The move:** name a SPECIFIC linguistic choice (word, phrase, image, syntax) + connect it to TWO things at once (immediate effect + larger meaning).

**The trap:** vague identification of a device.
- BAD: "The author uses imagery to create mood."
- BETTER: "The author uses cold imagery in paragraph 3 to suggest emotional distance."
- BEST: "The phrase 'frostbitten hand' in paragraph 3 picks up the 'oily calm' of paragraph 2 — both pair a sensory specificity with a covert moral judgment, building a pattern that the third reference (the 'blackened tea') confirms."

**Drill for class:** give students one passage. Ask each to identify ONE specific word or phrase that "does too much work" — then defend why in two sentences.`,
  },
  {
    id: 'tr_aplit_drama_prompts',
    title: 'Reading drama — six questions for any play',
    subject: 'English',
    course: 'AP Literature & Composition',
    cedUnit: 'Longer Fiction or Drama units (3, 6, 9)',
    format: 'Discussion prompts',
    durationMin: 15,
    summary: 'Six discussion questions that open any play (Shakespeare to Stoppard) for AP-style analysis.',
    content: `**1. Where is the audience first surprised?** Surprise is the playwright\'s clearest assertion of priority. What did you expect that didn\'t happen?

**2. Who has the most lines? Who has the most power?** When these don\'t match, the gap is meaningful.

**3. What does each character want, and what stands in the way?** The classical answer is "another character" but often it\'s something internal (Hamlet\'s indecision, Willy Loman\'s self-deception).

**4. When does someone refuse to speak?** Silences are choices. Cordelia\'s "Nothing" in Lear. Hippolytus\'s silence at his judgment. Stoppard\'s offstage Hamlet.

**5. What single object accumulates meaning across acts?** Yorick\'s skull, the handkerchief in Othello, the bird in Trifles. The play teaches its own symbolic vocabulary.

**6. What\'s the closing image?** Plays end with one final stage picture. What does it argue?

**Use as written:** assign one question to each of six groups. Twenty minutes of small-group discussion, then a 30-minute Socratic seminar where each group presents.`,
  },

  // ──────────────────────────────────────────────────────────────
  // HISTORY — AP US HISTORY
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apush_thesis_structure',
    title: 'APUSH thesis — the seven-component formula',
    subject: 'History & Social Sciences',
    course: 'AP US History',
    cedUnit: 'All units (LEQ + DBQ)',
    format: 'Writing template',
    durationMin: 15,
    summary: 'The seven things a high-scoring APUSH thesis does. Most students nail three of them.',
    content: `**A high-scoring APUSH thesis:**

1. **Addresses ALL parts of the prompt.** (Lots of students answer half.)
2. **Takes a defensible position.** (Not "things changed and stayed the same" — pick one and qualify.)
3. **Establishes a line of reasoning.** (Names the categories your body paragraphs will use.)
4. **Acknowledges historical complexity.** (At least one qualifier: "primarily," "in many cases," "especially among.")
5. **Locates the argument in time.** (Specific years or periods, not just "the colonial era.")
6. **Hints at causation or comparison.** (Why these changes? Compared to what?)
7. **Is one sentence.** (Two is acceptable. Three loses focus.)

**Example prompt:** Evaluate the extent to which the Civil War was a turning point for African Americans.

**Weak thesis:** The Civil War was an important turning point for African Americans because it ended slavery.

**Strong thesis:** While the Civil War was a constitutional turning point that legally ended slavery and granted citizenship through the 13th, 14th, and 15th Amendments, its transformative effect on the daily lives of African Americans was significantly limited by Reconstruction\'s premature end in 1877 and the rapid emergence of Jim Crow legal regimes, making the war more a beginning than a culmination of Black liberation.

**Why the strong version scores:** addresses both parts (extent + turning point), takes a position (qualified yes), establishes line of reasoning (constitutional vs daily life), notes complexity, names specific dates, hints at causation.`,
  },
  {
    id: 'tr_apush_dbq_strategy',
    title: 'DBQ — the 25-minute planning ritual',
    subject: 'History & Social Sciences',
    course: 'AP US History',
    cedUnit: 'All units (DBQ skill)',
    format: 'Concept brief',
    durationMin: 20,
    summary: 'The 25-minute reading/planning window before writing. Spent right, it makes the writing easy.',
    content: `**Minutes 1-3: Read the prompt.** Underline the key verb (evaluate, analyze, compare). Identify what historical thinking skill is being tested.

**Minutes 4-12: Read and annotate documents.**
For each document, in the margin write:
- Speaker / source (one word: "abolitionist," "Southern planter")
- Main claim (one phrase)
- HIPP (one of: Historical situation / Intended audience / Point of view / Purpose) — pick the one that\'s most analytically useful.

**Minutes 13-15: Plan your thesis + body paragraphs.**
- Group documents by claim type, not chronologically.
- Aim for 3 body paragraphs, each grouping 2-3 documents.
- Identify ONE piece of outside evidence per paragraph (your "beyond the documents" point).

**Minutes 16-25: Outline.**
- Thesis (see thesis template).
- Body 1: claim + 2 documents + outside evidence + counter-acknowledgment.
- Body 2: claim + 2 documents + outside evidence.
- Body 3: claim + 2 documents + outside evidence + sophistication move (broader context, alternate view).

**Then write for 35 minutes.** Most students who run out of time spent too much of the 25-minute window re-reading documents.

**Sophistication point** (the hardest single point on the rubric) requires either: (a) explicitly engaging with complexity / nuance / qualification throughout the essay, OR (b) connecting the argument to a different time period, region, or context.`,
  },

  // ──────────────────────────────────────────────────────────────
  // HISTORY — AP US GOVERNMENT
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apusgov_court_cases',
    title: 'Required Supreme Court cases — the 15 you must know',
    subject: 'History & Social Sciences',
    course: 'AP US Government & Politics',
    cedUnit: 'All units',
    format: 'Quick reference',
    durationMin: 15,
    summary: 'The 15 required cases from the AP US Gov CED, organized by what they decided + what constitutional clause they hinged on.',
    content: `**Federalism / Commerce Clause:**
- *McCulloch v. Maryland (1819)* — Necessary and Proper Clause: federal supremacy + implied powers.
- *US v. Lopez (1995)* — Commerce Clause has limits; gun-free school zones outside federal authority.

**Civil Liberties — 1st Amendment:**
- *Engel v. Vitale (1962)* — school-sponsored prayer violates Establishment Clause.
- *Wisconsin v. Yoder (1972)* — Free Exercise: Amish parents can withdraw kids after 8th grade.
- *Tinker v. Des Moines (1969)* — students don\'t shed free-speech rights at the schoolhouse gate.
- *Schenck v. US (1919)* — speech presenting "clear and present danger" not protected (limited later).
- *NYT v. US (1971)* — prior restraint requires extreme government justification (Pentagon Papers).
- *McDonald v. Chicago (2010)* — 2nd Amendment incorporated to states via 14th.

**Civil Rights — 14th Amendment:**
- *Brown v. Board (1954)* — separate-but-equal unconstitutional in public schools.

**Criminal Procedure:**
- *Gideon v. Wainwright (1963)* — right to counsel in felony cases.

**Voting Rights:**
- *Baker v. Carr (1962)* — federal courts can hear redistricting cases ("one person, one vote").
- *Shaw v. Reno (1993)* — racial gerrymandering subject to strict scrutiny.

**Campaign Finance:**
- *Citizens United v. FEC (2010)* — corporate political spending protected as speech.

**Federal Power:**
- *Marbury v. Madison (1803)* — established judicial review.

**Memory technique:** group by amendment first, then by clause. The exam will frame questions around a specific clause; recognizing the cluster narrows your cases fast.`,
  },
  {
    id: 'tr_apusgov_founding_docs',
    title: 'The nine required foundational documents — one-line summaries',
    subject: 'History & Social Sciences',
    course: 'AP US Government & Politics',
    cedUnit: 'Unit 1: Foundations',
    format: 'Quick reference',
    durationMin: 10,
    summary: 'The 9 founding documents the AP exam can quote. What each one argued + one sentence on why it matters.',
    content: `**1. Declaration of Independence (1776):** natural rights + government by consent. Source: Locke. Argument: legitimate revolution.

**2. Articles of Confederation (1781):** weak central government, state sovereignty. Failed because Congress couldn\'t tax or regulate trade.

**3. Constitution (1787):** the fundamental governing document. Federalism + separation of powers + checks and balances.

**4. Federalist No. 10 (Madison):** large republic + factions. Argues that a big diverse republic better controls factions than a small one.

**5. Federalist No. 51 (Madison):** "ambition must be made to counteract ambition." Defends checks and balances and federalism as safeguards against tyranny.

**6. Federalist No. 70 (Hamilton):** energy in the executive. Defends a single, strong president.

**7. Federalist No. 78 (Hamilton):** judiciary is the "least dangerous branch." Defends judicial independence + lifetime tenure.

**8. Brutus No. 1 (Anti-Federalist):** opposes ratification. Argues the proposed government is too big, too distant, and will consolidate power.

**9. Letter from a Birmingham Jail (King, 1963):** civil disobedience, just vs unjust laws. Argues moral obligation to break unjust laws while accepting legal consequences.

**Use:** when an FRQ quotes a phrase from any of these, recognizing the source immediately points you toward the argumentative context.`,
  },

  // ──────────────────────────────────────────────────────────────
  // HISTORY — AP MACROECONOMICS
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apmacro_ad_as',
    title: 'AD/AS — shifting the right curve',
    subject: 'History & Social Sciences',
    course: 'AP Macroeconomics',
    cedUnit: 'Unit 3: National Income and Price Determination',
    format: 'Quick reference',
    durationMin: 12,
    summary: 'AD shifters vs AS shifters. The most-asked AP Macro distinction.',
    content: `**Aggregate Demand (AD) shifts** when one of these changes:
**C** — consumer confidence, wealth, taxes on consumers.
**I** — interest rates, business expectations, business taxes.
**G** — government spending.
**X − M** — exports / imports, exchange rates.

**Short-Run Aggregate Supply (SRAS) shifts** when:
- **Input prices** change (wages, oil, raw materials).
- **Productivity** changes.
- **Business taxes/subsidies** change.
- **Inflationary expectations** shift.

**Long-Run Aggregate Supply (LRAS)** is vertical at potential GDP. Shifts only with:
- Quantity or quality of resources (labor, capital, land).
- Technology.
- Institutional change.

**Most common student error:** confusing AD with SRAS when the question mentions "input prices" or "wages." Wage changes shift SRAS, not AD. (A wage cut doesn\'t lower consumer spending faster than it lowers business costs — the AS effect dominates short-run.)

**Standard FRQ setup:** "Suppose the economy is at long-run equilibrium. A negative supply shock hits." Draw: SRAS shifts left, price level up, output down (stagflation). Then ask: what should the Fed do? (Contractionary monetary policy fights inflation but worsens recession — Fed faces a real trade-off.)`,
  },
  {
    id: 'tr_apmacro_fiscal_monetary',
    title: 'Fiscal vs monetary policy — the cheat sheet',
    subject: 'History & Social Sciences',
    course: 'AP Macroeconomics',
    cedUnit: 'Unit 4 + Unit 5',
    format: 'Quick reference',
    durationMin: 10,
    summary: 'Who controls each tool, when each is used, and the standard trap on the FRQ.',
    content: `**Fiscal policy (Congress + President):**
- Expansionary: cut taxes OR increase G. Used to fight recession.
- Contractionary: raise taxes OR cut G. Used to fight inflation.
- Lag: long (Congress slow). Effect: direct on AD.

**Monetary policy (Federal Reserve):**
- Expansionary: lower interest rates (open market purchases, lower discount rate, lower reserve requirement). Fight recession.
- Contractionary: raise interest rates. Fight inflation.
- Lag: shorter than fiscal (Fed acts fast) but transmission to economy takes 6-18 months.

**Standard FRQ trap:**
"In a recession, the President wants to cut taxes." Then: "What is the effect on the loanable funds market?"
Answer: Tax cuts increase the deficit → government borrowing rises → demand for loanable funds increases → real interest rates rise → CROWDING OUT of private investment.

The trap: students think tax cuts = lower interest rates. No — tax cuts (deficit-financed) RAISE interest rates because they increase government borrowing.

**Phillips curve link:** expansionary policy moves you up the SR Phillips curve (lower unemployment, higher inflation) — short-run trade-off. LR Phillips curve is vertical at natural rate.`,
  },

  // ──────────────────────────────────────────────────────────────
  // HISTORY — AP MICROECONOMICS
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apmicro_market_structures',
    title: 'Four market structures — comparison table',
    subject: 'History & Social Sciences',
    course: 'AP Microeconomics',
    cedUnit: 'Unit 3 + Unit 4',
    format: 'Quick reference',
    durationMin: 10,
    summary: 'Perfect competition, monopolistic competition, oligopoly, monopoly — what differs across the four.',
    content: `| | Perfect competition | Monop. competition | Oligopoly | Monopoly |
|---|---|---|---|---|
| Number of firms | Many | Many | Few | One |
| Product | Identical | Differentiated | Either | Unique |
| Barriers to entry | None | Low | High | Total |
| Demand curve | Horizontal (price taker) | Downward sloping | Downward, interdependent | Market demand |
| Price = MC? | Yes (LR) | No (P > MC) | No | No |
| Allocative efficient? | Yes | No | No | No |
| Productive efficient? | Yes (LR) | No | No | No |
| LR profit | Zero | Zero | Possible | Possible |
| Examples | Wheat | Restaurants | Auto, airline | Utilities |

**Rules that apply to ALL four:**
- Profit maximizing output: MR = MC.
- Price comes from the demand curve at that quantity.
- Shut down rule: if P < AVC, produce zero in short run.

**The most-missed point:** in monopolistic competition LONG run, P > MC (so allocatively inefficient) AND P > minimum ATC (so productively inefficient too) — but profit is still zero because firms produce on the downward-sloping part of ATC.`,
  },
  {
    id: 'tr_apmicro_externalities',
    title: 'Externalities — graph + corrective policy',
    subject: 'History & Social Sciences',
    course: 'AP Microeconomics',
    cedUnit: 'Unit 6: Market Failure',
    format: 'Concept brief',
    durationMin: 12,
    summary: 'Negative + positive externalities, what the graph looks like, and the Pigouvian solution.',
    content: `**Negative externality** (e.g., pollution):
- Private cost (MPC) is below social cost (MSC).
- Market produces where Demand = MPC: too much.
- Deadweight loss is the triangle between MSC and Demand from Q_market to Q_social.
- **Pigouvian tax** = (MSC − MPC) at Q_social. Shifts supply up by exactly the externality.

**Positive externality** (e.g., vaccination, education):
- Private benefit (MPB) is below social benefit (MSB).
- Market produces where Supply = MPB: too little.
- DWL is the triangle between Supply and MSB from Q_market to Q_social.
- **Pigouvian subsidy** = (MSB − MPB) at Q_social. Shifts demand up by the externality.

**Coase theorem** (often missed): if property rights are clear AND transaction costs are low, private bargaining solves the externality regardless of who holds the right. Real-world point: transaction costs are usually NOT low.

**FRQ pattern:** draw the graph, identify the market quantity, identify the social quantity, shade the DWL, recommend the policy that internalizes the externality.`,
  },

  // ──────────────────────────────────────────────────────────────
  // VISUAL ARTS — AP ART HISTORY
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_aparthist_formal_analysis',
    title: 'Formal analysis vocabulary — the 12 terms AP rewards',
    subject: 'Visual Arts',
    course: 'AP Art History',
    cedUnit: 'All content areas',
    format: 'Vocabulary sheet',
    durationMin: 10,
    summary: 'Twelve formal-analysis terms with one-line definitions + examples. Use these instead of "looks cool."',
    content: `**Composition:** the arrangement of elements within the frame.

**Line:** quality (thin/thick/broken/continuous), direction (diagonal lines = movement; horizontal = stability).

**Shape vs form:** shape is 2-D outline; form is 3-D volume.

**Mass:** the apparent weight or solidity of a form.

**Space:** positive (the subject) vs negative (what surrounds it). Atmospheric perspective creates depth.

**Color:** hue (red/blue/etc.), saturation (intensity), value (lightness). Complementary colors create vibration.

**Value:** light-to-dark range. High contrast = drama; low contrast = subtlety. Chiaroscuro = strong light/dark in figure painting.

**Texture:** actual (you can touch it) vs implied (painted to look like).

**Scale:** size relative to the viewer or to other things in the work.

**Proportion:** internal relationships of parts within a single figure or object. The Vitruvian canon, the 8-head-tall figure.

**Balance:** symmetrical, asymmetrical, radial. Symmetry = stability; asymmetry = dynamism.

**Rhythm:** repetition that creates visual movement across the work.

**Use:** structure every formal analysis paragraph around ONE term from this list, with one specific example from the work, and one interpretive claim about what it accomplishes.`,
  },
  {
    id: 'tr_aparthist_comparison',
    title: 'Comparison essay — the side-by-side framework',
    subject: 'Visual Arts',
    course: 'AP Art History',
    cedUnit: 'All content areas',
    format: 'Writing template',
    durationMin: 15,
    summary: 'AP Art History comparison FRQs ask you to compare two works. Here\'s a paragraph structure that handles them.',
    content: `**Prompt template:** "Compare the [theme/function/style] of [Work A] and [Work B]. Discuss what each work\'s historical context contributes to your analysis."

**Structure (four paragraphs):**

**P1: Thesis + introduce both works.**
- Name both with attribution + date.
- State the claim: both works X, but they differ in Y.
- Preview the criteria for comparison.

**P2: Comparison of Criterion 1 (e.g., formal qualities).**
- Specific observation about A.
- Specific observation about B.
- Interpretation: what does the difference mean?

**P3: Comparison of Criterion 2 (e.g., function or audience).**
- Same structure: A, B, interpretation.

**P4: Historical context drives the difference.**
- Why was A made this way in its time?
- Why was B made differently in its time?
- The contexts are doing the explanatory work; don\'t just name them, USE them.

**Example pairing:** Lascaux cave paintings vs. Sistine Chapel ceiling. Both are large-scale ceiling-mounted images of figures in narrative scenes — but the cave was made for unknown ritual purposes by a hunter-gatherer society, while the chapel was commissioned by a Renaissance pope as a theological argument. Same formal feature (figures on a ceiling); radically different meaning.`,
  },

  // ──────────────────────────────────────────────────────────────
  // PERFORMING ARTS — AP MUSIC THEORY
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apmusic_scale_degrees',
    title: 'Scale degree names — and what each one wants to do',
    subject: 'Performing Arts',
    course: 'AP Music Theory',
    cedUnit: 'Unit 1: Music Fundamentals I',
    format: 'Quick reference',
    durationMin: 8,
    summary: 'The seven scale-degree names + their tendencies. Knowing tendencies makes part-writing intuitive.',
    content: `**1. Tonic (do):** home. Most stable. Where pieces start and end.
**2. Supertonic (re):** wants to move to 3 or 1.
**3. Mediant (mi):** mild tendency to 4.
**4. Subdominant (fa):** wants to move down to 3.
**5. Dominant (sol):** strong tendency back to 1.
**6. Submediant (la):** wants to move to 5 (or 1 in deceptive cadences).
**7. Leading tone (ti):** strongest tendency upward to 1. Half-step from tonic.

**Most-tested tendencies on the AP exam:**
- **Leading tone (7) MUST resolve up to tonic** when it\'s in an outer voice and part of a dominant chord.
- **Chordal seventh (the 7th of any seventh chord) resolves DOWN by step.**
- **Tritone resolves inward** if augmented 4th, outward if diminished 5th.

**Part-writing implications:**
- Doubling: in major chord, double the root or fifth (never the third except in special cases).
- Voice leading: each voice moves the shortest distance possible.
- Avoid parallel fifths and octaves between any two voices.

**Practice tactic:** play a I-IV-V-I progression in 4-part chorale style at the piano. Identify every tendency tone. Then move it correctly.`,
  },
  {
    id: 'tr_apmusic_cadences',
    title: 'The four cadence types — and how to spot each',
    subject: 'Performing Arts',
    course: 'AP Music Theory',
    cedUnit: 'Unit 4: Harmony and Voice Leading I',
    format: 'Quick reference',
    durationMin: 8,
    summary: 'Authentic, plagal, half, deceptive. What each one sounds like and the chord movement that defines it.',
    content: `**Perfect Authentic Cadence (PAC):** V → I, both in root position, soprano ends on tonic. Strongest closure. The "amen" of classical music.

**Imperfect Authentic Cadence (IAC):** V → I, but with weaker conditions (inversion, soprano not on tonic, or V replaced by viiº). Closes the phrase but feels less final.

**Plagal Cadence:** IV → I. Often called the "amen cadence" in Western hymn tradition. Less common in instrumental classical music.

**Half Cadence:** any chord → V. Ends a phrase on the dominant. Sounds unfinished, like a question.

**Deceptive Cadence:** V → vi (instead of expected I). Strongest "surprise" cadence. Beethoven loved this.

**How to spot on a dictation:**
- Listen for the bass line of the last two chords.
- Cadences ON tonic = authentic or plagal (distinguish by whether the penultimate chord moves stepwise (plagal: IV→I) or by leap (authentic: V→I)).
- Cadences ON dominant = half cadence.
- Cadences ON submediant after a clear V = deceptive.

**AP exam: cadence identification appears on every Section II part-writing problem.**`,
  },

  // ──────────────────────────────────────────────────────────────
  // WORLD LANGUAGES — AP FRENCH / SPANISH (shared format)
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_apfrench_persuasive',
    title: 'Persuasive essay (Section II Task 2) — French structure',
    subject: 'World Languages',
    course: 'AP French',
    cedUnit: 'All themes (writing skills)',
    format: 'Writing template',
    durationMin: 15,
    summary: 'The structure that wins the AP French persuasive essay. Five paragraphs, three sources, one clear position.',
    content: `**Introduction:** restate the question, take a position, preview your reasoning.

\`Dans la société contemporaine, la question de [topic] suscite un vif débat. Selon moi, [position], car [reason 1], [reason 2], et [reason 3]. À travers cet essai, je démontrerai mon point de vue en m\'appuyant sur les trois sources fournies.\`

**Body 1: First reason + Source 1.**
\`En premier lieu, [reason 1]. La source 1 illustre clairement ce point en affirmant que "[quote/paraphrase]". Cela suggère que…\`

**Body 2: Second reason + Source 2.**
\`Par ailleurs, [reason 2], comme le souligne la source 2 : "[quote]". Cette idée renforce mon argument car…\`

**Body 3: Counterargument + Source 3 + your response.**
\`Certes, on pourrait objecter que [counterargument], comme le suggère la source 3. Néanmoins, [response] parce que…\`

**Conclusion:** restate your position + a broader implication.
\`En conclusion, [position] pour les raisons développées plus haut. Cette question soulève finalement une question plus large : [broader implication].\`

**Transition phrases to drop into ANY paragraph:**
- En premier lieu / D\'une part / D\'abord
- Par ailleurs / De plus / En outre
- Néanmoins / Cependant / En revanche
- Par conséquent / Donc / Ainsi
- En conclusion / Pour conclure / Finalement`,
  },
  {
    id: 'tr_apspanish_persuasive',
    title: 'Ensayo persuasivo (Tarea 2) — estructura en español',
    subject: 'World Languages',
    course: 'AP Spanish',
    cedUnit: 'All themes (writing skills)',
    format: 'Writing template',
    durationMin: 15,
    summary: 'Same structure as the AP French persuasive, in Spanish, with the AP-rewarded transition vocabulary.',
    content: `**Introducción:** plantear el tema, tomar una postura, anticipar el razonamiento.

\`En la sociedad actual, la cuestión de [tema] genera un intenso debate. A mi parecer, [postura], puesto que [razón 1], [razón 2] y [razón 3]. A lo largo de este ensayo, defenderé mi punto de vista apoyándome en las tres fuentes proporcionadas.\`

**Cuerpo 1: Primera razón + Fuente 1.**
\`En primer lugar, [razón 1]. La fuente 1 ilustra este punto al afirmar que "[cita]". Esto sugiere que…\`

**Cuerpo 2: Segunda razón + Fuente 2.**
\`Asimismo, [razón 2], como destaca la fuente 2: "[cita]". Esta idea refuerza mi argumento porque…\`

**Cuerpo 3: Contraargumento + Fuente 3 + respuesta.**
\`Es cierto que se podría objetar que [contraargumento], como sugiere la fuente 3. Sin embargo, [respuesta] porque…\`

**Conclusión:** reafirmar la postura + implicación más amplia.
\`En conclusión, [postura] por las razones expuestas. En última instancia, esta cuestión nos plantea un dilema mayor: [implicación más amplia].\`

**Frases de transición evaluadas favorablemente:**
- En primer lugar / Por una parte / Para empezar
- Asimismo / Además / Por otro lado
- Sin embargo / No obstante / En cambio
- Por consiguiente / Por lo tanto / Así pues
- En conclusión / En definitiva / Para concluir

**Trampa común:** mezclar tiempos verbales. El subjuntivo se usa después de expresiones como "es importante que," "para que," "aunque + posibilidad."`,
  },
  {
    id: 'tr_aplatin_scansion',
    title: 'Scansion — marking dactylic hexameter',
    subject: 'World Languages',
    course: 'AP Latin',
    cedUnit: 'Vergil (Aeneid)',
    format: 'Quick reference',
    durationMin: 12,
    summary: 'The AP Latin exam tests scansion of the first four feet of dactylic hexameter. Here\'s the algorithm.',
    content: `**The line has six feet. Each is either:**
- **Dactyl:** — ∪ ∪ (long-short-short)
- **Spondee:** — — (long-long)

**Foot 5 is almost always a dactyl. Foot 6 is always a spondee or trochee (— ∪).**

**Algorithm for scanning the first four feet:**

1. **Mark naturally long syllables.** Any diphthong (ae, au, eu, oe) or vowel followed by two consonants (within or across word boundaries) is long. Final -ē, -ī, -ō, -ū are usually long.

2. **Mark naturally short syllables.** A short vowel followed by a single consonant (and another vowel) is usually short.

3. **Apply elision.** If a word ends in a vowel (or -m) and the next begins with a vowel (or h-), the first vowel elides. Don\'t count it.

4. **Now build feet from left to right.** Each foot is exactly one long syllable followed by either two shorts (dactyl) or another long (spondee).

**Practice line (Aeneid 1.1):**
\`Arma virumque cano, Troiae qui primus ab oris\`
Scanned: — ∪ ∪ | — ∪ ∪ | — — | — — | — ∪ ∪ | — —

**AP exam: identify which feet are dactyls vs. spondees in feet 1-4.** Foot 5 dactyl + foot 6 spondee = the standard ending; you don\'t have to mark those for credit.`,
  },

  // ──────────────────────────────────────────────────────────────
  // CROSS-CURRICULAR — STUDY SKILLS / RUBRICS
  // ──────────────────────────────────────────────────────────────
  {
    id: 'tr_ap_essay_rubric',
    title: 'Universal AP essay rubric — the 1-2-3-4-5-6 scale',
    subject: 'English',
    course: 'AP Language & Composition',
    cedUnit: 'All AP essay-based exams',
    format: 'Rubric',
    durationMin: 12,
    summary: 'AP graders use a similar rubric structure across English, History, and Social Studies. The 6-point breakdown.',
    content: `**Thesis (1 point):**
- 0: no defensible position, OR restates the prompt.
- 1: defensible position, addresses the prompt, in 1-2 sentences.

**Evidence (4 points):**
- 0: no evidence beyond the prompt.
- 1-2: evidence used but with errors, or used to summarize.
- 3: specific evidence used to support claims in each body paragraph.
- 4: evidence used effectively + at least one piece of "beyond the documents" / outside knowledge (in DBQ) or one piece of evidence that complicates the thesis (in argumentative).

**Analysis and Reasoning (1 point):**
- 0: claims are unsupported or reasoning is unclear.
- 1: line of reasoning is clear; each body paragraph advances the thesis.

**Sophistication (1 point, hardest to earn):**
- 0: thesis is one-dimensional.
- 1: any ONE of the following throughout the essay:
  - Acknowledges complexity, qualifies, or considers alternative perspectives.
  - Makes effective connections to a broader context (different time, place, theme).
  - Uses vivid, precise language to make a memorable argument.

**Total: 6 points.** Most students score 3-4. The sophistication point separates 4s from 5s on the final AP scale.

**Teaching application:** when grading practice essays, write the four sub-scores in the margin (T / E / A / S) rather than a single number. Students learn faster from breakdown than from totals.`,
  },
  {
    id: 'tr_ap_exam_prep_calendar',
    title: '8-week AP exam prep calendar — what to do when',
    subject: 'English',
    course: 'AP Language & Composition',
    cedUnit: 'Cross-course (test prep)',
    format: 'Concept brief',
    durationMin: 10,
    summary: 'A research-backed prep calendar that beats marathon cramming. Works for any AP.',
    content: `**Week −8 (early March):** Diagnostic full exam. Don\'t prep first. Take a real released exam under exam conditions. Score it. Identify the top 2 weakest unit areas.

**Weeks −7 to −5:** Targeted content review on the weak units. ~3 hours / week. Use the College Board\'s AP Classroom + one external source (e.g., AMSCO, Princeton Review).

**Weeks −4 to −3:** FRQ practice with self-grading using the rubric. 2 FRQs per week, scored honestly against released rubrics. The goal isn\'t to write fast yet — it\'s to internalize the rubric.

**Week −2:** Mixed multiple-choice practice. 30 minutes / day. Focus on pattern recognition, not new content.

**Week −1:** One full practice exam under timed conditions, on a Saturday. Review every wrong answer.

**Day −1:** Light review (10-20 flashcards or one timed FRQ). Eat dinner with carbs and protein. Sleep 8+ hours.

**Exam morning:** Eat breakfast. Arrive 15 min early. Do NOT review notes in the parking lot — anxiety beats marginal review.

**During the exam:**
- Multiple choice: answer every question. There\'s no penalty for guessing on current AP exams.
- FRQ: spend 10% of the time planning, 80% writing, 10% checking.

**The research:** spaced practice and interleaved review (mixing topics) beats massed practice. Cramming the night before reliably reduces scores.`,
  },
];

// Helper: case-insensitive search across title, subject, course, format, content.
export function resourceMatches(resource, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    resource.title.toLowerCase().includes(q) ||
    resource.subject.toLowerCase().includes(q) ||
    resource.course.toLowerCase().includes(q) ||
    resource.format.toLowerCase().includes(q) ||
    (resource.cedUnit || '').toLowerCase().includes(q) ||
    resource.summary.toLowerCase().includes(q) ||
    (resource.content || '').toLowerCase().includes(q)
  );
}

// Helper: count by format for chip badges.
export function countByFormat() {
  const counts = { all: teachingResources.length };
  for (const f of RESOURCE_FORMATS) counts[f] = 0;
  for (const r of teachingResources) {
    counts[r.format] = (counts[r.format] || 0) + 1;
  }
  return counts;
}

// Helper: count by subject for the dropdown.
export function countBySubject() {
  const counts = {};
  for (const s of SUBJECTS) counts[s] = 0;
  for (const r of teachingResources) counts[r.subject] = (counts[r.subject] || 0) + 1;
  return counts;
}
