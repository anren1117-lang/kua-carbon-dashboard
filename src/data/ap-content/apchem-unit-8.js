// AP Chemistry Unit 8 — Acids and Bases (11-15%)

export const APCHEM_UNIT_8 = {
  number: 8,
  title: 'Acids and Bases',
  weight: '11-15%',
  subunits: [
    {
      code: '8.1',
      title: 'Introduction to acids and bases',
      content:
`Three definitions in increasing generality:

**Arrhenius.** Acid releases H⁺ in water; base releases OH⁻.

**Brønsted-Lowry.** Acid donates H⁺ (proton); base accepts H⁺. Most useful for AP.

**Lewis.** Acid accepts electron pair; base donates electron pair. Most general; covers BF₃ + NH₃.

**Conjugate acid-base pairs.** Differ by one H⁺.
HCl + H₂O → H₃O⁺ + Cl⁻
- HCl is acid; Cl⁻ is conjugate base.
- H₂O is base; H₃O⁺ is conjugate acid.

**Strong vs weak.**

**Strong acids** (fully ionize in water; memorize):
HCl, HBr, HI, HNO₃, H₂SO₄ (first H), HClO₄, HClO₃.

**Strong bases** (fully ionize):
Group 1 hydroxides (LiOH, NaOH, KOH, RbOH, CsOH); Group 2 (Ca(OH)₂, Sr(OH)₂, Ba(OH)₂).

**Weak acids:**
HF, CH₃COOH (acetic), HCN, H₂CO₃, H₂PO₄⁻, NH₄⁺, H₂S.

**Weak bases:**
NH₃, amines (RNH₂), F⁻, CN⁻, conjugate bases of weak acids.

**Strength and conjugate strength.** Strong acid → weak conjugate base; weak acid → relatively stronger conjugate base.

**Polyprotic acids** can donate multiple H⁺ sequentially. H₂SO₄, H₃PO₄, H₂CO₃. Each ionization has its own Ka (Ka1 > Ka2 > Ka3).`,
    },
    {
      code: '8.2',
      title: 'pH and pOH of strong acids and bases',
      content:
`**pH = -log[H⁺]**, where [H⁺] is in M.
**pOH = -log[OH⁻]**.

**Water self-ionization:** H₂O ⇌ H⁺ + OH⁻. Kw = [H⁺][OH⁻] = 10⁻¹⁴ at 25°C.

So **pH + pOH = 14** at 25°C.

In pure water: [H⁺] = [OH⁻] = 10⁻⁷ M; pH = pOH = 7.

**Scale.**
- pH < 7: acidic.
- pH = 7: neutral.
- pH > 7: basic.

Each unit = 10× change in [H⁺].

**Examples:**
- Battery acid: pH 0 (very acidic).
- Stomach acid: pH 1-2.
- Lemon juice: pH 2-3.
- Black coffee: pH 5.
- Pure water: 7.
- Blood: 7.4 (tightly regulated).
- Baking soda: 9.
- Ammonia: 11.
- Drain cleaner: 14.

**Strong acid pH.** Concentration of H⁺ = concentration of acid (fully ionized).

Example: 0.1 M HCl. [H⁺] = 0.1; pH = 1.

**Strong base pH.** [OH⁻] = concentration × OH⁻ per formula unit.

Example: 0.1 M Ca(OH)₂. [OH⁻] = 0.2 (2 OH⁻ per formula); pOH = -log(0.2) = 0.70; pH = 13.30.

**Very dilute strong acid/base.** Below ~10⁻⁶ M, water\'s own ionization matters. pH approaches 7, never crosses.

**Worked examples.**
- 0.01 M HNO₃: pH = 2.
- 5 × 10⁻⁴ M NaOH: pOH = 3.3; pH = 10.7.`,
    },
    {
      code: '8.3',
      title: 'pH and pOH of weak acids and bases',
      content:
`Weak acids/bases only partially ionize. Use **Ka** or **Kb**.

**Weak acid ionization:** HA ⇌ H⁺ + A⁻.
Ka = [H⁺][A⁻] / [HA].

**Weak base ionization:** B + H₂O ⇌ HB⁺ + OH⁻.
Kb = [HB⁺][OH⁻] / [B].

**Ka × Kb = Kw = 10⁻¹⁴** for conjugate pair.

**Calculating pH of weak acid.** For acetic acid (CH₃COOH, Ka = 1.8 × 10⁻⁵), 0.1 M:

| | HA | H⁺ | A⁻ |
|---|---|---|---|
| I | 0.1 | 0 | 0 |
| C | -x | +x | +x |
| E | 0.1-x | x | x |

Ka = x²/(0.1-x) = 1.8 × 10⁻⁵.

Assume x << 0.1: x²/0.1 ≈ 1.8 × 10⁻⁵; x² = 1.8 × 10⁻⁶; x = 1.34 × 10⁻³ M.

Check: x/0.1 = 1.3% — small, assumption OK.

[H⁺] = 1.34 × 10⁻³; pH = 2.87.

Compare to 0.1 M HCl (strong, pH = 1.0). Weak acid is much less acidic.

**Percent ionization** = (x / [HA]₀) × 100% = 1.3%.

**Weaker acid → higher pKa.** pKa = -log Ka. pKa of acetic acid = 4.74.

**Strength order (acids).** Strong > acetic > carbonic > NH₄⁺ > ... > water.`,
    },
    {
      code: '8.4',
      title: 'Acid-base reactions and buffers',
      content:
`**Buffers** resist pH change when small amounts of acid/base added. Made of a weak acid + its conjugate base (or weak base + its conjugate acid).

**How buffers work.** Both forms present. Added acid consumed by conjugate base; added base consumed by weak acid.
HA + OH⁻ → A⁻ + H₂O (added base removed)
A⁻ + H⁺ → HA (added acid removed)

**Henderson-Hasselbalch equation.**
pH = pKa + log([A⁻]/[HA])

When [A⁻] = [HA], pH = pKa.
Buffer effective in range pH = pKa ± 1.

**Worked example.** Buffer made of 0.10 M acetic acid + 0.10 M sodium acetate. pKa = 4.74.
pH = 4.74 + log(1) = 4.74.

**Add 0.01 mol HCl to 1 L of this buffer.**
H⁺ consumed by acetate: [acetate] decreases by 0.01 → 0.09. [acetic acid] increases by 0.01 → 0.11.
pH = 4.74 + log(0.09/0.11) = 4.74 + log(0.818) = 4.74 - 0.087 = 4.65.

Without buffer (pure water + 0.01 mol HCl): pH = 2. Buffer changed by 0.09 vs ~5 units — huge difference.

**Buffer capacity.** Higher [HA] and [A⁻] → more capacity. Equal amounts → maximum capacity (where [A⁻]/[HA] = 1, log = 0).

**Choosing a buffer.** Pick weak acid with pKa near target pH.
- Blood (pH 7.4): bicarbonate buffer (H₂CO₃/HCO₃⁻, pKa1 = 6.35; close).
- Lab buffers: Tris (pKa 8.1), HEPES (7.5), phosphate (7.2).`,
    },
    {
      code: '8.5',
      title: 'Acid-base titration',
      content:
`Titration: gradually add titrant of known concentration to analyte until reaction complete.

**Strong acid + strong base.** Titration curve has:
- Initial pH determined by acid concentration.
- Gradual rise.
- Steep jump near equivalence point.
- pH at equivalence = 7 (salt is neutral).
- Plateau at high pH (excess base).

**Strong + strong example.** Titrate 25 mL of 0.1 M HCl with 0.1 M NaOH.
- Initial: pH = 1.
- 12.5 mL added: half-neutralized; pH depends only on remaining HCl. [HCl] = (0.1 × 25 - 0.1 × 12.5)/(37.5) = 0.033 M. pH ≈ 1.5.
- 25 mL added: equivalence. All HCl + NaOH consumed. pH = 7.
- 35 mL: excess base. [OH⁻] = (0.1 × 10)/60 = 0.0167; pOH = 1.78; pH = 12.2.

**Weak acid + strong base.** Different:
- pH at equivalence > 7 (conjugate base is weakly basic).
- Half-equivalence point: pH = pKa (Henderson-Hasselbalch with [HA] = [A⁻]).
- Useful method to determine pKa.

**Polyprotic acid titrations** show multiple equivalence points (one per H⁺ donated).

**Indicators.** Choose one whose color change spans the equivalence point pH.
- Strong/strong (pH 7): phenolphthalein (8.3-10) works because curve is so steep around 7 it sweeps through 8-10 with one drop.
- Weak/strong (pH ~8-9): phenolphthalein.
- Strong acid + weak base (pH ~5): methyl red (4.4-6.2).

**Titration calculations.**
- Before equivalence: subtract added moles base from initial moles acid; use leftover.
- At equivalence: use Kb (or Ka) of conjugate.
- After: use excess base (or acid).`,
    },
    {
      code: '8.6',
      title: 'Molecular structure of acids and bases',
      content:
`Acid strength varies with molecular structure.

**Binary acids (HX).** Two factors:
- **Bond strength** (H-X). Weaker H-X bond → more easily ionized.
- **Electronegativity of X** (less important for binary acids).

Order: HF < HCl < HBr < HI. Why? Bond gets weaker down group. Easier to ionize.

**Oxyacids (H-O-X-O_n).** Acid strength increases with:
- More O atoms attached to central atom (more electronegative withdrawal).
- More electronegative central atom.

Examples: HClO < HClO₂ < HClO₃ < HClO₄ (each added O makes stronger acid).
HClO < HBrO < HIO? Wrong — more electronegative central atom (Cl) makes stronger oxyacid.
HClO > HBrO > HIO. Same number of O.

**Why more O makes acid stronger.** O is very electronegative. More O atoms pull electron density away from O-H bond. H is more easily released as H⁺.

**Carboxylic acids** (R-COOH). Weak acids. Strength influenced by electron-withdrawing or donating R groups.
- Acetic acid (CH₃COOH): pKa 4.76.
- Chloroacetic (ClCH₂COOH): pKa 2.87 (Cl pulls electrons → easier H release).
- Trichloroacetic (Cl₃CCOOH): pKa 0.66 (very strong).

**Conjugate base stability.** Strong acids have stable conjugate bases (delocalized charge, less basic).

**Amines as bases.** R-NH₂ (or R₂NH, R₃N). Lone pair on N accepts H⁺.
- More alkyl groups → more electron-donating → stronger base.
- But aromatic amines (aniline, C₆H₅NH₂) are weaker because lone pair conjugates with ring.`,
    },
    {
      code: '8.7',
      title: 'pH and pKa',
      content:
`Putting it all together.

**pKa = -log(Ka).** Smaller pKa = stronger acid.
- HCl pKa ≈ -7 (very strong).
- HF pKa = 3.17.
- Acetic acid pKa = 4.76.
- NH₄⁺ pKa = 9.25.
- H₂O pKa = 15.7.

**Two key facts:**

1. **For a weak acid solution at half-equivalence point in titration: pH = pKa.**

2. **For a buffer with equal acid and conjugate base: pH = pKa.**

Both: when [HA] = [A⁻], Henderson-Hasselbalch gives pH = pKa.

**Predicting pH:**
- Weak acid alone: pH < 7, calculate via Ka and ICE.
- Weak base alone: pH > 7, calculate via Kb.
- Salt of strong acid + strong base (NaCl): pH = 7.
- Salt of strong acid + weak base (NH₄Cl): pH < 7 (cation is conjugate acid of weak base).
- Salt of weak acid + strong base (NaCH₃COO): pH > 7 (anion is conjugate base of weak acid).
- Salt of weak acid + weak base (NH₄CH₃COO): pH depends on Ka vs Kb.

**Worked example.** 0.1 M NH₄Cl. Find pH.
NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺. Ka = Kw/Kb = 10⁻¹⁴/(1.8 × 10⁻⁵) = 5.6 × 10⁻¹⁰.
x²/0.1 = 5.6 × 10⁻¹⁰. x² = 5.6 × 10⁻¹¹. x = 7.5 × 10⁻⁶.
pH = -log(7.5 × 10⁻⁶) = 5.13.

Slightly acidic, as expected for salt of strong acid + weak base.`,
    },
  ],
  keyConcepts: [
    'Brønsted: acid donates H⁺; base accepts. Lewis: acid accepts e⁻ pair; base donates.',
    'Strong acids: HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄, HClO₃ (memorize). Fully ionize.',
    'Strong bases: Group 1 hydroxides + heavy Group 2 hydroxides.',
    'pH = -log[H⁺]. pH + pOH = 14.',
    'Ka × Kb = Kw = 10⁻¹⁴ for conjugate pair.',
    'Buffer: weak acid + conjugate base. Resists pH change.',
    'Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]).',
    'When [HA] = [A⁻], pH = pKa.',
    'Oxyacid strength increases with more O atoms.',
    'Salts can be acidic, basic, or neutral depending on parent acid/base strengths.',
  ],
  formulas: [
    {
      name: 'pH and Kw',
      equation: 'pH = -log[H⁺] ;  pH + pOH = 14 ;  Kw = [H⁺][OH⁻] = 10⁻¹⁴',
      meaning: 'Three connected equations describing aqueous H⁺ concentration.',
      example: '[H⁺] = 10⁻⁴ M → pH = 4; [OH⁻] = 10⁻¹⁰ M; pOH = 10.',
    },
    {
      name: 'Henderson-Hasselbalch',
      equation: 'pH = pKa + log([A⁻]/[HA])',
      meaning: 'Calculates pH of a buffer or weak acid system.',
      example: 'Buffer of 0.1 M acetic + 0.1 M acetate: pH = pKa = 4.74.',
    },
  ],
  practice: [
    {
      q: 'Find pH of 0.05 M Ca(OH)₂.',
      a: 'Ca(OH)₂ → Ca²⁺ + 2 OH⁻ (strong). [OH⁻] = 0.10 M. pOH = -log(0.1) = 1. pH = 13.',
    },
    {
      q: 'A 0.20 M solution of formic acid HCOOH has pH = 2.24. Find Ka.',
      a: '[H⁺] = 10⁻²·²⁴ = 5.75 × 10⁻³ M. Ka = (5.75 × 10⁻³)² / (0.20 - 5.75 × 10⁻³) ≈ 3.3 × 10⁻⁵ / 0.194 = 1.7 × 10⁻⁴.',
    },
    {
      q: 'You need a buffer at pH 7.4 (blood pH). Which is best: acetic (pKa 4.74), HCO₃⁻/CO₃²⁻ (pKa 10.3), H₂PO₄⁻/HPO₄²⁻ (pKa 7.21)?',
      a: 'H₂PO₄⁻/HPO₄²⁻ (pKa 7.21 closest to 7.4). Buffers work best within pKa ± 1.',
    },
  ],
  pitfalls: [
    '"Stronger acid means lower pH at same concentration" — yes, but the comparison must be at same concentration.',
    '"pH 0 is impossible" — wrong. Concentrated strong acids can have negative pH.',
    '"NaCl solution is basic because Na+" — wrong. Salt of strong acid + strong base → neutral pH = 7.',
    '"Henderson-Hasselbalch works for strong acid/base" — wrong. Only for buffers (weak acid + conjugate base).',
    '"Bigger Ka means weaker acid" — opposite. Bigger Ka = stronger.',
  ],
};
