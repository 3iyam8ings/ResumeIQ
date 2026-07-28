import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const positions = [
  { top: '10%', left: '5%' },
  { top: '80%', left: '15%' },
  { top: '40%', right: '5%' },
  { bottom: '5%', right: '10%' },
  { top: '15%', right: '40%' },
  { bottom: '15%', left: '40%' },
];

const spritePositions = [
  '0px 0px',
  '-50px 0px',
  '-100px 0px',
  '0px -70px',
  '-50px -70px',
  '-100px -70px',
];

const HiddenGems: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', zIndex: 50 }}>
      {positions.map((pos, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.2, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/arena')}
          title="Hidden Gem - Jump to Arena!"
          style={{
            position: 'absolute',
            ...pos,
            width: '50px',
            height: '70px',
            backgroundImage: "url('/mushroom.png')",
            backgroundSize: '150px 140px',
            backgroundPosition: spritePositions[idx],
            cursor: 'pointer',
            opacity: 0.8,
            imageRendering: 'pixelated',
            pointerEvents: 'auto',
            filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.5))'
          }}
        />
      ))}
    </div>
  );
};

export default HiddenGems;
