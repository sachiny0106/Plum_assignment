export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
  explanation?: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  feedback: string;
}

export type QuizStatus = 'topic-selection' | 'generating' | 'active' | 'completed';

export interface QuizState {
  status: QuizStatus;
  topic: string;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>; // questionId -> optionId
  result: QuizResult | null;
}
