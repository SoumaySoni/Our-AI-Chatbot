import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/Header';

describe('Header Component', () => {
  it('renders the branding title and new chat button', () => {
    const handleReset = jest.fn();
    render(<Header onResetChat={handleReset} />);

    expect(screen.getByText('Our AI Chatbot')).toBeInTheDocument();
    expect(screen.getByText('New chat')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new chat/i })).toBeInTheDocument();
  });

  it('calls onResetChat when the branding area is clicked', () => {
    const handleReset = jest.fn();
    render(<Header onResetChat={handleReset} />);

    const brandElement = screen.getByText('Our AI Chatbot');
    fireEvent.click(brandElement);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('calls onResetChat when the New chat button is clicked', () => {
    const handleReset = jest.fn();
    render(<Header onResetChat={handleReset} />);

    const newChatButton = screen.getByRole('button', { name: /new chat/i });
    fireEvent.click(newChatButton);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
