// AP Calc BC Unit 3 — Composite, Implicit, Inverse Functions

export const APCALCBC_UNIT_3 = {
  number: 3,
  title: 'Composite, Implicit, Inverse Functions',
  weight: '4-7%',
  subunits: [
    {
      code: '3.1',
      title: 'Product and quotient rules',
      content:
`**Product rule.** d/dx[fg] = f′g + fg′.

Example: d/dx[x² · sin x] = 2x·sin x + x²·cos x.

**Quotient rule.** d/dx[f/g] = (f′g − fg′)/g².

Example: d/dx[(sin x)/x] = (x·cos x − sin x)/x².

**Memorize.** "Low D-high minus high D-low, square the bottom, away we go."`,
    },
    {
      code: '3.2',
      title: 'Chain rule',
      content:
`**Chain rule.** d/dx[f(g(x))] = f′(g(x)) · g′(x).

"Derivative of outside (keep inside) times derivative of inside."

Example: d/dx[sin(x²)] = cos(x²) · 2x.

Example: d/dx[(3x + 1)⁵] = 5(3x + 1)⁴ · 3 = 15(3x + 1)⁴.

**Multiple layers.** Apply repeatedly.
- d/dx[sin(cos(x²))] = cos(cos(x²)) · (−sin(x²)) · 2x.

**With logs and exponentials.**
- d/dx[e^(3x)] = e^(3x) · 3.
- d/dx[ln(x² + 1)] = (1/(x² + 1)) · 2x.`,
    },
    {
      code: '3.3',
      title: 'Implicit differentiation',
      content:
`When y is implicitly defined by F(x, y) = 0, can\'t isolate y. Use implicit differentiation.

**Procedure.**
1. Differentiate both sides with respect to x.
2. Treat y as function of x; use chain rule when differentiating y terms.
3. Solve for dy/dx.

**Example.** x² + y² = 25.
- d/dx: 2x + 2y · y′ = 0.
- y′ = −x/y.

**Example.** xy + sin y = 1.
- d/dx: y + x · y′ + cos y · y′ = 0.
- y′(x + cos y) = −y.
- y′ = −y/(x + cos y).

**Inverse function derivative.** (f⁻¹)′(b) = 1/f′(a) where a = f⁻¹(b).`,
    },
  ],
  keyConcepts: [
    'Product: (fg)′ = f′g + fg′.',
    'Quotient: (f/g)′ = (f′g − fg′)/g².',
    'Chain: (f(g))′ = f′(g) · g′.',
    'Implicit: differentiate both sides, treat y as function of x.',
    '(f⁻¹)′(b) = 1/f′(a).',
  ],
  practice: [
    { q: 'd/dx[x² · ln x].', a: '2x·ln x + x²·(1/x) = 2x·ln x + x.' },
  ],
  pitfalls: [
    '"(fg)′ = f′g′" — wrong; use product rule.',
  ],
};
