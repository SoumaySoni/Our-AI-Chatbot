"use client";

import { useState, useRef } from "react";
import { Plus, Mic, ArrowUp, Brain, AudioLines, FileText, X, Paperclip } from "lucide-react";

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  file: File;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [thinkActive, setThinkActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: AttachedFile[] = Array.from(e.target.files).map((file) => {
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
        const formattedSize = file.size >= 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;
        const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';

        return {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: formattedSize,
          type: ext,
          file,
        };
      });

      setAttachedFiles((prev) => [...prev, ...newFiles]);
      // Reset input value so re-uploading the same file triggers onChange
      e.target.value = "";
    }
  };

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const hasContent = query.trim().length > 0 || attachedFiles.length > 0;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 select-none">
      {/* Hidden File Input for PDF / Document Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt,.csv,image/*"
        className="hidden"
        multiple
      />

      <div className="w-full max-w-180 flex flex-col items-center">
        {/* Main Heading */}
        <h1 className="text-2xl sm:text-[28px] font-normal text-white text-center tracking-normal mb-8">
          What’s on your mind today?
        </h1>

        {/* Attached Files Chips Display */}
        {attachedFiles.length > 0 && (
          <div className="w-full flex flex-wrap gap-2 mb-3 px-2">
            {attachedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2.5 bg-[#1c1d1f] border border-white/10 text-zinc-200 px-3 py-1.5 rounded-xl shadow-md text-xs transition-all hover:bg-[#232427]"
              >
                <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  {file.type === "PDF" ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </div>
                <div className="flex flex-col max-w-45 sm:max-w-55">
                  <span className="font-medium text-white truncate">{file.name}</span>
                  <span className="text-[10px] text-zinc-400">{file.type} • {file.size}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
                  title="Remove attachment"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Capsule Bar */}
        <div className="w-full h-13.5 bg-[#212121] hover:bg-[#252525] focus-within:bg-[#242424] border border-white/[0.06] rounded-full px-4 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-colors">
          {/* Left Section: Plus + Text Input */}
          <div className="flex items-center flex-1 min-w-0 pr-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 mr-1 cursor-pointer"
              aria-label="Add attachment or PDF"
              title="Add PDF or document"
            >
              <Plus className="w-5 h-5" strokeWidth={1.8} />
            </button>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={attachedFiles.length > 0 ? "Ask about this PDF or document..." : "Ask anything"}
              className="w-full bg-transparent text-white placeholder:text-zinc-400 text-[15px] sm:text-[16px] outline-none font-normal"
            />
          </div>

          {/* Right Section: Think + Mic + Blue Waveform Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Think Button */}
            <button
              type="button"
              onClick={() => setThinkActive(!thinkActive)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${thinkActive
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-zinc-300 hover:text-white hover:bg-white/10"
                }`}
            >
              <Brain className={`w-4.5 h-4.5 ${thinkActive ? "text-blue-400" : "text-zinc-300"}`} strokeWidth={1.8} />
              <span>Think</span>
            </button>

            {/* Mic Button */}
            <button
              type="button"
              onClick={() => setIsListening(!isListening)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${isListening
                ? "text-red-400 bg-red-500/20"
                : "text-zinc-300 hover:text-white hover:bg-white/10"
                }`}
              aria-label="Voice input"
            >
              <Mic className="w-4.75 h-4.75" strokeWidth={1.8} />
            </button>

            {/* Blue Action Button */}
            {hasContent ? (
              <button
                type="button"
                className="w-8.5 h-8.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] flex items-center justify-center transition-colors shadow-md cursor-pointer"
                aria-label="Send message"
              >
                <ArrowUp className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
              </button>
            ) : (
              <button
                type="button"
                className="w-8.5 h-8.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] flex items-center justify-center transition-colors shadow-md cursor-pointer"
                aria-label="Live Voice Mode"
              >
                <AudioLines className="w-4.5 h-4.5 text-white" strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}