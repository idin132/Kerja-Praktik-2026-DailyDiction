"use client";

import React, { useMemo } from "react";
import ImageGallery, { GalleryImage } from "./ImageGallery";
import TweetRenderer from "./TweetRenderer";

interface GalleryRendererProps {
  htmlContent: string;
}

export default function GalleryRenderer({ htmlContent }: GalleryRendererProps) {
  const renderedBlocks = useMemo(() => {
    if (!htmlContent) return [];

    // 1. Bersihkan sisa atribut bocor dari CKEditor / TipTap
    const cleanHtml = htmlContent
      .replace(/target=["']?_blank["']?/gi, "")
      .replace(/rel=["']?noopener(?:\s+noreferrer)?["']?/gi, "")
      .replace(/["']\s*>/g, ">");

    if (typeof window === "undefined") {
      return [<TweetRenderer key="ssr-fallback" htmlContent={cleanHtml} />];
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanHtml, "text/html");
    const children = Array.from(doc.body.children);

    const blocks: React.ReactNode[] = [];
    let currentGallery: GalleryImage[] = [];

    const flushGallery = (keyPrefix: string) => {
      if (currentGallery.length >= 2) {
        // HANYA buat Galeri jika gambar berdampingan langsung >= 2
        blocks.push(
          <ImageGallery
            key={`gallery-${keyPrefix}-${blocks.length}`}
            images={[...currentGallery]}
          />
        );
      } else if (currentGallery.length === 1) {
        // Jika cuma 1 gambar (misal dipisah paragraf teks), render 1-per-1 biasa
        const img = currentGallery[0];
        blocks.push(
          <div key={`single-img-${keyPrefix}-${blocks.length}`} className="my-6">
            <img
              src={img.src}
              alt={img.caption || "Article Image"}
              className="w-full h-auto rounded-xl border border-dark-border"
            />
            {img.caption && (
              <p className="text-xs text-text-muted italic text-center mt-2">
                {img.caption}
              </p>
            )}
          </div>
        );
      }
      currentGallery = [];
    };

    children.forEach((el, index) => {
      const imgEl = el.tagName === "IMG" ? el : el.querySelector("img");
      const textContent = el.textContent?.trim() || "";
      const hasIframe = !!el.querySelector("iframe") || el.tagName === "IFRAME";

      if (imgEl) {
        // Jika ketemu gambar, kumpulkan ke grup gallery sementara
        const src = imgEl.getAttribute("src") || "";
        const figcaption = el.querySelector("figcaption");
        const caption = figcaption ? figcaption.textContent || "" : "";

        if (src) {
          currentGallery.push({ src, caption });
        }
      } else if (textContent.length === 0 && !hasIframe) {
        // Jika cuma elemen kosong (p kosong / br / nbsp) di antara gambar, abaikan
        return;
      } else {
        // KETEMU TEKS PARAGRAF / SUBJUDUL / VIDEO YOUTUBE:
        // Flush dulu gambar sebelum-sebelumnya (jadi galeri / foto tunggal)
        flushGallery(`block-${index}`);

        // Render elemen teks / tweet / video YouTube ini secara utuh di posisinya!
        blocks.push(
          <TweetRenderer
            key={`content-${index}`}
            htmlContent={el.outerHTML}
          />
        );
      }
    });

    // Flush sisa gambar di bagian paling akhir jika ada
    flushGallery("final");

    return blocks;
  }, [htmlContent]);

  if (!htmlContent) return null;

  return (
    <div className="rich-text-content prose prose-invert max-w-none text-text-primary leading-relaxed mb-8">
      {renderedBlocks}
    </div>
  );
}