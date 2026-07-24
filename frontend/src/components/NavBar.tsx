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

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#7c3aed', // Purple
      padding: '12px 24px',
      border: '4px solid #1c1b1b',
      borderRadius: '9999px',
      margin: '16px 24px',
      boxShadow: '4px 4px 0px 0px #1c1b1b',
      color: '#fff',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    }}>
      {/* Logo */}
      <div 
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => navigate('/dashboard')}
      >
        <img src="/logo.png" alt="ResumeIQ" style={{ height: '48px' }} />
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center', textTransform: 'uppercase' }}>
        <span className="nav-link" onClick={() => navigate('/home')} style={{ cursor: 'pointer', fontWeight: 700, fontSize: '14px', textDecoration: window.location.pathname === '/home' ? 'underline' : 'none' }}>Home</span>
        <span className="nav-link" onClick={() => navigate('/cover-letter')} style={{ cursor: 'pointer', fontWeight: 700, fontSize: '14px', textDecoration: window.location.pathname === '/cover-letter' ? 'underline' : 'none' }}>Cover Letter</span>
        <span className="nav-link" onClick={() => navigate('/mock-interview')} style={{ cursor: 'pointer', fontWeight: 700, fontSize: '14px', textDecoration: window.location.pathname === '/mock-interview' ? 'underline' : 'none' }}>Mock Interview</span>
        <span className="nav-link" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', fontWeight: 700, fontSize: '14px', textDecoration: window.location.pathname === '/dashboard' ? 'underline' : 'none' }}>Job Tracker</span>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onMouseEnter={() => setIsHoveringHome(true)}
          onMouseLeave={() => setIsHoveringHome(false)}
          onClick={() => navigate('/home')}
          style={{
            backgroundColor: '#f5c445',
            color: '#1c1b1b',
            border: '2px solid #1c1b1b',
            borderRadius: '9999px',
            padding: '8px 16px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.1s ease',
            transform: isHoveringHome ? 'translate(4px, 4px)' : 'none',
            boxShadow: isHoveringHome ? 'none' : '4px 4px 0px 0px #1c1b1b',
            fontFamily: 'inherit'
          }}
        >
          Go to Home
        </button>
        {userProfile?.picture ? (
          <img 
            src={userProfile.picture} 
            alt="Profile" 
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #1c1b1b', backgroundColor: '#f3f4f6' }} 
          />
        ) : (
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #1c1b1b', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: '#1c1b1b', fontSize: '20px' }}>person</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
