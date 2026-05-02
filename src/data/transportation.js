// Transportation data: school fleet, commute survey, carpool logs, school
// trips, air travel. All user-linked records use hashed IDs.

/**
 * @typedef {Object} FleetVehicle
 * @property {string} id
 * @property {string} type
 * @property {string} fuelType        'diesel'|'gasoline'
 * @property {number} mpg
 * @property {number} annualMiles
 */

/** @type {FleetVehicle[]} */
export const fleetVehicles = [
  { id: 'fv_bus_1', type: 'School bus 71-pass',  fuelType: 'diesel',   mpg:  6.5, annualMiles: 14000 },
  { id: 'fv_bus_2', type: 'School bus 71-pass',  fuelType: 'diesel',   mpg:  6.5, annualMiles: 12500 },
  { id: 'fv_van_1', type: 'Activity van',         fuelType: 'gasoline', mpg: 16.0, annualMiles:  9000 },
  { id: 'fv_van_2', type: 'Activity van',         fuelType: 'gasoline', mpg: 16.0, annualMiles:  8200 },
  { id: 'fv_truck', type: 'Maintenance pickup',   fuelType: 'gasoline', mpg: 14.0, annualMiles:  4800 },
];

/**
 * @typedef {Object} FleetFuelLog
 * @property {string} vehicleId
 * @property {string} date
 * @property {number} miles
 * @property {number} fuelGallons
 * @property {string=} routeId
 * @property {number=} occupancy
 */

/** @type {FleetFuelLog[]} */
export const fleetFuelLogs = (() => {
  const out = [];
  fleetVehicles.forEach((v) => {
    for (let m = 0; m < 12; m++) {
      const milesThisMonth = Math.round(v.annualMiles / 12 * (0.85 + ((m * 17) % 30) / 100));
      out.push({
        vehicleId: v.id,
        date: `2026-${String(m + 1).padStart(2, '0')}-15`,
        miles: milesThisMonth,
        fuelGallons: Math.round((milesThisMonth / v.mpg) * 10) / 10,
        routeId: v.type.includes('bus') ? `route_${(m % 3) + 1}` : undefined,
        occupancy: v.type.includes('bus') ? 28 : 8,
      });
    }
  });
  return out;
})();

/**
 * @typedef {Object} CommuteSurveyResponse
 * @property {string} userIdHash
 * @property {'student'|'staff'} userType
 * @property {'solo_drive'|'carpool'|'bus'|'walk'|'bike'|'remote'} mode
 * @property {number} oneWayMiles
 * @property {number} daysPerWeek
 * @property {number} remoteDays
 */

/** @type {CommuteSurveyResponse[]} */
export const commuteSurveyResponses = []; // populated from staff.js & students.js helpers if needed

/**
 * @typedef {Object} CarpoolTrip
 * @property {string} tripId
 * @property {string} date
 * @property {string} driverUserIdHash
 * @property {string[]} passengerUserIdHashes
 * @property {number} miles
 * @property {number} passengerCount
 * @property {'solo_drive'|'transit'} baselineMode
 * @property {number} avoidedVehicleMiles
 * @property {number} estimatedKgCO2eAvoided
 * @property {'self_reported'|'verified'|'estimated'} verificationStatus
 */

/** @type {CarpoolTrip[]} */
export const carpoolTrips = (() => {
  const out = [];
  const start = new Date('2026-03-01').getTime();
  for (let d = 0; d < 60; d++) {
    const date = new Date(start + d * 86400000).toISOString().slice(0, 10);
    const dow = new Date(date).getDay();
    if (dow === 0 || dow === 6) continue;
    const tripsToday = (d % 5) + 2;
    for (let t = 0; t < tripsToday; t++) {
      const miles = 8 + ((d * 7 + t) % 14);
      const passengers = 2 + ((d + t) % 3);
      out.push({
        tripId: `cp_${d}_${t}`,
        date,
        driverUserIdHash: `hash_${(d * 31 + t * 13) % 200}`.padStart(8, '0').slice(-8),
        passengerUserIdHashes: Array.from({ length: passengers }, (_, p) => `hash_${(d * 7 + p * 11) % 200}`.padStart(8, '0').slice(-8)),
        miles,
        passengerCount: passengers,
        baselineMode: 'solo_drive',
        avoidedVehicleMiles: miles * passengers,
        estimatedKgCO2eAvoided: Math.round(miles * passengers * 0.351 * 10) / 10,
        verificationStatus: 'self_reported',
      });
    }
  }
  return out;
})();

/**
 * @typedef {Object} SchoolTrip
 * @property {string} tripId
 * @property {string} date
 * @property {string} purpose         'athletics'|'field_trip'|'admissions'
 * @property {'bus'|'van'|'air'} mode
 * @property {string} origin
 * @property {string} destination
 * @property {number} miles
 * @property {number} passengerCount
 */

/** @type {SchoolTrip[]} */
export const schoolTrips = [
  { tripId: 'st_001', date: '2026-02-14', purpose: 'athletics',  mode: 'bus', origin: 'Meriden, NH', destination: 'Andover, MA', miles: 220, passengerCount: 28 },
  { tripId: 'st_002', date: '2026-02-21', purpose: 'athletics',  mode: 'bus', origin: 'Meriden, NH', destination: 'Concord, NH', miles:  90, passengerCount: 28 },
  { tripId: 'st_003', date: '2026-03-05', purpose: 'field_trip', mode: 'bus', origin: 'Meriden, NH', destination: 'Boston, MA',  miles: 250, passengerCount: 45 },
  { tripId: 'st_004', date: '2026-03-12', purpose: 'admissions', mode: 'van', origin: 'Meriden, NH', destination: 'NYC, NY',     miles: 540, passengerCount:  8 },
];

/**
 * @typedef {Object} AirTravelRecord
 * @property {string} tripId
 * @property {string} date
 * @property {'study_abroad'|'international_student_break'|'faculty_pd'|'athletics'} purpose
 * @property {'short_haul'|'long_haul'} haul
 * @property {string} origin
 * @property {string} destination
 * @property {number} passengerMiles
 */

/** @type {AirTravelRecord[]} */
export const airTravelRecords = [
  { tripId: 'air_001', date: '2026-03-15', purpose: 'study_abroad',                haul: 'long_haul',  origin: 'BOS', destination: 'CDG',  passengerMiles: 32400 },
  { tripId: 'air_002', date: '2026-03-22', purpose: 'international_student_break', haul: 'long_haul',  origin: 'BOS', destination: 'PEK',  passengerMiles: 84500 },
  { tripId: 'air_003', date: '2026-04-08', purpose: 'faculty_pd',                  haul: 'short_haul', origin: 'BOS', destination: 'DCA',  passengerMiles:   980 },
  { tripId: 'air_004', date: '2026-04-12', purpose: 'athletics',                   haul: 'short_haul', origin: 'BOS', destination: 'PHL',  passengerMiles:  4200 },
];
