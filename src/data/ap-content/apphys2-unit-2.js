// AP Physics 2 Unit 2 — Thermodynamics

export const APPHYS2_UNIT_2 = {
  number: 2,
  title: 'Thermodynamics',
  weight: '12-18%',
  subunits: [
    {
      code: '2.1',
      title: 'Temperature, heat, thermal energy',
      content:
`**Temperature.** Average kinetic energy of particles. Scalar.

**Scales.**
- Celsius: water freezes 0°C, boils 100°C at 1 atm.
- Kelvin: K = °C + 273.15. Absolute zero at 0 K.
- Fahrenheit: avoid in physics.

**Heat (Q).** Energy transferred due to temperature difference.

**Specific heat (c).** Energy to raise 1 kg by 1 K.
- Water: c = 4186 J/(kg·K). High; oceans buffer climate.
- Aluminum: 900.
- Iron: 450.

**Q = mcΔT.**

**Phase change.** Q = mL where L is latent heat (fusion or vaporization).
- Latent heat of fusion ice: 334 kJ/kg.
- Latent heat of vaporization water: 2260 kJ/kg.

**Thermal expansion.** ΔL = αLΔT.

**Heat transfer.**
- **Conduction:** through solids.
- **Convection:** through fluid flow.
- **Radiation:** via electromagnetic waves (no medium needed).`,
    },
    {
      code: '2.2',
      title: 'Ideal gas law and kinetic theory',
      content:
`**Ideal gas law.** PV = nRT (n = moles, R = 8.314 J/(mol·K)).
- Or PV = NkT (N = molecules, k = Boltzmann constant 1.38×10⁻²³ J/K).

**Boyle\'s, Charles\'s, Gay-Lussac\'s laws** are special cases.

**Kinetic theory.**
- Gas = many molecules in random motion.
- Average KE = (3/2)kT.
- Speed: v_rms = √(3kT/m) = √(3RT/M).
- Pressure from molecular collisions with walls.

**Temperature ↔ kinetic energy.** Hotter gas = faster molecules.

**Maxwell-Boltzmann distribution.** Range of speeds at given T; peak shifts to higher v as T rises.`,
    },
    {
      code: '2.3',
      title: 'First law of thermodynamics',
      content:
`**First law.** ΔU = Q + W (or Q − W depending on convention).
- ΔU: change in internal energy.
- Q: heat added to system (positive when added).
- W: work done on system (positive when work done on).

**Internal energy of ideal gas.** U = (3/2)NkT (monatomic). Depends only on T.

**Processes.**
- **Isothermal** (constant T): ΔU = 0; Q = −W (work done on gas).
- **Isobaric** (constant P): Q = nC_p ΔT; W = −PΔV.
- **Isochoric** (constant V): W = 0; Q = nC_v ΔT = ΔU.
- **Adiabatic** (Q = 0): ΔU = W.

**PV diagrams.** Process visualizations. Area under curve = work.

**Cyclic process.** Returns to start; ΔU = 0; net Q = net work.`,
    },
    {
      code: '2.4',
      title: 'Second law and entropy',
      content:
`**Second law.** Heat flows naturally from hot to cold. Entropy of isolated system never decreases.

**Entropy (S).** Measure of disorder. Units J/K.

**ΔS = Q/T** (reversible process).

**Heat engines.** Convert heat to work. Always: hot reservoir → engine → cold reservoir.
- Efficiency η = W/Q_h.
- Carnot (ideal): η = 1 − T_c/T_h. Maximum possible.
- Real engines always less efficient.

**Refrigerators/heat pumps.** Reverse: work input moves heat from cold to hot.

**Statistical interpretation.** Entropy = k·ln(W) where W = number of microstates.

**Arrow of time.** Entropy increases; defines forward direction.

**Implications.**
- 100% efficient engine impossible.
- Perpetual motion (2nd kind) impossible.
- Universe heading toward "heat death" (max entropy).`,
    },
  ],
  keyConcepts: [
    'K = °C + 273.15.',
    'Q = mcΔT for temperature change; Q = mL for phase change.',
    'PV = nRT.',
    'Avg KE = (3/2)kT.',
    'First law: ΔU = Q + W.',
    'Isothermal ΔU=0; isobaric Q = nC_pΔT; isochoric W=0; adiabatic Q=0.',
    'PV diagram area = work.',
    'Second law: entropy of isolated system never decreases.',
    'Carnot efficiency = 1 − T_c/T_h (maximum).',
  ],
  practice: [
    { q: 'Carnot engine T_h = 500K, T_c = 300K. Max efficiency?', a: 'η = 1 − 300/500 = 0.4 = 40%.' },
  ],
  pitfalls: [
    '"Heat = temperature" — no; heat is energy transfer, T is intensity.',
  ],
};
