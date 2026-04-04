"use client";

import { useRef } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import GolocalProfileSidebar from "../../components/GolocalProfileSidebar";
import { Trophy, Dot, Clock3, ChevronRight } from "lucide-react";

const couponCodes = ["GOLD-REWARD-10", "GOLD-REWARD-20", "GOLD-REWARD-30"];
const featuredRewards = [
  { title: "$10 Off Site-wide", expiry: "Expires Dec 31, 2024", cost: "500 pts", best: false },
  { title: "Buy 1 Get 1 at PUMA", expiry: "Expires Nov 15, 2024", cost: "250 pts", best: true },
  { title: "20% Off Supplement Stack", expiry: "Expires Oct 20, 2024", cost: "800 pts", best: false },
  { title: "Exclusive Merch Offer", expiry: "Expires Jan 15, 2025", cost: "1200 pts", best: false },
];

export default function GolocalRewardsPage() {
  const couponStripRef = useRef(null);
  const featuredStripRef = useRef(null);

  const scrollStrip = (ref, amount = 360) => {
    if (!ref?.current) return;
    ref.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f3f3f3]">
        <div className="w-full px-0 py-0">
          <div className="grid lg:grid-cols-[250px_1fr] min-h-[760px]">
            <GolocalProfileSidebar active="rewards" />

            <main className="p-5 lg:p-7">
                <section className="rounded-xl border border-[#dce7e1] bg-[#e9f1ed] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-[32px] leading-none font-bold text-[#1a1a1a]">Your Rewards</h1>
                    <p className="text-[#7a8a82] mt-2 text-[13px] max-w-[360px]">Keep earning to unlock better rewards. You're making great progress this month!</p>
                  </div>

                  <div className="rounded-2xl border border-[#deebe5] bg-white p-5 min-w-[230px]">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#9b9b9b]">Total Balance</p>
                    <div className="flex items-end gap-1 mt-1">
                      <span className="text-[40px] leading-none font-bold text-[#1a6d49]">1,250</span>
                      <span className="text-[20px] font-semibold text-[#1a6d49] mb-0.5">pts</span>
                    </div>
                    <button className="mt-3 h-9 w-full rounded-xl border border-[#d5e6df] text-[12px] text-[#3f6f5e]">View Point History</button>
                  </div>
                </section>

                <section className="mt-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-[24px] leading-none font-semibold text-[#1a1a1a]">Tier Progression</h2>
                      <p className="text-[12px] text-[#808080] mt-1">Only 250 points to reach Gold!</p>
                    </div>
                    <button className="rounded-full border border-[#e5e5e5] px-3 py-1 text-xs text-[#6e6e6e] inline-flex items-center gap-1"><Trophy size={10} /> Tier Benefits</button>
                  </div>

                  <div className="mt-4 px-1">
                    <div className="relative h-10 flex items-center">
                      <div className="absolute left-0 right-0 h-[2px] bg-[#dedede]" />
                      <div className="absolute left-0 w-[62%] h-[2px] bg-[#157a4f]" />
                      <div className="relative z-10 grid grid-cols-4 w-full">
                        {["Bronze", "Silver", "Gold", "Platinum"].map((tier, idx) => (
                          <div key={tier} className="flex flex-col items-center">
                            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${idx < 2 ? "bg-[#157a4f] border-[#157a4f] text-white" : "bg-white border-[#b9b9b9] text-[#8a8a8a]"}`}>
                              <Trophy size={13} />
                            </span>
                            <span className="mt-2 text-[11px] text-[#4f4f4f] font-semibold">{tier}</span>
                            <span className="text-[9px] text-[#a0a0a0]">{idx === 0 ? "1.0x" : idx === 1 ? "1.2x" : idx === 2 ? "1.5x" : "2.0x"} Multiplier</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[24px] leading-none font-semibold text-[#252525]">Earned coupons</h2>
                    <button className="text-[#157a4f] text-[12px] font-semibold">View All Coupons</button>
                  </div>

                  <div className="mt-4 relative">
                    <div ref={couponStripRef} className="flex gap-4 overflow-x-auto pb-2 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {couponCodes.map((code) => (
                      <div key={code} className="min-w-[320px] max-w-[320px] rounded-xl border border-[#ececec] bg-white shadow-sm p-4">
                        <div className="h-4 text-[#f4a632] text-xs mb-1">•</div>
                        <p className="text-center text-[24px] leading-none font-bold text-[#1a1a1a]">Coupon Unlocked!</p>
                        <p className="mt-2 text-[11px] text-center text-[#7d7d7d]">Your reward has been added to your account. You can use it during your next checkout.</p>
                        <div className="mt-3 rounded-xl border border-dashed border-[#95ddb5] bg-[#f5fef9] p-3 text-center">
                          <p className="text-[10px] text-[#909090] uppercase tracking-wider">Your code</p>
                          <p className="text-[28px] leading-none font-bold text-[#1a1a1a] mt-1.5">{code}</p>
                        </div>
                        <div className="mt-2 border-t border-[#f0f0f0] pt-2">
                          <p className="text-[10px] text-[#9a9a9a] inline-flex items-center gap-1"><Dot size={11} /> The points have been deducted from your balance.</p>
                        </div>
                        <button className="mt-3 h-10 w-full rounded-xl bg-[#1a6d49] text-white text-sm font-semibold">Copy & Go to Shop</button>
                        <button className="mt-2 h-8 w-full rounded-xl text-xs text-[#6f6f6f]">Close</button>
                      </div>
                    ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollStrip(couponStripRef)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-lg"
                      aria-label="Scroll earned coupons"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </section>

                <section className="mt-8 pb-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[24px] leading-none font-semibold text-[#1a1a1a]">Featured Rewards</h2>
                    <button className="text-[#1a6d49] text-[12px] font-semibold">View All Rewards</button>
                  </div>

                  <div className="mt-4 relative">
                    <div ref={featuredStripRef} className="flex gap-3 overflow-x-auto pb-2 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {featuredRewards.map((item) => (
                      <div key={item.title} className="min-w-[250px] max-w-[250px] rounded-xl border border-[#f0f0f0] bg-white p-3 relative">
                        {item.best && (
                          <span className="absolute -top-2 right-3 bg-[#f4a632] text-[#3d2d00] text-[10px] font-bold rounded-full px-2 py-0.5">BEST VALUE</span>
                        )}
                        <p className="text-[15px] font-semibold text-[#1a1a1a] leading-tight">{item.title}</p>
                        <p className="mt-1 text-[9px] text-[#959595] inline-flex items-center gap-1"><Clock3 size={9} /> {item.expiry}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <p className="text-[8px] text-[#aaaaaa] tracking-wider">COST</p>
                            <p className="text-[24px] leading-none font-bold text-[#1a6d49]">{item.cost}</p>
                          </div>
                          <button className={`h-8 rounded-full px-4 text-xs font-semibold ${item.best ? "bg-[#f4a632] text-[#3d2d00]" : "bg-[#1a6d49] text-white"}`}>
                            Redeem
                          </button>
                        </div>
                      </div>
                    ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollStrip(featuredStripRef, 280)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-lg"
                      aria-label="Scroll featured rewards"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </section>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
