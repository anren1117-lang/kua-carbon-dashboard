// AP Physics 1 Unit 8 — Waves, Sound, and Electric Charge

export const APPHYS1_UNIT_8 = {
  number: 8,
  title: 'Waves, Sound, and Electric Charge',
  weight: '10-15%',
  subunits: [
    {
      code: '8.1',
      title: 'Wave properties',
      content:
`**Wave.** Disturbance that transfers energy without transferring matter.

**Types:**
- **Mechanical**: needs medium (water, sound, springs).
- **Electromagnetic**: doesn\'t (light, radio).
- **Transverse**: oscillation ⊥ direction of travel (light, string waves, ocean surface).
- **Longitudinal**: oscillation ∥ direction (sound, P-waves in earthquakes).

**Key parameters:**
- **Wavelength (λ)**: distance for one full cycle.
- **Period (T)**: time for one cycle.
- **Frequency (f) = 1/T**: cycles per second; Hz.
- **Amplitude (A)**: max displacement from equilibrium.
- **Speed (v)**: how fast disturbance propagates.

**Wave equation.** v = f·λ.

**Speed depends on medium**, not source. Sound in air: ~343 m/s at room temp. Light in vacuum: 3×10⁸ m/s. Sound in steel: ~5000 m/s.

**Energy of wave** ∝ amplitude² (and frequency² for many waves).`,
    },
    {
      code: '8.2',
      title: 'Superposition and interference',
      content:
`**Superposition principle.** When waves overlap, total displacement = sum of individual.

**Constructive interference.** Crests align with crests → larger amplitude.
- Path difference = nλ (integer wavelengths).

**Destructive interference.** Crests align with troughs → cancel.
- Path difference = (n + ½)λ (half-integer wavelengths).

**Standing waves.** Two waves of same f, opposite direction → standing pattern.
- Nodes: zero displacement (destructive).
- Antinodes: max displacement.
- Form on strings, in pipes, in microwaves.

**String fixed both ends.** Length = n·λ/2.
- Fundamental: λ = 2L, f_1 = v/(2L).
- Harmonics: f_n = n·f_1.

**Open pipe.** λ = 2L/n. Same harmonic series.
**Closed pipe** (one end closed). λ = 4L/(2n−1). Odd harmonics only.

**Beats.** Two waves slightly different f → amplitude pulses at f_beat = |f_1 − f_2|. Musicians use to tune instruments.`,
    },
    {
      code: '8.3',
      title: 'Sound and Doppler',
      content:
`**Sound waves.** Longitudinal compressions in air (or other media).

**Speed of sound in air:** ~343 m/s at 20°C; increases ~0.6 m/s per °C.

**Frequency → pitch.**
- Low f → low pitch.
- Human hearing: ~20 Hz to 20,000 Hz.
- Bats, dolphins: ultrasonic.

**Amplitude → loudness.**
- Loudness measured in dB (logarithmic).
- Quiet whisper ~30 dB. Loud rock concert ~110 dB. Pain threshold ~120 dB.

**Doppler effect.** Frequency changes when source or observer moves.
- Source approaching: higher pitch (waves compressed).
- Source receding: lower pitch.
- f_observed = f_source · (v ± v_obs) / (v ∓ v_source).
- Used in radar, weather, blood flow imaging.

**Sonic boom.** Source moving faster than wave speed → shock wave cone.

**Resonance in instruments.**
- Guitar string: standing waves on string drive sound.
- Wind instruments: standing waves in air column.
- Length determines pitch.

**Echo.** Sound reflects. Time tells distance. Basis of sonar, ultrasound imaging.`,
    },
    {
      code: '8.4',
      title: 'Electric charge and Coulomb\'s law',
      content:
`**Charge (q).** Property of matter. Two types: positive and negative.
- Like charges repel.
- Opposites attract.
- Unit: coulomb (C).
- Elementary charge e = 1.6×10⁻¹⁹ C.

**Charge is conserved.** Total charge of isolated system constant.

**Charge is quantized.** Always integer multiple of e.

**Coulomb\'s law.** F = k·|q_1·q_2|/r².
- k = 9×10⁹ N·m²/C² (Coulomb constant).
- Force along line connecting charges.
- Same form as gravity but can be repulsive.

**Conductors vs insulators.**
- **Conductors** (metals): charges move freely.
- **Insulators** (rubber, wood): charges stay localized.
- **Semiconductors** (silicon): in between; basis of electronics.

**Ways to charge:**
- **Friction**: rubbing transfers electrons (balloon on hair).
- **Conduction**: contact transfer.
- **Induction**: bring charge near; rearrange charges in target (no contact).

**Grounding.** Connect to earth → charges flow until neutral.

**Field concept.** Charge creates E field; other charges feel force from field. F = qE.
- For point charge: E = kQ/r².
- Field lines: from + to −. Tangent to field at every point.

**Static electricity examples.** Lightning, static shock from door knob, photocopier toner attraction.`,
    },
  ],
  keyConcepts: [
    'Waves transfer energy, not matter.',
    'v = fλ.',
    'Transverse vs longitudinal.',
    'Superposition: constructive (path diff = nλ), destructive ((n+½)λ).',
    'Standing waves: nodes and antinodes; harmonic series.',
    'Doppler: pitch up when approaching, down when receding.',
    'Beats: f_beat = |f_1 − f_2|.',
    'Coulomb: F = kq_1q_2/r².',
    'Charge conserved and quantized (multiple of e).',
  ],
  practice: [
    {
      q: 'Sound at 200 Hz in air. Wavelength?',
      a: 'v = fλ → λ = 343/200 ≈ 1.72 m.',
    },
  ],
  pitfalls: [
    '"Frequency changes with medium" — no; f set by source; λ and v change with medium.',
    '"Doppler changes the source frequency" — no; only observed.',
  ],
};
