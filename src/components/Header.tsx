import React from 'react';
import { Grid as Bridge } from 'lucide-react';
import { WalletButton } from './WalletButton';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
          <Bridge className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">SubNets3</h1>
          <p className="text-gray-400 text-sm">Cross-chain asset bridge</p>
        </div>
      </div>

      <WalletButton />
    </header>
  );
};
