import React from 'react';

interface ErrorModalProps {
  error: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(2px)' // Slight blur for the background
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '32px 32px 24px 32px',
        borderRadius: '16px',
        border: 'var(--border-thick)',
        boxShadow: '8px 8px 0px #000', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '90%',
        maxWidth: '400px',
        boxSizing: 'border-box'
      }}>
        
        {/* Warning Icon */}
        <div style={{ marginBottom: '-10px' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--panel-yellow)" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(4px 4px 0px #000)' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: 'var(--display)',
          fontSize: '28px',
          fontWeight: 'normal',
          margin: 0,
          color: 'var(--text-primary)',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          ERROR NOTICE
        </h2>

        {/* Message Box */}
        <div style={{
          backgroundColor: '#f1f5f9', // Cooler gray
          padding: '16px 20px',
          borderRadius: '8px',
          border: 'var(--border-thick)',
          width: '100%',
          boxSizing: 'border-box',
          textAlign: 'center',
          marginBottom: '4px'
        }}>
          <p style={{
            margin: 0,
            fontFamily: 'var(--sans)',
            fontWeight: '700',
            fontSize: '16px',
            color: 'var(--text-primary)'
          }}>
            {error}
          </p>
        </div>

        {/* Understand Button */}
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'var(--btn-coral)',
            color: 'var(--panel-white)',
            padding: '14px',
            borderRadius: '10px',
            border: 'var(--border-thick)',
            boxShadow: '4px 4px 0px #000',
            fontFamily: 'var(--sans)',
            fontWeight: '900',
            fontSize: '16px',
            letterSpacing: '0.02em',
            width: '100%',
            cursor: 'pointer',
            transition: 'all 0.1s ease-in-out',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(2px, 2px)';
            e.currentTarget.style.boxShadow = '2px 2px 0px #000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '4px 4px 0px #000';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translate(4px, 4px)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translate(2px, 2px)';
            e.currentTarget.style.boxShadow = '2px 2px 0px #000';
          }}
        >
          UNDERSTAND
        </button>

      </div>
    </div>
  );
};

export default ErrorModal;
