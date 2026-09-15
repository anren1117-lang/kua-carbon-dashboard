// AP Statistics Unit 2 — Exploring Two-Variable Data (5-7%)

export const APSTATS_UNIT_2 = {
  number: 2,
  title: 'Exploring Two-Variable Data',
  weight: '5-7%',
  subunits: [
    {
      code: '2.1',
      title: 'Two categorical variables',
      content:
`When you have two categorical variables, organize with a **two-way table** (contingency table).

**Marginal distribution.** Row and column totals — distribution of one variable alone.

**Conditional distribution.** Distribution of one variable for a fixed value of the other (e.g., smoking rate among males vs females).

**Independence.** Two variables are independent if conditional distributions are identical across categories. Real-world rarely exactly independent; check with chi-square test (Unit 8).

**Segmented (stacked) bar chart.** Bars 100% tall; segments show proportions within each category. Good for showing conditional distributions.

**Side-by-side bar chart.** Bars next to each other for each subgroup. Best for comparing counts or proportions across categories.

**Example.** Survey of 500 adults: do they support a policy?
| | Support | Oppose | Total |
|---|---|---|---|
| Under 40 | 120 | 80 | 200 |
| 40+ | 140 | 160 | 300 |
| Total | 260 | 240 | 500 |

Among under 40: 60% support. Among 40+: 47% support. Difference suggests age is associated with opinion.`,
    },
    {
      code: '2.2',
      title: 'Scatter plots',
      content:
`For two quantitative variables, use a **scatter plot**. Each point represents one observation; x and y axes are the two variables.

**Describe with DOFS:**
- **Direction**: positive (up to right), negative (down to right), or none.
- **Outliers**: points far from the pattern.
- **Form**: linear, curved, no pattern.
- **Strength**: how tightly points cluster around the pattern.

**Explanatory (x) vs response (y) variables.** By convention, x is the predictor, y is what you're predicting.

**Examples:**
- Hours studied (x) vs test score (y): positive, fairly linear, moderate strength.
- Age of car (x) vs price (y): negative, somewhat linear or curved.
- Shoe size (x) vs IQ (y): no association.

**Don\'t confuse correlation with causation.** A strong scatter pattern doesn't prove one variable causes the other. Need experimental design.`,
    },
    {
      code: '2.3',
      title: 'Correlation',
      content:
`**Correlation coefficient r** measures strength and direction of linear association.

**Range:** -1 ≤ r ≤ +1.
- r = +1: perfect positive linear.
- r = -1: perfect negative linear.
- r = 0: no linear association (but possibly other patterns).

**Interpretation:**
- |r| > 0.8: strong.
- 0.5 < |r| < 0.8: moderate.
- 0.3 < |r| < 0.5: weak.
- |r| < 0.3: very weak / negligible.

**Important properties:**
- r has NO units.
- r doesn't change if you swap x and y.
- r doesn't change if you change units (cm to inches).
- r ONLY measures LINEAR association. Strong curved patterns can have r ≈ 0.
- r is affected by outliers — even one bad point can change r dramatically.

**Compute** (rarely by hand on AP; calculator does it):
r = (1/(n-1)) × Σ[(x_i - x̄)/s_x] × [(y_i - ȳ)/s_y]

**Interpretation example.** "The correlation between hours studied and exam score is r = 0.72, indicating a moderately strong positive linear association."

**Always plot first.** Never report only r — always include a scatter plot and check linearity assumption.`,
    },
    {
      code: '2.4',
      title: 'Linear regression models',
      content:
`When the scatter plot shows linear pattern, fit a **least-squares regression line**:
ŷ = a + bx

(or ŷ = b₀ + b₁x)

- **a** (or b₀) = y-intercept (predicted y when x = 0).
- **b** (or b₁) = slope (predicted change in y per unit change in x).

**ŷ** (y-hat) is the **predicted** value of y from the line.

**Slope and intercept formulas:**
b = r × (s_y / s_x)
a = ȳ - b × x̄

**Least-squares criterion.** The line that minimizes the sum of squared vertical distances (residuals) from the data points.

**Interpreting the line.**
- Slope: "For each additional hour studied, the predicted exam score increases by 8.5 points."
- Intercept: "With 0 hours of study, the predicted exam score is 42." (Often not meaningful if x = 0 is far from data.)

**Residual:** residual = observed - predicted = y - ŷ.
- Positive residual: actual y above line.
- Negative residual: below line.

**Residual plot.** Plot residuals vs x. Should show NO pattern if linear model is appropriate. Pattern (curve, fan shape) suggests linear model is wrong or variance changes.`,
    },
    {
      code: '2.5',
      title: 'Residuals',
      content:
`**Residual = observed - predicted.**
e_i = y_i - ŷ_i

Residuals tell you how far off the line is at each point.

**Sum of residuals = 0** (always, for least-squares line).

**Sum of squared residuals (SSE) is minimized** by the least-squares line.

**Residual plot.** Critical diagnostic. Plot residuals vs x:
- **Random scatter around 0**: linear model appropriate.
- **Curve / pattern**: linear model is wrong; data is curved.
- **Fan shape (wider on one side)**: variance not constant.
- **Outliers in residual plot**: high-leverage points.

**Standard deviation of residuals (s):**
s = √[Σ(y - ŷ)² / (n - 2)]

"Typical" prediction error. The n-2 is degrees of freedom (lost two: slope and intercept).`,
    },
    {
      code: '2.6',
      title: 'Least squares regression',
      content:
`The least-squares line passes through (x̄, ȳ).

**Coefficient of determination R²:**
R² = (proportion of variation in y explained by linear regression on x).

- R² = r² (for simple linear regression).
- 0 ≤ R² ≤ 1.
- R² = 0.8 means "80% of the variation in y is explained by x".
- Higher R² doesn\'t mean the model is correct — it might just be fitting a curve poorly.

**Why r² (not r)?** Because squared distances are what's minimized.

**Worked example.** Studying hours predicts exam scores: r = 0.85.
R² = 0.7225 = 72.25% of variance in scores explained by hours studied.

**Interpreting computer output.**
| Predictor | Coef | SE | t | P |
|---|---|---|---|---|
| Constant | 42.5 | 5.2 | 8.2 | 0.000 |
| Hours | 8.3 | 1.2 | 6.9 | 0.000 |

Slope = 8.3 per hour; intercept = 42.5. (Standard errors and p-values become important for inference in Unit 9.)

**Extrapolation.** Predicting y for x outside the observed range. **Dangerous** — the linear pattern may not hold there. Always note when extrapolating.

**Influential points.** Points that, if removed, change the regression line substantially. High-leverage (extreme x) + large residual = especially influential.`,
    },
    {
      code: '2.7',
      title: 'Analyzing departures from linearity',
      content:
`When data isn\'t linear, regression on raw data is misleading. Two common fixes:

**Transformation.** Apply a function to make data linear.
- **Log transform** (y → log y): linearizes exponential growth (y = a·bˣ becomes log y = log a + x·log b).
- **Square root transform**: sometimes linearizes power relationships.
- **Reciprocal**: 1/x or 1/y for hyperbolic relationships.

**Check residuals.** A curved residual plot signals you need a transformation.

**Power and exponential models.**
- Power: y = a × xⁿ. Linearize by taking log of both: log y = log a + n × log x.
- Exponential: y = a × bˣ. Linearize: log y = log a + x × log b.

**After transformation:**
1. Run linear regression on transformed data.
2. Find linear coefficients.
3. Back-transform to get original-scale equation if needed.

**Real-world applications:**
- Population growth (exponential) → log transform.
- Power laws (Kleiber's metabolism ∝ mass^0.75) → log-log transform.
- Decay (radioactive, drug clearance) → log transform.

**Always check.** After transformation, residual plot should show no pattern. If it still shows pattern, try a different transform or a more complex model.`,
    },
  ],
  keyConcepts: [
    'Two-way tables organize categorical-categorical data; conditional distributions show relationships.',
    'Scatter plots: describe DOFS (direction, outliers, form, strength).',
    'Correlation r: -1 to +1; only measures linear association.',
    'Least-squares regression line: ŷ = a + bx; minimizes squared residuals.',
    'Slope interpretation: predicted change in y per unit increase in x.',
    'R² = proportion of variance in y explained by x.',
    'Residual plots diagnose linearity and constant variance.',
    'Extrapolation is risky.',
    'Transform data (log, sqrt) to linearize curved relationships.',
  ],
  formulas: [
    {
      name: 'Least-squares line',
      equation: 'ŷ = a + bx;  b = r(s_y/s_x);  a = ȳ - bx̄',
      meaning: 'Line passing through (x̄, ȳ) with slope determined by correlation and ratio of SDs.',
      example: 'If r = 0.8, s_x = 2, s_y = 6, then b = 0.8 × 3 = 2.4 (units of y per unit of x).',
    },
    {
      name: 'Coefficient of determination',
      equation: 'R² = r²',
      meaning: 'Proportion of y\'s variation explained by linear regression on x.',
      example: 'r = 0.7 → R² = 0.49 → 49% of variability in y is explained by x.',
    },
  ],
  practice: [
    {
      q: 'A scatter plot of (hours studied, test score) gives r = 0.6, slope 8 points/hour. Interpret each value.',
      a: 'r = 0.6: moderate positive linear association. Slope 8: for each additional hour studied, predicted test score increases by 8 points.',
    },
    {
      q: 'Why is correlation r = 0.95 not the same as "x causes y"?',
      a: 'Correlation only describes association. Other explanations: (a) y causes x; (b) third variable causes both; (c) coincidence. Causation requires experimental design with random assignment.',
    },
    {
      q: 'Data show R² = 0.85 for a linear model. What does this mean?',
      a: '85% of the variability in y is explained by linear regression on x. The remaining 15% is from other factors or random variation.',
    },
  ],
  pitfalls: [
    '"r = 0 means no relationship" — wrong. Means no LINEAR relationship; could be curved.',
    '"Correlation implies causation" — never assume from observational data alone.',
    '"The line passes through (0,0)" — only if the intercept is 0; usually not.',
    '"R² = 100% means perfect prediction" — no, means perfect fit to those data; could overfit.',
    '"Always use least-squares" — only if linear and residuals random.',
  ],
};
