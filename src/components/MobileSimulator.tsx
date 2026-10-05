import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Flashlight,
  CheckCircle2,
  XCircle,
  Edit3,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Table,
  FileSpreadsheet,
  FileText,
  Sparkles,
  AlertTriangle,
  Layers,
  HelpCircle,
  RefreshCw,
  Plus,
  BarChart2,
  Globe,
  User,
  Fingerprint
} from 'lucide-react';
import {
  BIOLOGY_MIDTERM_TEMPLATE,
  ARABIC_BIOLOGY_TEMPLATE,
  SAMPLE_STUDENT_PAPERS,
  SampleStudentPaper,
  IdMode,
} from '../data/sampleExams';
import { GradedSubmission, exportSubmissionsToCsv } from '../utils/gradeExporter';
import { AppLocale, TRANSLATIONS } from '../utils/i18n';

interface MobileSimulatorProps {
  onBatchCountChange?: (count: number) => void;
  submissions?: GradedSubmission[];
  onSubmissionsChange?: (submissions: GradedSubmission[]) => void;
  onOpenDashboard?: () => void;
  locale?: AppLocale;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  onBatchCountChange,
  submissions: parentSubmissions,
  onSubmissionsChange,
  onOpenDashboard,
  locale = 'en',
}) => {
  const isArabic = locale === 'ar';
  const t = TRANSLATIONS[locale];

  // Navigation inside the simulator
  const [currentScreen, setCurrentScreen] = useState<'home' | 'scanner' | 'review' | 'gradebook' | 'master_key'>('home');
  const [activeTemplate, setActiveTemplate] = useState(isArabic ? ARABIC_BIOLOGY_TEMPLATE : BIOLOGY_MIDTERM_TEMPLATE);
  const [idMode, setIdMode] = useState<IdMode>('BOTH');

  // Sync active template when locale changes
  useEffect(() => {
    if (isArabic) {
      setActiveTemplate(ARABIC_BIOLOGY_TEMPLATE);
    } else {
      setActiveTemplate(BIOLOGY_MIDTERM_TEMPLATE);
    }
  }, [isArabic]);

  // Scanner state
  const [selectedPaperIndex, setSelectedPaperIndex] = useState<number>(isArabic ? 2 : 0);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [useWebcam, setUseWebcam] = useState<boolean>(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Review screen state
  const [reviewSecretNumber, setReviewSecretNumber] = useState<string>('');
  const [reviewStudentName, setReviewStudentName] = useState<string>('');
  const [reviewConfidence, setReviewConfidence] = useState<number>(0.95);
  const [reviewEvaluations, setReviewEvaluations] = useState<SampleStudentPaper['simulated_evaluations']>([]);
  const [currentPaperLabel, setCurrentPaperLabel] = useState<string>('');

  // Submissions Gradebook state
  const [internalSubmissions, setInternalSubmissions] = useState<GradedSubmission[]>([
    {
      id: 'sub-init-1',
      secretNumber: isArabic ? '٨٤٩٢' : 'SEC-4412',
      studentName: isArabic ? 'طارق المنصوري' : 'Alexander Wright',
      totalScoreEarned: 13.0,
      totalMaxScore: 13.0,
      ocrConfidence: 0.99,
      scannedAt: '09:15 AM',
      evaluations: BIOLOGY_MIDTERM_TEMPLATE.questions.map(q => ({
        question_number: q.question_number,
        student_answer: isArabic ? 'ب' : q.correct_answer,
        correct_answer: isArabic ? 'ب' : q.correct_answer,
        is_correct: true,
        points_awarded: q.points,
        feedback_note: isArabic ? 'إجابة معتمدة' : 'Initial verified master record',
      })),
    },
    {
      id: 'sub-init-2',
      secretNumber: isArabic ? '٥١٢٠' : 'SEC-7209',
      studentName: isArabic ? 'فاطمة أحمد' : 'Marcus Vance',
      totalScoreEarned: 9.5,
      totalMaxScore: 13.0,
      ocrConfidence: 0.92,
      scannedAt: '09:22 AM',
      evaluations: BIOLOGY_MIDTERM_TEMPLATE.questions.map((q, idx) => ({
        question_number: q.question_number,
        student_answer: idx === 1 ? (isArabic ? 'أ' : 'A') : (isArabic ? 'ج' : q.correct_answer),
        correct_answer: isArabic ? 'ج' : q.correct_answer,
        is_correct: idx !== 1,
        points_awarded: idx === 1 ? 0.0 : q.points,
        feedback_note: idx === 1 ? (isArabic ? 'خيار خاطئ' : 'Incorrect option') : (isArabic ? 'صحيح' : 'Correct'),
      })),
    },
  ]);

  const submissions = parentSubmissions || internalSubmissions;
  const setSubmissions = (newSubs: GradedSubmission[] | ((prev: GradedSubmission[]) => GradedSubmission[])) => {
    if (typeof newSubs === 'function') {
      const updated = newSubs(submissions);
      setInternalSubmissions(updated);
      onSubmissionsChange?.(updated);
    } else {
      setInternalSubmissions(newSubs);
      onSubmissionsChange?.(newSubs);
    }
  };

  const [batchCount, setBatchCount] = useState<number>(2);

  useEffect(() => {
    onBatchCountChange?.(batchCount);
  }, [batchCount, onBatchCountChange]);

  // Handle webcam
  useEffect(() => {
    if (useWebcam && currentScreen === 'scanner') {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          setWebcamStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn('Webcam not accessible:', err);
          setUseWebcam(false);
        });
    } else {
      if (webcamStream) {
        webcamStream.getTracks().forEach(t => t.stop());
        setWebcamStream(null);
      }
    }
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [useWebcam, currentScreen]);

  // Capture & AI grading trigger
  const handleCapturePaper = async () => {
    setIsProcessing(true);
    setProcessingStep(isArabic ? '١/٤: قراءة هوية الطالب ورقم الجلوس...' : '1/4: Detecting handwritten Secret Number / Name...');

    const sample = SAMPLE_STUDENT_PAPERS[selectedPaperIndex];

    setTimeout(() => {
      setProcessingStep(isArabic ? '٢/٤: التعرف الضوئي على الخط العربي والمشرقي...' : '2/4: Optical Character Recognition on Student ID...');
    }, 500);

    setTimeout(() => {
      setProcessingStep(isArabic ? '٣/٤: تقييم خيارات أ/ب/ج/د وصح/خطأ...' : '3/4: Evaluating MCQ & True/False markings...');
    }, 1100);

    setTimeout(() => {
      setProcessingStep(isArabic ? '٤/٤: التحليل الدلالي والتسامح الإملائي للإجابات...' : '4/4: Semantic analysis of handwritten Fill-in-the-Blank...');
    }, 1700);

    setTimeout(() => {
      setIsProcessing(false);
      setReviewSecretNumber(sample.secret_number_preview || '');
      setReviewStudentName(sample.student_name_preview || '');
      setReviewConfidence(sample.simulated_ocr_confidence);
      setReviewEvaluations(JSON.parse(JSON.stringify(sample.simulated_evaluations)));
      setCurrentPaperLabel(sample.label);
      setCurrentScreen('review');
    }, 2400);
  };

  // Toggle points in review screen (manual teacher override)
  const handleToggleEvaluation = (index: number) => {
    const updated = [...reviewEvaluations];
    const item = updated[index];
    const templateQ = activeTemplate.questions.find(q => q.question_number === item.question_number);
    const maxPts = templateQ?.points ?? 1.0;

    const willBeCorrect = !item.is_correct;
    updated[index] = {
      ...item,
      is_correct: willBeCorrect,
      points_awarded: willBeCorrect ? maxPts : 0.0,
      feedback_note: willBeCorrect
        ? (isArabic ? 'تعديل المعلم: احتساب الإجابة صحيحة' : 'Teacher override: marked correct')
        : (isArabic ? 'تعديل المعلم: احتساب الإجابة خاطئة' : 'Teacher override: marked incorrect'),
    };
    setReviewEvaluations(updated);
  };

  // Save student paper and return to scanner for next student
  const handleSaveAndNext = () => {
    const totalEarned = reviewEvaluations.reduce((sum, e) => sum + e.points_awarded, 0);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newSub: GradedSubmission = {
      id: `sub-${Date.now()}`,
      secretNumber: reviewSecretNumber.trim() || undefined,
      studentName: reviewStudentName.trim() || undefined,
      totalScoreEarned: totalEarned,
      totalMaxScore: activeTemplate.total_max_score,
      ocrConfidence: reviewConfidence,
      scannedAt: timeStr,
      evaluations: [...reviewEvaluations],
    };

    setSubmissions(prev => [newSub, ...prev]);
    setBatchCount(prev => prev + 1);

    // Rotate to next sample paper for convenience
    setSelectedPaperIndex(prev => (prev + 1) % SAMPLE_STUDENT_PAPERS.length);
    setCurrentScreen('scanner');
  };

  // Compute Review Screen total
  const currentTotalScore = reviewEvaluations.reduce((sum, e) => sum + e.points_awarded, 0);
  const currentPercentage = activeTemplate.total_max_score > 0
    ? (currentTotalScore / activeTemplate.total_max_score) * 100
    : 0;

  // Gradebook stats
  const classAvg = submissions.length > 0
    ? submissions.reduce((sum, s) => sum + s.totalScoreEarned, 0) / submissions.length
    : 0;
  const topScore = submissions.length > 0
    ? Math.max(...submissions.map(s => s.totalScoreEarned))
    : 0;
  const passCount = submissions.filter(s => {
    const pct = s.totalMaxScore > 0 ? (s.totalScoreEarned / s.totalMaxScore) * 100 : 0;
    return pct >= 60;
  }).length;
  const passRate = submissions.length > 0 ? (passCount / submissions.length) * 100 : 0;

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center gap-8 py-4 px-2 sm:px-4">
      {/* Android Device Frame */}
      <div className="relative w-[375px] h-[780px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-white/10 flex flex-col overflow-hidden">
        {/* Android Punch Hole Camera */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700"></div>
        </div>

        {/* Inner Viewport with Directionality (RTL / LTR) */}
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          className="relative w-full h-full bg-slate-900 rounded-[38px] overflow-hidden flex flex-col text-slate-100 font-sans select-none"
        >
          {/* Status Bar */}
          <div className="h-7 w-full px-6 pt-1 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-40 bg-slate-950/40 backdrop-blur-sm">
            <span>{isArabic ? '٩:٤١' : '9:41'}</span>
            <div className="flex items-center space-x-1.5 text-[10px]">
              <span>5G</span>
              <span className="w-2.5 h-2.5 border border-slate-300 rounded-xs flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-2xs"></span>
              </span>
            </div>
          </div>

          {/* SCREEN 1: HOME DASHBOARD */}
          {currentScreen === 'home' && (
            <div className="flex-1 flex flex-col bg-slate-900 overflow-y-auto pb-4">
              {/* Header */}
              <div className="p-4 bg-slate-800/90 border-b border-slate-700/60 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">{t.appName}</h2>
                  <p className="text-[11px] text-emerald-400 font-medium">
                    {isArabic ? 'مصحح الاختبارات الذكي • لغتان' : 'Bilingual Exam Scanner'}
                  </p>
                </div>
                <div className="flex items-center space-x-1 bg-slate-950/60 px-2 py-1 rounded-full border border-slate-700 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-slate-300">{isArabic ? 'جاهز' : 'Ready'}</span>
                </div>
              </div>

              {/* Template Card */}
              <div className="p-4 space-y-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-slate-700 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {t.activeAnswerKey}
                    </span>
                    <button
                      onClick={() => setCurrentScreen('master_key')}
                      className="text-xs text-emerald-400 hover:underline font-medium flex items-center gap-1"
                    >
                      <span>{t.inspectKey}</span>
                      {isArabic ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-white">{activeTemplate.exam_title}</h3>
                  <p className="text-xs text-slate-400 mb-3">{activeTemplate.subject}</p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-950/50 rounded-xl p-2 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">{t.questions}</span>
                      <span className="font-bold text-white text-sm">{activeTemplate.total_questions}</span>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-2 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">{t.maxPoints}</span>
                      <span className="font-bold text-emerald-400 text-sm">{activeTemplate.total_max_score}</span>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-2 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">{t.graded}</span>
                      <span className="font-bold text-teal-300 text-sm">{batchCount}</span>
                    </div>
                  </div>
                </div>

                {/* ID Mode Selector */}
                <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 block">
                    {t.idMode}
                  </span>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    <button
                      onClick={() => setIdMode('SECRET_NUMBER')}
                      className={`p-1.5 rounded-lg font-semibold transition-all ${
                        idMode === 'SECRET_NUMBER'
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isArabic ? 'رقم السري' : 'Secret #'}
                    </button>
                    <button
                      onClick={() => setIdMode('STUDENT_NAME')}
                      className={`p-1.5 rounded-lg font-semibold transition-all ${
                        idMode === 'STUDENT_NAME'
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isArabic ? 'اسم الطالب' : 'Name'}
                    </button>
                    <button
                      onClick={() => setIdMode('BOTH')}
                      className={`p-1.5 rounded-lg font-semibold transition-all ${
                        idMode === 'BOTH'
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isArabic ? 'كلاهما' : 'Both'}
                    </button>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={() => setCurrentScreen('scanner')}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-transform active:scale-98"
                >
                  <Camera className="w-4 h-4 ml-1.5" />
                  <span>{t.launchScanner}</span>
                </button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCurrentScreen('gradebook')}
                    className="p-3 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-slate-700/70 flex flex-col items-center text-center transition-colors"
                  >
                    <Table className="w-5 h-5 text-indigo-400 mb-1" />
                    <span className="text-xs font-semibold text-white">{t.gradebookTitle}</span>
                    <span className="text-[10px] text-slate-400">{submissions.length} {isArabic ? 'أوراق مسجلة' : 'papers recorded'}</span>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('master_key')}
                    className="p-3 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-slate-700/70 flex flex-col items-center text-center transition-colors"
                  >
                    <FileText className="w-5 h-5 text-emerald-400 mb-1" />
                    <span className="text-xs font-semibold text-white">{t.inspectKey}</span>
                    <span className="text-[10px] text-slate-400">{isArabic ? 'خيارات أ/ب/ج/د وصح/خطأ' : 'MCQ, T/F, Fill-in'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: CAMERA SCANNER WITH DYNAMIC OVERLAY */}
          {currentScreen === 'scanner' && (
            <div className="flex-1 flex flex-col bg-black relative overflow-hidden">
              {/* Camera Background or Simulated Paper Viewport */}
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                {useWebcam && webcamStream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Paper Simulation */
                  <div
                    className={`w-[85%] h-[78%] bg-white rounded-lg p-3 text-slate-900 shadow-2xl transition-all transform ${
                      isTorchOn ? 'brightness-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]' : ''
                    } flex flex-col justify-between select-none text-[10px]`}
                  >
                    {/* Student Paper Header */}
                    <div className="border-b-2 border-slate-800 pb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-slate-900 truncate max-w-[140px]">
                          {activeTemplate.exam_title}
                        </span>
                        
                        {/* Target Identification Box */}
                        <div className="flex flex-col gap-1 items-end">
                          {(idMode === 'STUDENT_NAME' || idMode === 'BOTH') && (
                            <div className="border border-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-right">
                              <span className="text-[7px] text-slate-500 block uppercase font-bold">
                                {isArabic ? 'اسم الطالب' : 'Name'}
                              </span>
                              <span className="font-bold text-[10px] text-emerald-900">
                                {SAMPLE_STUDENT_PAPERS[selectedPaperIndex].student_name_preview || (isArabic ? 'طارق المنصوري' : 'Alexander')}
                              </span>
                            </div>
                          )}

                          {(idMode === 'SECRET_NUMBER' || idMode === 'BOTH') && (
                            <div className="border-2 border-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-center">
                              <span className="text-[7px] text-slate-500 block uppercase font-bold">
                                {isArabic ? 'رقم الجلوس' : 'Secret #'}
                              </span>
                              <span className="font-mono font-extrabold text-xs text-emerald-800">
                                {SAMPLE_STUDENT_PAPERS[selectedPaperIndex].secret_number_preview || '8492'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Questions on Paper */}
                    <div className="space-y-1.5 my-1 text-[9px]">
                      {activeTemplate.questions.slice(0, 4).map((q) => {
                        const studentAns = SAMPLE_STUDENT_PAPERS[selectedPaperIndex].student_answers[q.question_number] || (isArabic ? 'ب' : 'B');
                        return (
                          <div key={q.question_number} className="bg-slate-50 p-1.5 rounded border border-slate-200">
                            <div className="flex justify-between font-semibold">
                              <span>{isArabic ? `سؤال ${q.question_number}` : `Q${q.question_number}`}</span>
                              <span className="text-emerald-700 font-bold bg-white px-1.5 rounded border border-emerald-300">
                                "{studentAns}"
                              </span>
                            </div>
                            <p className="text-slate-600 truncate text-[8px]">{q.question_text}</p>
                          </div>
                        );
                      })}
                      <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                        <div className="flex justify-between font-semibold">
                          <span>{isArabic ? 'سؤال ٥ (املأ الفراغ)' : 'Q5 (Fill in Blank)'}</span>
                          <span className="font-serif italic text-emerald-800 font-bold bg-white px-1.5 rounded border border-emerald-300">
                            "{SAMPLE_STUDENT_PAPERS[selectedPaperIndex].student_answers[5] || (isArabic ? 'كلوروفيل' : 'Chlorophyll')}"
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[8px] text-slate-400 text-center border-t pt-1">
                      {SAMPLE_STUDENT_PAPERS[selectedPaperIndex].label}
                    </div>
                  </div>
                )}
              </div>

              {/* RETICLE OVERLAY */}
              <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
                <div className="relative w-full h-full">
                  {/* Corner Brackets */}
                  <div className="absolute top-10 left-3 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg shadow-[0_0_10px_#10b981]"></div>
                  <div className="absolute top-10 right-3 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg shadow-[0_0_10px_#10b981]"></div>
                  <div className="absolute bottom-24 left-3 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg shadow-[0_0_10px_#10b981]"></div>
                  <div className="absolute bottom-24 right-3 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg shadow-[0_0_10px_#10b981]"></div>

                  {/* Target Box with Dynamic ID mode prompt */}
                  <div className="absolute top-12 left-8 right-8 h-10 border border-dashed border-emerald-400/80 bg-emerald-500/10 rounded-lg flex items-center justify-center text-center px-2">
                    <span className="text-[10px] text-emerald-300 font-bold tracking-wide">
                      {idMode === 'SECRET_NUMBER' ? t.targetSecret : idMode === 'STUDENT_NAME' ? t.targetName : t.targetBoth}
                    </span>
                  </div>

                  {/* Laser scan line */}
                  {isProcessing && (
                    <div className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce top-1/3"></div>
                  )}
                </div>
              </div>

              {/* Top Viewport Navigation Bar */}
              <div className="relative z-20 p-3 flex items-center justify-between bg-black/60 backdrop-blur-md">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-white hover:bg-slate-700"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <span className="text-xs font-bold text-white block">{t.alignPaperPrompt}</span>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    {t.batchGraded}: {batchCount}
                  </span>
                </div>

                <button
                  onClick={() => setIsTorchOn(!isTorchOn)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isTorchOn ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/40' : 'bg-slate-800/80 text-white'
                  }`}
                  title="Flash/Torch"
                >
                  <Flashlight className="w-4 h-4" />
                </button>
              </div>

              {/* Sample Paper Selector Tabs */}
              <div className="relative z-20 px-3 py-1.5 bg-black/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-medium">{t.testPaper}:</span>
                <div className="flex gap-1 overflow-x-auto">
                  {SAMPLE_STUDENT_PAPERS.map((paper, idx) => (
                    <button
                      key={paper.id}
                      onClick={() => setSelectedPaperIndex(idx)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap transition-all ${
                        selectedPaperIndex === idx
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {paper.language === 'ar' ? `عربي ${idx - 1}` : `EN #${idx + 1}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Shutter & Controls */}
              <div className="relative z-20 mt-auto p-4 bg-black/75 backdrop-blur-md flex flex-col items-center space-y-2">
                {isProcessing ? (
                  <div className="w-full bg-slate-900/90 border border-emerald-500/50 rounded-2xl p-3 flex items-center space-x-3 text-xs">
                    <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                    <div className="flex-1">
                      <span className="font-bold text-emerald-400 block text-[11px]">{t.aiGrading}</span>
                      <span className="text-[10px] text-slate-300">{processingStep}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-around w-full">
                    <button
                      onClick={() => setUseWebcam(!useWebcam)}
                      className="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                    >
                      {useWebcam ? t.useSample : t.useWebcam}
                    </button>

                    <button
                      onClick={handleCapturePaper}
                      className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/40 active:scale-90 transition-transform"
                    >
                      <Camera className="w-7 h-7" />
                    </button>

                    <button
                      onClick={() => setCurrentScreen('gradebook')}
                      className="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1"
                    >
                      <Table className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{isArabic ? 'الدرجات' : 'Grades'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCREEN 3: TEACHER VERIFICATION & REVIEW SCREEN */}
          {currentScreen === 'review' && (
            <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
              {/* Header */}
              <div className="p-3 bg-slate-800/95 border-b border-slate-700/80 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">{t.reviewTitle}</h3>
                  <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{currentPaperLabel}</p>
                </div>
                <button
                  onClick={() => setCurrentScreen('scanner')}
                  className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20"
                >
                  {t.discard}
                </button>
              </div>

              {/* Review Body */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {/* 1. DYNAMIC STUDENT IDENTIFICATION CARD (Name & Secret Number) */}
                <div className="bg-slate-800 rounded-2xl p-3 border border-slate-700 shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {isArabic ? 'بيانات هوية الطالب' : 'Student Identification'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        reviewConfidence >= 0.9
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {reviewConfidence < 0.9 && <AlertTriangle className="w-3 h-3" />}
                      {(reviewConfidence * 100).toFixed(0)}% {isArabic ? 'دقة الخط' : 'OCR Conf'}
                    </span>
                  </div>

                  {/* Student Name Input */}
                  {(idMode === 'STUDENT_NAME' || idMode === 'BOTH') && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 flex items-center gap-1">
                        <User className="w-3 h-3 text-teal-400" />
                        <span>{t.studentName}</span>
                      </label>
                      <input
                        type="text"
                        value={reviewStudentName}
                        onChange={(e) => setReviewStudentName(e.target.value)}
                        placeholder={isArabic ? 'اكتب اسم الطالب...' : 'Enter student full name...'}
                        className="w-full bg-slate-950 border border-slate-600 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  )}

                  {/* Secret Number Input */}
                  {(idMode === 'SECRET_NUMBER' || idMode === 'BOTH') && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Fingerprint className="w-3 h-3 text-emerald-400" />
                        <span>{t.studentSecretNumber} (0-9 / ٠-٩)</span>
                      </label>
                      <input
                        type="text"
                        value={reviewSecretNumber}
                        onChange={(e) => setReviewSecretNumber(e.target.value)}
                        placeholder={isArabic ? 'رقم الجلوس...' : 'Secret Number...'}
                        className="w-full bg-slate-950 border border-slate-600 rounded-xl px-3 py-1.5 text-base font-mono font-bold text-emerald-400 tracking-wider focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  )}

                  <p className="text-[9px] text-slate-400">{t.editPrompt}</p>
                </div>

                {/* 2. TOTAL SCORE BANNER */}
                <div className="bg-gradient-to-r from-slate-950 to-slate-800 rounded-2xl p-3 border border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{t.totalScoreEarned}</span>
                    <div className="text-xl font-extrabold text-white">
                      {currentTotalScore.toFixed(1)}{' '}
                      <span className="text-xs text-slate-400 font-normal">/ {activeTemplate.total_max_score}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-emerald-400">
                      {currentPercentage.toFixed(1)}%
                    </span>
                    <span className="block text-[10px] font-bold text-teal-300">
                      {t.grade}: {currentPercentage >= 90 ? (isArabic ? 'ممتاز (أ)' : 'A') : currentPercentage >= 80 ? (isArabic ? 'جيد جداً (ب)' : 'B') : currentPercentage >= 70 ? (isArabic ? 'جيد (ج)' : 'C') : (isArabic ? 'راسب' : 'F')}
                    </span>
                  </div>
                </div>

                {/* 3. QUESTION BREAKDOWN TABLE */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 px-1">
                    <span>{t.questionBreakdown}</span>
                    <span className="text-[10px] text-slate-400">{t.tapToOverride}</span>
                  </div>

                  {reviewEvaluations.map((evalItem, idx) => (
                    <div
                      key={evalItem.question_number}
                      className="bg-slate-800/90 rounded-xl p-2.5 border border-slate-700/80 flex items-start space-x-2 text-xs"
                    >
                      <button
                        onClick={() => handleToggleEvaluation(idx)}
                        className={`mt-0.5 p-1 rounded-full transition-transform active:scale-90 ${
                          evalItem.is_correct
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                        }`}
                        title="Override mark"
                      >
                        {evalItem.is_correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">
                            {isArabic ? `سؤال ${evalItem.question_number}` : `Q${evalItem.question_number}`}
                          </span>
                          <span
                            className={`font-bold font-mono text-xs ${
                              evalItem.is_correct ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            +{evalItem.points_awarded.toFixed(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-[11px] my-1">
                          <div className="bg-slate-950/60 p-1 rounded border border-slate-800">
                            <span className="text-[9px] text-slate-400 block">{isArabic ? 'إجابة الطالب:' : 'Student:'}</span>
                            <span className="font-medium text-slate-200 truncate block">
                              "{evalItem.student_answer}"
                            </span>
                          </div>
                          <div className="bg-slate-950/60 p-1 rounded border border-slate-800">
                            <span className="text-[9px] text-slate-400 block">{isArabic ? 'النموذج:' : 'Key:'}</span>
                            <span className="font-medium text-slate-200 truncate block">
                              "{evalItem.correct_answer}"
                            </span>
                          </div>
                        </div>

                        {evalItem.feedback_note && (
                          <p className="text-[10px] text-slate-400 italic">
                            💡 {evalItem.feedback_note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
                <button
                  onClick={handleSaveAndNext}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl font-bold text-sm shadow-md flex items-center justify-center space-x-2 active:scale-98 transition-transform"
                >
                  <span>{t.saveAndNext}</span>
                  {isArabic ? <ArrowLeft className="w-4 h-4 ml-1" /> : <ArrowRight className="w-4 h-4 ml-1" />}
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: GRADEBOOK */}
          {currentScreen === 'gradebook' && (
            <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
              <div className="p-3 bg-slate-800/95 border-b border-slate-700/80 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">{t.gradebookTitle}</h3>
                  <p className="text-[10px] text-slate-400">{submissions.length} {isArabic ? 'طلاب مصححين' : 'Students Graded'}</p>
                </div>
                <button
                  onClick={() => setCurrentScreen('scanner')}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'مسح المزيد' : 'Scan More'}</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {/* Stats Summary Bar */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-800/90 rounded-xl p-2.5 border border-slate-700 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">{t.classAverage}</span>
                    <span className="text-sm font-extrabold text-white">{classAvg.toFixed(1)}</span>
                    <span className="text-[9px] text-emerald-400 block">/ {activeTemplate.total_max_score}</span>
                  </div>
                  <div className="bg-slate-800/90 rounded-xl p-2.5 border border-slate-700 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">{t.topScore}</span>
                    <span className="text-sm font-extrabold text-amber-400">{topScore.toFixed(1)}</span>
                    <span className="text-[9px] text-slate-400 block">pts</span>
                  </div>
                  <div className="bg-slate-800/90 rounded-xl p-2.5 border border-slate-700 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">{t.passRate}</span>
                    <span className="text-sm font-extrabold text-teal-400">{passRate.toFixed(0)}%</span>
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportSubmissionsToCsv(activeTemplate.exam_title, submissions, activeTemplate.total_questions, locale)}
                    className="flex-1 py-2 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>{t.downloadCsv}</span>
                  </button>
                  <button
                    onClick={() => exportSubmissionsToCsv(activeTemplate.exam_title, submissions, activeTemplate.total_questions, locale)}
                    className="flex-1 py-2 px-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>{t.downloadXlsx}</span>
                  </button>
                </div>

                {/* Open Recharts Analytics Dashboard Button */}
                {onOpenDashboard && (
                  <button
                    onClick={onOpenDashboard}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
                  >
                    <BarChart2 className="w-4 h-4 text-emerald-400" />
                    <span>{isArabic ? 'فتح لوحة التحليلات والتدخل التعليمي' : 'Open Analytics & Intervention Dashboard'}</span>
                  </button>
                )}

                {/* Submissions List */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-300 px-1 block">
                    {isArabic ? 'النتائج المسجلة' : 'Recorded Submissions'}
                  </span>

                  {submissions.map((sub) => {
                    const pct = (sub.totalScoreEarned / sub.totalMaxScore) * 100;
                    return (
                      <div
                        key={sub.id}
                        className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center font-bold text-xs text-emerald-400 border border-slate-800">
                            {pct >= 90 ? (isArabic ? 'أ' : 'A') : pct >= 80 ? (isArabic ? 'ب' : 'B') : pct >= 70 ? (isArabic ? 'ج' : 'C') : (isArabic ? 'هـ' : 'F')}
                          </div>
                          <div>
                            {sub.studentName && (
                              <span className="font-bold text-white block text-xs">{sub.studentName}</span>
                            )}
                            <span className="font-mono text-slate-300 text-[11px] block">{sub.secretNumber || (isArabic ? 'بدون رقم' : 'No ID')}</span>
                            <span className="text-[10px] text-slate-400">{sub.scannedAt} • OCR {(sub.ocrConfidence * 100).toFixed(0)}%</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-white text-xs block">
                            {sub.totalScoreEarned.toFixed(1)} / {sub.totalMaxScore}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-950 border-t border-slate-800">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  {isArabic ? 'العودة للقائمة الرئيسية' : 'Return to Main Menu'}
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 5: MASTER ANSWER KEY DETAIL */}
          {currentScreen === 'master_key' && (
            <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
              <div className="p-3 bg-slate-800/95 border-b border-slate-700/80 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">{t.activeAnswerKey}</h3>
                  <p className="text-[10px] text-emerald-400">{activeTemplate.exam_title}</p>
                </div>
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="text-xs text-slate-300 hover:text-white"
                >
                  {isArabic ? 'تم' : 'Done'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
                {activeTemplate.questions.map((q) => (
                  <div key={q.question_number} className="bg-slate-800 rounded-xl p-2.5 border border-slate-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-xs">
                        {isArabic ? `سؤال ${q.question_number} • ${q.type}` : `Q${q.question_number} • ${q.type}`}
                      </span>
                      <span className="text-emerald-400 font-bold text-[11px]">
                        {q.points} {isArabic ? 'درجات' : 'pts'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 mb-1.5">{q.question_text}</p>
                    <div className="bg-slate-950/70 p-1.5 rounded text-[11px] font-mono text-emerald-300 border border-slate-800 flex justify-between">
                      <span className="text-slate-400 text-[10px]">{isArabic ? 'الإجابة المعتمدة:' : 'Expected Answer:'}</span>
                      <span className="font-bold">{q.correct_answer}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950 border-t border-slate-800">
                <button
                  onClick={() => setCurrentScreen('scanner')}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{t.launchScanner}</span>
                </button>
              </div>
            </div>
          )}

          {/* Android Home Navigation Indicator Bar */}
          <div className="h-4 w-full bg-slate-950 flex items-center justify-center">
            <div className="w-28 h-1 bg-slate-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Guide Panel */}
      <div className="max-w-xl w-full space-y-4">
        {/* Bilingual & Dynamic ID Features Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <Globe className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">
              {isArabic ? 'المعمارية ثنائية اللغة وتحديد هوية الطالب' : 'Bilingual Architecture & Dynamic Student ID'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            {isArabic
              ? 'تدعم المعمارية الحالية التبديل الفوري بين العربية (RTL) والإنجليزية (LTR)، مع التعرف على خط اليد باللغتين والأرقام المشرقية (٠-٩) والغربية (0-9).'
              : 'Full support for bilingual RTL/LTR layout, Eastern Arabic numerals (٠-٩), handwritten Arabic script names, and dynamic ID mode selection.'}
          </p>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="font-bold text-slate-200 block mb-1">
                {isArabic ? '١. نمط الهوية الديناميكي (ID Mode)' : '1. Dynamic Student Identification'}
              </span>
              <p className="text-slate-400 text-[11px]">
                {isArabic
                  ? 'يتيح للمعلم الاختيار بين استخراج رقم الجلوس السري فقط، أو اسم الطالب الكامل بخط اليد، أو كلاهما معاً.'
                  : 'Configurable per exam: SECRET_NUMBER, STUDENT_NAME, or BOTH. Gemini extracts each field into separate structured properties.'}
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="font-bold text-slate-200 block mb-1">
                {isArabic ? '٢. خيارات الأسئلة العربية والإنجليزية' : '2. Arabic & English Answer Types'}
              </span>
              <p className="text-slate-400 text-[11px]">
                {isArabic
                  ? 'يتعرف الذكاء الاصطناعي بدقة على خيارات أ / ب / ج / د وخيارات صح / خطأ والتسامح الإملائي للكلمات المكتوبة بخط اليد.'
                  : 'Gemini Vision processes both English (A/B/C/D, True/False) and Arabic (أ/ب/ج/د, صح/خطأ) markings with phonetic typo tolerance.'}
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="font-bold text-slate-200 block mb-1">
                {isArabic ? '٣. تصدير ملفات Excel و CSV معتمدة' : '3. Localized CSV/Excel Export (UTF-8 BOM)'}
              </span>
              <p className="text-slate-400 text-[11px]">
                {isArabic
                  ? 'يتم توليد ملفات CSV و XLSX بعناوين أعمدة عربية مع تضمين UTF-8 BOM لفتحها في برنامج Excel بدون تشويه الحروف.'
                  : 'Exports CSV with UTF-8 BOM header and localized table column names matching the active language.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
