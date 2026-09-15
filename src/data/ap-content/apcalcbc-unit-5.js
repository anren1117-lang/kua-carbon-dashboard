// AP Calc BC Unit 5 — Analytical Applications of Differentiation

export const APCALCBC_UNIT_5 = {
  number: 5,
  title: 'Analytical Applications of Differentiation',
  weight: '8-11%',
  subunits: [
    {
      code: '5.1',
      title: 'Extreme Value Theorem and critical points',
      content:
`**EVT.** Continuous function on closed interval [a, b] attains a max and a min.

**Critical points.** Where f′(x) = 0 or f′(x) undefined.

**Candidates for absolute extrema** on [a, b]:
- Critical points in (a, b).
- Endpoints a and b.

**Procedure.** Evaluate f at all candidates; biggest is max, smallest is min.`,
    },
    {
      code: '5.2',
      title: 'Mean Value Theorem and Rolle\'s Theorem',
      content:
`**MVT.** If f continuous on [a, b], differentiable on (a, b), then there exists c in (a, b) with
f′(c) = [f(b) − f(a)] / (b − a).

Geometrically: tangent at c parallel to secant from (a, f(a)) to (b, f(b)).

**Rolle\'s.** Special case: if f(a) = f(b), then f′(c) = 0 for some c.

**Used for** proving roots of derivative exist.`,
    },
    {
      code: '5.3',
      title: 'First and second derivative tests',
      content:
`**First derivative test.** At critical point c:
- f′ changes + → −: local max.
- f′ changes − → +: local min.
- No change: not an extremum.

**Increasing/decreasing.**
- f′ > 0 → f increasing.
- f′ < 0 → f decreasing.

**Concavity.**
- f″ > 0 → concave up.
- f″ < 0 → concave down.

**Inflection points.** Where concavity changes; f″ = 0 or undefined AND changes sign.

**Second derivative test.** At c with f′(c) = 0:
- f″(c) > 0: local min.
- f″(c) < 0: local max.
- f″(c) = 0: inconclusive.

**Curve sketching.** Combine: domain, intercepts, asymptotes, increasing/decreasing, concavity, extrema, inflection.`,
    },
    {
      code: '5.4',
      title: 'Optimization',
      content:
`Find max/min in real situation.

**Procedure.**
1. Identify what to optimize (objective).
2. Identify constraint.
3. Express objective in one variable (using constraint).
4. Find critical points.
5. Verify (1st or 2nd derivative test).
6. Answer in context.

**Example.** Fence 100 ft, three sides only (back against wall). Max area?
- Let width w, length L. 2w + L = 100, so L = 100 − 2w.
- A = wL = w(100 − 2w) = 100w − 2w².
- A′ = 100 − 4w = 0 → w = 25.
- L = 50.
- Max area = 1250 sq ft.`,
    },
  ],
  keyConcepts: [
    'EVT: continuous on closed interval → has max and min.',
    'Critical points: f′ = 0 or undefined.',
    'MVT: f′(c) = secant slope.',
    'f′ + → − at max; − → + at min.',
    'f″ > 0 concave up; f″ < 0 concave down.',
    'Inflection: concavity changes.',
    'Optimization: objective + constraint, reduce to one variable.',
  ],
  practice: [
    { q: 'f(x) = x³ − 3x. Critical points? Extrema?', a: 'f′ = 3x² − 3 = 0 → x = ±1. f″(1) = 6 > 0: min at x=1. f″(−1) = −6 < 0: max at x=−1.' },
  ],
  pitfalls: [
    '"f′ = 0 always means extremum" — not if no sign change.',
  ],
};
