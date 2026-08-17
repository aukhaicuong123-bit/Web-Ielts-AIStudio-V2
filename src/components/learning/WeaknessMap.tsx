import React from 'react';
import { LearnerProfile, SubskillId } from '../../types';
import { SUBSKILLS_DICTIONARY } from '../../data/mockContent';
import { Card } from '../ui/Card';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ArrowRight,
  BookOpen, 
  PenTool, 
  Layers,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export interface WeaknessMapProps {
  profile: LearnerProfile;
  maxItems?: number;
  onIntervene?: (subskillId: SubskillId) => void;
  className?: string;
}

export const WeaknessMap: React.FC<WeaknessMapProps> = ({
  profile,
  maxItems = 6,
  onIntervene,
  className = ''
}) => {
  // Sort subskills by priority / lowest mastery
  const subskillEntries = Object.entries(profile.subskillMastery) as [SubskillId, number][];
  const sortedSubskills = [...subskillEntries].sort((a, b) => {
    // Check error count first
    const errA = profile.activeErrors.find((e) => e.subskill === a[0])?.count || 0;
    const errB = profile.activeErrors.find((e) => e.subskill === b[0])?.count || 0;
    if (errA !== errB) return errB - errA;
    return a[1] - b[1];
  }).slice(0, maxItems);

  const getTrendInfo = (subskillId: SubskillId, currentScore: number) => {
    const baseline = profile.baselineMastery[subskillId] || currentScore;
    const errorMatch = profile.activeErrors.find((e) => e.subskill === subskillId);
    const retestMatch = profile.reTestHistory.find((r) => r.subskill === subskillId);

    if (retestMatch && retestMatch.status === 'verified_progress') {
      return {
        label: 'Đang cải thiện',
        icon: <TrendingUp className="w-3 h-3 text-emerald-600" />,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
        evidence: `Đã xác minh qua Re-test (+${retestMatch.improvementDelta}%)`
      };
    }

    if (errorMatch && errorMatch.count > 0) {
      return {
        label: 'Cần chú ý',
        icon: <TrendingDown className="w-3 h-3 text-amber-600" />,
        color: 'text-amber-700 bg-amber-50 border-amber-200/80',
        evidence: `Phát hiện lặp lại ${errorMatch.count} lần gần đây`
      };
    }

    if (currentScore < 55) {
      return {
        label: 'Cần chú ý',
        icon: <TrendingDown className="w-3 h-3 text-amber-600" />,
        color: 'text-amber-700 bg-amber-50 border-amber-200/80',
        evidence: 'Dưới ngưỡng an toàn Band 6.0'
      };
    }

    if (currentScore > baseline + 5) {
      return {
        label: 'Đang cải thiện',
        icon: <TrendingUp className="w-3 h-3 text-emerald-600" />,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
        evidence: `Tăng +${currentScore - baseline}% so với chẩn đoán ban đầu`
      };
    }

    return {
      label: 'Ổn định',
      icon: <Minus className="w-3 h-3 text-slate-500" />,
      color: 'text-slate-700 bg-slate-100 border-slate-200',
      evidence: 'Hiệu suất duy trì ổn định'
    };
  };

  const getSkillBadge = (subskillId: SubskillId) => {
    if (subskillId.startsWith('reading')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
          <BookOpen className="w-3 h-3 text-indigo-600" />
          Reading
        </span>
      );
    }
    if (subskillId.startsWith('writing')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
          <PenTool className="w-3 h-3 text-emerald-600" />
          Writing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
        <Layers className="w-3 h-3 text-purple-600" />
        Cross-Skill
      </span>
    );
  };

  return (
    <div id="weakness-map-container" className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Bản đồ điểm nghẽn hiện tại ({sortedSubskills.length} subskills ưu tiên)
          </h3>
          <p className="text-xs text-slate-500">
            Xếp hạng theo tần suất lỗi phát hiện và khoảng cách so với chuẩn mục tiêu.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {sortedSubskills.map(([subskillId, score]) => {
          const info = SUBSKILLS_DICTIONARY[subskillId] || {
            id: subskillId,
            name: subskillId,
            skill: 'reading' as const,
            description: '',
            targetWeakness: 'Điểm nghẽn năng lực'
          };
          const trend = getTrendInfo(subskillId, score);

          return (
            <div
              key={subskillId}
              id={`weakness-row-${subskillId}`}
              className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Left Details */}
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getSkillBadge(subskillId)}
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {info.name}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${trend.color}`}>
                    {trend.icon}
                    <span>{trend.label}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>
                    Bằng chứng: <strong className="text-slate-700 font-medium">{trend.evidence}</strong>
                  </span>
                </div>
              </div>

              {/* Right: Mastery Bar & Action */}
              <div className="flex items-center gap-4 sm:flex-shrink-0">
                <div className="w-28 sm:w-32 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Độ thuần thục</span>
                    <span className="font-mono font-bold text-slate-800">{score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        score >= 70 ? 'bg-emerald-600' : score >= 55 ? 'bg-indigo-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                    />
                  </div>
                </div>

                {onIntervene && (
                  <button
                    onClick={() => onIntervene(subskillId)}
                    className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition flex items-center gap-1"
                  >
                    <span>Luyện</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
