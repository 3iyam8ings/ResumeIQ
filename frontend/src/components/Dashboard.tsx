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

interface DashboardProps {
  userProfile?: any;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLaneApplications = (status: string) => {
    return applications.filter(app => app.status === status);
  };

  const calculateAvgScore = () => {
    if (applications.length === 0) return 0;
    const total = applications.reduce((acc, curr) => acc + (curr.matchScore || 0), 0);
    return Math.round(total / applications.length);
  };

  const getActiveInterviewsCount = () => {
    return getLaneApplications('Interview').length;
  };

  return (
    <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', padding: '0 24px', color: '#1c1b1b' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-block', backgroundColor: '#1c1b1b', color: '#fff', padding: '4px 8px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em', borderRadius: '4px', marginBottom: '8px' }}>
            [DASHBOARD: OVERVIEW]
          </div>
          <h1 style={{ margin: 0, fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Welcome back, {userProfile?.name?.split(' ')[0] || 'User'}.
          </h1>
        </div>
        <button style={{
          backgroundColor: '#f87171',
          color: '#1c1b1b',
          border: '3px solid #1c1b1b',
          borderRadius: '9999px',
          padding: '12px 24px',
          fontWeight: 800,
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '4px 4px 0px 0px #1c1b1b',
          cursor: 'pointer'
        }}>
          <span>+</span> NEW APPLICATION
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
        <div style={{ backgroundColor: '#fbbf24', border: '4px solid #1c1b1b', borderRadius: '16px', padding: '24px', boxShadow: '6px 6px 0px 0px #1c1b1b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '12px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>
            <span>[TOTAL_APPS]</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>rocket_launch</span>
          </div>
          <div style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>{applications.length}</div>
          <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>+12% from last week</div>
        </div>

        <div style={{ backgroundColor: '#34d399', border: '4px solid #1c1b1b', borderRadius: '16px', padding: '24px', boxShadow: '6px 6px 0px 0px #1c1b1b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '12px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>
            <span>[AVG_RESUME_SCORE]</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>analytics</span>
          </div>
          <div style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>{calculateAvgScore()}%</div>
          <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>Optimized for FAANG</div>
        </div>

        <div style={{ backgroundColor: '#60a5fa', border: '4px solid #1c1b1b', borderRadius: '16px', padding: '24px', boxShadow: '6px 6px 0px 0px #1c1b1b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '12px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>
            <span>[ACTIVE_INTERVIEWS]</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>forum</span>
          </div>
          <div style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>{String(getActiveInterviewsCount()).padStart(2, '0')}</div>
          <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>2 calls scheduled tomorrow</div>
        </div>
      </div>

      {/* Job Tracker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Job Tracker</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ border: '3px solid #1c1b1b', backgroundColor: '#fff', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '2px 2px 0px 0px #1c1b1b' }}>
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button style={{ border: '3px solid #1c1b1b', backgroundColor: '#fff', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '2px 2px 0px 0px #1c1b1b' }}>
            <span className="material-symbols-outlined">view_kanban</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '48px' }}>
        {/* Applied */}
        <div>
          <div style={{ backgroundColor: '#c4b5fd', border: '3px solid #1c1b1b', borderRadius: '999px', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontWeight: 700, boxShadow: '3px 3px 0px 0px #1c1b1b' }}>
            <span>Applied</span>
            <span style={{ backgroundColor: '#fff', border: '2px solid #1c1b1b', borderRadius: '999px', padding: '2px 8px', fontSize: '12px' }}>{getLaneApplications('Applied').length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {getLaneApplications('Applied').map(app => (
              <JobCard key={app.id} app={app} color="#10b981" />
            ))}
          </div>
        </div>

        {/* OA */}
        <div>
          <div style={{ backgroundColor: '#6ee7b7', border: '3px solid #1c1b1b', borderRadius: '999px', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontWeight: 700, boxShadow: '3px 3px 0px 0px #1c1b1b' }}>
            <span>OA</span>
            <span style={{ backgroundColor: '#fff', border: '2px solid #1c1b1b', borderRadius: '999px', padding: '2px 8px', fontSize: '12px' }}>{getLaneApplications('OA').length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {getLaneApplications('OA').map(app => (
              <JobCard key={app.id} app={app} color="#60a5fa" />
            ))}
          </div>
        </div>

        {/* Interview */}
        <div>
          <div style={{ backgroundColor: '#fcd34d', border: '3px solid #1c1b1b', borderRadius: '999px', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontWeight: 700, boxShadow: '3px 3px 0px 0px #1c1b1b' }}>
            <span>Interview</span>
            <span style={{ backgroundColor: '#fff', border: '2px solid #1c1b1b', borderRadius: '999px', padding: '2px 8px', fontSize: '12px' }}>{getLaneApplications('Interview').length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {getLaneApplications('Interview').map(app => (
              <JobCard key={app.id} app={app} color="#fbbf24" />
            ))}
          </div>
        </div>

        {/* Offer */}
        <div>
          <div style={{ backgroundColor: '#86efac', border: '3px solid #1c1b1b', borderRadius: '999px', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontWeight: 700, boxShadow: '3px 3px 0px 0px #1c1b1b' }}>
            <span>Offer</span>
            <span style={{ backgroundColor: '#fff', border: '2px solid #1c1b1b', borderRadius: '999px', padding: '2px 8px', fontSize: '12px' }}>{getLaneApplications('Offer').length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#fff', border: '3px dashed #34d399', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100px', boxShadow: '4px 4px 0px 0px rgba(52,211,153,0.3)' }}>
              <span style={{ fontWeight: 800, fontStyle: 'italic', fontSize: '16px', color: '#10b981' }}>CONGRATS!</span>
            </div>
            {getLaneApplications('Offer').map(app => (
              <JobCard key={app.id} app={app} color="#10b981" />
            ))}
          </div>
        </div>

        {/* Rejected */}
        <div>
          <div style={{ backgroundColor: '#fca5a5', border: '3px solid #1c1b1b', borderRadius: '999px', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontWeight: 700, boxShadow: '3px 3px 0px 0px #1c1b1b' }}>
            <span>Rejected</span>
            <span style={{ backgroundColor: '#fff', border: '2px solid #1c1b1b', borderRadius: '999px', padding: '2px 8px', fontSize: '12px' }}>{getLaneApplications('Rejected').length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {getLaneApplications('Rejected').map(app => (
              <JobCard key={app.id} app={app} color="#ef4444" isFaded />
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Section (from image 2) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '48px' }}>
        <div style={{ border: '4px solid #1c1b1b', borderRadius: '16px', backgroundColor: '#fff', padding: '24px', boxShadow: '6px 6px 0px 0px #1c1b1b', position: 'relative', minHeight: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
              <span className="material-symbols-outlined">monitoring</span> Resume Score History
            </h3>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', fontWeight: 700, color: '#6b7280' }}>JAN - JUN 2024</span>
          </div>
          {/* Mock Chart SVG */}
          <svg viewBox="0 0 500 200" style={{ width: '100%', height: '200px' }}>
            <polygon points="0,200 0,150 100,140 200,90 300,110 400,60 500,70 500,200" fill="#f3efe8" />
            <polyline points="0,150 100,140 200,90 300,110 400,60 500,70" fill="none" stroke="#1c1b1b" strokeWidth="4" strokeLinejoin="round" />
            <line x1="0" y1="200" x2="500" y2="200" stroke="#1c1b1b" strokeWidth="4" />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', fontWeight: 700, marginTop: '8px', color: '#6b7280' }}>
            <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#111827', border: '4px solid #1c1b1b', borderRadius: '16px', padding: '24px', boxShadow: '6px 6px 0px 0px #1c1b1b', color: '#34d399', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ margin: 0 }}>{'>'} Initializing Resume Scan...</p>
            <p style={{ margin: 0 }}>{'>'} Scanning: Software_Engineer_V4.pdf</p>
            <p style={{ margin: 0 }}>{'>'} Target: Google L5 Requirements</p>
            <p style={{ margin: 0 }}>{'>'} <span style={{ color: '#ef4444' }}>Error: Missing "Kubernetes" keyword.</span></p>
            <p style={{ margin: 0 }}>{'>'} Suggestion: Quantify impact in section 3.</p>
            <p style={{ margin: 0 }}>{'>'} Score Prediction: 94/100 after edits.</p>
            <p style={{ margin: 0, marginTop: '16px' }} className="animate-pulse">_</p>
          </div>
        </div>
      </div>

    </div>
  );
};

const JobCard = ({ app, color, isFaded = false }: { app: JobApplication, color: string, isFaded?: boolean }) => {
  return (
    <div style={{ 
      backgroundColor: '#fff', 
      border: '3px solid #1c1b1b', 
      borderRadius: '12px', 
      padding: '16px', 
      boxShadow: '4px 4px 0px 0px #1c1b1b',
      opacity: isFaded ? 0.6 : 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{app.companyName}</span>
        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#6b7280' }}>more_vert</span>
      </div>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, lineHeight: 1.2 }}>{app.jobTitle}</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {app.matchScore ? (
          <span style={{ backgroundColor: color, border: '2px solid #1c1b1b', padding: '2px 6px', fontSize: '10px', fontWeight: 800, borderRadius: '4px' }}>
            MATCH: {app.matchScore}%
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, color: '#6b7280' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span> Due in 2 days
          </span>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
