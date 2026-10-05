import JSZip from 'jszip';
import { FLUTTER_CODEBASE } from '../data/flutterFiles';

export async function downloadFlutterProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Root files
  zip.file('pubspec.yaml', FLUTTER_CODEBASE.find(f => f.path === 'pubspec.yaml')?.code || '');
  zip.file('README.md', `# MajidTech Exam Grading - Flutter Android Application

Automated exam paper scanner and grading architecture for Flutter & Android with Gemini Vision AI, SQLite storage, and camera alignment.

## How to Build the APK (.apk) File

### Method 1: Local Build (Fastest if Flutter & Android SDK installed)
1. Ensure Flutter is installed: \`flutter --version\`
2. Fetch dependencies:
   \`\`\`bash
   flutter pub get
   \`\`\`
3. Build the release APK:
   \`\`\`bash
   flutter build apk --release
   \`\`\`
   Output APK location:
   \`build/app/outputs/flutter-apk/app-release.apk\`

4. (Optional) Build split APKs for smaller download sizes:
   \`\`\`bash
   flutter build apk --split-per-abi
   \`\`\`

---

### Method 2: Free Automated GitHub Actions Cloud Build (No Android Studio Needed!)
1. Create a repository on GitHub (private or public).
2. Push this unzipped project to your repository.
3. GitHub Actions will automatically detect \`.github/workflows/build_apk.yml\`.
4. Go to the **Actions** tab on your GitHub repository.
5. In ~3 minutes, the workflow will complete and you can download **MajidTech-Exam-Grading-APK** directly to your computer or Android phone!

---

### Package Details
- **App Name**: MajidTech Exam Grading
- **Package ID**: \`com.majidtech.examgrading\`
- **Target SDK**: Android 34 (Android 14)
- **Min SDK**: Android 21 (Lollipop 5.0+)
- **Architecture**: arm64-v8a, armeabi-v7a, x86_64
`);

  // Add all files from FLUTTER_CODEBASE
  for (const file of FLUTTER_CODEBASE) {
    if (file.path !== 'pubspec.yaml') {
      zip.file(file.path, file.code);
    }
  }

  // Generate blob and trigger browser download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'majidtech_exam_grading_flutter.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
