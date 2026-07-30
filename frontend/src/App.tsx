import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import './index.css'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Signup from './components/Signup'
import SetPassword from './components/SetPassword'
import Home from './components/Home'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Report from './components/Report'
import IQTestLanding from './components/IQTestLanding'
import { IQTestProvider } from './context/IQTestContext'
import IQTestScreen from './components/IQTestScreen'
import IQTestReviewScreen from './components/IQTestReviewScreen'
import IQTestResultsScreen from './components/IQTestResultsScreen'
import { Outlet } from 'react-router-dom'
import NavBar from './components/NavBar'
import CoverLetterGenius from './components/CoverLetterGenius'
import MockInterview from './components/MockInterview'
import ArenaScreen from './components/ArenaScreen'
import FeaturesShowcase from './components/FeaturesShowcase'

function AuthenticatedLayout({ userProfile }: { userProfile: any }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3efe8' }}>
      <NavBar userProfile={userProfile} />
      <div style={{ paddingTop: '16px' }}>
        <Outlet />
      </div>
    </div>
  )
}



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the user is logged in (fire and forget)
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (res.ok) {
          res.json().then(data => setUserProfile(data));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/signup', { replace: true });
    }
  }, [location.pathname, navigate]);

  // List of paths that can be viewed without waiting for auth to resolve
  const isPublicView = ['/', '/home', '/features', '/login', '/signup', '/forgot-password', '/reset-password', '/report'].includes(location.pathname) 
    || location.pathname.startsWith('/test') 
    || location.pathname === '/iqtest'
    || location.pathname === '/arena';

  if (isAuthenticated === null && !isPublicView) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)',
        gap: '24px',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          border: '5px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#fff', fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>ResumeIQ</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginTop: '6px', fontWeight: 500 }}>Getting things ready...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100vh' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/features" element={<FeaturesShowcase />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/set-password" element={isAuthenticated ? <SetPassword /> : <Navigate to="/signup" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<Home isAuthenticated={isAuthenticated ?? false} userProfile={userProfile} />} />
          <Route path="/report" element={<Report userProfile={userProfile} />} />
          <Route path="/arena" element={<ArenaScreen />} />
          <Route element={isAuthenticated ? <AuthenticatedLayout userProfile={userProfile} /> : <Navigate to="/signup" />}>
            <Route path="/dashboard" element={<Dashboard userProfile={userProfile} />} />
            <Route path="/cover-letter" element={<CoverLetterGenius userProfile={userProfile} />} />
            <Route path="/mock-interview" element={<MockInterview userProfile={userProfile} />} />
          </Route>
          <Route element={<IQTestProvider><Outlet /></IQTestProvider>}>
            <Route path="/iqtest" element={<IQTestLanding userProfile={userProfile} />} />
            <Route path="/test">
              <Route index element={<IQTestScreen />} />
              <Route path="review" element={<IQTestReviewScreen />} />
              <Route path="results" element={<IQTestResultsScreen />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="*" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/signup" />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App
