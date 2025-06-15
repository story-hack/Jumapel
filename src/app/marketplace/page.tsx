"use client";

import React, { useEffect, useState } from "react";
import { NFTCard } from "../../components/Card";
import Loader from "@/components/Loader";

const API_KEY = "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U";
const CHAIN = "story-aeneid";
const CONTRACT_ID = "0x95f8c494Bf35912921f3Fd654381612Ea5990244";

export default function NFTGallery() {
  type NFTMetadata = {
    image?: string;
    image_url?: string;
    title?: string;
    description?: string;
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
        const assetIds = (assetData.data as { id: string }[]).map((item) => item.id);

        // Step 2: Fetch metadata for each ID
        const metadataResponses = await Promise.all(
          assetIds.map((id: string) =>
            fetch(`https://api.storyapis.com/api/v3/assets/${id}/metadata`, {
              method: "GET",
              headers: {
                "X-Api-Key": API_KEY,
                "X-Chain": CHAIN,
              },
            }).then((res) => res.json())
          )
        );

        // Step 3: Fetch actual metadata JSON from URI
        const metadataJsons = await Promise.all(
          metadataResponses.map((meta) =>
            fetch(meta.metadataUri).then((res) => res.json())
          )
        );

        setNfts(metadataJsons);
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
    <div className="w-full px-4 sm:px-8 lg:px-16 py-12  min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold">
          Gallery
        </h1>
        <p className="mt-4 text-lg sm:text-xl">
          A place to explore all the unique brand ideas minted on-chain.
        </p>
        <div className="mt-2 w-24 h-1 bg-blue-600 mx-auto rounded-full" />
      </div>
  
      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {nfts.map((nft, index) => (
          <NFTCard
            key={index}
            imageUrl={nft.image || nft.image_url || ""}
            title={nft.title || "Unnamed NFT"}
            description={nft.description || "No description available."}
          />
        ))}
      </div>
    </div>
  );
}
