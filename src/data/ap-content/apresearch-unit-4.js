// AP Research Unit 4 — Analysis and findings

export const APRESEARCH_UNIT_4 = {
  number: 4,
  title: 'Analysis and Findings',
  weight: 'Year-long course',
  subunits: [
    {
      code: '4.1',
      title: 'Quantitative analysis',
      content:
`Match analysis to data type and question.

**Descriptive statistics.**
- Means, medians, modes.
- Standard deviation, variance.
- Range, IQR.
- Distributions (normal? skewed?).

**Visualization.**
- Histograms, box plots (single variable).
- Scatter plots, line graphs (two variables).
- Bar charts (categorical).
- Heatmaps, network diagrams (complex).
- One main idea per chart.
- Label axes.

**Inferential statistics.**

**t-test.** Compare two group means.

**ANOVA.** Compare 3+ group means.

**Chi-square.** Test independence of categorical variables.

**Correlation.** Strength and direction of linear relationship.
- Pearson r: −1 to +1.
- r > 0.5 strong; |r| < 0.3 weak (rough rule).
- Correlation ≠ causation.

**Regression.** Predict dependent from independent variable(s).
- Linear, multiple linear, logistic, etc.
- R² = proportion of variance explained.

**Statistical significance.**
- p-value.
- α (alpha) typically 0.05.
- p < 0.05 = "statistically significant" — but doesn\'t mean important.

**Effect size.** Magnitude of effect.
- Cohen\'s d (for differences in means).
- Pearson r (for correlation).
- Often more important than p-value.

**Confidence intervals.** Range likely containing true value.
- More informative than just p-value.

**Multiple comparisons.** Many tests = some false positives.
- Bonferroni correction.
- FDR (false discovery rate).

**Reporting standards.**
- Effect size.
- CI.
- Sample size.
- All tests run (not just significant ones).

**Software.**
- Excel for basic.
- R, Python, SPSS, Stata for serious analysis.
- Free options widely available.`,
    },
    {
      code: '4.2',
      title: 'Qualitative analysis',
      content:
`**Coding.** Tagging data with thematic labels.

**Open coding.** First pass; assign codes liberally.

**Axial coding.** Relate codes to each other.

**Selective coding.** Identify core categories.

**Memos.** Notes about emerging patterns.

**Software.**
- NVivo, Atlas.ti (commercial).
- MAXQDA.
- Dedoose.
- Or just spreadsheets.

**Approaches.**

**Thematic analysis.** Identify recurring themes.

**Grounded theory.** Build theory from data inductively.

**Discourse analysis.** Examine language use.

**Narrative analysis.** Story structures.

**Phenomenology.** Lived experience.

**Content analysis.** Systematic categorization.

**Reliability.**
- Multiple coders.
- Inter-rater reliability.
- Discuss disagreements.

**Validity.**
- Triangulation: multiple sources/methods.
- Member checking: ask participants if interpretations match.
- Reflexivity: examine your own role.

**Reporting.**
- Quotes from participants.
- Pseudonyms for confidentiality.
- Audit trail.

**Mixed methods integration.**
- Concurrent: collect both at once.
- Sequential: one informs other.
- Triangulation: see if findings converge.

**Common analytical errors.**
- Selecting confirmatory data only.
- Over-generalizing from few cases.
- Confusing description with explanation.
- Missing important context.
- Ignoring outliers without examining them.`,
    },
  ],
  keyConcepts: [
    'Descriptive stats: mean, median, SD, distribution.',
    'Visualization: one main idea per chart; label axes.',
    'Inferential: t-test, ANOVA, chi-square, correlation, regression.',
    'p < 0.05 ≠ important. Effect size + CI more informative.',
    'Multiple comparisons: correct for them.',
    'Qualitative coding: open → axial → selective.',
    'Software: NVivo, R, Python, etc.',
    'Reliability + validity (triangulation, member checking).',
    'Mixed methods integration.',
  ],
  practice: [
    { q: 'r = 0.4 between hours of sleep and grades. Interpretation?',
      a: 'Moderate positive linear correlation. R² = 0.16 — sleep explains 16% of grade variance. Correlation ≠ causation; could be confounded.' },
  ],
  pitfalls: [
    '"Statistical significance = important" — separate questions.',
  ],
};
