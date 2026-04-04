"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircleAlert, Clock3, Globe, MapPin, Phone, Star } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const activeDeals = [
  {
    title: "90-Minute Signature Massage Package",
    description: "Indulge in pure relaxation with essential oils and hot stones. Includes deep tissue work and herbal tea.",
    price: "Rs.150",
    oldPrice: "Rs.90.00",
    badge: "44% OFF",
    image: "/images/place2.avif",
  },
  {
    title: "Aromatherapy & Facial Glow",
    description: "Rejuvenate your skin with our organic facial treatment and a 30-min aromatherapy session.",
    price: "Rs.120",
    oldPrice: "Rs.200.00",
    badge: "40% OFF",
    image: "/images/deal3.jpg",
  },
];

const services = [
  { title: "Deep Tissue Massage", subtitle: "60 min  -  Intense muscle tension release", price: "Rs.80" },
  { title: "Swedish Relaxation", subtitle: "60 min  -  Gentle strokes for circulation", price: "Rs.70" },
  { title: "Hot Stone Therapy", subtitle: "45 min  -  Warming basalt stones", price: "Rs.95" },
];

const sideServices = [
  { title: "Herbal Detox Tea", sub: "Organic blend  •  Rs.15", image: "/images/deal2.jpg" },
  { title: "Lavender Essential Oil", sub: "Pure extract  •  Rs.25", image: "/images/deal3.jpg" },
];

export default function NearbyStorePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <div className="mx-auto max-w-[1260px] px-6 pb-14 pt-5">
        <p className="text-[11px] text-[#7a7a7a]">Deals <span className="mx-1">›</span> Wellness <span className="mx-1">›</span> <span className="font-medium">Azure Wellness & Spa</span></p>

        <h1 className="mt-3 text-[52px] font-bold leading-none text-[#1f2329] tracking-[-0.02em]">Azure Wellness & Spa</h1>
        <p className="mt-2 text-[15px] text-[#67707b]">Premier holistic healing and professional care sanctuary in Manhattan.</p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-[#4e5965]">
          <span className="font-semibold text-[#f2b632]">★★★★★</span>
          <span><span className="font-semibold text-[#1f2329]">4.9</span> (1,240 Reviews)</span>
          <span className="text-[#9ca3ad]">|</span>
          <span>$$$  •  Day Spa  •  <span className="font-semibold text-[#0f8a52]">1.2 miles away</span></span>
        </div>

        <section className="mt-5 grid gap-4 lg:grid-cols-[1.72fr_0.78fr]">
          <div className="overflow-hidden rounded-[12px] border border-[#d8dce3] bg-white">
            <div className="relative">
              <Image src="/images/place2.avif" alt="Azure Wellness" width={1000} height={620} className="h-[380px] w-full object-cover" />
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f2b632]" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
              </div>
            </div>
          </div>

          <aside className="rounded-[12px] border border-[#d8dce3] bg-white p-4">
            <h2 className="text-[27px] font-bold leading-none text-[#1f2329]">Ratings & Reviews</h2>
            <div className="mt-4 flex items-start gap-4 border-b border-[#e5e8ec] pb-4">
              <div>
                <p className="text-[56px] font-bold leading-none text-[#1f2329]">4.9</p>
                <p className="mt-1 text-[12px] text-[#f2b632]">★★★★★</p>
                <p className="mt-1 text-[10px] text-[#7a828d]">1.2k reviews</p>
              </div>
              <div className="min-w-0 flex-1 space-y-1.5 pt-1 text-[10px] text-[#7a828d]">
                {["5", "4", "3", "2", "1"].map((s, idx) => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="w-3">{s}★</span>
                    <div className="h-1.5 flex-1 rounded bg-[#e7eaee]">
                      <div className={`h-1.5 rounded bg-[#f1c232] ${idx === 0 ? "w-[80%]" : idx === 1 ? "w-[30%]" : "w-[12%]"}`} />
                    </div>
                    <span className="w-5 text-right">{idx === 0 ? "1k" : idx === 1 ? "190" : "150"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-3 text-[12px] text-[#5f6974]">
              <p><Clock3 size={13} className="mr-2 inline text-[#0f8a52]" /> Open Now <span className="ml-1 text-[#7a828d]">09:00 AM  -  09:00 PM</span></p>
              <p><MapPin size={13} className="mr-2 inline text-[#0f8a52]" /> 122 Blue Avenue, Suite 400, Manhattan, NY 10012</p>
              <p><Phone size={13} className="mr-2 inline text-[#0f8a52]" /> +1 (212) 555-0198</p>
              <p><Globe size={13} className="mr-2 inline text-[#0f8a52]" /> www.azurewellness.com</p>
            </div>
          </aside>
        </section>

        <section className="mt-6 grid items-start gap-4 lg:grid-cols-[1.72fr_0.78fr]">
          <div className="space-y-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[30px] font-bold text-[#1f2329]">Active Deals</h2>
              <button className="text-[12px] font-semibold text-[#0f8a52]">View all deals</button>
            </div>

            <div className="space-y-3">
              {activeDeals.map((deal, idx) => (
                <div key={deal.title} className="flex gap-3 rounded-[12px] border border-[#d8dce3] bg-white p-3">
                  <div className="relative h-[98px] w-[148px] overflow-hidden rounded-[8px] border border-[#e2e6eb]">
                    <Image src={deal.image} alt={deal.title} fill className="object-cover" />
                    {idx === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#fd4f91] px-2 py-0.5 text-[9px] font-bold text-white">Limited Time</span>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <p className="text-[16px] font-bold leading-tight text-[#1f2329]">{deal.title}</p>
                      <p className="mt-1 text-[11px] leading-4 text-[#6c7581]">{deal.description}</p>
                    </div>

                    <div className="mt-2 flex items-end justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[27px] font-bold leading-none text-[#e7a91d]">{deal.price}</span>
                        <span className="text-[10px] font-semibold text-[#ea6f6f] line-through">{deal.oldPrice}</span>
                        <span className="rounded-full bg-[#efbe51] px-2 py-0.5 text-[9px] font-bold text-[#402800]">{deal.badge}</span>
                      </div>
                      <button
                        onClick={() => router.push("/nearby-deals/deal")}
                        className="h-8 rounded-[8px] bg-[#1e9a5c] px-3 text-[11px] font-semibold text-white hover:bg-[#187f4c]"
                      >
                        View Deal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <section className="mt-1">
              <h2 className="text-[37px] font-bold text-[#1f2329]"><CircleAlert size={17} className="mr-2 inline" />About Azure Wellness & Spa</h2>
              <p className="mt-3 text-[14px] leading-7 text-[#626c77]">
                Experience the ultimate escape from daily stress with our Signature Wellness Package at Azure
                Wellness & Spa. This exclusive session is designed to revitalize both body and mind using a blend of
                traditional techniques and modern luxuries.
              </p>

              <div className="mt-4 grid gap-2 text-[14px] text-[#38414a] sm:grid-cols-2">
                <p>• Professional Therapists</p>
                <p>• Organic Products Only</p>
                <p>• Private Treatment Rooms</p>
                <p>• Award-winning Interior</p>
              </div>
            </section>

            <section>
              <h2 className="text-[37px] font-bold text-[#1f2329]">Service Menu Highlights</h2>
              <div className="mt-4 overflow-hidden rounded-[12px] border border-[#d8dce3] bg-white">
                {services.map((service, idx) => (
                  <div key={service.title} className={`${idx > 0 ? "border-t border-[#e5e8ec]" : ""} flex items-start justify-between px-4 py-3`}>
                    <div>
                      <p className="text-[15px] font-bold text-[#1f2329]">{service.title}</p>
                      <p className="mt-1 text-[12px] text-[#6c7581]">{service.subtitle}</p>
                    </div>
                    <p className="text-[20px] font-bold text-[#1f2329]">{service.price}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[37px] font-bold text-[#1f2329]">What people are saying</h2>
                <button className="h-7 w-20 rounded-[8px] border border-[#d8dce3] bg-[#f8f9fb]" />
              </div>

              <div className="rounded-[12px] border border-[#d8dce3] bg-white p-3">
                <div className="flex items-center justify-between rounded-[10px] border border-[#e4e8ed] bg-[#fafbfc] px-3 py-3">
                  <p className="text-[13px] text-[#7a828d]">Share your experience...</p>
                  <button className="h-9 rounded-full bg-[#1e9a5c] px-4 text-[12px] font-semibold text-white hover:bg-[#187f4c]">Write a Review</button>
                </div>

                <div className="mt-3 rounded-[10px] border border-[#e4e8ed] bg-white p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 overflow-hidden rounded-full border border-[#e2e6eb]">
                        <Image src="/images/hero.jpg" alt="Reviewer" width={36} height={36} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#1f2329]">Sarah Jenkins</p>
                        <p className="text-[11px] text-[#f2b632]">★★★★★</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#8a939e]">Oct 15, 2023</p>
                  </div>

                  <p className="mt-2 text-[12px] leading-6 text-[#66707b]">
                    Absolutely incredible experience! The deep tissue massage was exactly what I needed after a stressful week.
                    The hot stones felt divine, and the staff at Azure was so professional.
                  </p>
                </div>
              </div>

              <button className="mt-3 text-[12px] font-semibold text-[#1e9a5c]">See all 1,240 reviews <span className="ml-1">›</span></button>
            </section>
          </div>

          <aside className="space-y-4 pt-[47px] lg:sticky lg:top-24 self-start h-fit">
            <div className="rounded-[12px] border border-[#d8dce3] bg-white p-3">
              <p className="text-[12px] font-semibold text-[#5f6974]">Map Preview</p>
              <div className="mt-2 flex h-[150px] items-center justify-center rounded-[10px] border border-[#e2e6eb] bg-[#f7f8fa]">
                <div className="relative h-[108px] w-[108px] overflow-hidden rounded-full border border-[#d4d9df] shadow-sm">
                  <Image src="/images/banner3.avif" alt="Store map preview" fill className="object-cover" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1.5 shadow">
                    <MapPin size={13} className="text-[#0f8a52]" />
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[21px] font-bold text-[#1f2329]">Popular Services</h3>
              <div className="mt-3 space-y-2">
                {sideServices.map((item) => (
                  <div key={item.title} className="flex items-center gap-3 rounded-[8px] border border-[#d8dce3] bg-white p-2">
                    <div className="h-12 w-12 overflow-hidden rounded-[6px] border border-[#e2e6eb]">
                      <Image src={item.image} alt={item.title} width={48} height={48} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-[#1f2329]">{item.title}</p>
                      <p className="mt-1 text-[11px] text-[#6c7581]">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>

      <Footer />
    </main>
  );
}
