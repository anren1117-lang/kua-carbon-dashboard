// AP Biology Unit 7 — Natural Selection (13-20% of exam)
// APES-standard depth.

export const APBIO_UNIT_7 = {
  number: 7,
  title: 'Natural Selection',
  weight: '13-20%',
  subunits: [
    {
      code: '7.1',
      title: 'Introduction to natural selection',
      content:
`**Natural selection** is the mechanism of evolution by which populations change over generations. Charles Darwin proposed it in *On the Origin of Species* (1859), and it remains the central organizing principle of biology. Nothing else in biology, as the geneticist Theodosius Dobzhansky famously said, makes sense except in the light of evolution.

**Darwin's insight — the argument in four steps.**

Darwin's argument for natural selection has a simple logical structure:

1. **Variation exists**. Individuals within any species vary. Look at any group of humans, dogs, oak trees — no two are identical.

2. **Some variation is heritable**. Offspring resemble their parents. Traits pass from generation to generation.

3. **Populations produce more offspring than can survive**. Populations have the capacity to grow exponentially, but resources (food, space, mates) are limited. Only some individuals survive and reproduce.

4. **Individuals with advantageous variations are more likely to survive and reproduce**. Their advantageous heritable traits become more common in the next generation.

Repeat over many generations, and populations change dramatically. Natural selection is inevitable given these four facts.

**Historical context.**

Before Darwin, most Europeans (following biblical accounts) believed species had been created once, unchanged since. Some earlier thinkers had proposed evolutionary ideas:

- **Jean-Baptiste Lamarck** (early 1800s): proposed evolution via inheritance of acquired characteristics. Wrong mechanism (Weismann and later Mendelian genetics disproved it) but recognized that species change.
- **Charles Lyell** (geologist): showed Earth was much older than the biblical account, giving time for evolution.
- **Thomas Malthus**: wrote about population pressure exceeding food supply — key influence on Darwin.

**Darwin's voyage on the HMS Beagle (1831-1836)** exposed him to enormous biological diversity. Galápagos finches, marsupials in Australia, fossils in Argentina — all suggested species could change and diversify.

**Alfred Russel Wallace** independently reached the same theory of natural selection. Darwin and Wallace's joint papers were presented in 1858; Darwin published *On the Origin of Species* in 1859.

**Evidence for natural selection.**

Modern evidence for evolution by natural selection is overwhelming:

- **Direct observation** of evolution in populations (bacterial antibiotic resistance, insect pesticide resistance, industrial melanism in moths).
- **Comparative anatomy**: homologous structures (mammalian forelimbs), vestigial organs (whale hip bones, human appendix).
- **Fossil record**: transitional forms, evolutionary sequences.
- **Biogeography**: distribution of species matches evolutionary history.
- **Molecular biology**: DNA and protein sequences confirm relationships.
- **Developmental biology**: shared embryological features.

**Adaptations.**

**Adaptations** are heritable traits that improve survival and reproduction in a specific environment.

Examples:
- **Peppered moth** wing color adapted to bark color for camouflage from predators.
- **Beak shapes** in Darwin's finches adapted to food types.
- **Cactus spines** adapted for reducing water loss and deterring herbivores.
- **Antibiotic resistance** in bacteria — a rapid adaptation to human intervention.
- **Complex eyes** — adapted for vision, evolved independently many times.

Adaptations are always adaptations to specific environments. A trait that's beneficial in one environment may be neutral or harmful in another.

**Fitness.**

In evolutionary biology, **fitness** doesn't mean physical strength. It means **reproductive success** — the number of viable offspring an individual produces.

**Relative fitness**: an individual's fitness compared to others in the population. High-fitness individuals contribute more to the next generation.

**A high-fitness individual isn't necessarily long-lived or physically impressive. It's one that leaves many surviving offspring.** A short-lived organism with many offspring may have higher fitness than a long-lived one with few.

**Modes of natural selection** (covered more in 7.2):
- **Directional**: favors one extreme.
- **Stabilizing**: favors intermediate values.
- **Disruptive**: favors both extremes.

**Sexual selection.**

**Sexual selection** is selection based on mate choice or competition for mates. Two types:

- **Intersexual selection**: mate choice (usually females choosing males based on traits like peacock tails, bird songs, elaborate displays).
- **Intrasexual selection**: competition among same-sex individuals for access to mates (elk antler jousting, male-male combat).

Sexual selection can produce traits that reduce survival but increase reproductive success (peacock tails make males more visible to predators but attract females).

**Common misconceptions.**

- **"Evolution has a direction or goal"** — wrong. Natural selection is not "trying" to produce anything; it selects for what works in the current environment.
- **"Individuals evolve"** — wrong. Populations evolve; individuals do not.
- **"Fittest means strongest"** — wrong. Fitness is reproductive success.
- **"Evolution is just a theory"** — theories in science are strongly supported explanations; not guesses. Evolution is as well-supported as any theory in biology.

**Natural selection is the foundation of the rest of Unit 7.** Population-level dynamics, evidence for evolution, phylogeny, speciation — all rest on natural selection as the primary mechanism.`,
      video: {
        url: 'https://www.youtube.com/watch?v=aTftyFboC_M',
        title: 'CrashCourse Biology — Natural selection',
        provider: 'CrashCourse',
      },
    },
    {
      code: '7.2',
      title: 'Natural selection in populations',
      content:
`Natural selection acts at the level of populations, changing allele frequencies over generations. Different patterns of selection produce different outcomes — populations may shift in one direction, cluster around a mean, or split into distinct types. Understanding these modes of selection is essential for predicting how populations respond to environmental change.

**Three main modes of natural selection.**

**Directional selection**: favors one extreme of the phenotypic distribution.

- Result: mean value of trait shifts in one direction over generations.
- Common in changing environments.

**Examples**:
- **Peppered moths** during Industrial Revolution: dark-colored variants became common as air pollution darkened tree bark. Dark moths were better camouflaged from predators.
- **Antibiotic resistance**: bacterial populations shift toward greater resistance when antibiotics are used.
- **Selective pressure from predators**: some populations of guppies evolved larger size when introduced to predator-free environments.

**Stabilizing selection**: favors intermediate values; eliminates extremes.

- Result: mean stays roughly constant; variance decreases.
- Common in stable environments where average trait works best.

**Examples**:
- **Human birth weight**: very small or very large babies have higher mortality. Selection favors intermediate weights.
- **Number of eggs laid by birds**: clutch sizes often stabilized around an intermediate number. Too few eggs = fewer offspring; too many = poorly fed and often die.
- **Cactus spine density**: too few = eaten by herbivores; too many = wasted resources.

**Disruptive (diversifying) selection**: favors both extremes, disadvantages intermediates.

- Result: population may split into two distinct forms; sometimes leads to speciation.
- Rare but important.

**Examples**:
- **Bill shapes in some finch populations**: birds with small bills eat small seeds; birds with large bills eat large seeds. Intermediate bill sizes are inefficient at both.
- **African cichlid fish**: some populations have evolved distinct color morphs matching different microhabitats.

**Sexual selection**: as discussed in 7.1, selection based on mate choice or competition for mates.

**Coevolution**: two species evolve in response to each other.

**Examples**:
- **Predator-prey coevolution**: prey evolve defenses; predators evolve counter-adaptations. Cheetahs faster; gazelles faster.
- **Host-parasite coevolution**: hosts evolve immunity; parasites evolve to evade it.
- **Mutualisms**: flowers and pollinators evolve together; each specialized for the other.

**Adaptations vs mistakes.**

Natural selection doesn't produce perfect adaptations. Constraints include:
- **Historical constraints**: evolution builds on existing structures. Vertebrate eyes have inverted retinas (retinal blood vessels in front of light receptors) because that's the ancestral configuration; cephalopod eyes are more sensibly arranged (though they evolved independently).
- **Trade-offs**: adaptations for one thing often costs performance in another.
- **Genetic variation**: selection can only work on existing variation.
- **Environmental changes**: adaptations to past environments may be maladaptive today.

Human back problems, wisdom teeth, appendix, and many other features reflect our evolutionary history rather than current optimality.

**Changes in populations over time.**

Selection changes allele frequencies. In small populations, drift also matters (see 7.4).

Over long timescales, populations can diverge dramatically. Given millions of years, small changes accumulate to produce major morphological and genetic differences — the diversity of life.

**Rate of evolution**.

Evolution can be fast or slow depending on:
- **Generation time**: fast reproducers (bacteria, insects) evolve faster than slow reproducers (whales, redwoods).
- **Selection pressure**: strong selection produces fast change.
- **Genetic variation**: more variation allows faster response.
- **Population size**: large populations have more variation to work with.

**Antibiotic resistance** in bacteria illustrates fast evolution — within decades of introducing an antibiotic, resistant strains emerge. Bacteria have short generations and strong selection pressure.

**Selection acts on phenotypes; alleles are what change**.

Individuals with beneficial phenotypes reproduce more. Their offspring inherit their alleles. Over generations, beneficial alleles increase in frequency. So while selection targets phenotypes, allele frequencies change over time.

This distinction matters: only heritable traits can respond to selection. Learned behaviors, environmental effects on body size, and other non-heritable phenotypic variation don't influence long-term evolution.

**Human impacts on natural selection.**

Humans dramatically affect selection pressures on other species:
- **Agricultural pests**: pesticide resistance evolves rapidly.
- **Bacteria and viruses**: antibiotic and drug resistance is major medical problem.
- **Wild species**: habitat destruction, climate change, hunting all shift selection pressures.
- **Domesticated species**: humans have deliberately selected for traits in dogs, cattle, crops for millennia (see 7.3).

Understanding selection is essential for public health (antibiotic stewardship), agriculture (pest management), and conservation (protecting biodiversity).`,
      video: {
        url: 'https://www.youtube.com/watch?v=aTftyFboC_M',
        title: 'CrashCourse Biology — Selection in populations',
        provider: 'CrashCourse',
      },
    },
    {
      code: '7.3',
      title: 'Artificial selection',
      content:
`**Artificial selection** is deliberate selection by humans of individuals with desired traits for breeding. Darwin was deeply influenced by artificial selection — he studied pigeon breeders and used their achievements as evidence that selection could produce dramatic change. Artificial selection has produced the domesticated plants and animals that support human civilization.

**Domestication**.

**Domestication** is the long-term process of adapting wild species for human use. It typically involves:
- Selecting for docility (easier handling).
- Selecting for productive traits (higher yield, faster growth, larger size).
- Selecting for traits desired by humans (specific colors, temperaments).
- Reducing traits harmful in captivity but useful in the wild (aggression, camouflage, defensive behaviors).

**Domesticated animals** include:
- **Dogs** (from wolves): domesticated 15,000-40,000 years ago. Now hundreds of breeds ranging from Chihuahuas to Great Danes — all one species, all descended from wolves.
- **Cattle** (from wild aurochs, now extinct): about 10,000 years ago. Bred for milk, meat, labor.
- **Chickens** (from red jungle fowl): 8,000 years ago. Bred for eggs, meat, size.
- **Pigs, goats, sheep, horses**: all domesticated within the past 12,000 years.
- **Cats** (from Middle Eastern wildcat): unique in that they largely self-domesticated (cats useful for pest control).

**Domesticated plants** include:
- **Wheat, rice, maize** — the three grains that support most of humanity.
- **Corn (maize)** transformed from a wild grass called teosinte with tiny cobs to modern corn with massive ears.
- **Vegetables**: cabbage, broccoli, cauliflower, brussels sprouts, and kale are all one species (*Brassica oleracea*) selected for different plant parts.
- **Fruits**: apples, oranges, bananas, pineapples — many descended from wild ancestors with tiny, less palatable fruits.

**Corn evolution**: teosinte cobs were about 1 inch long with few kernels; modern corn cobs are 6-8 inches with hundreds of kernels. This transformation happened through thousands of years of selection.

**Dog breeds** are a striking illustration. All modern dog breeds descend from wolves. Selective breeding has produced:
- Extreme size range (Chihuahua vs Great Dane).
- Extreme morphological variation (bulldog face vs greyhound face).
- Specialized behaviors (herding, hunting, retrieving, guarding).
- Some serious health problems from inbreeding.

Modern dog breeds mostly developed in the past 200 years — remarkable diversification in a short time.

**Evolutionary implications**.

Artificial selection demonstrates several important principles:

1. **Selection can produce dramatic change** quickly (within human timescales). If humans can produce such variety through deliberate selection, natural selection over millions of years can produce even more.

2. **Selectable variation exists in populations**. Different individuals have different genes; some can be selected for.

3. **Selection acts on complex traits**. Not just single-gene traits but combinations of traits.

4. **Selection has limits and costs**. Extreme selection often produces genetic problems (health issues in extreme dog breeds, reduced fertility in some crops).

Darwin devoted the entire first chapter of *Origin of Species* to artificial selection, using it as his opening argument for evolution.

**Modern applications**.

Modern breeding uses:
- **Marker-assisted selection**: DNA markers to identify individuals with desired alleles.
- **Genomic selection**: whole-genome analysis to predict breeding value.
- **Genetic engineering**: directly modifying genes (see Unit 6.7).

The Green Revolution (mid-20th century) dramatically increased agricultural yields through selective breeding of high-yield crop varieties. Norman Borlaug's wheat breeding is credited with saving over a billion people from starvation.

**Downsides of artificial selection**:
- **Loss of genetic diversity**: focus on narrow trait sets reduces genetic variation.
- **Vulnerability to disease**: uniform crops can be devastated by single diseases.
- **Health problems in extreme breeds**: bulldogs can barely breathe or reproduce naturally.
- **Loss of hardy wild traits**: domesticated animals often can't survive in the wild.

**Practical relevance**. Understanding artificial selection is important for:
- Agriculture and food security.
- Conservation (managing captive breeding).
- Medicine (understanding selection in bacteria and viruses).
- Understanding evolution itself.`,
      video: {
        url: 'https://www.youtube.com/watch?v=aTftyFboC_M',
        title: 'CrashCourse Biology — Artificial selection',
        provider: 'CrashCourse',
      },
    },
    {
      code: '7.4',
      title: 'Population genetics',
      content:
`**Population genetics** studies allele frequencies and how they change over time. It provides the mathematical framework for evolution, letting biologists predict how populations will respond to selection, migration, drift, and other evolutionary forces.

**Key concepts.**

**Population**: a group of individuals of the same species that live in the same area and can interbreed.

**Gene pool**: the total collection of alleles in a population.

**Allele frequency**: proportion of chromosomes in a population carrying a particular allele.

**Genotype frequency**: proportion of individuals with a particular genotype.

**Microevolution**: changes in allele frequencies within a population over generations.

**Macroevolution**: larger-scale evolution including speciation and diversification of major groups.

**Mechanisms of evolution.**

Five main forces change allele frequencies:

**1. Natural selection**: differential survival and reproduction based on heritable traits.

**2. Genetic drift**: random changes in allele frequencies.
- More important in small populations.
- Can cause loss of beneficial alleles or fixation of harmful ones.
- **Bottleneck effect**: population passes through a small size (disease, disaster), losing genetic diversity.
- **Founder effect**: small group colonizes a new area, carrying only a subset of the source population's genetic diversity.

**3. Mutation**: new alleles arise through mutation. Slow but the ultimate source of variation.

**4. Gene flow (migration)**: alleles enter or leave a population through movement of individuals.
- Increases genetic similarity between populations.
- Can introduce new alleles or reduce local adaptations.

**5. Non-random mating**: mate choice affects genotype frequencies without necessarily changing allele frequencies.
- **Assortative mating**: individuals mate with similar phenotypes.
- **Inbreeding**: mating with close relatives; increases homozygosity.
- **Sexual selection**: preferences shape which alleles pass on.

**Genetic drift examples.**

**Founder effect examples**:
- **Amish populations** in Pennsylvania: higher frequency of certain genetic disorders (Ellis-van Creveld syndrome) because founders happened to carry these alleles.
- **Afrikaner populations** in South Africa: higher frequency of Huntington's disease and porphyria.
- **Finnish populations**: distinct genetic profile due to small founding population.

**Bottleneck effect examples**:
- **Cheetahs**: extraordinarily low genetic diversity; passed through a bottleneck ~10,000 years ago.
- **Northern elephant seals**: reduced to about 20 individuals in the 1890s (hunting); genetic diversity remains low.
- **European bison**: reduced to a few dozen individuals in early 1900s; recovered but with low diversity.

**Gene flow examples.**

- Humans: current global gene flow is dramatically higher than historically. Genetic differences between populations decrease.
- **Beak size in Galapagos finches**: gene flow between neighboring islands moderates local adaptation.
- **Antibiotic resistance genes**: spread rapidly among bacterial populations through horizontal gene transfer (a form of gene flow).

**Population size matters.**

- **Large populations**: drift has minor effect; selection dominates.
- **Small populations**: drift can overwhelm selection.

Effective population size ($N_e$) is often smaller than census population size because not all individuals reproduce equally.

**Bridge to Hardy-Weinberg (see 7.5)**.

Population genetics uses Hardy-Weinberg equilibrium as a null hypothesis. If a population's genotype frequencies match Hardy-Weinberg predictions, evolution is NOT changing allele frequencies for that gene. If they don't match, some evolutionary force is at work.

**Modern population genetics** uses whole-genome data to:
- Track ancient human migrations.
- Identify genes under selection.
- Study conservation of endangered species.
- Understand disease resistance.

Population genetics provides the mathematical rigor that unifies genetics and evolution. It converts qualitative predictions ("populations evolve") into quantitative ones ("this allele will increase 2% per generation given this selection pressure").`,
      video: {
        url: 'https://www.youtube.com/watch?v=aTftyFboC_M',
        title: 'CrashCourse Biology — Population genetics',
        provider: 'CrashCourse',
      },
    },
    {
      code: '7.5',
      title: 'Hardy-Weinberg equilibrium',
      content:
`**Hardy-Weinberg equilibrium** describes the mathematical relationship between allele and genotype frequencies in a population that is NOT evolving. It's the null hypothesis of population genetics — a theoretical baseline against which real populations can be compared to detect evolution.

**Independently derived** by **G.H. Hardy** (mathematician, England) and **Wilhelm Weinberg** (physician, Germany) in 1908.

**The math.**

For a gene with two alleles:
- $p$ = frequency of dominant allele ($A$).
- $q$ = frequency of recessive allele ($a$).
- $p + q = 1$ (these are the only two alleles).

At Hardy-Weinberg equilibrium, genotype frequencies are:
- $AA$ frequency = $p^2$.
- $Aa$ frequency = $2pq$.
- $aa$ frequency = $q^2$.
- Total: $p^2 + 2pq + q^2 = 1$.

**Why $2pq$ for heterozygotes?** Because there are two ways to be heterozygous: get $A$ from mom and $a$ from dad (probability $p \\cdot q$), or $a$ from mom and $A$ from dad (probability $q \\cdot p$). Sum: $2pq$.

**Conditions for Hardy-Weinberg equilibrium** (all must be met):

1. **No mutation** (no new alleles arising).
2. **No gene flow** (no migration in/out).
3. **No natural selection** (all genotypes have equal fitness).
4. **Very large population size** (no genetic drift).
5. **Random mating** (mate choice unrelated to genotype).

Real populations rarely meet all these conditions. **Deviations from Hardy-Weinberg indicate that at least one evolutionary force is at work.**

**Using Hardy-Weinberg.**

**Example 1**. In a population, $16\\%$ of individuals have a homozygous recessive genetic disorder ($aa$). What are the allele frequencies and carrier ($Aa$) frequency?

$q^2 = 0.16$, so $q = 0.4$.
$p = 1 - q = 0.6$.
$AA = p^2 = 0.36$ (36%).
$Aa = 2pq = 2(0.6)(0.4) = 0.48$ (48%).

Check: $0.36 + 0.48 + 0.16 = 1.00$ ✓.

Note that even for a rare recessive disorder, the carrier frequency can be substantial. This is one of the most important insights from Hardy-Weinberg.

**Example 2 — cystic fibrosis in European populations**.

Cystic fibrosis (CF) affects about 1 in 2,500 European descendants ($q^2 = 1/2500 = 0.0004$).

$q = \\sqrt{0.0004} = 0.02$.
$p = 0.98$.
Carrier frequency: $2pq = 2(0.98)(0.02) \\approx 0.04$ or $4\\%$.

So about 1 in 25 European descendants is a carrier of CF. This is much more common than the disease itself (1 in 2,500).

**Detecting evolution.**

If you observe genotype frequencies in a population and they differ from Hardy-Weinberg predictions, evolution is occurring. Different types of deviations suggest different evolutionary forces:

- **Excess of homozygotes**: could suggest inbreeding or selection against heterozygotes.
- **Deficit of homozygotes / excess of heterozygotes**: could suggest heterozygote advantage (like sickle cell in malarial regions).
- **Continuous change over generations**: suggests directional selection or genetic drift.

**Extension to multiple alleles.**

For three alleles ($p, q, r$):
- $p + q + r = 1$.
- Genotype frequencies: $p^2 + q^2 + r^2 + 2pq + 2pr + 2qr = 1$.

**Extension to X-linked genes**. Different equations for males (one X) and females (two Xs).

**Practical applications**.

- **Genetic counseling**: predict carrier frequencies for genetic disorders.
- **Conservation biology**: monitor genetic diversity in endangered species.
- **Population genetics research**: detect evolutionary forces.
- **Forensics**: calculate DNA match probabilities.

**Assumptions and limits**.

Hardy-Weinberg assumes an infinitely large, isolated population. Real populations are finite and connected. But even so:

- **Deviations are informative**: they reveal which forces are acting.
- **Approximation is often good**: for common alleles in large populations, Hardy-Weinberg is a reasonable approximation.
- **Foundation for more complex models**: Hardy-Weinberg provides the base; more sophisticated models add selection, drift, migration.

**Historical significance.**

Hardy-Weinberg (1908) was one of the earliest and most influential mathematical models in biology. It:
- Reconciled Mendelian genetics with Darwin's theory (there had been debate about whether Mendel's discrete alleles were compatible with Darwin's continuous variation).
- Established mathematical population genetics as a discipline.
- Enabled quantitative predictions about evolution.

Mendel + Hardy-Weinberg + Darwin = the modern evolutionary synthesis.`,
      video: {
        url: 'https://www.youtube.com/watch?v=aTftyFboC_M',
        title: 'CrashCourse Biology — Hardy-Weinberg',
        provider: 'CrashCourse',
      },
    },
    {
      code: '7.6',
      title: 'Evidence of evolution',
      content:
`Evolution is supported by overwhelming evidence from multiple independent lines of investigation. The evidence includes direct observation, fossil records, comparative anatomy, biogeography, molecular biology, and development. Each line of evidence independently supports evolution; together they make it one of the best-supported theories in all of science.

**Direct observation of evolution.**

Evolution can be directly observed in fast-generation organisms:

- **Bacterial antibiotic resistance**: emerges within years of introducing a new antibiotic. MRSA (methicillin-resistant *Staphylococcus aureus*) evolved after methicillin's introduction in 1960.
- **Insect pesticide resistance**: hundreds of insect species have evolved resistance to pesticides.
- **HIV drug resistance**: HIV rapidly evolves resistance to antiretroviral drugs; combination therapies designed to prevent this.
- **Guppies in Trinidad**: introduced into new streams with different predator pressures evolved distinct color patterns and body sizes within decades.
- **Beak sizes in Darwin's finches** on the Galápagos: fluctuate measurably in response to yearly variations in food supply. Peter and Rosemary Grant's decades of study documented this in real time.

**The fossil record.**

Fossils preserve remains of past organisms. Together they show:

- **Transitional forms**: intermediate stages between major groups. Examples: *Archaeopteryx* (bird-reptile intermediate); *Tiktaalik* (fish-tetrapod intermediate); many hominid fossils showing human evolution.
- **Sequential appearance**: simple organisms appear first in the fossil record; complex forms later. Bacteria for 3.5 billion years; complex animals only in the last ~600 million.
- **Extinct forms**: dinosaurs, trilobites, ammonites, and countless others — species that no longer exist but once did.
- **Radiometric dating**: allows precise dating of fossils and rocks.

The fossil record is incomplete (most organisms don't fossilize), but the sequences and transitions we do see match evolutionary predictions.

**Comparative anatomy.**

Comparing structures across species reveals evolutionary relationships:

**Homologous structures**: similar structures inherited from a common ancestor, even if they now serve different functions.
- **Mammalian forelimbs**: humans' arms, whales' flippers, bats' wings, and cats' legs all have the same bones (humerus, radius, ulna, carpals, metacarpals, phalanges) despite serving very different functions.

**Analogous structures**: similar functions but different evolutionary origins (**convergent evolution**).
- **Wings of birds, bats, and insects**: all evolved independently for flight, but their underlying structures are different.

**Vestigial structures**: remnants of structures that had functions in ancestors.
- **Whale hip bones**: no longer connected to functional hind limbs.
- **Human appendix**: reduced compared to herbivorous ancestors.
- **Human wisdom teeth, tail bone (coccyx), erector pili muscles** (that cause goose bumps).

**Biogeography.**

Distribution of species matches evolutionary history:

- **Marsupials in Australia**: isolated by continental drift; diversified into forms that resemble mammals elsewhere but are only distantly related.
- **Similar climates on different continents produce different (though sometimes convergent) species**.
- **Island species**: often unique, indicating isolated evolution. Galapagos finches, Hawaiian silverswords.
- **Continental drift** shapes species distributions: fossils of same species on now-separated continents (South America and Africa share ancient reptile fossils, reflecting their earlier connection).

**Molecular biology and DNA evidence.**

Modern molecular biology provides perhaps the most powerful evidence:

- **DNA and protein similarity** correlates with evolutionary relationship. Humans and chimpanzees share ~98.7% of DNA; we share less with more distant relatives.
- **Universal genetic code**: same DNA-to-protein code in all life (with minor exceptions). Points to common ancestor.
- **Ribosomal RNA sequences**: used to construct universal phylogenies.
- **Molecular clocks**: mutations accumulate at reasonably constant rates; can estimate when species diverged.
- **Endogenous retroviruses**: viral DNA integrated into genomes; shared between related species in expected patterns.
- **Pseudogenes**: nonfunctional versions of genes; still present and inherited but no longer used.

**Developmental biology.**

Comparative embryology reveals evolutionary relationships:

- **Vertebrate embryos** look strikingly similar in early development (Karl Ernst von Baer's laws).
- **Human embryos** have brief structures resembling gills and tails.
- **Whale embryos** briefly have hind-limb buds that then disappear.
- **Homeobox (Hox) genes**: same set of genes controls body patterning across all animals — from flies to humans.

**Evidence integration**.

The most powerful thing about evolutionary evidence: **all these different lines of evidence converge on the same conclusions**. Fossils and molecular clocks give consistent divergence times. Anatomy and DNA give consistent phylogenies. Biogeography and paleontology give consistent stories.

This convergence is what would be expected if evolution is a real historical process producing the diversity of life we see. It would be nearly impossible if the pattern were the result of independent creation or design.

**Modern denials**.

Despite overwhelming evidence, evolution is denied by some (mostly for religious reasons). Common denials and responses:

- **"It's just a theory"**: theories in science are strongly-supported explanations. Evolution is as well-supported as gravity or germ theory.
- **"Where are the transitional forms?"**: many transitional forms have been found (Tiktaalik, Archaeopteryx, hominid fossils, etc.).
- **"The eye is too complex to evolve"**: eye evolution is well-documented in intermediate forms across species. Multiple eye types have evolved independently.
- **"There are gaps in the fossil record"**: gaps exist but are being filled. The overall pattern strongly supports evolution.

**Evolution is the unifying theory of biology.** Everything from molecular biology to ecology makes sense through the lens of common ancestry and natural selection. The evidence isn't just consistent with evolution — it's inexplicable without it.`,
      video: {
        url: 'https://www.youtube.com/watch?v=aTftyFboC_M',
        title: 'CrashCourse Biology — Evidence of evolution',
        provider: 'CrashCourse',
      },
    },
    {
      code: '7.7',
      title: 'Common ancestry',
      content:
`All life on Earth shares a common ancestor. This is one of the most profound claims of biology and is supported by evidence from every level — molecular to morphological. Understanding common ancestry helps make sense of the unity underlying life's diversity.

**Universal features of life.**

All known cellular life shares:

- **DNA as genetic material**: same double-helix structure, same four bases (A, T, G, C).
- **Genetic code**: same three-nucleotide codons specifying same amino acids (with minor variations).
- **Amino acids**: same 20 amino acids used in proteins.
- **Cellular organization**: cells with membranes, ribosomes for protein synthesis.
- **Metabolic pathways**: glycolysis is universal; citric acid cycle nearly so.
- **Ribosomes**: all cells have them; universally used for protein synthesis.
- **ATP as energy currency**: universal.

These universal features are strong evidence of common ancestry. They wouldn't be expected if life had multiple independent origins.

**Last Universal Common Ancestor (LUCA).**

LUCA is the hypothetical last common ancestor of all extant cellular life. LUCA:
- Lived ~3.5-4 billion years ago.
- Was probably a single-celled organism.
- Had DNA (or possibly RNA), ribosomes, the genetic code.
- Its exact nature is uncertain but its existence is strongly supported.

All modern organisms (bacteria, archaea, eukaryotes) descend from LUCA.

**Three domains of life.**

Modern classification recognizes three domains:

**Bacteria**: prokaryotes (no nucleus). Most familiar single-celled organisms.

**Archaea**: also prokaryotes but genetically distinct from bacteria. Include extremophiles that thrive in extreme conditions (hot springs, salt lakes, deep sea vents). More closely related to eukaryotes than bacteria are.

**Eukarya**: cells with nuclei. Includes animals, plants, fungi, protists.

The three-domain classification (Carl Woese, 1977) was based on ribosomal RNA sequences and represented a major revision of biological classification.

**Homology.**

**Homologous structures** are similar structures inherited from a common ancestor.

- **Mammalian forelimbs**: all mammals have the same bones (humerus, radius, ulna, etc.) in their arms/legs/flippers/wings, even though they serve very different functions.
- **Vertebrate embryos**: all vertebrate embryos look strikingly similar in early development.
- **Genetic homology**: same genes performing same functions across species. Hox genes control body patterning in insects, mammals, and even simple organisms like *Hydra*.

Homology is evidence of common ancestry. Analogous structures (evolved independently for similar function) don't have the same underlying details.

**Convergent evolution.**

**Convergent evolution** occurs when unrelated species independently evolve similar features in response to similar environmental pressures.

Examples:
- **Wings**: independently evolved in insects, birds, bats, pterosaurs.
- **Streamlined body shapes**: independently evolved in fish, dolphins, ichthyosaurs (extinct marine reptiles), penguins.
- **Camera-eye**: independently evolved in vertebrates and cephalopods (octopuses, squid).
- **Photosynthesis**: evolved in cyanobacteria, then acquired by plants via endosymbiosis (chloroplasts).

Convergent evolution shows that similar problems have similar solutions. But the underlying details differ — cephalopod eyes have retinas oriented differently from vertebrate eyes, revealing their independent origins.

**Phylogenetic trees.**

**Phylogenetic trees** depict evolutionary relationships. Branch points (**nodes**) represent common ancestors; tips represent modern species.

Trees can be constructed from:
- Morphological features (traditional method).
- DNA sequences (modern, more accurate).
- Combinations.

**Cladistics**: a rigorous approach to phylogenetic classification. Groups species by shared derived characteristics ("synapomorphies"). Only monophyletic groups (containing all descendants of a common ancestor) are considered valid.

**Reading trees**:
- Species close together at tips share recent common ancestor.
- Nodes represent common ancestors that gave rise to two or more lineages.
- Branch lengths sometimes represent time.

**Evolutionary time**.

Life is very old:
- **Earth**: ~4.5 billion years old.
- **First life** (microbial): 3.5-3.8 billion years ago.
- **Photosynthesis**: 2.5+ billion years ago; oxygenated atmosphere ~2.4 billion years ago.
- **Multicellular organisms**: ~1 billion years ago.
- **Complex animals** (Cambrian explosion): ~540 million years ago.
- **Dinosaurs**: 230-66 million years ago.
- **Mammals radiated after dinosaur extinction**: 66 million years ago onward.
- **Primates**: emerged ~85 million years ago.
- **Hominins** (human ancestors after chimp split): ~6-7 million years ago.
- **Homo sapiens**: ~300,000 years ago.

The deep time available for evolution — billions of years — provides ample time for accumulated change.

**Descent with modification**.

Darwin used the phrase "**descent with modification**" to describe evolution. All species descended from common ancestors, modified by natural selection and other forces to fit their environments.

Common ancestry explains why:
- All life uses the same basic chemistry.
- Related species share similar features.
- Evolution can only work with existing structures (why we don't have wings or gills).
- Some features seem "designed" but are actually inherited from ancestors (like our tailbone from ancestors with tails).

**Human evolution and common ancestry**.

Humans are apes. We share:
- ~98.7% DNA with chimpanzees (our closest living relatives).
- Common ancestor with chimps ~6-7 million years ago.
- Common ancestor with all mammals ~200-225 million years ago.
- Common ancestor with fish ~450 million years ago.
- Common ancestor with plants ~1.5 billion years ago.
- Common ancestor with bacteria: LUCA, 3.5-4 billion years ago.

Human family tree branches:
- **Homo sapiens** (modern humans): ~300,000 years ago.
- **Homo neanderthalensis** (Neanderthals): coexisted with humans until ~40,000 years ago. Modern non-African humans have some Neanderthal DNA (1-4%).
- **Homo erectus, Homo habilis, Australopithecus**, and other hominid species: extinct relatives on human family tree.

**The unity of life.**

Understanding common ancestry reveals biology's fundamental unity. From bacteria to elephants, all life uses:
- Same genetic code.
- Same molecular machinery.
- Same basic metabolism.
- Same evolutionary principles.

**Diversity emerges from unity through modification of shared foundations.** This is the ultimate insight of biological evolution.`,
      video: {
        url: 'https://www.youtube.com/watch?v=aTftyFboC_M',
        title: 'CrashCourse Biology — Common ancestry',
        provider: 'CrashCourse',
      },
    },
    {
      code: '7.8',
      title: 'Continuing evolution',
      content:
`Evolution isn't a completed process — it's happening now. Every species is currently evolving, whether the changes are dramatic or subtle. Understanding continuing evolution is essential for medicine (antibiotic resistance), agriculture (pest management), conservation (endangered species), and human self-understanding.

**Contemporary evolution.**

Evolution has been directly observed in many organisms in real time:

**Bacteria and viruses**:
- **Antibiotic resistance**: emerges rapidly in bacterial populations exposed to antibiotics.
- **HIV drug resistance**: HIV evolves resistance to antiretroviral drugs within months if only one drug is used. Combination therapy limits this by requiring multiple simultaneous mutations.
- **Influenza**: constantly evolving; new vaccines needed each year due to antigenic drift.
- **SARS-CoV-2**: rapid evolution during the COVID-19 pandemic; multiple variants emerged.
- **Bacterial evolution in labs**: Richard Lenski's long-term evolution experiment with *E. coli* has documented evolution over 70,000+ generations (~30 years running); showed emergence of new metabolic capabilities.

**Insects**:
- **Pesticide resistance**: hundreds of insect species have evolved resistance to various pesticides.
- **DDT resistance** in mosquitoes: emerged within a decade of DDT introduction.

**Guppies in Trinidad**: David Reznick's classic studies showed guppy populations evolve within decades:
- Guppies moved to predator-free streams evolved larger size and more colorful patterns.
- Guppies moved to high-predation streams evolved smaller size, later maturity, and more offspring.

**Peppered moths in England**: dark-morph frequency increased during Industrial Revolution as air pollution darkened tree bark; decreased after clean air legislation.

**Beak sizes in Darwin's finches**: Peter and Rosemary Grant documented beak size changes in Galápagos finches responding to yearly variations in food supply.

**Human evolution**.

Humans are still evolving. Recent adaptations:

- **Lactase persistence**: mutations allowing adults to digest milk evolved independently multiple times (~10,000 years ago in Europe, and separately in African cattle-herding populations). Present in about 35% of adults worldwide.
- **Malaria resistance**: sickle cell, thalassemia, Duffy-negative blood, others.
- **High-altitude adaptations**: Tibetans have distinct genes for oxygen use. Andean populations have different adaptations.
- **Skin color**: variation reflects historical UV exposure levels. Different pigmentation genes selected in different populations.

Modern medicine reduces mortality but doesn't stop evolution. Contemporary selection may favor:
- Delayed reproduction and fewer offspring.
- Certain immune genes.
- Metabolic genes suited to modern diets.

**Antibiotic resistance — a crisis of continuing evolution.**

Antibiotic resistance is one of the most pressing evolutionary issues in modern medicine:

- **Overuse of antibiotics** (in medicine and agriculture) creates strong selection pressure.
- **Horizontal gene transfer**: bacteria can share resistance genes across species.
- **Multi-drug resistance**: some bacteria (MRSA, drug-resistant tuberculosis) resistant to multiple antibiotics.
- **Threat**: potentially could return medicine to a pre-antibiotic era where minor infections were fatal.

**Solutions**:
- Antibiotic stewardship (careful use).
- New antibiotic development.
- Vaccines to prevent bacterial infections.
- Understanding evolution of resistance to design better strategies.

**Emerging infectious diseases**.

Many recent diseases represent evolution in action:
- **HIV**: crossed from chimps to humans ~1920s; pandemic beginning 1980s.
- **SARS**: emerged 2003 from bat coronaviruses via civet cats.
- **MERS**: emerged 2012 from bat coronaviruses via camels.
- **COVID-19**: emerged 2019, likely from bat coronaviruses via intermediate species.
- **Ebola**: multiple outbreaks from bat reservoirs.

These "spillover" events — where pathogens jump from animals to humans — are driven by:
- Human encroachment on wild habitats.
- Wildlife trade.
- Climate change altering species ranges.

**Rate of evolution**.

Evolution can be fast:
- **Peppered moths**: significant color change within decades.
- **Bacteria in Lenski's experiment**: substantial adaptation observed over decades.
- **HIV drug resistance**: within months without proper treatment.

Or slow:
- **Coelacanths**: fish nearly unchanged for 400 million years.
- **Horseshoe crabs**: nearly unchanged for 450 million years.

Rate depends on generation time, population size, mutation rate, and selection pressure.

**Coevolution**.

Species evolve in response to each other:

- **Predator-prey**: cheetahs and gazelles — both fast, evolving faster.
- **Host-parasite**: hosts evolve resistance; parasites evolve to evade it. Red Queen hypothesis: "It takes all the running you can do to keep in the same place" (Lewis Carroll quote from Alice).
- **Mutualisms**: flowers and pollinators evolve together.
- **Symbioses**: legumes and nitrogen-fixing bacteria coevolved.

**Human-caused evolutionary pressures**.

Humans are now among the largest evolutionary forces on Earth:
- **Habitat destruction**: reshapes selection pressures.
- **Climate change**: forces species to adapt, move, or go extinct.
- **Hunting/fishing**: often selective (large individuals, specific traits) — can drive rapid evolution.
- **Domestication**: continues today.
- **Antibiotic and pesticide use**: drives resistance evolution.
- **Introduction of invasive species**: alters ecosystems and selection.

**Evolutionary medicine.**

Modern medicine increasingly incorporates evolutionary thinking:
- **Antibiotic stewardship**.
- **Cancer evolution**: cancers evolve within patients; treatments select for resistant clones.
- **Aging and longevity**: evolutionary theories explain why we age.
- **Public health**: understanding disease evolution informs prevention.

**Ongoing questions**.

- Will human evolution continue in ways we recognize, or will medicine and technology change selection pressures?
- Can we manage antibiotic resistance and other evolution-driven medical challenges?
- How will climate change affect species evolution?
- What is the future of biodiversity?

**Evolution didn't stop when humans appeared**. It continues now, in every organism, every population, every generation. Understanding this is essential for scientific literacy and for managing the many evolutionary challenges we face.`,
      video: {
        url: 'https://www.youtube.com/watch?v=aTftyFboC_M',
        title: 'CrashCourse Biology — Continuing evolution',
        provider: 'CrashCourse',
      },
    },
    {
      code: '7.9',
      title: 'Phylogeny',
      content:
`**Phylogeny** is the study of evolutionary relationships among organisms. Phylogenetic trees depict these relationships graphically. Understanding phylogeny lets us classify organisms based on their evolutionary history, predict properties of newly discovered species, and understand the deep history of life.

**Phylogenetic trees.**

A phylogenetic tree is a diagram showing evolutionary relationships. Key components:

- **Tips (leaves)**: represent current species.
- **Nodes (branch points)**: represent common ancestors that gave rise to two or more lineages.
- **Root**: represents the deepest common ancestor of all included species.
- **Branch lengths**: sometimes represent time; sometimes represent amount of change.

**Reading a phylogenetic tree**:
- Species connected by a recent branch point share a recent common ancestor.
- The pattern of branching (topology) shows relationships.
- Rotation of branches at a node doesn't change relationships.

**Sister taxa**: two lineages that share the same immediate common ancestor. Sister taxa are each other's closest relatives.

**Cladistics.**

**Cladistics** is a rigorous approach to constructing phylogenies. Key principles:

**Clade**: a group consisting of an ancestor and all its descendants.

**Monophyletic group**: a valid clade — includes ancestor and all descendants.

**Paraphyletic group**: includes ancestor and some (but not all) descendants. Considered invalid in cladistics. Example: "reptiles" excludes birds, but birds descended from a common reptile ancestor — so "reptiles" is paraphyletic.

**Polyphyletic group**: includes members with different ancestors. Invalid. Example: "warm-blooded animals" — birds and mammals evolved warm-bloodedness independently.

**Synapomorphy (shared derived character)**: a trait shared by a group of species and their most recent common ancestor, but not by more distant relatives. Used to define clades.

**Symplesiomorphy (shared ancestral character)**: a trait shared with more distant relatives. Not useful for defining clades.

Cladistic classification only uses synapomorphies. This produces classifications reflecting actual evolutionary history.

**Molecular phylogenetics.**

Modern phylogenetics uses DNA and protein sequences rather than physical traits.

Advantages:
- **More data**: DNA has millions of nucleotides; morphology limited.
- **Universal**: all organisms have DNA (with same code).
- **Quantitative**: sequence differences can be counted precisely.
- **Less subjective**: DNA doesn't lie about ancestry the way convergent evolution can mislead morphology.

Common molecular markers:
- **Ribosomal RNA (rRNA)**: universal across life; excellent for deep phylogenies.
- **Cytochrome oxidase**: often used for species-level phylogenies.
- **Whole genomes**: increasingly available for many species.

**Molecular clock**: uses roughly constant rate of mutation to estimate divergence times.

**Assumptions**:
- **Homology**: similar sequences result from common ancestry, not chance.
- **Approximate rate constancy**: molecular clock varies but is broadly useful.
- **Neutral evolution**: many mutations are neutral, accumulating at predictable rates.

**Building trees.**

Various methods construct trees from data:

- **Parsimony**: choose the tree requiring the fewest evolutionary changes to explain the data.
- **Maximum likelihood**: choose the tree with highest probability given a model of evolution.
- **Bayesian methods**: assign probabilities to different tree topologies.
- **Distance methods**: cluster taxa by overall similarity.

Modern software packages (BEAST, MrBayes, RAxML, IQ-TREE) automate this.

**Domains and kingdoms.**

**Modern classification**:

**Three domains**:
- **Bacteria**: prokaryotes.
- **Archaea**: prokaryotes, but distinct from bacteria.
- **Eukarya**: cells with nuclei.

**Six kingdoms** (traditional): Bacteria, Archaea, Protista, Plantae, Fungi, Animalia.

The three-domain classification (Carl Woese, 1977) reflects that Archaea and Eukarya are more closely related to each other than to Bacteria.

**Tree of Life.**

The complete phylogenetic tree of all life. Deep structure:

- **Root**: LUCA (last universal common ancestor).
- **Early branches**: bacteria on one side; archaea and eukaryotes on the other.
- **Eukaryotes**: emerged from archaea, then acquired mitochondria (from bacteria) and later chloroplasts (from cyanobacteria) through endosymbiosis.

**Endosymbiosis theory**: mitochondria and chloroplasts descend from free-living bacteria that became internal symbionts of ancestral eukaryotic cells (see Unit 2.10). Explained by Lynn Margulis.

**Applications of phylogeny.**

- **Understanding biodiversity**: how species are related; what makes them different.
- **Conservation**: prioritize preservation of unique lineages, not just closely-related species.
- **Medicine**: understanding disease agents through their evolutionary relationships. HIV origins, coronavirus origins.
- **Agriculture**: crop breeding informed by wild relatives.
- **Ancient DNA**: reconstructing extinct species (mammoths, Neanderthals).
- **Forensics**: identifying biological samples.

**Human phylogeny**.

Humans (*Homo sapiens*):
- **Domain**: Eukarya.
- **Kingdom**: Animalia.
- **Phylum**: Chordata.
- **Class**: Mammalia.
- **Order**: Primates.
- **Family**: Hominidae (great apes: humans, chimps, gorillas, orangutans).
- **Genus**: *Homo*.
- **Species**: *sapiens*.

Closest living relatives: chimpanzees and bonobos (~6-7 million years since divergence).

Extinct human relatives: Neanderthals, Denisovans, *Homo erectus*, *Homo habilis*, *Australopithecus* species, and others.

**Modern phylogeny is dynamic**. As new data (especially genomic) arrives, our understanding of relationships is refined. Molecular data has led to reclassification of many organisms. But the basic pattern — a tree of life descending from LUCA through billions of years of evolution — is well established.`,
      video: {
        url: 'https://www.youtube.com/watch?v=nnJt41B5rk4',
        title: 'CrashCourse Biology — Phylogeny',
        provider: 'CrashCourse',
      },
    },
    {
      code: '7.10',
      title: 'Speciation',
      content:
`**Speciation** is the process by which new species form from ancestral species. Understanding speciation is crucial for understanding biodiversity — the millions of species on Earth all arose through speciation events.

**What is a species?**

Multiple definitions exist:

**Biological species concept** (most common): a species is a group of organisms that can interbreed and produce fertile offspring, and are reproductively isolated from other groups. **Ernst Mayr** popularized this definition.

Limitations:
- Doesn't apply to asexual organisms.
- Some hybrids are viable and even fertile (dog-wolf, some plant hybrids).
- Difficult to apply to extinct species (fossils don't reveal interbreeding capacity).

**Morphological species concept**: species defined by physical differences. Traditional; useful for fossils and asexual organisms.

**Ecological species concept**: species defined by adaptations to specific niches.

**Phylogenetic species concept**: smallest group with a distinct evolutionary history.

Different concepts suit different situations.

**Reproductive isolation.**

For biological speciation, reproductive isolation is key. Two types of isolating mechanisms:

**Prezygotic barriers** (prevent mating or fertilization):

- **Habitat isolation**: species occupy different environments and rarely meet.
- **Temporal isolation**: species breed at different times (different seasons, day/night).
- **Behavioral isolation**: species have different mating rituals or signals.
- **Mechanical isolation**: incompatible anatomy prevents mating.
- **Gametic isolation**: sperm and eggs from different species can't fertilize.

**Postzygotic barriers** (occur after fertilization):

- **Hybrid inviability**: hybrids die before reaching reproductive age.
- **Hybrid sterility**: hybrids live but can't reproduce (mules from horse × donkey).
- **Hybrid breakdown**: first-generation hybrids fertile, but their offspring have problems.

**Modes of speciation.**

**Allopatric speciation** ("other homeland"): populations separated geographically diverge into distinct species.

Process:
1. Population divided by geographic barrier (mountain range, river, island formation).
2. Isolated populations experience different selection pressures.
3. Genetic drift and different adaptations accumulate.
4. Reproductive isolation develops.
5. Even if geographic barrier disappears, species can't interbreed.

Examples:
- Grand Canyon squirrels (north vs south rim).
- Galápagos finches (isolated on different islands).
- Antelope squirrels (Grand Canyon separates species).

**Allopatric speciation is by far the most common mode.**

**Sympatric speciation** ("same homeland"): new species arise within the same geographic area, without physical separation. Rarer but real.

Mechanisms:
- **Polyploidy** (plants especially): whole-genome duplication creates individuals that can't interbreed with parents. Common in plants; ~50% of angiosperm species arose this way.
- **Sexual selection**: divergent mate preferences can create reproductive isolation.
- **Habitat differentiation**: different host preferences (some fly species have speciated on different plant hosts).
- **Adaptive radiation**: rapid diversification in a diverse environment.

**Peripatric speciation**: small population isolated at the edge of a larger population's range. Combines allopatric isolation with founder effect and genetic drift.

**Parapatric speciation**: populations in adjacent geographic areas but with limited gene flow.

**Rate of speciation.**

Speciation can be fast or slow:

- **Fast**: cichlid fish in African Great Lakes have produced hundreds of species in just tens of thousands of years. Some plant species arose in a single generation through polyploidy.

- **Slow**: coelacanths (fish nearly unchanged in 400 million years). Horseshoe crabs (unchanged 450 million years).

**Adaptive radiation.**

Rapid diversification of a lineage into many species that occupy different ecological niches. Occurs when:
- New environment opens up (islands, after mass extinctions).
- New adaptation opens ecological opportunities.

**Classic examples**:
- **Galápagos finches**: 15+ species from a single ancestor.
- **Hawaiian silverswords**: 30+ species from a single ancestor.
- **East African cichlid fish**: 1,000+ species in the Great Lakes.
- **Cambrian explosion** (~540 million years ago): most modern animal phyla appeared.
- **Mammals after dinosaur extinction**: diversified into current major groups.

**Punctuated equilibrium vs gradualism.**

Two views of evolutionary tempo:

**Gradualism** (Darwin's view): evolution proceeds slowly and steadily. Species accumulate small changes continuously.

**Punctuated equilibrium** (Niles Eldredge and Stephen Jay Gould, 1972): long periods of relatively little change punctuated by brief episodes of rapid change (often associated with speciation events).

Modern view: both patterns exist. Some lineages evolve gradually; others show punctuated patterns. Rates of evolution vary.

**Extinction and speciation.**

Speciation and extinction together determine biodiversity:
- Speciation adds new species.
- Extinction removes species.
- Net biodiversity depends on the balance.

Currently, extinction rates are much higher than speciation rates due to human impacts. We're in what many call the **sixth mass extinction**.

**Case study: Darwin's finches.**

The Galápagos finches Darwin studied illustrate speciation:

- Common ancestor colonized the Galápagos ~2-3 million years ago.
- Different island environments produced different selection pressures.
- 15+ species evolved with beaks adapted to different food sources (seeds, insects, cactus, tool-using).
- Peter and Rosemary Grant's decades of study documented continuing evolution and even hybridization.

Darwin's finches are one of biology's most-studied examples of adaptive radiation and speciation.

**Speciation is the source of biodiversity**. Every species on Earth arose from a speciation event. Understanding how speciation happens is understanding how diversity emerges.`,
      video: {
        url: 'https://www.youtube.com/watch?v=2mvT8reNKQI',
        title: 'CrashCourse Biology — Speciation',
        provider: 'CrashCourse',
      },
    },
    {
      code: '7.11',
      title: 'Extinction',
      content:
`**Extinction** is the permanent loss of a species. Extinction is normal — over 99% of all species that have ever lived are extinct. But rates of extinction vary enormously, and current rates are alarmingly high due to human activity. Understanding extinction is essential for conservation biology and for grasping the deep history of life.

**Background vs mass extinctions.**

**Background extinction rate**: the "normal" rate of extinction over geological time. Estimated at 1-10 species per year among mammal-like organisms; total across all species varies.

**Mass extinctions**: brief episodes (geologically speaking) when extinction rates soar. Five major mass extinctions are recognized in Earth's history:

**1. End-Ordovician (~444 million years ago)**: ~85% of species extinct. Possibly caused by glaciation and sea-level changes.

**2. Late Devonian (~372-359 million years ago)**: ~75% of species extinct. Cause debated; possibly climate change or asteroid impacts.

**3. End-Permian (~252 million years ago)**: The **Great Dying** — the largest extinction ever. ~96% of marine species, ~70% of terrestrial vertebrate species extinct. Likely cause: massive volcanic eruptions in Siberia releasing $CO_2$ and toxic gases, causing severe climate change, ocean acidification, and anoxia.

**4. End-Triassic (~201 million years ago)**: ~80% of species extinct. Likely caused by volcanism.

**5. End-Cretaceous / K-Pg (~66 million years ago)**: ~75% of species extinct, including all non-avian dinosaurs. Caused by asteroid impact (10-15 km asteroid in Yucatan Peninsula, Chicxulub crater) combined with volcanic activity in India (Deccan Traps).

Each mass extinction reshaped biodiversity. After each, surviving lineages diversified into new niches. The K-Pg extinction opened the way for mammal diversification, eventually leading to human evolution.

**Rate of extinction now.**

The **sixth mass extinction** is widely considered to be underway right now:

- Current species extinction rate estimated at 100-1000 times background rate.
- Human activities driving unprecedented biodiversity loss.
- Many scientists argue we've entered the **Anthropocene** — a new geological epoch shaped by human impact.

**Causes of current mass extinction**:

- **Habitat destruction**: deforestation, urbanization, agriculture converts natural habitats.
- **Climate change**: shifting temperature and precipitation patterns exceed species' tolerance.
- **Pollution**: plastic in oceans; toxic chemicals; nutrient runoff causing dead zones.
- **Overexploitation**: overfishing, hunting; wildlife trade.
- **Invasive species**: introduced species outcompete natives or spread diseases.
- **Disease**: novel pathogens spread to naive populations (chytrid fungus wiping out amphibians globally).

**Recent extinctions**:
- **Passenger pigeon**: last individual died 1914; billions once existed.
- **Great auk**: hunted to extinction 1844.
- **Dodo**: extinct 1690s; iconic symbol of human-caused extinction.
- **Steller's sea cow**: hunted to extinction within decades of European discovery.
- **Tasmanian tiger (thylacine)**: last individual died 1936.
- **Yangtze river dolphin (baiji)**: probably extinct as of 2007.
- **Many recent extinctions of amphibians, birds, mammals globally**.

**Endangered species**:
- Mountain gorillas.
- Sumatran rhinos.
- Amur leopards.
- Vaquitas (marine mammals in Gulf of California).
- Kakapo (flightless parrot).
- Countless amphibians, fish, invertebrates, plants.

**Extinction crisis metrics**:
- IUCN Red List: catalogs threatened species.
- 32,000+ species currently threatened with extinction.
- 26% of mammals, 41% of amphibians, 14% of birds threatened.

**Consequences of extinction.**

- **Ecosystem disruption**: species interconnected in food webs and other relationships. Loss of key species (keystone species) can cascade through ecosystems.
- **Loss of ecosystem services**: pollination, pest control, water purification, climate regulation.
- **Loss of biodiversity value**: aesthetic, cultural, scientific value of species.
- **Loss of potential resources**: species contain undiscovered pharmaceuticals, foods, materials.
- **Ethical questions**: do we have obligations to other species? Future generations?

**Conservation biology.**

The field of conservation biology aims to prevent extinctions and preserve biodiversity.

**Approaches**:
- **Habitat protection**: national parks, wildlife reserves, marine protected areas.
- **Ex situ conservation**: zoos, seed banks, captive breeding.
- **Legal protection**: Endangered Species Act (US, 1973); Convention on International Trade in Endangered Species (CITES).
- **Restoration ecology**: rebuilding damaged ecosystems.
- **Community engagement**: working with local people who share landscapes with wildlife.
- **Climate action**: addressing the root cause of habitat shifts.

**Success stories**:
- **Bald eagle**: recovered from DDT-caused decline; delisted 2007.
- **California condor**: population increased from 22 (1987) to 400+ through captive breeding.
- **Humpback whales**: most populations recovering after commercial whaling banned.
- **Grey wolves**: reintroduced to Yellowstone; ecosystem responses documented.

**Ongoing challenges**:
- Climate change potentially outpacing many species' ability to adapt or migrate.
- Habitat loss continuing globally.
- Political and economic pressures against conservation.
- Funding limits.

**Extinction is forever**. Once a species is gone, its unique genetic and evolutionary heritage is lost. Efforts to "de-extinct" species (like mammoth cloning attempts) are unlikely to fully restore anything genuinely lost. Prevention is essential.

**Historical extinctions have shaped life's diversity** — mammals wouldn't have diversified without the K-Pg extinction eliminating dinosaurs. But current extinction rates suggest we're losing the diversity accumulated over millions of years, potentially very quickly.

Understanding extinction is essential context for the biology of our time. Whether the current biodiversity crisis proves to be a mass extinction comparable to the "big five" depends substantially on human choices in coming decades.`,
      video: {
        url: 'https://www.youtube.com/watch?v=BxLLTrsLg0M',
        title: 'CrashCourse Biology — Extinction',
        provider: 'CrashCourse',
      },
    },
    {
      code: '7.12',
      title: 'Variations in populations',
      content:
`**Variation** is the raw material of evolution. Without variation among individuals in a population, natural selection would have nothing to select from and populations couldn't respond to changing conditions. Understanding sources and patterns of variation is essential to understanding evolution.

**Sources of genetic variation** (covered in Units 5-6 and reviewed here):

**Mutations**: ultimate source of new alleles. Rate is low ($10^{-9}$ per nucleotide per generation) but new mutations arise constantly.

**Sexual reproduction**: shuffles existing variation.
- **Crossing over** during meiosis I.
- **Independent assortment** during meiosis I.
- **Random fertilization**.

**Gene flow**: migration of individuals brings new alleles.

**Environmental variation**: individuals with the same genotype can differ due to environment. This is not heritable and doesn't feed evolution directly, but complicates measurement of heritable variation.

**Measuring variation.**

**Phenotypic variation**: differences in observable traits. Easy to measure but includes environmental effects.

**Genotypic variation**: differences in underlying genes. Directly relevant to evolution but harder to measure.

**Heritability**: proportion of phenotypic variation attributable to genetic variation.
- $h^2 = 0$: no heritable variation.
- $h^2 = 1$: all variation is heritable.
- Most complex traits are somewhere in between.

Heritability estimates can be from twin studies, family studies, or breeding experiments.

**Types of trait variation.**

**Discrete traits**: show discontinuous distribution. Examples: blood type, pea color (in Mendel's peas), attached vs free earlobes. Usually influenced by one or few genes.

**Continuous traits**: show continuous distribution (bell-shaped distribution often). Examples: height, weight, blood pressure. Usually polygenic (many genes contribute).

**Threshold traits**: continuous underlying variation with a threshold; individuals above threshold show trait. Some diseases: everyone has some risk, but only those above threshold develop the condition.

**Levels of variation.**

**Within populations**: variation among individuals.
- **Genetic diversity**: variety of alleles present.
- Higher diversity = greater adaptive potential; more resilience to environmental change.

**Between populations**: variation among populations of the same species.
- Populations in different environments often diverge in adaptations.
- **Populations become the raw material for speciation**.

**Between species**: taxonomic diversity.
- Millions of species; each with unique features.

**Genetic diversity and evolution.**

Populations with more genetic diversity:
- Have more raw material for natural selection.
- Are more likely to contain individuals with adaptive alleles for new conditions.
- Can respond faster to environmental change.
- Are more resilient to disease outbreaks.

Populations with low diversity (bottleneck survivors, inbred lines):
- Have less variation to select from.
- More vulnerable to environmental change.
- Susceptible to inherited genetic disorders.
- Examples: cheetahs (low diversity, disease vulnerability); some royal families with hemophilia.

**Diversity within genes.**

**Alleles**: alternative versions of a gene.

Some genes have very few alleles; others have many. Immune system genes (MHC) are extremely diverse — hundreds of alleles for some MHC genes in humans.

**Polymorphism**: presence of multiple alleles in a population. Many human genes are polymorphic.

**Genetic diversity metrics**:
- **Nucleotide diversity**: average number of nucleotide differences between individuals.
- **Heterozygosity**: proportion of loci with heterozygous individuals.
- **Effective population size ($N_e$)**: relates to genetic diversity.

**Beneficial polymorphism examples.**

**Sickle cell heterozygotes** have partial malaria protection while normal for other functions. Balanced polymorphism maintains the allele in populations where malaria is common.

**MHC diversity**: greater MHC diversity means better ability to fight diverse pathogens. Sexual selection may favor MHC-different mates (some studies suggest people prefer scents of MHC-different partners).

**Blood type diversity**: different pathogens attack different blood types differently. Diversity in blood types spreads risk.

**Consequences of low diversity**.

**Inbreeding depression**: reduced fitness in offspring of related parents. Recessive alleles more likely to be homozygous, exposing genetic disorders.

**Vulnerability to disease**: pathogens can devastate populations with uniform immune systems.

**Reduced adaptive potential**: less variation for selection to act on.

**Examples of low-diversity populations**:
- **Cheetahs**: extreme low diversity; disease vulnerability; reduced fertility.
- **Elephant seals** (northern): recovered from 20 individuals; low diversity persists.
- **Wisent (European bison)**: 12 founders; low diversity.
- **Certain island bird species**.
- **Many crop varieties** (uniformly bred for yield).

**Genetic diversity in conservation**.

Conservation biologists monitor and manage genetic diversity:
- **Minimum viable population size** estimates.
- **Genetic rescue**: introducing individuals from other populations.
- **Captive breeding programs** maximize diversity retention.

**Human genetic diversity**.

Humans have relatively low genetic diversity compared to many species. Most human variation is within, not between, populations.

Explanations:
- **Recent expansion** from a small ancestral African population.
- **Bottleneck** possibly ~70,000 years ago (some evidence, contested).
- **Continued gene flow** among populations.

Human variation shows continuous, not categorical, patterns. Racial classifications are largely social constructs that don't map cleanly onto genetic differences.

**Variation is essential for evolution**. Populations with adequate genetic diversity can adapt to changing conditions and survive challenges. Populations with low diversity are more vulnerable.

Modern threats to biodiversity — habitat destruction, climate change, disease — increase the urgency of preserving genetic diversity within species, not just species diversity itself. Both matter.`,
      video: {
        url: 'https://www.youtube.com/watch?v=aTftyFboC_M',
        title: 'CrashCourse Biology — Variation in populations',
        provider: 'CrashCourse',
      },
    },
    {
      code: '7.13',
      title: 'Origin of life',
      content:
`How did life begin? The origin of life is one of biology's most fundamental — and most difficult — questions. While much remains uncertain, scientific investigation has established plausible frameworks for how the first cells might have emerged from non-living chemistry, and when this happened. The AP exam expects familiarity with the main hypotheses and evidence.

**Timing of life's origin.**

- **Earth formed**: ~4.5 billion years ago.
- **Late heavy bombardment** (asteroid impacts): 4.1-3.8 billion years ago; likely sterilized the surface repeatedly.
- **First evidence of life**: microbial fossils and geochemical evidence from ~3.5 billion years ago; possibly earlier (~3.8-4.0 billion years, though controversial).

So life arose within a few hundred million years of when Earth became habitable — geologically fast.

**Life's essential requirements.**

For life to exist, need:
- **Complex organic molecules** (amino acids, nucleotides, lipids, sugars).
- **Some way to encode and copy information** (RNA or DNA).
- **Some way to catalyze reactions** (proteins or ribozymes).
- **Cell-like compartments** (membranes).
- **Energy source**.
- **Water**.

The origin of life question breaks into several subquestions: how did each of these arise?

**Miller-Urey experiment (1953).**

Stanley Miller and Harold Urey, at the University of Chicago, demonstrated that amino acids could form spontaneously under conditions thought to resemble early Earth.

Setup:
- Water (representing early ocean).
- Methane, ammonia, hydrogen (representing early atmosphere).
- Electrical sparks (representing lightning).

After a week, the apparatus contained several amino acids — the building blocks of proteins.

The experiment showed that biological molecules could form abiotically. Subsequent experiments with different atmospheric compositions (some more accurate to early Earth) have similarly produced amino acids and other biomolecules.

**Modern understanding**: early Earth's atmosphere was probably less reducing than Miller-Urey assumed, but their basic point — that abiotic synthesis of biological molecules is possible — has been confirmed with modern conditions and reactions.

**Other sources of building blocks**:
- **Deep-sea hydrothermal vents**: alkaline hydrothermal vents may provide energy and chemistry conducive to prebiotic chemistry.
- **Meteorites**: contain amino acids and other organic molecules. Some may have delivered building blocks to Earth.
- **Space**: complex organic molecules found in interstellar dust clouds.

**RNA world hypothesis.**

**RNA world**: the hypothesis that early life used RNA both to store information (like DNA) and to catalyze reactions (like proteins).

Evidence:
- **Ribozymes**: RNA molecules that catalyze reactions. Modern ribosomes' peptide bond formation is RNA-catalyzed.
- **RNA can self-replicate**: laboratory experiments have made self-replicating RNA molecules.
- **DNA and proteins probably evolved later**: DNA is more stable (better for information storage); proteins are more versatile catalysts.

Sequence:
1. **RNA world** (RNA does everything).
2. **DNA-RNA-protein world** (DNA takes over information storage; proteins take over catalysis; RNA becomes intermediary).
3. **Modern cells**.

**Protobionts (proto-cells).**

Simple membrane-bounded structures that might have preceded true cells:

- **Coacervates**: droplets that form spontaneously in some solutions.
- **Liposomes**: lipid bilayer vesicles; form spontaneously from phospholipids in water.
- **Iron-sulfide precipitates**: at hydrothermal vents, might have provided compartments.

These structures can:
- Maintain internal chemical environments different from surroundings.
- Divide.
- Grow (by adding more material).

They aren't quite alive but have some life-like properties.

**Endosymbiosis.**

Once cells existed, evolution continued producing more complex forms.

**Endosymbiotic theory** (Lynn Margulis, 1967): mitochondria and chloroplasts descend from free-living bacteria that became internal symbionts of ancestral eukaryotic cells.

Evidence:
- Mitochondria and chloroplasts have their own DNA.
- Their DNA is circular, like bacterial DNA.
- Their ribosomes are bacterial-sized (70S).
- They divide by binary fission.
- Their inner membranes are bacterial-style.

This means eukaryotic cells are chimeras — combinations of organisms that lived together for so long they became a single entity.

**When and how did complex life arise?**

- **Prokaryotes only**: for ~2 billion years after life originated.
- **First eukaryotes**: ~2 billion years ago.
- **Multicellular organisms**: ~1 billion years ago.
- **Cambrian explosion** (rapid diversification of animal phyla): ~540 million years ago.

**Key evolutionary transitions**:
- Origin of life itself.
- Origin of the genetic code.
- Origin of eukaryotic cells (via endosymbiosis).
- Origin of multicellularity.
- Origin of sexual reproduction.
- Origin of complex nervous systems.

**Alternative hypotheses.**

- **Panspermia**: life originated elsewhere and came to Earth on meteorites. Doesn't answer where life originated, but pushes it off Earth.
- **Metabolism-first hypothesis**: metabolic reactions came before information molecules. RNA world proponents disagree.
- **Clay hypothesis**: clay minerals could have templated first biomolecules.
- **Deep hot biosphere**: life originated deep in Earth's crust.

**Current consensus**: the RNA world hypothesis is the leading framework, but details remain uncertain. Multiple experimental approaches are being pursued to test hypotheses.

**Astrobiology**.

The origin of life question has parallels to the search for life elsewhere. If life originated on Earth relatively easily, it might have originated on other planets with similar conditions.

- **Mars**: possibly had life billions of years ago when it had liquid water; controversial.
- **Europa (moon of Jupiter)**: has subsurface ocean; potentially habitable.
- **Enceladus (moon of Saturn)**: has subsurface ocean and geysers; potentially habitable.
- **Exoplanets**: thousands discovered; many in "habitable zones" of their stars.

**Ongoing research**.

Origin of life research combines:
- **Chemistry**: understanding prebiotic reactions.
- **Astronomy**: understanding early Earth conditions and other habitable worlds.
- **Geology**: understanding Earth's early history.
- **Biology**: understanding minimal cell requirements.
- **Computer modeling**: simulating early biochemistry.

**What's clear**:
- Life arose on Earth billions of years ago.
- Life descends from a common ancestor.
- The process must be scientifically explicable (not requiring supernatural intervention).

**What's uncertain**:
- Exact mechanisms of life's origin.
- Whether life could have originated multiple times independently.
- Whether life exists elsewhere.

**The origin of life is a boundary question** — where does non-living chemistry end and life begin? Modern biology treats this as a continuum rather than a sharp line, though the details of the transition remain to be worked out. This is one of the great unfinished questions of science.`,
      video: {
        url: 'https://www.youtube.com/watch?v=aTftyFboC_M',
        title: 'CrashCourse Biology — Origin of life',
        provider: 'CrashCourse',
      },
    },
  ],
  keyConcepts: [
    'Natural selection (Darwin): variation exists, is heritable, populations produce excess offspring, best-adapted survive and reproduce.',
    'Fitness = reproductive success (not physical strength).',
    'Three modes: directional (favor one extreme), stabilizing (favor mean), disruptive (favor both extremes).',
    'Sexual selection: mate choice or competition among same sex.',
    'Artificial selection: humans breed for desired traits; produced all domesticated species.',
    'Population genetics: study of allele frequencies in populations.',
    'Five mechanisms of evolution: natural selection, genetic drift, mutation, gene flow, non-random mating.',
    'Genetic drift: random changes; more important in small populations. Bottleneck and founder effects.',
    'Hardy-Weinberg: $p^2 + 2pq + q^2 = 1$; null hypothesis for evolution; requires no mutation, no gene flow, no selection, large population, random mating.',
    'Evidence for evolution: direct observation, fossils, comparative anatomy, biogeography, molecular biology, embryology.',
    'Homologous structures: shared ancestry, may serve different functions.',
    'Analogous structures: similar function, evolved independently (convergent evolution).',
    'Vestigial structures: reduced remnants of ancestral features.',
    'All life shares common ancestor (LUCA, ~3.5-4 billion years ago).',
    'Three domains: Bacteria, Archaea, Eukarya.',
    'Endosymbiosis: mitochondria and chloroplasts descended from free-living bacteria.',
    'Speciation: new species form. Allopatric (geographic isolation, most common). Sympatric (same area; polyploidy in plants).',
    'Reproductive isolation: prezygotic (prevent mating/fertilization) and postzygotic (hybrid problems) barriers.',
    'Punctuated equilibrium: long stability + brief rapid change (vs gradualism).',
    'Five major mass extinctions historically; likely sixth underway now due to humans.',
    'Genetic variation from mutations + sexual reproduction (crossing over, independent assortment, random fertilization) + gene flow.',
    'Antibiotic resistance, HIV drug resistance, guppy evolution: contemporary examples of evolution.',
    'Origin of life: ~3.5-4 billion years ago. Miller-Urey showed abiotic amino acid synthesis. RNA world hypothesis.',
  ],
  formulas: [
    {
      name: 'Hardy-Weinberg equation',
      equation: '$p^2 + 2pq + q^2 = 1$',
      meaning: 'For diploid population with two alleles (frequencies $p$ and $q$, where $p+q=1$), genotype frequencies at equilibrium. Deviations reveal evolution.',
      example: 'If 16% of population is homozygous recessive ($q^2 = 0.16$), $q = 0.4$, $p = 0.6$, carriers = $2pq = 0.48$ (48%).',
    },
    {
      name: 'Allele frequency sum',
      equation: '$p + q = 1$',
      meaning: 'For gene with two alleles, frequencies sum to 1.',
      example: 'If A allele frequency is 0.7, a allele frequency is 0.3.',
    },
    {
      name: 'Heritability',
      equation: '$h^2 = \\dfrac{\\text{genetic variance}}{\\text{total variance}}$',
      meaning: 'Proportion of phenotypic variation from genetic differences. $h^2$ close to 0: mostly environmental; close to 1: mostly genetic.',
      example: 'Height is ~80% heritable; personality traits ~40-50%; educational attainment ~40%.',
    },
    {
      name: 'Species number estimates',
      equation: '$\\sim 8-10 \\times 10^6$ eukaryotic species',
      meaning: 'Estimated total eukaryotic species (many undiscovered). ~1.5 million species named. Insects most diverse group.',
      example: 'Beetles alone represent ~400,000 named species; probably many more undescribed.',
    },
  ],
  practice: [
    {
      q: 'A population of butterflies has 25% homozygous dominant (AA), 50% heterozygous (Aa), and 25% homozygous recessive (aa) individuals for a wing color gene. Is this population in Hardy-Weinberg equilibrium?',
      a: 'Calculate expected frequencies under Hardy-Weinberg. Allele frequencies: $p = (25 + 25)/100 = 0.5$; $q = 0.5$. Expected: $AA = p^2 = 0.25$, $Aa = 2pq = 0.5$, $aa = q^2 = 0.25$. Observed matches expected exactly. Yes, in Hardy-Weinberg equilibrium — for this gene, this generation. This means no evolution is occurring for this gene right now (or at least evolutionary forces balance).',
    },
    {
      q: 'Explain how a founder effect could produce a population with a genetic profile very different from its source population.',
      a: 'A small number of individuals colonize a new area (founder population). By chance, this small group carries only a subset of the source population\'s genetic diversity. Some alleles are missed entirely; others are present at different frequencies than in the source. If the founding population is small enough, genetic drift produces further deviations from source frequencies over subsequent generations. Result: founder population is genetically distinct from source, sometimes dramatically. Example: Amish populations in Pennsylvania have high frequencies of certain genetic disorders because founders happened to carry the alleles.',
    },
    {
      q: 'Compare directional, stabilizing, and disruptive selection with a specific example for each.',
      a: 'Directional selection: favors one extreme; shifts population mean over generations. Example: peppered moths darkened during Industrial Revolution as tree bark darkened (dark morphs favored). Stabilizing selection: favors intermediate values; reduces variation. Example: human birth weight — very small or large babies have higher mortality, so selection favors intermediate weights. Disruptive selection: favors both extremes at expense of intermediates. Can produce distinct forms. Example: African seedcracker finches have bimodal bill sizes — small bills for small seeds, large bills for large seeds, but intermediate bills are inefficient at both.',
    },
    {
      q: 'Why did the extinction of dinosaurs at the K-Pg boundary (66 million years ago) enable mammal diversification?',
      a: 'For 150 million years, dinosaurs dominated most terrestrial ecosystems. Mammals existed but were mostly small and nocturnal, filling niches unavailable to dinosaurs. The K-Pg extinction (asteroid impact plus volcanic activity) killed all non-avian dinosaurs and eliminated their ecological dominance. This opened enormous ecological opportunities — food resources, habitats, niches — that mammals could exploit. Mammals underwent adaptive radiation, diversifying rapidly into new forms: larger sizes, new locomotor modes, aquatic and flying forms, and eventually primates. Without the K-Pg extinction, mammals likely would have remained a minor group; human evolution probably would not have occurred. This illustrates how mass extinctions can be evolutionary catalysts even as they destroy existing biodiversity.',
    },
  ],
  pitfalls: [
    '"Individuals evolve" — wrong. Populations evolve; individuals don\'t change over their lifetime through natural selection.',
    '"Fittest means strongest" — wrong. Fitness is reproductive success. A small, sneaky organism might have higher fitness than a large, impressive one.',
    '"Evolution has a direction or goal" — wrong. Natural selection is not planning ahead; it works based on current environmental conditions.',
    '"Evolution is just a theory" — misunderstands what "theory" means in science. Theories are well-supported explanations, not guesses.',
    '"Humans stopped evolving" — wrong. Contemporary human evolution has been documented (lactase persistence, malaria resistance, etc.).',
    '"Hardy-Weinberg equilibrium is common in nature" — wrong. It\'s a null hypothesis; real populations rarely meet all conditions.',
    '"Convergent evolution shows common ancestry" — wrong. Convergent evolution shows similar solutions to similar problems, not common ancestry.',
    '"Species can be defined by physical differences alone" — the biological species concept (reproductive isolation) is preferred, but has limits (asexual organisms, fossil species).',
    '"Speciation is always slow" — can be fast. Some plant species arise in one generation through polyploidy.',
    '"Extinction is only a natural process" — natural background extinction exists, but current rates are 100-1000× higher due to human impact.',
  ],
};
