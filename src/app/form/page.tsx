
'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Loader from "../../components/Loader";

interface Creator {
  name: string;
  address: string;
  contributionPercent: number;
}

interface Attribute {
  key: string;
  value: string;
}

interface IpMetadata {
  title: string;
  description: string;
  creators: Creator[];
  image: string;
  imageHash: string;
  mediaUrl: string;
  mediaHash: string;
  mediaType: string;
}

interface NftMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Attribute[];
}

export interface MetadataPayload {
  ipMetadata: IpMetadata;
  nftMetadata: NftMetadata;
  walletAddress: string;
}

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [imageData, setImageData] = useState({
    ipfsHash: "",
    imageHash: "",
    imageUrl: "",
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState([{ key: "", value: "" }]);
  const [creators, setCreators] = useState<Creator[]>([{ name: "", address: "", contributionPercent: 0 }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { address } = useAccount();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const button = (e.target as HTMLFormElement).querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (button) {
      button.disabled = true;
    }

    setLoading(true);
    try {
      const imageRes = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await imageRes.json();

      setImageData({
        ipfsHash: data.IpfsHash,
        imageHash: data.imageHash,
        imageUrl: data.imageUrl,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Upload failed. Please try again.");
      setImageData({ ipfsHash: "", imageHash: "", imageUrl: "" });
    } finally {
      setLoading(false);
      if (button) {
        button.disabled = false;
      }
    }
  };

  const handleMetadataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const metadataPayload: MetadataPayload = {
      ipMetadata: {
        title,
        description,
        creators,
        image: imageData.imageUrl,
        imageHash: imageData.imageHash,
        mediaUrl: imageData.imageUrl,
        mediaHash: imageData.imageHash,
        mediaType: "image/jpeg",
      },
      nftMetadata: {
        name: title,
        description,
        image: imageData.imageUrl,
        attributes,
      },
      walletAddress: address || "",
    };

    try {
      const finalRes = await fetch('/api/mintNft-resgisterIp-attachLicense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadataPayload),
      });
      if (finalRes.ok) {
        router.push("/mint-success");
      } else {
        setMessage("Something went wrong with the minting process.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error during minting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative space-y-6">
      {loading && <Loader />}
      {message && (
        <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded shadow">
          {message}
        </div>
      )}

      {!imageData.ipfsHash ? (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-5"
        >
          <input
            id="file-upload"
            type="file"
            name="file"
            accept="image/*"
            required
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 dark:file:bg-sky-700 file:text-sky-600 dark:file:text-sky-100 hover:file:bg-sky-100 dark:hover:file:bg-sky-600 file:transition-colors file:duration-150 file:cursor-pointer border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          <button
            disabled={!file}
            type="submit"
            className="w-full px-5 py-3 text-base font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-sky-500 rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload
          </button>
        </form>
      ) : (
        <>
          <div className="space-y-5 mt-5">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              Upload Successful!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              IPFS Hash: {imageData.ipfsHash}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Image Hash: {imageData.imageHash}
            </p>
          </div>

          <form onSubmit={handleMetadataSubmit} className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Enter Metadata</h3>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />

            <h4 className="font-medium mt-4">Attributes</h4>
            {attributes.map((attr, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={attr.key}
                  onChange={(e) => {
                    const newAttrs = [...attributes];
                    newAttrs[index].key = e.target.value;
                    setAttributes(newAttrs);
                  }}
                  className="w-1/2 px-2 py-1 border rounded"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={attr.value}
                  onChange={(e) => {
                    const newAttrs = [...attributes];
                    newAttrs[index].value = e.target.value;
                    setAttributes(newAttrs);
                  }}
                  className="w-1/2 px-2 py-1 border rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setAttributes([...attributes, { key: "", value: "" }])}
              className="text-blue-600 hover:underline"
            >
              + Add Attribute
            </button>

            <h4 className="font-medium mt-4">Creators</h4>
            {creators.map((creator, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={creator.name}
                  onChange={(e) => {
                    const newCreators = [...creators];
                    newCreators[index].name = e.target.value;
                    setCreators(newCreators);
                  }}
                  className="px-2 py-1 border rounded"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={creator.address}
                  onChange={(e) => {
                    const newCreators = [...creators];
                    newCreators[index].address = e.target.value;
                    setCreators(newCreators);
                  }}
                  className="px-2 py-1 border rounded"
                />
                <input
                  type="number"
                  placeholder="contribution %"
                  value={creator.contributionPercent}
                  onChange={(e) => {
                    const newCreators = [...creators];
                    newCreators[index].contributionPercent = parseInt(e.target.value);
                    setCreators(newCreators);
                  }}
                  className="px-2 py-1 border rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setCreators([...creators, { name: "", address: "", contributionPercent: 0 }])}
              className="text-blue-600 hover:underline"
            >
              + Add Creator
            </button>

            <button
              type="submit"
              className="w-full px-5 py-3 text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Submit Metadata
            </button>
          </form>
        </>
      )}
    </div>
  );
}
