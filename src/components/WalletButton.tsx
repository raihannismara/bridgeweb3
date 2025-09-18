import React from 'react';
import { Wallet, ChevronDown } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

export const WalletButton: React.FC = () => {
  const { walletState, connectWallet, getCurrentNetwork } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    return parseFloat(balance).toFixed(4);
  };

  if (!walletState.connected) {
    return (
      <button
        onClick={connectWallet}
        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
        <Wallet className="w-5 h-5" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  const currentNetwork = getCurrentNetwork();

  return (
    <div className="flex items-center space-x-3">
      {currentNetwork && (
        <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/20">
          <span className="text-sm font-medium">{currentNetwork.name}</span>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/20 flex items-center space-x-2">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">
            {formatAddress(walletState.address!)}
          </span>
          <span className="text-xs text-gray-300">
            {formatBalance(walletState.balance || '0')}{' '}
            {currentNetwork?.nativeCurrency.symbol}
          </span>
        </div>
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
};
