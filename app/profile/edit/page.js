"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { updateProfile, sendPasswordChangeOTP, verifyPasswordChangeOTP, changePasswordWithOTP } from "../lib/api";

export default function EditProfilePage() {
  const { user, isAuthenticated, loading: authLoading, refreshProfile } = useAuth();
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.profile?.phone || "",
      });
    }
  }, [user]);

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email is required");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Phone is required");
      return;
    }

    setLoading(true);
    try {
      const response = await updateProfile({
        name: formData.name,
        email: formData.email,
        profile: { phone: formData.phone },
      });

      if (response.success) {
        setSuccessMessage("Profile updated successfully!");
        await refreshProfile();
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage(response.message || "Failed to update profile");
      }
    } catch (error) {
      setErrorMessage(error.data?.message || error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    setOtpLoading(true);
    try {
      const response = await sendPasswordChangeOTP();
      if (response.success) {
        setOtpSent(true);
        setTimerSeconds(300); // 5 minutes
        setSuccessMessage("OTP sent to your registered phone number");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage(response.message || "Failed to send OTP");
      }
    } catch (error) {
      setErrorMessage(error.data?.message || error.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!otp.trim() || otp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await verifyPasswordChangeOTP(otp);
      if (response.success) {
        setOtpVerified(true);
        setSuccessMessage("OTP verified successfully!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage(response.message || "Invalid OTP");
      }
    } catch (error) {
      setErrorMessage(error.data?.message || error.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!passwordForm.newPassword) {
      setErrorMessage("New password is required");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await changePasswordWithOTP(otp, passwordForm.newPassword);
      if (response.success) {
        setSuccessMessage("Password changed successfully!");
        // Reset password form
        setPasswordForm({ newPassword: "", confirmPassword: "" });
        setOtp("");
        setOtpSent(false);
        setOtpVerified(false);
        setTimerSeconds(0);
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage(response.message || "Failed to change password");
      }
    } catch (error) {
      setErrorMessage(error.data?.message || error.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 text-[#157A4F] font-semibold text-sm hover:underline"
            >
              ← Back to Profile
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-2">Update your personal information and security settings</p>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-semibold">
              ✓ {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-semibold">
              ✗ {errorMessage}
            </div>
          )}

          {/* SECTION 1: Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#157A4F] focus:border-transparent transition"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#157A4F] focus:border-transparent transition"
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#157A4F] focus:border-transparent transition"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#157A4F] text-white py-3 rounded-xl font-semibold hover:bg-[#0f5c3a] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* SECTION 2: Change Password */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h2>
            <p className="text-gray-600 text-sm mb-6">
              For security, we'll send an OTP to your registered phone number before changing your password.
            </p>

            <form className="space-y-6">
              {/* Step 1: Send OTP */}
              {!otpSent && (
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#157A4F] text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Send OTP to Phone</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        We'll send a verification code to your registered phone number.
                      </p>
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={otpLoading}
                        className="bg-[#157A4F] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0f5c3a] transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {otpLoading ? "Sending..." : "Send OTP"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Verify OTP */}
              {otpSent && !otpVerified && (
                <div className="space-y-4">
                  {/* OTP Input Step */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-blue-50">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#157A4F] text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div className="flex-1 w-full">
                        <h3 className="font-semibold text-gray-900 mb-2">Verify OTP</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Enter the 6-digit code sent to your phone. Code expires in {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, "0")}
                        </p>
                        <input
                          type="text"
                          maxLength="6"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl font-bold text-lg text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[#157A4F] focus:border-transparent transition"
                          placeholder="000000"
                        />
                        <div className="flex gap-2 mt-4">
                          <button
                            type="button"
                            onClick={handleVerifyOTP}
                            disabled={otpLoading || otp.length !== 6}
                            className="flex-1 bg-[#157A4F] text-white py-2 rounded-lg font-semibold hover:bg-[#0f5c3a] transition disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {otpLoading ? "Verifying..." : "Verify OTP"}
                          </button>
                          <button
                            type="button"
                            onClick={handleSendOTP}
                            disabled={otpLoading || timerSeconds > 0}
                            className="flex-1 border border-[#157A4F] text-[#157A4F] py-2 rounded-lg font-semibold hover:bg-green-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {timerSeconds > 0 ? `Resend in ${timerSeconds}s` : "Resend OTP"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Enter New Password */}
              {otpVerified && (
                <div className="border border-gray-200 rounded-xl p-6 bg-green-50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#157A4F] text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="font-semibold text-gray-900 mb-4">Set New Password</h3>

                      {/* New Password */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#157A4F] focus:border-transparent transition"
                            placeholder="Enter new password (min 8 characters)"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#157A4F] focus:border-transparent transition"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                          </button>
                        </div>
                      </div>

                      {/* Change Button */}
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        disabled={passwordLoading}
                        className="w-full bg-[#157A4F] text-white py-3 rounded-xl font-semibold hover:bg-[#0f5c3a] transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {passwordLoading ? "Changing Password..." : "Change Password"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
