import React, { useState, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */
interface JobApplication {
  id?: number;
  companyName: string;
  jobTitle: string;
  status: string;
  appliedDate: string;
  matchScore: number;
  notes: string;
}

interface DashboardProps {
  userProfile?: any;
}

/* ------------------------------------------------------------------ */
/* Config                                                               */
/* ------------------------------------------------------------------ */
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/applications`
  : 'http://127.0.0.1:8082/api/applications';

const STATUS_COLUMNS = ['Applied', 'OA', 'Interview', 'Offer', 'Rejected'];

const LANE_COLORS: Record<string, string> = {
  Applied: '#c4b5fd',
  OA: '#6ee7b7',
  Interview: '#fcd34d',
  Offer: '#86efac',
  Rejected: '#fca5a5',
};

const CARD_COLORS: Record<string, string> = {
  Applied: '#10b981',
  OA: '#60a5fa',
  Interview: '#fbbf24',
  Offer: '#10b981',
  Rejected: '#ef4444',
};

const EMPTY_FORM_STATE: JobApplication = {
  companyName: '',
  jobTitle: '',
  status: 'Applied',
  appliedDate: new Date().toISOString().split('T')[0],
  matchScore: 0,
  notes: '',
};

/* ------------------------------------------------------------------ */
/* Styles (values unchanged from original — only grouped/named here)  */
/* ------------------------------------------------------------------ */
const styles = {
  page: { fontFamily: '"Plus Jakarta Sans", sans-serif', padding: '0 24px', color: '#1c1b1b', position: 'relative' } as React.CSSProperties,

  toastBase: {
    position: 'fixed' as const,
    top: '24px',
    right: '24px',
    border: '3px solid #1c1b1b',
    borderRadius: '8px',
    padding: '16px 24px',
    boxShadow: '4px 4px 0px 0px #1c1b1b',
    zIndex: 9999,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  headerBadge: { display: 'inline-block', backgroundColor: '#1c1b1b', color: '#fff', padding: '4px 8px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em', borderRadius: '4px', marginBottom: '8px' },
  headerTitle: { margin: 0, fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em' },
  loadingText: { margin: '8px 0 0 0', fontSize: '13px', fontWeight: 700, color: '#6b7280', fontFamily: '"JetBrains Mono", monospace' },
  newApplicationButton: {
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
    cursor: 'pointer',
    transition: 'transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out',
  },

  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' },
  statCardBase: { border: '4px solid #1c1b1b', borderRadius: '16px', padding: '24px', boxShadow: '6px 6px 0px 0px #1c1b1b' },
  statCardHeaderRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '12px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' },
  statCardIcon: { fontSize: '20px' },
  statCardValue: { fontSize: '48px', fontWeight: 800, lineHeight: 1 },
  statCardSubtext: { fontSize: '14px', fontWeight: 600, marginTop: '8px' },

  sectionHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  sectionHeaderTitle: { fontSize: '24px', fontWeight: 800, margin: 0 },
  sectionHeaderActions: { display: 'flex', gap: '8px' },
  iconButton: { border: '3px solid #1c1b1b', backgroundColor: '#fff', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '2px 2px 0px 0px #1c1b1b' },

  kanbanGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '48px', alignItems: 'start' },
  laneHeader: { border: '3px solid #1c1b1b', borderRadius: '999px', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontWeight: 700, boxShadow: '3px 3px 0px 0px #1c1b1b' },
  laneCount: { backgroundColor: '#fff', border: '2px solid #1c1b1b', borderRadius: '999px', padding: '2px 8px', fontSize: '12px' },
  laneCardStack: { display: 'flex', flexDirection: 'column' as const, gap: '12px' },
  congratsBox: { backgroundColor: '#fff', border: '3px dashed #34d399', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', height: '100px', boxShadow: '4px 4px 0px 0px rgba(52,211,153,0.3)' },
  congratsText: { fontWeight: 800, fontStyle: 'italic', fontSize: '16px', color: '#10b981' },
  emptyLane: { border: '2px dashed #9ca3af', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '12px', fontWeight: 600 } as React.CSSProperties,

  analyticsGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '48px' },
  chartCard: { border: '4px solid #1c1b1b', borderRadius: '16px', backgroundColor: '#fff', padding: '24px', boxShadow: '6px 6px 0px 0px #1c1b1b', position: 'relative' as const, minHeight: '300px' },
  chartCardHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  chartCardTitle: { margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' },
  chartCardRange: { fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', fontWeight: 700, color: '#6b7280' },
  chartAxisRow: { display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', fontWeight: 700, marginTop: '8px', color: '#6b7280' },

  terminalCard: { backgroundColor: '#111827', border: '4px solid #1c1b1b', borderRadius: '16px', padding: '24px', boxShadow: '6px 6px 0px 0px #1c1b1b', color: '#34d399', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', display: 'flex', flexDirection: 'column' as const },
  terminalDots: { display: 'flex', gap: '8px', marginBottom: '24px' },
  terminalDot: (color: string): React.CSSProperties => ({ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color }),
  terminalBody: { display: 'flex', flexDirection: 'column' as const, gap: '12px' },
  terminalLine: { margin: 0 },
  terminalErrorLine: { color: '#ef4444' },
  terminalCursor: { margin: 0, marginTop: '16px' },

  modalOverlay: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' },
  modalCard: { backgroundColor: '#fff', border: '4px solid #1c1b1b', borderRadius: '16px', padding: '32px', boxShadow: '8px 8px 0px 0px #1c1b1b', width: '100%', maxWidth: '500px', position: 'relative' as const },
  modalCloseButton: { position: 'absolute' as const, top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', fontWeight: 800 },
  modalTitle: { margin: '0 0 24px 0', fontSize: '24px', fontWeight: 800 },
  modalErrorBanner: { backgroundColor: '#fca5a5', border: '2px solid #ef4444', color: '#7f1d1d', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600, fontSize: '14px' },

  form: { display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  fieldLabel: { display: 'block', marginBottom: '4px', fontWeight: 700, fontSize: '14px' },
  fieldInput: { width: '100%', padding: '12px', border: '3px solid #1c1b1b', borderRadius: '8px', boxSizing: 'border-box', fontFamily: 'inherit', fontWeight: 600 } as React.CSSProperties,
  fieldSelect: { width: '100%', padding: '12px', border: '3px solid #1c1b1b', borderRadius: '8px', boxSizing: 'border-box', fontFamily: 'inherit', fontWeight: 600, backgroundColor: '#fff' } as React.CSSProperties,
  fieldTextarea: { width: '100%', padding: '12px', border: '3px solid #1c1b1b', borderRadius: '8px', boxSizing: 'border-box', fontFamily: 'inherit', fontWeight: 600, resize: 'vertical' } as React.CSSProperties,
  fieldRow: { display: 'flex', gap: '16px' },
  fieldRowItem: { flex: 1 },

  formActionsRow: { display: 'flex', gap: '12px', marginTop: '12px' },
  saveButtonBase: { flex: 1, backgroundColor: '#10b981', color: '#fff', border: '3px solid #1c1b1b', borderRadius: '8px', padding: '12px', fontWeight: 800, fontSize: '16px', boxShadow: '3px 3px 0px 0px #1c1b1b' },
  deleteButtonBase: { backgroundColor: '#ef4444', color: '#fff', border: '3px solid #1c1b1b', borderRadius: '8px', padding: '12px 16px', fontWeight: 800, boxShadow: '3px 3px 0px 0px #1c1b1b' },

  // JobCard styles
  jobCardBase: { backgroundColor: '#fff', border: '3px solid #1c1b1b', borderRadius: '12px', padding: '16px', boxShadow: '4px 4px 0px 0px #1c1b1b', cursor: 'pointer', transition: 'transform 0.1s ease-in-out' },
  jobCardTopRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  jobCardCompany: { fontSize: '10px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' },
  jobCardEditIcon: { fontSize: '16px', color: '#6b7280' },
  jobCardTitle: { margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, lineHeight: 1.2 },
  jobCardFooterRow: { display: 'flex', alignItems: 'center', gap: '6px' },
  jobCardMatchBadge: (color: string): React.CSSProperties => ({ backgroundColor: color, border: '2px solid #1c1b1b', padding: '2px 6px', fontSize: '10px', fontWeight: 800, borderRadius: '4px' }),
  jobCardDueRow: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, color: '#6b7280' },
  jobCardDueIcon: { fontSize: '14px' },
};

/* ------------------------------------------------------------------ */
/* Dashboard component                                                  */
/* ------------------------------------------------------------------ */
const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  /* ---------------- State ---------------- */
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  const [formState, setFormState] = useState<JobApplication>(EMPTY_FORM_STATE);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    fetchApplications();
  }, []);

  /* ---------------- API calls ---------------- */
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formState.companyName.trim() || !formState.jobTitle.trim()) {
      setFormError('Company name and Job title are required.');
      return;
    }
    if (formState.matchScore < 0 || formState.matchScore > 100) {
      setFormError('Match score must be between 0 and 100.');
      return;
    }

    setFormLoading(true);
    try {
      const isEdit = !!editingApp?.id;
      const url = isEdit ? `${API_URL}/${editingApp.id}` : API_URL;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formState,
          matchScore: Number(formState.matchScore),
        }),
        credentials: 'include',
      });

      if (response.ok) {
        showToast(isEdit ? 'Application updated successfully!' : 'Application added successfully!', 'success');
        closeModal();
        fetchApplications();
      } else {
        setFormError('Failed to save application. Please try again.');
      }
    } catch (err) {
      setFormError('Network error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingApp?.id) return;

    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    setFormLoading(true);
    setFormError(null);
    try {
      const response = await fetch(`${API_URL}/${editingApp.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        showToast('Application deleted.', 'success');
        closeModal();
        fetchApplications();
      } else {
        setFormError('Failed to delete application.');
      }
    } catch (err) {
      setFormError('Network error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  /* ---------------- UI helpers ---------------- */
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (app?: JobApplication) => {
    if (app) {
      setEditingApp(app);
      setFormState({
        ...app,
        appliedDate: app.appliedDate ? app.appliedDate.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setEditingApp(null);
      setFormState(EMPTY_FORM_STATE);
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingApp(null);
  };

  /* ---------------- Derived data ---------------- */
  const getLaneApplications = (status: string) => {
    return applications
      .filter((app) => app.status === status)
      .sort((a, b) => new Date(b.appliedDate || 0).getTime() - new Date(a.appliedDate || 0).getTime());
  };

  const calculateAvgScore = () => {
    if (applications.length === 0) return 0;
    const total = applications.reduce((acc, curr) => acc + (curr.matchScore || 0), 0);
    return Math.round(total / applications.length);
  };

  const getActiveInterviewsCount = () => {
    return getLaneApplications('Interview').length;
  };

  const getAppliedThisWeekCount = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return applications.filter((app) => app.appliedDate && new Date(app.appliedDate) >= sevenDaysAgo).length;
  };

  /* ---------------- Render ---------------- */
  return (
    <div style={styles.page}>
      {/* Toast Notification */}
      {toast && (
        <div style={{ ...styles.toastBase, backgroundColor: toast.type === 'success' ? '#34d399' : '#f87171' }}>
          <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          {toast.message}
        </div>
      )}

      {/* Header Section */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.headerBadge}>[DASHBOARD: OVERVIEW]</div>
          <h1 style={styles.headerTitle}>Welcome back, {userProfile?.name?.split(' ')[0] || 'User'}.</h1>
          {loading && <p style={styles.loadingText}>Loading applications...</p>}
        </div>
        <button
          onClick={() => openModal()}
          style={styles.newApplicationButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(4px, 4px)';
            e.currentTarget.style.boxShadow = '0px 0px 0px 0px #1c1b1b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '4px 4px 0px 0px #1c1b1b';
          }}
        >
          <span>+</span> NEW APPLICATION
        </button>
      </div>

      {/* Summary Cards */}
      <div style={styles.statGrid}>
        <div style={{ ...styles.statCardBase, backgroundColor: '#fbbf24' }}>
          <div style={styles.statCardHeaderRow}>
            <span>[TOTAL_APPS]</span>
            <span className="material-symbols-outlined" style={styles.statCardIcon}>rocket_launch</span>
          </div>
          <div style={styles.statCardValue}>{applications.length}</div>
          <div style={styles.statCardSubtext}>{getAppliedThisWeekCount()} applied this week</div>
        </div>

        <div style={{ ...styles.statCardBase, backgroundColor: '#34d399' }}>
          <div style={styles.statCardHeaderRow}>
            <span>[AVG_RESUME_SCORE]</span>
            <span className="material-symbols-outlined" style={styles.statCardIcon}>analytics</span>
          </div>
          <div style={styles.statCardValue}>{calculateAvgScore()}%</div>
          <div style={styles.statCardSubtext}>Optimized for FAANG</div>
        </div>

        <div style={{ ...styles.statCardBase, backgroundColor: '#60a5fa' }}>
          <div style={styles.statCardHeaderRow}>
            <span>[ACTIVE_INTERVIEWS]</span>
            <span className="material-symbols-outlined" style={styles.statCardIcon}>forum</span>
          </div>
          <div style={styles.statCardValue}>{String(getActiveInterviewsCount()).padStart(2, '0')}</div>
          <div style={styles.statCardSubtext}>Keep up the momentum</div>
        </div>
      </div>

      {/* Job Tracker */}
      <div style={styles.sectionHeaderRow}>
        <h2 style={styles.sectionHeaderTitle}>Job Tracker</h2>
        <div style={styles.sectionHeaderActions}>
          <button style={styles.iconButton}>
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button style={styles.iconButton}>
            <span className="material-symbols-outlined">view_kanban</span>
          </button>
        </div>
      </div>

      <div style={styles.kanbanGrid}>
        {STATUS_COLUMNS.map((status) => {
          const appsInLane = getLaneApplications(status);

          return (
            <div key={status}>
              <div style={{ ...styles.laneHeader, backgroundColor: LANE_COLORS[status] }}>
                <span>{status}</span>
                <span style={styles.laneCount}>{appsInLane.length}</span>
              </div>
              <div style={styles.laneCardStack}>
                {status === 'Offer' && appsInLane.length > 0 && (
                  <div style={styles.congratsBox}>
                    <span style={styles.congratsText}>CONGRATS!</span>
                  </div>
                )}

                {appsInLane.length === 0 ? (
                  <div style={styles.emptyLane}>No applications yet</div>
                ) : (
                  appsInLane.map((app) => (
                    <JobCard
                      key={app.id}
                      app={app}
                      color={CARD_COLORS[status]}
                      isFaded={status === 'Rejected'}
                      onClick={() => openModal(app)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Section (from image 2) */}
      <div style={styles.analyticsGrid}>
        <div style={styles.chartCard}>
          <div style={styles.chartCardHeaderRow}>
            <h3 style={styles.chartCardTitle}>
              <span className="material-symbols-outlined">monitoring</span> Resume Score History
            </h3>
            <span style={styles.chartCardRange}>JAN - JUN 2024</span>
          </div>
          {/* Mock Chart SVG */}
          <svg viewBox="0 0 500 200" style={{ width: '100%', height: '200px' }}>
            <polygon points="0,200 0,150 100,140 200,90 300,110 400,60 500,70 500,200" fill="#f3efe8" />
            <polyline points="0,150 100,140 200,90 300,110 400,60 500,70" fill="none" stroke="#1c1b1b" strokeWidth="4" strokeLinejoin="round" />
            <line x1="0" y1="200" x2="500" y2="200" stroke="#1c1b1b" strokeWidth="4" />
          </svg>
          <div style={styles.chartAxisRow}>
            <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
          </div>
        </div>

        <div style={styles.terminalCard}>
          <div style={styles.terminalDots}>
            <div style={styles.terminalDot('#ef4444')}></div>
            <div style={styles.terminalDot('#f59e0b')}></div>
            <div style={styles.terminalDot('#10b981')}></div>
          </div>
          <div style={styles.terminalBody}>
            <p style={styles.terminalLine}>{'>'} Initializing Resume Scan...</p>
            <p style={styles.terminalLine}>{'>'} Scanning: Software_Engineer_V4.pdf</p>
            <p style={styles.terminalLine}>{'>'} Target: Google L5 Requirements</p>
            <p style={styles.terminalLine}>{'>'} <span style={styles.terminalErrorLine}>Error: Missing "Kubernetes" keyword.</span></p>
            <p style={styles.terminalLine}>{'>'} Suggestion: Quantify impact in section 3.</p>
            <p style={styles.terminalLine}>{'>'} Score Prediction: 94/100 after edits.</p>
            <p style={styles.terminalCursor} className="animate-pulse">_</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button onClick={closeModal} style={styles.modalCloseButton}>
              &times;
            </button>
            <h2 style={styles.modalTitle}>{editingApp ? 'Edit Application' : 'New Application'}</h2>

            {formError && <div style={styles.modalErrorBanner}>{formError}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div>
                <label htmlFor="app-company-name" style={styles.fieldLabel}>Company Name *</label>
                <input
                  id="app-company-name"
                  type="text"
                  value={formState.companyName}
                  onChange={(e) => setFormState({ ...formState, companyName: e.target.value })}
                  style={styles.fieldInput}
                  placeholder="e.g. Google"
                />
              </div>

              <div>
                <label htmlFor="app-job-title" style={styles.fieldLabel}>Job Title *</label>
                <input
                  id="app-job-title"
                  type="text"
                  value={formState.jobTitle}
                  onChange={(e) => setFormState({ ...formState, jobTitle: e.target.value })}
                  style={styles.fieldInput}
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div style={styles.fieldRow}>
                <div style={styles.fieldRowItem}>
                  <label htmlFor="app-status" style={styles.fieldLabel}>Status</label>
                  <select
                    id="app-status"
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                    style={styles.fieldSelect}
                  >
                    <option value="Applied">Applied</option>
                    <option value="OA">OA</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div style={styles.fieldRowItem}>
                  <label htmlFor="app-match-score" style={styles.fieldLabel}>Match Score (0-100)</label>
                  <input
                    id="app-match-score"
                    type="number"
                    min="0"
                    max="100"
                    value={formState.matchScore}
                    onChange={(e) => setFormState({ ...formState, matchScore: parseInt(e.target.value) || 0 })}
                    style={styles.fieldInput}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="app-notes" style={styles.fieldLabel}>Notes</label>
                <textarea
                  id="app-notes"
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  rows={3}
                  style={styles.fieldTextarea}
                  placeholder="Add any interview notes or links here..."
                />
              </div>

              <div style={styles.formActionsRow}>
                <button
                  type="submit"
                  disabled={formLoading}
                  style={{ ...styles.saveButtonBase, cursor: formLoading ? 'not-allowed' : 'pointer', opacity: formLoading ? 0.7 : 1 }}
                >
                  {formLoading ? 'Saving...' : 'Save Application'}
                </button>

                {editingApp && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={formLoading}
                    style={{ ...styles.deleteButtonBase, cursor: formLoading ? 'not-allowed' : 'pointer' }}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* JobCard subcomponent                                                 */
/* ------------------------------------------------------------------ */
const JobCard = ({
  app,
  color,
  isFaded = false,
  onClick,
}: {
  app: JobApplication;
  color: string;
  isFaded?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      style={{ ...styles.jobCardBase, opacity: isFaded ? 0.6 : 1 }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translate(-2px, -2px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
    >
      <div style={styles.jobCardTopRow}>
        <span style={styles.jobCardCompany}>{app.companyName}</span>
        <span className="material-symbols-outlined" style={styles.jobCardEditIcon}>edit</span>
      </div>
      <h4 style={styles.jobCardTitle}>{app.jobTitle}</h4>
      <div style={styles.jobCardFooterRow}>
        {app.matchScore ? (
          <span style={styles.jobCardMatchBadge(color)}>MATCH: {app.matchScore}%</span>
        ) : (
          <span style={styles.jobCardDueRow}>
            <span className="material-symbols-outlined" style={styles.jobCardDueIcon}>calendar_today</span>
            {app.appliedDate ? `Applied ${new Date(app.appliedDate).toLocaleDateString()}` : 'No date set'}
          </span>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
