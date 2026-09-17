import React from "react";
import { Plus, Brain, Mic, ArrowUp, AudioLines } from "lucide-react";
import { ChatInputConfig, CapsuleDisplayOptions } from "@/types/chat";

interface InputCapsuleBarProps {
  inputConfig: ChatInputConfig;
  displayOptions: CapsuleDisplayOptions;
}

export function InputCapsuleBar({ inputConfig, displayOptions }: InputCapsuleBarProps) {
  const { query, toggles, attachments, isGenerating } = inputConfig;
  const {
    placeholder,
    shadowClass = "shadow-[0_4px_20px_rgba(0,0,0,0.5)]",
    showLiveVoiceWhenEmpty = false,
  } = displayOptions;

  return (
    <div
      className={`w-full h-13.5 bg-[#212121] hover:bg-[#252525] focus-within:bg-[#242424] border border-white/[0.06] rounded-full px-4 flex items-center justify-between transition-colors ${shadowClass}`}
    >
      {/* Left Section: Plus + Text Input */}
      <div className="flex items-center flex-1 min-w-0 pr-3">
        <button
          type="button"
          onClick={attachments.onUploadClick}
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 mr-1 cursor-pointer"
          aria-label="Add attachment or PDF"
          title="Add PDF or document"
        >
          <Plus className="w-5 h-5" strokeWidth={1.8} />
        </button>

        <input
          type="text"
          value={query.value}
          onChange={(e) => query.onChange(e.target.value)}
          onKeyDown={query.onKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-white placeholder:text-zinc-400 text-[15px] sm:text-[16px] outline-none font-normal"
        />
      </div>

      {/* Right Section: Think + Mic + Action Button */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={toggles.think.toggle}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
            toggles.think.active
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-zinc-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <Brain className={`w-4.5 h-4.5 ${toggles.think.active ? "text-blue-400" : "text-zinc-300"}`} strokeWidth={1.8} />
          <span>Think</span>
        </button>

        <button
          type="button"
          onClick={toggles.voice.toggle}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            toggles.voice.listening
              ? "text-red-400 bg-red-500/20"
              : "text-zinc-300 hover:text-white hover:bg-white/10"
          }`}
          aria-label="Voice input"
        >
          <Mic className="w-4.75 h-4.75" strokeWidth={1.8} />
        </button>

        {showLiveVoiceWhenEmpty && !query.hasContent ? (
          <button
            type="button"
            className="w-8.5 h-8.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] flex items-center justify-center transition-colors shadow-md cursor-pointer"
            aria-label="Live Voice Mode"
          >
            <AudioLines className="w-4.5 h-4.5 text-white" strokeWidth={2} />
          </button>
        ) : (
          <button
            type="button"
            onClick={query.onSend}
            disabled={!query.hasContent || isGenerating}
            className={`w-8.5 h-8.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] flex items-center justify-center transition-all shadow-md ${
              !query.hasContent || isGenerating ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
            }`}
            aria-label="Send message"
          >
            <ArrowUp className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
          </button>
        )}
      </div>
    </div>
  );
}
