// Building registry. Square footage and occupancy are estimates derived from
// KUA campus map + dorm rosters; replace with facilities-DB values when
// available. The dashboard uses these for per-sqft and per-occupant
// intensities.

/**
 * @typedef {Object} Building
 * @property {string} id
 * @property {string} name
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
  { id: 'b_miller',     name: 'Miller Bicentennial Hall',   category: 'Academic', sqft: 38000, occupants: 280, dormPopulation: 0,   hvacSchedule: '06:00-22:00 weekday',   setpointHeatingF: 68, setpointCoolingF: 74 },
  { id: 'b_whittemore', name: 'Whittemore Athletic Center', category: 'Athletic', sqft: 60000, occupants: 200, dormPopulation: 0,   hvacSchedule: '05:00-23:00 daily',     setpointHeatingF: 65, setpointCoolingF: 76 },
  { id: 'b_barrette',   name: 'Barrette',                   category: 'Dorm',     sqft: 22000, occupants: 60,  dormPopulation: 60,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_kilton',     name: 'Kilton House',               category: 'Dorm',     sqft: 16000, occupants: 36,  dormPopulation: 36,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_fitch',      name: 'Fitch',                      category: 'Academic', sqft: 18000, occupants: 140, dormPopulation: 0,   hvacSchedule: '07:00-21:00 weekday',   setpointHeatingF: 68, setpointCoolingF: 74 },
  { id: 'b_silvergym',  name: 'Alumni Silver Gym',          category: 'Athletic', sqft: 24000, occupants: 120, dormPopulation: 0,   hvacSchedule: '06:00-22:00 daily',     setpointHeatingF: 65, setpointCoolingF: 76 },
  { id: 'b_flickinger', name: 'Flickinger Arts Center',     category: 'Academic', sqft: 22000, occupants: 90,  dormPopulation: 0,   hvacSchedule: '08:00-22:00 daily',     setpointHeatingF: 68, setpointCoolingF: 74 },
  { id: 'b_chellis',    name: 'Chellis Hall',               category: 'Dorm',     sqft: 8000,  occupants: 24,  dormPopulation: 24,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_welch',      name: 'Welch House',                category: 'Dorm',     sqft: 8500,  occupants: 22,  dormPopulation: 22,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_dexter',     name: 'Dexter-Richards Hall',       category: 'Dorm',     sqft: 9000,  occupants: 28,  dormPopulation: 28,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_densmore',   name: 'Densmore Hall',              category: 'Dorm',     sqft: 8200,  occupants: 26,  dormPopulation: 26,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_kurth',      name: 'Kurth Hall',                 category: 'Dorm',     sqft: 7600,  occupants: 22,  dormPopulation: 22,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_baxter',     name: 'Baxter',                     category: 'Dorm',     sqft: 6800,  occupants: 18,  dormPopulation: 18,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_bryant',     name: 'Bryant Hall',                category: 'Dorm',     sqft: 6500,  occupants: 18,  dormPopulation: 18,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_rowe',       name: 'Rowe Hall',                  category: 'Dorm',     sqft: 6300,  occupants: 16,  dormPopulation: 16,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_bishop',     name: 'Bishop Alumni House',        category: 'Dorm',     sqft: 5400,  occupants: 12,  dormPopulation: 12,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_childcare',  name: 'Child Care Center',          category: 'Other',    sqft: 4200,  occupants: 30,  dormPopulation: 0,   hvacSchedule: '07:00-18:00 weekday',   setpointHeatingF: 70, setpointCoolingF: 74 },
  { id: 'b_mikula',     name: 'Mikula Hall',                category: 'Dorm',     sqft: 5800,  occupants: 14,  dormPopulation: 14,  hvacSchedule: '24/7',                  setpointHeatingF: 70, setpointCoolingF: 74 },
];

const buildingsById = Object.fromEntries(buildings.map((b) => [b.id, b]));
export function getBuilding(id) {
  return buildingsById[id] || null;
}
