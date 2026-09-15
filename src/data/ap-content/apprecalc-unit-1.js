// AP Precalculus Unit 1 — Polynomial and Rational Functions

export const APPRECALC_UNIT_1 = {
  number: 1,
  title: 'Polynomial and Rational Functions',
  weight: '30-40%',
  subunits: [
    {
      code: '1.1',
      title: 'Functions and rates of change',
      content:
`**Function.** Relation where each input has exactly one output.

**Domain.** Set of valid inputs.
**Range.** Set of outputs.

**Function notation.** f(x). Read "f of x."

**Vertical line test.** Graph is a function if no vertical line hits it twice.

**Rate of change.** Average: Δy/Δx between two points.
- Linear function has constant rate.
- For y = mx + b, rate is m.

**Increasing/decreasing intervals.** Where function rises or falls.

**Concavity (informal).**
- Concave up: rate of change increasing.
- Concave down: rate decreasing.

**Symmetry.**
- Even: f(−x) = f(x). Symmetric about y-axis.
- Odd: f(−x) = −f(x). Symmetric about origin.`,
    },
    {
      code: '1.2',
      title: 'Polynomial functions',
      content:
`**Polynomial.** P(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀.

**Degree n.** Highest exponent.

**End behavior.** Determined by leading term aₙxⁿ.
- Even n, aₙ > 0: both ends ↑.
- Even n, aₙ < 0: both ends ↓.
- Odd n, aₙ > 0: left ↓, right ↑.
- Odd n, aₙ < 0: left ↑, right ↓.

**Zeros / roots / x-intercepts.** Where P(x) = 0.

**Multiplicity.**
- Odd multiplicity: graph crosses x-axis.
- Even multiplicity: graph touches and bounces.

**Fundamental Theorem of Algebra.** Polynomial of degree n has n complex roots (counting multiplicity).

**Factor theorem.** (x − c) is factor iff P(c) = 0.

**Synthetic division.** Quick way to divide by (x − c).

**Local extrema.** Polynomial of degree n has at most n−1 local extrema.

**Inflection points.** Where concavity changes.`,
    },
    {
      code: '1.3',
      title: 'Rational functions',
      content:
`**Rational function.** R(x) = P(x)/Q(x). Polynomial/polynomial.

**Domain.** All x where Q(x) ≠ 0.

**Vertical asymptote.** At x = c where Q(c) = 0 but P(c) ≠ 0.

**Hole.** Removable: factor cancels. x = c where (x − c) factor cancels both top and bottom.

**Horizontal asymptote.**
- deg P < deg Q: y = 0.
- deg P = deg Q: y = ratio of leading coefficients.
- deg P > deg Q: no HA (may have slant asymptote).

**Slant asymptote.** When deg P = deg Q + 1. Long divide.

**End behavior** = behavior as x → ±∞.

**Sign analysis.** Find zeros and asymptotes. Test in each interval.

**Solving rational equations.** Multiply through by LCD. Watch for extraneous solutions (where denominators become 0).`,
    },
  ],
  keyConcepts: [
    'Function: each input one output.',
    'Even f(−x) = f(x); odd f(−x) = −f(x).',
    'Polynomial degree n: at most n−1 local extrema; n complex roots.',
    'End behavior from leading term.',
    'Multiplicity even: bounces; odd: crosses.',
    'Rational: domain excludes zeros of denominator.',
    'Vertical asymptote where Q=0 but P≠0.',
    'Horizontal asymptote: compare degrees.',
    'Slant asymptote when deg P = deg Q + 1.',
  ],
  practice: [
    { q: 'End behavior of P(x) = −3x³ + 2x?', a: 'Leading: −3x³ (odd, negative). Left up, right down.' },
  ],
  pitfalls: [
    '"Roots = real roots only" — complex roots count.',
  ],
};
