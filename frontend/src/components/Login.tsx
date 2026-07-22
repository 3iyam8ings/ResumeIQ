import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

      // Success, redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `http://localhost:8082/oauth2/authorization/${provider}`;
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--bg)',
    fontFamily: 'var(--sans)',
    padding: '2rem'
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--panel-yellow)', // Yellow panel for login
    padding: '40px',
    borderRadius: '20px',
    border: 'var(--border-thick)',
    boxShadow: 'var(--shadow-hard)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    position: 'relative'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    margin: 0,
    letterSpacing: '-0.02em',
    textAlign: 'center'
  };

  const badgeStyle: React.CSSProperties = {
    fontFamily: 'var(--mono)',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--terminal-bg)',
    border: '2px solid var(--terminal-bg)',
    padding: '4px 8px',
    borderRadius: '4px',
    alignSelf: 'center',
    backgroundColor: 'var(--panel-white)'
  };

  const getInputStyle = (isFocused: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '12px 20px',
    borderRadius: '9999px',
    border: 'var(--border-thick)',
    backgroundColor: isFocused ? 'var(--panel-lavender)' : 'var(--panel-white)',
    color: 'var(--text-primary)',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'background-color 0.2s'
  });

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    borderRadius: '9999px',
    backgroundColor: 'var(--btn-coral)',
    color: 'var(--text-primary)',
    fontSize: '18px',
    fontWeight: '800',
    border: 'var(--border-thick)',
    boxShadow: 'var(--shadow-hard)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.1s ease-in-out'
  };

  const oauthButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'var(--panel-white)',
    fontSize: '16px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        <div style={badgeStyle}>
          [STATUS: SECURE]
        </div>

        <h1 style={titleStyle}>ResumeIQ</h1>
        <p style={{ margin: 0, textAlign: 'center', color: 'var(--text-primary)', fontWeight: '500' }}>
          Welcome back! Ready to get hired?
        </p>

        {error && (
          <div style={{ backgroundColor: '#ffdad6', color: '#93000a', padding: '12px', borderRadius: '8px', border: '2px solid #93000a', fontFamily: 'var(--mono)', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: 'var(--text-primary)' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              style={getInputStyle(focusedInput === 'email')}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: 'var(--text-primary)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              style={getInputStyle(focusedInput === 'password')}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            style={buttonStyle}
            disabled={loading}
            onMouseDown={(e) => {
              if(!loading) {
                e.currentTarget.style.boxShadow = 'var(--shadow-pressed)';
                e.currentTarget.style.transform = 'translate(4px, 4px)';
              }
            }}
            onMouseUp={(e) => {
              if(!loading) {
                e.currentTarget.style.boxShadow = 'var(--shadow-hard)';
                e.currentTarget.style.transform = 'translate(0px, 0px)';
              }
            }}
            onMouseLeave={(e) => {
              if(!loading) {
                e.currentTarget.style.boxShadow = 'var(--shadow-hard)';
                e.currentTarget.style.transform = 'translate(0px, 0px)';
              }
            }}
          >
            {loading ? 'Logging in...' : 'Enter System'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
          <div style={{ flex: 1, height: '3px', backgroundColor: 'var(--text-primary)' }} />
          <span style={{ fontWeight: '800', fontSize: '14px' }}>OR</span>
          <div style={{ flex: 1, height: '3px', backgroundColor: 'var(--text-primary)' }} />
        </div>

        <button 
          type="button"
          style={oauthButtonStyle}
          onClick={() => handleOAuthLogin('google')}
          onMouseDown={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-pressed)';
            e.currentTarget.style.transform = 'translate(4px, 4px)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-hard)';
            e.currentTarget.style.transform = 'translate(0px, 0px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-hard)';
            e.currentTarget.style.transform = 'translate(0px, 0px)';
          }}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '20px', height: '20px' }} />
          Continue with Google
        </button>

        <button 
          type="button"
          style={oauthButtonStyle}
          onClick={() => handleOAuthLogin('github')}
          onMouseDown={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-pressed)';
            e.currentTarget.style.transform = 'translate(4px, 4px)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-hard)';
            e.currentTarget.style.transform = 'translate(0px, 0px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-hard)';
            e.currentTarget.style.transform = 'translate(0px, 0px)';
          }}
        >
          <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" style={{ width: '20px', height: '20px' }} />
          Continue with GitHub
        </button>

        <p style={{ textAlign: 'center', margin: 0, fontWeight: '500', fontSize: '14px' }}>
          New here? <Link to="/signup" style={{ color: 'var(--text-primary)', fontWeight: '800' }}>Sign up</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
