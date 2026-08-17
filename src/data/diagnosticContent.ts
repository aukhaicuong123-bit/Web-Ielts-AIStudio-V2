import { SubskillId } from '../types';

export interface DiagnosticOption {
  id: string;
  text: string;
  isCorrect: boolean;
  distractorType?: 'distortion' | 'overspecification' | 'unsubstantiated_leap' | 'opposite' | 'evidence_boundary';
  feedback: string;
  errorTagCode?: string;
  errorTagName?: string;
}

export interface DiagnosticReadingQuestion {
  id: string;
  questionNumber: number;
  subskillId: SubskillId;
  subskillName: string;
  questionType: string;
  difficulty: 'Standard' | 'Challenging';
  passageTitle: string;
  passageText: string;
  prompt: string;
  options: DiagnosticOption[];
  explanation: string;
  evidenceQuote: string;
}

export interface DiagnosticWritingTask {
  id: string;
  topic: string;
  prompt: string;
  instructions: string;
  recommendedWords: string;
  minWords: number;
  maxWords: number;
  evaluatedSubskills: SubskillId[];
}

export const DIAGNOSTIC_READING_QUESTIONS: DiagnosticReadingQuestion[] = [
  {
    id: 'diag_q1',
    questionNumber: 1,
    subskillId: 'reading_paraphrase',
    subskillName: 'Paraphrase Recognition & Distortion Traps',
    questionType: 'Paraphrase Verification',
    difficulty: 'Standard',
    passageTitle: 'The Cognitive Impact of Educational Technology',
    passageText: "Although automated tutoring systems have demonstrably accelerated foundational concept acquisition, educational researchers caution that excessive reliance on algorithmic prompts may inadvertently undermine students' capacity for divergent thinking.",
    prompt: "Câu nào dưới đây là diễn đạt tương đương (True Paraphrase) chuẩn xác nhất cho câu trích trên mà không bóp méo ngữ nghĩa gốc?",
    options: [
      {
        id: 'A',
        text: 'A. Automated tutoring platforms are dangerous because they deliberately force students to memorize facts instead of thinking creatively.',
        isCorrect: false,
        distractorType: 'distortion',
        feedback: 'SAI (Bẫy bóp méo mức độ & ý định): Từ "deliberately force" (cố tình ép buộc) mâu thuẫn trực tiếp với "inadvertently undermine" (vô tình làm suy giảm) trong đoạn văn gốc.',
        errorTagCode: 'ERR_PARAPHRASE_DISTORTION',
        errorTagName: 'Bẫy paraphrase bóp méo nghĩa gốc (Distortion Trap)'
      },
      {
        id: 'B',
        text: 'B. While automated learning tools speed up baseline understanding, overdependence on them might unintentionally erode learners’ creative problem-solving ability.',
        isCorrect: true,
        feedback: 'CHÍNH XÁC: Các cặp từ tương đương hoàn hảo: "automated tutoring systems" = "automated learning tools", "accelerated foundational concept acquisition" = "speed up baseline understanding", "inadvertently undermine" = "unintentionally erode", "divergent thinking" = "creative problem-solving ability".'
      },
      {
        id: 'C',
        text: 'C. Students will completely stop thinking for themselves in all subjects if schools continue to adopt automated software.',
        isCorrect: false,
        distractorType: 'unsubstantiated_leap',
        feedback: 'SAI (Bẫy suy đoán cực đoan / Extreme generalization): "Completely stop thinking in all subjects" là suy đoán phóng đại không có căn cứ từ bài đọc.',
        errorTagCode: 'ERR_EXTRAPOLATION_TRAP',
        errorTagName: 'Bẫy phóng đại / Suy diễn cực đoan (Extreme Generalization)'
      }
    ],
    explanation: 'Paraphrase học thuật chuẩn xác phải bảo toàn nguyên vẹn sắc thái ý nghĩa (Modality/Degree of certainty) và mối quan hệ ngữ nghĩa giữa các mệnh đề.',
    evidenceQuote: "excessive reliance on algorithmic prompts may inadvertently undermine students' capacity for divergent thinking."
  },
  {
    id: 'diag_q2',
    questionNumber: 2,
    subskillId: 'reading_cause_effect',
    subskillName: 'Cause-Effect Logic & Mechanism Inference',
    questionType: 'Mechanism Mapping',
    difficulty: 'Challenging',
    passageTitle: 'Urban Heat Island Dynamics',
    passageText: "Pervasive asphalt and concrete surfaces absorb extensive solar radiation during the day. Because nocturnal heat dissipation is impeded by high building density, building interiors remain warm, which compels residents to run high-powered air conditioning non-stop, thereby precipitating an exponential escalation in peak municipal power demand.",
    prompt: "Đâu là mắt xích cơ chế trung gian trực tiếp dẫn tới việc tăng tiêu thụ điện năng đô thị?",
    options: [
      {
        id: 'A',
        text: 'A. Giá điện đô thị giảm vào mùa hè khiến người dân bật điều hòa liên tục.',
        isCorrect: false,
        distractorType: 'opposite',
        feedback: 'SAI (Suy đoán sai lệch): Bài đọc không đề cập đến giá điện mà nói về hiện tượng giữ nhiệt của bê tông.',
        errorTagCode: 'ERR_FALSE_CORRELATION',
        errorTagName: 'Nhầm lẫn tương quan giả (False Correlation)'
      },
      {
        id: 'B',
        text: 'B. Thiếu cây xanh khiến các trạm phát điện của thành phố bị quá tải.',
        isCorrect: false,
        distractorType: 'evidence_boundary',
        feedback: 'SAI (Vượt quá giới hạn văn bản): Bài đọc không nhắc tới việc trạm phát điện thiếu cây xanh.',
        errorTagCode: 'ERR_EVIDENCE_BOUNDARY',
        errorTagName: 'Đưa thông tin ngoài văn bản vào bài đọc (Evidence Boundary Error)'
      },
      {
        id: 'C',
        text: 'C. Nhiệt lượng ban đêm không thoát được ➔ Nhà ở bị om nhiệt ➔ Người dân buộc phải bật điều hòa liên tục.',
        isCorrect: true,
        feedback: 'CHÍNH XÁC: Chuỗi nhân quả 3 bước rõ ràng: Bê tông giữ nhiệt -> Ban đêm không hạ nhiệt -> Nhà bị nóng -> Bật điều hòa liên tục -> Tăng tải điện.'
      }
    ],
    explanation: 'Mối quan hệ nhân quả học thuật đòi hỏi xác định đúng mắt xích cơ chế (Mechanism), tránh việc bỏ qua bước đệm logic.',
    evidenceQuote: "Because nocturnal heat dissipation is impeded by high building density, building interiors remain warm, which compels residents to run high-powered air conditioning non-stop..."
  },
  {
    id: 'diag_q3',
    questionNumber: 3,
    subskillId: 'reading_detail_inference',
    subskillName: 'Detail Inference & Textual Boundary',
    questionType: 'True/False/Not Given Analysis',
    difficulty: 'Standard',
    passageTitle: 'Clinical Trials in Neuro-Pediatrics',
    passageText: "While early clinical trials demonstrated a statistically significant reduction in acute symptoms among pediatric cohorts, comprehensive evaluations of neurocognitive development across diverse socio-economic backgrounds remain subject to ongoing longitudinal observation.",
    prompt: "Theo thông tin trong đoạn văn, nhận định sau là True (Đúng), False (Sai), hay Not Given (Không có thông tin)?\nNhận định: 'Các nhà khoa học đã chứng minh hoàn toàn rằng phương pháp điều trị này an toàn tuyệt đối cho sự phát triển nhận thức dài hạn của trẻ em.'",
    options: [
      {
        id: 'A',
        text: 'A. True — Vì các thử nghiệm lâm sàng ban đầu đã ghi nhận giảm triệu chứng rõ rệt.',
        isCorrect: false,
        distractorType: 'distortion',
        feedback: 'SAI (Nhầm lẫn giữa triệu chứng ngắn hạn và an toàn dài hạn): Thử nghiệm mới chỉ chứng minh giảm triệu chứng cấp tính (acute symptoms), còn nhận thức dài hạn (neurocognitive development) vẫn đang theo dõi.',
        errorTagCode: 'ERR_OVERCONFIDENCE_BIAS',
        errorTagName: 'Nhầm lẫn kết quả ngắn hạn với kết luận dài hạn'
      },
      {
        id: 'B',
        text: 'B. False — Vì đánh giá phát triển nhận thức dài hạn vẫn đang trong quá trình theo dõi chứ chưa có kết luận hoàn tất.',
        isCorrect: true,
        feedback: 'CHÍNH XÁC: "remain subject to ongoing longitudinal observation" chứng tỏ chưa có kết luận an toàn tuyệt đối, nên nhận định "đã chứng minh hoàn toàn" là SAI (False).'
      },
      {
        id: 'C',
        text: 'C. Not Given — Vì bài đọc không nói đến đối tượng trẻ em.',
        isCorrect: false,
        distractorType: 'evidence_boundary',
        feedback: 'SAI: Từ "pediatric cohorts" trong bài đọc chính là nhóm bệnh nhi/trẻ em.',
        errorTagCode: 'ERR_VOCAB_INFERENCE',
        errorTagName: 'Thiếu vốn từ nhận diện thuật ngữ học thuật (pediatric = trẻ em)'
      }
    ],
    explanation: 'Dạng câu hỏi True/False/Not Given đòi hỏi ranh giới chính xác giữa thông tin đã được kiểm chứng và thông tin còn đang nghiên cứu.',
    evidenceQuote: "comprehensive evaluations of neurocognitive development across diverse socio-economic backgrounds remain subject to ongoing longitudinal observation."
  }
];

export const DIAGNOSTIC_WRITING_TASK: DiagnosticWritingTask = {
  id: 'diag_writing_1',
  topic: 'Environment & Urban Infrastructure',
  prompt: 'Why should municipal authorities prioritize investing in clean public transit systems rather than widening existing highways?',
  instructions: 'Viết từ 2–3 câu (40–70 từ). Nêu rõ 1 lý do thuyết phục và phân tích hệ quả logic kèm liên từ chuyển ý phù hợp.',
  recommendedWords: '40–70 từ',
  minWords: 25,
  maxWords: 100,
  evaluatedSubskills: [
    'writing_task_response',
    'writing_coherence_cohesion',
    'writing_lexical_resource',
    'writing_complex_grammar'
  ]
};
