import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ErrorModal from './ErrorModal';

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
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fcf9f8',
      backgroundImage: 'radial-gradient(#d2c5af 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      color: '#1c1b1b',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      <style>{`
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      {/* Top App Bar */}
      <header style={{
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#fcf9f8',
        borderBottom: '3px solid #1c1b1b',
        boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        position: 'relative',
        zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>📄</span>
          <span style={{ fontSize: '24px', fontWeight: 900 }}>ResumeIQ</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 600, color: '#4e4635' }}>FEATURES</span>
          <span onClick={() => navigate('/home')} style={{ cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 600, color: '#4e4635' }}>GO BACK TO HOME</span>
          <span style={{ cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 800, color: '#775a00' }}>SIGN UP</span>
        </div>
      </header>

      <main style={{ maxWidth: '576px', margin: '0 auto', padding: '64px 24px 0', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* Headline Container */}
        <div style={{
          backgroundColor: '#B79CF0',
          border: '3px solid #1c1b1b',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
          transform: 'rotate(-1deg)'
        }}>
          <h1 style={{ fontSize: '48px', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0 }}>
            Join the <br/>
            <span style={{ backgroundColor: '#1c1b1b', color: '#fcf9f8', padding: '8px', display: 'inline-block', margin: '4px 0' }}>[ FUTURE ]</span>
          </h1>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', marginTop: '24px', color: '#4e4635', fontSize: '14px', letterSpacing: '0.1em' }}>
            // INITIALIZING ENROLLMENT SEQUENCE_
          </p>
        </div>

        {/* Signup Form */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '3px solid #1c1b1b',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'relative',
          zIndex: 10
        }}>
          {error && <ErrorModal error={error} onClose={() => setError(null)} />}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 600, color: '#4e4635', textTransform: 'uppercase', marginLeft: '4px' }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" style={{ width: '100%', backgroundColor: 'white', border: '3px solid #1c1b1b', borderRadius: '9999px', padding: '12px 24px', fontSize: '18px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 600, color: '#4e4635', textTransform: 'uppercase', marginLeft: '4px' }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="hello@future.ai" style={{ width: '100%', backgroundColor: 'white', border: '3px solid #1c1b1b', borderRadius: '9999px', padding: '12px 24px', fontSize: '18px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 600, color: '#4e4635', textTransform: 'uppercase', marginLeft: '4px' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', backgroundColor: 'white', border: '3px solid #1c1b1b', borderRadius: '9999px', padding: '12px 24px', fontSize: '18px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginTop: '24px' }}>
              <button 
                type="submit"
                disabled={loading}
                onMouseEnter={() => setIsHoveringCreate(true)}
                onMouseLeave={() => setIsHoveringCreate(false)}
                style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: '#7BE0A0',
                border: '3px solid #1c1b1b',
                borderRadius: '9999px',
                padding: '24px',
                fontSize: '24px',
                fontWeight: 700,
                color: '#1c1b1b',
                boxShadow: isHoveringCreate ? 'none' : '6px 6px 0px 0px rgba(0,0,0,1)',
                transform: isHoveringCreate ? 'translate(6px, 6px)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                transition: 'all 0.1s ease-in-out'
              }}>
                {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
                {!loading && <span>➔</span>}
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '12px 0' }}>
            <hr style={{ flexGrow: 1, borderTop: '1px solid #4e4635', borderBottom: 'none' }} />
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', color: '#4e4635' }}>OR CONNECT WITH</span>
            <hr style={{ flexGrow: 1, borderTop: '1px solid #4e4635', borderBottom: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <button onClick={() => handleOAuthLogin('google')} style={{
              backgroundColor: 'white', border: '3px solid #1c1b1b', borderRadius: '9999px', padding: '12px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: '"JetBrains Mono", monospace', fontWeight: 600
            }}>
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '20px', height: '20px' }} /> GOOGLE
            </button>
            <button onClick={() => handleOAuthLogin('github')} style={{
              backgroundColor: 'white', border: '3px solid #1c1b1b', borderRadius: '9999px', padding: '12px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: '"JetBrains Mono", monospace', fontWeight: 600
            }}>
              <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" style={{ width: '20px', height: '20px' }} /> GITHUB
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ fontSize: '14px', color: '#4e4635', margin: 0 }}>
              Already have an account? <Link to="/login" style={{ color: '#1c1b1b', fontWeight: 800, textDecoration: 'underline', textDecorationColor: '#69509e', textDecorationThickness: '2px', textUnderlineOffset: '2px' }}>Log in</Link>
            </p>
          </div>
        </div>

        {/* Interactive Terminal Decoration */}
        <div style={{
          backgroundColor: '#0D0D0D',
          borderRadius: '20px',
          border: '3px solid #1c1b1b',
          padding: '24px',
          boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
          marginBottom: '64px'
        }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF5F56' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFBD2E' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27C93F' }}></div>
          </div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', color: '#3DDC84', fontSize: '14px', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 4px 0' }}>{">"} resumeiq --version 2.4.0-stable</p>
            <p style={{ margin: '0 0 4px 0' }}>{">"} system.status: online</p>
            <p style={{ margin: '0 0 4px 0' }}>{">"} ready_to_build: true</p>
            <p style={{ margin: 0 }}>{">"} <span style={{ animation: 'blinkCursor 1s step-end infinite' }}>_</span></p>
          </div>
        </div>

      </main>

      {/* Purple Footer */}
      <footer style={{
        width: '100%',
        backgroundColor: '#B79CF0',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxSizing: 'border-box',
        borderTop: '3px solid #1c1b1b',
        marginTop: 'auto'
      }}>
        <div 
          onClick={() => navigate('/login')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#1c1b1b' }}
        >
          <span style={{ fontSize: '24px' }}>➔]</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 600 }}>Sign In</span>
        </div>
        <div 
          onClick={() => navigate('/signup')}
          style={{
            backgroundColor: '#775a00',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            padding: '12px 24px',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '18px' }}>👤+</span>
          Create Account
        </div>
      </footer>
    </div>
  );
};

export default Signup;
