import { Network } from '../types/bridge';

export const SEPOLIA_NETWORK: Network = {
  chainId: '0xaa36a7',
  name: 'Sepolia',
  rpcUrl: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

export const PRUV_NETWORK: Network = {
  chainId: '0x267', // 615 in decimal
  name: 'Pruv Testnet',
  rpcUrl: import.meta.env.VITE_RPC_URL || 'http://localhost:8545',
  nativeCurrency: {
    name: 'Pruv',
    symbol: 'PRUV',
    decimals: 18,
  },
  blockExplorerUrls: [
    import.meta.env.VITE_BLOCK_EXPLORER_URL || 'http://localhost:8545',
  ],
};

export const BRIDGE_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_logic', type: 'address' },
      { internalType: 'address', name: 'admin_', type: 'address' },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
    ],
    stateMutability: 'payable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address',
      },
    ],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  { stateMutability: 'payable', type: 'fallback' },
  { stateMutability: 'payable', type: 'receive' },
];

export const BRIDGE_CONTRACT_ADDRESS = import.meta.env
  .VITE_BRIDGE_CONTRACT_ADDRESS; // Replace with actual contract address
