"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllAds, getIWantPreference, getRecommendedDeals } from "../lib/api";

const fallbackDeals = [
  { title: "50% Off Pizza", img: "deal1.jpg", discount: "Flat 50% OFF" },
  { title: "Luxury Spa Package", img: "deal2.jpg", discount: "Save $30 Today" },
  { title: "Gym Membership", img: "deal3.jpg", discount: "Only $25/month" },
  { title: "Weekend Getaway", img: "deal4.jpg", discount: "Up to 40% OFF" },
];

function getDisplayPrice(ad) {
  const candidates = [
    ad?.price,
    ad?.categorySpecificData?.price,
    ad?.categorySpecificData?.rent,
    ad?.categorySpecificData?.askingPrice,
    ad?.categorySpecificData?.rentAmount,
    ad?.categorySpecificData?.fees,
    ad?.categorySpecificData?.pricePerPerson,
    ad?.categorySpecificData?.consultationFee,
    ad?.categorySpecificData?.charges,
  ];

  for (const value of candidates) {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
    if (typeof value === 'string') {
      const normalized = value.replace(/[^0-9.]/g, '');
      const parsed = Number(normalized);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
  }

  return 0;
}

function tokenize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9&\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function normalizeCategory(value) {
  const normalized = String(value || "")
    .toLowerCase()
    .replace("electronics & home appliances", "electronics & home appliances")
    .replace("electronics & home appliances", "electronics & home appliances")
    .replace(/\s*-\s*/g, "|")
    .trim();

  if (normalized === "electronics & home appliances") {
    return "electronics & home appliances";
  }
  return normalized;
}

function getIntentParts(intentCategory) {
  const normalized = normalizeCategory(intentCategory);
  const [main = "", sub = ""] = normalized.split("|");
  return { main, sub };
}

function normalizeBackendCategory(mainCategory) {
  if (mainCategory === "electronics & home appliances") {
    return "Electronics & Home appliances";
  }
  return mainCategory
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("&", "&");
}

function adMatchesIntentSub(ad, intentSub) {
  if (!intentSub) return true;

  const normalizedIntentSub = intentSub.toLowerCase();
  const subCandidates = [
    ad?.subCategory,
    ad?.categorySpecificData?.type,
    ad?.categorySpecificData?.listingType,
    ad?.categorySpecificData?.tributeType,
  ]
    .filter(Boolean)
    .map((item) => String(item).toLowerCase());

  const synonymMap = {
    sell: ["sell", "buy"],
    buy: ["sell", "buy"],
    rent: ["rent"],
    greetings: ["greetings"],
    tributes: ["tributes"],
    promotion: ["promotion"],
  };

  const acceptable = synonymMap[normalizedIntentSub] || [normalizedIntentSub];
  return subCandidates.some((candidate) => acceptable.includes(candidate));
}

function scoreAdByIntent(ad, intent) {
  if (!intent) return 0;

  const adCategory = normalizeCategory(ad?.category);
  const intentCategory = normalizeCategory(intent?.category);

  const intentMainCategory = intentCategory.split("|")[0];
  const adMainCategory = adCategory.split("|")[0];

  let score = 0;

  if (intentCategory && adCategory && adCategory === intentCategory) score += 5;
  else if (intentMainCategory && adMainCategory && adMainCategory === intentMainCategory) score += 3;

  const adText = `${ad?.title || ""} ${ad?.description || ""}`.toLowerCase();
  const words = [...new Set([...(tokenize(intent?.title)), ...(tokenize(intent?.description))])];
  if (words.length) {
    for (const word of words) {
      if (word.length >= 3 && adText.includes(word)) score += 1;
    }
  }

  return score;
}

export default function Recommended() {
  const router = useRouter();
  const [deals, setDeals] = useState(fallbackDeals);

  useEffect(() => {
    async function fetchRecommended() {
      try {
        let intent = null;
        try {
          const prefRes = await getIWantPreference();
          if (prefRes?.success && prefRes?.data) {
            intent = prefRes.data;
          }
        } catch {
          intent = null;
        }

        let selectedAds = [];

        // If I Want preference exists, force recommendations from that preference first.
        if (intent?.category) {
          const { main, sub } = getIntentParts(intent.category);
          const backendCategory = normalizeBackendCategory(main);

          const categoryResponse = await getAllAds({
            page: 1,
            limit: 80,
            category: backendCategory,
            sortBy: "createdAt",
            sortOrder: "desc",
          });

          if (categoryResponse?.success && Array.isArray(categoryResponse?.data)) {
            const categoryAds = [...categoryResponse.data];

            const strictSubMatches = categoryAds.filter((ad) => adMatchesIntentSub(ad, sub));
            let prioritized = strictSubMatches;

            // If strict subcategory has fewer results, use same category ads (still preference-aligned).
            if (prioritized.length < 4) {
              prioritized = categoryAds;
            }

            prioritized.sort((a, b) => scoreAdByIntent(b, intent) - scoreAdByIntent(a, intent));
            selectedAds = prioritized.slice(0, 4);
          }
        }

        // Fallback only when no I Want-driven list found.
        if (selectedAds.length === 0) {
          const response = await getRecommendedDeals(20);
          if (response.success && response.data?.length > 0) {
            selectedAds = [...response.data].slice(0, 4);
          }
        }

        if (selectedAds.length > 0) {
          setDeals(
            selectedAds.map((ad) => ({
              id: ad.adId || ad._id,
              title: ad.title,
              img: ad.images?.[0] || "deal1.jpg",
              discount: ad.negotiable ? "Negotiable" : `₹${getDisplayPrice(ad)}`,
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

          <button 
            className="theme-button-accent px-4 py-2 rounded-full text-sm transition"
            suppressHydrationWarning={true}
          >
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
                suppressHydrationWarning={true}
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
