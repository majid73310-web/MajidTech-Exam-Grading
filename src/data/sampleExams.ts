export type IdMode = 'SECRET_NUMBER' | 'STUDENT_NAME' | 'BOTH';

export interface SampleQuestion {
  question_number: number;
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_IN_BLANK';
  question_text: string;
  correct_answer: string;
  points: number;
}

export interface SampleExamTemplate {
  id: number;
  exam_title: string;
  subject: string;
  language: 'en' | 'ar';
  id_mode: IdMode;
  total_questions: number;
  total_max_score: number;
  created_at: string;
  questions: SampleQuestion[];
}

export interface SampleStudentPaper {
  id: string;
  label: string;
  language: 'en' | 'ar';
  secret_number_preview?: string;
  student_name_preview?: string;
  simulated_ocr_confidence: number;
  notes: string;
  student_answers: Record<number, string>;
  simulated_evaluations: Array<{
    question_number: number;
    student_answer: string;
    correct_answer: string;
    is_correct: boolean;
    points_awarded: number;
    feedback_note: string;
  }>;
}

export const BIOLOGY_MIDTERM_TEMPLATE: SampleExamTemplate = {
  id: 1,
  exam_title: "Biology 101 Midterm Examination",
  subject: "Cellular Biology & Genetics",
  language: 'en',
  id_mode: 'BOTH',
  total_questions: 6,
  total_max_score: 13.0,
  created_at: "2026-10-04T10:00:00Z",
  questions: [
    {
      question_number: 1,
      type: "MCQ",
      question_text: "Which organelle is considered the powerhouse of eukaryotic cells?",
      correct_answer: "B",
      points: 2.0
    },
    {
      question_number: 2,
      type: "MCQ",
      question_text: "Which nucleic acid carries primary genetic instructions in all cellular organisms?",
      correct_answer: "C",
      points: 2.0
    },
    {
      question_number: 3,
      type: "TRUE_FALSE",
      question_text: "Plant cells possess rigid cellulose cell walls, while animal cells lack them.",
      correct_answer: "True",
      points: 1.5
    },
    {
      question_number: 4,
      type: "TRUE_FALSE",
      question_text: "Aerobic cellular respiration only occurs in the direct presence of sunlight.",
      correct_answer: "False",
      points: 1.5
    },
    {
      question_number: 5,
      type: "FILL_IN_BLANK",
      question_text: "The green photosynthetic pigment that absorbs photons in thylakoid membranes is ________.",
      correct_answer: "Chlorophyll",
      points: 3.0
    },
    {
      question_number: 6,
      type: "FILL_IN_BLANK",
      question_text: "The fundamental hereditary unit of DNA sequence encoding a functional product is a ________.",
      correct_answer: "Gene",
      points: 3.0
    }
  ]
};

export const ARABIC_BIOLOGY_TEMPLATE: SampleExamTemplate = {
  id: 2,
  exam_title: "اختبار الأحياء النصفي - الخلية والوراثة",
  subject: "علم الأحياء الخلوية والجينات",
  language: 'ar',
  id_mode: 'BOTH',
  total_questions: 6,
  total_max_score: 13.0,
  created_at: "2026-10-05T08:00:00Z",
  questions: [
    {
      question_number: 1,
      type: "MCQ",
      question_text: "ما هو العضي الخلوي المعروف بمحطة توليد الطاقة في الخلية؟ (أ) النواة (ب) الميتوكوندريا (ج) الريبوسوم",
      correct_answer: "ب",
      points: 2.0
    },
    {
      question_number: 2,
      type: "MCQ",
      question_text: "ما هو الحمض النووي الحامل للمعلومات الوراثية في الكائنات الحية؟ (أ) دهون (ب) بروتين (ج) DNA",
      correct_answer: "ج",
      points: 2.0
    },
    {
      question_number: 3,
      type: "TRUE_FALSE",
      question_text: "تمتلك الخلايا النباتية جداراً خلوياً صلباً بينما تفتقر إليه الخلايا الحيوانية.",
      correct_answer: "صح",
      points: 1.5
    },
    {
      question_number: 4,
      type: "TRUE_FALSE",
      question_text: "يحدث التنفس الخلوي فقط في وجود ضوء الشمس المباشر.",
      correct_answer: "خطأ",
      points: 1.5
    },
    {
      question_number: 5,
      type: "FILL_IN_BLANK",
      question_text: "الصبغة الخضراء المسؤولة عن امتصاص الضوء أثناء عملية البناء الضوئي هي ________.",
      correct_answer: "كلوروفيل",
      points: 3.0
    },
    {
      question_number: 6,
      type: "FILL_IN_BLANK",
      question_text: "الوحدة الأساسية للوراثة المكونة من تسلسل الحمض النووي هي الـ ________.",
      correct_answer: "جين",
      points: 3.0
    }
  ]
};

export const SAMPLE_STUDENT_PAPERS: SampleStudentPaper[] = [
  // English Papers
  {
    id: "paper-en-1",
    label: "Paper #1 (EN) - High Scorer (Typo Tolerance)",
    language: 'en',
    secret_number_preview: "SEC-8492",
    student_name_preview: "Alexander Wright",
    simulated_ocr_confidence: 0.98,
    notes: "Perfect MCQ/TF + minor phonetic spelling 'clorophyl' recognized semantically with full points.",
    student_answers: {
      1: "B",
      2: "C",
      3: "True",
      4: "False",
      5: "clorophyl",
      6: "Gene"
    },
    simulated_evaluations: [
      {
        question_number: 1,
        student_answer: "B",
        correct_answer: "B",
        is_correct: true,
        points_awarded: 2.0,
        feedback_note: "Exact MCQ match (Option B)"
      },
      {
        question_number: 2,
        student_answer: "C",
        correct_answer: "C",
        is_correct: true,
        points_awarded: 2.0,
        feedback_note: "Exact MCQ match (Option C)"
      },
      {
        question_number: 3,
        student_answer: "True",
        correct_answer: "True",
        is_correct: true,
        points_awarded: 1.5,
        feedback_note: "True/False correct"
      },
      {
        question_number: 4,
        student_answer: "False",
        correct_answer: "False",
        is_correct: true,
        points_awarded: 1.5,
        feedback_note: "True/False correct"
      },
      {
        question_number: 5,
        student_answer: "clorophyl",
        correct_answer: "Chlorophyll",
        is_correct: true,
        points_awarded: 3.0,
        feedback_note: "Semantic match: accepted phonetic misspelling 'clorophyl'"
      },
      {
        question_number: 6,
        student_answer: "Gene",
        correct_answer: "Gene",
        is_correct: true,
        points_awarded: 3.0,
        feedback_note: "Handwritten match exact"
      }
    ]
  },
  {
    id: "paper-en-2",
    label: "Paper #2 (EN) - Ambiguous ID (Needs Verification)",
    language: 'en',
    secret_number_preview: "SEC-3104",
    student_name_preview: "Marcus Vance",
    simulated_ocr_confidence: 0.79,
    notes: "Rushed handwriting on secret ID: OCR flags 79% confidence, inviting teacher verification.",
    student_answers: {
      1: "B",
      2: "A",
      3: "T",
      4: "T",
      5: "Chlorophyll",
      6: "Chromosome"
    },
    simulated_evaluations: [
      {
        question_number: 1,
        student_answer: "B",
        correct_answer: "B",
        is_correct: true,
        points_awarded: 2.0,
        feedback_note: "Correct choice B"
      },
      {
        question_number: 2,
        student_answer: "A",
        correct_answer: "C",
        is_correct: false,
        points_awarded: 0.0,
        feedback_note: "Incorrect choice (marked A instead of C)"
      },
      {
        question_number: 3,
        student_answer: "T",
        correct_answer: "True",
        is_correct: true,
        points_awarded: 1.5,
        feedback_note: "Accepted 'T' shorthand for True"
      },
      {
        question_number: 4,
        student_answer: "T",
        correct_answer: "False",
        is_correct: false,
        points_awarded: 0.0,
        feedback_note: "Incorrect: marked 'T' but statement is False"
      },
      {
        question_number: 5,
        student_answer: "Chlorophyll",
        correct_answer: "Chlorophyll",
        is_correct: true,
        points_awarded: 3.0,
        feedback_note: "Exact spelling match"
      },
      {
        question_number: 6,
        student_answer: "Chromosome",
        correct_answer: "Gene",
        is_correct: false,
        points_awarded: 0.0,
        feedback_note: "Incorrect biological concept"
      }
    ]
  },

  // Arabic Papers
  {
    id: "paper-ar-1",
    label: "ورقة #١ (عربي) - طارق المنصوري (أرقام مشرقية ٨٤٩٢)",
    language: 'ar',
    secret_number_preview: "٨٤٩٢",
    student_name_preview: "طارق بن زياد المنصوري",
    simulated_ocr_confidence: 0.97,
    notes: "اسم الطالب وأرقام مشرقية، إجابات عربية (ب، ج، صح، خطأ، كلوروفيل).",
    student_answers: {
      1: "ب",
      2: "ج",
      3: "صح",
      4: "خطأ",
      5: "كلوروفيل",
      6: "جين"
    },
    simulated_evaluations: [
      {
        question_number: 1,
        student_answer: "ب",
        correct_answer: "ب",
        is_correct: true,
        points_awarded: 2.0,
        feedback_note: "إجابة صحيحة (الميتوكوندريا)"
      },
      {
        question_number: 2,
        student_answer: "ج",
        correct_answer: "ج",
        is_correct: true,
        points_awarded: 2.0,
        feedback_note: "إجابة صحيحة (DNA)"
      },
      {
        question_number: 3,
        student_answer: "صح",
        correct_answer: "صح",
        is_correct: true,
        points_awarded: 1.5,
        feedback_note: "إجابة صائبة"
      },
      {
        question_number: 4,
        student_answer: "خطأ",
        correct_answer: "خطأ",
        is_correct: true,
        points_awarded: 1.5,
        feedback_note: "إجابة صائبة"
      },
      {
        question_number: 5,
        student_answer: "كلوروفيل",
        correct_answer: "كلوروفيل",
        is_correct: true,
        points_awarded: 3.0,
        feedback_note: "تطابق تام للمصطلح العلمي بخط اليد"
      },
      {
        question_number: 6,
        student_answer: "جين",
        correct_answer: "جين",
        is_correct: true,
        points_awarded: 3.0,
        feedback_note: "إجابة صحيحة ومكتملة"
      }
    ]
  },
  {
    id: "paper-ar-2",
    label: "ورقة #٢ (عربي) - فاطمة الزهراء (تسامح إملائي: كلورفيل)",
    language: 'ar',
    secret_number_preview: "٥١٢٠",
    student_name_preview: "فاطمة أحمد الزهراء",
    simulated_ocr_confidence: 0.92,
    notes: "تسامح إملائي باللغة العربية (كلورفيل بدون واو ثانية) مع منح الدرجة كاملة.",
    student_answers: {
      1: "ب",
      2: "ج",
      3: "صح",
      4: "صح",
      5: "كلورفيل",
      6: "الجين الوراثي"
    },
    simulated_evaluations: [
      {
        question_number: 1,
        student_answer: "ب",
        correct_answer: "ب",
        is_correct: true,
        points_awarded: 2.0,
        feedback_note: "إجابة صحيحة (الخيار ب)"
      },
      {
        question_number: 2,
        student_answer: "ج",
        correct_answer: "ج",
        is_correct: true,
        points_awarded: 2.0,
        feedback_note: "إجابة صحيحة (الخيار ج)"
      },
      {
        question_number: 3,
        student_answer: "صح",
        correct_answer: "صح",
        is_correct: true,
        points_awarded: 1.5,
        feedback_note: "إجابة صائبة"
      },
      {
        question_number: 4,
        student_answer: "صح",
        correct_answer: "خطأ",
        is_correct: false,
        points_awarded: 0.0,
        feedback_note: "إجابة خاطئة: حددت الطالبة 'صح' والمطلوب 'خطأ'"
      },
      {
        question_number: 5,
        student_answer: "كلورفيل",
        correct_answer: "كلوروفيل",
        is_correct: true,
        points_awarded: 3.0,
        feedback_note: "تم قبول الرسم الإملائي البديل 'كلورفيل' ومنح الدرجة كاملة"
      },
      {
        question_number: 6,
        student_answer: "الجين الوراثي",
        correct_answer: "جين",
        is_correct: true,
        points_awarded: 3.0,
        feedback_note: "تم التعرف على المفهوم المستهدف بنجاح"
      }
    ]
  }
];
