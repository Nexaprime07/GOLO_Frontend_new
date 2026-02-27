"use client";

import AuthLayout from "./../../components/AuthLayout";
import { Mail, Lock, User, Phone, MapPin, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const quotes = [
    "Maximize your ROI with our AI-driven ad placement strategy.",
    "Real-time analytics that give you the edge over competitors.",
    "The simplest way to manage global ad campaigns in one place."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [accountType, setAccountType] = useState("user"); // user | merchant

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

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
              <div className="quote-mark">“</div>
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
                    className={`dot ${
                      currentIndex === index ? "active" : ""
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
              <div className="social-buttons">
                <button className="social-btn google">
                  <span className="icon">G</span> Google
                </button>
                <button className="social-btn facebook">
                  <span className="icon">f</span> Facebook
                </button>
                <button className="social-btn apple">
                  <span className="icon"></span> Apple
                </button>
              </div>
              <div className="divider">
                <span>
                  {accountType === "user"
                    ? "or sign up with"
                    : "Store Information"}
                </span>
              </div>

              {/* FORM SWITCH */}
              {accountType === "user" ? (
                <>
                  <div className="input-group">
                    <label>Name</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={18} />
                      <input type="text" placeholder="Enter your full name" />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Email</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={18} />
                      <input type="email" placeholder="Enter your email" />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Number</label>
                    <div className="input-wrapper">
                      <Phone className="input-icon" size={18} />
                      <input type="tel" placeholder="Enter your phone number" />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Create Password</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={18} />
                      <input
                        type="password"
                        placeholder="Create a strong password"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="input-group">
                    <label>Store Name</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={18} />
                      <input type="text" placeholder="Enter store name" />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Email</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={18} />
                      <input type="email" placeholder="Enter store email" />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>GST Number</label>
                    <div className="input-wrapper">
                      <FileText className="input-icon" size={18} />
                      <input type="text" placeholder="Enter GST number" />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Number</label>
                    <div className="input-wrapper">
                      <Phone className="input-icon" size={18} />
                      <input type="tel" placeholder="Enter contact number" />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Location</label>
                    <div className="input-wrapper">
                      <MapPin className="input-icon" size={18} />
                      <input type="text" placeholder="Enter store location" />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Create Password</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={18} />
                      <input
                        type="password"
                        placeholder="Create a strong password"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="terms-checkbox">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">
                  By clicking on "Continue", I agree{" "}
                  <span className="link">Terms</span> and{" "}
                  <span className="link">Privacy Policy</span>
                </label>
              </div>

              <Link href="/verify">
                <button className="continue-btn">Continue</button>
              </Link>

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