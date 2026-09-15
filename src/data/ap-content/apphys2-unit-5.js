// AP Physics 2 Unit 5 — Magnetism and Electromagnetic Induction

export const APPHYS2_UNIT_5 = {
  number: 5,
  title: 'Magnetism and Electromagnetic Induction',
  weight: '10-12%',
  subunits: [
    {
      code: '5.1',
      title: 'Magnetic field and force',
      content:
`**Magnetic field (B).** Units tesla (T) = N·s/(C·m).

**Sources.** Moving charges, currents, magnetic dipoles (electrons spin).

**No magnetic monopoles** (yet observed).

**Field lines.**
- Closed loops.
- N → S externally; S → N inside magnet.
- Tangent to B at each point.

**Earth\'s field.** ~50 μT. Comes from molten outer core dynamo.

**Force on moving charge.** F = qv × B.
- Magnitude: F = qvB·sin θ.
- Right-hand rule for direction.
- If v parallel to B: no force.
- Perpendicular: maximum.

**Charged particle in B field.**
- Moving perp: circular motion. r = mv/(qB). T = 2πm/(qB).
- Used in mass spectrometers, cyclotrons.

**Force on current-carrying wire.** F = IL × B.
- F = ILB·sin θ.

**Two parallel wires.** Same direction: attract. Opposite: repel.`,
    },
    {
      code: '5.2',
      title: 'Magnetic fields from currents',
      content:
`**Long straight wire.** B = μ₀I/(2πr) at distance r. Circles wire (right-hand rule).
- μ₀ = 4π×10⁻⁷ T·m/A (permeability of free space).

**Loop.** B at center = μ₀I/(2R).

**Solenoid (coil).** B inside = μ₀nI (n = turns/length).
- Uniform inside, ~zero outside.
- Like bar magnet externally.

**Ampere\'s law.** ∮B·dl = μ₀I_enc.
- Magnetic equivalent of Gauss\'s law.
- Useful for symmetric current distributions.

**Magnetic dipole.** Loop of current acts like bar magnet.`,
    },
    {
      code: '5.3',
      title: 'Electromagnetic induction',
      content:
`**Faraday\'s law.** Changing magnetic flux induces EMF.
- ε = −dΦ/dt.
- Φ = B·A·cos θ (magnetic flux).

**Lenz\'s law.** Induced current opposes the change in flux.

**Means to change Φ.**
- Change B (magnet moving in/out of coil).
- Change A (area).
- Change θ (rotation).

**Motional EMF.** Rod of length L moving at v perpendicular to B:
- ε = BLv.

**Transformers.** N_p/N_s = V_p/V_s.
- Step up: more turns in secondary; higher V, lower I.
- Step down: opposite.
- Used in power transmission (high V over long distance, low V at homes).

**Eddy currents.** Induced in bulk conductors; cause heating; useful for braking but waste energy.

**Maxwell\'s equations** (qualitatively).
1. Gauss\'s for E.
2. Gauss\'s for B (no monopoles).
3. Faraday: changing B creates E.
4. Ampère-Maxwell: currents and changing E create B.

**Together:** electromagnetic waves.`,
    },
  ],
  keyConcepts: [
    'F = qv×B; right-hand rule.',
    'Charged particle in B perp: circle r = mv/(qB).',
    'F = IL×B on wire.',
    'B from long wire = μ₀I/(2πr).',
    'Solenoid: B = μ₀nI.',
    'Faraday: ε = −dΦ/dt.',
    'Φ = BA cos θ.',
    'Lenz: induced current opposes flux change.',
    'Motional EMF: ε = BLv.',
    'Transformer: V_p/V_s = N_p/N_s.',
  ],
  practice: [
    { q: 'Wire 0.5 m in B=2T moves at 3 m/s perpendicular. EMF?', a: 'ε = BLv = 2·0.5·3 = 3 V.' },
  ],
  pitfalls: [
    '"Steady B induces current" — no; only CHANGING B.',
  ],
};
