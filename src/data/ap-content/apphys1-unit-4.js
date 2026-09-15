// AP Physics 1 Unit 4 — Linear Momentum

export const APPHYS1_UNIT_4 = {
  number: 4,
  title: 'Linear Momentum',
  weight: '10-15%',
  subunits: [
    {
      code: '4.1',
      title: 'Momentum and impulse',
      content:
`**Momentum (p).** p = m·v. Vector. Units: kg·m/s.

**Impulse (J).** Change in momentum. J = Δp = F·Δt.

**Impulse-momentum theorem.** F·Δt = m·Δv.
- Same Δp can come from: big force / short time OR small force / long time.

**Why airbags work.** Increase Δt → decrease F for same Δp (your momentum change).
- Same for crumple zones, padded helmets, soft landing surfaces.

**Variable force.** Impulse = area under F-vs-t graph.

**Examples:**
- 1000 kg car at 20 m/s: p = 20,000 kg·m/s.
- Brake stops in 5 s: F = 20,000 / 5 = 4000 N.
- Hit wall, stops in 0.1 s: F = 200,000 N. 50× more.

**Momentum vs KE.**
- Both depend on m and v.
- Momentum: linear in v (vector).
- KE: quadratic in v (scalar).
- 2× speed → 2× momentum but 4× KE.`,
    },
    {
      code: '4.2',
      title: 'Conservation of momentum',
      content:
`**System.** Set of objects you care about.

**Law of conservation of momentum.** Total momentum of isolated system constant.
- Isolated = no external forces (or external forces sum to zero).
- Internal forces (collisions, explosions) don\'t change total p.

Why: 3rd-law pairs cancel internally.

**Equations.** For two objects:
- Before: p_total = m_1·v_1 + m_2·v_2.
- After: p_total = m_1·v_1' + m_2·v_2'.
- Set equal.

**Vector equation.** Treat components independently.

**External forces.** Brief collision: gravity and friction often small over the brief Δt, so momentum approximately conserved during the collision even if not over long time.

**Application: rocket propulsion.**
- Rocket throws exhaust backward → momentum forward.
- Total p of (rocket + exhaust) conserved.`,
    },
    {
      code: '4.3',
      title: 'Collisions',
      content:
`Two types of collisions.

**Elastic.** KE conserved (and momentum). Objects bounce.
- Examples: billiard balls (nearly), atoms in gas.
- p AND KE conservation gives two equations → solve for two unknowns.

**Inelastic.** KE NOT conserved (energy lost to heat, sound, deformation). Momentum IS conserved.
- Most real collisions.

**Perfectly inelastic.** Objects stick together. Maximum KE loss.
- Common in problems.
- (m_1·v_1 + m_2·v_2) = (m_1+m_2)·v_f.
- v_f = (m_1·v_1 + m_2·v_2)/(m_1+m_2).

**Example: 2 kg at 5 m/s hits 3 kg at rest, sticks.**
- v_f = (2·5 + 3·0)/(2+3) = 10/5 = 2 m/s.
- KE before = ½·2·25 = 25 J.
- KE after = ½·5·4 = 10 J.
- 15 J lost to heat/sound/deformation.

**Explosions.** Reverse of inelastic. Single object → fragments.
- Total p before = 0 (if at rest); pieces fly apart with equal and opposite p.

**2D collisions.** Conserve p_x and p_y separately.`,
    },
    {
      code: '4.4',
      title: 'Center of mass',
      content:
`**Center of mass (COM).** Average position weighted by mass.

For two objects: x_cm = (m_1·x_1 + m_2·x_2) / (m_1 + m_2).

**Properties:**
- COM moves as if all mass concentrated there with net external force applied.
- For isolated system, COM has constant velocity.
- Internal forces don\'t move COM.

**Example: exploding shell.**
- Shell explodes mid-air; pieces fly off in many directions.
- COM continues original trajectory (still under gravity only).

**For symmetric uniform objects.** COM at geometric center.

**For two-mass system.** COM between masses; closer to heavier.

**Tip:** Many problems become simpler in COM frame (frame where total p = 0).`,
    },
  ],
  keyConcepts: [
    'Momentum p = m·v; vector.',
    'Impulse = F·Δt = Δp.',
    'Airbags increase Δt to reduce F for same Δp.',
    'Momentum conserved in isolated system (external F = 0).',
    'Collisions: elastic conserves KE; inelastic doesn\'t. Both conserve p.',
    'Perfectly inelastic: stick together, max KE loss.',
    'Explosions: reverse of inelastic; total p still conserved.',
    'COM moves with constant velocity for isolated system.',
  ],
  practice: [
    {
      q: '2 kg cart at 4 m/s hits 6 kg cart at rest, sticks. Final velocity?',
      a: 'v_f = (2·4 + 6·0)/(2+6) = 8/8 = 1 m/s.',
    },
  ],
  pitfalls: [
    '"KE always conserved in collisions" — only in elastic.',
    '"Momentum is a scalar" — vector; must keep direction.',
  ],
};
