// AP Physics C: E&M Unit 2 — Conductors, Capacitors, Dielectrics

export const APPHYSCEM_UNIT_2 = {
  number: 2,
  title: 'Conductors, Capacitors, Dielectrics',
  weight: '14-17%',
  subunits: [
    {
      code: '2.1',
      title: 'Conductors in equilibrium',
      content:
`**Conductor in electrostatic equilibrium.**
- E = 0 inside.
- All excess charge on surface.
- E just outside ⊥ surface.
- E_surface = σ/ε₀ (Gauss with pillbox).
- Charge concentrates where curvature is greatest (sharp points: corona discharge).

**Conductor in external field.** Charges redistribute until E = 0 inside. Induced charge on surface.

**Faraday cage.** Closed conductor shields inside from external fields.

**Grounding.** Connect to large reservoir; charge flows until potential matches.`,
    },
    {
      code: '2.2',
      title: 'Capacitor combinations and dielectrics',
      content:
`**Capacitor.** Two conductors separated by gap (vacuum or dielectric).

**Capacitance.** C = Q/V.

**Geometries.**
- Parallel plate: C = ε₀A/d.
- Spherical (concentric shells, radii a < b): C = 4πε₀ab/(b−a).
- Cylindrical (length L): C = 2πε₀L/ln(b/a).

**Series capacitors.** 1/C_eq = Σ1/C_i.
- Charges equal; voltages add.

**Parallel.** C_eq = ΣC_i.
- Voltages equal; charges add.

**Dielectric (insulator) in capacitor.**
- C → κC.
- Dielectric constant κ (water 80, glass 4-7, paper 3, mica 6, vacuum 1).
- E_field_with → E/κ.
- Induced polarization in dielectric.

**Energy stored.** U = ½CV² = ½QV = Q²/(2C).

**Energy density** in electric field. u = ½ε₀E².

**RC circuits.** Discussed in next unit.`,
    },
  ],
  keyConcepts: [
    'E = 0 inside conductor in equilibrium.',
    'Excess charge on surface; E_surface = σ/ε₀.',
    'Faraday cage shields.',
    'Cap series: 1/C_eq sum; parallel: C_eq sum.',
    'Dielectric multiplies C by κ.',
    'Energy density u = ½ε₀E².',
    'C = Q/V.',
  ],
  practice: [
    { q: 'Two 4μF caps in series. C_eq?', a: '1/C = 1/4 + 1/4 = 1/2 → C_eq = 2μF.' },
  ],
  pitfalls: [
    '"Series caps sum" — opposite of resistors.',
  ],
};
