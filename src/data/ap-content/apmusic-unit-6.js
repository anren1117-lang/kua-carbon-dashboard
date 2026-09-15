// AP Music Theory Unit 6 — Harmony and Voice Leading III: Embellishments, Modulations, Modes

export const APMUSIC_UNIT_6 = {
  number: 6,
  title: 'Embellishments, Modulations, and Modes',
  weight: '6-12%',
  subunits: [
    {
      code: '6.1',
      title: 'Modulation',
      content:
`**Modulation.** Change of key during a piece.

**Why?**
- Adds variety, contrast.
- Builds toward climax.
- Structurally important (different sections in different keys).

**Closely related keys.** Keys with key signatures differing by one accidental, or relative major/minor.
- C major: G (1#), F (1b), a (relative minor), d, e (relatives of close keys).

**Common modulations:**

**To dominant (V).** Most common in classical era. C → G.

**To relative minor.** C → a.

**To subdominant (IV).** C → F.

**To parallel major/minor.** C → c (less common, more dramatic).

**Distant modulations.** To keys far away in circle of fifths. More dramatic; common in Romantic era.

**Pivot chord modulation.** A chord functions in both old and new key. Smooth transition.

**Example: C → G.**
- C major chord = I in C and IV in G.
- Use it as pivot.
- C - F - C/IV in G - G - D - G.
- After pivot, analysis switches to new key.

**Chromatic modulation.** Through a chord with chromatic alteration.

**Common-tone modulation.** Pivot on single common pitch.

**Direct (phrase) modulation.** New key starts at new phrase without preparation.

**Sequential modulation.** Repeating pattern at new pitch level.

**Identifying modulations in score.**
- New accidentals appearing.
- New tonal center established.
- Cadence in new key.
- Often confirmed by V-I in new key.

**Returning to original key.** Most pieces return home for closure.

**For AP analysis.** Label Roman numerals in original key until modulation; then in new key; mark pivot chord.`,
    },
    {
      code: '6.2',
      title: 'Chromatic chords — Neapolitan, augmented sixth',
      content:
`Beyond diatonic, composers use chromatic chords for color and dramatic effect.

**Neapolitan sixth (N6 or bII6).**
- Major triad on flat 2 of scale.
- In C major: Db major (Db F Ab) — usually in first inversion (so F in bass).
- Function: predominant (like ii or IV).
- Leads to V.
- Common in minor keys especially.
- "Phrygian flavor."

**Voice leading.** N6 → V usually has bass moving up a 4th. Flat 2 in upper voice resolves down to leading tone (chromatic step).

**Augmented sixth chords.** Three types.

**Italian augmented sixth (It6 or +6).** Augmented 6th interval between bass (lowered 6) and an upper voice (raised 4).
- In C: Ab and F#. Plus C (tonic).
- Function: predominant. Strongly leads to V.
- 3 notes.

**French augmented sixth (Fr6 or +6/4/3).**
- Adds 2nd above bass.
- In C: Ab, C, D, F#. 4 notes.
- Distinctive whole-tone quality (Ab-C-D-F# all related by major thirds and tritones).

**German augmented sixth (Gr6 or +6/5).**
- Adds minor 7th from bass.
- In C: Ab, C, Eb, F#. 4 notes.
- Sounds like dominant 7th of Db (i.e., enharmonic to Ab7).

**Resolution.** All resolve outward to V (or sometimes I6/4).
- Augmented 6th expands outward by half-step to octave.
- Ab → G; F# → G.

**Common in.** Beethoven, Schubert, Schumann, Brahms.

**Borrowed chords (mode mixture / modal interchange).**
- Using chords from parallel minor in major key (or vice versa).
- In C major: use Ab, Bb, Eb, Fm, etc. from C minor.
- Common substitutions: iv (instead of IV), bVI, bVII.
- "Picardy third": ending minor piece on major tonic (raised third).

**Common-tone diminished 7th.**
- Decorative; doesn\'t change function.

**Why use chromatic chords?**
- Surprise.
- Color.
- Dramatic intensity.
- Transition.`,
    },
    {
      code: '6.3',
      title: 'Modal harmony and pop progressions',
      content:
`Outside classical functional harmony, other systems exist.

**Modal harmony.** Uses modes (Dorian, Mixolydian, etc.) as harmonic basis.

**Common in:**
- Folk music.
- Rock (Mixolydian common).
- Modal jazz (Miles Davis "Kind of Blue").
- Film music (modes feel "ancient" or "exotic").

**Examples:**

**Mixolydian.** Major scale with flat 7.
- Chords: I, bVII, IV common.
- "Sweet Home Alabama" (D Mixolydian).
- Many Led Zeppelin, Beatles songs.

**Dorian.** Minor with raised 6.
- Chords: i, IV (major IV — unusual for minor), bVII.
- "So What" (Miles Davis).
- "Mad World" (Tears for Fears).

**Phrygian.** Minor with flat 2. Spanish flavor.
- i, bII common.

**Pop / rock harmony.**

**12-bar blues.** Already mentioned.

**I-V-vi-IV.** Modern pop ubiquity.

**vi-IV-I-V.** Variation.

**Power chord.** Just root + 5th (no 3rd). Ambiguous between major and minor. Foundation of metal, much rock.

**Suspended chords.** sus2 (root + 2 + 5); sus4 (root + 4 + 5). 3rd replaced.

**Extended chords.** 9, 11, 13. Common in jazz and pop.

**Slash chords.** Chord with specific bass note. "C/G" = C chord with G in bass.

**Funk and groove harmony.** Often simpler harmony; rhythm and bass complexity drive interest.

**Hip-hop harmony.** Samples often define harmonic palette. Can be simple loops.

**Jazz harmony.** Highly complex; uses many extended chords, secondary dominants, modal sections, modulations.

**Beyond functional harmony.**
- Quartal (built on 4ths): common in modern jazz.
- Polychords: two chords sounding together.
- Atonality: no tonal center.

**12-tone serialism (Schoenberg).** All 12 notes treated equally; ordered into a "row" used as basis.`,
    },
    {
      code: '6.4',
      title: 'Modal in detail and analysis',
      content:
`Recognizing modes in music.

**Listen for:**
- Tonal center (where it "lands").
- Half-step positions relative to tonic.
- "Flavor" — bright, dark, exotic, ancient.

**Modes derived from C major:**

**C Ionian** = C D E F G A B C. Major scale.

**D Dorian** = D E F G A B C D. Minor with raised 6.

**E Phrygian** = E F G A B C D E. Minor with flat 2.

**F Lydian** = F G A B C D E F. Major with raised 4.

**G Mixolydian** = G A B C D E F G. Major with flat 7.

**A Aeolian** = A B C D E F G A. Natural minor.

**B Locrian** = B C D E F G A B. Diminished. Rare.

**Identifying mode of a piece:**
- What\'s tonal center?
- What\'s scale (key signature) used?
- Where are half-steps relative to tonic?

**Example.** Piece uses key signature of 1 sharp (F#); tonal center is D. → D Mixolydian (NOT G major).

**Or:** key signature 1 sharp, tonal center G. → G major (Ionian).

**Modal chord progressions.**

**Dorian.** i - bIII - IV - i. Or i - bVII - i.

**Mixolydian.** I - bVII - I.  I - bVII - IV - I.

**Many modern rock songs are modal.**

**Analyzing modal music.**
- Don\'t force functional analysis.
- Identify mode.
- Note characteristic chords (those with mode-defining notes).
- Recognize different cadence patterns (V-I doesn\'t function the same).

**Implications for composition and listening.** Modes expand expressive vocabulary beyond major-minor system.`,
    },
  ],
  keyConcepts: [
    'Modulation: closely related (one accidental away) or distant.',
    'Pivot chord, chromatic, common-tone, direct, sequential modulation methods.',
    'Neapolitan 6 (N6, bII6): major triad on flat 2; predominant; Phrygian flavor.',
    'Augmented 6 chords: Italian (3 notes), French (4 notes, whole-tone), German (4 notes, like dom7 enharmonic).',
    'All augmented 6ths resolve outward to V (octave by half-step).',
    'Borrowed chords (mode mixture): use chords from parallel minor in major.',
    'Picardy third: minor piece ends on major tonic.',
    'Modes: Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian.',
    'Modal music: tonal center + key signature + half-step positions.',
    'Pop progressions: I-V-vi-IV, blues, modal rock.',
  ],
  practice: [
    {
      q: 'In C major, name notes of Italian augmented 6th chord.',
      a: 'Ab, C, F#. Augmented 6th interval between Ab and F#. Resolves outward: Ab→G, F#→G, creating octave on G (V).',
    },
  ],
  pitfalls: [
    '"Modulation = adding accidentals" — must actually establish new tonal center.',
    '"Picardy third = minor chord" — no; it\'s ending minor piece on major tonic chord.',
  ],
};
