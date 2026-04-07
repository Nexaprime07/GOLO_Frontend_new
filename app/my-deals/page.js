"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CalendarDays, ChevronRight, Search, Tag, ShieldCheck, CircleHelp, ArrowUpDown, ExternalLink } from "lucide-react";

const stats = [
  { label: "Active Savings", value: "4", icon: Tag },
  { label: "Claimed Codes", value: "2", icon: CalendarDays },
  { label: "Total Redeemed", value: "12", icon: ShieldCheck },
  { label: "Expired", value: "1", icon: ExternalLink },
];

const tabs = ["All Deals", "Active", "Claimed", "Redeemed", "Expired"];

const deals = [
  {
    status: "Active",
    badge: "-50%",
    title: "50% Off Signature Dinner Menu",
    merchant: "GOURMET GARDEN",
    image: "/images/deal2.avif",
    expiry: "Expires Oct 24, 2024",
    button: "Redeem Now",
  },
  {
    status: "Claimed",
    badge: "8000",
    title: "Buy 1 Get 1 Free Movie Ticket",
    merchant: "LUMINA CINEMA",
    image: "/images/banner3.avif",
    expiry: "Expires Oct 15, 2024",
    button: "View Code",
  },
  {
    status: "Redeemed",
    badge: "FREE",
    title: "7-Day Unlimited Premium Pass",
    merchant: "URBAN FITNESS",
    image: "/images/place2.avif",
    expiry: "Redeemed on Oct 08, 2024",
    button: "View Offer",
  },
  {
    status: "Expired",
    badge: "$5 OFF",
    title: "Coffee & Pastry Morning Bundle",
    merchant: "BREW & BEAN",
    image: "/images/banner3.avif",
    expiry: "Expires Sep 30, 2024",
    button: "View Offer",
  },
  {
    status: "Active",
    badge: "FREE",
    title: "Screen Protector Installation",
    merchant: "TECHHUB REPAIR",
    image: "/images/place2.avif",
    expiry: "Expires Oct 29, 2024",
    button: "Redeem Now",
  },
  {
    status: "Claimed",
    badge: "-30%",
    title: "Full Exterior Gold Service",
    merchant: "ELITE CAR WASH",
    image: "/images/deal2.avif",
    expiry: "Expires Oct 21, 2024",
    button: "View Code",
  },
];

const quickTips = [
  "Always present your QR code to the merchant staff before ordering.",
  "Most deals are valid for 30 days. Check individual card expiry dates.",
  "You can use one deal per transaction unless specified otherwise.",
];

const helpLinks = ["Help Center", "Chat Support"];

export default function MyDeals() {
  return (
    <>
      <Navbar />

      <div className="bg-[#f7f6f2] min-h-screen">
        <div className="max-w-[1320px] mx-auto px-5 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
            <main className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h1 className="text-[34px] leading-none font-semibold text-[#1f1f1f]">My Deals</h1>
                  <p className="mt-2 text-[13px] text-[#6f6f6f]">Track and manage your active savings and past redemptions.</p>
                </div>

                <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-[#efcdbf] text-[12px] font-medium text-[#7b583f] bg-white shadow-sm self-start md:self-auto">
                  <Tag size={14} />
                  Discovery View
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 xl:grid-cols-4 gap-3">
                {stats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-[10px] border border-[#d8d8d8] bg-[#f8f8f8] px-4 py-3 min-h-[55px] shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4b128] text-white shrink-0">
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#777]">{item.label}</p>
                          <p className="text-[20px] leading-none font-semibold text-[#1b1b1b] mt-1">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-[12px] border border-[#ececec] bg-white px-3 md:px-4 py-3 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {tabs.map((tab, index) => (
                      <button
                        key={tab}
                        className={`h-8 px-4 rounded-full text-[12px] font-medium border transition ${index === 0 ? "bg-[#1f8c55] border-[#1f8c55] text-white" : "bg-white border-[#e0e0e0] text-[#666] hover:border-[#cfcfcf] hover:text-[#333]"}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center h-9 px-3 rounded-lg border border-[#e5e5e5] bg-[#fbfbfb] text-[#959595] text-[12px] min-w-[230px]">
                      <Search size={13} className="mr-2 text-[#a6a6a6]" />
                      <span>Filter by merchant...</span>
                    </div>
                    <button className="h-9 px-3 rounded-lg border border-[#e5e5e5] bg-[#fbfbfb] text-[#666] text-[12px] inline-flex items-center gap-2">
                      <ArrowUpDown size={13} />
                      Newest First
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {deals.map((deal) => (
                  <article key={deal.title} className="group rounded-[12px] border border-[#282828] bg-white overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                    <div className="relative h-[132px] bg-[#f3efe5] overflow-hidden">
                      <Image src={deal.image} alt={deal.title} fill className="object-cover" />
                      <div className="absolute inset-x-0 top-0 flex items-start justify-between px-2 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm ${deal.status === "Active" ? "bg-[#d3f3dd] text-[#15803d]" : deal.status === "Claimed" ? "bg-[#ffe9c7] text-[#a16207]" : deal.status === "Redeemed" ? "bg-[#dce6ff] text-[#334155]" : "bg-[#f5e2d7] text-[#b45309]"}`}>
                          {deal.status}
                        </span>
                        <span className="rounded-full bg-[#7a4af4] px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">{deal.badge}</span>
                      </div>
                    </div>

                    <div className="px-3 pt-2.5 pb-3">
                      <p className="text-[9px] font-semibold tracking-[0.18em] text-[#4ca5ef] uppercase">{deal.merchant}</p>
                      <h3 className="mt-1 text-[16px] leading-tight font-semibold text-[#222] min-h-[38px]">{deal.title}</h3>

                      <div className="mt-4 flex items-center gap-1 text-[11px] text-[#737373]">
                        <CalendarDays size={13} className="text-[#8f8f8f]" />
                        <span>{deal.expiry}</span>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <button className="h-8 flex-1 rounded-md bg-[#f3b12a] text-[#1f1f1f] text-[12px] font-semibold hover:brightness-95 transition">
                          {deal.button}
                        </button>
                        <button className="h-8 w-8 rounded-md border border-[#e0e0e0] text-[#777] flex items-center justify-center hover:border-[#c9c9c9]">
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-10 border-t border-[#ececec] pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[12px] text-[#6f6f6f]">
                <p>Showing 1 to 6 of 6 deals</p>
                <div className="flex items-center gap-2">
                  <button className="h-8 px-3 rounded-md border border-[#e4e4e4] bg-white text-[#888]">Previous</button>
                  <button className="h-8 w-8 rounded-md border border-[#9fd0eb] bg-[#eaf5fb] text-[#2c6d92] font-semibold">1</button>
                  <button className="h-8 w-8 rounded-md border border-[#e4e4e4] bg-white text-[#777]">2</button>
                  <button className="h-8 px-3 rounded-md border border-[#e4e4e4] bg-white text-[#333]">Next</button>
                </div>
              </div>
            </main>

            <aside className="w-full lg:w-[270px] lg:shrink-0 space-y-4">
              <section className="rounded-[12px] border border-[#ececec] bg-white px-4 py-4 shadow-sm">
                <h2 className="text-[14px] font-semibold text-[#222]">Quick Tips</h2>
                <ul className="mt-4 space-y-3 text-[12px] leading-[1.45] text-[#555]">
                  {quickTips.map((tip, index) => (
                    <li key={tip} className="flex items-start gap-2">
                      <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${index === 0 ? "bg-[#157a4f]" : index === 1 ? "bg-[#f4a632]" : "bg-[#6f8cff]"}`} />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
                <Link href="#" className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-[#2f84ff] hover:underline">
                  Full Redemption Policy
                  <ChevronRight size={13} />
                </Link>
              </section>

              <section className="rounded-[12px] border border-[#ececec] bg-white px-4 py-4 shadow-sm">
                <h2 className="text-[14px] font-semibold text-[#222]">Need help?</h2>
                <p className="mt-2 text-[12px] text-[#6f6f6f]">Having trouble redeeming a deal or finding your receipt?</p>
                <div className="mt-4 space-y-2">
                  {helpLinks.map((item) => (
                    <button key={item} className="w-full h-9 rounded-md border border-[#e6e6e6] bg-white text-[12px] text-[#3f3f3f] flex items-center gap-2 px-3 hover:border-[#cfcfcf]">
                      <CircleHelp size={14} className="text-[#666]" />
                      {item}
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-[12px] border border-[#e8e8e8] bg-white shadow-sm overflow-hidden">
                <div className="relative h-[205px]">
                  <Image src="/images/place2.avif" alt="Signature Wellness Day" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/12 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-[#ff6c91] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-sm">Featured</span>
                  </div>
                  <div className="absolute left-3 right-3 bottom-3 text-white">
                    <h3 className="text-[16px] font-semibold leading-tight">Signature Wellness Day</h3>
                    <p className="mt-1 text-[12px] text-white/90">Special price Rs. 1,200</p>
                    <button className="mt-3 h-9 w-full rounded-md bg-[#f3b12a] text-white text-[12px] font-semibold">Claim Now</button>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
