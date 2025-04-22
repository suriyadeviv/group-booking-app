import { render, screen, fireEvent } from '@testing-library/react';
import AccordionSection from '../AccordionSection';

describe('AccordionSection', () => {
  const defaultProps = {
    id: 'section-1',
    title: 'Test Title',
    children: <div>Test Content</div>,
    onToggle: jest.fn(),
  };

  it('renders title and content', () => {
    render(<AccordionSection {...defaultProps} isActive={true} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-content')).toBeInTheDocument();
  });

  it('hides content when inactive', () => {
    render(<AccordionSection {...defaultProps} isActive={false} />);
    const content = screen.getByTestId('accordion-content');
    expect(content).toHaveClass('hidden');
  });
  

  it('calls onToggle when clicked', () => {
    render(<AccordionSection {...defaultProps} isActive={false} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  it('applies dark theme classes', () => {
    render(<AccordionSection {...defaultProps} isActive={true} theme="dark" />);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/text-gray-300/);
  });

  it('applies rounded corners for first and last sections', () => {
    const { container } = render(<AccordionSection {...defaultProps} isFirst={true} isLast={true} isActive={true} />);
    const wrapperDiv = container.firstChild as HTMLElement;
    expect(wrapperDiv.className).toMatch(/rounded-t-xl/);
    expect(wrapperDiv.className).toMatch(/rounded-b-xl/);
  });
});
