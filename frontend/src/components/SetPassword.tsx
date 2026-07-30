import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from './ErrorModal';

/* ====================================================================== */
/* 1. STYLES (values unchanged from original — only grouped/named here,   */
/*    and hoisted out of the component so they aren't re-created on       */
/*    every render/keystroke)                                             */
/* ====================================================================== */
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'var(--bg)',
    fontFamily: 'var(--sans)',
    padding: '2rem',
    boxSizing: 'border-box',
  } as React.CSSProperties,

  card: {
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
    position: 'relative',
  } as React.CSSProperties,

  title: {
    fontSize: '28px',
    fontWeight: 'normal',
    fontFamily: 'var(--display)',
    color: 'var(--text-primary)',
    margin: 0,
    letterSpacing: '0.02em',
    textAlign: 'center',
  } as React.CSSProperties,

  subtitle: {
    margin: 0,
    textAlign: 'center',
    color: 'var(--text-primary)',
    fontWeight: '500',
  } as React.CSSProperties,

  form: { display: 'flex', flexDirection: 'column', gap: '16px' } as React.CSSProperties,

  fieldLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  } as React.CSSProperties,

  input: (isFocused: boolean): React.CSSProperties => ({
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
    transition: 'background-color 0.2s',
  }),

  button: {
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
    transition: 'all 0.1s ease-in-out',
  } as React.CSSProperties,
};

/* ====================================================================== */
/* 2. SET PASSWORD (main component)                                        */
/* ====================================================================== */
const SetPassword: React.FC = () => {
  const navigate = useNavigate();

  /* ---- Form state ---- */
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------------- */
  /* Handlers                                                          */
  /* -------------------------------------------------------------- */
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
        credentials: 'include',
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

  /* -------------------------------------------------------------- */
  /* Render                                                            */
  /* -------------------------------------------------------------- */
  return (
    <div className="setpw-container" style={styles.container}>
      <style>{`
        @media (max-width: 480px) {
          .setpw-container { padding: 1.25rem !important; }
          .setpw-card { padding: 28px !important; }
        }
      `}</style>

      <div className="setpw-card" style={styles.card}>
        <h1 style={styles.title}>Set Your Password</h1>
        <p style={styles.subtitle}>Please create a password for your account to log in next time.</p>

        {error && <ErrorModal error={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.fieldLabel}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              style={styles.input(focusedInput === 'password')}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Saving...' : 'Set Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
