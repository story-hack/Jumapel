import { NextRequest, NextResponse } from 'next/server';
import { uploadJSONToIPFS } from '../../../utils/uploadJSONToIPFS';
import { createHash } from 'crypto';
import { IpMetadata } from '@story-protocol/core-sdk';

interface NftMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: { key: string; value: string }[];
}

interface UploadRequestPayload {
  ipMetadata: IpMetadata;
  nftMetadata: NftMetadata;
}

export async function POST(req: NextRequest) {
  try {
    const { ipMetadata, nftMetadata }: UploadRequestPayload = await req.json();

    if (!ipMetadata || !nftMetadata) {
      return NextResponse.json(
        { error: 'Missing ipMetadata or nftMetadata in request body.' },
        { status: 400 }
      );
    }

    // Upload both metadata objects to IPFS
    const [ipIpfsHash, nftIpfsHash] = await Promise.all([
      uploadJSONToIPFS(JSON.parse(JSON.stringify(ipMetadata))),
      uploadJSONToIPFS(JSON.parse(JSON.stringify(nftMetadata))),
    ]);

    // Generate hashes for both metadata objects
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex');
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex');

    // Return the IPFS data needed for frontend minting
    return NextResponse.json({
      ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      ipMetadataHash: `0x${ipHash}`,
      nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
      nftMetadataHash: `0x${nftHash}`,
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('Error in metadata upload:', error);
    return NextResponse.json(
      { error: 'Failed to upload metadata.', details: errorMessage },
      { status: 500 }
    );
  }
}

// Handler for unsupported methods
const methodNotAllowed = () => NextResponse.json(
  { message: 'Method Not Allowed. This endpoint only supports POST requests.' },
  { status: 405 }
);

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed; 