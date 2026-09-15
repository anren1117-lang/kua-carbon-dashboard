// AP Calculus AB Unit 4 — Contextual Applications of Differentiation (10-15%)

export const APCALCAB_UNIT_4 = {
  number: 4,
  title: 'Contextual Applications of Differentiation',
  weight: '10-15%',
  subunits: [
    {
      code: '4.1',
      title: 'Rate of change in applied contexts',
      content:
`Derivative = rate of change. Units matter.

**Position, velocity, acceleration.**
- s(t) = position.
- v(t) = s\'(t) = velocity.
- a(t) = v\'(t) = s\'\'(t) = acceleration.

**Worked example.** s(t) = t³ - 6t² + 9t (position in feet, t in seconds).
- v(t) = 3t² - 12t + 9.
- a(t) = 6t - 12.
- Velocity at t = 2: v(2) = 12 - 24 + 9 = -3 ft/s (moving backward).
- Object at rest when v = 0: 3t² - 12t + 9 = 0 → t = 1, 3.
- Speeds up when v and a have same sign; slows down when opposite signs.

**Other rates:**
- Population growth: dP/dt.
- Cost/revenue: marginal cost = dC/dQ.
- Heat flow: dQ/dt.
- Drug concentration: dC/dt.`,
    },
    {
      code: '4.2',
      title: 'Straight-line motion',
      content:
`**Position s(t), velocity v(t) = s\'(t), acceleration a(t) = v\'(t).**

**Speed = |v(t)|.** Speed is non-negative; velocity has direction.

**Object at rest** when v = 0.
**Moving right/up** when v > 0.
**Moving left/down** when v < 0.
**Accelerating** when v and a have same sign.
**Decelerating** when v and a have opposite signs.

**Total distance traveled** ≠ displacement.
- Displacement: s(b) - s(a).
- Total distance: integrate |v(t)| from a to b (Unit 8).`,
    },
    {
      code: '4.3',
      title: 'Related rates',
      content:
`When two quantities change together, derivatives related by chain rule.

**Steps:**
1. Draw and label.
2. Write equation relating variables.
3. Differentiate both sides w.r.t. t (time).
4. Plug in given values.
5. Solve.

**Classic example.** Ladder sliding down wall. Top slides down at 1 ft/s. How fast does bottom slide out when bottom is 4 ft from wall? Ladder is 5 ft.

- Variables: x = bottom distance, y = top height.
- Equation: x² + y² = 25.
- Differentiate: 2x(dx/dt) + 2y(dy/dt) = 0.
- When x = 4, y = 3. dy/dt = -1 (negative — top falling).
- 2(4)(dx/dt) + 2(3)(-1) = 0. 8(dx/dt) = 6. dx/dt = 3/4 ft/s.

**Common related rates problems**: cone draining, expanding balloon, shadow length, kite/airplane angles.`,
    },
    {
      code: '4.4',
      title: 'Linear approximation',
      content:
`Use tangent line to estimate function values.

**Tangent line equation** at x = a: L(x) = f(a) + f\'(a)(x - a).

**Linear approximation**: f(x) ≈ L(x) near a.

**Example.** Estimate √4.1.
f(x) = √x. f(4) = 2. f\'(x) = 1/(2√x). f\'(4) = 1/4.
L(x) = 2 + (1/4)(x - 4).
L(4.1) = 2 + (1/4)(0.1) = 2.025.
Actual: 2.0248. Close.

**Differential dy.** dy = f\'(x) dx. Tracks change in y for small change dx in x.

**Why useful.** Quick mental estimates; physics approximations; numerical methods.`,
    },
    {
      code: '4.5',
      title: 'L\'Hôpital\'s rule',
      content:
`For limits of form 0/0 or ∞/∞:
lim f(x)/g(x) = lim f\'(x)/g\'(x)

provided the second limit exists.

**Examples:**
- lim (x → 0) sin(x)/x = lim cos(x)/1 = 1. ✓
- lim (x → ∞) (e^x)/x² = lim e^x/(2x) = lim e^x/2 = ∞. Exponential beats polynomial.
- lim (x → 0) (1 - cos x)/x² = lim sin(x)/(2x) = lim cos(x)/2 = 1/2.

**Apply repeatedly** if still indeterminate.

**Other indeterminate forms.**
- 0 · ∞: rewrite as 0/0 or ∞/∞.
- ∞ - ∞: combine into single fraction.
- 0⁰, ∞⁰, 1^∞: take log.

**Not for limits that aren\'t indeterminate.** lim (x → 2) (x²)/(x-1) = 4/1 = 4. Don\'t apply L\'Hôpital.`,
    },
  ],
  keyConcepts: [
    'Position → velocity (derivative) → acceleration (2nd derivative).',
    'Speed = |velocity|. Speeds up when v, a same sign.',
    'Related rates: differentiate equation w.r.t. time; both quantities change.',
    'Tangent line approximation: f(x) ≈ f(a) + f\'(a)(x-a) near a.',
    'L\'Hôpital: for 0/0 or ∞/∞, lim f/g = lim f\'/g\'.',
  ],
  formulas: [
    {
      name: 'Tangent line',
      equation: 'L(x) = f(a) + f\'(a)(x - a)',
      meaning: 'Line touching curve at x = a with same slope.',
      example: 'For √x at x = 4: L(x) = 2 + (1/4)(x-4). L(4.1) ≈ 2.025.',
    },
    {
      name: 'L\'Hôpital',
      equation: 'lim f/g = lim f\'/g\'  (when 0/0 or ∞/∞)',
      meaning: 'Differentiate top and bottom separately.',
      example: 'lim sin(x)/x = lim cos(x)/1 = 1.',
    },
  ],
  practice: [
    {
      q: 'A spherical balloon\'s volume is V = (4/3)πr³. If air pumped at 10 cm³/s, find dr/dt when r = 5.',
      a: 'dV/dt = 4πr² · dr/dt. 10 = 4π(25) dr/dt. dr/dt = 10/(100π) = 1/(10π) cm/s.',
    },
    {
      q: 'Find lim (x → 0) (e^x - 1)/x using L\'Hôpital.',
      a: '0/0 → apply L\'Hôpital: lim e^x/1 = 1.',
    },
  ],
  pitfalls: [
    '"L\'Hôpital is the only way" — sometimes algebraic simplification is easier.',
    '"L\'Hôpital for any indeterminate" — must be 0/0 or ∞/∞ specifically. Convert others first.',
    '"Linear approximation always accurate" — only near a; gets worse far from a.',
  ],
};
