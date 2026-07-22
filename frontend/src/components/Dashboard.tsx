import React, { useState, useEffect } from 'react';

interface JobApplication {
  id?: number;
  companyName: string;
  jobTitle: string;
  status: string;
  appliedDate: string;
  matchScore: number;
  notes: string;
}

const API_URL = 'http://127.0.0.1:8082/api/applications';

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [status, setStatus] = useState('Applied');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (err: any) {
      setError('Error connecting to backend: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !jobTitle) return;

    const newApp: JobApplication = {
      companyName,
      jobTitle,
      status,
      appliedDate,
      matchScore: Number(matchScore),
      notes
    };

    setLoading(true);
    setError(null);

    try {
      let response;
      if (editingId) {
        response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newApp)
        });
      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newApp)
        });
      }

      if (response.ok) {
        resetForm();
        fetchApplications();
      } else {
        setError('Failed to save application');
      }
    } catch (err: any) {
      setError('Error saving: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (app: JobApplication) => {
    setEditingId(app.id!);
    setCompanyName(app.companyName);
    setJobTitle(app.jobTitle);
    setStatus(app.status);
    setAppliedDate(app.appliedDate || '');
    setMatchScore(app.matchScore || 0);
    setNotes(app.notes || '');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchApplications();
      } else {
        setError('Failed to delete application');
      }
    } catch (err: any) {
      setError('Error deleting: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setCompanyName('');
    setJobTitle('');
    setStatus('Applied');
    setAppliedDate(new Date().toISOString().split('T')[0]);
    setMatchScore(0);
    setNotes('');
  };

  return (
    <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#1e1e2f', color: '#fff', borderRadius: '8px', textAlign: 'left', border: '1px solid #10b981' }}>
      <h3>📊 Application Dashboard (Sprint 8)</h3>
      <p style={{ fontSize: '14px', color: '#aaa' }}>Track your job applications, interviews, and progress.</p>
      
      {error && <div style={{ color: '#fca5a5', padding: '10px', backgroundColor: '#7f1d1d', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSave} style={{ backgroundColor: '#222', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ flex: '1 1 45%' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#ccc' }}>Company Name *</label>
          <input required type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }} />
        </div>
        <div style={{ flex: '1 1 45%' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#ccc' }}>Job Title *</label>
          <input required type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }} />
        </div>
        <div style={{ flex: '1 1 30%' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#ccc' }}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }}>
            <option value="Applied">Applied</option>
            <option value="OA">OA / Assessment</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div style={{ flex: '1 1 30%' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#ccc' }}>Applied Date</label>
          <input type="date" value={appliedDate} onChange={e => setAppliedDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }} />
        </div>
        <div style={{ flex: '1 1 30%' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#ccc' }}>Match Score (%)</label>
          <input type="number" min="0" max="100" value={matchScore} onChange={e => setMatchScore(parseInt(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }} />
        </div>
        <div style={{ flex: '1 1 100%' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#ccc' }}>Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', minHeight: '60px', padding: '8px', borderRadius: '4px', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }} />
        </div>
        <div style={{ flex: '1 1 100%', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          {editingId && <button type="button" onClick={resetForm} style={{ padding: '8px 16px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>}
          <button type="submit" disabled={loading} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Saving...' : (editingId ? 'Update Application' : 'Add Application')}
          </button>
        </div>
      </form>

      {applications.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#333', borderBottom: '2px solid #555' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Company</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Match</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid #444', backgroundColor: editingId === app.id ? '#2c3e50' : 'transparent' }}>
                  <td style={{ padding: '10px' }}>{app.companyName}</td>
                  <td style={{ padding: '10px' }}>{app.jobTitle}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: app.status === 'Applied' ? '#3b82f6' : 
                                       app.status === 'OA' ? '#f59e0b' : 
                                       app.status === 'Interview' ? '#8b5cf6' : 
                                       app.status === 'Offer' ? '#10b981' : '#ef4444'
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>{app.appliedDate}</td>
                  <td style={{ padding: '10px' }}>
                    {app.matchScore ? <span style={{ color: app.matchScore > 75 ? '#10b981' : app.matchScore > 50 ? '#f59e0b' : '#ef4444' }}>{app.matchScore}%</span> : '-'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button onClick={() => handleEdit(app)} style={{ padding: '4px 8px', marginRight: '5px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                    <button onClick={() => handleDelete(app.id!)} style={{ padding: '4px 8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#222', borderRadius: '8px', color: '#aaa' }}>
          No job applications tracked yet. Start tracking above!
        </div>
      )}
    </div>
  );
};

export default Dashboard;
