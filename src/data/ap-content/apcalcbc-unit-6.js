// AP Calc BC Unit 6 — Integration and Accumulation of Change

export const APCALCBC_UNIT_6 = {
  number: 6,
  title: 'Integration and Accumulation',
  weight: '17-20%',
  subunits: [
    {
      code: '6.1',
      title: 'Antiderivatives and Fundamental Theorem',
      content:
`**Antiderivative.** F is antiderivative of f if F′ = f.

**Indefinite integral.** ∫f(x) dx = F(x) + C.

**Power rule.** ∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ −1).

**Common integrals.**
- ∫dx = x + C.
- ∫1/x dx = ln|x| + C.
- ∫eˣ dx = eˣ + C.
- ∫sin x dx = −cos x + C.
- ∫cos x dx = sin x + C.
- ∫sec²x dx = tan x + C.
- ∫1/(1+x²) dx = arctan x + C.
- ∫1/√(1−x²) dx = arcsin x + C.

**FTC Part 1.** F′(x) = d/dx[∫(a to x) f(t) dt] = f(x).

**FTC Part 2.** ∫(a to b) f(x) dx = F(b) − F(a) where F is antiderivative of f.`,
    },
    {
      code: '6.2',
      title: 'Riemann sums',
      content:
`**Riemann sum.** Approximate area under curve using rectangles.

**Types.**
- **Left** (LRAM): height = f at left endpoint.
- **Right** (RRAM): height at right endpoint.
- **Midpoint**: at middle.
- **Trapezoid**: average of left and right.

**Trapezoidal rule.** ∫(a to b) f dx ≈ (Δx/2)[f(x₀) + 2f(x₁) + 2f(x₂) + ... + 2f(x_{n−1}) + f(x_n)].

**Limit of Riemann sum = definite integral.**`,
    },
    {
      code: '6.3',
      title: 'Substitution (u-substitution)',
      content:
`**Procedure.**
1. Pick u inside function.
2. Find du.
3. Rewrite integral in terms of u.
4. Integrate.
5. Substitute back.

**Example.** ∫2x·sin(x²) dx.
- u = x²; du = 2x dx.
- ∫sin(u) du = −cos(u) + C = −cos(x²) + C.

**For definite integrals.** Change limits to u-values, no need to substitute back.

**Choosing u.** Usually inside function, especially if its derivative is also present.`,
    },
    {
      code: '6.4',
      title: 'Integration by parts (BC)',
      content:
`**Integration by parts.** ∫u dv = uv − ∫v du.

Derived from product rule.

**Choose u and dv:**
- u: something whose derivative simplifies (often a polynomial or ln x).
- dv: rest of integrand, which you can integrate.

**LIATE mnemonic** for u: Log, Inverse trig, Algebra, Trig, Exponential. Pick the one earliest in list.

**Example.** ∫x·eˣ dx.
- u = x, dv = eˣ dx.
- du = dx, v = eˣ.
- ∫u dv = xeˣ − ∫eˣ dx = xeˣ − eˣ + C.

**Example.** ∫ln x dx.
- u = ln x, dv = dx.
- du = 1/x dx, v = x.
- = x·ln x − ∫1 dx = x·ln x − x + C.

**Sometimes apply twice or use ingenious trick.**`,
    },
    {
      code: '6.5',
      title: 'Partial fractions and improper integrals (BC)',
      content:
`**Partial fractions.** Break rational function into simpler pieces.

**Example.** ∫1/(x² − 1) dx.
- 1/(x² − 1) = 1/[(x−1)(x+1)] = A/(x−1) + B/(x+1).
- Solve: A = 1/2, B = −1/2.
- ∫ = (1/2)ln|x−1| − (1/2)ln|x+1| + C.

**Improper integrals.** Infinite limits or discontinuity.

**Infinite limit.** ∫(a to ∞) f dx = lim(t→∞) ∫(a to t) f dx.

**Discontinuity.** ∫(a to b) where f undefined at c: split at c, take limit.

**Converges** if limit exists; **diverges** otherwise.

**Example.** ∫(1 to ∞) 1/x² dx.
- = lim(t→∞) [−1/x] from 1 to t.
- = lim(t→∞) (−1/t + 1) = 1.
- Converges to 1.

**∫1/x dx from 1 to ∞ diverges** (ln t → ∞).`,
    },
  ],
  keyConcepts: [
    'Antiderivative F with F′ = f.',
    'Power rule: ∫xⁿ = xⁿ⁺¹/(n+1).',
    'FTC: ∫(a to b) f = F(b) − F(a).',
    'Riemann sums: left, right, midpoint, trapezoid.',
    'u-substitution: pick u inside, get du.',
    'Integration by parts (BC): ∫u dv = uv − ∫v du. LIATE.',
    'Partial fractions (BC): split rational into simpler.',
    'Improper integrals (BC): infinite or discontinuous; take limit.',
  ],
  practice: [
    { q: '∫x·cos x dx.', a: 'By parts: u=x, dv=cos x dx. = x·sin x − ∫sin x dx = x·sin x + cos x + C.' },
  ],
  pitfalls: [
    '"Forgot +C" — common deduction.',
    '"By parts: u = harder thing" — use LIATE.',
  ],
};
