"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSidebar from "../components/ProfileSidebar";
import { useAuth } from "../context/AuthContext";
import { getMyAnalytics } from "../lib/api";
import {
  Eye,
  Users,
  MousePointerClick,
  Heart,
  Package,
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
} from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  expired: "bg-orange-100 text-orange-700",
  deleted: "bg-red-100 text-red-600",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-600",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
        STATUS_COLORS[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

// ─── Summary Card ────────────────────────────────────────────────────────────

function SummaryCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: accent + "20" }}
      >
        <Icon size={22} style={{ color: accent }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-black">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Bar Chart (SVG-based) ────────────────────────────────────────────────────

function BarChart({ ads }) {
  const top5 = [...ads]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const maxVal = Math.max(...top5.map((a) => a.views), 1);
  const BAR_H = 180;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-base font-semibold text-black mb-4">Top Ads by Views</h3>
      {top5.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
      ) : (
        <div className="flex items-end gap-4 justify-center" style={{ height: BAR_H + 40 }}>
          {top5.map((ad, i) => {
            const barH = Math.max(8, Math.round((ad.views / maxVal) * BAR_H));
            return (
              <div key={ad.adId || i} className="flex flex-col items-center gap-1 w-16">
                <span className="text-xs font-semibold text-gray-700">{ad.views}</span>
                <div
                  className="w-10 rounded-t-lg transition-all duration-500"
                  style={{ height: barH, backgroundColor: "#157A4F" }}
                />
                <p
                  className="text-[10px] text-gray-500 text-center leading-tight line-clamp-2 w-16"
                  title={ad.title}
                >
                  {ad.title?.length > 18 ? ad.title.slice(0, 16) + "…" : ad.title}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Donut Chart (SVG-based) ──────────────────────────────────────────────────

const PALETTE = ["#157A4F", "#F5B849", "#3B82F6", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

function DonutChart({ ads }) {
  const categoryMap = {};
  for (const ad of ads) {
    categoryMap[ad.category] = (categoryMap[ad.category] || 0) + 1;
  }
  const entries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const total = ads.length || 1;

  const R = 60;
  const CX = 80;
  const CY = 80;
  const INNER_R = 36;

  let cumulative = 0;
  const slices = entries.map(([cat, count], i) => {
    const pct = count / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;

    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle);
    const y2 = CY + R * Math.sin(endAngle);
    const xi1 = CX + INNER_R * Math.cos(endAngle);
    const yi1 = CY + INNER_R * Math.sin(endAngle);
    const xi2 = CX + INNER_R * Math.cos(startAngle);
    const yi2 = CY + INNER_R * Math.sin(startAngle);
    const largeArc = pct > 0.5 ? 1 : 0;

    return {
      d: `M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${xi2} ${yi2} Z`,
      color: PALETTE[i % PALETTE.length],
      cat,
      count,
      pct,
    };
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-base font-semibold text-black mb-4">Ads by Category</h3>
      {entries.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {slices.map((s, i) => (
              <path key={i} d={s.d} fill={s.color} className="transition-opacity hover:opacity-80" />
            ))}
            <text x={CX} y={CY + 5} textAnchor="middle" className="text-xs" fontSize="11" fill="#374151" fontWeight="600">
              {total}
            </text>
            <text x={CX} y={CY + 18} textAnchor="middle" fontSize="8" fill="#9CA3AF">
              total ads
            </text>
          </svg>
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {slices.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-gray-700 truncate flex-1">{s.cat}</span>
                <span className="text-gray-500 font-medium shrink-0">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sortable Table ───────────────────────────────────────────────────────────

const COLUMNS = [
  { key: "title", label: "Ad" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "views", label: "Views" },
  { key: "uniqueVisitors", label: "Unique" },
  { key: "contactClicks", label: "Clicks" },
  { key: "wishlistCount", label: "Wishlist" },
  { key: "createdAt", label: "Posted" },
];

function SortIcon({ col, sortKey, sortDir }) {
  if (col !== sortKey) return <ArrowUpDown size={13} className="text-gray-400" />;
  return sortDir === "asc" ? (
    <ArrowUp size={13} className="text-[#157A4F]" />
  ) : (
    <ArrowDown size={13} className="text-[#157A4F]" />
  );
}

function AdsTable({ ads }) {
  const [sortKey, setSortKey] = useState("views");
  const [sortDir, setSortDir] = useState("desc");

  const sorted = useMemo(() => {
    return [...ads].sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (sortKey === "createdAt") {
        va = new Date(va).getTime();
        vb = new Date(vb).getTime();
      }
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [ads, sortKey, sortDir]);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-base font-semibold text-black">Per-Ad Breakdown</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none hover:text-gray-700 whitespace-nowrap"
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-400">
                  No ads found
                </td>
              </tr>
            )}
            {sorted.map((ad, i) => (
              <tr
                key={ad.adId || i}
                className="hover:bg-[#F8F6F2] transition-colors"
              >
                {/* Ad column */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 max-w-[200px]">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                      {ad.image ? (
                        <Image
                          src={ad.image}
                          alt={ad.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-black line-clamp-2 leading-tight">
                      {ad.title}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{ad.category}</td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={ad.status} />
                </td>

                <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                  {ad.views.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {ad.uniqueVisitors.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {ad.contactClicks.toLocaleString()}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-rose-500 font-medium">
                    <Heart size={13} className="shrink-0" />
                    {(ad.wishlistCount || 0).toLocaleString()}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                  {ad.createdAt
                    ? new Date(ad.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>

                <td className="px-4 py-3">
                  <Link
                    href={`/product/${ad.adId}`}
                    className="text-[#157A4F] hover:text-[#0f5c3a] transition"
                    title="View Ad"
                  >
                    <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const res = await getMyAnalytics();
        if (res.success) {
          setAnalytics(res.data);
        } else {
          setError("Failed to load analytics.");
        }
      } catch (err) {
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [isAuthenticated]);

  if (authLoading) return null;

  const summary = analytics?.summary || {};
  const ads = analytics?.ads || [];

  const CARDS = [
    { icon: Package, label: "Total Ads", value: summary.totalAds ?? 0, accent: "#157A4F" },
    { icon: TrendingUp, label: "Active Ads", value: summary.activeAds ?? 0, accent: "#22C55E" },
    { icon: Eye, label: "Total Views", value: (summary.totalViews ?? 0).toLocaleString(), accent: "#3B82F6" },
    { icon: Users, label: "Unique Visitors", value: (summary.uniqueVisitors ?? 0).toLocaleString(), accent: "#8B5CF6" },
    { icon: MousePointerClick, label: "Contact Clicks", value: (summary.totalContactClicks ?? 0).toLocaleString(), accent: "#F5B849" },
    { icon: Heart, label: "Wishlist Saves", value: (summary.totalWishlistSaves ?? 0).toLocaleString(), accent: "#EF4444" },
  ];

  return (
    <>
      <Navbar />

      <div className="bg-[#F8F6F2] min-h-screen py-14 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-10">

          {/* LEFT SIDEBAR */}
          <ProfileSidebar />

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-3 space-y-8">

            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-semibold text-black">Analytics</h1>
              <p className="text-gray-500 mt-1">
                Track performance of your posted ads (authenticated users only)
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-sm p-20 flex items-center justify-center">
                <p className="text-gray-500">Loading analytics...</p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="bg-white rounded-2xl shadow-sm p-12 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {/* Content */}
            {!loading && !error && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                  {CARDS.map((card) => (
                    <SummaryCard key={card.label} {...card} />
                  ))}
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  <BarChart ads={ads} />
                  <DonutChart ads={ads} />
                </div>

                {/* Table */}
                <AdsTable ads={ads} />
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
