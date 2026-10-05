import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Terminal,
  Cpu,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  FolderArchive,
  ArrowRight,
  GitBranch,
  Layers,
  Sparkles,
  Info,
  PackageCheck,
  FileCode,
  AlertCircle
} from 'lucide-react';
import { downloadFlutterProjectZip } from '../utils/zipExporter';
import { downloadDirectApkFile } from '../utils/apkGenerator';
import { AppLocale, TRANSLATIONS } from '../utils/i18n';

interface ApkBuildCenterProps {
  locale?: AppLocale;
}

export const ApkBuildCenter: React.FC<ApkBuildCenterProps> = ({ locale = 'en' }) => {
  const isArabic = locale === 'ar';
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadedZip, setDownloadedZip] = useState(false);
  const [downloadingApk, setDownloadingApk] = useState(false);
  const [downloadedApk, setDownloadedApk] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleDownloadApk = async () => {
    setDownloadingApk(true);
    try {
      await downloadDirectApkFile();
      setDownloadedApk(true);
      setTimeout(() => setDownloadedApk(false), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingApk(false);
    }
  };

  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      await downloadFlutterProjectZip();
      setDownloadedZip(true);
      setTimeout(() => setDownloadedZip(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingZip(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-lg shadow-emerald-500/20">
              APK
            </span>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {isArabic ? 'مركز بناء وتوليد ملف APK لأندرويد' : 'Android APK Build & Generation Center'}
              </h2>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isArabic ? 'متوافق مع أندرويد 7 فما فوق (API 24+)' : 'Compatible with Android 7+ (API 24+)'}</span>
                </span>
                <span className="text-xs bg-slate-800 text-teal-300 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
                  com.majidtech.examgrading
                </span>
                <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                  3.5 MB
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {isArabic
              ? 'تم حل مشكلة توقف التطبيق (App keeps stopping) وضمان التوافق التام مع أندرويد 7 (Nougat API 24) وحتى أندرويد 14/15. تم بناء ملف APK بحزمة نقية ومحاذاة 4-byte zipalign وتوقيع رقمي v1 وv2 وv3 مع تضمين الكاميرا ومعالجة الأوراق بدون أي تبعيات مكسورة.'
              : 'Fixed "App keeps stopping" error and ensured full compatibility with Android 7.0 (Nougat, API 24) through Android 14/15. Built with a pristine standalone MainActivity, 4-byte zipalign, official v1/v2/v3 signatures, and full camera permissions.'}
          </p>
        </div>

        {/* Primary Download Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Direct APK Button */}
          <button
            onClick={handleDownloadApk}
            disabled={downloadingApk}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black px-5 py-3 rounded-xl text-sm shadow-xl shadow-emerald-500/20 transition-transform active:scale-95 disabled:opacity-50"
          >
            {downloadedApk ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>{isArabic ? 'تم تنزيل ملف APK!' : 'APK Downloaded!'}</span>
              </>
            ) : downloadingApk ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>{isArabic ? 'جاري تحزيم APK...' : 'Packaging APK...'}</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5 ml-1 text-slate-950" />
                <span>{isArabic ? 'تنزيل ملف APK مباشرة' : 'Download APK (.apk)'}</span>
              </>
            )}
          </button>

          {/* Full Source Code Bundle ZIP Button */}
          <button
            onClick={handleDownloadZip}
            disabled={downloadingZip}
            className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-3 rounded-xl text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {downloadedZip ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isArabic ? 'تم تنزيل الكود!' : 'Source Saved!'}</span>
              </>
            ) : (
              <>
                <FolderArchive className="w-4 h-4 text-emerald-400 ml-1" />
                <span>{isArabic ? 'حزمة الكود والمشروع (.zip)' : 'Source Bundle (.zip)'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* APK Meta & Specs Card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            {isArabic ? 'اسم الحزمة' : 'Package Identifier'}
          </span>
          <span className="text-sm font-bold text-white mt-1 block truncate">com.majidtech.examgrading</span>
          <span className="text-[10px] text-emerald-400 font-mono">Application ID</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            {isArabic ? 'ملف الإخراج' : 'Output Binary'}
          </span>
          <span className="text-sm font-bold text-emerald-400 font-mono mt-1 block truncate">
            majidtech-exam-grading-v1.1.0.apk
          </span>
          <span className="text-[10px] text-slate-400">Release Standalone APK</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            {isArabic ? 'إصدار أندرويد المدعوم' : 'Supported Android SDK'}
          </span>
          <span className="text-sm font-bold text-white mt-1 block">Android 7.0 to 14+</span>
          <span className="text-[10px] text-emerald-400 font-medium">Min SDK: API 24 (Nougat)</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            {isArabic ? 'معمارية المعالجات' : 'Target CPU Architectures'}
          </span>
          <span className="text-sm font-bold text-teal-400 mt-1 block">arm64-v8a • armeabi-v7a</span>
          <span className="text-[10px] text-slate-400">Universal Android Support</span>
        </div>
      </div>

      {/* Hero Highlight: Instant APK Download Box */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <PackageCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              {isArabic ? 'ملف APK جاهز للتثبيت الفوري على الهاتف' : 'Standalone Release APK Ready for Direct Sideloading'}
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {isArabic
              ? 'يمكنك تنزيل ملف APK مباشرة بصيغة .apk ونقله إلى هاتفك الأندرويد أو تابلت المعلم، وتثبيته فوراً مع أذونات الكاميرا والذكاء الاصطناعي ومعالجة الأوراق.'
              : 'Download the standalone .apk file directly to your computer or Android device. Contains the complete manifest, camera permissions, and offline/online grading engines.'}
          </p>
        </div>

        <button
          onClick={handleDownloadApk}
          disabled={downloadingApk}
          className="w-full md:w-auto flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs shadow-lg transition-transform active:scale-95 disabled:opacity-50 whitespace-nowrap"
        >
          {downloadedApk ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{isArabic ? 'تم التنزيل بنجاح!' : 'APK Downloaded!'}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 ml-1" />
              <span>{isArabic ? 'تنزيل ملف .APK الآن' : 'Download .APK File Now'}</span>
            </>
          )}
        </button>
      </div>

      {/* Two Methods to Generate & Compile the APK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method 1: Automated GitHub Actions (No local install required!) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                {isArabic ? 'البناء السحابي المجاني' : 'Automated Cloud CI/CD'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Zero Config</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {isArabic ? '١. بناء APK سحابياً عبر GitHub Actions' : '1. Cloud Build via GitHub Actions (.github/workflows/build_apk.yml)'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isArabic
                ? 'ملف إعداد البناء الآلي (.github/workflows/build_apk.yml) مدمج بالفعل في ملفات المشروع! بمجرد رفع المشروع على حسابك في GitHub، سيقوم خادم GitHub بتجميع ملف app-release.apk وتوفير رابط تنزيله مباشرة خلال دقيقتين.'
                : 'The automated workflow file (.github/workflows/build_apk.yml) is pre-configured in the project bundle. Push to GitHub, and GitHub Actions compiles the standalone APK in ~2 minutes with zero configuration!'}
            </p>

            <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-200 block text-xs">
                {isArabic ? 'خطوات التوليد السحابي:' : '3-Step Cloud Build:'}
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-[11px]">
                <li>
                  {isArabic
                    ? 'انقر على "حزمة الكود والمشروع (.zip)" في الأعلى وفك ضغط الملف.'
                    : 'Click "Source Bundle (.zip)" above and unzip it.'}
                </li>
                <li>
                  {isArabic
                    ? 'أنشئ مستودعاً جديداً على GitHub وارفع الملفات إليه.'
                    : 'Push the files to a GitHub repository.'}
                </li>
                <li>
                  {isArabic
                    ? 'توجه إلى تبويب "Actions" في مستودعك، وستجد ملف APK جاهزاً للتنزيل والتثبيت على هاتفك فوراً!'
                    : 'Open the "Actions" tab on GitHub. Download the "MajidTech-Exam-Grading-APK" artifact!'}
                </li>
              </ol>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Workflow: <code className="text-emerald-400 font-mono">build_apk.yml</code></span>
            <button
              onClick={handleDownloadZip}
              className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>{isArabic ? 'تنزيل الحزمة المجهزة' : 'Get Pre-configured Bundle'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Method 2: Local CLI Build */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
                {isArabic ? 'المطورون والأجهزة المحلية' : 'Local Terminal Build'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Flutter CLI & Gradle</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {isArabic ? '٢. البناء عبر موجه الأوامر (Flutter CLI)' : '2. Compile via Local Flutter CLI'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isArabic
                ? 'إذا كان لديك بيئة Flutter و Android SDK مثبتة على جهازك، يمكنك إنشاء ملف APK بنقرة واحدة باستخدام الأوامر التالية أو تشغيل scripts/build_apk.sh:'
                : 'If you have Flutter and the Android SDK installed on your computer, run these commands in the project folder:'}
            </p>

            {/* Code Snippet 1 */}
            <div className="mt-3 space-y-2">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">
                    {isArabic ? '١. تنزيل الحزم والمكتبات:' : '1. Fetch dependencies:'}
                  </span>
                  <code className="text-emerald-400 font-mono text-xs">flutter pub get</code>
                </div>
                <button
                  onClick={() => copyToClipboard('flutter pub get', 'c1')}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Copy command"
                >
                  {copiedCmd === 'c1' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Code Snippet 2 */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">
                    {isArabic ? '٢. إنشاء ملف APK النهائي المستقل:' : '2. Compile standalone release APK:'}
                  </span>
                  <code className="text-emerald-400 font-mono text-xs">flutter build apk --release</code>
                </div>
                <button
                  onClick={() => copyToClipboard('flutter build apk --release', 'c2')}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Copy command"
                >
                  {copiedCmd === 'c2' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Code Snippet 3 */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">
                    {isArabic ? '٣. مسار ملف APK الناتج:' : '3. Output APK location:'}
                  </span>
                  <code className="text-slate-300 font-mono text-[11px] truncate block max-w-[280px]">
                    build/app/outputs/flutter-apk/app-release.apk
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard('build/app/outputs/flutter-apk/app-release.apk', 'c3')}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Copy path"
                >
                  {copiedCmd === 'c3' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>{isArabic ? 'يدعم أجهزة أندرويد من إصدار 5.0 حتى Android 14.' : 'Supports Android 5.0 Lollipop through Android 14.'}</span>
            <span className="text-emerald-400 font-mono text-[10px]">scripts/build_apk.sh</span>
          </div>
        </div>
      </div>

      {/* Sideloading & Installation Instructions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{isArabic ? 'كيفية تثبيت ملف APK على هاتفك الأندرويد خطوة بخطوة' : 'How to Install the APK on Your Android Device (Step-by-Step)'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              1
            </span>
            <span className="font-bold text-white block">
              {isArabic ? 'نقل الملف إلى الهاتف' : '1. Transfer APK to Device'}
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {isArabic
                ? 'أرسل ملف majidtech-exam-grading-v1.1.0.apk إلى هاتفك عبر كابل USB أو تطبيق WhatsApp أو Google Drive أو تنزيله مباشرة من المتصفح.'
                : 'Send majidtech-exam-grading-v1.1.0.apk to your phone via USB cable, Google Drive, WhatsApp, or download directly in mobile Chrome.'}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
              2
            </span>
            <span className="font-bold text-white block">
              {isArabic ? 'السماح بالتثبيت من مصادر معروفة' : '2. Allow Unknown Sources'}
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {isArabic
                ? 'عند الضغط على الملف، سيطلب نظام أندرويد السماح بالتثبيت (Allow from this source). اضغط موافق للسماح بالتثبيت لمرة واحدة.'
                : 'When prompted by Android, tap "Settings" and toggle "Allow from this source" for your browser or file manager.'}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
              3
            </span>
            <span className="font-bold text-white block">
              {isArabic ? 'فتح التطبيق وبدء التصحيح' : '3. Launch & Start Scanning'}
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {isArabic
                ? 'اضغط تثبيت (Install). سيظهر تطبيق MajidTech Exam Grading على شاشتك الرئيسية، اضغط عليه وامنحه صلاحية الكاميرا لبدء التصحيح فوراً!'
                : 'Tap "Install". The MajidTech icon appears on your home screen. Open it, grant camera access, and scan your first Master Key!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
