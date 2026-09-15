// AP Physics 2 Unit 1 — Fluids

export const APPHYS2_UNIT_1 = {
  number: 1,
  title: 'Fluids',
  weight: '10-12%',
  subunits: [
    {
      code: '1.1',
      title: 'Density and pressure',
      content:
`**Density (ρ).** ρ = m/V. Units kg/m³.
- Water: 1000 kg/m³.
- Air at sea level: ~1.2 kg/m³.
- Mercury: 13,600 kg/m³.

**Pressure (P).** P = F/A. Units pascal (Pa) = N/m².
- 1 atm = 101,325 Pa ≈ 14.7 psi.
- Pressure is scalar (same all directions).

**Hydrostatic pressure** in fluid at rest: P = ρgh.

**Total pressure at depth.** P_total = P_atm + ρgh.

**Pascal\'s principle.** Pressure applied to confined fluid is transmitted undiminished.
- Hydraulic lift: F₁/A₁ = F₂/A₂.

**Atmospheric pressure decreases with altitude.**`,
    },
    {
      code: '1.2',
      title: 'Buoyancy and Archimedes',
      content:
`**Archimedes\' principle.** Buoyant force = weight of displaced fluid.
F_buoy = ρ_fluid · V_displaced · g.

**Floating equilibrium.** F_buoy = W_object.
- Fraction submerged = ρ_object / ρ_fluid.
- Ice (ρ = 920 kg/m³) in water (1000): 92% submerged.

**Submerged solid.**
- If ρ_object > ρ_fluid: sinks. Apparent weight = W − F_buoy.
- If ρ_object < ρ_fluid: floats; only fraction submerged.

**Examples.**
- 1 m³ steel in water: F_buoy = 9,800 N; weight ~78,000 N → sinks with apparent weight 68,200 N.
- 1 m³ wood (ρ=600): F_buoy must equal weight 5880 N → 0.6 m³ submerged.`,
    },
    {
      code: '1.3',
      title: 'Fluid dynamics — Bernoulli',
      content:
`**Continuity equation.** A₁v₁ = A₂v₂ (incompressible).
- Pipe narrows → fluid speeds up.

**Bernoulli\'s equation.** P + ½ρv² + ρgh = constant along streamline.

**Applications.**
- Faster flow → lower pressure.
- Wing lift (in part).
- Atomizer/perfume spray.
- Venturi meter.
- Pitot tube.
- Roofs lifted in hurricanes (lower P above).

**Torricelli\'s theorem.** Fluid escaping from hole at depth h has speed v = √(2gh).

**Limitations.** Inviscid, incompressible, steady. Real fluids have viscosity.

**Viscosity.** Internal friction. Water low; honey high.

**Reynolds number.** Re = ρvL/μ. High Re → turbulent; low → laminar.`,
    },
  ],
  keyConcepts: [
    'Density ρ = m/V; water = 1000 kg/m³.',
    'Pressure P = F/A; units Pa.',
    'Hydrostatic: P = ρgh.',
    'Pascal: pressure transmitted equally (hydraulic lift).',
    'Archimedes: F_buoy = ρ_fluid V_displaced g.',
    'Floating fraction submerged = ρ_obj / ρ_fluid.',
    'Continuity: A₁v₁ = A₂v₂.',
    'Bernoulli: P + ½ρv² + ρgh = const.',
    'Torricelli: v = √(2gh).',
  ],
  practice: [
    { q: 'Block ρ=800 in water. Fraction submerged?', a: '800/1000 = 80%.' },
  ],
  pitfalls: [
    '"Bernoulli explains all lift" — also Newton 3rd (air deflection).',
  ],
};
