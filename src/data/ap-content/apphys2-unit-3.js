// AP Physics 2 Unit 3 — Electric Force, Field, Potential

export const APPHYS2_UNIT_3 = {
  number: 3,
  title: 'Electric Force, Field, Potential',
  weight: '18-22%',
  subunits: [
    {
      code: '3.1',
      title: 'Charge and Coulomb\'s law',
      content:
`**Charge.** Property of matter. Two types: positive (+) and negative (−).

**Conservation of charge.** Total charge of closed system constant.

**Quantization.** Charge in integer multiples of e = 1.6×10⁻¹⁹ C.

**Coulomb\'s law.** F = kq₁q₂/r².
- k = 9×10⁹ N·m²/C² (Coulomb constant).
- F along line connecting charges.
- Attractive (opposite) or repulsive (same sign).

**Compared to gravity.** Same inverse-square form, but Coulomb force vastly stronger (40 orders of magnitude for proton-electron).

**Superposition.** Net force on charge = vector sum of forces from each other charge.

**Conductors vs insulators.**
- Conductors: charges move freely (metals).
- Insulators: charges stuck (rubber, wood).
- Semiconductors: in between.

**Charging methods.**
- Friction.
- Contact (conduction).
- Induction (without contact).
- Grounding.`,
    },
    {
      code: '3.2',
      title: 'Electric field',
      content:
`**Electric field (E).** Force per unit charge at a point.
- E = F/q (test charge).
- Units N/C or V/m.
- Vector.

**E from point charge.** E = kQ/r². Points away from + charge; toward − charge.

**Field lines.**
- From + to −.
- Density indicates magnitude.
- Tangent to E at each point.
- Never cross.

**Superposition.** E_total = sum of E from each source.

**Field from continuous distributions.** Integrate.

**Parallel plates.** Uniform E between plates: E = σ/ε₀ = V/d.

**Gauss\'s law.** Φ_E = ∮E·dA = Q_enc/ε₀.
- Useful for symmetric distributions.
- Spherical, cylindrical, planar symmetries.
- ε₀ = 8.85×10⁻¹² C²/(N·m²) (permittivity of free space).

**Inside conductor:** E = 0 (in equilibrium).
**Excess charge on conductor:** lies on surface.`,
    },
    {
      code: '3.3',
      title: 'Electric potential',
      content:
`**Electric potential (V).** Potential energy per unit charge.
- V = U/q.
- Units volt (V) = J/C.
- Scalar.

**V from point charge.** V = kQ/r. Zero at infinity.

**Potential energy of two charges.** U = kq₁q₂/r.

**Superposition.** V_total = scalar sum.

**Equipotential surfaces.** Surfaces of constant V. Perpendicular to E.

**Relationship to E.** E = −dV/dr (in spherical). General: E points from high to low potential.

**Voltage.** Potential difference: ΔV = V_b − V_a.

**Work done by field.** W = qΔV.

**Conservation of energy.** Charged particle moving in field:
- KE + qV = constant.

**Equipotentials.**
- Surface where V constant.
- E perpendicular to equipotential.
- Conductor in equilibrium = equipotential.`,
    },
  ],
  keyConcepts: [
    'Coulomb: F = kq₁q₂/r².',
    'Elementary charge e = 1.6×10⁻¹⁹ C.',
    'E = F/q; vector field.',
    'E_point = kQ/r².',
    'Parallel plates: E = V/d.',
    'Gauss\'s law: ∮E·dA = Q_enc/ε₀.',
    'V = U/q (scalar).',
    'V_point = kQ/r.',
    'E perpendicular to equipotential.',
    'Conductor interior E = 0.',
  ],
  practice: [
    { q: 'Two +1 μC charges 1 m apart. Force?', a: 'F = kq²/r² = 9×10⁹ · 10⁻¹² / 1 = 9×10⁻³ N = 9 mN.' },
  ],
  pitfalls: [
    '"V is vector" — no; scalar.',
  ],
};
