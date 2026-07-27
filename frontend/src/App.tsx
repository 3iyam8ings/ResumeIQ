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
    // These pages are available before sign-in. Avoid an expected 401 from the
    // session endpoint every time a visitor opens an auth form.
    const isPublicAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password']
      .includes(location.pathname);

    if (isPublicAuthPage) {
      setIsAuthenticated(false);
      return;
    }

    // Check if the user is logged in
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (res.ok) {
          res.json().then(data => setUserProfile(data));
          setIsAuthenticated(true);
          if (location.pathname === '/') {
            navigate('/home');
          }
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, [location.pathname, navigate]);

  if (isAuthenticated === null) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg)' }}><h2 style={{ color: 'var(--text-primary)' }}>Loading...</h2></div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100vh' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
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
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/signup" />} />
          <Route path="*" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/signup" />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App
