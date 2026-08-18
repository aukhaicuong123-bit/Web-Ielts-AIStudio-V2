import React from 'react';
import { MicroPathway, PathwayStep } from '../../types';
import { Card } from '../ui/Card';
import { 
  BookOpen, 
  PenTool, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  Layers,
  Sparkles
} from 'lucide-react';

export interface MicroSessionBreakdownProps {
  pathway: MicroPathway;
  sessionMinutes?: number;
  className?: string;
}

export const MicroSessionBreakdown: React.FC<MicroSessionBreakdownProps> = ({
  pathway,
  sessionMinutes,
  className = ''
}) => {
  const effectiveMinutes = sessionMinutes ?? pathway.durationMinutes;
  const getStepTypeBadge = (type: PathwayStep['type']) => {
    switch (type) {
      case 'reading_drill':
        return {
          label: 'Nhận diện & Bóc tách',
          icon: <BookOpen className="w-3 h-3 text-indigo-600" />,
          color: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        };
      case 'vocab_transform':
        return {
          label: 'Chuyển hóa cấu trúc / từ vựng',
          icon: <Layers className="w-3 h-3 text-purple-600" />,
          color: 'bg-purple-50 text-purple-700 border-purple-200/80',
        };
      case 'writing_application':
        return {
          label: 'Ứng dụng vào Writing thực tế',
          icon: <PenTool className="w-3 h-3 text-emerald-600" />,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        };
      case 'retest':
        return {
          label: 'Xác minh qua Re-Test đối chứng',
          icon: <CheckCircle2 className="w-3 h-3 text-amber-600" />,
          color: 'bg-amber-50 text-amber-700 border-amber-200/80',
        };
      default:
        return {
          label: 'Luyện tập',
          icon: <Clock className="w-3 h-3 text-slate-600" />,
          color: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <div id="micro-session-breakdown" className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Cấu trúc phiên học hôm nay ({pathway.steps.length} bước liền mạch)
          </h3>
          <p className="text-xs text-slate-500">
            Mô hình học tập khép kín từ nhận diện lỗi tới chuyển hóa sang văn bản viết và đối chứng Re-Test.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
         Tổng: {effectiveMinutes} phút
        </span>
      </div>

      <div className="space-y-2.5">
        {pathway.steps.map((step, idx) => {
          const typeBadge = getStepTypeBadge(step.type);
          const baseStepMinutes = Math.floor(
  effectiveMinutes / pathway.steps.length
);
const remainderMinutes =
  effectiveMinutes % pathway.steps.length;

const stepMinutes =
  baseStepMinutes + (idx < remainderMinutes ? 1 : 0);

          return (
            <div
              key={step.stepNumber || idx}
              id={`pathway-step-${step.stepNumber || idx + 1}`}
              className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-start justify-between gap-3 relative"
            >
              <div className="flex items-start gap-3 min-w-0">
                {/* Step Number Circle */}
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step.stepNumber || idx + 1}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {step.title}
                    </h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${typeBadge.color}`}>
                      {typeBadge.icon}
                      <span>{typeBadge.label}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.instruction}
                  </p>
                </div>
              </div>

              {/* Time pill */}
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200/80 sm:flex-shrink-0 self-start">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{stepMinutes} phút</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
