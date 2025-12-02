import { Award, Heart } from 'lucide-react';
import { UserProgress } from '../types';

interface ProgressHeaderProps {
  progress: UserProgress;
  onViewCertificate?: () => void;
}

export default function ProgressHeader({ progress, onViewCertificate }: ProgressHeaderProps) {
  const completionPercentage = Math.round((progress.modulesCompleted / progress.totalModules) * 100);

  return (
    <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 rounded-3xl shadow-xl p-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-6 h-6 text-teal-100" />
            <span className="text-teal-100 font-medium text-sm uppercase tracking-wide">
              Your Training Journey
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome, Future Coach!
          </h1>
          <p className="text-teal-50 text-lg leading-relaxed max-w-2xl">
            You're on your way to making a real difference in someone's life. Complete these modules to join our community of compassionate mentors.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 min-w-[200px]">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-white/20"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="text-white transition-all duration-1000 ease-out"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionPercentage / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold">{completionPercentage}%</div>
                <div className="text-xs text-teal-100">Complete</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold mb-1">
              {progress.modulesCompleted} of {progress.totalModules}
            </div>
            <div className="text-sm text-teal-100">Modules Completed</div>
          </div>

          {progress.isCertified && (
            <button
              onClick={onViewCertificate}
              className="flex items-center gap-2 bg-white hover:bg-teal-50 text-teal-700 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-lg group"
            >
              <Award className="w-4 h-4 group-hover:scale-110 transition-transform" />
              View Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
