import React from 'react';
import { LearnerProfile, NextBestAction, SubskillId } from '../types';
import { SUBSKILLS_DICTIONARY } from '../data/mockContent';
import { NextBestActionCard } from './learning/NextBestActionCard';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  ArrowRight, 
  Sparkles, 
  BrainCircuit, 
  BookOpen, 
  PenTool, 
  ShieldCheck,
  RotateCcw,
  Info
} from 'lucide-react';

export interface DiagnosticResultData {
  completedAt: string;
  estimatedBand: number;
  confidenceLevel: 'High confidence' | 'Moderate confidence' | 'Limited evidence';
  strongestSignals: string[];
  needsAttention: string[];
  recurringErrorPatterns: {
    code: string;
    name: string;
    sampleQuote?: string;
    explanation: string;
  }[];
  highestImpactWeakness: {
    subskillId: SubskillId;
    subskillName: string;
    reason: string;
  };
  subskillScores: Record<string, number>;
  nextBestAction: NextBestAction;
}

export interface DiagnosticResultsViewProps {
  resultData: DiagnosticResultData;
  profile: LearnerProfile;
  onNavigateToToday: () => void;
  onRetakeDiagnostic?: () => void;
  className?: string;
}

export const DiagnosticResultsView: React.FC<DiagnosticResultsViewProps> = ({
  resultData,
  profile,
  onNavigateToToday,
  onRetakeDiagnostic,
  className = ''
}) => {
  const {
    estimatedBand,
    confidenceLevel,
    strongestSignals,
    needsAttention,
    recurringErrorPatterns,
    highestImpactWeakness,
    subskillScores,
    nextBestAction
  } = resultData;

  const getConfidenceBadge = (level: string) => {
    switch (level) {
      case 'High confidence':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Moderate confidence':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div id="diagnostic-results-view" className={`space-y-6 max-w-5xl mx-auto pb-8 ${className}`}>
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-bold tracking-wide uppercase">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
              <span>Diagnostic Report</span>
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-semibold ${getConfidenceBadge(confidenceLevel)}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Độ tin cậy: {confidenceLevel === 'Moderate confidence' ? 'Đủ bằng chứng (Moderate)' : confidenceLevel === 'High confidence' ? 'Độ tin cậy cao' : 'Bằng chứng giới hạn'}</span>
            </span>
          </div>

          {onRetakeDiagnostic && (
            <button
              onClick={onRetakeDiagnostic}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Làm lại khảo sát</span>
            </button>
          )}
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kết Quả Chẩn Đoán Điểm Nghẽn Học Thuật
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-3xl">
            Hệ thống đã phân tích 3 câu Reading học thuật và 1 bài viết Writing để bóc tách chính xác điểm nghẽn có tỷ lệ mất điểm cao nhất của bạn.
          </p>
        </div>
      </div>

      {/* 1. WHAT WE LEARNED ABOUT YOU: 3-Column Structured Diagnosis */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            1. Bức tranh năng lực phát hiện được (Diagnostic Findings)
          </h2>
          <p className="text-xs text-slate-500">
            Đối chiếu bằng chứng từ câu trả lời của bạn với ngân hàng mẫu lỗi chuẩn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strongest Signals */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Điểm mạnh đã quan sát được</span>
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {strongestSignals.map((sig, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{sig}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Needs Attention */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Điểm cần can thiệp ưu tiên</span>
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {needsAttention.map((att, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 flex-shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{att}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recurring Error Pattern with Excerpt */}
        {recurringErrorPatterns.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
              Mẫu lỗi cốt lõi được ghi nhận: {recurringErrorPatterns[0].name}
            </span>
            <p className="text-xs text-amber-800 leading-relaxed">
              {recurringErrorPatterns[0].explanation}
            </p>
            {recurringErrorPatterns[0].sampleQuote && (
              <p className="text-[11px] font-mono text-amber-900 bg-white/80 p-2.5 rounded border border-amber-200 italic">
                "{recurringErrorPatterns[0].sampleQuote}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* 2. HIGHEST-IMPACT WEAKNESS & WHY */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          2. Điểm nghẽn có tác động lớn nhất (Highest-Impact Weakness)
        </span>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-slate-900">
                {highestImpactWeakness.subskillName}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                Ưu tiên số 1
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lý do ưu tiên: <strong className="text-slate-800">{highestImpactWeakness.reason}</strong>
            </p>
          </div>

          <div className="text-right sm:flex-shrink-0">
            <span className="text-[11px] text-slate-500 block">Trọng số rủi ro điểm</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
              Chiếm ~60% rủi ro mất điểm
            </span>
          </div>
        </div>
      </div>

      {/* 3. YOUR NEXT BEST ACTION (Engine derived) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            3. Khuyến nghị can thiệp kế tiếp (Next Best Action)
          </span>
          <span className="text-xs text-slate-500">
            Được tính toán bởi LearningEngine
          </span>
        </div>

        <NextBestActionCard
          action={nextBestAction}
          onStart={onNavigateToToday}
          ctaText="Bắt đầu phiên học can thiệp hôm nay (20 phút)"
          ctaSubtext="Hệ thống sẽ dẫn dắt từng bước để triệt tiêu điểm nghẽn này."
        />
      </div>

      {/* 4. SUPPORTING SUBSKILL MASTERY BREAKDOWN */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900">
          4. Chi tiết độ thuần thục Subskill sau bài chẩn đoán
        </h3>

        <div className="space-y-3">
          {Object.entries(subskillScores).map(([name, val]) => {
            const score = Number(val) || 0;
            return (
              <div key={name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{name}</span>
                  <span className="font-mono font-bold text-slate-900">{score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      score >= 70 ? 'bg-emerald-600' : score >= 55 ? 'bg-indigo-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. AI / EVIDENCE ESTIMATE BAND (Disclaimer clear) */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-2">
            <strong className="text-slate-900">
              AI / Evidence Band Estimate: Band {estimatedBand.toFixed(1)}
            </strong>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
              Baseline
            </span>
          </div>
          <p className="leading-relaxed">
            Chỉ số Band ước tính này được tính toán từ các điểm bằng chứng quan sát được qua bài kiểm tra chẩn đoán khởi đầu. Chỉ số này phục vụ mục đích thiết lập Baseline ban đầu cho thuật toán tối ưu học tập, không đại diện cho điểm thi chính thức của kỳ thi IELTS.
          </p>
        </div>
      </div>

      {/* Bottom Dominant Action Button */}
      <div className="pt-2 flex justify-end">
        <Button
          id="diagnostic-finish-goto-today-btn"
          variant="primary"
          size="lg"
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
          onClick={onNavigateToToday}
          className="w-full sm:w-auto font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
        >
          Đi tới phiên học hôm nay (/today)
        </Button>
      </div>
    </div>
  );
};
