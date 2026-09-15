// AP Physics C: Mechanics Unit 1 — Kinematics

export const APPHYSCMECH_UNIT_1 = {
  number: 1,
  title: 'Kinematics',
  weight: '10-15%',
  subunits: [
    {
      code: '1.1',
      title: 'Calculus-based kinematics',
      content:
`Calc-based mechanics uses derivatives and integrals.

**Position x(t).**

**Velocity.** v(t) = dx/dt.

**Acceleration.** a(t) = dv/dt = d²x/dt².

**Integrating.**
- ∫a dt = v + C.
- ∫v dt = x + C.

**Constant acceleration kinematic equations** (special case):
- v = v_0 + at.
- x = x_0 + v_0t + ½at².
- v² = v_0² + 2a(x − x_0).

**Variable acceleration.** Use calculus.

**Example.** a(t) = 6t (constant velocity unchanged: not at rest, etc.).
- v(t) = ∫6t dt = 3t² + v_0.
- x(t) = ∫(3t² + v_0)dt = t³ + v_0t + x_0.`,
    },
    {
      code: '1.2',
      title: '2D motion and vectors',
      content:
`**Position vector.** r(t) = x(t)î + y(t)ĵ.

**Velocity vector.** v(t) = dr/dt = (dx/dt)î + (dy/dt)ĵ.

**Acceleration vector.** a(t) = dv/dt.

**Each component independent.** Treat x and y separately.

**Projectile motion.**
- a_x = 0; a_y = −g.
- x = x_0 + v_0x·t.
- y = y_0 + v_0y·t − ½gt².

**Magnitude and direction.**
- |v| = √(v_x² + v_y²).
- angle = arctan(v_y/v_x).

**Speed = |velocity|. Velocity is vector.**

**Special results for constant g.**
- Range (level ground): R = v_0²sin(2θ)/g.
- Max height: h = (v_0sin θ)²/(2g).
- Time of flight: T = 2v_0sin(θ)/g.`,
    },
  ],
  keyConcepts: [
    'v = dx/dt; a = dv/dt.',
    '∫a dt = v; ∫v dt = x.',
    'Constant a kinematic equations special case.',
    '2D: components independent.',
    'Projectile: a_x = 0, a_y = −g.',
    'Range max at θ = 45°.',
  ],
  practice: [
    { q: 'a(t) = 4t. v(0) = 2. Find v(3).', a: 'v(t) = 2t² + 2; v(3) = 18 + 2 = 20.' },
  ],
  pitfalls: [
    '"Use constant-a equations for any a" — only for constant a.',
  ],
};
