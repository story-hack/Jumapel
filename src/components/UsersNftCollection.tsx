"use client";

import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { NFTCard } from './Card';

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
        }
    };
    
}

export const UsersNftCollection = () => {
    const { address } = useAccount();
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNFTs = async () => {
            if (!address) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/user-nft?address=${address}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch NFTs');
                }
                const data = await response.json();
                setNfts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchNFTs();
    }, [address]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!address) {
        return <div className="text-4xl font-bold text-gray-900 mb-4">Please connect your wallet</div>;
    }

    return (
        <div>
            <h1>Users NFT Collection</h1>
            {nfts.length === 0 ? (
                <p className="text-4xl font-bold text-gray-900 mb-4">No NFTs found</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {nfts.map((nft) => (
                        <NFTCard 
                            key={`${nft.contract.address}-${nft.tokenId}`}
                            imageUrl={nft.raw.metadata.image} 
                            title={nft.name} 
                            description={nft.description} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}