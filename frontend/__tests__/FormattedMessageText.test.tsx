import { render, screen } from '@testing-library/react';
import { FormattedMessageText } from '@/components/FormattedMessageText';

describe('FormattedMessageText Component', () => {
  it('renders simple plain text correctly', () => {
    render(<FormattedMessageText text="Hello, world!" />);
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('renders bold text within <strong> tags', () => {
    render(<FormattedMessageText text="This is **bold** text" />);
    
    const strongElement = screen.getByText('bold');
    expect(strongElement.tagName).toBe('STRONG');
    expect(strongElement).toHaveClass('font-semibold');
  });

  it('handles multiple paragraphs and empty lines', () => {
    const text = "First line\n\nSecond line";
    const { container } = render(<FormattedMessageText text={text} />);

    expect(screen.getByText('First line')).toBeInTheDocument();
    expect(screen.getByText('Second line')).toBeInTheDocument();

    const emptySpacers = container.querySelectorAll('div.h-1');
    expect(emptySpacers.length).toBe(1);
  });

  it('handles multiple bold sections in a single line', () => {
    render(<FormattedMessageText text="**Alpha** and **Beta**" />);

    const boldAlpha = screen.getByText('Alpha');
    const boldBeta = screen.getByText('Beta');

    expect(boldAlpha.tagName).toBe('STRONG');
    expect(boldBeta.tagName).toBe('STRONG');
  });
});
