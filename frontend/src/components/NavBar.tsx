import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  userProfile?: {
    name?: string;
    picture?: string;
    photoURL?: string;
  };
}

/* ------------------------------------------------------------------ */
/* Nav links (single source of truth — used for both the desktop row  */
/* and the mobile menu, instead of duplicating the same span 4 times) */
/* ------------------------------------------------------------------ */
const NAV_LINKS = [
  { label: 'Home', path: '/home' },
  { label: 'Features', path: '/features' },
  { label: 'Cover Letter', path: '/cover-letter' },
  { label: 'Mock Interview', path: '/mock-interview' },
  { label: 'Job Tracker', path: '/dashboard' },
];

/* ------------------------------------------------------------------ */
/* Responsive breakpoints                                              */
/* Inline styles can't use CSS media queries, so viewport width is     */
/* tracked in JS and used to pick size overrides / layout per          */
/* breakpoint (mirrors the approach used in IQTestScreen.tsx).         */
/* ------------------------------------------------------------------ */
const BREAKPOINTS = { mobile: 640, tablet: 1024 };

type ViewportCategory = 'mobile' | 'tablet' | 'desktop';

const getViewportCategory = (width: number): ViewportCategory => {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};

const useViewportCategory = (): ViewportCategory => {
  const [category, setCategory] = useState<ViewportCategory>(() =>
    typeof window !== 'undefined' ? getViewportCategory(window.innerWidth) : 'desktop'
  );

  useEffect(() => {
    const handleResize = () => setCategory(getViewportCategory(window.innerWidth));
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return category;
};

const NavBar: React.FC<NavBarProps> = ({ userProfile }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const viewport = useViewportCategory();
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const goTo = (path: string) => {
    setShowMobileMenu(false);
    navigate(path);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'sticky', top: '16px', zIndex: 50 }}>
      <nav
        style={{
          backgroundColor: '#b996f7',
          border: '3px solid #000',
          borderRadius: '9999px',
          padding: isMobile ? '10px 16px' : isTablet ? '10px 20px' : '12px 24px',
          boxShadow: isMobile ? '4px 4px 0px #000' : '6px 6px 0px #000',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isMobile ? '24px' : '50px',
          width: '100%',
          maxWidth: '1136px', // Matches the 1200px container minus 4rem padding in Home
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/home')}>
          <img src="/logo.png" alt="ResumeIQ Logo" style={{ height: isMobile ? '32px' : isTablet ? '40px' : '48px' }} />
        </div>

        {/* Nav links — inline row on tablet/desktop, moved into the mobile menu below on mobile */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: isTablet ? '16px' : '24px', fontFamily: 'var(--mono, monospace)', fontSize: isTablet ? '12px' : '14px', color: '#1c1b1b', opacity: 0.7, fontWeight: 600, textTransform: 'uppercase' }}>
            {NAV_LINKS.map((link) => (
              <span
                key={link.path}
                className="nav-link"
                onClick={() => navigate(link.path)}
                style={{ cursor: 'pointer', textDecoration: window.location.pathname === link.path ? 'underline' : 'none' }}
              >
                {link.label}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px' }}>
          {!isMobile && (
            <button
              onClick={() => navigate('/iqtest')}
              style={{
                backgroundColor: '#f5c445',
                border: '3px solid #000',
                borderRadius: '9999px',
                padding: isTablet ? '7px 18px' : '8px 24px',
                fontWeight: 800,
                fontSize: isTablet ? '13px' : '14px',
                cursor: 'pointer',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                color: '#1c1b1b',
              }}>
              IQ Test
            </button>
          )}

          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ width: isMobile ? '32px' : '40px', height: isMobile ? '32px' : '40px', borderRadius: '50%', border: '3px solid #000', overflow: 'hidden', backgroundColor: 'white', cursor: 'pointer' }}
            >
              <img src={userProfile?.photoURL || userProfile?.picture || (userProfile as any)?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.name || 'Felix'}`} alt="avatar" style={{ width: '100%', height: '100%' }} />
            </div>
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: isMobile ? '42px' : '50px',
                right: 0,
                backgroundColor: '#fff',
                border: '3px solid #000',
                boxShadow: '4px 4px 0px #000',
                borderRadius: '8px',
                padding: '8px 0',
                minWidth: '120px',
                zIndex: 100
              }}>
                <div
                  onClick={handleLogout}
                  style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontFamily: 'var(--mono, monospace)',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#d93025' // Red color for logout
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Log Out
                </div>
              </div>
            )}
          </div>

          {/* Hamburger — mobile only, opens the link menu below the navbar */}
          {isMobile && (
            <div
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '3px solid #000',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <span style={{ width: '14px', height: '2px', backgroundColor: '#1c1b1b', borderRadius: '1px' }} />
              <span style={{ width: '14px', height: '2px', backgroundColor: '#1c1b1b', borderRadius: '1px' }} />
              <span style={{ width: '14px', height: '2px', backgroundColor: '#1c1b1b', borderRadius: '1px' }} />
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu — links + IQ Test, shown below the pill navbar */}
      {isMobile && showMobileMenu && (
        <div
          style={{
            backgroundColor: '#fff',
            border: '3px solid #000',
            borderRadius: '16px',
            boxShadow: '4px 4px 0px #000',
            width: '100%',
            maxWidth: '1136px',
            boxSizing: 'border-box',
            padding: '8px',
            marginTop: '-12px',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {NAV_LINKS.map((link) => (
            <div
              key={link.path}
              onClick={() => goTo(link.path)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                fontFamily: 'var(--mono, monospace)',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: '#1c1b1b',
                backgroundColor: window.location.pathname === link.path ? '#f1f3f4' : 'transparent',
                borderRadius: '8px',
              }}
            >
              {link.label}
            </div>
          ))}
          <div
            onClick={() => goTo('/iqtest')}
            style={{
              margin: '4px',
              padding: '10px 16px',
              cursor: 'pointer',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 800,
              textAlign: 'center',
              color: '#1c1b1b',
              backgroundColor: '#f5c445',
              border: '3px solid #000',
              borderRadius: '9999px',
            }}
          >
            IQ Test
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
