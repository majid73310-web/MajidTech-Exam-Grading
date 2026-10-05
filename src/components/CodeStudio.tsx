import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  FileText,
  Search,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { FLUTTER_CODEBASE, FlutterFile } from '../data/flutterFiles';
import { downloadFlutterProjectZip } from '../utils/zipExporter';

export const CodeStudio: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(
    FLUTTER_CODEBASE.find(f => f.filename === 'gemini_grading_service.dart') || FLUTTER_CODEBASE[0]
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadFlutterProjectZip();
    } finally {
      setDownloading(false);
    }
  };

  const filteredFiles = FLUTTER_CODEBASE.filter(f =>
    f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lines = selectedFile.code.split('\n');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner with Project Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Flutter & Dart Production Codebase</h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
              {FLUTTER_CODEBASE.length} Architecture Files
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete, runnable Flutter application for Android with Riverpod, SQLite (`sqflite`), `google_generative_ai` (Gemini 1.5 Flash), and custom camera alignment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-transform active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Project (.zip)</span>
          </button>
        </div>
      </div>

      {/* Main Code Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Sidebar: File Tree & Search (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border-r border-slate-800/80 p-4 flex flex-col h-[750px]">
          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Flutter files, models, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2 px-1">
            <span>Project File Tree</span>
            <span>{filteredFiles.length} files</span>
          </div>

          {/* Scrollable File List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start space-x-2.5 ${
                    isSelected
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold'
                      : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      isSelected ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-[11px] text-white">
                      {file.filename}
                    </span>
                    <span className="block truncate text-[10px] text-slate-400 font-mono">
                      {file.path}
                    </span>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {file.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Run Command Tip */}
          <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            <span className="text-slate-200 font-bold block mb-1">Android Run Command:</span>
            <code className="text-emerald-400 font-mono text-[10px] block bg-slate-900 p-1.5 rounded border border-slate-800">
              flutter run --dart-define=GEMINI_API_KEY="..."
            </code>
          </div>
        </div>

        {/* Right Area: Code Viewer & Actions (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col h-[750px] bg-slate-950">
          {/* File Header Bar */}
          <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold font-mono uppercase bg-slate-800 text-emerald-400 border border-slate-700">
                {selectedFile.language}
              </span>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">{selectedFile.filename}</h3>
                <span className="text-[11px] text-slate-400 font-mono">{selectedFile.path}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description Callout */}
          <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800/80 text-xs text-slate-300">
            <span className="font-semibold text-emerald-400">Role: </span>
            {selectedFile.description}
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-[11px] leading-relaxed text-slate-300">
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60">
                    <td className="text-right pr-4 text-slate-600 select-none w-10 text-[10px]">
                      {idx + 1}
                    </td>
                    <td className="whitespace-pre overflow-x-auto text-slate-200">
                      {line}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
