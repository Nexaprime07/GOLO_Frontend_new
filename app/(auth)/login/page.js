"use client";

import AuthLayout from "./../../components/AuthLayout";
import { Mail, Lock, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const quotes = [
    "Maximize your ROI with our AI-driven ad placement strategy.",
    "Real-time analytics that give you the edge over competitors.",
    "The simplest way to manage global ad campaigns in one place."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [accountType, setAccountType] = useState("user"); // user | merchant
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required before resetting password.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }

    setEmailError("");
    return true;
  };

  const handleForgotPassword = () => {
    if (validateEmail()) {
      router.push("/check-email");
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
                    className={`dot ${currentIndex === index ? "active" : ""}`}
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
                  ? "Welcome to GOLO Network Group"
                  : "Merchant Portal Login"}
              </h2>

              <p className="subtitle">
                {accountType === "user"
                  ? "Grow Smarter With Every Ad. Join Free"
                  : "Manage Your Store & Campaigns"}
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
                <span>or sign in with</span>
              </div>

              {/* Email */}
              <div className="input-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    placeholder={
                      accountType === "user"
                        ? "Enter your email"
                        : "Enter store email"
                    }
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                  />
                </div>

                {emailError && (
                  <p style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type="password"
                    placeholder="Enter your Password"
                  />
                  <EyeOff className="input-icon-right" size={18} />
                </div>
              </div>

              <div
                className="forgot-link"
                onClick={handleForgotPassword}
                style={{ cursor: "pointer" }}
              >
                Forgot Password ?
              </div>

              <div className="terms-checkbox">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">
                  By clicking on "Continue", I agree{" "}
                  <span className="link">Terms</span> and{" "}
                  <span className="link">Privacy Policy</span>
                </label>
              </div>

              <button className="continue-btn">Continue</button>

              <div className="register-footer">
                New to Ad Network Group?{" "}
                <Link href="/register">
                  <span>Register Now</span>
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