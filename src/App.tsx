import React, { useState } from 'react';
import { Header } from './components/Header';
import { NetworkSelector } from './components/NetworkSelector';
import { BridgeForm } from './components/BridgeForm';
import { Stats } from './components/Stats';
import { SEPOLIA_NETWORK, PRUV_NETWORK } from './config/networks';
import { Network } from './types/bridge';

function App() {
  const [fromNetwork, setFromNetwork] = useState<Network>(SEPOLIA_NETWORK);
  const [toNetwork, setToNetwork] = useState<Network>(PRUV_NETWORK);

  const handleSwapNetworks = () => {
    setFromNetwork(toNetwork);
    setToNetwork(fromNetwork);
  };

  return (
    <div className="min-h-screen gradient-bg-welcome">
      <div className="relative z-10">
        <Header />

        <main className="flex flex-col items-center px-6 pb-12 gradient-bg-welcome">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-clip-text text-transparent">
              Bridge Your Assets
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Seamlessly transfer your tokens between Sepolia and Pruv networks
              with our secure, fast, and user-friendly bridge protocol.
            </p>
          </div>

          <Stats />

          <div className="w-full max-w-md space-y-6">
            <NetworkSelector
              fromNetwork={fromNetwork}
              toNetwork={toNetwork}
              onSwapNetworks={handleSwapNetworks}
            />

            <BridgeForm fromNetwork={fromNetwork} toNetwork={toNetwork} />
          </div>

          <div className="mt-12 text-center gradient-bg-services p-6 rounded-xl border border-white/20 max-w-md w-full">
            <div className="text-gray-400 text-sm mb-4">Supported Networks</div>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                <span className="text-white">Sepolia</span>
              </div>
              <div className="w-8 h-px bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-full"></div>
                <span className="text-white">Pruv Testnet</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
