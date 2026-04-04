"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircleHelp, Download, MapPin, Share2, Star, Ticket } from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const steps = [
  { title: "Step 1", subtitle: "Offer claimed successfully", active: false },
  { title: "Step 2", subtitle: "Show this QR to merchant", active: true },
  { title: "Step 3", subtitle: "Pay at store & enjoy", active: false },
];

function QrPattern() {
  return (
    <svg viewBox="0 0 220 220" className="h-[164px] w-[164px]" role="img" aria-label="Offer QR Code">
      <rect width="220" height="220" fill="white" />
      <rect x="12" y="12" width="196" height="196" fill="none" stroke="#1ea05d" strokeWidth="3" strokeDasharray="30 30" />

      <rect x="28" y="28" width="50" height="50" rx="8" fill="#181d25" />
      <rect x="40" y="40" width="26" height="26" rx="5" fill="white" />

      <rect x="142" y="28" width="50" height="50" rx="8" fill="#181d25" />
      <rect x="154" y="40" width="26" height="26" rx="5" fill="white" />

      <rect x="28" y="142" width="50" height="50" rx="8" fill="#181d25" />
      <rect x="40" y="154" width="26" height="26" rx="5" fill="white" />

      <rect x="93" y="32" width="18" height="18" rx="9" fill="#181d25" />
      <rect x="112" y="32" width="18" height="74" rx="9" fill="#181d25" />
      <rect x="93" y="88" width="37" height="18" rx="9" fill="#181d25" />

      <rect x="85" y="116" width="18" height="18" rx="9" fill="#181d25" />
      <rect x="121" y="116" width="18" height="18" rx="9" fill="#181d25" />
      <rect x="149" y="116" width="18" height="18" rx="9" fill="#181d25" />
      <rect x="177" y="116" width="18" height="18" rx="9" fill="#181d25" />

      <rect x="89" y="146" width="14" height="14" rx="7" fill="#181d25" />
      <rect x="113" y="146" width="14" height="14" rx="7" fill="#181d25" />
      <rect x="146" y="146" width="14" height="14" rx="7" fill="#181d25" />
      <rect x="172" y="146" width="24" height="14" rx="7" fill="#181d25" />

      <rect x="89" y="172" width="14" height="14" rx="7" fill="#181d25" />
      <rect x="113" y="172" width="14" height="36" rx="7" fill="#181d25" />
      <rect x="146" y="172" width="14" height="14" rx="7" fill="#181d25" />
      <rect x="172" y="172" width="14" height="36" rx="7" fill="#181d25" />
      <rect x="188" y="194" width="8" height="14" rx="4" fill="#181d25" />
    </svg>
  );
}

export default function ClaimedOfferPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <div className="mx-auto max-w-[1260px] px-6 pt-5">
        <p className="text-[11px] text-[#7a7a7a]">Deals <span className="mx-1">›</span> <span className="font-medium">Claimed Offer</span></p>
        <h1 className="mt-3 text-[44px] font-bold leading-none text-[#1e2228] tracking-[-0.02em]">90-Minute Signature Massage Package</h1>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.82fr_0.86fr]">
          <div className="overflow-hidden rounded-[12px] border border-[#d8dce3] bg-white shadow-[0_6px_18px_rgba(16,24,40,0.06)]">
            <div className="flex items-center gap-3 border-b border-[#e6e9ed] px-4 py-3">
              <div className="h-14 w-14 overflow-hidden rounded-[8px] border border-[#d9dde2]">
                <Image src="/images/place2.avif" alt="Signature Wellness" width={56} height={56} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[15px] font-bold text-[#1d232c]">Signature Wellness Package</p>
                  <span className="rounded bg-[#f45c92] px-1.5 py-0.5 text-[9px] font-bold text-white">CLAIMED</span>
                </div>
                <p className="mt-1 text-[11px] text-[#6d7681]">90-Minute session with essential oils & hot stones</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[28px] font-bold leading-none text-[#e8a91e]">Rs.150</span>
                  <span className="text-[11px] font-semibold text-[#ed6f6f] line-through">Rs 80.00</span>
                </div>
              </div>
            </div>

            <div className="px-6 pb-7 pt-6 text-center">
              <div className="mx-auto flex h-[232px] w-[232px] items-center justify-center">
                <QrPattern />
              </div>

              <p className="mt-1 text-[16px] font-medium text-[#1e2228]">Scan this QR at the store to redeem the offer</p>

              <div className="mx-auto mt-4 w-fit min-w-[290px] rounded-[10px] bg-[#f0f2f5] px-4 py-3 border border-[#e2e6eb]">
                <p className="text-[11px] text-[#7a828d]">This QR is valid for 6 hours from claim time</p>
                <p className="mt-1 text-[13px] font-bold text-[#1e232b]">Expires: Today, 8:45 PM</p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button className="inline-flex h-10 min-w-[112px] items-center justify-center gap-2 rounded-[8px] bg-[#1e9a5c] px-4 text-[12px] font-semibold text-white shadow-[0_2px_6px_rgba(30,154,92,0.35)] transition-colors hover:bg-[#187f4c]">
                  <Download size={14} /> Download QR
                </button>
                <button className="inline-flex h-10 min-w-[112px] items-center justify-center gap-2 rounded-[8px] border border-[#d4d9df] bg-white px-6 text-[12px] font-semibold text-[#4b5563] transition-colors hover:bg-[#f8f9fb]">
                  <Share2 size={14} /> Share
                </button>
              </div>

              <p className="mt-4 text-[10px] text-[#9098a3]">Secure claim • No upfront payment required at GOLO</p>
            </div>
          </div>

          <div className="space-y-3">
            <aside className="rounded-[12px] border border-[#d8dce3] bg-white p-4 shadow-[0_4px_14px_rgba(16,24,40,0.05)]">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border border-[#d8dce3]">
                  <Image src="/images/hero.jpg" alt="Azure Wellness & Spa" width={64} height={64} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[#1f2329]">Azure Wellness & Spa</p>
                  <p className="mt-1 text-[12px] text-[#66707b]"><Star size={11} className="mr-1 inline text-[#f4ba34]" />4.9 (1,240 Reviews)</p>
                  <p className="mt-1 text-[12px] leading-5 text-[#66707b]"><MapPin size={11} className="mr-1 inline" />122 Blue Avenue, Suite 400, Manhattan, NY 10012</p>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-[10px] border border-[#e4e7eb]">
                <Image src="/images/banner3.avif" alt="Merchant highlight" width={420} height={240} className="h-[110px] w-full object-cover" />
              </div>

              <button
                onClick={() => router.push("/nearby-deals/store")}
                className="mt-4 h-10 w-full rounded-[8px] border border-[#e8b038] bg-[#f7ebcf] text-[12px] font-semibold text-[#8f6515] transition-colors hover:bg-[#f3dfb2]"
              >
                View Store
              </button>

              <button className="mt-2 h-10 w-full rounded-[8px] border border-[#d6dbe2] bg-white text-[12px] font-semibold text-[#5e6772] transition-colors hover:bg-[#f8f9fb]">
                Contact Merchant
              </button>
            </aside>

            <aside className="rounded-[12px] border border-[#d8dce3] bg-[#f1f3f6] p-4 shadow-[0_4px_14px_rgba(16,24,40,0.04)]">
              <p className="text-[13px] font-bold text-[#1f2329]">Need help with redemption?</p>
              <p className="mt-2 text-[11px] leading-5 text-[#66707b]">
                If you encounter any issues at the store, please contact our 24/7 support team.
              </p>
              <button className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1e9a5c]">
                <CircleHelp size={13} /> Visit Help Center
              </button>
            </aside>
          </div>
        </section>

        <section className="mt-4 grid gap-3 pb-5 sm:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.title}
              className={`rounded-[10px] border px-4 py-4 text-center shadow-[0_2px_8px_rgba(16,24,40,0.04)] ${step.active ? "border-[#efbe51] bg-[#fff9eb]" : "border-[#d8dce3] bg-[#f7f8fa]"}`}
            >
              <Ticket size={19} className={`mx-auto ${step.active ? "text-[#e4a923]" : "text-[#d7b976]"}`} />
              <p className="mt-2 text-[15px] font-bold text-[#1f2329] leading-none">{step.title}</p>
              <p className="mt-1.5 text-[13px] text-[#66707b] leading-5">{step.subtitle}</p>
            </article>
          ))}
        </section>
      </div>

      <Footer />
    </main>
  );
}
