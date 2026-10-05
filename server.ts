import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Serve public static assets (including downloads and APK files)
const publicDir = path.resolve(__dirname, 'public');
app.use(express.static(publicDir));

// Dedicated endpoint to download the real, compiled, signed Android APK
app.get(['/api/download-apk', '/downloads/majidtech-exam-grading-v1.1.0.apk'], (_req, res) => {
  const apkPath = path.resolve(publicDir, 'downloads', 'majidtech-exam-grading-v1.1.0.apk');
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename="majidtech-exam-grading-v1.1.0.apk"');
  res.sendFile(apkPath, (err) => {
    if (err) {
      console.error('Error sending APK file:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download APK file' });
      }
    }
  });
});

// Initialize GoogleGenAI client (telemetry header included)
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Route: Scan Master Key
app.post('/api/scan-master-key', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    if (!ai) {
      // Mock response if Gemini API key is not present
      return res.json({
        exam_title: "Biology 101 Midterm Examination",
        total_questions: 6,
        questions: [
          {
            question_number: 1,
            type: "MCQ",
            correct_answer: "B",
            points: 2.0
          },
          {
            question_number: 2,
            type: "MCQ",
            correct_answer: "C",
            points: 2.0
          },
          {
            question_number: 3,
            type: "TRUE_FALSE",
            correct_answer: "True",
            points: 1.5
          },
          {
            question_number: 4,
            type: "TRUE_FALSE",
            correct_answer: "False",
            points: 1.5
          },
          {
            question_number: 5,
            type: "FILL_IN_BLANK",
            correct_answer: "Mitochondria",
            points: 3.0
          },
          {
            question_number: 6,
            type: "FILL_IN_BLANK",
            correct_answer: "Photosynthesis",
            points: 3.0
          }
        ]
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        },
        {
          text: `You are an automated grading vision assistant. Inspect this Master Key exam sheet. 
Extract the exam title, total number of questions, question numbers, question types ('MCQ', 'TRUE_FALSE', or 'FILL_IN_BLANK'), correct answers, and points per question. 
Output strictly valid JSON matching the requested schema.`,
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            exam_title: { type: Type.STRING },
            total_questions: { type: Type.INTEGER },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question_number: { type: Type.INTEGER },
                  type: { 
                    type: Type.STRING,
                    description: "Must be 'MCQ', 'TRUE_FALSE', or 'FILL_IN_BLANK'"
                  },
                  correct_answer: { type: Type.STRING },
                  points: { type: Type.NUMBER },
                },
                required: ['question_number', 'type', 'correct_answer', 'points'],
              },
            },
          },
          required: ['exam_title', 'total_questions', 'questions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error scanning master key:', error);
    return res.status(500).json({ error: error.message || 'Failed to scan master key' });
  }
});

// API Route: Scan & Grade Student Paper
app.post('/api/grade-student-paper', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', examTemplate, language = 'en', idMode = 'BOTH' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Student paper image is required' });
    }

    const isArabic = language === 'ar' || (examTemplate?.language === 'ar');

    if (!ai) {
      // Mock response if Gemini API key is not configured
      return res.json({
        secret_number: isArabic ? "٨٤٩٢" : "SEC-8492",
        student_name: isArabic ? "طارق المنصوري" : "Tariq Al-Mansoor",
        ocr_confidence: 0.96,
        total_score_earned: 11.5,
        total_max_score: 13.0,
        evaluations: [
          {
            question_number: 1,
            student_answer: isArabic ? "ب" : "B",
            correct_answer: isArabic ? "ب" : "B",
            is_correct: true,
            points_awarded: 2.0,
            feedback_note: isArabic ? "إجابة صحيحة (الخيار ب)" : "Correct choice selected"
          },
          {
            question_number: 2,
            student_answer: isArabic ? "ج" : "C",
            correct_answer: isArabic ? "ج" : "C",
            is_correct: true,
            points_awarded: 2.0,
            feedback_note: isArabic ? "إجابة صحيحة (الخيار ج)" : "Correct choice selected"
          },
          {
            question_number: 3,
            student_answer: isArabic ? "صح" : "T",
            correct_answer: isArabic ? "صح" : "True",
            is_correct: true,
            points_awarded: 1.5,
            feedback_note: isArabic ? "تم التعرف على 'صح' بنجاح" : "Recognized 'T' as True"
          },
          {
            question_number: 4,
            student_answer: isArabic ? "صح" : "T",
            correct_answer: isArabic ? "خطأ" : "False",
            is_correct: false,
            points_awarded: 0.0,
            feedback_note: isArabic ? "حدد الطالب 'صح' بينما الإجابة النموذجية هي 'خطأ'" : "Student marked 'T' but correct is 'False'"
          },
          {
            question_number: 5,
            student_answer: isArabic ? "كلوروفيل" : "mitocondria",
            correct_answer: isArabic ? "كلوروفيل" : "Mitochondria",
            is_correct: true,
            points_awarded: 3.0,
            feedback_note: isArabic ? "إجابة دلالية صحيحة بخط اليد" : "Semantically correct with minor phonetic misspelling"
          },
          {
            question_number: 6,
            student_answer: isArabic ? "جين" : "Photosynthesis",
            correct_answer: isArabic ? "جين" : "Photosynthesis",
            is_correct: true,
            points_awarded: 3.0,
            feedback_note: isArabic ? "تطابق تام للمصطلح العلمي" : "Exact match handwritten word"
          }
        ]
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const prompt = `You are a high-speed bilingual exam grading vision AI supporting English and Arabic.
The active ID extraction mode is: "${idMode}".
Language context: "${isArabic ? 'Arabic (العربية)' : 'English'}".
Master Key exam template:
${JSON.stringify(examTemplate, null, 2)}

Analyze this student paper image:
1. STUDENT IDENTIFICATION:
   - If ID mode is "SECRET_NUMBER" or "BOTH": Locate handwritten digits (support Western 0123456789 and Eastern Arabic numerals ٠١٢٣٤٥٦٧٨٩). Set "secret_number".
   - If ID mode is "STUDENT_NAME" or "BOTH": Locate handwritten student name in Arabic script or Latin script. Set "student_name".
   - Set ocr_confidence (0.0 to 1.0) representing handwriting legibility.
2. ANSWER EVALUATION:
   - For Multiple Choice:
     * English: A, B, C, D (circled or written)
     * Arabic: أ, ب, ج, د (circled or written)
   - For True/False:
     * English: 'T', 'F', 'True', 'False', or checkmark
     * Arabic: 'صح', 'خطأ', or checkmark/X
   - For Fill-in-the-Blank:
     * Read the handwritten word (Arabic or English). Compare semantically with correct answer.
     * Allow minor spelling/phonetic errors (e.g. missing hamza/ta marbuta in Arabic, or letter transposition).
3. TALLY:
   - Calculate total_score_earned and total_max_score based on points.
   - Provide brief feedback_note in ${isArabic ? 'Arabic' : 'English'}.
4. Output strictly valid JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        },
        { text: prompt },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            secret_number: { type: Type.STRING },
            student_name: { type: Type.STRING },
            ocr_confidence: { type: Type.NUMBER },
            total_score_earned: { type: Type.NUMBER },
            total_max_score: { type: Type.NUMBER },
            evaluations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question_number: { type: Type.INTEGER },
                  student_answer: { type: Type.STRING },
                  correct_answer: { type: Type.STRING },
                  is_correct: { type: Type.BOOLEAN },
                  points_awarded: { type: Type.NUMBER },
                  feedback_note: { type: Type.STRING },
                },
                required: [
                  'question_number',
                  'student_answer',
                  'correct_answer',
                  'is_correct',
                  'points_awarded',
                  'feedback_note',
                ],
              },
            },
          },
          required: [
            'ocr_confidence',
            'total_score_earned',
            'total_max_score',
            'evaluations',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error grading student paper:', error);
    return res.status(500).json({ error: error.message || 'Failed to grade paper' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`AutoGrade AI server running on port ${PORT}`);
  });
}

startServer();
