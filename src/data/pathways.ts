import { MicroPathway } from '../types';

export const CROSS_SKILL_PATHWAYS: MicroPathway[] = [
  {
    id: 'pathway_paraphrase',
    title: 'Pathway 1: Precision Paraphrasing & Distortion Traps',
    targetWeakness: 'Lỗi bóp méo nghĩa từ vựng (Distortion Trap) & lặp từ vựng trong Writing',
    objective: 'Chuyển hóa năng lực nhận diện bẫy paraphrase trong bài đọc thành kỹ năng biến đổi từ vựng và câu văn chuẩn xác trong IELTS Writing.',
    triggerCondition: 'Reading Paraphrasing accuracy < 60% hoặc Writing Lexical Resource bị lặp từ',
    triggerSubskill: 'reading_paraphrase',
    targetSubskill: 'reading_paraphrase',
    thresholdScore: 60,
    description: 'Chuyển hóa năng lực nhận diện bẫy từ đồng nghĩa trong bài đọc thành kỹ năng paraphrase linh hoạt, chính xác trong câu văn IELTS Writing.',
    durationMinutes: 18,
    estimatedMinutes: 18,
    currentEvidenceContext: 'Ghi nhận 3 lỗi bẫy bóp méo nghĩa từ vựng (Distortion trap) gần đây trong Reading & Writing.',
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Nhận diện bẫy ngữ nghĩa (Recognition)',
        type: 'recognition',
        objective: 'Nhận diện phương án paraphrase bảo toàn nghĩa vs phương án bóp méo mức độ hoặc phạm vi ý niệm.',
        instruction: 'Đọc câu trích học thuật dưới đây và chọn câu paraphrase chuẩn xác nhất, phân biệt với bẫy phóng đại (Distortion trap) hoặc suy diễn quá đà (Unwarranted assumption).',
        content: {
          originalSentence: "Algorithmic tutoring systems inadvertently reduce students' intrinsic inclination to formulate autonomous inquiries.",
          targetWord: "inadvertently reduce ... intrinsic inclination",
          options: [
            {
              text: "A. AI tutors intentionally force students to stop asking questions during lectures.",
              isCorrect: false,
              feedback: "Bẫy bóp méo mức độ (Distortion Trap): 'Intentionally force' mâu thuẫn hoàn toàn với 'inadvertently' (vô tình/không cố ý)."
            },
            {
              text: "B. Automated learning tools may unintentionally diminish learners' capacity to raise independent questions.",
              isCorrect: true,
              feedback: "Chính xác tuyệt đối: 'Automated learning tools' = 'algorithmic tutoring systems', 'unintentionally diminish' = 'inadvertently reduce', 'learners' capacity to raise independent questions' = 'students' intrinsic inclination to formulate autonomous inquiries'."
            },
            {
              text: "C. Students no longer need to study because algorithms solve all homework inquiries.",
              isCorrect: false,
              feedback: "Bẫy suy đoán vô căn cứ (Overgeneralization): Văn bản chỉ đề cập sự suy giảm khuynh hướng tự hỏi, không khẳng định học sinh không cần học nữa."
            }
          ]
        }
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Chuyển đổi cấu trúc có hướng dẫn (Guided Transformation)',
        type: 'transformation',
        objective: 'Biến đổi ngữ nghĩa từ dạng [Động từ + Trạng từ] sang cụm danh từ học thuật (Nominalization).',
        instruction: 'Biến đổi câu văn thô ráp sau đây sang văn phong học thuật nâng cao bằng cách áp dụng kỹ thuật Nominalization và dùng các cụm từ gợi ý.',
        content: {
          prompt: "Biến đổi câu sau sang cấu trúc học thuật nâng cao bằng cách áp dụng danh từ hóa (Nominalization):",
          baseSentence: "Urban temperatures rise rapidly because cities have too many concrete buildings.",
          transformationHint: "Sử dụng cụm danh từ: 'the proliferation of impermeable concrete structures' và động từ 'precipitate'",
          sampleAnswers: [
            "The proliferation of impermeable concrete structures precipitates a rapid surge in urban temperatures.",
            "A rapid escalation in urban temperatures is precipitated by the proliferation of concrete infrastructure."
          ],
          modelExplanation: "Quy tắc: Thay vì dùng [S + V thô] ('temperatures rise rapidly because cities have...'), dùng cấu trúc nguyên nhân - hệ quả với danh từ hóa ('The proliferation of... precipitates a rapid surge in...')."
        }
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Ứng dụng sang ngữ cảnh mới (Transfer Task)',
        type: 'transfer',
        objective: 'Tự viết câu mở đầu hoặc luận điểm cho đề bài mới hoàn toàn mà không lặp từ khóa thô cứng.',
        instruction: 'Áp dụng kỹ năng chuyển đổi từ vựng và danh từ hóa vào một đề bài IELTS Writing Task 2 mới hoàn toàn. Hệ thống AI sẽ phân tích câu của bạn theo 5 tiêu chí: Điểm làm tốt, Lỗi còn sót, Bằng chứng câu chữ, Câu mẫu Band 8.0+ và Quy tắc chuyển giao.',
        transferRequirement: 'Viết lại câu mở đầu/luận điểm không lặp từ và bảo toàn sắc thái học thuật.',
        content: {
          topicPrompt: "Topic: Some educators believe that artificial intelligence tools in schools undermine critical thinking skills, while others argue they boost research efficiency.",
          task: "Viết 1 câu Thesis Statement (hoặc câu mở bài) tổng hợp 2 luồng quan điểm trên mà KHÔNG lặp lại các từ 'schools', 'undermine', 'critical thinking', 'boost' một cách đơn giản.",
          originalSentence: "Some educators believe that artificial intelligence tools in schools undermine critical thinking skills, while others argue they boost research efficiency."
        }
      },
      {
        stepNumber: 4,
        title: 'Bước 4: Kiểm chứng tiến bộ (Re-Test Verification)',
        type: 'retest',
        objective: 'Kiểm tra năng lực nhận diện paraphrase trên 2 ngữ cảnh độc lập để xác minh điểm yếu đã được triệt tiêu.',
        instruction: 'Hoàn thành bài kiểm tra ngắn 2 câu hỏi đối chứng. Hệ thống sẽ so sánh điểm Before vs After và cập nhật hồ sơ năng lực.',
        content: {
          subskill: 'reading_paraphrase',
          questions: [
            {
              prompt: "Câu hỏi 1: Chọn câu paraphrase học thuật chuẩn xác nhất cho luận điểm: 'Governments should invest heavily in public transport to curb vehicle emissions.'",
              options: [
                "Authorities ought to allocate substantial financial resources to municipal transit networks in order to mitigate vehicular pollution.",
                "Politicians must buy more clean electric buses immediately so private cars become illegal.",
                "Public transport should be made completely free to solve all atmospheric environmental problems."
              ],
              correctIndex: 0,
              explanation: "Phương án A thay thế chính xác: 'Governments' -> 'Authorities', 'invest heavily' -> 'allocate substantial financial resources', 'public transport' -> 'municipal transit networks', 'curb vehicle emissions' -> 'mitigate vehicular pollution'."
            },
            {
              prompt: "Câu hỏi 2: Nhận diện lỗi bóp méo trong câu paraphrase sau: Gốc: 'Traditional print books will disappear completely within five years.' -> Paraphrase: 'Conventional paper publications might decline gradually over several decades.'",
              options: [
                "Lỗi bóp méo mức độ chắc chắn & khung thời gian (Certainty & Timeframe distortion): Từ khẳng định 'will disappear completely in 5 years' bị đổi thành khả năng 'might decline gradually in decades'.",
                "Không có lỗi nào, câu diễn đạt rất tự nhiên.",
                "Lỗi sai thì quá khứ đơn."
              ],
              correctIndex: 0,
              explanation: "Paraphrase học thuật phải giữ nguyên mức độ chắc chắn (modality) và khung thời gian của câu gốc."
            }
          ]
        }
      }
    ]
  },
  {
    id: 'pathway_cause_effect',
    title: 'Pathway 2: Cause-Effect Logic & Logical Bridge Construction',
    targetWeakness: 'Lỗi nhảy cóc lập luận (Unsubstantiated Leap) & thiếu bước đệm trong Coherence',
    objective: 'Xây dựng chuỗi lập luận 3 mắt xích (Cause -> Mechanism -> Final Impact) để giải quyết dứt điểm lỗi ý nhảy cóc trong Writing Coherence.',
    triggerCondition: 'Reading Cause-Effect score < 60% hoặc Writing Coherence & Cohesion thiếu bước đệm',
    triggerSubskill: 'reading_cause_effect',
    targetSubskill: 'reading_cause_effect',
    thresholdScore: 60,
    description: 'Rèn luyện chuỗi lập luận logic 3 mắt xích (Cause -> Mechanism -> Final Impact) học từ bài đọc học thuật để giải quyết dứt điểm lỗi ý nhảy cóc trong Writing.',
    durationMinutes: 20,
    estimatedMinutes: 20,
    currentEvidenceContext: 'Ghi nhận lập luận thiếu mắt xích trung gian (Unsubstantiated Leap) trong bài làm gần đây.',
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Phân tích chuỗi nhân quả trong bài đọc (Recognition)',
        type: 'recognition',
        objective: 'Xác định mắt xích giải thích cơ chế trung gian (Mechanism) trong đoạn trích khoa học.',
        instruction: 'Đọc đoạn trích học thuật dưới đây và xác định mắt xích trung gian trực tiếp kết nối nguyên nhân đầu và hệ quả cuối.',
        content: {
          passageExcerpt: "Impermeable surfaces absorb solar radiation during the day. As nocturnal cooling is impeded, building interiors retain heat, which forces residents to run high-powered cooling systems continuously, thereby escalating peak municipal energy consumption.",
          question: "Mắt xích trung gian trực tiếp dẫn tới việc 'tăng tiêu thụ điện năng đô thị' (escalating peak municipal energy consumption) là gì?",
          options: [
            {
              text: "A. Bề mặt bê tông không thấm nước hấp thụ ánh nắng mặt trời vào ban ngày.",
              isCorrect: false,
              feedback: "Đây là nguyên nhân ban đầu (Root Cause), chưa phải mắt xích trung gian trực tiếp kích hoạt mức tiêu thụ điện năng."
            },
            {
              text: "B. Nhà ở bị om nhiệt ban đêm buộc cư dân phải vận hành thiết bị làm mát công suất lớn liên tục.",
              isCorrect: true,
              feedback: "Chính xác: Mắt xích giải thích cơ chế hành vi tiêu dùng ('forces residents to run high-powered cooling systems continuously') là cầu nối trực tiếp tới việc tăng điện năng tiêu thụ."
            },
            {
              text: "C. Giá điện năng đô thị giảm mạnh vào mùa hè.",
              isCorrect: false,
              feedback: "Không có thông tin này trong bài đọc."
            }
          ]
        }
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Xây dựng cầu nối logic (Guided Transformation)',
        type: 'transformation',
        objective: 'Viết câu giải thích cơ chế nối liền 2 ý tưởng rời rạc để loại bỏ lỗi nhảy cóc.',
        instruction: 'Ý A và Ý B dưới đây có mối quan hệ nhân quả nhưng bị thiếu bước giải thích tại sao. Hãy viết 1 câu trung gian giải thích cơ chế (Mechanism) nối liền 2 ý.',
        content: {
          premise: "Ý A (Nguyên nhân): Remote working allows employees to eliminate long daily commutes.",
          conclusion: "Ý B (Hệ quả): Companies observe a measurable increase in quarterly project delivery rates.",
          instruction: "Viết 1 câu trung gian giải thích tại sao việc tiết kiệm thời gian đi lại lại làm tăng năng suất và tiến độ dự án của công ty.",
          sampleAnswers: [
            "By saving considerable commute time and avoiding transit fatigue, workers preserve cognitive energy and can dedicate more focused working hours to complex tasks, thereby directly accelerating project execution.",
            "This reduction in travel time mitigates physical exhaustion, allowing staff to approach daily deliverables with greater mental clarity and productivity."
          ],
          modelExplanation: "Quy tắc 3 mắt xích: Tiết kiệm thời gian đi lại -> Giảm mệt mỏi & tăng năng lượng tập trung (Mechanism) -> Năng suất hoàn thành dự án cao hơn (Impact)."
        }
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Ứng dụng viết đoạn lập luận hoàn chỉnh (Transfer Task)',
        type: 'transfer',
        objective: 'Tự viết 1 đoạn lập luận PEEL (3-4 câu) trong đề bài mới, bảo đảm chuỗi nhân quả 3 bước chặt chẽ.',
        instruction: 'Áp dụng mô hình chuỗi nhân quả 3 bước (Point -> Explanation/Mechanism -> Impact) để viết 1 đoạn văn thân bài ngắn (50-80 từ) cho đề bài mới dưới đây.',
        transferRequirement: 'Viết đoạn văn ngắn có ít nhất 1 câu giải thích cơ chế trung gian rõ ràng.',
        content: {
          topicPrompt: "Topic: Why should municipal authorities invest in expanding urban green spaces rather than commercial shopping complexes?",
          task: "Viết 1 đoạn giải thích lý do công viên cây xanh giúp cải thiện sức khỏe tinh thần của cư dân đô thị. Đảm bảo giải thích rõ cơ chế (tại sao nhìn thấy cây xanh lại giảm căng thẳng) thay vì chỉ khẳng định một cách chung chung.",
          originalSentence: "Parks improve mental health because green nature is good for people living in big cities."
        }
      },
      {
        stepNumber: 4,
        title: 'Bước 4: Kiểm chứng tiến bộ (Re-Test Verification)',
        type: 'retest',
        objective: 'Đo lường độ chặt chẽ trong liên kết nhân quả qua 2 câu hỏi đối chứng độc lập.',
        instruction: 'Chọn phương án thể hiện chuỗi lập luận học thuật chuẩn xác, không mắc lỗi khẳng định thiếu chứng minh.',
        content: {
          subskill: 'reading_cause_effect',
          questions: [
            {
              prompt: "Câu hỏi 1: Câu nào dưới đây thể hiện mối quan hệ nhân quả logic và chặt chẽ nhất trong IELTS Writing?",
              options: [
                "Students use computers so they will easily get high-paying jobs in multinational corporations.",
                "By integrating digital programming courses into school curricula, students develop computational thinking skills, which substantially improves their long-term employability in technology-driven sectors.",
                "Computers are extremely fast and modern, therefore everyone who learns computers will succeed."
              ],
              correctIndex: 1,
              explanation: "Câu B giải thích đầy đủ cơ chế trung gian: Học lập trình -> Rèn luyện tư duy máy tính -> Nâng cao khả năng tuyển dụng thực tế."
            },
            {
              prompt: "Câu hỏi 2: Nhận diện lỗi lập luận trong câu: 'Strict traffic fines should be implemented because people will become good citizens.'",
              options: [
                "Lỗi nhảy cóc lập luận (Unsubstantiated Leap): Phạt vi phạm giao thông chỉ răn đe hành vi lái xe, không thể trực tiếp kết luận biến một người thành 'công dân tốt' toàn diện.",
                "Lỗi ngữ pháp thì hiện tại.",
                "Không có lỗi lập luận nào."
              ],
              correctIndex: 0,
              explanation: "Hệ quả 'good citizens' quá rộng và không có cơ chế trung gian chứng minh mối liên hệ trực tiếp với 'traffic fines'."
            }
          ]
        }
      }
    ]
  },
  {
    id: 'pathway_complex_grammar',
    title: 'Pathway 3: Academic Complex Sentence Engineering & Boundary Control',
    targetWeakness: 'Lỗi Comma Splice (ghép câu bằng dấu phẩy) & thiếu đa dạng cấu trúc phức',
    objective: 'Làm chủ các cấu trúc phức học thuật (Phân từ rút gọn, Mệnh đề quan hệ, Đảo ngữ) và kiểm soát dấu câu chặt chẽ.',
    triggerCondition: 'Writing Grammatical Range score < 60% hoặc bài viết nhiều câu đơn/lỗi run-on',
    triggerSubskill: 'writing_complex_grammar',
    targetSubskill: 'writing_complex_grammar',
    thresholdScore: 60,
    description: 'Chuyển đổi các câu đơn giản rời rạc thành các cấu trúc phức học thuật (Mệnh đề quan hệ, Phân từ rút gọn, Câu điều kiện nâng cao, Đảo ngữ).',
    durationMinutes: 18,
    estimatedMinutes: 18,
    currentEvidenceContext: 'Ghi nhận lỗi nối câu chỉ bằng dấu phẩy (Comma Splice) và thiếu đa dạng mệnh đề phụ thuộc trong bài viết gần đây.',
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Nhận diện cấu trúc phức học thuật (Recognition)',
        type: 'recognition',
        objective: 'Nhận diện mệnh đề phụ thuộc và cấu trúc phân từ rút gọn trong câu văn học thuật mẫu.',
        instruction: 'Đọc câu văn mẫu Band 8.5 dưới đây và phân tích cấu trúc rút gọn mệnh đề trạng ngữ hoàn thành (Perfect Participle Clause).',
        content: {
          academicSentence: "Having integrated adaptive machine learning algorithms into their workflow, educational researchers were able to categorize student misconceptions with unprecedented granularity.",
          analysis: "Cấu trúc: 'Having + V3/ed (Rút gọn mệnh đề trạng ngữ hoàn thành) ..., S + V ...' thể hiện hành động nghiên cứu tích hợp thuật toán diễn ra trước và làm tiền đề cho việc phân loại lỗ hổng kiến thức của học viên.",
          options: [
            {
              text: "A. Cấu trúc câu sử dụng phân từ hoàn thành 'Having integrated...' đóng vai trò làm trạng ngữ chỉ thời gian và nguyên nhân cho mệnh đề chính.",
              isCorrect: true,
              feedback: "Chính xác: Phân từ hoàn thành rút gọn cho 'Because they had integrated...' giúp câu văn cô đọng và trang trọng."
            },
            {
              text: "B. Câu này mắc lỗi Comma Splice vì nối hai mệnh đề độc lập chỉ bằng một dấu phẩy.",
              isCorrect: false,
              feedback: "Sai: Vế đầu là cụm phân từ phụ thuộc (Participle phrase), không phải mệnh đề độc lập có chủ vị riêng, nên dùng dấu phẩy hoàn toàn đúng ngữ pháp."
            }
          ]
        }
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Tổng hợp và kết hợp câu có hướng dẫn (Guided Transformation)',
        type: 'transformation',
        objective: 'Ghép 3 câu đơn rời rạc thành 1 câu phức học thuật duy nhất sử dụng phân từ hiện tại (Present Participle) và liên từ chỉ hệ quả.',
        instruction: 'Ghép 3 câu đơn dưới đây thành 1 câu phức hoàn chỉnh, mạch lạc mà không lặp chủ từ thô cứng.',
        content: {
          simpleSentences: [
            "1. Artificial intelligence automates repetitive administrative duties.",
            "2. This liberates classroom educators from paperwork.",
            "3. Educators can dedicate more individualized attention to struggling pupils."
          ],
          transformationHint: "Sử dụng cấu trúc: 'By automating..., [S] liberates..., thereby enabling [O] to...'",
          sampleAnswers: [
            "By automating repetitive administrative duties, artificial intelligence liberates classroom educators from excessive paperwork, thereby enabling them to dedicate more individualized attention to struggling pupils.",
            "Liberating educators from burdensome administrative paperwork, artificial intelligence allows teachers to allocate more individualized support to struggling students."
          ],
          modelExplanation: "Quy tắc: Sử dụng cụm giới từ chỉ phương thức ('By automating...') + mệnh đề chính ('AI liberates...') + cụm phân từ chỉ hệ quả ('thereby enabling them to...')."
        }
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Ứng dụng viết câu ngữ pháp nâng cao (Transfer Task)',
        type: 'transfer',
        objective: 'Tự viết 1-2 câu trong đề bài mới áp dụng bắt buộc cấu trúc Đảo ngữ (Inversion) hoặc Câu phức phân từ.',
        instruction: 'Viết 1-2 câu lập luận cho đề bài mới dưới đây sử dụng cấu trúc đảo ngữ: "Not only does [S] + [V nguyên thể] ..., but it also [V] ..." hoặc mệnh đề rút gọn.',
        transferRequirement: 'Viết câu áp dụng đúng cấu trúc đảo ngữ hoặc mệnh đề phân từ.',
        content: {
          topicPrompt: "Topic: Should governments impose heavier taxes on single-use plastics to protect the marine ecosystem?",
          task: "Viết 1 câu lập luận ủng hộ việc đánh thuế đồ nhựa dùng 1 lần, sử dụng cấu trúc đảo ngữ: 'Not only does [S] [V] ..., but it also [V] ...'",
          originalSentence: "Governments should tax plastic bags because it reduces pollution and encourages people to use eco-friendly bags."
        }
      },
      {
        stepNumber: 4,
        title: 'Bước 4: Kiểm chứng tiến bộ (Re-Test Verification)',
        type: 'retest',
        objective: 'Kiểm tra khả năng phát hiện lỗi ranh giới câu (Comma Splice / Run-on) trên 2 câu hỏi đối chứng.',
        instruction: 'Chọn câu có cấu trúc ngữ pháp chuẩn xác và nhận diện lỗi ranh giới mệnh đề.',
        content: {
          subskill: 'writing_complex_grammar',
          questions: [
            {
              prompt: "Câu hỏi 1: Câu nào dưới đây mắc lỗi Comma Splice (ghép 2 mệnh đề độc lập chỉ bằng dấu phẩy)?",
              options: [
                "Renewable energy sources are becoming cheaper, fossil fuels still dominate global power generation.",
                "Although renewable energy sources are becoming cheaper, fossil fuels still dominate global power generation.",
                "Renewable energy sources are becoming cheaper; however, fossil fuels still dominate global power generation."
              ],
              correctIndex: 0,
              explanation: "Câu A có 2 mệnh đề độc lập nối với nhau chỉ bằng dấu phẩy mà không có liên từ phụ thuộc (although/while) hay liên từ kết hợp (and/but) hoặc dấu chấm phẩy (;)."
            },
            {
              prompt: "Câu hỏi 2: Chọn câu sử dụng cấu trúc phân từ rút gọn chính xác nhất về sự hòa hợp chủ ngữ:",
              options: [
                "Having analyzed the survey data, the policy recommendation was submitted by the committee.",
                "Having analyzed the survey data, the committee submitted their comprehensive policy recommendation.",
                "Having analyzed the survey data, it was easy to make recommendations."
              ],
              correctIndex: 1,
              explanation: "Chủ ngữ của hành động 'analyze the survey data' là 'the committee'. Trong câu B, chủ ngữ mệnh đề chính 'the committee' đồng nhất với hành động của phân từ (tránh lỗi Dangling Modifier)."
            }
          ]
        }
      }
    ]
  },  {
    id: 'pathway_detail_inference',
    title: 'Pathway 4: Detail Inference & True/False/Not Given',
    targetWeakness: 'Lỗi suy luận chi tiết & phân biệt True / False / Not Given',
    objective: 'Xây dựng khả năng đối chiếu statement với bằng chứng trong passage, phân biệt thông tin đúng, mâu thuẫn và không được cung cấp.',
    triggerCondition: 'Reading Detail Inference mastery thấp hoặc lặp lại lỗi False / Not Given / Unwarranted Inference',
    triggerSubskill: 'reading_detail_inference',
    targetSubskill: 'reading_detail_inference',
    thresholdScore: 65,
    description: 'Huấn luyện học viên tìm đúng evidence span, kiểm tra mức độ khẳng định và phân biệt False với Not Given thay vì suy diễn từ kiến thức bên ngoài.',
    durationMinutes: 18,
    estimatedMinutes: 18,
    currentEvidenceContext: 'Ghi nhận lỗi lặp lại trong Detail Inference hoặc True / False / Not Given gần đây.',
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Nhận diện Evidence & trạng thái thông tin (Recognition)',
        type: 'recognition',
        objective: 'Xác định chính xác evidence trong passage và phân biệt True, False và Not Given.',
        instruction: 'Đọc statement và passage, sau đó xác định evidence trực tiếp, thông tin mâu thuẫn hoặc trường hợp passage không cung cấp đủ thông tin.',
        content: {
          passageExcerpt: 'The research team reported that students who used adaptive learning tools completed practice tasks more efficiently. However, the study did not measure whether the tools improved students’ long-term examination performance.',
          question: 'Statement: Adaptive learning tools improve students’ long-term examination performance. Chọn kết luận chính xác nhất.',
          options: [
            {
              text: 'A. True — the passage confirms a long-term improvement in examination performance.',
              isCorrect: false,
              feedback: 'Sai: passage chỉ nói task efficiency và nói rõ study không đo long-term examination performance.'
            },
            {
              text: 'B. False — the passage proves that adaptive tools do not improve examination performance.',
              isCorrect: false,
              feedback: 'Sai: passage không chứng minh điều ngược lại; nó chỉ không cung cấp bằng chứng về long-term examination performance.'
            },
            {
              text: 'C. Not Given — the passage does not provide enough evidence to confirm or deny the claim.',
              isCorrect: true,
              feedback: 'Chính xác: passage không đo long-term examination performance, nên không thể kết luận True hoặc False.'
            }
          ]
        }
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Đối chiếu Evidence có hướng dẫn (Guided Transformation)',
        type: 'transformation',
        objective: 'Chuyển statement thành các mệnh đề kiểm chứng và đối chiếu từng phần với passage.',
        instruction: 'Tách statement thành Subject + Claim + Degree + Time frame, sau đó đánh dấu phần nào được passage xác nhận, phủ định hoặc bỏ ngỏ.',
        content: {
          prompt: 'Phân tích statement: "AI tutoring significantly reduces students’ dependence on teacher feedback over the long term."',
          transformationHint: 'Tách thành: AI tutoring / significantly reduces / dependence on teacher feedback / over the long term.',
          sampleAnswers: [
            'Subject: AI tutoring. Claim: reduces dependence on teacher feedback. Degree: significantly. Time frame: over the long term.',
            'Chỉ kết luận True nếu passage cung cấp evidence tương ứng cho toàn bộ claim và mức độ khẳng định.'
          ],
          modelExplanation: 'Không được lấy một phần evidence đúng để suy ra toàn bộ statement đúng. Nếu claim, degree hoặc time frame không được hỗ trợ đầy đủ thì phải xem xét False hoặc Not Given.'
        }
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Vận dụng sang ngữ cảnh mới (Transfer Task)',
        type: 'transfer',
        objective: 'Áp dụng quy trình Evidence → Claim → Verdict vào một passage mới.',
        instruction: 'Đọc passage mới và xác định True, False hoặc Not Given cho 2 statement. Với mỗi câu, chỉ ra evidence hoặc lý do thiếu evidence.',
        content: {
          topicPrompt: 'Topic: Artificial intelligence and workplace productivity',
          task: 'Xác định verdict cho từng statement và nêu ngắn gọn evidence hỗ trợ.',
          passage: 'A number of companies reported faster completion of routine administrative tasks after introducing AI assistants. The survey did not examine whether the same employees became more creative or more satisfied with their jobs.',
          statements: [
            '1. AI assistants can help employees complete some routine administrative tasks faster.',
            '2. AI assistants make employees more creative and satisfied with their jobs.'
          ],
          expectedReasoning: [
            'Statement 1: True — directly supported by faster completion of routine administrative tasks.',
            'Statement 2: Not Given — the survey did not examine creativity or job satisfaction.'
          ]
        }
      },
      {
        stepNumber: 4,
        title: 'Bước 4: Kiểm chứng tiến bộ (Re-Test Verification)',
        type: 'retest',
        objective: 'Kiểm tra khả năng phân biệt True, False và Not Given trong ngữ cảnh hoàn toàn mới.',
        instruction: 'Hoàn thành các câu hỏi đối chứng và chọn verdict chỉ dựa trên evidence trong passage.',
        content: {
          subskill: 'reading_detail_inference',
          questions: [
            {
              prompt: 'Passage: "The programme increased attendance among first-year students. Researchers did not track whether attendance improved final examination scores." Statement: The programme improved first-year students’ final examination scores.',
              options: [
                'True',
                'False',
                'Not Given'
              ],
              correctIndex: 2,
              explanation: 'Not Given: passage không đo hoặc xác nhận final examination scores.'
            },
            {
              prompt: 'Passage: "The new library remained open until 10 p.m. on weekdays, but weekend opening hours were unchanged." Statement: The library opened later on weekends after the change.',
              options: [
                'True',
                'False',
                'Not Given'
              ],
              correctIndex: 1,
              explanation: 'False: passage nói weekend opening hours were unchanged.'
            }
          ]
        }
      }
    ]
  }
];
  