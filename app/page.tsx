"use client";

import { useState, useRef, useEffect } from "react";
import { AttachedFile, Message, ChatInputConfig } from "@/types/chat";
import { Header } from "@/components/Header";
import { HeroState } from "@/components/HeroState";
import { MessageList } from "@/components/MessageList";

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
        const formattedSize =
          file.size >= 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;
        const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";

        return {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: formattedSize,
          type: ext,
          file,
        };
      });

      setAttachedFiles((prev) => [...prev, ...newFiles]);
      e.target.value = "";
    }
  };

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSendMessage = () => {
    if (isGenerating) return;

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
        responseText = `I have received your document (${fileNames}). ${
          trimmed
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
      if (!isGenerating) {
        handleSendMessage();
      }
    }
  };

  const resetChat = () => {
    setMessages([]);
    setQuery("");
    setAttachedFiles([]);
    setIsGenerating(false);
  };

  const hasContent = query.trim().length > 0 || attachedFiles.length > 0;

  // Cohesive configuration object following the 3-Prop Rule
  const inputConfig: ChatInputConfig = {
    query: {
      value: query,
      onChange: setQuery,
      onKeyDown: handleKeyDown,
      hasContent,
      onSend: handleSendMessage,
    },
    toggles: {
      think: {
        active: thinkActive,
        toggle: () => setThinkActive((prev) => !prev),
      },
      voice: {
        listening: isListening,
        toggle: () => setIsListening((prev) => !prev),
      },
    },
    attachments: {
      files: attachedFiles,
      onRemove: removeFile,
      onUploadClick: () => fileInputRef.current?.click(),
    },
    isGenerating,
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 select-none relative pt-16 w-full max-w-full overflow-x-hidden">
      {/* Hidden File Input for PDF / Document Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt,.csv,image/*"
        className="hidden"
        multiple
      />

      {/* Top Header */}
      <Header onResetChat={resetChat} />

      {messages.length === 0 ? (
        /* INITIAL HERO STATE */
        <HeroState inputConfig={inputConfig} />
      ) : (
        /* CONVERSATION VIEW */
        <MessageList
          messages={messages}
          chatBottomRef={chatBottomRef}
          inputConfig={inputConfig}
        />
      )}
    </main>
  );
}