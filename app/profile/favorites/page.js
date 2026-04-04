"use client";

import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import GolocalProfileSidebar from "../../components/GolocalProfileSidebar";
import { ChevronDown, Heart, MapPin, Star, SlidersHorizontal } from "lucide-react";

const favCards = [
  { title: "50% Off Organic", type: "Bakery", rating: "4.9", reviews: 128, distance: "0.8 miles away", image: "/images/deal2.avif", tag: "Limited Time Deal" },
  { title: "Green Leaf Garden", type: "Home & Garden", rating: "4.7", reviews: 342, distance: "1.2 miles away", image: "/images/place2.avif", tag: "Store" },
  { title: "Free Coffee with any", type: "Cafe", rating: "4.8", reviews: 89, distance: "0.4 miles away", image: "/images/banner3.avif", tag: "Trending" },
  { title: "Urban Attic Vintage", type: "Fashion", rating: "4.6", reviews: 25, distance: "2.5 miles away", image: "/images/place2.avif", tag: "Store" },
  { title: "Weekend Brunch", type: "Dining", rating: "4.9", reviews: 86, distance: "3.1 miles away", image: "/images/deal2.avif", tag: "Trending" },
  { title: "Soul Cycle Downtown", type: "Fitness", rating: "4.6", reviews: 110, distance: "1.8 miles away", image: "/images/banner3.avif", tag: "Store" },
];

export default function GolocalFavoritesPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f4f4f4]">
        <div className="w-full px-0 py-0">
          <div className="grid lg:grid-cols-[250px_1fr] min-h-[760px]">
            <GolocalProfileSidebar active="favorites" />

            <main className="p-5 lg:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-[32px] leading-none font-semibold text-[#2a2a2a]">Your Favorites</h1>
                    <p className="text-[#8a8a8a] mt-2 text-sm">Manage and rediscover the local shops and exclusive deals you've saved.</p>
                  </div>
                  <div className="hidden md:flex items-center gap-1 bg-[#f8f8f8] border border-[#e5e5e5] rounded-xl p-1">
                    <button className="px-6 py-2 rounded-lg bg-[#157a4f] text-white text-sm font-semibold">All Items</button>
                    <button className="px-6 py-2 rounded-lg text-[#707070] text-sm font-semibold">Deals</button>
                    <button className="px-6 py-2 rounded-lg text-[#707070] text-sm font-semibold">Stores</button>
                  </div>
                </div>

                <div className="mt-5 border border-[#e8e8e8] rounded-xl px-4 py-3 bg-white flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button className="h-10 px-4 rounded-xl border border-[#e5e5e5] text-sm text-[#5d5d5d] inline-flex items-center gap-2">
                      <SlidersHorizontal size={14} className="text-[#157a4f]" /> Category: All <ChevronDown size={14} />
                    </button>
                    <button className="h-10 px-4 rounded-xl border border-[#e5e5e5] text-sm text-[#5d5d5d] inline-flex items-center gap-2">
                      Distance: Any <ChevronDown size={14} />
                    </button>
                  </div>
                  <div className="text-sm text-[#8a8a8a] inline-flex items-center gap-4">
                    <span>Showing 6 results</span>
                    <span className="text-[#3f3f3f] font-semibold">Sort: Recently Saved</span>
                  </div>
                </div>

                <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {favCards.map((item, idx) => (
                    <div key={`${item.title}-${idx}`} className="rounded-xl border border-[#e8e8e8] bg-white overflow-hidden shadow-sm">
                      <div className="relative h-28">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                        <span className="absolute top-2 left-2 text-[10px] rounded-full bg-white/95 px-2 py-0.5 text-[#4a4a4a]">{item.tag}</span>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between text-[10px] text-[#9a9a9a]">
                          <span>{item.type}</span>
                          <span className="inline-flex items-center gap-1 text-[#7a7a7a]"><Star size={11} className="text-[#f4b33c]" /> {item.rating} ({item.reviews})</span>
                        </div>
                        <h3 className="mt-1 text-[18px] font-semibold text-[#262626] leading-tight">{item.title}</h3>
                        <p className="mt-1 text-xs text-[#8a8a8a] inline-flex items-center gap-1"><MapPin size={11} /> {item.distance}</p>

                        <div className="mt-3 flex items-center gap-2">
                          <button className="flex-1 h-9 rounded-lg bg-[#157a4f] text-white text-sm font-semibold">View Details</button>
                          <button className="w-9 h-9 rounded-lg border border-[#cde6da] text-[#157a4f] flex items-center justify-center">
                            <Heart size={14} fill="currentColor" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-[#ececec] pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-[24px] font-semibold text-[#2b2b2b]">Trending Near You</h2>
                      <p className="text-[15px] text-[#8a8a8a] mt-1">Based on your recent saves and searches.</p>
                    </div>
                    <button className="text-[#157a4f] text-sm font-semibold">View All Recommended →</button>
                  </div>

                  <div className="mt-4 grid md:grid-cols-3 gap-3">
                    {["/images/deal2.avif", "/images/place2.avif", "/images/banner3.avif"].map((img, i) => (
                      <div key={img + i} className="relative rounded-xl overflow-hidden h-48">
                        <Image src={img} alt="Recommended" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute left-3 bottom-3 text-white">
                          <p className="text-[12px] font-semibold tracking-wide">RECOMMENDED</p>
                          <p className="text-base font-semibold leading-none">Local Artisans Market</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
