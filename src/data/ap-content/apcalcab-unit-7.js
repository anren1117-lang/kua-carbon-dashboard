// AP Calculus AB Unit 7 — Differential Equations (6-12%)

export const APCALCAB_UNIT_7 = {
  number: 7,
  title: 'Differential Equations',
  weight: '6-12%',
  subunits: [
    {
      code: '7.1',
      title: 'Modeling situations with differential equations',
      content:
`A **differential equation** involves derivatives of an unknown function.

**Examples:**
- dy/dx = 2x (find y).
- dy/dt = ky (exponential growth/decay).
- d²y/dt² = -g (free fall under gravity).
- dP/dt = kP(1 - P/K) (logistic growth).

**Solution to an ODE.** A function y(x) (or y(t)) that satisfies the equation when substituted.

**Real-world modeling.**
- Newton\'s second law: F = ma. m·d²x/dt² = F.
- Radioactive decay: dN/dt = -λN.
- Cooling: dT/dt = -k(T - T_room).
- Population growth (simple): dP/dt = kP.
- Tank mixing problems.

**Why differential equations?** Many natural laws are about rates. Solving the DE recovers the function describing the system.`,
    },
    {
      code: '7.2',
      title: 'Verifying solutions and slope fields',
      content:
`**Verify a solution.** Substitute proposed function and its derivatives into the DE; check both sides equal.

**Slope field.** Graph of slopes at many (x, y) points. Visualizes solution curves.

For each point (x, y), draw a small line segment with slope = dy/dx at that point.

**Reading slope fields:**
- Identify equilibrium solutions (where slopes are horizontal).
- Trace approximate solution curves from initial conditions.
- Notice patterns (exponential, logistic, sinusoidal).

**Worked example.** dy/dx = x - y. At (0, 0), slope = 0. At (1, 0), slope = 1. At (0, 1), slope = -1. Build slope field point by point.`,
    },
    {
      code: '7.3',
      title: 'Separation of variables',
      content:
`Solves DEs where dy/dx = f(x)g(y) (separable).

**Steps:**
1. Separate: dy/g(y) = f(x) dx.
2. Integrate both sides.
3. Solve for y if possible.
4. Apply initial condition to find C.

**Worked example.** dy/dx = xy with y(0) = 1.
- Separate: dy/y = x dx.
- Integrate: ln|y| = x²/2 + C.
- Exponentiate: |y| = e^(x²/2 + C) = K·e^(x²/2) where K = e^C.
- Apply y(0) = 1: 1 = K · 1, K = 1.
- Solution: y = e^(x²/2).

**Verify:** dy/dx = e^(x²/2) · x = xy. ✓`,
    },
    {
      code: '7.4',
      title: 'Exponential models',
      content:
`**Exponential growth/decay: dy/dt = ky.**

Solution: y(t) = y_0 · e^(kt).
- k > 0: growth.
- k < 0: decay.
- y_0 = initial value.

**Applications:**
- **Population growth** (unlimited): dP/dt = kP.
- **Radioactive decay**: dN/dt = -λN. Half-life t_{1/2} = ln(2)/λ.
- **Newton\'s cooling**: dT/dt = -k(T - T_a). T(t) = T_a + (T_0 - T_a)e^(-kt).
- **Drug elimination**: dC/dt = -kC.
- **Compound interest** (continuous): A = A_0 · e^(rt).

**Worked example.** Bacteria double every 3 hours. Starting at 100, how many after 9 hours?
P = P_0 · 2^(t/3). P(9) = 100 · 2³ = 800.

Or with k: P = 100 e^(kt). At t = 3, P = 200. So e^(3k) = 2 → k = ln(2)/3 ≈ 0.231.`,
    },
    {
      code: '7.5',
      title: 'Logistic growth',
      content:
`Real populations have **carrying capacity K** — limited resources. Logistic model:
dP/dt = kP(1 - P/K)

- Initial growth ~ exponential (small P).
- Slows as P approaches K.
- P → K as t → ∞.
- S-shaped curve (sigmoid).

Solution: P(t) = K / (1 + ((K - P_0)/P_0) e^(-kt)).

**Inflection point** at P = K/2 — where growth rate is maximum.

**Applications:**
- Population biology (yeast, fish, deer).
- Epidemic spread (until immunity).
- Technology adoption.
- Plant growth.

**Limitations.** Real systems can overshoot, oscillate, crash.`,
    },
  ],
  keyConcepts: [
    'DE involves derivatives. Solution: function satisfying equation.',
    'Slope fields visualize solution curves at every point.',
    'Separation of variables for separable DEs.',
    'Exponential model dy/dt = ky → y = y_0 e^(kt).',
    'Logistic dy/dt = kP(1-P/K) → S-curve approaching carrying capacity.',
    'Applications: population, decay, cooling, drug clearance.',
  ],
  formulas: [
    {
      name: 'Exponential model',
      equation: 'y(t) = y_0 e^(kt)  (from dy/dt = ky)',
      meaning: 'Growth (k>0) or decay (k<0). Half-life = ln(2)/|k|.',
      example: 'C-14: half-life 5730 yr → k = -ln(2)/5730.',
    },
  ],
  practice: [
    {
      q: 'Solve dy/dx = 2xy with y(0) = 1.',
      a: 'Separate: dy/y = 2x dx. Integrate: ln|y| = x² + C. y(0) = 1: C = 0. y = e^(x²).',
    },
    {
      q: 'A drug clears the bloodstream with half-life 4 hours. After 12 hours, what fraction of initial dose remains?',
      a: '12 hours = 3 half-lives. Fraction = (1/2)³ = 1/8.',
    },
  ],
  pitfalls: [
    '"Solving DE always means explicit y" — sometimes implicit is final form.',
    '"Exponential growth never stops" — model breaks down due to resource limits (use logistic instead).',
  ],
};
