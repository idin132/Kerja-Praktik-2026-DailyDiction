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

  // Jika URL mengarah ke domain production, konversi ke local storage XAMPP
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
      <div className="my-8 w-full max-w-[1200px] mx-auto overflow-hidden rounded-2xl border border-dashed border-dark-border bg-dark-card/30 p-4 sm:p-6 text-center relative aspect-[1200/250] flex flex-col items-center justify-center">
        <span className="absolute top-3 right-4 text-[10px] font-mono text-text-muted/50 border border-text-muted/20 px-1.5 py-0.5 rounded">
          ADVERTISEMENT
        </span>
        <span className="text-sm font-mono text-text-muted font-bold">
          SPACE IKLAN BANNER UTAMA
        </span>
        <span className="text-xs font-mono text-brand-crimson/60 mt-1">
          1200 x 250 px (Kelola dari Admin Panel)
        </span>
      </div>
    );
  }

  return (
    <div className="my-8 w-full max-w-[1200px] mx-auto overflow-hidden rounded-2xl border border-dark-border/40 bg-dark-card shadow-2xl relative group">
      <a
        href={adData.url_link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full relative"
      >
        <img
          src={formatImageUrl(adData.banner_image, "")}
          alt={adData.title || "Advertisement"}
          className="w-full h-auto max-h-[250px] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
        />
        <span className="absolute top-3 right-4 text-[9px] font-black tracking-widest text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
          AD
        </span>
      </a>
    </div>
  );
}