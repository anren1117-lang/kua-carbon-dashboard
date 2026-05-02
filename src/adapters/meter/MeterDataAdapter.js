// MeterDataAdapter — the interface every concrete data source implements.
// The frontend and API routes only ever call this interface; the factory
// (./index.js) decides at runtime which adapter to instantiate.
//
// JS doesn't enforce interfaces, so this file is the canonical reference
// for the methods every adapter must export and the JSDoc shapes they must
// honor. Each implementation re-states the JSDoc to keep editor IntelliSense
// accurate per file.

/**
 * @typedef {'electricity'|'gas'|'water'|'steam'|'solar'} MeterType
 * @typedef {'kWh'|'therm'|'gallon'|'lb_steam'|'m3'} MeterUnit
 * @typedef {15|30|60|1440} MeterInterval
 * @typedef {'actual'|'estimated'|'missing'|'anomaly'} DataQuality
 * @typedef {'mock'|'csv'|'utility_api'|'bms'|'manual'} MeterSource
 */

/**
 * @typedef {Object} Meter
 * @property {string} id
 * @property {string} buildingId
 * @property {MeterType} type
 * @property {MeterUnit} unit
 * @property {string} provider
 * @property {MeterInterval} intervalMinutes
 */

/**
 * @typedef {Object} MeterReading
 * @property {string} id
 * @property {string} meterId
 * @property {string} buildingId
 * @property {MeterType} meterType
 * @property {string} timestamp           ISO 8601
 * @property {MeterInterval} intervalMinutes
 * @property {number} value
 * @property {MeterUnit} unit
 * @property {number=} demandKw
 * @property {DataQuality} dataQuality
 * @property {MeterSource} source
 */

/**
 * @typedef {Object} BuildingEnergySummary
 * @property {string} buildingId
 * @property {string} buildingName
 * @property {string} start
 * @property {string} end
 * @property {number} totalKwh
 * @property {number} peakKw
 * @property {number} mtCO2e
 * @property {number} mtCO2ePerSqft
 * @property {number} mtCO2ePerOccupant
 * @property {Array<{ date: string, kwh: number }>} dailyKwh
 */

/**
 * @typedef {Object} MeterDataQualityReport
 * @property {string} meterId
 * @property {string} start
 * @property {string} end
 * @property {number} totalReadings
 * @property {number} qualityScore     0..100
 * @property {import('../../utils/anomaly.js').MeterDataQualityIssue[]} issues
 */

/**
 * @typedef {Object} MeterDataAdapter
 * @property {() => Promise<Meter[]>} listMeters
 * @property {(opts: { meterId?: string, buildingId?: string, start: string, end: string, intervalMinutes?: MeterInterval }) => Promise<MeterReading[]>} getReadings
 * @property {(readings: MeterReading[]) => Promise<{ inserted: number }>} importReadings
 * @property {(opts: { meterId?: string, start: string, end: string }) => Promise<MeterDataQualityReport[]>} getQuality
 * @property {(opts: { buildingId: string, start: string, end: string }) => Promise<BuildingEnergySummary>} getBuildingEnergy
 */

// No runtime export — this file exists for documentation and JSDoc.
export {};
