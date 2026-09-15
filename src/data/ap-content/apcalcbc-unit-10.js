// AP Calc BC Unit 10 — Infinite Sequences and Series (BC only)

export const APCALCBC_UNIT_10 = {
  number: 10,
  title: 'Infinite Sequences and Series (BC only)',
  weight: '17-18%',
  subunits: [
    {
      code: '10.1',
      title: 'Sequences and convergence',
      content:
`**Sequence.** Ordered list: a₁, a₂, a₃, ...

**Limit.** lim(n→∞) a_n. Sequence converges if limit exists (finite); diverges otherwise.

**Examples.**
- a_n = 1/n → 0 (converges).
- a_n = n → ∞ (diverges).
- a_n = (−1)ⁿ → no limit (diverges, oscillates).

**Series.** Sum: a₁ + a₂ + a₃ + ... = Σa_n.

**Partial sum.** S_n = a₁ + ... + a_n.

**Series converges** if lim S_n exists (finite).

**Geometric series.** Σar^n = a + ar + ar² + ...
- Converges if |r| < 1; sum = a/(1 − r).
- Diverges if |r| ≥ 1.`,
    },
    {
      code: '10.2',
      title: 'Convergence tests',
      content:
`**nth term test (divergence test).** If lim a_n ≠ 0, series diverges. (Necessary, not sufficient.)

**Integral test.** For positive decreasing f: Σf(n) converges iff ∫(1 to ∞) f(x) dx converges.

**p-series.** Σ 1/n^p.
- Converges if p > 1.
- Diverges if p ≤ 1.
- Σ1/n (harmonic) diverges; Σ1/n² converges.

**Comparison test.** If 0 ≤ a_n ≤ b_n:
- Σb_n converges → Σa_n converges.
- Σa_n diverges → Σb_n diverges.

**Limit comparison test.** If lim(a_n/b_n) = L > 0, both behave the same.

**Ratio test.** Compute L = lim |a_{n+1}/a_n|.
- L < 1: converges absolutely.
- L > 1: diverges.
- L = 1: inconclusive.

**Root test.** L = lim |a_n|^(1/n). Same conclusions.

**Alternating series test.** Σ(−1)ⁿ a_n with a_n > 0 decreasing to 0 converges.

**Absolute vs conditional convergence.**
- Absolute: Σ|a_n| converges.
- Conditional: Σa_n converges but Σ|a_n| doesn\'t.`,
    },
    {
      code: '10.3',
      title: 'Power series',
      content:
`**Power series.** Σ c_n (x − a)ⁿ.

**Center.** x = a.

**Interval of convergence.** Set of x where series converges.

**Radius of convergence R.** Half-width of interval (around center).

**Finding R.** Use ratio test on |x − a| terms.

**Endpoints** must be checked separately (don\'t fall under ratio test).

**Operations on power series within radius.**
- Add, subtract.
- Multiply by constant or power of x.
- Differentiate or integrate term by term.

**Geometric series.**
- 1/(1 − x) = 1 + x + x² + ... for |x| < 1.

**From this, derive many others.**
- ln(1 + x) = x − x²/2 + x³/3 − ...
- arctan(x) = x − x³/3 + x⁵/5 − ...`,
    },
    {
      code: '10.4',
      title: 'Taylor and Maclaurin series',
      content:
`**Taylor series.** Series representation of f around point a:
f(x) = Σ f⁽ⁿ⁾(a)/n! · (x − a)ⁿ.

**Maclaurin series.** Taylor around 0:
f(x) = Σ f⁽ⁿ⁾(0)/n! · xⁿ.

**Common Maclaurin series.**
- eˣ = 1 + x + x²/2! + x³/3! + ...
- sin x = x − x³/3! + x⁵/5! − ...
- cos x = 1 − x²/2! + x⁴/4! − ...
- 1/(1 − x) = 1 + x + x² + ... (|x| < 1).
- ln(1 + x) = x − x²/2 + x³/3 − ... (|x| < 1).
- arctan x = x − x³/3 + x⁵/5 − ... (|x| ≤ 1).

**Taylor polynomial.** Truncated Taylor series:
T_n(x) = f(a) + f′(a)(x−a) + ... + f⁽ⁿ⁾(a)/n! · (x−a)ⁿ.

**Approximates f near a.**

**Lagrange error bound.** |R_n(x)| ≤ M/(n+1)! · |x − a|^(n+1) where M = max |f^(n+1)| on relevant interval.

**Applications.**
- Approximate values (e.g., e^0.1, sin(0.5)).
- Solve unsolvable integrals (expand and integrate term by term).
- Differential equations.

**Operations.**
- To get series for f(x²), substitute x → x² in series for f.
- To get series for x·f(x), multiply series by x.`,
    },
  ],
  keyConcepts: [
    'Geometric: Σar^n converges iff |r| < 1; sum = a/(1−r).',
    'p-series: converges iff p > 1.',
    'Harmonic Σ1/n diverges; Σ1/n² converges.',
    'Tests: nth term, integral, comparison, ratio, root, alternating.',
    'Absolute vs conditional convergence.',
    'Power series: radius and interval of convergence.',
    'Taylor series: f(x) = Σf⁽ⁿ⁾(a)/n! (x−a)ⁿ.',
    'Common Maclaurin: eˣ, sin x, cos x, 1/(1−x), ln(1+x), arctan x.',
    'Lagrange error bound.',
  ],
  practice: [
    { q: 'Maclaurin series of sin(x²)?', a: 'Substitute x → x² in sin x series: x² − x⁶/3! + x¹⁰/5! − ...' },
  ],
  pitfalls: [
    '"Geometric formula always works" — only if |r| < 1.',
    '"Endpoints automatic" — must check separately.',
  ],
};
