import React, { useState, useEffect } from 'react';
import { 
  GitMerge, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  BrainCircuit, 
  Clock, 
  Zap, 
  AlertTriangle,
  Award,
  TrendingUp,
  RotateCcw,
  Check,
  BookOpen,
  Target,
  ShieldCheck,
  HelpCircle,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { MicroPathway, LearnerProfile, ReTestResult, SubskillId, NextBestAction } from '../types';
import { CROSS_SKILL_PATHWAYS } from '../data/pathways';
import { SUBSKILLS_DICTIONARY } from '../data/mockContent';
import { apiService, profileStorage } from '../services/api';
import { LearningEngine } from '../engine';

interface MicroPathwayViewProps {
  pathwayId: string;
  profile: LearnerProfile;
  onUpdateProfile: (p: LearnerProfile) => void;
  onBackToOptimizer: () => void;
}

export const MicroPathwayView: React.FC<MicroPathwayViewProps> = ({
  pathwayId,
  profile,
  onUpdateProfile,
  onBackToOptimizer,
}) => {
  const [activePathwayId, setActivePathwayId] = useState<string>(pathwayId || CROSS_SKILL_PATHWAYS[0].id);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  
  // Step 1: Recognition
  const [step1SelectedIdx, setStep1SelectedIdx] = useState<number | null>(null);

  // Step 2: Guided Transformation
  const [step2Input, setStep2Input] = useState<string>('');
  const [step2Evaluation, setStep2Evaluation] = useState<any>(null);
  const [isEvaluatingStep2, setIsEvaluatingStep2] = useState<boolean>(false);
  const [step2Error, setStep2Error] = useState<string | null>(null);

  // Step 3: Transfer Task
  const [step3Input, setStep3Input] = useState<string>('');
  const [step3Evaluation, setStep3Evaluation] = useState<any>(null);
  const [isEvaluatingStep3, setIsEvaluatingStep3] = useState<boolean>(false);
  const [step3Error, setStep3Error] = useState<string | null>(null);

  // Step 4: Re-Test Verification
  const [retestAnswers, setRetestAnswers] = useState<Record<number, number>>({});
  const [retestResult, setRetestResult] = useState<ReTestResult | null>(null);
  const [isSubmittingRetest, setIsSubmittingRetest] = useState<boolean>(false);
  const [retestError, setRetestError] = useState<string | null>(null);
  const [nextActionAfterRetest, setNextActionAfterRetest] = useState<NextBestAction | null>(null);

  // Session persistence banner state
  const [hasResumedSession, setHasResumedSession] = useState<boolean>(false);

  const pathway = CROSS_SKILL_PATHWAYS.find((p) => p.id === activePathwayId) || CROSS_SKILL_PATHWAYS[0];
  const currentStep = pathway.steps[currentStepIdx] || pathway.steps[0];
  const subskillInfo = SUBSKILLS_DICTIONARY[pathway.triggerSubskill];
  const subskillName = subskillInfo?.name || pathway.triggerSubskill;

  // Find active error frequency if any
  const matchedActiveError = profile.activeErrors.find((e) => e.subskill === pathway.triggerSubskill);
  const currentMasteryBefore = profile.subskillMastery[pathway.triggerSubskill] || 50;

  // Load saved session on mount or pathway switch
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(`pathway_session_${pathway.id}`);
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        if (saved && saved.pathwayId === pathway.id) {
          if (typeof saved.currentStepIdx === 'number') setCurrentStepIdx(saved.currentStepIdx);
          if (saved.step1SelectedIdx !== undefined) setStep1SelectedIdx(saved.step1SelectedIdx);
          if (saved.step2Input) setStep2Input(saved.step2Input);
          if (saved.step2Evaluation) setStep2Evaluation(saved.step2Evaluation);
          if (saved.step3Input) setStep3Input(saved.step3Input);
          if (saved.step3Evaluation) setStep3Evaluation(saved.step3Evaluation);
          if (saved.retestAnswers) setRetestAnswers(saved.retestAnswers);
          if (saved.retestResult) {
            setRetestResult(saved.retestResult);
            const calculatedNextAction = LearningEngine.recommendation.getNextBestAction(profile);
            setNextActionAfterRetest(calculatedNextAction);
          }
          setHasResumedSession(true);
        }
      }
    } catch (e) {
      console.warn('Could not load saved pathway session', e);
    }
  }, [pathway.id]);

  // Save session state to localStorage
  useEffect(() => {
    if (!pathway) return;
    try {
      const sessionData = {
        pathwayId: pathway.id,
        currentStepIdx,
        step1SelectedIdx,
        step2Input,
        step2Evaluation,
        step3Input,
        step3Evaluation,
        retestAnswers,
        retestResult,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`pathway_session_${pathway.id}`, JSON.stringify(sessionData));
    } catch (e) {
      console.warn('Could not save pathway session', e);
    }
  }, [
    pathway.id,
    currentStepIdx,
    step1SelectedIdx,
    step2Input,
    step2Evaluation,
    step3Input,
    step3Evaluation,
    retestAnswers,
    retestResult
  ]);

  // Handle Step 2 Evaluation (Guided Transformation)
  const handleEvaluateStep2 = async () => {
    if (!step2Input.trim()) return;
    setIsEvaluatingStep2(true);
    setStep2Error(null);
    try {
      const res = await apiService.evaluateStepSubmission({
        stepType: 'Guided Transformation',
        promptInstruction: currentStep.instruction,
        userSubmission: step2Input,
        originalSentence: currentStep.content?.baseSentence || currentStep.content?.premise || ''
      });
      setStep2Evaluation(res);
    } catch (e: any) {
      console.error(e);
      setStep2Error(e.message || 'Không thể kết nối dịch vụ đánh giá lúc này. Câu trả lời của bạn đã được bảo lưu an toàn.');
    } finally {
      setIsEvaluatingStep2(false);
    }
  };

  // Handle Step 3 Evaluation (Transfer Task)
  const handleEvaluateStep3 = async () => {
    if (!step3Input.trim()) return;
    setIsEvaluatingStep3(true);
    setStep3Error(null);
    try {
      const res = await apiService.evaluateStepSubmission({
        stepType: 'Transfer Task (New Context Application)',
        promptInstruction: currentStep.instruction,
        userSubmission: step3Input,
        originalSentence: currentStep.content?.topicPrompt || currentStep.content?.task || ''
      });
      setStep3Evaluation(res);
    } catch (e: any) {
      console.error(e);
      setStep3Error(e.message || 'Không thể kết nối dịch vụ đánh giá lúc này. Câu trả lời của bạn đã được bảo lưu an toàn.');
    } finally {
      setIsEvaluatingStep3(false);
    }
  };

  // Handle Step 4 Finish (Re-Test Verification - Authoritative single source of truth)
  const handleFinishRetest = async () => {
    setIsSubmittingRetest(true);
    setRetestError(null);

    try {
      const questions = currentStep.content?.questions || [];
      const answersList = questions.map((_: any, idx: number) => retestAnswers[idx]);
      const expectedList = questions.map((q: any) => q.correctIndex);
      const scoreBefore = profile.subskillMastery[pathway.triggerSubskill] || 50;

      // Authoritative evaluation via RetestVerificationEngine
      const newRetestRecord = LearningEngine.verification.evaluateRetest({
        pathwayId: pathway.id,
        subskill: pathway.triggerSubskill,
        scoreBefore,
        answers: answersList,
        expectedAnswers: expectedList,
        priorAttemptsCount: matchedActiveError ? matchedActiveError.count : 3,
        errorPatternName: pathway.targetWeakness || subskillInfo?.targetWeakness
      });

      // Apply verified updates to learner profile (Bayesian update, error memory resolution)
      const updatedProfile = LearningEngine.verification.applyVerificationToProfile(profile, newRetestRecord);

      // Save updated profile
      profileStorage.saveProfile(updatedProfile);
      onUpdateProfile(updatedProfile);
      setRetestResult(newRetestRecord);

      // Immediately calculate Next Best Action for the newly adapted profile
      const nextAction = LearningEngine.recommendation.getNextBestAction(updatedProfile);
      setNextActionAfterRetest(nextAction);
    } catch (err: any) {
      console.error(err);
      setRetestError(err.message || 'Chưa thể xác minh bài làm lúc này. Vui lòng thử lại.');
    } finally {
      setIsSubmittingRetest(false);
    }
  };

  const handleResetPathway = () => {
    setCurrentStepIdx(0);
    setStep1SelectedIdx(null);
    setStep2Input('');
    setStep2Evaluation(null);
    setStep2Error(null);
    setStep3Input('');
    setStep3Evaluation(null);
    setStep3Error(null);
    setRetestAnswers({});
    setRetestResult(null);
    setRetestError(null);
    setNextActionAfterRetest(null);
    setHasResumedSession(false);
    try {
      localStorage.removeItem(`pathway_session_${pathway.id}`);
    } catch (e) {}
  };

  return (
    <div id="micro-pathway-container" className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* 1. Pathway Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onBackToOptimizer}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                title="Quay lại hôm nay"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại</span>
              </button>
              
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold uppercase tracking-wider">
                <GitMerge className="w-3 h-3" />
                Micro-Pathway Can Thiệp 15-20 Phút
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                <Target className="w-3 h-3 text-slate-500" />
                {subskillName}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Khắc phục: {pathway.targetWeakness || pathway.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              <strong className="text-slate-900">Mục tiêu:</strong> {pathway.objective || pathway.description}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>{pathway.durationMinutes} phút</span>
            </span>

            {matchedActiveError && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <AlertTriangle className="w-3 h-3" />
                Ghi nhận {matchedActiveError.count} lỗi gần đây
              </span>
            )}
          </div>
        </div>

        {/* Current Evidence Context Banner */}
        <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900 block">Bằng chứng định vị điểm nghẽn:</span>
            <p className="text-slate-600">
              {pathway.currentEvidenceContext || `Độ thuần thục ${subskillName} đạt ${currentMasteryBefore}%. Hệ thống chỉ định can thiệp 4 bước khép kín để triệt tiêu lỗi lặp lại.`}
            </p>
          </div>
        </div>

        {/* Resumed Session notification */}
        {hasResumedSession && !retestResult && (
          <div className="mt-3 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
              Đã khôi phục tiến độ làm dở của bạn (Bước {currentStepIdx + 1}/4).
            </span>
            <button
              onClick={handleResetPathway}
              className="text-[11px] font-bold text-indigo-700 hover:underline"
            >
              Làm lại từ đầu
            </button>
          </div>
        )}

        {/* 3 Pathways Tabs */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mr-1 hidden sm:inline">
            Chọn điểm nghẽn:
          </span>
          {CROSS_SKILL_PATHWAYS.map((p, pIdx) => (
            <button
              key={p.id}
              onClick={() => {
                setActivePathwayId(p.id);
                handleResetPathway();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                activePathwayId === p.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Pathway {pIdx + 1}</span>
              <span className="text-[10px] opacity-75 truncate max-w-[130px] sm:max-w-none">
                ({p.triggerSubskill.replace('reading_', '').replace('writing_', '')})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Step Tracker Indicator */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {pathway.steps.map((step, sIdx) => {
            const isCompleted = currentStepIdx > sIdx || retestResult !== null;
            const isCurrent = currentStepIdx === sIdx && retestResult === null;

            return (
              <button
                key={sIdx}
                onClick={() => {
                  if (sIdx <= currentStepIdx || isCompleted) setCurrentStepIdx(sIdx);
                }}
                className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-semibold shadow-xs ring-1 ring-indigo-500/20'
                    : isCompleted
                    ? 'bg-slate-50 border-slate-300 text-slate-800'
                    : 'bg-white border-slate-200 text-slate-400 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500">Bước {step.stepNumber}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  ) : null}
                </div>
                <span className="text-xs font-bold block truncate">
                  {step.type === 'recognition' ? '1. Nhận diện' :
                   step.type === 'transformation' ? '2. Biến đổi' :
                   step.type === 'transfer' ? '3. Vận dụng mới' : '4. Re-Test'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Step Interaction Body */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 space-y-6 shadow-2xs">
        
        {/* STEP 1: RECOGNITION */}
        {currentStepIdx === 0 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Bước 1: Nhận diện bẫy ngữ nghĩa (Recognition)
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Phân tích cấu trúc & bẫy sai lầm điển hình
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded">
                1 / 4
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentStep.instruction}
            </p>

            {/* Content card */}
            {currentStep.content?.originalSentence && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-800 space-y-1">
                <span className="text-indigo-700 block text-xs font-bold uppercase tracking-wide">
                  Câu gốc từ bài đọc học thuật:
                </span>
                <p className="font-serif text-slate-900 text-base italic">
                  "{currentStep.content.originalSentence}"
                </p>
                {currentStep.content?.targetWord && (
                  <p className="text-xs text-slate-500 pt-1">
                    <strong className="text-slate-700">Trọng tâm phân tích:</strong> {currentStep.content.targetWord}
                  </p>
                )}
              </div>
            )}

            {currentStep.content?.passageExcerpt && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-800 space-y-1">
                <span className="text-indigo-700 block text-xs font-bold uppercase tracking-wide">
                  Đoạn trích học thuật:
                </span>
                <p className="font-serif text-slate-900 text-sm leading-relaxed">
                  "{currentStep.content.passageExcerpt}"
                </p>
                {currentStep.content?.question && (
                  <p className="text-xs font-bold text-slate-800 pt-1">
                    ❓ {currentStep.content.question}
                  </p>
                )}
              </div>
            )}

            {currentStep.content?.academicSentence && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-800 space-y-2">
                <span className="text-indigo-700 block text-xs font-bold uppercase tracking-wide">
                  Mẫu câu học thuật Band 8.0+:
                </span>
                <p className="font-mono text-slate-900 text-sm font-semibold">
                  "{currentStep.content.academicSentence}"
                </p>
                {currentStep.content?.analysis && (
                  <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                    <strong className="text-slate-900">Phân tích cấu trúc:</strong> {currentStep.content.analysis}
                  </p>
                )}
              </div>
            )}

            {/* Options if drill has multiple choices */}
            {currentStep.content?.options && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                  Chọn phương án phân tích chuẩn xác nhất:
                </label>
                <div className="space-y-2.5">
                  {currentStep.content.options.map((opt: any, oIdx: number) => {
                    const optText = typeof opt === 'string' ? opt : opt.text;
                    const isSelected = step1SelectedIdx === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => setStep1SelectedIdx(oIdx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition flex flex-col gap-2 ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 font-medium">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-snug">{optText}</span>
                        </div>
                        {step1SelectedIdx !== null && opt.feedback && isSelected && (
                          <div className={`text-xs p-2.5 rounded-lg border mt-1 pl-3 font-medium leading-relaxed ${
                            opt.isCorrect 
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}>
                            <strong className="block mb-0.5">{opt.isCorrect ? '✅ Giải thích sư phạm:' : '⚠️ Bẫy sai lầm:'}</strong>
                            {opt.feedback}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                disabled={step1SelectedIdx === null}
                onClick={() => setCurrentStepIdx(1)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition"
              >
                <span>Sang Bước 2: Biến đổi có hướng dẫn</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GUIDED TRANSFORMATION */}
        {currentStepIdx === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Bước 2: Chuyển đổi cấu trúc có hướng dẫn (Guided Transformation)
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Thực hành cấu trúc chuyển hóa theo quy tắc học thuật
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded">
                2 / 4
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentStep.instruction}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-2.5">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">Đề bài yêu cầu:</div>
              <p className="text-slate-800 font-semibold">
                {currentStep.content?.prompt || currentStep.content?.instruction}
              </p>
              
              {currentStep.content?.baseSentence && (
                <div className="text-xs bg-white p-3 rounded-lg border border-slate-200 text-slate-800">
                  <strong className="text-slate-900 block mb-0.5">Câu gốc cần biến đổi:</strong>
                  <span className="font-serif italic">"{currentStep.content.baseSentence}"</span>
                </div>
              )}

              {currentStep.content?.premise && (
                <div className="text-xs bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <p className="text-slate-800 font-medium">{currentStep.content.premise}</p>
                  <p className="text-slate-800 font-medium">{currentStep.content.conclusion}</p>
                </div>
              )}

              {currentStep.content?.simpleSentences && (
                <div className="text-xs text-slate-700 space-y-1.5">
                  <span className="font-semibold text-slate-800 block">Các câu đơn cần kết hợp:</span>
                  {currentStep.content.simpleSentences.map((s: string, idx: number) => (
                    <div key={idx} className="font-mono bg-white p-2 rounded border border-slate-200 text-slate-900">{s}</div>
                  ))}
                </div>
              )}

              {currentStep.content?.transformationHint && (
                <div className="text-xs text-indigo-900 bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100">
                  <strong className="text-indigo-950 block mb-0.5">💡 Gợi ý cấu trúc:</strong>
                  <span>{currentStep.content.transformationHint}</span>
                </div>
              )}
            </div>

            {/* Input & Evaluation */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                Viết câu biến đổi học thuật của bạn:
              </label>
              <textarea
                value={step2Input}
                onChange={(e) => setStep2Input(e.target.value)}
                placeholder="Gõ câu biến đổi của bạn tại đây..."
                rows={3}
                className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 text-sm font-mono resize-none shadow-2xs"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {step2Input.trim().split(/\s+/).filter(Boolean).length} từ
                </span>
                <button
                  disabled={!step2Input.trim() || isEvaluatingStep2}
                  onClick={handleEvaluateStep2}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-2xs"
                >
                  {isEvaluatingStep2 ? (
                    <>
                      <BrainCircuit className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang thẩm định...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Thẩm định câu này</span>
                    </>
                  )}
                </button>
              </div>

              {step2Error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
                  <span>{step2Error}</span>
                  <button onClick={handleEvaluateStep2} className="font-bold underline ml-2">Thử lại</button>
                </div>
              )}

              {step2Evaluation && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Kết quả thẩm định:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100/80 text-emerald-900 font-bold border border-emerald-200">
                      {step2Evaluation.scorePercent}% Chuẩn Xác
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    {step2Evaluation.feedback}
                  </p>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-slate-800 space-y-1">
                    <strong className="text-indigo-700 block text-xs">✨ Phiên bản tối ưu Band 8.0+:</strong>
                    <span className="font-mono text-indigo-950 font-medium block">{step2Evaluation.band8ModelVersion}</span>
                  </div>

                  {currentStep.content?.modelExplanation && (
                    <p className="text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
                      <strong className="text-slate-800">Quy tắc học thuật:</strong> {currentStep.content.modelExplanation}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStepIdx(0)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition shadow-2xs"
              >
                Quay lại Bước 1
              </button>
              <button
                onClick={() => setCurrentStepIdx(2)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition"
              >
                <span>Sang Bước 3: Ứng dụng ngữ cảnh mới (Transfer)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TRANSFER TASK (CRITICAL REQUIREMENT) */}
        {currentStepIdx === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Bước 3: Vận dụng sang ngữ cảnh mới (Transfer Task)
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Ứng dụng kỹ năng vào đề bài hoàn toàn mới
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded">
                3 / 4
              </span>
            </div>

            <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Thử thách chuyển giao năng lực:</strong>
                <p className="text-indigo-900">
                  Không chỉ lặp lại bài cũ. Bạn đang áp dụng nguyên tắc vừa học vào một ngữ cảnh và đề bài hoàn toàn mới.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentStep.instruction}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-2.5">
              <strong className="text-indigo-700 block text-xs uppercase tracking-wide">
                Đề bài áp dụng mới (New Context Prompt):
              </strong>
              <p className="text-slate-900 font-serif italic text-sm">
                {currentStep.content?.topicPrompt || currentStep.content?.prompt}
              </p>
              <div className="text-xs bg-white p-3 rounded-lg border border-slate-200 text-slate-800">
                <strong className="text-slate-900 block mb-0.5">Nhiệm vụ cụ thể:</strong>
                {currentStep.content?.task}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                Câu / Đoạn văn chuyển giao của bạn:
              </label>
              <textarea
                value={step3Input}
                onChange={(e) => setStep3Input(e.target.value)}
                placeholder="Viết câu / đoạn văn của bạn cho đề bài mới tại đây..."
                rows={4}
                className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 text-sm font-mono resize-y shadow-2xs"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {step3Input.trim().split(/\s+/).filter(Boolean).length} từ
                </span>
                <button
                  disabled={!step3Input.trim() || isEvaluatingStep3}
                  onClick={handleEvaluateStep3}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-2xs"
                >
                  {isEvaluatingStep3 ? (
                    <>
                      <BrainCircuit className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang thẩm định...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Thẩm định bài chuyển giao</span>
                    </>
                  )}
                </button>
              </div>

              {step3Error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
                  <span>{step3Error}</span>
                  <button onClick={handleEvaluateStep3} className="font-bold underline ml-2">Thử lại</button>
                </div>
              )}

              {/* STRUCTURED TRANSFER FEEDBACK (REQUIREMENT 8) */}
              {step3Evaluation && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                      <FileCheck className="w-4 h-4 text-indigo-600" /> Phân tích chuyển giao năng lực:
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      Chất lượng {step3Evaluation.scorePercent}%
                    </span>
                  </div>

                  {/* 1. What you did well */}
                  {step3Evaluation.whatYouDidWell && (
                    <div className="space-y-1">
                      <strong className="text-emerald-800 font-bold block flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Điểm làm tốt:
                      </strong>
                      <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                        {step3Evaluation.whatYouDidWell}
                      </p>
                    </div>
                  )}

                  {/* 2. What still needs correction */}
                  {step3Evaluation.whatNeedsCorrection && (
                    <div className="space-y-1">
                      <strong className="text-amber-800 font-bold block flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Điểm cần chỉnh sửa:
                      </strong>
                      <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                        {step3Evaluation.whatNeedsCorrection}
                      </p>
                    </div>
                  )}

                  {/* 3. Evidence from student's text */}
                  {step3Evaluation.evidence && (
                    <div className="space-y-1">
                      <strong className="text-slate-800 font-bold block">
                        🔍 Bằng chứng trích xuất từ câu của bạn:
                      </strong>
                      <p className="font-mono text-indigo-900 bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
                        "{step3Evaluation.evidence}"
                      </p>
                    </div>
                  )}

                  {/* 4. Better Version Band 8.0+ */}
                  <div className="space-y-1">
                    <strong className="text-indigo-800 font-bold block">
                      ✨ Phiên bản tối ưu Band 8.0+ (Better Version):
                    </strong>
                    <p className="font-mono text-slate-900 bg-white p-3 rounded-lg border border-slate-200 font-medium">
                      {step3Evaluation.betterVersion || step3Evaluation.band8ModelVersion}
                    </p>
                  </div>

                  {/* 5. Transferable Principle */}
                  {step3Evaluation.principle && (
                    <div className="p-3 rounded-lg bg-slate-900 text-white space-y-1">
                      <strong className="text-amber-300 font-bold block text-[11px] uppercase tracking-wider">
                        📌 Nguyên tắc chuyển giao (Transferable Rule):
                      </strong>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {step3Evaluation.principle}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStepIdx(1)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition shadow-2xs"
              >
                Quay lại Bước 2
              </button>
              <button
                onClick={() => setCurrentStepIdx(3)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition"
              >
                <span>Sang Bước 4: Re-Test Kiểm Chứng Tiến Bộ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: RE-TEST VERIFICATION */}
        {currentStepIdx === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Bước 4: Kiểm chứng tiến bộ (Re-Test Verification)
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Bài kiểm tra đối chứng xác minh triệt tiêu điểm nghẽn
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded">
                4 / 4 (Verification)
              </span>
            </div>

            {!retestResult ? (
              <div className="space-y-6">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {currentStep.instruction}
                </p>

                <div className="space-y-6">
                  {currentStep.content?.questions?.map((q: any, qIdx: number) => (
                    <div key={qIdx} className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                          Câu hỏi Re-test {qIdx + 1}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                        {q.prompt}
                      </p>

                      <div className="space-y-2">
                        {q.options?.map((opt: string, oIdx: number) => {
                          const isSelected = retestAnswers[qIdx] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => setRetestAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                              className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition flex items-start gap-2.5 ${
                                isSelected
                                  ? 'bg-indigo-50/90 border-indigo-500 text-indigo-950 font-medium shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {retestError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
                    <span>{retestError}</span>
                    <button onClick={handleFinishRetest} className="font-bold underline ml-2">Thử lại</button>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStepIdx(2)}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition shadow-2xs"
                  >
                    Quay lại Bước 3
                  </button>
                  <button
                    disabled={Object.keys(retestAnswers).length < (currentStep.content?.questions?.length || 1) || isSubmittingRetest}
                    onClick={handleFinishRetest}
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition"
                  >
                    {isSubmittingRetest ? (
                      <>
                        <BrainCircuit className="w-4 h-4 animate-spin" />
                        <span>Đang thẩm định & cập nhật hồ sơ...</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Nộp bài Re-test & Lưu Chứng Cứ Tiến Bộ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* RETEST RESULT BADGE, BEFORE/AFTER DELTA & ADAPTATION */
              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-6 shadow-xs animate-fadeIn">
                {/* Result Header Badge */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-2xs flex-shrink-0 ${
                    retestResult.status === 'verified_progress'
                      ? 'bg-emerald-600'
                      : retestResult.status === 'partial_progress'
                      ? 'bg-indigo-600'
                      : 'bg-amber-600'
                  }`}>
                    {retestResult.status === 'verified_progress' ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <TrendingUp className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                      retestResult.status === 'verified_progress'
                        ? 'text-emerald-700'
                        : retestResult.status === 'partial_progress'
                        ? 'text-indigo-700'
                        : 'text-amber-700'
                    }`}>
                      {retestResult.status === 'verified_progress'
                        ? 'Verified Progress (Tiến bộ đã kiểm chứng)'
                        : retestResult.status === 'partial_progress'
                        ? 'Partial Progress (Tiến bộ bước đầu)'
                        : 'Needs Practice (Cần củng cố thêm)'}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Hoàn thành chu trình can thiệp & kiểm chứng!
                    </h3>
                  </div>
                </div>

                {/* Quantitative Before / After / Delta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-xs text-slate-500 block mb-1 font-semibold">Điểm Trước Can Thiệp</span>
                    <span className="text-2xl font-bold text-slate-600">{retestResult.scoreBefore}%</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-xs text-emerald-800 block mb-1 font-semibold">Điểm Sau Re-Test</span>
                    <span className="text-3xl font-extrabold text-emerald-700">{retestResult.scoreAfter}%</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-xs text-indigo-800 block mb-1 font-semibold">Độ Tăng Trưởng (Delta)</span>
                    <span className="text-2xl font-extrabold text-indigo-700">
                      {retestResult.improvementDelta >= 0 ? '+' : ''}{retestResult.improvementDelta}%
                    </span>
                  </div>
                </div>

                {/* Evidence Count Breakdown */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Chuỗi dữ liệu kiểm chứng:</span>
                  <span className="font-medium text-slate-600">
                    {retestResult.evidenceCount?.priorAttempts || 3} bài làm trước đó → 1 can thiệp 4 bước → 1 Re-test đối chứng
                  </span>
                </div>

                {/* ADAPTATION TRIPLE EXPLANATION (WHAT HAPPENED, WHAT CHANGED, WHAT NEXT) */}
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs leading-relaxed">
                    <div>
                      <strong className="text-slate-900 font-bold block mb-1">1. Chuyện gì đã xảy ra? (What happened?)</strong>
                      <p className="text-slate-700">
                        {retestResult.whatHappened || retestResult.evidenceSummary}
                      </p>
                    </div>

                    <div className="border-t border-slate-200/80 pt-2.5">
                      <strong className="text-slate-900 font-bold block mb-1">2. Điểm yếu nào đã thay đổi? (What changed?)</strong>
                      <p className="text-slate-700">
                        {retestResult.whatChanged || `Điểm nghẽn "${pathway.targetWeakness || subskillName}" đã được kiểm chứng và cập nhật độ thuần thục mới vào hồ sơ năng lực.`}
                      </p>
                    </div>

                    {nextActionAfterRetest && (
                      <div className="border-t border-slate-200/80 pt-2.5">
                        <strong className="text-indigo-900 font-bold block mb-1">3. Bước tiếp theo tối ưu là gì? (What next?)</strong>
                        <p className="text-slate-700">
                          Hệ thống đã tự động tính toán lại lộ trình: <strong className="text-slate-900">{nextActionAfterRetest.title}</strong> ({nextActionAfterRetest.estimatedMinutes} phút). {nextActionAfterRetest.expectedOutcome}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Navigation Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={handleResetPathway}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm lại Pathway này</span>
                  </button>

                  <button
                    onClick={onBackToOptimizer}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    <span>Tiếp tục lộ trình hôm nay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
