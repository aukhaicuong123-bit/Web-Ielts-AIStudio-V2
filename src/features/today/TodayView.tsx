import React, { useState } from 'react';
import { LearnerProfile, NextBestAction, SubskillId } from '../../types';
import { LearningEngine } from '../../engine';
import { CROSS_SKILL_PATHWAYS } from '../../data/pathways';
import { NextBestActionCard } from '../../components/learning/NextBestActionCard';
import { MicroSessionBreakdown } from '../../components/learning/MicroSessionBreakdown';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Zap, 
  Clock, 
  Target, 
  ShieldAlert, 
  BrainCircuit,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

export interface TodayViewProps {
  profile: LearnerProfile;
  onStartPathway: (pathwayId: string) => void;
  onNavigate: (route: any) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  profile,
  onStartPathway,
  onNavigate
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(
    profile.preferredSessionMinutes || profile.dailyAvailableMinutes || 20
  );
  const [showWhyDetails, setShowWhyDetails] = useState<boolean>(true);

  // Check empty state (no diagnostic and no activity)
  const hasInsufficientEvidence = (!profile.hasCompletedDiagnostic && (!profile.recentActivity || profile.recentActivity.length === 0)) || profile.assessmentStatus === 'not_assessed';

  // Compute Next Best Action from centralized LearningEngine with user availability
  const nextAction = LearningEngine.recommendation.getNextBestAction(profile, {
    availableMinutes: selectedMinutes
  });

  // Find the exact MicroPathway represented by the pathway model
  const targetPathwayId = nextAction.targetPathwayId || 'pathway_paraphrase';
  const matchedPathway = CROSS_SKILL_PATHWAYS.find((p) => p.id === targetPathwayId) || CROSS_SKILL_PATHWAYS[0];

  // Find active errors related to this subskill if any
  const matchedError = profile.activeErrors.find((e) => e.subskill === nextAction.targetSubskill);

  const handleStartSession = (action: NextBestAction) => {
    if (action.type === 'diagnostic') {
      onNavigate('/diagnostic');
    } else if (action.targetPathwayId) {
      onStartPathway(action.targetPathwayId);
    } else {
      onStartPathway('pathway_paraphrase');
    }
  };

  return (
    <div id="today-execution-view" className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* 1. Today Header */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wide uppercase">
                <Zap className="w-3 h-3 text-amber-400" />
                Phiên học hôm nay
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Mục tiêu Band {profile.targetBand.toFixed(1)}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {selectedMinutes} phút tập trung xử lý đúng 1 điểm nghẽn
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Bạn không cần phải tự chọn bài học. Hệ thống đã phân tích dữ liệu và chỉ định điểm can thiệp có ROI cao nhất.
            </p>
          </div>

          {/* Time Selector for Today */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200/80 self-start sm:self-center flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-500 ml-2" />
            <span className="text-xs font-semibold text-slate-700 mr-1 hidden md:inline">
              Thời gian:
            </span>
            {[15, 20, 30].map((mins) => (
              <button
                key={mins}
                id={`time-btn-${mins}m`}
                onClick={() => setSelectedMinutes(mins)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                  selectedMinutes === mins
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {mins}p
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State when insufficient evidence */}
      {hasInsufficientEvidence ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-2xs text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              Cần thêm bằng chứng để xây dựng phiên học
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hệ thống chưa ghi nhận đủ dữ liệu bài làm để phát hiện chính xác điểm nghẽn của bạn. Vui lòng hoàn thành bài khảo sát chẩn đoán 10 phút để nhận đề xuất bài học cá nhân hóa.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => onNavigate('/diagnostic')}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            Làm bài chẩn đoán 10 phút
          </Button>
        </div>
      ) : (
        <>
          {/* 2. Today Mission Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Nhiệm vụ trọng tâm (Today's Mission)
              </span>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                Thời lượng: {nextAction.estimatedMinutes} phút
              </span>
            </div>

            <NextBestActionCard
              action={nextAction}
              onStart={handleStartSession}
              ctaText={`Bắt đầu phiên học ngay (${nextAction.estimatedMinutes} phút)`}
              ctaSubtext="Sau khi hoàn thành bài tập, hệ thống sẽ đối chứng kết quả để xác nhận tiến bộ."
            />
          </div>

          {/* 3. Micro-Session Step Breakdown */}
          {matchedPathway && (
            <MicroSessionBreakdown
  pathway={matchedPathway}
  sessionMinutes={selectedMinutes}
/>
          )}

          {/* 4. Why this was selected: Deep Explainability Accordion */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <button
              onClick={() => setShowWhyDetails(!showWhyDetails)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-600" />
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Tại sao hệ thống chỉ định bài học này cho bạn? (Algorithm Explainability)
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <span>{showWhyDetails ? 'Thu gọn' : 'Chi tiết'}</span>
                {showWhyDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showWhyDetails && (
              <div className="p-4 pt-0 border-t border-slate-100 space-y-3 bg-slate-50/40">
                <div className="space-y-2 text-xs text-slate-600 pt-3">
                  {nextAction.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{reason}</span>
                    </div>
                  ))}
                </div>

                {matchedError && (
                  <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200/80 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Mẫu lỗi đang ghi nhận: {matchedError.name}</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Tần suất lặp lại: <strong>{matchedError.count} lần</strong> | Lần xuất hiện gần nhất: {matchedError.lastEncountered}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
