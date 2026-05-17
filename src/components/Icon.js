import React from 'react';

// Small SVG icon library — replaces emoji where crispness matters
// (buttons, nav, callouts) and gives us a consistent stroke width
// + color across the dashboard. All icons inherit currentColor so
// they take their parent's text color.
//
// Stroke-based (Feather/Lucide-style) rather than filled — reads
// cleaner on the dark UI and lets emoji handle the celebratory
// surfaces (🏆, 🥇) where character matters.

const SIZE = 16;

function svgProps({ size = SIZE, color = 'currentColor', strokeWidth = 2 }) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    style: { verticalAlign: 'middle', flexShrink: 0 },
    'aria-hidden': true,
  };
}

export const Icon = {
  Download: (p = {}) => (
    <svg {...svgProps(p)}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  ArrowRight: (p = {}) => (
    <svg {...svgProps(p)}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ArrowLeft: (p = {}) => (
    <svg {...svgProps(p)}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Map: (p = {}) => (
    <svg {...svgProps(p)}>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  Leaf: (p = {}) => (
    <svg {...svgProps(p)}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.8 2c1 5 .5 10-6.8 12L11 20z" />
      <path d="M2 22 17 7" />
    </svg>
  ),
  Bolt: (p = {}) => (
    <svg {...svgProps(p)}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Share: (p = {}) => (
    <svg {...svgProps(p)}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  HelpCircle: (p = {}) => (
    <svg {...svgProps(p)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Sparkles: (p = {}) => (
    <svg {...svgProps(p)}>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 14l.95 2.55L22 17.5l-2.05.95L19 21l-.95-2.55L16 17.5l2.05-.95L19 14z" />
    </svg>
  ),
  Refresh: (p = {}) => (
    <svg {...svgProps(p)}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  Trophy: (p = {}) => (
    <svg {...svgProps(p)}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  Chart: (p = {}) => (
    <svg {...svgProps(p)}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
};

export default Icon;
