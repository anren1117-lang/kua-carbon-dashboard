// AP CSA Unit 4 — Iteration

export const APCSA_UNIT_4 = {
  number: 4,
  title: 'Iteration',
  weight: '17.5-22.5%',
  subunits: [
    {
      code: '4.1',
      title: 'while loops',
      content:
`**while loop.** Repeat as long as condition is true.

\`\`\`java
while (condition) {
    // loop body
}
\`\`\`

**Example: print 1-5.**
\`\`\`java
int i = 1;
while (i <= 5) {
    System.out.println(i);
    i++;
}
\`\`\`

**Three things needed for safe loop:**
1. **Initialize.** Variable starts somewhere.
2. **Condition.** When to keep looping.
3. **Update.** Variable progresses toward making condition false.

**Infinite loop.** Condition never becomes false. Bug.
\`\`\`java
int i = 1;
while (i <= 5) {
    System.out.println(i);
    // forgot to increment i!
}
// runs forever
\`\`\`

**Common uses of while:**

**Process input until sentinel:**
\`\`\`java
int n = input.nextInt();
while (n != -1) {
    process(n);
    n = input.nextInt();
}
\`\`\`

**Repeat until condition met:**
\`\`\`java
while (!gameOver) {
    playTurn();
}
\`\`\`

**Find first item:**
\`\`\`java
int i = 0;
while (i < arr.length && arr[i] != target) {
    i++;
}
// after loop: i = position (or arr.length if not found)
\`\`\`

**Loop control issues:**

**Off-by-one.** Loop runs 1 time too many or too few.
- "Less than 10" vs "less than or equal to 10" — both valid but produce different counts.

**Forgetting update.** Infinite loop.

**Update before condition check.** Sometimes wanted, sometimes bug.`,
    },
    {
      code: '4.2',
      title: 'for loops',
      content:
`**for loop.** Compact form for definite iteration.

\`\`\`java
for (initialization; condition; update) {
    // loop body
}
\`\`\`

**Example: print 1-5.**
\`\`\`java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
\`\`\`

**Equivalent while:**
\`\`\`java
int i = 1;
while (i <= 5) {
    System.out.println(i);
    i++;
}
\`\`\`

**for is just compact while.** Same components, just organized differently.

**Why for?**
- Initialization, condition, update all visible at top — easy to scan.
- Loop variable scoped to loop.

**Common patterns:**

**Iterate n times:**
\`\`\`java
for (int i = 0; i < n; i++) {
    // run n times, i goes 0 to n-1
}
\`\`\`

**Count backwards:**
\`\`\`java
for (int i = 10; i >= 1; i--) {
    System.out.println(i);
}
\`\`\`

**Step by 2:**
\`\`\`java
for (int i = 0; i < 20; i += 2) {
    System.out.println(i);  // 0, 2, 4, ..., 18
}
\`\`\`

**Iterate over array:**
\`\`\`java
int[] arr = {3, 7, 1, 9};
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}
\`\`\`

**Enhanced for (for-each) loop:**
\`\`\`java
for (int x : arr) {
    System.out.println(x);
}
\`\`\`

Reads "for each int x in arr." Simpler when you just need values; can\'t modify array via x.

**When to use which:**
- **for** when you know iteration count.
- **while** when you don\'t know count; loop until something happens.
- **enhanced for** when iterating collection, just need values.`,
    },
    {
      code: '4.3',
      title: 'Nested loops',
      content:
`**Nested loop.** Loop inside loop.

**Example: 3x3 grid:**
\`\`\`java
for (int row = 0; row < 3; row++) {
    for (int col = 0; col < 3; col++) {
        System.out.print("(" + row + "," + col + ") ");
    }
    System.out.println();
}
\`\`\`

Output:
\`\`\`
(0,0) (0,1) (0,2)
(1,0) (1,1) (1,2)
(2,0) (2,1) (2,2)
\`\`\`

**Inner loop runs completely for each outer iteration.**
- Total iterations: outer_count × inner_count.
- For 10×10 nested: 100 iterations.
- For 1000×1000: 1,000,000.

**Common use: 2D arrays.**

**Multiplication table:**
\`\`\`java
for (int i = 1; i <= 10; i++) {
    for (int j = 1; j <= 10; j++) {
        System.out.printf("%4d", i * j);
    }
    System.out.println();
}
\`\`\`

**Pattern printing (common AP question):**
\`\`\`java
// Triangle
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print("*");
    }
    System.out.println();
}
\`\`\`

Output:
\`\`\`
*
**
***
****
*****
\`\`\`

**Choosing loop variable names.**
- Outer often \`i\`, inner \`j\`, deeper \`k\`.
- For 2D arrays, \`row\` and \`col\` clearer.

**Performance.** Nested loops can be slow.
- Two loops over n items: O(n²) — 1M operations for n=1000.
- Three nested loops: O(n³) — 1B operations.
- Often a sign there\'s a smarter algorithm.`,
    },
    {
      code: '4.4',
      title: 'Loop algorithms',
      content:
`Common patterns you\'ll use over and over.

**Counting.** How many items match criterion?
\`\`\`java
int count = 0;
for (int x : arr) {
    if (x > 10) {
        count++;
    }
}
\`\`\`

**Summing.**
\`\`\`java
int sum = 0;
for (int x : arr) {
    sum += x;
}
double average = (double) sum / arr.length;
\`\`\`

**Finding min/max.**
\`\`\`java
int max = arr[0];  // initialize to first element
for (int i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
        max = arr[i];
    }
}
\`\`\`

**Searching (linear search).**
\`\`\`java
int targetIndex = -1;
for (int i = 0; i < arr.length; i++) {
    if (arr[i] == target) {
        targetIndex = i;
        break;  // optional — stops searching
    }
}
// after: targetIndex is position or -1
\`\`\`

**Counting digits.**
\`\`\`java
int n = 12345;
int count = 0;
while (n > 0) {
    count++;
    n /= 10;  // remove last digit
}
\`\`\`

**Reversing digits.**
\`\`\`java
int n = 12345;
int reversed = 0;
while (n > 0) {
    reversed = reversed * 10 + n % 10;
    n /= 10;
}
// reversed = 54321
\`\`\`

**Loop control:**

**break.** Exit loop immediately.
\`\`\`java
for (int i = 0; i < 100; i++) {
    if (i == 5) {
        break;  // exit when i == 5
    }
}
\`\`\`

**continue.** Skip rest of body; go to next iteration.
\`\`\`java
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue;  // skip even numbers
    }
    System.out.println(i);  // prints odd numbers only
}
\`\`\`

**Use break/continue sparingly.** Often loop can be rewritten more clearly without.

**Iterative algorithm thinking:**
- Initialize accumulator(s).
- Loop through data.
- Update accumulator(s) based on current item.
- Use final accumulator value.`,
    },
  ],
  keyConcepts: [
    'while: repeat while condition true. Need init + condition + update.',
    'for: compact equivalent; init + condition + update on one line.',
    'enhanced for: for (type x : collection)',
    'Infinite loop = forgotten update.',
    'Nested loops: total iterations = outer × inner.',
    'Patterns: counting, summing, min/max, linear search.',
    'break exits loop; continue skips to next iteration.',
    'O(n²) nested loops can be slow for big data.',
  ],
  practice: [
    {
      q: 'How many times does this print "x"? for (int i = 0; i < 5; i++) for (int j = 0; j < 3; j++) System.out.print("x");',
      a: '15. Outer runs 5 times, inner runs 3 times for each outer = 15 total.',
    },
  ],
  pitfalls: [
    '"i++ before condition" — wrong; for loop checks condition first.',
    '"break exits both loops" — no; just innermost.',
  ],
};
