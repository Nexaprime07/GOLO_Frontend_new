"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function FormSidebar({ 
  adTitleState, 
  adDescriptionState, 
  cities, 
  uploadedImages,
  primaryContact,
  selectedCategory,
  mobilePrice,
  monthlyRent,
  propertyTypeRent,
  isReviewStarted,
  setIsReviewStarted,
  templateId
}) {
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (templateId === 1 && uploadedImages && uploadedImages.length > 1) {
      const id = setInterval(() => {
        setCarouselIndex((p) =>
          uploadedImages.length ? (p + 1) % uploadedImages.length : 0
        );
      }, 3000);
      return () => clearInterval(id);
    }
    setCarouselIndex(0);
  }, [templateId, uploadedImages]);

  // Dynamic price logic
  const getPrice = () => {
    const templatePrices = { 1: "₹5", 2: "₹3", 3: "₹2" };
    if (templateId && templatePrices[templateId]) return templatePrices[templateId];
    return "₹0";
  };

  const templateCost = parseInt(getPrice().replace(/[^0-9]/g, "")) || 0;
  const gst = Math.round(templateCost * 0.18);
  const subtotal = templateCost + gst;

  return (
    <div className="space-y-8 sticky top-20">

      {/* Live Preview */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <p className="text-xs text-[#157A4F] font-semibold mb-4 tracking-wide">
          LIVE PREVIEW
        </p>

        {/* Image Preview */}
        {templateId !== 3 && (
          <div className="rounded-2xl overflow-hidden bg-gray-200 h-48 flex items-center justify-center">
            {uploadedImages && uploadedImages.length > 0 ? (
              <img
                src={
                  templateId === 1
                    ? uploadedImages[carouselIndex]?.url
                    : uploadedImages[0]?.url
                }
                width={400}
                height={250}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">
                No image uploaded
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h4 className="font-semibold mt-4 text-gray-800 line-clamp-2">
          {adTitleState || "Your ad title will appear here"}
        </h4>

        {/* Price */}
        <p className="font-bold text-xl mt-2 text-[#157A4F]">
          {getPrice()}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {adDescriptionState || "Description will appear here..."}
        </p>

        {/* Locations */}
        {cities && cities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {cities.map((city) => (
              <span
                key={city}
                className="px-2 py-1 text-xs bg-[#FFF3D6] text-gray-700 rounded-full"
              >
                {city}
              </span>
            ))}
          </div>
        )}

        {/* Category Badge */}
        {selectedCategory && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <span className="text-xs text-[#157A4F] font-medium">
              {selectedCategory.name}
            </span>
          </div>
        )}
      </div>

      {/* Promotion & Pricing */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-6">
        <h4 className="font-semibold text-lg text-gray-800">
          Promotion & Pricing
        </h4>

        <div className="space-y-3 text-sm">
          
          {/* Template Cost */}
          <div className="flex justify-between">
            <span>Template cost</span>
            <span className="font-medium">₹{templateCost}</span>
          </div>

          {/* GST */}
          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span className="font-medium">₹{gst}</span>
          </div>

        </div>

        {/* Subtotal */}
        <div className="border-t pt-4 flex justify-between font-semibold text-gray-800">
          <span>Subtotal</span>
          <span className="text-[#157A4F]">
            ₹{subtotal}
          </span>
        </div>

        <button 
          onClick={() => setIsReviewStarted(true)}
          className="w-full bg-[#157A4F] text-white py-3 rounded-xl hover:bg-[#0f5c3a] transition shadow-md font-semibold">
          Review & Post Ad
        </button>

        <button className="w-full border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition font-medium">
          Save Draft
        </button>
      </div>
    </div>
  );
}