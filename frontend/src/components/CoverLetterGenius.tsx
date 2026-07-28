import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import MushroomButton from './MushroomButton';

// ============================================================================
// TYPES
// ============================================================================
type Tone = 'Formal' | 'Friendly' | 'Confident';

interface UserProfile {
  name?: string;
}

interface CoverLetterGeniusProps {
  userProfile?: UserProfile;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const TONE_OPTIONS: Tone[] = ['Formal', 'Friendly', 'Confident'];

const TONE_PILL_POSITIONS: Record<Tone, string> = {
  Formal: '4px',
  Friendly: '92px',
  Confident: '180px',
};

const DEFAULTS = {
  company: 'TechNova Solutions Inc.',
  position: 'Senior Creative Developer',
  requirements: 'Expert in React & Tailwind\nNeo-Brutalist Design affinity\n5+ years industrial experience',
};

const STATUS = {
  READY: 'READY TO GENERATE',
  GENERATING: 'OPTIMIZING FOR SUCCESS...',
  COMPLETE: 'GENERATION COMPLETE',
  ERROR: 'ERROR',
};

const TERMINAL_LOG_LINES = [
  '> scanning_jd.exe',
  '> analyzing_keywords...',
  '> match_found: 94.2%',
  '> keywords: ["responsive", "brutalist", "uiux"]',
];

const COPIED_RESET_DELAY_MS = 2000;
const TERMINAL_LINE_DELAY_MS = 600;
// Gemini model used for generation (native Google SDK, not the OpenAI-compat shim)
const GEMINI_MODEL = 'gemini-2.5-flash';

// ============================================================================
// STYLES
// (kept pixel-for-pixel identical to the original inline styles; only moved
// out of JSX so the component body is easier to scan)
// ============================================================================
const terminalDot = (color: string): React.CSSProperties => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: color,
});

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    padding: '0 24px',
    color: '#1c1b1b',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  headerWrap: {
    marginTop: '24px',
    marginBottom: '32px',
    backgroundColor: '#bae6fd',
    border: '4px solid #1c1b1b',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '8px 8px 0px 0px #1c1b1b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    color: '#1c1b1b',
  },
  statusLine: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '14px',
    fontWeight: 800,
    color: '#1c1b1b',
    backgroundColor: '#fef08a',
    padding: '8px 16px',
    border: '3px solid #1c1b1b',
    borderRadius: '999px',
    boxShadow: '4px 4px 0px 0px #1c1b1b',
    letterSpacing: '0.05em',
  },

  grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' },

  editorPanel: {
    backgroundColor: '#c4b5fd',
    border: '4px solid #1c1b1b',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '6px 6px 0px 0px #1c1b1b',
    display: 'flex',
    flexDirection: 'column',
  },
  editorHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  editorHeaderLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 },

  toneSwitch: {
    position: 'relative',
    display: 'flex',
    gap: '8px',
    backgroundColor: '#fff',
    border: '3px solid #1c1b1b',
    borderRadius: '999px',
    padding: '4px',
    boxShadow: '2px 2px 0px 0px #1c1b1b',
  },
  toneSwitchPillBase: {
    position: 'absolute',
    top: '4px',
    bottom: '4px',
    width: '80px',
    backgroundColor: '#fca5a5',
    border: '2px solid #1c1b1b',
    borderRadius: '999px',
    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1,
    boxSizing: 'border-box',
  },
  toneOption: {
    position: 'relative',
    zIndex: 2,
    width: '80px',
    textAlign: 'center',
    padding: '4px 0',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 800,
    cursor: 'pointer',
    color: '#1c1b1b',
    transition: 'color 0.3s ease',
  },

  draftTextarea: {
    flex: 1,
    width: '100%',
    minHeight: '400px',
    backgroundColor: '#fff',
    border: '4px solid #1c1b1b',
    borderRadius: '12px',
    padding: '24px',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '14px',
    lineHeight: 1.6,
    resize: 'vertical',
    outline: 'none',
    boxShadow: 'inset 2px 2px 0px 0px rgba(0,0,0,0.1)',
    boxSizing: 'border-box',
  },

  actionsRow: { display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' },
  generateButton: {
    backgroundColor: '#34d399',
    color: '#1c1b1b',
    border: '4px solid #1c1b1b',
    borderRadius: '9999px',
    padding: '12px 32px',
    fontWeight: 800,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '4px 4px 0px 0px #1c1b1b',
  },
  copyButtonBase: {
    backgroundColor: '#fff',
    border: '4px solid #1c1b1b',
    borderRadius: '9999px',
    padding: '12px 32px',
    fontWeight: 800,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '4px 4px 0px 0px #1c1b1b',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },

  sidebar: { display: 'flex', flexDirection: 'column', gap: '24px' },

  targetRoleCard: {
    backgroundColor: '#fbbf24',
    border: '4px solid #1c1b1b',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '6px 6px 0px 0px #1c1b1b',
  },
  targetRoleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 700,
    marginBottom: '24px',
  },
  fieldWrap: { marginBottom: '16px' },
  fieldWrapLast: { marginBottom: '24px' },
  fieldLabel: {
    display: 'block',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '0.05em',
    color: '#1c1b1b',
    marginBottom: '8px',
  },
  fieldInput: {
    width: '100%',
    padding: '12px',
    border: '3px solid #1c1b1b',
    borderRadius: '8px',
    backgroundColor: '#fef3c7',
    fontWeight: 600,
    outline: 'none',
    boxSizing: 'border-box',
  },
  fieldTextarea: {
    width: '100%',
    padding: '12px',
    border: '3px solid #1c1b1b',
    borderRadius: '8px',
    backgroundColor: '#fef3c7',
    fontWeight: 600,
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
  },

  terminal: {
    backgroundColor: '#111827',
    border: '3px solid #1c1b1b',
    borderRadius: '12px',
    padding: '16px',
    color: '#34d399',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '12px',
  },
  terminalDotsRow: { display: 'flex', gap: '6px', marginBottom: '12px' },
  terminalLine: { margin: 0 },

  proTipCard: {
    backgroundColor: '#6ee7b7',
    border: '4px solid #1c1b1b',
    borderRadius: '16px',
    padding: '16px 24px',
    boxShadow: '4px 4px 0px 0px #1c1b1b',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  proTipIconWrap: {
    backgroundColor: '#fff',
    border: '3px solid #1c1b1b',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  proTipLabel: { fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em' },
  proTipText: { fontSize: '13px', fontWeight: 600, marginTop: '2px' },
};

// ============================================================================
// COMPONENT
// ============================================================================
const CoverLetterGenius: React.FC<CoverLetterGeniusProps> = ({ userProfile }) => {
  const [tone, setTone] = useState<Tone>('Friendly');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [requirements, setRequirements] = useState('');

  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState(STATUS.READY);
  const [copied, setCopied] = useState(false);
  const [visibleLogLines, setVisibleLogLines] = useState(0);

  // ---- effects -------------------------------------------------------------
  // Reveals the terminal log lines one by one while a generation is running.
  useEffect(() => {
    if (!isGenerating) {
      setVisibleLogLines(0);
      return;
    }

    setVisibleLogLines(0);
    let lineIndex = 0;
    const intervalId = setInterval(() => {
      lineIndex += 1;
      setVisibleLogLines(lineIndex);
      if (lineIndex >= TERMINAL_LOG_LINES.length) {
        clearInterval(intervalId);
      }
    }, TERMINAL_LINE_DELAY_MS);

    return () => clearInterval(intervalId);
  }, [isGenerating]);

  // ---- helpers -----------------------------------------------------------
  const buildPrompt = () =>
    `Write a cover letter for the position of ${position || DEFAULTS.position} at ${company || DEFAULTS.company}. 
The core requirements are:
${requirements || DEFAULTS.requirements}

The tone should be ${tone}.
Keep it concise, professional, and highlight how my skills align perfectly with their goals. Sign it with my name: ${userProfile?.name || '[Your Name]'}. Use placeholders like [Target Position] if you don't know the specifics.`;

  // ---- actions -------------------------------------------------------------
  const generateCoverLetter = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      alert('Please add VITE_GEMINI_API_KEY to your frontend .env file!');
      return;
    }

    setIsGenerating(true);
    setStatusText(STATUS.GENERATING);
    setDraft('Drafting...');

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

      // Run the API call and the animation timer concurrently
      const minAnimTime = TERMINAL_LOG_LINES.length * TERMINAL_LINE_DELAY_MS;
      const [result] = await Promise.all([
        model.generateContent(buildPrompt()),
        new Promise((resolve) => setTimeout(resolve, minAnimTime))
      ]);

      const text = result.response.text();

      setDraft(text || 'Failed to generate.');
      setStatusText(STATUS.COMPLETE);
    } catch (err) {
      console.error(err);
      setDraft('Error generating cover letter. Check console and API key.');
      setStatusText(STATUS.ERROR);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_RESET_DELAY_MS);
    } catch (err) {
      console.error('Copy failed:', err);
      alert('Could not copy — please copy manually.');
    }
  };

  // ---- render --------------------------------------------------------------
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.headerWrap}>
        <h1 style={styles.title}>Cover Letter Genius</h1>
        <div style={styles.statusLine}>[ STATUS: {statusText} ]</div>
      </div>

      <div style={styles.grid}>
        {/* ---------------- Left Side: Editor ---------------- */}
        <div style={styles.editorPanel}>
          <div style={styles.editorHeaderRow}>
            <div style={styles.editorHeaderLabel}>
              <span className="material-symbols-outlined">edit_note</span> Drafting...
            </div>

            <div style={styles.toneSwitch}>
              {/* Sliding Pink Bubble */}
              <div
                style={{
                  ...styles.toneSwitchPillBase,
                  left: TONE_PILL_POSITIONS[tone],
                }}
              />
              {TONE_OPTIONS.map((t) => (
                <div key={t} onClick={() => setTone(t)} style={styles.toneOption}>
                  {t}
                </div>
              ))}
            </div>
          </div>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            style={styles.draftTextarea}
            placeholder="Your generated cover letter will appear here..."
          />

          <div style={styles.actionsRow}>
            <button
              onClick={generateCoverLetter}
              disabled={isGenerating}
              style={{
                ...styles.generateButton,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
              }}
            >
              <span className="material-symbols-outlined">refresh</span>
              {isGenerating ? 'GENERATING...' : 'GENERATE'}
            </button>

            <button
              onClick={copyToClipboard}
              style={{
                ...styles.copyButtonBase,
                color: copied ? '#10b981' : '#1c1b1b', // Green when copied
              }}
            >
              <span className="material-symbols-outlined">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'COPIED!' : 'COPY TO CLIPBOARD'}
            </button>
          </div>
        </div>

        {/* ---------------- Right Side: Target Role Sidebar ---------------- */}
        <div style={styles.sidebar}>
          <div style={styles.targetRoleCard}>
            <div style={styles.targetRoleHeader}>
              <span className="material-symbols-outlined">work</span> Target Role
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.fieldLabel}>COMPANY</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={DEFAULTS.company}
                style={styles.fieldInput}
              />
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.fieldLabel}>POSITION</label>
              <input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder={DEFAULTS.position}
                style={styles.fieldInput}
              />
            </div>

            <div style={styles.fieldWrapLast}>
              <label style={styles.fieldLabel}>CORE REQUIREMENTS</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder={DEFAULTS.requirements}
                rows={4}
                style={styles.fieldTextarea}
              />
            </div>

            {(!(!isGenerating && statusText === STATUS.READY)) && (
              <div style={styles.terminal}>
                <div style={styles.terminalDotsRow}>
                  <div style={terminalDot('#ef4444')}></div>
                  <div style={terminalDot('#f59e0b')}></div>
                  <div style={terminalDot('#10b981')}></div>
                </div>
                {(isGenerating
                  ? TERMINAL_LOG_LINES.slice(0, visibleLogLines)
                  : statusText === STATUS.READY
                    ? []
                    : TERMINAL_LOG_LINES
                ).map((line) => (
                  <p key={line} style={styles.terminalLine}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div style={styles.proTipCard}>
            <div style={styles.proTipIconWrap}>
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <div>
              <div style={styles.proTipLabel}>PRO TIP</div>
              <div style={styles.proTipText}>
                Highlight your specific metrics to boost ATS scores by 30%.
              </div>
            </div>
          </div>
        </div>
      </div>
      <MushroomButton />
    </div>
  );
};
export default CoverLetterGenius;
