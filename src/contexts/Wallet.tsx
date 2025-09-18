/* eslint-disable no-case-declarations */
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { ethers } from 'ethers';
import { WalletState, Network } from '../types/bridge';
import { SEPOLIA_NETWORK, PRUV_NETWORK } from '../config/networks';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  walletState: WalletState;
  provider: ethers.BrowserProvider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (network: Network) => Promise<void>;
  getCurrentNetwork: () => Network | null;
  refreshBalance: () => Promise<void>;
  isLoading: boolean;
}

type WalletAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | {
      type: 'SET_CONNECTED';
      payload: { address: string; chainId: string; balance: string };
    }
  | { type: 'SET_DISCONNECTED' }
  | { type: 'UPDATE_BALANCE'; payload: string }
  | { type: 'UPDATE_CHAIN'; payload: string }
  | { type: 'RESTORE_STATE'; payload: WalletState };

interface WalletContextState {
  walletState: WalletState;
  provider: ethers.BrowserProvider | null;
  isLoading: boolean;
}

const initialState: WalletContextState = {
  walletState: {
    connected: false,
    address: null,
    chainId: null,
    balance: null,
  },
  provider: null,
  isLoading: false,
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const STORAGE_KEY = 'wallet_state';

// Save state to localStorage
const saveToStorage = (state: WalletState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save wallet state:', error);
  }
};

const loadFromStorage = (): WalletState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load wallet state:', error);
    return null;
  }
};

const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear wallet state:', error);
  }
};

const walletReducer = (
  state: WalletContextState,
  action: WalletAction,
): WalletContextState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_CONNECTED':
      const connectedState = {
        connected: true,
        address: action.payload.address,
        chainId: action.payload.chainId,
        balance: action.payload.balance,
      };
      saveToStorage(connectedState);
      return { ...state, walletState: connectedState };

    case 'SET_DISCONNECTED':
      const disconnectedState = {
        connected: false,
        address: null,
        chainId: null,
        balance: null,
      };
      clearStorage();
      return { ...state, walletState: disconnectedState };

    case 'UPDATE_BALANCE':
      const balanceUpdatedState = {
        ...state.walletState,
        balance: action.payload,
      };
      saveToStorage(balanceUpdatedState);
      return { ...state, walletState: balanceUpdatedState };

    case 'UPDATE_CHAIN':
      const chainUpdatedState = {
        ...state.walletState,
        chainId: action.payload,
      };
      saveToStorage(chainUpdatedState);
      return { ...state, walletState: chainUpdatedState };

    case 'RESTORE_STATE':
      return { ...state, walletState: action.payload };

    default:
      return state;
  }
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);
  const [provider, setProvider] = React.useState<ethers.BrowserProvider | null>(
    null,
  );

  // Initialize provider and restore state
  useEffect(() => {
    const initializeWallet = async () => {
      if (window.ethereum) {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(ethProvider);

        // Restore state from localStorage
        const savedState = loadFromStorage();
        if (savedState && savedState.connected) {
          dispatch({ type: 'RESTORE_STATE', payload: savedState });

          // Verify the connection is still valid
          try {
            const accounts = await window.ethereum.request({
              method: 'eth_accounts',
            });
            if (accounts.length === 0 || accounts[0] !== savedState.address) {
              // Connection is no longer valid, disconnect
              dispatch({ type: 'SET_DISCONNECTED' });
            } else {
              // Refresh balance and chain info
              const chainId = await window.ethereum.request({
                method: 'eth_chainId',
              });
              const balance = await getBalance(accounts[0], ethProvider);

              dispatch({
                type: 'SET_CONNECTED',
                payload: {
                  address: accounts[0],
                  chainId,
                  balance,
                },
              });
            }
          } catch (error) {
            console.error('Error verifying connection:', error);
            dispatch({ type: 'SET_DISCONNECTED' });
          }
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            dispatch({ type: 'SET_DISCONNECTED' });
          } else if (accounts[0] !== state.walletState.address) {
            // Account changed, reconnect
            handleAccountChange(accounts[0], ethProvider);
          }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId: string) => {
          dispatch({ type: 'UPDATE_CHAIN', payload: chainId });
          // Refresh balance when chain changes
          if (state.walletState.address) {
            refreshBalance(state.walletState.address, ethProvider);
          }
        });
      }
    };

    initializeWallet();

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const handleAccountChange = async (
    address: string,
    ethProvider: ethers.BrowserProvider,
  ) => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const balance = await getBalance(address, ethProvider);

      dispatch({
        type: 'SET_CONNECTED',
        payload: { address, chainId, balance },
      });
    } catch (error) {
      console.error('Error handling account change:', error);
    }
  };

  const getBalance = async (
    address: string,
    ethProvider?: ethers.BrowserProvider,
  ): Promise<string> => {
    try {
      const providerToUse = ethProvider || provider;
      if (!providerToUse) return '0';

      const balance = await providerToUse.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: true });

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const balance = await getBalance(accounts[0]);

      dispatch({
        type: 'SET_CONNECTED',
        payload: {
          address: accounts[0],
          chainId,
          balance,
        },
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const disconnectWallet = () => {
    dispatch({ type: 'SET_DISCONNECTED' });
  };

  const switchNetwork = async (network: Network) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: network.chainId,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                nativeCurrency: network.nativeCurrency,
                blockExplorerUrls: network.blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      } else {
        console.error('Error switching network:', switchError);
      }
    }
  };

  const getCurrentNetwork = (): Network | null => {
    if (state.walletState.chainId === SEPOLIA_NETWORK.chainId) {
      return SEPOLIA_NETWORK;
    } else if (state.walletState.chainId === PRUV_NETWORK.chainId) {
      return PRUV_NETWORK;
    }
    return null;
  };

  const refreshBalance = async () => {
    if (state.walletState.address && provider) {
      const balance = await getBalance(state.walletState.address);
      dispatch({ type: 'UPDATE_BALANCE', payload: balance });
    }
  };

  const value: WalletContextType = {
    walletState: state.walletState,
    provider,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    getCurrentNetwork,
    refreshBalance,
    isLoading: state.isLoading,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
