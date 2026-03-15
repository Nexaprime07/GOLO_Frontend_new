"use client";
import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import { Search, MapPin, User, X, LogOut, ChevronDown, Shield, ShieldCheck, FileText } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import AuthRequiredModal from "./AuthRequiredModal";

function NavbarContent({
  searchQuery: externalSearchQuery = "",
  setSearchQuery: setExternalSearchQuery = () => { },
}) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  // Sync with external prop if it changes
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  useEffect(() => {
    setLocation(searchParams.get("location") || "");
  }, [searchParams]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setExternalSearchQuery(val);
  };

  const handleLocationChange = (val) => {
    setLocation(val);
    setShowSuggestions(true);
  };

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const locations = [
    { city: "Kolhapur", state: "Maharashtra" },
    { city: "Pune", state: "Maharashtra" },
    { city: "Mumbai", state: "Maharashtra" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const runSearch = (nextSearch = searchQuery, nextLocation = location) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    const trimmedSearch = nextSearch.trim();
    const trimmedLocation = nextLocation.trim();

    const params = new URLSearchParams();
    if (trimmedSearch) params.set("q", trimmedSearch);
    if (trimmedLocation) params.set("location", trimmedLocation);

    router.push(params.toString() ? `/choja?${params.toString()}` : "/choja");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      runSearch();
      setShowSuggestions(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
    router.push("/");
  };

  const requireAuth = (callback) => (event) => {
    if (!isAuthenticated) {
      if (event?.preventDefault) event.preventDefault();
      if (event?.stopPropagation) event.stopPropagation();
      setShowAuthPrompt(true);
      return;
    }

    if (callback) callback(event);
  };

  return (
    <>
      <header className="theme-footer shadow-sm sticky top-0 z-[9999] border-b border-gray-200">
        <div className="w-full px-8 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-3 cursor-pointer min-w-[180px]"
        >
          <div
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            G
          </div>
          <span className="text-xl font-semibold tracking-wide">
            GOLO
          </span>
        </Link>

        {/* CENTER */}
        <div className="hidden md:flex items-center gap-5 flex-1 mx-12 max-w-4xl" onClick={(e) => e.stopPropagation()}>

          {/* SEARCH */}
          <div className="flex-[2] flex items-center rounded-full px-5 h-11 shadow-sm nav-input" onClick={(e) => e.stopPropagation()}>
            <Search
              size={18}
              className="mr-2"
              style={{ color: "var(--color-text-muted)" }}
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={() => {
                if (!isAuthenticated) setShowAuthPrompt(true);
              }}
              placeholder="Search listings..."
              className="flex-1 outline-none text-sm bg-transparent text-black placeholder-gray-500 focus:outline-none"
              readOnly={!isAuthenticated}
            />

            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="ml-2 transition opacity-70"
                style={{ color: "var(--color-text-muted)" }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* LOCATION */}
          <div className="relative flex-[1]" ref={dropdownRef}>
            <div className="flex items-center rounded-full px-5 h-11 shadow-sm nav-input">
              <MapPin
                size={18}
                className="mr-2"
                style={{ color: "var(--color-text-muted)" }}
              />

              <input
                type="text"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => {
                  if (!isAuthenticated) {
                    setShowAuthPrompt(true);
                    return;
                  }
                  setShowSuggestions(true);
                }}
                placeholder="Location"
                className="w-full outline-none text-sm bg-transparent text-black placeholder-gray-500 focus:outline-none"
                readOnly={!isAuthenticated}
              />

              {location && (
                <button
                  onClick={() => {
                    setLocation("");
                    setShowSuggestions(false);
                    runSearch(searchQuery, "");
                  }}
                  className="ml-2 transition opacity-70"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* LOCATION DROPDOWN */}
            {showSuggestions && (
              <div className="absolute top-14 left-0 w-full rounded-xl shadow-lg py-2 z-50 bg-white border border-gray-200">
                {locations
                  .filter((place) => !location.trim() || place.city.toLowerCase().includes(location.trim().toLowerCase()))
                  .map((place, index) => (
                  <div key={index}>
                    <div
                      onClick={() => {
                        setLocation(place.city);
                        setShowSuggestions(false);
                        runSearch(searchQuery, place.city);
                      }}
                      className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
                    >
                      <MapPin
                        size={16}
                        style={{ color: "var(--color-primary)" }}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-black">
                          {place.city}
                        </span>
                        <span className="text-xs text-gray-500">
                          {place.state}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-8 min-w-[260px] justify-end">

          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/choja" className="hover:opacity-80 transition">
              Home
            </Link>
            <Link href="/post-ad" onClick={requireAuth()} className="hover:opacity-80 transition">
              Post Your Ad
            </Link>
            <Link href="/chats" onClick={requireAuth()} className="hover:opacity-80 transition">
              Chats
            </Link>
          </nav>

          {/* PROFILE / AUTH */}
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition bg-white"
                  style={{ color: "var(--color-primary)" }}
                >
                  {user?.name ? (
                    <span className="text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <ChevronDown size={14} className="text-gray-500" />
              </div>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute top-12 right-0 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[9999]">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <User size={16} /> My Profile
                  </Link>
                  <Link
                    href="/my-ads"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <FileText size={16} /> My Ads
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <ShieldCheck size={16} className="text-red-500" /> Wishlist
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#157A4F] hover:bg-green-50 transition border-t border-gray-100 mt-1"
                    >
                      <Shield size={16} /> Admin Dashboard
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuthPrompt(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer bg-white"
              style={{ color: "var(--color-primary)" }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer bg-white"
                style={{ color: "var(--color-primary)" }}
              >
                <User size={18} />
              </div>
            </button>
          )}
        </div>
        </div>
      </header>

      <AuthRequiredModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        title="Login or Register"
        description="Please log in or create an account to access GOLO listings, chats, posting, and search from the home page."
        redirectTo={pathname || "/"}
      />
    </>
  );
}

export default function Navbar(props) {
  return (
    <Suspense fallback={
      <header className="theme-footer shadow-sm sticky top-0 z-[9999] border-b border-gray-200 h-16">
        <div className="w-full px-8 h-16 bg-gray-50 animate-pulse" />
      </header>
    }>
      <NavbarContent {...props} />
    </Suspense>
  );
}