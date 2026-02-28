import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function AdminFuel() {
  const navigate = useNavigate();
  const [fuelBills, setFuelBills] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    fuel_type: 'Propane',
    gallons: '',
    cost: '',
    notes: ''
  });

  useEffect(() => {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
      navigate('/admin');
      return;
    }
    fetchFuelBills();
  }, [navigate]);

  const fetchFuelBills = async () => {
    const { data, error } = await supabase
      .from('fuel_bills')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      setMessage('Error loading data: ' + error.message);
    } else {
      setFuelBills(data || []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('fuel_bills').insert([formData]);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Fuel bill added successfully!');
      setFormData({ date: '', fuel_type: 'Propane', gallons: '', cost: '', notes: '' });
      fetchFuelBills();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const { error } = await supabase.from('fuel_bills').delete().eq('id', id);
      if (error) {
        setMessage('Error deleting: ' + error.message);
      } else {
        fetchFuelBills();
      }
    }
  };

  // Calculate emissions
  const emissionFactors = {
    'Propane': 5.72,      // kg CO2 per gallon
    'Heating Oil': 10.16, // kg CO2 per gallon
    'Diesel': 10.21,      // kg CO2 per gallon
    'Gasoline': 8.89      // kg CO2 per gallon
  };

  const totalEmissions = fuelBills.reduce((sum, bill) => {
    const factor = emissionFactors[bill.fuel_type] || 0;
    return sum + (parseFloat(bill.gallons) * factor);
  }, 0);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/admin" style={styles.backBtn}>← Back</Link>
        <h1 style={styles.title}>⛽ Fuel Bills</h1>
        <p style={styles.subtitle}>Track propane, heating oil, and diesel usage</p>
      </header>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.content}>
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Add Fuel Bill</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Fuel Type</label>
              <select
                value={formData.fuel_type}
                onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
                style={styles.input}
              >
                <option>Propane</option>
                <option>Heating Oil</option>
                <option>Diesel</option>
                <option>Gasoline</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Gallons</label>
              <input
                type="number"
                step="0.01"
                value={formData.gallons}
                onChange={(e) => setFormData({...formData, gallons: e.target.value})}
                style={styles.input}
                placeholder="Enter gallons"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Cost ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                style={styles.input}
                placeholder="Enter cost"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Notes</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                style={styles.input}
                placeholder="Optional notes"
              />
            </div>
            <button type="submit" style={styles.submitBtn}>Add Fuel Bill</button>
          </form>
        </div>

        <div style={styles.statsSection}>
          <h2 style={styles.sectionTitle}>Summary</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Total Records</p>
              <p style={styles.statValue}>{fuelBills.length}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Total CO2 Emissions</p>
              <p style={styles.statValue}>{(totalEmissions / 1000).toFixed(2)}</p>
              <p style={styles.statUnit}>mtCO2e</p>
            </div>
          </div>
        </div>

        <div style={styles.listSection}>
          <h2 style={styles.sectionTitle}>Recent Fuel Bills ({fuelBills.length})</h2>
          {fuelBills.length === 0 ? (
            <p style={styles.noData}>No fuel bills recorded yet.</p>
          ) : (
            <div style={styles.list}>
              {fuelBills.map((bill) => (
                <div key={bill.id} style={styles.listItem}>
                  <div style={styles.listInfo}>
                    <p style={styles.listTitle}>{bill.fuel_type}</p>
                    <p style={styles.listDetail}>
                      {bill.date} • {bill.gallons} gallons • ${bill.cost || 'N/A'}
                    </p>
                    {bill.notes && <p style={styles.listNotes}>{bill.notes}</p>}
                  </div>
                  <div style={styles.listEmissions}>
                    <p style={styles.emissionValue}>
                      {((parseFloat(bill.gallons) * (emissionFactors[bill.fuel_type] || 0)) / 1000).toFixed(3)}
                    </p>
                    <p style={styles.emissionUnit}>mtCO2e</p>
                  </div>
                  <button onClick={() => handleDelete(bill.id)} style={styles.deleteBtn}>🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f172a', padding: '20px', fontFamily: 'Arial', color: 'white' },
  header: { textAlign: 'center', marginBottom: '30px', position: 'relative' },
  backBtn: { position: 'absolute', left: '0', top: '0', color: '#22c55e', textDecoration: 'none', fontSize: '1rem' },
  title: { fontSize: '1.8rem', color: '#22c55e', marginBottom: '10px' },
  subtitle: { fontSize: '1rem', color: '#94a3b8' },
  message: { maxWidth: '800px', margin: '0 auto 20px', padding: '15px', backgroundColor: '#334155', borderRadius: '8px', textAlign: 'center' },
  content: { maxWidth: '800px', margin: '0 auto' },
  formSection: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '25px', marginBottom: '20px' },
  sectionTitle: { fontSize: '1.2rem', color: '#22c55e', marginBottom: '20px' },
  form: { display: 'grid', gap: '15px' },
  formGroup: {},
  label: { display: 'block', marginBottom: '5px', color: '#94a3b8', fontSize: '0.9rem' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '1rem', boxSizing: 'border-box' },
  submitBtn: { padding: '15px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
  statsSection: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '25px', marginBottom: '20px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' },
  statCard: { backgroundColor: '#334155', borderRadius: '8px', padding: '15px', textAlign: 'center' },
  statLabel: { fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' },
  statValue: { fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' },
  statUnit: { fontSize: '0.75rem', color: '#64748b' },
  listSection: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '25px' },
  noData: { color: '#64748b', textAlign: 'center', padding: '20px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#334155', borderRadius: '8px', padding: '15px' },
  listInfo: { flex: 1 },
  listTitle: { fontSize: '1rem', fontWeight: 'bold', color: '#e2e8f0', margin: '0 0 5px 0' },
  listDetail: { fontSize: '0.85rem', color: '#94a3b8', margin: 0 },
  listNotes: { fontSize: '0.8rem', color: '#64748b', margin: '5px 0 0 0', fontStyle: 'italic' },
  listEmissions: { textAlign: 'right', marginRight: '15px' },
  emissionValue: { fontSize: '1.1rem', fontWeight: 'bold', color: '#f97316', margin: 0 },
  emissionUnit: { fontSize: '0.7rem', color: '#64748b', margin: 0 },
  deleteBtn: { backgroundColor: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '5px' }
};

export default AdminFuel;
