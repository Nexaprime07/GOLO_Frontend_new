"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Edit3, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRoleProtection, LoadingScreen } from "../../components/RoleBasedRedirect";
import LocationPicker from "../../components/LocationPicker";
import StoreLocationMap from "../../components/StoreLocationMap";
import { updateMerchantStoreLocation, getMerchantStoreLocation } from "../../lib/api";

const topTabs = ["Profile Settings", "Loyalty Rewards", "Help", "Settings", "Logout"];

const loyaltyRows = [
  { customer: "Amit Singh", offers: 16, points: 146, star: true },
  { customer: "Rakesh Patel", offers: 14, points: 102, star: true },
  { customer: "Amit Singh", offers: 10, points: 102, star: true },
  { customer: "Rakesh Patel", offers: 10, points: 95, star: false },
  { customer: "Amit Singh", offers: 6, points: 73, star: false },
  { customer: "Rakesh Patel", offers: 4, points: 50, star: false },
  { customer: "Amit Singh", offers: 2, points: 23, star: false },
];

export default function MerchantProfilePage() {
  return <MerchantProfilePageContent />;
}

function MerchantProfilePageContent() {
  // Check auth/role FIRST
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { isLoading: roleLoading, isAuthorized } = useRoleProtection("merchant");

  // Guard checks - early returns with minimal setup
  if (roleLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthorized) {
    return null;
  }

  if (loading || !user) {
    return <div className="min-h-screen bg-[#ececec]" />;
  }

  if (user.accountType !== "merchant") {
    return null;
  }

  // NOW safe to call rest of hooks since we know auth is valid
  return <MerchantProfileContent user={user} logout={logout} router={router} />;
}

function MerchantProfileContent({ user, logout, router }) {
  const [activeTab, setActiveTab] = useState("Profile Settings");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [formData, setFormData] = useState({
    username: "Mahesh Patil",
    phone: "+91 XXXXXXXXXX",
    email: "abc@gmail.com",
    shopName: "Fashion Fusion",
    location: "Rajarampuri, Kolhapur (416003)",
  });
  const [storeLocation, setStoreLocation] = useState({
    address: "Rajarampuri, Kolhapur (416003)",
    latitude: 16.8149,
    longitude: 73.8292,
  });

  // Load merchant store location from database on mount
  useEffect(() => {
    const loadStoreLocation = async () => {
      try {
        setIsLoadingLocation(true);
        const response = await getMerchantStoreLocation();
        if (response && response.data) {
          const { address, latitude, longitude } = response.data;
          setStoreLocation({
            address: address || "Rajarampuri, Kolhapur (416003)",
            latitude: latitude || 16.8149,
            longitude: longitude || 73.8292,
          });
        }
      } catch (error) {
        console.error("Error loading store location:", error);
        // Keep default location if API fails
      } finally {
        setIsLoadingLocation(false);
      }
    };

    loadStoreLocation();
  }, []);

  const handleMerchantLogout = async () => {
    await logout();
    router.push("/login");
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    await handleMerchantLogout();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDiscard = () => {
    setFormData({
      username: "Mahesh Patil",
      phone: "+91 XXXXXXXXXX",
      email: "abc@gmail.com",
      shopName: "Fashion Fusion",
      location: "Rajarampuri, Kolhapur (416003)",
    });
    setIsEditMode(false);
  };

  const handleSave = async () => {
    // Save location to backend
    if (storeLocation && storeLocation.latitude && storeLocation.longitude) {
      setIsSavingLocation(true);
      try {
        await updateMerchantStoreLocation({
          address: storeLocation.address,
          latitude: storeLocation.latitude,
          longitude: storeLocation.longitude,
        });
        setSaveMessage("Location saved successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      } catch (error) {
        console.error("Error saving location:", error);
        setSaveMessage("Failed to save location. Please try again.");
        setTimeout(() => setSaveMessage(""), 3000);
      } finally {
        setIsSavingLocation(false);
      }
    }
    setIsEditMode(false);
  };

  const handleLocationSelect = (location) => {
    setStoreLocation({
      address: location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setShowLocationPicker(false);
  };

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
            <button onClick={() => router.push("/merchant/offers")}>Offers</button>
            <button onClick={() => router.push("/merchant/banners")}>Banners</button>
            <button onClick={() => router.push("/merchant/analytics")}>Analytics</button>
          </nav>

          <button type="button" onClick={() => router.push("/merchant/profile")} className="w-10 h-10 rounded-full bg-white shadow-md hover:scale-105 transition flex items-center justify-center" aria-label="Profile">
            <User size={18} style={{ color: "#157a4f" }} />
          </button>
        </div>
      </header>

      <main className="w-full px-8 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="flex items-center justify-end gap-8 text-[12px] font-semibold mb-6 flex-wrap">
            {topTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  if (tab === "Help") {
                    router.push("/merchant/help");
                  } else if (tab === "Settings") {
                    router.push("/merchant/settings");
                  } else if (tab === "Logout") {
                    setShowLogoutConfirm(true);
                  } else {
                    setActiveTab(tab);
                  }
                }}
                className={`relative pb-1 transition ${
                  activeTab === tab
                    ? "text-[#157a4f]"
                    : tab === "Logout"
                      ? "text-[#ef4444]"
                      : "text-[#111]"
                }`}
              >
                <span>{tab}</span>
                {activeTab === tab && tab !== "Logout" && <span className="absolute left-0 right-0 -bottom-[5px] h-[2px] bg-[#157a4f]" />}
              </button>
            ))}
          </div>

          {activeTab === "Loyalty Rewards" ? (
            <div className="max-w-[1260px] mx-auto space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-[56px] rounded-[8px] border border-[#b8bdc6] bg-white px-4 flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-[#1f9b57]">Total Customers</p>
                  <p className="text-[30px] leading-none font-semibold text-[#1f1f1f]">228</p>
                </div>
                <div className="h-[56px] rounded-[8px] border border-[#b8bdc6] bg-white px-4 flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-[#f1a61b]">Reward Champs</p>
                  <p className="text-[30px] leading-none font-semibold text-[#1f1f1f]">3</p>
                </div>
                <div className="h-[56px] rounded-[8px] border border-[#b8bdc6] bg-white px-4 flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-[#323232]">Reward Points</p>
                  <p className="text-[30px] leading-none font-semibold text-[#1f1f1f]">100</p>
                </div>
              </div>

              <div className="rounded-[8px] border border-[#bfc3cb] bg-white overflow-hidden">
                <div className="px-6 py-4 text-[28px] leading-none font-semibold text-[#202020]">Loyalty Rewards</div>
                <div className="grid grid-cols-3 px-6 py-3 text-[13px] font-medium text-[#2c2c2c] border-b border-[#bfc3cb]">
                  <p>Active Customers</p>
                  <p className="text-center">Number of Offers Claimed</p>
                  <p className="text-right">Loyalty Rewards</p>
                </div>

                {loyaltyRows.map((row, index) => (
                  <div key={`${row.customer}-${index}`} className="grid grid-cols-3 px-6 py-3 text-[13px] text-[#2f2f2f] border-b border-[#bfc3cb] last:border-b-0">
                    <p className="pl-6">{row.customer}</p>
                    <p className="text-center">{row.offers}</p>
                    <p className="text-right pr-6">
                      {row.star ? <span className="text-[#e5ad1d]">★</span> : null}
                      {row.star ? " / " : ""}
                      {row.points}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-[8px] bg-[#d9dbe0] px-5 py-3 flex items-center justify-between">
                <p className="text-[11px] text-[#5f6064]">Showing 5 of 97 products</p>
                <div className="flex items-center gap-2">
                  <button className="h-7 px-3 rounded-[8px] border border-[#8f949d] bg-white text-[10px] text-[#5f6064]">Previous</button>
                  <button className="h-7 px-3 rounded-[8px] border border-[#86c490] bg-[#e6f8eb] text-[10px] text-[#1f9b57]">Next</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6 max-w-[1260px] mx-auto">
                <h1 className="text-[24px] lg:text-[26px] font-semibold text-[#1b1b1b]">Profile Settings</h1>
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    className="inline-flex items-center gap-2 h-8 px-4 rounded-[6px] bg-[#8ccf98] text-[#1b1b1b] text-[13px] font-semibold shadow-sm"
                  >
                    Edit <Edit3 size={15} />
                  </button>
                )}
              </div>

              <div className="space-y-8 max-w-[1260px] mx-auto">
                <div className="bg-white border border-[#d9d9d9] rounded-[6px] overflow-hidden">
                  <div className="h-[78px] bg-[#f3d58d] px-6 flex items-start pt-5 font-semibold text-[15px] text-[#1b1b1b]">
                    Merchant Profile
                  </div>
                  <div className="relative px-8 pb-7 pt-0">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-14 w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                      <Image src="/images/deal2.avif" alt="Merchant profile" fill className="object-cover" />
                    </div>
                    <div className="absolute left-1/2 translate-x-[28px] top-[24px] w-8 h-8 rounded-full bg-[#bdbdbd] border-2 border-white flex items-center justify-center text-white shadow-sm">
                      <Camera size={15} />
                    </div>

                    <div className="pt-20 space-y-5">
                      <div>
                        <label className="block text-[14px] font-semibold text-[#222] mb-2">Username</label>
                        {isEditMode ? (
                          <input value={formData.username} onChange={(e) => handleInputChange("username", e.target.value)} className="h-10 w-full rounded-[4px] bg-[#f3f3f6] px-3 text-[12px] text-[#3a3a3a] outline-none" />
                        ) : (
                          <div className="h-10 rounded-[4px] bg-[#f3f3f6] px-3 flex items-center text-[12px] text-[#3a3a3a]">{formData.username}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[14px] font-semibold text-[#222] mb-2">Phone Number</label>
                        {isEditMode ? (
                          <input value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="h-10 w-full rounded-[4px] bg-[#f3f3f6] px-3 text-[12px] text-[#3a3a3a] outline-none" />
                        ) : (
                          <div className="h-10 rounded-[4px] bg-[#f3f3f6] px-3 flex items-center text-[12px] text-[#3a3a3a]">{formData.phone}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[14px] font-semibold text-[#222] mb-2">Email</label>
                        {isEditMode ? (
                          <input value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="h-10 w-full rounded-[4px] bg-[#f3f3f6] px-3 text-[12px] text-[#3a3a3a] outline-none" />
                        ) : (
                          <div className="h-10 rounded-[4px] bg-[#f3f3f6] px-3 flex items-center text-[12px] text-[#3a3a3a]">{formData.email}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#d9d9d9] rounded-[6px] overflow-hidden">
                  <div className="h-[78px] bg-[#f3d58d] px-6 flex items-start pt-5 font-semibold text-[15px] text-[#1b1b1b]">
                    Shop Details
                  </div>
                  <div className="relative px-8 pb-7 pt-0">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-14 w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                      <Image src="/images/place2.avif" alt="Shop" fill className="object-cover" />
                    </div>
                    <div className="absolute left-1/2 translate-x-[28px] top-[24px] w-8 h-8 rounded-full bg-[#bdbdbd] border-2 border-white flex items-center justify-center text-white shadow-sm">
                      <Camera size={15} />
                    </div>

                    <div className="pt-20 space-y-5">
                      <div>
                        <label className="block text-[14px] font-semibold text-[#222] mb-2">Shop Name</label>
                        {isEditMode ? (
                          <input value={formData.shopName} onChange={(e) => handleInputChange("shopName", e.target.value)} className="h-10 w-full rounded-[4px] bg-[#f3f3f6] px-3 text-[12px] text-[#3a3a3a] outline-none" />
                        ) : (
                          <div className="h-10 rounded-[4px] bg-[#f3f3f6] px-3 flex items-center text-[12px] text-[#3a3a3a]">{formData.shopName}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[14px] font-semibold text-[#222] mb-3">Store Location</label>
                        <p className="text-[11px] text-[#666] mb-3">Select your store location on the map using search or pinpoint</p>
                        {isLoadingLocation ? (
                          <div className="bg-[#f3f3f6] rounded-[4px] p-4 text-[12px] text-[#666] flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-[#157a4f] border-t-transparent rounded-full animate-spin"></div>
                            Loading location...
                          </div>
                        ) : isEditMode ? (
                          <div className="space-y-3">
                            <StoreLocationMap 
                              location={storeLocation} 
                              onMapClick={() => setShowLocationPicker(true)}
                              isLoading={isSavingLocation}
                            />
                            <p className="text-[11px] text-[#157a4f] font-semibold">
                              📍 Current: {storeLocation.address}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <StoreLocationMap 
                              location={storeLocation} 
                              onMapClick={() => setIsEditMode(true)}
                              isLoading={false}
                            />
                            <div className="bg-[#f0f8f5] rounded-[4px] p-3 border border-[#157a4f]/20">
                              <p className="text-[11px] text-[#666] font-medium">📍 Current Location:</p>
                              <p className="text-[12px] font-semibold text-[#157a4f] mt-1">{storeLocation.address}</p>
                              <p className="text-[10px] text-[#999] mt-1">
                                Lat: {storeLocation.latitude?.toFixed(6)} | Lng: {storeLocation.longitude?.toFixed(6)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isEditMode && (
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={handleDiscard} className="h-10 px-5 rounded-[8px] bg-[#d8dbe2] text-[#222] text-[13px] font-semibold">
                      Discard Changes
                    </button>
                    <button type="button" onClick={handleSave} disabled={isSavingLocation} className="h-10 px-7 rounded-[8px] bg-[#efb02e] text-[#1f1f1f] text-[13px] font-semibold disabled:opacity-70 disabled:cursor-not-allowed">
                      {isSavingLocation ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}

                {saveMessage && (
                  <div className={`p-3 rounded-[8px] text-[12px] font-semibold ${
                    saveMessage.includes("success") 
                      ? "bg-[#dcfce7] text-[#166534]" 
                      : "bg-[#fee2e2] text-[#b91c1c]"
                  }`}>
                    {saveMessage}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Location Picker Modal */}
      <LocationPicker 
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={storeLocation && storeLocation.latitude ? {
          lat: storeLocation.latitude,
          lng: storeLocation.longitude,
        } : null}
      />

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
