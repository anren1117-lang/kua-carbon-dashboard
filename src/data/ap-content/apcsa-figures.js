// AP CSA — inline SVG diagrams.

export const APCSA_FIGURES = {
  '1.3': {
    title: 'Integer division and modulo',
    svg: `<svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="13" fill="#1e3a8a" font-weight="bold">17 ÷ 5</text>
      <g font-size="13" font-family="monospace">
        <rect x="60" y="40" width="280" height="50" fill="#dbeafe" stroke="#1e40af"/>
        <text x="200" y="62" text-anchor="middle">17 / 5 = 3</text>
        <text x="200" y="80" text-anchor="middle" font-size="10" fill="#475569">(integer division — truncated)</text>
        <rect x="60" y="100" width="280" height="50" fill="#dcfce7" stroke="#15803d"/>
        <text x="200" y="122" text-anchor="middle">17 % 5 = 2</text>
        <text x="200" y="140" text-anchor="middle" font-size="10" fill="#475569">(remainder)</text>
      </g>
    </svg>`,
    caption: '/ gives quotient (truncated); % gives remainder. Both essential.',
  },
  '2.2': {
    title: 'String methods',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" font-family="monospace" font-weight="bold">String s = "Hello, world!";</text>
      <g font-size="11" font-family="monospace">
        <rect x="20" y="40" width="170" height="28" fill="#fef3c7" stroke="#a16207"/>
        <text x="105" y="58" text-anchor="middle">s.length() → 13</text>
        <rect x="210" y="40" width="170" height="28" fill="#fef3c7" stroke="#a16207"/>
        <text x="295" y="58" text-anchor="middle">s.substring(7, 12) → "world"</text>
        <rect x="20" y="78" width="170" height="28" fill="#fef3c7" stroke="#a16207"/>
        <text x="105" y="96" text-anchor="middle">s.indexOf("world") → 7</text>
        <rect x="210" y="78" width="170" height="28" fill="#fef3c7" stroke="#a16207"/>
        <text x="295" y="96" text-anchor="middle">s.indexOf("X") → -1</text>
        <rect x="20" y="116" width="170" height="28" fill="#dcfce7" stroke="#15803d"/>
        <text x="105" y="134" text-anchor="middle">s.equals("Hello, world!")</text>
        <rect x="210" y="116" width="170" height="28" fill="#dcfce7" stroke="#15803d"/>
        <text x="295" y="134" text-anchor="middle">→ true</text>
      </g>
      <text x="200" y="180" text-anchor="middle" font-size="10" fill="#475569">Strings are IMMUTABLE — methods return new strings.</text>
    </svg>`,
    caption: 'Common String operations. substring(start, end) — end is exclusive.',
  },
  '4.4': {
    title: 'Big O complexity',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="180" x2="380" y2="180" stroke="#475569"/>
      <line x1="40" y1="180" x2="40" y2="20" stroke="#475569"/>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#475569">input size n →</text>
      <text x="15" y="100" font-size="10" fill="#475569" transform="rotate(-90 15 100)">time</text>
      <path d="M40,170 L380,170" stroke="#15803d" stroke-width="2" fill="none"/>
      <text x="385" y="170" font-size="10" fill="#15803d">O(1)</text>
      <path d="M40,170 Q200,160 380,150" stroke="#1e40af" stroke-width="2" fill="none"/>
      <text x="385" y="150" font-size="10" fill="#1e3a8a">O(log n)</text>
      <path d="M40,170 L380,100" stroke="#a16207" stroke-width="2" fill="none"/>
      <text x="385" y="100" font-size="10" fill="#a16207">O(n)</text>
      <path d="M40,170 Q280,60 380,50" stroke="#c2410c" stroke-width="2" fill="none"/>
      <text x="385" y="50" font-size="10" fill="#7c2d12">O(n log n)</text>
      <path d="M40,170 Q260,170 380,30" stroke="#b91c1c" stroke-width="2" fill="none"/>
      <text x="385" y="25" font-size="10" fill="#7c2d12">O(n²)</text>
    </svg>`,
    caption: 'How runtime scales with input size. Lower (slower-growing) is better.',
  },
  '6.1': {
    title: 'Array indexing',
    svg: `<svg viewBox="0 0 400 140" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">int[] arr = {10, 20, 30, 40, 50};</text>
      <g font-size="13" font-family="monospace">
        <rect x="30" y="50" width="60" height="40" fill="#dbeafe" stroke="#1e40af"/>
        <text x="60" y="75" text-anchor="middle">10</text>
        <rect x="90" y="50" width="60" height="40" fill="#dbeafe" stroke="#1e40af"/>
        <text x="120" y="75" text-anchor="middle">20</text>
        <rect x="150" y="50" width="60" height="40" fill="#dbeafe" stroke="#1e40af"/>
        <text x="180" y="75" text-anchor="middle">30</text>
        <rect x="210" y="50" width="60" height="40" fill="#dbeafe" stroke="#1e40af"/>
        <text x="240" y="75" text-anchor="middle">40</text>
        <rect x="270" y="50" width="60" height="40" fill="#dbeafe" stroke="#1e40af"/>
        <text x="300" y="75" text-anchor="middle">50</text>
      </g>
      <g font-size="11" font-family="monospace" fill="#475569">
        <text x="60" y="110" text-anchor="middle">[0]</text>
        <text x="120" y="110" text-anchor="middle">[1]</text>
        <text x="180" y="110" text-anchor="middle">[2]</text>
        <text x="240" y="110" text-anchor="middle">[3]</text>
        <text x="300" y="110" text-anchor="middle">[4]</text>
      </g>
      <text x="200" y="135" text-anchor="middle" font-size="10" fill="#7c2d12">arr.length = 5 ⟹ last index is arr.length-1 = 4</text>
    </svg>`,
    caption: 'Arrays are zero-indexed. Last valid index = length - 1.',
  },
  '8.1': {
    title: '2D array indexing',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="11" font-family="monospace">int[][] grid = new int[3][4];</text>
      <g font-size="11" font-family="monospace">
        <text x="105" y="50" text-anchor="middle" fill="#475569">[0]</text>
        <text x="155" y="50" text-anchor="middle" fill="#475569">[1]</text>
        <text x="205" y="50" text-anchor="middle" fill="#475569">[2]</text>
        <text x="255" y="50" text-anchor="middle" fill="#475569">[3]</text>
        <text x="60" y="78" text-anchor="middle" fill="#475569">[0]</text>
        <text x="60" y="118" text-anchor="middle" fill="#475569">[1]</text>
        <text x="60" y="158" text-anchor="middle" fill="#475569">[2]</text>
      </g>
      <g font-family="monospace" font-size="11">
        <rect x="85" y="60" width="50" height="35" fill="#dbeafe" stroke="#1e40af"/>
        <rect x="135" y="60" width="50" height="35" fill="#dbeafe" stroke="#1e40af"/>
        <rect x="185" y="60" width="50" height="35" fill="#dbeafe" stroke="#1e40af"/>
        <rect x="235" y="60" width="50" height="35" fill="#dbeafe" stroke="#1e40af"/>
        <rect x="85" y="100" width="50" height="35" fill="#dcfce7" stroke="#15803d"/>
        <rect x="135" y="100" width="50" height="35" fill="#dcfce7" stroke="#15803d"/>
        <rect x="185" y="100" width="50" height="35" fill="#dcfce7" stroke="#15803d"/>
        <rect x="235" y="100" width="50" height="35" fill="#dcfce7" stroke="#15803d"/>
        <rect x="85" y="140" width="50" height="35" fill="#fef3c7" stroke="#a16207"/>
        <rect x="135" y="140" width="50" height="35" fill="#fef3c7" stroke="#a16207"/>
        <rect x="185" y="140" width="50" height="35" fill="#fef3c7" stroke="#a16207"/>
        <rect x="235" y="140" width="50" height="35" fill="#fef3c7" stroke="#a16207"/>
      </g>
      <text x="200" y="200" text-anchor="middle" font-size="11" fill="#475569">grid.length = 3 (rows);  grid[0].length = 4 (cols)</text>
      <text x="200" y="215" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="bold">grid[row][col]</text>
    </svg>`,
    caption: '2D arrays are arrays of arrays. Access with grid[row][col].',
  },
  '9.1': {
    title: 'Inheritance hierarchy',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="150" y="20" width="100" height="35" fill="#dbeafe" stroke="#1e40af"/>
      <text x="200" y="42" text-anchor="middle" font-size="11" font-weight="bold">Animal</text>
      <line x1="200" y1="55" x2="200" y2="80" stroke="#475569" stroke-width="2"/>
      <line x1="100" y1="80" x2="300" y2="80" stroke="#475569" stroke-width="2"/>
      <line x1="100" y1="80" x2="100" y2="105" stroke="#475569" stroke-width="2" marker-end="url(#h)"/>
      <line x1="200" y1="80" x2="200" y2="105" stroke="#475569" stroke-width="2" marker-end="url(#h)"/>
      <line x1="300" y1="80" x2="300" y2="105" stroke="#475569" stroke-width="2" marker-end="url(#h)"/>
      <rect x="60" y="105" width="80" height="30" fill="#dcfce7" stroke="#15803d"/>
      <text x="100" y="125" text-anchor="middle" font-size="11">Dog</text>
      <rect x="160" y="105" width="80" height="30" fill="#dcfce7" stroke="#15803d"/>
      <text x="200" y="125" text-anchor="middle" font-size="11">Cat</text>
      <rect x="260" y="105" width="80" height="30" fill="#dcfce7" stroke="#15803d"/>
      <text x="300" y="125" text-anchor="middle" font-size="11">Bird</text>
      <text x="200" y="160" text-anchor="middle" font-size="10" fill="#475569">Subclasses inherit fields and methods from Animal,</text>
      <text x="200" y="175" text-anchor="middle" font-size="10" fill="#475569">add their own, may override.</text>
      <defs><marker id="h" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'Subclasses inherit from superclass. "is-a" relationship.',
  },
  '10.1': {
    title: 'Recursion call stack',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="22" text-anchor="middle" font-size="12" font-family="monospace" fill="#1e3a8a" font-weight="bold">factorial(4)</text>
      <g font-size="11" font-family="monospace">
        <rect x="80" y="40" width="240" height="25" fill="#dbeafe" stroke="#1e40af"/>
        <text x="200" y="58" text-anchor="middle">factorial(4) → 4 * factorial(3)</text>
        <rect x="80" y="70" width="240" height="25" fill="#dbeafe" stroke="#1e40af"/>
        <text x="200" y="88" text-anchor="middle">factorial(3) → 3 * factorial(2)</text>
        <rect x="80" y="100" width="240" height="25" fill="#dbeafe" stroke="#1e40af"/>
        <text x="200" y="118" text-anchor="middle">factorial(2) → 2 * factorial(1)</text>
        <rect x="80" y="130" width="240" height="25" fill="#dcfce7" stroke="#15803d"/>
        <text x="200" y="148" text-anchor="middle">factorial(1) → 1 (BASE CASE)</text>
      </g>
      <text x="200" y="180" text-anchor="middle" font-size="11" fill="#7c2d12">Unwinds: 2*1 = 2, 3*2 = 6, 4*6 = 24</text>
      <text x="200" y="200" text-anchor="middle" font-size="11" fill="#475569">Each call adds a frame to the stack.</text>
    </svg>`,
    caption: 'Recursive calls stack up; base case stops; values return back up.',
  },
};
