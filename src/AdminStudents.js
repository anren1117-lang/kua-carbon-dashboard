import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function AdminStudents() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('day');
  const [message, setMessage] = useState('');
  
  // Data states
  const [dayStudents, setDayStudents] = useState([]);
  const [usBoardingStudents, setUsBoardingStudents] = useState([]);
  const [intlStudents, setIntlStudents] = useState([]);

  // Form states
  const [dayForm, setDayForm] = useState({ zip_code: '', graduation_year: '2026', school_year: '2025-2026' });
  const [usForm, setUsForm] = useState({ zip_code: '', state: '', graduation_year: '2026', school_year: '2025-2026' });
  const [intlForm, setIntlForm] = useState({ country: '', graduation_year: '2026', school_year: '2025-2026' });

  useEffect(() => {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
      navigate('/admin');
      return;
    }
    fetchAllStudents();
  }, [navigate]);

  const fetchAllStudents = async () => {
    const [dayRes, usRes, intlRes] = await Promise.all([
      supabase.from('day_students').select('*').order('created_at', { ascending: false }),
      supabase.from('us_boarding_students').select('*').order('created_at', { ascending: false }),
      supabase.from('international_students').select('*').order('created_at', { ascending: false })
    ]);
    setDayStudents(dayRes.data || []);
    setUsBoardingStudents(usRes.data || []);
    setIntlStudents(intlRes.data || []);
  };

  const handleSubmitDay = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('day_students').insert([dayForm]);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Day student added!');
      setDayForm({ zip_code: '', graduation_year: '2026', school_year: '2025-2026' });
      fetchAllStudents();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSubmitUS = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('us_boarding_students').insert([usForm]);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('US boarding student added!');
      setUsForm({ zip_code: '', state: '', graduation_year: '2026', school_year: '2025-2026' });
      fetchAllStudents();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSubmitIntl = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('international_students').insert([intlForm]);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('International student added!');
      setIntlForm({ country: '', graduation_year: '2026', school_year: '2025-2026' });
      fetchAllStudents();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (table, id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await supabase.from(table).delete().eq('id', id);
      fetchAllStudents();
    }
  };

  const graduationYears = ['2025', '2026', '2027', '2028', '2029', '2030'];
  const schoolYears = ['2024-2025', '2025-2026', '2026-2027'];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/admin" style={styles.backBtn}>← Back</Link>
        <h1 style={styles.title}>🎓 Students</h1>
        <p style={styles.subtitle}>Track student commute data for emissions calculations</p>
      </header>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.tabs}>
        <button style={{...styles.tab, backgroundColor: activeTab === 'day' ? '#22c55e' : '#334155'}} onClick={() => setActiveTab('day')}>
          Day Students ({dayStudents.length})
        </button>
        <button style={{...styles.tab, backgroundColor: activeTab === 'us' ? '#22c55e' : '#334155'}} onClick={() => setActiveTab('us')}>
          US Boarding ({usBoardingStudents.length})
        </button>
        <button style={{...styles.tab, backgroundColor: activeTab === 'intl' ? '#22c55e' : '#334155'}} onClick={() => setActiveTab('intl')}>
          International ({intlStudents.length})
        </button>
      </div>

      <div style={styles.content}>
        {/* Day Students Tab */}
        {activeTab === 'day' && (
          <>
            <div style={styles.infoBox}>
              <p>🚗 <strong>Day Students:</strong> Commute 360 round trips/year (5 days/week × 36 weeks)</p>
              <p>Emissions = Distance from zip code to KUA × 720 miles × 0.21 kg CO2/mile</p>
            </div>

            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Add Day Student</h2>
              <form onSubmit={handleSubmitDay} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Zip Code</label>
                    <input type="text" value={dayForm.zip_code} onChange={(e) => setDayForm({...dayForm, zip_code: e.target.value})} style={styles.input} placeholder="e.g., 03753" required />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Graduation Year</label>
                    <select value={dayForm.graduation_year} onChange={(e) => setDayForm({...dayForm, graduation_year: e.target.value})} style={styles.input}>
                      {graduationYears.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>School Year</label>
                    <select value={dayForm.school_year} onChange={(e) => setDayForm({...dayForm, school_year: e.target.value})} style={styles.input}>
                      {schoolYears.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" style={styles.submitBtn}>Add Day Student</button>
              </form>
            </div>

            <div style={styles.listSection}>
              <h2 style={styles.sectionTitle}>Day Students ({dayStudents.length})</h2>
              {dayStudents.length === 0 ? (
                <p style={styles.noData}>No day students recorded yet.</p>
              ) : (
                <div style={styles.list}>
                  {dayStudents.map((student) => (
                    <div key={student.id} style={styles.listItem}>
                      <div style={styles.listInfo}>
                        <p style={styles.listTitle}>Zip Code: {student.zip_code}</p>
                        <p style={styles.listDetail}>Class of {student.graduation_year} • {student.school_year}</p>
                      </div>
                      <button onClick={() => handleDelete('day_students', student.id)} style={styles.deleteBtn}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* US Boarding Tab */}
        {activeTab === 'us' && (
          <>
            <div style={styles.infoBox}>
              <p>🚗✈️ <strong>US Boarding Students:</strong> 5 round trips/year (fall, thanksgiving, winter, spring, summer)</p>
              <p>Under 300 miles = drive (0.21 kg CO2/mile) | Over 300 miles = fly (0.255 kg CO2/mile)</p>
            </div>

            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Add US Boarding Student</h2>
              <form onSubmit={handleSubmitUS} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Zip Code</label>
                    <input type="text" value={usForm.zip_code} onChange={(e) => setUsForm({...usForm, zip_code: e.target.value})} style={styles.input} placeholder="e.g., 90210" required />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>State</label>
                    <input type="text" value={usForm.state} onChange={(e) => setUsForm({...usForm, state: e.target.value.toUpperCase()})} style={styles.input} placeholder="e.g., CA" maxLength="2" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Graduation Year</label>
                    <select value={usForm.graduation_year} onChange={(e) => setUsForm({...usForm, graduation_year: e.target.value})} style={styles.input}>
                      {graduationYears.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>School Year</label>
                    <select value={usForm.school_year} onChange={(e) => setUsForm({...usForm, school_year: e.target.value})} style={styles.input}>
                      {schoolYears.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" style={styles.submitBtn}>Add US Boarding Student</button>
              </form>
            </div>

            <div style={styles.listSection}>
              <h2 style={styles.sectionTitle}>US Boarding Students ({usBoardingStudents.length})</h2>
              {usBoardingStudents.length === 0 ? (
                <p style={styles.noData}>No US boarding students recorded yet.</p>
              ) : (
                <div style={styles.list}>
                  {usBoardingStudents.map((student) => (
                    <div key={student.id} style={styles.listItem}>
                      <div style={styles.listInfo}>
                        <p style={styles.listTitle}>{student.state || 'N/A'} - {student.zip_code}</p>
                        <p style={styles.listDetail}>Class of {student.graduation_year} • {student.school_year}</p>
                      </div>
                      <button onClick={() => handleDelete('us_boarding_students', student.id)} style={styles.deleteBtn}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* International Tab */}
        {activeTab === 'intl' && (
          <>
            <div style={styles.infoBox}>
              <p>✈️ <strong>International Students:</strong> 3 round trips/year (arrival, winter break, departure)</p>
              <p>Emissions = Flight distance × 0.255 kg CO2/mile × 3 trips</p>
            </div>

            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Add International Student</h2>
              <form onSubmit={handleSubmitIntl} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Country</label>
                    <input type="text" value={intlForm.country} onChange={(e) => setIntlForm({...intlForm, country: e.target.value})} style={styles.input} placeholder="e.g., China" required />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Graduation Year</label>
                    <select value={intlForm.graduation_year} onChange={(e) => setIntlForm({...intlForm, graduation_year: e.target.value})} style={styles.input}>
                      {graduationYears.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>School Year</label>
                    <select value={intlForm.school_year} onChange={(e) => setIntlForm({...intlForm, school_year: e.target.value})} style={styles.input}>
                      {schoolYears.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" style={styles.submitBtn}>Add International Student</button>
              </form>
            </div>

            <div style={styles.listSection}>
              <h2 style={styles.sectionTitle}>International Students ({intlStudents.length})</h2>
              {intlStudents.length === 0 ? (
                <p style={styles.noData}>No international students recorded yet.</p>
              ) : (
                <div style={styles.list}>
                  {intlStudents.map((student) => (
                    <div key={student.id} style={styles.listItem}>
                      <div style={styles.listInfo}>
                        <p style={styles.listTitle}>{student.country}</p>
                        <p style={styles.listDetail}>Class of {student.graduation_year} • {student.school_year}</p>
                      </div>
                      <button onClick={() => handleDelete('international_students', student.id)} style={styles.deleteBtn}>🗑️</button>
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
  formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' },
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

export default AdminStudents;
