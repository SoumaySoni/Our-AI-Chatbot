import { render, screen } from '@testing-library/react';
import { HeroState } from '@/components/HeroState';
import { ChatInputConfig, AttachedFile } from '@/types/chat';

describe('HeroState Component', () => {
  const createMockInputConfig = (files: AttachedFile[] = []): ChatInputConfig => ({
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
      files,
      onRemove: jest.fn(),
      onUploadClick: jest.fn(),
    },
    isGenerating: false,
  });

  it('renders main heading and default placeholder when no files are attached', () => {
    const config = createMockInputConfig([]);
    render(<HeroState inputConfig={config} />);

    expect(screen.getByText('What’s on your mind today?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask anything')).toBeInTheDocument();
  });

  it('renders document-specific placeholder and attached files when files exist', () => {
    const mockFile: AttachedFile = {
      id: 'doc-1',
      name: 'report.pdf',
      size: '2 MB',
      type: 'PDF',
      file: new File([''], 'report.pdf', { type: 'application/pdf' }),
    };

    const config = createMockInputConfig([mockFile]);
    render(<HeroState inputConfig={config} />);

    expect(screen.getByPlaceholderText('Ask about this PDF or document...')).toBeInTheDocument();
    expect(screen.getByText('report.pdf')).toBeInTheDocument();
  });
});
