import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as VapiPackage from '@vapi-ai/web';
import { GoogleGenerativeAI } from '@google/generative-ai';
import MushroomButton from './MushroomButton';

// `@vapi-ai/web`'s build output has shipped the Vapi class in different shapes across
// versions/bundlers: sometimes as the default export, sometimes as a named export, and
// sometimes ESM/CJS interop hands you the raw module instead of the class itself. A plain
// `import Vapi from '@vapi-ai/web'` can therefore silently bind `Vapi` to something that
// isn't callable with `new`, producing "Vapi is not a constructor" at runtime with no
// build-time warning. Resolving it defensively here fixes that regardless of which shape
// the installed version actually exports.
type VapiInstance = {
  on: (event: string, cb: (...args: any[]) => void) => void;
  removeAllListeners: () => void;
  start: (assistant: Record<string, unknown>) => Promise<unknown>;
  stop: () => void;
};
type VapiCtor = new (apiKey: string) => VapiInstance;
const Vapi = (((VapiPackage as any).default?.default)
  ?? (VapiPackage as any).default
  ?? (VapiPackage as any).Vapi
  ?? (VapiPackage as unknown as VapiCtor)) as VapiCtor;

// ============================================================================
// TYPES
// ============================================================================
type Mode = 'Easy' | 'Medium' | 'Hard';
type InteractionMode = 'text' | 'voice';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const MODE_OPTIONS: Mode[] = ['Easy', 'Medium', 'Hard'];

const FEEDBACK_TRIGGER_USER_MESSAGE_COUNT = 10;
const FEEDBACK_TEXT =
  'Good job sustaining this long interview! To make your answers stronger, ensure you are utilizing the STAR method (Situation, Task, Action, Result) for all behavioral questions and keeping your metrics specific.';

const MISSING_VAPI_KEY = 'Please add VITE_VAPI_PUBLIC_KEY to your frontend .env file!';
const MISSING_GEMINI_KEY = 'Please add VITE_GEMINI_API_KEY to your frontend .env file!';
const ERROR_START_MESSAGE = 'Error connecting to AI. Please check your API key.';
const ERROR_SEND_MESSAGE = 'Error connecting to AI.';
const ERROR_VOICE_START_MESSAGE =
  'Could not start the voice interview. Check the browser console / network tab for the exact error from Vapi.';
const FALLBACK_FIRST_QUESTION = "Hello! Let's begin the interview. Can you tell me about yourself?";
const FALLBACK_FOLLOW_UP = 'Could you elaborate on that?';

// NOTE: These two constants are intentionally separate. `GEMINI_MODEL_TEXT` is passed
// straight to Google's own SDK (which accepts the latest Gemini model slugs). Vapi's
// "google" model provider only accepts a whitelist of model names it explicitly supports,
// which historically lags behind Google's own releases (e.g. gemini-1.5-pro,
// gemini-1.5-flash-002, gemini-1.0-pro). Passing an unsupported slug like
// "gemini-2.5-flash" to Vapi causes assistant creation to fail silently (a rejected
// promise with no UI feedback), which is why the voice interview previously did nothing
// when clicked. Re-check Vapi's dashboard/docs for their current supported list before
// changing this value.
const GEMINI_MODEL_TEXT = 'gemini-2.5-flash';
const GEMINI_MODEL_VAPI = 'gemini-1.5-pro';

const MAX_CONTEXT_MESSAGES = 16;
const KICKOFF_PROMPT = 'Please introduce yourself briefly and ask the very first interview question.';

// Explicit transcriber config for Vapi, rather than relying on an account-level default
// (which may not be configured, causing another silent assistant-creation failure).
const VAPI_TRANSCRIBER = {
  provider: 'deepgram',
  model: 'nova-2',
  language: 'en',
} as const;

const buildSystemPrompt = (mode: Mode, role: string, candidate: string, company: string) =>
  `You are a Senior Technical Recruiter named Alex conducting a Mock Interview for a ${role} role at ${company}. 
The candidate's name is ${candidate}.
The difficulty mode is ${mode}. 
If Easy: Ask basic, supportive questions. 
If Medium: Ask standard behavioral and technical questions. 
If Hard: Ask tough, probing questions and challenge their assumptions.
CRITICAL INSTRUCTION: NEVER use placeholders like [Candidate Name], [Company Name], or [My Name]. Always use the real names provided.
Start by introducing yourself briefly as Alex from ${company} and asking the very first interview question to ${candidate}.`;

const formatSessionTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

// ============================================================================
// CUSTOM COMPONENTS
// ============================================================================
const NeoSelect = ({ value, options, onChange, color, prefix }: { value: string, options: string[], onChange: (val: string) => void, color: string, prefix: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', flex: '1 1 calc(50% - 16px)', boxSizing: 'border-box' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: color,
          border: '4px solid #1c1b1b',
          borderRadius: '8px',
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: 800,
          boxShadow: '4px 4px 0px 0px #1c1b1b',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        <span style={{ color: '#1c1b1b' }}>{prefix}: {value}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1b1b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '12px',
          backgroundColor: '#fff',
          border: '4px solid #1c1b1b',
          borderRadius: '8px',
          boxShadow: '4px 4px 0px 0px #1c1b1b',
          zIndex: 50,
          overflow: 'hidden'
        }}>
          {options.map((opt, i) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              style={{
                padding: '12px 24px',
                fontWeight: 800,
                cursor: 'pointer',
                borderBottom: i === options.length - 1 ? 'none' : '4px solid #1c1b1b',
                backgroundColor: value === opt ? color : '#fff',
                color: '#1c1b1b'
              }}
              onMouseEnter={(e) => {
                if (value !== opt) e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                if (value !== opt) e.currentTarget.style.backgroundColor = '#fff';
              }}
            >
              {prefix}: {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// A single reusable "neo-brutalist" pill button that owns its own hover state.
// Replaces the previously duplicated isStartHovered / manual boxShadow-transform
// logic that was copy-pasted across the start / restart / stop-voice buttons.
interface NeoButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  bg: string;
  type?: 'button' | 'submit';
}

const NeoButton: React.FC<NeoButtonProps> = ({ children, onClick, disabled = false, bg, type = 'button' }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: bg,
        color: '#1c1b1b',
        border: '4px solid #1c1b1b',
        borderRadius: '9999px',
        padding: '16px 32px',
        fontWeight: 800,
        fontSize: '16px',
        transition: 'all 0.2s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        boxShadow: hovered && !disabled ? '0px 0px 0px 0px #1c1b1b' : '4px 4px 0px 0px #1c1b1b',
        transform: hovered && !disabled ? 'translate(4px, 4px)' : 'translate(0px, 0px)',
      }}
    >
      {children}
    </button>
  );
};

// ============================================================================
// STYLES
// ============================================================================
const modeDropdownItemStyle = (isActive: boolean, isLast: boolean): React.CSSProperties => ({
  padding: '12px 24px',
  fontWeight: 800,
  cursor: 'pointer',
  backgroundColor: isActive ? '#fbbf24' : '#fff',
  borderBottom: isLast ? 'none' : '2px solid #1c1b1b',
});

const messageColumnStyle = (isUser: boolean): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: isUser ? 'flex-end' : 'flex-start',
});

const messageBubbleStyle = (isUser: boolean): React.CSSProperties => ({
  backgroundColor: isUser ? '#fff' : '#60a5fa',
  border: '4px solid #1c1b1b',
  borderRadius: isUser ? '16px 16px 0 16px' : '16px 16px 16px 0',
  padding: '16px 24px',
  maxWidth: '80%',
  boxShadow: '4px 4px 0px 0px #1c1b1b',
  fontSize: '15px',
  lineHeight: 1.5,
  fontWeight: 500,
});

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    color: '#1c1b1b',
    position: 'relative',
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '40px',
  },
  modeTabWrap: { position: 'absolute', left: 0, top: '5%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  modeTabButton: {
    backgroundColor: '#fbbf24',
    border: '4px solid #1c1b1b',
    borderLeft: 'none',
    borderRadius: '0 8px 8px 0',
    padding: '16px 8px',
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    fontWeight: 800,
    fontSize: '14px',
    letterSpacing: '0.1em',
    boxShadow: '4px 4px 0px 0px #1c1b1b',
    cursor: 'pointer',
    zIndex: 10,
  },
  modeDropdown: {
    marginLeft: '16px',
    backgroundColor: '#fff',
    border: '4px solid #1c1b1b',
    borderRadius: '12px',
    boxShadow: '6px 6px 0px 0px #1c1b1b',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 20,
  },
  contentWrap: {
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
    padding: '0 24px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  headerCard: {
    backgroundColor: '#fff',
    border: '4px solid #1c1b1b',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '6px 6px 0px 0px #1c1b1b',
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: { margin: '0 0 8px 0', fontSize: '24px', fontWeight: 800 },
  headerMeta: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '12px',
    fontWeight: 700,
    color: '#6b7280',
    letterSpacing: '0.05em',
  },
  headerBadgeRow: { display: 'flex', gap: '12px' },
  sessionBadge: {
    backgroundColor: '#e5e7eb',
    border: '2px solid #1c1b1b',
    borderRadius: '999px',
    padding: '4px 12px',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '0.05em',
  },
  aiActiveBadge: {
    backgroundColor: '#a7f3d0',
    border: '2px solid #1c1b1b',
    borderRadius: '999px',
    padding: '4px 12px',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '0.05em',
  },
  aiInactiveBadge: {
    backgroundColor: '#fca5a5',
    border: '2px solid #1c1b1b',
    borderRadius: '999px',
    padding: '4px 12px',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '0.05em',
  },
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' },
  startWrap: { textAlign: 'center', marginTop: '40px' },
  messageMeta: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#9ca3af',
    marginTop: '8px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  typingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  typingBubble: {
    backgroundColor: '#60a5fa',
    border: '4px solid #1c1b1b',
    borderRadius: '16px 16px 16px 0',
    padding: '16px 24px',
    boxShadow: '4px 4px 0px 0px #1c1b1b',
    fontSize: '15px',
    fontWeight: 800,
  },
  feedbackOuter: { marginTop: '16px', display: 'flex', justifyContent: 'center' },
  feedbackCard: {
    backgroundColor: '#fca5a5',
    border: '4px solid #1c1b1b',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '6px 6px 0px 0px #1c1b1b',
    maxWidth: '80%',
    position: 'relative',
  },
  feedbackTag: {
    position: 'absolute',
    top: '-12px',
    left: '24px',
    backgroundColor: '#1c1b1b',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '0.05em',
  },
  feedbackChipsRow: { display: 'flex', gap: '8px', marginBottom: '16px', marginTop: '8px' },
  feedbackChipGood: {
    backgroundColor: '#a7f3d0',
    border: '2px solid #1c1b1b',
    borderRadius: '999px',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: 700,
  },
  feedbackChipWarn: {
    backgroundColor: '#fde68a',
    border: '2px solid #1c1b1b',
    borderRadius: '999px',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: 700,
  },
  feedbackText: { fontSize: '15px', fontWeight: 600, lineHeight: 1.5 },
  inputForm: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    backgroundColor: '#c4b5fd',
    border: '4px solid #1c1b1b',
    borderRadius: '999px',
    padding: '8px 16px',
    boxShadow: '6px 6px 0px 0px #1c1b1b',
    marginBottom: '40px',
  },
  micButton: {
    backgroundColor: '#fff',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid #1c1b1b',
    flexShrink: 0,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    border: '3px solid #1c1b1b',
    borderRadius: '999px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 600,
    outline: 'none',
  },
  sendButton: {
    backgroundColor: '#fbbf24',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid #1c1b1b',
    cursor: 'pointer',
    flexShrink: 0,
  },
};

// ============================================================================
// COMPONENT
// ============================================================================
const MockInterview: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [roleCategory, setRoleCategory] = useState('Tech');
  const [jobLevel, setJobLevel] = useState('Senior');
  const [candidateName, setCandidateName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<Mode>('Hard');
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('text');
  const [showValidationError, setShowValidationError] = useState(false);

  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [isModeHovered, setIsModeHovered] = useState(false);
  const [isMockModeHovered, setIsMockModeHovered] = useState(false);

  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isInterviewActive, setIsInterviewActive] = useState(false);

  // True only while we're waiting on vapi.start() to resolve/reject, so the button
  // can show feedback and can't be double-clicked while a call is being created.
  const [isConnecting, setIsConnecting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modeTabRef = useRef<HTMLDivElement>(null);
  const vapiRef = useRef<VapiInstance | null>(null);

  // Holds the system prompt for the active session so handleSendText doesn't need
  // to reconstruct it (with misleading fallback strings) on every message.
  const systemPromptRef = useRef<string>('');

  // ---- helpers -----------------------------------------------------------
  const resetInterview = useCallback(() => {
    setMessages([]);
    setFeedback(null);
    setSessionSeconds(0);
    setInput('');
    setIsInterviewActive(false);
  }, []);

  const getVapi = useCallback(() => {
    if (!vapiRef.current) {
      const apiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
      if (apiKey) {
        const vapiInstance = new Vapi(apiKey);

        vapiInstance.on('call-start', () => {
          resetInterview();
          setIsInterviewActive(true);
        });

        vapiInstance.on('call-end', () => {
          setIsInterviewActive(false);
          setIsTyping(false);
        });

        vapiInstance.on('speech-start', () => setIsTyping(true));
        vapiInstance.on('speech-end', () => setIsTyping(false));

        vapiInstance.on('message', (message) => {
          if (message.type === 'transcript' && message.transcriptType === 'final') {
            setMessages((prev) => [
              ...prev,
              { role: message.role === 'user' ? 'user' : 'assistant', content: message.transcript }
            ]);
          }
        });

        vapiInstance.on('error', (e) => {
          // This fires for errors *during* an active call. Errors from a failed
          // vapi.start() request (bad config, invalid model, auth issues) are caught
          // separately in startInterview, since that's a rejected promise, not this event.
          console.error('Vapi error:', e);
          setIsInterviewActive(false);
          setIsConnecting(false);
          setIsTyping(false);
        });

        vapiRef.current = vapiInstance;
      }
    }
    return vapiRef.current;
  }, [resetInterview]);

  const toGeminiContents = (msgs: Message[]) =>
    msgs
      .filter((m) => m.role !== 'system')
      .slice(-MAX_CONTEXT_MESSAGES)
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

  // ---- effects -------------------------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    const userMessageCount = messages.filter((m) => m.role === 'user').length;
    if (userMessageCount >= FEEDBACK_TRIGGER_USER_MESSAGE_COUNT && !feedback) {
      setFeedback(FEEDBACK_TEXT);
    }
  }, [messages, feedback]);

  useEffect(() => {
    if (!isInterviewActive) return;

    const intervalId = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isInterviewActive]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modeTabRef.current && !modeTabRef.current.contains(event.target as Node)) {
        setShowModeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Cleanup Vapi on unmount
    return () => {
      if (vapiRef.current) {
        vapiRef.current.removeAllListeners();
        vapiRef.current.stop();
      }
    };
  }, []);

  // ---- actions -------------------------------------------------------------
  const startInterview = async () => {
    if (!jobRole.trim() || !candidateName.trim() || !companyName.trim()) {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);

    const systemPrompt = buildSystemPrompt(mode, jobRole, candidateName, companyName);
    systemPromptRef.current = systemPrompt;

    if (interactionMode === 'voice') {
      const vapi = getVapi();
      if (!vapi) {
        alert(MISSING_VAPI_KEY);
        return;
      }

      setIsConnecting(true);
      try {
        // vapi.start() makes a real API call to create the assistant/call. It can
        // reject (invalid public key, unsupported model name, bad voice id, etc).
        // Previously this wasn't awaited or caught, so failures were completely
        // silent — the button just appeared to do nothing.
        await vapi.start({
          name: 'Mock Interviewer',
          firstMessage: FALLBACK_FIRST_QUESTION,
          transcriber: VAPI_TRANSCRIBER,
          model: {
            provider: 'google',
            model: GEMINI_MODEL_VAPI,
            messages: [
              { role: 'system', content: systemPrompt }
            ]
          },
          voice: {
            provider: '11labs',
            voiceId: 'bIHbv24MWmeRgasZH58o' // Realistic professional voice
          }
        });
      } catch (err) {
        console.error('Vapi start failed:', err);
        alert(ERROR_VOICE_START_MESSAGE);
      } finally {
        setIsConnecting(false);
      }
    } else {
      // Start Text Interview
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        alert(MISSING_GEMINI_KEY);
        return;
      }

      resetInterview();
      setIsTyping(true);
      setIsInterviewActive(true);

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_TEXT, systemInstruction: systemPrompt });

        const result = await model.generateContent(KICKOFF_PROMPT);
        const firstQuestion = result.response.text() || FALLBACK_FIRST_QUESTION;

        setMessages([
          { role: 'system', content: systemPrompt },
          { role: 'assistant', content: firstQuestion },
        ]);
      } catch (err) {
        console.error(err);
        setMessages([{ role: 'assistant', content: ERROR_START_MESSAGE }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      alert(MISSING_GEMINI_KEY);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    const cleanMsg = userMessage.replace(/[.,!?;:]/g, ' ').trim();
    const endRegex = /(end|stop|quit|finish|exit)\s*(the\s*)?(session|interview|chat)/i;
    
    if (endRegex.test(cleanMsg)) {
      setIsInterviewActive(false);
      return;
    }

    setIsTyping(true);

    // Reuse the system prompt captured when the session started, instead of
    // rebuilding it with silently-wrong fallback values.
    const systemPrompt = systemPromptRef.current || buildSystemPrompt(mode, jobRole, candidateName, companyName);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_TEXT, systemInstruction: systemPrompt });

      const result = await model.generateContent({ contents: toGeminiContents(newMessages) });
      const aiResponse = result.response.text() || FALLBACK_FOLLOW_UP;

      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: ERROR_SEND_MESSAGE }]);
    } finally {
      setIsTyping(false);
    }
  };

  const stopInterview = useCallback(() => {
    if (interactionMode === 'voice' && vapiRef.current) {
      vapiRef.current.stop();
    } else {
      setIsInterviewActive(false);
    }
  }, [interactionMode]);

  const toggleInteractionMode = useCallback(() => {
    if (!isInterviewActive && !isTyping) {
      setInteractionMode(prev => prev === 'text' ? 'voice' : 'text');
    }
  }, [isInterviewActive, isTyping]);

  // ---- render --------------------------------------------------------------
  const missingRequiredFields = !jobRole.trim() || !candidateName.trim() || !companyName.trim();

  return (
    <div style={styles.page}>
      {/* Side Tabs */}
      <div style={styles.modeTabWrap} ref={modeTabRef}>
        {/* Difficulty Selector */}
        <div
          onClick={() => !isInterviewActive && setShowModeDropdown(!showModeDropdown)}
          onMouseEnter={() => setIsMockModeHovered(true)}
          onMouseLeave={() => setIsMockModeHovered(false)}
          style={{
            ...styles.modeTabButton,
            opacity: isInterviewActive ? 0.5 : 1,
            cursor: isInterviewActive ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            transform: isMockModeHovered && !isInterviewActive ? 'translate(-4px, -4px)' : 'translate(0px, 0px)',
            boxShadow: isMockModeHovered && !isInterviewActive ? '8px 8px 0px 0px #1c1b1b' : '4px 4px 0px 0px #1c1b1b',
          }}>
          MOCK MODE: {mode.toUpperCase()}
        </div>

        {/* Text/Voice Toggle */}
        <div
          onClick={toggleInteractionMode}
          onMouseEnter={() => setIsModeHovered(true)}
          onMouseLeave={() => setIsModeHovered(false)}
          style={{
            ...styles.modeTabButton,
            backgroundColor: isModeHovered && !isInterviewActive ? '#93c5fd' : '#bfdbfe',
            opacity: isInterviewActive ? 0.5 : 1,
            cursor: isInterviewActive ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            transform: isModeHovered && !isInterviewActive ? 'translate(-4px, -4px)' : 'translate(0px, 0px)',
            boxShadow: isModeHovered && !isInterviewActive ? '8px 8px 0px 0px #1c1b1b' : '4px 4px 0px 0px #1c1b1b',
          }}
        >
          {interactionMode === 'text' ? 'SWITCH TO VOICE' : 'SWITCH TO TEXT'}
        </div>

        {showModeDropdown && !isInterviewActive && (
          <div style={styles.modeDropdown}>
            {MODE_OPTIONS.map((m, idx) => (
              <div
                key={m}
                onClick={() => {
                  setMode(m);
                  setShowModeDropdown(false);
                }}
                style={modeDropdownItemStyle(mode === m, idx === MODE_OPTIONS.length - 1)}
              >
                {m}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.contentWrap}>
        {/* Header */}
        <div style={styles.headerCard}>
          <div>
            <h1 style={styles.headerTitle}>{jobRole ? `${jobRole} Interview` : 'Mock Interview Setup'}</h1>
            <div style={styles.headerMeta}>[ ROLE: {roleCategory.toUpperCase()} ]  [ LEVEL: {jobLevel.toUpperCase()} ]</div>
          </div>
          <div style={styles.headerBadgeRow}>
            <span style={styles.sessionBadge}>SESSION: {formatSessionTime(sessionSeconds)}</span>
            <span style={isInterviewActive ? styles.aiActiveBadge : styles.aiInactiveBadge}>
              AI: {isInterviewActive ? (interactionMode === 'voice' ? 'LISTENING / SPEAKING' : 'ACTIVE') : (isConnecting ? 'CONNECTING…' : 'OFFLINE')}
            </span>
          </div>
        </div>

        {/* Chat Area */}
        <div style={styles.chatArea}>
          {!isInterviewActive && messages.length === 0 ? (
            <div style={styles.startWrap}>
              <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                {showValidationError && missingRequiredFields && (
                  <div style={{
                    backgroundColor: '#fca5a5',
                    border: '3px solid #1c1b1b',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: 800,
                    boxShadow: '3px 3px 0px 0px #1c1b1b',
                    marginBottom: '8px',
                    textAlign: 'center',
                    maxWidth: '400px',
                    width: '100%'
                  }}>
                    ⚠️ Please fill out all the fields
                  </div>
                )}
                <label style={{ fontSize: '18px', fontWeight: 800 }}>ENTER DETAILS TO BEGIN:</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Your Name"
                  style={{
                    backgroundColor: '#fff',
                    border: '4px solid #1c1b1b',
                    borderRadius: '8px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: 800,
                    outline: 'none',
                    boxShadow: '4px 4px 0px 0px #1c1b1b',
                    width: '100%',
                    maxWidth: '800px',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{
                  display: 'flex',
                  gap: '16px',
                  width: '100%',
                  maxWidth: '800px',
                  flexWrap: 'wrap'
                }}>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Target Company"
                    style={{
                      backgroundColor: '#fff',
                      border: '4px solid #1c1b1b',
                      borderRadius: '8px',
                      padding: '16px 24px',
                      fontSize: '16px',
                      fontWeight: 800,
                      outline: 'none',
                      boxShadow: '4px 4px 0px 0px #1c1b1b',
                      width: '100%',
                      flex: '1 1 calc(50% - 16px)',
                      textAlign: 'center',
                      boxSizing: 'border-box'
                    }}
                  />
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="Target Job Role"
                    style={{
                      backgroundColor: '#fff',
                      border: '4px solid #1c1b1b',
                      borderRadius: '8px',
                      padding: '16px 24px',
                      fontSize: '16px',
                      fontWeight: 800,
                      outline: 'none',
                      boxShadow: '4px 4px 0px 0px #1c1b1b',
                      width: '100%',
                      flex: '1 1 calc(50% - 16px)',
                      textAlign: 'center',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '16px',
                  width: '100%',
                  maxWidth: '800px',
                  flexWrap: 'wrap'
                }}>
                  <NeoSelect
                    value={roleCategory}
                    options={['Tech', 'Non-Tech']}
                    onChange={setRoleCategory}
                    color="#fde047"
                    prefix="Category"
                  />
                  <NeoSelect
                    value={jobLevel}
                    options={['Fresher', 'Junior', 'Senior']}
                    onChange={setJobLevel}
                    color="#93c5fd"
                    prefix="Level"
                  />
                </div>
              </div>
              <NeoButton onClick={startInterview} disabled={isConnecting} bg="#c4b5fd">
                {isConnecting ? 'CONNECTING…' : `START ${interactionMode === 'voice' ? 'VOICE' : 'TEXT'} INTERVIEW`}
              </NeoButton>
            </div>
          ) : (
            <>
              {messages
                .filter((m) => m.role !== 'system')
                .map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={idx} style={messageColumnStyle(isUser)}>
                      <div style={messageBubbleStyle(isUser)}>{msg.content}</div>
                      <div style={styles.messageMeta}>
                        {isUser ? 'YOU' : 'INTERVIEWER AI'}
                      </div>
                    </div>
                  );
                })}

              {/* Restart Button when interview is inactive but messages exist */}
              {!isInterviewActive && messages.length > 0 && (
                <div style={styles.startWrap}>
                  <NeoButton onClick={startInterview} disabled={!jobRole.trim() || isConnecting} bg="#c4b5fd">
                    {isConnecting ? 'CONNECTING…' : `START NEW ${interactionMode === 'voice' ? 'VOICE' : 'TEXT'} INTERVIEW`}
                  </NeoButton>
                </div>
              )}
            </>
          )}

          {isTyping && (
            <div style={styles.typingWrap}>
              <div style={styles.typingBubble}>...</div>
            </div>
          )}

          {/* Feedback Module */}
          {feedback && !isInterviewActive && (
            <div style={styles.feedbackOuter}>
              <div style={styles.feedbackCard}>
                <div style={styles.feedbackTag}>AI POST-INTERVIEW FEEDBACK</div>
                <div style={styles.feedbackChipsRow}>
                  <span style={styles.feedbackChipGood}>[Specific ✓]</span>
                  <span style={styles.feedbackChipWarn}>[Add Metrics !]</span>
                </div>
                <div style={styles.feedbackText}>{feedback}</div>
              </div>
            </div>
          )}
        </div>

        {/* Interaction Area (Input form or End button) */}
        {isInterviewActive && (
          interactionMode === 'text' ? (
            <form onSubmit={handleSendText} style={styles.inputForm}>
              <button
                type="button"
                onClick={stopInterview}
                title="End Text Interview"
                style={{ ...styles.micButton, backgroundColor: '#fca5a5', cursor: 'pointer', outline: 'none' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#1c1b1b' }}>
                  close
                </span>
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                placeholder="Type your answer here..."
                style={styles.textInput}
              />
              <button type="submit" disabled={isTyping || !input.trim()} style={styles.sendButton}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                  send
                </span>
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
              <NeoButton onClick={stopInterview} bg="#fca5a5">
                END VOICE INTERVIEW
              </NeoButton>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>
      <MushroomButton />
    </div>
  );
};

export default MockInterview;
