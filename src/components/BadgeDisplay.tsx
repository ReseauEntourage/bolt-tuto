import { Award, CheckCircle, Download, Share2 } from 'lucide-react';

interface Certification {
  id: string;
  badgeTitle: string;
  badgeDescription: string;
  issuedAt: Date;
  verificationHash: string;
  badgeData: {
    modules_completed: number;
    total_modules: number;
    completion_date: Date;
  };
}

interface BadgeDisplayProps {
  certification: Certification;
  showVerification?: boolean;
  allowDownload?: boolean;
  compact?: boolean;
}

export default function BadgeDisplay({
  certification,
  showVerification = true,
  allowDownload = true,
  compact = false
}: BadgeDisplayProps) {
  const handleDownload = () => {
    console.log('Download certificate');
  };

  const handleShare = () => {
    console.log('Share badge');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-full px-4 py-2">
        <Award className="w-5 h-5 text-teal-600" />
        <span className="text-sm font-semibold text-teal-900">Certified Coach</span>
        <CheckCircle className="w-4 h-4 text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-teal-100 overflow-hidden">
      <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 ring-4 ring-white/30 animate-pulse">
            <Award className="w-14 h-14" />
          </div>

          <h2 className="text-3xl font-bold mb-2">{certification.badgeTitle}</h2>
          <p className="text-teal-100 max-w-md">{certification.badgeDescription}</p>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="text-3xl font-bold text-teal-600 mb-1">
              {certification.badgeData.modules_completed}
            </div>
            <div className="text-sm text-slate-600">Modules Completed</div>
          </div>

          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="text-3xl font-bold text-emerald-600 mb-1">100%</div>
            <div className="text-sm text-slate-600">Perfect Scores</div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Issue Date</span>
            <span className="font-semibold text-slate-900">
              {formatDate(certification.issuedAt)}
            </span>
          </div>

          {showVerification && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Verification</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-xs text-slate-500">
                  {certification.verificationHash.substring(0, 12)}...
                </span>
              </div>
            </div>
          )}
        </div>

        {allowDownload && (
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Certificate
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
