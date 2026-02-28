import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function AdminTravel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('studyabroad');
  const [message, setMessage] = useState('');
  
  const [studyAbroad, setStudyAbroad] = useState([]);
  const [facultyTravel, setFacultyTravel] = useState([]);

  const [saForm, setSaForm] = useState({
    destination_country: '',
    destination_city: '',
    departure_date: '',
    return_date: '',
    school_year: '2025-2026'
  });

  const [ftForm, setFtForm] = useState({
    destination_country: '',
    destination_city: '',
    trip_purpose: 'Conference',
    departure_date: '',
    return_date: ''
  });

  useEffect(() => {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
      navigate('/admin');
      return;
    }
    fetchAllTravel();
  }, [navigate]);

  const fetchAllTravel = async () => {
    const [saRes, ftRes] = await Promise.all([
      supabase.from('study_abroad').select('*').order('departure_date', { ascending: false }),
      supabase.from('faculty_travel').select('*').order('departure_date', { ascending: false })
    ]);
    setStudyAbroad(saRes.data || []);
    setFacultyTravel(ftRes.data || []);
  };

  const handleSubmitSA = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('study_abroad').insert([saForm]);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Study abroad record added!');
      setSaForm({ destination_country: '', destination_city: '', departure_date: '', return_date: '', school_year: '2025-2026' });
      fetchAllTravel();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSubmitFT = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('faculty_travel').insert([ftForm]);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Faculty travel record added!');
      setFtForm({ destination_country: '', destination_city: '', trip_purpose: 'Conference', departure_date: '', return_date: '' });
      fetchAllTravel();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (table, id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await supabase.from(table).delete().eq('id', id);
      fetchAllTravel();
    }
  };

  const schoolYears = ['2024-2025', '2025-2026', '2026-2027'];
  const tripPurposes = ['Admissions', 'Conference', 'Professional Development', 'Student Recruitment', 'Other'];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/admin" style={styles.backBtn}>← Back</Link>
        <h1 style={styles.title}>✈️ Travel</h1>
        <p style={styles.subtitle}>Track study abroad and faculty travel emissions</p>
      </header>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.tabs}>
        <button style={{...styles.tab, backgroundColor: activeTab === 'studyabroad' ? '#22c55e' : '#334155'}} onClick={() => setActiveTab('studyabroad')}>
          Study Abroad ({studyAbroad.length})
        </button>
        <button style={{...styles.tab, backgroundColor: activeTab === 'faculty' ? '#22c55e' : '#334155'}} onClick={() => setActiveTab('faculty')}>
          Faculty Travel ({facultyTravel.length})
        </button>
      </div>

      <div style={styles.content}>
        {/* Study Abroad Tab */}
        {activeTab === 'studyabroad' && (
          <>
            <div style={styles.infoBox}>
              <p>🌍 <strong>Study Abroad:</strong> Round-trip flights from Boston to destination</p>
              <p>Emissions = Flight distance × 0.255 kg CO2/mile × 2 (round trip)</p>
            </div>

            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Add Study Abroad Trip</h2>
              <form onSubmit={handleSubmitSA} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Destination Country</label>
                    <input type="text" value={saForm.destination_country} onChange={(e) => setSaForm({...saForm, destination_country: e.target.value})} style={styles.input} placeholder="e.g., Spain" required />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Destination City</label>
                    <input type="text" value={saForm.destination_city} onChange={(e) => setSaForm({...saForm, destination_city: e.target.value})} style={styles.input} placeholder="e.g., Madrid" />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Departure Date</label>
                    <input type="date" value={saForm.departure_date} onChange={(e) => setSaForm({...saForm, departure_date: e.target.value})} style={styles.input} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Return Date</label>
                    <input type="date" value={saForm.return_date} onChange={(e) => setSaForm({...saForm, return_date: e.target.value})} style={styles.input} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>School Year</label>
                    <select value={saForm.school_year} onChange={(e) => setSaForm({...saForm, school_year: e.target.value})} style={styles.input}>
                      {schoolYears.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" style={styles.submitBtn}>Add Study Abroad Trip</button>
              </form>
            </div>

            <div style={styles.listSection}>
              <h2 style={styles.sectionTitle}>Study Abroad Records ({studyAbroad.length})</h2>
              {studyAbroad.length === 0 ? (
                <p style={styles.noData}>No study abroad trips recorded yet.</p>
              ) : (
                <div style={styles.list}>
                  {studyAbroad.map((trip) => (
                    <div key={trip.id} style={styles.listItem}>
                      <div style={styles.listInfo}>
                        <p style={styles.listTitle}>{trip.destination_city ? `${trip.destination_city}, ` : ''}{trip.destination_country}</p>
                        <p style={styles.listDetail}>
                          {trip.departure_date} to {trip.return_date || 'TBD'} • {trip.school_year}
                        </p>
                      </div>
                      <button onClick={() => handleDelete('study_abroad', trip.id)} style={styles.deleteBtn}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Faculty Travel Tab */}
        {activeTab === 'faculty' && (
          <>
            <div style={styles.infoBox}>
              <p>👔 <strong>Faculty Travel:</strong> Business trips for admissions, conferences, etc.</p>
              <p>Emissions = Flight distance × 0.255 kg CO2/mile × 2 (round trip)</p>
            </div>

            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Add Faculty Travel</h2>
              <form onSubmit={handleSubmitFT} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Destination Country</label>
                    <input type="text" value={ftForm.destination_country} onChange={(e) => setFtForm({...ftForm, destination_country: e.target.value})} style={styles.input} placeholder="e.g., USA" required />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Destination City</label>
                    <input type="text" value={ftForm.destination_city} onChange={(e) => setFtForm({...ftForm, destination_city: e.target.value})} style={styles.input} placeholder="e.g., San Francisco" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Trip Purpose</label>
                    <select value={ftForm.trip_purpose} onChange={(e) => setFtForm({...ftForm, trip_purpose: e.target.value})} style={styles.input}>
                      {tripPurposes.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Departure Date</label>
                    <input type="date" value={ftForm.departure_date} onChange={(e) => setFtForm({...ftForm, departure_date: e.target.value})} style={styles.input} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Return Date</label>
                    <input type="date" value={ftForm.return_date} onChange={(e) => setFtForm({...ftForm, return_date: e.target.value})} style={styles.input} />
                  </div>
                </div>
                <button type="submit" style={styles.submitBtn}>Add Faculty Travel</button>
              </form>
            </div>

            <div style={styles.listSection}>
              <h2 style={styles.sectionTitle}>Faculty Travel Records ({facultyTravel.length})</h2>
              {facultyTravel.length === 0 ? (
                <p style={styles.noData}>No faculty travel recorded yet.</p>
              ) : (
                <div style={styles.list}>
                  {facultyTravel.map((trip) => (
                    <div key={trip.id} style={styles.listItem}>
                      <div style={styles.listInfo}>
                        <p style={styles.listTitle}>{trip.destination_city ? `${trip.destination_city}, ` : ''}{trip.destination_country}</p>
                        <p style={styles.listDetail}>
                          {trip.trip_purpose} • {trip.departure_date} to {trip.return_date || 'TBD'}
                        </p>
                      </div>
                      <button onClick={() => handleDelete('faculty_travel', trip.id)} style={styles.deleteBtn}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
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
  tabs: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  tab: { padding: '12px 20px', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.9rem' },
  content: { maxWidth: '900px', margin: '0 auto' },
  infoBox: { backgroundColor: '#1e3a5f', borderRadius: '8px', padding: '15px', marginBottom: '20px', fontSize: '0.85rem', color: '#93c5fd' },
  formSection: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '25px', marginBottom: '20px' },
  sectionTitle: { fontSize: '1.2rem', color: '#22c55e', marginBottom: '20px' },
  form: {},
  formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '15px' },
  formGroup: {},
  label: { display: 'block', marginBottom: '5px', color: '#94a3b8', fontSize: '0.9rem' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '1rem', boxSizing: 'border-box' },
  submitBtn: { padding: '15px 30px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
  listSection: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '25px' },
  noData: { color: '#64748b', textAlign: 'center', padding: '20px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' },
  listItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#334155', borderRadius: '8px', padding: '15px' },
  listInfo: { flex: 1 },
  listTitle: { fontSize: '1rem', fontWeight: 'bold', color: '#e2e8f0', margin: '0 0 5px 0' },
  listDetail: { fontSize: '0.85rem', color: '#94a3b8', margin: 0 },
  deleteBtn: { backgroundColor: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '5px' }
};

export default AdminTravel;
