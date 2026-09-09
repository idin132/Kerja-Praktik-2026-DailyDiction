"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Ad {
  id: string | number;
  title?: string;
  banner_image?: string | null;
  image_url?: string | null;
  url_link?: string | null;
  link_url?: string | null;
  position?: string;
  type?: string;
}

interface AdCarouselProps {
  ads: Ad[];
  interval?: number;
  fallbackText?: string;
  dimensions?: string;
  objectFit?: "object-cover" | "object-contain";
}

function formatImageUrl(
  imageUrl: string | null | undefined,
  fallback: string = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
): string {
  if (!imageUrl || typeof imageUrl !== "string") return fallback;

  const clean = imageUrl.trim();

  if (clean.includes("/storage/http://") || clean.includes("/storage/https://")) {
    return clean.replace(/^https?:\/\/[^\/]+\/storage\/(https?:\/\/)/i, "$1");
  }

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  const cleanPath = clean.replace(/^\/+/, "");
  return `https://dailydiction.id/storage/${cleanPath}`;
}

export default function AdCarousel({
  ads,
  interval = 5000,
  fallbackText = "Space Iklan",
  dimensions = "300 x 250 px",
  objectFit = "object-contain",
}: AdCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!ads || ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, interval);

    return () => clearInterval(timer);
  }, [ads, interval]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? ads.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  if (!ads || ads.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4">
        <span className="absolute top-2 right-3 text-[9px] text-text-muted/50 font-mono border border-text-muted/20 px-1 rounded">
          Ad
        </span>
        <span className="text-xs font-mono text-text-muted">
          {fallbackText}
        </span>
        <span className="text-[10px] font-mono text-[#FFD700]/70 mt-1">
          {dimensions}
        </span>
      </div>
    );
  }

  const currentAd = ads[currentIndex];

  const rawImage = currentAd?.banner_image || currentAd?.image_url;
  const targetUrl = currentAd?.url_link || currentAd?.link_url || "#";

  return (
    <div className="relative w-full h-full group overflow-hidden flex items-center justify-center bg-black/20">
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-full flex items-center justify-center relative"
      >
        <img
          src={formatImageUrl(rawImage)}
          alt={currentAd?.title || "Iklan"}
          className={`w-full h-full ${objectFit} transition-all duration-500 ease-in-out group-hover:scale-105`}
        />
        
        <span className="absolute top-2 right-3 text-[9px] text-white bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded font-mono z-10">
          Ad {ads.length > 1 ? `(${currentIndex + 1}/${ads.length})` : ""}
        </span>
      </a>

      {ads.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Previous Ad"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Next Ad"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {ads.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx
                    ? "w-4 bg-[#FFD700]"
                    : "w-1.5 bg-white/50"
                }`}
                aria-label={`Go to ad ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}