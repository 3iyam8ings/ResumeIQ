import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import './index.css'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Signup from './components/Signup'

function MainApp() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState<string>("")
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showDashboard, setShowDashboard] = useState<boolean>(false)

  const [rewriteFile, setRewriteFile] = useState<File | null>(null)
  const [rewriteJobDesc, setRewriteJobDesc] = useState<string>("")
  const [rewriteResult, setRewriteResult] = useState<string | null>(null)
  const [rewriteLoading, setRewriteLoading] = useState<boolean>(false)
  
  const [clFile, setClFile] = useState<File | null>(null)
  const [clJobDesc, setClJobDesc] = useState<string>("")
  const [clResult, setClResult] = useState<string | null>(null)
  const [clLoading, setClLoading] = useState<boolean>(false)

  const [intFile, setIntFile] = useState<File | null>(null)
  const [intJobDesc, setIntJobDesc] = useState<string>("")
  const [intQuestions, setIntQuestions] = useState<any[] | null>(null)
  const [intLoading, setIntLoading] = useState<boolean>(false)

  const [portfolioFile, setPortfolioFile] = useState<File | null>(null)
  const [roadmapRole, setRoadmapRole] = useState<string>("")
  const [portfolioResult, setPortfolioResult] = useState<any | null>(null)
  const [roadmapResult, setRoadmapResult] = useState<any | null>(null)
  const [analyzingPortfolio, setAnalyzingPortfolio] = useState(false)
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0])
    }
  }

  // All the existing handleSubmit functions...
  // Since the user asked for full auth with a dashboard, I'll place the main features here for now.
  // In a real app we'd break these down, but sticking to MVP structure.

  return (
    <div className="App" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ margin: 0 }}>ResumeIQ <span style={{color: 'var(--btn-coral)'}}>Dashboard</span></h1>
        <div>
          <button onClick={() => setShowDashboard(!showDashboard)} style={{ backgroundColor: 'var(--panel-yellow)' }}>
            {showDashboard ? "Close Job Tracker" : "Open Job Tracker"}
          </button>
        </div>
      </div>

      {showDashboard && (
        <div style={{ marginBottom: '40px' }}>
          <Dashboard />
        </div>
      )}

      {/* Main Upload Section */}
      <div className="neo-panel neo-panel-yellow">
        <h2>Resume Analysis & Match Score</h2>
        <form onSubmit={async (e) => {
            e.preventDefault();
            if (!file) return;
            setLoading(true);
            setError(null);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('jobDescription', jobDescription);
            try {
              const res = await fetch('/api/upload', { method: 'POST', body: formData });
              if (!res.ok) throw new Error("Upload failed");
              const data = await res.json();
              setResult(data);
            } catch (err: any) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
        }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label>Resume (PDF): </label>
            <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setFile)} />
          </div>
          <div>
            <label style={{ display: 'block' }}>Job Description:</label>
            <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={6} style={{ width: '100%' }} />
          </div>
          <button type="submit" style={{ backgroundColor: 'var(--btn-coral)' }} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {error && <p style={{ color: 'var(--btn-coral)' }}>{error}</p>}
        {result && (
          <div className="neo-terminal" style={{ marginTop: '20px' }}>
            <p className="neo-badge" style={{ borderColor: 'var(--terminal-text)' }}>[RESULTS]</p>
            <h3>Match Score: {result.matchScore}%</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{result.extractedText}</pre>
          </div>
        )}
      </div>

      {/* AI Cover Letter Generator */}
      <div className="neo-panel neo-panel-lavender">
        <h2>AI Cover Letter Generator</h2>
        <form onSubmit={async (e) => {
            e.preventDefault();
            if (!clFile) return;
            setClLoading(true);
            const formData = new FormData();
            formData.append('file', clFile);
            formData.append('jobDescription', clJobDesc);
            try {
              const res = await fetch('/api/generate-cover-letter', { method: 'POST', body: formData });
              const data = await res.json();
              setClResult(data.coverLetter);
            } catch (err) {
              console.error(err);
            } finally {
              setClLoading(false);
            }
        }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label>Resume (PDF): </label>
            <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setClFile)} />
          </div>
          <div>
            <label style={{ display: 'block' }}>Job Description:</label>
            <textarea value={clJobDesc} onChange={(e) => setClJobDesc(e.target.value)} rows={4} style={{ width: '100%' }} />
          </div>
          <button type="submit" style={{ backgroundColor: 'var(--panel-white)' }} disabled={clLoading}>
            {clLoading ? 'Generating...' : 'Generate Cover Letter'}
          </button>
        </form>
        {clResult && (
          <div className="neo-terminal" style={{ marginTop: '20px' }}>
            <p className="neo-badge" style={{ borderColor: 'var(--terminal-text)' }}>[COVER LETTER]</p>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{clResult}</pre>
          </div>
        )}
      </div>

    </div>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the user is logged in
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
          if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
            navigate('/dashboard');
          }
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, [navigate, location.pathname]);

  if (isAuthenticated === null) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg)' }}><h2 style={{ color: 'var(--text-primary)' }}>Loading...</h2></div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={isAuthenticated ? <MainApp /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App
