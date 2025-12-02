import { Award, X, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BadgeNotificationProps {
  show: boolean;
  onView: () => void;
  onDismiss: () => void;
}

export default function BadgeNotification({
  show,
  onView,
  onDismiss
}: BadgeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <div
        className={`pointer-events-auto max-w-md w-full bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 rounded-2xl shadow-2xl transform transition-all duration-500 ${
          isVisible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-95'
        }`}
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />

          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full animate-pulse" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-40 h-40 bg-white/10 rounded-full animate-pulse delay-300" />

          <div className="relative p-6">
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-4 ring-white/30">
                <Award className="w-9 h-9 text-white animate-bounce" />
              </div>

              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                  <h3 className="text-xl font-bold text-white">
                    Congratulations!
                  </h3>
                </div>
                <p className="text-teal-50 text-sm leading-relaxed">
                  You've completed all training modules and earned your{' '}
                  <span className="font-semibold text-white">Certified Coach</span>{' '}
                  badge!
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onView}
                className="flex-1 px-6 py-3 bg-white hover:bg-teal-50 text-teal-700 rounded-xl font-semibold transition-colors shadow-lg"
              >
                View Certificate
              </button>
              <button
                onClick={onDismiss}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
