export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  orderPosition: number;
  videoUrl: string;
  status: 'not_started' | 'in_progress' | 'completed';
  videoProgress: number;
  quizCompleted: boolean;
  quizAttempts: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  encouragingFeedback: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
}

export interface QuizResult {
  isPerfectScore: boolean;
  totalQuestions: number;
  correctAnswers: number;
  incorrectQuestionIds: string[];
  canProceed: boolean;
}

export interface UserProgress {
  overallCompletion: number;
  modulesCompleted: number;
  totalModules: number;
  isCertified: boolean;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  moduleId: string;
  score: number;
  totalQuestions: number;
  isPassed: boolean;
  attemptNumber: number;
  createdAt: Date;
}
