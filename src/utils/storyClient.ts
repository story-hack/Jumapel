import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { WalletClient, http } from 'viem';

export const createStoryClient = (walletClient: WalletClient) => {
  if (!walletClient?.account) {
    throw new Error('Wallet account not available');
  }

  const config: StoryConfig = {
    account: walletClient.account,
    chainId: 'aeneid',
    transport: http('https://aeneid.storyrpc.io'),
    wallet: walletClient, // Pass the wallet client directly
  };

  return StoryClient.newClient(config);
};