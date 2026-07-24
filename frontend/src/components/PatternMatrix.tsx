import React from 'react';
import type { ShapeData } from '../context/IQTestContext';

interface PatternMatrixProps {
  grid: ShapeData[];
}

export const ShapeRenderer: React.FC<{ shape: ShapeData, size?: number }> = ({ shape, size = 48 }) => {
  if (shape.type === 'empty') return <div style={{ width: size, height: size }} />;

  const strokeWidth = shape.dashed ? 2 : 3;
  const strokeColor = '#1c1b1b';
  const fillColor = shape.filled && shape.color ? shape.color : 'transparent';
  const strokeDasharray = shape.dashed ? '6,6' : 'none';

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      {shape.type === 'circle' && (
        <circle 
          cx="50" cy="50" r="40" 
          fill={fillColor} 
          stroke={strokeColor} 
          strokeWidth={strokeWidth} 
          strokeDasharray={strokeDasharray} 
        />
      )}
      {shape.type === 'square' && (
        <rect 
          x="15" y="15" width="70" height="70" 
          fill={fillColor} 
          stroke={strokeColor} 
          strokeWidth={strokeWidth} 
          strokeDasharray={strokeDasharray} 
        />
      )}
      {shape.type === 'diamond' && (
        <polygon 
          points="50,5 95,50 50,95 5,50" 
          fill={fillColor} 
          stroke={strokeColor} 
          strokeWidth={strokeWidth} 
          strokeDasharray={strokeDasharray} 
        />
      )}
    </svg>
  );
};

export const PatternMatrix: React.FC<PatternMatrixProps> = ({ grid }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      backgroundColor: '#f5f5f5', // light grey background like mockup
      padding: '16px',
      borderRadius: '16px',
      width: 'fit-content',
      margin: '0 auto'
    }}>
      {grid.map((shape, idx) => {
        // Mockup shows question mark for the last cell if it's the missing one, but we represent it as 'empty' usually.
        // Actually, let's look at the mockup: the last cell is a grey square with a question mark.
        const isMissing = idx === 8; 
        return (
          <div key={idx} style={{
            width: '80px',
            height: '80px',
            backgroundColor: isMissing ? '#e0e0e0' : '#ffffff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            {isMissing ? (
              <span style={{ color: '#999', fontSize: '24px', fontFamily: '"JetBrains Mono", monospace' }}>?</span>
            ) : (
              <ShapeRenderer shape={shape} size={48} />
            )}
          </div>
        );
      })}
    </div>
  );
};
