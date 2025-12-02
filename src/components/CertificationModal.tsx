import { Award, Sparkles, ArrowRight, Download, Share2 } from 'lucide-react';

interface CertificationModalProps {
  userName?: string;
  onStartCoaching: () => void;
}

export default function CertificationModal({ userName = 'Coach', onStartCoaching }: CertificationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-white via-white to-amber-50 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-celebrationPop">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-emerald-500 to-amber-500 opacity-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
            <div className="absolute top-10 left-1/4 animate-float">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div className="absolute top-20 right-1/4 animate-float" style={{ animationDelay: '0.5s' }}>
              <Sparkles className="w-4 h-4 text-teal-400" />
            </div>
            <div className="absolute bottom-32 left-1/3 animate-float" style={{ animationDelay: '1s' }}>
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div className="relative p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full shadow-2xl shadow-amber-500/50 mb-6 animate-bounce">
              <Award className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Congratulations! 🎉
            </h1>
            <p className="text-xl text-slate-700 mb-8 leading-relaxed max-w-lg mx-auto">
              You're now a <span className="font-bold text-teal-600">Certified Entourage Pro Coach</span>!
              You've completed your training and are ready to make a meaningful impact.
            </p>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-amber-200">
              <div className="text-sm text-slate-600 mb-3 uppercase tracking-wider">Certificate of Completion</div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {userName}
              </div>
              <div className="text-slate-600 mb-4">
                Has successfully completed the Entourage Pro Coach Training Program
              </div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-2 rounded-full font-semibold">
                <Award className="w-5 h-5" />
                Certified Coach
              </div>
              <div className="mt-6 text-sm text-slate-500">
                Issued on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 mb-8 text-left border border-teal-200">
              <h3 className="font-semibold text-teal-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                What This Means
              </h3>
              <ul className="space-y-2 text-sm text-teal-800">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>You're equipped to guide candidates through their journey with empathy and insight</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>You're part of a supportive community dedicated to creating positive change</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>You have access to ongoing resources and support from the Entourage Pro team</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                Download Certificate
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-teal-200 text-teal-700 bg-teal-50 rounded-xl font-medium hover:bg-teal-100 transition-colors">
                <Share2 className="w-4 h-4" />
                Share Achievement
              </button>
            </div>

            <button
              onClick={onStartCoaching}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg shadow-lg shadow-teal-600/30 hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Mentoring Your First Candidate
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
