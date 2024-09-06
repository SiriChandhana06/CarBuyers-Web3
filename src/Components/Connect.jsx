import React from 'react';
import { useEffect } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {ConnectButton,getDefaultConfig,RainbowKitProvider,} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  sepolia,
  optimism,
  arbitrum,
  base,
  zora
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
const queryClient = new QueryClient();


const Button = () => {
  
  return (
    <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
       
        <ConnectButton />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Button
