"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, Grid2x2, List, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";
import { getNearbyOffers } from "../lib/api";

const OFFER_TYPES = ["Flat Discounts", "BOGO Deals", "Combo Offers", "Cashback"];

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function formatDistance(distanceKm) {
  if (typeof distanceKm !== "number" || Number.isNaN(distanceKm)) return "N/A";
  return `${distanceKm.toFixed(1)} km`;
}

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

function getOfferBadgeLabel(row) {
  const discountPercent = toNumber(row?.discountPercent, 0);
  if (discountPercent > 0) {
    return `${discountPercent}% OFF`;
  }

  const category = String(row?.category || "").trim();
  return category ? category.toUpperCase() : "SPECIAL OFFER";
}

function matchOfferType(row, typeLabel) {
  const title = String(row?.title || "").toLowerCase();
  const category = String(row?.category || "").toLowerCase();
  const combined = `${title} ${category}`;

  if (typeLabel === "Flat Discounts") {
    return row?.discountPercent > 0 || combined.includes("discount") || combined.includes("flat");
  }

  if (typeLabel === "BOGO Deals") {
    return (
      combined.includes("bogo") ||
      combined.includes("buy 1 get 1") ||
      combined.includes("buy one get one")
    );
  }

  if (typeLabel === "Combo Offers") {
    return combined.includes("combo");
  }

  if (typeLabel === "Cashback") {
    return combined.includes("cashback") || combined.includes("cash back");
  }

  return true;
}

function NearbyDealsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeView, setActiveView] = useState("grid");
  const [distanceRadius, setDistanceRadius] = useState(5);
  const [priceRange, setPriceRange] = useState(5000);
  const [topDiscountOnly, setTopDiscountOnly] = useState(false);
  const [activeNowOnly, setActiveNowOnly] = useState(false);
  const [selectedOfferTypes, setSelectedOfferTypes] = useState({
    "Flat Discounts": false,
    "BOGO Deals": false,
    "Combo Offers": false,
    Cashback: false,
  });
  const [rawOffers, setRawOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useMemo(() => searchParams.get("location") || "", [searchParams]);
  const query = useMemo(() => searchParams.get("q") || "", [searchParams]);

  useEffect(() => {
    const loadNearbyOffers = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getNearbyOffers({
          lat: undefined,
          lng: undefined,
          radiusKm: distanceRadius,
          location,
          q: query,
          maxPrice: priceRange < 5000 ? priceRange : undefined,
          page: 1,
          limit: 100,
        });

        setRawOffers(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        setError(err?.message || "Failed to load nearby offers.");
        setRawOffers([]);
      } finally {
        setLoading(false);
      }
    };

    loadNearbyOffers();
  }, [distanceRadius, priceRange, location, query]);

  const selectedTypeLabels = useMemo(
    () => Object.keys(selectedOfferTypes).filter((key) => selectedOfferTypes[key]),
    [selectedOfferTypes],
  );

  const filteredDeals = useMemo(() => {
    const rows = rawOffers.filter((row) => {
      if (activeNowOnly && !row?.isActiveNow) {
        return false;
      }

      if (topDiscountOnly && toNumber(row?.discountPercent, 0) < 30) {
        return false;
      }

      if (selectedTypeLabels.length > 0) {
        const typeMatched = selectedTypeLabels.some((typeLabel) => matchOfferType(row, typeLabel));
        if (!typeMatched) {
          return false;
        }
      }

      return true;
    });

    if (!location) {
      return rows;
    }

    const locationNeedle = String(location).trim().toLowerCase();
    return rows.sort((a, b) => {
      const addressA = String(a?.merchant?.address || '').toLowerCase();
      const addressB = String(b?.merchant?.address || '').toLowerCase();
      const scoreA = addressA.includes(locationNeedle) ? 1 : 0;
      const scoreB = addressB.includes(locationNeedle) ? 1 : 0;
      return scoreB - scoreA;
    });
  }, [rawOffers, activeNowOnly, topDiscountOnly, selectedTypeLabels, location]);

  const summary = useMemo(() => {
    const total = filteredDeals.length;
    const active = filteredDeals.filter((row) => row?.isActiveNow).length;
    const avgPrice =
      total > 0
        ? Math.round(
            filteredDeals.reduce((sum, row) => sum + toNumber(row?.displayPrice, 0), 0) / total,
          )
        : 0;

    return { total, active, avgPrice };
  }, [filteredDeals]);

  const clearAllFilters = () => {
    setDistanceRadius(5);
    setPriceRange(5000);
    setTopDiscountOnly(false);
    setActiveNowOnly(false);
    setSelectedOfferTypes({
      "Flat Discounts": false,
      "BOGO Deals": false,
      "Combo Offers": false,
      Cashback: false,
    });
  };

  const openDealDetails = (deal) => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          `golo_nearby_offer_${deal.offerId}`,
          JSON.stringify(deal),
        );
      } catch {
      }
    }

    router.push(`/nearby-deals/deal?offerId=${deal.offerId}`);
  };

  return (
    <main className="min-h-screen bg-[#F3F3F3]">
      <Navbar />
      <CategoryBar variant="golocal" />

      <section className="mx-auto max-w-[1400px] px-6 py-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:sticky lg:top-28">
            <div className="mb-5 flex items-center justify-between">
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                <SlidersHorizontal size={14} /> Filters
              </button>
              <button className="text-xs font-semibold text-[#157A4F]" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-[11px] font-bold tracking-wide text-gray-400">DISTANCE RADIUS</p>
              <input
                type="range"
                min="1"
                max="50"
                value={distanceRadius}
                onChange={(e) => setDistanceRadius(Number(e.target.value))}
                className="w-full accent-[#157A4F]"
              />
              <div className="mt-2 flex justify-between text-[10px] text-gray-500">
                <span>1 km</span><span>25 km</span><span>50 km</span>
              </div>
              <p className="mt-2 text-[11px] font-semibold text-[#157A4F]">Selected: {distanceRadius} km</p>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-[11px] font-bold tracking-wide text-gray-400">OFFER TYPE</p>
              <div className="space-y-2 text-xs text-gray-700">
                {OFFER_TYPES.map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-gray-300"
                      checked={selectedOfferTypes[item]}
                      onChange={(e) =>
                        setSelectedOfferTypes((prev) => ({
                          ...prev,
                          [item]: e.target.checked,
                        }))
                      }
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-[11px] font-bold tracking-wide text-gray-400">PRICE RANGE</p>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#157A4F]"
              />
              <div className="mt-2 flex justify-between text-[10px] text-gray-500">
                <span>₹100</span><span>₹1.5k</span><span>₹5k</span>
              </div>
              <p className="mt-2 text-[11px] font-semibold text-[#157A4F]">
                {priceRange < 5000
                  ? `Max: ₹${priceRange.toLocaleString("en-IN")}`
                  : "Max: Any price"}
              </p>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-bold tracking-wide text-gray-400">OTHER TOGGLES</p>
              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Top Discount (30%+)</span>
                  <button
                    onClick={() => setTopDiscountOnly((v) => !v)}
                    className={`h-4 w-8 rounded-full p-[2px] ${topDiscountOnly ? "bg-[#1B9B5A]" : "bg-gray-300"}`}
                  >
                    <span className={`block h-3 w-3 rounded-full bg-white transition ${topDiscountOnly ? "translate-x-4" : ""}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Today</span>
                  <button
                    onClick={() => setActiveNowOnly((v) => !v)}
                    className={`h-4 w-8 rounded-full p-[2px] ${activeNowOnly ? "bg-[#1B9B5A]" : "bg-gray-300"}`}
                  >
                    <span className={`block h-3 w-3 rounded-full bg-white transition ${activeNowOnly ? "translate-x-4" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[34px] font-extrabold text-gray-900">Deals near you</h1>
                <p className="mt-1 text-xs text-gray-500">
                  Showing {summary.total} offers
                  {query ? ` for \"${query}\"` : ""}
                  {location ? ` in ${location}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  className={`rounded-md border border-gray-200 bg-white p-2 ${activeView === "grid" ? "text-gray-700" : "text-gray-400"}`}
                  onClick={() => setActiveView("grid")}
                >
                  <Grid2x2 size={14} />
                </button>
                <button
                  className={`rounded-md border border-gray-200 bg-white p-2 ${activeView === "list" ? "text-gray-700" : "text-gray-400"}`}
                  onClick={() => setActiveView("list")}
                >
                  <List size={14} />
                </button>
                <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700">
                  Sort: Nearest
                  <ChevronDown size={12} />
                </button>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <p className="text-[11px] text-gray-500">Total Deals</p>
                <p className="text-[20px] font-semibold text-gray-900">{summary.total}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <p className="text-[11px] text-gray-500">Active Now</p>
                <p className="text-[20px] font-semibold text-gray-900">{summary.active}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <p className="text-[11px] text-gray-500">Average Offer Price</p>
                <p className="text-[20px] font-semibold text-gray-900">₹{summary.avgPrice.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {error ? <p className="mb-3 text-[12px] text-red-600">{error}</p> : null}

            <div className={activeView === "list" ? "space-y-4" : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"}>
              {loading ? (
                <div className="col-span-full rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                  Loading nearby offers...
                </div>
              ) : filteredDeals.length === 0 ? (
                <div className="col-span-full rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                  No offers found for the selected filters.
                </div>
              ) : (
                filteredDeals.map((deal) => (
                  <article
                    key={deal.offerId}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#157A4F] hover:shadow-lg"
                  >
                    <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                      <img
                        src={deal.imageUrl || "/images/deal2.avif"}
                        alt={deal.title}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                        {formatDistance(deal.distanceKm)}
                      </span>
                      <span className="absolute left-2 top-8 rounded-md bg-[#28A745] px-2 py-0.5 text-[9px] font-bold text-white">
                        {getOfferBadgeLabel(deal)}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="line-clamp-1 text-sm font-bold text-gray-900">{deal.title}</h3>
                      <p className="mt-1 text-[11px] text-gray-500">{deal.merchant?.name || "Merchant"}</p>
                      <p className="mt-1 text-[10px] font-semibold text-gray-500">{deal.category || "Special"}</p>
                      <p className="mt-2 text-[11px] text-gray-500 line-clamp-1">{deal.merchant?.address || "Location unavailable"}</p>
                      <p className="mt-1 text-[10px] text-gray-400">
                        Valid: {formatDate(deal.startsAt)} - {formatDate(deal.endsAt)}
                      </p>
                      <p className="mt-2 text-xl font-extrabold text-gray-900">
                        ₹{toNumber(deal.displayPrice, 0).toLocaleString("en-IN")}
                      </p>
                      <button
                        onClick={() => openDealDetails(deal)}
                        className="mt-3 w-full rounded-lg border border-gray-200 bg-[#F7F7F7] py-2 text-xs font-bold text-gray-800 transition-colors duration-200 hover:border-[#157A4F] hover:bg-[#157A4F] hover:text-white"
                      >
                        View Deal
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function NearbyDealsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect merchants away from user pages
  useEffect(() => {
    if (!loading && user && user.accountType === "merchant") {
      router.replace("/merchant/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return <main className="min-h-screen bg-[#F3F3F3]" />;
  }

  if (user && user.accountType === "merchant") {
    return null;
  }

  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F3F3F3]" />}>
      <NearbyDealsPageContent />
    </Suspense>
  );
}
