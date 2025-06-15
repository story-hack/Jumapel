"use client";

import React, { useState, useRef } from "react";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

export default function Dashboard() {
  const [messages, setMessages] = useState([
    {
      role: "agent",
      content:
        "Hi there 👋\nTell us your product idea, and we'll handle the rest.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [, setError] = useState("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [, setImageData] = useState<{
    ipfsHash: string;
    imageHash: string;
    imageUrl: string;
  } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [refinedIdeaData, setRefinedIdeaData] = useState<{
    brandName: string;
    refinedIdea: string;
    domain: string;
    marketValue: string;
    marketValueJustification: string;
  } | null>(null);
  const { address } = useAccount();

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // If we're in image upload mode and have a file, process the image
    if (showImageUpload && selectedFile) {
      await handleImageUpload();
      return;
    }
    
   
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/agentTest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: input }),
      });
      console.log(res);
      if (!res.ok) throw new Error("Agent error");
      const data = await res.json();
      setRefinedIdeaData(data);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: `Brand: ${data.brandName}\n\nDomain: ${data.domain}\n\nRefined Idea: ${data.refinedIdea}\n\nMarket Value Estimate: ${data.marketValue.estimate}\n\nJustification: ${data.marketValue.justification}`,
        },
        {
          role: "agent",
          content: "Now, please upload an image you'd like to use for the NFT.",
        },
      ]);
      setShowImageUpload(true);
    } catch (err) {
      console.log(err)
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
      setError("Agent error");
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
  }

  async function handleImageUpload() {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    setImageUploading(true);
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

      if (!refinedIdeaData) {
        throw new Error("No brand data available");
      }

      const metadataPayload = {
        ipMetadata: {
          title: refinedIdeaData.brandName,
          description: refinedIdeaData.refinedIdea,
          creators: [],
          image: data.imageUrl,
          imageHash: data.imageHash,
          mediaUrl: data.imageUrl,
          mediaHash: data.imageHash,
          mediaType: "image/jpeg",
        },
        nftMetadata: {
          name: refinedIdeaData.brandName,
          description: refinedIdeaData.refinedIdea,
          image: data.imageUrl,
          attributes: [],
        },
        walletAddress: address || "",
      };

      const finalRes = await fetch("/api/mintNft-resgisterIp-attachLicense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadataPayload),
      });
      if (finalRes.ok) {
        const responseData = await finalRes.json();
        router.push(`/mint-success?brandName=${encodeURIComponent(refinedIdeaData.brandName)}&redefinedIdea=${encodeURIComponent(refinedIdeaData.refinedIdea)}&logoUrl=${encodeURIComponent(data.imageUrl)}&ipId=${encodeURIComponent(responseData.ipId)}`);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            content: "Something went wrong with the minting process.",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "Network error during minting." },
      ]);
    } finally {
      setImageUploading(false);
    }
  }

  return (
    <main className="min-h-screen w-full flex">
      {(loading || imageUploading) && <Loader />}
      <section className="w-1/2 min-h-screen flex flex-col justify-center items-center bg-[#181818] p-12">
        <div className="w-full flex flex-wrap gap-6">
          <div className="flex-1 bg-gradient-to-br from-[#232323] to-[#111] rounded-2xl p-6 shadow-lg text-white min-w-[220px] max-w-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#8ecaff] to-[#3b6eea] flex items-center justify-center text-lg font-bold">
                  1
                </div>
                <span className="font-semibold text-base">Connect Wallet</span>
              </div>
              <div className="text-sm text-gray-300">
                Connect your crypto wallet to get started and enable NFT
                minting.
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl p-6 shadow text-[#232323] min-w-[220px] max-w-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#8ecaff] to-[#3b6eea] flex items-center justify-center text-lg font-bold">
                  2
                </div>
                <span className="font-semibold text-base">
                  Prompt the Agent
                </span>
              </div>
              <div className="text-sm text-gray-700">
                Describe your product idea in detail. The AI agent will suggest
                a brand name and available domain.
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl p-6 shadow text-[#232323] min-w-[220px] max-w-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#8ecaff] to-[#3b6eea] flex items-center justify-center text-lg font-bold">
                  3
                </div>
                <span className="font-semibold text-base">Mint as NFT</span>
              </div>
              <div className="text-sm text-gray-700">
                Review the AI&apos;s suggestion and mint your idea, brand, and domain
                as an NFT onchain.
              </div>
            </div>
          </div>

          {/* 4th Box: Check Market Value */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow text-[#232323] min-w-[220px] max-w-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#ffb347] to-[#ffcc80] flex items-center justify-center text-lg font-bold">
                  4
                </div>
                <span className="font-semibold text-base">Check Market Value</span>
              </div>
              <div className="text-sm text-gray-700">
                Instantly get an estimated market value for your idea based on its uniqueness and current trends.
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-1/2 min-h-screen flex flex-col justify-center items-center bg-[#232323] p-0">
        <div className="w-full h-screen flex flex-col bg-[#222] rounded-none shadow-none">
          <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`w-full mb-4 flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-5 py-3 max-w-[80%] whitespace-pre-line shadow ${
                      msg.role === "user"
                        ? "bg-[#0080ff] text-white self-end"
                        : "bg-[#232323] text-white border border-[#333] self-start"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && !showImageUpload && (
                <div className="w-full flex justify-start mb-4">
                  <div className="rounded-2xl px-5 py-3 bg-[#232323] text-white border border-[#333] max-w-[80%] animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </div>
          <form
            onSubmit={handleSend}
            className="w-full flex flex-col gap-2 p-6 bg-[#232323] border-t border-[#333] fixed bottom-0 right-0 max-w-[50vw]"
            style={{ zIndex: 10 }}
          >
            {/* Text input - shown when not in image upload mode */}
            {!showImageUpload && (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-lg text-lg px-4 py-2 bg-[#181818] text-white border border-[#333] focus:outline-none"
                  placeholder="Type your product idea..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="bg-[#0080ff] text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-[#005fa3] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !input.trim()}
                >
                  Send
                </button>
              </div>
            )}

            {/* Image upload - shown when in image upload mode */}
            {showImageUpload && (
              <div className="flex flex-col gap-3">
                <label className="text-white font-semibold text-sm">
                  Upload an image for your NFT:
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    ref={imageInputRef}
                    className="flex-1 text-white bg-[#181818] border border-[#444] rounded px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#0080ff] file:text-white hover:file:bg-[#005fa3] cursor-pointer"
                    disabled={imageUploading}
                  />
                  <button
                    type="submit"
                    className="bg-[#0080ff] text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-[#005fa3] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={imageUploading || !selectedFile}
                  >
                    {imageUploading ? "Regestering as IPA..." : "Mint "}
                  </button>
                </div>
                {selectedFile && (
                  <div className="text-green-400 text-sm">
                    Selected: {selectedFile.name}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}