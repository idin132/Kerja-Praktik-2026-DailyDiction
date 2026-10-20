"use client";

import React, { useMemo } from "react";
import ImageGallery, { GalleryImage } from "./ImageGallery";
import TweetRenderer from "./TweetRenderer";

interface GalleryRendererProps {
  htmlContent: string;
}

export default function GalleryRenderer({ htmlContent }: GalleryRendererProps) {
  const { galleryImages, finalHtml } = useMemo(() => {
    if (!htmlContent) return { galleryImages: [], finalHtml: "" };

    // 1. Bersihkan sisa atribut bocor dari editor
    let cleanHtml = htmlContent
      .replace(/target=["']?_blank["']?/gi, "")
      .replace(/rel=["']?noopener(?:\s+noreferrer)?["']?/gi, "")
      .replace(/["']\s*>/g, ">");

    // 2. Regex untuk menangkap tag <figure><img> atau <img>
    const imgRegex = /<figure[^>]*>\s*<img\s+[^>]*?src=["']([^"']+)["'][^>]*?>\s*(?:<figcaption[^>]*>(.*?)<\/figcaption>)?\s*<\/figure>|<img\s+[^>]*?src=["']([^"']+)["'][^>]*?>/gi;

    const matches = Array.from(cleanHtml.matchAll(imgRegex));

    if (matches.length === 0) {
      return { galleryImages: [], finalHtml: cleanHtml };
    }

    const images: GalleryImage[] = matches
      .map((m) => ({
        src: m[1] || m[3] || "",
        caption: m[2] ? m[2].replace(/<[^>]+>/g, "").trim() : "",
      }))
      .filter((img) => img.src);

    if (images.length >= 2) {
      // Ganti gambar PERTAMA dengan placeholder galeri
      let isFirstReplaced = false;
      cleanHtml = cleanHtml.replace(imgRegex, (match) => {
        if (!isFirstReplaced) {
          isFirstReplaced = true;
          return `<div id="GALLERY_PLACEHOLDER"></div>`;
        }
        // Hapus gambar ke-2, ke-3, ke-4 dst agar tidak terduplikasi
        return "";
      });

      // Bersihkan paragraf/figure kosong sisa penghapusan gambar
      cleanHtml = cleanHtml
        .replace(/<figure[^>]*>\s*<\/figure>/gi, "")
        .replace(/<p[^>]*>\s*(?:&nbsp;|<br\s*\/?>)?\s*<\/p>/gi, "");
    }

    return { galleryImages: images, finalHtml: cleanHtml };
  }, [htmlContent]);

  if (!htmlContent) return null;

  // Jika ada galeri foto (>= 2 gambar), split HTML tepat di placeholder agar galeri terpasang di posisi aslinya
  if (galleryImages.length >= 2 && finalHtml.includes('<div id="GALLERY_PLACEHOLDER"></div>')) {
    const parts = finalHtml.split('<div id="GALLERY_PLACEHOLDER"></div>');

    return (
      <div className="rich-text-content prose prose-invert max-w-none text-text-primary leading-relaxed mb-8">
        {/* Konten sebelum galeri (Paragraf atas jika ada) */}
        {parts[0] && <TweetRenderer htmlContent={parts[0]} />}

        {/* Galeri Foto tepat di posisi aslinya */}
        <ImageGallery images={galleryImages} />

        {/* Sisa konten setelah galeri (Paragraf bawah, Tweet, & Video YouTube) */}
        {parts[1] && <TweetRenderer htmlContent={parts[1]} />}
      </div>
    );
  }

  // Fallback biasa jika gambar < 2
  return (
    <div className="rich-text-content prose prose-invert max-w-none text-text-primary leading-relaxed mb-8">
      <TweetRenderer htmlContent={finalHtml} />
    </div>
  );
}