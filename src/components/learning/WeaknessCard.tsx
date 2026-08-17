import React from 'react';
import { SubskillId, SubskillInfo } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { AlertTriangle, TrendingUp } from 'lucide-react';

export interface WeaknessCardProps {
  subskillId: SubskillId;
  info: SubskillInfo;
  mastery: number; // 0 to 100
  baselineMastery?: number;
  errorCount?: number;
  onIntervene?: (subskillId: SubskillId) => void;
}

export const WeaknessCard: React.FC<WeaknessCardProps> = ({
  subskillId,
  info,
  mastery,
  baselineMastery = 50,
  errorCount = 0,
  onIntervene
}) => {
  const isSevere = mastery < 55;
  const delta = mastery - baselineMastery;

  return (
    <Card variant="default" padding="sm" className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={info.skill === 'reading' ? 'indigo' : 'emerald'} size="sm">
              {info.skill.toUpperCase()}
            </Badge>
            {errorCount > 0 && (
              <Badge variant="rose" size="sm">
                {errorCount} lỗi phát hiện
              </Badge>
            )}
          </div>
          <h4 className="font-bold text-sm text-slate-900">{info.name}</h4>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-lg font-black text-slate-900 font-mono">{mastery}%</span>
          <span className="text-[10px] text-slate-400 block font-medium">Mastery</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        {info.targetWeakness}
      </p>

      <div className="space-y-1">
        <Progress value={mastery} variant={isSevere ? 'amber' : 'indigo'} size="sm" />
        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <span>Baseline: {baselineMastery}%</span>
          {delta !== 0 && (
            <span className={delta > 0 ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
              {delta > 0 ? `+${delta}%` : `${delta}%`}
            </span>
          )}
        </div>
      </div>

      {onIntervene && (
        <button
          onClick={() => onIntervene(subskillId)}
          className="w-full text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-lg transition"
        >
          Luyện tập can thiệp kỹ năng này ➔
        </button>
      )}
    </Card>
  );
};
