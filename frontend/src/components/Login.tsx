import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ErrorModal from './ErrorModal';

/* =========================================================================
   THEME CONSTANTS
   Pulled out of the component so they aren't re-created on every render,
   and so every color/border/shadow in the file has one source of truth.
   ========================================================================= */

const COLORS = {
  border: '#1c1b1b',
  background: '#fcf9f8',
  dotGrid: '#d2c5af',
  yellow: '#f5c445',
  yellowTextDark: '#6c5100',
  gold: '#775a00',
  purple: '#c3a8fd',
  purpleTextDark: '#513985',
  purpleIcon: '#69509e',
  pink: '#f9a8a6',
  darkRed: '#9d4042',
  red: '#ba1a1a',
  cta: '#F08080',
  grey: '#e8e5dc',
  brownText: '#4e4635',
  white: '#ffffff',
  black: '#1c1b1b',
} as const;

const BORDER = `3px solid ${COLORS.border}`;
const SHADOW = '6px 6px 0px 0px rgba(0,0,0,1)';
const SHADOW_SM = `4px 4px 0px ${COLORS.border}`;

const FONTS = {
  labelMono: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '0.05em',
  },
  terminalText: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  displayLg: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontSize: '48px',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  headlineMd: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  bodyLg: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: 1.6,
  },
} as const;

// Same OAuth endpoint as before — untouched, just named so it isn't a magic string.
const OAUTH_BASE_URL = '/oauth2/authorization';

const pillInputStyle: React.CSSProperties = {
  width: '100%',
  height: '56px',
  padding: '0 24px',
  backgroundColor: COLORS.background,
  border: BORDER,
  borderRadius: '9999px',
  ...FONTS.terminalText,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'background-color 0.2s',
};

/* =========================================================================
   SUB-COMPONENTS
   Purely presentational — same markup/styles as the original inline JSX,
   just given names so the main component reads top-to-bottom like a page.
   ========================================================================= */

const NavBar: React.FC<{ onLogoClick: () => void }> = ({ onLogoClick }) => (
  <header
    style={{
      width: '100%',
      backgroundColor: COLORS.background,
      borderBottom: BORDER,
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxSizing: 'border-box',
      boxShadow: SHADOW,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}
  >
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
      onClick={onLogoClick}
    >
      <img src="/logo.png" alt="ResumeIQ Logo" style={{ height: '48px' }} />
      <span style={{ ...FONTS.headlineMd, fontWeight: 900 }}>ResumeIQ</span>
    </div>
    <div style={{ ...FONTS.labelMono }}>[ VERSION: 2.0.4 ]</div>
  </header>
);

const AiApprovedSticker: React.FC = () => (
  <div style={{ position: 'absolute', top: '120px', left: '60px', transform: 'rotate(-15deg)', zIndex: 5 }}>
    <div
      style={{
        backgroundColor: COLORS.pink,
        padding: '16px',
        borderRadius: '12px',
        border: BORDER,
        boxShadow: SHADOW_SM,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <div style={{ fontSize: '24px' }}>✅</div>
      <div style={{ ...FONTS.labelMono, fontSize: '10px', fontWeight: 800, margin: 0, color: COLORS.black }}>
        AI_APPROVED
      </div>
    </div>
  </div>
);

const IqBadge: React.FC = () => (
  <div style={{ position: 'absolute', bottom: '5px', right: '80px', zIndex: 5, transform: 'rotate(-10deg) scale(1.15)' }}>
    <div
      style={{
        backgroundColor: COLORS.grey,
        width: '70px',
        height: '92px',
        borderRadius: '40px',
        border: BORDER,
        boxShadow: SHADOW,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '36px', color: COLORS.gold }}>
        psychology
      </span>
      <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '15px', fontWeight: 800, color: COLORS.black, marginTop: '2px' }}>
        IQ+
      </span>
    </div>
  </div>
);

const WelcomeBanner: React.FC = () => (
  <div
    style={{
      backgroundColor: COLORS.yellow,
      border: BORDER,
      padding: '40px',
      borderRadius: '20px',
      boxShadow: SHADOW,
      transform: 'rotate(-1deg)',
    }}
  >
    <h1 style={{ ...FONTS.displayLg, color: COLORS.yellowTextDark, margin: 0, lineHeight: 1 }}>
      Welcome back [ USER ]
    </h1>
    <p
      style={{
        ...FONTS.labelMono,
        color: COLORS.yellowTextDark,
        marginTop: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        margin: '8px 0 0 0',
      }}
    >
      // System Authentication Required
    </p>
  </div>
);

type LoginFormProps = {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const LoginFormCard: React.FC<LoginFormProps> = ({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => (
  <div style={{ backgroundColor: COLORS.white, border: BORDER, borderRadius: '20px', boxShadow: SHADOW, overflow: 'hidden' }}>
    {/* Window Header */}
    <div
      style={{
        backgroundColor: COLORS.black,
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', gap: '4px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS.red }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS.yellow }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS.darkRed }} />
      </div>
      <span style={{ ...FONTS.labelMono, fontSize: '10px', color: COLORS.background, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        login_portal.exe
      </span>
    </div>

    {/* Form Body */}
    <form onSubmit={onSubmit} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ ...FONTS.labelMono, marginLeft: '8px' }}>EMAIL_ADDRESS</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          style={pillInputStyle}
          onFocus={(e) => (e.target.style.backgroundColor = COLORS.yellow)}
          onBlur={(e) => (e.target.style.backgroundColor = COLORS.background)}
          placeholder="user@domain.com"
          required
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ ...FONTS.labelMono, marginLeft: '8px' }}>USER_PASSWORD</label>
          <Link to="/forgot-password" style={{ ...FONTS.labelMono, color: COLORS.gold, textDecoration: 'none' }}>
            [ FORGOT_PASSWORD? ]
          </Link>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          style={pillInputStyle}
          onFocus={(e) => (e.target.style.backgroundColor = COLORS.purple)}
          onBlur={(e) => (e.target.style.backgroundColor = COLORS.background)}
          placeholder="••••••••"
          required
        />
      </div>

      {/* Main CTA */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          height: '64px',
          backgroundColor: COLORS.cta,
          border: BORDER,
          borderRadius: '9999px',
          ...FONTS.headlineMd,
          color: COLORS.black,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {loading ? 'LOGGING IN...' : 'LOGIN'}
        {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
      </button>
    </form>
  </div>
);

const SocialLogins: React.FC<{ onOAuthLogin: (provider: string) => void }> = ({ onOAuthLogin }) => {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: COLORS.background,
    border: BORDER,
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    ...FONTS.labelMono,
    cursor: 'pointer',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      <div onClick={() => onOAuthLogin('google')} style={buttonStyle}>
        <span style={{ fontSize: '18px' }}>🌐</span> Sign in with Google
      </div>
      <div onClick={() => onOAuthLogin('github')} style={buttonStyle}>
        <span style={{ fontSize: '18px' }}>🐙</span> Sign in with GitHub
      </div>
    </div>
  );
};

const SignupPrompt: React.FC = () => (
  <div style={{ textAlign: 'center', paddingTop: '8px', paddingBottom: '32px' }}>
    <div style={{ ...FONTS.bodyLg, fontWeight: 700, color: COLORS.brownText, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      New here?
      <Link
        to="/signup"
        style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: COLORS.purple, textDecorationThickness: '3px', textUnderlineOffset: '4px' }}
      >
        Create an account
      </Link>
      <span className="material-symbols-outlined" style={{ color: COLORS.purpleIcon }}>
        person_add
      </span>
    </div>
  </div>
);

const BottomNav: React.FC<{ onSignIn: () => void; onSignUp: () => void }> = ({ onSignIn, onSignUp }) => (
  <footer
    style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '24px',
      backgroundColor: COLORS.purple,
      borderTop: BORDER,
      marginTop: 'auto',
      boxSizing: 'border-box',
    }}
  >
    {/* Sign In (INACTIVE) */}
    <div
      onClick={onSignIn}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: COLORS.purpleTextDark,
        padding: '4px 40px',
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      <span className="material-symbols-outlined">login</span>
      <span style={{ ...FONTS.labelMono, textTransform: 'uppercase' }}>Sign In</span>
    </div>

    {/* Create Account (ACTIVE) */}
    <div
      onClick={onSignUp}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.gold,
        color: COLORS.white,
        borderRadius: '9999px',
        padding: '4px 40px',
        border: BORDER,
        cursor: 'pointer',
      }}
    >
      <span className="material-symbols-outlined">person_add</span>
      <span style={{ ...FONTS.labelMono, textTransform: 'uppercase' }}>Create Account</span>
    </div>
  </footer>
);

/* =========================================================================
   MAIN COMPONENT
   All state/data-fetching logic lives here, same as the original file.
   ========================================================================= */

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        // .trim() guards against a leading/trailing space in the email
        // field silently causing a login failure — same endpoint/contract.
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `${OAUTH_BASE_URL}/${provider}`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLORS.background,
        backgroundImage: `radial-gradient(${COLORS.dotGrid} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        color: COLORS.black,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'hidden',
      }}
    >
      {error && <ErrorModal error={error} onClose={() => setError(null)} />}

      <NavBar onLogoClick={() => navigate('/home')} />

      <AiApprovedSticker />
      <IqBadge />

      <main
        style={{
          width: '100%',
          maxWidth: '448px',
          padding: '0 24px',
          marginTop: '64px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <WelcomeBanner />

        <LoginFormCard
          email={email}
          password={password}
          loading={loading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />

        <SocialLogins onOAuthLogin={handleOAuthLogin} />

        <SignupPrompt />
      </main>

      <BottomNav onSignIn={() => navigate('/login')} onSignUp={() => navigate('/signup')} />
    </div>
  );
};

export default Login;
