import { http } from "viem";
import { Account, privateKeyToAccount } from "viem/accounts";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";

const privateKey = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY;
if (!privateKey) {
  throw new Error('NEXT_PUBLIC_WALLET_PRIVATE_KEY environment variable is not set');
}

const cleanPrivateKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
if (!/^[0-9a-fA-F]{64}$/.test(cleanPrivateKey)) {
  throw new Error('Invalid private key format. Must be a 64-character hex string');
}

const account: Account = privateKeyToAccount(`0x${cleanPrivateKey}`);

const config: StoryConfig = {
  account: account, // the account object from above
  transport: http(process.env.RPC_PROVIDER_URL),
  chainId: "aeneid",
};
export const client = StoryClient.newClient(config);
