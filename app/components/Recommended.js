"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRecommendedDeals } from "../lib/api";

const fallbackDeals = [
  { title: "50% Off Pizza", img: "deal1.jpg", discount: "Flat 50% OFF" },
  { title: "Luxury Spa Package", img: "deal2.jpg", discount: "Save $30 Today" },
  { title: "Gym Membership", img: "deal3.jpg", discount: "Only $25/month" },
  { title: "Weekend Getaway", img: "deal4.jpg", discount: "Up to 40% OFF" },
];

export default function Recommended() {
  const router = useRouter();
  const [deals, setDeals] = useState(fallbackDeals);

  useEffect(() => {
    async function fetchRecommended() {
      try {
        const response = await getRecommendedDeals(4);
        if (response.success && response.data?.length > 0) {
          setDeals(
            response.data.map((ad) => ({
              id: ad.adId || ad._id,
              title: ad.title,
              img: ad.images?.[0] || "deal1.jpg",
              discount: ad.negotiable ? "Negotiable" : `₹${ad.price}`,
              description: ad.description,
              isFromApi: true,
            }))
          );
        }
      } catch {
        // Fallback to mock data
      }
    }
    fetchRecommended();
  }, []);

  return (
    <section className="py-16 theme-section">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-semibold theme-heading">
            Recommended Deals
          </h2>

          <button className="theme-button-accent px-4 py-2 rounded-full text-sm transition">
            View More →
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {deals.map((deal, i) => (
            <div
              key={deal.id || i}
              onClick={() => deal.id && router.push(`/product/${deal.id}`)}
              className="group rounded-xl shadow-md p-4 transition-all duration-300 theme-card hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={deal.isFromApi ? deal.img : `/images/${deal.img}`}
                  width={300}
                  height={200}
                  alt={deal.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized={deal.isFromApi}
                />
              </div>

              {/* Content */}
              <h3 className="mt-4 font-semibold theme-heading">
                {deal.title}
              </h3>

              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                {deal.description || "Discover amazing deals near you."}
              </p>

              <p
                className="text-sm font-medium mt-2"
                style={{ color: "var(--color-accent)" }}
              >
                {deal.discount}
              </p>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  if (deal.id) router.push(`/product/${deal.id}`);
                }}
                className="mt-4 px-4 py-2 rounded-full w-full theme-button-accent transition"
              >
                View Deal
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
