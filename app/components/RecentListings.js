"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllAds } from "../lib/api";

// Bento grid layout pattern: Group A and B alternate
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

function getAdTemplate(ad) {
    if (!ad) return "text";
    const imageCount = ad.images?.length || 0;
    if (imageCount >= 2) return "big";
    if (imageCount === 1) return "small";
    return "text";
}

function getSafeImageSrc(value) {
    if (!value || typeof value !== "string") return "/images/placeholder.webp";
    const src = value.trim();
    if (!src) return "/images/placeholder.webp";
    if (src.startsWith("/")) return src;
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return "/images/placeholder.webp";
}

function assignBentoLayout(adsList) {
    return adsList.map((ad, i) => {
        const patternIndex = Math.floor(i / 6) % 2;
        const adTemplate = getAdTemplate(ad);
        
        // Find next layout position of the right type in this group
        const pattern = BENTO_PATTERNS[patternIndex];
        const posInGroup = i % 6;
        const layout = pattern[posInGroup];
        
        // Override big slots with actual template if ad doesn't have multiple images
        let finalLayout = layout;
        if (layout.type === "big" && adTemplate !== "big") {
            finalLayout = { ...layout, type: adTemplate };
        }
        
        return { ...ad, ...finalLayout };
    });
}

export default function RecentListings() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchAds() {
            try {
                setLoading(true);
                // Fetch ALL ads (use very high limit to get everything)
                const response = await getAllAds({ page: 1, limit: 10000 });
                if (response.success) {
                    const adsList = response.data?.ads || response.data || [];
                    setAds(adsList);
                } else {
                    setError("Could not load recent listings.");
                    setAds([]);
                }
            } catch (err) {
                console.error("Error fetching ads:", err);
                setError("Failed to load recent listings.");
                setAds([]);
            } finally {
                setLoading(false);
            }
        }
        fetchAds();
    }, []);

    const layoutAds = assignBentoLayout(ads);

    return (
        <section className="w-full py-20">
            <div className="w-full mb-14 px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Recent Listings
                </h2>
                <p className="text-gray-500 mt-3 text-sm md:text-base max-w-2xl mx-auto">
                    Discover the latest items posted near you
                </p>
            </div>

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

            {!loading && error && (
                <div className="text-center py-16 px-5 text-red-400">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && ads.length === 0 && (
                <div className="text-center py-16 px-5 text-gray-500">
                    <p>No listings available yet.</p>
                </div>
            )}

            {!loading && !error && ads.length > 0 && (
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
        </section>
    );
}

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
                    priority={index === current}
                    className={`object-cover transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                />
            ))}

            <div className="absolute inset-0 bg-black/50" />

            <div className="absolute bottom-0 p-8 text-white w-full">
                <h2 className="text-2xl font-bold leading-snug">{ad.title}</h2>
                <p className="mt-2 text-sm opacity-90">{ad.description}</p>
                <p className="mt-4 text-2xl font-bold text-yellow-400">₹{ad.price?.toLocaleString() || "0"}</p>
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
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/chats?adId=${ad.adId || ad._id}&sellerId=${ad.userId || ''}&autoCall=1`);
                        }}
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
                priority
                className="object-cover group-hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-0 p-4 text-white w-full">
                <h3 className="text-sm font-semibold">{ad.title}</h3>
                <p className="text-lg font-bold text-yellow-400 mt-1">₹{ad.price?.toLocaleString() || "0"}</p>
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
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/chats?adId=${ad.adId || ad._id}&sellerId=${ad.userId || ''}&autoCall=1`);
                        }}
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
                <span className="text-xs uppercase tracking-wide text-gray-400">{ad.category || "Category"}</span>
                <h3 className="mt-3 font-semibold text-gray-900 leading-snug">{ad.title}</h3>
                <p className="mt-2 text-lg font-bold text-[var(--accent-500)]">₹{ad.price?.toLocaleString() || "0"}</p>
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
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/chats?adId=${ad.adId || ad._id}&sellerId=${ad.userId || ''}&autoCall=1`);
                    }}
                    className="flex-1 py-2 text-xs rounded-lg theme-button-primary"
                >
                    Call
                </button>
            </div>
        </div>
    );
}