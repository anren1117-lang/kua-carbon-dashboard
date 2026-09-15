// AP Physics 1 Unit 2 — Force and Translational Dynamics

export const APPHYS1_UNIT_2 = {
  number: 2,
  title: 'Force and Translational Dynamics',
  weight: '14-20%',
  subunits: [
    {
      code: '2.1',
      title: 'Forces and free-body diagrams',
      content:
`**Force.** Push or pull. Vector. Units: newton (N) = kg·m/s².

**Common forces:**
- **Gravity / weight (W)**: W = m·g. Always downward.
- **Normal force (N)**: perpendicular to surface. Pushes object away from surface.
- **Friction (f)**: parallel to surface; opposes motion or tendency.
- **Tension (T)**: along a rope/string, pulling.
- **Applied force (F_app)**: anything pushing/pulling directly.
- **Spring force**: F = −k·x (Hooke\'s law).

**Free-body diagram (FBD).**
- Draw object as a dot or box.
- Draw every force as arrow from center, pointing in direction of force.
- Label each.
- Don\'t draw motion or velocity arrows.

**Resolving forces into components.** For force F at angle θ from x-axis:
- F_x = F·cos(θ).
- F_y = F·sin(θ).

**Inclined planes.** Tilt your coordinate system to align x with surface.
- Gravity components: mg·sin(θ) along surface (down-slope), mg·cos(θ) perpendicular.
- Normal force = mg·cos(θ) (no other ⊥ force).`,
    },
    {
      code: '2.2',
      title: "Newton's laws",
      content:
`**1st law (inertia).** Object at rest stays at rest; object in motion continues at constant velocity, unless net force acts.
- "Net force" matters, not "force." If forces cancel, no acceleration.
- Inertia = resistance to change in motion. Quantified by mass.

**2nd law.** F_net = m·a.
- Sum of all forces causes acceleration in same direction.
- More mass → less acceleration for same force.
- This is the workhorse equation.

**3rd law.** For every action, equal and opposite reaction.
- Forces always come in pairs.
- Pair acts on **different objects** (not the same!).
- Example: you push wall (action), wall pushes you (reaction). Both feel forces.

**Common misuses of 3rd law.**
- "If forces are equal and opposite, why does anything move?" — They act on different objects. Net force on one object is what matters.

**Solving F_net problems.**
1. Draw FBD.
2. Choose axes.
3. Sum forces in each direction.
4. F_net,x = m·a_x; F_net,y = m·a_y.
5. Solve for unknown.`,
    },
    {
      code: '2.3',
      title: 'Friction',
      content:
`**Friction.** Force opposing relative motion or tendency to slide. Caused by microscopic interactions between surfaces.

**Static friction (f_s).**
- Opposes tendency to start sliding.
- Range: 0 ≤ f_s ≤ μ_s·N.
- Adjusts to match applied force, up to maximum.
- Once max exceeded, object slips.

**Kinetic friction (f_k).**
- Opposes motion when surfaces sliding.
- f_k = μ_k·N (approximately).
- Usually μ_k < μ_s (harder to start than keep moving).

**μ (mu) — coefficient of friction.**
- Dimensionless number, depends on surface pair.
- Rough surfaces: high μ. Smooth/lubricated: low.
- Typical values: rubber on dry concrete ~1.0; ice on ice ~0.03.

**Friction does NOT depend on:**
- Contact area (for macroscopic objects).
- Speed (kinetic friction nearly constant).

**Friction problems.**
- Identify if static (no slip) or kinetic (sliding).
- Compute normal force first.
- Then f = μ·N.

**Inclined plane with friction.**
- Object slides when m·g·sin(θ) > μ_s·m·g·cos(θ).
- → tan(θ_critical) = μ_s.`,
    },
    {
      code: '2.4',
      title: 'Translational equilibrium and Atwood machines',
      content:
`**Equilibrium.** Net force = 0 (constant velocity or at rest).
- Static equilibrium: at rest, a = 0.
- Dynamic equilibrium: moving at constant v, a = 0.

**Equations:** ΣF_x = 0 and ΣF_y = 0.

**Example: hanging sign.**
- Two cables pulling up at angles.
- Weight pulls down.
- Resolve cable tensions into x, y; solve simultaneous equations.

**Atwood machine.** Two masses connected by string over pulley.
- Both have same acceleration magnitude (string inextensible).
- Tension same throughout (massless string, frictionless pulley).
- For masses m_1 > m_2:
  - a = (m_1 − m_2)·g / (m_1 + m_2).
  - T = 2·m_1·m_2·g / (m_1 + m_2).

**Connected objects in general.**
- Treat as system (combined mass) to find acceleration.
- Or individual FBDs to find internal tensions.

**Elevator problems.** Apparent weight depends on elevator acceleration.
- At rest or constant v: apparent = mg (normal).
- Accelerating up: N = m(g + a) → feels heavier.
- Accelerating down: N = m(g − a) → feels lighter.
- Free fall: N = 0 (weightless).`,
    },
  ],
  keyConcepts: [
    'Force = push/pull, vector, units N.',
    'Free-body diagram: every force as arrow from object.',
    'Newton\'s 2nd: F_net = m·a.',
    'Newton\'s 3rd: forces in pairs on DIFFERENT objects.',
    'Friction: f_s ≤ μ_s·N (static), f_k = μ_k·N (kinetic).',
    'Equilibrium: ΣF = 0 (constant velocity).',
    'Atwood: a = (m_1−m_2)g / (m_1+m_2).',
    'Apparent weight in accelerating elevator: m(g±a).',
  ],
  practice: [
    {
      q: 'A 5 kg box on frictionless incline at 30°. Acceleration down slope?',
      a: 'a = g·sin(30°) = 9.8·0.5 = 4.9 m/s².',
    },
  ],
  pitfalls: [
    '"3rd law pair cancels" — they act on different objects; never cancel.',
    '"Heavier means more friction" — only via more normal force; μ same.',
  ],
};
