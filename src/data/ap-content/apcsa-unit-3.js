// AP CSA Unit 3 — Boolean Expressions and if Statements

export const APCSA_UNIT_3 = {
  number: 3,
  title: 'Boolean Expressions and if Statements',
  weight: '15-17.5%',
  subunits: [
    {
      code: '3.1',
      title: 'Boolean expressions',
      content:
`**Boolean.** Type with two values: \`true\` and \`false\`.

**Comparison operators** return booleans:
- \`==\` equal to
- \`!=\` not equal to
- \`<\` less than
- \`>\` greater than
- \`<=\` less than or equal
- \`>=\` greater than or equal

\`\`\`java
int x = 5;
boolean isPositive = x > 0;   // true
boolean isEven = x % 2 == 0;  // false
boolean isTen = x == 10;      // false
\`\`\`

**Don\'t confuse \`=\` (assignment) and \`==\` (comparison).**
\`\`\`java
if (x = 5)   // ERROR (assignment, not comparison)
if (x == 5)  // correct
\`\`\`

**Logical operators:**
- \`&&\` AND (both true).
- \`||\` OR (at least one true).
- \`!\` NOT (flips boolean).

\`\`\`java
boolean inRange = (x >= 0) && (x <= 100);
boolean weekend = (day.equals("Sat")) || (day.equals("Sun"));
boolean notReady = !isReady;
\`\`\`

**Short-circuit evaluation.**
- \`a && b\`: if a is false, b not evaluated.
- \`a || b\`: if a is true, b not evaluated.

Useful for guards:
\`\`\`java
if (x != 0 && y / x > 5)  // safe — won\'t divide by zero
\`\`\`

**Operator precedence:**
1. \`!\`
2. \`<\`, \`>\`, \`<=\`, \`>=\`
3. \`==\`, \`!=\`
4. \`&&\`
5. \`||\`

When in doubt, use parens.

**Comparing Strings:**
\`\`\`java
String s = "hello";
s.equals("hello")           // true
s.equals("Hello")           // false (case-sensitive)
s.equalsIgnoreCase("HELLO") // true
s == "hello"                // unreliable; use .equals()
\`\`\`

**compareTo for Strings.** Returns int.
- Negative: this < other (alphabetically).
- Zero: equal.
- Positive: this > other.

\`\`\`java
"apple".compareTo("banana")  // negative (a < b)
"cat".compareTo("cat")        // 0
\`\`\``,
    },
    {
      code: '3.2',
      title: 'if-else statements',
      content:
`**if statement.** Execute code conditionally.

\`\`\`java
if (condition) {
    // run if condition true
}
\`\`\`

**if-else.**
\`\`\`java
if (condition) {
    // run if true
} else {
    // run if false
}
\`\`\`

**if-else if-else.** Multiple branches.
\`\`\`java
if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else if (score >= 70) {
    grade = "C";
} else {
    grade = "F";
}
\`\`\`

Only the first true branch executes. Once a branch matches, rest are skipped.

**Indentation matters for readability.** Java doesn\'t care, but humans do.

**Braces.** Required for multi-statement bodies; optional but recommended for single statements (clearer).

\`\`\`java
// risky
if (x > 0)
    System.out.println("positive");

// safer
if (x > 0) {
    System.out.println("positive");
}
\`\`\`

**Nested if.**
\`\`\`java
if (x > 0) {
    if (x < 10) {
        System.out.println("single digit positive");
    }
}
// or equivalently:
if (x > 0 && x < 10) {
    System.out.println("single digit positive");
}
\`\`\`

**Dangling else.** If you don\'t use braces, else attaches to nearest if:
\`\`\`java
if (a > 0)
    if (b > 0)
        System.out.println("both positive");
    else
        System.out.println("???");
// else here attaches to inner if, not outer
\`\`\`

**Boolean variables in conditions.**
\`\`\`java
boolean isReady = true;
if (isReady) {       // good
    // ...
}
if (isReady == true) {  // works but redundant
    // ...
}
\`\`\`

**Ternary operator.** Compact conditional expression.
\`\`\`java
String result = (x > 0) ? "positive" : "non-positive";
\`\`\`

Equivalent to:
\`\`\`java
String result;
if (x > 0) {
    result = "positive";
} else {
    result = "non-positive";
}
\`\`\``,
    },
    {
      code: '3.3',
      title: 'De Morgan\'s laws and boolean logic',
      content:
`**De Morgan\'s Laws.** Rules for transforming compound boolean expressions.

**!(A && B)** is equivalent to **!A || !B**

**!(A || B)** is equivalent to **!A && !B**

Useful for negating compound conditions cleanly.

**Examples:**

"Not (x > 5 and y > 5)" = "x ≤ 5 or y ≤ 5"
\`\`\`java
!(x > 5 && y > 5)
// equivalent to:
(x <= 5 || y <= 5)
\`\`\`

"Not (raining or snowing)" = "not raining and not snowing"
\`\`\`java
!(raining || snowing)
// equivalent to:
!raining && !snowing
\`\`\`

**Why this matters.** Simplifying boolean logic. Avoiding double negatives. Refactoring conditions.

**Common boolean simplifications:**

- \`!(x == y)\` ⟺ \`x != y\`
- \`!(x > y)\` ⟺ \`x <= y\`
- \`!(x < y)\` ⟺ \`x >= y\`
- \`!!a\` ⟺ \`a\` (double negation)

**Truth tables.**

AND:
| a | b | a&&b |
|---|---|---|
| F | F | F |
| F | T | F |
| T | F | F |
| T | T | T |

OR:
| a | b | a\\|\\|b |
|---|---|---|
| F | F | F |
| F | T | T |
| T | F | T |
| T | T | T |

**Common bugs:**

**Wrong operator.**
\`\`\`java
// "x is between 1 and 10"
1 < x < 10  // doesn\'t work in Java!
1 < x && x < 10  // correct
\`\`\`

**Missing condition.**
\`\`\`java
// "x is 1, 2, or 3"
x == 1 || 2 || 3  // doesn\'t work
x == 1 || x == 2 || x == 3  // correct
\`\`\`

**Wrong precedence.**
\`\`\`java
a || b && c  // ⟺ a || (b && c) (&& binds tighter)
(a || b) && c  // different! use parens for clarity
\`\`\``,
    },
  ],
  keyConcepts: [
    'Boolean type: true / false.',
    'Comparison: ==, !=, <, >, <=, >=.',
    'Logical: && (AND), || (OR), ! (NOT).',
    'Short-circuit: && stops on false; || stops on true.',
    'if, if-else, if-else if chains; only first matching branch runs.',
    'Use .equals() for Strings; not ==.',
    'compareTo returns negative/zero/positive.',
    'De Morgan: !(A && B) ≡ !A || !B; !(A || B) ≡ !A && !B.',
    'Ternary: condition ? a : b.',
  ],
  practice: [
    {
      q: 'Simplify: !(x > 5 && y < 10)',
      a: 'x <= 5 || y >= 10 (De Morgan + flip comparisons)',
    },
  ],
  pitfalls: [
    '"=" vs "==" in conditions — common bug.',
    '"1 < x < 10" — doesn\'t work in Java; must be "1 < x && x < 10".',
  ],
};
