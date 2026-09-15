// Subscribe to the BMS meter → building mapping.
//
// The mapping is no longer fixed at module-eval: it hydrates from the shared
// bms_meter_map table after first paint, and an admin edit changes it live.
// Pages that memoize per-building rows (Buildings, StudentChallenges) must
// recompute when it moves — otherwise another admin's mapping only appears
// after a remount.
//
// The returned object is stable per version, so it's safe in a dependency
// array: it changes identity exactly when the mapping changes.

import { useSyncExternalStore } from 'react';
import {
  getBmsMeterMap,
  getBmsMeterMapVersion,
  subscribeBmsMeterMap,
} from '../data/bmsExportMapping.js';

let cachedVersion = -1;
let cachedMap = null;

function snapshot() {
  const version = getBmsMeterMapVersion();
  if (version !== cachedVersion || cachedMap === null) {
    cachedVersion = version;
    cachedMap = getBmsMeterMap();
  }
  return cachedMap;
}

export function useBmsMeterMap() {
  return useSyncExternalStore(subscribeBmsMeterMap, snapshot, snapshot);
}
