// CsvMeterAdapter — stub. Plan: parse a CSV (uploaded via the Data Admin
// page or dropped into Supabase storage), map columns into MeterReading
// shape, validate against the meter registry, and persist via Supabase.
// Until persistence is wired, the methods raise so accidental use in dev
// surfaces immediately.

const NOT_IMPLEMENTED = 'CsvMeterAdapter not implemented yet — wire to Supabase storage + ingestion job.';

/** @type {import('./MeterDataAdapter.js').MeterDataAdapter} */
export const CsvMeterAdapter = {
  async listMeters()        { throw new Error(NOT_IMPLEMENTED); },
  async getReadings()       { throw new Error(NOT_IMPLEMENTED); },
  async importReadings()    { throw new Error(NOT_IMPLEMENTED); },
  async getQuality()        { throw new Error(NOT_IMPLEMENTED); },
  async getBuildingEnergy() { throw new Error(NOT_IMPLEMENTED); },
};
