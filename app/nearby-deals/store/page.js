"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { MapPin, Phone, Star } from "lucide-react";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  getNearbyOffers,
  getPublicMerchantProducts,
  getPublicMerchantProfile,
  getPublicMerchantStoreLocation,
  getUserById,
} from "../../lib/api";

// Dynamically import Leaflet map
const LeafletMap = dynamic(() => import("../../components/LeafletMap"), { ssr: false });

export default function NearbyStorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f3f3]" />}>
      <NearbyStoreContent />
    </Suspense>
  );
}

function NearbyStoreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [merchant, setMerchant] = useState(null);
  const [location, setLocation] = useState(null);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const merchantId = searchParams.get("merchantId");

  const normalizeId = (value) => String(value || "").trim();

  const extractOffers = (response) => {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.offers)) return response.data.offers;
    if (Array.isArray(response?.data?.items)) return response.data.items;
    if (Array.isArray(response?.offers)) return response.offers;
    if (Array.isArray(response?.items)) return response.items;
    return [];
  };

  const extractProducts = (response) => {
    if (Array.isArray(response?.data?.products)) return response.data.products;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.products)) return response.products;
    return [];
  };

  const dedupeProducts = (items = []) => {
    const map = new Map();

    items.forEach((item) => {
      const key = String(item?.productId || item?.id || item?.name || "");
      if (!key || map.has(key)) return;
      map.set(key, item);
    });

    return Array.from(map.values());
  };

  useEffect(() => {
    const loadMerchantData = async () => {
      if (!merchantId) {
        setError("Merchant ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [userRes, offersRes] = await Promise.all([
          getUserById(merchantId),
          getNearbyOffers({ limit: 100 }),
        ]);

        if (!userRes?.data) {
          setError("Store not found");
          setLoading(false);
          return;
        }

        const targetMerchantId = normalizeId(merchantId);
        const allOffers = extractOffers(offersRes);
        const merchantOffers = allOffers.filter((offer) => {
          const offerMerchantId = normalizeId(
            offer?.merchant?.merchantId ||
              offer?.merchantId ||
              offer?.merchant?._id ||
              offer?.merchant?.id ||
              offer?.userId,
          );
          return offerMerchantId === targetMerchantId;
        });
        setOffers(merchantOffers);

        const firstOfferMerchant = merchantOffers[0]?.merchant || null;
        const mergedMerchant = {
          ...userRes.data,
          name: firstOfferMerchant?.name || userRes.data?.name,
          profilePhoto: firstOfferMerchant?.profilePhoto || userRes.data?.profilePhoto,
          merchantProfile: userRes.data?.merchantProfile || null,
          profile: {
            ...(userRes.data?.profile || {}),
            address:
              userRes.data?.profile?.address ||
              userRes.data?.merchantProfile?.storeLocation ||
              firstOfferMerchant?.address ||
              "",
            phone:
              userRes.data?.profile?.phone ||
              userRes.data?.merchantProfile?.contactNumber ||
              "",
          },
        };

        setMerchant(mergedMerchant);

        const fallbackProducts = dedupeProducts(
          merchantOffers.flatMap((offer) =>
            Array.isArray(offer?.selectedProducts)
              ? offer.selectedProducts.map((product) => ({
                  ...product,
                  id: product?.productId,
                  name: product?.productName,
                  price: Number(product?.offerPrice || 0),
                  originalPrice: Number(product?.originalPrice || 0),
                  image: product?.imageUrl || "",
                  category: offer?.category || "Product",
                }))
              : [],
          ),
        );

        setProducts(fallbackProducts);
        setLocation(null);

        try {
          const publicProfileRes = await getPublicMerchantProfile(merchantId);
          if (publicProfileRes?.data) {
            setMerchant((prev) => ({
              ...prev,
              ...publicProfileRes.data,
              merchantProfile: publicProfileRes.data?.merchantProfile || prev?.merchantProfile || null,
              profile: {
                ...(prev?.profile || {}),
                ...(publicProfileRes.data?.profile || {}),
              },
            }));
          }
        } catch {
        }

        try {
          const locationRes = await getPublicMerchantStoreLocation(merchantId);
          if (locationRes?.data) {
            setLocation(locationRes.data);
          }
        } catch {
        }

        try {
          const productsRes = await getPublicMerchantProducts(merchantId, { limit: 100 });
          const publicProducts = extractProducts(productsRes);
          if (publicProducts.length > 0) {
            setProducts(publicProducts);
          }
        } catch {
        }
      } catch (err) {
        console.error("Error loading merchant data:", err);
        setError(err?.data?.message || err?.message || "Failed to load merchant data");
      } finally {
        setLoading(false);
      }
    };

    loadMerchantData();
  }, [merchantId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f3f3]">
        <Navbar />
        <div className="mx-auto max-w-[1260px] px-6 py-20">
          <div className="rounded-xl border border-[#d8dce3] bg-white p-6 text-center text-sm text-[#6b7280]">
            Loading store details...
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !merchant) {
    return (
      <main className="min-h-screen bg-[#f3f3f3]">
        <Navbar />
        <div className="mx-auto max-w-[1260px] px-6 py-20">
          <div className="rounded-xl border border-[#fecaca] bg-[#fff1f2] p-6 text-sm text-[#b91c1c]">
            {error || "Store not found"}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const storeRating = Math.round(Math.random() * 50) / 10 + 4;
  const reviewCount = Math.floor(Math.random() * 2000) + 500;
  const offerLocation = offers[0]?.merchant || null;
  const resolvedLatitude = Number(
    location?.latitude ??
      merchant?.merchantProfile?.storeLocationLatitude ??
      offerLocation?.latitude,
  );
  const resolvedLongitude = Number(
    location?.longitude ??
      merchant?.merchantProfile?.storeLocationLongitude ??
      offerLocation?.longitude,
  );
  const hasMapLocation =
    !Number.isNaN(resolvedLatitude) &&
    !Number.isNaN(resolvedLongitude) &&
    resolvedLatitude !== 0 &&
    resolvedLongitude !== 0;
  const resolvedAddress =
    location?.address ||
    merchant?.profile?.address ||
    merchant?.merchantProfile?.storeLocation ||
    offerLocation?.address ||
    "";
  const resolvedPhone =
    merchant?.profile?.phone ||
    merchant?.merchantProfile?.contactNumber ||
    "";
  const resolvedBio =
    merchant?.profile?.bio ||
    merchant?.merchantProfile?.storeSubCategory ||
    "Premium services and products from our trusted merchant";

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <div className="mx-auto max-w-[1260px] px-4 lg:px-6 pb-14 pt-5">
        {/* Breadcrumb */}
        <p className="text-[11px] text-[#7a7a7a]">
          Deals <span className="mx-1">›</span> {merchant?.profile?.city || "Store"} <span className="mx-1">›</span> 
          <span className="font-medium"> {merchant?.name || "Store"}</span>
        </p>

        {/* Store Header */}
        <h1 className="mt-3 text-3xl lg:text-5xl font-bold leading-none text-[#1f2329]">
          {merchant?.name || "Store"}
        </h1>
        <p className="mt-2 text-sm lg:text-base text-[#67707b]">
          {resolvedBio}
        </p>

        {/* Store Info */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs lg:text-sm text-[#4e5965]">
          <span className="font-semibold text-[#f2b632]">★★★★★</span>
          <span><span className="font-semibold text-[#1f2329]">{storeRating.toFixed(1)}</span> ({reviewCount.toLocaleString()} Reviews)</span>
          <span className="text-[#9ca3ad]">|</span>
          <span>
            {merchant?.profile?.city && merchant?.profile?.state ? `${merchant.profile.city}, ${merchant.profile.state}` : "Location"}
            {resolvedPhone && <span className="ml-2"> • {resolvedPhone}</span>}
          </span>
        </div>

        {/* Main Section */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Store Image */}
          <div className="overflow-hidden rounded-2xl border border-[#d8dce3] bg-white shadow-sm">
            <div className="relative h-80 lg:h-96">
              <Image
                src={merchant?.profilePhoto || "/images/place2.avif"}
                alt={merchant?.name || "Store"}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Store Info Card */}
          <aside className="rounded-2xl border border-[#d8dce3] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1f2329] mb-4">Store Information</h2>
            
            <div className="space-y-3 text-sm text-[#5f6974] border-b border-[#e5e8ec] pb-4 mb-4">
              {resolvedPhone && (
                <p><Phone size={14} className="mr-2 inline text-[#157a4f]" /> {resolvedPhone}</p>
              )}
              {merchant?.profile?.city && (
                <p><MapPin size={14} className="mr-2 inline text-[#157a4f]" /> 
                  {merchant.profile.city}
                  {merchant.profile.state && `, ${merchant.profile.state}`}
                </p>
              )}
              {merchant?.profile?.address && (
                <p className="text-xs text-[#666]">{merchant.profile.address}</p>
              )}
              {merchant?.profile?.bio && (
                <p className="mt-3 pt-3 border-t text-[#5d6670] text-xs leading-relaxed">{merchant.profile.bio}</p>
              )}
            </div>

            {merchant?.profile?.interests && merchant.profile.interests.length > 0 && (
              <div className="border-b border-[#e5e8ec] pb-4 mb-4">
                <p className="text-xs font-bold text-[#4a5fc1] uppercase tracking-wide mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {merchant.profile.interests.slice(0, 3).map((cat, idx) => (
                    <span key={`${cat}-${idx}`} className="text-xs bg-[#f0f4ff] text-[#4a5fc1] px-2 py-1 rounded-full">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#157a4f] uppercase tracking-wide">Store Location</p>
                  <p className="text-sm font-semibold text-[#1f2329] mt-1">
                    {resolvedAddress || "Merchant address will appear here once available"}
                  </p>
                </div>
                {hasMapLocation ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ecf8f1] px-3 py-1 text-[11px] font-semibold text-[#157a4f]">
                    <MapPin size={12} />
                    Live Pin
                  </span>
                ) : null}
              </div>

              <div className="overflow-hidden rounded-xl border border-[#d8dce3] bg-[#f7faf8]">
                {hasMapLocation ? (
                  <div className="h-[240px]">
                    <LeafletMap
                      latitude={resolvedLatitude}
                      longitude={resolvedLongitude}
                      markerTitle={merchant?.name || "Merchant Store"}
                      zoom={15}
                    />
                  </div>
                ) : (
                  <div className="flex h-[240px] items-center justify-center px-6 text-center">
                    <div>
                      <p className="text-sm font-semibold text-[#1f2329]">Location pin unavailable</p>
                      <p className="mt-2 text-xs leading-relaxed text-[#66707c]">
                        Store coordinates have not been added for this merchant yet, so the live map cannot be shown.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {hasMapLocation ? (
                <p className="text-[11px] text-[#66707c]">
                  Pinpoint map showing the merchant store for easier tracking and navigation.
                </p>
              ) : null}
            </div>
          </aside>
        </section>

        {/* Popular Service / First Offer */}
        {offers.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-[#1f2329] mb-4">Popular Service</h2>
            <div className="grid gap-6 md:grid-cols-1">
              {offers.slice(0, 1).map((offer, idx) => (
                <div key={offer?.offerId || offer?._id || `popular-offer-${idx}`} className="bg-white rounded-2xl border border-[#d8dce3] overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => router.push(`/nearby-deals/deal?offerId=${offer.offerId}`)}>
                  <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 p-6">
                    <div className="relative h-60 rounded-xl overflow-hidden bg-[#f0f0f0]">
                      <Image
                        src={offer?.imageUrl || "/images/deal2.avif"}
                        alt={offer?.title}
                        fill
                        className="object-cover"
                      />
                      {offer?.selectedProducts?.length > 0 && (
                        <span className="absolute top-3 left-3 bg-[#e7a91d] text-white px-3 py-1 rounded-full text-xs font-bold">
                          Limited Time
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#1f2329] mb-2">{offer?.title}</h3>
                      <p className="text-sm text-[#5d6670] mb-4 leading-relaxed">{offer?.description || "Exclusive offer from our store"}</p>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-[#157a4f]">Rs.{offer?.totalPrice?.toLocaleString("en-IN")}</span>
                      </div>
                      <button onClick={() => router.push(`/nearby-deals/deal?offerId=${offer.offerId}`)} className="w-full bg-[#157a4f] text-white py-2 rounded-lg font-semibold hover:bg-[#0f6a42] transition">
                        View Offer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Products Section */}
        {products.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-[#1f2329] mb-6">Products</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, idx) => (
                <div key={product?._id || product?.productId || product?.id || `${product?.name || 'product'}-${idx}`} className="bg-white rounded-xl border border-[#d8dce3] overflow-hidden hover:shadow-md transition">
                  <div className="relative h-40 bg-[#f0f0f0]">
                    <Image
                      src={product?.image || product?.imageUrl || "/images/place2.avif"}
                      alt={product?.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-[#1f2329] text-sm mb-1 line-clamp-2">{product?.name}</p>
                    <p className="text-xs text-[#666] mb-3 line-clamp-1">{product?.category || "Product"}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#157a4f]">Rs.{product?.price?.toLocaleString("en-IN") || "0"}</span>
                      {product?.originalPrice && (
                        <span className="text-xs text-[#999] line-through">Rs.{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Offers Section */}
        {offers.length > 1 && (
          <section className="mt-12 mb-6">
            <h2 className="text-2xl font-bold text-[#1f2329] mb-6">All Offers</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {offers.slice(1).map((offer, idx) => (
                <div key={offer?.offerId || offer?._id || `offer-${idx}`} onClick={() => router.push(`/nearby-deals/deal?offerId=${offer.offerId}`)} className="bg-white rounded-xl border border-[#d8dce3] overflow-hidden hover:shadow-md cursor-pointer transition">
                  <div className="relative h-48 bg-[#f0f0f0]">
                    <Image
                      src={offer?.imageUrl || "/images/deal2.avif"}
                      alt={offer?.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-[#1f2329] text-sm mb-1 line-clamp-2">{offer?.title}</p>
                    <p className="text-xs text-[#666] mb-3">{offer?.category || "Offer"}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#157a4f]">Rs.{offer?.totalPrice?.toLocaleString("en-IN") || "0"}</span>
                      <span className="text-xs bg-[#e7a91d] text-white px-2 py-1 rounded-full font-bold">DEAL</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No Products/Offers */}
        {products.length === 0 && offers.length === 0 && (
          <section className="mt-12 bg-white rounded-2xl border border-[#d8dce3] p-8 text-center">
            <p className="text-[#666] text-lg">No products or offers available at this store yet</p>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
