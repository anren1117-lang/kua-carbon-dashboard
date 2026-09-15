// AP CSA Unit 7 — ArrayList

export const APCSA_UNIT_7 = {
  number: 7,
  title: 'ArrayList',
  weight: '2.5-7.5%',
  subunits: [
    {
      code: '7.1',
      title: 'ArrayList basics',
      content:
`**ArrayList.** Dynamic array — grows and shrinks as needed.

**Why ArrayList over array?**
- Dynamic size.
- Many methods built in.
- Easier to add/remove.

**Drawbacks vs array:**
- Stores objects, not primitives (need wrappers like Integer for ints).
- Slightly slower per operation.
- More memory overhead.

**Importing.**
\`\`\`java
import java.util.ArrayList;
\`\`\`

**Declaration.**
\`\`\`java
ArrayList<Integer> nums = new ArrayList<Integer>();
ArrayList<Integer> nums2 = new ArrayList<>();  // diamond syntax (Java 7+)
ArrayList<String> names = new ArrayList<>();
\`\`\`

**Generic type.** \`<Integer>\` specifies element type. Can\'t put non-Integer in nums.

**Why generic?**
- Compile-time type safety.
- No need to cast when retrieving.

**Add elements.**
\`\`\`java
nums.add(5);          // add to end
nums.add(0, 99);      // insert at index 0
\`\`\`

**Get elements.**
\`\`\`java
int first = nums.get(0);  // 99
int second = nums.get(1); // 5
\`\`\`

**Set (replace):**
\`\`\`java
nums.set(0, 7);  // replace element at index 0
\`\`\`

**Remove:**
\`\`\`java
nums.remove(0);  // remove element at index 0
\`\`\`

**Size:**
\`\`\`java
nums.size();  // current number of elements
\`\`\`

Note: \`arr.length\` (array, no parens) vs \`list.size()\` (ArrayList, parens).

**Common methods:**
- \`add(E e)\` — add to end.
- \`add(int i, E e)\` — insert at i.
- \`get(int i)\` — get element at i.
- \`set(int i, E e)\` — replace at i.
- \`remove(int i)\` — remove at i (returns removed element).
- \`size()\` — number of elements.
- \`contains(E e)\` — true if list has e.
- \`indexOf(E e)\` — index or -1.
- \`isEmpty()\` — true if size 0.
- \`clear()\` — remove all.`,
    },
    {
      code: '7.2',
      title: 'Iterating over ArrayList',
      content:
`**Standard for:**
\`\`\`java
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}
\`\`\`

**Enhanced for:**
\`\`\`java
for (String s : names) {
    System.out.println(s);
}
\`\`\`

**Modifying while iterating.** Tricky.

**Removing items with enhanced for** can cause errors (ConcurrentModificationException):
\`\`\`java
for (String s : names) {
    if (s.equals("Alice")) {
        names.remove(s);  // can cause exception!
    }
}
\`\`\`

**Safer: iterate backwards with index:**
\`\`\`java
for (int i = names.size() - 1; i >= 0; i--) {
    if (names.get(i).equals("Alice")) {
        names.remove(i);
    }
}
\`\`\`

**Forward iteration when removing.** When you remove at i, what was at i+1 shifts to i. So:
\`\`\`java
for (int i = 0; i < list.size(); i++) {
    if (shouldRemove(list.get(i))) {
        list.remove(i);
        i--;  // back up since indices shifted
    }
}
\`\`\`

**ArrayList<Integer> vs int[].**
- Both store ints (well, Integers vs ints).
- Array indexed with \`arr[i]\`; ArrayList with \`list.get(i)\`.
- Array \`arr.length\`; ArrayList \`list.size()\`.
- Array fixed size; ArrayList grows.
- ArrayList has built-in methods; array doesn\'t (use Arrays utility class).

**Conversion.**
Array → ArrayList:
\`\`\`java
int[] arr = {1, 2, 3};
ArrayList<Integer> list = new ArrayList<>();
for (int x : arr) list.add(x);
\`\`\`

ArrayList → Array:
\`\`\`java
ArrayList<Integer> list = ...;
int[] arr = new int[list.size()];
for (int i = 0; i < list.size(); i++) arr[i] = list.get(i);
\`\`\``,
    },
    {
      code: '7.3',
      title: 'ArrayList algorithms',
      content:
`Same patterns as arrays but with .get() and .size().

**Sum:**
\`\`\`java
int sum = 0;
for (int x : list) sum += x;
\`\`\`

**Max:**
\`\`\`java
int max = list.get(0);
for (int i = 1; i < list.size(); i++) {
    if (list.get(i) > max) max = list.get(i);
}
\`\`\`

**Linear search:**
\`\`\`java
int idx = -1;
for (int i = 0; i < list.size(); i++) {
    if (list.get(i) == target) {
        idx = i;
        break;
    }
}
// or use built-in: list.indexOf(target)
\`\`\`

**Counting:**
\`\`\`java
int count = 0;
for (int x : list) {
    if (x > 50) count++;
}
\`\`\`

**Filter (remove items matching condition):**
\`\`\`java
for (int i = list.size() - 1; i >= 0; i--) {
    if (list.get(i) < 0) {
        list.remove(i);
    }
}
\`\`\`

**Insert sorted:**
\`\`\`java
public void insertSorted(ArrayList<Integer> list, int x) {
    int i = 0;
    while (i < list.size() && list.get(i) < x) {
        i++;
    }
    list.add(i, x);
}
\`\`\`

**Reverse:**
\`\`\`java
for (int i = 0; i < list.size() / 2; i++) {
    int j = list.size() - 1 - i;
    int temp = list.get(i);
    list.set(i, list.get(j));
    list.set(j, temp);
}
\`\`\`

Or use Collections.reverse:
\`\`\`java
java.util.Collections.reverse(list);
\`\`\`

**Sort:**
\`\`\`java
java.util.Collections.sort(list);
\`\`\`

**Performance considerations.**
- Adding to end: O(1) usually.
- Adding at beginning: O(n) (everything shifts).
- Removing: O(n) (shifts elements after).
- get / set: O(1).
- contains, indexOf: O(n).

**Common AP exam tasks:**
- Process ArrayList.
- Remove items matching condition.
- Count, sum, find.
- Use ArrayList in larger algorithm.`,
    },
  ],
  keyConcepts: [
    'ArrayList: dynamic-size collection of objects.',
    'Generic syntax: ArrayList<Integer>.',
    'Stores objects only; primitives are auto-boxed via Integer, Double, etc.',
    'list.add(e), list.get(i), list.set(i, e), list.remove(i), list.size().',
    'list.size() (not .length).',
    'Enhanced for read-only; index loop for modification.',
    'Removing while iterating: go backwards, or decrement i after removal.',
    'Collections.sort, Collections.reverse utility methods.',
  ],
  practice: [
    {
      q: 'After list = [3, 7, 1] then list.add(1, 5), what\'s list?',
      a: '[3, 5, 7, 1]. add(1, 5) inserts 5 at index 1; rest shifts right.',
    },
  ],
  pitfalls: [
    '"ArrayList<int>" — no; only objects. Use ArrayList<Integer>.',
    '"Removing items with enhanced for" — risky; can throw ConcurrentModificationException.',
  ],
};
