import { createContext, useContext, useState, type ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */
type Category = 'Logical' | 'Spatial' | 'Verbal' | 'Numerical';

export interface ShapeData {
  type: 'circle' | 'square' | 'diamond' | 'empty';
  color?: string; // e.g. '#f5c445'
  filled?: boolean;
  dashed?: boolean;
}

export interface Question {
  id: string;
  type: 'pattern-matrix' | 'number-sequence' | 'verbal-analogy' | 'spatial-reasoning';
  category: Category;
  prompt: string;
  grid?: ShapeData[]; // Array of 9 shapes for a 3x3 grid
  options: string[];
  optionShapes?: ShapeData[]; // Array of 4 shapes for the answers
  correctAnswerIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

interface IQTestContextType {
  answers: Record<number, number>;
  setAnswer: (questionIndex: number, answerIndex: number) => void;
  timeRemaining: Record<number, number>;
  setTimeRemaining: (questionIndex: number, time: number) => void;
  resetTest: () => void;
}

/* ------------------------------------------------------------------ */
/* Context                                                              */
/* ------------------------------------------------------------------ */
const IQTestContext = createContext<IQTestContextType | undefined>(undefined);

/* ------------------------------------------------------------------ */
/* Provider                                                             */
/* ------------------------------------------------------------------ */
export const IQTestProvider = ({ children }: { children: ReactNode }) => {
  const [answers, setAnswersState] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemainingState] = useState<Record<number, number>>({});

  const setAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswersState((prev) => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const setTimeRemaining = (questionIndex: number, time: number) => {
    setTimeRemainingState((prev) => ({ ...prev, [questionIndex]: time }));
  };

  const resetTest = () => {
    setAnswersState({});
    setTimeRemainingState({});
  };

  return (
    <IQTestContext.Provider value={{ answers, setAnswer, timeRemaining, setTimeRemaining, resetTest }}>
      {children}
    </IQTestContext.Provider>
  );
};

/* ------------------------------------------------------------------ */
/* Hook                                                                 */
/* ------------------------------------------------------------------ */
export const useIQTest = () => {
  const context = useContext(IQTestContext);
  if (!context) {
    throw new Error('useIQTest must be used within an IQTestProvider');
  }
  return context;
};
