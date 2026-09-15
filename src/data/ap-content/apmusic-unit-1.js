// AP Music Theory Unit 1 — Pitch and Notation

export const APMUSIC_UNIT_1 = {
  number: 1,
  title: 'Music Fundamentals — Pitch and Notation',
  weight: '18-22%',
  subunits: [
    {
      code: '1.1',
      title: 'Pitch and the staff',
      content:
`**Pitch.** How high or low a sound is. Determined by frequency.

**Higher frequency = higher pitch.** A note vibrating 440 Hz (A4) is higher than one vibrating 220 Hz (A3).

**Notes named A through G**, repeating in octaves. A, B, C, D, E, F, G, then A again one octave higher.

**Octave.** Doubling of frequency. Same letter name; different position.

**Staff.** 5 horizontal lines + 4 spaces where notes are placed.

**Clefs.** Symbol at start of staff indicating which lines/spaces correspond to which pitches.

**Treble clef (G clef).** Curls around G4 line.
- Lines: E G B D F (Every Good Boy Does Fine).
- Spaces: F A C E.

**Bass clef (F clef).** Dots straddle F3 line.
- Lines: G B D F A (Good Boys Do Fine Always).
- Spaces: A C E G.

**Middle C (C4).** Middle of the piano. One ledger line below treble staff, one above bass staff.

**Grand staff.** Treble + bass clefs joined. Standard for piano.

**Ledger lines.** Short lines added above/below staff to extend its range.

**Alto clef (C clef on middle line).** Reads middle line as C4. Used by violas.

**Tenor clef (C clef on second-highest line).** Used by upper-register cello, trombone.

**Octave designations.**
- C4 = middle C.
- C5 = octave above middle C.
- C3 = octave below middle C.
- A4 = 440 Hz, standard tuning reference.

**Why this matters.** Reading and writing music requires knowing where notes sit.`,
    },
    {
      code: '1.2',
      title: 'Accidentals and key signatures',
      content:
`**Sharps and flats (accidentals).**

**Sharp (#).** Raises pitch by half-step (semitone).

**Flat (b).** Lowers pitch by half-step.

**Natural (♮).** Cancels prior sharp/flat.

**Double sharp (𝄪).** Raises by whole step.

**Double flat (𝄫).** Lowers by whole step.

**Half-step (semitone).** Smallest interval in Western music. Adjacent piano keys.

**Whole step (tone).** Two half-steps.

**Piano keyboard.**
- White keys: C D E F G A B (then repeat).
- Black keys: between most white keys.
- BUT no black key between E-F and B-C — these are half-steps already.
- Black keys named by sharps or flats: C# = Db; D# = Eb; etc.

**Enharmonic spelling.** Same pitch, different name. C# = Db. F = E#.

**Key signature.** Sharps or flats placed at start of staff, applying throughout.
- Avoids writing accidentals on every note.
- Indicates the key (tonality).

**Order of sharps:** F C G D A E B.
- Mnemonic: Father Charles Goes Down And Ends Battle.

**Order of flats:** B E A D G C F.
- Reverse: Battle Ends And Down Goes Charles\' Father.

**Circle of fifths.** Arrangement of keys related by perfect fifth.
- Clockwise: each key adds one sharp.
- Counterclockwise: each key adds one flat.

**Major keys and their key signatures:**
- C major: 0.
- G major: 1#.
- D major: 2#.
- A major: 3#.
- E major: 4#.
- B major: 5#.
- F# major: 6#.
- C# major: 7#.

- F major: 1b.
- Bb major: 2b.
- Eb major: 3b.
- Ab major: 4b.
- Db major: 5b.
- Gb major: 6b.
- Cb major: 7b.

**Each major key has a relative minor** with same key signature, starting on the 6th scale degree.
- C major ↔ A minor.
- G major ↔ E minor.
- F major ↔ D minor.
- etc.`,
    },
    {
      code: '1.3',
      title: 'Scales and intervals',
      content:
`**Scale.** Ordered set of pitches.

**Major scale pattern.** W W H W W W H (W = whole step, H = half step).
- C major: C D E F G A B C (all white keys).
- D major: D E F# G A B C# D.

**Minor scales (three forms).**

**Natural minor.** W H W W H W W.
- A minor: A B C D E F G A.

**Harmonic minor.** Natural minor but raised 7th.
- A harmonic minor: A B C D E F G# A.

**Melodic minor.** Raised 6th and 7th ascending; natural minor descending.
- A melodic minor up: A B C D E F# G# A.
- Down: A G F E D C B A.

**Why minor scales differ.**
- Natural minor lacks leading tone (half-step below tonic).
- Harmonic minor restores it for harmonic purposes.
- Melodic minor smooths the augmented 2nd between b6 and #7.

**Solfège.** Do Re Mi Fa Sol La Ti Do.

**Movable do.** "Do" is tonic in whatever key.
**Fixed do.** "Do" always = C.

**Intervals.** Distance between two pitches.

**Quality + number.**
- **Number**: count letter names (including both endpoints). C to E = 3 (C-D-E).
- **Quality**: perfect, major, minor, augmented, diminished.

**Perfect intervals.** 1, 4, 5, 8 (unison, fourth, fifth, octave). Either perfect or augmented/diminished.

**Major/minor intervals.** 2, 3, 6, 7 (second, third, sixth, seventh).

**Examples:**
- C-D: major 2nd.
- C-Eb: minor 3rd.
- C-E: major 3rd.
- C-F: perfect 4th.
- C-G: perfect 5th.
- C-A: major 6th.
- C-B: major 7th.
- C-C: perfect octave.

**Inversion of interval.** Lower note above upper.
- Major 3rd inverts to minor 6th.
- Perfect 5th inverts to perfect 4th.
- Number adds to 9.

**Consonance vs dissonance.**
- Consonant (stable): unison, octave, perfect 5th, major/minor 3rd, major/minor 6th.
- Dissonant (unstable): 2nds, 7ths, tritone (augmented 4th / diminished 5th).
- Dissonance creates tension; resolves to consonance.`,
    },
    {
      code: '1.4',
      title: 'Pentatonic and other scales',
      content:
`**Pentatonic scale.** 5 pitches per octave.

**Major pentatonic.** Scale degrees 1, 2, 3, 5, 6.
- C major pentatonic: C D E G A.

**Minor pentatonic.** Scale degrees 1, b3, 4, 5, b7.
- A minor pentatonic: A C D E G.

**Common in:**
- Folk music globally.
- Blues, jazz.
- Chinese, Japanese, Indonesian, African traditional music.

**Blues scale.** Minor pentatonic + b5 (blue note).
- A blues: A C D D# E G.

**Whole tone scale.** All whole steps. Two possible: starting on C or C#.
- C whole tone: C D E F# G# A# C.
- Symmetric, ambiguous, dreamy.
- Used by Debussy.

**Chromatic scale.** All 12 pitches, half-step each.

**Modes.** Scales derived from major scale starting on different degrees.

| Mode | Starting on | Pattern | Character |
|---|---|---|---|
| Ionian | 1 | WWHWWWH | Major scale |
| Dorian | 2 | WHWWWHW | Minor, raised 6th |
| Phrygian | 3 | HWWWHWW | Minor, flat 2nd; Spanish flavor |
| Lydian | 4 | WWWHWWH | Major, raised 4th; bright |
| Mixolydian | 5 | WWHWWHW | Major, flat 7th; rock |
| Aeolian | 6 | WHWWHWW | Natural minor |
| Locrian | 7 | HWWHWWW | Diminished; rarely used |

**Modes feel different** because half-step locations differ relative to tonic.

**Used in:**
- Folk music.
- Modal jazz (Miles Davis).
- Rock and pop.
- Film music.`,
    },
  ],
  keyConcepts: [
    'Pitch = frequency. Notes A-G repeat in octaves.',
    'Staff + clef (treble, bass, etc.).',
    'Middle C = C4 = 261.6 Hz; A4 = 440 Hz.',
    'Sharps raise; flats lower; naturals cancel.',
    'Order of sharps: F C G D A E B; flats reverse.',
    'Circle of fifths organizes keys.',
    'Major scale: W W H W W W H.',
    'Three minor scales: natural, harmonic (raised 7), melodic (raised 6 and 7 up).',
    'Intervals: quality + number; perfect for 1,4,5,8; major/minor for others.',
    'Pentatonic, blues, whole tone, modes (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian).',
  ],
  practice: [
    {
      q: 'What\'s the key signature of D major?',
      a: '2 sharps (F# and C#). D major scale: D E F# G A B C# D.',
    },
  ],
  pitfalls: [
    '"Minor = sad" — partially; minor has different character but composers use varied ways.',
    '"All scales are major or minor" — pentatonic, modal, whole tone, chromatic also exist.',
  ],
};
