// AP Music Theory Unit 3 — Harmony, Triads, Chord Inversions

export const APMUSIC_UNIT_3 = {
  number: 3,
  title: 'Triads and Seventh Chords',
  weight: '14-18%',
  subunits: [
    {
      code: '3.1',
      title: 'Triads',
      content:
`**Triad.** 3-note chord built in thirds.

**Root, third, fifth.**

**Four qualities of triads:**

**Major.** Major 3rd + minor 3rd from bottom.
- Root + M3 + P5.
- C major triad: C E G.

**Minor.** Minor 3rd + major 3rd.
- Root + m3 + P5.
- C minor: C Eb G.

**Diminished.** Minor 3rd + minor 3rd.
- Root + m3 + dim5.
- C diminished: C Eb Gb.

**Augmented.** Major 3rd + major 3rd.
- Root + M3 + aug5.
- C augmented: C E G#.

**Identifying.**
- Look at quality of bottom 3rd (M or m) and 5th (P, dim, or aug).

**Major scale triads.** Triad built on each scale degree.
- I (major), ii (minor), iii (minor), IV (major), V (major), vi (minor), vii° (diminished).
- Notation: uppercase = major; lowercase = minor; ° = diminished; + = augmented.

**C major triads:**
- I: C-E-G.
- ii: D-F-A.
- iii: E-G-B.
- IV: F-A-C.
- V: G-B-D.
- vi: A-C-E.
- vii°: B-D-F.

**Minor scale triads (using harmonic minor):**
- i (minor), ii° (dim), III+ (augmented), iv (minor), V (major), VI (major), vii° (dim).

**Common chord functions:**
- I: tonic, home.
- V: dominant, tension.
- IV: subdominant.
- vi: relative minor.
- ii: subdominant function.

**Chord progressions** use these functions.`,
    },
    {
      code: '3.2',
      title: 'Inversions and figured bass',
      content:
`**Inversion.** Rearrangement of chord notes so that root isn\'t on bottom.

**Root position.** Root is lowest note.

**1st inversion.** 3rd is lowest. Root moved up an octave.

**2nd inversion.** 5th is lowest.

**3rd inversion (for 7th chords).** 7th is lowest.

**Example C major:**
- Root position: C E G.
- 1st inversion: E G C.
- 2nd inversion: G C E.

**Figured bass.** Numbers below bass line indicating intervals above bass.

**For triads:**
- Root position: no figure, or 5/3.
- 1st inversion: 6 (or 6/3).
- 2nd inversion: 6/4.

**For 7th chords:**
- Root position: 7.
- 1st inversion: 6/5.
- 2nd inversion: 4/3.
- 3rd inversion: 4/2 (or 2).

**Roman numerals + inversion figures:**
- I = root position major tonic.
- I6 = first inversion (3rd in bass).
- I6/4 = second inversion (5th in bass).
- V7 = dominant 7 in root position.
- V6/5 = first inversion V7 (3rd in bass).
- V4/3 = second inversion V7.
- V4/2 = third inversion V7.

**Why use inversions?**
- Smoother voice leading (bass line).
- Different harmonic colors.
- Allow bass to descend through scale.

**Cadential 6/4.** Special use of I6/4 before V (resolves: I6/4 → V).
- Bass stays on 5; upper notes move (C6/4 → G).
- Functions as part of dominant prolongation.

**Passing 6/4.** Bass passing between two notes; chord in 6/4 above.

**Pedal 6/4.** Bass stays on one note; upper notes move.

**Reading figured bass.** Common in Baroque continuo — bass line + numbers; performer realizes (fills in) harmony.`,
    },
    {
      code: '3.3',
      title: 'Seventh chords',
      content:
`**Seventh chord.** Triad + 7th above root.

**Five qualities:**

**Major 7th (Δ7 or M7).** Major triad + major 7th.
- Cmaj7: C E G B.

**Dominant 7th (just 7).** Major triad + minor 7th.
- C7: C E G Bb.
- Built on V; tension wanting to resolve to I.

**Minor 7th (m7).** Minor triad + minor 7th.
- Cm7: C Eb G Bb.

**Half-diminished 7th (ø7).** Diminished triad + minor 7th.
- Cø7: C Eb Gb Bb.
- Also called "minor 7 flat 5."

**Fully diminished 7th (°7).** Diminished triad + diminished 7th.
- C°7: C Eb Gb Bbb (or A).
- Stacked minor 3rds.

**In major key 7th chords on each scale degree:**
- I: Imaj7.
- ii: ii7 (minor 7).
- iii: iii7.
- IV: IVmaj7.
- V: V7 (dominant — major-minor 7th).
- vi: vi7.
- vii: viiø7 (half-diminished).

**Functions.**

**V7 is most important.** Dominant 7th. Creates strong pull to tonic.
- V7 → I is the strongest harmonic motion in tonal music.

**ii7 → V7 → I.** Common progression.

**viiø7 → I.** Also leads to tonic; substitute for V7.

**Notation example:**
- "Cmaj7" or "CΔ7" = C E G B.
- "C7" = C E G Bb (dominant 7).
- "Cm7" = C Eb G Bb (minor 7).
- "Cø7" = C Eb Gb Bb (half-dim).
- "C°7" = C Eb Gb A (fully dim).

**Inversions of 7th chords.** See 3.2 figured bass.

**Resolving 7ths.** The 7th of a chord typically resolves down by step.
- In V7-I: the chord 7th (which is the scale\'s 4th degree) resolves down to the 3rd of I.

**Extended chords (9, 11, 13).** Beyond AP basics but common in jazz.`,
    },
    {
      code: '3.4',
      title: 'Cadences',
      content:
`**Cadence.** Harmonic close at end of phrase. Like punctuation.

**Authentic cadence (V → I).** Strongest. "Period."

**Perfect Authentic Cadence (PAC).** V → I, both in root position, soprano ends on tonic. Final.

**Imperfect Authentic Cadence (IAC).** V → I but lacking PAC conditions. Less final.

**Plagal cadence (IV → I).** "Amen cadence." Gentle close.

**Half cadence (... → V).** Ends on V; not closed. "Comma." Leaves you wanting more.

**Deceptive cadence (V → vi).** V seems to lead to I but goes to vi instead. Surprise; doesn\'t close.

**Phrygian half cadence.** In minor; iv6 → V. Bass moves down a half-step.

**Cadences mark phrases.** Like sentences ending with period or comma or question mark.

**Period structure.**
- Two phrases.
- First (antecedent) ends with HC (or IAC).
- Second (consequent) ends with PAC (more conclusive).

**Sentence structure.** Different phrase construction; statement-repetition-development.

**Voice leading at cadences.**
- Leading tone (7) → tonic (1).
- Chordal 7th → resolves down step.
- Smooth motion (steps and small leaps).

**Examples:**
- "Twinkle Twinkle Little Star": classic V-I cadence structure.
- Many Beatles songs: deceptive cadences.

**Why cadences matter.**
- Define phrase structure.
- Provide rest/closure.
- Shape larger form.
- Allow expectation and surprise.`,
    },
  ],
  keyConcepts: [
    'Triad qualities: major, minor, diminished, augmented.',
    'Roman numerals: I, ii, iii, IV, V, vi, vii° (uppercase major; lowercase minor; ° diminished; + augmented).',
    'Inversions: root position, 1st (3rd in bass), 2nd (5th in bass), 3rd (7th in bass for 7th chords).',
    'Figured bass: 5/3, 6/3 (or 6), 6/4, 7, 6/5, 4/3, 4/2.',
    'Seventh chords: maj7, dom7 (just "7"), m7, ø7, °7.',
    'V7 → I: strongest cadence in tonal music.',
    'Cadences: PAC, IAC, HC, plagal, deceptive, Phrygian.',
    'Period: antecedent (HC) + consequent (PAC).',
  ],
  practice: [
    {
      q: 'In key of C, what\'s the V7 chord?',
      a: 'G7: G B D F. G is 5th degree; major triad with minor 7th (F is a minor 7th above G). Resolves to C major (I).',
    },
  ],
  pitfalls: [
    '"V → vi = plagal" — no; deceptive cadence. Plagal is IV → I.',
    '"PAC requires both chords root position" — yes; plus soprano on tonic.',
  ],
};
