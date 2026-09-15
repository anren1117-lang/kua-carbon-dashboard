// AP Physics C: E&M Unit 4 — Magnetic Fields

export const APPHYSCEM_UNIT_4 = {
  number: 4,
  title: 'Magnetic Fields',
  weight: '17-23%',
  subunits: [
    {
      code: '4.1',
      title: 'Magnetic force on charges and currents',
      content:
`**Magnetic field B.** Units tesla (T).

**Force on moving charge.** F = qv × B.
- Magnitude F = qvB sin θ.
- Perpendicular to both v and B.
- Right-hand rule.

**Work done by B = 0** (since F ⊥ v).
- B field can\'t change KE; only direction.

**Charged particle in uniform B.**
- v ⊥ B: circular motion.
- r = mv/(qB).
- Period T = 2πm/(qB).
- ω = qB/m (cyclotron frequency).
- v has component along B: helical motion.

**Velocity selector.** Crossed E and B fields. Particle goes straight if v = E/B.

**Mass spectrometer.** Identify masses by radii of circular paths.

**Cyclotron.** Accelerates particles in spiral.

**Force on current-carrying wire.** F = IL × B.
- For straight wire: F = ILB sin θ.
- Magnitude F = BIL sin θ.

**Torque on current loop.** τ = μ × B where μ = NIA (magnetic moment).
- Electric motor: torque on rotating loops.`,
    },
    {
      code: '4.2',
      title: 'Sources of magnetic field',
      content:
`**Biot-Savart law.** dB = (μ_0/4π) (I dl × r̂)/r².
- μ_0 = 4π×10⁻⁷ T·m/A.

**Long straight wire.** B = μ_0I/(2πr) at distance r.
- Circular field lines around wire.
- Right-hand rule for direction.

**Circular loop, on axis.** B = μ_0IR²/[2(R²+z²)^(3/2)].
- At center (z=0): B = μ_0I/(2R).

**Solenoid (ideal, infinite).** B = μ_0nI (inside).
- n = turns per length.
- Uniform inside, zero outside.

**Toroid.** B = μ_0NI/(2πr) (between turns).

**Ampère\'s law.** ∮B·dl = μ_0 I_enc.
- For symmetric distributions.
- Wire: cylindrical loop.
- Solenoid: rectangular loop.

**Magnetic dipole moment.** μ = NIA.
- For loop or solenoid.
- Energy in field: U = −μ·B.

**Two parallel wires.** Same direction: attract. Opposite: repel.
- F/L = μ_0 I_1 I_2 /(2πd).`,
    },
  ],
  keyConcepts: [
    'F = qv × B; work = 0.',
    'Circular motion: r = mv/(qB); T = 2πm/(qB).',
    'F on wire: F = IL × B.',
    'Torque on loop: τ = μ × B; μ = NIA.',
    'Biot-Savart: dB = (μ_0/4π)(I dl × r̂)/r².',
    'Long wire: B = μ_0I/(2πr).',
    'Solenoid: B = μ_0nI.',
    'Ampère\'s law: ∮B·dl = μ_0 I_enc.',
    'Parallel wires same direction attract.',
  ],
  practice: [
    { q: 'Long wire I=2A. B at r=10cm?', a: 'B = (4πe-7)(2)/(2π·0.1) = 4e-6 T = 4 μT.' },
  ],
  pitfalls: [
    '"B does work on charge" — no; perpendicular to v.',
  ],
};
