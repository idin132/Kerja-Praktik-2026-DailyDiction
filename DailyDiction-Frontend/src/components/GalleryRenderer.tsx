"use client";

import React, { useMemo } from "react";
import ImageGallery, { GalleryImage } from "./ImageGallery";
import TweetRenderer from "./TweetRenderer";

interface GalleryRendererProps {
  htmlContent: string;
}

export default function GalleryRenderer({ htmlContent }: GalleryRendererProps) {
  const mergedBlocks = useMemo(() => {
    if (!htmlContent) return [];

    // 1. Bersihkan sisa atribut bocor dari editor
    const cleanHtml = htmlContent
      .replace(/target=["']?_blank["']?/gi, "")
      .replace(/rel=["']?noopener(?:\s+noreferrer)?["']?/gi, "")
      .replace(/["']\s*>/g, ">");

    // 2. Regex untuk mendeteksi tag <figure><img> atau <img>
    const imgRegex = /<figure[^>]*>\s*<img\s+[^>]*?src=["']([^"']+)["'][^>]*?>\s*(?:<figcaption[^>]*>(.*?)<\/figcaption>)?\s*<\/figure>|<img\s+[^>]*?src=["']([^"']+)["'][^>]*?>/gi;

    const matches = Array.from(cleanHtml.matchAll(imgRegex));

    if (matches.length === 0) {
      return [cleanHtml];
    }

    const elements: (string | { type: "gallery"; images: GalleryImage[] })[] = [];
    let lastIdx = 0;
    let currentGroup: { src: string; caption: string; raw: string; end: number }[] = [];

    matches.forEach((match) => {
      const matchStart = match.index ?? 0;
      const matchEnd = matchStart + match[0].length;
      const imgSrc = match[1] || match[3] || "";
      const imgCaption = match[2] ? match[2].replace(/<[^>]+>/g, "").trim() : "";

      if (!imgSrc) return;

      if (currentGroup.length === 0) {
        const textBefore = cleanHtml.substring(lastIdx, matchStart);
        if (textBefore) elements.push(textBefore);
        currentGroup.push({ src: imgSrc, caption: imgCaption, raw: match[0], end: matchEnd });
      } else {
        const prevEnd = currentGroup[currentGroup.length - 1].end;
        const textBetween = cleanHtml.substring(prevEnd, matchStart);

        // Bersihkan jarak antar gambar dari spasi, enter, atau elemen kosong bawaan TipTap
        const cleanedText = textBetween
          .replace(/<p[^>]*>\s*(?:&nbsp;|<br\s*\/?>)?\s*<\/p>/gi, "")
          .replace(/&nbsp;/gi, " ")
          .replace(/<br\s*\/?>|\s+/gi, "")
          .replace(/<[^>]+>/g, ""); // Hapus semua tag HTML

        if (cleanedText.trim().length === 0) {
          // Jika BENAR-BENAR KOSONG (berdampingan langsung), gabungkan ke grup!
          currentGroup.push({ src: imgSrc, caption: imgCaption, raw: match[0], end: matchEnd });
        } else {
          // Ada "halangan" (teks paragraf, twitter link, dll), kunci grup sebelumnya
          if (currentGroup.length >= 2) {
            elements.push({
              type: "gallery",
              images: currentGroup.map((img) => ({ src: img.src, caption: img.caption })),
            });
          } else {
            // Jika cuma 1 gambar, biarkan tetap jadi HTML gambar tunggal (tidak di-group)
            elements.push(currentGroup[0].raw);
          }
          
          if (textBetween) elements.push(textBetween);
          
          // Mulai grup baru
          currentGroup = [{ src: imgSrc, caption: imgCaption, raw: match[0], end: matchEnd }];
        }
      }
      lastIdx = matchEnd;
    });

    // Masukkan sisa grup gambar terakhir
    if (currentGroup.length >= 2) {
      elements.push({
        type: "gallery",
        images: currentGroup.map((img) => ({ src: img.src, caption: img.caption })),
      });
    } else if (currentGroup.length === 1) {
      elements.push(currentGroup[0].raw);
    }

    // Masukkan sisa teks HTML paling bawah
    if (lastIdx < cleanHtml.length) {
      elements.push(cleanHtml.substring(lastIdx));
    }

    // 3. MERGE ulang pecahan string HTML agar TweetRenderer tidak terpanggil berulang kali
    const finalBlocks: (string | { type: "gallery"; images: GalleryImage[] })[] = [];
    for (const el of elements) {
      if (typeof el === "string") {
        const lastFinalBlock = finalBlocks[finalBlocks.length - 1];
        if (typeof lastFinalBlock === "string") {
          finalBlocks[finalBlocks.length - 1] += el;
        } else {
          finalBlocks.push(el);
        }
      } else {
        finalBlocks.push(el);
      }
    }

    return finalBlocks;
  }, [htmlContent]);

  if (!htmlContent) return null;

  return (
    <div className="rich-text-content prose prose-invert max-w-none text-text-primary leading-relaxed mb-8">
      {mergedBlocks.map((item, idx) => {
        if (typeof item === "object" && item.type === "gallery") {
          return <ImageGallery key={`gallery-${idx}`} images={item.images} />;
        }

        const blockText = String(item || "").trim();
        if (!blockText) return null;

        // Render string HTML sisanya dalam 1 komponen agar widget eksternal seperti Twitter/YouTube aman
        return <TweetRenderer key={`content-block-${idx}`} htmlContent={blockText} />;
      })}
    </div>
  );
}