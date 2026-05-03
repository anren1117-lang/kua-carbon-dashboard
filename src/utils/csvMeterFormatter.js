// MeterReading[] → CSV. Round-trips with parseMeterCsv so:
//
//   parseMeterCsv(formatMeterCsv(readings)).readings ≈ readings
//
// Used by the /api/meters/readings/export endpoint and (eventually) by
// a "Download readings" button in /data-admin.

const HEADER = ['meter_id', 'timestamp', 'value', 'unit', 'interval_minutes', 'demand_kw', 'data_quality'];

function escape(field) {
  if (field == null) return '';
  const s = String(field);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * @param {import('../adapters/meter/MeterDataAdapter.js').MeterReading[]} readings
 * @returns {string}
 */
export function formatMeterCsv(readings) {
  const lines = [HEADER.join(',')];
  for (const r of readings) {
    lines.push([
      r.meterId,
      r.timestamp,
      r.value,
      r.unit,
      r.intervalMinutes,
      r.demandKw ?? '',
      r.dataQuality ?? 'actual',
    ].map(escape).join(','));
  }
  return lines.join('\n') + '\n';
}
