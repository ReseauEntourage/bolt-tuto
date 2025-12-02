import { X, CheckCircle, Sparkles, AlertCircle, XCircle, RotateCcw } from 'lucide-react';
import { QuizQuestion, QuizAnswer } from '../types';
import { useState } from 'react';
import { validateQuizAnswers, canCompleteModule } from '../utils/quizValidation';

interface QuizModalProps {
  moduleTitle: string;
  questions: QuizQuestion[];
  attemptNumber: number;
  onClose: () => void;
  onComplete: (passed: boolean) => void;
  onRetry: () => void;
}

export default function QuizModal({
  moduleTitle,
  questions,
  attemptNumber,
  onClose,
  onComplete,
  onRetry
}: QuizModalProps) {
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    isPerfectScore: boolean;
    totalQuestions: number;
    correctAnswers: number;
    incorrectQuestionIds: string[];
    canProceed: boolean;
  } | null>(null);

  const question = questions[currentQuestion];
  const currentAnswer = answers.find(a => a.questionId === question.id);
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    if (showResults) return;

    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== question.id);
      return [...filtered, { questionId: question.id, selectedAnswer: answer }];
    });
  };

  const handleNext = () => {
    if (!currentAnswer) return;

    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const result = validateQuizAnswers(questions, answers);
    setQuizResult(result);
    setShowResults(true);
  };

  const handleRetryQuiz = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);
    setQuizResult(null);
    onRetry();
  };

  const handleCompleteModule = () => {
    if (quizResult && canCompleteModule(quizResult)) {
      onComplete(true);
    }
  };

  const isQuestionIncorrect = (questionId: string) => {
    return quizResult?.incorrectQuestionIds.includes(questionId) || false;
  };

  const allQuestionsAnswered = answers.length === questions.length;

  if (showResults && quizResult) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
          <div className={`p-6 flex items-center justify-between text-white ${
            quizResult.isPerfectScore
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
              : 'bg-gradient-to-r from-red-600 to-orange-600'
          }`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {quizResult.isPerfectScore ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">Quiz Results</span>
              </div>
              <h2 className="text-2xl font-bold">{moduleTitle}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8">
            {quizResult.isPerfectScore ? (
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Perfect Score!
                </h3>
                <p className="text-lg text-slate-600 mb-6">
                  You answered all {quizResult.totalQuestions} questions correctly. You can now complete this module!
                </p>
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <h4 className="font-semibold text-emerald-900 mb-2">
                        Excellent Understanding!
                      </h4>
                      <p className="text-sm text-emerald-800 leading-relaxed">
                        Your mastery of this material demonstrates you're ready to apply these concepts in your coaching practice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                    <XCircle className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Not Quite There Yet
                  </h3>
                  <p className="text-lg text-slate-600 mb-2">
                    You got {quizResult.correctAnswers} out of {quizResult.totalQuestions} questions correct.
                  </p>
                  <p className="text-slate-600 font-medium">
                    You need to answer ALL questions correctly to complete this module.
                  </p>
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">
                        Review Required
                      </h4>
                      <p className="text-sm text-red-800 leading-relaxed mb-3">
                        You had {quizResult.incorrectQuestionIds.length} incorrect {quizResult.incorrectQuestionIds.length === 1 ? 'answer' : 'answers'}.
                        Please review the video content and try again.
                      </p>
                      <p className="text-sm text-red-800 leading-relaxed">
                        <strong>Note:</strong> The incorrect questions are marked below, but correct answers are not shown.
                        This encourages genuine understanding rather than memorization.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Question Review</h4>
                  <div className="space-y-3">
                    {questions.map((q, idx) => {
                      const isIncorrect = isQuestionIncorrect(q.id);
                      const userAnswer = answers.find(a => a.questionId === q.id);

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-lg border-2 ${
                            isIncorrect
                              ? 'bg-red-50 border-red-300'
                              : 'bg-emerald-50 border-emerald-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {isIncorrect ? (
                              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-slate-900 mb-1">
                                Question {idx + 1}
                              </p>
                              <p className="text-sm text-slate-700 mb-2">
                                {q.questionText}
                              </p>
                              {isIncorrect && (
                                <p className="text-xs text-red-700 font-medium">
                                  Your answer: "{userAnswer?.selectedAnswer}"
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Attempt Number:</span>
                <span className="font-semibold text-slate-900">{attemptNumber}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Exit Quiz
              </button>
              {quizResult.isPerfectScore ? (
                <button
                  onClick={handleCompleteModule}
                  className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all"
                >
                  Complete Module
                </button>
              ) : (
                <button
                  onClick={handleRetryQuiz}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium shadow-lg shadow-violet-600/30 hover:shadow-xl transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 flex items-center justify-between text-white">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-violet-100 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Knowledge Check - Attempt #{attemptNumber}</span>
            </div>
            <h2 className="text-2xl font-bold">{moduleTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">
                  Perfect Score Required
                </h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  You must answer ALL {questions.length} questions correctly to complete this module.
                  Take your time and think carefully about each answer.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="flex gap-2">
                {questions.map((q, idx) => {
                  const hasAnswer = answers.some(a => a.questionId === q.id);
                  return (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentQuestion
                          ? 'bg-violet-600 w-6'
                          : hasAnswer
                          ? 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mb-6 leading-relaxed">
              {question.questionText}
            </h3>

            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = currentAnswer?.selectedAnswer === option;

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'bg-violet-50 border-violet-500 text-violet-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50/50'
                    } cursor-pointer`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Progress:</span>
              <span className="font-semibold text-slate-900">
                {answers.length} of {questions.length} answered
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Exit Quiz
            </button>
            {currentQuestion > 0 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border-2 border-violet-200 text-violet-700 bg-violet-50 rounded-xl font-medium hover:bg-violet-100 transition-colors"
              >
                Previous
              </button>
            )}
            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                disabled={!currentAnswer}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                  currentAnswer
                    ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/30 hover:shadow-xl'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={!allQuestionsAnswered}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                  allQuestionsAnswered
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 hover:shadow-xl'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
