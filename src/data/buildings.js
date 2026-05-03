// Building registry. Square footage and occupancy are estimates derived from
// KUA campus map + dorm rosters; replace with facilities-DB values when
// available. The dashboard uses these for per-sqft and per-occupant
// intensities.

/**
 * @typedef {Object} Building
 * @property {string} id
 * @property {string} name
 * @property {number=} bmsNumber           Distech Eclypse BMS building number (the digits shown on the campus map)
 * @property {'Academic'|'Athletic'|'Dorm'|'Dining'|'Other'} category
 * @property {number} sqft
 * @property {number} occupants
 * @property {number} dormPopulation
 * @property {string} hvacSchedule          Free-form description for now
 * @property {number} setpointHeatingF      Default winter setpoint in °F
 * @property {number} setpointCoolingF
 */

/** @type {Building[]} */
export const buildings = [
  { id: 'b_miller',     bmsNumber:  5, name: 'Miller Bicentennial Hall',   category: 'Academic', sqft: 38000, occupants: 280, dormPopulation: 0,   hvacSchedule: '06:00-22:00 weekday',   setpointHeatingF: 68, setpointCoolingF: 74 },
  { id: 'b_whittemore', bmsNumber: 11, name: 'Whittemore Athletic Center', category: 'Athletic', sqft: 60000, occupants: 200, dormPopulation: 0,   hvacSchedule: '05:00-23:00 daily',     setpointHeatingF: 65, setpointCoolingF: 76 },
  { id: 'b_barrette',   bmsNumber:  9, name: 'Barrette',                   category: 'Dorm',     sqft: 22000, occupants: 48,  dormPopulation: 48,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_kilton',     bmsNumber: 18, name: 'Kilton House',               category: 'Dorm',     sqft: 16000, occupants: 29,  dormPopulation: 29,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_fitch',      bmsNumber:  7, name: 'Fitch',                      category: 'Academic', sqft: 18000, occupants: 140, dormPopulation: 0,   hvacSchedule: '07:00-21:00 weekday',   setpointHeatingF: 68, setpointCoolingF: 74 },
  { id: 'b_silvergym',  bmsNumber: 12, name: 'Alumni Silver Gym',          category: 'Athletic', sqft: 24000, occupants: 120, dormPopulation: 0,   hvacSchedule: '06:00-22:00 daily',     setpointHeatingF: 65, setpointCoolingF: 76 },
  { id: 'b_flickinger', bmsNumber:  8, name: 'Flickinger Arts Center',     category: 'Academic', sqft: 22000, occupants: 90,  dormPopulation: 0,   hvacSchedule: '08:00-22:00 daily',     setpointHeatingF: 68, setpointCoolingF: 74 },
  { id: 'b_chellis',    bmsNumber: 22, name: 'Chellis Hall',               category: 'Dorm',     sqft: 8000,  occupants: 19,  dormPopulation: 19,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_welch',      bmsNumber: 17, name: 'Welch House',                category: 'Dorm',     sqft: 8500,  occupants: 18,  dormPopulation: 18,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_dexter',     bmsNumber: 15, name: 'Dexter-Richards Hall',       category: 'Dorm',     sqft: 9000,  occupants: 23,  dormPopulation: 23,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_densmore',   bmsNumber: 13, name: 'Densmore Hall',              category: 'Dorm',     sqft: 8200,  occupants: 21,  dormPopulation: 21,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_kurth',      bmsNumber: 21, name: 'Kurth Hall',                 category: 'Dorm',     sqft: 7600,  occupants: 18,  dormPopulation: 18,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_baxter',     bmsNumber:  1, name: 'Baxter',                     category: 'Dorm',     sqft: 6800,  occupants: 14,  dormPopulation: 14,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_bryant',     bmsNumber: 14, name: 'Bryant Hall',                category: 'Dorm',     sqft: 6500,  occupants: 14,  dormPopulation: 14,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_rowe',       bmsNumber: 16, name: 'Rowe Hall',                  category: 'Dorm',     sqft: 6300,  occupants: 13,  dormPopulation: 13,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_bishop',     bmsNumber:  3, name: 'Bishop Alumni House',        category: 'Dorm',     sqft: 5400,  occupants: 10,  dormPopulation: 10,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_childcare',  bmsNumber: 25, name: 'Child Care Center',          category: 'Other',    sqft: 4200,  occupants: 30,  dormPopulation: 0,   hvacSchedule: '07:00-18:00 weekday',   setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_mikula',     bmsNumber: 23, name: 'Mikula Hall',                category: 'Dorm',     sqft: 5800,  occupants: 11,  dormPopulation: 11,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_barnfield',  bmsNumber: 10, name: 'Barn Field House',           category: 'Athletic', sqft: 14000, occupants:  50, dormPopulation: 0,   hvacSchedule: '06:00-21:00 daily',     setpointHeatingF: 65, setpointCoolingF: 76 },
];

const buildingsById = Object.fromEntries(buildings.map((b) => [b.id, b]));
const buildingsByBmsNumber = Object.fromEntries(
  buildings.filter((b) => b.bmsNumber != null).map((b) => [b.bmsNumber, b]),
);
export function getBuilding(id) {
  return buildingsById[id] || null;
}
export function getBuildingByBmsNumber(n) {
  return buildingsByBmsNumber[n] || null;
}
