import React from 'react';
import { ErrorTag, ErrorSeverity } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlertTriangle, Clock, RotateCcw } from 'lucide-react';

export interface ErrorPatternCardProps {
  error: ErrorTag;
  onIntervene?: (subskillId: string) => void;
  className?: string;
}

export const ErrorPatternCard: React.FC<ErrorPatternCardProps> = ({
  error,
  onIntervene,
  className = ''
}) => {
  const severityConfig: Record<ErrorSeverity, { variant: 'rose' | 'amber' | 'slate'; label: string }> = {
    high: { variant: 'rose', label: 'Tác động cao' },
    medium: { variant: 'amber', label: 'Tác động trung bình' },
    low: { variant: 'slate', label: 'Tác động nhẹ' }
  };

  const conf = severityConfig[error.severity] || severityConfig.medium;

  return (
    <Card variant="default" padding="sm" className={`flex flex-col justify-between gap-3 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={conf.variant} size="sm">
            {conf.label}
          </Badge>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Lặp lại {error.count} lần
          </span>
        </div>

        <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
          {error.name}
        </h4>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="w-3 h-3" />
          <span>Gặp gần nhất: {error.lastEncountered}</span>
        </div>
      </div>

      {onIntervene && (
        <button
          onClick={() => onIntervene(error.subskill)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 py-1.5 px-3 rounded-lg transition flex items-center justify-center gap-1.5 w-full mt-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Can thiệp triệt tiêu lỗi</span>
        </button>
      )}
    </Card>
  );
};
