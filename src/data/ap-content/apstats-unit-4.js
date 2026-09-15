// AP Statistics Unit 4 — Probability, Random Variables, Probability Distributions (10-20%)

export const APSTATS_UNIT_4 = {
  number: 4,
  title: 'Probability, Random Variables, and Probability Distributions',
  weight: '10-20%',
  subunits: [
    {
      code: '4.1',
      title: 'Introduction to probability',
      content:
`**Probability** is a number between 0 and 1 (inclusive) describing how likely something is.

- P = 0: impossible.
- P = 1: certain.
- P = 0.5: equally likely to happen or not.

**Three ways to assign probabilities:**

**(1) Theoretical (classical).** When all outcomes equally likely.
P(event) = (# favorable outcomes) / (# total outcomes).
P(heads on coin flip) = 1/2.
P(rolling 6 on die) = 1/6.

**(2) Empirical (experimental).** Based on observed frequencies.
P(event) ≈ (# times event happened) / (# total trials).
Stabilizes with more trials.

**(3) Subjective.** Based on judgment (Bayesian probability). Used when neither classical nor empirical works.

**Law of Large Numbers.** Over many trials, observed proportion approaches theoretical probability. (Why casinos always win.)

**Sample space (S).** Set of all possible outcomes.
- Flip 2 coins: S = {HH, HT, TH, TT}.

**Event.** Subset of sample space.
- At least one head: {HH, HT, TH}.`,
    },
    {
      code: '4.2',
      title: 'Estimating probabilities using simulation',
      content:
`**Simulation** estimates probabilities by imitating the random process many times.

**Steps:**
1. Identify the random process.
2. Use a random device (table, calculator, computer) to imitate.
3. Define what constitutes "success" or the event of interest.
4. Run many trials.
5. Estimate P(event) ≈ (# successes) / (total trials).

**Tools:**
- Random digit tables.
- Calculator: RandInt, Rand.
- Software: R, Python, Excel.

**Why simulate?** Some probabilities are hard to calculate analytically.
- "What\'s P(at least 2 of 23 people share a birthday)?" → easier to simulate than to use exact formula.
- Confidence intervals, hypothesis tests use simulation increasingly (resampling, bootstrap).

**Margin of error in simulation.** Estimate ± √(p̂(1-p̂)/n). More trials → tighter estimate.

**Worked example.** Estimate P(at least one head in 3 flips).
Simulate 1000 trials of 3 flips. Count trials with ≥1 head. Estimate = count / 1000.
Actual: 1 - (1/2)³ = 7/8 = 0.875.`,
    },
    {
      code: '4.3',
      title: 'Probability rules',
      content:
`**Basic rules:**

**Complement rule.** P(A^c) = 1 - P(A).
- P(not rolling a 6) = 1 - 1/6 = 5/6.

**Addition rule (general):**
P(A ∪ B) = P(A) + P(B) - P(A ∩ B).
- Avoids double-counting outcomes in both A and B.

**Addition rule (mutually exclusive):** If A and B can\'t both happen, P(A ∩ B) = 0.
- P(A or B) = P(A) + P(B).
- P(rolling 2 or 6 on die) = 1/6 + 1/6 = 1/3.

**Multiplication rule (general):**
P(A ∩ B) = P(A) × P(B|A).

**Multiplication rule (independent):** If A and B independent (one doesn\'t affect the other):
P(A ∩ B) = P(A) × P(B).
- P(two heads in two flips) = 1/2 × 1/2 = 1/4.

**Conditional probability:**
P(B|A) = P(A ∩ B) / P(A).
- "Probability of B given A".

**Worked example.** P(rolling sum 7 with two dice)?
Favorable: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → 6 outcomes.
Total: 36.
P = 6/36 = 1/6.`,
    },
    {
      code: '4.4',
      title: 'Mutually exclusive events',
      content:
`Two events are **mutually exclusive (disjoint)** if they cannot both occur.

P(A ∩ B) = 0.

**Examples:**
- Rolling 3 and rolling 5 on one die: mutually exclusive.
- Drawing a king and drawing a queen in one card draw: mutually exclusive.
- Being male and being pregnant: mutually exclusive.

**Examples NOT mutually exclusive:**
- Rolling even number and rolling 6: both can happen (6 is even).
- Being a student and being employed: both possible.

**Addition rule.** For mutually exclusive:
P(A or B) = P(A) + P(B).

For general:
P(A or B) = P(A) + P(B) - P(A and B).

**Mutually exclusive ≠ independent.** In fact, mutually exclusive events are NOT independent (knowing one happened tells you the other did NOT happen).

**Venn diagrams.** Visualize relationships. Two non-overlapping circles = mutually exclusive. Overlapping circles = not mutually exclusive.`,
    },
    {
      code: '4.5',
      title: 'Conditional probability',
      content:
`**Conditional probability.** P(B|A) = probability of B given that A occurred.

P(B|A) = P(A ∩ B) / P(A), assuming P(A) > 0.

**Restricts the sample space** to where A is true.

**Examples:**
- P(rolling 4 | rolled even) = ?
  Even outcomes: {2, 4, 6}. P(4 | even) = 1/3.
- P(rain today | clouds in morning) — likely higher than P(rain today) overall.

**Worked example.** 30% of students play sports. 60% of athletes play multiple sports. P(plays multiple sports)?
P(multiple AND athlete) = P(athlete) × P(multiple | athlete) = 0.30 × 0.60 = 0.18.
P(multiple sports) = 18%.

**Worked example from contingency table.**
|  | Sports | No sports | Total |
|---|---|---|---|
| Male | 80 | 70 | 150 |
| Female | 60 | 90 | 150 |
| Total | 140 | 160 | 300 |

P(plays sports | male) = 80/150 = 53.3%.
P(male | plays sports) = 80/140 = 57.1%.

Order matters!`,
    },
    {
      code: '4.6',
      title: 'Independent events',
      content:
`Two events A and B are **independent** if knowing one happened doesn\'t change probability of the other.

P(B|A) = P(B), equivalently P(A ∩ B) = P(A) × P(B).

**Examples (independent):**
- Two coin flips.
- Drawing a card, replacing, drawing again.
- Roll two separate dice.

**Examples (NOT independent):**
- Drawing two cards WITHOUT replacement.
- Two events on the same person (height and weight).
- Sports score and weather (might be related).

**Testing independence in a two-way table.** Check if P(A|B) = P(A) for all cases.

**Worked example.** Two-way table above. Is "plays sports" independent of "male"?
P(plays sports) = 140/300 = 46.7%.
P(plays sports | male) = 80/150 = 53.3%.
Not equal → NOT independent. Males are more likely to play sports in this sample.

**Multiplication rule with independent events.**
P(all of A, B, C, D...) = P(A) × P(B) × P(C) × ...
- P(5 heads in 5 flips) = (1/2)^5 = 1/32.
- P(no heads in 10 flips) = (1/2)^10 = 1/1024.`,
    },
    {
      code: '4.7',
      title: 'Introduction to random variables',
      content:
`A **random variable** assigns a number to each outcome of a random process.

**Discrete random variable.** Possible values are countable (often whole numbers).
- Number of heads in 3 flips: 0, 1, 2, 3.
- Number of cars sold this week: 0, 1, 2, 3, ...

**Continuous random variable.** Possible values cover a range.
- Height of randomly selected adult: any value from ~140 to ~210 cm.
- Time to complete a task: any positive real.

**Probability distribution.** Lists possible values and their probabilities.

For 3 flips, X = number of heads:
| X | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| P(X) | 1/8 | 3/8 | 3/8 | 1/8 |

Sum of all P(X) = 1.

**Mean (expected value) of X:**
μ_X = E(X) = Σ x · P(x)

For 3 flips: μ = 0(1/8) + 1(3/8) + 2(3/8) + 3(1/8) = 12/8 = 1.5 heads.

**Variance of X:**
σ²_X = Σ(x - μ)² · P(x)

**SD of X:** σ_X = √variance.`,
    },
    {
      code: '4.8',
      title: 'Mean and SD of random variables; combinations',
      content:
`**Linear transformations:**

For Y = a + bX:
- μ_Y = a + b·μ_X.
- σ²_Y = b²·σ²_X.
- σ_Y = |b|·σ_X.

**Adding constants** shifts mean but not SD. Multiplying scales both.

**Combining random variables:**

For Z = X + Y or X - Y:
- μ_Z = μ_X ± μ_Y.
- σ²_Z = σ²_X + σ²_Y (always +, even for subtraction; variances add).
- σ_Z = √(σ²_X + σ²_Y) ONLY IF independent.

**Worked example.** X has mean 100, SD 15. Y has mean 200, SD 20. Find mean and SD of X + Y (assume independent).
- μ_{X+Y} = 300.
- σ²_{X+Y} = 15² + 20² = 225 + 400 = 625.
- σ_{X+Y} = 25.

**Two-step calculation common on AP:**
1. Find expected value and SD of one random variable.
2. Combine with linear transformations or sums.

**Example.** A game costs $5 to play; you win $X (a random variable with mean $7 and SD $4). What's the mean and SD of your net winnings?
Y = X - 5.
- μ_Y = 7 - 5 = $2 (expected to win $2 per play).
- σ_Y = $4 (subtracting a constant doesn\'t change SD).`,
    },
    {
      code: '4.9',
      title: 'Binomial distribution',
      content:
`**Binomial setting** has 4 conditions (BINS):
- **B**inary: each trial has 2 outcomes (success/failure).
- **I**ndependent: trials don\'t affect each other.
- **N**umber of trials is fixed (n).
- **S**ame probability p of success for each trial.

**X = # successes in n trials.** X is binomial: X ~ B(n, p).

**Probability formula:**
P(X = k) = C(n,k) · p^k · (1-p)^(n-k)

where C(n,k) = n!/(k!(n-k)!) = "n choose k".

**Mean and SD:**
μ_X = np
σ_X = √(np(1-p))

**Examples.**
- # heads in 10 flips: B(10, 0.5). μ = 5, σ = √2.5 ≈ 1.58.
- # left-handers in 50 students: B(50, 0.1). μ = 5, σ = √4.5 ≈ 2.12.

**Worked example.** A student guesses on a 10-question true/false test. What\'s P(at least 8 correct)?
n = 10, p = 0.5, success = correct.
P(X ≥ 8) = P(8) + P(9) + P(10)
P(8) = C(10,8)(0.5)^10 = 45 × (1/1024) = 0.0439.
P(9) = C(10,9)(0.5)^10 = 10/1024 = 0.0098.
P(10) = 1/1024 = 0.00098.
Total ≈ 0.0547 ≈ 5.5%.

**Normal approximation.** If np ≥ 10 AND n(1-p) ≥ 10, binomial ≈ normal with μ = np, σ = √(np(1-p)).`,
    },
    {
      code: '4.10',
      title: 'Geometric distribution',
      content:
`**Geometric setting:**
- Same as binomial except number of trials is NOT fixed.
- Count trials UNTIL first success.

**X = # trials until first success.** X ~ Geom(p).

**Probability formula:**
P(X = k) = (1-p)^(k-1) · p

**Mean and SD:**
μ_X = 1/p
σ_X = √[(1-p)/p²]

**Examples.**
- Roll a die until first 6. X ~ Geom(1/6). μ = 6 (expect to need 6 rolls on average).
- Free throws until first miss for 80% shooter. X ~ Geom(0.2). μ = 5.

**Worked example.** P(taking exactly 3 rolls to get first 6)?
P(X = 3) = (5/6)² × (1/6) = 25/216 ≈ 0.116.

**Geometric memoryless property.** P(X > a + b | X > a) = P(X > b). Past failures don\'t affect future.

**Comparison.**
| | Binomial | Geometric |
|---|---|---|
| Fixed trials? | Yes (n) | No |
| Count what? | # successes | # trials to first success |`,
    },
  ],
  keyConcepts: [
    'Probability 0 ≤ P ≤ 1; complement: P(not A) = 1 - P(A).',
    'Mutually exclusive: can\'t both happen. P(A ∪ B) = P(A) + P(B).',
    'Independent: knowing one doesn\'t affect other. P(A ∩ B) = P(A)P(B).',
    'Conditional: P(B|A) = P(A ∩ B)/P(A).',
    'Random variables: discrete (countable) or continuous.',
    'Expected value E(X) = Σ x·P(x).',
    'Variance adds for independent variables; SD does NOT add.',
    'Binomial (BINS): n trials, p success each. μ = np, σ = √(np(1-p)).',
    'Geometric: trials until first success. μ = 1/p.',
  ],
  formulas: [
    {
      name: 'Conditional probability',
      equation: 'P(B|A) = P(A ∩ B) / P(A)',
      meaning: 'Probability of B given A has occurred.',
      example: 'P(rolling 4 | rolled even) = (1/6)/(3/6) = 1/3.',
    },
    {
      name: 'Expected value',
      equation: 'E(X) = μ_X = Σ x · P(x)',
      meaning: 'Weighted average of values.',
      example: 'X = # heads in 3 flips. E(X) = 0(1/8) + 1(3/8) + 2(3/8) + 3(1/8) = 1.5.',
    },
    {
      name: 'Binomial',
      equation: 'P(X=k) = C(n,k) p^k (1-p)^(n-k); μ = np; σ = √(np(1-p))',
      meaning: 'For n independent trials, each with success probability p.',
      example: '10 flips: μ = 5 heads, σ = 1.58.',
    },
  ],
  practice: [
    {
      q: 'P(A) = 0.4, P(B) = 0.3, P(A ∩ B) = 0.1. Find P(A or B).',
      a: 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.4 + 0.3 - 0.1 = 0.6.',
    },
    {
      q: 'A 70%-shooter takes 8 shots. What\'s probability of making exactly 5?',
      a: 'X ~ B(8, 0.7). P(X=5) = C(8,5)(0.7)^5(0.3)^3 = 56 × 0.168 × 0.027 = 0.254 ≈ 25%.',
    },
    {
      q: 'Mean and SD of (X+Y) if X ~ (μ=10, σ=2), Y ~ (μ=15, σ=3), independent.',
      a: 'μ_{X+Y} = 25. σ² = 4 + 9 = 13. σ = √13 ≈ 3.61.',
    },
  ],
  pitfalls: [
    '"Mutually exclusive = independent" — opposite. Mutually exclusive means they CAN\'T both happen; independent means one doesn\'t affect probability of other.',
    '"SDs add" — wrong. Variances add (for independent variables).',
    '"Past results affect future" (gambler\'s fallacy) — no. Independent events have no memory.',
    '"Binomial needs ordering" — no, C(n,k) counts unordered combinations.',
    '"Geometric counts successes" — counts TRIALS to first success.',
  ],
};
