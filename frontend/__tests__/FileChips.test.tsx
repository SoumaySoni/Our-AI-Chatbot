import { render, screen, fireEvent } from '@testing-library/react';
import { FileChips } from '@/components/FileChips';
import { ChatAttachmentConfig, AttachedFile } from '@/types/chat';

describe('FileChips Component', () => {
  const mockFile1: AttachedFile = {
    id: 'file-1',
    name: 'document.pdf',
    size: '1.2 MB',
    type: 'PDF',
    file: new File(['dummy'], 'document.pdf', { type: 'application/pdf' }),
  };

  const mockFile2: AttachedFile = {
    id: 'file-2',
    name: 'notes.txt',
    size: '15 KB',
    type: 'TXT',
    file: new File(['dummy'], 'notes.txt', { type: 'text/plain' }),
  };

  it('renders nothing when there are no attachments', () => {
    const config: ChatAttachmentConfig = {
      files: [],
      onRemove: jest.fn(),
      onUploadClick: jest.fn(),
    };

    const { container } = render(<FileChips attachments={config} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders attachment details (name, type, size)', () => {
    const config: ChatAttachmentConfig = {
      files: [mockFile1, mockFile2],
      onRemove: jest.fn(),
      onUploadClick: jest.fn(),
    };

    render(<FileChips attachments={config} />);

    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('PDF • 1.2 MB')).toBeInTheDocument();

    expect(screen.getByText('notes.txt')).toBeInTheDocument();
    expect(screen.getByText('TXT • 15 KB')).toBeInTheDocument();
  });

  it('calls onRemove with the correct file ID when remove button is clicked', () => {
    const onRemove = jest.fn();
    const config: ChatAttachmentConfig = {
      files: [mockFile1, mockFile2],
      onRemove,
      onUploadClick: jest.fn(),
    };

    render(<FileChips attachments={config} />);

    const removeButtons = screen.getAllByRole('button', { name: /remove attachment/i });
    expect(removeButtons).toHaveLength(2);

    fireEvent.click(removeButtons[0]);
    expect(onRemove).toHaveBeenCalledWith('file-1');

    fireEvent.click(removeButtons[1]);
    expect(onRemove).toHaveBeenCalledWith('file-2');
  });
});
