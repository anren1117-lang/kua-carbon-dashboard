// Pure-function tests for the per-table CSV-row validators in
// CsvImportPanel. The component itself is wired through 7 admin
// tables; centralized tests here catch regressions in validation
// without depending on the full AdminPortal render tree.

import { describe, it, expect } from 'vitest';
import {
  validateFuelRow,
  validateWasteRow,
  validateDayStudentRow,
  validateUSStudentRow,
  validateIntlStudentRow,
  validateStudyAbroadRow,
  validateFacultyTravelRow,
} from '../components/CsvImportPanel.js';

describe('validateFuelRow', () => {
  it('accepts a fully-specified row', () => {
    const r = validateFuelRow({ date: '2026-01-15', fuel_type: 'Heating Oil', gallons: '5000', cost: '18000', notes: 'Brockway Smith Jan' }, 0);
    expect(r.ok).toBe(true);
    expect(r.row).toEqual({
      date: '2026-01-15', fuel_type: 'Heating Oil', gallons: 5000, cost: 18000, notes: 'Brockway Smith Jan',
    });
  });

  it('accepts minimal row with no cost or notes (cost null)', () => {
    const r = validateFuelRow({ date: '2026-02-01', fuel_type: 'Propane', gallons: '300' }, 0);
    expect(r.ok).toBe(true);
    expect(r.row.cost).toBeNull();
    expect(r.row.notes).toBeNull();
  });

  it('rejects missing date', () => {
    const r = validateFuelRow({ fuel_type: 'Propane', gallons: '300' }, 0);
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/missing date/);
  });

  it('rejects malformed date', () => {
    const r = validateFuelRow({ date: '01/15/2026', fuel_type: 'Propane', gallons: '300' }, 5);
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/YYYY-MM-DD/);
    expect(r.message).toMatch(/row 7/); // idx 5 → row 7 (0-indexed + header offset)
  });

  it('rejects bad fuel_type', () => {
    const r = validateFuelRow({ date: '2026-01-15', fuel_type: 'Coal', gallons: '300' }, 0);
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/fuel_type/);
  });

  it('rejects negative gallons', () => {
    const r = validateFuelRow({ date: '2026-01-15', fuel_type: 'Propane', gallons: '-50' }, 0);
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/gallons/);
  });

  it('rejects non-numeric cost', () => {
    const r = validateFuelRow({ date: '2026-01-15', fuel_type: 'Propane', gallons: '100', cost: 'banana' }, 0);
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/cost/);
  });
});

describe('validateWasteRow', () => {
  it('accepts a fully-specified row', () => {
    const r = validateWasteRow({ date: '2026-01-15', waste_type: 'Landfill', amount: '2.4', unit: 'tons', notes: 'Monthly haul', school_year: '2025-2026' }, 0);
    expect(r.ok).toBe(true);
    expect(r.row.amount).toBe(2.4);
  });

  it('defaults unit to tons when blank', () => {
    const r = validateWasteRow({ date: '2026-01-15', waste_type: 'Recycling', amount: '1.1' }, 0);
    expect(r.ok).toBe(true);
    expect(r.row.unit).toBe('tons');
  });

  it('rejects bad waste_type enum value', () => {
    const r = validateWasteRow({ date: '2026-01-15', waste_type: 'Compost', amount: '1' }, 0);
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/waste_type/);
  });

  it('rejects bad unit enum', () => {
    const r = validateWasteRow({ date: '2026-01-15', waste_type: 'Landfill', amount: '1', unit: 'kilos' }, 0);
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/unit/);
  });
});

describe('validateDayStudentRow', () => {
  it('accepts NH zip + 4-digit grad year', () => {
    const r = validateDayStudentRow({ zip_code: '03753', graduation_year: '2026', school_year: '2025-2026' }, 0);
    expect(r.ok).toBe(true);
    expect(r.row.zip_code).toBe('03753');
  });

  it('accepts ZIP+4 format', () => {
    const r = validateDayStudentRow({ zip_code: '03753-1234', graduation_year: '2026' }, 0);
    expect(r.ok).toBe(true);
  });

  it('rejects 4-digit zip', () => {
    const r = validateDayStudentRow({ zip_code: '3753', graduation_year: '2026' }, 0);
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/zip_code/);
  });

  it('rejects 2-digit graduation year', () => {
    const r = validateDayStudentRow({ zip_code: '03753', graduation_year: '26' }, 0);
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/graduation_year/);
  });
});

describe('validateUSStudentRow', () => {
  it('accepts a state in either case (uppercases)', () => {
    const r1 = validateUSStudentRow({ zip_code: '02115', state: 'ma', graduation_year: '2026' }, 0);
    expect(r1.ok).toBe(true);
    expect(r1.row.state).toBe('MA');
    const r2 = validateUSStudentRow({ zip_code: '02115', state: 'NY', graduation_year: '2026' }, 0);
    expect(r2.ok).toBe(true);
  });

  it('treats blank state as null', () => {
    const r = validateUSStudentRow({ zip_code: '02115', graduation_year: '2026' }, 0);
    expect(r.ok).toBe(true);
    expect(r.row.state).toBeNull();
  });

  it('rejects 3-letter state', () => {
    const r = validateUSStudentRow({ zip_code: '02115', state: 'MAS', graduation_year: '2026' }, 0);
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/state/);
  });
});

describe('validateIntlStudentRow', () => {
  it('accepts a country', () => {
    const r = validateIntlStudentRow({ country: 'China', graduation_year: '2026' }, 0);
    expect(r.ok).toBe(true);
    expect(r.row.country).toBe('China');
  });

  it('rejects missing country', () => {
    const r = validateIntlStudentRow({ graduation_year: '2026' }, 0);
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/country/);
  });
});

describe('validateStudyAbroadRow', () => {
  it('accepts a fully-specified trip', () => {
    const r = validateStudyAbroadRow({
      destination_country: 'Spain',
      destination_city: 'Madrid',
      departure_date: '2026-09-01',
      return_date: '2026-12-15',
      school_year: '2026-2027',
    }, 0);
    expect(r.ok).toBe(true);
    expect(r.row.destination_country).toBe('Spain');
    expect(r.row.destination_city).toBe('Madrid');
  });

  it('accepts trip without dates (nulls them)', () => {
    const r = validateStudyAbroadRow({ destination_country: 'France' }, 0);
    expect(r.ok).toBe(true);
    expect(r.row.departure_date).toBeNull();
    expect(r.row.return_date).toBeNull();
  });

  it('rejects malformed departure_date', () => {
    const r = validateStudyAbroadRow({ destination_country: 'France', departure_date: '09-01-2026' }, 0);
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/departure_date/);
  });
});

describe('validateFacultyTravelRow', () => {
  it('accepts a fully-specified trip', () => {
    const r = validateFacultyTravelRow({
      destination_country: 'USA',
      destination_city: 'Boston',
      trip_purpose: 'Conference',
      departure_date: '2026-04-12',
      return_date: '2026-04-14',
    }, 0);
    expect(r.ok).toBe(true);
    expect(r.row.trip_purpose).toBe('Conference');
  });

  it('defaults trip_purpose to Conference when blank', () => {
    const r = validateFacultyTravelRow({ destination_country: 'USA' }, 0);
    expect(r.ok).toBe(true);
    expect(r.row.trip_purpose).toBe('Conference');
  });

  it('rejects bad trip_purpose enum', () => {
    const r = validateFacultyTravelRow({ destination_country: 'USA', trip_purpose: 'Vacation' }, 0);
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/trip_purpose/);
  });
});
