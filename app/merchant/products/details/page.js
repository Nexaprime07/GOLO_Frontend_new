"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Pencil, User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function MerchantProductDetailsPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleMerchantLogout = async () => {
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/products/details");
      return;
    }

    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#efefef]" />;
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
            <button onClick={() => router.push("/merchant/products")} className="relative h-16 text-[#157a4f]">
              Products
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#157a4f]" />
            </button>
            <button>Profile</button>
            <button onClick={() => router.push("/merchant/analytics")}>Analytics</button>
          </nav>

          <button type="button" onClick={handleMerchantLogout} className="w-10 h-10 rounded-full bg-white shadow-md hover:scale-105 transition flex items-center justify-center" aria-label="Logout">
            <User size={18} style={{ color: "#157a4f" }} />
          </button>
        </div>
      </header>

      <main className="w-full px-8 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-[1400px] space-y-4">
          <button
            onClick={() => router.push("/merchant/products")}
            className="text-[13px] text-[#5a5a5a] inline-flex items-center gap-2"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#a9a9a9] text-[10px]">‹</span>
            Back to Products
          </button>

          <section className="rounded-[12px] border border-[#dddddd] bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-[35px] font-semibold leading-none">Product Details</h1>
              <button className="h-9 rounded-[8px] bg-[#79c68f] px-5 text-[13px] font-semibold text-[#19462a] inline-flex items-center gap-1.5">
                Edit <Pencil size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <p className="text-[14px] font-semibold mb-2">Name</p>
                  <div className="h-9 rounded-[8px] bg-[#f0f1f3] px-3 flex items-center text-[12px] text-[#4b4b4b]">Printed Shirt</div>
                </div>

                <div>
                  <p className="text-[14px] font-semibold mb-2">Category</p>
                  <div className="h-9 rounded-[8px] bg-[#f0f1f3] px-3 flex items-center text-[12px] text-[#4b4b4b]">Clothing</div>
                </div>

                <div>
                  <p className="text-[14px] font-semibold mb-2">Image Uploaded</p>
                  <div className="rounded-[12px] border border-[#e5e5e5] bg-[#fbfbfb] p-3">
                    <div className="relative overflow-hidden rounded-[10px] border border-[#e5e5e5] bg-[#f4f4f4] h-[320px]">
                      <Image src="/images/deal2.avif" alt="Printed shirt" fill className="object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[14px] font-semibold mb-2">Price</p>
                  <div className="h-9 rounded-[8px] bg-[#f0f1f3] px-3 flex items-center text-[12px] text-[#4b4b4b]">₹ 500</div>
                </div>

                <div>
                  <p className="text-[14px] font-semibold mb-2">Stock Quantity</p>
                  <div className="h-9 rounded-[8px] bg-[#f0f1f3] px-3 flex items-center text-[12px] text-[#4b4b4b]">100</div>
                </div>

                <div>
                  <p className="text-[14px] font-semibold mb-2">Description</p>
                  <div className="rounded-[10px] bg-[#f0f1f3] p-3 text-[12px] leading-6 text-[#4b4b4b]">
                    A stylish and comfortable shirt crafted from high-quality, breathable fabric that feels soft against the skin.
                    Designed with a modern fit, it offers a perfect balance of elegance. The neatly stitched seams, and refined collar
                    makes it suitable for both casual outings and semi-formal occasions
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-6 bg-[#e8ad2f] border-t border-[#d49b22] text-[#2f2a1f]">
        <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-10 py-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-[3px] bg-[#0f7d49] text-white text-[26px] font-bold flex items-center justify-center leading-none">G</div>
              <span className="text-[34px] leading-none font-semibold text-[#0f7d49]">GOLO</span>
            </div>
            <p className="mt-3 text-[12px] max-w-[250px]">The all-in-one management platform for modern businesses. Empowering growth through analytics and intuitive product management.</p>
          </div>
          <div>
            <p className="text-[20px] font-bold">Links</p>
            <div className="mt-3 space-y-2 text-[13px]"><p>Overview</p><p>Inventory</p><p>Posts</p><p>Profile</p></div>
          </div>
          <div className="pt-8 md:pt-9 space-y-2 text-[13px]"><p>Analytics</p><p>Contact</p></div>
          <div>
            <p className="text-[20px] font-bold">Support</p>
            <div className="mt-3 space-y-2 text-[13px]"><p>Help Center</p><p>Security</p><p>Terms of Service</p></div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-10 py-3 border-t border-[#d49b22] flex items-center justify-between gap-3 text-[11px]"><p>© 2026 GOLO Dashboard. All rights reserved.</p></div>
      </footer>
    </div>
  );
}
