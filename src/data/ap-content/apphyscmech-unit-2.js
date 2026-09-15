// AP Physics C: Mechanics Unit 2 — Newton's Laws

export const APPHYSCMECH_UNIT_2 = {
  number: 2,
  title: "Newton's Laws of Motion",
  weight: '20-25%',
  subunits: [
    {
      code: '2.1',
      title: "Newton's laws — calculus form",
      content:
`**First law.** Inertia. Object at rest stays at rest; in motion continues, unless net F.

**Second law.** F_net = ma = m·dv/dt = dp/dt.
- p = mv (momentum).
- More general: F = dp/dt.
- For constant mass: F = ma.

**Third law.** Action-reaction pairs.

**Free-body diagrams.**

**Common forces.**
- Weight: W = mg, down.
- Normal: perpendicular to surface.
- Friction: parallel; f_s ≤ μ_s N (static), f_k = μ_k N (kinetic).
- Tension.
- Spring: F = −kx (Hooke).
- Drag: often F = −bv (linear) or F = −cv² (quadratic).`,
    },
    {
      code: '2.2',
      title: 'Velocity-dependent forces and differential equations',
      content:
`**Drag.** Resistive force, often proportional to v (low speed) or v² (high speed).

**Falling with linear drag.** F = mg − bv (down).
- ma = mg − bv.
- dv/dt = g − (b/m)v.
- Solution: v(t) = (mg/b)(1 − e^(−bt/m)) (starting from rest).
- Terminal velocity: v_t = mg/b (when a = 0).

**ODE technique.** Separation of variables.
- dv/(g − (b/m)v) = dt.
- Integrate both sides.

**Application.** Skydiver, falling raindrops.

**Quadratic drag.** F = cv². ODE harder; same idea.`,
    },
    {
      code: '2.3',
      title: 'Inertial vs non-inertial frames',
      content:
`**Inertial frame.** Newton\'s laws hold.

**Non-inertial (accelerating) frame.** Pseudo-forces (centrifugal, Coriolis) appear.

**Common situations.**
- Car accelerating: feel "thrown back" — pseudo force.
- Rotating reference frame: centrifugal force (outward), Coriolis (perpendicular to velocity).
- Earth rotation: weather patterns, ocean currents affected.

**For AP exam.** Usually use inertial frames; treat acceleration via real forces.`,
    },
  ],
  keyConcepts: [
    'F = dp/dt; F = ma for constant m.',
    'Forces: weight, normal, friction, tension, spring, drag.',
    'Drag: F = −bv or F = −cv².',
    'Terminal velocity when drag = weight.',
    'ODE: separation of variables.',
    'Pseudo-forces in non-inertial frames.',
  ],
  practice: [
    { q: 'Block on incline angle θ, no friction. Acceleration?', a: 'a = g sin θ down the incline.' },
  ],
  pitfalls: [
    '"F = ma" works for variable mass — actually F = dp/dt is the general form.',
  ],
};
