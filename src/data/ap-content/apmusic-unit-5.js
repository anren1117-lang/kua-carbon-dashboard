// AP Music Theory Unit 5 — Harmony and Voice Leading II

export const APMUSIC_UNIT_5 = {
  number: 5,
  title: 'Harmony and Voice Leading II',
  weight: '13-15%',
  subunits: [
    {
      code: '5.1',
      title: 'Predominant chords and second-inversion uses',
      content:
`**Predominant function.** Chords that lead naturally to dominant.

**ii** (or ii6): subdominant function.

**IV**: subdominant.

**ii7** (or ii6/5): adds 7th for richness.

**Common predominant progressions.**
- IV → V.
- ii → V.
- ii6 → V.
- IV → ii (rare, weakens).
- ii6/5 → V.

**Cadential 6/4.** Special voicing of I6/4 used at cadence before V.
- Bass on 5th degree.
- Upper notes are tonic and 3rd.
- Looks like I6/4 but functions as dominant prolongation.
- Notation: V6/4-5/3 sometimes, since it acts as part of V.
- Resolves: cadential 6/4 → V → I.

**Pedal 6/4.** Bass stays on one note; upper voices move I → IV → I.
- Or V → I6/4 → V (pedal on dominant).

**Passing 6/4.** Bass moves through stepwise.
- I → V6/4 → I6 (bass: 1 → 2 → 3, with 6/4 chord in middle).

**These three uses** of 6/4 chords are the only standard ones. Otherwise 6/4 chords are unstable and avoided.

**Voice leading with predominants:**
- ii → V: bass moves down 5th (or up 4th). Common tone is the 5th of ii = root of V if root motion is 4th up.
- IV → V: parallel motion danger. Need careful voice leading.`,
    },
    {
      code: '5.2',
      title: 'Embellishing tones in voice leading',
      content:
`Non-chord tones add melodic interest within harmonic framework.

**Re-cap categories.**

**Passing tone.** Step between two chord tones.
- "Unaccented PT" — on weak beat.
- "Accented PT" — on strong beat.

**Neighbor tone.** Step away from chord tone and back.
- Upper or lower.

**Suspension.** Three parts:
- **Preparation** (consonant, stable).
- **Suspension** (held into new chord, now dissonant).
- **Resolution** (resolves down by step).
- Common types: 4-3, 7-6, 9-8, 2-3 suspensions.

**Anticipation.** Note of next chord sounded early.

**Appoggiatura.** Leap to dissonance, then step to chord tone.

**Escape tone (échappée).** Step from chord tone, then leap.

**Pedal point.** Sustained tone (usually in bass) while harmonies above change.

**Practical use.**
- Suspensions create tension and release.
- Passing tones connect melodic line.
- Neighbor tones decorate.
- Make 4-part writing musical, not just chord-by-chord.

**Identifying NCTs in score:**
- Find chord tones first.
- Any notes outside chord = NCTs.
- Approach and resolution tell you type.

**Embellishing diminished 7th chord** (Unit 6 — chromatic).`,
    },
    {
      code: '5.3',
      title: 'Secondary dominants',
      content:
`**Secondary dominant.** V chord (or V7) of a non-tonic chord.

**Example: V/V (read "five of five").**
- In C major, V is G.
- V/V is D (V chord of G).
- D major: D F# A.
- F# is borrowed (not in C major key).
- Functions: D → G → C. Strong drive toward V.

**Other secondary dominants:**

- **V/ii.** Tonicizes ii. In C: A major chord (A C# E) → ii (Dm).
- **V/iii.** In C: B major (B D# F#) → iii (Em).
- **V/IV.** In C: C7 (C E G Bb) → IV (F).
- **V/V.** In C: D major (D F# A) → V (G).
- **V/vi.** In C: E major (E G# B) → vi (Am).

**vii°/V, etc.** Secondary leading-tone chords.
- vii°7/V in C: F# A C Eb (diminished 7th built on the leading tone of V).

**Tonicization.** Brief emphasis on non-tonic chord, treating it as temporary tonic — but you don\'t actually leave the original key.

**Modulation.** Stronger — you actually leave one key for another (Unit 6).

**Voice leading with secondary dominants:**
- Treat them like real dominants of the target chord.
- Leading tone (chromatic) → resolves up to root of target.
- 7th resolves down by step.

**Why use secondary dominants?**
- Adds variety, drives forward motion.
- Common in classical and jazz.
- Brief excursions away from home create harmonic interest.

**Sample progression.**
C - C/E - F - D/F# - G - C
I - I6 - IV - V/V - V - I

The D/F# (V/V) creates a strong push to V.

**In Beatles songs.** Many use secondary dominants. "Yesterday" has V/V.

**In jazz.** Common to chain secondary dominants for forward motion.`,
    },
    {
      code: '5.4',
      title: 'Phrase structure and harmonic rhythm',
      content:
`**Phrase.** Musical unit ending with cadence. Like sentence.

**Length.** Often 4 measures, but varies.

**Phrase types.**

**Antecedent.** Opening phrase, ends with weaker cadence (HC or IAC).

**Consequent.** Following phrase, ends with stronger cadence (usually PAC).

**Period.** Antecedent + consequent.

**Parallel period.** Both phrases start with similar music.
**Contrasting period.** Different opening material.

**Phrase group.** Multiple phrases that go together but don\'t form clear period.

**Sentence.** Different structure: 1+1+2 measures.
- "Basic idea" 1 measure.
- Repetition or variation 1 measure.
- Continuation 2 measures.

**Double period.** Four phrases. ABAB or similar.

**Phrase elision.** Phrases overlap; end of one phrase serves as start of next.

**Harmonic rhythm.** Rate at which chords change.
- Fast (every beat).
- Slow (each measure or longer).
- Mixed (faster at cadences).

**Common pattern.**
- Begin slow harmonic rhythm.
- Accelerate toward cadence.
- Final cadence chord on strong beat.

**Phrase length:**
- 4 measures most common.
- 8 measures full period.
- Asymmetric phrases (5, 7) common in folk and modern music.

**Phrase analysis.**
- Find cadences (where do phrases end?).
- Identify period / sentence / phrase group structures.
- Note how harmonic rhythm shapes them.

**Why analyze phrase structure?**
- Helps understand form (Unit 7).
- Reveals composer\'s craftsmanship.
- Aids performance (where to breathe, shape).
- Compositional model.`,
    },
  ],
  keyConcepts: [
    'Predominant: ii, IV, ii6/5 lead to V.',
    'Cadential 6/4: I6/4 → V → I; functions as dominant prolongation.',
    'Pedal 6/4 and passing 6/4 also valid; otherwise 6/4 avoided.',
    'NCTs: PT, NT, SUS, ANT, APP, escape, pedal.',
    'Suspension: preparation + suspension + resolution; 4-3, 7-6, 9-8, 2-3 types.',
    'Secondary dominants (V/X): tonicize non-tonic chord without changing key.',
    'V/V, V/IV, V/vi, V/ii, V/iii common.',
    'Phrase: musical unit ending with cadence.',
    'Period: antecedent (HC) + consequent (PAC).',
    'Sentence: 1+1+2.',
    'Harmonic rhythm: rate of chord change.',
  ],
  practice: [
    {
      q: 'In key of C, what notes form V/V?',
      a: 'D major triad (D-F#-A). It\'s the V of G (which is V of C). F# is a chromatic alteration.',
    },
  ],
  pitfalls: [
    '"6/4 always cadential" — also pedal and passing uses.',
    '"V/V = V" — different; V/V is the dominant OF the dominant.',
  ],
};
