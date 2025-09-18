export interface Network {
  chainId: string;
  name: string;
  rpcUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
}

export interface BridgeTransaction {
  hash: string;
  amount: string;
  fromNetwork: string;
  toNetwork: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: string | null;
  balance: string | null;
}