// AP Biology Unit 6 — Gene Expression and Regulation (12-16% of exam)
// APES-standard depth. LaTeX math via $...$ delimiters.

export const APBIO_UNIT_6 = {
  number: 6,
  title: 'Gene Expression and Regulation',
  weight: '12-16%',
  subunits: [
    {
      code: '6.1',
      title: 'DNA and RNA structure',
      content:
`DNA (deoxyribonucleic acid) is the molecule that stores genetic information in essentially all living things. Its structure was worked out in 1953 by James Watson and Francis Crick, based crucially on X-ray diffraction images produced by Rosalind Franklin and Maurice Wilkins. The structural discovery — that DNA is a double helix with paired bases — immediately suggested how genetic information could be stored and copied, launching molecular biology. Understanding DNA structure is the entry point to the rest of Unit 6 and to modern biology broadly.

**Nucleotides — the building blocks.**

DNA and RNA are both polymers made of **nucleotides**. Each nucleotide has three components:

1. **A five-carbon sugar** (pentose): **deoxyribose** in DNA, **ribose** in RNA. The difference is a single hydroxyl group ($-OH$) at the 2' carbon in ribose vs a hydrogen in deoxyribose. This small difference has big consequences — ribose is more chemically reactive, which is why DNA (with deoxyribose) is more stable for long-term information storage.

2. **A phosphate group**: $PO_4^{3-}$, negatively charged at physiological pH. Attached to the 5' carbon of the sugar.

3. **A nitrogenous base**: attached to the 1' carbon. Comes in two categories:
   - **Purines** (double-ring): **adenine (A)** and **guanine (G)**.
   - **Pyrimidines** (single-ring): **cytosine (C)**, **thymine (T)** in DNA, **uracil (U)** in RNA.

DNA bases: A, T, G, C.
RNA bases: A, U, G, C. (Uracil replaces thymine.)

**The phosphate-sugar backbone.**

Nucleotides link together via phosphodiester bonds between the 3' hydroxyl of one sugar and the 5' phosphate of the next. This forms a chain with a phosphate-sugar-phosphate-sugar backbone; bases stick out to the side.

**Directionality**: DNA/RNA strands have polarity — one end has a free 5' phosphate; the other has a free 3' hydroxyl. Convention: sequences are written **5' to 3'**. So the sequence "ATCG" means 5'-A-T-C-G-3'.

**DNA structure — the double helix.**

DNA is typically found as a **double helix** — two strands wound around each other. Key features:

- **Antiparallel** strands: one runs 5' to 3' in one direction; the other runs 5' to 3' in the opposite direction. Like two roads going opposite ways.

- **Base pairs on the inside**: bases from one strand pair with bases from the other via hydrogen bonds. The backbone is on the outside.

- **Complementary base pairing**:
  - **A pairs with T** (in DNA) via 2 hydrogen bonds.
  - **G pairs with C** via 3 hydrogen bonds.
  - **In RNA**, A pairs with U (also 2 hydrogen bonds).

Base pairing is very specific: A only pairs with T (or U), G only with C. This specificity is due to the geometry of the bases and the positions of hydrogen bond donors and acceptors.

- **Base pair spacing**: about 0.34 nm apart along the axis. One full turn of the double helix is about 3.4 nm (10 base pairs per turn).

**Chargaff's rules** — established by Erwin Chargaff before the structure was known:
- In any DNA sample: [A] = [T] and [G] = [C].
- The ratio [A+T]/[G+C] varies by species.

These rules directly reflect the base-pairing rules. In double-stranded DNA, every A on one strand pairs with a T on the other; every G with a C. So the amounts must be equal.

**Genome size and organization.**

Different organisms have different genome sizes:
- Bacteria: typically millions of base pairs (Mb). *E. coli* has about 4.6 Mb.
- Fungi: 12-40 Mb (yeast is about 12 Mb).
- Plants: highly variable — some plants have small genomes ($\\sim$ 130 Mb for *Arabidopsis*), others are huge ($\\sim$ 150 Gb for some ferns and lily plants).
- Humans: about 3.2 Gb (3.2 billion base pairs), across 46 chromosomes.
- Most complex: human genome is not particularly large by biological standards.

**Chromosome structure.**

In eukaryotes, DNA is packaged with proteins into chromosomes.

- **Histones**: small basic proteins around which DNA wraps.
- **Nucleosome**: DNA wrapped ~1.65 times around a histone octamer (~147 bp). The basic unit of chromatin.
- **Chromatin**: DNA + histones + other proteins. Two forms:
  - **Euchromatin**: loose, actively expressed regions.
  - **Heterochromatin**: densely packed, transcriptionally inactive.
- **Chromosomes**: highly condensed chromatin, visible during cell division.

The packaging is dramatic — a single human chromosome contains a DNA molecule that, if stretched out, would be several centimeters long, packed into a structure a few micrometers across. That's compaction by a factor of ~10,000.

**Prokaryotic DNA organization**:
- Single circular chromosome in the nucleoid region (no nuclear membrane).
- No histones (though some archaea have histone-like proteins).
- Often additional small circular DNA molecules called **plasmids** that carry accessory genes (antibiotic resistance, virulence factors, etc.).

**RNA structure.**

RNA is usually single-stranded (though can fold into complex structures). Compared to DNA:
- Ribose instead of deoxyribose.
- Uracil instead of thymine.
- Usually single-stranded.
- Shorter and less stable.

**Three main types of RNA** in cells (there are others):

- **Messenger RNA (mRNA)**: carries genetic information from DNA to ribosomes. Templated on DNA during transcription.
- **Transfer RNA (tRNA)**: brings amino acids to the ribosome during translation. About 40-60 different tRNAs per cell.
- **Ribosomal RNA (rRNA)**: forms structural and catalytic core of ribosomes.

Other RNAs: microRNA (miRNA), small interfering RNA (siRNA), long non-coding RNA (lncRNA), and many more — most involved in regulation.

**Why the structure matters.**

The double-helical, complementary structure of DNA has several profound implications:

1. **Storage**: information is encoded in the base sequence — enormous storage capacity.
2. **Replication**: complementary strands allow accurate copying. Each strand serves as template for the other (see 6.2).
3. **Repair**: damaged DNA can be repaired using the complementary strand as template.
4. **Transcription**: one strand can serve as template for RNA synthesis (see 6.3).
5. **Evolution**: mutations (changes to the sequence) provide raw material for evolution.

**Historical note.** The discovery of DNA structure is one of the great stories in science:
- **Rosalind Franklin**'s X-ray diffraction photograph (Photo 51, 1952) provided the crucial data about DNA's helical structure and dimensions.
- **Watson and Crick** (1953) proposed the double helix model.
- **Nobel Prize (1962)** to Watson, Crick, and Wilkins (Franklin having died of cancer in 1958).

Franklin's role has been increasingly recognized as decisive; her data was essential but she wasn't included in the Nobel (which isn't awarded posthumously) and her contribution was underappreciated for decades. Modern accounts fully credit her.

**Central Dogma of Molecular Biology** (Francis Crick, 1958):

$$\\text{DNA} \\to \\text{RNA} \\to \\text{Protein}$$

DNA stores information; RNA carries it; protein does the work. This "flow of information" from DNA through RNA to protein is the framework for all of gene expression. It has been refined with exceptions (reverse transcription in retroviruses; DNA can be modified by RNA; proteins can be modified post-translationally) but remains the core organizing principle.

**Genome vs proteome vs transcriptome**:
- **Genome**: all the DNA in a cell (or organism).
- **Transcriptome**: all the RNA transcripts present in a cell at a given time.
- **Proteome**: all the proteins present in a cell at a given time.

The genome is fixed (essentially); the transcriptome and proteome vary depending on which genes are expressed, environmental conditions, cell type, and other factors.

**Every cell in a multicellular organism has the same DNA** (with minor exceptions — some immune cells edit their DNA during development; cancer cells accumulate mutations). But different cell types express different subsets of genes, producing very different phenotypes from the same genome. Gene regulation (see 6.5) determines what gets expressed in which cells.

This structural foundation — DNA's precise arrangement, its base-pairing rules, its capacity for storage, replication, transcription — is the beginning of everything else in molecular biology. The subsequent subunits build on this foundation.`,
      video: {
        url: 'https://www.youtube.com/watch?v=oh5Q1lyv-vc',
        title: 'CrashCourse Biology — DNA structure and replication',
        provider: 'CrashCourse',
      },
    },
    {
      code: '6.2',
      title: 'DNA replication',
      content:
`For genetic information to pass from one generation to the next, DNA must be copied. **DNA replication** is the process by which cells duplicate their DNA before dividing. The process is remarkably accurate — a typical mammalian cell copies its 3.2 billion base-pair genome with only about 1 error per 100 million bases (after proofreading). It's also fast — a bacterial cell can copy its 4.6 million base-pair genome in about 20 minutes. Understanding how replication works is essential for understanding cell division, genetic disease, cancer, and biotechnology.

**Semi-conservative replication.**

DNA replication is **semi-conservative**: each new DNA molecule consists of one original (parental) strand and one newly synthesized strand.

Alternative models that were considered but rejected:
- **Conservative**: parental double helix stays intact; new double helix made from scratch. Wrong.
- **Dispersive**: parental and new DNA mixed throughout both new molecules. Wrong.

The semi-conservative model was demonstrated by the elegant **Meselson-Stahl experiment (1958)**:
- Grew *E. coli* in medium containing heavy nitrogen ($^{15}N$) until all DNA contained $^{15}N$.
- Switched to normal ($^{14}N$) medium.
- Extracted DNA at intervals; separated by density in cesium chloride gradient.
- Semi-conservative model predicted: after one replication, all DNA should be hybrid ($^{15}N$/$^{14}N$); after two replications, half hybrid and half $^{14}N$/$^{14}N$. This matched observations exactly.

**Where replication happens.**

- Prokaryotes: single circular chromosome has one **origin of replication**. Bidirectional replication proceeds from the origin, meeting at a single termination point.
- Eukaryotes: linear chromosomes have **many origins** (thousands per chromosome). Replication proceeds bidirectionally from each origin, and adjacent replication bubbles merge.

The multiple origins in eukaryotes are necessary because DNA replication is slow (~1000 bases per second in prokaryotes, ~50 bases per second in eukaryotes). Eukaryotic genomes are big; a single origin would take too long.

**The replication fork.**

At each origin, DNA is unwound and two **replication forks** form (one going in each direction). Each fork is a Y-shaped structure where the DNA is being unwound and copied.

**Key enzymes at the replication fork.**

**Helicase**: unwinds the double helix by breaking hydrogen bonds between paired bases. Uses ATP.

**Single-stranded DNA binding proteins (SSBs)**: bind to the separated strands to prevent them from re-annealing.

**Topoisomerase**: relieves the tension caused by unwinding. As helicase unwinds DNA, the region ahead of it becomes over-wound (supercoiled). Topoisomerase cuts, unwinds, and reseals DNA to relieve this tension.

**Primase**: synthesizes short RNA primers (~10 nucleotides) that provide a starting point for DNA synthesis. Necessary because DNA polymerase can only extend existing chains, not initiate new ones.

**DNA polymerase**: the main synthesizing enzyme. Adds nucleotides to the 3' end of a growing strand, based on the template. Multiple types of DNA polymerase (DNA pol III does main synthesis in prokaryotes; DNA pol α, δ, ε in eukaryotes).

**DNA ligase**: joins DNA fragments together.

**5' → 3' polarity — the critical constraint.**

DNA polymerase can only add nucleotides to the **3' end** of a growing strand. It cannot add to the 5' end. This constraint creates a problem because the two strands of DNA are antiparallel.

**Leading strand**: synthesized continuously in the 5' → 3' direction toward the replication fork. As helicase unwinds DNA, polymerase can just keep adding nucleotides.

**Lagging strand**: has to be synthesized in fragments because DNA polymerase would need to run in the wrong direction to move with the fork. Instead:
- **Okazaki fragments**: short segments (~100-200 nucleotides in eukaryotes, ~1000-2000 in prokaryotes) synthesized in the 5' → 3' direction, but the fragments themselves progress "backward" relative to the fork.
- Each Okazaki fragment starts with a new RNA primer laid down by primase.
- After synthesis, RNA primers are replaced with DNA (by DNA polymerase I in prokaryotes; by RNase H and DNA polymerase in eukaryotes).
- **DNA ligase** joins adjacent Okazaki fragments together.

This asymmetry — continuous leading strand, discontinuous lagging strand — is a beautiful consequence of the antiparallel structure of DNA combined with the 5' → 3' constraint on polymerase.

**Base pairing during replication.**

DNA polymerase reads the template strand and adds the complementary nucleotide (A pairs with T, G pairs with C). The complementary base pair is stabilized by hydrogen bonds and by the correct geometry that fits DNA polymerase's active site.

**Proofreading and repair.**

DNA polymerase has **3' → 5' exonuclease activity** — it can back up and remove an incorrectly added nucleotide, then try again. This proofreading reduces error rate by ~100-fold.

**Additional repair mechanisms** further reduce errors:
- **Mismatch repair**: detects mismatched bases in newly synthesized DNA and corrects them.
- **Nucleotide excision repair**: removes damaged bases (e.g., UV-induced pyrimidine dimers).
- **Base excision repair**: fixes small chemical modifications to bases.
- **Homologous recombination and non-homologous end joining**: repair double-strand breaks.

Loss of DNA repair genes causes disease and cancer:
- **BRCA1 and BRCA2**: mutations in DNA repair genes strongly increase risk of breast and ovarian cancer.
- **Xeroderma pigmentosum**: mutations in nucleotide excision repair; extreme sensitivity to UV; very high skin cancer risk.
- **Lynch syndrome (HNPCC)**: mutations in mismatch repair; high colorectal cancer risk.

**Telomeres and the end-replication problem.**

Linear chromosomes have ends called **telomeres**. Telomere DNA is a repetitive sequence (TTAGGG in vertebrates) repeated hundreds to thousands of times.

Each replication cycle shortens telomeres by a small amount because DNA polymerase can't fully copy the very ends. This is called the **end-replication problem**.

**Telomerase**: an enzyme that extends telomeres. Active in:
- Germ cells (so gametes have full-length telomeres).
- Stem cells (some).
- Most cancer cells (which need to keep dividing indefinitely).

In most somatic cells, telomerase is not active. As cells divide, telomeres shorten. When they get too short, cells stop dividing (**cellular senescence**) or die. This limits the number of times a normal cell can divide (**Hayflick limit** — about 40-60 divisions).

Telomere shortening is one of the mechanisms behind aging and one of the barriers cells must overcome to become cancerous.

**Elizabeth Blackburn**, Carol Greider, and Jack Szostak won the 2009 Nobel Prize for discovering telomerase.

**Speed and accuracy of replication.**

- **E. coli DNA polymerase**: adds ~1000 nucleotides per second.
- **Human DNA polymerase**: adds ~50 nucleotides per second.
- **Error rate** (post-proofreading): ~1 in $10^7$ (bacteria); ~1 in $10^9$-$10^{10}$ (humans, after all repair mechanisms).

Given the human genome's 3.2 billion base pairs, an error rate of $10^{-9}$ means about 1-3 replication errors per cell division. Most are corrected; a few slip through to become mutations.

**Comparison to other cellular processes.**

DNA replication is one of the most accurate biological processes:
- Transcription (RNA synthesis): error rate ~$10^{-4}$.
- Translation (protein synthesis): error rate ~$10^{-4}$.
- DNA replication: error rate ~$10^{-9}$ (after all correction).

The dramatically higher accuracy of DNA replication reflects the importance of preserving genetic information across generations. Transcription and translation errors affect only a single cell temporarily; DNA replication errors are inherited.

**Applications and biotechnology.**

Understanding DNA replication has enabled:

- **PCR (polymerase chain reaction)**: uses heat-stable DNA polymerase (Taq, from *Thermus aquaticus*) to amplify DNA in vitro. Invented by Kary Mullis (1983); Nobel Prize 1993. Foundation of modern molecular biology.

- **DNA sequencing**: Sanger sequencing uses chain-terminating dideoxynucleotides to determine sequences. Next-generation sequencing dramatically increased speed and reduced cost.

- **Genetic testing**: relies on DNA replication and PCR.

- **DNA fingerprinting**: for forensics, paternity testing, ancient DNA analysis.

- **Antibiotic and cancer drug development**: some drugs target replication (e.g., ciprofloxacin blocks bacterial topoisomerase; chemotherapy drugs like cisplatin damage DNA to prevent replication in cancer cells).

**The bigger picture.** DNA replication is the process that makes life possible. It preserves genetic information across generations while allowing enough variation (through occasional errors) for evolution. The machinery is elegant, ancient (conserved across all cellular life), and the target of both natural selection and biomedical intervention.`,
      video: {
        url: 'https://www.youtube.com/watch?v=oh5Q1lyv-vc',
        title: 'CrashCourse Biology — DNA replication',
        provider: 'CrashCourse',
      },
    },
    {
      code: '6.3',
      title: 'Transcription and RNA processing',
      content:
`**Transcription** copies the information from a DNA gene into an RNA molecule. Unlike replication (which produces a complete duplicate), transcription copies only specific genes when they're needed. Transcription is the first step in gene expression — the "expression" of the information stored in DNA into the RNA and eventually protein that actually does work in cells.

**Transcription overview.**

DNA is the master copy; RNA is a working copy. The main product of transcription is **messenger RNA (mRNA)**, which will be translated into protein. But transcription also produces other RNAs: ribosomal RNA (rRNA), transfer RNA (tRNA), small nuclear RNA (snRNA), microRNA (miRNA), and others.

**Machinery: RNA polymerase.**

**RNA polymerase** is the enzyme that catalyzes transcription. Similar to DNA polymerase in some ways:
- Reads DNA template.
- Synthesizes RNA 5' → 3'.
- Uses complementary base pairing to select nucleotides.

Differences from DNA polymerase:
- Uses ribonucleotide triphosphates (ATP, GTP, CTP, UTP), not deoxyribonucleotides.
- Incorporates U instead of T (pairs with A).
- Does not require a primer.
- No proofreading (or very limited).
- Higher error rate (~$10^{-4}$).

**Prokaryotes** have one type of RNA polymerase for all RNA types.

**Eukaryotes** have three main RNA polymerases:
- **RNA pol I**: makes most rRNA.
- **RNA pol II**: makes mRNA and some small RNAs.
- **RNA pol III**: makes tRNA and 5S rRNA.

**Steps of transcription.**

**1. Initiation.**

RNA polymerase binds to a specific DNA sequence called a **promoter** — a region upstream (5') of the gene that signals "start transcription here."

In prokaryotes, the promoter includes:
- **-10 box (Pribnow box, TATAAT)**: about 10 base pairs before the start.
- **-35 box (TTGACA)**: about 35 bases before the start.

In eukaryotes:
- **TATA box**: about 25-30 bases upstream. Bound by TATA-binding protein (TBP), part of the transcription factor TFIID.
- **Other transcription factors** bind various promoter and enhancer sequences.

**Transcription factors**: proteins that bind DNA regulatory sequences and either activate or repress transcription. In eukaryotes, dozens of transcription factors must assemble before RNA polymerase can initiate transcription.

**2. Elongation.**

RNA polymerase unwinds DNA and reads the template strand 3' → 5', synthesizing RNA 5' → 3'. As transcription proceeds, the DNA re-anneals behind the polymerase.

**Template strand** (also called antisense or non-coding strand): the strand actually read by RNA polymerase.

**Coding strand** (also called sense or non-template strand): the other strand. The mRNA sequence is identical to this strand (except U instead of T).

If the template is 3'-TACGGATTCAG-5', the RNA is 5'-AUGCCUAAGUC-3'.

**Speed**: RNA polymerase transcribes ~50-100 nucleotides per second in prokaryotes.

**3. Termination.**

Different in prokaryotes and eukaryotes.

**Prokaryotes**: two main mechanisms:
- **Rho-independent (intrinsic)** termination: a specific sequence forms a hairpin that destabilizes the RNA-DNA hybrid.
- **Rho-dependent** termination: a protein (Rho) chases the polymerase and pulls off the RNA.

**Eukaryotes**: for mRNA (RNA pol II), termination involves cleavage at a specific site followed by dissociation. The polyadenylation signal (AAUAAA) triggers cleavage.

**RNA processing (in eukaryotes only).**

In prokaryotes, transcription and translation happen simultaneously in the same cellular compartment. The mRNA is used immediately.

In eukaryotes, transcription happens in the nucleus; the mRNA must be processed before being exported to the cytoplasm for translation. Three main processing events:

**1. 5' capping.**

A modified guanine (7-methylguanosine) is added to the 5' end of the mRNA. Functions:
- Protects mRNA from degradation.
- Signals ribosomes to bind for translation.
- Facilitates export from the nucleus.

Happens co-transcriptionally, before the mRNA is even fully synthesized.

**2. 3' polyadenylation.**

A tail of $\\sim 200$ adenines (poly-A tail) is added to the 3' end. Functions:
- Protects from degradation (mRNAs with shorter tails are degraded faster).
- Facilitates export.
- Enhances translation efficiency.

**3. Splicing.**

Eukaryotic genes typically have their coding sequences interrupted by non-coding sequences.

**Exons**: expressed (coding) sequences. These end up in the mature mRNA.

**Introns**: intervening (non-coding) sequences. These are removed during splicing.

Typical human gene: 8-9 exons averaging 145 bp each, with introns averaging 3300 bp each. The introns are 20+ times longer than the exons on average.

**Splicing** is performed by the **spliceosome** — a huge complex of proteins and small nuclear RNAs (snRNAs, sometimes called snurps). The spliceosome:
- Recognizes specific sequences at intron boundaries.
- Cuts out the intron.
- Joins the flanking exons.

Splicing is remarkable: precise, catalyzed by RNA (as with the ribosome), and evolutionarily ancient.

**Alternative splicing**: many eukaryotic genes can be spliced in multiple ways, producing different mature mRNAs from the same primary transcript. Different mRNAs encode different (usually related) protein isoforms. This dramatically expands the number of proteins that a genome can produce.

Example: the *Dscam* gene in *Drosophila* can produce over 38,000 different mRNAs through alternative splicing. Humans have about 20,000 protein-coding genes but produce over 80,000 different proteins largely because of alternative splicing.

**Why introns?** Introns' function is still debated:
- **Alternative splicing potential**: allows one gene to encode multiple proteins.
- **Gene evolution**: introns can allow exon shuffling and new gene formation.
- **Regulation**: some introns contain regulatory sequences.
- **RNA-based regulation**: intron RNA can be involved in various regulatory processes.

Bacteria (which lack most introns) have compact genomes. Complex organisms have more introns and gene splicing sophistication.

**mRNA export.**

Processed mRNAs are exported from the nucleus through nuclear pores. Signals (like the cap and polyadenylation) mark mRNAs for export. Improperly processed transcripts are held back and degraded.

**mRNA lifetime.**

Once in the cytoplasm, mRNAs are translated (multiple times) and eventually degraded. Half-lives range from minutes (in bacteria) to hours or days (in some eukaryotic cells).

Degradation rates are regulated — different mRNAs are stabilized or destabilized by cellular signals. This is one mechanism of gene expression control.

**The link to protein synthesis.**

Once mRNA is exported (or, in prokaryotes, as soon as it's transcribed), ribosomes bind and translate it into protein. Multiple ribosomes can translate a single mRNA simultaneously — this arrangement is called a **polysome**.

**Summary: from gene to protein (in a eukaryote).**

1. DNA (nuclear) → primary transcript (pre-mRNA) by transcription.
2. Pre-mRNA → mature mRNA by 5' capping, 3' polyadenylation, and splicing.
3. Mature mRNA → exported through nuclear pores.
4. mRNA → protein by translation (in the cytoplasm, at ribosomes).

**Historical importance.**

The discovery of transcription and its details unfolded over the 1950s-1980s:
- **RNA polymerase** discovered 1959-1961.
- **Codon-mRNA relationship** worked out 1961-1966 (Nirenberg and others).
- **Split genes (introns)** discovered 1977 (Roberts and Sharp; Nobel Prize 1993).
- **Alternative splicing** recognized 1980s.
- **Ribozymes** (catalytic RNA, including the spliceosome and ribosome) discovered 1980s (Cech, Altman; Nobel 1989).

These discoveries transformed molecular biology from the initial simple picture (DNA → RNA → protein, one gene one protein) to something much richer and more nuanced.`,
      video: {
        url: 'https://www.youtube.com/watch?v=itsb2SqR-R0',
        title: 'CrashCourse Biology — Transcription',
        provider: 'CrashCourse',
      },
    },
    {
      code: '6.4',
      title: 'Translation',
      content:
`**Translation** is the process by which the information in mRNA is used to synthesize protein. It's called translation because the language changes: from the 4-letter alphabet of nucleic acids (A, U, G, C in RNA) to the 20-letter alphabet of amino acids in proteins. The machinery is the **ribosome**, a huge molecular assembly of RNA and proteins. Translation is the culmination of the "central dogma" — the step where genetic information becomes the working machinery of the cell.

**The genetic code.**

The genetic code specifies which amino acids correspond to which mRNA sequences. Key features:

- **Three-nucleotide codons**: each codon in mRNA is three nucleotides long. With 4 possible nucleotides at each of 3 positions, there are $4^3 = 64$ possible codons.
- **20 amino acids**: encoded by these 64 codons.
- **Redundancy (degeneracy)**: most amino acids are encoded by multiple codons. E.g., leucine is encoded by 6 different codons.
- **Start codon**: AUG (also codes for methionine). Signals "begin translation here."
- **Stop codons**: UAA, UAG, UGA. Signal "stop." Don't code for any amino acid.
- **Nearly universal**: essentially all living organisms use the same genetic code. Some minor variations exist (some mitochondria have slightly different codes).

**Reading the genetic code table.** For any codon, you look up which amino acid it encodes. Standard practice is a 4×4×4 table.

Key codons:
- **AUG**: Methionine (Met) / Start.
- **UAA, UAG, UGA**: Stop codons.
- **CCU, CCC, CCA, CCG**: All code for Proline.
- Etc.

**Universality of the code**. The nearly universal genetic code is powerful evidence for common ancestry — all extant life inherited this coding system from a common ancestor (LUCA — Last Universal Common Ancestor).

**Reading frame**: how the mRNA is divided into codons. A single mRNA has 3 possible reading frames; only one is typically the "correct" frame (the one that produces functional protein). A frameshift mutation (insertion or deletion of a non-multiple-of-3 nucleotides) shifts the reading frame, usually catastrophically altering the protein.

**Molecular players in translation.**

**Ribosome**: the machinery. Has two subunits (large and small). Each subunit is a complex of proteins and rRNAs.
- Prokaryotic ribosome: 70S (30S small + 50S large).
- Eukaryotic ribosome: 80S (40S small + 60S large).
- The mitochondrial and chloroplast ribosomes are 70S (bacterial size — reflects their bacterial origin).

**Ribosome structure and function**:
- The **small subunit** binds mRNA.
- The **large subunit** contains the peptidyl transferase active site — catalyzes peptide bond formation.
- Both subunits together create three tRNA binding sites: **A** (aminoacyl), **P** (peptidyl), **E** (exit).

The ribosome's catalytic activity is performed by RNA (not protein). It is thus a **ribozyme**. This provides evidence that RNA-based catalysis is ancient.

**mRNA**: the message being read. Contains the codon sequence to be translated.

**Transfer RNA (tRNA)**: brings amino acids to the ribosome. Key features:
- ~76 nucleotides long, folded into a distinctive cloverleaf shape.
- **Anticodon**: three nucleotides that base-pair with an mRNA codon.
- **Amino acid attachment site**: the 3' end (CCA), where the appropriate amino acid is covalently attached.
- Different tRNAs carry different amino acids.

**Aminoacyl-tRNA synthetases**: enzymes that attach amino acids to their appropriate tRNAs. There are 20 of these enzymes (one for each amino acid). Each recognizes both its amino acid and the corresponding tRNA(s). This step is where the genetic code is "read" — the pairing of amino acid to tRNA determines which amino acid will be inserted at which codon.

**Wobble**: some tRNAs can pair with more than one codon (in the third position — the "wobble" position). This helps explain how ~40-60 different tRNAs can read 61 codons (61 = 64 - 3 stop codons).

**Steps of translation.**

**1. Initiation.**

- Small ribosomal subunit binds to the 5' end of mRNA (via the 5' cap in eukaryotes; via the Shine-Dalgarno sequence in prokaryotes).
- Scans along mRNA to find the start codon (AUG).
- The first tRNA (carrying methionine, Met-tRNA in eukaryotes; formyl-methionine, fMet-tRNA in prokaryotes) binds to the AUG at the P site.
- Large ribosomal subunit joins, completing the initiation complex.

**2. Elongation.**

The main cycle of translation. Repeated for each amino acid.

- **Codon recognition**: an incoming aminoacyl-tRNA (charged with its amino acid) enters the A site. Its anticodon base-pairs with the mRNA codon in the A site.
- **Peptide bond formation**: the amino acid at the P site is transferred to the amino acid at the A site, forming a peptide bond. (This is catalyzed by the ribosome's peptidyl transferase activity, which is actually rRNA.)
- **Translocation**: the ribosome moves one codon down the mRNA. The tRNA that was at the P site moves to the E site (and then exits). The tRNA that was at the A site moves to the P site. The A site is now empty and ready for the next tRNA.

This cycle repeats, adding one amino acid per codon. The growing polypeptide chain extends from the P site.

**Elongation rate**: ~20 amino acids per second in bacteria, ~5 in eukaryotes.

**3. Termination.**

- When a stop codon (UAA, UAG, or UGA) enters the A site, no tRNA matches.
- **Release factors** (proteins that mimic tRNAs but bind stop codons) enter the A site.
- Release factors trigger hydrolysis of the polypeptide from the tRNA at the P site.
- Ribosome subunits dissociate.
- The completed polypeptide is released.

**Post-translational modification and folding.**

The polypeptide as released may not be the final functional protein. Various modifications may occur:

- **Folding into 3D structure**: often assisted by chaperone proteins.
- **Signal peptide cleavage**: for proteins destined for specific locations, an N-terminal signal peptide directs them and is then cleaved off.
- **Proteolytic cleavage**: some proteins are made as inactive precursors that are activated by cleavage (e.g., insulin, pepsin).
- **Phosphorylation, methylation, glycosylation**, and dozens of other chemical modifications.
- **Assembly into multi-subunit proteins** (like hemoglobin's four subunits).

**Polysomes**: multiple ribosomes translating the same mRNA simultaneously. Increases protein production rate.

**Signal peptides and protein sorting**:
- Proteins destined for the endoplasmic reticulum, Golgi, lysosome, or secretion have an N-terminal signal peptide. Translation begins on free ribosomes; signal peptide is recognized by SRP; ribosome is directed to the ER membrane; translation continues on the ER with protein entering the ER lumen.
- Proteins for mitochondria have targeting sequences that direct them there after translation.
- Proteins for the nucleus have nuclear localization signals.
- Proteins for the cytoplasm have no targeting sequences; they stay in the cytoplasm.

**How genetic mutations affect translation.**

**Silent mutations**: change nucleotide but not amino acid (redundancy). No effect on protein.

**Missense mutations**: change one amino acid. May affect protein function (dramatically or subtly).

**Nonsense mutations**: create a premature stop codon. Truncated protein, usually non-functional.

**Frameshift mutations**: shift the reading frame. Everything downstream is scrambled; usually catastrophic.

**Splice site mutations**: affect splicing; can cause inclusion of intron or exclusion of exon; alter the protein.

**Regulation of translation.**

Beyond controlling how much mRNA is made (transcription), cells also regulate how much protein is made from that mRNA:
- **mRNA stability**: different mRNAs are degraded at different rates.
- **Translation initiation factors**: can be activated or inhibited.
- **microRNAs (miRNAs)**: small RNAs that bind mRNAs, blocking translation or triggering degradation.
- **RNA binding proteins**: can stabilize or destabilize mRNAs, or affect their translation.

**Antibiotics and translation.**

Many antibiotics target bacterial translation (differences from eukaryotic ribosomes provide selectivity):
- **Streptomycin, tetracycline**: bind bacterial 30S subunit.
- **Erythromycin, chloramphenicol**: bind bacterial 50S subunit.
- **Puromycin**: mimics an aminoacyl-tRNA; enters A site; blocks elongation.

Human toxicity is generally limited because human ribosomes differ enough that antibiotics don't affect them. However, mitochondrial ribosomes are bacterial-style, so some antibiotics have mitochondrial side effects (chloramphenicol can cause bone marrow suppression).

**The evolutionary significance of translation.**

Translation is universal across cellular life. This has enormous evolutionary significance:
- All extant life inherited the translation machinery from LUCA.
- Comparing ribosomal RNA sequences across species is the standard way to build evolutionary trees.
- The evolution of translation itself (from a possibly RNA-only world to the modern DNA-RNA-protein system) is one of the great questions in the origin of life.

**Summary of the central dogma.**

$$\\text{DNA} \\xrightarrow{\\text{transcription}} \\text{mRNA} \\xrightarrow{\\text{translation}} \\text{Protein}$$

DNA stores; RNA carries; protein does. Each step involves specific machinery (RNA polymerase, ribosome), specific rules (base pairing, genetic code), and specific quality controls (proofreading, RNA processing, chaperone folding). Together they express the information in genes as functional cellular components.`,
      video: {
        url: 'https://www.youtube.com/watch?v=itsb2SqR-R0',
        title: 'CrashCourse Biology — Translation',
        provider: 'CrashCourse',
      },
    },
    {
      code: '6.5',
      title: 'Regulation of gene expression',
      content:
`Every cell in a multicellular organism has the same DNA — the same genes. Yet a neuron looks nothing like a muscle cell; a liver cell functions completely differently from a bone cell. The differences arise from **gene regulation** — the systems that determine which genes are expressed in which cells, at what levels, and under what conditions. Gene regulation is why one genome can produce hundreds of cell types, and why cells respond to changing conditions. It is also central to development, health, and disease.

**Levels of gene regulation.**

Gene expression can be regulated at every step from DNA to functional protein:

1. **Chromatin structure**: is the DNA accessible for transcription?
2. **Transcription**: is RNA polymerase actually making the mRNA?
3. **RNA processing**: is the mRNA properly spliced, capped, and tailed?
4. **mRNA stability**: how long does the mRNA persist?
5. **Translation**: is the mRNA being read by ribosomes?
6. **Post-translational modification**: is the protein active or inactive?
7. **Protein degradation**: how long does the protein persist?

Each level provides regulatory opportunities. Different cell types use different combinations.

**Chromatin regulation.**

DNA is packaged with histones into chromatin. Chromatin structure affects gene accessibility:

- **Euchromatin**: loose, accessible, actively expressed.
- **Heterochromatin**: densely packed, silent.

The transition between these states is regulated by:

- **Histone modifications**: acetylation, methylation, phosphorylation, and other chemical marks on histone tails. Some marks (acetylation) loosen chromatin and promote expression; others (methylation of some sites) compact chromatin and silence genes.

- **DNA methylation**: methyl groups added to cytosines, especially in CpG dinucleotides. Heavily methylated regions are usually silenced. Methylation patterns are heritable through cell divisions (unlike most other modifications) and are essential to development.

- **ATP-dependent chromatin remodeling complexes**: move nucleosomes around, exposing or hiding genes.

These are the epigenetic marks discussed earlier in Unit 5. They can be:
- Reversible.
- Heritable through cell divisions.
- Sometimes heritable across generations.

**Prokaryotic gene regulation — the operon.**

Bacteria have simple but elegant gene regulation systems. Many bacterial genes are organized into **operons** — clusters of related genes controlled together by a single promoter.

**Lac operon** (Jacob and Monod, 1961; Nobel Prize 1965). The classic example. Regulates use of lactose as an energy source.

Structure:
- Three genes (lacZ, lacY, lacA) that together enable lactose metabolism.
- Single promoter for all three.
- **Operator**: a DNA sequence between promoter and genes; can bind a repressor.
- **Regulatory gene (lacI)**: separately encodes the repressor protein.

Regulation of lac operon:
- **In absence of lactose**: repressor binds operator. RNA polymerase can't proceed. Genes not expressed.
- **In presence of lactose**: allolactose (a metabolite of lactose) binds the repressor. Repressor releases operator. Transcription proceeds. Genes expressed.

The lac operon is an example of **inducible** regulation (turned on when needed).

**Tryptophan (trp) operon**. Related but opposite: makes tryptophan (an amino acid) when needed.

- **In absence of tryptophan**: RNA polymerase transcribes the trp genes; tryptophan is synthesized.
- **In presence of tryptophan**: tryptophan binds the repressor, activating it. Repressor binds operator; blocks transcription. Genes not expressed.

The trp operon is an example of **repressible** regulation (turned off when the product is abundant).

Operons allow bacteria to respond rapidly to changing environments. They're common in bacteria but rare in eukaryotes.

**Positive regulation** (in addition to repressors): activator proteins that enhance transcription when bound to specific sites. The lac operon actually has a positive regulator too — CAP (catabolite activator protein) — that binds when glucose is low, further increasing lac gene expression.

**Eukaryotic gene regulation.**

Much more complex than prokaryotic:
- More genes.
- More cell types requiring different expression patterns.
- More sophisticated regulation mechanisms.
- Chromatin structure adds another regulatory layer.
- Multiple transcription factors typically needed to activate any gene.

**Transcription factors** are proteins that bind DNA regulatory sequences.

**Types of regulatory sequences**:
- **Promoter**: near the transcription start site; where basal transcription machinery assembles.
- **Enhancers**: can be far from the gene (thousands of bases away); bind activators.
- **Silencers**: like enhancers but repressive.
- **Insulators**: block the effects of enhancers or silencers on genes they shouldn't affect.

The 3D structure of chromatin allows enhancers to physically loop into contact with promoters, activating transcription.

**A typical eukaryotic gene** may be regulated by multiple activators and repressors binding different sites, in combinations that vary by cell type and condition. Combinatorial control of transcription is central to producing cell-type-specific gene expression.

**Post-transcriptional regulation.**

Once mRNA is made, additional regulation occurs:

- **Alternative splicing**: the same primary transcript can be spliced in different ways in different cells, producing different protein isoforms.
- **mRNA stability**: some mRNAs are stable for hours (or days) while others are degraded within minutes. Cellular signals regulate stability.
- **Translation initiation**: multiple initiation factors can be inhibited or activated by cellular conditions (stress, nutrient status).

**Small RNAs (microRNAs, siRNAs).**

**MicroRNAs (miRNAs)** are short (~22 nucleotides) RNA molecules that regulate gene expression post-transcriptionally.

- Each miRNA can regulate many mRNAs.
- miRNAs bind partially complementary sequences in target mRNAs (usually in the 3' untranslated region).
- Result: mRNA degradation or translation block.

Humans have about 2,600 miRNAs regulating perhaps 60% of protein-coding genes. miRNAs are critical for development, cell differentiation, immune response, and many other processes. Dysregulation of miRNAs is implicated in many cancers.

**Small interfering RNAs (siRNAs)**: similar to miRNAs but perfectly complementary to their targets. Trigger complete degradation. Also used as laboratory tools for gene knockdown.

**Protein-level regulation.**

- **Phosphorylation** (by kinases) can activate or inactivate proteins.
- **Protein degradation** by the ubiquitin-proteasome system: proteins tagged with ubiquitin are recognized by proteasomes and degraded.

**Signaling and gene expression.**

External signals reach the nucleus via signaling cascades that end with transcription factor modification. Growth factors, hormones, and stress signals all ultimately affect gene expression. This is how cells respond to their environment.

**Development and gene regulation.**

**Development** — the process from single-celled zygote to complex multicellular organism — is fundamentally a process of gene regulation.

- Every cell starts with the same genome.
- Different cells activate different genes.
- The pattern of gene expression determines cell type.
- Signaling between cells orchestrates the process.

**Homeotic (Hox) genes**: master regulators of body patterning. First discovered in *Drosophila*. Highly conserved across animals. Mutations produce dramatic body plan alterations (extra pairs of wings, legs where antennae should be, etc.).

**Master regulators**: transcription factors that turn on entire developmental programs. Example: **MyoD** transcription factor turns fibroblasts into muscle cells when expressed.

**Cell differentiation is largely irreversible** — once a cell becomes a differentiated cell type, its gene expression pattern is stable. But this can be reversed experimentally:

**Induced pluripotent stem cells (iPSCs)**: Shinya Yamanaka (2006) showed that expressing just four transcription factors could revert differentiated cells to pluripotent (embryonic-stem-cell-like) state. Nobel Prize 2012.

**iPSCs** are a powerful tool for research and medicine — they can differentiate into any cell type.

**Cancer and gene regulation.**

Cancer often involves misregulation of gene expression:
- **Oncogenes**: dysregulated expression of genes that promote growth.
- **Tumor suppressor genes**: loss of expression of genes that restrain growth (e.g., p53).
- **Epigenetic changes**: many cancers show characteristic patterns of DNA methylation and histone modifications.
- **Chromatin remodeling proteins** are frequently mutated in cancer.

**Modern drug development** increasingly targets regulatory mechanisms:
- **Histone deacetylase inhibitors** (HDAC inhibitors): affect chromatin structure; used in some cancers.
- **DNA methyltransferase inhibitors**: reverse silencing of tumor suppressor genes.

**Gene expression profiling.**

Modern techniques allow measurement of expression of thousands of genes simultaneously:
- **Microarrays**: chips with DNA probes for many genes; hybridize labeled mRNA.
- **RNA-seq**: sequence all RNA molecules in a sample. Standard modern technique.
- **Single-cell RNA-seq**: measures gene expression in individual cells.

These techniques have revealed the enormous complexity of gene expression across cell types, conditions, and diseases.

**Summary.**

Gene regulation is what makes multicellular life possible. The same genome specifies vast diversity of cell types through regulated gene expression. At all levels — from chromatin structure to protein degradation — cells have mechanisms to control which proteins are made when. Understanding gene regulation is understanding what makes cells (and organisms) what they are.`,
      video: {
        url: 'https://www.youtube.com/watch?v=UhawyzTt2gI',
        title: 'CrashCourse Biology — Gene regulation',
        provider: 'CrashCourse',
      },
    },
    {
      code: '6.6',
      title: 'Mutations',
      content:
`**Mutations** — changes to the DNA sequence — are the ultimate source of all genetic variation. Without mutations, evolution would be impossible. Every genetic disorder traces to mutations at some point in a lineage. Every new adaptation is built from mutations. Every cancer starts with mutations. Understanding what mutations are, how they arise, and what consequences they have is essential to genetics.

**Types of mutations.**

**Point mutations** — single nucleotide changes:

- **Substitutions** (**transitions** if purine↔purine or pyrimidine↔pyrimidine; **transversions** if purine↔pyrimidine): one base replaces another.
- **Insertions**: one or more extra nucleotides added.
- **Deletions**: one or more nucleotides removed.

**Effects of point mutations in coding regions**:

**Silent mutations**: change nucleotide but not amino acid (the genetic code is redundant). Usually no phenotypic effect. Most common.

**Missense mutations**: change nucleotide, changing the amino acid. Effect ranges from negligible (if the substitute amino acid has similar properties) to severe (if it disrupts protein function).

**Sickle cell anemia**: a single missense mutation ($GAG \\to GTG$, glutamic acid → valine) at position 6 of the $\\beta$-globin gene changes hemoglobin's behavior. In homozygotes, red blood cells sickle when oxygen is low, causing painful crises, organ damage, shortened lifespan.

**Nonsense mutations**: convert an amino acid codon to a stop codon. Premature termination of translation. Truncated protein, usually non-functional. Serious effects.

**Frameshift mutations**: insertions or deletions that are not multiples of 3. Shifts the reading frame. Every codon downstream is altered. Usually catastrophic — no functional protein produced.

**Effects of mutations outside coding regions**:

- **Promoter mutations**: alter transcription factor binding sites; change how much (or when) a gene is expressed.
- **Splice site mutations**: alter splicing; can include intron or exclude exon.
- **Enhancer/silencer mutations**: alter regulatory sequences.
- **Non-coding RNA mutations**: alter miRNA sequences or targets.

**Larger mutations**:

**Chromosomal mutations**:
- **Deletions**: loss of chromosome segment.
- **Duplications**: extra copy of chromosome segment.
- **Inversions**: segment removed and reinserted backward.
- **Translocations**: segment moved to a different chromosome.

**Aneuploidy**: wrong chromosome number (trisomy, monosomy). From nondisjunction during meiosis or mitosis. Usually severe.

**Repeat expansions**: certain regions have repeating triplets. If the repeat number expands beyond a threshold, disease results:
- **Huntington's disease**: CAG repeats in HTT gene.
- **Fragile X syndrome**: CGG repeats in FMR1 gene.
- **Myotonic dystrophy**: CTG or CCTG repeats.

**Copy number variations (CNVs)**: some regions of the genome are present in different numbers of copies in different people.

**Where mutations happen — germ vs somatic.**

**Germline mutations**: occur in germ cells (sperm or egg). Passed to offspring. Cause inherited genetic disorders.

**Somatic mutations**: occur in body (somatic) cells. Not passed to offspring. Cause cancer and other conditions in the individual.

**Causes of mutations.**

**Spontaneous (endogenous)** mutations:
- **Replication errors**: DNA polymerase has proofreading, but occasional errors slip through. Rate: ~1 error per $10^9$-$10^{10}$ nucleotides in humans (very low).
- **Depurination**: spontaneous loss of a purine (A or G) base. Cell has repair mechanisms but not perfect.
- **Deamination**: cytosine can spontaneously lose an amine group and become uracil (interpreted as T by replication, causing C→T mutation).

**Induced (exogenous)** mutations — from environmental sources:

**Chemical mutagens**:
- Many industrial chemicals.
- Some drugs (chemotherapy drugs damage DNA to kill cancer cells — hence side effects).
- Tobacco smoke contains dozens of mutagens.
- Some food carcinogens.

**Radiation**:
- **Ultraviolet (UV)**: creates thymine dimers (adjacent thymines link covalently, disrupting replication).
- **Ionizing radiation (X-rays, gamma rays)**: cause double-strand breaks and other damage.

**Viruses**: some (like HPV) integrate into host DNA, disrupting genes.

**Metabolism**: reactive oxygen species (ROS) from normal metabolism damage DNA.

**Mutation rates.**

Different organisms have different mutation rates. Humans: about $10^{-9}$ per nucleotide per generation. This means each newborn has ~50-100 new mutations (of which perhaps 1-3 are in coding regions).

Higher mutation rates in:
- **RNA viruses**: much less accurate replication. HIV mutation rate is ~$10^{-3}$ per nucleotide per replication, ~million-fold higher than humans.
- **Some cancer cell lines**: DNA repair deficient cells have higher mutation rates.

Higher rates enable rapid evolution (for viruses) but come at the cost of higher error rates.

**Mutations in cancer.**

Cancer results from accumulation of mutations in somatic cells. Multiple mutations required — typically 4-10 "driver mutations" plus many "passenger" mutations.

**Driver mutations** typically affect:
- **Oncogenes**: activated to promote cell division. Examples: Ras, MYC, HER2.
- **Tumor suppressor genes**: lost function. Examples: p53, RB, APC, BRCA1/2.
- **DNA repair genes**: loss increases overall mutation rate.

**Cancer genetics**:
- Some mutations are inherited (germline, ~5-10% of cancers).
- Most cancer mutations are somatic (acquired during lifetime).
- Age is major risk factor for cancer because it takes time to accumulate mutations.
- Mutagens (tobacco, UV, some chemicals) increase mutation rate and cancer risk.

**Beneficial mutations.**

Most mutations are neutral (no phenotypic effect); some are harmful; a few are beneficial. Beneficial mutations provide the raw material for evolution.

**Examples of beneficial mutations in humans**:
- **Lactase persistence**: some human populations evolved the ability to digest lactose as adults (mutation in the lactase gene regulation). Highest in populations with historical dairy farming.
- **Malaria resistance**: sickle cell heterozygotes have partial protection against malaria. Balanced polymorphism.
- **HIV resistance**: some individuals are resistant to HIV infection due to a mutation in the CCR5 gene (Δ32 deletion). Homozygotes are highly resistant.

**Mutations in evolution**:
- Antibiotic resistance in bacteria: mutations that inactivate the antibiotic or its target.
- Pesticide resistance in insects.
- Drug resistance in HIV, cancers.
- Evolutionary adaptations across species.

**DNA repair.**

Cells have extensive mechanisms to detect and repair DNA damage:

**Mismatch repair**: detects and corrects errors from DNA replication. Defective in Lynch syndrome (increased colorectal cancer risk).

**Nucleotide excision repair (NER)**: removes bulky DNA lesions like UV-induced thymine dimers. Defective in xeroderma pigmentosum (extreme UV sensitivity, high skin cancer risk).

**Base excision repair (BER)**: fixes small chemical modifications to bases.

**Double-strand break repair**: two main mechanisms:
- **Non-homologous end joining (NHEJ)**: simply joins the broken ends. Error-prone.
- **Homologous recombination**: uses the sister chromatid as template. Accurate. Requires BRCA1/BRCA2. Deficient in some cancer syndromes.

**Effects of DNA repair deficiency**: increased mutation rate, developmental disorders, cancer predisposition.

**Genetic disease.**

Understanding mutations underlies genetic disease diagnosis and increasingly treatment:

- **Sickle cell**: known mutation, understood mechanism, treatable.
- **Cystic fibrosis**: various CFTR mutations; new drugs (modulators) can restore function for some mutations.
- **Huntington**: known mutation (CAG expansion); currently no treatment but active research.
- **Duchenne muscular dystrophy**: dystrophin gene mutations; gene therapies in development.

**Newborn screening** tests for many mutations that cause treatable conditions.

**Prenatal testing** can detect chromosomal abnormalities and some specific mutations.

**Genetic counseling** helps families understand risks and options.

**Practical applications.**

Understanding mutations enables:
- **Genetic testing** for disease risk.
- **Cancer diagnosis** and personalized treatment based on tumor mutations.
- **Drug development** targeting mutant proteins.
- **Genetic engineering** (see 6.7).

**Mutations are essential**. Without them, evolution would stop. Without evolution, life could not adapt to changing conditions. Mutations are also destructive — cancer, genetic disease, developmental disorders all trace to mutations. The double edge is inherent: the mechanisms that allow adaptation also allow disease. Cells' extensive repair mechanisms represent evolutionary compromises — accurate enough to preserve genetic information, error-prone enough to allow variation.`,
      video: {
        url: 'https://www.youtube.com/watch?v=UhawyzTt2gI',
        title: 'CrashCourse Biology — Mutations',
        provider: 'CrashCourse',
      },
    },
    {
      code: '6.7',
      title: 'Genetic engineering and biotechnology',
      content:
`**Genetic engineering** — deliberate modification of the genetic material of organisms — is one of the most important and rapidly evolving applications of biology. From recombinant insulin to CRISPR gene editing to genetically modified crops, biotechnology touches medicine, agriculture, industry, and increasingly everyday life. Understanding the basic techniques and their implications is essential for informed citizenship in an era where biology is increasingly engineered.

**Basic tools.**

**Restriction enzymes** (also called restriction endonucleases): bacterial enzymes that cut DNA at specific sequences. Discovered in the 1970s. Different restriction enzymes recognize different sequences (typically 4-8 base pairs). They can produce:
- **Blunt ends**: cut both strands at the same position.
- **Sticky ends**: cut at offset positions, leaving single-stranded overhangs.

**EcoRI** (from *E. coli*) cuts at $5'-GAATTC-3'$, leaving 4-base sticky ends. These ends can anneal to any other EcoRI-cut fragment.

**DNA ligase**: joins DNA fragments.

**Gel electrophoresis**: separates DNA fragments by size. DNA (negatively charged) is drawn through a gel by an electric field. Small fragments move faster.

**PCR (polymerase chain reaction)**: amplifies specific DNA sequences. Invented by Kary Mullis (1983); Nobel Prize 1993.

How PCR works:
1. **Denaturation** (~95 °C): DNA strands separate.
2. **Annealing** (~55 °C): short DNA primers bind specific sequences.
3. **Extension** (~72 °C): Taq DNA polymerase (heat-stable, from *Thermus aquaticus*) extends primers.
4. Repeat 25-40 times, doubling DNA each cycle. Millions to billions of copies from a single template.

PCR enables:
- Cloning specific DNA sequences.
- Genetic testing.
- Diagnosing infections (COVID-19 tests are PCR).
- Ancient DNA analysis.
- Forensic identification.
- Countless other applications.

**Recombinant DNA technology.**

The core of early genetic engineering. Steps:

1. **Cut** the desired DNA (say, a human gene) with restriction enzymes.
2. **Cut** a plasmid (small circular DNA in bacteria) with the same enzymes, producing complementary sticky ends.
3. **Join** the gene and plasmid with DNA ligase.
4. **Transform** the plasmid into bacteria (using electroporation or chemical methods).
5. Bacteria replicate the plasmid, producing many copies of the gene.
6. Bacteria may express the gene, producing the protein.

**Applications of recombinant DNA**.

**Recombinant insulin** (1978): the first major commercial recombinant DNA product. Before, insulin was extracted from pig or cow pancreas. Recombinant insulin (identical to human insulin) is produced in bacteria. Saved lives; enabled reliable insulin supply for diabetes patients.

**Other recombinant proteins**:
- Growth hormone.
- Erythropoietin (EPO) — treats anemia.
- Blood clotting factors — treat hemophilia.
- Vaccines (hepatitis B vaccine was the first recombinant vaccine).
- Many others.

**DNA sequencing.**

Determining the order of nucleotides in DNA.

**Sanger sequencing** (Frederick Sanger, 1977; Nobel Prize 1980 — Sanger won two Nobels): used chain-terminating dideoxynucleotides. Standard for decades. Human Genome Project (completed 2003) used Sanger sequencing.

**Next-generation sequencing (NGS, from ~2005)**: massively parallel; much faster and cheaper. Enables whole-genome sequencing of individuals.

**Cost of sequencing**:
- First human genome (2003): ~$3 billion, 13 years.
- Today: ~$300-1000 per genome, days.

The Human Genome Project (1990-2003) sequenced the first complete human genome. Established that humans have about 20,000 protein-coding genes — fewer than expected. Started genomics as a major field.

**Whole-exome sequencing**: sequences only protein-coding regions (~1.5% of genome). Cheaper than whole-genome. Used in medical diagnostics.

**CRISPR-Cas9 — the gene editing revolution.**

**CRISPR** (Clustered Regularly Interspaced Short Palindromic Repeats) is an adaptive immune system in bacteria. It was adapted for gene editing by Jennifer Doudna and Emmanuelle Charpentier (2012). Nobel Prize in Chemistry 2020 — first Nobel to two women only.

How CRISPR-Cas9 works:
1. **Guide RNA** (gRNA) designed to match a target DNA sequence.
2. **Cas9** enzyme (a nuclease) forms a complex with the gRNA.
3. Complex binds the target DNA (matched by the gRNA).
4. Cas9 cuts both DNA strands.
5. Cell repairs the break by:
   - **Non-homologous end joining** (error-prone) → can disrupt gene function.
   - **Homology-directed repair** (using a template): can precisely change the DNA sequence.

CRISPR-Cas9 is revolutionary because:
- **Easy to design**: just synthesize a 20-nucleotide gRNA.
- **Highly specific**: 20-base recognition is highly specific.
- **Efficient**: works in almost any organism.
- **Cheap**: components are inexpensive.

Compared to older gene editing (zinc finger nucleases, TALENs), CRISPR is much more accessible.

**Applications of CRISPR**:
- **Basic research**: knocking out or modifying genes to study function.
- **Agriculture**: creating disease-resistant crops, higher-yielding livestock.
- **Medicine**: developing gene therapies for genetic diseases (sickle cell, hemophilia, some cancers).
- **Ethical concerns**: potential for human germline editing raises major concerns.

**He Jiankui affair (2018)**: Chinese researcher He Jiankui announced he had used CRISPR to edit embryos (disabling the CCR5 gene to potentially prevent HIV infection). The experiment was widely condemned as premature and unethical. He was later imprisoned. The episode highlighted the need for careful ethical governance of gene editing.

**Gene therapy.**

Treating disease by introducing genetic material into cells.

**Recent successes**:
- **Luxturna (2017)**: gene therapy for a rare form of blindness. First FDA-approved gene therapy in the US.
- **Zolgensma (2019)**: gene therapy for spinal muscular atrophy. Extraordinary cost (~$2 million per patient) but effective.
- **Casgevy (2023)**: CRISPR-based gene therapy for sickle cell disease. First CRISPR therapy approved.

**Approaches**:
- **Viral vectors**: modified viruses (usually AAV — adeno-associated virus, or lentivirus) deliver therapeutic genes.
- **Ex vivo**: cells extracted, modified, returned.
- **In vivo**: genes delivered directly into the body.

**Challenges**:
- Delivery to correct cells.
- Immune reactions to viral vectors.
- Long-term durability.
- Cost.
- Insertional mutagenesis (integration in wrong place).

**CAR-T cell therapy**: patient's T cells are engineered to attack cancer cells. Approved for some leukemias and lymphomas. Extraordinary outcomes in some patients.

**mRNA vaccines**.

Traditional vaccines used dead or weakened pathogens or their proteins.

**mRNA vaccines** deliver mRNA encoding a pathogen protein. Body's cells translate the mRNA, producing the protein, which triggers immune response. Advantages: fast to develop, easy to update.

**COVID-19 mRNA vaccines** (Pfizer/BioNTech and Moderna, 2020) were the first widely-used mRNA vaccines. Developed within a year of the virus's identification (unprecedented speed). Saved millions of lives.

**Genetically modified organisms (GMOs) in agriculture.**

Crops and livestock genetically engineered for various traits.

**Common GMO traits**:
- **Herbicide tolerance**: crops resistant to herbicides (allowing weed killing without hurting crop). Roundup Ready soybeans, corn, cotton.
- **Insect resistance**: Bt crops (containing bacterial gene producing insecticidal protein) resist certain insects.
- **Nutritional enhancement**: Golden Rice (enriched with vitamin A precursor).
- **Disease resistance**: virus-resistant papaya, potato.

**Prevalence**: over 90% of US corn, soybeans, cotton is genetically modified.

**Debates**:
- **Environmental**: some concerns about herbicide resistance in weeds, monoculture, biodiversity.
- **Health**: current evidence suggests no direct health risks from consumption, though long-term studies continue.
- **Economic**: patents allow companies to control seed markets.
- **Cultural/philosophical**: some oppose GMOs on principle.

Regulations vary widely by country (US relatively permissive; EU more restrictive).

**Cloning.**

**Molecular cloning**: producing multiple copies of a specific DNA sequence (using bacteria and plasmids).

**Reproductive cloning**: creating a genetically identical organism. Famous example: **Dolly the sheep (1996)** — cloned by somatic cell nuclear transfer (SCNT) from an adult sheep's mammary cell. Died relatively young.

Reproductive cloning of humans is widely considered unethical and is banned in most countries.

**Therapeutic cloning**: producing stem cells genetically matched to a patient. Uses SCNT to create embryonic stem cells (or now more commonly iPSCs).

**Induced pluripotent stem cells (iPSCs)**. Shinya Yamanaka (2006) showed that expressing four transcription factors (Oct4, Sox2, Klf4, c-Myc) converts adult cells into pluripotent stem cells. Nobel Prize 2012.

iPSCs advantages:
- **Personalized**: from patient's own cells; no rejection.
- **Ethical**: no embryos needed.
- **Research tool**: study patient-specific disease mechanisms.

**Bioremediation and industrial biotech.**

- **Bacteria to clean up oil spills**: engineered or naturally occurring bacteria that metabolize hydrocarbons.
- **Biofuels**: engineered microorganisms produce ethanol or biodiesel.
- **Biotech pharmaceuticals**: recombinant proteins for medicine.
- **Industrial enzymes**: engineered proteins for detergents, food processing, textile manufacturing.

**Ethical and social issues.**

Genetic engineering raises many concerns:

- **Human germline editing**: changes that could be inherited. Widely considered off-limits currently.
- **Designer babies**: selecting or engineering traits in embryos.
- **Genetic privacy**: who owns your genetic data?
- **Genetic discrimination**: employment, insurance implications. GINA (2008) provides some US protection.
- **GMO safety and environmental impact**.
- **Equity of access**: expensive gene therapies may be available only to the wealthy.
- **Enhancement vs treatment**: is it OK to use genetic engineering for enhancement (not just disease treatment)?
- **Impact on evolution**: genetic engineering vs natural selection.

**The pace of change is rapid.** Techniques that were science fiction 20 years ago are routine now. Techniques that seem impossible now may be routine 20 years from now. Society must grapple continuously with implications.

**Personalized medicine**.

Increasingly, medical decisions are informed by genetics:
- **Pharmacogenomics**: how genes affect drug response.
- **Cancer molecular profiling**: match drugs to tumor mutations.
- **Rare disease diagnosis**: exome or genome sequencing for undiagnosed patients.
- **Preconception carrier screening**: identify couples at risk of having children with genetic disorders.

**Direct-to-consumer testing** (23andMe, AncestryDNA): provides ancestry information and some health information. Regulatory oversight limited.

**The genetic engineering revolution is fundamentally changing what humans can do to biology and to themselves.** The ethical questions have not caught up with the technical capabilities. Understanding both the science and the ethics will be increasingly important for citizens throughout the 21st century.`,
      video: {
        url: 'https://www.youtube.com/watch?v=UhawyzTt2gI',
        title: 'CrashCourse Biology — Genetic engineering',
        provider: 'CrashCourse',
      },
    },
    {
      code: '6.8',
      title: 'Genetic variation and evolution',
      content:
`Genetic variation is the raw material of evolution. Without variation, natural selection would have nothing to select from; populations would remain the same generation after generation. Genetic variation arises through mutations (Unit 5.5, 6.6) and is shuffled and rearranged through the sexual reproduction processes covered in Unit 5.1. The variation that persists in populations is shaped by natural selection, genetic drift, migration, and mating patterns — the mechanisms of evolution (fully covered in Unit 7). This subunit bridges the molecular genetics of Unit 6 with the population genetics and evolution of Unit 7.

**Sources of genetic variation.**

**1. Mutations.** The ultimate source of new alleles. Mutations happen constantly (see 6.6). Most are neutral or harmful; occasional beneficial mutations provide raw material for adaptive evolution.

Types of mutations that create variation:
- Point mutations.
- Insertions/deletions.
- Chromosomal rearrangements.
- Whole-genome duplications.

**Rate**: humans have about 1 new mutation per 10^8 nucleotides per generation. This translates to ~50-100 new mutations per newborn.

**2. Sexual reproduction.** Meiosis and fertilization generate variation without any new mutations:

- **Crossing over** (prophase I of meiosis): non-sister chromatids exchange DNA segments. Produces new allele combinations on the same chromosome.
- **Independent assortment** (metaphase I): homologous pairs orient randomly. With 23 pairs in humans, $2^{23} = 8.4 \\times 10^6$ possible gamete genotypes.
- **Random fertilization**: any of ~$8 \\times 10^6$ egg genotypes can fuse with any of ~$8 \\times 10^6$ sperm genotypes, giving ~$6.4 \\times 10^{13}$ possible zygotes per couple.

Sexual reproduction shuffles existing variation into new combinations.

**3. Gene flow (migration).** Movement of individuals (and their alleles) between populations. Introduces alleles that weren't previously present in a population.

**4. Genetic drift.** Random changes in allele frequencies, especially in small populations. Can eliminate alleles even if they're beneficial, or fix alleles even if they're harmful — pure chance rather than selection.

**Population genetics — measuring variation.**

Population genetics quantifies genetic variation using several key concepts:

**Allele frequency**: proportion of chromosomes in a population carrying a particular allele.

For a gene with two alleles $A$ and $a$:
- $p$ = frequency of $A$.
- $q$ = frequency of $a$.
- $p + q = 1$ (since these are the only two alleles).

**Genotype frequency**: proportion of individuals with each genotype.

Under **Hardy-Weinberg equilibrium** (see below), for a diploid population:
- $AA$ frequency $= p^2$.
- $Aa$ frequency $= 2pq$.
- $aa$ frequency $= q^2$.
- $p^2 + 2pq + q^2 = 1$.

**Hardy-Weinberg equilibrium.**

If a population is in Hardy-Weinberg equilibrium, allele frequencies don't change from generation to generation. This is the null hypothesis of population genetics — a population where evolution is NOT happening.

Conditions for Hardy-Weinberg equilibrium (all must be met):
1. **No mutation**.
2. **No gene flow** (no migration in/out).
3. **No natural selection** (all genotypes have equal survival and reproduction).
4. **Very large population size** (no genetic drift).
5. **Random mating** (no preference for particular genotypes).

Real populations rarely meet all these conditions perfectly. **When observed genotype frequencies differ from Hardy-Weinberg predictions, one of these conditions is violated — meaning evolution is happening**.

**Using Hardy-Weinberg**:

Example: In a population, 16% of individuals are homozygous recessive ($aa$) for some trait. What are the allele frequencies?

If $q^2 = 0.16$, then $q = 0.4$. Therefore $p = 0.6$.
Frequencies: $AA = p^2 = 0.36$; $Aa = 2pq = 0.48$; $aa = q^2 = 0.16$. Check: $0.36 + 0.48 + 0.16 = 1.00$ ✓.

Hardy-Weinberg is a powerful predictive tool and also a diagnostic tool for detecting evolutionary forces.

**Sources of genetic variation among individuals.**

**Single nucleotide polymorphisms (SNPs)**: single-nucleotide variations between individuals. Humans differ from each other by about $3 \\times 10^6$ SNPs (about 1 per 1000 nucleotides).

**Copy number variations (CNVs)**: differences in the number of copies of specific DNA regions.

**Large structural variants**: insertions, deletions, duplications, inversions.

**Human genetic diversity is low** compared to many species — perhaps because of a bottleneck (small population size) in human history, perhaps 100,000-70,000 years ago. Chimpanzees, our closest relatives, have more genetic diversity than humans.

**Sources of variation between populations.**

Different human populations have different allele frequencies for many genes. This variation reflects:

- **Founder effects**: alleles present in initial small colonizing populations.
- **Genetic drift** during migrations.
- **Natural selection** for locally adapted traits.
- **Gene flow** between and among populations.

Examples of local adaptation:
- **Lactase persistence**: mutations allowing adult lactose digestion evolved independently multiple times in populations with dairy farming (Northern Europe, parts of Africa, Middle East).
- **Skin pigmentation**: variation in melanin production correlates with UV exposure levels (higher UV → darker skin protects against folate degradation; lower UV → lighter skin allows vitamin D synthesis).
- **Malaria resistance**: sickle cell trait, thalassemia, Duffy-negative blood type all provide some malaria resistance in populations from malaria-endemic regions.
- **High altitude adaptations**: Tibetan and Andean populations have evolved distinct adaptations to low oxygen at high elevations.

**Race vs genetic ancestry.** Modern genetics has shown that:

- Traditional racial categories don't map cleanly onto genetic differences.
- Most genetic variation is within populations, not between them.
- Human genetic diversity is continuous, not categorical.
- Racial categories are socially constructed even though they reference (imperfectly) real ancestry patterns.

The genetic distinctions between "races" are largely superficial and not meaningful biologically. However, ancestry does have some medical relevance for specific conditions (sickle cell, Tay-Sachs, others).

**Natural selection and adaptation.**

**Natural selection** (Charles Darwin, 1859): individuals with heritable variations that improve survival and reproduction pass on more genes to the next generation.

Requirements:
- **Variation**: individuals differ.
- **Heritability**: differences are genetic (or at least partly genetic).
- **Differential reproductive success**: some variants leave more offspring.

**Modes of natural selection**:

- **Directional selection**: favors one extreme of the trait distribution. Example: peppered moths darkened during industrial revolution as pollution darkened tree bark.
- **Stabilizing selection**: favors intermediate values. Example: human birth weight — very small or very large babies have higher mortality.
- **Disruptive (diversifying) selection**: favors both extremes at the expense of the middle. Rarer but can produce speciation.

**Sexual selection**: selection based on mate choice. Can produce elaborate traits (peacock tails, elk antlers) that don't help survival but help reproduction.

**Kin selection**: selection favoring behaviors that help relatives (who share genes). Explains altruism in many social species.

**Balancing selection**: maintains multiple alleles in a population. Example: sickle cell heterozygotes (Aa) have malaria resistance while $AA$ are vulnerable to malaria and $aa$ get sickle cell anemia. In malaria regions, $Aa$ is favored, keeping the mutant allele in the population.

**Fitness**: an individual's reproductive success. Not just survival — actually leaving offspring is what matters.

**Adaptation**: heritable trait that improves fitness in a specific environment.

**Genetic drift.**

Random changes in allele frequencies. More important in small populations.

**Bottleneck effect**: population passes through a small size (natural disaster, disease). Genetic diversity reduced.

**Founder effect**: a small group colonizes a new area. The founders carry only a subset of the source population's genetic diversity.

**Neutral theory of molecular evolution** (Motoo Kimura): most genetic variation at the molecular level is neutral (no fitness effect); changes accumulate through drift, not selection. This provides a molecular clock for evolution.

**Speciation.**

Formation of new species from ancestral species.

**Reproductive isolation** — inability to interbreed successfully — is the biological definition of species boundaries.

**Mechanisms of speciation**:
- **Allopatric**: geographic separation. Populations diverge in isolation.
- **Sympatric**: speciation without geographic separation. Rarer.
- **Adaptive radiation**: rapid diversification into many species (Darwin's finches, Hawaiian silverswords).

**Genetic evidence for evolution.**

Molecular data provides overwhelming evidence for common ancestry:

- **DNA sequences** of related genes are more similar in more closely related species.
- **Molecular clocks** based on mutation rate calibrate evolutionary timescales.
- **Pseudogenes** (non-functional relatives of active genes) accumulate mutations at neutral rate; found in expected patterns.
- **Endogenous retroviruses** (viral sequences integrated into genome) shared among species show common ancestry.
- **Genetic code universality** shows all life shares a common ancestor.
- **Homologous genes** across species show shared ancestry.

**Comparative genomics** compares genomes of different species. Reveals:
- **Genes conserved across billions of years** (basic cellular machinery).
- **Genes present in some lineages but not others** (specialized functions).
- **Rate of change** varies by gene function (essential genes evolve slowly).
- **Human genome ~98.7% identical to chimpanzee genome**.
- **Human genome ~99.9% identical among individual humans**.

**Population genetics tools**.

Modern population genetics uses:
- **Whole-genome sequencing** of many individuals from populations.
- **SNP arrays** to characterize genetic variation.
- **Coalescent theory** to trace ancestry back in time.
- **F-statistics** to measure differentiation among populations.
- **Selection scans** to identify genes under natural selection.

Applications include:
- Understanding human evolutionary history and migrations.
- Conservation biology (assessing genetic diversity in endangered species).
- Disease genetics (identifying disease genes through population comparisons).
- Agriculture (understanding domestication and breeding).

**Bridge to Unit 7 (Natural Selection)** — the mechanisms outlined here (mutation, sexual recombination, natural selection, genetic drift, gene flow) are the engine of evolution. Unit 7 covers evolutionary mechanisms and evidence in much more depth. Understanding gene expression and variation provides the molecular foundation for that broader evolutionary picture.

The genome is not static. It changes constantly through mutation, is reshuffled through sex, and is shaped through evolution. Understanding genetic variation is understanding how life adapts to changing environments and diversifies into the millions of species we see today.`,
      video: {
        url: 'https://www.youtube.com/watch?v=IcMU-2mUvbc',
        title: 'CrashCourse Biology — Genetic variation and evolution',
        provider: 'CrashCourse',
      },
    },
  ],
  keyConcepts: [
    'DNA: double helix, antiparallel strands, base pairing (A-T, G-C via H-bonds). Sugar-phosphate backbone with bases on inside.',
    'DNA vs RNA: DNA has deoxyribose and T; RNA has ribose and U; RNA usually single-stranded.',
    'Chargaff\'s rules: [A]=[T], [G]=[C] in dsDNA.',
    'DNA replication: semi-conservative. Enzymes: helicase (unwinds), primase (RNA primer), DNA polymerase (synthesizes 5\'→3\'), ligase (joins fragments).',
    'Leading strand continuous; lagging strand in Okazaki fragments (due to antiparallel + 5\'→3\' polymerase constraint).',
    'Telomeres shorten with each replication; telomerase in germ, stem, cancer cells.',
    'Transcription: DNA → RNA by RNA polymerase. Uses one strand as template.',
    'Eukaryotic mRNA processing: 5\' cap, 3\' poly-A tail, splicing (removes introns, joins exons).',
    'Alternative splicing: same gene → different mRNAs → different proteins.',
    'Genetic code: 3 nucleotides = 1 codon → 1 amino acid. 64 codons, 20 amino acids, 3 stop, 1 start (AUG).',
    'Nearly universal code = evidence of common ancestry.',
    'Translation: mRNA → protein by ribosome. tRNAs bring amino acids; anticodons pair with codons.',
    'Regulation: chromatin structure, transcription factors, alternative splicing, mRNA stability, translation, protein modification.',
    'Prokaryotic operons: lac (inducible, when lactose present), trp (repressible, when tryptophan present).',
    'Eukaryotic regulation: complex; enhancers, silencers, chromatin remodeling, DNA methylation, histone modifications.',
    'MicroRNAs (miRNAs): regulate ~60% of genes post-transcriptionally.',
    'Mutations: silent, missense, nonsense, frameshift. Point mutations, chromosomal rearrangements, aneuploidy.',
    'DNA repair: mismatch repair, nucleotide excision repair, base excision repair. Loss of repair → cancer risk.',
    'Genetic engineering: restriction enzymes, DNA ligase, PCR, sequencing, CRISPR-Cas9.',
    'Recombinant DNA: insulin, growth hormone, vaccines produced in bacteria.',
    'CRISPR-Cas9: revolutionized gene editing since 2012.',
    'mRNA vaccines: rapid development, COVID-19 vaccines proved technology.',
    'Sources of variation: mutation, sexual reproduction (crossing over + independent assortment + random fertilization), gene flow, genetic drift.',
    'Hardy-Weinberg equilibrium: $p^2 + 2pq + q^2 = 1$. Null hypothesis; deviation indicates evolution.',
    'Natural selection: directional, stabilizing, disruptive; sexual selection; balancing selection.',
  ],
  formulas: [
    {
      name: 'Chargaff\'s rules',
      equation: '$[A] = [T],\\; [G] = [C]$',
      meaning: 'In double-stranded DNA, the amount of A equals T and G equals C, reflecting base pairing.',
      example: 'If a DNA sample has 30% A, then 30% T, 20% G, 20% C.',
    },
    {
      name: 'Codon combinations',
      equation: '$4^3 = 64$ codons',
      meaning: 'With 4 nucleotides at each of 3 positions, 64 possible codons; 61 code for amino acids, 3 are stop codons.',
      example: 'The codon UUU codes for phenylalanine; UAA is a stop codon.',
    },
    {
      name: 'Hardy-Weinberg equation',
      equation: '$p^2 + 2pq + q^2 = 1$',
      meaning: 'For a diploid population with two alleles ($p + q = 1$), genotype frequencies at equilibrium.',
      example: 'If $q^2 = 0.16$ ($aa$ = 16%), then $q = 0.4$, $p = 0.6$; $AA = 0.36$, $Aa = 0.48$.',
    },
    {
      name: 'Allele frequency sum',
      equation: '$p + q = 1$',
      meaning: 'For a gene with two alleles, their frequencies sum to 1.',
      example: 'If dominant allele has frequency 0.6, recessive has 0.4.',
    },
    {
      name: 'Human genome size',
      equation: '$\\sim 3.2 \\times 10^9$ base pairs',
      meaning: '~3.2 billion bp across 46 chromosomes; encodes ~20,000 protein-coding genes.',
      example: 'Human diploid cell contains ~6.4 billion bp of DNA.',
    },
  ],
  practice: [
    {
      q: 'A DNA template strand reads 3\'-TACGGATTCAG-5\'. What is the sequence of the mRNA transcribed from it?',
      a: 'Read the template 3\'→5\' and synthesize mRNA 5\'→3\' with complementary bases (using U instead of T). Template: 3\'-TAC-GGA-TTC-AG-5\'. mRNA: 5\'-AUG-CCU-AAG-UC-3\'.',
    },
    {
      q: 'A mutation changes a DNA codon from CGA to CGG. If both encode arginine, what type of mutation is this?',
      a: 'Silent mutation. The DNA base changed (A → G at the third position), but the amino acid encoded remained arginine because of the degeneracy of the genetic code. Silent mutations typically have no phenotypic effect.',
    },
    {
      q: 'Explain why DNA polymerase cannot synthesize both strands continuously during replication.',
      a: 'DNA polymerase can only add nucleotides to the 3\' end of a growing strand. Since the two DNA strands are antiparallel (one runs 5\'→3\', the other 3\'→5\'), only one strand (the leading strand) can be synthesized continuously in the direction the replication fork moves. The other strand (lagging strand) must be synthesized in Okazaki fragments — short segments made in the 5\'→3\' direction but progressing away from the fork. These fragments are then joined by DNA ligase.',
    },
    {
      q: 'In a population, 9% of individuals are homozygous recessive ($aa$) for a trait. Assuming Hardy-Weinberg equilibrium, what percentage of the population are carriers ($Aa$)?',
      a: 'If $q^2 = 0.09$, then $q = 0.3$. Therefore $p = 0.7$. Carrier frequency = $2pq = 2(0.7)(0.3) = 0.42$ or 42%. This is an important insight: for a recessive trait affecting 9% of the population, 42% are heterozygous carriers.',
    },
    {
      q: 'Compare the lac operon in bacteria (which produces enzymes for lactose digestion) with the trp operon (which produces enzymes for tryptophan synthesis) in terms of regulation.',
      a: 'The lac operon is inducible: it is normally OFF (repressor bound to operator) but is turned ON when lactose is present (allolactose binds repressor, releasing it from operator). The trp operon is repressible: it is normally ON (transcription of trp genes occurs) but is turned OFF when tryptophan is abundant (tryptophan binds repressor, activating it to bind operator). Inducible operons control catabolic pathways (only make enzymes when the substrate is present); repressible operons control biosynthetic pathways (only make enzymes when the product is needed).',
    },
  ],
  pitfalls: [
    '"DNA is a single strand" — wrong. DNA is a double helix with two antiparallel strands.',
    '"DNA polymerase can synthesize in both directions" — wrong. Only in the 5\'→3\' direction on the template. This is what makes lagging strand synthesis discontinuous.',
    '"All eukaryotic genes have introns" — wrong. Some do not. But most human genes have multiple introns.',
    '"The template strand and coding strand are the same" — wrong. The template strand is used for transcription; the mRNA sequence is complementary to it. The coding strand has the same sequence as the mRNA (with T instead of U).',
    '"The genetic code is exact — one codon, one amino acid" — wrong. The genetic code is redundant (degenerate). Most amino acids are encoded by multiple codons.',
    '"AUG is only a start codon" — wrong. AUG also codes for methionine within proteins. The first AUG in a proper context is the start signal.',
    '"Gene expression is only controlled at transcription" — wrong. Regulation occurs at every level: chromatin structure, transcription, RNA processing, mRNA stability, translation, protein modification, protein degradation.',
    '"CRISPR is perfectly specific" — CRISPR has off-target effects. Improving specificity is an active research area.',
    '"All mutations are bad" — wrong. Most are neutral; some are beneficial. Beneficial mutations drive evolution.',
    '"Hardy-Weinberg equilibrium is common in nature" — wrong. It\'s a null hypothesis. Real populations rarely meet all conditions perfectly, so allele frequencies typically change over time (which IS evolution).',
  ],
};
