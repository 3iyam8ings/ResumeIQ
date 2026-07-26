import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ErrorModal from './ErrorModal';

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */
const COLORS = {
  bg: '#fcf9f8',
  ink: '#1c1b1b',
  muted: '#4e4635',
  purple: '#B79CF0',
  green: '#7BE0A0',
  gold: '#775a00',
  terminalBg: '#0D0D0D',
  terminalGreen: '#3DDC84',
  white: '#ffffff',
};

const FONTS = {
  display: '"Plus Jakarta Sans", sans-serif',
  mono: '"JetBrains Mono", monospace',
};

/* ------------------------------------------------------------------ */
/* Styles (values unchanged from original — only grouped/named here)  */
/* ------------------------------------------------------------------ */
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    backgroundColor: COLORS.bg,
    backgroundImage: 'radial-gradient(#d2c5af 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    fontFamily: FONTS.display,
    color: COLORS.ink,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  },

  header: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: COLORS.bg,
    borderBottom: `3px solid ${COLORS.ink}`,
    boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    position: 'relative',
    zIndex: 40,
  },
  headerBrand: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  headerBrandLogo: { height: '32px' },
  headerBrandTitle: { fontFamily: FONTS.display, fontSize: '24px', fontWeight: 900 },
  headerNav: { display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' },
  headerNavItem: { cursor: 'pointer', fontFamily: FONTS.mono, fontSize: '13px', fontWeight: 600, color: COLORS.muted },
  headerNavItemActive: { cursor: 'pointer', fontFamily: FONTS.mono, fontSize: '13px', fontWeight: 800, color: COLORS.gold },

  main: { maxWidth: '576px', margin: '0 auto', padding: '64px 24px 0', display: 'flex', flexDirection: 'column', gap: '40px' },

  headlineCard: {
    backgroundColor: COLORS.purple,
    border: `3px solid ${COLORS.ink}`,
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
    transform: 'rotate(-1deg)',
  },
  headlineTitle: { fontSize: '48px', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0 },
  headlineTitleHighlight: { backgroundColor: COLORS.ink, color: COLORS.bg, padding: '8px', display: 'inline-block', margin: '4px 0' },
  headlineSubtext: { fontFamily: FONTS.mono, marginTop: '24px', color: COLORS.muted, fontSize: '14px', letterSpacing: '0.1em' },

  formCard: {
    backgroundColor: COLORS.white,
    border: `3px solid ${COLORS.ink}`,
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    position: 'relative',
    zIndex: 10,
  },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
  fieldLabel: { fontFamily: FONTS.mono, fontSize: '13px', fontWeight: 600, color: COLORS.muted, textTransform: 'uppercase', marginLeft: '4px' },
  fieldInput: {
    width: '100%',
    backgroundColor: 'white',
    border: `3px solid ${COLORS.ink}`,
    borderRadius: '9999px',
    padding: '12px 24px',
    fontSize: '18px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  submitButtonWrapper: { marginTop: '24px' },
  submitButtonBase: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: COLORS.green,
    border: `3px solid ${COLORS.ink}`,
    borderRadius: '9999px',
    padding: '24px',
    fontSize: '24px',
    fontWeight: 700,
    color: COLORS.ink,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'all 0.1s ease-in-out',
  },

  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '12px 0' },
  dividerLine: { flexGrow: 1, borderTop: '1px solid #4e4635', borderBottom: 'none' },
  dividerText: { fontFamily: FONTS.mono, fontSize: '13px', color: COLORS.muted },

  oauthGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  oauthButton: {
    backgroundColor: 'white',
    border: `3px solid ${COLORS.ink}`,
    borderRadius: '9999px',
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: FONTS.mono,
    fontWeight: 600,
  },
  oauthIcon: { width: '20px', height: '20px' },

  loginPrompt: { textAlign: 'center', marginTop: '24px' },
  loginPromptText: { fontSize: '14px', color: COLORS.muted, margin: 0 },
  loginPromptLink: {
    color: COLORS.ink,
    fontWeight: 800,
    textDecoration: 'underline',
    textDecorationColor: '#69509e',
    textDecorationThickness: '2px',
    textUnderlineOffset: '2px',
  },

  terminalCard: {
    backgroundColor: COLORS.terminalBg,
    borderRadius: '20px',
    border: `3px solid ${COLORS.ink}`,
    padding: '24px',
    boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
    marginBottom: '64px',
  },
  terminalDots: { display: 'flex', gap: '8px', marginBottom: '12px' },
  terminalDot: (color: string): React.CSSProperties => ({ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color }),
  terminalBody: { fontFamily: FONTS.mono, color: COLORS.terminalGreen, fontSize: '14px', lineHeight: 1.6 },
  terminalLine: { margin: '0 0 4px 0' },
  terminalLineLast: { margin: 0 },
  terminalCursor: { animation: 'blinkCursor 1s step-end infinite' },

  footer: {
    width: '100%',
    backgroundColor: COLORS.purple,
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    boxSizing: 'border-box',
    borderTop: `3px solid ${COLORS.ink}`,
    marginTop: 'auto',
  },
  footerItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: COLORS.ink },
  footerItemIcon: { fontSize: '24px' },
  footerItemLabel: { fontFamily: FONTS.mono, fontSize: '13px', fontWeight: 600 },
  footerCta: {
    backgroundColor: COLORS.gold,
    color: 'white',
    border: 'none',
    borderRadius: '9999px',
    padding: '12px 24px',
    fontFamily: FONTS.display,
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */
const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isHoveringCreate, setIsHoveringCreate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('error');
    if (errorParam === 'account_exists') {
      setError('Account already exists. Please try to sign up with another email or GitHub.');
    } else if (errorParam) {
      setError('Authentication failed. Please try again.');
    }
  }, [location]);

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `http://localhost:8082/oauth2/authorization/${provider}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Top App Bar */}
      <header style={styles.header}>
        <div style={styles.headerBrand} onClick={() => navigate('/home')}>
          <img src="/logo.png" alt="ResumeIQ Logo" style={{ height: '48px' }} />
          <span style={styles.headerBrandTitle}>ResumeIQ</span>
        </div>
        <div style={styles.headerNav}>
          <span style={styles.headerNavItem}>FEATURES</span>
          <span onClick={() => navigate('/home')} style={styles.headerNavItem}>GO BACK TO HOME</span>
          <span style={styles.headerNavItemActive}>SIGN UP</span>
        </div>
      </header>

      <main style={styles.main}>
        {/* Headline Container */}
        <div style={styles.headlineCard}>
          <h1 style={styles.headlineTitle}>
            Join the <br />
            <span style={styles.headlineTitleHighlight}>[ FUTURE ]</span>
          </h1>
          <p style={styles.headlineSubtext}>// INITIALIZING ENROLLMENT SEQUENCE_</p>
        </div>

        {/* Signup Form */}
        <div style={styles.formCard}>
          {error && <ErrorModal error={error} onClose={() => setError(null)} />}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label htmlFor="signup-name" style={styles.fieldLabel}>Full Name</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                style={styles.fieldInput}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label htmlFor="signup-email" style={styles.fieldLabel}>Email Address</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="hello@future.ai"
                style={styles.fieldInput}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label htmlFor="signup-password" style={styles.fieldLabel}>Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={styles.fieldInput}
              />
            </div>
            <div style={styles.submitButtonWrapper}>
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setIsHoveringCreate(true)}
                onMouseLeave={() => setIsHoveringCreate(false)}
                style={{
                  ...styles.submitButtonBase,
                  boxShadow: isHoveringCreate ? 'none' : '6px 6px 0px 0px rgba(0,0,0,1)',
                  transform: isHoveringCreate ? 'translate(6px, 6px)' : 'none',
                }}
              >
                {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
                {!loading && <span>➔</span>}
              </button>
            </div>
          </form>

          <div style={styles.divider}>
            <hr style={styles.dividerLine} />
            <span style={styles.dividerText}>OR CONNECT WITH</span>
            <hr style={styles.dividerLine} />
          </div>

          <div style={styles.oauthGrid}>
            <button onClick={() => handleOAuthLogin('google')} style={styles.oauthButton}>
              <img src="https://www.google.com/favicon.ico" alt="Google" style={styles.oauthIcon} /> GOOGLE
            </button>
            <button onClick={() => handleOAuthLogin('github')} style={styles.oauthButton}>
              <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" style={styles.oauthIcon} /> GITHUB
            </button>
          </div>

          <div style={styles.loginPrompt}>
            <p style={styles.loginPromptText}>
              Already have an account?{' '}
              <Link to="/login" style={styles.loginPromptLink}>Log in</Link>
            </p>
          </div>
        </div>

        {/* Interactive Terminal Decoration */}
        <div style={styles.terminalCard}>
          <div style={styles.terminalDots}>
            <div style={styles.terminalDot('#FF5F56')}></div>
            <div style={styles.terminalDot('#FFBD2E')}></div>
            <div style={styles.terminalDot('#27C93F')}></div>
          </div>
          <div style={styles.terminalBody}>
            <p style={styles.terminalLine}>{'>'} resumeiq --version 2.4.0-stable</p>
            <p style={styles.terminalLine}>{'>'} system.status: online</p>
            <p style={styles.terminalLine}>{'>'} ready_to_build: true</p>
            <p style={styles.terminalLineLast}>{'>'} <span style={styles.terminalCursor}>_</span></p>
          </div>
        </div>
      </main>

      {/* Purple Footer */}
      <footer style={styles.footer}>
        <div onClick={() => navigate('/login')} style={styles.footerItem}>
          <span style={styles.footerItemIcon}>➔]</span>
          <span style={styles.footerItemLabel}>Sign In</span>
        </div>
        <div onClick={() => navigate('/signup')} style={styles.footerCta}>
          <span style={{ fontSize: '18px' }}>👤+</span>
          Create Account
        </div>
      </footer>
    </div>
  );
};

export default Signup;
