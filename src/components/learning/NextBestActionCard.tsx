import React from 'react';
import { NextBestAction } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Zap, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen,
  PenTool,
  Layers,
  ShieldAlert
} from 'lucide-react';

export interface NextBestActionCardProps {
  action: NextBestAction;
  onStart: (action: NextBestAction) => void;
  ctaText?: string;
  ctaSubtext?: string;
  showReasonsByDefault?: boolean;
  className?: string;
}

export const NextBestActionCard: React.FC<NextBestActionCardProps> = ({
  action,
  onStart,
  ctaText,
  ctaSubtext,
  showReasonsByDefault = true,
  className = ''
}) => {
  const getSkillIcon = (subskill: string) => {
    if (subskill.startsWith('reading')) return <BookOpen className="w-3.5 h-3.5" />;
    if (subskill.startsWith('writing')) return <PenTool className="w-3.5 h-3.5" />;
    return <Layers className="w-3.5 h-3.5" />;
  };

  const getSkillLabel = (subskill: string) => {
    if (subskill.startsWith('reading')) return 'Reading Academic';
    if (subskill.startsWith('writing')) return 'Writing Task 2';
    return 'Cross-Skill';
  };

  const isDiagnostic = action.type === 'diagnostic';

  return (
    <Card 
      id="next-best-action-card" 
      variant="default" 
      padding="none" 
      className={`overflow-hidden border border-slate-200 bg-white shadow-xs rounded-xl ${className}`}
    >
      {/* Top Header Strip */}
      <div className="border-b border-slate-100 bg-slate-50/70 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-bold tracking-wide uppercase">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Next Best Action</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              {getSkillIcon(action.targetSubskill)}
              <span>{getSkillLabel(action.targetSubskill)}</span>
            </span>
            {action.urgency === 'high' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                <ShieldAlert className="w-3 h-3 text-amber-600" />
                <span>Ưu tiên can thiệp cao</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Thời lượng dự kiến: <strong className="text-slate-900">{action.estimatedMinutes} phút</strong></span>
          </div>
        </div>

        {/* Title & Target Subskill */}
        <div className="mt-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
            Điểm nghẽn mục tiêu: {action.targetSubskillName}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {action.title}
          </h2>
          {action.evidenceContext && (
            <p className="text-xs text-slate-500 pt-0.5">
              Bối cảnh: <span className="text-slate-700 font-medium">{action.evidenceContext}</span>
            </p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Why this was selected */}
        {showReasonsByDefault && action.reasons && action.reasons.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Tại sao hệ thống đề xuất bài này?</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-1">
              {action.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expected Outcome */}
        {action.expectedOutcome && (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-slate-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-slate-900 block mb-0.5">
                Mục tiêu đầu ra của phiên:
              </span>
              <p className="text-slate-600 leading-relaxed">
                {action.expectedOutcome}
              </p>
            </div>
          </div>
        )}

        {/* Action Button & Note */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            {ctaSubtext || 'Hệ thống sẽ dẫn dắt từng bước và đối chứng kết quả sau khi hoàn thành.'}
          </span>

          <Button
            id="start-next-best-action-btn"
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => onStart(action)}
            className="w-full sm:w-auto font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
          >
            {ctaText || (isDiagnostic ? 'Bắt đầu bài chẩn đoán 10 phút' : `Bắt đầu phiên học (${action.estimatedMinutes} phút)`)}
          </Button>
        </div>
      </div>
    </Card>
  );
};
