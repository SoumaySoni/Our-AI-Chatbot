"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Mic, ArrowUp, Brain, AudioLines, FileText, X, Paperclip, RotateCcw, Sparkles } from "lucide-react";

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  file: File;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  attachments?: AttachedFile[];
  thinkMode?: boolean;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [thinkActive, setThinkActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isGenerating]);

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

  const handleSendMessage = () => {
    const trimmed = query.trim();
    if (!trimmed && attachedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
      thinkMode: thinkActive,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setAttachedFiles([]);
    setIsGenerating(true);

    // Simulated AI response
    setTimeout(() => {
      let responseText = "";
      if (userMessage.attachments && userMessage.attachments.length > 0) {
        const fileNames = userMessage.attachments.map((f) => f.name).join(", ");
        responseText = `I have received your document (${fileNames}). ${trimmed
            ? `Here is the analysis based on "${trimmed}":\n\nThe attached file has been processed successfully. What specific insights or summaries would you like me to extract?`
            : "I am ready to analyze this document. What questions do you have about it?"
          }`;
      } else if (thinkActive) {
        responseText = `**Deep Thought Analysis:**\n1. Examining core query: "${trimmed}"\n2. Cross-referencing logic and concepts.\n3. Formulating response...\n\nHere is a detailed breakdown for **${trimmed}** with deep reasoning applied.`;
      } else {
        responseText = `Here is what I found regarding **"${trimmed}"**. Let me know if you would like me to elaborate or assist further!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: responseText,
          thinkMode: thinkActive,
        },
      ]);
      setIsGenerating(false);
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setQuery("");
    setAttachedFiles([]);
  };

  const hasContent = query.trim().length > 0 || attachedFiles.length > 0;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 select-none relative">
      {/* Hidden File Input for PDF / Document Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt,.csv,image/*"
        className="hidden"
        multiple
      />

      {/* Top Header - New Chat Button (visible when conversation is active) */}
      {messages.length > 0 && (
        <header className="fixed top-5 right-6 z-30">
          <button
            onClick={resetChat}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white bg-[#1c1d1f] hover:bg-[#252629] border border-white/10 transition-all shadow-md cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New chat</span>
          </button>
        </header>
      )}

      {messages.length === 0 ? (
        /* INITIAL HERO STATE */
        <div className="w-full max-w-180 flex flex-col items-center my-auto py-12">
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
                onKeyDown={handleKeyDown}
                placeholder={attachedFiles.length > 0 ? "Ask about this PDF or document..." : "Ask anything"}
                className="w-full bg-transparent text-white placeholder:text-zinc-400 text-[15px] sm:text-[16px] outline-none font-normal"
              />
            </div>

            {/* Right Section: Think + Mic + Blue Action Button */}
            <div className="flex items-center gap-2 shrink-0">
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

              {hasContent ? (
                <button
                  type="button"
                  onClick={handleSendMessage}
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
      ) : (
        /* CONVERSATION VIEW (ChatGPT style - Messages stream up, input bar pinned at bottom) */
        <div className="w-full max-w-180 flex flex-col pt-12 pb-32 min-h-screen">
          <div className="flex-1 space-y-6 flex flex-col">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"
                  }`}
              >
                {msg.role === "user" ? (
                  <div className="flex flex-col items-end max-w-[85%] space-y-2">
                    {/* Attached files inside user message bubble */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-end">
                        {msg.attachments.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 bg-[#2a2b2e] border border-white/10 text-white px-3 py-1.5 rounded-xl text-xs"
                          >
                            <FileText className="w-4 h-4 text-red-400 shrink-0" />
                            <span className="font-medium truncate max-w-40">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.text && (
                      <div className="bg-[#212121] border border-white/10 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-[15px] shadow-sm select-text">
                        {msg.text}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-3 max-w-[90%] text-zinc-200 select-text leading-relaxed text-[15px]">
                    <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="space-y-2 flex-1">
                      {msg.thinkMode && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-1">
                          <Brain className="w-3.5 h-3.5" />
                          Deep Thought Logic
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isGenerating && (
              <div className="flex items-center gap-3 text-zinc-400 text-sm py-2">
                <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs text-zinc-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Fixed Bottom Input Bar for Chat Mode */}
          <div className="fixed bottom-6 left-0 right-0 max-w-180 mx-auto px-4 z-20">
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

            <div className="w-full h-13.5 bg-[#212121] hover:bg-[#252525] focus-within:bg-[#242424] border border-white/[0.08] rounded-full px-4 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.8)] transition-colors">
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
                  onKeyDown={handleKeyDown}
                  placeholder={attachedFiles.length > 0 ? "Ask follow-up about document..." : "Ask follow up..."}
                  className="w-full bg-transparent text-white placeholder:text-zinc-400 text-[15px] sm:text-[16px] outline-none font-normal"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
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

                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="w-8.5 h-8.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] flex items-center justify-center transition-colors shadow-md cursor-pointer"
                  aria-label="Send message"
                >
                  <ArrowUp className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}