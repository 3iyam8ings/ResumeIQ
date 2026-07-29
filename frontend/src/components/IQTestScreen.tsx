import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIQTest } from '../context/IQTestContext';
import { iqTestBank } from '../data/iqTestBank';
import { PatternMatrix, ShapeRenderer } from './PatternMatrix';
import ErrorModal from './ErrorModal';

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */
const BORDER = '3px solid #1c1b1b';
const SHADOW = '6px 6px 0px 0px rgba(0,0,0,1)';

const FONTS = {
  labelMono: { fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } as React.CSSProperties,
  bodyLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 500 } as React.CSSProperties,
  headlineMd: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 } as React.CSSProperties,
};

const TIME_PER_QUESTION = 45; // seconds
const REPORT_ISSUE_EMAIL = 'tiyaaaxi@gmail.com';

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
    position: 'relative',
  },

  header: { width: '100%', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' },
  headerLeft: { display: 'flex', flexDirection: 'column', gap: '8px' },
  questionCounter: { ...FONTS.labelMono, fontSize: '14px', textTransform: 'uppercase', color: '#1c1b1b', letterSpacing: '1px' },
  progressTrack: { width: '200px', height: '6px', backgroundColor: '#e5e5e5', borderRadius: '3px', overflow: 'hidden' },
  progressFillBase: { height: '100%', backgroundColor: '#f5c445', transition: 'width 0.3s ease' },
  percentComplete: { ...FONTS.labelMono, fontSize: '12px', color: '#666' },
  timerPill: {
    backgroundColor: '#1c1b1b',
    color: '#ffffff',
    padding: '8px 24px',
    borderRadius: '9999px',
    ...FONTS.labelMono,
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  timerIcon: { color: '#3DDC84', fontSize: '18px' },

  main: { width: '100%', maxWidth: '800px', padding: '0 24px 32px 24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 },

  questionPanel: {
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    boxShadow: '0px 8px 0px 0px #1c1b1b, 0px 0px 0px 3px #1c1b1b',
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  questionPrompt: { ...FONTS.headlineMd, fontSize: '24px', margin: 0, whiteSpace: 'pre-wrap' },

  answerGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
  answerOptionBase: { borderRadius: '12px', padding: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s ease' },
  answerOptionText: { ...FONTS.bodyLg, fontSize: '20px' },

  footer: { width: '100%', maxWidth: '800px', padding: '0 24px 32px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  reportIssue: { ...FONTS.labelMono, fontSize: '12px', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' },
  reportIssueIcon: { fontSize: '16px' },

  nextButtonBase: {
    color: '#1c1b1b',
    border: BORDER,
    borderRadius: '9999px',
    padding: '16px 40px',
    ...FONTS.headlineMd,
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.15s ease-out',
  },
};

/* ------------------------------------------------------------------ */
/* Responsive breakpoints                                              */
/* Inline styles can't use CSS media queries, so viewport width is     */
/* tracked in JS and used to pick size overrides per breakpoint.       */
/* ------------------------------------------------------------------ */
const BREAKPOINTS = { mobile: 640, tablet: 1024 };

type ViewportCategory = 'mobile' | 'tablet' | 'desktop';

const getViewportCategory = (width: number): ViewportCategory => {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};

const useViewportCategory = (): ViewportCategory => {
  const [category, setCategory] = useState<ViewportCategory>(() =>
    typeof window !== 'undefined' ? getViewportCategory(window.innerWidth) : 'desktop'
  );

  useEffect(() => {
    const handleResize = () => setCategory(getViewportCategory(window.innerWidth));
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return category;
};

// Size/spacing overrides only — colors, borders, and structure stay identical
// to the base `styles` object across breakpoints. Merge these on top of
// `styles.<key>` at render time (e.g. `{ ...styles.header, ...responsive.header }`).
const getResponsiveStyles = (viewport: ViewportCategory) => {
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  return {
    header: {
      padding: isMobile ? '16px' : isTablet ? '20px 28px' : '24px 48px',
      flexWrap: (isMobile ? 'wrap' : 'nowrap') as React.CSSProperties['flexWrap'],
      rowGap: isMobile ? '12px' : undefined,
    } as React.CSSProperties,
    progressTrack: {
      width: isMobile ? '100px' : isTablet ? '150px' : '200px',
    } as React.CSSProperties,
    timerPill: {
      padding: isMobile ? '6px 16px' : isTablet ? '7px 20px' : '8px 24px',
      fontSize: isMobile ? '13px' : isTablet ? '14px' : '16px',
    } as React.CSSProperties,
    timerIcon: {
      fontSize: isMobile ? '16px' : '18px',
    } as React.CSSProperties,
    main: {
      padding: isMobile ? '0 12px 16px 12px' : isTablet ? '0 20px 24px 20px' : '0 24px 32px 24px',
      gap: isMobile ? '12px' : isTablet ? '18px' : '24px',
    } as React.CSSProperties,
    questionPanel: {
      padding: isMobile ? '20px' : isTablet ? '32px' : '48px',
      gap: isMobile ? '16px' : isTablet ? '24px' : '32px',
      boxShadow: isMobile
        ? '0px 5px 0px 0px #1c1b1b, 0px 0px 0px 2px #1c1b1b'
        : '0px 8px 0px 0px #1c1b1b, 0px 0px 0px 3px #1c1b1b',
    } as React.CSSProperties,
    questionPrompt: {
      fontSize: isMobile ? '17px' : isTablet ? '20px' : '24px',
    } as React.CSSProperties,
    answerGrid: {
      gap: isMobile ? '10px' : isTablet ? '12px' : '16px',
    } as React.CSSProperties,
    answerOptionBase: {
      padding: isMobile ? '14px 8px' : isTablet ? '18px' : '24px',
    } as React.CSSProperties,
    answerOptionText: {
      fontSize: isMobile ? '14px' : isTablet ? '17px' : '20px',
    } as React.CSSProperties,
    answerShapeSize: isMobile ? 32 : isTablet ? 40 : 48,
    footer: {
      padding: isMobile ? '0 12px 16px 12px' : isTablet ? '0 20px 24px 20px' : '0 24px 32px 24px',
    } as React.CSSProperties,
    reportIssue: {
      fontSize: isMobile ? '10px' : '12px',
    } as React.CSSProperties,
    nextButtonBase: {
      padding: isMobile ? '10px 18px' : isTablet ? '14px 28px' : '16px 40px',
      fontSize: isMobile ? '14px' : isTablet ? '16px' : '18px',
    } as React.CSSProperties,
  };
};

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */
const IQTestScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { answers, setAnswer, timeRemaining, setTimeRemaining } = useIQTest();

  /* ---------------- Derived from URL ---------------- */
  const queryParams = new URLSearchParams(location.search);
  const initialIndex = parseInt(queryParams.get('q') || '0', 10);

  /* ---------------- State ---------------- */
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 && initialIndex < iqTestBank.length ? initialIndex : 0
  );
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [isNextHovered, setIsNextHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    timeRemaining[currentIndex] !== undefined ? timeRemaining[currentIndex] : TIME_PER_QUESTION
  );

  const currentQuestion = iqTestBank[currentIndex];
  const advancedForIndexRef = useRef<number | null>(null);
  const viewport = useViewportCategory();
  const responsive = getResponsiveStyles(viewport);

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    if (timeLeft <= 0) {
      if (advancedForIndexRef.current !== currentIndex) {
        advancedForIndexRef.current = currentIndex;
        handleNext();
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentIndex]);

  useEffect(() => {
    setTimeLeft(timeRemaining[currentIndex] !== undefined ? timeRemaining[currentIndex] : TIME_PER_QUESTION);
  }, [currentIndex, timeRemaining]);

  useEffect(() => {
    const q = parseInt(new URLSearchParams(location.search).get('q') || '0', 10);
    if (q >= 0 && q < iqTestBank.length && q !== currentIndex) {
      setCurrentIndex(q);
    }
  }, [location.search]);

  /* ---------------- Handlers ---------------- */
  const handleSelectAnswer = (index: number) => {
    setAnswer(currentIndex, index);
  };

  const handleNext = () => {
    setTimeRemaining(currentIndex, timeLeft);
    if (currentIndex < iqTestBank.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigate('/test/review');
    }
  };

  /* ---------------- Derived values ---------------- */
  const percentComplete = Math.round((Object.keys(answers).length / iqTestBank.length) * 100);
  const isAnswered = answers[currentIndex] !== undefined;

  if (!currentQuestion) {
    return null;
  }

  /* ---------------- Render ---------------- */
  return (
    <div style={styles.page}>
      {showReportIssue && (
        <ErrorModal
          error={`Please contact the creator at ${REPORT_ISSUE_EMAIL} to report any issues or bugs.`}
          onClose={() => setShowReportIssue(false)}
        />
      )}

      {/* Top Navbar */}
      <header style={{ ...styles.header, ...responsive.header }}>
        <div style={styles.headerLeft}>
          <div style={styles.questionCounter}>
            [QUESTION {currentIndex + 1} OF {iqTestBank.length}]
          </div>
          {/* Yellow Progress Bar */}
          <div style={{ ...styles.progressTrack, ...responsive.progressTrack }}>
            <div
              style={{
                ...styles.progressFillBase,
                width: `${((currentIndex + 1) / iqTestBank.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div style={styles.percentComplete}>{percentComplete}% Complete</div>

        <div style={{ ...styles.timerPill, ...responsive.timerPill }}>
          <span className="material-symbols-outlined" style={{ ...styles.timerIcon, ...responsive.timerIcon }}>timer</span>
          <span style={{ color: timeLeft <= 10 ? '#ff5252' : '#ffffff' }}>
            00:{timeLeft.toString().padStart(2, '0')}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ ...styles.main, ...responsive.main }}>
        {/* Question Panel */}
        <div style={{ ...styles.questionPanel, ...responsive.questionPanel }}>
          <h2 style={{ ...styles.questionPrompt, ...responsive.questionPrompt }}>{currentQuestion.prompt}</h2>

          {currentQuestion.grid && <PatternMatrix grid={currentQuestion.grid} />}
        </div>

        {/* Answer Grid */}
        <div style={{ ...styles.answerGrid, ...responsive.answerGrid }}>
          {(currentQuestion.optionShapes || currentQuestion.options).map((option, idx) => {
            const isSelected = answers[currentIndex] === idx;
            const isShape = typeof option !== 'string';

            return (
              <div
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                style={{
                  ...styles.answerOptionBase,
                  ...responsive.answerOptionBase,
                  backgroundColor: isSelected ? '#8FE3B0' : '#f5f5f5',
                  border: isSelected ? BORDER : '2px solid transparent',
                  boxShadow: isSelected ? 'none' : '0px 4px 0px 0px #1c1b1b, 0px 0px 0px 2px #1c1b1b',
                  transform: isSelected ? 'translate(0px, 4px)' : 'none',
                }}
              >
                {isShape ? (
                  <ShapeRenderer shape={option} size={responsive.answerShapeSize} />
                ) : (
                  <div style={{ ...styles.answerOptionText, ...responsive.answerOptionText }}>{option}</div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ ...styles.footer, ...responsive.footer }}>
        <div onClick={() => setShowReportIssue(true)} style={{ ...styles.reportIssue, ...responsive.reportIssue }}>
          <span className="material-symbols-outlined" style={styles.reportIssueIcon}>flag</span>
          Report Issue
        </div>

        <button
          onClick={handleNext}
          onMouseEnter={() => setIsNextHovered(true)}
          onMouseLeave={() => setIsNextHovered(false)}
          disabled={!isAnswered}
          style={{
            ...styles.nextButtonBase,
            ...responsive.nextButtonBase,
            backgroundColor: isAnswered ? '#c3a8fd' : '#e5e5e5',
            cursor: isAnswered ? 'pointer' : 'not-allowed',
            boxShadow: isAnswered && !isNextHovered ? SHADOW : 'none',
            transform: isAnswered && isNextHovered ? 'translate(6px, 6px)' : 'none',
            opacity: isAnswered ? 1 : 0.6,
          }}
        >
          {currentIndex === iqTestBank.length - 1 ? 'Review' : 'Next Question'}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};

export default IQTestScreen;
