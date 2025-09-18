import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Network } from '../types/bridge';

interface NetworkSelectorProps {
  fromNetwork: Network;
  toNetwork: Network;
  onSwapNetworks: () => void;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  fromNetwork,
  toNetwork,
  onSwapNetworks,
}) => {
  return (
    <div className="flex items-center justify-between bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="flex-1">
        <div className="text-sm text-gray-400 mb-2">From</div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {fromNetwork.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-white font-semibold">{fromNetwork.name}</div>
            <div className="text-sm text-gray-400">{fromNetwork.nativeCurrency.symbol}</div>
          </div>
        </div>
      </div>

      <button
        onClick={onSwapNetworks}
        className="mx-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors duration-200 border border-white/20"
      >
        <ArrowUpDown className="w-5 h-5 text-white" />
      </button>

      <div className="flex-1">
        <div className="text-sm text-gray-400 mb-2">To</div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {toNetwork.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-white font-semibold">{toNetwork.name}</div>
            <div className="text-sm text-gray-400">{toNetwork.nativeCurrency.symbol}</div>
          </div>
        </div>
      </div>
    </div>
  );
};