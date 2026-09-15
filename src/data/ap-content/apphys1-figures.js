// AP Physics 1 — inline SVG figures.

export const APPHYS1_FIGURES = {
  '1.4': {
    title: 'Projectile motion',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="190" x2="380" y2="190" stroke="#475569" stroke-width="2"/>
      <path d="M40,190 Q200,30 360,190" stroke="#1e40af" stroke-width="2.5" fill="none"/>
      <circle cx="40" cy="190" r="5" fill="#1e40af"/>
      <circle cx="120" cy="105" r="4" fill="#1e40af"/>
      <circle cx="200" cy="60" r="4" fill="#1e40af"/>
      <circle cx="280" cy="105" r="4" fill="#1e40af"/>
      <circle cx="360" cy="190" r="5" fill="#1e40af"/>
      <line x1="200" y1="60" x2="200" y2="40" stroke="#b91c1c" stroke-width="2" marker-end="url(#p)"/>
      <text x="208" y="35" font-size="10" fill="#7c2d12">v_x</text>
      <text x="200" y="80" text-anchor="middle" font-size="10" fill="#7c2d12">v_y = 0 at peak</text>
      <text x="50" y="160" font-size="10" fill="#1e3a8a">v_0 at θ</text>
      <text x="200" y="210" text-anchor="middle" font-size="11" fill="#475569">Range R = v_0²sin(2θ)/g — max at 45°</text>
      <defs><marker id="p" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#b91c1c"/></marker></defs>
    </svg>`,
    caption: 'Horizontal velocity constant; vertical changes under gravity. At peak only v_y = 0.',
  },
  '2.1': {
    title: 'Free-body diagram — block on incline',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="180" x2="340" y2="60" stroke="#475569" stroke-width="2"/>
      <line x1="40" y1="180" x2="340" y2="180" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 3"/>
      <rect x="170" y="100" width="50" height="35" transform="rotate(-22 195 117)" fill="#dbeafe" stroke="#1e40af"/>
      <line x1="195" y1="117" x2="195" y2="180" stroke="#b91c1c" stroke-width="2" marker-end="url(#fb)"/>
      <text x="200" y="160" font-size="10" fill="#7c2d12">mg</text>
      <line x1="195" y1="117" x2="170" y2="55" stroke="#15803d" stroke-width="2" marker-end="url(#fb)"/>
      <text x="142" y="50" font-size="10" fill="#14532d">N</text>
      <line x1="195" y1="117" x2="240" y2="135" stroke="#a16207" stroke-width="2" marker-end="url(#fb)"/>
      <text x="248" y="140" font-size="10" fill="#7c2d12">f (friction)</text>
      <text x="60" y="195" font-size="10" fill="#475569">θ</text>
      <defs><marker id="fb" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'Always draw all forces from object center. Tilt axes to align with surface.',
  },
  '3.4': {
    title: 'Energy conservation — pendulum',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="200" y1="20" x2="80" y2="160" stroke="#475569" stroke-width="2"/>
      <line x1="200" y1="20" x2="200" y2="160" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="200" y1="20" x2="320" y2="160" stroke="#475569" stroke-width="2"/>
      <circle cx="80" cy="160" r="12" fill="#fef3c7" stroke="#a16207"/>
      <circle cx="200" cy="160" r="12" fill="#dbeafe" stroke="#1e40af"/>
      <circle cx="320" cy="160" r="12" fill="#fef3c7" stroke="#a16207"/>
      <text x="80" y="195" text-anchor="middle" font-size="10" fill="#7c2d12">PE max</text>
      <text x="80" y="208" text-anchor="middle" font-size="10" fill="#7c2d12">KE = 0</text>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#1e3a8a">KE max</text>
      <text x="200" y="208" text-anchor="middle" font-size="10" fill="#1e3a8a">PE = 0</text>
      <text x="320" y="195" text-anchor="middle" font-size="10" fill="#7c2d12">PE max</text>
      <text x="320" y="208" text-anchor="middle" font-size="10" fill="#7c2d12">KE = 0</text>
    </svg>`,
    caption: 'KE + PE = constant throughout swing (no friction).',
  },
  '4.3': {
    title: 'Perfectly inelastic collision',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="20" text-anchor="middle" font-size="12" fill="#475569" font-weight="bold">Before</text>
      <circle cx="80" cy="60" r="18" fill="#dbeafe" stroke="#1e40af"/>
      <text x="80" y="65" text-anchor="middle" font-size="11">2kg</text>
      <line x1="98" y1="60" x2="130" y2="60" stroke="#1e40af" stroke-width="2" marker-end="url(#k)"/>
      <text x="115" y="50" font-size="10" fill="#1e3a8a">4 m/s</text>
      <circle cx="200" cy="60" r="22" fill="#dcfce7" stroke="#15803d"/>
      <text x="200" y="65" text-anchor="middle" font-size="11">3kg</text>
      <text x="200" y="100" text-anchor="middle" font-size="10" fill="#475569">at rest</text>
      <text x="200" y="130" text-anchor="middle" font-size="12" fill="#475569" font-weight="bold">After (stuck)</text>
      <circle cx="200" cy="160" r="26" fill="#fef3c7" stroke="#a16207"/>
      <text x="200" y="165" text-anchor="middle" font-size="11">5kg</text>
      <line x1="226" y1="160" x2="270" y2="160" stroke="#a16207" stroke-width="2" marker-end="url(#k)"/>
      <text x="248" y="150" font-size="10" fill="#713f12">1.6 m/s</text>
      <defs><marker id="k" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'Momentum conserved; KE lost. v_f = (m_1v_1 + m_2v_2)/(m_1+m_2).',
  },
  '5.4': {
    title: 'Moments of inertia',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="40" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
      <circle cx="80" cy="80" r="3" fill="#1e40af"/>
      <text x="80" y="140" text-anchor="middle" font-size="11">Solid sphere</text>
      <text x="80" y="156" text-anchor="middle" font-size="11" fill="#1e3a8a">I = (2/5)MR²</text>

      <circle cx="200" cy="80" r="40" fill="none" stroke="#15803d" stroke-width="6"/>
      <circle cx="200" cy="80" r="3" fill="#15803d"/>
      <text x="200" y="140" text-anchor="middle" font-size="11">Hoop</text>
      <text x="200" y="156" text-anchor="middle" font-size="11" fill="#14532d">I = MR²</text>

      <circle cx="320" cy="80" r="40" fill="#fef3c7" stroke="#a16207" stroke-width="2"/>
      <circle cx="320" cy="80" r="3" fill="#a16207"/>
      <text x="320" y="140" text-anchor="middle" font-size="11">Solid disk</text>
      <text x="320" y="156" text-anchor="middle" font-size="11" fill="#713f12">I = ½MR²</text>

      <text x="200" y="195" text-anchor="middle" font-size="11" fill="#475569">Race down ramp: sphere &gt; disk &gt; hoop (smaller I/MR² wins)</text>
    </svg>`,
    caption: 'I depends on distribution of mass relative to axis, not total mass alone.',
  },
  '6.3': {
    title: 'Simple harmonic motion',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="110" x2="380" y2="110" stroke="#94a3b8" stroke-width="1"/>
      <path d="M20,110 Q60,30 100,110 T180,110 T260,110 T340,110" stroke="#1e40af" stroke-width="2.5" fill="none"/>
      <circle cx="60" cy="50" r="4" fill="#b91c1c"/>
      <circle cx="100" cy="110" r="4" fill="#15803d"/>
      <circle cx="140" cy="170" r="4" fill="#b91c1c"/>
      <text x="60" y="40" text-anchor="middle" font-size="10" fill="#7c2d12">v=0, a max</text>
      <text x="105" y="100" font-size="10" fill="#14532d">v max, a=0</text>
      <text x="140" y="190" text-anchor="middle" font-size="10" fill="#7c2d12">v=0, a max</text>
      <text x="200" y="210" text-anchor="middle" font-size="11" fill="#475569">x(t) = A·cos(ωt);   ω = √(k/m)</text>
    </svg>`,
    caption: 'At extremes: zero velocity, max acceleration. At center: max velocity, zero acceleration.',
  },
  '7.2': {
    title: 'Archimedes — floating fraction',
    svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="60" width="320" height="140" fill="#dbeafe" stroke="#1e40af"/>
      <line x1="40" y1="100" x2="360" y2="100" stroke="#1e40af" stroke-width="1.5"/>
      <text x="50" y="120" font-size="10" fill="#1e3a8a">water</text>
      <rect x="100" y="85" width="60" height="50" fill="#fef3c7" stroke="#a16207"/>
      <text x="130" y="80" text-anchor="middle" font-size="10" fill="#713f12">ρ_obj/ρ_water = 60%</text>
      <text x="130" y="155" text-anchor="middle" font-size="11" fill="#7c2d12">60% submerged</text>
      <rect x="260" y="95" width="60" height="40" fill="#fde68a" stroke="#a16207"/>
      <text x="290" y="90" text-anchor="middle" font-size="10" fill="#713f12">denser → more under</text>
      <text x="290" y="155" text-anchor="middle" font-size="11" fill="#7c2d12">heavier object</text>
    </svg>`,
    caption: 'Fraction submerged = ρ_object / ρ_fluid.',
  },
  '8.1': {
    title: 'Wave anatomy',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="100" x2="380" y2="100" stroke="#94a3b8" stroke-width="1"/>
      <path d="M20,100 Q60,30 100,100 T180,100 T260,100 T340,100" stroke="#1e40af" stroke-width="2.5" fill="none"/>
      <line x1="60" y1="40" x2="60" y2="100" stroke="#b91c1c" stroke-width="1" stroke-dasharray="3 2"/>
      <text x="50" y="35" font-size="10" fill="#7c2d12">A</text>
      <line x1="60" y1="170" x2="140" y2="170" stroke="#15803d" stroke-width="1.5"/>
      <line x1="60" y1="165" x2="60" y2="175" stroke="#15803d"/>
      <line x1="140" y1="165" x2="140" y2="175" stroke="#15803d"/>
      <text x="100" y="185" text-anchor="middle" font-size="10" fill="#14532d">λ (wavelength)</text>
      <text x="200" y="195" text-anchor="middle" font-size="11" fill="#475569">v = fλ;  frequency = cycles/sec; amplitude = max displacement</text>
    </svg>`,
    caption: 'A wave is characterized by amplitude, wavelength, frequency, and speed.',
  },
  '8.4': {
    title: "Coulomb's law",
    svg: `<svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="90" r="22" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="100" y="95" text-anchor="middle" font-size="13" fill="#7c2d12">+q₁</text>
      <circle cx="300" cy="90" r="22" fill="#dbeafe" stroke="#1e40af"/>
      <text x="300" y="95" text-anchor="middle" font-size="13" fill="#1e3a8a">−q₂</text>
      <line x1="122" y1="90" x2="278" y2="90" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="200" y="80" text-anchor="middle" font-size="11" fill="#475569">r</text>
      <line x1="125" y1="115" x2="180" y2="115" stroke="#b91c1c" stroke-width="2" marker-end="url(#cb)"/>
      <line x1="275" y1="115" x2="220" y2="115" stroke="#1e40af" stroke-width="2" marker-end="url(#cb)"/>
      <text x="200" y="130" text-anchor="middle" font-size="11" fill="#475569">F = k·q₁·q₂/r² — opposites attract</text>
      <text x="200" y="160" text-anchor="middle" font-size="11" fill="#475569">Inverse-square law (same form as gravity)</text>
      <defs><marker id="cb" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'Force inversely proportional to distance squared; same form as gravity but can be repulsive.',
  },
};
