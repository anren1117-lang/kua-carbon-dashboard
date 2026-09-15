// AP Biology Unit 5 — Heredity (8-11% of exam)
// APES-standard depth. LaTeX math via $...$ delimiters.

export const APBIO_UNIT_5 = {
  number: 5,
  title: 'Heredity',
  weight: '8-11%',
  subunits: [
    {
      code: '5.1',
      title: 'Meiosis',
      content:
`Meiosis is the specialized cell division that produces gametes (sperm and egg) — the cells that carry genetic information from one generation to the next. Where mitosis produces two identical daughter cells with the same chromosome number as the parent, meiosis produces four genetically distinct daughter cells with **half** the parental chromosome number. Without meiosis, sexual reproduction would be impossible; without the genetic diversity meiosis generates, sexually reproducing species would lack the raw material for evolution. Understanding meiosis is the entry point to genetics.

**Chromosomes and ploidy.**

Every eukaryotic cell has a specific chromosome number characteristic of its species. Humans have 46 chromosomes organized as **23 pairs**. Each pair consists of one chromosome from the mother and one from the father — these are called **homologous chromosomes** or **homologs**.

Homologs carry the **same genes at the same positions (loci)** but may have different versions (**alleles**) of those genes. For example, the ABO blood-type gene sits at the same locus on both members of a chromosome pair, but one homolog might carry the A allele and the other the B allele.

Two important ploidy categories:

- **Diploid ($2N$)**: contains both members of each homologous pair. Body (somatic) cells are diploid. In humans, $2N = 46$.
- **Haploid ($N$)**: contains only one member of each homologous pair. Gametes are haploid. In humans, $N = 23$.

**Fertilization** combines two haploid gametes to produce a diploid zygote, restoring the diploid chromosome number.

$$\\text{Haploid egg (}N=23\\text{)} + \\text{Haploid sperm (}N=23\\text{)} \\to \\text{Diploid zygote (}2N=46\\text{)}$$

Without meiosis to reduce the chromosome number in gametes, fusion at fertilization would double the chromosome number every generation — obviously unsustainable.

**Sex chromosomes vs autosomes.**

- **Autosomes**: chromosomes that are the same in both sexes. In humans, chromosomes 1-22 are autosomes (22 pairs = 44 chromosomes).
- **Sex chromosomes**: X and Y. Females typically have two X chromosomes ($XX$); males have one X and one Y ($XY$).

X and Y are called "homologous" in the loose sense (they pair during meiosis) but they carry very different genes. The Y is much smaller and contains fewer genes; it's essentially specialized for male development.

**The purpose of meiosis.**

Two accomplishments:

1. **Reduces chromosome number by half** (diploid → haploid). This makes sexual reproduction possible.
2. **Generates genetic diversity** through independent assortment, crossing over, and random fertilization. This produces the variation on which natural selection acts.

**Two rounds of division.**

Meiosis has two consecutive divisions: **Meiosis I** and **Meiosis II**. Together they produce four haploid cells from one diploid cell.

- **Meiosis I** separates homologous chromosomes. It is the **reductional division** — this is where diploid becomes haploid.
- **Meiosis II** separates sister chromatids (like mitosis) but starts from haploid cells with duplicated chromosomes.

**Interphase before meiosis.** Just as in the mitotic cell cycle, DNA is replicated during S phase before meiosis begins. Each chromosome enters meiosis with two sister chromatids joined at the centromere.

**Meiosis I — separating homologs.**

**Prophase I.** The longest and most complex phase of meiosis. Several critical events:

- Chromosomes condense and become visible.
- **Homologous chromosomes pair up** in a process called **synapsis**. Each pair (four chromatids total — two from each homolog) is called a **bivalent** or **tetrad**.
- **Crossing over** occurs at points called **chiasmata**. Non-sister chromatids from paired homologs physically exchange segments of DNA. This is the first major source of genetic variation.
- Nuclear envelope breaks down; spindle forms.

**Metaphase I.** Homologous pairs (bivalents) align at the metaphase plate — each pair, not each chromosome, on the plate. Each bivalent orients randomly with respect to the poles.

- **Independent assortment**: the orientation of each bivalent is random and independent of every other bivalent. With 23 pairs in humans, there are $2^{23} \\approx 8.4 \\times 10^6$ possible orientations. This is the second major source of genetic variation.

**Anaphase I.** Homologous chromosomes are pulled to opposite poles by spindle fibers. **Sister chromatids remain attached** at their centromeres; each pole receives one homolog with its two sister chromatids.

**Telophase I / cytokinesis.** Cells divide. Two haploid cells result, each with one member of each homologous pair — but each chromosome still has two sister chromatids.

**Meiosis II — separating sister chromatids.**

No DNA replication between meiosis I and II. The chromosomes are already duplicated.

**Prophase II.** Chromosomes condense (if they had decondensed); spindle forms.

**Metaphase II.** Chromosomes align at the metaphase plate — this time each chromosome (not each pair) on the plate. Similar to mitosis.

**Anaphase II.** Sister chromatids separate and move to opposite poles. Like mitosis.

**Telophase II / cytokinesis.** Cells divide. Four haploid cells result, each with one chromatid per chromosome.

**Sources of genetic variation from meiosis — three mechanisms.**

1. **Crossing over (recombination)** during prophase I. Non-sister chromatids exchange DNA segments. New allele combinations that didn't exist in either parent are generated on a single chromosome. Every chromosome typically undergoes 1-3 crossovers per meiosis in humans.

2. **Independent assortment** during metaphase I. Each homologous pair orients randomly. With 23 pairs, $2^{23}$ possible combinations. Combined with the other homolog contributions from the parent — enormous variation.

3. **Random fertilization**: any one of ~$8 \\times 10^6$ possible egg genotypes can fuse with any of ~$8 \\times 10^6$ possible sperm genotypes, producing ~$6.4 \\times 10^{13}$ possible zygote genotypes per couple — before considering crossing over.

Together these mechanisms guarantee that each fertilization produces a unique individual (barring identical twins). This is why siblings differ from each other despite sharing parents.

**Comparing meiosis with mitosis.**

| Feature | Mitosis | Meiosis |
|---------|---------|---------|
| Purpose | Growth, repair, asexual reproduction | Gamete production, sexual reproduction |
| Number of divisions | 1 | 2 |
| Daughter cells | 2 | 4 |
| Chromosome number of daughters | Same as parent ($2N$) | Half of parent ($N$) |
| Homolog pairing | No | Yes (prophase I) |
| Crossing over | Rare/none | Yes (prophase I) |
| Genetically identical daughters? | Yes | No |
| Site | Somatic cells | Germ cells (in gonads) |

**Meiosis in males vs females.**

The general meiotic process is the same, but the cellular output differs:

**Spermatogenesis** (males): One primary spermatocyte $\\to$ 4 sperm cells. All four products become functional gametes. Sperm are produced continuously from puberty through most of life.

**Oogenesis** (females): One primary oocyte $\\to$ 1 egg + 3 polar bodies. Only one of the four meiotic products becomes an egg; the other three (polar bodies) contain very little cytoplasm and eventually die. This concentrates all cellular resources in the one egg. Oogenesis begins during fetal development, pauses in prophase I, and resumes at ovulation — meaning eggs can be "paused" for decades.

**Errors in meiosis: nondisjunction.**

When chromosomes fail to separate correctly, gametes end up with wrong numbers of chromosomes. This is called **nondisjunction**.

- **Nondisjunction in meiosis I**: entire homologous pair goes to one daughter cell.
- **Nondisjunction in meiosis II**: both sister chromatids go to one daughter cell.

Results: some gametes have an extra chromosome ($N+1$); others are missing one ($N-1$). Fertilization then produces zygotes with $2N+1$ (**trisomy**) or $2N-1$ (**monosomy**).

**Consequences of aneuploidy** (wrong chromosome number):
- Most aneuploidies are embryonic lethal.
- **Trisomy 21 (Down syndrome)**: about 1 in 700 births. Most survivable trisomy of an autosome. Individuals have intellectual disability, characteristic facial features, elevated risk of heart defects, leukemia, and early-onset Alzheimer's.
- **Trisomy 18 (Edwards syndrome)** and **Trisomy 13 (Patau syndrome)**: both usually cause death within the first year.
- **Turner syndrome (XO)**: only one sex chromosome; females who are short in stature and typically infertile.
- **Klinefelter syndrome (XXY)**: males with an extra X chromosome; often taller than average, sometimes infertile.
- **XYY**: males with an extra Y; usually indistinguishable phenotypically.
- **XXX**: females with an extra X; usually indistinguishable phenotypically.

The frequency of nondisjunction increases with maternal age. This is why the risk of Down syndrome rises significantly for pregnancies at older ages.

**Why sexual reproduction?** From an evolutionary standpoint, sexual reproduction seems inefficient — it requires two parents to produce offspring instead of one, cuts each parent's genetic contribution in half, and requires the machinery of meiosis. Yet nearly all eukaryotic lineages do it. Why?

The dominant answer: **genetic diversity is valuable in changing environments**. Sexual reproduction generates novel gene combinations that natural selection can act on. When environments change (parasites evolve, climates shift), populations with more variation are more likely to contain individuals with successful adaptations. Asexual lineages, generating little variation, are more vulnerable to extinction when conditions change.

**Meiosis matters because it is the foundation of genetics.** The rules of inheritance (Unit 5.2) emerge from what happens during meiosis. Understanding meiosis makes Mendelian genetics obvious; not understanding it makes genetics feel like arbitrary rules.`,
      video: {
        url: 'https://www.youtube.com/watch?v=qCLmR9-YY7o',
        title: 'CrashCourse Biology — Meiosis',
        provider: 'CrashCourse',
      },
    },
    {
      code: '5.2',
      title: 'Mendelian genetics',
      content:
`Gregor Mendel (1822-1884), an Augustinian friar at the Abbey of St. Thomas in Brünn (now Brno, Czech Republic), figured out the fundamental laws of inheritance decades before anyone knew about DNA, chromosomes, or meiosis. His 1866 paper, based on 8 years of careful experiments with pea plants, was ignored during his lifetime — chromosome behavior wasn't understood until the 1880s, and Mendel's work was rediscovered around 1900. Since then, "Mendelian genetics" has been the entry point for teaching heredity.

**Mendel's model organism: the pea plant.** Peas were an inspired choice:
- They have distinct traits that come in easily distinguishable variants (tall/short, purple/white flowers, round/wrinkled seeds).
- They can be self-pollinated (yielding **pure-breeding lines** — populations that produce offspring identical to the parent).
- They can be manually cross-pollinated for controlled experiments.
- They produce many offspring, allowing statistical analysis.
- Generations are short (weeks).

Mendel worked with 7 traits, each having two variants. His experiments involved thousands of plants over multiple generations.

**Mendel's experimental design.**

Take pure-breeding lines of two contrasting variants:
- **Parent (P) generation**: tall × short.
- Cross-pollinate.
- **F$_1$ generation** (first filial): all offspring were tall. Where did short go?
- Let F$_1$ self-pollinate.
- **F$_2$ generation**: about $3/4$ tall, $1/4$ short — approximately $3:1$ ratio.

This pattern was consistent for all seven traits Mendel studied.

**Mendel's interpretations.**

From these patterns, Mendel deduced (without seeing anything at the cellular level):

**1. Each trait is controlled by discrete factors** (now called **genes**). Each factor comes in variant forms (now called **alleles**).

**2. Each individual has two copies of each factor** (one from each parent). We now recognize this as the two homologous chromosomes.

**3. Each parent contributes one copy** (one gene) to each offspring. This is the **Law of Segregation**: during gamete formation, the two alleles of a gene separate so that each gamete carries only one. Now recognized as meiosis I separating homologs.

**4. Some alleles are dominant over others**. The dominant allele masks the presence of the recessive allele in heterozygotes.

**Modern terminology.**

- **Gene**: a heritable unit that codes for a particular trait. A specific stretch of DNA at a specific location (**locus**) on a chromosome.
- **Allele**: an alternate version of a gene. For example, the "flower color" gene in Mendel's peas has purple and white alleles.
- **Genotype**: an individual's genetic makeup — which alleles they carry.
- **Phenotype**: an individual's observable traits, resulting from the interaction of genotype with environment.
- **Homozygous**: two identical alleles at a locus (e.g., $PP$ or $pp$).
- **Heterozygous**: two different alleles at a locus (e.g., $Pp$).
- **Dominant allele**: expressed in the phenotype of heterozygotes. Denoted with a capital letter.
- **Recessive allele**: masked in heterozygotes; expressed only in homozygotes for the recessive allele. Denoted with lowercase.

**A concrete Mendelian cross.**

Take Mendel's pea plants with purple ($P$) dominant and white ($p$) recessive flowers.

**Parental cross** (both pure-breeding): $PP \\times pp$.

Gametes: all $P$ from one parent; all $p$ from the other.

Offspring (**F$_1$**): all $Pp$ — heterozygous. Phenotypically all purple (because $P$ is dominant).

**F$_1$ self-cross**: $Pp \\times Pp$.

Gametes: each parent produces gametes with either $P$ or $p$ (equal proportions).

**Punnett square:**

|  | P | p |
|--|---|---|
| **P** | PP | Pp |
| **p** | Pp | pp |

Genotypic ratio: $1:2:1$ ($PP : Pp : pp$).
Phenotypic ratio: $3:1$ (purple : white).

This is the classic **monohybrid cross** producing a $3:1$ phenotypic ratio.

**Test cross.** How do you determine whether a purple-flowered plant is $PP$ or $Pp$? Cross with a $pp$ individual.

- If purple parent is $PP$: all offspring purple ($Pp$).
- If purple parent is $Pp$: half offspring purple ($Pp$), half white ($pp$).

The test cross was Mendel's tool for identifying heterozygotes.

**Dihybrid cross — two traits at once.**

Mendel then examined two traits simultaneously. Example: seed color (yellow $Y$ dominant, green $y$ recessive) and seed shape (round $R$ dominant, wrinkled $r$ recessive).

**Parental cross**: $YYRR \\times yyrr$ (pure-breeding).

**F$_1$**: all $YyRr$ — heterozygous for both.

**F$_1$ self-cross**: $YyRr \\times YyRr$.

Each parent produces four types of gametes with equal frequency: $YR, Yr, yR, yr$.

$4 \\times 4$ Punnett square gives 16 combinations. Phenotypic outcome:

- $9/16$ yellow round (Y_R_).
- $3/16$ yellow wrinkled (Y_rr).
- $3/16$ green round (yyR_).
- $1/16$ green wrinkled (yyrr).

This **9:3:3:1 ratio** is the classic dihybrid ratio. It emerges from Mendel's **Law of Independent Assortment**: alleles of different genes segregate independently during gamete formation. This corresponds to the random orientation of homologous pairs at metaphase I.

**Independent assortment applies only to genes on different chromosomes or far apart on the same chromosome.** Genes close together on the same chromosome tend to be inherited together (**linkage**, covered in 5.5).

**Solving genetics problems: the systematic approach.**

1. **Identify the genes involved** and pick symbols for the alleles (uppercase for dominant, lowercase for recessive).
2. **Write the parental genotypes**.
3. **Determine the gametes** each parent can produce. (Number of gametes = $2^n$ where $n$ is the number of heterozygous genes.)
4. **Set up a Punnett square** (or use the branch method or probability multiplication).
5. **Determine offspring genotypes and phenotypes** with their ratios.

**Probability approach.** For multi-gene crosses, multiply probabilities of independent events.

Example: In $YyRr \\times YyRr$, probability of getting a yellow (Y_) round (R_) seed:
- P(yellow) = $3/4$.
- P(round) = $3/4$.
- P(yellow AND round) = $3/4 \\times 3/4 = 9/16$. Matches Punnett square.

This method is much faster than Punnett squares for multi-gene problems.

**Sum and product rules.**
- **Product rule**: P(A and B) = P(A) $\\times$ P(B), if A and B are independent.
- **Sum rule**: P(A or B) = P(A) + P(B), if A and B are mutually exclusive.

Example: In $YyRr \\times YyRr$, probability of a homozygous recessive at both loci: $1/4 \\times 1/4 = 1/16$. Probability of at least one dominant: $1 - 1/16 = 15/16$.

**Human Mendelian traits.**

Some human traits follow classic Mendelian inheritance:

- **Ear lobes**: attached ($ll$) vs free ($L_$). Note: this classic textbook example is oversimplified; ear lobe morphology is actually polygenic.
- **Widow's peak**: dominant hairline pattern.
- **Rolled tongue**: dominant.

However, most human traits are polygenic or influenced by environment. Simple Mendelian traits are the exception in humans, not the rule.

**Autosomal genetic disorders.**

Many human genetic diseases follow Mendelian patterns.

**Autosomal recessive**: two copies of the mutant allele needed for the disease. Heterozygotes are unaffected carriers.

- **Cystic fibrosis**: mutations in CFTR gene. About 1 in 3,000 births among European descent.
- **Sickle cell anemia**: mutation in hemoglobin gene. About 1 in 500 births among African descent.
- **Tay-Sachs disease**: mutations in HEXA gene. Higher frequency in Ashkenazi Jewish population.
- **Phenylketonuria (PKU)**: cannot metabolize phenylalanine.

**Autosomal dominant**: one copy of the mutant allele causes disease. Every affected parent has 50% chance of passing to each child.

- **Huntington's disease**: neurodegenerative disease, symptoms typically start in 40s.
- **Achondroplasia**: dwarfism.
- **Marfan syndrome**: connective tissue disorder.

**Pedigrees**: family history charts used to trace genetic disorders. Standard conventions:
- Squares = males; circles = females.
- Filled = affected; unfilled = unaffected.
- Horizontal line between two individuals = mating.
- Vertical line down to horizontal line = offspring.

From a pedigree, you can often determine:
- Whether the trait is dominant or recessive.
- Whether it's autosomal or sex-linked.
- Genotypes of specific individuals.

**Codominance and incomplete dominance** — modifications of simple dominance:

**Incomplete dominance**: heterozygotes have intermediate phenotype. Example: snapdragon flowers — red $\\times$ white $\\to$ pink in F$_1$.

**Codominance**: both alleles express fully in heterozygote. Example: **ABO blood type**. Alleles: $I^A$, $I^B$, $i$. $I^A$ and $I^B$ are codominant to each other; both are dominant over $i$.

- $I^A I^A$ or $I^A i$: type A (produces A antigens).
- $I^B I^B$ or $I^B i$: type B.
- $I^A I^B$: type AB (produces both A and B antigens — codominant).
- $ii$: type O (produces neither antigen).

**Multiple alleles**: a gene can have more than two alleles in a population. The ABO gene has three main alleles.

**Pleiotropy**: one gene affects multiple traits. Example: sickle cell mutation affects red blood cell shape, oxygen transport, resistance to malaria, and many downstream effects.

**Epistasis**: one gene's effect depends on another gene. Example: coat color in Labrador retrievers depends on both a pigment gene and an expression gene.

**Polygenic inheritance**: multiple genes contribute to a single trait. Example: height in humans is influenced by many genes (plus environment). Traits show continuous variation rather than distinct categories.

**Beyond simple Mendelian inheritance.** The chapter covers exceptions and complications, but Mendel's basic laws — segregation, independent assortment, dominance — remain the foundation of genetics. Understanding them makes the exceptions comprehensible; missing them makes genetics feel arbitrary.`,
      video: {
        url: 'https://www.youtube.com/watch?v=Mehz7tCxjSE',
        title: 'CrashCourse Biology — Heredity',
        provider: 'CrashCourse',
      },
    },
    {
      code: '5.3',
      title: 'Non-Mendelian inheritance',
      content:
`Mendel's laws provide the foundation of genetics but many real traits show more complex patterns. These "non-Mendelian" patterns don't violate Mendel's ideas — they just extend them. Understanding these extensions is essential for making sense of real-world genetic diversity, from human eye color to genetic disorders to the crops and animals we breed.

**Incomplete dominance.**

The heterozygote has an intermediate phenotype between the two homozygotes. Neither allele is fully dominant.

**Classic example: snapdragon flowers.** In snapdragons (*Antirrhinum majus*):
- $RR$ = red flowers.
- $rr$ = white flowers.
- $Rr$ = pink flowers (intermediate).

Cross $Rr \\times Rr$: $1$ red : $2$ pink : $1$ white. Phenotypic ratio matches genotypic ratio because each genotype has a distinct phenotype.

**Human example: hypercholesterolemia** (familial). LDL receptor gene:
- Homozygous normal: normal LDL levels.
- Heterozygous: elevated LDL, moderate cardiovascular risk.
- Homozygous mutant: extremely high LDL, severe early cardiovascular disease.

**Codominance.**

Both alleles are expressed simultaneously in the heterozygote. Neither is dominant over the other; both phenotypes appear together.

**Classic example: ABO blood type.**

Three alleles at one locus:
- $I^A$: produces A antigens on red blood cells.
- $I^B$: produces B antigens.
- $i$: produces no antigens.

$I^A$ and $I^B$ are **codominant** to each other; both are **dominant** over $i$.

Blood-type genotypes and phenotypes:
- $I^A I^A$ or $I^A i$: type A.
- $I^B I^B$ or $I^B i$: type B.
- $I^A I^B$: type AB (both antigens produced — codominance).
- $ii$: type O (no antigens).

Blood-type inheritance illustrates both **codominance** (in AB) and **multiple alleles** (three alleles in the population, though each individual only has two).

**Blood transfusion compatibility.** Immune system attacks unfamiliar antigens. Rules:
- Type O: universal donor (no antigens); can only receive O.
- Type AB: universal recipient (already has both antigens); can receive from any type.
- Type A: can receive A and O.
- Type B: can receive B and O.

**Multiple alleles.**

More than two alleles exist in the population for a single gene, even though each individual has only two. Examples:
- **ABO blood type** (three alleles).
- **Rabbit coat color** (four alleles: C, ch, ch, cc for full color, chinchilla, Himalayan, albino).
- **Human eye color** (though this is more polygenic than a single locus with multiple alleles).

**Pleiotropy.**

A single gene affects multiple, seemingly unrelated traits.

**Classic example: sickle cell anemia.** One mutation in the $\\beta$-globin gene affects:
- Red blood cell shape (becomes sickle-shaped when deoxygenated).
- Oxygen transport (reduced).
- Blood viscosity (increased due to abnormal cell shapes).
- Circulation (blockages in small blood vessels).
- Vulnerability to malaria (heterozygotes have partial protection).
- Many downstream complications (organ damage, painful crises, stroke risk).

**Another example: Marfan syndrome.** A mutation in the FBN1 gene (fibrillin) affects:
- Skeletal system (tall, long limbs, chest deformities).
- Cardiovascular system (aortic dilation, mitral valve prolapse).
- Eyes (dislocated lens).
- Skin (stretch marks).
- Lung tissue.

Presidential candidate Abraham Lincoln is speculated to have had Marfan syndrome based on his unusual physical features.

**Epistasis.**

One gene affects the expression of another gene. The genotype at one locus determines whether the genotype at another locus can be expressed.

**Classic example: coat color in Labrador retrievers.**

Two genes involved:
- **Pigment gene**: $B$ (black) is dominant; $b$ (chocolate/brown) is recessive.
- **Expression gene**: $E$ (allows pigment expression) is dominant; $e$ (blocks pigment expression, yielding yellow coat) is recessive.

Coat color depends on both genes:
- $B_E_$: black.
- $bbE_$: chocolate/brown.
- $__ee$: yellow (regardless of pigment gene genotype).

Cross $BbEe \\times BbEe$:
- $9/16$ $B_E_$: black.
- $3/16$ $bbE_$: chocolate.
- $4/16$ $__ee$: yellow (both $B_ee$ and $bbee$ are yellow).

Modified $9:3:4$ ratio (from the standard $9:3:3:1$) is a signature of epistasis.

**Another example: bombay phenotype in humans.** A recessive mutation at the H gene prevents production of the H antigen, which is a precursor for A and B antigens. Someone with the Bombay genotype ($hh$) will phenotypically appear type O regardless of their ABO genotype. This confused early blood-typing tests.

**Polygenic inheritance.**

Multiple genes contribute to a single trait. Traits show **continuous variation** (a range of values) rather than distinct categories.

**Human height** is influenced by hundreds of genes plus environment. Height distribution is roughly bell-shaped in a population.

**Human skin color** is influenced by many genes affecting melanin production and distribution. Continuous spectrum from very light to very dark.

**Weight, IQ, blood pressure, susceptibility to many diseases** — all polygenic.

Polygenic traits produce **normal distributions** (bell curves) in populations. Extreme phenotypes require many rare alleles; average phenotypes are more common.

**Environmental effects on phenotype (see 5.4)** interact strongly with genetics for polygenic traits.

**Sex-linked inheritance.**

Genes on the sex chromosomes (X or Y) show inheritance patterns different from autosomal genes.

**X-linked traits** are especially important because the X chromosome carries many genes while the Y is small and carries few.

Females ($XX$) have two copies of X-linked genes; males ($XY$) have only one.

**X-linked recessive** — most common category:
- Females need two copies of the recessive allele to express the phenotype.
- Males need only one copy (they have only one X).
- Males are more commonly affected.
- Affected fathers pass the allele to all daughters (who become carriers) but no sons.
- Carrier mothers pass the allele to 50% of daughters and 50% of sons.

**Classic examples**:
- **Red-green color blindness**: ~8% of males, ~0.4% of females. Located on X chromosome.
- **Hemophilia**: bleeding disorder. Historically famous in European royal families descended from Queen Victoria (a carrier).
- **Duchenne muscular dystrophy**: severe muscle degeneration.

**X-inactivation.** Females have two X chromosomes; males have one. This creates a "dosage" imbalance. To compensate, one of the two X chromosomes in each somatic cell of females is randomly inactivated during early embryonic development. The inactive X becomes condensed and largely silent — visible as a **Barr body** in cells.

X-inactivation is why:
- Female mammals don't have double the X-gene expression of males.
- **Female calico cats** have patchy coats — different patches have different X chromosomes active (one carrying orange coat allele, one carrying black).
- **Female heterozygotes for X-linked disorders** are mosaic — some cells express the mutant allele, some the normal.

**Y-linked traits**: carried on Y chromosome. Rare because Y has few genes. Passed only father-to-son.

**Mitochondrial DNA and maternal inheritance.**

Mitochondria have their own small circular DNA (relic of their bacterial ancestry — see Unit 2.10).

Mitochondrial DNA is inherited exclusively from the mother. The egg's cytoplasm contains all the mitochondria that go into the zygote; sperm mitochondria are actively destroyed after fertilization.

Consequences:
- **Mitochondrial diseases** (Leber's hereditary optic neuropathy, mitochondrial myopathies, others) pass only from mother to child.
- **Mitochondrial DNA analysis** used in tracing maternal lineages. All humans trace back to a "mitochondrial Eve" who lived ~200,000 years ago in Africa.

**Chloroplast inheritance** in plants is similarly maternal in most species.

**Genomic imprinting.**

Some genes are expressed differently depending on whether they're inherited from mother or father. This is called **genomic imprinting**.

Mechanism: chemical marks (methylation) on the DNA silence one parental copy.

**Example: Angelman and Prader-Willi syndromes** — different phenotypes from deletions in the same region of chromosome 15:
- Deletion on paternal chromosome → Prader-Willi syndrome (developmental delay, obesity, food obsession).
- Deletion on maternal chromosome → Angelman syndrome (severe intellectual disability, seizures, characteristic facial expression).

The same DNA deletion produces different diseases depending on parental origin. Imprinting is a striking exception to the general rule that maternal and paternal contributions are equivalent.

**Nature vs nurture — environmental effects.**

Even for genes with clear inheritance patterns, environment plays a role. **Phenotype = genotype + environment + interactions**.

- **PKU**: caused by a specific mutation, but symptoms preventable by diet (low phenylalanine).
- **Type 2 diabetes**: genetic predisposition, but lifestyle matters enormously.
- **Height**: genetically determined potential, but nutrition affects realization.
- **Cancer**: genetic risk plus environmental exposures.

The **norm of reaction** concept: the range of phenotypes possible for a given genotype across different environments. Some genotypes have narrow reaction norms (little environmental variation); others have wide reaction norms (highly variable).

**Chromosome disorders — nondisjunction and aneuploidy** (covered in 5.1).

**Structural chromosome changes.**

Chromosomes can also be structurally altered:
- **Deletions**: loss of chromosome segment.
- **Duplications**: extra copy of chromosome segment.
- **Inversions**: segment removed and reinserted backward.
- **Translocations**: segment moved to a different chromosome.

**Chronic myeloid leukemia**: caused by a translocation between chromosomes 9 and 22, creating the "Philadelphia chromosome" and the BCR-ABL fusion gene (discussed in Unit 4).

**Practical implications.**

Understanding non-Mendelian patterns matters for:
- **Genetic counseling**: predicting risks for families with genetic disorders.
- **Medical treatment**: personalizing therapy based on genotype.
- **Agriculture**: breeding crops and animals for desired traits.
- **Understanding evolution**: heritability and variation are foundations of natural selection.

**Genetics is complex. Mendelian ratios are the exception, not the rule, for most traits.** But Mendel's basic principles — that traits are controlled by discrete factors that segregate during gamete formation and can assort independently — remain foundational. Non-Mendelian patterns are elaborations on this base, not replacements for it.`,
      video: {
        url: 'https://www.youtube.com/watch?v=CBezq1fFUEA',
        title: 'CrashCourse Biology — Non-Mendelian inheritance',
        provider: 'CrashCourse',
      },
    },
    {
      code: '5.4',
      title: 'Environmental effects on phenotype',
      content:
`Genotype provides genetic potential; **environment** determines how that potential is realized. Even for genes with strict inheritance patterns, phenotypic outcomes depend on the environment during development and throughout life. Understanding gene-environment interactions is essential for accurate genetics — and for reasoning about human traits, disease risk, and public policy.

**The basic equation: Phenotype = Genotype + Environment + (Genotype × Environment).**

The final term captures the fact that genes and environments can interact — a given environment might affect different genotypes differently, and a given genotype might respond differently in different environments.

**Simple examples of environmental effects.**

**Temperature affects coat color in Himalayan rabbits and Siamese cats.**

Both species have a temperature-sensitive enzyme for dark pigment production:
- **Warm regions of the body** (torso): enzyme is inactive; light coat.
- **Cool regions** (ears, feet, tail, face): enzyme is active; dark coat.

If a Siamese cat is shaved and the shaved area kept cool, dark fur grows in the newly exposed area. Genotype hasn't changed; environment (temperature) determined the phenotype.

**Hydrangea flower color depends on soil pH.**

The same hydrangea plant produces:
- **Blue flowers** in acidic soil (pH < 6.5).
- **Pink flowers** in alkaline soil (pH > 7.0).
- **Purple flowers** at intermediate pH.

Underlying mechanism: aluminum ions bind to the anthocyanin pigment in acidic soil, shifting the color. Same plant, same genome, different phenotype.

**Plant height depends on water, light, nutrients.**

A crop plant might grow to 6 feet with abundant water and fertilizer, or 3 feet with limited resources. Same genotype; different environments produce very different phenotypes.

**Nutrition affects human height.**

Average human height has increased dramatically over the past century in most countries as nutrition has improved. Japanese men gained ~5 inches on average from 1900 to 2000 without any change in the underlying genome. Northern European populations show similar patterns.

**Environmental effects on gene expression.**

Even without changing the DNA sequence, environments can affect **which genes are expressed** and how much.

**Nutrition and gene expression**: many genes involved in metabolism are regulated by nutritional signals. During feeding vs fasting, different metabolic genes are expressed.

**Stress and gene expression**: chronic stress affects expression of many genes — inflammatory pathways, HPA axis regulation, immune genes.

**Environmental toxins**: many pollutants affect gene expression, including some that cross the placenta and affect fetal development.

**Epigenetics.**

A whole field of biology has emerged studying **epigenetic** modifications — chemical marks on DNA that alter gene expression without changing the DNA sequence. Environmental factors can:
- Add or remove methyl groups on DNA bases.
- Modify histone proteins that package DNA.
- Alter chromatin structure.

These modifications can be:
- **Reversible**: environmental changes can undo them.
- **Persistent**: lasting through cell divisions.
- **Sometimes heritable**: some epigenetic marks pass from parent to offspring (mostly in the maternal germ line, though the details remain contested).

**Well-studied examples**:
- **Agouti mice**: methylation status of the Agouti gene affects coat color and susceptibility to obesity and diabetes. Mothers' diet during pregnancy affects offspring gene expression via methylation.
- **Dutch Hunger Winter (1944-45)**: children conceived during famine had different metabolic profiles decades later, including higher risk of diabetes and cardiovascular disease. Effects attributed to epigenetic changes from prenatal nutrient deprivation.
- **Trauma and PTSD**: growing evidence that trauma can produce epigenetic changes that alter stress response and may persist across generations.

**Reaction norms.**

The **norm of reaction** is the range of phenotypes a single genotype can produce across different environments.

- **Narrow reaction norm**: genotype produces similar phenotype across environments. Genetic determination dominates.
- **Wide reaction norm**: genotype produces very different phenotypes in different environments. Environmental flexibility.

Examples:
- **Human blood type** (ABO): very narrow reaction norm. Essentially set by genetics.
- **Plant height**: wide reaction norm. Depends heavily on water, nutrients, light.
- **Human intelligence** (measured as IQ): moderate reaction norm. Genetic component substantial, but environmental factors (nutrition, education, stimulation) matter enormously.
- **Disease susceptibility**: wide reaction norm for most diseases. Genetic risk factors interact with environmental exposures.

**Twin studies.**

**Monozygotic (identical) twins** share 100% of their nuclear DNA. Any differences in phenotype must come from environment (and epigenetic factors).

**Dizygotic (fraternal) twins** share ~50% of DNA on average — no more than any other pair of siblings.

Comparing similarities in identical vs fraternal twins for various traits helps estimate genetic contributions:

- **Height**: highly heritable (~80%). Identical twins are usually very similar; fraternal are less similar.
- **Weight**: moderately heritable (~50-70%), with substantial environmental variation.
- **IQ**: moderately heritable (~50-70%) in typical environments. Reduced in impoverished environments where environment is a bigger factor.
- **Personality traits**: moderately heritable (~30-50%).
- **Political views**: also partly heritable, surprisingly.
- **Schizophrenia**: highly heritable (~80% concordance in identical twins, ~10% in fraternal).

Twin studies show that most complex traits have both genetic and environmental components.

**Adoption studies** provide additional evidence about environmental vs genetic influences by comparing adopted children with their biological and adoptive parents.

**Norm of reaction and PKU — the classic example.**

**Phenylketonuria (PKU)** is caused by mutations in the phenylalanine hydroxylase gene. Homozygous individuals can't metabolize the amino acid phenylalanine (found in many foods, especially high-protein ones and the artificial sweetener aspartame).

Without intervention, PKU causes:
- Buildup of phenylalanine in blood and brain.
- Severe intellectual disability, seizures, behavioral problems.

With intervention (low-phenylalanine diet from birth):
- Normal cognitive development.
- Minimal symptoms.

The genotype is unchanged. The phenotype depends entirely on environment. This is why:
- Universal newborn screening for PKU is standard (allows early dietary intervention).
- The condition illustrates that "genetic" doesn't mean "unchangeable."

**Complex disease as gene-environment interaction.**

Most common diseases result from interactions between genetic predispositions and environmental factors:

**Type 2 diabetes**:
- Multiple genes contribute genetic risk.
- Environmental factors: diet, exercise, obesity, age, stress.
- The genes provide susceptibility; environment triggers manifestation.

**Cardiovascular disease**:
- Genetic factors: cholesterol levels, blood pressure regulation, clotting factors.
- Environmental factors: diet, exercise, smoking, stress.

**Cancer**:
- Some cancers have strong genetic components (BRCA mutations for breast/ovarian; APC mutations for colorectal).
- Environmental factors: smoking, sun exposure, diet, infections (HPV for cervical cancer, H. pylori for stomach), radiation.

**Alzheimer's**:
- Genetic risk factors (APOE genotype among strongest).
- Environmental factors: cardiovascular health, cognitive activity, education.

**Depression and other mental illnesses**:
- Multiple genetic risk factors.
- Environmental triggers: stress, trauma, life events, substance use.

For all of these, "the gene for X" is misleading. Genetic factors contribute; environmental factors matter; the interactions are complex.

**Development.**

An organism's development is a temporally extended process where genes and environment constantly interact.

**Critical periods**: some developmental processes must happen during specific windows or they never happen properly.
- Vision development requires visual stimulation in early childhood; kittens raised in darkness during a critical period have permanent vision deficits.
- Language acquisition has critical periods; humans exposed to language after adolescence rarely achieve full fluency.
- Attachment and emotional development have critical periods.

**Fetal environment**:
- Nutrition during pregnancy affects lifelong health outcomes.
- Maternal substance use (alcohol, drugs, tobacco) affects fetal development.
- Maternal stress may affect fetal HPA axis development.
- Maternal infections can cross the placenta or induce immune responses affecting fetal development.

**Practical implications.**

Understanding environmental effects on phenotype has huge practical implications:

- **Medicine**: gene-environment interactions determine disease risk and treatment response. Precision medicine seeks to tailor treatment to individual genotype AND environment.
- **Public health**: many interventions (vaccination, nutrition, prenatal care, education) modify environmental factors that affect gene expression and phenotype.
- **Nutrition**: diet influences gene expression in profound ways. Nutrigenomics is a growing field.
- **Policy**: genetic determinism (attributing outcomes purely to genes) tends to justify inequality; understanding environmental contributions supports investment in improving environments (education, healthcare, nutrition).

**"Nature vs nurture" is a false dichotomy.** Almost all traits are shaped by both genes and environment. The interesting question is how much each contributes for specific traits, and how they interact. Modern genetics is fundamentally about gene-environment interactions.`,
      video: {
        url: 'https://www.youtube.com/watch?v=CBezq1fFUEA',
        title: 'CrashCourse Biology — Genes and environment',
        provider: 'CrashCourse',
      },
    },
    {
      code: '5.5',
      title: 'Chromosomal inheritance and mutations',
      content:
`Genes don't float freely — they're arrayed on chromosomes. This physical organization has important consequences for inheritance. Genes on the same chromosome tend to be inherited together (linkage). Errors in chromosome segregation produce genetic disorders. Mutations at the molecular level provide the raw material for genetic variation and evolution. This subunit ties together the molecular, cellular, and population-genetics perspectives that make up modern heredity.

**Chromosome behavior — recap.**

- **Diploid cells** have chromosomes in **homologous pairs**. One member from each parent.
- **Meiosis** separates homologs (meiosis I) and then sister chromatids (meiosis II) to produce haploid gametes.
- **Fertilization** combines gametes to restore diploidy.

**Genes on the same chromosome — linkage.**

Mendel's Law of Independent Assortment says alleles of different genes segregate independently. But this law only holds if the genes are on different chromosomes (or very far apart on the same chromosome).

Genes located close together on the same chromosome are **linked** — they tend to be inherited together because they don't get separated by independent assortment.

**Testing linkage: dihybrid test cross.**

Cross a dihybrid $YyRr$ with a homozygous recessive $yyrr$. If genes are unlinked:
- Expected 1:1:1:1 ratio of $YyRr : Yyrr : yyRr : yyrr$.

If genes are linked (say $Y$ and $R$ are on the same chromosome):
- Get many more $YyRr$ and $yyrr$ than the recombinant types.
- Actual ratio depends on how tightly linked (how close together on the chromosome).

**Recombination.**

Even linked genes can be separated by **crossing over** during meiosis I. The frequency of recombination between two genes reflects their physical distance on the chromosome:
- **Close together**: little recombination; strongly linked.
- **Far apart**: more recombination; approach independent assortment.
- **Very close (nucleotide-scale)**: negligible recombination.

**Recombination frequency** $= \\dfrac{\\text{recombinant offspring}}{\\text{total offspring}} \\times 100\\%$.

**One map unit (map unit, or centimorgan, cM)** = 1% recombination frequency. Maps show gene positions based on recombination frequencies.

Historical significance: geneticists used recombination data to construct **genetic maps** of chromosomes long before DNA sequencing. **Thomas Hunt Morgan** and his students, working with *Drosophila melanogaster* (fruit flies) in the early 20th century, established chromosome theory and produced the first genetic maps.

**Sex-linked inheritance.**

Genes on the sex chromosomes show distinctive inheritance patterns.

**Sex determination in humans**:
- $XX$ = female.
- $XY$ = male.
- Y chromosome carries the **SRY gene** (Sex-determining Region Y), which triggers male development. In its absence, embryos develop as female.

**X chromosome** is large (about 155 million bp) and carries thousands of genes.
**Y chromosome** is small (about 57 million bp) and carries only a few dozen genes, mostly related to male development.

**X-linked recessive inheritance**:
- Females need two mutant alleles to express the phenotype.
- Males need only one (they have only one X).
- Result: males are affected far more often than females.
- Affected fathers pass the allele to all daughters (who become carriers) but no sons (sons inherit their father's Y, not X).
- Carrier mothers pass the allele to 50% of daughters (who become carriers) and 50% of sons (who are affected).

**Examples**:
- **Red-green color blindness**: ~8% of males, ~0.4% of females.
- **Hemophilia**: bleeding disorder. Historically famous in European royal families (Queen Victoria was a carrier; her descendants included affected males in Russian, Spanish, and other royal houses).
- **Duchenne muscular dystrophy**: severe muscle degeneration. Very rare in females.

**X-linked dominant inheritance**: mutation on X chromosome, expressed even in heterozygous females. Rare but examples exist (e.g., certain forms of vitamin-D-resistant rickets).

**Y-linked traits**: passed only father-to-son. Rare because Y carries few genes.

**Mitochondrial inheritance**: covered in 5.3 — passed only from mother.

**Nondisjunction and chromosomal disorders (covered in 5.1)**.

**Structural chromosome changes.**

Chromosomes can be broken and rearranged in various ways:

**Deletion**: a segment of chromosome is lost. Missing genes cause various developmental problems.
- **Cri-du-chat syndrome**: deletion on chromosome 5. Distinctive cry, intellectual disability.

**Duplication**: a segment is duplicated. Extra copies of genes.

**Inversion**: a segment is removed and reinserted backward.

**Translocation**: a segment moves to a different chromosome. Reciprocal translocations exchange segments between two chromosomes.

**Chronic myeloid leukemia (CML)**: caused by a translocation between chromosomes 9 and 22, creating the **Philadelphia chromosome**. This fuses the BCR gene (from chromosome 22) with the ABL kinase gene (from chromosome 9), producing a constitutively active tyrosine kinase that drives cancer.

**Imatinib (Gleevec)** — a targeted therapy — was designed specifically to inhibit BCR-ABL. It transformed CML from a fatal disease to a manageable one; became a model for targeted cancer therapy.

**Aneuploidy** (wrong chromosome number, covered in 5.1): trisomy 21 (Down syndrome), Turner (XO), Klinefelter (XXY), etc.

**Polyploidy** (extra whole sets of chromosomes): common in plants; rare and usually fatal in animals. **Wheat** is hexaploid ($6N$). Many crop plants are polyploid.

**Molecular mutations.**

At the DNA level, mutations happen constantly. Most are neutral; some are harmful; a few are beneficial. Beneficial mutations provide the raw material for evolution.

**Point mutations** — single-nucleotide changes:

**Substitutions**: one base pair replaces another.
- **Silent mutation**: the change doesn't alter the amino acid (genetic code is redundant). No functional consequence.
- **Missense mutation**: the change alters the amino acid. May affect protein function (mildly or severely).
- **Nonsense mutation**: the change creates a stop codon prematurely. Truncated protein, usually non-functional.

**Sickle cell mutation**: a single missense mutation (Glu → Val at position 6 of $\\beta$-globin) transforms hemoglobin properties.

**Insertions and deletions** (indels): add or remove nucleotides.
- **Frameshift mutation**: if the number of nucleotides added or removed isn't a multiple of 3, the reading frame shifts. Every codon downstream is altered. Usually catastrophic.
- **In-frame indels** (multiples of 3): add or remove complete codons; usually less severe.

**Repeat expansions**: certain regions of DNA have repeating triplets (e.g., CAG). If the number of repeats expands beyond a threshold, disease results.
- **Huntington's disease**: CAG repeats in the HTT gene. More repeats = earlier onset.
- **Fragile X syndrome**: CGG repeats. Most common inherited cause of intellectual disability.

**Larger mutations**:
- **Chromosomal rearrangements** (discussed above).
- **Copy number variations**: some genes are present in different numbers in different people.

**Causes of mutations**:
- **Spontaneous** errors during DNA replication (rare — DNA polymerase has proofreading).
- **Chemical mutagens** (many industrial chemicals, some medications).
- **Radiation** (UV, X-rays, gamma rays).
- **Some viruses** (integrate into host genome, disrupting genes).
- **Tobacco smoke** contains many mutagens; causes many cancer mutations.

**Mutation rates**: humans experience about $10^{-9}$ mutations per nucleotide per generation — meaning each human offspring has ~100 new mutations (about 30-70 in coding regions).

**Cancer as mutation.**

Cancer is fundamentally a disease of accumulated mutations in somatic cells. Cells acquire mutations in:
- **Oncogenes**: activated versions promote cell division. Examples: Ras, HER2.
- **Tumor suppressor genes**: normally restrain cell division. Loss of function contributes to cancer. Examples: p53, RB, APC.
- **DNA repair genes**: loss of function increases mutation rate. Examples: BRCA1, BRCA2 (mostly involved in breast/ovarian cancer risk).

Most cancers require multiple mutations to develop — often 4-10 driver mutations plus many "passenger" mutations. This explains why cancer risk rises with age (more time to accumulate mutations) and with mutagen exposure.

**Genetic testing.**

Modern genetics offers many types of testing:

**Karyotyping**: photograph of stained chromosomes to detect chromosomal disorders (Down syndrome, translocations, deletions).

**Fluorescence in situ hybridization (FISH)**: fluorescent probes bind specific DNA regions; used for detecting specific chromosome abnormalities.

**PCR-based tests**: amplify specific DNA regions to detect mutations, viral infections, etc.

**Sequencing**:
- **Sanger sequencing**: reads single DNA fragments.
- **Next-generation sequencing (NGS)**: parallel sequencing of many fragments; used for whole-genome or whole-exome sequencing.
- **Whole-genome sequencing** now costs about $1000 per genome (compared to $3 billion for the first human genome, completed 2003).

**Genetic screening**:
- **Prenatal screening**: amniocentesis, chorionic villus sampling, non-invasive prenatal testing (NIPT) — analyzes fetal DNA in maternal blood.
- **Newborn screening**: mandatory in most US states for PKU, cystic fibrosis, sickle cell, and many others.
- **Genetic testing for individuals**: BRCA testing for breast cancer risk, familial cardiomyopathy testing, etc.
- **Direct-to-consumer testing**: 23andMe, AncestryDNA — provides some ancestry and health information.

**Ethical issues**:
- Genetic privacy.
- Genetic discrimination (US Genetic Information Nondiscrimination Act, GINA, 2008, provides some protection).
- Handling incidental findings.
- Prenatal testing and abortion decisions.
- Genetic engineering and CRISPR (see Unit 6).

**The bigger picture.** Understanding heredity means understanding chromosomes, meiosis, Mendelian and non-Mendelian inheritance patterns, gene-environment interactions, chromosomal disorders, and mutations. These threads all come together to explain how genetic information passes from generation to generation and how variation arises. Genetics is the framework for evolution, medicine, breeding, and understanding what makes each individual unique.`,
      video: {
        url: 'https://www.youtube.com/watch?v=CBezq1fFUEA',
        title: 'CrashCourse Biology — Chromosomes and mutations',
        provider: 'CrashCourse',
      },
    },
  ],
  keyConcepts: [
    'Meiosis produces 4 haploid gametes from 1 diploid cell in two consecutive divisions.',
    'Meiosis I separates homologous chromosomes (reductional division). Meiosis II separates sister chromatids.',
    'Genetic diversity from meiosis: (1) crossing over in prophase I; (2) independent assortment in metaphase I; (3) random fertilization.',
    'Diploid $2N$ vs haploid $N$; humans $2N=46$ (22 autosomes + XX or XY).',
    'Nondisjunction produces aneuploidy: Down syndrome (trisomy 21), Turner (XO), Klinefelter (XXY).',
    'Mendel\'s laws: Segregation (alleles separate into gametes) and Independent Assortment (different genes segregate independently, if on different chromosomes).',
    'Monohybrid: $Pp \\times Pp$ gives 3:1 phenotypic, 1:2:1 genotypic ratio.',
    'Dihybrid: $YyRr \\times YyRr$ gives 9:3:3:1 phenotypic ratio.',
    'Genotype vs phenotype; homozygous vs heterozygous; dominant vs recessive.',
    'Test cross with recessive parent reveals unknown genotype.',
    'Beyond Mendel: incomplete dominance (intermediate), codominance (both expressed, e.g., AB blood), multiple alleles (ABO), pleiotropy (one gene, many effects), epistasis (one gene affects another).',
    'Polygenic inheritance: multiple genes for one trait; continuous variation.',
    'Sex-linked (X-linked) inheritance: males more affected by X-linked recessive (color blindness, hemophilia).',
    'X-inactivation in females (Barr body); calico cats show mosaic patterns.',
    'Mitochondrial DNA: maternally inherited.',
    'Genomic imprinting: parental origin matters (Angelman vs Prader-Willi).',
    'Phenotype = genotype + environment + interactions.',
    'PKU: genetic mutation, phenotype prevented by diet.',
    'Norm of reaction: range of phenotypes possible for a genotype across environments.',
    'Twin studies estimate heritability by comparing identical and fraternal twins.',
    'Linkage: genes close together on same chromosome inherited together.',
    'Recombination frequency $= $ (recombinants / total) $\\times 100\\%$; used for genetic mapping.',
    'Point mutations: silent, missense, nonsense; frameshift from indels.',
    'Cancer results from accumulated somatic mutations in oncogenes, tumor suppressors, DNA repair genes.',
  ],
  formulas: [
    {
      name: 'Probability of specific genotype/phenotype',
      equation: '$P(\\text{multi-gene trait}) = \\prod P(\\text{single-gene traits})$',
      meaning: 'For independent genes, multiply probabilities. Faster than Punnett squares for multi-gene problems.',
      example: 'In $YyRr \\times YyRr$: P(yellow round) = $\\frac{3}{4} \\times \\frac{3}{4} = \\frac{9}{16}$.',
    },
    {
      name: 'Recombination frequency',
      equation: '$RF = \\dfrac{\\text{recombinant offspring}}{\\text{total offspring}} \\times 100\\%$',
      meaning: 'Measures linkage — frequency at which two genes are separated by crossing over. Used to build genetic maps.',
      example: 'If test cross of $YyRr \\times yyrr$ gives 100 offspring with 15 recombinants, RF = 15%, meaning genes are 15 map units apart.',
    },
    {
      name: 'Number of gamete types',
      equation: '$2^n$ where $n$ = number of heterozygous genes',
      meaning: 'A trihybrid $AaBbCc$ produces $2^3 = 8$ different gamete types with equal frequency.',
      example: 'Person with genotype $AaBbCcDd$ produces $2^4 = 16$ gamete types.',
    },
    {
      name: 'Punnett square size',
      equation: '$2^n \\times 2^n$ grid',
      meaning: 'For dihybrid cross ($n=2$), 4×4=16 cells. For trihybrid ($n=3$), 8×8=64 cells.',
      example: 'Trihybrid Punnett squares are unwieldy; use probability multiplication instead.',
    },
  ],
  practice: [
    {
      q: 'In fruit flies, gray body ($B$) is dominant over black body ($b$), and normal wings ($V$) are dominant over vestigial wings ($v$). If $BbVv \\times bbvv$, what phenotypic ratios do you expect for offspring?',
      a: 'This is a dihybrid test cross. Each dihybrid ($BbVv$) produces four gamete types: $BV$, $Bv$, $bV$, $bv$ (equal frequencies). The other parent ($bbvv$) produces only $bv$ gametes. Combining: $BbVv, Bbvv, bbVv, bbvv$ in 1:1:1:1 ratio. Phenotypes: gray normal, gray vestigial, black normal, black vestigial — 1:1:1:1. Note: this assumes genes are unlinked. If linked, the recombinant classes (Bbvv and bbVv) would be less frequent.',
    },
    {
      q: 'A woman with type AB blood marries a man with type O blood. What blood-type genotypes and phenotypes are possible for their children?',
      a: 'Mother ($I^A I^B$) can produce $I^A$ or $I^B$ gametes (50% each). Father ($ii$) can produce only $i$ gametes. Children genotypes: $I^A i$ (type A) or $I^B i$ (type B), each with 50% probability. No child could be type AB or type O.',
    },
    {
      q: 'A woman is a carrier of hemophilia (X-linked recessive). Her husband is unaffected. What is the probability their next child is (a) an affected son; (b) a carrier daughter; (c) any affected child?',
      a: 'Mother genotype: $X^H X^h$ (carrier). Father genotype: $X^H Y$ (unaffected). Possible children (from Punnett square): $X^H X^H$ (25%, unaffected daughter), $X^H X^h$ (25%, carrier daughter), $X^H Y$ (25%, unaffected son), $X^h Y$ (25%, affected son). (a) P(affected son) = 25%. (b) P(carrier daughter) = 25%. (c) P(any affected child) = 25% (only sons can be affected in this cross).',
    },
    {
      q: 'Explain why the frequency of Down syndrome (trisomy 21) increases with maternal age but not paternal age.',
      a: 'Down syndrome results from meiotic nondisjunction of chromosome 21, mostly during oogenesis in the mother. In females, oocytes begin meiosis I during fetal development and pause in prophase I until ovulation. Eggs ovulated in the mother\'s later years have been paused for decades, during which time chromosome adhesion proteins can degrade. This increases the likelihood of nondisjunction during meiosis I resumption at ovulation. Sperm, in contrast, are continuously produced through the male\'s life with fewer of the age-related risks. So Down syndrome frequency rises from ~1/1,500 at maternal age 20 to ~1/100 at age 40. Paternal age has only a small effect on Down syndrome specifically, though older paternal age is associated with increased de novo mutations of other types.',
    },
    {
      q: 'A pea plant has genotype $AaBbCc$. How many different types of gametes can it produce, and what fraction of gametes will be $AbC$?',
      a: 'For each heterozygous locus, a gamete gets one of two possible alleles. Number of gamete types = $2^n$ where $n$ is the number of heterozygous loci = $2^3 = 8$. The probability of getting $A$, $b$, and $C$ is $1/2 \\times 1/2 \\times 1/2 = 1/8$. So 1/8 of gametes are $AbC$.',
    },
  ],
  pitfalls: [
    '"Dominant means the allele is more common in the population" — wrong. Dominance describes what happens in heterozygotes, not allele frequency. In many populations, some dominant alleles are rare and some recessive alleles are common.',
    '"Genotype determines phenotype" — usually oversimplified. Most phenotypes result from genotype-environment interactions.',
    '"Meiosis is just mitosis twice" — wrong. Meiosis has distinctive events (homolog pairing, crossing over, independent assortment) that don\'t happen in mitosis. It reduces chromosome number by half and generates genetic diversity.',
    '"Independent assortment applies to all gene pairs" — only applies to genes on different chromosomes (or far apart on the same chromosome). Linked genes don\'t assort independently.',
    '"X-linked traits are only inherited by males" — wrong. Females can also inherit X-linked traits. Recessive X-linked traits are more commonly expressed in males because they need only one copy.',
    '"Mitochondrial DNA is inherited equally from both parents" — wrong. Almost always maternally inherited.',
    '"Multiple alleles means one individual can have many alleles" — wrong. An individual has at most two alleles per gene (one from each parent). "Multiple alleles" refers to the population having many possible alleles for a gene.',
    '"Blood type AB is codominant" — the ABO SYSTEM shows codominance in AB heterozygotes; blood type AB is one of the four phenotypes.',
    '"Punnett squares work for any cross" — impractical for many-gene problems (8×8, 16×16, etc.). Use probability multiplication instead.',
    '"Mutations are always harmful" — most are neutral; some are harmful; some are beneficial. Beneficial mutations provide raw material for evolution.',
  ],
};
