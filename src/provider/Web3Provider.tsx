"use client";
import '@tomo-inc/tomo-evm-kit/styles.css'
import { getDefaultConfig, TomoEVMKitProvider, lightTheme } from '@tomo-inc/tomo-evm-kit'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { storyAeneid } from 'wagmi/chains'
import { metaMaskWallet, rainbowWallet, walletConnectWallet } from '@tomo-inc/tomo-evm-kit/wallets'
import { useEffect, useState } from 'react'

// Configure the Story Protocol chain
const storyProtocolChain = {
  ...storyAeneid,
  rpcUrls: {
    default: {
      http: ['https://aeneid.storyrpc.io'],
    },
    public: {
      http: ['https://aeneid.storyrpc.io'],
    },
  },
};

const queryClient = new QueryClient()

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const config = getDefaultConfig({
    clientId: process.env.NEXT_PUBLIC_TOMO_CLIENT_ID,
    appName: 'Jumapel',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    chains: [storyProtocolChain],
    ssr: false, // Disable SSR for WalletConnect
    wallets: [
      {
        groupName: 'Popular',
        wallets: [
          metaMaskWallet,
          rainbowWallet,
          walletConnectWallet,
        ],
      },
    ],
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TomoEVMKitProvider
          socialsFirst={false}
          theme={lightTheme({
            fontStack: 'system',
            overlayBlur: 'small',
            borderRadius: 'medium',
            accentColorForeground: 'white',
          })}
        >
          {children}
        </TomoEVMKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}