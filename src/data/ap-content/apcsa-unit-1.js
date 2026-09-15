// AP CSA Unit 1 — Primitive Types

export const APCSA_UNIT_1 = {
  number: 1,
  title: 'Primitive Types',
  weight: '2.5-5%',
  subunits: [
    {
      code: '1.1',
      title: 'Why programming and Java',
      content:
`**Programming** is writing instructions for computers to execute.

**Java.** Object-oriented language. Compiled to bytecode that runs on Java Virtual Machine (JVM). Designed for portability ("write once, run anywhere").

**AP CSA uses Java.** Other CS courses use Python, JavaScript, C++, etc. Concepts transfer.

**Why we still teach Java despite its verbosity:**
- Strong typing (catches bugs at compile time).
- Object-oriented from the start (vs Python where OO is optional).
- Widely used in industry (Android, banking, enterprise).
- Forces explicit thinking about types and structure.

**A first Java program:**
\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
\`\`\`

This:
- Declares a public class named HelloWorld.
- Inside is a main method (entry point).
- main calls System.out.println which prints to console.

**Java is verbose by design.** Lots of structure compared to Python:
\`\`\`python
print("Hello, world!")
\`\`\`

**Compiling and running.**
- \`javac HelloWorld.java\` produces \`HelloWorld.class\` (bytecode).
- \`java HelloWorld\` runs it.
- IDE (IntelliJ, Eclipse, VS Code) usually handles this.

**Common student frustration.** "Why so much boilerplate?" Trust the structure for now; you\'ll see why later when classes grow.`,
    },
    {
      code: '1.2',
      title: 'Variables and primitive types',
      content:
`**Variable.** Named storage for a value.

**Declaration.** State type and name.
\`\`\`java
int age;
double price;
boolean isReady;
\`\`\`

**Initialization.** Assign value.
\`\`\`java
age = 25;
price = 9.99;
isReady = true;
\`\`\`

**Combined.**
\`\`\`java
int age = 25;
double price = 9.99;
boolean isReady = true;
\`\`\`

**Primitive types in AP CSA:**

**int.** Whole numbers. 32-bit signed integer. Range: ~ -2.1 billion to +2.1 billion.

**double.** Decimal numbers. 64-bit floating point. Roughly 15 decimal digits of precision.

**boolean.** true or false. Not 1/0 like in C.

**Other primitives exist in Java** (byte, short, long, float, char) but AP CSA focuses on int, double, boolean.

**Naming conventions.**
- camelCase for variables: \`firstName\`, \`numStudents\`.
- Start with letter, _, or $. Can\'t start with number.
- Can\'t use reserved words (int, class, public, if, ...).
- Case-sensitive: \`age\` and \`Age\` are different variables.

**Constants.** Use \`final\` keyword. By convention SCREAMING_CASE.
\`\`\`java
final int MAX_STUDENTS = 30;
final double PI = 3.14159;
\`\`\`

**Type matters.** Once declared as \`int\`, can\'t store a double in it without explicit conversion. Java is **statically typed** — type checked at compile time.

\`\`\`java
int x = 5;
x = 3.14;  // compile error
\`\`\`

**Why types matter.**
- Memory allocated based on type.
- Operations available depend on type.
- Compiler can catch bugs.`,
    },
    {
      code: '1.3',
      title: 'Operators and expressions',
      content:
`**Arithmetic operators:**
- \`+\` addition
- \`-\` subtraction
- \`*\` multiplication
- \`/\` division
- \`%\` modulo (remainder)

**Integer division.** When BOTH operands are int, division gives int result (truncated, not rounded).
\`\`\`java
int x = 7 / 2;  // x = 3, not 3.5
double y = 7.0 / 2;  // y = 3.5 (one operand is double)
double z = (double) 7 / 2;  // z = 3.5 (cast 7 to double)
\`\`\`

**Modulo.** Returns remainder.
\`\`\`java
17 % 5  // 2 (because 17 = 3*5 + 2)
10 % 3  // 1
12 % 4  // 0
\`\`\`

Common uses:
- Even/odd: \`n % 2 == 0\` is even.
- Cycling: \`i % 7\` to map any int into 0-6.
- Getting last digit: \`123 % 10 == 3\`.

**Operator precedence** (like math):
1. \`()\`
2. \`*\`, \`/\`, \`%\`
3. \`+\`, \`-\`
4. \`=\` (assignment)

Use parens for clarity even when unnecessary.

**Compound assignment.**
\`\`\`java
x += 5;   // same as x = x + 5
x -= 3;   // x = x - 3
x *= 2;   // x = x * 2
x /= 4;   // x = x / 4
x %= 3;   // x = x % 3
\`\`\`

**Increment/decrement.**
\`\`\`java
x++;  // x = x + 1
x--;  // x = x - 1
++x;  // also increment (prefix)
\`\`\`

Difference: \`x++\` returns OLD value then increments; \`++x\` increments then returns new. Don\'t mix into bigger expressions — confusing.

**Casting.** Converting between types.
\`\`\`java
double d = 3.7;
int i = (int) d;  // i = 3 (truncates, doesn\'t round)

int x = 7;
double y = (double) x;  // y = 7.0

// Implicit widening (int to double) doesn\'t need cast:
double z = x;  // OK, z = 7.0
\`\`\`

**Common pitfalls:**
- Integer division when you wanted float result.
- Off-by-one with modulo.
- Forgot parens, wrong precedence.
- \`int\` overflow on big numbers.`,
    },
    {
      code: '1.4',
      title: 'Input and output',
      content:
`**Output.**

\`System.out.println(x)\` — prints x, then newline.
\`System.out.print(x)\` — prints x, no newline.
\`System.out.printf(format, args...)\` — formatted print, like C\'s printf.

\`\`\`java
int age = 25;
String name = "Alice";
System.out.println("Hello, " + name + "!");  // "Hello, Alice!"
System.out.println("Age: " + age);             // "Age: 25"

// printf with format specifiers
System.out.printf("Price: $%.2f%n", 9.999);    // "Price: $10.00"
\`\`\`

**String concatenation.** \`+\` joins strings (and converts non-strings).

**Input (less emphasized in AP CSA).** Usually Scanner class.
\`\`\`java
import java.util.Scanner;

Scanner input = new Scanner(System.in);
int age = input.nextInt();
String name = input.nextLine();
\`\`\`

**printf format specifiers:**
- \`%d\` — int.
- \`%f\` — double.
- \`%.2f\` — double, 2 decimals.
- \`%s\` — String.
- \`%n\` — newline (platform-independent).

**Escape characters in strings:**
- \`\\n\` newline.
- \`\\t\` tab.
- \`\\"\` double quote.
- \`\\\\\` backslash.

**Common output tasks:**

Print a line:
\`\`\`java
System.out.println("Hello");
\`\`\`

Print without newline:
\`\`\`java
System.out.print("Hello ");
System.out.print("World");  // "Hello World" on same line
\`\`\`

Print formatted:
\`\`\`java
double price = 12.5;
System.out.printf("Total: $%.2f%n", price);
\`\`\``,
    },
  ],
  keyConcepts: [
    'Java: statically typed, object-oriented, compiled to JVM bytecode.',
    'Primitives: int, double, boolean (also char, but not emphasized).',
    'Declaration + initialization.',
    'camelCase for variables; SCREAMING_CASE for constants (final).',
    'Integer division truncates: 7/2 = 3.',
    'Modulo for remainders and cycling.',
    'Compound assignment: +=, -=, *=, /=, %=.',
    'Casting: (int), (double).',
    'System.out.println, System.out.print, System.out.printf.',
  ],
  practice: [
    {
      q: 'What does (7 / 2) * 2 + 7 % 2 evaluate to?',
      a: '7. Integer division: 7/2 = 3. 3 * 2 = 6. 7 % 2 = 1. 6 + 1 = 7. (This identity holds: q*d + r = original.)',
    },
  ],
  pitfalls: [
    '"5 / 2 = 2.5" — no; integer division gives 2. Use 5.0 / 2 or (double) 5 / 2.',
    '"(int) 3.9 = 4" — no; truncates to 3.',
  ],
};
