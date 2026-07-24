import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ErrorModal from './ErrorModal';

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
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `http://localhost:8082/oauth2/authorization/${provider}`;
  };

  const fonts = {
    labelMono: { fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', fontWeight: 600, lineHeight: 1.2, letterSpacing: '0.05em' },
    terminalText: { fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 400, lineHeight: 1.6 },
    displayLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '48px', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' },
    displayLgMobile: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '32px', fontWeight: 800, lineHeight: 1.2 },
    headlineMd: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '22px', fontWeight: 700, lineHeight: 1.3 },
    bodyLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: 1.6 }
  };

  const shadow = '6px 6px 0px 0px rgba(0,0,0,1)';
  const border = '3px solid #1c1b1b';
  const thinBorder = '1px solid #999';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fcf9f8',
      backgroundImage: 'radial-gradient(#d2c5af 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      backgroundPosition: '0 0, 12px 12px',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      color: '#1c1b1b',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowX: 'hidden'
    }}>
      {error && <ErrorModal error={error} onClose={() => setError(null)} />}

      {/* Top Navbar */}
      <header style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderBottom: border,
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/home')}>
          <img src="/logo.png" alt="ResumeIQ Logo" style={{ height: '40px' }} />
        </div>
        <div style={{ ...fonts.labelMono }}>
          [ VERSION: 2.0.4 ]
        </div>
      </header>

      {/* Decorative Elements */}
      <div style={{ position: 'absolute', top: '120px', left: '60px', transform: 'rotate(-15deg)', zIndex: 5 }}>
        <div style={{
          backgroundColor: '#f9a8a6',
          padding: '12px',
          borderRadius: '8px',
          border: border,
          boxShadow: shadow,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#8b2e2d' }}>verified</span>
          <div style={{ ...fonts.labelMono, fontSize: '9px', fontWeight: 800, margin: 0, color: '#1c1b1b' }}>AI_APPROVED</div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '120px', right: '60px', zIndex: 5 }}>
        <div style={{
          backgroundColor: '#e8e5dc',
          width: '70px',
          height: '92px',
          borderRadius: '40px',
          border: border,
          boxShadow: shadow,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#775a00' }}>
            psychology
          </span>
          <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '15px', fontWeight: 800, color: '#1c1b1b', marginTop: '2px' }}>IQ+</span>
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        width: '100%',
        maxWidth: '448px',
        padding: '0 24px',
        marginTop: '48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Welcome Header */}
        <div style={{
          backgroundColor: '#f5c445',
          border: border,
          padding: '32px',
          borderRadius: '16px',
          boxShadow: shadow,
          transform: 'rotate(-1deg)'
        }}>
          <h1 style={{ 
            ...fonts.displayLg, 
            color: '#6c5100', 
            margin: 0,
            lineHeight: 1.1 
          }}>
            Welcome<br/>back [ USER ]
          </h1>
          <p style={{ 
            ...fonts.labelMono, 
            color: '#6c5100', 
            marginTop: '12px',
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            margin: '12px 0 0 0' 
          }}>
            // SYSTEM AUTHENTICATION REQUIRED
          </p>
        </div>

        {/* Terminal Form Window */}
        <div style={{
          backgroundColor: '#ffffff',
          border: border,
          borderRadius: '16px',
          boxShadow: shadow,
          overflow: 'hidden'
        }}>
          {/* Window Header */}
          <div style={{
            backgroundColor: '#1c1b1b',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ba1a1a' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f5c445' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3DDC84' }} />
            </div>
            <span style={{ ...fonts.labelMono, fontSize: '10px', color: '#fcf9f8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>login_portal.exe</span>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ ...fonts.labelMono, marginLeft: '8px' }}>EMAIL_ADDRESS</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 20px',
                  backgroundColor: '#ffffff',
                  border: thinBorder,
                  borderRadius: '9999px',
                  ...fonts.terminalText,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="user@domain.com"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ ...fonts.labelMono, marginLeft: '8px' }}>USER_PASSWORD</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 20px',
                  backgroundColor: '#ffffff',
                  border: thinBorder,
                  borderRadius: '9999px',
                  ...fonts.terminalText,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="••••••••"
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <Link to="/forgot-password" style={{ ...fonts.labelMono, color: '#775a00', textDecoration: 'none' }}>
                  [ FORGOT_PASSWORD? ]
                </Link>
              </div>
            </div>

            {/* Main CTA */}
            <button 
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '52px',
                backgroundColor: '#F08080',
                border: 'none',
                borderRadius: '9999px',
                ...fonts.headlineMd,
                fontSize: '18px',
                color: '#1c1b1b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                marginTop: '12px'
              }}
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'} 
              {!loading && <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>}
            </button>
          </form>
        </div>

        {/* Social Logins */}
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '12px', marginTop: '16px' }}>
          <div 
            onClick={() => handleOAuthLogin('google')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              ...fonts.labelMono,
              fontSize: '10px',
              cursor: 'pointer',
              color: '#1c1b1b'
            }}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '14px', height: '14px' }} />
            Sign in with Google
          </div>
          <div 
            onClick={() => handleOAuthLogin('github')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              ...fonts.labelMono,
              fontSize: '10px',
              cursor: 'pointer',
              color: '#1c1b1b'
            }}
          >
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" style={{ width: '16px', height: '16px', filter: 'brightness(0)' }} />
            Sign in with GitHub
          </div>
        </div>

        {/* Secondary Link */}
        <div style={{ textAlign: 'center', paddingTop: '16px', paddingBottom: '32px' }}>
          <div style={{ ...fonts.bodyLg, fontSize: '13px', fontWeight: 700, color: '#1c1b1b', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            New here? 
            <Link to="/signup" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: '#69509e', textDecorationThickness: '2px', textUnderlineOffset: '4px' }}>
              Create an account
            </Link>
            <span className="material-symbols-outlined" style={{ color: '#69509e', fontSize: '18px' }}>person_add</span>
          </div>
        </div>

      </main>

      {/* Bottom Navigation Shell / Footer */}
      <footer style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: '#c3a8fd',
        marginTop: 'auto',
        boxSizing: 'border-box'
      }}>
        {/* Sign In (ACTIVE) */}
        <div 
          onClick={() => navigate('/login')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#775a00',
            color: '#ffffff',
            borderRadius: '9999px',
            padding: '4px 40px',
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px', marginBottom: '2px' }}>login</span>
          <span style={{ ...fonts.labelMono, textTransform: 'uppercase', fontSize: '10px' }}>Sign In</span>
        </div>

        {/* Create Account (INACTIVE) */}
        <div 
          onClick={() => navigate('/signup')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#513985',
            padding: '4px 40px',
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px', marginBottom: '2px' }}>person_add</span>
          <span style={{ ...fonts.labelMono, textTransform: 'uppercase', fontSize: '10px' }}>Create Account</span>
        </div>
      </footer>
    </div>
  );
};

export default Login;
