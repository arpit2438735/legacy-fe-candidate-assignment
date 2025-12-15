import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { DynamicContextProvider, useDynamicContext as useDynamicSDK } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

interface DynamicWrapperProps {
  children: ReactNode;
}

// Context for accessing Dynamic state outside of DynamicContextProvider
interface WalletContextType {
  isAuthenticated: boolean;
  userAddress: string | null;
  primaryWallet: any;
}

const WalletContext = createContext<WalletContextType>({
  isAuthenticated: false,
  userAddress: null,
  primaryWallet: null,
});

export const useDynamicWallet = () => useContext(WalletContext);

// Inner component that accesses Dynamic SDK
const WalletStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { primaryWallet } = useDynamicSDK();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const isAuthenticated = !!primaryWallet;

  useEffect(() => {
    if (primaryWallet) {
      setUserAddress(primaryWallet.address || null);
    } else {
      setUserAddress(null);
    }
  }, [primaryWallet]);

  return (
    <WalletContext.Provider 
      value={{ 
        isAuthenticated, 
        userAddress,
        primaryWallet 
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Main wrapper that provides Dynamic SDK
export const DynamicWrapper: React.FC<DynamicWrapperProps> = ({ children }) => {
  const environmentId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID;

  if (!environmentId) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        Error: VITE_DYNAMIC_ENVIRONMENT_ID is not set in environment variables.
        Please create a .env file with your Dynamic.xyz environment ID.
      </div>
    );
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WalletStateProvider>
        {children}
      </WalletStateProvider>
    </DynamicContextProvider>
  );
};

