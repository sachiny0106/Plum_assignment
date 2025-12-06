import React from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizDisplayProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswer: (questionId: string, optionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  selectedOptionId?: string;
}

export const QuizDisplay: React.FC<QuizDisplayProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  onAnswer,
  onNext,
  onPrevious,
  selectedOptionId,
}) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isAnswered = !!selectedOptionId;

  return (
    <div className="quiz-container">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="question-header">
        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
      </div>

      <h2 className="question-text">{question.text}</h2>

      <div className="options-list">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === question.correctOptionId;
          
          let buttonClass = 'option-button';
          if (isAnswered) {
            if (isCorrect) {
              buttonClass += ' correct';
            } else if (isSelected) {
              buttonClass += ' incorrect';
            } else {
              buttonClass += ' dimmed';
            }
          } else if (isSelected) {
            buttonClass += ' selected';
          }

          return (
            <button
              key={option.id}
              className={buttonClass}
              onClick={() => !isAnswered && onAnswer(question.id, option.id)}
              disabled={isAnswered}
            >
              <span style={{ flex: 1 }}>{option.text}</span>
              {isAnswered && isCorrect && <CheckCircle size={20} className="icon-right" />}
              {isAnswered && isSelected && !isCorrect && <XCircle size={20} className="icon-right" />}
            </button>
          );
        })}
      </div>

      {isAnswered && question.explanation && (
        <div className="explanation-box">
          <h3>Explanation</h3>
          <p>{question.explanation}</p>
        </div>
      )}

      <div className="navigation-buttons">
        <button onClick={onPrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </button>
        <button onClick={onNext}>
          {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};
