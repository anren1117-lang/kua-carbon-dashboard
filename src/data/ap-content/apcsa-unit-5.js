// AP CSA Unit 5 — Writing Classes

export const APCSA_UNIT_5 = {
  number: 5,
  title: 'Writing Classes',
  weight: '5-7.5%',
  subunits: [
    {
      code: '5.1',
      title: 'Anatomy of a class',
      content:
`A **class** has:
- **Fields** (instance variables) — data each object stores.
- **Constructors** — create new objects.
- **Methods** — what objects can do.

**Example: Student class.**
\`\`\`java
public class Student {
    // fields
    private String name;
    private int grade;
    private double gpa;

    // constructor
    public Student(String n, int g, double p) {
        name = n;
        grade = g;
        gpa = p;
    }

    // methods
    public String getName() {
        return name;
    }

    public double getGpa() {
        return gpa;
    }

    public void promote() {
        grade++;
    }
}
\`\`\`

**Using the class:**
\`\`\`java
Student s = new Student("Alice", 11, 3.8);
System.out.println(s.getName());  // "Alice"
s.promote();
\`\`\`

**Access modifiers.**
- **public**: anyone can access.
- **private**: only this class can access.

**Encapsulation principle:**
- Fields usually private.
- Provide public getters/setters as needed.
- Hides implementation; protects data integrity.

**Why private fields?**
- Outside code can\'t directly modify; must go through methods.
- Methods can validate (e.g., reject negative ages).
- Internal representation can change without breaking external code.

**Constructors.**
- Same name as class.
- No return type (not even void).
- Often initialize fields from parameters.

**Multiple constructors** (overloading).
\`\`\`java
public Student() {
    name = "Unknown";
    grade = 9;
    gpa = 0.0;
}

public Student(String n) {
    name = n;
    grade = 9;
    gpa = 0.0;
}

public Student(String n, int g, double p) {
    name = n;
    grade = g;
    gpa = p;
}
\`\`\`

Choose based on arguments at call site.`,
    },
    {
      code: '5.2',
      title: 'Methods — accessors, mutators, return values',
      content:
`**Accessor methods (getters).** Return a field value. Don\'t modify state.
\`\`\`java
public String getName() {
    return name;
}
\`\`\`

Naming: \`get + FieldName\`. Boolean getters often \`is + FieldName\`.

**Mutator methods (setters).** Modify a field.
\`\`\`java
public void setName(String n) {
    name = n;
}
\`\`\`

Naming: \`set + FieldName\`. Take parameter; return void.

**With validation:**
\`\`\`java
public void setAge(int a) {
    if (a >= 0) {
        age = a;
    }
}
\`\`\`

**Why use getters/setters instead of direct field access?**
- Encapsulation.
- Can add validation.
- Can compute derived values.
- Can log changes.
- Internal representation can change.

**Other method types:**

**Computational.** Return computed value.
\`\`\`java
public double getArea() {
    return width * height;
}
\`\`\`

**Procedural.** Do something; return void.
\`\`\`java
public void promote() {
    grade++;
}
\`\`\`

**Method signature:** name + parameter types. Java distinguishes methods by signature (overloading).

**Method overloading.** Multiple methods with same name, different parameter lists.
\`\`\`java
public double area(double side) {  // square
    return side * side;
}
public double area(double l, double w) {  // rectangle
    return l * w;
}
\`\`\`

**Return statement.** Exits method; sends value back.
\`\`\`java
public int max(int a, int b) {
    if (a > b) return a;
    return b;
}
\`\`\`

void methods can have \`return;\` (no value) to exit early.

**Parameters vs arguments.**
- Parameter: name in method definition.
- Argument: actual value passed at call site.

\`\`\`java
public void greet(String name) { // name is parameter
    System.out.println("Hi " + name);
}

greet("Alice");  // "Alice" is argument
\`\`\``,
    },
    {
      code: '5.3',
      title: 'this keyword and scope',
      content:
`**this.** Refers to current object.

**Common uses:**

**Disambiguate field vs parameter:**
\`\`\`java
public Student(String name, int grade) {
    this.name = name;    // this.name is field; name is parameter
    this.grade = grade;
}
\`\`\`

Without \`this\`, \`name = name\` does nothing (assigns parameter to itself).

**Call other constructor:**
\`\`\`java
public Student() {
    this("Unknown", 9);  // calls other constructor
}
public Student(String n, int g) {
    name = n;
    grade = g;
}
\`\`\`

**Pass current object to other method:**
\`\`\`java
public void enrollIn(Course c) {
    c.addStudent(this);
}
\`\`\`

**Scope.** Where a variable exists / can be accessed.

**Local scope.** Variable declared in method or block. Exists only there.
\`\`\`java
public void doStuff() {
    int x = 5;  // local
    for (int i = 0; i < x; i++) {  // i is local to loop
        // ...
    }
    // i no longer accessible here
}
// x no longer accessible here
\`\`\`

**Instance scope (field).** Declared in class. Exists for lifetime of object. Accessible by all methods in class.

**Class scope (static).** Belongs to class, not instance. Shared by all instances.

**Variable shadowing.** Local variable hides field of same name.
\`\`\`java
public class Student {
    private int grade;
    public void setGrade(int grade) {
        grade = grade;  // BUG: assigns parameter to itself!
    }
}
// Fix: use this
public void setGrade(int grade) {
    this.grade = grade;
}
\`\`\`

**Block scope.**
\`\`\`java
if (x > 0) {
    int y = 5;
    // y accessible
}
// y not accessible here
\`\`\``,
    },
    {
      code: '5.4',
      title: 'Static methods and variables',
      content:
`**Instance** members belong to objects. Each object has its own.

**Static** members belong to the class. Shared across all objects.

**Static variable** (class variable):
\`\`\`java
public class Counter {
    private static int count = 0;  // class variable

    public Counter() {
        count++;  // increments shared count
    }

    public static int getCount() {
        return count;
    }
}

Counter a = new Counter();
Counter b = new Counter();
Counter.getCount();  // 2 (called on class, not instance)
\`\`\`

**Static method.** Called on class.
\`\`\`java
Math.sqrt(16);     // sqrt is static
Integer.parseInt("42");  // parseInt is static
\`\`\`

**Properties of static:**
- Can\'t access instance variables (those belong to specific objects).
- Can be called without creating an object.
- Often used for utilities (Math.abs), factory methods, counters.

**main is static:**
\`\`\`java
public static void main(String[] args) { ... }
\`\`\`

That\'s why main can be called without creating an object of the class.

**Static initialization.**
\`\`\`java
public class Constants {
    public static final double PI = 3.14159;
    public static final int MAX_USERS = 100;
}
\`\`\`

**When to use static:**
- Utility methods that don\'t need object state.
- Constants (with final).
- Counters / factories.

**When NOT to use:**
- When method operates on object\'s state (use instance method).
- Don\'t make everything static; defeats OOP.

**Static vs instance: example.**
\`\`\`java
public class Calculator {
    private int total;

    // instance method (uses total)
    public void add(int n) {
        total += n;
    }

    public int getTotal() {
        return total;
    }

    // static method (doesn\'t need object state)
    public static int square(int n) {
        return n * n;
    }
}

Calculator c = new Calculator();
c.add(5);
c.getTotal();          // 5
Calculator.square(4);  // 16 (no object needed)
\`\`\``,
    },
  ],
  keyConcepts: [
    'Class: fields + constructors + methods.',
    'private fields + public methods (encapsulation).',
    'Accessor (getter) returns field; mutator (setter) modifies field with validation.',
    'Constructor: same name as class, no return type, initializes fields.',
    'Overloading: same name, different signatures.',
    'this refers to current object; disambiguates field/parameter shadowing.',
    'Local scope vs instance scope vs class scope.',
    'static = belongs to class, not object. Math.abs, main.',
    'static methods cannot access instance fields.',
  ],
  practice: [
    {
      q: 'Inside a constructor, why use this.name = name?',
      a: 'When parameter has same name as field, \'name\' refers to parameter. \'this.name\' specifies the field. Without it, assignment is to parameter, not field.',
    },
  ],
  pitfalls: [
    '"Static methods can use instance fields" — no; they have no object reference.',
    '"Constructor returns object" — yes implicitly; don\'t write return type.',
  ],
};
