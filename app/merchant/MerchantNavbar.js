"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

const navItems = [
  { key: "dashboard", label: "Overview", href: "/merchant/dashboard" },
  { key: "orders", label: "Orders", href: "/merchant/orders" },
  { key: "products", label: "Products", href: "/merchant/products" },
  { key: "offers", label: "Offers", href: "/merchant/offers" },
  { key: "redeem", label: "Redeem QR", href: "/merchant/redeem" },
  { key: "banners", label: "Banners", href: "/merchant/banners" },
  { key: "analytics", label: "Analytics", href: "/merchant/analytics" },
];

export default function MerchantNavbar({ activeKey = "dashboard" }) {
  const router = useRouter();

  return (
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
          {navItems.map((item) => {
            const isActive = item.key === activeKey;
            const isRedeem = item.key === "redeem";

            return (
              <button
                key={item.key}
                onClick={() => router.push(item.href)}
                className={
                  isActive
                    ? "relative h-16 text-[#157a4f]"
                    : isRedeem
                      ? "relative h-16 hover:text-[#157a4f]"
                      : "hover:text-[#157a4f]"
                }
              >
                {item.label}
                {isActive && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#157a4f]" />}
              </button>
            );
          })}
        </nav>

        <button type="button" onClick={() => router.push("/merchant/profile")} className="w-10 h-10 rounded-full bg-white shadow-md hover:scale-105 transition flex items-center justify-center" aria-label="Profile">
          <User size={18} style={{ color: "#157a4f" }} />
        </button>
      </div>
    </header>
  );
}