// Waste & recycling logs. Hauler-invoice based, monthly granularity.

/**
 * @typedef {Object} WasteLog
 * @property {string} date
 * @property {'landfill'|'recycling'|'compost'|'food_waste'|'e_waste'} stream
 * @property {number} kg
 * @property {string=} hauler
 * @property {string=} location
 */

/** @type {WasteLog[]} */
export const wasteLogs = (() => {
  const out = [];
  const monthlyKg = {
    landfill:  4200,
    recycling: 1800,
    compost:   2100,
    food_waste:  900,
    e_waste:     60,
  };
  for (let m = 0; m < 12; m++) {
    const date = `2026-${String(m + 1).padStart(2, '0')}-28`;
    Object.entries(monthlyKg).forEach(([stream, kg]) => {
      // Light seasonal variation
      const seasonal = m >= 5 && m <= 7 ? 0.65 : 1.0;
      out.push({
        date,
        stream: /** @type {WasteLog['stream']} */ (stream),
        kg: Math.round(kg * seasonal * (0.92 + ((m * 11) % 16) / 100)),
        hauler: stream === 'compost' ? 'KUA Composting' : stream === 'e_waste' ? 'eWorks NH' : 'Casella Waste',
      });
    });
  }
  return out;
})();
