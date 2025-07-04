"use client";

import React, { useState } from "react";
import { X, TrendingUp, Clock, User, DollarSign } from "lucide-react";
import Image from "next/image";

// Types for Make Offer Modal
interface Bid {
  id: string;
  bidderName: string;
  bidderAddress: string;
  amount: number;
  timestamp: Date;
  status: "active" | "outbid" | "expired";
}

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  nftTitle: string;
  nftImage?: string;
  currentHighestBid?: number;
  minimumBid?: number;
  pastBids?: Bid[];
  onSubmitOffer: (offerAmount: number, ipAmount: number) => void;
}

// Make Offer Modal Component
const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  isOpen,
  onClose,
  nftTitle,
  nftImage,
  currentHighestBid = 0,
  minimumBid = 0.1,
  pastBids = [],
  onSubmitOffer,
}) => {
  const [offerAmount, setOfferAmount] = useState<string>("");
  const [ipAmount, setIpAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ offer?: string; ip?: string }>({});

  // Mock past bids data if none provided
  const mockBids: Bid[] = pastBids.length > 0 ? pastBids : [
    {
      id: "1",
      bidderName: "CryptoCollector",
      bidderAddress: "0x1234...5678",
      amount: 2.5,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "outbid",
    },
    {
      id: "2",
      bidderName: "NFTEnthusiast",
      bidderAddress: "0xabcd...efgh",
      amount: 3.2,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: "outbid",
    },
    {
      id: "3",
      bidderName: "ArtLover2024",
      bidderAddress: "0x9876...4321",
      amount: 4.8,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: "active",
    },
  ];

  const validateForm = () => {
    const newErrors: { offer?: string; ip?: string } = {};
    
    const offerNum = parseFloat(offerAmount);
    const ipNum = parseFloat(ipAmount);

    if (!offerAmount || isNaN(offerNum) || offerNum <= 0) {
      newErrors.offer = "Please enter a valid offer amount";
    } else if (offerNum < minimumBid) {
      newErrors.offer = `Minimum bid is ${minimumBid} IP`;
    } else if (offerNum <= currentHighestBid) {
      newErrors.offer = `Offer must be higher than current bid (${currentHighestBid} IP)`;
    }

    if (!ipAmount || isNaN(ipNum) || ipNum <= 0) {
      newErrors.ip = "Please enter a valid IP amount";
    } else if (ipNum < offerNum) {
      newErrors.ip = "IP balance must be at least equal to your offer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmitOffer(parseFloat(offerAmount), parseFloat(ipAmount));
      setIsSubmitting(false);
      onClose();
      // Reset form
      setOfferAmount("");
      setIpAmount("");
      setErrors({});
    }, 2000);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "outbid":
        return "text-red-600 bg-red-50";
      case "expired":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-auto bg-white rounded-3xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white 
                     rounded-full shadow-lg transition-all duration-200 hover:scale-110
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            {nftImage && (
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={nftImage}
                  alt={nftTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Make an Offer</h2>
              <p className="text-gray-600">{nftTitle}</p>
            </div>
          </div>

          {/* Current Bid Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Current Highest Bid</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {currentHighestBid > 0 ? `${currentHighestBid} IP` : "No bids yet"}
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Minimum bid: {minimumBid} IP
            </p>
          </div>

          {/* Offer Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Offer Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Offer Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                      ${errors.offer ? 'border-red-300' : 'border-gray-300'}`}
                    disabled={isSubmitting}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    IP
                  </span>
                </div>
                {errors.offer && (
                  <p className="mt-1 text-sm text-red-600">{errors.offer}</p>
                )}
              </div>

              {/* IP Balance */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Available IP Balance
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={ipAmount}
                    onChange={(e) => setIpAmount(e.target.value)}
                    placeholder="Enter your IP balance"
                    className={`w-full pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                      ${errors.ip ? 'border-red-300' : 'border-gray-300'}`}
                    disabled={isSubmitting}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    IP
                  </span>
                </div>
                {errors.ip && (
                  <p className="mt-1 text-sm text-red-600">{errors.ip}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  This amount will be reserved for your bid
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                         text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Submitting Offer...
                </>
              ) : (
                "Place Offer"
              )}
            </button>
          </form>

          {/* Past Bids Section */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Bid History</h3>
              <span className="text-sm text-gray-500">({mockBids.length} bids)</span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {mockBids.map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{bid.bidderName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                          {bid.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {bid.bidderAddress} • {formatTimeAgo(bid.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{bid.amount} IP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main NFTCard Component (unchanged structure, just added Make Offer functionality)
interface NFTCardProps {
  imageUrl: string;
  title: string;
  description: string;
  alt?: string;
  creators?: {
    name: string;
    address: string;
    contributionPercent: number;
  }[];
  ipId?: string;
  pdf?: string; // Optional PDF URL or placeholder text
  // Optional props for Make Offer Modal
  currentHighestBid?: number;
  minimumBid?: number;
  pastBids?: Bid[];
}

export const NFTCard: React.FC<NFTCardProps> = ({
  imageUrl,
  title,
  description,
  alt = "NFT Image",
  creators = [],
  ipId,
  pdf = "No PDF Available",
  currentHighestBid = 4.8,
  minimumBid = 0.1,
  pastBids = [],
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMakeOfferOpen, setIsMakeOfferOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const openMakeOffer = () => setIsMakeOfferOpen(true);
  const closeMakeOffer = () => setIsMakeOfferOpen(false);

  const handleSubmitOffer = (offerAmount: number, ipAmount: number) => {
    console.log(`Offer submitted: ${offerAmount} IP with balance: ${ipAmount} IP`);
    // Here you would typically call your API to submit the offer
    alert(`Offer of ${offerAmount} IP submitted successfully!`);
  };

  return (
    <>
      {/* Card - Square aspect ratio with optimized hover effects */}
      <div
        onClick={openModal}
        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer 
                   aspect-square flex flex-col
                   transform transition-transform duration-300 ease-out
                   hover:scale-[1.02] hover:shadow-xl
                   border border-gray-200 group relative
                   will-change-transform"
      >
        {/* Image Container - Takes up 70% of card height */}
        <div className="relative overflow-hidden flex-[0.7] bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="w-full h-full object-cover 
                       transition-transform duration-500 ease-out
                       group-hover:scale-105
                       will-change-transform"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
              No Image Available
            </div>
          )}

          {/* Subtle overlay on hover */}
          <div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/10 
                          transition-colors duration-300"
          ></div>

          {/* Optimized shine effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                          -translate-x-full group-hover:translate-x-full transition-transform duration-700 
                          transform rotate-12 scale-x-150 will-change-transform"
          ></div>
        </div>

        {/* Content - Takes up 30% of card height */}
        <div className="p-3 sm:p-4 flex-[0.3] flex flex-col justify-center">
          <h3
            className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2
                         line-clamp-1 group-hover:text-blue-600 
                         transition-colors duration-300"
          >
            {title}
          </h3>
          <p
            className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2
                        group-hover:text-gray-700 transition-colors duration-300"
          >
            {description}
          </p>
        </div>
      </div>

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto bg-white rounded-3xl shadow-2xl">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white 
                         rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Modal Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[500px]">
              {/* Image Section */}
              <div className="relative bg-gray-100">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    fill
                    alt={alt}
                    className="w-full h-64 lg:h-full object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      {title}
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Placeholder for additional details */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">
                      NFT Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Creator(s):</span>
                        <div className="space-y-1 mt-1">
                          {creators.length > 0 ? (
                            creators.map((creator, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    creator.address
                                  );
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold underline underline-offset-2 transition-all"
                                title={`Click to copy address: ${creator.address}`}
                              >
                                {creator.name} ({creator.contributionPercent}%)
                              </button>
                            ))
                          ) : (
                            <p className="text-gray-700">Unknown</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Collection:</span>
                        <p className="font-medium text-gray-900">Brand NFT</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Blockchain:</span>
                        <p className="font-medium text-gray-900">
                          Story Aeneid Testnet
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `https://aeneid.explorer.story.foundation/ipa/${ipId}`,
                            "_blank"
                          );
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
                      >
                        View on StoryScan
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openMakeOffer();
                        }}
                        className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
                      >
                        Make Offer
                      </button>

                      {pdf !== "No PDF Available" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(pdf, "_blank");
                          }}
                          className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
                        >
                          View Whitepaper
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Make Offer Modal */}
      <MakeOfferModal
        isOpen={isMakeOfferOpen}
        onClose={closeMakeOffer}
        nftTitle={title}
        nftImage={imageUrl}
        currentHighestBid={currentHighestBid}
        minimumBid={minimumBid}
        pastBids={pastBids}
        onSubmitOffer={handleSubmitOffer}
      />
    </>
  );
};