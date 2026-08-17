import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  AlertTriangle, 
  Zap, 
  Filter,
  Bookmark,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Target,
  ChevronRight,
  HelpCircle,
  Award,
  Check
} from 'lucide-react';
import { READING_PASSAGES, SUBSKILLS_DICTIONARY } from '../data/mockContent';
import { ReadingPassage, LearnerProfile, SubskillId, ReadingQuestion } from '../types';
import { profileStorage } from '../services/api';
import { LearningEngine } from '../engine';

interface ReadingModuleProps {
  profile: LearnerProfile;
  onUpdateProfile: (p: LearnerProfile) => void;
  onStartPathway: (pathwayId: string) => void;
  onNavigate?: (route: any) => void;
  targetSubskill?: SubskillId;
}

export const ReadingModule: React.FC<ReadingModuleProps> = ({
  profile,
  onUpdateProfile,
  onStartPathway,
  onNavigate,
  targetSubskill: propTargetSubskill
}) => {
  // Determine effective target subskill (from props, or primary bottleneck, or default)
  const defaultTargetSubskill: SubskillId = propTargetSubskill || 
    (profile.primaryBottleneckSubskill as SubskillId) || 
    'reading_paraphrase';

  const [filterSubskill, setFilterSubskill] = useState<SubskillId | 'all'>(defaultTargetSubskill);
  
  // Filter passages if a specific subskill filter is chosen
  const filteredPassages = filterSubskill === 'all'
    ? READING_PASSAGES
    : READING_PASSAGES.filter((p) => p.questions.some((q) => q.subskill === filterSubskill));

  const availablePassages = filteredPassages.length > 0 ? filteredPassages : READING_PASSAGES;

  const [selectedPassageId, setSelectedPassageId] = useState<string>(availablePassages[0].id);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [isSessionCompleted, setIsSessionCompleted] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [highlightedText, setHighlightedText] = useState<string | null>(null);

  const currentPassage = READING_PASSAGES.find((p) => p.id === selectedPassageId) || READING_PASSAGES[0];
  const questions = currentPassage.questions;
  const currentQuestion: ReadingQuestion | undefined = questions[activeQuestionIdx] || questions[0];

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && !isSessionCompleted) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, isSessionCompleted]);

  // Format timer seconds into mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionText: string) => {
    if (checkedQuestions[questionId]) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionText,
    }));
  };

  // Submit and evaluate an individual question
  const handleCheckQuestion = (question: ReadingQuestion) => {
    const chosenAnswer = userAnswers[question.id];
    if (!chosenAnswer) return;

    const isCorrect = chosenAnswer === question.correctAnswer;
    const subskillId = question.subskill;

    // 1. Mark this question as checked
    const newChecked = { ...checkedQuestions, [question.id]: true };
    setCheckedQuestions(newChecked);

    // 2. Compute updated subskill mastery using LearningEngine
    const currentScore = profile.subskillMastery[subskillId] || 50;
    const observedPerformance = isCorrect ? 90 : 30;
    const updatedScore = LearningEngine.mastery.computeUpdatedMastery(
      currentScore,
      observedPerformance,
      0.25 // moderate weight for targeted practice
    );

    const updatedSubskills = {
      ...profile.subskillMastery,
      [subskillId]: updatedScore,
    };

    // 3. Update Error Memory if wrong
    let updatedErrors = [...profile.activeErrors];
    if (!isCorrect) {
      const distractor = question.distractorDetails?.[chosenAnswer];
      const errorTagCode = distractor?.errorTagCode || `ERR_${subskillId.toUpperCase()}`;
      const errorTagName = distractor?.errorTagName || SUBSKILLS_DICTIONARY[subskillId]?.targetWeakness || 'Lỗi đọc hiểu bẫy học thuật';

      // Check if existing
      const existingIdx = updatedErrors.findIndex((e) => e.subskill === subskillId && e.code === errorTagCode);
      if (existingIdx >= 0) {
        updatedErrors[existingIdx] = {
          ...updatedErrors[existingIdx],
          count: updatedErrors[existingIdx].count + 1,
          lastEncountered: 'Vừa xong (Reading Practice)'
        };
      } else {
        updatedErrors.push({
          id: `err_${Date.now()}_${question.id}`,
          code: errorTagCode,
          category: 'Reading Comprehension',
          name: errorTagName,
          subskill: subskillId,
          severity: 'medium',
          count: 1,
          lastEncountered: 'Vừa xong (Reading Practice)'
        });
      }
    }

    // 4. Recompute estimated band via LearningEngine
    const recalculatedBand = LearningEngine.mastery.computeEstimatedBand(updatedSubskills);

    // 5. Append learning event to recent activity
    const newActivity = [
      {
        id: `act_read_${Date.now()}`,
        type: 'reading' as const,
        title: `Luyện đọc: ${question.prompt.substring(0, 45)}... (${isCorrect ? 'Đúng' : 'Sai'})`,
        timestamp: 'Vừa xong',
        scoreChange: isCorrect ? `+Mastery (${subskillId})` : `Ghi nhận lỗi (${subskillId})`
      },
      ...(profile.recentActivity || [])
    ];

    const updatedProfile: LearnerProfile = {
      ...profile,
      subskillMastery: updatedSubskills,
      activeErrors: updatedErrors,
      currentEstimatedBand: recalculatedBand,
      recentActivity: newActivity
    };

    // Persist & notify parent
    profileStorage.saveProfile(updatedProfile);
    onUpdateProfile(updatedProfile);

    // If all questions in passage are now checked, trigger session completed view
    const allChecked = questions.every((q) => newChecked[q.id]);
    if (allChecked) {
      setIsSessionCompleted(true);
      setIsTimerActive(false);
    }
  };

  // Reset current passage state
  const handleResetPassage = () => {
    setUserAnswers({});
    setCheckedQuestions({});
    setActiveQuestionIdx(0);
    setIsSessionCompleted(false);
    setTimerSeconds(0);
    setIsTimerActive(true);
    setHighlightedText(null);
  };

  // Switch passage
  const handleSelectPassage = (passageId: string) => {
    setSelectedPassageId(passageId);
    setUserAnswers({});
    setCheckedQuestions({});
    setActiveQuestionIdx(0);
    setIsSessionCompleted(false);
    setTimerSeconds(0);
    setIsTimerActive(true);
    setHighlightedText(null);
  };

  // Calculate session stats
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(checkedQuestions).length;
  const correctCount = questions.filter((q) => checkedQuestions[q.id] && userAnswers[q.id] === q.correctAnswer).length;
  const accuracyPct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // Find repeated error count for the current question's distractor
  const getRepeatedErrorCount = (q: ReadingQuestion, chosenAnswer: string): number => {
    const distractor = q.distractorDetails?.[chosenAnswer];
    if (!distractor) return 0;
    const matched = profile.activeErrors.find((e) => e.code === distractor.errorTagCode || e.subskill === q.subskill);
    return matched ? matched.count : 0;
  };

  return (
    <div id="reading-practice-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header & Context Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold uppercase tracking-wide">
                <BookOpen className="w-3.5 h-3.5" />
                IELTS Academic Reading Engine
              </span>

              {filterSubskill !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
                  <Target className="w-3 h-3 text-amber-400" />
                  Mục tiêu: {SUBSKILLS_DICTIONARY[filterSubskill]?.name || filterSubskill}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Luyện Đọc Học Thuật Gắn Thẻ Subskill & Bằng Chứng
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Mỗi câu hỏi được gắn chính xác subskill cần rèn luyện. Khi chọn sai, hệ thống trích dẫn bằng chứng văn bản và phân tích bản chất bẫy ngữ nghĩa để cập nhật vào bộ nhớ lỗi (Error Memory).
            </p>
          </div>

          {/* Right Controls: Timer & Subskill Filter */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Timer Widget */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatTimer(timerSeconds)}</span>
              <button
                onClick={() => setIsTimerActive(!isTimerActive)}
                className="text-slate-500 hover:text-slate-900 transition ml-1"
                title={isTimerActive ? 'Tạm dừng' : 'Tiếp tục'}
              >
                {isTimerActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>

            {/* Subskill Quick Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Lọc:</span>
              <select
                value={filterSubskill}
                onChange={(e) => {
                  const val = e.target.value as SubskillId | 'all';
                  setFilterSubskill(val);
                  const matching = val === 'all' 
                    ? READING_PASSAGES 
                    : READING_PASSAGES.filter((p) => p.questions.some((q) => q.subskill === val));
                  if (matching.length > 0) {
                    handleSelectPassage(matching[0].id);
                  }
                }}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">Tất cả Subskills</option>
                <option value="reading_paraphrase">Paraphrase & Keyword Matching</option>
                <option value="reading_cause_effect">Cause-Effect & Argument Logic</option>
                <option value="reading_detail_inference">Detail Inference & TFNG</option>
              </select>
            </div>
          </div>
        </div>

        {/* Passage Selection Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
            Bài đọc:
          </span>
          {availablePassages.map((p) => {
            const isSelected = p.id === currentPassage.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPassage(p.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{p.topic}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                  {p.level}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Session Completed Summary Modal / View */}
      {isSessionCompleted ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-2xs space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Hoàn thành phiên luyện tập
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Báo cáo Bằng chứng & Cập nhật Năng lực
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono font-bold bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
              <span>Thời gian: {formatTimer(timerSeconds)}</span>
              <span>•</span>
              <span>Độ chính xác: {accuracyPct}% ({correctCount}/{totalQuestions})</span>
            </div>
          </div>

          {/* Evidence Observation Note (Honest Language) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Ghi nhận bằng chứng quan sát từ bài làm:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Phiên học này đã bổ sung dữ liệu bài làm vào bộ nhớ hồ sơ học tập cho kỹ năng <strong>{SUBSKILLS_DICTIONARY[currentQuestion?.subskill || 'reading_paraphrase']?.name}</strong>. Điểm số band ước lượng được hiệu chỉnh theo mô hình Exponential Moving Average, không tạo ra bước nhảy ảo sau một bài đọc ngắn.
            </p>
          </div>

          {/* Results per question */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Chi tiết câu hỏi & bằng chứng văn bản
            </h3>

            <div className="space-y-3">
              {questions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                const distractor = q.distractorDetails?.[userAns];

                return (
                  <div 
                    key={q.id}
                    className={`p-4 rounded-xl border ${
                      isCorrect 
                        ? 'bg-emerald-50/40 border-emerald-200' 
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            Câu {idx + 1}:
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isCorrect 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isCorrect ? 'Chính xác' : 'Chưa đúng'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Subskill: {SUBSKILLS_DICTIONARY[q.subskill]?.name || q.subskill}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">
                          {q.prompt}
                        </p>
                      </div>
                    </div>

                    {/* Evidence Quote */}
                    <div className="mt-3 p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-indigo-700">🔍 Bằng chứng trích xuất từ bài đọc:</div>
                      <blockquote className="italic text-slate-800 border-l-2 border-indigo-400 pl-2">
                        "{q.evidenceQuote}"
                      </blockquote>
                      <div className="text-slate-600 pt-1">
                        <strong>Giải thích:</strong> {q.explanation}
                      </div>
                    </div>

                    {/* Distractor reason if wrong */}
                    {!isCorrect && distractor && (
                      <div className="mt-2 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Bẫy đã mắc: {distractor.errorTagName} ({distractor.errorTagCode})</span>
                        </div>
                        <p className="text-amber-800">
                          {distractor.distractorReason}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleResetPassage}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm lại bài này
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              {onNavigate && (
                <button
                  onClick={() => onNavigate('/today')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                >
                  Quay lại Hôm nay (/today)
                </button>
              )}

              <button
                onClick={() => {
                  const targetSub = currentQuestion?.subskill || 'reading_paraphrase';
                  if (targetSub.includes('paraphrase')) onStartPathway('pathway_paraphrase');
                  else if (targetSub.includes('cause')) onStartPathway('pathway_cause_effect');
                  else onStartPathway('pathway_complex_grammar');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Tiếp tục can thiệp Micro-Pathway</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Main Practice Interface: Split Screen (Passage | Question Panel) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (6 cols): Reading Passage Content */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs lg:sticky lg:top-20 max-h-[calc(100vh-140px)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  {currentPassage.topic} • {currentPassage.level}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {currentPassage.title}
                </h2>
              </div>
              <Bookmark className="w-5 h-5 text-slate-300 hover:text-indigo-600 cursor-pointer transition" />
            </div>

            {/* Passage Body Paragraphs */}
            <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed space-y-4 text-sm sm:text-base font-normal select-text font-serif">
              {currentPassage.content.split('\n\n').map((para, pIdx) => {
                const isHighlightMatch = highlightedText && para.includes(highlightedText.substring(0, 20));

                return (
                  <p 
                    key={pIdx} 
                    className={`p-3 rounded-lg transition border leading-relaxed ${
                      isHighlightMatch 
                        ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200' 
                        : 'hover:bg-slate-50/80 border-transparent hover:border-slate-100'
                    }`}
                  >
                    <span className="inline-block w-6 text-xs font-sans font-bold text-slate-400 select-none mr-1">
                      [{pIdx + 1}]
                    </span>
                    {para}
                  </p>
                );
              })}
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Mẹo học thuật:</strong> Bạn có thể bôi đen văn bản để đối chiếu từ đồng nghĩa và ranh giới thông tin với câu hỏi.
              </span>
            </div>
          </div>

          {/* Right Column (6 cols): Question Engine & Evidence Feedback */}
          <div className="lg:col-span-6 space-y-4">
            {/* Progress & Step Navigation Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Câu hỏi {activeQuestionIdx + 1} / {totalQuestions}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {SUBSKILLS_DICTIONARY[currentQuestion?.subskill || 'reading_paraphrase']?.name}
                  </span>
                </div>

                {/* Question selector dots */}
                <div className="flex items-center gap-1.5">
                  {questions.map((q, idx) => {
                    const isAnswered = checkedQuestions[q.id];
                    const isCorrect = isAnswered && userAnswers[q.id] === q.correctAnswer;
                    const isActive = idx === activeQuestionIdx;

                    let dotClass = 'bg-slate-200 text-slate-600 hover:bg-slate-300';
                    if (isAnswered) {
                      dotClass = isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white';
                    } else if (isActive) {
                      dotClass = 'bg-slate-900 text-white ring-2 ring-indigo-400';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionIdx(idx)}
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition ${dotClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Question Box */}
              {currentQuestion && (
                <div className="space-y-4">
                  {/* Question Type & Prompt */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Dạng câu: {currentQuestion.type === 'paraphrase_match' ? 'Paraphrase Matching' : currentQuestion.type === 'cause_effect' ? 'Cause & Effect' : 'True/False/Not Given'}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {currentQuestion.prompt}
                    </h3>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {currentQuestion.options?.map((optionText, oIdx) => {
                      const isChosen = userAnswers[currentQuestion.id] === optionText;
                      const isChecked = checkedQuestions[currentQuestion.id];
                      const isCorrect = isChecked && optionText === currentQuestion.correctAnswer;
                      const isWrong = isChecked && isChosen && optionText !== currentQuestion.correctAnswer;

                      let styleClass = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300';

                      if (isChecked) {
                        if (optionText === currentQuestion.correctAnswer) {
                          styleClass = 'bg-emerald-50/90 border-emerald-500 text-emerald-950 font-semibold shadow-xs';
                        } else if (isChosen && optionText !== currentQuestion.correctAnswer) {
                          styleClass = 'bg-rose-50/90 border-rose-400 text-rose-950 font-medium';
                        } else {
                          styleClass = 'bg-slate-50/60 border-slate-200 text-slate-400';
                        }
                      } else if (isChosen) {
                        styleClass = 'bg-indigo-50/80 border-indigo-600 text-indigo-950 font-semibold shadow-xs ring-1 ring-indigo-500';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isChecked}
                          onClick={() => handleSelectOption(currentQuestion.id, optionText)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-start gap-3 ${styleClass}`}
                        >
                          <span className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center flex-shrink-0 font-bold ${
                            isCorrect 
                              ? 'bg-emerald-600 text-white' 
                              : isWrong 
                                ? 'bg-rose-600 text-white' 
                                : isChosen 
                                  ? 'bg-indigo-600 text-white' 
                                  : 'bg-slate-100 text-slate-700'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="pt-0.5 leading-relaxed">{optionText}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Submission / Check Button (Before Checked) */}
                  {!checkedQuestions[currentQuestion.id] && (
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {userAnswers[currentQuestion.id] ? 'Đã chọn đáp án' : 'Vui lòng chọn 1 đáp án'}
                      </span>

                      <button
                        disabled={!userAnswers[currentQuestion.id]}
                        onClick={() => handleCheckQuestion(currentQuestion)}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 shadow-xs transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Kiểm tra câu trả lời & Trích xuất bằng chứng</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Evidence & Pedagogical Explanation Box (After Checked) */}
                  {checkedQuestions[currentQuestion.id] && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3.5 animate-fadeIn">
                      {/* Correct / Incorrect Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {userAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Chính xác
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                              <XCircle className="w-3.5 h-3.5" /> Chưa chính xác
                            </span>
                          )}
                        </div>

                        {/* Repeated Error Warning Banner if applicable */}
                        {userAnswers[currentQuestion.id] !== currentQuestion.correctAnswer && (
                          (() => {
                            const repCount = getRepeatedErrorCount(currentQuestion, userAnswers[currentQuestion.id]);
                            if (repCount >= 2) {
                              return (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                                  <AlertTriangle className="w-3 h-3" /> Mẫu lỗi lặp lại ({repCount} lần)
                                </span>
                              );
                            }
                            return null;
                          })()
                        )}
                      </div>

                      {/* Evidence Quote from Passage */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-800">
                        <div className="flex items-center justify-between">
                          <strong className="text-indigo-700 font-bold flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" /> Bằng chứng trích xuất từ văn bản:
                          </strong>
                          <button
                            onClick={() => setHighlightedText(currentQuestion.evidenceQuote)}
                            className="text-[11px] font-bold text-indigo-600 hover:underline"
                          >
                            Định vị trong bài đọc
                          </button>
                        </div>
                        <blockquote className="italic border-l-2 border-indigo-500 pl-2.5 text-slate-900 bg-white p-2 rounded">
                          "{currentQuestion.evidenceQuote}"
                        </blockquote>
                      </div>

                      {/* Pedagogical Explanation: Why */}
                      <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 space-y-1 leading-relaxed">
                        <strong className="font-bold text-indigo-900 block">💡 Vì sao đáp án đúng?</strong>
                        <p>{currentQuestion.explanation}</p>
                      </div>

                      {/* Why chosen answer was wrong (Distractor Analysis) */}
                      {userAnswers[currentQuestion.id] !== currentQuestion.correctAnswer && (
                        (() => {
                          const chosen = userAnswers[currentQuestion.id];
                          const distractor = currentQuestion.distractorDetails?.[chosen];
                          if (!distractor) return null;

                          return (
                            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1.5 leading-relaxed">
                              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                                <span>Phân tích bẫy trong lựa chọn của bạn: {distractor.errorTagName}</span>
                              </div>
                              <p className="text-amber-800">
                                {distractor.distractorReason}
                              </p>
                              <div className="text-[11px] font-mono text-amber-700">
                                Mã lỗi: <strong>{distractor.errorTagCode}</strong> (Đã cập nhật vào Error Memory)
                              </div>
                            </div>
                          );
                        })()
                      )}

                      {/* Targeted Micro-Pathway CTA on Error */}
                      {userAnswers[currentQuestion.id] !== currentQuestion.correctAnswer && (
                        <div className="p-3 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5" /> Can thiệp tức thì
                            </div>
                            <p className="text-[11px] text-slate-300">
                              Luyện 4 bước giải mã điểm nghẽn <strong>{SUBSKILLS_DICTIONARY[currentQuestion.subskill]?.name}</strong>
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              const sub = currentQuestion.subskill;
                              if (sub.includes('paraphrase')) onStartPathway('pathway_paraphrase');
                              else if (sub.includes('cause')) onStartPathway('pathway_cause_effect');
                              else onStartPathway('pathway_complex_grammar');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 self-start sm:self-center transition shadow-xs"
                          >
                            <span>Khắc phục điểm nghẽn này</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Navigation between questions */}
                      <div className="pt-2 flex items-center justify-between">
                        <button
                          disabled={activeQuestionIdx === 0}
                          onClick={() => setActiveQuestionIdx((prev) => Math.max(0, prev - 1))}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          Câu trước
                        </button>

                        {activeQuestionIdx < totalQuestions - 1 ? (
                          <button
                            onClick={() => setActiveQuestionIdx((prev) => Math.min(totalQuestions - 1, prev + 1))}
                            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <span>Câu tiếp theo</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsSessionCompleted(true)}
                            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                          >
                            <span>Xem tổng kết phiên học</span>
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
