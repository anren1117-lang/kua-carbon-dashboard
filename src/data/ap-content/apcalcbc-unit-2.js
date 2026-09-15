// AP Calc BC Unit 2 — Differentiation: Definition and Basic Rules

export const APCALCBC_UNIT_2 = {
  number: 2,
  title: 'Differentiation: Definition and Basic Rules',
  weight: '4-7%',
  subunits: [
    {
      code: '2.1',
      title: 'The derivative',
      content:
`**Derivative.** Instantaneous rate of change.

**Notations:** f′(x), df/dx, dy/dx, d/dx[f(x)].

**Definition:**
f′(x) = lim(h→0) [f(x + h) − f(x)] / h.

**Geometric:** slope of tangent line at point.

**Alternative form** (at point a):
f′(a) = lim(x→a) [f(x) − f(a)] / (x − a).

**Differentiable ⇒ continuous.** But continuous ⇏ differentiable.

**Not differentiable at:**
- Sharp corners (|x| at 0).
- Vertical tangents.
- Discontinuities.
- Cusps.

**Rate-of-change applications.**
- Position s(t): velocity = s′(t).
- Velocity v(t): acceleration = v′(t).
- Cost C(x): marginal cost = C′(x).`,
    },
    {
      code: '2.2',
      title: 'Basic derivative rules',
      content:
`**Power rule.** d/dx[x^n] = n·x^(n−1).
- d/dx[x³] = 3x².
- d/dx[√x] = d/dx[x^(1/2)] = (1/2)x^(−1/2).

**Constant rule.** d/dx[c] = 0.

**Constant multiple.** d/dx[c·f] = c·f′.

**Sum/difference.** d/dx[f ± g] = f′ ± g′.

**Trig derivatives.**
- d/dx[sin x] = cos x.
- d/dx[cos x] = −sin x.
- d/dx[tan x] = sec²x.
- d/dx[cot x] = −csc²x.
- d/dx[sec x] = sec x · tan x.
- d/dx[csc x] = −csc x · cot x.

**Exponential and log.**
- d/dx[eˣ] = eˣ.
- d/dx[a^x] = a^x · ln(a).
- d/dx[ln x] = 1/x.
- d/dx[log_a(x)] = 1/(x ln a).

**Inverse trig.**
- d/dx[arcsin x] = 1/√(1 − x²).
- d/dx[arccos x] = −1/√(1 − x²).
- d/dx[arctan x] = 1/(1 + x²).`,
    },
  ],
  keyConcepts: [
    'Derivative = limit of difference quotient.',
    'Power rule, sum, constant multiple.',
    'Trig: sin → cos, cos → −sin.',
    'e^x is its own derivative.',
    'ln x → 1/x.',
    'Differentiable ⇒ continuous.',
  ],
  practice: [
    { q: 'd/dx[3x⁴ − 2x + sin x].', a: '12x³ − 2 + cos x.' },
  ],
  pitfalls: [
    '"d/dx[x^n] = nx^n" — wrong; exponent decreases by 1.',
  ],
};
