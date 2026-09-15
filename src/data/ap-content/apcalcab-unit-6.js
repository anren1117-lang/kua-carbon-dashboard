// AP Calculus AB Unit 6 — Integration and Accumulation of Change (17-20%)

export const APCALCAB_UNIT_6 = {
  number: 6,
  title: 'Integration and Accumulation of Change',
  weight: '17-20%',
  subunits: [
    {
      code: '6.1',
      title: 'Exploring accumulations of change',
      content:
`Integration is accumulation. If f(x) represents a rate, then ∫f(x)dx represents total accumulated.

**Examples of accumulation:**
- Velocity → position (integrate velocity over time).
- Population growth rate → population.
- Heat flow rate → total heat.
- Marginal cost → total cost.

**Geometric.** Integral = area under curve (signed: positive above x-axis, negative below).

**Notation.** ∫_a^b f(x) dx = definite integral from a to b.`,
    },
    {
      code: '6.2',
      title: 'Approximating areas with Riemann sums',
      content:
`Approximate area under curve with rectangles.

**Riemann sums.** Divide [a, b] into n subintervals of width Δx = (b-a)/n. Heights = function values at chosen points.

**Three common methods:**
- **Left sum**: f(x_i) at left endpoint.
- **Right sum**: f(x_{i+1}) at right endpoint.
- **Midpoint sum**: f at midpoint of each interval.

**Trapezoidal sum.** Use trapezoids instead of rectangles. (Left + Right)/2.

**Worked example.** Approximate ∫_0^2 x² dx with 4 rectangles, left endpoints.
Δx = 0.5. Heights: f(0), f(0.5), f(1), f(1.5) = 0, 0.25, 1, 2.25.
Left sum = 0.5(0 + 0.25 + 1 + 2.25) = 0.5(3.5) = 1.75.

Actual: ∫_0^2 x² dx = 8/3 ≈ 2.67. Left sum underestimates (function increasing).

**Convergence.** As n → ∞, Riemann sum → true integral.`,
    },
    {
      code: '6.3',
      title: 'Definite integral as a limit',
      content:
`Definite integral = limit of Riemann sums:
∫_a^b f(x) dx = lim (n → ∞) Σ f(x_i) Δx

**Properties of definite integrals:**
- ∫_a^a f(x) dx = 0.
- ∫_a^b f(x) dx = -∫_b^a f(x) dx (reverse limits, flip sign).
- ∫_a^b [c·f(x)] dx = c·∫_a^b f(x) dx.
- ∫_a^b [f(x) ± g(x)] dx = ∫_a^b f(x) dx ± ∫_a^b g(x) dx.
- ∫_a^c f(x) dx + ∫_c^b f(x) dx = ∫_a^b f(x) dx (additivity).
- If f ≥ g, then ∫f ≥ ∫g.`,
    },
    {
      code: '6.4',
      title: 'The Fundamental Theorem of Calculus',
      content:
`The bridge between derivatives and integrals.

**FTC Part 1.** If F\'(x) = f(x), then ∫_a^b f(x) dx = F(b) - F(a).

In words: to integrate f, find an antiderivative F; subtract F(a) from F(b).

**Notation.** ∫_a^b f(x) dx = [F(x)]_a^b = F(b) - F(a).

**Worked example.** ∫_1^3 x² dx.
Antiderivative: F(x) = x³/3.
∫_1^3 = [x³/3]_1^3 = 27/3 - 1/3 = 26/3.

**FTC Part 2.** If F(x) = ∫_a^x f(t) dt, then F\'(x) = f(x).

In words: differentiating an integral with variable upper limit gives back the integrand.

**Worked example.** d/dx [∫_0^x sin(t²) dt] = sin(x²).

**With chain rule.** d/dx [∫_0^(x²) sin(t) dt] = sin(x²) · 2x.

**Why so important.** Connects two foundational operations of calculus. Tells us we can compute definite integrals by finding antiderivatives.`,
    },
    {
      code: '6.5',
      title: 'Antiderivatives and indefinite integrals',
      content:
`**Antiderivative.** F is an antiderivative of f if F\' = f. There are infinitely many (differ by constant).

**Indefinite integral:** ∫f(x) dx = F(x) + C (most general antiderivative).

**Basic antiderivatives** (reverse of derivative rules):
- ∫xⁿ dx = x^(n+1)/(n+1) + C (n ≠ -1).
- ∫x⁻¹ dx = ln|x| + C.
- ∫eˣ dx = eˣ + C.
- ∫sin x dx = -cos x + C.
- ∫cos x dx = sin x + C.
- ∫sec²x dx = tan x + C.
- ∫(1/(1+x²)) dx = arctan x + C.
- ∫(1/√(1-x²)) dx = arcsin x + C.

**Properties:**
- ∫c·f dx = c·∫f dx.
- ∫(f ± g) dx = ∫f dx ± ∫g dx.`,
    },
    {
      code: '6.6',
      title: 'Integration by substitution',
      content:
`**U-substitution.** Reverse of chain rule.

**Steps:**
1. Choose u = g(x) (something inside another function).
2. Compute du = g\'(x) dx.
3. Rewrite integral in terms of u.
4. Integrate.
5. Substitute back.

**Example.** ∫2x·cos(x²) dx.
Let u = x²; du = 2x dx.
∫cos(u) du = sin(u) + C = sin(x²) + C.

**With definite integrals**, change limits too.
∫_0^1 2x·cos(x²) dx. u = x²; when x = 0, u = 0; when x = 1, u = 1.
= ∫_0^1 cos(u) du = [sin(u)]_0^1 = sin(1).

**Common substitutions:**
- Inside a power: u = inside.
- Inside a trig function: u = inside.
- Denominator: u = denominator (or function of it).

**Tricky cases:**
- ∫sin³(x)cos(x) dx. u = sin(x). du = cos(x) dx. ∫u³ du = u⁴/4 = sin⁴(x)/4 + C.`,
    },
  ],
  keyConcepts: [
    'Definite integral = signed area under curve.',
    'Riemann sums approximate area; left, right, midpoint, trapezoidal.',
    'FTC Part 1: ∫_a^b f = F(b) - F(a) where F\' = f.',
    'FTC Part 2: d/dx[∫_a^x f(t) dt] = f(x).',
    'Antiderivative: ∫f dx = F(x) + C.',
    'Power rule for integrals: ∫xⁿ = x^(n+1)/(n+1) + C (n ≠ -1).',
    'U-substitution reverses chain rule.',
  ],
  formulas: [
    {
      name: 'Fundamental Theorem',
      equation: '∫_a^b f(x) dx = F(b) - F(a) where F\' = f',
      meaning: 'Connects derivatives and integrals; enables exact computation.',
      example: '∫_0^2 x² dx = [x³/3]_0^2 = 8/3.',
    },
    {
      name: 'Power rule for integrals',
      equation: '∫xⁿ dx = x^(n+1)/(n+1) + C   (n ≠ -1)',
      meaning: 'Add one to exponent, divide by new exponent.',
      example: '∫x³ dx = x⁴/4 + C. ∫1/x dx = ln|x| + C.',
    },
  ],
  practice: [
    {
      q: 'Evaluate ∫_1^4 (2x + 3) dx.',
      a: 'F(x) = x² + 3x. F(4) - F(1) = (16+12) - (1+3) = 28 - 4 = 24.',
    },
    {
      q: 'Evaluate ∫x·e^(x²) dx.',
      a: 'u = x². du = 2x dx, so x dx = du/2. ∫e^u · du/2 = (1/2)e^u + C = (1/2)e^(x²) + C.',
    },
  ],
  pitfalls: [
    '"Forget +C" — indefinite integrals always include constant.',
    '"∫1/x dx = ln(x)" — should be ln|x|.',
    '"Forget to change limits in u-sub" — must change for definite integrals OR substitute back.',
  ],
};
