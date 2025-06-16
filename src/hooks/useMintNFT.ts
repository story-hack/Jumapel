import { useState } from "react";
import {
  useWalletClient,
  useSwitchChain,
  useChainId,
  useAccount,
  useBalance,
} from "wagmi";
import { parseEther, zeroAddress, Address } from "viem";
import { IpMetadata, LicenseTerms } from "@story-protocol/core-sdk";
import { storyAeneid } from "wagmi/chains";
import { createStoryClient } from "../utils/storyClient";

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

  
  const mintNFT = async ({ ipMetadata, nftMetadata }: MintNFTParams): Promise<MintNFTResult | null> => {
    if (!isConnected || !address || !walletClient?.account) {
      setError("Please connect your wallet properly.");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (balance && balance.value < parseEther("0.1")) {
        throw new Error("Insufficient balance. At least 0.1 IP required.");
      }

      if (chainId !== storyAeneid.id) {
        try {
          await switchChain({ chainId: storyAeneid.id });
          await new Promise((resolve) => setTimeout(resolve, 3000));
        } catch (e) {
          setError("Failed to switch to Story Protocol chain.");
          return null;
        }
      }

      const uploadRes = await fetch("/api/upload-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ipMetadata, nftMetadata }),
      });

      if (!uploadRes.ok) {
        throw new Error(`Metadata upload failed: ${await uploadRes.text()}`);
      }

      const { ipMetadataURI, ipMetadataHash, nftMetadataURI, nftMetadataHash } = await uploadRes.json();

      if (!ipMetadataURI || !nftMetadataURI) {
        throw new Error("Missing metadata URIs in upload response");
      }

      const storyClient = createStoryClient(walletClient);

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
        uri: "",
      };


      const mintParams = {
        spgNftContract: "0x95f8c494Bf35912921f3Fd654381612Ea5990244" as Address,
        licenseTermsData: [{ terms: brandIpaLicenseTerms }],
        recipient: address,
        ipMetadata: { ipMetadataURI, ipMetadataHash, nftMetadataURI, nftMetadataHash },
        txOptions: {
          waitForTransaction: true,
        },
      };

      let response = await storyClient.ipAsset.mintAndRegisterIpAssetWithPilTerms(mintParams);

      if (!response || !response.txHash) throw new Error("Transaction failed or response missing txHash");

      const extract = (keys: string[]) => keys.map(k => response[k]).find(Boolean);

      const tokenId = extract(["tokenId", "id"]);
      const ipId = extract(["ipId", "ipAssetId"]);
      const txHash = extract(["txHash", "transactionHash"]);
      const licenseTermsIds = extract(["licenseTermsIds", "licenseIds"]) || [];

      if (!tokenId || !ipId || !txHash) throw new Error("Missing expected fields in SDK response");

      return {
        tokenId: typeof tokenId === "bigint" ? tokenId : BigInt(tokenId),
        ipId: ipId as Address,
        txHash: txHash as Address,
        licenseTermsIds,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown minting error";
      console.error("Mint error:", message);
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { mintNFT, isLoading, error };
};