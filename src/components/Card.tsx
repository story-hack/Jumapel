"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface NFTCardProps {
  imageUrl: string;
  title: string;
  description: string;
  alt?: string;
}

export const NFTCard: React.FC<NFTCardProps> = ({ 
  imageUrl, 
  title, 
  description, 
  alt = "NFT Image" 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover 
                       transition-transform duration-500 ease-out
                       group-hover:scale-105
                       will-change-transform"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
            }}
          />
          
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 
                          transition-colors duration-300"></div>
          
          {/* Optimized shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                          -translate-x-full group-hover:translate-x-full transition-transform duration-700 
                          transform rotate-12 scale-x-150 will-change-transform"></div>
        </div>
        
        {/* Content - Takes up 30% of card height */}
        <div className="p-3 sm:p-4 flex-[0.3] flex flex-col justify-center">
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2
                         line-clamp-1 group-hover:text-blue-600 
                         transition-colors duration-300">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2
                        group-hover:text-gray-700 transition-colors duration-300">
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
                <img
                  src={imageUrl}
                  alt={alt}
                  className="w-full h-64 lg:h-full object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
                />
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
                    <h3 className="text-xl font-semibold text-gray-900">NFT Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Token ID:</span>
                        <p className="font-medium text-gray-900">#001</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Creator:</span>
                        <p className="font-medium text-gray-900">Artist Name</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Collection:</span>
                        <p className="font-medium text-gray-900">Collection Name</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Blockchain:</span>
                        <p className="font-medium text-gray-900">Ethereum</p>
                      </div>
                    </div>

                    {/* Placeholder for additional content */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-500 text-center italic">
                        Additional NFT details and metadata will be displayed here
                      </p>
                    </div>

                    {/* Action Buttons Placeholder */}
                    <div className="flex gap-3 pt-4">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200">
                        Place Bid
                      </button>
                      <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-colors duration-200">
                        Make Offer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};