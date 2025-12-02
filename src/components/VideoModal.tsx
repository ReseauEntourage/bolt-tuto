import { X, CheckCircle } from 'lucide-react';
import { TrainingModule } from '../types';
import { useEffect, useState } from 'react';

interface VideoModalProps {
  module: TrainingModule;
  onClose: () => void;
  onComplete: () => void;
}

export default function VideoModal({ module, onClose, onComplete }: VideoModalProps) {
  const [progress, setProgress] = useState(module.videoProgress);
  const [isCompleted, setIsCompleted] = useState(module.videoProgress >= 100);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsCompleted(true);
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-slideUp">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 flex items-center justify-between text-white flex-shrink-0">
          <div>
            <div className="text-sm text-teal-100 mb-1">Module {module.orderPosition}</div>
            <h2 className="text-2xl font-bold">{module.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden mb-6 relative">
            <iframe
              src={module.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={module.title}
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Video Progress</span>
              <span className="text-sm font-semibold text-teal-600">{progress}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {isCompleted && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 animate-slideUp">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-1">Video Complete!</h3>
                  <p className="text-sm text-emerald-700">
                    Great job! You're ready to take the knowledge check and move forward.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors bg-white"
            >
              Save Progress
            </button>
            <button
              onClick={onComplete}
              className="flex-1 px-6 py-3 rounded-xl font-medium transition-all bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/30 hover:shadow-xl"
            >
              Continue to Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
