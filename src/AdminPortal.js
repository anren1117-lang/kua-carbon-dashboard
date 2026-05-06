import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { logAdminWrite } from './utils/adminAudit.js';
import { toCsv, downloadCsv } from './utils/csv.js';
import CsvImportPanel, {
  validateFuelRow,
  validateWasteRow,
  validateDayStudentRow,
  validateUSStudentRow,
  validateIntlStudentRow,
  validateStudyAbroadRow,
  validateFacultyTravelRow,
} from './components/CsvImportPanel.js';

// Read the server-issued admin session blob saved by handleLogin.
function readStoredAdminSession() {
  try {
    const raw = localStorage.getItem('kua_admin_session');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.token === 'string') return parsed;
    return null;
  } catch { return null; }
}

function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('fuel');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Data states
  const [fuelBills, setFuelBills] = useState([]);
  const [dayStudents, setDayStudents] = useState([]);
  const [usBoardingStudents, setUsBoardingStudents] = useState([]);
  const [intlStudents, setIntlStudents] = useState([]);
  const [studyAbroad, setStudyAbroad] = useState([]);
  const [facultyTravel, setFacultyTravel] = useState([]);
  const [wasteRecords, setWasteRecords] = useState([]);

  // Form states
  const [fuelForm, setFuelForm] = useState({ date: '', fuel_type: 'Propane', gallons: '', cost: '', notes: '' });
  const [dayForm, setDayForm] = useState({ zip_code: '', graduation_year: '2026', school_year: '2025-2026' });
  const [usForm, setUsForm] = useState({ zip_code: '', state: '', graduation_year: '2026', school_year: '2025-2026' });
  const [intlForm, setIntlForm] = useState({ country: '', graduation_year: '2026', school_year: '2025-2026' });
  const [saForm, setSaForm] = useState({ destination_country: '', destination_city: '', departure_date: '', return_date: '', school_year: '2025-2026' });
  const [ftForm, setFtForm] = useState({ destination_country: '', destination_city: '', trip_purpose: 'Conference', departure_date: '', return_date: '' });
  const [wasteForm, setWasteForm] = useState({ date: '', waste_type: 'Landfill', amount: '', unit: 'tons', notes: '', school_year: '2025-2026' });

  // Emission factors
  const fuelFactors = { 'Propane': 5.72, 'Heating Oil': 10.16, 'Diesel': 10.18, 'Gasoline': 8.89 };
  const wasteFactors = { 'Landfill': 0.52, 'Recycling': -0.10, 'Composting': 0.04, 'Hazardous': 0.50, 'E-Waste': 0.30 };

  // Server-checked admin auth: /api/admin/login validates the password
  // against ADMIN_PASSWORD (server-side env) and returns an HMAC-signed
  // token. The token expiry is enforced both client-side (we drop a
  // stale token on mount) and server-side (every admin API rejects
  // expired tokens). localStorage is now an opaque blob, not a trust
  // bit — anyone can flip a flag in DevTools, but only a valid signed
  // token gets past the server.
  useEffect(() => {
    const stored = readStoredAdminSession();
    if (stored && stored.expiresAt && new Date(stored.expiresAt).getTime() > Date.now()) {
      setIsLoggedIn(true);
      fetchAllData();
    } else if (stored) {
      // Expired or malformed — wipe so the gate re-prompts.
      localStorage.removeItem('kua_admin_session');
    }
  }, []);

  const handleLogin = async () => {
    setError('');
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      let body = {};
      try { body = await r.json(); } catch {}
      if (!r.ok) {
        setError(body.error || `Login failed (HTTP ${r.status})`);
        return;
      }
      localStorage.setItem('kua_admin_session', JSON.stringify(body));
      // Legacy flag kept ONLY for any in-flight code paths still
      // reading 'adminLoggedIn' — they should migrate to reading the
      // session blob, but the flag is harmless on its own (no API
      // accepts it as auth).
      localStorage.setItem('adminLoggedIn', 'true');
      setIsLoggedIn(true);
      fetchAllData();
    } catch (err) {
      setError('Network error contacting login endpoint');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('kua_admin_session');
    localStorage.removeItem('adminLoggedIn');
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [fuel, day, us, intl, sa, ft, waste] = await Promise.all([
        supabase.from('fuel_bills').select('*').order('date', { ascending: false }),
        supabase.from('day_students').select('*').order('created_at', { ascending: false }),
        supabase.from('us_boarding_students').select('*').order('created_at', { ascending: false }),
        supabase.from('international_students').select('*').order('created_at', { ascending: false }),
        supabase.from('study_abroad').select('*').order('departure_date', { ascending: false }),
        supabase.from('faculty_travel').select('*').order('departure_date', { ascending: false }),
        supabase.from('waste').select('*').order('date', { ascending: false })
      ]);
      setFuelBills(fuel.data || []);
      setDayStudents(day.data || []);
      setUsBoardingStudents(us.data || []);
      setIntlStudents(intl.data || []);
      setStudyAbroad(sa.data || []);
      setFacultyTravel(ft.data || []);
      setWasteRecords(waste.data || []);
    } catch (err) {
      setMessage('Error loading data: ' + err.message);
    }
    setLoading(false);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Editing state for the fuel form. When non-null, the form is in
  // edit mode for the row with this id and submitFuel will UPDATE
  // instead of INSERT. Cleared after a successful save / explicit
  // cancel.
  const [editingFuelId, setEditingFuelId] = useState(null);

  // Submit handlers
  const submitFuel = async (e) => {
    e.preventDefault();
    const gallonsNum = parseFloat(fuelForm.gallons);
    if (!Number.isFinite(gallonsNum) || gallonsNum < 0) {
      showMessage(`Error: gallons must be a non-negative number (got "${fuelForm.gallons}")`);
      return;
    }
    let costNum = null;
    if (fuelForm.cost) {
      costNum = parseFloat(fuelForm.cost);
      if (!Number.isFinite(costNum) || costNum < 0) {
        showMessage(`Error: cost must be a non-negative number (got "${fuelForm.cost}")`);
        return;
      }
    }
    const fuelRow = {
      date: fuelForm.date,
      fuel_type: fuelForm.fuel_type,
      gallons: gallonsNum,
      cost: costNum,
      notes: fuelForm.notes || null
    };
    try {
      if (editingFuelId) {
        const { error } = await supabase.from('fuel_bills').update(fuelRow).eq('id', editingFuelId);
        if (error) throw error;
        logAdminWrite({ action: 'update', table: 'fuel_bills', payload: { id: editingFuelId, ...fuelRow } });
        showMessage('✓ Fuel bill updated!');
      } else {
        const { error } = await supabase.from('fuel_bills').insert([fuelRow]);
        if (error) throw error;
        logAdminWrite({ action: 'insert', table: 'fuel_bills', payload: fuelRow });
        showMessage('✓ Fuel bill added!');
      }
      setFuelForm({ date: '', fuel_type: 'Propane', gallons: '', cost: '', notes: '' });
      setEditingFuelId(null);
      fetchAllData();
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  const fillFuelForm = (b) => {
    setFuelForm({
      date: b.date || '',
      fuel_type: b.fuel_type || 'Propane',
      gallons: b.gallons != null ? String(b.gallons) : '',
      cost: b.cost != null ? String(b.cost) : '',
      notes: b.notes || '',
    });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const startEditFuel = (b) => { fillFuelForm(b); setEditingFuelId(b.id); };
  // Pre-fill the form with the row's values but DON'T set editingId
  // — submit will INSERT a new row. Useful for entering recurring
  // deliveries / repeated trips. Caller can tweak the form before
  // saving.
  const duplicateFuel = (b) => { fillFuelForm(b); setEditingFuelId(null); };

  const cancelEditFuel = () => {
    setEditingFuelId(null);
    setFuelForm({ date: '', fuel_type: 'Propane', gallons: '', cost: '', notes: '' });
  };

  // Edit state for each student / travel table — same pattern as
  // fuel + waste. When non-null, submit performs UPDATE...WHERE id;
  // otherwise INSERT.
  const [editingDayId, setEditingDayId] = useState(null);
  const [editingUsId, setEditingUsId] = useState(null);
  const [editingIntlId, setEditingIntlId] = useState(null);
  const [editingSaId, setEditingSaId] = useState(null);
  const [editingFtId, setEditingFtId] = useState(null);

  // Generic upsert helper to keep the per-table submit handlers tiny.
  // Returns { ok, error } so callers can branch on success messaging.
  const upsertRow = async (table, row, editingId) => {
    if (editingId) {
      const { error } = await supabase.from(table).update(row).eq('id', editingId);
      if (error) return { ok: false, error };
      logAdminWrite({ action: 'update', table, payload: { id: editingId, ...row } });
    } else {
      const { error } = await supabase.from(table).insert([row]);
      if (error) return { ok: false, error };
      logAdminWrite({ action: 'insert', table, payload: row });
    }
    return { ok: true };
  };

  const submitDayStudent = async (e) => {
    e.preventDefault();
    const r = await upsertRow('day_students', dayForm, editingDayId);
    if (!r.ok) { showMessage('Error: ' + r.error.message); return; }
    showMessage(editingDayId ? '✓ Day student updated!' : '✓ Day student added!');
    setDayForm({ zip_code: '', graduation_year: '2026', school_year: '2025-2026' });
    setEditingDayId(null);
    fetchAllData();
  };
  const fillDayForm = (s) => {
    setDayForm({
      zip_code: s.zip_code || '',
      graduation_year: s.graduation_year != null ? String(s.graduation_year) : '2026',
      school_year: s.school_year || '2025-2026',
    });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const startEditDay = (s) => { fillDayForm(s); setEditingDayId(s.id); };
  const duplicateDay = (s) => { fillDayForm(s); setEditingDayId(null); };
  const cancelEditDay = () => { setEditingDayId(null); setDayForm({ zip_code: '', graduation_year: '2026', school_year: '2025-2026' }); };

  const submitUSStudent = async (e) => {
    e.preventDefault();
    const r = await upsertRow('us_boarding_students', usForm, editingUsId);
    if (!r.ok) { showMessage('Error: ' + r.error.message); return; }
    showMessage(editingUsId ? '✓ US boarding student updated!' : '✓ US boarding student added!');
    setUsForm({ zip_code: '', state: '', graduation_year: '2026', school_year: '2025-2026' });
    setEditingUsId(null);
    fetchAllData();
  };
  const fillUsForm = (s) => {
    setUsForm({
      zip_code: s.zip_code || '',
      state: s.state || '',
      graduation_year: s.graduation_year != null ? String(s.graduation_year) : '2026',
      school_year: s.school_year || '2025-2026',
    });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const startEditUs = (s) => { fillUsForm(s); setEditingUsId(s.id); };
  const duplicateUs = (s) => { fillUsForm(s); setEditingUsId(null); };
  const cancelEditUs = () => { setEditingUsId(null); setUsForm({ zip_code: '', state: '', graduation_year: '2026', school_year: '2025-2026' }); };

  const submitIntlStudent = async (e) => {
    e.preventDefault();
    const r = await upsertRow('international_students', intlForm, editingIntlId);
    if (!r.ok) { showMessage('Error: ' + r.error.message); return; }
    showMessage(editingIntlId ? '✓ International student updated!' : '✓ International student added!');
    setIntlForm({ country: '', graduation_year: '2026', school_year: '2025-2026' });
    setEditingIntlId(null);
    fetchAllData();
  };
  const fillIntlForm = (s) => {
    setIntlForm({
      country: s.country || '',
      graduation_year: s.graduation_year != null ? String(s.graduation_year) : '2026',
      school_year: s.school_year || '2025-2026',
    });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const startEditIntl = (s) => { fillIntlForm(s); setEditingIntlId(s.id); };
  const duplicateIntl = (s) => { fillIntlForm(s); setEditingIntlId(null); };
  const cancelEditIntl = () => { setEditingIntlId(null); setIntlForm({ country: '', graduation_year: '2026', school_year: '2025-2026' }); };

  const submitStudyAbroad = async (e) => {
    e.preventDefault();
    const r = await upsertRow('study_abroad', saForm, editingSaId);
    if (!r.ok) { showMessage('Error: ' + r.error.message); return; }
    showMessage(editingSaId ? '✓ Study abroad trip updated!' : '✓ Study abroad trip added!');
    setSaForm({ destination_country: '', destination_city: '', departure_date: '', return_date: '', school_year: '2025-2026' });
    setEditingSaId(null);
    fetchAllData();
  };
  const fillSaForm = (t) => {
    setSaForm({
      destination_country: t.destination_country || '',
      destination_city: t.destination_city || '',
      departure_date: t.departure_date || '',
      return_date: t.return_date || '',
      school_year: t.school_year || '2025-2026',
    });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const startEditSa = (t) => { fillSaForm(t); setEditingSaId(t.id); };
  const duplicateSa = (t) => { fillSaForm(t); setEditingSaId(null); };
  const cancelEditSa = () => { setEditingSaId(null); setSaForm({ destination_country: '', destination_city: '', departure_date: '', return_date: '', school_year: '2025-2026' }); };

  const submitFacultyTravel = async (e) => {
    e.preventDefault();
    const r = await upsertRow('faculty_travel', ftForm, editingFtId);
    if (!r.ok) { showMessage('Error: ' + r.error.message); return; }
    showMessage(editingFtId ? '✓ Faculty travel updated!' : '✓ Faculty travel added!');
    setFtForm({ destination_country: '', destination_city: '', trip_purpose: 'Conference', departure_date: '', return_date: '' });
    setEditingFtId(null);
    fetchAllData();
  };
  const fillFtForm = (t) => {
    setFtForm({
      destination_country: t.destination_country || '',
      destination_city: t.destination_city || '',
      trip_purpose: t.trip_purpose || 'Conference',
      departure_date: t.departure_date || '',
      return_date: t.return_date || '',
    });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const startEditFt = (t) => { fillFtForm(t); setEditingFtId(t.id); };
  const duplicateFt = (t) => { fillFtForm(t); setEditingFtId(null); };
  const cancelEditFt = () => { setEditingFtId(null); setFtForm({ destination_country: '', destination_city: '', trip_purpose: 'Conference', departure_date: '', return_date: '' }); };

  const [editingWasteId, setEditingWasteId] = useState(null);

  const submitWaste = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(wasteForm.amount);
    if (!Number.isFinite(amountNum) || amountNum < 0) {
      showMessage(`Error: amount must be a non-negative number (got "${wasteForm.amount}")`);
      return;
    }
    const wasteRow = {
      date: wasteForm.date,
      waste_type: wasteForm.waste_type,
      amount: amountNum,
      unit: wasteForm.unit,
      notes: wasteForm.notes || null,
      school_year: wasteForm.school_year
    };
    try {
      if (editingWasteId) {
        const { error } = await supabase.from('waste').update(wasteRow).eq('id', editingWasteId);
        if (error) throw error;
        logAdminWrite({ action: 'update', table: 'waste', payload: { id: editingWasteId, ...wasteRow } });
        showMessage('✓ Waste record updated!');
      } else {
        const { error } = await supabase.from('waste').insert([wasteRow]);
        if (error) throw error;
        logAdminWrite({ action: 'insert', table: 'waste', payload: wasteRow });
        showMessage('✓ Waste record added!');
      }
      setWasteForm({ date: '', waste_type: 'Landfill', amount: '', unit: 'tons', notes: '', school_year: '2025-2026' });
      setEditingWasteId(null);
      fetchAllData();
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  const fillWasteForm = (w) => {
    setWasteForm({
      date: w.date || '',
      waste_type: w.waste_type || 'Landfill',
      amount: w.amount != null ? String(w.amount) : '',
      unit: w.unit || 'tons',
      notes: w.notes || '',
      school_year: w.school_year || '2025-2026',
    });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const startEditWaste = (w) => { fillWasteForm(w); setEditingWasteId(w.id); };
  const duplicateWaste = (w) => { fillWasteForm(w); setEditingWasteId(null); };

  const cancelEditWaste = () => {
    setEditingWasteId(null);
    setWasteForm({ date: '', waste_type: 'Landfill', amount: '', unit: 'tons', notes: '', school_year: '2025-2026' });
  };

  const deleteRecord = async (table, id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      logAdminWrite({ action: 'delete', table, payload: { id } });
      fetchAllData();
    } catch (err) {
      showMessage('Error: ' + err.message);
    }
  };

  // Plaintext substring filter applied to whichever records list is
  // active on the current tab. Stringifies each row's values and does
  // a case-insensitive substring match — cheap, ad-hoc, and good
  // enough for the "find that delivery from January" use case.
  const [recordsFilter, setRecordsFilter] = useState('');
  const matchesFilter = (row) => {
    const q = recordsFilter.trim().toLowerCase();
    if (!q) return true;
    return Object.values(row).some((v) => v != null && String(v).toLowerCase().includes(q));
  };
  const filteredFuelBills            = fuelBills.filter(matchesFilter);
  const filteredDayStudents          = dayStudents.filter(matchesFilter);
  const filteredUsBoardingStudents   = usBoardingStudents.filter(matchesFilter);
  const filteredIntlStudents         = intlStudents.filter(matchesFilter);
  const filteredStudyAbroad          = studyAbroad.filter(matchesFilter);
  const filteredFacultyTravel        = facultyTravel.filter(matchesFilter);
  const filteredWasteRecords         = wasteRecords.filter(matchesFilter);

  // Helper that downloads a single Supabase table as a CSV. Builds
  // a date-stamped filename so consecutive exports don't clobber each
  // other in the admin's downloads folder.
  const exportCsv = (rows, tableName) => {
    if (!Array.isArray(rows) || rows.length === 0) {
      showMessage(`No ${tableName} rows to export.`);
      return;
    }
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`kua_${tableName}_${stamp}.csv`, toCsv(rows));
  };


  // Calculate emissions
  const calcFuelEmissions = (gallons, type) => ((parseFloat(gallons) || 0) * (fuelFactors[type] || 0) / 1000).toFixed(3);
  const calcWasteEmissions = (amount, unit, type) => {
    let tons = parseFloat(amount) || 0;
    if (unit === 'lbs') tons = tons / 2000;
    if (unit === 'cubic yards') tons = tons * 0.4;
    return (tons * (wasteFactors[type] || 0)).toFixed(3);
  };

  // parseFloat(null/undefined) is NaN, and NaN propagates through the
  // running sum so any single null gallons row turned the headline
  // total into NaN. `Number(...) || 0` (or || on parseFloat) coerces
  // each row's value to 0 if non-finite — bad rows drop out of the sum
  // instead of poisoning it.
  const totalFuelEmissions = fuelBills.reduce((sum, b) => {
    const gallons = parseFloat(b.gallons);
    if (!Number.isFinite(gallons)) return sum;
    return sum + gallons * (fuelFactors[b.fuel_type] || 0);
  }, 0) / 1000;
  const totalWasteEmissions = wasteRecords.reduce((sum, w) => {
    let tons = parseFloat(w.amount);
    if (!Number.isFinite(tons)) return sum;
    if (w.unit === 'lbs') tons = tons / 2000;
    if (w.unit === 'cubic yards') tons = tons * 0.4;
    return sum + (tons * (wasteFactors[w.waste_type] || 0));
  }, 0);

  // Login screen
  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.loginBox}>
          <div style={styles.logo}>KUA</div>
          <h1 style={styles.title}>Admin Portal</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} style={styles.submitBtn}>Login</button>
          {error && <p style={styles.error}>{error}</p>}
          <a href="/" style={styles.link}>← Back to Dashboard</a>
        </div>
      </div>
    );
  }

  // Main portal
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>KUA</div>
        <h1 style={styles.title}>Admin Portal</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </header>

      {message && <div style={{...styles.message, backgroundColor: message.includes('Error') ? '#7f1d1d' : '#14532d'}}>{message}</div>}

      {/* Tabs */}
      <div style={styles.tabs}>
        {['fuel', 'students', 'travel', 'waste'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{...styles.tab, backgroundColor: activeTab === tab ? '#22c55e' : '#334155'}}
          >
            {tab === 'fuel' && '⛽ Fuel'}
            {tab === 'students' && '🎓 Students'}
            {tab === 'travel' && '✈️ Travel'}
            {tab === 'waste' && '🗑️ Waste'}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {loading && <p style={styles.loading}>Loading...</p>}

        <div style={styles.filterRow}>
          <input
            type="search"
            value={recordsFilter}
            onChange={(e) => setRecordsFilter(e.target.value)}
            placeholder="Filter records (date, name, fuel type, country, …)"
            style={styles.filterInput}
            aria-label="Filter records"
          />
          {recordsFilter && (
            <button type="button" onClick={() => setRecordsFilter('')} style={styles.filterClear}>
              Clear
            </button>
          )}
        </div>

        {/* FUEL TAB */}
        {activeTab === 'fuel' && (
          <>
            <div style={styles.infoBox}>
              <strong>Emission Factors (EPA):</strong> Propane: 5.72 kg/gal | Heating Oil: 10.16 kg/gal | Diesel: 10.18 kg/gal | Gasoline: 8.89 kg/gal
            </div>
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h2 style={styles.cardTitle}>Add Fuel Bill</h2>
                <CsvImportPanel
                  tableName="fuel_bills"
                  labelSingular="fuel row"
                  columnsHint="date,fuel_type,gallons,cost,notes"
                  examplePlaceholder={'date,fuel_type,gallons,cost,notes\n2026-01-15,Heating Oil,5000,18000,Brockway Smith Jan delivery\n2026-02-20,Propane,300,750,'}
                  validateRow={validateFuelRow}
                  onComplete={fetchAllData}
                  onMessage={showMessage}
                />
              </div>

              <form onSubmit={submitFuel}>
                <div style={styles.formRow}>
                  <input type="date" value={fuelForm.date} onChange={(e) => setFuelForm({...fuelForm, date: e.target.value})} style={styles.input} required />
                  <select value={fuelForm.fuel_type} onChange={(e) => setFuelForm({...fuelForm, fuel_type: e.target.value})} style={styles.input}>
                    <option>Propane</option>
                    <option>Heating Oil</option>
                    <option>Diesel</option>
                    <option>Gasoline</option>
                  </select>
                  <input type="number" step="0.01" placeholder="Gallons" value={fuelForm.gallons} onChange={(e) => setFuelForm({...fuelForm, gallons: e.target.value})} style={styles.input} required />
                  <input type="number" step="0.01" placeholder="Cost ($)" value={fuelForm.cost} onChange={(e) => setFuelForm({...fuelForm, cost: e.target.value})} style={styles.input} />
                </div>
                <input type="text" placeholder="Notes (optional)" value={fuelForm.notes} onChange={(e) => setFuelForm({...fuelForm, notes: e.target.value})} style={{...styles.input, marginBottom: '10px'}} />
                {fuelForm.gallons && <p style={styles.preview}>Emissions: <strong>{calcFuelEmissions(fuelForm.gallons, fuelForm.fuel_type)} mtCO2e</strong></p>}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button type="submit" style={styles.submitBtn}>
                    {editingFuelId ? 'Update Fuel Bill' : 'Add Fuel Bill'}
                  </button>
                  {editingFuelId && (
                    <button type="button" onClick={cancelEditFuel} style={styles.cancelBtn}>
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h2 style={styles.cardTitle}>Fuel Records ({fuelBills.length}) — Total: {totalFuelEmissions.toFixed(2)} mtCO2e</h2>
                {fuelBills.length > 0 && <button type="button" onClick={() => exportCsv(fuelBills, 'fuel_bills')} style={styles.csvBtn}>Download CSV</button>}
              </div>
              {fuelBills.length === 0 ? <p style={styles.noData}>No records yet</p> : filteredFuelBills.length === 0 ? <p style={styles.noData}>No matches for "{recordsFilter}"</p> : (
                <div style={styles.list}>
                  {filteredFuelBills.map(b => (
                    <div key={b.id} style={{ ...styles.listItem, ...(editingFuelId === b.id ? styles.listItemEditing : {}) }}>
                      <div>
                        <strong>{b.fuel_type}</strong> — {b.date} — {b.gallons} gal {b.cost && `— $${b.cost}`}
                        <br /><small style={{color: '#f97316'}}>{calcFuelEmissions(b.gallons, b.fuel_type)} mtCO2e</small>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" aria-label="Edit record" onClick={() => startEditFuel(b)} style={styles.editBtn}>✎</button>
                        <button type="button" aria-label="Duplicate record" onClick={() => duplicateFuel(b)} style={styles.editBtn}>⎘</button>
                        <button type="button" aria-label="Delete record" onClick={() => deleteRecord('fuel_bills', b.id)} style={styles.deleteBtn}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
          <>
            <div style={styles.infoBox}>
              <strong>Day:</strong> 360 trips × distance × 0.404 kg/mile | <strong>US Boarding:</strong> 5 trips | <strong>International:</strong> 3 trips × 0.152 kg/mile
            </div>

            {/* Day Students */}
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h2 style={styles.cardTitle}>Day Students ({dayStudents.length})</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {dayStudents.length > 0 && <button type="button" onClick={() => exportCsv(dayStudents, 'day_students')} style={styles.csvBtn}>Download CSV</button>}
                  <CsvImportPanel
                    tableName="day_students"
                    labelSingular="day student"
                    columnsHint="zip_code,graduation_year,school_year"
                    examplePlaceholder={'zip_code,graduation_year,school_year\n03753,2026,2025-2026\n03781,2027,2025-2026'}
                    validateRow={validateDayStudentRow}
                    onComplete={fetchAllData}
                    onMessage={showMessage}
                  />
                </div>
              </div>
              <form onSubmit={submitDayStudent}>
                <div style={styles.formRow}>
                  <input type="text" placeholder="Zip Code" value={dayForm.zip_code} onChange={(e) => setDayForm({...dayForm, zip_code: e.target.value})} style={styles.input} required />
                  <select value={dayForm.graduation_year} onChange={(e) => setDayForm({...dayForm, graduation_year: e.target.value})} style={styles.input}>
                    {['2025','2026','2027','2028','2029','2030'].map(y => <option key={y}>{y}</option>)}
                  </select>
                  <button type="submit" style={styles.submitBtn}>{editingDayId ? 'Update' : 'Add'}</button>
                  {editingDayId && <button type="button" onClick={cancelEditDay} style={styles.cancelBtn}>Cancel</button>}
                </div>
              </form>
              {dayStudents.length > 0 && filteredDayStudents.length === 0 && <p style={styles.noData}>No matches for "{recordsFilter}"</p>}
              {filteredDayStudents.length > 0 && (
                <div style={styles.list}>
                  {filteredDayStudents.map(s => (
                    <div key={s.id} style={{ ...styles.listItem, ...(editingDayId === s.id ? styles.listItemEditing : {}) }}>
                      <span>Zip: {s.zip_code} | Class of {s.graduation_year}</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" aria-label="Edit record" onClick={() => startEditDay(s)} style={styles.editBtn}>✎</button>
                        <button type="button" aria-label="Duplicate record" onClick={() => duplicateDay(s)} style={styles.editBtn}>⎘</button>
                        <button type="button" aria-label="Delete record" onClick={() => deleteRecord('day_students', s.id)} style={styles.deleteBtn}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* US Boarding */}
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h2 style={styles.cardTitle}>US Boarding Students ({usBoardingStudents.length})</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {usBoardingStudents.length > 0 && <button type="button" onClick={() => exportCsv(usBoardingStudents, 'us_boarding_students')} style={styles.csvBtn}>Download CSV</button>}
                  <CsvImportPanel
                    tableName="us_boarding_students"
                    labelSingular="US boarder"
                    columnsHint="zip_code,state,graduation_year,school_year"
                    examplePlaceholder={'zip_code,state,graduation_year,school_year\n10001,NY,2026,2025-2026\n02115,MA,2027,2025-2026'}
                    validateRow={validateUSStudentRow}
                    onComplete={fetchAllData}
                    onMessage={showMessage}
                  />
                </div>
              </div>
              <form onSubmit={submitUSStudent}>
                <div style={styles.formRow}>
                  <input type="text" placeholder="Zip Code" value={usForm.zip_code} onChange={(e) => setUsForm({...usForm, zip_code: e.target.value})} style={styles.input} required />
                  <input type="text" placeholder="State" value={usForm.state} onChange={(e) => setUsForm({...usForm, state: e.target.value.toUpperCase()})} style={styles.input} maxLength="2" />
                  <select value={usForm.graduation_year} onChange={(e) => setUsForm({...usForm, graduation_year: e.target.value})} style={styles.input}>
                    {['2025','2026','2027','2028','2029','2030'].map(y => <option key={y}>{y}</option>)}
                  </select>
                  <button type="submit" style={styles.submitBtn}>{editingUsId ? 'Update' : 'Add'}</button>
                  {editingUsId && <button type="button" onClick={cancelEditUs} style={styles.cancelBtn}>Cancel</button>}
                </div>
              </form>
              {usBoardingStudents.length > 0 && filteredUsBoardingStudents.length === 0 && <p style={styles.noData}>No matches for "{recordsFilter}"</p>}
              {filteredUsBoardingStudents.length > 0 && (
                <div style={styles.list}>
                  {filteredUsBoardingStudents.map(s => (
                    <div key={s.id} style={{ ...styles.listItem, ...(editingUsId === s.id ? styles.listItemEditing : {}) }}>
                      <span>{s.state || '?'} - {s.zip_code} | Class of {s.graduation_year}</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" aria-label="Edit record" onClick={() => startEditUs(s)} style={styles.editBtn}>✎</button>
                        <button type="button" aria-label="Duplicate record" onClick={() => duplicateUs(s)} style={styles.editBtn}>⎘</button>
                        <button type="button" aria-label="Delete record" onClick={() => deleteRecord('us_boarding_students', s.id)} style={styles.deleteBtn}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* International */}
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h2 style={styles.cardTitle}>International Students ({intlStudents.length})</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {intlStudents.length > 0 && <button type="button" onClick={() => exportCsv(intlStudents, 'international_students')} style={styles.csvBtn}>Download CSV</button>}
                  <CsvImportPanel
                    tableName="international_students"
                    labelSingular="international"
                    columnsHint="country,graduation_year,school_year"
                    examplePlaceholder={'country,graduation_year,school_year\nChina,2026,2025-2026\nKorea,2027,2025-2026'}
                    validateRow={validateIntlStudentRow}
                    onComplete={fetchAllData}
                    onMessage={showMessage}
                  />
                </div>
              </div>
              <form onSubmit={submitIntlStudent}>
                <div style={styles.formRow}>
                  <input type="text" placeholder="Country" value={intlForm.country} onChange={(e) => setIntlForm({...intlForm, country: e.target.value})} style={styles.input} required />
                  <select value={intlForm.graduation_year} onChange={(e) => setIntlForm({...intlForm, graduation_year: e.target.value})} style={styles.input}>
                    {['2025','2026','2027','2028','2029','2030'].map(y => <option key={y}>{y}</option>)}
                  </select>
                  <button type="submit" style={styles.submitBtn}>{editingIntlId ? 'Update' : 'Add'}</button>
                  {editingIntlId && <button type="button" onClick={cancelEditIntl} style={styles.cancelBtn}>Cancel</button>}
                </div>
              </form>
              {intlStudents.length > 0 && filteredIntlStudents.length === 0 && <p style={styles.noData}>No matches for "{recordsFilter}"</p>}
              {filteredIntlStudents.length > 0 && (
                <div style={styles.list}>
                  {filteredIntlStudents.map(s => (
                    <div key={s.id} style={{ ...styles.listItem, ...(editingIntlId === s.id ? styles.listItemEditing : {}) }}>
                      <span>{s.country} | Class of {s.graduation_year}</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" aria-label="Edit record" onClick={() => startEditIntl(s)} style={styles.editBtn}>✎</button>
                        <button type="button" aria-label="Duplicate record" onClick={() => duplicateIntl(s)} style={styles.editBtn}>⎘</button>
                        <button type="button" aria-label="Delete record" onClick={() => deleteRecord('international_students', s.id)} style={styles.deleteBtn}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* TRAVEL TAB */}
        {activeTab === 'travel' && (
          <>
            <div style={styles.infoBox}>
              <strong>Flight Factors:</strong> Short (&lt;300mi): 0.255 | Medium: 0.182 | Long (&gt;2300mi): 0.152 kg CO2/mile
            </div>

            {/* Study Abroad */}
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h2 style={styles.cardTitle}>Study Abroad ({studyAbroad.length})</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {studyAbroad.length > 0 && <button type="button" onClick={() => exportCsv(studyAbroad, 'study_abroad')} style={styles.csvBtn}>Download CSV</button>}
                  <CsvImportPanel
                    tableName="study_abroad"
                    labelSingular="trip"
                    columnsHint="destination_country,destination_city,departure_date,return_date,school_year"
                    examplePlaceholder={'destination_country,destination_city,departure_date,return_date,school_year\nSpain,Madrid,2026-09-01,2026-12-15,2026-2027'}
                    validateRow={validateStudyAbroadRow}
                    onComplete={fetchAllData}
                    onMessage={showMessage}
                  />
                </div>
              </div>
              <form onSubmit={submitStudyAbroad}>
                <div style={styles.formRow}>
                  <input type="text" placeholder="Country" value={saForm.destination_country} onChange={(e) => setSaForm({...saForm, destination_country: e.target.value})} style={styles.input} required />
                  <input type="text" placeholder="City" value={saForm.destination_city} onChange={(e) => setSaForm({...saForm, destination_city: e.target.value})} style={styles.input} />
                  <input type="date" placeholder="Departure" value={saForm.departure_date} onChange={(e) => setSaForm({...saForm, departure_date: e.target.value})} style={styles.input} />
                  <input type="date" placeholder="Return" value={saForm.return_date} onChange={(e) => setSaForm({...saForm, return_date: e.target.value})} style={styles.input} />
                  <button type="submit" style={styles.submitBtn}>{editingSaId ? 'Update' : 'Add'}</button>
                  {editingSaId && <button type="button" onClick={cancelEditSa} style={styles.cancelBtn}>Cancel</button>}
                </div>
              </form>
              {studyAbroad.length > 0 && filteredStudyAbroad.length === 0 && <p style={styles.noData}>No matches for "{recordsFilter}"</p>}
              {filteredStudyAbroad.length > 0 && (
                <div style={styles.list}>
                  {filteredStudyAbroad.map(t => (
                    <div key={t.id} style={{ ...styles.listItem, ...(editingSaId === t.id ? styles.listItemEditing : {}) }}>
                      <span>{t.destination_city && `${t.destination_city}, `}{t.destination_country} | {t.departure_date || 'TBD'}</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" aria-label="Edit record" onClick={() => startEditSa(t)} style={styles.editBtn}>✎</button>
                        <button type="button" aria-label="Duplicate record" onClick={() => duplicateSa(t)} style={styles.editBtn}>⎘</button>
                        <button type="button" aria-label="Delete record" onClick={() => deleteRecord('study_abroad', t.id)} style={styles.deleteBtn}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Faculty Travel */}
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h2 style={styles.cardTitle}>Faculty Travel ({facultyTravel.length})</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {facultyTravel.length > 0 && <button type="button" onClick={() => exportCsv(facultyTravel, 'faculty_travel')} style={styles.csvBtn}>Download CSV</button>}
                  <CsvImportPanel
                    tableName="faculty_travel"
                    labelSingular="trip"
                    columnsHint="destination_country,destination_city,trip_purpose,departure_date,return_date"
                    examplePlaceholder={'destination_country,destination_city,trip_purpose,departure_date,return_date\nUSA,Boston,Conference,2026-04-12,2026-04-14'}
                    validateRow={validateFacultyTravelRow}
                    onComplete={fetchAllData}
                    onMessage={showMessage}
                  />
                </div>
              </div>
              <form onSubmit={submitFacultyTravel}>
                <div style={styles.formRow}>
                  <input type="text" placeholder="Country" value={ftForm.destination_country} onChange={(e) => setFtForm({...ftForm, destination_country: e.target.value})} style={styles.input} required />
                  <input type="text" placeholder="City" value={ftForm.destination_city} onChange={(e) => setFtForm({...ftForm, destination_city: e.target.value})} style={styles.input} />
                  <select value={ftForm.trip_purpose} onChange={(e) => setFtForm({...ftForm, trip_purpose: e.target.value})} style={styles.input}>
                    <option>Admissions</option>
                    <option>Conference</option>
                    <option>Professional Development</option>
                    <option>Athletic</option>
                    <option>Other</option>
                  </select>
                  <button type="submit" style={styles.submitBtn}>{editingFtId ? 'Update' : 'Add'}</button>
                  {editingFtId && <button type="button" onClick={cancelEditFt} style={styles.cancelBtn}>Cancel</button>}
                </div>
              </form>
              {facultyTravel.length > 0 && filteredFacultyTravel.length === 0 && <p style={styles.noData}>No matches for "{recordsFilter}"</p>}
              {filteredFacultyTravel.length > 0 && (
                <div style={styles.list}>
                  {filteredFacultyTravel.map(t => (
                    <div key={t.id} style={{ ...styles.listItem, ...(editingFtId === t.id ? styles.listItemEditing : {}) }}>
                      <span>{t.destination_city && `${t.destination_city}, `}{t.destination_country} | {t.trip_purpose}</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" aria-label="Edit record" onClick={() => startEditFt(t)} style={styles.editBtn}>✎</button>
                        <button type="button" aria-label="Duplicate record" onClick={() => duplicateFt(t)} style={styles.editBtn}>⎘</button>
                        <button type="button" aria-label="Delete record" onClick={() => deleteRecord('faculty_travel', t.id)} style={styles.deleteBtn}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* WASTE TAB */}
        {activeTab === 'waste' && (
          <>
            <div style={styles.infoBox}>
              <strong>Factors:</strong> Landfill: 0.52 | Recycling: -0.10 | Composting: 0.04 | Hazardous: 0.50 | E-Waste: 0.30 mtCO2e/ton
            </div>
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h2 style={styles.cardTitle}>Add Waste Record</h2>
                <CsvImportPanel
                  tableName="waste"
                  labelSingular="waste row"
                  columnsHint="date,waste_type,amount,unit,notes,school_year"
                  examplePlaceholder={'date,waste_type,amount,unit,notes,school_year\n2026-01-15,Landfill,2.4,tons,Monthly haul,2025-2026\n2026-01-15,Recycling,1.1,tons,,2025-2026'}
                  validateRow={validateWasteRow}
                  onComplete={fetchAllData}
                  onMessage={showMessage}
                />
              </div>

              <form onSubmit={submitWaste}>
                <div style={styles.formRow}>
                  <input type="date" value={wasteForm.date} onChange={(e) => setWasteForm({...wasteForm, date: e.target.value})} style={styles.input} required />
                  <select value={wasteForm.waste_type} onChange={(e) => setWasteForm({...wasteForm, waste_type: e.target.value})} style={styles.input}>
                    <option>Landfill</option>
                    <option>Recycling</option>
                    <option>Composting</option>
                    <option>Hazardous</option>
                    <option>E-Waste</option>
                  </select>
                  <input type="number" step="0.01" placeholder="Amount" value={wasteForm.amount} onChange={(e) => setWasteForm({...wasteForm, amount: e.target.value})} style={styles.input} required />
                  <select value={wasteForm.unit} onChange={(e) => setWasteForm({...wasteForm, unit: e.target.value})} style={styles.input}>
                    <option>tons</option>
                    <option>lbs</option>
                    <option>cubic yards</option>
                  </select>
                </div>
                <input type="text" placeholder="Notes (optional)" value={wasteForm.notes} onChange={(e) => setWasteForm({...wasteForm, notes: e.target.value})} style={{...styles.input, marginBottom: '10px'}} />
                {wasteForm.amount && <p style={{...styles.preview, color: parseFloat(calcWasteEmissions(wasteForm.amount, wasteForm.unit, wasteForm.waste_type)) < 0 ? '#22c55e' : '#f97316'}}>
                  Emissions: <strong>{calcWasteEmissions(wasteForm.amount, wasteForm.unit, wasteForm.waste_type)} mtCO2e</strong>
                </p>}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button type="submit" style={styles.submitBtn}>
                    {editingWasteId ? 'Update Waste Record' : 'Add Waste Record'}
                  </button>
                  {editingWasteId && (
                    <button type="button" onClick={cancelEditWaste} style={styles.cancelBtn}>
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h2 style={styles.cardTitle}>Waste Records ({wasteRecords.length}) — Net: {totalWasteEmissions.toFixed(2)} mtCO2e</h2>
                {wasteRecords.length > 0 && <button type="button" onClick={() => exportCsv(wasteRecords, 'waste')} style={styles.csvBtn}>Download CSV</button>}
              </div>
              {wasteRecords.length === 0 ? <p style={styles.noData}>No records yet</p> : filteredWasteRecords.length === 0 ? <p style={styles.noData}>No matches for "{recordsFilter}"</p> : (
                <div style={styles.list}>
                  {filteredWasteRecords.map(w => {
                    const em = parseFloat(calcWasteEmissions(w.amount, w.unit, w.waste_type));
                    return (
                      <div key={w.id} style={{ ...styles.listItem, ...(editingWasteId === w.id ? styles.listItemEditing : {}) }}>
                        <div>
                          <strong>{w.waste_type}</strong> — {w.date} — {w.amount} {w.unit}
                          <br /><small style={{color: em < 0 ? '#22c55e' : '#f97316'}}>{em >= 0 ? '+' : ''}{em} mtCO2e</small>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button type="button" aria-label="Edit record" onClick={() => startEditWaste(w)} style={styles.editBtn}>✎</button>
                          <button type="button" aria-label="Duplicate record" onClick={() => duplicateWaste(w)} style={styles.editBtn}>⎘</button>
                          <button type="button" aria-label="Delete record" onClick={() => deleteRecord('waste', w.id)} style={styles.deleteBtn}>🗑️</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Formula Reference */}
        <div style={styles.formulaBox}>
          <h3>📐 Emission Formulas</h3>
          <div style={styles.formulaGrid}>
            <div><strong>Scope 1 - Fuel:</strong><br/>Gallons × Factor ÷ 1000 = mtCO2e</div>
            <div><strong>Scope 2 - Electricity:</strong><br/>kWh × 0.096 ÷ 1000 = mtCO2e</div>
            <div><strong>Scope 3 - Transport:</strong><br/>Miles × Factor ÷ 1000 = mtCO2e</div>
            <div><strong>Scope 3 - Waste:</strong><br/>Tons × Factor = mtCO2e</div>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <a href="/" style={styles.link}>← Back to Dashboard</a>
      </footer>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f172a', padding: '20px', fontFamily: 'system-ui, sans-serif', color: 'white' },
  loginBox: { maxWidth: '350px', margin: '100px auto', textAlign: 'center', backgroundColor: '#1e293b', padding: '40px', borderRadius: '16px' },
  logo: { width: '60px', height: '60px', backgroundColor: '#b91c1c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontWeight: 'bold', fontSize: '1.2rem' },
  header: { textAlign: 'center', marginBottom: '20px', position: 'relative' },
  title: { fontSize: '1.8rem', color: '#22c55e', margin: '10px 0' },
  logoutBtn: { position: 'absolute', top: '10px', right: '10px', padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  message: { maxWidth: '800px', margin: '0 auto 15px', padding: '12px', borderRadius: '8px', textAlign: 'center' },
  tabs: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  tab: { padding: '10px 20px', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.95rem' },
  content: { maxWidth: '800px', margin: '0 auto' },
  loading: { textAlign: 'center', color: '#94a3b8' },
  infoBox: { backgroundColor: '#1e3a5f', borderRadius: '8px', padding: '12px', marginBottom: '15px', fontSize: '0.85rem', color: '#93c5fd' },
  card: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', marginBottom: '15px' },
  cardTitle: { fontSize: '1.1rem', color: '#22c55e', marginBottom: '15px', margin: '0 0 15px 0' },
  cardHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 15 },
  csvBtn: { padding: '6px 14px', background: 'transparent', color: '#22c55e', border: '1px solid #22c55e', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.4, textTransform: 'uppercase' },
  filterRow: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 },
  filterInput: { flex: 1, minWidth: 240, padding: '8px 12px', background: '#0b1220', border: '1px solid #334155', borderRadius: 6, color: '#e5e7eb', fontSize: 13, fontFamily: 'inherit' },
  filterClear: { padding: '6px 12px', background: 'transparent', color: '#fbbf24', border: '1px solid #92400e', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  editBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#22d3ee', padding: '0 6px' },
  cancelBtn: { background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 4, padding: '8px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
  listItemEditing: { borderLeft: '3px solid #22d3ee', paddingLeft: '12px', background: 'rgba(34, 211, 238, 0.04)' },
  formRow: { display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' },
  input: { flex: 1, minWidth: '120px', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '0.95rem' },
  submitBtn: { padding: '10px 20px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  preview: { color: '#22c55e', fontSize: '0.9rem', marginBottom: '10px' },
  list: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#334155', borderRadius: '6px', padding: '10px 12px', fontSize: '0.9rem' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' },
  noData: { color: '#64748b', textAlign: 'center', padding: '15px' },
  formulaBox: { backgroundColor: '#1e3a5f', borderRadius: '12px', padding: '20px', marginTop: '20px' },
  formulaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', fontSize: '0.85rem', color: '#93c5fd' },
  footer: { textAlign: 'center', marginTop: '30px' },
  link: { color: '#22c55e', textDecoration: 'none' },
  error: { color: '#ef4444', marginTop: '10px' }
};

export default AdminPortal;
