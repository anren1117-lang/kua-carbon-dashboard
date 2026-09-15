// AP Physics C: Mechanics Unit 3 — Work, Energy, Power

export const APPHYSCMECH_UNIT_3 = {
  number: 3,
  title: 'Work, Energy, and Power',
  weight: '15-25%',
  subunits: [
    {
      code: '3.1',
      title: 'Work as integral',
      content:
`**Work.** W = ∫F · dr (line integral).

**Constant force, straight line.** W = F·d·cos θ.

**Variable force, 1D.** W = ∫(a to b) F(x) dx.

**Spring.** W = ∫(0 to x) (kx)dx = ½kx² (work done ON spring).

**Work-energy theorem.** W_net = ΔKE = ½mv_f² − ½mv_i².

**Path-dependent vs independent.**
- Conservative force: W depends only on endpoints.
- Non-conservative: depends on path.

**Examples.**
- Conservative: gravity, spring, electric.
- Non-conservative: friction, applied force.`,
    },
    {
      code: '3.2',
      title: 'Potential energy and conservation',
      content:
`**Potential energy U.** For conservative force F:
- F = −dU/dx.
- ΔU = −W = −∫F·dx.

**Gravitational PE.**
- Near Earth: U = mgh.
- General: U = −GMm/r.

**Spring PE.** U = ½kx².

**Electric PE (later in E&M).**

**Mechanical energy.** E = KE + U.

**Conservation.** If only conservative forces, E = constant.

**With friction or other non-conservative.** E_initial + W_nc = E_final.
- W_nc = work done by non-conservative forces.

**Energy diagrams.** U(x) graph.
- Stable equilibrium: local minimum of U.
- Unstable: maximum.
- Turning points: where KE = 0.
- F = −dU/dx (slope tells force direction).`,
    },
    {
      code: '3.3',
      title: 'Power',
      content:
`**Power.** P = dW/dt = F · v (dot product).

**Average power.** P_avg = W/Δt.

**Instantaneous.** P = F·v.

**Units.** Watt = J/s.

**Conversion.** 1 hp ≈ 746 W.

**Examples.**
- Car engine: ~100 kW.
- Human at rest: ~100 W.
- Light bulb (LED): ~10 W.

**Energy from power.** E = ∫P dt.

**Efficiency.** η = useful output / total input. Always < 100%.`,
    },
  ],
  keyConcepts: [
    'W = ∫F·dr.',
    'W_net = ΔKE.',
    'F = −dU/dx for conservative force.',
    'U_grav = mgh (local); −GMm/r (general).',
    'U_spring = ½kx².',
    'E = KE + U conserved if only conservative.',
    'P = F·v.',
    'Energy diagrams: equilibria, turning points.',
  ],
  practice: [
    { q: 'Spring k=200 N/m compressed 0.1 m. PE stored?', a: 'U = ½(200)(0.01) = 1 J.' },
  ],
  pitfalls: [
    '"Work = force × distance always" — only for constant force, parallel.',
  ],
};
