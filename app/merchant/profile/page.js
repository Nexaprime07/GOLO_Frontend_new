"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, User, Settings, HelpCircle, Heart, LogOut, Edit3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function MerchantProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");

  const handleMerchantLogout = async () => {
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/profile");
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
      {/* Header */}
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
            <button className="relative h-16 text-[#157a4f]">
              Profile
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#157a4f]" />
            </button>
            <button onClick={() => router.push("/merchant/analytics")}>Analytics</button>
          </nav>

          <button type="button" onClick={handleMerchantLogout} className="w-10 h-10 rounded-full bg-white shadow-md hover:scale-105 transition flex items-center justify-center" aria-label="Logout">
            <User size={18} style={{ color: "#157a4f" }} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-8 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
          {/* Left Sidebar */}
          <aside className="rounded-[12px] border border-[#e5e5e5] bg-white h-fit p-6">
            {/* Store Name */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#ececec]">
              <div className="w-10 h-10 rounded-full bg-[#f0aa19] flex items-center justify-center">
                <span className="text-[14px] font-bold text-white">FF</span>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#1e1e1e]">Fashion Fusion</p>
                <p className="text-[11px] text-[#999]">Your Store</p>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2">
              {/* Profile Settings */}
              <button
                onClick={() => setActiveSection("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-[12px] font-semibold transition ${
                  activeSection === "profile"
                    ? "bg-[#f0f8ff] text-[#157a4f] border-l-2 border-[#157a4f]"
                    : "text-[#666] hover:bg-[#f9f9f9]"
                }`}
              >
                <Settings size={16} />
                Profile Settings
              </button>

              {/* Loyalty Rewards */}
              <button
                onClick={() => setActiveSection("rewards")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-[12px] font-semibold transition ${
                  activeSection === "rewards"
                    ? "bg-[#f0f8ff] text-[#157a4f] border-l-2 border-[#157a4f]"
                    : "text-[#666] hover:bg-[#f9f9f9]"
                }`}
              >
                <Heart size={16} />
                Loyalty Rewards
              </button>

              {/* Help */}
              <button
                onClick={() => setActiveSection("help")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-[12px] font-semibold transition ${
                  activeSection === "help"
                    ? "bg-[#f0f8ff] text-[#157a4f] border-l-2 border-[#157a4f]"
                    : "text-[#666] hover:bg-[#f9f9f9]"
                }`}
              >
                <HelpCircle size={16} />
                Help
              </button>

              {/* Settings */}
              <button
                onClick={() => setActiveSection("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-[12px] font-semibold transition ${
                  activeSection === "settings"
                    ? "bg-[#f0f8ff] text-[#157a4f] border-l-2 border-[#157a4f]"
                    : "text-[#666] hover:bg-[#f9f9f9]"
                }`}
              >
                <Settings size={16} />
                Settings
              </button>

              {/* Logout */}
              <button
                onClick={handleMerchantLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-[12px] font-semibold text-[#ef4d4d] hover:bg-[#fef0f0] transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </nav>
          </aside>

          {/* Right Content */}
          <div className="space-y-6">
            {/* Merchant Profile Section */}
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-6">
              <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#ececec]">
                <h2 className="text-[18px] font-semibold text-[#1e1e1e]">Merchant Profile</h2>
                <button className="h-8 px-4 rounded-[6px] bg-[#157a4f] text-white flex items-center gap-2 text-[12px] font-semibold hover:bg-[#0e5a38] transition">
                  <Edit3 size={14} />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Profile Info */}
                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="text-[12px] font-semibold text-[#666] block mb-2">Username</label>
                    <div className="h-10 px-3 rounded-[8px] border border-[#e2e2e2] bg-[#f9f9f9] flex items-center">
                      <p className="text-[13px] text-[#333]">Mahesh Pathi</p>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-[12px] font-semibold text-[#666] block mb-2">Phone Number</label>
                    <div className="h-10 px-3 rounded-[8px] border border-[#e2e2e2] bg-[#f9f9f9] flex items-center">
                      <p className="text-[13px] text-[#333]">+91 XXXXXXXXX</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[12px] font-semibold text-[#666] block mb-2">Email</label>
                    <div className="h-10 px-3 rounded-[8px] border border-[#e2e2e2] bg-[#f9f9f9] flex items-center">
                      <p className="text-[13px] text-[#333]">abc@gmail.com</p>
                    </div>
                  </div>
                </div>

                {/* Right: Profile Picture */}
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32 rounded-full border-4 border-[#f0aa19] overflow-hidden bg-white shadow-lg">
                    <Image
                      src="/images/deal2.avif"
                      alt="Profile"
                      fill
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Details Section */}
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-6">
              <h2 className="text-[18px] font-semibold text-[#1e1e1e] mb-6 pb-4 border-b border-[#ececec]">Shop Details</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Shop Info */}
                <div className="space-y-4">
                  {/* Shop Name */}
                  <div>
                    <label className="text-[12px] font-semibold text-[#666] block mb-2">Shop Name</label>
                    <div className="h-10 px-3 rounded-[8px] border border-[#e2e2e2] bg-[#f9f9f9] flex items-center">
                      <p className="text-[13px] text-[#333]">Fashion Fusion</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-[12px] font-semibold text-[#666] block mb-2">Location</label>
                    <div className="h-10 px-3 rounded-[8px] border border-[#e2e2e2] bg-[#f9f9f9] flex items-center">
                      <p className="text-[13px] text-[#333]">Rajarangpuri, Kothapour (416003)</p>
                    </div>
                  </div>
                </div>

                {/* Right: Shop Image */}
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32 rounded-full border-4 border-[#f0aa19] overflow-hidden bg-white shadow-lg">
                    <Image
                      src="/images/place2.avif"
                      alt="Shop"
                      fill
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[#f0aa19] py-8 px-8 lg:px-10 text-[#5a4514]">
        <div className="mx-auto max-w-[1400px] flex items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center font-bold" style={{ color: "#157a4f" }}>
                G
              </div>
              <span className="text-lg font-semibold">GOLO</span>
            </div>
            <p className="text-[12px] max-w-[250px] leading-relaxed">
              The all-in-one management platforms for modern businesses. Empowering growth through analytics and innovative product management.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-12 text-[12px]">
            <div>
              <p className="font-semibold mb-3">Links</p>
              <ul className="space-y-1.5">
                <li><button className="hover:underline">Overview</button></li>
                <li><button className="hover:underline">Inventory</button></li>
                <li><button className="hover:underline">Posts</button></li>
                <li><button className="hover:underline">Profile</button></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3">Support</p>
              <ul className="space-y-1.5">
                <li><button className="hover:underline">Analytics</button></li>
                <li><button className="hover:underline">Contact</button></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3">Support</p>
              <ul className="space-y-1.5">
                <li><button className="hover:underline">Help Center</button></li>
                <li><button className="hover:underline">Security</button></li>
                <li><button className="hover:underline">Terms of Service</button></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[#e2a112] pt-4 text-[11px] flex items-center justify-between">
          <p>© 2024 GOLO Dashboard. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Made with ♥️ Vaily</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
