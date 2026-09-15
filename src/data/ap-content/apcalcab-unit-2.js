// AP Calculus AB Unit 2 — Differentiation: Definition and Fundamental Properties (10-12%)

export const APCALCAB_UNIT_2 = {
  number: 2,
  title: 'Differentiation: Definition and Fundamental Properties',
  weight: '10-12%',
  subunits: [
    {
      code: '2.1',
      title: 'Defining average and instantaneous rates of change',
      content:
`**Average rate of change** of f on [a, b]:
ARC = (f(b) - f(a)) / (b - a)

Same as slope of secant line through (a, f(a)) and (b, f(b)).

**Instantaneous rate of change** at x = a: limit of average rates as the interval shrinks.

**Example.** Position s(t) = t². Average velocity from t = 1 to t = 3: (9 - 1)/(3 - 1) = 4. Instantaneous velocity at t = 1: ?

Compute average over [1, 1+h]: ((1+h)² - 1)/h = (1 + 2h + h² - 1)/h = 2 + h. As h → 0: instantaneous velocity = 2.

This is the **derivative**.`,
    },
    {
      code: '2.2',
      title: 'Defining the derivative',
      content:
`**Derivative of f at a:**
f\'(a) = lim (h → 0) [f(a + h) - f(a)] / h

Equivalent form:
f\'(a) = lim (x → a) [f(x) - f(a)] / (x - a)

**Geometric**: slope of tangent line to f at x = a.
**Physical**: instantaneous rate of change.

**Derivative as a function:**
f\'(x) = lim (h → 0) [f(x + h) - f(x)] / h

**Notation:**
f\'(x), df/dx, dy/dx, Df, D_x[f]

**Worked example.** Find f\'(x) for f(x) = x².
f\'(x) = lim (h → 0) [(x+h)² - x²]/h = lim [x² + 2xh + h² - x²]/h = lim (2x + h) = 2x.`,
    },
    {
      code: '2.3',
      title: 'Estimating derivatives',
      content:
`**From a graph.** Draw tangent line; estimate slope.
**From a table.** Use difference quotient with small h.

**Numerical derivative:**
f\'(a) ≈ [f(a + h) - f(a)] / h (forward difference)
f\'(a) ≈ [f(a) - f(a - h)] / h (backward difference)
f\'(a) ≈ [f(a + h) - f(a - h)] / (2h) (symmetric — most accurate)

**Calculator** can compute nDeriv (numerical derivative).`,
    },
    {
      code: '2.4',
      title: 'Connecting differentiability and continuity',
      content:
`**Differentiable implies continuous.** If f\'(a) exists, then f is continuous at a.

**Continuous does NOT imply differentiable.** f could be continuous but not differentiable (cusp, corner, vertical tangent).

**Examples of non-differentiability:**
- **Corner**: |x| at x = 0. Left derivative = -1, right = +1, not equal.
- **Cusp**: x^(2/3) at x = 0. Both derivatives → ∞.
- **Vertical tangent**: x^(1/3) at x = 0. Derivative → ∞.
- **Discontinuity**: derivative can\'t exist where function isn\'t continuous.`,
    },
    {
      code: '2.5',
      title: 'Power rule and basic derivatives',
      content:
`**Power rule:** d/dx [xⁿ] = n·x^(n-1).

Examples:
- d/dx [x³] = 3x².
- d/dx [x] = 1.
- d/dx [1] = 0 (constant).
- d/dx [1/x] = d/dx [x⁻¹] = -x⁻² = -1/x².
- d/dx [√x] = d/dx [x^(1/2)] = (1/2)x^(-1/2) = 1/(2√x).

**Sum/difference rule:** d/dx [f ± g] = f\' ± g\'.

**Constant multiple:** d/dx [c·f] = c·f\'.

**Basic derivatives to memorize:**
- d/dx [sin x] = cos x.
- d/dx [cos x] = -sin x.
- d/dx [tan x] = sec²x.
- d/dx [eˣ] = eˣ.
- d/dx [ln x] = 1/x.
- d/dx [a^x] = a^x · ln(a).
- d/dx [log_a(x)] = 1/(x·ln(a)).`,
    },
    {
      code: '2.6',
      title: 'Product and quotient rules',
      content:
`**Product rule:** d/dx [f·g] = f\'g + fg\'.

Example: d/dx [x² · sin x] = 2x·sin x + x²·cos x.

**Quotient rule:** d/dx [f/g] = (f\'g - fg\')/g².

Example: d/dx [sin x / x] = (cos x · x - sin x · 1)/x² = (x·cos x - sin x)/x².

Memory aid: "Low D-high minus high D-low, over low squared."

**Worked example.** d/dx [(x² + 1)/(x - 2)].
= [(2x)(x-2) - (x²+1)(1)] / (x-2)²
= [2x² - 4x - x² - 1] / (x-2)²
= (x² - 4x - 1) / (x-2)².`,
    },
    {
      code: '2.7',
      title: 'Derivatives of trig, exp, log',
      content:
`**Trig derivatives:**
- d/dx [sin x] = cos x.
- d/dx [cos x] = -sin x.
- d/dx [tan x] = sec²x.
- d/dx [csc x] = -csc x · cot x.
- d/dx [sec x] = sec x · tan x.
- d/dx [cot x] = -csc²x.

**Exponential:**
- d/dx [eˣ] = eˣ (unique!).
- d/dx [a^x] = a^x · ln(a).

**Logarithmic:**
- d/dx [ln x] = 1/x.
- d/dx [log_a x] = 1/(x · ln a).

**Combine with chain rule** for more complex cases. (Chain rule in Unit 3.)

Memorize these — they appear constantly.`,
    },
  ],
  keyConcepts: [
    'Average rate of change = (f(b)-f(a))/(b-a).',
    'Instantaneous = derivative = lim of difference quotient.',
    'f\'(a) = lim (h→0) [f(a+h) - f(a)]/h.',
    'Geometric: slope of tangent. Physical: instantaneous rate.',
    'Differentiable → continuous; continuous doesn\'t imply differentiable.',
    'Power rule: d/dx xⁿ = nx^(n-1).',
    'Product, quotient rules.',
    'Memorize trig, exp, log derivatives.',
  ],
  formulas: [
    {
      name: 'Derivative definition',
      equation: 'f\'(a) = lim (h→0) [f(a+h) - f(a)]/h',
      meaning: 'Foundational definition of derivative.',
      example: 'f(x) = x² → f\'(a) = 2a.',
    },
    {
      name: 'Power rule',
      equation: 'd/dx[xⁿ] = nx^(n-1)',
      meaning: 'Works for all real n.',
      example: 'd/dx[x^5] = 5x^4. d/dx[√x] = 1/(2√x).',
    },
  ],
  practice: [
    {
      q: 'Find f\'(x) for f(x) = 3x² · sin(x).',
      a: 'Product rule: f\' = 6x sin x + 3x² cos x.',
    },
    {
      q: 'Find f\'(x) for f(x) = (x²+1)/(x³).',
      a: 'Quotient: ((2x)(x³) - (x²+1)(3x²))/(x⁶) = (2x⁴ - 3x⁴ - 3x²)/x⁶ = (-x⁴ - 3x²)/x⁶ = -1/x² - 3/x⁴.',
    },
  ],
  pitfalls: [
    '"Power rule works for x^x" — no, need logarithmic differentiation.',
    '"Continuous = differentiable" — wrong. |x| is continuous but not differentiable at 0.',
    '"Product rule: f\'·g\'" — wrong. f\'g + fg\'.',
  ],
};
