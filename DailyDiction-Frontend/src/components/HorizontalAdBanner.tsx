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
      "https://dailydiction.id/storage/"
    );
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `https://dailydiction.id/storage/${imageUrl}`;
}

export default function HorizontalAdBanner({ adData }: HorizontalAdBannerProps) {
  if (!adData || !adData.banner_image) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-dashed border-dark-border bg-dark-card/30 p-4 text-center relative aspect-[7/1] sm:aspect-[8/1] flex flex-col items-center justify-center min-h-[70px]">
        <span className="absolute top-2 right-3 text-[10px] font-mono text-text-muted/50 border border-text-muted/20 px-1.5 py-0.5 rounded">
          ADVERTISEMENT
        </span>
        <span className="text-xs sm:text-sm font-mono text-text-muted font-bold">
          SPACE IKLAN BANNER
        </span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-dark-border/40 bg-dark-card shadow-2xl relative group">
      <a
        href={adData.url_link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full relative"
      >
        <img
          src={formatImageUrl(adData.banner_image, "")}
          alt={adData.title || "Advertisement"}
          /* KUNCI PERBAIKAN: w-full h-auto dan block agar banner utuh tanpa terpotong */
          className="w-full h-auto block object-contain transition-transform duration-500 group-hover:scale-[1.01]"
        />
        <span className="absolute top-2 right-3 text-[9px] font-black tracking-widest text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
          AD
        </span>
      </a>
    </div>
  );
}