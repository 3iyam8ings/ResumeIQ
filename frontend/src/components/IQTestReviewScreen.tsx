import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIQTest } from '../context/IQTestContext';
import { iqTestBank } from '../data/iqTestBank';

const border = '3px solid #1c1b1b';
const shadow = '6px 6px 0px 0px rgba(0,0,0,1)';

const fonts = {
  labelMono: { fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 },
  bodyLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 500 },
  headlineMd: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 },
  displayLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 }
};

const IQTestReviewScreen: React.FC = () => {
  const navigate = useNavigate();
  const { answers } = useIQTest();

  const totalQuestions = iqTestBank.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;

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
      alignItems: 'center'
    }}>
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
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/home')}>
          <img src="/logo.png" alt="ResumeIQ Logo" style={{ height: '40px' }} />
        </div>
        <div style={{ ...fonts.labelMono, fontSize: '14px', textTransform: 'uppercase' }}>
          Review Submission
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        width: '100%',
        maxWidth: '800px',
        padding: '48px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        flex: 1
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ ...fonts.displayLg, fontSize: '48px', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
            Ready to submit?
          </h1>
          <p style={{ ...fonts.bodyLg, fontSize: '18px', color: '#4e4635' }}>
            You have answered <strong style={{ color: '#1c1b1b' }}>{answeredCount}</strong> out of <strong style={{ color: '#1c1b1b' }}>{totalQuestions}</strong> questions.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          backgroundColor: '#ffffff',
          padding: '32px',
          borderRadius: '20px',
          border: border,
          boxShadow: shadow
        }}>
          {iqTestBank.map((_, idx) => {
            const isAnswered = answers[idx] !== undefined;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/test?q=${idx}`)}
                style={{
                  aspectRatio: '1/1',
                  backgroundColor: isAnswered ? '#8FE3B0' : '#F08080',
                  border: border,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...fonts.headlineMd,
                  fontSize: '24px',
                  cursor: 'pointer',
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                  transition: 'transform 0.1s',
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'translate(2px, 2px)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'none'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>

      </main>

      {/* Footer Nav */}
      <footer style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderTop: border,
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto'
      }}>
        <button 
          onClick={() => navigate('/test')}
          style={{
            backgroundColor: '#c3a8fd',
            color: '#1c1b1b',
            border: border,
            borderRadius: '9999px',
            padding: '12px 32px',
            ...fonts.headlineMd,
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: shadow
          }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          BACK TO TEST
        </button>

        <button 
          onClick={() => navigate('/test/results')}
          disabled={!allAnswered}
          style={{
            backgroundColor: allAnswered ? '#F08080' : '#e5e5e5',
            color: allAnswered ? '#1c1b1b' : '#999',
            border: border,
            borderRadius: '9999px',
            padding: '12px 32px',
            ...fonts.headlineMd,
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            boxShadow: allAnswered ? shadow : 'none',
            opacity: allAnswered ? 1 : 0.7
          }}
        >
          SUBMIT TEST
          <span className="material-symbols-outlined">send</span>
        </button>
      </footer>
    </div>
  );
};

export default IQTestReviewScreen;
