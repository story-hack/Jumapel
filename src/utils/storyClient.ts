import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { WalletClient, http, Account } from 'viem';

export const createStoryClient = (walletClient: WalletClient) => {
  if (!walletClient?.account) {
    throw new Error('Wallet account not available');
  }

  // Ensure account is properly formatted
  const account: Account = {
    address: walletClient.account.address,
    type: walletClient.account.type || 'json-rpc',
    ...walletClient.account
  };

  const config: StoryConfig = {
    account: account,
    chainId: 'aeneid',
    transport: http('https://aeneid.storyrpc.io'),
    wallet: walletClient,
  };

  console.log('Creating Story client with config:', {
    accountAddress: account.address,
    accountType: account.type,
    chainId: config.chainId
  });

  return StoryClient.newClient(config);
};
