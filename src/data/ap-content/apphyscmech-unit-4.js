// AP Physics C: Mechanics Unit 4 — Systems of Particles and Linear Momentum

export const APPHYSCMECH_UNIT_4 = {
  number: 4,
  title: 'Systems of Particles and Linear Momentum',
  weight: '10-20%',
  subunits: [
    {
      code: '4.1',
      title: 'Momentum and impulse',
      content:
`**Momentum.** p = mv. Vector.

**Impulse.** J = ∫F dt = Δp.

**Newton\'s 2nd:** F = dp/dt.

**Conservation of momentum.** If F_ext = 0, total p constant.

**Collisions.**
- Elastic: KE conserved + p conserved.
- Inelastic: only p conserved.
- Perfectly inelastic: stick together.

**Elastic collision 1D.** Two equations (p and KE).
- Closed form: v_1f = ((m_1−m_2)v_1i + 2m_2v_2i)/(m_1+m_2).
- Similarly for v_2f.

**Coefficient of restitution.** e = (v_2f − v_1f)/(v_1i − v_2i). e = 1 elastic; e = 0 perfectly inelastic.`,
    },
    {
      code: '4.2',
      title: 'Center of mass',
      content:
`**Center of mass (COM).** Weighted average position.
- Two particles: x_cm = (m_1x_1 + m_2x_2)/(m_1+m_2).
- Continuous distribution: x_cm = (∫x dm)/M.

**COM velocity.** v_cm = (m_1v_1 + m_2v_2)/(m_1+m_2) = P_total/M.

**COM acceleration.** F_ext = M·a_cm.

**Properties.**
- COM moves as if all mass concentrated, with net external force applied.
- Internal forces don\'t affect COM.
- For isolated system, COM has constant velocity.

**Reduced mass (2-body).** μ = m_1m_2/(m_1+m_2).
- Two-body problem reduces to one-body with reduced mass.

**Variable mass systems.** Rockets.
- Thrust = v_rel · (dm/dt).
- Rocket equation: Δv = v_e · ln(m_0/m).`,
    },
  ],
  keyConcepts: [
    'p = mv; F = dp/dt.',
    'J = ∫F dt = Δp.',
    'Conservation: p_total constant if no external F.',
    'Elastic: p and KE both conserved.',
    'Inelastic: only p.',
    'COM: weighted avg position.',
    'F_ext = M·a_cm.',
    'Rocket equation: Δv = v_e·ln(m_0/m).',
  ],
  practice: [
    { q: 'Two 2kg carts approach at 3m/s each. Elastic collision. Final velocities?', a: 'Equal masses elastic: swap velocities. v_1f = −3, v_2f = +3 (they reverse).' },
  ],
  pitfalls: [
    '"KE always conserved" — only elastic.',
  ],
};
