import React, { useState, useEffect } from 'react';
import type { ShapeData } from '../context/IQTestContext';

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */
interface PatternMatrixProps {
  grid: ShapeData[];
}

/* ------------------------------------------------------------------ */
/* Config                                                               */
/* ------------------------------------------------------------------ */
const GRID_COLUMNS = 3;
const DEFAULT_SHAPE_SIZE = 48;
const CELL_PIXEL_SIZE = 80;

const STROKE_COLOR = '#1c1b1b';
const FILLED_STROKE_WIDTH = 3;
const DASHED_STROKE_WIDTH = 2;
const DASH_PATTERN = '6,6';

/* ------------------------------------------------------------------ */
/* Responsive breakpoints                                              */
/* Inline styles can't use CSS media queries, so viewport width is     */
/* tracked in JS and used to pick size overrides per breakpoint        */
/* (same approach as IQTestScreen.tsx / NavBar.tsx).                   */
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

// Cell/shape/gap sizes only — colors and structure stay identical across
// breakpoints. CELL_PIXEL_SIZE / DEFAULT_SHAPE_SIZE above remain the
// desktop values so nothing changes for existing desktop callers.
const getResponsiveMatrixConfig = (viewport: ViewportCategory) => {
  switch (viewport) {
    case 'mobile':
      return { cellSize: 52, shapeSize: 30, gap: '6px', padding: '10px', missingFontSize: '16px' };
    case 'tablet':
      return { cellSize: 64, shapeSize: 38, gap: '7px', padding: '12px', missingFontSize: '20px' };
    default:
      return { cellSize: CELL_PIXEL_SIZE, shapeSize: DEFAULT_SHAPE_SIZE, gap: '8px', padding: '16px', missingFontSize: '24px' };
  }
};

/* ------------------------------------------------------------------ */
/* Styles (values unchanged from original — only grouped/named here)  */
/* ------------------------------------------------------------------ */
const styles: { [key: string]: React.CSSProperties } = {
  matrixWrapper: {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`,
    gap: '8px',
    backgroundColor: '#f5f5f5', // light grey background like mockup
    padding: '16px',
    borderRadius: '16px',
    width: 'fit-content',
    margin: '0 auto',
  },
  cellBase: {
    width: `${CELL_PIXEL_SIZE}px`,
    height: `${CELL_PIXEL_SIZE}px`,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  missingCellMark: { color: '#999', fontSize: '24px', fontFamily: '"JetBrains Mono", monospace' },
  svg: { display: 'block' },
};

/* ------------------------------------------------------------------ */
/* ShapeRenderer                                                        */
/* ------------------------------------------------------------------ */
export const ShapeRenderer: React.FC<{ shape: ShapeData; size?: number }> = ({ shape, size = DEFAULT_SHAPE_SIZE }) => {
  if (shape.type === 'empty') return <div style={{ width: size, height: size }} />;

  const strokeWidth = shape.dashed ? DASHED_STROKE_WIDTH : FILLED_STROKE_WIDTH;
  const fillColor = shape.filled && shape.color ? shape.color : 'transparent';
  const strokeDasharray = shape.dashed ? DASH_PATTERN : 'none';

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={styles.svg}>
      {shape.type === 'circle' && (
        <circle
          cx="50"
          cy="50"
          r="40"
          fill={fillColor}
          stroke={STROKE_COLOR}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
      )}
      {shape.type === 'square' && (
        <rect
          x="15"
          y="15"
          width="70"
          height="70"
          fill={fillColor}
          stroke={STROKE_COLOR}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
      )}
      {shape.type === 'diamond' && (
        <polygon
          points="50,5 95,50 50,95 5,50"
          fill={fillColor}
          stroke={STROKE_COLOR}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
      )}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* PatternMatrix                                                        */
/* ------------------------------------------------------------------ */
export const PatternMatrix: React.FC<PatternMatrixProps> = ({ grid }) => {
  const viewport = useViewportCategory();
  const { cellSize, shapeSize, gap, padding, missingFontSize } = getResponsiveMatrixConfig(viewport);

  return (
    <div style={{ ...styles.matrixWrapper, gap, padding }}>
      {grid.map((shape, idx) => {
        // The missing cell is whichever one the question data actually marks as empty,
        // rather than assuming it's always the last cell in a 3x3 grid.
        const isMissing = shape.type === 'empty';
        return (
          <div
            key={idx}
            style={{
              ...styles.cellBase,
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              backgroundColor: isMissing ? '#e0e0e0' : '#ffffff',
            }}
          >
            {isMissing ? (
              <span style={{ ...styles.missingCellMark, fontSize: missingFontSize }}>?</span>
            ) : (
              <ShapeRenderer shape={shape} size={shapeSize} />
            )}
          </div>
        );
      })}
    </div>
  );
};
