'use client';

import { getDefaultConfig, midnightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from "../constants/chains";

const config = getDefaultConfig({
  appName: "AgentChain app",
  projectId: "575083f997538bbe36e101019959af2e",
  chains: SUPPORTED_CHAINS,
  ssr: false,
});

const queryClient = new QueryClient();

export default function WagmiProviderContext({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          locale="en"
          initialChain={DEFAULT_CHAIN}
          showRecentTransactions={true}
          theme={midnightTheme()}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
