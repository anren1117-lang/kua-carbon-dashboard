// Hotspot ranking. Combines magnitude + trend + reduction potential into a
// score, then ranks by that score.

/**
 * @typedef {Object} Hotspot
 * @property {string} id
 * @property {string} name
 * @property {string} kind            'building' | 'category' | 'anomaly'
 * @property {number} mtCO2eAnnual
 * @property {number} percentOfTotal
 * @property {number=} trendPct       +N → got worse
 * @property {'low'|'medium'|'high'} severity
 * @property {string=} suggestedAction
 * @property {string=} owner
 */

/**
 * @param {{ id: string, name: string, kwh: number }[]} buildingsKwh
 * @param {number} totalKwh
 * @param {number} kgPerKwh
 */
export function buildingHotspots(buildingsKwh, totalKwh, kgPerKwh) {
  return buildingsKwh
    .map((b) => {
      const mt = (b.kwh * kgPerKwh) / 1000;
      const share = totalKwh ? (b.kwh / totalKwh) * 100 : 0;
      let severity = /** @type {'low'|'medium'|'high'} */ ('low');
      if (share >= 8) severity = 'high';
      else if (share >= 3) severity = 'medium';
      return {
        id: b.id,
        name: b.name,
        kind: 'building',
        mtCO2eAnnual: Number(mt.toFixed(2)),
        percentOfTotal: Number(share.toFixed(1)),
        severity,
      };
    })
    .sort((a, b) => b.mtCO2eAnnual - a.mtCO2eAnnual);
}

/**
 * Rank reduction actions by impact / urgency / feasibility.
 * @param {import('../data/reductionActions.js').ReductionAction[]} actions
 */
export function rankActions(actions) {
  const urgencyW = { high: 3, medium: 2, low: 1 };
  const confW    = { high: 3, medium: 2, low: 1 };
  const diffPenalty = { low: 0, medium: 5, high: 10 };
  return [...actions]
    .map((a) => {
      const score =
        a.expectedReductionMtCO2e *
        (urgencyW[a.urgency] || 1) *
        (confW[a.confidence] || 1) -
        diffPenalty[a.difficulty];
      return { action: a, score };
    })
    .sort((a, b) => b.score - a.score);
}
