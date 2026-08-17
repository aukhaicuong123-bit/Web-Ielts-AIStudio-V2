import React, { useState } from 'react';
import { 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  FileCheck, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Zap, 
  BarChart3, 
  Flame, 
  Info,
  Layers
} from 'lucide-react';
import { LearnerProfile, SubskillId } from '../types';
import { SUBSKILLS_DICTIONARY } from '../data/mockContent';
import { RetestCard } from './learning/RetestCard';

interface EvidenceDashboardProps {
  profile: LearnerProfile;
  onStartPathway: (pathwayId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const EvidenceDashboard: React.FC<EvidenceDashboardProps> = ({
  profile,
  onStartPathway,
  onNavigateTab,
}) => {
  const subskillList = Object.keys(profile.subskillMastery) as SubskillId[];

  return (
    <div className="space-y-6">
      {/* Top Banner: Evidence & Progress Assurance */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Bảng Chứng Minh Tiến Bộ
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Bằng Chứng Tiến Bộ Qua Bài Re-Test Đối Chứng
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Hệ thống trả lời câu hỏi cốt lõi: <em>"Điểm yếu của tôi có thực sự được khắc phục sau can thiệp không?"</em> bằng dữ liệu thực nghiệm qua các bài kiểm tra đối chứng trước và sau.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[120px]">
              <span className="text-[11px] font-semibold text-slate-500 block">Vòng lặp Re-Test</span>
              <span className="text-2xl font-black text-indigo-600 font-mono">
                {profile.reTestHistory.length}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[120px]">
              <span className="text-[11px] font-semibold text-slate-500 block">Ước tính AI</span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                Band {profile.currentEstimatedBand.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Subskill Mastery Delta & Verified Retest Proof */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Before vs. After Subskill Mastery Delta */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-base">
                Biểu Đồ Độ Thuần Thục Subskill (Mastery Delta)
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" /> Baseline
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> Hiện tại
              </span>
            </div>
          </div>

          <div className="space-y-3.5">
            {subskillList.map((sId) => {
              const info = SUBSKILLS_DICTIONARY[sId];
              const baseline = profile.baselineMastery[sId] || 45;
              const current = profile.subskillMastery[sId] || 50;
              const delta = current - baseline;

              return (
                <div key={sId} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">
                        {info?.name || sId}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {info?.skill.toUpperCase()} • {info?.targetWeakness}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono">{baseline}% ➔</span>
                      <span className="font-bold text-slate-900 font-mono">{current}%</span>
                      {delta > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                          +{delta}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dual Bar (Baseline vs Current) */}
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-slate-400 rounded-full opacity-40"
                      style={{ width: `${baseline}%` }}
                    />
                    <div
                      className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${current}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Verified Re-Tests Log */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Nhật Ký Re-Test Đối Chứng
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {profile.reTestHistory.length} biên bản
              </span>
            </div>

            {profile.reTestHistory.length > 0 ? (
              <div className="space-y-3">
                {profile.reTestHistory.map((rt) => (
                  <RetestCard key={rt.id} retest={rt} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2 text-slate-500">
                <Info className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs">Chưa có bài Re-test nào được hoàn thành.</p>
                <button
                  onClick={() => onStartPathway('pathway_paraphrase')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold mt-2 inline-block underline"
                >
                  Thực hiện Micro-Pathway đầu tiên ngay ➔
                </button>
              </div>
            )}
          </div>

          {/* Evidence Calibration Info Card (Neutral, Honest) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Nguyên lý Xác minh Thực nghiệm</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Điểm năng lực Subskill và Band ước tính được tính toán dựa trên bằng chứng quan sát thực tế (Observed Evidence) qua các lần làm bài, không phải phỏng đoán ngẫu nhiên.
            </p>
            <div className="pt-2 border-t border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
              <span>Phương pháp: Re-Test Đối chứng</span>
              <span className="text-indigo-600 font-semibold">Tập trung 1 điểm nghẽn</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
