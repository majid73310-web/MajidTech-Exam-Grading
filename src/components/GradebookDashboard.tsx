import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Award,
  Users,
  Target,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { GradedSubmission, exportSubmissionsToCsv } from '../utils/gradeExporter';
import { BIOLOGY_MIDTERM_TEMPLATE } from '../data/sampleExams';
import { AppLocale, TRANSLATIONS } from '../utils/i18n';

interface GradebookDashboardProps {
  submissions: GradedSubmission[];
  examTitle?: string;
  totalMaxScore?: number;
  onSelectStudentToReview?: (secretNumber: string) => void;
  onBackToScanner?: () => void;
  locale?: AppLocale;
}

// Initial realistic classroom population for high-density analytics
const SAMPLE_CLASSROOM_DATA: GradedSubmission[] = [
  {
    id: 'sub-c1',
    secretNumber: 'SEC-3104',
    totalScoreEarned: 6.5,
    totalMaxScore: 13.0,
    ocrConfidence: 0.79,
    scannedAt: '09:05 AM',
    evaluations: [
      { question_number: 1, student_answer: 'B', correct_answer: 'B', is_correct: true, points_awarded: 2.0, feedback_note: 'Correct' },
      { question_number: 2, student_answer: 'A', correct_answer: 'C', is_correct: false, points_awarded: 0.0, feedback_note: 'Marked A instead of C' },
      { question_number: 3, student_answer: 'T', correct_answer: 'True', is_correct: true, points_awarded: 1.5, feedback_note: 'Accepted T' },
      { question_number: 4, student_answer: 'T', correct_answer: 'False', is_correct: false, points_awarded: 0.0, feedback_note: 'Incorrect TF' },
      { question_number: 5, student_answer: 'Chlorophyll', correct_answer: 'Chlorophyll', is_correct: true, points_awarded: 3.0, feedback_note: 'Exact match' },
      { question_number: 6, student_answer: 'Chromosome', correct_answer: 'Gene', is_correct: false, points_awarded: 0.0, feedback_note: 'Misidentified unit' },
    ]
  },
  {
    id: 'sub-c2',
    secretNumber: 'SEC-1092',
    totalScoreEarned: 5.0,
    totalMaxScore: 13.0,
    ocrConfidence: 0.91,
    scannedAt: '09:12 AM',
    evaluations: [
      { question_number: 1, student_answer: 'C', correct_answer: 'B', is_correct: false, points_awarded: 0.0, feedback_note: 'Incorrect organelle' },
      { question_number: 2, student_answer: 'B', correct_answer: 'C', is_correct: false, points_awarded: 0.0, feedback_note: 'Incorrect nucleic acid' },
      { question_number: 3, student_answer: 'True', correct_answer: 'True', is_correct: true, points_awarded: 1.5, feedback_note: 'Correct' },
      { question_number: 4, student_answer: 'True', correct_answer: 'False', is_correct: false, points_awarded: 0.0, feedback_note: 'Incorrect TF' },
      { question_number: 5, student_answer: 'Chlorophil', correct_answer: 'Chlorophyll', is_correct: true, points_awarded: 3.0, feedback_note: 'Phonetic match' },
      { question_number: 6, student_answer: 'Cell', correct_answer: 'Gene', is_correct: false, points_awarded: 0.0, feedback_note: 'Wrong term' },
    ]
  },
  {
    id: 'sub-c3',
    secretNumber: 'SEC-7719',
    totalScoreEarned: 7.0,
    totalMaxScore: 13.0,
    ocrConfidence: 0.96,
    scannedAt: '09:18 AM',
    evaluations: [
      { question_number: 1, student_answer: 'B', correct_answer: 'B', is_correct: true, points_awarded: 2.0, feedback_note: 'Correct' },
      { question_number: 2, student_answer: 'C', correct_answer: 'C', is_correct: true, points_awarded: 2.0, feedback_note: 'Correct' },
      { question_number: 3, student_answer: 'False', correct_answer: 'True', is_correct: false, points_awarded: 0.0, feedback_note: 'Missed plant cell wall fact' },
      { question_number: 4, student_answer: 'True', correct_answer: 'False', is_correct: false, points_awarded: 0.0, feedback_note: 'Respiration error' },
      { question_number: 5, student_answer: 'Chloroplast', correct_answer: 'Chlorophyll', is_correct: false, points_awarded: 0.0, feedback_note: 'Named organelle instead of pigment' },
      { question_number: 6, student_answer: 'Gene', correct_answer: 'Gene', is_correct: true, points_awarded: 3.0, feedback_note: 'Exact match' },
    ]
  },
  {
    id: 'sub-c4',
    secretNumber: 'SEC-8492',
    totalScoreEarned: 13.0,
    totalMaxScore: 13.0,
    ocrConfidence: 0.98,
    scannedAt: '09:20 AM',
    evaluations: [
      { question_number: 1, student_answer: 'B', correct_answer: 'B', is_correct: true, points_awarded: 2.0, feedback_note: 'Correct' },
      { question_number: 2, student_answer: 'C', correct_answer: 'C', is_correct: true, points_awarded: 2.0, feedback_note: 'Correct' },
      { question_number: 3, student_answer: 'True', correct_answer: 'True', is_correct: true, points_awarded: 1.5, feedback_note: 'Correct' },
      { question_number: 4, student_answer: 'False', correct_answer: 'False', is_correct: true, points_awarded: 1.5, feedback_note: 'Correct' },
      { question_number: 5, student_answer: 'clorophyl', correct_answer: 'Chlorophyll', is_correct: true, points_awarded: 3.0, feedback_note: 'Accepted phonetic misspelling' },
      { question_number: 6, student_answer: 'Gene', correct_answer: 'Gene', is_correct: true, points_awarded: 3.0, feedback_note: 'Exact match' },
    ]
  },
  {
    id: 'sub-c5',
    secretNumber: 'SEC-5821',
    totalScoreEarned: 11.5,
    totalMaxScore: 13.0,
    ocrConfidence: 0.94,
    scannedAt: '09:24 AM',
    evaluations: [
      { question_number: 1, student_answer: 'B', correct_answer: 'B', is_correct: true, points_awarded: 2.0, feedback_note: 'Correct' },
      { question_number: 2, student_answer: 'C', correct_answer: 'C', is_correct: true, points_awarded: 2.0, feedback_note: 'Correct' },
      { question_number: 3, student_answer: 'True', correct_answer: 'True', is_correct: true, points_awarded: 1.5, feedback_note: 'Correct' },
      { question_number: 4, student_answer: 'False', correct_answer: 'False', is_correct: true, points_awarded: 1.5, feedback_note: 'Correct' },
      { question_number: 5, student_answer: 'Chlorophyl', correct_answer: 'Chlorophyll', is_correct: true, points_awarded: 3.0, feedback_note: 'Accepted variant' },
      { question_number: 6, student_answer: 'Genetics', correct_answer: 'Gene', is_correct: false, points_awarded: 1.5, feedback_note: 'Partial credit' },
    ]
  },
  {
    id: 'sub-c6',
    secretNumber: 'SEC-9140',
    totalScoreEarned: 13.0,
    totalMaxScore: 13.0,
    ocrConfidence: 0.91,
    scannedAt: '09:30 AM',
    evaluations: [
      { question_number: 1, student_answer: 'b', correct_answer: 'B', is_correct: true, points_awarded: 2.0, feedback_note: 'Normalized lowercase' },
      { question_number: 2, student_answer: 'c', correct_answer: 'C', is_correct: true, points_awarded: 2.0, feedback_note: 'Normalized lowercase' },
      { question_number: 3, student_answer: 'T', correct_answer: 'True', is_correct: true, points_awarded: 1.5, feedback_note: 'Accepted T' },
      { question_number: 4, student_answer: 'F', correct_answer: 'False', is_correct: true, points_awarded: 1.5, feedback_note: 'Accepted F' },
      { question_number: 5, student_answer: 'chlorophyll pigment', correct_answer: 'Chlorophyll', is_correct: true, points_awarded: 3.0, feedback_note: 'Full concept match' },
      { question_number: 6, student_answer: 'gene segment', correct_answer: 'Gene', is_correct: true, points_awarded: 3.0, feedback_note: 'Core term recognized' },
    ]
  },
  {
    id: 'sub-c7',
    secretNumber: 'SEC-4412',
    totalScoreEarned: 10.0,
    totalMaxScore: 13.0,
    ocrConfidence: 0.99,
    scannedAt: '09:35 AM',
    evaluations: [
      { question_number: 1, student_answer: 'B', correct_answer: 'B', is_correct: true, points_awarded: 2.0, feedback_note: 'Correct' },
      { question_number: 2, student_answer: 'C', correct_answer: 'C', is_correct: true, points_awarded: 2.0, feedback_note: 'Correct' },
      { question_number: 3, student_answer: 'True', correct_answer: 'True', is_correct: true, points_awarded: 1.5, feedback_note: 'Correct' },
      { question_number: 4, student_answer: 'True', correct_answer: 'False', is_correct: false, points_awarded: 0.0, feedback_note: 'Respiration error' },
      { question_number: 5, student_answer: 'Chlorophyll', correct_answer: 'Chlorophyll', is_correct: true, points_awarded: 3.0, feedback_note: 'Correct' },
      { question_number: 6, student_answer: 'Allele', correct_answer: 'Gene', is_correct: false, points_awarded: 1.5, feedback_note: 'Partial credit' },
    ]
  },
  {
    id: 'sub-c8',
    secretNumber: 'SEC-6284',
    totalScoreEarned: 8.5,
    totalMaxScore: 13.0,
    ocrConfidence: 0.88,
    scannedAt: '09:41 AM',
    evaluations: [
      { question_number: 1, student_answer: 'B', correct_answer: 'B', is_correct: true, points_awarded: 2.0, feedback_note: 'Correct' },
      { question_number: 2, student_answer: 'D', correct_answer: 'C', is_correct: false, points_awarded: 0.0, feedback_note: 'Marked Carbohydrate' },
      { question_number: 3, student_answer: 'True', correct_answer: 'True', is_correct: true, points_awarded: 1.5, feedback_note: 'Correct' },
      { question_number: 4, student_answer: 'False', correct_answer: 'False', is_correct: true, points_awarded: 1.5, feedback_note: 'Correct' },
      { question_number: 5, student_answer: 'chlorophyl', correct_answer: 'Chlorophyll', is_correct: true, points_awarded: 3.0, feedback_note: 'Phonetic match' },
      { question_number: 6, student_answer: '', correct_answer: 'Gene', is_correct: false, points_awarded: 0.0, feedback_note: 'Blank question' },
    ]
  },
  {
    id: 'sub-c9',
    secretNumber: 'SEC-2983',
    totalScoreEarned: 4.0,
    totalMaxScore: 13.0,
    ocrConfidence: 0.84,
    scannedAt: '09:45 AM',
    evaluations: [
      { question_number: 1, student_answer: 'A', correct_answer: 'B', is_correct: false, points_awarded: 0.0, feedback_note: 'Marked Nucleus' },
      { question_number: 2, student_answer: 'A', correct_answer: 'C', is_correct: false, points_awarded: 0.0, feedback_note: 'Marked Lipid' },
      { question_number: 3, student_answer: 'False', correct_answer: 'True', is_correct: false, points_awarded: 0.0, feedback_note: 'Cell wall confusion' },
      { question_number: 4, student_answer: 'False', correct_answer: 'False', is_correct: true, points_awarded: 1.5, feedback_note: 'Correct' },
      { question_number: 5, student_answer: 'Sunlight', correct_answer: 'Chlorophyll', is_correct: false, points_awarded: 0.0, feedback_note: 'Stated energy source, not pigment' },
      { question_number: 6, student_answer: 'Gen', correct_answer: 'Gene', is_correct: true, points_awarded: 2.5, feedback_note: 'Truncated spelling, partial credit' },
    ]
  }
];

export const GradebookDashboard: React.FC<GradebookDashboardProps> = ({
  submissions: liveSubmissions,
  examTitle = BIOLOGY_MIDTERM_TEMPLATE.exam_title,
  totalMaxScore = BIOLOGY_MIDTERM_TEMPLATE.total_max_score,
  onSelectStudentToReview,
  onBackToScanner,
  locale = 'en',
}) => {
  const isArabic = locale === 'ar';
  const t = TRANSLATIONS[locale];

  // Combine live submissions with sample class data if live is small, or allow toggling
  const [useExtendedClass, setUseExtendedClass] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [interventionNotes, setInterventionNotes] = useState<Record<string, string>>({});
  const [activeNoteModal, setActiveNoteModal] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');

  const dataset = useMemo(() => {
    if (!useExtendedClass && liveSubmissions.length > 0) {
      return liveSubmissions;
    }
    // Merge live with extended class without duplicates
    const liveIds = new Set(liveSubmissions.map(s => s.secretNumber));
    const uniqueSample = SAMPLE_CLASSROOM_DATA.filter(s => !liveIds.has(s.secretNumber));
    return [...liveSubmissions, ...uniqueSample];
  }, [liveSubmissions, useExtendedClass]);

  // Aggregate stats
  const totalStudents = dataset.length;
  const avgScore = totalStudents > 0
    ? dataset.reduce((sum, s) => sum + s.totalScoreEarned, 0) / totalStudents
    : 0;
  const avgPercentage = totalMaxScore > 0 ? (avgScore / totalMaxScore) * 100 : 0;
  
  const scoresArray = dataset.map(s => s.totalScoreEarned).sort((a, b) => a - b);
  const medianScore = scoresArray.length > 0
    ? scoresArray[Math.floor(scoresArray.length / 2)]
    : 0;

  const passingStudents = dataset.filter(s => {
    const pct = totalMaxScore > 0 ? (s.totalScoreEarned / totalMaxScore) * 100 : 0;
    return pct >= 60;
  });
  const passRate = totalStudents > 0 ? (passingStudents.length / totalStudents) * 100 : 0;

  // Grade Distribution Tiers for Recharts Bar Chart
  const distributionData = useMemo(() => {
    const tiers = [
      { tier: 'A (90-100%)', count: 0, color: '#10b981', minPct: 90 },
      { tier: 'B (80-89%)', count: 0, color: '#06b6d4', minPct: 80 },
      { tier: 'C (70-79%)', count: 0, color: '#3b82f6', minPct: 70 },
      { tier: 'D (60-69%)', count: 0, color: '#f59e0b', minPct: 60 },
      { tier: 'F (< 60%)', count: 0, color: '#ef4444', minPct: 0 },
    ];

    dataset.forEach(sub => {
      const pct = totalMaxScore > 0 ? (sub.totalScoreEarned / totalMaxScore) * 100 : 0;
      if (pct >= 90) tiers[0].count++;
      else if (pct >= 80) tiers[1].count++;
      else if (pct >= 70) tiers[2].count++;
      else if (pct >= 60) tiers[3].count++;
      else tiers[4].count++;
    });

    return tiers;
  }, [dataset, totalMaxScore]);

  // Question-by-Question Accuracy Trend for Recharts Line/Area Chart
  const questionAccuracyData = useMemo(() => {
    const questionStats: Record<number, { correct: number; total: number; type: string }> = {};

    BIOLOGY_MIDTERM_TEMPLATE.questions.forEach(q => {
      questionStats[q.question_number] = { correct: 0, total: 0, type: q.type };
    });

    dataset.forEach(sub => {
      sub.evaluations.forEach(ev => {
        if (!questionStats[ev.question_number]) {
          questionStats[ev.question_number] = { correct: 0, total: 0, type: 'UNKNOWN' };
        }
        questionStats[ev.question_number].total++;
        if (ev.is_correct) {
          questionStats[ev.question_number].correct++;
        }
      });
    });

    return Object.entries(questionStats).map(([qNum, stat]) => {
      const accuracy = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
      return {
        question: `Q${qNum}`,
        accuracy: Math.round(accuracy),
        type: stat.type,
      };
    });
  }, [dataset]);

  // Identify Lowest Performing Students Requiring Quick Intervention
  const interventionStudents = useMemo(() => {
    return [...dataset]
      .filter(s => {
        const pct = totalMaxScore > 0 ? (s.totalScoreEarned / totalMaxScore) * 100 : 0;
        return pct < 65; // Below 65% threshold for teacher intervention
      })
      .sort((a, b) => a.totalScoreEarned - b.totalScoreEarned); // Lowest first
  }, [dataset, totalMaxScore]);

  const filteredInterventionStudents = interventionStudents.filter(s =>
    (s.secretNumber?.toLowerCase().includes(searchFilter.toLowerCase()) ||
     s.studentName?.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const handleOpenNoteModal = (identifier: string) => {
    setActiveNoteModal(identifier);
    setTempNoteText(interventionNotes[identifier] || '');
  };

  const handleSaveNote = () => {
    if (activeNoteModal) {
      setInterventionNotes(prev => ({
        ...prev,
        [activeNoteModal]: tempNoteText,
      }));
    }
    setActiveNoteModal(null);
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner with Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isArabic ? 'لوحة تحليلات سجل الدرجات والتدخل التعليمي' : 'Gradebook Analytics & Intervention Dashboard'}
            </h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
              Live Recharts Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {examTitle} • {isArabic ? 'توزيع درجات الطلاب، منحنى صعوبة الأسئلة، وتنبيهات الدعم' : 'Class Performance Distribution, Question Accuracy Curve, and Priority Remediation Alerts.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setUseExtendedClass(!useExtendedClass)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              useExtendedClass
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle between combined cohort view and strictly live scanned papers"
          >
            {useExtendedClass ? (isArabic ? 'كامل الفوج (المباشر + الأرشيف)' : 'Full Cohort (Live + Historical)') : (isArabic ? 'الأوراق المباشرة فقط' : 'Strictly Live Papers Only')}
          </button>

          <button
            onClick={() => exportSubmissionsToCsv(examTitle, dataset, 6, locale)}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3 py-1.5 rounded-xl text-xs border border-slate-700 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.downloadCsv}</span>
          </button>

          {onBackToScanner && (
            <button
              onClick={onBackToScanner}
              className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md transition-colors"
            >
              <span>{isArabic ? 'العودة للماسح' : 'Back to Scanner'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Class Average */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Class Average</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-extrabold text-white">{avgScore.toFixed(1)}</span>
              <span className="text-xs text-slate-400">/ {totalMaxScore}</span>
              <span className="text-xs font-bold text-emerald-400 ml-1">({avgPercentage.toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Pass Rate (&ge; 60%)</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-extrabold text-white">{passRate.toFixed(0)}%</span>
              <span className="text-xs text-slate-400">({passingStudents.length}/{totalStudents})</span>
            </div>
          </div>
        </div>

        {/* Median Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Median Score</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-extrabold text-white">{medianScore.toFixed(1)}</span>
              <span className="text-xs text-slate-400">pts</span>
            </div>
          </div>
        </div>

        {/* Intervention Needed Count */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Intervention Alerts</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-extrabold text-rose-400">{interventionStudents.length}</span>
              <span className="text-xs text-slate-400">students &lt; 65%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Recharts Score Distribution & Question Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Grade Tier Distribution (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Class Grade Distribution Histogram</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Number of student papers scored in each letter grade bracket
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
              N = {totalStudents} papers
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="tier" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value} Students`, 'Count']}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>A: Top Mastery</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>B/C: Passing</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>F: Urgent Support</span>
              </span>
            </div>
            <span className="text-emerald-400 font-semibold">
              Pass Benchmark: 60%
            </span>
          </div>
        </div>

        {/* Chart 2: Question-by-Question Accuracy Trend (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                <span>Question Accuracy & Concept Mastery</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Identifies difficult exam concepts across all papers
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={questionAccuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="question" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis unit="%" stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, _: any, item: any) => [
                    `${value}% Accuracy (${item.payload.type})`,
                    'Mastery Rate',
                  ]}
                />
                <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '60% Target', fill: '#ef4444', fontSize: 10, position: 'right' }} />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#accuracyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Q1-Q2: MCQ • Q3-Q4: T/F • Q5-Q6: Fill-in</span>
            <span className="text-teal-400 font-semibold">
              Lowest: Q4 (Respiration T/F)
            </span>
          </div>
        </div>
      </div>

      {/* TEACHER INTERVENTION PANEL: STUDENTS WITH LOWEST GRADES */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white">
                Teacher Intervention Watchlist ({filteredInterventionStudents.length} Students)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Students scoring below 65% prioritized for 1-on-1 remediation, concept review, or re-testing.
            </p>
          </div>

          {/* Search Secret Number */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Secret Number..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {filteredInterventionStudents.length === 0 ? (
          <div className="text-center py-10 text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-semibold text-white text-sm">No students currently require urgent intervention!</p>
            <p className="text-xs">All scanned students scored above the 65% target threshold.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInterventionStudents.map((student) => {
              const pct = totalMaxScore > 0 ? (student.totalScoreEarned / totalMaxScore) * 100 : 0;
              const missedQuestions = student.evaluations.filter(e => !e.is_correct);
              const studentKey = student.secretNumber || student.studentName || student.id;
              const note = interventionNotes[studentKey];

              return (
                <div
                  key={student.id}
                  className="bg-slate-950 rounded-xl p-4 border border-rose-500/30 hover:border-rose-500/60 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col">
                        {student.studentName && (
                          <span className="font-bold text-sm text-white">{student.studentName}</span>
                        )}
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-slate-300 tracking-wider">
                            {student.secretNumber || (isArabic ? 'بدون رقم' : 'No ID')}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                            OCR: {(student.ocrConfidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full">
                        {pct.toFixed(0)}% ({isArabic ? 'راسب' : 'Grade F'})
                      </span>
                    </div>

                    {/* Score Bar */}
                    <div className="space-y-1 my-2">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                        <span>Score: {student.totalScoreEarned.toFixed(1)} / {totalMaxScore} pts</span>
                        <span className="text-rose-400">Needs Remediation</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, pct)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Missed Questions Breakdown */}
                    <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-[11px] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Missed Questions ({missedQuestions.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {missedQuestions.map(m => (
                          <span
                            key={m.question_number}
                            className="bg-rose-500/10 text-rose-300 border border-rose-500/20 px-1.5 py-0.5 rounded text-[10px] font-mono"
                            title={`Student wrote "${m.student_answer}", correct was "${m.correct_answer}"`}
                          >
                            Q{m.question_number}: {m.student_answer ? `"${m.student_answer}"` : 'Blank'}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Teacher Action Note if set */}
                    {note && (
                      <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300">
                        <span className="font-bold block text-[10px] uppercase text-emerald-400">Teacher Action Note:</span>
                        {note}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenNoteModal(studentKey)}
                      className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                      <span>{note ? 'Edit Note' : 'Add Action'}</span>
                    </button>

                    <button
                      onClick={() => onSelectStudentToReview?.(studentKey)}
                      className="py-1.5 px-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Inspect student's evaluated answer sheet"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Teacher Action Note Modal */}
      {activeNoteModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="font-bold text-white text-sm">
                Intervention Note: Student {activeNoteModal}
              </h4>
              <button
                onClick={() => setActiveNoteModal(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Prescribe remediation plan, review date, or re-test instructions:
              </label>
              <textarea
                rows={4}
                value={tempNoteText}
                onChange={(e) => setTempNoteText(e.target.value)}
                placeholder="e.g. Scheduled for Thursday lunchtime office hours to review cellular respiration concepts (Q4). Retest scheduled Friday."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setActiveNoteModal(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Dismiss
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Save Action Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
