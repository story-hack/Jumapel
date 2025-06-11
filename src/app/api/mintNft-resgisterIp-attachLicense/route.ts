import { client } from '../../../utils/utils';
import { uploadJSONToIPFS } from '../../../utils/uploadJSONToIPFS'
import { createHash } from 'crypto';
import { IpMetadata, LicenseTerms } from '@story-protocol/core-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { Address, zeroAddress, parseEther } from "viem";

interface NftMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: { key: string; value: string }[];
}

interface MintRequestPayload {
  ipMetadata: IpMetadata;
  nftMetadata: NftMetadata;
}

export async function POST(req: NextRequest) {
  try {
    
    const { ipMetadata, nftMetadata }: MintRequestPayload = await req.json();

    if (!ipMetadata || !nftMetadata) {
      return NextResponse.json(
        { error: 'Missing ipMetadata or nftMetadata in request body.' },
        { status: 400 }
      );
    }

   
    const [ipIpfsHash, nftIpfsHash] = await Promise.all([
      uploadJSONToIPFS(JSON.parse(JSON.stringify(ipMetadata))),
      uploadJSONToIPFS(JSON.parse(JSON.stringify(nftMetadata))),
    ]);

    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex');
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex');

    // Register the NFT as an IP Asset
    //RegisterIpResponse:
    //  txHash?: Hex;
    //  receipt?: TransactionReceipt;
    //  ipId?: Address;
    //  tokenId?: bigint;
    const response = await client.ipAsset.mintAndRegisterIp({
      spgNftContract: "0x95f8c494Bf35912921f3Fd654381612Ea5990244", // customnftcollection
      ipMetadata: {
        ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
        ipMetadataHash: `0x${ipHash}`,
        nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
        nftMetadataHash: `0x${nftHash}`,
      },
      txOptions: { waitForTransaction: true },
    });
    const brandIpaLicenseTerms: LicenseTerms = {
      transferable: true,
      royaltyPolicy: "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E",
      defaultMintingFee: parseEther("10"),
      expiration: 0n,
      commercialUse: true,
      commercialAttribution: true,
      commercializerChecker: zeroAddress,
      commercializerCheckerData: "0x",
      commercialRevShare: 15,
      commercialRevCeiling: 0n,
      derivativesAllowed: true,
      derivativesAttribution: true,
      derivativesApproval: true,
      derivativesReciprocal: true,
      derivativeRevCeiling: parseEther("100000"),
      currency: "0x1514000000000000000000000000000000000000" ,
      uri: ""
     };

    const resgisterLicence = await client.license.registerPILTerms({
      ...brandIpaLicenseTerms,
      txOptions: { waitForTransaction: true },
    });
    
    const attachLicense = await client.license.attachLicenseTerms({
      // insert your newly created license terms id here
      licenseTermsId: resgisterLicence.licenseTermsId as bigint,
      // insert the ipId you want to attach terms to here
      ipId: response.ipId as Address,
      txOptions: { waitForTransaction: true },
    });

    return NextResponse.json({
      message: `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`,
      transactionHash: response.txHash,
      ipId: response.ipId,
      explorerUrl: `https://aeneid.explorer.story.foundation/ipa/${response.ipId}`,
      attachedLicense: `Attached License Terms to IPA at transaction hash ${attachLicense.txHash}.`
    }, { status: 200 });

  } catch (error: unknown) { // Use 'unknown' for better type safety in catch
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('Error in minting and registering IP asset:', error);
    return NextResponse.json(
      { error: 'Failed to mint and register IP asset.', details: errorMessage },
      { status: 500 }
    );
  }
}

// Handler for unsupported methods - concise way to reject
const methodNotAllowed = () => NextResponse.json({ message: 'Method Not Allowed. This endpoint only supports POST requests.' }, { status: 405 });

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const PATCH = methodNotAllowed; // Add PATCH if not already covered