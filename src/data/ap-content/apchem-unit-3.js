// AP Chemistry Unit 3 — Intermolecular Forces and Properties (18-22%)

export const APCHEM_UNIT_3 = {
  number: 3,
  title: 'Intermolecular Forces and Properties',
  weight: '18-22%',
  subunits: [
    {
      code: '3.1',
      title: 'Intermolecular and intramolecular forces',
      content:
`**Intramolecular forces** hold atoms together within a molecule (covalent, ionic bonds). Strong (200-800 kJ/mol).

**Intermolecular forces (IMFs)** hold molecules to each other. Weaker (1-40 kJ/mol) but determine bulk properties.

**Types, weakest to strongest:**

**(1) London dispersion forces** (LDFs / van der Waals). Present in ALL molecules. Caused by temporary electron-cloud fluctuations creating instantaneous dipoles that induce dipoles in neighbors.
- Stronger for larger, more polarizable molecules (more electrons).
- Only IMF in nonpolar molecules.
- Why I₂ is solid (large, polarizable) but Cl₂ is gas (smaller).

**(2) Dipole-dipole forces.** Between polar molecules with permanent dipoles. δ+ end attracts δ- of neighbor.
- HCl, CH₃Cl, acetone.

**(3) Hydrogen bonding.** Special strong dipole-dipole. Requires H bonded to N, O, or F + a lone pair on N, O, or F nearby.
- Water (H₂O), ammonia (NH₃), HF, alcohols, DNA base pairs.
- Stronger than typical dipole-dipole but weaker than covalent.

**(4) Ion-dipole.** Between ion and polar molecule. Drives dissolution of ionic compounds in polar solvents.
- Na⁺ surrounded by water molecules; Cl⁻ surrounded by water with H ends facing in.`,
    },
    {
      code: '3.2',
      title: 'Properties of solids',
      content:
`Solid properties depend on the type of forces holding particles together.

**Molecular solids.** Held by IMFs.
- Low MP (ice, sugar, naphthalene).
- Soft, often volatile.
- Don't conduct electricity.

**Ionic solids.** Held by electrostatic attraction.
- High MP (NaCl 801°C).
- Hard but brittle.
- Conduct when molten/dissolved.

**Network covalent solids.** Atoms connected by continuous covalent bonds throughout the lattice.
- Very high MP (diamond ~3550°C).
- Very hard.
- Don't conduct (except graphite).
- Examples: diamond (C), graphite (C), SiO₂ (quartz), SiC.

**Metallic solids.** Atoms in electron sea.
- Variable MP.
- Malleable, ductile, conductive.
- Examples: Fe, Cu, Au, alloys.

**Predicting properties from formula:**
- Metal + nonmetal → ionic.
- Two nonmetals (small molecule) → molecular.
- Continuous network (diamond, SiO₂) → network covalent.
- Pure metal or alloy → metallic.`,
    },
    {
      code: '3.3',
      title: 'Solids, liquids, gases',
      content:
`**Three phases of matter.** Distinguished by particle arrangement, motion, and energy.

| Property | Solid | Liquid | Gas |
|---|---|---|---|
| Shape | Fixed | Container | Container |
| Volume | Fixed | Fixed | Container |
| Compressibility | Negligible | Slight | Large |
| Particle motion | Vibrate in place | Slide past | Random, free |
| IMF strength | Strongest | Moderate | Negligible |

**Phase changes.**
- Solid → liquid: **melting** (fusion). Heat required (positive ΔH).
- Liquid → gas: **vaporization** (or evaporation at surface). Heat required.
- Solid → gas: **sublimation** (CO₂ "dry ice", I₂, naphthalene).
- Gas → liquid: **condensation**. Heat released.
- Liquid → solid: **freezing**. Heat released.
- Gas → solid: **deposition** (frost forming).

**Heating/cooling curves** show phase changes as plateaus at MP and BP (energy goes into changing phase, not raising T).

**Heats of phase change:**
- Heat of fusion (ΔH_fus): ~6 kJ/mol for water.
- Heat of vaporization (ΔH_vap): ~40.7 kJ/mol for water.
- Both quantities reflect IMF strength.

**Vapor pressure.** Pressure of vapor above a liquid in a closed container at equilibrium. Higher T → higher vapor pressure (more molecules have enough energy to escape). Boiling occurs when vapor pressure = atmospheric pressure.`,
    },
    {
      code: '3.4',
      title: 'Ideal gas law',
      content:
`Gases described by **ideal gas law**: PV = nRT.

- P = pressure (atm)
- V = volume (L)
- n = moles
- R = 0.0821 L·atm/(mol·K)
- T = temperature (K — always use Kelvin!)

**Assumptions of ideal gas:**
- Molecules have no volume.
- No IMFs between molecules.
- Collisions perfectly elastic.

Real gases deviate at high P and low T (when these assumptions fail).

**Subsidiary gas laws:**
- **Boyle's law**: P₁V₁ = P₂V₂ (constant T, n).
- **Charles's law**: V₁/T₁ = V₂/T₂ (constant P, n).
- **Avogadro's law**: V₁/n₁ = V₂/n₂ (constant P, T).
- **Combined**: P₁V₁/T₁ = P₂V₂/T₂.

**STP** (Standard Temperature and Pressure):
- 1 atm = 760 mm Hg = 101.3 kPa.
- 0°C = 273.15 K (AP standards may use 0°C or 25°C; check).
- Molar volume of ideal gas at STP: 22.4 L/mol.

**Dalton's law of partial pressures.** Total P = sum of P of each gas.
P_total = P_A + P_B + P_C + ...

In a mixture, each gas behaves as if alone.

**Mole fraction in gases.** X_A = P_A/P_total = n_A/n_total.

**Worked example.** What volume does 0.5 mol of O₂ occupy at 25°C and 1.5 atm?
T = 25 + 273 = 298 K.
V = nRT/P = (0.5)(0.0821)(298)/(1.5) = 8.16 L.`,
    },
    {
      code: '3.5',
      title: 'Kinetic molecular theory',
      content:
`**Kinetic Molecular Theory (KMT)** explains gas behavior at the molecular level.

**Postulates:**
1. Gases consist of many small particles in constant random motion.
2. Particle volume is negligible compared to container.
3. No intermolecular forces between particles.
4. Collisions are perfectly elastic.
5. Average kinetic energy depends only on temperature.

**Average kinetic energy** of gas molecules:
KE_avg = (3/2) k_B T

where k_B is Boltzmann's constant. Same T → same average KE for all gases. But heavier molecules move slower (KE = ½mv²).

**Root mean square velocity:**
v_rms = √(3RT/M)

where M is molar mass in kg/mol. Lighter gases move faster at the same temperature.

**Maxwell-Boltzmann distribution.** Shows the distribution of molecular speeds in a gas. As T increases, distribution shifts right (faster speeds) and broadens.

**Graham's law of effusion.** Lighter gases effuse faster than heavier gases.
r₁/r₂ = √(M₂/M₁)

**Diffusion** — gases spread to fill space.
**Effusion** — gas escapes through a small hole. Used to enrich U-235 in uranium centrifuges (UF₆ form).

**Real vs ideal gas behavior.**
- Real gases deviate from ideal under high P (volume matters) and low T (IMFs matter).
- Van der Waals equation corrects for both: (P + an²/V²)(V - nb) = nRT.`,
    },
    {
      code: '3.6',
      title: 'Deviations from ideal gas',
      content:
`Real gases deviate from ideal gas behavior at certain conditions.

**When gases behave ideally:**
- Low pressure (molecules far apart; volume small relative to container).
- High temperature (molecules moving fast; IMFs less significant).

**When real gases deviate:**
- **High pressure** (>10 atm): molecular volume matters; PV/RT > 1.
- **Low temperature** (near liquefaction): IMFs matter; PV/RT < 1.

**Compressibility factor** Z = PV/nRT.
- Z = 1 for ideal gas.
- Z > 1 at high P (volume effect dominates).
- Z < 1 at low T (attraction effect dominates).

**Van der Waals equation** corrects for both:
(P + an²/V²)(V - nb) = nRT

- 'a' corrects for IMFs (attraction).
- 'b' corrects for molecular volume.

**Why this matters.**
- Industrial processes at high pressure need real-gas corrections.
- Liquefying gases requires understanding when ideal assumption breaks.
- Cryogenics, refrigeration cycles.`,
    },
    {
      code: '3.7',
      title: 'Solutions and mixtures',
      content:
`A solution is a homogeneous mixture of solute (dissolved) in solvent (dissolving medium).

**Solubility "like dissolves like":**
- Polar solutes dissolve in polar solvents (sugar in water, NaCl in water).
- Nonpolar solutes dissolve in nonpolar solvents (oil in hexane).
- Polar + nonpolar generally don't mix (oil + water).

**Dissolution process:**
1. Solute particles separate (requires energy).
2. Solvent particles make space (requires energy).
3. Solute-solvent interactions form (releases energy).

Net depends on which step dominates.

**Factors affecting solubility:**
- Temperature: usually ↑ for solids in water; ↓ for gases in water.
- Pressure: significant only for gases (Henry's law: solubility ∝ partial pressure).

**Concentration units (recap).** Molarity, molality, mole fraction, % by mass, ppm, ppb.

**Saturated, unsaturated, supersaturated.**
- Saturated: maximum dissolved at given T.
- Unsaturated: less than max.
- Supersaturated: more than max (metastable; will precipitate).

**Solubility rules** for ionic compounds (memorize for AP):
- All Na⁺, K⁺, NH₄⁺ salts are soluble.
- Most NO₃⁻ salts soluble.
- Most Cl⁻, Br⁻, I⁻ soluble (except Ag⁺, Pb²⁺, Hg₂²⁺).
- Most SO₄²⁻ soluble (except Ba²⁺, Pb²⁺, Hg₂²⁺, Sr²⁺, Ca²⁺ slightly).
- Most CO₃²⁻, PO₄³⁻, S²⁻, OH⁻ INSOLUBLE (except with group 1, NH₄⁺).`,
    },
    {
      code: '3.8',
      title: 'Solution composition and chromatography',
      content:
`**Calculating solution composition.**

**Dilution:** M₁V₁ = M₂V₂. Moles stay constant; you add solvent.

**Mass percent:** (mass solute / mass solution) × 100%.

**ppm/ppb:** for very dilute. mg solute per L solution = ppm (for water-like density).

**Worked example.** Prepare 250 mL of 0.5 M NaCl from solid:
mol needed = 0.5 × 0.25 = 0.125 mol.
mass = 0.125 × 58.44 = 7.31 g.
Dissolve in water; dilute to 250 mL total.

**Worked example: dilution.** Make 100 mL of 0.05 M HCl from 6 M stock:
6 × V₁ = 0.05 × 100; V₁ = 0.833 mL stock + 99.17 mL water.

**Chromatography** separates mixtures by differential affinity for stationary vs mobile phase.

**Paper chromatography.** Solvent rises by capillary action; components carried at different rates based on attraction to paper (stationary) vs solvent (mobile).
- R_f = (distance traveled by component) / (distance traveled by solvent front).
- Same compound under same conditions → same R_f.

**Other types:**
- TLC (thin layer chromatography) — silica plate.
- Column chromatography — column packed with silica.
- HPLC (high-performance liquid chromatography) — high-pressure, very precise.
- GC (gas chromatography) — for volatile compounds.

**Applications.** Drug testing, environmental analysis, forensics, biochemistry (protein/DNA separation).`,
    },
    {
      code: '3.9',
      title: 'Photoelectric effect',
      content:
`**Photoelectric effect.** Light shining on a metal can eject electrons — but only if the frequency exceeds a threshold. Below threshold, no electrons emitted regardless of intensity.

**Einstein's explanation (1905, Nobel 1921).** Light comes in discrete particles (photons), each with energy E = hν (h = Planck's constant, ν = frequency).
- Photon energy must exceed work function (Φ) of metal to eject an electron.
- E_photon = Φ + KE_electron.
- KE of ejected electron depends on frequency, not intensity.
- Intensity affects number of electrons, not their energy.

**Implications.**
- Light is quantized (particle-like).
- Wave-particle duality — light behaves as both wave and particle.

**Energy of a photon:**
E = hν = hc/λ

- h = 6.626 × 10⁻³⁴ J·s
- c = 3 × 10⁸ m/s
- ν in Hz, λ in m

**Worked example.** A photon of green light has λ = 530 nm. Energy?
E = (6.626 × 10⁻³⁴)(3 × 10⁸) / (530 × 10⁻⁹) = 3.75 × 10⁻¹⁹ J per photon.

**Connection to atomic spectra.** Each element has a unique line spectrum. Electrons transitioning between energy levels emit/absorb photons with specific energies → specific wavelengths. Hydrogen's spectrum led to the Bohr model.

**Modern applications.**
- Solar panels (PV cells) use the photoelectric effect.
- Photodetectors, CCDs in cameras.
- Photomultiplier tubes for low-light sensing.`,
    },
    {
      code: '3.10',
      title: 'Beer-Lambert law',
      content:
`**Spectrophotometry** measures how much light a solution absorbs at specific wavelengths.

**Beer-Lambert law:**
A = ε × l × c

- A = absorbance (no units)
- ε = molar absorptivity (M⁻¹ cm⁻¹), constant for each compound at each wavelength
- l = path length (cm), usually 1 cm
- c = concentration (M)

**A vs %T:** Absorbance is linear in concentration; transmittance (%T) is exponential.
A = -log(T) = log(I₀/I)

where I is transmitted intensity, I₀ is incident intensity.

**Calibration curve.** Plot A vs c for known concentrations → straight line. Use unknown sample's A to read off c.

**Why this works.** Each compound absorbs specific wavelengths corresponding to electronic transitions (or vibrational, depending on technique). The absorption pattern is a fingerprint.

**Common techniques:**
- **UV-Vis** — electronic transitions; colored compounds, π systems.
- **IR** — bond vibrations; identifies functional groups.
- **NMR** — magnetic environment of nuclei; structure determination.
- **AAS** — atomic absorption; quantifies metals.

**Worked example.** A blue dye solution shows A = 0.65 at 600 nm with path length 1 cm. If ε = 13,000 M⁻¹cm⁻¹, what is concentration?
c = A / (εl) = 0.65 / (13,000 × 1) = 5.0 × 10⁻⁵ M.

**Applications.**
- Clinical labs: measure glucose, cholesterol, hemoglobin.
- Environmental: trace pollutants.
- Food/drink: quantify dyes, vitamins.
- Pharmaceuticals: purity testing.`,
    },
  ],
  keyConcepts: [
    'IMFs (weakest to strongest): LDF, dipole-dipole, H-bonding, ion-dipole.',
    'H-bonding requires H + N/O/F. Why water has high BP relative to similar molecules.',
    'Solid types: molecular, ionic, network covalent, metallic.',
    'PV = nRT for ideal gas. Always use Kelvin.',
    'KMT explains gas behavior molecularly. KE_avg ∝ T.',
    'Maxwell-Boltzmann: distribution of molecular speeds; broadens with T.',
    'Real gases deviate from ideal at high P (volume matters) and low T (IMFs matter).',
    '"Like dissolves like" — polar in polar, nonpolar in nonpolar.',
    'Beer-Lambert: A = εlc. Linear relationship for quantification.',
  ],
  formulas: [
    {
      name: 'Ideal gas law',
      equation: 'PV = nRT',
      meaning: 'Relates P, V, n, T for an ideal gas. R = 0.0821 L·atm/(mol·K).',
      example: '1 mol of gas at 25°C and 1 atm: V = nRT/P = (1)(0.0821)(298)/1 = 24.5 L.',
    },
    {
      name: 'Graham\'s law of effusion',
      equation: 'r₁/r₂ = √(M₂/M₁)',
      meaning: 'Lighter gases effuse faster (inversely with √molar mass).',
      example: 'H₂ (M=2) effuses 4× faster than O₂ (M=32). √(32/2) = 4.',
    },
    {
      name: 'Beer-Lambert',
      equation: 'A = ε l c',
      meaning: 'Absorbance linear in concentration. Used for quantification.',
      example: 'A = 0.65, ε = 13,000 M⁻¹cm⁻¹, l = 1 cm → c = 5 × 10⁻⁵ M.',
    },
  ],
  practice: [
    {
      q: 'Compare BPs of CH₄, NH₃, H₂O, and HF. What IMFs explain the order?',
      a: 'CH₄ (-161°C): only LDFs, lowest BP. NH₃ (-33°C): H-bonding (weak — N less electronegative). HF (20°C): H-bonding. H₂O (100°C): H-bonding most extensive (O has 2 lone pairs, 2 H atoms — forms 2 H-bonds per molecule). H-bonding explains why water boils so much higher than similar-sized molecules.',
    },
    {
      q: 'A gas occupies 2.0 L at 25°C and 1.5 atm. What\'s its volume at STP?',
      a: 'Combined gas law: P₁V₁/T₁ = P₂V₂/T₂. (1.5)(2.0)/298 = (1.0)(V₂)/273. V₂ = (1.5)(2.0)(273)/(298)(1.0) = 2.75 L.',
    },
    {
      q: 'Why does water have a much higher BP (100°C) than H₂S (-60°C) despite S being below O?',
      a: 'Water has strong H-bonding (O is small + 2 lone pairs). H₂S has weak H-bonding (S is much less electronegative; H-S barely polar). Water\'s IMFs are far stronger → much higher BP.',
    },
  ],
  pitfalls: [
    '"All polar molecules have H-bonds" — no. Only those with H bonded to N, O, or F.',
    '"Higher KE = faster molecules" — yes, but at same T, lighter molecules move faster (same KE, less mass).',
    '"Boyle\'s law applies to all gases" — only for ideal gas conditions (low P, high T).',
    '"Absorbance and transmittance are interchangeable" — they\'re reciprocal log relationships. A = -log(T).',
    '"Solubility rules are universal" — they\'re approximations; many exceptions.',
  ],
};
