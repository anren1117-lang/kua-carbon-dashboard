// AP Physics 1 Unit 5 — Torque and Rotational Dynamics

export const APPHYS1_UNIT_5 = {
  number: 5,
  title: 'Torque and Rotational Dynamics',
  weight: '10-15%',
  subunits: [
    {
      code: '5.1',
      title: 'Rotational kinematics',
      content:
`Rotational motion mirrors translational, with angular variables.

**Angular position (θ).** In radians. 2π rad = 360°.
**Angular velocity (ω).** Rate of angle change. ω = dθ/dt. Units rad/s.
**Angular acceleration (α).** Rate of ω change. α = dω/dt. Units rad/s².

**Kinematic equations (constant α):** same form as linear.
- ω = ω_0 + α·t.
- θ = θ_0 + ω_0·t + ½·α·t².
- ω² = ω_0² + 2·α·(θ − θ_0).

**Relating angular to linear (point on rotating object at radius r):**
- s = r·θ (arc length).
- v = r·ω (tangential speed).
- a_t = r·α (tangential acceleration).
- a_c = v²/r = ω²·r (centripetal acceleration, toward center).

**Period and frequency.**
- T = period = 2π/ω.
- f = frequency = 1/T = ω/(2π).
- ω = 2π·f (angular frequency).

**Direction.** Right-hand rule. ω vector along axis of rotation.`,
    },
    {
      code: '5.2',
      title: 'Torque',
      content:
`**Torque (τ).** Rotational analog of force.

**τ = r·F·sin(θ)** where:
- r = distance from pivot to application point.
- F = applied force.
- θ = angle between r and F.

Units: N·m.

**Lever arm (perpendicular distance from line of action to pivot).**
- τ = F·d_⊥.

**Direction.** Convention: CCW positive, CW negative.

**Net torque.** Sum of all torques about chosen pivot.

**Why doors have handles far from hinge.** Maximize r → less F needed for same τ.

**Why long wrenches loosen tight bolts.** Same reason.

**Couples.** Two equal-opposite forces with offset → pure rotation (no translation).`,
    },
    {
      code: '5.3',
      title: 'Rotational equilibrium',
      content:
`**Equilibrium conditions.**
- ΣF = 0 (translational).
- Στ = 0 (rotational).

**Balance problems.** Object balanced on pivot.
- Sum torques about any point — usually pick pivot or point with unknown to eliminate.

**Example: seesaw.**
- Heavier kid sits closer to pivot to balance.
- m_1·d_1 = m_2·d_2.

**Beam supported at one end, with weight at other.**
- Wall provides upward force and torque.
- Cable or hinge analyses.

**Ladder against wall.** Friction at base must provide enough torque to prevent slipping.

**Tip:** Choose pivot wisely to eliminate unknown forces (forces through pivot have zero torque about it).`,
    },
    {
      code: '5.4',
      title: 'Moment of inertia, rotational F=ma',
      content:
`**Moment of inertia (I).** Rotational analog of mass.
- Measures resistance to angular acceleration.
- Depends on mass AND how it\'s distributed (further from axis → larger I).

**For point mass.** I = m·r².

**For extended objects.**
- Solid disk/cylinder (axis through center): I = ½MR².
- Hoop/ring (about axis): I = MR².
- Solid sphere: I = (2/5)MR².
- Rod about center: I = (1/12)ML².
- Rod about end: I = (1/3)ML².

**Newton\'s 2nd law for rotation.** τ_net = I·α.

**Parallel axis theorem.** I about parallel axis = I_cm + Md² (d = distance between axes).

**Rolling without slipping.**
- v_cm = r·ω.
- Combine translational + rotational KE: ½Mv² + ½Iω².

**Race down ramp:** solid sphere beats disk beats hoop. Smaller I/MR² → faster (more energy in translation, less locked in rotation).`,
    },
    {
      code: '5.5',
      title: 'Angular momentum and conservation',
      content:
`**Angular momentum (L).** L = I·ω. Rotational analog of p = mv.

For point particle: L = m·v·r·sin(θ) about chosen point.

**Conservation.** If net external torque = 0, L conserved.
- Skater pulls arms in → I decreases → ω increases. L stays same.
- Diver tucks → spins faster.
- Earth-Sun system: angular momentum nearly conserved over time.

**Star formation.** Cloud collapses → tiny moment of inertia → ω increases. Pulsars spin fast for this reason.

**Direction.** Right-hand rule. L vector along axis.

**Gyroscopic effects.** Spinning top, bicycle wheel: angular momentum vector resists change → precession, stability.

**Comparison table.**
| Linear | Rotational |
| --- | --- |
| m | I |
| v | ω |
| a | α |
| F | τ |
| p = mv | L = Iω |
| F = ma | τ = Iα |
| KE = ½mv² | KE = ½Iω² |
| W = F·d | W = τ·θ |`,
    },
  ],
  keyConcepts: [
    'Rotational variables: θ, ω, α; mirror linear equations.',
    'v = rω; a_c = v²/r.',
    'Torque τ = r·F·sin(θ); lever arm matters.',
    'Equilibrium: ΣF = 0 AND Στ = 0.',
    'I = moment of inertia; depends on mass distribution.',
    'τ_net = Iα.',
    'L = Iω; conserved if no external torque.',
    'Skater pulling arms in → spins faster (L conserved).',
  ],
  practice: [
    {
      q: 'Solid disk and hoop, same M and R, roll down ramp. Which faster?',
      a: 'Disk. Smaller I (½MR² vs MR²) → more energy goes to translation.',
    },
  ],
  pitfalls: [
    '"Heavier objects have more I" — depends on distribution too.',
    '"τ = rF" — only when force perpendicular.',
  ],
};
