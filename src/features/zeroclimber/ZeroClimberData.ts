import { ZeroClimberCamp, ZeroClimberLesson } from '../../types';

export const ZEROCLIMBER_CAMPS: ZeroClimberCamp[] = [
  {
    id: 'camp_base',
    name: 'Base Camp: Nền tảng cốt lõi (Foundations)',
    order: 1,
    targetBandRange: 'Band 0 ➔ 4.0',
    description: 'Xây dựng phản xạ nhận diện câu đơn cơ bản, đại từ, động từ to-be và từ vựng sinh hoạt hàng ngày.',
    totalLessons: 5,
    completedLessons: 0,
    isUnlocked: true,
  },
  {
    id: 'camp_1',
    name: 'Camp 1: Định vị & Paraphrase sơ cấp',
    order: 2,
    targetBandRange: 'Band 4.0 ➔ 5.0',
    description: 'Rèn luyện kỹ năng định vị từ khóa đơn giản, thì quá khứ đơn và mở rộng vốn từ mô tả.',
    totalLessons: 6,
    completedLessons: 0,
    isUnlocked: false,
  },
  {
    id: 'camp_2',
    name: 'Camp 2: Mạch lạc & Liên kết nhân quả',
    order: 3,
    targetBandRange: 'Band 5.0 ➔ 6.0',
    description: 'Ghép câu phức cơ bản, dùng liên từ (because, although, so) và diễn đạt ý kiến cá nhân.',
    totalLessons: 6,
    completedLessons: 0,
    isUnlocked: false,
  },
  {
    id: 'camp_3',
    name: 'Camp 3: Cấu trúc câu học thuật phức hợp',
    order: 4,
    targetBandRange: 'Band 6.0 ➔ 6.5',
    description: 'Luyện tập mệnh đề quan hệ, câu bị động và kỹ thuật paraphrase học thuật không làm lệch nghĩa.',
    totalLessons: 6,
    completedLessons: 0,
    isUnlocked: false,
  },
  {
    id: 'summit',
    name: 'Summit: Đỉnh núi phản xạ IELTS thực chiến',
    order: 5,
    targetBandRange: 'Band 6.5 ➔ 7.0+',
    description: 'Kiểm chứng phản xạ tổng hợp, viết đoạn văn Task 2 chặt chẽ và xử lý bẫy bài đọc chuyên sâu.',
    totalLessons: 4,
    completedLessons: 0,
    isUnlocked: false,
  }
];

export interface Lesson1ExerciseMCQ {
  id: string;
  type: 'mcq';
  question: string;
  vietnamesePrompt: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface Lesson1ExerciseFill {
  id: string;
  type: 'fill';
  sentence: string; // e.g. "My name ___ Linh."
  missingWord: string; // "is"
  options: string[]; // ['is', 'am', 'are']
  vietnameseMeaning: string;
  explanation: string;
}

export interface Lesson1ExerciseReorder {
  id: string;
  type: 'reorder';
  words: string[];
  correctSentence: string;
  vietnameseMeaning: string;
  explanation: string;
}

export interface Lesson1ExerciseProduction {
  id: string;
  type: 'production';
  prompt: string;
  vietnamesePrompt: string;
  exampleAnswers: string[];
  tips: string[];
}

export const ZEROCLIMBER_LESSON_1: ZeroClimberLesson = {
  id: 'zc_lesson_1',
  campId: 'camp_base',
  lessonNumber: 1,
  title: 'Introduce Yourself',
  focusSubskill: 'writing_complex_grammar',
  targetWeakness: 'Thiếu động từ to-be khi giới thiệu bản thân ("I student", "My name Linh")',
  estimatedMinutes: 15,
  isCompleted: false,
};

export const LESSON_1_CONTENT = {
  title: 'Lesson 1: Introduce Yourself (Giới thiệu bản thân)',
  campName: 'Base Camp: Nền tảng cốt lõi',
  outcome: 'Sau bài học này, bạn sẽ tự tin nói và viết các câu giới thiệu bản thân chuẩn ngữ pháp tiếng Anh.',
  
  corePatterns: [
    {
      id: 'pat_1',
      pattern: 'My name is [Tên của bạn].',
      vietnamese: 'Tên tôi là [Tên].',
      examples: ['My name is Nam.', 'My name is Linh.'],
      note: 'Lưu ý: Luôn có "is" sau "My name". Không nói "My name Nam".'
    },
    {
      id: 'pat_2',
      pattern: 'I am a / an [Nghề nghiệp / Vai trò].',
      vietnamese: 'Tôi là một [học sinh / sinh viên / kỹ sư...].',
      examples: ['I am a student.', 'I am a teacher.'],
      note: 'Lưu ý: Dùng "I am a student" (có "am a"), không nói "I student".'
    },
    {
      id: 'pat_3',
      pattern: 'I am from [Quê hương / Quốc gia].',
      vietnamese: 'Tôi đến từ [Việt Nam / Hà Nội...].',
      examples: ['I am from Vietnam.', 'I am from Da Nang.'],
      note: 'Lưu ý: "from" nghĩa là "đến từ". Luôn có "am" đi cùng "I".'
    }
  ],

  mcqExercises: [
    {
      id: 'mcq_1',
      type: 'mcq',
      question: 'Chọn câu giới thiệu tên đúng chuẩn ngữ pháp:',
      vietnamesePrompt: 'Bạn muốn nói: "Tên tôi là Minh."',
      options: [
        {
          id: 'opt_1a',
          text: 'My name is Minh.',
          isCorrect: true,
          explanation: 'Chính xác! Cấu trúc đúng luôn cần động từ "is" (My name is Minh).'
        },
        {
          id: 'opt_1b',
          text: 'My name Minh.',
          isCorrect: false,
          explanation: 'Chưa đúng: Câu bị thiếu động từ "is".'
        },
        {
          id: 'opt_1c',
          text: 'I name is Minh.',
          isCorrect: false,
          explanation: 'Chưa đúng: Phải dùng tính từ sở hữu "My name" chứ không dùng "I name".'
        }
      ]
    },
    {
      id: 'mcq_2',
      type: 'mcq',
      question: 'Chọn câu giới thiệu nghề nghiệp đúng:',
      vietnamesePrompt: 'Bạn muốn nói: "Tôi là một học sinh."',
      options: [
        {
          id: 'opt_2a',
          text: 'I student.',
          isCorrect: false,
          explanation: 'Chưa đúng: Tiếng Anh bắt buộc phải có động từ to-be "am" và mạo từ "a".'
        },
        {
          id: 'opt_2b',
          text: 'I am a student.',
          isCorrect: true,
          explanation: 'Tuyệt vời! "I am a student" là cấu trúc chuẩn xác 100%.'
        },
        {
          id: 'opt_2c',
          text: 'I is a student.',
          isCorrect: false,
          explanation: 'Chưa đúng: Chủ ngữ "I" chỉ đi với "am", không đi với "is".'
        }
      ]
    },
    {
      id: 'mcq_3',
      type: 'mcq',
      question: 'Chọn câu giới thiệu quê quán đúng:',
      vietnamesePrompt: 'Bạn muốn nói: "Tôi đến từ Việt Nam."',
      options: [
        {
          id: 'opt_3a',
          text: 'I from Vietnam.',
          isCorrect: false,
          explanation: 'Chưa đúng: Thiếu "am". Tiếng Anh không nói cụt "I from Vietnam".'
        },
        {
          id: 'opt_3b',
          text: 'I am from Vietnam.',
          isCorrect: true,
          explanation: 'Chính xác! "I am from Vietnam" có đủ chủ ngữ, động từ to-be và giới từ.'
        },
        {
          id: 'opt_3c',
          text: 'I am come from Vietnam.',
          isCorrect: false,
          explanation: 'Chưa đúng: Không ghép cả "am" và "come". Dùng "I am from Vietnam" hoặc "I come from Vietnam".'
        }
      ]
    }
  ] as Lesson1ExerciseMCQ[],

  fillExercises: [
    {
      id: 'fill_1',
      type: 'fill',
      sentence: 'My name ___ Ha.',
      missingWord: 'is',
      options: ['is', 'am', 'are'],
      vietnameseMeaning: 'Tên tôi là Hà.',
      explanation: '"My name" là ngôi thứ 3 số ít nên đi cùng "is".'
    },
    {
      id: 'fill_2',
      type: 'fill',
      sentence: 'I ___ a student.',
      missingWord: 'am',
      options: ['is', 'am', 'are'],
      vietnameseMeaning: 'Tôi là một học sinh.',
      explanation: 'Chủ ngữ "I" luôn đi với "am".'
    },
    {
      id: 'fill_3',
      type: 'fill',
      sentence: 'I am ___ Vietnam.',
      missingWord: 'from',
      options: ['from', 'in', 'at'],
      vietnameseMeaning: 'Tôi đến từ Việt Nam.',
      explanation: 'Cụm từ "am from" có nghĩa là "đến từ nơi nào đó".'
    }
  ] as Lesson1ExerciseFill[],

  reorderExercises: [
    {
      id: 'reorder_1',
      type: 'reorder',
      words: ['name', 'is', 'My', 'An.'],
      correctSentence: 'My name is An.',
      vietnameseMeaning: 'Tên tôi là An.',
      explanation: 'Trật tự câu: Tính từ sở hữu (My) + Danh từ (name) + Động từ (is) + Tên riêng (An).'
    },
    {
      id: 'reorder_2',
      type: 'reorder',
      words: ['a', 'am', 'I', 'student.'],
      correctSentence: 'I am a student.',
      vietnameseMeaning: 'Tôi là một học sinh.',
      explanation: 'Trật tự câu: Chủ ngữ (I) + Động từ (am) + Mạo từ (a) + Danh từ (student).'
    },
    {
      id: 'reorder_3',
      type: 'reorder',
      words: ['from', 'Vietnam.', 'am', 'I'],
      correctSentence: 'I am from Vietnam.',
      vietnameseMeaning: 'Tôi đến từ Việt Nam.',
      explanation: 'Trật tự câu: Chủ ngữ (I) + Động từ (am) + Giới từ (from) + Địa danh (Vietnam).'
    }
  ] as Lesson1ExerciseReorder[],

  productionExercise: {
    id: 'prod_1',
    type: 'production',
    prompt: 'Hãy viết 2 đến 3 câu tiếng Anh đơn giản để giới thiệu về bản thân bạn (Tên, Bạn là học sinh/nghề nghiệp, và bạn đến từ đâu).',
    vietnamesePrompt: 'Ví dụ: "My name is Linh. I am a student. I am from Vietnam."',
    exampleAnswers: [
      'My name is Linh. I am a student. I am from Vietnam.',
      'My name is Nam. I am a teacher. I am from Hanoi.',
      'My name is Mai. I am an engineer. I am from Danang.'
    ],
    tips: [
      'Đừng quên viết hoa chữ cái đầu câu và có dấu chấm (.) ở cuối câu.',
      'Luôn nhớ dùng "My name is...", "I am a...", "I am from...".',
      'Nếu bạn làm nghề nghiệp bắt đầu bằng nguyên âm (u, e, o, a, i) như engineer, hãy dùng "an engineer".'
    ]
  } as Lesson1ExerciseProduction
};
