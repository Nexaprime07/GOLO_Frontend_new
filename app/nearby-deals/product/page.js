"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Tag,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  getMerchantProductById,
  getNearbyOfferDetails,
  getPublicMerchantProductById,
  getPublicMerchantProducts,
  getPublicMerchantProfile,
} from "../../lib/api";

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f3f3]" />}>
      <ProductDetailContent />
    </Suspense>
  );
}

function ProductDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const offerId = searchParams.get("offerId") || "";
  const merchantId = searchParams.get("merchantId") || "";
  const productId = searchParams.get("productId") || "";

  const [product, setProduct] = useState(null);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  useEffect(() => {
    if (!productId) {
      setError("Product ID is missing");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProductData = async (isBackgroundRefresh = false) => {
      if (!isBackgroundRefresh) setLoading(true);
      try {
        setError("");
        let productData = null;

        let gotLiveData = false;

        try {
          const productRes = await getMerchantProductById(productId);
          if (productRes?.data) {
            productData = productRes.data;
            gotLiveData = true;
          }
        } catch {
          productData = null;
        }

        if (!productData) {
          try {
            const publicProductRes = await getPublicMerchantProductById(productId);
            if (publicProductRes?.data) {
              productData = publicProductRes.data;
              gotLiveData = true;
            }
          } catch {
            productData = null;
          }
        }

        if (!productData && merchantId) {
          try {
            const publicRes = await getPublicMerchantProducts(merchantId, {
              page: 1,
              limit: 200,
            });
            const rows = Array.isArray(publicRes?.data?.products)
              ? publicRes.data.products
              : Array.isArray(publicRes?.data)
              ? publicRes.data
              : Array.isArray(publicRes?.data?.rows)
              ? publicRes.data.rows
              : Array.isArray(publicRes?.rows)
              ? publicRes.rows
              : [];
            productData = rows.find((item) => {
              const id = String(item?._id || item?.id || item?.productId || "");
              return id === String(productId);
            }) || null;
            if (productData) gotLiveData = true;
          } catch {
            productData = null;
          }
        }

        if (!productData && offerId) {
          try {
            const offerRes = await getNearbyOfferDetails(offerId);
            const selected = Array.isArray(offerRes?.data?.selectedProducts)
              ? offerRes.data.selectedProducts
              : [];
            const matched = selected.find((item) => {
              const id = String(item?._id || item?.id || item?.productId || "");
              return id === String(productId);
            });
            if (matched) {
              productData = matched;
              gotLiveData = true;
            }
          } catch {
            productData = null;
          }
        }

        if (!productData) {
          throw new Error(
            "Live product data could not be fetched. Please check backend/public product endpoints."
          );
        }

        if (!cancelled) {
          setProduct(productData);
          setLastUpdatedAt(new Date());
          if (!gotLiveData) {
            setError("Live product data is unavailable for this product.");
          }
        }

        if (merchantId) {
          try {
            const merchantRes = await getPublicMerchantProfile(merchantId);
            if (!cancelled && merchantRes?.data) {
              setMerchant(merchantRes.data);
            }
          } catch {
            // keep rendering product even if merchant profile fails
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.data?.message || err?.message || "Failed to load product details");
        }
      } finally {
        if (!cancelled && !isBackgroundRefresh) {
          setLoading(false);
        }
      }
    };

    loadProductData(false);
    const timer = setInterval(() => {
      loadProductData(true);
    }, 15000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [offerId, merchantId, productId]);

  const discount = useMemo(() => {
    const original = Number(product?.originalPrice || 0);
    const offer = Number(product?.offerPrice || product?.price || 0);
    if (original <= 0 || offer >= original) return 0;
    return Math.round(((original - offer) / original) * 100);
  }, [product]);

  const productName = product?.productName || product?.name || "Product";
  const productPrice = Number(product?.offerPrice || product?.price || 0);
  const originalPrice = Number(product?.originalPrice || 0);
  const productImage = product?.imageUrl || product?.image || "/images/deal2.avif";
  const productDescription = product?.description || "Description unavailable.";
  const safeStock = Number(product?.stockQuantity ?? 0);
  const refreshedAt = lastUpdatedAt
    ? lastUpdatedAt.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  const merchantRating = Number(
    merchant?.rating ?? merchant?.averageRating ?? merchant?.profile?.rating ?? 0
  );
  const merchantReviewCount = Number(
    merchant?.reviewCount ?? merchant?.totalReviews ?? merchant?.profile?.reviewCount ?? 0
  );

  const dynamicSpecs = [
    { label: "Sub-category", value: product?.subCategory || product?.subcategory || null },
    { label: "Brand", value: product?.brand || null },
    { label: "SKU", value: product?.sku || product?.productCode || null },
    { label: "Unit", value: product?.unit || null },
  ].filter((item) => item.value);

  const handleBack = () => {
    if (offerId) {
      router.push(`/nearby-deals/deal?offerId=${offerId}`);
      return;
    }
    if (merchantId) {
      router.push(`/nearby-deals/store?merchantId=${merchantId}`);
      return;
    }
    router.back();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f3f3]">
        <Navbar />
        <div className="mx-auto max-w-[1260px] px-6 py-20">
          <div className="rounded-xl border border-[#d8dce3] bg-white p-6 text-center text-sm text-[#6b7280]">
            Loading product details...
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#f3f3f3]">
        <Navbar />
        <div className="mx-auto max-w-[1260px] px-6 py-20">
          <div className="rounded-xl border border-[#fecaca] bg-[#fff1f2] p-6 text-sm text-[#b91c1c]">
            {error || "Product not found"}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <Navbar />

      <div className="mx-auto max-w-[1260px] px-4 lg:px-6 py-4 lg:py-6">
        <button onClick={handleBack} className="flex items-center gap-2 text-sm text-[#666] hover:text-[#333] mb-4 transition">
          <ArrowLeft size={16} />
          Back to {offerId ? "Offer Details" : "Previous Page"}
        </button>

        <p className="text-[11px] text-[#7b7b7b] mb-4">
          Products <span className="mx-1">›</span> {product?.category || "All Categories"} <span className="mx-1">›</span>
          <span className="font-semibold text-[#2d2d2d]"> {productName}</span>
        </p>

        <section className="bg-white rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 p-4 lg:p-6">
            <div className="relative overflow-hidden rounded-xl bg-[#f0f0f0]">
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-sm text-[#666]">Loading image...</div>
                  </div>
                )}
              </div>
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-[#e7a91d] text-white px-3 py-1 rounded-full text-sm font-bold">
                  {discount}% OFF
                </span>
              )}
              <span className="absolute top-4 right-4 bg-[#157a4f] text-white px-3 py-1 rounded-full text-sm font-bold">
                Stock: {safeStock}
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1b1f24] leading-tight">{productName}</h1>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-[#f0f0f0]">
                    <Share2 size={20} className="text-[#666]" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-[#f0f0f0]">
                    <Heart size={20} className="text-[#666]" />
                  </button>
                </div>
              </div>

              {product?.category && (
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={14} className="text-[#666]" />
                  <span className="text-sm text-[#666] bg-[#f0f4ff] px-2 py-1 rounded-full">{product.category}</span>
                </div>
              )}

              <p className="text-sm text-[#666] mb-4 leading-relaxed">{productDescription}</p>
              {refreshedAt && <p className="text-xs text-[#6b7280] mb-5">Live data refreshed at {refreshedAt}</p>}

              <div className="bg-[#fef5e7] rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl lg:text-4xl font-bold text-[#e7a91d]">Rs.{productPrice.toLocaleString("en-IN")}</span>
                  {originalPrice > 0 && originalPrice > productPrice && (
                    <>
                      <span className="text-lg text-[#999] line-through">Rs.{originalPrice.toLocaleString("en-IN")}</span>
                      <span className="bg-[#e7a91d] text-white px-2 py-1 rounded-full text-xs font-bold">SAVE {discount}%</span>
                    </>
                  )}
                </div>

                <button
                  className="w-full h-12 bg-[#157a4f] text-white rounded-lg font-bold text-lg transition-all hover:bg-[#0f6a42] flex items-center justify-center gap-2"
                  onClick={() => {
                    if (merchantId) {
                      router.push(`/nearby-deals/store?merchantId=${merchantId}`);
                    } else {
                      router.back();
                    }
                  }}
                >
                  <ShoppingCart size={20} />
                  Visit Store
                </button>

                <p className="text-xs text-[#666] text-center mt-2">Visit the store to explore more products</p>
              </div>

              <div className="bg-[#f0f9f6] rounded-lg p-3 mb-4">
                <p className="text-xs font-bold text-[#157a4f] uppercase tracking-wide">Availability</p>
                <p className="font-bold text-[#1f2430] mt-1">
                  {safeStock > 0 ? `${safeStock} units in stock` : "Out of stock"}
                </p>
              </div>

              <div className="text-xs text-[#666] space-y-1">
                <p>• Product ID: {product?._id || product?.productId || "-"}</p>
                <p>• Merchant: {merchant?.name || product?.merchantName || "Unavailable"}</p>
                {offerId && <p>• Special offer pricing</p>}
              </div>
            </div>
          </div>
        </section>

        {merchant && (
          <section className="bg-white rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#1f2329] mb-6">About the Merchant</h2>
            <div className="grid lg:grid-cols-[1fr_300px] gap-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#f0f0f0]">
                    <Image
                      src={merchant?.profilePhoto || "/images/place2.avif"}
                      alt={merchant?.name || "Merchant"}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1f2329]">{merchant?.name || "Merchant"}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.round(merchantRating) ? "text-[#f4ba34]" : "text-[#d6dbe2]"}
                            fill={i < Math.round(merchantRating) ? "#f4ba34" : "none"}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-[#666]">
                        {merchantRating > 0
                          ? `${merchantRating.toFixed(1)} (${merchantReviewCount} review${merchantReviewCount === 1 ? "" : "s"})`
                          : "Rating unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                {merchant?.profile?.bio && <p className="text-sm text-[#666] leading-relaxed mb-4">{merchant.profile.bio}</p>}

                <div className="space-y-2 text-sm">
                  {merchant?.profile?.address && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#157a4f]" />
                      <span className="text-[#666]">{merchant.profile.address}</span>
                    </div>
                  )}
                  {merchant?.profile?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-[#157a4f]" />
                      <span className="text-[#666]">{merchant.profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => merchantId && router.push(`/nearby-deals/store?merchantId=${merchantId}`)}
                  className="w-full h-10 bg-[#fef5e7] border border-[#e7a91d] text-[#8f6515] rounded-lg font-semibold text-sm hover:bg-[#fcecd8] transition"
                >
                  View Store →
                </button>

                <button
                  onClick={() => router.push("/nearby-deals")}
                  className="w-full h-10 bg-[#f0f4ff] border border-[#4a5fc1] text-[#4a5fc1] rounded-lg font-semibold text-sm hover:bg-[#e6edff] transition"
                >
                  Back to Deals
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="bg-white rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#1f2329] mb-6">Product Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#1f2329] mb-3">Product Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#666]">Name:</span>
                  <span className="font-medium text-[#1f2329]">{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Category:</span>
                  <span className="font-medium text-[#1f2329]">{product?.category || "General"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Price:</span>
                  <span className="font-medium text-[#157a4f]">Rs.{productPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Stock:</span>
                  <span className="font-medium text-[#1f2329]">{safeStock}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#1f2329] mb-3">Additional Features</h3>
              <div className="space-y-2 text-sm text-[#666]">
                {dynamicSpecs.length > 0 ? (
                  dynamicSpecs.map((spec) => (
                    <p key={spec.label}>• {spec.label}: {String(spec.value)}</p>
                  ))
                ) : (
                  <p>• Additional specifications are not provided by merchant.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
