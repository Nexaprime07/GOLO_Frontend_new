"use client";

import { useRouter } from "next/navigation";
import { Save, Bell, CreditCard, Store, Lock, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRoleProtection, LoadingScreen } from "../../components/RoleBasedRedirect";
import { useState, useEffect } from "react";
import { getMerchantProfile } from "../../lib/api";

const topTabs = ["Profile Settings", "Loyalty Rewards", "Help", "Settings", "Logout"];

export default function MerchantSettingsPage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { isLoading: roleLoading, isAuthorized } = useRoleProtection("merchant");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [settings, setSettings] = useState({
    storeName: "",
    storeEmail: "",
    storePhone: "",
    orderNotifications: true,
    gstNumber: "",
    billingAddress: "",
  });

  // Fetch merchant profile and auto-fill form
  useEffect(() => {
    const fetchMerchantProfile = async () => {
      try {
        setPageLoading(true);
        const response = await getMerchantProfile();
        const profile = response?.data || {};

        setSettings({
          storeName: profile.storeName || user?.name || "My Store",
          storeEmail: profile.storeEmail || user?.email || "merchant@example.com",
          storePhone: profile.contactNumber || user?.phone || "+91 98765 43210",
          orderNotifications: true,
          gstNumber: profile.gstNumber || "",
          billingAddress: profile.billingAddress || "",
        });
      } catch (err) {
        // Use fallback values
        setSettings({
          storeName: user?.name || "My Store",
          storeEmail: user?.email || "merchant@example.com",
          storePhone: user?.phone || "+91 98765 43210",
          orderNotifications: true,
          gstNumber: "",
          billingAddress: "",
        });
      } finally {
        setPageLoading(false);
      }
    };

    if (user && user.accountType === "merchant") {
      fetchMerchantProfile();
    }
  }, [user]);

  const handleMerchantLogout = async () => {
    await logout();
    router.push("/login");
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    await handleMerchantLogout();
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await updateProfile({
        shopName: settings.storeName,
        phone: settings.storePhone,
      });
      if (response?.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(null), 2000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  if (roleLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-[9999] h-16 bg-[#efb02e] border-b border-[#d7a02a] px-8 lg:px-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-[180px]">
          <button
            type="button"
            onClick={() => router.push("/merchant/dashboard")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div
              className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow font-bold"
              style={{ color: "#157a4f" }}
            >
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
            <button onClick={() => router.push("/merchant/offers")}>Offers</button>
            <button onClick={() => router.push("/merchant/banners")}>Banners</button>
            <button onClick={() => router.push("/merchant/analytics")}>Analytics</button>
          </nav>

          <button
            type="button"
            onClick={() => router.push("/merchant/profile")}
            className="w-10 h-10 rounded-full bg-white shadow-md hover:scale-105 transition flex items-center justify-center"
          >
            <User size={18} style={{ color: "#157a4f" }} />
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="w-full px-8 lg:px-10 bg-white border-b border-[#e5e5e5]">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="flex items-center justify-end gap-8 text-[12px] font-semibold py-6 flex-wrap">
            {topTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  if (tab === "Profile Settings") {
                    router.push("/merchant/profile");
                  } else if (tab === "Loyalty Rewards") {
                    router.push("/merchant/profile");
                  } else if (tab === "Help") {
                    router.push("/merchant/help");
                  } else if (tab === "Logout") {
                    setShowLogoutConfirm(true);
                  } else {
                    router.push("/merchant/settings");
                  }
                }}
                className={`relative pb-1 transition ${
                  tab === "Settings"
                    ? "text-[#157a4f]"
                    : tab === "Logout"
                      ? "text-[#ef4444]"
                      : "text-[#111]"
                }`}
              >
                <span>{tab}</span>
                {tab === "Settings" && <span className="absolute left-0 right-0 -bottom-[5px] h-[2px] bg-[#157a4f]" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-8 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-[1400px]">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-[26px] font-bold text-[#1f1f1f] mb-2">Settings</h1>
            <p className="text-[13px] text-[#666]">Manage your store and account preferences</p>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="mb-4 p-3 bg-[#dcfce7] border border-[#86efac] rounded-[8px]">
              <p className="text-[12px] font-semibold text-[#166534]">✓ Settings saved successfully</p>
            </div>
          )}

          <div className="space-y-5">
            {/* Store Information Section */}
            <div className="bg-white rounded-[8px] border border-[#d5d5d5] p-6">
              <div className="flex items-center gap-3 mb-5">
                <Store size={18} style={{ color: "#157a4f" }} />
                <h2 className="text-[16px] font-bold text-[#1f1f1f]">Store Information</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1f1f1f] mb-2">Store Name</label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => handleChange("storeName", e.target.value)}
                    className="w-full px-3 py-2 border border-[#d5d5d5] rounded-[6px] bg-white text-[12px] focus:outline-none focus:border-[#157a4f]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1f1f1f] mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => handleChange("storeEmail", e.target.value)}
                    className="w-full px-3 py-2 border border-[#d5d5d5] rounded-[6px] bg-white text-[12px] focus:outline-none focus:border-[#157a4f]"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-[11px] font-semibold text-[#1f1f1f] mb-2">Phone</label>
                  <input
                    type="tel"
                    value={settings.storePhone}
                    onChange={(e) => handleChange("storePhone", e.target.value)}
                    className="w-full px-3 py-2 border border-[#d5d5d5] rounded-[6px] bg-white text-[12px] focus:outline-none focus:border-[#157a4f]"
                  />
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white rounded-[8px] border border-[#d5d5d5] p-6">
              <div className="flex items-center gap-3 mb-5">
                <Bell size={18} style={{ color: "#157a4f" }} />
                <h2 className="text-[16px] font-bold text-[#1f1f1f]">Notifications</h2>
              </div>
              <div className="space-y-3">
                {[
                  { key: "orderNotifications", label: "Order Alerts", desc: "Get notified when a customer claims your offer" },
                ].map((notif) => (
                  <div key={notif.key} className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-[6px]">
                    <div>
                      <p className="text-[12px] font-semibold text-[#1f1f1f]">{notif.label}</p>
                      <p className="text-[11px] text-[#999] mt-0.5">{notif.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[notif.key]}
                        onChange={(e) => handleChange(notif.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#d5d5d5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-[#d5d5d5] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#157a4f]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-[8px] border border-[#d5d5d5] p-6">
              <div className="flex items-center gap-3 mb-5">
                <Lock size={18} style={{ color: "#157a4f" }} />
                <h2 className="text-[16px] font-bold text-[#1f1f1f]">Change Password</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1f1f1f] mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 border border-[#d5d5d5] rounded-[6px] bg-white text-[12px] focus:outline-none focus:border-[#157a4f]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1f1f1f] mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 border border-[#d5d5d5] rounded-[6px] bg-white text-[12px] focus:outline-none focus:border-[#157a4f]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1f1f1f] mb-2">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 border border-[#d5d5d5] rounded-[6px] bg-white text-[12px] focus:outline-none focus:border-[#157a4f]"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 bg-[#157a4f] text-white text-[12px] font-semibold rounded-[6px] hover:bg-[#1a6e44] transition"
              >
                <Save size={14} />
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[10000] bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-[420px] rounded-[14px] bg-white shadow-2xl border border-[#e5e5e5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#ececec]">
              <h3 className="text-[18px] font-semibold text-[#1b1b1b]">Confirm Logout</h3>
              <p className="mt-2 text-[13px] text-[#666]">Are you sure you want to log out of your merchant account?</p>
            </div>
            <div className="px-6 py-4 flex items-center justify-end gap-3 bg-[#fafafa]">
              <button type="button" onClick={() => setShowLogoutConfirm(false)} className="h-9 px-4 rounded-[8px] border border-[#cfd5dc] bg-white text-[12px] font-semibold text-[#555]">
                Cancel
              </button>
              <button type="button" onClick={confirmLogout} className="h-9 px-4 rounded-[8px] bg-[#ef4d4d] text-white text-[12px] font-semibold">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
