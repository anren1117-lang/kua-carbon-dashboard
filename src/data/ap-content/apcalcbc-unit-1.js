// AP Calc BC Unit 1 — Limits and Continuity (same as AB)

export const APCALCBC_UNIT_1 = {
  number: 1,
  title: 'Limits and Continuity',
  weight: '4-7%',
  subunits: [
    {
      code: '1.1',
      title: 'What a limit is',
      content:
`**Limit.** The value f(x) approaches as x approaches some value c.

**Notation.** lim(x→c) f(x) = L.

**Reading.** "As x gets closer and closer to c, f(x) gets closer and closer to L."

**Doesn\'t matter what f(c) actually equals.** Limit cares about behavior NEAR c, not AT c.

**Example.** Let f(x) = (x² − 4)/(x − 2).
- Plug in x = 2: 0/0, undefined.
- Factor: (x − 2)(x + 2)/(x − 2) = x + 2 (for x ≠ 2).
- So as x → 2, f(x) → 4.
- lim(x→2) f(x) = 4, even though f(2) doesn\'t exist.

**One-sided limits.**
- lim(x→c⁻): from the left (x < c).
- lim(x→c⁺): from the right (x > c).
- Two-sided limit exists iff both one-sided limits exist and are equal.

**When limits DON\'T exist:**
- One-sided limits differ.
- Function blows up to ±∞.
- Oscillation (like sin(1/x) near 0).

**Infinite limits.** "lim = ∞" means f grows without bound.

**Limits at infinity.** As x → ±∞, what does f(x) approach? Tells horizontal asymptotes.`,
    },
    {
      code: '1.2',
      title: 'Evaluating limits',
      content:
`**Direct substitution** works when function is continuous.
- lim(x→3) (x² + 1) = 10.

**0/0 indeterminate form.** Need algebraic manipulation.
- Factor and cancel.
- Rationalize (multiply by conjugate).
- L\'Hôpital\'s rule (later).

**Examples:**

**Factor:**
- lim(x→2) (x² − 4)/(x − 2)
- = lim (x − 2)(x + 2)/(x − 2)
- = lim (x + 2) = 4.

**Rationalize:**
- lim(x→0) (√(x+1) − 1)/x
- Multiply top and bottom by (√(x+1) + 1):
- = lim x / [x(√(x+1) + 1)]
- = lim 1/(√(x+1) + 1)
- = 1/2.

**Squeeze theorem.** If g(x) ≤ f(x) ≤ h(x) near c, and lim g = lim h = L, then lim f = L.

**Limits at infinity for rationals.** Compare degrees:
- Top degree < bottom: limit = 0.
- Equal: limit = ratio of leading coefficients.
- Top > bottom: ±∞.

**Special limits:**
- lim(x→0) sin(x)/x = 1.
- lim(x→0) (1 − cos x)/x = 0.
- lim(x→∞) (1 + 1/x)^x = e.`,
    },
    {
      code: '1.3',
      title: 'Continuity',
      content:
`**Continuous at c.** Three conditions:
1. f(c) is defined.
2. lim(x→c) f(x) exists.
3. lim(x→c) f(x) = f(c).

**Continuous on an interval** if continuous at every point.

**Types of discontinuity:**
- **Removable** (hole): can be "fixed" by redefining one point.
- **Jump**: left and right limits exist but differ.
- **Infinite**: vertical asymptote.
- **Oscillating**: like sin(1/x) near 0.

**Polynomials are continuous everywhere.**
**Rationals continuous except where denominator = 0.**
**Sin, cos continuous everywhere.**
**tan discontinuous at π/2 + nπ.**

**Intermediate Value Theorem (IVT).** If f continuous on [a, b] and N between f(a) and f(b), then there exists c in (a, b) with f(c) = N.
- Used for: proving solutions exist; finding roots.

**Composition of continuous functions** is continuous.`,
    },
  ],
  keyConcepts: [
    'Limit = value f(x) approaches.',
    'Two-sided limit exists iff both one-sided limits agree.',
    '0/0 indeterminate — manipulate algebraically.',
    'Continuous at c: limit exists, equals f(c).',
    'Discontinuity types: removable, jump, infinite, oscillating.',
    'IVT: continuous function takes every value between f(a) and f(b).',
    'lim(x→0) sin(x)/x = 1 — foundational.',
  ],
  practice: [
    { q: 'lim(x→3) (x² − 9)/(x − 3).', a: 'Factor: (x−3)(x+3)/(x−3) → x+3 → 6.' },
  ],
  pitfalls: [
    '"f(c) defined → limit exists" — limit may differ from f(c).',
  ],
};
