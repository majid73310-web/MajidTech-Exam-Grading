import React, { useState } from 'react';
import { Header } from './components/Header';
import { MobileSimulator } from './components/MobileSimulator';
import { CodeStudio } from './components/CodeStudio';
import { ArchitectureBlueprint } from './components/ArchitectureBlueprint';
import { GradebookDashboard } from './components/GradebookDashboard';
import { ApkBuildCenter } from './components/ApkBuildCenter';
import { GradedSubmission } from './utils/gradeExporter';
import { BIOLOGY_MIDTERM_TEMPLATE, ARABIC_BIOLOGY_TEMPLATE } from './data/sampleExams';
import { AppLocale } from './utils/i18n';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'architecture' | 'dashboard' | 'apk'>('simulator');
  const [batchCount, setBatchCount] = useState<number>(2);
  const [locale, setLocale] = useState<AppLocale>('en');

  const handleToggleLocale = () => {
    setLocale(prev => prev === 'en' ? 'ar' : 'en');
  };

  const isArabic = locale === 'ar';

  // Shared submissions state across Mobile Simulator and GradebookDashboard
  const [submissions, setSubmissions] = useState<GradedSubmission[]>([
    {
      id: 'sub-init-1',
      secretNumber: 'SEC-4412',
      studentName: 'Alexander Wright',
      totalScoreEarned: 13.0,
      totalMaxScore: 13.0,
      ocrConfidence: 0.99,
      scannedAt: '09:15 AM',
      evaluations: BIOLOGY_MIDTERM_TEMPLATE.questions.map(q => ({
        question_number: q.question_number,
        student_answer: q.correct_answer,
        correct_answer: q.correct_answer,
        is_correct: true,
        points_awarded: q.points,
        feedback_note: 'Initial verified master record',
      })),
    },
    {
      id: 'sub-init-2',
      secretNumber: 'SEC-7209',
      studentName: 'Marcus Vance',
      totalScoreEarned: 9.5,
      totalMaxScore: 13.0,
      ocrConfidence: 0.92,
      scannedAt: '09:22 AM',
      evaluations: BIOLOGY_MIDTERM_TEMPLATE.questions.map((q, idx) => ({
        question_number: q.question_number,
        student_answer: idx === 1 ? 'A' : q.correct_answer,
        correct_answer: q.correct_answer,
        is_correct: idx !== 1,
        points_awarded: idx === 1 ? 0.0 : q.points,
        feedback_note: idx === 1 ? 'Incorrect option' : 'Correct',
      })),
    },
    {
      id: 'sub-init-3',
      secretNumber: '٨٤٩٢',
      studentName: 'طارق بن زياد المنصوري',
      totalScoreEarned: 13.0,
      totalMaxScore: 13.0,
      ocrConfidence: 0.97,
      scannedAt: '09:30 AM',
      evaluations: ARABIC_BIOLOGY_TEMPLATE.questions.map(q => ({
        question_number: q.question_number,
        student_answer: q.correct_answer,
        correct_answer: q.correct_answer,
        is_correct: true,
        points_awarded: q.points,
        feedback_note: 'إجابة نموذجية صحيحة',
      })),
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        batchCount={batchCount}
        locale={locale}
        onToggleLocale={handleToggleLocale}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'simulator' && (
          <div className="flex-1 flex items-center justify-center p-2 sm:p-6 bg-radial from-slate-900 to-slate-950">
            <MobileSimulator
              onBatchCountChange={setBatchCount}
              submissions={submissions}
              onSubmissionsChange={setSubmissions}
              onOpenDashboard={() => setActiveTab('dashboard')}
              locale={locale}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="flex-1 bg-slate-950">
            <GradebookDashboard
              submissions={submissions}
              examTitle={isArabic ? ARABIC_BIOLOGY_TEMPLATE.exam_title : BIOLOGY_MIDTERM_TEMPLATE.exam_title}
              totalMaxScore={BIOLOGY_MIDTERM_TEMPLATE.total_max_score}
              onBackToScanner={() => setActiveTab('simulator')}
              locale={locale}
            />
          </div>
        )}

        {activeTab === 'code' && (
          <div className="flex-1 bg-slate-950">
            <CodeStudio />
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="flex-1 bg-slate-950">
            <ArchitectureBlueprint />
          </div>
        )}

        {activeTab === 'apk' && (
          <div className="flex-1 bg-slate-950">
            <ApkBuildCenter locale={locale} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          MajidTech Exam Grading • Bilingual Arabic & English Mobile AI Architecture • Flutter 3.19+ • Google Generative AI (<code className="text-emerald-400">gemini-1.5-flash</code>) • SQLite (<code className="text-emerald-400">sqflite</code>)
        </p>
      </footer>
    </div>
  );
}
