import React, { useState, useEffect, useRef } from 'react';
import { ErrorRepository } from '../engine/errors/errorRepository';
import { 
  PenTool, 
  Sparkles, 
  Upload, 
  Camera, 
  FileText, 
  Clock, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  BrainCircuit, 
  RotateCcw,
  Zap,
  HelpCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Target,
  BookOpen,
  Layers,
  Save,
  Send,
  Eye,
  Edit3,
  BookmarkCheck,
  ShieldCheck,
  Flame,
  MessageSquare
} from 'lucide-react';
import { WRITING_PROMPTS, SUBSKILLS_DICTIONARY } from '../data/mockContent';
import { WritingPrompt, LearnerProfile, SubskillId, EvidenceFeedbackItem, ErrorTag } from '../types';
import { apiService, WritingAnalysisResponse, profileStorage } from '../services/api';
import { LearningEngine } from '../engine';

interface WritingModuleProps {
  profile: LearnerProfile;
  onUpdateProfile: (p: LearnerProfile) => void;
  onStartPathway: (pathwayId: string) => void;
}

// Sample realistic essays (Band 6.0 - 6.5) containing real diagnostic opportunities
const SAMPLE_ESSAYS: Record<string, string> = {
  write_prompt_1: `In the contemporary era, the proliferation of artificial intelligence has precipitated vigorous debate regarding its ultimate ramifications on the labor market. While some people is worried that automation causes widespread unemployment and deskilling, others think AI will create more opportunities. In this essay, I will discuss both views and give my opinion.

On the one hand, apprehensions concerning employment displacement are understandable. Many routine jobs like factory workers or bank tellers are replacing by automated machines and smart algorithms, which leads to sudden job losses. Consequently, workers whose skills are strictly repetitive face genuine transitional vulnerability unless municipal bodies provide structured reskilling programs.

On the other hand, empirical precedent shows that technological disruptions generate novel vocations. Instead of eliminating humans completely, AI liberates professionals from mechanical drudgery, so that they can dedicate more time to strategic thinking and problem-solving. For example in healthcare, machine learning diagnostics helps doctors detect illnesses faster, allowing medical staff to provide better personalized patient care.

In conclusion, although the algorithmic transition undeniably causes short-term structural friction, I believe its long-term trajectory is positive. Provided that educational institutions and policymakers prioritize digital reskilling, artificial intelligence will enhance worker productivity rather than cause permanent mass unemployment.`,

  write_prompt_2: `Urbanization and population growth in modern metropolises have caused extreme temperature surges, which is commonly known as the urban heat island effect. This phenomenon leads to significant environmental degradation and severe public health problems for city dwellers. In this essay, I will examine the primary causes of this issue and propose viable solutions that local authorities can implement.

The primary factor contributing to elevated urban temperatures is the extensive replacement of natural vegetation with impermeable materials such as asphalt roads and concrete high-rises. These materials absorb solar radiation during daylight hours and retain heat at night, which prevents nocturnal cooling. Furthermore, the extensive utilization of vehicular transport and commercial air conditioning systems expels massive amounts of anthropogenic heat directly into the ambient atmosphere.

To mitigate this environmental crisis, municipal governments should adopt comprehensive green infrastructure policies. First, authorities ought to mandate the integration of rooftop gardens and vertical greenery in all new commercial building projects. Additionally, municipal planners must invest heavily in expanding urban canopy cover and public transit networks to reduce automobile usage.

In conclusion, excessive urban heat stems mainly from concrete infrastructure and greenhouse emissions. By enforcing green building standards and enhancing urban forestry, municipal governments can substantially diminish temperatures and foster more livable cities.`,

  write_prompt_3: `The provided bar chart compares the percentage of university research departments adopting AI diagnostic tools across five distinct nations between 2020 and 2026.

Overall, it is immediately apparent that the adoption rate of AI diagnostic tools increased substantially in all five countries throughout the given six-year timeframe. Country D consistently registered the highest adoption levels, whereas Country E witnessed the lowest percentages.

In 2020, Country D led the chart with 30% of research departments utilizing AI tools, followed closely by Country B at 22% and Country A at 15%. Over the next three years, these figures rose steadily to 48%, 45%, and 38% respectively. By 2026, Country D reached a peak of 85%, maintaining its dominant position, while Country A and Country B achieved significant adoption rates of 74% and 68%.

In contrast, Country C and Country E started with relatively low figures in 2020, at 10% and 8% respectively. Although both countries grew over the period, Country E only reached 35% in 2026, remaining the lowest overall, while Country C climbed to 52%.`,

  write_prompt_4: `In recent years, an increasing number of educational institutions have begun transitioning towards fully digitized self-paced learning models, replacing conventional face-to-face lecture formats. Although this pedagogical transformation offers notable flexibility, I firmly believe that its drawbacks regarding collaborative engagement and academic discipline outweigh its potential benefits.

On the one hand, digitized asynchronous instruction grants students unprecedented autonomy over their learning trajectories. Learners can review complex materials at their own pace and balance academic studies with personal commitments. Moreover, digital platforms provide access to diverse multimedia resources that accommodate various learning modalities.

On the other hand, the absence of real-time classroom interactions poses grave challenges to students' social and intellectual development. Traditional lectures foster spontaneous debate, peer collaboration, and immediate feedback from instructors, which are vital for cultivating critical thinking skills. Furthermore, young learners often struggle with self-regulation, resulting in procrastination and high course attrition rates without structured in-person accountability.

In conclusion, while digitized self-paced learning provides superior scheduling convenience, its detrimental effects on social maturation and structured discipline make it less advantageous than traditional collaborative instruction.`
};

export const WritingModule: React.FC<WritingModuleProps> = ({
  profile,
  onUpdateProfile,
  onStartPathway,
}) => {
  const [selectedPromptId, setSelectedPromptId] = useState<string>(WRITING_PROMPTS[0].id);
  const [inputMode, setInputMode] = useState<'text' | 'image'>('text');
  const [essayText, setEssayText] = useState<string>('');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgressStep, setAnalysisProgressStep] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<WritingAnalysisResponse | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [activeEvidenceIndex, setActiveEvidenceIndex] = useState<number | null>(null);
  const [showAnnotatedView, setShowAnnotatedView] = useState<boolean>(false);
  const [showAdditionalObservations, setShowAdditionalObservations] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [transferInputs, setTransferInputs] = useState<Record<number, string>>({});
  const [transferSubmitted, setTransferSubmitted] = useState<Record<number, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const feedbackListRef = useRef<HTMLDivElement>(null);

  const currentPrompt = WRITING_PROMPTS.find((p) => p.id === selectedPromptId) || WRITING_PROMPTS[0];
  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const isWordCountMet = wordCount >= currentPrompt.minWords;

  // Load saved draft on prompt switch
  useEffect(() => {
    const draftKey = `ielts_writing_draft_${selectedPromptId}`;
    const saved = localStorage.getItem(draftKey);
    if (saved && saved.trim()) {
      setEssayText(saved);
      setLastSavedTime('Bản nháp đã lưu');
    } else {
      // Default to sample if empty
      setEssayText(SAMPLE_ESSAYS[selectedPromptId] || '');
      setLastSavedTime(null);
    }
    setAnalysisResult(null);
    setErrorState(null);
    setActiveEvidenceIndex(null);
    setShowAnnotatedView(false);
  }, [selectedPromptId]);

  // Debounced autosave
  useEffect(() => {
    if (!essayText) return;
    const timer = setTimeout(() => {
      const draftKey = `ielts_writing_draft_${selectedPromptId}`;
      localStorage.setItem(draftKey, essayText);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setLastSavedTime(`Đã lưu nháp lúc ${timeStr}`);
    }, 1200);
    return () => clearTimeout(timer);
  }, [essayText, selectedPromptId]);

  // File upload handler
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorState('Vui lòng chọn file hình ảnh (JPG, PNG, WEBP).');
      return;
    }
    setErrorState(null);
    setUploadedImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Submit & Analyze via API
  const handleAnalyze = async () => {
    if (inputMode === 'text' && wordCount < 20) {
      setErrorState('Bài viết quá ngắn. Vui lòng nhập tối thiểu 20 từ để phân tích.');
      return;
    }
    if (inputMode === 'image' && !uploadedImageBase64) {
      setErrorState('Vui lòng tải lên ảnh chụp bài viết trước khi bấm chấm.');
      return;
    }

    setIsAnalyzing(true);
    setErrorState(null);
    setAnalysisProgressStep(1);

    const stepTimer1 = setTimeout(() => setAnalysisProgressStep(2), 1200);
    const stepTimer2 = setTimeout(() => setAnalysisProgressStep(3), 2600);
    const stepTimer3 = setTimeout(() => setAnalysisProgressStep(4), 4200);

    try {
      let result: WritingAnalysisResponse;

      if (inputMode === 'image' && uploadedImageBase64) {
        const imgRes = await apiService.analyzeImageEssay({
          imageBase64: uploadedImageBase64,
          mimeType: 'image/jpeg',
          prompt: currentPrompt.prompt,
          taskType: currentPrompt.taskType,
        });
        if (imgRes.transcribedText) {
          setEssayText(imgRes.transcribedText);
        }
        result = imgRes;
      } else {
        result = await apiService.analyzeWriting({
          essayText,
          prompt: currentPrompt.prompt,
          taskType: currentPrompt.taskType,
          topic: currentPrompt.topic,
        });
      }

      setAnalysisResult(result);
      setShowAnnotatedView(true);

      // --- LearningEngine Updates ---
      // 1. Record Error Patterns in ErrorMemory
      const updatedErrors = ErrorRepository.mergeDetectedErrors(
  profile.activeErrors,
  result.errorTags || [],
  'Vừa xong (Writing Lab)'
);
      // 2. Compute updated mastery via LearningEngine
      const updatedSubskills = { ...profile.subskillMastery };
      if (result.rubricScores) {
        const trPct = (result.rubricScores.taskResponse / 9) * 100;
        const ccPct = (result.rubricScores.coherenceCohesion / 9) * 100;
        const lrPct = (result.rubricScores.lexicalResource / 9) * 100;
        const graPct = (result.rubricScores.grammaticalRange / 9) * 100;

        updatedSubskills.writing_task_response = LearningEngine.mastery.computeUpdatedMastery(
          updatedSubskills.writing_task_response || 50,
          trPct,
          0.15
        );
        updatedSubskills.writing_coherence_cohesion = LearningEngine.mastery.computeUpdatedMastery(
          updatedSubskills.writing_coherence_cohesion || 50,
          ccPct,
          0.15
        );
        updatedSubskills.writing_lexical_resource = LearningEngine.mastery.computeUpdatedMastery(
          updatedSubskills.writing_lexical_resource || 50,
          lrPct,
          0.15
        );
        updatedSubskills.writing_complex_grammar = LearningEngine.mastery.computeUpdatedMastery(
          updatedSubskills.writing_complex_grammar || 50,
          graPct,
          0.15
        );
      }

      // 3. Recompute overall estimated band
      const recalculatedBand = LearningEngine.mastery.computeEstimatedBand(updatedSubskills);

      // 4. Record learning activity
      const newActivity = [
        {
          id: `write_act_${Date.now()}`,
          type: 'writing' as const,
          title: `Chấm ${currentPrompt.taskType}: ${currentPrompt.topic} (Tìm thấy ${result.evidenceFeedback.length} bằng chứng lỗi)`,
          timestamp: 'Vừa xong',
          scoreChange: `Band ${result.overallBand.toFixed(1)}`
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

      profileStorage.saveProfile(updatedProfile);
      onUpdateProfile(updatedProfile);
    } catch (err: any) {
      console.error('Error analyzing writing:', err);
      setErrorState(err.message || 'Không thể chấm bài viết lúc này. Bản nháp của bạn đã được bảo toàn nguyên vẹn. Vui lòng thử lại.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsAnalyzing(false);
      setAnalysisProgressStep(0);
    }
  };

  const handleResetToSample = () => {
    setEssayText(SAMPLE_ESSAYS[selectedPromptId] || '');
    setAnalysisResult(null);
    setErrorState(null);
    setActiveEvidenceIndex(null);
  };

  const handleClearEditor = () => {
    setEssayText('');
    setAnalysisResult(null);
    setErrorState(null);
    localStorage.removeItem(`ielts_writing_draft_${selectedPromptId}`);
  };

  // Split essay paragraphs for annotated view
  const paragraphs = essayText.split('\n\n').filter(p => p.trim());

  // Check if an error pattern has occurred in profile history
  const getRecurringErrorCount = (subskill: SubskillId, code?: string): number => {
    const match = profile.activeErrors.find(
      (e) => (code && e.code === code) || e.subskill === subskill
    );
    return match ? match.count : 0;
  };

  // Group evidence items: 3-4 priority items + extra
  const allFeedback = analysisResult?.evidenceFeedback || [];
  const priorityFeedback = allFeedback.slice(0, 3);
  const additionalFeedback = allFeedback.slice(3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner: Academic & Editorial */}
      <header className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold uppercase tracking-wider">
            <PenTool className="w-3.5 h-3.5" /> IELTS Writing Lab & Evidence Diagnosis
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Luyện Viết & Bóc Tách Bằng Chứng Lỗi (Evidence-Based Feedback)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            Không dừng lại ở việc ước tính điểm — Hệ thống bóc tách chính xác từng câu văn chứa lỗi, đối chiếu Rubric giám khảo và đề xuất bài tập can thiệp ngay lập tức.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-center">
          <button
            id="btn-mode-text"
            onClick={() => setInputMode('text')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              inputMode === 'text'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Gõ văn bản</span>
          </button>
          <button
            id="btn-mode-image"
            onClick={() => setInputMode('image')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              inputMode === 'image'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Chụp / OCR ảnh bài viết</span>
          </button>
        </div>
      </header>

      {/* Main 3-Column Desktop Grid / 2-Column Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= COLUMN 1 (Left 4 cols): Prompt & Task Context ================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Đề Bài ({currentPrompt.taskType})
              </span>
              <button
                id="btn-fill-sample"
                onClick={handleResetToSample}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nạp bài mẫu thử nghiệm</span>
              </button>
            </div>

            {/* Prompt Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {WRITING_PROMPTS.map((p) => (
                <button
                  key={p.id}
                  id={`prompt-pill-${p.id}`}
                  onClick={() => {
                    setSelectedPromptId(p.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                    selectedPromptId === p.id
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-300'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p.taskType} • {p.topic}
                </button>
              ))}
            </div>

            {/* Prompt Card Content */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-700">{currentPrompt.topic}</span>
                <span className="flex items-center gap-1 font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  <Clock className="w-3 h-3" /> {currentPrompt.suggestedDurationMinutes} phút • {currentPrompt.targetLevel || 'Band 6.0+'}
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-900 font-serif leading-relaxed whitespace-pre-line">
                {currentPrompt.prompt}
              </div>

              {currentPrompt.chartDescription && (
                <div className="pt-2 border-t border-slate-200">
                  <strong className="text-[11px] uppercase font-bold text-slate-600 block mb-1">
                    Dữ liệu biểu đồ Task 1:
                  </strong>
                  <div className="text-xs text-slate-700 whitespace-pre-line font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                    {currentPrompt.chartDescription}
                  </div>
                </div>
              )}
            </div>

            {/* Task Checklist / Rubric Goals */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Tiêu chuẩn giám khảo đánh giá:
              </span>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <span><strong>Task Response:</strong> Đủ số từ (≥{currentPrompt.minWords} từ), trả lời trọn vẹn yêu cầu</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <span><strong>Coherence:</strong> Cấu trúc đoạn logic, liên kết ý 3 mắt xích</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <span><strong>Lexical Resource:</strong> Paraphrase chính xác, không lặp từ thô</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <span><strong>Grammar:</strong> Đa dạng câu phức, kiểm soát chủ vị & dấu phẩy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Loop Info Box */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>Vòng lặp học tập có kiểm chứng (Evidence Loop)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Viết bài → Bóc tách bằng chứng câu lỗi → Giải thích Rubric → Bài tập Action sửa lỗi → Luyện Transfer ngữ cảnh mới → Kiểm chứng qua Re-test.
            </p>
          </div>
        </div>

        {/* ================= COLUMN 2 (Center/Right 8 cols): Editor & Feedback ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Workspace / Editor Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
            
            {/* Editor Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-indigo-600" /> Bài viết của bạn
                </span>
                {lastSavedTime && (
                  <span className="text-[11px] text-slate-600 flex items-center gap-1 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    <Save className="w-3 h-3 text-slate-600" /> {lastSavedTime}
                  </span>
                )}
              </div>

              {/* Word Count Tracker */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Số từ:</span>
                  <span className={`font-mono font-bold ${isWordCountMet ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {wordCount} / {currentPrompt.minWords} từ
                  </span>
                  {isWordCountMet ? (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                      Đạt chuẩn
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 font-semibold">
                      Cần thêm {currentPrompt.minWords - wordCount} từ
                    </span>
                  )}
                </div>

                {analysisResult && (
                  <button
                    onClick={() => setShowAnnotatedView(!showAnnotatedView)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{showAnnotatedView ? 'Chuyển sang sửa bài' : 'Xem câu văn lỗi'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Editor Area (Text Mode) */}
            {inputMode === 'text' ? (
              <div>
                {showAnnotatedView && analysisResult ? (
                  /* Annotated Essay View: Highlights sentences corresponding to feedback items */
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed font-serif space-y-3 min-h-[300px]">
                    <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
                      <span className="font-sans font-semibold text-slate-700">
                        Chế độ xem đối chiếu bằng chứng lỗi:
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Bấm vào câu được tô màu để xem phân tích chi tiết
                      </span>
                    </div>

                    {paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-slate-900 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                ) : (
                  /* Standard Live Textarea */
                  <textarea
                    ref={editorRef}
                    id="textarea-essay-input"
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                    placeholder="Nhập hoặc dán bài viết của bạn tại đây..."
                    rows={12}
                    className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 placeholder-slate-400 text-sm leading-relaxed font-mono resize-y shadow-inner"
                  />
                )}
              </div>
            ) : (
              /* Image Upload & OCR Mode */
              <div className="space-y-4">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl bg-slate-50/60 flex flex-col items-center justify-center text-center cursor-pointer transition group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Kéo thả hoặc bấm để chọn ảnh chụp bài viết
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Hỗ trợ ảnh chụp chữ viết tay, ảnh chụp màn hình bài viết hoặc biểu đồ. AI Vision sẽ tự động OCR và chấm bài.
                  </p>
                </div>

                {uploadedImageBase64 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={uploadedImageBase64}
                        alt="Uploaded preview"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-300"
                      />
                      <div>
                        <span className="text-xs font-semibold text-slate-900 block truncate max-w-xs">
                          {uploadedImageName || 'anh_bai_viet.jpg'}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-medium">
                          Đã sẵn sàng phân tích OCR
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUploadedImageBase64(null);
                        setUploadedImageName('');
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error Message (with Preservation guarantee) */}
            {errorState && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block">Có lỗi xảy ra trong quá trình phân tích:</span>
                  <p>{errorState}</p>
                </div>
              </div>
            )}

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearEditor}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                >
                  Xóa trắng bài
                </button>
                <button
                  type="button"
                  onClick={handleResetToSample}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
                >
                  Khôi phục bài mẫu
                </button>
              </div>

              {/* Submit CTA */}
              <button
                id="btn-submit-essay"
                disabled={isAnalyzing || (inputMode === 'text' && wordCount < 20) || (inputMode === 'image' && !uploadedImageBase64)}
                onClick={handleAnalyze}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition"
              >
                {isAnalyzing ? (
                  <>
                    <BrainCircuit className="w-4 h-4 animate-spin" />
                    <span>
                      {analysisProgressStep === 1 && 'Đang phân tích cấu trúc bài viết...'}
                      {analysisProgressStep === 2 && 'Đang trích xuất bằng chứng câu lỗi...'}
                      {analysisProgressStep === 3 && 'Đang đối chiếu mẫu lỗi lặp lại...'}
                      {analysisProgressStep >= 4 && 'Đang thiết lập hành động can thiệp...'}
                      {analysisProgressStep === 0 && 'AI đang bóc tách bằng chứng lỗi...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Chấm bài theo Rubric & Bóc tách bằng chứng lỗi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ================= EVALUATION & EVIDENCE-BASED FEEDBACK ================= */}
          {analysisResult ? (
            <div ref={feedbackListRef} className="space-y-6 animate-fadeIn">
              
              {/* Section 1: AI / Evidence Estimate Header */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Ước tính AI / Bằng chứng bài làm (Evidence Estimate)
                      </span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold border border-indigo-100">
                        {analysisResult.confidence === 'high' ? 'Độ tin cậy cao' : 'Độ tin cậy vừa'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                      Estimated IELTS Band Score
                    </h3>
                  </div>

                  <div className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-center shadow-sm self-start sm:self-center">
                    <span className="text-[10px] uppercase font-bold text-indigo-200 block">Tổng quan</span>
                    <span className="text-2xl font-black">Band {analysisResult.overallBand.toFixed(1)}</span>
                  </div>
                </div>

                {/* 4 Rubric Sub-scores */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Task Response', score: analysisResult.rubricScores.taskResponse, subskill: 'writing_task_response' },
                    { label: 'Coherence & Cohesion', score: analysisResult.rubricScores.coherenceCohesion, subskill: 'writing_coherence_cohesion' },
                    { label: 'Lexical Resource', score: analysisResult.rubricScores.lexicalResource, subskill: 'writing_lexical_resource' },
                    { label: 'Grammatical Range', score: analysisResult.rubricScores.grammaticalRange, subskill: 'writing_complex_grammar' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block truncate">
                        {item.label}
                      </span>
                      <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                        Band {item.score.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans">
                  <strong className="text-slate-900 block mb-1">Nhận xét của Giám khảo AI:</strong>
                  {analysisResult.bandSummary}
                </div>

                {/* Top Priority / Next Best Action Box */}
                {analysisResult.recommendedMicroPathwayId && (
                  <div className="p-5 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wide">
                        <Zap className="w-4 h-4 text-indigo-600" /> Can thiệp ưu tiên số 1 (Next Best Action):
                      </div>
                      <span className="text-[11px] text-indigo-700 font-semibold bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                        {profile.preferredSessionMinutes} phút
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                      {analysisResult.recommendedInterventionReason}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-indigo-100">
                      <span className="text-xs text-slate-600">
                        <strong>Mục tiêu:</strong> Khắc phục điểm nghẽn & kiểm chứng qua 3 câu Re-test.
                      </span>
                      <button
                        id="btn-start-writing-pathway"
                        onClick={() => onStartPathway(analysisResult.recommendedMicroPathwayId)}
                        className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 whitespace-nowrap shadow-sm transition self-start sm:self-auto"
                      >
                        <span>Khắc phục điểm nghẽn này (Vào Micro-Pathway)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Priority Evidence-Based Feedback (The Core Moat) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Bóc Tách Lỗi Chi Tiết (Evidence-Based Diagnosis)</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {allFeedback.length} lỗi trọng điểm được phát hiện
                  </span>
                </div>

                {/* Priority Issues */}
                {priorityFeedback.map((fb, idx) => {
                  const recurringCount = getRecurringErrorCount(fb.targetSubskill, fb.errorTagId);
                  const isExpanded = activeEvidenceIndex === idx;

                  return (
                    <div 
                      key={idx}
                      id={`feedback-card-${idx}`}
                      className={`p-5 rounded-xl bg-white border transition shadow-sm space-y-4 ${
                        isExpanded ? 'border-indigo-400 ring-1 ring-indigo-300' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Bar: Problem Title & Badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              {fb.problem}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold uppercase">
                                {fb.category || SUBSKILLS_DICTIONARY[fb.targetSubskill]?.name || fb.targetSubskill}
                              </span>

                              {/* Recurring Error Tag */}
                              {recurringCount >= 2 && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-amber-600" /> Mẫu lỗi lặp lại: Đã xuất hiện {recurringCount} lần
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          fb.severity === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {fb.severity === 'high' ? 'Nghiêm trọng' : 'Trung bình'}
                        </span>
                      </div>

                      {/* 1. EVIDENCE: Quoted sentence from student's text */}
                      <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-rose-800">
                          <span>🔍 Bằng chứng trích dẫn trong bài của bạn:</span>
                          <span className="text-[10px] text-rose-600 font-normal">Câu gốc</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-900 font-serif italic leading-relaxed">
                          "{fb.evidence}"
                        </p>
                      </div>

                      {/* 2. WHY: Rubric explanation */}
                      <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <strong className="text-slate-900">⚖️ Tại sao bị trừ điểm (Rubric):</strong> {fb.why}
                      </div>

                      {/* 3. BETTER VERSION: Band 7.5 - 8.5 academic rewrite */}
                      {fb.suggestedCorrection && (
                        <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                          <strong className="text-[11px] font-bold text-emerald-800 block">
                            ✨ Viết lại chuẩn Band 7.5–8.5+:
                          </strong>
                          <p className="text-xs sm:text-sm text-emerald-950 font-serif leading-relaxed">
                            {fb.suggestedCorrection}
                          </p>
                        </div>
                      )}

                      {/* 4. ACTION: Direct short exercise drill */}
                      <div className="text-xs text-slate-700 bg-amber-50/50 p-3 rounded-lg border border-amber-200/70">
                        <strong className="text-amber-900">⚡ Hành động can thiệp (Action):</strong> {fb.action}
                      </div>

                      {/* 5. TRANSFER & VERIFY: Active micro-challenge */}
                      {fb.transferPrompt && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                            <span className="flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" /> Thử thách chuyển giao (Transfer):
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">Áp dụng ngay vào câu mới</span>
                          </div>
                          
                          <p className="text-xs text-slate-700 leading-relaxed font-sans">
                            {fb.transferPrompt}
                          </p>

                          {/* Quick inline answer field for transfer challenge */}
                          <div className="flex gap-2 pt-1">
                            <input
                              type="text"
                              value={transferInputs[idx] || ''}
                              onChange={(e) => setTransferInputs({ ...transferInputs, [idx]: e.target.value })}
                              placeholder="Viết câu áp dụng của bạn tại đây..."
                              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              onClick={() => {
                                if (transferInputs[idx]?.trim()) {
                                  setTransferSubmitted({ ...transferSubmitted, [idx]: true });
                                }
                              }}
                              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                            >
                              Gửi câu
                            </button>
                          </div>

                          {transferSubmitted[idx] && (
                            <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span>Đã ghi nhận câu thực hành. Tiến bộ sẽ được kiểm chứng trong bài Re-test tiếp theo!</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 6. VERIFICATION NOTE */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span>Kiểm chứng: {fb.verificationNote || 'Sẽ được kiểm tra trong bài Re-test 3 câu tiếp theo.'}</span>
                        </span>
                        <span className="text-indigo-600 font-semibold">
                          Subskill: {fb.targetSubskill}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Additional Observations (Progressive Disclosure) */}
                {additionalFeedback.length > 0 && (
                  <div className="pt-2">
                    <button
                      onClick={() => setShowAdditionalObservations(!showAdditionalObservations)}
                      className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition"
                    >
                      <span>{showAdditionalObservations ? 'Thu gọn quan sát phụ' : `Xem thêm ${additionalFeedback.length} quan sát bổ sung`}</span>
                      {showAdditionalObservations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showAdditionalObservations && (
                      <div className="space-y-4 mt-3">
                        {additionalFeedback.map((fb, idx) => (
                          <div 
                            key={idx + 3}
                            className="p-4 rounded-xl bg-white border border-slate-200 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-slate-900">{fb.problem}</h5>
                              <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-600 font-medium">
                                {fb.targetSubskill}
                              </span>
                            </div>
                            <div className="p-2.5 bg-rose-50 rounded-lg text-xs text-slate-800 italic font-serif">
                              "{fb.evidence}"
                            </div>
                            <p className="text-xs text-slate-600">{fb.why}</p>
                            {fb.suggestedCorrection && (
                              <div className="p-2.5 bg-emerald-50 rounded-lg text-xs text-emerald-950 font-serif">
                                <strong>Gợi ý viết lại:</strong> {fb.suggestedCorrection}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 3: Session Completion Next Steps */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Bước tiếp theo sau buổi luyện viết
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hồ sơ năng lực của bạn đã được cập nhật dữ liệu bằng chứng mới nhất.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResetToSample}
                    className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                  >
                    Viết bài mới
                  </button>
                  {analysisResult.recommendedMicroPathwayId && (
                    <button
                      onClick={() => onStartPathway(analysisResult.recommendedMicroPathwayId)}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <span>Vào Pathway can thiệp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            /* Placeholder State before analysis */
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px] shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <BrainCircuit className="w-7 h-7 text-indigo-600" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="font-bold text-slate-900 text-base">
                  Chưa có kết quả bóc tách bằng chứng
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Nhập bài viết hoặc tải ảnh chụp lên, sau đó bấm <strong className="text-slate-800">"Chấm bài theo Rubric & Bóc tách bằng chứng lỗi"</strong> để xem phân tích câu văn, lỗi lặp lại và bài tập can thiệp.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
