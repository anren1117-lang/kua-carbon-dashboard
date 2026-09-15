// AP Statistics Unit 5 — Sampling Distributions (7-12%)

export const APSTATS_UNIT_5 = {
  number: 5,
  title: 'Sampling Distributions',
  weight: '7-12%',
  subunits: [
    {
      code: '5.1',
      title: 'Introduction to sampling distributions',
      content:
`A **sampling distribution** is the distribution of a statistic across all possible samples of a given size from the same population.

**Three distributions to keep straight:**
1. **Population distribution**: distribution of variable in the whole population.
2. **Sample distribution**: distribution of values in one specific sample.
3. **Sampling distribution**: distribution of the statistic (mean, proportion) across many samples.

**Why this matters.** Each sample gives a slightly different statistic. The sampling distribution tells us how variable our estimates are — the basis for inference.

**Example.** Population of all SAT scores has mean μ = 1050. We sample 100 students. Their sample mean x̄ might be 1042 or 1063 — varies sample to sample. The sampling distribution of x̄ describes how x̄ varies across all possible samples of n = 100.`,
    },
    {
      code: '5.2',
      title: 'Sampling distribution of sample proportion',
      content:
`When we sample and compute proportion p̂ (sample proportion), the sampling distribution of p̂ has:

- **Mean**: μ_p̂ = p (the true population proportion).
- **Standard deviation**: σ_p̂ = √(p(1-p)/n).
- **Shape**: approximately normal IF np ≥ 10 AND n(1-p) ≥ 10.

**Conditions:**
- Random sample.
- 10% rule: sample size ≤ 10% of population (so trials approximately independent).
- Large counts: np ≥ 10 AND n(1-p) ≥ 10.

**Worked example.** 30% of voters support a candidate. We poll 500. What\'s the distribution of p̂?
- μ_p̂ = 0.30.
- σ_p̂ = √(0.3 × 0.7 / 500) = 0.0205.
- np = 150 ≥ 10 ✓; n(1-p) = 350 ≥ 10 ✓. Normal approximation valid.
- 95% of polls will give p̂ between 0.30 ± 2(0.0205) = 0.26 to 0.34.`,
    },
    {
      code: '5.3',
      title: 'Sampling distribution of difference in sample proportions',
      content:
`For two independent samples with proportions p̂₁ and p̂₂:

- **Mean**: μ = p₁ - p₂.
- **SD**: σ = √[p₁(1-p₁)/n₁ + p₂(1-p₂)/n₂].
- **Shape**: approximately normal if conditions met for each sample.

**Conditions** (for each sample): random, 10% rule, np ≥ 10 and n(1-p) ≥ 10.

**Worked example.** 40% of men support a policy; 50% of women do. Sample 200 men and 250 women.
- μ = 0.40 - 0.50 = -0.10.
- σ = √[0.4(0.6)/200 + 0.5(0.5)/250] = √(0.0012 + 0.001) = √0.0022 = 0.047.
- Normal.`,
    },
    {
      code: '5.4',
      title: 'Sampling distribution of sample mean',
      content:
`When we sample and compute mean x̄, the sampling distribution has:

- **Mean**: μ_x̄ = μ (true population mean).
- **SD**: σ_x̄ = σ/√n (gets smaller with larger n).
- **Shape**:
  - If population is normal, x̄ is normal for ANY n.
  - **Central Limit Theorem**: for ANY population, x̄ approaches normal as n grows. Rule of thumb: n ≥ 30 sufficient for most populations.

**Why σ/√n?** Larger samples are more reliable. Averaging reduces variability.

**Worked example.** Heights of adults have μ = 170, σ = 10 cm. Sample 100 adults.
- μ_x̄ = 170.
- σ_x̄ = 10/√100 = 1.0.
- 95% of samples have x̄ within 170 ± 2 = 168 to 172.

Notice: individual heights vary widely (σ = 10), but mean of 100 is very precise (SE = 1).`,
    },
    {
      code: '5.5',
      title: 'Sampling distribution of difference in sample means',
      content:
`For two independent samples with means x̄₁ and x̄₂:

- **Mean**: μ_{x̄₁-x̄₂} = μ₁ - μ₂.
- **SD**: σ = √(σ₁²/n₁ + σ₂²/n₂).
- **Shape**: normal if both populations normal OR both n ≥ 30.

**Worked example.** Compare exam scores: μ₁ = 75, σ₁ = 8, n₁ = 40. μ₂ = 78, σ₂ = 6, n₂ = 50.
- μ_{x̄₁-x̄₂} = 75 - 78 = -3.
- σ = √(64/40 + 36/50) = √(1.6 + 0.72) = √2.32 = 1.52.
- z = (-3 - 0)/1.52 = -1.97. About 2.5% chance of seeing this if true difference is 0.`,
    },
    {
      code: '5.6',
      title: 'Central Limit Theorem',
      content:
`**Central Limit Theorem (CLT).** Sampling distribution of the mean approaches normal as sample size grows, regardless of population shape.

**Statement.** For independent samples of size n from a population with mean μ and SD σ:
- Sampling distribution of x̄ has mean μ.
- Has SD σ/√n.
- Becomes approximately normal as n increases.

**How large is "large enough"?**
- Normal population: any n.
- Approximately symmetric population: n ~ 15-20.
- Strongly skewed population: n ~ 40+.
- For proportions: np ≥ 10 AND n(1-p) ≥ 10.

**Why CLT matters.** It justifies using normal distributions for inference about means, even when the underlying population isn\'t normal. Foundation of nearly all classical statistics.

**Practical implication.** Polling agencies sample ~1,000 people and report results "within ±3% margin of error". The CLT explains why this works.

**Demonstration.** Roll one die: distribution is uniform (each value 1-6 has prob 1/6). Roll 30 dice and take mean: distribution is approximately normal even though individual rolls are uniform.`,
    },
    {
      code: '5.7',
      title: 'Biased and unbiased point estimates',
      content:
`A **point estimate** is a single value used to estimate a parameter.

**Unbiased estimator.** Expected value of the estimator equals the parameter.
- Sample mean x̄ is unbiased estimator of μ.
- Sample proportion p̂ is unbiased estimator of p.

**Biased estimator.** Systematically over- or underestimates.
- Sample range usually underestimates population range (especially with small n).
- Sample variance with /n (instead of /(n-1)) is biased — that\'s why we use n-1 (Bessel\'s correction).

**Bias vs variability.**
- **Bias**: systematic error. Like a scale that always reads 5 lb high.
- **Variability**: random scatter. Like a noisy measurement.
- Good estimator: low bias AND low variability.

**Estimator efficiency.** Among unbiased estimators, the one with smaller variance is more efficient.

**Mean Squared Error (MSE).** Total error = bias² + variance. Used to compare estimators.`,
    },
  ],
  keyConcepts: [
    'Sampling distribution is the distribution of a statistic across all samples.',
    'Sample proportion p̂: μ = p, σ = √(p(1-p)/n).',
    'Sample mean x̄: μ = μ, σ = σ/√n.',
    'Central Limit Theorem: x̄ approaches normal as n grows, regardless of population shape.',
    'Use n ≥ 30 as rule of thumb for CLT.',
    'For proportions: np ≥ 10 AND n(1-p) ≥ 10.',
    'Sample mean and sample proportion are unbiased estimators.',
    'Bias-variance trade-off applies to estimators.',
  ],
  formulas: [
    {
      name: 'SE of mean and proportion',
      equation: 'SE_x̄ = σ/√n;  SE_p̂ = √(p(1-p)/n)',
      meaning: 'Standard error decreases as 1/√n. Quadrupling n halves SE.',
      example: 'Poll of 400 has SE √(0.5·0.5/400) = 0.025; poll of 1600 has SE 0.0125.',
    },
  ],
  practice: [
    {
      q: 'Heights have μ = 170 cm, σ = 10 cm. Sample size n = 100. Distribution of x̄?',
      a: 'Mean = 170, SE = 10/√100 = 1. Approximately normal (n ≥ 30). 95% of samples have x̄ in 168-172.',
    },
    {
      q: 'Why is the sampling distribution of x̄ less variable than individual measurements?',
      a: 'Averaging reduces noise. Individual extreme values are diluted in the mean. SE = σ/√n is smaller than σ.',
    },
    {
      q: '15% of adults are vegetarian. Random sample of 400. Find P(p̂ > 0.18).',
      a: 'μ_p̂ = 0.15. σ = √(0.15 × 0.85 / 400) = 0.0179. z = (0.18-0.15)/0.0179 = 1.68. P(z > 1.68) ≈ 0.047 ≈ 4.7%.',
    },
  ],
  pitfalls: [
    '"Sample distribution = sampling distribution" — different! Sample distribution is values in one sample; sampling distribution is of statistics across many samples.',
    '"Sample mean has same SD as population" — no, σ/√n much smaller.',
    '"CLT requires population to be normal" — opposite! CLT works for ANY population shape with large enough n.',
    '"Bigger sample fixes biased sampling" — no. Bias is from method, not size.',
  ],
};
