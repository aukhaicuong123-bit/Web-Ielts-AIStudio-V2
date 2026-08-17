import React from 'react';
import { 
  Flame, 
  Clock, 
  Target, 
  Menu, 
  Zap, 
  AlertCircle, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { LearnerProfile } from '../../types';
import { AppRoute } from '../../types/routes';

export interface HeaderProps {
  profile: LearnerProfile;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  currentRoute,
  onNavigate,
  onOpenMobileMenu
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-xs">
      {/* Mobile Hamburger & Brand for Mobile */}
      <div className="flex items-center gap-3 lg:hidden">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg text-white font-bold text-xs flex items-center justify-center">
            V2
          </div>
          <span className="font-bold text-sm text-slate-900">AI IELTS Optimizer</span>
        </div>
      </div>

      {/* Center/Left Desktop Breadcrumb / Status */}
      <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 font-medium">
        <span className="text-slate-400">Chu trình học khép kín:</span>
        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
          Chẩn đoán ➔ Xác định điểm nghẽn ➔ Can thiệp ➔ Re-test đối chứng
        </span>
      </div>

      {/* Right Metric Quick Indicators */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg text-amber-900 text-xs font-semibold">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{profile.streakDays} ngày streak</span>
        </div>

        {/* Today's Study Time */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>{profile.minutesStudiedToday}/{profile.dailyGoalMinutes} phút</span>
        </div>

        {/* AI Estimate vs Target Band */}
        <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg text-indigo-900 text-xs font-semibold">
          <Target className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            {profile.aiEvidenceEstimate ? (
              <>Ước lượng: <strong>Band {profile.aiEvidenceEstimate.toFixed(1)}</strong></>
            ) : profile.previousOfficialScore ? (
              <>Official: <strong>Band {profile.previousOfficialScore.toFixed(1)}</strong></>
            ) : (
              <>Trình độ: <strong>Chưa kiểm tra</strong></>
            )}
          </span>
          <span className="text-indigo-300 font-light">➔</span>
          <span className="text-indigo-600 font-bold">Mục tiêu {profile.targetBand.toFixed(1)}</span>
        </div>
      </div>
    </header>
  );
};
