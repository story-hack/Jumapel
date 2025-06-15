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
        const responseData = await finalRes.json();
        router.push(`/mint-success?brandName=${encodeURIComponent(title)}&redefinedIdea=${encodeURIComponent(description)}&logoUrl=${encodeURIComponent(imageData.imageUrl)}&ipId=${encodeURIComponent(responseData.ipId)}`);
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
    <div className="relative max-w-2xl mx-auto mt-10 bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 space-y-8">
      {loading && <Loader />}
      {message && (
        <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded shadow mb-4">
          {message}
        </div>
      )}

      {!imageData.ipfsHash ? (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-6"
        >
          <label htmlFor="file-upload" className="block text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Upload Image</label>
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
            className="w-full px-5 py-3 text-base font-semibold text-white bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 rounded-xl shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload
          </button>
        </form>
      ) : (
        <>
          <div className="space-y-3 mt-2 bg-sky-50 dark:bg-[#23232b] rounded-xl p-4 border border-sky-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-sky-700 dark:text-sky-300">Upload Successful!</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 break-all">IPFS Hash: {imageData.ipfsHash}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 break-all">Image Hash: {imageData.imageHash}</p>
            <img src={imageData.imageUrl} alt="Uploaded" className="w-32 h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-700 mt-2" />
          </div>

          <form onSubmit={handleMetadataSubmit} className="space-y-6 mt-8">
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">Enter Metadata</h3>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-[#23232b] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-[#23232b] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />

            <div className="bg-slate-50 dark:bg-[#20202a] rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Attributes</h4>
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
                    className="w-1/2 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-[#23232b] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-400"
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
                    className="w-1/2 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-[#23232b] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setAttributes([...attributes, { key: "", value: "" }])}
                className="text-sky-600 hover:underline text-sm mt-1"
              >
                + Add Attribute
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-[#20202a] rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Creators</h4>
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
                    className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-[#23232b] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
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
                    className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-[#23232b] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
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
                    className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-[#23232b] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setCreators([...creators, { name: "", address: "", contributionPercent: 0 }])}
                className="text-emerald-600 hover:underline text-sm mt-1"
              >
                + Add Creator
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-5 py-3 text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
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
