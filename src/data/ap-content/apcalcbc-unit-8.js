// AP Calc BC Unit 8 — Applications of Integration

export const APCALCBC_UNIT_8 = {
  number: 8,
  title: 'Applications of Integration',
  weight: '10-15%',
  subunits: [
    {
      code: '8.1',
      title: 'Area between curves',
      content:
`**Area between two curves.** If f ≥ g on [a, b]:
A = ∫(a to b) [f(x) − g(x)] dx.

**With respect to y:** A = ∫(c to d) [right − left] dy.

**Find intersections** to determine limits and which is on top.`,
    },
    {
      code: '8.2',
      title: 'Volumes by disks/washers',
      content:
`**Disk method (rotation about axis).**
V = π ∫(a to b) [R(x)]² dx.

**Washer method (annulus shape).**
V = π ∫(a to b) ([R(x)]² − [r(x)]²) dx.

Where R = outer radius, r = inner radius.

**Cross-sections (BC).**
- V = ∫(a to b) A(x) dx where A(x) is cross-sectional area.
- Squares, semicircles, equilateral triangles, etc.

**Shell method (BC alternative).** V = 2π ∫(a to b) x · h(x) dx for rotation about y-axis.`,
    },
    {
      code: '8.3',
      title: 'Arc length and surface area (BC)',
      content:
`**Arc length.** L = ∫(a to b) √(1 + [f′(x)]²) dx.

**Surface area of revolution.** S = 2π ∫(a to b) f(x) · √(1 + [f′(x)]²) dx (about x-axis).

**Average value.** f_avg = (1/(b−a)) ∫(a to b) f(x) dx.

**Mean Value Theorem for integrals.** There exists c in [a, b] with f(c) = average value.`,
    },
    {
      code: '8.4',
      title: 'Parametric and polar (BC)',
      content:
`**Parametric equations.** x = x(t), y = y(t).

**Derivative.** dy/dx = (dy/dt)/(dx/dt).

**Second derivative.** d²y/dx² = d/dx[dy/dx] / (dx/dt).

**Arc length (parametric).** L = ∫(a to b) √((dx/dt)² + (dy/dt)²) dt.

**Polar coordinates.** (r, θ).

**Conversion.** x = r·cos θ, y = r·sin θ.

**Area in polar.** A = (1/2) ∫(α to β) [r(θ)]² dθ.

**Slope in polar.** dy/dx = (dr/dθ sin θ + r cos θ)/(dr/dθ cos θ − r sin θ).

**Common polar curves.** r = 1 (circle), r = θ (spiral), r = 1 + cos θ (cardioid), r = 2 cos(2θ) (4-petal rose).`,
    },
  ],
  keyConcepts: [
    'Area between curves: ∫(top − bottom) dx.',
    'Disk: V = π∫R² dx; washer: π∫(R² − r²) dx.',
    'Cross-sections: V = ∫A(x) dx.',
    'Arc length (BC): ∫√(1 + (f′)²) dx.',
    'Average value: f_avg = ∫f/(b−a).',
    'Parametric (BC): dy/dx = (dy/dt)/(dx/dt).',
    'Polar area (BC): (1/2)∫r² dθ.',
  ],
  practice: [
    { q: 'Volume rotating y = x² about x-axis from 0 to 2.', a: 'V = π∫(0 to 2) x⁴ dx = π·(32/5) = 32π/5.' },
  ],
  pitfalls: [
    '"Forgot π in volume formula" — common.',
    '"Used dx instead of dt" for parametric arc length.',
  ],
};
