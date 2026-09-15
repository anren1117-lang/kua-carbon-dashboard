// AP Calc BC Unit 9 — Parametric, Polar, Vector-Valued Functions

export const APCALCBC_UNIT_9 = {
  number: 9,
  title: 'Parametric, Polar, Vector-Valued Functions (BC only)',
  weight: '11-12%',
  subunits: [
    {
      code: '9.1',
      title: 'Parametric curves',
      content:
`**Parametric curves** allow paths that aren\'t functions of x.

**Equations.** x = f(t), y = g(t).

**Direction of motion.** Curve traced as t increases.

**Eliminating parameter.** Express y in terms of x.
- Example: x = cos t, y = sin t. Then x² + y² = 1 (circle).

**Derivative.** dy/dx = (dy/dt)/(dx/dt) (when dx/dt ≠ 0).

**Tangent slope at specific t.** Plug in t.

**Horizontal tangent.** dy/dt = 0 and dx/dt ≠ 0.

**Vertical tangent.** dx/dt = 0 and dy/dt ≠ 0.

**Second derivative.** d²y/dx² = (d/dt)[dy/dx] / (dx/dt).`,
    },
    {
      code: '9.2',
      title: 'Vector-valued functions',
      content:
`**Vector-valued function.** r(t) = ⟨x(t), y(t)⟩.

Models particle motion in plane.

**Velocity vector.** v(t) = r′(t) = ⟨x′(t), y′(t)⟩.

**Speed.** |v(t)| = √((x′)² + (y′)²).

**Acceleration.** a(t) = v′(t) = ⟨x″(t), y″(t)⟩.

**Position from velocity.** Integrate.
- r(t) = ⟨∫x′ dt, ∫y′ dt⟩ + r(t₀).

**Particle motion problems.** Given v(t) and initial position, find position at later time.

**Distance traveled.** ∫(a to b) |v(t)| dt = ∫√((x′)² + (y′)²) dt.

**Same as arc length** of parametric curve.`,
    },
    {
      code: '9.3',
      title: 'Polar functions',
      content:
`**Polar coordinates.** r = distance from origin, θ = angle.

**Polar function.** r = f(θ).

**Conversion.** x = r cos θ, y = r sin θ.

**Common polar curves.**
- r = a (circle radius a).
- r = θ (Archimedean spiral).
- r = 1 + cos θ (cardioid).
- r = sin(2θ) (4-petal rose).
- r = cos(3θ) (3-petal rose).
- r² = sin(2θ) (lemniscate).

**Area in polar.** A = (1/2) ∫(α to β) [r(θ)]² dθ.

**Area between polar curves.** A = (1/2) ∫([r_outer]² − [r_inner]²) dθ.

**Tangent line slope.**
dy/dx = [r′(θ) sin θ + r(θ) cos θ] / [r′(θ) cos θ − r(θ) sin θ].

**Horizontal tangent.** dy/dθ = 0.
**Vertical tangent.** dx/dθ = 0.

**Polar derivatives.**
- dx/dθ = r′(θ) cos θ − r(θ) sin θ.
- dy/dθ = r′(θ) sin θ + r(θ) cos θ.`,
    },
  ],
  keyConcepts: [
    'Parametric: x = f(t), y = g(t); dy/dx = (dy/dt)/(dx/dt).',
    'Vector-valued: r = ⟨x, y⟩; velocity, speed, acceleration.',
    'Arc length parametric: ∫√((x′)² + (y′)²) dt.',
    'Polar: r = f(θ); conversion to xy.',
    'Polar area: (1/2)∫r² dθ.',
    'Common polar curves: circles, cardioids, roses, spirals.',
  ],
  practice: [
    { q: 'Particle position r(t) = ⟨t², t³⟩. Speed at t=1?', a: 'v(t) = ⟨2t, 3t²⟩. v(1) = ⟨2, 3⟩. |v(1)| = √13.' },
  ],
  pitfalls: [
    '"Polar area uses just ∫r dθ" — wrong; (1/2)∫r² dθ.',
  ],
};
