import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';
import { toHex } from "viem";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: 'orange-bright-loon-792.mypinata.cloud', 
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Invalid content-type' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type }); 

    const pinataFile = new File([blob], file.name, { type: file.type });

    const uploadResult = await pinata.upload.public.file(pinataFile);

    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

    const imageHash = toHex(new Uint8Array(hashBuffer), { size: 32 });

    return NextResponse.json({
      IpfsHash: uploadResult.cid,
      imageUrl: `https://ipfs.io/ipfs/${uploadResult.cid}`,
      imageHash: imageHash,
    });
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    return NextResponse.json({ error: 'Failed to upload to IPFS' }, { status: 500 });
  }
}
