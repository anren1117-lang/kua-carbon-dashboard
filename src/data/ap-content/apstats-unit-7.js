// AP Statistics Unit 7 — Inference for Quantitative Data: Means (10-18%)

export const APSTATS_UNIT_7 = {
  number: 7,
  title: 'Inference for Quantitative Data: Means',
  weight: '10-18%',
  subunits: [
    {
      code: '7.1',
      title: 'Introduction to inference for one mean',
      content:
`When inference is about a population mean μ instead of a proportion, we use the **t-distribution** because σ is unknown.

**Why t instead of z?** When we estimate σ with sample SD s, we introduce extra uncertainty. The t-distribution accounts for this. Resembles standard normal but with heavier tails. Approaches normal as df increases.

**Degrees of freedom (df).** df = n - 1 for one-sample t.

**t-table.** Different rows for df, different columns for confidence levels or tail areas. Use calculator or table.`,
    },
    {
      code: '7.2',
      title: 'Confidence interval for a single mean',
      content:
`**One-sample t-interval:**
x̄ ± t* × (s/√n)

- x̄ = sample mean.
- s = sample SD.
- t* = critical value with df = n - 1.

**Conditions:**
- **Random sample.**
- **10% rule.**
- **Normality of x̄**:
  - Population normal: any n.
  - Approximately symmetric: n ≥ 15.
  - Strongly skewed: n ≥ 40.

Check normality with histogram or boxplot of sample.

**Worked example.** Random sample of 30 students; mean test score 78, sample SD 8.
- df = 29; t* for 95% ≈ 2.045.
- 95% CI: 78 ± 2.045 × (8/√30) = 78 ± 2.99 = (75.01, 80.99).
- Conclude: "We are 95% confident the true mean test score is between 75.0 and 81.0."`,
    },
    {
      code: '7.3',
      title: 'Justifying a claim about a single mean',
      content:
`Use CI to test claims (or use hypothesis test).

**Worked example.** Manufacturer claims average bag weight is 16 oz. Sample of 25 bags: mean 15.7, s = 0.8.
- 95% CI: 15.7 ± 2.064 × (0.8/√25) = 15.7 ± 0.33 = (15.37, 16.03).
- 16 is inside the CI → claim is consistent with data. Cannot reject claim.

Or via hypothesis test:
- H₀: μ = 16. Hₐ: μ ≠ 16.
- t = (15.7 - 16)/(0.8/√25) = -0.3/0.16 = -1.875.
- df = 24. Two-sided p = 2 × P(T < -1.875) ≈ 0.073.
- Since 0.073 > 0.05, fail to reject H₀. Consistent with claim.`,
    },
    {
      code: '7.4',
      title: 'Setting up a test for a single mean',
      content:
`**One-sample t-test setup:**
- **H₀**: μ = μ₀ (specific value).
- **Hₐ**: μ ≠ μ₀ (two-sided), μ > μ₀, or μ < μ₀.

**Conditions:** Random, 10%, normality.

**Test statistic:**
t = (x̄ - μ₀) / (s/√n)
df = n - 1.

**p-value** from t-distribution.

**Steps** same as proportion test: state, plan, do, conclude.`,
    },
    {
      code: '7.5',
      title: 'Carrying out a test for a single mean',
      content:
`**Worked example.** A coffee shop claims avg fill time is 30 sec. We time 40 orders: mean 32.5, s = 6.

State: H₀: μ = 30. Hₐ: μ > 30 (suspect slower).
Plan: One-sample t-test. n = 40 → df = 39. Random (assumed). 10% OK. n ≥ 30 → CLT.
Do: t = (32.5 - 30)/(6/√40) = 2.5/0.949 = 2.635. One-sided p = P(T > 2.635, df=39) ≈ 0.006.
Conclude: Since 0.006 < 0.05, reject H₀. Strong evidence the true mean fill time exceeds 30 seconds.

**Always interpret in context.** Not just "reject H₀" — "we have strong evidence the manufacturer\'s claim of 30-second fill time is wrong."

**Two-tailed vs one-tailed.** Choose based on the question, not the data. Pre-specify direction or use two-tailed by default.`,
    },
    {
      code: '7.6',
      title: 'Confidence interval for difference of two means',
      content:
`**Two-sample t-interval:**
(x̄₁ - x̄₂) ± t* × √(s₁²/n₁ + s₂²/n₂)

- df: complicated (Welch\'s formula). Calculator handles it. Conservative: smaller(n₁, n₂) - 1.

**Conditions:** Random samples (independent), 10% rule for each, normality for each.

**Worked example.** Test scores: Group A (n=25): mean 78, s = 8. Group B (n=30): mean 75, s = 7.
- Difference: 3. SE = √(64/25 + 49/30) = √(2.56 + 1.633) = √4.193 = 2.048.
- t* for df ≈ 24 (conservative): 2.064.
- 95% CI: 3 ± 4.23 = (-1.23, 7.23).
- 0 in interval → no strong evidence of difference.`,
    },
    {
      code: '7.7',
      title: 'Justifying a claim about difference of means',
      content:
`Two-sample t-test for comparing two independent groups.

**H₀**: μ₁ = μ₂ (or μ₁ - μ₂ = 0). **Hₐ**: μ₁ ≠ μ₂ (or one-sided).

**Test statistic:**
t = (x̄₁ - x̄₂) / √(s₁²/n₁ + s₂²/n₂)

**Worked example (continued).** Above: t = 3/2.048 = 1.465. df conservative = 24. Two-sided p = 2 × P(T > 1.465) ≈ 0.156. p > 0.05 → fail to reject.

**Matched pairs t-test.** When data is paired (same subject before/after; twins; siblings), reduce to one-sample t-test on differences.
- Compute d_i = before - after (or after - before).
- d̄ = mean of differences; s_d = SD of differences.
- t = d̄ / (s_d/√n), df = n - 1.

**Worked example.** Test pre/post training scores for 10 subjects.
Differences: 5, 8, 3, -1, 6, 4, 7, 2, 5, 6. d̄ = 4.5, s_d = 2.84.
t = 4.5/(2.84/√10) = 4.5/0.898 = 5.01. df = 9. p < 0.001. Strong evidence training improved scores.`,
    },
  ],
  keyConcepts: [
    't-distribution used when σ unknown (always in practice).',
    'df = n - 1 for one-sample t; complex for two-sample.',
    'One-sample t-interval: x̄ ± t* × s/√n.',
    'Conditions: random, 10%, normality of x̄ (CLT for n ≥ 30).',
    'One-sample t-test: t = (x̄ - μ₀)/(s/√n).',
    'Two-sample t: compares two independent group means.',
    'Matched pairs reduces to one-sample t on differences.',
    'Compare interval contains 0 for difference tests.',
  ],
  formulas: [
    {
      name: 'One-sample t',
      equation: 't = (x̄ - μ₀)/(s/√n);  df = n - 1',
      meaning: 'Test statistic for single mean when σ unknown.',
      example: 'x̄ = 32.5, μ₀ = 30, s = 6, n = 40: t = 2.635, p = 0.006.',
    },
    {
      name: 'Matched pairs t',
      equation: 't = d̄/(s_d/√n);  df = n - 1',
      meaning: 'Reduces paired data to one-sample t on differences.',
      example: 'Pre/post scores; if d̄ > 0 strongly, training works.',
    },
  ],
  practice: [
    {
      q: 'A sample of 25 batteries lasts mean 22 hours, s = 4 hours. 95% CI for true mean?',
      a: 'df = 24, t* = 2.064. ME = 2.064 × 4/√25 = 1.65. CI: 22 ± 1.65 = (20.35, 23.65) hours.',
    },
    {
      q: 'A medical test claims to take avg 5 min. You measure 16 trials: mean 5.8, s = 2. Test at 5% level.',
      a: 'H₀: μ = 5. Hₐ: μ ≠ 5. t = (5.8-5)/(2/√16) = 1.6. df = 15. Two-sided p ≈ 0.13. Fail to reject H₀ (not enough evidence).',
    },
  ],
  pitfalls: [
    '"Use z-test if n is large" — use t-test always (since σ unknown). t approaches z as n grows.',
    '"Two-sample t requires equal variances" — Welch\'s correction handles unequal variances.',
    '"Treat paired data as two samples" — wrong. Pairing exploits within-pair correlation; matched pairs t is much more powerful.',
    '"t-test requires normal population" — robust to mild violations with large n (CLT).',
  ],
};
