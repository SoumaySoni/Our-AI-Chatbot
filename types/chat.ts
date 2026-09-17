export interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  file: File;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  attachments?: AttachedFile[];
  thinkMode?: boolean;
}

export interface ChatQueryConfig {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  hasContent: boolean;
  onSend: () => void;
}

export interface ChatTogglesConfig {
  think: {
    active: boolean;
    toggle: () => void;
  };
  voice: {
    listening: boolean;
    toggle: () => void;
  };
}

export interface ChatAttachmentConfig {
  files: AttachedFile[];
  onRemove: (id: string) => void;
  onUploadClick: () => void;
}

export interface ChatInputConfig {
  query: ChatQueryConfig;
  toggles: ChatTogglesConfig;
  attachments: ChatAttachmentConfig;
  isGenerating: boolean;
}

export interface CapsuleDisplayOptions {
  placeholder: string;
  shadowClass?: string;
  showLiveVoiceWhenEmpty?: boolean;
}
