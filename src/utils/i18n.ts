export type AppLocale = 'en' | 'ar';

export interface Translations {
  appName: string;
  appSubtitle: string;
  scannerTitle: string;
  reviewTitle: string;
  gradebookTitle: string;
  analyticsTitle: string;
  architectureTitle: string;
  flutterCodebase: string;
  exportProjectZip: string;
  downloadCsv: string;
  downloadXlsx: string;
  activeAnswerKey: string;
  inspectKey: string;
  questions: string;
  maxPoints: string;
  graded: string;
  launchScanner: string;
  alignPaperPrompt: string;
  targetSecret: string;
  targetName: string;
  targetBoth: string;
  batchGraded: string;
  testPaper: string;
  useSample: string;
  useWebcam: string;
  aiGrading: string;
  studentSecretNumber: string;
  studentName: string;
  ocrConfidence: string;
  editPrompt: string;
  totalScoreEarned: string;
  grade: string;
  questionBreakdown: string;
  tapToOverride: string;
  saveAndNext: string;
  discard: string;
  classAverage: string;
  passRate: string;
  topScore: string;
  medianScore: string;
  interventionAlerts: string;
  interventionNeeded: string;
  remediationPlan: string;
  addNote: string;
  idMode: string;
  modeSecretOnly: string;
  modeNameOnly: string;
  modeBoth: string;
  languageToggle: string;
  direction: 'ltr' | 'rtl';
}

export const TRANSLATIONS: Record<AppLocale, Translations> = {
  en: {
    appName: "MajidTech Exam Grading",
    appSubtitle: "Bilingual Mobile AI Architecture • SQLite • Arabic/English Vision Scanner",
    scannerTitle: "Batch Camera Scanner",
    reviewTitle: "Review & Verify Paper",
    gradebookTitle: "Class Gradebook",
    analyticsTitle: "Analytics & Intervention",
    architectureTitle: "Architecture & DB Blueprint",
    flutterCodebase: "Flutter Codebase",
    exportProjectZip: "Export Flutter Project (.zip)",
    downloadCsv: "Download CSV",
    downloadXlsx: "Export XLSX",
    activeAnswerKey: "Active Answer Key",
    inspectKey: "Inspect Key",
    questions: "Questions",
    maxPoints: "Max Points",
    graded: "Graded",
    launchScanner: "Launch Batch Camera Scanner",
    alignPaperPrompt: "Align Paper Inside Frame • Keep Flat",
    targetSecret: "Target: Student Secret Number (0-9 / ٠-٩)",
    targetName: "Target: Handwritten Student Name",
    targetBoth: "Target: Secret ID & Student Name",
    batchGraded: "Batch Graded",
    testPaper: "Test Paper",
    useSample: "Use Sample Paper",
    useWebcam: "Use Webcam",
    aiGrading: "Gemini 1.5 Flash Vision Grading...",
    studentSecretNumber: "Student Secret Number",
    studentName: "Student Full Name",
    ocrConfidence: "OCR Confidence",
    editPrompt: "Tap to edit if handwriting was ambiguous",
    totalScoreEarned: "Total Score Earned",
    grade: "Grade",
    questionBreakdown: "Question Breakdown",
    tapToOverride: "Tap icon to override mark",
    saveAndNext: "Save & Next Student",
    discard: "Discard",
    classAverage: "Class Average",
    passRate: "Pass Rate (≥ 60%)",
    topScore: "Top Score",
    medianScore: "Median Score",
    interventionAlerts: "Intervention Alerts",
    interventionNeeded: "Needs Remediation",
    remediationPlan: "Teacher Action Plan",
    addNote: "Add Action Note",
    idMode: "Student Identification Mode",
    modeSecretOnly: "Secret Number Only",
    modeNameOnly: "Student Name Only",
    modeBoth: "Both (Secret ID & Name)",
    languageToggle: "العربية (RTL)",
    direction: 'ltr',
  },
  ar: {
    appName: "ماجد تك لتصحيح الاختبارات",
    appSubtitle: "معمارية فلاتر ثنائية اللغة • تخزين محلي SQLite • مصحح الامتحانات الذكي",
    scannerTitle: "الماسح الضوئي الذكي",
    reviewTitle: "مراجعة وتأكيد تصحيح الورقة",
    gradebookTitle: "سجل الدرجات الصفي",
    analyticsTitle: "التحليلات والتدخل التعليمي",
    architectureTitle: "المعمارية وقواعد البيانات",
    flutterCodebase: "شفرة فلاتر ودارت",
    exportProjectZip: "تصدير مشروع فلاتر (.zip)",
    downloadCsv: "تنزيل ملف CSV",
    downloadXlsx: "تصدير Excel XLSX",
    activeAnswerKey: "نموذج الإجابة النشط",
    inspectKey: "معاينة النموذج",
    questions: "الأسئلة",
    maxPoints: "الدرجة الكلية",
    graded: "تم تصحيحه",
    launchScanner: "بدء المسح والتصحيح بالكاميرا",
    alignPaperPrompt: "حاذِ ورقة الاختبار داخل الإطار • حافظ على الإضاءة",
    targetSecret: "الهدف: رقم الجلوس السري (٠-٩ / 0-9)",
    targetName: "الهدف: اسم الطالب بخط اليد",
    targetBoth: "الهدف: رقم الجلوس السري واسم الطالب",
    batchGraded: "الأوراق المصححة",
    testPaper: "ورقة تجريبية",
    useSample: "ورقة اختبار نموذجية",
    useWebcam: "كاميرا الجهاز",
    aiGrading: "جاري التصحيح بواسطة جيميناي ١.٥ فلاش...",
    studentSecretNumber: "رقم الجلوس السري",
    studentName: "اسم الطالب الكامل",
    ocrConfidence: "دقة التعرف على الخط",
    editPrompt: "اضغط للتعديل اليدوي في حال عدم وضوح الخط",
    totalScoreEarned: "الدرجة الكلية المكتسبة",
    grade: "التقدير",
    questionBreakdown: "تفصيل إجابات الأسئلة",
    tapToOverride: "انقر على الأيقونة لتعديل التقييم يدوياً",
    saveAndNext: "حفظ والانتقال للطالب التالي",
    discard: "تجاهل الورقة",
    classAverage: "متوسط درجات الفصل",
    passRate: "نسبة النجاح (≥ ٦٠٪)",
    topScore: "أعلى درجة",
    medianScore: "الوسيط الحسابي",
    interventionAlerts: "تنبيهات التدخل والدعم",
    interventionNeeded: "بحاجة لتدخل تعليمي عاجل",
    remediationPlan: "خطة المعلم العلاجية",
    addNote: "إضافة ملاحظة علاجية",
    idMode: "نمط تحديد هوية الطالب",
    modeSecretOnly: "رقم الجلوس فقط",
    modeNameOnly: "اسم الطالب فقط",
    modeBoth: "كلاهما (الرقم والاسم)",
    languageToggle: "English (LTR)",
    direction: 'rtl',
  }
};
