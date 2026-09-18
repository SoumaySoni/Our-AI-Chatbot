import React from "react";
import { FileText, Paperclip, X } from "lucide-react";
import { ChatAttachmentConfig } from "@/types/chat";

interface FileChipsProps {
  attachments: ChatAttachmentConfig;
}

export function FileChips({ attachments }: FileChipsProps) {
  const { files, onRemove } = attachments;
  if (files.length === 0) return null;

  return (
    <div className="w-full flex flex-wrap gap-2 mb-3 px-2">
      {files.map((file) => (
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
            <span className="text-[10px] text-zinc-400">
              {file.type} • {file.size}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onRemove(file.id)}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
            title="Remove attachment"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
