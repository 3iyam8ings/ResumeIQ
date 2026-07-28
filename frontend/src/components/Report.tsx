import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ScoreFactor {
  factorName: string;
  pointValue: number;
}

interface ScoreResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  breakdown: ScoreFactor[];
  weakBullet: string | null;
}

interface AnalysisResult {
  score: ScoreResult;
  role: string;
  rawText: string;
  jobDescription?: string;
}

const pillStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  border: '1.5px solid #000',
  borderRadius: '9999px',
  fontWeight: 500,
  fontSize: '12px',
  backgroundColor: '#fff',
  fontFamily: '"Plus Jakarta Sans", sans-serif',
  whiteSpace: 'nowrap',
  color: '#000',
};

const sectionLabelStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 16px',
  backgroundColor: '#000',
  color: '#fff',
  borderRadius: '9999px',
  fontWeight: 800,
  fontSize: '11px',
  fontFamily: 'monospace',
  letterSpacing: '1px',
  marginBottom: '16px',
};

const cardStyle = (bg: string): React.CSSProperties => ({
  border: '3px solid #000',
  borderRadius: '14px',
  boxShadow: '4px 4px 0px #000',
  backgroundColor: bg,
  padding: '16px',
});

function getScoreMessage(score: number): string {
  if (score >= 80) return '🎉 Your resume is highly competitive!';
  if (score >= 60) return '👍 Good match — a few tweaks and you\'re in!';
  if (score >= 40) return '⚡ Decent start — add more relevant keywords.';
  return '🔧 Major gaps found — tailor your resume closely.';
}

function extractJobTitle(jobDescription?: string): { title: string; company: string } {
  if (!jobDescription) return { title: 'N/A', company: 'N/A' };
  const titleMatch = jobDescription.match(/(?:job title|position|role):?\s*([^\n,]{3,50})/i);
  const companyMatch = jobDescription.match(/(?:company|organization|at|for):?\s*([A-Z][a-zA-Z\s]{2,30})(?:\s|,|\n)/);
  return {
    title: titleMatch ? titleMatch[1].trim() : 'Target Role',
    company: companyMatch ? companyMatch[1].trim() : 'Target Company',
  };
}

const SkeletonBox = ({ height = 80, width = '100%' }: { height?: number; width?: string }) => (
  <div style={{
    height, width, backgroundColor: '#e0e0e0', borderRadius: 12,
    animation: 'skeleton-pulse 1.5s ease-in-out infinite',
  }} />
);

const Report: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result: AnalysisResult | null = (location.state as any)?.result || null;

  const [optimizedBullet, setOptimizedBullet] = useState<string | null>(null);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  const score = result?.score;
  const hasJD = !!(result?.jobDescription?.trim());
  const { title: jobTitle, company: jobCompany } = extractJobTitle(result?.jobDescription);

  const handleRegenerate = async () => {
    if (!score?.weakBullet || !result) return;
    setRewriteLoading(true);
    setOptimizedBullet(null);
    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          bulletPoint: score.weakBullet.replace(/^"|"$/g, ''),
          jobDescription: result.jobDescription || 'No specific job description provided.',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOptimizedBullet(data.rewrittenBulletPoint || data.rewrittenBullet || data.result || 'Could not generate rewrite.');
      } else {
        setOptimizedBullet('AI service error. Please try again.');
      }
    } catch {
      setOptimizedBullet('Failed to connect to AI service. Please try again.');
    } finally {
      setRewriteLoading(false);
    }
  };

  // Auto-generate rewrite on load
  useEffect(() => {
    if (score?.weakBullet) handleRegenerate();
  }, []);

  const handleCopy = () => {
    if (optimizedBullet) {
      navigator.clipboard.writeText(optimizedBullet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f0eb', minHeight: '100vh' }}>

      {/* Page Title */}
      <div style={{ 
        padding: '24px 24px 16px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#f5f0eb',
        borderBottom: '2px solid transparent' // Optional, could add a border if needed
      }}>
        <h1 style={{ fontWeight: 900, fontSize: '36px', margin: 0, letterSpacing: '-1px' }}>
          Detailed Analysis <span style={{ color: '#7c3aed' }}>Report</span>
        </h1>
        <p style={{ fontFamily: 'monospace', fontSize: '16px', opacity: 0.6, marginTop: 6, marginBottom: 0 }}>
          {result ? `Analysis for: ${result.role || 'Candidate'} · Score: ${score?.matchPercentage ?? 0}%` : 'No analysis data found.'}
        </p>
      </div>

      {!result ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: 20 }}>📋</div>
          <h2>No report data found</h2>
          <p style={{ fontFamily: 'monospace', opacity: 0.6 }}>Go back and run an analysis first.</p>
          <button
            onClick={() => navigate('/home')}
            style={{ marginTop: 20, padding: '12px 32px', backgroundColor: '#7c3aed', color: '#fff', border: '3px solid #000', borderRadius: '9999px', fontWeight: 800, fontSize: '15px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}
          >
            ← Back to Analyze
          </button>
        </div>
      ) : (
        <div style={{ padding: '10px 24px 24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Main Grid Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.1fr', gap: '14px', alignItems: 'stretch' }}>

            {/* ATS Match Score — left tall card */}
            <div style={{ ...cardStyle('#7ebbf5'), display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ ...sectionLabelStyle, marginBottom: '24px' }}>[ATS MATCH SCORE]</div>
              <div style={{
                border: '2px solid #000',
                width: '180px',
                height: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
              }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  border: '2px solid #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1, letterSpacing: '-1px' }}>{score?.matchPercentage ?? 0}%</div>
                </div>
              </div>
              <p style={{ textAlign: 'center', fontWeight: 500, fontSize: '14px', margin: 0, color: '#333' }}>
                {getScoreMessage(score?.matchPercentage ?? 0).replace(/^[^\w\s]+/, '').trim()}
              </p>
            </div>

            {/* Right column: Skills row + Role bar stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Matched Skills | Missing Skills — side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'stretch' }}>

                {/* Matched Skills */}
                <div style={{ backgroundColor: '#82db9b', border: '3px solid #000', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ ...sectionLabelStyle, marginBottom: '16px' }}>MATCHED SKILLS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {score?.matchedSkills?.length ? (
                      score.matchedSkills.map((skill, i) => (
                        <span key={i} style={pillStyle}>{skill}</span>
                      ))
                    ) : (
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', opacity: 0.6 }}>No matched skills found.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div style={{ backgroundColor: '#ea7d7a', border: '3px solid #000', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ ...sectionLabelStyle, marginBottom: '16px' }}>MISSING SKILLS</div>
                  {hasJD ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {score?.missingSkills?.length ? (
                        score.missingSkills.map((skill, i) => (
                          <span key={i} style={pillStyle}>{skill}</span>
                        ))
                      ) : (
                        <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700 }}>✅ No skill gaps detected!</span>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', opacity: 0.85, lineHeight: 1.5 }}>
                      No job description provided. Paste a JD on the Home page for a targeted comparison.
                    </div>
                  )}
                </div>
              </div>

              {/* Role Specific Match — full width of right column */}
              <div style={{ backgroundColor: '#fff', border: '3px solid #000', borderRadius: '10px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 500, fontSize: '14px', color: '#111' }}>Role Specific Match</span>
                  <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 500, fontSize: '14px', color: '#111' }}>{score?.matchPercentage ?? 0}%</span>
                </div>
                <div style={{ height: '18px', backgroundColor: '#e3e3e3', borderRadius: '9999px', border: '1.5px solid #000', overflow: 'hidden', display: 'flex' }}>
                  <div style={{
                    height: '100%',
                    width: `${score?.matchPercentage ?? 0}%`,
                    backgroundColor: '#f5c445',
                    borderRight: (score?.matchPercentage ?? 0) > 0 && (score?.matchPercentage ?? 0) < 100 ? '1.5px solid #000' : 'none',
                    transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
                  }} />
                </div>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '12px', fontStyle: 'italic', marginTop: '12px', marginBottom: 0, color: '#555' }}>
                  Targeted for: {jobTitle} @ {jobCompany}
                </p>
              </div>

            </div>

            {/* Row 2 */}

            {/* The Receipts */}
            <div style={{ backgroundColor: '#e3e3e3', border: '3px solid #000', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px' }}>🧾</span>
                <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600, fontSize: '14px', color: '#333' }}>The Receipts</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {score?.breakdown?.length ? (
                  score.breakdown.map((factor, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1.5px solid #000',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      padding: '8px 12px',
                    }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '11px', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                        {factor.factorName}
                      </span>
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        fontSize: '13px',
                        color: factor.pointValue >= 0 ? '#10b981' : '#ef4444',
                      }}>
                        {factor.pointValue >= 0 ? `+${String(factor.pointValue).padStart(2, '0')}` : `-${String(Math.abs(factor.pointValue)).padStart(2, '0')}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', opacity: 0.6 }}>No breakdown available.</span>
                )}
              </div>
            </div>

            {/* AI Smart Rewrite */}
            <div style={{ backgroundColor: '#f5c445', border: '3px solid #000', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🪄</span>
                  <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600, fontSize: '14px', color: '#333' }}>AI Smart Rewrite</span>
                </div>
                <button
                  onClick={handleRegenerate}
                  disabled={rewriteLoading}
                  style={{
                    backgroundColor: '#000', color: '#fff',
                    border: '1.5px solid #000', borderRadius: '9999px',
                    padding: '6px 16px', fontWeight: 700, fontSize: '10px',
                    fontFamily: 'monospace', cursor: rewriteLoading ? 'wait' : 'pointer',
                    letterSpacing: '0.5px', opacity: rewriteLoading ? 0.6 : 1,
                  }}
                >
                  {rewriteLoading ? '⟳ GENERATING...' : 'REGENERATE'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '14px', alignItems: 'stretch' }}>

                {/* Weak bullet */}
                <div style={{ border: '3px solid #000', borderRadius: '8px', backgroundColor: '#ea7d7a', padding: '16px', height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ backgroundColor: '#000', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '10px', fontFamily: 'monospace', display: 'inline-block', marginBottom: '12px', letterSpacing: '0.5px' }}>WEAK IMPACT</div>
                  <p style={{ fontFamily: 'monospace', fontSize: '12px', fontStyle: 'italic', margin: 0, lineHeight: 1.5, color: '#000' }}>
                    {score?.weakBullet
                      ? `"${score.weakBullet.replace(/^"|"$/g, '').trim()}"`
                      : '"No bullet point found in resume."'}
                  </p>
                </div>

                {/* Arrow */}
                <div style={{ alignSelf: 'center', width: '28px', height: '28px', backgroundColor: '#fff', border: '3px solid #000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: '#000' }}>➔</div>

                {/* Optimized bullet */}
                <div style={{ border: '3px solid #000', borderRadius: '8px', backgroundColor: '#82db9b', padding: '16px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ backgroundColor: '#000', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '10px', fontFamily: 'monospace', display: 'inline-block', marginBottom: '12px', letterSpacing: '0.5px' }}>AI OPTIMIZED</div>
                    {rewriteLoading ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <SkeletonBox height={12} />
                        <SkeletonBox height={12} />
                        <SkeletonBox height={12} width="70%" />
                      </div>
                    ) : (
                      <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '12px', fontWeight: 500, margin: 0, lineHeight: 1.5, color: '#111' }}>
                        {optimizedBullet
                          ? `"${optimizedBullet.replace(/^"|"$/g, '').trim()}"`
                          : '"Click REGENERATE to generate an optimized version."'}
                      </p>
                    )}
                  </div>
                  {optimizedBullet && !rewriteLoading && (
                    <button
                      onClick={handleCopy}
                      style={{
                        marginTop: '12px', width: '100%',
                        backgroundColor: copied ? '#82db9b' : '#fff',
                        color: '#000',
                        border: '1.5px solid #000', borderRadius: '9999px',
                        padding: '6px 0', fontWeight: 600, fontSize: '10px',
                        fontFamily: 'monospace', cursor: 'pointer', letterSpacing: '0.5px',
                        transition: 'all 0.2s',
                      }}
                    >
                      {copied ? '✅ COPIED!' : 'COPY TO CLIPBOARD'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <button
              className="btn-analyze"
              onClick={() => navigate('/home')}
              style={{
                padding: '12px 36px', backgroundColor: '#fff',
                border: '3px solid #000', borderRadius: '9999px',
                fontWeight: 800, fontSize: '14px', cursor: 'pointer',
                boxShadow: '4px 4px 0px #000', fontFamily: 'monospace',
                transition: 'all 0.1s ease',
              }}
            >
              ← ANALYZE ANOTHER RESUME
            </button>
          </div>

        </div>
      )}

      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .btn-analyze:hover, .btn-analyze:active {
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0px #000 !important;
        }
      `}</style>
    </div>
  );
};

export default Report;
