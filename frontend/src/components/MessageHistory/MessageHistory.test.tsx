import { render, screen, fireEvent } from '@testing-library/react';
import { MessageHistory } from './MessageHistory';
import type { SignedMessage } from '../../types';

describe('MessageHistory', () => {
  const mockMessages: SignedMessage[] = [
    {
      id: '1',
      message: 'Test message 1',
      signature: '0xsig1',
      address: '0x1234567890abcdef',
      timestamp: Date.now(),
      isValid: true,
    },
    {
      id: '2',
      message: 'Test message 2',
      signature: '0xsig2',
      address: '0xabcdef1234567890',
      timestamp: Date.now() - 1000,
      isValid: false,
    },
  ];

  it('should render empty state when no messages', () => {
    render(<MessageHistory messages={[]} />);
    expect(screen.getByText('No messages signed yet')).toBeInTheDocument();
    expect(screen.getByText('Sign your first message above to see it here')).toBeInTheDocument();
  });

  it('should render message history with messages', () => {
    render(<MessageHistory messages={mockMessages} />);
    expect(screen.getByText(`Message History (${mockMessages.length})`)).toBeInTheDocument();
    expect(screen.getByText('Test message 1')).toBeInTheDocument();
    expect(screen.getByText('Test message 2')).toBeInTheDocument();
  });

  it('should display verification badges correctly', () => {
    render(<MessageHistory messages={mockMessages} />);
    const badges = screen.getAllByText(/Verified|Invalid/);
    expect(badges).toHaveLength(2);
  });

  it('should call onClearHistory when clear button is clicked', () => {
    const onClearHistory = jest.fn();
    render(<MessageHistory messages={mockMessages} onClearHistory={onClearHistory} />);
    
    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);
    
    expect(onClearHistory).toHaveBeenCalledTimes(1);
  });

  it('should format addresses correctly', () => {
    render(<MessageHistory messages={[mockMessages[0]]} />);
    // Address 0x1234567890abcdef should be formatted as 0x123456...abcdef
    expect(screen.getByText('0x123456...abcdef')).toBeInTheDocument();
  });
});

