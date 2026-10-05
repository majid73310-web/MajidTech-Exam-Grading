export interface GradedSubmission {
  id: string;
  secretNumber?: string;
  studentName?: string;
  totalScoreEarned: number;
  totalMaxScore: number;
  ocrConfidence: number;
  scannedAt: string;
  evaluations: Array<{
    question_number: number;
    student_answer: string;
    correct_answer: string;
    is_correct: boolean;
    points_awarded: number;
    feedback_note: string;
  }>;
}

export function exportSubmissionsToCsv(
  examTitle: string,
  submissions: GradedSubmission[],
  totalQuestions: number,
  language: 'en' | 'ar' = 'en'
): void {
  const isAr = language === 'ar';

  const headers = isAr
    ? [
        'رقم الطالب السري',
        'اسم الطالب',
        'الدرجة المكتسبة',
        'الدرجة القصوى',
        'النسبة المئوية (%)',
        'التقدير',
      ]
    : [
        'Secret Number',
        'Student Name',
        'Total Score',
        'Max Score',
        'Percentage (%)',
        'Grade Letter',
      ];

  for (let i = 1; i <= totalQuestions; i++) {
    headers.push(isAr ? `سؤال ${i}` : `Q${i} Mark`);
  }
  headers.push(isAr ? 'وقت المسح الضوئي' : 'Scanned Timestamp');

  const rows = [headers.join(',')];

  for (const sub of submissions) {
    const pct = sub.totalMaxScore > 0 ? (sub.totalScoreEarned / sub.totalMaxScore) * 100 : 0;
    let letter = 'F';
    let arLetter = 'راسب';
    if (pct >= 90) { letter = 'A'; arLetter = 'ممتاز (أ)'; }
    else if (pct >= 80) { letter = 'B'; arLetter = 'جيد جداً (ب)'; }
    else if (pct >= 70) { letter = 'C'; arLetter = 'جيد (ج)'; }
    else if (pct >= 60) { letter = 'D'; arLetter = 'مقبول (د)'; }

    const row = [
      `"${sub.secretNumber || (isAr ? 'غير محدد' : 'N/A')}"`,
      `"${sub.studentName || (isAr ? 'غير محدد' : 'N/A')}"`,
      sub.totalScoreEarned.toFixed(1),
      sub.totalMaxScore.toFixed(1),
      pct.toFixed(1),
      isAr ? `"${arLetter}"` : letter,
    ];

    for (let q = 1; q <= totalQuestions; q++) {
      const evalItem = sub.evaluations.find(e => e.question_number === q);
      row.push((evalItem?.points_awarded ?? 0).toFixed(1));
    }

    row.push(`"${sub.scannedAt}"`);
    rows.push(row.join(','));
  }

  // Prepend UTF-8 BOM (\uFEFF) so Excel properly renders Arabic characters
  const csvContent = '\uFEFF' + rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeTitle = examTitle.replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_');
  a.download = `${safeTitle}_gradebook.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
