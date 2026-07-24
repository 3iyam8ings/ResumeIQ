import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIQTest } from '../context/IQTestContext';
import { iqTestBank } from '../data/iqTestBank';
import { PatternMatrix, ShapeRenderer } from './PatternMatrix';
import ErrorModal from './ErrorModal';
const border = '3px solid #1c1b1b';
const shadow = '6px 6px 0px 0px rgba(0,0,0,1)';

const fonts = {
  labelMono: { fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 },
  bodyLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 500 },
  headlineMd: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 }
};

const TIME_PER_QUESTION = 45; // seconds

const IQTestScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { answers, setAnswer, timeRemaining, setTimeRemaining } = useIQTest();
  
  const queryParams = new URLSearchParams(location.search);
  const initialIndex = parseInt(queryParams.get('q') || '0', 10);
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 && initialIndex < iqTestBank.length ? initialIndex : 0);
  const currentQuestion = iqTestBank[currentIndex];
  const [showReportIssue, setShowReportIssue] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(timeRemaining[currentIndex] !== undefined ? timeRemaining[currentIndex] : TIME_PER_QUESTION);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
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

  const handleSelectAnswer = (index: number) => {
    setAnswer(currentIndex, index);
  };

  const handleNext = () => {
    setTimeRemaining(currentIndex, timeLeft);
    if (currentIndex < iqTestBank.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      navigate('/test/review');
    }
  };

  const percentComplete = Math.round((Object.keys(answers).length / iqTestBank.length) * 100);

  if (!currentQuestion) {
    return null;
  }

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
      alignItems: 'center',
      position: 'relative'
    }}>
      {showReportIssue && <ErrorModal error="Please contact the creator at tiyaaaxi@gmail.com to report any issues or bugs." onClose={() => setShowReportIssue(false)} />}
      
      {/* Top Navbar */}
      <header style={{
        width: '100%',
        padding: '24px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ ...fonts.labelMono, fontSize: '14px', textTransform: 'uppercase', color: '#1c1b1b', letterSpacing: '1px' }}>
            [QUESTION {currentIndex + 1} OF {iqTestBank.length}]
          </div>
          {/* Yellow Progress Bar */}
          <div style={{ width: '200px', height: '6px', backgroundColor: '#e5e5e5', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: '#f5c445', 
              width: `${((currentIndex + 1) / iqTestBank.length) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div style={{ ...fonts.labelMono, fontSize: '12px', color: '#666' }}>
          {percentComplete}% Complete
        </div>

        <div style={{
          backgroundColor: '#1c1b1b',
          color: '#ffffff',
          padding: '8px 24px',
          borderRadius: '9999px',
          ...fonts.labelMono,
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span className="material-symbols-outlined" style={{ color: '#3DDC84', fontSize: '18px' }}>timer</span>
          <span style={{ color: timeLeft <= 10 ? '#ff5252' : '#ff5252' }}>
            00:{timeLeft.toString().padStart(2, '0')}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        width: '100%',
        maxWidth: '800px',
        padding: '0 24px 32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        flex: 1
      }}>
        {/* Question Panel */}
        <div style={{
          backgroundColor: '#ffffff',
          border: 'none',
          borderRadius: '16px',
          boxShadow: '0px 8px 0px 0px #1c1b1b, 0px 0px 0px 3px #1c1b1b', // Thick bottom shadow
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>
          <h2 style={{ 
            ...fonts.headlineMd, 
            fontSize: '24px', 
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}>
            {currentQuestion.prompt}
          </h2>

          {currentQuestion.grid && (
            <PatternMatrix grid={currentQuestion.grid} />
          )}
        </div>

        {/* Answer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          {(currentQuestion.optionShapes || currentQuestion.options).map((option, idx) => {
            const isSelected = answers[currentIndex] === idx;
            const isShape = typeof option !== 'string';
            
            return (
              <div 
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                style={{
                  backgroundColor: isSelected ? '#8FE3B0' : '#f5f5f5',
                  border: isSelected ? border : '2px solid transparent',
                  borderRadius: '12px',
                  boxShadow: isSelected ? 'none' : '0px 4px 0px 0px #1c1b1b, 0px 0px 0px 2px #1c1b1b',
                  padding: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.1s ease',
                  transform: isSelected ? 'translate(0px, 4px)' : 'none'
                }}
              >
                {isShape ? (
                  <ShapeRenderer shape={option} size={48} />
                ) : (
                  <div style={{ ...fonts.bodyLg, fontSize: '20px' }}>
                    {option}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        width: '100%',
        maxWidth: '800px',
        padding: '0 24px 32px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div 
          onClick={() => setShowReportIssue(true)}
          style={{ 
          ...fonts.labelMono, 
          fontSize: '12px', 
          color: '#666', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          textTransform: 'uppercase'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>flag</span>
          Report Issue
        </div>
        
        <button 
          onClick={handleNext}
          onMouseEnter={(e) => {
            if (answers[currentIndex] !== undefined) {
              e.currentTarget.style.transform = 'translate(6px, 6px)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          onMouseLeave={(e) => {
            if (answers[currentIndex] !== undefined) {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = shadow;
            }
          }}
          disabled={answers[currentIndex] === undefined}
          style={{
            backgroundColor: answers[currentIndex] !== undefined ? '#c3a8fd' : '#e5e5e5',
            color: '#1c1b1b',
            border: border,
            borderRadius: '9999px',
            padding: '16px 40px',
            ...fonts.headlineMd,
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: answers[currentIndex] !== undefined ? 'pointer' : 'not-allowed',
            boxShadow: answers[currentIndex] !== undefined ? shadow : 'none',
            opacity: answers[currentIndex] !== undefined ? 1 : 0.6,
            transition: 'all 0.15s ease-out'
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
