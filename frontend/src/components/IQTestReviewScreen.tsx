import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIQTest } from '../context/IQTestContext';
import { iqTestBank } from '../data/iqTestBank';

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */
const BORDER = '3px solid #1c1b1b';
const SHADOW = '6px 6px 0px 0px rgba(0,0,0,1)';

const FONTS = {
  labelMono: { fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } as React.CSSProperties,
  bodyLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 500 } as React.CSSProperties,
  headlineMd: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 } as React.CSSProperties,
  displayLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 } as React.CSSProperties,
};

/* ------------------------------------------------------------------ */
/* Styles (values unchanged from original — only grouped/named here)  */
/* ------------------------------------------------------------------ */
const styles: { [key: string]: React.CSSProperties } = {
  page: {
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
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },

  header: {
    width: '100%',
    backgroundColor: '#fcf9f8',
    borderBottom: BORDER,
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
    boxShadow: SHADOW,
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  headerBrand: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
  headerBrandLogo: { height: '40px' },
  headerTitle: { ...FONTS.labelMono, fontSize: '14px', textTransform: 'uppercase' },

  main: { width: '100%', maxWidth: '800px', padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: '40px', flex: 1, boxSizing: 'border-box' },

  introWrapper: { textAlign: 'center' },
  introTitle: { ...FONTS.displayLg, fontSize: '48px', margin: '0 0 16px 0', letterSpacing: '-0.02em' },
  introBody: { ...FONTS.bodyLg, fontSize: '18px', color: '#4e4635' },
  introBodyStrong: { color: '#1c1b1b' },

  questionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '20px',
    border: BORDER,
    boxShadow: SHADOW,
  },
  questionCellBase: {
    aspectRatio: '1/1',
    border: BORDER,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...FONTS.headlineMd,
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
    transition: 'transform 0.1s',
  },

  footer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTop: BORDER,
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    boxSizing: 'border-box',
  },
  backButton: {
    backgroundColor: '#c3a8fd',
    color: '#1c1b1b',
    border: BORDER,
    borderRadius: '9999px',
    padding: '12px 32px',
    ...FONTS.headlineMd,
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    boxShadow: SHADOW,
  },
  submitButton: {
    backgroundColor: '#F08080',
    color: '#1c1b1b',
    border: BORDER,
    borderRadius: '9999px',
    padding: '12px 32px',
    ...FONTS.headlineMd,
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    boxShadow: SHADOW,
    opacity: 1,
  },
};

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */
const IQTestReviewScreen: React.FC = () => {
  const navigate = useNavigate();
  const { answers } = useIQTest();

  const totalQuestions = iqTestBank.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;

  return (
    <div style={styles.page}>
      {/* Top Navbar */}
      <header style={styles.header}>
        <div style={styles.headerBrand} onClick={() => navigate('/home')}>
          <img src="/logo.png" alt="ResumeIQ Logo" style={styles.headerBrandLogo} />
        </div>
        <div style={styles.headerTitle}>Review Submission</div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.introWrapper}>
          <h1 style={styles.introTitle}>Ready to submit?</h1>
          <p style={styles.introBody}>
            You have answered <strong style={styles.introBodyStrong}>{answeredCount}</strong> out of{' '}
            <strong style={styles.introBodyStrong}>{totalQuestions}</strong> questions.
          </p>
        </div>

        {/* Grid */}
        <div style={styles.questionGrid}>
          {iqTestBank.map((_, idx) => {
            const isAnswered = answers[idx] !== undefined;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/test?q=${idx}`)}
                style={{
                  ...styles.questionCellBase,
                  backgroundColor: isAnswered ? '#8FE3B0' : '#F08080',
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'translate(2px, 2px)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'none')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Nav */}
      <footer style={styles.footer}>
        <button onClick={() => navigate('/test')} style={styles.backButton}>
          <span className="material-symbols-outlined">arrow_back</span>
          BACK TO TEST
        </button>

        <button
          onClick={() => navigate('/test/results')}
          disabled={!allAnswered}
          style={{
            ...styles.submitButton,
            backgroundColor: allAnswered ? '#F08080' : '#e5e5e5',
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            boxShadow: allAnswered ? SHADOW : 'none',
            opacity: allAnswered ? 1 : 0.6,
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
