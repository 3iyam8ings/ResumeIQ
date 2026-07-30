import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  showNavLinks?: boolean;
}

const Footer: React.FC<FooterProps> = ({ showNavLinks = false }) => {
  const navigate = useNavigate();

  return (
    <footer style={{
      backgroundColor: '#000000',
      color: '#ff9fac',
      padding: '24px 20px',
      textAlign: 'center',
      marginTop: 'auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxSizing: 'border-box'
    }}>
      <p style={{
        fontFamily: 'var(--sans)',
        fontSize: '1rem',
        fontWeight: '700',
        margin: 0
      }}>
        Made with ☕, 💻, and Taylor Swift Playlist
      </p>

      {showNavLinks && (
        <div style={{
          display: 'flex',
          gap: '24px',
          margin: '8px 0',
          fontFamily: 'var(--sans)',
          fontSize: '0.95rem',
          fontWeight: '600'
        }}>
          <span 
            onClick={() => navigate('/features')} 
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Features
          </span>
          <span 
            onClick={() => navigate('/')} 
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Logout
          </span>
        </div>
      )}

      <p style={{
        color: '#9ca3af',
        fontFamily: 'var(--sans)',
        margin: 0,
        fontSize: '0.875rem',
        fontWeight: '500'
      }}>
        © 2026 All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
