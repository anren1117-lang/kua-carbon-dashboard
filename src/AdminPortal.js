import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function AdminPortal() {
  const [activeTab, setActiveTab] = useState('fuel');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  // Fuel Bills State
  const [fuelData, setFuelData] = useState({
    date: '',
    fuel_type: 'Diesel',
    gallons: '',
    cost: '',
    notes: ''
  });
  const [fuelBills, setFuelBills] = useState([]);

  // Day Students State
  const [dayStudent, setDayStudent] = useState({ zip_code: '', school_year: '2025-2026' });
  const [dayStudents, setDayStudents] = useState([]);

  // US Boarding State
  const [usBoarding, setUsBoarding] = useState({ zip_code: '', state: '', school_year: '2025-2026' });
  const [usBoardingStudents, setUsBoardingStudents] = useState([]);

  // International State
  const [intlStudent, setIntlStudent] = useState({ country: '', school_year: '2025-2026' });
  const [intlStudents, setIntlStudents] = useState([]);

  // Simple login (change password as needed)
  const handleLogin = () => {
    if (password === 'KUA2026') {
      setIsLoggedIn(true);
      setMessage('');
    } else {
      setMessage('Incorrect password');
    }
  };

  // Fetch data on load
  useEffect(() => {
    if (isLoggedIn) {
      fetchFuelBills();
      fetchDayStudents();
      fetchUSBoarding();
      fetchIntlStudents();
    }
  }, [isLoggedIn]);

  // Fetch functions
  const fetchFuelBills = async () => {
    const { data } = await supabase.from('fuel_bills').select('*').order('date', { ascending: false });
    if (data) setFuelBills(data);
  };

  const fetchDayStudents = async () => {
    const { data } = await supabase.from('day_students').select('*');
    if (data) setDayStudents(data);
  };

  const fetchUSBoarding = async () => {
    const { data } = await supabase.from('us_boarding_students').select('*');
    if (data) setUsBoardingStudents(data);
  };

  const fetchIntlStudents = async () => {
    const { data } = await supabase.from('international_students').select('*');
    if (data) setIntlStudents(data);
  };

  // Submit functions
  const submitFuelBill = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('fuel_bills').insert([fuelData]);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Fuel bill added successfully!');
      setFuelData({ date: '', fuel_type: 'Diesel', gallons: '', cost: '', notes: '' });
      fetchFuelBills();
    }
  };

  const submitDayStudent = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('day_students').insert([dayStudent]);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Day student added!');
      setDayStudent({ zip_code: '', school_year: '2025-2026' });
      fetchDayStudents();
    }
  };

  const submitUSBoarding = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('us_boarding_students').insert([usBoarding]);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('US boarding student added!');
      setUsBoarding({ zip_code: '', state: '', school_year: '2025-2026' });
      fetchUSBoarding();
    }
  };

  const submitIntlStudent = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('international_students').insert([intlStudent]);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('International student added!');
      setIntlStudent({ country: '', school_year: '2025-2026' });
      fetchIntlStudents();
    }
  };

  // Delete functions
  const deleteFuelBill = async (id) => {
    await supabase.from('fuel_bills').delete().eq('id', id);
    fetchFuelBills();
  };

  const deleteDayStudent = async (id) => {
    await supabase.from('day_students').delete().eq('id', id);
    fetchDayStudents();
  };

  const deleteUSBoarding = async (id) => {
    await supabase.from('us_boarding_students').delete().eq('id', id);
    fetchUSBoarding();
  };

  const deleteIntlStudent = async (id) => {
    await supabase.from('international_students').delete().eq('id', id);
    fetchIntlStudents();
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>KUA Admin Portal</h1>
          <p style={styles.subtitle}>Enter password to access</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} style={styles.button}>Login</button>
          {message && <p style={styles.error}>{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>KUA Admin Portal</h1>
        <p style={styles.subtitle}>Enter campus data for carbon tracking</p>
        <button onClick={() => setIsLoggedIn(false)} style={styles.logoutBtn}>Logout</button>
      </header>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.tabs}>
        <button style={{...styles.tab, backgroundColor: activeTab === 'fuel' ? '#22c55e' : '#334155'}} onClick={() => setActiveTab('fuel')}>Fuel Bills</button>
        <button style={{...styles.tab, backgroundColor: activeTab === 'day' ? '#22c55e' : '#334155'}} onClick={() => setActiveTab('day')}>Day Students</button>
        <button style={{...styles.tab, backgroundColor: activeTab === 'usboarding' ? '#22c55e' : '#334155'}} onClick={() => setActiveTab('usboarding')}>US Boarding</button>
        <button style={{...styles.tab, backgroundColor: activeTab === 'intl' ? '#22c55e' : '#334155'}} onClick={() => setActiveTab('intl')}>International</button>
      </div>

      {/* Fuel Bills Tab */}
      {activeTab === 'fuel' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Add Fuel Bill</h2>
          <form onSubmit={submitFuelBill} style={styles.form}>
            <div style={styles.formRow}>
              <label style={styles.label}>Date:</label>
              <input type="date" value={fuelData.date} onChange={(e) => setFuelData({...fuelData, date: e.target.value})} style={styles.input} required />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Fuel Type:</label>
              <select value={fuelData.fuel_type} onChange={(e) => setFuelData({...fuelData, fuel_type: e.target.value})} style={styles.input}>
                <option>Diesel</option>
                <option>Gasoline</option>
                <option>Propane</option>
                <option>Heating Oil</option>
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Gallons:</label>
              <input type="number" step="0.01" value={fuelData.gallons} onChange={(e) => setFuelData({...fuelData, gallons: e.target.value})} style={styles.input} required />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Cost ($):</label>
              <input type="number" step="0.01" value={fuelData.cost} onChange={(e) => setFuelData({...fuelData, cost: e.target.value})} style={styles.input} />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Notes:</label>
              <input type="text" value={fuelData.notes} onChange={(e) => setFuelData({...fuelData, notes: e.target.value})} style={styles.input} placeholder="e.g., Bus fuel for March" />
            </div>
            <button type="submit" style={styles.submitBtn}>Add Fuel Bill</button>
          </form>

          <h3 style={styles.listTitle}>Recent Fuel Bills ({fuelBills.length})</h3>
          <div style={styles.list}>
            {fuelBills.map((bill) => (
              <div key={bill.id} style={styles.listItem}>
                <span>{bill.date} - {bill.fuel_type}: {bill.gallons} gal (${bill.cost})</span>
                <button onClick={() => deleteFuelBill(bill.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day Students Tab */}
      {activeTab === 'day' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Add Day Student</h2>
          <form onSubmit={submitDayStudent} style={styles.form}>
            <div style={styles.formRow}>
              <label style={styles.label}>Zip Code:</label>
              <input type="text" value={dayStudent.zip_code} onChange={(e) => setDayStudent({...dayStudent, zip_code: e.target.value})} style={styles.input} placeholder="e.g., 03753" required />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>School Year:</label>
              <select value={dayStudent.school_year} onChange={(e) => setDayStudent({...dayStudent, school_year: e.target.value})} style={styles.input}>
                <option>2025-2026</option>
                <option>2024-2025</option>
                <option>2023-2024</option>
              </select>
            </div>
            <button type="submit" style={styles.submitBtn}>Add Day Student</button>
          </form>

          <h3 style={styles.listTitle}>Day Students ({dayStudents.length})</h3>
          <div style={styles.list}>
            {dayStudents.map((student) => (
              <div key={student.id} style={styles.listItem}>
                <span>Zip: {student.zip_code} ({student.school_year})</span>
                <button onClick={() => deleteDayStudent(student.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* US Boarding Tab */}
      {activeTab === 'usboarding' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Add US Boarding Student</h2>
          <form onSubmit={submitUSBoarding} style={styles.form}>
            <div style={styles.formRow}>
              <label style={styles.label}>Zip Code:</label>
              <input type="text" value={usBoarding.zip_code} onChange={(e) => setUsBoarding({...usBoarding, zip_code: e.target.value})} style={styles.input} placeholder="e.g., 90210" required />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>State:</label>
              <input type="text" value={usBoarding.state} onChange={(e) => setUsBoarding({...usBoarding, state: e.target.value.toUpperCase()})} style={styles.input} placeholder="e.g., CA" maxLength="2" />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>School Year:</label>
              <select value={usBoarding.school_year} onChange={(e) => setUsBoarding({...usBoarding, school_year: e.target.value})} style={styles.input}>
                <option>2025-2026</option>
                <option>2024-2025</option>
                <option>2023-2024</option>
              </select>
            </div>
            <button type="submit" style={styles.submitBtn}>Add US Boarding Student</button>
          </form>

          <h3 style={styles.listTitle}>US Boarding Students ({usBoardingStudents.length})</h3>
          <div style={styles.list}>
            {usBoardingStudents.map((student) => (
              <div key={student.id} style={styles.listItem}>
                <span>{student.state} - Zip: {student.zip_code} ({student.school_year})</span>
                <button onClick={() => deleteUSBoarding(student.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* International Tab */}
      {activeTab === 'intl' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Add International Student</h2>
          <form onSubmit={submitIntlStudent} style={styles.form}>
            <div style={styles.formRow}>
              <label style={styles.label}>Country:</label>
              <input type="text" value={intlStudent.country} onChange={(e) => setIntlStudent({...intlStudent, country: e.target.value})} style={styles.input} placeholder="e.g., China" required />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>School Year:</label>
              <select value={intlStudent.school_year} onChange={(e) => setIntlStudent({...intlStudent, school_year: e.target.value})} style={styles.input}>
                <option>2025-2026</option>
                <option>2024-2025</option>
                <option>2023-2024</option>
              </select>
            </div>
            <button type="submit" style={styles.submitBtn}>Add International Student</button>
          </form>

          <h3 style={styles.listTitle}>International Students ({intlStudents.length})</h3>
          <div style={styles.list}>
            {intlStudents.map((student) => (
              <div key={student.id} style={styles.listItem}>
                <span>{student.country} ({student.school_year})</span>
                <button onClick={() => deleteIntlStudent(student.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        <a href="/" style={styles.link}>← Back to Dashboard</a>
      </footer>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f172a', padding: '20px', fontFamily: 'Arial', color: 'white' },
  loginBox: { maxWidth: '400px', margin: '100px auto', textAlign: 'center', backgroundColor: '#1e293b', padding: '40px', borderRadius: '16px' },
  header: { textAlign: 'center', marginBottom: '20px', position: 'relative' },
  title: { fontSize: '1.8rem', color: '#22c55e', marginBottom: '5px' },
  subtitle: { fontSize: '1rem', color: '#94a3b8' },
  logoutBtn: { position: 'absolute', top: '0', right: '0', padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  tabs: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  tab: { padding: '10px 20px', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.9rem' },
  section: { maxWidth: '600px', margin: '0 auto', backgroundColor: '#1e293b', borderRadius: '12px', padding: '25px' },
  sectionTitle: { color: '#22c55e', marginBottom: '20px', fontSize: '1.2rem' },
  form: { marginBottom: '30px' },
  formRow: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', color: '#94a3b8', fontSize: '0.9rem' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '1rem', boxSizing: 'border-box' },
  submitBtn: { width: '100%', padding: '12px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', marginTop: '10px' },
  button: { padding: '12px 30px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', marginTop: '15px' },
  message: { textAlign: 'center', padding: '10px', backgroundColor: '#334155', borderRadius: '8px', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px auto' },
  error: { color: '#ef4444', marginTop: '10px' },
  listTitle: { color: '#94a3b8', marginBottom: '10px', fontSize: '1rem' },
  list: { maxHeight: '300px', overflowY: 'auto' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#334155', borderRadius: '6px', marginBottom: '8px' },
  deleteBtn: { padding: '5px 10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  footer: { textAlign: 'center', marginTop: '30px' },
  link: { color: '#22c55e', textDecoration: 'none' }
};

export default AdminPortal;
