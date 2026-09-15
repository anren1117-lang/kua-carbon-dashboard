// AP Biology Unit 1 — Chemistry of Life (8-11% of exam)
// APES-standard depth: every subunit is full teaching material a student can
// learn the topic from cold.

export const APBIO_UNIT_1 = {
  number: 1,
  title: 'Chemistry of Life',
  weight: '8-11%',
  subunits: [
    {
      code: '1.1',
      title: 'Structure of water and hydrogen bonding',
      content:
`Water is the chemical environment of life. Cells are ~70% water; blood, sap, and ocean are nearly all water. The emergent properties of water — properties that don't exist for a single $H_2O$ molecule but arise from many interacting — explain why water can support biology while almost no other small molecule could. All of this traces back to one fact: water is **polar**, and polar molecules form **hydrogen bonds**.

**The molecular geometry.** Water ($H_2O$) has a bent shape, not linear. Oxygen sits at the apex, the two hydrogens at $\\sim 104.5\\degree$ from each other. Oxygen has two lone pairs of electrons in addition to the two O-H bonds — these lone pairs push the H atoms together, producing the bend. If you remember nothing else about water's structure, remember: bent, not straight, and that bend is what makes water polar.

**Polarity.** Each O-H bond is a covalent bond, but it isn't a "fair" sharing of electrons. Oxygen has an **electronegativity** of 3.44 on the Pauling scale; hydrogen has 2.20. Electronegativity is a measure of how strongly a nucleus pulls bonding electrons toward itself. The bigger the difference, the more uneven the sharing. The O-H electron cloud sits closer to oxygen, giving the O end a **partial negative charge** ($\\delta^-$) and each H end a **partial positive charge** ($\\delta^+$). Because the molecule is bent, those charges don't cancel; the molecule has a net dipole.

**Hydrogen bonds.** The $\\delta^+$ hydrogen of one water molecule is attracted to the $\\delta^-$ oxygen (specifically, one of the lone pairs) on a neighboring molecule. This electrostatic attraction is the **hydrogen bond**. It's roughly 5-10% the strength of a covalent bond — too weak to be a "real" bond in the structural sense, but in liquid water each molecule is forming and breaking ~$10^{12}$ hydrogen bonds per second with its neighbors. The net effect: water behaves as a loosely linked network, not as independent molecules.

**Emergent properties that fall out of hydrogen bonding:**

- **Cohesion.** Water molecules stick to each other. This is why water forms beads, why it has the highest **surface tension** of any common liquid (allowing water striders to walk on it), and most importantly for biology, why water can be pulled up a 100-meter redwood without breaking. Transpiration in the leaf creates negative pressure; that pressure is transmitted as a tension through the entire water column in the xylem because the molecules hold onto each other.
- **Adhesion.** Water sticks to polar surfaces too. Adhesion plus cohesion produces **capillary action** — the way water creeps up a paper towel or a narrow glass tube.
- **High specific heat capacity** (4.18 J/g/°C — among the highest of any common liquid). Heat added to water first has to break hydrogen bonds before it can speed up molecular motion (i.e., raise temperature). This is why oceans moderate coastal climates: enormous heat in and out without large temperature swings. It's also why your body temperature is stable despite metabolic heat production.
- **High heat of vaporization** (2,260 J/g). Breaking *all* the hydrogen bonds to convert liquid water to vapor takes enormous energy per gram. Sweating cools you because each gram of evaporated water carries away that much heat.
- **Less dense as a solid.** When water freezes, every molecule locks into 4 hydrogen bonds in a rigid hexagonal lattice with much empty space between molecules. Ice is ~9% less dense than liquid water. Ice floats; lakes freeze top-down; fish and microorganisms survive winter in the unfrozen water below. Almost every other substance is *denser* as a solid; water is the rare exception, and life as we know it depends on it.
- **Universal solvent.** Water dissolves polar and ionic substances by surrounding them with shells of oriented water molecules — $\\delta^+$ H atoms point at anions; $\\delta^-$ oxygens point at cations. **Hydrophilic** substances (literally "water-loving") dissolve; **hydrophobic** ones (the long hydrocarbon tails of lipids, for example) are excluded and cluster together. This exclusion is what spontaneously assembles cell membranes.

**Water's pH and dissociation.** Water self-ionizes: $H_2O$ $\\rightleftharpoons$ $H^+$ + $OH^-$. Pure water has [$H^+$] = $10^{-7}$ M, so pH = 7 (neutral). Acids release $H^+$ and lower pH; bases either accept $H^+$ or release $OH^-$ and raise pH. Biological systems are tightly buffered (typically pH 7.35-7.45 for human blood) because even small pH changes denature proteins by disrupting the charges that hold them folded. Buffers in blood — primarily the bicarbonate ($HCO_3^-$ / $H_2CO_3$) system — soak up excess $H^+$ or $OH^-$ to keep pH within the tight range life requires.

**Why this matters across all of AP Biology.** Every other topic in this course assumes water's properties. Membrane formation (Unit 2), enzyme function (this unit), photosynthesis and respiration (Unit 3), and even nerve signaling (Unit 4) all depend on water's polarity, on hydrophobic clustering, on hydrogen bonds. When you encounter a "why" question on the AP exam about a biological molecule, default first to: does this involve hydrogen bonds, polarity, or hydrophobic exclusion? Most of the time, yes.`,
      video: {
        url: 'https://www.youtube.com/watch?v=qd9k8c7N72c',
        title: 'Bozeman Science — Water: A Polar Molecule',
        provider: 'Bozeman Science',
      },
    },
    {
      code: '1.2',
      title: 'Elements of life',
      content:
`Life is selective. There are ~118 elements in the periodic table, but only about 25 appear in living organisms in detectable amounts, and just six make up the vast majority. Understanding why these particular elements were chosen by evolution — and what each contributes — is the foundation of biochemistry.

**The big six: CHNOPS.** Carbon, hydrogen, nitrogen, oxygen, phosphorus, and sulfur together account for roughly 99% of biological mass. Memorize this acronym; it appears in some form on most AP Biology exams.

- **C** (carbon, ~18% of human mass) — the backbone of organic chemistry.
- **H** (hydrogen, ~10%) — present in water and every organic molecule.
- **N** (nitrogen, ~3%) — in proteins (amino groups) and nucleic acids (bases).
- **O** (oxygen, ~65% — by far the most abundant, because we're mostly water) — in water, carbohydrates, proteins, nucleic acids, lipids.
- **P** (phosphorus, ~1%) — in nucleic-acid backbones, ATP, phospholipids, bone.
- **S** (sulfur, ~0.25%) — in the amino acids cysteine and methionine; sulfur–sulfur bonds (disulfide bridges) help fold and stabilize proteins.

**Why carbon is central.** Carbon has 4 valence electrons and is electronegativity-balanced enough to share, not gain or lose, electrons. It forms four covalent bonds: with itself, with hydrogen, with nitrogen, with oxygen, with phosphorus, with sulfur, with halogens. It will bond into long chains, branched structures, single rings, fused rings, and three-dimensional cages. No other element matches this versatility. Silicon, the obvious chemical alternative (also four valence electrons, much more abundant on Earth), forms much weaker bonds with itself and oxidizes irreversibly into silica (sand) — fine for rocks, terrible for adaptable biochemistry. Evolution went with carbon.

**Functional groups.** Carbon by itself just gives a hydrophobic skeleton (hydrocarbons like methane, ethane, octane). To make biology, you decorate the carbon backbone with small clusters of atoms — **functional groups** — that confer specific chemical behaviors. These appear over and over across all macromolecules, so learning them once pays dividends:

- **Hydroxyl (-OH).** Polar; makes molecules water-soluble. Defines alcohols. Present on every monosaccharide (sugars are loaded with -OH), on serine and threonine amino acid side chains, on the ribose backbone of RNA.
- **Carbonyl (C=O).** A carbon double-bonded to oxygen. At the end of a carbon chain, you get an **aldehyde** (glucose is an aldose sugar — the carbonyl is at C1). In the middle, you get a **ketone** (fructose is a ketose). Polar, weakly reactive, central to sugar chemistry.
- **Carboxyl (-COOH).** A carbonyl with an attached -OH. Strongly acidic — the H comes off easily, leaving $-COO^-$. Defines **carboxylic acids**, including all fatty acids and the C-terminus of every protein. At physiological pH, carboxyls are negatively charged.
- **Amino (-$$NH$_2$).** Basic — readily accepts an $H^+$ to become -$$NH$_3^+$. Defines amines. Present on the N-terminus of every protein, on the side chain of lysine, on every DNA/RNA base. At physiological pH, free amino groups are positively charged.
- **Phosphate (-OPO₃²⁻).** Highly charged (two negative oxygens at physiological pH), high-energy. Found on every nucleotide, on ATP's three-phosphate tail, on phospholipid heads. Phosphate transfer powers most cellular work.
- **Sulfhydryl (-SH).** On cysteine side chains. Two cysteines can oxidize their -SH groups into a covalent **disulfide bridge** (-S-S-), locking proteins into specific folds. Hair keratin and insulin both depend on disulfides.
- **Methyl (-CH₃).** Just a small nonpolar tag. By itself it doesn't do much, but methyl groups added to DNA or to histone proteins regulate gene expression — **DNA methylation** silences genes, and the pattern of methyls on the genome is an "epigenetic" layer that can be heritable. You'll see this again in Unit 6.

**Trace elements punch above their weight.** Elements present in tiny amounts can be essential — deficiency causes specific diseases.

- **Iron (Fe)** in hemoglobin and myoglobin binds the $O_2$ atom directly. Iron deficiency causes anemia (low oxygen-carrying capacity). Iron also sits in the cytochromes of the electron transport chain (Unit 3).
- **Iodine (I)** is required to make thyroid hormones ($T_3, T_4$) that set metabolic rate. Dietary iodine deficiency historically caused goiter (an enlarged thyroid trying to compensate) and developmental delay; modern iodized salt has nearly eliminated the problem in developed countries.
- **Magnesium (Mg)** sits at the center of every chlorophyll molecule, capturing light energy. Without magnesium, no green plants and no photosynthesis-based food web.
- **Calcium (Ca)** is the bulk mineral of bone and tooth, but is also a critical signaling molecule. Sudden $Ca^{2+}$ release from the sarcoplasmic reticulum is the signal that triggers muscle contraction.
- **Sodium and potassium (Na, K)** maintain the membrane potential of every cell, especially neurons. The $Na^+$/$K^+$ pump uses a quarter of human ATP at rest.

**A note on bonds.** AP Biology cares less about counting electrons than about distinguishing the bond types and their strengths.
- **Covalent bonds** (shared electrons): strongest. **Nonpolar covalent** if the electronegativity difference is small (C-H, C-C); **polar covalent** if larger (O-H, N-H).
- **Ionic bonds** (transferred electrons): one atom takes; another donates. NaCl. In water, ionic bonds dissociate easily into hydrated ions.
- **Hydrogen bonds** (intermolecular electrostatic attraction): weak individually, enormously important collectively (water, DNA base pairing, protein folding).
- **Van der Waals interactions** (transient electron-cloud fluctuations): weakest. Important in lipid bilayer interiors and tight protein-protein contacts.

When the exam asks why two molecules interact, identify the bond type first.`,
      video: {
        url: 'https://www.youtube.com/watch?v=H8WJ2KENlK0',
        title: 'CrashCourse Biology — Carbon... So Simple',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.3',
      title: 'Introduction to biological macromolecules',
      content:
`Four classes of large biological molecules — **carbohydrates, lipids, proteins, and nucleic acids** — do nearly all the work of life. Three of them are true **polymers**: long chains built from repeating smaller units called **monomers**. Lipids are technically not polymers, but they're typically grouped with the four because they're built from a small set of recurring substructures.

**The universal building reaction: dehydration synthesis.** To link two monomers, you remove an -OH from one and an -H from the other and form a new covalent bond between them. The leaving -OH and -H combine into a water molecule — hence "dehydration" (removing water). Also called a **condensation reaction**. The reverse — adding water to split a polymer into monomers — is **hydrolysis** (literally "water-splitting"). When you digest food, every macromolecule you eat is broken apart by hydrolysis. When your cells build proteins, glycogen, or DNA, they use dehydration synthesis.

Memorize this pair: **dehydration synthesis builds, hydrolysis breaks, and water is the currency of both.**

**(1) Carbohydrates.** Empirical formula approximately (C$H_2O$)n — equal parts carbon, two parts hydrogen, one part oxygen. Energy storage and structure.

- **Monosaccharides** (single sugars): glucose, fructose, galactose. All three have formula $C_6H_{12}O_6$ but differ in the arrangement of -OH and -H around each carbon. Glucose is the universal energy currency of metabolism — cellular respiration starts by burning glucose.
- **Disaccharides** (two sugars joined): sucrose (glucose + fructose, table sugar), lactose (glucose + galactose, milk sugar), maltose (glucose + glucose, malt sugar). The bond between monosaccharides is a **glycosidic linkage**, formed by dehydration synthesis.
- **Polysaccharides** (many sugars):
  - **Starch** — plant energy storage. Glucose monomers linked $\\alpha\\text{-}1,4$. Two forms: amylose (unbranched, helical) and amylopectin (branched). Easily digestible.
  - **Glycogen** — animal energy storage, in liver and muscle. Like amylopectin but more highly branched. Branching matters: each branch is an "end" where glucose can be added or removed, so glycogen can be rapidly mobilized when blood glucose drops.
  - **Cellulose** — structural plant cell walls. Glucose linked **$\\beta\\text{-}1,4$**. The β linkage flips every other glucose so the chains lie flat and pack into rigid microfibrils held by hydrogen bonds. Humans lack the enzyme to break $\\beta\\text{-}1,4$ bonds and so cannot digest cellulose — it's "fiber". Cows and termites host bacteria that can.
  - **Chitin** — structural component of arthropod exoskeletons and fungal cell walls. Like cellulose but with a nitrogen-containing group on each monomer.

**(2) Lipids.** Hydrophobic. Not polymers in the strict sense, but built from small repeating parts.

- **Triglycerides (fats and oils)** — glycerol + 3 fatty acids, joined by **ester bonds** (also formed by dehydration synthesis). The most concentrated form of energy storage in animals (2× the calorie density of carbohydrates per gram, partly because lipids store no water). Fats are solid at room temperature (mostly saturated chains); oils are liquid (mostly unsaturated).
- **Phospholipids** — glycerol + 2 fatty acids + a phosphate group with attached small molecule (often choline). One end (phosphate head) is polar and hydrophilic; the other end (fatty acid tails) is nonpolar and hydrophobic. Molecules with both a hydrophilic and a hydrophobic part are **amphipathic**. Drop amphipathic molecules into water and they self-organize into bilayers, with heads outward facing water and tails inward shielded from water. Every membrane in every cell on Earth is built this way.
- **Steroids** — four fused rings (3 six-membered, 1 five-membered). Cholesterol is the most familiar. From cholesterol, cells build the sex hormones (estrogen, testosterone), the stress hormone cortisol, vitamin D, and bile salts. Steroid hormones pass freely through membranes because they're small and hydrophobic.
- **Waxes** — long fatty-acid chains joined to long alcohols. Form water-resistant coatings on plant leaves (cuticle), animal fur, and bee combs.

**(3) Proteins.** The most chemically versatile macromolecule.

- Monomer: **amino acid** — a central carbon with four attachments: an amino group (-$$NH$_2$), a carboxyl group (-COOH), a hydrogen, and a variable **R group** (side chain). There are 20 standard amino acids, each with a different R group. R-group chemistry classifies amino acids as nonpolar, polar uncharged, acidic (negatively charged at pH 7), or basic (positively charged).
- Bond: **peptide bond** (-CO-$NH$-) — between the carboxyl of one amino acid and the amino of the next, formed by dehydration synthesis. A chain of amino acids is a **polypeptide**; one or more folded polypeptides form a **protein**.
- Function: enzymes (catalysts), transport (hemoglobin moves $O_2$; membrane transporters), structure (collagen, keratin, actin), signaling (insulin, growth hormone), defense (antibodies), motion (myosin in muscle), regulation (transcription factors).
- The sequence of amino acids (encoded by DNA) determines how the protein folds, and the folded shape determines what it can do. Detail in Unit 1.5.

**(4) Nucleic acids.** Information storage and transfer.

- Monomer: **nucleotide** — a phosphate, a 5-carbon sugar (deoxyribose in DNA, ribose in RNA), and a nitrogenous base.
- Bond: **phosphodiester** — the phosphate links the 3' carbon of one sugar to the 5' carbon of the next, forming a sugar-phosphate backbone with bases sticking off.
- **DNA** — double-stranded helix. Stores the genetic information of every cell.
- **RNA** — usually single-stranded. Carries the information from DNA to ribosome (mRNA), brings amino acids to the ribosome (tRNA), or is the catalytic core of the ribosome itself (rRNA). Detail in Unit 1.6.

**Why the same chemistry across all life?** Every cell — bacterium, redwood, human — uses these four macromolecule classes built from the same monomers with the same bond types. This is one of the strongest pieces of evidence for **universal common ancestry**: the chemistry was set very early in evolutionary history and has been conserved for ~3.5 billion years.`,
      video: {
        url: 'https://www.youtube.com/watch?v=H8WJ2KENlK0',
        title: 'CrashCourse Biology — Biological molecules overview',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.4',
      title: 'Properties of biological macromolecules',
      content:
`Macromolecules don't all do the same thing. Their properties — solubility, strength, thermal stability, reactivity, ability to self-assemble — all derive from monomer composition, the geometry of the bonds linking them, and the higher-order interactions that build 3D shape. Getting comfortable with how a small chemical detail produces a large biological consequence is the core skill of biochemistry.

**Carbohydrates — same monomer, different polymer, different function.**

Starch and cellulose are both made of nothing but glucose, yet one feeds animals and the other forms tree trunks. The difference is one chemical bond detail.

- In **starch**, glucose monomers are linked **$\\alpha\\text{-}1,4$**: the bond between C1 of one glucose and C4 of the next, with the C1 hydroxyl below the ring plane (α orientation). All the bonds tilt the same way, so the chain coils into a helix.
- In **cellulose**, the linkage is **$\\beta\\text{-}1,4$**: the C1 hydroxyl is above the ring plane. To keep bond angles satisfied, every other glucose has to flip upside-down. The result is a perfectly straight chain. Many straight chains then stack via hydrogen bonds into rigid microfibrils.

The α vs β distinction is one carbon-stereochemistry detail. It's also why every human can eat starch but not cellulose: our digestive enzymes (amylases) cleave $\\alpha\\text{-}1,4$ but not $\\beta\\text{-}1,4$. Cows, termites, and pandas survive on cellulose only because gut microbes do the cleavage for them.

**Branching matters for energy storage.** Glycogen (animal storage) and amylopectin (plant starch) are both branched glucose polymers, but glycogen branches every 8-12 glucose units while amylopectin branches every 24-30. More branches $\\to$ more chain ends $\\to$ more enzymes can release glucose at once when the body needs fuel. Animals chose dense branching because they need rapid mobilization during exercise or stress; plants don't.

**Lipids — saturation and packing.**

A **saturated** fatty acid has no carbon-carbon double bonds; every carbon carries the maximum number of hydrogens ("saturated with H"). The chain is straight, so chains pack tightly and the lipid is solid at room temperature: butter, lard, beef tallow, palm oil, coconut oil.

An **unsaturated** fatty acid has one or more C=C double bonds. **Cis** double bonds (the natural orientation) introduce a permanent $\\sim 30\\degree$ kink in the chain. Kinked chains can't pack tightly; the lipid is liquid at room temperature: olive oil, sunflower oil, fish oils. The more double bonds, the more kinks, and the lower the melting point.

**Trans fats** are unsaturated but with the double bond in trans configuration — flat, not kinked. They pack like saturated fats but lack the metabolic handling that natural saturated fats have. Industrial trans fats (partial hydrogenation of vegetable oils, historically used in margarine and shortening) raise cardiovascular risk severely and have been banned or restricted in most developed countries since the 2010s.

**Phospholipids self-assemble into bilayers.** A phospholipid is **amphipathic**: hydrophilic phosphate head, hydrophobic fatty-acid tails. Drop a tube of phospholipids into water and a few microseconds later, you have **bilayers** with heads facing water on both sides and tails buried in the middle. This isn't directed by any enzyme; it's just thermodynamics — burying hydrophobic chains away from water increases the entropy of the surrounding water and lowers free energy. Every cellular membrane uses this principle. The cell didn't have to "design" its membrane; the chemistry of phospholipids does it for free.

The fluid mosaic model (Singer-Nicolson, 1972) describes membranes as 2-D fluids: lipids drift sideways within their leaflet at micrometers per second; embedded proteins float in the lipid sea. **Cholesterol** wedged among the lipids buffers fluidity — making membranes less fluid at high temperatures (cholesterol restricts lipid motion) and more fluid at low temperatures (cholesterol prevents tight packing). You'll meet membranes again in Unit 2.

**Proteins — primary structure determines everything.**

A protein has four hierarchical levels of structure:

- **Primary (1°)** — the sequence of amino acids, set by mRNA, joined by peptide bonds. This is what the DNA encodes.
- **Secondary (2°)** — local folding driven by hydrogen bonds between backbone atoms (not side chains). Two motifs dominate: the **$\\alpha\\text{-helix}$** (right-handed coil) and the **$\\beta\\text{-pleated}$ sheet** (flat, with extended strands held by H-bonds).
- **Tertiary (3°)** — the overall 3D fold of a single polypeptide. Driven by side-chain interactions: hydrophobic chains cluster in the interior (hydrophobic effect), polar/charged groups face water on the surface, specific hydrogen bonds and ionic interactions stabilize particular folds, and disulfide bridges between cysteines covalently lock the fold in place.
- **Quaternary (4°)** — multiple folded polypeptides associating into a functional complex. Hemoglobin has four subunits (two $\\alpha\\text{-globins}$, two $\\beta\\text{-globin}$s); the ribosome has dozens of proteins plus RNAs.

The sequence — primary structure — encodes every higher level. This is why a single amino-acid substitution can be catastrophic.

**The sickle-cell case.** Hemoglobin's $\\beta\\text{-globin}$ is normally Glu (negatively charged, polar) at position 6. In sickle-cell disease, a point mutation changes Glu to **Val (nonpolar)**. The change converts one polar surface residue into a hydrophobic one. When hemoglobin is in its deoxygenated form, the new hydrophobic patch on one molecule can dock onto a complementary hydrophobic patch on another. Long fibers polymerize inside red blood cells, deforming them from biconcave disks into rigid sickles. Sickled cells block capillaries, causing pain, organ damage, and shortened lifespan. One amino acid out of 146 in $\\beta\\text{-globin}$ — about 0.7% of the sequence — produces a serious disease. Primary structure really does determine everything.

**Denaturation.** Disrupt the conditions that hold a protein folded — high heat, extreme pH, urea, detergents — and the protein unfolds and loses function. Hard-boiled egg whites are denatured albumin (you can't unboil it). Some proteins refold spontaneously when conditions return to normal (ribonuclease did in Anfinsen's 1961 experiment — Nobel 1972); many don't, requiring **chaperones** to refold them.

**Nucleic acids — antiparallel double helix.**

DNA is two polynucleotide strands wound around a common axis. The strands are **antiparallel**: one runs 5'$\\to$3' and the other runs 3'$\\to$5'. They're held together by **base pairing** through hydrogen bonds: **A pairs with T** (2 hydrogen bonds), **G pairs with C** (3 hydrogen bonds). G-C base pairs are slightly stronger because of the extra hydrogen bond; DNA regions rich in G-C melt at higher temperature.

The strands twist into the classic right-handed double helix: 10 base pairs per turn, 3.4 nm per turn, 2.0 nm in diameter. The bases stack on the inside (protected, hydrophobic stacking adds stability); the sugar-phosphate backbone runs along the outside. **Major** and **minor grooves** along the surface expose the edges of base pairs to proteins, which is how transcription factors can "read" sequences without unwinding the helix.

Antiparallel orientation is essential for replication: DNA polymerase only synthesizes 5'$\\to$3', so the two strands have to be templated in opposite physical directions, producing the leading strand (continuous) and lagging strand (Okazaki fragments) you'll meet in Unit 6.`,
      video: {
        url: 'https://www.youtube.com/watch?v=qBRFIMcxZNM',
        title: 'CrashCourse Biology — Biological Molecules',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.5',
      title: 'Structure and function of biological macromolecules',
      content:
`Structure determines function. Restate this — the 3D shape of a biological molecule determines what it can do, and disrupting the shape disrupts the function. This single principle ties together enzymology, oxygen transport, membrane physiology, immune recognition, and DNA-protein interaction. AP Biology comes back to it repeatedly.

**Enzymes.** Almost every chemical reaction in a cell is catalyzed by an **enzyme** — usually a protein, occasionally an RNA (ribozyme). Without enzymes, biological reactions would be too slow to support life: glucose oxidation, for example, has a half-time of decades at body temperature without catalysis but a half-time of microseconds with catalysis. Enzymes routinely speed reactions by factors of $10^6$ to $10^{20}$.

**How they work.** Every enzyme has an **active site** — a pocket or groove in the folded protein, shaped to bind one or a few specific substrates. The active site does three things at once: it positions substrates near each other in the optimal geometry for reaction; it strains the substrate toward the transition-state geometry (lowering activation energy); and it provides specific R-group chemistry — acidic, basic, nucleophilic, electrophilic — to help the reaction along.

**Induced fit (Koshland, 1958).** The active site is not a rigid lock waiting for a key; instead, when substrate binds, the enzyme **flexes slightly** to wrap more tightly around it. This dynamic accommodation is why specificity is so sharp: only the right substrate fits well enough to induce the closing motion that triggers catalysis.

**Reaction rate factors:**
- **Substrate concentration.** Rate rises with [S] until the enzyme is saturated, then plateaus at $V_{\\max}$.
- **Enzyme concentration.** More enzymes, more product per second (assuming substrate is plentiful).
- **Temperature.** Rate doubles roughly per 10°C — until the enzyme denatures (typically around 40-60°C for human enzymes). Beyond that, rate collapses.
- **pH.** Each enzyme has an optimal pH (pepsin in the stomach: pH 2; trypsin in the small intestine: pH 8). pH outside the optimum protonates or deprotonates active-site residues and disrupts shape.
- **Cofactors and coenzymes.** Many enzymes require non-protein partners: metal ions ($Zn^{2+}$, $Mg^{2+}$, $Fe^{2+}$) or organic molecules (often derived from vitamins — NAD⁺ from niacin, FAD from riboflavin, coenzyme A from pantothenic acid).
- **Inhibitors.**
  - **Competitive** inhibitors look like the substrate and block the active site. They can be overcome by adding more substrate. $V_{\\max}$ unchanged; $K_M$ (effective half-saturation) increases.
  - **Noncompetitive (allosteric)** inhibitors bind a different site and distort the active site. More substrate doesn't help. $V_{\\max}$ decreases.
- **Feedback inhibition.** The end product of a pathway binds an allosteric site on the first enzyme of the pathway and turns it off. This is how cells self-regulate: when there's enough product, stop making it.

**Hemoglobin — quaternary protein with cooperative binding.** Hemoglobin has 4 subunits (two $\\alpha\\text{-globins}$, two $\\beta\\text{-globin}$s), each holding a heme group with an iron at the center. Each iron can bind one $O_2$. The four subunits don't act independently — they cooperate. When the first $O_2$ binds, it slightly shifts the conformation of all four subunits, making the next $O_2$ easier to bind, which makes the third easier, and so on. The result is a **sigmoidal binding curve**: low $O_2$ affinity at low partial pressure (lungs in low oxygen don't load hemoglobin), high affinity at moderate pressure (lungs at normal $O_2$ saturate hemoglobin), and steep release at the lower pressures of tissues. Pure myoglobin in muscle has just one binding site, no cooperativity, and a hyperbolic binding curve — perfect for storing $O_2$ locally but not for transport.

**The Bohr effect.** As tissues produce $CO_2$ and lactic acid, local pH drops. Lower pH lowers hemoglobin's affinity for $O_2$, so it releases more $O_2$ exactly where metabolism is highest. Hemoglobin "knows" where $O_2$ is needed by sensing the chemistry that comes with metabolism.

**Membrane proteins.** The phospholipid bilayer is impermeable to most polar substances. So membranes are studded with proteins that span the bilayer and provide specific routes across.

- **Channels** form a hydrophilic pore. Aquaporins move water at billions of molecules per second per channel. Voltage-gated $Na^+$ and $K^+$ channels open in response to membrane voltage changes and are the basis of every nerve action potential.
- **Transporters** bind a substrate on one side, change conformation, and release it on the other. GLUT family transporters move glucose; the $Na^+$/$K^+$ ATPase pumps $Na^+$ out and $K^+$ in using ATP hydrolysis.
- **Receptors** bind a specific signaling molecule on the outside and trigger a conformational change that sends a signal into the cell. Insulin receptors trigger glucose uptake; $\\beta\\text{-adrenergic}$ receptors mediate the fight-or-flight response.
- **Cell-adhesion molecules** (cadherins, integrins) glue cells to each other or to extracellular matrix.

**Antibodies — specificity by structure.** An antibody is a Y-shaped protein with two identical antigen-binding sites at the tips of the Y. The binding sites are tailored, through somatic mutation and selection during B-cell maturation, to recognize one specific molecular shape on a pathogen — a viral surface protein, a bacterial toxin. The body manufactures millions of distinct antibody shapes; each B cell clones the ones that work.

**Structural proteins.** Function = mechanical strength.
- **Collagen** forms triple helices and is the most abundant protein in the human body (~30%). Cartilage, tendons, skin, bone matrix. Defects in collagen processing cause Ehlers-Danlos syndrome (loose joints, fragile skin).
- **Keratin** forms intermediate filaments stabilized by extensive disulfide bridges. Hair, nails, claws, hooves.
- **Actin and myosin** form the contractile machinery of muscle and the cytoskeleton of every cell. Myosin walks along actin, powered by ATP hydrolysis. Muscle contracts; cells divide; vesicles move along cytoskeletal tracks.
- **Silk fibroin** is mostly $\\beta\\text{-sheets}$ — very strong in tension, the reason silk threads support spider webs.

**DNA double helix — optimized for stable, copyable storage.** Base pairs on the inside protect the chemical information. The sugar-phosphate backbone is exposed and hydrophilic — DNA is water-soluble. The major and minor grooves let transcription factors read sequences without unwinding the helix. Replication is **semi-conservative**: the helix unwinds and each parental strand templates a new complementary strand, so each daughter molecule has one old strand and one new (Meselson-Stahl, 1958, used isotope labeling to prove this — a classic experiment that appears on AP exams).

**The takeaway.** Each example above is a structural detail (active-site shape, cooperative binding interface, channel geometry, fibrillar packing, antiparallel pairing) that produces a specific function. When the AP exam asks "explain why X works the way it does," you trace function back to structure. When it asks "predict what happens if structure changes," you do the same thing in reverse.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ok7QSEnAlPw',
        title: 'CrashCourse Biology — Enzymes and structure-function',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.6',
      title: 'Nucleic acids',
      content:
`Nucleic acids — DNA and RNA — are the **information molecules** of life. DNA stores the long-term blueprint; RNA carries the working instructions from gene to protein. Both are polymers of nucleotides, and despite using nearly identical chemistry, they play complementary roles: DNA is stable and double-stranded (good for archives), RNA is reactive and usually single-stranded (good for messages, regulation, and even catalysis).

**Nucleotide structure.** Each nucleotide has three parts:
- a **phosphate group**,
- a **5-carbon sugar** — **deoxyribose** in DNA (lacks a 2'-OH), **ribose** in RNA (has a 2'-OH),
- a **nitrogenous base**, which is either a **purine** (two-ring structure — **adenine A, guanine G**) or a **pyrimidine** (one-ring structure — **cytosine C, thymine T** in DNA, **uracil U** in RNA).

The phosphate of one nucleotide bonds to the 3' carbon of the next nucleotide's sugar to form a **phosphodiester bond**. The sugar-phosphate chain becomes the **backbone**, with the bases sticking out perpendicular to it. By convention we write sequences from 5' to 3' (e.g., 5'-ATGCGTA-3') because polymerases read template and write new strand in that direction.

**Why the small chemical difference between DNA and RNA matters.** The 2'-OH on ribose makes RNA more reactive — it can fold into complex 3D shapes (some catalytic, like ribozymes) but it's also chemically less stable. The thymine base in DNA carries an extra methyl group that uracil lacks — that methyl helps DNA-repair enzymes distinguish "this should be here" from "this got created by accidental deamination of cytosine" (cytosine spontaneously deaminates to uracil; if cells found uracil in DNA, they'd know it was damage and remove it). RNA, being shorter-lived and not archival, doesn't need this protection.

**Base pairing.** Specific hydrogen bonds connect A-T (or A-U in RNA) with 2 hydrogen bonds, and G-C with 3 hydrogen bonds. **Chargaff's rules**: in any double-stranded DNA, %A = %T and %G = %C (because every A on one strand has a T across from it). The G-C pair is slightly stronger and more stable. Regions of DNA rich in G-C have higher melting temperatures.

**The double helix.** Watson and Crick (1953), drawing on Rosalind Franklin's X-ray diffraction images and Chargaff's chemistry, proposed the right-handed double helix. Key features:
- Two strands run **antiparallel** (5'$\\to$3' on one, 3'$\\to$5' on the other).
- 10 base pairs per turn, 3.4 nm rise per turn, 2.0 nm wide.
- Bases stack on the inside (hydrophobic stacking adds stability beyond base pairing).
- Backbones on the outside, hydrophilic, water-soluble.
- **Major** and **minor grooves** expose base-pair edges to potential reader proteins.

**RNA types.**

- **mRNA (messenger RNA)** — the working copy of a gene. Made by transcription in the nucleus; in eukaryotes processed (5' cap, 3' poly-A tail, introns spliced out); shipped to ribosomes; translated into protein. Each mRNA carries one or a few protein-coding sequences.
- **tRNA (transfer RNA)** — small (~80 nt) cloverleaf-folded RNAs. Each carries one amino acid covalently attached at its 3' end and has a three-base **anticodon** loop that pairs with mRNA codons during translation. There are tRNAs for each of the 20 amino acids (multiple tRNAs for some amino acids — see redundancy below).
- **rRNA (ribosomal RNA)** — the structural and catalytic core of the ribosome. Even though the ribosome contains many proteins, the actual peptide-bond-forming chemistry is performed by an rRNA active site — the ribosome is a **ribozyme**. This is a strong piece of evidence for the "RNA world" hypothesis (life used RNA before protein).
- **Small regulatory RNAs (miRNA, siRNA)** — short (~22 nt) RNAs that bind complementary mRNAs and trigger their destruction or block their translation. Discovered in the 1990s; now central to gene regulation, biotechnology, and several therapeutics.

**The central dogma.** Francis Crick (1958) summarized the directional flow of biological information: **DNA $\\to$ RNA $\\to$ protein**.

- **Replication** (DNA $\\to$ DNA): a cell copies its genome before dividing. **DNA polymerase** reads each parental strand 3'$\\to$5' and synthesizes a new complementary strand 5'$\\to$3', using free nucleotides. Because the two parental strands are antiparallel and polymerase only goes one direction, one new strand is made continuously (**leading strand**) and the other in short pieces (**Okazaki fragments**) that **DNA ligase** then joins (**lagging strand**). Replication is **semi-conservative** — each daughter helix has one old strand and one new (Meselson-Stahl, 1958).
- **Transcription** (DNA $\\to$ RNA): RNA polymerase reads one strand of a gene (the **template strand**) and synthesizes a complementary mRNA. In eukaryotes, the primary transcript gets a 5' cap, a 3' poly-A tail, and has its **introns** (non-coding sequences) spliced out — leaving only **exons** to be translated. Different splicing patterns from the same gene can produce different proteins (**alternative splicing**), expanding protein diversity beyond what the gene count suggests.
- **Translation** (mRNA $\\to$ protein): the **ribosome** reads mRNA in three-base groups called **codons**. Each codon (3 of 4 possible bases each = $4^3$ = **64 codons**) specifies one amino acid. tRNAs with matching anticodons bring the corresponding amino acid; the ribosome forms a peptide bond and slides forward one codon.

**The genetic code.** 64 codons total. **61 specify amino acids**; **3 are stop codons** (UAA, UAG, UGA). The start codon **AUG** codes for methionine and signals the ribosome to start. The code is:

- **Universal** — nearly all life uses the same codon-to-amino-acid table. (Some mitochondrial DNAs use slight variants — the AP exam accepts "nearly universal".) This is strong evidence for common ancestry.
- **Redundant (degenerate)** — most amino acids are encoded by multiple codons (leucine has 6, arginine has 6, methionine has only 1). Redundancy means many DNA mutations don't change the protein at all.
- **Read 5'$\\to$3'**, without overlap, without commas.

**Mutations.** Changes in DNA sequence. Types worth knowing:

- **Silent** — a base change that produces a synonymous codon, so the same amino acid is incorporated. No effect on protein.
- **Missense** — a base change that produces a different amino acid. May be tolerated, may cause disease (sickle cell is a missense mutation).
- **Nonsense** — a base change that produces a premature stop codon. The protein is truncated; usually dysfunctional.
- **Frameshift** — an insertion or deletion not a multiple of 3 shifts the reading frame, so every codon downstream is wrong. Almost always destroys protein function. Most cystic fibrosis cases trace to a 3-nucleotide deletion (in-frame, $\\Delta F508$) that just removes one phenylalanine but disrupts protein folding.

**Why this all matters.** Genes don't directly do anything in the cell — they're just stored sequence. The actions of life are performed by the **proteins** the genes encode, and protein production requires the entire flow of information from DNA through RNA to ribosome to folded polypeptide. Every cell, every minute, runs this circuit. Mutations that disrupt any step cascade up into changed proteins, changed cells, and changed phenotypes — which is the substrate that evolution acts on (Unit 7). The cell's elegant solution to information storage, transfer, and translation is one of the most beautiful results in all of biology and one of the most exam-relevant for AP Bio.`,
      video: {
        url: 'https://www.youtube.com/watch?v=8kK2zwjRV0M',
        title: 'CrashCourse Biology — DNA structure and replication',
        provider: 'CrashCourse',
      },
    },
  ],
  keyConcepts: [
    "Water's polarity $\\to$ hydrogen bonding $\\to$ cohesion, adhesion, high specific heat, high heat of vaporization, ice less dense than liquid, universal solvent.",
    "CHNOPS = 99% of biological mass. Carbon's tetravalence enables molecular diversity.",
    "Functional groups (-OH, C=O, -COOH, -$$NH$_2$, phosphate, -SH, -CH₃) confer specific chemical behavior on carbon skeletons.",
    "Four macromolecule classes (carbs, lipids, proteins, nucleic acids) built by dehydration synthesis; broken by hydrolysis.",
    "Same monomer can make different polymers (α-glucose $\\to$ starch [digestible]; β-glucose $\\to$ cellulose [structural, indigestible]).",
    "Lipid bilayers self-assemble because phospholipids are amphipathic — no enzymes needed.",
    "Protein structure has 4 levels. Primary sequence determines all the higher levels and therefore function. A single amino-acid change can destroy function (sickle cell).",
    "Enzymes lower activation energy via active sites; affected by [S], [E], T, pH, cofactors, inhibitors (competitive and noncompetitive), and feedback inhibition.",
    "DNA: antiparallel double helix; A-T (2 H-bonds), G-C (3 H-bonds); semi-conservative replication (Meselson-Stahl).",
    "Central dogma: DNA $\\to$ RNA $\\to$ protein. Genetic code is nearly universal, redundant, read 5'$\\to$3'.",
  ],
  formulas: [
    {
      name: 'Dehydration synthesis',
      equation: 'Monomer-OH + H-Monomer $\\to$ Polymer + $H_2O$',
      meaning: 'Polymers build by removing water. Hydrolysis is the reverse.',
      example: 'Two amino acids combine via peptide bond, releasing one $H_2O$.',
    },
    {
      name: 'Genetic code',
      equation: '3 bases = 1 codon $\\to$ 1 amino acid; $4^3$ = 64 codons total',
      meaning: '61 specify amino acids; 3 stop (UAA, UAG, UGA). AUG = start (Met). Code is redundant.',
      example: "mRNA 5'-AUGGCCAAA-3' translates to Met-Ala-Lys.",
    },
    {
      name: 'pH',
      equation: 'pH = -log₁₀ [$H^+$]',
      meaning: 'Each pH unit = 10× change in [$H^+$]. Neutral water has [$H^+$] = $10^{-7}$ M $\\to$ pH 7.',
      example: 'Blood pH 7.4 is tightly buffered; a drop to 7.2 (acidosis) or rise to 7.6 (alkalosis) is medically serious.',
    },
  ],
  practice: [
    {
      q: 'Why does ice float on liquid water?',
      a: 'In ice, water molecules form a rigid hexagonal hydrogen-bond lattice with more open space than the random arrangement in liquid water. ~9% less dense $\\to$ floats. This protects aquatic life under winter ice.',
    },
    {
      q: "A DNA strand is 5'-ATCGGCTA-3'. What is the complementary strand and what direction does it run?",
      a: "3'-TAGCCGAT-5' (or equivalently 5'-TAGCCGAT-3' read in opposite direction). Strands are antiparallel.",
    },
    {
      q: 'Why is the single amino-acid change in sickle-cell hemoglobin so destructive?',
      a: 'Glu (polar, negative) $\\to$ Val (nonpolar) at position 6 of $\\beta\\text{-globin}$ creates a hydrophobic patch on the exterior. In deoxygenated state, hemoglobin molecules aggregate via these patches, deforming RBCs into rigid sickle shapes. Sickled cells block capillaries and shorten RBC lifespan.',
    },
    {
      q: 'Why can humans digest starch but not cellulose, even though both are glucose polymers?',
      a: 'Human enzymes (amylases) cleave $\\alpha\\text{-}1,4$ glycosidic bonds (the bond in starch) but not $\\beta\\text{-}1,4$ bonds (the bond in cellulose). Same monomer, different bond orientation, different enzyme specificity, different digestibility.',
    },
    {
      q: 'A point mutation changes the codon CAA (Gln) to CAG (also Gln). Predict the effect on the protein.',
      a: 'None at the protein level — both codons encode glutamine. This is a silent mutation, made possible by the redundancy of the genetic code.',
    },
  ],
  pitfalls: [
    '"DNA is single-stranded; RNA is double-stranded" — backwards. DNA is double-stranded; RNA is usually single-stranded (though it can fold locally and pair with itself).',
    '"Water expands when freezing because temperature drops" — wrong mechanism. The hydrogen-bond lattice in ice has more open space than liquid water; the structure is what makes ice less dense.',
    '"Proteins only have primary and tertiary structure" — incomplete. AP rubric requires understanding all 4 levels (1°, 2°, 3°, 4°).',
    '"All organisms use the same exact genetic code" — *nearly* universal. Mitochondria and some single-celled organisms use slightly altered codes. The AP exam accepts "nearly universal."',
    '"Saturated fats are bad; unsaturated are good — period." Diet-disease links are statistical and context-dependent. Trans fats are the most strongly implicated category in cardiovascular disease.',
    '"Hydrogen bonds are weak so they don\'t matter" — individually weak, collectively dominant. Hydrogen bonds explain DNA stability, protein folding, and most of water\'s emergent properties.',
    '"Enzymes work because the substrate fits exactly into the active site (lock and key)" — outdated. Induced fit is the modern model: the enzyme flexes when substrate binds.',
  ],
};
