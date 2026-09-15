// AP Physics C: E&M Unit 3 — Circuits

export const APPHYSCEM_UNIT_3 = {
  number: 3,
  title: 'Electric Circuits',
  weight: '17-23%',
  subunits: [
    {
      code: '3.1',
      title: 'Current, resistance, EMF',
      content:
`**Current.** I = dQ/dt.

**Current density.** J = nev_d (n = carrier density, e = charge, v_d = drift velocity).

**Ohm\'s law (microscopic).** J = σE (σ = conductivity).

**Resistance.** R = ρL/A (ρ = resistivity).

**Ohm\'s law (macroscopic).** V = IR.

**Power.** P = IV = I²R = V²/R.

**EMF (ε).** Battery voltage.

**Internal resistance r.** Terminal voltage V_t = ε − Ir.

**Maximum power transfer.** When R_load = r.`,
    },
    {
      code: '3.2',
      title: 'Kirchhoff and circuit analysis',
      content:
`**Series.** R_eq = ΣR. Current same.
**Parallel.** 1/R_eq = Σ1/R. Voltage same.

**Kirchhoff\'s rules.**
- **Junction:** ΣI_in = ΣI_out.
- **Loop:** ΣV around loop = 0.

**Sign conventions** for loop rule.
- EMF source: positive when going from − to + terminal.
- Resistor: negative when going in direction of current.

**Voltage divider.** V_R₁ = V·R₁/(R₁+R₂) (series).

**Current divider.** I_R₁ = I·R₂/(R₁+R₂) (parallel).

**Wheatstone bridge.** Special configuration for measuring resistance.

**Multimeter.**
- Ammeter: low R, in series.
- Voltmeter: high R, in parallel.`,
    },
    {
      code: '3.3',
      title: 'RC circuits',
      content:
`**Charging.** Capacitor through resistor with battery.
- q(t) = Cε(1 − e^(−t/RC)).
- I(t) = (ε/R)e^(−t/RC).
- V_C(t) = ε(1 − e^(−t/RC)).

**Discharging.** Capacitor through resistor.
- q(t) = q_0·e^(−t/RC).
- I(t) = (q_0/RC)·e^(−t/RC).

**Time constant.** τ = RC.

**At t = τ:** charging 63% complete; discharging 37% remaining.

**At t = 5τ:** essentially complete (99%).

**Energy considerations.**
- Energy from battery: εQ_∞ where Q_∞ = Cε.
- Energy stored in capacitor: ½Cε².
- Energy dissipated in resistor: also ½Cε².
- Total = εCε = Cε².

**Solving RC ODE.**
- KVL: ε − IR − Q/C = 0.
- I = dQ/dt.
- ODE: dQ/dt = (ε − Q/C)/R.
- Separation: dQ/(ε − Q/C) = dt/R.
- Solution as above.`,
    },
  ],
  keyConcepts: [
    'I = dQ/dt.',
    'V = IR; P = IV = I²R.',
    'Series: R_eq = ΣR.',
    'Parallel: 1/R_eq = Σ1/R.',
    'Kirchhoff: junction (current) + loop (voltage).',
    'RC: τ = RC.',
    'Charging: q = Cε(1 − e^(−t/RC)).',
    'Discharging: q = q_0 e^(−t/RC).',
    'After 5τ ~99% complete.',
  ],
  practice: [
    { q: 'R = 1MΩ, C = 1μF. Time constant?', a: 'τ = RC = (10⁶)(10⁻⁶) = 1 s.' },
  ],
  pitfalls: [
    '"Capacitor passes DC at steady state" — no; only AC.',
  ],
};
