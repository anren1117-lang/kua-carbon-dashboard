// AP CS Principles Big Idea 2 — Data (17-22%)

export const APCSP_UNIT_2 = {
  number: 2,
  title: 'Data',
  weight: '17-22%',
  subunits: [
    {
      code: '2.1',
      title: 'Binary numbers',
      content:
`**Computers store everything as bits**: 0 or 1. Two states (on/off, high/low voltage).

**Binary place values:** powers of 2.
- 1 (2⁰), 2 (2¹), 4 (2²), 8 (2³), 16, 32, 64, 128, ...

**Converting decimal to binary.**
- 13 = 8 + 4 + 1 = 1101.
- 25 = 16 + 8 + 1 = 11001.

**Binary to decimal.** Add the place values where 1s appear.
- 1010 = 8 + 2 = 10.

**Storage units:**
- **Bit (b)**: single 0 or 1.
- **Byte (B)**: 8 bits. Holds one ASCII character.
- **KB**: ~1000 bytes (technically 1024 binary).
- **MB, GB, TB**: kilo, mega, giga, tera.

**With n bits, can represent 2ⁿ values.**
- 8 bits → 256 values.
- 16 bits → 65,536.
- 32 bits → ~4.3 billion.

**Why binary?** Easy to build (two states robust to noise). All computing built on this.

**Hexadecimal (base 16).** Compact representation.
- Digits: 0-9, A-F.
- A = 10, B = 11, ..., F = 15.
- 1 hex digit = 4 bits.
- Color codes: #FF0000 = red.`,
    },
    {
      code: '2.2',
      title: 'Representing data',
      content:
`Different types of data, all stored as binary.

**Numbers.**
- **Integers**: direct binary.
- **Floating point**: IEEE 754 standard. Sign + exponent + mantissa.
- Some decimal numbers can\'t be exactly represented (0.1 in binary is repeating).

**Text.**
- **ASCII** (7 bits): 128 characters; English letters, digits, symbols.
- **Unicode** (variable): supports all scripts. UTF-8 most common encoding.
- Each character has a code point (e.g., \'A\' = 65 = 01000001).

**Images.**
- **Pixels**: each has color value.
- **RGB**: red, green, blue (8 bits each = 24 bits per pixel; 16.7M colors).
- **Resolution**: width × height in pixels.
- File formats:
  - **Bitmap** (BMP, raw): uncompressed.
  - **JPEG**: lossy compression (good for photos; loses some quality).
  - **PNG**: lossless (good for graphics, transparency).
  - **GIF**: 256 colors, animation.
  - **SVG**: vector (resolution-independent).

**Audio.**
- Sound waves → digital samples.
- **Sample rate** (kHz): how often. CD = 44.1 kHz.
- **Bit depth**: resolution per sample. CD = 16-bit.
- **MP3, AAC**: compressed.
- **WAV, FLAC**: uncompressed/lossless.

**Video.**
- Sequence of images + audio.
- High data rate (e.g., 4K video ~25 GB/hour uncompressed).
- Heavy compression (H.264, H.265, AV1).`,
    },
    {
      code: '2.3',
      title: 'Data compression',
      content:
`**Compression** reduces file size.

**Lossless.** No information lost; original perfectly recoverable.
- **ZIP, gzip**: general purpose.
- **PNG**: images (no quality loss).
- **FLAC**: audio.
- Compression ratio varies (text compresses well; random data doesn\'t).

**Lossy.** Some information discarded; can\'t perfectly recover.
- **JPEG**: images.
- **MP3, AAC**: audio.
- **H.264, MP4**: video.
- Much higher compression ratios.
- Acceptable when small quality loss tolerable.

**Why compression matters:**
- Save storage.
- Save bandwidth.
- Faster transmission.

**Compression algorithms:**
- **Run-length encoding**: AAAA → 4A.
- **Huffman coding**: more common values get shorter codes.
- **Lempel-Ziv** (used in ZIP): finds repeated patterns.
- **JPEG**: drops high-frequency information (which eye notices less).
- **MP3**: discards frequencies humans can\'t hear well.

**Trade-off**: compression vs quality vs computation time.`,
    },
    {
      code: '2.4',
      title: 'Information from data',
      content:
`**Data analysis** extracts information from raw data.

**Big data.** Massive datasets that traditional tools can\'t handle.
- Volume, velocity, variety, veracity (4 Vs).
- Examples: social media, financial transactions, sensor data, scientific instruments.

**Data structures:**
- **List/array**: ordered collection.
- **Dictionary/map**: key-value pairs.
- **Set**: unique elements.
- **Tree, graph**: hierarchical / networked.

**Filtering.** Select rows meeting criteria.
**Sorting.** Order by some attribute.
**Aggregating.** Sum, average, count.
**Joining.** Combine related datasets.

**Visualization.** Pictures of data.
- **Bar chart**: categories.
- **Line graph**: trends over time.
- **Scatter plot**: relationship between two variables.
- **Heatmap**: 2D matrix of values.
- **Pie chart**: parts of whole (use sparingly).

**Common tools:**
- Spreadsheets (Excel, Google Sheets).
- Python: pandas, NumPy, Matplotlib.
- R.
- Tableau, Power BI.
- SQL for databases.

**Misuse of data.**
- Cherry-picking.
- Misleading axes.
- Correlation as causation.
- Privacy violations.
- Biased samples.

**Privacy.**
- Personally identifiable information (PII).
- HIPAA (medical), FERPA (education), GDPR (EU).
- Anonymization (can be reversed with enough data).
- Differential privacy (mathematical guarantees).`,
    },
  ],
  keyConcepts: [
    'Computers store everything as bits (0/1).',
    'n bits → 2ⁿ values.',
    '8 bits = 1 byte.',
    'ASCII (7-bit) and Unicode (variable, multi-language).',
    'Compression: lossless (no info lost) vs lossy (some discarded).',
    'JPEG/MP3/H.264 are lossy; PNG/FLAC/ZIP are lossless.',
    'Big data: 4 Vs (volume, velocity, variety, veracity).',
    'Data analysis: filter, sort, aggregate, visualize.',
    'Privacy: PII, HIPAA, FERPA, GDPR.',
  ],
  practice: [
    {
      q: 'Convert 27 to binary.',
      a: '27 = 16 + 8 + 2 + 1 = 11011.',
    },
    {
      q: 'A photograph is highly compressed but you can\'t tell the difference. Lossy or lossless?',
      a: 'Could be either — but very high compression with no apparent loss usually means lossy (e.g., JPEG dropping high-frequency details eye can\'t see).',
    },
  ],
  pitfalls: [
    '"Compression always works equally" — depends on data; random data nearly incompressible.',
    '"More compression = better" — trade-off with quality and computation.',
    '"Anonymized data is private" — can often be re-identified by combining datasets.',
  ],
};
