import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom'
import './index.css'

// ─── Page Components ───────────────────────────────────────────────────────
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Signup from './components/Signup'
import SetPassword from './components/SetPassword'
import Home from './components/Home'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Report from './components/Report'
import NavBar from './components/NavBar'
import CoverLetterGenius from './components/CoverLetterGenius'
import MockInterview from './components/MockInterview'
import ArenaScreen from './components/ArenaScreen'
import FeaturesShowcase from './components/FeaturesShowcase'

// ─── IQ Test Feature ────────────────────────────────────────────────────────
import IQTestLanding from './components/IQTestLanding'
import IQTestScreen from './components/IQTestScreen'
import IQTestReviewScreen from './components/IQTestReviewScreen'
import IQTestResultsScreen from './components/IQTestResultsScreen'
import { IQTestProvider } from './context/IQTestContext'

// ============================================================================
// TYPES
// ============================================================================

interface AuthenticatedLayoutProps {
  userProfile: any
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Routes that render immediately without waiting for the `/api/auth/me`
 * check to resolve. Everything else shows the loading screen until auth
 * status is known.
 */
const PUBLIC_PATHS = [
  '/',
  '/home',
  '/features',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/report',
]

/** Path-prefix / exact-match rules that don't fit a simple array lookup. */
function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/test') ||
    pathname === '/iqtest' ||
    pathname === '/arena'
  )
}

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  authLayoutWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f3efe8',
  },
  authLayoutContent: {
    paddingTop: '16px',
  },
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#6aaff5',
    gap: '24px',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
  },
  loadingSpinner: {
    width: '64px',
    height: '64px',
    border: '5px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  loadingTextWrapper: {
    textAlign: 'center' as const,
  },
  loadingTitle: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: 900,
    letterSpacing: '-0.5px',
  },
  loadingSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    marginTop: '6px',
    fontWeight: 500,
  },
  appWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
    minHeight: '100vh',
  },
  routesWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
}

// ============================================================================
// COMPONENT: AuthenticatedLayout
// ============================================================================

/** Shared shell (NavBar + routed content) for pages that require login. */
function AuthenticatedLayout({ userProfile }: AuthenticatedLayoutProps) {
  return (
    <div style={styles.authLayoutWrapper}>
      <NavBar userProfile={userProfile} />
      <div style={styles.authLayoutContent}>
        <Outlet />
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: App
// ============================================================================

function App() {
  // ── State ──────────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // ── Effects ────────────────────────────────────────────────────────────

  // Resolve auth session on mount (fire and forget)
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (res.ok) {
          res.json().then(data => setUserProfile(data))
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      })
      .catch(() => {
        setIsAuthenticated(false)
      })
  }, [])

  // Redirect the root path based on auth state
  useEffect(() => {
    if (location.pathname === '/') {
      if (isAuthenticated === true) {
        navigate('/home', { replace: true })
      } else if (isAuthenticated === false) {
        navigate('/signup', { replace: true })
      }
    }
  }, [location.pathname, navigate, isAuthenticated])

  // ── Derived Values ─────────────────────────────────────────────────────
  const isPublicView = isPublicPath(location.pathname)
  const showLoadingScreen = isAuthenticated === null && !isPublicView

  // ── Render: Loading State ──────────────────────────────────────────────
  if (showLoadingScreen) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingSpinner} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={styles.loadingTextWrapper}>
          <div style={styles.loadingTitle}>ResumeIQ</div>
          <div style={styles.loadingSubtitle}>Getting things ready...</div>
        </div>
      </div>
    )
  }

  // ── Render: Main App ───────────────────────────────────────────────────
  return (
    <div style={styles.appWrapper}>
      <div style={styles.routesWrapper}>
        <Routes>
          {/* Public pages */}
          <Route path="/features" element={<FeaturesShowcase />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/set-password" element={isAuthenticated ? <SetPassword /> : <Navigate to="/signup" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<Home isAuthenticated={isAuthenticated ?? false} userProfile={userProfile} />} />
          <Route path="/report" element={<Report userProfile={userProfile} />} />
          <Route path="/arena" element={<ArenaScreen />} />

          {/* Authenticated pages */}
          <Route element={isAuthenticated ? <AuthenticatedLayout userProfile={userProfile} /> : <Navigate to="/signup" />}>
            <Route path="/dashboard" element={<Dashboard userProfile={userProfile} />} />
            <Route path="/cover-letter" element={<CoverLetterGenius userProfile={userProfile} />} />
            <Route path="/mock-interview" element={<MockInterview userProfile={userProfile} />} />
          </Route>

          {/* IQ Test flow (shares IQTestProvider context) */}
          <Route element={<IQTestProvider><Outlet /></IQTestProvider>}>
            <Route path="/iqtest" element={<IQTestLanding userProfile={userProfile} />} />
            <Route path="/test">
              <Route index element={<IQTestScreen />} />
              <Route path="review" element={<IQTestReviewScreen />} />
              <Route path="results" element={<IQTestResultsScreen />} />
            </Route>
          </Route>

          {/* Fallbacks */}
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="*" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/signup" />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default App
