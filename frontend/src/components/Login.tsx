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
    labelMono: { fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 600, lineHeight: 1.2, letterSpacing: '0.05em' },
    terminalText: { fontFamily: '"JetBrains Mono", monospace', fontSize: '14px', fontWeight: 400, lineHeight: 1.6 },
    displayLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '48px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' },
    displayLgMobile: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '32px', fontWeight: 800, lineHeight: 1.2 },
    headlineMd: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '24px', fontWeight: 700, lineHeight: 1.3 },
    bodyLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '18px', fontWeight: 500, lineHeight: 1.6 }
  };

  const shadow = '6px 6px 0px 0px rgba(0,0,0,1)';
  const border = '3px solid #1c1b1b';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fcf9f8',
      backgroundImage: 'radial-gradient(#d2c5af 1px, transparent 1px)',
      backgroundSize: '40px 40px',
      backgroundPosition: '0 0, 20px 20px',
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
        backgroundColor: '#fcf9f8',
        borderBottom: border,
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
        boxShadow: shadow,
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/home')}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#775a00' }}>description</span>
          <span style={{ ...fonts.headlineMd, fontWeight: 900 }}>ResumeIQ</span>
        </div>
        <div style={{ ...fonts.labelMono }}>
          [ VERSION: 2.0.4 ]
        </div>
      </header>

      {/* Decorative Elements */}
      <div style={{ position: 'absolute', top: '120px', left: '60px', transform: 'rotate(-15deg)', zIndex: 5 }}>
        <div style={{
          backgroundColor: '#f9a8a6',
          padding: '16px',
          borderRadius: '12px',
          border: border,
          boxShadow: '4px 4px 0px #1c1b1b',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ fontSize: '24px' }}>✅</div>
          <div style={{ ...fonts.labelMono, fontSize: '10px', fontWeight: 800, margin: 0, color: '#1c1b1b' }}>AI_APPROVED</div>
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
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#775a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px' }}>
            <path d="M8 21V14A6 6 0 0 1 17 9c.5 1 1 2 0 3l2 2-2 1 1 2-4 2v2" />
            <circle cx="12" cy="13" r="2" />
            <path d="M12 9.5v1.5M12 15v1.5M9.5 13h1.5M15 13h1.5M10.2 11.2l1.1 1.1M13.8 14.8l-1.1-1.1M10.2 14.8l1.1-1.1M13.8 11.2l-1.1 1.1" />
          </svg>
          <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '15px', fontWeight: 800, color: '#1c1b1b', marginTop: '2px' }}>IQ+</span>
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        width: '100%',
        maxWidth: '448px', // max-w-md
        padding: '0 24px',
        marginTop: '64px',
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
          padding: '40px',
          borderRadius: '20px',
          boxShadow: shadow,
          transform: 'rotate(-1deg)'
        }}>
          <h1 style={{ 
            ...fonts.displayLg, // Use the 48px desktop font size
            color: '#6c5100', 
            margin: 0,
            lineHeight: 1 // leading-none
          }}>
            Welcome back [ USER ]
          </h1>
          <p style={{ 
            ...fonts.labelMono, 
            color: '#6c5100', 
            marginTop: '8px', // mt-base
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', // tracking-widest
            margin: '8px 0 0 0' 
          }}>
            // System Authentication Required
          </p>
        </div>

        {/* Terminal Form Window */}
        <div style={{
          backgroundColor: '#ffffff',
          border: border,
          borderRadius: '20px',
          boxShadow: shadow,
          overflow: 'hidden'
        }}>
          {/* Window Header */}
          <div style={{
            backgroundColor: '#1c1b1b',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ba1a1a' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f5c445' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#9d4042' }} />
            </div>
            <span style={{ ...fonts.labelMono, fontSize: '10px', color: '#fcf9f8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>login_portal.exe</span>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ ...fonts.labelMono, marginLeft: '8px' }}>EMAIL_ADDRESS</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  height: '56px',
                  padding: '0 24px',
                  backgroundColor: '#fcf9f8',
                  border: border,
                  borderRadius: '9999px',
                  ...fonts.terminalText,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'background-color 0.2s'
                }}
                onFocus={(e) => e.target.style.backgroundColor = '#f5c445'}
                onBlur={(e) => e.target.style.backgroundColor = '#fcf9f8'}
                placeholder="user@domain.com"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ ...fonts.labelMono, marginLeft: '8px' }}>USER_PASSWORD</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  height: '56px',
                  padding: '0 24px',
                  backgroundColor: '#fcf9f8',
                  border: border,
                  borderRadius: '9999px',
                  ...fonts.terminalText,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'background-color 0.2s'
                }}
                onFocus={(e) => e.target.style.backgroundColor = '#c3a8fd'}
                onBlur={(e) => e.target.style.backgroundColor = '#fcf9f8'}
                placeholder="••••••••"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ ...fonts.labelMono, color: '#775a00', cursor: 'pointer', textDecoration: 'none' }}>
                [ FORGOT_PASSWORD? ]
              </span>
            </div>

            {/* Main CTA */}
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                height: '64px',
                backgroundColor: '#F08080',
                border: border,
                borderRadius: '9999px',
                ...fonts.headlineMd,
                color: '#1c1b1b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
              {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
          </form>
        </div>

        {/* Social Logins */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div 
            onClick={() => handleOAuthLogin('google')}
            style={{
              backgroundColor: '#fcf9f8',
              border: border,
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              ...fonts.labelMono,
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '18px' }}>🌐</span> Sign in with Google
          </div>
          <div 
            onClick={() => handleOAuthLogin('github')}
            style={{
              backgroundColor: '#fcf9f8',
              border: border,
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              ...fonts.labelMono,
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '18px' }}>🐙</span> Sign in with GitHub
          </div>
        </div>

        {/* Secondary Link */}
        <div style={{ textAlign: 'center', paddingTop: '8px', paddingBottom: '32px' }}>
          <div style={{ ...fonts.bodyLg, fontWeight: 700, color: '#4e4635', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            New here? 
            <Link to="/signup" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: '#c3a8fd', textDecorationThickness: '3px', textUnderlineOffset: '4px' }}>
              Create an account
            </Link>
            <span className="material-symbols-outlined" style={{ color: '#69509e' }}>person_add</span>
          </div>
        </div>

      </main>

      {/* Bottom Navigation Shell / Footer */}
      <footer style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '24px',
        backgroundColor: '#c3a8fd',
        borderTop: border,
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
            border: border,
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined">login</span>
          <span style={{ ...fonts.labelMono, textTransform: 'uppercase' }}>Sign In</span>
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
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined">person_add</span>
          <span style={{ ...fonts.labelMono, textTransform: 'uppercase' }}>Create Account</span>
        </div>
      </footer>
    </div>
  );
};

export default Login;

