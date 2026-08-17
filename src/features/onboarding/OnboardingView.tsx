import React, { useState } from 'react';
import { LearnerProfile, CurrentLevelType } from '../../types';
import { ProfileService, createUnassessedProfile } from '../../services/profile/profileService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { 
  Target, 
  Clock, 
  Calendar, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  BrainCircuit, 
  ShieldCheck, 
  Zap, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export interface OnboardingViewProps {
  initialProfile?: LearnerProfile;
  onCompleteOnboarding: (profile: LearnerProfile, nextRoute: '/diagnostic' | '/today') => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  initialProfile,
  onCompleteOnboarding
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Form State
  const [name, setName] = useState<string>(initialProfile?.name || 'Học viên');
  const [targetBand, setTargetBand] = useState<number>(initialProfile?.targetBand || 6.5);
  const [levelOption, setLevelOption] = useState<CurrentLevelType>(
    initialProfile?.currentLevelType || (initialProfile?.previousOfficialScore ? 'official_score' : 'not_assessed')
  );
  const [officialScore, setOfficialScore] = useState<number>(initialProfile?.previousOfficialScore || 5.5);
  const [estimatedScore, setEstimatedScore] = useState<number>(initialProfile?.currentEstimatedBand || 5.5);
  const [hasBookedExam, setHasBookedExam] = useState<boolean>(initialProfile?.hasBookedExam || false);
  const [examDate, setExamDate] = useState<string>(
    initialProfile?.examDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [dailyAvailableMinutes, setDailyAvailableMinutes] = useState<number>(
    initialProfile?.dailyAvailableMinutes || 20
  );
  const [preferredSessionMinutes, setPreferredSessionMinutes] = useState<number>(
    initialProfile?.preferredSessionMinutes || 20
  );

  const availableBands = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

  const handleFinish = (nextRoute: '/diagnostic' | '/today') => {
    const isOfficial = levelOption === 'official_score';
    const isEstimated = levelOption === 'estimated_score';
    const isNotAssessed = levelOption === 'not_assessed';

    const baseProfile = initialProfile || createUnassessedProfile();
    const finalProfile: LearnerProfile = {
      ...baseProfile,
      name: name.trim() || 'Học viên',
      targetBand: Number(targetBand),
      currentLevelType: levelOption,
      previousOfficialScore: isOfficial ? Number(officialScore) : undefined,
      aiEvidenceEstimate: isNotAssessed ? undefined : isEstimated ? Number(estimatedScore) : (isOfficial ? Number(officialScore) : undefined),
      assessmentStatus: isNotAssessed ? 'not_assessed' : 'ongoing_evidence',
      hasBookedExam,
      examDate: hasBookedExam ? examDate : undefined,
      dailyAvailableMinutes: Number(dailyAvailableMinutes),
      preferredSessionMinutes: Number(preferredSessionMinutes),
      dailyGoalMinutes: Number(dailyAvailableMinutes),
      currentEstimatedBand: isOfficial ? Number(officialScore) : (isEstimated ? Number(estimatedScore) : 0),
      onboardingCompleted: true,
      isDemoProfile: false
    };

    ProfileService.saveProfile(finalProfile);
    onCompleteOnboarding(finalProfile, nextRoute);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Top Progress & Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Thiết lập Hồ sơ Học tập Cá nhân hóa
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI IELTS Study Optimizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Hệ thống không áp đặt bài học chung chung. Các câu trả lời này giúp AI định vị chính xác mục tiêu, thời gian biểu và điểm can thiệp tiếp theo cho bạn.
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-indigo-600'
                    : s < step
                    ? 'w-2 bg-indigo-300'
                    : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Cards Container */}
        <Card variant="default" padding="lg" className="shadow-lg border-slate-200">
          
          {/* STEP 1: Candidate Name & Target Band */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Bước 1/5 • Mục tiêu IELTS
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Bạn muốn đạt mức Band điểm nào?
                </h2>
                <p className="text-xs text-slate-500">
                  Mục tiêu này quyết định ngưỡng độ sâu của các bẫy ngữ nghĩa và cấu trúc câu mà hệ thống sẽ huấn luyện cho bạn.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tên của bạn hoặc biệt danh</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Minh Anh, Hoàng Nam..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Chọn Mục tiêu Target Band</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {availableBands.map((band) => (
                      <button
                        key={band}
                        type="button"
                        onClick={() => setTargetBand(band)}
                        className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                          targetBand === band
                            ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-xs ring-2 ring-indigo-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="text-lg font-black font-mono">
                          {band.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {band >= 8.0 ? 'Xuất sắc' : band >= 7.0 ? 'Nâng cao' : band >= 6.5 ? 'Học thuật' : 'Cơ bản'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(2)}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Current Level & Previous Official Score */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Bước 2/5 • Trình độ hiện tại
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Năng lực IELTS hiện tại của bạn
                </h2>
                <p className="text-xs text-slate-500">
                  Nếu chưa từng thi hoặc chưa biết chính xác, hãy chọn "Chưa kiểm tra" để làm bài Diagnostic 10 phút.
                </p>
              </div>

              <div className="space-y-3">
                {/* Option 1: Has official score */}
                <div 
                  onClick={() => setLevelOption('official_score')}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    levelOption === 'official_score'
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                      levelOption === 'official_score' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                    }`}>
                      {levelOption === 'official_score' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">
                          Tôi đã có điểm thi IELTS chính thức (Official Score)
                        </span>
                        <span className="text-xs text-slate-500">
                          Điểm thi thật từ IDP hoặc British Council trong vòng 2 năm qua.
                        </span>
                      </div>

                      {levelOption === 'official_score' && (
                        <div className="pt-2 flex items-center gap-3">
                          <label className="text-xs font-bold text-slate-700">Điểm Overall:</label>
                          <select
                            value={officialScore}
                            onChange={(e) => setOfficialScore(parseFloat(e.target.value))}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-bold text-slate-900"
                          >
                            {availableBands.map(b => (
                              <option key={b} value={b}>Band {b.toFixed(1)}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Option 2: Self estimated score */}
                <div 
                  onClick={() => setLevelOption('estimated_score')}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    levelOption === 'estimated_score'
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                      levelOption === 'estimated_score' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                    }`}>
                      {levelOption === 'estimated_score' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">
                          Tôi có điểm tự ước tính hoặc mock test
                        </span>
                        <span className="text-xs text-slate-500">
                          Dựa trên các bài thi thử hoặc tự đánh giá trình độ tiếng Anh.
                        </span>
                      </div>

                      {levelOption === 'estimated_score' && (
                        <div className="pt-2 flex items-center gap-3">
                          <label className="text-xs font-bold text-slate-700">Ước tính khoảng:</label>
                          <select
                            value={estimatedScore}
                            onChange={(e) => setEstimatedScore(parseFloat(e.target.value))}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-bold text-slate-900"
                          >
                            {availableBands.map(b => (
                              <option key={b} value={b}>Band {b.toFixed(1)}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Option 3: Not assessed yet */}
                <div 
                  onClick={() => setLevelOption('not_assessed')}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    levelOption === 'not_assessed'
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                      levelOption === 'not_assessed' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                    }`}>
                      {levelOption === 'not_assessed' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-sm text-slate-900 block">
                        Tôi chưa rõ / Chưa từng thi (Not assessed yet)
                      </span>
                      <span className="text-xs text-slate-500">
                        Hệ thống sẽ giữ trạng thái <em>"Chưa kiểm tra"</em> và hướng dẫn bạn làm bài chẩn đoán 10 phút để thu thập bằng chứng.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Warning if target <= official score */}
              {levelOption === 'official_score' && targetBand <= officialScore && (
                <Alert variant="warning" title="Lưu ý về mục tiêu">
                  Mục tiêu (Band {targetBand.toFixed(1)}) đang bằng hoặc thấp hơn điểm chính thức đã có (Band {officialScore.toFixed(1)}). Bạn có thể cân nhắc đặt mục tiêu cao hơn (VD: Band {(officialScore + 0.5).toFixed(1)}).
                </Alert>
              )}

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
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Exam Date */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Bước 3/5 • Kế hoạch thi IELTS
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Bạn đã đăng ký ngày thi chính thức chưa?
                </h2>
                <p className="text-xs text-slate-500">
                  Ngày thi giúp hệ thống tính toán tính cấp thiết và phân bổ thứ tự xử lý điểm nghẽn.
                </p>
              </div>

              <div className="space-y-3">
                <div 
                  onClick={() => setHasBookedExam(true)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    hasBookedExam
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                      hasBookedExam ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                    }`}>
                      {hasBookedExam && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">
                          Tôi đã đăng ký ngày thi chính thức
                        </span>
                        <span className="text-xs text-slate-500">
                          Nhập ngày thi dự kiến của bạn.
                        </span>
                      </div>

                      {hasBookedExam && (
                        <div className="pt-2 flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          <input
                            type="date"
                            value={examDate}
                            onChange={(e) => setExamDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => setHasBookedExam(false)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    !hasBookedExam
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                      !hasBookedExam ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                    }`}>
                      {!hasBookedExam && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-sm text-slate-900 block">
                        Tôi chưa đặt lịch thi cụ thể
                      </span>
                      <span className="text-xs text-slate-500">
                        Học theo tiến độ chuẩn hóa mà không có áp lực thời gian gấp.
                      </span>
                    </div>
                  </div>
                </div>
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
                  onClick={() => setStep(4)}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Daily Available Time & Preferred Session */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Bước 4/5 • Thời lượng học tập
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Bạn có bao nhiêu thời gian học mỗi ngày?
                </h2>
                <p className="text-xs text-slate-500">
                  Next Best Action Engine sẽ gợi ý các can thiệp vừa vặn với quỹ thời gian thực tế của bạn.
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    Tổng thời gian học sẵn sàng mỗi ngày
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[15, 20, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDailyAvailableMinutes(mins)}
                        className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                          dailyAvailableMinutes === mins
                            ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold shadow-xs ring-2 ring-indigo-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="text-base font-black font-mono">{mins} phút</span>
                        <span className="text-[10px] text-slate-500">
                          {mins === 15 ? 'Siêu tốc' : mins === 20 ? 'Tối ưu' : mins === 30 ? 'Chuẩn' : 'Chuyên sâu'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Thời lượng mỗi phiên can thiệp ưu thích (Preferred Session)
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[15, 20, 30].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setPreferredSessionMinutes(mins)}
                        className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                          preferredSessionMinutes === mins
                            ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold shadow-xs ring-2 ring-indigo-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="text-sm font-black font-mono">{mins} phút / phiên</span>
                        <span className="text-[10px] text-slate-500">
                          {mins === 15 ? '3 bước nhận diện' : mins === 20 ? '4 bước có Re-test' : 'Chu kỳ mở rộng'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setStep(3)}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Quay lại
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(5)}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Xem tổng kết hồ sơ
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: Summary & Launch Action */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Bước 5/5 • Xác nhận Hồ sơ
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Hồ sơ học tập của bạn đã sẵn sàng!
                </h2>
                <p className="text-xs text-slate-500">
                  Dưới đây là thông số học tập thực tế đã được cấu hình cho tài khoản của bạn.
                </p>
              </div>

              {/* Profile Summary Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-slate-400 block">Học viên</span>
                    <span className="text-sm font-bold text-slate-900 truncate block">{name || 'Học viên'}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-slate-400 block">Mục tiêu</span>
                    <span className="text-sm font-black text-indigo-600 font-mono">Band {targetBand.toFixed(1)}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-slate-400 block">Trạng thái hiện tại</span>
                    <span className="text-xs font-bold text-slate-800">
                      {levelOption === 'official_score' 
                        ? `Official Band ${officialScore.toFixed(1)}` 
                        : levelOption === 'estimated_score' 
                        ? `Ước tính Band ${estimatedScore.toFixed(1)}` 
                        : 'Chưa kiểm tra'}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-slate-400 block">Thời lượng phiên</span>
                    <span className="text-xs font-bold text-slate-800">{preferredSessionMinutes}p / {dailyAvailableMinutes}p ngày</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                  <BrainCircuit className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Khuyến nghị bước tiếp theo:</strong>
                    Để AI phát hiện chính xác điểm nghẽn (Subskill Weakness) và thiết kế phiên học 20 phút hôm nay, hãy hoàn thành bài khảo sát chẩn đoán 10 phút.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setStep(4)}
                  icon={<ArrowLeft className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Chỉnh sửa lại
                </Button>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => handleFinish('/today')}
                    className="w-full sm:w-auto"
                  >
                    Vào Bảng điều khiển
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleFinish('/diagnostic')}
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold"
                  >
                    Bắt đầu bài chẩn đoán 10 phút
                  </Button>
                </div>
              </div>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
};
