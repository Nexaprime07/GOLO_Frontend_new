"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getActiveHomepageBanners } from "../lib/api";

const staticSlides = [
  "/images/banner1.jpg",
  "/images/banner2.jpg",
  "/images/banner31.jpg",
];

export default function Hero() {
  const [slides, setSlides] = useState(staticSlides);
  const [current, setCurrent] = useState(0);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadHomepageBanners() {
      try {
        console.log('[Hero] Starting to fetch approved banners from API...');
        const res = await getActiveHomepageBanners(5);
        
        console.log('[Hero] API Response:', res);
        const bannerData = res?.data || [];
        console.log('[Hero] Banner data from API:', bannerData);
        
        const dynamicSlides = bannerData
          .map((item, idx) => {
            console.log(`[Hero] Banner ${idx}:`, { title: item?.bannerTitle, imageUrl: item?.imageUrl, status: item?.status });
            return item?.imageUrl;
          })
          .filter(Boolean);

        if (isMounted) {
          console.log(`[Hero] Successfully loaded ${dynamicSlides.length} approved banners from API`);
          console.log('[Hero] Dynamic slides:', dynamicSlides);
          
          // Combine dynamic and static banners (approved first, then static)
          const combinedSlides = [...dynamicSlides, ...staticSlides];
          console.log('[Hero] Combined slides (before slice):', combinedSlides);
          
          const finalSlides = combinedSlides.slice(0, 5);
          console.log('[Hero] Final slides (after slice to 5):', finalSlides);
          
          if (finalSlides.length > 0) {
            setSlides(finalSlides);
            setDebugInfo(`Showing ${finalSlides.length} slides: ${dynamicSlides.length} approved + ${finalSlides.length - dynamicSlides.length} static`);
            setCurrent(0);
          } else {
            setSlides(staticSlides);
            setDebugInfo("No slides available, showing defaults");
          }
        }
      } catch (error) {
        console.error('[Hero] Error loading approved banners:', error);
        console.error('[Hero] Error details:', {
          message: error?.message,
          status: error?.status,
          data: error?.data,
        });
        setDebugInfo(`Error: ${error?.message || "Failed to load banners"}`);
        if (isMounted) {
          setSlides(staticSlides);
        }
      }
    }

    loadHomepageBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto slide
  useEffect(() => {
    if (!slides.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides]);

  return (
    <section className="relative w-full overflow-hidden bg-[#F8F6F2]">

      {/* Carousel Wrapper */}
      <div className="relative w-full h-[420px] md:h-[520px]">

        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide}
              alt={`Slide ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}

        {/* Dark Overlay for premium look */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                current === index
                  ? "bg-[#F5B849] w-6"
                  : "bg-white/70"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}