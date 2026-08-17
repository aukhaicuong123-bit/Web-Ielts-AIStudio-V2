import React from 'react';
import { 
  Target, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  RotateCcw,
  Sparkles,
  BookOpen,
  PenTool,
  GitMerge
} from 'lucide-react';
import { LearnerProfile, SubskillId } from '../types';
import { SUBSKILLS_DICTIONARY } from '../data/mockContent';
import { CROSS_SKILL_PATHWAYS } from '../data/pathways';

interface DailyOptimizerProps {
  profile: LearnerProfile;
  onStartPathway: (pathwayId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DailyOptimizer: React.FC<DailyOptimizerProps> = ({ profile, onStartPathway, onNavigateTab }) => {
  // Find the lowest mastery subskill to recommend the best high-ROI 20-30 min study wedge
  const subskillEntries = Object.entries(profile.subskillMastery) as [SubskillId, number][];
  const sortedSubskills = [...subskillEntries].sort((a, b) => a[1] - b[1]);
  const weakest = sortedSubskills[0] || ['reading_paraphrase', 50];
  const weakestSubskillId = weakest[0];
  const weakestScore = weakest[1];
  const weakestInfo = SUBSKILLS_DICTIONARY[weakestSubskillId] || {
    name: 'Paraphrasing & Lexical Variety',
    targetWeakness: 'Bẫy paraphrase từ đồng nghĩa và từ vựng lặp lại'
  };

  // Map to suggested pathway
  let recommendedPathway = CROSS_SKILL_PATHWAYS[0];
  if (weakestSubskillId.includes('cause_effect') || weakestSubskillId.includes('coherence')) {
    recommendedPathway = CROSS_SKILL_PATHWAYS[1];
  } else if (weakestSubskillId.includes('grammar') || weakestSubskillId.includes('complex')) {
    recommendedPathway = CROSS_SKILL_PATHWAYS[2];
  }

  return (
    <div className="space-y-6">
      {/* Top Professional Summary Hero & Action Card */}
      <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-8 text-white shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> 30 Phút Tối Ưu Hôm Nay
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Bạn không cần cày nhiều bài hơn. Hãy sửa đúng 1 nút thắt hôm nay.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Dựa trên <strong className="text-white">{profile.activeErrors.length} lỗi học tập gần nhất</strong>, hệ thống đã khoanh vùng được điểm nghẽn có tỷ lệ mất điểm cao nhất của bạn. Hoàn thành 1 chu kỳ can thiệp ngắn 20 phút rồi kiểm chứng ngay qua Re-test.
          </p>

          {/* Action Callout Box */}
          <div className="mt-6 bg-slate-900/90 border border-slate-700/80 rounded-xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Điểm nghẽn cần can thiệp số 1: {weakestInfo.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-medium border border-amber-500/30">
                    Mastery: {weakestScore}%
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {recommendedPathway.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                  {recommendedPathway.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Thời gian: <strong className="text-white">{recommendedPathway.durationMinutes} phút</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30 text-emerald-300">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kỳ vọng: <strong>+15-25% độ chính xác</strong></span>
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  id="btn-start-daily-intervention"
                  onClick={() => onStartPathway(recommendedPathway.id)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Bắt đầu can thiệp ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mục tiêu Band điểm</p>
          <h3 className="text-2xl font-bold text-slate-900">Band {profile.currentEstimatedBand.toFixed(1)} ➔ {profile.targetBand.toFixed(1)}</h3>
          <div className="mt-2 flex items-center text-xs text-indigo-600 font-medium">
            <span>Tiến độ đạt 68% chuẩn đầu ra</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Lỗi học tập tích lũy</p>
          <h3 className="text-2xl font-bold text-slate-900">{profile.activeErrors.length} Lỗi trọng điểm</h3>
          <div className="mt-2 flex items-center text-xs text-amber-600 font-medium">
            <span>2 lỗi cần triệt tiêu trong tuần này</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Vòng lặp đã Re-test</p>
          <h3 className="text-2xl font-bold text-slate-900">{profile.reTestHistory.length} Biên bản đối chứng</h3>
          <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
            <span>↑ 100% tỷ lệ cải thiện sau can thiệp</span>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Active Error Memory + Closed Learning Loop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Active Error Memory Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                  Kho Lưu Trữ Lỗi Trọng Điểm (Error Memory)
                </h2>
                <p className="text-xs text-slate-500">
                  Tự động thu thập từ các lần nộp bài Reading & Writing
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              {profile.activeErrors.length} lỗi
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {profile.activeErrors.map((err) => (
              <div 
                key={err.id}
                className="p-5 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-100">
                      {err.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Lặp lại: <strong className="text-rose-600">{err.count} lần</strong>
                    </span>
                    <span className="text-xs text-slate-400">• {err.lastEncountered}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    {err.name}
                  </h4>
                </div>

                <button
                  onClick={() => {
                    if (err.subskill.includes('paraphrase')) onStartPathway('pathway_paraphrase');
                    else if (err.subskill.includes('cause') || err.subskill.includes('coherence')) onStartPathway('pathway_cause_effect');
                    else onStartPathway('pathway_complex_grammar');
                  }}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap self-start sm:self-center transition"
                >
                  <span>Khắc phục lỗi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Bottom quick actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs mt-auto">
            <span className="text-slate-500 font-medium">Bạn muốn bổ sung dữ liệu chẩn đoán?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('reading')}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Làm bài Reading ngắn</span>
              </button>
              <button
                onClick={() => onNavigateTab('writing')}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <PenTool className="w-3.5 h-3.5 text-indigo-600" />
                <span>Chấm bài Writing / Ảnh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: The Closed Learning Loop Blueprint */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <GitMerge className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Vòng Lặp Học Tập Khép Kín
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mỗi buổi học đều tuân thủ 7 bước để đảm bảo bạn không lãng phí thời gian:
            </p>

            <div className="space-y-2 text-xs">
              {[
                { step: '1. ASSESS', desc: 'Đo lường năng lực ban đầu', icon: BookOpen, color: 'text-indigo-600' },
                { step: '2. DIAGNOSE', desc: 'AI bóc tách lỗi & bằng chứng', icon: AlertTriangle, color: 'text-amber-600' },
                { step: '3. PRIORITIZE', desc: 'Chọn 1 điểm yếu quan trọng nhất', icon: Target, color: 'text-rose-600' },
                { step: '4. PRACTICE', desc: 'Luyện 5-15 phút có mục tiêu', icon: Zap, color: 'text-amber-600' },
                { step: '5. TRANSFER', desc: 'Ứng dụng sang kỹ năng kia', icon: GitMerge, color: 'text-indigo-600' },
                { step: '6. VERIFY', desc: 'Re-test kiểm chứng tiến bộ', icon: CheckCircle, color: 'text-emerald-600' },
                { step: '7. ADAPT', desc: 'Cập nhật Profile & giảm lỗi', icon: TrendingUp, color: 'text-blue-600' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
                    <div>
                      <span className="font-semibold text-slate-800">{item.step}:</span>{' '}
                      <span className="text-slate-600">{item.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Mục tiêu tuần: Hoàn thành 3 vòng lặp khép kín.</span>
            </div>
          </div>

          <div className="bg-[#0F172A] p-6 rounded-xl text-white shadow-sm">
            <h4 className="font-bold text-sm mb-1.5">Chuẩn Hóa Học Thuật 2026</h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Mọi gợi ý sửa lỗi và đề bài Re-test đều được đối chiếu theo bộ Rubric chính thức của giám khảo quốc tế.
            </p>
            <button
              onClick={() => onNavigateTab('pathways')}
              className="w-full py-2.5 bg-white text-[#0F172A] text-xs font-bold rounded-lg hover:bg-slate-100 transition shadow-sm"
            >
              Xem tất cả Pathways
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
