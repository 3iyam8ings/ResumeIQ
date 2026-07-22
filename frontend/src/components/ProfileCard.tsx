import React from 'react';

interface ProfileCardProps {
  name?: string;
  role?: string;
  picture?: string;
  location?: string;
  status?: string;
  mission?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  name, 
  role, 
  picture,
  location,
  status,
  mission
}) => {
  const defaultName = "Tiya";
  const defaultRole = "FULL_STACK_DEVELOPER()";
  const defaultLocation = "Hyderabad, Telangana";
  const defaultStatus = "4th YEAR BTECH STUDENT";
  const defaultMission = "to get an internship";
  const defaultPicture = "https://ui-avatars.com/api/?name=Tiya&background=F59E0B&color=fff"; // Fallback image

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'var(--border-thick)',
    boxShadow: '4px 4px 0px #000',
    fontFamily: 'var(--sans)',
    fontWeight: '900',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.1s ease-in-out',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    textTransform: 'uppercase',
    color: 'var(--text-primary)'
  };

  const getHoverProps = () => ({
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translate(2px, 2px)';
      e.currentTarget.style.boxShadow = '2px 2px 0px #000';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = '4px 4px 0px #000';
    },
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translate(4px, 4px)';
      e.currentTarget.style.boxShadow = 'none';
    },
    onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translate(2px, 2px)';
      e.currentTarget.style.boxShadow = '2px 2px 0px #000';
    }
  });

  return (
    <div style={{
      backgroundColor: 'var(--panel-white)',
      border: 'var(--border-thick)',
      borderRadius: '24px',
      boxShadow: 'var(--shadow-hard)',
      width: '320px',
      padding: '32px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      
      {/* Avatar Container Wrapper */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        {/* Tape on top of avatar */}
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%) rotate(-2deg)',
          width: '60px',
          height: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(0,0,0,0.1)',
          backdropFilter: 'blur(2px)',
          zIndex: 10
        }}></div>

        {/* Avatar Circle */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '6px solid #000',
          backgroundColor: 'var(--panel-yellow)',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          position: 'relative'
        }}>
          <img 
            src={picture || defaultPicture} 
            alt="Profile" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Name */}
      <h2 style={{
        fontFamily: 'var(--display)',
        fontSize: '32px',
        margin: '0 0 8px 0',
        color: 'var(--text-primary)',
        fontStyle: 'italic',
        letterSpacing: '0.02em',
        textAlign: 'center'
      }}>
        {name ? name.toUpperCase() : defaultName}
      </h2>

      {/* Role Badge */}
      <div style={{
        backgroundColor: '#000',
        color: 'var(--panel-white)',
        fontFamily: 'var(--mono)',
        fontSize: '12px',
        fontWeight: 'bold',
        padding: '6px 12px',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        {role || defaultRole}
      </div>

      <div style={{ width: '100%', height: '2px', backgroundColor: 'var(--text-primary)', marginBottom: '24px' }}></div>

      {/* Tags Details */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 'bold' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ backgroundColor: 'var(--panel-yellow)', padding: '2px 6px', border: 'var(--border-thick)' }}>[LOCATION]</span>
          <span>{location || defaultLocation}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ backgroundColor: 'var(--btn-mint)', padding: '2px 6px', border: 'var(--border-thick)' }}>[STATUS]</span>
          <span>{status || defaultStatus}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ backgroundColor: '#7dd3fc', padding: '2px 6px', border: 'var(--border-thick)' }}>[MISSION]</span>
          <span>{mission || defaultMission}</span>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        <button style={{ ...buttonStyle, backgroundColor: 'var(--btn-mint)' }} {...getHoverProps()}>
          <span>↓</span> DOWNLOAD_RESUME
        </button>
        <button style={{ ...buttonStyle, backgroundColor: 'var(--btn-coral)' }} {...getHoverProps()}>
          <span>✉</span> CONTACT ME
        </button>
      </div>

      {/* Social Icons Placeholder */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: 'var(--text-primary)', fontWeight: '900' }}>
        <span style={{ color: 'var(--btn-coral)' }}>✉</span>
        <span>GH</span>
        <span style={{ color: '#3b82f6' }}>IN</span>
        <span style={{ color: '#f59e0b' }}>&lt;/&gt;</span>
        <span>TW</span>
        <span>M</span>
      </div>

    </div>
  );
};

export default ProfileCard;
