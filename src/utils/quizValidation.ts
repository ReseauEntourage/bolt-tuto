import { QuizQuestion, QuizAnswer, QuizResult } from '../types';

export function validateQuizAnswers(
  questions: QuizQuestion[],
  answers: QuizAnswer[]
): QuizResult {
  if (answers.length !== questions.length) {
    return {
      isPerfectScore: false,
      totalQuestions: questions.length,
      correctAnswers: 0,
      incorrectQuestionIds: questions.map(q => q.id),
      canProceed: false,
    };
  }

  const incorrectQuestionIds: string[] = [];
  let correctCount = 0;

  questions.forEach((question) => {
    const answer = answers.find(a => a.questionId === question.id);

    if (!answer || answer.selectedAnswer !== question.correctAnswer) {
      incorrectQuestionIds.push(question.id);
    } else {
      correctCount++;
    }
  });

  const isPerfectScore = incorrectQuestionIds.length === 0;

  return {
    isPerfectScore,
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    incorrectQuestionIds,
    canProceed: isPerfectScore,
  };
}

export function canCompleteModule(quizResult: QuizResult): boolean {
  return quizResult.isPerfectScore && quizResult.canProceed;
}
