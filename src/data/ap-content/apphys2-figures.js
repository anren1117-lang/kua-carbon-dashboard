// AP Physics 2 — inline SVG figures.

export const APPHYS2_FIGURES = {
  '1.2': {
    title: 'Archimedes buoyancy',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="60" width="320" height="120" fill="#dbeafe" stroke="#1e40af"/>
      <line x1="40" y1="100" x2="360" y2="100" stroke="#1e40af"/>
      <rect x="160" y="80" width="80" height="60" fill="#fef3c7" stroke="#a16207"/>
      <line x1="200" y1="100" x2="200" y2="80" stroke="#15803d" stroke-width="2" marker-end="url(#bu)"/>
      <text x="210" y="90" font-size="11" fill="#15803d">F_buoy</text>
      <line x1="200" y1="110" x2="200" y2="140" stroke="#b91c1c" stroke-width="2" marker-end="url(#bu)"/>
      <text x="210" y="135" font-size="11" fill="#7c2d12">W</text>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#475569">F_buoy = ρ_fluid · V_submerged · g</text>
      <defs><marker id="bu" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
    </svg>`,
    caption: 'A floating object displaces fluid weighing exactly its own weight.',
  },
  '3.1': {
    title: "Coulomb's law",
    svg: `<svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="90" r="22" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="100" y="95" text-anchor="middle" font-size="13" fill="#7c2d12">+q</text>
      <circle cx="300" cy="90" r="22" fill="#fee2e2" stroke="#b91c1c"/>
      <text x="300" y="95" text-anchor="middle" font-size="13" fill="#7c2d12">+q</text>
      <line x1="122" y1="90" x2="278" y2="90" stroke="#94a3b8" stroke-dasharray="4 3"/>
      <text x="200" y="80" text-anchor="middle" font-size="11" fill="#475569">r</text>
      <line x1="78" y1="115" x2="40" y2="115" stroke="#b91c1c" stroke-width="2" marker-end="url(#cb2)"/>
      <line x1="322" y1="115" x2="360" y2="115" stroke="#b91c1c" stroke-width="2" marker-end="url(#cb2)"/>
      <text x="200" y="135" text-anchor="middle" font-size="11" fill="#475569">Like charges repel; F = kq₁q₂/r²</text>
      <text x="200" y="155" text-anchor="middle" font-size="10" fill="#475569">k = 9×10⁹ N·m²/C²</text>
      <defs><marker id="cb2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#b91c1c"/></marker></defs>
    </svg>`,
    caption: 'Inverse-square law for electric force; same form as gravity but can repel.',
  },
  '5.3': {
    title: "Faraday's law",
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="80" y="60" width="180" height="100" fill="none" stroke="#1e40af" stroke-width="3"/>
      <text x="270" y="70" font-size="11" fill="#1e3a8a">Coil</text>
      <g fill="#fee2e2" stroke="#b91c1c">
        <rect x="290" y="80" width="40" height="60"/>
        <text x="310" y="115" text-anchor="middle" font-size="11" fill="#7c2d12">N</text>
      </g>
      <line x1="335" y1="110" x2="380" y2="110" stroke="#b91c1c" stroke-width="2.5" marker-end="url(#fa2)"/>
      <text x="360" y="130" font-size="10" fill="#7c2d12">moving</text>
      <line x1="170" y1="160" x2="170" y2="180" stroke="#475569" stroke-width="1.5"/>
      <line x1="170" y1="180" x2="220" y2="180" stroke="#475569" stroke-width="1.5"/>
      <circle cx="225" cy="180" r="6" fill="none" stroke="#475569"/>
      <text x="245" y="184" font-size="10" fill="#475569">ε = −dΦ/dt</text>
      <text x="200" y="40" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Changing flux induces EMF</text>
      <defs><marker id="fa2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#b91c1c"/></marker></defs>
    </svg>`,
    caption: 'Move a magnet near a coil; the changing flux induces a current.',
  },
  '7.1': {
    title: 'Wave-particle duality',
    svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="22" text-anchor="middle" font-size="12" fill="#1e3a8a" font-weight="bold">Wave</text>
      <path d="M30,90 Q60,40 90,90 T150,90 T180,90" stroke="#1e40af" stroke-width="2.5" fill="none"/>
      <text x="100" y="120" text-anchor="middle" font-size="10" fill="#475569">interference, diffraction</text>
      <text x="100" y="140" text-anchor="middle" font-size="10" fill="#475569">E = hf,  λ = h/p</text>

      <text x="300" y="22" text-anchor="middle" font-size="12" fill="#7c2d12" font-weight="bold">Particle</text>
      <circle cx="280" cy="80" r="8" fill="#b91c1c"/>
      <circle cx="320" cy="100" r="8" fill="#b91c1c"/>
      <circle cx="360" cy="80" r="8" fill="#b91c1c"/>
      <text x="300" y="135" text-anchor="middle" font-size="10" fill="#475569">photoelectric, Compton</text>
      <text x="300" y="155" text-anchor="middle" font-size="10" fill="#475569">photon quanta</text>

      <text x="200" y="190" text-anchor="middle" font-size="11" fill="#475569">Light and matter both — depends on the experiment.</text>
    </svg>`,
    caption: 'Light shows both wave properties (interference) and particle properties (photoelectric effect).',
  },
};
