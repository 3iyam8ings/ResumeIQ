import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Cpu, Target, BrainCircuit, Gamepad2, Mic } from 'lucide-react';

const COLORS = {
  bg: '#fcf9f8',
  ink: '#1c1b1b',
  mint: '#7BE0A0',
  lavender: '#B79CF0',
  yellow: '#F5C445',
  coral: '#F08080',
  terminalBg: '#0D0D0D',
  terminalGreen: '#3DDC84',
};

const BORDER = `3px solid ${COLORS.ink}`;
const SHADOW = '6px 6px 0px 0px rgba(0,0,0,1)';

const features = [
  {
    title: 'Resume Matcher',
    description: 'AI calculates a match score against job descriptions and tells you exactly what skills are missing.',
    icon: <Target size={32} color={COLORS.ink} />,
    color: COLORS.mint,
    delay: 0.1,
  },
  {
    title: 'Cover Letter Genius',
    description: 'Generate hyper-specific cover letters that blend your experience with the target role perfectly.',
    icon: <FileText size={32} color={COLORS.ink} />,
    color: COLORS.lavender,
    delay: 0.2,
  },
  {
    title: 'Voice AI Interview',
    description: 'Practice with a real-time AI voice interviewer that asks dynamic behavioral and technical questions.',
    icon: <Mic size={32} color={COLORS.ink} />,
    color: COLORS.yellow,
    delay: 0.3,
  },
  {
    title: 'Kanban Job Tracker',
    description: 'Organize your job hunt. Drag and drop applications through stages from "Saved" to "Offer".',
    icon: <Cpu size={32} color={COLORS.ink} />,
    color: COLORS.coral,
    delay: 0.4,
  },
  {
    title: 'Cognitive IQ Test',
    description: 'Take dynamic spatial reasoning and logic tests to build a personalized cognitive profile.',
    icon: <BrainCircuit size={32} color="#FFFFFF" />,
    color: COLORS.terminalBg,
    textColor: '#FFFFFF',
    bgImage: '/iq-bg.png',
    titleFont: '"Press Start 2P", system-ui',
    delay: 0.5,
  },
  {
    title: 'Super Mario Arena',
    description: 'Because job hunting is exhausting. Jump into the hidden retro arcade and take a break.',
    icon: <Gamepad2 size={32} color="#FFFFFF" />,
    color: '#E52521', // Mario Red
    textColor: '#FFFFFF',
    bgImage: '/mario-bg.jpg',
    titleFont: '"Press Start 2P", system-ui',
    delay: 0.6,
  }
];

const FeaturesShowcase: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.bg,
      backgroundImage: 'radial-gradient(#d2c5af 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      color: COLORS.ink,
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .features-main { padding: 40px 16px !important; gap: 40px !important; }
          .features-hero-card { padding: 28px !important; }
          .features-hero-title { font-size: 36px !important; }
          .features-grid { gap: 20px !important; }
        }

        @media (max-width: 480px) {
          .features-header { padding: 10px 16px !important; }
          .features-header-nav { gap: 16px !important; }
          .features-hero-title { font-size: 28px !important; }
          .features-hero-card { padding: 20px !important; }
        }
      `}</style>

      {/* Header */}
      <header className="features-header" style={{
        backgroundColor: COLORS.bg,
        borderBottom: BORDER,
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: SHADOW,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/home')}>
          <img src="/logo.png" alt="ResumeIQ Logo" style={{ height: '48px' }} />
          <span style={{ fontSize: '24px', fontWeight: 900 }}>ResumeIQ</span>
        </div>
        <div className="features-header-nav" style={{ display: 'flex', gap: '24px', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', fontWeight: 800 }}>
          <span style={{ cursor: 'pointer', color: COLORS.ink }} onClick={() => navigate('/home')}>HOME</span>
          <span style={{ cursor: 'pointer', color: COLORS.coral }} onClick={() => navigate('/signup')}>SIGN UP</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="features-main" style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 24px', display: 'flex', flexDirection: 'column', gap: '64px' }}>
        <motion.div
          className="features-hero-card"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{
            backgroundColor: COLORS.lavender,
            border: BORDER,
            borderRadius: '20px',
            padding: '48px',
            boxShadow: SHADOW,
            textAlign: 'center',
            transform: 'rotate(-1deg)',
          }}
        >
          <h1 className="features-hero-title" style={{ fontSize: '56px', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, margin: 0 }}>
            Supercharge Your <br /> Job Search
          </h1>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', marginTop: '24px', fontWeight: 600, fontSize: '16px', letterSpacing: '0.05em' }}>
            // DISCOVER THE TOOLS DESIGNED TO GET YOU HIRED
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: feature.delay, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -5, x: -5, boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)' }}
              style={{
                backgroundColor: feature.color,
                ...(feature.bgImage ? {
                  backgroundImage: `url('${feature.bgImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  textShadow: '0px 2px 4px rgba(0,0,0,0.8)'
                } : {}),
                color: feature.textColor || COLORS.ink,
                border: feature.textColor ? `3px solid ${feature.textColor}` : BORDER,
                borderRadius: '20px',
                padding: '32px',
                boxShadow: SHADOW,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                cursor: 'default',
              }}
            >
              <div style={{
                backgroundColor: feature.textColor ? 'transparent' : COLORS.bg,
                border: feature.textColor ? `3px solid ${feature.textColor}` : BORDER,
                borderRadius: '12px',
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: feature.textColor ? 'none' : '4px 4px 0px 0px rgba(0,0,0,1)',
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: feature.titleFont ? '16px' : '24px', fontWeight: 800, margin: 0, color: 'inherit', fontFamily: feature.titleFont || 'inherit', lineHeight: feature.titleFont ? 1.5 : 'initial' }}>{feature.title}</h3>
              <p style={{ fontSize: '16px', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FeaturesShowcase;
