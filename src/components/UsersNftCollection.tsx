"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { NFTCard } from "./Card";
import Loader from "./Loader";

interface NFT {
  contract: {
    address: string;
    name: string;
    symbol: string;
  };
  tokenId: string;
  name: string;
  description: string;
  raw: {
    metadata: {
      image: string;
      name: string;
      description: string;
    };
  };
  mint: {
    transactionHash: string;
  };
  creators?: Creator[];
  ipId?: string;
  pdf?: string;
}

interface Creator {
  name: string;
  address: string;
  contributionPercent: number;
}

// interface TxData {
//   data?: Array<{
//     actionType?: string;
//     ipId?: string;
//   }>;
// }

export const UsersNftCollection = () => {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // const extractIpIdFromTxData = (txData: TxData): string | null => {
    //   const actions = txData?.data;
    //   if (!actions || !Array.isArray(actions)) return null;

    //   // Prefer the "Register" actionType if available
    //   const registerAction = actions.find(
    //     (action) => action.actionType === "Register"
    //   );
    //   if (registerAction?.ipId) return registerAction.ipId;

    //   // Fallback to the first one with ipId
    //   const anyIpAction = actions.find((action) => action.ipId);
    //   return anyIpAction?.ipId || null;
    // };

    const fetchMetadataUri = async (
      tokenID: string
    ): Promise<{ metadataUri: string; ipId: string } | null> => {
      try {
        // const txResponse = await fetch(
        //   `https://api.storyapis.com/api/v3/transactions/${transactionHash}`,
        //   {
        //     method: "GET",
        //     headers: {
        //       "X-Api-Key": "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
        //       "X-Chain": "story-aeneid",
        //     },
        //   }
        // );
        // const txData = await txResponse.json();
        // const ipId = extractIpIdFromTxData(txData);
        const response = await fetch(
          "https://api.storyapis.com/api/v3/assets",
          {
            method: "POST",
            headers: {
              "X-Api-Key": "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
              "X-Chain": "story-aeneid",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              options: {
                tokenContractIds: [
                  "0x95f8c494Bf35912921f3Fd654381612Ea5990244",
                ],
                tokenIds: [tokenID],
              },
            }),
          }
        );
        const assetData = await response.json();
        const ipId = assetData?.data?.[0]?.ipId;
        if (!ipId) return null;

        const metadataResponse = await fetch(
          `https://api.storyapis.com/api/v3/assets/${ipId}/metadata`,
          {
            method: "GET",
            headers: {
              "X-Api-Key": "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
              "X-Chain": "story-aeneid",
            },
          }
        );
        const metadataData = await metadataResponse.json();
        const metadataUri = metadataData?.metadataUri;
        // console.log(metadataData)
        if (!metadataUri) return null;

        return { metadataUri, ipId };
      } catch (err) {
        console.error("Error fetching metadata URI:", err);
        return null;
      }
    };

    const fetchCreatorsFromUri = async (
      uri: string
    ): Promise<Creator[] | null> => {
      try {
        const response = await fetch(uri);
        const metadata = await response.json();
        return metadata?.creators || null;
      } catch (err) {
        console.error("Error fetching creators from metadata URI:", err);
        return null;
      }
    };
    const fetchPdfFromUri = async (uri: string): Promise<string | null> => {
      try {
        const response = await fetch(uri);
        if (!response.ok) throw new Error("Failed to fetch PDF");
        const metadata = await response.json();
        if (metadata?.mediaType == "image/png") {
          return metadata.mediaUrl;
        } else {
          return null;
        }
      } catch (err) {
        console.error("Error fetching PDF from metadata URI:", err);
        return null;
      }
    };

    const fetchNFTs = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user-nft?address=${address}`);
        if (!response.ok) throw new Error("Failed to fetch NFTs");

        const rawNFTs: NFT[] = await response.json();
        // console.log("rawnft: ", rawNFTs);
        const enrichedNFTs: NFT[] = [];

        for (const nft of rawNFTs) {
          // const txHash = nft.mint.transactionHash;
          const tokenId = nft.tokenId.toString();
          // console.log(tokenId)
          const result = await fetchMetadataUri(tokenId);
          // console.log("result: ", result);  
          // const result = await fetchMetadataUri(txHash); // renamed for clarity

          if (result) {
            const { metadataUri, ipId } = result;
            nft.ipId = ipId;

            const creators = await fetchCreatorsFromUri(metadataUri);
            const pdfUrl = await fetchPdfFromUri(metadataUri);
            if (pdfUrl) {
              nft.pdf = pdfUrl;
            }
            if (creators && Array.isArray(creators)) {
              nft.creators = creators;
            }
          }

          enrichedNFTs.push(nft);
          // console.log("Enriched NFT:", enrichedNFTs);
        }

        setNfts(enrichedNFTs);
      } catch (err) {
        console.error("Error in fetchNFTs:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [address]);

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!address)
    return (
      <div className="text-4xl font-bold text-gray-900 mb-4">
        Please connect your wallet
      </div>
    );

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        User&apos;s NFT Collection
      </h1>
      {nfts.length === 0 ? (
        <p className="text-lg text-gray-700">No NFTs found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <NFTCard
              key={`${nft.contract.address}-${nft.tokenId}`}
              imageUrl={nft.raw.metadata.image}
              title={nft.name}
              description={nft.description}
              creators={nft.creators || []}
              ipId={nft.ipId}
              pdf={nft.pdf} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
