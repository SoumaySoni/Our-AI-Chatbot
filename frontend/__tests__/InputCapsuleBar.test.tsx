import { render, screen, fireEvent } from '@testing-library/react';
import { InputCapsuleBar } from '@/components/InputCapsuleBar';
import { ChatInputConfig, CapsuleDisplayOptions } from '@/types/chat';

describe('InputCapsuleBar Component', () => {
  const defaultDisplayOptions: CapsuleDisplayOptions = {
    placeholder: 'Ask anything',
    showLiveVoiceWhenEmpty: false,
  };

  const createMockInputConfig = (overrides?: Partial<ChatInputConfig>): ChatInputConfig => ({
    query: {
      value: '',
      onChange: jest.fn(),
      onKeyDown: jest.fn(),
      hasContent: false,
      onSend: jest.fn(),
      ...(overrides?.query || {}),
    },
    toggles: {
      think: { active: false, toggle: jest.fn(), ...(overrides?.toggles?.think || {}) },
      voice: { listening: false, toggle: jest.fn(), ...(overrides?.toggles?.voice || {}) },
    },
    attachments: {
      files: [],
      onRemove: jest.fn(),
      onUploadClick: jest.fn(),
      ...(overrides?.attachments || {}),
    },
    isGenerating: false,
    ...overrides,
  });

  it('renders input with placeholder and calls onChange when typing', () => {
    const onChange = jest.fn();
    const config = createMockInputConfig({
      query: {
        value: 'hello',
        onChange,
        onKeyDown: jest.fn(),
        hasContent: true,
        onSend: jest.fn(),
      },
    });

    render(<InputCapsuleBar inputConfig={config} displayOptions={defaultDisplayOptions} />);

    const input = screen.getByPlaceholderText('Ask anything');
    expect(input).toHaveValue('hello');

    fireEvent.change(input, { target: { value: 'hello world' } });
    expect(onChange).toHaveBeenCalledWith('hello world');
  });

  it('triggers onUploadClick when attachment plus button is clicked', () => {
    const onUploadClick = jest.fn();
    const config = createMockInputConfig({
      attachments: {
        files: [],
        onRemove: jest.fn(),
        onUploadClick,
      },
    });

    render(<InputCapsuleBar inputConfig={config} displayOptions={defaultDisplayOptions} />);

    const uploadButton = screen.getByRole('button', { name: /add attachment or pdf/i });
    fireEvent.click(uploadButton);
    expect(onUploadClick).toHaveBeenCalledTimes(1);
  });

  it('handles Think toggle button clicks', () => {
    const toggleThink = jest.fn();
    const config = createMockInputConfig({
      toggles: {
        think: { active: false, toggle: toggleThink },
        voice: { listening: false, toggle: jest.fn() },
      },
    });

    render(<InputCapsuleBar inputConfig={config} displayOptions={defaultDisplayOptions} />);

    const thinkButton = screen.getByRole('button', { name: /think/i });
    fireEvent.click(thinkButton);
    expect(toggleThink).toHaveBeenCalledTimes(1);
  });

  it('handles Voice toggle button clicks', () => {
    const toggleVoice = jest.fn();
    const config = createMockInputConfig({
      toggles: {
        think: { active: false, toggle: jest.fn() },
        voice: { listening: false, toggle: toggleVoice },
      },
    });

    render(<InputCapsuleBar inputConfig={config} displayOptions={defaultDisplayOptions} />);

    const voiceButton = screen.getByRole('button', { name: /voice input/i });
    fireEvent.click(voiceButton);
    expect(toggleVoice).toHaveBeenCalledTimes(1);
  });

  it('shows live voice button when showLiveVoiceWhenEmpty is true and query is empty', () => {
    const config = createMockInputConfig({
      query: {
        value: '',
        onChange: jest.fn(),
        onKeyDown: jest.fn(),
        hasContent: false,
        onSend: jest.fn(),
      },
    });

    render(
      <InputCapsuleBar
        inputConfig={config}
        displayOptions={{ placeholder: 'Ask anything', showLiveVoiceWhenEmpty: true }}
      />
    );

    expect(screen.getByRole('button', { name: /live voice mode/i })).toBeInTheDocument();
  });

  it('calls onSend when send button is clicked with content present', () => {
    const onSend = jest.fn();
    const config = createMockInputConfig({
      query: {
        value: 'Write code',
        onChange: jest.fn(),
        onKeyDown: jest.fn(),
        hasContent: true,
        onSend,
      },
    });

    render(<InputCapsuleBar inputConfig={config} displayOptions={defaultDisplayOptions} />);

    const sendButton = screen.getByRole('button', { name: /send message/i });
    expect(sendButton).not.toBeDisabled();

    fireEvent.click(sendButton);
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it('disables send button when generating', () => {
    const config = createMockInputConfig({
      query: {
        value: 'Write code',
        onChange: jest.fn(),
        onKeyDown: jest.fn(),
        hasContent: true,
        onSend: jest.fn(),
      },
      isGenerating: true,
    });

    render(<InputCapsuleBar inputConfig={config} displayOptions={defaultDisplayOptions} />);

    const sendButton = screen.getByRole('button', { name: /send message/i });
    expect(sendButton).toBeDisabled();
  });
});
