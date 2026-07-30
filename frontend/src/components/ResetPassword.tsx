import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ErrorModal from './ErrorModal';

/* ====================================================================== */
/* 1. CONSTANTS / SHARED STYLE PRIMITIVES                                  */
/* ====================================================================== */
const BORDER = '3px solid #1c1b1b';
const SHADOW = '6px 6px 0px 0px rgba(0,0,0,1)';
const REDIRECT_DELAY_MS = 3000;

const fonts = {
  labelMono: { fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 600, lineHeight: 1.2, letterSpacing: '0.05em' },
  terminalText: { fontFamily: '"JetBrains Mono", monospace', fontSize: '14px', fontWeight: 400, lineHeight: 1.6 },
  displayLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '48px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' },
  headlineMd: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '24px', fontWeight: 700, lineHeight: 1.3 },
};

/* ====================================================================== */
/* 2. STYLES (values unchanged from original — only grouped/named here)   */
/* ====================================================================== */
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#fcf9f8',
    backgroundImage: 'radial-gradient(#d2c5af 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    backgroundPosition: '0 0, 20px 20px',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: '#1c1b1b',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    overflowX: 'hidden' as const,
  },

  header: {
    width: '100%',
    backgroundColor: '#fcf9f8',
    borderBottom: BORDER,
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box' as const,
    boxShadow: SHADOW,
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
  },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  logoText: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '24px', fontWeight: 900 },

  main: {
    width: '100%',
    maxWidth: '448px',
    padding: '0 24px',
    marginTop: '64px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    boxSizing: 'border-box' as const,
    position: 'relative' as const,
    zIndex: 10,
  },

  headerCard: {
    backgroundColor: '#f5c445',
    border: BORDER,
    padding: '40px',
    borderRadius: '20px',
    boxShadow: SHADOW,
    transform: 'rotate(-1deg)',
  },
  headerCardTitle: { ...fonts.displayLg, color: '#6c5100', margin: 0, lineHeight: 1 },
  headerCardSubtitle: { ...fonts.labelMono, color: '#6c5100', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '8px 0 0 0' },

  terminalWindow: { backgroundColor: '#ffffff', border: BORDER, borderRadius: '20px', boxShadow: SHADOW, overflow: 'hidden' },
  terminalTitleBar: { backgroundColor: '#1c1b1b', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  terminalDots: { display: 'flex', gap: '4px' },
  terminalDot: (color: string) => ({ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color }),
  terminalLabel: { ...fonts.labelMono, fontSize: '10px', color: '#fcf9f8', textTransform: 'uppercase' as const, letterSpacing: '0.05em' },

  form: { padding: '40px', display: 'flex', flexDirection: 'column' as const, gap: '24px' },

  successBanner: { backgroundColor: '#c3a8fd', color: '#240357', padding: '16px', borderRadius: '12px', border: BORDER, ...fonts.labelMono, textAlign: 'center' as const },

  fieldGroup: { display: 'flex', flexDirection: 'column' as const, gap: '4px' },
  fieldLabel: { ...fonts.labelMono, marginLeft: '8px' },
  fieldInput: {
    width: '100%',
    height: '56px',
    padding: '0 24px',
    backgroundColor: '#fcf9f8',
    border: BORDER,
    borderRadius: '9999px',
    ...fonts.terminalText,
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'background-color 0.2s',
  },

  submitButton: (disabled: boolean) => ({
    width: '100%',
    height: '64px',
    backgroundColor: '#F08080',
    border: BORDER,
    borderRadius: '9999px',
    ...fonts.headlineMd,
    color: '#1c1b1b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    marginTop: '8px',
    opacity: disabled ? 0.7 : 1,
  }),

  abortRow: { display: 'flex', justifyContent: 'center', marginTop: '16px' },
  abortLink: { ...fonts.labelMono, color: '#775a00', textDecoration: 'none' },

  footer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    backgroundColor: '#c3a8fd',
    borderTop: BORDER,
    marginTop: 'auto',
    boxSizing: 'border-box' as const,
  },
  footerText: { ...fonts.labelMono, color: '#513985', display: 'flex', alignItems: 'center', gap: '8px' },
};

/* ====================================================================== */
/* 3. SMALL PRESENTATIONAL SUBCOMPONENTS                                   */
/*    (kept in this file, just pulled out of the main JSX tree)           */
/* ====================================================================== */

const Navbar = ({ onLogoClick }: { onLogoClick: () => void }) => (
  <header className="reset-navbar" style={styles.header}>
    <div style={styles.logoGroup} onClick={onLogoClick}>
      <img src="/logo.png" alt="ResumeIQ Logo" style={{ height: '32px' }} />
      <span style={styles.logoText}>ResumeIQ</span>
    </div>
    <div className="reset-navbar-version" style={fonts.labelMono}>[ VERSION: 2.0.4 ]</div>
  </header>
);

const PageHeaderCard = () => (
  <div className="reset-header-card" style={styles.headerCard}>
    <h1 className="reset-header-title" style={styles.headerCardTitle}>New Password</h1>
    <p style={styles.headerCardSubtitle}>// Secure your account</p>
  </div>
);

const TerminalTitleBar = () => (
  <div style={styles.terminalTitleBar}>
    <div style={styles.terminalDots}>
      <div style={styles.terminalDot('#ba1a1a')} />
      <div style={styles.terminalDot('#f5c445')} />
      <div style={styles.terminalDot('#9d4042')} />
    </div>
    <span style={styles.terminalLabel}>update_auth.exe</span>
  </div>
);

const SuccessBanner = ({ message }: { message: string }) => (
  <div style={styles.successBanner}>
    ✅ {message}<br />Redirecting to login...
  </div>
);

// One reusable component instead of two near-identical <input> blocks
// (password + confirm password previously duplicated the same style object
// and focus/blur handlers verbatim).
const PasswordField = ({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div style={styles.fieldGroup}>
    <label htmlFor={id} style={styles.fieldLabel}>{label}</label>
    <input
      id={id}
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={styles.fieldInput}
      onFocus={(e) => (e.target.style.backgroundColor = '#f5c445')}
      onBlur={(e) => (e.target.style.backgroundColor = '#fcf9f8')}
      placeholder="••••••••"
      required
    />
  </div>
);

const SubmitButton = ({ loading, disabled }: { loading: boolean; disabled: boolean }) => (
  <button type="submit" disabled={disabled} style={styles.submitButton(disabled)}>
    {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
    {!loading && <span className="material-symbols-outlined">lock_reset</span>}
  </button>
);

const Footer = () => (
  <footer style={styles.footer}>
    <div style={styles.footerText}>
      <span className="material-symbols-outlined">verified_user</span>
      ENCRYPTED TRANSMISSION
    </div>
  </footer>
);

/* ====================================================================== */
/* 4. RESET PASSWORD (main component)                                      */
/* ====================================================================== */
const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ---- Form state ---- */
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Tracks the pending post-success redirect so it can be cancelled on
  // unmount (see bug note below).
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  /* -------------------------------------------------------------- */
  /* Effects                                                          */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cleanup: if the user navigates away (e.g. clicks "ABORT_PROCESS")
  // before the 3s redirect fires, cancel it. Previously this timeout was
  // never cleared, so it could still fire navigate('/login') after the
  // component had already unmounted.
  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  /* -------------------------------------------------------------- */
  /* Handlers                                                          */
  /* -------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword || !token) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccessMsg(data.message || 'Password has been reset successfully.');
      redirectTimerRef.current = setTimeout(() => navigate('/login'), REDIRECT_DELAY_MS);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------- */
  /* Render                                                            */
  /* -------------------------------------------------------------- */
  return (
    <div style={styles.pageWrapper}>
      <style>{`
        @media (max-width: 768px) {
          .reset-main { padding: 0 16px !important; margin-top: 48px !important; }
          .reset-header-card { padding: 28px !important; }
          .reset-header-title { font-size: 34px !important; }
          .reset-form-body { padding: 28px !important; }
        }

        @media (max-width: 480px) {
          .reset-navbar { padding: 10px 16px !important; }
          .reset-navbar-version { display: none !important; }
          .reset-header-title { font-size: 26px !important; }
          .reset-form-body { padding: 20px !important; gap: 16px !important; }
        }
      `}</style>

      {error && <ErrorModal error={error} onClose={() => setError(null)} />}

      <Navbar onLogoClick={() => navigate('/home')} />

      <main className="reset-main" style={styles.main}>
        <PageHeaderCard />

        <div style={styles.terminalWindow}>
          <TerminalTitleBar />

          <form onSubmit={handleSubmit} className="reset-form-body" style={styles.form}>
            {!token ? (
              <div style={{ backgroundColor: '#f87171', color: '#1c1b1b', padding: '16px', borderRadius: '12px', border: BORDER, ...fonts.labelMono, textAlign: 'center' }}>
                ❌ Invalid or missing password reset token.<br />Please request a new link.
              </div>
            ) : successMsg ? (
              <SuccessBanner message={successMsg} />
            ) : (
              <>
                <PasswordField id="new-password" label="NEW_PASSWORD" value={password} onChange={setPassword} />
                <PasswordField id="confirm-password" label="CONFIRM_PASSWORD" value={confirmPassword} onChange={setConfirmPassword} />
                <SubmitButton loading={loading} disabled={loading || !token} />
              </>
            )}

            <div style={styles.abortRow}>
              <Link to="/login" style={styles.abortLink}>[ ABORT_PROCESS ]</Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;
