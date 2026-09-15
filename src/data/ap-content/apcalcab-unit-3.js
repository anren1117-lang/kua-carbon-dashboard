// AP Calculus AB Unit 3 — Differentiation: Composite, Implicit, Inverse Functions (9-13%)

export const APCALCAB_UNIT_3 = {
  number: 3,
  title: 'Differentiation: Composite, Implicit, and Inverse Functions',
  weight: '9-13%',
  subunits: [
    {
      code: '3.1',
      title: 'The chain rule',
      content:
`**Chain rule.** d/dx [f(g(x))] = f\'(g(x)) · g\'(x).

In Leibniz notation: if y = f(u) and u = g(x), then dy/dx = (dy/du)(du/dx).

**Worked examples:**
- d/dx [sin(3x)] = cos(3x) · 3 = 3cos(3x).
- d/dx [(x² + 1)⁵] = 5(x² + 1)⁴ · 2x = 10x(x² + 1)⁴.
- d/dx [e^(x²)] = e^(x²) · 2x = 2x e^(x²).
- d/dx [ln(x² + 1)] = 1/(x² + 1) · 2x = 2x/(x² + 1).
- d/dx [√(sin x)] = (1/(2√(sin x))) · cos x.

**Layered chain rule** for f(g(h(x))):
d/dx = f\'(g(h(x))) · g\'(h(x)) · h\'(x).

**Memory aid.** "Derivative of outside, leave inside alone, times derivative of inside."`,
    },
    {
      code: '3.2',
      title: 'Implicit differentiation',
      content:
`When y is defined implicitly (not solved for): differentiate both sides with respect to x; treat y as a function of x; use chain rule.

**Example: circle x² + y² = 25.**
Differentiate: 2x + 2y · dy/dx = 0.
Solve: dy/dx = -x/y.

**Why?** Sometimes y can\'t be solved explicitly. Implicit differentiation gives derivative without solving.

**Worked example.** Find dy/dx for x³ + xy + y³ = 7.
- Differentiate: 3x² + (y + x · dy/dx) + 3y² · dy/dx = 0.
- 3x² + y + (x + 3y²) · dy/dx = 0.
- dy/dx = -(3x² + y) / (x + 3y²).

**Tangent line problem.** Find slope at specific point: plug x, y into dy/dx expression.`,
    },
    {
      code: '3.3',
      title: 'Derivatives of inverse functions',
      content:
`If f and g are inverses, then g\'(b) = 1/f\'(a) where f(a) = b.

**Example.** y = ln(x) is the inverse of y = eˣ. Since d/dx[eˣ] = eˣ, then d/dx[ln(x)] = 1/x.

**Implicit approach.** If y = f⁻¹(x), then x = f(y). Differentiate both sides: 1 = f\'(y) · dy/dx. So dy/dx = 1/f\'(y).

**Inverse trig derivatives.**
- d/dx [arcsin x] = 1/√(1 - x²).
- d/dx [arccos x] = -1/√(1 - x²).
- d/dx [arctan x] = 1/(1 + x²).

**Worked example.** Find d/dx [arcsin(2x)].
Chain rule: (1/√(1 - (2x)²)) · 2 = 2/√(1 - 4x²).`,
    },
  ],
  keyConcepts: [
    'Chain rule: d/dx[f(g(x))] = f\'(g(x))·g\'(x).',
    'Implicit differentiation: treat y as function of x; apply chain rule to y terms.',
    'Inverse function derivative: d/dx[f⁻¹(x)] = 1/f\'(f⁻¹(x)).',
    'Memorize inverse trig: arcsin → 1/√(1-x²); arctan → 1/(1+x²).',
  ],
  formulas: [
    {
      name: 'Chain rule',
      equation: 'd/dx[f(g(x))] = f\'(g(x))·g\'(x)',
      meaning: 'Derivative of composition. Foundational for almost everything in Unit 3+.',
      example: 'd/dx[sin(x²)] = cos(x²)·2x.',
    },
  ],
  practice: [
    {
      q: 'Differentiate y = ln(cos x).',
      a: 'Chain rule: dy/dx = (1/cos x) · (-sin x) = -tan x.',
    },
    {
      q: 'Find dy/dx for x² + y² = 1.',
      a: 'Implicit: 2x + 2y·dy/dx = 0. dy/dx = -x/y.',
    },
  ],
  pitfalls: [
    '"Forget the inside when chain rule" — must multiply by derivative of inside.',
    '"Confuse implicit with explicit" — implicit means you can\'t isolate y first.',
  ],
};
