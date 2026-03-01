"use client";

import Link from "next/link";
import { deleteAd } from "../lib/api";
import { useState } from "react";

/**
 * Template-aware AdCard for My Ads page.
 * templateId: 1 = Multiple images (big), 2 = Single image, 3 = Text only
 */
export default function AdCard({ ad, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!ad) return null;

  const { adId, _id, title, price, createdAt, images = [], description, templateId = 2, category } = ad;
  // Use custom adId for API calls, _id for URL if adId not present
  const apiId = adId || _id;
  const linkId = adId || _id;

  const primaryImage = !imgError && images?.[0] && !images[0].includes("placehold.co")
    ? images[0]
    : null;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
    : "";

  const handleDelete = async () => {
    if (!apiId) return;
    if (!confirm("Are you sure you want to delete this ad?")) return;
    setIsDeleting(true);
    try {
      await deleteAd(apiId);
      if (onDelete) onDelete(apiId);
    } catch {
      alert("Failed to delete ad. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.13)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"}
    >
      {/* Image — only for template 1 or 2 */}
      {templateId !== 3 && (
        <Link href={`/product/${linkId}`} style={{ display: "block" }}>
          <div style={{ height: "180px", background: "#f3f4f6", overflow: "hidden" }}>
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={title}
                onError={() => setImgError(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{
                width: "100%", height: "100%", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", color: "#9ca3af", gap: "8px"
              }}>
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span style={{ fontSize: "12px" }}>No Image</span>
              </div>
            )}
          </div>
        </Link>
      )}

      {/* Body */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Category badge */}
        {category && (
          <span style={{
            fontSize: "11px", fontWeight: 600, color: "#157A4F",
            background: "#e6f4ee", borderRadius: "20px", padding: "2px 10px",
            display: "inline-block", marginBottom: "6px", width: "fit-content"
          }}>
            {category}
          </span>
        )}

        <span style={{
          fontSize: "11px", fontWeight: 600, color: "#22c55e",
          background: "#dcfce7", borderRadius: "20px", padding: "2px 8px",
          display: "inline-block", marginBottom: "8px", width: "fit-content"
        }}>
          ● Active
        </span>

        <Link href={`/product/${linkId}`} style={{ textDecoration: "none" }}>
          <h3 style={{
            fontSize: "15px", fontWeight: 700, color: "#111827",
            margin: "0 0 4px", lineHeight: "1.3",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
          }}>
            {title}
          </h3>
        </Link>

        {/* For text-only template, show description snippet */}
        {templateId === 3 && description && (
          <p style={{
            fontSize: "13px", color: "#6b7280", margin: "4px 0 8px",
            overflow: "hidden", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical"
          }}>
            {description}
          </p>
        )}

        <div style={{ fontSize: "16px", fontWeight: 700, color: "#157A4F", marginBottom: "4px" }}>
          ₹{price?.toLocaleString("en-IN") || "0"}
        </div>
        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>
          Posted: {formattedDate}
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
          <Link href={`/product/${linkId}`} style={{ flex: 1, textDecoration: "none" }}>
            <button style={{
              width: "100%", padding: "8px 0", borderRadius: "10px",
              border: "1.5px solid #157A4F", background: "transparent",
              color: "#157A4F", fontWeight: 600, fontSize: "13px", cursor: "pointer"
            }}>
              👁 View
            </button>
          </Link>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              flex: 1, padding: "8px 0", borderRadius: "10px",
              border: "1.5px solid #ef4444", background: "transparent",
              color: "#ef4444", fontWeight: 600, fontSize: "13px",
              cursor: isDeleting ? "not-allowed" : "pointer",
              opacity: isDeleting ? 0.6 : 1
            }}
          >
            {isDeleting ? "⏳" : "🗑 Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
