// POST /api/emissions/calculate
// Body: { quantity: number, factorId?: string, category?: string, subcategory?: string }
// Returns { kgco2e, mtco2e, factor }

import { quantityToKgCO2e } from '../../src/utils/emissions.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { quantity, factorId, category, subcategory } = req.body || {};
    if (!Number.isFinite(quantity)) {
      res.status(400).json({ error: 'quantity (finite number) is required' });
      return;
    }
    if (!factorId && !(category && subcategory)) {
      res.status(400).json({ error: 'either factorId, or both category and subcategory, are required' });
      return;
    }
    const { kgco2e, factor } = quantityToKgCO2e({ quantity, factorId, category, subcategory });
    if (!factor) {
      res.status(404).json({ error: 'no matching emission factor' });
      return;
    }
    res.status(200).json({
      kgco2e: Number(kgco2e.toFixed(4)),
      mtco2e: Number((kgco2e / 1000).toFixed(6)),
      factor,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
