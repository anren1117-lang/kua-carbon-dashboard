// AP Statistics Unit 6 — Inference for Categorical Data: Proportions (12-15%)

export const APSTATS_UNIT_6 = {
  number: 6,
  title: 'Inference for Categorical Data: Proportions',
  weight: '12-15%',
  subunits: [
    {
      code: '6.1',
      title: 'Introduction to confidence intervals',
      content:
`A **confidence interval (CI)** is a range of plausible values for a parameter.

**Format:** estimate ± margin of error.

**Confidence level (C%).** Long-run percentage of CIs (constructed from many samples) that contain the true parameter.
- 95% CI: 95% of intervals (from many samples) capture the true parameter.
- Doesn\'t mean "95% chance the parameter is in this specific interval".

**Why CIs?** Single point estimates don\'t convey uncertainty. CIs do.

**Tradeoff.**
- Higher confidence → wider interval.
- Larger sample → narrower interval (more precise).
- Smaller variability → narrower interval.`,
    },
    {
      code: '6.2',
      title: 'Confidence interval for a single proportion',
      content:
`**Formula:**
p̂ ± z* · √(p̂(1-p̂)/n)

- p̂ = sample proportion.
- z* = critical value (1.96 for 95%, 1.645 for 90%, 2.576 for 99%).
- √(p̂(1-p̂)/n) = standard error.

**Conditions (One-Proportion z-Interval):**
- **Random sample.**
- **10% condition**: sample ≤ 10% of population.
- **Large counts**: np̂ ≥ 10 AND n(1-p̂) ≥ 10.

**Worked example.** Poll of 1000 voters: 540 support candidate.
- p̂ = 540/1000 = 0.54.
- 95% CI: 0.54 ± 1.96 × √(0.54 × 0.46 / 1000) = 0.54 ± 1.96 × 0.01577 = 0.54 ± 0.031 = (0.509, 0.571).
- Conclude: "We are 95% confident the true support is between 50.9% and 57.1%."

**Common confidence levels.**
| Confidence | z* |
|---|---|
| 90% | 1.645 |
| 95% | 1.96 |
| 99% | 2.576 |

**Margin of error.**
ME = z* × √(p̂(1-p̂)/n).

To halve the margin, quadruple sample size.`,
    },
    {
      code: '6.3',
      title: 'Justifying a claim — single proportion',
      content:
`Use a CI to determine if a claim is plausible.

**Process:**
1. Construct the CI.
2. If the claimed value is INSIDE the CI, it\'s plausible.
3. If OUTSIDE, the data contradict the claim.

**Worked example.** A company claims 60% of customers are satisfied. Survey of 200 finds 102 satisfied (51%).
- 95% CI: 0.51 ± 1.96 × √(0.51 × 0.49 / 200) = 0.51 ± 0.069 = (0.441, 0.579).
- 60% is NOT in (0.441, 0.579) → data contradict claim.
- Could also use significance test (next subunit).`,
    },
    {
      code: '6.4',
      title: 'Setting up a test for a single proportion',
      content:
`**Hypothesis test framework.**

**Null hypothesis (H₀).** Default; no effect, no change, status quo.
H₀: p = p₀ (specific value).

**Alternative hypothesis (Hₐ).** What we suspect.
Three forms:
- Hₐ: p ≠ p₀ (two-sided).
- Hₐ: p > p₀ (one-sided right).
- Hₐ: p < p₀ (one-sided left).

**Conditions** (same as CI): Random, 10%, np₀ ≥ 10 and n(1-p₀) ≥ 10. (Use p₀ from H₀, not p̂.)

**Test statistic (z):**
z = (p̂ - p₀) / √(p₀(1-p₀)/n)

**P-value.** Probability of getting a test statistic as extreme as observed, IF H₀ is true.
- Two-sided: P(|Z| ≥ |z|) = 2 × P(Z > |z|).
- One-sided right: P(Z > z).
- One-sided left: P(Z < z).

**Decision.**
- If P-value ≤ α (significance level, usually 0.05): REJECT H₀.
- If P-value > α: FAIL TO REJECT H₀ (NOT same as "accept H₀").`,
    },
    {
      code: '6.5',
      title: 'Carrying out a test for a single proportion',
      content:
`**Steps for any test:**

1. **State** hypotheses (in symbols + context).
2. **Plan** — check conditions; identify test (one-prop z).
3. **Do** — compute test statistic and p-value.
4. **Conclude** — interpret in context.

**Worked example.** Manufacturer claims 80% reliability. We test 100 units; 72 work.
- H₀: p = 0.80. Hₐ: p < 0.80 (suspect lower).
- Conditions: random (assumed), 10% (probably OK), np₀ = 80 ≥ 10 ✓, n(1-p₀) = 20 ≥ 10 ✓.
- z = (0.72 - 0.80) / √(0.80 × 0.20 / 100) = -0.08 / 0.04 = -2.
- p-value = P(Z < -2) = 0.0228.
- Since 0.0228 < 0.05, REJECT H₀. Conclude evidence that reliability is below 80%.

**Type I and Type II errors.**
- **Type I**: reject H₀ when it\'s true (false alarm). Probability = α.
- **Type II**: fail to reject H₀ when it\'s false (missed effect). Probability = β.
- **Power** = 1 - β. Probability of correctly rejecting false H₀.

**Trade-off.** Smaller α (e.g., 0.01) reduces Type I but increases Type II. Pick based on consequences.`,
    },
    {
      code: '6.6',
      title: 'Confidence interval for difference of two proportions',
      content:
`**Formula:**
(p̂₁ - p̂₂) ± z* × √(p̂₁(1-p̂₁)/n₁ + p̂₂(1-p̂₂)/n₂)

**Conditions:** random samples (independent), 10% each, large counts (np̂ ≥ 10 and n(1-p̂) ≥ 10) for each.

**Worked example.** 60% of treatment group recovered (n=200); 50% of control recovered (n=200).
- p̂₁ - p̂₂ = 0.10.
- SE = √(0.6 × 0.4/200 + 0.5 × 0.5/200) = √(0.0012 + 0.00125) = 0.0495.
- 95% CI: 0.10 ± 1.96 × 0.0495 = (0.003, 0.197).
- Interval doesn\'t include 0 → evidence treatment is more effective.`,
    },
    {
      code: '6.7',
      title: 'Justifying a claim about difference of proportions',
      content:
`Use the two-proportion z-test to compare.

**H₀: p₁ = p₂ (or p₁ - p₂ = 0). Hₐ: differences.**

**Pooled proportion** (since H₀ says they\'re equal):
p̂_c = (x₁ + x₂)/(n₁ + n₂).

**Test statistic:**
z = (p̂₁ - p̂₂) / √(p̂_c(1-p̂_c)(1/n₁ + 1/n₂))

**Worked example.** Above: 120/200 vs 100/200.
- p̂_c = 220/400 = 0.55.
- SE = √(0.55 × 0.45 × (1/200 + 1/200)) = √(0.2475 × 0.01) = 0.0497.
- z = 0.10/0.0497 = 2.01.
- Two-sided p = 2 × P(Z > 2.01) = 0.044.
- Since 0.044 < 0.05, REJECT H₀. Treatment effect is statistically significant.`,
    },
  ],
  keyConcepts: [
    'CI = point estimate ± margin of error. ME = z* × SE.',
    'Confidence level is long-run capture rate.',
    'For one proportion: SE = √(p̂(1-p̂)/n).',
    'Conditions for proportion inference: random, 10%, large counts (np≥10, n(1-p)≥10).',
    'Hypothesis test steps: state H₀/Hₐ, check conditions, compute z and p, decide.',
    'Type I (reject true H₀, α) vs Type II (fail to reject false H₀, β).',
    'Power = 1 - β.',
    'Use pooled p̂_c when H₀: p₁ = p₂.',
  ],
  formulas: [
    {
      name: 'One-proportion CI',
      equation: 'p̂ ± z* √(p̂(1-p̂)/n)',
      meaning: 'Confidence interval for population proportion.',
      example: '540/1000 → 95% CI: 0.54 ± 0.031 = (50.9%, 57.1%).',
    },
    {
      name: 'One-proportion test',
      equation: 'z = (p̂ - p₀) / √(p₀(1-p₀)/n)',
      meaning: 'Standardize observed proportion against null value.',
      example: 'p̂ = 0.72, p₀ = 0.80, n = 100: z = -2, p = 0.023.',
    },
  ],
  practice: [
    {
      q: 'Poll of 500: 280 support proposal. 95% CI for true support?',
      a: 'p̂ = 0.56. SE = √(0.56·0.44/500) = 0.0222. ME = 1.96·0.0222 = 0.0435. CI: (0.517, 0.604).',
    },
    {
      q: 'Why is the formula different for the test statistic vs the CI for a proportion?',
      a: 'CI uses p̂ (don\'t know true p). Test uses p₀ (the hypothesized value from H₀). Standard error differs accordingly.',
    },
  ],
  pitfalls: [
    '"95% CI means 95% chance true value is in this interval" — wrong. The parameter is fixed; the interval is random. Means 95% of such intervals would contain it.',
    '"Failing to reject H₀ proves H₀" — wrong. Just means not enough evidence to reject.',
    '"Small p-value proves Hₐ" — supports but doesn\'t prove.',
    '"Statistical significance = practical significance" — different. Tiny effects with huge n can be significant.',
  ],
};
