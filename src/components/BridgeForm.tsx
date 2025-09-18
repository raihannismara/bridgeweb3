import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { Network } from '../types/bridge';
import {
  BRIDGE_CONTRACT_ABI,
  BRIDGE_CONTRACT_ADDRESS,
} from '../config/networks';

interface BridgeFormProps {
  fromNetwork: Network;
  toNetwork: Network;
}

export const BridgeForm: React.FC<BridgeFormProps> = ({
  fromNetwork,
  toNetwork,
}) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { walletState, provider, switchNetwork, getCurrentNetwork } =
    useWallet();

  const handleBridge = async () => {
    if (!walletState.connected || !provider || !amount || !address) return;

    setIsLoading(true);
    setTxHash(null);

    try {
      const currentNetwork = getCurrentNetwork();

      if (currentNetwork?.chainId !== fromNetwork.chainId) {
        await switchNetwork(fromNetwork);
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        address || BRIDGE_CONTRACT_ADDRESS,
        BRIDGE_CONTRACT_ABI,
        signer,
      );

      console.log(contract);

      const tx = await signer.sendTransaction({
        to: address || BRIDGE_CONTRACT_ADDRESS,
        value: ethers.parseEther(amount),
        gasLimit: 100000,
      });

      setTxHash(tx.hash);

      await tx.wait();

      alert(`Bridge transaction successful! Hash: ${tx.hash}`);
    } catch (error) {
      console.error('Bridge error:', error);
      alert('Bridge transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidAmount = () => {
    if (!amount || isNaN(Number(amount))) return false;
    const numAmount = Number(amount);
    const balance = Number(walletState.balance || '0');
    return numAmount > 0 && numAmount <= balance;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">
          Recipient Address
        </label>
        <div className="relative">
          <input
            required
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Input recipient address"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white text-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">
          Amount to Bridge
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white text-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="absolute right-4 top-4 flex items-center space-x-2">
            <span className="text-gray-400">
              {fromNetwork.nativeCurrency.symbol}
            </span>
            <button
              onClick={() => setAmount(walletState.balance || '0')}
              className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
              MAX
            </button>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>
            Balance: {Number(walletState.balance || '0').toFixed(4)}{' '}
            {fromNetwork.nativeCurrency.symbol}
          </span>
          <span>~$0.00 USD</span>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="text-sm text-blue-400 mb-1">You will receive</div>
        <div className="text-2xl text-white font-semibold">
          {amount || '0.0'} {toNetwork.nativeCurrency.symbol}
        </div>
      </div>

      {txHash && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="text-sm text-green-400 mb-1">Transaction Hash</div>
          <div className="text-white font-mono text-sm break-all">{txHash}</div>
        </div>
      )}

      <button
        onClick={handleBridge}
        disabled={
          !walletState.connected || !isValidAmount() || isLoading || !address
        }
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center space-x-2">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Send Token</span>
          </>
        )}
      </button>

      {!walletState.connected && (
        <div className="mt-4 text-center text-gray-400 text-sm">
          Connect your wallet to start bridging
        </div>
      )}
    </div>
  );
};
