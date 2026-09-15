// AP Physics C: Mechanics Unit 6 — Oscillations

export const APPHYSCMECH_UNIT_6 = {
  number: 6,
  title: 'Oscillations',
  weight: '10-15%',
  subunits: [
    {
      code: '6.1',
      title: 'Simple harmonic motion',
      content:
`**SHM.** Restoring force ∝ −displacement.

**Equation of motion.** ma = −kx → a = −(k/m)x.

**Angular frequency.** ω = √(k/m).

**Period.** T = 2π√(m/k).

**Solution.** x(t) = A cos(ωt + φ).
- A = amplitude.
- φ = phase.

**Velocity.** v(t) = −Aω sin(ωt + φ).
**Acceleration.** a(t) = −Aω² cos(ωt + φ) = −ω²x.

**Energy in SHM.**
- E = ½kA² = constant.
- KE max at equilibrium: ½mv²_max = ½mA²ω².
- PE max at extremes: ½kA².
- KE + PE = E always.

**Phase space.** Plot v vs x: ellipse.`,
    },
    {
      code: '6.2',
      title: 'Pendulums and damping',
      content:
`**Simple pendulum.** Period: T = 2π√(L/g).
- Small angles only.

**Physical pendulum.** T = 2π√(I/(Mgd)) where d = distance from pivot to COM.

**Damped oscillation.** F_damp = −bv.
- Solution: x(t) = A·e^(−γt) cos(ω_d t + φ).
- γ = b/(2m) (damping coefficient).
- ω_d = √(ω_0² − γ²).
- Underdamped (γ < ω_0): oscillates with decaying amplitude.
- Critical damping (γ = ω_0): fastest return without oscillation.
- Overdamped (γ > ω_0): slow return.

**Forced oscillation and resonance.**
- Driving frequency at ω_0 → resonance, large amplitude.
- Real systems: bridges (Tacoma Narrows), wine glass shattering, MRI.`,
    },
  ],
  keyConcepts: [
    'SHM: F = −kx.',
    'ω = √(k/m); T = 2π√(m/k).',
    'x(t) = A cos(ωt + φ).',
    'E = ½kA² conserved.',
    'Pendulum: T = 2π√(L/g) (small angles).',
    'Physical pendulum: T = 2π√(I/Mgd).',
    'Damping: amplitude decays exponentially.',
    'Resonance: driving at ω_0 amplifies.',
  ],
  practice: [
    { q: 'Mass 1 kg on spring k = 100 N/m. Period?', a: 'T = 2π√(1/100) = 2π/10 ≈ 0.63 s.' },
  ],
  pitfalls: [
    '"Pendulum period depends on mass" — no; only L and g.',
  ],
};
