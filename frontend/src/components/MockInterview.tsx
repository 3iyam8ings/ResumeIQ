import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';

interface MockInterviewProps {
  userProfile?: any;
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const MockInterview: React.FC<MockInterviewProps> = ({ userProfile }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<'Easy' | 'Medium' | 'Hard'>('Hard');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Show feedback if user messages exceed 10 (which means total messages > 20)
    const userMessageCount = messages.filter(m => m.role === 'user').length;
    if (userMessageCount >= 10 && !feedback) {
      setFeedback("Good job sustaining this long interview! To make your answers stronger, ensure you are utilizing the STAR method (Situation, Task, Action, Result) for all behavioral questions and keeping your metrics specific.");
    }
  }, [messages, feedback]);

  const startInterview = async () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      alert("Please add VITE_OPENAI_API_KEY to your frontend .env file!");
      return;
    }

    setMessages([]);
    setFeedback(null);
    setIsTyping(true);

    const systemPrompt = `You are a Senior Technical Recruiter conducting a Mock Interview for a Senior Product Designer role. 
The difficulty mode is ${mode}. 
If Easy: Ask basic, supportive questions. 
If Medium: Ask standard behavioral and technical questions. 
If Hard: Ask tough, probing questions and challenge their assumptions.
Start by introducing yourself briefly and asking the very first interview question.`;

    try {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: 'system', content: systemPrompt }],
        temperature: 0.7,
      });

      const firstQuestion = response.choices[0].message.content || "Hello! Let's begin the interview. Can you tell me about yourself?";
      setMessages([
        { role: 'system', content: systemPrompt },
        { role: 'assistant', content: firstQuestion }
      ]);
    } catch (err) {
      console.error(err);
      setMessages([{ role: 'assistant', content: "Error connecting to AI. Please check your API key." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: newMessages,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0].message.content || "Could you elaborate on that?";
      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: "Error connecting to AI." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#1c1b1b', position: 'relative', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Side Tab for Mode Selector */}
      <div style={{ position: 'absolute', left: 0, top: '20%', display: 'flex', alignItems: 'center' }}>
        <div 
          onClick={() => setShowModeDropdown(!showModeDropdown)}
          style={{
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
            zIndex: 10
          }}
        >
          MOCK MODE: {mode.toUpperCase()}
        </div>

        {showModeDropdown && (
          <div style={{
            marginLeft: '16px',
            backgroundColor: '#fff',
            border: '4px solid #1c1b1b',
            borderRadius: '12px',
            boxShadow: '6px 6px 0px 0px #1c1b1b',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 20
          }}>
            {(['Easy', 'Medium', 'Hard'] as const).map(m => (
              <div 
                key={m}
                onClick={() => { setMode(m); setShowModeDropdown(false); }}
                style={{
                  padding: '12px 24px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  backgroundColor: mode === m ? '#fbbf24' : '#fff',
                  borderBottom: m !== 'Hard' ? '2px solid #1c1b1b' : 'none'
                }}
              >
                {m}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: '#fff', border: '4px solid #1c1b1b', borderRadius: '16px', padding: '24px', boxShadow: '6px 6px 0px 0px #1c1b1b', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 800 }}>Senior Product Designer Interview</h1>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em' }}>
              [ ROLE: TECH ]  [ LEVEL: SENIOR ]
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ backgroundColor: '#e5e7eb', border: '2px solid #1c1b1b', borderRadius: '999px', padding: '4px 12px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em' }}>SESSION: 14:02</span>
            <span style={{ backgroundColor: '#a7f3d0', border: '2px solid #1c1b1b', borderRadius: '999px', padding: '4px 12px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em' }}>AI: ACTIVE</span>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
          
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button 
                onClick={startInterview}
                style={{
                  backgroundColor: '#c4b5fd',
                  color: '#1c1b1b',
                  border: '4px solid #1c1b1b',
                  borderRadius: '9999px',
                  padding: '16px 32px',
                  fontWeight: 800,
                  fontSize: '16px',
                  boxShadow: '4px 4px 0px 0px #1c1b1b',
                  cursor: 'pointer'
                }}
              >
                START INTERVIEW
              </button>
            </div>
          ) : (
            messages.filter(m => m.role !== 'system').map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  backgroundColor: msg.role === 'user' ? '#fff' : '#60a5fa',
                  border: '4px solid #1c1b1b',
                  borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  padding: '16px 24px',
                  maxWidth: '80%',
                  boxShadow: '4px 4px 0px 0px #1c1b1b',
                  fontSize: '15px',
                  lineHeight: 1.5,
                  fontWeight: 500
                }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', marginTop: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {msg.role === 'user' ? 'YOU' : 'INTERVIEWER AI'} • JUST NOW
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{
                backgroundColor: '#60a5fa',
                border: '4px solid #1c1b1b',
                borderRadius: '16px 16px 16px 0',
                padding: '16px 24px',
                boxShadow: '4px 4px 0px 0px #1c1b1b',
                fontSize: '15px',
                fontWeight: 800
              }}>
                ...
              </div>
            </div>
          )}

          {/* Feedback Module (Optional > 10 messages) */}
          {feedback && (
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ backgroundColor: '#fca5a5', border: '4px solid #1c1b1b', borderRadius: '16px', padding: '24px', boxShadow: '6px 6px 0px 0px #1c1b1b', maxWidth: '80%', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-12px', left: '24px', backgroundColor: '#1c1b1b', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em' }}>
                  AI REAL-TIME FEEDBACK
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', marginTop: '8px' }}>
                  <span style={{ backgroundColor: '#a7f3d0', border: '2px solid #1c1b1b', borderRadius: '999px', padding: '4px 12px', fontSize: '12px', fontWeight: 700 }}>[Specific ✓]</span>
                  <span style={{ backgroundColor: '#fde68a', border: '2px solid #1c1b1b', borderRadius: '999px', padding: '4px 12px', fontSize: '12px', fontWeight: 700 }}>[Add Metrics !]</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.5 }}>
                  {feedback}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#c4b5fd', border: '4px solid #1c1b1b', borderRadius: '999px', padding: '8px 16px', boxShadow: '6px 6px 0px 0px #1c1b1b', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #1c1b1b', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mic</span>
          </div>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder="Type your answer here..."
            style={{ flex: 1, backgroundColor: '#fff', border: '3px solid #1c1b1b', borderRadius: '999px', padding: '12px 24px', fontSize: '15px', fontWeight: 600, outline: 'none' }}
          />
          <button 
            type="submit"
            disabled={isTyping || !input.trim()}
            style={{ backgroundColor: '#fbbf24', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #1c1b1b', cursor: 'pointer', flexShrink: 0 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>send</span>
          </button>
        </form>

      </div>
    </div>
  );
};

export default MockInterview;
