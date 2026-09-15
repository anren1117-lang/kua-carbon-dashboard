// AP Physics 2 Unit 6 — Geometric and Physical Optics

export const APPHYS2_UNIT_6 = {
  number: 6,
  title: 'Geometric and Physical Optics',
  weight: '12-15%',
  subunits: [
    {
      code: '6.1',
      title: 'Reflection and refraction',
      content:
`**Light is electromagnetic wave.** Visible: ~400-700 nm wavelength.

**Speed of light.** c = 3×10⁸ m/s in vacuum.

**Index of refraction.** n = c/v_medium.
- Air: ~1.0003.
- Water: 1.33.
- Glass: ~1.5.
- Diamond: 2.42.

**Reflection.** θ_i = θ_r (angle of incidence = angle of reflection).

**Refraction (Snell\'s law).** n₁ sin θ₁ = n₂ sin θ₂.

**Total internal reflection.** When n₁ > n₂ and θ₁ > critical angle.
- sin θ_c = n₂/n₁.
- Used in fiber optics.

**Dispersion.** Different colors refract differently (n depends on λ). Creates rainbows.`,
    },
    {
      code: '6.2',
      title: 'Mirrors and lenses',
      content:
`**Mirror equation / thin lens equation.**
1/f = 1/d_o + 1/d_i.

**Magnification.** m = −d_i/d_o = h_i/h_o.

**Sign conventions.**

**Mirrors.**
- d_i positive: in front of mirror (real).
- d_i negative: behind mirror (virtual).
- f positive: concave (converging).
- f negative: convex (diverging).

**Lenses.**
- d_i positive: on opposite side from object (real).
- d_i negative: same side (virtual).
- f positive: converging.
- f negative: diverging.

**Image types.**
- Real: light actually converges; can project.
- Virtual: light only appears to converge; can\'t project.
- Inverted vs upright.
- Magnified vs reduced.

**Ray diagrams.** Trace 2-3 principal rays:
- Parallel to axis → through focal point.
- Through focal point → parallel.
- Through center → undeviated (lens) or reflected (mirror).

**Compound systems.** Image of first lens = object of second.

**Eye.** Lens focuses on retina. Adjusts (accommodation).

**Corrections.**
- Nearsighted (myopia): diverging lens.
- Farsighted (hyperopia): converging lens.`,
    },
    {
      code: '6.3',
      title: 'Wave optics — interference and diffraction',
      content:
`**Superposition of light waves.** Constructive (in phase) or destructive (out of phase).

**Double slit (Young).** Light through two narrow slits.
- Maxima at path difference = mλ.
- d sin θ = mλ (m = 0, ±1, ±2, ...).
- Bright fringes equally spaced (small angles).
- y_m = mλL/d (distance from center, screen at L).

**Single slit diffraction.**
- Minima at d sin θ = mλ.
- Wider central maximum.

**Diffraction grating.** Many slits. Sharp peaks.
- d sin θ = mλ.

**Interference in thin films.**
- Soap bubbles, oil slicks show colors.
- Path difference includes phase changes at boundaries.

**Polarization.** EM wave\'s E vector orientation.
- Unpolarized light has all directions.
- Polarizing filter selects one.
- Malus\'s law: I = I₀ cos²θ.

**Doppler effect for light.** Redshift (moving away), blueshift (approaching). Used in astronomy.`,
    },
  ],
  keyConcepts: [
    'n = c/v.',
    'Snell: n₁ sin θ₁ = n₂ sin θ₂.',
    'Total internal: sin θ_c = n₂/n₁.',
    'Mirror/lens: 1/f = 1/d_o + 1/d_i.',
    'm = −d_i/d_o.',
    'Real images: d_i > 0; virtual: < 0.',
    'Double slit: d sin θ = mλ for maxima.',
    'Polarization; Malus: I = I₀ cos²θ.',
  ],
  practice: [
    { q: 'Glass n=1.5. Critical angle going from glass to air?', a: 'sin θ_c = 1/1.5 → θ_c ≈ 41.8°.' },
  ],
  pitfalls: [
    '"Sign conventions optional" — get the formula wrong without them.',
  ],
};
