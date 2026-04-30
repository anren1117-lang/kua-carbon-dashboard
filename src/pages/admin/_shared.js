// Shared admin form helpers re-exported from one place so any /pages/admin/* page
// can import without reaching into scope3/.
export { useTable } from './scope3/useTable';
export { useFactor } from './scope3/useFactor';
export { RecordsTable, qualityPill } from './scope3/RecordsTable';
export { PreviewBanner } from './scope3/PreviewBanner';
export { formStyles } from './scope3/formStyles';

export const today = () => new Date().toISOString().slice(0, 10);
export const firstOfMonth = () => {
  const d = new Date(); d.setDate(1);
  return d.toISOString().slice(0, 10);
};

// School year helper, e.g. 'Apr 2026' -> '2025-2026' (boarding-school convention: rolls over Aug 1)
export const currentSchoolYear = () => {
  const d = new Date();
  const y = d.getFullYear();
  const sy = d.getMonth() >= 7 ? y : y - 1;
  return `${sy}-${sy + 1}`;
};

// LB → KG conversion for refrigerant fields.
export const LB_TO_KG = 0.45359237;
