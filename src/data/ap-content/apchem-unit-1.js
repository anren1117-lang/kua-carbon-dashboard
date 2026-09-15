// AP Chemistry Unit 1 — Atomic Structure and Properties (7-9%)
// APES-standard depth. LaTeX math via $...$ delimiters.

export const APCHEM_UNIT_1 = {
  number: 1,
  title: 'Atomic Structure and Properties',
  weight: '7-9%',
  subunits: [
    {
      code: '1.1',
      title: 'Moles and molar mass',
      content:
`Chemistry happens at the atomic scale — atoms are about $10^{-10}$ m across and weigh around $10^{-27}$ kg. We can't reach into a flask and pick individual atoms out one at a time. But we want to predict what happens when reactants combine, and reactions happen atom by atom. The **mole** is the bridge: a counting unit big enough to be useful at lab scale but defined in a way that makes the atomic accounting come out clean. Without the mole, chemistry would have to choose between accurate atomic-level predictions and grams-and-flasks practicality. With it, both work together.

**Definition of the mole.** $1$ mole = $6.022 \\times 10^{23}$ entities. This number is **Avogadro's constant**, $N_A$. The "entities" can be atoms, molecules, ions, electrons — any countable particles. The definition is anchored to carbon-12: one mole of carbon-12 atoms has a mass of exactly $12$ grams. Since 2019, the SI definition flips this around — a mole is *defined* as exactly $6.02214076 \\times 10^{23}$ entities, and the relation to grams of carbon follows from the value of $N_A$. The practical effect for AP work is the same: count atoms in moles, weigh substances in grams, and use $N_A$ to convert.

**Why $6.022 \\times 10^{23}$?** It's enormous. If you spread one mole of grains of sand evenly across the Earth's surface, the layer would be many meters deep. If you stacked one mole of pennies in a tower, you'd reach beyond the Andromeda galaxy. The number is big because atoms are tiny — you need a huge count of them to add up to a weighable amount.

**Molar mass.** The mass of one mole of a substance, in grams per mole. By the definition of the mole, the molar mass in g/mol is **numerically equal** to the atomic or molecular mass in atomic mass units (amu). This convenient equality lets you read a molar mass straight off the periodic table:

- Carbon: $12.01$ g/mol (the slight excess over $12$ reflects the natural mix of carbon-12 and carbon-13).
- Hydrogen: $1.01$ g/mol.
- Oxygen: $16.00$ g/mol.
- Sodium: $22.99$ g/mol.
- Chlorine: $35.45$ g/mol.
- Iron: $55.85$ g/mol.
- Gold: $196.97$ g/mol.

For compounds, sum the atomic masses, weighted by the number of each atom:

- Water $H_2O$: $2(1.01) + 16.00 = 18.02$ g/mol.
- Carbon dioxide $CO_2$: $12.01 + 2(16.00) = 44.01$ g/mol.
- Glucose $C_6H_{12}O_6$: $6(12.01) + 12(1.01) + 6(16.00) = 180.18$ g/mol.
- Calcium carbonate $CaCO_3$: $40.08 + 12.01 + 3(16.00) = 100.09$ g/mol.
- Sucrose $C_{12}H_{22}O_{11}$: $342.30$ g/mol.

**The three essential conversions.** Almost every stoichiometry problem reduces to chained applications of these:

- **Mass ↔ moles**: $n = \\dfrac{m}{M}$, where $n$ is moles, $m$ is mass in grams, $M$ is molar mass.
- **Moles ↔ particles**: number of particles $= n \\times N_A$.
- **Moles of gas ↔ volume** at STP (standard temperature and pressure, $0$ °C and $1$ atm): $1$ mol gas $= 22.4$ L.

Real lab work uses the ideal gas law $PV = nRT$ for non-STP conditions, but $22.4$ L/mol at STP is the AP shortcut.

**Stoichiometry — moles relate reactants and products.** A balanced equation tells you ratios of moles, not of grams. The ratios are the conversion factors between "amount of A" and "amount of B" in any reaction.

The five-step recipe for any stoichiometry problem:

1. Write the balanced equation.
2. Convert the given (often mass of reactant) to moles.
3. Use the mole ratio from the equation to find moles of the target.
4. Convert moles of the target to whatever units the question wants (mass, volume, number of particles).
5. Check units and significant figures.

**Worked example: methane combustion.** How many grams of water form when $32$ g of methane is completely combusted?

Balanced equation: $CH_4 + 2\\,O_2 \\to CO_2 + 2\\,H_2O$.

Step 1 done. Step 2: convert $32$ g of $CH_4$ to moles. Molar mass of $CH_4 = 12.01 + 4(1.01) = 16.05$ g/mol. So $n_{CH_4} = 32 / 16.05 \\approx 2.0$ mol.

Step 3: from the balanced equation, 1 mol $CH_4$ produces 2 mol $H_2O$. So $n_{H_2O} = 2.0 \\times 2 = 4.0$ mol.

Step 4: convert moles to grams. Molar mass of water is $18.02$ g/mol. So $m_{H_2O} = 4.0 \\times 18.02 = 72.1$ g of water.

Sanity check: the masses balance. $32$ g $CH_4 + 128$ g $O_2 = 160$ g of reactants. Products: $44$ g $CO_2 + 72$ g $H_2O = 116$ g... wait. Let me recount: $1$ mol $CH_4$ gives $1$ mol $CO_2$ + $2$ mol $H_2O$, so $2$ mol $CH_4$ gives $2$ mol $CO_2$ + $4$ mol $H_2O$ = $88$ g + $72$ g = $160$ g. Mass conservation holds.

**Limiting reactant.** When two reactants are mixed in arbitrary amounts, one is usually consumed first; the reaction stops when it runs out. That reactant is the **limiting reactant**. To find it: compute how many moles of product each reactant could produce, picking the smaller value. The other reactant is **in excess**.

**Percent yield.** Real reactions rarely go to completion. Side reactions, equilibrium, mechanical losses, all reduce the actual yield. **Percent yield = (actual yield / theoretical yield) $\\times$ 100%**. AP exam problems often give you actual yield and ask you to compute percent yield, or give you percent yield and ask you to compute the mass of reactant needed.

**Why the mole concept is so durable.** It works because chemistry's bookkeeping is in counts of atoms, not masses. Two hydrogens combine with one oxygen to make water, period — that ratio is determined by the chemistry of how atomic orbitals overlap, not by the masses involved. The mole lets you do the bookkeeping in counts (which the chemistry cares about) while measuring in grams (which the lab apparatus cares about).`,
      video: {
        url: 'https://www.youtube.com/watch?v=AsqEkF7hcII',
        title: 'CrashCourse Chemistry — The mole',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.2',
      title: 'Mass spectroscopy and isotopes',
      content:
`The periodic table tells you that chlorine has an atomic mass of $35.45$ amu. But no chlorine atom actually has mass $35.45$ — there's no fractional-neutron isotope. The value is a **weighted average** of the masses of the naturally occurring isotopes. **Mass spectrometry** is the instrument that lets us see this directly: it separates atoms (or molecules) by mass and reports the relative abundance of each.

**Isotopes — the foundation.** Atoms of the same element have the same number of **protons** (which defines the element) but can differ in **neutrons**. Same Z, different mass numbers $A = Z + N$ (protons plus neutrons). Examples:

- Carbon-12 ($^{12}C$): 6 protons, 6 neutrons. Mass $= 12.000$ amu (by definition).
- Carbon-13 ($^{13}C$): 6 protons, 7 neutrons. Mass $\\approx 13.003$ amu. Natural abundance $\\sim 1.1\\%$.
- Carbon-14 ($^{14}C$): 6 protons, 8 neutrons. Radioactive; half-life $5730$ years. Trace abundance.
- Chlorine-35 ($^{35}Cl$): 17 protons, 18 neutrons. Mass $\\approx 34.97$ amu. Natural abundance $\\sim 75.77\\%$.
- Chlorine-37 ($^{37}Cl$): 17 protons, 20 neutrons. Mass $\\approx 36.97$ amu. $\\sim 24.23\\%$.

Isotopes of the same element have nearly identical chemistry (because chemistry depends on electrons, not neutrons) but slightly different masses. Mass-dependent processes — like diffusion, evaporation, and enzyme reactions — can fractionate isotopes. Carbon-12 vs carbon-13 fractionation by plants is the basis of carbon-isotope tracing in food-web ecology.

**How a mass spectrometer works.** The basic steps:

1. **Ionization.** The sample is vaporized and ionized — typically by electron bombardment, which knocks an electron off each atom or molecule, giving it a +1 charge. For molecules, this often also fragments them, producing a "fingerprint" of smaller charged pieces.
2. **Acceleration.** The positive ions are accelerated through an electric potential, gaining a kinetic energy that depends on the potential difference.
3. **Deflection.** The accelerated ions pass through a magnetic field perpendicular to their velocity. The field exerts a force that bends the path; the curvature depends on the mass-to-charge ratio $m/z$. Lighter ions (smaller $m/z$) curve more; heavier ions curve less.
4. **Detection.** Detectors measure the relative number of ions arriving at different deflection angles, producing a spectrum of intensity vs $m/z$.

For singly charged ions ($z = +1$), $m/z$ is just the mass in atomic mass units.

**Reading a mass spectrum.** The x-axis is $m/z$ (or just mass for singly charged ions); the y-axis is **relative abundance** (often as a percentage of the most abundant peak, called the "base peak"). For an element with multiple isotopes, you see one peak per isotope, with heights proportional to natural abundance. For molecules, you see a peak at the molecular mass (the "molecular ion peak") plus peaks at smaller masses corresponding to fragmentation products.

**Calculating average atomic mass.**

$$\\text{Average atomic mass} \\,=\\, \\sum (\\text{isotope mass} \\times \\text{fractional abundance})$$

Worked example — chlorine. Two isotopes:

- $^{35}Cl$ mass = $34.97$ amu, abundance = $0.7577$.
- $^{37}Cl$ mass = $36.97$ amu, abundance = $0.2423$.

Average atomic mass = $(34.97 \\times 0.7577) + (36.97 \\times 0.2423)$
$= 26.50 + 8.96$
$= 35.46$ amu.

This matches the periodic table value of $35.45$ amu within rounding error. The average atomic mass is biased toward the more abundant isotope.

**Mass spectra of molecules.** Mass spec of a molecule produces:

- A peak at the **molecular ion** mass (the whole molecule minus one electron).
- Peaks at smaller $m/z$ from **fragmentation** — the molecule breaks apart in characteristic ways during ionization.

The fragmentation pattern is a **fingerprint**. For ethanol ($C_2H_5OH$, molar mass 46), the spectrum has peaks at:

- $m/z = 46$: molecular ion.
- $m/z = 45$: loss of H.
- $m/z = 31$: $CH_2OH^+$ (loss of $CH_3$).
- $m/z = 29$: $CHO^+$.
- $m/z = 15$: $CH_3^+$.

Each peak tells you about the structure. Identifying unknowns by their mass spectrum is a workhorse method in organic chemistry, drug discovery, and forensic science.

**Real-world applications.**

- **Radiometric dating.** Carbon-14 to carbon-12 ratios in formerly living material reveal age up to $\\sim 50{,}000$ years. Uranium-lead dating for rocks ($10^9$-year timescales). Argon-argon dating for volcanic rocks.
- **Forensic provenance.** Isotope ratios in hair, water, or drugs can pinpoint geographic origin — strontium isotopes vary regionally because soil bedrock varies.
- **Olympic anti-doping.** Mass spec detects banned substances at parts-per-trillion levels.
- **Climate science.** $\\delta^{18}O$ ratios in ice cores and deep-sea sediments reconstruct past temperatures over hundreds of thousands of years.
- **Proteomics.** Identifying which proteins are present in a complex biological sample, by digesting them into peptides and matching the resulting mass spectra to database predictions.
- **Drug discovery.** Identifying the exact molecular weight (and fragmentation pattern) of an unknown active compound from a mixture.

**Limitations to know.** Mass spec needs to ionize the sample, which can be hard for very large biological molecules; specialized ionization techniques (electrospray, MALDI) were Nobel Prize work because they let intact proteins fly. Mass spec can't directly distinguish stereoisomers (mirror-image molecules with the same mass) — for that you need other tools.

**Predicting spectra from configurations.** For a single-element spectrum, you should be able to:

- List the natural isotopes and their masses.
- Look up their abundances (or use information in the problem).
- Verify peak ratios in a spectrum match the abundances.

For molecules, predict the molecular ion mass from the formula and identify the most stable fragment ions (which often correspond to cleaving weakest bonds, e.g., next to oxygen in alcohols or aromatic rings).`,
      video: {
        url: 'https://www.youtube.com/watch?v=mBhKKEgIcjU',
        title: 'CrashCourse Chemistry — Mass spectrometry and isotopes',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.3',
      title: 'Elemental composition of pure substances',
      content:
`A pure substance has a fixed chemical composition. **Water** is always $H_2O$, no matter the source. **Table salt** is always $NaCl$, ignoring tiny impurities. The fixed composition lets you predict, from a known formula, what fraction of the mass comes from each element — or, going the other way, deduce the formula from measured mass percentages. This is the foundation of elemental analysis.

**Percent composition by mass.** The fraction of a compound's mass that comes from a given element.

$$\\%\\,X \\,=\\, \\frac{(\\text{number of X atoms}) \\times (\\text{atomic mass of X})}{\\text{molar mass of compound}} \\times 100\\%$$

Worked example — glucose ($C_6H_{12}O_6$, molar mass $180.18$ g/mol):

- Mass of C in 1 mole: $6 \\times 12.01 = 72.06$ g. So %C $= 72.06 / 180.18 = 40.00\\%$.
- Mass of H: $12 \\times 1.01 = 12.12$ g. %H $= 6.73\\%$.
- Mass of O: $6 \\times 16.00 = 96.00$ g. %O $= 53.27\\%$.

Check: $40.00 + 6.73 + 53.27 = 100.00\\%$ ✓ (must sum to 100% for any compound; small rounding errors are fine).

Worked example — ammonium nitrate ($NH_4NO_3$, common fertilizer, molar mass $80.04$ g/mol):

- 2 N atoms: $2 \\times 14.01 = 28.02$. %N $= 28.02/80.04 = 35.0\\%$.
- 4 H atoms: $4 \\times 1.01 = 4.04$. %H $= 5.0\\%$.
- 3 O atoms: $3 \\times 16.00 = 48.00$. %O $= 60.0\\%$.

The "35-0-0" rating on fertilizer bags refers to %N, %P$_2$O$_5$, %K$_2$O. Ammonium nitrate is one of the most concentrated nitrogen fertilizers.

**Empirical formula.** The smallest whole-number ratio of atoms in a compound. Found from mass-percent data without knowing the molar mass.

Recipe:

1. Assume you have $100$ g of compound (so percentages become grams).
2. Convert each element's mass to moles by dividing by the atomic mass.
3. Divide all mole values by the smallest one (so the smallest is 1).
4. If any value isn't close to a whole number, multiply through by a small integer to get integers ($2$ if there's a $0.5$; $3$ if there's a $0.33$ or $0.67$; $4$ if there's a $0.25$ or $0.75$).

Worked example. A compound is analyzed and found to be $40.00\\%$ C, $6.73\\%$ H, $53.27\\%$ O. Find the empirical formula.

- Assume $100$ g: $40.00$ g C, $6.73$ g H, $53.27$ g O.
- Moles: C $= 40.00/12.01 = 3.331$; H $= 6.73/1.01 = 6.663$; O $= 53.27/16.00 = 3.329$.
- Divide by smallest ($\\sim 3.329$): C : H : O = $1.00 : 2.00 : 1.00$.
- Empirical formula: $CH_2O$.

**Molecular formula.** The actual count of atoms per molecule. Found by combining the empirical formula with the molar mass.

Continuing the example: suppose mass spec tells you the molar mass is $180$ g/mol. Empirical formula $CH_2O$ has a formula mass of $12.01 + 2.02 + 16.00 = 30.03$ g/mol. Ratio: $180/30 = 6$. Multiply through: $C_6H_{12}O_6$ — glucose.

**Empirical vs molecular formula — when they differ.**

- $CH_2O$ — empirical formula of glucose, fructose, ribose, formaldehyde, acetic acid (after multiplying), and many other compounds. All have the same C:H:O ratio.
- $H_2O$ — both empirical and molecular formula of water. Already at simplest ratio.
- $C_2H_4$ — molecular formula of ethylene; empirical is $CH_2$.
- $C_2H_6$ — ethane; empirical $CH_3$.
- $H_2O_2$ — hydrogen peroxide; empirical $HO$.
- $C_6H_6$ — benzene; empirical $CH$.

Same elemental composition does not mean same compound. The empirical formula is a necessary but not sufficient piece of information.

**Combustion analysis.** A workhorse method for determining the empirical formula of an organic compound. Burn a known mass of the sample completely in excess $O_2$. Capture and weigh the resulting $CO_2$ and $H_2O$.

- All the carbon in the sample ends up as $CO_2$. So mass of C in sample = (mass of $CO_2$) $\\times$ (12.01/44.01).
- All the hydrogen ends up as $H_2O$. Mass of H = (mass of $H_2O$) $\\times$ ($2 \\times 1.01/18.02$) = (mass of $H_2O$) $\\times$ ($0.1119$).
- Any remaining mass (sample mass minus C minus H) is other elements (typically oxygen for sugars and alcohols).

Worked example. A $10.0$ mg sample of an unknown hydrocarbon-and-oxygen compound is burned. Products: $25.0$ mg $CO_2$ and $10.2$ mg $H_2O$.

- Mass of C: $25.0 \\times 12.01/44.01 = 6.82$ mg.
- Mass of H: $10.2 \\times 0.1119 = 1.14$ mg.
- Mass of O: $10.0 - 6.82 - 1.14 = 2.04$ mg.
- Moles: C $= 6.82/12.01 = 0.568$ mmol; H $= 1.14/1.01 = 1.13$ mmol; O $= 2.04/16.00 = 0.128$ mmol.
- Divide by smallest: C : H : O = $4.44 : 8.83 : 1$.
- Multiply by appropriate factor to get integers... here the ratios are close enough to $4.5 : 9 : 1$, which $\\times 2$ gives $9 : 18 : 2$. So empirical formula is $C_9H_{18}O_2$ — a fatty acid like nonanoic acid.

**Why this matters historically.** This is exactly how chemistry built up its understanding of organic compounds in the 1800s. Justus von Liebig developed the combustion analysis method in the 1830s; thousands of compounds were characterized over the next decades by burning them and measuring the gases produced. The relationships between empirical formulas, molecular formulas, and structures were worked out by chemists like Friedrich August Kekulé, who proposed the structure of benzene after (he claimed) dreaming of a snake biting its tail. The mass-balance arithmetic you're doing in 1.3 is the same arithmetic that made early organic chemistry possible.`,
      video: {
        url: 'https://www.youtube.com/watch?v=AsqEkF7hcII',
        title: 'CrashCourse Chemistry — Stoichiometry',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.4',
      title: 'Composition of mixtures',
      content:
`Pure substances have fixed compositions; **mixtures** do not. A spoonful of saltwater is mostly water and a little salt; the next spoonful could have more or less salt. Mixtures are everywhere — the atmosphere is a mixture of $N_2$, $O_2$, $Ar$, $CO_2$, and traces; seawater is a mixture of water and dozens of dissolved salts; a steel alloy is a mixture of iron with carbon and various other metals. Almost every real-world chemical sample is a mixture; pure substances are rare outside the lab.

**Types of mixtures.**

- **Homogeneous mixtures (solutions)** are uniform at the molecular scale. You can't distinguish solute from solvent by eye or even microscope — they look like a single substance. Examples: saltwater (NaCl + water), air (N$_2$ + O$_2$ + Ar + ...), brass (Cu + Zn), 14-carat gold (Au + Cu + Ag).
- **Heterogeneous mixtures** have visible regions of different composition. Examples: sand and iron filings, oil and water, granite (visible mineral grains), tossed salad, blood (cells suspended in plasma).
- A **colloid** is intermediate: particles are large enough to scatter light (the **Tyndall effect**) but small enough not to settle out. Milk (fat droplets), fog (water droplets), gelatin (proteins).

**Concentration units.** Several systems exist; they're useful for different purposes.

- **Molarity ($M$)** $= \\dfrac{\\text{moles of solute}}{\\text{liters of solution}}$. The chemist's standard. Easy to measure (volumetric flask), easy to use in stoichiometry. Drawback: depends on temperature (volume changes with temperature).
- **Molality ($m$)** $= \\dfrac{\\text{moles of solute}}{\\text{kg of solvent}}$. Used in colligative property calculations (boiling-point elevation, freezing-point depression) because it's temperature-independent.
- **Mole fraction ($\\chi$)** $= \\dfrac{\\text{moles of A}}{\\text{total moles}}$. Used in Raoult's law and in gas-mixture calculations. Sum of mole fractions in any mixture is 1.
- **Mass percent** $= \\dfrac{m_{\\text{solute}}}{m_{\\text{total}}} \\times 100\\%$. Used in commercial labeling — "$3\\%$ hydrogen peroxide" means $3$ g of $H_2O_2$ per $100$ g of solution.
- **Parts per million (ppm)** and **parts per billion (ppb)**, for very dilute solutions. For water, $1$ ppm $\\approx 1$ mg per liter (since 1 L of water is $\\sim 1$ kg = $10^6$ mg). EPA water-quality limits are often in ppm or ppb.

**Worked examples.**

Make 500 mL of a $0.5$ M $NaCl$ solution. Moles needed = volume $\\times$ molarity = $0.500 \\times 0.5 = 0.25$ mol. Mass of NaCl needed = $0.25 \\times 58.44 = 14.6$ g. Procedure: dissolve $14.6$ g of NaCl in some water in a $500$ mL volumetric flask, then add water to the $500$ mL mark and mix.

**Dilution.** Adding more solvent to a solution decreases concentration. Total moles of solute don't change, so:

$$M_1 V_1 \\,=\\, M_2 V_2$$

where $M_1, V_1$ are the initial molarity and volume, and $M_2, V_2$ are the final.

Make $250$ mL of $0.10$ M $HCl$ from a $1.00$ M stock. $V_1 = (0.10 \\times 250)/1.00 = 25$ mL. Procedure: add $25$ mL of stock to a $250$ mL flask, add water to mark.

**Safety note.** Always **add acid to water**, not water to acid, when diluting concentrated acids. The dissolution releases enough heat to flash-boil a small amount of water, splattering acid. By adding acid into a large amount of water, the heat is dispersed safely.

**Mixtures of gases — partial pressures.** Dalton's law: in a gas mixture, each component contributes a **partial pressure** equal to what it would exert if it alone occupied the volume. Total pressure equals the sum of partial pressures:

$$P_{\\text{total}} \\,=\\, P_1 + P_2 + P_3 + \\ldots$$

Each partial pressure can be expressed in terms of mole fraction: $P_i = \\chi_i P_{\\text{total}}$.

Earth's atmosphere at sea level (1 atm total): $P_{N_2} = 0.78$ atm, $P_{O_2} = 0.21$ atm, $P_{Ar} \\approx 0.01$ atm, $P_{CO_2} \\approx 0.0004$ atm. At 8,000 m altitude, total pressure drops to $\\sim 0.36$ atm; mole fractions stay the same, but partial pressure of $O_2$ falls to $\\sim 0.08$ atm — at this altitude, breathing supplemental $O_2$ is required for most people.

**Separation methods.** The key insight for separating mixtures: exploit a physical property that differs between components.

- **Filtration.** Solid from liquid. Mixture is poured through a porous barrier. The liquid passes; the solid is held. Coffee filters, kidney glomeruli, and gold pans all work this way.
- **Distillation.** Liquids with different boiling points. Heat the mixture; the lower-boiling component evaporates first; condense it elsewhere. Petroleum refining separates crude oil into gasoline, kerosene, diesel, etc. by fractional distillation in tall columns.
- **Chromatography.** Components have different affinities for a stationary phase and a mobile phase. Paper chromatography for pigments (the basis of biochemistry textbook diagrams of chlorophyll); thin-layer chromatography (TLC) for organic synthesis monitoring; gas chromatography (GC) for volatile mixtures; high-performance liquid chromatography (HPLC) for proteins and pharmaceutical purity testing. Combining gas chromatography with mass spectrometry (GC-MS) produces an unsurpassed method for identifying complex mixtures — used in environmental monitoring, drug screening, and forensic analysis.
- **Centrifugation.** Components with different densities. Spinning the mixture creates an artificial gravitational field. Denser components migrate outward faster. Blood cells separate from plasma; biological molecules separate by size or density in ultracentrifuges.
- **Magnetic separation.** Ferromagnetic materials are pulled out by a magnet. Useful in mineral processing and recycling.
- **Crystallization (recrystallization).** Dissolve the impure solid in a hot solvent, cool slowly. The desired compound crystallizes out as a relatively pure solid; impurities stay in solution.
- **Solvent extraction.** Two immiscible solvents; the desired compound partitions preferentially into one. Caffeine extraction from coffee is a famous example.

**Real-world example — drinking water.** Tap water is a complex mixture — water with dissolved $Ca^{2+}$, $Mg^{2+}$, $Na^+$, $Cl^-$, $HCO_3^-$, traces of metals and organic compounds, and added chlorine or fluoride. Treatment plants use a sequence: sedimentation (gravity removes suspended solids), filtration (removes finer particles), chlorination or UV (kills pathogens), sometimes reverse osmosis (a membrane that lets water through but rejects most salts). Each step exploits a different physical difference between water and the impurities to remove.`,
      video: {
        url: 'https://www.youtube.com/watch?v=fROBNVit01s',
        title: 'CrashCourse Chemistry — Mixtures and solutions',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.5',
      title: 'Atomic structure and electron configuration',
      content:
`The chemistry of an element is set by the arrangement of its electrons. To predict reactivity, bonding, color, magnetism — almost anything — you need to know how the electrons are distributed among orbitals. The rules for that distribution were worked out in the 1920s, after the Schrödinger equation gave the first quantitative description of atomic structure. They're called the **rules of electron configuration**, and they govern everything that follows.

**The subatomic particles.**

| Particle | Charge | Mass (amu) | Location |
|----------|--------|-----------|----------|
| Proton   | +1     | 1.0073    | nucleus  |
| Neutron  | 0      | 1.0087    | nucleus  |
| Electron | $-1$   | 0.000549  | orbitals around nucleus |

- The **atomic number** $Z$ = number of protons. Defines the element.
- The **mass number** $A$ = protons + neutrons. Defines the isotope.
- **Isotopes** of an element share $Z$ but differ in $N = A - Z$.
- The electron mass is $\\sim 1/1836$ of the proton mass — so the mass of an atom is almost entirely in the nucleus, even though the volume is mostly empty space inhabited by the electrons.

**Atomic shells and orbitals.** Electrons don't orbit the nucleus like planets — they occupy **orbitals**, which are 3D probability distributions describing where the electron is likely to be found. Orbitals are organized into **shells** by principal quantum number $n$, and within each shell into **subshells** by orbital type:

- **$s$ orbital** — spherical. Each shell has one $s$ orbital. Holds 2 electrons.
- **$p$ orbital** — dumbbell-shaped. Each shell starting from $n=2$ has 3 $p$ orbitals ($p_x$, $p_y$, $p_z$), one along each axis. Total 6 electrons.
- **$d$ orbital** — more complex, 5 orientations. Shells from $n=3$ on. Total 10 electrons.
- **$f$ orbital** — 7 orientations. Shells from $n=4$ on. Total 14 electrons.

Total capacity per shell: $n=1 \\to 2$; $n=2 \\to 8$ ($2 + 6$); $n=3 \\to 18$ ($2 + 6 + 10$); $n=4 \\to 32$ ($2 + 6 + 10 + 14$).

**Filling order — the Aufbau principle.** "Aufbau" is German for "building up." The rule: electrons fill the lowest-energy orbitals first.

Order: $1s \\to 2s \\to 2p \\to 3s \\to 3p \\to 4s \\to 3d \\to 4p \\to 5s \\to 4d \\to 5p \\to 6s \\to 4f \\to 5d \\to 6p \\to 7s \\to 5f \\to 6d \\to 7p$.

The reason $4s$ comes before $3d$ — and similarly $5s$ before $4d$, $6s$ before $4f$, etc. — is that overlapping shells have their energies tangled by interactions with the nucleus and with other electrons. Lower $n+l$ (where $l$ is the orbital angular momentum quantum number: $s = 0$, $p = 1$, $d = 2$, $f = 3$) fills first; for ties, lower $n$ wins.

**Hund's rule.** Within a set of degenerate orbitals (like the three $2p$ orbitals), electrons spread out one per orbital with parallel spins before any orbital gets a second electron. This minimizes electron-electron repulsion. For carbon ($1s^2 2s^2 2p^2$): the two $2p$ electrons occupy two different $2p$ orbitals, not the same one.

**Pauli exclusion principle.** No two electrons in the same atom can have all four quantum numbers identical. Practically: each orbital holds at most two electrons, with opposite spins. This is the reason for the orbital capacities ($s = 2$, $p = 6$, etc.) and the structure of the periodic table itself.

**Worked examples — write the electron configuration.**

- Hydrogen ($Z=1$): $1s^1$.
- Helium ($Z=2$): $1s^2$. First shell full. Noble gas.
- Lithium ($Z=3$): $1s^2 2s^1$.
- Carbon ($Z=6$): $1s^2 2s^2 2p^2$. Or with Hund's rule: $2p_x^1 2p_y^1$ (two unpaired electrons).
- Neon ($Z=10$): $1s^2 2s^2 2p^6$. Second shell full. Noble gas.
- Sodium ($Z=11$): $1s^2 2s^2 2p^6 3s^1$. Outer electron alone in 3$s$ — extremely reactive.
- Iron ($Z=26$): $[Ar] 4s^2 3d^6$. The condensed notation $[Ar]$ means "everything up through argon" ($1s^2 2s^2 2p^6 3s^2 3p^6$).
- Bromine ($Z=35$): $[Ar] 4s^2 3d^{10} 4p^5$. One electron short of full $4p$ — highly reactive.

**Noble gas shorthand.** Writing out $1s^2 2s^2 2p^6 \\ldots$ for every element gets tedious. Use the symbol of the previous noble gas in brackets to represent the core, and write only the valence (outer-shell) electrons:

- Na: $[Ne] 3s^1$.
- Cl: $[Ne] 3s^2 3p^5$.
- Ca: $[Ar] 4s^2$.
- Sn: $[Kr] 5s^2 4d^{10} 5p^2$.

**Anomalies.** Two well-known exceptions to strict Aufbau filling, due to the extra stability of half-filled or fully-filled subshells:

- **Chromium ($Z = 24$)**: predicted $[Ar] 4s^2 3d^4$; actual $[Ar] 4s^1 3d^5$. One electron is moved from $4s$ to $3d$ to give a half-filled $3d$ subshell (more stable).
- **Copper ($Z = 29$)**: predicted $[Ar] 4s^2 3d^9$; actual $[Ar] 4s^1 3d^{10}$. One electron is moved to give a full $3d$ subshell.

Similar anomalies occur for Mo, Ag, Au, and a few others. AP exam questions on Cr and Cu specifically often test whether you remember these exceptions.

**Why this matters for chemistry.**

- **Valence electrons** (the outermost shell) determine bonding behavior. Atoms with the same number of valence electrons (same group) behave chemically similarly — Na and K both react violently with water, both lose one electron to form +1 ions.
- **Full shells (noble gases)** are exceptionally stable. Atoms strive toward configurations that match a noble gas — by losing, gaining, or sharing electrons. This is the foundation of the octet rule.
- **Magnetic properties** track unpaired electrons. Atoms with unpaired electrons are **paramagnetic** (attracted by a magnet); those with all paired are **diamagnetic** (slightly repelled). Oxygen ($O_2$) is paramagnetic — liquid oxygen poured between the poles of a magnet sticks to the magnet, a famous demo.
- **Color** of compounds containing transition metals (Fe, Cu, Co, Ni, etc.) depends on $d$-orbital splitting in their bonding environment. Different ligands produce different colors — the basis of why copper sulfate is blue, hemoglobin is red, chlorophyll is green.

**The Bohr model vs. the modern picture.** Bohr's 1913 model had electrons orbiting like planets at fixed radii. It gave the right hydrogen spectrum but failed for atoms with more than one electron and gave a misleading picture of electron motion. The modern picture (Schrödinger 1926, refined by Born, Heisenberg, Dirac) replaces orbits with orbitals — probability distributions. Electrons don't trace paths; they exist in standing-wave patterns whose intensity at each point is the probability of finding the electron there. This is the picture you should carry — even though the Bohr model is occasionally still used as a simplified teaching aid.`,
      video: {
        url: 'https://www.youtube.com/watch?v=Aoi4j8es4gQ',
        title: 'CrashCourse Chemistry — Electron configurations',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.6',
      title: 'Photoelectron spectroscopy (PES)',
      content:
`Electron configuration is a model that says where electrons live and how much energy is needed to remove them. **Photoelectron spectroscopy (PES)** is the experimental technique that directly tests the model — measuring the ionization energies of individual electron shells and producing spectra that confirm the predicted shell structure of atoms. PES is on the AP Chemistry exam because it makes the abstract electron-configuration model concrete, and because PES spectra are great fodder for "interpret this graph" questions.

**The basic experiment.** A sample of atoms (usually a gas) is bombarded with photons of known energy — typically X-rays or UV light. The photons knock electrons out. The kinetic energy of the ejected electrons is measured.

The conservation of energy:

$$E_{\\text{photon}} \\,=\\, IE + KE_{\\text{electron}}$$

So **ionization energy = photon energy − kinetic energy of ejected electron**. By scanning a range of photon energies (or using a fixed high-energy beam and measuring the electron kinetic energy distribution), you build a spectrum of ionization energies for all the different shells in the atom.

The result is plotted as a spectrum: x-axis is ionization energy (usually in megajoules per mole, MJ/mol, sometimes in electronvolts, eV); y-axis is relative intensity (proportional to the number of electrons at that ionization energy).

**Reading a PES spectrum.**

- **Peak position (x-axis)** tells you the ionization energy of one shell of electrons.
- **Peak height (y-axis)** tells you how many electrons are in that shell. A peak twice as tall has twice as many electrons.
- **Multiple peaks** at increasing ionization energy correspond to successively deeper shells.

The convention is left = higher IE (innermost, hardest to remove), right = lower IE (outermost, easiest). Some textbooks plot it the other way; pay attention to the axis label.

**Example — neon ($1s^2 2s^2 2p^6$).** Three filled subshells, so three peaks:

- $1s$: ionization energy $\\approx 84$ MJ/mol. Innermost; tightest binding to the +10 nucleus. Hardest to remove.
- $2s$: $\\approx 4.68$ MJ/mol. Still in the same shell as $2p$ but spherical, with somewhat more nuclear penetration.
- $2p$: $\\approx 2.08$ MJ/mol. Outermost; least bound; easiest to remove.

The peak ratios match the electron count: $1s$ has 2 electrons, $2s$ has 2, $2p$ has 6. So the $2p$ peak is 3× as tall as the $1s$ or $2s$ peak.

**Example — sodium ($1s^2 2s^2 2p^6 3s^1$).** Four peaks:

- $1s$: $\\sim 104$ MJ/mol. Higher than neon's $1s$ because Na has +11 nuclear charge vs. neon's +10. More protons → all electrons more tightly bound.
- $2s$: $\\sim 6.84$ MJ/mol.
- $2p$: $\\sim 3.67$ MJ/mol.
- $3s$: $\\sim 0.50$ MJ/mol. Far easier to remove than the next-lowest shell — the discontinuity reveals that $3s$ is in an outer shell. Peak height is half of $2s$ (because $3s$ has 1 electron vs. 2).

The dramatic drop from $2p$ (3.67 MJ/mol) to $3s$ (0.50 MJ/mol) is the **shell discontinuity** — direct evidence that $3s$ is in a separate, outer shell, not just a higher subshell within the same shell. This is one of PES's most important contributions: the model says "shell structure exists" and the data show it directly.

**What PES tells you about the atom.**

1. **Confirms shell structure.** Large gaps between $1s$ and $2s$, between $2p$ and $3s$, etc., show that shells are real.
2. **Confirms subshell structure.** Within a shell, $s$ and $p$ peaks are distinct — confirming subshells.
3. **Confirms electron counts.** Peak heights match the electron configuration.
4. **Identifies elements.** Each element has a unique pattern of peak positions. PES is used in surface analysis to identify what elements are present in a sample.
5. **Distinguishes core from valence.** The big jump in IE between the deepest valence shell and the outermost core shell defines the core-valence boundary.

**Trends across the periodic table — how peak positions shift.**

- **Increasing $Z$ (more protons).** All peaks shift to higher IE — more nuclear charge holds all electrons more tightly. The shift is biggest for core electrons (which feel the full nuclear charge), smaller for valence electrons (which are partly shielded).
- **Down a group.** Outer shell moves to higher $n$; outer-shell electrons are farther from the nucleus and easier to remove. Outer-shell peak shifts to lower IE.
- **Across a period.** Same outer shell; more protons; outer-shell electrons held more tightly. Outer-shell peak shifts to higher IE (with some exceptions at group 13 → 14 and group 15 → 16, where subshell-filling effects produce small dips).

**Practical applications.**

- **X-ray photoelectron spectroscopy (XPS)** is the lab version. A workhorse method for analyzing surfaces of materials. Tells you not just what elements are present but also their oxidation states (because oxidation shifts the IE of core electrons by small but measurable amounts).
- **UV photoelectron spectroscopy (UPS)** uses lower-energy UV photons; specialized for valence-shell measurements.
- **Surface science**, semiconductor characterization, catalyst studies, and materials development all rely on PES variants.

**A note on units.** AP Chem usually uses **MJ/mol** for PES (mega-joules per mole of electrons). Real-world XPS data are usually in **electron-volts** (eV), where 1 eV $\\approx 96.5$ kJ/mol $\\approx 0.0965$ MJ/mol. The conversion isn't usually needed on the exam, but it's good to know that the same physics underlies AP exam problems and Nobel-grade surface-science instrumentation.

**Predicting peak positions and heights — exam strategy.**

Given an element, predict the spectrum:

1. Write the electron configuration.
2. Each distinct subshell ($1s$, $2s$, $2p$, $3s$, $3p$, $3d$, etc.) gives its own peak.
3. Peak heights are proportional to electron counts in each subshell.
4. Peak positions: $1s$ is leftmost (highest IE), then $2s$, then $2p$, etc., with a noticeable gap between shells.

Given a spectrum, identify the element or test a configuration claim:

1. Count peaks → number of subshells with electrons.
2. Read off heights → electron counts → total electron count → Z.
3. Check gap positions → shell vs subshell structure.`,
      video: {
        url: 'https://www.youtube.com/watch?v=Aoi4j8es4gQ',
        title: 'CrashCourse Chemistry — Photoelectron spectroscopy',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.7',
      title: 'Periodic trends',
      content:
`The periodic table isn't just a filing cabinet for the elements. The arrangement — by atomic number, in rows of increasing shell number, with families of similar elements stacked into columns — captures the deep regularities of chemistry. Properties shift predictably as you move across rows and down columns. Mastering these **periodic trends** lets you predict reactivity and bonding behavior for elements you've never specifically studied.

**Atomic radius.** The size of an atom, typically measured as half the distance between the centers of two bonded atoms of the same element.

**Across a period (left to right): atomic radius decreases.** The outer shell stays at the same $n$, but the nuclear charge increases (more protons). More protons pull the same number of outer electrons in tighter. Sodium ($Z=11$, radius $\\sim 186$ pm) is much larger than chlorine ($Z=17$, radius $\\sim 99$ pm).

**Down a group (top to bottom): atomic radius increases.** Each new period adds a new shell — the outer electrons are in larger $n$ orbitals, farther from the nucleus. Lithium ($r \\sim 152$ pm) → Sodium ($186$ pm) → Potassium ($227$ pm) → Cesium ($\\sim 265$ pm).

The two trends together: smallest atoms in the upper right (helium, neon, fluorine); largest in the lower left (cesium, francium).

**Ionization energy (IE).** The energy required to remove the most loosely held electron from a gaseous atom: $X(g) \\to X^+(g) + e^-$.

**Across a period: IE increases.** Smaller atoms with more nuclear charge hold their electrons more tightly. Sodium: 496 kJ/mol; chlorine: 1251 kJ/mol; argon: 1521 kJ/mol.

**Down a group: IE decreases.** Larger atoms with outer electrons in higher shells (farther from the nucleus, more shielded) lose them more easily. Cesium (376 kJ/mol) gives up its outer electron with the least energy of any stable element.

**Successive ionization energies.** Once you remove one electron, the resulting cation is smaller and more positive, so it holds remaining electrons more tightly. Each successive IE is larger than the previous. The biggest jumps occur when you start removing electrons from the next inner shell.

Example — magnesium ($1s^2 2s^2 2p^6 3s^2$):

- $IE_1 = 738$ kJ/mol (remove first $3s$ electron).
- $IE_2 = 1450$ kJ/mol (remove second $3s$ electron).
- $IE_3 = 7733$ kJ/mol (now removing from $2p$ — huge jump).
- $IE_4 = 10540$ kJ/mol (still $2p$).
- ... and so on.

The huge jump between $IE_2$ and $IE_3$ confirms that magnesium has 2 valence electrons (in $3s$). Successive IEs reveal valence electron count and are a classic AP exam item.

**Exceptions in IE across a period.** Group 13 (B, Al, Ga, In) has slightly lower IE than the preceding group 2 (Be, Mg, Ca, Sr) — because removing a $p$ electron is easier than removing an $s$ electron (the $p$ subshell is at a slightly higher energy). Group 16 (O, S, Se) has slightly lower IE than group 15 (N, P, As) — because the $p^4$ configuration has a paired electron in one $p$ orbital, and removing that paired electron is easier than removing an unpaired electron from a half-filled subshell (Hund's-rule logic in reverse).

**Electron affinity (EA).** The energy released when a gaseous atom gains an electron: $X(g) + e^- \\to X^-(g)$. By convention, a more negative EA means more energy released (the atom "wants" the electron more).

- **Halogens** (Group 17) have very negative EAs — they're one electron short of a noble-gas configuration. Chlorine: $-349$ kJ/mol (a lot of energy released).
- **Noble gases** (Group 18) have positive EAs — they don't want more electrons; adding one would require energy input. They're already at a full shell.
- **Alkali metals** (Group 1) have modest negative EAs — they'd rather lose an electron than gain one, but adding does release a little energy because the new electron pairs with the lone $s$ valence electron.

EA generally becomes more negative going right across a period and slightly less negative going down a group.

**Electronegativity (EN).** The tendency of an atom in a bond to attract the shared electrons. The Pauling scale runs from $0.7$ (cesium) to $4.0$ (fluorine).

**Across a period: EN increases.** Same shell, more protons, stronger pull on shared electrons.

**Down a group: EN decreases.** Larger atom, outer shell farther from nucleus, weaker pull.

**Trends together.** EN is highest in the upper right (excluding noble gases, which don't form bonds in most contexts): F > O > N > Cl > Br > C, etc. Lowest in the lower left: Cs, Fr, Rb, K, Na.

EN determines bond polarity:

- **Difference < 0.5**: essentially nonpolar covalent (C–H, C–C).
- **Difference 0.5–1.7**: polar covalent (O–H, C–O, N–H).
- **Difference > 1.7**: ionic (Na–Cl, K–F).

These thresholds are approximations; chemistry is a continuum.

**Metallic character.** Metals lose electrons easily, conduct electricity, are malleable. Nonmetals gain electrons, insulate, are brittle.

**Across a period: metallic character decreases.** Going from sodium (definitely a metal) to chlorine (definitely a nonmetal) to argon (gas).

**Down a group: metallic character increases.** Going from carbon (nonmetal) to silicon (metalloid) to germanium (metalloid) to tin and lead (metals).

The **metalloids** (B, Si, Ge, As, Sb, Te) sit along the stair-step boundary, with mixed behavior. They're the basis of modern semiconductor electronics — silicon underlies the entire transistor industry.

**Ionic radius.**

- **Cations** (atoms that have lost electrons) are smaller than the parent atoms. Often a whole shell has been removed. $Na^+$ is much smaller than Na (the entire $3s$ shell is gone).
- **Anions** (atoms that have gained electrons) are larger than the parent atoms. Added electrons increase electron-electron repulsion, expanding the outer shell. $Cl^-$ is bigger than Cl.

**Isoelectronic series.** Atoms or ions with the same number of electrons but different nuclear charges. For example, $O^{2-}$, $F^-$, $Ne$, $Na^+$, $Mg^{2+}$, $Al^{3+}$ all have 10 electrons. As $Z$ increases (more protons pulling the same number of electrons), size decreases. So $O^{2-} > F^- > Ne > Na^+ > Mg^{2+} > Al^{3+}$ in size.

**Why trends matter — reactivity.**

- **Alkali metals (Group 1).** Lowest IE — easily lose 1 electron → +1 ion. Reactivity increases down the group: Li reacts with water energetically, Na violently, K explosively, Cs incandescently.
- **Halogens (Group 17).** Most negative EA — gain 1 electron easily → −1 ion. Reactivity decreases down the group: F is the most reactive nonmetal (reacts with almost everything, including noble gases and glass); I is much less reactive.
- **Noble gases (Group 18).** Full valence shell. Highest IE; positive EA. Don't form compounds easily. Xe and Kr do form some compounds (XeF$_2$, XeO$_3$) with very electronegative partners, but most noble-gas chemistry is unreactive.
- **Transition metals.** Variable oxidation states (because $d$-orbital electrons can be lost in addition to $s$-orbital electrons). Form colored compounds. Often act as catalysts. The chemistry is rich but harder to summarize in simple rules.

**Practical takeaways.**

- "Where on the periodic table?" is usually the right first question for predicting an element's behavior.
- Electronegativity differences predict bond type and polarity.
- Atomic size and IE together predict whether an atom prefers to lose, gain, or share electrons in bonding.
- Successive IEs reveal the number of valence electrons.`,
      video: {
        url: 'https://www.youtube.com/watch?v=0RRVV4Diomg',
        title: 'CrashCourse Chemistry — The periodic table',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.8',
      title: 'Valence electrons and ionic compounds',
      content:
`The valence electrons of an atom — the electrons in the outermost shell — determine how it bonds. Atoms with similar valence configurations behave similarly chemically; that's the deep reason the periodic table works. Combining what we've learned about electron configuration (1.5), PES (1.6), and periodic trends (1.7), we can now predict how atoms combine to form ionic compounds, and what properties those compounds will have.

**Counting valence electrons.** For main-group elements (Groups 1, 2, 13-18), the count is straightforward.

| Group | Valence count | Examples |
|-------|---------------|----------|
| 1 | 1 | Li, Na, K, Rb, Cs |
| 2 | 2 | Be, Mg, Ca, Sr, Ba |
| 13 | 3 | B, Al, Ga, In, Tl |
| 14 | 4 | C, Si, Ge, Sn, Pb |
| 15 | 5 | N, P, As, Sb, Bi |
| 16 | 6 | O, S, Se, Te |
| 17 | 7 | F, Cl, Br, I |
| 18 | 8 (full) | He has 2 |

Transition metals (Groups 3-12) are more complex because $d$ electrons are involved in bonding too. They typically display multiple possible oxidation states (Fe is commonly +2 or +3; Cu is +1 or +2; Mn ranges from +2 to +7).

**The octet rule.** Atoms tend toward configurations with 8 valence electrons (or 2 for H and He). This is the noble-gas configuration; it's exceptionally stable because all valence orbitals are filled and there are no electrons in higher-energy orbitals waiting to bond. Atoms achieve the octet by:

- **Losing electrons** (metals) → become cations with positive charge.
- **Gaining electrons** (nonmetals) → become anions with negative charge.
- **Sharing electrons** (covalent bonding; see Unit 2).

Exceptions: H and He aim for 2, not 8. Boron and aluminum sometimes form compounds with only 6 valence electrons (incomplete octet). Sulfur, phosphorus, and chlorine can have expanded octets (10 or more) using $d$ orbitals.

**Predictable main-group ion charges.**

- Group 1: lose 1 electron → +1 ($Na^+$, $K^+$).
- Group 2: lose 2 electrons → +2 ($Mg^{2+}$, $Ca^{2+}$).
- Group 13: lose 3 electrons → +3 ($Al^{3+}$).
- Group 15: gain 3 electrons → -3 ($N^{3-}$, $P^{3-}$) — though group 15 is more typically covalent.
- Group 16: gain 2 electrons → -2 ($O^{2-}$, $S^{2-}$).
- Group 17: gain 1 electron → -1 ($F^-$, $Cl^-$, $Br^-$, $I^-$).
- Group 18: no ions form readily (already full shell).

**Worked example: predict the formula of magnesium nitride.** Mg is Group 2, charge +2. N is Group 15, charge -3. Balance the charges: 3 Mg$^{2+}$ provide $+6$; 2 N$^{3-}$ provide $-6$. Formula: $Mg_3N_2$.

**Worked example: predict the formula of aluminum oxide.** Al is +3; O is -2. 2 Al gives +6; 3 O gives -6. Formula: $Al_2O_3$.

**The "crisscross" shortcut.** Write each ion with its charge. Use the magnitude of each charge as the subscript of the *other* ion. Simplify if there's a common factor.

$Al^{3+}\\,O^{2-} \\to Al_2O_3$ (no common factor; stays).

$Mg^{2+}\\,O^{2-} \\to Mg_2O_2 \\to MgO$ (common factor of 2; simplified to 1:1).

**Polyatomic ions.** Charged groups of atoms held together by covalent bonds. They behave as single units in ionic compounds. Memorize these for AP Chem:

| Ion | Charge | Common compounds |
|-----|--------|------------------|
| Ammonium $NH_4^+$ | +1 | $NH_4Cl$, $(NH_4)_2SO_4$ |
| Hydroxide $OH^-$ | -1 | NaOH, $Ca(OH)_2$ |
| Nitrate $NO_3^-$ | -1 | $NaNO_3$, $KNO_3$ |
| Nitrite $NO_2^-$ | -1 | $NaNO_2$ |
| Sulfate $SO_4^{2-}$ | -2 | $Na_2SO_4$, $CaSO_4$ |
| Sulfite $SO_3^{2-}$ | -2 | $Na_2SO_3$ |
| Phosphate $PO_4^{3-}$ | -3 | $Na_3PO_4$ |
| Carbonate $CO_3^{2-}$ | -2 | $CaCO_3$, $Na_2CO_3$ |
| Bicarbonate $HCO_3^-$ | -1 | $NaHCO_3$ (baking soda) |
| Acetate $CH_3COO^-$ | -1 | $NaCH_3COO$ |
| Permanganate $MnO_4^-$ | -1 | $KMnO_4$ |
| Chromate $CrO_4^{2-}$ | -2 | $K_2CrO_4$ |
| Dichromate $Cr_2O_7^{2-}$ | -2 | $K_2Cr_2O_7$ |
| Cyanide $CN^-$ | -1 | KCN, NaCN |

**Writing formulas with polyatomic ions.** Use parentheses when more than one of a polyatomic ion is needed. Calcium phosphate: $Ca^{2+}$ and $PO_4^{3-}$. Balance: 3 Ca (+6) + 2 PO$_4$ (-6). Formula: $Ca_3(PO_4)_2$. The parentheses indicate that the subscript 2 applies to the whole $PO_4$ unit.

**Naming ionic compounds.**

- For compounds of a metal with a fixed charge (Groups 1, 2, Al, Zn, Ag): name = metal + nonmetal-ide.
  - NaCl: sodium chloride.
  - CaO: calcium oxide.
  - $Mg_3N_2$: magnesium nitride.
- For metals with variable charge (transition metals, some main-group): use Roman numerals to specify the charge.
  - $FeCl_2$: iron(II) chloride.
  - $FeCl_3$: iron(III) chloride.
  - $CuS$: copper(II) sulfide.
  - $Cu_2S$: copper(I) sulfide.
- With polyatomic ions: just name them.
  - $Na_2SO_4$: sodium sulfate.
  - $CaCO_3$: calcium carbonate.
  - $NH_4Cl$: ammonium chloride.

**Properties of ionic compounds.**

- **High melting and boiling points.** Each ion is electrostatically attracted to all the surrounding oppositely charged ions in the lattice (Coulomb's law: $F \\propto q_1 q_2 / r^2$). Breaking the lattice apart costs enormous energy. NaCl melts at 801 °C; MgO at 2800 °C (smaller ions with $+2$/$-2$ charges → stronger attractions).
- **Brittle.** When force is applied, ions shift; eventually like charges line up next to each other; the lattice repels itself and shatters. This is why ceramic dishes break under impact while metals dent.
- **Conduct electricity when molten or dissolved.** In the solid lattice, ions are locked in place — no current. Once molten (ions free to move) or dissolved in water (ions surrounded by water molecules and free), they can carry current.
- **Generally water-soluble.** Polar water molecules surround each ion, with their slight negative ($O$) ends toward cations and slight positive ($H$) ends toward anions. This **solvation** energy partly compensates for the lattice energy lost when the solid dissolves. Solubility varies — NaCl is highly soluble; AgCl is essentially insoluble; AP Chem teaches a set of solubility rules.

**Lattice energy.** The energy required to break apart one mole of an ionic compound into gaseous ions. Magnitude depends on:

- **Charges of the ions.** Larger charges $\\to$ much stronger attraction (Coulomb's law). $MgO$ ($+2$/$-2$) has lattice energy about 4× that of NaCl ($+1$/$-1$).
- **Ion sizes.** Smaller ions can pack closer → stronger attraction → larger lattice energy. $LiF$ has larger lattice energy than $LiI$ because $F^-$ is smaller than $I^-$.

Lattice energy explains many properties. It's why $MgO$ has a much higher melting point than $NaCl$; why some salts are extremely soluble in water (water can outcompete weaker lattice energies) while others are essentially insoluble (very strong lattice energies that water can't overcome).

**Cation-anion combinations in real life.**

- **Table salt** ($NaCl$): the most ubiquitous ionic compound. Used in seasoning, food preservation, road de-icing, chemistry.
- **Bone and tooth mineral** ($Ca_5(PO_4)_3OH$, hydroxyapatite): a complex ionic compound that gives bones rigidity and teeth their hardness.
- **Baking soda** ($NaHCO_3$): the bicarbonate ion reacts with acids to release $CO_2$ (the bubbles that leaven biscuits and neutralize stomach acid).
- **Table sugar (sucrose, $C_{12}H_{22}O_{11}$)** is *not* an ionic compound — it's a covalent molecular solid. Distinguishing them is one of the first chemistry skills: ionic compounds conduct when dissolved (charges move); molecular sugars do not.`,
      video: {
        url: 'https://www.youtube.com/watch?v=zpZGbgZS-Y0',
        title: 'CrashCourse Chemistry — Ionic compounds',
        provider: 'CrashCourse',
      },
    },
  ],
  keyConcepts: [
    'Mole = $6.022 \\times 10^{23}$ entities (Avogadro\'s number). Bridges atomic and macroscopic scales.',
    'Molar mass (g/mol) is numerically equal to atomic mass in amu. For compounds, sum atomic masses by formula.',
    'Stoichiometry: g A → mol A → (mole ratio) → mol B → g B. Find limiting reactant by comparing moles produced; calculate percent yield as actual/theoretical $\\times$ 100%.',
    'Mass spectrometry separates particles by $m/z$. Peak heights reveal isotope abundances; weighted average gives atomic mass.',
    'Percent composition = (mass of element / molar mass) $\\times$ 100%. Empirical formula = simplest ratio; molecular formula = actual count.',
    'Aufbau filling: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p... Hund: spread out before pairing. Pauli: 2 e$^-$ per orbital max.',
    'Anomalies: Cr = [Ar] $4s^1 3d^5$; Cu = [Ar] $4s^1 3d^{10}$. Half-full / full d subshells are extra stable.',
    'PES: $E_{photon} = IE + KE$. Peak position = IE; peak height = electron count. Confirms shell structure directly.',
    'Periodic trends: atomic radius ↓ across, ↑ down. IE ↑ across, ↓ down. EN ↑ up-right (F highest). Metallic character ↓ across, ↑ down.',
    'Octet rule: atoms aim for 8 valence electrons (2 for H, He). Achieve by losing, gaining, or sharing electrons.',
    'Main-group ion charges: Group 1 = +1, 2 = +2, 13 = +3, 15 = -3, 16 = -2, 17 = -1. Transition metals have variable charges.',
    'Ionic compounds: high MP/BP (strong electrostatic attraction); brittle (like charges repel when displaced); conduct when molten/dissolved.',
  ],
  formulas: [
    {
      name: 'Mole-mass conversion',
      equation: '$n = m/M$',
      meaning: 'Moles = grams / molar mass. The universal conversion between lab measurements and atomic counts.',
      example: '36 g of water = $36/18.02 = 2.0$ mol; $2.0 \\times 6.022 \\times 10^{23} = 1.2 \\times 10^{24}$ water molecules.',
    },
    {
      name: 'Average atomic mass',
      equation: '$\\bar{m} = \\sum_i (\\text{mass}_i)(\\text{abundance}_i)$',
      meaning: 'Periodic table value is weighted average over natural isotope distribution.',
      example: 'Cl: $(34.97)(0.7577) + (36.97)(0.2423) = 35.45$ amu.',
    },
    {
      name: 'PES energy balance',
      equation: '$E_{photon} = IE + KE_{electron}$',
      meaning: 'Photon energy goes to ionizing the electron (overcoming binding) and giving it kinetic energy. Measuring KE reveals IE.',
      example: 'Neon 2p electrons: IE $\\approx 2.08$ MJ/mol — produces the rightmost peak in the Ne spectrum.',
    },
    {
      name: 'Dilution',
      equation: '$M_1 V_1 = M_2 V_2$',
      meaning: 'Adding solvent reduces concentration; the total moles of solute don\'t change.',
      example: 'Need 250 mL of 0.10 M HCl from 1.0 M stock: $V_1 = (0.10)(250)/1.0 = 25$ mL stock + 225 mL water.',
    },
    {
      name: 'Mass-percent composition',
      equation: '$\\%X = \\dfrac{n_X \\times M_X}{M_{compound}} \\times 100\\%$',
      meaning: 'Fraction of a compound\'s mass that comes from element X.',
      example: 'For glucose ($C_6H_{12}O_6$): %C = $72.06/180.18 = 40.00\\%$.',
    },
  ],
  practice: [
    {
      q: 'A 1.50 g sample of an unknown gas occupies 1.12 L at STP. Find its molar mass and suggest possible identities.',
      a: 'At STP, $1$ mol gas $= 22.4$ L, so $n = 1.12/22.4 = 0.0500$ mol. Molar mass $M = m/n = 1.50/0.0500 = 30.0$ g/mol. Possible identities: NO (mass 30.01), $CH_2O$ formaldehyde (30.03), $C_2H_6$ ethane (30.07). Mass spec or chemistry tests would distinguish.',
    },
    {
      q: 'Write the full electron configuration of sulfur ($Z = 16$) and give the noble-gas shorthand.',
      a: 'Full: $1s^2 2s^2 2p^6 3s^2 3p^4$. Noble-gas shorthand: $[Ne]\\,3s^2 3p^4$. Six valence electrons (two in $3s$, four in $3p$). Two of the $3p$ electrons are paired in one orbital, leaving two unpaired (Hund\'s rule). S is paramagnetic.',
    },
    {
      q: 'Predict the ions that potassium and sulfur form, and write the formula and name of the compound.',
      a: 'K (Group 1) loses 1 electron $\\to K^+$. S (Group 16) gains 2 electrons $\\to S^{2-}$. Balance charges: 2 K$^+$ provide $+2$; 1 S$^{2-}$ provides $-2$. Formula: $K_2S$. Name: potassium sulfide.',
    },
    {
      q: 'A PES spectrum of element X shows peaks at 11.5, 1.09, and 0.42 MJ/mol with heights in the ratio 2:2:1. Identify X.',
      a: 'Three peaks = three filled subshells. Heights $2:2:1$ = total $5$ electrons. Configuration: $1s^2 2s^2 2p^1$, but $2p$ should be 1 electron, not 1 in ratio. Reading more carefully: leftmost is innermost = $1s^2$, next $2s^2$, rightmost $2p^1$. Total $Z = 5$. Element is boron.',
    },
    {
      q: 'A 0.500 g sample of an oxide of nitrogen contains 0.327 g of nitrogen. Determine the empirical formula and possible molecular formulas.',
      a: 'Mass of O = $0.500 - 0.327 = 0.173$ g. Moles: N = $0.327/14.01 = 0.02334$; O = $0.173/16.00 = 0.01081$. Divide by smallest: N/O = $0.02334/0.01081 = 2.16$; multiply by appropriate factor. Closer ratio: N:O = $2:1$. Empirical formula: $N_2O$. Molecular formulas with the same ratio: $N_2O$ (nitrous oxide, "laughing gas," molar mass 44) or $N_4O_2$ (no such stable compound). $N_2O$ is the answer.',
    },
    {
      q: 'Compare the first ionization energies of Mg ($IE_1 = 738$ kJ/mol) and Al ($IE_1 = 577$ kJ/mol). Explain the smaller value for Al despite its higher nuclear charge.',
      a: 'Crossing from group 2 to group 13, you start removing electrons from the next subshell up: Mg removes from $3s$, Al removes from $3p$. The $3p$ subshell is at slightly higher energy than $3s$ (further from the nucleus on average, less penetrating). So removing the first Al $3p$ electron is easier than removing a Mg $3s$ electron, despite Al having one more proton. This is the standard exception in IE trends at group 13.',
    },
  ],
  pitfalls: [
    '"Molar mass and molecular mass are different units" — they\'re numerically equal but with different units (g/mol vs amu). Same value, different scale.',
    '"Empirical formula equals molecular formula" — sometimes (water $H_2O$, ammonia $NH_3$) but often not (glucose $C_6H_{12}O_6$ has empirical $CH_2O$; benzene $C_6H_6$ has empirical $CH$).',
    '"Bigger atom = more electrons = higher IE" — wrong. Bigger atoms have outer electrons farther from nucleus and more shielded, so they\'re *easier* to remove. IE decreases down a group.',
    '"Ionic compounds contain discrete molecules" — wrong. They\'re extended 3D lattices of ions held by electrostatic attraction. The formula $NaCl$ describes the ratio, not a molecule.',
    '"Noble gases never react" — mostly true, but Xe forms $XeF_2$, $XeF_4$, $XeF_6$, $XeO_3$ with very electronegative partners. Kr forms $KrF_2$.',
    '"Electron configurations always follow strict Aufbau order" — wrong. Cr is $[Ar]\\,4s^1\\,3d^5$ (not $4s^2\\,3d^4$) and Cu is $[Ar]\\,4s^1\\,3d^{10}$ (not $4s^2\\,3d^9$). Half-filled and full-filled $d$ subshells are extra stable.',
    '"All electrons in a shell are at the same energy" — wrong. Subshells ($s$, $p$, $d$, $f$) within a shell have different energies. PES peaks at distinct positions for $2s$ vs $2p$ confirm this.',
    '"PES intensity = ionization energy" — wrong. Peak *position* (x-axis) = ionization energy. Peak *height* (y-axis) = number of electrons at that IE.',
  ],
};
