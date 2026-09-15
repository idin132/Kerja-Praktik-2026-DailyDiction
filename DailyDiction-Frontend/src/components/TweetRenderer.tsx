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

  // 1. Bersihkan sisa string atribut iframe terpotong
  let cleaned = htmlContent.replace(
    /class="w-full h-full border-0 rounded-xl"[^>]*>/gi,
    ""
  );

  const marker = "___TWEET_BLOCK_";
  const markerEnd = "___";

  // 2. REGEX SUPER: Hancurkan seluruh tag <p> atau <figure> pembungkus Tweet sampai ke akar
  // Agar tidak meninggalkan sisa baris kosong yang bikin spasi raksasa
  cleaned = cleaned.replace(
    /<p[^>]*>\s*<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"]*"[^>]*>.*?<\/a>\s*<\/p>/gi,
    (match, tweetId) => `${marker}${tweetId}${markerEnd}`
  );
  cleaned = cleaned.replace(
    /<p[^>]*>\s*https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*\s*<\/p>/gi,
    (match, tweetId) => `${marker}${tweetId}${markerEnd}`
  );
  cleaned = cleaned.replace(
    /<figure[^>]*>\s*<oembed[^>]*url=["']https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"']*["'][^>]*>\s*<\/oembed>\s*<\/figure>/gi,
    (match, tweetId) => `${marker}${tweetId}${markerEnd}`
  );
  cleaned = cleaned.replace(
    /<a[^>]*href="https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^"]*"[^>]*>.*?<\/a>|https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)[^\s<]*/gi,
    (match, tweetId1, tweetId2) => `${marker}${tweetId1 || tweetId2}${markerEnd}`
  );

  // 3. Pisahkan HTML dan Tweet dengan aman
  const regexSplit = new RegExp(`${marker}(\\d+)${markerEnd}`, "g");
  const parts: string[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regexSplit.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleaned.substring(lastIndex, match.index));
    }
    parts.push(`TWEET_ID:${match[1]}`);
    lastIndex = regexSplit.lastIndex;
  }
  if (lastIndex < cleaned.length) {
    parts.push(cleaned.substring(lastIndex));
  }

  return (
    <div className="animate-fade-up-2 rich-text-content prose prose-invert max-w-none text-text-primary text-justify leading-relaxed mb-8">
      {parts.map((part, index) => {
        if (part.startsWith("TWEET_ID:")) {
          const tweetId = part.split(":")[1];
          return (
            <div key={`tweet-${index}`} className="flex justify-center w-full my-2 not-prose">
              <div className="w-full max-w-lg">
                <SafeTweetBoundary>
                  <Tweet id={tweetId} />
                </SafeTweetBoundary>
              </div>
            </div>
          );
        }

        // Sapu bersih tag <p></p> kosong yang mungkin masih nyempil
        const cleanPart = part.replace(/^(\s*<p>\s*<\/p>\s*)+|(\s*<p>\s*<\/p>\s*)+$/gi, "").trim();
        if (!cleanPart) return null;

        return (
          <div
            key={`html-${index}`}
            dangerouslySetInnerHTML={{ __html: cleanPart }}
          />
        );
      })}

      <style jsx global>{`
        /* --- KUNCI WARNA HEADING --- */
        /* Hapus !important pada color agar span style dari CKEditor BISA MENANG */
        .rich-text-content.prose-invert h1,
        .rich-text-content.prose-invert h2,
        .rich-text-content.prose-invert h3,
        .rich-text-content.prose-invert h4 {
          color: #FFD700; 
          font-weight: 900 !important;
          line-height: 1.2 !important;
          margin-top: 1.5em !important;
          margin-bottom: 0.5em !important;
        }

        .rich-text-content p {
          line-height: 1.25 !important;
          text-align: justify !important;
          margin-bottom: 1em !important;
        }

        /* --- PAKSA EMBED TWEET RAPAT --- */
        .tweet-container {
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