import { Sparkles, SquarePen } from "lucide-react";

interface HeaderProps {
  onResetChat: () => void;
}

export function Header({ onResetChat }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-black/50 backdrop-blur-md border-b border-white/4">
      <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={onResetChat}>
        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="font-medium text-sm text-zinc-200 tracking-wide">Our AI Chatbot</span>
      </div>

      <button
        type="button"
        onClick={onResetChat}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-[#1c1d1f] hover:bg-[#26272b] border border-white/10 transition-all shadow-md cursor-pointer active:scale-95"
        title="Start a new chat"
      >
        <SquarePen className="w-3.5 h-3.5 text-blue-400" />
        <span>New chat</span>
      </button>
    </header>
  );
}
