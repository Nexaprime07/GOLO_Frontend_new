"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import MerchantNavbar from "../../MerchantNavbar";
import { submitBannerPromotionRequest } from "../../../lib/api";

const OFFER_CATEGORIES = [
  "Special",
  "Festival",
  "Limited Time",
  "Combo",
  "Clearance",
];

function buildSelectedDates(startDate, endDate) {
  if (!startDate) return [];

  const start = new Date(startDate);
  const end = new Date(endDate || startDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [startDate];
  if (end < start) return [startDate];

  const dates = [];
  const current = new Date(start);
  let guard = 0;

  while (current <= end && guard < 366) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
    guard += 1;
  }

  return dates;
}

function isValidImageUrl(value) {
  if (!value) return false;
  if (value.startsWith("data:image/")) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export default function CreateMerchantOfferPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "Special",
    imageUrl: "",
    startDate: "",
    endDate: "",
    totalPrice: "0",
  });

  const uploadOfferImage = async (file) => {
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image is too large. Maximum size is 5MB.");
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", "choja_preset");
      form.append("cloud_name", "dcm1plq42");

      const res = await fetch("https://api.cloudinary.com/v1_1/dcm1plq42/image/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data?.secure_url) {
        throw new Error(data?.error?.message || "Image upload failed.");
      }

      setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
    } catch (err) {
      setError(err?.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const selectedDatesPreview = useMemo(
    () => buildSelectedDates(formData.startDate, formData.endDate || formData.startDate),
    [formData.startDate, formData.endDate],
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    const title = formData.title.trim();
    if (!title) {
      setError("Offer title is required.");
      return;
    }

    if (!formData.startDate) {
      setError("Start date is required.");
      return;
    }

    const imageUrl = formData.imageUrl.trim();
    if (!isValidImageUrl(imageUrl)) {
      setError("imageUrl must be a URL address or uploaded image data");
      return;
    }

    const selectedDates = buildSelectedDates(formData.startDate, formData.endDate || formData.startDate);
    if (selectedDates.length === 0) {
      setError("Please provide valid dates.");
      return;
    }

    const totalPrice = Number(formData.totalPrice || 0);
    if (Number.isNaN(totalPrice) || totalPrice < 0) {
      setError("Offer value must be 0 or more.");
      return;
    }

    setFormSubmitting(true);
    setError("");

    try {
      await submitBannerPromotionRequest({
        bannerTitle: title,
        bannerCategory: formData.category,
        imageUrl,
        selectedDates,
        totalPrice,
      });

      router.push("/merchant/offers");
    } catch (err) {
      setError(err?.message || "Failed to create offer");
    } finally {
      setFormSubmitting(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/offers/create");
      return;
    }

    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#ececec]" />;
  }

  if (user.accountType !== "merchant") return null;

  return (
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <MerchantNavbar activeKey="offers" />

      <main className="w-full px-8 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-[1200px] space-y-5">
          <button onClick={() => router.push("/merchant/offers")} className="text-[13px] text-[#5a5a5a] inline-flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#a9a9a9] text-[10px]">
              <ChevronLeft size={11} />
            </span>
            Back to Offers
          </button>

          <section className="rounded-[12px] border border-[#e2e2e2] bg-white p-5">
            <h1 className="text-[38px] font-semibold leading-none text-[#1f1f1f]">Create New Offer</h1>
            <p className="mt-3 text-[13px] text-[#6f6f6f] max-w-[700px]">
              Add your offer details, select active date range, and publish to your offer list.
            </p>

            <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-[#555]">Offer Title</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="h-10 w-full rounded-[8px] border border-[#dedede] bg-white px-3 text-[13px] outline-none"
                  placeholder="Enter offer title"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-[#555]">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="h-10 w-full rounded-[8px] border border-[#dedede] bg-white px-3 text-[13px] outline-none"
                >
                  {OFFER_CATEGORIES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-[11px] font-semibold text-[#555]">Image URL</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    className="h-10 w-full rounded-[8px] border border-[#dedede] bg-white px-3 text-[13px] outline-none"
                    placeholder="https://example.com/offer-image.jpg"
                  />
                  <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-[#d5d5d5] bg-[#f7f7f7] px-4 text-[12px] font-semibold text-[#333] hover:bg-[#efefef]">
                    <Upload size={14} />
                    {uploadingImage ? "Uploading..." : "Upload From Device"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        uploadOfferImage(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                {formData.imageUrl ? (
                  <div className="mt-2 h-24 w-24 overflow-hidden rounded-[8px] border border-[#e5e5e5] bg-[#fafafa]">
                    <img src={formData.imageUrl} alt="Offer preview" className="h-full w-full object-cover" />
                  </div>
                ) : null}
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-[#555]">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="h-10 w-full rounded-[8px] border border-[#dedede] bg-white px-3 text-[13px] outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-[#555]">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="h-10 w-full rounded-[8px] border border-[#dedede] bg-white px-3 text-[13px] outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-[#555]">Offer Value (Rs)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.totalPrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, totalPrice: e.target.value }))}
                  className="h-10 w-full rounded-[8px] border border-[#dedede] bg-white px-3 text-[13px] outline-none"
                />
              </div>

              <div className="rounded-[8px] border border-[#ececec] bg-[#fafafa] px-3 py-2 text-[12px] text-[#555] md:col-span-2">
                Selected active days: <span className="font-semibold text-[#1f1f1f]">{selectedDatesPreview.length}</span>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="h-10 rounded-[8px] bg-[#2f9e58] px-5 text-[12px] font-semibold text-white disabled:opacity-70"
                >
                  {formSubmitting ? "Creating Offer..." : "Create Offer"}
                </button>
              </div>
            </form>

            {error ? <p className="mt-3 text-[12px] text-[#ef4d4d]">{error}</p> : null}
          </section>
        </div>
      </main>
    </div>
  );
}
