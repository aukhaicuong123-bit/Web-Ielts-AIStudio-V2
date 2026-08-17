import React, { useState } from 'react';
import { 
  LearnerProfile, 
  SubskillId, 
  ErrorTag, 
  ErrorPattern,
  RubricScores,
  NextBestAction
} from '../types';
import { 
  DIAGNOSTIC_READING_QUESTIONS, 
  DIAGNOSTIC_WRITING_TASK,
  DiagnosticReadingQuestion
} from '../data/diagnosticContent';
import { LearningEngine } from '../engine';
import { AIService } from '../services/ai/aiService';
import { profileStorage } from '../services/api';
import { DiagnosticResultsView, DiagnosticResultData } from './DiagnosticResultsView';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  BookOpen, 
  PenTool, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  BrainCircuit, 
  AlertCircle, 
  HelpCircle,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Layers,
  Info
} from 'lucide-react';

export interface DiagnosticFlowProps {
  profile: LearnerProfile;
  initialViewResults?: boolean;
  onDiagnosticComplete: (updatedProfile: LearnerProfile) => void;
  onNavigateToOptimizer: () => void;
  onNavigate?: (route: any) => void;
}

export const DiagnosticFlow: React.FC<DiagnosticFlowProps> = ({
  profile,
  initialViewResults = false,
  onDiagnosticComplete,
  onNavigateToOptimizer,
  onNavigate
}) => {
  // Flow steps: 0: Intro, 1..N: Reading Questions, (N+1): Writing Task, (N+2): Analyzing, (N+3): Results
  const totalReadingQuestions = DIAGNOSTIC_READING_QUESTIONS.length;
  const [currentStep, setCurrentStep] = useState<number>(initialViewResults ? 99 : 0);

  // Form states
  const [readingAnswers, setReadingAnswers] = useState<Record<string, string>>({});
  const [writingSubmission, setWritingSubmission] = useState<string>('');
  
  // Analysis progression states
  const [analysisPhase, setAnalysisPhase] = useState<string>('Kiểm tra câu trả lời Reading...');
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Result state
  const [resultData, setResultData] = useState<DiagnosticResultData | null>(() => {
    if (initialViewResults && profile.hasCompletedDiagnostic) {
      // Reconstruct existing diagnostic result for display
      const nextAction = LearningEngine.recommendation.getNextBestAction(profile, { availableMinutes: 20 });
      return {
        completedAt: 'Đã hoàn thành trước đó',
        estimatedBand: profile.currentEstimatedBand || 5.5,
        confidenceLevel: 'Moderate confidence',
        strongestSignals: [
          'Khả năng định vị thông tin cơ bản trong văn bản học thuật',
          'Nhận diện các từ khóa chuyên ngành'
        ],
        needsAttention: [
          'Bẫy paraphrase từ đồng nghĩa bóp méo ngữ nghĩa gốc',
          'Chuỗi suy luận nhân quả học thuật trong đoạn văn'
        ],
        recurringErrorPatterns: profile.activeErrors.map(e => ({
          code: e.code,
          name: e.name,
          explanation: `Phát hiện ${e.count} lần trong các bài làm gần đây.`
        })),
        highestImpactWeakness: {
          subskillId: nextAction.targetSubskill,
          subskillName: nextAction.targetSubskillName,
          reason: nextAction.reasons[0] || 'Điểm nghẽn có trọng số mất điểm cao nhất.'
        },
        subskillScores: {
          'Paraphrase Precision': profile.subskillMastery.reading_paraphrase || 45,
          'Cause-Effect Logic': profile.subskillMastery.reading_cause_effect || 50,
          'Detail Inference': profile.subskillMastery.reading_detail_inference || 60,
          'Writing Cohesion & Grammar': profile.subskillMastery.writing_coherence_cohesion || 50
        },
        nextBestAction: nextAction
      };
    }
    return null;
  });

  const handleSelectReadingAnswer = (questionId: string, optionId: string) => {
    setReadingAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleStartDiagnostic = () => {
    setCurrentStep(1);
    setAnalysisError(null);
  };

  const handleFinishDiagnostic = async () => {
    setCurrentStep(totalReadingQuestions + 2); // Analysis state
    setAnalysisError(null);

    try {
      // Step 1: Evaluate Reading
      setAnalysisPhase('Kiểm tra các câu trả lời Reading & phân loại bẫy ngữ nghĩa...');
      await new Promise(r => setTimeout(r, 600));

      const detectedErrors: ErrorTag[] = [];
      const strongestSignals: string[] = [];
      const needsAttention: string[] = [];
      const subskillCalculations: Record<SubskillId, number> = { ...profile.subskillMastery };

      DIAGNOSTIC_READING_QUESTIONS.forEach((q) => {
        const userChoiceId = readingAnswers[q.id];
        const chosenOption = q.options.find(o => o.id === userChoiceId);
        
        if (chosenOption?.isCorrect) {
          subskillCalculations[q.subskillId] = 85;
          strongestSignals.push(`Làm chủ tốt kỹ năng: ${q.subskillName}`);
        } else {
          subskillCalculations[q.subskillId] = 35;
          needsAttention.push(`Cần can thiệp: ${q.subskillName}`);
          
          if (chosenOption?.errorTagCode) {
            detectedErrors.push({
              id: `err_diag_${Date.now()}_${q.id}`,
              code: chosenOption.errorTagCode,
              category: 'Reading Comprehension',
              name: chosenOption.errorTagName || 'Semantic Distortion Trap',
              subskill: q.subskillId,
              severity: 'high',
              count: 1,
              lastEncountered: 'Vừa phát hiện qua bài chẩn đoán'
            });
          }
        }
      });

      // Step 2: Analyze Writing via AIService
      setAnalysisPhase('Phân tích cú pháp, tính mạch lạc và từ vựng của bài viết Writing...');
      let writingRubric: RubricScores = {
        taskResponse: 5.5,
        coherenceCohesion: 5.0,
        lexicalResource: 5.5,
        grammaticalRange: 5.0,
        overallBand: 5.5
      };

      try {
        if (writingSubmission.trim().split(/\s+/).length >= 25) {
          const aiWritingRes = await AIService.analyzeWriting({
            essayText: writingSubmission,
            prompt: DIAGNOSTIC_WRITING_TASK.prompt,
            taskType: 'Diagnostic Mini-Writing',
            topic: DIAGNOSTIC_WRITING_TASK.topic
          });
          if (aiWritingRes.rubricScores) {
            writingRubric = aiWritingRes.rubricScores;
          }
        }
      } catch (err) {
        // Non-blocking fallback for writing heuristic evaluation
        const wordCount = writingSubmission.trim().split(/\s+/).length;
        const hasConnectors = /(because|therefore|consequently|as a result|furthermore|moreover)/i.test(writingSubmission);
        writingRubric = {
          taskResponse: wordCount >= 40 ? 6.0 : 5.0,
          coherenceCohesion: hasConnectors ? 5.5 : 4.5,
          lexicalResource: 5.5,
          grammaticalRange: 5.0,
          overallBand: 5.5
        };
      }

      // Compute writing subskill scores
      subskillCalculations.writing_task_response = Math.round((writingRubric.taskResponse / 9) * 100);
      subskillCalculations.writing_coherence_cohesion = Math.round((writingRubric.coherenceCohesion / 9) * 100);
      subskillCalculations.writing_lexical_resource = Math.round((writingRubric.lexicalResource / 9) * 100);
      subskillCalculations.writing_complex_grammar = Math.round((writingRubric.grammaticalRange / 9) * 100);

      if (writingRubric.coherenceCohesion < 5.5) {
        needsAttention.push('Mạch lạc câu phức và liên từ nhân quả trong Writing');
      } else {
        strongestSignals.push('Khả năng liên kết câu cơ bản trong đoạn văn học thuật');
      }

      // Compute Reading Band Score from questions correct
      let correctReadingCount = 0;
      DIAGNOSTIC_READING_QUESTIONS.forEach((q) => {
        const userChoiceId = readingAnswers[q.id];
        const chosenOption = q.options.find(o => o.id === userChoiceId);
        if (chosenOption?.isCorrect) correctReadingCount++;
      });
      const readingBand = correctReadingCount === 3 ? 7.5 : correctReadingCount === 2 ? 6.5 : correctReadingCount === 1 ? 5.0 : 4.0;
      const writingBand = writingRubric.overallBand || 5.5;
      const calculatedBand = Math.min(9.0, Math.max(4.0, Math.round(((readingBand + writingBand) / 2) * 2) / 2));

      // Step 3: Update Profile and Recalibrate Evidence
      setAnalysisPhase('Đối chiếu các mẫu lỗi với bộ nhớ năng lực Subskill & cập nhật hồ sơ...');
      await new Promise(r => setTimeout(r, 500));

      const updatedProfile: LearnerProfile = {
        ...profile,
        hasCompletedDiagnostic: true,
        assessmentStatus: 'diagnostic_completed',
        aiEvidenceEstimate: calculatedBand,
        currentEstimatedBand: calculatedBand,
        isDemoProfile: false,
        subskillMastery: subskillCalculations,
        baselineMastery: subskillCalculations,
        activeErrors: [
          ...detectedErrors,
          ...profile.activeErrors.filter(e => !detectedErrors.some(d => d.code === e.code))
        ],
        recentActivity: [
          {
            id: `diag_${Date.now()}`,
            type: 'diagnostic',
            title: `Hoàn thành bài kiểm tra chẩn đoán 10 phút (Reading + Writing)`,
            timestamp: 'Vừa xong',
            scoreChange: `Baseline: Band ${calculatedBand.toFixed(1)}`
          },
          ...profile.recentActivity
        ]
      };

      // Step 4: Calculate Next Best Action from LearningEngine
      setAnalysisPhase('Tổng hợp bằng chứng và kích hoạt Prioritization Engine...');
      await new Promise(r => setTimeout(r, 400));

      const nextAction = LearningEngine.recommendation.getNextBestAction(updatedProfile, {
        availableMinutes: updatedProfile.preferredSessionMinutes || 20
      });

      // Save updated profile
      profileStorage.saveProfile(updatedProfile);
      onDiagnosticComplete(updatedProfile);

      // Create Result Data
      const finalResultData: DiagnosticResultData = {
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedBand: calculatedBand,
        confidenceLevel: 'Moderate confidence',
        strongestSignals: strongestSignals.length > 0 ? strongestSignals : ['Khả năng nhận diện từ khóa cơ bản'],
        needsAttention: needsAttention.length > 0 ? needsAttention : ['Cần rèn luyện tính chính xác trong paraphrase'],
        recurringErrorPatterns: detectedErrors.length > 0 
          ? detectedErrors.map(e => ({
              code: e.code,
              name: e.name,
              explanation: 'Bạn thường chọn các đáp án chứa từ khóa giống bài đọc nhưng bị bóp méo mức độ chắc chắn hoặc phóng đại ý nghĩa gốc.',
              sampleQuote: undefined
            }))
          : [{
              code: 'ERR_PARAPHRASE_DISTORTION',
              name: 'Bẫy paraphrase từ đồng nghĩa (Semantic Distortion)',
              explanation: 'Xu hướng chọn đáp án có từ vựng tương đương nhưng không bảo toàn nguyên vẹn tính logic của câu gốc.'
            }],
        highestImpactWeakness: {
          subskillId: nextAction.targetSubskill,
          subskillName: nextAction.targetSubskillName,
          reason: nextAction.reasons[0] || 'Điểm nghẽn có trọng số mất điểm cao nhất theo dữ liệu quan sát.'
        },
        subskillScores: {
          'Paraphrase Precision': subskillCalculations.reading_paraphrase || 45,
          'Cause-Effect Logic': subskillCalculations.reading_cause_effect || 50,
          'Detail Inference': subskillCalculations.reading_detail_inference || 60,
          'Writing Coherence & Grammar': subskillCalculations.writing_coherence_cohesion || 50
        },
        nextBestAction: nextAction
      };

      setResultData(finalResultData);
      setCurrentStep(99); // Results step
    } catch (err: any) {
      setAnalysisError(err.message || 'Lỗi khi xử lý chẩn đoán. Vui lòng thử lại.');
      setCurrentStep(totalReadingQuestions + 1); // Go back to writing step to allow retry
    }
  };

  const handleRetake = () => {
    setReadingAnswers({});
    setWritingSubmission('');
    setResultData(null);
    setCurrentStep(0);
  };

  // -------------------------------------------------------------
  // RENDER STEP 99: DIAGNOSTIC RESULTS
  // -------------------------------------------------------------
  if (currentStep === 99 && resultData) {
    return (
      <DiagnosticResultsView
        resultData={resultData}
        profile={profile}
        onNavigateToToday={onNavigateToOptimizer}
        onRetakeDiagnostic={handleRetake}
      />
    );
  }

  // -------------------------------------------------------------
  // RENDER STEP (N+2): ANALYSIS PROGRESS
  // -------------------------------------------------------------
  if (currentStep === totalReadingQuestions + 2) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mx-auto">
            <BrainCircuit className="w-7 h-7 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              Đang Phân Tích Bằng Chứng Năng Lực...
            </h2>
            <p className="text-sm text-indigo-700 font-medium animate-pulse">
              {analysisPhase}
            </p>
          </div>

          <div className="space-y-2 max-w-md mx-auto text-left pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đối chiếu lỗi nhận diện trong Reading với mẫu chuẩn</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Trích xuất tín hiệu Coherence & Grammar từ bài viết</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
              <span>Định vị điểm nghẽn có tỷ lệ mất điểm cao nhất</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER STEP 0: INTRO SCREEN
  // -------------------------------------------------------------
  if (currentStep === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-100 text-xs font-bold uppercase tracking-wider">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Khảo sát chẩn đoán 10 phút (Learning Diagnostic)</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Khảo Sát Chẩn Đoán Điểm Nghẽn Học Thuật
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hệ thống không yêu cầu bạn phải giải toàn bộ đề thi 3 tiếng. Bài chẩn đoán 10 phút này tập trung bóc tách các mẫu lỗi tư duy cốt lõi để lập hồ sơ can thiệp ngay lập tức.
            </p>
          </div>

          {/* What this measures vs What it does not */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Những gì bài kiểm tra này đo lường:</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Khả năng nhận diện bẫy bóp méo paraphrase trong Reading</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Khả năng bóc tách chuỗi quan hệ nhân quả học thuật</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Mức độ mạch lạc & cú pháp câu phức trong Writing</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Mẫu lỗi tư duy có tần suất lặp lại cao nhất</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-slate-500" />
                <span>Những gì bài kiểm tra KHÔNG đo lường:</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>Điểm thi IELTS chính thức có giá trị pháp lý</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>Đầy đủ 4 kỹ năng trong phòng thi áp lực dài hạn</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>Đánh giá chủ quan của giám khảo khảo thí trực tiếp</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-indigo-950">
              <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>Thời lượng ước tính: <strong>8 - 10 phút</strong> (3 câu Reading + 1 đoạn mini Writing)</span>
            </div>
            <Button
              id="start-diagnostic-flow-btn"
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={handleStartDiagnostic}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold flex-shrink-0"
            >
              Bắt đầu chẩn đoán ngay
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER STEP 1..N: READING QUESTIONS
  // -------------------------------------------------------------
  if (currentStep >= 1 && currentStep <= totalReadingQuestions) {
    const questionIndex = currentStep - 1;
    const currentQ = DIAGNOSTIC_READING_QUESTIONS[questionIndex];
    const selectedOptionId = readingAnswers[currentQ.id];

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Step Tracker */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Phần 1: Reading Diagnostic</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Câu {currentStep} / {totalReadingQuestions + 1}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {DIAGNOSTIC_READING_QUESTIONS.map((q, idx) => (
              <div
                key={q.id}
                className={`h-1.5 rounded-full transition-all ${
                  idx === questionIndex
                    ? 'w-6 bg-slate-900'
                    : readingAnswers[q.id]
                    ? 'w-3 bg-emerald-600'
                    : 'w-3 bg-slate-200'
                }`}
              />
            ))}
            <div className="w-3 h-1.5 rounded-full bg-slate-200" title="Writing Task" />
          </div>
        </div>

        {/* Question Container */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {currentQ.subskillName}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {currentQ.difficulty}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {currentQ.passageTitle}
            </h2>
          </div>

          {/* Academic Passage Excerpt */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm leading-relaxed text-slate-800 font-serif">
            <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Đoạn trích học thuật:
            </span>
            "{currentQ.passageText}"
          </div>

          {/* Prompt */}
          <div className="space-y-3">
            <label className="text-xs sm:text-sm font-bold text-slate-900 block leading-relaxed">
              {currentQ.prompt}
            </label>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`diag-opt-${currentQ.id}-${opt.id}`}
                    onClick={() => handleSelectReadingAnswer(currentQ.id, opt.id)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-600 text-indigo-950 font-medium shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {opt.id}
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
              className="text-xs font-semibold"
            >
              Quay lại
            </Button>

            <Button
              id={`diag-next-btn-${currentStep}`}
              variant="primary"
              size="md"
              disabled={!selectedOptionId}
              onClick={() => setCurrentStep(currentStep + 1)}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              {currentStep === totalReadingQuestions ? 'Sang bài Writing' : 'Câu tiếp theo'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER STEP (N+1): WRITING TASK
  // -------------------------------------------------------------
  if (currentStep === totalReadingQuestions + 1) {
    const wordCount = writingSubmission.trim() ? writingSubmission.trim().split(/\s+/).length : 0;
    const isWordCountSufficient = wordCount >= DIAGNOSTIC_WRITING_TASK.minWords;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-50 text-purple-800 text-xs font-bold border border-purple-100">
              <PenTool className="w-3.5 h-3.5" />
              <span>Phần 2: Writing Diagnostic</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Câu {totalReadingQuestions + 1} / {totalReadingQuestions + 1}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {DIAGNOSTIC_READING_QUESTIONS.map((q) => (
              <div key={q.id} className="w-3 h-1.5 rounded-full bg-emerald-600" />
            ))}
            <div className="w-6 h-1.5 rounded-full bg-slate-900" />
          </div>
        </div>

        {/* Writing Prompt Container */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Chủ đề: {DIAGNOSTIC_WRITING_TASK.topic}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              "{DIAGNOSTIC_WRITING_TASK.prompt}"
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {DIAGNOSTIC_WRITING_TASK.instructions}
            </p>
          </div>

          {/* Text Area */}
          <div className="space-y-1.5">
            <textarea
              id="diagnostic-writing-textarea"
              value={writingSubmission}
              onChange={(e) => setWritingSubmission(e.target.value)}
              placeholder="Ví dụ: Investing in comprehensive clean public transit allows municipal governments to substantially mitigate severe traffic congestion. Consequently, this leads to lower carbon emissions and reduced commuter travel times..."
              rows={5}
              className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-xs sm:text-sm text-slate-900 placeholder-slate-400 resize-none shadow-2xs"
            />

            <div className="flex justify-between items-center text-xs text-slate-500">
              <span className={`font-mono ${wordCount < DIAGNOSTIC_WRITING_TASK.minWords ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}`}>
                Số từ hiện tại: {wordCount} từ (Khuyến nghị: {DIAGNOSTIC_WRITING_TASK.recommendedWords})
              </span>
              <span className="text-[11px] text-slate-400">
                Tối thiểu {DIAGNOSTIC_WRITING_TASK.minWords} từ để phân tích
              </span>
            </div>
          </div>

          {analysisError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentStep(totalReadingQuestions)}
              className="text-xs font-semibold"
            >
              Quay lại Reading
            </Button>

            <Button
              id="finish-diagnostic-submit-btn"
              variant="primary"
              size="md"
              disabled={!isWordCountSufficient}
              onClick={handleFinishDiagnostic}
              icon={<Sparkles className="w-4 h-4 text-amber-400" />}
              iconPosition="right"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Hoàn thành & Phân tích bằng chứng
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
