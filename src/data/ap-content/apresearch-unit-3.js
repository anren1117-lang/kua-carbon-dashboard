// AP Research Unit 3 — Research methods

export const APRESEARCH_UNIT_3 = {
  number: 3,
  title: 'Research Methods',
  weight: 'Year-long course',
  subunits: [
    {
      code: '3.1',
      title: 'Choosing a methodology',
      content:
`Method choice depends on:
- Research question.
- Discipline norms.
- Available data and tools.
- Time and resources.
- Ethical constraints.

**Quantitative methods.**
- Experiments (random assignment to treatment).
- Quasi-experiments (no random assignment).
- Surveys.
- Observational studies.
- Statistical analysis of existing data.

**Qualitative methods.**
- Interviews (structured, semi-structured, unstructured).
- Focus groups.
- Participant observation.
- Ethnography.
- Content/discourse analysis.
- Case studies.

**Mixed methods.** Combine both. Often stronger.

**Document analysis.** Examining texts, images, artifacts.

**Computational methods.** Web scraping, NLP, simulations.

**Historical methods.** Archival research, oral history, primary sources.

**Method ↔ question.**
- "Does X cause Y?" → experimental (gold standard if possible).
- "How prevalent is X?" → survey.
- "What does X mean to people who experience it?" → qualitative.
- "How has X changed over time?" → historical or longitudinal.
- "What patterns emerge in big data?" → computational.

**Pilot study.** Small-scale test before main study.
- Refines instruments.
- Reveals practical issues.
- Estimates effect sizes for power analysis.`,
    },
    {
      code: '3.2',
      title: 'Designing the study',
      content:
`**Operationalization.** Converting abstract concept to measurable variable.
- "Wellbeing" → standardized scale (e.g., PERMA, WEMWBS).
- "Engagement" → time on task, return rate, etc.

**Reliability.** Consistency of measurement.
- Test-retest reliability.
- Inter-rater reliability.
- Internal consistency (Cronbach\'s alpha).

**Validity.** Are you measuring what you intend?
- Construct validity.
- Internal validity (causal claims).
- External validity (generalizability).

**Sampling.**
- **Random sample:** every member of population equally likely. Strongest.
- **Stratified random:** ensures subgroup representation.
- **Convenience sample:** easiest to access. Limited generalizability.
- **Snowball sample:** participants recruit others. Useful for hard-to-reach.
- **Purposive sample:** select for specific characteristics.

**Sample size.**
- Statistical power analysis for quantitative.
- Saturation for qualitative (no new themes emerging).

**Control groups and randomization.**
- Random assignment controls for confounders.
- Quasi-experiments use other strategies.

**Ethics.**
- **IRB/Ethics review.** Required for research with human subjects.
- **Informed consent.**
- **Privacy and confidentiality.**
- **Beneficence and non-maleficence.**
- **Justice in participant selection.**

**For AP Research.** School/teacher has IRB-like review for student research.

**Special populations.** Children, vulnerable groups need extra protections.

**Data management plan.**
- How collected?
- Where stored?
- Who has access?
- How long retained?
- How destroyed?

**Pre-registration (increasingly standard).** Lock down hypothesis and methods before collecting data. Reduces fishing.`,
    },
  ],
  keyConcepts: [
    'Quantitative: experiments, surveys, statistical analysis.',
    'Qualitative: interviews, observation, content analysis.',
    'Mixed methods often strongest.',
    'Pilot study before main.',
    'Operationalize abstract concepts.',
    'Reliability + validity essential.',
    'Sampling: random > convenience.',
    'Sample size: statistical power or saturation.',
    'Ethics: IRB, informed consent, privacy.',
    'Pre-registration reduces p-hacking.',
  ],
  practice: [
    { q: 'Question: "What stresses high schoolers?" Method?',
      a: 'Mixed: survey for quantitative breadth (rate stressors); interviews for qualitative depth (why those stressors). Use student-validated stress scale; semi-structured interviews.' },
  ],
  pitfalls: [
    '"More data = better" — quality matters more.',
  ],
};
