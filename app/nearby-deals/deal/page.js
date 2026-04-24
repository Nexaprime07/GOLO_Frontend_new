"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Clock3, MapPin, Shield, Star, Ticket, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useVoucher } from "../../context/VoucherContext";
import { getNearbyOfferDetails } from "../../lib/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function formatDate(dateValue) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function computeBestDiscountPercent(products = []) {
  return Math.round(
    products.reduce((best, product) => {
      const original = toNumber(product?.originalPrice, 0);
      const offer = toNumber(product?.offerPrice, 0);
      if (original <= 0 || offer < 0 || offer >= original) {
        return best;
      }
      const discount = ((original - offer) / original) * 100;
      return Math.max(best, discount);
    }, 0),
  );
}

function computeStartingPrice(products = [], fallback = 0) {
  if (!Array.isArray(products) || products.length === 0) {
    return toNumber(fallback, 0);
  }

  const values = products
    .map((item) => toNumber(item?.offerPrice, 0))
    .filter((price) => price > 0);

  if (!values.length) {
    return toNumber(fallback, 0);
  }

  return Math.min(...values);
}

export default function NearbyDealDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F3F3F3]" />}>
      <NearbyDealDetailsContent />
    </Suspense>
  );
}

function NearbyDealDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { claimOfferHandler, loading: claimLoading } = useVoucher();

  const [offer, setOffer] = useState(null);
  const [loadingOffer, setLoadingOffer] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [claimError, setClaimError] = useState("");
  const [isClaimed, setIsClaimed] = useState(false);

  const offerId = searchParams.get("offerId") || "";

  const readCachedOffer = (id) => {
    if (!id || typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(`golo_nearby_offer_${id}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.offerId !== id) return null;
      return parsed;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const loadOffer = async () => {
      if (!offerId) {
        setLoadError("Offer ID is missing.");
        setLoadingOffer(false);
        return;
      }

      const cachedOffer = readCachedOffer(offerId);
      if (cachedOffer) {
        setOffer(cachedOffer);
      }

      try {
        setLoadingOffer(true);
        setLoadError("");
        const response = await getNearbyOfferDetails(offerId);
        setOffer(response?.data || null);
      } catch (err) {
        if (!cachedOffer) {
          setLoadError(err?.data?.message || err?.message || "Failed to load offer details.");
          setOffer(null);
        }
      } finally {
        setLoadingOffer(false);
      }
    };

    loadOffer();
  }, [offerId]);

  const selectedProducts = useMemo(
    () => (Array.isArray(offer?.selectedProducts) ? offer.selectedProducts : []),
    [offer],
  );

  const startingPrice = useMemo(
    () => computeStartingPrice(selectedProducts, offer?.totalPrice),
    [selectedProducts, offer],
  );

  const bestDiscountPercent = useMemo(
    () => computeBestDiscountPercent(selectedProducts),
    [selectedProducts],
  );

  const validityText = useMemo(() => {
    if (!offer?.startsAt && !offer?.endsAt) return "Validity not specified";
    return `${formatDate(offer?.startsAt)} - ${formatDate(offer?.endsAt)}`;
  }, [offer]);

  const handleClaimOffer = async () => {
    if (!offerId) return;

    if (!user) {
      router.push(`/login?redirect=/nearby-deals/deal?offerId=${offerId}`);
      return;
    }

    setClaimError("");
    try {
      const response = await claimOfferHandler(offerId);
      const voucherId = response?.data?._id;
      if (!voucherId) {
        throw new Error("Voucher was created but voucher id is missing.");
      }
      setIsClaimed(true);
      router.push(`/nearby-deals/deal/claimed-offer?voucherId=${voucherId}`);
    } catch (err) {
      setClaimError(err?.data?.message || err?.message || "Failed to claim offer.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F3F3]">
      <Navbar />

      <div className="mx-auto max-w-[1260px] px-6 pb-10 pt-5">
        {loadingOffer ? (
          <div className="rounded-xl border border-[#d8dce3] bg-white p-6 text-sm text-[#6b7280]">
            Loading offer details...
          </div>
        ) : loadError ? (
          <div className="rounded-xl border border-[#fecaca] bg-[#fff1f2] p-6 text-sm text-[#b91c1c]">
            {loadError}
          </div>
        ) : !offer ? (
          <div className="rounded-xl border border-[#d8dce3] bg-white p-6 text-sm text-[#6b7280]">
            Offer not found.
          </div>
        ) : (
          <>
            <p className="text-[11px] text-[#7b7b7b]">
              Deals <span className="mx-1">›</span>
              <span className="font-semibold text-[#2d2d2d]">{offer?.title || "Offer details"}</span>
            </p>

            <section className="mt-6 rounded-[14px] border border-[#20262e22] bg-[#f8f8f8] p-4 shadow-[0_2px_0_rgba(0,0,0,0.05)]">
              <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
                <div className="relative overflow-hidden rounded-[12px] border border-[#20262e22] bg-white">
                  <Image
                    src={offer?.imageUrl || "/images/deal2.avif"}
                    alt={offer?.title || "Offer image"}
                    width={960}
                    height={620}
                    className="h-full min-h-[320px] w-full object-cover"
                  />
                  {bestDiscountPercent > 0 ? (
                    <span className="absolute left-4 top-4 rounded-full bg-[#fd4f91] px-3 py-1 text-[10px] font-bold text-white">
                      {bestDiscountPercent}% OFF
                    </span>
                  ) : null}
                </div>

                <div className="rounded-[12px] bg-[#f8f8f8] p-2">
                  <div className="flex items-start justify-between gap-3">
                    <h1 className="text-[34px] font-bold leading-[1.1] text-[#1b1f24]">
                      {offer?.title || "Untitled Offer"}
                    </h1>
                  </div>

                  <p className="mt-3 text-[13px] leading-5 text-[#5d6670]">
                    Category: {offer?.category || "Special"}
                  </p>

                  <div className="mt-5 rounded-[12px] bg-[#eceff3] p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[42px] font-bold leading-none text-[#e7a91d]">
                        Rs.{startingPrice.toLocaleString("en-IN")}
                      </span>
                      {bestDiscountPercent > 0 ? (
                        <span className="rounded-full bg-[#efbe51] px-2 py-0.5 text-[10px] font-bold text-[#402800]">
                          {bestDiscountPercent}% OFF
                        </span>
                      ) : null}
                    </div>

                    {claimError ? (
                      <p className="mt-3 text-[13px] text-[#dc2626]">⚠️ {claimError}</p>
                    ) : null}

                    <button
                      onClick={handleClaimOffer}
                      disabled={claimLoading || isClaimed}
                      className="mt-4 h-11 w-full rounded-[8px] border border-[#157a4f] bg-white text-[17px] font-bold text-[#157a4f] transition-all duration-200 hover:bg-[#157a4f] hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {claimLoading ? "Claiming..." : isClaimed ? "✓ Claimed" : "Claim Offer"}
                    </button>

                    <p className="mt-3 text-center text-[10px] text-[#7e8892]">
                      <Shield size={11} className="mr-1 inline" /> Secure claim • No upfront payment required
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div className="rounded-[8px] border border-[#d6d9de] bg-[#eff2f7] px-3 py-2">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-[#6573c7]">VALIDITY</p>
                      <p className="mt-1 text-[16px] font-bold text-[#1f2430]">{validityText}</p>
                    </div>
                  </div>

                  <p className="mt-4 border-t border-[#d6d9de] pt-3 text-[11px] text-[#727b86]">
                    <Clock3 size={11} className="mr-1 inline" /> Digital redemption via QR code
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.75fr_1fr]">
              <div className="space-y-8">
                <div>
                  <h2 className="text-[32px] font-bold text-[#1f2329]">Selected Products</h2>
                  {selectedProducts.length === 0 ? (
                    <p className="mt-3 text-[14px] text-[#66707b]">No product details were provided for this offer.</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {selectedProducts.map((item, index) => {
                        const productId = item?.productId || item?.id || item?._id;
                        return (
                          <article
                            key={`${productId || index}`}
                            onClick={() => productId && router.push(`/product/${productId}/merchant-page`)}
                            className="rounded-[12px] border border-[#d8dce3] bg-white p-3 flex items-center gap-3 cursor-pointer hover:shadow-lg hover:border-[#157a4f] transition"
                            title="View product details"
                          >
                            <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f3f4f6]">
                              <Image
                                src={item?.imageUrl || "/images/deal2.avif"}
                                alt={item?.productName || "Product"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-[15px] font-semibold text-[#1f2329]">{item?.productName || "Product"}</p>
                              <p className="text-[12px] text-[#6b7280]">Stock: {toNumber(item?.stockQuantity, 0)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[16px] font-bold text-[#157a4f]">Rs.{toNumber(item?.offerPrice, 0).toLocaleString("en-IN")}</p>
                              <p className="text-[12px] text-[#9ca3af] line-through">Rs.{toNumber(item?.originalPrice, 0).toLocaleString("en-IN")}</p>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-[32px] font-bold text-[#1f2329]">Terms & Information</h2>
                  <div className="mt-4 space-y-3">
                    <article className="rounded-[12px] border border-[#d8dce3] bg-white px-4 py-3">
                      <p className="text-[13px] font-bold text-[#1f2329]">Promotion Expiry</p>
                      <p className="mt-2 text-[12px] leading-5 text-[#66707b]">
                        {offer?.promotionExpiryText || "Not specified"}
                      </p>
                    </article>
                    <article className="rounded-[12px] border border-[#d8dce3] bg-white px-4 py-3">
                      <p className="text-[13px] font-bold text-[#1f2329]">Terms & Conditions</p>
                      <p className="mt-2 text-[12px] leading-5 text-[#66707b]">
                        {offer?.termsAndConditions || "Not specified"}
                      </p>
                    </article>
                    <article className="rounded-[12px] border border-[#d8dce3] bg-white px-4 py-3">
                      <p className="text-[13px] font-bold text-[#1f2329]">Example Usage</p>
                      <p className="mt-2 text-[12px] leading-5 text-[#66707b]">
                        {offer?.exampleUsage || "Not specified"}
                      </p>
                    </article>
                  </div>
                </div>
              </div>

              <aside className="lg:sticky lg:top-24 h-fit self-start">
                <div className="rounded-[12px] border border-[#d8dce3] bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full border border-[#d8dce3] bg-[#f3f4f6]">
                      {offer?.merchant?.profilePhoto && String(offer.merchant.profilePhoto).trim() ? (
                        <Image
                          src={offer.merchant.profilePhoto}
                          alt={offer?.merchant?.name || "Merchant"}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[#9ca3af]">
                          <User size={22} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[#1f2329]">{offer?.merchant?.name || "Merchant"}</p>
                      <p className="mt-1 text-[12px] text-[#66707b]">
                        <Star size={11} className="mr-1 inline text-[#f4ba34]" /> Verified Store
                      </p>
                      <p className="mt-1 text-[12px] leading-5 text-[#66707b]">
                        <MapPin size={11} className="mr-1 inline" />
                        {offer?.merchant?.address || "Address unavailable"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-[10px] border border-[#e4e7eb] bg-[#f9fafb] px-3 py-2 text-[12px] text-[#4b5563]">
                    <p className="font-semibold">Store Category</p>
                    <p className="mt-1">{offer?.merchant?.category || "General"}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[12px] text-[#66707b]">
                    <span>Offer ID</span>
                    <span className="font-semibold text-[#1f2329]">{offer?.offerId}</span>
                  </div>

                  <button
                    onClick={() => router.push("/nearby-deals")}
                    className="mt-4 h-11 w-full rounded-[8px] border border-[#e8b038] bg-[#f7ebcf] text-[14px] font-semibold text-[#8f6515]"
                  >
                    <Ticket size={14} className="mr-1 inline" />
                    Back to Nearby Deals
                  </button>
                </div>
              </aside>
            </section>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
