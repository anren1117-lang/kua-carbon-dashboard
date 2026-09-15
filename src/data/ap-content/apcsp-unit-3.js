// AP CS Principles Big Idea 3 — Algorithms and Programming (30-35%)

export const APCSP_UNIT_3 = {
  number: 3,
  title: 'Algorithms and Programming',
  weight: '30-35%',
  subunits: [
    {
      code: '3.1',
      title: 'Variables and data types',
      content:
`**Variable.** Named storage for a value that can change.

**Common data types:**
- **Integer (int)**: whole numbers (-5, 0, 42).
- **Float / double**: decimals (3.14, -0.5).
- **String**: text ("Hello").
- **Boolean**: true / false.
- **List/array**: ordered collection.

**Assignment.** Storing value in variable.
- Python: x = 5
- Most languages: similar with = operator.

**Type vs value.** Variable refers to a value of some type.

**Dynamic vs static typing.**
- **Dynamic** (Python, JS): type can change at runtime.
- **Static** (Java, C++): type fixed at compile time.

**Mutable vs immutable.**
- **Mutable**: can change after creation (lists).
- **Immutable**: can\'t change (strings in Python, all primitives).`,
    },
    {
      code: '3.2',
      title: 'Expressions and operators',
      content:
`**Arithmetic operators:**
- + - * /
- ** (exponentiation in Python; pow in others).
- % (modulo: remainder).
- Integer vs float division varies by language.

**Comparison operators:**
- == (equal), != (not equal).
- <, >, <=, >=.
- Return boolean.

**Logical operators:**
- AND (&&, and).
- OR (||, or).
- NOT (!, not).

**Order of operations** (like math):
- Parentheses first.
- Exponents.
- Multiplication, division.
- Addition, subtraction.
- Use parentheses for clarity.

**Short-circuit evaluation.** (a AND b): if a is false, b not evaluated. (a OR b): if a true, b not evaluated. Useful for guards: \`if x is not None and x.value > 5\`.

**String concatenation.** Joining strings.
- Python: "hello" + " world".
- Some languages: .concat() method.

**Type conversion / casting.**
- int("42") → 42.
- str(42) → "42".
- float("3.14") → 3.14.

**Common bugs:**
- Comparing strings to numbers without conversion.
- Floating-point precision (0.1 + 0.2 ≠ 0.3 exactly).
- Off-by-one in operators.`,
    },
    {
      code: '3.3',
      title: 'Control structures — if statements',
      content:
`**Conditional statements** make decisions.

**if-else:**
\`\`\`
if condition:
    do something
else:
    do something else
\`\`\`

**elif (else if):**
\`\`\`
if x > 90:
    grade = "A"
elif x > 80:
    grade = "B"
elif x > 70:
    grade = "C"
else:
    grade = "F"
\`\`\`

**Nested if.** if inside if. Use sparingly; can be hard to read.

**Boolean expressions.** if x > 5 and (y < 10 or z == 0):

**Switch / match statement.** Some languages have multi-way conditional.

**Truthy values.** Some languages treat non-zero numbers, non-empty strings, non-null objects as "true". Be careful.

**Common bugs:**
- = vs == (assignment vs comparison).
- Missing parentheses or colons.
- Edge cases (what if x = exactly 90?).
- Forgetting else.

**Short-form conditional (ternary):**
- Python: result = "yes" if x > 5 else "no".
- C/Java/JS: result = x > 5 ? "yes" : "no".`,
    },
    {
      code: '3.4',
      title: 'Loops',
      content:
`**Loops** repeat code.

**for loop** (definite iteration):
\`\`\`
for i in range(10):
    print(i)
\`\`\`
Prints 0-9.

**while loop** (indefinite iteration):
\`\`\`
while x > 0:
    x = x - 1
\`\`\`
Runs until condition false.

**Loop with collection:**
\`\`\`
for item in mylist:
    print(item)
\`\`\`

**Break.** Exit loop early.
**Continue.** Skip to next iteration.

**Nested loops.** Loop inside loop. n × m total iterations.

**Common bugs:**
- **Infinite loop**: condition never becomes false.
- **Off-by-one**: range(10) gives 0-9, not 1-10.
- Loop variable changed unexpectedly inside.
- Performance: nested loops can be slow on big data.

**Loop invariants.** Property that\'s true at each iteration. Helps reason about correctness.

**When for vs while:**
- For: known number of iterations or iterating collection.
- While: unknown number; "until something happens."`,
    },
    {
      code: '3.5',
      title: 'Functions / procedures',
      content:
`**Function** (or procedure, method, subroutine). Reusable block of code.

\`\`\`
def square(x):
    return x * x
\`\`\`

Call: square(5) → 25.

**Parameters.** Inputs to function.
**Return value.** Output. Some functions return nothing (void).

**Why functions?**
- **Reusability**: write once, call many.
- **Abstraction**: hide complexity.
- **Modularity**: break problem into pieces.
- **Testability**: test functions independently.

**Scope.**
- **Local variables**: visible only inside function.
- **Global variables**: visible everywhere (use sparingly).

**Pure functions.** Same input always gives same output; no side effects. Easier to test and reason about.

**Side effects.** Function changes external state (e.g., prints, writes file, modifies global var).

**Recursion.** Function calls itself.

Example: factorial.
\`\`\`
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
\`\`\`

Needs **base case** to avoid infinite recursion.

Useful for tree/graph problems, divide-and-conquer.`,
    },
    {
      code: '3.6',
      title: 'Lists, strings, and data structures',
      content:
`**List/array.** Ordered collection.
- Index from 0 (Python, most languages).
- mylist[0] = first element.
- mylist[-1] = last (Python).
- len(mylist) = length.

**Common list operations:**
- append(x): add to end.
- pop(): remove last.
- sort(): sort in place.
- reverse().
- mylist.index(x): find position.

**String operations:**
- Concatenation: "a" + "b".
- Substring: mystring[2:5].
- Length: len(mystring).
- split(", "): break into parts.
- replace, upper, lower, strip.

**Dictionary (hashmap).** Key-value pairs.
- mydict["name"] = "Alice".
- mydict.get("name") → "Alice".
- mydict.keys(), .values(), .items().

**Set.** Unique elements.
- {1, 2, 3}.
- Fast membership test (much faster than list for large data).

**2D arrays / nested lists.** Grids, matrices.
- matrix[row][col].

**Searching:**
- **Linear search**: check each. O(n).
- **Binary search**: works on sorted; O(log n).

**Sorting:**
- **Bubble, insertion**: O(n²). Educational.
- **Merge, quicksort**: O(n log n). Real-world.

**Big O notation.** Describes how runtime/space scales with input size n.
- O(1): constant (array access).
- O(log n): logarithmic (binary search).
- O(n): linear (loop through once).
- O(n log n): sorting.
- O(n²): nested loops, slow on big data.
- O(2ⁿ): exponential, intractable for moderate n.`,
    },
    {
      code: '3.7',
      title: 'Algorithms — search, sort, recursion',
      content:
`**Search algorithms:**
- **Linear search.** Check every element. Works on unsorted. O(n).
- **Binary search.** Repeatedly halve sorted list. O(log n).

**Sort algorithms:**
- **Bubble sort.** Compare adjacent; swap. O(n²).
- **Selection sort.** Find min; place at front. O(n²).
- **Insertion sort.** Insert each into sorted prefix. O(n²) average; O(n) on nearly sorted.
- **Merge sort.** Divide, sort halves, merge. O(n log n). Stable.
- **Quick sort.** Pick pivot; partition; recurse. O(n log n) average; O(n²) worst.

**Big O bounds matter.** O(n²) sort of 1M items: hours. O(n log n): seconds.

**Recursive algorithms:**
- Factorial.
- Fibonacci (naive: O(2ⁿ); with memoization: O(n)).
- Tree traversal.
- Quicksort, mergesort.
- Backtracking (N-queens, sudoku).

**Greedy algorithms.** Make locally optimal choice. Sometimes global optimum (Huffman coding); sometimes not.

**Dynamic programming.** Solve subproblems; store results; combine. Avoids recomputation.

**Problem-solving approaches.**
- Understand problem.
- Identify pattern.
- Choose algorithm.
- Code.
- Test edge cases.
- Optimize if needed.

**Heuristics.** Approximations when exact too slow. Used in routing (Google Maps), AI (game-playing, neural networks).`,
    },
  ],
  keyConcepts: [
    'Variables hold typed values; some languages dynamic, some static.',
    'Operators: arithmetic, comparison, logical.',
    'Control: if/elif/else; for, while loops.',
    'Functions: parameters, return; reusability + abstraction.',
    'Recursion: function calls itself; needs base case.',
    'Lists, strings, dictionaries, sets.',
    'Big O: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ).',
    'Linear vs binary search.',
    'Sort algorithms: bubble (slow), merge/quick (fast).',
    'Dynamic programming + memoization avoid recomputation.',
  ],
  practice: [
    {
      q: 'You need to search 1 million sorted items. Linear or binary search?',
      a: 'Binary search. O(log n) = ~20 comparisons vs O(n) = up to 1M for linear.',
    },
  ],
  pitfalls: [
    '"Index from 1" — wrong in most languages; from 0.',
    '"= and == are the same" — different! = assigns, == compares.',
    '"Recursion is always elegant" — sometimes loops simpler and faster.',
  ],
};
