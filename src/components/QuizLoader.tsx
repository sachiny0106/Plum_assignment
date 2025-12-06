import React from 'react';
import { Loader2 } from 'lucide-react';

interface QuizLoaderProps {
  topic: string;
}

export const QuizLoader: React.FC<QuizLoaderProps> = ({ topic }) => {
  return (
    <div className="loader-container">
      <Loader2 className="spinner" size={48} />
      <h2>Generating Quiz...</h2>
      <p>AI is crafting questions about "{topic}"</p>
    </div>
  );
};
