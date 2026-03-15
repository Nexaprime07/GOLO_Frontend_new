"use client";

import Link from "next/link";
import { X, Lock } from "lucide-react";

export default function AuthRequiredModal({ isOpen, onClose, title = "Login Required", description = "Please log in or register to continue.", redirectTo = "/" }) {
  if (!isOpen) return null;

  const loginHref = `/login?redirect=${encodeURIComponent(redirectTo)}`;
  const registerHref = `/register?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          aria-label="Close auth prompt"
        >
          <X size={18} />
        </button>

        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#157A4F]/10 text-[#157A4F]">
          <Lock size={22} />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <Link
            href={loginHref}
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl bg-[#157A4F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f5c3a]"
          >
            Login
          </Link>
          <Link
            href={registerHref}
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl border border-[#157A4F] px-4 py-3 text-sm font-semibold text-[#157A4F] transition hover:bg-[#157A4F]/5"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}