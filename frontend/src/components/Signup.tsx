import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ErrorModal from './ErrorModal';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

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

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'var(--bg)',
    fontFamily: 'var(--sans)',
    padding: '2rem'
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--panel-lavender)', // Lavender for signup
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
    fontWeight: 'normal',
    fontFamily: 'var(--display)',
    color: 'var(--text-primary)',
    margin: 0,
    letterSpacing: '0.02em',
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


  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    borderRadius: '9999px',
    backgroundColor: 'var(--btn-mint)',
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
          [NEW RECRUIT]
        </div>

        <h1 style={titleStyle}>Create Account</h1>
        
        {error && (
          <ErrorModal error={error} onClose={() => setError(null)} />
        )}


        <button 
          type="button"
          style={oauthButtonStyle}
          onClick={() => handleOAuthLogin('google')}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '20px', height: '20px' }} />
          Sign up with Google
        </button>

        <button 
          type="button"
          style={oauthButtonStyle}
          onClick={() => handleOAuthLogin('github')}
        >
          <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" style={{ width: '20px', height: '20px' }} />
          Sign up with GitHub
        </button>

        <p style={{ textAlign: 'center', margin: 0, fontWeight: '500', fontSize: '14px' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: '800' }}>Login here</Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
