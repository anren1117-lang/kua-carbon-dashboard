import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function AdminWaste() {
  const navigate = useNavigate();
  const [wasteRecords, setWasteRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    waste_type: 'Landfill',
    amount: '',
    unit: 'tons',
    notes: '',
    school_year: '2025-2026'
  });

  useEffect(() => {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
      navigate('/admin');
      return;
    }
    fetchWasteRecords();
  }, [navigate]);

  const fetchWasteRecords = async () => {
    const { data, error } = await supabase
      .from('waste')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      setMessage('Error loading data: ' + error.message);
    } else {
      setWasteRecords(data || []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('waste').insert([formData]);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Waste record added successfully!');
      setFormData({ date: '', waste_type: 'Landfill', amount: '', unit: 'tons', notes: '', school_year: '2025-2026' });
      fetchWasteRecords();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const { error } = await supabase.from('waste').delete().eq('id', id);
      if (error) {
        setMessage('Error deleting: ' + error.message);
      } else {
        fetchWasteRecords();
      }
    }
  };

  // Emission factors (mtCO2e per ton)
  const emissionFactors = {
    'Landfill': 0.52,
    'Recycling': -0.10,  // Avoided emissions (negative)
    'Composting': 0.04,
    'Hazardous': 0.50,
    'E-Waste': 0.30
  };

  // Convert to tons for calculation
  const convertToTons = (amount, unit) => {
    switch(unit) {
      case 'lbs': return amount / 2000;
      case 'cubic yards': return amount * 0.4; // approximate
      default: return amount; // already tons
    }
  };

  // Calculate totals by type
  const totals = wasteRecords.reduce((acc, record) => {
    const type = record.waste_type;
    const tons = convertToTons(parseFloat(record.amount) || 0, record.unit);
    if (!acc[type]) acc[type] = 0;
    acc[type] += tons;
    return acc;
  }, {});

  const totalEmissions = Object.entries(totals).reduce((sum, [type, tons]) => {
    return sum + (tons * (emissionFactors[type] || 0));
  }, 0);

  const wasteTypes = ['Landfill', 'Recycling', 'Composting', 'Hazardous', 'E-Waste'];
  const units = ['tons', 'lbs', 'cubic yards'];
  const schoolYears = ['2024-2025', '2025-2026', '2026-2027'];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/admin" style={styles.backBtn}>← Back</Link>
        <h1 style={styles.title}>🗑️ Waste</h1>
        <p style={styles.subtitle}>Track landfill, recycling, and composting data</p>
      </header>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.content}>
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>Emission Factors (per ton)</h3>
          <div style={styles.infoGrid}>
            <span>🗑️ Landfill: 0.52 mtCO2e</span>
            <span>♻️ Recycling: -0.10 mtCO2e (avoided)</span>
            <span>🌱 Composting: 0.04 mtCO2e</span>
            <span>☣️ Hazardous: 0.50 mtCO2e</span>
            <span>💻 E-Waste: 0.30 mtCO2e</span>
          </div>
        </div>

        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Add Waste Record</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} style={styles.input} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Waste Type</label>
                <select value={formData.waste_type} onChange={(e) => setFormData({...formData, waste_type: e.target.value})} style={styles.input}>
                  {wasteTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Amount</label>
                <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} style={styles.input} placeholder="Enter amount" required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Unit</label>
                <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} style={styles.input}>
                  {units.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>School Year</label>
                <select value={formData.school_year} onChange={(e) => setFormData({...formData, school_year: e.target.value})} style={styles.input}>
                  {schoolYears.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div style={styles.formGroup} style={{flex: 2}}>
                <label style={styles.label}>Notes</label>
                <input type="text" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} style={styles.input} placeholder="Optional notes" />
              </div>
            </div>
            <button type="submit" style={styles.submitBtn}>Add Waste Record</button>
          </form>
        </div>

        <div style={styles.statsSection}>
          <h2 style={styles.sectionTitle}>Summary</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Total Records</p>
              <p style={styles.statValue}>{wasteRecords.length}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Landfill</p>
              <p style={styles.statValue}>{(totals['Landfill'] || 0).toFixed(1)}</p>
              <p style={styles.statUnit}>tons</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Recycling</p>
              <p style={styles.statValue}>{(totals['Recycling'] || 0).toFixed(1)}</p>
              <p style={styles.statUnit}>tons</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Composting</p>
              <p style={styles.statValue}>{(totals['Composting'] || 0).toFixed(1)}</p>
              <p style={styles.statUnit}>tons</p>
            </div>
            <div style={{...styles.statCard, backgroundColor: totalEmissions > 0 ? '#7f1d1d' : '#14532d'}}>
              <p style={styles.statLabel}>Net Emissions</p>
              <p style={styles.statValue}>{totalEmissions.toFixed(2)}</p>
              <p style={styles.statUnit}>mtCO2e</p>
            </div>
          </div>
        </div>

        <div style={styles.listSection}>
          <h2 style={styles.sectionTitle}>Waste Records ({wasteRecords.length})</h2>
          {wasteRecords.length === 0 ? (
            <p style={styles.noData}>No waste records yet.</p>
          ) : (
            <div style={styles.list}>
              {wasteRecords.map((record) => {
                const tons = convertToTons(parseFloat(record.amount), record.unit);
                const emissions = tons * (emissionFactors[record.waste_type] || 0);
                return (
                  <div key={record.id} style={styles.listItem}>
                    <div style={styles.listInfo}>
                      <p style={styles.listTitle}>
                        {record.waste_type === 'Landfill' && '🗑️'}
                        {record.waste_type === 'Recycling' && '♻️'}
                        {record.waste_type === 'Composting' && '🌱'}
                        {record.waste_type === 'Hazardous' && '☣️'}
                        {record.waste_type === 'E-Waste' && '💻'}
                        {' '}{record.waste_type}
                      </p>
                      <p style={styles.listDetail}>
                        {record.date} • {record.amount} {record.unit} • {record.school_year}
                      </p>
                      {record.notes && <p style={styles.listNotes}>{record.notes}</p>}
                    </div>
                    <div style={styles.listEmissions}>
                      <p style={{...styles.emissionValue, color: emissions < 0 ? '#22c55e' : '#f97316'}}>
                        {emissions >= 0 ? '+' : ''}{emissions.toFixed(3)}
                      </p>
                      <p style={styles.emissionUnit}>mtCO2e</p>
                    </div>
                    <button onClick={() => handleDelete(record.id)} style={styles.deleteBtn}>🗑️</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f172a', padding: '20px', fontFamily: 'Arial', color: 'white' },
  header: { textAlign: 'center', marginBottom: '20px', position: 'relative' },
  backBtn: { position: 'absolute', left: '0', top: '0', color: '#22c55e', textDecoration: 'none', fontSize: '1rem' },
  title: { fontSize: '1.8rem', color: '#22c55e', marginBottom: '10px' },
  subtitle: { fontSize: '1rem', color: '#94a3b8' },
  message: { maxWidth: '900px', margin: '0 auto 20px', padding: '15px', backgroundColor: '#334155', borderRadius: '8px', textAlign: 'center' },
  content: { maxWidth: '900px', margin: '0 auto' },
  infoBox: { backgroundColor: '#1e3a5f', borderRadius: '8px', padding: '15px', marginBottom: '20px' },
  infoTitle: { color: '#93c5fd', marginBottom: '10px', fontSize: '1rem' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', fontSize: '0.85rem', color: '#93c5fd' },
  formSection: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '25px', marginBottom: '20px' },
  sectionTitle: { fontSize: '1.2rem', color: '#22c55e', marginBottom: '20px' },
  form: {},
  formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' },
  formGroup: {},
  label: { display: 'block', marginBottom: '5px', color: '#94a3b8', fontSize: '0.9rem' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '1rem', boxSizing: 'border-box' },
  submitBtn: { padding: '15px 30px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
  statsSection: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '25px', marginBottom: '20px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' },
  statCard: { backgroundColor: '#334155', borderRadius: '8px', padding: '15px', textAlign: 'center' },
  statLabel: { fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' },
  statValue: { fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' },
  statUnit: { fontSize: '0.75rem', color: '#64748b' },
  listSection: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '25px' },
  noData: { color: '#64748b', textAlign: 'center', padding: '20px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' },
  listItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#334155', borderRadius: '8px', padding: '15px' },
  listInfo: { flex: 1 },
  listTitle: { fontSize: '1rem', fontWeight: 'bold', color: '#e2e8f0', margin: '0 0 5px 0' },
  listDetail: { fontSize: '0.85rem', color: '#94a3b8', margin: 0 },
  listNotes: { fontSize: '0.8rem', color: '#64748b', margin: '5px 0 0 0', fontStyle: 'italic' },
  listEmissions: { textAlign: 'right', marginRight: '15px' },
  emissionValue: { fontSize: '1.1rem', fontWeight: 'bold', margin: 0 },
  emissionUnit: { fontSize: '0.7rem', color: '#64748b', margin: 0 },
  deleteBtn: { backgroundColor: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '5px' }
};

export default AdminWaste;
