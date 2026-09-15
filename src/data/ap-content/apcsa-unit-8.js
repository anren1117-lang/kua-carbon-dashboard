// AP CSA Unit 8 — 2D Arrays

export const APCSA_UNIT_8 = {
  number: 8,
  title: '2D Arrays',
  weight: '7.5-10%',
  subunits: [
    {
      code: '8.1',
      title: 'Creating 2D arrays',
      content:
`**2D array.** Array of arrays. Like a grid or table.

**Declaration:**
\`\`\`java
int[][] grid;
\`\`\`

**Creation:**
\`\`\`java
int[][] grid = new int[3][4];  // 3 rows, 4 cols. All zeros.
\`\`\`

**Initializer:**
\`\`\`java
int[][] grid = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};
\`\`\`

**Access:**
\`\`\`java
grid[0][0]   // 1 (row 0, col 0)
grid[1][2]   // 7 (row 1, col 2)
grid[2][3]   // 12 (last)
\`\`\`

**Dimensions:**
\`\`\`java
grid.length     // number of rows (3)
grid[0].length  // number of columns in row 0 (4)
\`\`\`

**Note:** Java\'s 2D arrays are actually arrays of arrays. Each row could theoretically have different length (jagged arrays). On AP exam usually rectangular.

**Setting values:**
\`\`\`java
grid[0][0] = 99;
grid[2][3] = 0;
\`\`\`

**Conceptual model.**
\`\`\`
        col 0  col 1  col 2  col 3
row 0   [1]   [2]   [3]   [4]
row 1   [5]   [6]   [7]   [8]
row 2   [9]   [10]  [11]  [12]
\`\`\`

\`grid[row][col]\` — row first, then column. Just like math matrix notation.`,
    },
    {
      code: '8.2',
      title: 'Iterating over 2D arrays',
      content:
`**Nested loops.**

**Row-major (most common):** outer loop rows, inner loop columns.
\`\`\`java
for (int row = 0; row < grid.length; row++) {
    for (int col = 0; col < grid[0].length; col++) {
        System.out.print(grid[row][col] + " ");
    }
    System.out.println();
}
\`\`\`

**Column-major:** outer loop columns, inner loop rows.
\`\`\`java
for (int col = 0; col < grid[0].length; col++) {
    for (int row = 0; row < grid.length; row++) {
        System.out.print(grid[row][col] + " ");
    }
    System.out.println();
}
\`\`\`

Row-major usually faster (better memory locality) but rarely matters at AP scale.

**Enhanced for:**
\`\`\`java
for (int[] row : grid) {
    for (int val : row) {
        System.out.print(val + " ");
    }
    System.out.println();
}
\`\`\`

Outer iterates over rows (each row is int[]). Inner iterates over elements.

**Use index-based when you need position; enhanced for when just values.**

**Common patterns.**

**Sum all:**
\`\`\`java
int total = 0;
for (int row = 0; row < grid.length; row++) {
    for (int col = 0; col < grid[row].length; col++) {
        total += grid[row][col];
    }
}
\`\`\`

**Sum specific row:**
\`\`\`java
int rowSum = 0;
for (int col = 0; col < grid[0].length; col++) {
    rowSum += grid[targetRow][col];
}
\`\`\`

**Sum specific column:**
\`\`\`java
int colSum = 0;
for (int row = 0; row < grid.length; row++) {
    colSum += grid[row][targetCol];
}
\`\`\`

**Find max:**
\`\`\`java
int max = grid[0][0];
for (int row = 0; row < grid.length; row++) {
    for (int col = 0; col < grid[row].length; col++) {
        if (grid[row][col] > max) {
            max = grid[row][col];
        }
    }
}
\`\`\``,
    },
    {
      code: '8.3',
      title: '2D array algorithms',
      content:
`**Diagonal traversal.**

Main diagonal (top-left to bottom-right):
\`\`\`java
for (int i = 0; i < grid.length; i++) {
    System.out.println(grid[i][i]);
}
\`\`\`

Anti-diagonal (top-right to bottom-left):
\`\`\`java
int n = grid.length;
for (int i = 0; i < n; i++) {
    System.out.println(grid[i][n - 1 - i]);
}
\`\`\`

**Transpose** (swap rows and columns):
\`\`\`java
public static int[][] transpose(int[][] grid) {
    int n = grid.length;
    int[][] result = new int[grid[0].length][n];
    for (int row = 0; row < n; row++) {
        for (int col = 0; col < grid[0].length; col++) {
            result[col][row] = grid[row][col];
        }
    }
    return result;
}
\`\`\`

**Rotate 90 degrees clockwise:**
\`\`\`java
public static int[][] rotate(int[][] grid) {
    int rows = grid.length;
    int cols = grid[0].length;
    int[][] result = new int[cols][rows];
    for (int row = 0; row < rows; row++) {
        for (int col = 0; col < cols; col++) {
            result[col][rows - 1 - row] = grid[row][col];
        }
    }
    return result;
}
\`\`\`

**Check if symmetric (square matrix):**
\`\`\`java
for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
        if (grid[i][j] != grid[j][i]) return false;
    }
}
return true;
\`\`\`

**Find neighbors.** For grid[row][col], neighbors at (row-1, col), (row+1, col), (row, col-1), (row, col+1). Check bounds.

\`\`\`java
public static boolean inBounds(int[][] grid, int row, int col) {
    return row >= 0 && row < grid.length
        && col >= 0 && col < grid[0].length;
}
\`\`\`

**Common AP tasks with 2D arrays:**
- Game boards (chess, tic-tac-toe).
- Image processing.
- Matrices.
- Tables of data.
- Pixel grids.`,
    },
  ],
  keyConcepts: [
    '2D array = array of arrays.',
    'Declare: int[][] grid = new int[rows][cols].',
    'Access: grid[row][col].',
    'Dimensions: grid.length = rows; grid[0].length = cols.',
    'Nested loop for traversal.',
    'Row-major: outer rows, inner cols.',
    'Enhanced for: for (int[] row : grid) { for (int x : row) { } }',
    'Common: sum, row/col sum, max, diagonal, transpose, rotate.',
  ],
  practice: [
    {
      q: 'For int[][] grid = new int[5][7], what\'s grid.length and grid[0].length?',
      a: 'grid.length = 5 (rows); grid[0].length = 7 (cols).',
    },
  ],
  pitfalls: [
    '"grid[row][col]" vs "grid[col][row]" — convention is [row][col]. Mixing them up flips data.',
  ],
};
