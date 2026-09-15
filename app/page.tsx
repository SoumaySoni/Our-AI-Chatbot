"use client";

import React, { useState } from "react";
import { Plus, Mic, ArrowUp, Brain, AudioLines } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [thinkActive, setThinkActive] = useState(false);
  const [isListening, setIsListening] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 select-none">
      <div className="w-full max-w-[720px] flex flex-col items-center">
        {/* Main Heading */}
        <h1 className="text-2xl sm:text-[28px] font-normal text-white text-center tracking-normal mb-8">
          What’s on your mind today?
        </h1>

        {/* Input Capsule Bar */}
        <div className="w-full h-[54px] bg-[#212121] hover:bg-[#252525] focus-within:bg-[#242424] border border-white/[0.06] rounded-full px-4 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-colors">
          {/* Left Section: Plus + Text Input */}
          <div className="flex items-center flex-1 min-w-0 pr-3">
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 mr-1 cursor-pointer"
              aria-label="Add attachment"
            >
              <Plus className="w-[20px] h-[20px]" strokeWidth={1.8} />
            </button>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything"
              className="w-full bg-transparent text-white placeholder:text-zinc-400 text-[15px] sm:text-[16px] outline-none font-normal"
            />
          </div>

          {/* Right Section: Think + Mic + Blue Waveform Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Think Button */}
            <button
              type="button"
              onClick={() => setThinkActive(!thinkActive)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                thinkActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Brain className={`w-[18px] h-[18px] ${thinkActive ? "text-blue-400" : "text-zinc-300"}`} strokeWidth={1.8} />
              <span>Think</span>
            </button>

            {/* Mic Button */}
            <button
              type="button"
              onClick={() => setIsListening(!isListening)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isListening
                  ? "text-red-400 bg-red-500/20"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
              aria-label="Voice input"
            >
              <Mic className="w-[19px] h-[19px]" strokeWidth={1.8} />
            </button>

            {/* Blue Action Button */}
            {query.trim().length > 0 ? (
              <button
                type="button"
                className="w-[34px] h-[34px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] flex items-center justify-center transition-colors shadow-md cursor-pointer"
                aria-label="Send message"
              >
                <ArrowUp className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
              </button>
            ) : (
              <button
                type="button"
                className="w-[34px] h-[34px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] flex items-center justify-center transition-colors shadow-md cursor-pointer"
                aria-label="Live Voice Mode"
              >
                <AudioLines className="w-[18px] h-[18px] text-white" strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}