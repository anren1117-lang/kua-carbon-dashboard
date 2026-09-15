// AP CSA Unit 10 — Recursion

export const APCSA_UNIT_10 = {
  number: 10,
  title: 'Recursion',
  weight: '5-7.5%',
  subunits: [
    {
      code: '10.1',
      title: 'Recursion basics',
      content:
`**Recursion.** A method calls itself.

**Why?** Some problems are naturally recursive — defined in terms of smaller instances of themselves.

**Key parts of recursion:**

**Base case.** When to stop. Without it, infinite recursion → StackOverflowError.

**Recursive case.** Method calls itself on smaller input.

**Progress.** Each recursive call must move toward base case.

**Classic example: factorial.**

n! = n × (n-1) × (n-2) × ... × 2 × 1
5! = 5 × 4 × 3 × 2 × 1 = 120

Recursive definition:
- 0! = 1 (base case)
- n! = n × (n-1)! (recursive case)

\`\`\`java
public static int factorial(int n) {
    if (n <= 1) {
        return 1;  // base case
    }
    return n * factorial(n - 1);  // recursive case
}
\`\`\`

**Trace factorial(4):**
- factorial(4) → 4 * factorial(3)
- factorial(3) → 3 * factorial(2)
- factorial(2) → 2 * factorial(1)
- factorial(1) → 1 (base case)
- Returns up: 2 * 1 = 2
- 3 * 2 = 6
- 4 * 6 = 24

**Stack of calls.** Each call gets its own copy of variables on the call stack. When returns, that frame is removed.

**Recursive vs iterative.** Many problems can be solved either way.

Iterative factorial:
\`\`\`java
public static int factorial(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}
\`\`\`

For factorial, iterative is fine. But some problems are much cleaner recursively.

**Anatomy of every recursion:**
1. Identify base case(s).
2. Identify recursive case(s).
3. Make sure recursive call moves toward base case.`,
    },
    {
      code: '10.2',
      title: 'Recursive algorithms',
      content:
`Common recursive examples on AP exam.

**Sum from 1 to n:**
\`\`\`java
public static int sumTo(int n) {
    if (n <= 0) return 0;
    return n + sumTo(n - 1);
}
\`\`\`

**Power: x^n:**
\`\`\`java
public static int power(int x, int n) {
    if (n == 0) return 1;
    return x * power(x, n - 1);
}
\`\`\`

**Fibonacci:**
\`\`\`java
public static int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
\`\`\`

Beautiful but inefficient. fib(40) takes huge time without memoization.

**Print array recursively:**
\`\`\`java
public static void print(int[] arr, int i) {
    if (i >= arr.length) return;  // base case
    System.out.println(arr[i]);
    print(arr, i + 1);
}
\`\`\`

**Reverse string:**
\`\`\`java
public static String reverse(String s) {
    if (s.length() <= 1) return s;
    return reverse(s.substring(1)) + s.charAt(0);
}
\`\`\`

Trace reverse("abc"):
- reverse("bc") + "a"
- (reverse("c") + "b") + "a"
- ("c" + "b") + "a"
- "cb" + "a"
- "cba"

**Count occurrences in string:**
\`\`\`java
public static int count(String s, char c) {
    if (s.length() == 0) return 0;
    int rest = count(s.substring(1), c);
    if (s.charAt(0) == c) return 1 + rest;
    return rest;
}
\`\`\`

**Binary search recursively:**
\`\`\`java
public static int binarySearch(int[] arr, int target, int lo, int hi) {
    if (lo > hi) return -1;
    int mid = (lo + hi) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return binarySearch(arr, target, mid + 1, hi);
    return binarySearch(arr, target, lo, mid - 1);
}
\`\`\`

**Merge sort.** Classic recursive sort.

Conceptually:
- Split array in half.
- Sort each half (recursively).
- Merge sorted halves.

O(n log n) — efficient.

**Tower of Hanoi.** Classic recursion puzzle. Move n disks from peg A to peg C via peg B.
- Move (n-1) disks from A to B.
- Move biggest disk from A to C.
- Move (n-1) disks from B to C.`,
    },
    {
      code: '10.3',
      title: 'Tracing and analyzing recursion',
      content:
`AP exam often asks you to trace recursion. Practice this.

**Trace pattern.**

For \`f(n) = if n <= 0: return 0; else: return n + f(n-1)\`:

f(3):
- 3 + f(2)
  - 2 + f(1)
    - 1 + f(0)
      - 0
    - = 1 + 0 = 1
  - = 2 + 1 = 3
- = 3 + 3 = 6

**Print order matters.**

\`\`\`java
public static void up(int n) {
    if (n <= 0) return;
    System.out.println(n);  // print BEFORE recurse
    up(n - 1);
}
\`\`\`
up(3) prints: 3, 2, 1

\`\`\`java
public static void down(int n) {
    if (n <= 0) return;
    down(n - 1);
    System.out.println(n);  // print AFTER recurse
}
\`\`\`
down(3) prints: 1, 2, 3

**Stack space.** Each recursive call adds frame to call stack. Deep recursion → StackOverflowError.

Java\'s default stack ~512KB. Maybe ~10,000 recursive calls before overflow.

**Tail recursion.** Recursive call is last thing in method. Some languages optimize this; Java doesn\'t.

**Efficiency.** Some recursive solutions exponential (fib). Memoization makes them linear.

**Memoization.** Cache results.
\`\`\`java
private static int[] memo = new int[100];

public static int fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
}
\`\`\`

Reduces fib from O(2^n) to O(n).

**When to use recursion:**
- Tree/graph traversal.
- Divide and conquer.
- Naturally recursive definitions.
- Combinatorial problems.

**When NOT to:**
- Simple iteration suffices.
- Performance critical (function call overhead).
- Deep recursion would overflow stack.`,
    },
  ],
  keyConcepts: [
    'Recursion: method calls itself.',
    'Base case: when to stop.',
    'Recursive case: call with smaller input.',
    'Progress: each call moves toward base case.',
    'Stack frame per call; StackOverflowError if too deep.',
    'Factorial, sum, power, Fibonacci classic examples.',
    'Reverse string, binary search recursively.',
    'Print order: before recurse = head-first; after = tail-first.',
    'Memoization speeds up exponential recursion.',
  ],
  practice: [
    {
      q: 'What does f(4) return for f(n) = if n<=1 return 1; else return n*f(n-1)?',
      a: '24. f(4) = 4*f(3) = 4*3*f(2) = 4*3*2*f(1) = 4*3*2*1 = 24. (Factorial)',
    },
  ],
  pitfalls: [
    '"Recursion without base case" — infinite recursion; stack overflow.',
    '"Recursion is always elegant" — sometimes loop simpler. Use what fits.',
  ],
};
