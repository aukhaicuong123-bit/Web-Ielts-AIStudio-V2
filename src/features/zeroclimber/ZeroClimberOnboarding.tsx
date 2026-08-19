import React, { useState } from 'react';
import { 
  LearnerProfile, 
  ZeroClimberStartingLevel, 
  ZeroClimberDailyMinutes, 
  ZeroClimberProgress 
} from '../../types';
import { ProfileService } from '../../services/profile/profileService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Mountain, 
  Target, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  HeartHandshake
} from 'lucide-react';

export interface ZeroClimberOnboardingProps {
  initialProfile?: LearnerProfile;
  onComplete: (profile: LearnerProfile) => void;
  onCancel?: () => void;
}

export const ZeroClimberOnboarding: React.FC<ZeroClimberOnboardingProps> = ({
  initialProfile,
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 3;

  // Form State
  const [startingLevel, setStartingLevel] = useState<ZeroClimberStartingLevel>(
    initialProfile?.zeroClimber?.startingLevel || 'zero_foundation'
  );
  const [targetBand, setTargetBand] = useState<number>(
    initialProfile?.zeroClimber?.targetBand || initialProfile?.targetBand || 6.0
  );
  const [dailyMinutes, setDailyMinutes] = useState<ZeroClimberDailyMinutes>(
    initialProfile?.zeroClimber?.dailyMinutes || 20
  );

  const startingOptions: {
    id: ZeroClimberStartingLevel;
    title: string;
    description: string;
    isDefault?: boolean;
    badge?: string;
  }[] = [
    {
      id: 'zero_foundation',
      title: 'Starting from Zero (Bắt đầu từ số 0)',
      description: 'Mất gốc hoàn toàn, chưa thể tạo câu tiếng Anh đơn giản hoặc sợ học ngữ pháp phức tạp.',
      isDefault: true,
      badge: 'Khuyên dùng cho người mới'
    },
    {
      id: 'elementary_3_4',
      title: 'Nền tảng sơ cấp (Band 3.0 - 4.5)',
      description: 'Đã biết một số từ vựng cơ bản nhưng hay bị ngập ngừng, sai ngữ pháp to-be và thì.',
    },
    {
      id: 'intermediate_5_6',
      title: 'Trung cấp (Band 5.0 - 6.0)',
      description: 'Có thể giao tiếp cơ bản, muốn xây dựng nền tảng vững chắc để bứt phá lên các Band học thuật.',
    },
    {
      id: 'advanced_6_5_plus',
      title: 'Nâng cao (Band 6.5+)',
      description: 'Đã có nền tảng tốt, muốn ôn tập các phản xạ cốt lõi trước khi vào luyện đề chuyên sâu.',
    }
  ];

  const targetBandOptions: {
    band: number;
    label: string;
    subtitle: string;
  }[] = [
    { band: 5.0, label: 'IELTS 5.0', subtitle: 'Tốt nghiệp ĐH & Giao tiếp cơ bản' },
    { band: 5.5, label: 'IELTS 5.5', subtitle: 'Chuẩn đầu ra & Du học dự bị' },
    { band: 6.0, label: 'IELTS 6.0', subtitle: 'Mục tiêu phổ biến & Cơ hội việc làm' },
    { band: 6.5, label: 'IELTS 6.5', subtitle: 'Chuẩn học thuật & Học bổng quốc tế' },
    { band: 7.0, label: 'IELTS 7.0+', subtitle: 'Đỉnh cao chuyên môn & Định cư' },
  ];

  const timeOptions: {
    minutes: ZeroClimberDailyMinutes;
    label: string;
    description: string;
  }[] = [
    { minutes: 10, label: '10 phút / ngày', description: 'Nhẹ nhàng, duy trì phản xạ mỗi ngày mà không bị áp lực.' },
    { minutes: 20, label: '20 phút / ngày', description: 'Tối ưu nhất: 1 bài học cốt lõi + thực hành phản xạ hoàn chỉnh.' },
    { minutes: 30, label: '30 phút / ngày', description: 'Tiến độ nhanh: Học sâu và củng cố toàn diện 2 vòng bài tập.' },
    { minutes: 45, label: '45 phút / ngày', description: 'Tập trung cao độ cho học viên có nhiều thời gian rảnh.' },
    { minutes: 60, label: '60 phút / ngày', description: 'Cường độ tối đa để bứt phá nền tảng trong thời gian ngắn.' },
  ];

  const handleFinish = () => {
    const baseProfile = initialProfile || ProfileService.getProfile();

    const zeroClimberState: ZeroClimberProgress = {
      startingLevel,
      targetBand,
      dailyMinutes,
      currentCampId: 'camp_base',
      currentLessonId: 'zc_lesson_1',
      currentLessonIndex: 1,
      totalClimbsCompleted: baseProfile.zeroClimber?.totalClimbsCompleted || 0,
      dailyClimbs: baseProfile.zeroClimber?.dailyClimbs || [],
      isDailyClimbCompletedToday: baseProfile.zeroClimber?.isDailyClimbCompletedToday || false,
      lastClimbDate: baseProfile.zeroClimber?.lastClimbDate,
      unlockedCampIds: baseProfile.zeroClimber?.unlockedCampIds?.length ? baseProfile.zeroClimber.unlockedCampIds : ['camp_base'],
      completedLessonIds: baseProfile.zeroClimber?.completedLessonIds || [],
      climbStreakDays: baseProfile.zeroClimber?.climbStreakDays || 0,
    };

    const updatedProfile: LearnerProfile = {
      ...baseProfile,
      targetBand,
      dailyAvailableMinutes: dailyMinutes,
      preferredSessionMinutes: dailyMinutes <= 30 ? dailyMinutes : 20,
      dailyGoalMinutes: dailyMinutes,
      onboardingCompleted: true,
      zeroClimber: zeroClimberState
    };

    ProfileService.saveProfile(updatedProfile);
    onComplete(updatedProfile);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Top Progress & Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Mountain className="w-4 h-4 text-emerald-600" />
            <span>ZeroClimber • Hành trình từ số 0 lên đỉnh núi IELTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Khởi động Chặng Leo núi của bạn
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            "Bạn không hề kém tiếng Anh. Bạn chỉ đang ở Trạm xuất phát Base Camp để chuẩn bị hành trang."
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-emerald-600'
                    : s < step
                    ? 'w-2 bg-emerald-300'
                    : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Container Card */}
        <Card variant="default" padding="lg" className="shadow-lg border-slate-200 bg-white">
          
          {/* SCREEN 1: "Where are you starting?" */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Chặng 1/3 • Điểm xuất phát
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Where are you starting? (Bạn đang bắt đầu từ đâu?)
                </h2>
                <p className="text-xs text-slate-500">
                  Hệ thống sẽ thiết kế các bài học ngắn, dễ hiểu và không dùng thuật ngữ ngữ pháp phức tạp.
                </p>
              </div>

              <div className="space-y-3">
                {startingOptions.map((opt) => {
                  const isSelected = startingLevel === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setStartingLevel(opt.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                          isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">
                              {opt.title}
                            </span>
                            {opt.badge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs">
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {opt.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {onCancel ? (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Quay lại IELTS Optimizer
                  </button>
                ) : <div />}

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(2)}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {/* SCREEN 2: "Where do you want to climb?" */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Chặng 2/3 • Đỉnh núi mục tiêu
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Where do you want to climb? (Đỉnh núi bạn muốn chinh phục?)
                </h2>
                <p className="text-xs text-slate-500">
                  Chọn mục tiêu điểm IELTS bạn hướng tới để ZeroClimber vạch lộ trình từng trạm dừng (Camps).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {targetBandOptions.map((opt) => {
                  const isSelected = targetBand === opt.band;
                  return (
                    <div
                      key={opt.band}
                      onClick={() => setTargetBand(opt.band)}
                      className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black font-mono text-slate-900">
                            {opt.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {opt.subtitle}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setStep(1)}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Quay lại
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(3)}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {/* SCREEN 3: "How much time can you study each day?" */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Chặng 3/3 • Thời gian leo núi hàng ngày
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  How much time can you study each day? (Mỗi ngày bạn dành bao nhiêu phút?)
                </h2>
                <p className="text-xs text-slate-500">
                  Một bước nhỏ mỗi ngày tại Base Camp sẽ tích lũy thành bước nhảy vọt lên đỉnh Summit.
                </p>
              </div>

              <div className="space-y-2.5">
                {timeOptions.map((opt) => {
                  const isSelected = dailyMinutes === opt.minutes;
                  return (
                    <div
                      key={opt.minutes}
                      onClick={() => setDailyMinutes(opt.minutes)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-900 block">
                            {opt.label}
                          </span>
                          <span className="text-xs text-slate-500">
                            {opt.description}
                          </span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setStep(2)}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Quay lại
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFinish}
                  icon={<Sparkles className="w-4 h-4" />}
                  iconPosition="right"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Bắt đầu chặng Base Camp ngay
                </Button>
              </div>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
};
