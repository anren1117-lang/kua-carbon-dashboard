// AP Calc BC Unit 7 — Differential Equations

export const APCALCBC_UNIT_7 = {
  number: 7,
  title: 'Differential Equations',
  weight: '6-9%',
  subunits: [
    {
      code: '7.1',
      title: 'Slope fields and solutions',
      content:
`**Differential equation.** Equation involving derivatives.

**Solution.** Function satisfying the equation.

**General solution.** Family of solutions (with constants).

**Particular solution.** Specific solution from initial condition.

**Slope field.** Visual: at each grid point (x, y), draw short segment with slope dy/dx given by the DE.

**Reading slope fields:** sketch solution curves following the segments.

**Initial value problem (IVP).** DE plus condition y(x₀) = y₀.`,
    },
    {
      code: '7.2',
      title: 'Separation of variables',
      content:
`**Separation of variables.** When DE can be written as dy/dx = g(x)·h(y):
- Rearrange: dy/h(y) = g(x) dx.
- Integrate both sides.
- Solve for y (if asked).

**Example.** dy/dx = xy.
- dy/y = x dx.
- ln|y| = x²/2 + C.
- y = e^(x²/2 + C) = A·e^(x²/2).

**Example with IVP.** dy/dx = y, y(0) = 3.
- dy/y = dx.
- ln|y| = x + C.
- y = A·eˣ.
- y(0) = 3: A = 3.
- y = 3eˣ.

**Exponential growth/decay.** dy/dt = ky → y = y₀·eᵏᵗ.
- k > 0: growth.
- k < 0: decay.
- Half-life: time for y to halve.`,
    },
    {
      code: '7.3',
      title: 'Logistic differential equation (BC)',
      content:
`**Logistic DE.** dy/dt = k·y·(1 − y/L).

Models bounded growth (population approaching carrying capacity L).

**Behavior.**
- Small y: nearly exponential growth.
- y near L/2: fastest growth.
- y approaches L asymptotically.

**Solution.** y(t) = L / (1 + Ae^(−kt)) where A = (L − y₀)/y₀.

**Carrying capacity** = L.

**Inflection point** at y = L/2 (where growth rate is max).

**Applications.** Population (logistic), disease spread, market saturation.

**Euler\'s method (BC).** Numerical approximation.
- y_{n+1} = y_n + h · f(x_n, y_n).
- h = step size.
- Approximates solution to IVP.`,
    },
  ],
  keyConcepts: [
    'DE involves derivatives; solution is a function.',
    'Slope field visualizes solutions.',
    'Separation: dy/h(y) = g(x) dx; integrate both sides.',
    'Exponential model: dy/dt = ky → y = y₀eᵏᵗ.',
    'Logistic (BC): dy/dt = ky(1 − y/L); carrying capacity L.',
    'Inflection at L/2 (fastest growth).',
    'Euler\'s method (BC): y_{n+1} = y_n + h·f.',
  ],
  practice: [
    { q: 'Solve dy/dx = 2xy, y(0) = 1.', a: 'dy/y = 2x dx → ln|y| = x² + C → y = Ae^(x²). y(0)=1: A=1. y = e^(x²).' },
  ],
  pitfalls: [
    '"Logistic = exponential" — only for small y; bounded by L.',
  ],
};
