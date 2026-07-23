import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from './ErrorModal';

const SetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to set password');
      }

      // Success, redirect to dashboard
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'var(--bg)',
    fontFamily: 'var(--sans)',
    padding: '2rem',
    boxSizing: 'border-box'
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--panel-white)',
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
    fontSize: '28px',
    fontWeight: 'normal',
    fontFamily: 'var(--display)',
    color: 'var(--text-primary)',
    margin: 0,
    letterSpacing: '0.02em',
    textAlign: 'center'
  };

  const getInputStyle = (isFocused: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '12px 20px',
    borderRadius: '9999px',
    border: 'var(--border-thick)',
    backgroundColor: isFocused ? 'var(--panel-yellow)' : 'var(--panel-white)',
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

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Set Your Password</h1>
        <p style={{ margin: 0, textAlign: 'center', color: 'var(--text-primary)', fontWeight: '500' }}>
          Please create a password for your account to log in next time.
        </p>

        {error && (
          <ErrorModal error={error} onClose={() => setError(null)} />
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
          >
            {loading ? 'Saving...' : 'Set Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
