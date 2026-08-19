import React from 'react';
import { 
  LearnerProfile, 
  ZeroClimberProgress 
} from '../../types';
import { ZEROCLIMBER_CAMPS, ZEROCLIMBER_LESSON_1 } from './ZeroClimberData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Mountain, 
  Target, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Compass, 
  Zap, 
  ShieldCheck, 
  Trophy, 
  RotateCcw,
  Calendar,
  Flame
} from 'lucide-react';

export interface ZeroClimberOverviewProps {
  profile: LearnerProfile;
  onStartLesson: (lessonId: string) => void;
  onNavigateToIelts: () => void;
  onRestartZeroOnboarding: () => void;
}

export const ZeroClimberOverview: React.FC<ZeroClimberOverviewProps> = ({
  profile,
  onStartLesson,
  onNavigateToIelts,
  onRestartZeroOnboarding
}) => {
  const zc: ZeroClimberProgress = profile.zeroClimber || {
    startingLevel: 'zero_foundation',
    targetBand: profile.targetBand || 6.0,
    dailyMinutes: 20,
    currentCampId: 'camp_base',
    currentLessonId: 'zc_lesson_1',
    currentLessonIndex: 1,
    totalClimbsCompleted: 0,
    dailyClimbs: [],
    isDailyClimbCompletedToday: false,
    unlockedCampIds: ['camp_base'],
    completedLessonIds: [],
    climbStreakDays: 0,
  };

  const isLesson1Completed = zc.completedLessonIds.includes('zc_lesson_1');
  const currentCamp = ZEROCLIMBER_CAMPS.find(c => c.id === zc.currentCampId) || ZEROCLIMBER_CAMPS[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* 1. Psychological Hero & Metaphor Banner */}
      <div className="bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#0F172A] rounded-3xl p-6 sm:p-8 text-white shadow-md border border-emerald-800/60 relative overflow-hidden">
        {/* Subtle background glow & mountain contours */}
        <div className="absolute -right-12 -bottom-12 opacity-15 pointer-events-none">
          <Mountain className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 text-emerald-200 text-xs font-bold border border-emerald-500/30 backdrop-blur-xs">
            <Mountain className="w-4 h-4 text-emerald-400" />
            <span>Hành trình ZeroClimber V0.1</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              You are not bad at English.<br className="hidden sm:block" />
              <span className="text-emerald-300">You are at Base Camp.</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
              Bạn không hề kém tiếng Anh. Bạn chỉ đang ở Trạm dừng Base Camp để xây dựng nền tảng cốt lõi trước khi chinh phục đỉnh núi IELTS Band {zc.targetBand.toFixed(1)}.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Xuất phát: <strong>{zc.startingLevel === 'zero_foundation' ? 'Bắt đầu từ số 0' : 'Sơ cấp'}</strong></span>
            </div>

            <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Mục tiêu: <strong>Band {zc.targetBand.toFixed(1)}</strong></span>
            </div>

            <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Mỗi ngày: <strong>{zc.dailyMinutes} phút</strong></span>
            </div>

            {zc.climbStreakDays > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-400/30 font-bold">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Streak: {zc.climbStreakDays} ngày</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Visual Metaphor: Zero -> Base Camp -> Climb -> Summit */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Lộ trình 5 Trạm leo núi
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Visual Map: Zero ➔ Base Camp ➔ Climb ➔ Summit
            </h2>
          </div>
          <button
            onClick={onRestartZeroOnboarding}
            className="text-xs font-semibold text-slate-500 hover:text-emerald-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Cài đặt lại mục tiêu</span>
          </button>
        </div>

        {/* Metaphor Stages */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {ZEROCLIMBER_CAMPS.map((camp, idx) => {
            const isCurrent = camp.id === zc.currentCampId;
            const isCompleted = isLesson1Completed && idx === 0;

            return (
              <div
                key={camp.id}
                className={`p-4 rounded-xl border transition relative flex flex-col justify-between ${
                  isCurrent
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                    : camp.isUnlocked
                    ? 'border-slate-200 bg-white hover:border-slate-300'
                    : 'border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      isCurrent 
                        ? 'bg-emerald-600 text-white' 
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      Trạm {idx + 1}
                    </span>
                    {camp.isUnlocked ? (
                      isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Mountain className="w-4 h-4 text-emerald-600" />
                      )
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                      {camp.name.split(':')[0]}
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-emerald-700">
                      {camp.targetBandRange}
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-200/60 text-[10px] text-slate-500 font-medium">
                  {idx === 0 
                    ? isLesson1Completed ? 'Đã hoàn thành Bài 1' : 'Đang ở chặng này'
                    : 'Mở khóa sau Base Camp'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Primary Work: TODAY'S CLIMB & NEXT CLIMB */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: TODAY'S CLIMB Dominant Action */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>TODAY'S CLIMB • BÀI HỌC HÔM NAY</span>
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {ZEROCLIMBER_LESSON_1.title}: Introduce Yourself
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Học và thực hành 3 mẫu câu tự giới thiệu bản thân chuẩn ngữ pháp tiếng Anh.
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Thời lượng</span>
                <span className="text-sm font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  ~{zc.dailyMinutes} phút
                </span>
              </div>
            </div>

            {/* Capability Outcome Box */}
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Năng lực bạn sẽ đạt được:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Tự tin nói và viết các câu giới thiệu bản thân ("My name is...", "I am a student...", "I am from Vietnam...") mà không còn bị ngập ngừng hay thiếu động từ to-be.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className={`w-2.5 h-2.5 rounded-full ${isLesson1Completed ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                <span>Trạng thái: <strong>{isLesson1Completed ? 'Đã hoàn thành hôm nay' : 'Chưa hoàn thành'}</strong></span>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => onStartLesson(ZEROCLIMBER_LESSON_1.id)}
                icon={isLesson1Completed ? <RotateCcw className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
              >
                {isLesson1Completed ? 'Ôn tập lại Bài 1' : 'Bắt đầu chặng leo hôm nay'}
              </Button>
            </div>
          </div>

          {/* NEXT CLIMB Preview */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  NEXT CLIMB • CHẶNG TIẾP THEO
                </span>
                <h4 className="text-sm font-bold text-slate-800">
                  Lesson 2: Daily Routines & Activities (Thói quen hàng ngày)
                </h4>
                <p className="text-xs text-slate-500">
                  Diễn đạt thì hiện tại đơn không sai s/es.
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
              {isLesson1Completed ? 'Sắp ra mắt ở V0.2' : 'Khóa'}
            </span>
          </div>
        </div>

        {/* Right 1 Col: Progress & Switch back to IELTS */}
        <div className="space-y-4">
          
          {/* Progress Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tiến độ Base Camp
            </h4>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {isLesson1Completed ? '1/5' : '0/5'}
                </span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium">bài đã leo</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                {isLesson1Completed ? '20%' : '0%'}
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: isLesson1Completed ? '20%' : '5%' }}
              />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              {isLesson1Completed 
                ? 'Tuyệt vời! Bạn đã có bằng chứng năng lực đầu tiên tại Base Camp.' 
                : 'Mỗi ngày chỉ cần 1 bước leo nhỏ để biến tiếng Anh thành phản xạ.'}
            </p>
          </div>

          {/* Switch to Full IELTS Optimizer */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-900">
                Chế độ IELTS Optimizer V2
              </h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bạn có thể chuyển đổi sang giao diện chẩn đoán Reading & Writing chuyên sâu bất cứ lúc nào.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToIelts}
              className="w-full text-xs font-bold text-indigo-700 border-indigo-200 hover:bg-indigo-50"
            >
              Xem IELTS Optimizer (/today)
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
};
