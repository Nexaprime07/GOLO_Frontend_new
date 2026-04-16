"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, Grid2x2, List, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";

const dealCards = [
  { id: "69df41f49c0ab3754e756506", title: "50% Off Signature Thali", place: "The Royal Maratha", rating: 4.8, reviews: 120, price: 249, oldPrice: 499, tag: "FLAT 50% OFF", km: "1.2 km", img: "/images/deal2.avif", validTill: "Valid till 30 Apr", category: "Food & Dining" },
  { id: "69df41f49c0ab3754e756507", title: "Buy 1 Get 1 Free", place: "Sky Lounge", rating: 4.5, reviews: 120, price: 199, oldPrice: 398, tag: "BOGO", km: "2.5 km", img: "/images/banner3.avif", validTill: "Valid till 20 Apr", category: "Nightlife" },
  { id: "69df41f49c0ab3754e756508", title: "Organic Facial Spa", place: "Glow & Shine Wellness", rating: 4.9, reviews: 120, price: 899, oldPrice: 1500, tag: "40% OFF", km: "0.8 km", img: "/images/place2.avif", validTill: "Valid till 26 Apr", category: "Beauty & Wellness" },
  { id: "69df41f49c0ab3754e756506", title: "50% Off Signature Thali", place: "The Royal Maratha", rating: 4.8, reviews: 120, price: 249, oldPrice: 499, tag: "FLAT 50% OFF", km: "1.2 km", img: "/images/deal2.avif", validTill: "Valid till 30 Apr", category: "Food & Dining" },
  { id: "69df41f49c0ab3754e756509", title: "Weekend Breakfast", place: "Hotel Sayaji", rating: 4.7, reviews: 120, price: 599, oldPrice: 799, tag: "SAVE ₹200", km: "3.1 km", img: "/images/deal2.avif", validTill: "Valid till 24 Apr", category: "Hotels" },
  { id: "69df41f49c0ab3754e75650a", title: "Car Deep Cleaning", place: "Pro Wash Kolhapur", rating: 4.4, reviews: 120, price: 1200, oldPrice: 2000, tag: "LIMITED TIME", km: "4.2 km", img: "/images/banner3.avif", validTill: "Valid till 18 Apr", category: "Automotive" },
  { id: "69df41f49c0ab3754e75650b", title: "Classic Pizza Combo", place: "Little Italy", rating: 4.6, reviews: 120, price: 349, oldPrice: 550, tag: "COMBO DEAL", km: "1.9 km", img: "/images/deal2.avif", validTill: "Valid till 21 Apr", category: "Food & Dining" },
  { id: "69df41f49c0ab3754e756509", title: "Weekend Breakfast", place: "Hotel Sayaji", rating: 4.7, reviews: 120, price: 599, oldPrice: 799, tag: "SAVE ₹200", km: "3.1 km", img: "/images/deal2.avif", validTill: "Valid till 24 Apr", category: "Hotels" },
];

const repeatedDeals = [...dealCards, ...dealCards];

function NearbyDealsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [topRated, setTopRated] = useState(true);
  const [openNow, setOpenNow] = useState(false);
  const [distanceRadius, setDistanceRadius] = useState(5);
  const [priceRange, setPriceRange] = useState(1500);

  const location = useMemo(() => searchParams.get("location") || "Kolhapur", [searchParams]);
  const query = useMemo(() => searchParams.get("q") || "Restaurants", [searchParams]);

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
              <button className="text-xs font-semibold text-[#157A4F]">Clear All</button>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-[11px] font-bold tracking-wide text-gray-400">DISTANCE RADIUS</p>
              <input
                type="range"
                min="0"
                max="50"
                value={distanceRadius}
                onChange={(e) => setDistanceRadius(Number(e.target.value))}
                className="w-full accent-[#8A7BFF]"
              />
              <div className="mt-2 flex justify-between text-[10px] text-gray-500">
                <span>0 km</span><span>5 km</span><span>50 km</span>
              </div>
              <p className="mt-2 text-[11px] font-semibold text-[#157A4F]">Selected: {distanceRadius} km</p>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-[11px] font-bold tracking-wide text-gray-400">OFFER TYPE</p>
              <div className="space-y-2 text-xs text-gray-700">
                {['Flat Discounts', 'BOGO Deals', 'Combo Offers', 'Cashback'].map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300" /> {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-[11px] font-bold tracking-wide text-gray-400">PRICE RANGE</p>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#8A7BFF]"
              />
              <div className="mt-2 flex justify-between text-[10px] text-gray-500">
                <span>₹0</span><span>₹1.5k</span><span>₹5k+</span>
              </div>
              <p className="mt-2 text-[11px] font-semibold text-[#157A4F]">Selected: ₹{priceRange.toLocaleString("en-IN")}</p>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-bold tracking-wide text-gray-400">OTHER TOGGLES</p>
              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Top Rated (4.5+)</span>
                  <button onClick={() => setTopRated((v) => !v)} className={`h-4 w-8 rounded-full p-[2px] ${topRated ? 'bg-[#1B9B5A]' : 'bg-gray-300'}`}>
                    <span className={`block h-3 w-3 rounded-full bg-white transition ${topRated ? 'translate-x-4' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Open Now</span>
                  <button onClick={() => setOpenNow((v) => !v)} className={`h-4 w-8 rounded-full p-[2px] ${openNow ? 'bg-[#1B9B5A]' : 'bg-gray-300'}`}>
                    <span className={`block h-3 w-3 rounded-full bg-white transition ${openNow ? 'translate-x-4' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[34px] font-extrabold text-gray-900">Deals near you</h1>
                <p className="mt-1 text-xs text-gray-500">Showing 152 results for "{query}" in {location}</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button className="rounded-md border border-gray-200 bg-white p-2 text-gray-500"><Grid2x2 size={14} /></button>
                <button className="rounded-md border border-gray-200 bg-white p-2 text-gray-400"><List size={14} /></button>
                <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700">Sort by: Recommended <ChevronDown size={12} /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {repeatedDeals.map((deal, idx) => (
                <article
                  key={`${deal.title}-${idx}`}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#157A4F] hover:shadow-lg"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                    <img src={deal.img} alt={deal.title} className="h-full w-full object-cover" />
                    <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-gray-700">✔ {deal.km}</span>
                    <span className="absolute left-2 top-8 rounded-md bg-[#28A745] px-2 py-0.5 text-[9px] font-bold text-white">{deal.tag}</span>
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-1 text-sm font-bold text-gray-900">{deal.title}</h3>
                    <p className="mt-1 text-[11px] text-gray-500">{deal.place}</p>
                    <p className="mt-1 text-[10px] font-semibold text-gray-500">{deal.category}</p>
                    <p className="mt-2 text-[11px] text-gray-400">⭐ {deal.rating} | {deal.reviews}+ reviews</p>
                    <p className="mt-1 text-[10px] text-gray-400">{deal.validTill}</p>
                    <p className="mt-2 text-xl font-extrabold text-gray-900">₹{deal.price} <span className="ml-1 text-xs font-semibold text-gray-400 line-through">₹{deal.oldPrice}</span></p>
                    <button
                      onClick={() => router.push(`/nearby-deals/deal?offerId=${deal.id}`)}
                      className="mt-3 w-full rounded-lg border border-gray-200 bg-[#F7F7F7] py-2 text-xs font-bold text-gray-800 transition-colors duration-200 hover:border-[#157A4F] hover:bg-[#157A4F] hover:text-white"
                    >
                      View Deal
                    </button>
                  </div>
                </article>
              ))}
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
