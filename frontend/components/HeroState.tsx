import { ChatInputConfig } from "@/types/chat";
import { FileChips } from "./FileChips";
import { InputCapsuleBar } from "./InputCapsuleBar";

interface HeroStateProps {
  inputConfig: ChatInputConfig;
}

export function HeroState({ inputConfig }: HeroStateProps) {
  const { attachments } = inputConfig;
  const placeholder =
    attachments.files.length > 0 ? "Ask about this PDF or document..." : "Ask anything";

  return (
    <div className="w-full max-w-180 flex flex-col items-center my-auto py-12">
      {/* Main Heading */}
      <h1 className="text-2xl sm:text-[28px] font-normal text-white text-center tracking-normal mb-8">
        What’s on your mind today?
      </h1>

      {/* Attached Files Chips Display */}
      <FileChips attachments={attachments} />

      {/* Input Capsule Bar */}
      <InputCapsuleBar
        inputConfig={inputConfig}
        displayOptions={{
          placeholder,
          shadowClass: "shadow-[0_4px_20px_rgba(0,0,0,0.5)]",
          showLiveVoiceWhenEmpty: true,
        }}
      />
    </div>
  );
}
