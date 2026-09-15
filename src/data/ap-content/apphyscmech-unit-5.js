// AP Physics C: Mechanics Unit 5 — Rotation

export const APPHYSCMECH_UNIT_5 = {
  number: 5,
  title: 'Rotation',
  weight: '10-15%',
  subunits: [
    {
      code: '5.1',
      title: 'Rotational kinematics',
      content:
`Same as translational, with angular variables.

**Angular position θ.** Radians.
**Angular velocity ω = dθ/dt.**
**Angular acceleration α = dω/dt.**

**Constant α equations** (same form as linear):
- ω = ω_0 + αt.
- θ = θ_0 + ω_0 t + ½αt².
- ω² = ω_0² + 2α(θ − θ_0).

**Linking linear to angular** for point on rigid body at radius r:
- v = rω (tangential).
- a_t = rα (tangential).
- a_c = v²/r = rω² (centripetal).

**Rolling without slipping.** v_cm = rω; a_cm = rα.`,
    },
    {
      code: '5.2',
      title: 'Moment of inertia and rotational dynamics',
      content:
`**Moment of inertia.** I = ∫r²dm.

**For common shapes.**
- Point mass at r: I = mr².
- Solid disk/cylinder about center axis: I = ½MR².
- Hoop: I = MR².
- Solid sphere: I = (2/5)MR².
- Hollow sphere: I = (2/3)MR².
- Rod about center: I = (1/12)ML².
- Rod about end: I = (1/3)ML².

**Parallel axis theorem.** I_axis = I_cm + Md² where d is distance.

**Rotational Newton\'s 2nd.** τ_net = Iα.

**Torque.** τ = r × F. Magnitude rF sin θ.

**Rotational KE.** KE_rot = ½Iω².

**Rolling object.** Total KE = ½Mv² + ½Iω² = ½Mv²(1 + I/(MR²)).
- Sphere wins down ramp; hoop loses.

**Newton-Euler for rigid body.**
- ΣF = Ma_cm.
- Στ = Iα.`,
    },
    {
      code: '5.3',
      title: 'Angular momentum',
      content:
`**Angular momentum.** L = Iω.

For particle: L = r × p; magnitude rp sin θ.

**Conservation.** If τ_ext = 0, L conserved.

**Famous examples.**
- Skater pulls arms in: I decreases, ω increases.
- Neutron stars spin fast.
- Diving and gymnastics tucks.

**Newton\'s 2nd rotational.** τ = dL/dt.

**For rigid body fixed axis:** L = Iω.

**For point particle:** L = r × mv.

**Precession.** Spinning top: gravity torque causes axis to precess.`,
    },
  ],
  keyConcepts: [
    'ω = dθ/dt; α = dω/dt.',
    'v = rω, a_t = rα, a_c = rω².',
    'I = ∫r² dm.',
    'Parallel axis: I = I_cm + Md².',
    'τ = Iα.',
    'KE_rot = ½Iω².',
    'L = Iω (or r × p).',
    'L conserved if τ_ext = 0.',
  ],
  practice: [
    { q: 'Hoop I = MR². Race down ramp vs solid sphere I = (2/5)MR². Winner?', a: 'Sphere wins. Lower I/MR² → more energy in translation.' },
  ],
  pitfalls: [
    '"Moment of inertia depends only on mass" — also distribution.',
  ],
};
