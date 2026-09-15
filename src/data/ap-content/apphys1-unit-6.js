// AP Physics 1 Unit 6 — Energy and Momentum of Rotating Systems

export const APPHYS1_UNIT_6 = {
  number: 6,
  title: 'Energy and Momentum of Rotating Systems',
  weight: '10-15%',
  subunits: [
    {
      code: '6.1',
      title: 'Rotational kinetic energy',
      content:
`**KE_rot = ½·I·ω².**

For a rolling object (translating + rotating):
- KE_total = ½·m·v² + ½·I·ω².
- With rolling without slipping: v = r·ω.

**Rolling sphere down a ramp.**
- Energy conservation: mgh = ½mv² + ½Iω².
- For solid sphere (I = (2/5)mR²): v² = (10/7)gh.
- For sliding (no rolling): v² = 2gh.
- Rolling is slower because some energy is in rotation.

**Pure rotation about fixed axis.** All KE is rotational.

**Work-energy theorem for rotation.**
- W = ΔKE_rot.
- For a torque: W = τ·Δθ (if τ constant).
- Power: P = τ·ω (rotational analog of F·v).`,
    },
    {
      code: '6.2',
      title: 'Angular momentum applications',
      content:
`**Conservation in detail.** When net external torque = 0, L = Iω stays constant. If I changes, ω compensates.

**Examples:**
- **Figure skater spin.** Arms out: I high, ω low. Arms in: I low, ω high. L unchanged.
- **Neutron stars.** Stellar core collapses; tiny radius → huge ω. Pulsars spin many times per second.
- **Solar system.** Planets formed from disk; collapsed cloud → orbital motion.

**Collisions involving rotation.**
- Ball strikes pivoted rod.
- L conservation: m·v·d (ball\'s angular L) = I_total·ω (after stuck).
- Linear momentum NOT conserved (pivot exerts force).

**Stability.** Spinning objects resist tipping (gyroscopic).
- Bicycle wheel.
- Football pass with spin (spiral).
- Tops, gyroscopes.

**Precession.** Spinning gyroscope under gravity → axis traces a circle rather than falling. Result of τ perpendicular to L causing change in direction of L.`,
    },
    {
      code: '6.3',
      title: 'Simple harmonic motion (SHM)',
      content:
`**SHM.** Periodic motion where restoring force ∝ displacement and points toward equilibrium.

**F = −k·x** → satisfied by springs, small-angle pendulums.

**Equation of motion.** x(t) = A·cos(ω·t + φ).
- A = amplitude.
- ω = angular frequency = √(k/m) for spring.
- φ = phase constant.

**Period.** T = 2π·√(m/k) for spring on mass m.

**Pendulum.** T = 2π·√(L/g).
- Independent of mass and amplitude (for small angles).
- L is length to center of mass.

**Energy in SHM.**
- Max KE at equilibrium (x = 0): ½·m·v_max².
- Max PE at extremes (x = ±A): ½·k·A².
- E_total = ½·k·A² = ½·m·v_max². Constant.
- v_max = A·ω.

**Velocity:** v(t) = −A·ω·sin(ω·t + φ).
**Acceleration:** a(t) = −A·ω²·cos(ω·t + φ) = −ω²·x.

**Tip:** At extremes, v = 0, |a| max. At center, |v| max, a = 0.

**Resonance.** Driving at natural frequency builds large amplitude. Tacoma Narrows Bridge (1940 collapse), wine glass shattering.`,
    },
    {
      code: '6.4',
      title: 'Gravitation and orbital motion',
      content:
`**Newton\'s law of universal gravitation.**
- F = G·m_1·m_2/r².
- G = 6.67×10⁻¹¹ N·m²/kg².
- r = distance between centers.

**g on Earth\'s surface.** g = G·M_Earth/R_Earth² ≈ 9.8 m/s².
- For other planets: depends on M and R.

**Orbital motion.** Gravity provides centripetal force.
- G·M·m/r² = m·v²/r.
- v = √(G·M/r) — orbital speed.
- Smaller orbit → faster.

**Period.** T² = (4π²/GM)·r³ — Kepler\'s 3rd law.

**Geostationary satellite.** Orbits Earth in 24 hr → stays above same point.
- r ≈ 4.2×10⁷ m (~36,000 km altitude).

**Escape velocity.** Minimum speed to escape gravity.
- v_esc = √(2·G·M/r).
- Earth: ~11 km/s.

**Kepler\'s laws.**
1. Planets orbit Sun in ellipses; Sun at one focus.
2. Equal areas swept in equal times (faster when closer).
3. T² ∝ r³.

**Gravitational PE (general).** U = −G·M·m/r. Negative; zero at infinity.`,
    },
  ],
  keyConcepts: [
    'KE_rot = ½Iω².',
    'Rolling: KE = ½mv² + ½Iω².',
    'L = Iω conserved without external torque.',
    'Skater pulls arms in → faster spin.',
    'SHM: F = −kx; T = 2π√(m/k) for spring, 2π√(L/g) for pendulum.',
    'Pendulum period independent of amplitude and mass.',
    'F_grav = GMm/r²; orbital v = √(GM/r).',
    'Kepler: T² ∝ r³.',
  ],
  practice: [
    {
      q: 'Pendulum length 1 m. Period?',
      a: 'T = 2π√(L/g) = 2π√(1/9.8) ≈ 2.01 s.',
    },
  ],
  pitfalls: [
    '"Pendulum period depends on mass" — no; only L and g (small swings).',
    '"Heavier objects orbit faster" — orbital speed depends on central mass and radius, not satellite mass.',
  ],
};
