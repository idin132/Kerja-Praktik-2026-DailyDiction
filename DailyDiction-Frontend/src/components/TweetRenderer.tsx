"use client";

import React, { Component, ReactNode, useEffect, useState } from "react";
import { Tweet } from "react-tweet";
import ReactDOM from "react-dom";

class SafeTweetBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn("React-Tweet error caught safely:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 my-2 rounded-lg border border-dark-border bg-dark-card/50 text-center text-xs font-mono text-text-muted">
          Gagal memuat Tweet (Embed diblokir atau Tweet telah dihapus)
        </div>
      );
    }
    return this.props.children;
  }
}

export default function TweetRenderer({ htmlContent }: { htmlContent: string }) {
  const [tweetSlots, setTweetSlots] = useState<{ id: string; elementId: string }[]>([]);
  const [parsedHtml, setParsedHtml] = useState<string>("");

  useEffect(() => {
    if (!htmlContent) return;

    // 1. Bersihkan sisa string atribut iframe terpotong/bocor dari DB
    let clean = htmlContent.replace(
      /class="w-full h-full border-0 rounded-xl"[^>]*>/gi,
      ""
    );

    const slots: { id: string; elementId: string }[] = [];
    let counter = 0;

    // 2. Ganti URL / Embed Tweet langsung di tempatnya (Presisi tanpa merusak struktur HTML)
    const processedHtml = clean.replace(
      /<p[^>]*>\s*<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"]*"[^>]*>.*?<\/a>\s*<\/p>|<p[^>]*>\s*https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*\s*<\/p>|<figure[^>]*>\s*<oembed[^>]*url=["']https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"']*["'][^>]*>\s*<\/oembed>\s*<\/figure>|https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*/gi,
      (match, id1, id2, id3, id4) => {
        const tweetId = id1 || id2 || id3 || id4;
        if (!tweetId) return match;

        const slotId = `tweet-slot-${counter++}`;
        slots.push({ id: tweetId, elementId: slotId });
        return `<div id="${slotId}" class="tweet-placeholder my-2 flex justify-center"></div>`;
      }
    );

    setTweetSlots(slots);
    setParsedHtml(processedHtml);
  }, [htmlContent]);

  return (
    <div className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary text-justify leading-relaxed mb-8">
      {/* Render HTML utama sekaligus dalam 1 div untuk menjaga margin paragraf alami */}
      <div dangerouslySetInnerHTML={{ __html: parsedHtml }} />

      {/* Inject React Tweet Component langsung ke placeholder-nya */}
      {tweetSlots.map((slot) => {
        const targetEl = typeof document !== "undefined" ? document.getElementById(slot.elementId) : null;
        if (!targetEl) return null;

        return ReactDOM.createPortal(
          <div className="w-full max-w-lg not-prose">
            <SafeTweetBoundary>
              <Tweet id={slot.id} />
            </SafeTweetBoundary>
          </div>,
          targetEl
        );
      })}

      <style jsx global>{`
        /* 1. SINKRONISASI HEADING & WARNA BACKEND CKEDITOR */
        .rich-text-content.prose h1,
        .rich-text-content.prose h2,
        .rich-text-content.prose h3,
        .rich-text-content.prose h4 {
          color: #FFD700;
          font-weight: 900 !important;
          line-height: 1.2 !important;
          margin-top: 1.5em !important;
          margin-bottom: 0.5em !important;
        }

        /* INLINE/SPAN COLOR DARI CKEDITOR (MERAH, SKYBLUE, DLL) TETAP DIPRIORITASKAN */
        .rich-text-content [style*="color"] {
          color: inherit !important;
        }

        .rich-text-content p {
          line-height: 1.25 !important;
          text-align: justify !important;
          margin-bottom: 1em !important;
        }

        /* 2. PAKSA SPASI DAN HEIGHT TWEET MENJADI METODE COMPACT */
        .tweet-placeholder {
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
          min-height: 0 !important;
          height: auto !important;
        }

        .tweet-placeholder div[class*="react-tweet-container"],
        .tweet-placeholder [class*="react-tweet"],
        .tweet-placeholder article {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          min-height: 0 !important;
        }

        .react-tweet-theme {
          --tweet-container-margin: 0 !important;
        }
      `}</style>
    </div>
  );
}