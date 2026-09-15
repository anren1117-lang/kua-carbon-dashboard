// AP CSP — inline SVG figures keyed by subunit code.

export const APCSP_FIGURES = {
  '1.1': {
    title: 'Iterative development cycle',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="100" r="32" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
      <text x="80" y="105" text-anchor="middle" font-size="11" fill="#1e3a8a">Plan</text>
      <circle cx="180" cy="100" r="32" fill="#dcfce7" stroke="#15803d" stroke-width="2"/>
      <text x="180" y="105" text-anchor="middle" font-size="11" fill="#14532d">Build</text>
      <circle cx="280" cy="100" r="32" fill="#fef3c7" stroke="#a16207" stroke-width="2"/>
      <text x="280" y="105" text-anchor="middle" font-size="11" fill="#713f12">Test</text>
      <circle cx="380" cy="100" r="20" fill="#fce7f3" stroke="#a21caf"/>
      <text x="380" y="104" text-anchor="middle" font-size="10" fill="#86198f">Iter.</text>
      <path d="M112,100 L148,100 M212,100 L248,100 M312,100 L360,100" stroke="#475569" stroke-width="2" marker-end="url(#a)"/>
      <path d="M370,80 Q230,30 90,80" stroke="#94a3b8" stroke-width="1.5" fill="none" stroke-dasharray="4 3" marker-end="url(#a)"/>
      <defs><marker id="a" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'Software iterates: plan → build → test → repeat. Rarely linear.',
  },
  '2.1': {
    title: 'Binary place values',
    svg: `<svg viewBox="0 0 400 140" xmlns="http://www.w3.org/2000/svg">
      <g font-size="14" font-family="monospace">
        <rect x="20" y="40" width="40" height="40" fill="#fef3c7" stroke="#a16207"/>
        <rect x="60" y="40" width="40" height="40" fill="#fef3c7" stroke="#a16207"/>
        <rect x="100" y="40" width="40" height="40" fill="#fef3c7" stroke="#a16207"/>
        <rect x="140" y="40" width="40" height="40" fill="#fef3c7" stroke="#a16207"/>
        <rect x="180" y="40" width="40" height="40" fill="#fef3c7" stroke="#a16207"/>
        <rect x="220" y="40" width="40" height="40" fill="#fef3c7" stroke="#a16207"/>
        <rect x="260" y="40" width="40" height="40" fill="#fef3c7" stroke="#a16207"/>
        <rect x="300" y="40" width="40" height="40" fill="#fef3c7" stroke="#a16207"/>
        <text x="40" y="66" text-anchor="middle">128</text>
        <text x="80" y="66" text-anchor="middle">64</text>
        <text x="120" y="66" text-anchor="middle">32</text>
        <text x="160" y="66" text-anchor="middle">16</text>
        <text x="200" y="66" text-anchor="middle">8</text>
        <text x="240" y="66" text-anchor="middle">4</text>
        <text x="280" y="66" text-anchor="middle">2</text>
        <text x="320" y="66" text-anchor="middle">1</text>
        <text x="40" y="100" text-anchor="middle" fill="#0c4a6e">2⁷</text>
        <text x="80" y="100" text-anchor="middle" fill="#0c4a6e">2⁶</text>
        <text x="120" y="100" text-anchor="middle" fill="#0c4a6e">2⁵</text>
        <text x="160" y="100" text-anchor="middle" fill="#0c4a6e">2⁴</text>
        <text x="200" y="100" text-anchor="middle" fill="#0c4a6e">2³</text>
        <text x="240" y="100" text-anchor="middle" fill="#0c4a6e">2²</text>
        <text x="280" y="100" text-anchor="middle" fill="#0c4a6e">2¹</text>
        <text x="320" y="100" text-anchor="middle" fill="#0c4a6e">2⁰</text>
      </g>
      <text x="200" y="20" text-anchor="middle" font-size="13" fill="#1e3a8a">8-bit byte — place values</text>
    </svg>`,
    caption: '8 bits = 1 byte. Place values are powers of 2.',
  },
  '2.3': {
    title: 'Lossy vs lossless compression',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="22" text-anchor="middle" font-size="13" fill="#14532d" font-weight="bold">Lossless</text>
      <rect x="40" y="40" width="120" height="50" fill="#dcfce7" stroke="#15803d"/>
      <text x="100" y="70" text-anchor="middle" font-size="12">orig 100KB</text>
      <path d="M100,90 L100,110" stroke="#475569" stroke-width="2" marker-end="url(#b)"/>
      <rect x="40" y="110" width="120" height="50" fill="#bbf7d0" stroke="#15803d"/>
      <text x="100" y="140" text-anchor="middle" font-size="12">→ 60KB</text>
      <text x="100" y="180" text-anchor="middle" font-size="10" fill="#475569">decompress = exact</text>

      <text x="300" y="22" text-anchor="middle" font-size="13" fill="#7c2d12" font-weight="bold">Lossy</text>
      <rect x="240" y="40" width="120" height="50" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="300" y="70" text-anchor="middle" font-size="12">orig 100KB</text>
      <path d="M300,90 L300,110" stroke="#475569" stroke-width="2" marker-end="url(#b)"/>
      <rect x="240" y="110" width="120" height="50" fill="#fecaca" stroke="#b91c1c"/>
      <text x="300" y="140" text-anchor="middle" font-size="12">→ 8KB</text>
      <text x="300" y="180" text-anchor="middle" font-size="10" fill="#475569">decompress ≈ approx</text>
      <defs><marker id="b" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'Lossless: smaller, exact. Lossy: much smaller, some info gone.',
  },
  '3.4': {
    title: 'For loop trace',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="20" text-anchor="middle" font-size="13" fill="#1e3a8a" font-weight="bold">for i in range(4):  print(i)</text>
      <g font-family="monospace" font-size="14">
        <rect x="50" y="50" width="60" height="40" fill="#dbeafe" stroke="#1e40af"/>
        <text x="80" y="76" text-anchor="middle">i=0</text>
        <rect x="130" y="50" width="60" height="40" fill="#dbeafe" stroke="#1e40af"/>
        <text x="160" y="76" text-anchor="middle">i=1</text>
        <rect x="210" y="50" width="60" height="40" fill="#dbeafe" stroke="#1e40af"/>
        <text x="240" y="76" text-anchor="middle">i=2</text>
        <rect x="290" y="50" width="60" height="40" fill="#dbeafe" stroke="#1e40af"/>
        <text x="320" y="76" text-anchor="middle">i=3</text>
        <text x="80" y="120" text-anchor="middle" fill="#15803d">print 0</text>
        <text x="160" y="120" text-anchor="middle" fill="#15803d">print 1</text>
        <text x="240" y="120" text-anchor="middle" fill="#15803d">print 2</text>
        <text x="320" y="120" text-anchor="middle" fill="#15803d">print 3</text>
      </g>
      <text x="200" y="170" text-anchor="middle" font-size="11" fill="#7c2d12">range(4) gives 0..3, not 1..4</text>
    </svg>`,
    caption: 'range(n) starts at 0, stops before n. Off-by-one is the most common loop bug.',
  },
  '3.7': {
    title: 'Linear vs binary search',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="20" text-anchor="middle" font-size="13" fill="#1e3a8a" font-weight="bold">find 7 in [1,3,5,7,9,11,13,15]</text>
      <text x="100" y="50" text-anchor="middle" font-size="12" fill="#7c2d12" font-weight="bold">Linear: 4 steps</text>
      <g font-size="11" font-family="monospace">
        <rect x="30" y="60" width="20" height="20" fill="#fecaca"/><text x="40" y="74" text-anchor="middle">1</text>
        <rect x="50" y="60" width="20" height="20" fill="#fecaca"/><text x="60" y="74" text-anchor="middle">3</text>
        <rect x="70" y="60" width="20" height="20" fill="#fecaca"/><text x="80" y="74" text-anchor="middle">5</text>
        <rect x="90" y="60" width="20" height="20" fill="#bbf7d0"/><text x="100" y="74" text-anchor="middle">7</text>
        <rect x="110" y="60" width="20" height="20" fill="#f1f5f9"/><text x="120" y="74" text-anchor="middle">9</text>
        <rect x="130" y="60" width="20" height="20" fill="#f1f5f9"/><text x="140" y="74" text-anchor="middle">11</text>
        <rect x="150" y="60" width="20" height="20" fill="#f1f5f9"/><text x="160" y="74" text-anchor="middle">13</text>
        <rect x="170" y="60" width="20" height="20" fill="#f1f5f9"/><text x="180" y="74" text-anchor="middle">15</text>
      </g>
      <text x="300" y="50" text-anchor="middle" font-size="12" fill="#14532d" font-weight="bold">Binary: 2 steps</text>
      <g font-size="11" font-family="monospace">
        <rect x="220" y="60" width="20" height="20" fill="#f1f5f9"/><text x="230" y="74" text-anchor="middle">1</text>
        <rect x="240" y="60" width="20" height="20" fill="#f1f5f9"/><text x="250" y="74" text-anchor="middle">3</text>
        <rect x="260" y="60" width="20" height="20" fill="#f1f5f9"/><text x="270" y="74" text-anchor="middle">5</text>
        <rect x="280" y="60" width="20" height="20" fill="#bbf7d0"/><text x="290" y="74" text-anchor="middle">7</text>
        <rect x="300" y="60" width="20" height="20" fill="#fecaca"/><text x="310" y="74" text-anchor="middle">9</text>
        <rect x="320" y="60" width="20" height="20" fill="#f1f5f9"/><text x="330" y="74" text-anchor="middle">11</text>
        <rect x="340" y="60" width="20" height="20" fill="#f1f5f9"/><text x="350" y="74" text-anchor="middle">13</text>
        <rect x="360" y="60" width="20" height="20" fill="#f1f5f9"/><text x="370" y="74" text-anchor="middle">15</text>
      </g>
      <text x="200" y="120" text-anchor="middle" font-size="12" fill="#475569">For 1M items: linear ≈ 1M; binary ≈ 20</text>
      <text x="200" y="160" text-anchor="middle" font-size="11" fill="#7c2d12">Binary needs sorted input</text>
    </svg>`,
    caption: 'Binary search is exponentially faster — but only on sorted data.',
  },
  '4.1': {
    title: 'Packet switching',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="100" r="22" fill="#dbeafe" stroke="#1e40af"/>
      <text x="40" y="105" text-anchor="middle" font-size="11">A</text>
      <circle cx="360" cy="100" r="22" fill="#dcfce7" stroke="#15803d"/>
      <text x="360" y="105" text-anchor="middle" font-size="11">B</text>
      <circle cx="140" cy="40" r="14" fill="#f1f5f9" stroke="#475569"/>
      <circle cx="200" cy="100" r="14" fill="#f1f5f9" stroke="#475569"/>
      <circle cx="140" cy="160" r="14" fill="#f1f5f9" stroke="#475569"/>
      <circle cx="260" cy="40" r="14" fill="#f1f5f9" stroke="#475569"/>
      <circle cx="260" cy="160" r="14" fill="#f1f5f9" stroke="#475569"/>
      <path d="M62,90 L126,46 M154,46 L246,46 M274,46 L338,90" stroke="#b91c1c" stroke-width="2" fill="none"/>
      <path d="M62,100 L186,100 M214,100 L338,100" stroke="#1e40af" stroke-width="2" fill="none"/>
      <path d="M62,110 L126,154 M154,154 L246,154 M274,154 L338,110" stroke="#15803d" stroke-width="2" fill="none"/>
      <text x="200" y="190" text-anchor="middle" font-size="11" fill="#475569">3 packets, 3 routes, reassemble at B</text>
    </svg>`,
    caption: 'Packets take independent paths and are reassembled at the destination.',
  },
  '4.2': {
    title: 'DNS lookup',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="80" width="100" height="40" rx="6" fill="#dbeafe" stroke="#1e40af"/>
      <text x="70" y="105" text-anchor="middle" font-size="12">Browser</text>
      <rect x="160" y="80" width="100" height="40" rx="6" fill="#fef3c7" stroke="#a16207"/>
      <text x="210" y="105" text-anchor="middle" font-size="12">DNS server</text>
      <rect x="300" y="80" width="80" height="40" rx="6" fill="#dcfce7" stroke="#15803d"/>
      <text x="340" y="105" text-anchor="middle" font-size="12">Web server</text>
      <path d="M120,95 L156,95" stroke="#475569" stroke-width="2" marker-end="url(#c)"/>
      <text x="138" y="85" text-anchor="middle" font-size="9">google.com?</text>
      <path d="M156,108 L120,108" stroke="#475569" stroke-width="2" marker-end="url(#c)"/>
      <text x="138" y="125" text-anchor="middle" font-size="9">142.250.x.x</text>
      <path d="M120,140 Q230,170 300,140" stroke="#1e40af" stroke-width="2" fill="none" marker-end="url(#c)"/>
      <text x="210" y="180" text-anchor="middle" font-size="10" fill="#1e3a8a">Then connect by IP</text>
      <defs><marker id="c" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'DNS translates domain names to IP addresses, then the browser connects to the IP.',
  },
  '5.1': {
    title: 'Algorithmic bias loop',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="80" width="100" height="40" rx="6" fill="#fef3c7" stroke="#a16207"/>
      <text x="70" y="105" text-anchor="middle" font-size="11">Biased history</text>
      <rect x="160" y="80" width="100" height="40" rx="6" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="210" y="105" text-anchor="middle" font-size="11">Training data</text>
      <rect x="300" y="80" width="80" height="40" rx="6" fill="#fecaca" stroke="#b91c1c"/>
      <text x="340" y="105" text-anchor="middle" font-size="11">Model</text>
      <path d="M120,100 L156,100" stroke="#475569" stroke-width="2" marker-end="url(#d)"/>
      <path d="M260,100 L296,100" stroke="#475569" stroke-width="2" marker-end="url(#d)"/>
      <path d="M340,80 Q230,20 70,80" stroke="#a21caf" stroke-width="1.5" fill="none" stroke-dasharray="4 3" marker-end="url(#d)"/>
      <text x="210" y="40" text-anchor="middle" font-size="11" fill="#86198f">Model decisions reshape history</text>
      <defs><marker id="d" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'Algorithms learn from data that reflects past bias, then reinforce it through their decisions.',
  },
  '5.4': {
    title: 'Symmetric vs public-key encryption',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="22" text-anchor="middle" font-size="12" fill="#14532d" font-weight="bold">Symmetric (AES)</text>
      <rect x="30" y="40" width="140" height="120" fill="#dcfce7" stroke="#15803d"/>
      <text x="100" y="80" text-anchor="middle" font-size="11">Same key</text>
      <text x="100" y="100" text-anchor="middle" font-size="11">encrypts &</text>
      <text x="100" y="120" text-anchor="middle" font-size="11">decrypts</text>
      <text x="100" y="150" text-anchor="middle" font-size="10" fill="#475569">Fast; share secret</text>

      <text x="300" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Public-key (RSA)</text>
      <rect x="230" y="40" width="140" height="120" fill="#dbeafe" stroke="#1e40af"/>
      <text x="300" y="70" text-anchor="middle" font-size="11">Public key</text>
      <text x="300" y="88" text-anchor="middle" font-size="11">encrypts</text>
      <text x="300" y="118" text-anchor="middle" font-size="11">Private key</text>
      <text x="300" y="136" text-anchor="middle" font-size="11">decrypts</text>
      <text x="300" y="158" text-anchor="middle" font-size="10" fill="#475569">No shared secret needed</text>

      <text x="200" y="200" text-anchor="middle" font-size="11" fill="#475569">HTTPS uses both: public-key to exchange a symmetric key</text>
    </svg>`,
    caption: 'Public-key cryptography solves the problem of how to share a secret over an insecure channel.',
  },
};
