import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ErrorModal from './ErrorModal';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to request password reset');
      }

      setSuccessMsg(data.message || 'If an account matches that email, we have sent a password reset link.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fonts = {
    labelMono: { fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 600, lineHeight: 1.2, letterSpacing: '0.05em' },
    terminalText: { fontFamily: '"JetBrains Mono", monospace', fontSize: '14px', fontWeight: 400, lineHeight: 1.6 },
    displayLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '48px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' },
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

      {/* Main Content */}
      <main style={{
        width: '100%',
        maxWidth: '448px',
        padding: '0 24px',
        marginTop: '64px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Header */}
        <div style={{
          backgroundColor: '#ffb9b7',
          border: border,
          padding: '40px',
          borderRadius: '20px',
          boxShadow: shadow,
          transform: 'rotate(-1deg)'
        }}>
          <h1 style={{ 
            ...fonts.displayLg,
            color: '#91373a', 
            margin: 0,
            lineHeight: 1
          }}>
            Forgot Password?
          </h1>
          <p style={{ 
            ...fonts.labelMono, 
            color: '#91373a', 
            marginTop: '8px',
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            margin: '8px 0 0 0' 
          }}>
            // Enter your email to reset
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
            <span style={{ ...fonts.labelMono, fontSize: '10px', color: '#fcf9f8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>reset_portal.exe</span>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {successMsg ? (
              <div style={{
                backgroundColor: '#c3a8fd',
                color: '#240357',
                padding: '16px',
                borderRadius: '12px',
                border: border,
                ...fonts.labelMono,
                textAlign: 'center'
              }}>
                ✅ {successMsg}
              </div>
            ) : (
              <>
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
                    onFocus={(e) => e.target.style.backgroundColor = '#ffb9b7'}
                    onBlur={(e) => e.target.style.backgroundColor = '#fcf9f8'}
                    placeholder="user@domain.com"
                    required
                  />
                </div>

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
                    transition: 'all 0.2s',
                    marginTop: '8px'
                  }}
                >
                  {loading ? 'SENDING...' : 'SEND RESET LINK'}
                  {!loading && <span className="material-symbols-outlined">send</span>}
                </button>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <Link to="/login" style={{ ...fonts.labelMono, color: '#775a00', textDecoration: 'none' }}>
                [ RETURN_TO_LOGIN ]
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        backgroundColor: '#c3a8fd',
        borderTop: border,
        marginTop: 'auto',
        boxSizing: 'border-box'
      }}>
        <div style={{ ...fonts.labelMono, color: '#513985', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined">security</span>
          SECURE PASSWORD RECOVERY
        </div>
      </footer>
    </div>
  );
};

export default ForgotPassword;
