import React, { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { verifySignature } from '../../services/api';
import type { SignedMessage } from '../../types';
import './MessageSigner.css';

interface MessageSignerProps {
  onMessageSigned?: (signedMessage: SignedMessage) => void;
}

export const MessageSigner: React.FC<MessageSignerProps> = ({ onMessageSigned }) => {
  const { primaryWallet } = useDynamicContext();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SignedMessage | null>(null);

  const handleSignMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message to sign');
      return;
    }

    if (!primaryWallet) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Sign the message using Dynamic wallet
      const signature = await primaryWallet.signMessage(message);
      const address = primaryWallet.address;

      // Verify the signature with backend
      const verificationResult = await verifySignature(message, signature, address);

      // Create signed message object
      const signedMessage: SignedMessage = {
        id: Date.now().toString(),
        message,
        signature,
        address,
        timestamp: Date.now(),
        isValid: verificationResult.isValid,
      };

      setResult(signedMessage);
      
      // Call the callback if provided
      if (onMessageSigned) {
        onMessageSigned(signedMessage);
      }

      // Clear the input
      setMessage('');
    } catch (err) {
      console.error('Error signing message:', err);
      setError('Failed to sign or verify message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearResult = () => {
    setResult(null);
    setError('');
  };

  return (
    <div className="message-signer">
      <div className="signer-card">
        <h2>Sign a Message</h2>
        <p className="subtitle">Enter a custom message to sign with your wallet</p>

        <form onSubmit={handleSignMessage} className="signer-form">
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={4}
              disabled={isLoading}
              className="message-input"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="btn-sign"
          >
            {isLoading ? 'Signing & Verifying...' : 'Sign Message'}
          </button>
        </form>

        {result && (
          <div className="result-section">
            <div className="result-header">
              <h3>Signature Result</h3>
              <button onClick={handleClearResult} className="btn-clear">
                Clear
              </button>
            </div>

            <div className={`verification-badge ${result.isValid ? 'valid' : 'invalid'}`}>
              {result.isValid ? '✓ Verified' : '✗ Invalid'}
            </div>

            <div className="result-details">
              <div className="detail-item">
                <label>Original Message:</label>
                <div className="detail-value message-text">{result.message}</div>
              </div>

              <div className="detail-item">
                <label>Signature:</label>
                <div className="detail-value signature-text">{result.signature}</div>
              </div>

              <div className="detail-item">
                <label>Signer Address:</label>
                <div className="detail-value address-text">{result.address}</div>
              </div>

              <div className="detail-item">
                <label>Signed At:</label>
                <div className="detail-value">
                  {new Date(result.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

