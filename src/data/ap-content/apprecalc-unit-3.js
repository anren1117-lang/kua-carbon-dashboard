// AP Precalculus Unit 3 — Trigonometric and Polar Functions

export const APPRECALC_UNIT_3 = {
  number: 3,
  title: 'Trigonometric and Polar Functions',
  weight: '30-35%',
  subunits: [
    {
      code: '3.1',
      title: 'Periodic functions and trig',
      content:
`**Periodic function.** Repeats: f(x + T) = f(x).
- T = period.

**Sinusoidal.** sin and cos.
- Amplitude = max displacement from middle.
- Period.
- Midline.
- Phase shift (horizontal).

**Unit circle.** Radius 1 circle centered at origin.
- Point on circle at angle θ: (cos θ, sin θ).

**Key angles.**
- 0, π/6 (30°), π/4 (45°), π/3 (60°), π/2 (90°), π (180°), 3π/2 (270°), 2π (360°).
- Memorize values.

**Sine/cosine signs by quadrant.**
- Q1: both +.
- Q2: sin +, cos −.
- Q3: both −.
- Q4: cos +, sin −.

**Tangent.** tan θ = sin θ / cos θ.

**Reciprocal trig.**
- csc = 1/sin.
- sec = 1/cos.
- cot = 1/tan.

**Even/odd properties.**
- cos: even.
- sin, tan: odd.

**Pythagorean identity.** sin²θ + cos²θ = 1.

**Derived.** tan²θ + 1 = sec²θ. 1 + cot²θ = csc²θ.`,
    },
    {
      code: '3.2',
      title: 'Transformations of trig functions',
      content:
`**General sinusoidal.** y = A·sin(B(x − C)) + D.
- A = amplitude.
- 2π/B = period.
- C = phase shift.
- D = vertical shift / midline.

**Reading from graph.**
- Amplitude = (max − min)/2.
- Midline = (max + min)/2.
- Period from one full cycle.

**Modeling periodic phenomena.**
- Tide cycles.
- Hours of daylight.
- Sound and light waves.
- Heart rhythms.
- Seasonal variations.

**Frequency.** f = 1/T. Cycles per unit time.

**Angular frequency.** ω = 2π/T. Radians per unit time.

**Phase.** Position within cycle.

**Two sinusoids.** y₁ = A₁ sin(ωt) + A₂ cos(ωt) can be written as single sinusoid: y = R sin(ωt + φ).
- R = √(A₁² + A₂²).
- tan φ = A₂/A₁.

**Sum and difference formulas.**
- sin(A ± B) = sin A cos B ± cos A sin B.
- cos(A ± B) = cos A cos B ∓ sin A sin B.

**Double angle.**
- sin(2θ) = 2 sin θ cos θ.
- cos(2θ) = cos²θ − sin²θ = 1 − 2sin²θ = 2cos²θ − 1.`,
    },
    {
      code: '3.3',
      title: 'Polar coordinates and graphs',
      content:
`**Polar coordinates.** (r, θ).
- r = distance from origin.
- θ = angle from positive x-axis.

**Conversion.**
- x = r cos θ, y = r sin θ.
- r = √(x² + y²), tan θ = y/x (with quadrant).

**Polar equations.**
- r = constant: circle.
- θ = constant: line through origin.
- r = a + b cos θ: limacon.
- r = a + a cos θ: cardioid.
- r = a sin(nθ) or a cos(nθ): rose (n even: 2n petals; n odd: n petals).
- r² = a² sin(2θ): lemniscate.

**Graphing in polar.**
- Plot (r, θ) points.
- Use symmetry where possible.

**Symmetry tests.**
- Replace θ with −θ: symmetric about x-axis.
- Replace θ with π−θ: symmetric about y-axis.
- Replace r with −r and θ with π+θ: symmetric about origin.

**Rates of change in polar.**
- dr/dθ tells how r changes with θ.
- Increasing/decreasing intervals.

**Common applications.**
- Spirals.
- Planetary motion (elliptical orbits with polar equations).
- Antennas, radar patterns.`,
    },
  ],
  keyConcepts: [
    'Periodic: f(x + T) = f(x).',
    'Unit circle: (cos θ, sin θ).',
    'sin²θ + cos²θ = 1.',
    'sinusoid: A sin(B(x−C)) + D; period 2π/B; amp A.',
    'Sum/difference and double-angle formulas.',
    'Polar: r = distance, θ = angle.',
    'x = r cos θ, y = r sin θ.',
    'Common polar curves: cardioid, rose, lemniscate.',
  ],
  practice: [
    { q: 'Sinusoid y = 3 sin(2x). Amplitude? Period?', a: 'A=3, T=2π/2=π.' },
  ],
  pitfalls: [
    '"Period of sin(Bx) = 2π" — wrong; 2π/B.',
  ],
};
