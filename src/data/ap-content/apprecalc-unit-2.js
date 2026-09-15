// AP Precalculus Unit 2 — Exponential and Logarithmic Functions

export const APPRECALC_UNIT_2 = {
  number: 2,
  title: 'Exponential and Logarithmic Functions',
  weight: '27-40%',
  subunits: [
    {
      code: '2.1',
      title: 'Exponential functions',
      content:
`**Exponential function.** f(x) = a·b^x with b > 0, b ≠ 1.
- Base b.
- a = initial value.

**Domain:** all real numbers.
**Range:** (0, ∞) if a > 0.

**b > 1: growth.** Function increases.
**0 < b < 1: decay.** Function decreases.

**Horizontal asymptote:** y = 0 (when domain extends to ±∞ in right direction).

**Properties.**
- f(x+y) = f(x)·f(y) (for f(x) = b^x).
- Constant ratio: f(x+1)/f(x) = b.
- Compare to linear (constant difference) and polynomial.

**Compound interest.** A = P(1 + r/n)^(nt).

**Continuous compounding.** A = Pe^(rt).

**Doubling time.** T = ln(2)/r ≈ 0.693/r.

**Half-life.** T = ln(2)/k.

**Modeling.**
- Population growth.
- Radioactive decay.
- Drug elimination.
- Bacterial growth.
- Investment.

**Asymptotic behavior.**
- As x → −∞: b^x → 0.
- As x → ∞: b^x → ∞ (for b > 1).`,
    },
    {
      code: '2.2',
      title: 'Logarithmic functions',
      content:
`**Logarithm.** log_b(x) = y means b^y = x.

**Inverse of exponential.** y = b^x ↔ x = log_b(y).

**Domain:** (0, ∞).
**Range:** all reals.
**Vertical asymptote:** x = 0.

**Common bases.**
- log = log₁₀ (common log).
- ln = log_e (natural log).
- log₂ used in computer science.

**Properties.**
- log(xy) = log(x) + log(y).
- log(x/y) = log(x) − log(y).
- log(x^n) = n·log(x).
- log(1) = 0; log(b) = 1.
- log_b(b^x) = x; b^(log_b x) = x.

**Change of base.** log_b(x) = log(x)/log(b) = ln(x)/ln(b).

**Solving exponential equations.** Take log of both sides.
- 2^x = 5 → x = log₂(5) = ln(5)/ln(2) ≈ 2.32.

**Solving log equations.** Combine logs, then exponentiate.
- log(x) + log(x − 1) = 1 → log(x(x−1)) = 1 → x(x−1) = 10 → x² − x − 10 = 0.

**Check for extraneous solutions** (logs of negative numbers undefined).

**Graphs.** Inverse of exponential. Reflection across y = x.`,
    },
    {
      code: '2.3',
      title: 'Modeling with exponentials',
      content:
`**Exponential model.** y = a·b^x or y = a·e^(kx).

**Half-life problems.** If T = half-life, after time t:
- A = A₀ · (1/2)^(t/T).
- Or A = A₀ · e^(−kt) with k = ln 2/T.

**Doubling time.** After time t, amount is 2^(t/T_d) times original.

**Newton\'s law of cooling.** T(t) = T_a + (T_0 − T_a)e^(−kt).
- T_a = ambient temperature.
- T_0 = initial.

**Logistic model.** Bounded growth: y = L / (1 + Ae^(−kt)).
- L = carrying capacity.
- Inflection at L/2.

**Choosing model.**
- Constant percentage growth: exponential.
- Bounded growth: logistic.
- Periodic: trigonometric.

**Linearization.** Take log to linearize exponential.
- y = a·b^x → log(y) = log(a) + x·log(b). Linear in (x, log y).

**Examples.**
- COVID early growth: exponential.
- Investment: compound = continuous = exponential.
- Cooling coffee: Newton\'s.
- Spread of rumor or virus through population: logistic.`,
    },
  ],
  keyConcepts: [
    'Exponential: y = a·b^x. b > 1 growth; 0 < b < 1 decay.',
    'HA at y = 0; constant ratio.',
    'A = Pe^(rt) continuous compounding.',
    'Doubling time T = ln 2/r.',
    'log_b(x) inverse of b^x.',
    'log properties: log(xy) = log x + log y.',
    'Change of base.',
    'Newton\'s cooling: T = T_a + (T_0 − T_a)e^(−kt).',
    'Logistic for bounded growth.',
  ],
  practice: [
    { q: '$1000 at 5% continuous for 10 yr?', a: 'A = 1000·e^(0.5) ≈ $1648.72.' },
  ],
  pitfalls: [
    '"log(x + y) = log x + log y" — WRONG.',
  ],
};
