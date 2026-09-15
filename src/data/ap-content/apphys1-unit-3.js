// AP Physics 1 Unit 3 — Work, Energy, and Power

export const APPHYS1_UNIT_3 = {
  number: 3,
  title: 'Work, Energy, and Power',
  weight: '12-18%',
  subunits: [
    {
      code: '3.1',
      title: 'Work',
      content:
`**Work (W).** Energy transferred by a force acting over a displacement.

**W = F·d·cos(θ)** where θ is angle between force and displacement.

Units: joule (J) = N·m.

**Cases:**
- Force parallel to motion (θ = 0): W = F·d, max positive.
- Force perpendicular (θ = 90°): W = 0. Normal force on level ground does no work.
- Force opposite motion (θ = 180°): W = −F·d. Friction usually does negative work.

**Net work = sum of work by all forces.** Or W_net = F_net·d·cos(θ).

**Work done by variable force.** Area under F-vs-x graph.

**Examples:**
- Lifting weight by height h: W = mgh.
- Pushing block 5 m with 10 N horizontal force: W = 50 J.
- Carrying box across room (no vertical motion): gravity does 0 work; your hand does ~0 net work too (assuming constant v).

**Common student error.** "I worked hard holding this." In physics, holding an object stationary = 0 work (d = 0).`,
    },
    {
      code: '3.2',
      title: 'Kinetic energy and work-energy theorem',
      content:
`**Kinetic energy (KE).** Energy of motion. KE = ½·m·v².

**Work-energy theorem.** Net work on object = change in KE.
- W_net = ΔKE = ½·m·v_f² − ½·m·v_i².

**This is huge:** lets you solve many problems without using forces directly.

**Example: object dropped from height h.**
- Net force = mg (gravity).
- Work = mg·h.
- ΔKE = mg·h.
- At ground: ½mv² = mgh → v = √(2gh).

Same as kinematics gives, but no time involved.

**Tip:** When asked for final speed and time isn\'t relevant, use energy.

**KE always positive** (v² is positive).

**Doubling speed quadruples KE.** v² scaling matters for braking distance, car crashes.

**KE depends on reference frame.** A car moving with you has 0 KE in your frame.`,
    },
    {
      code: '3.3',
      title: 'Potential energy',
      content:
`**Potential energy (PE).** Stored energy due to position/configuration.

**Gravitational PE (near Earth surface).** U_g = m·g·h.
- h relative to chosen reference (typically ground).
- PE can be negative (below reference).

**Spring PE.** U_s = ½·k·x².
- k = spring constant (stiffness).
- x = displacement from equilibrium.

**Conservative forces.** Path independent. Gravity, springs, electric force.
- Work depends only on initial and final positions.
- Can define a PE for them.

**Non-conservative forces.** Path dependent. Friction, air drag, applied push.
- Convert mechanical energy to thermal/internal.
- No PE function.

**Reference level for PE.** Arbitrary — only differences matter. Pick convenient zero.`,
    },
    {
      code: '3.4',
      title: 'Conservation of energy',
      content:
`**Mechanical energy.** E_mech = KE + PE.

**Conservation.** If only conservative forces act, E_mech = constant.
- KE_i + PE_i = KE_f + PE_f.

**With friction or other non-conservative.**
- ΔE_mech = W_nc (work by non-conservative).
- Energy is "lost" to heat, sound, deformation.

**Roller coaster problem.**
- No friction: speed at any point determined by height alone.
- At lower elevation → faster.
- KE + PE same at every point.

**Pendulum.**
- At lowest point: all KE.
- At highest point: all PE.
- Frequency independent of amplitude (for small swings).

**Spring + mass problem.**
- Stretched spring released: PE → KE → motion.
- At equilibrium: max speed.
- At extremes: speed = 0.

**Strategy for energy problems:**
1. Identify initial and final states.
2. Write KE + PE at each.
3. Set equal (if no non-conservative work) or differ by W_nc.
4. Solve.`,
    },
    {
      code: '3.5',
      title: 'Power',
      content:
`**Power (P).** Rate of doing work / transferring energy.

**P = W / t** = ΔE / t. Units: watt (W) = J/s.

**Also: P = F·v** when force and velocity in same direction.

**Examples:**
- Light bulb: 60 W = 60 J/s.
- Human: ~100 W rest; ~500 W heavy exercise.
- Car engine: ~100 kW (~130 hp).

**Energy = power × time.**
- 100 W bulb for 10 hr = 1000 W·h = 1 kWh.
- Electric bill: charged per kWh.

**Efficiency.** η = useful output / total input.
- Always < 100%.
- Car engine: ~25% (rest lost as heat).
- LED: ~30% (vs 5% incandescent).

**Horsepower (legacy).** 1 hp ≈ 746 W.`,
    },
  ],
  keyConcepts: [
    'Work = F·d·cos(θ); units J.',
    'Work-energy theorem: W_net = ΔKE.',
    'KE = ½mv²; doubling v quadruples KE.',
    'Gravitational PE = mgh; spring PE = ½kx².',
    'Mechanical energy conserved when only conservative forces.',
    'Friction converts mechanical → thermal (lost).',
    'Power = work/time; units W.',
    'P = F·v.',
  ],
  practice: [
    {
      q: 'A 2 kg ball drops from 5 m. Speed at ground (no air)?',
      a: 'mgh = ½mv² → v = √(2gh) = √(2·9.8·5) = √98 ≈ 9.9 m/s.',
    },
    {
      q: 'Lift 50 kg box 2 m in 4 s. Power?',
      a: 'W = mgh = 50·9.8·2 = 980 J. P = 980/4 = 245 W.',
    },
  ],
  pitfalls: [
    '"Holding heavy object is work" — physics work = 0 if no displacement.',
    '"PE depends on absolute height" — only differences matter.',
  ],
};
