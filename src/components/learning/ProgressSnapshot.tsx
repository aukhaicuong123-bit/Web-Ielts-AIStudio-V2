import React from 'react';
import { LearnerProfile, SubskillId } from '../../types';
import { SUBSKILLS_DICTIONARY } from '../../data/mockContent';
import { Card } from '../ui/Card';
import { 
  CheckCircle2, 
  TrendingUp, 
  Info, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export interface ProgressSnapshotProps {
  profile: LearnerProfile;
  onNavigateToProgress?: () => void;
  className?: string;
}

export const ProgressSnapshot: React.FC<ProgressSnapshotProps> = ({
  profile,
  onNavigateToProgress,
  className = ''
}) => {
  const verifiedRetests = profile.reTestHistory;

  return (
    <div id="progress-snapshot-section" className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Điểm nghẽn có đang cải thiện không? (Evidence of Progress)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Dữ liệu đối chứng trước và sau các phiên can thiệp ngắn.
          </p>
        </div>

        {onNavigateToProgress && verifiedRetests.length > 0 && (
          <button
            onClick={onNavigateToProgress}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            <span>Tất cả biên bản</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
        )}
      </div>

      {verifiedRetests.length === 0 ? (
        <div className="p-5 bg-white border border-slate-200 rounded-xl text-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            Chưa có đủ dữ liệu Re-test đối chứng
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Sau khi hoàn thành phiên học can thiệp (Micro-Pathway), hệ thống sẽ cung cấp bài kiểm tra đối chứng 5 phút để xác minh sự cải thiện thực chất.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {verifiedRetests.map((retest) => {
            const subskillInfo = SUBSKILLS_DICTIONARY[retest.subskill] || {
              name: retest.subskill,
              skill: 'reading'
            };
            const isPositive = retest.improvementDelta > 0;

            return (
              <div
                key={retest.id}
                id={`retest-proof-${retest.id}`}
                className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                      Biên bản Re-Test đã kiểm chứng
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                      {subskillInfo.name}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-600 font-mono">
                    {retest.timestamp}
                  </span>
                </div>

                {/* Score Before / After Row */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 uppercase block font-medium">Trước can thiệp</span>
                    <span className="text-base font-bold font-mono text-slate-700">
                      {retest.scoreBefore}%
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isPositive ? `+${retest.improvementDelta}%` : `${retest.improvementDelta}%`}</span>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 uppercase block font-medium">Sau Re-Test</span>
                    <span className="text-base font-bold font-mono text-emerald-700">
                      {retest.scoreAfter}%
                    </span>
                  </div>
                </div>

                {/* Evidence Summary Quote */}
                <p className="text-xs text-slate-600 leading-relaxed italic pl-2 border-l-2 border-slate-300">
                  "{retest.evidenceSummary}"
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
