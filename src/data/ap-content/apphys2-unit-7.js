// AP Physics 2 Unit 7 — Quantum, Atomic, Nuclear

export const APPHYS2_UNIT_7 = {
  number: 7,
  title: 'Quantum, Atomic, and Nuclear Physics',
  weight: '10-12%',
  subunits: [
    {
      code: '7.1',
      title: 'Quantum nature of light',
      content:
`**Photons.** Light comes in quanta of energy.
- E = hf = hc/λ.
- h = 6.626×10⁻³⁴ J·s (Planck\'s constant).

**Photoelectric effect.** Light ejects electrons from metals.
- Threshold frequency f_0: below it, no electrons regardless of intensity.
- KE_max = hf − φ (φ = work function).
- Demonstrates light\'s particle nature.
- Won Einstein\'s 1921 Nobel.

**Compton scattering.** Photon-electron collision shows momentum p = h/λ.

**Wave-particle duality.** Light: both wave (interference, diffraction) and particle (photoelectric, Compton).

**De Broglie wavelength.** Matter has wave character: λ = h/p.
- Electrons show interference.
- Foundation of electron microscopy.`,
    },
    {
      code: '7.2',
      title: 'Atomic structure',
      content:
`**Bohr model.** Hydrogen.
- Electron in quantized orbits.
- E_n = −13.6 eV/n² (n = 1, 2, ...).
- Transition: photon emitted/absorbed with E = ΔE.

**Hydrogen spectrum.** Discrete spectral lines.
- Balmer series (visible): transitions to n=2.
- Lyman (UV): to n=1.
- Paschen (IR): to n=3.

**Quantum mechanics (modern).**
- Electron in probability cloud (orbital), not orbit.
- Quantum numbers: n, l, m_l, m_s.
- Pauli exclusion: no two electrons same state.

**Energy levels.**
- E = hf for emitted photon.
- Conservation of energy.

**Lasers.** Stimulated emission. Coherent monochromatic light.`,
    },
    {
      code: '7.3',
      title: 'Nuclear physics',
      content:
`**Nucleus.** Protons + neutrons (nucleons).

**Notation.** ^A_Z X.
- A = mass number (nucleons).
- Z = atomic number (protons).
- N = A − Z (neutrons).

**Isotopes.** Same Z, different N.

**Strong force.** Binds nucleons; short range.

**Binding energy.** Energy needed to dismantle nucleus.
- Mass-energy: ΔE = Δm·c².
- Curve of binding energy: peak around iron.
- Fusion (light) and fission (heavy) both release energy.

**Radioactive decay.**

**Alpha (α).** Emit ^4_2He.
- A decreases by 4; Z by 2.

**Beta minus (β⁻).** Neutron → proton + electron + antineutrino.
- Z increases by 1; A unchanged.

**Beta plus (β⁺).** Proton → neutron + positron + neutrino.
- Z decreases by 1.

**Gamma (γ).** High-energy photon. No change in A or Z; nucleus de-excites.

**Half-life.** Time for half of sample to decay.
- N(t) = N_0 · (1/2)^(t/T_½).

**Fission.** Splitting heavy nucleus (uranium, plutonium). Releases energy + neutrons. Chain reaction. Reactor or bomb.

**Fusion.** Combining light nuclei (hydrogen → helium). Powers stars. Sought for clean energy. ITER experimental reactor.

**E = mc².** Mass and energy equivalent. Famous Einstein result. Mass defect in nucleus → binding energy.`,
    },
  ],
  keyConcepts: [
    'E = hf for photons.',
    'Photoelectric: KE = hf − φ.',
    'de Broglie: λ = h/p (matter waves).',
    'Bohr H: E_n = −13.6/n² eV.',
    'Wave-particle duality.',
    'Nucleus: ^A_Z X; A = p+n; Z = p.',
    'Alpha, beta±, gamma decay.',
    'Half-life decay: N = N_0(1/2)^(t/T_½).',
    'E = mc² (mass-energy).',
    'Fission and fusion both release energy.',
  ],
  practice: [
    { q: 'Photon λ = 500 nm. Energy in eV?', a: 'E = hc/λ = (1240 eV·nm)/500 nm = 2.48 eV.' },
  ],
  pitfalls: [
    '"Light = wave OR particle" — both, depending on experiment.',
  ],
};
