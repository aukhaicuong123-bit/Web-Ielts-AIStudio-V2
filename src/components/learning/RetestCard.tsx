import React from 'react';
import { ReTestResult } from '../../types';
import { SUBSKILLS_DICTIONARY } from '../../data/mockContent';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, AlertCircle, TrendingUp, Clock } from 'lucide-react';

export interface RetestCardProps {
  retest: ReTestResult;
  className?: string;
}

export const RetestCard: React.FC<RetestCardProps> = ({ retest, className = '' }) => {
  const isVerified = retest.status === 'verified_progress';
  const subskillInfo = SUBSKILLS_DICTIONARY[retest.subskill];
  const delta = retest.scoreAfter - retest.scoreBefore;

  return (
    <Card variant="default" padding="md" className={`space-y-3 ${isVerified ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-amber-500'} ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={isVerified ? 'emerald' : 'amber'} size="md">
            {isVerified ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>{isVerified ? 'Đã kiểm chứng tiến bộ' : 'Cần củng cố thêm'}</span>
          </Badge>
          <span className="font-bold text-slate-800 text-sm">
            {subskillInfo?.name || retest.subskill}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{retest.timestamp}</span>
        </div>
      </div>

      {/* Delta Metric Block */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Trước can thiệp:</span>
            <strong className="text-slate-700 text-sm">{retest.scoreBefore}%</strong>
          </div>
          <span className="text-slate-300 text-lg">➔</span>
          <div>
            <span className="text-slate-400 block text-[11px]">Sau Re-test:</span>
            <strong className="text-slate-900 text-sm">{retest.scoreAfter}%</strong>
          </div>
        </div>

        <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
          <TrendingUp className="w-4 h-4" />
          <span>+{Math.max(0, delta)}%</span>
        </div>
      </div>

      {/* Evidence Summary Text */}
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        {retest.evidenceSummary}
      </p>
    </Card>
  );
};
