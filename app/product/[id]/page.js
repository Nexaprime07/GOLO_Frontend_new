"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Navbar from "./../../components/Navbar";
import Footer from "./../../components/Footer";
import Recommended from "@/app/components/Recommended";
import { getAdById } from "../../lib/api";
import {
  Heart,
  Share2,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function ProductDetails({ params }) {
  const resolvedParams = use(params);
  const adId = resolvedParams.id;

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  // Fallback data
  const fallbackImages = [
    "/images/listing1.webp",
    "/images/listing2.webp",
    "/images/listing3.webp",
    "/images/listing4.webp",
  ];

  useEffect(() => {
    async function fetchAd() {
      if (!adId) return;
      setLoading(true);
      try {
        const response = await getAdById(adId);
        if (response.success && response.data) {
          setAd(response.data);
        } else {
          setError("Ad not found");
        }
      } catch (err) {
        setError("Failed to load ad details");
      } finally {
        setLoading(false);
      }
    }
    fetchAd();
  }, [adId]);

  const images = ad?.images?.length > 0 ? ad.images : fallbackImages;
  const isExternalImage = ad?.images?.length > 0;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-[#F8F6F2] min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-[#157A4F]" />
            <p className="text-gray-500">Loading ad details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="bg-[#F8F6F2] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-700 mb-2">{error}</p>
            <p className="text-gray-500">The ad you&apos;re looking for might have been removed</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-[#F8F6F2] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Breadcrumb */}
          <p className="text-sm text-gray-500 mb-6">
            Home &nbsp;›&nbsp; {ad?.category || "Category"} &nbsp;›&nbsp; {ad?.subCategory || "Sub Category"} &nbsp;›&nbsp;
            <span className="text-gray-800 font-medium">
              {ad?.title || "Product"}
            </span>
          </p>

          <div className="grid md:grid-cols-3 gap-10">

            {/* ================= LEFT SECTION ================= */}
            <div className="md:col-span-2">

              {/* Image + Thumbnails */}
              <div className="flex gap-6">

                {/* Thumbnails */}
                <div className="flex flex-col gap-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition
                        ${selectedImage === index
                          ? "border-[#157A4F]"
                          : "border-gray-200 hover:border-[#157A4F]"
                        }`}
                    >
                      <Image
                        src={img}
                        width={100}
                        height={100}
                        alt={`thumbnail-${index}`}
                        className="object-cover w-full h-full"
                        unoptimized={isExternalImage}
                      />
                    </div>
                  ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm relative border border-gray-200">
                  <Image
                    src={images[selectedImage]}
                    width={900}
                    height={600}
                    alt={ad?.title || "Product"}
                    className="rounded-xl w-full object-cover transition-all duration-300"
                    unoptimized={isExternalImage}
                  />
                  <div className="absolute bottom-8 right-10 bg-[#157A4F] text-white text-xs px-3 py-1 rounded-full">
                    {selectedImage + 1} / {images.length} Photos
                  </div>
                </div>

              </div>

              {/* Tags */}
              <div className="flex gap-3 mt-8">
                {ad?.isPromoted && (
                  <span className="text-xs font-semibold bg-[#FFF3D6] text-[#157A4F] px-3 py-1 rounded-full">
                    Featured Ad
                  </span>
                )}
                <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                  {ad?.category || "General"}
                </span>
                {ad?.subCategory && (
                  <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                    {ad.subCategory}
                  </span>
                )}
              </div>

              {/* Title */}
              <div className="flex justify-between items-start mt-4">
                <h1 className="text-2xl font-bold text-gray-800 w-4/5">
                  {ad?.title || "Product Title"}
                </h1>

                <div className="flex gap-3 text-gray-400">
                  <Heart className="cursor-pointer hover:text-[#F5B849] transition" size={20} />
                  <Share2 className="cursor-pointer hover:text-[#F5B849] transition" size={20} />
                </div>
              </div>

              {/* Info Row */}
              <div className="flex items-center gap-6 text-sm text-gray-500 mt-3">
                <span>
                  Posted{" "}
                  {ad?.createdAt
                    ? new Date(ad.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                    : "recently"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {ad?.location || "Location not specified"}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-[#F5B849] fill-[#F5B849]" />
                  {ad?.views || 0} views
                </span>
              </div>

              {/* Description Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm mt-8 border border-gray-200">
                <h2 className="font-semibold text-lg mb-4">
                  Detailed Description
                </h2>

                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {ad?.description || "No description available."}
                </p>

                {/* Tags */}
                {ad?.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {ad.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* ================= RIGHT SIDEBAR ================= */}
            <div>
              <div className="sticky top-24 space-y-6">

                {/* Price Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 font-medium">
                      {ad?.negotiable ? "Negotiable Price" : "Final Price"}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star size={14} className="text-[#F5B849] fill-[#F5B849]" />
                      {ad?.views || 0}
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold mt-3 text-[#157A4F]">
                    ₹{ad?.price?.toLocaleString() || "0"}
                  </h2>

                  <button className="w-full mt-6 py-3 rounded-xl bg-[#157A4F] hover:bg-[#0f5c3a] text-white font-semibold flex items-center justify-center gap-2 transition">
                    <MessageCircle size={18} />
                    Chat with Seller
                  </button>

                  <button className="w-full mt-4 py-3 rounded-xl bg-[#F5B849] hover:bg-[#e0a837] text-white font-semibold flex items-center justify-center gap-2 transition">
                    <Phone size={18} />
                    Call for Details
                  </button>
                </div>

                {/* Contact Info Card */}
                {ad?.contactInfo && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    {ad.contactInfo.phone && (
                      <p className="text-sm text-gray-600">📞 {ad.contactInfo.phone}</p>
                    )}
                    {ad.contactInfo.email && (
                      <p className="text-sm text-gray-600 mt-1">✉️ {ad.contactInfo.email}</p>
                    )}
                    {ad.contactInfo.whatsapp && (
                      <p className="text-sm text-gray-600 mt-1">💬 {ad.contactInfo.whatsapp}</p>
                    )}
                  </div>
                )}

                {/* Location Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={18} className="text-[#157A4F]" />
                    <h3 className="font-semibold">Location</h3>
                  </div>
                  <p className="text-sm text-gray-600">{ad?.location}</p>
                  {ad?.city && <p className="text-sm text-gray-500">{ad.city}, {ad.state}</p>}
                  {ad?.pincode && <p className="text-sm text-gray-500">PIN: {ad.pincode}</p>}
                </div>

                {/* Safety Tips */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck size={18} className="text-[#157A4F]" />
                    <p className="font-semibold">Safety Tips</p>
                  </div>

                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Meet in a public location</li>
                    <li>• Inspect the product before paying</li>
                    <li>• Avoid making advance payments</li>
                  </ul>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
      <Recommended />
      <Footer />
    </>
  );
}
