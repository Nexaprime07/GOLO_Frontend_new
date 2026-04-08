"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Download, Plus, Search, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const products = [
  { name: "Shirts", price: "₹240", status: "In Stock", stock: "45 units", stockTone: "normal", image: "/images/deal2.avif" },
  { name: "Pants", price: "₹299", status: "Low Stock", stock: "8 units", stockTone: "normal", image: "/images/banner3.avif" },
  { name: "Skirts", price: "₹550", status: "Out of Stock", stock: "0 units", stockTone: "danger", image: "/images/place2.avif" },
  { name: "Dress", price: "₹1000", status: "In Stock", stock: "22 units", stockTone: "normal", image: "/images/deal2.avif" },
  { name: "T - Shirt", price: "₹320", status: "In Stock", stock: "124 units", stockTone: "normal", image: "/images/banner3.avif" },
];

export default function MerchantProductsPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleMerchantLogout = async () => {
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/products");
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
            <button onClick={() => router.push("/merchant/profile")}>Profile</button>
            <button onClick={() => router.push("/merchant/analytics")}>Analytics</button>
          </nav>

          <button type="button" onClick={handleMerchantLogout} className="w-10 h-10 rounded-full bg-white shadow-md hover:scale-105 transition flex items-center justify-center" aria-label="Logout">
            <User size={18} style={{ color: "#157a4f" }} />
          </button>
        </div>
      </header>

      <main className="w-full px-8 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-[1400px] space-y-5">
          <section>
            <h1 className="text-[42px] font-semibold leading-none text-[#1e1e1e]">Product Inventory</h1>
            <p className="mt-3 text-[13px] text-[#6f6f6f] max-w-[500px]">
              Manage your product catalog, monitor stock levels, and update pricing.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-[12px] border border-[#e2e2e2] bg-white px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#666]">Total Products</p>
                <p className="text-[34px] font-semibold leading-none mt-1">412</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#f4f4f1] text-[#2cb56e] flex items-center justify-center">⬡</div>
            </div>

            <div className="rounded-[12px] border border-[#e2e2e2] bg-white px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#666]">Inventory Value</p>
                <p className="text-[34px] font-semibold leading-none mt-1">₹45,210</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#f4f4f1] text-[#e2a112] flex items-center justify-center text-[20px]">₹</div>
            </div>

            <div className="rounded-[12px] border border-[#e2e2e2] bg-white px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#666]">Total Offers</p>
                <p className="text-[34px] font-semibold leading-none mt-1">36</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#f7eef0] text-[#f27f9f] flex items-center justify-center">✦</div>
            </div>
          </section>

          <section className="rounded-[12px] border border-[#e5e5e5] bg-[#f9f9f9] p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full max-w-[620px]">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4a4a4]" />
                <input
                  className="h-9 w-full rounded-[8px] border border-[#e2e2e2] bg-white pl-8 pr-3 text-[12px] outline-none"
                  placeholder="Search by product name"
                />
              </div>

              <div className="flex items-center gap-2">
                <button className="h-9 rounded-[8px] border border-[#e2e2e2] bg-white px-4 text-[11px] text-[#666] inline-flex items-center gap-1.5">
                  <Download size={12} /> Export CSV
                </button>
                <button onClick={() => router.push("/merchant/products/add")} className="h-9 rounded-[8px] bg-[#2f9e58] px-4 text-[11px] font-semibold text-white inline-flex items-center gap-1.5">
                  <Plus size={12} /> Add New Product
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-[10px] border border-[#ececec] bg-white">
              <table className="w-full text-[12px]">
                <thead className="bg-[#f2f3f5] text-[#666]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Image</th>
                    <th className="px-4 py-3 text-left font-semibold">Product Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Price</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Stock</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.name} className="border-t border-[#f0f0f0]">
                      <td className="px-4 py-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden border border-[#ececec]">
                          <Image src={item.image} alt={item.name} width={32} height={32} className="h-full w-full object-cover" />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#2a2a2a]">{item.name}</td>
                      <td className="px-4 py-3 font-semibold">{item.price}</td>
                      <td className="px-4 py-3">
                        {item.status === "Out of Stock" ? (
                          <span className="inline-flex rounded-full bg-[#ef4d4d] px-2 py-0.5 text-[10px] font-semibold text-white">Out of Stock</span>
                        ) : (
                          <span>{item.status}</span>
                        )}
                      </td>
                      <td className={`px-4 py-3 ${item.stockTone === "danger" ? "text-[#ef4d4d]" : ""}`}>{item.stock}</td>
                      <td className="px-4 py-3 text-[11px]">
                        <button
                          onClick={() => router.push("/merchant/products/details")}
                          className="text-[#f0aa19] font-semibold"
                        >
                          View 👁
                        </button>
                        <span className="mx-2 text-[#cfcfcf]">/</span>
                        <button className="text-[#ef4d4d] font-semibold">Delete 🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between border-t border-[#ececec] bg-[#f2f3f5] px-4 py-3 text-[11px] text-[#666]">
                <p>Showing 5 of 97 products</p>
                <div className="flex items-center gap-1">
                  <button className="h-7 rounded-[6px] border border-[#e1e1e1] bg-white px-3 text-[#b3b3b3]">Previous</button>
                  <button className="h-7 rounded-[6px] border border-[#7fc69a] bg-[#eefaf2] px-3 text-[#2f9e58]">Next</button>
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
