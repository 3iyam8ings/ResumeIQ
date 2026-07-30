import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  showNavLinks?: boolean;
}

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */
const ACCENT_BLUE = '#60a5fa';
const ACCENT_PINK = '#ff9fac';
const GRAY = '#9ca3af';

// A pill-shaped nav button that owns its own hover state, styled to sit
// naturally on the black footer background (outlined in pink, fills pink
// on hover — mirrors the accent color used in the heading above it).
const FooterNavButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? ACCENT_PINK : 'transparent',
        color: hovered ? '#1c1b1b' : ACCENT_PINK,
        border: `1.5px solid ${ACCENT_PINK}`,
        borderRadius: '9999px',
        padding: '6px 20px',
        fontFamily: 'var(--sans)',
        fontSize: '0.85rem',
        fontWeight: 700,
        letterSpacing: '0.02em',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease, color 0.15s ease',
      }}
    >
      {label}
    </button>
  );
};

const Footer: React.FC<FooterProps> = ({ showNavLinks = true }) => {
  const navigate = useNavigate();

  return (
    <footer style={{
      backgroundColor: '#000000',
      color: ACCENT_PINK,
      padding: '28px 20px 20px 20px',
      textAlign: 'center',
      marginTop: 'auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxSizing: 'border-box',
      borderTop: `4px solid ${ACCENT_BLUE}`,
    }}>
      <p style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontStyle: 'italic',
        fontSize: '1.5rem',
        fontWeight: 800,
        margin: 0,
        letterSpacing: '-0.01em',
      }}>
        Made with ☕, 💻, and Taylor Swift Playlist
      </p>

      {showNavLinks && (
        <div style={{
          display: 'flex',
          gap: '16px',
          margin: '4px 0',
        }}>
          <FooterNavButton label="Features" onClick={() => navigate('/features')} />
          <FooterNavButton label="Logout" onClick={() => navigate('/')} />
        </div>
      )}

      <p style={{
        color: GRAY,
        fontFamily: 'var(--sans)',
        margin: 0,
        fontSize: '0.875rem',
        fontWeight: '500',
      }}>
        © 2026 All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
