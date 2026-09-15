// AP Statistics Unit 9 — Inference for Quantitative Data: Slopes (2-5%)

export const APSTATS_UNIT_9 = {
  number: 9,
  title: 'Inference for Quantitative Data: Slopes',
  weight: '2-5%',
  subunits: [
    {
      code: '9.1',
      title: 'Introduction to regression inference',
      content:
`We now infer about the **true population slope** β of the regression line, using our sample slope b.

**Model.** For each value of x, there\'s a true mean response μ_y|x. The model assumes:
μ_y|x = α + βx (true regression line; unknown α, β)
Individual observations vary around this with normal error of constant SD σ.

**LINER conditions** for regression inference:
- **L**inear: true relationship is linear.
- **I**ndependent: observations are independent.
- **N**ormal: residuals approximately normal.
- **E**qual SD: variance of residuals constant across x.
- **R**andom: data from a random sample or experiment.

Check with scatter plot, residual plot, histogram of residuals.`,
    },
    {
      code: '9.2',
      title: 'Confidence interval for a slope',
      content:
`**Sampling distribution of slope b:**
- Mean: β (the true slope).
- SE: SE(b) = s / [s_x √(n-1)] where s is the standard error of residuals.
- Approximately t-distributed with df = n - 2.

**CI for slope:**
b ± t* × SE(b)

**df = n - 2** (lost two: slope and intercept).

**Worked example.** Linear regression on n=25 (hours studied, exam score). Output:
- b = 8.3 (slope).
- SE(b) = 1.5.
- df = 23. t* for 95% ≈ 2.069.
- 95% CI for slope: 8.3 ± 2.069 × 1.5 = 8.3 ± 3.10 = (5.20, 11.40) points per hour.
- Interpret: "We are 95% confident the true increase in exam score is between 5.2 and 11.4 points per additional hour studied."

**Why this matters.** Tells you not just the best estimate of slope but the range of plausible values.`,
    },
    {
      code: '9.3',
      title: 'Test for a slope',
      content:
`**Hypothesis test for slope:**

**H₀**: β = 0 (no linear relationship).
**Hₐ**: β ≠ 0 (or one-sided: β > 0 or β < 0).

**Test statistic:**
t = b / SE(b), df = n - 2.

**Significance** indicates linear relationship exists. Doesn\'t prove causation (need experimental design).

**Worked example (continued).**
- b = 8.3, SE(b) = 1.5.
- t = 8.3 / 1.5 = 5.53. df = 23. Two-sided p < 0.001.
- Strong evidence of linear relationship between hours studied and exam score.

**Common AP question.** Given regression output (Minitab, R, etc.), find b, SE(b), t, p; interpret.

**Computer output example:**

    Predictor  Coef    SE       t     P
    Constant   42.5   5.2       8.2   0.000
    Hours       8.3   1.5       5.5   0.000

    s = 6.2  R-Sq = 0.71  R-Sq(adj) = 0.69

- Intercept: 42.5 (predicted score at 0 hours).
- Slope: 8.3 (predicted score increase per hour).
- s = 6.2 (standard error of residuals — typical prediction error).
- R² = 0.71 (71% of variability explained by hours studied).`,
    },
  ],
  keyConcepts: [
    'Linear regression inference assumes LINER: Linear, Independent, Normal residuals, Equal SD, Random sample.',
    'Slope b is sample statistic; β is population parameter.',
    'CI: b ± t* × SE(b); df = n - 2.',
    'Test: t = b / SE(b); df = n - 2.',
    'H₀: β = 0 means no linear relationship.',
    'Significant slope ≠ causation (need experimental design).',
    'Computer output: read coefficients, SE, t, p, R², s (SE of residuals).',
  ],
  formulas: [
    {
      name: 'Slope test',
      equation: 't = b / SE(b);  df = n - 2',
      meaning: 'Test whether population slope is 0.',
      example: 'b = 8.3, SE(b) = 1.5: t = 5.53, very small p. Reject H₀.',
    },
    {
      name: 'Slope CI',
      equation: 'b ± t* × SE(b)',
      meaning: 'Plausible range for true slope.',
      example: 'b = 8.3, SE = 1.5, n = 25 → 95% CI: (5.20, 11.40).',
    },
  ],
  practice: [
    {
      q: 'Linear regression: slope b = 2.5, SE = 0.8, n = 20. Is the relationship significant at α = 0.05?',
      a: 't = 2.5/0.8 = 3.125. df = 18. Two-sided p ≈ 0.006 < 0.05. Reject H₀. Yes, significant linear relationship.',
    },
    {
      q: 'Why is the t-test for slope two-sided unless otherwise specified?',
      a: 'Default tests if slope is zero (no relationship). Either positive or negative non-zero slope is evidence against H₀, hence two-sided.',
    },
  ],
  pitfalls: [
    '"Significant slope means cause" — no. Association only without random assignment.',
    '"High R² means correct model" — could just be fitting curve poorly.',
    '"Slope = 0 means no relationship" — only no LINEAR relationship.',
    '"Extrapolate to new x values freely" — risky outside observed range.',
  ],
};
