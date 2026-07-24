import React, { useState } from 'react';
import OpenAI from 'openai';

interface CoverLetterGeniusProps {
  userProfile?: any;
}

const CoverLetterGenius: React.FC<CoverLetterGeniusProps> = ({ userProfile }) => {
  const [tone, setTone] = useState<'Formal' | 'Friendly' | 'Confident'>('Friendly');
  const [company, setCompany] = useState('TechNova Solutions Inc.');
  const [position, setPosition] = useState('Senior Creative Developer');
  const [requirements, setRequirements] = useState('Expert in React & Tailwind\nNeo-Brutalist Design affinity\n5+ years industrial experience');
  
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState('READY TO GENERATE');

  const generateCoverLetter = async () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      alert("Please add VITE_OPENAI_API_KEY to your frontend .env file!");
      return;
    }

    setIsGenerating(true);
    setStatusText('OPTIMIZING FOR SUCCESS...');
    setDraft('Drafting...');

    try {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      const prompt = `Write a cover letter for the position of ${position} at ${company}. 
The core requirements are:
${requirements}

The tone should be ${tone}.
Keep it concise, professional, and highlight how my skills align perfectly with their goals. Use placeholders like [Your Name] or [Target Position] if you don't know the specifics.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      setDraft(response.choices[0].message.content || 'Failed to generate.');
      setStatusText('GENERATION COMPLETE');
    } catch (err) {
      console.error(err);
      setDraft('Error generating cover letter. Check console and API key.');
      setStatusText('ERROR');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', padding: '0 24px', color: '#1c1b1b', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Cover Letter Genius</h1>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginTop: '4px', letterSpacing: '0.05em' }}>
          [ STATUS: {statusText} ]
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Side: Editor */}
        <div style={{ backgroundColor: '#c4b5fd', border: '4px solid #1c1b1b', borderRadius: '16px', padding: '24px', boxShadow: '6px 6px 0px 0px #1c1b1b', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              <span className="material-symbols-outlined">edit_note</span> Drafting...
            </div>
            <div style={{ display: 'flex', gap: '8px', backgroundColor: '#fff', border: '3px solid #1c1b1b', borderRadius: '999px', padding: '4px', boxShadow: '2px 2px 0px 0px #1c1b1b' }}>
              {(['Formal', 'Friendly', 'Confident'] as const).map((t) => (
                <div 
                  key={t}
                  onClick={() => setTone(t)}
                  style={{ 
                    padding: '4px 16px', 
                    borderRadius: '999px', 
                    fontSize: '12px', 
                    fontWeight: 800, 
                    cursor: 'pointer',
                    backgroundColor: tone === t ? '#fca5a5' : 'transparent',
                    border: tone === t ? '2px solid #1c1b1b' : '2px solid transparent',
                    color: '#1c1b1b'
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <textarea 
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            style={{ 
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
              boxShadow: 'inset 2px 2px 0px 0px rgba(0,0,0,0.1)'
            }}
            placeholder="Your generated cover letter will appear here..."
          />

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
            <button 
              onClick={generateCoverLetter}
              disabled={isGenerating}
              style={{
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
                cursor: isGenerating ? 'not-allowed' : 'pointer'
              }}
            >
              <span className="material-symbols-outlined">refresh</span> 
              {isGenerating ? 'GENERATING...' : 'GENERATE'}
            </button>
            <button 
              onClick={() => navigator.clipboard.writeText(draft)}
              style={{
                backgroundColor: '#fff',
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
                cursor: 'pointer'
              }}
            >
              <span className="material-symbols-outlined">content_copy</span> COPY TO CLIPBOARD
            </button>
          </div>
        </div>

        {/* Right Side: Target Role Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ backgroundColor: '#fbbf24', border: '4px solid #1c1b1b', borderRadius: '16px', padding: '24px', boxShadow: '6px 6px 0px 0px #1c1b1b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '24px' }}>
              <span className="material-symbols-outlined">work</span> Target Role
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em', color: '#1c1b1b', marginBottom: '8px' }}>COMPANY</label>
              <input 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '3px solid #1c1b1b', borderRadius: '8px', backgroundColor: '#fef3c7', fontWeight: 600, outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em', color: '#1c1b1b', marginBottom: '8px' }}>POSITION</label>
              <input 
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '3px solid #1c1b1b', borderRadius: '8px', backgroundColor: '#fef3c7', fontWeight: 600, outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em', color: '#1c1b1b', marginBottom: '8px' }}>CORE REQUIREMENTS</label>
              <textarea 
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '12px', border: '3px solid #1c1b1b', borderRadius: '8px', backgroundColor: '#fef3c7', fontWeight: 600, outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ backgroundColor: '#111827', border: '3px solid #1c1b1b', borderRadius: '12px', padding: '16px', color: '#34d399', fontFamily: '"JetBrains Mono", monospace', fontSize: '12px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              </div>
              <p style={{ margin: 0 }}>{'>'} scanning_jd.exe</p>
              <p style={{ margin: 0 }}>{'>'} analyzing_keywords...</p>
              <p style={{ margin: 0 }}>{'>'} match_found: 94.2%</p>
              <p style={{ margin: 0 }}>{'>'} keywords: ["responsive", "brutalist", "uiux"]</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#6ee7b7', border: '4px solid #1c1b1b', borderRadius: '16px', padding: '16px 24px', boxShadow: '4px 4px 0px 0px #1c1b1b', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: '#fff', border: '3px solid #1c1b1b', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em' }}>PRO TIP</div>
              <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>Highlight your specific metrics to boost ATS scores by 30%.</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CoverLetterGenius;
