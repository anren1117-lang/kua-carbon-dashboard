// AP Biology Unit 3 — Cellular Energetics (12-16% of exam)
// APES-standard depth. Math typeset with LaTeX via $...$ delimiters.

export const APBIO_UNIT_3 = {
  number: 3,
  title: 'Cellular Energetics',
  weight: '12-16%',
  subunits: [
    {
      code: '3.1',
      title: 'Enzyme structure',
      content:
`Life runs on chemical reactions that, left to themselves, are far too slow to be useful. Catalysts speed reactions without being consumed in them. The catalysts that biology uses are almost all **proteins** — and the small number that are not are catalytic RNA molecules (**ribozymes**), most famously the ribosome itself, where the peptide-bond-forming step is catalyzed by RNA. Either way, the working principle is the same: a precisely shaped molecule binds reactants, holds them in the right geometry, and lowers the energy barrier the reaction must climb. We call these catalysts **enzymes**, and they are the reason reactions which would take centuries at room temperature happen in milliseconds inside a cell.

**How big a difference do enzymes make?** Enormous. Comparing the rate of an enzyme-catalyzed reaction with the same reaction in plain solution, the speedup ranges from $10^6$ at the low end to $10^{17}$ for the fastest enzymes. **Orotidine 5'-phosphate decarboxylase** speeds a reaction by a factor of $\\sim 10^{17}$ — meaning a reaction that would naturally take 78 million years to occur happens in about 18 milliseconds in the active site. The reactions of life simply cannot proceed at meaningful rates without enzymes.

**Enzymes lower activation energy, not $\\Delta G$.** Every reaction that proceeds spontaneously has a negative change in Gibbs free energy ($\\Delta G < 0$). But "spontaneous" says nothing about *how fast*. To go from reactants to products, molecules have to climb through a high-energy intermediate called the **transition state**; the energy required to reach it is the **activation energy** ($E_a$). Even a strongly exergonic reaction will be slow if $E_a$ is high. Enzymes lower $E_a$. They do not change $\\Delta G$ (the difference in energy between reactants and products is set by chemistry, not the catalyst), but they make the barrier easier to climb. Picture a mountain pass between two valleys: the height difference is fixed ($\\Delta G$), but the enzyme is a tunnel through the pass ($E_a$).

**The active site.** Each enzyme has a specific pocket called the **active site** — a 3D depression made of perhaps 5–10 amino acid side chains. The arrangement of those side chains is precise enough to:

- bind the specific substrate (and reject others);
- orient the substrate exactly as the reaction requires;
- supply chemistry (proton donors, electrophiles, metal cofactors) at the right place and time;
- stabilize the transition state.

Shape and chemistry come together — neither alone is enough. **Trypsin** is a protease that cleaves protein chains after lysine or arginine; its active site has a deep negatively charged pocket that binds Lys/Arg side chains, plus a "catalytic triad" of serine, histidine, and aspartate that hydrolyzes the peptide bond. **Lysozyme** in saliva and tears breaks bonds in bacterial cell walls; its site is shaped to fit a six-sugar fragment of peptidoglycan. **Hexokinase** binds glucose and ATP and produces glucose-6-phosphate.

**Lock-and-key and induced fit.** The earliest model (Fischer, 1894) compared the enzyme to a lock and the substrate to a key — only the right key fits. This captures specificity but is static. The **induced-fit** model (Koshland, 1958) is closer to reality: the substrate binds first to a roughly complementary site, then the enzyme conformation **changes** around the substrate, tightening the fit and aligning the catalytic groups. The active site is not rigid; it remodels itself. Hexokinase undergoes a dramatic hinge motion when glucose binds — its two domains close around glucose like jaws around a ball.

**The four levels of protein structure recap.**

- **Primary structure**: the linear amino-acid sequence.
- **Secondary structure**: local folds — $\\alpha$-helices and $\\beta$-sheets — stabilized by backbone hydrogen bonds.
- **Tertiary structure**: overall 3D fold of a single polypeptide; side-chain interactions (H-bonds, hydrophobic packing, salt bridges, disulfide bridges).
- **Quaternary structure**: assembly of multiple subunits (hemoglobin = 4 subunits; ATP synthase = $\\sim 20$).

A single amino-acid substitution at the right place can destroy enzyme activity — even far from the active site, if it disrupts the fold. **Sickle-cell hemoglobin** is the textbook example: a Glu-to-Val change at position 6 in $\\beta$-globin distorts the surface enough to make deoxygenated hemoglobin polymerize.

**Cofactors and coenzymes.** Many enzymes need helpers. **Cofactors** are typically inorganic ions — $Mg^{2+}$ for most kinases, $Zn^{2+}$ for carbonic anhydrase, $Fe^{2+}/Fe^{3+}$ in cytochromes, $Cu^{2+}$ in cytochrome oxidase. **Coenzymes** are small organic molecules, often vitamin-derived:

- **NAD$^+$** (from niacin, B$_3$) — accepts a hydride in oxidations; becomes NADH.
- **NADP$^+$** — like NAD$^+$ but used in biosynthesis and photosynthesis.
- **FAD** (from riboflavin, B$_2$) — accepts two electrons + two protons; becomes FADH$_2$.
- **Coenzyme A** (from pantothenic acid, B$_5$) — carries acyl groups (notably acetyl-CoA).
- **Biotin** (B$_7$) — carries carboxyl groups.
- **Pyridoxal phosphate** (B$_6$) — central in amino acid metabolism.
- **Thiamine pyrophosphate** (B$_1$) — pyruvate decarboxylation, transketolase.

Vitamin deficiencies cause specific disorders: B$_1$ → beriberi; B$_3$ → pellagra; B$_{12}$ → pernicious anemia. The specific symptoms reflect the specific enzymes that can no longer work.

**Naming convention.** Most enzymes end in **-ase** and describe what they act on or do: **sucrase** cleaves sucrose; **lipase** breaks down lipids; **DNA polymerase** polymerizes DNA; **kinase** transfers a phosphate (from ATP); **phosphatase** removes one. Older names lack -ase: **pepsin**, **trypsin**, **chymotrypsin**, **ptyalin**. When you see a new enzyme name on the exam, parse it: -ase = enzyme, prefix = substrate or reaction.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ok9esggzN18',
        title: 'CrashCourse Biology — ATP and Enzymes',
        provider: 'CrashCourse',
      },
    },
    {
      code: '3.2',
      title: 'Enzyme catalysis',
      content:
`The basic catalytic cycle:

$$E + S \\;\\rightleftharpoons\\; ES \\;\\rightleftharpoons\\; EP \\;\\rightleftharpoons\\; E + P$$

The enzyme binds substrate to form the enzyme-substrate complex ($ES$); the reaction is catalyzed; the product complex ($EP$) releases product; the enzyme is regenerated, ready for another round. Each step is reversible, but the cell drives the reaction forward by maintaining high substrate and low product.

**What the enzyme actually does in the active site — five overlapping strategies.**

1. **Substrate orientation and proximity.** In bulk solution, two molecules have to find each other in the right geometry by chance. The active site binds both substrates in the right alignment, with reactive parts juxtaposed. Effective concentration at the active site can be $10^7$-fold higher than in solution. Hexokinase orients ATP so its terminal phosphate is right next to glucose's C6 hydroxyl.
2. **Substrate strain.** The enzyme binds the substrate in a way that twists it toward the transition-state geometry. Lysozyme distorts one of its sugar substrate rings out of its usual chair shape toward a planar transition state — pre-paying part of the activation energy.
3. **Acid-base catalysis.** Side chains donate or accept protons during the reaction. **Histidine** is the all-purpose acid-base catalyst because its imidazole ring has $pK_a \\approx 6$ — close to physiological pH 7.4 — so it can be either protonated or deprotonated. About half of all enzymes use histidine somewhere.
4. **Covalent catalysis.** The enzyme briefly forms a covalent bond with the substrate, creating an intermediate the reaction can travel through more easily. Serine proteases (chymotrypsin, trypsin) use a covalent acyl-enzyme intermediate.
5. **Transition-state stabilization.** The deepest principle. The enzyme binds the *transition state* more tightly than the substrate or product, lowering the height of the energy barrier. Pharmacologists exploit this by designing **transition-state analogs** as highly potent enzyme inhibitors.

**Michaelis-Menten kinetics — quantifying enzyme behavior.**

Plot reaction rate $v$ vs. substrate concentration $[S]$ and you get a curve that rises steeply at low $[S]$, then plateaus at a maximum $V_{\\max}$:

$$v \\,=\\, \\frac{V_{\\max}\\,[S]}{K_m + [S]}$$

- **$V_{\\max}$** is the rate when every enzyme molecule is constantly busy. Scales with enzyme concentration.
- **$K_m$** is the substrate concentration at which the rate is half-maximal. **Low $K_m$** = high substrate affinity (saturated at low $[S]$); **high $K_m$** = low affinity.
- **Turnover number** $k_{cat} = V_{\\max}/[E_{total}]$ tells you how many substrate molecules each enzyme converts per second when saturated. **Carbonic anhydrase** converts $\\sim 10^6$ $CO_2$ molecules per second per enzyme — among the fastest known.

**Why $K_m$ matters physiologically.** **Hexokinase** in muscle has $K_m \\approx 0.1\\,mM$ — far below normal blood glucose ($\\sim 5\\,mM$). It's essentially saturated all the time; muscle takes up glucose whenever available. **Glucokinase** in liver has $K_m \\approx 10\\,mM$ — well above normal blood glucose. When you've eaten and blood glucose spikes to $\\sim 10\\,mM$, glucokinase wakes up and the liver starts converting excess glucose to glycogen. The kinetic difference is the basis for division of labor between muscle (constant uptake) and liver (responsive uptake).

**Inhibitors — three flavors.**

- **Competitive inhibitors** bind the active site, competing with substrate. They raise apparent $K_m$ but don't change $V_{\\max}$ (with enough substrate, you can outcompete the inhibitor). **Methanol poisoning** is treated with ethanol because ethanol competes with methanol for **alcohol dehydrogenase**, slowing methanol's conversion to toxic formic acid.
- **Non-competitive (allosteric) inhibitors** bind elsewhere on the enzyme, changing its shape. They lower $V_{\\max}$ without changing $K_m$. Adding more substrate doesn't help.
- **Uncompetitive inhibitors** bind only the $ES$ complex. They lower both $K_m$ and $V_{\\max}$.

**Allosteric regulation.** Many enzymes have a second binding site, the **allosteric site**, where regulator molecules bind to switch the enzyme between active and inactive conformations. **Phosphofructokinase (PFK)**, the rate-limiting enzyme of glycolysis, has allosteric sites for ATP (inhibits — energy is plentiful), citrate (inhibits — downstream backed up), and AMP (activates — energy needed). This is how the cell tells glycolysis to respond to current energy state.

**Feedback inhibition.** The end product of a multi-step pathway inhibits the *first* enzyme. **Isoleucine** binds and inhibits threonine deaminase, the first enzyme of isoleucine biosynthesis from threonine. When isoleucine is abundant, synthesis halts; when isoleucine drops, the enzyme reactivates. Same principle as a thermostat: output controls input. Feedback inhibition is nearly universal in biosynthetic pathways.

**Enzyme regulation as drug targets.** Many of the most important drugs ever invented work by inhibiting specific enzymes.

- **Aspirin** irreversibly acetylates cyclooxygenase (COX), blocking prostaglandin synthesis (pain, fever, inflammation).
- **Statins** competitively inhibit HMG-CoA reductase, the rate-limiting step of cholesterol synthesis.
- **ACE inhibitors** (lisinopril) block angiotensin-converting enzyme, reducing blood pressure.
- **HIV protease inhibitors** block the viral protease required for HIV maturation.
- **Penicillin** acylates the active-site serine of bacterial transpeptidases that cross-link cell walls — bacteria die from osmotic rupture.
- **Sarin and VX nerve agents** irreversibly inhibit acetylcholinesterase; acetylcholine accumulates, muscles spasm, victims die from respiratory failure.

About half of all FDA-approved drugs target an enzyme.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ok9esggzN18',
        title: 'CrashCourse Biology — Enzymes catalyzing reactions',
        provider: 'CrashCourse',
      },
    },
    {
      code: '3.3',
      title: 'Environmental impacts on enzyme function',
      content:
`Enzymes are exquisitely sensitive to environment. The same enzyme that works at 37 °C and pH 7.4 is dead at 80 °C or pH 2. The behavior follows from a single fact: function depends on **3D shape**, and shape is held by relatively weak interactions (hydrogen bonds, ionic interactions, hydrophobic packing) that heat, pH, salt, and other variables easily disturb.

**Temperature.** Two competing effects:

1. **Below the optimum**, raising temperature speeds reactions because molecules collide more often and with more energy. Rule of thumb: **Q$_{10}$ $\\approx 2$** — every 10 °C rise roughly doubles the rate.
2. **Above the optimum**, the enzyme **denatures** — weak interactions break, the protein unfolds, the active site collapses.

The net effect is a bell curve: rate rises with temperature up to the optimum, then drops sharply as denaturation takes over.

**Different organisms tune their enzymes to their environments.**

- **Antarctic fish** ($-2$ to 4 °C). Enzymes are looser, more flexible. Trade-off: less stable.
- **Mesophiles** (most familiar life, 20–40 °C). Humans: optimum 37 °C; most enzymes work from $\\sim 25$ °C to $\\sim 42$ °C.
- **Thermophiles** ($\\sim 50$–80 °C). **Thermus aquaticus** lives in $\\sim 70$ °C water in Yellowstone hot springs. Its DNA polymerase (Taq), discovered in 1976, made PCR possible — you can heat to 95 °C to separate DNA strands without destroying the enzyme.
- **Hyperthermophiles** ($\\sim 80$–122 °C). Deep-sea hydrothermal vents. **Pyrococcus furiosus** thrives at 100 °C; its DNA polymerase (Pfu) is even more stable than Taq. **Strain 121** grows at 121 °C — the temperature used in autoclaves.

Thermophile enzymes have more ionic bonds and tighter hydrophobic cores; psychrophile enzymes have fewer such interactions and are more flexible.

**The danger of fever.** Normal human body temperature is 37 °C. A fever to 39–40 °C is uncomfortable but generally safe. At $\\sim 41$–42 °C, human enzymes start to denature — brain damage and death follow. **Heatstroke** is a medical emergency. Conversely, **therapeutic hypothermia** (cooling to $\\sim 33$ °C) is used after cardiac arrest because slower enzymes mean less ATP demand and less damage from low oxygen.

**pH.** Each enzyme has a characteristic pH optimum where its active site has the right ionization state. Outside the range, side chains gain or lose protons, charges change, hydrogen bonds break.

- **Pepsin** (stomach): pH 1.5–2. At pH 7 it's denatured.
- **Salivary $\\alpha$-amylase**: pH 6.7. Denatured by stomach acid.
- **Pancreatic enzymes** (trypsin, chymotrypsin, lipase): pH 7.8–8.5.
- **Hexokinase** (cytoplasm): pH 7.4.
- **Lysosomal hydrolases**: pH 4.5–5.

The pH-organelle pairing isn't coincidence: each enzyme is delivered to a compartment maintained at its working pH (Unit 2.9 on compartmentalization).

**Substrate concentration.** Follows Michaelis-Menten: linear in $[S]$ at low concentrations, plateauing at $V_{\\max}$ when the enzyme is saturated. In cells, substrate concentrations are usually in the range of $K_m$, so changes in $[S]$ translate directly into changes in rate.

**Enzyme concentration.** When substrate is in excess, rate is directly proportional to enzyme concentration. Cells regulate enzyme amount through gene expression — making more or less mRNA, more or less protein. Long-term metabolic adaptation (upregulating fat-burning enzymes during endurance training) works at this level.

**Ionic strength and salt.** Most enzymes work in a salt window around physiological (0.15 M NaCl-equivalent). **Halophiles** (the archaea blooming in the Dead Sea and salt ponds) have enzymes with many surface negative charges that bind cations and prevent salt from stripping water from the protein.

**Inhibitors and activators.** Beyond environmental variables, enzymes are regulated by specific molecules — competitive, non-competitive, allosteric (3.2).

**Practical applications.**

- **Food preservation.** Refrigeration slows enzymatic browning (apple turning brown is the enzyme polyphenol oxidase; lemon juice — pH drop — slows it too). Freezing nearly stops most enzymes. Salting and sugaring pull water away from microbes.
- **Cooking.** Heat denatures proteins. Egg white (clear protein soup) cooked → opaque solid. Meat tenderized by acid or by enzymes (papain from papaya, bromelain from pineapple — don't make pineapple Jell-O without cooking the pineapple, because bromelain digests gelatin).
- **Industrial enzymes.** Laundry detergent uses heat-stable proteases and lipases. Dairy uses lactase to make lactose-free milk. Brewing depends on amylases. Cheese-making uses chymosin (rennet).
- **Medicine.** Drugs that target enzymes are designed with specific pH and temperature working ranges. The pH gradient of stomach → intestine determines which oral drugs are absorbed where.
- **PCR.** The entire modern molecular biology revolution depends on Taq polymerase being stable at the 95 °C strand-separation step. Without thermophile enzymes, no PCR; without PCR, no modern forensics, no COVID PCR tests, no human genome project.

**Exam takeaway.** When you see a question about an enzyme behaving abnormally, the first three checks are temperature, pH, and inhibitors.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ok9esggzN18',
        title: 'CrashCourse Biology — Enzymes and environment',
        provider: 'CrashCourse',
      },
    },
    {
      code: '3.4',
      title: 'Cellular energy and ATP',
      content:
`The fundamental challenge for any living thing is the second law of thermodynamics: in any closed system, entropy increases. A cell is a highly ordered structure — proteins folded precisely, lipids organized into membranes, DNA precisely packaged. To stay ordered, the cell continuously does work, and to do work, it needs continuous energy input.

**Thermodynamics quick reference.**

- **First law (conservation of energy).** Energy is neither created nor destroyed; only transformed. Light → chemical (photosynthesis) → mechanical (muscle) → heat (always, by the second law).
- **Second law (entropy).** Total entropy of an isolated system always increases. Living things are not isolated; they take in low-entropy input (sunlight, organic molecules) and export high-entropy output (heat, $CO_2$). Local order is paid for by an even larger increase in disorder elsewhere.
- **Gibbs free energy ($G$).** Combines the first and second laws:
  $$\\Delta G \\,=\\, \\Delta H \\,-\\, T\\Delta S$$
  - $\\Delta G < 0$: **exergonic** — spontaneous, releases free energy.
  - $\\Delta G > 0$: **endergonic** — requires input.
  - $\\Delta G = 0$: at equilibrium.

$\\Delta G$ depends on standard energies *and* on concentrations:
$$\\Delta G \\,=\\, \\Delta G^\\circ + RT \\ln \\frac{[products]}{[reactants]}$$

This is why a thermodynamically favorable reaction can be made to go in reverse by maintaining a high enough product:reactant ratio — or kept frozen at zero rate by waiting for an enzyme.

**ATP is the universal energy currency.** Cells do many different kinds of work — synthesis, transport, mechanical movement, light production, electrical signaling — but they use a single currency: **adenosine triphosphate (ATP)**. ATP consists of:

- **Adenine** (a nitrogenous base, same one in DNA),
- **Ribose** (a 5-carbon sugar),
- **Three phosphate groups** linked in series ($\\alpha$, $\\beta$, $\\gamma$).

The phosphate-phosphate bonds linking the second and third phosphates are **phosphoanhydride bonds**. When hydrolyzed:

$$ATP + H_2O \\,\\to\\, ADP + P_i + \\text{energy}$$

Standard free-energy change is $\\Delta G^\\circ = -7.3$ kcal/mol; under typical cellular conditions (far from equilibrium), the actual $\\Delta G$ is closer to $-10$ to $-14$ kcal/mol.

**Why the bonds are "high energy."** Not because they're intrinsically stronger than other covalent bonds, but because hydrolysis releases a lot of free energy:

1. Three negatively charged phosphates repel each other; hydrolysis lets them separate.
2. $ADP^{3-}$ and $HPO_4^{2-}$ are more resonance-stabilized than $ATP^{4-}$.
3. The products are better solvated by water.
4. Cells maintain an ATP-to-ADP ratio of $\\sim 10$ or higher — far from equilibrium — so actual cellular $\\Delta G$ is more negative than the standard value.

**Coupling: how ATP drives endergonic reactions.** When an endergonic reaction has positive $\\Delta G$, the cell couples it with ATP hydrolysis. If A → B has $\\Delta G = +5$ kcal/mol and ATP → ADP + P$_i$ has $-7.3$, the coupled reaction A + ATP → B + ADP + P$_i$ has $\\Delta G = -2.3$ kcal/mol and proceeds spontaneously. Coupling typically involves transferring a phosphate from ATP onto the reactant — the phosphorylated intermediate then undergoes the chemistry. This is how cells synthesize most of their molecules.

**Examples of coupling in everyday cellular work.**

- **Muscle contraction.** Myosin uses ATP hydrolysis to slide along actin. Each cycle: ATP binds myosin, myosin releases actin, hydrolysis cocks the myosin head, the head re-binds in a new position, the head snaps back, pulling the actin. About $5 \\times 10^{-20}$ J of work per ATP per myosin step.
- **Active transport.** The $Na^+/K^+$ pump uses one ATP to move 3 $Na^+$ out and 2 $K^+$ in — about a quarter of basal metabolism.
- **Protein synthesis.** Each amino acid added costs 4 high-energy phosphate bonds — 2 in tRNA charging, 2 in ribosome translocation.
- **DNA synthesis** uses energy from dATP/dGTP/dCTP/dTTP hydrolysis as each nucleotide is added.

**Other energy carriers.**

- **NADH and FADH$_2$** carry **reducing power** — electron pairs cashed in at the electron transport chain to make ATP. Major link between catabolism and ATP synthesis.
- **NADPH** is structurally almost identical to NADH but used for biosynthesis — fatty acid synthesis, nucleotide synthesis, the Calvin cycle. Keeping NAD$^+$/NADH separate from NADP$^+$/NADPH lets the cell run catabolism and anabolism in parallel without confusion.
- **GTP** is used by some enzymes (notably the ribosome during translation). Similar to ATP in energy.
- **Acetyl-CoA** carries 2-carbon acetyl groups; central in metabolism.
- **Phosphocreatine** in muscle is a quick energy buffer — rapidly transfers its phosphate to ADP to regenerate ATP during the first seconds of intense exercise.

**ATP turnover is massive.** A typical resting human cell contains about $10^9$ ATP molecules. Each is hydrolyzed and resynthesized about every 2 seconds. Total daily turnover is enormous: a person at rest produces and consumes about 65–70 kg of ATP per day — close to body weight. ATP is not a storage molecule; it's a continuously cycling carrier. Actual energy storage is in fat (long term), glycogen (short term), and the food you're about to eat.

**Why the cell uses ATP rather than storing energy directly.** Three reasons. First, ATP standardizes energy currency — many catabolic pathways make ATP; many anabolic pathways consume it — and a single common currency simplifies bookkeeping. Second, the chemistry of phosphate transfer is fast, reversible, and easily catalyzed by kinases. Third, ATP's $\\Delta G$ of hydrolysis is well-matched to most cellular work — large enough to drive most reactions but not so large that energy is wasted as heat each transaction.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ok9esggzN18',
        title: 'CrashCourse Biology — ATP and energy',
        provider: 'CrashCourse',
      },
    },
    {
      code: '3.5',
      title: 'Photosynthesis',
      content:
`Almost all the energy used by life on Earth originates with photosynthesis. Green plants, algae, and photosynthetic bacteria capture sunlight, use it to split water and reduce $CO_2$, and produce glucose and oxygen. Every meal you eat traces back to photosynthesis (directly if plant; indirectly through plant-eating animals); every breath you take draws on oxygen released by photosynthesis. The net reaction:

$$6\\,CO_2 + 6\\,H_2O + \\text{light} \\;\\to\\; C_6H_{12}O_6 + 6\\,O_2$$

This single equation hides two distinct, coupled stages in different parts of the chloroplast.

**Where it happens.** Chloroplasts in mesophyll cells of leaves. A chloroplast has three membrane systems: outer membrane, inner membrane, and internal thylakoid system. **Thylakoids** are flattened sacs stacked into towers called **grana**. Chlorophyll and the photosystems are embedded in thylakoid membranes. The fluid surrounding the thylakoids (inside the inner membrane) is the **stroma**, where the Calvin cycle runs.

**Stage 1 — Light-dependent reactions** (in thylakoid membranes).

Goal: convert light energy into chemical energy as ATP and NADPH. Byproduct: $O_2$ from water.

Chlorophyll *a* and chlorophyll *b* are the main pigments. They absorb most strongly in **blue** ($\\sim$ 430–460 nm) and **red** ($\\sim$ 660–680 nm), and reflect/transmit green ($\\sim$ 550 nm) — which is why plants look green. Accessory pigments — carotenoids (orange, yellow) and xanthophylls — broaden the absorption range. When chlorophyll breaks down in autumn, carotenoids and xanthophylls become visible — autumn leaves are yellow and orange.

The detailed steps:

1. **Photosystem II (PSII)** absorbs a photon; energy is funneled to a special pair of chlorophylls called **P680**, which ejects a high-energy electron into the electron transport chain.
2. **Water-splitting (oxygen-evolving complex).** PSII pulls electrons back from water to replace what it lost:
   $$2\\,H_2O \\,\\to\\, 4\\,H^+ + O_2 + 4\\,e^-$$
   The $O_2$ released is the source of all atmospheric oxygen.
3. **Electron transport chain.** The high-energy electron from PSII travels through carriers (plastoquinone, cytochrome b$_6$f, plastocyanin). Energy released pumps $H^+$ from stroma into thylakoid lumen, building a proton gradient.
4. **Photosystem I (PSI)** absorbs another photon, re-energizing the electron. The energized electron transfers via ferredoxin to NADP$^+$ reductase, which reduces $NADP^+$ to **NADPH**.
5. **ATP synthesis (chemiosmosis).** $H^+$ accumulated in the lumen flows back to the stroma through **ATP synthase**, driving phosphorylation of ADP to ATP. Same chemiosmotic mechanism as mitochondria. In photosynthesis it's called **photophosphorylation**.

Output per pair of water molecules split: 1 $O_2$, 2 NADPH, $\\sim 3$ ATP.

**Stage 2 — Calvin cycle (light-independent reactions)** (in stroma).

Goal: use ATP and NADPH to fix $CO_2$ into sugar. Three-phase loop:

1. **Carbon fixation.** $CO_2$ attaches to **ribulose-1,5-bisphosphate (RuBP)**, a 5-carbon sugar. The enzyme is **RuBisCO** (ribulose bisphosphate carboxylase/oxygenase), the most abundant protein on Earth — $\\sim 40$ million tons in plants worldwide. The unstable 6-carbon intermediate immediately splits into two 3-carbon molecules of **3-phosphoglycerate (3-PGA)**.
2. **Reduction.** 3-PGA is phosphorylated using ATP, then reduced using NADPH to **G3P (glyceraldehyde-3-phosphate)**.
3. **Regeneration of RuBP.** Most G3P stays in the cycle to regenerate RuBP — a complex rearrangement that uses more ATP. A fraction leaves the cycle to become glucose, sucrose, starch, cellulose, or other plant sugars.

For each glucose, the cycle must turn 6 times (one per $CO_2$ fixed). Total cost: **18 ATP and 12 NADPH per glucose**.

**C3, C4, and CAM strategies.**

RuBisCO has a problem: it also reacts with $O_2$, in a wasteful side reaction called **photorespiration** that consumes energy without producing sugar. The $O_2$ vs. $CO_2$ ratio in air, plus heat (lower $CO_2$ solubility, more stomatal water loss), pushes RuBisCO toward the wrong reaction. Different lineages have evolved different solutions:

- **C3 plants** (the majority — wheat, rice, soybeans, trees, most temperate species) do the Calvin cycle the basic way. Suffers from photorespiration in hot, dry, bright conditions.
- **C4 plants** (corn, sugarcane, sorghum, some grasses) **pre-concentrate $CO_2$** before the Calvin cycle. Mesophyll cells use **PEP carboxylase** (which doesn't react with $O_2$) to fix $CO_2$ into oxaloacetate → malate. Malate is transported to deep bundle-sheath cells, where it releases $CO_2$ at high local concentration to feed RuBisCO. C4 plants are water-efficient and outperform C3 in hot bright climates.
- **CAM plants** (cacti, pineapple, agave, jade) separate $CO_2$ uptake and Calvin cycle **in time**. Stomata open only at night (cooler, humid, minimizing water loss), fix $CO_2$ into malate via PEP carboxylase, store malate in vacuoles; during the day (stomata closed) release $CO_2$ for the Calvin cycle. Very water-efficient but slower-growing.

**Why this matters at planetary scale.** Photosynthesis fixes $\\sim$ **120 Gt of carbon per year** on land and another $\\sim 50$ Gt in oceans (phytoplankton). Global primary production is the foundation of the biosphere's energy budget. Atmospheric oxygen ($\\sim 21\\%$) accumulated about 2.5 billion years ago when cyanobacteria invented oxygenic photosynthesis — the **Great Oxidation Event**. The ozone layer ($O_3$) that shields life from UV is downstream of photosynthesis. Fossil fuels — coal, oil, natural gas — are buried organic carbon originally fixed by photosynthesis hundreds of millions of years ago.

**Why leaves are green and the sky is blue.** Chlorophyll absorbs blue and red, reflects green. The sky is blue because shorter wavelengths scatter more. The evolution of chlorophyll's absorption spectrum makes sense in terms of the spectral environment of early photosynthetic life under shallow water.`,
      video: {
        url: 'https://www.youtube.com/watch?v=g78utcLQrJ4',
        title: 'CrashCourse Biology — Photosynthesis',
        provider: 'CrashCourse',
      },
    },
    {
      code: '3.6',
      title: 'Cellular respiration',
      content:
`Cellular respiration is photosynthesis run in reverse: take glucose and oxygen, break them apart, capture released energy as ATP, release $CO_2$ and water. Net reaction:

$$C_6H_{12}O_6 + 6\\,O_2 \\;\\to\\; 6\\,CO_2 + 6\\,H_2O + \\sim 32\\,ATP$$

Every cell, all the time, runs some version of this (except mature red blood cells, which lack mitochondria and rely on glycolysis alone). Four stages, two compartments.

**Stage 1 — Glycolysis** (cytoplasm; no $O_2$ required).

A 10-step linear pathway that breaks glucose (6C) into 2 pyruvate (3C each). Early steps consume ATP (priming the molecule with phosphate); later steps produce ATP and NADH.

- Net per glucose: **2 ATP + 2 NADH + 2 pyruvate**.
- Universal across life — present in bacteria, archaea, eukaryotes. The most ancient metabolic pathway; the genes are highly conserved. It runs without oxygen.
- The committed step is catalyzed by **phosphofructokinase (PFK)**, the most heavily regulated enzyme in glycolysis. ATP, citrate, low pH inhibit; AMP and ADP activate.

**Stage 2 — Pyruvate oxidation** (mitochondrial matrix; requires $O_2$ downstream).

Each pyruvate (3C) is converted to **acetyl-CoA** (2C) plus $CO_2$. Catalyzed by the **pyruvate dehydrogenase complex** — a giant multi-enzyme assembly.

- Per pyruvate: 1 NADH + 1 $CO_2$ + 1 acetyl-CoA.
- Per glucose: 2 NADH + 2 $CO_2$ + 2 acetyl-CoA.

Acetyl-CoA from this step is the same molecule that drives the citric acid cycle. It also comes from fatty acid oxidation and amino acid catabolism — many catabolic pathways converge here.

**Stage 3 — Citric acid cycle (Krebs cycle, TCA cycle)** (matrix; requires $O_2$ downstream).

Acetyl-CoA combines with 4-carbon **oxaloacetate** to form 6-carbon **citrate**. Over 8 enzyme steps, citrate is oxidized and rearranged, releasing 2 $CO_2$, reducing NAD$^+$ → NADH at three steps, reducing FAD → FADH$_2$ at one step, and producing 1 ATP (or GTP) per cycle. Oxaloacetate is regenerated, ready to accept another acetyl-CoA.

- Per acetyl-CoA: 2 $CO_2$, 3 NADH, 1 FADH$_2$, 1 ATP.
- Per glucose (two acetyl-CoAs): 4 $CO_2$, 6 NADH, 2 FADH$_2$, 2 ATP.

The major output isn't ATP directly — it's NADH and FADH$_2$, which carry energy to the next stage.

**Stage 4 — Electron transport chain and oxidative phosphorylation** (inner mitochondrial membrane; requires $O_2$ as final electron acceptor).

Where most ATP gets made. NADH and FADH$_2$ donate high-energy electrons to membrane protein complexes. Electrons cascade down the chain to progressively lower energy levels, releasing energy that pumps $H^+$ from matrix into intermembrane space. The final electron acceptor is $O_2$, which combines with electrons and protons to form **water**.

- **Complex I** (NADH dehydrogenase): accepts electrons from NADH; pumps 4 $H^+$ per pair.
- **Complex II** (succinate dehydrogenase, also part of Krebs): accepts from FADH$_2$; does not pump.
- **Coenzyme Q** (ubiquinone) carries electrons between complexes.
- **Complex III** (cytochrome bc$_1$): pumps 4 $H^+$.
- **Cytochrome c** carries electrons.
- **Complex IV** (cytochrome c oxidase): the final step before $O_2$. Pumps 2 $H^+$; reduces $O_2$ to water.
- **ATP synthase** ("Complex V"): lets $H^+$ flow back into matrix down its gradient. The flow drives a rotational motor that physically twists ADP + P$_i$ into ATP.

ATP synthase is one of the most remarkable machines in biology — it spins at $\\sim 100$ revolutions per second. Each rotation produces 3 ATP. Worked out by Walker, Boyer, Skou (Nobel Prize 1997).

**Net yields.** Modern measurements:

- NADH from glycolysis (shuttled into mitochondria): $\\sim 1.5$ ATP each (FADH$_2$ shuttle) or $\\sim 2.5$ (NADH shuttle).
- NADH from pyruvate oxidation and Krebs: $\\sim 2.5$ ATP each.
- FADH$_2$: $\\sim 1.5$ ATP each.
- Substrate-level phosphorylation (glycolysis + Krebs): 4 ATP.
- **Total: about 30–32 ATP per glucose.**

**Anaerobic alternatives — fermentation.** When $O_2$ is unavailable, the electron transport chain stalls, NADH backs up, glycolysis stops. Cells solve this with fermentation, regenerating NAD$^+$ by dumping electrons onto an organic acceptor instead of $O_2$.

- **Lactic acid fermentation.** Pyruvate accepts electrons from NADH to become lactate. Net: 2 ATP per glucose. Muscle during intense exercise; bacteria (Lactobacillus in yogurt, sauerkraut, kimchi).
- **Alcohol fermentation.** Pyruvate decarboxylated to acetaldehyde (releasing $CO_2$); acetaldehyde accepts electrons from NADH to become ethanol. Net: 2 ATP per glucose. Yeast (brewing, bread — the $CO_2$ makes bread rise).

Anaerobic: 2 ATP vs aerobic's $\\sim 32$ — a 16-fold difference. Why so much less? Because oxygen is a powerful oxidant — it sits at the bottom of a long energetic staircase. The ETC steps down each part. Fermentation only uses the energy released by partial breakdown; the bulk remains in lactate or ethanol.

**Other fuels.** The cell doesn't only burn glucose. **Fatty acid oxidation** ($\\beta$-oxidation) breaks fatty acids into acetyl-CoA units. A 16-carbon palmitate yields $\\sim 106$ ATP. **Amino acids** are deaminated and their carbon skeletons enter the cycle at various points. During prolonged fasting, the liver makes **ketone bodies** from acetyl-CoA, which the brain can use as fuel.

**Poisons.**

- **Cyanide** binds and inhibits cytochrome c oxidase (Complex IV). Electrons can't reach $O_2$; the chain stops; ATP collapses. Brain and heart fail within minutes. Antidote: hydroxocobalamin.
- **Carbon monoxide** binds hemoglobin (and cytochrome c oxidase) much more tightly than $O_2$.
- **Rotenone** blocks Complex I.
- **Oligomycin** blocks ATP synthase.
- **2,4-DNP** is an uncoupler — lets $H^+$ leak through the inner membrane without going through ATP synthase; the gradient dissipates as heat. Historically used as an unsafe diet drug; many died of hyperthermia.

**Heat production.** ATP synthesis is only $\\sim 40\\%$ efficient at capturing glucose's energy; the rest leaves as heat. **Brown adipose tissue** (especially in infants and hibernators) has **uncoupling protein 1 (UCP1)** that intentionally dissipates the proton gradient as heat without making ATP — a tissue-level thermostat.`,
      video: {
        url: 'https://www.youtube.com/watch?v=00jbG_cfGuQ',
        title: 'CrashCourse Biology — Cellular respiration',
        provider: 'CrashCourse',
      },
    },
    {
      code: '3.7',
      title: 'Fitness — energy, life history, and the biosphere',
      content:
`Cellular energetics is the foundation of the whole biosphere. At the cell level, photosynthesis and respiration drive every other reaction. At the organism level, the rate of energy capture and use shapes growth, reproduction, lifespan, and behavior. At the ecosystem level, the flux of energy through trophic levels sets how much life the planet can support.

**Global primary production.** Earth's primary producers — green plants on land, phytoplankton in oceans — capture $\\sim$ **170 Gt** of carbon per year through photosynthesis. This is **gross primary production (GPP)**. Plants use about half for their own respiration, leaving $\\sim$ 90 Gt as **net primary production (NPP)**: carbon and energy available to everything else.

**The biological carbon cycle.** Photosynthesis pulls $CO_2$ from atmosphere into living tissue; respiration releases $CO_2$ back. Decomposition (bacteria and fungi respiring dead plant matter) is the major return path. The cycle is nearly balanced on annual timescales; most fixed carbon returns within months to years. A small fraction is buried as peat, sediment, fossil fuels — over hundreds of millions of years, this small fraction accumulates. Human combustion of fossil fuels now releases $\\sim$ **12 Gt C/yr** — a small fraction of the natural cycle, but a one-way net addition the cycle cannot reabsorb on human timescales. Atmospheric $CO_2$ has risen from 280 ppm (preindustrial) to $\\sim 425$ ppm (2024).

**Trophic energy flow — Lindeman's 10% rule.** Energy moves between trophic levels at roughly **10%** efficiency. The other 90% is lost — to maintaining metabolism, heat, indigestible material, feces.

- **Producers** (plants): 100 units of energy
- **Primary consumers** (herbivores): $\\sim 10$
- **Secondary consumers** (carnivores): $\\sim 1$
- **Tertiary consumers** (top predators): $\\sim 0.1$

Two consequences. First, food chains rarely exceed 4–5 levels — by level 5, almost no energy left. Second, eating low on the food chain (plants directly) is more energy-efficient. A field that supports a hundred cows can only support ten lions.

**Why apex predators are scarce.** Tigers, polar bears, great white sharks, eagles — top predators are always at very low density and slow-reproducing. The Lindeman pyramid is part of the explanation: energy supply at the top is small, so carrying capacity is low. Add habitat fragmentation and human pressure, and that's why apex predators are disproportionately threatened.

**Metabolic strategies and life history.**

- **Ectotherms** ("cold-blooded": reptiles, fish, most invertebrates) get heat from the environment. Basal metabolic rate is roughly 5–10× lower than an endotherm's of similar size. They survive on far less food, but activity is constrained by temperature, and cognitive capacity is limited.
- **Endotherms** (mammals, birds) maintain a constant high body temperature internally. Basal metabolism is high — they need to eat a lot — but they can be active across wide climate ranges, sustain powered flight and long-distance running, and run a complex brain continuously.
- **Hibernators** (bears, ground squirrels, hummingbirds for short torpor) drop body temperature and metabolism dramatically. A hibernating ground squirrel may have a body temperature near freezing and a heart rate of a few beats per minute.
- **Migrators** (caribou, monarchs, salmon, many birds) move to follow seasonal abundance. The energy cost of migration is high but smaller than starving.
- **Estivators** (some snails, lungfish) "hibernate" through dry seasons. Lungfish can survive years buried in mud.

**Glycolysis is universal.** Every known cell can do glycolysis. The enzymes were present in the **last universal common ancestor (LUCA)**, $\\sim$ 3.5 billion years ago. This deep conservation is among the strongest evidence for the common origin of all life. The Krebs cycle and oxidative phosphorylation are nearly as universal among aerobes.

**Alternative electron acceptors.** Aerobic respiration uses $O_2$. But many bacteria and archaea use other acceptors:

- **Denitrifying bacteria** use $NO_3^- \\to N_2$. Major source of atmospheric nitrogen replenishment but reduces soil fertility.
- **Sulfate-reducing bacteria** use $SO_4^{2-} \\to H_2S$. The rotten-egg smell of anoxic mud.
- **Methanogenic archaea** use $CO_2 \\to CH_4$. They live in cow guts, rice paddies, wetlands, sewage. Methane is $\\sim$ 30× more potent as a greenhouse gas than $CO_2$.
- **Iron-reducing bacteria** use $Fe^{3+} \\to Fe^{2+}$.

Each acceptor has its own electrochemical position — $O_2$ is the strongest (releases the most energy), $CO_2$ the weakest. Cells choose the strongest available acceptor; in lake sediments, $O_2$ is depleted near the surface, then nitrate, then sulfate, then carbonate — producing a layered ecology.

**Energy storage molecules.**

- **ATP** — immediate use; cells never store much.
- **Phosphocreatine** — minutes-timescale buffer in muscle.
- **Glucose / glycogen** — hours to days. Liver and muscle glycogen mobilized quickly.
- **Fat (triglycerides)** — weeks to months. Energy density $\\sim 9$ kcal/g vs $\\sim 4$ kcal/g for carbohydrate. Birds about to migrate sometimes double body weight in fat in a few weeks.

**Why all this matters for AP Biology.** Exam questions often ask you to take an energy-flow argument and apply it across scales — from a cell's ATP balance to a population's carrying capacity. The unifying idea: biology runs on energy, supply is finite (set by photosynthesis), and trade-offs between getting and spending energy shape behavior, physiology, and ecology at every level.`,
      video: {
        url: 'https://www.youtube.com/watch?v=00jbG_cfGuQ',
        title: 'CrashCourse Biology — Respiration and energy',
        provider: 'CrashCourse',
      },
    },
  ],
  keyConcepts: [
    'Enzymes lower activation energy ($E_a$); they don\'t change $\\Delta G$. Rate speedups range from $10^6$ to $10^{17}$.',
    'Active site = pocket on enzyme; specificity from geometry + chemistry. Induced fit (Koshland) is more accurate than lock-and-key (Fischer).',
    'Michaelis-Menten: $v = V_{\\max}\\,[S] / (K_m + [S])$. Low $K_m$ = high substrate affinity.',
    'Inhibitors: competitive (raises $K_m$), non-competitive (lowers $V_{\\max}$), uncompetitive (lowers both).',
    'Temperature, pH, salt, substrate concentration, cofactor availability all affect enzyme function. Q$_{10}$ $\\approx 2$ below optimum.',
    'ATP hydrolysis: $\\Delta G^\\circ = -7.3$ kcal/mol; cellular $\\Delta G$ closer to $-10$ to $-14$. Universal energy currency.',
    'Photosynthesis: light reactions (thylakoid) split water, make NADPH + ATP + $O_2$. Calvin cycle (stroma) uses ATP + NADPH to fix $CO_2$ into G3P.',
    'C3 / C4 / CAM = three strategies for handling photorespiration. C4 (corn) pre-concentrates $CO_2$ in bundle sheath. CAM (cactus) separates uptake (night) from Calvin cycle (day).',
    'Respiration: glycolysis (cytoplasm) → pyruvate oxidation + Krebs (matrix) → ETC + ATP synthase (inner membrane). $\\sim 32$ ATP per glucose.',
    '$O_2$ is the final electron acceptor; reduced to $H_2O$. $CO_2$ comes from glucose carbons, not from $O_2$.',
    'Anaerobic (fermentation): 2 ATP per glucose — 16× less than aerobic.',
    'Trophic energy flow: $\\sim 10\\%$ transfer between levels (Lindeman). Limits food chains to $\\sim 4$–5 levels.',
  ],
  formulas: [
    {
      name: 'Photosynthesis (net)',
      equation: '$6\\,CO_2 + 6\\,H_2O + \\text{light} \\to C_6H_{12}O_6 + 6\\,O_2$',
      meaning: 'Captures light energy as chemical bonds in glucose; releases $O_2$ from water.',
      example: 'Global NPP $\\approx 90$ Gt C/yr — the energy budget of the biosphere.',
    },
    {
      name: 'Cellular respiration (net)',
      equation: '$C_6H_{12}O_6 + 6\\,O_2 \\to 6\\,CO_2 + 6\\,H_2O + \\sim 32\\,ATP$',
      meaning: 'Oxidizes glucose to release energy as ATP. $O_2$ is the final electron acceptor (reduced to $H_2O$).',
      example: 'A human at rest produces $\\sim 65$ kg of ATP per day — close to body weight.',
    },
    {
      name: 'Michaelis-Menten kinetics',
      equation: '$v = \\dfrac{V_{\\max}\\,[S]}{K_m + [S]}$',
      meaning: 'Hyperbolic rate vs substrate concentration. $K_m$ = substrate affinity; $V_{\\max}$ scales with enzyme amount.',
      example: 'Hexokinase ($K_m \\approx 0.1$ mM) saturated at normal blood glucose; glucokinase ($K_m \\approx 10$ mM) tracks blood-glucose changes.',
    },
    {
      name: 'Gibbs free energy',
      equation: '$\\Delta G = \\Delta H - T\\Delta S$',
      meaning: '$\\Delta G < 0$ = spontaneous (exergonic); $\\Delta G > 0$ = endergonic. Cells couple endergonic to ATP hydrolysis.',
      example: 'Glucose phosphorylation alone has $\\Delta G \\approx +3$; coupled with ATP ($-7.3$), net is $-4.3$ — favorable.',
    },
  ],
  practice: [
    {
      q: 'A patient is unconscious; you suspect cyanide poisoning. Explain at the molecular level why cyanide is so rapidly lethal.',
      a: 'Cyanide binds and inhibits cytochrome c oxidase (Complex IV of the electron transport chain). Without Complex IV, electrons can\'t reach $O_2$; the chain backs up; $H^+$ pumping stops; the proton gradient collapses; ATP synthase stops. Cells fall back to glycolysis (2 ATP per glucose, vs $\\sim 32$ aerobic). Brain and heart, with the highest ATP demand, fail within minutes.',
    },
    {
      q: 'A plant is moved from full sunlight to deep shade. Predict what happens to its light reactions, Calvin cycle, $O_2$ production, and $CO_2$ uptake.',
      a: 'Light reactions slow (less light → fewer photons → less ATP and NADPH). Calvin cycle slows (less ATP and NADPH). $O_2$ production drops (less water-splitting). Net $CO_2$ uptake drops; in deep enough shade, respiration may exceed photosynthesis (the compensation point).',
    },
    {
      q: 'A competitive inhibitor is added to an enzyme reaction. How do $K_m$ and $V_{\\max}$ change, and why?',
      a: '$V_{\\max}$ is unchanged because at very high $[S]$, substrate outcompetes the inhibitor — all enzyme molecules turn over at the same max rate. Apparent $K_m$ rises because more substrate is now needed to half-saturate the enzyme.',
    },
    {
      q: 'Compare aerobic and anaerobic glucose metabolism. Why such a big difference in yield?',
      a: 'Aerobic: $\\sim 32$ ATP; glycolysis (cytoplasm) + Krebs + ETC (mitochondria); requires $O_2$. Anaerobic (fermentation): 2 ATP; glycolysis only. The 16-fold difference reflects energy released as electrons cascade down the ETC to $O_2$ — a powerful oxidant. In fermentation, the energy stays trapped in lactate or ethanol.',
    },
    {
      q: 'Why is C4 photosynthesis advantageous in hot, dry climates?',
      a: 'In hot/dry conditions, plants close stomata to conserve water, which drops internal $CO_2$ and raises internal $O_2$ — pushing RuBisCO toward photorespiration. C4 plants use PEP carboxylase to fix $CO_2$ into 4-carbon malate in mesophyll cells; malate is shuttled to bundle-sheath cells, where $CO_2$ is released at high local concentration for RuBisCO. The high local $CO_2$ outcompetes $O_2$, eliminating photorespiration.',
    },
    {
      q: 'A 100-unit-energy field of grass supports how much top-predator biomass, by the 10% rule?',
      a: 'About 0.1 unit. Producers (100) → herbivores ($\\sim 10$) → carnivores ($\\sim 1$) → top predators ($\\sim 0.1$). This is why food chains rarely exceed 4–5 levels and why top predators are scarce.',
    },
  ],
  pitfalls: [
    '"Enzymes are used up in reactions" — no. Enzymes are regenerated each cycle.',
    '"Enzymes change $\\Delta G$" — wrong. They lower $E_a$; $\\Delta G$ is set by reactants and products.',
    '"Plants only do photosynthesis; animals only do respiration" — plants do both. They photosynthesize when there\'s light, but respire 24/7.',
    '"Glycolysis happens in mitochondria" — no, cytoplasm. Krebs and ETC are in mitochondria.',
    '"$O_2$ in respiration becomes $CO_2$" — wrong. $O_2$ is reduced to water; $CO_2$ comes from glucose carbons.',
    '"Anaerobic respiration makes no ATP" — wrong. It makes 2 ATP per glucose via substrate-level phosphorylation.',
    '"NADH and NADPH are interchangeable" — no. NADH for catabolism (feeds ETC); NADPH for anabolism. The pools are kept separate.',
    '"All photosynthetic organisms split water" — most do, but anoxygenic photosynthetic bacteria use $H_2S$ or organic acids instead.',
  ],
};
