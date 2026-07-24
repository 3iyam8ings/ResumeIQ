import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  userProfile?: {
    name?: string;
    picture?: string;
  };
}

const NavBar: React.FC<NavBarProps> = ({ userProfile }) => {
  const navigate = useNavigate();

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
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        onClick={() => navigate('/dashboard')}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>menu</span>
        <span style={{ fontSize: '20px', fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.02em' }}>
          ResumeIQ
        </span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <span onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>Analyze</span>
        <span onClick={() => navigate('/mock-interview')} style={{ cursor: 'pointer', fontWeight: 700, fontSize: '14px', textDecoration: window.location.pathname === '/mock-interview' ? 'underline' : 'none' }}>Mock Interview</span>
        <span onClick={() => navigate('/cover-letter')} style={{ cursor: 'pointer', fontWeight: 700, fontSize: '14px', textDecoration: window.location.pathname === '/cover-letter' ? 'underline' : 'none' }}>Cover Letter</span>
        <span onClick={() => navigate('/history')} style={{ cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: '#d1d5db' }}>History</span>
        <span onClick={() => navigate('/settings')} style={{ cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: '#d1d5db' }}>Settings</span>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span className="material-symbols-outlined" style={{ cursor: 'pointer', fontSize: '24px' }}>search</span>
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
