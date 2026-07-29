import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIQTest } from '../context/IQTestContext';
import { iqTestBank } from '../data/iqTestBank';

import { scoreTest } from '../utils/scoring';

const border = '3px solid #1c1b1b';
const shadow = '6px 6px 0px 0px rgba(0,0,0,1)';

const fonts = {
  labelMono: { fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 },
  bodyLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 500 },
  headlineMd: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 },
  displayLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 }
};

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!text) return;
    let i = 0;
    setDisplayedText('');
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(intervalId);
    }, 20);
    return () => clearInterval(intervalId);
  }, [text]);

  return <>{displayedText}</>;
};

const IQTestResultsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { answers } = useIQTest();

  const [scoreData, setScoreData] = useState<{
    iqScore: number;
    percentile: number;
    badge: string;
    categories: Record<string, number>;
    correctAnswers: number;
  } | null>(null);

  const [aiSummary, setAiSummary] = useState<string>('Generating cognitive profile analysis...');
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let correctCount = 0;
    const catScores: Record<string, number> = {
      Logical: 0,
      Spatial: 0,
      Verbal: 0,
      Numerical: 0
    };

    iqTestBank.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswerIndex) {
        correctCount++;
        catScores[q.category]++;
      }
    });

    const result = scoreTest(correctCount, 20);

    setScoreData({
      iqScore: result.iq,
      percentile: result.percentile,
      badge: result.label,
      categories: catScores,
      correctAnswers: correctCount
    });

  }, [answers]);

  useEffect(() => {
    if (!scoreData) return;

    let currentScore = 70;
    const interval = setInterval(() => {
      if (currentScore < scoreData.iqScore) {
        currentScore += Math.ceil((scoreData.iqScore - currentScore) / 10) || 1;
        setAnimatedScore(currentScore);
      } else {
        setAnimatedScore(scoreData.iqScore);
        clearInterval(interval);
      }
    }, 30);

    const fetchSummary = async () => {
      try {
        const response = await fetch('/api/iqtest/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scoreData),
        });

        if (!response.ok) {
          setAiSummary(`Cognitive profile suggests strong abstract reasoning skills.`);
          return;
        }

        const data = await response.json();
        if (data && data.summary) {
          setAiSummary(data.summary);
        }
      } catch (err) {
        setAiSummary(`Cognitive profile suggests strong abstract reasoning skills.`);
      }
    };
    fetchSummary();
    return () => clearInterval(interval);
  }, [scoreData]);

  if (!scoreData) return null;

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#fcf9f8',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      color: '#1c1b1b',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: '0', // Changed to 0 because of the footer
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      <style>{`
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .iq-results-main {
          width: 100%;
          max-width: 900px;
          padding: 48px 24px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          box-sizing: border-box;
        }

        .iq-hero-card { padding: 48px; }
        .iq-hero-title { font-size: 48px; margin: 0 0 32px 0; }
        .iq-hero-icon { top: 32px; right: 48px; font-size: 96px; }
        .iq-score-circle { width: 200px; height: 200px; }
        .iq-score-ring { border-width: 12px; }
        .iq-score-inner { inset: 12px; }
        .iq-score-number { font-size: 56px; }
        .iq-score-label { font-size: 14px; }
        .iq-badge { padding: 12px 32px; font-size: 14px; bottom: -24px; }

        .iq-category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 16px;
        }
        .iq-category-card { padding: 16px; height: 140px; }
        .iq-category-icon { font-size: 24px; }
        .iq-category-pct { font-size: 12px; }
        .iq-category-name { font-size: 20px; }

        .iq-terminal-body { padding: 32px; font-size: 14px; }
        .iq-terminal-header-label { font-size: 12px; }

        .iq-footer { padding: 24px 48px; }
        .iq-footer-link { font-size: 14px; }

        /* Tablet */
        @media (max-width: 900px) {
          .iq-results-main { padding: 36px 20px; gap: 24px; }
          .iq-hero-card { padding: 36px; }
          .iq-hero-title { font-size: 36px; margin-bottom: 24px; }
          .iq-score-circle { width: 170px; height: 170px; }
          .iq-category-card { height: 130px; }
        }

        /* Mobile / tablet-narrow */
        @media (max-width: 640px) {
          .iq-results-main { padding: 20px 12px; gap: 16px; }

          .iq-hero-card { padding: 24px 16px 32px 16px !important; border-radius: 16px !important; }
          .iq-hero-title { font-size: 26px !important; margin: 0 0 20px 0 !important; letter-spacing: normal !important; }
          .iq-hero-icon { top: 16px !important; right: 16px !important; font-size: 48px !important; opacity: 0.15 !important; }

          .iq-score-circle { width: 130px !important; height: 130px !important; }
          .iq-score-ring { border-width: 8px !important; }
          .iq-score-inner { inset: 8px !important; }
          .iq-score-number { font-size: 34px !important; }
          .iq-score-label { font-size: 10px !important; margin-top: 2px !important; }

          .iq-badge {
            padding: 8px 18px !important;
            font-size: 11px !important;
            bottom: -18px !important;
            gap: 4px !important;
            box-shadow: 0 3px 0 0 #fcf9f8, 0 6px 0 0 #1c1b1b !important;
            white-space: nowrap;
          }
          .iq-badge .material-symbols-outlined { font-size: 14px !important; }

          .iq-category-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; margin-top: 8px !important; }
          .iq-category-card { padding: 12px !important; height: 110px !important; border-radius: 12px !important; }
          .iq-category-icon { font-size: 18px !important; }
          .iq-category-pct { font-size: 10px !important; }
          .iq-category-name { font-size: 15px !important; }

          .iq-terminal-body { padding: 16px !important; font-size: 11px !important; line-height: 1.6 !important; gap: 6px !important; }
          .iq-terminal-header-label { font-size: 10px !important; }

          .iq-footer { padding: 16px 20px !important; }
          .iq-footer-link { font-size: 11px !important; }
        }

        @media (max-width: 380px) {
          .iq-score-circle { width: 110px !important; height: 110px !important; }
          .iq-score-number { font-size: 28px !important; }
          .iq-category-card { height: 100px !important; }
          .iq-hero-title { font-size: 22px !important; }
        }
      `}</style>
      {/* Main Content */}
      <main className="iq-results-main">

        {/* Sky Blue Hero Card */}
        <div className="iq-hero-card" style={{
          backgroundColor: '#a3d9f3',
          border: border,
          borderRadius: '24px',
          boxShadow: shadow,
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          {/* Faded Background Icon */}
          <span className="material-symbols-outlined iq-hero-icon" style={{
            position: 'absolute',
            top: '32px',
            right: '48px',
            fontSize: '96px',
            color: '#1c1b1b',
            opacity: 0.2
          }}>
            psychology
          </span>

          <h1 className="iq-hero-title" style={{ ...fonts.displayLg, fontSize: '48px', margin: '0 0 32px 0', letterSpacing: '-1px', textAlign: 'center' }}>
            Your Result
          </h1>

          {/* Circle ring */}
          <div className="iq-score-circle" style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
            flexShrink: 0,
            boxShadow: 'inset 0 0 0 16px #ffffff, inset 0 0 0 32px #1c1b1b' // Simulating the half-black/half-white ring
          }}>
            {/* The actual ring logic can be complex in CSS, we use a trick with border mapping */}
            <div className="iq-score-ring" style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '12px solid #ffffff',
              borderBottomColor: '#1c1b1b',
              borderRightColor: '#1c1b1b',
              transform: 'rotate(45deg)'
            }} />

            <div className="iq-score-inner" style={{
              position: 'absolute',
              inset: '12px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="iq-score-number" style={{ ...fonts.displayLg, fontSize: '56px', color: '#1c1b1b', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {animatedScore}
              </span>
              <span className="iq-score-label" style={{ ...fonts.labelMono, fontSize: '14px', color: '#666', marginTop: '4px' }}>
                OUT OF 140
              </span>
            </div>
          </div>

          {/* Badge */}
          <div className="iq-badge" style={{
            position: 'absolute',
            bottom: '-24px', // Overlapping the bottom border
            backgroundColor: '#1c1b1b',
            color: '#ffffff',
            padding: '12px 32px',
            borderRadius: '9999px',
            ...fonts.labelMono,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 0 0 #fcf9f8, 0 8px 0 0 #1c1b1b', // Mockup shadow effect
            zIndex: 10
          }}>
            <span className="material-symbols-outlined" style={{ color: '#3DDC84', fontSize: '18px' }}>stars</span>
            {scoreData.badge}
          </div>
        </div>

        {/* 4 Category Breakdown Cards */}
        <div className="iq-category-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginTop: '16px'
        }}>
          {[
            { id: 'Logical', icon: 'account_tree', color: '#8FE3B0' },
            { id: 'Spatial', icon: 'layers', color: '#F08080' },
            { id: 'Verbal', icon: 'translate', color: '#8FE3B0' },
            { id: 'Numerical', icon: 'calculate', color: '#F08080' }
          ].map((cat) => {
            const score = scoreData.categories[cat.id] || 0;
            const percentage = (score / 5) * 100;
            return (
              <div key={cat.id} className="iq-category-card" style={{
                backgroundColor: cat.color,
                border: border,
                borderRadius: '16px',
                padding: '16px',
                boxShadow: shadow,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '140px',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="material-symbols-outlined iq-category-icon" style={{ fontSize: '24px' }}>{cat.icon}</span>
                  <span className="iq-category-pct" style={{ ...fonts.labelMono, fontSize: '12px' }}>[{percentage}%]</span>
                </div>

                <span className="iq-category-name" style={{ ...fonts.bodyLg, fontSize: '20px' }}>{cat.id}</span>

                {/* Progress bar */}
                <div style={{
                  width: '100%', height: '16px',
                  backgroundColor: 'transparent',
                  border: '2px solid #1c1b1b',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginTop: '8px'
                }}>
                  <div style={{
                    height: '100%',
                    backgroundColor: '#1c1b1b',
                    width: `${percentage}%`,
                    transition: 'width 1s ease-out',
                    borderRight: percentage < 100 ? '2px solid #1c1b1b' : 'none'
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Black Terminal Panel */}
        <div style={{
          backgroundColor: '#1c1b1b',
          border: border,
          borderRadius: '24px',
          boxShadow: shadow,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginTop: '16px'
        }}>
          {/* Terminal Header */}
          <div style={{
            display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '2px solid #333'
          }}>
            <div style={{ display: 'flex', gap: '8px', position: 'absolute' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
            </div>
            <div className="iq-terminal-header-label" style={{ width: '100%', textAlign: 'center', ...fonts.labelMono, color: '#666', fontSize: '12px' }}>
              analysis_engine_v2.0.4.sh
            </div>
          </div>

          {/* Terminal Body */}
          <div className="iq-terminal-body" style={{ padding: '32px', ...fonts.labelMono, color: '#3DDC84', fontSize: '14px', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box', overflowWrap: 'break-word' }}>
            <div>{'>'} Terminal IQ Test — analysis_engine_v2.0.4.sh</div>
            <div>{'>'} Loaded 20 responses across 4 cognitive domains...</div>
            <div>{'>'} Scoring: Logical, Spatial, Verbal, Numerical...</div>
            <div>{'>'} Comparing against global benchmark population...</div>
            <div style={{ marginBottom: '16px' }}>{'>'} [STATUS: COMPLETE]</div>

            <div style={{ color: '#fff' }}>{'>'} Analysis summary:</div>
            <div>{'>'} Percentile Rank: {scoreData.percentile}{scoreData.percentile % 10 === 1 && scoreData.percentile !== 11 ? 'st' : scoreData.percentile % 10 === 2 && scoreData.percentile !== 12 ? 'nd' : scoreData.percentile % 10 === 3 && scoreData.percentile !== 13 ? 'rd' : 'th'}</div>
            <div>{'>'} Global Average: 100</div>
            <div>{'>'} Out of 140, you have scored {scoreData.iqScore}.</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span>{'>'}</span>
              <span>
                <TypewriterText text={aiSummary} />
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span>{'>'}</span>
              <span style={{ animation: 'blinkCursor 1s step-end infinite' }}>_</span>
            </div>
          </div>
        </div>
      </main>

      {/* Lavender Footer */}
      <footer className="iq-footer" style={{
        width: '100%',
        backgroundColor: '#B79CF0',
        padding: '24px 48px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderTop: '3px solid #1c1b1b',
        marginTop: 'auto'
      }}>
        <span
          className="iq-footer-link"
          onClick={() => navigate('/home')}
          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          style={{
            cursor: 'pointer',
            ...fonts.labelMono,
            fontSize: '14px',
            color: '#1c1b1b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          GO TO HOME
        </span>
      </footer>
    </div>
  );
};

export default IQTestResultsScreen;
