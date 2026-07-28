import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MushroomButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ rotate: -15 }}
      whileHover={{ scale: 1.1, rotate: -25, y: -5 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate('/arena')}
      title="Jump to Super Mario Arena!"
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        cursor: 'pointer',
        zIndex: 9999,
        filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,1))',
      }}
    >
      <img 
        src="/mushroom.png" 
        alt="Super Mario Mushroom" 
        style={{ width: '80px', height: 'auto', imageRendering: 'pixelated' }} 
      />
    </motion.div>
  );
};

export default MushroomButton;
