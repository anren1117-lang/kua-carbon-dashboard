// AP Psychology Unit 1 — Biological Bases of Behavior (15-25%)
// APES-standard depth.

export const APPSYCH_UNIT_1 = {
  number: 1,
  title: 'Biological Bases of Behavior',
  weight: '15-25%',
  subunits: [
    {
      code: '1.1',
      title: 'Heredity, environment, and behavior',
      content:
`Almost every behavior and mental trait a human exhibits is the joint product of biological inheritance and lived experience — nature **and** nurture, never one alone. The old "nature vs nurture" debate has long since been replaced by a more sophisticated question: *how* do genes and environment interact to produce who we are? Understanding this question is the foundation of biological psychology and underlies everything else you'll learn in this course.

**Nature.** Biological inheritance via genes. Humans have about 20,000–25,000 protein-coding genes, organized into 23 pairs of chromosomes. Genes encode the proteins that build every cell, including the neurons of the nervous system. Variations in genes contribute to differences in temperament, intelligence, susceptibility to mental disorders, and many other psychological traits.

**Nurture.** Environmental influences. These include:

- **Family environment**: parenting style, household stress, socioeconomic status, language exposure.
- **Peer relationships**: especially formative during adolescence.
- **Culture**: norms, values, expectations that shape behavior in ways that often go unnoticed because they feel "natural" to those raised inside them.
- **Education**: formal and informal learning.
- **Nutrition**: prenatal and childhood nutrition strongly shape brain development.
- **Trauma and adverse events**: childhood trauma can produce lasting changes in stress-response systems.
- **Prenatal environment**: in utero exposure to alcohol, drugs, malnutrition, or maternal stress affects long-term outcomes.

**Heritability — what the statistic means.** A trait's heritability is the proportion of *variation* in that trait, across a population, that is attributable to genetic differences. It is a population statistic, not an individual one. Heritability of intelligence around 50% means that about half of the *variation* in IQ scores across a population can be statistically attributed to genetic differences — not that "50% of any individual's intelligence comes from genes."

Important caveats:

- Heritability changes across environments. In an environment with abundant resources for everyone, the relative impact of genes can appear larger because environmental variation is smaller. In an environment with vast inequality, environment looks more important. Heritability is not a fixed property of a trait.
- High heritability does **not** mean unchangeable. Height is $\\sim 80\\%$ heritable but children today are taller than their grandparents because nutrition has improved. PKU (phenylketonuria) is a genetic disorder with $100\\%$ heritability, but it can be entirely prevented with a low-phenylalanine diet.
- Heritability says nothing about specific genes. It's a statistical summary that hides molecular detail.

**Heritability estimates for common psychological traits:**

- **Intelligence (IQ)**: roughly 50% heritability in adulthood (lower in childhood — environmental influences are larger when development is ongoing).
- **Personality** (Big Five traits): roughly 40–50% heritable.
- **Schizophrenia**: high heritability ($\\sim 80\\%$), but environmental triggers (stress, drug use) often precede onset.
- **Depression**: $\\sim 30$–$40\\%$ heritable.
- **Bipolar disorder**: $\\sim 80\\%$ heritable.
- **Alcoholism**: $\\sim 50\\%$ heritable.

**Epigenetics.** A growing area that bridges nature and nurture at the molecular level. Environmental factors can alter how genes are *expressed* — turned on or off — without changing the DNA sequence itself. Chemical tags (methylation, histone modifications) on DNA can be added or removed in response to stress, diet, trauma, even social experience. Some epigenetic marks persist across generations, meaning your grandfather's diet during a famine might subtly affect your gene expression today. This evidence has overturned the older view that DNA was the only thing inherited.

**Behavior genetics methods.** How do psychologists actually estimate genetic contributions?

- **Twin studies.** Compare identical (monozygotic, $100\\%$ shared DNA) and fraternal (dizygotic, $\\sim 50\\%$ shared DNA, same as ordinary siblings) twins. If identical twins are more similar than fraternal twins on a trait, the genetic contribution is suggested. **Twins raised apart** are especially informative because they share genes but not environment.
- **Adoption studies.** Adopted children share DNA with biological parents but environment with adoptive parents. Comparing adoptees' traits with their biological and adoptive parents helps separate genes from environment.
- **Family studies.** Compare prevalence of a trait among biological relatives. Higher prevalence among closer relatives suggests genetic influence — but families also share environments.
- **Molecular genetics (GWAS — Genome-Wide Association Studies).** Modern technique. Compare DNA across thousands of people to identify specific genetic variants associated with a trait. Has identified specific genes implicated in many psychological traits, though each typically explains only a tiny fraction of variation.

**Famous studies.**

- The **Minnesota Twin Study** (started 1979) followed monozygotic twins separated at birth and later reunited. Stories of striking similarities — twins who had the same hobbies, married women with the same name, named their dogs the same thing — captured public attention. The study found that personality, interests, and many traits are substantially heritable.
- **Bouchard's adoption studies** of the 1980s and 1990s consistently showed that adoptees' adult personalities are more similar to their biological parents than to their adoptive parents.

**The gene-environment interaction.** Genes and environment don't just contribute additively; they interact. A genetic predisposition for depression may never manifest in a low-stress environment but may produce a severe disorder in a high-stress one. The **diathesis-stress model** captures this: certain people have a "diathesis" (genetic vulnerability) that is triggered into pathology by environmental "stress." Without the trigger, no disorder. Without the vulnerability, the same stress passes without lasting effect.

**Examples of gene-environment interaction.**

- **PKU (phenylketonuria).** Genetic disorder (recessive inheritance) that prevents metabolism of phenylalanine, an amino acid in many foods. Without dietary intervention, severe intellectual disability follows. With a low-phenylalanine diet from infancy, intelligence develops normally. Same genes, completely different outcomes based on environment.
- **Schizophrenia.** Genetic vulnerability ($\\sim 80\\%$ heritability) often combined with environmental triggers (psychological stress, cannabis use, prenatal viral infection). Identical twins share genes but only one may develop schizophrenia depending on environmental exposures.
- **Height.** $\\sim 80\\%$ heritable, but malnutrition during childhood stunts growth substantially. Average heights of populations have risen by inches over the past century with improved nutrition, even though the genes haven't changed.

**Evolutionary psychology.** Applies evolutionary theory to human behavior and mental traits. The premise: many psychological traits are *adaptations* — they exist because they helped our ancestors survive and reproduce in the ancestral environment.

Examples of evolutionary explanations:

- **Mate preferences.** Cross-cultural similarities in what humans find attractive (signs of health, fertility) might reflect evolved preferences. Critics note these similarities are inconsistent and reflect cultural diffusion too.
- **Fear of snakes, spiders, heights.** Far more easily acquired than fear of cars or guns despite cars causing vastly more modern deaths. Suggests evolved fear modules tuned for ancestral dangers.
- **Disgust responses** to spoiled food, bodily fluids. Plausibly evolved to protect against pathogen exposure.
- **Social cooperation, fairness instincts.** May have evolved through the demands of living in small cooperative groups where reciprocal altruism produced fitness benefits.

**Criticisms of evolutionary psychology.** Some evolutionary "just-so" stories are untestable. The ancestral environment can be imagined many ways, making the framework hard to falsify. Critics emphasize cultural variation that evolutionary accounts often paper over.

**The bottom line.** Nature and nurture interact; both matter; the relative contribution varies by trait and by environment. Behavior cannot be reduced to genes alone or to upbringing alone. Most AP exam questions in this area are testing whether you understand the interactive picture, not whether you can pick one side over the other.`,
      video: {
        url: 'https://www.youtube.com/watch?v=oP9aLmFYZuU',
        title: 'Mr. Sinn — Heredity and environment',
        provider: 'Mr. Sinn',
      },
    },
    {
      code: '1.2',
      title: 'The nervous system',
      content:
`Every thought you have, every movement you make, every sensation you experience runs through your nervous system — a network of about $86$ billion neurons plus a similar number of supporting cells, organized into one of the most intricate communication systems in biology. Mastering the basic anatomy and function of this system is the entry point to biological psychology.

**The two big divisions.**

**Central nervous system (CNS).** The control center.

- **Brain**: about $1.4$ kg of tissue containing the vast majority of the body's neurons. Processes information, generates output, holds memories, produces consciousness.
- **Spinal cord**: a long bundle of nerves running from the brain down through the vertebral column. Conducts signals between brain and body, and contains the circuitry for **reflexes** — automatic responses (like the knee-jerk reflex) that don't require brain involvement.

**Peripheral nervous system (PNS).** Everything outside the CNS. Carries signals to and from the body.

The PNS itself has two main divisions:

- **Somatic nervous system.** Voluntary movement and sensory input. The motor neurons that move your skeletal muscles (when you reach for a glass) and the sensory neurons that bring touch, temperature, and pain into the CNS.
- **Autonomic nervous system (ANS).** Involuntary, automatic regulation of internal organs — heart, lungs, digestive system, glands. Operates mostly without conscious awareness.

The ANS itself splits into two opposing branches:

- **Sympathetic nervous system.** Activates "fight or flight" responses. Increases heart rate, dilates pupils, dilates bronchioles, redirects blood from gut to skeletal muscles, releases stored glucose, suppresses non-emergency functions (digestion, immune response). Activated during acute stress or perceived threat. The release of adrenaline from the adrenal glands amplifies these effects.
- **Parasympathetic nervous system.** Activates "rest and digest" responses. Slows heart rate, constricts pupils, promotes digestion, stimulates salivation, enables sexual arousal, conserves energy. Active during calm states.

The two branches are usually in balance. Sympathetic dominance is brief and adaptive in short bursts; chronic sympathetic activation (chronic stress) produces health consequences including hypertension, weakened immune function, and altered mood regulation.

**Neurons — the basic unit.** A neuron is a cell specialized for electrical and chemical signaling. Three functional types:

- **Sensory (afferent) neurons.** Carry signals **toward** the CNS from sensory receptors (in skin, eyes, ears, etc.). "Afferent" means "incoming."
- **Motor (efferent) neurons.** Carry signals **from** the CNS to effectors (muscles, glands). "Efferent" means "outgoing."
- **Interneurons.** Connect within the CNS — between sensory and motor pathways, or between different brain regions. Far more numerous than sensory or motor neurons. The vast majority of brain neurons are interneurons.

**Anatomy of a neuron.**

- **Dendrites.** Branching projections that receive signals from other neurons. A neuron can have thousands of dendrites, each receiving inputs from many other cells.
- **Cell body (soma).** Contains the nucleus and cellular machinery. Integrates incoming signals.
- **Axon.** A single long projection that carries the neuron's output signal. Can be very long — the motor neurons running from your spinal cord to your foot muscles have axons over a meter long.
- **Myelin sheath.** A fatty insulation wrapped around the axon by glial cells (oligodendrocytes in the CNS, Schwann cells in the PNS). Speeds signal conduction dramatically. Gaps in the myelin (the **nodes of Ranvier**) allow the signal to "jump" — saltatory conduction. Demyelinating diseases like **multiple sclerosis** damage the myelin and slow signal transmission.
- **Terminal buttons (axon terminals).** Specialized endings that release neurotransmitters at synapses.

**Action potential — the neural signal.** A neuron at rest holds an electrical voltage of about $-70$ mV inside relative to outside. This "resting potential" is maintained by ion pumps (the $Na^+/K^+$ pump) and selective ion channels.

When inputs from other neurons depolarize the membrane to about $-55$ mV (the **threshold**), voltage-gated sodium channels open. Sodium rushes in; the membrane voltage shoots positive (peaking around $+40$ mV). Then potassium channels open, potassium rushes out, and the membrane voltage drops back below resting (briefly **hyperpolarized**) before slowly recovering.

This "spike" of voltage is the **action potential**. It travels down the axon at speeds from $\\sim 1$ m/s (unmyelinated thin axons) to $\\sim 120$ m/s (heavily myelinated thick axons).

**The all-or-none principle.** A neuron either fires a full action potential or doesn't fire at all. There's no "half-spike." The strength of a stimulus is encoded by:

- The **frequency** of action potentials (more intense stimulus = more spikes per second).
- The **number of neurons** firing.

This is why our nervous system can communicate gradations of intensity even though each individual signal is binary.

**Refractory period.** After firing, a neuron has a brief window during which it cannot fire again, even with strong stimulus. The **absolute refractory period** ($\\sim 1$ ms) reflects the time needed for sodium channels to reset. The **relative refractory period** (a few more milliseconds) requires stronger-than-normal stimulus to fire. The refractory period limits maximum firing rate to a few hundred spikes per second.

**The reflex arc.** A reflex is an automatic response that bypasses the brain. The pathway: sensory neuron → spinal interneuron → motor neuron → muscle. The brain receives the information eventually, but the response begins before conscious awareness. This is why you yank your hand back from a hot stove before feeling pain.

**The neural impulse — analogy.** A common comparison: action potentials are like a row of dominoes falling. Once the threshold is exceeded, the wave proceeds at full strength to the end. The neuron doesn't decide *how strong* a signal to send — only *whether* to send one.

**Speed and frequency.** Neural signals travel at $\\sim 1$ to $120$ m/s — fast but vastly slower than electronic circuits. The brain compensates with massive parallelism: trillions of synapses operating simultaneously. Why our brains "feel fast" despite slow individual neurons is partly because we don't notice the lag and partly because parallel processing handles many things at once.

**Glia — the support cells.** Often overshadowed by neurons, glial cells are roughly equal in number and perform vital functions: producing myelin (oligodendrocytes, Schwann cells), removing debris (microglia), supporting metabolism (astrocytes), and shaping neural development. Modern research increasingly recognizes glial cells as active participants in brain function, not just passive support.

**Practical implications.** Understanding the nervous system's structure explains many psychological phenomena:

- Why **stress responses** include increased heart rate and sweating — sympathetic activation.
- Why **anxiety drugs** (benzodiazepines) work — they enhance GABA, the brain's main inhibitory neurotransmitter (next subunit).
- Why **anesthetics** work — they block neural signal transmission.
- Why **strokes** affect specific functions — different brain regions handle different jobs.
- Why **multiple sclerosis** produces motor and cognitive symptoms — myelin damage slows neural transmission.`,
      video: {
        url: 'https://www.youtube.com/watch?v=oP9aLmFYZuU',
        title: 'Mr. Sinn — The nervous system',
        provider: 'Mr. Sinn',
      },
    },
    {
      code: '1.3',
      title: 'Neurons and synaptic transmission',
      content:
`The brain's computational power comes from its $86$ billion neurons connected by an estimated $150$ trillion synapses — junctions where neurons communicate. Mastering how synapses work and what neurotransmitters do is essential for understanding everything from how memories form to how psychiatric medications change behavior.

**The synapse.** A junction between two neurons. The **presynaptic neuron** (sender) and **postsynaptic neuron** (receiver) are separated by a tiny gap — the **synaptic cleft** — about $20$ nanometers wide. Signals cross this gap chemically, not electrically.

**The synaptic transmission process — step by step.**

1. An **action potential** arrives at the terminal button (the end of the presynaptic axon).
2. The depolarization opens voltage-gated **calcium channels**; $Ca^{2+}$ rushes into the terminal.
3. Calcium triggers **synaptic vesicles** (small sacs of neurotransmitter) to fuse with the presynaptic membrane.
4. Vesicles release their neurotransmitters into the synaptic cleft (exocytosis).
5. Neurotransmitter molecules diffuse across the cleft and **bind to receptors** on the postsynaptic neuron.
6. Receptor binding either opens ion channels directly (ionotropic receptors) or starts a second-messenger cascade (metabotropic receptors).
7. The resulting effect on the postsynaptic neuron is either **excitatory** (makes it more likely to fire its own action potential) or **inhibitory** (makes firing less likely).
8. After the message is delivered, the neurotransmitter is **cleared** from the cleft by:
   - **Reuptake**: the presynaptic neuron pumps the neurotransmitter back in for reuse. Most common mechanism.
   - **Enzymatic degradation**: enzymes break the neurotransmitter down in the cleft (acetylcholinesterase breaks down acetylcholine).
   - **Diffusion** away from the synapse.

**Why this matters.** Many psychiatric medications work by altering one of these steps. SSRIs (Selective Serotonin Reuptake Inhibitors) like Prozac and Zoloft block the reuptake of serotonin, prolonging its action in the synapse. This is one of the most important practical applications of synaptic biology.

**Major neurotransmitters and their functions.**

**Acetylcholine (ACh).** Found at neuromuscular junctions (where motor neurons signal skeletal muscles to contract) and in many brain circuits involved in learning and memory.
- Low ACh in the brain is a hallmark of **Alzheimer's disease**. Many Alzheimer's drugs (donepezil, rivastigmine) work by inhibiting the enzyme that degrades ACh, prolonging its action.
- The poison **curare** blocks ACh receptors, paralyzing muscles; this is how indigenous South Americans used it on blowgun darts.
- **Botulinum toxin** blocks ACh release, causing botulism paralysis; in tiny doses, it's used as cosmetic Botox.

**Dopamine.** Critical for movement, motivation, reward, and pleasure.
- **Parkinson's disease** results from death of dopamine-producing neurons in the substantia nigra. Symptoms: tremor, slow movement, muscle rigidity. Treatment with L-DOPA (a dopamine precursor) helps, especially early.
- **Schizophrenia** is associated with excess dopamine activity in certain brain regions. Many antipsychotic drugs are dopamine antagonists.
- The **mesolimbic dopamine pathway** is the brain's "reward circuit." Addictive drugs (cocaine, methamphetamine, opioids) all converge on increasing dopamine signaling in this pathway. Natural rewards (food, sex, social validation) activate it less intensely but more sustainably.

**Serotonin (5-HT).** Affects mood, sleep, appetite, sexual behavior.
- Low serotonin is associated with **depression** and **anxiety**. SSRIs (Prozac, Zoloft, Lexapro) block serotonin reuptake, increasing synaptic levels.
- Hallucinogens like LSD and psilocybin bind to serotonin receptors.
- MDMA (ecstasy) causes massive serotonin release.

**Norepinephrine (noradrenaline).** Alertness, arousal, attention.
- Low norepinephrine is linked to depression and ADHD. SNRIs (serotonin-norepinephrine reuptake inhibitors) like Cymbalta target both.
- Acts as a hormone too — released by the adrenal medulla during stress.

**GABA (gamma-aminobutyric acid).** The major **inhibitory** neurotransmitter in the brain. Slows neural firing.
- Anxiety medications (**benzodiazepines** like Xanax, Valium, Ativan) enhance GABA's effect.
- **Alcohol** enhances GABA action — partly why it has a calming/sedating effect.
- Barbiturates work similarly.
- Low GABA function is implicated in anxiety disorders and some seizure disorders.

**Glutamate.** The major **excitatory** neurotransmitter in the brain. Drives most fast brain signaling.
- Essential for learning and memory through long-term potentiation (LTP) — the strengthening of synapses with repeated activation.
- Excess glutamate is toxic to neurons (excitotoxicity); contributes to stroke damage and possibly Alzheimer's.
- The anesthetic **ketamine** blocks NMDA glutamate receptors; in low doses, it has fast-acting antidepressant effects.

**Endorphins ("endogenous morphines").** Natural painkillers produced by the body. Released during pain, stress, exercise, eating, sex.
- "Runner's high" is partly endorphin-mediated.
- Opioid drugs (morphine, heroin, oxycodone, fentanyl) bind to the same receptors as endorphins.

**Agonists and antagonists — how drugs work.**

- **Agonists** mimic a neurotransmitter and activate its receptors. Examples: morphine (mimics endorphins), nicotine (mimics acetylcholine at certain receptors), benzodiazepines (enhance GABA).
- **Antagonists** block receptors without activating them, preventing the neurotransmitter from acting. Examples: many antipsychotics (block dopamine receptors), naloxone (blocks opioid receptors, used to reverse overdose), atropine (blocks ACh receptors).

Some drugs do more complex things: blocking reuptake (SSRIs, cocaine), promoting release (amphetamines), preventing release (botulinum toxin), inhibiting breakdown enzymes (donepezil for Alzheimer's).

**Drugs and synapses — common examples to know.**

- **Cocaine**: blocks dopamine reuptake → flood of dopamine in the synapse → euphoria. Chronic use depletes dopamine and damages receptors.
- **Caffeine**: blocks adenosine receptors → less drowsiness signaling → wakefulness. Doesn't directly increase any neurotransmitter; just removes a brake.
- **Alcohol**: enhances GABA (slowing brain activity), reduces glutamate, and triggers dopamine release. Multiple effects explain why it's both sedating and rewarding.
- **Nicotine**: binds nicotinic acetylcholine receptors; in the brain, this triggers dopamine release in reward circuits. The reason nicotine is so addictive.
- **SSRIs**: block serotonin reuptake → more serotonin in the synapse → mood elevation over weeks.
- **Antipsychotics**: block dopamine receptors → reduce excess signaling → reduce positive symptoms of schizophrenia.
- **Benzodiazepines**: enhance GABA → sedation, anxiety reduction.
- **Opioids**: bind endorphin receptors → pain relief, euphoria, addiction risk.

**Excitatory vs inhibitory effects.** Whether a neurotransmitter excites or inhibits depends on the receptor, not just the chemical. Glutamate is usually excitatory but acts as inhibitory at some receptors. Acetylcholine excites at neuromuscular junctions but inhibits in some heart circuits.

**Why synapses are central.** Synapses are where learning happens — synaptic strengths change with experience, encoding memory. They're where psychiatric drugs act. They're where addiction takes hold. Understanding synaptic biology is the bridge between molecular brain science and behavioral psychology.`,
      video: {
        url: 'https://www.youtube.com/watch?v=oP9aLmFYZuU',
        title: 'Mr. Sinn — Neurotransmitters',
        provider: 'Mr. Sinn',
      },
    },
    {
      code: '1.4',
      title: 'The endocrine system',
      content:
`The nervous system communicates via rapid electrical signals. The **endocrine system** is the body's slower but longer-lasting chemical messaging system, using **hormones** released into the bloodstream by glands. While the nervous system can send a signal across the body in milliseconds, hormonal signals act over seconds to days — but their effects can last hours, days, or a lifetime (in puberty, for example). The two systems work together; the hypothalamus links them.

**The major endocrine glands.**

**Pituitary gland.** Often called the "master gland" because it regulates other endocrine glands. Located at the base of the brain, controlled by the hypothalamus.

- Anterior pituitary releases:
  - **Growth hormone (GH)**: stimulates body growth.
  - **TSH (thyroid-stimulating hormone)**: tells the thyroid to release thyroxine.
  - **ACTH (adrenocorticotropic hormone)**: tells the adrenal cortex to release cortisol.
  - **LH and FSH**: regulate gonadal hormones.
  - **Prolactin**: milk production.
- Posterior pituitary releases:
  - **Oxytocin**: bonding, childbirth contractions, milk letdown. Sometimes called "the love hormone."
  - **ADH (antidiuretic hormone, vasopressin)**: water balance; reduces urine production when dehydrated.

**Thyroid gland.** In the neck. Produces **thyroxine ($T_4$)** and **triiodothyronine ($T_3$)**, which regulate metabolism.

- **Hyperthyroidism**: too much thyroid hormone. Symptoms: weight loss, rapid heartbeat, anxiety, heat intolerance, exophthalmos (bulging eyes). Graves' disease is the most common cause.
- **Hypothyroidism**: too little. Symptoms: fatigue, weight gain, cold intolerance, depression, cognitive slowing. Hashimoto's thyroiditis is a common cause. Easily treated with thyroid hormone replacement.

**Adrenal glands.** Sit on top of the kidneys. Each has two parts:

- **Adrenal medulla (inner)**: releases **epinephrine (adrenaline)** and **norepinephrine** in response to stress. Causes the fight-or-flight response — increased heart rate, dilated pupils, mobilization of energy reserves. Within seconds of perceived threat.
- **Adrenal cortex (outer)**: releases **cortisol**, the body's main stress hormone. Cortisol regulates blood sugar, suppresses immune function in the short term, and is essential for surviving sustained stress. Chronic high cortisol has many negative effects (memory impairment, weight gain, cardiovascular problems).

**Pancreas.** Both an exocrine gland (digestive enzymes) and an endocrine gland (blood sugar regulation).

- **Insulin**: released when blood sugar is high; tells cells to take up glucose. Insulin failure → diabetes.
- **Glucagon**: released when blood sugar is low; tells the liver to release stored glucose.

**Gonads.** The sex organs (testes and ovaries) produce sex hormones.

- **Testosterone**: produced mainly in the testes (also in the adrenal cortex and ovaries). Drives male sexual development at puberty; affects libido, aggression, muscle mass, and many other traits in both sexes.
- **Estrogen and progesterone**: produced mainly in the ovaries. Drive female sexual development at puberty; regulate menstrual cycle and pregnancy.

**Pineal gland.** Small gland deep in the brain. Produces **melatonin** in response to darkness; melatonin regulates sleep-wake cycles. Light suppresses melatonin (which is why bright screens at night disrupt sleep).

**Hypothalamus.** A small region of the brain that's the central interface between the nervous and endocrine systems. The hypothalamus monitors body state (temperature, blood pressure, hydration, nutrient levels) and directs the pituitary to release appropriate hormones.

**The hypothalamus-pituitary-adrenal (HPA) axis.** The body's main stress response system.

1. Stressor perceived.
2. Hypothalamus releases **CRH** (corticotropin-releasing hormone).
3. Anterior pituitary releases **ACTH**.
4. Adrenal cortex releases **cortisol**.
5. Cortisol mobilizes energy, modulates immune function, and provides negative feedback to suppress further CRH and ACTH release.

In acute stress, this cascade is adaptive. In chronic stress, sustained high cortisol contributes to:

- Hippocampal atrophy (memory impairment).
- Immune suppression.
- Weight gain (especially abdominal).
- Sleep disturbance.
- Increased risk of depression and anxiety.

**Hormones and behavior — concrete examples.**

- **Cortisol** affects memory: very high cortisol impairs memory formation but enhances emotional memory consolidation (which is why we remember stressful events vividly).
- **Testosterone** correlates with aggression and competitive behavior in both sexes. The relationship is complex — winning a competition raises testosterone; losing lowers it.
- **Oxytocin** released during physical contact, sex, and breastfeeding promotes social bonding. Often called "the love hormone" or "the cuddle hormone." Also released during childbirth, where it triggers and intensifies labor contractions.
- **Vasopressin** is associated with pair-bonding in some species (most famously in prairie voles).
- **Insulin** regulates blood sugar; its failure produces diabetes (Type 1: pancreas can't make insulin; Type 2: cells don't respond to insulin).
- **Estrogen and testosterone** drive sexual development at puberty and affect mood, libido, and many other traits across the lifespan.

**Common endocrine disorders.**

- **Diabetes mellitus.** Type 1: autoimmune destruction of insulin-producing pancreatic cells; requires insulin therapy. Type 2: insulin resistance + reduced insulin production; managed with diet, exercise, and various drugs (metformin, SGLT2 inhibitors, GLP-1 agonists). Affects $\\sim 11\\%$ of US adults.
- **Hypothyroidism.** Common, especially in women; treated with thyroid hormone replacement.
- **Cushing's syndrome.** Excess cortisol. Causes weight gain, moon face, high blood pressure, mood changes. Caused by pituitary tumors, adrenal tumors, or long-term steroid use.
- **Addison's disease.** Adrenal insufficiency. Fatigue, weight loss, low blood pressure. Treated with hormone replacement.
- **PCOS (polycystic ovary syndrome).** Hormonal imbalance affecting up to 10% of women of reproductive age; symptoms include irregular periods, weight gain, infertility.

**Hormones vs neurotransmitters.** Both are chemical messengers. The differences:

- **Neurotransmitters** act at synapses (over $\\sim 20$ nm), within milliseconds.
- **Hormones** travel through the bloodstream (potentially across the whole body), over seconds to minutes.

The same chemical can serve both roles: norepinephrine is a neurotransmitter in the brain *and* a hormone released by the adrenal medulla. Oxytocin acts as a hormone (bonding, childbirth) and a neurotransmitter (social cognition in brain circuits).

**Why endocrinology matters in psychology.**

- Mood disorders often involve hormonal dysregulation (cortisol, thyroid).
- Puberty's psychological changes are driven by sex hormones.
- Menopause's mood and cognitive effects involve hormonal shifts.
- Postpartum depression is partly hormonal.
- Stress and trauma effects on the brain operate substantially through cortisol.
- Many psychiatric medications have hormonal effects (some antidepressants affect thyroid function).

The endocrine system is the slow chemical layer of physiological control, working alongside the rapid neural layer to regulate behavior.`,
      video: {
        url: 'https://www.youtube.com/watch?v=oP9aLmFYZuU',
        title: 'Mr. Sinn — The endocrine system',
        provider: 'Mr. Sinn',
      },
    },
    {
      code: '1.5',
      title: 'Brain structures',
      content:
`The human brain weighs about 1.4 kg but contains roughly $86$ billion neurons and $150$ trillion synapses. It is the most complex structure known. Understanding its major regions and their functions is one of the central skills of biological psychology — and one of the most exam-tested topics in this unit.

The brain is organized hierarchically, with **older** structures (evolutionarily and developmentally) at the bottom (brainstem, near the spinal cord) and **newer** structures (cerebral cortex, especially frontal lobes) at the top and front. Each "layer" added new capabilities while keeping older functions running.

**Brainstem.** Connects the spinal cord to the rest of the brain. Controls basic life-support functions; you can't survive without an intact brainstem.

- **Medulla oblongata (medulla)**. Just above where the spinal cord meets the brain. Controls heart rate, breathing, blood pressure. Damage is usually fatal.
- **Pons**. Above the medulla. Coordinates movement; involved in sleep, arousal, and dreaming.
- **Reticular formation**. A network running through the brainstem. Controls arousal, attention, alertness. Damage can produce coma; stimulation produces awakening.

**Cerebellum** ("little brain"). At the back of the brain, beneath the cerebrum. Despite its small size, it contains about half of the brain's neurons.

- Coordinates **voluntary movement**, especially fine motor control and timing.
- Maintains **balance and posture**.
- Stores **procedural memory** (how to ride a bike, type, play piano).
- Recent research suggests roles in cognition and language too.
- Damage produces ataxia — uncoordinated, jerky movement; alcohol acutely impairs cerebellar function, causing the loss of coordination you see in intoxication.

**Limbic system.** A set of structures involved in emotion, motivation, memory. Sometimes called the "emotional brain."

- **Thalamus**. Sensory relay station near the center of the brain. Nearly all sensory information (except smell) passes through the thalamus on its way to the cortex. "The brain's switchboard."
- **Hypothalamus**. Below the thalamus. Tiny but critical. Regulates basic drives: hunger, thirst, body temperature, sexual behavior. Controls the pituitary gland, linking nervous and endocrine systems.
- **Hippocampus**. Curved structure in the medial temporal lobe (one in each hemisphere). Essential for forming **new explicit memories** (facts and events). Damage produces anterograde amnesia — inability to form new long-term memories. Profoundly affected in Alzheimer's disease.
- **Amygdala**. Almond-shaped (the name means "almond" in Greek). Processes fear and aggression; attaches emotional significance to memories. Damaged amygdalas produce reduced fear responses and difficulty recognizing fearful expressions in others.

**Famous case — H.M.** Henry Molaison had his hippocampus removed bilaterally in 1953 to treat severe epilepsy. The seizures stopped but H.M. could never form new explicit memories afterward — he met the same researchers as strangers every day for 55 years. He could still learn motor skills (procedural memory, cerebellum-dependent) but not new facts or events (hippocampus-dependent). H.M.'s case revolutionized understanding of memory.

**Cerebrum.** The largest, newest part of the brain. Divided into two **hemispheres** (left and right), connected by the **corpus callosum** — a thick band of $\\sim 200$ million axons that carries signals between hemispheres.

The outer surface of the cerebrum is the **cerebral cortex** — a $2$–$4$ mm thick sheet of neurons folded into the wrinkly surface we recognize as the brain's exterior. The folds (gyri, sulci) pack more cortex into the available space; the human cortex unfolded would cover an area about the size of a desk.

**The four lobes** (each hemisphere has all four).

**Frontal lobe.** Largest lobe; behind the forehead. Functions:

- **Voluntary movement** (motor cortex at the back of the frontal lobe).
- **Speech production** (Broca's area, usually in the left hemisphere).
- **Executive functions**: planning, decision-making, judgment, impulse control.
- **Personality**.
- **Working memory**.
- Damage to the frontal lobe can radically alter personality and judgment. The frontal lobe doesn't finish developing until the mid-20s, which is why teenagers are notoriously poor at impulse control.

**Famous case — Phineas Gage.** A railroad worker in 1848. An explosion drove a $3$-cm iron tamping rod through his left frontal lobe. He survived — but his personality changed dramatically. From responsible foreman to irresponsible, profane, unable to plan or maintain employment. His friends said he "was no longer Gage." His case became the first widely-known evidence that the frontal lobe controls personality and judgment.

**Parietal lobe.** Behind the frontal lobe. Functions:

- **Touch sensation** (somatosensory cortex at the front of the parietal lobe).
- **Spatial awareness** and **proprioception** (knowing where your body is).
- **Mathematical and logical reasoning** (some functions).
- Damage can produce neglect syndrome — patients ignore one side of space.

**Temporal lobe.** On the side of the brain, above the ear. Functions:

- **Hearing** (auditory cortex).
- **Language comprehension** (Wernicke's area, usually in the left hemisphere).
- **Face recognition** (fusiform face area).
- The medial temporal lobe contains the hippocampus and amygdala.

**Occipital lobe.** At the back of the brain. Functions:

- **Vision** processing. The primary visual cortex (V1) is here.

**Specialized cortical regions.**

- **Motor cortex** (back of frontal lobe). Controls voluntary movement. Different body parts are mapped to different cortical regions in a layout called the **motor homunculus**. Hands, lips, and tongue have disproportionately large cortical representation, reflecting their fine motor demands.
- **Somatosensory cortex** (front of parietal lobe). Processes touch. Has a similar **sensory homunculus** with similar distortions.
- **Association cortex**: regions not directly tied to sensation or motor — involved in higher cognition. The vast majority of human cortex is association cortex; this is what distinguishes us from other mammals.

**Hemispheric specialization (lateralization).** The two hemispheres specialize in different functions.

- **Left hemisphere** (in $\\sim 95\\%$ of right-handers and $\\sim 70\\%$ of left-handers): language, logical analysis, math, fine motor control of the right side of the body (because of contralateral organization — each hemisphere controls the opposite side of the body).
- **Right hemisphere**: spatial reasoning, face recognition, music perception, emotional processing, creativity (broadly), left-side body control.

**Important caveat.** "Left-brained vs right-brained" personalities are a pop-psychology myth. Both hemispheres are involved in most tasks; they specialize *modestly*, not absolutely. Most real tasks engage both.

**Split-brain research.** **Roger Sperry** and **Michael Gazzaniga** studied patients whose corpus callosum had been severed (originally to treat severe epilepsy). When the hemispheres can't communicate, each shows its specialties starkly. If a picture of a key is shown only to the right hemisphere, the patient cannot *name* it (language is left-hemisphere) but can *select* a key with the left hand (left hand is controlled by the right hemisphere). Split-brain patients revealed the existence and extent of lateralization. Sperry won the Nobel Prize in 1981 for this work.

**Neuroplasticity.** The brain can reorganize itself in response to experience or injury. Three forms:

- **Synaptic plasticity**: the strengthening or weakening of individual synapses with use. The basis of learning and memory.
- **Cortical reorganization**: after damage, intact regions can take over some functions of damaged ones. Children's brains are especially plastic; recovery from early brain damage is often more complete than in adults.
- **Neurogenesis**: the production of new neurons. Long thought impossible in adult mammals, but it is now established that adult neurogenesis occurs in the hippocampus and olfactory bulb. Whether it occurs in the cerebral cortex remains debated.

**Practical implications.**

- Stroke patients can sometimes regain function as neighboring brain regions assume the damaged area's roles.
- Musicians have enlarged auditory and motor regions corresponding to the body parts used (e.g., enlarged left hand representation in string musicians).
- London taxi drivers, who must memorize the city's complex street layout, have enlarged hippocampi.
- Childhood experiences shape brain structure in lasting ways; early enrichment matters.

**The brain is dynamic, not fixed.** Old-school neuroscience emphasized localized functions and adult brain stability. Modern neuroscience emphasizes networks (most behaviors involve multiple brain regions cooperating) and ongoing plasticity (brains keep changing throughout life). Both perspectives are partly right; the truth is that brains have both stable specialization and ongoing adaptability.`,
      video: {
        url: 'https://www.youtube.com/watch?v=oP9aLmFYZuU',
        title: 'Mr. Sinn — Brain structures',
        provider: 'Mr. Sinn',
      },
    },
    {
      code: '1.6',
      title: 'Brain research, consciousness, and sleep',
      content:
`Modern neuroscience has progressed by inventing increasingly sophisticated tools to look inside the working brain. From the early days of lesion analysis (studying patients with brain damage) to modern non-invasive imaging that reveals brain activity in real time, the available techniques have transformed psychology from speculation into hard science.

**Methods of studying the brain.**

**Lesion studies.** Examine behavior of people (or animals) with damage to specific brain regions. The classical method, dating to Broca's discovery (1861) that damage to a left frontal lobe region produces speech production deficits.

- Phineas Gage (1848): frontal lobe damage → personality change.
- H.M. (1953): bilateral hippocampal removal → inability to form new memories.
- Broca's patient "Tan" (1861): only word the patient could say; autopsy revealed left frontal lobe damage; the region is now called Broca's area.
- Wernicke's patients: damage to a left temporal lobe area produces fluent but meaningless speech; the region is Wernicke's area.

**EEG (electroencephalography).** Electrodes on the scalp record electrical activity of millions of synchronized neurons. Excellent **time resolution** (millisecond), poor spatial resolution. Used to study sleep stages, seizures, and rapid cognitive processes.

**CT/CAT scan (computed tomography).** X-rays from multiple angles combined into 3D images. Shows **structure** but not function. Used for detecting tumors, bleeds, gross damage. Faster and cheaper than MRI.

**MRI (magnetic resonance imaging).** Uses strong magnetic fields to image soft tissues. Far better resolution than CT. Shows fine **structure** but not function (in standard MRI).

**fMRI (functional MRI).** Detects changes in blood oxygenation as a proxy for neural activity. Shows **what brain regions are active** during specific tasks. Excellent spatial resolution (a few mm), modest time resolution (a few seconds). The workhorse of cognitive neuroscience since the 1990s.

**PET (positron emission tomography).** Injects a radioactive tracer (often a glucose analog) and detects emitted positrons. Shows where the brain is consuming metabolic fuel. Lower resolution than fMRI; more invasive (radioactivity); used less now but still useful for measuring specific neurotransmitter receptors with custom tracers.

**TMS (transcranial magnetic stimulation).** Brief magnetic pulses applied through the scalp can temporarily disrupt or stimulate underlying brain regions. Used both in research (to test what a region does by briefly knocking it out) and clinically (rTMS treats depression).

**Single-cell recording.** Tiny electrodes record from individual neurons. Mostly in animal research; some human use in epilepsy surgery patients.

**Diffusion tensor imaging (DTI).** A specialized MRI technique that maps white matter tracts (axon bundles) by measuring water diffusion along them. Reveals brain connectivity.

**Why all these methods?** Each has different strengths. EEG captures fast changes; fMRI maps spatial activity; lesion studies tell you what a region is necessary for. Modern neuroscience often combines methods to cross-validate findings.

**Consciousness.** Awareness of self and environment. One of the most philosophically loaded topics in psychology — "what is consciousness?" remains genuinely contested. For AP purposes, consciousness is the topic of psychological states ranging from full alertness through sleep, dreams, hypnosis, meditation, and drug-altered states.

**States of consciousness.**

- **Full wakefulness.** Alert, processing sensory input, capable of intentional behavior.
- **Sleep.** Reduced sensory awareness, characteristic EEG patterns, regulated by circadian rhythms.
- **Drowsiness / hypnagogic state.** Transition between wakefulness and sleep.
- **Hypnosis.** Focused attention with increased suggestibility. Despite its dramatic image, modern research suggests hypnosis is a form of focused attention, not a distinct neurobiological state.
- **Meditation.** Various forms (focused attention, open monitoring, loving-kindness) produce measurable changes in brain activity and structure with practice.
- **Drug-altered states.** Many psychoactive drugs alter consciousness in characteristic ways.
- **Pathological states.** Coma, persistent vegetative state, minimally conscious state — distinguishable by behavioral and EEG criteria.

**Sleep stages.** Sleep is not a single state but a cycle of distinct stages, each characterized by different EEG patterns.

- **NREM (non-REM) stage 1.** Light sleep. Theta waves. Easily awakened. Brief muscle jerks (hypnic jerks) common.
- **NREM stage 2.** Slightly deeper. Sleep spindles and K-complexes appear in EEG.
- **NREM stage 3 (and 4).** Deep slow-wave sleep. Delta waves dominate. Hard to awaken. Growth hormone released. Most physical restoration occurs. Children's enuresis (bedwetting) and sleepwalking occur during this stage.
- **REM (rapid eye movement) sleep.** Brain activity high (similar to waking), eyes move rapidly, but skeletal muscles are **paralyzed** (except diaphragm, eyes). Most vivid dreaming occurs here. The brain seems "active" while the body is essentially frozen.

A typical night involves ~4–5 cycles of NREM → REM, each cycle lasting about 90 minutes. Early in the night, NREM dominates and includes deep stages; later in the night, REM periods lengthen.

**Total sleep need.** Varies by age:
- Newborns: $\\sim 16$ hours per day.
- Children: $\\sim 9$–11 hours.
- Teenagers: $\\sim 8$–10 hours (most are chronically sleep-deprived).
- Adults: $\\sim 7$–9 hours.
- Older adults: $\\sim 7$–8 hours, but more fragmented.

**Why sleep matters.**

- **Memory consolidation.** REM and slow-wave sleep both contribute to converting short-term memories into stable long-term ones. Skipping sleep impairs learning.
- **Physical restoration.** Slow-wave sleep is when growth hormone is released and tissues repair.
- **Brain clearance.** Recent research (the "glymphatic system") shows that during sleep, the brain clears metabolic waste products including amyloid-beta — the protein that accumulates in Alzheimer's. Chronic sleep loss may contribute to neurodegenerative disease.
- **Emotional regulation.** Poor sleep impairs emotional control and amplifies negative emotions.
- **Immune function.** Sleep loss weakens immune response.

**Circadian rhythm.** A roughly 24-hour internal cycle that governs sleep-wake timing and many physiological processes. Regulated by the **suprachiasmatic nucleus (SCN)** of the hypothalamus, which receives input from the eyes about light levels. Light at night (especially blue light) suppresses melatonin production and shifts the clock.

**Jet lag** is the misalignment between your internal clock and the external time zone — takes a day per time zone to fully adjust. Eastward travel is harder than westward because it requires phase-advancing (going to bed earlier), which is harder than phase-delaying.

**Sleep disorders.**

- **Insomnia.** Difficulty falling or staying asleep. Most common sleep disorder. Often treated with cognitive behavioral therapy (CBT-I), sometimes with medications.
- **Sleep apnea.** Repeated breathing pauses during sleep. Often caused by obstructive airway collapse. Dangerous; treated with CPAP machines.
- **Narcolepsy.** Sudden uncontrollable sleep attacks during the day; sometimes accompanied by cataplexy (muscle weakness triggered by emotion). Caused by loss of orexin/hypocretin-producing neurons.
- **Night terrors.** Episodes of intense fear during deep NREM sleep, especially in children. Different from nightmares (which occur in REM).
- **Sleepwalking and sleeptalking.** Occur during deep NREM sleep.
- **REM sleep behavior disorder.** Loss of the muscle paralysis that normally accompanies REM; the person acts out their dreams. Often a precursor to Parkinson's disease.

**Theories of dreaming.**

- **Freud (psychoanalytic).** Dreams express unconscious wishes in disguised form. The "manifest content" is the surface story; the "latent content" is the hidden meaning. Modern psychology generally rejects this view as untestable, though dreams do often involve emotionally significant material.
- **Activation-synthesis** (Hobson and McCarley, 1977). During REM, the brainstem generates random neural activity; the cortex tries to make sense of it by weaving a coherent narrative. Dreams are the brain's interpretation of essentially random signals.
- **Memory consolidation.** Dreams may be a byproduct (or part of the mechanism) of memory consolidation. Recently-encoded experiences get replayed and integrated.
- **Threat simulation theory.** Dreams may be evolved "training" for rare but dangerous situations; ancestral dreamers who rehearsed escape from predators might have survived more often.
- **Emotional regulation.** REM sleep may help process and dampen emotional content of memories.

The truth is probably that dreams serve multiple functions; no single theory captures everything.

**Drug-altered consciousness.** Drugs are categorized by their effects:

- **Depressants** (alcohol, benzodiazepines, opioids). Slow CNS activity. Effects: sedation, reduced inhibition, impaired motor control.
- **Stimulants** (caffeine, nicotine, amphetamines, cocaine). Increase CNS activity. Effects: alertness, increased heart rate, energy.
- **Hallucinogens** (LSD, psilocybin, mescaline). Distort perception. Effects: sensory distortions, altered sense of time.
- **Opioids** (morphine, heroin, oxycodone, fentanyl). Bind endorphin receptors. Effects: pain relief, euphoria, sedation, respiratory depression (cause of overdose).
- **Cannabis.** Acts on cannabinoid receptors. Effects: relaxation, altered perception, increased appetite, impaired memory.

Chronic drug use produces **tolerance** (more drug needed for same effect), **dependence** (withdrawal symptoms when discontinued), and often **addiction** (compulsive use despite negative consequences). Many drugs hijack the brain's reward circuits, especially the mesolimbic dopamine pathway.`,
      video: {
        url: 'https://www.youtube.com/watch?v=oP9aLmFYZuU',
        title: 'Mr. Sinn — Brain research and consciousness',
        provider: 'Mr. Sinn',
      },
    },
  ],
  keyConcepts: [
    'Behavior is the joint product of nature (genes) and nurture (environment); the two interact, not compete.',
    'Heritability is a population-level statistic about variation, not a property of individuals. Changes across environments.',
    'Epigenetics: environment can alter gene expression without changing DNA sequence.',
    'CNS = brain + spinal cord. PNS = somatic (voluntary) + autonomic (involuntary). Autonomic splits into sympathetic (fight-or-flight) and parasympathetic (rest-and-digest).',
    'Neuron parts: dendrites (receive) → soma (integrate) → axon (transmit) → terminal buttons (release NT). Myelin sheath speeds conduction.',
    'Action potential is all-or-none; strength encoded by frequency. Resting potential ~$-70$ mV; threshold ~$-55$ mV.',
    'Synapses: vesicles release NT into cleft, bind postsynaptic receptors. Reuptake or enzyme degradation clears NT.',
    'Major neurotransmitters: ACh (memory; low in Alzheimer\'s), dopamine (movement and reward; Parkinson\'s and schizophrenia), serotonin (mood; targeted by SSRIs), norepinephrine (alertness), GABA (inhibitory; benzos enhance), glutamate (excitatory; learning), endorphins (natural painkillers).',
    'Endocrine system: glands secrete hormones into blood. Slower than nervous system; longer-lasting effects.',
    'Pituitary = master gland. Adrenal = stress (cortisol, epinephrine). Thyroid = metabolism. Pancreas = blood sugar. Gonads = sex hormones.',
    'HPA axis: hypothalamus → pituitary (ACTH) → adrenal (cortisol). Main stress response.',
    'Brain hierarchy: brainstem (medulla, pons — life support) → cerebellum (movement, balance) → limbic system (emotion, memory: thalamus, hypothalamus, hippocampus, amygdala) → cerebrum (cortex).',
    'Cerebral cortex lobes: frontal (planning, motor, Broca\'s area for speech production), parietal (touch, spatial), temporal (hearing, Wernicke\'s area for language comprehension), occipital (vision).',
    'Hemispheric specialization: left hemisphere usually has language; right has spatial and emotional processing. Split-brain research revealed lateralization.',
    'Neuroplasticity: brain reorganizes with experience and injury; childhood especially plastic.',
    'Sleep stages: NREM 1-3 (deepening) + REM (dreaming, paralyzed body). ~90-minute cycles, ~4-5 per night.',
  ],
  practice: [
    {
      q: 'What does the all-or-none principle mean for action potentials, and how does the nervous system encode stimulus intensity?',
      a: 'A neuron either fires a full action potential or doesn\'t fire at all — there is no partial action potential. Stimulus intensity is encoded by **frequency** of firing (more intense → more action potentials per second) and by the **number of neurons** activated, not by varying the strength of individual spikes.',
    },
    {
      q: 'After damage to the frontal lobe, a person\'s personality changes dramatically. What functions of the frontal lobe explain this?',
      a: 'The frontal lobe is responsible for executive functions: planning, judgment, impulse control, decision-making, and personality regulation. The famous case of Phineas Gage illustrates this: after an iron rod damaged his frontal lobe, he became impulsive and irresponsible, where he had been a responsible foreman. The frontal lobe doesn\'t fully mature until the mid-20s, which is why teenagers often show poor judgment.',
    },
    {
      q: 'Why do SSRIs work? What is their mechanism at the synapse?',
      a: 'SSRIs (Selective Serotonin Reuptake Inhibitors) block the reuptake transporter that normally pulls serotonin back into the presynaptic neuron after release. With reuptake blocked, serotonin remains in the synaptic cleft longer and binds postsynaptic receptors more. Over weeks (not immediately — the lag in clinical effect is one of SSRIs\' notable properties), this prolonged serotonin signaling produces antidepressant and anxiolytic effects.',
    },
    {
      q: 'Explain how the autonomic nervous system responds to a perceived threat and then helps the body recover.',
      a: 'When a threat is perceived, the **sympathetic** branch of the autonomic nervous system activates: heart rate and blood pressure rise, pupils dilate, blood is redirected from gut to skeletal muscles, glucose is released for energy, sweating increases, and digestion slows. Adrenal medulla simultaneously releases epinephrine, amplifying these effects. This is the "fight or flight" response. Once the threat passes, the **parasympathetic** branch counteracts these changes: heart rate slows, digestion resumes, pupils constrict. This is "rest and digest." The two branches are usually in dynamic balance.',
    },
    {
      q: 'A heritability of $80\\%$ for height is reported. Does this mean nutrition cannot affect height?',
      a: 'No. Heritability is a population-level statistic about *variation*: in the population studied, $\\sim 80\\%$ of the variation in heights is attributable to genetic differences. It does not mean nutrition has no effect on any individual\'s height. Across populations or eras with different nutrition, average heights can change substantially even though within-population heritability remains high. Average heights have risen by inches over the past century due to improved nutrition — the genes haven\'t changed, but the environment has.',
    },
  ],
  pitfalls: [
    '"Nature vs nurture" is either-or — wrong. They interact; genes set a range of possibilities and environment shapes which possibilities are expressed.',
    '"Heritability of 50% means 50% of any individual\'s trait is from genes" — wrong. Heritability refers to *variation in a population*, not the proportion of any single person\'s trait.',
    '"We only use 10% of our brain" — myth. Brain imaging shows all regions are active at various times; no large region is "unused."',
    '"Right brain is creative, left brain is logical" — pop-psychology oversimplification. Both hemispheres are involved in most tasks; specialization is real but modest.',
    '"Action potential strength varies with stimulus intensity" — wrong. All-or-none. Intensity is encoded by frequency.',
    '"Neurotransmitters affect the entire brain at once" — wrong. They act at specific synapses, often in specific brain circuits.',
    '"Hormones and neurotransmitters are completely different chemicals" — overlap is significant. Norepinephrine, dopamine, and others can act as both.',
    '"Dreams reveal hidden wishes" — Freud\'s claim; not supported by modern evidence. Dreams likely serve multiple functions including memory consolidation.',
    '"You can catch up on sleep on weekends" — partial, but chronic sleep debt has lasting effects on cognition and health that weekend recovery doesn\'t fully reverse.',
    '"Alcohol is a stimulant" — wrong. It\'s a depressant. The early disinhibition feels stimulating but the underlying mechanism is enhanced GABA (inhibition) plus reduced glutamate.',
  ],
};
