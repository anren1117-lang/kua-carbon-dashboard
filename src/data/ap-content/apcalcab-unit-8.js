// AP Calculus AB Unit 8 — Applications of Integration (10-15%)

export const APCALCAB_UNIT_8 = {
  number: 8,
  title: 'Applications of Integration',
  weight: '10-15%',
  subunits: [
    {
      code: '8.1',
      title: 'Average value of a function',
      content:
`**Average value of f on [a, b]:**
f_avg = (1/(b-a)) · ∫_a^b f(x) dx

**Mean Value Theorem for Integrals.** If f is continuous on [a, b], there exists c in (a, b) where f(c) = f_avg.

**Example.** Average of f(x) = x² on [0, 3].
∫_0^3 x² dx = [x³/3]_0^3 = 9.
f_avg = 9/3 = 3.

**Applications:**
- Average velocity over time interval.
- Average temperature over a day.
- Average power over a cycle.`,
    },
    {
      code: '8.2',
      title: 'Position, velocity, acceleration via integration',
      content:
`Integrating reverses differentiating.

**v(t) = ∫a(t) dt** (with initial velocity).
**s(t) = ∫v(t) dt** (with initial position).

**Displacement** from t = a to t = b: ∫_a^b v(t) dt.

**Total distance traveled** from t = a to t = b: ∫_a^b |v(t)| dt.

Distance ≥ |displacement|.

**Example.** v(t) = t² - 4 on [0, 3]. Total distance?
v(t) = 0 at t = 2. v < 0 on [0, 2]; v > 0 on [2, 3].
∫_0^2 |t²-4| dt = ∫_0^2 (4-t²) dt = [4t - t³/3]_0^2 = 8 - 8/3 = 16/3.
∫_2^3 (t²-4) dt = [t³/3 - 4t]_2^3 = (9 - 12) - (8/3 - 8) = -3 - (-16/3) = 7/3.
Total = 16/3 + 7/3 = 23/3.

Displacement: ∫_0^3 (t²-4) dt = [t³/3 - 4t]_0^3 = 9 - 12 = -3. Net moved 3 units backward.`,
    },
    {
      code: '8.3',
      title: 'Area between curves',
      content:
`**Area between f(x) and g(x) on [a, b]** (where f ≥ g):
A = ∫_a^b [f(x) - g(x)] dx

**Steps:**
1. Find intersections by solving f = g.
2. Determine which is on top in each interval.
3. Integrate (top - bottom).

**Worked example.** Area between y = x² and y = 2x.
Intersections: x² = 2x → x² - 2x = 0 → x = 0 or x = 2.
On [0, 2], 2x > x².
A = ∫_0^2 (2x - x²) dx = [x² - x³/3]_0^2 = 4 - 8/3 = 4/3.

**If curves cross**, split integral at crossings.

**Integration with respect to y.** Sometimes easier when curves are functions of y.
A = ∫_c^d [right - left] dy.`,
    },
    {
      code: '8.4',
      title: 'Volumes of solids — disk and washer methods',
      content:
`**Volume of solid of revolution** (rotating curve around an axis).

**Disk method** (no hole). Rotate y = f(x) around x-axis on [a, b]:
V = π ∫_a^b [f(x)]² dx

**Washer method** (has hole). When the region is bounded by two functions:
V = π ∫_a^b ([R(x)]² - [r(x)]²) dx

where R = outer radius, r = inner radius.

**Worked example.** Rotate y = √x on [0, 4] around x-axis.
V = π ∫_0^4 (√x)² dx = π ∫_0^4 x dx = π [x²/2]_0^4 = 8π.

**With washer.** Region between y = √x and y = x/2 rotated around x-axis on [0, 4].
R = √x (outer), r = x/2 (inner) on [0, 4] where √x ≥ x/2.
V = π ∫_0^4 (x - x²/4) dx = π [x²/2 - x³/12]_0^4 = π(8 - 16/3) = 8π/3.`,
    },
    {
      code: '8.5',
      title: 'Volumes — shell and cross-section methods',
      content:
`**Cylindrical shells** (alternate to disk/washer):
V = 2π ∫_a^b x · f(x) dx (rotating around y-axis).

**Known cross-sections.** If solid has cross-sections perpendicular to an axis that are known shapes (squares, equilateral triangles, semicircles), integrate areas.

V = ∫_a^b A(x) dx.

**Worked example.** Region bounded by y = √x and x-axis from 0 to 4. Cross-sections perpendicular to x-axis are squares with side = f(x).
V = ∫_0^4 (√x)² dx = ∫_0^4 x dx = 8.

**Common cross-sections:**
- Square: A(x) = [f(x)]².
- Semicircle: A(x) = (π/8) · [f(x)]².
- Equilateral triangle: A(x) = (√3/4) · [f(x)]².`,
    },
  ],
  keyConcepts: [
    'Average value: (1/(b-a))∫f.',
    'Position from velocity: s(t) = ∫v(t) dt.',
    'Distance = ∫|v(t)| dt; displacement = ∫v(t) dt.',
    'Area between curves = ∫(top - bottom).',
    'Volume by disk: V = π∫[f(x)]² dx.',
    'Volume by washer: V = π∫([R]² - [r]²) dx.',
    'Volume by cross-sections: V = ∫A(x) dx.',
  ],
  formulas: [
    {
      name: 'Area between curves',
      equation: 'A = ∫_a^b [f(x) - g(x)] dx where f ≥ g',
      meaning: 'Subtract bottom function from top, integrate.',
      example: 'Between y=x² and y=2x on [0,2]: A = ∫(2x-x²) dx = 4/3.',
    },
    {
      name: 'Volume of revolution (disk)',
      equation: 'V = π ∫_a^b [f(x)]² dx',
      meaning: 'Rotate curve around x-axis; each cross-section is a disk.',
      example: 'y = √x on [0,4] around x-axis: V = π∫_0^4 x dx = 8π.',
    },
  ],
  practice: [
    {
      q: 'Find average value of f(x) = sin(x) on [0, π].',
      a: 'f_avg = (1/π)∫_0^π sin(x) dx = (1/π)[-cos(x)]_0^π = (1/π)(1-(-1)) = 2/π.',
    },
    {
      q: 'Velocity v(t) = 3t² - 12 on [0, 3]. Find total distance traveled.',
      a: 'v = 0 at t = 2. v < 0 on [0, 2]; v > 0 on [2, 3]. ∫_0^2 |3t²-12| dt + ∫_2^3 (3t²-12) dt = ∫_0^2 (12-3t²) dt + ∫_2^3 (3t²-12) dt = (24-8) + (9-(-16)) = 16 + 25 = 41/?. Actually: ∫_0^2 (12-3t²) dt = [12t-t³]_0^2 = 24-8 = 16. ∫_2^3 (3t²-12) dt = [t³-12t]_2^3 = (27-36)-(8-24) = -9-(-16) = 7. Total = 23.',
    },
  ],
  pitfalls: [
    '"Distance = displacement" — different. Distance always positive.',
    '"Average value = average of endpoints" — only for linear functions.',
    '"Disk method only" — sometimes washer (hole) needed.',
  ],
};
