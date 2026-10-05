import React from 'react';
import {
  Layers,
  Database,
  Cpu,
  Eye,
  Camera,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  GitBranch
} from 'lucide-react';

export const ArchitectureBlueprint: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Blueprint Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 text-emerald-400 mb-2">
          <Layers className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white tracking-tight">System Architecture & Technical Specifications</h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive blueprint detailing data pipelines, SQLite ER schema, Gemini 1.5 Flash Vision structured contracts, and Android lifecycle optimizations for the AutoGrade mobile scanner.
        </p>
      </div>

      {/* 1. END-TO-END DATAFLOW PIPELINE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>End-to-End AI Vision & Storage Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Step 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs mb-2">
                1
              </div>
              <h4 className="font-bold text-white text-xs mb-1">Camera Capture</h4>
              <p className="text-[11px] text-slate-400">
                Custom viewport with <code className="text-emerald-400">CameraOverlayPainter</code> crops the A4 exam frame and fires hardware haptic confirmation.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-emerald-400 font-mono">
              ResolutionPreset.veryHigh
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs mb-2">
                2
              </div>
              <h4 className="font-bold text-white text-xs mb-1">Gemini Vision AI</h4>
              <p className="text-[11px] text-slate-400">
                Transmits compressed JPEG bytes with Master Key JSON context to <code className="text-teal-400">gemini-1.5-flash</code>.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-teal-400 font-mono">
              responseSchema Enforced
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <h4 className="font-bold text-white text-xs mb-1">OCR & Evaluation</h4>
              <p className="text-[11px] text-slate-400">
                Simultaneously reads handwritten Secret ID, checks MCQ/TF marks, and evaluates fill-in-blank with semantic typo tolerance.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-blue-400 font-mono">
              Multi-Modal Parsing
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-2">
                4
              </div>
              <h4 className="font-bold text-white text-xs mb-1">Teacher Review UI</h4>
              <p className="text-[11px] text-slate-400">
                Displays highlighted Secret Number with confidence meter, editable text input, and quick "Save & Next Student" button.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-amber-400 font-mono">
              Human-in-the-Loop
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs mb-2">
                5
              </div>
              <h4 className="font-bold text-white text-xs mb-1">SQLite & Export</h4>
              <p className="text-[11px] text-slate-400">
                ACID transaction persists submission and question evaluations in SQLite. Gradebook exports styled .XLSX and .CSV via Android share intent.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-indigo-400 font-mono">
              sqflite + share_plus
            </div>
          </div>
        </div>
      </div>

      {/* 2. SQLITE DATABASE SCHEMA & ER DIAGRAM */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>SQLite Database Schema (sqflite v1)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Table 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="font-bold text-emerald-400">TABLE exam_templates</span>
              <span className="text-[10px] text-slate-500">Root Entity</span>
            </div>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <div className="text-amber-400">id INTEGER PRIMARY KEY AUTOINCREMENT</div>
              <div>exam_title TEXT NOT NULL</div>
              <div>total_questions INTEGER NOT NULL</div>
              <div>total_max_score REAL NOT NULL</div>
              <div>created_at TEXT NOT NULL</div>
            </div>
          </div>

          {/* Table 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="font-bold text-emerald-400">TABLE template_questions</span>
              <span className="text-[10px] text-slate-500">1:N with exam_templates</span>
            </div>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <div className="text-amber-400">id INTEGER PRIMARY KEY AUTOINCREMENT</div>
              <div className="text-teal-400">template_id INTEGER (FK -&gt; exam_templates.id)</div>
              <div>question_number INTEGER NOT NULL</div>
              <div>type TEXT NOT NULL ('MCQ'|'TRUE_FALSE'|'FILL_IN_BLANK')</div>
              <div>correct_answer TEXT NOT NULL</div>
              <div>points REAL NOT NULL</div>
            </div>
          </div>

          {/* Table 3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="font-bold text-teal-400">TABLE student_submissions</span>
              <span className="text-[10px] text-slate-500">1:N with exam_templates</span>
            </div>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <div className="text-amber-400">id INTEGER PRIMARY KEY AUTOINCREMENT</div>
              <div className="text-teal-400">template_id INTEGER (FK -&gt; exam_templates.id)</div>
              <div className="text-emerald-400 font-bold">secret_number TEXT NOT NULL</div>
              <div>total_score_earned REAL NOT NULL</div>
              <div>total_max_score REAL NOT NULL</div>
              <div>ocr_confidence REAL NOT NULL</div>
              <div>is_reviewed INTEGER NOT NULL DEFAULT 1</div>
              <div>scanned_at TEXT NOT NULL</div>
            </div>
          </div>

          {/* Table 4 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="font-bold text-teal-400">TABLE question_evaluations</span>
              <span className="text-[10px] text-slate-500">1:N with student_submissions</span>
            </div>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <div className="text-amber-400">id INTEGER PRIMARY KEY AUTOINCREMENT</div>
              <div className="text-teal-400">submission_id INTEGER (FK -&gt; student_submissions.id)</div>
              <div>question_number INTEGER NOT NULL</div>
              <div>student_answer TEXT NOT NULL</div>
              <div>correct_answer TEXT NOT NULL</div>
              <div>is_correct INTEGER NOT NULL (0|1)</div>
              <div>points_awarded REAL NOT NULL</div>
              <div>feedback_note TEXT</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. GEMINI AI PROMPTING & STRUCTURED JSON CONTRACTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span>Gemini Vision AI Structured JSON Contracts</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Master Key Schema */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-emerald-400 block mb-2">
              1. Master Key Schema (GenerationConfig responseSchema)
            </span>
            <pre className="text-[10px] font-mono text-slate-300 bg-slate-900/80 p-3 rounded-lg overflow-x-auto leading-relaxed border border-slate-800">
{`{
  "exam_title": "Biology 101 Midterm",
  "total_questions": 6,
  "questions": [
    {
      "question_number": 1,
      "type": "MCQ",
      "correct_answer": "B",
      "points": 2.0
    },
    {
      "question_number": 5,
      "type": "FILL_IN_BLANK",
      "correct_answer": "Chlorophyll",
      "points": 3.0
    }
  ]
}`}
            </pre>
          </div>

          {/* Student Grading Schema */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-teal-400 block mb-2">
              2. Student Paper Grading Schema (with OCR & Semantic Tol.)
            </span>
            <pre className="text-[10px] font-mono text-slate-300 bg-slate-900/80 p-3 rounded-lg overflow-x-auto leading-relaxed border border-slate-800">
{`{
  "secret_number": "SEC-8492",
  "ocr_confidence": 0.98,
  "total_score_earned": 13.0,
  "total_max_score": 13.0,
  "evaluations": [
    {
      "question_number": 5,
      "student_answer": "clorophyl",
      "correct_answer": "Chlorophyll",
      "is_correct": true,
      "points_awarded": 3.0,
      "feedback_note": "Semantic match: accepted phonetic misspelling 'clorophyl'"
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* 4. PRODUCTION ANDROID & FLUTTER OPTIMIZATIONS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Production Android & Mobile Architecture Best Practices</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white">Camera Lifecycle & Memory</h4>
            <p className="text-slate-400 text-[11px]">
              Implements <code className="text-emerald-400">WidgetsBindingObserver</code> to cleanly dispose the <code className="text-emerald-400">CameraController</code> when the app enters background/inactive state to prevent memory leaks and camera lockouts on Android devices.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white">Semantic Typo Tolerance</h4>
            <p className="text-slate-400 text-[11px]">
              Fill-in-the-blank grading evaluates handwritten phonetic spelling (e.g. "mitocondria" or "photosynthesys") against biological meaning without requiring hardcoded regex variations.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white">Deterministic JSON Guarantees</h4>
            <p className="text-slate-400 text-[11px]">
              Uses <code className="text-emerald-400">temperature: 0.1</code> and native SDK <code className="text-emerald-400">Schema.object()</code> validation so output always matches the Dart data models reliably without markdown wrap formatting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
