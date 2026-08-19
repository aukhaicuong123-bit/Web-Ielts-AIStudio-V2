import React from 'react';
import { LearnerProfile, SubskillId } from '../../types';
import { LearningEngine } from '../../engine';
import { NextBestActionCard } from '../../components/learning/NextBestActionCard';
import { WeaknessMap } from '../../components/learning/WeaknessMap';
import { ProgressSnapshot } from '../../components/learning/ProgressSnapshot';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Target, 
  BrainCircuit, 
  ArrowRight, 
  BookOpen, 
  PenTool, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Activity, 
  Zap, 
  ShieldCheck, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export interface OverviewViewProps {
  profile: LearnerProfile;
  onStartPathway: (pathwayId: string) => void;
  onNavigate: (route: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  profile,
  onStartPathway,
  onNavigate
}) => {
  // Check empty state (no diagnostic and no activity)
  const hasInsufficientEvidence = (!profile.hasCompletedDiagnostic && (!profile.recentActivity || profile.recentActivity.length === 0)) || profile.assessmentStatus === 'not_assessed';

  const sessionMins = profile.preferredSessionMinutes || profile.dailyAvailableMinutes || 20;

  // Compute Next Best Action from centralized LearningEngine
  const nextAction = LearningEngine.recommendation.getNextBestAction(profile, {
    availableMinutes: sessionMins
  });

  const handleStartNextAction = () => {
    if (nextAction.type === 'diagnostic') {
      onNavigate('/diagnostic');
    } else {
      // Dominant CTA: navigate to /today execution environment
      onNavigate('/today');
    }
  };

  const handleInterveneSubskill = (subskillId: SubskillId) => {
    let pathwayId = 'pathway_paraphrase';
    if (subskillId.includes('cause') || subskillId.includes('coherence') || subskillId.includes('argument')) {
      pathwayId = 'pathway_cause_effect';
    } else if (subskillId.includes('grammar') || subskillId.includes('complex')) {
      pathwayId = 'pathway_complex_grammar';
    }
    onStartPathway(pathwayId);
  };

  // Exam days countdown
  let examDaysDiff: number | null = null;
  if (profile.hasBookedExam && profile.examDate) {
    try {
      const examTime = new Date(profile.examDate).getTime();
      const diff = Math.ceil((examTime - Date.now()) / (1000 * 60 * 60 * 24));
      if (diff > 0) examDaysDiff = diff;
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <div id="overview-dashboard-view" className="space-y-6 max-w-6xl mx-auto pb-8">
      
      {/* Demo Profile Notice if active */}
      {profile.isDemoProfile && (
        <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Đang sử dụng hồ sơ demo. Bạn có thể cá nhân hóa mục tiêu trong trang Hồ sơ hoặc tạo mới.</span>
          </div>
          <button
            onClick={() => onNavigate('/profile')}
            className="text-xs font-bold text-amber-900 underline hover:text-amber-700 self-start sm:self-auto"
          >
            Chỉnh sửa hồ sơ của bạn
          </button>
        </div>
      )}

      {/* 1. Header: Where am I? Concise, factual context */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tổng quan năng lực & Điểm nghẽn
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-100">
                <Target className="w-3 h-3 text-indigo-600" />
                Mục tiêu: Band {profile.targetBand.toFixed(1)}
              </span>

              {profile.currentEstimatedBand > 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                  <BrainCircuit className="w-3 h-3 text-emerald-600" />
                  ??c t?nh AI: Band {profile.currentEstimatedBand.toFixed(1)}
                </span>
              ) : profile.aiEvidenceEstimate ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                  <BrainCircuit className="w-3 h-3 text-emerald-600" />
                  ??c t?nh AI: Band {profile.aiEvidenceEstimate.toFixed(1)}
                </span>
              ) : profile.previousOfficialScore ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                  ?i?m thi th?t: Band {profile.previousOfficialScore.toFixed(1)}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                  Ch?a ki?m tra (Not assessed)
                </span>
              )}

              {examDaysDiff !== null && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                  <Calendar className="w-3 h-3 text-rose-500" />
                  Còn {examDaysDiff} ngày thi
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Xin chào, {profile.name || 'Học viên'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {hasInsufficientEvidence ? (
                'Hệ thống chưa có đủ bằng chứng thực tế để định vị điểm nghẽn. Hãy hoàn thành khảo sát chẩn đoán 10 phút.'
              ) : (
                <>
                  Điểm nghẽn có tác động lớn nhất cần can thiệp tiếp theo là{' '}
                  <strong className="text-slate-900 font-bold">{nextAction.targetSubskillName}</strong>.{' '}
                  {profile.reTestHistory.length > 0 
                    ? `Đã có ${profile.reTestHistory.length} bài Re-test đối chứng được ghi nhận vào hồ sơ năng lực.` 
                    : 'Chưa có bài Re-test đối chứng sau can thiệp.'}
                </>
              )}
            </p>
          </div>

          <div className="flex sm:flex-row md:flex-col gap-2 flex-shrink-0">
            <Button
              id="header-goto-today-btn"
              variant="primary"
              size="md"
              icon={<Zap className="w-4 h-4 text-amber-400" />}
              onClick={() => onNavigate(hasInsufficientEvidence ? '/diagnostic' : '/today')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold"
            >
              {hasInsufficientEvidence ? 'Làm bài Diagnostic (10p)' : `Bắt đầu phiên học hôm nay (${sessionMins}p)`}
            </Button>
          </div>
        </div>
      </div>

      {/* Insufficient Evidence Empty State */}
      {hasInsufficientEvidence ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-2xs text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              Hệ thống cần thêm dữ liệu kiểm chứng
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Chúng tôi chưa ghi nhận đủ dữ liệu bài làm để định vị chính xác điểm nghẽn học thuật của bạn. Hãy hoàn thành bài khảo sát chẩn đoán 10 phút để xây dựng hồ sơ năng lực ban đầu.
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
          {/* 2. PRIMARY NEXT BEST ACTION: Most prominent element */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Nhiệm vụ ưu tiên cao nhất (Primary Next Best Action)
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Dựa trên mục tiêu Band {profile.targetBand.toFixed(1)} & {profile.activeErrors.length} lỗi lặp lại
              </span>
            </div>

            <NextBestActionCard
              action={nextAction}
              onStartAction={handleStartNextAction}
            />
          </div>

          {/* 3. BENTO GRID: Weakness Map + Progress Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Academic Weakness Map */}
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Bản đồ Điểm nghẽn Học thuật
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {Object.keys(profile.subskillMastery).length} Kỹ năng cấu thành
                </span>
              </div>

              <WeaknessMap
                profile={profile}
                onIntervene={handleInterveneSubskill}
              />
            </div>

            {/* Right 1 Col: Progress & Error Verification Snapshot */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nhật ký Xác minh Năng lực
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {profile.reTestHistory.length} Re-tests
                </span>
              </div>

              <ProgressSnapshot profile={profile} />
            </div>

          </div>

          {/* 4. FAST MODULE ENTRY / SECONDARY ACTIONS */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Lối tắt vào Module Luyện tập Độc lập
              </span>
              <span className="text-xs text-slate-500">
                Luyện tập có thu thập bằng chứng vào hệ thống
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                id="quick-nav-today-card"
                onClick={() => onNavigate('/today')}
                className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition text-left group flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition">
                    Phiên học Hôm nay
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Chu trình can thiệp {sessionMins} phút
                  </p>
                </div>
              </button>

              <button
                id="quick-nav-reading-card"
                onClick={() => onNavigate('/reading')}
                className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition text-left group flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition">
                    Reading Practice
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Kiểm tra bẫy suy luận & paraphrase
                  </p>
                </div>
              </button>

              <button
                id="quick-nav-writing-card"
                onClick={() => onNavigate('/writing')}
                className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition text-left group flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    Writing Practice
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Phản hồi bằng chứng & sửa câu
                  </p>
                </div>
              </button>

              <button
                id="quick-nav-diagnostic-card"
                onClick={() => onNavigate('/diagnostic')}
                className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition text-left group flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-700 transition">
                    Chẩn đoán (Diagnostic)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Định vị lại toàn diện điểm nghẽn
                  </p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
