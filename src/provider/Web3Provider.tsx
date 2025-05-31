"use client";
import '@tomo-inc/tomo-evm-kit/styles.css'
import { getDefaultConfig, TomoEVMKitProvider } from '@tomo-inc/tomo-evm-kit'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { mainnet, polygon, optimism, arbitrum, base, storyAeneid } from 'wagmi/chains'
import { metaMaskWallet, rainbowWallet, walletConnectWallet } from '@tomo-inc/tomo-evm-kit/wallets'
import { darkTheme } from '@tomo-inc/tomo-evm-kit'


const config = getDefaultConfig({
  clientId: process.env.NEXT_PUBLIC_TOMO_CLIENT_ID,
  appName: 'Jumapel',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [mainnet, polygon, optimism, arbitrum, base, storyAeneid],
  ssr: true,
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
})

const queryClient = new QueryClient()

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TomoEVMKitProvider 
          // theme={darkTheme({
          //   accentColor: "#6366f1",
          //   accentColorForeground: "white",
          // })}
        >
          {children}
        </TomoEVMKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}