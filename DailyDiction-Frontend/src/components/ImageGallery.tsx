"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}

export default function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const mainImage = images[selectedIndex] || images[0];
  const maxThumbnails = 5;
  const thumbnails = images.slice(0, maxThumbnails);
  const remainingCount = images.length - maxThumbnails;

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full my-8 space-y-3 not-prose select-none">
      {/* GAMBAR UTAMA DENGAN BADGE TOTAL FOTO */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-dark-border bg-black/60 shadow-2xl group">
        <img
          src={mainImage.src}
          alt={mainImage.alt || `Gallery Image \${selectedIndex + 1}`}
          className="h-full w-full object-cover transition-all duration-300"
        />

        {/* Badge Foto Saat Ini */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-white border border-white/10">
          {selectedIndex + 1} / {images.length} IMAGES
        </div>

        {/* Tombol Zoom Lightbox */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-3 right-3 p-2 bg-black/70 backdrop-blur-md rounded-xl text-white hover:text-[#FFD700] hover:bg-black transition-all border border-white/10 opacity-0 group-hover:opacity-100"
          title="Perbesar Foto"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Caption jika ada */}
        {mainImage.caption && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-10">
            <p className="text-xs sm:text-sm text-gray-300 italic text-center font-sans">
              {mainImage.caption}
            </p>
          </div>
        )}
      </div>

      {/* THUMBNAILS BARISAN DI BAWAH (ALA IGN) */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {thumbnails.map((img, idx) => {
            const isLastThumbnail = idx === maxThumbnails - 1 && remainingCount > 0;
            const isSelected = selectedIndex === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-video w-full overflow-hidden rounded-xl border transition-all \${
                  isSelected
                    ? "border-[#FFD700] ring-2 ring-[#FFD700]/50 scale-95 opacity-100"
                    : "border-dark-border opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt || `Thumbnail \${idx + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* Indikator sisa foto (+X IMAGES) */}
                {isLastThumbnail && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-xs">
                    <span className="text-white text-xs sm:text-sm font-black font-mono tracking-wider text-center">
                      +{remainingCount + 1} IMAGES
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* MODAL LIGHTBOX FULLSCREEN */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
            <img
              src={mainImage.src}
              alt={mainImage.alt || "Fullscreen Image"}
              className="max-w-full max-h-[75vh] object-contain rounded-lg border border-white/10 shadow-2xl"
            />
            {mainImage.caption && (
              <p className="mt-4 text-sm text-gray-300 font-mono text-center max-w-2xl">
                {mainImage.caption}
              </p>
            )}
            <span className="mt-2 text-xs font-mono text-[#FFD700]">
              {selectedIndex + 1} / {images.length}
            </span>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </div>
  );
}