import React from 'react';
import { EvidenceFeedbackItem } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlertCircle, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

export interface EvidenceCardProps {
  item: EvidenceFeedbackItem;
  onApplyAction?: (item: EvidenceFeedbackItem) => void;
  className?: string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  item,
  onApplyAction,
  className = ''
}) => {
  return (
    <Card variant="default" padding="md" className={`space-y-3.5 border-l-4 border-l-amber-500 ${className}`}>
      {/* Header: Problem Name */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="amber" size="sm">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span>Vấn đề nhận diện</span>
            </Badge>
            <span className="text-xs text-slate-400 font-mono">
              Subskill: {item.targetSubskill}
            </span>
          </div>
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
            {item.problem}
          </h4>
        </div>
      </div>

      {/* Actual Evidence Quote from Learner Essay/Response */}
      <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs sm:text-sm">
        <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
          Bằng chứng trích xuất từ bài của bạn:
        </span>
        <blockquote className="italic font-serif text-slate-800 border-l-2 border-amber-400 pl-2.5 my-1">
          "{item.evidence}"
        </blockquote>
      </div>

      {/* Why: Rubric explanation */}
      <div className="text-xs sm:text-sm text-slate-600 space-y-1">
        <strong className="text-slate-800 block text-xs uppercase tracking-wider">
          Tại sao bị trừ điểm theo Rubric?
        </strong>
        <p className="leading-relaxed">{item.why}</p>
      </div>

      {/* Suggested Correction */}
      {item.suggestedCorrection && (
        <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 text-xs sm:text-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Phương án viết lại tối ưu Band 7.5+:</span>
          </div>
          <p className="text-emerald-950 font-medium leading-relaxed font-serif pl-1">
            "{item.suggestedCorrection}"
          </p>
        </div>
      )}

      {/* Action / Next Short Exercise */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-slate-600">
          <strong className="text-slate-900">Hành động can thiệp: </strong>
          <span>{item.action}</span>
        </div>
        {onApplyAction && (
          <button
            onClick={() => onApplyAction(item)}
            className="flex-shrink-0 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-end"
          >
            <span>Luyện ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </Card>
  );
};
