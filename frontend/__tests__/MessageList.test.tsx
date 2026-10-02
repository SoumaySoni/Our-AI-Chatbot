import React from 'react';
import { render, screen } from '@testing-library/react';
import { MessageList } from '@/components/MessageList';
import { Message, ChatInputConfig } from '@/types/chat';

describe('MessageList Component', () => {
  const createMockInputConfig = (overrides?: Partial<ChatInputConfig>): ChatInputConfig => ({
    query: {
      value: '',
      onChange: jest.fn(),
      onKeyDown: jest.fn(),
      hasContent: false,
      onSend: jest.fn(),
    },
    toggles: {
      think: { active: false, toggle: jest.fn() },
      voice: { listening: false, toggle: jest.fn() },
    },
    attachments: {
      files: [],
      onRemove: jest.fn(),
      onUploadClick: jest.fn(),
    },
    isGenerating: false,
    ...overrides,
  });

  it('renders user and assistant messages', () => {
    const messages: Message[] = [
      { id: '1', role: 'user', text: 'Hello AI' },
      { id: '2', role: 'assistant', text: 'Hello human!' },
    ];
    const bottomRef = React.createRef<HTMLDivElement>();
    const config = createMockInputConfig();

    render(<MessageList messages={messages} chatBottomRef={bottomRef} inputConfig={config} />);

    expect(screen.getByText('Hello AI')).toBeInTheDocument();
    expect(screen.getByText('Hello human!')).toBeInTheDocument();
  });

  it('renders user attachments within the user message bubble', () => {
    const messages: Message[] = [
      {
        id: '1',
        role: 'user',
        text: 'Review this file',
        attachments: [
          {
            id: 'att-1',
            name: 'sample.pdf',
            size: '100 KB',
            type: 'PDF',
            file: new File([], 'sample.pdf'),
          },
        ],
      },
    ];
    const bottomRef = React.createRef<HTMLDivElement>();
    const config = createMockInputConfig();

    render(<MessageList messages={messages} chatBottomRef={bottomRef} inputConfig={config} />);

    expect(screen.getByText('Review this file')).toBeInTheDocument();
    expect(screen.getByText('sample.pdf')).toBeInTheDocument();
  });

  it('shows think mode badge when thinkMode is true', () => {
    const messages: Message[] = [
      { id: '1', role: 'assistant', text: 'Calculated response', thinkMode: true },
    ];
    const bottomRef = React.createRef<HTMLDivElement>();
    const config = createMockInputConfig();

    render(<MessageList messages={messages} chatBottomRef={bottomRef} inputConfig={config} />);

    expect(screen.getByText('Deep Thought Logic')).toBeInTheDocument();
    expect(screen.getByText('Calculated response')).toBeInTheDocument();
  });

  it('shows generating response placeholder when assistant message text is empty', () => {
    const messages: Message[] = [{ id: '1', role: 'assistant', text: '' }];
    const bottomRef = React.createRef<HTMLDivElement>();
    const config = createMockInputConfig({ isGenerating: true });

    render(<MessageList messages={messages} chatBottomRef={bottomRef} inputConfig={config} />);

    expect(screen.getByText('Generating response...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Please wait for response...')).toBeInTheDocument();
  });
});
