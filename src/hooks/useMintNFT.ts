import { useState } from 'react';
import { useWalletClient, useSwitchChain, useChainId, useAccount, useBalance } from 'wagmi';
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
  const { data: balance } = useBalance({ address });

  // Helper function optimized for Tomo wallet compatibility
  const getTransactionOptions = async () => {
    try {
      // Get current gas price from the network
      const gasPrice = await walletClient?.getGasPrice();
      
      console.log('🔍 Wallet detection:', {
        account: walletClient?.account,
        gasPrice: gasPrice?.toString(),
        chainId
      });

      // Tomo-specific transaction options
      // Based on Tomo docs, their provider might be more strict about transaction params
      const tomoOptimizedOptions = {
        waitForTransaction: true,
        // Use exact gas from your successful transaction + buffer
        gasLimit: BigInt(1500000), // Conservative but not excessive
        // Use simple gas price - avoid complex EIP-1559 params
        gasPrice: BigInt(2000000000), // Use the exact effectiveGasPrice from your receipt
        // Remove all EIP-1559 specific fields for maximum compatibility
      };
      
      console.log('📋 Using Tomo-optimized transaction options:', {
        ...tomoOptimizedOptions,
        gasLimit: tomoOptimizedOptions.gasLimit.toString(),
        gasPrice: tomoOptimizedOptions.gasPrice.toString(),
      });
      
      return tomoOptimizedOptions;
      
    } catch (error) {
      console.error('❌ Error getting transaction options:', error);
      
      // Fallback with exact values from your working transaction
      return {
        waitForTransaction: true,
        gasLimit: BigInt(1500000),
        gasPrice: BigInt(2000000000), // Exact value from your receipt
      };
    }
  };

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
      console.log('🔍 Pre-flight checks:');
      console.log('  Address:', address);
      console.log('  Balance:', balance?.formatted, balance?.symbol);
      console.log('  Chain ID:', chainId);
      console.log('  Wallet Client:', walletClient?.account?.type);
      
      // Check if we have enough balance (minimum 0.1 IP for gas + fees)
      const minBalance = parseEther("0.1");
      if (balance && balance.value < minBalance) {
        throw new Error(`Insufficient balance. You need at least 0.1 IP tokens. Current balance: ${balance.formatted} ${balance.symbol}`);
      }

      // Ensure we're on the correct chain
      if (chainId !== storyAeneid.id) {
        console.log('🔄 Switching to Story Protocol chain...');
        try {
          await switchChain({ chainId: storyAeneid.id });
          await new Promise(resolve => setTimeout(resolve, 3000));
          console.log('✅ Chain switch completed');
        } catch (switchError) {
          console.error('❌ Chain switch failed:', switchError);
          setError('Failed to switch to Story Protocol chain. Please switch manually in your wallet.');
          return null;
        }
      }

      console.log('📤 Uploading metadata to IPFS...');
      const uploadResponse = await fetch('/api/upload-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipMetadata, nftMetadata }),
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('❌ Upload failed:', errorText);
        throw new Error(`Failed to upload metadata: ${errorText}`);
      }

      const uploadData = await uploadResponse.json();
      console.log('✅ Metadata uploaded:', uploadData);
      
      const { ipMetadataURI, ipMetadataHash, nftMetadataURI, nftMetadataHash } = uploadData;
      
      if (!ipMetadataURI || !nftMetadataURI) {
        throw new Error('Invalid upload response - missing metadata URIs');
      }

      console.log('🔧 Creating Story Protocol client...');
      const storyClient = createStoryClient(walletClient);
      console.log('✅ Story client created successfully');

      // REVERT TO WORKING CONFIGURATION (since it works with MetaMask)
      const brandIpaLicenseTerms: LicenseTerms = {
        transferable: true,
        royaltyPolicy: "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E",
        defaultMintingFee: parseEther("0.1"),
        expiration: 0n,
        commercialUse: true,
        commercialAttribution: true,
        commercializerChecker: zeroAddress,
        commercializerCheckerData: "0x",
        commercialRevShare: 10,
        commercialRevCeiling: 0n,
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: false,
        derivativeRevCeiling: parseEther("1000"),
        currency: "0x1514000000000000000000000000000000000000",
        uri: ""
      };

      // Get transaction options based on wallet compatibility
      console.log('⚙️ Determining transaction options...');
      const txOptions = await getTransactionOptions();

      console.log('🚀 Starting mint with wallet-specific parameters...');
      
      const mintParams = {
        spgNftContract: "0x95f8c494Bf35912921f3Fd654381612Ea5990244" as Address,
        licenseTermsData: [{ terms: brandIpaLicenseTerms }],
        recipient: address,
        ipMetadata: {
          ipMetadataURI,
          ipMetadataHash,
          nftMetadataURI,
          nftMetadataHash,
        },
        txOptions
      };

      console.log('📝 Mint parameters:', {
        spgNftContract: mintParams.spgNftContract,
        recipient: mintParams.recipient,
        hasIpMetadata: !!mintParams.ipMetadata.ipMetadataURI,
        txOptions: {
          ...txOptions,
          gasLimit: txOptions.gasLimit.toString(),
          maxFeePerGas: txOptions.maxFeePerGas?.toString(),
          maxPriorityFeePerGas: txOptions.maxPriorityFeePerGas?.toString(),
          gasPrice: txOptions.gasPrice?.toString(),
        }
      });

      let response;
      try {
        console.log('📡 Calling mintAndRegisterIpAssetWithPilTerms...');
        response = await storyClient.ipAsset.mintAndRegisterIpAssetWithPilTerms(mintParams);
        console.log('✅ SDK call completed');
      } catch (sdkError) {
        console.error('❌ SDK call failed:', sdkError);
        
        // If the first attempt fails with EIP-1559, try with legacy transaction
        if (sdkError instanceof Error && 
            (sdkError.message.includes('EIP-1559') || 
             sdkError.message.includes('maxFeePerGas') ||
             sdkError.message.includes('transaction type'))) {
          
          console.log('🔄 Retrying with legacy transaction...');
          
          const legacyTxOptions = {
            waitForTransaction: true,
            gasLimit: BigInt(15000000),
            gasPrice: BigInt(2000000000), // 2 gwei
            type: '0x0' as const, // Force legacy transaction
          };
          
          const legacyMintParams = {
            ...mintParams,
            txOptions: legacyTxOptions
          };
          
          try {
            response = await storyClient.ipAsset.mintAndRegisterIpAssetWithPilTerms(legacyMintParams);
            console.log('✅ Legacy transaction succeeded');
          } catch (legacyError) {
            console.error('❌ Legacy transaction also failed:', legacyError);
            throw legacyError;
          }
        } else {
          // Handle other types of errors
          if (sdkError instanceof Error) {
            const errorMessage = sdkError.message.toLowerCase();
            
            if (errorMessage.includes('revert')) {
              console.error('🔴 Transaction reverted on-chain');
              setError(`Transaction reverted. Check transaction details and try again.`);
            } else if (errorMessage.includes('insufficient funds')) {
              setError('Insufficient funds. Please add more IP tokens to your wallet.');
            } else if (errorMessage.includes('user rejected')) {
              setError('Transaction was rejected by user.');
            } else {
              setError(`Transaction Error: ${sdkError.message}`);
            }
          }
          
          throw sdkError;
        }
      }

      console.log('📦 Response analysis:');
      console.log('  Type:', typeof response);
      console.log('  Keys:', Object.keys(response || {}));
      console.log('  Full response:', JSON.stringify(response, (key, value) => 
        typeof value === 'bigint' ? value.toString() : value, 2
      ));

      // Check if we got a transaction hash but transaction failed
      if (response?.txHash && Object.keys(response).length === 1) {
        console.error('🔴 Only txHash returned - transaction likely reverted');
        console.error('🔍 Check transaction status at: https://aeneid.storyscan.io/tx/' + response.txHash);
        
        setError(`Transaction was submitted but failed on-chain. 
Transaction Hash: ${response.txHash}
Check details at: https://aeneid.storyscan.io/tx/${response.txHash}`);
        
        return null;
      }

      // Extract fields from response
      const extractField = (response: any, fieldNames: string[]) => {
        for (const fieldName of fieldNames) {
          if (response?.[fieldName] !== undefined && response?.[fieldName] !== null) {
            return response[fieldName];
          }
        }
        return null;
      };

      const tokenId = extractField(response, [
        'tokenId', 'token_id', 'TokenId', 'id', 'nftId', 'nft_id'
      ]);
      
      const ipId = extractField(response, [
        'ipId', 'ip_id', 'IpId', 'ipAssetId', 'ip_asset_id', 'assetId'
      ]);
      
      const txHash = extractField(response, [
        'txHash', 'tx_hash', 'transactionHash', 'transaction_hash', 'hash'
      ]);
      
      const licenseTermsIds = extractField(response, [
        'licenseTermsIds', 'license_terms_ids', 'LicenseTermsIds', 'licenseIds'
      ]) || [];

      console.log('🎯 Extracted fields:', {
        tokenId: tokenId?.toString(),
        ipId,
        txHash,
        licenseTermsIds: Array.isArray(licenseTermsIds) ? licenseTermsIds.length : 'not array'
      });

      if (!tokenId && tokenId !== 0n) {
        throw new Error(`Missing tokenId in response. Available fields: ${Object.keys(response || {}).join(', ')}`);
      }
      
      if (!ipId) {
        throw new Error(`Missing ipId in response. Available fields: ${Object.keys(response || {}).join(', ')}`);
      }
      
      if (!txHash) {
        throw new Error(`Missing txHash in response. Available fields: ${Object.keys(response || {}).join(', ')}`);
      }

      const result: MintNFTResult = {
        tokenId: typeof tokenId === 'bigint' ? tokenId : BigInt(tokenId),
        ipId: ipId as Address,
        txHash: txHash as Address,
        licenseTermsIds: Array.isArray(licenseTermsIds) ? [...licenseTermsIds] : [],
      };

      console.log('🎉 Mint completed successfully:', {
        tokenId: result.tokenId.toString(),
        ipId: result.ipId,
        txHash: result.txHash,
        licenseTermsCount: result.licenseTermsIds.length
      });

      return result;

    } catch (err) {
      console.error('💥 Mint process failed:', err);
      
      if (!error) { // Only set error if not already set
        let errorMessage = 'An unknown error occurred during minting';
        
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      }
      
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