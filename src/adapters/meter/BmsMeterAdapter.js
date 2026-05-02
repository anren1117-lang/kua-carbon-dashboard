// BmsMeterAdapter — stub. Plan: pull from the building management system
// (most likely Envysion, Honeywell EBI, or Siemens Desigo via BACnet/REST).
// Will need on-premise gateway or vendor integration; mocked until then.

const NOT_IMPLEMENTED = 'BmsMeterAdapter not implemented — requires BMS vendor selection + gateway provisioning.';

/** @type {import('./MeterDataAdapter.js').MeterDataAdapter} */
export const BmsMeterAdapter = {
  async listMeters()        { throw new Error(NOT_IMPLEMENTED); },
  async getReadings()       { throw new Error(NOT_IMPLEMENTED); },
  async importReadings()    { throw new Error(NOT_IMPLEMENTED); },
  async getQuality()        { throw new Error(NOT_IMPLEMENTED); },
  async getBuildingEnergy() { throw new Error(NOT_IMPLEMENTED); },
};
