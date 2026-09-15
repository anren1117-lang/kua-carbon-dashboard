// AP Physics C: Mechanics Unit 7 — Gravitation

export const APPHYSCMECH_UNIT_7 = {
  number: 7,
  title: 'Gravitation',
  weight: '10-15%',
  subunits: [
    {
      code: '7.1',
      title: 'Newton\'s law of gravitation',
      content:
`**Newton\'s law.** F = Gm_1m_2/r².
- G = 6.67×10⁻¹¹ N·m²/kg².

**Vector form.** F = −(Gm_1m_2/r²) r̂.

**Inverse square.** Same form as Coulomb.

**g at Earth\'s surface.** g = GM_E/R_E² ≈ 9.8 m/s².

**g at altitude h.** g(h) = GM/(R + h)².

**Inside uniform sphere.** g(r) ∝ r (linear, increases from center to surface).

**Gravitational PE.** U = −GMm/r.
- Zero at infinity.
- Becomes more negative as objects get closer.

**Escape velocity.** v_esc = √(2GM/r).
- Earth: ~11.2 km/s.
- Set KE = |U| at infinity.

**Orbital velocity.** v_orb = √(GM/r) (circular orbit).
- v_orb = v_esc/√2.`,
    },
    {
      code: '7.2',
      title: 'Kepler\'s laws and orbits',
      content:
`**Kepler\'s 1st.** Orbits are ellipses; central body at one focus.

**Kepler\'s 2nd.** Equal areas swept in equal times. (Conservation of angular momentum.)
- Faster at perihelion (close); slower at aphelion (far).

**Kepler\'s 3rd.** T² ∝ a³ where a = semi-major axis.
- T² = (4π²/GM)·a³.

**Circular orbit special case.** F = mv²/r = GMm/r² → v = √(GM/r), T = 2π√(r³/GM).

**Total energy of orbit.** E = KE + U = ½mv² − GMm/r = −GMm/(2a).
- Negative: bound orbit.
- Zero: marginally bound (parabolic).
- Positive: unbound (hyperbolic).

**Geostationary orbit.** T = 1 sidereal day (~24 hr).
- r ≈ 4.2×10⁴ km.
- Always above same point on equator.

**Conic section orbits.**
- Circle: e = 0.
- Ellipse: 0 < e < 1.
- Parabola: e = 1 (escape).
- Hyperbola: e > 1 (flyby).

**Two-body problem.** Each orbits common COM.

**Tidal forces.** Difference in gravity across an extended body.
- Causes tides.
- Tidal locking (Moon shows same face).
- Tidal heating (Io, Europa).`,
    },
  ],
  keyConcepts: [
    'F = Gm_1m_2/r².',
    'g = GM/r² (surface).',
    'U = −GMm/r (general).',
    'v_esc = √(2GM/r).',
    'v_orb = √(GM/r).',
    'Kepler: T² ∝ a³.',
    'E_orbit = −GMm/(2a) for ellipse.',
    'Geostationary at ~36,000 km altitude.',
    'Tidal forces from gravity gradient.',
  ],
  practice: [
    { q: 'Satellite orbits Earth at radius 2R_E. Speed (in terms of g, R_E)?', a: 'v = √(GM/r) = √(GM/(2R_E)) = √(g·R_E²/(2R_E)) = √(gR_E/2).' },
  ],
  pitfalls: [
    '"Heavier orbits faster" — orbital speed depends on central mass and radius, not satellite mass.',
  ],
};
