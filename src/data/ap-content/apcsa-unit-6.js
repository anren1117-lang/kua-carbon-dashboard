// AP CSA Unit 6 — Array

export const APCSA_UNIT_6 = {
  number: 6,
  title: 'Array',
  weight: '10-15%',
  subunits: [
    {
      code: '6.1',
      title: 'Creating and accessing arrays',
      content:
`**Array.** Fixed-size ordered collection of same-type elements.

**Declaration.**
\`\`\`java
int[] scores;  // declares array of ints
double[] prices;
String[] names;
\`\`\`

**Creation.** Allocate memory.
\`\`\`java
int[] scores = new int[10];  // size 10, all zeros initially
double[] prices = new double[5];  // all 0.0
String[] names = new String[3];  // all null
\`\`\`

**Initializer (size from list):**
\`\`\`java
int[] arr = {3, 7, 1, 9, 5};
String[] colors = {"red", "green", "blue"};
\`\`\`

**Array indexing.**
- First element: \`arr[0]\`
- Second: \`arr[1]\`
- Last: \`arr[arr.length - 1]\`

\`\`\`java
int[] arr = {10, 20, 30, 40};
arr[0]   // 10
arr[2]   // 30
arr.length  // 4
\`\`\`

**Modifying:**
\`\`\`java
arr[1] = 99;  // arr is now {10, 99, 30, 40}
\`\`\`

**ArrayIndexOutOfBoundsException.** Accessing invalid index.
\`\`\`java
int[] arr = {1, 2, 3};
arr[3];   // ERROR — only indices 0, 1, 2 exist
arr[-1];  // ERROR
\`\`\`

**Default values.**
- int, double, etc.: 0 or 0.0.
- boolean: false.
- Object references (String, etc.): null.

**Arrays have FIXED size.** Once created, size can\'t change. Need ArrayList for dynamic size.

**Common error.**
\`\`\`java
int[] arr;
arr[0] = 5;  // NullPointerException — array not created!

int[] arr = new int[5];
arr[0] = 5;  // OK
\`\`\``,
    },
    {
      code: '6.2',
      title: 'Iterating over arrays',
      content:
`**Standard for loop.**
\`\`\`java
int[] arr = {3, 7, 1, 9, 5};
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}
\`\`\`

Use this when you need index.

**Enhanced for (for-each):**
\`\`\`java
for (int x : arr) {
    System.out.println(x);
}
\`\`\`

Use when you just need values. Can\'t modify array via x.

**Why enhanced for can\'t modify:**
\`\`\`java
for (int x : arr) {
    x = x * 2;  // modifies LOCAL x, not arr element
}
// arr unchanged
\`\`\`

Use index-based loop to modify:
\`\`\`java
for (int i = 0; i < arr.length; i++) {
    arr[i] = arr[i] * 2;  // modifies array
}
\`\`\`

**Common patterns:**

**Sum:**
\`\`\`java
int sum = 0;
for (int x : arr) {
    sum += x;
}
\`\`\`

**Max:**
\`\`\`java
int max = arr[0];
for (int x : arr) {
    if (x > max) max = x;
}
\`\`\`

**Linear search:**
\`\`\`java
int targetIndex = -1;
for (int i = 0; i < arr.length; i++) {
    if (arr[i] == target) {
        targetIndex = i;
        break;
    }
}
\`\`\`

**Count matching:**
\`\`\`java
int count = 0;
for (int x : arr) {
    if (x > 50) count++;
}
\`\`\`

**Print array:**
\`\`\`java
for (int i = 0; i < arr.length; i++) {
    System.out.print(arr[i]);
    if (i < arr.length - 1) System.out.print(", ");
}
System.out.println();
\`\`\`

Or:
\`\`\`java
System.out.println(Arrays.toString(arr));  // [3, 7, 1, 9, 5]
\`\`\`

**Reverse iteration:**
\`\`\`java
for (int i = arr.length - 1; i >= 0; i--) {
    System.out.println(arr[i]);
}
\`\`\``,
    },
    {
      code: '6.3',
      title: 'Array algorithms',
      content:
`Common operations on arrays.

**Sum:**
\`\`\`java
public static int sum(int[] arr) {
    int sum = 0;
    for (int x : arr) sum += x;
    return sum;
}
\`\`\`

**Average:**
\`\`\`java
public static double average(int[] arr) {
    return (double) sum(arr) / arr.length;
}
\`\`\`

**Find max/min:**
\`\`\`java
public static int max(int[] arr) {
    int max = arr[0];
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}
\`\`\`

**Reverse array (in place):**
\`\`\`java
public static void reverse(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n / 2; i++) {
        int temp = arr[i];
        arr[i] = arr[n - 1 - i];
        arr[n - 1 - i] = temp;
    }
}
\`\`\`

**Copy array.**
\`\`\`java
int[] copy = new int[arr.length];
for (int i = 0; i < arr.length; i++) {
    copy[i] = arr[i];
}
\`\`\`

Or use library:
\`\`\`java
int[] copy = Arrays.copyOf(arr, arr.length);
\`\`\`

**Linear search.**
\`\`\`java
public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;  // not found
}
\`\`\`

**Selection sort (educational, O(n²)).**
\`\`\`java
for (int i = 0; i < arr.length - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIdx]) minIdx = j;
    }
    // swap
    int temp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = temp;
}
\`\`\`

**Insertion sort (educational, O(n²)).**
\`\`\`java
for (int i = 1; i < arr.length; i++) {
    int curr = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > curr) {
        arr[j + 1] = arr[j];
        j--;
    }
    arr[j + 1] = curr;
}
\`\`\`

**Merge sort (O(n log n)).** Not on AP CSA test but conceptually important.

**Binary search** (requires sorted array, O(log n)):
\`\`\`java
int lo = 0, hi = arr.length - 1;
while (lo <= hi) {
    int mid = (lo + hi) / 2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;
\`\`\``,
    },
  ],
  keyConcepts: [
    'Array: fixed-size, same type. Declare: int[] arr; create: new int[10].',
    'Indices 0 to length-1.',
    'arr.length (no parens).',
    'Default values: 0 / 0.0 / false / null.',
    'Index out of bounds → exception.',
    'Standard for to modify; enhanced for to read.',
    'Common patterns: sum, max, search, count.',
    'Selection sort, insertion sort: O(n²). Binary search: O(log n) on sorted.',
  ],
  practice: [
    {
      q: 'What\'s arr[arr.length - 1] for arr = {5, 10, 15}?',
      a: '15. length - 1 = 2; arr[2] = 15. Last element.',
    },
  ],
  pitfalls: [
    '"arr.length()" — no, no parens for arrays. (Strings use length().)',
    '"Enhanced for can modify array" — no; modifies local variable only.',
  ],
};
