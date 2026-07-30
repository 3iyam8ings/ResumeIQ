import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

/* ====================================================================== */
/* 1. TYPES                                                                */
/* ====================================================================== */
interface JobApplication {
  id?: number;
  companyName: string;
  jobTitle: string;
  status: string;
  appliedDate: string;
  matchScore: number;
  notes: string;
  isSynced?: boolean;
}

interface DashboardProps {
  userProfile?: any;
}

type ToastState = { message: string; type: 'success' | 'error' } | null;

/* ====================================================================== */
/* 2. CONSTANTS / CONFIG                                                   */
/* ====================================================================== */
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

// Moved out of the component body — previously this array was re-created on
// every render, which meant the terminal's useEffect dependency was pointing
// at a brand-new array each time (harmless here since .length never changes,
// but wasteful and a bit confusing to follow).
const TERMINAL_MESSAGES = [
  'Welcome to ResumeIQ — your AI career co-pilot.',
  'Module: Resume Analyzer — instant match scoring against job descriptions.',
  'Module: Cover Letter Generator — tailored letters in seconds.',
  'Module: Mock Interview — AI-powered practice sessions.',
  'Module: Job Tracker — visualize every application, end to end.',
  'Module: Terminal IQ Test — benchmark your cognitive edge.',
  'System ready. Awaiting input.',
];

/* ====================================================================== */
/* 3. STYLES (values unchanged from original — only grouped/named here)   */
/* ====================================================================== */
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

  terminalCard: { backgroundColor: '#111827', border: '4px solid #1c1b1b', borderRadius: '16px', padding: '24px', boxShadow: '6px 6px 0px 0px #1c1b1b', color: '#34d399', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', display: 'flex', flexDirection: 'column' as const },
  terminalDots: { display: 'flex', gap: '8px', marginBottom: '24px' },
  terminalDot: (color: string): React.CSSProperties => ({ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color }),
  terminalBody: { display: 'flex', flexDirection: 'column' as const, gap: '12px' },
  terminalLine: { margin: 0 },
  terminalCursor: { margin: 0, marginTop: '16px' },

  arenaCard: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', backgroundColor: '#8b5cf6', backgroundImage: 'linear-gradient(45deg, #7c3aed 25%, transparent 25%, transparent 75%, #7c3aed 75%, #7c3aed), linear-gradient(45deg, #7c3aed 25%, transparent 25%, transparent 75%, #7c3aed 75%, #7c3aed)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px', border: '4px solid #1c1b1b' },
  arenaInner: { backgroundColor: '#fff', border: '4px solid #1c1b1b', padding: '24px', textAlign: 'center' as const, boxShadow: '8px 8px 0px 0px #1c1b1b' },
  arenaTitle: { fontSize: '28px', fontWeight: 900, textTransform: 'uppercase' as const, marginBottom: '8px', letterSpacing: '2px' },
  arenaSubtitle: { fontWeight: 600, opacity: 0.8, marginBottom: '24px' },
  arenaButton: { backgroundColor: '#ef4444', color: '#fff', border: '4px solid #1c1b1b', padding: '16px 32px', fontSize: '20px', fontWeight: 800, textTransform: 'uppercase' as const, boxShadow: '6px 6px 0px 0px #1c1b1b', cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s' },

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

/* ====================================================================== */
/* 4. SMALL PRESENTATIONAL SUBCOMPONENTS                                   */
/*    (kept in this file, but pulled out of the main JSX tree so the       */
/*    Dashboard render function reads top-to-bottom like an outline)      */
/* ====================================================================== */

const Toast = ({ toast }: { toast: ToastState }) => {
  if (!toast) return null;
  return (
    <div style={{ ...styles.toastBase, backgroundColor: toast.type === 'success' ? '#34d399' : '#f87171' }}>
      <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
      {toast.message}
    </div>
  );
};

const StatCard = ({
  label,
  icon,
  value,
  subtext,
  backgroundColor,
}: {
  label: string;
  icon: string;
  value: string | number;
  subtext: string;
  backgroundColor: string;
}) => (
  <div style={{ ...styles.statCardBase, backgroundColor }}>
    <div style={styles.statCardHeaderRow}>
      <span>{label}</span>
      <span className="material-symbols-outlined" style={styles.statCardIcon}>{icon}</span>
    </div>
    <div style={styles.statCardValue}>{value}</div>
    <div style={styles.statCardSubtext}>{subtext}</div>
  </div>
);

const JobCard = ({
  app,
  color,
  isFaded = false,
  onClick,
  isCompactView = false,
}: {
  app: JobApplication;
  color: string;
  isFaded?: boolean;
  onClick?: () => void;
  isCompactView?: boolean;
}) => {
  // NOTE (bug/edge case, left as-is — see chat notes):
  // `app.matchScore` defaults to 0, and 0 is falsy in JS, so a genuine
  // score of 0 will render the "applied on <date>" row instead of a
  // "MATCH: 0%" badge. Flagging rather than silently changing the
  // behavior since it may be intentional (0 == "no score entered yet").
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.jobCardBase,
        opacity: isFaded ? 0.6 : 1,
        padding: isCompactView ? '8px 12px' : '16px',
        border: app.isSynced === false ? '3px dashed #f59e0b' : '3px solid #1c1b1b',
        position: 'relative',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translate(-2px, -2px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
    >
      {app.isSynced === false && (
        <span
          className="material-symbols-outlined"
          style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: '#f59e0b', color: '#fff', borderRadius: '50%', padding: '2px', fontSize: '14px', border: '2px solid #1c1b1b', zIndex: 10 }}
          title="Sync Failed (Offline Mode)"
        >
          sync_problem
        </span>
      )}
      <div style={{ ...styles.jobCardTopRow, marginBottom: isCompactView ? 0 : '8px' }}>
        <span style={styles.jobCardCompany}>{app.companyName}</span>
        {!isCompactView && <span className="material-symbols-outlined" style={styles.jobCardEditIcon}>edit</span>}
      </div>
      {!isCompactView && <h4 style={styles.jobCardTitle}>{app.jobTitle}</h4>}
      <div style={styles.jobCardFooterRow}>
        {app.matchScore ? (
          <span style={styles.jobCardMatchBadge(color)}>MATCH: {app.matchScore}%</span>
        ) : (
          !isCompactView && (
            <span style={styles.jobCardDueRow}>
              <span className="material-symbols-outlined" style={styles.jobCardDueIcon}>calendar_today</span>
              {app.appliedDate ? `Applied ${new Date(app.appliedDate).toLocaleDateString()}` : 'No date set'}
            </span>
          )
        )}
      </div>
    </div>
  );
};

const KanbanColumn = ({
  status,
  apps,
  isCompactView,
  onCardClick,
}: {
  status: string;
  apps: JobApplication[];
  isCompactView: boolean;
  onCardClick: (app: JobApplication) => void;
}) => (
  <div className="dashboard-kanban-column">
    <div style={{ ...styles.laneHeader, backgroundColor: LANE_COLORS[status] }}>
      <span>{status}</span>
      <span style={styles.laneCount}>{apps.length}</span>
    </div>
    <div style={styles.laneCardStack}>
      {status === 'Offer' && apps.length > 0 && (
        <div style={styles.congratsBox}>
          <span style={styles.congratsText}>CONGRATS!</span>
        </div>
      )}

      {apps.length === 0 ? (
        <div style={styles.emptyLane}>No applications yet</div>
      ) : (
        apps.map((app) => (
          <JobCard
            key={app.id}
            app={app}
            color={CARD_COLORS[status]}
            isFaded={status === 'Rejected'}
            onClick={() => onCardClick(app)}
            isCompactView={isCompactView}
          />
        ))
      )}
    </div>
  </div>
);

const TerminalPanel = ({ messageCount }: { messageCount: number }) => (
  <div style={styles.terminalCard}>
    <div style={styles.terminalDots}>
      <div style={styles.terminalDot('#ef4444')}></div>
      <div style={styles.terminalDot('#f59e0b')}></div>
      <div style={styles.terminalDot('#10b981')}></div>
    </div>
    <div style={styles.terminalBody}>
      {TERMINAL_MESSAGES.slice(0, messageCount).map((msg, i) => (
        <p key={i} style={styles.terminalLine}>{'>'} {msg}</p>
      ))}
      <p style={styles.terminalCursor} className="animate-pulse">_</p>
    </div>
  </div>
);

const ArenaPromo = ({ onNavigate }: { onNavigate: () => void }) => (
  <div style={{ ...styles.chartCard, ...styles.arenaCard }}>
    <div style={styles.arenaInner}>
      <h2 style={styles.arenaTitle}>Super Mario Arena</h2>
      <p style={styles.arenaSubtitle}>Ready to take a break from the grind?</p>
      <button
        onClick={onNavigate}
        style={styles.arenaButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translate(4px, 4px)';
          e.currentTarget.style.boxShadow = '2px 2px 0px 0px #1c1b1b';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '6px 6px 0px 0px #1c1b1b';
        }}
      >
        Head to Arena
      </button>
    </div>
  </div>
);

// Extracted the custom status dropdown into its own component — it owns
// its open/close state internally now, instead of that state living on
// the Dashboard (see "Dropdown state leak" bug note in chat).
const StatusDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (status: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ ...styles.fieldSelect, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
      >
        <span>{value || 'Select Status'}</span>
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </div>
      {isOpen && (
        <>
          <div
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', backgroundColor: '#fff', border: '3px solid #1c1b1b', borderRadius: '8px', boxShadow: '4px 4px 0px 0px #1c1b1b', zIndex: 100, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {STATUS_COLUMNS.map((statusOption, idx) => (
              <div
                key={statusOption}
                onClick={() => {
                  onChange(statusOption);
                  setIsOpen(false);
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5c445'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
                style={{ padding: '12px 16px', cursor: 'pointer', fontWeight: 600, borderBottom: idx === STATUS_COLUMNS.length - 1 ? 'none' : '2px solid #1c1b1b', transition: 'background-color 0.1s', userSelect: 'none' }}
              >
                {statusOption}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ApplicationModal = ({
  editingApp,
  formState,
  formError,
  formLoading,
  onFieldChange,
  onSubmit,
  onDelete,
  onClose,
}: {
  editingApp: JobApplication | null;
  formState: JobApplication;
  formError: string | null;
  formLoading: boolean;
  onFieldChange: (patch: Partial<JobApplication>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: () => void;
  onClose: () => void;
}) => (
  <div style={styles.modalOverlay}>
    <div style={styles.modalCard} className="dashboard-modal-card">
      <button onClick={onClose} style={styles.modalCloseButton}>&times;</button>
      <h2 style={styles.modalTitle}>{editingApp ? 'Edit Application' : 'New Application'}</h2>

      {formError && <div style={styles.modalErrorBanner}>{formError}</div>}

      <form onSubmit={onSubmit} style={styles.form}>
        <div>
          <label htmlFor="app-company-name" style={styles.fieldLabel}>Company Name *</label>
          <input
            id="app-company-name"
            type="text"
            value={formState.companyName}
            onChange={(e) => onFieldChange({ companyName: e.target.value })}
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
            onChange={(e) => onFieldChange({ jobTitle: e.target.value })}
            style={styles.fieldInput}
            placeholder="e.g. Software Engineer"
          />
        </div>

        <div className="dashboard-field-row" style={styles.fieldRow}>
          <div style={styles.fieldRowItem}>
            <label style={styles.fieldLabel}>Status</label>
            <StatusDropdown value={formState.status} onChange={(status) => onFieldChange({ status })} />
          </div>
          <div style={styles.fieldRowItem}>
            <label htmlFor="app-match-score" style={styles.fieldLabel}>Match Score (0-100)</label>
            <input
              id="app-match-score"
              type="number"
              min="0"
              max="100"
              value={formState.matchScore}
              onChange={(e) => onFieldChange({ matchScore: parseInt(e.target.value) || 0 })}
              style={styles.fieldInput}
            />
          </div>
        </div>

        <div>
          <label htmlFor="app-notes" style={styles.fieldLabel}>Notes</label>
          <textarea
            id="app-notes"
            value={formState.notes}
            onChange={(e) => onFieldChange({ notes: e.target.value })}
            rows={3}
            style={styles.fieldTextarea}
            placeholder="Add any interview notes or links here..."
          />
        </div>

        <div style={styles.formActionsRow}>
          <button
            type="submit"
            disabled={formLoading}
            style={{ ...styles.saveButtonBase, cursor: formLoading ? 'not-allowed' : 'pointer', opacity: formLoading ? 0.7 : 1, transition: 'transform 0.1s, box-shadow 0.1s' }}
            onMouseEnter={(e) => {
              if (!formLoading) {
                e.currentTarget.style.transform = 'translate(3px, 3px)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            onMouseLeave={(e) => {
              if (!formLoading) {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '3px 3px 0px 0px #1c1b1b';
              }
            }}
          >
            {formLoading ? 'Saving...' : 'Save Application'}
          </button>

          {editingApp && (
            <button
              type="button"
              onClick={onDelete}
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
);

/* ====================================================================== */
/* 5. DASHBOARD (main component)                                           */
/* ====================================================================== */
const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const navigate = useNavigate();

  /* ---- Data state ---- */
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---- Modal / form state ---- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [formState, setFormState] = useState<JobApplication>(EMPTY_FORM_STATE);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  /* ---- UI-only state ---- */
  const [toast, setToast] = useState<ToastState>(null);
  const [isHighScoreFilterEnabled, setIsHighScoreFilterEnabled] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);
  const [terminalIndex, setTerminalIndex] = useState(0);

  /* -------------------------------------------------------------- */
  /* Effects                                                          */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTerminalIndex((prev) => (prev + 1) % (TERMINAL_MESSAGES.length + 1));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  /* -------------------------------------------------------------- */
  /* API calls                                                        */
  /* -------------------------------------------------------------- */
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
        localStorage.setItem('job_applications', JSON.stringify(data));
      } else {
        const localData = localStorage.getItem('job_applications');
        if (localData) setApplications(JSON.parse(localData));
      }
    } catch (err: any) {
      console.error(err);
      const localData = localStorage.getItem('job_applications');
      if (localData) setApplications(JSON.parse(localData));
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

      let savedApp = { ...formState, matchScore: Number(formState.matchScore) };
      let success = false;

      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedApp),
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          savedApp = data; // use backend ID if available
          success = true;
        }
        // NOTE (bug, flagged not fixed): a non-ok response (e.g. a 400/500
        // from the server) falls through with success still false and no
        // offline fallback — only a *thrown* network error gets the
        // fallback-to-localStorage treatment below. So "backend reachable
        // but rejected the request" and "backend unreachable" behave
        // inconsistently. Worth deciding which behavior you actually want.
      } catch (err) {
        console.error('Backend failed, falling back to local storage', err);
        success = true; // Still consider it a success for frontend fallback
        if (!isEdit) savedApp.id = Date.now(); // fake ID
        savedApp.isSynced = false;
      }

      if (success) {
        setApplications((prev) => {
          const updated = isEdit
            ? prev.map((app) => (app.id === savedApp.id ? savedApp : app))
            : [savedApp, ...prev];
          localStorage.setItem('job_applications', JSON.stringify(updated));
          return updated;
        });
        showToast(isEdit ? 'Application updated successfully!' : 'Application added successfully!', 'success');
        closeModal();
      } else {
        setFormError('Failed to save application. Please try again.');
      }
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
    let success = false;
    try {
      const response = await fetch(`${API_URL}/${editingApp.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) success = true;
    } catch (err) {
      console.error('Backend delete failed, falling back to local storage', err);
      success = true;
    }

    if (success) {
      setApplications((prev) => {
        const updated = prev.filter((app) => app.id !== editingApp.id);
        localStorage.setItem('job_applications', JSON.stringify(updated));
        return updated;
      });
      showToast('Application deleted successfully!', 'success');
      closeModal();
    } else {
      setFormError('Failed to delete application.');
    }
    setFormLoading(false);
  };

  /* -------------------------------------------------------------- */
  /* UI helpers                                                        */
  /* -------------------------------------------------------------- */
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

  /* -------------------------------------------------------------- */
  /* Derived data                                                      */
  /* -------------------------------------------------------------- */
  const getLaneApplications = (status: string) => {
    let filtered = applications.filter((app) => app.status === status);
    if (isHighScoreFilterEnabled) {
      filtered = filtered.filter((app) => app.matchScore >= 80);
    }
    return filtered.sort((a, b) => new Date(b.appliedDate || 0).getTime() - new Date(a.appliedDate || 0).getTime());
  };

  const avgScore = applications.length
    ? Math.round(applications.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / applications.length)
    : 0;

  const activeInterviewsCount = getLaneApplications('Interview').length;

  const appliedThisWeekCount = (() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return applications.filter((app) => app.appliedDate && new Date(app.appliedDate) >= sevenDaysAgo).length;
  })();

  /* -------------------------------------------------------------- */
  /* Render                                                            */
  /* -------------------------------------------------------------- */
  return (
    <div className="dashboard-page" style={styles.page}>
      <style>{`
        @media (max-width: 900px) {
          .dashboard-header-row { flex-wrap: wrap !important; gap: 16px !important; }
          .dashboard-header-title { font-size: 34px !important; }
          .dashboard-stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dashboard-analytics-grid { grid-template-columns: 1fr !important; }
          .dashboard-kanban-grid { grid-template-columns: none !important; grid-auto-flow: column !important; grid-auto-columns: 240px !important; overflow-x: auto !important; padding-bottom: 8px !important; }
          .dashboard-kanban-column { min-width: 240px !important; }
        }

        @media (max-width: 480px) {
          .dashboard-page { padding: 0 16px !important; }
          .dashboard-header-title { font-size: 26px !important; }
          .dashboard-stat-grid { grid-template-columns: 1fr !important; }
          .dashboard-modal-card { padding: 20px !important; }
          .dashboard-field-row { flex-direction: column !important; }
        }
      `}</style>

      <Toast toast={toast} />

      {/* ---- Header ---- */}
      <div className="dashboard-header-row" style={styles.headerRow}>
        <div>
          <div style={styles.headerBadge}>[DASHBOARD: OVERVIEW]</div>
          <h1 className="dashboard-header-title" style={styles.headerTitle}>Welcome back, {userProfile?.name?.split(' ')[0] || 'User'}.</h1>
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

      {/* ---- Summary stats ---- */}
      <div className="dashboard-stat-grid" style={styles.statGrid}>
        <StatCard label="[TOTAL_APPS]" icon="rocket_launch" backgroundColor="#fbbf24"
          value={applications.length} subtext={`${appliedThisWeekCount} applied this week`} />
        <StatCard label="[AVG_RESUME_SCORE]" icon="analytics" backgroundColor="#34d399"
          value={`${avgScore}%`} subtext="Optimized for FAANG" />
        <StatCard label="[ACTIVE_INTERVIEWS]" icon="forum" backgroundColor="#60a5fa"
          value={String(activeInterviewsCount).padStart(2, '0')} subtext="Keep up the momentum" />
      </div>

      {/* ---- Job tracker (kanban) ---- */}
      <div style={styles.sectionHeaderRow}>
        <h2 style={styles.sectionHeaderTitle}>Job Tracker</h2>
        <div style={styles.sectionHeaderActions}>
          <button
            onClick={() => setIsHighScoreFilterEnabled(!isHighScoreFilterEnabled)}
            style={{ ...styles.iconButton, backgroundColor: isHighScoreFilterEnabled ? '#fcd34d' : '#fff' }}
            title="High Match Score Only (>80%)"
          >
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button
            onClick={() => setIsCompactView(!isCompactView)}
            style={{ ...styles.iconButton, backgroundColor: isCompactView ? '#c4b5fd' : '#fff' }}
            title="Toggle Compact View"
          >
            <span className="material-symbols-outlined">{isCompactView ? 'view_list' : 'view_kanban'}</span>
          </button>
        </div>
      </div>

      <div className="dashboard-kanban-grid" style={styles.kanbanGrid}>
        {STATUS_COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            apps={getLaneApplications(status)}
            isCompactView={isCompactView}
            onCardClick={openModal}
          />
        ))}
      </div>

      {/* ---- Analytics / promo row ---- */}
      <div className="dashboard-analytics-grid" style={styles.analyticsGrid}>
        <ArenaPromo onNavigate={() => navigate('/arena')} />
        <TerminalPanel messageCount={terminalIndex} />
      </div>

      {/* ---- Add/Edit modal ---- */}
      {isModalOpen && (
        <ApplicationModal
          editingApp={editingApp}
          formState={formState}
          formError={formError}
          formLoading={formLoading}
          onFieldChange={(patch) => setFormState((prev) => ({ ...prev, ...patch }))}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
