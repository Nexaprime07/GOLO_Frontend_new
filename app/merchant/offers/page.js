"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download, Plus, Search, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const offerRows = [
  {
    image: "/images/deal2.avif",
    productName: "Diwali Dhamaka",
    postedDate: "1/ 04/ 2026",
    status: "Active",
    expiryDate: "10/ 04/ 2026",
  },
  {
    image: "/images/banner3.avif",
    productName: "Big Deal",
    postedDate: "1/ 04/ 2026",
    status: "Active",
    expiryDate: "9/ 04/ 2026",
  },
  {
    image: "/images/place2.avif",
    productName: "Big Day Sale",
    postedDate: "28/ 03/ 2026",
    status: "Expired",
    expiryDate: "1/ 04/ 2026",
  },
  {
    image: "/images/place2.avif",
    productName: "Sale Day",
    postedDate: "17/ 03/ 2026",
    status: "Expired",
    expiryDate: "29/ 03/ 2026",
  },
];

export default function MerchantOffersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/offers");
      return;
    }

    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#ececec]" />;
  }

  if (user.accountType !== "merchant") return null;

  return (
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <header className="sticky top-0 z-[9999] h-16 bg-[#efb02e] border-b border-[#d7a02a] px-8 lg:px-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-[180px]">
          <button type="button" onClick={() => router.push("/merchant/dashboard")} className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow font-bold" style={{ color: "#157a4f" }}>
              G
            </div>
            <span className="text-xl font-semibold tracking-wide text-[#157a4f]">GOLO</span>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-8 text-[12px] font-semibold text-[#5a4514]">
          <nav className="flex items-center gap-8">
            <button onClick={() => router.push("/merchant/dashboard")}>Overview</button>
            <button onClick={() => router.push("/merchant/orders")}>Orders</button>
            <button onClick={() => router.push("/merchant/products")}>Products</button>
            <button onClick={() => router.push("/merchant/offers")} className="relative h-16 text-[#157a4f]">
              Offers
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#157a4f]" />
            </button>
            <button onClick={() => router.push("/merchant/redeem")} className="relative h-16 hover:text-[#157a4f]">
              Redeem QR
            </button>
            <button onClick={() => router.push("/merchant/banners")}>Banners</button>
            <button onClick={() => router.push("/merchant/analytics")}>Analytics</button>
          </nav>

          <button type="button" onClick={() => router.push("/merchant/profile")} className="w-10 h-10 rounded-full bg-white shadow-md hover:scale-105 transition flex items-center justify-center" aria-label="Profile">
            <User size={18} style={{ color: "#157a4f" }} />
          </button>
        </div>
      </header>

      <main className="w-full px-8 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-[1400px] space-y-5">
          <section>
            <h1 className="text-[42px] font-semibold leading-none text-[#1e1e1e]">Offer List</h1>
            <p className="mt-3 text-[13px] text-[#6f6f6f] max-w-[500px]">
              Manage your offer catalog, monitor active promotions, and update expiry dates.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-[12px] border border-[#e2e2e2] bg-white px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#666]">Total Offers</p>
                <p className="text-[34px] font-semibold leading-none mt-1">36</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#f8eff2] text-[#f67da7] flex items-center justify-center text-[18px]">✦</div>
            </div>

            <div className="rounded-[12px] border border-[#e2e2e2] bg-white px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#666]">Active Offers</p>
                <p className="text-[34px] font-semibold leading-none mt-1">28</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#f4f4f1] text-[#2cb56e] flex items-center justify-center">⬡</div>
            </div>

            <div className="rounded-[12px] border border-[#e2e2e2] bg-white px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#666]">Offer Value</p>
                <p className="text-[34px] font-semibold leading-none mt-1">₹45,210</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#f4f4f1] text-[#efb02e] flex items-center justify-center text-[20px]">₹</div>
            </div>
          </section>

          <section className="rounded-[12px] border border-[#e5e5e5] bg-[#f9f9f9] p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full max-w-[620px]">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4a4a4]" />
                <input
                  className="h-9 w-full rounded-[8px] border border-[#e2e2e2] bg-white pl-8 pr-3 text-[12px] outline-none"
                  placeholder="Search by offer name"
                />
              </div>

              <div className="flex items-center gap-2">
                <button className="h-9 rounded-[8px] border border-[#e2e2e2] bg-white px-4 text-[11px] text-[#666] inline-flex items-center gap-1.5">
                  <Download size={12} /> Export CSV
                </button>
                <button onClick={() => router.push("/merchant/add-new-listing")} className="h-9 rounded-[8px] bg-[#2f9e58] px-4 text-[11px] font-semibold text-white inline-flex items-center gap-1.5">
                  <Plus size={12} /> Add New Offer
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-[10px] border border-[#ececec] bg-white">
              <table className="w-full text-[12px]">
                <thead className="bg-[#f2f3f5] text-[#666]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Image</th>
                    <th className="px-4 py-3 text-left font-semibold">Product Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Posted Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Expiry Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offerRows.map((row) => (
                    <tr key={row.productName} className="border-t border-[#f0f0f0]">
                      <td className="px-4 py-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden border border-[#ececec]">
                          <Image src={row.image} alt={row.productName} width={32} height={32} className="h-full w-full object-cover" />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#2a2a2a]">{row.productName}</td>
                      <td className={row.status === "Expired" ? "px-4 py-3 text-[#ef4d4d]" : "px-4 py-3 text-[#2c2c2c]"}>{row.postedDate}</td>
                      <td className="px-4 py-3">
                        {row.status === "Active" ? (
                          <span className="inline-flex rounded-full bg-[#e7f7ec] px-2 py-0.5 text-[10px] font-semibold text-[#2f9e58]">Active</span>
                        ) : (
                          <span className="inline-flex rounded-full bg-[#ef4d4d] px-2 py-0.5 text-[10px] font-semibold text-white">Expired</span>
                        )}
                      </td>
                      <td className={row.status === "Expired" ? "px-4 py-3 text-[#ef4d4d]" : "px-4 py-3 text-[#2c2c2c]"}>{row.expiryDate}</td>
                      <td className="px-4 py-3 text-[11px]">
                        <button className="text-[#f0aa19] font-semibold">View 👁</button>
                        <span className="mx-2 text-[#cfcfcf]">/</span>
                        <button className="text-[#ef4d4d] font-semibold">Delete 🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-[#d6d9df] px-6 py-4 text-[12px] text-[#565656]">Showing 5 of 97 offers</div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-[#f0b330] text-[#1b1b1b] px-4 lg:px-8 py-7 mt-6">
        <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
          <div className="max-w-[240px]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center font-bold text-[#157a4f]">G</div>
              <span className="text-[18px] font-semibold text-[#157a4f]">GOLO</span>
            </div>
            <p className="text-[10px] leading-[1.35] text-[#fff8de] max-w-[150px]">
              The all-in-one management platform for modern businesses. Empowering growth through analytics and intuitive product management.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-14 lg:gap-20 text-[10px] text-[#6b520f]">
            <div>
              <p className="font-semibold text-[#1b1b1b] mb-3">Links</p>
              <ul className="space-y-2">
                <li>Overview</li>
                <li>Inventory</li>
                <li>Posts</li>
                <li>Profile</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#1b1b1b] mb-3">&nbsp;</p>
              <ul className="space-y-2">
                <li>Analytics</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#1b1b1b] mb-3">Support</p>
              <ul className="space-y-2">
                <li>Help Center</li>
                <li>Security</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 mt-auto lg:pb-2 text-[#1877f2]">
            <span className="h-5 w-5 rounded-full bg-[#f3ba3b] flex items-center justify-center text-[#1877f2] text-[10px] font-bold">f</span>
            <span className="h-5 w-5 rounded-[2px] bg-[#f3ba3b] flex items-center justify-center text-[#0a66c2] text-[9px] font-bold">in</span>
            <span className="h-5 w-5 rounded-full bg-[#f3ba3b] flex items-center justify-center text-[#e1306c] text-[10px] font-bold">ig</span>
            <span className="h-5 w-5 rounded-[2px] bg-[#f3ba3b] flex items-center justify-center text-[#ff0000] text-[10px] font-bold">▶</span>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto mt-6 flex items-center justify-between text-[9px] text-[#5f4710]">
          <p>© 2026 GOLO Dashboard. All rights reserved.</p>
          <p>Made with ♥ by V</p>
        </div>
      </footer>
    </div>
  );
}
