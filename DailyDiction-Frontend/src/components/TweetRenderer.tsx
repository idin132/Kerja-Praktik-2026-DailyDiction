"use client";

import React, { Component, ReactNode } from "react";
import { Tweet } from "react-tweet";

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
  if (!htmlContent) return null;

  // 1. Bersihkan sisa string iframe bocor
  let clean = htmlContent.replace(
    /class="w-full h-full border-0 rounded-xl"[^>]*>/gi,
    ""
  );

  // 2. Bersihkan tag <p> dan <figure> yang membungkus link Twitter agar tidak meninggalkan space raksasa
  clean = clean.replace(
    /<figure[^>]*>\s*<oembed[^>]*url=["'](https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/\d+[^"']*)["'][^>]*>\s*<\/oembed>\s*<\/figure>/gi,
    "$1"
  );
  clean = clean.replace(
    /<p[^>]*>\s*(https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\s<]+)\s*<\/p>/gi,
    "$1"
  );
  clean = clean.replace(
    /<p[^>]*>\s*(<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/\d+"[^>]*>.*?<\/a>)\s*<\/p>/gi,
    "$1"
  );

  const marker = "___TWEET_ID_";
  const markerEnd = "___";

  // 3. Ekstrak Tweet ID & ganti dengan marker
  const replacedHtml = clean.replace(
    /<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"]*"[^>]*>.*?<\/a>|<oembed[^>]*url=["']https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"']*["'][^>]*>\s*<\/oembed>|https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*/gi,
    (match, id1, id2, id3) => {
      const tweetId = id1 || id2 || id3;
      return `${marker}${tweetId}${markerEnd}`;
    }
  );

  // 4. Split HTML menjadi bagian teks & bagian Tweet ID
  const parts = replacedHtml.split(new RegExp(`(${marker}\\d+${markerEnd})`, "g"));

  return (
    <div className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary text-justify leading-relaxed mb-8">
      {parts.map((part, index) => {
        if (part.startsWith(marker) && part.endsWith(markerEnd)) {
          const tweetId = part.replace(marker, "").replace(markerEnd, "");
          return (
            <div
              key={`tweet-${index}-${tweetId}`}
              className="tweet-container my-3 flex w-full justify-center not-prose"
            >
              <div className="w-full max-w-lg">
                <SafeTweetBoundary>
                  <Tweet id={tweetId} />
                </SafeTweetBoundary>
              </div>
            </div>
          );
        }

        // Render bagian HTML biasa (teks paragraf, judul, dll)
        if (!part.trim()) return null;

        return (
          <div
            key={`html-${index}`}
            dangerouslySetInnerHTML={{ __html: part }}
          />
        );
      })}

      <style jsx global>{`
        /* SINKRONISASI WARNA DENGAN CKEDITOR BACKEND */
        .rich-text-content.prose h1,
        .rich-text-content.prose h2,
        .rich-text-content.prose h3,
        .rich-text-content.prose h4 {
          font-weight: 900 !important;
          line-height: 1.2 !important;
          margin-top: 1.5em !important;
          margin-bottom: 0.5em !important;
          text-align: justify;
        }

        /* INLINE STYLE COLOR DARI BACKEND SELALU DIPRIORITASKAN */
        .rich-text-content [style*="color"] {
          color: inherit !important;
        }

        .rich-text-content p {
          line-height: 1.25 !important;
          text-align: justify !important;
          margin-bottom: 1em !important;
        }

        /* PERBAIKAN SPASI TWEET EMBED */
        .tweet-container {
          pointer-events: auto !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
        }

        .tweet-container [class*="react-tweet"],
        .tweet-container article {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }

        .react-tweet-theme {
          --tweet-container-margin: 0 !important;
        }
      `}</style>
    </div>
  );
}