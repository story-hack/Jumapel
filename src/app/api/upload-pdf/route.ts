import { NextRequest, NextResponse } from 'next/server';
import { createWhitepaperPDF, uploadPDFToIPFS } from '@/utils/pdfWhitepaper';

export async function POST(req: NextRequest) {
  try {
    // Expecting JSON: { whitepaper } (object with all sections)
    const { whitepaper } = await req.json();
    if (!whitepaper || typeof whitepaper !== 'object') {
      return NextResponse.json({ error: 'No whitepaper object provided' }, { status: 400 });
    }

    // 1. Generate PDF from whitepaper object
    const pdfBuffer = await createWhitepaperPDF(whitepaper);

    // 2. Upload to Pinata IPFS
    const ipfsHash = await uploadPDFToIPFS(pdfBuffer, 'whitepaper.pdf');

    return NextResponse.json({
      IpfsHash: ipfsHash,
      pdfUrl: `https://orange-bright-loon-792.mypinata.cloud/ipfs/${ipfsHash}`,
    });
  } catch (error) {
    console.error('Error uploading PDF to Pinata:', error);
    return NextResponse.json({ error: 'Failed to upload PDF to IPFS' }, { status: 500 });
  }
}
