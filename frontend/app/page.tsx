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

  const handleSendMessage = async () => {
    if (isGenerating) return;

    const trimmed = query.trim();
    if (!trimmed && attachedFiles.length === 0) return;

    const currentFiles = [...attachedFiles];
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
      attachments: currentFiles.length > 0 ? [...currentFiles] : undefined,
      thinkMode: thinkActive,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setQuery("");
    setAttachedFiles([]);
    setIsGenerating(true);

    const assistantId = (Date.now() + 1).toString();
    // Add initial placeholder message for streaming assistant response
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        text: "",
        thinkMode: thinkActive,
      },
    ]);

    try {
      let fileContext: string | undefined = undefined;

      // 1. Process files if uploaded
      if (currentFiles.length > 0) {
        const formData = new FormData();
        currentFiles.forEach((fileItem) => {
          if (fileItem.file) {
            formData.append("files", fileItem.file);
          }
        });

        if (formData.has("files")) {
          const uploadRes = await fetch("http://localhost:8001/api/upload", {
            method: "POST",
            body: formData,
          });

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            fileContext = uploadData.file_context;
          }
        }
      }

      // 2. Stream tokens from FastAPI backend
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch("http://localhost:8001/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          file_context: fileContext,
          history: historyPayload,
          think_mode: thinkActive,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.slice(6).trim();
                if (!jsonStr) continue;
                const data = JSON.parse(jsonStr);

                if (data.token) {
                  accumulatedText += data.token;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantId ? { ...msg, text: accumulatedText } : msg
                    )
                  );
                }
              } catch (err) {
                // Ignore chunk JSON parse errors
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error calling chat backend:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                text:
                  "Unable to connect to backend server. Please ensure the Python backend is running on `http://localhost:8001`.",
              }
            : msg
        )
      );
    } finally {
      setIsGenerating(false);
    }
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
