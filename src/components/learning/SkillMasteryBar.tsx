import React from 'react';
import { SubskillId, SubskillInfo } from '../../types';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';

export interface SkillMasteryBarProps {
  subskillId: SubskillId;
  info: SubskillInfo;
  mastery: number; // 0 to 100
  baselineMastery: number;
  confidence?: 'insufficient_data' | 'low' | 'medium' | 'high';
  className?: string;
}

export const SkillMasteryBar: React.FC<SkillMasteryBarProps> = ({
  subskillId,
  info,
  mastery,
  baselineMastery,
  confidence = 'medium',
  className = ''
}) => {
  const delta = mastery - baselineMastery;

  return (
    <div className={`space-y-1.5 p-3 rounded-lg border border-slate-100 bg-slate-50/50 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">{info.name}</span>
          <Badge variant={info.skill === 'reading' ? 'indigo' : 'emerald'} size="sm">
            {info.skill}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px]">
            Baseline: {baselineMastery}%
          </span>
          <span className="font-bold text-slate-900 font-mono text-sm">
            {mastery}%
          </span>
          {delta !== 0 && (
            <span className={`text-[11px] font-bold ${delta > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
              {delta > 0 ? `+${delta}%` : `${delta}%`}
            </span>
          )}
        </div>
      </div>

      <Progress
        value={mastery}
        variant={mastery >= 70 ? 'emerald' : mastery >= 50 ? 'indigo' : 'amber'}
        size="sm"
      />
    </div>
  );
};
