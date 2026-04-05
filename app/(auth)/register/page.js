"use client";

import AuthLayout from "./../../components/AuthLayout";
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import SocialButtons from "../../components/SocialButtons";

const MERCHANT_CATEGORIES = [
  {
    name: "Food & Restaurants",
    subcategories: ["Restaurants", "Cafes", "Cloud Kitchens", "Food Delivery Menus"],
  },
  {
    name: "Home Services",
    subcategories: ["Cleaning", "Plumbing", "Electrical", "Appliance Repair", "Maintenance"],
  },
  {
    name: "Beauty & Wellness",
    subcategories: ["Salon", "Spa", "Grooming", "Personal Care Services"],
  },
  {
    name: "Healthcare & Medical",
    subcategories: ["Hospitals", "Clinics", "Pharmacies", "Diagnostics"],
  },
  {
    name: "Hotels & Accommodation",
    subcategories: ["Hotels", "Lodges", "Stays", "Room Bookings"],
  },
  {
    name: "Shopping & Retail",
    subcategories: ["Local Shops", "Groceries", "Fashion", "Electronics", "Products"],
  },
  {
    name: "Education & Training",
    subcategories: ["Schools", "Coaching", "Institutes", "Skill Development"],
  },
  {
    name: "Real Estate",
    subcategories: ["Property Buying", "Property Selling", "Renting"],
  },
  {
    name: "Events & Entertainment",
    subcategories: ["Event Planners", "Photographers", "DJs", "Venues"],
  },
  {
    name: "Professional Services",
    subcategories: ["Legal", "CA", "Consulting", "Freelance Services"],
  },
  {
    name: "Automotive Services",
    subcategories: ["Car Repair", "Bike Repair", "Servicing", "Rentals"],
  },
  {
    name: "Home Improvement",
    subcategories: ["Interior Design", "Painting", "Carpentry", "Renovation"],
  },
  {
    name: "Fitness & Sports",
    subcategories: ["Gyms", "Yoga", "Personal Trainers", "Sports Facilities"],
  },
  {
    name: "Daily Needs & Utilities",
    subcategories: ["Laundry", "Water Supply", "Gas", "Essential Services"],
  },
  {
    name: "Local Businesses & Vendors",
    subcategories: ["General Business Listings", "B2B", "B2C", "Marketplace/IndiaMART Style"],
  },
];

export default function RegisterPage() {
  const quotes = [
    "Maximize your ROI with our AI-driven ad placement strategy.",
    "Real-time analytics that give you the edge over competitors.",
    "The simplest way to manage global ad campaigns in one place."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [accountType, setAccountType] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // User form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Merchant form fields
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [storeSubCategory, setStoreSubCategory] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [storePassword, setStorePassword] = useState("");

  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const selectedCategory = MERCHANT_CATEGORIES.find((category) => category.name === storeCategory);
  const availableSubcategories = selectedCategory?.subcategories || [];

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate based on account type
    if (accountType === "user") {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError("Name, email, and password are required.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    } else {
      if (!storeName.trim() || !storeEmail.trim() || !storeCategory || !storeSubCategory || !storePassword.trim()) {
        setError("Store name, email, category, sub category, and password are required.");
        return;
      }
      if (storePassword.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    setIsLoading(true);
    try {
      // Helper to format phone number to E.164 (satisfy backend IsPhoneNumber)
      const formatPhone = (p) => {
        if (!p) return undefined;
        let cleaned = p.replace(/\D/g, ''); // Remove non-digits
        if (cleaned.length === 10) return `+91${cleaned}`; // Default to India 
        return p.startsWith('+') ? p : `+${cleaned}`; // Ensure it starts with +
      };

      const registrationData = accountType === "user"
        ? {
          name,
          email,
          password,
          phone: formatPhone(phone),
          accountType: "user",
        }
        : {
          name: storeName,
          email: storeEmail,
          password: storePassword,
          phone: formatPhone(contactNumber),
          accountType: "merchant",
          storeName,
          storeEmail,
          storeCategory,
          storeSubCategory,
          contactNumber: formatPhone(contactNumber),
          storeLocation,
        };

      await register(registrationData);
      if (accountType === "user" && typeof window !== "undefined") {
        localStorage.setItem("golo_pending_first_login_email", email.trim().toLowerCase());
      }
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      if (err.data?.message?.includes("phone")) {
        setError("Invalid phone number format. Please include country code (e.g., +91).");
      } else {
        setError(
          err.data?.message || "Registration failed. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="login-page-wrapper">
        {/* Logo Section */}
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <div className="logo-dot green"></div>
            <div className="logo-dot red"></div>
            <div className="logo-dot yellow"></div>
          </div>
          <span className="logo-text">GOLO</span>
        </div>

        <div className="login-content-grid">
          {/* LEFT SIDE */}
          <div className="login-left">
            <div className="testimonial-section">
              <div className="quote-mark">&ldquo;</div>
              <div className="yellow-square-icon">G</div>

              <div className="quote-container">
                <p className="quote-text" key={currentIndex}>
                  {quotes[currentIndex]}
                </p>
              </div>

              <div className="pagination-dots">
                <span
                  className="chevron"
                  onClick={() =>
                    setCurrentIndex(
                      (currentIndex - 1 + quotes.length) % quotes.length
                    )
                  }
                >
                  ‹
                </span>
                {quotes.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${currentIndex === index ? "active" : ""
                      }`}
                    onClick={() => setCurrentIndex(index)}
                  ></span>
                ))}
                <span
                  className="chevron"
                  onClick={() =>
                    setCurrentIndex((currentIndex + 1) % quotes.length)
                  }
                >
                  ›
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="login-right">
            <div className="card-bg-decoration top"></div>
            <div className="card-bg-decoration bottom"></div>

            <div className="login-card">
              <h2>
                {accountType === "user"
                  ? "Join GOLO Network Group"
                  : "Register Your Store"}
              </h2>

              <p className="subtitle">
                {accountType === "user"
                  ? "Grow Smarter With Every Ad. Join Free"
                  : "Expand Your Business With GOLO"}
              </p>

              {/* TOGGLE */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "25px"
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    background: "#F3F4F6",
                    borderRadius: "999px",
                    padding: "4px",
                    width: "100%",
                    maxWidth: "300px"
                  }}
                >
                  {/* Sliding Background */}
                  <div
                    style={{
                      position: "absolute",
                      top: "4px",
                      left: accountType === "user" ? "4px" : "50%",
                      width: "calc(50% - 4px)",
                      height: "calc(100% - 8px)",
                      background: "#F59E0B",
                      borderRadius: "999px",
                      transition: "all 0.3s ease"
                    }}
                  ></div>

                  <div
                    onClick={() => setAccountType("user")}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "8px 0",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      zIndex: 1,
                      color:
                        accountType === "user" ? "#fff" : "#6B7280"
                    }}
                  >
                    User
                  </div>

                  <div
                    onClick={() => setAccountType("merchant")}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "8px 0",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      zIndex: 1,
                      color:
                        accountType === "merchant" ? "#fff" : "#6B7280"
                    }}
                  >
                    Merchant
                  </div>
                </div>
              </div>

              {/* Social Buttons */}
              <SocialButtons redirectPath="/" />
              <div className="divider">
                <span>
                  {accountType === "user"
                    ? "or sign up with"
                    : "Store Information"}
                </span>
              </div>

              <form onSubmit={handleRegister}>
                {/* Error / Success Messages */}
                {error && (
                  <p style={{ color: "red", fontSize: "13px", marginBottom: "15px", textAlign: "center" }}>
                    {error}
                  </p>
                )}
                {success && (
                  <p style={{ color: "#157A4F", fontSize: "13px", marginBottom: "15px", textAlign: "center" }}>
                    {success}
                  </p>
                )}

                {/* FORM SWITCH */}
                {accountType === "user" ? (
                  <>
                    <div className="input-group">
                      <label>Name</label>
                      <div className="input-wrapper">
                        <User className="input-icon" size={18} />
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => { setName(e.target.value); setError(""); }}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Email</label>
                      <div className="input-wrapper">
                        <Mail className="input-icon" size={18} />
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Number</label>
                      <div className="input-wrapper">
                        <Phone className="input-icon" size={18} />
                        <input
                          type="tel"
                          placeholder="Enter your phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Create Password</label>
                      <div className="input-wrapper">
                        <Lock className="input-icon" size={18} />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        />
                        <div onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                          {showPassword ? <Eye className="input-icon-right" size={18} /> : <EyeOff className="input-icon-right" size={18} />}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="input-group">
                      <label>Store Name</label>
                      <div className="input-wrapper">
                        <User className="input-icon" size={18} />
                        <input
                          type="text"
                          placeholder="Enter store name"
                          value={storeName}
                          onChange={(e) => { setStoreName(e.target.value); setError(""); }}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Email</label>
                      <div className="input-wrapper">
                        <Mail className="input-icon" size={18} />
                        <input
                          type="email"
                          placeholder="Enter store email"
                          value={storeEmail}
                          onChange={(e) => { setStoreEmail(e.target.value); setError(""); }}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Category</label>
                      <div className="input-wrapper">
                        <User className="input-icon" size={18} />
                        <select
                          value={storeCategory}
                          onChange={(e) => {
                            setStoreCategory(e.target.value);
                            setStoreSubCategory("");
                            setError("");
                          }}
                        >
                          <option value="">Select category</option>
                          {MERCHANT_CATEGORIES.map((category) => (
                            <option key={category.name} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Sub Category</label>
                      <div className="input-wrapper">
                        <User className="input-icon" size={18} />
                        <select
                          value={storeSubCategory}
                          onChange={(e) => {
                            setStoreSubCategory(e.target.value);
                            setError("");
                          }}
                          disabled={!storeCategory}
                        >
                          <option value="">{storeCategory ? "Select sub category" : "Select category first"}</option>
                          {availableSubcategories.map((subCategory) => (
                            <option key={subCategory} value={subCategory}>
                              {subCategory}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Number</label>
                      <div className="input-wrapper">
                        <Phone className="input-icon" size={18} />
                        <input
                          type="tel"
                          placeholder="Enter contact number"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Location</label>
                      <div className="input-wrapper">
                        <MapPin className="input-icon" size={18} />
                        <input
                          type="text"
                          placeholder="Enter store location"
                          value={storeLocation}
                          onChange={(e) => setStoreLocation(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Create Password</label>
                      <div className="input-wrapper">
                        <Lock className="input-icon" size={18} />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={storePassword}
                          onChange={(e) => { setStorePassword(e.target.value); setError(""); }}
                        />
                        <div onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                          {showPassword ? <Eye className="input-icon-right" size={18} /> : <EyeOff className="input-icon-right" size={18} />}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="terms-checkbox">
                  <input type="checkbox" id="terms" />
                  <label htmlFor="terms">
                    By clicking on &quot;Continue&quot;, I agree{" "}
                    <span className="link">Terms</span> and{" "}
                    <span className="link">Privacy Policy</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="continue-btn"
                  disabled={isLoading}
                  style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
                >
                  {isLoading ? "Creating account..." : "Continue"}
                </button>
              </form>

              <div className="register-footer">
                Already have an account?{" "}
                <Link href="/login">
                  <span style={{ cursor: "pointer" }}>Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="dot-pattern"></div>
      </div>
    </AuthLayout>
  );
}