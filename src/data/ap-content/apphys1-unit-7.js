// AP Physics 1 Unit 7 — Fluids

export const APPHYS1_UNIT_7 = {
  number: 7,
  title: 'Fluids',
  weight: '10-15%',
  subunits: [
    {
      code: '7.1',
      title: 'Density and pressure',
      content:
`**Density (ρ).** ρ = m/V. Units kg/m³.
- Water: 1000 kg/m³.
- Air at sea level: ~1.2 kg/m³.
- Iron: 7870. Mercury: 13,600.

**Pressure (P).** Force per area. P = F/A. Units pascal (Pa) = N/m².
- 1 atm ≈ 101,325 Pa ≈ 14.7 psi.
- Pressure is scalar (acts equally in all directions in a fluid).

**Hydrostatic pressure (in a fluid at rest).**
- P = ρ·g·h (gauge pressure due to fluid column of height h).
- Total pressure at depth h below surface (with atmosphere): P_total = P_atm + ρ·g·h.

**Pascal\'s principle.** Pressure applied to enclosed fluid transmitted undiminished to all parts.
- Hydraulic lift: small force on small piston → big force on big piston.
- F_1/A_1 = F_2/A_2.

**Why scuba divers must equalize.** Pressure increases ~1 atm per 10 m descent.

**Why blood pressure differs in legs vs head.** Just hydrostatic ρgh.`,
    },
    {
      code: '7.2',
      title: 'Buoyancy — Archimedes',
      content:
`**Archimedes\' principle.** Buoyant force on submerged or floating object = weight of displaced fluid.
- F_buoy = ρ_fluid · V_displaced · g.

**Submerged object:**
- V_displaced = V_object.
- If ρ_object > ρ_fluid: net force down, sinks.
- If ρ_object < ρ_fluid: net force up, rises.

**Floating object:**
- F_buoy = weight (equilibrium).
- ρ_fluid · V_submerged · g = ρ_object · V_object · g.
- V_submerged / V_object = ρ_object / ρ_fluid (fraction submerged).
- Ice in water: ~90% submerged (ρ_ice ≈ 0.92 g/cm³).

**Apparent weight in fluid.** W_apparent = W_actual − F_buoy.
- You feel lighter in water.

**Example: 1 m³ object in water.**
- F_buoy = 1000 · 1 · 9.8 = 9800 N.
- If object weighs 5000 N: floats; only fraction submerged.
- If object weighs 15,000 N: sinks; apparent weight 15,000 − 9800 = 5200 N.`,
    },
    {
      code: '7.3',
      title: 'Continuity and Bernoulli',
      content:
`For ideal fluid (incompressible, inviscid, steady flow):

**Continuity.** Mass flow rate same everywhere.
- ρ·A·v = constant.
- Incompressible: A·v = constant. (volume flow rate Q).
- Pipe narrows → flow speeds up.
- Why thumb on hose makes water shoot faster.

**Bernoulli\'s equation.** Energy conservation for fluid.
- P + ½·ρ·v² + ρ·g·h = constant along streamline.
- Higher speed → lower pressure.

**Applications:**
- **Airplane wing.** Faster flow over top → lower pressure → lift.
- **Roof in hurricane.** Wind over roof: lower P above; can lift roof off.
- **Carburetor / atomizer.** Fast flow draws fuel/perfume.
- **Curving baseball.** Pressure differential across spinning ball.

**Limitations.** Real fluids have viscosity (friction). Turbulent flow violates assumptions. Compressible flow (high speed gas) needs more.

**Venturi effect.** Narrow section in pipe → faster flow → lower pressure → can measure flow rate.`,
    },
  ],
  keyConcepts: [
    'Density ρ = m/V; water 1000 kg/m³.',
    'Pressure P = F/A; units Pa.',
    'Hydrostatic: P = ρgh.',
    'Pascal: pressure transmitted equally; basis for hydraulic lift.',
    'Archimedes: F_buoy = ρ_fluid · V_displaced · g.',
    'Floating: fraction submerged = ρ_obj / ρ_fluid.',
    'Continuity: A·v = const.',
    'Bernoulli: P + ½ρv² + ρgh = const.',
    'Faster flow → lower pressure (lift, atomizer).',
  ],
  practice: [
    {
      q: 'Block of wood ρ=600 kg/m³ floats. Fraction submerged?',
      a: 'ρ_obj / ρ_water = 600/1000 = 0.6 → 60% submerged.',
    },
  ],
  pitfalls: [
    '"Heavy objects sink" — depends on density vs fluid, not weight.',
    '"Wing lift = Bernoulli alone" — Newton 3rd law (air deflection) also major.',
  ],
};
