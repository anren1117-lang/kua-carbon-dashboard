// AP Chemistry Unit 2 — Molecular and Ionic Compound Structure and Properties (7-9%)

export const APCHEM_UNIT_2 = {
  number: 2,
  title: 'Molecular and Ionic Compound Structure and Properties',
  weight: '7-9%',
  subunits: [
    {
      code: '2.1',
      title: 'Types of chemical bonds',
      content:
`Three bond types based on electronegativity (EN) difference:

**Ionic bonds.** ΔEN > ~1.7. Electrons transferred from low-EN metal to high-EN nonmetal. Forms cation + anion held by electrostatic attraction.
- NaCl: Na (EN 0.93) + Cl (EN 3.16) → Na⁺ + Cl⁻.
- MgO, CaF₂, K₂S, etc.

**Polar covalent bonds.** ΔEN ~0.4-1.7. Electrons shared unequally; more electronegative atom gets partial negative charge.
- H₂O: O-H bonds polar (ΔEN ~1.4). Oxygen δ-, hydrogens δ+.
- NH₃, HCl, CO.

**Nonpolar covalent bonds.** ΔEN < ~0.4. Electrons shared roughly equally.
- H₂, O₂, N₂, Cl₂ (diatomic elements — ΔEN = 0).
- CH₄ (C-H bonds nearly nonpolar).

**Metallic bonds.** Between metal atoms. Valence electrons form a "sea" of delocalized electrons surrounding positive metal cores.
- Explains conductivity, malleability, ductility, luster of metals.
- Strength varies: alkali metals soft (low MP); transition metals like W harder, higher MP.

**Why bond type matters.** Determines properties:
- Ionic: high MP, conduct when molten/dissolved, brittle.
- Covalent (molecular): low MP, don't conduct, often volatile.
- Network covalent (diamond, SiO₂): very high MP, don't conduct, very hard.
- Metallic: variable MP, conduct in solid, malleable.`,
    },
    {
      code: '2.2',
      title: 'Intramolecular force and potential energy',
      content:
`Bond strength relates to potential energy. The PE curve for a diatomic molecule:

**Potential energy vs internuclear distance.**
- At very short distances: strong repulsion (nuclei + e⁻ shells repel) — PE rises sharply.
- At very long distances: no interaction — PE ≈ 0.
- At optimal distance: **bond length** — PE minimum.
- The depth of the well = **bond dissociation energy** (BDE) — energy needed to break the bond.

**Bond order = number of shared electron pairs.**
- Single bond: 1 pair shared (H-H, C-C).
- Double bond: 2 pairs (O=O, C=O).
- Triple bond: 3 pairs (N≡N, C≡C).

**Trends:**
- Higher bond order → shorter bond length.
- Higher bond order → higher BDE.
- Example: C-C (347 kJ/mol, 154 pm); C=C (614, 134); C≡C (839, 120).

**Bond polarity.** Difference in EN creates partial charges. Measure with **dipole moment** μ (in Debye). H-Cl has μ ~ 1.08 D; H-F has 1.91 D.

**Coulomb's law and bond energy.** For ionic bonds, attraction is described by:
F = k × (q₁q₂) / r²

Higher charges → stronger attraction → higher MP. Smaller ions → stronger attraction. Compare NaCl (m.p. 801°C) vs MgO (m.p. 2852°C): both +/- charges higher in MgO, and ions slightly smaller.

**Lattice energy** is the energy released when gaseous ions form an ionic solid. Higher lattice energy = stronger ionic bonding = higher MP. Predicted by Born-Haber cycle.`,
    },
    {
      code: '2.3',
      title: 'Structure of ionic solids',
      content:
`Ionic compounds form repeating 3D crystal lattices, not discrete molecules.

**Crystal structures.**
- **NaCl (rock salt)**: cubic arrangement where each Na⁺ surrounded by 6 Cl⁻ and vice versa.
- **CsCl**: each Cs⁺ surrounded by 8 Cl⁻ (different coordination because Cs⁺ is bigger).
- **Fluorite (CaF₂)**: F⁻ in tetrahedral holes between Ca²⁺.
- **Zinc blende (ZnS)**: similar to diamond structure but with two atom types.

**Coordination number** = number of nearest neighbors of opposite charge. Bigger ion ratios allow higher coordination.

**Properties from structure:**
- High melting/boiling points — many strong electrostatic interactions to break.
- Hard but brittle — layers slide → like charges align → strong repulsion → crack.
- Don't conduct as solids (ions locked in place) but do when molten or dissolved (ions free).
- Soluble in polar solvents (water surrounds ions); insoluble in nonpolar (no polar interactions).

**Ionic radii.** Cations smaller than parent (electrons removed; sometimes whole shell). Anions larger (more e-e repulsion). Within a group, ionic radius increases down. Compare Na (186 pm) → Na⁺ (102 pm); F (71 pm) → F⁻ (133 pm).

**Lattice energy** can be calculated by:
U ∝ (q₁ × q₂) / r

Higher charges → higher U → more stable lattice → higher MP.

Example: NaF (q×q = 1, MP 993°C); MgO (q×q = 4, MP 2852°C). MgO\'s much higher lattice energy explains its much higher MP.`,
    },
    {
      code: '2.4',
      title: 'Structure of metals and alloys',
      content:
`Metals form crystals too, but with delocalized "electron sea" rather than fixed electron positions.

**Metallic bonding model.** Metal atoms contribute valence electrons to a sea of delocalized electrons; positive metal cores embedded in this sea. Electrons are not stuck on any one atom — they move freely throughout the lattice.

**This explains:**
- **Electrical conductivity** — mobile electrons carry charge.
- **Thermal conductivity** — electrons transfer kinetic energy.
- **Malleability and ductility** — when struck, metal layers slide without breaking the bond (electron sea reorganizes).
- **Luster** — electrons absorb and re-emit light across the visible spectrum.

**Crystal packing.**
- **Body-centered cubic (BCC)** — atoms at cube corners + center. Fe, Cr, Na.
- **Face-centered cubic (FCC)** — atoms at corners + face centers. Au, Cu, Al, Pb.
- **Hexagonal close-packed (HCP)** — Zn, Mg, Ti.

**Alloys.** Mixtures of metals with new properties.

**Substitutional alloys.** Similar-sized atoms replace one another. Brass (Cu + Zn), bronze (Cu + Sn), stainless steel (Fe + Cr + Ni).

**Interstitial alloys.** Small atoms fit between bigger ones. Carbon steel (Fe + small C atoms in interstices) — much harder than pure Fe.

**Why alloys matter.** Pure metals usually too soft for engineering. Adding small amounts of other elements distorts the lattice locally, blocking layer-slipping → harder. Steel, brass, bronze, duralumin (aluminum + copper) all owe their utility to alloying.

**Modern alloys.** Titanium alloys for aerospace (light + strong). Nickel superalloys for jet engines (high-temp strength). Lithium-ion batteries use alloys for electrodes.`,
    },
    {
      code: '2.5',
      title: 'Lewis diagrams',
      content:
`**Lewis dot structures** show valence electrons as dots and bonds as lines. Predict molecular structure and bond polarity.

**Steps to draw:**
1. **Count valence electrons.** Sum for all atoms. For ions, add (anion) or subtract (cation) charges.
2. **Connect with single bonds.** Pick central atom (usually least electronegative; not H or F). H always terminal.
3. **Complete octets on outer atoms** with lone pairs (8 total, including bond pairs).
4. **Place remaining electrons on central atom.**
5. **If central atom doesn\'t have octet**, form double or triple bonds by moving lone pairs from outer atoms.

**Examples.**

**H₂O** (8 e⁻ total: 2(1) + 6 = 8):
- O central; H-O-H.
- O has 2 lone pairs.
- All octets satisfied.

**CO₂** (16 e⁻: 4 + 12 = 16):
- C central; O-C-O single bonds use 4 e⁻; place lone pairs (6 each O = 12 more, total 16) but C has only 4. Move lone pairs to make double bonds.
- Final: O=C=O.

**NH₃** (8 e⁻):
- N central; 3 N-H bonds.
- N has 1 lone pair.

**SO₄²⁻** (32 e⁻: 6 + 24 + 2 = 32):
- S central; 4 S-O bonds (uses 8 e⁻).
- O outer atoms each get 3 lone pairs (24 more).
- Possible double bonds give better formal charges.

**Formal charge** = (valence e⁻) - (lone pair e⁻) - ½(bond e⁻).
- Sum of formal charges = overall charge.
- Best Lewis structure minimizes formal charges and places negative formal charge on more electronegative atom.

**Exceptions to octet rule:**
- **Expanded octet** (period 3+): elements with d orbitals can hold >8 e⁻ (PCl₅, SF₆, XeF₄).
- **Incomplete octet**: BF₃ has only 6 around B (Lewis acid).
- **Odd-electron**: NO has 11 valence e⁻ (radical).`,
    },
    {
      code: '2.6',
      title: 'Resonance and formal charge',
      content:
`Some molecules can\'t be described by a single Lewis structure — they exist as **resonance hybrids** of multiple equivalent forms.

**Definition.** When more than one valid Lewis structure can be drawn, the actual molecule is an average (or weighted superposition) of all of them. Each form is a **resonance structure**.

**Examples.**

**Ozone (O₃).** Two resonance structures with the double bond on different sides:
O=O-O ↔ O-O=O

Real O₃ has both bonds identical, intermediate between single and double (bond order 1.5).

**Carbonate ion (CO₃²⁻).** Three equivalent resonance structures with the double bond rotating through each oxygen position. Actual structure: all three C-O bonds equal, bond order 4/3.

**Benzene (C₆H₆).** Two Kekulé structures with alternating single/double bonds. Real benzene: all six C-C bonds equal (1.40 Å, between single 1.54 and double 1.34). Often drawn as a hexagon with a circle inside.

**Nitrate (NO₃⁻).** Like carbonate, three equivalent forms.

**Sulfate (SO₄²⁻).** Multiple resonance forms with double bonds in different positions.

**Why resonance matters.**
- **Bond lengths/strengths intermediate** between single/double.
- **Delocalized π electrons** more stable than localized.
- **Aromatic stability** of benzene comes from resonance.
- Drug design and reactivity often hinges on resonance.

**Formal charge.** Helps pick the best resonance structure.

FC = (valence e⁻) - (lone pair e⁻) - ½(bonding e⁻)

**Rules for choosing best structure:**
1. All formal charges should be as close to zero as possible.
2. Negative formal charges on more electronegative atoms.
3. Don\'t put like-signed charges adjacent.

**Worked example:** NCO⁻ (cyanate).
- (a) N≡C-O⁻ (FCs: N 0, C 0, O -1) ✓ best
- (b) N=C=O (FCs: N -1, C 0, O 0) ✓ also good
- (c) N⁻-C≡O⁺ (FCs: N -2, C 0, O +1) ✗ extreme charges

Real cyanate is mostly form (a) and (b).`,
    },
    {
      code: '2.7',
      title: 'VSEPR and bond hybridization',
      content:
`**VSEPR** (Valence Shell Electron Pair Repulsion) predicts molecular shape from electron pair geometry. Pairs (bonding or lone) repel and arrange to maximize distance.

**Steps:**
1. Draw Lewis structure.
2. Count electron domains around central atom (each bond = 1 domain, regardless of single/double/triple; each lone pair = 1 domain).
3. Determine electron geometry.
4. Apply lone pair → molecular geometry can differ.

**Electron geometries (and resulting molecular shapes):**

| Domains | Geometry | Bond angle | Examples |
|---|---|---|---|
| 2 | Linear | 180° | BeCl₂, CO₂ |
| 3 | Trigonal planar | 120° | BF₃, CO₃²⁻ |
| 4 | Tetrahedral | 109.5° | CH₄, NH₃, H₂O |
| 5 | Trigonal bipyramidal | 90°, 120° | PCl₅ |
| 6 | Octahedral | 90° | SF₆ |

**Lone pairs adjust geometry:**
- 4 domains, all bonds (CH₄): tetrahedral.
- 4 domains, 3 bonds + 1 LP (NH₃): trigonal pyramidal, slightly compressed (107°).
- 4 domains, 2 bonds + 2 LP (H₂O): bent (104.5°). Lone pairs take more space.

**Hybridization.** Atomic orbitals mix to form hybrid orbitals matching the molecular geometry.
- **sp** (linear, 2 domains): mix s + 1 p → 2 sp hybrids.
- **sp²** (trigonal planar, 3 domains): mix s + 2 p → 3 sp² hybrids.
- **sp³** (tetrahedral, 4 domains): mix s + 3 p → 4 sp³ hybrids.
- **sp³d** (5 domains): + 1 d orbital (period 3+).
- **sp³d²** (6 domains): + 2 d orbitals.

**Sigma and pi bonds.**
- Single bond = 1 σ (head-on overlap).
- Double bond = 1 σ + 1 π (side-by-side overlap of unhybridized p orbitals).
- Triple bond = 1 σ + 2 π.

**Why this matters.** Molecular shape determines polarity (and so solubility, melting/boiling points). H₂O is bent → polar; CO₂ is linear → nonpolar despite polar bonds (dipoles cancel). NH₃ is pyramidal → polar; CCl₄ is tetrahedral → nonpolar. Drug binding to receptors depends critically on molecular shape.`,
    },
  ],
  keyConcepts: [
    'Bond types: ionic (ΔEN > 1.7), polar covalent (0.4-1.7), nonpolar covalent (<0.4), metallic.',
    'Bond order ↑ → bond length ↓, bond energy ↑.',
    'Coulomb\'s law explains lattice energy and MP of ionic compounds.',
    'Metallic bonds: delocalized electron sea explains conductivity, malleability, luster.',
    'Lewis structures: 4 steps (count e⁻, connect, complete octets, place extras, multi bonds if needed).',
    'Resonance: multiple equivalent structures → real molecule is a hybrid.',
    'Formal charge helps choose best Lewis structure.',
    'VSEPR predicts geometry from electron domains; lone pairs adjust.',
    'Hybridization: sp (linear), sp² (trigonal), sp³ (tetrahedral), sp³d, sp³d².',
    'σ bond = head-on; π bond = side-by-side (in double/triple bonds).',
  ],
  formulas: [
    {
      name: 'Coulomb\'s law',
      equation: 'F = k × q₁q₂ / r²',
      meaning: 'Force between charges scales with charge product, inversely with distance squared.',
      example: 'MgO has q×q = 4× NaCl, and slightly smaller r → much higher lattice energy and MP.',
    },
    {
      name: 'Formal charge',
      equation: 'FC = V - LP - ½B',
      meaning: 'V = valence e⁻, LP = lone pair e⁻, B = bonding e⁻.',
      example: 'In CN⁻ Lewis structure :C≡N:⁻, C: FC = 4 - 2 - 3 = -1; N: 5 - 2 - 3 = 0.',
    },
  ],
  practice: [
    {
      q: 'Predict the shape and polarity of CCl₄.',
      a: 'Tetrahedral (4 bond pairs, no LP). All C-Cl bonds polar but dipoles cancel by symmetry. Molecule is nonpolar.',
    },
    {
      q: 'Why does MgO have a much higher melting point (2852°C) than NaF (993°C)?',
      a: 'Coulomb\'s law: F ∝ q₁q₂/r². MgO has (+2)(-2) = 4; NaF has (+1)(-1) = 1. Plus Mg²⁺ and O²⁻ are smaller than Na⁺ and F⁻. Both effects increase lattice energy ~4-5× → much higher MP.',
    },
    {
      q: 'Draw the Lewis structure for NO₃⁻ and identify the bond order.',
      a: '24 valence e⁻ total. N central, three O atoms with one N=O and two N-O (or resonance averaging). All three N-O bonds have the same length (intermediate). Bond order = 4/3 ≈ 1.33.',
    },
  ],
  pitfalls: [
    '"Resonance means the molecule flips between forms" — no. The real molecule is a hybrid, not flipping.',
    '"Lone pairs aren\'t counted in VSEPR" — they are; they affect geometry.',
    '"Polar bonds always mean polar molecule" — wrong. Symmetric molecules with polar bonds (CO₂, CCl₄) are nonpolar.',
    '"Formal charge = real charge" — no. Formal charge is bookkeeping; real charge depends on EN.',
    '"Expanded octets violate the octet rule" — they\'re allowed for period 3+ atoms with available d orbitals.',
  ],
};
