"use client";

import React, { useMemo } from "react";
import ImageGallery, { GalleryImage } from "./ImageGallery";
import TweetRenderer from "./TweetRenderer";

interface GalleryRendererProps {
  htmlContent: string;
}

// Helper untuk mensterilkan & memformat URL Gambar agar tidak 404 / broken
function formatImageUrl(src: string): string {
  if (!src) return "";
  let clean = src.trim();

  if (clean.startsWith("data:image")) return clean;

  if (clean.startsWith("http://")) {
    clean = clean.replace("http://", "https://");
  }

  if (!clean.startsWith("https://")) {
    clean = clean.replace(/^\/+/, "");
    if (!clean.startsWith("storage/")) {
      clean = `storage/${clean}`;
    }
    return `https://dailydiction.id/${clean}`;
  }

  if (clean.includes("dailydiction.id/storage/http")) {
    return clean.replace(/https?:\/\/[^\/]+\/storage\/(https?:\/\/)/i, "\$1");
  }

  return clean;
}

// Helper untuk memperbarui semua tag <img> dalam string HTML dengan URL absolute
function formatHtmlImageSrc(html: string): string {
  if (!html) return "";
  return html.replace(
    /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi,
    (match, prefix, src, suffix) => {
      const cleanSrc = formatImageUrl(src);
      return `<img ${prefix}src="${cleanSrc}" ${suffix}>`;
    }
  );
}

export default function GalleryRenderer({ htmlContent }: GalleryRendererProps) {
  const mergedBlocks = useMemo(() => {
    if (!htmlContent) return [];

    // 1. Bersihkan sisa atribut tanpa merusak struktur HTML yang valid
    let cleanHtml = htmlContent
      .replace(/\s*target=["']?_blank["']?/gi, "")
      .replace(/\s*rel=["']?noopener(?:\s+noreferrer)?["']?/gi, "");

    // Normalisasi semua URL tag image di dalam HTML
    cleanHtml = formatHtmlImageSrc(cleanHtml);

    // 2. Regex mendeteksi tag gambar (<figure> atau <img>)
    const imgRegex =
      /<figure[^>]*>\s*<img\s+[^>]*?src=["']([^"']+)["'][^>]*?>\s*(?:<figcaption[^>]*>(.*?)<\/figcaption>)?\s*<\/figure>|<img\s+[^>]*?src=["']([^"']+)["'][^>]*?>/gi;

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
      const rawSrc = match[1] || match[3] || "";
      const imgSrc = formatImageUrl(rawSrc);
      const imgCaption = match[2] ? match[2].replace(/<[^>]+>/g, "").trim() : "";
      const rawTag = formatHtmlImageSrc(match[0]);

      if (!imgSrc) return;

      if (currentGroup.length === 0) {
        const textBefore = cleanHtml.substring(lastIdx, matchStart);
        if (textBefore) elements.push(textBefore);
        currentGroup.push({ src: imgSrc, caption: imgCaption, raw: rawTag, end: matchEnd });
      } else {
        const prevEnd = currentGroup[currentGroup.length - 1].end;
        const textBetween = cleanHtml.substring(prevEnd, matchStart);

        // Cek apakah ada embed penting (YouTube, Twitter iframe, audio, video) di antara gambar
        const hasEmbed = /<iframe|<blockquote|<script|<video|<audio/i.test(textBetween);

        // Bersihkan string pembatas antar gambar dari elemen kosong bawaan editor
        const cleanedText = textBetween
          .replace(/<p[^>]*>\s*(?:&nbsp;|<br\s*\/?>)?\s*<\/p>/gi, "")
          .replace(/&nbsp;/gi, " ")
          .replace(/<br\s*\/?>|\s+/gi, "")
          .replace(/<[^>]+>/g, ""); // Hapus semua tag HTML untuk cek isi teks asli

        if (cleanedText.trim().length === 0 && !hasEmbed) {
          // Berdampingan langsung tanpa halangan teks bacaan / embed -> GABUNGKAN!
          currentGroup.push({ src: imgSrc, caption: imgCaption, raw: rawTag, end: matchEnd });
        } else {
          // Ada teks bacaan / iframe di antaranya -> PISAHKAN GAMBAR KE POSISI ASLINYA!
          if (currentGroup.length >= 2) {
            elements.push({
              type: "gallery",
              images: currentGroup.map((img) => ({ src: img.src, caption: img.caption })),
            });
          } else {
            // Gambar cuma 1, render tag HTML gambar aslinya (berdiri sendiri)
            elements.push(currentGroup[0].raw);
          }

          if (textBetween) elements.push(textBetween);

          currentGroup = [{ src: imgSrc, caption: imgCaption, raw: rawTag, end: matchEnd }];
        }
      }
      lastIdx = matchEnd;
    });

    // Masukkan sisa grup gambar paling bawah
    if (currentGroup.length >= 2) {
      elements.push({
        type: "gallery",
        images: currentGroup.map((img) => ({ src: img.src, caption: img.caption })),
      });
    } else if (currentGroup.length === 1) {
      elements.push(currentGroup[0].raw);
    }

    if (lastIdx < cleanHtml.length) {
      elements.push(cleanHtml.substring(lastIdx));
    }

    // 3. MERGE kembali sisa pecahan HTML agar tidak ada TweetRenderer yang dipanggil dobel!
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

        return <TweetRenderer key={`content-block-${idx}`} htmlContent={blockText} />;
      })}
    </div>
  );
}