import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import './App.css';
import { TopicSelection } from './components/TopicSelection';
import { QuizLoader } from './components/QuizLoader';
import { QuizDisplay } from './components/QuizDisplay';
import { Feedback } from './components/Feedback';
import { generateQuestions, generateFeedback } from './services/aiService';
import { QuizState } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function QuizApp() {
  const { theme, toggleTheme } = useTheme();
  const [state, setState] = useState<QuizState>({
    status: 'topic-selection',
    topic: '',
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    result: null,
  });

  const handleSelectTopic = async (topic: string) => {
    setState(prev => ({ ...prev, status: 'generating', topic }));
    try {
      const questions = await generateQuestions(topic);
      setState(prev => ({
        ...prev,
        status: 'active',
        questions,
        currentQuestionIndex: 0,
        userAnswers: {},
      }));
    } catch (error) {
      console.error("Failed to generate quiz", error);
      setState(prev => ({ ...prev, status: 'topic-selection' }));
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to generate quiz: ${errorMessage}`);
    }
  };

  const handleAnswer = (questionId: string, optionId: string) => {
    setState(prev => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [questionId]: optionId },
    }));
  };

  const handleNext = async () => {
    const { currentQuestionIndex, questions } = state;
    if (currentQuestionIndex < questions.length - 1) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    } else {
      await finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }));
    }
  };

  const finishQuiz = async () => {
    const { questions, userAnswers, topic } = state;
    let score = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctOptionId) {
        score++;
      }
    });

    try {
      const feedback = await generateFeedback(score, questions.length, topic);
      setState(prev => ({
        ...prev,
        status: 'completed',
        result: {
          score,
          totalQuestions: questions.length,
          feedback,
        },
      }));
    } catch (error) {
      console.error("Failed to generate feedback", error);
       setState(prev => ({
        ...prev,
        status: 'completed',
        result: {
          score,
          totalQuestions: questions.length,
          feedback: "Great job! (AI feedback unavailable)",
        },
      }));
    }
  };

  const handleRestart = () => {
    setState({
      status: 'topic-selection',
      topic: '',
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      result: null,
    });
  };

  return (
    <div className="app-container">
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {state.status === 'topic-selection' && (
        <TopicSelection onSelectTopic={handleSelectTopic} />
      )}

      {state.status === 'generating' && (
        <QuizLoader topic={state.topic} />
      )}

      {state.status === 'active' && state.questions.length > 0 && (
        <QuizDisplay
          question={state.questions[state.currentQuestionIndex]}
          currentQuestionIndex={state.currentQuestionIndex}
          totalQuestions={state.questions.length}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          selectedOptionId={state.userAnswers[state.questions[state.currentQuestionIndex].id]}
        />
      )}

      {state.status === 'completed' && state.result && (
        <Feedback
          result={state.result}
          topic={state.topic}
          questions={state.questions}
          userAnswers={state.userAnswers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QuizApp />
    </ThemeProvider>
  );
}

export default App;
