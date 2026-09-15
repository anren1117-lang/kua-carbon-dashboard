// AP Calculus AB Unit 5 — Analytical Applications of Differentiation (15-18%)

export const APCALCAB_UNIT_5 = {
  number: 5,
  title: 'Analytical Applications of Differentiation',
  weight: '15-18%',
  subunits: [
    {
      code: '5.1',
      title: 'Mean Value Theorem',
      content:
`**MVT.** If f is continuous on [a, b] and differentiable on (a, b), then there exists c in (a, b) such that:
f\'(c) = (f(b) - f(a)) / (b - a)

**Interpretation.** At some point c, the instantaneous rate equals the average rate.

**Geometrically.** Some tangent line is parallel to the secant line through (a, f(a)) and (b, f(b)).

**Example.** f(x) = x² on [0, 4]. f\'(c) = (16 - 0)/(4 - 0) = 4. So 2c = 4 → c = 2.

**Special case — Rolle\'s Theorem.** If f(a) = f(b) (besides MVT conditions), there\'s c with f\'(c) = 0.

**Real-world.** Speed camera: if you traveled 60 miles in 50 minutes, MVT says at some point you were going faster than the 60 mph limit (if continuous, smooth speed).`,
    },
    {
      code: '5.2',
      title: 'Extreme Value Theorem and critical points',
      content:
`**EVT.** Continuous function on closed interval [a, b] has absolute max and min.

**Critical points.** Where f\'(c) = 0 or f\'(c) undefined.

**Finding extrema on [a, b]:**
1. Find critical points in (a, b).
2. Evaluate f at critical points AND endpoints a, b.
3. Largest value = absolute max; smallest = absolute min.

**Example.** f(x) = x³ - 3x on [-2, 2].
f\'(x) = 3x² - 3 = 0 → x = ±1.
Evaluate:
- f(-2) = -8 + 6 = -2.
- f(-1) = -1 + 3 = 2.
- f(1) = 1 - 3 = -2.
- f(2) = 8 - 6 = 2.
Max = 2 at x = -1 and x = 2. Min = -2 at x = -2 and x = 1.`,
    },
    {
      code: '5.3',
      title: 'Increasing/decreasing and First Derivative Test',
      content:
`**Sign of f\' tells direction:**
- f\'(x) > 0: f is increasing.
- f\'(x) < 0: f is decreasing.
- f\'(x) = 0: critical point (possible max/min).

**First Derivative Test for local extrema:**
- f\' changes + to - at c: local MAX.
- f\' changes - to + at c: local MIN.
- No sign change: not a local extremum.

**Worked example.** f(x) = x³ - 3x. f\'(x) = 3x² - 3 = 3(x-1)(x+1).
- f\' > 0 on (-∞, -1): increasing.
- f\' < 0 on (-1, 1): decreasing.
- f\' > 0 on (1, ∞): increasing.
- At x = -1: f\' changes + to - → local MAX.
- At x = 1: f\' changes - to + → local MIN.`,
    },
    {
      code: '5.4',
      title: 'Concavity and Second Derivative Test',
      content:
`**Second derivative f\'\' tells concavity:**
- f\'\'(x) > 0: concave up (curve opens up; "cup").
- f\'\'(x) < 0: concave down ("cap").
- f\'\'(x) = 0: possible inflection point (concavity changes).

**Inflection point** where concavity changes.

**Second Derivative Test for local extrema:**
- f\'(c) = 0 AND f\'\'(c) > 0: local MIN.
- f\'(c) = 0 AND f\'\'(c) < 0: local MAX.
- f\'\'(c) = 0: inconclusive (use 1st derivative test).

**Example.** f(x) = x³ - 3x. f\'(x) = 3x² - 3. f\'\'(x) = 6x.
At x = -1: f\'\' = -6 < 0 → local max. ✓
At x = 1: f\'\' = 6 > 0 → local min. ✓
Inflection at x = 0 (f\'\' = 0; changes sign).`,
    },
    {
      code: '5.5',
      title: 'Optimization',
      content:
`Find max or min of a quantity subject to constraints.

**Steps:**
1. Define variables; draw if useful.
2. Write objective function (what you\'re maximizing/minimizing).
3. Use constraint to express in one variable.
4. Take derivative; find critical points.
5. Verify max or min (2nd derivative or check endpoints).

**Classic example. Rectangular pen with 100 m fence.** Maximize area.
- Let dimensions be x by y. Perimeter: 2x + 2y = 100, so y = 50 - x.
- Area A = xy = x(50 - x) = 50x - x².
- dA/dx = 50 - 2x = 0 → x = 25, y = 25.
- d²A/dx² = -2 < 0 → max.
- Max area = 25 × 25 = 625 m² (square is optimal).

**Other classic problems:**
- Open-top box from sheet (cut corners, fold).
- Minimum surface area for given volume (cylinder).
- Shortest path / least time.
- Maximum revenue from price/demand.`,
    },
    {
      code: '5.6',
      title: 'Implicit relations between f and f\'',
      content:
`Given properties of f\' (or graph of f\'), determine properties of f.

**Reading f\' graph:**
- Where f\' > 0: f increasing.
- Where f\' < 0: f decreasing.
- Where f\' = 0: f has critical point (max/min/horizontal inflection).
- Where f\' is increasing: f is concave up.
- Where f\' is decreasing: f is concave down.

**Reading f\'\' graph:**
- Where f\'\' > 0: f concave up.
- Where f\'\' = 0 changes sign: f has inflection point.

**Practice: AP questions** often give f\' graph and ask about f.`,
    },
  ],
  keyConcepts: [
    'MVT: average = instantaneous somewhere in (a,b).',
    'EVT: continuous on closed interval has max and min.',
    'Critical points: f\' = 0 or undefined.',
    'First Derivative Test: sign change of f\' identifies max/min.',
    'Second Derivative Test: f\'\' > 0 → min; f\'\' < 0 → max.',
    'Inflection points: where concavity changes.',
    'Optimization: express in one variable; find critical points; verify.',
  ],
  formulas: [
    {
      name: 'Mean Value Theorem',
      equation: 'f\'(c) = (f(b)-f(a))/(b-a)  for some c in (a,b)',
      meaning: 'If continuous + differentiable, some tangent parallel to secant.',
      example: 'f(x)=x² on [0,4]: f\'(c) = 4, so c = 2.',
    },
  ],
  practice: [
    {
      q: 'For f(x) = x³ - 12x + 1 on [-3, 3], find absolute extrema.',
      a: 'f\' = 3x² - 12 = 0 → x = ±2. Evaluate: f(-3) = 10, f(-2) = 17, f(2) = -15, f(3) = -8. Max = 17 at x = -2. Min = -15 at x = 2.',
    },
    {
      q: 'Rectangle inscribed in semicircle of radius 5. Maximize area.',
      a: 'Let half-width be x. Height: √(25 - x²). Area A = 2x√(25-x²). dA/dx = 2√(25-x²) + 2x·(-x/√(25-x²)) = ... critical at x = √(12.5). Max area = 25.',
    },
  ],
  pitfalls: [
    '"All critical points are extrema" — wrong. f\'(0) = 0 for x³ but not an extremum (inflection).',
    '"f\'\' = 0 means inflection point" — only if concavity actually changes.',
    '"Endpoints are critical points" — sometimes, but always check endpoints separately for absolute extrema.',
  ],
};
