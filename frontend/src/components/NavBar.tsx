import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  userProfile?: {
    name?: string;
    picture?: string;
  };
}

const NavBar: React.FC<NavBarProps> = ({ userProfile }) => {
  const navigate = useNavigate();
  const [isHoveringHome, setIsHoveringHome] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'sticky', top: '16px', zIndex: 50 }}>
      <nav 
        style={{ 
          backgroundColor: '#b996f7', 
          border: '3px solid #000',
          borderRadius: '9999px',
          padding: '12px 24px',
          boxShadow: '6px 6px 0px #000',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '50px',
          width: '100%',
          maxWidth: '1136px', // Matches the 1200px container minus 4rem padding in Home
          boxSizing: 'border-box'
        }}
      >
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/home')}>
        <img src="/logo.png" alt="ResumeIQ Logo" style={{ height: '48px' }} />
      </div>
      <div style={{ display: 'flex', gap: '24px', fontFamily: 'var(--mono, monospace)', fontSize: '14px', color: '#1c1b1b', opacity: 0.7, fontWeight: 600, textTransform: 'uppercase' }}>
        <span className="nav-link" onClick={() => navigate('/home')} style={{ cursor: 'pointer', textDecoration: window.location.pathname === '/home' ? 'underline' : 'none' }}>Home</span>
        <span className="nav-link" onClick={() => navigate('/cover-letter')} style={{ cursor: 'pointer', textDecoration: window.location.pathname === '/cover-letter' ? 'underline' : 'none' }}>Cover Letter</span>
        <span className="nav-link" onClick={() => navigate('/mock-interview')} style={{ cursor: 'pointer', textDecoration: window.location.pathname === '/mock-interview' ? 'underline' : 'none' }}>Mock Interview</span>
        <span className="nav-link" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', textDecoration: window.location.pathname === '/dashboard' ? 'underline' : 'none' }}>Job Tracker</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => navigate('/iqtest')}
          style={{ 
            backgroundColor: '#f5c445', 
            border: '3px solid #000', 
            borderRadius: '9999px', 
            padding: '8px 24px', 
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            color: '#1c1b1b'
          }}>
          IQ Test
        </button>

        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #000', overflow: 'hidden', backgroundColor: 'white', cursor: 'pointer' }}
          >
            <img src={userProfile?.picture || (userProfile as any)?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="avatar" style={{ width: '100%', height: '100%' }} />
          </div>
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              backgroundColor: '#fff',
              border: '3px solid #000',
              boxShadow: '4px 4px 0px #000',
              borderRadius: '8px',
              padding: '8px 0',
              minWidth: '120px',
              zIndex: 100
            }}>
              <div 
                onClick={handleLogout}
                style={{ 
                  padding: '8px 16px', 
                  cursor: 'pointer', 
                  fontFamily: 'var(--mono, monospace)', 
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#d93025' // Red color for logout
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>
      </nav>
    </div>
  );
};

export default NavBar;
