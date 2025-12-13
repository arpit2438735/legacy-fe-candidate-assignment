import React from 'react';
import type { SignedMessage } from '../../types';
import './MessageHistory.css';

interface MessageHistoryProps {
  messages: SignedMessage[];
  onClearHistory?: () => void;
}

export const MessageHistory: React.FC<MessageHistoryProps> = ({ 
  messages, 
  onClearHistory 
}) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  if (messages.length === 0) {
    return (
      <div className="message-history">
        <div className="history-card">
          <h2>Message History</h2>
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>No messages signed yet</p>
            <p className="empty-subtitle">
              Sign your first message above to see it here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-history">
      <div className="history-card">
        <div className="history-header">
          <h2>Message History ({messages.length})</h2>
          {onClearHistory && (
            <button onClick={onClearHistory} className="btn-clear-all">
              Clear All
            </button>
          )}
        </div>

        <div className="history-list">
          {messages.map((msg, index) => (
            <div key={msg.id} className="history-item">
              <div className="item-header">
                <span className="item-number">#{messages.length - index}</span>
                <span className="item-time">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
                <span className={`status-badge ${msg.isValid ? 'valid' : 'invalid'}`}>
                  {msg.isValid ? '✓ Verified' : '✗ Invalid'}
                </span>
              </div>

              <div className="item-content">
                <div className="item-message">
                  <strong>Message:</strong> {msg.message}
                </div>
                <div className="item-address">
                  <strong>Signer:</strong> {formatAddress(msg.address)}
                </div>
              </div>

              <details className="item-details">
                <summary>View Full Details</summary>
                <div className="details-content">
                  <div className="detail-row">
                    <span className="detail-label">Full Address:</span>
                    <span className="detail-value mono">{msg.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Signature:</span>
                    <span className="detail-value mono signature-wrap">
                      {msg.signature}
                    </span>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

