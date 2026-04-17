import { Suspense } from "react";
import MerchantProductDetailsContent from "./merchant-product-details-content";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b] flex items-center justify-center" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="text-center">
        <div className="animate-spin inline-flex h-8 w-8 border-4 border-[#efb02e] border-t-[#157a4f] rounded-full"></div>
        <p className="mt-4 text-[#5a5a5a]">Loading product details...</p>
      </div>
    </div>
  );
}

export default function MerchantProductDetailsPage() {
  return (
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Suspense fallback={<LoadingFallback />}>
        <MerchantProductDetailsContent />
      </Suspense>
    </div>
  );
}
