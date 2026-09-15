// AP Biology Unit 4 — Cell Communication and Cell Cycle (10-15% of exam)
// APES-standard depth. LaTeX math via $...$ delimiters.

export const APBIO_UNIT_4 = {
  number: 4,
  title: 'Cell Communication and Cell Cycle',
  weight: '10-15%',
  subunits: [
    {
      code: '4.1',
      title: 'Cell communication',
      content:
`A multicellular organism is not just a pile of cells; it is a coordinated society of cells, and society requires communication. Your immune system has to recognize self from non-self, your liver has to know when blood glucose is high so it can store glycogen, your brain has to tell your foot muscles to contract — all of this requires cells to send and receive signals. Even single-celled organisms communicate: bacteria sense quorum, yeast detect mating partners, slime molds aggregate from thousands of individuals into a single body when food runs out. Cell communication is one of the deepest unifying themes in biology, and it scales smoothly from a single bacterium signaling its neighbors to the trillion-cell coordination of a vertebrate.

**The four basic categories of signaling.** Distinguished by how far the signal travels and who receives it.

1. **Direct contact (juxtacrine signaling).** The signaling molecule stays attached to the sender's surface; the receiver has to physically touch the sender. **Notch signaling** in development uses this — a Notch receptor on one cell binds a Delta ligand on a neighbor, and the contact triggers a cleavage event that activates downstream gene expression. Most cell-fate decisions in early embryos use direct contact. **Gap junctions** in animal cells and **plasmodesmata** in plant cells go further still — they form direct channels of cytoplasm between cells, allowing small molecules and ions to pass without ever crossing a membrane. Cardiac muscle cells are coupled by gap junctions, which is why a heart beats as a coordinated unit rather than as a million independent twitches.
2. **Local (paracrine) signaling.** The signal is released into the surrounding extracellular fluid and diffuses to nearby cells. **Neurotransmitters** at synapses are a fast, highly local form — the cleft between presynaptic and postsynaptic neurons is only $\\sim 20$ nm wide, and the signal acts on a single target cell within milliseconds. **Growth factors** released by one cell can act on neighbors over a range of microns to millimeters; they're the basis for tissue development, wound healing, and the local regulation of stem-cell niches. **Cytokines** released by immune cells coordinate the activity of nearby immune cells. Paracrine signaling is fast and local — its range is limited because the signaling molecules are continuously cleared by uptake or enzymatic degradation.
3. **Long-distance (endocrine) signaling.** **Hormones** released by endocrine glands travel through the bloodstream to act on distant target tissues. Slower than paracrine (seconds to minutes for delivery) but reaches the whole body. Insulin from the pancreas reaches every cell that expresses an insulin receptor; epinephrine (adrenaline) from the adrenal medulla reaches heart, lungs, muscles, and liver simultaneously during the fight-or-flight response. Endocrine signals are typically present in very low concentrations ($10^{-9}$–$10^{-12}$ M) — receptors must be exquisitely sensitive.
4. **Autocrine signaling.** The cell signals itself — releases a molecule that binds receptors on its own surface. Many tumor cells maintain themselves this way: they produce a growth factor and respond to it, generating self-sustaining proliferation that doesn't require external input. Some immune-cell activation loops are autocrine too.

**A fifth, special category: synaptic signaling** sits between paracrine and endocrine. Synapses use neurotransmitters that travel only across a tiny gap, but the targeted distance can be enormous because of the geometry — a motor neuron in your spinal cord projects an axon down your leg to a muscle in your foot, releasing acetylcholine at a synapse a meter from the cell body.

**Three steps every signaling event shares.** Regardless of the category, every cell-signaling event has three stages, and each has its own checks and balances.

- **Reception** — the signaling molecule (the **ligand**) binds a specific **receptor** on or inside the target cell. Specificity is at this step: only cells with the right receptor respond. This is why insulin affects muscle and fat but not, say, neurons in the same way.
- **Transduction** — binding triggers a chain of molecular changes inside the cell, often amplifying the signal and converting it into a form the cell can act on. A single hormone molecule binding outside the cell can result in millions of intracellular ATP molecules being affected within seconds.
- **Response** — the transduced signal causes some change in the cell's behavior: activating an enzyme, opening an ion channel, modifying transcription, triggering apoptosis, contracting a muscle, secreting a hormone of its own.

We'll see each stage in detail in the next subunits. The three-step framework is the backbone of every AP question about signaling.

**Why receptors matter.** Different cell types express different receptors, which is what lets the same circulating hormone produce different responses in different tissues. **Epinephrine** binds $\\beta_1$-adrenergic receptors on cardiac muscle (speeds heart rate), $\\beta_2$-adrenergic receptors on bronchial smooth muscle (relaxes airways), $\\alpha_1$-adrenergic receptors on blood vessels in skin and gut (constricts them), and so on. Same hormone, different receptors, different responses. This receptor-specific division of labor is also what makes drug design possible: a $\\beta_2$ agonist like albuterol relaxes airways (treating asthma) without slamming the heart, because it selectively activates $\\beta_2$ receptors over $\\beta_1$.

**Quorum sensing in bacteria.** Bacteria release small signaling molecules (acyl homoserine lactones in many gram-negatives) at a steady per-cell rate. When the bacterial population density rises, the local concentration of the signal rises too. Once a threshold is crossed, the bacteria collectively switch on a set of genes — for biofilm formation, for virulence factors, for bioluminescence (in *Vibrio fischeri*, which glows only when crowded in the light organ of the Hawaiian bobtail squid). Quorum sensing lets bacteria do things that only make sense as a group — collectively secreting a toxin no individual bacterium could produce in useful amounts is wasted if you're alone.

**Why signaling went deep into multicellular evolution.** A single cell can run on cell-autonomous chemistry — it senses the environment, responds, divides. A million-cell organism can't work that way: cells in deep tissue can't sense the environment directly, cells in the foot have to know what the brain is doing, cells of the immune system have to recognize each other and the rest of the body. The signaling systems that vertebrates use today — hormones, neurotransmitters, growth factors, immune cytokines — all evolved from molecular toolkits that were already present in single-celled ancestors. Yeast use a pheromone-receptor system for mating that is structurally nearly identical to the G-protein-coupled receptor systems we use for vision, smell, and dozens of hormone responses. The signaling toolkit predates multicellularity; multicellularity is what made it indispensable.

**Hormones can be either water-soluble or lipid-soluble — and that difference matters.**

- **Water-soluble (hydrophilic) hormones** — peptides (insulin, glucagon, growth hormone), small molecules with charges (epinephrine, norepinephrine). They cannot cross the plasma membrane, so their receptors are on the **cell surface**. Signaling involves a chain of intracellular messengers.
- **Lipid-soluble (hydrophobic) hormones** — steroids (cortisol, testosterone, estrogen, progesterone), thyroid hormones, vitamin D. They cross the plasma membrane directly and bind **intracellular receptors** (cytoplasmic or nuclear). The receptor-hormone complex usually acts as a transcription factor, changing gene expression. Effects are slower (hours) but more sustained than peptide-hormone effects (which can act within seconds).

The difference also affects transport. Lipid-soluble hormones travel in blood bound to carrier proteins; water-soluble hormones travel freely dissolved.

**The exam framing.** When you see a signaling question, the first thing to identify is: which of the four categories, which type of ligand (water- or lipid-soluble), and where is the receptor (surface or inside the cell). Almost every other detail follows from those three facts.`,
      video: {
        url: 'https://www.youtube.com/watch?v=zlfTuMupAGc',
        title: 'CrashCourse Biology — Cell communication',
        provider: 'CrashCourse',
      },
    },
    {
      code: '4.2',
      title: 'Signal transduction — receptors and second messengers',
      content:
`Once a signal reaches the target cell, the cell has to turn that signal into action. The conversion is called **signal transduction**, and it has two universal features: **amplification** (one extracellular ligand can lead to thousands or millions of intracellular events) and **specificity** (the cell responds to the right signal without confusing it for another).

**Types of receptors.**

**(1) G-protein-coupled receptors (GPCRs).** The largest family of cell-surface receptors — about 800 in the human genome, and the target of more FDA-approved drugs than any other protein family ($\\sim 1/3$ of all approved drugs). Each GPCR is a transmembrane protein that crosses the membrane 7 times ("7TM receptors"). Examples include:

- $\\beta$-adrenergic receptors (epinephrine, norepinephrine)
- Muscarinic acetylcholine receptors (parasympathetic nervous system)
- Rhodopsin in retinal rods (vision)
- Olfactory receptors (smell — there are $\\sim 400$ different ones)
- Many hormone receptors (TSH, FSH, LH, glucagon)

How GPCRs work:

1. Ligand binds the receptor's extracellular face.
2. The receptor undergoes a conformational change.
3. The intracellular face of the receptor interacts with a **G-protein** — a heterotrimer ($\\alpha$, $\\beta$, $\\gamma$ subunits) bound to GDP on the inner membrane surface.
4. The receptor catalyzes exchange of GDP for GTP on the $\\alpha$ subunit.
5. G-$\\alpha$ (now bound to GTP) dissociates from $\\beta\\gamma$ and from the receptor.
6. G-$\\alpha$ (and sometimes $\\beta\\gamma$) activates a downstream effector — typically an enzyme like **adenylyl cyclase** (makes cAMP) or **phospholipase C** (makes IP$_3$ and DAG).
7. G-$\\alpha$ slowly hydrolyzes its bound GTP to GDP, then re-associates with $\\beta\\gamma$ — turning the signal off.

The G-protein acts as a timer. As long as it has GTP, it signals; once it hydrolyzes to GDP, signaling stops. **Cholera toxin** locks G-$\\alpha_s$ in the active GTP-bound state — adenylyl cyclase runs continuously, intestinal epithelial cells pump $Cl^-$ (and water follows) into the gut, the patient loses liters of fluid per day. Untreated cholera kills by dehydration.

**(2) Receptor tyrosine kinases (RTKs).** Receptors that are themselves enzymes — specifically, kinases that add phosphate groups to tyrosine side chains. About 60 in humans. Major examples:

- Insulin receptor
- Epidermal growth factor receptor (EGFR/HER1, HER2, etc.)
- Vascular endothelial growth factor receptor (VEGFR)
- Platelet-derived growth factor receptor (PDGFR)

How RTKs work:

1. Ligand binds and causes two receptor molecules to dimerize.
2. The dimers phosphorylate each other on tyrosine residues (cross-phosphorylation).
3. The phosphorylated tyrosines act as docking sites for downstream proteins with SH2 domains.
4. Docked proteins activate a cascade — typically **Ras → Raf → MEK → ERK** (the MAP kinase pathway), which ends with phosphorylation of transcription factors that change gene expression.

RTK signaling is central to growth, differentiation, and proliferation — and to many cancers. The HER2 receptor is overexpressed in $\\sim 20\\%$ of breast cancers; the drug **trastuzumab (Herceptin)** is an antibody that binds HER2 and blocks signaling.

**(3) Ion channel receptors (ligand-gated channels).** Receptors that are ion channels themselves. Ligand binding opens the channel; ions flow; membrane voltage changes; downstream events follow.

- **Nicotinic acetylcholine receptor** at the neuromuscular junction. ACh binds, the channel opens, $Na^+$ rushes in, the muscle depolarizes, contraction follows.
- **GABA$_A$ receptor** at inhibitory synapses. GABA binds, the channel opens, $Cl^-$ enters, the neuron hyperpolarizes, less likely to fire. Benzodiazepines, alcohol, and barbiturates all amplify GABA's effect at this receptor.
- **AMPA and NMDA receptors** at excitatory synapses. Glutamate binds, $Na^+$ (and $Ca^{2+}$ for NMDA) enters, the neuron depolarizes.

These act on millisecond timescales, which is why they dominate fast neural signaling.

**(4) Intracellular receptors.** For lipid-soluble ligands (steroid hormones, thyroid hormone, vitamin D). The ligand crosses the membrane and binds a cytoplasmic or nuclear receptor; the complex moves into the nucleus and binds specific DNA sequences (hormone response elements) to regulate transcription. Effects are slower (hours) but more durable than surface-receptor signaling.

**Second messengers.** Once a receptor is activated, it usually doesn't act on its target enzyme or transcription factor directly. Instead, it triggers production of a **second messenger** — a small intracellular molecule that diffuses through the cytoplasm and activates many copies of downstream targets. This is the main amplification mechanism.

- **cAMP** (cyclic AMP). Made from ATP by adenylyl cyclase, broken down by phosphodiesterase. Activates **protein kinase A (PKA)**, which phosphorylates many targets. Activated by $G\\alpha_s$ from GPCRs (epinephrine, glucagon, many others).
- **cGMP** (cyclic GMP). Made by guanylyl cyclase. Activates PKG. Major in smooth-muscle relaxation. **Sildenafil (Viagra)** inhibits the phosphodiesterase that degrades cGMP in penile vasculature — letting cGMP accumulate and smooth muscle relax, allowing blood flow.
- **IP$_3$ and DAG** (inositol trisphosphate, diacylglycerol). Made by phospholipase C cleaving PIP$_2$. IP$_3$ diffuses to the ER and opens $Ca^{2+}$ channels — cytoplasmic $Ca^{2+}$ spikes from $\\sim 0.1\\,\\mu M$ to $\\sim 1\\,\\mu M$ (a 10-fold rise that triggers many downstream events). DAG stays in the membrane and activates protein kinase C.
- **$Ca^{2+}$ itself** acts as a second messenger because cytoplasmic concentrations are kept very low at rest, so any influx is a sharp signal. $Ca^{2+}$ triggers muscle contraction, neurotransmitter release, T-cell activation, fertilization, and many other rapid responses.

**Amplification — the numbers.** A typical hormone signaling cascade amplifies by factors of $10^3$ to $10^6$. For glucagon binding to liver cells:

- 1 glucagon molecule binds 1 receptor.
- 1 receptor activates many G-proteins ($\\sim 10$ per second).
- 1 active G-$\\alpha_s$ activates adenylyl cyclase, producing many cAMPs ($\\sim 100$).
- Each cAMP activates one PKA holoenzyme tetramer.
- Each active PKA phosphorylates many phosphorylase kinase molecules.
- Each phosphorylase kinase phosphorylates many glycogen phosphorylase molecules.
- Each glycogen phosphorylase cleaves many glucose-1-phosphates off glycogen.

Net: one glucagon molecule → millions of glucose released. This cascade is why hormone-level changes of nanomolar magnitudes can produce massive cellular responses.

**Specificity — different cells respond differently.** The same second messenger can produce different responses in different cell types depending on what downstream targets are present. cAMP in liver activates glycogen breakdown. cAMP in cardiac muscle increases contraction force. cAMP in adrenal cortex increases cortisol synthesis. The cAMP molecule is identical in all three; the response is set by the cell's set of available substrates for PKA.`,
      video: {
        url: 'https://www.youtube.com/watch?v=zlfTuMupAGc',
        title: 'CrashCourse Biology — Signal transduction',
        provider: 'CrashCourse',
      },
    },
    {
      code: '4.3',
      title: 'Signal transduction pathways',
      content:
`Signal transduction is rarely a single step from receptor to response. It is usually a **cascade** — a chain of enzymes that activate each other in sequence, with each step adding amplification, regulation, and integration. Once you understand the basic architecture, you can predict the behavior of dozens of specific pathways from a handful of common modules.

**Why cascades?** Three reasons.

1. **Amplification.** Each step multiplies the signal. A few hormone molecules → many active intracellular enzymes → many phosphorylated downstream targets → millions of metabolic changes.
2. **Integration.** A cascade with multiple inputs can integrate them. A protein that's activated by one signal and inhibited by another acts as a logical gate, combining information from both.
3. **Tuning and regulation.** Multiple steps give multiple opportunities for the cell to adjust the strength of the response — by changing the abundance of any enzyme, by adding inhibitors, by modifying the kinetics of any step.

**The phosphorylation cascade as the canonical example.**

A **kinase** transfers a phosphate from ATP to a target protein (usually onto a serine, threonine, or tyrosine side chain). A **phosphatase** removes the phosphate. Kinase + phosphatase together form a reversible switch: the substrate is "on" when phosphorylated and "off" when unphosphorylated (or sometimes the reverse). The human genome encodes $\\sim 520$ kinases and $\\sim 200$ phosphatases. Roughly a third of all human proteins get phosphorylated at some point in their life cycle.

A typical phosphorylation cascade has three or four tiers:

- A surface receptor (sometimes itself a kinase, sometimes a recruiter of one) activates a **first kinase**.
- The first kinase phosphorylates (activates) a **second kinase**.
- The second kinase phosphorylates a third, which phosphorylates a fourth, and so on — each phosphorylating many copies of the next, so the signal amplifies at every step.
- The final kinase phosphorylates the actual end target — a metabolic enzyme, a transcription factor, a structural protein.

**The MAP kinase (Ras-Raf-MEK-ERK) pathway.** Probably the single most heavily studied signaling cascade. Activated by many growth factors via RTKs.

1. Growth factor binds RTK; RTKs dimerize and cross-phosphorylate.
2. Phosphotyrosines recruit adapter protein **Grb2**.
3. Grb2 recruits **SOS**, a guanine-nucleotide-exchange factor.
4. SOS activates **Ras**, swapping its GDP for GTP. Ras is a small G-protein anchored to the inner membrane face.
5. Active Ras-GTP binds **Raf** (a kinase) and brings it to the membrane.
6. Raf phosphorylates **MEK** (another kinase).
7. MEK phosphorylates **ERK** (another kinase).
8. ERK moves into the nucleus and phosphorylates transcription factors — driving expression of genes for cell growth and division.

Each step is amplified; each is reversible (corresponding phosphatases turn it back off). The pathway is central to growth and proliferation — and central to cancer. The Ras protein is mutated in $\\sim 30\\%$ of all cancers; the mutation usually stabilizes the active GTP-bound form so the pathway is permanently on, even without growth factor.

**The PI3K–Akt pathway.** Another central RTK-downstream pathway, important in cell survival and metabolism.

1. RTK or G-protein activates **PI3K (phosphoinositide 3-kinase)**.
2. PI3K phosphorylates PIP$_2$ in the membrane to make PIP$_3$.
3. PIP$_3$ recruits **Akt** to the membrane.
4. Akt is phosphorylated and activated.
5. Akt phosphorylates many downstream targets — promoting glucose uptake (via GLUT4 translocation), inhibiting apoptosis (by phosphorylating Bad), driving protein synthesis (via mTOR), and more.

The **PTEN tumor suppressor** dephosphorylates PIP$_3$ back to PIP$_2$ — turning off the pathway. PTEN is one of the most commonly inactivated tumor suppressors in human cancer.

**The Wnt pathway.** Central to development and stem-cell biology.

1. Wnt ligand binds Frizzled receptor.
2. Signaling stabilizes the transcription factor **$\\beta$-catenin** (which is otherwise constantly degraded by a destruction complex).
3. $\\beta$-catenin enters the nucleus and drives expression of target genes — including ones that maintain stem-cell self-renewal.

Mutations that lock the Wnt pathway on are the founding event in $\\sim 90\\%$ of colorectal cancers — typically via inactivation of **APC**, a component of the $\\beta$-catenin destruction complex.

**The Notch pathway.** Pure juxtacrine. A Notch receptor on cell A binds a Delta ligand on cell B; the contact triggers two consecutive proteolytic cleavages of Notch, releasing its intracellular domain, which enters the nucleus and acts as a transcription factor. Critical in lateral inhibition, in which a single cell in a cluster wins the "be different" fate and uses Notch to keep its neighbors from doing the same.

**The JAK–STAT pathway.** Used by cytokine receptors. JAK kinases associated with the receptor phosphorylate STAT transcription factors, which dimerize, enter the nucleus, and drive target gene expression. Central in immune signaling. Mutations in JAK2 cause polycythemia vera (overproduction of red blood cells); JAK inhibitors (ruxolitinib) treat it.

**Hormone-receptor signaling — water-soluble vs. lipid-soluble.**

- **Water-soluble ligands (peptides, catecholamines)** stay outside the cell. Their receptors are at the surface. They use GPCR or RTK pathways. Fast (seconds), often metabolic responses.
- **Lipid-soluble ligands (steroids, thyroid hormone)** cross the membrane and bind intracellular receptors that act as ligand-gated transcription factors. Slow (hours), often gene-expression responses.

**Cross-talk.** Pathways don't run in isolation; they share components and influence each other. PKA activated by cAMP can phosphorylate components of the MAP kinase pathway. Calcium activates many kinases that intersect with everything else. The cell's signaling state at any moment is the integration of all the cross-talk; that's why understanding signaling means understanding networks, not just linear cascades. **Systems biology** as a field exists largely to make sense of this.

**Pharmacology — most drugs target signaling.** Insulin (peptide hormone, replacement). $\\beta$-blockers (block $\\beta$-adrenergic receptors; treat hypertension and heart failure). Statins (block cholesterol synthesis indirectly affecting many signaling membranes). Anti-cancer kinase inhibitors (imatinib for chronic myeloid leukemia, gefitinib for EGFR-mutant lung cancer, ruxolitinib for JAK2). About half of all FDA-approved drugs target a receptor or signaling enzyme — knowing the pathway is knowing what's drug-tractable.`,
      video: {
        url: 'https://www.youtube.com/watch?v=zlfTuMupAGc',
        title: 'CrashCourse Biology — Cascades',
        provider: 'CrashCourse',
      },
    },
    {
      code: '4.4',
      title: 'Changes in signal transduction pathways',
      content:
`Signaling pathways don't always work. When they break, the consequences can be dramatic: cancer, diabetes, immune disorders, developmental defects, and dozens of named syndromes. Understanding what happens when signaling fails is both medically essential and a useful way to test understanding of how the normal pathways work. The exam asks about this constantly.

**Mutations at every step can disrupt signaling.**

- **Receptor mutations.** The receptor may not bind the ligand (loss-of-function) or may signal without a ligand (gain-of-function, constitutively active).
- **G-protein or kinase mutations.** A G-protein may fail to hydrolyze GTP (gain-of-function — stuck in the "on" state). A kinase may lose activity (loss-of-function) or become constitutively active (gain-of-function).
- **Second messenger machinery mutations.** Loss of adenylyl cyclase, mutations in phosphodiesterase, etc.
- **Transcription factor mutations.** The final output of the pathway fails.
- **Inhibitor mutations.** Loss of a negative regulator (like PTEN or APC) lets the pathway run unchecked.

**Familial hypercholesterolemia — receptor loss-of-function.** The LDL receptor on liver cells binds LDL particles and internalizes them via receptor-mediated endocytosis. Patients with one defective copy of the LDL receptor gene have $\\sim 2\\times$ normal blood cholesterol; patients with two defective copies have $\\sim 6\\times$ normal. The work that identified this mechanism (Brown and Goldstein, Nobel 1985) was the first molecular description of a signaling/transport disease and laid the foundation for the statin era.

**Achondroplasia — receptor gain-of-function.** The receptor FGFR3 normally signals to slow down chondrocyte proliferation in long-bone growth plates. A specific gain-of-function mutation (Gly380Arg) makes FGFR3 signal even without its ligand, slowing long-bone growth excessively. The result is dwarfism with short limbs and a normal-sized head — the most common cause of human dwarfism. The mutation is autosomal dominant with one of the highest known new-mutation rates of any human disease.

**Cancer — broken signaling at every level.** Cancer is fundamentally a disease of signaling. Most cancers carry mutations in multiple signaling components — receptors, G-proteins, kinases, transcription factors, tumor suppressors.

- **Ras mutations.** About $30\\%$ of all human cancers carry an activating mutation in Ras (most commonly K-Ras G12D). The mutation prevents Ras from hydrolyzing GTP, so it's stuck in the active form. The MAP kinase pathway runs continuously. Cells proliferate without external growth signals.
- **HER2 amplification.** Some breast cancers have many extra copies of the HER2 gene, leading to overabundance of the receptor on the cell surface. The receptors dimerize even without ligand and drive proliferation. **Trastuzumab (Herceptin)**, an anti-HER2 antibody, blocks signaling and was the founding example of targeted cancer therapy.
- **BCR-ABL fusion.** Chronic myeloid leukemia is caused by a chromosomal translocation (the Philadelphia chromosome) that fuses the BCR gene to the ABL tyrosine kinase gene. The fusion protein is a constitutively active kinase that drives leukemic cell proliferation. **Imatinib (Gleevec)** is a specific inhibitor of BCR-ABL; it transformed CML from a fatal cancer to a manageable one within a few years of approval (2001). Imatinib was the first targeted small-molecule cancer therapy that worked dramatically.
- **p53 mutation.** p53 is a transcription factor that responds to DNA damage by halting the cell cycle (so DNA can be repaired) or triggering apoptosis (if damage is too severe). It's mutated in over half of all human cancers — by far the most commonly mutated tumor suppressor.
- **PTEN loss.** PTEN normally turns off the PI3K–Akt survival pathway. Loss of PTEN lets cells survive when they shouldn't and is common in many cancers.
- **APC loss.** APC is part of the destruction complex that normally degrades $\\beta$-catenin. Loss of APC stabilizes $\\beta$-catenin, drives Wnt-pathway-target gene expression, and is the founding event in $\\sim 90\\%$ of colorectal cancers.

**Type 2 diabetes — insulin signaling resistance.** Pancreatic $\\beta$-cells release insulin in response to high blood glucose. Insulin binds its receptor on muscle, fat, and liver cells, triggering glucose uptake (via GLUT4 translocation) and glycogen synthesis. In type 2 diabetes, the receptor and downstream signaling become unresponsive — even though insulin is present (and often elevated), the cells don't respond appropriately. Blood glucose remains high, $\\beta$-cells try to compensate by secreting more insulin, eventually exhausting and failing. Modern drugs target many levels of this pathway: SGLT2 inhibitors block glucose reabsorption in kidney, GLP-1 agonists boost insulin secretion, metformin works partly through AMPK signaling in liver.

**Cholera — bacterial sabotage of host signaling.** **Vibrio cholerae** releases cholera toxin. The toxin enters intestinal epithelial cells and chemically modifies G-$\\alpha_s$, locking it in the active GTP-bound state. Adenylyl cyclase runs continuously, cAMP accumulates, CFTR chloride channels open, water follows osmotically. The result is liters of watery diarrhea per day. Without rehydration, death from dehydration follows within hours. Oral rehydration therapy — sugar, salt, water in the right proportions, exploiting the SGLT1 glucose-sodium cotransporter that doesn't depend on the disabled signaling — has saved millions of lives.

**Pertussis (whooping cough)** uses a related toxin that ADP-ribosylates G-$\\alpha_i$, the inhibitory G-protein subunit. Disabling G-$\\alpha_i$ removes the brake on adenylyl cyclase. The pathophysiology is more subtle than cholera but the general principle is the same — sabotaging G-protein signaling.

**Severe combined immunodeficiency (SCID) from JAK3 mutations.** Cytokine receptors that signal through JAK3 are required for the development of T-cells and NK cells. Loss-of-function mutations in JAK3 produce a SCID phenotype — children born without a functional immune system. Without bone marrow transplant or gene therapy, they typically die of infection within the first year. Gene therapy for SCID-X1 (caused by IL-2 receptor common gamma chain mutation, upstream of JAK3) was one of the first clinical demonstrations that gene therapy could cure a genetic disease — though early trials caused leukemia from insertional mutagenesis.

**Drugs designed to fix or block specific signaling defects.** Modern medicine is increasingly built on targeted modulation of specific signaling components. Pre-2000, drugs were largely small molecules that turned out to work by trial and error. Post-2000, the workflow is more like: identify a signaling component dysregulated in disease, design a molecule (or antibody) that blocks or activates it, test in clinical trials. **Pembrolizumab and nivolumab** (anti-PD-1) block a signaling brake that tumor cells use to suppress immune attack — releasing the brake unleashes T-cells against the tumor, and has revolutionized cancer treatment for melanoma, lung cancer, and others.

**The general lesson.** Signaling pathways have failure modes at every level — receptor, transducer, second messenger, kinase, transcription factor, inhibitor — and each failure mode produces a recognizable disease. The exam will ask you to predict the consequence of a specific defect; the answer is always "trace the defect through the pathway and identify the downstream effect."`,
      video: {
        url: 'https://www.youtube.com/watch?v=zlfTuMupAGc',
        title: 'CrashCourse Biology — Signaling and disease',
        provider: 'CrashCourse',
      },
    },
    {
      code: '4.5',
      title: 'Feedback',
      content:
`Living systems are not just collections of separate pathways. They are networks held in stable, responsive states by **feedback** — outputs that loop back to control their own inputs. Two opposing flavors of feedback dominate biology: **negative feedback** (the output dampens its own input — the basis of homeostasis) and **positive feedback** (the output amplifies its own input — the basis of switches and tipping points). Understanding both is essential; many AP free-response questions hinge on telling them apart.

**Negative feedback — the engine of homeostasis.**

Negative feedback keeps a regulated variable around a set point. The output reduces its own input — the system pushes back against any departure from the target.

The thermostat analogy. Temperature sensor detects too-cold. Furnace turns on. Temperature rises. Sensor detects target is reached. Furnace turns off. The output (heat) feeds back to suppress the input that triggered it.

**Examples in physiology.**

- **Blood glucose regulation.** High blood glucose → pancreatic $\\beta$-cells secrete insulin → muscle and fat take up glucose (via GLUT4); liver stores it as glycogen → blood glucose falls → insulin secretion drops. Low blood glucose → pancreatic $\\alpha$-cells secrete glucagon → liver breaks down glycogen and releases glucose → blood glucose rises → glucagon drops. The two opposing feedback loops together hold blood glucose around 5 mM.
- **Body temperature.** Hypothalamus monitors temperature. Too hot: vasodilation, sweating. Too cold: vasoconstriction, shivering, brown fat thermogenesis. Body temperature is held around 37 °C.
- **Blood pressure.** Baroreceptors in carotid sinus monitor pressure. High pressure → increased parasympathetic activity, decreased sympathetic → vasodilation, slower heart → pressure falls. Low pressure → opposite response.
- **Thyroid hormone.** Hypothalamus secretes TRH → pituitary secretes TSH → thyroid secretes T$_3$/T$_4$ → T$_3$/T$_4$ inhibits TRH and TSH secretion. This is **endocrine negative feedback**: the end hormone feeds back to suppress the regulators upstream.
- **Enzyme end-product inhibition.** The final product of a metabolic pathway inhibits the first enzyme of that pathway. **Isoleucine** inhibits threonine deaminase, the first step in isoleucine synthesis. When isoleucine is abundant, no need to make more. We saw this in Unit 3.2.
- **DNA damage response.** When DNA is damaged, p53 is stabilized, transcribes p21, which inhibits cyclin-dependent kinases, halting the cell cycle so damage can be repaired before division. If damage is too great, p53 triggers apoptosis. The output (cell-cycle arrest) feeds back to prevent damaged cells from being inputs into more damage.
- **Stress hormone cortisol.** Hypothalamus → CRH → pituitary → ACTH → adrenal cortex → cortisol → cortisol inhibits CRH and ACTH. Sustained stress overrides this; chronic high cortisol has many downstream consequences (muscle wasting, immune suppression, insulin resistance).

**Why negative feedback is everywhere.** Stability requires it. Any system without negative feedback will drift, oscillate uncontrollably, or run away. The fact that you can maintain $\\sim 37$ °C body temperature, $\\sim 5$ mM blood glucose, $\\sim 7.4$ blood pH, $\\sim 0.15$ M plasma $Na^+$, etc., across days of fasting and feasting, hot and cold, exercise and rest, is a triumph of layered negative feedback loops.

**Positive feedback — switches and amplifiers.**

Positive feedback amplifies its own input — output reinforces the conditions that produced it. It's much less common than negative feedback but plays critical roles where you need a sharp, decisive transition.

**Examples.**

- **Childbirth (oxytocin).** Cervical stretching triggers oxytocin release; oxytocin causes uterine contractions; contractions stretch the cervix more; more oxytocin; more contractions. The loop runs away until delivery, at which point the stretching stops and the loop terminates.
- **Blood clotting.** Platelet activation releases factors that activate more platelets; the cascade amplifies until a clot forms. Once tissue damage is sealed, the input stops and the loop terminates.
- **Action potential generation.** Membrane depolarization opens voltage-gated $Na^+$ channels, which lets more $Na^+$ in, which depolarizes the membrane more, which opens more $Na^+$ channels. The loop runs the membrane potential from $-70$ mV to $+30$ mV in $\\sim 1$ ms — generating the action-potential upstroke. The loop is then terminated by inactivation of $Na^+$ channels.
- **Fertilization.** Sperm-egg fusion triggers a $Ca^{2+}$ wave across the egg. The wave is positive-feedback amplified — local $Ca^{2+}$ rise releases more $Ca^{2+}$ from internal stores, which triggers more release nearby. The wave races across the egg, blocking polyspermy and starting development.
- **Cell-cycle commitment at the G1/S checkpoint.** Cyclin-CDK complexes activate transcription of more cyclin, which activates more CDK. Once the cell crosses the threshold, it commits to division.
- **Cytokine storms in immune signaling.** Inflammatory cytokines (TNF, IL-6) released by activated immune cells trigger more cytokine release. In normal infections this self-limits. In severe COVID-19 and sepsis, the loop runs away, producing organ damage.

**Why positive feedback is much rarer.** Without a termination mechanism, positive feedback runs to extinction or destruction. Biology only uses it when there's a clear off-switch — labor ends with delivery, clotting ends when tissue heals, action potentials end with $Na^+$ channel inactivation, fertilization $Ca^{2+}$ wave ends because the stores deplete. When the off-switch fails, the system pathologizes — cytokine storm being the canonical recent example.

**How to tell them apart on the AP exam.** If the response counteracts the disturbance and restores set point, it's negative feedback. If the response amplifies the disturbance, it's positive feedback. A few traps:

- A response that goes "in the same direction" as the input is positive feedback (amplifying). A response that goes "in the opposite direction" is negative.
- Negative feedback maintains stable steady states. Positive feedback drives transitions or amplification.
- A multi-step pathway that ends with the final product inhibiting an earlier step is feedback inhibition — a form of negative feedback.

**Feedforward — a third pattern.** In addition to feedback, biology uses **feedforward** — a signal that affects a target through two different routes. The most famous is the **incoherent feedforward loop**: signal X activates Y, and X also activates a repressor of Y. The result is a pulse: Y rises quickly, then is shut off by the repressor. This pattern shows up in transcriptional regulation everywhere and is a basic motif of systems biology.

**Homeostasis vs equilibrium.** A common conceptual mistake: homeostasis isn't equilibrium. Equilibrium means no net change (and usually no continued energy expenditure). Homeostasis is an active, energy-consuming process of maintaining a steady state far from equilibrium — corpses are at equilibrium with their surroundings; living things are not. Every negative-feedback loop in physiology runs against the natural drift toward equilibrium; it has to be powered by ATP-consuming machinery.`,
      video: {
        url: 'https://www.youtube.com/watch?v=zlfTuMupAGc',
        title: 'CrashCourse Biology — Feedback loops',
        provider: 'CrashCourse',
      },
    },
    {
      code: '4.6',
      title: 'The cell cycle',
      content:
`Every cell in a multicellular organism descends from a single fertilized egg, by a chain of divisions whose total count over a human lifetime is on the order of $10^{16}$. Each division is the culmination of a tightly choreographed sequence of events called the **cell cycle**: DNA is replicated, organelles are duplicated, the cell grows, chromosomes are sorted into two equal sets, and finally the cell physically divides into two daughters. The whole cycle takes about 24 hours in a typical proliferating human cell — but the timing varies enormously, from $\\sim 20$ minutes in early embryonic cells to weeks or never in slowly-dividing tissues.

**The four phases of the cell cycle.**

The cell cycle is divided into **interphase** (the long preparatory phase) and **M phase** (mitosis + cytokinesis, the actual division).

**Interphase** consists of three subphases:

1. **G1 phase** ("Gap 1"). The cell grows, synthesizes proteins and organelles, and prepares for DNA replication. This is also when most cells make the irrevocable commitment to divide — the "restriction point" near the end of G1. Cells that don't get the right signals (growth factors, attachment to substrate, adequate nutrients) pause here, entering a quiescent state called **G$_0$**. Most cells in your body — neurons, mature muscle fibers, some liver cells — are in G$_0$, possibly permanently.
2. **S phase** ("Synthesis"). DNA replication. Each chromosome is duplicated, producing two identical **sister chromatids** held together at the **centromere**. Histone synthesis matches DNA synthesis so that the new DNA can be packaged immediately. This phase takes $\\sim 6$–8 hours in a typical human cell.
3. **G2 phase** ("Gap 2"). Final preparations for mitosis. The cell continues to grow; quality-control checks ensure DNA replication is complete and no damage is present. If problems are detected, the cell cycle pauses here for repair.

**M phase** is mitosis (nuclear division) plus cytokinesis (cytoplasmic division). It takes $\\sim 1$ hour in a typical cell — short relative to interphase, but the most dramatic part of the cycle visually. Mitosis is conventionally split into five stages:

**Prophase.** Chromosomes condense from diffuse chromatin into compact rod-shaped structures visible under a light microscope. Each chromosome is now two sister chromatids held at the centromere. The nuclear envelope begins to break down. The **mitotic spindle** begins to form — microtubules emanating from two **centrosomes** (microtubule-organizing centers) that have moved to opposite poles of the cell.

**Prometaphase.** Nuclear envelope completely breaks down. Spindle microtubules attach to chromosomes at protein structures called **kinetochores** assembled on the centromeres. Each sister chromatid attaches to microtubules emanating from one pole; the two sisters attach to opposite poles.

**Metaphase.** Chromosomes align at the **metaphase plate** — the equatorial plane between the two poles. This alignment is the result of tug-of-war forces from microtubules at both poles, balanced when each chromosome is properly attached. The **spindle assembly checkpoint** verifies that every chromosome is correctly attached to both poles. The cell cycle pauses here until the checkpoint is satisfied.

**Anaphase.** Sister chromatids are separated. The molecular event: a protein complex called the **anaphase-promoting complex (APC/C)** tags the protein **cohesin** for destruction; cohesin had been holding the sister chromatids together at the centromere. With cohesin destroyed, spindle microtubules pull the sister chromatids apart toward opposite poles. Anaphase is the briefest phase, often complete in a few minutes.

**Telophase.** Sister chromatids (now considered chromosomes again — each daughter cell will get one set) reach the poles. Nuclear envelopes reform around each new set. Chromosomes begin to decondense. The cytoskeleton reorganizes for cytokinesis.

**Cytokinesis** is the physical division of the cell. In animal cells, an **actin–myosin contractile ring** pinches the cell in two, forming a **cleavage furrow** that deepens until the cell is split. In plant cells, the rigid cell wall prevents pinching; instead, vesicles from the Golgi assemble a new **cell plate** in the middle of the cell that grows outward to form a new cell wall separating the two daughters.

**Why the choreography matters.** The geometry of the spindle and the timing of cohesin destruction together guarantee that each daughter cell receives exactly one copy of each chromosome. Errors in this process produce **aneuploidy** — cells with the wrong chromosome number — which is almost always pathological. **Down syndrome** is caused by trisomy 21 (three copies of chromosome 21 instead of two), typically resulting from a meiotic nondisjunction in the egg. Most aneuploidies are embryonic lethal; those that aren't usually produce severe developmental disorders. Cancer cells are typically heavily aneuploid; chromosomal instability is one of the hallmarks of cancer.

**Genetic identity of daughter cells.** Mitosis produces two genetically identical daughter cells. Each starts with the same DNA sequence; under normal conditions, the only differences from the parent will be the rare new mutation introduced during DNA replication (rates around $10^{-9}$ per nucleotide per division). This is fundamentally different from **meiosis**, which produces four genetically distinct daughter cells (gametes) with half the chromosome number, and which is the subject of Unit 5.

**The cell cycle in different cell types.**

- **Early embryonic cells.** Cycle in $\\sim 20$ minutes (no growth phase — they're shrinking with each division until they reach normal size).
- **Skin epidermal cells, intestinal lining.** Cycle every few days. These tissues must continuously replace cells lost to wear and tear.
- **Bone marrow.** Cycles continuously to produce red blood cells, white blood cells, platelets.
- **Liver hepatocytes.** Usually in G$_0$ but can re-enter the cycle when liver is damaged — the liver has remarkable regenerative capacity.
- **Mature neurons, cardiac muscle cells.** Permanently in G$_0$. They do not divide. Damage to these tissues (stroke, heart attack) is not replaced by new cells — which is why the damage is so often permanent.
- **Cancer cells.** Cycle continuously without responding to normal stop signals. Most cancer chemotherapy drugs target dividing cells (which is also why they have severe side effects — they damage healthy dividing cells too).

**Chromosome counts through the cycle.** This trips up many students; it's worth keeping straight.

- A diploid human cell at the start of G1 has **2N = 46 chromosomes**, each a single chromatid. Total DNA content **= 2C**.
- After S phase: still 46 chromosomes (each now with 2 sister chromatids). Total DNA content **= 4C**.
- At metaphase: still 46 chromosomes (each with 2 sister chromatids), aligned at the plate.
- At anaphase: the sister chromatids separate. As they do, each becomes a separate chromosome. Briefly, the cell has 92 chromosomes (counting transiently before division completes).
- After cytokinesis: each daughter cell has 46 chromosomes (each a single chromatid), 2C DNA content. They've returned to the G1 state.

The chromosome count never strictly doubles — the DNA content does. Confusing terminology, but the AP exam loves testing this distinction.

**Time spent in each phase (typical proliferating cell, $\\sim 24$ h cycle).**

- G1: $\\sim 10$ h
- S: $\\sim 6$–8 h
- G2: $\\sim 3$–5 h
- M: $\\sim 1$ h

The vast majority of the cycle is interphase. The dramatic spindle ballet of mitosis is brief and intense.`,
      video: {
        url: 'https://www.youtube.com/watch?v=L0k-enzoeOM',
        title: 'CrashCourse Biology — Mitosis: Splitting up is complicated',
        provider: 'CrashCourse',
      },
    },
    {
      code: '4.7',
      title: 'Regulation of the cell cycle',
      content:
`The cell cycle is not allowed to run unchecked. At each major transition — G1/S, G2/M, the metaphase-to-anaphase transition — the cell pauses to verify that the previous phase finished correctly before committing to the next. These pauses are called **checkpoints**, and they are the difference between healthy proliferation and runaway division. Failures of cell-cycle control are the central pathology of cancer.

**The molecular machinery — cyclins and CDKs.**

The drivers of the cell cycle are pairs of proteins:

- **Cyclins** — proteins whose levels rise and fall periodically across the cycle. They are synthesized and degraded at specific phases.
- **Cyclin-dependent kinases (CDKs)** — kinases that are inactive on their own and only become active when bound to a cyclin.

Different cyclin-CDK combinations drive different phases:

- **Cyclin D + CDK4/6** drives entry into G1 in response to growth-factor signals.
- **Cyclin E + CDK2** drives the G1-to-S transition.
- **Cyclin A + CDK2** drives S phase.
- **Cyclin B + CDK1 (also called MPF — maturation-promoting factor)** drives entry into and progression through M phase.

As each cyclin rises, its CDK becomes active and phosphorylates dozens of downstream targets — proteins that initiate DNA replication, that condense chromosomes, that disassemble the nuclear envelope, etc. Then the cyclin is destroyed (by ubiquitin-mediated proteolysis), CDK falls silent, and the next cyclin rises. The cycle is essentially a relay race of cyclin-CDK pairs, each handing off to the next.

The discovery of cyclins (in sea urchin embryos, by Tim Hunt) and of the CDK family (by Paul Nurse and Lee Hartwell, in yeast) earned them all a shared Nobel Prize in 2001. It's one of the cleanest examples of fundamental science in invertebrate or yeast systems producing direct medical insight in humans.

**Checkpoints.**

**G1/S checkpoint (the "restriction point").** The most important checkpoint. The cell asks: do I have growth-factor signals to divide? Is my DNA intact? Are nutrients adequate? Am I big enough? If yes, the cell crosses the restriction point and commits to a full round of division. Once past the restriction point, the cell finishes the cycle even if growth factors are withdrawn. If any criterion fails, the cell pauses, either temporarily (waiting for conditions to improve) or permanently (entering G$_0$).

The key molecular player at G1/S is **Rb (the retinoblastoma protein)**. Rb in its unphosphorylated state binds and inhibits a transcription factor called **E2F**. When cyclin D + CDK4/6 (and then cyclin E + CDK2) phosphorylates Rb, the inhibition is released; E2F drives expression of S-phase genes; the cell enters S. Rb is one of the most important tumor suppressors. Loss of Rb function lets cells cross the restriction point without proper signals — they proliferate inappropriately. Retinoblastoma (a childhood eye cancer) was the first disease for which the **two-hit hypothesis** (both copies of a tumor suppressor must be lost) was established (Knudson, 1971).

**G2/M checkpoint.** Verifies that DNA replication is complete and undamaged before allowing entry into mitosis. Detection of DNA damage activates **ATM/ATR kinases**, which activate p53 (cell-cycle arrest or apoptosis) and inhibit the cyclin B + CDK1 complex needed for M-phase entry.

**Spindle assembly checkpoint (in M phase).** Before the anaphase-promoting complex destroys cohesin (allowing sister chromatids to separate), the spindle checkpoint verifies that every chromosome is properly attached to spindle microtubules from both poles. Even a single unattached kinetochore will keep this checkpoint engaged. The checkpoint protects against the wrong number of chromosomes ending up in daughter cells.

**p53 — the "guardian of the genome."**

p53 is a transcription factor activated by DNA damage. Once active, it transcribes:

- **p21**, an inhibitor of cyclin-CDK complexes, which halts the cell cycle. The pause allows time for DNA repair.
- **Pro-apoptotic genes** (Bax, Puma, Noxa) — if the damage is too severe to repair, p53 triggers apoptosis to remove the damaged cell entirely.

p53 thus has two complementary functions: pause the cycle for repair, or kill the cell if repair fails. Either way, damaged DNA does not get passed to daughter cells.

p53 is mutated in over half of all human cancers — the most commonly mutated tumor suppressor. **Li-Fraumeni syndrome** (germline p53 mutation) produces a $\\sim 90\\%$ lifetime risk of cancer, often multiple primary cancers in young people. The frequency of p53 mutations in tumors reflects how central it is to preventing cancer.

**External signals.**

The cell cycle responds to external signals through receptors and signal transduction pathways (Unit 4.2–4.3).

- **Growth factors** (EGF, PDGF, VEGF) bind RTKs, activate Ras-Raf-MEK-ERK, and ultimately drive cyclin D synthesis. Without growth factor, cyclin D is not made; the cell stays in G$_0$.
- **Contact inhibition.** Normal cells stop dividing when they touch their neighbors, sensing it through E-cadherin-mediated cell-cell contacts. Cancer cells lose this response — they "pile up" in culture and grow as solid masses in tissues.
- **Anchorage dependence.** Normal cells must be attached to the extracellular matrix to divide. Detached cells undergo **anoikis** (a form of apoptosis triggered by loss of attachment). Cancer cells often lose this requirement — letting them survive in circulation and form metastases.

**Loss of regulation = cancer.**

Cancer is fundamentally a disease of cell-cycle deregulation. The hallmarks of cancer (Hanahan & Weinberg) include:

- Sustained proliferative signaling (Ras mutations, HER2 amplification, autocrine growth factors)
- Evasion of growth suppressors (loss of Rb, loss of p53, loss of APC)
- Resistance to apoptosis (Bcl-2 overexpression, loss of p53)
- Limitless replicative potential (telomerase activation)
- Sustained angiogenesis (overexpression of VEGF, recruitment of blood vessels)
- Tissue invasion and metastasis (loss of E-cadherin, gain of invasive enzymes)
- Reprogrammed energy metabolism (Warburg effect — heavy use of glycolysis even with oxygen available)
- Evasion of immune destruction (PD-L1 expression on tumor cells)

Most cancers develop progressively over years to decades, accumulating mutations one at a time. Each successive mutation gives the cell a small selective advantage, and the population of cells expands until eventually a single lineage acquires the full set of hallmarks and becomes a malignant tumor.

**Apoptosis — programmed cell death.** When checkpoint signals indicate that a cell should not be allowed to continue, the cell is often instructed to kill itself. Apoptosis is a controlled, orderly process:

- The cell shrinks.
- The nucleus condenses.
- DNA is fragmented by endonucleases.
- The cell membrane blebs (forms bubble-like protrusions).
- The cell breaks into membrane-bounded apoptotic bodies that are recognized and engulfed by phagocytes without spilling their contents (avoiding inflammation).

The machinery is driven by **caspases**, a family of proteases activated in cascade. Apoptosis is essential to normal development (sculpting fingers from webbed embryonic hands; eliminating excess neurons during brain development), to immune function (removing infected or autoreactive cells), and to tumor prevention. Mutations that block apoptosis are central to many cancers.

**Drugs that target the cell cycle.** Most traditional chemotherapy drugs target dividing cells.

- **Paclitaxel (Taxol)** stabilizes microtubules, preventing spindle disassembly. Cells stuck in metaphase die.
- **Vincristine and vinblastine** prevent microtubule polymerization.
- **5-fluorouracil (5-FU)** blocks thymidylate synthesis, preventing DNA synthesis.
- **Cisplatin** crosslinks DNA, preventing replication.
- **Doxorubicin** intercalates DNA and inhibits topoisomerase.

The general approach: damage rapidly dividing cells more than slowly dividing ones. The side effects (hair loss, bone marrow suppression, GI damage) come from the same mechanism — these are the normal tissues with the highest division rates.

**CDK4/6 inhibitors** (palbociclib, ribociclib, abemaciclib) are newer, more targeted drugs that specifically block cyclin D + CDK4/6, used in hormone-receptor-positive breast cancer. They aim to be less toxic than older drugs by targeting a more specific molecular vulnerability.

**Cell-cycle regulation is one of the deepest unifying themes of biology.** Every cell that has ever divided has done so under the control of cyclins, CDKs, and checkpoints. The exam will test your ability to predict the consequences of disrupting any of these — from the level of a single molecule (what does Rb do?) up to the level of disease (what happens if p53 is lost?). Trace the disruption through the network; the consequences follow.`,
      video: {
        url: 'https://www.youtube.com/watch?v=L0k-enzoeOM',
        title: 'CrashCourse Biology — Mitosis and the cell cycle',
        provider: 'CrashCourse',
      },
    },
  ],
  keyConcepts: [
    'Four signaling categories: direct contact (juxtacrine), paracrine (local), endocrine (hormones, long-distance), autocrine (cell signals itself).',
    'Three steps in every signaling event: reception → transduction → response.',
    'Water-soluble ligands (peptides, catecholamines) → surface receptors → fast metabolic responses. Lipid-soluble (steroids, thyroid) → intracellular receptors → slow transcriptional responses.',
    'GPCRs (largest family, $\\sim 800$, $\\sim 1/3$ of drug targets) signal through G-proteins → adenylyl cyclase → cAMP → PKA. RTKs (insulin, EGFR, HER2) signal through Ras-Raf-MEK-ERK.',
    'Second messengers: cAMP, cGMP, IP$_3$, DAG, $Ca^{2+}$. Each amplifies signal $10^3$–$10^6$ fold.',
    'Negative feedback (homeostasis: glucose, temperature, pH, thyroid). Positive feedback (sharp transitions: labor, clotting, action potentials, fertilization).',
    'Cell cycle: G1 → S (DNA synthesis) → G2 → M (mitosis + cytokinesis). G$_0$ = quiescent, can be permanent.',
    'Mitosis stages: prophase → prometaphase → metaphase → anaphase → telophase. Cytokinesis follows (cleavage furrow in animals; cell plate in plants).',
    'Cyclins + CDKs drive cycle progression. Cyclin D/CDK4/6 (G1 entry), cyclin E/CDK2 (G1→S), cyclin B/CDK1 (M entry).',
    'Checkpoints: G1/S (restriction point — Rb), G2/M (DNA damage), spindle assembly (chromosome attachment).',
    'p53 = "guardian of the genome." Activated by DNA damage. Halts cycle (via p21) or triggers apoptosis. Mutated in $> 50\\%$ of cancers.',
    'Cancer = cell-cycle deregulation. Hallmarks: proliferative signaling, evasion of suppressors, anti-apoptosis, limitless replication, angiogenesis, invasion, metabolic reprogramming, immune evasion.',
  ],
  formulas: [
    {
      name: 'Phosphorylation cascade amplification',
      equation: '$1 \\to 10 \\to 100 \\to 10^3 \\to 10^6$',
      meaning: 'Each step in a kinase cascade activates many copies of the next, multiplying the signal. One hormone molecule can yield millions of downstream events.',
      example: 'Glucagon binding one liver cell receptor: $\\sim 10$ G-proteins activated, $\\sim 100$ cAMP made, many PKA tetramers activated, eventually millions of glucose released from glycogen.',
    },
    {
      name: 'Resting vs. activated cytoplasmic $Ca^{2+}$',
      equation: '$[Ca^{2+}]_{rest} \\approx 0.1\\,\\mu M;\\;\\; [Ca^{2+}]_{active} \\approx 1\\,\\mu M$',
      meaning: 'A 10-fold rise in cytoplasmic $Ca^{2+}$ is enough to trigger many cellular responses. The gradient is maintained by pumps in the ER and plasma membrane.',
      example: 'IP$_3$ binds ER channels → $Ca^{2+}$ rises → calmodulin and many other targets activated → muscle contraction, neurotransmitter release, etc.',
    },
    {
      name: 'Chromosome and DNA content through the cycle',
      equation: '$2N\\,2C \\to 2N\\,4C \\to 2N\\,4C \\to 2 \\times (2N\\,2C)$',
      meaning: 'Across G1 → after S → through M → after cytokinesis. Chromosome count stays at 2N until anaphase; DNA content doubles in S.',
      example: 'A human cell starts at 46 chromosomes, $2C$ DNA. After S: 46 chromosomes (each with 2 sister chromatids), $4C$. After mitosis: two daughter cells with 46 chromosomes and $2C$ each.',
    },
  ],
  practice: [
    {
      q: 'Epinephrine binds $\\beta_1$-adrenergic receptors on a cardiac muscle cell. Predict the chain of events from receptor binding to increased heart contractility.',
      a: 'Epinephrine binds $\\beta_1$-receptor (a GPCR). G$\\alpha_s$ activates adenylyl cyclase. Adenylyl cyclase makes cAMP. cAMP activates PKA. PKA phosphorylates voltage-gated $Ca^{2+}$ channels (more $Ca^{2+}$ enters per action potential), phospholamban (so SR $Ca^{2+}$-ATPase runs faster, recovering quickly), and troponin I (so contraction is faster). Net effect: stronger, faster heart contractions.',
    },
    {
      q: 'Why does the cell cycle have multiple checkpoints?',
      a: 'Each checkpoint guards a specific transition against a specific error. G1/S verifies external signals and DNA integrity before committing to a full cycle. G2/M verifies DNA replication is complete and undamaged before mitosis. The spindle assembly checkpoint verifies chromosome attachment before separating sisters. Multiple checkpoints provide redundancy — DNA damage at G1/S, leftover replication at G2/M, attachment errors at spindle assembly. Without these checks, daughter cells would accumulate errors.',
    },
    {
      q: 'Cholera toxin locks G$\\alpha_s$ in the GTP-bound state. Predict the effect on intestinal epithelial cells.',
      a: 'G$\\alpha_s$ is constitutively active. Adenylyl cyclase runs continuously. cAMP accumulates. PKA continuously phosphorylates CFTR chloride channels, which stay open. $Cl^-$ pumps into the gut lumen; water follows osmotically. Result: liters of watery diarrhea per day, severe dehydration, death without rehydration therapy.',
    },
    {
      q: 'A mutation in Ras prevents it from hydrolyzing GTP. Predict the consequence for the cell.',
      a: 'Ras is normally activated transiently — GDP exchanged for GTP, then GTP hydrolyzed to GDP. A mutation that prevents GTP hydrolysis locks Ras in the active state. The MAP kinase cascade (Raf → MEK → ERK) runs continuously without growth factor input. Cell-cycle entry signals are constitutively on. The cell proliferates without external signals — a key step toward cancer. Ras mutations are present in $\\sim 30\\%$ of all human cancers.',
    },
    {
      q: 'Contrast negative and positive feedback. Give one physiological example of each.',
      a: 'Negative feedback: output dampens its own input → restores set point → maintains stable steady state. Example: high blood glucose → insulin secretion → glucose uptake → blood glucose falls. Positive feedback: output amplifies its own input → drives sharp transitions. Example: childbirth — cervical stretching → oxytocin → uterine contractions → more stretching → more oxytocin. Positive feedback always requires a termination mechanism or it runs to destruction.',
    },
    {
      q: 'p53 is mutated in over half of human cancers. Why is loss of p53 so catastrophic?',
      a: 'p53 has two protective roles: (1) when DNA damage is detected, p53 induces p21 to halt the cell cycle, giving time for repair; (2) if damage is too severe, p53 triggers apoptosis to eliminate the damaged cell. Loss of p53 means damaged cells aren\'t paused for repair (errors accumulate) and aren\'t killed (damaged cells continue dividing). Either failure mode lets mutations accumulate; combined, they accelerate cancer development substantially.',
    },
  ],
  pitfalls: [
    '"Steroid hormones bind cell-surface receptors" — wrong. They cross the membrane and bind intracellular receptors that act as transcription factors.',
    '"All signaling pathways are linear" — they\'re networks. Cross-talk between pathways is the norm; the cell integrates many signals.',
    '"Mitosis produces genetically diverse daughter cells" — wrong. Mitosis is genetically identical. Meiosis produces diversity.',
    '"After S phase, the cell has 92 chromosomes" — wrong. It has 46 chromosomes, each with 2 sister chromatids (so 92 chromatids but 46 chromosomes). The chromosome count doesn\'t change until sister chromatids separate at anaphase.',
    '"Homeostasis = equilibrium" — wrong. Equilibrium is a dead state with no net change. Homeostasis is an active steady state maintained against the natural drift toward equilibrium.',
    '"Positive feedback is dangerous and shouldn\'t happen" — wrong. It\'s essential for sharp transitions (action potentials, labor, clotting) — but it must have a built-in termination mechanism.',
    '"Cancer is one disease" — cancer is hundreds of diseases sharing common hallmarks but caused by different mutations in different pathways.',
    '"Apoptosis = necrosis" — both are cell death but very different. Apoptosis is orderly, controlled, doesn\'t trigger inflammation. Necrosis is messy, spills cell contents, triggers inflammation.',
  ],
};
