// AP Statistics Unit 8 — Inference for Categorical Data: Chi-Square (2-5%)

export const APSTATS_UNIT_8 = {
  number: 8,
  title: 'Inference for Categorical Data: Chi-Square',
  weight: '2-5%',
  subunits: [
    {
      code: '8.1',
      title: 'Introduction to chi-square tests',
      content:
`Chi-square (χ²) tests compare **observed counts** to **expected counts** for categorical data.

**Three chi-square tests:**
1. **Goodness-of-fit**: tests whether a single categorical variable matches a hypothesized distribution.
2. **Homogeneity**: tests whether two or more populations have the same distribution of a variable.
3. **Independence**: tests whether two categorical variables are independent.

**Test statistic:**
χ² = Σ (Observed - Expected)² / Expected

**Distribution.** χ² distribution; df depends on the test.

**Always one-sided (right-tail).** Larger χ² → more disagreement between observed and expected → smaller p-value → more evidence against H₀.

**Conditions:**
- Random sample.
- **All expected counts ≥ 5** (sometimes ≥ 1 with most ≥ 5).
- Independent observations.`,
    },
    {
      code: '8.2',
      title: 'Chi-square test for goodness-of-fit',
      content:
`**Goodness-of-fit test** checks if observed data matches a hypothesized distribution.

**H₀**: distribution matches claimed proportions.
**Hₐ**: at least one proportion differs.

**Expected counts:** total × hypothesized proportion.

**Test statistic:**
χ² = Σ (O - E)² / E

**df = k - 1** where k = number of categories.

**Worked example.** A die is rolled 60 times. Claim: fair die (1/6 each).
Observed: 8, 14, 10, 7, 12, 9 for faces 1-6.
Expected: 10 each.
χ² = (8-10)²/10 + (14-10)²/10 + (10-10)²/10 + (7-10)²/10 + (12-10)²/10 + (9-10)²/10
   = 0.4 + 1.6 + 0 + 0.9 + 0.4 + 0.1 = 3.4.
df = 5. p-value = P(χ² > 3.4, df = 5) ≈ 0.638.
Fail to reject H₀. Data consistent with fair die.

**Conditions check.** All expected counts (10) ≥ 5. ✓`,
    },
    {
      code: '8.3',
      title: 'Chi-square test for homogeneity',
      content:
`**Homogeneity test** compares distributions across multiple populations or treatments.

**Setup.** Two-way table with rows = populations, columns = response categories.

**H₀**: distributions are the same across populations.
**Hₐ**: at least one differs.

**Expected counts** for each cell:
Expected = (row total × column total) / grand total.

**Test statistic:** same χ² formula.

**df = (r - 1)(c - 1)** for r rows, c columns.

**Worked example.** Survey of 200 men, 200 women on color preferences (4 colors).

|  | Red | Blue | Green | Other | Total |
|---|---|---|---|---|---|
| M | 60 | 70 | 30 | 40 | 200 |
| F | 80 | 50 | 40 | 30 | 200 |
| Total | 140 | 120 | 70 | 70 | 400 |

Expected: each cell = (row × col) / 400. Both rows = 200; columns are 140, 120, 70, 70.
Expected for M-Red: (200 × 140)/400 = 70.
Expected for all cells in M and F rows: 70, 60, 35, 35.

χ² = Σ(O-E)²/E.
M: (60-70)²/70 + (70-60)²/60 + (30-35)²/35 + (40-35)²/35 = 1.43 + 1.67 + 0.71 + 0.71 = 4.52.
F: (80-70)²/70 + (50-60)²/60 + (40-35)²/35 + (30-35)²/35 = same form = 4.52.
Total χ² = 9.04.
df = (2-1)(4-1) = 3. p-value = P(χ² > 9.04, df = 3) ≈ 0.029.

Reject H₀. Men and women have different color preference distributions.`,
    },
    {
      code: '8.4',
      title: 'Chi-square test for independence',
      content:
`**Independence test** is almost the same as homogeneity but conceptually different.

**Difference.**
- **Independence**: one population, two variables measured; test if variables are independent.
- **Homogeneity**: multiple populations, one variable; test if distributions are equal.

Same formula and procedure.

**H₀**: variables are independent.
**Hₐ**: variables are associated.

**Worked example.** Survey 500 students on year (freshman/sophomore/junior/senior) and major (STEM/humanities). Is there an association?

Compute expected counts assuming independence (row × col / total). Compute χ². Compare to χ² distribution with (r-1)(c-1) df.

**Why the formula works.** If variables are independent, expected count in cell (i,j) = (row total i)(col total j)/grand total. If observed is far from expected → variables are associated.

**Interpreting.** Significant χ² → variables are associated. Doesn\'t tell HOW; need to inspect cells.

**Common mistake.** Independence vs homogeneity tests are mathematically identical but answer different questions. Make sure your conclusion matches your setup.`,
    },
  ],
  keyConcepts: [
    'Chi-square tests compare observed vs expected counts.',
    'χ² = Σ (O-E)²/E. Always one-sided (right tail).',
    'Conditions: random sample, all expected ≥ 5, independent observations.',
    'Goodness-of-fit: one variable, hypothesized distribution. df = k - 1.',
    'Homogeneity: multiple populations, same variable. df = (r-1)(c-1).',
    'Independence: one population, two variables. df = (r-1)(c-1).',
    'Larger χ² → more evidence against H₀.',
    'Significant χ² doesn\'t tell you how variables are related; inspect cells.',
  ],
  formulas: [
    {
      name: 'Chi-square test statistic',
      equation: 'χ² = Σ (O - E)² / E',
      meaning: 'Sum over all cells. df varies by test type.',
      example: 'Die rolled 60 times: χ² = 3.4, df = 5, p = 0.64. Consistent with fair.',
    },
  ],
  practice: [
    {
      q: 'A coin is flipped 100 times: 60 heads, 40 tails. Test if coin is fair.',
      a: 'Expected: 50 each. χ² = (60-50)²/50 + (40-50)²/50 = 2 + 2 = 4. df = 1. p = P(χ² > 4) ≈ 0.046. Reject H₀ (just barely) — evidence coin is unfair.',
    },
    {
      q: 'Why is the χ² test always right-tailed?',
      a: 'χ² measures how far observed deviates from expected. Larger χ² means worse fit. Only large values are evidence against H₀.',
    },
  ],
  pitfalls: [
    '"Use χ² with small expected counts" — invalid. Need all expected ≥ 5.',
    '"χ² test gives the relationship direction" — only tells if there\'s a relationship. Look at residuals to see how.',
    '"Goodness-of-fit and independence are the same" — same math, different setup and interpretation.',
    '"χ² is two-tailed" — no, always right-tailed.',
  ],
};
