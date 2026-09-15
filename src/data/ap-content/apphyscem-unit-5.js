// AP Physics C: E&M Unit 5 — Electromagnetic Induction

export const APPHYSCEM_UNIT_5 = {
  number: 5,
  title: 'Electromagnetic Induction',
  weight: '17-23%',
  subunits: [
    {
      code: '5.1',
      title: 'Faraday and Lenz',
      content:
`**Magnetic flux.** Φ_B = ∫B·dA = BA cos θ (uniform B).

**Faraday\'s law.** ε = −dΦ_B/dt.

**Lenz\'s law.** Induced current opposes the change in flux. (Reason for minus sign.)

**Means to induce EMF.**
- Change B.
- Change A.
- Change angle θ.
- Or combinations.

**Motional EMF.** Rod of length L moving at v ⊥ B in field B:
- ε = BLv.

**Generator.** Loop rotating in B field generates AC.
- ε(t) = NBAω sin(ωt).

**Eddy currents.** Currents induced in bulk conductors.
- Cause heating (waste in transformers).
- Useful for braking (induction brake).

**Energy considerations.**
- Induced current dissipates energy in resistance.
- Work done by external force to maintain motion = energy dissipated.
- Conservation of energy maintained.`,
    },
    {
      code: '5.2',
      title: 'Inductance and LR circuits',
      content:
`**Self-inductance.** L = NΦ_B/I. Units henry (H) = V·s/A.

**EMF across inductor.** ε_L = −L·dI/dt.

**Solenoid inductance.** L = μ_0 n² A l (where n = turns/length, l = length).

**Energy stored.** U_L = ½LI².
- Energy density in B field: u = B²/(2μ_0).

**LR circuit (series with R, battery).**

**Rising current** (battery just connected):
- I(t) = (ε/R)(1 − e^(−Rt/L)).
- Time constant τ = L/R.

**Decaying current** (battery removed):
- I(t) = I_0 · e^(−Rt/L).

**LC circuit.** Inductor + capacitor.
- Oscillation: ω = 1/√(LC).
- Energy oscillates between E (capacitor) and B (inductor).

**Mutual inductance.** Between two coils.
- ε_2 = −M·dI_1/dt.
- Basis of transformers.

**Transformers.**
- V_p/V_s = N_p/N_s.
- I_p/I_s = N_s/N_p.

**RLC circuit.** Damped oscillations.
- Underdamped: oscillates with decay.
- Critically damped, overdamped.

**Maxwell\'s equations** (complete set).
- Gauss for E.
- Gauss for B (no monopoles).
- Faraday: ∮E·dl = −dΦ_B/dt.
- Ampère-Maxwell: ∮B·dl = μ_0(I_enc + ε_0 dΦ_E/dt).

**EM waves.** Solutions to Maxwell\'s. c = 1/√(μ_0ε_0). Travel at speed of light.`,
    },
  ],
  keyConcepts: [
    'Φ_B = BA cos θ.',
    'Faraday: ε = −dΦ_B/dt.',
    'Lenz: oppose change in flux.',
    'Motional EMF: ε = BLv.',
    'L = NΦ/I (inductance).',
    'ε_L = −L dI/dt.',
    'U_L = ½LI².',
    'LR time constant τ = L/R.',
    'LC oscillation: ω = 1/√(LC).',
    'Transformer: V_p/V_s = N_p/N_s.',
    'Maxwell\'s equations.',
    'c = 1/√(μ_0ε_0).',
  ],
  practice: [
    { q: 'Inductor L = 10mH, R = 5Ω. Time constant?', a: 'τ = L/R = 0.01/5 = 2 ms.' },
  ],
  pitfalls: [
    '"Steady B induces current" — no; only CHANGING flux.',
  ],
};
