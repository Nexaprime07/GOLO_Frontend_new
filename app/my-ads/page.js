"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSidebar from "../components/ProfileSidebar";
import AdCard from "../components/AdCard";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { getMyAds, updateAd } from "../lib/api";

const CATEGORY_KEY_MAP = {
  Education: "educationData",
  Matrimonial: "matrimonialData",
  Vehicle: "vehicleData",
  Business: "businessData",
  Travel: "travelData",
  Astrology: "astrologyData",
  Property: "propertyData",
  "Public Notice": "publicNoticeData",
  "Lost & Found": "lostFoundData",
  Service: "serviceData",
  Personal: "personalData",
  Employment: "employmentData",
  Pets: "petsData",
  Mobiles: "mobileData",
  Electronics: "electronicsData",
  "Electronics & Home appliances": "electronicsData",
  Furniture: "furnitureData",
  "Greetings & Tributes": "greetingsData",
  Other: "otherData",
};

const splitCsv = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseDateCsv = (value) =>
  splitCsv(value)
    .map((item) => new Date(item))
    .filter((date) => !Number.isNaN(date.getTime()))
    .map((date) => date.toISOString());

const formatFieldLabel = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();

async function uploadImageFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "choja_preset");
  formData.append("cloud_name", "dcm1plq42");

  const uploadRes = await fetch("https://api.cloudinary.com/v1_1/dcm1plq42/image/upload", {
    method: "POST",
    body: formData,
  });

  const uploadData = await uploadRes.json();
  if (!uploadRes.ok || !uploadData?.secure_url) {
    throw new Error(uploadData?.error?.message || "Image upload failed");
  }
  return uploadData.secure_url;
}

export default function MyAds() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingAd, setEditingAd] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
  });
  const [editImages, setEditImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [categorySpecificFields, setCategorySpecificFields] = useState({});
  const [csdTypes, setCsdTypes] = useState({});
  const limit = 9;

  const openEditModal = (ad) => {
    setEditingAd(ad);
    setEditError("");

    setEditForm({
      title: ad?.title || "",
      description: ad?.description || "",
      location: ad?.location || "",
    });

    const csd = ad?.categorySpecificData || {};
    const types = {};
    const displayCsd = {};
    Object.keys(csd).forEach((k) => {
      const v = csd[k];
      if (Array.isArray(v)) {
        types[k] = "array";
        displayCsd[k] = v.join(", ");
      } else if (typeof v === "boolean") {
        types[k] = "boolean";
        displayCsd[k] = v;
      } else if (typeof v === "number") {
        types[k] = "number";
        displayCsd[k] = String(v);
      } else if (typeof v === "string" && v.length >= 10 && !isNaN(Date.parse(v)) && /^\d{4}-\d{2}-\d{2}/.test(v)) {
        types[k] = "date";
        displayCsd[k] = v.slice(0, 10);
      } else {
        types[k] = "string";
        displayCsd[k] = v != null ? String(v) : "";
      }
    });
    setCsdTypes(types);
    setCategorySpecificFields(displayCsd);

    setEditImages(Array.isArray(ad?.images) ? [...ad.images] : []);
    setNewImageFiles([]);
  };

  const closeEditModal = () => {
    if (editSaving) return;
    setEditingAd(null);
    setEditError("");
    setNewImageFiles([]);
  };

  const handleSaveEdit = async () => {
    if (!editingAd) return;

    const title = editForm.title.trim();
    const description = editForm.description.trim();
    const location = editForm.location.trim();

    if (!title || !description || !location) {
      setEditError("Title, description, and location are required.");
      return;
    }

    if (editImages.length + newImageFiles.length === 0) {
      setEditError("At least one image is required.");
      return;
    }

    // Reconstruct categorySpecificData with correct types
    const parsedCategorySpecificData = {};
    Object.keys(categorySpecificFields).forEach((k) => {
      const type = csdTypes[k];
      const val = categorySpecificFields[k];
      if (type === "array") parsedCategorySpecificData[k] = String(val).split(",").map((s) => s.trim()).filter(Boolean);
      else if (type === "number") parsedCategorySpecificData[k] = Number(val);
      else if (type === "boolean") parsedCategorySpecificData[k] = Boolean(val);
      else if (type === "date") parsedCategorySpecificData[k] = val ? new Date(val).toISOString() : null;
      else parsedCategorySpecificData[k] = String(val ?? "");
    });

    setEditSaving(true);
    setEditError("");
    try {
      const id = editingAd.adId || editingAd._id;

      const uploadedNewUrls = [];
      for (const file of newImageFiles) {
        const url = await uploadImageFile(file);
        uploadedNewUrls.push(url);
      }

      const images = [...editImages, ...uploadedNewUrls];
      const category = editingAd?.category || "";
      const categoryKey = CATEGORY_KEY_MAP[category];

      // Derive price and negotiable from category-specific data (mirrors post-ad logic)
      const derivedPrice = Number(
        parsedCategorySpecificData?.price ??
        parsedCategorySpecificData?.rent ??
        parsedCategorySpecificData?.askingPrice ??
        parsedCategorySpecificData?.rentAmount ??
        parsedCategorySpecificData?.pricePerPerson ??
        parsedCategorySpecificData?.consultationFee ??
        parsedCategorySpecificData?.fees ??
        0,
      ) || 0;
      const derivedNegotiable = Boolean(parsedCategorySpecificData?.negotiable);

      const payload = {
        title,
        description,
        location,
        price: derivedPrice,
        negotiable: derivedNegotiable,
        images,
        categorySpecificData: parsedCategorySpecificData,
      };
      if (categoryKey) payload[categoryKey] = parsedCategorySpecificData;

      const response = await updateAd(id, payload);

      if (!response?.success) {
        setEditError(response?.error || response?.message || "Failed to update ad.");
        return;
      }

      const updatedAd = response?.data;
      setAds((prev) =>
        prev.map((ad) => ((ad.adId || ad._id) === (editingAd.adId || editingAd._id) ? { ...ad, ...(updatedAd || {}), hasUsedEdit: true, editCount: 1 } : ad))
      );
      setEditingAd(null);
    } catch (error) {
      setEditError(error?.message || "Failed to update ad.");
    } finally {
      setEditSaving(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchMyAds() {
      setLoading(true);
      try {
        const response = await getMyAds({ page, limit });
        if (response.success) {
          setAds(response.data || []);
          setTotalPages(response.pagination?.pages || 1);
        }
      } catch {
        setAds([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMyAds();
  }, [isAuthenticated, page]);

  if (authLoading) return null;

  return (
    <>
      <Navbar />

      <div className="bg-[#F8F6F2] min-h-screen py-14 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-10">

          {/* LEFT SIDEBAR */}
          <ProfileSidebar />

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-3">

            <div className="bg-white rounded-3xl shadow-sm p-10">

              {/* Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
                <div>
                  <h1 className="text-3xl font-semibold text-black">
                    My Ads
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Manage and track your posted ads
                  </p>
                </div>

                <Link
                  href="/i-want"
                  className="group relative inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#157A4F] text-white font-semibold shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95"
                >
                  <span className="relative z-10">I Want</span>
                  <span className="absolute inset-0 rounded-full bg-[#1c9460] opacity-0 group-hover:opacity-20 blur-md transition duration-300"></span>
                </Link>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center py-20">
                  <p className="text-gray-500">Loading your ads...</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && ads.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <p className="text-gray-500 text-lg mb-4">You haven&apos;t posted any ads yet</p>
                  <Link
                    href="/post-ad"
                    className="px-6 py-3 rounded-full bg-[#157A4F] text-white font-semibold transition hover:bg-[#0f5c3a]"
                  >
                    Post Your First Ad
                  </Link>
                </div>
              )}

              {/* Ads Grid */}
              {!loading && ads.length > 0 && (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {ads.map((ad) => (
                    <AdCard
                      key={ad._id}
                      ad={ad}
                      onEdit={openEditModal}
                      onDelete={(deletedId) => {
                        setAds(prev => prev.filter(a => (a.adId || a._id) !== deletedId));
                      }}
                    />
                  ))}
                </div>
              )}

              {editingAd && (
                <div className="fixed inset-0 z-[10000] bg-black/40 px-4 py-6 overflow-y-auto">
                  <div className="min-h-full flex items-center justify-center">
                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      disabled={editSaving}
                      aria-label="Close edit modal"
                      className="absolute top-4 right-4 h-9 w-9 rounded-full border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50"
                    >
                      ×
                    </button>

                    <h3 className="text-xl font-semibold text-black pr-12">Edit Ad (Only 1 time)</h3>
                    <p className="text-sm text-gray-500 mt-1 pr-12">After saving once, this ad cannot be edited again.</p>

                    <div className="mt-5 space-y-6">

                      {/* ── Basic Info ── */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Basic Info</p>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                              value={editForm.title}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={editForm.description}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                              rows={4}
                              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                              value={editForm.location}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* ── Ad Details (category-specific fields rendered as labeled inputs) ── */}
                      {Object.keys(categorySpecificFields).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Ad Details</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.keys(categorySpecificFields).map((key) => {
                              const type = csdTypes[key];
                              const label = formatFieldLabel(key);
                              const val = categorySpecificFields[key];
                              if (type === "boolean") {
                                return (
                                  <div key={key} className="flex items-center gap-2 pt-6">
                                    <input
                                      type="checkbox"
                                      id={`csd-${key}`}
                                      checked={Boolean(val)}
                                      onChange={(e) => setCategorySpecificFields((prev) => ({ ...prev, [key]: e.target.checked }))}
                                      className="w-4 h-4 accent-[#157A4F]"
                                    />
                                    <label htmlFor={`csd-${key}`} className="text-sm font-medium text-gray-700 cursor-pointer">{label}</label>
                                  </div>
                                );
                              }
                              if (type === "date") {
                                return (
                                  <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                    <input
                                      type="date"
                                      value={String(val)}
                                      onChange={(e) => setCategorySpecificFields((prev) => ({ ...prev, [key]: e.target.value }))}
                                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                                    />
                                  </div>
                                );
                              }
                              if (type === "number") {
                                return (
                                  <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                    <input
                                      type="number"
                                      value={String(val)}
                                      onChange={(e) => setCategorySpecificFields((prev) => ({ ...prev, [key]: e.target.value }))}
                                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                                    />
                                  </div>
                                );
                              }
                              return (
                                <div key={key}>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {label}{type === "array" ? " (comma separated)" : ""}
                                  </label>
                                  <input
                                    type="text"
                                    value={String(val)}
                                    onChange={(e) => setCategorySpecificFields((prev) => ({ ...prev, [key]: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ── Images ── */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Images</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {editImages.map((url, index) => (
                            <div key={`${url}-${index}`} className="relative">
                              <img src={url} alt={`Ad image ${index + 1}`} className="h-20 w-20 object-cover rounded-xl border border-gray-200" />
                              <button
                                type="button"
                                onClick={() => setEditImages((prev) => prev.filter((_, i) => i !== index))}
                                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Add more images</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setNewImageFiles((prev) => [...prev, ...files]);
                            e.target.value = "";
                          }}
                          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                        />
                        {newImageFiles.length > 0 && (
                          <p className="text-xs text-gray-500 mt-2">{newImageFiles.length} new image{newImageFiles.length > 1 ? "s" : ""} selected</p>
                        )}
                      </div>

                      {editError && (
                        <p className="text-sm text-red-600">{editError}</p>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        onClick={closeEditModal}
                        disabled={editSaving}
                        className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={editSaving}
                        className="px-4 py-2 rounded-xl bg-[#157A4F] text-white font-semibold disabled:opacity-60"
                      >
                        {editSaving ? "Saving..." : "Save Edit"}
                      </button>
                    </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-16">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:border-[#157A4F] hover:text-[#157A4F] transition disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-4 py-2 rounded-lg ${p === page
                        ? "bg-[#157A4F] text-white font-semibold shadow-sm"
                        : "border border-gray-300 bg-white hover:border-[#157A4F] hover:text-[#157A4F] transition"
                        }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:border-[#157A4F] hover:text-[#157A4F] transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}