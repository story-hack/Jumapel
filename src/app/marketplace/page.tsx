"use client";

import React, { useEffect, useState } from "react";
import { NFTCard } from "../../components/Card";
import Loader from "../../components/Loader";

const API_KEY = "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U";
const CHAIN = "story-aeneid";
const CONTRACT_ID = "0x95f8c494Bf35912921f3Fd654381612Ea5990244";

export default function NFTGallery() {
  type NFTMetadata = {
    image?: string;
    image_url?: string;
    title?: string;
    description?: string;
    creators?: {
      name: string;
      address: string;
      contributionPercent: number;
    }[];
    mediaUrl?: string;
    mediaType?: string;
    ipId?: string;

  };

  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      try {
        // Step 1: Fetch all asset IDs
        const res = await fetch("https://api.storyapis.com/api/v3/assets", {
          method: "POST",
          headers: {
            "X-Api-Key": API_KEY,
            "X-Chain": CHAIN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            options: {
              tokenContractIds: [CONTRACT_ID],
            },
          }),
        });

        const assetData = await res.json();
        const assetList = assetData.data as { id: string }[];

        // Step 2 & 3: Fetch metadata and merge with ipId
        const enrichedNFTs = await Promise.all(
          assetList.map(async ({ id }) => {
            // Step 2: Get metadataUri using ipId
            const metadataResponse = await fetch(
              `https://api.storyapis.com/api/v3/assets/${id}/metadata`,
              {
                method: "GET",
                headers: {
                  "X-Api-Key": API_KEY,
                  "X-Chain": CHAIN,
                },
              }
            );
            const metadataJson = await metadataResponse.json();

            // Step 3: Fetch metadata JSON from URI
            const actualMetadata = await fetch(metadataJson.metadataUri).then((res) =>
              res.json()
            );

            return {
              ...actualMetadata,
              ipId: id, // save ipId in the metadata object
            };
          })
        );

        setNfts(enrichedNFTs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setLoading(false);
      }
    };

    fetchNFTMetadata();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 py-12 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold">Gallery</h1>
        <p className="mt-4 text-lg sm:text-xl">
          A place to explore all the unique brand ideas minted on-chain.
        </p>
        <div className="mt-2 w-24 h-1 bg-blue-600 mx-auto rounded-full" />
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {nfts.map((nft, index) => (
          <div key={index}>
            <NFTCard
              imageUrl={nft.image || nft.image_url || ""}
              title={nft.title || "Unnamed NFT"}
              description={nft.description || "No description available."}
              creators={nft.creators || []}
              ipId={nft.ipId}
              pdf={nft.mediaType === "image/png" ? nft.mediaUrl : "No PDF Available"}
            />
            
          </div>
        ))}
      </div>
    </div>
  );
}
