import React from 'react';

const Footer: React.FC = () => {
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
