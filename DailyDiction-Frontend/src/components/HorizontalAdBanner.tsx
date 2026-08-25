"use client";

import React from "react";

interface AdvertisementItem {
  id: number;
  title: string;
  banner_image?: string;
  url_link?: string;
  is_active?: boolean;
}

interface HorizontalAdBannerProps {
  adData?: AdvertisementItem | null;
}

function formatImageUrl(
  imageUrl: string | null | undefined,
  fallback: string = ""
): string {
  if (!imageUrl) return fallback;

  if (imageUrl.includes("dailydiction.id/storage/")) {
    return imageUrl.replace(
      "https://dailydiction.id/storage/",
      "http://127.0.0.1:8000/storage/"
    );
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `http://127.0.0.1:8000/storage/${imageUrl}`;
}

export default function HorizontalAdBanner({ adData }: HorizontalAdBannerProps) {
  if (!adData || !adData.banner_image) {
    return (
      // Tinggi dipotong jadi h-[100px] atau md:h-[130px] biar pipih kayak area biru muda
      <div className="w-full overflow-hidden rounded-xl border border-dashed border-dark-border bg-dark-card/30 p-4 text-center relative h-[100px] md:h-[130px] flex flex-col items-center justify-center">
        <span className="absolute top-2 right-3 text-[10px] font-mono text-text-muted/50 border border-text-muted/20 px-1.5 py-0.5 rounded">
          ADVERTISEMENT
        </span>
        <span className="text-sm font-mono text-text-muted font-bold">
          SPACE IKLAN BANNER
        </span>
      </div>
    );
  }

  return (
    // Container dibuat rounded-xl biar pas
    <div className="w-full overflow-hidden rounded-xl border border-dark-border/40 bg-dark-card shadow-2xl relative group">
      <a
        href={adData.url_link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full relative"
      >
        <img
          src={formatImageUrl(adData.banner_image, "")}
          alt={adData.title || "Advertisement"}
          // KUNCI PERUBAHAN: Set fixed responsive height & object-cover
          className="w-full h-[100px] md:h-[130px] object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
        />
        <span className="absolute top-2 right-3 text-[9px] font-black tracking-widest text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
          AD
        </span>
      </a>
    </div>
  );
}