import { NextRequest, NextResponse } from "next/server";
import { Alchemy, Network } from "alchemy-sdk";


const config = {
    apiKey: process.env.ALCHEMY_API_KEY, 
    network: Network.STORY_AENEID, 
};


const alchemy = new Alchemy(config);


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    
    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }
    const nftCollectionAddress = "0x95f8c494Bf35912921f3Fd654381612Ea5990244"; // customNftCollectionAddress


    try {
        const response = await alchemy.nft.getNftsForOwner(address, {
            contractAddresses: [nftCollectionAddress],
        });
        
        // console.log("Owned NFT", response.ownedNfts);
        return NextResponse.json(response.ownedNfts);
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        return NextResponse.json({ error: 'Failed to fetch NFTs' }, { status: 500 });
    }
}

