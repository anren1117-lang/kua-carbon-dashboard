// UtilityApiMeterAdapter — stub. Plan: hit a utility-portal API (Liberty
// Utilities Green Button, UtilityAPI.com, or vendor equivalent) to pull
// interval data. Auth token expected via env var, e.g. UTILITY_API_TOKEN.

const NOT_IMPLEMENTED = 'UtilityApiMeterAdapter not implemented — register account + add UTILITY_API_TOKEN env var.';

/** @type {import('./MeterDataAdapter.js').MeterDataAdapter} */
export const UtilityApiMeterAdapter = {
  async listMeters()        { throw new Error(NOT_IMPLEMENTED); },
  async getReadings()       { throw new Error(NOT_IMPLEMENTED); },
  async importReadings()    { throw new Error(NOT_IMPLEMENTED); },
  async getQuality()        { throw new Error(NOT_IMPLEMENTED); },
  async getBuildingEnergy() { throw new Error(NOT_IMPLEMENTED); },
};
