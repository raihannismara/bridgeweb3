import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WalletProvider } from './contexts/Wallet.tsx';

createRoot(document.getElementById('root')!).render(
  <WalletProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </WalletProvider>,
);
