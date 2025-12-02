import { CheckCircle2, Circle, Play, Clock } from 'lucide-react';
import { TrainingModule } from '../types';

interface ModuleCardProps {
  module: TrainingModule;
  onStart: (moduleId: string) => void;
}

export default function ModuleCard({ module, onStart }: ModuleCardProps) {
  const getStatusIcon = () => {
    if (module.status === 'completed') {
      return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
    } else if (module.status === 'in_progress') {
      return <Circle className="w-6 h-6 text-amber-500 fill-amber-100" />;
    }
    return <Circle className="w-6 h-6 text-slate-300" />;
  };

  const getStatusText = () => {
    if (module.status === 'completed') return 'Completed';
    if (module.status === 'in_progress') return 'In Progress';
    return 'Not Started';
  };

  const getButtonText = () => {
    if (module.status === 'completed') return 'Review Module';
    if (module.status === 'in_progress') return 'Continue';
    return 'Start Module';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">{getStatusIcon()}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">
                {module.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {module.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-4 h-4" />
              <span>{module.estimatedMinutes} min</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                module.status === 'completed'
                  ? 'bg-emerald-50 text-emerald-700'
                  : module.status === 'in_progress'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-50 text-slate-600'
              }`}>
                {getStatusText()}
              </span>
            </div>
          </div>

          <button
            onClick={() => onStart(module.id)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm hover:shadow group-hover:scale-105 transform duration-200"
          >
            <Play className="w-4 h-4" />
            {getButtonText()}
          </button>
        </div>

        {module.status === 'in_progress' && module.videoProgress > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
              <span>Video Progress</span>
              <span className="font-medium">{module.videoProgress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${module.videoProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
