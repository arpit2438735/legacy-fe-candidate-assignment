import React, { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useDynamicWallet } from '../../contexts/DynamicContext';
import { MessageSigner } from '../MessageSigner/MessageSigner';
import { MessageHistory } from '../MessageHistory/MessageHistory';
import type { SignedMessage } from '../../types';
import './Dashboard.css';

const STORAGE_KEY = 'web3_signed_messages';

export const Dashboard: React.FC = () => {
  const { handleLogOut } = useDynamicContext();
  const { userAddress } = useDynamicWallet();
  const [signedMessages, setSignedMessages] = useState<SignedMessage[]>([]);

  // Load messages from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const messages = JSON.parse(stored);
        setSignedMessages(messages);
      } catch (error) {
        console.error('Error loading messages from storage:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (signedMessages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(signedMessages));
    }
  }, [signedMessages]);

  const handleMessageSigned = (newMessage: SignedMessage) => {
    setSignedMessages((prev) => [newMessage, ...prev]);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all message history?')) {
      setSignedMessages([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🔐 Web3 Message Signer</h1>
          {userAddress && (
            <div className="wallet-info">
              <div className="wallet-badge">
                <span className="wallet-address">{formatAddress(userAddress)}</span>
              </div>
              <button onClick={handleLogOut} className="btn-logout">
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-content">
        <MessageSigner onMessageSigned={handleMessageSigned} />
        <MessageHistory 
          messages={signedMessages} 
          onClearHistory={handleClearHistory}
        />
      </div>
    </div>
  );
};

