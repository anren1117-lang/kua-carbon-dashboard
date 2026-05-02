// Procurement data — paper, IT, cleaning, uniforms, lab/athletics. Used by
// the procurement dashboard and Scope 3 Cat-1 spend-based estimates.

/**
 * @typedef {Object} ProcurementRecord
 * @property {string} poId
 * @property {string} date
 * @property {string} category
 * @property {string} vendor
 * @property {number} quantity
 * @property {string} unit
 * @property {number} spendUsd
 * @property {string} factorId
 */

/** @type {ProcurementRecord[]} */
export const procurementRecords = [
  { poId: 'pr_2026_001', date: '2026-01-15', category: 'paper',         vendor: 'Staples Business',         quantity: 240, unit: 'reams', spendUsd:  1680, factorId: 'ef_proc_paper' },
  { poId: 'pr_2026_002', date: '2026-01-22', category: 'it_equipment',  vendor: 'CDW',                       quantity:  18, unit: 'units', spendUsd: 21600, factorId: 'ef_proc_it' },
  { poId: 'pr_2026_003', date: '2026-02-03', category: 'cleaning',      vendor: 'GraingerSupply',            quantity:  60, unit: 'cases', spendUsd:  3900, factorId: 'ef_proc_cleaning' },
  { poId: 'pr_2026_004', date: '2026-02-18', category: 'apparel',       vendor: 'KUA Spirit Store',          quantity: 200, unit: 'units', spendUsd:  6000, factorId: 'ef_proc_uniforms' },
  { poId: 'pr_2026_005', date: '2026-03-04', category: 'paper',         vendor: 'Staples Business',         quantity: 120, unit: 'reams', spendUsd:   840, factorId: 'ef_proc_paper' },
  { poId: 'pr_2026_006', date: '2026-03-19', category: 'it_equipment',  vendor: 'Apple Education',          quantity:  10, unit: 'units', spendUsd: 14000, factorId: 'ef_proc_it' },
  { poId: 'pr_2026_007', date: '2026-04-02', category: 'cleaning',      vendor: 'GraingerSupply',            quantity:  45, unit: 'cases', spendUsd:  2925, factorId: 'ef_proc_cleaning' },
  { poId: 'pr_2026_008', date: '2026-04-25', category: 'apparel',       vendor: 'Athletic Outfitters',       quantity: 130, unit: 'units', spendUsd:  4550, factorId: 'ef_proc_uniforms' },
];
