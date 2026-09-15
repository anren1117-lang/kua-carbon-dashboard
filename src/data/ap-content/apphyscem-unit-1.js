// AP Physics C: E&M Unit 1 — Electrostatics

export const APPHYSCEM_UNIT_1 = {
  number: 1,
  title: 'Electrostatics',
  weight: '26-34%',
  subunits: [
    {
      code: '1.1',
      title: 'Charge and Coulomb\'s law',
      content:
`**Charge q.** Units coulomb (C).
**Elementary charge.** e = 1.6×10⁻¹⁹ C.

**Coulomb\'s law.** F = (1/4πε₀)·q_1q_2/r² r̂.
- k = 1/(4πε₀) ≈ 9×10⁹ N·m²/C².
- ε₀ = 8.85×10⁻¹² C²/(N·m²).

**Superposition.** Total F = vector sum.

**Continuous distributions.** Treat as sum of dq.
- Line charge: λ = dq/dl.
- Surface: σ = dq/dA.
- Volume: ρ = dq/dV.

**Force on test charge.** F = ∫(kq/r² r̂) dq from source distribution.`,
    },
    {
      code: '1.2',
      title: 'Electric field',
      content:
`**Electric field.** E = F/q (force per unit test charge).

**From point charge.** E = kQ/r² r̂.

**From distributions.** E = ∫(k/r²)r̂ dq.

**Examples.**
- Line of charge (infinite): E = λ/(2πε₀r).
- Ring of charge (on axis): E = kQz/(z²+R²)^(3/2).
- Disk (on axis): E = (σ/2ε₀)(1 − z/√(z²+R²)).
- Infinite plane: E = σ/(2ε₀) (uniform, perpendicular to plane).

**Field lines.** Visual; tangent to E; from + to −.

**Electric dipole.** Two equal opposite charges separated by d.
- Dipole moment p = qd.
- Field on axis: E = 2kp/r³.
- Field perpendicular: E = kp/r³.
- Torque in external field: τ = p × E.
- Energy: U = −p·E.`,
    },
    {
      code: '1.3',
      title: 'Gauss\'s law',
      content:
`**Gauss\'s law.** ∮E·dA = Q_enc/ε₀.

Most powerful for symmetric distributions.

**Procedure.**
1. Choose Gaussian surface matching symmetry.
2. E constant on parts; ⊥ on others.
3. Compute flux.
4. Set = Q_enc/ε₀.

**Applications.**

**Point charge.** Gaussian sphere → E = kQ/r².

**Uniformly charged sphere (insulator).**
- Outside: E = kQ/r² (same as point charge).
- Inside: E = kQr/R³ (proportional to r).

**Charged conducting sphere.** All charge on surface.
- Inside: E = 0.
- Outside: E = kQ/r².

**Infinite line of charge.** Gaussian cylinder → E = λ/(2πε₀r).

**Infinite plane.** Gaussian pillbox → E = σ/(2ε₀).

**Two parallel plates.** Between: E = σ/ε₀.

**Inside conductor in equilibrium:** E = 0.

**Excess charge on conductor:** on surface.`,
    },
    {
      code: '1.4',
      title: 'Electric potential',
      content:
`**Electric potential V.** Potential energy per unit charge.

**For point charge.** V = kQ/r. Zero at infinity.

**For distribution.** V = ∫(k/r) dq.

**Superposition.** V_total = scalar sum.

**Relation to E.** E = −∇V.
- 1D: E_x = −dV/dx.
- Equipotential surfaces ⊥ E lines.

**Potential difference.** ΔV = V_b − V_a = −∫(a to b) E·dl.

**Work done by field.** W = qΔV.

**Energy of point charge in field.** U = qV.

**Energy of charge distribution.** W = (1/2)∫ρV dV.

**Capacitance.** C = Q/V.
- Parallel plate: C = ε₀A/d.
- Spherical capacitor.
- Cylindrical capacitor.

**Energy stored in capacitor.** U = (1/2)CV² = (1/2)QV = Q²/(2C).
- Energy density: u = (1/2)ε₀E².

**Dielectrics.** Insert insulator → C increases by factor κ. Reduces E by 1/κ at fixed Q.`,
    },
  ],
  keyConcepts: [
    'F = kq_1q_2/r²; superposition for distributions.',
    'E = F/q.',
    'Continuous distributions: ∫(k/r²)r̂ dq.',
    'Dipole moment p = qd; τ = p × E.',
    'Gauss: ∮E·dA = Q_enc/ε₀.',
    'Symmetries: spherical, cylindrical, planar.',
    'V = kQ/r; E = −∇V.',
    'C = Q/V; parallel plate: C = ε₀A/d.',
    'U_cap = ½CV²; energy density (1/2)ε₀E².',
  ],
  practice: [
    { q: 'Parallel plates A=1m², d=1mm. Capacitance?', a: 'C = ε₀A/d = (8.85e-12)(1)/(0.001) = 8.85 nF.' },
  ],
  pitfalls: [
    '"V is vector" — no; scalar. Easier to sum than E.',
  ],
};
