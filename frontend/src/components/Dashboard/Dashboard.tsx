import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useDynamicWallet } from '../../contexts/DynamicContext';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { handleLogOut } = useDynamicContext();
  const { userAddress } = useDynamicWallet();

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
                <span className="wallet-icon">👛</span>
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
        <div className="welcome-card">
          <h2>Welcome! 🎉</h2>
          <p>Your wallet is successfully connected.</p>
          <p className="full-address">
            <strong>Full Address:</strong> {userAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

