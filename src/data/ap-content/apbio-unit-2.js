// AP Biology Unit 2 — Cell Structure and Function (10-13% of exam)
// APES-standard depth: every subunit is full teaching material a student can
// learn the topic from cold. Math typeset with LaTeX via $...$ delimiters.

export const APBIO_UNIT_2 = {
  number: 2,
  title: 'Cell Structure and Function',
  weight: '10-13%',
  subunits: [
    {
      code: '2.1',
      title: 'Cell structure and subcellular components',
      content:
`The cell is the fundamental unit of life. Every living thing — bacterium, redwood, blue whale — is either a single cell or a collective of cells. The **cell theory**, articulated by Schleiden, Schwann, and Virchow in the 1830s–50s, holds that (1) every living organism is composed of cells, (2) the cell is the basic unit of structure and function, and (3) every cell comes from a pre-existing cell ("omnis cellula e cellula"). Every other claim in biology builds on these three.

**The four features every cell shares.** No matter how exotic the organism, all known cells have:

- A **plasma membrane** — a phospholipid bilayer that separates the interior from the environment and controls what crosses.
- **Cytoplasm** — the watery interior, packed with proteins, sugars, salts, and structural fibers.
- **Ribosomes** — molecular machines that translate mRNA into protein.
- **Genetic material** — DNA carrying the instructions for everything the cell can do.

Everything else — nuclei, chloroplasts, contractile vacuoles, flagella — is variation on this universal four. The shared features are evidence of common ancestry; the differences track the specific niches different lineages have evolved into.

**The two major cell types.**

**Prokaryotic cells** (bacteria and archaea) are typically 1–10 $\\mu$m across. They have no membrane-bound nucleus — the DNA, almost always a single circular chromosome, sits free in a region called the **nucleoid**. There are no membrane-bound organelles. Ribosomes are smaller (70S — the S stands for Svedberg units, a measure of how fast they sediment in a centrifuge). Most prokaryotes have a **cell wall** outside the plasma membrane (peptidoglycan in bacteria, distinctive lipids in archaea), and many have an outer **capsule** for protection and adherence. Movement, when present, comes from rotating flagella driven by proton gradients.

**Eukaryotic cells** (animals, plants, fungi, protists) are typically 10–100 $\\mu$m — about $10^3 \\times$ the volume of an average bacterium. They have a true membrane-bound **nucleus** (eukaryote literally means "true nucleus"), an extensive internal membrane network ("endomembrane system"), and dedicated organelles for energy production (mitochondria; chloroplasts in plants and algae), waste processing (lysosomes, peroxisomes), structural support (cytoskeleton), and many other tasks. Ribosomes are larger (80S in the cytoplasm; the mitochondria and chloroplasts still use 70S ribosomes, a relic of their bacterial ancestry — Unit 2.10).

**The major eukaryotic organelles, with what each actually does.**

- **Nucleus.** Double-membraned envelope (the **nuclear envelope**) with regularly spaced **nuclear pores** (each a large protein complex) that gate the traffic of RNA and proteins in and out. Inside, **chromatin** (DNA wound around histone proteins) is packed into chromosomes during division and loosely uncoiled during interphase to allow transcription. A dense **nucleolus** is the assembly factory for ribosomes — rRNA is transcribed here and combined with imported ribosomal proteins.
- **Mitochondria.** The "powerhouses" — they perform **cellular respiration**, converting glucose and $O_2$ into $CO_2$, $H_2O$, and ATP. They have two membranes: a smooth outer membrane and a heavily folded inner membrane (the folds are called **cristae**). Cristae increase surface area for the electron transport chain and ATP synthase complexes embedded there. Mitochondria carry their own circular DNA and 70S ribosomes (evidence for the endosymbiotic origin in 2.10). Highly metabolic cells (muscle, liver, heart) contain thousands of mitochondria each; mature red blood cells have zero.
- **Chloroplasts** (only in plants and algae). Perform **photosynthesis**, capturing light energy and using it to convert $CO_2$ and $H_2O$ into glucose and $O_2$ — the reverse direction of respiration in terms of carbon. Three membrane systems: outer membrane, inner membrane, and an internal thylakoid system. Thylakoids are flattened sacs stacked into **grana**; chlorophyll molecules are embedded in their membranes. Like mitochondria, chloroplasts have circular DNA and 70S ribosomes.
- **Endoplasmic reticulum (ER).** A continuous folded membrane network extending from the nuclear envelope. **Rough ER** is studded with ribosomes on its cytoplasmic face; it synthesizes proteins destined for membranes, lysosomes, and secretion outside the cell, and threads them into the ER lumen as they're translated. **Smooth ER** lacks ribosomes; it synthesizes lipids (steroids, phospholipids), detoxifies drugs (liver smooth ER expands during heavy drinking, then contracts again), and stores $Ca^{2+}$ (in muscle, smooth ER is renamed **sarcoplasmic reticulum** and releases $Ca^{2+}$ to trigger contraction).
- **Golgi apparatus.** A stack of flattened membrane sacs (**cisternae**) with two faces: the **cis** face receives vesicles from the ER, the **trans** face sends vesicles to other destinations. The Golgi modifies proteins (adds sugars to make glycoproteins, trims pro-peptides), sorts them according to their address tags, and dispatches them in vesicles to the lysosome, the plasma membrane, or secretory storage. Think of it as the cellular post office.
- **Lysosomes** (animal cells). Vesicles containing hydrolytic enzymes (proteases, nucleases, lipases, glycosidases) that work optimally at pH ~4.5. The interior is kept acidic by proton pumps in the membrane. Lysosomes digest old organelles (**autophagy**), engulfed pathogens (joined to phagosomes), and macromolecules taken in by receptor-mediated endocytosis. **Lysosomal storage diseases** (Tay-Sachs, Gaucher, Hurler) result from missing hydrolases — undigested substrate accumulates.
- **Peroxisomes.** Single-membraned vesicles that handle reactions producing hydrogen peroxide ($H_2O_2$), especially the breakdown of very-long-chain fatty acids. The enzyme **catalase** inside breaks $H_2O_2$ down: $2H_2O_2 \\to 2H_2O + O_2$. Without catalase, the $H_2O_2$ would damage other cellular components.
- **Vacuoles.** Membrane-bound storage compartments. Plant cells have one large **central vacuole** that can occupy 80% of cell volume. It stores water, ions, and pigments, and its turgor pressure pushes outward against the cell wall, keeping plants upright. Some protists have **contractile vacuoles** that pump excess water back out of the cell — essential for freshwater protists that constantly take on water by osmosis.
- **Cytoskeleton.** Three types of protein fibers forming a dynamic internal scaffold. **Microfilaments** (built of actin) are the thinnest (~7 nm); they handle cell shape changes, muscle contraction (with myosin), and cytokinesis. **Intermediate filaments** (built of keratin, lamins, etc.) are ~10 nm and provide tensile strength. **Microtubules** (built of tubulin) are the thickest (~25 nm); they form spindle fibers in mitosis, the core of cilia and flagella, and the highways along which motor proteins (kinesin, dynein) carry vesicles.

**Plant vs animal cells — what each has that the other lacks.**

Plants have:
- A rigid **cell wall** made of cellulose, providing structural support and preventing osmotic lysis.
- **Chloroplasts** for photosynthesis.
- One large **central vacuole** for storage and turgor.
- **Plasmodesmata** — narrow channels through cell walls that connect adjacent cells' cytoplasm, allowing direct material transfer between plant cells.

Animals have:
- **Lysosomes** for intracellular digestion.
- **Centrioles** (in animal cells and a few protists), important in spindle organization during cell division.
- Small **vesicles** rather than one large vacuole.

Fungi have cell walls of **chitin**, not cellulose. Most bacterial cell walls contain **peptidoglycan**.

**Why this organization matters for the rest of the course.** The remainder of Unit 2 deals with the **plasma membrane** as a gatekeeper and the principle of **compartmentalization** as the source of eukaryotic complexity. Unit 3 covers what mitochondria and chloroplasts actually do biochemically. Unit 5 covers cell division — how chromosomes are packaged in the nucleus and pulled apart by microtubules. Almost every subsequent unit references organelles, so this map is the foundation.`,
      video: {
        url: 'https://www.youtube.com/watch?v=cj8dDTHGJBY',
        title: 'CrashCourse Biology — Eukaryopolis (the cell)',
        provider: 'CrashCourse',
      },
    },
    {
      code: '2.2',
      title: 'Cell size and surface area to volume',
      content:
`Cells are small for a deep physical reason. As a cell grows, its **volume increases faster than its surface area**, so its membrane — the only interface through which nutrients enter and wastes leave — falls farther and farther behind the demands of the interior. The **surface-area-to-volume ratio** (SA:V) is the single most important constraint shaping cell size, shape, and the existence of organelles.

**The geometry.** For a sphere of radius $r$:

$$\\text{Surface area} \\,=\\, 4\\pi r^2 \\qquad \\text{Volume} \\,=\\, \\tfrac{4}{3}\\pi r^3$$

Divide:

$$\\frac{SA}{V} \\,=\\, \\frac{4\\pi r^2}{\\tfrac{4}{3}\\pi r^3} \\,=\\, \\frac{3}{r}$$

The ratio is **inversely proportional to radius**. Double the radius and SA:V is cut in half. The same scaling holds for a cube of side $L$: $SA:V = 6/L$. The shape doesn't change the qualitative behavior — only the constant out front.

**Walk through the numbers.**

- A small bacterial cell with $r = 0.5\\,\\mu m$: $SA:V = 3/0.5 = 6\\,\\mu m^{-1}$.
- A typical animal cell with $r = 10\\,\\mu m$: $SA:V = 3/10 = 0.3\\,\\mu m^{-1}$.
- A "giant" cell with $r = 100\\,\\mu m$: $SA:V = 3/100 = 0.03\\,\\mu m^{-1}$.

The bacterium has 200× the SA per unit volume of the giant cell. The bacterium can saturate its interior with imported nutrients (and clear its wastes) in microseconds; the giant cell's interior would starve.

**Why surface limits volume — the four pinch points.**

1. **Diffusion gets too slow.** Small molecules diffuse a distance $x$ in time $t \\sim x^2/D$, where $D$ is the diffusion coefficient. Doubling cell size quadruples the diffusion time across it. In a 1 $\\mu$m cell, oxygen reaches the center in microseconds. In a 1 mm cell, the same trip would take hours — long enough for cells in the interior to suffocate.
2. **Wastes accumulate.** $CO_2$, lactate, urea, and ROS are produced everywhere in the cytoplasm but exit only through the membrane. The bigger the volume, the more waste produced per unit of exit area.
3. **Receptors saturate.** Surface receptors mediate signal reception (hormones, growth factors). With fewer receptors per unit mass, response times rise.
4. **Communication latency grows.** A signaling event at one end of a large cell takes longer to reach the other. For neurons, this is partially solved by myelination and the high conduction speed of action potentials, but even neurons specialize their geometry (long thin axons, not big cell bodies) to limit the problem.

**How cells handle the SA:V problem.**

- **Stay small.** Most cells are 10–50 $\\mu$m and divide before exceeding this. Bacteria are even smaller.
- **Divide on a timer.** Cells monitor their size and ratio of surface to volume, and divide when SA:V drops below a threshold.
- **Fold the surface.** Where a cell needs the area of a small cell with the volume of a large cell, it folds its membrane:
  - **Microvilli** on intestinal epithelial cells increase the absorbing surface ~25× without changing cell volume; the entire small intestine, with villi *and* microvilli together, has ~250 $m^2$ of absorptive surface — roughly the size of a tennis court.
  - **Cristae** in mitochondria multiply the inner-membrane area, packing in more ATP-synthase machinery per organelle.
  - **Thylakoids** in chloroplasts do the same for photosynthetic membranes.
  - **The endoplasmic reticulum** is essentially a folded sheet that gives a cell vast internal membrane area.
- **Adopt unusual shapes.** Red blood cells are biconcave disks: more SA than a sphere of the same volume, plus a flexible shape that squeezes through capillaries. Neurons extend long thin axons (a 1-meter sciatic-nerve axon has surface area enormously greater than a sphere with the same cell-body volume could). Sperm are slender and long. Squamous epithelium are flat plates.

**Why eukaryotes get to be bigger than prokaryotes.** Eukaryotic cells are larger but not because they violate the SA:V rule — they cheat it. **Compartmentalization** breaks one big interior into many small ones; **mitochondria** concentrate the chemistry of ATP production into thousands of small organelles, each with its own enormous internal membrane area; the **cytoskeleton** actively moves cargo so the cell isn't relying on diffusion alone. The "extra room" of a big eukaryotic cell is therefore broken up into manageable sub-regions, each operating at small-cell-friendly dimensions.

**Exceptions — huge single cells.** An ostrich egg is one cell. So is a frog egg. They get away with it by having very low metabolism, by storing most of their volume as inert yolk (not active cytoplasm), and by undergoing rapid cleavage immediately after fertilization to restore normal SA:V.

**Beyond the cell — Kleiber's law.** The same SA:V logic carries up to whole-organism metabolism. Metabolic rate scales as body mass to the $\\tfrac{3}{4}$ power: $B \\propto M^{3/4}$. Small animals (mice, shrews) have much higher per-gram metabolic rate than large ones (whales, elephants). Shrews eat 80–90% of their body weight daily; elephants eat ~5%. Marine mammals stay warm with low SA:V (round shape) plus thick blubber.

**One number to remember for the AP exam.** Doubling cell radius (or any linear dimension) **halves** the SA:V ratio. You can be asked to predict the consequence of changing cell size — it's almost always about SA:V.`,
      video: {
        url: 'https://www.youtube.com/watch?v=2HfLwm6oRsg',
        title: 'Bozeman Science — Surface area to volume ratio',
        provider: 'Bozeman Science',
      },
    },
    {
      code: '2.3',
      title: 'Plasma membranes — structure',
      content:
`The plasma membrane is the cell's edge. Every interaction the cell has with the outside world — taking up nutrients, expelling wastes, receiving signals, recognizing other cells — passes through it. The membrane is a marvel of self-assembled engineering: a phospholipid bilayer with embedded proteins that is liquid yet sealed, selective yet dynamic, fragile yet resilient. The current consensus model, the **fluid mosaic model** (Singer and Nicolson, 1972), captures all of these properties in a single coherent picture.

**The phospholipid bilayer.** Recall from Unit 1.4 that phospholipids are **amphipathic**: a hydrophilic phosphate head and two hydrophobic fatty-acid tails. In water, they spontaneously self-assemble. The energetically favorable arrangement is a **bilayer**: heads facing outward into water on both sides; tails sequestered together in the middle. The bilayer is about **5–10 nm** thick — thinner than the width of a single ribosome.

The reason the bilayer forms is not because phospholipids "like" each other but because water "likes itself." Pushing the hydrophobic tails out of solution lets the surrounding water molecules form more hydrogen bonds with each other — the **hydrophobic effect**, driven by entropy. This is the same physics that makes oil separate from vinegar. The cell didn't have to invent a mechanism; the chemistry assembles itself, which is why simple phospholipid vesicles (**liposomes**) form whenever you sonicate phospholipids in water.

**Membrane composition by mass.**

- **Phospholipids** — roughly 50% of membrane mass. Variety: phosphatidylcholine, phosphatidylethanolamine, phosphatidylserine, sphingomyelin, etc. Each has a distinctive head group with its own size, charge, and signaling roles.
- **Proteins** — roughly 40% of mass, sometimes more in membranes packed with channels (mitochondrial inner membrane: ~75% protein) or less in membranes acting mostly as barriers (myelin sheath: ~20% protein).
- **Cholesterol** — about 10–20% in animal cell membranes; absent from prokaryotes. Cholesterol intercalates among phospholipid tails and modulates membrane fluidity (see below).
- **Carbohydrates** — small but functionally critical, attached either to lipids (**glycolipids**) or proteins (**glycoproteins**) on the **outer** face of the membrane. Together they form the **glycocalyx**, the sugar coat used for cell-cell recognition.

**The fluid mosaic model.** In the older "sandwich" picture (Davson-Danielli, 1935), proteins were thought to lie *on top of* the lipid layers like a sandwich. In the fluid mosaic model:

- Lipids and proteins move laterally within the plane of the membrane like ships on a sea — typically at $\\sim 1\\,\\mu m/s$ for lipids.
- Lipids rarely **flip** from one leaflet to the other (it's energetically expensive to drag a charged head through the hydrophobic interior); special enzymes (flippases) move them when needed.
- The two leaflets have **distinct compositions** (asymmetry) — e.g., phosphatidylserine is concentrated on the cytoplasmic face. Display of phosphatidylserine on the outer face signals "eat me" to phagocytes and is a hallmark of cells undergoing apoptosis.
- Proteins are integrated into the bilayer; some span it once, others many times.

**The role of cholesterol — a fluidity buffer.**

Cholesterol has a small polar head (one $-OH$) and a stiff, planar four-ring core. It nestles among phospholipid tails. At **high temperatures**, cholesterol restrains the otherwise too-rapid motion of fatty-acid tails, **reducing fluidity**. At **low temperatures**, cholesterol gets between fatty-acid tails and prevents them from packing too tightly, **maintaining fluidity** and keeping the membrane from solidifying. Net effect: cholesterol holds membrane fluidity in a working range across a wider temperature span than would be possible without it. Organisms living at extreme temperatures adjust membrane fluidity by changing fatty-acid saturation (more unsaturated = more fluid; the Arctic fish strategy) and cholesterol levels (mammals).

**Types of membrane proteins.**

- **Integral (transmembrane) proteins** span the bilayer. The membrane-spanning portion is typically an $\\alpha$-helix of ~20 hydrophobic amino acids (long enough to cross the ~3 nm hydrophobic core; hydrophobic so they're stable in the lipid interior). Examples: ion channels, transporters, receptors, cell-adhesion molecules. Some span the membrane once; others (like the G-protein-coupled receptors, the largest family of drug targets) span it seven times.
- **Peripheral proteins** are attached to one face, often via electrostatic interactions with charged phospholipid head groups or with integral proteins. Many are enzymes that act on substrates either in the cytoplasm or in the extracellular space.
- **Lipid-anchored proteins** are covalently linked to a lipid in the membrane (e.g., a glycosylphosphatidylinositol or **GPI anchor** on the outer leaflet, or a prenyl group on the inner leaflet).

**Six things membrane proteins do.**

1. **Transport** — channels and pumps move ions and molecules across.
2. **Catalysis** — enzymes bound to the membrane catalyze reactions involving membrane substrates or extracellular substrates.
3. **Signal transduction** — receptors bind extracellular signals (hormones, growth factors, neurotransmitters) and transmit information into the cell.
4. **Cell-cell recognition** — glycoproteins display sugar tags that identify the cell.
5. **Intercellular junctions** — tight junctions, gap junctions, and desmosomes hold cells together and regulate what passes between them.
6. **Cytoskeleton attachment** — link the cytoskeleton to the membrane and to the extracellular matrix, giving the cell mechanical stability.

**Selective permeability — what crosses freely vs. needs help.**

What gets through depends on **size, polarity, and charge**:

- **Crosses freely** through the hydrophobic interior: small nonpolar molecules ($O_2$, $CO_2$, $N_2$), small uncharged polar molecules to a limited extent (water is a special case below), steroid hormones (lipid-soluble), small fatty acids.
- **Crosses slowly** unless aided: water (slow through the bilayer; very fast through **aquaporin** channels).
- **Does not cross** without a transport protein: ions ($Na^+$, $K^+$, $Ca^{2+}$, $Cl^-$, $H^+$) — the hydrophobic interior is fatal to charges; large polar molecules (glucose, amino acids); macromolecules (DNA, proteins, polysaccharides).

This selective permeability is the whole point of the membrane: it lets the cell maintain a chemical environment radically different from its surroundings while admitting necessary materials and discharging wastes. It is what makes life thermodynamically possible.

**The glycocalyx.** The carbohydrate-rich coat on the outer face is the cell's identification system. ABO blood groups are determined by differences in the sugars attached to a surface glycoprotein on red blood cells: people with type A have one sugar; type B another; type O lack both; type AB display both. Mismatched blood transfusion triggers immune attack on the foreign sugars. Sperm and eggs recognize each other by surface glycoproteins. Many bacteria and viruses bind specific sugar groups to gain entry; influenza, for example, binds sialic acid, the basis for oseltamivir (Tamiflu), which blocks the viral enzyme that releases newly assembled viruses from sialic-acid-coated cell surfaces.`,
      video: {
        url: 'https://www.youtube.com/watch?v=qBRFIMcxZNM',
        title: 'CrashCourse Biology — In da club: membranes and transport',
        provider: 'CrashCourse',
      },
    },
    {
      code: '2.4',
      title: 'Membrane permeability and selective transport',
      content:
`The cell's interior must stay chemically distinct from its exterior, but it also must exchange materials with the outside. The plasma membrane reconciles these conflicting requirements by being **selectively permeable** — letting some substances cross more or less freely, blocking others entirely, and providing controlled routes for the rest. Whether a particular molecule crosses spontaneously is determined by **four properties**: size, polarity, charge, and lipid solubility.

**The four categories of permeability.**

**Freely permeable — small, nonpolar, lipid-soluble.** These molecules dissolve into the lipid interior and diffuse through.

- Small nonpolar gases: $O_2$, $CO_2$, $N_2$, $NO$, $CO$. All cellular respiration depends on $O_2$ being able to walk straight through any membrane it encounters.
- Steroid hormones: cortisol, testosterone, estrogen, vitamin D. Because they cross freely, steroid hormone receptors are usually **intracellular** (inside the cell), unlike peptide hormone receptors that have to sit on the surface waiting for their signal.
- Small, uncharged molecules like urea, ethanol — they don't dissolve as well as $O_2$, but they're small and uncharged enough to slip across.

**Slightly permeable — small, polar, uncharged.** These don't dissolve well in lipid but are small enough to cross with effort.

- Water. The water molecule is very small (~0.3 nm) but polar. It can cross the bilayer through transient defects, but the rate is slow. Most water flux is through dedicated channels — **aquaporins** — that can transport ~$10^9$ molecules per second per channel. Aquaporins were discovered in 1991 by Peter Agre, who initially thought they were an artifact; the Nobel Prize followed in 2003.
- Small polar molecules like glycerol, urea.

**Impermeable without transport proteins — ions and large polar molecules.**

- All ions: $Na^+$, $K^+$, $Ca^{2+}$, $Cl^-$, $H^+$, $Mg^{2+}$, etc. The hydrophobic core of the bilayer is fatal to charges. Ions require **ion channels** or **pumps** to cross.
- Large polar molecules: glucose, amino acids, nucleotides, ATP. These need dedicated **transporters**.
- Macromolecules: DNA, RNA, proteins, polysaccharides. These typically don't cross individual membranes at all; they're moved by vesicle traffic (endocytosis/exocytosis, Unit 2.8).

**The underlying physical principle.** The bilayer's interior is essentially a thin layer of oil — about 3 nm of hydrocarbon tail. Anything that dissolves in oil crosses; anything that doesn't, doesn't. Charges are repelled because the interior has very low dielectric constant; pushing a charge through it requires huge energy. Polar molecules can negotiate the headgroup region but stall at the hydrophobic interior. The hydrophobic effect, the same thing that drove bilayer assembly in the first place, also dictates what can cross.

**Why this matters in pharmacology.** Drug design lives by these rules.

- **Lipid-soluble drugs cross membranes readily.** Anesthetics, many psychoactive drugs (antipsychotics, antidepressants), and steroid hormones can enter cells directly and bind intracellular targets. They also cross the blood-brain barrier (which is just an especially tight cell membrane network around brain blood vessels).
- **Polar or charged drugs cannot.** They must work on cell-surface receptors. Insulin (a polar peptide) binds the insulin receptor on the cell surface and triggers an intracellular signaling cascade — it cannot enter directly. Many antibodies (immunoglobulins) and protein therapeutics fall in this category.
- **The "Rule of 5"** (Lipinski) is a rough guide for orally absorbed drugs: molecular weight ≤ 500 Da, ≤ 5 hydrogen-bond donors, ≤ 10 hydrogen-bond acceptors, $\\log P$ (lipid-water partition coefficient) ≤ 5. Compounds that violate too many of these aren't absorbed.

**The aquaporin story.** Aquaporins are highly selective: they let water through at a rate close to free diffusion but exclude $H^+$ — even though $H^+$ is smaller than $H_2O$ and would be expected to pass easily by "hopping" along water molecules (the Grotthuss mechanism). The channel's geometry forces water through in a single file with a specific orientation, breaking the hydrogen-bond network that would otherwise carry $H^+$. Without aquaporins, our kidneys couldn't concentrate urine (they reabsorb ~99% of the water from glomerular filtrate, almost all of it through aquaporin-2 channels), and plant roots couldn't take up enough water to support transpiration.

**The $Na^+/K^+$ pump — why it dominates resting metabolism.** Every cell maintains a strong asymmetry of ion concentrations: $K^+$ high inside, $Na^+$ high outside. The pump that does this work uses **3 $Na^+$ out + 2 $K^+$ in per ATP**. Because it runs constantly, it consumes about **25%** of an average resting cell's ATP budget — and up to 70% in neurons. The pump is the basis of the **resting membrane potential** ($-65$ to $-90\\,\\mathrm{mV}$ in animal cells) on which nerve signaling, muscle contraction, and secondary active transport all depend.

**Cystic fibrosis — what happens when one channel fails.** CFTR (Cystic Fibrosis Transmembrane conductance Regulator) is a chloride channel in airway and pancreatic-duct epithelial cells. When CFTR is defective (most commonly because of a 3-nucleotide deletion $\\Delta F508$ that prevents proper folding), $Cl^-$ can't leave the cells, water doesn't follow osmotically, and the mucus that should sit on top of the epithelium becomes dehydrated and thick. The result is chronic airway infection and pancreatic enzyme failure. Modern CFTR modulator drugs (ivacaftor, lumacaftor, elexacaftor) help the misfolded protein either reach the membrane or function once there — life expectancy has roughly doubled in the past decade.

**Membrane potential — a preview.** The combination of (a) ion pumps creating concentration gradients and (b) selective ion channels lets the membrane act like a charged battery. The resting membrane potential is about $-70\\,\\mathrm{mV}$ inside (relative to outside). Transient openings of ion channels (voltage-gated $Na^+$ then $K^+$) generate the **action potential** in neurons, which propagates as the wave of voltage change that travels down axons at speeds up to ~100 m/s in myelinated nerves. You'll meet this in Unit 4 (signaling); the foundation is right here in selective membrane permeability.`,
      video: {
        url: 'https://www.youtube.com/watch?v=qBRFIMcxZNM',
        title: 'CrashCourse Biology — Membranes and transport',
        provider: 'CrashCourse',
      },
    },
    {
      code: '2.5',
      title: 'Membrane transport — passive and active',
      content:
`Cells use **four categories** of mechanism to move material across membranes, defined by whether the mechanism uses ATP (active or passive) and whether it uses a vesicle (bulk) or moves molecules one at a time.

**1. Passive transport — no ATP, down the gradient.**

The thermodynamic principle: molecules at higher concentration spread out toward lower concentration spontaneously, increasing entropy, until concentrations equalize. The cell doesn't have to expend energy; it just provides the route.

- **Simple diffusion.** Small nonpolar molecules pass directly through the bilayer. No protein involved. Rate is set by the concentration gradient and the molecule's lipid solubility. $O_2$ moves down its gradient from blood (high $O_2$) into mitochondria (where it's continually consumed); $CO_2$ moves in the opposite direction.
- **Facilitated diffusion.** Polar molecules and ions use transmembrane proteins to cross — still down the gradient, still no ATP. Two flavors:
  - **Channel proteins** form a continuous pore. They are fast (millions to billions of ions per second) and selective. Aquaporins for water; voltage-gated $Na^+$, $K^+$, and $Ca^{2+}$ channels for action potentials; the CFTR channel for $Cl^-$; chloride channels in inhibitory synapses; AMPA and NMDA receptors for $Na^+$/$Ca^{2+}$ at glutamatergic synapses.
  - **Carrier proteins** bind a specific molecule on one side, change shape, and release it on the other. Slower than channels (hundreds to thousands per second), but extremely selective. The **GLUT** family of glucose transporters is the classic example; GLUT4 in muscle and fat cells is held in intracellular vesicles until insulin signals to deploy it to the plasma membrane (impaired in type 2 diabetes).
- **Osmosis** is the special case of water moving by facilitated diffusion (through aquaporins) down its own gradient — which means *from* a region of high water concentration (low solute) *toward* a region of low water concentration (high solute).

Passive transport will keep going until equilibrium is reached. The cell can't pump material against its gradient passively.

**2. Active transport — ATP, against the gradient.**

When the cell needs to maintain a concentration of something *higher* inside than outside (or vice versa), it has to expend energy. Two main flavors:

- **Primary active transport** uses ATP directly. The transporter binds substrate, ATP binds and is hydrolyzed, the energy of hydrolysis drives a conformational change that moves the substrate across, and ADP + Pi leave.
  - **The $Na^+/K^+$ pump** (also called $Na^+/K^+$ ATPase). Stoichiometry: $3\\,Na^+$ out and $2\\,K^+$ in per ATP hydrolyzed. It maintains the steep ion gradients on which nerve and muscle function depend, and consumes a quarter to two-thirds of total cellular ATP at rest.
  - **The $Ca^{2+}$ ATPase** in the sarcoplasmic reticulum membrane returns $Ca^{2+}$ to storage after a muscle contraction.
  - **The proton pump** ($H^+$ ATPase) in lysosomal membranes keeps lysosomal pH at ~4.5.
  - **The proton pump in mitochondrial inner membrane** runs in **reverse** — protons flow *down* their gradient through ATP synthase, and the released energy drives ATP synthesis. This is **chemiosmosis**, the central trick of cellular respiration (Unit 3).
- **Secondary active transport** uses energy stored in a pre-existing gradient (built by a primary pump) to drive a different molecule against its own gradient. The transporter binds two substrates and moves both together.
  - **Symport**: both substrates move in the same direction. **SGLT1** (the sodium-glucose cotransporter) on intestinal epithelial cells uses the $Na^+$ gradient (maintained by the $Na^+/K^+$ pump) to pull glucose into the cell against its concentration gradient. SGLT2 in the kidney does the same job for glucose reabsorption from urine; SGLT2 inhibitors (gliflozins like empagliflozin) are major modern diabetes drugs.
  - **Antiport**: substrates move in opposite directions. The $Na^+/Ca^{2+}$ exchanger in cardiac cell membranes uses the $Na^+$ gradient to expel $Ca^{2+}$.

The cell separates "make ATP" from "do work that needs ATP." Mitochondria generate the ATP currency; pumps and transporters spend it.

**3. Bulk transport — endocytosis (in) and exocytosis (out).**

Material too large for individual channels and transporters moves in membrane-bounded vesicles. Both endocytosis and exocytosis require ATP and the protein machinery of vesicle fusion.

- **Endocytosis.** A patch of plasma membrane invaginates around the material; the lips of the invagination fuse and pinch off as an internal vesicle.
  - **Phagocytosis** ("cell eating"): large particles (bacteria, dead cells, debris). Macrophages in the immune system live by this; so do amoebas hunting food. The phagosome eventually fuses with a lysosome where the contents are digested.
  - **Pinocytosis** ("cell drinking"): the cell takes in extracellular fluid and whatever's dissolved in it. Continuous, non-selective.
  - **Receptor-mediated endocytosis**: very specific. Surface receptors bind their ligand, cluster together in **clathrin-coated pits**, and the pit pinches off as a coated vesicle. LDL cholesterol uptake works this way; defects in the LDL receptor cause familial hypercholesterolemia. Iron uptake (via transferrin) and many growth-factor signaling events also use receptor-mediated endocytosis.
- **Exocytosis.** A vesicle inside the cell moves to the membrane, the membranes fuse, and the contents are released to the outside. The vesicle's membrane becomes part of the plasma membrane.
  - Insulin release from pancreatic $\\beta$-cells in response to high blood glucose.
  - Neurotransmitter release at synapses, triggered by $Ca^{2+}$ influx through voltage-gated channels.
  - Digestive enzyme release from pancreatic acinar cells.
  - Mucus secretion in airway goblet cells.

**SNARE proteins** mediate the actual fusion event. v-SNAREs on the vesicle pair with t-SNAREs on the target membrane like a zipper, drawing the membranes together until they merge. Botulinum toxin cleaves SNAREs in motor-neuron presynaptic terminals, blocking acetylcholine release at the neuromuscular junction; the result is botulism (paralysis). The same toxin is the basis of cosmetic Botox.

**4. Water specifically — osmosis.**

Osmosis is just water diffusion, but it's important enough to name separately. Water flows toward the side of the membrane with **higher solute** (and therefore lower water activity). The driving force is **water potential**, and it adds up like any other thermodynamic gradient: differences in solute, pressure, gravity, and matric forces all combine. For freshwater organisms, water enters constantly and must be pumped out (contractile vacuoles in protists; cell walls in plants prevent lysis). For marine organisms, the opposite challenge: water leaves, so they have to drink seawater and excrete the salt.

**Putting it together with one example: a single sip of orange juice.**

1. Glucose in the gut lumen enters intestinal epithelial cells through **SGLT1** (secondary active, $Na^+$-glucose symport, exploiting the $Na^+$ gradient built by the $Na^+/K^+$ pump on the basolateral side).
2. From the epithelial cell, glucose exits to interstitial fluid through **GLUT2** (facilitated diffusion, down the now-favorable gradient).
3. Glucose reaches the bloodstream and circulates.
4. Insulin secreted by pancreatic $\\beta$-cells (which themselves took up glucose by GLUT2 and used it to make ATP, which triggered insulin release via voltage-gated channels) tells muscle and fat cells to deploy **GLUT4** to their membranes (facilitated diffusion, no ATP).
5. Muscle cells phosphorylate the incoming glucose to glucose-6-phosphate — trapping it inside (the phosphate group is too charged to cross back out) and feeding it into glycolysis to make ATP.

Two flavors of facilitated diffusion (SGLT1, GLUT2/GLUT4), one secondary active step ($Na^+$ gradient driving glucose against its gradient), one primary active pump ($Na^+/K^+$ ATPase that built the gradient), and one signaling cascade (insulin → receptor → translocation). All of Unit 2 in a single sip of juice.`,
      video: {
        url: 'https://www.youtube.com/watch?v=qBRFIMcxZNM',
        title: 'CrashCourse Biology — Transport across membranes',
        provider: 'CrashCourse',
      },
    },
    {
      code: '2.6',
      title: 'Facilitated diffusion in detail',
      content:
`The bilayer alone is impermeable to most ions and polar molecules, but cells need to import nutrients and export wastes selectively and at high rate. The solution is **facilitated diffusion** — passive (no ATP) movement of specific molecules across the membrane through dedicated transmembrane proteins. The two flavors, channels and carriers, are distinct enough in mechanism that they're worth treating in detail.

**Channel proteins — open pores.**

A channel is a transmembrane protein that forms a continuous aqueous pore through the membrane. When open, it lets specific molecules through at rates approaching free diffusion — hundreds of thousands to billions of molecules per second per channel. Selectivity comes from the pore's geometry and chemistry.

- **Aquaporins.** Selective for water. The channel narrows to about 0.28 nm at its narrowest point — barely wider than a water molecule (0.27 nm). Water passes single-file with a forced orientation that breaks the hydrogen-bond network and excludes $H^+$. Aquaporin-2 in kidney collecting ducts is regulated by antidiuretic hormone (ADH/vasopressin); without ADH, aquaporins are stored in vesicles and urine is dilute, with ADH, aquaporins are inserted in the membrane and water is reabsorbed.
- **Potassium channels.** Selective for $K^+$ over the smaller $Na^+$ by a factor of ~10,000. The pore has a "selectivity filter" where four carbonyl oxygens at exactly the right spacing mimic the hydration shell of $K^+$ — paying back the energy cost of stripping the water shell. $Na^+$ is too small for this geometry to work and remains hydrated and excluded. Roderick MacKinnon won the 2003 Nobel for solving the structure that explained this counterintuitive specificity.
- **Voltage-gated channels.** Open or close in response to changes in membrane voltage. Each has a charged "voltage sensor" segment that physically moves when the field across the membrane changes, dragging a gate open. Voltage-gated $Na^+$ and $K^+$ channels generate the action potential in neurons (Unit 4). The local anesthetic lidocaine blocks voltage-gated $Na^+$ channels — without them, the neuron can't fire and pain can't propagate.
- **Ligand-gated channels (ionotropic receptors).** Open in response to binding a specific molecule. Acetylcholine binding to the nicotinic receptor at the neuromuscular junction opens an integrated cation channel; $Na^+$ rushes in and triggers muscle contraction. GABA binding to its receptor opens a $Cl^-$ channel that hyperpolarizes the neuron — the basis of inhibition. Benzodiazepines (Xanax, Valium) potentiate GABA action; alcohol does the same.

**Channels work in one direction only at any moment** — net flux is always *down* the electrochemical gradient (concentration plus voltage). When the gradient reverses (or vanishes), so does flux. Channels are gates, not pumps.

**Carrier proteins — alternating access.**

A carrier protein has a binding site for its substrate that can be exposed to *one* side of the membrane at a time. Substrate binds on side A; the protein undergoes a conformational change so the binding site is now exposed to side B; substrate dissociates; the empty protein flips back. This is **alternating access**. It's slower than channel transport (typically $10^2$–$10^4$ per second) but more selective.

- **The GLUT family of glucose carriers.** Different tissues express different family members tuned for their needs.
  - **GLUT1** — ubiquitous; high affinity; provides baseline glucose uptake to most cells. Critical in red blood cells and brain.
  - **GLUT2** — liver, kidney, pancreatic $\\beta$-cells, intestinal epithelium. Low affinity, high capacity; designed to track blood glucose level. In $\\beta$-cells, GLUT2 lets the cell sense blood glucose and adjust insulin secretion.
  - **GLUT3** — neurons. Very high affinity, ensures uptake even at low blood glucose.
  - **GLUT4** — muscle and adipose. Stored in intracellular vesicles until insulin signal triggers translocation to the plasma membrane. Defective response is the central feature of type 2 diabetes.
  - **GLUT5** — small intestine; transports fructose rather than glucose. Sucrose digestion produces a fructose flood that GLUT5 handles separately.

- **Amino acid transporters.** Different families for acidic, basic, neutral, and large neutral amino acids. Cystinuria, an inherited disorder, results from defects in transporters that reabsorb cystine and three other amino acids in kidney tubules — the unabsorbed cystine precipitates as kidney stones.

**Saturation kinetics.** Because carriers cycle through a fixed conformational change, they have a maximum throughput. Plot transport rate vs. substrate concentration and you get a hyperbolic curve like Michaelis-Menten enzyme kinetics: rate rises linearly with $[S]$ at low $[S]$, then saturates at $V_{\\max}$ when all carriers are constantly busy. Channels, in contrast, have approximately linear current-vs.-driving-force curves until very extreme conditions — they don't saturate the way carriers do.

**A useful analogy.** Channels are revolving doors at a train station: many people through per second, but everyone has to be going the same way (the current direction of the door). Carriers are turnstiles: you have to swipe a specific card, the gate clicks through one rotation, then resets — slower and less customizable, but you can collect a toll.

**Disease examples — when transport fails.**

- **Cystic fibrosis** (CFTR): chloride channel in airway and pancreatic ducts. Without functional CFTR, mucus loses water and thickens.
- **Bartter syndrome**: defects in $Na^+$/$K^+$/$2Cl^-$ cotransporter in kidney; salt is lost in urine, blood pressure crashes.
- **Liddle syndrome**: hyperactive epithelial $Na^+$ channel (ENaC) in kidney; too much salt reabsorbed; hypertension.
- **Cinchonism**: quinine (used to treat malaria) blocks many channels nonspecifically; can produce confused state at high doses.

**A drug development takeaway.** Membrane transport proteins are one of the largest classes of drug targets. Approximately a third of all FDA-approved drugs target a channel, transporter, or membrane receptor. Designing a drug to selectively block or activate one specific transporter, without disturbing the dozens of related family members, is one of the central challenges of modern pharmacology.`,
      video: {
        url: 'https://www.youtube.com/watch?v=qBRFIMcxZNM',
        title: 'CrashCourse Biology — Membrane transport',
        provider: 'CrashCourse',
      },
    },
    {
      code: '2.7',
      title: 'Tonicity and osmoregulation',
      content:
`Water moves across membranes wherever there's a difference in **water potential** between the two sides. The simplest case — and the case the AP exam tests most — is differences in dissolved solute. Pure water has the highest water potential; adding solute lowers it. Water flows from regions of higher water potential (lower solute) toward regions of lower water potential (higher solute). The cell-relevant vocabulary for this is **tonicity**.

**The three tonicity cases.** Tonicity is described **relative to the cell**.

- **Hypertonic** — the surrounding solution has more solute than the cell interior. Water leaves the cell. Animal cells **crenate** (shrivel). Plant cells **plasmolyze** — the cytoplasm shrinks away from the cell wall, leaving a gap.
- **Hypotonic** — the surrounding solution has less solute than the cell interior. Water enters the cell. Animal cells swell and, if the influx continues, **lyse** (burst). Plant cells become **turgid** — they swell until the cell wall stops further expansion, generating internal **turgor pressure** that keeps the plant rigid. They don't burst because the wall holds.
- **Isotonic** — solute concentration is equal on both sides. No *net* water movement (water still crosses both ways at the same rate). Normal saline (0.9% NaCl, or about 154 mM each of $Na^+$ and $Cl^-$) is approximately isotonic to human cells, which is why intravenous fluids use it.

**The quantitative side.** Osmotic pressure is the pressure required to oppose water flow into a more concentrated solution. The van 't Hoff equation gives it as

$$\\Pi \\,=\\, iMRT$$

where $\\Pi$ is the osmotic pressure, $i$ is the van 't Hoff factor (number of particles produced per formula unit dissolved — 1 for glucose, 2 for NaCl, 3 for $CaCl_2$), $M$ is molarity, $R$ is the gas constant, and $T$ is absolute temperature. The factor $i$ is why a 1 M NaCl solution exerts almost twice the osmotic pressure of a 1 M glucose solution.

For plant cells, **water potential** is split into solute and pressure components: $\\Psi = \\Psi_S + \\Psi_P$. Pure water at standard conditions has $\\Psi = 0$. Adding solute decreases $\\Psi_S$ (makes it more negative). Inside a turgid plant cell, the wall pushes back against the swollen cytoplasm, so $\\Psi_P$ is positive. The two can balance to give the cell a $\\Psi$ that matches the surrounding soil water.

**Concrete examples to anchor the vocabulary.**

- **Red blood cell in distilled water.** Distilled water is extremely hypotonic. Water rushes in. The RBC swells and lyses within seconds. There are no cell walls; nothing prevents the burst.
- **Red blood cell in concentrated saline (3% NaCl, ~530 mM total ions).** Hypertonic. Water rushes out. The RBC crenates — its membrane wrinkles into spikes. Crenated RBCs are functional only briefly.
- **Plant cell in pure water.** Hypotonic. Water enters; the cell expands until the cell wall stops further expansion. Turgor pressure pushes against the wall. The plant stays rigid. **Wilting** is the loss of turgor pressure when water becomes scarce in the soil.
- **Plant cell in concentrated solution.** Hypertonic. Water leaves. Cytoplasm shrinks away from the wall. The cell plasmolyzes. Severe plasmolysis is often fatal.
- **Salty roads in winter.** Salt that runs off into nearby soil makes the soil solution hypertonic. Roots can't take up water (water tries to leave them, in fact); the plants die of "physiological drought" — there's plenty of water around but it can't be absorbed.

**Osmoregulation in different organisms — how they cope.**

- **Marine bony fish.** Seawater is hypertonic. Water tends to leave their cells. They cope by **drinking seawater constantly**, excreting the salt actively through specialized cells in the gills, and producing only small amounts of concentrated urine. Their gills also have abundant aquaporins to absorb water from the gut after the salt has been pulled out.
- **Freshwater fish.** Water is hypotonic. Water enters constantly. They don't drink at all. They absorb ions actively through specialized gill cells and produce huge amounts of very dilute urine — essentially pumping water out at the kidney.
- **Sharks.** Skip the problem by raising blood urea (and trimethylamine N-oxide) until their blood is hypertonic to seawater. They actually take up water through their gills.
- **Salmon and eels (anadromous/catadromous fish).** Switch between fresh and salt water over weeks during migration, with major physiological remodeling of gills and kidneys.
- **Terrestrial animals.** Lose water through breath, skin, urine. Kidneys concentrate urine to conserve water — desert mammals (kangaroo rats) can produce urine 5× more concentrated than seawater.
- **Plants.** Roots absorb water osmotically from soil because root cells maintain low solute potential (high solute concentration); transpiration in the leaves pulls water up through the xylem. Turgor pressure of plant cells is what makes plant tissue rigid.
- **Bacteria.** Use compatible solutes (proline, glycine betaine) to balance external osmotic pressure without disrupting protein function — many bacteria can thrive across enormous salt range.

**Why drinking seawater dehydrates you.** Seawater is ~3.5% salt. Human blood is ~0.9% salt. The maximum salt concentration a human kidney can produce is ~1% salt. So if you drink 1 L of seawater, you take in ~35 g of salt. To excrete that much salt, your kidneys need to produce ~3.5 L of urine. You started with 1 L of water in your gut and end up needing to lose 3.5 L of body water to get rid of the salt — net dehydration of 2.5 L. The more seawater you drink, the more dehydrated you become.

**Why IV fluids must be carefully matched.** Pure water IV would lyse blood cells (hypotonic) and could be lethal. Too-concentrated solutions would crenate them. Standard "normal saline" is 0.9% NaCl, roughly isotonic. Lactated Ringer's solution is similar but adds $K^+$, $Ca^{2+}$, and lactate to replace what's lost in trauma or surgery. **D5W** (5% dextrose in water) becomes effectively water once the dextrose is metabolized — useful for delivering free water when needed.

**Plant turgor — the engineering of standing up.** Plant cells fully turgid push outward on their walls with about 0.5 MPa of pressure — five times atmospheric. The whole plant's rigidity depends on this. A wilted plant has lost turgor; rehydrating restores it, often within minutes. The same principle drives the dramatic snap-trap closure of a Venus flytrap (rapid loss of turgor in specific cells lets the trap halves spring shut) and the daily folding of bean leaves at sunset.`,
      video: {
        url: 'https://www.youtube.com/watch?v=zUcl45D-uPo',
        title: 'Bozeman Science — Osmosis and tonicity',
        provider: 'Bozeman Science',
      },
    },
    {
      code: '2.8',
      title: 'Bulk transport — endocytosis and exocytosis',
      content:
`Channels and pumps move single molecules. They can handle small ions and metabolites but they can't carry whole proteins, organelles, viruses, or food particles. For bulk material, cells use **vesicle traffic**: the membrane wraps around the cargo, pinches off as an internal vesicle (endocytosis) or fuses with the membrane to release contents to the outside (exocytosis). Both processes require ATP and an elaborate protein machinery to direct, dock, and fuse vesicles correctly.

**Endocytosis — taking material in.**

There are three flavors, distinguished by what they take and how specifically.

**Phagocytosis** — "cell eating." Used for large particles (microns rather than nanometers).
- Macrophages and neutrophils in the immune system phagocytose bacteria, dead cells, and debris. The membrane wraps around the target, the lips fuse and pinch off as a **phagosome**, the phagosome merges with a lysosome to form a **phagolysosome**, and the lysosomal enzymes digest the contents. The breakdown products are then either expelled or recycled.
- Amoebas hunt by phagocytosis. So do many protists.
- Phagocytosis requires the cell to actively reorganize its actin cytoskeleton to push the membrane around the target — it doesn't just happen passively.

**Pinocytosis** — "cell drinking." Used for fluid and dissolved molecules.
- The cell continuously invaginates small patches of membrane, taking up extracellular fluid and whatever solutes are in it. Non-specific.
- Used by many cell types to sample what's outside and to maintain membrane recycling.

**Receptor-mediated endocytosis** — highly specific. Used for important small molecules and signaling.
- Cell-surface receptors bind their specific ligand. The receptor-ligand complexes cluster into specialized membrane regions called **clathrin-coated pits**. Clathrin is a protein that polymerizes into a basket-like cage that curves the membrane inward. The basket pinches off as a clathrin-coated vesicle.
- After internalization, the clathrin coat is shed (recycled), the vesicle fuses with an **endosome**, the endosome acidifies, ligand dissociates from receptor, receptor is recycled to the membrane, ligand is delivered onward.
- **LDL cholesterol uptake** uses this pathway. The LDL receptor on the surface binds LDL particles (cholesterol packaged in protein); they're internalized; in the endosome, the lower pH releases the LDL; the cholesterol is delivered to the cell; the LDL receptor is recycled back to the surface. Familial hypercholesterolemia, in which the LDL receptor is defective, was the disease that first revealed how receptor-mediated endocytosis worked (Brown and Goldstein, Nobel 1985).
- **Iron uptake** through transferrin works similarly.
- **Many viruses hijack this pathway** to enter cells: influenza binds sialic acid, enters in clathrin-coated vesicles, then exploits the acidified endosome to trigger fusion of its envelope with the endosomal membrane, releasing its genome into the cytoplasm.

**Exocytosis — releasing material out.**

A vesicle inside the cell moves to the plasma membrane, the two membranes fuse, and the contents are released to the exterior. The vesicle's membrane becomes part of the plasma membrane — a one-way merger that's the source of much of the lipid added to the cell surface as the cell grows.

- **Insulin release** from pancreatic $\\beta$-cells. The $\\beta$-cell senses blood glucose via GLUT2 uptake → glycolysis → ATP rise → closure of ATP-sensitive $K^+$ channels → depolarization → opening of voltage-gated $Ca^{2+}$ channels → $Ca^{2+}$ influx → fusion of insulin-containing vesicles with the plasma membrane → insulin into the blood. Each step is a coupled transport or signaling event.
- **Neurotransmitter release** at synapses. An action potential reaches the axon terminal; voltage-gated $Ca^{2+}$ channels open; $Ca^{2+}$ floods in; vesicles containing neurotransmitter fuse with the membrane at specific docking sites; neurotransmitter is released into the synaptic cleft, where it binds receptors on the post-synaptic neuron. This is the basic event of nervous-system signaling. It takes about 100 microseconds.
- **Digestive enzyme release** by pancreatic acinar cells.
- **Mucus secretion** by airway goblet cells.

**SNAREs do the actual fusing.** The **SNARE** protein family ("Soluble NSF Attachment protein Receptors") mediates membrane fusion. A **v-SNARE** on the vesicle and a **t-SNARE** on the target membrane pair up like a zipper, drawing the membranes together until they merge. Different SNARE pairs are used for different fusion events, providing specificity (the vesicle goes where its SNAREs match).

**SNAREs as drug targets.**

- **Botulinum toxin** (produced by *Clostridium botulinum*) is a protease that cleaves SNAREs in motor-neuron axon terminals. Without functional SNAREs, acetylcholine vesicles can't fuse with the membrane, neuromuscular transmission fails, and the result is flaccid paralysis (botulism). It's the most acutely toxic substance known by weight — but in tiny doses, the same chemistry that paralyzes whole bodies can selectively relax specific muscles, which is the basis of cosmetic Botox (smoothing facial wrinkles) and therapeutic uses (treating muscle spasms, migraine, hyperhidrosis).
- **Tetanus toxin** is a related protease that cleaves SNAREs but specifically in inhibitory neurons in the central nervous system. Without inhibition, motor neurons fire continuously, producing the spastic paralysis (rigid muscles) of tetanus.

**The lipid budget of exocytosis and endocytosis must balance.** A neuron firing rapidly releases many vesicles by exocytosis — adding their membrane to the plasma membrane. If it didn't take some back in by endocytosis, the cell surface would expand indefinitely. In practice, vesicle membrane is recycled by endocytosis at roughly the rate of exocytosis, often at specialized sites near the active synapse.

**mRNA vaccines exploit endocytosis.** The COVID mRNA vaccines (Pfizer/BioNTech, Moderna) package the mRNA in **lipid nanoparticles** (LNPs). The LNPs are taken up by cells via endocytosis. Inside the endosome, the LNP lipids destabilize the endosomal membrane, releasing the mRNA into the cytoplasm where ribosomes translate it into the SARS-CoV-2 spike protein. The cell then displays spike fragments on MHC molecules and is recognized by the immune system, generating immunity. The entire route is a textbook tour of endocytosis: lipid uptake, endosomal acidification, escape, translation by the cell's own machinery.`,
      video: {
        url: 'https://www.youtube.com/watch?v=qBRFIMcxZNM',
        title: 'CrashCourse Biology — Endocytosis and exocytosis',
        provider: 'CrashCourse',
      },
    },
    {
      code: '2.9',
      title: 'Cellular compartmentalization',
      content:
`Eukaryotic cells solve a chemistry problem that prokaryotes cannot. Many biological reactions are mutually incompatible: you can't run acidic digestion and basic enzymatic catalysis in the same compartment; you can't have $Ca^{2+}$ both as a stored reservoir and as a low-concentration signal in the same place; you can't have raw mRNA translated by ribosomes the moment it's transcribed without time for processing. **Compartmentalization** — separating these incompatible chemistries into distinct, membrane-bound organelles — is the structural feature that lets eukaryotes do everything they do.

**Six concrete examples of why compartmentalization matters.**

1. **Lysosomal digestion at pH 4.5.** Lysosomal proteases, nucleases, and lipases work best at acidic pH and would damage the cytoplasm if released into it. The lysosomal membrane keeps the acidic contents contained, and the lysosomal $H^+$ ATPase actively pumps protons in to maintain low pH. **Lysosomal storage diseases** (Tay-Sachs disease, where a missing enzyme lets gangliosides accumulate; Gaucher disease, where glucocerebroside accumulates) demonstrate what happens when a single hydrolase is missing — undigested substrate builds up in the lysosome, eventually killing the cell.
2. **Peroxisomal handling of $H_2O_2$.** Many reactions in fatty-acid oxidation produce hydrogen peroxide, which would otherwise damage other cellular components. Peroxisomes contain those reactions plus **catalase**, which decomposes $H_2O_2$ into water and oxygen:
   $$2H_2O_2 \\;\\to\\; 2H_2O + O_2$$
3. **Calcium signaling.** Cytoplasmic $[Ca^{2+}]$ is kept very low — about $0.1\\,\\mu M$ — by pumps in the ER membrane and plasma membrane. ER lumen $[Ca^{2+}]$ is high (millimolar). Open an ER calcium channel and cytoplasmic $[Ca^{2+}]$ shoots up by a factor of ~$10^4$, generating a sharp, easily detected signal. This is the trigger for muscle contraction, neurotransmitter release, T-cell activation, sperm activation at fertilization, and many other rapid responses.
4. **Mitochondrial chemiosmosis.** Mitochondria maintain a proton gradient across the inner membrane (~$pH\\,7$ inside the matrix, ~$pH\\,7.4$ in the intermembrane space) plus an electrical gradient (matrix slightly negative). This **proton-motive force** stores the energy from electron transport. Protons flowing back through ATP synthase drive ATP synthesis. Without the inner-membrane compartment to maintain the gradient, the energy would simply dissipate.
5. **Chloroplast chemiosmosis.** Same trick, different organelle. Light reactions of photosynthesis pump $H^+$ into the thylakoid lumen; the gradient drives ATP synthase to make ATP for the Calvin cycle in the stroma. Without the thylakoid compartment, no photosynthetic ATP.
6. **mRNA processing in the nucleus.** Eukaryotic genes have **introns** that must be removed before the mRNA can be translated. By separating transcription (in the nucleus) from translation (in the cytoplasm), the cell creates time and space for splicing, 5' capping, 3' polyadenylation, and quality control before mRNA reaches a ribosome. In prokaryotes, transcription and translation happen simultaneously and in the same compartment, which is why prokaryotic genes don't have introns.

**Protein sorting — how the cell delivers each protein to the right place.**

Imagine the chaos that would result if ribosomes simply released proteins into the cytoplasm: mitochondrial proteins, lysosomal enzymes, secreted hormones, nuclear transcription factors, and plasma-membrane channels would all sit together. The cell solves this by tagging each protein with a **sorting signal** — usually a short stretch of amino acids — that directs it to its destination.

- **N-terminal ER signal sequence.** As soon as the signal sequence emerges from the ribosome, it binds a signal recognition particle (SRP) that brings the whole ribosome to a docking complex on the rough ER membrane. The growing polypeptide threads directly into the ER lumen as it's being translated.
- **Mitochondrial targeting sequence.** N-terminal positively charged sequence directs the protein to the mitochondrial import machinery, where it's threaded across both membranes into the matrix and the signal is cleaved off.
- **Nuclear localization signal (NLS).** Short positively charged sequence anywhere in the protein, recognized by **importin**, which carries the protein through nuclear pores.
- **Peroxisomal targeting signal (PTS1).** C-terminal three-amino-acid sequence (often $-SKL$).
- **No signal at all** → the protein stays in the cytoplasm.

These signals act like postal addresses. Mistakes — a misplaced signal, a missing receptor — produce disease. Some forms of **primary ciliary dyskinesia** result from misrouted cilia proteins; some lysosomal storage disorders result from lysosomal enzymes mistakenly secreted; **Alzheimer's disease** involves misfolded amyloid-$\\beta$ proteins that aggregate where they shouldn't.

**The endomembrane system as a logistics network.**

The cell isn't just a collection of organelles sitting in space; it has a delivery network connecting them. The **endomembrane system** includes:

- Nuclear envelope (continuous with the ER)
- Endoplasmic reticulum (sites of protein and lipid synthesis)
- Golgi apparatus (modification and sorting hub)
- Vesicles (the delivery trucks)
- Endosomes (the receiving docks for incoming material)
- Lysosomes (the recycling/disposal center)
- Plasma membrane (the city limits)

A typical secretory protein's journey: synthesized on the rough ER → folded and modified in the ER lumen → packaged into a vesicle that buds off the ER → fuses with the cis-Golgi → traverses Golgi stacks (additional modifications added) → leaves the trans-Golgi in a different vesicle → fuses with the plasma membrane (exocytosis) → released outside. Every step is mediated by specific small GTPases (Rab proteins), specific tethering factors, and specific SNAREs. The route is highly reproducible.

**The cell as a city.** Each organelle is a specialized district. The nucleus is the city hall (where all the records are kept and policy is set). The ER is the manufacturing zone (proteins and lipids made here). The Golgi is the central post office (sorting and distribution). The lysosome is the recycling plant. The mitochondria are the power stations. The cytoskeleton is the road network. Vesicles are the trucks. The plasma membrane is the city wall. Just as a city without zoning would collapse into chaos, a cell without compartmentalization would. The whole organization is one of the most elegant solutions in biology — and one of the most exam-relevant facts of Unit 2.`,
      video: {
        url: 'https://www.youtube.com/watch?v=cj8dDTHGJBY',
        title: 'CrashCourse Biology — Eukaryotic compartments',
        provider: 'CrashCourse',
      },
    },
    {
      code: '2.10',
      title: 'Origins of cell compartmentalization (endosymbiosis)',
      content:
`Mitochondria and chloroplasts have a startling property: they look and behave more like bacteria than like other parts of a eukaryotic cell. They have their own DNA. They have their own ribosomes — the bacterial-sized 70S kind. They divide on their own. They're sensitive to antibiotics that target bacteria. They have double membranes whose inner layer resembles a bacterial membrane. They are not built fresh by the cell; instead, every mitochondrion and chloroplast inherits its lineage from a pre-existing mitochondrion or chloroplast.

The simplest explanation for all of this is the **endosymbiotic theory**: mitochondria and chloroplasts were once free-living bacteria that were engulfed by a host cell and, instead of being digested, became permanent residents. Lynn Margulis proposed this in 1967 to widespread skepticism; by the 1980s the molecular evidence had become overwhelming, and it's now textbook biology.

**The two events.**

- **The mitochondrial event** (~2 billion years ago, give or take). An ancestral eukaryote — probably an archaeon — engulfed an **$\\alpha$-proteobacterium**. The bacterium was capable of aerobic respiration; the host was not. Rather than being digested, the bacterium persisted inside the host. Over evolutionary time, the partnership tightened: the bacterium became dependent on the host for various supplies; the host became dependent on the bacterium for efficient ATP production from oxygen. The bacterium transferred most of its genes to the host nucleus, leaving only a tiny remnant genome (~16,500 base pairs in the human mitochondrion, encoding 37 genes). The result was the **mitochondrion** we know today.
- **The chloroplast event** (~1.5 billion years ago). Within the lineage that had already acquired mitochondria, a member engulfed a **cyanobacterium** — a photosynthetic prokaryote. Same story: the engulfed cell wasn't digested, became permanent, transferred most of its genes to the host. The result was the **chloroplast**, present today in plants and algae and granting them the ability to do photosynthesis. (Some lineages of algae acquired chloroplasts through *secondary* endosymbiosis — they engulfed a eukaryote that already had a chloroplast — leaving behind organelles surrounded by three or four membranes rather than two.)

**The lines of evidence.** Each is, on its own, suggestive; together they form a closed case.

1. **Bacterial-style circular DNA.** Mitochondria and chloroplasts have small circular chromosomes, completely unlike the large linear chromosomes of the eukaryotic nucleus but very much like the chromosomes of free-living bacteria.
2. **70S bacterial ribosomes.** Mitochondrial and chloroplast ribosomes are the same size as bacterial ribosomes (70S), not the 80S size of cytoplasmic eukaryotic ribosomes.
3. **Double membranes.** The outer membrane likely came from the original host cell's plasma membrane (where the bacterium was engulfed); the inner membrane is the original bacterial plasma membrane. The inner membrane retains bacterial-style lipid composition — **cardiolipin** is found in mitochondrial inner membrane and in bacteria but not elsewhere in the eukaryotic cell.
4. **Binary fission.** Mitochondria and chloroplasts divide on their own, by binary fission. They do not assemble fresh from cellular components; every one descends from a pre-existing one. This is also exactly how bacteria reproduce.
5. **Maternal inheritance.** Because mitochondria come from the cytoplasm — and almost all of the cytoplasm of a zygote comes from the egg, not the sperm — mitochondrial DNA is inherited from the mother only. This pattern is used to trace human ancestry; "**mitochondrial Eve**," the most recent common matrilineal ancestor of all living humans, is dated to about 200,000 years ago.
6. **Antibiotic sensitivity.** Antibiotics that target bacterial ribosomes (chloramphenicol, streptomycin, tetracycline at high doses) also affect mitochondria. This is why some antibiotics have characteristic side effects: chloramphenicol can cause bone marrow suppression in part because it disrupts mitochondrial protein synthesis in fast-dividing cells.
7. **Sequence similarity.** Mitochondrial genes match $\\alpha$-proteobacterial sequences more closely than they match anything else in the eukaryotic genome. Chloroplast genes match cyanobacterial sequences.
8. **Gene transfer history.** Many genes originally bacterial are now in the host nucleus, but they still produce proteins that have to be re-imported into the organelle. The import machinery on the organelle's surface evolved to receive its own former genes back.

**The energetic argument for why endosymbiosis was decisive.** Eukaryotic cells are larger than prokaryotic cells. Larger cells have much more genome to maintain, much more cytoplasm to power, more elaborate cytoskeleton to fuel. Why didn't prokaryotes just get big? Lane and Martin (2010) argued: because the ATP-generating machinery in prokaryotes is on the plasma membrane, and the plasma membrane surface area limits how much ATP a cell can make per genome. The only way to have a big cell with enough ATP to maintain a big genome is to distribute the ATP-making machinery onto many internal membranes — i.e., have mitochondria. Endosymbiosis is what made the energetic budget for eukaryotic complexity possible.

**Modern endosymbiosis is still happening.** Endosymbiotic relationships continue to form today, ranging from loose to deeply integrated.

- **Corals and zooxanthellae.** Photosynthetic dinoflagellates live inside coral polyps, providing sugars in exchange for $CO_2$ and shelter. The coral expels the zooxanthellae under heat stress, producing **bleaching**.
- **Termites and gut microbes** that digest cellulose — termites alone cannot break down wood.
- **Aphids and Buchnera bacteria.** The bacteria, housed inside specialized aphid cells, synthesize essential amino acids the aphid cannot. Buchnera's genome has shrunk to under 1 megabase, and it cannot live outside the aphid.
- **Lichen** is a partnership between a fungus (provides structure and water retention) and a photosynthetic partner (cyanobacterium or alga; provides sugars).

**Why this all matters.** Endosymbiosis is not just a piece of cellular history — it shows that **evolutionary innovation by partnership** is a real and ongoing process, not only by mutation and selection of single lineages. Many of the most striking jumps in biological complexity (eukaryote cells, plant cells, the symbiotic fixed-nitrogen system in legumes) involve previously independent organisms merging into something neither could have been alone. It's also, incidentally, one of the few topics in biology where a major Nobel-deserving insight came from a researcher (Margulis) who was initially considered fringe and was right anyway.`,
      video: {
        url: 'https://www.youtube.com/watch?v=NX-FsHk6yj8',
        title: 'Bozeman Science — Endosymbiotic theory',
        provider: 'Bozeman Science',
      },
    },
    {
      code: '2.11',
      title: 'Cellular size, surface area, and biology at every scale',
      content:
`The SA:V principle we met in 2.2 doesn't stop at the cell. The same physics — that surface scales as length squared while volume scales as length cubed — shows up in animal metabolism, in tissue architecture, in nanomaterials engineering, and in the ecology of how organisms partition energy. Pulling the threads together makes the AP exam questions on this topic much easier to answer because every "explain why" question reduces to the same physical fact.

**Why small organisms have fast metabolisms — Kleiber's law.**

If you plot metabolic rate against body mass for organisms ranging from bacteria to whales, you get a remarkably tidy relationship across 20 orders of magnitude of mass:

$$B \\,\\propto\\, M^{3/4}$$

This is **Kleiber's law**. Metabolic rate scales not as mass itself, not as surface area, but as mass to the $\\tfrac{3}{4}$ power. The exact value of $\\tfrac{3}{4}$ is still debated, but the qualitative point — metabolic rate per gram falls as mass rises — is robust. A shrew with 5 grams of mass uses roughly $10\\times$ more energy per gram per day than a 100,000 g elephant. The shrew has to eat 80–90% of its body weight in food per day to keep up; the elephant gets by on ~5%.

The reasons connect back to SA:V. Small animals have high SA:V, so they lose heat fast and need high metabolism to stay warm. They also have high transport surface relative to volume, so they *can* deliver fuel and oxygen at high rates. Large animals have low SA:V, lose heat slowly, and have to ration energy use because they can't deliver fuel through their relatively small surfaces fast enough.

**Why specialized cells take unusual shapes.**

Whenever a cell needs more surface area than a sphere can provide, evolution has bent the geometry:

- **Red blood cells** are biconcave disks. The biconcave shape gives 20–30% more surface area than a sphere of the same volume, helping gas exchange. The flexibility lets RBCs squeeze through capillaries narrower than the RBC's resting diameter.
- **Neurons** have long thin axons. The cell body is small (so SA:V locally is reasonable), but the axon extends to where signals need to go — from a motor neuron's cell body in the spinal cord to a muscle fiber in the foot, a meter away. The thin diameter limits the *volume* that has to be supported, while the long length gives the surface area needed.
- **Skeletal muscle fibers** are long thin cylinders to maximize contractile force per unit volume.
- **Intestinal epithelial cells** have **microvilli** packed on their apical surface — each cell has ~3,000 microvilli, each ~1 $\\mu m$ tall, multiplying absorptive surface ~25 fold. Combined with **villi** at the tissue scale and **plicae** at the organ scale, the total absorptive surface of the small intestine is ~250 $m^2$ — the size of a tennis court — in a few liters of volume.
- **Lung alveoli** at the tissue scale provide ~70 $m^2$ of gas-exchange surface in adult human lungs.
- **Brain wrinkling** packs much more cortical surface area into the same skull volume. Animals with smooth brains (e.g., rodents, rabbits) have lower cortex-to-volume ratios than humans or dolphins; this correlates with cognitive complexity.
- **Plant roots** branch elaborately to maximize soil contact for water and nutrient uptake.

**Why marine mammals are well insulated.** They need to retain heat in cold water. Their SA:V is low (large, roundish bodies); their **blubber** (thick fat layer) further reduces heat loss. Whales, seals, walruses all share this pattern. Compare to small mammals like Arctic shrews, which can't reduce SA:V much and instead compensate with high metabolic rate, dense fur, and ferocious feeding.

**Why eggs are big — and why they get away with it.** Bird eggs are some of the largest single cells. The ostrich egg can be ~15 cm long and weigh ~1.5 kg. Eggs are huge because they store all the nutrients an embryo will need until it hatches; the yolk is essentially preloaded macromolecular fuel. But the *active* cytoplasm is small, the metabolic rate is very low, and after fertilization the cell undergoes rapid cleavage divisions — within hours, the egg has divided into thousands of smaller cells with normal SA:V. The egg cheats the SA:V rule by being mostly inactive storage; the chick that develops doesn't cheat at all.

**Implications for materials science and medicine.**

- **Drug nanoparticles.** Many modern drug delivery systems are based on small particles (~100 nm). At that size, SA:V is very high, so the particles dissolve quickly and present a lot of drug to surrounding cells. Lipid nanoparticles for mRNA vaccines, polymeric nanoparticles for chemotherapy, gold nanoparticles for imaging all rely on this.
- **Catalysts.** Industrial catalysts (platinum on car catalytic converters, palladium for hydrogenation) are designed as porous nanostructures with enormous internal SA so that more catalyst-surface atoms are exposed to reactant. The SA:V principle is the engineering target.
- **Battery electrodes.** Higher surface area → higher current density. Silicon nanowires, carbon nanotubes, and graphene anodes are all attempts to maximize SA:V.
- **Membrane bioreactors.** Same principle for cells grown in industry — more surface area per cell means more product per liter of reactor volume.

**The exam takeaway.** When you see a question about cell size, metabolism, or membrane folding, the answer almost always boils down to SA:V. When you see one about why animals have certain shapes, or why drugs are made small, same principle. The physics of $L^2$ vs $L^3$ is one of the most generative ideas in biology, and one of the easiest to apply once you internalize it.`,
      video: {
        url: 'https://www.youtube.com/watch?v=2HfLwm6oRsg',
        title: 'Bozeman Science — SA:V and cellular size',
        provider: 'Bozeman Science',
      },
    },
  ],
  keyConcepts: [
    'All cells share four features: membrane, cytoplasm, ribosomes, genetic material. Eukaryotes additionally have membrane-bound nucleus and organelles.',
    'SA:V $= 3/r$ for a sphere — drops linearly as cells grow. Cells stay small, divide, or fold their surfaces.',
    'Plasma membrane = fluid mosaic. Phospholipid bilayer (~50%), proteins (~40%), cholesterol (~10%), carbohydrates on outer face.',
    'Membrane permeability scales with size, polarity, charge, and lipid solubility. Small nonpolar = free; polar = needs help; charged = always needs a protein.',
    'Passive transport (no ATP): simple diffusion, facilitated diffusion (channels and carriers), osmosis. Active transport (ATP) is primary (direct ATP) or secondary (uses a gradient).',
    '$Na^+/K^+$ pump moves 3 $Na^+$ out + 2 $K^+$ in per ATP; uses ~25% of resting metabolism; basis of membrane potential.',
    'Tonicity: hypertonic shrinks cells (or plasmolyzes plant cells); hypotonic swells/lyses animal cells, turgid plant cells; isotonic = no net flow.',
    'Endocytosis (in via vesicle: phagocytosis, pinocytosis, receptor-mediated). Exocytosis (out via vesicle). Both require ATP; both rely on SNARE-mediated membrane fusion.',
    'Compartmentalization separates incompatible chemistries (acidic lysosome vs. neutral cytoplasm; high vs. low $Ca^{2+}$). Enables eukaryotic complexity.',
    'Protein sorting via short address-tag sequences (ER signal, nuclear localization signal, mitochondrial targeting sequence) gets each protein to its destination.',
    'Endosymbiotic theory: mitochondria (from $\\alpha$-proteobacteria, ~2 Ga) and chloroplasts (from cyanobacteria, ~1.5 Ga) were once free-living bacteria. Evidence: own circular DNA, 70S ribosomes, double membrane, binary fission, maternal inheritance, antibiotic sensitivity.',
  ],
  formulas: [
    {
      name: 'SA:V (sphere)',
      equation: '$SA = 4\\pi r^2;\\; V = \\tfrac{4}{3}\\pi r^3;\\; SA/V = 3/r$',
      meaning: 'Inversely proportional to radius. Doubling $r$ halves SA:V. The fundamental limit on cell size.',
      example: 'A 1-$\\mu m$ bacterium has SA:V = 3 $\\mu m^{-1}$. A 10-$\\mu m$ animal cell has SA:V = 0.3 $\\mu m^{-1}$. Ten-fold size, ten-fold reduction in surface per unit volume.',
    },
    {
      name: '$Na^+/K^+$ pump stoichiometry',
      equation: '$3\\,Na^+_{out} + 2\\,K^+_{in}$ per ATP',
      meaning: 'Net charge: $+1$ moves out per cycle. Pump is electrogenic. Maintains the gradients that power nerve impulses, muscle contraction, and secondary active transport.',
      example: 'Block the pump with ouabain and the cell rapidly loses membrane potential, swells from $Na^+$ influx, and dies.',
    },
    {
      name: 'Osmotic pressure',
      equation: '$\\Pi = iMRT$',
      meaning: '$i$ is the van \'t Hoff factor (particles per formula unit); $M$ is molarity; $RT$ is the usual gas-law term. NaCl gives nearly double the pressure of glucose at the same molarity ($i = 2$).',
      example: 'A 0.3 osm/L solution at body temperature ($T = 310\\,K$) has $\\Pi \\approx 7.7$ atm — about the pressure inside a car tire.',
    },
    {
      name: "Kleiber's law (organism metabolism)",
      equation: '$B \\propto M^{3/4}$',
      meaning: 'Whole-animal metabolic rate scales as mass to the $\\tfrac{3}{4}$ power across ~20 orders of magnitude. Per-gram rate falls as size rises.',
      example: 'A shrew uses ~10× more energy per gram than an elephant, so shrews must eat near-constantly while elephants can eat ~5% of body weight per day.',
    },
  ],
  practice: [
    {
      q: 'A spherical cell increases its radius from 5 $\\mu m$ to 10 $\\mu m$. How does its SA:V ratio change, and what biological problem does this cause?',
      a: 'Surface area grows $4\\times$ ($r^2$); volume grows $8\\times$ ($r^3$); SA:V halves (drops from 0.6 to 0.3 $\\mu m^{-1}$). The cell\'s surface can no longer keep up with supplying the now-larger interior — diffusion is slower, wastes accumulate faster. The cell must divide or develop folded surfaces (microvilli, cristae) to compensate.',
    },
    {
      q: 'A red blood cell is placed in distilled water. Predict what happens at the cellular level and explain the underlying physics.',
      a: 'The cell lyses (bursts). Distilled water has essentially zero solute, so water potential outside is higher than inside the cell. Water flows down its potential gradient into the cell through aquaporins. Animal cells lack a rigid wall to resist swelling; once the membrane stretches past its mechanical limit, it ruptures.',
    },
    {
      q: 'Why are mitochondria thought to have descended from bacteria? List the major lines of evidence.',
      a: '(1) Own circular DNA, bacterial in structure. (2) 70S ribosomes, the bacterial size. (3) Double membrane with bacterial-style inner lipids (e.g., cardiolipin). (4) Divide by binary fission. (5) Maternally inherited (came from the egg cytoplasm). (6) Sensitive to antibiotics that target bacterial ribosomes. (7) Sequence similarity to $\\alpha$-proteobacteria specifically. Each line alone is suggestive; together they form a closed case.',
    },
    {
      q: 'Why does drinking seawater dehydrate you rather than hydrate you?',
      a: 'Seawater is ~3.5% salt; human blood is ~0.9% salt; the maximum salt concentration the kidney can produce is ~1%. To excrete the salt from 1 L of seawater, the body must produce ~3.5 L of urine — losing more water than the seawater provided. Net result is dehydration.',
    },
    {
      q: 'Botulinum toxin works by cleaving SNARE proteins in motor-neuron axon terminals. What is the physiological consequence, and why?',
      a: 'Flaccid paralysis. SNAREs are required for the fusion of acetylcholine-containing vesicles with the presynaptic membrane. Without functional SNAREs, no acetylcholine is released into the neuromuscular junction; muscle fibers receive no signal to contract; muscles go limp. This is the mechanism of botulism (food poisoning) and the basis of therapeutic Botox (selective muscle relaxation).',
    },
    {
      q: 'A cell relies on the $Na^+/K^+$ pump to maintain its membrane potential. If you completely block the pump with ouabain, predict the sequence of consequences over the next few hours.',
      a: 'Initially, the membrane potential decays as $Na^+$ leaks in and $K^+$ leaks out (the gradients dissipate). The cell starts taking up water osmotically because intracellular ion concentration changes. Without the gradient, secondary active transport (e.g., SGLT-mediated glucose uptake in intestinal cells) fails, so the cell starves. ATP-dependent processes still run for a while, but eventually the cell swells, the membrane stretches and ruptures, and the cell lyses.',
    },
  ],
  pitfalls: [
    '"Osmosis is active transport" — wrong. Osmosis is passive: water moves down its own water-potential gradient.',
    '"Plant cells in hypertonic solution are fine because they have a cell wall" — wrong. They undergo **plasmolysis** (cytoplasm shrinks away from the wall) and can die. The wall protects against hypotonic stress, not hypertonic.',
    '"The phospholipid bilayer is impermeable" — selectively permeable. Small nonpolar molecules ($O_2$, $CO_2$, steroid hormones) cross freely.',
    '"All endocytosis is phagocytosis" — phagocytosis is one type; others are pinocytosis (non-specific fluid uptake) and receptor-mediated endocytosis (specific, uses clathrin).',
    '"Mitochondrial DNA is inherited from both parents" — almost always maternal. The cytoplasm of the zygote comes overwhelmingly from the egg.',
    '"Channels and carriers do the same thing the same way" — they don\'t. Channels are open pores (fast, can\'t saturate easily); carriers cycle through conformational changes (slower, saturate at $V_{\\max}$).',
    '"$Na^+/K^+$ pump moves equal numbers of each ion" — wrong; it moves 3 $Na^+$ out for every 2 $K^+$ in. The pump is electrogenic (net charge moves) and the asymmetric stoichiometry contributes to the membrane potential.',
    '"Endosymbiosis was a one-time event in the deep past" — endosymbiosis is ongoing (corals + zooxanthellae, aphids + Buchnera, termites + gut bacteria, lichens). The deep events that produced mitochondria and chloroplasts are just the most dramatic examples.',
  ],
};
