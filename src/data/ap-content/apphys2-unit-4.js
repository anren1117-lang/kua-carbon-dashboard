// AP Physics 2 Unit 4 — Electric Circuits

export const APPHYS2_UNIT_4 = {
  number: 4,
  title: 'Electric Circuits',
  weight: '15-20%',
  subunits: [
    {
      code: '4.1',
      title: 'Current, resistance, Ohm\'s law',
      content:
`**Current (I).** Rate of charge flow. I = Q/t. Units ampere (A) = C/s.

**Direction.** Conventional: + charge flow (opposite to electron flow).

**Resistance (R).** Opposition to current. Units ohm (Ω) = V/A.
- R = ρL/A (ρ = resistivity, L = length, A = cross-section).

**Ohm\'s law.** V = IR. Works for ohmic materials.

**Power.** P = IV = I²R = V²/R. Units watt.

**Energy.** E = Pt. Often expressed in kWh.

**Resistivity ρ.**
- Copper: 1.7×10⁻⁸ Ω·m.
- Silicon: 2300 Ω·m.
- Glass: 10¹⁰-10¹⁴ Ω·m.

**Increases with temperature** in metals.`,
    },
    {
      code: '4.2',
      title: 'Series and parallel circuits',
      content:
`**Series.** Same current through all components.
- R_eq = R₁ + R₂ + ...
- V splits among resistors.
- Most resistance: largest resistor dominates.

**Parallel.** Same voltage across all components.
- 1/R_eq = 1/R₁ + 1/R₂ + ...
- I splits among branches.
- Most current: smallest resistor.

**Combinations.** Solve step by step.

**Kirchhoff\'s rules.**
- **Junction rule:** sum of currents in = sum out (charge conservation).
- **Loop rule:** sum of voltage drops around loop = 0 (energy conservation).

**EMF.** ε = battery voltage when no current.

**Internal resistance r.** Terminal voltage V_t = ε − Ir.`,
    },
    {
      code: '4.3',
      title: 'Capacitors and RC circuits',
      content:
`**Capacitor.** Two conductors separated by insulator. Stores charge and energy.

**Capacitance.** C = Q/V. Units farad (F).
- Parallel plate: C = ε₀A/d.

**Energy stored.** U = ½CV² = ½QV = Q²/(2C).

**Series capacitors.** 1/C_eq = 1/C₁ + 1/C₂ + ...
**Parallel capacitors.** C_eq = C₁ + C₂ + ...

(Note: opposite of resistors.)

**Dielectrics.** Insulator between plates. Increases C by factor κ.

**RC circuit charging.**
- Q(t) = Q_max(1 − e^(−t/RC)).
- V(t) = V_max(1 − e^(−t/RC)).
- Time constant τ = RC.

**RC discharging.**
- Q(t) = Q₀·e^(−t/RC).
- V(t) = V₀·e^(−t/RC).

**After 5τ:** ~99% complete.

**At t = τ:** ~63% charged (or 37% remaining for discharge).`,
    },
  ],
  keyConcepts: [
    'I = Q/t; ampere = C/s.',
    'V = IR (Ohm\'s law).',
    'P = IV = I²R = V²/R.',
    'Series: R_eq = ΣR.',
    'Parallel: 1/R_eq = Σ1/R.',
    'Kirchhoff: junction (current) + loop (voltage).',
    'C = Q/V; U = ½CV².',
    'Cap series: 1/C_eq = Σ1/C. Parallel: C_eq = ΣC.',
    'Dielectric multiplies C by κ.',
    'RC: time constant τ = RC.',
  ],
  practice: [
    { q: 'Two 6 Ω resistors in parallel. R_eq?', a: '1/R = 1/6 + 1/6 = 1/3. R_eq = 3 Ω.' },
  ],
  pitfalls: [
    '"Cap series sums" — opposite of resistors.',
  ],
};
