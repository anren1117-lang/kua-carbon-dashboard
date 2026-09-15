// AP Calc BC Unit 4 — Contextual Applications of Differentiation

export const APCALCBC_UNIT_4 = {
  number: 4,
  title: 'Contextual Applications of Differentiation',
  weight: '6-9%',
  subunits: [
    {
      code: '4.1',
      title: 'Motion',
      content:
`**Position s(t), velocity v(t) = s′(t), acceleration a(t) = v′(t) = s″(t).**

**Speed = |v(t)|.**

**Particle moving right when v > 0; left when v < 0; stopped when v = 0.**

**Speeding up when v and a have same sign; slowing down when opposite.**

**Total distance traveled** ≠ displacement. Total distance = ∫|v(t)|dt over interval.

**Displacement** = ∫v(t)dt = s(b) − s(a).`,
    },
    {
      code: '4.2',
      title: 'Related rates',
      content:
`Quantities related to each other; find rate of change of one given another.

**Procedure.**
1. Identify all quantities and their rates.
2. Write equation relating them.
3. Differentiate with respect to t.
4. Substitute known values.
5. Solve.

**Example.** Sphere\'s radius growing at 2 cm/s. How fast is volume growing when r = 5?
- V = (4/3)πr³.
- dV/dt = 4πr² · dr/dt.
- At r = 5: dV/dt = 4π(25)(2) = 200π cm³/s.

**Common setups.** Ladder sliding (Pythagorean), shadow lengths, water tank filling, distance between moving objects.

**Don\'t substitute values until AFTER differentiating.**`,
    },
    {
      code: '4.3',
      title: 'L\'Hôpital\'s rule',
      content:
`**For indeterminate forms 0/0 or ∞/∞:**

lim f(x)/g(x) = lim f′(x)/g′(x) (if right side exists).

**Examples:**
- lim(x→0) sin(x)/x = lim cos(x)/1 = 1.
- lim(x→0) (eˣ − 1)/x = lim eˣ/1 = 1.
- lim(x→∞) ln(x)/x = lim (1/x)/1 = 0.

**Repeat if necessary** (re-indeterminate).

**Other indeterminate forms** — rewrite to get 0/0 or ∞/∞:
- 0 · ∞ → rewrite as quotient.
- ∞ − ∞ → combine fractions.
- 0⁰, ∞⁰, 1^∞ → use logarithms.`,
    },
  ],
  keyConcepts: [
    'v = s′; a = v′ = s″.',
    'Speeding up when v and a same sign.',
    'Total distance = ∫|v|dt; displacement = ∫v dt.',
    'Related rates: differentiate THEN substitute.',
    'L\'Hôpital: lim f/g = lim f′/g′ for 0/0 or ∞/∞.',
  ],
  practice: [
    { q: 'lim(x→0) (1 − cos x)/x².', a: 'L\'Hôpital: sin x / 2x → again: cos x / 2 → 1/2.' },
  ],
  pitfalls: [
    '"Substitute first" in related rates — wrong; differentiate first.',
    'L\'Hôpital not for 0·∞ directly — must rewrite.',
  ],
};
