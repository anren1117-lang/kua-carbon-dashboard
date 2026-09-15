// AP CSA Unit 2 — Using Objects

export const APCSA_UNIT_2 = {
  number: 2,
  title: 'Using Objects',
  weight: '5-7.5%',
  subunits: [
    {
      code: '2.1',
      title: 'Objects and classes',
      content:
`**Class.** Blueprint for creating objects. Defines data (attributes) and behavior (methods).

**Object.** An instance of a class.

**Analogy.** Class = cookie cutter; object = cookie.

**Example built-in class: String**
- Class is "String."
- Each string you create is an object.

\`\`\`java
String name = "Alice";  // creates a String object
String greeting = new String("Hello");  // also creates one
\`\`\`

**Reference variables.** Object variables hold REFERENCES to objects, not the objects themselves.
\`\`\`java
String s = "Hello";
// s holds a reference (memory address) to a String object containing "Hello"
\`\`\`

**Primitive vs reference.**
- Primitive: holds value directly (int x = 5; x has the 5).
- Reference: holds address of object (String s = "Hi"; s has a "pointer" to the String).

**null.** Reference that points to no object.
\`\`\`java
String s = null;  // no object
s.length();  // NullPointerException!
\`\`\`

**Creating objects.** \`new\` keyword.
\`\`\`java
Scanner input = new Scanner(System.in);
Random rand = new Random();
ArrayList<Integer> list = new ArrayList<>();
\`\`\`

Strings can be created without \`new\` (literal):
\`\`\`java
String s = "Hello";
\`\`\`

**Constructors.** Special method that creates objects. Same name as class.
\`\`\`java
Scanner(InputStream in)
Random()
Random(long seed)
ArrayList<E>()
\`\`\`

The values you pass to constructor are arguments.`,
    },
    {
      code: '2.2',
      title: 'Calling methods on objects',
      content:
`**Method.** Function attached to an object (or class).

**Calling a method.**
\`\`\`java
String s = "Hello";
int len = s.length();  // calls length() on s
\`\`\`

Syntax: \`object.methodName(arguments)\`

**Methods may:**
- **Return a value.** length() returns an int.
- **Return nothing (void).** println() returns void.
- **Modify the object.** ArrayList.add() modifies the list.
- **Have side effects.** println() prints to console.

**Method signature.** Name + parameter types.
- \`length()\` — no parameters.
- \`substring(int)\` — one int parameter.
- \`substring(int, int)\` — two int parameters.

**Common String methods (memorize for AP).**

- \`length()\` — number of characters.
- \`substring(int start)\` — from start to end.
- \`substring(int start, int end)\` — from start to end-1 (NOT inclusive).
- \`indexOf(String s)\` — first position of s, or -1 if not found.
- \`equals(String s)\` — true if equal.
- \`compareTo(String s)\` — negative if this < s, 0 if equal, positive if this > s.

\`\`\`java
String s = "Hello, world!";
s.length();              // 13
s.substring(7, 12);      // "world"
s.indexOf("world");      // 7
s.indexOf("Java");       // -1
"abc".equals("abc");     // true
"abc".equals("ABC");     // false (case-sensitive)
\`\`\`

**Strings are immutable.** Methods return NEW strings; don\'t modify original.
\`\`\`java
String s = "Hello";
s.toUpperCase();  // returns "HELLO" but s still "Hello"
s = s.toUpperCase();  // now s is "HELLO"
\`\`\`

**== vs .equals().**
\`\`\`java
String a = "hello";
String b = "hello";
String c = new String("hello");

a == b           // true (Java interns string literals)
a == c           // false (different objects)
a.equals(c)      // true (same content)
\`\`\`

**For Strings, use .equals(). Always.** \`==\` checks reference equality (same object), not value equality.`,
    },
    {
      code: '2.3',
      title: 'Math class and integer operations',
      content:
`**Math** is a class with **static** methods (called on the class, not on an instance).

Common Math methods:

- \`Math.abs(x)\` — absolute value.
- \`Math.pow(base, exp)\` — base^exp. Returns double.
- \`Math.sqrt(x)\` — square root. Returns double.
- \`Math.random()\` — random double in [0, 1).
- \`Math.min(a, b)\` — smaller of two.
- \`Math.max(a, b)\` — larger of two.

\`\`\`java
Math.abs(-5);          // 5
Math.pow(2, 10);       // 1024.0
Math.sqrt(16);         // 4.0
Math.max(7, 3);        // 7
\`\`\`

**Calling Math.method.** No \`new Math()\`; no object needed. Just \`Math.methodName\`.

**Generating random numbers.**

\`Math.random()\` returns double in [0, 1).

To get random int in [low, high]:
\`\`\`java
int randNum = (int)(Math.random() * (high - low + 1)) + low;
\`\`\`

Example: random number 1-6 (dice):
\`\`\`java
int dice = (int)(Math.random() * 6) + 1;
\`\`\`

Why this works:
- Math.random() → [0, 1)
- × 6 → [0, 6)
- (int) cast → 0, 1, 2, 3, 4, or 5
- + 1 → 1, 2, 3, 4, 5, or 6

**Alternative: Random class.**
\`\`\`java
import java.util.Random;
Random rand = new Random();
int n = rand.nextInt(6) + 1;  // 1-6
\`\`\`

**Math operations review:**
\`\`\`java
double area = Math.PI * Math.pow(r, 2);
double distance = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
\`\`\`

**Important constants:**
- \`Math.PI\` — pi.
- \`Math.E\` — e.

**Math vs primitive math operators.**
- \`+\`, \`-\`, \`*\`, \`/\`, \`%\` are operators (fast, simple).
- \`Math.pow\`, \`Math.sqrt\`, etc. are methods (more complex operations).`,
    },
    {
      code: '2.4',
      title: 'Wrapper classes',
      content:
`**Wrapper classes** wrap primitive types as objects.

Why? Some Java features (like ArrayList) work with objects, not primitives.

| Primitive | Wrapper |
|---|---|
| int | Integer |
| double | Double |
| boolean | Boolean |
| char | Character |

**Boxing.** Converting primitive to wrapper.
\`\`\`java
int x = 5;
Integer i = x;  // autoboxing (Java 5+)
Integer i2 = Integer.valueOf(5);  // explicit
\`\`\`

**Unboxing.** Wrapper to primitive.
\`\`\`java
Integer i = 5;
int x = i;  // auto-unboxing
int y = i.intValue();  // explicit
\`\`\`

**Common Integer methods:**
- \`Integer.parseInt(String s)\` — convert "123" to int 123.
- \`Integer.toString(int n)\` — convert int to "123".
- \`Integer.MAX_VALUE\`, \`Integer.MIN_VALUE\` — limits.

**Common Double methods:**
- \`Double.parseDouble(String s)\` — "3.14" → 3.14.

**Why this matters for AP:**
- ArrayList<Integer> not ArrayList<int>.
- Autoboxing is automatic but understand what\'s happening.

\`\`\`java
ArrayList<Integer> list = new ArrayList<>();
list.add(5);  // 5 is int; auto-boxes to Integer
int x = list.get(0);  // Integer auto-unboxes to int
\`\`\`

**Watch out: NullPointerException on unboxing.**
\`\`\`java
Integer i = null;
int x = i;  // NullPointerException
\`\`\``,
    },
  ],
  keyConcepts: [
    'Class = blueprint; object = instance.',
    'Reference variables hold address of object.',
    '== checks reference equality; .equals() checks value equality.',
    'Strings are IMMUTABLE — methods return new strings.',
    'Common String methods: length, substring (start, end exclusive), indexOf, equals, compareTo.',
    'Math.abs, Math.pow, Math.sqrt, Math.random, Math.max, Math.min.',
    'Math.random() returns [0, 1). Cast to get random int.',
    'Wrapper classes: Integer, Double, Boolean, Character.',
    'Autoboxing/unboxing between primitives and wrappers.',
  ],
  practice: [
    {
      q: 'How to get random number 5-10?',
      a: '(int)(Math.random() * 6) + 5. Math.random() × 6 gives [0, 6); cast gives 0-5; +5 gives 5-10.',
    },
    {
      q: 'What\'s "hello".substring(1, 4)?',
      a: '"ell" — start at index 1, up to but not including 4.',
    },
  ],
  pitfalls: [
    '"== works for Strings" — sometimes (string interning) but unreliable. Always use .equals().',
    '"Strings can be modified" — no; immutable. Methods return new ones.',
  ],
};
