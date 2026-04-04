"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Circle,
  Clock3,
  Heart,
  MapPin,
  Shield,
  Share2,
  Sparkles,
  Star,
  Ticket,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const redeemSteps = [
  {
    title: "Claim Offer",
    description: "Click the claim button to secure your unique voucher code.",
    icon: Ticket,
  },
  {
    title: "Show Code",
    description: "Present the digital QR code at the merchant location during visit.",
    icon: Circle,
  },
  {
    title: "Enjoy!",
    description: "Redeem your discount and enjoy your premium wellness experience.",
    icon: Sparkles,
  },
];

const faqs = [
  {
    q: "Q: Can I buy this as a gift?",
    a: "Yes! Once you claim the offer, you can share the redemption code with a friend.",
  },
  {
    q: "Q: What should I bring to the spa?",
    a: "Azure provides robes, slippers, and lockers. Just bring yourself and a digital copy of the QR code.",
  },
  {
    q: "Q: Is gratuity included?",
    a: "Gratuity is not included in the deal price and is at the discretion of the customer.",
  },
];

const recommended = [
  { title: "Gourmet Dinner for Two", shop: "LE PETIT BISTRO", price: "$65", old: "$120", img: "/images/deal1.jpg" },
  { title: "Weekend Yoga Retreat", shop: "ZEN SPACE", price: "$89", old: "$150", img: "/images/deal2.jpg" },
  { title: "Artisanal Coffee Box", shop: "BREW MASTERS", price: "$22", old: "$45", img: "/images/deal3.jpg" },
  { title: "Luxury Boat Tour", shop: "HARBOR SAILS", price: "$120", old: "$250", img: "/images/deal4.jpg" },
];

export default function NearbyDealDetailsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F3F3F3]">
      <Navbar />

      <div className="mx-auto max-w-[1260px] px-6 pb-10 pt-5">
        <p className="text-[11px] text-[#7b7b7b]">
          Deals <span className="mx-1">›</span> Wellness <span className="mx-1">›</span>
          <span className="font-semibold text-[#2d2d2d]"> 90-Minute Signature Massage Package</span>
        </p>

        <section className="mt-6 rounded-[14px] border border-[#20262e55] bg-[#f8f8f8] p-4 shadow-[0_2px_0_rgba(0,0,0,0.05)]">
          <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
            <div className="relative overflow-hidden rounded-[12px] border border-[#20262e55]">
              <Image
                src="/images/place2.avif"
                alt="Spa interior"
                width={960}
                height={620}
                className="h-full min-h-[320px] w-full object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-[#fd4f91] px-3 py-1 text-[10px] font-bold text-white">
                Limited Time
              </span>
            </div>

            <div className="rounded-[12px] bg-[#f8f8f8] p-2">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-[43px] font-bold leading-[1.02] text-[#1b1f24]">90-Minute Signature Massage Package</h1>
                <div className="flex gap-2">
                  <button className="rounded-md border border-[#dadde2] bg-white p-1.5 text-[#616973]"><Heart size={14} /></button>
                  <button className="rounded-md border border-[#dadde2] bg-white p-1.5 text-[#616973]"><Share2 size={14} /></button>
                </div>
              </div>

              <p className="mt-3 text-[13px] leading-5 text-[#5d6670]">
                Indulge in pure relaxation with essential oils and hot stones.
              </p>

              <div className="mt-5 rounded-[12px] bg-[#eceff3] p-4">
                <div className="flex items-center gap-2">
                  <span className="text-[44px] font-bold leading-none text-[#e7a91d]">Rs.150</span>
                  <span className="text-[13px] font-semibold text-[#ec6a67] line-through">Rs 80.00</span>
                  <span className="rounded-full bg-[#efbe51] px-2 py-0.5 text-[10px] font-bold text-[#402800]">44% OFF</span>
                </div>

                <button
                  onClick={() => router.push("/nearby-deals/deal/claimed-offer")}
                  className="mt-4 h-11 w-full rounded-[8px] border border-[#157a4f] bg-white text-[17px] font-bold text-[#157a4f] transition-all duration-200 hover:bg-[#157a4f] hover:text-white active:scale-[0.99]"
                >
                  Claim Offer
                </button>

                <p className="mt-3 text-center text-[10px] text-[#7e8892]">
                  <Shield size={11} className="mr-1 inline" /> Secure claim • No upfront payment required
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[8px] border border-[#d6d9de] bg-[#eff2f7] px-3 py-2">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-[#6573c7]">VALIDITY</p>
                  <p className="mt-1 text-[18px] font-bold text-[#1f2430]">Ends Dec 31</p>
                </div>
                <div className="rounded-[8px] border border-[#d6d9de] bg-[#eff2f7] px-3 py-2">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-[#6573c7]">STOCK</p>
                  <p className="mt-1 text-[18px] font-bold text-[#1f2430]">12 Left Today</p>
                </div>
              </div>

              <p className="mt-4 border-t border-[#d6d9de] pt-3 text-[11px] text-[#727b86]">
                <Clock3 size={11} className="mr-1 inline" /> Digital redemption via QR code
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.75fr_1fr]">
          <div className="space-y-10">
            <div>
              <h2 className="text-[37px] font-bold text-[#1f2329]">About this offer</h2>
              <p className="mt-4 text-[14px] leading-7 text-[#5f6873]">
                Experience the ultimate escape from daily stress with our Signature Wellness Package at Azure Wellness & Spa.
                This exclusive 90-minute session is designed to revitalize both body and mind using a blend of traditional
                techniques and modern luxuries.
              </p>
              <div className="mt-4 grid gap-2 text-[14px] text-[#38414a] sm:grid-cols-2">
                <p>• 60-Minute Deep Tissue Massage</p>
                <p>• 30-Minute Targeted Hot Stone Therapy</p>
                <p>• Aromatherapy with Premium Oils</p>
                <p>• Complimentary Herbal Tea Service</p>
              </div>
              <p className="mt-4 text-[14px] italic leading-7 text-[#7a828d]">
                Azure Wellness & Spa is an award-winning sanctuary located in the heart of Manhattan, dedicated to providing holistic healing and professional care.
              </p>
            </div>

            <div>
              <h2 className="text-[37px] font-bold text-[#1f2329]">How to Redeem</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {redeemSteps.map((step) => (
                  <article key={step.title} className="rounded-[12px] border border-[#d8dce3] bg-white p-4 text-center">
                    <step.icon size={19} className="mx-auto text-[#e7a91d]" />
                    <h3 className="mt-3 text-[16px] font-bold text-[#1f2329]">{step.title}</h3>
                    <p className="mt-2 text-[12px] leading-5 text-[#66707b]">{step.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[37px] font-bold text-[#1f2329]">Terms & Restrictions</h2>
              <div className="mt-4 overflow-hidden rounded-[12px] border border-[#d8dce3] bg-white">
                <div className="border-b border-[#e3e6eb] px-4 py-3">
                  <p className="text-[13px] font-bold text-[#1f2329]">Fine Print</p>
                  <p className="mt-2 text-[12px] leading-5 text-[#66707b]">
                    Voucher is valid for one person only. Cannot be combined with other offers. Appointment required at least 24
                    hours in advance. Subject to availability. Valid only at the Manhattan location.
                  </p>
                </div>
                <div className="border-b border-[#e3e6eb] px-4 py-3 text-[13px] font-bold text-[#1f2329]">Cancellation Policy</div>
                <div className="px-4 py-3 text-[13px] font-bold text-[#1f2329]">Eligibility</div>
              </div>
            </div>

            <div>
              <h2 className="text-[37px] font-bold text-[#1f2329]">What people are saying</h2>
              <div className="mt-4 rounded-[12px] border border-[#d8dce3] bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[15px] font-bold text-[#1f2329]">Sarah Jenkins</p>
                    <p className="mt-1 text-[#f4ba34]">★★★★★</p>
                  </div>
                  <p className="text-[11px] text-[#8a939e]">Oct 15, 2023</p>
                </div>
                <p className="mt-3 text-[13px] leading-6 text-[#66707b]">
                  Absolutely incredible experience! The deep tissue massage was exactly what I needed after a stressful week.
                  The hot stones felt divine, and the staff at Azure was so professional. Highly recommend this deal!
                </p>
                <button className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#4f6adf]">
                  See all reviews <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-[37px] font-bold text-[#1f2329]">Frequently Asked Questions</h2>
              <div className="mt-4 space-y-3">
                {faqs.map((item) => (
                  <article key={item.q} className="rounded-[12px] border border-[#d8dce3] bg-white px-4 py-3">
                    <p className="text-[13px] font-bold text-[#1f2329]">{item.q}</p>
                    <p className="mt-2 text-[12px] leading-5 text-[#66707b]">{item.a}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit self-start">
            <div className="rounded-[12px] border border-[#d8dce3] bg-white p-4">
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
                <Image src="/images/banner3.avif" alt="Merchant highlight" width={420} height={240} className="h-[130px] w-full object-cover" />
              </div>

              <div className="mt-4 flex items-center justify-between text-[12px] text-[#66707b]">
                <span>Response time</span>
                <span className="font-semibold text-[#1f2329]">Under 1 hour</span>
              </div>

              <button
                onClick={() => router.push("/nearby-deals/store")}
                className="mt-4 h-11 w-full rounded-[8px] border border-[#e8b038] bg-[#f7ebcf] text-[14px] font-semibold text-[#8f6515]"
              >
                View Store <ChevronRight size={14} className="ml-1 inline" />
              </button>
            </div>
          </aside>
        </section>

        <section className="mt-12 border-t border-[#d7dbe1] pt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[32px] font-bold text-[#1f2329]">Recommended for you</h2>
            <button className="text-[13px] font-semibold text-[#5368e3]">Browse all deals</button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {recommended.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-[10px] border border-[#d8dce3] bg-white">
                <div className="relative h-[110px]">
                  <Image src={item.img} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-[15px] font-bold text-[#1f2329]">{item.title}</p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#8a939e]">{item.shop}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[18px] font-bold text-[#5368e3]">{item.price}</span>
                    <span className="text-[12px] text-[#8a939e] line-through">{item.old}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
