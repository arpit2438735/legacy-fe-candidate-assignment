import React, { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import './HeadlessAuth.css';

export const HeadlessAuth: React.FC = () => {
  const { setShowAuthFlow } = useDynamicContext();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Trigger Dynamic's auth flow programmatically
      setShowAuthFlow(true);
    } catch (err) {
      setError('Failed to initiate authentication');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Web3 Message Signer</h1>
          <p>Sign and verify messages on the blockchain</p>
        </div>

        <form onSubmit={handleEmailLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="input-field"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email}
            className="btn-primary"
          >
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="info-text">
            Powered by Dynamic.xyz Embedded Wallet
          </p>
        </div>
      </div>
    </div>
  );
};

