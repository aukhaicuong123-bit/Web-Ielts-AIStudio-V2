import React, { useState } from 'react';
import { 
  LearnerProfile, 
  ZeroClimberProgress, 
  DailyClimbRecord 
} from '../../types';
import { 
  LESSON_1_CONTENT, 
  ZEROCLIMBER_LESSON_1 
} from './ZeroClimberData';
import { evaluateLesson1ProductionLocally, LocalEvaluationResult } from './ZeroClimberEvaluator';
import { AIService } from '../../services/ai/aiService';
import { ProfileService } from '../../services/profile/profileService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Mountain, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  RotateCcw, 
  Volume2, 
  Lightbulb, 
  BookOpen, 
  Check, 
  HelpCircle,
  Trophy,
  PartyPopper,
  Compass
} from 'lucide-react';

export interface ZeroClimberLessonViewProps {
  profile: LearnerProfile;
  onUpdateProfile: (profile: LearnerProfile) => void;
  onBackToClimb: () => void;
}

export const ZeroClimberLessonView: React.FC<ZeroClimberLessonViewProps> = ({
  profile,
  onUpdateProfile,
  onBackToClimb
}) => {
  // Step 1: Models | Step 2: MCQ | Step 3: Fill | Step 4: Reorder | Step 5: Production | Step 6: Complete
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // MCQ State
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
  const [mcqSubmitted, setMcqSubmitted] = useState<boolean>(false);

  // Fill State
  const [fillAnswers, setFillAnswers] = useState<Record<string, string>>({});
  const [fillSubmitted, setFillSubmitted] = useState<boolean>(false);

  // Reorder State
  const [reorderAnswers, setReorderAnswers] = useState<Record<string, string[]>>({
    reorder_1: [],
    reorder_2: [],
    reorder_3: []
  });
  const [reorderSubmitted, setReorderSubmitted] = useState<boolean>(false);

  // Production State (AI Feedback)
  const [productionText, setProductionText] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<{
    isCorrect: boolean;
    feedback: string;
    correctedSentence: string;
    explanation: string;
    source: 'local_deterministic' | 'ai_evaluated';
  } | null>(null);

  // Calculate completion percentage
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  // Handle MCQ selection
  const handleSelectMCQ = (questionId: string, optionId: string) => {
    setMcqAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  // Handle Fill selection
  const handleSelectFill = (exerciseId: string, word: string) => {
    setFillAnswers(prev => ({ ...prev, [exerciseId]: word }));
  };

  // Handle Reorder click on word bank
  const handleWordClickReorder = (exerciseId: string, word: string) => {
    const currentList = reorderAnswers[exerciseId] || [];
    if (currentList.includes(word)) {
      // Remove word
      setReorderAnswers(prev => ({
        ...prev,
        [exerciseId]: currentList.filter(w => w !== word)
      }));
    } else {
      // Add word
      setReorderAnswers(prev => ({
        ...prev,
        [exerciseId]: [...currentList, word]
      }));
    }
  };

  // Handle Free Production Submission to AI
  const handleEvaluateProduction = async () => {
    if (!productionText.trim()) return;

    const localResult: LocalEvaluationResult =
      evaluateLesson1ProductionLocally(productionText);

    if (localResult.isDeterminedLocally) {
      setAiFeedback({
        isCorrect: localResult.isCorrect,
        feedback: localResult.feedback,
        correctedSentence: localResult.correctedSentence,
        explanation: localResult.explanation,
        source: 'local_deterministic'
      });
      return;
    }

    setIsEvaluating(true);
    try {
      // Call AI Service evaluateStepSubmission
      const result = await AIService.evaluateStepSubmission({
        stepType: 'beginner_self_introduction',
        promptInstruction: 'Học viên mất gốc tiếng Anh viết 2-3 câu giới thiệu bản thân (Tên, nghề nghiệp/học sinh, quê hương). Đánh giá ngắn gọn, dịu dàng, khích lệ và sửa lỗi to-be hoặc thiếu từ nếu có.',
        userSubmission: productionText,
        originalSentence: 'My name is... I am a student. I am from Vietnam.'
      });

      setAiFeedback({
        isCorrect: result.isCorrectOrHighQuality || result.scorePercent >= 60,
        feedback: result.feedback || 'Bạn đã hoàn thành rất tốt phần giới thiệu bản thân!',
        correctedSentence: result.betterVersion || result.band8ModelVersion || productionText,
        explanation: result.whatNeedsCorrection || result.principle || 'Cấu trúc câu rõ ràng, sử dụng đúng động từ to-be.',
        source: 'ai_evaluated'
      });
    } catch (e) {
      console.warn('AI evaluation fallback:', e);
      // Friendly local fallback rule validation
      const lower = productionText.toLowerCase();
      const hasName = lower.includes('my name') || lower.includes('i am') || lower.includes("i'm");
      const hasFrom = lower.includes('from') || lower.includes('in') || lower.includes('live');
      const isGood = hasName && (hasFrom || lower.includes('student'));

      setAiFeedback({
        isCorrect: isGood,
        feedback: isGood 
          ? 'Tuyệt vời! Bạn đã viết được câu giới thiệu bản thân rõ ràng và chuẩn ngữ pháp cơ bản.' 
          : 'Gần đúng rồi! Hãy kiểm tra xem bạn đã có "My name is..." hoặc "I am from..." chưa nhé.',
        correctedSentence: isGood 
          ? productionText 
          : 'My name is Linh. I am a student. I am from Vietnam.',
        explanation: 'Nhớ luôn có động từ "is" sau "My name" và "am" sau "I".'
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  // Finish Lesson and Update Learner Profile
  const handleFinishLesson = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const sessionMinutes = profile.zeroClimber?.dailyMinutes || 15;

    const existingCompleted = profile.zeroClimber?.completedLessonIds || [];
    const newCompletedList = Array.from(new Set([...existingCompleted, ZEROCLIMBER_LESSON_1.id]));

    const climbRecord: DailyClimbRecord = {
      id: `climb_${Date.now()}`,
      date: todayStr,
      minutesCompleted: sessionMinutes,
      lessonId: ZEROCLIMBER_LESSON_1.id,
      isClimbGoalMet: true,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      subskillPracticed: 'writing_complex_grammar'
    };

    const existingDailyClimbs = profile.zeroClimber?.dailyClimbs || [];
    const updatedDailyClimbs = [climbRecord, ...existingDailyClimbs.filter(c => c.date !== todayStr)];

    const updatedZeroClimber: ZeroClimberProgress = {
      startingLevel: profile.zeroClimber?.startingLevel || 'zero_foundation',
      targetBand: profile.zeroClimber?.targetBand || 6.0,
      dailyMinutes: profile.zeroClimber?.dailyMinutes || 20,
      currentCampId: 'camp_base',
      currentLessonId: 'zc_lesson_1',
      currentLessonIndex: 1,
      totalClimbsCompleted: (profile.zeroClimber?.totalClimbsCompleted || 0) + 1,
      dailyClimbs: updatedDailyClimbs,
      isDailyClimbCompletedToday: true,
      lastClimbDate: todayStr,
      unlockedCampIds: profile.zeroClimber?.unlockedCampIds || ['camp_base'],
      completedLessonIds: newCompletedList,
      climbStreakDays: (profile.zeroClimber?.climbStreakDays || 0) + 1,
    };

    const updatedProfile: LearnerProfile = {
      ...profile,
      minutesStudiedToday: (profile.minutesStudiedToday || 0) + sessionMinutes,
      completedSessions: (profile.completedSessions || 0) + 1,
      recentActivity: [
        {
          id: `act_${Date.now()}`,
          type: 'zeroclimber',
          title: 'Hoàn thành Climb Lesson 1: Introduce Yourself',
          timestamp: 'Vừa xong',
          scoreChange: '+1 Trạm Base Camp'
        },
        ...(profile.recentActivity || [])
      ],
      zeroClimber: updatedZeroClimber
    };

    ProfileService.saveProfile(updatedProfile);
    onUpdateProfile(updatedProfile);
    setCurrentStep(6); // Go to Completion Celebration Screen
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Top Header & Progress */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Base Camp • Bài 1/5
              </span>
              <span className="text-xs text-slate-400">
                Chặng {currentStep > 5 ? 5 : currentStep}/{totalSteps}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 leading-snug">
              {LESSON_1_CONTENT.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            {progressPercent}%
          </span>
          <button
            onClick={onBackToClimb}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1"
          >
            Thoát
          </button>
        </div>
      </div>

      {/* ========================================================
          STEP 1: CORE PATTERNS (Học mẫu câu cốt lõi)
         ======================================================== */}
      {currentStep === 1 && (
        <Card variant="default" padding="lg" className="space-y-6 bg-white border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Phần 1: Mẫu câu cơ bản</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              3 Mẫu câu tự giới thiệu bản thân chuẩn xác
            </h2>
            <p className="text-xs text-slate-500">
              Hãy đọc kỹ 3 mẫu câu dưới đây. Tiếng Anh luôn cần động từ (to-be như "is", "am") để tạo thành câu hoàn chỉnh.
            </p>
          </div>

          <div className="space-y-4">
            {LESSON_1_CONTENT.corePatterns.map((item, idx) => (
              <div 
                key={item.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-emerald-300 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                    Mẫu #{idx + 1}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {item.vietnamese}
                  </span>
                </div>

                <p className="text-base font-extrabold text-slate-900 font-mono">
                  {item.pattern}
                </p>

                <div className="pt-1 flex flex-wrap gap-2">
                  {item.examples.map((ex, i) => (
                    <span 
                      key={i}
                      className="text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-medium"
                    >
                      VD: {ex}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60 mt-1">
                  💡 {item.note}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentStep(2)}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Bắt đầu bài tập nhận diện (Phần 2)
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================
          STEP 2: MCQ (Chọn câu đúng)
         ======================================================== */}
      {currentStep === 2 && (
        <Card variant="default" padding="lg" className="space-y-6 bg-white border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Phần 2: Chọn câu đúng ngữ pháp</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Phân biệt câu đúng và câu sai ngữ pháp
            </h2>
            <p className="text-xs text-slate-500">
              Chọn phương án chuẩn xác nhất cho từng tình huống dưới đây.
            </p>
          </div>

          <div className="space-y-6">
            {LESSON_1_CONTENT.mcqExercises.map((ex, idx) => {
              const selectedOptId = mcqAnswers[ex.id];
              const selectedOpt = ex.options.find(o => o.id === selectedOptId);

              return (
                <div key={ex.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Câu hỏi {idx + 1}/3
                    </span>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {ex.vietnamesePrompt}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-900">
                    {ex.question}
                  </p>

                  <div className="space-y-2">
                    {ex.options.map(opt => {
                      const isSelected = selectedOptId === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectMCQ(ex.id, opt.id)}
                          className={`p-3 rounded-lg border cursor-pointer text-sm font-medium transition flex items-center justify-between ${
                            isSelected
                              ? opt.isCorrect
                                ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20'
                                : 'border-rose-500 bg-rose-50/80 text-rose-900'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <span>{opt.text}</span>
                          {isSelected && (
                            opt.isCorrect 
                              ? <Check className="w-4 h-4 text-emerald-600" />
                              : <AlertCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {selectedOpt && (
                    <div className={`text-xs p-2.5 rounded-lg border ${
                      selectedOpt.isCorrect 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {selectedOpt.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentStep(1)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Quay lại lý thuyết
            </Button>

            <Button
              variant="primary"
              size="md"
              disabled={Object.keys(mcqAnswers).length < LESSON_1_CONTENT.mcqExercises.length}
              onClick={() => setCurrentStep(3)}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Tiếp tục: Điền từ còn thiếu (Phần 3)
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================
          STEP 3: FILL IN THE MISSING WORD (Điền từ còn thiếu)
         ======================================================== */}
      {currentStep === 3 && (
        <Card variant="default" padding="lg" className="space-y-6 bg-white border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Phần 3: Điền từ còn thiếu</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Chọn từ thích hợp điền vào chỗ trống
            </h2>
            <p className="text-xs text-slate-500">
              Chọn đúng từ to-be hoặc giới từ để hoàn thiện câu hoàn chỉnh.
            </p>
          </div>

          <div className="space-y-5">
            {LESSON_1_CONTENT.fillExercises.map((ex, idx) => {
              const selectedWord = fillAnswers[ex.id];
              const isCorrect = selectedWord === ex.missingWord;

              return (
                <div key={ex.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Câu {idx + 1}/3
                    </span>
                    <span className="text-xs text-slate-500">
                      Ý nghĩa: {ex.vietnameseMeaning}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-base font-extrabold text-slate-900 font-mono text-center">
                    {ex.sentence.replace('___', selectedWord ? `[ ${selectedWord} ]` : '___')}
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    {ex.options.map(word => {
                      const isChosen = selectedWord === word;
                      return (
                        <button
                          key={word}
                          type="button"
                          onClick={() => handleSelectFill(ex.id, word)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
                            isChosen
                              ? isCorrect
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                          }`}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>

                  {selectedWord && (
                    <div className={`text-xs p-2.5 rounded-lg border ${
                      isCorrect 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {isCorrect ? 'Chính xác! ' : 'Chưa đúng! '} {ex.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentStep(2)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Quay lại
            </Button>

            <Button
              variant="primary"
              size="md"
              disabled={Object.keys(fillAnswers).length < LESSON_1_CONTENT.fillExercises.length}
              onClick={() => setCurrentStep(4)}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Tiếp tục: Ghép câu hoàn chỉnh (Phần 4)
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================
          STEP 4: REORDER (Sắp xếp từ thành câu)
         ======================================================== */}
      {currentStep === 4 && (
        <Card variant="default" padding="lg" className="space-y-6 bg-white border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <Compass className="w-3.5 h-3.5" />
              <span>Phần 4: Sắp xếp từ thành câu</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Chạm vào các từ để ghép thành câu hoàn chỉnh
            </h2>
            <p className="text-xs text-slate-500">
              Bấm vào từ để đưa vào khung câu, bấm lại từ đã chọn nếu muốn bỏ ra.
            </p>
          </div>

          <div className="space-y-6">
            {LESSON_1_CONTENT.reorderExercises.map((ex, idx) => {
              const selectedWords = reorderAnswers[ex.id] || [];
              const constructed = selectedWords.join(' ');
              const isMatch = constructed.trim() === ex.correctSentence.trim();

              return (
                <div key={ex.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Câu {idx + 1}/3
                    </span>
                    <span className="text-xs text-slate-500">
                      Ý nghĩa: {ex.vietnameseMeaning}
                    </span>
                  </div>

                  {/* Target Slot Box */}
                  <div className="min-h-[50px] p-3 bg-white rounded-xl border border-dashed border-slate-300 flex flex-wrap items-center gap-2">
                    {selectedWords.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">
                        Chạm vào các từ bên dưới để ghép vào đây...
                      </span>
                    ) : (
                      selectedWords.map((w, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleWordClickReorder(ex.id, w)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 hover:bg-emerald-200 transition"
                        >
                          {w} ×
                        </button>
                      ))
                    )}
                  </div>

                  {/* Available Words Pool */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {ex.words.map((w, i) => {
                      const isUsed = selectedWords.includes(w);
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isUsed}
                          onClick={() => handleWordClickReorder(ex.id, w)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                            isUsed 
                              ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                              : 'bg-white hover:bg-emerald-50 border-slate-300 hover:border-emerald-500 text-slate-800'
                          }`}
                        >
                          {w}
                        </button>
                      );
                    })}
                  </div>

                  {selectedWords.length === ex.words.length && (
                    <div className={`text-xs p-2.5 rounded-lg border ${
                      isMatch 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {isMatch ? 'Chính xác 100%! ' : 'Chưa đúng trật tự! '} {ex.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentStep(3)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Quay lại
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentStep(5)}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Tiếp tục: Tự viết câu với AI Feedback (Phần 5)
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================
          STEP 5: PRODUCTION & AI FEEDBACK (Tự viết câu giới thiệu)
         ======================================================== */}
      {currentStep === 5 && (
        <Card variant="default" padding="lg" className="space-y-6 bg-white border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phần 5: Thực hành tự viết & AI Nhận xét</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Tự giới thiệu về bản thân bạn
            </h2>
            <p className="text-xs text-slate-500">
              {LESSON_1_CONTENT.productionExercise.prompt}
            </p>
          </div>

          {/* Example Reference */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Mẫu gợi ý tham khảo:
            </span>
            <p className="text-xs font-mono font-medium text-slate-700">
              "{LESSON_1_CONTENT.productionExercise.exampleAnswers[0]}"
            </p>
          </div>

          {/* Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Viết câu của bạn vào đây (2-3 câu):
            </label>
            <textarea
              rows={3}
              value={productionText}
              onChange={(e) => setProductionText(e.target.value)}
              placeholder="VD: My name is Minh. I am a student. I am from Vietnam."
              className="w-full p-4 rounded-xl border border-slate-300 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed font-mono"
            />
          </div>

          {/* AI Feedback Box */}
          {aiFeedback && (
            <div className={`p-4 rounded-xl border space-y-2 ${
              aiFeedback.isCorrect
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                : 'bg-amber-50/80 border-amber-300 text-amber-900'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {aiFeedback.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Đánh giá từ AI: Tuyệt vời! Bạn đã đạt chuẩn bài học!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span>Đánh giá từ AI: Cần tinh chỉnh nhẹ</span>
                  </>
                )}
              </div>

              <p className="text-xs leading-relaxed">
                {aiFeedback.feedback}
              </p>

              <div className="pt-2 border-t border-slate-200/60 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider block">
                  Câu chuẩn ngữ pháp:
                </span>
                <p className="text-xs font-mono font-bold bg-white/70 p-2 rounded border border-slate-200">
                  {aiFeedback.correctedSentence}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  💡 {aiFeedback.explanation}
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentStep(4)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Quay lại
            </Button>

            <div className="flex items-center gap-2">
              {!aiFeedback ? (
                <Button
                  variant="primary"
                  size="md"
                  disabled={!productionText.trim() || isEvaluating}
                  onClick={handleEvaluateProduction}
                  icon={<Sparkles className="w-4 h-4" />}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  {isEvaluating ? 'AI Đang nhận xét...' : 'Gửi cho AI chấm câu'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFinishLesson}
                  icon={<Trophy className="w-4 h-4" />}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Hoàn thành bài học ➔ Nhận chứng nhận
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* ========================================================
          STEP 6: COMPLETION CELEBRATION (Hoàn thành Climb 1)
         ======================================================== */}
      {currentStep === 6 && (
        <Card variant="default" padding="lg" className="space-y-6 bg-white border-slate-200 shadow-lg text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <Trophy className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              CLIMB COMPLETE • HOÀN THÀNH CHẶNG LEO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              You can now introduce yourself in English!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Chúc mừng bạn! Bạn đã hoàn thành trọn vẹn bài học đầu tiên tại Base Camp và làm chủ các mẫu câu tự giới thiệu bản thân chuẩn ngữ pháp.
            </p>
          </div>

          {/* Unlocked Capability Badge */}
          <div className="max-w-md mx-auto p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-left space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Năng lực đã mở khóa hôm nay:</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1 pl-6 list-disc">
              <li>Biết dùng "My name is..." chuẩn xác với động từ to-be.</li>
              <li>Biết dùng "I am a student..." đúng mạo từ.</li>
              <li>Biết dùng "I am from Vietnam..." giới thiệu quê quán.</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={onBackToClimb}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Quay lại Bảng lộ trình Your Climb
            </Button>
          </div>
        </Card>
      )}

    </div>
  );
};
