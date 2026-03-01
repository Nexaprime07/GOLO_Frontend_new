"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { createAd } from "../lib/api";

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
  templateId,
  selectedDates,
  categoryDetails,
}) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if ((templateId === 1 || !templateId) && uploadedImages && uploadedImages.length > 1) {
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

  const handlePostAd = async () => {
    setSubmitError("");

    // Check auth
    if (!isAuthenticated) {
      router.push("/login?redirect=/post-ad/form");
      return;
    }

    // Basic validation
    if (!adTitleState?.trim()) {
      setSubmitError("Please enter an ad title.");
      return;
    }
    if (!adDescriptionState?.trim()) {
      setSubmitError("Please enter a description.");
      return;
    }
    if (!selectedCategory) {
      setSubmitError("Please select a category.");
      return;
    }

    setIsSubmitting(true);
    setIsReviewStarted(true);

    try {
      // 1) First upload all files to Cloudinary
      const uploadedUrls = [];
      if (uploadedImages && uploadedImages.length > 0) {
        for (const img of uploadedImages) {
          if (img.file) {
            const formData = new FormData();
            formData.append("file", img.file);
            formData.append("upload_preset", "choja_preset"); // We will create this in the next step
            formData.append("cloud_name", "dcm1plq42");

            const uploadRes = await fetch(
              `https://api.cloudinary.com/v1_1/dcm1plq42/image/upload`,
              {
                method: "POST",
                body: formData,
              }
            );
            const uploadData = await uploadRes.json();
            if (uploadData.secure_url) {
              uploadedUrls.push(uploadData.secure_url);
            }
          } else if (typeof img === "string") {
            uploadedUrls.push(img);
          } else if (img.url && !img.url.startsWith("blob:")) {
            uploadedUrls.push(img.url);
          }
        }
      }

      // Build the ad data payload
      const adData = {
        title: adTitleState.trim(),
        description: adDescriptionState.trim(),
        category: typeof selectedCategory === 'string' ? selectedCategory : (selectedCategory?.name || "Other"),
        subCategory: typeof selectedCategory === 'string' ? "General" : (selectedCategory?.subCategory || selectedCategory?.name || "General"),
        // Swap out dummy logic with our permanently uploaded Cloudinary URLs
        images: uploadedUrls,
        price: parseFloat(mobilePrice || monthlyRent || "0") || 0,
        location: cities?.[0] || "India",
        city: cities?.[0] || "",
        cities: cities || [],
        primaryContact: primaryContact || "",
        userType: "Customer",
        contactInfo: {
          name: user?.name || "User", // Required by backend ContactInfoDto
          phone: primaryContact || "",
          email: user?.email || "",
          preferredContactMethod: "phone"
        },
        templateId: templateId || 1,
        selectedDates: selectedDates || [],
        tags: [typeof selectedCategory === 'string' ? selectedCategory : selectedCategory?.name].filter(Boolean),
      };

      // Add category-specific data
      if (selectedCategory?.name === "Property" && propertyTypeRent) {
        adData.propertyData = { propertyType: propertyTypeRent, rent: monthlyRent };
      }
      if (selectedCategory?.name === "Mobiles" && mobilePrice) {
        adData.mobileData = { price: mobilePrice };
      }

      // Add any additional category details
      if (categoryDetails) {
        let categoryKey = selectedCategory?.name?.toLowerCase() + "Data";

        // Handle specific naming conventions from backend
        if (selectedCategory?.name === "Public Notice") categoryKey = "publicNoticeData";
        if (selectedCategory?.name === "Lost & Found") categoryKey = "lostAndFoundData";
        if (selectedCategory?.name === "Greetings & Tributes") categoryKey = "greetingsData"; // Or tributes based on sub

        adData[categoryKey] = categoryDetails;
      }

      const response = await createAd(adData);

      if (response.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          router.push("/my-ads");
        }, 2000);
      } else {
        setSubmitError(response.message || "Failed to post ad. Please try again.");
      }
    } catch (error) {
      const status = error.status || error.data?.statusCode;
      // Token expired — clear session and redirect to login
      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
        router.push('/login?redirect=/post-ad/form&reason=session_expired');
        return;
      }
      const errorMsg = error.data?.message || error.message;
      if (Array.isArray(errorMsg)) {
        setSubmitError(errorMsg.join(", "));
      } else {
        setSubmitError(errorMsg || "Failed to post ad. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  templateId === 1 || !templateId
                    ? uploadedImages[carouselIndex]?.url
                    : uploadedImages[0]?.url
                }
                alt="preview"
                className="w-full h-full object-contain"
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
              {selectedCategory.name || selectedCategory}
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

        {/* Error Message */}
        {submitError && (
          <p className="text-red-500 text-sm text-center">{submitError}</p>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <p className="text-green-700 font-semibold">🎉 Ad posted successfully!</p>
            <p className="text-green-600 text-sm mt-1">Redirecting to My Ads...</p>
          </div>
        )}

        <button
          onClick={handlePostAd}
          disabled={isSubmitting || submitSuccess}
          className="w-full bg-[#157A4F] text-white py-3 rounded-xl hover:bg-[#0f5c3a] transition shadow-md font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Posting..." : submitSuccess ? "✓ Posted!" : "Review & Post Ad"}
        </button>

        <button className="w-full border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition font-medium">
          Save Draft
        </button>
      </div>
    </div>
  );
}