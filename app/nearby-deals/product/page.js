"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowLeft, MapPin, Phone, Star, Heart, Share2, ShoppingCart, Tag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getMerchantProductById, getPublicMerchantProfile, getPublicMerchantProducts, getWishlistIds, likeProductWithOffer } from "../../lib/api";

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
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  
  const offerId = searchParams.get("offerId");
  const merchantId = searchParams.get("merchantId") || "";

  useEffect(() => {
    const loadProductData = async (showLoader = true) => {
      const pid = searchParams.get("productId");
      const mid = searchParams.get("merchantId");
      
      if (!pid) {
        setError("Product ID is missing");
        setLoading(false);
        return;
      }

      try {
        if (showLoader) setLoading(true);
        setError("");

              let productData = null;
        let productLoaded = false;

        // 1. Try fetching directly from merchant product API (works if caller has merchant auth)
        if (mid) {
          try {
            const productRes = await getMerchantProductById(pid);
            if (productRes?.data) {
              productData = productRes.data;
              productLoaded = true;
            }
          } catch (err) {
            console.log("Merchant API not available, trying public products");
          }
        }

        // 2. Try public merchant products list to get live stock (works for all users)
        if (!productLoaded && mid) {
          try {
            const publicRes = await getPublicMerchantProducts(mid, { limit: 100 });
            const allProducts = Array.isArray(publicRes?.data)
              ? publicRes.data
              : (publicRes?.data?.products || []);
            const found = allProducts.find(
              (p) => String(p._id || p.id || p.productId) === pid,
            );
            if (found) {
              productData = found;
              productLoaded = true;
            }
          } catch (err) {
            console.log("Public merchant products API not available, using cache");
          }
        }

        // 3. Build from session cache / URL params as final fallback
        if (!productData) {
          let cached = null;
          try {
            if (typeof window !== "undefined") {
              const cacheKey = `golo_nearby_offer_product_${offerId || "na"}_${pid}`;
              const raw = sessionStorage.getItem(cacheKey);
              cached = raw ? JSON.parse(raw) : null;
            }
          } catch {
            cached = null;
          }

          const urlParams = Object.fromEntries(searchParams.entries());
          const rawName = cached?.productName || urlParams.productName || "";
          const rawPrice = cached?.offerPrice ?? urlParams.price ?? "0";
          const rawOriginalPrice = cached?.originalPrice ?? urlParams.originalPrice ?? "0";
          const rawImage = cached?.imageUrl || urlParams.imageUrl || "";
          const rawCategory = cached?.category || urlParams.category || "Product";
          const rawDescription = cached?.description || urlParams.description || "Premium quality product with excellent features and benefits.";

          productData = {
            _id: pid,
            productId: pid,
            productName: decodeURIComponent(rawName) || "Product",
            name: decodeURIComponent(rawName) || "Product",
            description: decodeURIComponent(rawDescription),
            imageUrl: decodeURIComponent(rawImage) || "/images/deal2.avif",
            image: decodeURIComponent(rawImage) || "/images/deal2.avif",
            offerPrice: Number(rawPrice) || 0,
            price: Number(rawPrice) || 0,
            originalPrice: Number(rawOriginalPrice) || 0,
            stockQuantity: Number(cached?.stockQuantity ?? urlParams.stockQuantity ?? 0) || 0,
            category: decodeURIComponent(rawCategory),
          };
        }

        // After any live API fetch, refresh the session cache with up-to-date stock
        if (productLoaded && productData && typeof window !== "undefined") {
          try {
            const cacheKey = `golo_nearby_offer_product_${offerId || "na"}_${pid}`;
            const existing = JSON.parse(sessionStorage.getItem(cacheKey) || "{}");
            sessionStorage.setItem(
              cacheKey,
              JSON.stringify({
                ...existing,
                productId: String(productData._id || productData.productId || pid),
                offerId,
                merchantId: mid || "",
                productName: productData.name || productData.productName || existing.productName || "Product",
                description: productData.description || existing.description || "",
                imageUrl: productData.imageUrl || productData.image || existing.imageUrl || "",
                offerPrice: productData.offerPrice ?? productData.price ?? existing.offerPrice ?? 0,
                originalPrice: productData.originalPrice ?? existing.originalPrice ?? 0,
                // Always write the latest live stockQuantity so next visit uses fresh value
                stockQuantity: productData.stockQuantity ?? existing.stockQuantity ?? 0,
                category: productData.category || existing.category || "Product",
              }),
            );
          } catch {
            // cache write failure is non-fatal
          }
        }

        setProduct(productData);

        // Load merchant details if merchantId is provided
        if (mid) {
          try {
            const merchantRes = await getPublicMerchantProfile(mid);
            if (merchantRes?.data) {
              setMerchant(merchantRes.data);
            }
          } catch (err) {
            console.log("Failed to load merchant profile:", err);
          }
        }

      } catch (err) {
        console.error("Error loading product data:", err);
        setError(err?.data?.message || err?.message || "Failed to load product details");
      } finally {
        if (showLoader) setLoading(false);
      }
    };

    loadProductData(true);

    const refreshTimer = setInterval(() => {
      loadProductData(false);
    }, 15000);

    const handleFocus = () => {
      loadProductData(false);
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(refreshTimer);
      window.removeEventListener("focus", handleFocus);
    };
  }, [searchParams]);

  useEffect(() => {
    const loadLikeState = async () => {
      if (!offerId || !user) {
        setIsLiked(false);
        return;
      }

      try {
        const response = await getWishlistIds();
        const ids = response?.data || [];
        setIsLiked(Array.isArray(ids) ? ids.includes(offerId) : false);
      } catch {
        setIsLiked(false);
      }
    };

    loadLikeState();
  }, [offerId, user]);

  const handleBackToOffer = () => {
    if (offerId) {
      router.push(`/nearby-deals/deal?offerId=${offerId}`);
    } else if (searchParams.get("merchantId")) {
      router.push(`/nearby-deals/store?merchantId=${searchParams.get("merchantId")}`);
    } else {
      router.back();
    }
  };

  const handleViewStore = () => {
    if (merchantId) {
      router.push(`/nearby-deals/store?merchantId=${merchantId}`);
    }
  };

  const handleLikeProduct = async () => {
    if (!offerId) return;
    if (!user) {
      const pid = searchParams.get("productId");
      const mid = searchParams.get("merchantId");
      const params = new URLSearchParams({
        productId: pid || "",
        offerId: offerId || "",
        merchantId: mid || "",
      });
      router.push(`/login?redirect=/nearby-deals/product?${params.toString()}`);
      return;
    }

    try {
      setIsLikeLoading(true);
      await likeProductWithOffer(offerId, {
        productId: product?.productId || product?._id || "",
        productName: product?.productName || product?.name || "Product",
        category: product?.category || "",
        imageUrl: product?.imageUrl || product?.image || "",
        offerPrice: Number(product?.offerPrice || product?.price || 0),
        originalPrice: Number(product?.originalPrice || 0),
      });
      setIsLiked(true);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleShareProduct = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `${process.env.NEXT_PUBLIC_WEB_URL || ""}/nearby-deals/product?productId=${product?.productId || product?._id || ""}&offerId=${offerId || ""}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: productName,
          text: productDescription,
          url: shareUrl,
        });
        setShareMessage("Product shared successfully.");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage("Product link copied to clipboard.");
      } else {
        setShareMessage("Sharing is not supported in this browser.");
      }
    } catch {
      setShareMessage("Sharing cancelled.");
    }
  };

  const calculateDiscount = () => {
    if (!product?.originalPrice || !product?.offerPrice) return 0;
    const original = Number(product.originalPrice);
    const offer = Number(product.offerPrice);
    if (original <= 0 || offer >= original) return 0;
    return Math.round(((original - offer) / original) * 100);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f3f3]">
        <style>{`
          @keyframes shimmer-prod-page {
            0% { background-position: -600px 0; }
            100% { background-position: 600px 0; }
          }
          .sk-prod {
            background: linear-gradient(90deg, #e2e5ea 25%, #eef0f4 50%, #e2e5ea 75%);
            background-size: 1200px 100%;
            animation: shimmer-prod-page 1.5s ease-in-out infinite;
            border-radius: 6px;
          }
        `}</style>
        <Navbar />
        <div className="mx-auto max-w-[1260px] px-4 lg:px-6 py-4 lg:py-6">
          {/* Back + breadcrumb */}
          <div className="h-4 w-40 sk-prod mb-4 rounded-full" />
          <div className="h-3 w-64 sk-prod mb-4 rounded-full" />

          {/* Main product section */}
          <section className="bg-white rounded-2xl overflow-hidden shadow-sm mb-8 p-4 lg:p-6">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
              {/* Image block */}
              <div className="relative overflow-hidden rounded-xl">
                <div className="h-[400px] lg:h-[500px] sk-prod rounded-xl" />
                {/* Stock badge placeholder */}
                <div className="absolute top-4 right-4 h-7 w-24 sk-prod rounded-full" />
              </div>

              {/* Details */}
              <div className="flex flex-col space-y-4">
                <div className="h-9 w-4/5 sk-prod" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 sk-prod rounded-full" />
                </div>
                <div className="h-4 w-full sk-prod" />
                <div className="h-4 w-11/12 sk-prod" />
                <div className="h-4 w-4/5 sk-prod" />

                {/* Price box */}
                <div className="bg-[#fef5e7] rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-36 sk-prod rounded" />
                    <div className="h-7 w-20 sk-prod rounded" />
                    <div className="h-6 w-16 sk-prod rounded-full" />
                  </div>
                  <div className="h-12 w-full sk-prod rounded-lg" />
                  <div className="h-3 w-48 sk-prod mx-auto rounded-full" />
                </div>

                {/* Stock info */}
                <div className="h-16 sk-prod rounded-lg" />

                {/* Extra info */}
                <div className="space-y-2">
                  <div className="h-3 w-36 sk-prod rounded-full" />
                  <div className="h-3 w-28 sk-prod rounded-full" />
                  <div className="h-3 w-40 sk-prod rounded-full" />
                </div>
              </div>
            </div>
          </section>

          {/* Merchant section skeleton */}
          <section className="bg-white rounded-2xl p-6 mb-8">
            <div className="h-7 w-48 sk-prod mb-6" />
            <div className="grid lg:grid-cols-[1fr_300px] gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full sk-prod flex-shrink-0" />
                  <div className="space-y-2">
                    <div className="h-5 w-32 sk-prod" />
                    <div className="h-3 w-24 sk-prod" />
                  </div>
                </div>
                <div className="h-3 w-full sk-prod" />
                <div className="h-3 w-4/5 sk-prod" />
              </div>
              <div className="space-y-3">
                <div className="h-10 sk-prod rounded-lg" />
                <div className="h-10 sk-prod rounded-lg" />
              </div>
            </div>
          </section>
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

  const discount = calculateDiscount();
  const productName = product?.productName || product?.name || "Product";
  const productPrice = Number(product?.offerPrice || product?.price || 0);
  const originalPrice = Number(product?.originalPrice || 0);
  const productImage = product?.imageUrl || product?.image || "/images/deal2.avif";
  const productDescription = product?.description || "Premium quality product with excellent features and benefits.";

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <Navbar />

      <div className="mx-auto max-w-[1260px] px-4 lg:px-6 py-4 lg:py-6">
        {/* Back Navigation */}
        <button
          onClick={handleBackToOffer}
          className="flex items-center gap-2 text-sm text-[#666] hover:text-[#333] mb-4 transition"
        >
          <ArrowLeft size={16} />
          Back to {offerId ? "Offer Details" : "Previous Page"}
        </button>

        {/* Breadcrumb */}
        <p className="text-[11px] text-[#7b7b7b] mb-4">
          Products <span className="mx-1">›</span> {product?.category || "All Categories"} <span className="mx-1">›</span>
          <span className="font-semibold text-[#2d2d2d]"> {productName}</span>
        </p>

        {/* Main Product Section */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 p-4 lg:p-6">
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-xl bg-[#f0f0f0]">
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
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
              {product?.stockQuantity !== undefined && (
                <span className="absolute top-4 right-4 bg-[#157a4f] text-white px-3 py-1 rounded-full text-sm font-bold">
                  Stock: {product.stockQuantity}
                </span>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1b1f24] leading-tight">
                  {productName}
                </h1>
                <div className="flex gap-2">
                  <button onClick={handleShareProduct} className="p-2 rounded-full hover:bg-[#f0f0f0]">
                    <Share2 size={20} className="text-[#666]" />
                  </button>
                  <button
                    onClick={handleLikeProduct}
                    disabled={isLikeLoading}
                    className="p-2 rounded-full hover:bg-[#f0f0f0] disabled:opacity-60"
                  >
                    <Heart size={20} className={isLiked ? "text-[#ef4444]" : "text-[#666]"} fill={isLiked ? "#ef4444" : "none"} />
                  </button>
                </div>
              </div>
              {shareMessage ? <p className="mb-2 text-xs text-[#4b5563]">{shareMessage}</p> : null}

              {/* Category */}
              {product?.category && (
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={14} className="text-[#666]" />
                  <span className="text-sm text-[#666] bg-[#f0f4ff] px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-[#666] mb-6 leading-relaxed">
                {productDescription}
              </p>

              {/* Price Section */}
              <div className="bg-[#fef5e7] rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl lg:text-4xl font-bold text-[#e7a91d]">
                    Rs.{productPrice.toLocaleString("en-IN")}
                  </span>
                  {originalPrice > 0 && originalPrice > productPrice && (
                    <>
                      <span className="text-lg text-[#999] line-through">
                        Rs.{originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="bg-[#e7a91d] text-white px-2 py-1 rounded-full text-xs font-bold">
                        SAVE {discount}%
                      </span>
                    </>
                  )}
                </div>

                <button
                  className="w-full h-12 bg-[#157a4f] text-white rounded-lg font-bold text-lg transition-all hover:bg-[#0f6a42] flex items-center justify-center gap-2"
                  onClick={() => {
                    const mid = searchParams.get("merchantId");
                    if (mid) {
                      router.push(`/nearby-deals/store?merchantId=${mid}`);
                    } else {
                      router.back();
                    }
                  }}
                >
                  <ShoppingCart size={20} />
                  Visit Store
                </button>

                <p className="text-xs text-[#666] text-center mt-2">
                  Visit the store to explore more products
                </p>
              </div>

              {/* Stock Information */}
              {product?.stockQuantity !== undefined && (
                <div className="bg-[#f0f9f6] rounded-lg p-3 mb-4">
                  <p className="text-xs font-bold text-[#157a4f] uppercase tracking-wide">Availability</p>
                  <p className="font-bold text-[#1f2430] mt-1">
                    {product.stockQuantity > 0 
                      ? `${product.stockQuantity} units in stock`
                      : "Out of stock"
                    }
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="text-xs text-[#666] space-y-1">
                <p>• Premium quality product</p>
                <p>• Verified by merchant</p>
                {offerId && <p>• Special offer pricing</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Merchant Information Section */}
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
                          <Star key={i} size={14} className="text-[#f4ba34]" fill="#f4ba34" />
                        ))}
                      </div>
                      <span className="text-sm text-[#666]">4.8 (250+ reviews)</span>
                    </div>
                  </div>
                </div>

                {merchant?.profile?.bio && (
                  <p className="text-sm text-[#666] leading-relaxed mb-4">
                    {merchant.profile.bio}
                  </p>
                )}

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
                  onClick={handleViewStore}
                  className="w-full h-10 bg-[#fef5e7] border border-[#e7a91d] text-[#8f6515] rounded-lg font-semibold text-sm hover:bg-[#fcecd8] transition"
                >
                  View Store →
                </button>
                
                <button
                  onClick={() => router.push('/nearby-deals')}
                  className="w-full h-10 bg-[#f0f4ff] border border-[#4a5fc1] text-[#4a5fc1] rounded-lg font-semibold text-sm hover:bg-[#e6edff] transition"
                >
                  Back to Deals
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Product Specifications */}
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
                {product?.stockQuantity !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-[#666]">Stock:</span>
                    <span className="font-medium text-[#1f2329]">{product.stockQuantity} units</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-[#1f2329] mb-3">Additional Features</h3>
              <div className="space-y-2 text-sm text-[#666]">
                <p>• High quality materials</p>
                <p>• Verified by merchant</p>
                <p>• Warranty included</p>
                <p>• Fast delivery available</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
