import { useState, useEffect } from 'react';
import { Users, BookOpen } from 'lucide-react';
import ProgressHeader from './components/ProgressHeader';
import ModuleCard from './components/ModuleCard';
import VideoModal from './components/VideoModal';
import QuizModal from './components/QuizModal';
import CertificationModal from './components/CertificationModal';
import BadgeDisplay from './components/BadgeDisplay';
import BadgeNotification from './components/BadgeNotification';
import { TrainingModule, UserProgress } from './types';
import { TRAINING_MODULES, QUIZ_QUESTIONS } from './data/mockData';

function App() {
  const [modules, setModules] = useState<TrainingModule[]>(TRAINING_MODULES);
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCertification, setShowCertification] = useState(false);
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [previousCompletedCount, setPreviousCompletedCount] = useState(0);

  const calculateProgress = (): UserProgress => {
    const completed = modules.filter(m => m.status === 'completed').length;
    return {
      modulesCompleted: completed,
      totalModules: modules.length,
      overallCompletion: (completed / modules.length) * 100,
      isCertified: completed === modules.length,
    };
  };

  const progress = calculateProgress();

  const handleStartModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      setActiveModule(module);
      setShowVideo(true);

      if (module.status === 'not_started') {
        updateModuleStatus(moduleId, 'in_progress');
      }
    }
  };

  const updateModuleStatus = (moduleId: string, status: TrainingModule['status']) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, status } : m
    ));
  };

  const updateModuleProgress = (moduleId: string, videoProgress: number) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, videoProgress } : m
    ));
  };

  const handleVideoComplete = () => {
    if (activeModule) {
      updateModuleProgress(activeModule.id, 100);
      setShowVideo(false);
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = (passed: boolean) => {
    if (activeModule && passed) {
      const updatedModules = modules.map(m =>
        m.id === activeModule.id
          ? { ...m, status: 'completed' as const, quizCompleted: true, videoProgress: 100 }
          : m
      );

      setModules(updatedModules);
      setShowQuiz(false);
      setActiveModule(null);

      const completedCount = updatedModules.filter(m => m.status === 'completed').length;
      if (completedCount === updatedModules.length) {
        setTimeout(() => {
          setShowBadgeNotification(true);
        }, 500);
      }
    }
  };

  useEffect(() => {
    const completedCount = modules.filter(m => m.status === 'completed').length;

    if (completedCount === modules.length && completedCount > previousCompletedCount) {
      setTimeout(() => {
        setShowBadgeNotification(true);
      }, 800);
    }

    setPreviousCompletedCount(completedCount);
  }, [modules]);

  const handleQuizRetry = () => {
    if (activeModule) {
      setModules(prev => prev.map(m =>
        m.id === activeModule.id ? { ...m, quizAttempts: m.quizAttempts + 1 } : m
      ));
    }
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
    setActiveModule(null);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    setActiveModule(null);
  };

  const handleStartCoaching = () => {
    setShowCertification(false);
    alert('Welcome to the coaching platform! This is where you would be matched with your first candidate.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Entourage Pro</h1>
                <p className="text-xs text-slate-600">Coach Training Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <BookOpen className="w-4 h-4" />
              <span>Training in Progress</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ProgressHeader
          progress={progress}
          onViewCertificate={() => setShowBadgeModal(true)}
        />

        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Training Modules</h2>
              <p className="text-slate-600">
                Complete all modules to earn your certification and start coaching
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onStart={handleStartModule}
              />
            ))}
          </div>
        </div>

        {progress.isCertified && !showCertification && (
          <div className="mt-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 text-white text-center shadow-xl">
            <h3 className="text-2xl font-bold mb-3">
              🎉 You've Completed All Modules!
            </h3>
            <p className="text-teal-50 mb-6">
              Click below to view your certification and start your coaching journey
            </p>
            <button
              onClick={() => setShowCertification(true)}
              className="px-8 py-3 bg-white text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-colors shadow-lg"
            >
              View My Certification
            </button>
          </div>
        )}

        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Need Help?</h3>
          <p className="text-slate-600 mb-6">
            Our support team is here to assist you throughout your training journey.
            Don't hesitate to reach out if you have questions or need guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:support@entouragepro.org"
              className="inline-flex items-center justify-center px-6 py-3 bg-teal-50 text-teal-700 rounded-lg font-medium hover:bg-teal-100 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              View Resources
            </a>
          </div>
        </div>
      </main>

      {showVideo && activeModule && (
        <VideoModal
          module={activeModule}
          onClose={handleCloseVideo}
          onComplete={handleVideoComplete}
        />
      )}

      {showQuiz && activeModule && (
        <QuizModal
          moduleTitle={activeModule.title}
          questions={QUIZ_QUESTIONS[activeModule.id] || []}
          attemptNumber={activeModule.quizAttempts + 1}
          onClose={handleCloseQuiz}
          onComplete={handleQuizComplete}
          onRetry={handleQuizRetry}
        />
      )}

      {showCertification && (
        <CertificationModal
          userName="Future Coach"
          onStartCoaching={handleStartCoaching}
        />
      )}

      <BadgeNotification
        show={showBadgeNotification}
        onView={() => {
          setShowBadgeNotification(false);
          setShowBadgeModal(true);
        }}
        onDismiss={() => setShowBadgeNotification(false)}
      />

      {showBadgeModal && progress.isCertified && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <BadgeDisplay
              certification={{
                id: '1',
                badgeTitle: 'Certified Coach',
                badgeDescription: 'Successfully completed all training modules with perfect quiz scores',
                issuedAt: new Date(),
                verificationHash: 'abc123def456',
                badgeData: {
                  modules_completed: modules.length,
                  total_modules: modules.length,
                  completion_date: new Date()
                }
              }}
              showVerification={true}
              allowDownload={true}
            />
            <button
              onClick={() => setShowBadgeModal(false)}
              className="mt-4 w-full px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
