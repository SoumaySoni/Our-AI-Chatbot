import React from "react";
import { Sparkles, Brain, FileText } from "lucide-react";
import { Message, ChatInputConfig } from "@/types/chat";
import { FormattedMessageText } from "./FormattedMessageText";
import { FileChips } from "./FileChips";
import { InputCapsuleBar } from "./InputCapsuleBar";

interface MessageListProps {
  messages: Message[];
  chatBottomRef: React.RefObject<HTMLDivElement | null>;
  inputConfig: ChatInputConfig;
}

export function MessageList({ messages, chatBottomRef, inputConfig }: MessageListProps) {
  const { attachments, isGenerating } = inputConfig;

  const placeholder = isGenerating
    ? "Please wait for response..."
    : attachments.files.length > 0
    ? "Ask follow-up about document..."
    : "Ask follow up...";

  return (
    <div className="w-full max-w-180 flex flex-col pt-8 pb-32 min-h-screen min-w-0">
      <div className="flex-1 space-y-6 flex flex-col min-w-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col w-full min-w-0 ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            {msg.role === "user" ? (
              <div className="flex flex-col items-end max-w-[85%] space-y-2 min-w-0">
                {/* Attached files inside user message bubble */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-end max-w-full">
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
                  <div className="bg-[#212121] border border-white/10 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-[15px] shadow-sm select-text break-words break-all [overflow-wrap:anywhere] min-w-0 max-w-full">
                    {msg.text}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3 max-w-[90%] text-zinc-200 select-text leading-relaxed text-[15px] min-w-0 w-full break-words break-all [overflow-wrap:anywhere]">
                <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-2 flex-1 min-w-0 max-w-full break-words break-all [overflow-wrap:anywhere]">
                  {msg.thinkMode && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-1">
                      <Brain className="w-3.5 h-3.5" />
                      Deep Thought Logic
                    </div>
                  )}
                  {msg.text ? (
                    <FormattedMessageText text={msg.text} />
                  ) : (
                    <div className="flex items-center gap-2 py-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-xs text-zinc-400">Generating response...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        <div ref={chatBottomRef} />
      </div>

      {/* Fixed Bottom Input Bar for Chat Mode */}
      <div className="fixed bottom-6 left-0 right-0 max-w-180 mx-auto px-4 z-20">
        <FileChips attachments={attachments} />
        <InputCapsuleBar
          inputConfig={inputConfig}
          displayOptions={{
            placeholder,
            shadowClass: "shadow-[0_4px_30px_rgba(0,0,0,0.8)]",
            showLiveVoiceWhenEmpty: false,
          }}
        />
      </div>
    </div>
  );
}
