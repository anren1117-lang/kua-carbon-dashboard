// AP Statistics Unit 3 — Collecting Data (12-15%)

export const APSTATS_UNIT_3 = {
  number: 3,
  title: 'Collecting Data',
  weight: '12-15%',
  subunits: [
    {
      code: '3.1',
      title: 'Introducing statistics — do the data we collected tell the truth?',
      content:
`Two main study types:

**Observational studies.** Just observe; no intervention. Can show association, NOT causation.
- Surveys.
- Examining medical records.
- Tracking animals in the wild.

**Experiments.** Researcher intervenes by applying treatments to subjects. Can show causation.

**Key questions about data:**
- Was the sample randomly selected? (Generalizable?)
- Were subjects randomly assigned to treatments? (Causation?)

| | Random sample? | Random assignment? |
|---|---|---|
| Generalize to population? | ✓ | not needed |
| Cause-and-effect? | not needed | ✓ |
| Both | ✓ | ✓ |

**Sources of bias.**
- **Selection bias**: sample doesn\'t represent population.
- **Nonresponse bias**: people who don\'t respond differ from those who do.
- **Response bias**: people lie or misremember (e.g., reporting weight).
- **Question wording**: leading or confusing questions skew answers.`,
    },
    {
      code: '3.2',
      title: 'Introduction to planning a study',
      content:
`Before collecting data:

**Define the population** — who/what you want to learn about.

**Decide sample size** — bigger = more precise, but cost more.

**Choose data collection method** — survey, experiment, observation, existing data.

**Plan for bias** — random sampling, randomization, blinding.

**Pre-register analysis** — decide what tests you\'ll run before seeing data (avoids p-hacking).

**Pilot study.** Test methods on small sample first to find problems.

**Ethical considerations** (IRB, consent, anonymity).`,
    },
    {
      code: '3.3',
      title: 'Random sampling and data collection',
      content:
`**Random sampling** removes selection bias and allows generalization.

**Simple random sample (SRS).** Every sample of size n has equal chance of being chosen.

**Stratified random sample.** Divide population into strata (subgroups); take SRS from each. Good when you want representation from each subgroup.

**Cluster sample.** Divide population into clusters; randomly select some clusters; sample everyone in chosen clusters. Cheaper than SRS over large area.

**Systematic sample.** Pick every kth element. OK if no pattern, but can be biased.

**Convenience sample.** Take whoever's easy. Highly biased; AVOID.

**Voluntary response sample.** Self-selected (online polls). Heavily biased — strong opinions overrepresented.

**Census.** Survey entire population. Expensive but accurate.

**Multistage sample.** Combination, e.g., stratified by region then cluster sample within each stratum.

**Sample size.** Larger samples → smaller margin of error. Roughly: margin shrinks by factor of 1/√n.`,
    },
    {
      code: '3.4',
      title: 'Potential problems with sampling',
      content:
`Even random samples can be biased.

**Undercoverage.** Some population not represented in sampling frame.
- Phone survey misses people without phones.
- Online survey misses non-internet users.

**Nonresponse bias.** People who don\'t respond differ from those who do.
- Surveys about politics often miss the disengaged.
- Mail-in surveys have low response rates → high bias risk.

**Response bias.** People lie or misremember.
- Underreporting drug use, drinking, weight.
- Overreporting voting, charitable donations.
- Interviewer effects.

**Wording bias.** Question phrasing changes answers.
- "Should the government waste money on welfare?" vs "Should the government help the poor?" — same policy, different responses.

**How to reduce bias:**
- Random sampling.
- High response rates (~70%+).
- Neutral wording.
- Pre-test questions.
- Anonymous responses.
- Trained interviewers.

**Even large samples are biased if poorly drawn.** The 1936 Literary Digest poll had 2.4 million respondents but called Roosevelt wrong because their sample was biased (rich Americans).`,
    },
    {
      code: '3.5',
      title: 'Introduction to experimental design',
      content:
`In **experiments**, researchers assign treatments — providing the basis for causal conclusions.

**Three principles of good experiments:**

**(1) Control.** Compare treatments to control conditions. Without comparison, can\'t separate treatment effect from natural variation.

**(2) Randomization.** Randomly assign subjects to treatments. Balances out confounding variables.

**(3) Replication.** Multiple subjects per treatment. Without replication, can\'t distinguish real effect from chance.

**Key terms:**
- **Treatment**: condition applied (drug, dose, training method).
- **Experimental unit**: smallest entity treatment applied to.
- **Factor**: explanatory variable being manipulated.
- **Level**: specific value of factor (10 mg vs 20 mg).
- **Response variable**: outcome measured.

**Placebo effect.** Even fake treatments cause measurable improvement. Always use placebo control when possible.

**Blinding.**
- **Single-blind**: subjects don\'t know which treatment they got.
- **Double-blind**: neither subjects nor researchers measuring outcome know. Eliminates expectation bias.

**Confounding variables.** Lurking variables that vary with the treatment, making it impossible to separate effects. Randomization helps prevent confounding.`,
    },
    {
      code: '3.6',
      title: 'Selecting an experimental design',
      content:
`**Completely randomized design.** Subjects randomly assigned to treatments. Simplest design.

**Randomized block design.** First group subjects into blocks (similar within block). Then randomly assign treatments WITHIN each block.
- Reduces variability from block characteristic.
- Example: men and women blocks for a drug trial; randomly assign treatment within each.

**Matched pairs design.** Special case of blocking with n=2 per block.
- Two similar subjects matched (e.g., twins, or same person at two times).
- Treatment randomly assigned within pair.
- Eliminates within-pair variability.

**Repeated measures.** Same subject gets all treatments at different times. Powerful but watch for order effects.

**Sample size matters.** More subjects → smaller standard errors → easier to detect real effects.

**Choosing.** Use blocking when you can identify variables likely related to response. Saves degrees of freedom but adds complexity.`,
    },
    {
      code: '3.7',
      title: 'Inference and experiments',
      content:
`Conclusions you can draw depend on study design.

**Observational study with random sample** → can generalize, can\'t prove cause.

**Experiment without random sample** → can prove cause for sample, can\'t generalize.

**Experiment with random sample + random assignment** → can prove cause AND generalize. Best!

**Most real-world studies are imperfect.** Many medical trials use convenience samples (whoever shows up) but random assignment — can show causation in that group but generalization requires care.

**Statistical significance ≠ practical significance.** A real but tiny effect can be statistically significant with huge sample. Always report effect size.

**Replication is the gold standard.** A single study, even well-designed, isn\'t definitive. Replication across labs and populations builds confidence.

**Publication bias.** Positive results are published more than negative ones → published literature overestimates real effects. Pre-registration helps.`,
    },
  ],
  keyConcepts: [
    'Observational study: association only. Experiment: can show causation.',
    'Random sampling enables generalization; random assignment enables causation.',
    'SRS, stratified, cluster, systematic, convenience, voluntary response sampling methods.',
    'Common biases: selection, nonresponse, response, wording.',
    'Three principles of experiments: control, randomization, replication.',
    'Blinding (single, double) prevents expectation bias.',
    'Blocking reduces variability from a known variable.',
    'Matched pairs eliminates within-pair variability.',
    'Confounding variables sabotage causal claims.',
  ],
  formulas: [
    {
      name: 'Sample size and margin of error',
      equation: 'margin of error ∝ 1/√n',
      meaning: 'Quadrupling sample size halves margin of error.',
      example: 'A poll of 400 has margin ±5%; 1600 has margin ±2.5%.',
    },
  ],
  practice: [
    {
      q: 'A study finds people who drink coffee live longer. Can you conclude coffee causes longevity?',
      a: 'No. Observational study → association only. Confounding variables could explain it (e.g., wealth, lifestyle). Would need randomized experiment.',
    },
    {
      q: 'Why is voluntary response sampling biased?',
      a: 'People with strong opinions are more likely to respond. Sample overrepresents extreme views; underrepresents typical opinions.',
    },
    {
      q: 'What\'s the benefit of double-blinding a drug trial?',
      a: 'Neither subjects nor evaluators know treatment assignment, eliminating placebo effect (subject expectation) and evaluator bias (assessor expectation).',
    },
  ],
  pitfalls: [
    '"Bigger sample = more accurate" — only if randomly sampled. Bad samples are bad at any size.',
    '"Experiments don\'t need controls" — they do. Without comparison, can\'t isolate treatment effect.',
    '"Volunteers represent the general population" — almost never. Volunteers are systematically different.',
    '"Statistical significance proves importance" — no. With huge samples, trivial effects can be significant.',
    '"Single studies are reliable" — replication is essential.',
  ],
};
