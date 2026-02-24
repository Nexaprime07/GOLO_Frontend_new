"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Search, MapPin, User, X } from "lucide-react";

export default function Navbar({
  searchQuery = "",
  setSearchQuery = () => {},
}) {
  const [location, setLocation] = useState("Kolhapur");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

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

  return (
    <header className="theme-footer shadow-sm sticky top-0 z-50 border-b border-gray-200">
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
        <div className="hidden md:flex items-center gap-5 flex-1 mx-12 max-w-4xl">

          {/* SEARCH */}
          <div className="flex-[2] flex items-center rounded-full px-5 h-11 shadow-sm nav-input">
            <Search
              size={18}
              className="mr-2"
              style={{ color: "var(--color-text-muted)" }}
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search listings..."
              className="flex-1 outline-none text-sm bg-transparent text-black placeholder-gray-500 focus:outline-none"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
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
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Location"
                className="w-full outline-none text-sm bg-transparent text-black placeholder-gray-500 focus:outline-none"
              />

              {location && (
                <button
                  onClick={() => {
                    setLocation("");
                    setShowSuggestions(false);
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
                {locations.map((place, index) => (
                  <div key={index}>
                    <div
                      onClick={() => {
                        setLocation(place.city);
                        setShowSuggestions(false);
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
            <Link href="/post-ad" className="hover:opacity-80 transition">
              Post Your Ad
            </Link>
            <Link href="/chats" className="hover:opacity-80 transition">
              Chats
            </Link>
          </nav>

          {/* PROFILE ICON */}
<Link href="/profile">
  <div
    className="w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer bg-white"
    style={{ color: "var(--color-primary)" }}
  >
    <User size={18} />
  </div>
</Link>
        </div>
      </div>
    </header>
  );
}