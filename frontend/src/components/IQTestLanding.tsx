import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { useIQTest } from '../context/IQTestContext';
import MushroomButton from './MushroomButton';

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */
interface IQTestLandingProps {
  userProfile?: any;
}

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
/* Content data                                                         */
/* ------------------------------------------------------------------ */
const BOOT_SEQUENCE = [
  '> initializing_core_sequence...',
  '> loading_spatial_logic_modules... [DONE]',
  '> calibrating_pattern_recognition... [DONE]',
  '> status: ready_for_subject_input',
  '> connection_secured...',
  '> analytical_engine_warmup...',
  '> neural_pathway_mapping: COMPLETE',
  '> final_check: ALL SYSTEMS GO',
];
const BOOT_LINE_DELAY_MS = 400;

const INFO_CARDS = [
  { icon: 'quiz', text: '20 QUESTIONS' },
  { icon: 'timer', text: '12 MINUTES' },
  { icon: 'bolt', text: 'INSTANT RESULTS' },
];

const DECORATIVE_BLOCK_COUNT = 6;

/* ------------------------------------------------------------------ */
/* Responsive breakpoints                                              */
/* Inline styles can't use CSS media queries, so viewport width is     */
/* tracked in JS and used to pick size/layout overrides per breakpoint */
/* (same approach as IQTestScreen.tsx / NavBar.tsx / PatternMatrix.tsx)*/
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

// Size/spacing/layout overrides only — colors and structure (border, radius,
// shadow style) stay identical across breakpoints. Merge these on top of
// `styles.<key>` at render time, e.g. `{ ...styles.heroCard, ...responsive.heroCard }`.
const getResponsiveStyles = (viewport: ViewportCategory) => {
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  return {
    page: {
      padding: isMobile ? '12px' : isTablet ? '16px' : '24px',
    } as React.CSSProperties,
    titleWrapper: {
      margin: isMobile ? '0 auto 20px auto' : isTablet ? '0 auto 32px auto' : '0 auto 48px auto',
    } as React.CSSProperties,
    titleBadge: {
      padding: isMobile ? '8px 16px' : isTablet ? '10px 20px' : '12px 24px',
      boxShadow: isMobile ? '4px 4px 0px 0px #1c1b1b' : isTablet ? '6px 6px 0px 0px #1c1b1b' : '8px 8px 0px 0px #1c1b1b',
      fontSize: isMobile ? '24px' : isTablet ? '32px' : '42px',
    } as React.CSSProperties,
    mainGrid: {
      gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
      gap: isMobile ? '24px' : isTablet ? '32px' : '64px',
    } as React.CSSProperties,
    statusPill: {
      padding: isMobile ? '6px 16px' : isTablet ? '7px 20px' : '8px 24px',
      fontSize: isMobile ? '12px' : isTablet ? '13px' : '14px',
    } as React.CSSProperties,
    heroCard: {
      padding: isMobile ? '24px 20px' : isTablet ? '36px 28px' : '48px 40px',
      gap: isMobile ? '12px' : '16px',
    } as React.CSSProperties,
    heroTitle: {
      fontSize: isMobile ? '28px' : isTablet ? '36px' : '48px',
    } as React.CSSProperties,
    heroBody: {
      fontSize: isMobile ? '14px' : isTablet ? '16px' : '18px',
    } as React.CSSProperties,
    infoCardRow: {
      gap: isMobile ? '8px' : isTablet ? '12px' : '16px',
    } as React.CSSProperties,
    infoCard: {
      padding: isMobile ? '14px 6px' : isTablet ? '18px 12px' : '24px 16px',
      gap: isMobile ? '6px' : '12px',
    } as React.CSSProperties,
    infoCardIcon: {
      fontSize: isMobile ? '20px' : isTablet ? '24px' : '28px',
    } as React.CSSProperties,
    infoCardText: {
      fontSize: isMobile ? '9px' : isTablet ? '10px' : '12px',
    } as React.CSSProperties,
    startButton: {
      padding: isMobile ? '14px 28px' : isTablet ? '16px 36px' : '20px 48px',
      fontSize: isMobile ? '15px' : isTablet ? '17px' : '20px',
      marginTop: isMobile ? '4px' : '16px',
      width: isMobile ? '100%' : undefined,
      justifyContent: (isMobile ? 'center' : undefined) as React.CSSProperties['justifyContent'],
    } as React.CSSProperties,
    rightColumn: {
      minHeight: isMobile ? '320px' : isTablet ? '400px' : '500px',
    } as React.CSSProperties,
    topBadge: {
      top: isMobile ? '-10px' : '-20px',
      right: isMobile ? '-10px' : '-20px',
      padding: isMobile ? '8px 16px' : '12px 24px',
      fontSize: isMobile ? '13px' : '16px',
    } as React.CSSProperties,
    terminalBody: {
      padding: isMobile ? '20px' : isTablet ? '26px' : '32px',
      fontSize: isMobile ? '12px' : isTablet ? '13px' : '14px',
    } as React.CSSProperties,
    decorativeBlockGrid: {
      display: (isMobile ? 'none' : 'flex') as React.CSSProperties['display'],
    } as React.CSSProperties,
    footer: {
      marginTop: isMobile ? '32px' : isTablet ? '48px' : '64px',
      margin: isMobile ? '32px auto 0 auto' : isTablet ? '48px auto 0 auto' : '64px auto 0 auto',
      padding: isMobile ? '16px 0' : '24px 0',
    } as React.CSSProperties,
    footerDisclaimer: {
      fontSize: isMobile ? '11px' : '14px',
    } as React.CSSProperties,
  };
};

/* ------------------------------------------------------------------ */
/* Styles (values unchanged from original — only grouped/named here)  */
/* ------------------------------------------------------------------ */
const getTerminalDotStyle = (color: string): React.CSSProperties => ({ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color });

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fcf9f8',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: '#1c1b1b',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
  },

  titleWrapper: { maxWidth: '1200px', margin: '0 auto 48px auto', width: '100%' },
  titleBadge: {
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
    letterSpacing: '-1px',
  },

  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', maxWidth: '1200px', margin: '0 auto', flex: 1, width: '100%' },

  leftColumn: { display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'flex-start' },
  statusPill: {
    backgroundColor: '#1c1b1b',
    color: '#ffffff',
    padding: '8px 24px',
    borderRadius: '9999px',
    ...FONTS.labelMono,
    fontSize: '14px',
    textTransform: 'uppercase',
    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
  },

  heroCard: {
    backgroundColor: '#f5c445',
    border: BORDER,
    borderRadius: '24px',
    boxShadow: SHADOW,
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  heroTitle: { ...FONTS.displayLg, fontSize: '48px', margin: 0, lineHeight: 1.1, letterSpacing: '-1px' },
  heroBody: { ...FONTS.bodyLg, fontSize: '18px', color: '#1c1b1b', opacity: 0.8, lineHeight: 1.6, margin: 0 },

  infoCardRow: { display: 'flex', gap: '16px', width: '100%' },
  infoCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    border: BORDER,
    borderRadius: '16px',
    boxShadow: SHADOW,
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'center',
  },
  infoCardIcon: { color: '#F08080', fontSize: '28px' },
  infoCardText: { ...FONTS.labelMono, fontSize: '12px' },

  startButton: {
    backgroundColor: '#F08080',
    color: '#1c1b1b',
    border: BORDER,
    borderRadius: '9999px',
    padding: '20px 48px',
    ...FONTS.headlineMd,
    fontSize: '20px',
    cursor: 'pointer',
    boxShadow: SHADOW,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '16px',
    transition: 'transform 0.1s, box-shadow 0.1s',
  },
  startButtonIcon: { fontSize: '24px' },

  rightColumn: { position: 'relative', width: '100%', height: '100%', minHeight: '500px' },
  topBadge: {
    position: 'absolute',
    top: '-20px',
    right: '-20px',
    backgroundColor: '#8FE3B0',
    border: BORDER,
    padding: '12px 24px',
    ...FONTS.labelMono,
    fontSize: '16px',
    zIndex: 10,
    boxShadow: SHADOW,
  },

  terminalWindow: {
    backgroundColor: '#1c1b1b',
    border: BORDER,
    borderRadius: '24px',
    boxShadow: SHADOW,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transform: 'rotate(2deg)',
  },
  terminalHeader: { display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '2px solid #333', gap: '8px' },
  terminalHeaderLabel: { ...FONTS.labelMono, color: '#3DDC84', fontSize: '12px', marginLeft: '16px' },

  terminalBody: { padding: '32px', ...FONTS.labelMono, color: '#3DDC84', fontSize: '14px', lineHeight: 1.8, flex: 1, display: 'flex', flexDirection: 'column' },
  terminalReadyRow: { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' },
  terminalReadyBadge: { backgroundColor: '#3DDC84', color: '#1c1b1b', padding: '2px 8px', fontWeight: 800 },

  decorativeBlockGrid: { display: 'flex', flexWrap: 'wrap', width: '120px', gap: '4px', alignSelf: 'center', marginTop: '48px', opacity: 0.2 },
  decorativeBlock: { width: '36px', height: '36px', backgroundColor: '#3DDC84', border: '1px solid #000' },

  footer: {
    marginTop: '64px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 0',
    borderTop: '2px solid #e5e5e5',
    maxWidth: '1200px',
    width: '100%',
    margin: '64px auto 0 auto',
  },
  footerDisclaimer: { ...FONTS.bodyLg, fontSize: '14px', color: '#999', fontStyle: 'italic' },
};

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */
const IQTestLanding: React.FC<IQTestLandingProps> = ({ userProfile }) => {
  const navigate = useNavigate();
  const { resetTest } = useIQTest();
  const [bootText, setBootText] = useState<string[]>([]);
  const [isHoveringStart, setIsHoveringStart] = useState(false);
  const viewport = useViewportCategory();
  const responsive = getResponsiveStyles(viewport);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setBootText((prev) => [...prev, BOOT_SEQUENCE[i]]);
      i++;
      if (i >= BOOT_SEQUENCE.length) clearInterval(interval);
    }, BOOT_LINE_DELAY_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ ...styles.page, ...responsive.page }}>
      {/* Top Universal Navbar */}
      <NavBar userProfile={userProfile} />

      {/* Page Title */}
      <div style={{ ...styles.titleWrapper, ...responsive.titleWrapper }}>
        <h1 style={{ ...styles.titleBadge, ...responsive.titleBadge }}>Terminal IQTest</h1>
      </div>

      {/* Main Grid */}
      <main style={{ ...styles.mainGrid, ...responsive.mainGrid }}>
        {/* Left Column */}
        <div style={styles.leftColumn}>
          <div style={{ ...styles.statusPill, ...responsive.statusPill }}>[ TEST STATUS: READY ]</div>

          {/* Yellow Hero Card */}
          <div style={{ ...styles.heroCard, ...responsive.heroCard }}>
            <h2 style={{ ...styles.heroTitle, ...responsive.heroTitle }}>
              Discover Your
              <br />
              IQ Score
            </h2>
            <p style={{ ...styles.heroBody, ...responsive.heroBody }}>
              Unleash your cognitive potential with our science-inspired assessment. Designed by psychometric
              experts to provide rapid, accurate insights into your fluid intelligence and spatial reasoning.
            </p>
          </div>

          {/* 3 Info Cards */}
          <div style={{ ...styles.infoCardRow, ...responsive.infoCardRow }}>
            {INFO_CARDS.map((item, idx) => (
              <div key={idx} style={{ ...styles.infoCard, ...responsive.infoCard }}>
                <span className="material-symbols-outlined" style={{ ...styles.infoCardIcon, ...responsive.infoCardIcon }}>{item.icon}</span>
                <span style={{ ...styles.infoCardText, ...responsive.infoCardText }}>{item.text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              resetTest();
              navigate('/test');
            }}
            style={{
              ...styles.startButton,
              ...responsive.startButton,
              transform: isHoveringStart ? 'translate(6px, 6px)' : 'none',
              boxShadow: isHoveringStart ? 'none' : SHADOW,
            }}
            onMouseEnter={() => setIsHoveringStart(true)}
            onMouseLeave={() => setIsHoveringStart(false)}
          >
            START TEST
            <span className="material-symbols-outlined" style={styles.startButtonIcon}>arrow_forward</span>
          </button>
        </div>

        {/* Right Column (Terminal) */}
        <div style={{ ...styles.rightColumn, ...responsive.rightColumn }}>
          {/* Top 2% Badge */}
          <div style={{ ...styles.topBadge, ...responsive.topBadge }}>TOP 2%</div>

          <div style={styles.terminalWindow}>
            {/* Terminal Header */}
            <div style={styles.terminalHeader}>
              <div style={getTerminalDotStyle('#ff5f56')} />
              <div style={getTerminalDotStyle('#ffbd2e')} />
              <div style={getTerminalDotStyle('#27c93f')} />
              <span style={styles.terminalHeaderLabel}>IQ_CORE_V2.0</span>
            </div>

            {/* Terminal Body */}
            <div style={{ ...styles.terminalBody, ...responsive.terminalBody }}>
              {bootText.map((text, i) => (
                <div key={i}>{text}</div>
              ))}
              <div style={styles.terminalReadyRow}>
                <span style={styles.terminalReadyBadge}>READY</span>
                <span className="animate-pulse">_</span>
              </div>

              {/* Decorative blocks inside terminal — hidden on mobile to save vertical space */}
              <div style={{ ...styles.decorativeBlockGrid, ...responsive.decorativeBlockGrid }}>
                {Array.from({ length: DECORATIVE_BLOCK_COUNT }, (_, i) => (
                  <div key={i} style={styles.decorativeBlock} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ ...styles.footer, ...responsive.footer }}>
        <div style={{ ...styles.footerDisclaimer, ...responsive.footerDisclaimer }}>
          "For entertainment and self-insight purposes, not a clinical assessment"
        </div>
      </footer>
      <MushroomButton />
    </div>
  );
};

export default IQTestLanding;
