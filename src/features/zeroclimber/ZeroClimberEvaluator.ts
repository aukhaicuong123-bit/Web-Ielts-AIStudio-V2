/**
 * ZeroClimber Local Deterministic Evaluator
 * Provides instant evaluation for beginner self-introduction patterns.
 */

export interface LocalEvaluationResult {
  isDeterminedLocally: boolean;
  isCorrect: boolean;
  scorePercent: number;
  feedback: string;
  correctedSentence: string;
  explanation: string;
  source: 'local_deterministic' | 'ai_evaluated';
}

export function formatBeginnerSentences(text: string): string {
  if (!text) return '';

  return text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

export function evaluateLesson1ProductionLocally(
  input: string
): LocalEvaluationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      isDeterminedLocally: true,
      isCorrect: false,
      scorePercent: 0,
      feedback: 'Bạn chưa nhập câu nào. Hãy viết 2-3 câu giới thiệu bản thân nhé!',
      correctedSentence: 'My name is Nam. I am a student. I am from Vietnam.',
      explanation: 'Hãy làm theo mẫu: Tên + Nghề nghiệp/Học sinh + Quê hương.',
      source: 'local_deterministic',
    };
  }

  const lower = trimmed.toLowerCase();

  const missingIsMatch =
    /my name\s+([a-zA-Z]+)/i.test(lower) &&
    !/my name (is|'s)\s+/i.test(lower);

  const missingArticleMatch =
    /\bi (am|'m)\s+(student|pupil|teacher|engineer|doctor|worker|developer|designer|nurse|freelancer|officer)\b/i.test(
      lower
    );

  if (missingArticleMatch) {
    return {
      isDeterminedLocally: true,
      isCorrect: false,
      scorePercent: 55,
      feedback:
        'Bạn đang thiếu mạo từ "a/an" trước danh từ nghề nghiệp hoặc vai trò.',
      correctedSentence: formatBeginnerSentences(
        trimmed.replace(
          /\bi (am|'m)\s+(student|pupil|teacher|engineer|doctor|worker|developer|designer|nurse|freelancer|officer)\b/gi,
          'I am a $2'
        )
      ),
      explanation:
        'Với danh từ đếm được số ít như student, teacher hoặc engineer, cần dùng "a/an": I am a student.',
      source: 'local_deterministic',
    };
  }

  if (missingIsMatch) {
    const nameMatch = lower.match(/my name\s+([a-zA-Z]+)/i);
    const rawName = nameMatch ? nameMatch[1] : 'Nam';
    const capName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    return {
      isDeterminedLocally: true,
      isCorrect: false,
      scorePercent: 50,
      feedback:
        'Bạn đã viết đúng ý nhưng đang thiếu động từ "is" sau "My name".',
      correctedSentence: formatBeginnerSentences(
        trimmed.replace(/my name\s+/i, 'My name is ')
      ),
      explanation:
        'Trong tiếng Anh, luôn cần động từ "is" sau "My name" (My name is ' +
        capName +
        ').',
      source: 'local_deterministic',
    };
  }

  if (/\bi\s+is\s+/i.test(lower) || /\bi\s+are\s+/i.test(lower)) {
    return {
      isDeterminedLocally: true,
      isCorrect: false,
      scorePercent: 45,
      feedback:
        'Cần sửa động từ to-be: Với chủ ngữ "I", luôn dùng "am", không dùng "is" hay "are".',
      correctedSentence: formatBeginnerSentences(
        trimmed
          .replace(/\bi\s+is\b/gi, 'I am')
          .replace(/\bi\s+are\b/gi, 'I am')
      ),
      explanation: 'Quy tắc cốt lõi: I đi với "am" (I am / I\'m).',
      source: 'local_deterministic',
    };
  }

  if (
    /\bi\s+from\s+/i.test(lower) &&
    !/\bi\s+(am|'m)\s+from/i.test(lower)
  ) {
    return {
      isDeterminedLocally: true,
      isCorrect: false,
      scorePercent: 55,
      feedback:
        'Thiếu động từ "am" trước "from". Câu chuẩn phải là "I am from...".',
      correctedSentence: formatBeginnerSentences(
        trimmed.replace(/\bi\s+from\b/gi, 'I am from')
      ),
      explanation:
        'Từ "from" là giới từ, không phải động từ, nên cần có "am" (I am from Vietnam).',
      source: 'local_deterministic',
    };
  }

  const hasName =
    /(?:^|[.!?]\s*)my name (?:is|'s)\s+[a-zA-Z]+/i.test(lower);

  const hasRoleOrAge =
    /\bi (am|'m)\s+(a|an)\s+(student|pupil|teacher|engineer|doctor|worker|developer|designer|nurse|freelancer|officer)/i.test(
      lower
    ) ||
    /\bi (am|'m)\s+\d+\s*(years\s*old)?/i.test(lower) ||
    /\bi work as/i.test(lower) ||
    /\bi study at/i.test(lower);

  const hasOriginOrLocation =
    /\bi (am|'m)\s+from\s+[a-zA-Z\s,]+/i.test(lower) ||
    /\bi (come from|live in|am living in)\s+[a-zA-Z\s,]+/i.test(lower);

  const validComponentCount =
    (hasName ? 1 : 0) +
    (hasRoleOrAge ? 1 : 0) +
    (hasOriginOrLocation ? 1 : 0);

  if (validComponentCount === 3) {
    let cleanText = formatBeginnerSentences(trimmed);

    if (
      !cleanText.endsWith('.') &&
      !cleanText.endsWith('!') &&
      !cleanText.endsWith('?')
    ) {
      cleanText += '.';
    }

    return {
      isDeterminedLocally: true,
      isCorrect: true,
      scorePercent: 95,
      feedback:
        'Xuất sắc! Bạn đã viết được các câu giới thiệu bản thân rất chuẩn ngữ pháp, dùng đúng động từ to-be và cấu trúc cơ bản.',
      correctedSentence: cleanText,
      explanation:
        'Cấu trúc câu hoàn hảo: Danh từ/Đại từ + Động từ to-be (is/am) + Thông tin rõ ràng.',
      source: 'local_deterministic',
    };
  }

  if (validComponentCount === 1 && hasName) {
    let cleanText = formatBeginnerSentences(trimmed);

    if (!cleanText.endsWith('.')) {
      cleanText += '.';
    }

    return {
      isDeterminedLocally: true,
      isCorrect: true,
      scorePercent: 80,
      feedback:
        'Rất tốt! Câu giới thiệu tên của bạn hoàn toàn chính xác. Bạn có thể thêm nghề nghiệp hoặc quê hương để trọn vẹn hơn nhé.',
      correctedSentence:
        cleanText + (hasOriginOrLocation ? '' : ' I am from Vietnam.'),
      explanation: 'Câu đúng ngữ pháp: My name is [Tên].',
      source: 'local_deterministic',
    };
  }

  return {
    isDeterminedLocally: false,
    isCorrect: false,
    scorePercent: 0,
    feedback: '',
    correctedSentence: '',
    explanation: '',
    source: 'ai_evaluated',
  };
}
