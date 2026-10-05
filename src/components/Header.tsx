import React, { useState } from 'react';
import { Smartphone, Code2, Layers, Download, CheckCircle2, BarChart2, Languages, Package, Sparkles } from 'lucide-react';
import { downloadFlutterProjectZip } from '../utils/zipExporter';
import { downloadDirectApkFile } from '../utils/apkGenerator';
import { AppLocale, TRANSLATIONS } from '../utils/i18n';

interface HeaderProps {
  activeTab: 'simulator' | 'code' | 'architecture' | 'dashboard' | 'apk';
  setActiveTab: (tab: 'simulator' | 'code' | 'architecture' | 'dashboard' | 'apk') => void;
  batchCount: number;
  locale: AppLocale;
  onToggleLocale: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  batchCount,
  locale,
  onToggleLocale,
}) => {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadedZip, setDownloadedZip] = useState(false);
  const [downloadingApk, setDownloadingApk] = useState(false);
  const [downloadedApk, setDownloadedApk] = useState(false);

  const t = TRANSLATIONS[locale];

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

  const handleDownloadApk = async () => {
    setDownloadingApk(true);
    try {
      await downloadDirectApkFile();
      setDownloadedApk(true);
      setTimeout(() => setDownloadedApk(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingApk(false);
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="font-bold text-slate-950 text-xl tracking-tighter">AG</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg text-white tracking-tight">{t.appName}</h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Arabic/English • Gemini 1.5
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{locale === 'ar' ? 'الماسح الضوئي' : 'Live Mobile Scanner'}</span>
              {batchCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-slate-900 text-emerald-400 rounded-full font-bold">
                  {batchCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>{locale === 'ar' ? 'التحليلات والدعم' : 'Analytics & Intervention'}</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>{locale === 'ar' ? 'شفرة فلاتر' : 'Flutter Codebase'}</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'architecture'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden md:inline">{locale === 'ar' ? 'المعمارية وقواعد البيانات' : 'Architecture & Blueprint'}</span>
              <span className="md:hidden">Blueprint</span>
            </button>

            <button
              onClick={() => setActiveTab('apk')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'apk'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30'
              }`}
            >
              <Package className="w-4 h-4" />
              <span className="font-bold">{locale === 'ar' ? 'ملف APK' : 'APK Build'}</span>
            </button>
          </nav>

          {/* Language Toggle & Download Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleLocale}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition-all shadow-sm"
              title="Toggle between English (LTR) and Arabic (RTL)"
            >
              <Languages className="w-4 h-4" />
              <span>{t.languageToggle}</span>
            </button>

            {/* Direct APK Download Button */}
            <button
              onClick={handleDownloadApk}
              disabled={downloadingApk}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
              title="Direct Download Android APK file (.apk)"
            >
              {downloadedApk ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                  <span>{locale === 'ar' ? 'تم تنزيل APK!' : 'APK Ready!'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-slate-950" />
                  <span>{locale === 'ar' ? 'تنزيل APK' : 'Download APK'}</span>
                </>
              )}
            </button>

            {/* Full Source Code Bundle */}
            <button
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="hidden sm:flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold px-2.5 py-1.5 rounded-xl text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
              title="Download runnable Flutter source code as a ZIP archive"
            >
              {downloadedZip ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{locale === 'ar' ? 'تم!' : 'Saved!'}</span>
                </>
              ) : (
                <>
                  <span className="text-slate-400">.ZIP</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

