import { useState } from 'react';
import { useWalletClient, useSwitchChain, useChainId, useAccount } from 'wagmi';
import { parseEther, zeroAddress, Address } from 'viem';
import { IpMetadata } from '@story-protocol/core-sdk';
import { LicenseTerms } from '@story-protocol/core-sdk';
import { storyAeneid } from 'wagmi/chains';
import { createStoryClient } from '../utils/storyClient';

interface NftMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: { key: string; value: string }[];
}

interface MintNFTParams {
  ipMetadata: IpMetadata;
  nftMetadata: NftMetadata;
}

interface MintNFTResult {
  tokenId: bigint;
  ipId: Address;
  txHash: Address;
  licenseTermsIds: bigint[];
}

export const useMintNFT = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { isConnected, address } = useAccount();

  const mintNFT = async ({ ipMetadata, nftMetadata }: MintNFTParams): Promise<MintNFTResult | null> => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return null;
    }

    if (!walletClient?.account) {
      setError('Wallet not properly connected. Please try reconnecting your wallet.');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Ensure we're on the correct chain
      if (chainId !== storyAeneid.id) {
        try {
          await switchChain({ chainId: storyAeneid.id });
          // Wait a moment for the chain switch to complete
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch {
          setError('Failed to switch to Story Protocol chain. Please switch manually in your wallet.');
          return null;
        }
      }

      // 1. Upload metadata to IPFS via backend
      const uploadResponse = await fetch('/api/upload-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipMetadata, nftMetadata }),
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload metadata');
      }

      const { ipMetadataURI, ipMetadataHash, nftMetadataURI, nftMetadataHash } = await uploadResponse.json();
      
      // 2. Create Story Protocol client with connected wallet
      const storyClient = createStoryClient(walletClient);

      // 3. Define license terms with corrected values
      const brandIpaLicenseTerms: LicenseTerms = {
        transferable: true,
        royaltyPolicy: "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E",
        defaultMintingFee: parseEther("10"),
        expiration: 0n,
        commercialUse: true,
        commercialAttribution: true,
        commercializerChecker: zeroAddress,
        commercializerCheckerData: "0x",
        commercialRevShare: 15, // This should be a number, not in millions
        commercialRevCeiling: 0n,
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: true,
        derivativesReciprocal: true,
        derivativeRevCeiling: parseEther("100000"),
        currency: "0x1514000000000000000000000000000000000000",
        uri: ""
      };

      // 4. Mint NFT using connected wallet - use address from useAccount hook
      const response = await storyClient.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: "0x95f8c494Bf35912921f3Fd654381612Ea5990244", // customnftcollection
        licenseTermsData: [{ terms: brandIpaLicenseTerms }],
        recipient: address, // Use address from useAccount instead of walletClient.account.address
        ipMetadata: {
          ipMetadataURI,
          ipMetadataHash,
          nftMetadataURI,
          nftMetadataHash,
        },
        txOptions: { waitForTransaction: true },
      });

      if (!response.tokenId || !response.ipId || !response.txHash || !response.licenseTermsIds) {
        throw new Error('Invalid response from minting transaction');
      }

      return {
        tokenId: response.tokenId,
        ipId: response.ipId,
        txHash: response.txHash,
        licenseTermsIds: [...response.licenseTermsIds],
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error minting NFT:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mintNFT,
    isLoading,
    error,
  };
};