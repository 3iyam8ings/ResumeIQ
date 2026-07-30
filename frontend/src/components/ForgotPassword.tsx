import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ErrorModal from './ErrorModal';

/* ====================================================================== */
/* 1. CONSTANTS / SHARED STYLE PRIMITIVES                                  */
/* ====================================================================== */
const BORDER = '3px solid #1c1b1b';
const SHADOW = '6px 6px 0px 0px rgba(0,0,0,1)';

const fonts = {
  labelMono: { fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 600, lineHeight: 1.2, letterSpacing: '0.05em' },
  terminalText: { fontFamily: '"JetBrains Mono", monospace', fontSize: '14px', fontWeight: 400, lineHeight: 1.6 },
  displayLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '48px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' },
  headlineMd: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '24px', fontWeight: 700, lineHeight: 1.3 },
  bodyLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '18px', fontWeight: 500, lineHeight: 1.6 },
};

/* ====================================================================== */
/* 2. STYLES (values unchanged from original — only grouped/named here,   */
/*    and hoisted out of the component so they aren't re-created on       */
/*    every render)                                                        */
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
    backgroundColor: '#ffb9b7',
    border: BORDER,
    padding: '40px',
    borderRadius: '20px',
    boxShadow: SHADOW,
    transform: 'rotate(-1deg)',
  },
  headerCardTitle: { ...fonts.displayLg, color: '#91373a', margin: 0, lineHeight: 1 },
  headerCardSubtitle: { ...fonts.labelMono, color: '#91373a', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '8px 0 0 0' },

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

  submitButton: {
    width: '100%',
    height: '64px',
    backgroundColor: '#F08080',
    border: BORDER,
    borderRadius: '9999px',
    ...fonts.headlineMd,
    fontSize: '18px',
    color: '#1c1b1b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '8px',
  },

  abortRow: { display: 'flex', justifyContent: 'center', marginTop: '16px' },
  abortLink: { ...fonts.labelMono, color: '#775a00', textDecoration: 'none' },

  footer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '24px',
    backgroundColor: '#c3a8fd',
    borderTop: BORDER,
    marginTop: 'auto',
    boxSizing: 'border-box' as const,
  },
  footerLink: { ...fonts.labelMono, color: '#513985', display: 'flex', alignItems: 'center', cursor: 'pointer', textTransform: 'uppercase' as const },
};

/* ====================================================================== */
/* 3. SMALL PRESENTATIONAL SUBCOMPONENTS                                   */
/*    (kept in this file, just pulled out of the main JSX tree)           */
/* ====================================================================== */

const Navbar = ({ onLogoClick }: { onLogoClick: () => void }) => (
  <header className="forgot-navbar" style={styles.header}>
    <div style={styles.logoGroup} onClick={onLogoClick}>
      <img src="/logo.png" alt="ResumeIQ Logo" style={{ height: '32px' }} />
      <span style={styles.logoText}>ResumeIQ</span>
    </div>
    <div className="forgot-navbar-version" style={fonts.labelMono}>[ VERSION: 2.0.4 ]</div>
  </header>
);

const PageHeaderCard = () => (
  <div className="forgot-header-card" style={styles.headerCard}>
    <h1 className="forgot-header-title" style={styles.headerCardTitle}>Forgot Password?</h1>
    <p style={styles.headerCardSubtitle}>// Enter your email to reset</p>
  </div>
);

const TerminalTitleBar = () => (
  <div style={styles.terminalTitleBar}>
    <div style={styles.terminalDots}>
      <div style={styles.terminalDot('#ba1a1a')} />
      <div style={styles.terminalDot('#f5c445')} />
      <div style={styles.terminalDot('#9d4042')} />
    </div>
    <span style={styles.terminalLabel}>reset_portal.exe</span>
  </div>
);

const SuccessBanner = ({ message }: { message: string }) => (
  <div style={styles.successBanner}>✅ {message}</div>
);

const EmailField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div style={styles.fieldGroup}>
    <label htmlFor="forgot-email" style={styles.fieldLabel}>EMAIL_ADDRESS</label>
    <input
      id="forgot-email"
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={styles.fieldInput}
      onFocus={(e) => (e.target.style.backgroundColor = '#ffb9b7')}
      onBlur={(e) => (e.target.style.backgroundColor = '#fcf9f8')}
      placeholder="user@domain.com"
      required
    />
  </div>
);

const SubmitButton = ({ loading }: { loading: boolean }) => (
  <button type="submit" disabled={loading} style={styles.submitButton}>
    {loading ? 'SENDING...' : 'SEND RESET LINK'}
  </button>
);

const Footer = ({ onNavigateHome }: { onNavigateHome: () => void }) => (
  <footer className="forgot-footer" style={styles.footer}>
    <div onClick={onNavigateHome} style={styles.footerLink}>Go to Home</div>
  </footer>
);

/* ====================================================================== */
/* 4. FORGOT PASSWORD (main component)                                     */
/* ====================================================================== */
const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  /* ---- Form state ---- */
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  /* -------------------------------------------------------------- */
  /* Effects                                                          */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* -------------------------------------------------------------- */
  /* Handlers                                                          */
  /* -------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          data?.error ||
          (response.status === 502
            ? 'The server is unavailable. Please try again in a moment.'
            : 'Failed to request password reset')
        );
      }

      setSuccessMsg(data?.message || 'If an account matches that email, we have sent a password reset link.');
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
          .forgot-main { padding: 0 16px !important; margin-top: 48px !important; }
          .forgot-header-card { padding: 28px !important; }
          .forgot-header-title { font-size: 34px !important; }
          .forgot-form-body { padding: 28px !important; }
        }

        @media (max-width: 480px) {
          .forgot-navbar { padding: 10px 16px !important; }
          .forgot-navbar-version { display: none !important; }
          .forgot-header-title { font-size: 26px !important; }
          .forgot-form-body { padding: 20px !important; gap: 16px !important; }
          .forgot-footer { padding: 16px !important; }
        }
      `}</style>

      {error && <ErrorModal error={error} onClose={() => setError(null)} />}

      <Navbar onLogoClick={() => navigate('/home')} />

      <main className="forgot-main" style={styles.main}>
        <PageHeaderCard />

        <div style={styles.terminalWindow}>
          <TerminalTitleBar />

          <form onSubmit={handleSubmit} className="forgot-form-body" style={styles.form}>
            {successMsg ? (
              <SuccessBanner message={successMsg} />
            ) : (
              <>
                <EmailField value={email} onChange={setEmail} />
                <SubmitButton loading={loading} />
              </>
            )}

            <div style={styles.abortRow}>
              <Link to="/login" style={styles.abortLink}>[ RETURN_TO_LOGIN ]</Link>
            </div>
          </form>
        </div>
      </main>

      <Footer onNavigateHome={() => navigate('/home')} />
    </div>
  );
};

export default ForgotPassword;
