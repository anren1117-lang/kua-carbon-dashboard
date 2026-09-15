// AP Music Theory Unit 4 — Harmony and Voice Leading I

export const APMUSIC_UNIT_4 = {
  number: 4,
  title: 'Harmony and Voice Leading I',
  weight: '13-15%',
  subunits: [
    {
      code: '4.1',
      title: 'Four-part voice writing',
      content:
`**Four-part writing.** Conventional chorale style for harmony exercises.

**Four voices:**
- **Soprano** (S): highest, treble clef.
- **Alto** (A): treble clef, lower.
- **Tenor** (T): bass clef, upper. Often read down an octave with treble clef + 8.
- **Bass** (B): lowest, bass clef.

**Ranges (approximate):**
- Soprano: C4-G5.
- Alto: G3-D5.
- Tenor: C3-G4.
- Bass: E2-D4.

**Stem direction.** S, T: stems up. A, B: stems down.

**Spacing.**
- Between adjacent upper voices: max one octave.
- S-A and A-T should not exceed octave.
- T-B can be more than octave.

**Distributing chord notes.**
- Root in bass usually.
- Doubling: in major and minor triads, double the root usually. In V chord, double root; in IV chord, double root or 5th.
- Don\'t double the leading tone (raised 7) — tends to create parallels.

**Doubling guidelines:**
- Double tonic in root-position major and minor triads.
- Double bass note in 6/4 chords.
- 7th chords: don\'t double the 7th (which must resolve).

**Voice leading principles.**
- Keep common tones (notes shared between chords) in same voice.
- Move other voices by step.
- Avoid leaps if possible.
- Bass moves more freely.
- Each voice should make musical sense as a melody.`,
    },
    {
      code: '4.2',
      title: 'Voice leading rules',
      content:
`**Forbidden parallels:**

**Parallel fifths.** Two voices moving in same direction, both at interval of perfect 5th.
- E.g., voice 1: C → D; voice 2: G → A. Both up by step, both still a P5 apart.

**Parallel octaves.** Same idea but at perfect octave.

**Why forbidden?** In choral tradition, parallels make voices sound like they\'re doing the same thing — destroys independence.

**Allowed.** Parallel 3rds, 6ths.

**Hidden / direct fifths and octaves.** Both voices move same direction, arrive at P5 or P8 (without parallel). Allowed if upper voice moves by step.

**Voice crossing.** When one voice crosses above the voice that should be higher (e.g., tenor goes above alto). Avoid.

**Voice overlap.** When a voice moves to a pitch higher than the previous note of the voice above (or lower than voice below). Avoid.

**Leading tone resolution.** In V (or V7), the leading tone (7 of scale) should resolve up to tonic, especially in soprano.

**Chordal 7th resolution.** The 7th of any chord resolves down by step.

**Spacing rules.** Max octave between adjacent upper voices (S-A and A-T).

**Tritone (b5 to 5).** Augmented 4th or diminished 5th. In V7 → I, the 4 and 7 of scale form a tritone and resolve outward (or inward depending on inversion).

**Common voice leading examples:**

**V → I:**
- Leading tone resolves up to tonic.
- Chordal 7th (in V7) resolves down to mediant.
- Bass moves down 5th or up 4th.

**ii → V:**
- Bass moves down 5th or up 4th.

**vi → ii or vi → V:**
- Smooth root movement.

**Common errors:**
- Parallel fifths/octaves.
- Unresolved leading tone.
- Voice crossing.
- Wrong doubling.

**Practice voice leading** with simple progressions: I-IV-V-I; ii-V-I; etc.`,
    },
    {
      code: '4.3',
      title: 'Common harmonic progressions',
      content:
`**Diatonic progressions** use chords within key.

**Tonic group:** I, vi, iii. Functions as home.

**Subdominant group:** IV, ii. Functions as movement away from tonic.

**Dominant group:** V, vii°, V7. Functions as tension wanting to resolve.

**Typical progression direction.**

Tonic → Subdominant → Dominant → Tonic.

I → IV → V → I.

I → ii → V → I.

**Common progressions:**

**I-IV-V-I.** "Three-chord song." Many folk, rock, country songs.

**I-V-vi-IV.** Modern pop progression. Ubiquitous since 1990s ("Don\'t Stop Believin\'", many others).

**I-vi-IV-V.** "50s progression." Doo-wop. "Stand By Me."

**ii-V-I.** Jazz standard. Most common cadential progression in jazz.

**12-bar blues:**
- I-I-I-I-IV-IV-I-I-V-IV-I-V (or variations).
- Foundation of blues, much rock.

**Circle of fifths progressions.** Roots descending by 5th.
- I-IV-vii°-iii-vi-ii-V-I. All diatonic.
- Smooth, classic.

**Sequence.** Repeating pattern at different pitch levels.
- "Pachelbel\'s Canon": I-V-vi-iii-IV-I-IV-V.

**Tonic prolongation.** Staying in tonic area through various means.

**Modulation** to other keys (Unit 6).

**Why some progressions sound "right."**
- Bass moves by step or 5th (smooth).
- Voice leading clean.
- Functional logic (T → S → D → T).
- Cultural expectations from countless examples.`,
    },
    {
      code: '4.4',
      title: 'Reading harmonic analysis',
      content:
`Analyzing a piece for harmony involves identifying chords and labeling.

**Steps for harmonic analysis:**

**1. Identify key.** Look at key signature + final chord + opening.

**2. Identify the bass notes.** They define the chord roots (in root position) or inversions.

**3. Identify the chord above bass.**
- What pitches sound?
- What\'s the quality (major, minor, dim, aug)?

**4. Label with Roman numeral + inversion figure.**
- I, ii6, V7, etc.

**5. Identify cadences.**

**6. Look for non-chord tones** (notes that aren\'t part of harmony).

**Non-chord tones (NCTs):**

**Passing tone (PT).** Steps between two chord tones; on weak beat usually.

**Neighbor tone (NT).** Steps up (or down) from chord tone then returns. On weak beat usually.

**Suspension.** Note held over from previous chord, dissonant, resolves down step.

**Anticipation.** Chord tone of next chord, sounded early.

**Appoggiatura.** Leap to dissonant note, then steps to chord tone.

**Escape tone.** Steps then leaps.

**Pedal point.** Sustained bass note while harmonies change above.

**Identifying NCTs.**
- Look for notes not in chord.
- Determine type by approach and resolution.
- Doesn\'t affect chord label.

**Common modulation analysis.** When key changes, label new key + Roman numerals in new key.

**Pivot chord.** Chord that functions in both old and new key.

**Practice.** Take hymns, simple piano pieces. Analyze chord by chord. Builds ear and theory together.`,
    },
  ],
  keyConcepts: [
    'Four-part writing: S, A, T, B with specific ranges, stem directions, spacing.',
    'Double the root usually; don\'t double leading tone.',
    'Forbidden: parallel 5ths, parallel 8ves.',
    'Voice crossing and overlap avoided.',
    'Leading tone resolves up; chordal 7th resolves down.',
    'Functional groups: tonic (I, vi, iii), subdominant (IV, ii), dominant (V, vii°).',
    'Standard order: T → S → D → T.',
    'Progressions: I-IV-V-I, I-V-vi-IV, I-vi-IV-V, ii-V-I, 12-bar blues.',
    'Non-chord tones: passing, neighbor, suspension, anticipation, appoggiatura.',
  ],
  practice: [
    {
      q: 'Why are parallel 5ths forbidden in four-part writing?',
      a: 'They destroy voice independence; two voices sound like they\'re moving in lockstep. Convention from Renaissance/Baroque choral writing.',
    },
  ],
  pitfalls: [
    '"All chords work" — voice leading constrains chord choices.',
    '"Doubling = whatever" — specific guidelines based on chord type.',
  ],
};
