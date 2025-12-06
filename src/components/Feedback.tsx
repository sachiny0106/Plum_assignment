import React, { useState } from 'react';
import { QuizResult, Question } from '../types';
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FeedbackProps {
  result: QuizResult;
  topic: string;
  questions: Question[];
  userAnswers: Record<string, string>;
  onRestart: () => void;
}

export const Feedback: React.FC<FeedbackProps> = ({ result, topic, questions, userAnswers, onRestart }) => {
  const [showReview, setShowReview] = useState(false);
  const [filter, setFilter] = useState<'all' | 'incorrect'>('all');

  const filteredQuestions = filter === 'all' 
    ? questions 
    : questions.filter(q => userAnswers[q.id] !== q.correctOptionId);

  return (
    <div className="feedback-container">
      <h1>Quiz Completed!</h1>
      <div className="score-card">
        <div className="score-circle">
          <span className="score-number">{result.score}</span>
          <span className="score-total">/ {result.totalQuestions}</span>
        </div>
        <h3>Topic: {topic}</h3>
      </div>
      
      <div className="ai-feedback">
        <h4>AI Feedback:</h4>
        <p>{result.feedback}</p>
      </div>

      <button 
        className="review-toggle-button"
        onClick={() => setShowReview(!showReview)}
      >
        {showReview ? 'Hide Review' : 'Review Answers'}
        {showReview ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {showReview && (
        <div className="review-section">
          <div className="review-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Questions
            </button>
            <button 
              className={`filter-btn ${filter === 'incorrect' ? 'active' : ''}`}
              onClick={() => setFilter('incorrect')}
            >
              Incorrect Only
            </button>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="empty-state">
              <p>No incorrect answers! Perfect score! 🎉</p>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const userAnswerId = userAnswers[q.id];
              const isCorrect = userAnswerId === q.correctOptionId;
              // Find original index for question number
              const originalIndex = questions.findIndex(quest => quest.id === q.id);
              
              return (
                <div key={q.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="review-header">
                    <span className="question-number">Question {originalIndex + 1}</span>
                    <span className="review-status">
                      {isCorrect ? (
                        <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={18} /> Correct
                        </span>
                      ) : (
                        <span style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <XCircle size={18} /> Incorrect
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="review-question-text">{q.text}</p>
                  
                  <div className="review-options">
                    {q.options.map(opt => {
                      const isSelected = opt.id === userAnswerId;
                      const isCorrectOption = opt.id === q.correctOptionId;
                      
                      let optionClass = 'review-option';
                      if (isCorrectOption) optionClass += ' correct-answer';
                      if (isSelected && !isCorrectOption) optionClass += ' wrong-answer';
                      
                      return (
                        <div key={opt.id} className={optionClass}>
                          {opt.text}
                          {isCorrectOption && <CheckCircle size={18} className="icon-right" />}
                          {isSelected && !isCorrectOption && <XCircle size={18} className="icon-right" />}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="review-explanation">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      <button onClick={onRestart} className="restart-button">
        Start New Quiz
      </button>
    </div>
  );
};
