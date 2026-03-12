"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CategoryBar from "../../components/CategoryBar";
import { getAdsByCategory } from "../../lib/api";

const CATEGORY_ICONS = {
    "Education": "🎓",
    "Vehicle": "🚗",
    "Property": "🏠",
    "Employment": "💼",
    "Mobiles": "📱",
    "Electronics": "🖥️",
    "Electronics & Home appliances": "🖥️",
    "Matrimonial": "💍",
    "Business": "🏪",
    "Astrology": "🔮",
    "Lost & Found": "🔍",
    "Service": "🔧",
    "Personal": "👤",
    "Pets": "🐾",
    "Travel": "✈️",
    "Furniture": "🛋️",
    "Public Notice": "📢",
    "Other": "📦",
};

const SORT_OPTIONS = [
    { label: "Newest First", value: "createdAt_desc" },
    { label: "Oldest First", value: "createdAt_asc" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
];

const normalizeSubFilter = (value) => {
    if (!value) return "";
    const lowered = String(value).trim().toLowerCase();
    if (lowered === "buy") return "sell";
    return lowered;
};

const getAdListingType = (ad) => {
    const candidates = [
        ad?.categorySpecificData?.listingType,
        ad?.categorySpecificData?.type,
        ad?.propertyData?.listingType,
        ad?.vehicleData?.listingType,
        ad?.vehicleData?.type,
        ad?.listingType,
        ad?.type,
    ];

    const found = candidates.find((item) => typeof item === "string" && item.trim().length > 0);
    return found ? found.trim().toLowerCase() : "";
};

// Same bento pattern as RecentListings:
// Group A (ads 0–5): big(6col×2row), small, small, text, small, text
// Group B (ads 6–11): small, text, big(6col×2row), text, small, text
const BENTO_PATTERNS = [
    [
        { type: "big", col: "col-span-12 lg:col-span-6", row: "row-span-2" },
        { type: "small", col: "col-span-12 sm:col-span-6 lg:col-span-3", row: "row-span-1" },
        { type: "small", col: "col-span-12 sm:col-span-6 lg:col-span-3", row: "row-span-1" },
        { type: "text", col: "col-span-12 sm:col-span-6 lg:col-span-3", row: "row-span-1" },
        { type: "small", col: "col-span-12 sm:col-span-6 lg:col-span-3", row: "row-span-1" },
        { type: "text", col: "col-span-12 sm:col-span-6 lg:col-span-3", row: "row-span-1" },
    ],
    [
        { type: "small", col: "col-span-12 sm:col-span-6 lg:col-span-3", row: "row-span-1" },
        { type: "text", col: "col-span-12 sm:col-span-6 lg:col-span-3", row: "row-span-1" },
        { type: "big", col: "col-span-12 lg:col-span-6", row: "row-span-2" },
        { type: "text", col: "col-span-12 sm:col-span-6 lg:col-span-3", row: "row-span-1" },
        { type: "small", col: "col-span-12 sm:col-span-6 lg:col-span-3", row: "row-span-1" },
        { type: "text", col: "col-span-12 sm:col-span-6 lg:col-span-3", row: "row-span-1" },
    ],
];

function assignBentoLayout(adsList) {
    return adsList.map((ad, i) => {
        const patternIndex = Math.floor(i / 6) % 2;
        const positionInGroup = i % 6;
        const layout = BENTO_PATTERNS[patternIndex][positionInGroup];
        return { ...ad, ...layout };
    });
}

function getSafeImageSrc(value) {
    if (!value || typeof value !== "string") return "/images/placeholder.webp";
    const src = value.trim();
    if (!src) return "/images/placeholder.webp";
    if (src.startsWith("/")) return src;
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return "/images/placeholder.webp";
}

export default function CategoryPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryName = decodeURIComponent(params.categoryName || "");
    const subFromUrl = searchParams.get("sub") || "";

    const [ads, setAds] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const LIMIT = 12;

    useEffect(() => {
        setPage(1);
        setAds([]);
    }, [categoryName]);

    const fetchAds = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const shouldApplySubFilter = Boolean(subFromUrl);
            const response = await getAdsByCategory(categoryName, {
                page: shouldApplySubFilter ? 1 : page,
                limit: shouldApplySubFilter ? 300 : LIMIT,
                sortBy,
                sortOrder,
            });
            if (response.success) {
                setAds(response.data?.ads || response.data || []);
                setTotal(response.data?.total || response.total || 0);
            } else {
                setError("Could not load ads.");
            }
        } catch {
            setError("Failed to fetch ads for this category.");
            setAds([]);
        } finally {
            setLoading(false);
        }
    }, [categoryName, page, sortBy, sortOrder, subFromUrl]);

    useEffect(() => {
        if (!categoryName) return;
        fetchAds();
    }, [categoryName, fetchAds]);

    const totalPages = subFromUrl ? 1 : Math.max(1, Math.ceil(total / LIMIT));
    const icon = CATEGORY_ICONS[categoryName] || "📂";

    const handleSort = (val) => {
        const [by, order] = val.split("_");
        setSortBy(by);
        setSortOrder(order);
        setPage(1);
    };

    const subFilter = normalizeSubFilter(subFromUrl);
    const filteredAds = subFilter
        ? ads.filter((ad) => getAdListingType(ad) === subFilter)
        : ads;

    const layoutAds = assignBentoLayout(filteredAds);

    return (
        <>
            <Navbar />

            {/* Your existing CategoryBar — already has working "See All" modal & dropdowns */}
            <CategoryBar />

            <section className="w-full pt-4 pb-10">

                {/* Compact sort + count bar */}
                <div className="w-full px-6 lg:px-8 mb-6 flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-sm text-gray-400 font-medium">
                        {loading ? "Loading…" : filteredAds.length > 0
                            ? `${filteredAds.length} ad${filteredAds.length !== 1 ? "s" : ""}${subFromUrl ? ` · ${subFromUrl}` : ""}`
                            : `No ads found`}
                    </p>
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-400 font-semibold">Sort:</label>
                        <select
                            value={`${sortBy}_${sortOrder}`}
                            onChange={e => handleSort(e.target.value)}
                            className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white cursor-pointer"
                        >
                            {SORT_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="w-full px-6 lg:px-8">
                        <div className="grid grid-cols-12 auto-rows-[220px] gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`rounded-3xl bg-gray-100 animate-pulse ${i === 0
                                        ? "col-span-12 lg:col-span-6 row-span-2"
                                        : "col-span-12 sm:col-span-6 lg:col-span-3 row-span-1"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="text-center py-16 px-5 text-red-400">
                        <div className="text-5xl mb-3">⚠️</div>
                        <p>{error}</p>
                        <button
                            onClick={fetchAds}
                            className="mt-4 px-7 py-2.5 rounded-xl font-bold text-white border-none cursor-pointer bg-green-700"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredAds.length === 0 && (
                    <div className="text-center py-20 px-5">
                        <div className="text-6xl mb-4">{icon}</div>
                        <h2 className="text-gray-700 font-bold text-xl">No matching ads in {categoryName} yet</h2>
                        <p className="text-gray-400 mb-6">Be the first to post an ad in this category!</p>
                        <button
                            onClick={() => router.push("/post-ad")}
                            className="px-8 py-3 rounded-2xl font-bold text-base text-white border-none cursor-pointer bg-green-700"
                        >
                            Post an Ad →
                        </button>
                    </div>
                )}

                {/* Bento Grid — identical structure to RecentListings */}
                {!loading && !error && filteredAds.length > 0 && (
                    <div className="w-full px-6 lg:px-8">
                        <div className="grid grid-cols-12 auto-rows-[220px] gap-6">
                            {layoutAds.map((ad, index) => {
                                const cls = `${ad.col} ${ad.row}`;
                                if (ad.type === "big") {
                                    return <MultiImageAd key={ad._id || ad.adId || index} ad={ad} className={cls} />;
                                } else if (ad.type === "small") {
                                    return <SingleImageAd key={ad._id || ad.adId || index} ad={ad} className={cls} />;
                                } else {
                                    return <TextAd key={ad._id || ad.adId || index} ad={ad} className={cls} />;
                                }
                            })}
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {!loading && !subFromUrl && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-10">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            ← Prev
                        </button>
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                            const p = i + 1;
                            return (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className="px-3.5 py-2 rounded-xl border font-bold cursor-pointer"
                                    style={{
                                        borderColor: page === p ? "#157A4F" : "#e5e7eb",
                                        background: page === p ? "#157A4F" : "#fff",
                                        color: page === p ? "#fff" : "#374151",
                                    }}
                                >
                                    {p}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>
                )}

            </section>

            <Footer />
        </>
    );
}

// ============ AD TEMPLATES — exact copy from RecentListings ============

function MultiImageAd({ ad, className }) {
    const router = useRouter();
    const images = ad.images && ad.images.length > 0
        ? ad.images.map(getSafeImageSrc)
        : ["/images/placeholder.webp", "/images/placeholder.webp", "/images/placeholder.webp"];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div
            onClick={() => router.push(`/product/${ad._id || ad.adId}`)}
            className={`relative rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition ${className}`}
        >
            {images.map((img, index) => (
                <Image
                    key={index}
                    src={img}
                    alt={ad.title || "Ad"}
                    fill
                    unoptimized
                    className={`object-cover transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                />
            ))}

            <div className="absolute inset-0 bg-black/50" />

            <div className="absolute bottom-0 p-8 text-white w-full">
                <h2 className="text-2xl font-bold leading-snug">{ad.title}</h2>
                <p className="mt-2 text-sm opacity-90">{ad.description}</p>
                <p className="mt-4 text-2xl font-bold text-yellow-400">{ad.price}</p>
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/chats?adId=${ad.adId || ad._id}&sellerId=${ad.userId || ''}`);
                        }}
                        className="px-4 py-2 text-sm rounded-xl theme-button-accent"
                    >
                        Chat
                    </button>
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 text-sm rounded-xl theme-button-primary"
                    >
                        Call
                    </button>
                </div>
            </div>

            <div className="absolute bottom-6 right-6 flex gap-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-2 rounded-full ${index === current ? "bg-white" : "bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

function SingleImageAd({ ad, className }) {
    const router = useRouter();
    const image = ad.images && ad.images[0] ? getSafeImageSrc(ad.images[0]) : "/images/placeholder.webp";

    return (
        <div
            onClick={() => router.push(`/product/${ad._id || ad.adId}`)}
            className={`relative rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition ${className}`}
        >
            <Image
                src={image}
                alt={ad.title || "Ad"}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-0 p-4 text-white w-full">
                <h3 className="text-sm font-semibold">{ad.title}</h3>
                <p className="text-lg font-bold text-yellow-400 mt-1">{ad.price}</p>
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/chats?adId=${ad.adId || ad._id}&sellerId=${ad.userId || ''}`);
                        }}
                        className="flex-1 py-2 text-xs rounded-lg theme-button-accent"
                    >
                        Chat
                    </button>
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 py-2 text-xs rounded-lg theme-button-primary"
                    >
                        Call
                    </button>
                </div>
            </div>
        </div>
    );
}

function TextAd({ ad, className }) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/product/${ad._id || ad.adId}`)}
            className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col justify-between ${className}`}
        >
            <div>
                <span className="text-xs uppercase tracking-wide text-gray-400">Sponsored</span>
                <h3 className="mt-3 font-semibold text-gray-900 leading-snug">{ad.title}</h3>
                <p className="mt-2 text-lg font-bold text-[var(--accent-500)]">{ad.price}</p>
            </div>
            <div className="flex gap-2 mt-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/chats?adId=${ad.adId || ad._id}&sellerId=${ad.userId || ''}`);
                    }}
                    className="flex-1 py-2 text-xs rounded-lg theme-button-accent"
                >
                    Chat
                </button>
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2 text-xs rounded-lg theme-button-primary"
                >
                    Call
                </button>
            </div>
        </div>
    );
}