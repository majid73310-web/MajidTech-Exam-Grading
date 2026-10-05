export interface FlutterFile {
  path: string;
  filename: string;
  category: 'models' | 'services' | 'screens' | 'widgets' | 'config' | 'l10n' | 'root';
  description: string;
  language: string;
  code: string;
}

export const FLUTTER_CODEBASE: FlutterFile[] = [
  {
    path: '.github/workflows/build_apk.yml',
    filename: 'build_apk.yml',
    category: 'config',
    description: 'Automated GitHub Actions CI workflow to build release APK (app-release.apk) on every push.',
    language: 'yaml',
    code: `name: Build Android Release APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    name: Build APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'gradle'

      - name: Set up Flutter SDK
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.19.6'
          channel: 'stable'
          cache: true

      - name: Get Flutter dependencies
        run: flutter pub get

      - name: Build Android Release APK
        run: flutter build apk --release --split-per-abi=false

      - name: Upload Release APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: MajidTech-Exam-Grading-APK
          path: build/app/outputs/flutter-apk/app-release.apk
          if-no-files-found: error
          retention-days: 14
`
  },
  {
    path: 'pubspec.yaml',
    filename: 'pubspec.yaml',
    category: 'config',
    description: 'Flutter project dependencies including google_generative_ai, flutter_localizations, intl, sqflite, camera, and excel.',
    language: 'yaml',
    code: `name: majidtech_exam_grading
description: "MajidTech Exam Grading - AI-Powered Bilingual Automated Exam Scanner & Grading App for Android"
publish_to: 'none'
version: 1.1.0+2

environment:
  sdk: '>=3.3.0 <4.0.0'
  flutter: ">=3.19.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # State Management & DI
  flutter_riverpod: ^2.5.1

  # Vision & AI SDK (Gemini 1.5 Flash)
  google_generative_ai: ^0.4.6

  # Local SQLite Database
  sqflite: ^2.3.3+1
  path: ^1.9.0

  # Camera, Haptics & Native Hardware
  camera: ^0.10.5+9
  permission_handler: ^11.3.1
  vibration: ^2.0.0

  # Internationalization & Storage
  intl: ^0.19.0
  path_provider: ^2.1.3
  csv: ^6.0.0
  excel: ^4.0.3
  share_plus: ^9.0.0

  # Typography & UI
  google_fonts: ^6.2.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  generate: true
  uses-material-design: true
  assets:
    - assets/sample_keys/
    - assets/templates/
`
  },
  {
    path: 'android/app/build.gradle',
    filename: 'build.gradle',
    category: 'config',
    description: 'Android app Gradle configuration with package ID com.majidtech.examgrading, signing configs, and release optimization.',
    language: 'groovy',
    code: `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
if (flutterVersionCode == null) {
    flutterVersionCode = '2'
}

def flutterVersionName = localProperties.getProperty('flutter.versionName')
if (flutterVersionName == null) {
    flutterVersionName = '1.1.0'
}

android {
    namespace "com.majidtech.examgrading"
    compileSdkVersion 34
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    sourceSets {
        main.java.srcDirs += 'src/main/kotlin'
    }

    defaultConfig {
        applicationId "com.majidtech.examgrading"
        minSdkVersion 24
        targetSdkVersion 34
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
        multiDexEnabled true
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug // Uses debug key for rapid testing; replace with production keystore
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

flutter {
    source '../..'
}
`
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    filename: 'AndroidManifest.xml',
    category: 'config',
    description: 'Android manifest with MajidTech Exam Grading branding and hardware camera permissions.',
    language: 'xml',
    code: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.majidtech.examgrading">

    <!-- Hardware Camera Permissions -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="true" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
    <uses-feature android:name="android.hardware.camera.flash" android:required="false" />

    <!-- Internet for Gemini Generative AI SDK -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Vibration for tactile scan confirmation -->
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:label="MajidTech Exam Grading"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>
`
  },
  {
    path: 'lib/l10n/app_en.arb',
    filename: 'app_en.arb',
    category: 'l10n',
    description: 'English localization bundle defining all strings and OCR labels.',
    language: 'json',
    code: `{
  "@@locale": "en",
  "appTitle": "AutoGrade AI",
  "activeAnswerKey": "Active Answer Key",
  "batchScanner": "Batch Camera Scanner",
  "classGradebook": "Class Gradebook",
  "reviewPaper": "Review & Verify Paper",
  "studentSecretNumber": "Student Secret Number",
  "studentName": "Student Full Name",
  "ocrConfidence": "{confidence}% OCR Confidence",
  "@ocrConfidence": {
    "placeholders": {
      "confidence": { "type": "int" }
    }
  },
  "editPrompt": "Tap to edit if handwriting was ambiguous",
  "totalScore": "Total Score Earned",
  "gradeLetter": "Grade",
  "questionBreakdown": "Question Breakdown",
  "saveAndNext": "Save & Next Student",
  "discard": "Discard",
  "batchGradedCount": "Batch Graded: {count}",
  "@batchGradedCount": {
    "placeholders": {
      "count": { "type": "int" }
    }
  },
  "alignPaper": "Align sheet inside frame • Keep flat & well-lit",
  "idMode": "Student Identification Mode",
  "modeSecretOnly": "Secret Number Only",
  "modeNameOnly": "Student Name Only",
  "modeBoth": "Both (Secret ID & Name)",
  "exportCsv": "Download CSV",
  "exportXlsx": "Export XLSX",
  "interventionAlerts": "Teacher Intervention Watchlist",
  "passRate": "Pass Rate"
}`
  },
  {
    path: 'lib/l10n/app_ar.arb',
    filename: 'app_ar.arb',
    category: 'l10n',
    description: 'Arabic localization bundle with full Right-to-Left (RTL) phrasing.',
    language: 'json',
    code: `{
  "@@locale": "ar",
  "appTitle": "أوتو جريد للذكاء الاصطناعي",
  "activeAnswerKey": "نموذج الإجابة المعتمد",
  "batchScanner": "الماسح الضوئي الذكي",
  "classGradebook": "سجل درجات الفصل",
  "reviewPaper": "مراجعة وتأكيد تصحيح الورقة",
  "studentSecretNumber": "رقم الجلوس السري للطالب",
  "studentName": "اسم الطالب الكامل",
  "ocrConfidence": "{confidence}٪ دقة القراءة الآلية",
  "@ocrConfidence": {
    "placeholders": {
      "confidence": { "type": "int" }
    }
  },
  "editPrompt": "اضغط للتعديل اليدوي في حال وجود غموض بالخط",
  "totalScore": "الدرجة الكلية المكتسبة",
  "gradeLetter": "التقدير",
  "questionBreakdown": "تفصيل إجابات الأسئلة",
  "saveAndNext": "حفظ والانتقال للطالب التالي",
  "discard": "تجاهل الورقة",
  "batchGradedCount": "تم تصحيح: {count} أوراق",
  "@batchGradedCount": {
    "placeholders": {
      "count": { "type": "int" }
    }
  },
  "alignPaper": "حاذِ ورقة الاختبار داخل الإطار • حافظ على استواء الورقة",
  "idMode": "نمط التعرف على هوية الطالب",
  "modeSecretOnly": "رقم الجلوس السري فقط",
  "modeNameOnly": "اسم الطالب بخط اليد فقط",
  "modeBoth": "كلاهما (رقم الجلوس والاسم)",
  "exportCsv": "تصدير كملف CSV",
  "exportXlsx": "تصدير كملف Excel XLSX",
  "interventionAlerts": "قائمة التدخل والدعم التعليمي العاجل",
  "passRate": "نسبة النجاح"
}`
  },
  {
    path: 'lib/providers/locale_provider.dart',
    filename: 'locale_provider.dart',
    category: 'services',
    description: 'State provider for toggling between Arabic (RTL) and English (LTR).',
    language: 'dart',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final localeProvider = StateNotifierProvider<LocaleNotifier, Locale>((ref) {
  return LocaleNotifier();
});

class LocaleNotifier extends StateNotifier<Locale> {
  LocaleNotifier() : super(const Locale('en'));

  void setLocale(Locale newLocale) {
    if (newLocale.languageCode == 'ar' || newLocale.languageCode == 'en') {
      state = newLocale;
    }
  }

  void toggleLocale() {
    state = state.languageCode == 'en' ? const Locale('ar') : const Locale('en');
  }

  bool get isArabic => state.languageCode == 'ar';
  TextDirection get textDirection => isArabic ? TextDirection.rtl : TextDirection.ltr;
}
`
  },
  {
    path: 'lib/models/id_mode.dart',
    filename: 'id_mode.dart',
    category: 'models',
    description: 'Identification mode enum supporting Secret Number, Student Name, or Both.',
    language: 'dart',
    code: `enum IdMode {
  secretNumber,
  studentName,
  both;

  static IdMode fromString(String val) {
    switch (val.toUpperCase()) {
      case 'SECRET_NUMBER':
      case 'SECRETNUMBER':
        return IdMode.secretNumber;
      case 'STUDENT_NAME':
      case 'STUDENTNAME':
      case 'NAME':
        return IdMode.studentName;
      case 'BOTH':
      default:
        return IdMode.both;
    }
  }

  String toDbString() {
    switch (this) {
      case IdMode.secretNumber:
        return 'SECRET_NUMBER';
      case IdMode.studentName:
        return 'STUDENT_NAME';
      case IdMode.both:
        return 'BOTH';
    }
  }

  String getLabel(bool isArabic) {
    if (isArabic) {
      switch (this) {
        case IdMode.secretNumber:
          return 'رقم الجلوس السري فقط';
        case IdMode.studentName:
          return 'اسم الطالب بخط اليد فقط';
        case IdMode.both:
          return 'كلاهما (الرقم والاسم)';
      }
    } else {
      switch (this) {
        case IdMode.secretNumber:
          return 'Secret Number Only';
        case IdMode.studentName:
          return 'Student Name Only';
        case IdMode.both:
          return 'Both (Secret ID & Name)';
      }
    }
  }
}
`
  },
  {
    path: 'lib/models/exam_template.dart',
    filename: 'exam_template.dart',
    category: 'models',
    description: 'Master Key Exam Template model with idMode and language properties.',
    language: 'dart',
    code: `import 'id_mode.dart';
import 'question_item.dart';

class ExamTemplate {
  final int? id;
  final String examTitle;
  final String language; // 'en' or 'ar'
  final IdMode idMode;
  final int totalQuestions;
  final double totalMaxScore;
  final DateTime createdAt;
  final List<QuestionItem> questions;

  const ExamTemplate({
    this.id,
    required this.examTitle,
    this.language = 'en',
    this.idMode = IdMode.both,
    required this.totalQuestions,
    required this.totalMaxScore,
    required this.createdAt,
    required this.questions,
  });

  bool get isArabic => language == 'ar';

  factory ExamTemplate.fromGeminiJson(Map<String, dynamic> json, {IdMode idMode = IdMode.both, String language = 'en'}) {
    final rawQuestions = json['questions'] as List<dynamic>? ?? [];
    final parsedQuestions = rawQuestions
        .map((q) => QuestionItem.fromJson(q as Map<String, dynamic>))
        .toList();

    parsedQuestions.sort((a, b) => a.questionNumber.compareTo(b.questionNumber));

    final totalPoints = parsedQuestions.fold<double>(
      0.0,
      (sum, q) => sum + q.points,
    );

    return ExamTemplate(
      examTitle: (json['exam_title'] as String?)?.trim() ?? (language == 'ar' ? 'اختبار بدون عنوان' : 'Untitled Exam'),
      language: language,
      idMode: idMode,
      totalQuestions: json['total_questions'] as int? ?? parsedQuestions.length,
      totalMaxScore: totalPoints,
      createdAt: DateTime.now(),
      questions: parsedQuestions,
    );
  }

  Map<String, dynamic> toDbMap() => {
    if (id != null) 'id': id,
    'exam_title': examTitle,
    'language': language,
    'id_mode': idMode.toDbString(),
    'total_questions': totalQuestions,
    'total_max_score': totalMaxScore,
    'created_at': createdAt.toIso8601String(),
  };

  factory ExamTemplate.fromDbMap(Map<String, dynamic> map, List<QuestionItem> questions) =>
      ExamTemplate(
        id: map['id'] as int,
        examTitle: map['exam_title'] as String,
        language: map['language'] as String? ?? 'en',
        idMode: IdMode.fromString(map['id_mode'] as String? ?? 'BOTH'),
        totalQuestions: map['total_questions'] as int,
        totalMaxScore: (map['total_max_score'] as num).toDouble(),
        createdAt: DateTime.parse(map['created_at'] as String),
        questions: questions,
      );

  Map<String, dynamic> toGeminiContextJson() => {
    'exam_title': examTitle,
    'language': language,
    'id_mode': idMode.toDbString(),
    'total_questions': totalQuestions,
    'questions': questions.map((q) => q.toJson()).toList(),
  };
}
`
  },
  {
    path: 'lib/models/grading_result.dart',
    filename: 'grading_result.dart',
    category: 'models',
    description: 'AI Evaluation result supporting both nullable secret_number and student_name.',
    language: 'dart',
    code: `class GradingEvaluation {
  final int? id;
  final int? submissionId;
  final int questionNumber;
  final String studentAnswer;
  final String correctAnswer;
  final bool isCorrect;
  final double pointsAwarded;
  final String feedbackNote;

  const GradingEvaluation({
    this.id,
    this.submissionId,
    required this.questionNumber,
    required this.studentAnswer,
    required this.correctAnswer,
    required this.isCorrect,
    required this.pointsAwarded,
    required this.feedbackNote,
  });

  factory GradingEvaluation.fromJson(Map<String, dynamic> json) => GradingEvaluation(
    questionNumber: json['question_number'] as int,
    studentAnswer: (json['student_answer'] ?? '').toString().trim(),
    correctAnswer: (json['correct_answer'] ?? '').toString().trim(),
    isCorrect: json['is_correct'] as bool? ?? false,
    pointsAwarded: (json['points_awarded'] as num?)?.toDouble() ?? 0.0,
    feedbackNote: (json['feedback_note'] ?? '').toString(),
  );

  Map<String, dynamic> toDbMap(int parentSubmissionId) => {
    if (id != null) 'id': id,
    'submission_id': parentSubmissionId,
    'question_number': questionNumber,
    'student_answer': studentAnswer,
    'correct_answer': correctAnswer,
    'is_correct': isCorrect ? 1 : 0,
    'points_awarded': pointsAwarded,
    'feedback_note': feedbackNote,
  };

  factory GradingEvaluation.fromDbMap(Map<String, dynamic> map) => GradingEvaluation(
    id: map['id'] as int,
    submissionId: map['submission_id'] as int,
    questionNumber: map['question_number'] as int,
    studentAnswer: map['student_answer'] as String,
    correctAnswer: map['correct_answer'] as String,
    isCorrect: (map['is_correct'] as int) == 1,
    pointsAwarded: (map['points_awarded'] as num).toDouble(),
    feedbackNote: map['feedback_note'] as String? ?? '',
  );

  GradingEvaluation copyWith({
    String? studentAnswer,
    bool? isCorrect,
    double? pointsAwarded,
    String? feedbackNote,
  }) => GradingEvaluation(
    id: id,
    submissionId: submissionId,
    questionNumber: questionNumber,
    studentAnswer: studentAnswer ?? this.studentAnswer,
    correctAnswer: correctAnswer,
    isCorrect: isCorrect ?? this.isCorrect,
    pointsAwarded: pointsAwarded ?? this.pointsAwarded,
    feedbackNote: feedbackNote ?? this.feedbackNote,
  );
}

class GradingResult {
  final String? secretNumber;
  final String? studentName;
  final double ocrConfidence;
  final double totalScoreEarned;
  final double totalMaxScore;
  final List<GradingEvaluation> evaluations;
  final String? imagePath;

  const GradingResult({
    this.secretNumber,
    this.studentName,
    required this.ocrConfidence,
    required this.totalScoreEarned,
    required this.totalMaxScore,
    required this.evaluations,
    this.imagePath,
  });

  factory GradingResult.fromJson(Map<String, dynamic> json, {String? imagePath}) {
    final rawEvaluations = json['evaluations'] as List<dynamic>? ?? [];
    final evaluations = rawEvaluations
        .map((e) => GradingEvaluation.fromJson(e as Map<String, dynamic>))
        .toList();
    evaluations.sort((a, b) => a.questionNumber.compareTo(b.questionNumber));

    return GradingResult(
      secretNumber: json['secret_number']?.toString().trim(),
      studentName: json['student_name']?.toString().trim(),
      ocrConfidence: (json['ocr_confidence'] as num?)?.toDouble() ?? 0.85,
      totalScoreEarned: (json['total_score_earned'] as num?)?.toDouble() ?? 0.0,
      totalMaxScore: (json['total_max_score'] as num?)?.toDouble() ?? 0.0,
      evaluations: evaluations,
      imagePath: imagePath,
    );
  }

  String getDisplayIdentifier(bool isArabic) {
    if (studentName != null && studentName!.isNotEmpty && secretNumber != null && secretNumber!.isNotEmpty) {
      return '$studentName ($secretNumber)';
    }
    if (studentName != null && studentName!.isNotEmpty) return studentName!;
    if (secretNumber != null && secretNumber!.isNotEmpty) return secretNumber!;
    return isArabic ? 'طالب مجهول' : 'Unknown Student';
  }
}
`
  },
  {
    path: 'lib/models/student_score.dart',
    filename: 'student_score.dart',
    category: 'models',
    description: 'SQLite submission record supporting both secretNumber and studentName.',
    language: 'dart',
    code: `import 'grading_result.dart';

class StudentScore {
  final int? id;
  final int templateId;
  final String? secretNumber;
  final String? studentName;
  final double totalScoreEarned;
  final double totalMaxScore;
  final double ocrConfidence;
  final bool isReviewed;
  final DateTime scannedAt;
  final List<GradingEvaluation>? evaluations;

  const StudentScore({
    this.id,
    required this.templateId,
    this.secretNumber,
    this.studentName,
    required this.totalScoreEarned,
    required this.totalMaxScore,
    required this.ocrConfidence,
    required this.isReviewed,
    required this.scannedAt,
    this.evaluations,
  });

  double get percentage =>
      totalMaxScore > 0 ? (totalScoreEarned / totalMaxScore) * 100 : 0.0;

  String get gradeLetter {
    final p = percentage;
    if (p >= 90) return 'A';
    if (p >= 80) return 'B';
    if (p >= 70) return 'C';
    if (p >= 60) return 'D';
    return 'F';
  }

  String get arabicGradeLetter {
    final p = percentage;
    if (p >= 90) return 'ممتاز (أ)';
    if (p >= 80) return 'جيد جداً (ب)';
    if (p >= 70) return 'جيد (ج)';
    if (p >= 60) return 'مقبول (د)';
    return 'راسب (هـ)';
  }

  Map<String, dynamic> toDbMap() => {
    if (id != null) 'id': id,
    'template_id': templateId,
    'secret_number': secretNumber,
    'student_name': studentName,
    'total_score_earned': totalScoreEarned,
    'total_max_score': totalMaxScore,
    'ocr_confidence': ocrConfidence,
    'is_reviewed': isReviewed ? 1 : 0,
    'scanned_at': scannedAt.toIso8601String(),
  };

  factory StudentScore.fromDbMap(Map<String, dynamic> map, [List<GradingEvaluation>? evaluations]) =>
      StudentScore(
        id: map['id'] as int,
        templateId: map['template_id'] as int,
        secretNumber: map['secret_number'] as String?,
        studentName: map['student_name'] as String?,
        totalScoreEarned: (map['total_score_earned'] as num).toDouble(),
        totalMaxScore: (map['total_max_score'] as num).toDouble(),
        ocrConfidence: (map['ocr_confidence'] as num).toDouble(),
        isReviewed: (map['is_reviewed'] as int) == 1,
        scannedAt: DateTime.parse(map['scanned_at'] as String),
        evaluations: evaluations,
      );
}
`
  },
  {
    path: 'lib/services/db_helper.dart',
    filename: 'db_helper.dart',
    category: 'services',
    description: 'SQLite database helper updated with id_mode, language, and student_name schema migration.',
    language: 'dart',
    code: `import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart' as p;
import '../models/exam_template.dart';
import '../models/question_item.dart';
import '../models/student_score.dart';
import '../models/grading_result.dart';

class DBHelper {
  static final DBHelper instance = DBHelper._init();
  static Database? _database;

  DBHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('autograde_bilingual.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = p.join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 2,
      onConfigure: (db) async {
        await db.execute('PRAGMA foreign_keys = ON');
      },
      onCreate: _createDB,
      onUpgrade: _onUpgrade,
    );
  }

  Future<void> _createDB(Database db, int version) async {
    // 1. Exam Templates Table
    await db.execute('''
      CREATE TABLE exam_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exam_title TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'en',
        id_mode TEXT NOT NULL DEFAULT 'BOTH',
        total_questions INTEGER NOT NULL,
        total_max_score REAL NOT NULL,
        created_at TEXT NOT NULL
      )
    ''');

    // 2. Template Questions Table
    await db.execute('''
      CREATE TABLE template_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template_id INTEGER NOT NULL,
        question_number INTEGER NOT NULL,
        type TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        points REAL NOT NULL,
        FOREIGN KEY (template_id) REFERENCES exam_templates(id) ON DELETE CASCADE
      )
    ''');

    // 3. Student Submissions Table
    await db.execute('''
      CREATE TABLE student_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template_id INTEGER NOT NULL,
        secret_number TEXT,
        student_name TEXT,
        total_score_earned REAL NOT NULL,
        total_max_score REAL NOT NULL,
        ocr_confidence REAL NOT NULL,
        is_reviewed INTEGER NOT NULL DEFAULT 1,
        scanned_at TEXT NOT NULL,
        FOREIGN KEY (template_id) REFERENCES exam_templates(id) ON DELETE CASCADE
      )
    ''');

    // 4. Question Evaluations Table
    await db.execute('''
      CREATE TABLE question_evaluations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        submission_id INTEGER NOT NULL,
        question_number INTEGER NOT NULL,
        student_answer TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        is_correct INTEGER NOT NULL,
        points_awarded REAL NOT NULL,
        feedback_note TEXT,
        FOREIGN KEY (submission_id) REFERENCES student_submissions(id) ON DELETE CASCADE
      )
    ''');

    await db.execute('CREATE INDEX idx_tpl_questions ON template_questions(template_id)');
    await db.execute('CREATE INDEX idx_sub_template ON student_submissions(template_id)');
    await db.execute('CREATE INDEX idx_eval_submission ON question_evaluations(submission_id)');
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    if (oldVersion < 2) {
      await db.execute("ALTER TABLE exam_templates ADD COLUMN language TEXT NOT NULL DEFAULT 'en'");
      await db.execute("ALTER TABLE exam_templates ADD COLUMN id_mode TEXT NOT NULL DEFAULT 'BOTH'");
      await db.execute("ALTER TABLE student_submissions ADD COLUMN student_name TEXT");
    }
  }

  Future<int> insertExamTemplate(ExamTemplate template) async {
    final db = await instance.database;
    return await db.transaction((txn) async {
      final templateId = await txn.insert('exam_templates', template.toDbMap());
      final batch = txn.batch();
      for (final q in template.questions) {
        batch.insert('template_questions', q.toDbMap(templateId));
      }
      await batch.commit(noResult: true);
      return templateId;
    });
  }

  Future<int> saveStudentSubmission({
    required int templateId,
    String? secretNumber,
    String? studentName,
    required double totalScoreEarned,
    required double totalMaxScore,
    required double ocrConfidence,
    required List<GradingEvaluation> evaluations,
  }) async {
    final db = await instance.database;
    return await db.transaction((txn) async {
      final submissionMap = {
        'template_id': templateId,
        'secret_number': secretNumber,
        'student_name': studentName,
        'total_score_earned': totalScoreEarned,
        'total_max_score': totalMaxScore,
        'ocr_confidence': ocrConfidence,
        'is_reviewed': 1,
        'scanned_at': DateTime.now().toIso8601String(),
      };
      final submissionId = await txn.insert('student_submissions', submissionMap);
      final batch = txn.batch();
      for (final eval in evaluations) {
        batch.insert('question_evaluations', eval.toDbMap(submissionId));
      }
      await batch.commit(noResult: true);
      return submissionId;
    });
  }

  Future<List<StudentScore>> getStudentScoresForTemplate(int templateId) async {
    final db = await instance.database;
    final submissions = await db.query(
      'student_submissions',
      where: 'template_id = ?',
      whereArgs: [templateId],
      orderBy: 'id DESC',
    );

    final scores = <StudentScore>[];
    for (final sub in submissions) {
      final subId = sub['id'] as int;
      final evalMaps = await db.query(
        'question_evaluations',
        where: 'submission_id = ?',
        whereArgs: [subId],
        orderBy: 'question_number ASC',
      );
      final evals = evalMaps.map((e) => GradingEvaluation.fromDbMap(e)).toList();
      scores.add(StudentScore.fromDbMap(sub, evals));
    }
    return scores;
  }
}
`
  },
  {
    path: 'lib/services/gemini_grading_service.dart',
    filename: 'gemini_grading_service.dart',
    category: 'services',
    description: 'Production Gemini Vision Service with bilingual Arabic/English parsing and dynamic ID mode schema.',
    language: 'dart',
    code: `import 'dart:convert';
import 'dart:typed_data';
import 'package:google_generative_ai/google_generative_ai.dart';
import '../models/exam_template.dart';
import '../models/grading_result.dart';
import '../models/id_mode.dart';

class GeminiGradingService {
  final String apiKey;
  final String modelName;
  late final GenerativeModel _visionModel;

  GeminiGradingService({
    required this.apiKey,
    this.modelName = 'gemini-1.5-flash',
  }) {
    _visionModel = GenerativeModel(
      model: modelName,
      apiKey: apiKey,
    );
  }

  /// 1. MASTER KEY SCANNING (Supports Arabic & English)
  Future<ExamTemplate> scanMasterKey(
    Uint8List imageBytes, {
    String mimeType = 'image/jpeg',
    String language = 'en',
    IdMode idMode = IdMode.both,
  }) async {
    final masterKeySchema = Schema.object(
      properties: {
        'exam_title': Schema.string(description: 'Exam title in Arabic or English'),
        'total_questions': Schema.integer(description: 'Total questions count'),
        'questions': Schema.array(
          description: 'Ordered list of answer key questions',
          items: Schema.object(
            properties: {
              'question_number': Schema.integer(description: 'Sequential number'),
              'type': Schema.enumString(
                enumValues: ['MCQ', 'TRUE_FALSE', 'FILL_IN_BLANK'],
                description: 'Format type',
              ),
              'correct_answer': Schema.string(description: 'Correct marked answer'),
              'points': Schema.number(description: 'Assigned points'),
            },
          ),
        ),
      },
    );

    final config = GenerationConfig(
      responseMimeType: 'application/json',
      responseSchema: masterKeySchema,
      temperature: 0.1,
    );

    final isArabic = language == 'ar';
    final prompt = TextPart('''
You are an expert bilingual exam grading vision assistant supporting Arabic and English.
Analyze this Master Key exam sheet:
- Language: \${isArabic ? 'Arabic (العربية)' : 'English'}.
- Extract exam title, question numbers, question types ('MCQ', 'TRUE_FALSE', or 'FILL_IN_BLANK'),
  correct marked answers (supports A/B/C/D or أ/ب/ج/د, True/False or صح/خطأ), and points.
- If points are not marked, assign default 1.0 point.
Output strictly valid JSON matching the schema.
''');

    final imagePart = DataPart(mimeType, imageBytes);
    final response = await _visionModel.generateContent(
      [Content.multi([imagePart, prompt])],
      generationConfig: config,
    );

    final responseText = response.text;
    if (responseText == null || responseText.isEmpty) {
      throw Exception('Gemini returned an empty response.');
    }

    final Map<String, dynamic> jsonMap = jsonDecode(responseText);
    return ExamTemplate.fromGeminiJson(jsonMap, idMode: idMode, language: language);
  }

  /// 2. BILINGUAL STUDENT PAPER GRADING & DYNAMIC ID EXTRACTION
  Future<GradingResult> gradeStudentPaper({
    required Uint8List imageBytes,
    required ExamTemplate template,
    String? localImagePath,
    String mimeType = 'image/jpeg',
  }) async {
    final gradingSchema = Schema.object(
      properties: {
        'secret_number': Schema.string(
          description: 'Handwritten secret number/digits (supports 0-9 and Eastern Arabic ٠-٩)',
          nullable: true,
        ),
        'student_name': Schema.string(
          description: 'Handwritten student full name in Arabic or Latin script',
          nullable: true,
        ),
        'ocr_confidence': Schema.number(description: 'OCR confidence (0.0 to 1.0)'),
        'total_score_earned': Schema.number(description: 'Sum of awarded points'),
        'total_max_score': Schema.number(description: 'Total possible points'),
        'evaluations': Schema.array(
          description: 'Itemized grading evaluation for each question',
          items: Schema.object(
            properties: {
              'question_number': Schema.integer(description: 'Question number matching key'),
              'student_answer': Schema.string(description: 'Student transcribed answer'),
              'correct_answer': Schema.string(description: 'Expected correct answer'),
              'is_correct': Schema.boolean(description: 'Correctness determination'),
              'points_awarded': Schema.number(description: 'Points awarded'),
              'feedback_note': Schema.string(description: 'Feedback justification'),
            },
          ),
        ),
      },
    );

    final config = GenerationConfig(
      responseMimeType: 'application/json',
      responseSchema: gradingSchema,
      temperature: 0.15,
    );

    final templateContext = jsonEncode(template.toGeminiContextJson());
    final isArabic = template.isArabic;
    final idModeStr = template.idMode.toDbString();

    final prompt = TextPart('''
You are an automated bilingual exam grading vision AI supporting Arabic and English.
The active ID extraction mode is: "\$idModeStr".
Language context: "\${isArabic ? 'Arabic (العربية)' : 'English'}".
Master Key exam template:
\$templateContext

INSTRUCTIONS:
1. STUDENT IDENTIFICATION:
   - If ID mode is "SECRET_NUMBER" or "BOTH": Locate handwritten digits (support Western 0-9 and Eastern Arabic numerals ٠١٢٣٤٥٦٧٨٩). Set "secret_number".
   - If ID mode is "STUDENT_NAME" or "BOTH": Locate handwritten student full name in Arabic or English script. Set "student_name".
   - Set ocr_confidence (0.0 to 1.0) representing handwriting legibility.
2. ANSWER EVALUATION:
   - MCQ:
     * English: A, B, C, D (circled or written)
     * Arabic: أ, ب, ج, د (circled or written)
   - True/False:
     * English: 'T', 'F', 'True', 'False', or checkmark
     * Arabic: 'صح', 'خطأ', or checkmark/X
   - Fill-in-the-Blank:
     * Read the handwritten word (Arabic or English). Compare semantically with correct answer.
     * ALLOW MINOR SPELLING / PHONETIC VARIANTS (e.g. missing hamza, ta marbuta in Arabic, or letter transposition).
     * Award full points if the core scientific concept is unambiguous, noting this in 'feedback_note'.
3. Output strictly valid JSON matching the schema.
''');

    final imagePart = DataPart(mimeType, imageBytes);
    final response = await _visionModel.generateContent(
      [Content.multi([imagePart, prompt])],
      generationConfig: config,
    );

    final responseText = response.text;
    if (responseText == null || responseText.isEmpty) {
      throw Exception('Gemini returned an empty grading response.');
    }

    final Map<String, dynamic> jsonMap = jsonDecode(responseText);
    return GradingResult.fromJson(jsonMap, imagePath: localImagePath);
  }
}
`
  },
  {
    path: 'lib/screens/review_grading_screen.dart',
    filename: 'review_grading_screen.dart',
    category: 'screens',
    description: 'Teacher verification UI supporting manual edits for both studentName and secretNumber with RTL/LTR support.',
    language: 'dart',
    code: `import 'package:flutter/material.dart';
import '../models/exam_template.dart';
import '../models/grading_result.dart';
import '../models/id_mode.dart';
import '../services/db_helper.dart';

class ReviewGradingScreen extends StatefulWidget {
  final ExamTemplate template;
  final GradingResult gradingResult;

  const ReviewGradingScreen({
    super.key,
    required this.template,
    required this.gradingResult,
  });

  @override
  State<ReviewGradingScreen> createState() => _ReviewGradingScreenState();
}

class _ReviewGradingScreenState extends State<ReviewGradingScreen> {
  late TextEditingController _secretNumberController;
  late TextEditingController _studentNameController;
  late List<GradingEvaluation> _evaluations;

  @override
  void initState() {
    super.initState();
    _secretNumberController = TextEditingController(text: widget.gradingResult.secretNumber ?? '');
    _studentNameController = TextEditingController(text: widget.gradingResult.studentName ?? '');
    _evaluations = List.from(widget.gradingResult.evaluations);
  }

  @override
  void dispose() {
    _secretNumberController.dispose();
    _studentNameController.dispose();
    super.dispose();
  }

  double get _currentTotalScore =>
      _evaluations.fold(0.0, (sum, item) => sum + item.pointsAwarded);

  Future<void> _saveAndNextStudent() async {
    await DBHelper.instance.saveStudentSubmission(
      templateId: widget.template.id ?? 1,
      secretNumber: _secretNumberController.text.trim().isNotEmpty ? _secretNumberController.text.trim() : null,
      studentName: _studentNameController.text.trim().isNotEmpty ? _studentNameController.text.trim() : null,
      totalScoreEarned: _currentTotalScore,
      totalMaxScore: widget.template.totalMaxScore,
      ocrConfidence: widget.gradingResult.ocrConfidence,
      evaluations: _evaluations,
    );
    if (mounted) Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    final isArabic = widget.template.isArabic;
    final confPct = (widget.gradingResult.ocrConfidence * 100).toInt();
    final idMode = widget.template.idMode;

    return Directionality(
      textDirection: isArabic ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        appBar: AppBar(
          title: Text(isArabic ? 'مراجعة وتأكيد تصحيح الورقة' : 'Review & Verify Paper'),
          actions: [
            IconButton(
              icon: const Icon(Icons.close, color: Colors.red),
              onPressed: () => Navigator.pop(context, false),
            ),
          ],
        ),
        body: Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // 1. Dynamic Student Identification Card
                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              Text(
                                isArabic ? 'بيانات هوية الطالب' : 'Student Identification',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                              Chip(
                                label: Text(isArabic ? '\$confPct٪ دقة الخط' : '\$confPct% OCR Conf'),
                                backgroundColor: confPct >= 90 ? Colors.green.shade50 : Colors.amber.shade50,
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),

                          // Handwritten Student Name field
                          if (idMode == IdMode.studentName || idMode == IdMode.both)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: TextField(
                                controller: _studentNameController,
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                                decoration: InputDecoration(
                                  labelText: isArabic ? 'اسم الطالب الكامل' : 'Student Full Name',
                                  prefixIcon: const Icon(Icons.person),
                                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                              ),
                            ),

                          // Handwritten Secret Number field
                          if (idMode == IdMode.secretNumber || idMode == IdMode.both)
                            TextField(
                              controller: _secretNumberController,
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                              decoration: InputDecoration(
                                labelText: isArabic ? 'رقم الجلوس السري (٠-٩ / 0-9)' : 'Secret Number / ID',
                                prefixIcon: const Icon(Icons.fingerprint),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  // 2. Score Banner
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        Text(
                          isArabic
                              ? 'الدرجة: \${_currentTotalScore.toStringAsFixed(1)} / \${widget.template.totalMaxScore}'
                              : 'Total: \${_currentTotalScore.toStringAsFixed(1)} / \${widget.template.totalMaxScore}',
                          style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(color: const Color(0xFF00E676), borderRadius: BorderRadius.circular(8)),
                          child: Text(
                            '\${((_currentTotalScore / widget.template.totalMaxScore) * 100).toStringAsFixed(1)}%',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 12),

                  // 3. Question Evaluations List
                  ..._evaluations.map((eval) => Card(
                    child: ListTile(
                      leading: Icon(
                        eval.isCorrect ? Icons.check_circle : Icons.cancel,
                        color: eval.isCorrect ? Colors.green : Colors.red,
                      ),
                      title: Text(
                        isArabic
                            ? 'سؤال \${eval.questionNumber}: الإجابة "\${eval.studentAnswer}" (النموذج: "\${eval.correctAnswer}")'
                            : 'Q\${eval.questionNumber}: Mark "\${eval.studentAnswer}" (Key: "\${eval.correctAnswer}")',
                      ),
                      subtitle: eval.feedbackNote.isNotEmpty ? Text(eval.feedbackNote) : null,
                      trailing: Text(
                        '+\${eval.pointsAwarded.toStringAsFixed(1)}',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  )),
                ],
              ),
            ),

            // Save & Next Button
            Padding(
              padding: const EdgeInsets.all(16),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0F172A),
                    foregroundColor: Colors.white,
                  ),
                  icon: Icon(isArabic ? Icons.arrow_back : Icons.arrow_forward),
                  label: Text(
                    isArabic ? 'حفظ والانتقال للطالب التالي' : 'Save & Next Student',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  onPressed: _saveAndNextStudent,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/services/export_service.dart',
    filename: 'export_service.dart',
    category: 'services',
    description: 'Export service generating CSV and Excel files with localized Arabic or English headers.',
    language: 'dart',
    code: `import 'dart:io';
import 'package:csv/csv.dart';
import 'package:excel/excel.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import '../models/exam_template.dart';
import '../models/student_score.dart';

class ExportService {
  /// 1. CSV Generation with Localized Headers
  static Future<String> generateCsv({
    required ExamTemplate template,
    required List<StudentScore> submissions,
  }) async {
    final isAr = template.isArabic;
    final List<List<dynamic>> rows = [];

    final header = isAr
        ? ['رقم الجلوس السري', 'اسم الطالب', 'الدرجة المكتسبة', 'الدرجة القصوى', 'النسبة المئوية (%)', 'التقدير']
        : ['Secret Number', 'Student Name', 'Total Score', 'Max Score', 'Percentage (%)', 'Grade Letter'];

    for (int i = 1; i <= template.totalQuestions; i++) {
      header.add(isAr ? 'سؤال \$i' : 'Q\$i Mark');
    }
    header.add(isAr ? 'وقت المسح' : 'Scanned Timestamp');
    rows.add(header);

    for (final sub in submissions) {
      final row = <dynamic>[
        sub.secretNumber ?? (isAr ? 'غير محدد' : 'N/A'),
        sub.studentName ?? (isAr ? 'غير محدد' : 'N/A'),
        sub.totalScoreEarned,
        sub.totalMaxScore,
        sub.percentage.toStringAsFixed(1),
        isAr ? sub.arabicGradeLetter : sub.gradeLetter,
      ];
      for (int i = 1; i <= template.totalQuestions; i++) {
        final eval = sub.evaluations?.firstWhere((e) => e.questionNumber == i, orElse: () => sub.evaluations!.first);
        row.add(eval?.pointsAwarded ?? 0.0);
      }
      row.add(sub.scannedAt.toIso8601String());
      rows.add(row);
    }

    // Include UTF-8 BOM so Excel opens Arabic correctly
    final csvContent = '\\uFEFF' + const ListToCsvConverter().convert(rows);
    final directory = await getApplicationDocumentsDirectory();
    final filePath = '\${directory.path}/\${template.examTitle}_grades.csv';
    final file = File(filePath);
    await file.writeAsString(csvContent);
    return filePath;
  }

  /// 2. Excel XLSX Generation with Localized Columns
  static Future<String> generateExcel({
    required ExamTemplate template,
    required List<StudentScore> submissions,
  }) async {
    final isAr = template.isArabic;
    final excel = Excel.createExcel();
    final sheet = excel[isAr ? 'سجل_الدرجات' : 'Gradebook'];

    final headers = isAr
        ? ['رقم الجلوس', 'اسم الطالب', 'الدرجة', 'الدرجة القصوى', 'النسبة المئوية', 'التقدير']
        : ['Secret Number', 'Student Name', 'Score Earned', 'Max Score', 'Percentage', 'Grade'];

    for (int i = 1; i <= template.totalQuestions; i++) {
      headers.add(isAr ? 'سؤال \$i' : 'Q\$i');
    }
    headers.add(isAr ? 'تاريخ المسح' : 'Scanned At');

    for (int col = 0; col < headers.length; col++) {
      sheet.cell(CellIndex.indexByColumnRow(columnIndex: col, rowIndex: 0)).value = TextCellValue(headers[col]);
    }

    int rowIdx = 1;
    for (final sub in submissions) {
      sheet.cell(CellIndex.indexByColumnRow(columnIndex: 0, rowIndex: rowIdx)).value = TextCellValue(sub.secretNumber ?? 'N/A');
      sheet.cell(CellIndex.indexByColumnRow(columnIndex: 1, rowIndex: rowIdx)).value = TextCellValue(sub.studentName ?? 'N/A');
      sheet.cell(CellIndex.indexByColumnRow(columnIndex: 2, rowIndex: rowIdx)).value = DoubleCellValue(sub.totalScoreEarned);
      sheet.cell(CellIndex.indexByColumnRow(columnIndex: 3, rowIndex: rowIdx)).value = DoubleCellValue(sub.totalMaxScore);
      sheet.cell(CellIndex.indexByColumnRow(columnIndex: 4, rowIndex: rowIdx)).value = TextCellValue('\${sub.percentage.toStringAsFixed(1)}%');
      sheet.cell(CellIndex.indexByColumnRow(columnIndex: 5, rowIndex: rowIdx)).value = TextCellValue(isAr ? sub.arabicGradeLetter : sub.gradeLetter);
      rowIdx++;
    }

    final directory = await getApplicationDocumentsDirectory();
    final filePath = '\${directory.path}/\${template.examTitle}_gradebook.xlsx';
    final bytes = excel.save();
    if (bytes != null) await File(filePath).writeAsBytes(bytes);
    return filePath;
  }

  /// 3. Native Android Share Intent
  static Future<void> shareFile(String filePath, {String subject = 'Exam Grades Export'}) async {
    final xFile = XFile(filePath);
    await Share.shareXFiles([xFile], subject: subject, text: 'AutoGrade AI Exported Grades');
  }
}
`
  },
  {
    path: 'android/build.gradle',
    filename: 'build.gradle (root)',
    category: 'config',
    description: 'Root Android build.gradle script with Gradle plugins, Kotlin version, and Maven repositories.',
    language: 'groovy',
    code: `allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.buildDir = '../build'
subprojects {
    project.buildDir = "\${rootProject.buildDir}/\${project.name}"
}
subprojects {
    project.evaluationDependsOn(':app')
}

tasks.register("clean", Delete) {
    delete rootProject.buildDir
}
`
  },
  {
    path: 'android/settings.gradle',
    filename: 'settings.gradle',
    category: 'config',
    description: 'Android Gradle settings with Flutter plugin loader and app module inclusion.',
    language: 'groovy',
    code: `pluginManagement {
    def flutterSdkPath = {
        def properties = new Properties()
        file("local.properties").withInputStream { properties.load(it) }
        def flutterSdkPath = properties.getProperty("flutter.sdk")
        assert flutterSdkPath != null : "flutter.sdk not set in local.properties"
        return flutterSdkPath
    }()

    includeBuild("\$flutterSdkPath/packages/flutter_tools/gradle")

    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

plugins {
    id "dev.flutter.flutter-plugin-loader" version "1.0.0"
    id "com.android.application" version "8.3.0" apply false
    id "org.jetbrains.kotlin.android" version "1.9.22" apply false
}

include ":app"
`
  },
  {
    path: 'android/gradle.properties',
    filename: 'gradle.properties',
    category: 'config',
    description: 'Gradle JVM and AndroidX optimization flags for rapid APK compilation.',
    language: 'properties',
    code: `org.gradle.jvmargs=-Xmx4G -XX:MaxMetaspaceSize=1G -XX:+UseParallelGC
android.useAndroidX=true
android.enableJetifier=true
android.nonTransitiveRClass=true
`
  },
  {
    path: 'android/gradle/wrapper/gradle-wrapper.properties',
    filename: 'gradle-wrapper.properties',
    category: 'config',
    description: 'Gradle distribution wrapper configuration for standalone compilation.',
    language: 'properties',
    code: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.5-all.zip
`
  },
  {
    path: 'android/app/src/main/kotlin/com/majidtech/examgrading/MainActivity.kt',
    filename: 'MainActivity.kt',
    category: 'config',
    description: 'Main Android Activity extending FlutterActivity for hardware camera lifecycle.',
    language: 'kotlin',
    code: `package com.majidtech.examgrading

import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugins.GeneratedPluginRegistrant

class MainActivity: FlutterActivity() {
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        // Hardware acceleration and plugins registered automatically
    }
}
`
  },
  {
    path: 'android/app/src/main/res/values/styles.xml',
    filename: 'styles.xml',
    category: 'config',
    description: 'Android theme styles and splash screen configurations for smooth launch.',
    language: 'xml',
    code: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="LaunchTheme" parent="@android:style/Theme.Light.NoTitleBar">
        <item name="android:windowBackground">@drawable/launch_background</item>
        <item name="android:windowFullscreen">false</item>
        <item name="android:windowDrawsSystemBarBackgrounds">true</item>
    </style>
    <style name="NormalTheme" parent="@android:style/Theme.Light.NoTitleBar">
        <item name="android:windowBackground">?android:colorBackground</item>
    </style>
</resources>
`
  },
  {
    path: 'android/app/src/main/res/xml/file_paths.xml',
    filename: 'file_paths.xml',
    category: 'config',
    description: 'Android FileProvider paths for sharing exported CSV and Excel gradebooks safely.',
    language: 'xml',
    code: `<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <external-path name="external_files" path="." />
    <cache-path name="cache_files" path="." />
    <files-path name="internal_files" path="." />
</paths>
`
  },
  {
    path: 'scripts/build_apk.sh',
    filename: 'build_apk.sh',
    category: 'config',
    description: 'One-click shell script to compile release APK on Linux / macOS.',
    language: 'bash',
    code: `#!/usr/bin/env bash
set -e

echo "=== MajidTech Exam Grading: Building Android APK ==="
echo "1. Checking Flutter environment..."
flutter doctor

echo "2. Installing dependencies..."
flutter pub get

echo "3. Compiling Release APK..."
flutter build apk --release --split-per-abi=false

echo "=== BUILD SUCCESSFUL ==="
echo "Your APK is ready at: build/app/outputs/flutter-apk/app-release.apk"
`
  },
  {
    path: 'scripts/build_apk.bat',
    filename: 'build_apk.bat',
    category: 'config',
    description: 'One-click batch script to compile release APK on Windows.',
    language: 'batch',
    code: `@echo off
echo ============================================================
echo   MajidTech Exam Grading: Building Android Release APK
echo ============================================================

echo [1/3] Fetching Flutter dependencies...
call flutter pub get

echo [2/3] Compiling Release APK...
call flutter build apk --release --split-per-abi=false

echo ============================================================
echo   BUILD COMPLETE!
echo   APK file: build\\app\\outputs\\flutter-apk\\app-release.apk
echo ============================================================
pause
`
  }
];

