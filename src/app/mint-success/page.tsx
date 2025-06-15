"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import Link from "next/link";

export default function MintSuccessPage() {
  const searchParams = useSearchParams();
  const [brandName, setBrandName] = useState("");
  const [redefinedIdea, setRedefinedIdea] = useState("");
  const [domain, setDomain] = useState("");
  const [logoUrl, setLogoUrl] = useState("/file.svg");
  const [ipId, setIpId] = useState("");
  const [whitepaper, setWhitepaper] = useState("");

  useEffect(() => {
    setBrandName(searchParams.get("brandName") || "");
    setRedefinedIdea(searchParams.get("redefinedIdea") || "");
    setDomain(searchParams.get("domain") || "");
    setLogoUrl(searchParams.get("logoUrl") || "/file.svg");
    setIpId(searchParams.get("ipId") || "");
    setWhitepaper(searchParams.get("whitepaper") || "");

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      zIndex: 9999,
    });
    // eslint-disable-next-line
  }, []); // Only run once on mount

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/80 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden">
        <div className="relative bg-black w-full md:w-1/2 min-h-[400px] h-full aspect-square md:aspect-auto p-0">
          <Image
            src={logoUrl}
            alt="Brand Logo"
            fill
            className="object-cover object-left-top w-full h-full"
            style={{ borderRadius: 0 }}
            priority
          />
        </div>
        <div className="flex flex-col justify-center p-12 md:w-1/2 w-full">
          <h2 className="text-3xl font-bold text-green-600 mb-3">
            Mint Successful!
          </h2>
          <p className="text-lg text-black mb-6">
            Your brand has been tokenized as an NFT and registered as an IP
            asset!
          </p>
          <div className="text-base text-black mb-3">
            <span className="font-semibold">Brand Name :</span>{" "}
            <span className="underline text-blue-900 font-medium">
              {brandName || <span className="text-gray-400">N/A</span>}
            </span>
          </div>
          <div className="text-base text-black mb-3">
            <span className="font-semibold"> Idea :</span>{" "}
            <span className="underline text-blue-900 font-medium">
              {redefinedIdea || <span className="text-gray-400">N/A</span>}
            </span>
          </div>
          <div className="text-base text-black mb-6">
            <span className="font-semibold">Domains :</span>{" "}
            {domain ? (
              <a
                href={`https://${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-700"
              >
                {domain}
              </a>
            ) : (
              <span className="text-gray-400">N/A</span>
            )}
          </div>
          {ipId && (
            <div className="text-base text-black mb-6">
              <span className="font-semibold">View your IPA :</span>{" "}
              <a
                href={`https://aeneid.explorer.story.foundation/ipa/${ipId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-700 hover:text-blue-900"
              >
                View on Story Explorer
              </a>
            </div>
          )}
          <div className="flex gap-6 mb-8">
            {whitepaper && (
              <a
                href={whitepaper}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline text-base"
              >
                Whitepaper
              </a>
            )}
            {/* <a href="#" className="text-blue-700 underline text-base">
              MarketValue
            </a> */}
          </div>
          <Link
            href="/profile"
            className="inline-block px-5 py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 transition"
          >
            Your Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
