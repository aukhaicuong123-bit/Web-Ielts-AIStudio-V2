import { ReadingPassage, WritingPrompt, SubskillInfo } from '../types';

export const SUBSKILLS_DICTIONARY: Record<string, SubskillInfo> = {
  reading_paraphrase: {
    id: 'reading_paraphrase',
    name: 'Paraphrase & Keyword Matching',
    skill: 'reading',
    description: 'Nhận diện các cách diễn đạt tương đương giữa câu hỏi và đoạn văn học thuật.',
    targetWeakness: 'Bẫy từ đồng nghĩa sai ngữ cảnh hoặc bẫy bóp méo nghĩa gốc (Distortion Trap).'
  },
  reading_cause_effect: {
    id: 'reading_cause_effect',
    name: 'Cause-Effect & Argument Logic',
    skill: 'reading',
    description: 'Suy luận mối quan hệ nhân quả và cấu trúc luận điểm của tác giả.',
    targetWeakness: 'Nhầm lẫn giữa hệ quả trực tiếp và sự tương quan (Correlation vs. Causation).'
  },
  reading_detail_inference: {
    id: 'reading_detail_inference',
    name: 'Detail Inference & True/False/Not Given',
    skill: 'reading',
    description: 'Xác minh thông tin chi tiết và phân biệt ranh giới giữa False và Not Given.',
    targetWeakness: 'Đưa suy đoán cá nhân vào bài đọc thay vì bám sát chứng cứ từ văn bản.'
  },
  reading_summary_completion: {
    id: 'reading_summary_completion',
    name: 'Summary Completion & Syntax Predict',
    skill: 'reading',
    description: 'Dự đoán từ loại và ngữ nghĩa để điền vào đoạn tóm tắt bài đọc.',
    targetWeakness: 'Sai từ loại (Word form) hoặc không khớp ngữ pháp với câu tóm tắt.'
  },
  writing_task_response: {
    id: 'writing_task_response',
    name: 'Task Response & Clear Position',
    skill: 'writing',
    description: 'Trả lời toàn diện tất cả các vế của đề bài và duy trì lập trường nhất quán.',
    targetWeakness: 'Lập trường mơ hồ (unclear thesis), luận cứ chung chung thiếu giải thích sâu.'
  },
  writing_coherence_cohesion: {
    id: 'writing_coherence_cohesion',
    name: 'Coherence & Cohesion Flow',
    skill: 'writing',
    description: 'Tổ chức đoạn văn logic với câu chủ đề rõ ràng và liên từ tự nhiên.',
    targetWeakness: 'Lạm dụng liên từ máy móc (over-linking) hoặc mạch ý nhảy cóc thiếu bước đệm.'
  },
  writing_lexical_resource: {
    id: 'writing_lexical_resource',
    name: 'Lexical Resource & Collocation Precision',
    skill: 'writing',
    description: 'Sử dụng từ vựng học thuật chính xác, đúng ngữ cảnh và kết hợp từ (collocation) tự nhiên.',
    targetWeakness: 'Dùng từ hoa mỹ sai ngữ cảnh (forced advanced vocab) hoặc dịch thô từ tiếng Việt.'
  },
  writing_complex_grammar: {
    id: 'writing_complex_grammar',
    name: 'Complex Grammatical Structures',
    skill: 'writing',
    description: 'Sử dụng đa dạng các cấu trúc phức (mệnh đề quan hệ, câu điều kiện, đảo ngữ, phân từ) chuẩn xác.',
    targetWeakness: 'Câu ghép lỗi chấm phẩy (run-on/comma splice), thiếu mệnh đề phụ thuộc hoặc sai chia thì.'
  },
  cross_paraphrase_transfer: {
    id: 'cross_paraphrase_transfer',
    name: 'Reading-to-Writing Paraphrase Transfer',
    skill: 'cross_skill',
    description: 'Vận dụng từ vựng nhận diện được từ Reading sang cấu trúc câu Writing học thuật.',
    targetWeakness: 'Chỉ hiểu nghĩa bị động khi đọc nhưng không thể chủ động diễn đạt lại trong bài viết.'
  },
  cross_argument_logic: {
    id: 'cross_argument_logic',
    name: 'Cause-Effect Argumentation Transfer',
    skill: 'cross_skill',
    description: 'Áp dụng mô hình lập luận nhân quả từ bài đọc chuẩn vào phát triển ý đoạn thân bài Writing.',
    targetWeakness: 'Luận điểm chỉ nêu ra lý do nhưng không phân tích đến hệ quả cuối cùng (End Impact).'
  }
};

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 'read_tech_ai_1',
    title: 'The Algorithmic Shift in Higher Education',
    topic: 'Technology & AI',
    level: 'Band 6.0-7.0',
    targetWeakness: 'Bẫy paraphrase từ đồng nghĩa và suy luận nhân quả',
    content: `Artificial intelligence (AI) is transforming tertiary education not merely as an automated grading instrument, but as a catalyst for cognitive restructuring. Recent longitudinal research conducted across European universities reveals that adaptive learning platforms have accelerated knowledge retention by up to 28% among undergraduate engineering cohorts. However, critics argue that excessive dependence on algorithmic feedback may inadvertently diminish students' capacity for divergent thinking and autonomous problem formulation.

The mechanism behind this pedagogical evolution lies in automated spaced repetition combined with real-time diagnostic mapping. When a learner exhibits recurring misconceptions in foundational concepts, the neural engine adjusts problem difficulty iteratively. This targeted intervention prevents the 'cognitive overload' frequently observed in traditional lecture halls. Conversely, researchers observed that students who relied exclusively on automated hints experienced a measurable decline in metacognitive monitoring—the ability to evaluate one's own comprehension independently.

Furthermore, the socioeconomic implications of AI-driven pedagogy cannot be overlooked. While affluent institutions readily procure state-of-the-art predictive analytics suites, resource-constrained universities struggle with digital infrastructure deficits. Consequently, unless international educational bodies institute standardized accessibility frameworks, artificial intelligence risks exacerbating the existing scholastic divide rather than democratizing scholarly attainment.`,
    questions: [
      {
        id: 'q_tech_1',
        questionNumber: 1,
        type: 'paraphrase_match',
        subskill: 'reading_paraphrase',
        prompt: "Which phrase in the text conveys the idea that over-reliance on AI may harm independent thinking?",
        options: [
          "automated grading instrument",
          "inadvertently diminish students' capacity for divergent thinking",
          "real-time diagnostic mapping",
          "preventing cognitive overload"
        ],
        correctAnswer: "inadvertently diminish students' capacity for divergent thinking",
        evidenceQuote: "excessive dependence on algorithmic feedback may inadvertently diminish students' capacity for divergent thinking and autonomous problem formulation.",
        explanation: "'Over-reliance' tương đương với 'excessive dependence on algorithmic feedback', và 'harm independent thinking' tương đương với 'diminish students' capacity for divergent thinking and autonomous problem formulation'.",
        distractorDetails: {
          "automated grading instrument": {
            optionText: "automated grading instrument",
            errorTagCode: "ERR_LITERAL_MATCHING",
            errorTagName: "Literal Keyword Match Trap",
            distractorReason: "Cụm từ này chỉ là công cụ chấm điểm tự động thông thường trong đoạn 1, không hề mang ý nghĩa làm tổn hại tư duy độc lập."
          },
          "real-time diagnostic mapping": {
            optionText: "real-time diagnostic mapping",
            errorTagCode: "ERR_DETAIL_MISMATCH",
            errorTagName: "Unrelated Academic Terminology",
            distractorReason: "Đây là thuật ngữ kỹ thuật chỉ cơ chế vẽ bản đồ chẩn đoán của AI, không nói về rủi ro làm giảm khả năng tư duy của người học."
          },
          "preventing cognitive overload": {
            optionText: "preventing cognitive overload",
            errorTagCode: "ERR_POLARITY_INVERSION",
            errorTagName: "Polarity Inversion (Positive vs Negative)",
            distractorReason: "Đây là lợi ích tích cực (ngăn ngừa quá tải nhận thức), hoàn toàn trái ngược với tác động tiêu cực (harm independent thinking) câu hỏi đang tìm kiếm."
          }
        }
      },
      {
        id: 'q_tech_2',
        questionNumber: 2,
        type: 'cause_effect',
        subskill: 'reading_cause_effect',
        prompt: "According to paragraph 2, what is the direct effect of students exclusively relying on automated hints?",
        options: [
          "They suffer from immediate cognitive overload.",
          "Their metacognitive monitoring ability decreases.",
          "They completely fail their engineering examinations.",
          "Their knowledge retention increases by 28%."
        ],
        correctAnswer: "Their metacognitive monitoring ability decreases.",
        evidenceQuote: "students who relied exclusively on automated hints experienced a measurable decline in metacognitive monitoring",
        explanation: "Bài đọc nêu rõ mối liên hệ nguyên nhân - kết quả trực tiếp: 'relied exclusively on automated hints' dẫn tới hệ quả 'experienced a measurable decline in metacognitive monitoring'.",
        distractorDetails: {
          "They suffer from immediate cognitive overload.": {
            optionText: "They suffer from immediate cognitive overload.",
            errorTagCode: "ERR_FALSE_CORRELATION",
            errorTagName: "False Correlation / Misattributed Cause",
            distractorReason: "Đoạn văn nói hệ thống AI giúp ngăn chặn quá tải nhận thức ('prevents cognitive overload'), chứ không phải gợi ý tự động gây ra quá tải."
          },
          "They completely fail their engineering examinations.": {
            optionText: "They completely fail their engineering examinations.",
            errorTagCode: "ERR_UNSUBSTANTIATED_LEAP",
            errorTagName: "Extreme Exaggeration / Unsubstantiated Leap",
            distractorReason: "Bài đọc chỉ nêu giảm khả năng tự giám sát nhận thức, không hề có bằng chứng nào khẳng định sinh viên thi trượt hoàn toàn."
          },
          "Their knowledge retention increases by 28%.": {
            optionText: "Their knowledge retention increases by 28%.",
            errorTagCode: "ERR_CROSS_PARAGRAPH_DISTORTION",
            errorTagName: "Misplaced Data Point",
            distractorReason: "Con số 28% là số liệu tổng quan về nền tảng thích ứng ở đoạn 1, không phải hệ quả của việc lạm dụng automated hints ở đoạn 2."
          }
        }
      },
      {
        id: 'q_tech_3',
        questionNumber: 3,
        type: 'tfng',
        subskill: 'reading_detail_inference',
        prompt: "True, False or Not Given: 'Standardized accessibility frameworks have already been established by international educational bodies.'",
        options: [
          "TRUE",
          "FALSE",
          "NOT GIVEN"
        ],
        correctAnswer: "FALSE",
        evidenceQuote: "Consequently, unless international educational bodies institute standardized accessibility frameworks, artificial intelligence risks exacerbating...",
        explanation: "Từ 'unless' (trừ khi các tổ chức quốc tế thiết lập...) chứng minh các khung chuẩn này HIỆN CHƯA ĐƯỢC THIẾT LẬP. Nhận định 'đã được thiết lập' trái ngược với thông tin bài đọc, nên đáp án là FALSE.",
        distractorDetails: {
          "TRUE": {
            optionText: "TRUE",
            errorTagCode: "ERR_EVIDENCE_BOUNDARY",
            errorTagName: "Direct Contradiction to Conditional Logic",
            distractorReason: "Bài đọc dùng cấu trúc điều kiện giả định 'unless ... institute' (trừ khi họ thiết lập), chỉ ra điều này chưa tồn tại trong thực tế."
          },
          "NOT GIVEN": {
            optionText: "NOT GIVEN",
            errorTagCode: "ERR_OVERCONFIDENCE_BIAS",
            errorTagName: "Failure to Recognize Explicit Negation",
            distractorReason: "Thông tin không phải là thiếu vắng (Not Given) mà có thông tin điều kiện phủ định trực tiếp trong văn bản."
          }
        }
      }
    ]
  },
  {
    id: 'read_env_1',
    title: 'Urban Heat Islands and Microclimate Mitigation Strategies',
    topic: 'Environment',
    level: 'Band 6.0-7.0',
    targetWeakness: 'Nhận diện quan hệ nhân quả và từ vựng chuyển tiếp',
    content: `Dense metropolitan centers frequently experience temperatures significantly elevated compared to surrounding rural areas, a phenomenon designated as the Urban Heat Island (UHI) effect. The primary driver of this thermal disparity is the pervasive substitution of natural vegetation with impermeable anthropogenic materials, such as asphalt and concrete, which possess high thermal mass and low solar reflectance (albedo).

During daylight hours, these surfaces absorb substantial solar radiation, which is subsequently re-radiated into the canopy layer during the evening. This nocturnal heat dissipation severely impedes natural cooling cycles, thereby intensifying municipal energy consumption for air conditioning and elevating respiratory health risks among vulnerable demographics.

To counteract these adverse repercussions, urban planners increasingly advocate for bioswales, high-albedo cool roofs, and extensive urban tree canopies. Empirical modeling indicates that expanding canopy coverage by 15% can lower peak summer surface temperatures by 1.8 to 2.5 degrees Celsius. Nonetheless, retrofitting established historic districts poses profound structural and logistical bottlenecks.`,
    questions: [
      {
        id: 'q_env_1',
        questionNumber: 1,
        type: 'cause_effect',
        subskill: 'reading_cause_effect',
        prompt: "What is highlighted as the fundamental cause behind the Urban Heat Island disparity?",
        options: [
          "Excessive use of air conditioning during daytime hours.",
          "Replacing natural greenery with non-porous materials that trap heat.",
          "The complete absence of urban tree canopies in rural areas.",
          "The installation of high-albedo cool roofs."
        ],
        correctAnswer: "Replacing natural greenery with non-porous materials that trap heat.",
        evidenceQuote: "The primary driver of this thermal disparity is the pervasive substitution of natural vegetation with impermeable anthropogenic materials...",
        explanation: "'The primary driver' = fundamental cause; 'substitution of natural vegetation with impermeable anthropogenic materials' = replacing natural greenery with non-porous materials that trap heat.",
        distractorDetails: {
          "Excessive use of air conditioning during daytime hours.": {
            optionText: "Excessive use of air conditioning during daytime hours.",
            errorTagCode: "ERR_REVERSED_CAUSALITY",
            errorTagName: "Reversed Causality (Effect mistaken for Cause)",
            distractorReason: "Việc dùng điều hòa là hệ quả kéo theo (effect) do trời nóng, chứ không phải là nguyên nhân gốc rễ (primary driver) tạo ra hiện tượng UHI."
          },
          "The complete absence of urban tree canopies in rural areas.": {
            optionText: "The complete absence of urban tree canopies in rural areas.",
            errorTagCode: "ERR_UNSUBSTANTIATED_LEAP",
            errorTagName: "Factually Inverted Distractor",
            distractorReason: "Vùng nông thôn (rural areas) có nhiều cây xanh tự nhiên hơn, nhận định này phi logic và hoàn toàn không có trong bài."
          },
          "The installation of high-albedo cool roofs.": {
            optionText: "The installation of high-albedo cool roofs.",
            errorTagCode: "ERR_SOLUTION_VS_PROBLEM",
            errorTagName: "Solution Mistaken for Cause",
            distractorReason: "Cool roofs là giải pháp khắc phục (mitigation strategy) ở đoạn 3, không phải nguyên nhân gây nóng."
          }
        }
      },
      {
        id: 'q_env_2',
        questionNumber: 2,
        type: 'paraphrase_match',
        subskill: 'reading_paraphrase',
        prompt: "Which term in the text means 'negative consequences' or 'harmful impacts'?",
        options: [
          "thermal disparity",
          "adverse repercussions",
          "nocturnal heat dissipation",
          "empirical modeling"
        ],
        correctAnswer: "adverse repercussions",
        evidenceQuote: "To counteract these adverse repercussions, urban planners increasingly advocate for...",
        explanation: "'Adverse' = bất lợi/tiêu cực (negative/harmful); 'repercussions' = hậu quả/tác động xấu (consequences/impacts).",
        distractorDetails: {
          "thermal disparity": {
            optionText: "thermal disparity",
            errorTagCode: "ERR_PARAPHRASE_DISTORTION",
            errorTagName: "Semantic Approximation Trap",
            distractorReason: "'Thermal disparity' chỉ sự chênh lệch nhiệt độ đơn thuần, mang tính trung tính mô tả hiện tượng vật lý chứ không biểu thị nghĩa 'tác động xấu/hậu quả tiêu cực'."
          },
          "nocturnal heat dissipation": {
            optionText: "nocturnal heat dissipation",
            errorTagCode: "ERR_DETAIL_MISMATCH",
            errorTagName: "Process Description Mismatch",
            distractorReason: "Đây là thuật ngữ chỉ quá trình tỏa nhiệt vào ban đêm, không đồng nghĩa với 'negative consequences'."
          },
          "empirical modeling": {
            optionText: "empirical modeling",
            errorTagCode: "ERR_LITERAL_MATCHING",
            errorTagName: "Context Irrelevance",
            distractorReason: "'Empirical modeling' nghĩa là phương pháp mô hình hóa dựa trên thực nghiệm, không liên quan đến hậu quả tiêu cực."
          }
        }
      }
    ]
  },
  {
    id: 'read_cog_1',
    title: 'Neuroplasticity and Language Acquisition in Adulthood',
    topic: 'Education',
    level: 'Band 6.0-7.0',
    targetWeakness: 'Suy luận ranh giới thông tin và nhận diện paraphrase phức',
    content: `For decades, the prevailing consensus in developmental neurology maintained that language acquisition was governed by a strict 'critical period' hypothesis, after which the neural architecture became structurally immutable. Recent high-resolution neuroimaging studies, however, have challenged this deterministic dogma. Adult brains consistently demonstrate neuroplasticity—the capacity to forge novel synaptic pathways and reallocate cortical territory in response to intensive linguistic stimuli.

While children assimilate syntax through implicit procedural learning, adults predominantly leverage explicit declarative memory systems. This fundamental divergence explains why adult learners often excel at analytical grammatical deconstruction but struggle with spontaneous phonological mimicry. Crucially, when adult second-language immersion is combined with targeted retrieval practice, functional MRI scans reveal bilateral activation in the prefrontal cortex comparable to native bilingual speakers.

Nevertheless, neurobiologists emphasize that cognitive fatigue poses a more pronounced barrier for mature learners. Because explicit semantic processing demands continuous prefrontal recruitment, prolonged unstructured study sessions frequently yield diminishing neural consolidation. Strategic micro-sessions, interspersed with consolidated rest intervals, optimize synaptic consolidation far more effectively than continuous massed practice.`,
    questions: [
      {
        id: 'q_cog_1',
        questionNumber: 1,
        type: 'paraphrase_match',
        subskill: 'reading_paraphrase',
        prompt: "Which phrase in paragraph 1 indicates that past scientific belief considered the adult brain incapable of structural change?",
        options: [
          "developmental neurology",
          "neural architecture became structurally immutable",
          "novel synaptic pathways",
          "intensive linguistic stimuli"
        ],
        correctAnswer: "neural architecture became structurally immutable",
        evidenceQuote: "after which the neural architecture became structurally immutable.",
        explanation: "'Incapable of structural change' tương đương hoàn toàn với 'structurally immutable' (không thể thay đổi về mặt cấu trúc).",
        distractorDetails: {
          "developmental neurology": {
            optionText: "developmental neurology",
            errorTagCode: "ERR_LITERAL_MATCHING",
            errorTagName: "Subject Field Keyword Distractor",
            distractorReason: "Đây chỉ là tên ngành thần kinh học phát triển, không mô tả đặc tính không thể thay đổi của não bộ."
          },
          "novel synaptic pathways": {
            optionText: "novel synaptic pathways",
            errorTagCode: "ERR_POLARITY_INVERSION",
            errorTagName: "Opposite Concept Distractor",
            distractorReason: "'Novel synaptic pathways' (các đường dẫn khớp thần kinh mới) chính là biểu hiện của sự biến đổi (thay đổi cấu trúc mới), trái ngược với ý câu hỏi."
          },
          "intensive linguistic stimuli": {
            optionText: "intensive linguistic stimuli",
            errorTagCode: "ERR_DETAIL_MISMATCH",
            errorTagName: "Stimulus vs Trait Confusion",
            distractorReason: "Đây là kích thích ngôn ngữ cường độ cao (tác nhân bên ngoài), không phải trạng thái cấu trúc não bộ."
          }
        }
      },
      {
        id: 'q_cog_2',
        questionNumber: 2,
        type: 'cause_effect',
        subskill: 'reading_cause_effect',
        prompt: "According to paragraph 3, why are continuous long study sessions less effective for adult language learners?",
        options: [
          "Adult brains completely lack procedural memory circuits.",
          "High prefrontal cognitive load triggers fatigue, reducing neural consolidation.",
          "Mature learners have no bilateral activation in the prefrontal cortex.",
          "Rest intervals permanently erase recently acquired vocabulary."
        ],
        correctAnswer: "High prefrontal cognitive load triggers fatigue, reducing neural consolidation.",
        evidenceQuote: "Because explicit semantic processing demands continuous prefrontal recruitment, prolonged unstructured study sessions frequently yield diminishing neural consolidation.",
        explanation: "Bài đọc nêu rõ: do việc xử lý ngữ nghĩa đòi hỏi vỏ não trước trán làm việc liên tục dẫn đến mệt mỏi nhận thức ('cognitive fatigue'), các buổi học kéo dài sẽ làm suy giảm hiệu quả củng cố thần kinh ('diminishing neural consolidation').",
        distractorDetails: {
          "Adult brains completely lack procedural memory circuits.": {
            optionText: "Adult brains completely lack procedural memory circuits.",
            errorTagCode: "ERR_UNSUBSTANTIATED_LEAP",
            errorTagName: "Extreme Categorical Generalization",
            distractorReason: "Đoạn 2 chỉ nói trẻ em tiếp thu qua procedural learning còn người lớn chủ yếu dùng declarative memory, không hề nói người lớn 'hoàn toàn không có' mạch procedural."
          },
          "Mature learners have no bilateral activation in the prefrontal cortex.": {
            optionText: "Mature learners have no bilateral activation in the prefrontal cortex.",
            errorTagCode: "ERR_POLARITY_INVERSION",
            errorTagName: "Direct Contradiction with Paragraph 2",
            distractorReason: "Đoạn 2 khẳng định khi luyện tập đúng cách, quét fMRI cho thấy có sự kích hoạt song phương (bilateral activation) tương đương người bản ngữ."
          },
          "Rest intervals permanently erase recently acquired vocabulary.": {
            optionText: "Rest intervals permanently erase recently acquired vocabulary.",
            errorTagCode: "ERR_FALSE_CORRELATION",
            errorTagName: "Inverted Fact Trap",
            distractorReason: "Đoạn cuối nhấn mạnh nghỉ ngơi giúp tối ưu hóa củng cố khớp thần kinh ('optimize synaptic consolidation'), chứ không hề xóa bỏ từ vựng."
          }
        }
      }
    ]
  }
];

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'write_prompt_1',
    taskType: 'Task 2',
    topic: 'Technology & AI',
    prompt: `Some people believe that artificial intelligence will create more opportunities for workers and boost productivity, while others argue that it will cause widespread unemployment and deskilling.

Discuss both views and give your own opinion. Support your arguments with relevant examples and evidence.`,
    minWords: 250,
    suggestedDurationMinutes: 40,
    targetLevel: 'Band 6.0 - 7.5+',
    difficulty: 'Standard',
    keySubskills: ['writing_task_response', 'writing_coherence_cohesion', 'writing_lexical_resource', 'writing_complex_grammar']
  },
  {
    id: 'write_prompt_2',
    taskType: 'Task 2',
    topic: 'Environment',
    prompt: `The increase in global temperatures and urban heat is causing severe environmental and health challenges in cities worldwide.

What are the main causes of this problem, and what practical measures can municipal governments implement to mitigate it?`,
    minWords: 250,
    suggestedDurationMinutes: 40,
    targetLevel: 'Band 6.0 - 7.5+',
    difficulty: 'Standard',
    keySubskills: ['writing_task_response', 'writing_coherence_cohesion', 'writing_lexical_resource', 'writing_complex_grammar']
  },
  {
    id: 'write_prompt_3',
    taskType: 'Task 1',
    topic: 'Technology & AI',
    prompt: `The chart below shows the adoption rate (%) of AI diagnostic tools in university research departments across five countries between 2020 and 2026.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.`,
    chartDescription: `Bar chart data:
- Country A: 2020 (15%), 2023 (38%), 2026 (74%)
- Country B: 2020 (22%), 2023 (45%), 2026 (68%)
- Country C: 2020 (10%), 2023 (25%), 2026 (52%)
- Country D: 2020 (30%), 2023 (48%), 2026 (85% - Highest)
- Country E: 2020 (8%), 2023 (18%), 2026 (35% - Lowest)`,
    minWords: 150,
    suggestedDurationMinutes: 20,
    targetLevel: 'Band 6.0 - 7.0',
    difficulty: 'Standard',
    keySubskills: ['writing_task_response', 'writing_coherence_cohesion', 'writing_lexical_resource', 'writing_complex_grammar']
  },
  {
    id: 'write_prompt_4',
    taskType: 'Task 2',
    topic: 'Education',
    prompt: `Many educational institutions are shifting towards fully digitized self-paced learning models, replacing conventional lecture-based instruction.

Do the advantages of this shift outweigh the potential disadvantages for students' academic and social development?`,
    minWords: 250,
    suggestedDurationMinutes: 40,
    targetLevel: 'Band 6.5 - 8.0',
    difficulty: 'Challenging',
    keySubskills: ['writing_task_response', 'writing_coherence_cohesion', 'writing_lexical_resource', 'writing_complex_grammar']
  }
];
