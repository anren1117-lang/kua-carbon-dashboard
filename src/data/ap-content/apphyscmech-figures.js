// AP Physics C: Mechanics — inline SVG figures.

export const APPHYSCMECH_FIGURES = {
  '2.2': {
    title: 'Falling with drag',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="170" x2="380" y2="170" stroke="#475569"/>
      <line x1="40" y1="170" x2="40" y2="20" stroke="#475569"/>
      <path d="M40,170 Q60,150 80,110 Q150,40 380,30" stroke="#1e40af" stroke-width="2.5" fill="none"/>
      <line x1="80" y1="30" x2="380" y2="30" stroke="#b91c1c" stroke-width="1" stroke-dasharray="3 3"/>
      <text x="385" y="30" font-size="10" fill="#7c2d12">v_t</text>
      <text x="200" y="125" font-size="10" fill="#1e3a8a">v(t) = v_t(1 − e^(−bt/m))</text>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#475569">Velocity asymptotes to terminal velocity</text>
    </svg>`,
    caption: 'With linear drag, an object falling reaches a terminal velocity where drag balances gravity.',
  },
  '6.1': {
    title: 'SHM x, v, a',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="40" x2="380" y2="40" stroke="#94a3b8"/>
      <path d="M40,40 Q80,-30 120,40 Q160,110 200,40 Q240,-30 280,40 Q320,110 360,40" stroke="#1e40af" stroke-width="2" fill="none"/>
      <text x="375" y="44" font-size="10" fill="#1e3a8a">x</text>
      <line x1="40" y1="110" x2="380" y2="110" stroke="#94a3b8"/>
      <path d="M40,110 Q80,150 120,110 Q160,70 200,110 Q240,150 280,110 Q320,70 360,110" stroke="#15803d" stroke-width="2" fill="none"/>
      <text x="375" y="114" font-size="10" fill="#14532d">v</text>
      <line x1="40" y1="180" x2="380" y2="180" stroke="#94a3b8"/>
      <path d="M40,180 Q80,110 120,180 Q160,250 200,180 Q240,110 280,180 Q320,250 360,180" stroke="#b91c1c" stroke-width="2" fill="none"/>
      <text x="375" y="184" font-size="10" fill="#7c2d12">a</text>
      <text x="200" y="20" text-anchor="middle" font-size="11" fill="#475569">SHM: x, v, a all sinusoidal — phases of 0, π/2, π</text>
    </svg>`,
    caption: 'Position, velocity, and acceleration in SHM are sinusoidal with quarter-period phase shifts.',
  },
};
