import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  isAuthenticated?: boolean;
  userProfile?: any;
}

const Home: React.FC<HomeProps> = ({ isAuthenticated, userProfile }) => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '# ResumeIQ Processing v2.4.0',
    'System ready... awaiting file upload.',
    '> Initializing neural engine...',
    '> Connection established with Claude API',
    '> Loading ATS heuristics...',
    '> Awaiting input blob...'
  ]);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a resume first!");
      return;
    }
    setLoading(true);
    setLogs(prev => [...prev, '> [CRITICAL] File detected: ' + file.name, '> Extracting text metadata...', '> Mapping skills matrix...', '> Cross-referencing job requirements...', '> CALCULATING SCORE...']);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jobDescription);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error("Upload failed");
      await res.json();
      setLogs(prev => [...prev, '> Done. Generating report...']);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
         navigate('/dashboard');
      }, 1000);
      
    } catch (err: any) {
      setLogs(prev => [...prev, '> ERROR: ' + err.message]);
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fcf9f8', minHeight: '100vh', padding: '2rem 0' }}>
      <div style={{ padding: '0 2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* App Bar */}
      <div 
        style={{ 
          backgroundColor: '#b996f7', 
          border: '3px solid #000',
          borderRadius: '9999px',
          padding: '12px 24px',
          boxShadow: '6px 6px 0px #000',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontWeight: 800, fontSize: '20px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ResumeIQ
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', fontFamily: 'var(--mono)', fontSize: '14px', color: '#1c1b1b', opacity: 0.7, fontWeight: 600 }}>
          <span style={{ cursor: 'pointer' }}>ANALYZE</span>
          <span style={{ cursor: 'pointer' }}>HISTORY</span>
          <span style={{ cursor: 'pointer' }}>PRICING</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {!isAuthenticated ? (
            <>
              <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 600, color: '#1c1b1b' }}>LOGIN</span>
              <button 
                onClick={() => navigate('/signup')}
                style={{ 
                  backgroundColor: '#f5c445', 
                  border: '2px solid #000', 
                  borderRadius: '9999px', 
                  padding: '8px 24px', 
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  color: '#1c1b1b'
                }}>
                SIGN UP
              </button>
            </>
          ) : null}
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #000', overflow: 'hidden', backgroundColor: 'white' }}>
            <img src={userProfile?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="avatar" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div 
        style={{ 
          backgroundColor: '#f5c445', 
          border: '3px solid #000',
          borderRadius: '20px',
          padding: '48px 0 48px 48px',
          boxShadow: '6px 6px 0px #000',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '40px'
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ backgroundColor: '#1c1b1b', color: 'white', display: 'inline-block', padding: '4px 12px', borderRadius: '8px', fontFamily: 'var(--mono)', fontSize: '14px', marginBottom: '24px' }}>
            [ STATUS: SYSTEM ACTIVE ]
          </div>
          <h1 style={{ fontSize: '57px', fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, marginBottom: '24px', lineHeight: 1, letterSpacing: '-0.02em', color: '#1c1b1b' }}>
            Know exactly why you're not getting <span style={{ textDecoration: 'underline', textDecorationThickness: '4px' }}>callbacks</span>.
          </h1>
          <p style={{ fontSize: '18px', fontFamily: '"Plus Jakarta Sans", sans-serif', opacity: 0.8, maxWidth: '28rem', color: '#1c1b1b' }}>
            Our AI-powered engine breaks down your resume through the eyes of an recruiter and a cold-hearted ATS.
          </p>
        </div>
        <div style={{ width: '38%', position: 'relative', aspectRatio: '1 / 1', margin: '-64px -3px -51px 0' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#69509e', border: '3px solid #000', borderRadius: '20px', transform: 'rotate(3deg)', zIndex: 0 }}></div>
          <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: 'white', border: '3px solid #000', borderRadius: '20px', overflow: 'hidden', zIndex: 1, boxShadow: '6px 6px 0px #000' }}>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbbRIN3d9oo6oxtv5QESkikyJKfr8c8jcRefjDXipb6vvIiXNO7K_Z0GywDtuxtJr9mwSALPDRr7WB8CWOTbjvSM-sddEsOodY2xfxADCPxshit9_sNGW_hqXOm7ps3aHH6_VwycPPAZQFzQnjFtrD3HOnsMLt-Gl5Ksn61l6P3RG3huXmKkDe9zr9haoM8vQD1alzibZ1OzkY9n2KWoJ2s2GYw5bvGvZTUA5n8gXLIrUQljOiwOLe" alt="Resume Scanning Illustration" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Drop Resume Container */}
          <div 
            style={{
              backgroundColor: 'var(--panel-white)',
              border: '4px dashed #000',
              borderRadius: '20px',
              padding: '60px 40px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: isHovering ? 'translate(6px, 6px)' : 'none',
              boxShadow: isHovering ? 'none' : '6px 6px 0px #000',
              position: 'relative'
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <input 
              type="file" 
              accept=".pdf,.docx" 
              onChange={handleFileChange} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
            <div style={{ fontSize: '48px', color: 'var(--panel-lavender)', marginBottom: '10px' }}>📄</div>
            <h3 style={{ margin: '0 0 10px 0' }}>Drop your Resume here</h3>
            <p style={{ opacity: 0.6, margin: '0 0 20px 0', fontFamily: 'var(--mono)', fontSize: '14px' }}>PDF, DOCX (Max 5MB)</p>
            <button style={{ backgroundColor: 'var(--btn-coral)', pointerEvents: 'none' }}>SELECT FILE</button>
            {file && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>Selected: {file.name}</p>}
          </div>

          {/* Job Description Container */}
          <div className="neo-panel neo-panel-yellow" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontFamily: 'var(--mono)' }}>
              <span style={{ fontWeight: 'bold' }}>PASTE JOB DESCRIPTION</span>
              <span style={{ fontSize: '12px', opacity: 0.6 }}>OPTIONAL BUT RECOMMENDED</span>
            </div>
            <textarea 
              value={jobDescription} 
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here for a tailored match analysis..."
              style={{ width: '100%', height: '150px', boxSizing: 'border-box' }}
            />
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Terminal */}
          <div className="neo-terminal" style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: 0, border: '3px solid #000' }}>
            <div style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '15px', display: 'flex', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF5F56' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFBD2E' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27C93F' }}></div>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {logs.map((log, idx) => (
                <div key={idx} style={{ marginBottom: '8px' }}>{log}</div>
              ))}
              {loading && <div style={{ animation: 'blink 1s infinite' }}>_</div>}
            </div>
          </div>

          {/* Analyze Button */}
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            style={{ width: '100%', backgroundColor: 'var(--btn-coral)', fontSize: '20px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
          >
            📊 ANALYZE MY RESUME
          </button>

          {/* Metrics */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="neo-panel" style={{ flex: 1, backgroundColor: 'var(--btn-mint)', margin: 0, padding: '16px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>ACCURACY</div>
              <div style={{ fontSize: '28px', fontWeight: 900 }}>99.2%</div>
            </div>
            <div className="neo-panel" style={{ flex: 1, backgroundColor: 'var(--panel-lavender)', margin: 0, padding: '16px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>TIME</div>
              <div style={{ fontSize: '28px', fontWeight: 900 }}>&lt; 15s</div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer / Trusted By */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h3 style={{ fontFamily: 'var(--sans)', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', opacity: 0.8 }}>Trusted by candidates at</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', opacity: 0.4, filter: 'grayscale(100%)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '24px', fontWeight: 900 }}>TECHCORP</span>
          <span style={{ fontSize: '24px', fontWeight: 900 }}>STARTUP.IO</span>
          <span style={{ fontSize: '24px', fontWeight: 900 }}>GIGA-SOFT</span>
          <span style={{ fontSize: '24px', fontWeight: 900 }}>MODERN-UI</span>
        </div>
      </div>
      
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      </div>
    </div>
  );
};

export default Home;
