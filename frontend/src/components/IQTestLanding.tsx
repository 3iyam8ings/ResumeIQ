import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

interface IQTestLandingProps {
  userProfile?: any;
}

const border = '3px solid #1c1b1b';
const shadow = '6px 6px 0px 0px rgba(0,0,0,1)';

const fonts = {
  labelMono: { fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 },
  bodyLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 500 },
  headlineMd: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 },
  displayLg: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 }
};

const IQTestLanding: React.FC<IQTestLandingProps> = ({ userProfile }) => {
  const navigate = useNavigate();
  const [bootText, setBootText] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      '> initializing_core_sequence...',
      '> loading_spatial_logic_modules... [DONE]',
      '> calibrating_pattern_recognition... [DONE]',
      '> status: ready_for_subject_input',
      '> connection_secured...',
      '> analytical_engine_warmup...',
      '> neural_pathway_mapping: COMPLETE',
      '> final_check: ALL SYSTEMS GO'
    ];
    let i = 0;
    const interval = setInterval(() => {
      setBootText(prev => [...prev, sequence[i]]);
      i++;
      if (i >= sequence.length) clearInterval(interval);
    }, 400); // Wait between lines
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fcf9f8',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      color: '#1c1b1b',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px'
    }}>
      {/* Top Universal Navbar */}
      <NavBar userProfile={userProfile} />

      {/* Page Title */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 48px auto',
        width: '100%',
      }}>
        <h1 style={{ 
          margin: 0, 
          display: 'inline-block',
          backgroundColor: '#f5c445',
          border: '4px solid #1c1b1b',
          padding: '12px 24px',
          boxShadow: '8px 8px 0px 0px #1c1b1b',
          transform: 'rotate(-2deg)',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 900,
          fontSize: '42px',
          letterSpacing: '-1px'
        }}>
          Terminal IQTest
        </h1>
      </div>

      {/* Main Grid */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '64px',
        maxWidth: '1200px',
        margin: '0 auto',
        flex: 1,
        width: '100%'
      }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'flex-start' }}>
          
          <div style={{
            backgroundColor: '#1c1b1b',
            color: '#ffffff',
            padding: '8px 24px',
            borderRadius: '9999px',
            ...fonts.labelMono,
            fontSize: '14px',
            textTransform: 'uppercase',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
          }}>
            [ TEST STATUS: READY ]
          </div>

          {/* Yellow Hero Card */}
          <div style={{
            backgroundColor: '#f5c445',
            border: border,
            borderRadius: '24px',
            boxShadow: shadow,
            padding: '48px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h1 style={{ ...fonts.displayLg, fontSize: '48px', margin: 0, lineHeight: 1.1, letterSpacing: '-1px' }}>
              Discover Your<br/>IQ Score
            </h1>
            <p style={{ ...fonts.bodyLg, fontSize: '18px', color: '#1c1b1b', opacity: 0.8, lineHeight: 1.6, margin: 0 }}>
              Unleash your cognitive potential with our science-inspired assessment. Designed by psychometric experts to provide rapid, accurate insights into your fluid intelligence and spatial reasoning.
            </p>
          </div>

          {/* 3 Info Cards */}
          <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
            {[
              { icon: 'quiz', text: '20 QUESTIONS' },
              { icon: 'timer', text: '12 MINUTES' },
              { icon: 'bolt', text: 'INSTANT RESULTS' }
            ].map((item, idx) => (
              <div key={idx} style={{
                flex: 1,
                backgroundColor: '#ffffff',
                border: border,
                borderRadius: '16px',
                boxShadow: shadow,
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'center'
              }}>
                <span className="material-symbols-outlined" style={{ color: '#F08080', fontSize: '28px' }}>{item.icon}</span>
                <span style={{ ...fonts.labelMono, fontSize: '12px' }}>{item.text}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/test')}
            style={{
              backgroundColor: '#F08080', // Coral
              color: '#1c1b1b',
              border: border,
              borderRadius: '9999px',
              padding: '20px 48px',
              ...fonts.headlineMd,
              fontSize: '20px',
              cursor: 'pointer',
              boxShadow: shadow,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '16px',
              transition: 'transform 0.1s, box-shadow 0.1s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(6px, 6px)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = shadow;
            }}
          >
            START TEST
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_forward</span>
          </button>
        </div>

        {/* Right Column (Terminal) */}
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '500px' }}>
          {/* Top 2% Badge */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            backgroundColor: '#8FE3B0',
            border: border,
            padding: '12px 24px',
            ...fonts.labelMono,
            fontSize: '16px',
            zIndex: 10,
            boxShadow: shadow
          }}>
            TOP 2%
          </div>

          <div style={{
            backgroundColor: '#1c1b1b',
            border: border,
            borderRadius: '24px',
            boxShadow: shadow,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transform: 'rotate(2deg)' // Slight tilt like the mockup
          }}>
            {/* Terminal Header */}
            <div style={{ 
              display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '2px solid #333', gap: '8px'
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
              <span style={{ ...fonts.labelMono, color: '#3DDC84', fontSize: '12px', marginLeft: '16px' }}>
                IQ_CORE_V2.0
              </span>
            </div>
            
            {/* Terminal Body */}
            <div style={{ padding: '32px', ...fonts.labelMono, color: '#3DDC84', fontSize: '14px', lineHeight: 1.8, flex: 1, display: 'flex', flexDirection: 'column' }}>
              {bootText.map((text, i) => (
                <div key={i}>{text}</div>
              ))}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ backgroundColor: '#3DDC84', color: '#1c1b1b', padding: '2px 8px', fontWeight: 800 }}>READY</span>
                <span className="animate-pulse">_</span>
              </div>

              {/* Decorative blocks inside terminal */}
              <div style={{ display: 'flex', flexWrap: 'wrap', width: '120px', gap: '4px', alignSelf: 'center', marginTop: '48px', opacity: 0.2 }}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} style={{ width: '36px', height: '36px', backgroundColor: '#3DDC84', border: '1px solid #000' }} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '64px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 0',
        borderTop: '2px solid #e5e5e5',
        maxWidth: '1200px',
        width: '100%',
        margin: '64px auto 0 auto'
      }}>
        <div style={{ ...fonts.bodyLg, fontSize: '14px', color: '#999', fontStyle: 'italic' }}>
          "For entertainment and self-insight purposes, not a clinical assessment"
        </div>

      </footer>
    </div>
  );
};

export default IQTestLanding;
