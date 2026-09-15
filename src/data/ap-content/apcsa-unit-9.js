// AP CSA Unit 9 — Inheritance

export const APCSA_UNIT_9 = {
  number: 9,
  title: 'Inheritance',
  weight: '5-10%',
  subunits: [
    {
      code: '9.1',
      title: 'Inheritance basics',
      content:
`**Inheritance.** A class can extend another class, inheriting its fields and methods.

**Superclass** (parent): the class being extended.
**Subclass** (child): the class doing the extending.

**Why inheritance?**
- Reuse code (don\'t repeat yourself).
- Express "is-a" relationships.
- Polymorphism (treat subclass as superclass).

**Syntax: extends.**
\`\`\`java
public class Animal {
    protected String name;

    public Animal(String n) {
        name = n;
    }

    public void eat() {
        System.out.println(name + " is eating.");
    }
}

public class Dog extends Animal {
    public Dog(String n) {
        super(n);  // call superclass constructor
    }

    public void bark() {
        System.out.println(name + " barks!");
    }
}
\`\`\`

Now Dog has access to name and eat() inherited from Animal, plus its own bark().

\`\`\`java
Dog d = new Dog("Rex");
d.eat();   // "Rex is eating." (inherited)
d.bark();  // "Rex barks!" (own)
\`\`\`

**"is-a" relationship.**
- Dog is-a Animal. ✓
- Square is-a Rectangle. ✓
- A Square is not a Circle, so Square shouldn\'t extend Circle.

**Access modifiers and inheritance.**
- **public**: accessible everywhere.
- **protected**: accessible in package and in subclasses.
- **private**: accessible only in same class.

If you want subclass to access field, use protected (or provide public getter).

**super keyword.**
- \`super(args)\` calls superclass constructor.
- \`super.method()\` calls superclass version of a method.

**Object class.** All classes implicitly extend Object. So every class has methods like toString, equals, hashCode (inherited from Object).

**Single inheritance only.** Java class can extend ONE superclass only (unlike C++).
- Can implement multiple interfaces (more flexible).`,
    },
    {
      code: '9.2',
      title: 'Method overriding and polymorphism',
      content:
`**Overriding.** Subclass provides own version of an inherited method.

\`\`\`java
public class Animal {
    public void speak() {
        System.out.println("Some sound");
    }
}

public class Dog extends Animal {
    @Override
    public void speak() {
        System.out.println("Woof!");
    }
}

public class Cat extends Animal {
    @Override
    public void speak() {
        System.out.println("Meow!");
    }
}
\`\`\`

\`@Override\` annotation is optional but good practice — compiler catches if you typo the method name.

**Polymorphism.** Same code works on different types.

\`\`\`java
Animal a1 = new Dog("Rex");
Animal a2 = new Cat("Whiskers");

a1.speak();  // "Woof!"
a2.speak();  // "Meow!"
\`\`\`

Variable type is \`Animal\`; actual object is Dog/Cat. Java calls the right \`speak\` based on actual object at runtime — **dynamic dispatch**.

**Polymorphic methods.**
\`\`\`java
public static void makeNoise(Animal a) {
    a.speak();  // works for any Animal subclass
}

makeNoise(new Dog("Rex"));   // "Woof!"
makeNoise(new Cat("Whiskers")); // "Meow!"
\`\`\`

Useful: write code once for superclass, works on all subclasses.

**Calling super version of overridden method:**
\`\`\`java
public class Dog extends Animal {
    @Override
    public void speak() {
        super.speak();  // also do superclass version
        System.out.println("Woof!");
    }
}
\`\`\`

**Overloading vs overriding.**
- **Overloading**: same name, different parameter lists in SAME class.
- **Overriding**: same name and signature, in SUBCLASS. Replaces inherited version.

**Common AP example: shapes.**
\`\`\`java
public class Shape {
    public double area() {
        return 0;
    }
}
public class Circle extends Shape {
    private double radius;
    public Circle(double r) { radius = r; }
    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}
public class Square extends Shape {
    private double side;
    public Square(double s) { side = s; }
    @Override
    public double area() {
        return side * side;
    }
}

Shape[] shapes = {new Circle(3), new Square(5)};
double totalArea = 0;
for (Shape s : shapes) {
    totalArea += s.area();  // calls right area for each
}
\`\`\``,
    },
    {
      code: '9.3',
      title: 'Object class, equals, toString',
      content:
`**Object class.** All Java classes implicitly extend Object.

**Inherited methods.**

**toString().** Returns String representation of object. Default is class name + memory address. Should override.
\`\`\`java
public class Student {
    private String name;
    private int grade;

    @Override
    public String toString() {
        return "Student(" + name + ", grade " + grade + ")";
    }
}

Student s = new Student("Alice", 11);
System.out.println(s);  // calls toString automatically
// "Student(Alice, grade 11)"
\`\`\`

When concatenating with String, toString called automatically:
\`\`\`java
String msg = "My student: " + s;  // toString called
\`\`\`

**equals(Object).** Default checks reference equality (same as ==). Should override for meaningful comparison.

\`\`\`java
public class Point {
    private int x, y;

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Point)) return false;
        Point p = (Point) other;
        return x == p.x && y == p.y;
    }
}
\`\`\`

Steps for equals:
1. Check if other is right type. \`instanceof\`.
2. Cast to that type.
3. Compare fields.

**hashCode().** If you override equals, should also override hashCode. (Not heavily tested on AP exam.)

**Other Object methods:** getClass, clone, finalize, wait, notify (less important for AP).

**instanceof.** Checks if object is instance of class.
\`\`\`java
Animal a = new Dog("Rex");
a instanceof Dog;     // true
a instanceof Animal;  // true
a instanceof Cat;     // false
\`\`\`

**Casting between types.**
\`\`\`java
Animal a = new Dog("Rex");
Dog d = (Dog) a;  // downcast — works because a IS a Dog
d.bark();

Animal a2 = new Cat("Whiskers");
Dog d2 = (Dog) a2;  // ClassCastException at runtime!
\`\`\`

Safe pattern:
\`\`\`java
if (a instanceof Dog) {
    Dog d = (Dog) a;
    d.bark();
}
\`\`\``,
    },
    {
      code: '9.4',
      title: 'Abstract classes and interfaces (intro)',
      content:
`**Abstract class.** Cannot be instantiated directly; must be subclassed.

\`\`\`java
public abstract class Shape {
    public abstract double area();  // no body — subclasses must define

    public void print() {
        System.out.println("Area: " + area());
    }
}

public class Circle extends Shape {
    private double radius;
    public Circle(double r) { radius = r; }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

Shape s = new Shape();  // ERROR — abstract, can\'t instantiate
Shape s = new Circle(3);  // OK
\`\`\`

**Why abstract?**
- Define interface that subclasses must implement.
- Provide common code (concrete methods) but defer details.

**Interface.** Like abstract class but only abstract methods (mostly).

\`\`\`java
public interface Drawable {
    void draw();  // abstract by default
}

public class Circle implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing circle");
    }
}
\`\`\`

**Class can extend ONE class but implement MANY interfaces:**
\`\`\`java
public class Square extends Shape implements Drawable, Comparable<Square> {
    // ...
}
\`\`\`

**Comparable interface.** Standard interface for sorting.
\`\`\`java
public interface Comparable<T> {
    int compareTo(T other);  // negative, zero, positive
}

public class Student implements Comparable<Student> {
    private double gpa;
    @Override
    public int compareTo(Student other) {
        return Double.compare(this.gpa, other.gpa);
    }
}

Collections.sort(students);  // works because Student implements Comparable
\`\`\`

**Abstract vs interface:**
- Abstract: can have concrete methods, fields, constructors. Single inheritance.
- Interface: traditionally only abstract methods (Java 8+ allows default methods). Multiple inheritance possible.

**On AP exam:** Abstract classes and interfaces show up but not heavily.

**Design principle.** Use inheritance for "is-a"; use composition (object holding another object) for "has-a." Don\'t over-inherit.`,
    },
  ],
  keyConcepts: [
    'Inheritance: subclass extends superclass; inherits fields/methods.',
    'extends keyword. Single inheritance only.',
    'super() calls superclass constructor; super.method() calls superclass version.',
    'protected: accessible in subclasses.',
    'Override: subclass provides own version of inherited method. Use @Override.',
    'Polymorphism: superclass variable can hold subclass object. Runtime calls actual class\'s method.',
    'All classes extend Object: toString, equals, hashCode.',
    'instanceof checks type at runtime.',
    'Abstract class: cannot instantiate; provides skeleton.',
    'Interface: defines contract; class can implement many.',
    'Comparable<T>: standard interface; compareTo returns int.',
  ],
  practice: [
    {
      q: 'Animal a = new Dog(); a.speak(); — which speak runs?',
      a: 'Dog\'s. Variable type is Animal but actual object is Dog. Java dispatches to actual class at runtime.',
    },
  ],
  pitfalls: [
    '"super() optional" — if superclass has no default constructor, you MUST call super(args) explicitly.',
    '"== checks values" — for objects, == checks references (same object). Override equals for value comparison.',
  ],
};
