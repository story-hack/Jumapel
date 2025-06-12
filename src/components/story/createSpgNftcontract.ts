import { zeroAddress } from "viem";
import { client } from "../../utils/utils";

async function createSpgNftCollection() {
  const newCollection = await client.nftClient.createNFTCollection({
    name: "Brand NFT",
    symbol: "BRN",
    isPublicMinting: true,
    mintOpen: true,
    mintFeeRecipient: zeroAddress,
    contractURI: "",
  });

  console.log("New collection created:", {
    "SPG NFT Contract Address": newCollection.spgNftContract,
    "Transaction Hash": newCollection.txHash,
  });
}

export default  createSpgNftCollection;